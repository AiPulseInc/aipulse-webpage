-- Migration: awareness_quiz
-- Adds compliance literacy quiz score + raw answers to assessments table.
-- Quiz is 4 pre-assessment questions (regulatory awareness — RODO, NIS2, KSC).
-- Quiz NIE wpływa na overall_score samooceny — separate metric.

alter table public.assessments
  add column awareness_score smallint
    check (awareness_score is null or awareness_score between 0 and 4),
  add column awareness_answers jsonb;

-- Update RLS anon insert policy to validate new optional columns
drop policy if exists assessments_anon_insert on public.assessments;

create policy assessments_anon_insert
on public.assessments
for insert
to anon
with check (
  questionnaire_version <> ''
  and locale = 'pl'
  and industry in ('produkcja', 'it', 'handel', 'uslugi', 'inne')
  and company_size in ('1-10', '11-50', '51-250')
  and overall_score between 0 and 100
  and score_people between 0 and 100
  and score_data between 0 and 100
  and score_systems between 0 and 100
  and score_governance between 0 and 100
  and score_compliance between 0 and 100
  and maturity_level in ('initial', 'developing', 'managed', 'optimized')
  and report_status = 'none'
  and (awareness_score is null or awareness_score between 0 and 4)
);
