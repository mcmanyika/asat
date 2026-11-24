-- Fix: permission denied for table enquiries / feedback
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

-- Feedback table (create if the original schema was applied before feedback existed)
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null default 'general' check (
    category in ('website', 'product', 'service', 'chat', 'general')
  ),
  rating integer check (rating is null or (rating >= 1 and rating <= 5)),
  full_name text,
  email text,
  message text not null,
  privacy_consent boolean not null default false,
  status text not null default 'new' check (
    status in ('new', 'reviewed', 'closed')
  ),
  source text not null default 'chatbot'
);

grant insert on table public.feedback to anon, authenticated, service_role;
grant select, update, delete on table public.feedback to service_role;

alter table public.feedback enable row level security;

drop policy if exists "Public can insert feedback" on public.feedback;
create policy "Public can insert feedback"
  on public.feedback
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Service role full access feedback" on public.feedback;
create policy "Service role full access feedback"
  on public.feedback
  for all
  to service_role
  using (true)
  with check (true);
