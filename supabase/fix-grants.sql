-- Fix: permission denied for table enquiries
-- Run this once in the Supabase SQL Editor if inserts fail with code 42501.

grant usage on schema public to anon, authenticated, service_role;
grant insert on table public.enquiries to anon, authenticated, service_role;
grant select, update, delete on table public.enquiries to service_role;

alter table public.enquiries enable row level security;

drop policy if exists "Public can insert enquiries" on public.enquiries;
create policy "Public can insert enquiries"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Service role full access" on public.enquiries;
create policy "Service role full access"
  on public.enquiries
  for all
  to service_role
  using (true)
  with check (true);
