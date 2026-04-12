# AI Pulse

> Szkolenia AI, narzędzia i automatyzacje dla MŚP. Bez buzzwordów — z konkretnymi wynikami.

Strona marketingowa firmy AI Pulse. Vite + vanilla JS + custom CSS w estetyce Obsidian Brutalist z amber accent (#F5A623).

## Stack

- **Vite 5** — build tool
- **Vanilla JS** — zero runtime dependencies
- **CSS custom** — własny design system bez frameworka
- **Google Fonts** — Inter, Outfit, Space Grotesk

## Quick start

```bash
npm install            # Instalacja dependencies
npm run dev            # Dev server na :5173
npm run build          # Build produkcyjny → dist/
npm run preview        # Preview buildu
```

Dla generacji obrazów AI (opcjonalnie):

```bash
npm run generate-images   # Wymaga GEMINI_API_KEY w .env
```

## Struktura projektu

```
aipulse-webpage/
├── index.html              # Pełny markup strony
├── main.js                 # Logika (modale, sliders, observer)
├── style.css               # Design system + styles
├── src/
│   └── version.js          # Wersja aplikacji (sync z package.json)
├── scripts/
│   └── generate-images.mjs # Skrypt generujący obrazy AI (Gemini)
├── public/                 # Static assets (served at root)
│   └── generated/          # AI-generated images
├── MK_3.0.png, MK_3.1.png  # Portrety do sekcji hero
├── CHANGELOG.md            # Historia zmian
├── PLAN-content-v2.md      # Plan aktualnej iteracji
└── CLAUDE.md               # Instrukcje dla Claude Code
```

## Design system

**Kolory (Obsidian theme):**
- Background: `#000`
- Text primary: `#FFF`
- Text secondary: `#666`
- Accent (amber): `#F5A623`
- Borders: `#333`

**Typografia:**
- Headlines: Inter (uppercase, tight letter-spacing)
- Body: Inter 400-500
- Logo: Outfit 800
- Mono: Space Grotesk

## Wersjonowanie

Wersja wyświetlana w nav-bar (`v0.X.Y`). Przy każdym commicie:
1. Bump w `package.json` (`version`)
2. Bump w `src/version.js` (`VERSION`)
3. Wpis w `CHANGELOG.md`

## Brand

AI Pulse — firma szkoleniowa AI dla MŚP i JDG w polskim rynku. Strona hostuje ofertę: szkolenia (7 ścieżek), narzędzia (10 gotowych), automatyzacje (n8n, Make, custom), strony internetowe pod klucz.

## Licencja

Proprietary. All rights reserved. © 2026 AI Pulse.
