-- ASAT Technologies — Supabase schema
-- Run this in the Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (
    type in ('contact', 'quote', 'demo', 'consultation')
  ),
  full_name text not null,
  company_name text not null,
  email text not null,
  telephone text not null,
  interest text not null check (
    interest in (
      'products',
      'business-systems',
      'it-solutions',
      'consulting',
      'general'
    )
  ),
  subject text,
  message text not null,
  privacy_consent boolean not null default false,
  status text not null default 'new' check (
    status in ('new', 'in_progress', 'closed')
  ),
  source text not null default 'website'
);

create index if not exists enquiries_created_at_idx
  on public.enquiries (created_at desc);

create index if not exists enquiries_status_idx
  on public.enquiries (status);

alter table public.enquiries enable row level security;

-- Table privileges required for PostgREST / API keys
grant usage on schema public to anon, authenticated, service_role;
grant insert on table public.enquiries to anon, authenticated, service_role;
grant select, update, delete on table public.enquiries to service_role;

-- Public website can create enquiries only.
drop policy if exists "Public can insert enquiries" on public.enquiries;
create policy "Public can insert enquiries"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (true);

-- Service role bypasses RLS, but keep an explicit policy for clarity if needed later.
drop policy if exists "Service role full access" on public.enquiries;
create policy "Service role full access"
  on public.enquiries
  for all
  to service_role
  using (true)
  with check (true);

comment on table public.enquiries is
  'Website enquiry submissions from contact, quote, demo, consultation forms and chatbot.';

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

create index if not exists feedback_created_at_idx
  on public.feedback (created_at desc);

create index if not exists feedback_status_idx
  on public.feedback (status);

alter table public.feedback enable row level security;

grant insert on table public.feedback to anon, authenticated, service_role;
grant select, update, delete on table public.feedback to service_role;

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

comment on table public.feedback is
  'Website and chatbot feedback submissions from visitors.';

-- Staff dashboard (auth + RLS for authenticated staff):
-- Run supabase/staff-dashboard.sql after creating Auth users.
-- Editable enquiry notify emails:
-- Run supabase/app-settings.sql
-- Per-staff enquiry email toggle:
-- Run supabase/staff-notify-emails.sql
-- Catalog content (products, systems, solutions, consulting, industries):
-- Run supabase/content-catalog.sql
