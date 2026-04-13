# Changelog

Log zmian w projekcie AI Pulse. Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/).



## [0.498] — 2026-04-13

Business sections mobile — tablet layer, phone tool media-object, swipe testimonials, stacked footer (Task 3 commit 4/5).

### Added
- **Tablet layer** `@media (min-width: 768px) and (max-width: 1023px)`:
  - `.tool-grid` 3-col (was inheriting phone 2-col)
  - `.branze-grid` 3-col
  - `.strony-grid` 2-col
  - `.method-steps` 3-col (explicit)
  - `.form-row` 2-col (explicit)
- **Testimonial scroll-snap swipe rail** at `<=1023px`:
  - Animation disabled
  - Horizontal overflow + `scroll-snap-type: x mandatory`
  - Cards flex 0 0 85% (max 320px) with `scroll-snap-align: start`
  - Duplicate set `:nth-child(n+11)` hidden
- **Phone tool-card media-object layout** — icon left (48px), content right, 2-column grid
- **Phone footer stack** — `.footer-inner { flex-direction: column; gap: 1.5rem }` + smaller padding
- **Phone contact cleanup** — `.section-contact .col-6 { padding: 1.5rem }`

### Changed
- `@media (max-width: 768px)` → `@media (max-width: 767px)` (phone only, narrowed)
- Phone grids now **1-col** where previously 2-col:
  - `.tool-grid` 2-col → 1fr (media-object)
  - `.branze-grid` 2-col → 1fr
  - `.pricing-grid` 2-col → 1fr (will be detailed ladder in commit 5)

### Why
- Task 3 commit 4/5
- Testimonials animated marquee was janky on narrow screens — swipe rail feels intentional
- Tool grid 2-col on mobile was cramping labels — media-object gives each tool breathing room

---

## [0.497] — 2026-04-13

Tighten landing chooser mobile — everything fits in one viewport (no scroll).

### Changed
- `.landing-half` padding: `5rem 1.5rem 3rem` → `2rem 1.5rem 1.5rem`
- `.landing-business` padding-top: `6rem` → `3.5rem`
- `.landing-security` padding-bottom: `5rem` → `3rem`
- `.landing-logo` mobile size: `3rem` → `2.5rem`
- `.landing-tagline` margin-bottom: `2rem` → `1rem`
- `.landing-desc` mobile: 0.95rem → `0.9rem` + margin-bottom `1rem`
- `.landing-cta` padding: `0.9rem 2rem` → `0.7rem 1.5rem`
- `.landing-overlay` top: `2.5rem` → `1.25rem` (mobile only)
- `.landing-footer` bottom: `1.5rem` → `1rem` (mobile only)

Reclaimed ~180px vertical space → fits on iPhone SE (568px).

### Why
- User: "zmniejsz odstępy między częściami kontentu — nie mieszczą się na ekranie"

---

## [0.496] — 2026-04-13

Landing chooser mobile layout fix — overlay header + footer no longer covered by content.

### Fixed
- `body.landing-body` — `overflow: hidden` → `overflow: auto` on mobile (<=768px) so content fits without forcing 100vh cramp
- `.landing-half` — `min-height: 50vh` → `min-height: 0` + `padding: 5rem 1.5rem 3rem` for generous breathing room
- `.landing-business` — extra `padding-top: 6rem` so overlay label "AI PULS · WYBIERZ OBSZAR" doesn't kiss the logo
- `.landing-security` — extra `padding-bottom: 5rem` so footer badge "v0.x · © 2026 Ai Puls" doesn't kiss the WEJDŹ CTA
- `.landing-logo` — locked to `3rem` on mobile (was clamp — intent now explicit)
- `.landing-desc` — smaller font (0.95rem) + tighter margin-bottom

### Why
- User on mobile: "kontent zasłania i nagłówek i stopkę"
- Root cause: 50vh half + fixed absolute overlay/footer positioning caused overlap on small phones where content height exceeded remaining space

---

## [0.495] — 2026-04-13

Fix mobile security hero: flex-direction row → column so cert strip flows below content instead of beside CTAs.

### Fixed
- `.hero-static` on non-desktop: added `flex-direction: column` (was row inherited from desktop), cert strip now appears in order `order: 2` (after text + photo)
- Cert strip on mobile: centered via `max-width: min(100%, 420px)` + `margin: 2rem auto 0` + explicit image `max-width: 360px`

### Changed
- `.hero-static` padding on non-desktop: `2rem 0 3rem` (was using previous padding-bottom 6rem via `.flex-center-v`)

### Why
- User on 375px: "w wersji cyber hero reset słabo wyszedł - zostały certyfikaty w kontent i rozjechała się strona"
- Root cause: changed `align-items` but left default `flex-direction: row` → certs flowed as sibling column next to content instead of below

---

## [0.494] — 2026-04-13

Mobile hamburger nav + hero reset + Call-now FAB (Task 3 commit 2/5).

### Added
- **Brutalist hamburger menu** — 2 thick horizontal bars in 44x44px square frame (morphs to X on open), shown at `<=1023px`
- **Mobile drawer** — full-width sheet slides down from under sticky nav; black bg + violet accent border; all 7 links as tappable rows with 48px min height; `.nav-active` shown as left amber/violet border
- **Call-now FAB** — floating phone button (56x56px, accent color, brutalist border + box-shadow), fixed bottom-right on `<=1023px`; `tel:+48502333645`
- `initMobileNav()` in `main.js` — toggle with `aria-expanded`, close on: hash-link click / Escape / outside click / resize to desktop
- `initNavHeightTracking()` — ResizeObserver on `.site-nav`, keeps `--nav-height` CSS var in sync with actual measured height

### Changed
- Hero on non-desktop (`<=1023px`): removed `margin-left: -100px` photo overlap, photo `max-width: 320px`, padding-left 0, content centered vertically
- Hero on phone (`<=767px`): headline uses `clamp(2.25rem, 8vw, 3rem)`, CTAs stack full-width, photo 260px
- Security hero certificates: position absolute → static/flow on `<=1023px`, cap at 360px wide

### Fixed
- **Bug**: `business/index.html:58` hero secondary CTA pointed to `#section-szkolenia` (non-existent) → now `#section-szkolenia-zespoly`

### Why
- Task 3 commit 2/5 — mobile + tablet usable, desktop unchanged
- Codex audit caught the hero CTA bug; fixed now alongside mobile work
- FAB follows user request (Polish B2B prefers calling over forms)

## [0.493] — 2026-04-13

Mobile foundation (Task 3 Commit 1): nav-height CSS variable, modal mobile fix, prefers-reduced-motion.

### Added
- **`--nav-height: 108px`** CSS custom property in `:root` — single source of truth for nav offset calculations, replaces hardcoded values
- **`prefers-reduced-motion: reduce`** media query — disables testimonial marquee + smooth scroll + global animation/transition durations for users who prefer reduced motion (WCAG AAA)
- **Academy modal mobile responsive rules** — proper `.academy-modal-backdrop` + `.academy-modal-content` mobile sizing (was targeting non-existent `.blur-overlay` + `.modal-content` — dead CSS removed)

### Changed
- `.section { scroll-margin-top }` now uses `calc(var(--nav-height) - 30px)` instead of hardcoded `78px` — self-adjusting if nav height ever changes

### Removed
- Dead CSS at former `style.css:2149` targeting `.blur-overlay` (class didn't exist in HTML)
- Dead CSS at former `style.css:2153` targeting `.modal-content` (class didn't exist; actual modal uses `.academy-modal-content`)

### Why
- Foundation for 5-commit mobile responsive rollout (Task 3 plan)
- Pure infrastructure: desktop rendering byte-identical to v0.492
- Fixes found by Codex during planning audit

## [0.492] — 2026-04-12

Content density pass: compact training cards, tighter pricing, shorter contact.

### Changed
- **Business szkolenia (zespoly + dev)** — dodana klasa `.section-szkolenia-compact` (był sam dev). Typography −10%, module-visual 400→360px, slider-col-text padding 2→1.5rem.
- **Training-image-container** w compact: `aspect-ratio: 16/9` → fixed `height: 360px` (zespoly używa `training-image-container`, nie `module-visual-container` — bez override skalował się do ~450px na szerokim ekranie).
- **section-szkolenia-header margin-bottom**: 3rem → 0.75rem (oszczędność ~36px, podnosi slider do góry).
- **Security szkolenia** — title podniesiony do góry: `justify-content: flex-start` override na section. Header margin-bottom: 2rem → 0 (slider +32px w górę).
- **Security szkolenia subtitle** — dodany 2-zdaniowy opis: "Lepiej zapobiegać niż później ratować. Godzina szkolenia kosztuje mniej niż jeden incydent — a blokuje ich dziesiątki."
- **Pricing cards (security oferta)** — ~17% redukcja wielkości:
  - padding 2rem 1.75rem → 1.65rem 1.45rem
  - name 1.4rem → 1.15rem
  - desc 0.85rem → 0.72rem (min-height 4rem → 3.4rem)
  - CTA font 0.75rem → 0.65rem, padding 0.85rem 1rem → 0.7rem 0.85rem
  - labels 0.7rem → 0.6rem
  - features li 0.82rem → 0.7rem
- **Section-contact min-height**: 90vh → 65vh (kontakt + footer mieszczą się w jednym viewporcie, oba pages).

### Fixed
- **Scroll-to-anchor** — usunięty duplikat: `scroll-padding-top` (html) sumował się ze `scroll-margin-top` (section). Teraz tylko `scroll-margin-top: 78px` (108 nav - 30 bonus content-reveal).

### Why
- User: "obie sekcje szkolenia mają duży gap pomiędzy nagłówkiem a opisem — podnieś do góry 30-40px"
- User: "zmniejsz wielkość kontentu do wartości jak w security — tam mamy dobry setup"
- User: "podnieś tytuł sekcji do góry, pod tytułem dodaj 2-3 zdaniowy opis że lepiej zapobiegać niż ratować"
- User: "zmniejsz wielkość kart o 15-20% — lekkości na stronie teraz bardzo wypełnionej"
- User: "sekcja kontakt jest za wysoka — zmniejszmy do 60-70vh żeby mieściła się razem ze stopką"

---

## [0.491] — 2026-04-12

UX polish: nav active indicator, 90vh sections, business standardization, Toolbox CTA, scroll-to-anchor fix, nav order fix.

### Added
- **START link** na początku navbara (oba pages) — smooth scroll do `#top` (dodany ID na body)
- **Active section indicator** — amber/violet underline (24px, 2px) pod bieżącym linkiem nav. Scale-X transition (0.3s). Hover też wyświetla.
- **IntersectionObserver** dla nav — śledzi ratio każdej sekcji i podświetla tę najbardziej widoczną w viewporcie.
- **AiPulse Toolbox button** — amber CTA w prawym górnym rogu sekcji Narzędzia AI (business page). `href="#"` — na razie placeholder.
- **Nowe CSS klasy**: `.nav-start`, `.nav-active`, `.narzedzia-header`, `.narzedzia-header-text`, `.toolbox-btn`
- `id="top"` na body (obu stron) — anchor dla "START" link

### Changed
- **Min-height 90vh** dla wszystkich sekcji (oba pages):
  - `.section-tall` min-height 70vh → **90vh**
  - `.section-contact` min-height 70vh → **90vh**
  - Business sections (automatyzacje, narzedzia, o-nas, strony, szkolenia-zespoly, szkolenia-dev) → dodana klasa `.section-tall`
  - Security sections (proces, oferta) → dodana klasa `.section-tall`
- **Business section labels — ujednolicone do `// NAZWA` format**:
  - `WDRAŻAJ AI` → `// WDRAŻAJ AI`
  - `BUDUJ Z AI` → `// BUDUJ Z AI`
  - `NARZĘDZIA AI` → `// NARZĘDZIA AI`
  - `AUTOMATYZACJE` (color #999) → `// AUTOMATYZACJE` (color amber)
  - `STRONY INTERNETOWE` → `// STRONY WWW`
  - `// JAK_DZIAŁAMY` (gray + underscore) → `// JAK DZIAŁAMY` (amber + space)
  - `// REKOMENDACJE` (gray) → amber
- **Business O nas** — usunięty blok KPI (10+/6/100%), podniesione rekomendacje (marquee) bezpośrednio pod method-steps
- **Scroll-to-anchor offset** — `scroll-margin-top: 78px` na `.section` (było 70, potem duplikat scroll-padding + scroll-margin sumował się do 216). Teraz sekcja wsuwa się 30px pod nav, więcej contentu widocznego.
- **Nav order fix** — menu pasuje do kolejności sekcji na stronie:
  - Business: Automatyzacje przed Narzędzia (było odwrotnie)
  - Security: Szkolenia → Jak pracujemy → Dla kogo (było pomieszane)

### Removed
- KPI container block w `section-o-nas` (10+ / 6 / 100%) — bez kontekstu, niepotrzebne
- `scroll-padding-top` na html — duplikat ze `scroll-margin-top` na sekcjach, sumowało się do 216px

### Why
- User: "w business jest bajzel z nazwami sekcji różne wyrównania, brak //" — ujednolicone
- User: "wysokość każdej sekcji to minimum 90vh" — chcemy unikać widoku tła innych sekcji
- User: "sekcja z KPI — nie pasuje mi, podnieś do góry opinie"
- User: "przewija sekcje tak, że widoczna jest końcówka poprzedniej sekcji" → fix scroll offset + 30px bonus
- User: "menu przewija do góry i na dół bo nie ma właściwej kolejności" → nav order = section order

---

## [0.4.9] — 2026-04-12

Hero polish — uczciwy headline + wyrównanie certyfikatów.

### Changed
- **Hero headline**: "BEZPIECZEŃSTWO GOTOWE W TYDZIEŃ" (niedokładne — audyt w tydzień, ale wdrożenie miesiąc) → **"CYBER-AUDYT W 7 DNI"** (uczciwe, dotyczy faktycznie audytu). Accent "W 7 DNI" w violet.
- **Hero subtitle**: "Audyty... w 3-7 dni" → "Audyty cyberbezpieczeństwa dla MŚP. Zgodność z KSC/NIS2 i wymaganiami ubezpieczycieli. Wiesz gdzie jesteś — wiesz co zrobić." (bardziej benefit-oriented, odnosi się do outcome audytu).
- **Hero padding-bottom content**: 10rem → 13rem (content +50px wyżej, więcej space pod nawigacją).
- **Certyfikaty w hero**: 260px → **390px** (+50% rozmiaru).
- **Certyfikaty Y-center**: bottom 2.5rem → 10.75rem — teraz idealnie wycentrowane w pionie z przyciskami CTA (diff < 0.1px). Obliczenie: `cert_bottom = cta_padding - (cert_half - cta_half)`.

### Added
- **Certyfikaty klikalne**: wrapper `<a href="#section-proces">` → scroll do sekcji "Jak pracujemy" (gdzie są pełne opisy). Hover: `scale(1.02) + violet drop-shadow`.

### Fixed
- **`.hero-static` bug**: brak `position: relative` → `.hero-certificates-link` pozycjonowało się względem body zamiast hero-static. Dodany `position: relative`.

---

## [0.4.8] — 2026-04-12

Security — copy polish + pricing cards alignment.

### Changed
- **Hero headline**: "BEZPIECZEŃSTWO BEZ KORPO-BUDŻETÓW" → **"BEZPIECZEŃSTWO GOTOWE W TYDZIEŃ"** (speed benefit zamiast negatywnego "bez korpo")
- **Hero subtitle**: usunięte "Bez 45 000 PLN za raport od wielkich firm konsultingowych" (niepotrzebne)
- **KSC data**: "3 kwietnia 2026 wchodzi" → "3 kwietnia 2026 weszła" (past tense — data już minęła)
- **Compliance subtitle**: "Timing jest idealny — ale czas działa na Twoją niekorzyść" → **"Każdy dzień zwłoki to rosnące ryzyko"** (po wejściu w życie)
- **Jak pracujemy subtitle**: "Trzy kroki... certyfikaty poniżej gwarantują..." (słabe) → **"Od pierwszej rozmowy do raportu — trzy kroki, które możesz przewidzieć. Szybko, konkretnie, bez ukrytych kosztów."**
- **Gap Jak pracujemy** — zmniejszony z 4rem/3.5rem do 2.5rem/1.5rem, certyfikaty przesunięte wyżej
- **Audyt Standardowy** → **Audyt Rozszerzony** (nazwa + label w kategorii)
- **"NAJCZĘŚCIEJ WYBIERANY" badge**: Standard → **Basic** (Audyt Podstawowy)

### Added
- **Pricing cards alignment via CSS subgrid** — `pricing-grid` ma `grid-template-rows: auto auto 1fr auto auto`, każda karta używa `grid-template-rows: subgrid`. Efekt: label, name, desc (rozciągliwy), CTA, features — wszystko wyrównane w rzędach między kartami.

---

## [0.4.7] — 2026-04-12

Security review + language cleanup. Naprawy merytoryczne, uproszczenie żargonu, uspójnienie brandu.

### Fixed (merytoryczne)
- **UODO/PUODO**: "Obowiązek zgłoszenia do UODO (72h) i PUODO" — błąd merytoryczny (UODO i PUODO to ta sama instytucja). Zmienione na "Prezesa UODO i CERT Polska".
- **DPO + Inspektorzy Ochrony Danych** — redundancja (DPO = IOD). Zostawione "IOD".
- **Nav spójność**: "Proces" → "Jak pracujemy" (pasuje do nagłówka sekcji).
- **Brand**: "AI Pulse" → "Ai Puls" w business/index.html (5 miejsc — title, meta, alt, footer).
- **Hardcoded version v0.2.0** w HTML → pusty placeholder (JS nadpisuje z aktualnej wartości).

### Fixed (język korzyści)
- **"big four"** → "wielkich firm konsultingowych" (user z MŚP nie zna żargonu finansowego).
- **"kontrakty obronne" / US DoD** → "klienci enterprise, instytucje finansowe i ubezpieczyciele" (istotne dla target grupy).
- **"Bezpieczne używanie AI" desc**: "Shadow AI, prompt injection, data leakage przez ChatGPT" → "Twój zespół już używa ChatGPT? Upewnij się, że nie wyciekają przez to firmowe dane."
- **"Rozpocznij samoocenę"** (kłamliwe CTA → #contact) → "Zapytaj o samoocenę" + dopisek "Narzędzie wkrótce dostępne online".
- **Polityka prywatności** `href="#"` → `/privacy/` (przekieruje 404, ale nie skacze do góry strony).

### Spolszczenie (MŚP-friendly)
- "gap analysis" / "gap assessment" → "analiza luk"
- "checklist" → "lista kontrolna"
- "benchmark" → "średnia branżowa"
- "Score 0-100" → "Wynik 0-100"
- "Shadow AI" → "nieautoryzowane AI w firmie"
- "prompt injection i data leakage" → "ochrona danych firmowych przed wyciekiem do narzędzi AI"
- "supply chain attack" → "atak na jedną firmę IT dotyka setek jej klientów"
- "real-world examples" → "prawdziwe przykłady"
- "password managery" → "menedżery haseł"
- "social engineering" → "manipulacja socjotechniczna"
- "incident reporting" → "zgłaszanie incydentów"
- "BYOD" → "prywatne urządzenia"
- "click-rate" → "skuteczność kliknięć w phishingu"
- "tabletop exercise" → "ćwiczenie praktyczne"
- "weak passwords" → "słabe hasła"
- "incident response playbook" → "plan reakcji na incydent"

### Why
- Jargon utrudnia zrozumienie dla target grupy (właściciele firm 10-50 osób, nie zawsze z tłem IT)
- Błędy merytoryczne (UODO/PUODO) obniżają wiarygodność
- Niespójny branding ("AI Pulse" vs "Ai Puls") łamie profesjonalizm
- Honest CTA = mniej frustracji usera

---

## [0.4.6] — 2026-04-12

### Added
- `.section-tall` utility — `min-height: 70vh` + flex column + justify-content: center

### Changed
- **DLACZEGO TERAZ (Compliance)**, **Szkolenia**, **Dla kogo** — dodany `.section-tall` = min-height 70vh z wycentrowanym contentem. Sekcje wypełniają ekran, kontent nie "wisi" u góry.

---

## [0.4.5] — 2026-04-12

Security page — restrukturyzacja sekcji + content cleanup.

### Added
- **Nowa sekcja `Jak pracujemy`** (bg: white): 3 kroki procesu + certyfikaty w jednym bloku. Tytuł: "Proces, który możesz prześledzić". Certyfikaty (CompTIA Security+, DEKRA ISO/IEC 27001) teraz na białym tle — dużo lepiej widoczne.
- **Dla kogo jako osobna sekcja** (bg: black): branże grid z ciemnym stylem kart (`.branza-card-dark`). Przeniesiona AFTER "Jak pracujemy".
- CSS: `.branza-card-dark`, `.protocol-step-light`, `.section-szkolenia-compact`

### Changed
- **Nowa kolejność sekcji**: Hero(D) → Compliance(W) → Szkolenia(D) → **Jak pracujemy(W)** → **Dla kogo(D)** → Oferta(W) → Kontakt(D). Perfect D-W-D-W-D-W-D alternation.
- **Szkolenia**:
  - Usunięty podtytuł "Audyt pokazuje luki techniczne..."
  - Label: "SZKOLENIA" → "// SZKOLENIA" (spójność z innymi sekcjami)
  - Content zmniejszony o ~10% (font-size, padding, image height) — sekcja mniej zagracona
  - Padding-top zredukowany (4rem zamiast 6rem) — mniej pustego gapu
- **Oferta**:
  - Usunięte wycentrowanie (left-aligned jak inne sekcje)
  - Label: "OFERTA" → "// OFERTA"
  - Tytuł: "Od samooceny do pełnego wdrożenia" → **"Wybierz pakiet bezpieczeństwa dla siebie"**
  - Usunięty podtytuł "Cztery poziomy wsparcia..."
  - Padding-top zredukowany (4rem) — mniej gapu
- **Kontakt**: dodany `min-height: 70vh` + align-items: center → sekcja wypełnia ekran, nie widać białego tła poprzedniej sekcji

### Removed
- **Sekcja "Dlaczego my" (KPI numbers)**: 3-7 / 80% / 5× — user uznał za niepotrzebne
- **Stara standalone sekcja Proces** (ciemna, 3 kroki bez certyfikatów) — content przeniesiony do "Jak pracujemy"

### Why
- KPI liczby bez kontekstu nie przekonywały — lepiej pokazać proces 3-krokowy
- Certyfikaty na czarnym tle były ciężkie czytelnie — biele pokazuje je lepiej
- Center-alignment w ofercie łamał spójność layoutu
- Gap nad szkoleniami/ofertą wynikał z dużych paddingów headerów

---

## [0.4.4] — 2026-04-12

Visual rhythm fix — sekcje naprzemiennie jasne/ciemne + usunięcie pustych gapów.

### Changed
- **`.section` base class**: usunięty `min-height: 100vh` który powodował że każda sekcja zajmowała pełen ekran (ogromne puste gapy). Padding zredukowany z `8rem` do `5rem`. To był **główny sprawca pustych obszarów**.
- **`.section-full-height`**: padding z `8rem` → `6rem`, usunięty `min-height: 80vh`
- **Security — reorder sekcji**: Swap Dla-kogo ↔ Szkolenia żeby osiągnąć perfect alternację
  - Było: Hero(D)-Compliance(W)-**Dla kogo(W)**-**Szkolenia(D)**-Proces(D)-Oferta(W)-Kontakt(D) — 2 konflikty
  - Jest: Hero(D)-Compliance(W)-**Szkolenia(D)**-**Dla kogo(W)**-Proces(D)-Oferta(W)-Kontakt(D) — **0 konfliktów, D-W-D-W-D-W-D ✓**
- **Business — reorder sekcji**: 2 swapy (narzędzia↔automatyzacje + strony↔o-nas) dla lepszej alternacji
  - Było: Hero(D)-Zespoly(W)-Dev(D)-**Narzędzia(D)**-Auto(W)-Strony(D)-O-nas(W)-Kontakt(D) — konflikt Dev-Narzędzia
  - Jest: Hero(D)-Zespoly(W)-Dev(D)-**Auto(W)**-**Narzędzia(D)**-**O-nas(W)**-**Strony(D)**-Kontakt(D)
  - Sekwencja D-W-D-W-D-W-D-D — 1 konflikt tylko na końcu (Strony-Kontakt, mniej widoczne)

### Why
- User zauważył że sekcje powinny naprzemiennie zmieniać kolor tła (lepszy visual rhythm)
- User zauważył puste gapy — głównym sprawcą był `.section { min-height: 100vh }` z globalnego CSS (każda sekcja zajmowała 100vh nawet gdy content był krótki, co tworzyło ogromne puste miejsca)

---

## [0.4.3] — 2026-04-12

Security page — rozbudowa treści + nowa sekcja szkoleń.

### Added
- **Sekcja szkoleń security** — 4-slajd slider (dark theme) między "Dla kogo" a "Proces":
  - Security Awareness (anti-phishing, MFA, social eng)
  - Bezpieczne używanie AI (shadow AI, data leakage, AI Act)
  - Incident Response (kadra zarządzająca, symulacja ransomware)
  - RODO + NIS2 w praktyce (DPO, rejestr, gap analysis)
- **Opisy certyfikatów** w sekcji "Dlaczego my" — 2 badges (CompTIA Security+, DEKRA ISO/IEC 27001) z opisem i "Dlaczego istotne" highlight box (amber border-left)
- **Rozbudowa opisów branż** — każda karta ma teraz 2-3 linie opisu + 3 bullet points (`▸` amber) z konkretnymi powodami dla branży
- `src/security-data.js` — nowy export `securitySzkoleniaData` dla 4 szkoleń
- `main.js` — obsługa nowego typu modala `security-szkolenia`
- `SECTION_TO_NAV` — dodana sekcja `section-szkolenia-security` do IntersectionObservera
- CSS: `.cert-strip`, `.cert-item`, `.cert-item-why`, `.branza-card-points`

### Changed
- **Certyfikaty w hero** — przeniesione z overlay na zdjęciu (bottom 30% left 8%) do prawy dolny róg sekcji hero (bottom 2.5rem right 3rem, 260px wide). Bezpieczny gap od edges.
- Nav: dodany link "Szkolenia" (6 linków zamiast 5)
- `renderSzkoleniaModal(data, type)` — obsługuje 3 typy: audyty (CTA "Zamów audyt"), security-szkolenia (CTA "Zapytaj o szkolenie"), szkolenia (business, CTA "Zapytaj o szkolenie")

---

## [0.4.2] — 2026-04-12

Security page — restrukturyzacja pod B2B content funnel (edukacja → rozwiązanie).

### Changed
- **Nowa kolejność sekcji**: Hero → NIS2/KSC → Dla kogo + Dlaczego my → Proces → Oferta → Kontakt
  - Edukacja (compliance) pierwsza, pricing ostatni
  - Standard B2B funnel: awareness → target → differentiation → process → price → action
- **Merge** sekcji "Dla kogo" (branże) + "Dlaczego my" (KPI) w jedną `#section-dla-kogo` z dwoma blokami
- **Pricing cards — bez cen**: usunięte `.pricing-card-price` ze wszystkich 4 kart (ceny zostały w modalach)
- **Samoocena**: "Bezpłatnie" przesunięte z osobnego bloku w inline label przy nazwie
- **Modal CTA kontekstowy**: `renderSzkoleniaModal(data, type)` — dla `audyty` CTA = "Zamów audyt" (nie "Zapytaj o szkolenie")
- **Nav**: reorder linków (NIS2/KSC → Dla kogo → Proces → Oferta → Kontakt)

### Why
- Pricing po hero pokazywał ofertę zanim user zrozumiał problem (NIS2, ryzyko)
- 2 osobne sekcje (Dla kogo + KPI) miały podobny cel trust-building → merge
- Ceny na kartach duplikowały info które jest już w modal details
- "Zapytaj o szkolenie" w modalu audytu było mylące (security ≠ szkolenia)

---

## [0.4.1] — 2026-04-12

Redesign sekcji ofertowej security — z slidera (image 60% + tekst 40%) na 4-kolumnową siatkę kart pricing inspirowaną Railway.com/pricing.

### Changed
- **Security: slider audytów → grid pricing cards** (Railway-style)
- **Samoocena jako 4. karta** (integracja freemium jako entry point, nie osobna sekcja)
- Nav: "Audyty + Samoocena" → jeden link "Oferta"
- Hero CTA "Samoocena online" → "Zobacz ofertę" (scroll do pricing)
- Stały layout `_00 Samoocena → _01 Basic → _02 Standard (highlighted) → _03 Premium`

### Added
- `.pricing-grid` — 4-col desktop, 2-col tablet, 1-col mobile
- `.pricing-card` z hover lift effect (transform + border-color)
- `.pricing-card-highlighted` — violet border + box-shadow + badge "NAJCZĘŚCIEJ WYBIERANY"
- `.pricing-card-cta` (filled violet) + `.pricing-card-cta-outline` (black outline)
- `.pricing-footnote` z CTA do kontaktu
- Features list z violet checkmark markers (✓)

### Removed
- Slider audytów (section-audyty + nav-audyty)
- Osobna sekcja SelfCheck (section-selfcheck)
- IntersectionObserver mapping dla `section-audyty` (slider już nie istnieje)
- 4 wygenerowane obrazy audit-basic/standard/premium/selfcheck nie są już używane w sekcji głównej (zostają do ewentualnego użycia w modalach)

### Fix
- Poprzednio (v0.4.0): obraz zajmował 50-60% szerokości, użytkownik musiał scrollować slider aby zobaczyć wszystkie pakiety
- Teraz: wszystkie 4 opcje widoczne w jednym viewport, szybkie porównanie

---

## [0.4.0] — 2026-04-12

Rozszerzenie firmy o drugą linię biznesową: **Ai Puls Cyber Security**. Pełna restrukturyzacja na multi-page app z chooser landing i dwoma osobnymi podstronami (`/business`, `/security`).

### Added
- **Landing chooser** na `/` — split-screen hover effect (Demo B), dwa logo obok siebie z różnymi kolorami kropki (amber vs violet)
- **Nowa linia biznesowa: Security** (`/security/index.html`):
  - 3 pakiety audytów (Basic 3.5-5k / Standard 7-10k / Premium 12-18k PLN)
  - SelfCheck — samoocena online jako lead magnet
  - 5 branż docelowych (kancelarie, biura rach., medycyna, e-commerce, IT)
  - 3-krokowy proces (Rozmowa → Audyt → Raport)
  - Sekcja Compliance: NIS2/KSC + Ubezpieczenie Cyber + Security Awareness (z modalami)
  - Formularz kontaktowy z RODO
- **Tagline pod logo** w navbarze (DORADZTWO BIZNESOWE / CYBER SECURITY)
- **Violet accent color** `#7E22CE` dla security (vs amber `#F5A623` dla business)
- Theme switching via body class: `.theme-business` vs `.theme-security`
- `src/security-data.js` — modal data dla audytów i compliance
- `scripts/generate-security-images.mjs` — dedicated security image generation
- 4 nowe AI images dla security: audyt-basic/standard/premium + selfcheck

### Changed
- **Multi-page Vite setup** (`vite.config.js` z 3 entry points: landing, business, security)
- Business content przeniesiony z `/` do `/business/`
- MK photos (MK_3.0, MK_3.1) przeniesione do `public/` dla ścieżek absolutnych
- `main.js` generalizowany — obsługuje 4 typy modali (auto, szkolenia, audyty, compliance) i dynamiczny IntersectionObserver (business + security section IDs)
- Bump wersji: 0.3.0 → 0.4.0

### Removed
- Demo files (`demo-a.html`, `demo-b.html`) — temporary dla oceny landing layouts

### Technical
- 3 osobne entry points w Vite rollup config
- Shared styles via theme variants (jeden `style.css` dla wszystkich stron)
- Shared modal system: 4 content types, 2 renderers (auto-style, training-style)

---

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
