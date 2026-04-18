-- Migration: dns_scan
-- Description: A7 DNS enrichment — dodaj 3 kolumny do assessments dla
--              opcjonalnego pasywnego skanu domeny.
-- - domain: domena podana przez usera (nullable, opt-in)
-- - dns_scan_opt_out: true jeśli user świadomie zrezygnował (audit trail)
-- - dns_scan: parsed ScanData jsonb (nullable jeśli opt-out lub fail)
-- RLS: istniejące assessments_anon_insert WITH CHECK pokrywa nowe kolumny
--      (nie ma constraint na nie — dowolny INSERT z anon przejdzie).

alter table public.assessments
  add column domain text,
  add column dns_scan_opt_out boolean not null default false,
  add column dns_scan jsonb;

comment on column public.assessments.domain is
  'Optional company domain provided by user for DNS enrichment. Null if user opted out.';

comment on column public.assessments.dns_scan_opt_out is
  'True if user explicitly clicked "Rezygnuję" on DNS scan step. Distinguishes informed opt-out from missing data (backward compat for assessments before A7).';

comment on column public.assessments.dns_scan is
  'Parsed DNS scan result (ScanData shape). Null if opt-out OR scan failed.';
