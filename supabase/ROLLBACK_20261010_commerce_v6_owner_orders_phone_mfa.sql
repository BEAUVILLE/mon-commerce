-- Emergency rollback for MON COMMERCE V6 — leaves historical data intact.
-- Use via reviewed migration if and only if real client-owner regressions demand it.
BEGIN;
DROP POLICY IF EXISTS "COMMERCE V6 phone verified for order reads" ON public.digiy_commerce_orders;
DROP POLICY IF EXISTS "COMMERCE V6 phone verified for order updates" ON public.digiy_commerce_orders;
DROP POLICY IF EXISTS "COMMERCE V6 phone verified for order deletes" ON public.digiy_commerce_orders;
DROP POLICY IF EXISTS "COMMERCE V6 phone verified for order items reads" ON public.digiy_commerce_order_items;
COMMIT;
