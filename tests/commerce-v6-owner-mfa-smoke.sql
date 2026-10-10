-- COMMERCE V6 — ALL DATA SYNTHETIC. Run after migration in disposable PG17.
-- Owner AAL1 must see NO customer orders and cannot change status/delete.
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',true);
SELECT set_config('app.synthetic_phone_aal2','no',true);
DO $test$
DECLARE n bigint;
BEGIN
 SELECT count(*) INTO n FROM public.digiy_commerce_orders;
 IF n<>0 THEN RAISE EXCEPTION 'AAL1_ORDER_PII_EXPOSED'; END IF;
 SELECT count(*) INTO n FROM public.digiy_commerce_order_items;
 IF n<>0 THEN RAISE EXCEPTION 'AAL1_CART_ITEMS_EXPOSED'; END IF;
 UPDATE public.digiy_commerce_orders SET status='confirmed';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>0 THEN RAISE EXCEPTION 'AAL1_ORDER_UPDATE_ALLOWED'; END IF;
 DELETE FROM public.digiy_commerce_orders;
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>0 THEN RAISE EXCEPTION 'AAL1_ORDER_DELETE_ALLOWED'; END IF;
END $test$;
ROLLBACK;

-- Owner AAL2 sees only their own order and items, and can still update own order.
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',true);
SELECT set_config('app.synthetic_phone_aal2','yes',true);
DO $test$
DECLARE n bigint;
BEGIN
 SELECT count(*) INTO n FROM public.digiy_commerce_orders;
 IF n<>1 THEN RAISE EXCEPTION 'OWNER_VERIFIED_CANNOT_READ_OWN_ORDER_OR_READS_ANOTHER'; END IF;
 SELECT count(*) INTO n FROM public.digiy_commerce_order_items;
 IF n<>1 THEN RAISE EXCEPTION 'OWNER_VERIFIED_CANNOT_READ_OWN_ITEMS_OR_READS_ANOTHER'; END IF;
 UPDATE public.digiy_commerce_orders SET status='confirmed';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>1 THEN RAISE EXCEPTION 'OWNER_VERIFIED_CANNOT_UPDATE_OWN_ORDER'; END IF;
END $test$;
ROLLBACK;

-- AAL2 for another Auth UID does not grant cross-tenant access.
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000003',true);
SELECT set_config('app.synthetic_phone_aal2','yes',true);
DO $test$ DECLARE n bigint;
BEGIN
 SELECT count(*) INTO n FROM public.digiy_commerce_orders;
 IF n<>0 THEN RAISE EXCEPTION 'NON_OWNER_READS_ORDERS'; END IF;
 SELECT count(*) INTO n FROM public.digiy_commerce_order_items;
 IF n<>0 THEN RAISE EXCEPTION 'NON_OWNER_READS_ORDER_ITEMS'; END IF;
END $test$;
ROLLBACK;

-- Public orders must remain creatable, both unsigned and signed in,
-- without being able to read their own or another client's order rows.
BEGIN;
SET LOCAL ROLE anon;
INSERT INTO public.digiy_commerce_orders(id,site_slug,status)
 VALUES('10000000-0000-4000-8000-000000000003','owned-shop','request');
ROLLBACK;

BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000003',true);
SELECT set_config('app.synthetic_phone_aal2','no',true);
INSERT INTO public.digiy_commerce_orders(id,site_slug,status)
 VALUES('10000000-0000-4000-8000-000000000004','owned-shop','request');
ROLLBACK;

-- Policy count and preserved public INSERT protection verified without PII.
DO $test$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM pg_policies
 WHERE schemaname='public' AND policyname LIKE 'COMMERCE V6 %' AND permissive='RESTRICTIVE';
 IF n<>4 THEN RAISE EXCEPTION 'MISSING_RESTRICTIVE_MFA_POLICIES'; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public'
 AND tablename='digiy_commerce_orders' AND policyname='COMMERCE public creates order requests') THEN
  RAISE EXCEPTION 'PUBLIC_CUSTOMER_ORDER_POLICY_REMOVED';
 END IF;
END $test$;
SELECT 'COMMERCE_V6_OWNER_AAL2_RLS_AND_PUBLIC_INSERT_OK' AS result;
