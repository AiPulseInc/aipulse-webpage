# AI Pulse Website

## Project Overview

Marketing website for **AI Pulse** — firma szkoleniowa AI dla MŚP i JDG (polski rynek). Single-page landing zbudowany w Vite + vanilla JS w estetyce Obsidian Brutalist z amber accent.

**GitHub:** https://github.com/AiPulseInc/aipulse-webpage (private, main branch)
**Local path:** `/Users/mk/code-sandbox/toolbox-project/aipulse-webpage`

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Vite dev server (:5173)
npm run build            # Production build → dist/
npm run preview          # Preview build
npm run generate-images  # Generate AI images (requires GEMINI_API_KEY)
```

## Tech Stack

**Runtime:** Vite 5, vanilla JS (ES modules), CSS custom (no framework).
**Fonts:** Inter, Outfit, Space Grotesk (Google Fonts).
**AI images:** Gemini 3.1 Flash Image Preview (Nano Banana 2) via `@google/genai`.

## Structure

```
index.html              Pełny markup strony
main.js                 Logika (modale, sliders, IntersectionObserver)
style.css               Design system + sections styles
src/version.js          Wersja app (sync z package.json)
scripts/                Generator obrazów AI
public/generated/       AI-generated images (szkolenia, tools, strony)
MK_3.0.png, MK_3.1.png  Portrety do hero
CHANGELOG.md            Historia wersji
PLAN-content-v2.md      Plan aktualnej iteracji
```

## Brand — AI Pulse

**Paleta:**
- `#000` background, `#FFF` primary text, `#666` secondary
- `#F5A623` amber accent — labels, CTA, logo dot, hover
- `#333` borders

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

- Stary canvas scroll animation usunięty w 0.2.0 (68 klatek JPG → static photo)
- `assets/` folder zawiera gitignored animacje mp4 (legacy, nie używane)
- `.agent/` folder to Gemini CLI framework ("Antigravity Kit") — Google product, NIE nasz brand
- Testimonials nadal mają fake content "Antigravity" — czekamy na prawdziwe od klientów
