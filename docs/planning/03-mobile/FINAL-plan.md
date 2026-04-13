# FINAL Plan — Mobile Responsiveness

Synteza `gemini-ux-research.md` (strategia UX, psychologia B2B) + `codex-plan.md` (konkretne zmiany CSS z numerami linii). Rekomendacja: **Plan Codex jako baza wykonawcza**, uzupełniony o kilka opinii Gemini.

## Porównanie Gemini vs Codex

| Aspekt | Gemini | Codex | Winner |
|---|---|---|---|
| Breakpoints | 360/393/768 + mobile-first re-architect | 3 warstwy: `<=1023px` shared, `768-1023px` tablet, `<=767px` phone, + `<=399px` micro polish | **Codex** — konkretne warstwy które NIE łamią desktopu |
| Hero mobile | Sugeruje drop zdjęcia | Photo pozostaje jako "module" w dole, bez overlap | **Codex** — zachowuje brand, użytkownik widzi Maćka |
| Nav | Full-screen brutalist drawer | Hamburger + sheet poniżej sticky bara, reuse `.site-nav-links` DOM | **Codex** — zgodne z istniejącym JS w `main.js:255` |
| Pricing 4 kart | Horizontal swipe slider | Phone: vertical ladder (maturity order), Tablet: 2-row z highlighted Basic | **Codex** — lepsza czytelność, swipe gubi context |
| Testimonials marquee | Single static quote, manual swipe | Scroll-snap rail, hide duplicate set, `prefers-reduced-motion` support | **Codex** — zachowuje "wiele opinii" feel, eliminuje auto-motion |
| Toolbox grid (5x2) | Horizontal swipe | Phone: 1-col media-object, Tablet: 3-col | **Codex** — każda karta ma opis, swipe gubi content |
| Typography | `clamp()` fluid | Per-breakpoint per-component tokens | **Codex** — bardziej deterministyczne, łatwiej debugować |
| Nav kontaktowy CTA | Call-now FAB (telefon) | Nie wspomniane | **Gemini** — warto dodać później, Polish B2B dzwoni |
| Język CTA | "Państwo / Twoja Firma" | Nie wspomniane | **Gemini** — warto do copy review, ale OSOBNY task |
| Trust placement | Certs pod hero CTA | Cert ribbon in-flow na mobile zamiast absolute | **Tie** |

## Decyzja

**Plan bazowy: Codex (27KB)** — 11 sekcji z audit findings, per-section proposals, 5-commit phasing.

**Przejmujemy z Gemini**:
- `prefers-reduced-motion` support (Codex też to wspomniał)
- Rozważenie Call-now FAB — **ODŁOŻONE** do osobnego task (nie w mobile responsive)
- Copy review ("Państwo / Twoja") — **ODŁOŻONE** do content pass

## Strategia breakpoints

```css
/* Desktop base: >=1024px */
/* Tablet: 768-1023px */
/* Phone: <=767px */
/* Narrow phone polish: <=399px */
/* Shared non-desktop: <=1023px (nav mode, hero resets) */
```

Zmiana paradygmatu: zamiast 6 rozsypanych `@media (max-width: 768px)` w `style.css`, jedna skonsolidowana sekcja na końcu pliku z 4 warstwami.

## Rollout — 5 commitów (per Codex)

### Commit 1 — Responsive foundation
- Konsolidacja breakpoints
- Dodanie `--nav-height` CSS var (zamiast hardcoded 78px)
- Fix modal class mismatch (`.modal-content` vs `.academy-modal-content`)
- Przeniesienie inline spacingu do klas
- **Files**: `style.css`, `business/index.html`, `security/index.html`
- **Verify**: desktop 1024px identyczny, brak horizontal scroll na 375px

### Commit 2 — Mobile nav + hero
- Hamburger button + JS toggle (`initMobileNav()` w main.js)
- Hero photo/text bez overlap na tablet + phone
- Fix broken hero CTA target `#section-szkolenia` → `#section-szkolenia-zespoly`
- **Files**: `business/index.html`, `security/index.html`, `style.css`, `main.js`
- **Verify**: nav toggle działa, Escape closes, hash-link closes, brak overlapu na 375px i 834px

### Commit 3 — Landing + sliders
- Landing chooser: phone vertical stack, tablet 2-up bez hover
- Slider sections: phone flatten do stacked cards, tablet keep slider z top-positioned chip bar
- **Files**: `index.html`, `src/landing.js`, `business/index.html`, `security/index.html`, `style.css`, `main.js`
- **Verify**: landing działa na 360px i 768px, slider na phone = stack, na tablet = pills

### Commit 4 — Business sections
- Automatyzacje, Narzędzia, O nas (+ testimonials scroll-snap), Strony, Contact, Footer
- **Files**: `business/index.html`, `style.css`
- **Verify**: tools 1-col phone / 3-col tablet, testimonials swipe, strony 1-col / 2-col

### Commit 5 — Security sections + pricing + images
- Hero cert ribbon in-flow
- Compliance, Szkolenia security, Proces+certs, Dla kogo, Oferta radical reorg (maturity ladder)
- `srcset`/`sizes` na hero/training/mockup/cert images
- **Files**: `security/index.html`, `business/index.html`, `style.css`, `public/*` (optional variants)
- **Verify**: pricing czytelny na 375px, cert ribbon w flow, desktop pricing 4-up na 1024px+

## CSS size impact

- **Gross growth**: +300-380 lines (tablet warstwy, nav, hero resets, pricing reflow)
- **Claw back** przez konsolidację starych `@media`: -60-100 lines
- **Net**: ~+220-280 lines, ~+8-11KB unminified
- **Plus mniejsze**: cleaner architektura, łatwiej maintainować

## Key opinions Codex które chcę podkreślić

1. **NIE mobile-first re-architect** — Gemini proponował, Codex trzyma desktop jako baseline. To TWOJE preferencje z feedbacku v0.491 ("wersja desktop w miarę OK"). ✓
2. **Pricing = vertical maturity ladder na phone** (nie swipe) — użytkownik czyta "Samoocena → Basic → Rozszerzony → Premium" jak ścieżkę wzrostu. Swipe zabijałby progresję.
3. **Testimonials = scroll-snap rail + hide duplicate** — zachowuje "wiele opinii" feel, eliminuje auto-motion który męczy oko na mobile.
4. **Toolbox = media-object 1-col na phone** — każda z 10 kart ma krótki opis, swipe gubi content. Media-object = ikona lewej strony + opis prawej, compact.
5. **Hero photo pozostaje** — jako "module" bez overlap. Brand consistency.

## Testing matrix (per Codex)

| Width | Device | Key checks |
|---|---|---|
| 360px | Old Android | no horizontal scroll, nav fits, pricing 1-col |
| 375px | iPhone SE | brutalist feel intact, cert ribbon in flow |
| 393px | iPhone 15/16 Pro | pricing badge wrap, nav spacing |
| 412px | Galaxy S | tool cards look filled |
| 768px | iPad portrait | **breakpoint boundary** — tablet rules kick in |
| 834px | iPad Air | 2-col grids, cert strip legible |
| 1024px | Desktop boundary | **regression test** — desktop unchanged |

## Decyzje (zaakceptowane 2026-04-13)

1. ✅ **Hero photo pozostaje** na mobile (Codex approach) — jako moduł bez overlap. Brand consistency.
2. ✅ **Pricing = vertical maturity ladder** — Samoocena → Basic → Rozszerzony → Premium w kolejności wzrostu. Basic highlighted.
3. ✅ **Nav icon: brutalist** — 2 grube poziome linie (2-3px) zamykane w kwadrat, zgodne z estetyką Obsidian Brutalist. Toggle: `aria-expanded="false|true"`.
4. ✅ **`prefers-reduced-motion`** — wyłącza marquee testimonials ZARÓWNO na desktop jak i mobile dla tych użytkowników. Dodany media query w commit 4.
5. ✅ **Image variants w osobnym skrypcie** — `scripts/generate-responsive-images.mjs` + sharp. Uruchamiany manualnie (nie na każdym build), output do `public/generated/**/variants/`. Commit 5.
6. ✅ **Call-now FAB** — floating phone button, pokazuje się na mobile (`<=767px`) z prawej krawędzi, sticky. Link do **`tel:+48502333645`**. Dodany w commit 2 (obok hamburgera).

## Ryzyka

- **Regresja desktop** — dlatego warstwa `@media (min-width: 1024px)` dla wszystkiego co już jest (baseline), i tylko `<=1023px` rules dodają zmiany
- **Slider reset przy resize** — transform na `.slider-track` musi się wyzerować gdy przejście desktop→phone
- **Modal class mismatch** — Codex znalazł martwy kod: `style.css:2149` ma `.blur-overlay { padding: 1rem }` i `style.css:2153` ma `.modal-content { padding: 2rem; max-height: 90vh; overflow-y: auto }` wewnątrz `@media (max-width: 768px)`, ale modal używa `.academy-modal-content` (od `style.css:2184`). Dead CSS rules — w commit 1 warto je usunąć.
- **Hash scroll + dynamic nav height** — dlatego `--nav-height` w JS, nie hardcoded CSS

## Luki do dopięcia przy implementacji (nie w oryginalnym Codex)

1. **Bug w hero CTA** — `business/index.html:58` ma `<a href="#section-szkolenia">` ale ID nie istnieje (są `#section-szkolenia-zespoly` i `#section-szkolenia-dev`). To bug OBECNY w produkcji, nie wymaga mobile — ale commit 2 Codex planu już to fixuje. Potwierdziłem sam.
2. **`theme-neon-nexus` w body** — na obu stronach klasa `theme-neon-nexus` jest w `<body>`, ale **nie ma żadnych reguł CSS dla tej klasy** (sprawdziłem `grep`). Legacy/decoracyjne. Nie wpływa na mobile, ale warto usunąć przy refactor.
3. **`main.js:255` nav observer** — potwierdzone: `navLinks = Array.from(document.querySelectorAll('.site-nav-links a'))` działa na wszystkich linkach nav. Po dodaniu hamburgera DOM zostaje ten sam (`.site-nav-links` wrapper) — observer nadal działa bez zmian. ✓
4. **Testimonials duplicate batch** — w `business/index.html` jest DWUKROTNIE ten sam zestaw testimonials (dla marquee infinite scroll). Na mobile Codex proponuje `display: none` na duplikacie przez class modifier. Wymaga dodania klasy `.testimonial-clone` na drugim batchu.
5. **Landing chooser `src/landing.js`** — oddzielny entry (potwierdzone). Hamburger NIE jest potrzebny na landing (chooser ma tylko 2 karty). Landing hamburger = pomijamy.
