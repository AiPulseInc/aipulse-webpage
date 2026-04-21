# Strategia certyfikacji Ai Pulse Cyber Security

> **Status (2026-04-21):** W trakcie — CompTIA Security+ i DEKRA Audytor SZBI wg ISO 27001:2022.
> **Następny krok (po domknięciu powyższych):** rozważenie CISA jako senior audit credential.
> **Dokument powstał:** 2026-04-21, na bazie research'u CompTIA Security+ vs ISACA CISA.

## Kontekst decyzji

Pozycjonowanie Ai Pulse: **"Lead Security Auditor" dla MŚP 10-250 os.** Produkt: audyty bezpieczeństwa, pre-audit ISO 27001, zgodność NIS2/RODO, raporty dla brokerów cyber insurance i compliance officerów.

Pytanie, które zapoczątkowało tę analizę: czy CompTIA Security+ (w trakcie) jest trafnym wyborem, czy **CISA (Certified Information Systems Auditor, ISACA)** byłby bardziej wartościowy dla roli audytora?

Wniosek: **CISA > Security+ dla Ai Pulse specifically**, ale jako kolejna faza — nie zamiast Security+. Docelowy stack = Security+ + CISA + DEKRA Audytor SZBI (ISO 27001). Szczegóły niżej.

---

## Porównanie CompTIA Security+ vs ISACA CISA

### Krótki charakter

- **CompTIA Security+** — entry/mid-level cert pokazujący techniczne fundamenty IT security (sieci, kryptografia, zarządzanie ryzykiem, kontrola dostępu, reagowanie). Standard wejściowy w branży. Neutralny produktowo.
- **CISA (ISACA)** — senior-level cert dedykowany **audytorom systemów informatycznych**. Literalnie "Certified Information **Systems Auditor**". Od 1978, ponad 200 000 posiadaczy globalnie. Standard de facto w enterprise IT audit.

### Tabela porównawcza

| Wymiar | CompTIA Security+ | CISA (ISACA) |
|---|---|---|
| Poziom | Entry-mid (junior-mid specialist) | Senior (audit lead / manager) |
| Focus | Techniczne bezpieczeństwo IT (general) | **IT audit methodology + governance + compliance** |
| Wymóg doświadczenia | 2 lata IT security (rekomendowane) | **5 lat IS audit exp** (w 10-letnim oknie; redukcja do 3-4 lat za edukację/inne certy) |
| Egzamin | 90 min, ~90 pytań, SY0-701 | 4h, 150 pytań, 5 domen |
| Koszt egzaminu | ~$400 | $575 (ISACA member) / $760 (non-member) |
| Roczne koszty utrzymania | ~$150 CEU materiały | ~$135 ISACA + ~$30 chapter + ~$45 maintenance ≈ **$210/rok** |
| Ważność | 3 lata (recert przez 50 CEU lub egzamin) | Permanentna + **120 CPE/3 lata** + roczny fee |
| Recognition | DoD 8570.01-M, FISMA, ISO 17024 | **ANSI/ISO/IEC 17024**, wymagany/premiowany w Big 4, bankowości, ubezpieczeniach cyber, Fortune 500 |
| Domeny (2026) | Threats/Vulns, Architecture, Operations, Governance | 1. Audit Process (18%), 2. Governance & Mgmt IT (18%), 3. Acquisition/Dev (12%), 4. Operations & Business Resilience (26%), 5. Protection of Info Assets (26%) |
| Znajomość w PL MŚP | Wysoka (każdy junior zna) | Średnia wśród MŚP, **wysoka wśród enterprise/insurance/banking** |
| Prestige / wyróżnienie | Wszędzie występuje — nie wyróżnia | **Wyróżnia** — w PL ~kilka tysięcy posiadaczy, w MŚP-audit segmencie rzadkość |

---

## Perspektywa Ai Pulse — dlaczego CISA lepszy

1. **Dopasowanie do roli** — literalnie "IT Systems **Auditor**". CompTIA Security+ nie ma słowa "audit" w nazwie. Czytelny sygnał dla klienta: "robi audyty" vs "rozumie bezpieczeństwo ogólnie".
2. **Domeny CISA = dokładnie to co Ai Pulse robi** — Audit Process (planowanie/evidence/reporting), Governance (NIS2/RODO), Protection of Info Assets. Security+ to general ICT.
3. **Wiarygodność u ubezpieczycieli cyber** — CISA jest de-facto standardem recognized przez underwriterów. Security+ nie jest.
4. **Scarcity w polskim segmencie MŚP-audit** — Security+ ma "każdy juniorek"; CISA w PL to kilka tysięcy osób, w niszy audytu dla MŚP rzadkość. Realne wyróżnienie vs konkurencja.
5. **Długoterminowa ścieżka** — CISA to "senior credential", naturalne wejście do większych audit engagements (także dla cyber insurance, compliance).

### Minusy CISA (uczciwie)

1. **Koszt i bariery** — 5 lat doświadczenia (formalna weryfikacja przez sponsorów), ~$760 egzamin + ~$210/rok indefinitely, 120h CPE. Realne zobowiązanie finansowe/czasowe.
2. **Dla małego MŚP klient nie zna** — właściciel firmy 15-osobowej z dużym prawdopodobieństwem nie wie co to ISACA. Wartość CISA rośnie w segmencie 51-250+ i u partnerów (brokerzy, agencje).
3. **Fokus enterprise-ish** — Domain 2 (Governance), Domain 4 (Business Resilience) są ciężkie w kierunku dużych organizacji. Dla 11-50 os. aplikuje się je w uproszczonej formie.
4. **CPE burden** — 40h rocznie na konferencje/szkolenia ≈ 1 tydzień pracy/rok pochłonięte.

---

## Decyzja (2026-04-21)

### Faza 1 — **W trakcie**

- [x] Dokończyć **CompTIA Security+** (fundament techniczny, sunk cost, 2 lata exp → OK)
- [x] Dokończyć **DEKRA Audytor SZBI wg ISO/IEC 27001:2022** (standard alignment, już w trakcie / blisko domknięcia)

### Faza 2 — **Zobaczymy po domknięciu Fazy 1**

- [ ] Rozważenie **CISA (ISACA)** — kierunek senior audit credential, ~12-24 mies projekt (exp + przygotowanie + egzamin + aplikacja)
- [ ] Alternatywnie / równolegle: **ISO 27001 Lead Auditor** (DEKRA lub BSI) jako upgrade z Internal Auditor — daje prawo prowadzenia audytów certyfikacyjnych jako audytor zewnętrzny (nowa linia produktu dla Ai Pulse: pełny audyt certyfikacyjny ISO 27001, nie tylko pre-audit)

---

## Docelowy stack certów (po Fazie 2)

| Cert | Rola w pozycjonowaniu Ai Pulse |
|---|---|
| CompTIA Security+ | Techniczny fundament — "znam to co audytuję" |
| **CISA (ISACA)** | **Methodology audytowa + governance — "wiem jak audytować"** |
| DEKRA Audytor SZBI wg ISO 27001:2022 | Standard alignment — "audyt zgodny z normą" |
| *(opcjonalnie)* ISO 27001 Lead Auditor | External audit authority — rozszerzenie oferty o pełne audyty certyfikacyjne |

Stack silniejszy niż sam CISA — pokazuje **zarówno** technical competence, **jak i** audit methodology, **i** konkretny standard (ISO 27001).

---

## Źródła

- ISACA CISA: [isaca.org/credentialing/cisa](https://www.isaca.org/credentialing/cisa)
- CISA Exam Content Outline (5 domen): [isaca.org/credentialing/cisa/cisa-exam-content-outline](https://www.isaca.org/credentialing/cisa/cisa-exam-content-outline)
- CompTIA Security+ (PL dystrybutor): [certyfikatit.pl/modules/comptia-security/](https://certyfikatit.pl/modules/comptia-security/?course_id=2304)
- DEKRA Audytor Wewnętrzny SZBI ISO 27001: [szkolenia.dekra.pl/…audytor-wewnetrzny…](https://szkolenia.dekra.pl/szkolenia/audytor-wewnetrzny-systemu-zarzadzania-bezpieczenstwem-informacji-iso-27001)
- Scraped references: `/tmp/cisa-isaca.md`, `/tmp/cisa-domains.md`, `/tmp/comptia-secplus.md`, `/tmp/dekra-audytor-wewnetrzny.md` (tmp — regenerowalne przez firecrawl)
