-- Landing page section visibility (editable from staff Settings)
-- Requires app_settings from supabase/app-settings.sql.

insert into public.app_settings (key, value)
values (
  'landing_sections',
  '{"hero":true,"companyIntroduction":true,"businessDivisions":true,"productCategories":true,"finalCta":true}'
)
on conflict (key) do nothing;

-- Public site needs to read this setting (staff already can via is_staff policies).
drop policy if exists "Public can read landing sections" on public.app_settings;
create policy "Public can read landing sections"
  on public.app_settings
  for select
  to anon, authenticated
  using (key = 'landing_sections');
