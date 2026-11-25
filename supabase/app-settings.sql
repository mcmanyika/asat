-- App settings (editable from staff dashboard)
-- Run in Supabase SQL Editor.

create table if not exists public.app_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

alter table public.app_settings enable row level security;

grant select, insert, update on table public.app_settings to authenticated, service_role;
grant delete on table public.app_settings to service_role;

drop policy if exists "Approved staff can read settings" on public.app_settings;
create policy "Approved staff can read settings"
  on public.app_settings
  for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Approved staff can insert settings" on public.app_settings;
create policy "Approved staff can insert settings"
  on public.app_settings
  for insert
  to authenticated
  with check (public.is_staff());

drop policy if exists "Approved staff can update settings" on public.app_settings;
create policy "Approved staff can update settings"
  on public.app_settings
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "Service role full access app_settings" on public.app_settings;
create policy "Service role full access app_settings"
  on public.app_settings
  for all
  to service_role
  using (true)
  with check (true);

insert into public.app_settings (key, value)
values ('enquiry_notify_emails', '')
on conflict (key) do nothing;
