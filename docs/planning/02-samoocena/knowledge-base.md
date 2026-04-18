# Knowledge Base: Cybersecurity Self-Assessment for Polish SMBs

Ten dokument stanowi fundament merytoryczny dla narzędzia samooceny cyberbezpieczeństwa (Self-Assessment Tool) skierowanego do polskiego sektora MŚP (Małe i Średnie Przedsiębiorstwa) oraz JDG (Jednoosobowe Działalności Gospodarcze), realizowanego pod marką **Ai Pulse Security**.

---

## 1. Regulatory Landscape (Poland + EU)

Polskie firmy z sektora MŚP znajdują się obecnie w "imadle regulacyjnym". Z jednej strony nie zawsze są bezpośrednio objęte najsurowszymi karami, z drugiej – stają się częścią łańcucha dostaw podmiotów kluczowych.

*   **NIS2 (Dyrektywa UE 2022/2555):**
    *   **Status w Polsce:** Trwają prace nad nowelizacją Krajowego Systemu Cyberbezpieczeństwa (KSC) – projekt UC12. 
    *   **Kogo dotyczy:** Firmy średnie (50+ pracowników / 10mln EUR obrotu) w sektorach kluczowych (energia, transport, bankowość, zdrowie) i ważnych (produkcja, spożywczy, odpady).
    *   **MŚP jako dostawcy:** Nawet jeśli firma ma 10 osób, jej klient (np. Orlen czy InPost) wymusi na niej standardy NIS2 w ramach audytów łańcucha dostaw.
*   **KSC (Krajowy System Cyberbezpieczeństwa) 2024-2025:**
    *   Wprowadza pojęcie "podmiotów kluczowych" i "ważnych". 
    *   Kluczowy nacisk na raportowanie incydentów do właściwego CSIRT (MON, MSWiA lub NASK) w ciągu 24h.
*   **RODO (GDPR):**
    *   Standard operacyjny. Samoocena musi weryfikować istnienie rejestru czynności przetwarzania i procedurę zgłaszania naruszeń do UODO.
*   **Wymagania Ubezpieczycieli (Cyber Insurance 2025):**
    *   Ubezpieczyciele w Polsce (PZU, Warta, Allianz) coraz częściej odmawiają polis cyber lub drastycznie podnoszą składki, jeśli firma nie wykaże: MFA, backupu offline i regularnych szkoleń.
*   **Standardy bazowe:**
    *   **ISO 27001:** Zbyt ciężkie dla małych firm, ale warto mapować pytania na jego aneksy.
    *   **CIS Controls v8:** Najlepszy fundament techniczny dla MŚP.
    *   **NIST CSF 2.0:** Zaktualizowany w 2024 o funkcję "Govern", idealny do strukturyzacji zarządzania.

---

## 2. Framework Comparison

| Framework | Coverage | Complexity | SMB Fit | Est. Questions |
| :--- | :--- | :--- | :--- | :--- |
| **CIS Controls (IG1)** | Wysokie (Tech) | Średnia | **Bardzo dobry** | 56 |
| **NIST CSF 2.0 (Quick Start)** | Pełne (Biz + Tech) | Średnia | Dobry | 30-40 |
| **ENISA SME Guide** | Podstawowe | Niska | Idealny dla JDG | 15-20 |
| **Cyber Essentials (UK)** | Tylko techniczne | Niska | Dobry (jako baseline) | 5-10 |

**Rekomendacja Ai Pulse:** Hybryda **CIS Controls Implementation Group 1 (IG1)** dla higieny technicznej oraz **NIST CSF 2.0** dla procesów zarządczych.

---

## 3. Similar Products (Benchmark Competition)

| Tool | Provider | Pros | Cons | Monetization |
| :--- | :--- | :--- | :--- | :--- |
| **PUM6 / Test Cyberbezpieczeństwa** | CERT Polska / NASK | Wysoki autorytet, darmowe. | Bardzo ogólne, brak raportu PDF "do ręki". | Free |
| **Ankieta Bezpieczeństwa** | Orange Cyberdefense | Dobre pytania techniczne. | Silnie nastawione na sprzedaż usług Orange. | Lead Gen |
| **CyberReadiness.org** | Global Cyber Alliance | Świetne materiały edukacyjne. | Mało kontekstu polskiego (prawo/KSC). | Free |
| **KIR Samoocena** | KIR (Sektor Bankowy) | Zaufana instytucja. | Skupienie głównie na sektorze finansowym/podpisie. | Free |

**Luka dla Ai Pulse Security:** Większość narzędzi jest albo zbyt prosta (marketingowe quizy), albo zbyt trudna (arkusze Excel). Brakuje "środka" – profesjonalnego audytu online z płatnym, certyfikowanym raportem PDF dla zarządu/ubezpieczyciela.

---

## 4. Recommended Question Structure

Rekomendujemy 40 pytań podzielonych na 5 kategorii.

### Przykładowe pytania (Example Questions)

```json
[
  {
    "category": "A. Ludzie (Awareness)",
    "question": "Jak często pracownicy Twojej firmy przechodzą szkolenia z zakresu rozpoznawania phishingu i bezpiecznej pracy?",
    "options": [
      {"text": "Nigdy lub rzadziej niż raz na dwa lata.", "score": 0},
      {"text": "Raz w roku, w formie prezentacji.", "score": 1},
      {"text": "Regularnie (min. co pół roku) + testy kontrolowanego phishingu.", "score": 3}
    ],
    "mapping": "CIS Control 14 / NIST PR.AT-01"
  },
  {
    "category": "B. Dane (Data Protection)",
    "question": "Czy firma posiada kopie zapasowe (backup) kluczowych danych, które są przechowywane poza siecią firmową (np. offline lub w chmurze z immutability)?",
    "options": [
      {"text": "Nie robimy backupu lub robimy go na pendrive/dysk podpięty do PC.", "score": 0},
      {"text": "Tak, backup robi się automatycznie, ale nie sprawdzamy czy działa.", "score": 1},
      {"text": "Tak, zgodnie z zasadą 3-2-1 i regularnie testujemy odtwarzanie danych.", "score": 3}
    ],
    "mapping": "CIS Control 11 / NIST PR.DS-01"
  },
  {
    "category": "C. Infrastruktura (Systems)",
    "question": "W ilu systemach firmowych (poczta, CRM, bankowość, VPN) wdrożone jest logowanie dwuetapowe (MFA)?",
    "options": [
      {"text": "W żadnym lub tylko w banku.", "score": 0},
      {"text": "W najważniejszych (poczta, VPN).", "score": 2},
      {"text": "Wszędzie, gdzie to technicznie możliwe.", "score": 3}
    ],
    "mapping": "CIS Control 6 / NIST PR.AA-03"
  },
  {
    "category": "D. Procesy (Governance)",
    "question": "Czy firma posiada spisany i przetestowany plan reagowania na incydenty (np. co zrobić w razie ataku Ransomware)?",
    "options": [
      {"text": "Nie, liczymy na dział IT/zewnętrznego informatyka.", "score": 0},
      {"text": "Mamy ogólne wytyczne, ale nie były testowane w praktyce.", "score": 1},
      {"text": "Tak, mamy jasną procedurę i listę kontaktów alarmowych.", "score": 3}
    ],
    "mapping": "CIS Control 17 / NIST RS.RP-01"
  },
  {
    "category": "E. Compliance (NIS2/RODO)",
    "question": "Czy firma weryfikuje poziom bezpieczeństwa swoich kluczowych dostawców IT/Cloud?",
    "options": [
      {"text": "Nie, ufamy dużym dostawcom.", "score": 0},
      {"text": "Sprawdzamy tylko zapisy w umowach.", "score": 1},
      {"text": "Wymagamy certyfikatów (np. ISO 27001, SOC2) lub ankiet bezpieczeństwa.", "score": 3}
    ],
    "mapping": "NIST GV.SC-01 / NIS2 Art. 21"
  }
]
```

---

## 5. Scoring Model

*   **Skala Punktowa:** Każde pytanie 0-3 pkt.
*   **Kategorie:** Suma punktów w kategorii / Max możliwych * 100.
*   **Waga Ogólna:**
    *   MFA & Backup: waga 2.0 (krytyczne).
    *   Reszta: waga 1.0.
*   **Poziomy Dojrzałości (Maturity Levels):**
    *   **0-25% Initial (Krytyczny):** Brak podstawowych zabezpieczeń. Wysokie ryzyko paraliżu firmy.
    *   **26-50% Developing (Podstawowy):** Są pewne narzędzia, brak procesów. Podatność na masowe ataki.
    *   **51-75% Managed (Stabilny):** Dobra higiena cyfrowa. Spełnia większość wymagań ubezpieczycieli.
    *   **76-100% Optimized (Lider):** Gotowość na NIS2, proaktywne podejście do ryzyka.

---

## 6. UX Patterns for Conversion

1.  **Chunking:** Podział na 5 sekcji po 8 pytań. Użytkownik widzi "Krok 1 z 5".
2.  **Immediate Gratification:** Po zakończeniu testu (przed mailem) pokaż "Szybki Wynik" (np. 45/100) i jeden wykres radarowy.
3.  **The "Tease" Factor:** "Twój najsłabszy punkt to: Backup. Pobierz raport, aby zobaczyć 3 kroki naprawcze".
4.  **Save-and-resume:** Użycie `localStorage` – jeśli zamknie kartę, po powrocie zaczyna w tym samym miejscu.
5.  **Brak bariery wejścia:** Test dostępny bez logowania. E-mail wymagany dopiero przy chęci otrzymania PDF lub szczegółowych benchmarków.

---

## 7. Data Collection for Benchmarks

Aby stworzyć funkcję "Twój wynik vs. średnia branży", należy zbierać:
*   Branża (Dropdown: Produkcja, IT, Handel, Usługi, Inne).
*   Wielkość firmy (1-10, 11-50, 51-250).
*   Odpowiedzi na pytania (zanonimizowane ID sesji).
*   **RODO:** Brak zbierania nazwisk/nazw firm przed formularzem kontaktowym. IP anonimizowane.

---

## 8. PDF Report Structure (Ai Pulse Branded)

1.  **Strona Tytułowa:** Wynik ogólny (Duża cyfra), data, kategoria dojrzałości.
2.  **Executive Summary:** Jednostronicowe podsumowanie dla właściciela (Ryzyko biznesowe, finanse).
3.  **Szczegółowa Analiza Kategorii:** Wykres radarowy (Twój wynik vs Branża).
4.  **Top 5 Rekomendacji:** Lista "To-Do" posortowana według priorytetu (Największy zysk bezpieczeństwa / Najniższy koszt).
    *   *Przykład:* "Włącz MFA w Microsoft 365 – Koszt: 0 PLN, Czas: 2h, Skuteczność: 99% przeciw przejęciom kont".
5.  **Mapa Zgodności:** Jak Twój wynik przekłada się na wymogi NIS2 i RODO.
6.  **Słownik pojęć i kontakt.**

---

## 9. Monetization & Lead Capture

*   **Free:** Wynik na ekranie + ogólne wskazówki.
*   **Paid PDF (One-off):** 199 PLN netto (promocja) / 349 PLN netto (standard).
    *   *Dlaczego płatne?* Dokument, który można załączyć do polisy lub przedstawić zarządowi.
*   **Technologia:**
    *   **Stripe:** Płatność kartą/BLIK.
    *   **Supabase:** Baza wyników i leadów.
    *   **Resend / SendGrid:** Wysyłka raportu.
    *   **Generowanie PDF:** Playwright (headless) lub biblioteka `react-pdf`.

---

## 10. Open Questions / Decisions

1.  **Audyt techniczny vs deklaratywny:** Czy dodajemy skrypt do sprawdzania np. nagłówków bezpieczeństwa domeny firmy (automatycznie), czy polegamy tylko na ankiecie? (Rekomendacja: na początku tylko ankieta).
2.  **Certyfikacja:** Czy raport Ai Pulse ma być sygnowany przez audytora z certyfikatem CISA/CISSP? (Zwiększa wartość PDF).
3.  **Partnerstwa:** Czy oferujemy zniżki na polisy ubezpieczeniowe po przejściu testu?
4.  **NIS2 Deadline:** Jak agresywnie komunikujemy nadchodzące kary w KSC? (Rekomendacja: edukacja, nie straszenie).
