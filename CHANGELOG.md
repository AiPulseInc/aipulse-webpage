# Changelog

Log zmian w projekcie Ai Pulse. Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/).



## [0.5727] — 2026-04-27

Dwa fixy separatorów na samoocena landing:
- Sekcja "Trzy rzeczy, natychmiast." miała dwie równoległe linie pod nagłówkiem (border-bottom z deliverables-head + border-top z pierwszego `.samoocena-deliverable`). Pierwsza wycięta — granica listy zostaje.
- Powrót `border-top` na `.samoocena-landing-footer` — pojedynczy separator pomiędzy CTA a legal footerem.

- **`src/samoocena/styles.css`** — dwie zmiany.

## [0.5726] — 2026-04-27

Ujednolicony prefix kickerów — `§ Co dostajesz` → `// Co dostajesz`. Cała strona samooceny jedzie teraz na jednym znaczku `//`.

- **`src/samoocena/ui.js:76`**

## [0.5725] — 2026-04-27

Hero eyebrow ogołocony (bez ramki, padding-u, pulsującej kropki) i podwójny separator u dołu strony usunięty.

- **`src/samoocena/ui.js`** — `<div class="samoocena-landing-eyebrow"><span class="samoocena-landing-dot">…</span></div>` → `<p class="samoocena-landing-eyebrow">// Audyt wstępny</p>`
- **`src/samoocena/styles.css`** — `.samoocena-landing-eyebrow` bez border/background/padding/inline-flex; `.samoocena-landing-dot` rule usunięta + orphan w prefers-reduced-motion. `.samoocena-final-cta` bez `border-bottom`/`padding-bottom`. `.samoocena-landing-footer` bez `border-top`. Naturalny whitespace wystarcza za separator.

## [0.5724] — 2026-04-27

**Fix:** strona samooceny miała 8px białej ramki dookoła. `<html>` i `<body>` były transparentne + body miało domyślny 8px margin → przeziera default browser background. `.samoocena-shell` miał `background: #000` ale to wrapper, nie cała viewport. Dodany reset `html, body { margin: 0; background: #000 }` na początku styles.css.

- **`src/samoocena/styles.css`** — reset html/body przed `.samoocena-shell`.

## [0.5723] — 2026-04-27

Sekcja final-cta uproszczona — wycięty eyebrow "§ Gotowy?" + tytuł "10 minut, raport PDF, lista priorytetów." Same przyciski na koniec, bez dodatkowego framing'u.

- **`src/samoocena/ui.js`** — usunięte `samoocena-section-eyebrow` + `samoocena-section-title` z `samoocena-final-cta`. Wrapper i CSS zostają.

## [0.5722] — 2026-04-27

Hero eyebrow ujednolicony z resztą strony — prefix `//` jak w kickerach (`// Zakres`, `// Czas` etc.). Wycięty fake doc-number `Dokument #${data}` — bureaucratic flair który dla mikro-MŚP brzmi sztucznie.

- **`src/samoocena/ui.js:43`** — `Audyt wstępny · Dokument #...` → `// Audyt wstępny`

## [0.5721] — 2026-04-27

CTA samooceny przeniesione z hero na koniec strony (przed legal footerem). Nowa sekcja `samoocena-final-cta` z eyebrow "§ Gotowy?" + tytuł "10 minut, raport PDF, lista priorytetów." + ten sam zestaw przycisków (Rozpocznij audyt / Jak to działa / resume-restart). Hero teraz tylko narracja, bez bezpośredniej konwersji — story-first, action-after.

- **`src/samoocena/ui.js`** — `samoocena-hero-actions` div usunięty z hero, nowa sekcja `samoocena-final-cta` wstawiona przed `<footer>`.
- **`src/samoocena/styles.css`** — `.samoocena-final-cta` ma vertical spacing matchujący sekcję deliverables + border-bottom jako separator nad legal footerem.

## [0.5720] — 2026-04-27

Hero lead samooceny przepisany pod ICP (JDG/mikro-MŚP, niska świadomość cyber). Stary copy ("zarząd zadaje co miesiąc", "CIS Controls v8 + NIST CSF 2.0", "bez pytań o Red Team") brzmiał jak materiały dla CISO w średniej firmie i odpychał laika. Nowy: storytelling z konkretnymi obrazami (mail, backup, hasło), bez żargonu, bez certyfikacji w pierwszym akapicie. Tape na górze i sekcja "Metodyka" zachowane bez zmian.

- **`src/samoocena/ui.js:50`** — nowy lead: "Włamanie do firmy rzadko zaczyna się od hakera w bluzie..."

## [0.5719] — 2026-04-27

**Fix:** Samoocena (`/bezpieczenstwo-samoocena/`) bombowała natychmiast na cold load z `ReferenceError: Cannot access 'X' before initialization`. TDZ-bug wprowadzony w v0.5708 razem z GA4 page tracking — `let lastTrackedStep = null` deklarowany **po** wywołaniu `render()`, a render czytał go przy wejściu w `if (state.step !== lastTrackedStep)`. `function render()` jest hoisted, ale `let` nie. Ruch zmiennej przed wywołanie `render()` rozwiązuje problem.

- **`src/samoocena/app.js`** — `let lastTrackedStep = null;` przeniesione przed `render();`. Reszta sekwencji bez zmian.

## [0.5709] — 2026-04-27

Impact (impact.com) site verification meta tag dodany do `security/index.html` — wymóg sieci affiliate przed approval. URL weryfikacyjny: `aipulse.pl/security`.

- **`security/index.html`** — `<meta name="impact-site-verification" content="bb6f5b62-...">` w `<head>`. Statyczna, bez wpływu na render/runtime.

## [0.5708] — 2026-04-23

GA4 + **Consent Mode v2** — pierwsza analityka na aipulse.pl. Domyślnie wszystkie storage `denied` (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`), update na `granted` po zgodzie przez cookie banner. `wait_for_update: 500` daje GA buffer na dataLayer przed transportem.

- **`src/ga.js`** (nowy, 70 linii) — wrapper: `initGA()` idempotentny, `trackEvent(name, params)`, `trackPageView(path, title)`. Guard `if (!GA_ID) return` — pusty `VITE_GA_MEASUREMENT_ID` = tracker off, site działa bez zmian.
- **Entry points z `initGA()`:** `src/landing.js`, `main.js`, `src/samoocena/app.js`, `src/raport/app.js`, `src/polityka-cookies.js`, `src/security-blog.js`.
- **Custom events:**
  - `contact_submit {source: 'security'|'business'}` — `main.js` po sukcesie form submit
  - `assessment_completed {score, level, industry, size}` — `src/samoocena/app.js` po submit
  - `raport_requested {channel: 'online'|'fallback'}` — `src/samoocena/app.js` po generowaniu raportu
  - `cookie_consent_granted {analytics, marketing}` — `src/ga.js` listener na `cookie-consent:change`
  - `page_view` manual per step w samoocenie (pseudo-SPA — `setStep()` nie zmienia URL, więc Enhanced Measurement nie łapie).
- **`.env.example`** dodany (placeholder `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` + istniejące VITE_SUPABASE_*). `.gitignore` z `!.env.example` exception.
- **Zero zmian w HTML + cookie consent** — korzystamy z istniejącego API `getConsent()` i eventu `cookie-consent:change` z `src/cookie-consent/consent.js`.

Rollback: ustaw `VITE_GA_MEASUREMENT_ID=` (empty) w Vercel env → redeploy. Guard w `initGA()` wyłącza tracker natychmiast.

## [0.5698] — 2026-04-21

Business — pierwsze **prawdziwe testimonials** na miejscu placeholderów „Antigravity". 5 cytatów z uczestników szkolenia „Prawo Jazdy AI" (marzec 2026, dział handlowy dystrybutora sprzętu naukowego): Krzysztof (sceptyk→przekonany), Aleksandra, Natalia, Ola, Gosia. Format: imię only (bez firmy i branży — consent-safe). Dodane amber ★★★★★ gwiazdki nad każdym cytatem. Marquee skrócony z 10+10 do 5+5 cards; CSS `nth-child(n+11)` → `nth-child(n+6)` dla mobile duplicate-hide.

Contact form — fix success message per source: security zostaje z CTA do samooceny, business dostaje skrócone „Dziękujemy! Odpowiemy wkrótce." (business line nie ma samooceny, więc CTA prowadziłby do nieistniejącego kontekstu).

## [0.5688] — 2026-04-21

Security page — drobna korekta nazwy certu DEKRA: usunięte słowo „Systemu" („Audytor Systemu Zarządzania..." → „Audytor Zarządzania..."). Oszczędność miejsca, czytelniejsze dla MŚP; informacje o normie ISO 27001 i tak są w opisie.

## [0.5687] — 2026-04-20

Raport — fix nazwy certyfikatu w kontakcie audytora (sekcja 10). Było błędne „ISO 27001 Lead Implementer" (inny kurs); teraz spójnie z security page: „DEKRA Audytor SZBI wg ISO 27001". Lead Implementer wdraża SZBI; Audytor audytuje wdrożone SZBI — różne szkolenia DEKRA.

## [0.5686] — 2026-04-20

Security page — doprecyzowanie nazwy certu DEKRA. Było vague „DEKRA · ISO/IEC 27001", teraz konkretnie: „DEKRA · Audytor Systemu Zarządzania Bezpieczeństwem Informacji" (skrót SZBI rozwinięty). Informacje o normie ISO 27001 zostają w opisie. Opis i why — bez zmian w tej iteracji.

## [0.5685] — 2026-04-19

Raport — Priority 2 fix: **sekcja 9 Mapa zgodności jest teraz dynamiczna** (pochodna odpowiedzi user'a, nie hardcoded).

**Problem:** sekcja 9 miała stałe statusy ("Art. 30 Rejestr czynności → Tak", "Art. 32 Środki techniczne → Częściowo", "Tested backup → Brak") niezależnie od odpowiedzi. User z backupem 3-2-1 + testami dostawał "Brak" w Tested backup; user bez IOD dostawał "Tak" w Art. 37. Compliance map była efektywnie dekoracją.

**Fix — `COMPLIANCE_REQUIREMENTS` mapping + `computeRequirementStatus()`:**
- Mapowanie wymogów na konkretne pytania samooceny (CIS/NIST question IDs). Przykłady:
  - NIS2 Art. 21 Środki techniczne → `C1, C2, C3, C4, B1, B3` (MFA + patch + EDR + firewall + backup + szyfrowanie)
  - RODO Art. 30 Rejestr → `E2` (rejestr czynności)
  - Insurance Tested backup → `B1, B2` (3-2-1 + testy odtworzenia)
  - Insurance IRP → `D1, D2` (plan + playbook)
- Status wymogu = średnia z pct (actualScore / maxScore) mapowanych pytań:
  - ≥ 0.85 → Tak (status-ok)
  - ≥ 0.5 → Częściowo (status-partial)
  - < 0.5 → Brak (status-missing)
- SPF/DMARC nadal dynamiczny z DNS scan summary (bez zmian)
- Gotowość ubezpieczeniowa w sekcji "Ocena ogólna" teraz dynamiczna per overall score (4 progi zamiast stałego "Warunkowa")

**EXAMPLE_DATA uzupełnione o responses:**
- Dodane realistyczne odpowiedzi typowej MŚP (dobre A/E, słabe B/D, średnie C) — example=1 teraz pokazuje mixed statuses zamiast wszystko "Brak"

**Impact:**
- Raport spójny: Exec Summary + Findings + Compliance map wszystkie wyprowadzone z tych samych odpowiedzi
- Mapa zgodności actionable — pokazuje konkretne luki w artykułach NIS2/RODO do zamknięcia
- Nadal nie zastępuje pełnego audytu (disclaimer dodany w intro sekcji 9)

## [0.5675] — 2026-04-19

Raport — Priority 1 fix mismatch przy wysokich wynikach: **sekcja 6 Findings jest teraz dynamiczna** (wyprowadzona z odpowiedzi user'a, nie hardcoded).

**Problem:** sekcja 6 miała hardcoded 7 luk L-01..L-07 ("Kopie zapasowe nie są testowane KRYTYCZNE", "Brak MFA WYSOKIE" etc.). User z 100/100 Optimized dostawał w raporcie "KRYTYCZNE" findings mimo że Exec Summary pisał "Jesteś w czołówce MŚP" — wewnętrzna sprzeczność raportu.

**Fix — `deriveFindingsFromResponses(responses)`:**
- Korzysta z nowo wyeksportowanej `allGaps(responses)` w `recommendations.js` (topRecommendations bez limit)
- Dla każdej luki z `severity > 0`: ID sekwencyjny L-01..L-NN, severity label wg reguł:
  - `critical question + gapPoints ≥ 2` → KRYTYCZNE
  - `critical + mały gap` → WYSOKIE
  - `weight ≥ 2 + gapPoints ≥ 2` → WYSOKIE
  - `gapPoints ≥ 2 lub weight ≥ 2` → ŚREDNIE
  - reszta → NISKIE
- Każdy finding pokazuje: udzieloną odpowiedź user'a, ryzyko biznesowe (impact), zalecane działanie (action) z `RECOMMENDATION_LIBRARY`
- Cap 10 findings — reszta pokazana jako summary line "dodatkowo X mniej krytycznych luk... w rozszerzonym audycie"
- Pusta lista (100% user) → blok "BRAK ISTOTNYCH LUK — utrzymuj poziom kwartalnymi przeglądami"
- F-DNS-* findings nadal dopisane na końcu (DNS scan niezmiennie dynamiczny)

**Enhancements w `recommendations.js`:**
- `buildGap` zwraca dodatkowo: `questionText`, `mapping`, `userAnswerLabel`, `weight`, `maxScore`
- Nowy export `allGaps(responses)` — te same reguły sortowania co `topRecommendations`, bez slice

**Impact:**
- Raport spójny niezależnie od wyniku — user 100% dostaje "BRAK ISTOTNYCH LUK", user 20% dostaje 10 trafnych findings
- Każdy finding zakotwiczony w konkretnej odpowiedzi ("Na podstawie Twojej odpowiedzi: ...") — wzrost wiarygodności vs. generic luki MŚP
- Section 9 Compliance map nadal hardcoded (Priority 2 — kolejna iteracja)

## [0.5665] — 2026-04-19

Raport — poprawki po testach: rozbudowane narratywy, anti-break dla findings, większy top margin stron, split sekcji 10 na 2 strony, przywrócony dark CTA.

**Wyniki szczegółowe (sekcja 5) — narratywy 2-3 zdania:**
- `narrativeFor()` rozszerzony per kategoria (Ludzie/Dane/Infrastruktura/Procesy/Compliance) × 3 poziomy (high/mid/low). Zamiast 1-zdaniowych opisów teraz 2-3 zdania z kontekstem biznesowym i kolejnym krokiem.

**Paginacja consistency:**
- `@page content-page { margin-top: 22mm → 26mm }` — większy consistent odstęp od header na KAŻDEJ fizycznej stronie (także dynamicznie tworzonych przez content overflow).
- `.finding { page-break-inside: avoid; break-inside: avoid }` — pojedyncze luki nie łamią się między stronami.

**H2/H3 margin-top — redukcja ~50% dla spójności:**
- `h3 margin-top: 8mm → 4mm` w: Exec Summary ("Twoje 3 luki", "Ryzyko finansowe"), Awareness ("Wszystkie pytania"), Next Steps ("Top 5 rekomendacji"), Maturity Ladder.

**Metodyka + Zakres — wizualne oddzielenie:**
- Usunięto `h2 margin-top: 10mm` na "4. Zakres", dodano visual separator: `<div style="margin-top:14mm; padding-top:8mm; border-top: 1px solid #E5E5E5">`.

**Sekcja 10 "Następne kroki" split na 2 strony:**
- Strona 1: h2 + intro + Top 5 rekomendacji
- Strona 2: h2 (cd.) + Roadmapa + Kontakt audytora + CTA + Oferta + disclaimer
- Roadmapa/kontakt/oferta były wcześniej ściśnięte z rec'ami — teraz osobna fizyczna strona z przestrzenią.

**Przywrócony/wzmocniony ciemny CTA box:**
- `.cta-box-dark` class + explicit rules: `background: #111; color: #fff; h4 amber; links amber`
- `page-break-inside: avoid` — CTA nie dzieli się między stronami
- Podmiana `<p style="color:#fff">` → `<p>` (CSS dziedziczy color z parent) + dedicated `.cta-link` class dla linku

## [0.5664] — 2026-04-19

Fix: podwójne header/footer w PDF (Chrome renderował oba — @page margin boxes + fixed divs).

v0.5662 wprowadził dual strategy (CSS Paged Media + fixed fallback) z zamysłem redundancji.
Ale Chrome obsługuje oba mechanizmy jednocześnie → user widział podwojone napisy.

Fix: ukryć fixed divs w `@media print` (`display: none !important`). @page margin boxes
są primary (Chrome/Edge/modern Firefox wspierają). Safari/stary Firefox bez header/footer —
dodamy JS UA-detection gdy zajdzie potrzeba.

## [0.5663] — 2026-04-19

Raport PDF — przedsłowie "Czym jest / czym nie jest" + renumeracja sekcji + spis treści visual upgrade.

**Nowa strona 2 — Przedsłowie (`renderPrzedsloweForeword`):**
- 3 boksy: "W raporcie znajdziesz" (positive green), "Czym raport NIE jest" (negative amber), "Jak najlepiej wykorzystać" (how-to violet)
- Treść oparta o feedback eksperta cyber insurance (docs/feedback.txt) — ustawia oczekiwania klienta: raport to **wstępny screening gotowości**, nie audyt techniczny / nie predykcja polisy / nie certyfikacja. Wartość = lista luk + plan działania, nie procent.

**Renumeracja sekcji 2-11 → 1-10:**
- Spis treści traci numer "1." — staje się foreword (meta-opisem raportu).
- Wszystkie sekcje treści przesuwają się o -1: Podsumowanie zarządcze = 1, Model dojrzałości = 2, Metodyka = 3, Zakres = 4, Wyniki = 5 (5.1-5.5), Findings = 6, DNS = 7, Świadomość = 8, Compliance = 9, Next Steps = 10.
- Dynamiczne offsety przy opcjonalnych sekcjach (bez DNS + Awareness: Compliance=7, Next=8).

**Spis treści — visual upgrade (`.toc-new`):**
- Zamiast plain text listy: grid layout z kolumnami "Numer | Tytuł | Kropki | Strona"
- Numery sekcji jako "01/02/…/10" w Space Grotesk violet bold
- Podsekcje 5.1-5.5 jako indented rows z wynikiem per kategoria
- Border top/bottom + subtle row separators
- Orientacyjne numery stron (kalkulowane z `hasDnsScan` / `hasAwareness` offsets)
- Dissclaimer u dołu: "Numery stron orientacyjne — mogą się nieznacznie przesunąć przy dłuższych sekcjach"

**Files:**
- `src/raport/template.js` — nowa `renderPrzedsloweForeword`, rewrite `renderToc` z wizualnym layoutem, `pad(n)` helper, update numerów w 7 funkcjach (`renderExecutiveSummary`, `renderMaturityLadder`, `renderMethodologyAndScope`, `renderRadarAndCategoryBreakdown`, `renderFindings`, `renderDnsExposure`, `renderAwarenessPage`, `renderComplianceAndCta`, `renderNextStepsContact`)
- `src/raport/styles.css` — `.foreword-box`, `.foreword-positive`, `.foreword-negative`, `.foreword-how-to`; `.toc-new`, `.toc-row`, `.toc-num`, `.toc-title`, `.toc-dots`, `.toc-page`, `.toc-row-sub`

## [0.5662] — 2026-04-19

Raport PDF — paginacja 3. próba: dual strategy (@page margin boxes + position:fixed fallback).

Poprzednie próby (v0.5651 negative offset fixed, v0.566 @page :first reset, v0.5661 named pages) nie rozwiązały problemu header/footer u user'a. Nie wiadomo czy user ma Chrome/Safari/Firefox — każdy inaczej obsługuje CSS Paged Media.

**Strategy:**
- **Primary:** `@page content-page { @top-left / @bottom-left / @bottom-right }` z `counter(page)/counter(pages)` — działa w Chrome/Edge 85+
- **Fallback:** `position: fixed .print-header / .print-footer` DIVs z positive offset (top:8mm / bottom:4mm) w zarezerwowanym `@page margin` — działa w Safari, starszy Firefox
- **Cover:** `.page.cover { position: relative; z-index:10; background:#fff; height:297mm }` przykrywa fixed elementy → pełny bleed
- **Named pages:** `@page cover-page { margin:0 }` + `.page.cover { page: cover-page }` + `.page:not(.cover) { page: content-page }`

Jeśli oba mechanizmy działają (Chrome), będzie lekka redundancja — ale to akceptowalne, lepsze niż brak.

## [0.5661] — 2026-04-19

Raport PDF — korekty po testach v0.566: paginacja (named pages), nowy copy przewodnika, renumeracja sekcji, de-żargonizacja findings.

**Paginacja — named pages (fix Chrome bug):**
- `@page :first { content: none }` z v0.566 "przelewała" reset do kolejnych stron w Chrome → header/footer znikały od str. 3.
- Fix: **named pages** — `@page cover-page { margin: 0 }` + `@page content-page { ...margin boxes... }` + przypisanie przez `.page.cover { page: cover-page }` / `.page:not(.cover) { page: content-page }`. Dodano też domyślne `@page` jako fallback.

**Reader's Guide (str. 2) — rewrite:**
- Usunięto "Ten raport ma >10 sekcji" (sygnał niepewności) i "Przeczytaj tylko 2 strony" (antywartość płatnego raportu).
- Nowy copy: "Raport jest całością ... Poniżej wskazówki, które sekcje zainteresują Cię szczególnie" + boksy z tonem "może Cię szczególnie zainteresować..." zamiast "Przeczytaj tylko X".
- Dodano **Świadomość regulacyjna** do boksu Compliance/IOD (brakowało w v0.566).
- Usunięto uwagę "numery stron są orientacyjne" (sygnał fuksu).

**Maturity Ladder → numerowana sekcja 3 (zamiast foreword):**
- `<h2>3. Model dojrzałości cyberbezpieczeństwa</h2>` (dodany numer).
- Renumeracja wszystkich kolejnych: Metodyka=4, Zakres=5, Wyniki=6, Findings=7, DNS=8, Awareness=9, Compliance=10-11, Next steps=10-11 (zależnie od opcjonalnych).
- TOC update: usunięto `<span>str. N</span>` (numery strony były orientacyjne i mylące, stopki CSS counter i tak podają faktyczne numery).

**De-żargonizacja FINDINGS:**
- `F-00X` → `L-0X` (L jak "Luka" — polski idiom).
- `CRITICAL/HIGH/MEDIUM/LOW` → `KRYTYCZNE/WYSOKIE/ŚREDNIE/NISKIE`.
- Tytuły: "Backupy nie są testowane" → "Kopie zapasowe nie są testowane", "Brak immutable backup offsite" → "Brak kopii zapasowej odpornej na atak (offsite + niezmiennej)", "MFA wdrożone tylko w części systemów" → "Uwierzytelnianie dwuskładnikowe (MFA) tylko częściowo wdrożone", "Incident Response Plan" → "plan reagowania na incydenty", "Patch management nieformalny" → "Aktualizacje oprogramowania bez harmonogramu", "testy phishingowe symulowane" → "symulacje phishingu dla pracowników".
- Sekcja: "Lista findings (identyfikacja luk)" → **"Zidentyfikowane luki bezpieczeństwa"**.

**Benchmark language:**
- "Jesteś lepszy niż średnia w: X" → **"Powyżej średniej: X (+Y)"**.
- "Jesteś gorszy niż średnia w: X" → **"Poniżej średniej: X (-Y)"**.

## [0.566] — 2026-04-19

Raport PDF — enrichment: 2 nowe strony foreword + port sekcji z online + nowa sekcja 10 + paginacja v2.

**Paginacja v2 (Faza A):**
- `position: fixed` header/footer (z v0.5651) nie był reliable w print → zastąpiono **CSS Paged Media margin boxes** (`@page { @top-left / @bottom-left / @bottom-right }`). Natywne wsparcie Chrome/Edge — każda fizyczna strona dostaje automatycznie header + footer + dynamiczny `counter(page)` / `counter(pages)`.
- `@page :first { margin: 0; @top-left { content: none } }` — cover pełny bleed bez header/footer.
- Spis treści rozdzielony od Metodyki/Zakresu (osobne `.page` divs) — page break po TOC.

**Port sekcji z online → PDF (Faza B):**
- Nowa sekcja **"2. Podsumowanie zarządcze"** — TL;DR z wynikiem + maturity, `getRiskStatement` businessText, top 3 luki (z `topRecommendations(scoringResult, responses, 3)`), ryzyko finansowe (45-120k zł). Port z `src/samoocena/results-management.js:renderExecutiveSummary`.
- Rozszerzono sekcję 5 o blok **"Co mówi benchmark"** — "Jesteś lepszy niż średnia w: X (+15)" / "Jesteś gorszy w: Y (-20)". Port z `renderCategoryAnalysis`.

**Nowa sekcja 10 "Następne kroki + kontakt audytora" (Faza C):**
- **Top 5 rekomendacji** z cost/effort/impact (import `topRecommendations` z `src/samoocena/recommendations.js`). Każda z numerem, tytułem, actionem, metadanymi (koszt/wdrożenie/CRITICAL badge), opisem impactu.
- **Roadmapa 30/90 dni + dalej** — derived z top 5 rec.
- **Kontakt audytora** — Maciej Konieczny + email info@aipulse.pl + telefon + LinkedIn.
- **Oferta dalszej współpracy** — Audyt Standard / Premium / cykl Awareness.
- Usunięto `Podsumowanie i rekomendacje` + `NASTĘPNY KROK` CTA z `renderComplianceAndCta` (przeniesione do sekcji 10).

**Nowa strona "Przewodnik po raporcie" — Reader's Guide (Faza D):**
- Foreword page między Cover a TOC (bez numeru sekcji).
- 3 boksy segmentacji ról: CEO/Właściciel, IT Manager/CISO, Compliance/IOD. Dla każdej: które strony przeczytać + szacowany czas.

**Nowa strona "Model dojrzałości" (Faza E):**
- Foreword page między Exec Summary a Metodyką (bez numeru sekcji).
- Tabela 4 poziomów (Initial/Developing/Managed/Optimized) z zakresem pkt i charakterystyką.
- Highlight Twojego poziomu (background + badge "← Twój poziom (X/100)").

**Files changed:**
- `src/raport/template.js` — nowe funkcje `renderReaderGuide`, `renderMaturityLadder`, `renderExecutiveSummary`, `renderNextStepsContact`; podzielone `renderTocMethodology` → `renderToc` + `renderMethodologyAndScope`; enrich `renderRadarAndCategoryBreakdown`; import `topRecommendations`; kopia `getRiskStatement`
- `src/raport/styles.css` — CSS Paged Media `@page` margin boxes; nowe style dla exec summary, benchmark box, rekomendacje list, roadmap, auditor contact, oferta, reader boxes, maturity ladder
- `package.json` + `src/version.js` — 0.5651 → 0.566

**TODO (następna iteracja):**
- Faza F: DNS topology graph SVG (wow effect, port strukturalny z DNSDumpster)

## [0.5651] — 2026-04-19

Fix paginacji raportu PDF + aktualizacja adresów email w raporcie.

**Paginacja:**
- `@media print` + `@page { margin: 22mm 16mm 18mm 16mm }` rezerwują miejsce na header/footer
- Global `.print-header` + `.print-footer` (single DOM, `position: fixed`) — browser automatycznie powiela na każdej fizycznej stronie
- `counter(page)` + `counter(pages)` — numery stron liczone przez CSS, dynamiczne
- `@page :first { margin: 0 }` — cover pełny bleed bez header/footer
- Usunięto per-sekcyjne `<div class="page-header">` / `<div class="page-footer">` (`position: absolute` wewnątrz `.page` — działało tylko gdy content mieścił się w 297mm, rozlanie treści pozbawiało nowe fizyczne strony stopki)
- Usunięto ręczne kalkulacje `totalPages` + hardcoded `Strona N z M`

**Email w raporcie:**
- Footer raportu: `maciek@aipulse.pl` → `info@aipulse.pl` (było 6 miejsc — teraz jedno źródło w `.print-footer`)
- CTA rekomendacji („NASTĘPNY KROK"): `kontakt@aipulse.pl` → `info@aipulse.pl`

## [0.565] — 2026-04-19

Samoocena — email z linkiem do raportu + fix domain input UI.

**Feature: raport przez email (zastępuje client-side auto-print):**
- Nowa migration: `assessments.report_payload` (JSONB) + `report_sent_at`. RLS policy `assessments_anon_select_by_id` — anonimowy SELECT po UUID (UUID v4 entropy wystarcza jako public secret dla raportu).
- Edge function `send-report`: UPDATE assessment (payload + email + consent) + wysyłka emaila przez Resend z linkiem `https://aipulse.pl/raport-audit/?id={uuid}`. Email ma wersję text + HTML z violet CTA button.
- `api.js`: nowe `sendReport(assessmentId, { email, marketingConsent, payload })` (edge fn invoke) + `fetchReportPayload(id)` (direct SELECT).
- Samoocena `app.js`: `download-pdf` action → wysyła `sendReport` → otwiera `reportUrl` w nowym oknie. Fallback do localStorage jeśli fn fail.
- Raport `app.js`: async `getData()` — jeśli `?id=UUID` → fetch z DB przez Supabase, fallback do localStorage. **Usunięto auto-print** — user sam klika "Zapisz jako PDF".

**UI fix:**
- `samoocena-field input[type="text"|email|tel]` dostało styl spójny z `.samoocena-field select` (min-height 48px, Inter font, border, focus outline). Bez tego input dziedziczył browser default — ciasno i generyczny font.

## [0.5648] — 2026-04-19

Contact form — finalny fix: `contact_submissions` zamiast `leads` + edge fn `--no-verify-jwt`.

**Powód:**
- Tabela `public.leads` już istniała na remote z innym schematem (assessment_id, vat_id, full_name — dla płatnych leadów samooceny). Moja migracja `20260418000003_leads.sql` nie zaaplikowała się ("relation exists"), ale nazwa kolidowała z existing usage. Rozwiązanie: nowa tabela `public.contact_submissions`.
- Supabase gateway wymaga JWT format w Authorization header. `sb_publishable_*` nie jest JWT. Rozwiązanie: deploy z `--no-verify-jwt` — walidacja po naszej stronie (honeypot + regex + consent check) wystarczy dla public contact form.

**Files:**
- `supabase/migrations/20260418000004_contact_submissions.sql`
- `supabase/functions/contact/index.ts` — `from('contact_submissions')`

**E2E test:** POST → `{ok:true}`, DB wpis OK, email via Resend na `maciek@aipulse.pl`.

## [0.5647] — 2026-04-19

Fix contact form: raw `fetch()` → `supabase.functions.invoke()`.

**Powód:** Supabase gateway oczekuje JWT format w Authorization header. Nowe keys `sb_publishable_*` nie są JWT — raw fetch dostawał `UNAUTHORIZED_INVALID_JWT_FORMAT`. SDK handles key format prawidłowo (tak samo jak scan-domain).

## [0.5646] — 2026-04-18

Formularz kontaktowy (security + business) — backend + frontend (fix 405).

**Backend:**
- Migration `20260418000003_leads.sql` — tabela `leads` (source, name, company, email, phone, message, consent, timestamps). RLS włączone, brak policy anon (INSERT tylko przez service role).
- Edge Function `contact` (POST /functions/v1/contact) — walidacja + zapis do DB + email do `maciek@aipulse.pl` przez Resend (fire-and-forget). Honeypot anti-spam (pole `website`). Lazy-init klienta Supabase, zero sekretów w logach.

**Frontend:**
- Form w `security/index.html` i `business/index.html`: dodane `name` attrs, `data-source`, honeypot, status element, usunięte `action="#"` + method=POST
- `main.js`: `initContactForms` — walidacja client-side, POST do edge fn, loading state, inline status, reset po sukcesie
- CSS: `.form-honeypot` (hidden), `.form-status[data-kind=success/error]`, `.form-submit:disabled`

**Wymagane kroki deployment (user):**
1. `supabase db push --linked` — apply migration
2. `supabase functions deploy contact` — deploy edge function
3. `supabase secrets set RESEND_API_KEY=<key>` — jeśli nie ustawione

## [0.5645] — 2026-04-18

Drobne korekty:
- Navbar: usunięto wersję (przeniesiona do stopki, prawa strona linii © copyright)
- Footer: LinkedIn href → `https://www.linkedin.com/in/koniecznymaciej/`
- Footer: Email href → `mailto:maciek@aipulse.pl`

## [0.5644] — 2026-04-18

Post go-live: nowy hero headline w security.

**Copy:**
- Security hero: „CYBER-AUDYT W 7 DNI." → „SPRAWDŹ SIĘ, ZANIM CIĘ SPRAWDZĄ." (usunięte arbitrarne „7 dni"; hook verify-first trafia w trigger NIS2/ubezpieczyciel/kontrahent). Subtitle zachowany.

## [0.5643] — 2026-04-18

Pre-go-live: leadgen capture przy raporcie PDF + promocja „100 pierwszych" + drobne korekty copy + nowy numer telefonu.

**Leadgen flow (raport PDF):**
- Nowy multi-field modal `showRaportRequestModal` — nazwa firmy + email (z walidacją) + zgoda marketingowa (pre-checked, opt-out RODO-friendly)
- DB: `assessments` + kolumny `email text`, `marketing_consent boolean`
- RLS policy `assessments_anon_set_email` — anon UPDATE tylko gdy email IS NULL (one-time set), z walidacją regex'em
- Nowa funkcja `recordRaportRequest(assessmentId, { email, marketingConsent })` w api.js — UPDATE z retry
- `download-pdf` action gather → save do DB (fire-and-forget) → otwiera raport tab
- Stat tile „Dane: 0 e-maili / Bez rejestracji" → „Dane: 1 email / Tylko do dostarczenia raportu PDF" (truthful po Stage 2)
- Footer copy o „bez nazw firm, bez e-maili" zaktualizowany — samoocena anonimowa, raport wymaga emaila

**Promocja go-live (zamiast „BETA do końca Q2"):**
- Stat tile Koszt: „Bezpłatnie dla 100 pierwszych użytkowników"
- Deliverable Raport PDF meta: „Bezpłatnie dla 100 pierwszych użytkowników"
- Results upsell note: „Bezpłatnie dla 100 pierwszych użytkowników. Docelowo raport rozszerzony: 149 zł"
- Liczenie po stronie Supabase (manual count gdy chce sprawdzić ile zostało) — bez UI counter na razie

**Drobne korekty copy:**
- „Bez jargonu" → „Bez żargonu" (typo)
- „Maturity score 0–100... Cztery poziomy: Initial, Developing..." → „Wynik 0–100... Cztery poziomy dojrzałości: Wstępny, Rozwijający się, Zarządzany, Zoptymalizowany" (Polish, no English jargon)

**Numer telefonu (mobile call-FAB):**
- 502 333 645 → 508 406 948 (security/, business/, scripts/build-security-blog.mjs — propagated do wszystkich blog stron przy build)

**Bump:** micro +0.001.

---

## [0.5633] — 2026-04-18

A7 Phase 3 — raport PDF z sekcją „Twoja rzeczywista ekspozycja" + cover layout + blog refresh.

**Raport — nowa sekcja 7 (3 warianty):**
- `optout` — notice „Audyt pominięty zgodnie z decyzją uczestnika" + tabela z `—`
- `success` — 7.1 Email security (SPF/DMARC/provider z interpretacją), 7.2 Subdomain mapping (grouped: mail/web/dev/api/other), 7.3 narrative summary z priorytetami na 30 dni + edu paragraph „Dlaczego to ma znaczenie"
- `fail` — notice „Skan nie zakończony pomyślnie" + tabela `—`

**Section numbering matrix:**
- TOC, h2 nagłówki, page footers conditional na `hasDnsScan` × `hasAwareness`
- `totalPages` computed raz w `renderRaportB`, propagated do wszystkich 6 footerów (fix pre-existing bug `Strona X z 10` przy realnych 5-7 stronach)

**Dynamic findings F-DNS-01..05:**
- Derive z `dnsScan.summary` (SPF brak/soft, DMARC brak/p=none, dev subdomeny)
- Hostnames escapowane przed wstawieniem do HTML (XSS fix wskazany przez code review)
- Mergowane z hardcoded FINDINGS w sekcji 6 — tylko dla `success` variant

**Compliance map (sec 9):**
- Nowy wiersz „SPF + DMARC dla email security" w „Wymogi ubezpieczycieli"
- Status dynamic: TAK / CZĘŚCIOWO / BRAK / `—` w zależności od scan + opt-out

**Cover layout:**
- Podpis Maciej Konieczny przeniesiony na prawą stronę, datę audytu usunięto (już w nagłówku str. 2)
- `.cover` to flex column z `min-height: 297mm`, podpis pushowany przez `margin-top: auto` + `padding-bottom: 5mm`
- Cover top padding compressed 35mm → 20mm, .crest margins zmniejszone — bardziej zbalansowana strona

**Print:**
- `@page { margin: 0 }` blokuje doklejanie nagłówków/stopek przez przeglądarkę
- Footer wszystkich stron: `maciek@aipulse.pl · aipulse.pl/security` (było `kontakt@... · aipulse.pl`)

**Wire:**
- `download-pdf` payload extended o `dnsScan: freshState.dnsScan || null`
- `src/raport/app.js` already spreads payload — no change needed

**Blog refresh:**
- Nowy post `list-od-cert-polska-dmarc-msp` (CERT Polska skanuje polskie domeny — DMARC p=none risk dla MŚP), tytuł zwęziły do 7 słów, narrative reframe na "znajomy dostał list" + anonimizacja domeny
- Wszystkie posty bloga (7) mają teraz dedicated cover w `/generated/security/blog/` (nano-banana-2 generated, brutalist black/white/violet template)
- 5 nowych covers (ai-phishing, backup-321, list-od-cert, mity, supply-chain) — koniec re-używania genericznych obrazków z kart oferty
- Frontmatter alt texts zaktualizowane do nowych grafik
- 2 posty (wyciek, ubezpieczenie) — drobne content edits („80% MŚP" → „regularnie obserwujemy w audytach", de-jargonizing)

**Bump:** micro +0.001.

---

## [0.5623] — 2026-04-18

A7 Phase 2 — frontend ekran profile-domain + state + spinner.

- Nowy step `profile-domain` po profilingu (industry+size)
- 2 explicit CTA: "Skanuj i dalej" (z domeną) lub "Rezygnuję z tej części audytu"
- Live inline validation (regex) z zielonym ✓ / czerwonym ✗
- Spinner overlay z 3 sequencyjnie podświetlanymi krokami (~5s)
- API wrapper `scanDomain()` w `api.js` — wywołuje edge function `scan-domain`
- State extension: `profile.companyDomain`, `profile.dnsScanOptOut`, `dnsScan`
- `submitAssessment` rozszerzony o nowe pola w payloadzie

CORS fix dla edge function: dodany `x-application` header do
`Access-Control-Allow-Headers` (supabase-browser.js dodaje custom header).

Pre-existing bug fix: `handleSubmit` dla profiling form (Enter key path)
też kieruje na `profile-domain` zamiast pomijać krok.

Raport jeszcze nie zmieniony (sekcja DNS w Phase 3) — dane są zapisywane
do DB ale nie renderowane.

Bump: micro +0.001.

---

## [0.5613] — 2026-04-18

A7 Phase 1 — DNS scan backend infrastructure.

- Migration `20260418000000_dns_scan.sql`: 3 nowe kolumny w `assessments`
  (`domain`, `dns_scan_opt_out`, `dns_scan jsonb`) — applied via
  `supabase db query --linked --file` (migration history offset
  vs documentation files, sql applied directly).
- Edge function `scan-domain` (Deno) deployed na Supabase z parserem
  portowanym z `aipulse-dns-demo/parse.mjs` (zwalidowany Phase 0).
  Pliki: `index.ts` (handler + CORS + retry + DMARC supplement),
  `parse.ts` (DNSDumpster raw → ScanData), `providers.ts`
  (MX patterns + self-hosted detection).
- DNSDumpster API call z 7s timeout + 1 retry na 5xx.
- DMARC supplement via native `Deno.resolveDns('_dmarc.X', 'TXT')`.
- DNSDUMPSTER_API_KEY w Supabase secrets, lazy-loaded
  w handlerze (`Deno.env.get` w request scope, nie module-level).
- 4 curl tests passed: aipulse.pl (happy), localhost/192.168.1.1/empty
  (wszystkie zwracają invalid_domain).

Frontend nie zmieniony — Phase 2.

Bump: micro +0.001.

---

## [0.5603] — 2026-04-18

Modal pakietu audytowego: label "CZEGO SIĘ NAUCZYSZ" → "CO OTRZYMUJESZ" tylko dla typu `audyty` (Audyt Podstawowy/Rozszerzony/Premium/vCISO). Trening modale (`szkolenia`, `security-szkolenia`) zostają z "CZEGO SIĘ NAUCZYSZ" — adekwatne. Zmiana w `main.js renderSzkoleniaModal` przez parametryzację labelu po typie.

Bump: nano +0.0001 (korekta copy).

---

## [0.5602] — 2026-04-18

Pełny rebrand: "Ai Puls" → "Ai Pulse" w całej witrynie (polska pisownia "Puls" zastąpiona angielską "Pulse"). Kropka nad "i" i pozostała typografia bez zmian.

Zakres zmian (tekstowy, ~70 wystąpień):
- Logotypy w nawigacji i stopkach: landing (2×), business, security, samoocena, polityka-cookies.
- Tytuły, meta description, og:title we wszystkich entry pointach Vite MPA.
- Overlay landing: `AI PULS · WYBIERZ OBSZAR` → `AI PULSE · WYBIERZ OBSZAR`.
- Raport PDF (`src/raport/template.js`) + mockupy A/B: nagłówki `AI PULSE SECURITY · CYBER AUDIT REPORT`, podpis "Lead Security Auditor · Ai Pulse Security", footery z domeną.
- Samoocena UI (`src/samoocena/ui.js`, `recommendations.js`) — wzmianki o brandzie i vCISO.
- CTA: `AiPulse Toolbox` → `Ai Pulse Toolbox` (business hero/footer).
- Komentarze kodu (modal.js, styles.css, consent.js, style.css).
- Polityka cookies: tabela "Ai Pulse, first-party", footer copyright.

Czego NIE ruszono: domena `aipulse.pl`, email `kontakt@aipulse.pl`, GitHub `AiPulseInc`, folder repo `aipulse-webpage`, internal app-id `aipulse-samoocena`.

Memory zaktualizowane (`project_aipulse.md`): brand name = "Ai Pulse", usunięta nieaktualna reguła "NOT 'AI Pulse', NOT 'AiPulse'".

Bump: micro +0.001.

---

## [0.5592] — 2026-04-15

Modal promptu nazwy firmy przed pobraniem PDF raportu.

Po kliknięciu „Pobierz swój raport" w sekcji upsell pojawia się modal z inputem na nazwę firmy (np. „Testowa Firma Sp. z o.o."). Wartość zapisywana w `state.profile.companyName` i wklejana do payload raportu — pojawia się na okładce mockup B („Raport przygotowany dla: ...").

Zmiany:
- `modal.js` rozszerzony o `showInputModal({title, message, placeholder, defaultValue, required, confirmLabel, cancelLabel, onConfirm(value)})` — generic text input dialog z walidacją required, Enter = confirm, Escape = cancel, focus input on open.
- `app.js` `download-pdf` action — prompt przed download. Prefilled z `state.profile.companyName` (jeśli user wcześniej podawał). Po confirm → `setProfile({ companyName })` + openReport.
- `styles.css` — `.samoocena-modal-input` (input w brand stylu, violet focus border, error shake animation).
- Raport PDF (mockup B) już używał `profile.companyName` — teraz działa bo payload niesie wartość.

Co-kontekst v0.557 modal + v0.5591 nano-fixy — nano-bump +0.0001.

---

## [0.5591] — 2026-04-15

Nano-fixy modal exit (korekta do v0.557 modal).

- **Font**: `.samoocena-modal-message` brak `font-family` — modal jest poza `.samoocena-shell` więc dziedziczył serif z user agent. Dopisany `Inter` + universal `.samoocena-modal *` inherit.
- **CSS custom properties**: `--samoocena-accent` zdefiniowane na `.samoocena-shell`, ale modal w `document.body` — przyciski miały `undefined` variable → transparent tło. Redeklarowane lokalnie w `.samoocena-modal-overlay`.
- **Hierarchia przycisków**: swap kolorystyki — „Kontynuuj samoocenę" (non-destructive) teraz primary violet, „Wyjdź i zresetuj" (destructive) ghost. Focus default = cancel. Zgodne z UX best practices dla destruktywnych akcji.

---

## [0.559] — 2026-04-15

Awareness quiz — każde pytanie + 5 opcji + nav mieści się w viewport 1280×800 bez scrolla.

Root cause: 5 opcji (o 1 więcej niż standardowe 4) + długie teksty (szczególnie Q2 „CERT Polska + CSIRT NASK / GOV / MON") + dodatkowy intro box „Zanim ocenisz…" generowały shell height 890px przy 800 viewport — user musiał scrollować żeby zobaczyć „7 dni" i „Nie wiem".

Fix:
- Usunięty intro box z Q1 (user widział opis quizu już na landing)
- Kompakt option padding 0.9→0.55rem, font-size 0.95→0.9rem
- Question text 1.1→1.0rem, mniejszy margin-bottom
- Tighter gap (0.7→0.4rem) + kicker/meta mniejsze
- Test: Q1 lastOptionBottom 547, Q2 521 — dużo poniżej navTop 732. Zero overlap.

---

## [0.558] — 2026-04-15

Nav samooceny wraca na `/security/` zamiast brand selector `/`.

Samoocena to sub-feature Security line — wyjście z formularza powinno sprowadzać usera na stronę Security, a nie na selektor Business/Security. Oba linki w headerze (logo Ai Puls + „Powrót…") teraz `href="/security/"`. Tekst link: „Powrót do Ai Puls Security".

---

## [0.557] — 2026-04-15

Dwa krytyczne fixy UX zgłoszone przez usera.

### Bug 1 — Pusty raport PDF (CRITICAL)
**Root cause:** `sessionStorage` NIE jest współdzielony między oryginalną zakładką a nową (`target="_blank"`) w nowoczesnych browserach. Każdy nowy tab dostaje świeży session context. User klikał „Pobierz swój raport" → nowa karta `/raport-audit/` → `sessionStorage.getItem('raportData')` → `null` → raport pokazywał stronę błędu „Brak danych".

**Fix:** `localStorage` zamiast `sessionStorage` (współdzielony per-origin między tabami). Cleanup: `raport/app.js` robi `localStorage.removeItem('raportData')` po odczycie — nie zostawiamy danych w localStorage na długo.

### Bug 2 — Brak sekcji awareness w raporcie (MISSING FEATURE)
Quiz świadomości regulacyjnej zbierany był tylko dla mockup A (on-screen). Mockup B PDF audytowy nie zawierał tej sekcji.

**Fix:**
- `download-pdf` action w samoocena dorzuca `awarenessAnswers` do payload
- Nowa funkcja `renderAwarenessPage` w `raport/template.js` generuje stronę 8 raportu z:
  - Score X/4 + level label + comment
  - Intro wyjaśniające rolę metryki (literacy ≠ wdrożenie)
  - 4 pytania z status ✓/✗/? + poprawna odpowiedź + pełne wyjaśnienia (RODO/NIS2/KSC references)
- TOC zaktualizowane: 7. Świadomość regulacyjna → 8. Mapa zgodności → 9. Następne kroki (renumerowane gdy awareness dostępne)
- Print-safe CSS: pełne kolory (#2E7D32 green, #C62828 red), page-break-inside: avoid, A4-ready

### Fix 3 — Reset-on-exit z custom modalem (UX)
**Problem:** Klik „POWRÓT NA STRONĘ GŁÓWNĄ" w trakcie samooceny nawigował na home ale state w localStorage zostawał — user wracał i lądował w środku starego testu bez sposobu na start od nowa.

**Fix:**
- Nowy `src/samoocena/modal.js` — lightweight confirm dialog w stylu strony (violet top stripe, dark #0A0A0A, uppercase title, blur overlay, focus trap, ESC/Enter keyboard, click-overlay-cancel)
- Global click interceptor w `app.js` intercept linki nav (href="/" albo zewnętrzne) gdy step ∈ {profiling, awareness-quiz, awareness-summary, category-intro, question}
- Modal: „Stracisz wprowadzone odpowiedzi" → [Kontynuuj samoocenę] [Wyjdź i zresetuj]. Klik confirm → `clearState()` + nav.
- Nie interceptujemy: linki hash, `/bezpieczenstwo-samoocena/...`, `target="_blank"`, terminal steps (results/thank-you).
- Safari compat: `-webkit-backdrop-filter` prefix dla blur.

### Impact
- Raport PDF działa z real user data + nową sekcją awareness (11 stron zamiast 10)
- Exit flow przestaje być frustrujący — modal w stylu strony, pełne zachowanie UX conventions
- Zero regresji na istniejącym flow (results/thank-you zostają terminal states)

---

## [0.556] — 2026-04-15

Awareness intermediate summary — closure z listą 4 pytań na jednym ekranie.

### Co nowego
Po feedback'u: dodana lista 4 pytań w summary screen z pokazaniem poprawnej odpowiedzi i statusu (✓/✗/?). User dostaje **closure**: wie nie tylko że odpowiedział X/4, ale również KTÓRE pytania trafił poprawnie i co jest poprawną odpowiedzią. Zero frustration „wiedziałem 1, ale którego?".

**Bez explanations** — pełne wyjaśnienia zostają w finalnych results jako reward za przejście samooceny.

### Layout
- **Two-column desktop**: lewa = score+label+bridge, prawa = lista 4 pytań
- **Single-column mobile** (≤900px): score na górze, lista pod, CTA na dole
- Cała sekcja mieści się **w viewport 1280×800 bez scroll** (576px height)
- Kompaktyfikacja: mniejszy score num (3.5→6rem clamp), tighter spacing, status icons 1.5rem

### Layout per pytanie
```
01 ✓  W ciągu jakiego czasu od wykrycia naruszenia...?
       POPRAWNIE: 72 godziny
02 ✗  Twoja firma padła ofiarą ransomware...
       POPRAWNIE: CERT Polska + (CSIRT NASK / GOV / MON...)
```

Status colors: ✓ green border + green icon, ✗ red border + red icon, ? neutral border + neutral icon.

### Naprawione
- max-width container z 72ch → 1100px (potrzebne dla two-column)
- usunięte „35 pytań · 5 kategorii · ok. 8 minut" z meta-second (user widział to na landing — duplikat)

---

## [0.555] — 2026-04-15

Quiz świadomości — intermediate summary screen (motywacyjny moment przed samooceną).

### Co nowego
Po 4 pytaniach quiz user widzi **krótki ekran wyniku** zanim wejdzie w 35 pytań samooceny:
- Duży score X/4 (kolor matchuje level: green dla 3-4, yellow dla 2, red dla 0-1)
- Label poziomu („ŚREDNIA ŚWIADOMOŚĆ", „WYSOKA", itd.)
- **Bridge comment** — 1-2 zdania kierujące do samooceny, dostosowane do score (5 wariantów):
  - 0/4: „Tak jak większość polskich MŚP. Dlatego właśnie robisz ten audyt."
  - 4/4: „Świetnie znasz prawo. Ale wiedza ≠ wdrożenie — następne 35 pytań pokaże gdzie firma faktycznie stoi."
- Meta info: „Pełne wyjaśnienia 4 pytań pojawią się na końcu, w raporcie"
- Jeden CTA „Przejdź do samooceny →"

### Behavioralna logika
Win-win z dwóch przeciwnych emocji, obie zbieżne w kierunku „dalej":
- Niski score → loss aversion („boję się czego jeszcze nie wiem")
- Wysoki score → competence motivation („udowodnię że i resztę ogarniam")

Plus micro-reward loop (feedback po 4 pytaniach, nie po 35) zmniejsza abandon rate.

### Architektura
- Nowy step `'awareness-summary'` między `awareness-quiz` a `category-intro`
- `awareness-questions.json` rozszerzony o `bridge_comments` (5 wariantów)
- `awareness.js` — `getBridgeComment(correctCount)`
- `ui.js` — `renderAwarenessSummary` (intermediate, lakoniczny, bez explanations)
- `app.js` — nowa akcja `awareness-to-samoocena`
- `styles.css` — ~120 linii dla summary screen

Pełne explanations zostają w finalnych results — dwustopniowy reveal jako tease/reward.

---

## [0.554] — 2026-04-15

Task 2 — pre-assessment quiz świadomości regulacyjnej (compliance literacy).

### Co nowego
- **4 pytania quiz** PRZED 35 pytaniami samooceny: termin zgłoszenia naruszenia (RODO Art. 33 — 72h), punkt kontaktowy incydentu (CERT Polska + sektorowy CSIRT), maksymalna kara RODO (4% obrotu lub 20 mln EUR), kwalifikacja utraty laptopa (RODO Art. 4(12) + 33).
- **Każde pytanie ma 5 opcji** (4 odpowiedzi + „Nie wiem / nie jestem pewny" jako pełna 5-ta opcja).
- **Quiz NIE wpływa na overall_score samooceny** — osobna metryka `awareness_score` (0-4) zachowana w schema.
- **Wyniki w Executive Summary** — sekcja „Świadomość regulacyjna" pokazuje score X/4 + label poziomu (5 poziomów od „Krytycznie niska" do „Wysoka") + pełna lista 4 pytań z wyjaśnieniami (zawsze, niezależnie od wyniku — wartość edukacyjna dla wszystkich).
- **Status visual:** ✓ correct (green border), ✗ wrong (red border), ? unknown (neutral).

### Architektura
- Nowy step `'awareness-quiz'` w state, między `profiling` a `category-intro`.
- `src/samoocena/awareness-questions.json` (4 pytania + długie wyjaśnienia z mappingiem na konkretne artykuły RODO/NIS2/KSC).
- `src/samoocena/awareness.js` (`scoreAwareness` + breakdown).
- Migracja Supabase: `assessments.awareness_score smallint (0-4)` + `awareness_answers jsonb`. RLS policy zaktualizowana o validation nowych kolumn.
- `src/samoocena/results-management.js` — `renderAwarenessSection` z hardcoded explanations (poprawne/niepoprawne/brak odpowiedzi → różne wizualizacje).

### Cel biznesowy
- **Lead-gen + content marketing**: agregowane dane do postów na bloga („X% polskich MŚP nie zna deadline RODO 72h").
- **Edukacja jako trust signal**: user zawsze wychodzi z konkretną wiedzą o przepisach, niezależnie czy odpowiedział poprawnie.

### Naprawione przy okazji
- Build error JSON: polskie cudzysłowy „..." wewnątrz explanation Q3/Q4 powodowały niezgodność z parserem (mieszane „...” vs „...") — naprawione.

---

## [0.553] — 2026-04-14

Task 2 A5 + A6 — Supabase integracja samooceny + benchmark pipeline. Plus retrofit pierwszego posta bloga i nowy skill `security-blog-post`.

### A5 — Supabase schema + anonymous submit flow
- Projekt Supabase `aipulse-samoocena` w Frankfurcie (`eu-central-1`), Postgres 17.6.
- Migracja `20260414210000_self_assessment.sql` — 4 tabele (`assessments`, `responses`, `leads`, `payments`), indeksy, triggery `updated_at`, RLS policies (anon INSERT only, deny-all na leads/payments), RPC `get_benchmark_snapshot` z fallback logic (industry+size → size-only → all_smb).
- Migracja `20260414210100_self_assessment_security_hardening.sql` — odpowiedź na 4 security advisor lints: `search_path` pinned na `set_updated_at`, citext przeniesiony do schematu `extensions`, explicit deny-all policies na leads/payments.
- Storage bucket `reports` (private, 10MB, only `application/pdf`) przygotowany dla Fazy 7 (PDF delivery).
- Nowy dep `@supabase/supabase-js@^2.103.0`.
- `src/lib/supabase-browser.js` — lazy-init client z nowym formatem kluczy (`sb_publishable_*` + legacy fallback).
- `src/samoocena/api.js` — `submitAssessment()` z retry exp backoff (3 próby, 500ms/2s/8s); mapping UI 8 branż → schema enum 5 opcji; `fetchBenchmark()` w tym samym module.
- `src/samoocena/state.js` — auto-gen `assessmentId` (crypto.randomUUID) w `markStarted`.
- `src/samoocena/app.js` — `scheduleSubmit()` + `scheduleBenchmark()` równolegle po `go-to-results`, non-blocking; toast system (sending / success / failed) z wariantami kolorystycznymi i adapt mobile.
- `scripts/test-supabase-insert.mjs` — powtarzalny smoke test anon INSERT + RLS SELECT block + RPC call.
- Nowy klucz `.env.local`: `SUPABASE_SECRET_KEY` (zastępuje legacy `SUPABASE_SERVICE_ROLE_KEY` zgodnie z rekomendacją Supabase — per-key rotation, scope, audit).
- **MCP Supabase (`ugvexcuybvjlxplltnht`)** wykorzystany do apply migracji, execute_sql, get_advisors (zero lintów), list_tables (weryfikacja). Dokumentacja: [docs/setup/supabase-stripe-setup.md](docs/setup/supabase-stripe-setup.md).

### A6 — Benchmark pipeline
- `results-management.js` używa `ctx.benchmark` z RPC `get_benchmark_snapshot`; fallback `FALLBACK_BENCHMARK` gdy RPC null (n=0).
- Footnote pokazuje scope-specific wyjaśnienie (`industry_size` / `size_only` / `all_smb` / `fallback`).
- Timing: benchmark fetch równolegle do submit, non-blocking dla renderu.

### Blog + skill
- Post `wyciek-sklepow-polska-130k-2026` — dedykowany cover (violet database tower z wyciekającymi rekordami), retrofit akapitów: bcrypt wyjaśniony po ludzku (bez żargonu „solenia" którego nie było w źródle), allegromail.pl przywrócone jako mechanizm obronny (zgodnie z CyberDefence24), usunięte spekulacje o konkretnych błędach firmy (ryzyko prawne).
- Post `ubezpieczenie-cyber-underwriter-2026` — wymiana generic cover na dedykowany (tarcza pod pomiarem z violet liniami).
- `scripts/generate-blog-cover.mjs` — wrapper Nano Banana 2 (gemini-3.1-flash-image-preview) z brand guardrails Security: violet #7E22CE, brutalist, zero tekstu/twarzy.
- Skill `~/.claude/skills/security-blog-post/` — end-to-end workflow tworzenia postów: WebFetch → draft → walidacja tytułu ≤7 słów (hard block) → generacja coveru → frontmatter → MCP verify. Trzy główne reguły:
  1. Żargon techniczny zawsze wyjaśniaj przed pierwszym użyciem
  2. Nie dorzucaj faktów/terminów spoza treści źródła
  3. Nie spekuluj o błędach nazwanej firmy (ryzyko prawne)

### Decisions
- **Resend vs MailerSend** — potwierdzony wybór Resend (3k free tier pokrywa wolumen 500-1000/mc, SOC 2 Type II, EU datacenter, React Email). Pełna analiza w [reference_email_provider.md](~/.claude/projects/.../memory/reference_email_provider.md).

### Planowane po tej wersji
- **DNS enrichment samooceny** (DNSDumpster API via Supabase Edge Function) — wzbogacenie raportu pasywnym skanem ekspozycji
- **Standalone lead-gen tool** „Sprawdź domenę w 30s" na `/security/`
- **Phase B** — Stripe hosted checkout gate dla mockup B (149 zł) + Resend email delivery

---

## [0.552] — 2026-04-14

Task 2 A4 — Client-side PDF raportu + upsell section.

### Zakres
- Nowa Vite MPA entry `raport-audit/index.html` — renderuje pełny 10-stronicowy raport audytu (mockup B) z dynamicznymi danymi usera albo przykładową organizacją (`?example=1`).
- `src/raport/app.js` czyta `sessionStorage.raportData`, auto-triggeruje `window.print()` po 800ms — user zapisuje jako PDF przez natywny dialog przeglądarki.
- `src/raport/template.js` generuje: cover + TOC/methodology/scope + radar SVG + category narratives (dynamic per score) + findings + compliance grid + CTA.
- `src/raport/example.js` — hardcoded TwojaFirma Sp. z o.o. 58/100 Developing dla "Zobacz przykładowy raport".
- Sekcja upsell w `results-management.js` między Top 5 rekomendacji a konsultacją: H2 "Rozszerzona wersja raportu — 10 stron gotowych do druku", 5 benefitów, 2 przyciski `[Pobierz swój raport]` (otwiera nową kartę z realnymi danymi) + `[Zobacz przykładowy raport]` (z example data), note "W wersji beta oba raporty są darmowe. Docelowo 149 zł."
- `app.js` action handlers: `download-pdf` zapisuje `sessionStorage.raportData` (profile + responses + scoringResult) i otwiera `/raport-audit/`; `view-example-report` otwiera `/raport-audit/?example=1`.

### Reorder
Oryginalnie A4 miał być Supabase schema. Przereorderowane: **A4 client-side PDF → A5 Supabase → A6 Benchmark**, bo Supabase credentials nie są jeszcze gotowe, a PDF dawał największą wartość lead-gen teraz.

### Fix
`makeRefNumber()` w `raport/app.js` wyciąga tylko cyfry z seedu (ISO string po `.replace(/\D/g, '')`) zamiast `slice(-5)` na surowym stringu — ref wyglądało jak `AP-SA-...-.382Z`.

---

## [0.551] — 2026-04-14

Task 2 (Samoocena) — auto-clear cache po zakończonym teście.

### Problem
User wchodził ponownie na `/bezpieczenstwo-samoocena/` i widział stare wyniki z poprzedniej sesji — localStorage zapamiętywał state 'results' z kompletem odpowiedzi. Intended "resume after interrupt" feature, ale dla zakończonego testu (step='results' lub 'thank-you') to nie ma sensu.

### Fix (app.js init)
```js
const initial = getState();
if (initial.step === 'results' || initial.step === 'thank-you') {
  clearState();
}
```

- Resume w połowie testu (step='question' / 'category-intro' / 'profiling') zachowany — user może kontynuować od miejsca gdzie skończył
- Po zakończeniu testu (thank-you lub results), następne wejście = świeży landing

---

## [0.550] — 2026-04-14

/security/ — rename nazwy karty SAMOOCENA: `Online · Bezpłatnie` → `Audyt uproszczony` (spójne z opisem, lepiej pokazuje produkt).

---

## [0.549] — 2026-04-14

/security/ — fix listy "Co dostajesz" w karcie `_00 · SAMOOCENA` — spójność z realnym raportem.

### Było (niespójne z faktycznym raportem)
- Wynik 0-100 w 5 kategoriach
- Porównanie ze średnią Twojej branży
- 3 najważniejsze rekomendacje (faktycznie jest 5)
- Szacowany koszt wdrożenia (redundant — to jest W rekomendacjach)

### Jest (1:1 z Executive Summary + Top 5)
- Wynik 0–100 w 5 kategoriach + poziom dojrzałości
- Executive summary z 3 największymi lukami i ryzykiem finansowym
- Top 5 rekomendacji z kosztem, nakładem i impactem
- Benchmark na tle firm MŚP (wersja wstępna)

---

## [0.548] — 2026-04-14

Task 2 (Samoocena) — sticky footers + flex viewport + A3c-7 (banner removal, box stability, 75vw desktop) + podpięcie z /security/.

### Sticky footers na każdym screenie
- `.samoocena-viewport` — flex column + `min-height: calc(100dvh - 5rem)`
- `.samoocena-question-shell`, `.samoocena-category-intro`, `.samoocena-thank-you`, `.samoocena-profiling` — flex column + flex: 1 1 auto
- Action footery (question-nav, category-actions, thank-you-actions, form-actions) — `margin-top: auto` + `position: sticky; bottom: 0` + gradient background
- Efekt: przyciski zawsze na dolnej krawędzi viewportu, nie skaczą w zależności od długości contentu
- Single-button screens (category-intro, thank-you) — `justify-content: flex-end` (przyciski po prawej)

### Zmniejszone odstępy na category-intro
- Display 02/05: clamp 4.5-8rem → 3.5-6rem
- Title: 2-3rem → 1.7-2.4rem
- Transition margin 3rem → 1.75rem, meta 1.5rem → 1rem, description 2.5rem → 1.5rem, meta-grid padding 1.2rem → 0.9rem

### A3c-7 — banner removal + guardrail callout
- Usunięty banner "⚠ Pytanie krytyczne — odpowiedź wpływa na poziom dojrzałości" z `renderQuestion()` — implicite dewaluował 33 pytania, których nie oznaczono jako critical
- Dodany czerwony `.samoocena-guardrail-callout` w `renderExecutiveSummary()` (results-management.js) — pokazuje się TYLKO gdy `scoringResult.guardrailTriggered === true`. Komunikat: "Twój wynik jest ograniczony do 'Developing' niezależnie od pozostałych odpowiedzi, ponieważ brak MFA oraz brak testowanego backupu to warunki minimalne w certyfikacjach CIS Controls v8 i większości polis cyber insurance."
- Waga 2.0 i guardrail zostają w silniku bez zmian — tylko UI komunikacja przeniesiona z per-pytanie na per-wynik

### Box stability na question screen
- `.samoocena-question-text` dostaje `min-height: calc(2 * 1.3em)` — pytanie zawsze rezerwuje miejsce na 2 linie, opcje radio nie skaczą między krótkimi i długimi pytaniami

### Desktop 75vw z cap 1100px
- Mobile (<1024px): `max-width: 100%` (bez zmian)
- Desktop (≥1024px): `max-width: min(75vw, 1100px)` dla question-shell, category-intro, thank-you, profiling — 75% viewportu ale ultrawide capped na 1100px żeby tekst zostawał czytelny

### Podpięcie z /security/
- Karta `_00 · SAMOOCENA` na `/security/` w sekcji Oferta: CTA `Zapytaj o samoocenę` (href="#contact") → `Zrób audyt →` (href="/bezpieczenstwo-samoocena/")
- Opis karty uproszczony: "Bezpłatny audyt uproszczony online. Kwestionariusz 35 pytań w 5 kategoriach, wynik natychmiastowy, top 5 rekomendacji." (usunięte "199 zł / 149 zł early adopters / narzędzie wkrótce dostępne" — bo narzędzie jest dostępne i bezpłatne w becie)

### TODO na później (Phase B lead capture)
- Na końcu raportu dodać "haczyk" dla paid PDF: CTA "Chcesz pełnej wersji audytu PDF?" + email capture + Stripe 149 zł — po ukończonym teście, gdy user widzi już wartość. Wymaga Stripe + Supabase + Resend (A4-A6 + Phase B).

---

## [0.547] — 2026-04-14

Task 2 (Samoocena) — serif font bug + opcje vertical alignment.

### Root cause (MCP DevTools visual check)
- `.samoocena-shell` nie miał zadeklarowanego `font-family`. Samoocena nie importuje głównego `style.css` (gdzie jest `html { font-family: Inter }`). Browser fallback → serif (Times).
- Efekt: h1/h2 z explicite Outfit były OK, ale body text, opcje radio, paragraphs bez font-family leciały serif.

### Fix
- `.samoocena-shell { font-family: 'Inter', system-ui, -apple-system, sans-serif; }` + `line-height: 1.55` + `font-size: 16px` jako baseline
- `.samoocena-shell * { font-family: inherit; }` oraz explicite dla h1-h6, p, button, input, select, label, span, li, dt, dd — gwarancja że żaden element nie wyślizgnie się na browser default
- `.samoocena-option`: `align-items: flex-start` → `align-items: center` (tekst vertically centered w 56px min-height boxie)

---

## [0.546] — 2026-04-14

Task 2 (Samoocena) — FIX: setState nie zaimportowany w app.js.

### Root cause (znaleziony przez Chrome DevTools MCP)
- Console error: `Uncaught ReferenceError: setState is not defined`
- Akcje `submit-profiling`, `next-question`, `finish` wywołują `setState(...)` z state.js, ale nie było go w destructured import w app.js
- Wszystkie poprzednie próby (v0.541-0.545) były niewidoczne dla usera bo handler crashował przy pierwszym `setState()` call, a profiling był pierwszą ścieżką gdzie go używałem

### Fix
- Dodany `setState` do import z `./state.js` w app.js

### Verified end-to-end (Chrome DevTools MCP)
- Landing → klik "Rozpocznij audyt" → profiling ✅
- Profiling: IT/Software + 11-50 → klik "Rozpocznij audyt" → category-intro `01/05 Ludzie` ✅
- Intro → klik "Rozpocznij pierwszą kategorię" → pytanie 1/35 z 4 opcjami (w tym "Nie wiem") ✅
- Progress counter "1/35" + label "LUDZIE" widoczne
- Poprzednie disabled (first), Następne disabled (brak odpowiedzi)

---

## [0.545] — 2026-04-14

Task 2 (Samoocena) — fix profiling button (klik nie działał).

### Root cause
- Submit event przez `mainEl.addEventListener('submit', ...)` nie łapał się na delegated listener w niektórych konfiguracjach. Click na button z `type="submit"` wywoływał reload strony zamiast handlera. User w incognito (czysty stan) potwierdził że nic się nie dzieje po kliku.

### Fix
- `type="submit"` → `type="button"` + `data-action="submit-profiling"`
- Handler przez `handleClick` dispatch (spójne z resztą akcji: start, resume, restart, begin-category, finish, go-to-results)
- Walidacja: jeśli branża lub wielkość niewybrane, fokus na pierwszy pusty select + `reportValidity()` pokazuje browser tooltip "Wybierz element z listy"

---

## [0.544] — 2026-04-14

Task 2 (Samoocena) — fix profiling submit + rename button.

### Bug
- Przycisk "Rozpocznij pytania" na profiling screen wyglądał na nieaktywny — klikał się bez efektu gdy dropdowny (branża/wielkość) nie były wybrane. Handler `if (!industry || !size) return;` cichaczem się kończył, bez sygnału dla usera.

### Fix
- Usunięty atrybut `novalidate` z `<form data-form="profiling">` — HTML5 validation na `<select required>` teraz pokazuje browser tooltip "Wybierz element z listy" gdy user spróbuje submitować bez wyboru.
- Rename buttonu: `Rozpocznij pytania →` → `Rozpocznij audyt` (nazewnictwo spójne z landingiem gdzie CTA to też "Rozpocznij audyt").
- Zmienione klasy `samoocena-btn` → `samoocena-cta` + nowa struktura z `.samoocena-cta-label` + `.samoocena-cta-arrow` — spójność z CTA na landingu.

---

## [0.543] — 2026-04-14

Task 2 (Samoocena) — questions rewrite: "Nie wiem" opcja + gramatyka.

### Nowa struktura (35 pytań, 4 opcje każde)
- Opcja 1 (zawsze pierwsza): "Nie wiem / nie jestem pewny" — score 0 (blind spot = luka kontrolna w cyberbezpieczeństwie)
- Opcje 2-4: zachowany scoring 0/1/3 lub 0/2/3 z poprzedniej wersji (najgorsza → najlepsza)
- User nie musi się już "zgadywać" gdy nie wie — ma jawną opcję, która nie udaje pewności

### Gramatyczna rewizja
- Ujednolicenie osoby gramatycznej — wszystkie pytania w trzeciej osobie ("Czy firma...", "Jak firma..."), bez mieszania z 2. os. mn. ("zarządzacie", "udostępniacie")
- Konkretne fixy: "Czy wiesz KTO ma dostęp" → "Czy firma prowadzi aktualną listę osób z dostępem"; "kogo dzwonisz pierwsze" → "do kogo firma zadzwoni najpierw"; "przeszkolony z ataków" → "przeszkolony w zakresie ataków"; "admin access" → "konto administratora"
- Opisy kategorii rozszerzone — konkretniejsza narracja "dlaczego to ważne" dla każdej z 5 kategorii
- Mapowanie CIS Controls + NIST CSF zachowane na każde pytanie

### Category descriptions
- "Ludzie": 82% ataków zaczyna się od człowieka, dlaczego trening > narzędzia
- "Dane": backup, szyfrowanie, retencja, access — cztery filary
- "Infrastruktura": MFA, patche, EDR, hardening
- "Procesy": IR plan, logi, testy, odpowiedzialność
- "Compliance": KSC, NIS2, RODO + łańcuch dostaw

Bundle: 53.85 KB / 17.74 KB gzip.

---

## [0.542] — 2026-04-14

Task 2 (Samoocena) — results screen 1:1 mockup A (management report, scrollable).

### Struktura raportu (4 sekcje na jednym scrollu)

1. **Cover** — brand A**i** Puls Security + tagline, kicker `// Raport samooceny cyberbezpieczeństwa`, H1 "TWÓJ WYNIK" (Outfit 800), giantny score 58 / 100 (clamp 5-9rem, kolor zależny od maturity), maturity label, meta (data · wersja · profil firmy). Top border 4px violet.
2. **Executive summary** — H2 "Jedna strona, którą musi przeczytać właściciel firmy", violet border-left `.exec-highlight` z pct + ryzyko paraliżu, `.exec-box` z kontekstem biznesowym, H3 "Twoje 3 największe luki" (top 3 gaps dynamicznie), H3 "Ryzyko finansowe" z szacunkami 45-120 tys. zł.
3. **Analiza kategorii** — 5 horizontal bars z wartościami + benchmark marker (pionowy biały pasek 2px = średnia branży). Kolory per level (critical=red, developing=amber, managed=green, optimized=violet). Exec-box "Co mówi benchmark?" porównuje per-kategoria.
4. **Top 5 rekomendacji** — zamiast 3, jak w mockupie A. Każdy rec: violet num block 60px + body (h4 + paragraph + meta tags koszt/wdrożenie/impact z color-coded tagami). Opcjonalny "why" footer z impact rationale.

### CTA + restart
- Finalny `.samoocena-report-cta` — violet filled panel z H3 "Chcesz to zamienić na konkretny plan wdrożenia?" + link do `/security/#contact` (black button z white text, hover swap na white→violet).
- Restart button centered poniżej.

### Benchmark placeholder
- Mocked benchmark dla MŚP 11-50 (A=55, B=48, C=52, D=45, E=58, n=42) — adnotacja w footnote że real dane podłączymy w A5 (Supabase RPC).

### Mobile
- Bars stackują label na osobny rząd
- Cover meta mniejsze, gap mniejszy
- Rec num 48px zamiast 60px

Bundle: 50.72 KB / 17.14 KB gzip.

---

## [0.541] — 2026-04-14

Task 2 (Samoocena) — category intro + thank-you screens + flow restructure.

### Category intro (1/5 → 5/5)
- Nowy step `category-intro` w state flow
- Visual: giantny numer kategorii `01/05` (Outfit 800, clamp 4.5-8rem, violet), nazwa kategorii, subtitle, description z questions.json
- Kategoria 1: tylko intro ("Rozpocznij pierwszą kategorię")
- Kategorie 2-5: transition box (violet border-left) z "Dziękuję — to wszystkie pytania w [prev]. Przejdźmy do następnej." + intro
- Meta grid: 7 pytań · ~2 min · X/5 postęp

### Thank-you screen
- Nowy step `thank-you` między ostatnim pytaniem a raportem
- Duży "Dziękujemy. Raport jest gotowy." (Outfit 800)
- Stats grid: odpowiedzi / czas wypełniania / kategorii
- Jeden CTA "Zobacz raport →" (otwiera results)
- Moment closure przed dramaturgią raportu (wynik pokazuje się dopiero po kliknięciu)

### Flow changes
- profiling submit → `category-intro` (cat 0)
- `begin-category` action → `question` (pierwsze pytanie kategorii)
- `next-question` przy ostatnim pytaniu kategorii → skok do `category-intro` (następna cat)
- `finish` na pytaniu 35 → `thank-you` (nie results od razu)
- `go-to-results` na thank-you → `results`

Bundle: 47.05 KB / 15.91 KB gzip.

---

## [0.540] — 2026-04-14

Task 2 (Samoocena) — typography bliżej mockup A + question width constraint + progress counter prominence.

### Typography alignment z mockupem A
- Headlines wszędzie: `Outfit` 700-800 z tight letter-spacing (-0.01em do -0.02em) zamiast Inter uppercase. Match cover mockupu A (h1 36pt / h2 22pt).
- `.samoocena-display`, `.samoocena-section-title`, `.samoocena-question-text`, `.samoocena-profiling h1`, `.samoocena-results h1`, `.samoocena-deliverable h3`, `.samoocena-rec h3`, `.samoocena-section-card h2` — wszystkie Outfit z spójnymi wagami
- Body text zostaje Inter (czytelność długich pytań)
- Labels/kickers/CTA: Space Grotesk (bez zmian)

### Width constraint
- Question screen (`.samoocena-question-shell`) i profiling (`.samoocena-profiling`) max-width 720px — tekst pytań w 60-72ch zamiast lecenia na 1200px
- Landing i stats zostają na 1200px (monumentalny efekt)

### Progress counter prominence
- Duży `X / 35` Outfit 800 violet tabular-nums nad paskiem
- Po prawej stronie etykieta kategorii (Space Grotesk uppercase)
- Bar shrunk z 6px → 4px żeby counter był głównym hitem

---

## [0.539] — 2026-04-14

Task 2 (Samoocena) — nav spójny ze stroną security.

- Brand: `Ai Puls` (Outfit 800) + `Cyber Security` tagline (Space Grotesk uppercase) — replicated pattern z `.site-nav-brand` na /security/
- `brand-i` z violet kropką (pseudo-element) — lokalna kopia globalnego patternu
- Link prawy: `Powrót na stronę główną` → `href="/"` (pełna na desktop, `← Powrót` na mobile)
- Nav-inner dostaje `max-width: 1200px` + `padding: 1.25rem 2rem` — content już nie dotyka krawędzi ekranu
- Mobile (<768px): tagline i version chowają się, padding 1.25rem side, link skraca się do `← Powrót`
- Viewport dostaje też padding 1.25rem side na mobile żeby zgrać się z nav

---

## [0.538] — 2026-04-14

Task 2 (Samoocena) — stat cards czytelność. Pojedynczy stat ("0 zł") był nieczytelny bez kontekstu.

- Dodane kickers `// ZAKRES / CZAS / KOSZT / DANE` nad każdą liczbą (Space Grotesk uppercase, violet)
- Numery (35, 10, 0, 0) teraz VIOLET `#7E22CE` zamiast białych — spójne z mockupami PDF (score w violet)
- Suffixy (`pytań`, `min`, `zł`, `e-maili`) w Space Grotesk muted zamiast niezrozumiałych symboli
- Czwarty stat: ezoteryczny symbol `∅` → zwykłe "0 e-maili" + label "Bez rejestracji, bez spamu"
- Drugi label stat'u doprecyzowany: "W 5 kategoriach (CIS + NIST)" zamiast "Pytań w 5 kategoriach"

---

## [0.537] — 2026-04-14

Task 2 (Samoocena) — A3b: visual cohesion pass. Landing był niespójny z resztą strony AI Puls Security i z mockupami PDF.

### Root causes znalezione

- `#a855f7` (violet-500) zamiast globalnego `#7E22CE` (`--brand-accent-security`) — samoocena/styles.css nie importuje `style.css`, więc `var(--brand-accent)` niezdefiniowany, fallback się trzymał
- Outfit 800 mixed-case dla h1 — globalne h1-h4 używają Inter 700 uppercase letter-spacing 0.05em; Outfit jest zarezerwowany dla `.landing-logo` i numerów/scores w mockupach
- Brak content-width constraint — `.container-fluid` ma max-width 1920px, tekst lał się od krawędzi na 16:9

### Sacred rules egzekwowane

- Accent: `#7E22CE` hardcoded w `.samoocena-shell` (+ `--samoocena-accent-rgb: 126, 34, 206`)
- Fonts: h1/h2/h3 = Inter 700 uppercase letter-spacing 0.02-0.05em. Outfit 800 TYLKO dla numerów (stat grid, overall score, rec-num, deliverable-index). Space Grotesk dla meta/labels/CTA
- Content constraint: `.samoocena-viewport` max-width 1200px + max-width 18-24ch na h1/h2
- 4px violet top accent bar nad całym shellem (jak strony raportów PDF)
- Box-shadow offset na CTA usunięty — flat hover inversion (filled → ghost)
- Border-radius: zero na progress bar i category bars

### HTML changes

- `renderLanding()`: h1 zmieniony z 3-liniowego display `<em>35</em> pytań.` na zwięzły `Samoocena cyberbezpieczeństwa` (uppercase Inter) + sub-line Space Grotesk `35 pytań · 5 kategorii · 10 minut · Bezpłatnie`
- Hero lead skrócony

### Verification

- `grep` samoocena dir: 0 wystąpień `#a855f7`, 0 wystąpień `rgba(168, 85, 247)`
- Outfit pozostaje tylko w 4 miejscach: stat-num, deliverable-index, overall-number, rec-num (wszystkie numery)
- Build czysty, bundle 43.54 KB / 15.11 KB gzip

---

## [0.536] — 2026-04-14

Task 2 (Samoocena) — A3 redesign landing (editorial audit chamber aesthetic).

### Redesign
- Hero display typography (Outfit 800, do 6.5rem) — trzywierszowy headline "35 pytań · 10 minut · Twój stan bezpieczeństwa" z violet accent na liczbach
- Meta-tape górny z uppercase data fields (data audytu, framework, scope)
- Eyebrow z pulsującą violet kropką — "Dokument #YYYYMMDD"
- 4-panel stat grid z giantnymi liczbami (35 / 10min / 0zł / ∅) — tabular-nums, hairline separators
- Numbered deliverables list (01/02/03) — bez boxów, z hover slide + hairline dividers, meta monospace pod każdym
- CTA primary z offset shadow hover effect + arrow transition
- Landing footer z credits (CIS v8 / NIST CSF 2.0 / NIS2+KSC+RODO)

### Visual detail
- Tło grid lines (96×96px) + radial violet glow + mask fade
- Staggered fade-up animation z cubic-bezier(0.22, 1, 0.36, 1) na hero (0.1s stepping)
- `prefers-reduced-motion` — wszystkie animacje off
- Safari prefix dla mask-image

### Mobile
- Stats 4→2→1 kolumny przy breakpointach 1024/768
- Display headline skaluje clamp(2.4rem, 12vw, 4rem)
- Deliverables single column z redukcją indexu

---

## [0.535] — 2026-04-14

Task 2 (Samoocena) — A3: UX flow + on-screen results (mockup A).

### Flow
- Landing → Profiling (branża/wielkość) → 35 pytań (1 per ekran) → Results
- LocalStorage resume: zamkniesz kartę — wrócisz do tego samego miejsca
- Progress bar X/35, kategorie widoczne na górze, mapping CIS/NIST pod pytaniem
- Pytania critical (MFA, backup) oznaczone wizualnie

### Results screen (mockup A adaptacja)
- Overall score + maturity label (Initial/Developing/Managed/Optimized) z kolorami
- 5 horizontal bars per kategoria, kolor zależny od poziomu
- Benchmark line (placeholder do A5 — Supabase RPC)
- Top-3 rekomendacje z kartami (cost/effort/impact)
- CTA "Pobierz PDF" disabled (podłączymy w A6)
- CTA do /security/#contact dla konsultacji

### Moduły
- `state.js` — state store + localStorage + observer pattern
- `charts.js` — CSS bars, overall score, progress bar, benchmark line
- `ui.js` — renderery (landing/profiling/question/results/error)
- `results-management.js` — dedicated mockup A renderer
- `app.js` — orchestrator, delegated event handlers
- `styles.css` — ~550 linii, mobile-first, theme-security violet

### Status
- ✅ Build czysty (bundle 39.79 KB, 14.28 KB gzip)
- ✅ Safari backdrop-filter prefix
- [ ] Smoke test przez człowieka: desktop + mobile 375px przeklik 35 pytań
- [ ] Merytoryczna recenzja pytań (do zrobienia przed live)
- A4 podepnie Supabase insert po markCompleted

---

## [0.534] — 2026-04-14

Task 2 (Samoocena) — A2: question bank + scoring engine + rekomendacje.

### Question bank (`src/samoocena/questions.json`)
- 35 pytań w 5 kategoriach × 7 (Ludzie, Dane, Infrastruktura, Procesy, Compliance)
- Scoring 0/1/3 lub 0/2/3 per pytanie (3 opcje każde)
- Weight 2.0 dla pytań `critical: true` (B1 backup, C1 MFA), 1.0 reszta
- Mapping na CIS Controls v8 + NIST CSF 2.0 + RODO/NIS2 per pytanie
- 4 maturity levels (Initial/Developing/Managed/Optimized)

### Scoring engine (`scoring.js`)
- Per-kategoria: `earned / max * 100` (% ważony)
- Overall: suma ważonych earned / max
- Guardrail: jeśli WSZYSTKIE critical questions = 0 → cap maturity na "Developing" (zapobiega "Managed" bez MFA + backup)

### Rekomendacje (`recommendations.js`)
- Top-N po severity = `gapPoints × weight × (critical ? 1.5 : 1)`
- Biblioteka 35 rekomendacji z fieldami: title, action, cost, effort, impact (konkretne narzędzia i szacunki kosztów)

### Status
- [ ] Recenzja merytoryczna pytań (35) przez Ai Puls — do zrobienia przed A3
- A3 użyje tych modułów w flow UX

---

## [0.533] — 2026-04-14

Task 2 (Samoocena bezpieczeństwa) — A1 wiring. Nowy entrypoint MPA `/bezpieczenstwo-samoocena/` z pustym skeletonem (theme-security, violet accent). Dodany do `getHtmlInputs()` w `vite.config.js` i sitemap `dynamicRoutes`. Stub `src/samoocena/app.js` + `styles.css`. Przygotowane pod A2 (question bank + scoring).

---

## [0.532] — 2026-04-13

Hide duplicate "Zamknij" button in cookie modal on mobile — top header close button hidden (≤767px), bottom actions close button remains.

---

## [0.531] — 2026-04-13

Fix cookie preferences modal not fitting on phone screens.

- Modal becomes flex column with scrollable categories area (`flex: 1; overflow-y: auto`)
- `max-height: calc(100dvh - 1.5rem)` with `100vh` fallback for mobile browser chrome
- Tighter padding (modal `1rem`, categories `0.75rem`, backdrop `0.75rem`)
- Smaller typography (descriptions `0.8rem`, title `1.2rem`, toggle labels `0.65rem`)
- Toggle control `44×24px` (was `52×28px`), buttons `min-height: 40px` (was `46px`)

---

## [0.530] — 2026-04-13

Codex cookie consent — GDPR-compliant banner + preferences modal + policy page.

### Integration
- `main.js` — `import './src/cookie-consent/index.js'` (business + security pages)
- `src/landing.js` — `import './cookie-consent/index.js'` (landing page)
- `src/security-blog.js` — `import './cookie-consent/index.js'` (blog pages)
- `src/polityka-cookies.js` already wired by Codex (policy page entry)

### Vite config
- `polityka-cookies/index.html` added to `getHtmlInputs()` glob
- `/polityka-cookies/` added to sitemap `dynamicRoutes`

### Codex-delivered files (already in repo since v0.522)
- `src/cookie-consent/consent.js` — localStorage API (`getConsent`, `setConsent`, `hasConsent`, `clearConsent`)
- `src/cookie-consent/ui.js` — banner (3 buttons: Akceptuj/Odrzuć/Dostosuj) + preferences modal with focus trap
- `src/cookie-consent/styles.css` — banner + modal styling
- `src/cookie-consent/index.js` — public entry, auto-inits on DOMContentLoaded
- `polityka-cookies/index.html` — static GDPR cookie policy page
- `src/polityka-cookies.js` — policy page entry with "open settings" button wiring

### Footer cookie link
- `.footer-cookie-link` (added in v0.523) now activates — Codex `ui.js` listens for clicks and opens preferences modal

---

## [0.523] — 2026-04-13

Mobile UX Commit 3/3 — footer harmonization + vCISO modal expansion.

### Footer harmonization (both pages + blog generator)
- Centered column layout: brand → copyright → links (was horizontal `space-between`)
- `.footer-brand-row` wrapper, `.footer-copyright` moved outside brand div
- 5 links per page: LinkedIn + Email + cross-brand link + Powrót do wyboru + Ustawienia cookies
- `.footer-cookie-link` class added (activates with v0.530 cookie consent)
- Phone (≤767px): links stack vertically (`flex-direction: column`, `gap: 0.75rem`)
- Desktop: links wrap horizontally centered (`flex-wrap: wrap`, `justify-content: center`)
- `scripts/build-security-blog.mjs` `renderFooter()` updated with same pattern

### vCISO modal expansion (`src/security-data.js`)
- Modal 3 (Premium + vCISO): audience now explains "vCISO = Virtual CISO = zewnętrzny Chief Information Security Officer"; format adds "hybrid (zdalnie + 1 wizyta)"; outcome adds firm size note
- Modal 4 (Virtual CISO standalone): title "Virtual CISO (vCISO)"; audience opens with full acronym expansion; benefits more specific (monthly priorities, "zamiast Ciebie lub obok Ciebie", "jesteśmy pierwszym telefonem")

---

## [0.522] — 2026-04-13

Mobile UX Commit 2/3 — pricing unify + section layouts + copy cleanup + toolbox CTA + consultation gap.

### Pricing unify (security #section-oferta)
- All 4 cards: violet rail (was Samoocena gray + violet gradient on others)
- All 4 CTAs: violet filled (was Basic violet, Rozszerzony/Premium outline) — `pricing-card-cta-outline` class removed from HTML
- Pricing CTA: `display: flex; width: 100%` for full-width centering inside card (was inline-flex narrow)
- Premium card desc cleanup: removed duplicate "3 tygodnie audyt + 3 miesiące opieki" tail. New: "Pełny cykl przez 6 miesięcy: 3 tygodnie audytu + 3 miesiące vCISO (4h/mies) + re-audyt po 6 miesiącach."

### Section layouts (compliance + automatyzacje analogous pattern)
- Mobile: text → boxes → button (was text+button | boxes side-by-side)
- Boxes max-width 90% centered
- Button moved BELOW boxes via `display: contents` + CSS order on `.compliance-cta-wrap` (3) and `.compliance-boxes-col` (2)
- Subtle separator lines between academy-curriculum-items (border-bottom rgba 0.08)
- Business automatyzacje: button class `btn btn-outline` (czarny) → `btn btn-accent` (amber filled) per "w kolorze akcentów"
- Added `.compliance-cta-wrap` + `.compliance-boxes-col` classes to both sections

### Toolbox CTA (business #section-narzedzia)
- HTML: duplicate button — `.toolbox-btn` in header (desktop) + `.toolbox-btn-mobile` in `.toolbox-cta-wrap` after tool-grid (mobile/tablet)
- CSS: `.toolbox-cta-wrap` hidden on desktop, header `.toolbox-btn` hidden on `<=1023px`
- Mobile button centered (text-align: center on wrap), 0.85rem 1.5rem padding

### Consultation section gap (both pages)
- `@media (max-width: 767px) .section-contact { padding: 2rem 0 2rem; min-height: 0 }` (was 4rem 0 4rem + 65vh)
- `.grid-fluid` gap reduced to 0.75rem (was 2rem from generic mobile rule)
- Inline `padding: 2rem` → `1rem` on `.col-6` form columns
- Result: title flows directly into form on phone, no big empty gap

---

## [0.521] — 2026-04-13

Mobile UX Commit 1/3 — hero refactor (image above CTAs) + slider reorder (image above buttons) + cert overlay on photo.

### Hero (both pages)
- Hero actions duplicated (`.hero-actions-desktop` in flex-center-v — hidden on mobile; `.hero-actions-mobile` as sibling — hidden on desktop)
- Mobile flex-col order: text → photo → actions (was text+actions → photo)
- Mobile buttons: **side-by-side smaller** (was stacked full-width)
- Tighter padding: phone `0.75rem 0 1.25rem` (was `3rem 0 4rem`), tablet `1rem 0 1.5rem` (was `2rem 0 3rem`)
- Reduced grid-fluid gap to `0.75rem` on mobile (was `1.25rem`)
- Hero headline font reduced on phone: `clamp(2rem, 7vw, 2.5rem)` (was `clamp(2.25rem, 8vw, 3rem)`)

### Security hero — cert badges as overlay
- `.hero-certificates-link` moved INSIDE `.hero-photo-wrap` in HTML
- On mobile: absolute bottom-right of photo-wrap, `max-width: 180px` tablet / `140px` phone (was full-width below photo)
- Overlay drop-shadow for readability on photo background
- Desktop behavior unchanged (still absolute in photo-wrap area)

### Szkolenia slider (zespoly + dev + security)
- Mobile reorder via `display: contents` on `.slider-col-text` — children escape to grid-fluid as flex items
- CSS order: text (0) → image (2) → actions (3) — works for both source orders (text-first zespoly + image-first dev/security)
- Actions row: `flex-direction: row` side-by-side smaller (2 buttons split 50/50)
- Reset `.grid-align-center` (align-items: center) to `stretch` on mobile — prevents label/title/desc centering
- Force `text-align: left` on all slider flex children

### Files
- `business/index.html` — hero HTML restructure (duplicate actions, named classes)
- `security/index.html` — same + cert-link moved inside photo-wrap
- `style.css` — tablet (<=1023) + phone (<=767) hero overrides; szkolenia slider display:contents block; desktop .hero-actions-desktop rule

### Regression check
- Desktop 1280: hero unchanged visually (photo overlap preserved, cert strip in same position)
- Tablet 834: hero stacks correctly, cert overlay 180px
- Phone 375: text → photo (with cert overlay bottom-right) → 2 CTAs side-by-side

---

## [0.520] — 2026-04-13

Pricing update — realistic market-aligned rates based on benchmark research.

### Changed (Audit packages)
- **Samoocena PDF**: 99 zł → **149 zł brutto (early adopters)** + strikethrough `199 zł` regular price. Card copy updated: 35 pytań (was 40-50)
- **Basic**: 3.5-5k → **from 5 500 PLN netto** (firms ≤50 os); time 2-3 days → **3-5 days**
- **Rozszerzony**: 7-10k → **from 12 000 PLN netto**; time 5-7 days → **7-10 days**; added 1 phishing simulation campaign (also offered as standalone from 2 500 PLN)
- **Premium**: renamed `Audyt Premium` → **`Premium + vCISO`**; 12-18k → **from 25 000 PLN netto**; format 2 weeks + 3 months support → **3 weeks audit + 3 months vCISO (4h/mies)** + Incident Response Playbook

### Added (New product)
- **Virtual CISO subscription** — standalone card below pricing grid (black bg, violet border)
  - Copy: "8h/mies senior security, Executive Report, audit representation, 2h SLA"
  - Modal `audyty/4`: full details + pricing **from 4 500 PLN/mies netto** (≤50 os)
  - 2 CTAs: "Zobacz szczegóły" + "Umów rozmowę"

### Added (Footnote + scaling)
- Footnote updated: "Ceny pakietów dotyczą firm do 50 osób. Większe organizacje wyceniamy indywidualnie."
- Size multiplier communicated as "wycena indywidualna" (not explicit 1.5x/2x per user decision)

### CSS additions
- `.pricing-strike` — strikethrough price styling for promo display
- `.vciso-card` + subcomponents — black bg, violet accent border, 2-column layout (desktop) / stacked (tablet+phone)
- Responsive: vCISO card stacks CTAs below content at ≤1023px, full vertical stack at ≤767px

### Modal data (`src/security-data.js`)
- All 3 audit entries updated (outcome + format with new prices/times)
- New entry key `4` for vCISO modal (reused `renderSzkoleniaModal` shape)

### Why
- Benchmark ([docs/planning/04-pricing-benchmark/gemini-benchmark.md](docs/planning/04-pricing-benchmark/gemini-benchmark.md)): current prices 40-60% below market (Niebezpiecznik, Securitum, LogicalTrust, Cyberforces); day rate senior PL 2000-3500 PLN = previous Premium = ~65 PLN/h (dumping)
- User-approved decisions (6 questions answered):
  - Premium 25k (Gemini floor)
  - vCISO added immediately as separate card
  - Prices in modals (not on cards)
  - Size scaling: "wycena indywidualna"
  - Phishing included in Rozszerzony + standalone option
  - Samoocena PDF 199/149 "early adopters" (strikethrough pattern)

### Desktop regression
- Pricing 4-card grid: unchanged
- Modal layout: unchanged (only data updated)
- vCISO card: new addition, does not affect existing cards

---

## [0.512] — 2026-04-13

Blog layout fixes — grid orphan + non-TOC posts + prose centering.

### Fixed
- **Blog index grid** `.blog-posts-grid`: `repeat(3, 1fr)` → `repeat(2, 1fr)` (4 non-featured posts now fill 2×2 cleanly, no orphan)
- **Bug: non-TOC posts rendered in 260px narrow column** — when a post has no H2 headings (4 of 5 posts), `tocHtml` was empty string, but `.blog-post-layout` grid still placed `.blog-prose` in column 1 (260px TOC slot). Fix: `.blog-post-layout > .blog-prose:only-child { grid-column: 1 / -1 }`
- **Empty right strip on featured post with TOC** — `.blog-prose max-width: 68ch` with no margin left prose flush-left in column, leaving ~200px empty right. Fix: `margin-left/right: auto` centers prose within its grid column

### Changed (from v0.511)
- Cover image: removed full-width `.blog-post-cover-wrap` (took full viewport on desktop)
- Added `.blog-post-cover-inline`: floated right 340px inside `.blog-prose`, aspect-ratio 4:3, text wraps first 2-3 paragraphs (editorial layout)
- Phone override: cover becomes full-width 16:9 above prose (no float)

### Generator
- `renderBlogPost`: injects `<figure class="blog-post-cover-inline">` at start of `.blog-prose` innerHTML instead of between header and body-section

### Why
- User: "pozostałe posty [nie featured] — wąski pasek tekstu po lewej stronie" → non-TOC grid placement bug
- User: "zdjęcie zajmuje cały ekran, bez sensu, tekst opływa obraz" → full-viewport cover → floated inline
- User: "w poście tytułowym pusty pasek po prawej — wyśrodkować w poziomie" → prose `margin: 0 auto`

---

## [0.511] — 2026-04-13

Contrast fix — secondary text on dark was failing WCAG AA.

### Fixed
- **Dark mode `--text-secondary`**: `#666666` → `#B3B3B3`
  - Old: **3.66:1** on black (FAIL WCAG AA normal text — min 4.5:1)
  - New: **11.4:1** on black (AAA — passes with comfort headroom)
  - Light mode unchanged (`#666` on white = 5.7:1 passes AA)
- `.blog-card-meta` color: `#888` → `#A8A8A8` (4.9:1 → 7.4:1 AAA on `#0A0A0A` dark card bg)
- `.blog-hero min-height: auto` → `0` (Firefox compat warning)

### Why
- User: "ten szary kolor tekstu na ciemnym tle nie jest zbyt mało kontrastowy — męczy mnie już czytanie"
- Verified: `#666` on black = 3.66:1 (below WCAG AA minimum of 4.5:1). User's fatigue was real
- Impact: hero subtitle, blog card excerpt, blog post lead, modal descriptions, footer copy, tool-card descriptions — all now readable

### Affected via `--text-secondary` variable
- `.hero-subtitle`, `.module-desc`, `.landing-desc`, `.blog-card-excerpt`, `.testimonial-role`, `.footer-copyright`, all `.hover-white` hover states, and ~25 other selectors

### Reference (for future changes)
WCAG contrast rules:
- AA normal text: 4.5:1 (legal minimum EU Accessibility Act 2025)
- AAA normal text: 7:1 (recommended)
- Large text (18pt+ / 14pt+ bold): 3:1 AA, 4.5:1 AAA
- Reading comfort for long-form: aim for ≥10:1

---

## [0.510] — 2026-04-13

**TASK 1 — SECURITY BLOG** (`/security/blog/`) — markdown-driven blog, Vite MPA static build.

### Added

**Infrastructure**:
- `scripts/build-security-blog.mjs` — Node generator: scans `content/security/blog/**/index.md`, validates front-matter, builds per-post HTML + index + RSS feed
- `vite.config.js` — async config with dynamic `rollupOptions.input` via globby, pre-build hook calls `buildSecurityBlog()`, dev watcher on `content/`, `vite-plugin-sitemap` integration
- `src/security-blog.js` + `src/security-blog.css` — separate entry for blog pages (not in `main.js` bundle)

**Content**:
- `content/security/blog/<slug>/index.md` — source of truth for posts (5 initial posts covering mity / supply-chain npm / AI phishing / backup 3-2-1 / cyber insurance)
- Each post: front-matter (title, slug, date, excerpt, description, category, tags, cover, coverAlt, featured, draft, author) + markdown body

**Generator features**:
- Front-matter validation (required fields + slug must match folder name, no duplicates)
- Draft mode: `draft: true` posts excluded from build
- Sort: featured first, then date desc
- Auto TOC from H2 headings (with slugified IDs)
- Reading time estimate (200 wpm)
- Image pipeline: relative images (./images/xxx) → sharp → WebP 1600px max + hash → `public/generated/security/blog/<slug>/`; absolute paths passed through
- Inline images get `loading="lazy"`, `decoding="async"`, `.blog-inline-image` class

**Templates**:
- Blog index: hero + featured card + 3-col post grid + CTA box + shared nav/footer
- Single post: breadcrumbs + meta + title + lead + cover + sticky TOC sidebar + prose + CTA box
- Shared `renderNav('/security/blog/')` — adds Blog link with `aria-current="page"` + `.nav-active` class, full nav with absolute URLs for cross-page anchors

**SEO**:
- Per-page `<title>`, `<meta description>`, canonical, Open Graph (title/desc/url/image/type=article)
- `<link rel="alternate" type="application/rss+xml">` in every page
- RSS feed at `/security/blog/feed.xml` (via `feed@4.2.2`)
- Sitemap.xml at `/sitemap.xml` (all posts + main pages, via `vite-plugin-sitemap@0.8.2`)

**Nav integration**:
- Added `Blog` link to `security/index.html` nav (position 6, before Kontakt)

### Dependencies added (devDependencies)
- `gray-matter@4.0.3` — front-matter parsing
- `markdown-it@14.1.1` + `markdown-it-anchor@9.2.0` + `markdown-it-attrs@4.3.1` — markdown rendering
- `slugify@1.6.9` — Polish-aware slugs
- `sharp@0.34.5` — image optimization
- `globby@14.0.2` — glob matching
- `feed@4.2.2` — RSS feed generation
- `vite-plugin-sitemap@0.8.2` — sitemap generation

### Design
- Violet theme inherits from `body.theme-security` (CSS var `--brand-accent`)
- All blog classes prefixed `.blog-*` (no collisions with main site)
- Responsive: 3-col desktop → 2-col tablet → 1-col phone
- TOC: sticky sidebar desktop → static block mobile (above prose)
- Brutalist aesthetic: black bg + white text + violet accent + sharp corners

### Generated artifacts (git-ignored)
- `security/blog/**/*.html` (regenerated on every build)
- `public/security/blog/feed.xml` (regenerated)
- `public/generated/security/blog/**/*.webp` (regenerated from images/)

### Workflow for new posts
1. Create `content/security/blog/<new-slug>/index.md` with front-matter + body
2. Optional: add images to `content/security/blog/<new-slug>/images/`
3. Commit with `draft: true` for review
4. Flip to `draft: false` to publish
5. `npm run build` regenerates everything

### Why
- Task 1 from sprint plan — minimum-effort blog for cybersecurity insights, solo author, 1-2 posts/week
- Static HTML output = perfect SEO, zero runtime JS for content, Vercel-friendly
- No CMS, git = source of truth

---

## [0.501] — 2026-04-13

Pricing ladder radical reorg on mobile (Task 3 commit 5/5).

### Changed
- `.pricing-grid` on phone: `display: grid` → `display: flex; flex-direction: column` with gap `2rem`
- `.pricing-card` on phone: subgrid disabled (`display: block`, `grid-row: auto`)
- Left rail indicator: 3px gradient progression (gray → violet → violet faded → violet semi)
- Card 1 (Samoocena): gray rail — entry level
- Card 2 (Basic, highlighted): full violet rail + NAJCZĘŚCIEJ WYBIERANY badge
- Card 3-4 (Rozszerzony, Premium): violet rail with opacity step
- Tighter card padding (1.75rem 1.25rem), smaller labels/CTA on phone
- Pricing footnote stacks vertically

### Why
- Task 3 commit 5/5 — maturity ladder makes progression Samoocena → Basic → Rozszerzony → Premium visually obvious on phone
- Left rail replaces desktop subgrid alignment as visual anchor
- Desktop (4-col subgrid with aligned rows) unchanged

### Deferred (next commit after review)
- srcset image variants (requires sharp pipeline script)

---

## [0.500] — 2026-04-13

Typography consistency patch — security section titles + centered headers left-align on mobile.

### Fixed
- Security `#section-proces h2` ("PROCES, KTÓRY MOŻESZ PRZEŚLEDZIĆ") + `#section-dla-kogo h2` ("BRANŻE, KTÓRE OBSŁUGUJEMY") — inline 2.5rem now overridden to 1.6rem on phone, matching business section titles
- `.section-header-centered` — centered intent is desktop-only; mobile now `text-align: left !important` (applies to business o-nas "TRZY KROKI" + REKOMENDACJE label, plus any future centered headers)

### Why
- User: "te tytuły nadal mają zbyt duże czcionki - niespójne z resztą czcionek tytułów sekcji" (security)
- User: "TRZY KROKI DO AI W TWOJEJ FIRMIE - nagłówki sekcji wyśrodkowane, zamiast do lewej" (business o-nas)
- User: "// rekomendacje - wyśrodkowane zamiast do lewej" (business o-nas rekomendacje label)

---

## [0.499] — 2026-04-13

Mobile typography consistency pass — unified scale across all sections + critical bug fixes.

### Fixed
- **Horizontal swipe void** on mobile — `html, body { overflow-x: hidden; max-width: 100vw }` at `<=1023px` prevents accidental left-swipe revealing empty space
- **Hero photo on phone** — max-width 260px → 380px, properly centered (`margin: 1rem auto 0`)
- **Training image aspect ratio on phone** — fixed 360px height → `aspect-ratio: 16/9` (no more giant square images)
- **Module description > section title** — inverted hierarchy fixed. Phone: section-szkolenia-title 1.6rem, module-title 1.4rem, module-desc 0.9rem
- **Automatyzacje section title one-line** — 4rem → 1.75rem phone / 2.5rem tablet (PROCESY NA AUTOPILOCIE fits in 2 lines)
- **Tool card grid broken** — CSS was targeting `.tool-name`/`.tool-desc` but HTML uses `.tool-card-name`/`.tool-card-desc`. Fixed both selectors. Icon + title now on row 1, description spans full width row 2
- **Modal fonts too big** on phone — refactored main.js to use classes instead of inline font-size; applied mobile overrides (title 3.5rem → 1.5rem on phone, body 1.25rem → 0.95rem)
- **Jak działamy / Kontakt / Narzędzia / Strony inline H2** — inline-styled headlines now overridden on mobile via specific `#section-* h2` selectors with `!important` (1.6rem on phone)

### Added
- **Mobile typography system** (phone <=767 + tablet 768-1023 layers):
  - Hero headline: clamp(1.9-2.4) phone / 3.25 tablet
  - Section h2: 1.6 phone / 2-2.2 tablet
  - Section subtitle: 0.9 phone / 1.05 tablet
  - Module title: 1.4 phone / 2 tablet
  - Module desc: 0.9 phone / 1 tablet
  - Labels (// NAZWA): 0.65 phone
  - Modal: 1.5 phone / 2 tablet titles
- **Modal class refactor** (main.js): inline styles → `.modal-auto-*` + `.modal-training-*` classes
- **Container padding tighter on mobile**: 2rem → 1.25rem

### Changed
- Training image container `.section-szkolenia-compact .training-image-container` on phone: height auto + aspect-ratio 16/9 (was 360px fixed)
- Tool card phone layout: 2-row grid — icon + title row 1, desc full-width row 2
- Container-fluid padding 2rem → 1.25rem on non-desktop

### Why
- User feedback from real device: "opis szkolenia większą czcionką niż tytuł sekcji", "obrazy w szkoleniach za duże", "modale za duże czcionki", "boxy narzędzia źle sformatowane", "okno mobile daje się przesuwać w lewo", "zrób zestaw reguł css dla elementów strony aby zachować spójność"

### Desktop
Byte-identical to v0.498 (verified at 1280px: hero, modals, sections unchanged)

---

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
