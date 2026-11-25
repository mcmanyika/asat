-- Staff approval gate
-- New signups stay pending until an approved admin confirms them.
-- Run in Supabase SQL Editor.

alter table public.staff_profiles
  add column if not exists status text;

update public.staff_profiles
set status = 'approved'
where status is null or status = '';

alter table public.staff_profiles
  alter column status set default 'pending';

alter table public.staff_profiles
  alter column status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'staff_profiles_status_check'
  ) then
    alter table public.staff_profiles
      add constraint staff_profiles_status_check
      check (status in ('pending', 'approved', 'rejected'));
  end if;
end $$;

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
