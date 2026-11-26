-- Invoice layout customization (Admin → Settings)
-- Requires app_settings from supabase/app-settings.sql.

insert into public.app_settings (key, value)
values (
  'invoice_layout',
  '{"companyName":"ASAT Technologies","companyEmail":"info@asattechnologies.com","companyPhone":"+263 78 840 2515","companyAddress":"","documentTitle":"INVOICE","accentColor":"#0B1628","logoPath":"/images/logo/asat-logo.png","showLogo":true,"headerStyle":"split","showStatus":true,"showDueDate":true,"showTax":true,"footerNote":"Thank you for your business.","defaultCurrency":"USD","defaultTaxRate":0}'
)
on conflict (key) do nothing;
