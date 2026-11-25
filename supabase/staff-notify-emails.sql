-- Per-staff enquiry email notification flag
-- Run in Supabase SQL Editor after staff-dashboard.sql / staff-approval.sql

alter table public.staff_profiles
  add column if not exists notify_on_enquiry boolean;

update public.staff_profiles
set notify_on_enquiry = false
where notify_on_enquiry is null;

alter table public.staff_profiles
  alter column notify_on_enquiry set default false;

alter table public.staff_profiles
  alter column notify_on_enquiry set not null;
