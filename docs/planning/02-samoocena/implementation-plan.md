# Samoocena Bezpieczeństwa — Implementation Plan

Grounded in the KB at `docs/planning/02-samoocena/knowledge-base.md:57`, the current Vite multi-page setup at `vite.config.js:7`, the existing security page/theme at `security/index.html:22` and `style.css:741`, and the current “samoocena” placeholder offer card at `security/index.html:399`.

## 1. URL + Page Structure

- **Chosen URL:** `/bezpieczenstwo-samoocena/`
- **Why not `/samoocena/`:** `/samoocena/` is shorter, but too generic for future expansion. If Ai Puls later adds AI, compliance, or automation assessments, that slug becomes ambiguous. `/bezpieczenstwo-samoocena/` is clearer for SEO, clearer in shared links, and consistent with the security vertical.
- **Vite integration:** Add a fourth page entry to the existing Rollup inputs in `vite.config.js:10`, alongside `landing`, `business`, and `security`.
- **Repo fit:** Keep this as a real multi-page route folder, same pattern as `security/index.html:1`, not a client-side SPA router.
- **Page structure recommendation:**
  - Hero: value proposition, no-email promise, time-to-complete
  - Profiling step: branża + wielkość firmy
  - Questionnaire shell: 5 sections
  - Results: score + category breakdown + benchmark card
  - Upgrade block: paid PDF
  - Consultation CTA: reuse existing security offer motion/copy style
- **Body/theme:** Reuse `theme-security` so the violet accent comes from the same CSS variable system already used in `style.css:741`.
- **Current page linkage:** Replace the current “Zapytaj o samoocenę” CTA on the security offer card in `security/index.html:405` with a direct link to `/bezpieczenstwo-samoocena/`.

## 2. Question Set

- **Reference categories from the KB:**
  - `Ludzie`
  - `Dane`
  - `Infrastruktura`
  - `Procesy`
  - `Compliance`
- **Final count recommendation:** **35 scored questions** total, `7 x 5 categories`.
- **Why I disagree slightly with the KB’s 40-question recommendation:** 40 works academically, but for anonymous mobile-first completion and paid upsell, 35 is a better launch target. It is still credible, but materially lowers drop-off.
- **Non-scored profiling fields:** collect separately from the scored question set:
  - `industry`
  - `company_size`
  - optional `has_internal_it` only if you want richer internal analysis later
- **Question design principles:**
  - 3 answer choices per question, scored `0-3`
  - No free-text answers before payment
  - Avoid “N/A” where possible; where needed, prefer “Nie wiem” and score as `0`
  - Tag each question with control mappings and recommendation tags
- **Source-of-truth format:** use `questions.json`, not TS, because the repo is vanilla JS and JSON is easy to share across frontend and Supabase functions.
- **Recommended schema:** `src/samoocena/questions.json`

```json
{
  "version": "2026-01",
  "categories": [
    { "id": "people", "label": "Ludzie", "order": 1 },
    { "id": "data", "label": "Dane", "order": 2 },
    { "id": "systems", "label": "Infrastruktura", "order": 3 },
    { "id": "governance", "label": "Procesy", "order": 4 },
    { "id": "compliance", "label": "Compliance", "order": 5 }
  ],
  "questions": [
    {
      "id": "people_phishing_training",
      "category": "people",
      "order": 1,
      "prompt": "Jak często pracownicy przechodzą szkolenia z rozpoznawania phishingu i bezpiecznej pracy?",
      "helpText": "Zaznacz odpowiedź najbliższą codziennej praktyce, nie temu, co jest zapisane na papierze.",
      "critical": false,
      "weight": 1,
      "mappings": ["CIS 14", "NIST PR.AT-01"],
      "recommendationTags": ["training", "phishing"],
      "options": [
        { "id": "never", "label": "Nigdy lub bardzo rzadko", "score": 0 },
        { "id": "annual", "label": "Raz w roku", "score": 1 },
        { "id": "biannual", "label": "Co najmniej co pół roku + testy", "score": 3 }
      ]
    },
    {
      "id": "systems_mfa_coverage",
      "category": "systems",
      "order": 2,
      "prompt": "W ilu systemach firmowych działa MFA?",
      "critical": true,
      "weight": 2,
      "mappings": ["CIS 6", "NIST PR.AA-03"],
      "recommendationTags": ["mfa", "identity"],
      "options": [
        { "id": "none", "label": "Prawie nigdzie", "score": 0 },
        { "id": "some", "label": "W najważniejszych systemach", "score": 2 },
        { "id": "most", "label": "Wszędzie, gdzie to możliwe", "score": 3 }
      ]
    }
  ]
}
```

## 3. Questionnaire UX Flow

- **Flow:** Landing → Start → Profiling → 5 sections → Instant results → PDF upsell → Consultation CTA
- **Recommended detailed flow:**
  - Landing block explains value, anonymity, and time: `6–8 minut`, `bez maila`, `wynik od razu`
  - Start modal/card collects only `branża` and `wielkość firmy`
  - One section per screen, `Krok 1 z 5`
  - Auto-save to `localStorage` on every answer
  - Instant local scoring on completion
  - Async anonymous save to Supabase after results render
  - Benchmark card loads after save completes
  - Paid PDF CTA appears on results, not before
- **Save-and-resume recommendation:** `localStorage` only for MVP
  - Store `assessment_id`, `questionnaire_version`, answers, current section, last updated timestamp
  - On return: `Znaleźliśmy Twoją niedokończoną samoocenę. Kontynuować?`
  - Do not build email-link resume in v1; it violates the “no PII before pay” principle and adds unnecessary complexity
- **Mobile considerations:**
  - Large answer cards, minimum 48px target height
  - Sticky footer with `Wstecz` / `Dalej`
  - Sticky compact progress bar
  - One question visible at a time on smaller screens
  - No hover-only affordances
- **Recommended Polish UX microcopy:**
  - `Bez maila. Wynik zobaczysz od razu na ekranie.`
  - `To nie jest egzamin — wybierz odpowiedź najbliższą rzeczywistości.`
  - `Zostały około 2 minuty.`
  - `Wracamy do miejsca, w którym przerwano.`
  - `Twój najsłabszy obszar to: Backup i odtwarzanie danych.`
  - `Raport PDF przygotujemy po płatności i wyślemy na email.`
- **Important UX opinion:** do not gate the score behind email. The free result is the trust-building moment.

## 4. Scoring Engine

- **Per-question scoring:** `0-3`
- **Category formula:**  
  `category_score = sum(question_score) / sum(max_question_score) * 100`
- **Overall formula:**  
  `overall_score = sum(question_score * weight) / sum(max_question_score * weight) * 100`
- **Weighting recommendation:**
  - `MFA` and `backup_restore_tested` questions use weight `2`
  - All other questions use weight `1`
- **Why this weighting works:** it reflects the KB and aligns with real insurer expectations without making the model opaque.
- **Optional guardrail I recommend:** if both MFA and tested backup score `0`, cap the maturity label at `developing`. Average scores can otherwise hide fatal ransomware exposure.
- **Maturity mapping:**
  - `0-25`: `Initial / Krytyczny`
  - `26-50`: `Developing / Podstawowy`
  - `51-75`: `Managed / Stabilny`
  - `76-100`: `Optimized / Lider`
- **Per-category weighting:** keep categories unweighted on screen. Users should understand category bars instantly.
- **Benchmark comparison recommendation:**
  - Display overall and per-category comparison
  - Prefer `Ty vs kohorta` with sample size shown
  - Fallback logic:
    - if cohort `industry + size` has `n >= 30`, show exact cohort
    - else if `size` has `n >= 50`, show size-only cohort
    - else show `all SMB`
- **Important opinion:** do **not** fake an industry benchmark from day one. If the cohort is thin, say so.

## 5. Results Screen

- **Primary visualization:** **horizontal bar chart**
- **Why not radar as the main chart:** radar looks attractive, but bar charts are clearer, more honest, and much better on mobile. Use radar in the PDF if desired.
- **JS library recommendation:** **no chart library**
  - Use CSS bars or tiny inline SVG
  - This keeps the bundle small and consistent with the repo’s vanilla setup
- **Results content order:**
  - Overall score card
  - Maturity label
  - 5 category bars
  - Benchmark comparison card
  - Top 3 recommendations
  - CTAs
- **Recommendation logic:**
  - Rank by `gap severity x question weight x business relevance`
  - Free result shows top `3`
  - Paid PDF expands to top `5` with effort/cost framing
- **Free recommendation format example:**
  - `Włącz MFA w Microsoft 365 i poczcie`
  - `Przetestuj odtwarzanie backupu co kwartał`
  - `Spisz prosty plan reakcji na incydent`
- **CTAs:**
  - `Pobierz PDF (199 zł + VAT)`
  - `Umów konsultację (bezpłatna)`
- **Secondary CTAs:**
  - `Zacznij od nowa`
  - `Skopiuj link do wyniku` only later, after a signed public results URL exists; not needed in MVP

## 6. Supabase Schema

- **Design choice:** raw rows are write-only from the browser; reads beyond the current result should come from RPC/Edge Functions.
- **Why:** anonymous writes are fine; anonymous raw-table reads are not.

```sql
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

create trigger trg_assessments_updated_at
before update on public.assessments
for each row execute function public.set_updated_at();

create trigger trg_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

create trigger trg_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

alter table public.assessments enable row level security;
alter table public.responses enable row level security;
alter table public.leads enable row level security;
alter table public.payments enable row level security;

revoke all on public.assessments from anon, authenticated;
revoke all on public.responses from anon, authenticated;
revoke all on public.leads from anon, authenticated;
revoke all on public.payments from anon, authenticated;

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
```

- **RLS summary:**
  - Browser can only `insert` anonymous finished assessments and responses
  - Browser cannot read raw results tables
  - `leads` and `payments` are server-only
  - Benchmark reads happen via `get_benchmark_snapshot()` or an Edge Function
- **Additional setup:** create a private Supabase Storage bucket `reports`

## 7. Anonymous Submission Flow

- **Assessment ID generation:** generate once in browser with `crypto.randomUUID()` when the user starts.
- **Where stored:** `localStorage`, keyed by questionnaire version.
- **Recommended flow:**
  - User answers questions locally
  - Frontend computes score immediately on completion
  - Results render instantly, without waiting for network
  - Frontend then inserts:
    - one row into `assessments`
    - bulk rows into `responses`
  - Frontend calls benchmark RPC or Edge Function
- **Why this flow is better than live-sync per answer:** it preserves instant UX, reduces write volume, and keeps the draft anonymous/offline until completion.
- **Supabase auth mode:** browser uses `anon` key via `@supabase/supabase-js`
- **No PII rule:** do not send email, name, company name, or phone in this flow
- **Failure handling:**
  - If anonymous save fails, keep results visible
  - Show non-blocking banner: `Nie udało się zapisać anonimowego wyniku. Spróbujemy ponownie.`
  - Retry in the background
  - If user clicks paid PDF before sync succeeds, force a retry first

## 8. Stripe Integration

- **Product:** `Raport PDF samooceny cyberbezpieczeństwa`
- **Price recommendation:** launch at **199 zł + VAT**
- **Why this price:** it aligns with the KB, is credible enough to signal value, and is still low-friction for Polish SMB owners.
- **Checkout mode recommendation:** **hosted Stripe Checkout**
- **Why hosted Checkout:** this repo is static Vite, so hosted Checkout is the safest and simplest way to handle payment UX, SCA, and Polish payment method availability.
- **Payment methods:** enable `automatic_payment_methods`; target `card` plus local methods that Stripe supports on the account, ideally `BLIK` or `Przelewy24` if available.
- **Server-side function:** `create-checkout-session`
  - Input: `assessment_id`
  - Optional input: `email`, `consent_privacy`, `consent_marketing`
  - Validates that assessment exists and is complete
  - Creates a Stripe Checkout Session
  - Returns hosted session URL
- **Webhook:** `stripe-webhook`
  - Verify Stripe signature
  - Upsert `payments`
  - Create `leads`
  - Update `assessments.report_status` to `paid`
  - Trigger report generation
- **Metadata to include in Checkout Session:**
  - `assessment_id`
  - `questionnaire_version`
  - `locale`
  - `consent_marketing`
- **Success URL:** `/bezpieczenstwo-samoocena/?checkout=success&assessment_id={id}`
- **Cancel URL:** `/bezpieczenstwo-samoocena/?checkout=cancelled&assessment_id={id}`
- **Idempotency:**
  - Unique `stripe_session_id`
  - Unique `stripe_payment_intent_id`
  - Unique `stripe_event_id`
  - Webhook must be safe to replay
- **Error handling:**
  - If payment succeeds but PDF is not ready yet, show `Płatność przyjęta. Generujemy raport i wyślemy go na email.`
  - Results page polls `report_status` or offers a “check again” button
- **Important architecture note:** do not expose any Stripe secret in the Vite app

## 9. PDF Generation

- **Options considered:**
  - Client-side `pdf-lib` / `jsPDF`
  - Server-side HTML-to-PDF with Playwright/Chromium
  - Server-side document assembly with `pdf-lib`
- **Recommendation:** **server-side generation only**
- **Why I do not recommend client-side PDF:** it weakens the paywall, exposes premium logic, complicates font fidelity, and is unreliable on mobile browsers.
- **Preferred rendering model:** HTML/CSS template → server-side render → PDF
- **Tradeoffs:**
  - HTML-to-PDF: best branding fidelity, easiest charts, best Polish typography, more infrastructure
  - `pdf-lib`: simpler runtime dependencies, but slower to make beautiful
- **Opinionated recommendation:** for a paid report, optimize for quality, not minimal infrastructure. If Supabase Edge runtime proves too limited for headless rendering, keep Supabase for orchestration and move only the render step to a Chromium-capable worker.
- **Polish character handling:** embed `Noto Sans` or another full Latin Extended font server-side; do not rely on system fonts.
- **Template structure:**
  - Cover: score, maturity, date, company/email if provided after payment
  - Executive summary: one-page owner-friendly risk summary
  - Category analysis: scores + benchmark
  - Recommendations: top 5 prioritized actions
  - Compliance map: NIS2 / RODO / insurer-readiness
  - Next steps: consultation CTA + contact
- **Chart choice in PDF:** radar is fine here, because the PDF is a premium artifact and space is controlled.
- **Storage:** save the finished file in a private `reports` bucket and store the object key in `assessments.report_path`

## 10. Email Delivery

- **Recommendation:** **Resend**
- **Why Resend:**
  - excellent developer ergonomics
  - fast transactional setup
  - low complexity for early-stage volume
  - better fit than generic SMTP for this use case
- **Why not Supabase SMTP for MVP:** workable, but weaker DX and template control
- **Why not SendGrid first:** more enterprise-heavy than needed at launch
- **Email delivery pattern:** send a branded transactional email with a signed download link; do not rely only on attachments
- **Why link-first is better:** smaller email size, better deliverability, easier regeneration
- **Template content:**
  - Subject: `Twój raport samooceny cyberbezpieczeństwa Ai Puls`
  - Intro: thank-you + payment confirmation
  - Score snapshot: overall score + maturity label
  - Button: `Pobierz raport PDF`
  - Secondary CTA: `Umów bezpłatną konsultację`
- **GDPR consent flow:**
  - Required checkbox before payment: privacy / report delivery consent
  - Optional checkbox: marketing consent
  - Transactional report email can be sent without marketing consent
  - Store consent timestamps in `leads`

## 11. File Structure

- **Recommended paths under `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/`:**
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/bezpieczenstwo-samoocena/index.html`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/samoocena/app.js`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/samoocena/questions.json`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/samoocena/scoring.js`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/samoocena/recommendations.js`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/samoocena/state.js`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/samoocena/api.js`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/samoocena/charts.js`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/samoocena/ui.js`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/samoocena/styles.css`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/lib/supabase-browser.js`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/security/index.html`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/vite.config.js`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/package.json`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/.env.example`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/supabase/config.toml`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/supabase/migrations/2026xxxxxx_self_assessment.sql`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/supabase/functions/create-checkout-session/index.ts`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/supabase/functions/stripe-webhook/index.ts`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/supabase/functions/report-status/index.ts`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/supabase/functions/generate-report/index.ts`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/supabase/functions/send-report-email/index.ts`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/supabase/functions/_shared/db.ts`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/supabase/functions/_shared/stripe.ts`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/supabase/functions/_shared/report-template.ts`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/supabase/functions/_shared/fonts/NotoSans-Regular.ttf`
  - `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage/supabase/functions/_shared/fonts/NotoSans-Bold.ttf`
- **Important structure opinion:** keep this page on its own JS entry, not inside `main.js:1`. `main.js` already mixes shared UI and page-specific modal logic.

## 12. Implementation Phases

- **Phase 1 — Route + page shell:** Scope: add `/bezpieczenstwo-samoocena/`, shared security theme, skeleton sections, CTA link from security page; Files: `vite.config.js`, `security/index.html`, `bezpieczenstwo-samoocena/index.html`, `src/samoocena/app.js`, `src/samoocena/styles.css`; Dependencies: none; Acceptance: page builds, loads, and matches the current violet security theme.
- **Phase 2 — Question model + scoring rules:** Scope: create `questions.json`, categories, mappings, recommendation tags, local scoring engine; Files: `src/samoocena/questions.json`, `src/samoocena/scoring.js`, `src/samoocena/recommendations.js`; Dependencies: Phase 1; Acceptance: 35 questions render correctly and produce deterministic category and overall scores.
- **Phase 3 — Frontend UX flow:** Scope: landing, profiling, section navigation, progress UI, localStorage resume, results screen, benchmark placeholders; Files: `src/samoocena/app.js`, `src/samoocena/ui.js`, `src/samoocena/charts.js`, `src/samoocena/state.js`, `src/samoocena/styles.css`; Dependencies: Phase 2; Acceptance: anonymous user can complete the test on mobile and desktop and see results instantly.
- **Phase 4 — Supabase connection + schema:** Scope: link existing Supabase project, add migrations, browser client, storage bucket, env variables; Files: `package.json`, `.env.example`, `src/lib/supabase-browser.js`, `supabase/config.toml`, `supabase/migrations/...`; Dependencies: Phase 2; Acceptance: anonymous results and responses save successfully under RLS with no PII.
- **Phase 5 — Benchmark pipeline:** Scope: benchmark function, fallback logic, result-card enrichment, sample-size labeling; Files: migration SQL, `src/samoocena/api.js`, `src/samoocena/app.js`; Dependencies: Phase 4; Acceptance: results show `Ty vs kohorta` only when sample thresholds are met, with clear fallback labels.
- **Phase 6 — Stripe checkout + payment state:** Scope: session creation, hosted checkout redirect, webhook handling, payment persistence, report status orchestration; Files: `supabase/functions/create-checkout-session/index.ts`, `supabase/functions/stripe-webhook/index.ts`, `src/samoocena/api.js`, `src/samoocena/app.js`; Dependencies: Phase 4; Acceptance: successful payment creates a durable payment record and marks the assessment as paid.
- **Phase 7 — PDF generation + email delivery:** Scope: report template, PDF render, storage upload, signed link email, success polling; Files: `supabase/functions/generate-report/index.ts`, `supabase/functions/send-report-email/index.ts`, `_shared/report-template.ts`, fonts, `src/samoocena/app.js`; Dependencies: Phase 6; Acceptance: paid user receives a valid Polish-language PDF link by email and can also access report status from the success page.

## 13. Open Questions / Decisions User Must Make

- **Price point:** do you want to launch at `199 zł + VAT`, `199 zł brutto`, or `349 zł + VAT` as the premium anchor?
- **Benchmark scope:** should v1 show only internal Ai Puls cohort data, or do you want any “expert baseline” before enough samples exist?
- **Industry granularity:** start with `Produkcja / IT / Handel / Usługi / Inne`, or split sectors like `Zdrowie` and `Transport` from day one?
- **Language strategy:** PL only in v1, or should the data model be translation-ready for EN later?
- **Invoice flow:** should Stripe collect company name and VAT ID in checkout from day one?
- **PDF positioning:** is this a practical management report, or should it feel closer to a quasi-certified audit artifact?
- **Consultation CTA target:** should the free consultation stay on the existing contact flow, or get a dedicated booking page?

## 14. Risks

- **Supabase RLS pitfalls:** overly broad policies can expose raw assessment data; keep raw tables write-only from the browser.
- **Stripe PL-specific tax/VAT:** public pricing, invoice expectations, and VAT display must be decided early to avoid checkout confusion.
- **Polish char rendering in PDF:** this breaks often if fonts are not embedded server-side; treat font embedding as mandatory, not optional.
- **Benchmark credibility risk:** showing “industry averages” with tiny samples will undermine trust; always show sample size and fallback scope.
- **Anti-bot abuse:** anonymous endpoints can be spammed; start simple, but be ready to add Cloudflare Turnstile on final submit or checkout initiation.
- **Webhook timing:** payment may complete before report generation finishes; success UX must tolerate async completion.
- **Bundle creep:** adding a heavy charting library or framework would fight the current Vite/vanilla architecture and slow the page unnecessarily.

## 15. Estimated Effort

- **Hard:** Phase 7 `PDF generation + email delivery`
- **Hard:** Phase 6 `Stripe checkout + webhook + paid-state orchestration`
- **Moderate-Hard:** Phase 4 `Supabase schema + project connection + RLS`
- **Moderate:** Phase 5 `Benchmark pipeline + fallback logic`
- **Moderate:** Phase 3 `Questionnaire UX flow + local resume + results UI`
- **Moderate:** Phase 2 `Question bank + scoring + recommendations`
- **Trivial-Moderate:** Phase 1 `Route + page shell + Vite multi-page wiring`

- **Overall recommendation:** build this as a focused, high-trust anonymous assessment first, then make the PDF/report pipeline the premium layer. The biggest launch mistake would be overbuilding the benchmark or overdesigning the charting before the anonymous completion flow is frictionless.