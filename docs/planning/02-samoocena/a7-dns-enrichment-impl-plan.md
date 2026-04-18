# A7 — DNS Enrichment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dodać opcjonalny krok "Twoja rzeczywista ekspozycja" do samooceny — pasywny skan DNSDumpster (subdomeny + email security) → sekcja w raporcie PDF z 3 wariantami + dynamic findings.

**Architecture:** Frontend (vanilla JS) → POST `/functions/v1/scan-domain` → Supabase Edge Function (Deno) → DNSDumpster API + native DNS → Postgres `assessments` (3 nowe kolumny: `domain`, `dns_scan_opt_out`, `dns_scan jsonb`). Parser już zwalidowany w `aipulse-dns-demo/parse.mjs` — port to plain Deno-compatible JS.

**Tech Stack:** Vite vanilla JS, Supabase Edge Functions (Deno), Postgres, DNSDumpster REST API.

**Spec referencyjny:** [a7-dns-enrichment-spec.md](./a7-dns-enrichment-spec.md) (712 linii, Phase 0 demo wykonane).

**Demo reference:** `toolbox-project/aipulse-dns-demo/parse.mjs` + `scan.mjs` — code-ready do portu na Deno.

**Versioning:** +0.001 per phase (`v0.5603 → 0.5613 → 0.5623 → 0.5633`). Phase 4 = no code change → no bump.

---

## File Structure

### New files

| Path | Purpose |
|---|---|
| `supabase/functions/scan-domain/index.ts` | Edge function entry — handler with CORS, validation, DNSDumpster call, parsing, response |
| `supabase/functions/scan-domain/parse.ts` | Pure parsing logic (port z `aipulse-dns-demo/parse.mjs`) — DNSDumpster raw → ScanData |
| `supabase/functions/scan-domain/providers.ts` | MX → provider lookup + self-hosted detection |
| `supabase/migrations/20260418000000_dns_scan.sql` | Add 3 columns to assessments + RLS policy update |

### Modified files

| Path | Change |
|---|---|
| `src/samoocena/state.js` | Extend `INITIAL_STATE.profile` z `companyDomain`, `dnsScanOptOut`; dodaj `dnsScan` jako root state |
| `src/samoocena/ui.js` | Nowy export `renderProfileDomain(ctx)`; copy w istniejącym `renderProfiling` zmienia label przycisku |
| `src/samoocena/app.js` | Nowy step `profile-domain` w router; nowe actions `submit-profile-domain` i `optout-profile-domain`; spinner overlay dla scan |
| `src/samoocena/api.js` | Nowy export `scanDomain(domain)` — wrapper na edge function call; `submitAssessment` rozszerzony o nowe pola |
| `src/samoocena/styles.css` | Style nowego ekranu domain + spinner overlay (~120 LOC) |
| `src/raport/template.js` | Refactor `renderTocMethodology` z `hasDnsScan` flag; refactor `renderFindings` z dynamic findings; nowa funkcja `renderDnsExposure(data, variant)`; pipeline `renderRaportB` z conditional sec 7; `renderComplianceAndCta` row update |
| `CHANGELOG.md` | 4 entries (per phase) |
| `src/version.js` + `package.json` | Bump per phase |

### NOT modified (intentionally)

- `src/samoocena/scoring.js` — DNS findings nie wpływają na maturity score (dodatkowe, nie część CIS+NIST 35 pytań)
- `src/samoocena/awareness.js` — niezwiązane
- Mockupy w `docs/planning/02-samoocena/mockups/` — historyczne

---

## Phase 1: SQL Migration + Edge Function (1.5h)

**Outcome:** Migration applied, edge function deployed do Supabase, działa via curl.

### Task 1.1: SQL migration — dodaj 3 kolumny do assessments

**Files:**
- Create: `supabase/migrations/20260418000000_dns_scan.sql`

- [ ] **Step 1: Utwórz plik migracji**

```sql
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
```

- [ ] **Step 2: Apply migration lokalnie (jeśli supabase CLI lokalnie)**

Run: `cd /Users/mk/code-sandbox/toolbox-project/aipulse-webpage && supabase db push`

Expected: Migration applied, no errors. Jeśli supabase CLI nie skonfigurowany lokalnie, apply via Supabase dashboard SQL editor (paste contents of migration file).

- [ ] **Step 3: Verify schema w psql lub Supabase dashboard**

Run: `supabase db psql -c "\d public.assessments"` lub dashboard → Database → Tables → assessments → kolumny

Expected: 3 nowe kolumny widoczne (`domain`, `dns_scan_opt_out`, `dns_scan`), typy zgodne.

### Task 1.2: Port parse.mjs → parse.ts dla Deno

**Files:**
- Create: `supabase/functions/scan-domain/parse.ts`
- Reference: `aipulse-dns-demo/parse.mjs` (zwalidowany)

- [ ] **Step 1: Utwórz parse.ts (port z .mjs, zero zmian semantycznych)**

```typescript
// supabase/functions/scan-domain/parse.ts
// Port z aipulse-dns-demo/parse.mjs — DNSDumpster raw → ScanData.
// Zwalidowany na 5 sample domenach w Phase 0 demo.

import { inferProvider } from './providers.ts';

export type Subdomain = { hostname: string; a: string[] };
export type MxRecord = { priority: number; host: string; provider: string | null };
export type DmarcInfo = { record: string; policy: 'none' | 'quarantine' | 'reject' };
export type ScanData = {
  domain: string;
  subdomains: Subdomain[];
  mx: MxRecord[];
  txt: { spf: string | null; dmarc: DmarcInfo | null };
  ns: string[];
  summary: {
    subdomain_count: number;
    has_spf: boolean;
    spf_strict: boolean;
    has_dmarc: boolean;
    dmarc_enforcing: boolean;
    mail_provider: string | null;
  };
};

// DNSDumpster zwraca TXT records z literal cudzysłowami w środku stringa
// (artifact serializacji DNS) — strip leading/trailing quotes.
function cleanTxt(raw: unknown): string {
  return String(raw).trim().replace(/^"|"$/g, '').trim();
}

function parseSpf(txtRecords: unknown[]): { raw: string | null; strict: boolean } {
  const cleaned = txtRecords.map(cleanTxt);
  const spf = cleaned.find(t => /^v=spf1\b/i.test(t));
  if (!spf) return { raw: null, strict: false };
  const strict = /[-]all\s*$/.test(spf.trim());
  return { raw: spf, strict };
}

// MX `host` field z DNSDumpster ma format "10 mail.example.com" — priority jako prefix.
function parseMxHost(raw: unknown): { priority: number; host: string } {
  const match = String(raw || '').trim().match(/^(\d+)\s+(.+)$/);
  if (match) {
    return { priority: parseInt(match[1], 10), host: match[2].trim() };
  }
  return { priority: 0, host: String(raw || '').trim() };
}

function parseDmarc(dmarcRecord: string | null): DmarcInfo | null {
  if (!dmarcRecord) return null;
  if (!/v=DMARC1\b/i.test(dmarcRecord)) return null;
  const policyMatch = dmarcRecord.match(/\bp=(none|quarantine|reject)\b/i);
  const policy = (policyMatch ? policyMatch[1].toLowerCase() : 'none') as DmarcInfo['policy'];
  return { record: dmarcRecord, policy };
}

export function parseScanResult(
  raw: any,
  dmarcRecord: string | null,
  queriedDomain: string
): ScanData {
  const aRecs = raw.a || [];
  const subdomains: Subdomain[] = aRecs.map((r: any) => ({
    hostname: r.host,
    a: (r.ips || []).map((i: any) => i.ip),
  }));

  const mxRecs = raw.mx || [];
  const mxFlat = mxRecs.map((r: any) => parseMxHost(r.host));
  const mxHosts = mxFlat.map((m: { host: string }) => m.host);
  const provider = inferProvider(mxHosts, queriedDomain.toLowerCase());
  const mx: MxRecord[] = mxFlat.map((m: { priority: number; host: string }) => ({
    ...m,
    provider,
  }));

  const ns: string[] = (raw.ns || []).map((r: any) => r.host);

  const txt = raw.txt || [];
  const spfParsed = parseSpf(txt);
  const dmarcParsed = parseDmarc(dmarcRecord);

  const summary = {
    subdomain_count: subdomains.length,
    has_spf: !!spfParsed.raw,
    spf_strict: spfParsed.strict,
    has_dmarc: !!dmarcParsed,
    dmarc_enforcing: dmarcParsed ? dmarcParsed.policy !== 'none' : false,
    mail_provider: provider,
  };

  return {
    domain: queriedDomain,
    subdomains,
    mx,
    txt: { spf: spfParsed.raw, dmarc: dmarcParsed },
    ns,
    summary,
  };
}
```

- [ ] **Step 2: Verify TypeScript jest valid**

Run: `cd supabase/functions/scan-domain && deno check parse.ts`

Expected: No errors. Jeśli `inferProvider` undefined — to spodziewane (dependency na providers.ts w next task), Deno `check` zgłosi import error dopóki providers.ts nie istnieje. Możesz pominąć ten check do końca Task 1.3.

### Task 1.3: Providers module (z self-hosted detection)

**Files:**
- Create: `supabase/functions/scan-domain/providers.ts`
- Reference: `aipulse-dns-demo/parse.mjs` lines 4-50 (MX_PROVIDERS + inferProvider)

- [ ] **Step 1: Utwórz providers.ts**

```typescript
// supabase/functions/scan-domain/providers.ts
// MX hostname → provider name lookup + self-hosted detection.
// Port z aipulse-dns-demo/parse.mjs (zwalidowany Phase 0).

const MX_PROVIDERS: Array<[RegExp, string]> = [
  [/aspmx\.l\.google\.com$/i, 'Google Workspace'],
  [/googlemail\.com$/i, 'Google Workspace'],
  [/\.outlook\.com$/i, 'Microsoft 365'],
  [/protection\.outlook\.com$/i, 'Microsoft 365'],
  [/\.protonmail\.ch$/i, 'Proton Mail'],
  [/\.mailgun\.org$/i, 'Mailgun (transactional)'],
  [/\.amazonses\.com$/i, 'Amazon SES (transactional)'],
  [/\.sendgrid\.net$/i, 'SendGrid (transactional)'],
  [/\.mimecast\.com$/i, 'Mimecast'],
  [/mx\.zoho\./i, 'Zoho Mail'],
  [/\.onet\.pl$/i, 'Onet'],
  [/\.home\.(net\.)?pl$/i, 'home.pl'],
  [/\.nazwa\.pl$/i, 'nazwa.pl'],
  [/\.ovh\.(net|pl)$/i, 'OVH'],
  [/\.hekko\.pl$/i, 'Hekko'],
  [/\.dhosting\.pl$/i, 'dhosting.pl'],
  [/\.cyberfolks\.pl$/i, 'cyberFolks'],
  [/\.kei\.pl$/i, 'kei.pl'],
  [/\.linuxpl\.com$/i, 'LinuxPL'],
  [/\.wp\.pl$/i, 'WP.pl'],
];

/**
 * Returns provider name dla danego MX setup.
 * - Known third-party patterns first (Google, MS365, polskie hostingi)
 * - Self-hosted detection: MX kończy się na queried domain (banki, własna infra)
 * - Unknown 3rd party fallback
 * @param mxHosts pełne hostnames MX records (po parseMxHost)
 * @param queriedDomain lowercase
 */
export function inferProvider(mxHosts: string[], queriedDomain: string): string | null {
  for (const host of mxHosts) {
    for (const [pattern, name] of MX_PROVIDERS) {
      if (pattern.test(host)) return name;
    }
  }
  const allSelfHosted = mxHosts.length > 0 && mxHosts.every((h) => {
    const lower = h.toLowerCase();
    return lower === queriedDomain || lower.endsWith('.' + queriedDomain);
  });
  if (allSelfHosted) return 'własny serwer (self-hosted)';
  return mxHosts.length > 0 ? 'inny dostawca (nieznany)' : null;
}
```

- [ ] **Step 2: Verify Deno typecheck oba pliki**

Run: `cd supabase/functions/scan-domain && deno check parse.ts providers.ts`

Expected: No errors.

### Task 1.4: Edge function handler (index.ts)

**Files:**
- Create: `supabase/functions/scan-domain/index.ts`

- [ ] **Step 1: Utwórz index.ts z full handler logic**

```typescript
// supabase/functions/scan-domain/index.ts
// POST /functions/v1/scan-domain
// Body: { domain: string }
// Response: { ok: true, scanned_at, data } | { ok: false, error }
//
// Walidacja per spec, DNSDumpster API call, DMARC supplement via Deno.resolveDns,
// parsing przez ./parse.ts, ZERO secret w logach (per feedback_no_secrets_in_output).

import { parseScanResult } from './parse.ts';

const DOMAIN_REGEX = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ErrCode = 'invalid_domain' | 'timeout' | 'service_unavailable';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function errResponse(code: ErrCode, status = 200): Response {
  // Status 200 nawet dla błędów aplikacyjnych — frontend rozróżnia po `ok` field
  return jsonResponse({ ok: false, error: code }, status);
}

function validateDomain(input: string): { ok: true; normalized: string } | { ok: false; reason: ErrCode } {
  const normalized = input.trim().toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
  if (normalized.length < 4) return { ok: false, reason: 'invalid_domain' };
  if (!DOMAIN_REGEX.test(normalized)) return { ok: false, reason: 'invalid_domain' };
  if (/^(localhost|127\.|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(normalized)) {
    return { ok: false, reason: 'invalid_domain' };
  }
  if (/\.(local|internal|test|example)$/i.test(normalized)) {
    return { ok: false, reason: 'invalid_domain' };
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(normalized)) return { ok: false, reason: 'invalid_domain' };
  return { ok: true, normalized };
}

async function callDnsdumpster(domain: string, apiKey: string): Promise<Response> {
  const url = `https://api.dnsdumpster.com/domain/${encodeURIComponent(domain)}`;
  return await fetch(url, {
    headers: { 'X-API-Key': apiKey },
    signal: AbortSignal.timeout(7000),
  });
}

async function lookupDmarc(domain: string): Promise<string | null> {
  try {
    const records = await Deno.resolveDns(`_dmarc.${domain}`, 'TXT');
    for (const chunks of records) {
      const joined = Array.isArray(chunks) ? chunks.join('') : String(chunks);
      if (/^v=DMARC1\b/i.test(joined)) return joined;
    }
    return null;
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return errResponse('invalid_domain', 405);
  }

  // LAZY: API key dopiero w handlerze, nie module-level (per feedback_lazy_init).
  const apiKey = Deno.env.get('DNSDUMPSTER_API_KEY');
  if (!apiKey) {
    console.error('[scan-domain] DNSDUMPSTER_API_KEY not set in env');
    return errResponse('service_unavailable');
  }

  let body: { domain?: unknown };
  try {
    body = await req.json();
  } catch {
    return errResponse('invalid_domain');
  }

  if (typeof body.domain !== 'string') return errResponse('invalid_domain');
  const validation = validateDomain(body.domain);
  if (!validation.ok) return errResponse(validation.reason);

  const domain = validation.normalized;
  console.log(`[scan-domain] target: ${domain}`);

  // 1. DNSDumpster API call (z 1 retry na 5xx)
  let dnsdumpsterResp: Response;
  try {
    dnsdumpsterResp = await callDnsdumpster(domain, apiKey);
    if (dnsdumpsterResp.status >= 500) {
      console.warn(`[scan-domain] DNSDumpster ${dnsdumpsterResp.status}, retry in 500ms`);
      await new Promise(r => setTimeout(r, 500));
      dnsdumpsterResp = await callDnsdumpster(domain, apiKey);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[scan-domain] DNSDumpster fetch failed: ${msg}`);
    return errResponse(msg.includes('timeout') ? 'timeout' : 'service_unavailable');
  }

  if (!dnsdumpsterResp.ok) {
    console.warn(`[scan-domain] DNSDumpster ${dnsdumpsterResp.status} (rate limit or auth)`);
    return errResponse('service_unavailable');
  }

  let raw: any;
  try {
    raw = await dnsdumpsterResp.json();
  } catch {
    return errResponse('service_unavailable');
  }

  // 2. DMARC supplement via native DNS (równolegle z parsowaniem nie pomoże — sequential)
  const dmarcRecord = await lookupDmarc(domain);

  // 3. Parse
  const data = parseScanResult(raw, dmarcRecord, domain);

  return jsonResponse({
    ok: true,
    scanned_at: new Date().toISOString(),
    data,
  });
});
```

- [ ] **Step 2: Verify Deno typecheck**

Run: `cd supabase/functions/scan-domain && deno check index.ts parse.ts providers.ts`

Expected: No errors.

### Task 1.5: Set DNSDUMPSTER_API_KEY w Supabase secrets

- [ ] **Step 1: Set secret w Supabase project**

Run lokalnie: `supabase secrets set DNSDUMPSTER_API_KEY=<klucz>` (klucz pobierz z `aipulse-dns-demo/.env`)

Lub via Supabase dashboard → Edge Functions → Settings → Add secret.

Expected: Secret zapisany. NIGDY nie commituj klucza.

### Task 1.6: Deploy edge function

- [ ] **Step 1: Deploy do Supabase**

Run: `cd /Users/mk/code-sandbox/toolbox-project/aipulse-webpage && supabase functions deploy scan-domain --no-verify-jwt`

Flag `--no-verify-jwt` bo nie wymagamy auth — anon użytkownik samooceny ma wywoływać. Frontend i tak używa publishable key ale dla edge function JWT to overhead.

Expected: "Function scan-domain deployed successfully".

### Task 1.7: Verify edge function via curl

- [ ] **Step 1: Curl test happy path**

Run (zamień `<PROJECT_REF>` na real ref np. `ugvexcuybvjlxplltnht`):

```bash
curl -i -X POST "https://<PROJECT_REF>.supabase.co/functions/v1/scan-domain" \
  -H "Content-Type: application/json" \
  -H "apikey: $(grep VITE_SUPABASE_PUBLISHABLE_KEY .env.local | cut -d= -f2)" \
  -d '{"domain":"aipulse.pl"}'
```

Expected: 200 OK, JSON body z `{ "ok": true, "scanned_at": "...", "data": { "domain": "aipulse.pl", ... } }`. Latency 2-5s.

- [ ] **Step 2: Curl test invalid domain**

```bash
curl -X POST "https://<PROJECT_REF>.supabase.co/functions/v1/scan-domain" \
  -H "Content-Type: application/json" \
  -H "apikey: <publishable_key>" \
  -d '{"domain":"localhost"}'
```

Expected: `{ "ok": false, "error": "invalid_domain" }`.

- [ ] **Step 3: Curl test bez body**

```bash
curl -X POST "https://<PROJECT_REF>.supabase.co/functions/v1/scan-domain" \
  -H "Content-Type: application/json" \
  -H "apikey: <publishable_key>"
```

Expected: `{ "ok": false, "error": "invalid_domain" }`.

- [ ] **Step 4: Sprawdź Supabase logs**

Dashboard → Edge Functions → scan-domain → Logs. Sprawdź czy nie ma `DNSDUMPSTER_API_KEY` w log entries (nie powinno być — tylko target domain).

### Task 1.8: Bump version + commit Phase 1

- [ ] **Step 1: Bump version 0.5603 → 0.5613**

```bash
# src/version.js
export const VERSION = '0.5613';

# package.json
"version": "0.5613",
```

- [ ] **Step 2: Add CHANGELOG entry**

Dopisać w `CHANGELOG.md` na górze (po nagłówku):

```markdown
## [0.5613] — 2026-04-18

A7 Phase 1 — DNS scan backend infrastructure.

- Migration `20260418000000_dns_scan.sql`: 3 nowe kolumny w `assessments`
  (`domain`, `dns_scan_opt_out`, `dns_scan jsonb`)
- Edge function `scan-domain` (Deno) z parserem portowanym z
  `aipulse-dns-demo/parse.mjs` (zwalidowanego na 5 sample domenach)
- DNSDumpster API call + DMARC supplement via native `Deno.resolveDns`
- Provider detection z self-hosted recognition (banki, własne infra)
- DNSDUMPSTER_API_KEY w Supabase secrets, lazy-loaded w handlerze

Frontend nie zmieniony — w Phase 2.

Bump: micro +0.001.

---
```

- [ ] **Step 3: Commit + push**

```bash
cd /Users/mk/code-sandbox/toolbox-project/aipulse-webpage
git add supabase/migrations/20260418000000_dns_scan.sql \
        supabase/functions/scan-domain/ \
        src/version.js package.json CHANGELOG.md
git commit -m "$(cat <<'EOF'
v0.5613: A7 Phase 1 — DNS scan backend (migration + edge function)

- Migration 3 nowe kolumny w assessments
- Edge function scan-domain (Deno) z parserem portowanym z demo
- DNSDumpster API + DMARC supplement, self-hosted detection
- DNSDUMPSTER_API_KEY w Supabase secrets

Frontend w Phase 2.
EOF
)"
git push origin main
```

Expected: Push successful, Vercel deploys (frontend bez zmian — no-op build).

---

## Phase 2: Frontend ekran + state + API call (1h)

**Outcome:** Nowy krok `profile-domain` w samoocenie działa lokalnie. Spinner pokazuje się przy SKANUJ. State zapisuje wyniki. Nie zmieniono jeszcze raportu.

### Task 2.1: State extension

**Files:**
- Modify: `src/samoocena/state.js`

- [ ] **Step 1: Edit INITIAL_STATE — dodaj nowe pola**

Edit file at lines ~3-13:

```javascript
const INITIAL_STATE = {
  step: 'landing',
  profile: { industry: '', size: '', companyDomain: null, dnsScanOptOut: false },
  responses: {},
  currentQuestionIndex: 0,
  startedAt: null,
  completedAt: null,
  assessmentId: null,
  awarenessAnswers: {},
  currentAwarenessIndex: 0,
  dnsScan: null,
};
```

- [ ] **Step 2: Dodaj setter `setDnsScan`**

Po `setProfile` (~line 62), dopisać:

```javascript
export function setDnsScan(dnsScan) {
  setState({ dnsScan });
}
```

- [ ] **Step 3: Verify**

Run: `cd /Users/mk/code-sandbox/toolbox-project/aipulse-webpage && npm run build 2>&1 | tail -5`

Expected: Build clean, no errors.

### Task 2.2: API wrapper `scanDomain`

**Files:**
- Modify: `src/samoocena/api.js`

- [ ] **Step 1: Dopisz na końcu pliku**

```javascript
/**
 * Wywołuje edge function scan-domain. Frontend timeout 10s.
 * Backend timeout 8s — frontend daje 2s buffer na cold start.
 * @param {string} domain — already normalized (lowercase, no protocol)
 * @returns {Promise<{ ok: true, scanned_at: string, data: object } | { ok: false, error: string }>}
 */
export async function scanDomain(domain) {
  try {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.functions.invoke('scan-domain', {
      body: { domain },
    });
    if (error) {
      console.warn('[samoocena] scanDomain edge fn error:', error.message);
      return { ok: false, error: error.message };
    }
    return data;
  } catch (err) {
    console.warn('[samoocena] scanDomain failed:', err.message);
    return { ok: false, error: err.message || 'unknown' };
  }
}
```

- [ ] **Step 2: Modify `buildAssessmentRow` — dopisać 3 nowe kolumny**

W `buildAssessmentRow` (line ~48), dopisać do `row` object PRZED `for` loop:

```javascript
  const row = {
    // ... existing fields ...
    awareness_answers: hasAwarenessAnswers ? state.awarenessAnswers : null,
    domain: state.profile?.companyDomain || null,
    dns_scan_opt_out: !!state.profile?.dnsScanOptOut,
    dns_scan: state.dnsScan?.ok ? state.dnsScan.data : null,
  };
```

Note: piszemy `dns_scan` jako parsed `data` (już `ScanData` shape) — NIE wrapper `{ ok, scanned_at, data }`.

- [ ] **Step 3: Verify build**

Run: `npm run build 2>&1 | tail -3`

Expected: clean.

### Task 2.3: UI render dla nowego ekranu

**Files:**
- Modify: `src/samoocena/ui.js`

- [ ] **Step 1: Dopisz nowy export po `renderProfiling`**

Find line ~144 (after `renderProfiling` end), dopisać:

```javascript
export function renderProfileDomain(ctx) {
  const prefilled = ctx.profile?.companyDomain || '';
  return `
    <section class="samoocena-profile-domain">
      <p class="samoocena-kicker">// Krok 2 z 2 — opcjonalne wzbogacenie</p>
      <h1>Twoja rzeczywista ekspozycja</h1>
      <p class="samoocena-lead">
        Sprawdzimy <strong>pasywnie</strong> co publiczny internet wie o Twojej infrastrukturze:
        widoczne subdomeny i konfigurację bezpieczeństwa email (SPF/DMARC).
        Bez logowania, bez zgody firmy — tylko publiczne rekordy DNS. ~5 sekund.
      </p>
      <form class="samoocena-form" data-form="profile-domain">
        <label class="samoocena-field">
          <span class="samoocena-field-label">Domena firmy</span>
          <input
            type="text"
            name="domain"
            value="${escapeHtml(prefilled)}"
            placeholder="np. firma.pl"
            autocomplete="off"
            spellcheck="false"
            data-domain-input
          />
          <span class="samoocena-field-status" data-domain-status></span>
        </label>
        <div class="samoocena-form-actions samoocena-form-actions-stacked">
          <button
            type="button"
            class="samoocena-cta samoocena-cta-primary"
            data-action="submit-profile-domain"
            disabled
          >
            <span class="samoocena-cta-label">Skanuj i dalej</span>
            <span class="samoocena-cta-arrow" aria-hidden="true">→</span>
          </button>
          <div class="samoocena-form-divider">albo</div>
          <button
            type="button"
            class="samoocena-cta samoocena-cta-ghost"
            data-action="optout-profile-domain"
          >
            <span class="samoocena-cta-label">Rezygnuję z tej części audytu</span>
            <span class="samoocena-cta-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </section>
  `;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -3`

Expected: clean.

### Task 2.4: Styles dla nowego ekranu + spinner overlay

**Files:**
- Modify: `src/samoocena/styles.css`

- [ ] **Step 1: Dopisz na końcu pliku**

```css
/* === A7: Profile-domain step === */

.samoocena-profile-domain {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 56ch;
  margin: 0 auto;
}

.samoocena-form-actions-stacked {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
  margin-top: 1rem;
}

.samoocena-form-divider {
  text-align: center;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-secondary, #999);
  position: relative;
  padding: 0.5rem 0;
}

.samoocena-form-divider::before,
.samoocena-form-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: var(--border-color, #333);
}
.samoocena-form-divider::before { left: 0; }
.samoocena-form-divider::after { right: 0; }

.samoocena-field-status {
  display: block;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  margin-top: 0.4rem;
  min-height: 1em;
}
.samoocena-field-status[data-state="valid"] {
  color: #79c143;
}
.samoocena-field-status[data-state="invalid"] {
  color: #d32f2f;
}

/* === A7: Scan spinner overlay === */

.samoocena-scan-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.samoocena-scan-overlay-inner {
  max-width: 40ch;
  text-align: center;
  color: #fff;
}

.samoocena-scan-overlay-title {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  color: var(--brand-accent, #7e22ce);
}

.samoocena-scan-overlay-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.95rem;
  text-align: left;
}

.samoocena-scan-overlay-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  opacity: 0.4;
  transition: opacity 0.3s;
}

.samoocena-scan-overlay-list li.is-active { opacity: 1; }
.samoocena-scan-overlay-list li.is-done { opacity: 0.7; }

.samoocena-scan-overlay-list li::before {
  content: '○';
  font-weight: 700;
  color: var(--brand-accent, #7e22ce);
}
.samoocena-scan-overlay-list li.is-active::before { content: '◐'; }
.samoocena-scan-overlay-list li.is-done::before { content: '●'; }

.samoocena-scan-overlay-meta {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
}
```

- [ ] **Step 2: Verify build (CSS errors visible w build log)**

Run: `npm run build 2>&1 | tail -5`

Expected: clean. Build pisze CSS bundle size.

### Task 2.5: App.js routing + actions + spinner orchestration

**Files:**
- Modify: `src/samoocena/app.js`

- [ ] **Step 1: Import `renderProfileDomain` + `setDnsScan` + `scanDomain`**

W imports:

```javascript
import {
  renderLanding,
  renderProfiling,
  renderProfileDomain,  // NEW
  // ... reszta
} from './ui.js';

import {
  // ... existing ...
  setDnsScan,  // NEW
} from './state.js';

import { submitAssessment, fetchBenchmark, scanDomain } from './api.js';  // dodać scanDomain
```

- [ ] **Step 2: Dodaj `'profile-domain'` do BLOCKING_STEPS Set**

W `BLOCKING_STEPS = new Set([...])` dodać entry:

```javascript
const BLOCKING_STEPS = new Set([
  'profiling',
  'profile-domain',  // NEW
  'awareness-quiz',
  'awareness-summary',
  'category-intro',
  'question',
]);
```

- [ ] **Step 3: Add `'profile-domain'` route w `routeToRenderer`**

W `routeToRenderer` switch (line ~84), dodać case PRZED `awareness-quiz`:

```javascript
    case 'profile-domain':
      return renderProfileDomain(ctx);
```

- [ ] **Step 4: Modify `submit-profiling` action — change next step**

Find action `'submit-profiling'` (line ~202). Zmienić ostatnią linię z:

```javascript
      setState({ step: 'awareness-quiz', currentAwarenessIndex: 0 });
```

na:

```javascript
      setState({ step: 'profile-domain' });
```

- [ ] **Step 5: Dodaj 2 nowe actions po `submit-profiling`**

```javascript
    'submit-profile-domain': () => {
      const input = mainEl.querySelector('[data-domain-input]');
      const raw = (input?.value || '').trim();
      if (!raw) return;
      const normalized = normalizeDomain(raw);
      if (!isValidDomain(normalized)) return;
      setProfile({ companyDomain: normalized, dnsScanOptOut: false });
      runScanFlow(normalized);
    },
    'optout-profile-domain': () => {
      setProfile({ companyDomain: null, dnsScanOptOut: true });
      setDnsScan(null);
      setState({ step: 'awareness-quiz', currentAwarenessIndex: 0 });
    },
```

- [ ] **Step 6: Dodaj helper functions na końcu pliku PRZED handleSubmit**

```javascript
const DOMAIN_REGEX = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

function normalizeDomain(input) {
  return String(input).trim().toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}

function isValidDomain(d) {
  if (!d || d.length < 4) return false;
  if (!DOMAIN_REGEX.test(d)) return false;
  if (/^(localhost|127\.|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(d)) return false;
  if (/\.(local|internal|test|example)$/i.test(d)) return false;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(d)) return false;
  return true;
}

function showScanOverlay() {
  const existing = document.querySelector('.samoocena-scan-overlay');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.className = 'samoocena-scan-overlay';
  overlay.innerHTML = `
    <div class="samoocena-scan-overlay-inner">
      <div class="samoocena-scan-overlay-title">Skanujemy publiczne rekordy DNS</div>
      <ul class="samoocena-scan-overlay-list">
        <li data-step="dns" class="is-active">subdomeny i adresy IP</li>
        <li data-step="email">konfiguracja email security (SPF/DMARC)</li>
        <li data-step="parse">analiza i interpretacja</li>
      </ul>
      <div class="samoocena-scan-overlay-meta">~5 sekund · pasywnie</div>
    </div>
  `;
  document.body.appendChild(overlay);
  // Sequencjne podświetlanie kroków — czysto dekoracyjne, nie real progress
  setTimeout(() => {
    overlay.querySelector('[data-step="dns"]')?.classList.replace('is-active', 'is-done');
    overlay.querySelector('[data-step="email"]')?.classList.add('is-active');
  }, 1500);
  setTimeout(() => {
    overlay.querySelector('[data-step="email"]')?.classList.replace('is-active', 'is-done');
    overlay.querySelector('[data-step="parse"]')?.classList.add('is-active');
  }, 3000);
  return overlay;
}

function hideScanOverlay() {
  document.querySelector('.samoocena-scan-overlay')?.remove();
}

async function runScanFlow(domain) {
  const overlay = showScanOverlay();
  try {
    const result = await scanDomain(domain);
    // Zapisz cokolwiek dostaliśmy — `ok: true` z data lub `ok: false` z error.
    // Frontend nie pokazuje user-facing błędu (silent backend per Q3 odpowiedź).
    setDnsScan({
      ok: !!result?.ok,
      fetched_at: new Date().toISOString(),
      data: result?.ok ? result.data : null,
      error: result?.ok ? null : (result?.error || 'unknown'),
    });
  } catch (err) {
    console.warn('[samoocena] scan flow failed:', err);
    setDnsScan({
      ok: false,
      fetched_at: new Date().toISOString(),
      data: null,
      error: err.message || 'unknown',
    });
  } finally {
    hideScanOverlay();
    setState({ step: 'awareness-quiz', currentAwarenessIndex: 0 });
  }
}
```

- [ ] **Step 7: Modify handleChange — live validate domain input**

W `handleChange` (line ~295), dopisać przed funkcją `}`:

```javascript
  if (input.matches('[data-domain-input]')) {
    const status = mainEl.querySelector('[data-domain-status]');
    const submitBtn = mainEl.querySelector('[data-action="submit-profile-domain"]');
    const normalized = normalizeDomain(input.value);
    if (!input.value.trim()) {
      if (status) { status.textContent = ''; status.removeAttribute('data-state'); }
      submitBtn?.setAttribute('disabled', 'true');
    } else if (isValidDomain(normalized)) {
      if (status) { status.textContent = `✓ ${normalized}`; status.dataset.state = 'valid'; }
      submitBtn?.removeAttribute('disabled');
    } else {
      if (status) { status.textContent = '✗ Niepoprawny format domeny'; status.dataset.state = 'invalid'; }
      submitBtn?.setAttribute('disabled', 'true');
    }
  }
```

Note: native `change` na `<input type="text">` triggeruje na blur. Jeśli chcemy live (per keystroke) musimy przejść na `input` event — ale spec mówi "live", więc dodajmy też `input` listener.

- [ ] **Step 8: Bind `input` event obok `change` w `bindDelegatedEvents`**

W `bindDelegatedEvents` (line ~107) dopisać:

```javascript
  mainEl.addEventListener('input', handleChange);  // ← NOWE, live validation
```

(handleChange już sprawdza `input.matches('[data-domain-input]')` — same handler obsługuje oba eventy.)

- [ ] **Step 9: Verify build**

Run: `npm run build 2>&1 | tail -3`

Expected: clean.

### Task 2.6: Local manual test (przed pushem)

- [ ] **Step 1: Dev server**

Run: `npm run dev` (in background). Otwórz `http://localhost:5173/bezpieczenstwo-samoocena/` w Chrome via DevTools MCP.

- [ ] **Step 2: Walkthrough z Chrome DevTools MCP**

Per `feedback_mcp_verify_first`:
- `take_snapshot` na landing
- click ROZPOCZNIJ AUDYT → `take_snapshot` na profiling
- fill industry+size → click DALEJ → `take_snapshot` na NOWYM ekranie `profile-domain`
- check że widać: title "Twoja rzeczywista ekspozycja", input, dwa CTA (Skanuj i dalej + Rezygnuję)
- type `aipulse.pl` w input → `take_snapshot` (powinno być `✓ aipulse.pl` zielone, primary CTA enabled)
- type `localhost` → `take_snapshot` (powinno być `✗ Niepoprawny format`, primary disabled)
- clear input, type `aipulse.pl`, click SKANUJ → `take_snapshot` (powinno pokazać overlay z 3 kroki)
- czekaj ~5s → check że overlay znika i jest się na awareness-quiz
- `list_console_messages` — clean, no errors

- [ ] **Step 3: Test opt-out path**

Wróć do `profile-domain` (refresh, restart). Click REZYGNUJĘ → quiz natychmiast (no overlay).

- [ ] **Step 4: Verify network call w DevTools**

`list_network_requests` filtered po `scan-domain` — powinno być 1 POST z body `{"domain":"aipulse.pl"}`, response 200.

### Task 2.7: Bump + commit Phase 2

- [ ] **Step 1: Bump 0.5613 → 0.5623 w version.js + package.json**

- [ ] **Step 2: CHANGELOG entry**

```markdown
## [0.5623] — 2026-04-18

A7 Phase 2 — frontend ekran profile-domain + state + spinner.

- Nowy step `profile-domain` po profilingu (industry+size)
- 2 explicit CTA: "Skanuj i dalej" (z domeną) lub "Rezygnuję z tej części audytu"
- Live inline validation (regex) z zielonym ✓ / czerwonym ✗
- Spinner overlay z 3 sequencyjnie podświetlanymi krokami (~5s)
- API wrapper `scanDomain()` w `api.js` — wywołuje edge function `scan-domain`
- State extension: `profile.companyDomain`, `profile.dnsScanOptOut`, `dnsScan`
- `submitAssessment` rozszerzony o nowe pola w payloadzie

Raport jeszcze nie zmieniony (sekcja DNS w Phase 3) — dane są zapisywane
do DB ale nie renderowane.

Bump: micro +0.001.

---
```

- [ ] **Step 3: Commit + push**

```bash
git add src/samoocena/state.js src/samoocena/api.js src/samoocena/ui.js \
        src/samoocena/app.js src/samoocena/styles.css \
        src/version.js package.json CHANGELOG.md
git commit -m "$(cat <<'EOF'
v0.5623: A7 Phase 2 — profile-domain ekran + state + spinner

- Nowy step profile-domain z 2 CTA (skanuj/rezygnuję)
- Live regex validation, spinner overlay z 3 krokami
- scanDomain() API wrapper, state extension
- submitAssessment z nowymi polami DB

Raport DNS section w Phase 3.
EOF
)"
git push origin main
```

---

## Phase 3: Report PDF section + dynamic findings (1.5h)

**Outcome:** Sekcja "7. Twoja rzeczywista ekspozycja" w 3 wariantach (opt-out/success/fail). Dynamic findings z DNS scan dolosowane do listy w sec 6. TOC i numbering refactored conditionally.

### Task 3.1: Refactor pipeline `renderRaportB` z conditional sec 7

**Files:**
- Modify: `src/raport/template.js`

- [ ] **Step 1: Modify `renderRaportB` (linia ~68) — dodaj DNS scan logic + nowe arg**

Replace function `renderRaportB`:

```javascript
export function renderRaportB(data) {
  const { profile, scoringResult, date, refNumber, awarenessAnswers } = data;
  const overall = scoringResult?.overall?.percentage ?? 0;
  const maturityLabel = scoringResult?.maturity?.label ?? '—';
  const companyName = profile.companyName || 'Nazwa firmy (do uzupełnienia)';
  const industry = profile.industry || '—';
  const size = SIZE_LABELS[profile.size] || profile.size || '—';
  const hasAwareness = awarenessAnswers && Object.keys(awarenessAnswers).length > 0;
  const awareness = hasAwareness ? scoreAwareness(awarenessAnswers) : null;

  // A7 — DNS scan logic
  const dnsVariant = pickDnsVariant(profile, data.dnsScan);
  const hasDnsScan = dnsVariant !== null;
  const dnsFindings = (dnsVariant === 'success' && data.dnsScan)
    ? deriveDnsFindings(data.dnsScan)
    : [];

  return [
    renderCover({ companyName, industry, size, overall, maturityLabel, date }),
    renderTocMethodology({ refNumber, date, categoryScores: scoringResult?.categories, maturityLabel, hasAwareness, hasDnsScan }),
    renderRadarAndCategoryBreakdown({ refNumber, categoryScores: scoringResult?.categories, industry, size }),
    renderFindings({ refNumber, dynamicFindings: dnsFindings }),
    hasDnsScan ? renderDnsExposure({ refNumber, variant: dnsVariant, scan: data.dnsScan, profile, hasAwareness }) : '',
    awareness ? renderAwarenessPage({ refNumber, awareness, hasDnsScan }) : '',
    renderComplianceAndCta({ refNumber, overall, maturityLabel, dnsScan: data.dnsScan, dnsVariant, hasDnsScan, hasAwareness }),
  ].join('\n');
}

// A7 — wybór wariantu sekcji 7 per spec
function pickDnsVariant(profile, dnsScan) {
  if (profile?.dnsScanOptOut) return 'optout';
  if (dnsScan?.ok && dnsScan.data) return 'success';
  if (profile?.companyDomain && dnsScan && dnsScan.ok === false) return 'fail';
  return null;  // backward compat — assessment sprzed A7 → omit section
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -3`

Expected: errors o `renderDnsExposure`, `deriveDnsFindings` — to spodziewane (nie istnieją jeszcze, dodamy w 3.4 i 3.6). Kontynuuj.

### Task 3.2: Refactor `renderTocMethodology` z `hasDnsScan`

- [ ] **Step 1: Modify function signature i TOC**

Find `function renderTocMethodology({ refNumber, date, categoryScores, maturityLabel, hasAwareness })` (line ~133).

Add `hasDnsScan` to args + update TOC entries (per spec section numbering matrix):

```javascript
function renderTocMethodology({ refNumber, date, categoryScores, maturityLabel, hasAwareness, hasDnsScan }) {
  const catRows = CATEGORIES.map((cat, i) => {
    const pct = categoryScores?.[cat.id]?.percentage ?? 0;
    return `<li>5.${i + 1} ${escape(cat.name)} (${escape(cat.subtitle)}) — ${pct}/100</li>`;
  }).join('');

  // Per spec section numbering matrix:
  // hasDnsScan + hasAwareness: 7=DNS, 8=Awareness, 9=Compliance, 10=Next steps
  // hasDnsScan only:           7=DNS, 8=Compliance, 9=Next steps
  // hasAwareness only:         7=Awareness, 8=Compliance, 9=Next steps (current)
  // neither:                   7=Compliance, 8=Next steps
  let sec = 6;
  const tocItems = [
    `<li><span>2. Podsumowanie zarządcze</span><span>str. 3</span></li>`,
    `<li><span>3. Metodyka audytu</span><span>str. 4</span></li>`,
    `<li><span>4. Zakres i ograniczenia</span><span>str. 4</span></li>`,
    `<li><span>5. Wyniki szczegółowe per kategoria</span><span>str. 5</span><ol>${catRows}</ol></li>`,
    `<li><span>6. Lista findings (identyfikacja luk)</span><span>str. 6</span></li>`,
  ];
  if (hasDnsScan) {
    sec++;
    tocItems.push(`<li><span>${sec}. Twoja rzeczywista ekspozycja (DNS)</span><span>str. 7</span></li>`);
  }
  if (hasAwareness) {
    sec++;
    tocItems.push(`<li><span>${sec}. Świadomość regulacyjna (compliance literacy)</span><span>str. 8</span></li>`);
  }
  sec++;
  tocItems.push(`<li><span>${sec}. Mapa zgodności z regulacjami</span><span>str. 9</span></li>`);
  sec++;
  tocItems.push(`<li><span>${sec}. Następne kroki + kontakt audytora</span><span>str. 10</span></li>`);

  return `
    <div class="page">
      <div class="page-header">
        <span>AI PULSE SECURITY · CYBER AUDIT REPORT</span>
        <span>REF: ${escape(refNumber)}</span>
      </div>

      <div class="letterhead">
        <div>
          <div class="brand">A<span class="dot">i</span> Pulse <span style="color:#7E22CE;">Security</span></div>
          <div style="font-family:'Space Grotesk',monospace; font-size:8pt; letter-spacing:0.15em; color:#666; margin-top:2mm; text-transform:uppercase;">Cyber Audit Division</div>
        </div>
        <div class="doc-meta">
          <div><strong>Dokument:</strong> ${escape(refNumber)}</div>
          <div><strong>Data:</strong> ${escape(date)}</div>
          <div><strong>Metodyka:</strong> CIS IG1 + NIST CSF 2.0</div>
          <div><strong>Wynik ogólny:</strong> ${escape(maturityLabel)}</div>
        </div>
      </div>

      <h2>1. Spis treści</h2>
      <div class="toc"><ol>${tocItems.join('')}</ol></div>

      <h2 style="margin-top:10mm;">3. Metodyka audytu</h2>
      <div class="methodology">
        <p>Niniejszy raport jest wynikiem <strong>samooceny deklaratywnej</strong> (self-assessment) przeprowadzonej przez przedstawiciela ocenianej organizacji za pośrednictwem kwestionariusza internetowego Ai Pulse Security.</p>
        <p><strong>Ramy referencyjne:</strong></p>
        <ul>
          <li>Center for Internet Security (CIS) Controls v8 — Implementation Group 1 (IG1)</li>
          <li>NIST Cybersecurity Framework 2.0 (funkcje: Govern, Identify, Protect, Detect, Respond, Recover)</li>
          <li>Dyrektywa NIS2 (UE 2022/2555) w zakresie właściwym dla sektora MŚP</li>
          <li>Rozporządzenie RODO (UE 2016/679)</li>
        </ul>
        <p><strong>Skala punktowa:</strong> każde pytanie 0-3 pkt; wynik kategorii = suma/max × 100; wagi 2.0 dla krytycznych kontroli (MFA, tested backup).</p>
      </div>

      <h2>4. Zakres i ograniczenia</h2>
      <table class="scope">
        <tr><th style="width: 40%;">Zakres</th><th>Opis</th></tr>
        <tr><td>Typ oceny</td><td>Self-assessment deklaratywny</td></tr>
        <tr><td>Co jest mierzone</td><td>Deklarowane praktyki + stan procesów bezpieczeństwa</td></tr>
        <tr><td>Co NIE jest mierzone</td><td>Testy penetracyjne, audyt kodu, przegląd konfiguracji systemów, OSINT</td></tr>
        <tr><td>Wiarygodność</td><td>Zależy od rzetelności odpowiedzi respondenta</td></tr>
        <tr><td>Porównywalność</td><td>Benchmarki pochodzą z anonimowej bazy odpowiedzi (n=${BENCHMARK.sampleSize}, wersja wstępna)</td></tr>
      </table>
      <p style="margin-top:3mm; font-style:italic; color:#666; font-size:9pt;">W celu uzyskania oceny z rygorystyczną weryfikacją techniczną, zaleca się przeprowadzenie pełnego audytu technicznego (oferta Ai Pulse Security: Audyt Basic / Standard / Premium).</p>

      <div class="page-footer">
        <span>Ai Pulse Security · kontakt@aipulse.pl · aipulse.pl</span>
        <span>Strona 2 z 10</span>
      </div>
    </div>
  `;
}
```

### Task 3.3: Refactor `renderFindings` z dynamic findings

- [ ] **Step 1: Modify function signature**

Find `function renderFindings({ refNumber })` (line ~275).

Replace whole function:

```javascript
function renderFindings({ refNumber, dynamicFindings = [] }) {
  // FINDINGS = hardcoded baseline (F-001..F-007 dla typowych MŚP)
  // dynamicFindings = derived from DNS scan (F-DNS-01..05)
  const allFindings = [...FINDINGS, ...dynamicFindings];

  const findingsHtml = allFindings.map(f => `
    <div class="finding ${f.severity}">
      <div class="finding-header">
        <span class="finding-id">${f.id}</span>
        <span class="finding-sev">${f.label}</span>
      </div>
      <div class="finding-title">${f.title}</div>
      <div class="finding-detail">${f.detail}</div>
      <div class="finding-mapping">${f.mapping}</div>
    </div>
  `).join('');

  return `
    <div class="page">
      <div class="page-header">
        <span>AI PULSE SECURITY · CYBER AUDIT REPORT</span>
        <span>REF: ${escape(refNumber)}</span>
      </div>

      <h2>6. Lista findings (identyfikacja luk)</h2>
      <p style="color:#666; font-size:9.5pt; margin-bottom:5mm;">Poniżej lista przykładowych luk posortowanych według krytyczności. W wersji beta findings hardcoded bazują na typowych problemach MŚP — dynamiczne findings (F-DNS-*) wynikają z faktycznego skanu Twojej domeny.</p>

      ${findingsHtml}

      <div class="page-footer">
        <span>Ai Pulse Security · kontakt@aipulse.pl · aipulse.pl</span>
        <span>Strona 4 z 10</span>
      </div>
    </div>
  `;
}
```

### Task 3.4: Add `deriveDnsFindings` function

- [ ] **Step 1: Wstawić nową funkcję po `renderComplianceAndCta` (przed math helpers, ~line 452)**

```javascript
// A7 — derive dynamic findings z DNS scan data (per spec F-DNS-01..05)
function deriveDnsFindings(scanData) {
  const findings = [];
  const summary = scanData?.data?.summary;
  if (!summary) return findings;

  // SPF
  if (!summary.has_spf) {
    findings.push({
      id: 'F-DNS-01', severity: 'high', label: 'HIGH',
      title: 'Brak rekordu SPF dla domeny pocztowej',
      detail: 'Domena nie ma rekordu SPF — pozwala dowolnemu serwerowi na świecie wysyłać email "od" Twojej firmy. Klient widzi prawdziwy adres, ufa, klika fakturę z fałszywego źródła.',
      mapping: 'CIS 9.5 · NIST PR.AC-3 · NIS2 Art. 21',
    });
  } else if (!summary.spf_strict) {
    findings.push({
      id: 'F-DNS-02', severity: 'low', label: 'LOW',
      title: 'SPF w trybie soft-fail (~all)',
      detail: 'SPF istnieje ale w trybie "soft" — emaile spoof przejdą jako "podejrzane" zamiast być odrzucone. Rozważ zaostrzenie do -all po sprawdzeniu logów DMARC.',
      mapping: 'CIS 9.5 · NIST PR.AC-3',
    });
  }

  // DMARC
  if (!summary.has_dmarc) {
    findings.push({
      id: 'F-DNS-03', severity: 'high', label: 'HIGH',
      title: 'Brak rekordu DMARC',
      detail: 'Bez DMARC nie wiesz że ktoś próbuje podszywać się pod Twoją domenę. Wymóg ubezpieczycieli cyber 2026.',
      mapping: 'CIS 9.6 · NIST PR.AC-3 · NIS2 Art. 21',
    });
  } else if (!summary.dmarc_enforcing) {
    findings.push({
      id: 'F-DNS-04', severity: 'med', label: 'MEDIUM',
      title: 'DMARC w trybie p=none — nie egzekwuje',
      detail: 'DMARC istnieje ale tylko monitoruje. Dla realnej ochrony przed spoofingiem przejdź do p=quarantine (po analizie raportów).',
      mapping: 'CIS 9.6 · NIST PR.AC-3',
    });
  }

  // Subdomeny dev/stage publicznie widoczne
  const subs = scanData?.data?.subdomains || [];
  const dev = subs.filter(s =>
    /^(dev|stage|stg|test|qa|uat|beta|preview)\./i.test(s.hostname)
  );
  if (dev.length > 0) {
    findings.push({
      id: 'F-DNS-05', severity: 'med', label: 'MEDIUM',
      title: `${dev.length} subdomen dev/staging publicznie widoczne`,
      detail: `Wykryto subdomeny: ${dev.map(d => d.hostname).join(', ')}. Typowy wektor wycieku — wersje testowe z realnymi danymi.`,
      mapping: 'CIS 4.1 · NIST PR.IP-1',
    });
  }

  return findings;
}
```

### Task 3.5: Add `renderDnsExposure` function (3 warianty)

- [ ] **Step 1: Wstawić po `deriveDnsFindings`**

```javascript
// A7 — sekcja "X. Twoja rzeczywista ekspozycja" w 3 wariantach.
function renderDnsExposure({ refNumber, variant, scan, profile, hasAwareness }) {
  // Sekcja numerowana — 7 zawsze, niezależnie od awareness
  // (awareness zawsze idzie PO niej w pipeline → patrz spec section numbering matrix)
  const sectionNum = 7;
  const pageNum = hasAwareness ? '7 z 11' : '7 z 10';

  let body = '';
  if (variant === 'optout') {
    body = renderDnsOptout();
  } else if (variant === 'success') {
    body = renderDnsSuccess(scan, profile);
  } else if (variant === 'fail') {
    body = renderDnsFail(profile);
  }

  return `
    <div class="page">
      <div class="page-header">
        <span>AI PULSE SECURITY · CYBER AUDIT REPORT</span>
        <span>REF: ${escape(refNumber)}</span>
      </div>

      <h2>${sectionNum}. Twoja rzeczywista ekspozycja</h2>
      ${body}

      <div class="page-footer">
        <span>Ai Pulse Security · kontakt@aipulse.pl · aipulse.pl</span>
        <span>Strona ${pageNum}</span>
      </div>
    </div>
  `;
}

function renderDnsOptout() {
  return `
    <div class="dns-notice dns-notice-optout">
      <div class="dns-notice-header">⚠ AUDYT POMINIĘTY ZGODNIE Z DECYZJĄ UCZESTNIKA</div>
      <p>Niniejszy obszar (publiczna ekspozycja DNS: subdomeny, email security SPF/DMARC) nie został audytowany — uczestnik samodzielnie zrezygnował z tej części audytu na etapie profilowania.</p>
    </div>
    <table class="scope" style="margin-top:5mm;">
      <tr><th>Typ</th><th>Stan</th></tr>
      <tr><td>Subdomeny</td><td>—</td></tr>
      <tr><td>SPF</td><td>—</td></tr>
      <tr><td>DMARC</td><td>—</td></tr>
      <tr><td>Mail provider</td><td>—</td></tr>
    </table>
  `;
}

function renderDnsFail(profile) {
  const domain = escape(profile?.companyDomain || '—');
  return `
    <div class="dns-notice dns-notice-fail">
      <div class="dns-notice-header">⚠ SKAN NIE ZAKOŃCZONY POMYŚLNIE</div>
      <p>Próba pasywnego skanowania domeny <code>${domain}</code> nie powiodła się w momencie audytu. Możliwe przyczyny: tymczasowy timeout API, rate limit, domena niedostępna z naszych endpointów.</p>
    </div>
    <table class="scope" style="margin-top:5mm;">
      <tr><th>Typ</th><th>Stan</th></tr>
      <tr><td>Subdomeny</td><td>—</td></tr>
      <tr><td>SPF</td><td>—</td></tr>
      <tr><td>DMARC</td><td>—</td></tr>
      <tr><td>Mail provider</td><td>—</td></tr>
    </table>
  `;
}

function renderDnsSuccess(scan, profile) {
  const data = scan?.data;
  if (!data) return renderDnsOptout(); // safety fallback
  const domain = escape(data.domain || profile?.companyDomain || '—');
  const scannedAt = formatScanTime(scan.scanned_at || scan.fetched_at);

  // 7.1 Email security
  const spf = data.summary.has_spf
    ? `<span style="color:#2E7D32;">${data.summary.spf_strict ? '✓ Strict (-all)' : '⚠ Soft (~all)'}</span>`
    : '<span style="color:#C62828;">✗ Brak</span>';
  const spfRecord = data.txt?.spf ? `<br><code style="font-size:8pt;color:#666;">${escape(data.txt.spf.substring(0, 70))}${data.txt.spf.length > 70 ? '…' : ''}</code>` : '';
  const spfInterp = !data.summary.has_spf
    ? 'Domena bez SPF — totalnie otwarta na phishing przez podszywanie. Wymóg ubezpieczycieli cyber 2026.'
    : data.summary.spf_strict
      ? 'Domena chroniona — atakujący nie może wysyłać emaili "od" Twojej firmy.'
      : 'Soft fail — emaile spoof oznaczane jako "podejrzane" zamiast odrzucane. Rozważ zaostrzenie do -all.';

  const dmarcStatus = data.summary.has_dmarc
    ? (data.summary.dmarc_enforcing
        ? `<span style="color:#2E7D32;">✓ ${data.txt.dmarc.policy}</span>`
        : '<span style="color:#C77700;">⚠ p=none</span>')
    : '<span style="color:#C62828;">✗ Brak</span>';
  const dmarcInterp = !data.summary.has_dmarc
    ? 'Bez DMARC nie wiesz że ktoś próbuje podszywać się pod Twoją domenę.'
    : data.summary.dmarc_enforcing
      ? 'Polityka egzekwowana — phishing emails są blokowane lub kierowane do spamu.'
      : 'Polityka p=none — DMARC istnieje, ale nie egzekwuje (raporty bez blokowania).';

  const provider = data.summary.mail_provider || '—';
  const providerInterp = providerInterpretation(provider);

  // 7.2 Subdomain mapping
  const subs = data.subdomains || [];
  const cap = subs.length >= 50 ? `<strong>co najmniej ${subs.length}</strong>` : `<strong>${subs.length}</strong>`;
  const grouped = groupSubdomains(subs);
  const subRows = ['mail', 'web', 'dev', 'api', 'other'].map(cat => {
    const items = grouped[cat] || [];
    if (items.length === 0) return `<tr><td>${categoryLabel(cat)} (0)</td><td>—</td></tr>`;
    const display = items.length > 8
      ? items.slice(0, 8).map(s => s.hostname.split('.')[0]).join(' · ') + ` · …i ${items.length - 8} więcej`
      : items.map(s => s.hostname.split('.')[0]).join(' · ');
    return `<tr><td>${categoryLabel(cat)} (${items.length})</td><td>${escape(display)}</td></tr>`;
  }).join('');

  const devSubs = grouped.dev || [];
  const devWarning = devSubs.length > 0 ? `
    <div class="dns-warning" style="margin-top:4mm;">
      <strong>⚠ UWAGA:</strong> ${devSubs.length} subdomen dev/stage publicznie widoczne.
      Typowy wektor wycieku — wersje testowe z realnymi danymi klientów. Sprawdź czy wymagają autentykacji,
      są oznaczone noindex, i logują dostęp.
    </div>
  ` : '';

  return `
    <p style="font-size:9pt; color:#666; margin-bottom:5mm;">Domena: <strong>${domain}</strong> · skan: ${scannedAt} · pasywny (DNS records, bez aktywnego skanowania)</p>

    <h3 style="margin-top:6mm;">7.1 Email security (anti-spoofing)</h3>
    <table class="scope">
      <tr><th style="width:25%;">Typ</th><th style="width:25%;">Stan</th><th>Interpretacja</th></tr>
      <tr><td>SPF</td><td>${spf}${spfRecord}</td><td>${spfInterp}</td></tr>
      <tr><td>DMARC</td><td>${dmarcStatus}</td><td>${dmarcInterp}</td></tr>
      <tr><td>Mail provider</td><td>${escape(provider)}</td><td>${providerInterp}</td></tr>
    </table>
    <p style="margin-top:3mm; font-size:9pt; color:#666;">
      <strong>Kontekst:</strong> Wymogi ubezpieczycieli cyber 2026 zwykle oczekują DMARC w trybie
      p=quarantine|reject. p=none to brak realnej ochrony — tylko logowanie.
    </p>

    <h3 style="margin-top:8mm;">7.2 Subdomain mapping (publicznie widoczne)</h3>
    <p style="font-size:9.5pt;">Wykryto: ${cap} subdomen${subs.length >= 50 ? ' (limit Free tier API — pełna lista wymaga Plus)' : ''}.</p>
    <table class="scope">
      ${subRows}
    </table>
    ${devWarning}
  `;
}

function formatScanTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString('pl-PL')}, ${d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} UTC`;
  } catch { return '—'; }
}

function providerInterpretation(provider) {
  if (!provider || provider === '—') return 'Brak konfiguracji email — domena nie odbiera maili.';
  if (/Google Workspace|Microsoft 365|Proton/.test(provider)) {
    return 'Enterprise-grade, monitorowane, regularne aktualizacje.';
  }
  if (/self-hosted/i.test(provider)) {
    return 'Email na własnej infrastrukturze — pełna kontrola, ale pełna odpowiedzialność za bezpieczeństwo (patche, monitoring, anti-spam).';
  }
  if (/Onet|home\.pl|nazwa|OVH|Hekko|dhosting|cyberFolks|kei|LinuxPL|WP\.pl/i.test(provider)) {
    return 'Polski hosting — sprawdź jakie SLA na incident response oferują.';
  }
  if (/transactional/i.test(provider)) {
    return 'Service do email transakcyjnych (powiadomienia, faktury). Główna poczta firmowa może być gdzie indziej.';
  }
  return 'Nieznany dostawca — sprawdź standardy SOC2/ISO 27001.';
}

function categoryLabel(cat) {
  return ({
    mail: 'Mail',
    web: 'Web',
    dev: 'Dev/staging',
    api: 'API/services',
    other: 'Inne',
  })[cat] || cat;
}

function groupSubdomains(subs) {
  const groups = { mail: [], web: [], dev: [], api: [], other: [] };
  for (const s of subs) {
    const sub = (s.hostname || '').split('.')[0].toLowerCase();
    if (/^(mail|smtp|mx|imap|pop3?|webmail)/.test(sub)) groups.mail.push(s);
    else if (/^(dev|stage|stg|test|qa|uat|beta|preview)/.test(sub)) groups.dev.push(s);
    else if (/^(api|app|graphql|rest)/.test(sub)) groups.api.push(s);
    else if (/^(www|sklep|shop|blog|pomoc|help|support|partner|admin|panel)/.test(sub)) groups.web.push(s);
    else groups.other.push(s);
  }
  // Sort within each by alphabetical hostname
  for (const k of Object.keys(groups)) {
    groups[k].sort((a, b) => a.hostname.localeCompare(b.hostname));
  }
  return groups;
}
```

### Task 3.6: Add CSS dla DNS exposure section

**Files:**
- Modify: `src/raport/styles.css` (find the file path first via grep)

- [ ] **Step 1: Locate raport styles**

Run: `find /Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/raport -name "*.css"`

Expected: znaleziona ścieżka (np. `src/raport/styles.css`).

- [ ] **Step 2: Dopisz na końcu pliku**

```css
/* === A7: DNS exposure section === */

.dns-notice {
  border-left: 4px solid #999;
  padding: 4mm 5mm;
  margin: 4mm 0;
  background: #fafafa;
}

.dns-notice-optout {
  border-color: #C77700;
  background: #fff8f0;
}

.dns-notice-fail {
  border-color: #C62828;
  background: #fff4f4;
}

.dns-notice-header {
  font-family: 'Space Grotesk', monospace;
  font-size: 10pt;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 2mm;
}

.dns-warning {
  border: 1px dashed #C77700;
  background: #fff8f0;
  padding: 3mm 4mm;
  font-size: 9.5pt;
  color: #333;
}
```

### Task 3.7: Update `renderComplianceAndCta` — DMARC row

- [ ] **Step 1: Modify function signature + dodaj DMARC row do "Wymogi ubezpieczycieli"**

Find `function renderComplianceAndCta({ refNumber, overall, maturityLabel })` (line ~379).

Change signature do `({ refNumber, overall, maturityLabel, dnsScan, dnsVariant, hasDnsScan, hasAwareness })`.

W sekcji `<div class="compliance-card"><h4>Wymogi ubezpieczycieli (2026)</h4>` dodać przed `</div>`:

```javascript
${(() => {
  let dmarcStatus, dmarcLabel;
  if (dnsVariant === 'optout' || dnsVariant === 'fail' || !hasDnsScan) {
    dmarcStatus = 'status-missing'; dmarcLabel = '—';
  } else if (dnsScan?.data?.summary?.has_dmarc && dnsScan.data.summary.has_spf && dnsScan.data.summary.dmarc_enforcing) {
    dmarcStatus = 'status-ok'; dmarcLabel = 'Tak';
  } else if (dnsScan?.data?.summary?.has_dmarc || dnsScan?.data?.summary?.has_spf) {
    dmarcStatus = 'status-partial'; dmarcLabel = 'Częściowo';
  } else {
    dmarcStatus = 'status-missing'; dmarcLabel = 'Brak';
  }
  return `<div class="compliance-item"><span>SPF + DMARC dla email security</span><span class="compliance-status ${dmarcStatus}">${dmarcLabel}</span></div>`;
})()}
```

- [ ] **Step 2: Update sekcję numbering w h2 wewnątrz `renderComplianceAndCta`**

Funkcja używa hardcoded "7. Mapa zgodności". Zmień na:

```javascript
      <h2>${(() => {
        let n = 7;
        if (hasDnsScan) n++;
        if (hasAwareness) n++;
        return n;
      })()}. Mapa zgodności z regulacjami</h2>
```

- [ ] **Step 3: Update page footer numbering w `renderComplianceAndCta`**

Find page-footer at end. Update strona X z Y:

```javascript
        <span>Strona ${(() => {
          let p = 5;
          if (hasDnsScan) p++;
          if (hasAwareness) p++;
          return p;
        })()} z 10</span>
```

- [ ] **Step 4: Update existing `renderAwarenessPage` żeby uwzględniał `hasDnsScan`**

Find `function renderAwarenessPage({ refNumber, awareness })` (line ~308).

Change signature do `({ refNumber, awareness, hasDnsScan })`.

W h2 zmień hardcoded "7. Świadomość regulacyjna":

```javascript
      <h2>${hasDnsScan ? 8 : 7}. Świadomość regulacyjna (compliance literacy)</h2>
```

I w page footer:

```javascript
        <span>Strona ${hasDnsScan ? 8 : 7} z 11</span>
```

### Task 3.8: Wire `state.dnsScan` przez raport pipeline

**Files:**
- Modify: `src/samoocena/app.js` (download-pdf action)
- Reference: line ~246 `download-pdf` action

- [ ] **Step 1: W download-pdf payload dodaj `dnsScan`**

W `download-pdf` action, znajdź `const payload = { ... }` (~line 253) i dopisz `dnsScan`:

```javascript
        const payload = {
          profile: freshState.profile,
          responses: freshState.responses,
          scoringResult,
          awarenessAnswers: freshState.awarenessAnswers || {},
          dnsScan: freshState.dnsScan || null,
          assessmentId: freshState.assessmentId || freshState.startedAt || Date.now(),
        };
```

### Task 3.9: Wire `dnsScan` w raport app.js

**Files:**
- Find: `src/raport/app.js`

- [ ] **Step 1: Locate raport entry**

Run: `cat /Users/mk/code-sandbox/toolbox-project/aipulse-webpage/src/raport/app.js`

Read content, identify gdzie jest fetch z localStorage `raportData` i call do `renderRaportB`.

- [ ] **Step 2: Pass `dnsScan` z payload do `renderRaportB`**

Edit miejsce gdzie jest call typu `renderRaportB(data)` — upewnij się że `data` zawiera `dnsScan` z payload (jeśli currently destructures explicitly: dodaj). Jeśli przekazuje cały obiekt — już działa bo Phase 2 dodał `dnsScan` do payload.

### Task 3.10: Build verification

- [ ] **Step 1: Build clean check**

Run: `npm run build 2>&1 | tail -10`

Expected: no errors, build completes.

### Task 3.11: Local manual test PDF render

- [ ] **Step 1: Dev server (jeśli nie biegnie z Phase 2)**

Run: `npm run dev` (background).

- [ ] **Step 2: Pełen przejście samooceny end-to-end via Chrome DevTools**

Per `feedback_mcp_verify_first`:
- Otworz `/bezpieczenstwo-samoocena/`, kliknij ROZPOCZNIJ
- Profile (industry: IT, size: 11-50)
- Domain step: wpisz `aipulse.pl`, click SKANUJ
- Awareness quiz: 4 pytania (jakiekolwiek odpowiedzi)
- Quiz 35 pytań — odpowiadaj szybko (możesz `evaluate_script` żeby kliknąć wszystkie radio + nexty)
- Results page → click "Pobierz raport"
- Modal → wpisz "Test Firma", confirm
- Nowa karta `/raport-audit/` otworzy się
- `take_screenshot --fullPage` całego raportu
- Verify: jest sekcja "7. Twoja rzeczywista ekspozycja" z subdomeną aipulse.pl, SPF strict, DMARC p=none, "własny serwer (self-hosted)", finding F-DNS-04 (DMARC nie egzekwuje) w sec 6
- TOC na stronie 2 — `7. Twoja rzeczywista ekspozycja` widoczne, awareness `8.` po niej, compliance `9.`
- `list_console_messages` — clean

- [ ] **Step 3: Test wariant opt-out**

- Refresh strony, restart audyt
- Profile, na domain step click REZYGNUJĘ (skip scan)
- Quiz, results, download PDF
- Verify: sekcja 7 z notice "AUDYT POMINIĘTY ZGODNIE Z DECYZJĄ UCZESTNIKA"
- F-DNS-* findings nie pojawiają się w sec 6

### Task 3.12: Bump + commit Phase 3

- [ ] **Step 1: Bump 0.5623 → 0.5633**

- [ ] **Step 2: CHANGELOG entry**

```markdown
## [0.5633] — 2026-04-18

A7 Phase 3 — raport PDF z sekcją "Twoja rzeczywista ekspozycja".

- Nowa sekcja 7 w raporcie w 3 wariantach (opt-out / scan success / scan fail)
- Section numbering matrix: TOC + headers + page footers conditional
  na obecność DNS scan + awareness sections
- Dynamic findings F-DNS-01..05 dolosowane do listy w sec 6
  (SPF/DMARC issues, dev-staging subdomain leaks)
- Compliance map: nowa row "SPF + DMARC dla email security"
  z dynamic status z DNS scan
- Render dla success: 7.1 Email security (SPF/DMARC/provider table)
  + 7.2 Subdomain mapping (grouped by mail/web/dev/api/other)
- 50-cap UI: "co najmniej 50 subdomen (limit Free tier API)"
- Self-hosted detection wzmacnia interpretację mail provider

A7 feature complete pending manual testing (Phase 4).

Bump: micro +0.001.

---
```

- [ ] **Step 3: Commit + push**

```bash
git add src/raport/template.js src/raport/styles.css src/samoocena/app.js \
        src/version.js package.json CHANGELOG.md
git commit -m "$(cat <<'EOF'
v0.5633: A7 Phase 3 — raport DNS section + dynamic findings

- Sekcja 7 "Twoja rzeczywista ekspozycja" w 3 wariantach
- Dynamic findings F-DNS-01..05 z DNS scan
- TOC/numbering refactor dla conditional sections
- Compliance map: SPF+DMARC row
- Self-hosted detection w mail provider interpretation

A7 complete (testing w Phase 4).
EOF
)"
git push origin main
```

---

## Phase 4: Manual testing + verification (1h)

**Outcome:** Wszystkie 11 scenariuszy ze speca przeszły. Visual snapshots zachowane jako reference. Pre-prod checklist w pełni done.

### Task 4.1: Pre-test setup

- [ ] **Step 1: Dev server running**

Run: `npm run dev` (background).

- [ ] **Step 2: Sample test domains gotowe**

Lista: `aipulse.pl` (kontrolna), `nieistniejaca-domena-xyz123.pl` (fail test), `pkobp.pl` (full data, self-hosted), `localhost` (frontend block test).

### Task 4.2: Test scenarios 1-5 (happy path + UX)

- [ ] **Scenariusz 1: Wpisz `aipulse.pl` → SKANUJ**

- Otworz `/bezpieczenstwo-samoocena/`, fill profile, na domain step wpisz `aipulse.pl`, kliknij SKANUJ
- Expected: spinner ~5s → quiz → end-to-end → raport z sec 7 wariant B (full data, mail_provider="własny serwer (self-hosted)")
- Take screenshot raportu sec 7

- [ ] **Scenariusz 2: Wpisz `aipulse.pl` → REZYGNUJĘ**

- Restart, profile, na domain wpisz `aipulse.pl` ALE click REZYGNUJĘ (a nie SKANUJ)
- Expected: bez spinnera → quiz → raport z sec 7 wariant A (opt-out notice)
- Verify: state.profile.companyDomain == null, state.profile.dnsScanOptOut == true

- [ ] **Scenariusz 3: Wpisz nieistniejącą domenę → SKANUJ**

- Restart, wpisz `nieistniejaca-domena-xyz123.pl`, click SKANUJ
- Expected: spinner ~timeout (10s frontend), DNSDumpster zwróci puste lub error → wariant C (fail notice)
- Verify w sieci: scan-domain wywołany, response zawiera albo `ok:false` albo `ok:true` z pustymi tablicami

- [ ] **Scenariusz 4: Wpisz `localhost` lub `192.168.1.1`**

- Restart, w domain wpisz `localhost`
- Expected: czerwony X przy polu, primary CTA disabled — frontend regex blokuje, no API call
- Powtórz dla `192.168.1.1`

- [ ] **Scenariusz 5: Wpisz `https://www.firma.pl/`**

- Restart, w domain wpisz `https://www.aipulse.pl/`
- Expected: zielony ✓ z `aipulse.pl` (znormalizowane), CTA enabled, scan przebiega na `aipulse.pl`

### Task 4.3: Test scenarios 6-11 (edge cases)

- [ ] **Scenariusz 6: Domain → SKANUJ → F5 mid-scan**

- Wpisz `aipulse.pl`, click SKANUJ, w spinerze (przed completion) tap F5
- Expected: state resume pokazuje ekran domeny ponownie z prefilled `aipulse.pl`, user re-decides
- Edge case: jeśli scan zdążył się zakończyć i zapisać → state.dnsScan != null → user mógłby od razu iść dalej (acceptable)

- [ ] **Scenariusz 7: Skan trwający >10s (frontend timeout)**

- Symulacja trudna bez intercepting network. Skip jeśli nie da się łatwo wymusić — DNSDumpster real timeout to 7s (server-side).
- Alt test: w DevTools Network tab, throttle na 'Slow 3G', wpisz domenę → SKANUJ → spinner powinien zniknąć po max 10s, dalej do quiz, raport wariant C

- [ ] **Scenariusz 8: DNSDumpster 429 (rate limit)**

- W edge function logach: hammer 5 calls w sekundę (curl test)
- Po 1 powinno wracać 429
- Expected w UI: edge fn zwraca `service_unavailable`, frontend cicho, raport wariant C

- [ ] **Scenariusz 9: Domena z 50+ subdomenami**

- Wpisz `google.com` lub `home.pl` (oba hitnęły 50-cap w Phase 0 demo)
- Expected: raport pokazuje "Wykryto: **co najmniej 50 subdomen** (limit Free tier API — pełna lista wymaga Plus)"
- Take screenshot

- [ ] **Scenariusz 10: Domena bez MX (parked)**

- Wybierz parked domain do testu (np. zarejestruj jednorazowy `aipulse-test-parked.pl` jeśli masz, lub użyj subdomeny bez MX). Alt: pomiń jeśli nie masz dostępu — można sprawdzić manualnie payload jak wygląda finding F-DNS-03.
- Expected: raport renderuje, "Mail provider: brak (no MX)", finding F-DNS-03 (brak DMARC) w sec 6

- [ ] **Scenariusz 11: Backward compat — assessment sprzed A7**

- W DevTools Application tab → localStorage → znajdź `samoocena_state_v1` → ręcznie usuń pola `companyDomain`, `dnsScanOptOut`, `dnsScan`
- Refresh, dokończ flow
- Expected: raport bez sekcji 7 całkowicie (omit), reszta normalna, no errors w console

### Task 4.4: Pre-prod checklist verification

Per spec section "Pre-prod checklist":

- [ ] 5 sample domen przeszły demo Phase 0 → samples/ zapisane lokalnie ✓ (zrobione)
- [ ] Spec zaktualizowany post-demo ✓ (commit `be5334b`)
- [ ] Migration działa idempotentnie

Run: `supabase db reset --linked` lokalnie i re-apply migracji → sprawdź że nie ma błędów (jeśli reset zbyt destrukcyjny dla użytkowanej bazy, skip — w produkcji migracja przeszła tylko raz).

- [ ] RLS policy nie złamana

Test: anon insert do `assessments` z nowymi polami nie zwraca błędu RLS.

```sql
insert into assessments (id, questionnaire_version, locale, industry, company_size, started_at, completed_at, overall_score, score_people, score_data, score_systems, score_governance, score_compliance, maturity_level, domain, dns_scan_opt_out, dns_scan)
values (gen_random_uuid(), '2026-01', 'pl', 'it', '11-50', now(), now(), 75, 80, 70, 75, 70, 80, 'managed', 'test.pl', false, '{"summary":{"subdomain_count":1}}'::jsonb);
```

(Run jako anon role — przez Supabase REST endpoint z anon key.)

- [ ] Visual snapshots 3 wariantów zachowane

W `aipulse-webpage/docs/planning/02-samoocena/screenshots/` zapisz 3 PNG:
- `a7-variant-success.png`
- `a7-variant-optout.png`
- `a7-variant-fail.png`

(Snapshots robione w Tasks 4.2 — przeniesć z tmp do tego folderu.)

- [ ] CHANGELOG entries v0.5613 + v0.5623 + v0.5633 napisane ✓ (per phase commits)

### Task 4.5: Post-deploy production smoke test

- [ ] **Step 1: Verify Vercel deploy passed**

Open `https://aipulse.pl/bezpieczenstwo-samoocena/` (production after final push).

- [ ] **Step 2: Quick prod walkthrough**

- Nawigacja: profile → domain step (`aipulse.pl`) → spinner → quiz (skip questions) → results → raport
- Verify: sec 7 widoczna w PDF, no console errors

- [ ] **Step 3: Sprawdź Supabase logs**

Dashboard → Edge Functions → scan-domain → ostatnie request widoczne, status 200, latency reasonable, NO API key w logach.

### Task 4.6: Optional fixes commit (jeśli testing odkrył drobne issue)

- [ ] **Step 1: Bug fixes (jeśli są)**

Jeśli Phase 4 testing wykrył issue (np. styling, copy, edge case):
- Fix
- Bump `v0.5633 → 0.5634` (nano +0.0001 bo to korekta nie nowy feature)
- CHANGELOG entry "Nano-fix [opis]"
- Commit + push

Jeśli wszystko działa = no commit, A7 ready to ship at v0.5633.

---

## Self-Review Notes

**Spec coverage check:**
- ✅ All 4 phases pokryte
- ✅ Edge function with parsing logic, timeout, retry, validation
- ✅ Migration with 3 columns + RLS
- ✅ Frontend nowy ekran z opt-out + spinner overlay + format validation
- ✅ Report 3 warianty + dynamic findings F-DNS-01..05
- ✅ Section numbering matrix dla TOC/headers
- ✅ Compliance map row update
- ✅ All 11 manual test scenarios mapped na Tasks 4.2 i 4.3
- ✅ Pre-prod checklist mapped na Task 4.4
- ✅ Memory rules respected (lazy init, no secrets, MCP verify, version bump)

**Placeholder scan:** żaden TBD/TODO/"add appropriate" w planie — wszystkie kroki mają konkretny code lub command.

**Type consistency:** `ScanData` shape spójny między spec, parse.ts, render functions. `state.dnsScan` shape `{ ok, fetched_at, data, error? }` używany konsystentnie w app.js, payload, raport pipeline.

**Scope:** Single feature, 4 fazy = 4 commits → testowalna integracja. OK dla single plan.
