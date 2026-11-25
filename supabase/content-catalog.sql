-- Catalog content (products, systems, solutions, consulting, industries)
-- Run in Supabase SQL Editor after schema.sql / staff-dashboard.sql.

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  category text not null check (
    category in ('product', 'system', 'solution', 'consulting', 'industry')
  ),
  slug text not null,
  name text not null,
  short_description text not null,
  description text not null,
  image text not null,
  image_alt text not null,
  interest text check (
    interest is null or interest in (
      'products',
      'business-systems',
      'it-solutions',
      'consulting',
      'general'
    )
  ),
  highlights text[] not null default '{}',
  related_products text[] not null default '{}',
  related_systems text[] not null default '{}',
  related_solutions text[] not null default '{}',
  related_consulting text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category, slug)
);

create index if not exists content_items_category_sort_idx
  on public.content_items (category, sort_order);

create index if not exists content_items_published_idx
  on public.content_items (published);

alter table public.content_items enable row level security;

grant select on table public.content_items to anon, authenticated, service_role;
grant insert, update, delete on table public.content_items to authenticated, service_role;

drop policy if exists "Public can read published content" on public.content_items;
create policy "Public can read published content"
  on public.content_items
  for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Approved staff can manage content" on public.content_items;
create policy "Approved staff can manage content"
  on public.content_items
  for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "Service role full access content_items" on public.content_items;
create policy "Service role full access content_items"
  on public.content_items
  for all
  to service_role
  using (true)
  with check (true);

comment on table public.content_items is
  'Public catalog: products, systems, solutions, consulting and industries.';

-- Seed current site catalog (idempotent on category+slug).
insert into public.content_items (
  category,
  slug,
  name,
  short_description,
  description,
  image,
  image_alt,
  interest,
  highlights,
  related_products,
  related_systems,
  related_solutions,
  related_consulting,
  sort_order,
  published
)
values
  ('product', 'laptops', 'Laptops', 'Reliable business laptops designed for productivity and mobility.', 'ASAT Technologies supplies business-ready laptop solutions suited to office, field and executive environments. Our team helps organizations select configurations that balance performance, durability and total cost of ownership.', '/images/products/laptop.png', 'Business laptop computer', 'products', ARRAY['Business-oriented configurations', 'Performance for everyday productivity', 'Guidance on deployment and accessories'], '{}', '{}', '{}', '{}', 0, true),
  ('product', 'desktops', 'All-in-One Desktops', 'Space-efficient all-in-one desktops for modern workplaces.', 'All-in-one desktop systems help organizations deliver a clean desk environment without compromising computing capability. Ideal for reception, retail back office and corporate workstations.', '/images/products/aio-desktop.png', 'All-in-one desktop computer', 'products', ARRAY['Reduced cable clutter', 'Suitable for front-of-house and office use', 'Configurable for business workloads'], '{}', '{}', '{}', '{}', 1, true),
  ('product', 'printers', 'Printers', 'Document and receipt printing solutions for business operations.', 'From office document printing to specialized receipt and label workflows, ASAT Technologies helps businesses select printers that support reliable day-to-day operations.', '/images/products/printer.png', 'Business printer', 'products', ARRAY['Office and specialized printing options', 'Support for retail and back-office workflows', 'Enquiry-based product guidance'], '{}', '{}', '{}', '{}', 2, true),
  ('product', 'pos-machines', 'POS Machines', 'Point-of-sale terminals built for retail and hospitality counters.', 'POS machines form the hardware foundation of modern checkout experiences. We support organizations evaluating terminals that integrate with industry-focused POS software and peripherals.', '/images/products/pos-machine.png', 'Point-of-sale terminal', 'products', ARRAY['Counter-ready terminal options', 'Compatible with POS software ecosystems', 'Suitable for retail and hospitality'], '{}', '{}', '{}', '{}', 3, true),
  ('product', 'cash-drawers', 'Cash Drawers', 'Secure cash drawers for point-of-sale environments.', 'Cash drawers help retail and hospitality businesses manage cash securely at the point of sale. ASAT Technologies can advise on drawers that fit your POS setup and operational requirements.', '/images/products/cash-drawer.png', 'Point-of-sale cash drawer', 'products', ARRAY['Designed for POS counters', 'Supports secure cash handling', 'Compatible with common POS setups'], '{}', '{}', '{}', '{}', 4, true),
  ('product', 'scanners', 'Scanners', 'Barcode scanners for inventory, checkout and operations.', 'Barcode scanners improve speed and accuracy across checkout, stock-taking and warehouse workflows. Explore options suited to retail, pharmacy and general business use.', '/images/products/barcode-scanner.png', 'Barcode scanner', 'products', ARRAY['Checkout and inventory scanning', 'Supports operational efficiency', 'Guidance for the right form factor'], '{}', '{}', '{}', '{}', 5, true),
  ('system', 'microsoft-dynamics-365-business-central', 'Microsoft Dynamics 365 Business Central', 'End-to-end ERP with built-in AI, role-based workspaces and native Microsoft cloud integration.', 'Microsoft Dynamics 365 Business Central connects general ledger, cash flow, inventory, warehousing, purchasing, sales, project accounting and manufacturing on a single codebase. It includes Copilot assistance, workflow automation via Power Automate, and specialized AI agents such as expense, sales order and payables agents. Role Centers customize home screens and quick actions to match each user''s daily tasks. Native Microsoft integration works directly inside Outlook, Excel, Teams and Power BI, reducing app switching and manual data entry. The scalable cloud model is hosted by Microsoft with automatic biannual feature updates, managed security and modular growth from Essentials to Premium plans. Architecture expands through APIs, the Power Platform and third-party add-ons — including retail and hospitality extensions — as needs evolve.', '/images/systems/business-central.png', 'Enterprise business management system interface', 'business-systems', ARRAY['End-to-end finance, inventory, purchasing, sales and manufacturing', 'Built-in Copilot, Power Automate and specialized AI agents', 'Role-based workspaces tailored to daily tasks', 'Native Outlook, Excel, Teams and Power BI integration', 'Scalable Microsoft-hosted cloud with modular Essentials to Premium plans', 'Extensible via APIs, Power Platform and industry add-ons'], '{}', '{}', '{}', '{}', 0, true),
  ('system', 'retail-pos', 'Retail POS Systems', 'Retail POS linked to Business Central with offline capability, ZIMRA compliance and full audit trail.', 'ASAT Retail POS provides one source of truth linked to Microsoft Dynamics 365 Business Central. Sales sync automatically, stores can keep trading with offline POS functionality, and teams work with different permission levels, proper cash-up reports, ZIMRA-compliant FDMS, integrated swipe machines, a change solution and a full audit trail.', '/images/systems/retail-pos.png', 'Retail point-of-sale system', 'business-systems', ARRAY['One source of truth linked to Microsoft Dynamics Business Central', 'Automatic sales sync', 'Offline POS functionality', 'Role-based permissions', 'Proper cash-up reports', 'ZIMRA compliant (FDMS solution)', 'Integrated swipe machines', 'Change solution available', 'Full audit trail'], '{}', '{}', '{}', '{}', 1, true),
  ('system', 'pharmacy-pos', 'Pharmacy POS Systems', 'Pharmacy POS linked to Business Central with health-provider integration and ZIMRA compliance.', 'ASAT Pharmacy POS provides one source of truth linked to Microsoft Dynamics 365 Business Central and is fully integrated into health service providers. Sales sync automatically, pharmacies can continue trading offline, and operations are supported with permission controls, cash-up reports, ZIMRA-compliant FDMS, integrated swipe machines, a change solution and a full audit trail.', '/images/systems/pharmacy-pos.png', 'Pharmacy point-of-sale system', 'business-systems', ARRAY['One source of truth linked to Microsoft Dynamics Business Central', 'Fully integrated into health service providers', 'Automatic sales sync', 'Offline POS functionality', 'Role-based permissions', 'Proper cash-up reports', 'ZIMRA compliant (FDMS solution)', 'Integrated swipe machines', 'Change solution available', 'Full audit trail'], '{}', '{}', '{}', '{}', 2, true),
  ('system', 'restaurant-pos', 'Restaurant POS Systems', 'Restaurant POS linked to Business Central with tablet ordering, table management and offline support.', 'ASAT Restaurant POS provides one source of truth linked to Microsoft Dynamics 365 Business Central. It supports tablet ordering, table management, automatic sales sync, offline POS functionality, different permission levels, proper cash-up reports, ZIMRA-compliant FDMS and integrated swipe machines.', '/images/systems/restaurant-pos.png', 'Restaurant point-of-sale system', 'business-systems', ARRAY['One source of truth linked to Microsoft Dynamics Business Central', 'Tablet capability for ordering', 'Table management', 'Automatic sales sync', 'Offline POS functionality', 'Role-based permissions', 'Proper cash-up reports', 'ZIMRA compliant (FDMS solution)', 'Integrated swipe machines'], '{}', '{}', '{}', '{}', 3, true),
  ('system', 'electronic-label-solution', 'Electronic Label Solution', 'Electronic shelf labels for real-time price changes, stock insight and promotion visibility.', 'ASAT Electronic Label Solution enables real-time price changes on your shelves. Tags can display stock on hand and rate of sale to support ordering, flash to highlight products on promotion, and are available in different sizes to suit store layouts.', '/images/systems/electronic-label-solution.png', 'Smart supermarket tea and coffee aisle with electronic shelf labels', 'business-systems', ARRAY['Real-time price changes on your shelves', 'Stock on hand and rate of sale display to support ordering', 'Flashing tags to show products on promotion', 'Different sizes of price tags'], '{}', '{}', '{}', '{}', 4, true),
  ('solution', 'antivirus', 'Antivirus Solutions', 'Business-focused endpoint protection and malware prevention.', 'Antivirus and endpoint protection solutions help organizations reduce the risk of malware and related threats across workstations and devices. ASAT Technologies advises on business-oriented protection approaches that fit your infrastructure.', '/images/divisions/it-solutions-photo.png', 'Endpoint security and antivirus protection', 'it-solutions', ARRAY['Endpoint malware prevention', 'Business-focused protection options', 'Aligned with broader IT security planning'], '{}', '{}', '{}', '{}', 0, true),
  ('solution', 'firewalls', 'Firewalls', 'Network security and protection against unauthorized access.', 'Firewall solutions form a foundational layer of network security. ASAT Technologies helps businesses evaluate firewall approaches that protect connectivity while supporting operational requirements.', '/images/divisions/it-solutions-photo.png', 'Network firewall security', 'it-solutions', ARRAY['Unauthorized access protection', 'Network perimeter security', 'Supports secure business connectivity'], '{}', '{}', '{}', '{}', 1, true),
  ('solution', 'networking', 'Networking Solutions', 'Reliable connectivity, network equipment and business infrastructure.', 'Reliable networking underpins modern business systems and communications. ASAT Technologies supports organizations with networking solutions that keep people, devices and services connected.', '/images/solutions/network-server.png', 'Business network and server infrastructure', 'it-solutions', ARRAY['Business connectivity', 'Network equipment guidance', 'Infrastructure reliability focus'], '{}', '{}', '{}', '{}', 2, true),
  ('consulting', 'retail-consulting', 'Retail Consulting', 'Advisory support for retail operations, technology and process improvement.', 'Retail consulting from ASAT Technologies helps organizations align technology choices with store operations, inventory practices and customer experience goals.', '/images/divisions/consulting-photo.png', 'Retail business consulting discussion', 'consulting', ARRAY['Retail operations focus', 'Technology and process alignment', 'Practical implementation guidance'], '{}', '{}', '{}', '{}', 0, true),
  ('consulting', 'security-analysis', 'Security Analysis', 'Structured analysis to strengthen security posture and risk awareness.', 'Security analysis engagements help businesses understand exposure areas across systems and infrastructure, and prioritize practical improvements.', '/images/divisions/it-solutions-photo.png', 'Security analysis and risk assessment', 'consulting', ARRAY['Risk-aware assessment', 'Infrastructure and systems focus', 'Actionable improvement priorities'], '{}', '{}', '{}', '{}', 1, true),
  ('consulting', 'business-analytics', 'Business Analytics', 'Real-time dashboards, automated financial reporting and AI-powered analytics from a single source of truth.', 'We build real-time dashboards, automated financial reporting and AI-powered analytics that turn scattered spreadsheets and disconnected systems into a single source of executive truth — updated by the minute, not the month-end. Direct connections to ERPs, POS systems and accounting platforms (including Microsoft Dynamics 365 Business Central) via ODBC/API support scheduled and near-real-time incremental syncs with audit logging. A modelled warehouse moves data through staging, reporting and analytics layers instead of ad-hoc exports, with data quality checks and anomaly flags built into the pipeline itself.', '/images/divisions/consulting-photo.png', 'Business analytics and performance reporting', 'consulting', ARRAY['Real-time dashboards and automated financial reporting', 'AI-powered analytics for executive decision support', 'Direct ERP, POS and accounting connections via ODBC/API', 'Scheduled and near-real-time incremental syncs with audit logging', 'Modelled warehouse: staging → reporting → analytics', 'Data quality checks and anomaly flags in the pipeline'], '{}', '{}', '{}', '{}', 2, true),
  ('industry', 'retail', 'Retail and Supermarkets', 'Technology products, POS systems and consulting for retail operations.', 'ASAT Technologies supports retail and supermarket businesses with point-of-sale systems, hardware, IT infrastructure and retail consulting designed to improve operational efficiency.', '/images/divisions/business-systems-photo.png', 'Retail and supermarket technology environment', 'business-systems', '{}', ARRAY['pos-machines', 'cash-drawers', 'scanners', 'printers'], ARRAY['retail-pos', 'electronic-label-solution'], ARRAY['networking', 'antivirus'], ARRAY['retail-consulting', 'business-analytics'], 0, true),
  ('industry', 'pharmacy', 'Pharmacies', 'Pharmacy-focused POS, inventory-oriented technology and IT support.', 'Pharmacy businesses benefit from specialized POS systems, reliable hardware and secure IT infrastructure. ASAT Technologies helps pharmacies identify solutions suited to pharmaceutical operations.', '/images/systems/pharmacy-pos.png', 'Pharmacy technology and point-of-sale environment', 'business-systems', '{}', ARRAY['pos-machines', 'scanners', 'printers', 'laptops'], ARRAY['pharmacy-pos'], ARRAY['antivirus', 'firewalls', 'networking'], ARRAY['security-analysis', 'business-analytics'], 1, true),
  ('industry', 'hospitality', 'Restaurants and Hospitality', 'Restaurant POS, hardware and connectivity for hospitality venues.', 'Restaurants and hospitality operators rely on dependable POS technology, peripherals and network connectivity. ASAT Technologies provides solutions that support service quality and operational control.', '/images/systems/restaurant-pos.png', 'Restaurant and hospitality point-of-sale technology', 'business-systems', '{}', ARRAY['pos-machines', 'printers', 'cash-drawers'], ARRAY['restaurant-pos'], ARRAY['networking', 'antivirus'], ARRAY['retail-consulting', 'business-analytics'], 2, true),
  ('industry', 'corporate', 'Corporate Businesses', 'Enterprise systems, hardware, cybersecurity and consulting for organizations.', 'Corporate businesses need integrated technology spanning hardware, enterprise systems, secure infrastructure and advisory support. ASAT Technologies helps organizations modernize with a business-first approach.', '/images/divisions/products-photo.png', 'Corporate business technology environment', 'general', '{}', ARRAY['laptops', 'desktops', 'printers'], ARRAY['microsoft-dynamics-365-business-central'], ARRAY['antivirus', 'firewalls', 'networking'], ARRAY['security-analysis', 'business-analytics'], 3, true)
on conflict (category, slug) do update set
  name = excluded.name,
  short_description = excluded.short_description,
  description = excluded.description,
  image = excluded.image,
  image_alt = excluded.image_alt,
  interest = excluded.interest,
  highlights = excluded.highlights,
  related_products = excluded.related_products,
  related_systems = excluded.related_systems,
  related_solutions = excluded.related_solutions,
  related_consulting = excluded.related_consulting,
  sort_order = excluded.sort_order,
  published = excluded.published,
  updated_at = now();
