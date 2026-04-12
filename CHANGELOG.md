# Changelog

Log zmian w projekcie AI Pulse. Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/).

## [0.2.0] — 2026-04-12

Pierwszy milestone kontentowy po refaktoryzacji. Strona zmienia brand z "Antigravity AI" na **AI Pulse** i otrzymuje polską treść marketingową.

### Added
- Brand **AI Pulse** — logo w navbarze i stopce (Outfit 800, amber kropka na "i")
- Statyczne hero ze zdjęciem MK_3.1 (gradient vignette mask)
- Amber accent color (#F5A623) — labels, CTA, hover states, kropka logo
- Sekcja Szkolenia (4 slajdy: Prompting, Prawo Jazdy AI, AI Builder, Claude Code & Gemini)
- Sekcja Narzędzia AI (grid 10 kart)
- Sekcja Automatyzacje (3 platformy: n8n, Make, Custom) + modale
- Sekcja Strony WWW (5 placeholderów)
- Sekcja O nas (3-krokowa metoda: Audyt → Szkolenie → Wsparcie + KPI)
- Formularz kontaktowy (bezpłatna konsultacja)
- Pełna polska treść (`lang="pl"`, meta description, OG tags)
- Wyświetlanie wersji w navbarze obok logo
- `MK_3.0.png` i `MK_3.1.png` — portrety do sekcji hero
- `CHANGELOG.md` (ten plik)
- `PLAN-content-v2.md` — plan iteracji kontentu

### Changed
- Hero: scroll-driven canvas animation → statyczne zdjęcie z gradient vignette
- Headline hero: "INTELLIGENCE AS ARCHITECTURE" → "SKUTECZNE WDROŻENIA AI."
- Język strony: angielski → polski
- Font headline zmniejszony (clamp 2.5-5.5rem) dla lepszej responsywności
- Slider szkoleń z overlapem tekstu i zdjęcia (hero 7 kolumn / 5 kolumn)
- Submit button formularza → amber filled
- Tool cards hover → amber border accent
- Bump wersji: 0.1.0 → 0.2.0

### Removed
- Dark placeholder content związany z "Antigravity AI"
- Podwójna linia podtytułu hero (scalona w jeden paragraf z `<br>`)
- Słowo "INTELIGENCJI" z hero (skrót na 2 linie)

### Technical
- Build cleanup: 72 modules → 4 modules (usunięcie 68 klatek animacji z importu)
- JS bundle: 19KB → 4.5KB (usunięcie canvas animation logic)
- Plan v2 zawiera strategię dla 7 szkoleń, 2 sliderów, 22 AI-generated obrazów

---

## [0.1.0] — 2026-04-11

Refaktoryzacja techniczna (commit `efb7959`).

### Added
- Separacja HTML/CSS/JS — HTML przeniesiony z `main.js` template literal do `index.html`
- 30+ reużywalnych klas CSS (z 167 inline styles → 57 one-off)
- Event delegation przez data attributes (zamiast onclick)
- Moduł ES6 dla logiki (bez `window.*` globals)
- Metadata: `lang="pl"`, title, meta description, OG tags, favicon

### Changed
- Package name: `ai-agency-brand-book` → `aipulse-webpage`
- Wersja: `0.0.0` → `0.1.0`
- Event handlers: inline `onclick` → event delegation

### Removed
- 94MB `Screen Recording.mov` (gitignore)
- 22MB mp4 animacji z `assets/animations/`
- 118 duplikatów klatek JPG (`assets/duplicated frames/`)
- 5 luźnych screenshotów PNG z roota
- `setTimeout` hack dla DOM-ready (niepotrzebny po przeniesieniu HTML)

### Infrastructure
- `.gitignore` rozszerzony o media files (`*.mov`, `*.mp4`, duplicated frames)
- Git untrack 130+ plików mediów (pozostają na dysku, nie w gicie)
