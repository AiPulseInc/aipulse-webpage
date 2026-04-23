# Ai Pulse Security — Brand Book

**Status:** v1, 2026-04-22. Working document — update kiedy pattern się zmienia, nie raz na rok.
**Cel:** praktyczny przewodnik do tworzenia treści i materiałów Ai Pulse Security. Nie manifesto, nie agency-deck.

---

## 1. Pozycjonowanie

**Kim jesteśmy:** Ai Pulse Security = **audytor bezpieczeństwa dla MŚP**, nie dostawca software ani IT outsourcing.

**Core positioning statement:**
> Audyty cyberbezpieczeństwa dla polskich MŚP. Konkretne rekomendacje w 7 dni, nie PowerPointy na kwartał.

**Co robimy:**
- Audyt Podstawowy / Pro (pre-audit ISO 27001)
- Compliance NIS2 / RODO
- Raporty dla brokerów ubezpieczeń cyber
- Bezpłatna samoocena (lead magnet)
- 30-min konsultacje z 3 rekomendacjami

**Czego NIE robimy:**
- Instrukcji DIY (nie tutorialujemy administratorów)
- Sprzedaży software / licencji
- Pentestów ofensywnych
- Wdrożenia („skonfigurujemy MFA za Ciebie")
- Szkoleń dla zespołów IT (to business line)

**Dlaczego to ważne:** każdy blog post i LI post musi reprezentować **audytora**, nie konsultanta DIY. Jeśli tekst daje pełną instrukcję „jak to naprawić sam" — pozycjonuje nas jako zastępowalny blog techniczny. Jeśli diagnozuje problem i kieruje do nas po weryfikację — pozycjonuje nas jako źródło audytu.

---

## 2. ICP — Idealny Klient

| Wymiar | Opis |
|--------|------|
| Wielkość | MŚP 10-250 osób (sweet spot 20-100) |
| Rola decyzyjna | Właściciel / CFO / COO. NIE: head of IT (kupuje, ale nie decyduje) |
| Branża | Agnostyczna, ale silne: e-commerce, produkcja, dystrybucja, usługi B2B, kancelarie, klinki |
| Dojrzałość security | Od zera („mamy antywirusa") do średniej („IT mówi, że mamy, ale nie wiem czy działa") |

**Trigger events** (dlaczego szukają nas teraz):
1. **Klient enterprise wymaga ISO 27001** — dostają ankietę 80 pytań od dużego klienta, nie mają co odpowiedzieć
2. **Broker pyta o cyber insurance** — chcą ofertę, broker wymaga audytu przed polisą
3. **Incydent u konkurencji** — wyciek w branży podnosi świadomość („sprawdźmy czy my też")
4. **NIS2 wchodzi w życie** — firma w łańcuchu dostaw podmiotu kluczowego/ważnego
5. **Zmiana CEO / nowy właściciel** — due diligence przed inwestycją

**Nie nasz klient:**
- Korporacje 500+ (za duże, wewnętrzne CISO)
- Samorządy / publiczne (inne procedury, długie przetargi)
- Startupy pre-seed (brak budżetu, brak skali do audytu)
- Firmy jednoosobowe (za mała ekspozycja, rekomendujemy samoocenę DIY)

---

## 3. Voice & Tone

### Core voice — 5 cech

1. **Bezpośredni** — zero korporacyjnej waty, zaczynamy od konkretu
2. **Cyniczny bez złośliwości** — humor na problem, nie na klienta
3. **Polski** — język polski w 100%, angielski tylko w technikaliach które nie mają tłumaczenia (MFA, bcrypt, OAuth, ransomware)
4. **Specific** — konkretne nazwy firm, konkretne liczby, konkretne daty
5. **Benefit > feature** — mówimy co klient zyskuje, nie co my dostarczamy

### Tone ladder — różne treści, różny ton

| Kanał | Ton | Długość | Hook |
|-------|-----|---------|------|
| LI post | Urgency + action | 1500-1900 znaków | Stat z nagłówka ("850 GB danych UW…") |
| Blog post | Analityczny, edukacyjny | 2500-3500 słów | Incydent + data ("9 lutego 2026 — UW wykrywa…") |
| Email (nurture) | Osobisty, 1 insight | 500-800 znaków | Pierwsze imię + jeden konkret |
| Email (cold) | Bez pretekstu, 1 CTA | 400-600 znaków | Co mają do zrobienia w 30s |
| Landing page | Benefit-first | n/a | "Audyty cyberbezpieczeństwa dla MŚP" |
| Oferta | Strukturyzowana, ścisła | 2-3 strony | Deliverables + timing + cena |

### Don't — co nam nie brzmi

- „Kompleksowa ochrona" / „holistyczne podejście" / „synergiczne rozwiązanie"
- „W dzisiejszym zglobalizowanym świecie…" (w ogóle preambuła)
- „Nasze rozwiązanie eliminuje 99% zagrożeń" (aspirational claim)
- Emoji jako akcent (wyjątek: 🔒 w CTA)
- Wykrzykniki w nagłówkach
- „Zapraszamy do kontaktu!" — mamy konkretne CTA

---

## 4. Writing Principles — 6 reguł twardych

### 4.1 Literal truth only
Headline ma być **literally true** i **specyficzny do zakresu**, który dostarczamy. Jeśli nie umiesz dostarczyć w 7 dni — nie pisz „w 7 dni". Jeśli nie audytujesz 30-osobowej firmy za 5 tys. PLN — nie pisz „od 5 tys. PLN".

### 4.2 No DIY
Nasze blog posty **diagnozują problem** i **kierują do audytu**. Nie uczymy administratorów konfigurować DMARC. Nie pokazujemy komend. Jeśli tekst mówi „wklejasz ten rekord w panelu Cloudflare…" — pozycjonuje nas jako tutorial. Zmień na „skonfigurowanie wymaga znajomości rekordów DNS — w samoocenie sprawdzisz, czy jest prawidłowo ustawione".

**Wyjątek:** quick wins w LI post mogą pokazać kierunek (np. „MFA wszędzie, pół dnia"), ale bez step-by-step.

### 4.3 No external tool links
Nie linkujemy do zewnętrznych narzędzi audytu: mxtoolbox, CERT Polska formularze, Have I Been Pwned, dnsdumpster publicznie. To kieruje ruch poza nasz ekosystem. **Jedyne linki zewnętrzne:** źródła informacji (CyberDefence24, oficjalne komunikaty organizacji, analizy vendorów jak FortiGuard/ESET).

**Wyjątek:** blog post może wspomnieć narzędzie kontekstowo („dnsdumpster czy podobne"), ale bez klikalnego linka — rezultat ma prowadzić do naszej samooceny.

### 4.4 Specific > abstract
- ❌ „mała firma" → ✅ „firma 30-osobowa"
- ❌ „niski koszt" → ✅ „0 zł, pół dnia"
- ❌ „recent incident" → ✅ „9 lutego 2026 UW wykrywa…"
- ❌ „niektóre polskie sklepy" → ✅ „vegehome.pl i polskiekoldry.pl"

### 4.5 Benefit > feature
- ❌ „Oferujemy audyt zgodny z ISO 27001" → ✅ „Dostaniesz raport, którym broker cyber otworzy Ci ofertę polisy"
- ❌ „Metodologia oparta na NIST CSF" → ✅ „Wiesz, co musisz naprawić zanim klient enterprise sprawdzi Cię ankietą"

### 4.6 CTA tylko do naszego ekosystemu
Hierarchia CTA w każdej treści:

| Priorytet | CTA | Kiedy |
|-----------|-----|-------|
| 1 | Bezpłatna samoocena (15 min, bez rejestracji) | Zawsze — top of funnel |
| 2 | 30-min rozmowa + 3 rekomendacje | Gdy angle mocno diagnostyczny |
| 3 | Pełny audyt (Podstawowy / Pro) | Landing page, oferta, nie w postach |

Nigdy: „sprawdź bezpieczeństwo swojej firmy na [zewnętrznym narzędziu]".

---

## 5. Visual Identity

### 5.1 Paleta (security line)

| Rola | Hex | Użycie |
|------|-----|--------|
| Background | `#000000` | Canvas, dark sections |
| Primary text | `#FFFFFF` | Headlines, body text on dark |
| Secondary text | `#CCCCCC` | Descriptions, captions |
| **Accent (security)** | `#7E22CE` | Labels, CTA, logo dot, hover, highlight |
| Borders | `#333333` | Dividers, card borders |
| Success/positive | `#10B981` | (używane rzadko, np. checkmark list) |
| Warning | `#F59E0B` | (ostrzeżenia, ryzyka) |
| Error | `#EF4444` | (błędy formularza, incident alerts) |

**Kolor violet (`#7E22CE`) jest unikalny dla security line.** Business line używa `#F5A623` (amber). Nie mieszamy — violet oznacza "to jest security content".

### 5.2 Typografia

| Rola | Font | Waga | Użycie |
|------|------|------|--------|
| Logo | Outfit | 800 | „ai**p**ulse" — dot nad „i" w kolorze accent |
| Headlines | Inter | 700-900 | h1, h2, nagłówki sekcji |
| Body | Inter | 400-500 | paragraph text |
| Mono/data | Space Grotesk | 500 | kod, liczby, dane techniczne |
| Small/labels | Inter | 600 | uppercase labels, // REKOMENDACJE |

**Nie używamy:** Arial, Times New Roman, Comic Sans (rzecz jasna), Roboto (too generic).

### 5.3 Logo — konstrukcja i zasady

**UWAGA:** Logo Ai Pulse **nie jest plikiem graficznym** (SVG / PNG). To **konstrukcja typograficzna z pseudo-elementami CSS**. Ten sposób renderowania jest integralną częścią tożsamości — jeśli ktoś odtworzy logo jako obrazek z plain „i", straci sygnaturę wizualną.

#### 5.3.1 Struktura — co dokładnie widać

Tekst odbierany przez użytkownika i screen readery: **„Ai Pulse"** (dwa słowa, Capital „A", litera „i", spacja, Capital „P", „ulse").

Ale renderowane wizualnie — litera „i" jest **trójwarstwowa**:

| Warstwa | Glyph | Kolor | Rola |
|---------|-------|-------|------|
| Natywna `i` (w HTML) | `i` | `transparent` | Daje semantykę (screen reader), ale niewidoczna wizualnie |
| `::before` pseudo-element | `ı` (dotless i, Unicode U+0131) | `--text-primary` (biały na dark / czarny na light) | Pokazuje **trzonek litery bez kropki** |
| `::after` pseudo-element | okrąg 0.25em × 0.25em, `border-radius: 50%` | `--brand-accent` (violet `#7E22CE` dla security / amber dla business) | Pokazuje **kropkę nad ı** w kolorze linii |

**Dlaczego tak:** kolorowanie tylko kropki (bez trzonka) przez pseudo-element pozwala na:
1. Automatyczną zmianę koloru akcentu przez CSS variable (theme switching security ↔ business)
2. Zachowanie pełnej dostępności (screen reader czyta „Ai Pulse", nie „A pulse")
3. Unikalność wizualną niemożliwą do powielenia przez copy-paste tekstu

#### 5.3.2 Tagline pod logotypem

Pod napisem „Ai Pulse" znajduje się **tagline** identyfikujący linię:

| Linia | Tagline | Pozycja | Przykład obecny |
|-------|---------|---------|-----------------|
| Security | `Cyber Security` | Pod logo, mniejsza czcionka | `<div class="site-nav-tagline">Cyber Security</div>` |
| Business | `Business` | Pod logo, mniejsza czcionka | `<div class="site-nav-tagline">Business</div>` |

**Styl tagline:**
- Font: `Space Grotesk`, 500
- Size: `0.65rem` (desktop) / `0.6rem` (mobile)
- Letter-spacing: `0.15em`
- Text-transform: `uppercase`
- Kolor: `--text-secondary` (#CCCCCC na dark BG, #666 na light)
- Margin-top od „Ai Pulse": `0.4rem`

Tagline jest **zawsze obecny** w navigacji i stopce, żeby od razu sygnalizować linię (security vs business). Użytkownik nigdy nie jest zgadywać.

#### 5.3.3 Typografia logotypu

| Element | Wartość |
|---------|---------|
| Font-family | `Outfit, sans-serif` |
| Font-weight | `800` (extra-bold) |
| Font-size (desktop) | `2.6rem` (~42px przy 16px base) |
| Font-size (mobile) | `1.8rem` (~29px) |
| Letter-spacing | `0.02em` (leciutko rozstrzelone) |
| Line-height | `1` (ciasno, bo tagline pod spodem) |

**Nie używaj:** innych wag Outfit (400, 500, 700) dla logo. Zawsze 800. To jest część identyfikacji — cienkie logo wygląda jak inna marka.

#### 5.3.4 Warianty — gdzie i jakie

| Wariant | CSS class | Użycie | Rozmiar kropki |
|---------|-----------|--------|----------------|
| Navigation logo | `.site-nav-brand` | Górna nav strony | 0.25em × 0.25em |
| Footer logo | `.footer-brand` | Stopka (mniejsza wersja) | **0.22em × 0.22em** (proporcjonalnie mniejsza) |
| Landing logo | `.landing-logo` | Strona wyboru `/` (`landing-security` / `landing-business`) | 0.25em × 0.25em |

**Pozycja kropki nad ı:**
- `top: 0.05em` (navigation + landing)
- `top: 0.22em` (footer — inna proporcja ze względu na mniejszy rozmiar)
- `left: 50%` + `transform: translateX(-50%)` (wycentrowana nad trzonkiem)

#### 5.3.5 Kolory akcentu per linia

| Linia | Body class | Hex accent | Kropka koloru |
|-------|------------|------------|---------------|
| Security | `theme-security` | `#7E22CE` (violet) | violet dot over „ı" |
| Business | `theme-business` | `#F5A623` (amber) | amber dot over „ı" |
| Landing (wybór brand) | `landing-security` / `landing-business` | jak wyżej | Każda sekcja landing ma swój kolor |

**Kolor kropki NIGDY nie jest inny** niż brand-accent linii. Nie zielony, nie czerwony, nie gradient. Jeden kolor, jeden brand, jedna linia.

#### 5.3.6 Clear space i minimum size

- **Clear space:** wokół całego bloku (logo + tagline) minimum `1x wysokość wielkiej A` pustej przestrzeni. W praktyce: jeśli logo ma 2.6rem, dookoła ~2.6rem nic innego.
- **Minimum size:** 
  - Desktop: 2.6rem (~42px) — poniżej tego kropka traci czytelność
  - Mobile: 1.8rem (~29px) — akceptowalny floor
  - **Nigdy** poniżej 1.5rem — poniżej tego układ „A" + „ı" + „kropka" zlewa się wizualnie

#### 5.3.7 Zasady użycia — DO

✅ Używaj CSS pseudo-element version w każdej instancji (nawigacja, stopka, landing)  
✅ Tagline ZAWSZE towarzyszy logo (żeby widać było linię)  
✅ Kropka zawsze w kolorze brand-accent zgodnym z linią  
✅ Tło: czarne (`#000`) dla security page, białe (`#FFF`) dla business page — obie wersje działają  
✅ Na tle dowolnego color: upewnij się że trzonek „ı" ma odpowiedni kontrast (biały na dark, czarny na light)

#### 5.3.8 Zasady użycia — DON'T

❌ Nie odtwarzaj logo jako statyczny PNG/SVG (stracisz automatyczną zmianę koloru + semantykę)  
❌ Nie używaj normalnego „i" z pełną kropką (tracisz unikalność — bo każda marka z „i" tak wygląda)  
❌ Nie zmieniaj koloru kropki na wartości spoza `#7E22CE` / `#F5A623`  
❌ Nie rozciągaj logo poziomo/pionowo (zaburza proporcje Outfit 800)  
❌ Nie dodawaj cienia (`box-shadow`, `text-shadow`), outline, glow, gradient fill  
❌ Nie obracaj logo (0° stale)  
❌ Nie umieszczaj logo na texture-heavy background (fotografie, wzory) — tylko solid color  
❌ Nie pomijaj tagline'u — user traci kontekst która to linia  
❌ Nie skaluj kropki niezależnie od tekstu — proporcja musi być zachowana (0.25em/0.22em relatywnie)

#### 5.3.9 Logo w zewnętrznych materiałach (PDF, prezentacja, wizytówka)

Gdy musisz wyeksportować logo do narzędzia, które **nie renderuje CSS** (PowerPoint, Illustrator, Canva, drukowana wizytówka):

1. **Przygotuj SVG** odtwarzający konstrukcję:
   - Text layer: „A" (Outfit 800), „Pulse" (Outfit 800)
   - Między nimi: dotless ı (Unicode U+0131, Outfit 800) w kolorze text-primary
   - Nad ı: circle o średnicy 0.25em w kolorze brand-accent
   - Tagline pod spodem: „Cyber Security" / „Business" (Space Grotesk 500, uppercase, 25% wielkości logo)

2. **Nazwa pliku:** `logo-aipulse-security-dark.svg` / `logo-aipulse-security-light.svg` / `logo-aipulse-business-*.svg` (8 wariantów: 2 linie × 2 tła × 2 orientacje poziomo/pionowo — jeśli potrzebne)

3. **Przechowuj w:** `brand-books/assets/` (TODO: utworzyć gdy będą eksporty)

**Do tej pory SVG nie istnieją — wszystko jest CSS.** Jeśli potrzebujesz do PDF/materiału drukowanego, zrób export (lub poproś designera) i dodaj do `brand-books/assets/` z powyższą konwencją.

### 5.4 Ilustracje / obrazki blogowe

Generowane przez **Nano Banana 2** (`gemini-3.1-flash-image-preview`) — spójnie z brandem:

**Consistent style rules:**
- Czarne tło (`#000`)
- Geometric / brutalist shapes
- Violet (`#7E22CE`) jako jedyny akcent kolorystyczny (zamiast amber dla business)
- No photorealism ludzi
- No stock photos
- Abstract symbolism > literal illustration

**Przykłady z bloga (sprawdzone prompty):**
- "Geometryczna sylwetka budynku uniwersyteckiego na czarnym tle z fioletowymi liniami danych uciekającymi przez pęknięcie w fasadzie" (ransomware-uw-interlock-2026)
- "Biała geometryczna wieża bazy danych na czarnym tle, z rzędami violetowych prostokątów-rekordów uciekających po bokach w ciemność" (wyciek-sklepow-polska-130k-2026)

Każdy obraz = metafora wizualna, nie ilustracja dosłowna.

### 5.5 OG images (social share)

- Format: 1200x630 px
- BG czarny, violet akcent
- Tytuł dużą czcionką Inter 900, max 60 znaków
- Logo w rogu (small, subtle)
- Dla security line: `og-security.png` (aktualny wariant B, commit 827f01e)

---

## 6. Content Types — Templates

### 6.1 Blog post

**Struktura (7-act):**

1. **Hook** (1-2 zdania) — konkretny incydent + data / stat („9 lutego 2026 — UW wykrywa podejrzaną aktywność")
2. **Analiza — co się stało** (1-2 akapity) — kontekst, timeline, zakres danych
3. **Wektor ataku — lekcja** (z podtytułem `### Wektor ataku — tu jest właściwa lekcja`) — rozłożenie mechanizmu na 3-5 kroków
4. **Dlaczego dotyczy Twojej firmy** (sekcja przeniesienia do audience MŚP) — konkretne scenariusze
5. **X rzeczy do zrobienia w tym tygodniu** (5 akcji, ponumerowane, z konkretem: „Koszt: 0 zł", „Czas: 1h")
6. **Czego ten incydent NIE pokazuje** (debunking 2-3 błędnych interpretacji)
7. **Co z tego wyniesiesz w 2 minuty** (TL;DR 3 bulletami)
8. **CTA** — samoocena + 30-min rozmowa (dwa linki)
9. **Źródła** (external linki, numbered list)

**Frontmatter (spójny z existing blogiem):**
```yaml
title: "Krótki tytuł — max 65 znaków"
slug: "kebab-case-slug"
date: "2026-04-22"
excerpt: "2-3 zdania hook'a, do listy blog"
description: "SEO description, max 160 znaków"
category: "Wycieki danych | Ransomware | Phishing | Compliance | Infrastruktura | Mity"
tags:
  - "wycieki-danych"
  - "ransomware"
  # 7-10 tagów
cover: "/generated/security/blog/slug.jpg"
coverAlt: "Opis obrazka generowanego (służy też jako prompt dla Nano Banana)"
featured: true
draft: false
author: "Maciej Konieczny"
```

**Długość:** 2500-3500 słów (dla długiej formy blogowej); 1800-2500 słów (dla posta reakcyjnego na incydent).

### 6.2 LinkedIn post

**Struktura (5-act, ≤1900 znaków):**

1. **Hook** (1 zdanie) — stat/incydent, MUSI zaczynać od konkretu („850 GB…", „132 tys. klientów…")
2. **Context** (2-3 akapity po 1-2 zdania) — co, jak, gdzie
3. **Wzorzec / punch** (1 zdanie) — pointa łącząca
4. **Quick wins dla audience** (3-5 bullet → z kosztem i czasem)
5. **CTA block** — oddzielony `---`, firma + 2-3 linki + hashtagi

**Hashtagi (3-5):** `#cyberbezpieczeństwo #MŚP #RODO #AiPulse` + 1 kontekstowy (`#ransomware`, `#ecommerce`, `#NIS2`)

**Timing publikacji:** wtorek-czwartek 9:00-11:00 (peak engagement PL LinkedIn dla B2B).

### 6.3 Email (cold outreach)

**Struktura (≤600 znaków):**

- Greeting z first name
- Hook (1 zdanie) — konkretny fakt o ich firmie (np. „widziałem, że [firma] weszła do NIS2 łańcucha dostaw")
- Value prop (1 zdanie) — co my robimy
- CTA (1 zdanie) — samoocena lub 15-min rozmowa
- Signature

**Template skeleton:**
> [Cześć / Dzień dobry] [Imię],
>
> [1 zdanie konkretnego hooka o ich sytuacji].
>
> [Ai Pulse robi audyty bezpieczeństwa dla MŚP — konkretne rekomendacje w 7 dni.]
>
> [Chciał(a)by [Imię] 15 minut, żeby zobaczyć, czy to Ci się opłaca? / Link do samooceny, jeśli wolisz na zimno.]
>
> Pozdrawiam,
> Maciej Konieczny
> Ai Pulse Security

### 6.4 Landing page copy

Struktura główna (`/security/`):
1. **Hero** — H1 positioning + CTA samoocena
2. **Problem statement** — 3 bullet o tym, co boli MŚP (ubezpieczenie, klient enterprise, NIS2)
3. **Oferta** — 3 pakiety (Podstawowy / Pro / Advanced) z cenami i deliverables
4. **Proces audytu** — 4-5 kroków z timingiem
5. **Case study / blog linki** — social proof
6. **Certyfikaty** — Security+, DEKRA SZBI, (CISA planowane)
7. **Testimonials** — (na razie brak dla security, tylko business; do dodania gdy będą)
8. **CTA final** — samoocena + 30-min rozmowa + kontakt

---

## 7. Taxonomy — Kategorie & Tags

### 7.1 Categories (max 1 per post)

- **Wycieki danych** — incidenty gdzie wyciekły dane osobowe / klientów
- **Ransomware** — ataki szyfrujące / data extortion
- **Phishing** — social engineering, BEC, deepfake
- **Compliance** — NIS2, RODO, ISO 27001, CRA
- **Infrastruktura** — DMARC, DNS, konfiguracja poczty, backupy
- **Ubezpieczenia cyber** — underwriting, polisy, scenariusze
- **Mity cyberbezpieczeństwa** — debunking ("mamy antywirusa, jesteśmy bezpieczni")

### 7.2 Tags (common pool)

```
wycieki-danych, ransomware, rodo, nis2, mfa, backup, incident-response, 
phishing, bec, deepfake, infostealer, credential-theft, supply-chain,
msp, uczelnie, e-commerce, kancelarie, klinki,
ubezpieczenie-cyber, underwriter, broker,
prestashop, woocommerce, shoper, idosell,
iso-27001, dmarc, spf, dkim,
oauth, api-security, dev-environment
```

Używamy 7-10 tagów per post, z różnych osi: branża + zagrożenie + obszar ryzyka.

---

## 8. Source Library — kogo cytujemy

### 8.1 Źródła pierwsze (linki w blog posts OK)

| Źródło | Typ | Użycie |
|--------|-----|--------|
| Oficjalne komunikaty ofiar (UW, sklepy) | Primary | Fakty podstawowe |
| CyberDefence24 | Polish journalism | Analizy incydentów PL |
| Niebezpiecznik | Polish technical analysis | Wektory ataków, PL context |
| CERT Polska | Government / technical | Alerty, raporty, analizy |
| FortiGuard Labs | Vendor threat intel | Outbreak alerts, ransomware profiles |
| ESET | Vendor threat intel | Malware analysis, PL presence |
| ENISA | EU agency | NIS2, compliance context |
| UODO | Polish regulator | RODO interpretacje |

### 8.2 Źródła wtórne (research, ale nie cytujemy bezpośrednio)

- Bleeping Computer, The Record, Krebs on Security — dobre research, ale anglojęzyczne i bardziej enterprise-focused
- SANS ISC, NIST NVD — vulnerability tracking

### 8.3 Źródła, których NIE używamy

- Blogi „top 10 cybersecurity tips" z marketing agencies
- LinkedIn influencer posts bez primary source
- Reddit, Twitter threads bez weryfikacji
- AI-generated content summaries (nie cytujemy AI)

---

## 9. Do's & Don'ts — konkretne przykłady

| ✅ Do | ❌ Don't |
|-------|---------|
| „850 GB danych UW już krąży po darknecie" | „Ostatnie ataki cyberbezpieczeństwa…" |
| „MFA — pół dnia, 0 zł" | „Wdrażamy nowoczesne rozwiązania MFA" |
| „PESEL-u nie zmienisz jak hasła" | „Ochrona danych osobowych jest ważna" |
| „Konkretne rekomendacje w 7 dni" | „Premium audyt dla Twojej firmy" |
| „vegehome.pl, polskiekoldry.pl" | „pewne polskie sklepy e-commerce" |
| „Według CyberDefence24…" | „Eksperci twierdzą…" |
| „Firma 30-osobowa ma 30 kont, nie 30 000" | „Dla małych firm to proste" |
| Link do `/bezpieczenstwo-samoocena/` | Link do mxtoolbox.com |
| „Kopiowanie 850 GB trwało tygodniami" | „Atak był długotrwały" |
| „Pracownik Vercela miał OAuth allow-all" | „Doszło do eskalacji uprawnień" |
| „Masz ten sam problem w mniejszej wersji" | „MŚP mierzy się z cyberzagrożeniami" |

---

## 10. Quick reference — check przed publikacją

Przed wypuszczeniem treści, sprawdź:

- [ ] Headline jest **literally true** i **specific** (test: czy umiem to dostarczyć?)
- [ ] Nie ma linków do zewnętrznych narzędzi audytu (mxtoolbox etc.)
- [ ] Nie ma step-by-step instrukcji DIY (wyjątek: quick wins LI)
- [ ] CTA prowadzi do **naszego** ekosystemu (samoocena / rozmowa / audyt)
- [ ] Źródła są primary albo autorytatywne (nie blog marketingowy)
- [ ] Kolor accent to violet `#7E22CE`, nie amber
- [ ] Polski język (angielski tylko w technikaliach)
- [ ] Konkretne liczby / nazwy / daty (nie „niedawno", „pewna firma")
- [ ] Benefit > feature (co klient zyskuje, nie co my dostarczamy)
- [ ] Dla blog posta: frontmatter pełny + cover image spójny wizualnie
- [ ] Dla LI: ≤1900 znaków, 3-5 hashtagów, 1-3 CTA linki

---

## Changelog

- **v1 (2026-04-22):** Initial draft. Baza: 8 blog posts security, linkedin-post-v2 (ransomware-uw), memory feedback (honest copy, no DIY, source of verification), CLAUDE.md (visual, paleta), security/index.html.
- **v1.1 (2026-04-22):** Rozszerzona sekcja 5.3 Logo — szczegółowy opis konstrukcji CSS pseudo-element (dotless ı + kolorowa kropka), tagline, 8 wariantów użycia, DO/DON'T, zasady eksportu do SVG. Kluczowa rzecz: logo jest konstrukcją typograficzną, nie plikiem graficznym.
