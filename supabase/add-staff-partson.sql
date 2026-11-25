-- Add / approve staff access for partsonmanyika@gmail.com
-- Run in the Supabase SQL Editor after staff-dashboard.sql / staff-approval.sql

insert into public.staff_profiles (user_id, email, full_name, status, role)
values (
  '42e5bb08-2626-4ca0-8f7e-22499cb1ea13',
  'partsonmanyika@gmail.com',
  'Partson Manyika',
  'approved',
  'superuser'
)
on conflict (user_id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  status = 'approved',
  role = 'superuser';
