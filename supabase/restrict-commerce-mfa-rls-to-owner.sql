-- MON COMMERCE
-- Restringe les policies MFA globales au propriétaire réel du commerce.

alter policy "DIGIY owner phone MFA gate v1"
on public.digiy_commerce_sites
using (
  auth_user_id = auth.uid()
  and public.digiy_owner_mfa_gate()
)
with check (
  auth_user_id = auth.uid()
  and public.digiy_owner_mfa_gate()
);

alter policy "DIGIY owner phone MFA gate v1"
on public.digiy_commerce_products
using (
  public.digiy_owner_mfa_gate()
  and exists (
    select 1
    from public.digiy_commerce_sites s
    where s.slug = digiy_commerce_products.site_slug
      and s.auth_user_id = auth.uid()
      and s.is_active = true
  )
)
with check (
  public.digiy_owner_mfa_gate()
  and exists (
    select 1
    from public.digiy_commerce_sites s
    where s.slug = digiy_commerce_products.site_slug
      and s.auth_user_id = auth.uid()
      and s.is_active = true
  )
);
