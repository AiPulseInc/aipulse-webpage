-- A7+ — leadgen capture przy raporcie PDF.
-- Email + marketing consent zbierane w modal raport-request,
-- zapisywane przez UPDATE na istniejący assessment row.
--
-- Email nullable (assessment może istnieć bez raportu — user może nie kliknąć Pobierz).
-- Marketing consent default false dla bezpieczeństwa (jeśli ktoś forge'uje update bez tego pola).
-- RODO compliance: zgoda jest dobrowolna (opt-out, pre-checked w UI), zapisywana per assessment.

alter table public.assessments
  add column email text,
  add column marketing_consent boolean not null default false;

-- Indeks na email dla potencjalnego leadgen export (per-marketing-consent filter).
create index if not exists assessments_email_idx on public.assessments (email) where email is not null;

-- Indeks na marketing_consent=true dla quick filter "leady do newslettera".
create index if not exists assessments_marketing_idx on public.assessments (marketing_consent) where marketing_consent = true;
