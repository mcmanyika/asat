-- Superuser role for Settings access
-- Run after staff-dashboard.sql / app-settings.sql / landing-sections.sql

alter table public.staff_profiles
  add column if not exists role text not null default 'staff';

alter table public.staff_profiles
  drop constraint if exists staff_profiles_role_check;

alter table public.staff_profiles
  add constraint staff_profiles_role_check
  check (role in ('staff', 'superuser'));

create or replace function public.is_superuser()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_profiles
    where user_id = auth.uid()
      and status = 'approved'
      and role = 'superuser'
  );
$$;

revoke all on function public.is_superuser() from public;
grant execute on function public.is_superuser() to authenticated, service_role;

-- Settings writes: superusers only
drop policy if exists "Approved staff can insert settings" on public.app_settings;
drop policy if exists "Approved staff can update settings" on public.app_settings;
drop policy if exists "Superusers can insert settings" on public.app_settings;
drop policy if exists "Superusers can update settings" on public.app_settings;

create policy "Superusers can insert settings"
  on public.app_settings
  for insert
  to authenticated
  with check (public.is_superuser());

create policy "Superusers can update settings"
  on public.app_settings
  for update
  to authenticated
  using (public.is_superuser())
  with check (public.is_superuser());

-- Promote Partson Manyika to superuser
update public.staff_profiles
set role = 'superuser'
where email = 'partsonmanyika@gmail.com';
