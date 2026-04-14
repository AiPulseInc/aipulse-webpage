-- Migration: self_assessment_security_hardening
-- Addresses Supabase advisor lints from initial self_assessment migration:
--   - WARN function_search_path_mutable on set_updated_at
--   - WARN extension_in_public for citext
--   - INFO rls_enabled_no_policy on leads, payments (intentional: server-only, but advisor wants explicit policies documenting intent)

-- Fix 1: pin search_path on trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Fix 2: move citext extension out of public schema
create schema if not exists extensions;
alter extension citext set schema extensions;
alter table public.leads alter column email type extensions.citext;

-- Fix 3: explicit deny-all RLS policies on leads / payments
-- These tables are server-only (access only via secret API key, which bypasses RLS).
-- Anon and authenticated get explicit denial for self-documentation and advisor compliance.
create policy leads_deny_all_anon
on public.leads
as restrictive
for all
to anon, authenticated
using (false)
with check (false);

create policy payments_deny_all_anon
on public.payments
as restrictive
for all
to anon, authenticated
using (false)
with check (false);
