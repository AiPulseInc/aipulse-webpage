# Plan: Update cennika Ai Puls Security

## Context

Analiza rynku ([gemini-benchmark.md](./gemini-benchmark.md)) pokazała, że obecne ceny i czasy realizacji są **znacząco zaniżone** vs polski rynek 2025:

- **Day rate senior audytora PL**: 2000-3500 zł netto B2B
- **Konkurencja** (Niebezpiecznik, Securitum, LogicalTrust, Cyberforces): min 7-10k za podstawowy audyt
- **Ai Puls Basic** 3500 zł za 2-3 dni = day rate ~1400 zł (dumping, strata)
- **Ai Puls Premium** 10000 zł za 14 dni + 40h wsparcia = ~65 zł/h (poniżej junior programisty)

Cel zmian: urealnić marżę bez rezygnacji z pozycji "dostępny dla MŚP". Zachować Basic jako lead magnet, zdecydowanie podnieść Rozszerzony i Premium, dodać vCISO jako recurring revenue.

## Nowa struktura cennika

### Pakiety audytu

| Pakiet | Obecnie (zł netto) | **Nowa cena** | Czas obecny | **Nowy czas** | Rationale |
|---|---|---|---|---|---|
| **Samoocena online** | bezpłatna | **bezpłatna** (bez zmian) | natychmiast | bez zmian | Lead magnet, 40 pytań, wynik na ekranie |
| **Samoocena PDF** | 99 zł brutto | **149 zł brutto** | — | — | Mid-range między dumpingiem a wartością; ~120 zł netto margin po Stripe fees |
| **Basic** | 3 500 - 5 000 | **5 500 - 7 000** (od 5 500) | 2-3 dni | **3-5 dni** | Podniesienie z 3.5 do 5.5k = +57%. Rynkowy floor (Cyberforces od 8k, CyberArms od 5k). Czas wydłużony o ~2 dni (realistyczny dla firmy 20-50 os). |
| **Rozszerzony** | 7 000 - 10 000 | **12 000 - 16 000** (od 12k) | 5-7 dni | **7-10 dni** | +70% vs aktualna. Rynek: LogicalTrust 7-20k, Securitum 15-35k. 60-element NIS2 assessment = min 8 dni pracy. |
| **Premium** | 12 000 - 18 000 | **25 000 - 35 000** (od 25k) | 2 tyg + 3 mies wsparcia | **3 tyg audyt + 3 mies vCISO (4h/mies)** | +100% vs aktualna. Obecna cena sugerowała dumping. 40h wsparcia = tydzień pracy senior = min 12k samo. Clear premium positioning. |
| **NEW: vCISO Subscription** | — | **4 500 - 6 500/mies** netto | — | stały kontrakt 6-12 mies | Recurring revenue, highest margin, najbardziej przywiązuje klienta. Rynek: 5-10k/mies w PL. |

### Mnożnik wielkości firmy

Dotąd flat pricing — brak sensu dla 250-os firmy. Wprowadzamy **mnożnik skali**:

| Wielkość firmy | Mnożnik |
|---|---|
| 1-50 osób | ×1.0 (cena bazowa) |
| 51-150 osób | **×1.5** |
| 151-250 osób | **×2.0** |

Dla Premium 25k → 150 os = 37.5k, 250 os = 50k. Klarownie komunikowane: "cena bazowa dotyczy firm do 50 osób; większe firmy = wycena indywidualna".

### Komponenty dodane

1. **Phishing simulation** (1 kampania) — dodane do Rozszerzonego (value buildup: "zobaczyłem, kto klika")
2. **Incident Response Playbook template** — dodane do Premium (wartość operacyjna)
3. **Tabletop exercise** (scenariusz reakcji na incydent) — opcjonalne +3k do Premium

## Copy changes na stronie

### 1. `security/index.html` — pricing cards (line 397-480)

Zmiany WIDOCZNE NA KARTACH (nie tylko w modalach):

**Basic card** (line 422-441):
```html
<div class="pricing-card-name">Audyt Podstawowy</div>
<div class="pricing-card-price">od <strong>5 500 zł</strong> netto</div>  <!-- NEW: price on card -->
<p class="pricing-card-desc">Szybka diagnoza — skan podatności, przegląd polityk, raport z rekomendacjami. <strong>3-5 dni roboczych</strong> · audyt zdalny.</p>
```

**Rozszerzony card** (line 443-461):
```html
<div class="pricing-card-name">Audyt Rozszerzony</div>
<div class="pricing-card-price">od <strong>12 000 zł</strong> netto</div>
<p class="pricing-card-desc">Kompleksowa ocena NIS2/KSC + analiza luk pod ubezpieczenie cyber + <strong>symulacja phishingu</strong>. 7-10 dni roboczych.</p>
```

**Premium card** (line 463-480):
```html
<div class="pricing-card-name">Audyt Premium + vCISO</div>  <!-- NEW: name expanded -->
<div class="pricing-card-price">od <strong>25 000 zł</strong> netto</div>
<p class="pricing-card-desc">Pełny cykl — audyt (3 tyg) + 3 miesiące vCISO (4h/mies) + re-audyt po 6 mies. Gotowy pod ISO 27001.</p>
```

**Samoocena PDF button** — update `#contact` CTA label → `Pobierz PDF (149 zł)` po wdrożeniu narzędzia

### 2. Nowa sekcja na dole oferty — size multiplier + vCISO

Dodać pod pricing-grid (przed `.pricing-footnote`):

```html
<div class="pricing-scaling-note">
  <div class="text-xs" style="color: var(--brand-accent);">// FIRMA POWYŻEJ 50 OSÓB?</div>
  <p>Ceny bazowe dotyczą firm do 50 pracowników. Większe organizacje wyceniamy indywidualnie:
  <strong>51-150 osób ×1.5</strong>, <strong>151-250 osób ×2.0</strong>. Powód: skan 250 endpointów + wywiady z 8 działami = 3× więcej roboczogodzin niż firma 20-osobowa.</p>
</div>

<div class="pricing-card pricing-card-vciso">
  <div class="pricing-card-label">_04 · vCISO</div>
  <div class="pricing-card-name">Virtual CISO</div>
  <div class="pricing-card-price"><strong>4 500 zł / mies</strong> netto</div>
  <p class="pricing-card-desc">Stały kontakt z Twoim zespołem — 8h miesięcznie, priorytetyzacja zagrożeń, odpowiedzialność za compliance bez zatrudniania CISO na etat.</p>
  <a href="#contact" class="pricing-card-cta pricing-card-cta-outline">Umów rozmowę</a>
  <div class="pricing-card-features">
    <div class="pricing-card-features-label">Co zawiera</div>
    <ul>
      <li>8h/mies pracy senior security (do wykorzystania elastycznie)</li>
      <li>Miesięczny raport ryzyka + plan 30 dni</li>
      <li>Reprezentacja w audytach klientów/ubezpieczycieli</li>
      <li>Priorytet w incydentach (2h SLA odpowiedzi)</li>
    </ul>
  </div>
</div>
```

### 3. `src/security-data.js` — modal data updates (line 3-38)

```js
// Basic
outcome: 'Jasny obraz luk bezpieczeństwa + plan pierwszych działań. Cena: od 5 500 PLN netto (firmy do 50 os).',
format: '3-5 dni roboczych · audyt zdalny · 2h zaangażowania Twojego zespołu',

// Rozszerzony
outcome: 'Spełnione 80% wymagań cyber-ubezpieczeń + wynik kampanii phishingu. Gotowa dokumentacja do negocjacji polisy. Cena: od 12 000 PLN netto.',
format: '7-10 dni roboczych · audyt zdalny + 1 wizyta on-site · 4h zespołu + 1 kampania phishingu',
benefits: [
  'Wszystko z pakietu BASIC',
  'Ocena ryzyka zgodnie z NIS2/KSC (60-elementowa lista kontrolna)',
  'Testy konfiguracji kluczowych systemów (Office 365, backup, firewall, MFA)',
  'Analiza luk — co brakuje do spełnienia wymagań ubezpieczyciela',
  'Plan działań z szacunkami kosztów i harmonogramem wdrożenia',
  '**NEW**: 1 kampania phishing simulation (100 pracowników, raport klikowalności + podatności)',
],

// Premium
outcome: 'Pełna zgodność NIS2 + 3 miesiące vCISO + dokumentacja pod ubezpieczenie. Cena: od 25 000 PLN netto.',
format: '3 tygodnie audyt + 3 miesiące vCISO (4h/mies) + re-audyt · hybrid',
benefits: [
  'Wszystko z pakietu ROZSZERZONY',
  '**NEW**: 3 miesiące vCISO — 4h/miesiąc konsultacji security',
  '**NEW**: Incident Response Playbook (gotowy dokument)',
  'Szkolenie security awareness dla zespołu (2h online)',
  'Re-audyt po 6 miesiącach — potwierdzenie, że zmiany działają',
  'Dokumentacja gotowa pod ISO 27001 (opcjonalna ścieżka certyfikacji)',
],

// NEW: vCISO (4)
4: {
  title: 'Virtual CISO',
  category: '_04 // vCISO',
  audience: 'Firmy 30-150 osób bez dedykowanego CISO. Potrzebujesz kogoś kto bierze odpowiedzialność za security bez kosztu 20k/mies etatu.',
  benefits: [
    '8h miesięcznie elastycznej pracy senior security',
    'Miesięczny Executive Report dla zarządu',
    'Reprezentacja podczas audytów klientów i ubezpieczycieli',
    'Priorytet 2h SLA odpowiedzi w razie incydentu',
    'Kwartalny przegląd strategii security vs budżet',
  ],
  format: 'Stały kontrakt 6-12 miesięcy · praca zdalna + 1 wizyta on-site/kwartał · dedykowany kontakt',
  outcome: 'Wewnętrzne "mam CISO" bez kosztu etatu. Cena: 4 500 zł/mies netto (firma do 50 os), 6 500 zł/mies (50-150 os).',
},
```

### 4. Samoocena card label change (line 405-420)

Zmienić copy żeby jasno wskazać flow free → paid PDF:
```html
<div class="pricing-card-name">Online · Bezpłatna</div>
<p class="pricing-card-desc">Kwestionariusz 35 pytań, wynik na ekranie w 5 kategoriach. Pełny raport PDF z rekomendacjami — <strong>149 zł brutto</strong>.</p>
<a href="/bezpieczenstwo-samoocena/" class="pricing-card-cta">Zrób test (6 min)</a>
```

## CSS additions

Dodaj `.pricing-card-price` do `style.css` (podobne do `.pricing-card-name`):

```css
.pricing-card-price {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.95rem;
  color: var(--brand-accent);
  margin-bottom: 1rem;
  letter-spacing: 0.02em;
}

.pricing-card-price strong {
  font-size: 1.3rem;
  color: #111;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.pricing-scaling-note {
  margin-top: 3rem;
  padding: 1.5rem 2rem;
  border: 1px solid var(--border-color);
  background: #FAFAFA;
}

.pricing-scaling-note p {
  color: #444;
  line-height: 1.55;
  font-size: 0.95rem;
  margin: 0.5rem 0 0;
}

.pricing-card-vciso {
  margin-top: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  background: #0A0A0A;
  color: #FFF;
  border: 2px solid var(--brand-accent);
}

.pricing-card-vciso .pricing-card-name,
.pricing-card-vciso .pricing-card-desc,
.pricing-card-vciso .pricing-card-features-label {
  color: #FFF;
}

.pricing-card-vciso .pricing-card-price strong {
  color: var(--brand-accent);
}
```

## Rollout — 2 commity

### Commit 1: Price update + copy (low-risk)
- `security/index.html`: prices added to cards, Rozszerzony mentions phishing, Premium renamed Premium + vCISO
- `src/security-data.js`: audytyData outcomes + format updated for Basic/Rozszerzony/Premium, + vCISO dodane jako modal 4
- `style.css`: `.pricing-card-price` rule added

**Nie dodaje** vCISO jako osobnej karty jeszcze — tylko jako modal content (modalne przez szczegóły).

### Commit 2: vCISO + scaling note (if user approves)
- HTML: `.pricing-scaling-note` + `.pricing-card-vciso` sections po pricing-grid
- CSS: styling for vCISO card + scaling note
- Nav: może dodać anchor `#vciso` (opcjonalne)

## Open questions dla Ciebie

1. **Cena Premium** — 25k to Gemini baseline. Ja bym jednak poszedł **28k** (bliżej środka 25-35k range), co daje clear "premium positioning" bez strachu u małych klientów. Decyzja?

2. **vCISO osobny pakiet** — wprowadzamy teraz jako 5-ta karta (Commit 2), czy odkładamy do osobnej sekcji "Stała współpraca"?

3. **Ceny na kartach** — pokazujemy "od X zł netto" wprost, czy ukrywamy (jak teraz) i forcujemy do modalu "Zobacz szczegóły"? Publiczna cena = wyższa konwersja ale mniej przestrzeni negocjacyjnej.

4. **Size multiplier** — komunikujemy OTWARCIE (jak w planie) czy "cena od" + "wycena dla większych firm"? Pierwsze transparentne, drugie bardziej korpo.

5. **Phishing simulation** — obecnie w planie dodajemy do Rozszerzonego bez zmiany ceny (value add). Alternatywa: dedykowany pakiet "Phishing+" za 2.5k osobno. Co preferujesz?

6. **Samoocena PDF** — 99 → 149 zł. Czy 149 jest OK, czy wolisz 199 (bliżej KB rekomendacji 199 PLN)?

## Verification

- Po zmianach: manualne testowanie modalu na desktop + phone
- Commit 2 (vCISO card) wymaga mobile regression check (obecnie 4 karty w grid → może 5? Dla mobile ladder OK, desktop 4-col + 1 subkarta poniżej)
- Sprawdzić contrast cen na kartach — `var(--brand-accent)` + `#111` na `#FAFAFA` bg (Basic/Rozszerzony/Premium)

## Referencje

- Research: [gemini-benchmark.md](./gemini-benchmark.md)
- Knowledge base samoocena: [../02-samoocena/knowledge-base.md](../02-samoocena/knowledge-base.md) (cena sugerowała 199-349 zł)
- Current pricing card HTML: [../../../security/index.html](../../../security/index.html) (lines 395-485)
- Current modal data: [../../../src/security-data.js](../../../src/security-data.js) (lines 3-38)

---

**Ważne**: Ten plan jest **konserwatywny** — nawet po podwyżkach Ai Puls pozostaje **najtańszym** graczem na rynku PL dla MŚP. Risk podwyżki: -10% konwersji z tańszych leadów. Benefit: +60% marży na jednym projekcie. Matematyka wygrywa przy 5+ projektach rocznie.
