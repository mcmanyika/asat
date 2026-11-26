-- Update invoice layout contact details to match the public site.
-- app_settings.value is text (JSON string).

update public.app_settings
set
  value = jsonb_set(
    jsonb_set(
      coalesce(nullif(value, '')::jsonb, '{}'::jsonb),
      '{companyEmail}',
      to_jsonb('info@asattechnologies.com'::text),
      true
    ),
    '{companyPhone}',
    to_jsonb('+263 78 840 2515'::text),
    true
  )::text,
  updated_at = now()
where key = 'invoice_layout';
