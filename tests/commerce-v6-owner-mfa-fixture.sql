-- COMMERCE V6 — PostgreSQL 17 disposable fixture. Synthetic data ONLY.
CREATE SCHEMA IF NOT EXISTS auth;
DO $roles$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
END $roles$;
GRANT USAGE ON SCHEMA public TO anon,authenticated;
GRANT USAGE ON SCHEMA auth TO anon,authenticated;
CREATE FUNCTION auth.uid() RETURNS uuid
 LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
-- In fixtures ONLY: simulate the already-existing production verification function.
CREATE FUNCTION public.digiy_owner_mfa_ok() RETURNS boolean
 LANGUAGE sql STABLE AS $$ SELECT coalesce(current_setting('app.synthetic_phone_aal2',true),'')='yes' $$;
CREATE TABLE public.digiy_commerce_sites(
 slug text PRIMARY KEY,
 auth_user_id uuid NOT NULL,
 is_active boolean NOT NULL,
 is_published boolean NOT NULL
);
CREATE TABLE public.digiy_commerce_orders(
 id uuid PRIMARY KEY,
 site_slug text NOT NULL,
 status text NOT NULL
);
CREATE TABLE public.digiy_commerce_order_items(
 id uuid PRIMARY KEY,
 order_id uuid NOT NULL,
 product_name text NOT NULL
);
ALTER TABLE public.digiy_commerce_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digiy_commerce_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digiy_commerce_order_items ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.digiy_commerce_sites TO anon,authenticated;
GRANT SELECT,UPDATE,DELETE,INSERT ON public.digiy_commerce_orders TO authenticated;
GRANT INSERT ON public.digiy_commerce_orders TO anon;
GRANT SELECT ON public.digiy_commerce_order_items TO authenticated;
CREATE POLICY "COMMERCE public reads published sites" ON public.digiy_commerce_sites
 FOR SELECT TO anon,authenticated USING(is_active=true AND is_published=true);
CREATE POLICY "COMMERCE owner reads own site" ON public.digiy_commerce_sites
 FOR SELECT TO authenticated USING(auth.uid()=auth_user_id);
CREATE POLICY "COMMERCE owner reads own orders" ON public.digiy_commerce_orders
 FOR SELECT TO authenticated USING (EXISTS (
 SELECT 1 FROM public.digiy_commerce_sites s WHERE s.slug=site_slug AND s.auth_user_id=auth.uid() AND s.is_active));
CREATE POLICY "COMMERCE owner updates own orders" ON public.digiy_commerce_orders
 FOR UPDATE TO authenticated USING(EXISTS (
 SELECT 1 FROM public.digiy_commerce_sites s WHERE s.slug=site_slug AND s.auth_user_id=auth.uid() AND s.is_active))
 WITH CHECK(EXISTS (
 SELECT 1 FROM public.digiy_commerce_sites s WHERE s.slug=site_slug AND s.auth_user_id=auth.uid() AND s.is_active));
CREATE POLICY "COMMERCE owner deletes own orders" ON public.digiy_commerce_orders
 FOR DELETE TO authenticated USING(EXISTS (
 SELECT 1 FROM public.digiy_commerce_sites s WHERE s.slug=site_slug AND s.auth_user_id=auth.uid() AND s.is_active));
CREATE POLICY "COMMERCE public creates order requests" ON public.digiy_commerce_orders
 FOR INSERT TO anon,authenticated WITH CHECK(status='request' AND EXISTS (
 SELECT 1 FROM public.digiy_commerce_sites s WHERE s.slug=site_slug AND s.is_active AND s.is_published));
CREATE POLICY "COMMERCE owner reads own order items" ON public.digiy_commerce_order_items
 FOR SELECT TO authenticated USING(EXISTS (
 SELECT 1 FROM public.digiy_commerce_orders o JOIN public.digiy_commerce_sites s ON s.slug=o.site_slug
 WHERE o.id=order_id AND s.auth_user_id=auth.uid() AND s.is_active));
INSERT INTO public.digiy_commerce_sites VALUES
 ('owned-shop','00000000-0000-4000-8000-000000000001',true,true),
 ('other-shop','00000000-0000-4000-8000-000000000002',true,true);
INSERT INTO public.digiy_commerce_orders VALUES
 ('10000000-0000-4000-8000-000000000001','owned-shop','request'),
 ('10000000-0000-4000-8000-000000000002','other-shop','request');
INSERT INTO public.digiy_commerce_order_items VALUES
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','synthetic item 1'),
 ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','synthetic item 2');
