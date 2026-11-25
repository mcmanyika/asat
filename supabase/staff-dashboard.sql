-- ASAT staff dashboard — run in Supabase SQL Editor after schema.sql / fix-grants.sql
-- 1) Creates staff_profiles with approval status
-- 2) Lets approved staff select/update enquiries + feedback
-- 3) New self-signups are pending until an approved admin confirms them

create table if not exists public.staff_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected')
  ),
  notify_on_enquiry boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.staff_profiles enable row level security;

create or replace function public.is_staff()
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
  );
$$;

revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to authenticated, service_role;

grant select, update on table public.staff_profiles to authenticated;
grant insert on table public.staff_profiles to authenticated;
grant insert, update, delete on table public.staff_profiles to service_role;

drop policy if exists "Staff can read own profile" on public.staff_profiles;
create policy "Staff can read own profile"
  on public.staff_profiles
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_staff());

drop policy if exists "Users can create own staff profile" on public.staff_profiles;
create policy "Users can create own staff profile"
  on public.staff_profiles
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and status = 'pending'
  );

drop policy if exists "Approved staff can update profiles" on public.staff_profiles;
create policy "Approved staff can update profiles"
  on public.staff_profiles
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "Service role full access staff_profiles" on public.staff_profiles;
create policy "Service role full access staff_profiles"
  on public.staff_profiles
  for all
  to service_role
  using (true)
  with check (true);

grant select, update on table public.enquiries to authenticated;
grant select, update on table public.feedback to authenticated;

drop policy if exists "Staff can select enquiries" on public.enquiries;
create policy "Staff can select enquiries"
  on public.enquiries
  for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Staff can update enquiries" on public.enquiries;
create policy "Staff can update enquiries"
  on public.enquiries
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "Staff can select feedback" on public.feedback;
create policy "Staff can select feedback"
  on public.feedback
  for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Staff can update feedback" on public.feedback;
create policy "Staff can update feedback"
  on public.feedback
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Bootstrap an approved admin (replace email after creating the Auth user):
-- insert into public.staff_profiles (user_id, email, full_name, status)
-- select id, email, 'ASAT Staff', 'approved'
-- from auth.users
-- where email = 'staff@asat-technologies.com'
-- on conflict (user_id) do update
-- set status = 'approved';
