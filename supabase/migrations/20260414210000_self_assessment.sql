-- Migration: self_assessment
-- Description: Initial schema for Ai Puls samoocena cyberbezpieczeństwa.
-- Tables: assessments, responses, leads, payments.
-- RLS: anon can INSERT finished assessments + responses only. leads/payments server-only.
-- RPC: get_benchmark_snapshot with fallback cohort logic.
-- Aligns with docs/planning/02-samoocena/implementation-plan.md §6-7.

create extension if not exists pgcrypto;
create extension if not exists citext;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ==================================================================
-- TABLES
-- ==================================================================

create table public.assessments (
  id uuid primary key,
  questionnaire_version text not null,
  locale text not null default 'pl',
  industry text not null check (industry in ('produkcja', 'it', 'handel', 'uslugi', 'inne')),
  company_size text not null check (company_size in ('1-10', '11-50', '51-250')),
  started_at timestamptz not null,
  completed_at timestamptz not null,
  overall_score numeric(5,2) not null check (overall_score between 0 and 100),
  score_people numeric(5,2) not null check (score_people between 0 and 100),
  score_data numeric(5,2) not null check (score_data between 0 and 100),
  score_systems numeric(5,2) not null check (score_systems between 0 and 100),
  score_governance numeric(5,2) not null check (score_governance between 0 and 100),
  score_compliance numeric(5,2) not null check (score_compliance between 0 and 100),
  maturity_level text not null check (maturity_level in ('initial', 'developing', 'managed', 'optimized')),
  benchmark_scope text check (benchmark_scope in ('industry_size', 'size_only', 'all_smb') or benchmark_scope is null),
  benchmark_sample_size integer check (benchmark_sample_size is null or benchmark_sample_size >= 0),
  benchmark_percentile numeric(5,2) check (benchmark_percentile is null or benchmark_percentile between 0 and 100),
  report_status text not null default 'none' check (report_status in ('none', 'pending_payment', 'paid', 'generating', 'ready', 'failed')),
  report_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.responses (
  id bigint generated always as identity primary key,
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  question_id text not null,
  category_key text not null check (category_key in ('people', 'data', 'systems', 'governance', 'compliance')),
  option_id text not null,
  score smallint not null check (score between 0 and 3),
  weight numeric(4,2) not null default 1.0 check (weight in (1.0, 2.0)),
  critical boolean not null default false,
  created_at timestamptz not null default now(),
  unique (assessment_id, question_id)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null unique references public.assessments(id) on delete cascade,
  email citext not null,
  full_name text,
  company_name text,
  vat_id text,
  phone text,
  consent_privacy boolean not null default true,
  consent_marketing boolean not null default false,
  consent_privacy_at timestamptz not null default now(),
  consent_marketing_at timestamptz,
  source text not null default 'paid_pdf',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  provider text not null default 'stripe',
  product_code text not null default 'pdf_report',
  status text not null check (status in ('created', 'open', 'completed', 'expired', 'failed', 'refunded')),
  amount_minor integer not null check (amount_minor > 0),
  currency text not null default 'pln',
  stripe_session_id text unique,
  stripe_payment_intent_id text unique,
  stripe_event_id text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==================================================================
-- INDEXES
-- ==================================================================

create index assessments_cohort_idx
  on public.assessments (industry, company_size, completed_at desc);

create index assessments_report_status_idx
  on public.assessments (report_status, created_at desc);

create index responses_assessment_idx
  on public.responses (assessment_id);

create index responses_category_idx
  on public.responses (category_key);

create index leads_email_idx
  on public.leads (email);

create index payments_assessment_status_idx
  on public.payments (assessment_id, status);

-- ==================================================================
-- TRIGGERS (updated_at)
-- ==================================================================

create trigger trg_assessments_updated_at
before update on public.assessments
for each row execute function public.set_updated_at();

create trigger trg_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

create trigger trg_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

-- ==================================================================
-- ROW LEVEL SECURITY
-- ==================================================================

alter table public.assessments enable row level security;
alter table public.responses enable row level security;
alter table public.leads enable row level security;
alter table public.payments enable row level security;

revoke all on public.assessments from anon, authenticated;
revoke all on public.responses from anon, authenticated;
revoke all on public.leads from anon, authenticated;
revoke all on public.payments from anon, authenticated;

-- Anon can only insert completed assessments (no SELECT, no UPDATE, no DELETE)
grant insert on public.assessments to anon;
grant insert on public.responses to anon;

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
);

create policy responses_anon_insert
on public.responses
for insert
to anon
with check (
  score between 0 and 3
  and category_key in ('people', 'data', 'systems', 'governance', 'compliance')
);

-- leads and payments: no anon policies → fully locked from browser (server-only via secret key)

-- ==================================================================
-- RPC: get_benchmark_snapshot (fallback cohort logic)
-- ==================================================================

create or replace function public.get_benchmark_snapshot(p_industry text, p_company_size text)
returns table (
  scope text,
  sample_size integer,
  avg_overall numeric(5,2),
  avg_people numeric(5,2),
  avg_data numeric(5,2),
  avg_systems numeric(5,2),
  avg_governance numeric(5,2),
  avg_compliance numeric(5,2)
)
language sql
security definer
set search_path = public
as $$
with exact_cohort as (
  select
    'industry_size'::text as scope,
    count(*)::integer as sample_size,
    round(avg(overall_score), 2)::numeric(5,2) as avg_overall,
    round(avg(score_people), 2)::numeric(5,2) as avg_people,
    round(avg(score_data), 2)::numeric(5,2) as avg_data,
    round(avg(score_systems), 2)::numeric(5,2) as avg_systems,
    round(avg(score_governance), 2)::numeric(5,2) as avg_governance,
    round(avg(score_compliance), 2)::numeric(5,2) as avg_compliance
  from public.assessments
  where completed_at is not null
    and industry = p_industry
    and company_size = p_company_size
),
size_fallback as (
  select
    'size_only'::text as scope,
    count(*)::integer as sample_size,
    round(avg(overall_score), 2)::numeric(5,2),
    round(avg(score_people), 2)::numeric(5,2),
    round(avg(score_data), 2)::numeric(5,2),
    round(avg(score_systems), 2)::numeric(5,2),
    round(avg(score_governance), 2)::numeric(5,2),
    round(avg(score_compliance), 2)::numeric(5,2)
  from public.assessments
  where completed_at is not null
    and company_size = p_company_size
),
all_smb as (
  select
    'all_smb'::text as scope,
    count(*)::integer as sample_size,
    round(avg(overall_score), 2)::numeric(5,2),
    round(avg(score_people), 2)::numeric(5,2),
    round(avg(score_data), 2)::numeric(5,2),
    round(avg(score_systems), 2)::numeric(5,2),
    round(avg(score_governance), 2)::numeric(5,2),
    round(avg(score_compliance), 2)::numeric(5,2)
  from public.assessments
  where completed_at is not null
)
select * from exact_cohort where sample_size >= 30
union all
select * from size_fallback
where (select sample_size from exact_cohort) < 30 and sample_size >= 50
union all
select * from all_smb
where (select sample_size from exact_cohort) < 30
  and (select sample_size from size_fallback) < 50
limit 1;
$$;

grant execute on function public.get_benchmark_snapshot(text, text) to anon;
