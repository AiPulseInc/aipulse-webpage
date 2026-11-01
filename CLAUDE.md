# AI Pulse Website

## Project Overview

Marketing website for **Ai Pulse** — polska firma z **dwiema liniami biznesowymi** dla MŚP i JDG:
- **Doradztwo Biznesowe (AI)** — szkolenia, gotowe narzędzia, automatyzacja (`/business/`)
- **Cyber Security** — audyty, NIS2/KSC, ubezpieczenia cyber, blog (`/security/`)

Multi-page site w Vite + vanilla JS, estetyka Obsidian Brutalist. Root `/` to split-screen wybór obszaru. Każda linia ma własny accent (amber dla biznesu, violet dla security).

**GitHub:** https://github.com/AiPulseInc/aipulse-webpage (private, main branch)
**Local path:** `/Users/mk/code-sandbox/toolbox-project/aipulse-projects/aipulse-webpage`
**Deploy:** push do `main` → Railway auto-deploy na aipulse.pl. Bump wersji przy każdym commicie. Migracje i Edge Functions wdrażamy osobno przez Supabase CLI.

## Paid report access (v0.588, 2026-11-01)

- Supabase project `ugvexcuybvjlxplltnht`, organization `psfpowrpwywmtgpnoczi`.
- Public client cannot SELECT/UPDATE the `assessments` table. Submission INSERT and benchmark RPC remain available.
- Email UUID links use `get_paid_assessment_report(uuid)`: only `paid`/`ready` with a `completed` payment. UUID links are shareable access links; do not expose them in public logs.
- Stripe verification also requires the signed webhook to complete fulfillment. Webhook re-reads Stripe payment status, including delayed payment success.
- Legacy `send-report` returns 410; browser snapshots and localStorage do not authorize a report.
- Production Stripe is LIVE; local `.env.local` has separate TEST keys. Never infer deployed mode from local keys or test LIVE payments.
- Regression checks: `npm run test:report-access`, `npm run test:funnel`, `node execution/test_paid_report_migration.mjs` (transaction rollback). Functional test helpers in `execution/` create and clean synthetic UUIDs.
- Removal of `aipulse.inc@gmail.com` membership is explicitly paused by the user. Do not remove it.

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Vite dev server (:5173)
npm run build            # Production build → dist/
npm run preview          # Preview build
npm run generate-images  # Generate AI images (requires GEMINI_API_KEY)
npm run blog:build       # Rebuild security blog z content/ (markdown → HTML)
```

## Tech Stack

**Runtime:** Vite 5, vanilla JS (ES modules), CSS custom (no framework), multi-page (MPA).
**Backend:** Supabase Edge Functions — kontakt, Stripe checkout/webhook, skan domeny, wysyłka raportu.
**Płatności:** Stripe (samoocena płatna / raporty audytu).
**Blog:** markdown w `content/security/blog/` → build script generuje HTML + RSS (`feed.xml`).
**Fonts:** Inter, Outfit, Space Grotesk (Google Fonts).
**AI images:** Gemini 3.1 Flash Image Preview (Nano Banana 2) via `@google/genai`.
**Analytics:** Google Analytics (`src/ga.js`).

## Structure

```
index.html                  Split landing — wybór obszaru (business / security)
business/index.html         Doradztwo AI — szkolenia, narzędzia, automatyzacje, WWW
security/index.html         Cyber Security — audyty, NIS2/KSC, pakiety, vCISO
security/blog/              Zbudowany blog (ARTEFAKT — nie edytuj; źródło w content/)
bezpieczenstwo-samoocena/   Narzędzie samooceny (35 pytań)
raport-audit/               Strona raportu z audytu
privacy/, polityka-cookies/ Strony prawne (RODO)
content/security/blog/      ŹRÓDŁO blogów (markdown + frontmatter)
main.js                     Logika stron ofertowych (modale, sliders, nav)
src/landing.js              Logika split-landingu
src/*-data.js               Dane szkoleń / security (treść modali)
src/security-blog.js        Runtime bloga
style.css                   Design system + sekcje (obie linie)
supabase/functions/         Edge Functions (contact, stripe, scan, report)
scripts/                    Generator obrazów + build-security-blog.mjs
docs/                       Dokumentacja (SEO, wymogi, oferta, planning)
MK_3.0.png, MK_3.1.png      Portrety do hero
CHANGELOG.md                Historia wersji
```

## Brand — Ai Pulse

**Paleta (wspólna baza):**
- `#000` background, `#FFF` primary text, `#B3B3B3`/`#666` secondary
- `#333` borders

**Accent per linia:**
- Biznes: `#F5A623` amber (`--brand-accent-business`)
- Security: `#A855F7` violet, deep `#7E22CE` (`--brand-accent-security`)

Uwaga a11y: amber `#F5A623` na białym ma niski kontrast (2:1) — używany świadomie tylko na dekoracyjnych eyebrow-labelach, nie na treści czytanej.

**Typografia:**
- Headlines: Inter (uppercase, tight)
- Body: Inter 400-500
- Logo: Outfit 800 (amber dot on "i")
- Mono: Space Grotesk

**Ton komunikacji:** Polski, język korzyści, bez buzzwordów. Dla MŚP.

## Konwencje

- Wersja widoczna w nav-bar — bump przy każdym commicie
- CHANGELOG.md zgodnie z Keep a Changelog
- Wszystkie obrazy mają `alt` text (accessibility)
- AI-generated images commitowane (nie gitignored) — deployment-ready
- Testimonials obecnie placeholdery (do zamiany na prawdziwe)
- Formularz kontaktowy: wymagany RODO consent checkbox

## Notes

- **Blog:** edytuj markdown w `content/security/blog/`, potem `npm run blog:build`. NIE edytuj `security/blog/` (build artifact). Skill `security-blog-post` automatyzuje cały workflow.
- **SEO:** ostatni audyt Lighthouse w `docs/seo/lighthouse-2026-07-24.md` (SEO 100/100, CWV excellent, brak danych CrUX = mało ruchu).
- `assets/` folder zawiera gitignored animacje mp4 (legacy, nie używane)
- `.agent/` folder to Gemini CLI framework ("Antigravity Kit") — Google product, NIE nasz brand
- Testimonials nadal mają fake content "Antigravity" — czekamy na prawdziwe od klientów
