# A7 — DNS Enrichment Samooceny: Design Spec

**Status:** Approved 2026-04-18 (brainstorming)
**Author:** Maciej + Claude
**Target version:** v0.57x (po standalone demo)
**Estymata:** 6h (1h demo + 5h impl)

## Spis treści

1. [Context](#context)
2. [Goals & non-goals](#goals--non-goals)
3. [User flow](#user-flow)
4. [Architecture](#architecture)
5. [Data contracts](#data-contracts)
6. [Report rendering — 3 warianty](#report-rendering--3-warianty)
7. [Dynamic findings derivation](#dynamic-findings-derivation)
8. [Standalone demo (validation gate)](#standalone-demo-validation-gate)
9. [Testing plan](#testing-plan)
10. [Implementation phases & estimate](#implementation-phases--estimate)
11. [Open questions to resolve in demo](#open-questions-to-resolve-in-demo)
12. [Files affected](#files-affected)

---

## Context

Obecna samoocena (35 pytań CIS+NIST + 4 awareness) to czysto **deklaratywny self-assessment**. Raport pokazuje co user **mówi że ma**, ale czytelnik (zarząd, ubezpieczyciel, audytor NIS2) musi to wziąć na wiarę. Zero technicznych observable.

A7 dorzuca pasywny skan publicznej infrastruktury domeny firmy (DNS records, subdomeny, email security) jako **niezależną technical observation**. To:

1. **Wzmacnia kredibilność raportu** — "deklaracja + 1 weryfikowalny technical check" lepiej brzmi niż czysta deklaracja
2. **Tworzy naturalny most do PZU cyber** — wymogi PZU obejmują SPF/DMARC i higienę DNS (per `docs/wymogi/wymogi-pzu-cyber.md`); raport pokazuje gdzie firma realnie stoi
3. **Niskie ryzyko wdrożenia** — pasywne, bez logowania, bez zgody firmy (publiczne DNS), zero PII

Feature jest **opcjonalny** — user może świadomie zrezygnować. Brak domeny lub failed scan nie blokuje audytu.

## Goals & non-goals

### Goals

- **Primary:** dodać sekcję "Twoja rzeczywista ekspozycja" do raportu PDF z technical findings o publicznej infrastrukturze
- **Secondary:** zasilić listę FINDINGS dynamicznymi rekordami z DNS scan (SPF/DMARC/dev-staging-leaks)
- **Constraints:**
  - Zero PII (domena firmy = publiczna informacja, nie PII)
  - Sekret API key only server-side (per `feedback_no_secrets_in_output`)
  - Failure tolerant — silent skip zamiast crashy
  - Backward compat — istniejące assessments bez DNS data renderują się normalnie

### Non-goals (YAGNI)

- ❌ Active scanning (port scan, vuln scan) — ryzyko prawne, scope creep
- ❌ Tech stack identification (Wappalyzer-style) — wymaga drugiego API (BuiltWith), scope creep
- ❌ Cache table dla DNS scan results — premature optimization (oczekiwany ruch <100/dzień)
- ❌ Re-scan / retry button w raporcie — overkill UX dla v1
- ❌ Storage scan history per domain — YAGNI, scan-on-demand wystarcza
- ❌ Walidacja DKIM — wymaga znajomości selektora, niedostępna z passive DNS

## User flow

```
┌──────────────────────────┐
│ Industry + size dropdown │  EXISTING profiling step
└──────────┬───────────────┘
           │ submit
           ↓
┌──────────────────────────┐
│ EKRAN: profile-domain    │  NEW step
│                          │
│ // OPCJONALNE WZBOGACENIE│
│ "Twoja rzeczywista       │
│  ekspozycja"             │
│                          │
│ Copy: "Sprawdzimy co     │
│  publiczny internet wie  │
│  o Twojej infrastruk-    │
│  turze — pasywnie, bez   │
│  logowania. ~5 sekund."  │
│                          │
│ [domena.pl____________]  │  Inline format validation
│  ✓ Wygląda OK            │  (regex, live)
│                          │
│ [SKANUJ I DALEJ →]       │  Primary, enabled tylko gdy valid
│                          │
│ ── albo ──               │
│                          │
│ [REZYGNUJĘ Z TEJ CZĘŚCI  │  Secondary (ghost), zawsze enabled
│  AUDYTU →]               │
└──────────┬───────────────┘
           │
   ┌───────┴────────┐
   │                │
SKANUJ            REZYGNUJĘ
   │                │
   ↓                ↓
┌──────────┐  ┌─────────────────────────┐
│ Spinner  │  │ companyDomain = null    │
│ overlay  │  │ dnsScanOptOut = true    │
│ ~3-8s    │  │ → quiz                  │
│          │  └─────────────────────────┘
│ "SKAN... │
│ • DNS    │
│ • email  │
│ • web"   │
└────┬─────┘
     │ scan returns (success OR silent fail)
     ↓
┌──────────────────────────┐
│ companyDomain = "firma.pl"│
│ dnsScan = { ok, data }    │ (or { ok: false } silently)
│ → quiz                    │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│ Quiz 35 + awareness 4    │  EXISTING flow, no changes
└──────────┬───────────────┘
           ↓ submit
┌──────────────────────────┐
│ INSERT assessments        │
│   + domain                │
│   + dns_scan_opt_out      │
│   + dns_scan jsonb        │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│ Results + report PDF      │
│ z sekcją 7 (3 warianty)   │
└──────────────────────────┘
```

### State extension

```typescript
state.profile = {
  industry: string,
  size: string,
  companyName: string | null,    // istniejące, dla raportu
  companyDomain: string | null,  // NOWE
  dnsScanOptOut: boolean,        // NOWE, default false
};

state.dnsScan = {
  ok: boolean,
  fetched_at: string,  // ISO
  data: ScanData | null,
} | null;
```

### Inline format validation (frontend)

```javascript
const DOMAIN_REGEX = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

// normalizacja przed walidacją:
function normalize(input) {
  return input.trim().toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}
```

Akceptujemy: `firma.pl`, `dev.firma.com`, `co.uk`. Odrzucamy: `localhost`, IP literals, `*.local`/`*.internal`/`*.test`, krótsze niż 4 znaki.

### Resume edge case

User może odświeżyć (F5) mid-scan. Decision: state resume pokazuje ekran domeny ponownie z prefilled wartością — user re-decides. Nie cache'ujemy "in-flight scans".

## Architecture

```
Browser (vanilla JS)              Supabase Edge Fn               DNSDumpster
       │                                │                              │
       │ POST /functions/v1/scan-domain │                              │
       │ { domain: "firma.pl" }         │                              │
       │ ──────────────────────────────>│                              │
       │                                │ validate (regex,             │
       │                                │  reject *.local/IP)          │
       │                                │                              │
       │                                │ GET api.dnsdumpster.com/...  │
       │                                │ Authorization: Bearer KEY    │
       │                                │ AbortController(7s)          │
       │                                │ ────────────────────────────>│
       │                                │                              │
       │                                │ <───────────────────────────── (raw json)
       │                                │                              │
       │                                │ parse + summarize            │
       │                                │ enrich (provider mapping)    │
       │                                │                              │
       │ <───────────────────────────── { ok, scanned_at, data }       │
       │ (10s frontend timeout)         │                              │
       │                                │                              │
       │ store w state.dnsScan          │                              │
       │ → quiz                         │                              │
       │ → submit assessment            │                              │
       │   z dnsScan w INSERT payload   │                              │
       │ ──────────────────────────────>│                              │
       │                                │ INSERT assessments           │
       │                                │  + domain text               │
       │                                │  + dns_scan_opt_out bool     │
       │                                │  + dns_scan jsonb            │
```

**Separation of concerns:**
- **Browser:** UI (ekran domeny, spinner), state management, format walidacja, retry policy (BRAK retry — tolerujemy fail)
- **Edge function:** server-side walidacja (defense in depth), API key handling, DNSDumpster call, parsing, provider inference
- **Postgres:** persistent storage (1 row per assessment), zero query logic dla DNS scans

## Data contracts

### Edge function endpoint

**Path:** `POST /functions/v1/scan-domain`

**Request:**
```typescript
type Request = { domain: string };
```

**Response (success):**
```typescript
type SuccessResponse = {
  ok: true;
  scanned_at: string;  // ISO timestamp
  data: ScanData;
};

type ScanData = {
  subdomains: Array<{
    hostname: string;     // "mail.firma.pl"
    a?: string[];         // ["1.2.3.4"]
  }>;
  mx: Array<{
    priority: number;
    host: string;         // "aspmx.l.google.com"
    provider?: string;    // "Google Workspace" (inferred)
  }>;
  txt: {
    spf: string | null;   // raw SPF record string
    dmarc: {
      record: string;
      policy: 'none' | 'quarantine' | 'reject';
    } | null;
  };
  ns: string[];           // ["ns1.cloudflare.com", ...]
  summary: {
    subdomain_count: number;
    has_spf: boolean;
    spf_strict: boolean;       // -all = true; ~all = false
    has_dmarc: boolean;
    dmarc_enforcing: boolean;  // p=quarantine|reject = true
    mail_provider: string | null;
  };
};
```

**Response (failure):**
```typescript
type FailureResponse = {
  ok: false;
  error: 'invalid_domain' | 'timeout' | 'service_unavailable';
};
```

### Server-side validation

```typescript
function validateDomain(input: string): { valid: boolean; reason?: string } {
  if (!input || input.length < 4) return { valid: false, reason: 'too_short' };
  if (!DOMAIN_REGEX.test(input)) return { valid: false, reason: 'invalid_format' };
  if (/^(localhost|127\.|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(input)) {
    return { valid: false, reason: 'private_or_local' };
  }
  if (/\.(local|internal|test|example)$/i.test(input)) {
    return { valid: false, reason: 'reserved_tld' };
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(input)) return { valid: false, reason: 'ip_literal' };
  return { valid: true };
}
```

### Timeouts + retry policy

- **Edge fn → DNSDumpster:** `AbortController` 7s timeout, 1 retry po 500ms na 5xx, brak retry na 4xx (rate limit, auth)
- **Browser → Edge fn:** 10s timeout (frontend `AbortController`), traktuje jak `ok: false` przy timeout
- **Edge fn total budget:** 8s comfort (free tier hard limit ~10s)

### Provider inference (MX → name)

Hardcoded lookup w edge function:

```typescript
const MX_PROVIDERS: Array<[RegExp, string]> = [
  [/aspmx\.l\.google\.com$/i, 'Google Workspace'],
  [/\.outlook\.com$/i, 'Microsoft 365'],
  [/\.protonmail\.ch$/i, 'Proton Mail'],
  [/\.mailgun\.org$/i, 'Mailgun (transactional)'],
  [/\.amazonses\.com$/i, 'Amazon SES (transactional)'],
  [/mx\.zoho\./i, 'Zoho Mail'],
  [/\.onet\.pl$/i, 'Onet'],
  [/\.home\.pl$/i, 'home.pl'],
  [/\.nazwa\.pl$/i, 'nazwa.pl'],
  // fallback: 'własny lub inny'
];

function inferProvider(mxHosts: string[]): string | null {
  for (const host of mxHosts) {
    for (const [pattern, name] of MX_PROVIDERS) {
      if (pattern.test(host)) return name;
    }
  }
  return mxHosts.length > 0 ? 'własny lub inny (nieznany)' : null;
}
```

Lista do rozszerzania w czasie. Polskie hostingi (home.pl, nazwa.pl, Onet) priorytetowo bo target = MŚP PL.

### Database migration

**Plik:** `supabase/migrations/20260418000000_dns_scan.sql`

```sql
ALTER TABLE assessments
  ADD COLUMN domain text,
  ADD COLUMN dns_scan_opt_out boolean NOT NULL DEFAULT false,
  ADD COLUMN dns_scan jsonb;

-- żaden index na domain (brak dedup w v1, brak query po domain)
-- RLS policy `assessments_anon_insert` automatycznie pokrywa nowe kolumny
-- (RLS jest WITH CHECK — pozwala INSERT z dowolnymi columns kompatybilnymi z policy)

COMMENT ON COLUMN assessments.domain IS
  'Optional company domain provided by user for DNS enrichment. Null if user opted out.';

COMMENT ON COLUMN assessments.dns_scan_opt_out IS
  'True if user explicitly clicked "Rezygnuję" on DNS scan step. Distinguishes informed opt-out from missing data.';

COMMENT ON COLUMN assessments.dns_scan IS
  'Parsed DNS scan result (ScanData shape). Null if opt-out OR scan failed.';
```

## Report rendering — 3 warianty

Sekcja **"7. Twoja rzeczywista ekspozycja"** wstawiona PO `Findings` (sek 6), PRZED `Awareness` (jeśli jest) lub `Compliance map`. Renumerowanie kolejnych sekcji.

**Logika wyboru wariantu:**

| Warunek | Wariant |
|---|---|
| `dns_scan_opt_out === true` | **A — Opt-out** |
| `dns_scan?.ok === true` | **B — Full data** |
| `domain != null && dns_scan?.ok === false` | **C — Scan fail (silent)** |
| `domain == null && !dns_scan_opt_out` | **Sekcja całkowicie pominięta** w PDF (backward compat dla starych assessments sprzed A7) |

### Section numbering matrix (TOC + page headers)

A7 + Awareness są obie conditional. Macierz numerowania:

| DNS section | Awareness | TOC numbering |
|---|---|---|
| ❌ | ❌ | ..., 6=Findings, 7=Compliance, 8=Next steps (current) |
| ❌ | ✅ | ..., 6=Findings, 7=Awareness, 8=Compliance, 9=Next steps (current) |
| ✅ | ❌ | ..., 6=Findings, **7=DNS**, 8=Compliance, 9=Next steps |
| ✅ | ✅ | ..., 6=Findings, **7=DNS**, 8=Awareness, 9=Compliance, 10=Next steps |

DNS, gdy jest, zawsze przed Awareness (oba są optional enrichments po Findings). Implementacja: rozszerzyć istniejący conditional numbering pattern w `renderTocMethodology` o trzeci flag `hasDnsScan`.

### Wariant A — Opt-out

```
─────────────────────────────────────────
7. TWOJA RZECZYWISTA EKSPOZYCJA
─────────────────────────────────────────

⚠ AUDYT POMINIĘTY ZGODNIE Z DECYZJĄ UCZESTNIKA

Niniejszy obszar (publiczna ekspozycja DNS:
subdomeny, email security SPF/DMARC) nie został
audytowany — uczestnik samodzielnie zrezygnował
z tej części audytu na etapie profilowania.

┌──────────────────┬──────────────────┐
│ Subdomeny        │ —                │
│ SPF              │ —                │
│ DMARC            │ —                │
│ Mail provider    │ —                │
└──────────────────┴──────────────────┘

Audyt można uruchomić samodzielnie w ~30s:
• securityheaders.com — security headers
• mxtoolbox.com — DNS records, MX, SPF/DMARC
• dnsdumpster.com — subdomain enumeration
```

### Wariant B — Scan success (full)

```
─────────────────────────────────────────
7. TWOJA RZECZYWISTA EKSPOZYCJA: firma.pl
   Skan: 18.04.2026, 14:32 UTC · pasywny
─────────────────────────────────────────

7.1 EMAIL SECURITY (anti-spoofing)

| Status TYPU | Stan         | Interpretacja                          |
|-------------|--------------|----------------------------------------|
| SPF         | ✓ Strict     | Domena chroniona przed podszywaniem    |
|             | v=spf1...-all|                                        |
| DMARC       | ⚠ Permissive | Polityka p=none — DMARC istnieje, ale  |
|             | p=none       | nie egzekwuje (raporty bez blokowania) |
| Mail prov.  | Google       | Enterprise-grade, monitorowane,        |
|             | Workspace    | regularne aktualizacje                 |

KONTEKST: Wymogi ubezpieczycieli cyber 2026 zwykle 
oczekują DMARC w trybie p=quarantine|reject. p=none
to brak realnej ochrony — tylko logowanie. Rozważ 
przejście do p=quarantine po analizie raportów DMARC.

7.2 SUBDOMAIN MAPPING (publicznie widoczne)

Wykryto: 14 subdomen

| Mail (4)        | mail · smtp · mx · imap                 |
| Web (5)         | www · sklep · blog · pomoc · partner    |
| Dev/staging (3) | dev · stage · test                      |
| API/services (2)| api · app                               |
| Inne (0)        | —                                       |

⚠ UWAGA: 3 subdomeny dev/stage publicznie widoczne. 
Typowy wektor: niezabezpieczone wersje testowe z 
prawdziwymi danymi klientów. Sprawdź czy:
• wymagają autentykacji (nie tylko "secret URL")
• są oznaczone noindex (search engines)
• logują dostęp + alertują o anomaliach
```

**Truncation:** subdomeny grupowane po kategorii. Top-level liczba (`Wykryto: N subdomen`) zawsze pełna. Per-kategoria: jeśli >8 subdomen w jednej kategorii (np. CDN z 30+ subdomenami pod jednym prefixem), wyświetl pierwsze 8 + `...i N więcej`. Sortowanie wewnątrz kategorii: alphabetical.

**Scenariusz 9 z [Testing plan](#testing-plan) ("25 subdomen") — przykład:**
- Total: "Wykryto: 25 subdomen"
- Mail (3): mail · smtp · mx
- Web (15): admin · api · app · blog · ... (8 first) · ...i 7 więcej
- Dev/staging (5): dev · qa · stage · stg · test
- API/services (2): api2 · graphql
- Inne (0): —

**Subdomain categorization:**
```typescript
function categorize(hostname: string): 'mail' | 'web' | 'dev' | 'api' | 'other' {
  const sub = hostname.split('.')[0].toLowerCase();
  if (/^(mail|smtp|mx|imap|pop3?|webmail)/.test(sub)) return 'mail';
  if (/^(dev|stage|stg|test|qa|uat|beta|preview)/.test(sub)) return 'dev';
  if (/^(api|app|graphql|rest)/.test(sub)) return 'api';
  if (/^(www|sklep|shop|blog|pomoc|help|support|partner|admin|panel)/.test(sub)) return 'web';
  return 'other';
}
```

### Wariant C — Scan failed (silent)

```
─────────────────────────────────────────
7. TWOJA RZECZYWISTA EKSPOZYCJA
─────────────────────────────────────────

⚠ SKAN NIE ZAKOŃCZONY POMYŚLNIE

Próba pasywnego skanowania domeny `firma.pl` 
nie powiodła się w momencie audytu. Możliwe 
przyczyny: tymczasowy timeout API, rate limit,
domena niedostępna z naszych endpointów.

[empty placeholder — same jak Wariant A]

Sprawdź ręcznie na: securityheaders.com / 
mxtoolbox.com / dnsdumpster.com
```

### Update sekcji compliance map (sek 8 lub 9 po renumerowaniu)

Dodaj row do tabeli "Wymogi ubezpieczycieli (2026)":

```
| SPF + DMARC dla email security | <status> |
```

Status mapping:
- Wariant A (opt-out): `—` + tooltip "Audyt pominięty"
- Wariant B + has_spf + has_dmarc + dmarc_enforcing: `✓ Tak`
- Wariant B + has_spf + has_dmarc + !dmarc_enforcing: `⚠ Częściowo` (DMARC nie egzekwuje)
- Wariant B + (!has_spf || !has_dmarc): `✗ Brak`
- Wariant C (fail): `—` + tooltip "Skan nie powiódł się"

## Dynamic findings derivation

Dla wariantu B — dodatkowe findings dolosowane do hardcoded F-001..F-007:

```typescript
function deriveDnsFindings(scanData: ScanData): Finding[] {
  const findings: Finding[] = [];

  // SPF
  if (!scanData.summary.has_spf) {
    findings.push({
      id: 'F-DNS-01', severity: 'high', label: 'HIGH',
      title: 'Brak rekordu SPF dla domeny pocztowej',
      detail: 'Domena nie ma rekordu SPF — pozwala dowolnemu serwerowi na świecie wysyłać email "od" Twojej firmy. Klient widzi prawdziwy adres, ufa, klika fakturę z fałszywego źródła.',
      mapping: 'CIS 9.5 · NIST PR.AC-3 · NIS2 Art. 21',
    });
  } else if (!scanData.summary.spf_strict) {
    findings.push({
      id: 'F-DNS-02', severity: 'low', label: 'LOW',
      title: 'SPF w trybie soft-fail (~all)',
      detail: 'SPF istnieje ale w trybie "soft" — emaile spoof przejdą jako "podejrzane" zamiast być odrzucone. Rozważ zaostrzenie do -all po sprawdzeniu logów DMARC.',
      mapping: 'CIS 9.5 · NIST PR.AC-3',
    });
  }

  // DMARC
  if (!scanData.summary.has_dmarc) {
    findings.push({
      id: 'F-DNS-03', severity: 'high', label: 'HIGH',
      title: 'Brak rekordu DMARC',
      detail: 'Bez DMARC nie wiesz że ktoś próbuje podszywać się pod Twoją domenę. Wymóg ubezpieczycieli cyber 2026.',
      mapping: 'CIS 9.6 · NIST PR.AC-3 · NIS2 Art. 21',
    });
  } else if (!scanData.summary.dmarc_enforcing) {
    findings.push({
      id: 'F-DNS-04', severity: 'med', label: 'MEDIUM',
      title: 'DMARC w trybie p=none — nie egzekwuje',
      detail: 'DMARC istnieje ale tylko monitoruje. Dla realnej ochrony przed spoofingiem przejdź do p=quarantine (po analizie raportów).',
      mapping: 'CIS 9.6 · NIST PR.AC-3',
    });
  }

  // Subdomeny dev/stage
  const dev = scanData.subdomains.filter(s =>
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

## Standalone demo (validation gate)

**Cel:** zwalidować realny output DNSDumpster API zanim wlejemy kod do produkcji. Bez tego ryzyko: budujemy edge function pod wyimaginowany contract, spec się rozsypuje przy pierwszym realnym call.

### Lokalizacja

`/Users/mk/code-sandbox/aipulse-dns-demo/` (nowy folder, **poza** `toolbox-project/`)

### Struktura

```
aipulse-dns-demo/
├── README.md            # how to run, expected output
├── package.json         # type: module, no deps (native fetch)
├── .env.example         # DNSDUMPSTER_API_KEY=...
├── .gitignore           # .env, node_modules, samples/*.json
├── scan.mjs             # CLI: node scan.mjs firma.pl → JSON do stdout
├── parse.mjs            # parsing module (porty potem do edge fn)
├── samples/             # zapisane outputs dla 5 testowych domen
│   ├── aipulse-pl.json
│   ├── google-com.json
│   ├── home-pl.json     # typowy polski hosting
│   ├── empty-domena.json # domena bez MX/SPF
│   └── many-subs.json   # domena z 30+ subdomenami (CDN)
└── report-mock.html     # static HTML z hardcoded JSON, render sekcji 7
                          # (paste jednego z samples → inspect visually)
```

### 3 etapy walidacji

**Etap 1 — API contract (15 min):**
- `node scan.mjs aipulse.pl`
- Patrzymy raw JSON
- Weryfikujemy: endpoint odpowiada (auth header poprawny), shape vs nasze założenia, jak parsuje SPF/DMARC, czy subdomeny są flat list z metadata, czy są rate limit headers (X-RateLimit-*)

**Etap 2 — Parsing logic (30 min):**
- `parse.mjs` zamienia raw response → nasz `ScanData` shape
- Iterujemy aż summary fields wychodzą sensowne dla 5 sample domen
- Sprawdzamy edge cases: pusta domena, brak MX, dziwne TXT records, CDN z 50+ subdomenami

**Etap 3 — Visual sanity (15 min):**
- Wybieramy 1-2 sample, paste do `report-mock.html`
- Przeglądamy w Chrome (Chrome DevTools MCP)
- Walidujemy: czy 14 subdomen mieści się ładnie, czy provider mapping trafia, czy interpretacje SPF/DMARC mają sens copy-wise

**Total demo time:** ~1h.

### Output demo (wpływa na finalną impl)

- ✅ Potwierdzenie/korekta `ScanData` typu
- ✅ Konkretna lista MX patterns dla provider lookup (z realnych polskich domen)
- ✅ Realistyczne edge cases zidentyfikowane
- ✅ Ewentualna identyfikacja drugiego API jeśli DNSDumpster nie wystarcza (np. dnschecker.org dla DMARC verification)

### Po demo — możliwa rewizja speca

Jeśli realny output DNSDumpster znacząco odbiega od założeń:
- Update `ScanData` typu w sekcji [Data contracts](#data-contracts)
- Update sekcji [Open questions](#open-questions-to-resolve-in-demo) — closure
- Re-commit speca PRZED rozpoczęciem implementacji

## Testing plan

### Manual test scenarios (po impl, na dev z `npm run dev`)

| # | Scenariusz | Oczekiwany rezultat |
|---|---|---|
| 1 | Wpisz `aipulse.pl` → SKANUJ | Spinner ~5s → quiz → raport z sec 7 wariant B (full data) |
| 2 | Wpisz `aipulse.pl` → REZYGNUJĘ | Bez spinnera → quiz → raport z sec 7 wariant A (opt-out notice) |
| 3 | Wpisz `nieistniejaca-domena-xyz123.pl` → SKANUJ | Skan zwraca puste lub fail → raport wariant C (silent fail notice) |
| 4 | Wpisz `localhost` lub `192.168.1.1` | Frontend regex blokuje, czerwony X przy polu, CTA disabled |
| 5 | Wpisz `https://www.firma.pl/` | Frontend normalizuje do `firma.pl`, scan przebiega normalnie |
| 6 | Wpisz domenę → SKANUJ → F5 mid-scan | State resume pokazuje ekran domeny ponownie z prefilled value, user re-decides |
| 7 | Skan trwający >10s | Frontend timeout, traktowany jak `ok: false`, raport wariant C |
| 8 | DNSDumpster zwraca 429 (rate limit) | Edge fn zwraca `service_unavailable`, frontend cicho, raport wariant C |
| 9 | Domena z 25 subdomenami (np. duża firma) | Top-level "Wykryto: 25 subdomen". Per-kategoria: kategoria z >8 subdomen pokazuje pierwsze 8 + "...i N więcej" |
| 10 | Brak MX records (parked domain) | Raport renderuje, "Mail provider: brak", finding F-DNS-03 (brak DMARC) pojawia się |
| 11 | Backward compat — assessment z DB sprzed A7 | Raport bez sekcji 7 (omit), reszta normalna |

### Auto verification po deploy (Chrome DevTools MCP)

Per `feedback_mcp_verify_first`:
- Snapshot landing samooceny → click ROZPOCZNIJ → fill profile → next → wpisz `aipulse.pl` → SKANUJ → przejdź szybko quiz → results → download PDF preview → snapshot sec 7 (wariant B)
- Powtórz dla wariant A (REZYGNUJĘ)
- `list_console_messages` → clean, no errors/warnings

### Build verification

- `npm run build` — clean
- Edge function deploy: `supabase functions deploy scan-domain`
- `supabase secrets set DNSDUMPSTER_API_KEY=...`
- Migration apply: `supabase db push`

### Pre-prod checklist (przed pushem na main)

- [ ] 5 sample domen przeszły demo → samples/ zapisane lokalnie w `aipulse-dns-demo`
- [ ] Spec zaktualizowany jeśli demo zwróciło niespodzianki
- [ ] Migration działa idempotentnie (`drop column if exists` w down migration)
- [ ] RLS policy nie złamana (anon insert nadal pisze nowe kolumny)
- [ ] Visual snapshot 3 wariantów zachowany jako reference
- [ ] CHANGELOG.md entry napisany
- [ ] CO-related: tylko zaufane endpoints w `_allowed_origins` (jeśli edge function ma CORS)

## Implementation phases & estimate

| Faza | Czas | Co | Output |
|---|---|---|---|
| **0. Standalone demo** | 1h | API contract validation, parse logic prototype, visual mock | `aipulse-dns-demo/` z samples |
| **1. Migration + edge function** | 1.5h | SQL migration, edge function `scan-domain` z parsing module portowanym z demo | Migration applied, fn deployed |
| **2. Frontend ekran + state + API call** | 1h | Nowy komponent `renderProfileDomain` w `ui.js`, state extension, API call z spinner | Ekran działa, scan trafia do state |
| **3. Report section + dynamic findings** | 1.5h | `renderDnsExposure` w `template.js`, refactor `renderFindings` dla dynamic, TOC renumerowanie, compliance row update | Sekcja 7 renderuje 3 warianty, findings zintegrowane |
| **4. Manual testing + Chrome DevTools verify** | 1h | 11 scenariuszy z [Testing plan](#testing-plan), pre-prod checklist | Pass all, snapshots w sample |
| **TOTAL** | **6h** | | v0.57x ready to ship |

## Open questions to resolve in demo

Te punkty pozostają **otwarte** do walidacji w standalone demo. Po demo — update tej sekcji z odpowiedziami.

1. **DNSDumpster realny endpoint:** czy `api.dnsdumpster.com/v1/...`? Czy `dnsdumpster.com/api/...`? Auth header (Bearer? X-API-Key?)
2. **Response shape:** Czy SPF/DMARC są wyciągane jako structured fields, czy musimy parsować z plain TXT records string?
3. **Subdomeny metadata:** Flat list czy z dodatkowymi info (last_seen, http_status, server header)?
4. **Rate limits:** Konkretne limity per minute/day. Czy są X-RateLimit-* headers w response?
5. **DKIM availability:** Czy DNSDumpster zwraca DKIM (zwykle nie via passive DNS bez selektora)? Jeśli nie — czy potrzebujemy drugiego API (np. dnschecker.org) czy pomijamy DKIM w v1?
6. **NS records:** Czy zwraca? Wartość dla raportu?
7. **HTTP/HTTPS reachability:** Czy DNSDumpster sprawdza czy subdomeny rzeczywiście odpowiadają (response status)?

## Files affected

### New files

- `aipulse-webpage/supabase/functions/scan-domain/index.ts` — edge function
- `aipulse-webpage/supabase/functions/scan-domain/parse.ts` — parsing logic (port z demo)
- `aipulse-webpage/supabase/functions/scan-domain/providers.ts` — MX → provider lookup
- `aipulse-webpage/supabase/migrations/20260418000000_dns_scan.sql` — schema extension
- `aipulse-dns-demo/` — standalone demo folder (poza repo)

### Modified files

- `aipulse-webpage/src/samoocena/ui.js` — `renderProfileDomain()` + sectional update do `renderProfiling` (next button → profile-domain step)
- `aipulse-webpage/src/samoocena/state.js` — `state.profile.companyDomain`, `state.profile.dnsScanOptOut`, `state.dnsScan` initial
- `aipulse-webpage/src/samoocena/app.js` — handler dla `submit-profile-domain` action, API call orchestration, spinner state
- `aipulse-webpage/src/samoocena/api.js` — `scanDomain(domain)` wrapper na edge function call, `submitAssessment` extension dla nowych pól
- `aipulse-webpage/src/samoocena/styles.css` — styles dla ekranu domain (~80 LOC), spinner overlay (~40 LOC)
- `aipulse-webpage/src/raport/template.js` — `renderDnsExposure(data, variant)`, refactor `renderFindings` dla dynamicznych findings, refactor `renderTocMethodology` dla conditional sec 7, refactor `renderComplianceAndCta` (compliance map row)
- `aipulse-webpage/CHANGELOG.md` — wpis v0.57x
- `aipulse-webpage/src/version.js` + `package.json` — bump

### NOT modified (intentionally)

- `aipulse-webpage/src/samoocena/scoring.js` — DNS findings nie wpływają na maturity score (są dodatkowe, nie część CIS+NIST 35 pytań)
- `aipulse-webpage/src/samoocena/awareness.js` — niezwiązane
- Mockupy w `docs/planning/02-samoocena/mockups/` — dokumenty historyczne, nie modyfikujemy

---

## Approval log

- 2026-04-18 — initial spec, brainstorming approved
- (po demo) — revision speca jeśli realny output DNSDumpster odbiega od założeń
- (po review speca) — `writing-plans` skill → implementation plan
