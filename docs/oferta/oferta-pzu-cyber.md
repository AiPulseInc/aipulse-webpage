# Oferta PZU — Ubezpieczenie od ryzyk cybernetycznych

**Źródło:** 7 zrzutów ekranu z kalkulatora PZU (spotkanie Teams, 2026-04-17)
**Rozmówca:** Piotr Kaczorowski (PZU) ↔ Maciek
**Metoda odczytu:** vision z PNG (MinerU pipeline nie wyciągnął tekstu — screenshoty potraktowane jako obrazy czyste). **Wartości należy zweryfikować przy podejmowaniu decyzji — możliwe drobne błędy odczytu w kwotach.**

## Stała charakterystyka oferty

- **Produkt:** Ubezpieczenie od ryzyk cybernetycznych (PZU)
- **Warianty:** 3 (Wariant 1 / 2 / 3), różnią się sumą ubezpieczenia
- **Suma ubezpieczenia (standard):** 1 000 000 / 3 000 000 / 5 000 000 zł
- **Okres oczekiwania:** 8 godz (we wszystkich wariantach)
- **Udział własny:** 2 500 zł lub 7 500 zł (zależnie od progu przychodów — patrz tabela)

## Tabela składek rocznych wg progu przychodów

Parametrem, który różnicuje składkę, jest próg przychodów firmy. Wszystkie kwoty — składka roczna w zł.

| Próg przychodów | Wariant 1 (SU 1 mln) | Wariant 2 (SU 3 mln) | Wariant 3 (SU 5 mln) | Udział własny | Screenshot |
|---|---:|---:|---:|---:|---|
| do 1,5 mln zł | 1 245 | 1 540 | 2 358 | 2 500 zł | 12.55.38 (SU: 500k/1mln/3mln)* |
| 1,5 – 3 mln zł | 1 812 | 1 935 | 3 546 | 2 500 zł | 12.45.08 (SU: 500k/1mln/3mln)* |
| 3 – 5 mln zł (?) | 2 566 | 4 702 | 6 702 | 2 500 zł | 12.40.06 |
| 5 – 15 mln zł | 4 657 | 7 797 | 10 245 | 2 500 zł | 12.55.21 |
| 10 – 30 mln zł | 7 329 | 11 202 | 13 003 | 2 500 zł | 12.55.09 |
| 30 – 60 mln zł | 9 765 | 15 799 | 17 534 | 7 500 zł | 12.54.32 |
| 60 – 100 mln zł | 12 206 | 20 105 | 23 934 | 7 500 zł | 12.55.03 |

*Uwaga: przy najniższych progach sumy ubezpieczenia wariantów są niższe (500k / 1 mln / 3 mln) — nie 1/3/5 mln jak w pozostałych.

## Obserwacje

1. **Skok udziału własnego** między progiem 10–30 mln a 30–60 mln: z 2 500 zł do 7 500 zł. Dla AiPulse (JDG / małe MŚP) bez znaczenia, ale warto pamiętać przy ofertach dla większych klientów.
2. **Najtańszy wariant** (1 245 zł / rok, SU 500k) dla firm z przychodami do 1,5 mln zł — to realny pułap dla większości klientów AiPulse (MŚP i JDG).
3. **Pokrycie 3 mln za 2 358 zł/rok** przy przychodach do 1,5 mln — sensowna opcja jako upsell w pakiecie szkolenie AI + polisa cyber.
4. **Brak informacji w zrzutach o:**
   - zakresie przedmiotowym (co konkretnie polisa pokrywa — incydenty ransomware, wycieki, BEC, etc.)
   - wyłączeniach
   - wymaganiach bezpieczeństwa (czy klient musi mieć MFA, backupy, EDR?)
   - procesie zgłoszenia szkody
   - asysty technicznej (czy jest incident response partner?)

## Follow-up do Piotra (PZU)

Do dopytania przed rekomendacją dla klientów AiPulse:

- [ ] Zakres przedmiotowy — pełna lista pokrytych zdarzeń
- [ ] Wyłączenia (typowo: brak patchy, zaniedbania admina, insider threat)
- [ ] Wymagania minimalne bezpieczeństwa do zawarcia polisy
- [ ] Czy jest partner do incident response? Kto i na jakich warunkach?
- [ ] Prowizja/afiliacja dla AiPulse jeśli polecamy produkt klientom po szkoleniu
- [ ] Materiały marketingowe do udostępnienia klientom

## Artefakty

- Źródłowe PNG: `docs/oferta/Screenshot 2026-04-17 at *.png`
- MinerU output (pusty, pipeline nie trafił w tekst): `docs/oferta/.mineru/`
- Ten dokument: `docs/oferta/oferta-pzu-cyber.md`
