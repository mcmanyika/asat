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
