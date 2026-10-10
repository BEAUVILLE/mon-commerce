-- MON COMMERCE V6 · Protection SQL des commandes clients par téléphone vérifié.
-- Migration étroite, aucun changement de ligne, de GRANT, de RPC ou de commande.
-- Requiert déjà public.digiy_owner_mfa_ok() : AAL2 + facteur téléphone
-- correspond à private.digiy_owner_mfa_registry require_phone_mfa=true.
-- Critique : préserver les INSERT de commandes publiques, y compris Auth.
BEGIN;
DO $preflight$
BEGIN
 IF to_regclass('public.digiy_commerce_orders') IS NULL
    OR to_regclass('public.digiy_commerce_order_items') IS NULL
    OR to_regprocedure('public.digiy_owner_mfa_ok()') IS NULL THEN
  RAISE EXCEPTION 'COMMERCE_V6_MFA_PREFLIGHT_MISSING_DEPENDENCIES';
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_class WHERE oid='public.digiy_commerce_orders'::regclass AND relrowsecurity)
   OR NOT EXISTS (SELECT 1 FROM pg_class WHERE oid='public.digiy_commerce_order_items'::regclass AND relrowsecurity)
 THEN RAISE EXCEPTION 'COMMERCE_V6_RLS_MUST_ALREADY_BE_ENABLED'; END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public'
     AND tablename='digiy_commerce_orders' AND policyname='COMMERCE public creates order requests' AND cmd='INSERT')
  OR NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public'
     AND tablename='digiy_commerce_orders' AND policyname='COMMERCE owner reads own orders' AND cmd='SELECT')
  OR NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public'
     AND tablename='digiy_commerce_order_items' AND policyname='COMMERCE owner reads own order items' AND cmd='SELECT')
 THEN RAISE EXCEPTION 'COMMERCE_V6_ORIGINAL_POLICIES_NOT_RECOGNIZED'; END IF;
 IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public'
    AND tablename IN ('digiy_commerce_orders','digiy_commerce_order_items')
    AND policyname LIKE 'COMMERCE V6 %')
 THEN RAISE EXCEPTION 'COMMERCE_V6_ALREADY_APPLIED_REVIEW_FIRST'; END IF;
END $preflight$;
CREATE POLICY "COMMERCE V6 phone verified for order reads"
 ON public.digiy_commerce_orders AS RESTRICTIVE FOR SELECT TO authenticated
 USING ((select public.digiy_owner_mfa_ok()));
CREATE POLICY "COMMERCE V6 phone verified for order updates"
 ON public.digiy_commerce_orders AS RESTRICTIVE FOR UPDATE TO authenticated
 USING ((select public.digiy_owner_mfa_ok()))
 WITH CHECK ((select public.digiy_owner_mfa_ok()));
CREATE POLICY "COMMERCE V6 phone verified for order deletes"
 ON public.digiy_commerce_orders AS RESTRICTIVE FOR DELETE TO authenticated
 USING ((select public.digiy_owner_mfa_ok()));
CREATE POLICY "COMMERCE V6 phone verified for order items reads"
 ON public.digiy_commerce_order_items AS RESTRICTIVE FOR SELECT TO authenticated
 USING ((select public.digiy_owner_mfa_ok()));
DO $postflight$
BEGIN
 IF (SELECT count(*) FROM pg_policies WHERE schemaname='public'
  AND tablename IN ('digiy_commerce_orders','digiy_commerce_order_items')
  AND policyname LIKE 'COMMERCE V6 %' AND permissive='RESTRICTIVE')<>4
 THEN RAISE EXCEPTION 'COMMERCE_V6_POLICY_POSTFLIGHT_FAILED'; END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public'
     AND tablename='digiy_commerce_orders' AND policyname='COMMERCE public creates order requests' AND cmd='INSERT')
 THEN RAISE EXCEPTION 'COMMERCE_V6_CUSTOMER_INSERT_WAS_REMOVED'; END IF;
END $postflight$;
COMMIT;
