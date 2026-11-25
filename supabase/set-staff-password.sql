-- Set staff password for partsonmanyika@gmail.com
-- Run once in the Supabase SQL Editor, then delete or avoid committing this file.
-- Requires pgcrypto (already used by schema.sql).

create extension if not exists "pgcrypto";

update auth.users
set
  encrypted_password = crypt('Micahgomwe@1', gen_salt('bf')),
  updated_at = now()
where id = '42e5bb08-2626-4ca0-8f7e-22499cb1ea13'
  and email = 'partsonmanyika@gmail.com';
