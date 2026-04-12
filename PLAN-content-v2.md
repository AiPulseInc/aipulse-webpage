# AI Pulse — Plan Iteracji Kontentu v2 (ZAKTUALIZOWANY)

**Status:** Draft do akceptacji · v2.1 po review
**Autor:** Claude Opus 4.6 (sesja 2026-04-12)
**Zakres:** Refaktoryzacja sekcji Szkoleń + generowanie obrazów AI + cleanup stale

> **Zmiany od v1:** Dwa slidery zamiast jednego, model Gemini 3.1 (nie 3.0), SDK `@google/genai` (nie deprecated), dodane: RODO, alt text, cleanup `images/`, rewrite README, Phase 0 verify, error handling w skrypcie

---

## 1. Cele iteracji

1. **Język korzyści** — przebudowa opisów szkoleń: "po co" (cel) + "co dostanę" (efekt)
2. **Rozbudowa oferty** — 4 → 7 szkoleń, każde z modalem "więcej"
3. **Dopasowany język** — beginner = plain PL, advanced = mix PL+EN
4. **Dwa slidery** — rozdzielenie "Dla zespołów" i "Dla developerów"
5. **Obrazy AI-generated** — uzupełnienie placeholderów (szkolenia, ikony narzędzi, mockupy stron)
6. **Czyste etykiety** — usunięcie słowa "SZKOLENIE" z labelów (zostaje `_01`, `_02`...)
7. **Cleanup stale** — usunięcie starych artefaktów z poprzedniej wersji strony

---

## 2. Oferta szkoleniowa — 2 slidery × 7 pozycji łącznie

### Slider A: "Dla Zespołów" (3 pozycje) — plain Polish

Nagłówek sekcji: **Szkolenia AI dla Twojego zespołu**
Podtytuł: *Praktyczne szkolenia dla osób, które używają AI w pracy — sprzedaż, marketing, operations.*

| # | Nazwa w slajdzie | Etykieta nav | Źródło |
|---|------------------|------|--------|
| 01 | **Podstawy rozmowy z AI** | Podstawy | Mariusz-prompt-workflow |
| 02 | **Prawo Jazdy AI** | Prawo Jazdy | prawo-jazdy-ai/ |
| 03 | **Zbuduj własnego agenta AI** | AI Builder | ey-course/ |

### Slider B: "Dla Developerów" (4 pozycje) — mix PL+EN

Nagłówek sekcji: **Szkolenia AI dla developerów**
Podtytuł: *Buduj z AI. Dev tools, advanced workflows, multi-agent orchestration.*

| # | Nazwa w slajdzie | Etykieta nav | Źródło |
|---|------------------|------|--------|
| 04 | **Claude Code: Start** | CC Start | cc-full.md |
| 05 | **Claude Code: Skills dla biznesu** | CC Skills | cc-skills.md |
| 06 | **Claude Code: Pro** | CC Pro | cc-advance.md |
| 07 | **Gemini + AntiGravity** | AntiGravity | gemini+antigravity.md |

**Alternatywne nazewnictwo sekcji** (do wyboru):
- "Dla Zespołów" / "Dla Developerów" ← **rekomendacja**
- "Wdrażaj AI" / "Buduj z AI"
- "AI w codziennej pracy" / "AI pod maską"
- "Użytkownicy" / "Twórcy"

### Struktura każdego slajdu

**W slajderze (widok główny):**
- Etykieta `_0X // [KATEGORIA]`
- Duży nagłówek (pełna nazwa)
- 2-3 zdania korzyści (dlaczego + co)
- `[Zapytaj o szkolenie]` (amber) + `[Więcej →]` (outline)
- Kolumna wizualna z AI-generated obrazem (4:3) + alt text

**W modalu (po kliknięciu "Więcej"):**
- Dla kogo
- Czego się nauczysz (3-5 bulletów korzyści)
- Program (moduły)
- Format (czas, grupa, online/on-site)
- Wynik
- CTA `[Zapytaj o szkolenie]`

### Draft treści

**01. Podstawy rozmowy z AI** *(Mariusz workflows)*
- Slide desc: "Naucz się pisać polecenia do AI, które dają przewidywalne, powtarzalne wyniki. Bez technicznego żargonu, bez znajomości kodu."
- Modal — Dla kogo: Osoby poznające AI po raz pierwszy, managerowie, HR, administracja
- Modal — Czego się nauczysz:
  - Jak rozmawiać z ChatGPT, Claude, Gemini żeby dostać to, czego potrzebujesz
  - 5 sprawdzonych schematów rozmowy (Cel → Kontekst → Ograniczenia → Format)
  - Kiedy użyć którego narzędzia AI (Gemini vs Claude vs Perplexity)
  - Jak zbudować własną bibliotekę poleceń dla swojej firmy
- Modal — Format: 1 dzień on-site / 4 sesje online · grupa do 14 osób
- Modal — Wynik: Gotowa biblioteka 10+ poleceń do codziennej pracy

**02. Prawo Jazdy AI** *(dla sprzedaży B2B)*
- Slide desc: "Twój zespół sprzedażowy zaoszczędzi 10h/tygodniowo dzięki AI — na researchu, ofertach, follow-upach. Bez ryzyka utraty danych klientów."
- Modal — Dla kogo: Handlowcy B2B, Key Account Managers, menedżerowie sprzedaży
- Modal — Czego się nauczysz:
  - Automatyzacja prospectingu (od leada do spotkania)
  - Pisanie personalizowanych ofert i follow-upów
  - Wybór narzędzi AI dla sprzedaży (Gemini, Claude, Perplexity, Notebook LM)
  - Bezpieczeństwo danych klientów (RODO, RAG, hallucynacje)
  - Budowa własnej biblioteki poleceń sprzedażowych
- Modal — Format: 1 dzień on-site · grupa do 14 osób · praca na własnych danych
- Modal — Wynik: Funkcjonalny proces sprzedażowy z AI + biblioteka promptów

**03. Zbuduj własnego agenta AI** *(EY Advance)*
- Slide desc: "Nie ucz się jak korzystać z gotowych narzędzi — naucz się jak BUDOWAĆ własne. Agent AI skonfigurowany pod Twoje produkty, klientów, procesy."
- Modal — Dla kogo: Dyrektorzy sprzedaży/marketingu, właściciele MŚP, specjaliści chcący iść dalej
- Modal — Czego się nauczysz:
  - Technika masterprompt (jeden prompt = cały proces)
  - Integracja z CRM bez ryzyka (RAG, bezpieczne połączenia)
  - Deployment lokalny (dane zostają u Ciebie) vs chmurowy
  - Autonomiczne agenty AI — jak projektować i wdrażać
- Modal — Format: 6h warsztat · hands-on · poziom średniozaawansowany
- Modal — Wynik: Działający agent AI zbudowany podczas szkolenia na Twoich danych

**04. Claude Code: Start** *(CC Basic)*
- Slide desc: "Automate your daily coding work. Claude Code handles boilerplate, bugs, refactory — Ty skupiasz się na architekturze."
- Modal — Dla kogo: Developerzy Junior-Mid, QA, techniczni PMowie
- Modal — Czego się nauczysz:
  - Setup: IDE, CLAUDE.md, permissions, plan mode
  - Building web apps — od zera do deploya
  - Context management, slash commands, hooks
  - Claude Code Skills i Model Context Protocol (MCP)
- Modal — Format: 2-dniowy kurs online · hands-on
- Modal — Wynik: Pełny setup Claude Code + pierwsza app zbudowana podczas kursu

**05. Claude Code: Skills dla biznesu** *(CC Skills for Business)*
- Slide desc: "Zastosuj Skills Claude Code do konkretnych procesów biznesowych. ROI widoczny w pierwszym tygodniu."
- Modal — Dla kogo: Developerzy z doświadczeniem CC, team leadzi, solopreneurs
- Modal — Czego się nauczysz:
  - Skills — jak projektować i wdrażać dla biznesu
  - 10+ gotowych Skills do reużycia
  - Automatyzacja repetitive tasks (raportowanie, onboarding, maintenance)
  - Metryki ROI dla AI workflows
- Modal — Format: 1-dniowy intensive · hands-on · na Twoich procesach
- Modal — Wynik: 3-5 własnych Skills skonfigurowanych dla Twojego biznesu

**06. Claude Code: Pro** *(CC Advanced)*
- Slide desc: "Mastery level. Claude Code staje się Twoim zespołem Junior developerów pracujących 24/7."
- Modal — Dla kogo: Senior developerzy, architekci, tech leadzi
- Modal — Czego się nauczysz:
  - Multi-agent orchestration (kilka agentów współpracujących)
  - Hooks, subagents, worktrees — zaawansowane wzorce
  - Performance tuning i cost optimization
  - Production deployment + monitoring
- Modal — Format: 3-dniowy zaawansowany kurs · hands-on
- Modal — Wynik: Kompletny workflow developmentu z AI w production

**07. Gemini + AntiGravity** *(Gemini 3.1 + AntiGravity Vibe Coding)*
- Slide desc: "Alternatywny stack do Claude Code. Gemini 3.1 Pro + AntiGravity — setup, który obsługuje $4M+ biznesy Nicka Saraeva."
- Modal — Dla kogo: Developerzy chcący znać więcej niż jeden ekosystem, solopreneurs
- Modal — Czego się nauczysz:
  - Setup AntiGravity + Gemini 3.1 Pro w środowisku dev
  - "Vibe coding" methodology — jak pracować z AI bez utraty kontroli
  - Porównanie: Claude Code vs Gemini+AntiGravity (kiedy którego używać)
  - Łączenie obu ekosystemów w jednym workflow
- Modal — Format: 2-dniowy kurs online · hands-on
- Modal — Wynik: Działający setup + pierwsza app zbudowana w nowym stacku

---

## 3. Zmiany strukturalne

### HTML (`index.html`)

**Podział sekcji szkoleń na 2 osobne sekcje:**

```html
<section id="section-szkolenia-zespoly" class="section section-white section-full-height">
  <!-- Header: "Szkolenia AI dla Twojego zespołu" -->
  <!-- Slider z 3 pozycjami -->
  <!-- nav-szkolenia-zespoly z 3 pozycjami -->
</section>

<section id="section-szkolenia-dev" class="section section-white section-full-height">
  <!-- Header: "Szkolenia AI dla developerów" -->
  <!-- Slider z 4 pozycjami -->
  <!-- nav-szkolenia-dev z 4 pozycjami -->
</section>
```

**Etykiety w slajdach:** `_01 // FUNDAMENTY` (bez słowa "SZKOLENIE")

**Nowe przyciski per slajd:**
- `[Zapytaj o szkolenie]` (primary, amber)
- `[Więcej →]` (outline) — otwiera modal

**Nawigacja głównego navbara** zmienia się z jednego linka "Szkolenia" na dwa:
- "Dla zespołów" → `#section-szkolenia-zespoly`
- "Dla developerów" → `#section-szkolenia-dev`

### JavaScript (`main.js`)

**Generalizacja `openModal`** dla dwóch typów danych:

```js
const MODAL_DATA = {
  'auto': automatyzacjeData,
  'szkolenia': szkoleniaData
};

function openModal(type, id) {
  const data = MODAL_DATA[type]?.[id];
  if (!data) return;
  // ... render
}

// Event delegation:
document.addEventListener('click', (e) => {
  const item = e.target.closest('[data-modal]');
  if (item) openModal(item.dataset.modalType, Number(item.dataset.modal));
});
```

**HTML atrybuty:** `data-modal-type="szkolenia" data-modal="1"` zamiast `data-auto="1"`.

**IntersectionObserver** — obserwuje oba nowe ID:
```js
document.querySelectorAll('#section-szkolenia-zespoly, #section-szkolenia-dev')
  .forEach(s => observer.observe(s));
```
Mapowanie section→nav w observerze:
- `section-szkolenia-zespoly` → `nav-szkolenia-zespoly`
- `section-szkolenia-dev` → `nav-szkolenia-dev`

**`szkoleniaData`** — 7 entries (id: 1-7) z pełną treścią modalu.

### CSS (`style.css`)

- Responsywność context-nav-bar dla 3 i 4 pozycji (niewielkie zmiany)
- Nowa klasa `.training-image` dla AI-generated obrazów w slajderze
  - Aspect ratio 4:3
  - `object-fit: cover`
  - Lazy loading
- Klasa `.tool-icon` dla ikon (64x64px min, skalowalne)
- Klasa `.strona-mockup` zastępuje `.strona-card-placeholder`
- Hover states dla obrazów (lekki lift + amber border)

### Contact form — dodać RODO consent

Polski rynek B2B wymaga explicit consent dla RODO:
```html
<label class="form-consent">
  <input type="checkbox" required />
  <span>Wyrażam zgodę na przetwarzanie moich danych osobowych przez AI Pulse w celu kontaktu ze mną. <a href="#">Polityka prywatności</a>.</span>
</label>
```

---

## 4. Obrazy AI — Style Guide (uaktualnione)

**Estetyka (wersja A — spójna brutalistyczna):**

- Kolory: czerń #000, biel #FFF, amber #F5A623
- Styl: minimalistyczny, geometryczny, abstrakcyjny
- Zakazy: ludzie, dosłowne ikony, stockowy feel, neony, purple, tekst
- Feel: obsidian brutalist, tech-abstract, subtle, prestiżowo

**Model (ZWERYFIKOWANY):** `gemini-3.1-flash-image-preview` (Nano Banana 2)
**SDK:** `@google/genai` (NIE `@google/generative-ai` — deprecated od 2025-08)
**Aspect ratios:** 1:1, 16:9, 9:16, 21:9 (NIE 16:10 — niewspierane)
**Output:** WebP
**Klucz:** `GEMINI_API_KEY` z `/Users/mk/code-sandbox/toolbox-project/.env`

**Łącznie:** 22 obrazy
- 7 szkoleń — slajd visual (ratio **4:3** → *fallback 1:1 lub 16:9 jeśli 4:3 niewspierane*)
- 10 narzędzi — ikony (ratio 1:1)
- 5 stron WWW — mockupy biznesowe (ratio **16:9**, nie 16:10)

### Promptowanie — szablon

```
Minimalist brutalist digital illustration.
Solid black background (#000000).
White geometric elements.
Amber (#F5A623) accent — used sparingly for focal point.
Clean, precise, abstract, technical aesthetic.
Obsidian design language: dark, premium, minimal.
No people, no faces, no realistic icons, no text, no words.
[SUBJECT-SPECIFIC DIRECTION]
```

### Lista obrazów z promptami

**SZKOLENIA (ratio 1:1 — safest dla mock-up container)**

1. **Podstawy rozmowy z AI** — "Abstract dialogue flow. White rounded square on left, amber circle on right, flowing white line connecting them. Represents simple conversation between human and AI. Symmetric composition."

2. **Prawo Jazdy AI** — "Diagonal upward arrow composed of small amber dots transitioning to white lines. Represents velocity and growth. B2B sales trajectory. Dynamic minimalism."

3. **Zbuduj własnego agenta AI** — "Three stacked white geometric cubes. Top cube has amber glow. Represents construction, layering, architectural building. Isometric perspective."

4. **Claude Code: Start** — "Simplified white terminal cursor block on black. One character highlighted in amber. Minimalist code editor aesthetic. Starting point representation."

5. **Claude Code: Skills dla biznesu** — "White puzzle piece being fitted into amber-outlined receptacle. Modularity, composition. Clean geometric puzzle piece."

6. **Claude Code: Pro** — "Interconnected white network nodes. One critical path highlighted in amber. Complex workflow visualization. Sophisticated graph structure."

7. **Gemini + AntiGravity** — "Two orbiting white circles around amber gravitational center. Dual stack balance. Orbital mechanics abstract."

**IKONY NARZĘDZI (ratio 1:1, small scale)**

Każda ikona: biała geometric linia + mały amber akcent, flat, technical.

8. Voice Agents — "Stylized microphone with minimal sound wave lines, amber dot at mic base."
9. Inbox Agent — "Stacked white envelope shapes with one amber corner highlight."
10. Voice Memo PRO — "Microphone silhouette with arrow to document shape, amber accent on transition."
11. Generator vCard — "Business card rectangle with amber corner dot. Minimal contact info suggestion."
12. Generator Grafik AI — "Image frame rectangle with amber sparkle accent inside."
13. Smart Video Prompter — "Camera aperture iris with amber center dot. Geometric precision."
14. Transkrypcja Audio — "Sound waveform transforming into horizontal lines, amber accent at transformation point."
15. YouTube Transcript — "Play button triangle with adjacent text line indicators, amber on triangle."
16. Generator QR — "Simplified QR code pattern with one amber corner block."
17. Twoje narzędzie — "White question mark centered in amber circle. Symbolic custom tool."

**MOCKUPY STRON (ratio 16:9)**

18. **Sklep e-commerce** — "Dark minimalist e-commerce website mockup. Product grid layout, amber 'Dodaj do koszyka' buttons. Sleek photography frames. Polish SMB e-commerce aesthetic."

19. **Agent ubezpieczeniowy** — "Professional Polish insurance agent landing page mockup. Dark theme with amber CTA 'Oblicz składkę'. Trust-building layout with policy types grid, hero image frame."

20. **Firma usługowa** — "Generic service company landing page mockup. Dark brutalist aesthetic. Hero section with amber CTA, service cards grid below, testimonials section."

21. **Firma ogrodnicza** — "Polish garden services landing page mockup. Dark premium look, amber accents on leaf-shape decorative elements. Before/after project gallery, services grid. Sophisticated outdoor business feel."

22. **Pole golfowe** — "Premium Polish golf course landing page mockup. Dark elegant design with amber accents. Aerial course photography frames, tee time booking widget, member area preview section."

---

## 5. Plan techniczny

### Nowe pliki

```
aipulse-webpage/
├── scripts/
│   └── generate-images.mjs          # Node script → Gemini API
├── public/                           # [new] Vite static assets
│   └── generated/
│       ├── szkolenia/
│       │   ├── podstawy.webp
│       │   └── ... (7 plików)
│       ├── tools/
│       │   ├── voice-agents.webp
│       │   └── ... (10 plików)
│       └── strony/
│           ├── ecommerce.webp
│           └── ... (5 plików)
└── .env.local                        # Nie commitowany (już gitignored)
```

### Skrypt generujący obrazy — z error handling

```js
// scripts/generate-images.mjs
import 'dotenv/config';
import { createClient } from '@google/genai';
import fs from 'fs/promises';
import path from 'path';

const client = createClient({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-3.1-flash-image-preview';

const IMAGES = [
  { id: 'podstawy', dir: 'szkolenia', ratio: '1:1', prompt: '...' },
  // ... 22 entries
];

async function generateOne(img, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await client.models.generateImage({
        model: MODEL,
        prompt: img.prompt,
        config: { aspectRatio: img.ratio, outputFormat: 'image/webp' }
      });
      const b64 = result.images[0].data;
      const buffer = Buffer.from(b64, 'base64');
      const outPath = `public/generated/${img.dir}/${img.id}.webp`;
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      await fs.writeFile(outPath, buffer);
      console.log(`✓ ${img.id} (${buffer.length / 1024 | 0}KB)`);
      return true;
    } catch (err) {
      console.warn(`✗ ${img.id} attempt ${attempt + 1}/${retries + 1}: ${err.message}`);
      if (attempt === retries) return false;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

const start = Date.now();
const results = { ok: 0, fail: [] };
for (const img of IMAGES) {
  const ok = await generateOne(img);
  if (ok) results.ok++;
  else results.fail.push(img.id);
}
console.log(`\n${results.ok}/${IMAGES.length} generated in ${((Date.now() - start) / 1000).toFixed(1)}s`);
if (results.fail.length) console.log(`Failed: ${results.fail.join(', ')}`);
```

**Cechy:** retry 2x, logowanie, summary, graceful partial failure.

### Zmiany w package.json

```json
{
  "scripts": {
    "generate-images": "node scripts/generate-images.mjs"
  },
  "devDependencies": {
    "@google/genai": "^1.0.0",
    "dotenv": "^16.0.0"
  }
}
```

### Gitignore dla public/generated/

**Decyzja:** nie gitignorować — obrazy są częścią kontentu strony, commit ułatwia deployment. Jeśli się zmieni decyzja, łatwo dodać do `.gitignore`.

---

## 6. Fazy wykonania

### Faza 0 — Weryfikacja API (BLOCKER)
- Instalacja `@google/genai` i `dotenv`
- Test z 1 obrazem (najprostszy prompt) żeby potwierdzić:
  - Nazwa modelu jest aktualna
  - API odpowiada poprawnie
  - Format odpowiedzi (base64 vs URL)
- **Nie idziemy dalej jeśli API nie działa.**

### Faza 1 — Cleanup stale
- Usunięcie `images/` folderu (1.8MB starych klatek animacji, już nieużywanych)
- Rewrite `README.md` (obecnie o "Antigravity AI", ma być o AI Pulse)
- Update `CLAUDE.md` (wyrzucić stare notki o "ai-agency-brand-book" misnomer — już naprawione)

### Faza 2 — Kontent + struktura (HTML/JS/CSS)
- Podział `#section-szkolenia` na `#section-szkolenia-zespoly` i `#section-szkolenia-dev`
- 3 + 4 slajdy z nowym kontentem w języku korzyści
- Dodanie modali dla 7 szkoleń (`szkoleniaData`)
- Generalizacja `openModal` dla 2 typów (auto + szkolenia)
- CSS: responsywność, nowe klasy (`.training-image`, `.tool-icon`, `.strona-mockup`)
- Dodanie RODO consent w formularzu
- Update navbara (dodanie "Dla developerów", przemianowanie "Szkolenia" → "Dla zespołów")

### Faza 3 — Generowanie obrazów
- Uruchomienie `npm run generate-images`
- Weryfikacja: 22 obrazy .webp w `public/generated/`
- Przegląd jakości — re-gen niesatysfakcjonujących (może 2-3 prób na obraz)

### Faza 4 — Integracja obrazów
- Wstawienie `<img>` do slajdów szkoleń (alt text obowiązkowy!)
- Wstawienie ikon do kart narzędzi
- Zamiana placeholderów stron na mockupy (5 business types)
- Lazy loading (`loading="lazy"` na wszystkich poza hero)
- Tuning CSS (object-fit, aspect-ratios, hover states)

### Faza 5 — Weryfikacja
- Dev server + screenshoty każdej sekcji (desktop + mobile viewport)
- Test interakcji:
  - Slider #1 (3 pozycje) + context nav
  - Slider #2 (4 pozycje) + context nav
  - Modale szkoleń (7 szt.)
  - Modale automatyzacji (3 szt.)
  - Formularz kontaktowy + RODO checkbox (walidacja)
- Lighthouse audit (accessibility, SEO, performance)
- Build production check
- Commit

---

## 7. Stale items — co trzeba posprzątać

Podczas review znalazłem:

| Plik | Problem | Akcja |
|------|---------|-------|
| `README.md` | "Antigravity AI" / "© 2026 Antigravity AI" | Rewrite na AI Pulse |
| `CLAUDE.md` | "package.json name is ai-agency-brand-book — a misnomer" | Usunąć notkę (już poprawione) |
| `images/` | 1.8MB starych klatek animacji hero (nieużywane) | Delete folder |
| `assets/` | 22MB `duplicated frames/` + mp4 (już gitignored) | Delete z dysku po potwierdzeniu |
| Testimonials | Nadal "Antigravity" w testimonialach | Zostawić (user czeka na prawdziwe); dodać TODO w kodzie |
| `PLAN-content-v2.md` | To jest plan — zostawić lub usunąć po wdrożeniu | Decyzja po Fazie 5 |

**Testimonials note:** user explicitly said keep them until real ones come. Nie zmieniam, ale dodaję komentarz HTML `<!-- TODO: Replace with real testimonials -->` dla jasności.

**`.agent/` folder** — zawiera wiele odniesień do "Antigravity Kit". To jest nazwa frameworka Gemini CLI (Google product), NIE nasz brand. Zostawić bez zmian.

---

## 8. Otwarte pytania / ryzyka

1. **Nazwa modelu Gemini** — research wskazuje `gemini-3.1-flash-image-preview`, ale researcher zaznaczył że może wymagać live weryfikacji w Google AI Studio. Faza 0 zweryfikuje praktycznie.

2. **Aspect ratio 4:3 dla szkoleń** — API wspiera 1:1, 16:9, 9:16, 21:9, ale nie 4:3. Używamy **1:1** dla szkoleń (square visuals). Jeśli designed layout potrzebuje 4:3, crop po stronie CSS.

3. **Budżet obrazów** — 22 × ~$0.05-0.10 = **$1-2 USD**. OK?

4. **Ikony narzędzi 1:1** — obecny grid to 5x2. 256px ikony w karcie 240px szerokości mogą wymagać tuning CSS. Alt: używamy 128px, oszczędność ~200KB per karta.

5. **Jakość AI-generated** — prompty są starannie przygotowane ale AI bywa nieprzewidywalne. Zakładam 2-3 re-generacje na niektóre obrazy. Budżet akceptuje 50-70 generacji (wciąż <$5).

6. **`@google/genai` SDK dojrzałość** — świeżo zastąpiło `@google/generative-ai`. API może mieć drobne różnice od przykładów. Faza 0 zweryfikuje.

7. **Naming dla 2 grup** — rekomendacja "Dla Zespołów" / "Dla Developerów". Brak absolute best option — user wybiera.

---

## 9. Acceptance criteria

- [ ] Slider A (3 pozycje) i Slider B (4 pozycje) działają niezależnie
- [ ] Wszystkie 7 szkoleń ma kompletny kontent w języku korzyści
- [ ] Każde szkolenie ma modal z pełnym opisem (target, program, format, wynik)
- [ ] Etykiety `_01`, `_02`... bez słowa "SZKOLENIE"
- [ ] 22 obrazy AI-generated w `public/generated/` z alt text
- [ ] Wszystkie CTA prowadzą do `#contact` z tekstem "Zapytaj o szkolenie"
- [ ] Formularz kontaktowy ma RODO checkbox (wymagany)
- [ ] Stary folder `images/` usunięty
- [ ] `README.md` zaktualizowany na brand AI Pulse
- [ ] Build czysty, Lighthouse score ≥ 90 dla accessibility
- [ ] Dev server renderuje identycznie jak obecnie + nowa treść
- [ ] Responsywność: obie sekcje slajderów + grid narzędzi + strony mockupy działają na mobile

---

## 10. Estymacja zakresu

- **Linie HTML:** ~500-700 dodatkowych
- **Linie JS:** ~120-180 dodatkowych
- **Linie CSS:** ~60-90 dodatkowych
- **Skrypt obrazów:** ~150-200 linii
- **Generacja obrazów:** 3-5 min API (+ potencjalne re-geny)
- **Łączny czas pracy:** ~3-4h roboty na kod + czas na review obrazów

---

**Koniec planu v2.1.** Do akceptacji lub modyfikacji.
