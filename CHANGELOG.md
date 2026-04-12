# Changelog

Log zmian w projekcie AI Pulse. Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/).

## [0.3.0] — 2026-04-12

Major content expansion + AI-generated visuals. Rozbudowa oferty szkoleniowej z 4 do 7 pozycji podzielonych na 2 slidery. 22 unikalne obrazy wygenerowane przez Gemini 3.1.

### Added
- **Sekcja "Wdrażaj AI"** — 3 szkolenia dla zespołów biznesowych:
  - Podstawy rozmowy z AI (fundamenty promptowania, plain Polish)
  - Prawo Jazdy AI (B2B sprzedaż)
  - Zbuduj własnego agenta AI (EY-level advance)
- **Sekcja "Buduj z AI"** — 4 szkolenia dla developerów:
  - Claude Code: Start (CC beginner)
  - Claude Code: Skills (CC for business)
  - Claude Code: Pro (CC advanced)
  - Gemini + AntiGravity (alternatywny stack)
- **Modale szkoleń** — każde z 7 szkoleń otwiera modal z pełnymi informacjami (Dla kogo, Czego się nauczysz, Format, Wynik) i CTA
- **22 obrazy AI-generated** przez Gemini 3.1 Flash Image Preview (Nano Banana 2):
  - 7 wizuali szkoleń (abstract brutalist + amber accent)
  - 10 ikon narzędzi (unified icon set)
  - 5 mockupów stron (e-commerce, ubezpieczenia, firma usługowa, ogrodnicza, golf)
- **RODO consent checkbox** w formularzu kontaktowym (wymagany)
- **Skrypt `generate-images.mjs`** — reproducible image generation via `npm run generate-images`
- **Generalizacja systemu modali** — jeden `#app-modal` obsługuje 2 typy (auto + szkolenia) przez `data-modal-type`
- **`src/training-data.js`** — osobny moduł z kontentem 7 szkoleń
- Etykieta `_0X //` zamiast `SZKOLENIE_0X //` (cleaner labels)
- Esc key closes modals (accessibility)

### Changed
- Język copy szkoleń: opis techniczny → **język korzyści** (po co + co dostanę)
- Nawigacja: "Szkolenia" (1 link) → "Wdrażaj AI" + "Buduj z AI" (2 linki)
- Navbar: usunięto link "O nas" (sekcja się nie zmieniła, link powrócił do "Kontakt")
- Dev szkolenia visual: text placeholder → pełen AI-generated obraz
- Strony WWW: placeholder boxes → mockupy 16:10 z amber gradient overlay
- Narzędzia cards: text-only → icon + text (56×56 AI-generated ikony)
- Bump wersji: 0.2.0 → 0.3.0

### Technical
- Nowe dependencies: `@google/genai ^1.49`, `dotenv ^17`
- Zweryfikowane API: model `gemini-3.1-flash-image-preview` z endpointem `generateContent` + `Modality.IMAGE`
- `public/generated/` z 22 plikami .jpg (7.2MB łącznie) — commitowane (deployment-ready)
- Usunięty stary folder `images/` (1.8MB klatek animacji z poprzedniej wersji hero)
- Rewrite `README.md` + `CLAUDE.md` na brand AI Pulse
- Bundle: 4.5KB JS → 10.4KB JS (dodatkowa logika modali + training-data)

### Removed
- Stary folder `images/` z 68 klatek animacji (1.8MB)
- Placeholdery "wkrótce" w sekcji Strony WWW
- Unused `Bash(cd:*)` ban — dodane do allow dla płynności

---

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
