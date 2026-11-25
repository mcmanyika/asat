-- Invoicing module for approved staff
-- Run after staff-dashboard.sql (needs public.is_staff()).

create sequence if not exists public.invoice_number_seq start 1;

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  status text not null default 'draft' check (
    status in ('draft', 'sent', 'paid', 'void')
  ),
  customer_name text not null,
  customer_email text not null,
  customer_company text,
  customer_phone text,
  customer_address text,
  issue_date date not null default current_date,
  due_date date,
  currency text not null default 'USD',
  tax_rate numeric(6, 3) not null default 0,
  notes text,
  enquiry_id uuid references public.enquiries (id) on delete set null,
  subtotal numeric(14, 2) not null default 0,
  tax_amount numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  description text not null,
  quantity numeric(12, 3) not null default 1 check (quantity > 0),
  unit_price numeric(14, 2) not null default 0,
  line_total numeric(14, 2) not null default 0,
  sort_order integer not null default 0
);

create index if not exists invoices_status_idx on public.invoices (status);
create index if not exists invoices_created_at_idx on public.invoices (created_at desc);
create index if not exists invoices_enquiry_id_idx on public.invoices (enquiry_id);
create index if not exists invoice_items_invoice_id_idx on public.invoice_items (invoice_id, sort_order);

create or replace function public.next_invoice_number()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  seq_val bigint;
  year_part text := to_char(current_date, 'YYYY');
begin
  seq_val := nextval('public.invoice_number_seq');
  return 'INV-' || year_part || '-' || lpad(seq_val::text, 4, '0');
end;
$$;

revoke all on function public.next_invoice_number() from public;
grant execute on function public.next_invoice_number() to authenticated, service_role;

alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;

grant select, insert, update, delete on table public.invoices to authenticated, service_role;
grant select, insert, update, delete on table public.invoice_items to authenticated, service_role;
grant usage, select on sequence public.invoice_number_seq to authenticated, service_role;

drop policy if exists "Staff can select invoices" on public.invoices;
create policy "Staff can select invoices"
  on public.invoices for select to authenticated
  using (public.is_staff());

drop policy if exists "Staff can insert invoices" on public.invoices;
create policy "Staff can insert invoices"
  on public.invoices for insert to authenticated
  with check (public.is_staff());

drop policy if exists "Staff can update invoices" on public.invoices;
create policy "Staff can update invoices"
  on public.invoices for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "Staff can delete invoices" on public.invoices;
create policy "Staff can delete invoices"
  on public.invoices for delete to authenticated
  using (public.is_staff());

drop policy if exists "Service role full access invoices" on public.invoices;
create policy "Service role full access invoices"
  on public.invoices for all to service_role
  using (true) with check (true);

drop policy if exists "Staff can select invoice items" on public.invoice_items;
create policy "Staff can select invoice items"
  on public.invoice_items for select to authenticated
  using (public.is_staff());

drop policy if exists "Staff can insert invoice items" on public.invoice_items;
create policy "Staff can insert invoice items"
  on public.invoice_items for insert to authenticated
  with check (public.is_staff());

drop policy if exists "Staff can update invoice items" on public.invoice_items;
create policy "Staff can update invoice items"
  on public.invoice_items for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "Staff can delete invoice items" on public.invoice_items;
create policy "Staff can delete invoice items"
  on public.invoice_items for delete to authenticated
  using (public.is_staff());

drop policy if exists "Service role full access invoice items" on public.invoice_items;
create policy "Service role full access invoice items"
  on public.invoice_items for all to service_role
  using (true) with check (true);

comment on table public.invoices is
  'Internal staff invoices for customers (draft/sent/paid/void).';
comment on table public.invoice_items is
  'Line items belonging to an invoice.';
