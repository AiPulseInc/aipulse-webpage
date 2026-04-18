# Wymogi PZU — Ubezpieczenie od ryzyk cybernetycznych

**Źródło:** 6 zrzutów ekranu z kwestionariusza oceny ryzyka PZU (spotkanie Teams, 2026-04-17)
**Metoda odczytu:** MinerU OCR (latin) + vision z PNG. MinerU wyłapał część tekstu, ale z fragmentami zepsutymi przez niską rozdzielczość screenshotów.
**Uwaga:** drobny tekst jest miejscami nieczytelny — przy zawieraniu polisy należy pracować z pełnymi OWU i formularzem bezpośrednio w mojaFirma PZU.

## Kontekst

Formularz "Oferta. Ubezpieczenie od ryzyk cybernetycznych" → sekcja **"Odpowiedz na pytania"** → oświadczenia TAK/NIE jako warunek dostępu do polisy. Finalny przycisk: **DALEJ**. Link: *Regulamin świadczenia usług drogą elektroniczną serwisu mojaFirma PZU*.

## Lista wymogów (oświadczenia TAK/NIE)

### Sekcja 1 — podstawowe

1. **Czy przychody ubezpieczającego za ostatni rok obrotowy to mniej niż 100 mln zł?**
2. **Czy ubezpieczający i ubezpieczony to podmioty, które mają siedzibę w Polsce?**

### Sekcja 2 — "Ubezpieczony oświadcza, że:"

3. **Nie prowadzi działalności w zakresie:**
   - przemysłu rozrywki dla dorosłych
   - wytwarzania/przetwarzania [produktów energetycznych/chemicznych — tekst nieczytelny]
   - produkcji/dystrybucji broni, amunicji, materiałów wybuchowych
   - energii jądrowej, biotechnologii
   - kancelarii prawnych / doradztwa prawnego
   - finansowania sporów sądowych
   - instytucji kościelnych
   - wydobycia/przetwarzania paliw kopalnych
   - elektrowni węglowych
   - poszukiwania źródeł energii w Arktyce

4. **Nie posiada powiązań finansowych lub umownych z podmiotami zlokalizowanymi na terytorium Białorusi, Rosji lub Ukrainy.**

5. **Przychód z USA za ostatni rok obrotowy nie stanowi ponad 25% całości rocznych przychodów.**

6. **Nie osiąga przychodów generowanych przez spółki zależne lub zagraniczne.**

7. **Przetwarza, zbiera, przechowuje mniej niż 250 000 rekordów danych osobowych rocznie.**

8. **Nie jest firmą [pożyczkową lub firmą pożyczkową]** *(tekst częściowo nieczytelny — prawdopodobnie wyłączenie branży pożyczkowej/parabankowej)*

### Sekcja 3 — wymogi bezpieczeństwa IT

9. **Stosuje — przystosowane do [skali] komercyjnego — aktywne zapory sieciowe (firewall) na wszystkich zewnętrznych granicach sieciowych oraz aktywną aplikację antywirusową**, w celu [minimalizacji zagrożeń] na serwerach i punktach końcowych.

10. **[Firma] lub jej dostawca usług w chmurze wykonuje kopie zapasowe danych do izolowanego środowiska co najmniej co 7 dni i trzyma je co najmniej [365 dni / ok. rok].**

11. **Zabezpiecza zdalny dostęp do sieci za pomocą uwierzytelniania wieloskładnikowego (min. 2FA).**

12. **Instaluje krytyczne poprawki oprogramowania w ciągu 30 dni od ich wydania.**

13. **Zachowuje — jeśli go dotyczy — standardy branży kart płatniczych (PCI DSS).**

### Sekcja 4 — historia szkodowa

14. **Nie ma w [ostatnich] szkoleniu z ostatnich 36 miesięcy [okoliczności], które mogą spowodować jakiekolwiek straty lub roszczenia, ani nie znane mu są żadne skargi/roszczenia [związane z incydentami cybernetycznymi].**
    *Tekst długi, częściowo nieczytelny — chodzi o oświadczenie o braku incydentów/roszczeń w ciągu ostatnich 36 miesięcy.*

## Interpretacja dla AiPulse

**Target AiPulse to MŚP/JDG (przychody do 1,5 mln zł)** — większość wymogów technicznych (firewall, antywirus, MFA, patche w 30 dni, backupy 7 dni / retention rok) to **minimum higieniczne, które trzeba umieć wdrożyć zanim klient kupi polisę**.

### To jest naturalny content marketing dla Ai Puls Security:

| Wymóg PZU | Co oferujesz jako szkolenie/checklist |
|---|---|
| Firewall + antywirus na endpointach | "Minimum bezpieczeństwa IT dla JDG/MŚP" |
| Backup co 7 dni / retention rok / izolacja | "Backup 3-2-1 w praktyce — bez enterprise budżetu" |
| MFA na zdalnym dostępie | "MFA w 30 minut — Google/Microsoft/Bitwarden" |
| Patche w 30 dni | "Proces patchowania dla firmy bez admina" |
| 36 miesięcy bez incydentów | "Jak NIE kliknąć w phishing — dla zespołu" |

**Pomysł:** blog post / landing z **checklistą "Czy kwalifikujesz się na ubezpieczenie cyber PZU?"** — lead magnet. Każdy punkt → link do odpowiedniego modułu szkoleniowego AiPulse.

### Wykluczenia branżowe (Sekcja 2, p. 3)

Lista wykluczeń jest **informacyjnie cenna** — pokazuje, które branże PZU uznaje za zbyt ryzykowne. Dla AiPulse to filtr targetowania: **nie warto zagęszczać lejka leadów z wykluczonych branż**, bo po szkoleniu i tak nie dostaną polisy cyber od PZU.

## Follow-up do Piotra

- [ ] **Pełna lista wykluczeń branżowych** w czytelnej formie (mamy mniej więcej, ale fragmenty rozmyte)
- [ ] **Dokładny wymóg backupu**: 7 dni między kopiami + retention ile? (odczytałem "365 dni" — potwierdzić)
- [ ] **Jakie 2FA liczy się jako 2FA** — SMS też, czy tylko TOTP/hardware?
- [ ] **Co PZU rozumie przez "izolowane środowisko backupu"** — czy chmura typu Backblaze/Wasabi wystarcza, czy wymagają offline/immutable?
- [ ] **Definicja "krytycznych poprawek"** — CVSS score, kategoria CERT, czy własne kryterium?
- [ ] **Jak PZU weryfikuje oświadczenia** — self-declaration czy audyt? Co grozi za fałszywe TAK przy szkodzie?
- [ ] **Pełny tekst pytania 8** (firma pożyczkowa?) i **pytania 14** (historia szkodowa — zakres czasowy, co się liczy jako incydent)

## Artefakty

- Źródłowe PNG: `docs/wymogi/Screenshot 2026-04-17 at *.png`
- MinerU output (częściowy, fragmentaryczny): `docs/wymogi/.mineru/`
- Ten dokument: `docs/wymogi/wymogi-pzu-cyber.md`
- Powiązany: `docs/oferta/oferta-pzu-cyber.md` (tabela składek)
