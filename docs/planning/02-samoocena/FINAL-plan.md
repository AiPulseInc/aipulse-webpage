# FINAL Plan — Samoocena Bezpieczeństwa

Plan bazowy to **`implementation-plan.md` z Codex (31KB)** oparty na **`knowledge-base.md` z Gemini (9.8KB)**.

Oba dokumenty są komplementarne:
- **Knowledge base (Gemini)** → merytoryka: regulacje PL (NIS2/KSC/RODO), framework hybryda CIS IG1 + NIST CSF 2.0, 40 pytań przykładowych, scoring model, konkurencja (PUM6, Orange, CyberReadiness), UX patterns, monetization (199 PLN anchor), PDF structure, open questions
- **Implementation plan (Codex)** → technika: URL `/bezpieczenstwo-samoocena/`, JSON schema pytań (35 zamiast 40, Codex uzasadnił), scoring engine z guardrails (MFA+backup=0 cap maturity), Supabase SQL DDL z RLS policies, benchmark RPC z fallback, Stripe hosted checkout, server-side PDF z embedded Noto Sans, Resend email

Ten dokument = **synteza + decyzje + ryzyka**. Plan Codex jest ready-to-execute; tutaj zbieram tylko najważniejsze punkty do Twojej akceptacji.

## Kluczowe decyzje Codex (vs KB)

| Temat | KB (Gemini) | Plan (Codex) | Komentarz |
|---|---|---|---|
| Liczba pytań | 40 | **35** (7 × 5 kategorii) | Codex redukuje z obawy o drop-off. Zgadzam się — lepiej mieć 90% completion na 35 niż 60% na 40 |
| Skala odpowiedzi | 3 opcje (0/1/3) | **3 opcje, miksowane** (0/1/3 dla rzadkich zachowań, 0/2/3 dla ciągłych) | Obie stosują 3 opcje (korekta: w pierwotnej wersji FINAL błędnie pisałem "4 opcje w KB"). Codex proponuje miks 0-1-3 + 0-2-3 zależnie od typu pytania |
| Weighting | MFA+Backup = 2.0, reszta 1.0 | Ten sam + **guardrail**: jeśli MFA=0 AND backup=0, cap maturity na "Developing" | Guardrail to sensowny safety net. Nikt nie powinien dostać "Managed" bez MFA+backup |
| URL | `/samoocena/` | **`/bezpieczenstwo-samoocena/`** | Codex argumentuje: w przyszłości może być `/samoocena-ai/`, nie chcemy ambiguity |
| Chart results | Radar | **Horizontal bars w UI, radar tylko w PDF** | Bars honestly pokazują scores, radar efektowny w druku |
| Chart lib | Chart.js / react-pdf | **CSS bars / inline SVG (zero lib)** | Zgodne z vanilla stack, mały bundle |
| PDF generation | Playwright headless | **Server-side HTML→PDF w Edge Function** | Preferuje branding fidelity, zgoda że font embedding MUST |
| Email | Resend/SendGrid | **Resend** (DX, PL friendly) | OK · _Zweryfikowane 2026-04-14 vs MailerSend — Resend potwierdzony (free tier 3k/mc pokrywa wolumen 500-1000/mc, SOC 2 Type II, EU datacenter Frankfurt). Trigger conditions re-ewaluacji w memory `reference_email_provider`._ |
| Save-resume | Email link opcjonalnie | **Tylko localStorage w MVP** | Email resume łamie "no PII before pay" — zgadzam się |
| Checkout | Stripe | **Hosted Checkout + `automatic_payment_methods`** (BLIK, Przelewy24 gdy dostępne) | Najbezpieczniejsze dla static Vite |
| Benchmark pojawia się gdy... | Nie wspomniane | `n >= 30` dla industry+size, fallback `n >= 50` dla size, dalej `all_smb`. Zawsze sample size widoczny | To kluczowe dla wiarygodności — Codex plan ma pełną SQL implementation w `get_benchmark_snapshot()` RPC |

## Architektura — overview

```
aipulse-webpage/
├── bezpieczenstwo-samoocena/index.html        # Vite MPA entry
├── src/samoocena/
│   ├── app.js                  # main flow orchestrator
│   ├── questions.json          # 35 pytań, 5 kategorii
│   ├── scoring.js              # per-cat + overall + guardrails
│   ├── recommendations.js      # top-N from scored gaps
│   ├── state.js                # localStorage resume
│   ├── api.js                  # Supabase browser client
│   ├── charts.js               # CSS bars + inline SVG
│   ├── ui.js                   # section renderers
│   └── styles.css              # local styles
├── src/lib/supabase-browser.js
├── supabase/
│   ├── config.toml
│   ├── migrations/2026xxxxxx_self_assessment.sql
│   └── functions/
│       ├── create-checkout-session/index.ts
│       ├── stripe-webhook/index.ts
│       ├── generate-report/index.ts
│       ├── send-report-email/index.ts
│       ├── report-status/index.ts
│       └── _shared/
│           ├── db.ts
│           ├── stripe.ts
│           ├── report-template.ts
│           └── fonts/NotoSans-{Regular,Bold}.ttf
└── .env.example
```

## Schema (Supabase) — streszczenie

4 tabele + RLS + helper function:

- **assessments** — jeden wiersz na ukończony test (overall + per-cat scores + maturity + benchmark snapshot)
- **responses** — odpowiedzi per pytanie (zdenormalizowane: score, weight, critical)
- **leads** — tylko gdy user płaci za PDF (email, consent, optional VAT/company)
- **payments** — Stripe session + PaymentIntent + event IDs (idempotency)

**RLS policies**:
- `anon` może tylko `INSERT` do `assessments` i `responses` (walidacja enum + range)
- `anon` NIE może `SELECT` surowych danych (benchmarks idą przez `get_benchmark_snapshot()` RPC)
- `leads` + `payments` są tylko server-side (Edge Functions)

**Pełny SQL DDL** (~220 linii w implementation-plan.md, linie 181-402) ma:
- Check constraints na wszystkich enumach
- `trg_*_updated_at` triggers
- 6 indeksów (cohort, report_status, responses)
- `security definer` function dla benchmarków

## Wymagane zmienne środowiskowe

Utworzyć `.env.local` (i `.env.example` do repo) z:

```
# Frontend (prefix VITE_ — exposed to browser)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Supabase Edge Functions (server-only)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
REPORT_BUCKET_NAME=reports
```

**Ważne**: zgodnie z Twoim feedbackiem (`feedback_no_secrets_in_output.md`) — NIGDY nie ładuję tych secretów do outputu rozmowy, nie czytam z `.env`. Wymagasz mi je sam (dostarczysz podczas Fazy 4) lub dodajesz w panelu Vercel + Supabase.

## Ostrzeżenie implementacyjne

1. **Stripe BLIK/Przelewy24** — są dostępne na polskich kontach Stripe, ale **wymagają aktywacji w Stripe Dashboard** (nie włączają się automatycznie nawet z `automatic_payment_methods`). Działanie: Dashboard → Settings → Payment methods → Enable BLIK/P24. Inaczej checkout pokaże tylko card.
2. **Samoocena card na security page** — aktualnie `security/index.html:404` zawiera tekst "Kwestionariusz 40-50 pytań. [...] **Narzędzie wkrótce dostępne online.**". Po uruchomieniu narzędzia TO MUSIMY ZAKTUALIZOWAĆ na 35 pytań + usunąć "wkrótce" + CTA przekierować z `#contact` na `/bezpieczenstwo-samoocena/`.
3. **Supabase Edge Functions = Deno runtime** — Puppeteer/Playwright nie działają natywnie w Deno. Jeśli wybierzemy headless Chrome, render PDF musi pójść na **Vercel Function (Node + `@sparticuz/chromium`)** albo external worker (Railway/Fly.io). Supabase EF zostaje jako orchestrator.
4. **Stripe webhook URL** — wymagany HTTPS endpoint publiczny. Vercel Deployment Protection (feedback z `feedback_vercel_auth_webhooks.md`) będzie blokować webhooki → wymagane `vercel-protection-bypass` token w headers.

## Flow użytkownika (happy path)

```
1. /bezpieczenstwo-samoocena/
   └─ Hero: "6-8 min, bez maila, wynik od razu"
   └─ [Start test]

2. Profiling modal
   └─ Branża (dropdown: Produkcja/IT/Handel/Usługi/Inne)
   └─ Wielkość (1-10 / 11-50 / 51-250)
   └─ assessment_id = crypto.randomUUID(), zapisane w localStorage

3. Sekcja 1/5: Ludzie (7 pytań) → localStorage auto-save
4. Sekcja 2/5: Dane
5. Sekcja 3/5: Infrastruktura
6. Sekcja 4/5: Procesy
7. Sekcja 5/5: Compliance

8. Instant results (client-side scoring)
   └─ Overall score + maturity label
   └─ 5 category bars (CSS)
   └─ "Twój najsłabszy obszar: Backup" tease
   └─ Async: INSERT do Supabase (anonymous)
   └─ Async: benchmark RPC call
   └─ Top 3 rekomendacje

9. Upgrade block
   └─ [Pobierz PDF — 199 zł + VAT]
   └─ [Umów bezpłatną konsultację]

10. Jeśli klik PDF:
    └─ Modal email + consent checkboxes (RODO + opt marketing)
    └─ Stripe hosted checkout (card + BLIK + Przelewy24)
    └─ Webhook: payments upsert + leads create + assessments.report_status='paid'
    └─ Edge Function generate-report: HTML→PDF via headless render
    └─ Upload do private bucket `reports`
    └─ Resend email z signed link do PDF
    └─ User na success page: polling report_status, download button appears
```

## Fazy implementacji (per Codex — 7 faz)

| Faza | Zakres | Złożoność | Zależności |
|---|---|---|---|
| **1** | Route + page shell + Vite wiring | Trivial-Moderate | — |
| **2** | Question bank + scoring + recommendations | Moderate | 1 |
| **3** | UX flow (landing, profiling, progress, results, localStorage) | Moderate | 2 |
| **4** | Supabase schema + project connection + RLS | Moderate-Hard | 2 |
| **5** | Benchmark pipeline + fallback logic | Moderate | 4 |
| **6** | Stripe checkout + webhook + paid state | **Hard** | 4 |
| **7** | PDF generation + email delivery | **Hard** | 6 |

**Rekomendacja sekwencyjności**: zbudować frictionless anonymous flow (fazy 1-5) zanim ruszymy paid pipeline (6-7). Największym błędem byłoby over-engineer benchmark lub chart PRZED tym jak anonymous completion działa bezproblemowo.

## Ryzyka (per Codex)

1. **Supabase RLS pitfalls** — szerokie policies = leakage raw data. Rozwiązanie: raw write-only, reads przez RPC.
2. **Stripe PL VAT** — publiczne ceny brutto czy netto? VAT collection w checkout? Decyzja przed launch.
3. **Polish char rendering w PDF** — mandatory: embed Noto Sans server-side. System fonts == bug.
4. **Benchmark credibility** — pokazywać "industry averages" z n=5 = utrata zaufania. Zawsze sample size + fallback label.
5. **Anti-bot** — anonymous endpoints można spamować. Start prosty, ale Cloudflare Turnstile gotowy jeśli abuse.
6. **Webhook timing** — Stripe webhook może przyjść przed PDF generation finish. UX musi tolerować async.
7. **Bundle creep** — dodanie React/Chart.js zabije Vite vanilla architekturę. NIE wchodzić tą drogą.

## Decyzje (zaakceptowane 2026-04-13)

### Produktowe
1. ✅ **Cena PDF**: **99 zł brutto** (low-friction anchor, ~80 zł netto margin po fees Stripe). Premium pricing możemy wprowadzić później jako wersja "Pro audit" 349 zł.
2. ✅ **Branże**: 5 (Produkcja / IT / Handel / Usługi / Inne)
3. ✅ **Pozycjonowanie PDF**: **Praktyczny management report** (primary), ale **przygotowuję oba mockupy HTML** (management + quasi-certyfikowany) — otworzysz w przeglądarce i zdecydujemy.
4. ✅ **Faktura VAT**: Flow dwuwariantowy w checkout:
   - Radio: "Chcę fakturę VAT" → pola NIP + nazwa firmy + adres (wymagane)
   - Radio: "Bez faktury" → tylko email (wymagane)
   - `leads.company_name` i `leads.vat_id` opcjonalne w schemacie (już tak jest w Codex planie)
5. ✅ **Consultation CTA**: `/security/#contact` (istniejący flow)
6. ✅ **Język PL only v1 + data model translation-friendly** (moja rekomendacja — uzasadnienie niżej)

### Techniczne
7. ✅ **PDF render**: **Vercel Serverless Function + `@sparticuz/chromium` + Playwright** (rekomendacja niżej)
8. ✅ **Benchmark fallback**: "Brak publicznych danych referencyjnych w Twojej branży (n<30). Porównujemy z ogólną średnią MŚP." (honest)
9. ✅ **Questionnaire versioning**: **Agresywnie używamy** — benchmarki filtrowane per `questionnaire_version` (rekomendacja niżej)

### UX
10. ✅ **Brand w PDF**: tylko na cover page (nie letterhead na każdej stronie)
11. ✅ **Radar chart w PDF**: tak, zgodnie z mockupem B (inline SVG, violet outline)
12. ✅ **"Zacznij od nowa" button**: NIE (data retention — nie kasujemy sesji)

### Ważna decyzja architektoniczna dodana 2026-04-13

**Dual report architecture** — dwa warianty raportu:
- **Wersja A (Management Report, 4 strony)** — **wyświetlana na ekranie** po ukończeniu samooceny (free). Layout z `mockup-A-management.html`. Immediate gratification.
- **Wersja B (Quasi-Certyfikowany Audyt, ~10 stron)** — **wysyłana emailem jako PDF** po zakupie (99 zł brutto). Layout z `mockup-B-audit.html`. TOC, methodology CIS IG1 + NIST CSF 2.0, findings list z severity, compliance map NIS2/RODO/ubezpieczyciele, signature audytora.

**Techniczne implikacje**:
- Wersja A = CSS w security-assessment app, renderowana client-side bezpośrednio z wyników
- Wersja B = szablon HTML + Playwright render → PDF → Resend email (tylko po payment)
- Oba dziedziczą theme violet, ale A jest uproszczona (dark hero + bar charts), B formalna (letterhead + radar + findings)
- Wspólny kod: scoring, benchmark data, recommendations logic. Różnica tylko w templatowaniu.

## Rekomendacje (pytania 6, 7, 9)

### #6 — Język: PL only v1, ale data model translation-friendly

**Rekomendacja**: Zostajemy z polskim w UI i contencie, ale strukturujemy kod tak, aby dodanie EN/DE w przyszłości było ZMIANĄ CONTENTU, nie REFACTOREM.

Konkretnie:
- `questions.json` ma pola `prompt`, `helpText`, `label` → w v1 są po polsku
- NIE hardcoduję żadnych stringów w HTML/JS (wszystko z JSON-a lub `data-*` atrybutów)
- `assessments.locale = 'pl'` (już w schemacie) — później 'en', 'de' bez migracji
- `recommendation_tags` są neutralne ("training", "mfa", "backup") — kopia mapuje je na język
- Vite MPA: w przyszłości `/en/bezpieczenstwo-samoocena/` będzie osobnym entry

**Koszt teraz**: ~0 (po prostu dobra higiena). **Oszczędność potem**: 2-3 tygodnie gdy chcemy EN.

### #7 — PDF render: Vercel Function + Chromium + Playwright

**Opcje i ocena**:

| Opcja | Plus | Minus | Verdict |
|---|---|---|---|
| Supabase Edge (Deno) + `pdf-lib` | Wszystko w jednym provider | Programistycznie konstruuję każdy element — wykresy ręcznie SVG, zero CSS, polskie znaki = walka z fontami | **ODPADA** — koszt developmentu vs pdf quality |
| Supabase Edge (Deno) + `react-pdf` | JSX-based | Nie obsługuje dobrze złożonych layoutów (radar charts, grids) | **ODPADA** |
| Vercel Function (Node) + `@sparticuz/chromium` + Playwright | HTML/CSS → PDF = to co znamy; fonts via `@font-face`; branding identyczny jak strona; już mamy Vercel | Cold start 2-5s, 50MB bundle limit, zużycie cpu-seconds | **✅ WYGRYWA** |
| External worker (Railway/Fly.io + Playwright) | Zawsze warm, pełna kontrola | +$5-10/mies dodatkowy provider, nowy deployment pipeline | Overkill na MVP |

**Decyzja**: Vercel Function. Flow:
```
Stripe webhook → Supabase Edge Function (stripe-webhook)
 ↓ update payments + leads
 ↓ call Vercel Function /api/generate-pdf (z service role auth)
 ↓ Vercel pobiera assessment + responses z Supabase
 ↓ renderuje HTML template (zgodny z brand violet) w headless Chromium
 ↓ upload PDF do Supabase Storage (private bucket 'reports')
 ↓ update assessments.report_status = 'ready'
Supabase Edge Function (send-report-email) → Resend z signed link
```

**Package**: `playwright-core@1.49.0` + `@sparticuz/chromium@131.0.0` (najnowsza stabilna para)

### #9 — Questionnaire versioning: strict per-version benchmarks

**Rekomendacja**: `get_benchmark_snapshot(industry, size, version)` filtruje po tej samej wersji.

Dlaczego:
- Pytania v1 vs v2 mogą mieć różne skale, różne wagi → porównanie apple-to-orange = zabija wiarygodność
- `questionnaire_version` już jest w schemacie (Codex) — trzeba tylko dodać filter w RPC
- Gdy wprowadzamy nową wersję → przez pierwsze ~50 assessments fallback na poprzednią wersję (z wyraźnym labelem "Dane z poprzedniej wersji kwestionariusza")

Konkret w RPC:
```sql
select * from public.assessments
where questionnaire_version = p_version
  and industry = p_industry
  and company_size = p_company_size
  and completed_at is not null
```

Koszt: +1 parameter w RPC, +1 filter w SQL. Zero.

Benefit: wiarygodne benchmarki długoterminowo + możliwość A/B testingu wersji kwestionariusza.

## Następny krok — PDF mockupy (przygotowuję teraz)

Generuję **dwa mockupy** strukturalnie różne:
- **Mockup A: Management Report** — 4 strony, executive summary, bar charts, top-5 rekomendacje z ROI
- **Mockup B: Quasi-Certyfikowany Audyt** — 8-10 stron, radar, metoda, mapping NIS2/RODO, formalny podpis/logo audytora, compliance statement

Zapiszę jako static HTML w `docs/planning/02-samoocena/mockups/`. Otwierasz w przeglądarce, "print to PDF" żeby zobaczyć jak wyjdzie finalnie.

## Propozycja kolejności akcji

1. **Ty odpowiadasz na 12 open questions** (najlepiej jednym komunikatem)
2. **Ja wdrażam Fazy 1-3** (page + questionnaire + scoring) jako osobny commit/branch
3. **Ty testujesz flow anonymous** → feedback
4. **Fazy 4-5** (Supabase + benchmark) — wymaga linkowania projektu Supabase (masz credentials?)
5. **Fazy 6-7** (Stripe + PDF + email) — wymaga Stripe test account + Resend account

## Linki

- Knowledge base merytoryczna: [knowledge-base.md](./knowledge-base.md)
- Pełny plan techniczny (31KB, 589 linii): [implementation-plan.md](./implementation-plan.md)
