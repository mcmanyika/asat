-- Allow newly signed-up users to create their own pending staff profile row.
-- Prefer running supabase/staff-approval.sql for the full approval setup.

grant insert on table public.staff_profiles to authenticated;

drop policy if exists "Users can create own staff profile" on public.staff_profiles;
create policy "Users can create own staff profile"
  on public.staff_profiles
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and status = 'pending'
  );
