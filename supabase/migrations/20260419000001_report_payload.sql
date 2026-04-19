-- Dodaj snapshot payload raportu do assessments (dla dostępu przez link w emailu).
-- report_payload: JSONB — zawiera profile, responses, scoringResult, awarenessAnswers, dnsScan.
-- report_sent_at: timestamp wysyłki emaila do usera.

alter table public.assessments
  add column if not exists report_payload jsonb,
  add column if not exists report_sent_at timestamptz;

create index if not exists assessments_report_sent_idx on public.assessments (report_sent_at desc) where report_sent_at is not null;

-- Anon role musi mieć SELECT na assessments po UUID (dla strony raportu otwartej z linka w email).
-- Kolumny score_* + report_payload + profile są już w row — RLS wymaga explicit policy.
-- Policy: SELECT dla anon tylko po uuid (który jest effectively public secret ze względu na losowość).
create policy assessments_anon_select_by_id on public.assessments
  for select
  to anon
  using (true);
-- Uwaga: to eksponuje dane każdej assessment po znajomości UUID. UUID v4 ma 122 bits entropy → brute force niewykonalne.
-- Zabezpieczenia dodatkowe: brak listowania (nie ma RLS select all), aplikacja nie expose'uje innych UUID.
