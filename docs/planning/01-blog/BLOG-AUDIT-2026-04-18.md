# Blog Audit — Zgodność postów z pięcioma bramami

**Data audytu:** 2026-04-18 (stan wyjściowy)
**Data rewrite'u:** 2026-04-18 (sprint zamknięty)
**Zakres:** 6 postów opublikowanych na `/security/blog/` + nowy post CERT jako referencja
**Reguły:** [blog-post-guide.md](./blog-post-guide.md) — pięć bram contentowych
**Cel:** spójny język komunikacji, identyfikacja rozjazdów, plan pracy

---

## 0. Stan po sprincie (rescore, 2026-04-18)

Wszystkie 6 postów przerobionych w jednej sesji (2026-04-18). Brama 5 dodana w trakcie, po znalezieniu meta-komentarza w CERT post, i zastosowana retroaktywnie.

Legenda: 🟢 zgodne / 🟡 częściowo / 🔴 naruszenie

| # | Post | B1 | B2 | B3 | B4 | B5 | Sprint |
|---|------|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | mity-cyberbezpieczenstwa-msp | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | P2 ✅ done |
| 2 | supply-chain-npm-atak-msp | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | P2 ✅ done |
| 3 | ai-phishing-2026-deepfake | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | P1 ✅ done (Brama 5 fix: „Ten post nie jest katalogiem narzędzi" → „Zanim zastanowisz się nad narzędziami…") |
| 4 | backup-321-praktyczny-setup-msp | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | P0 ✅ done (pełny rewrite; Brama 5 fix: „Ten post nie jest listą zakupów" → teza pozytywna o backupie w kontekście firmy) |
| 5 | ubezpieczenie-cyber-underwriter-2026 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | P1 ✅ done |
| 6 | wyciek-sklepow-polska-130k-2026 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | P3 ✅ done |
| 7 | list-od-cert-polska-dmarc-msp (ref) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | — (Brama 5 fix: usunięto „anonimizowany cytat", „Cytuję bezpośrednio z maila, podmieniając…", sekcję „To, czego nie napiszę w tym poście") |

**Jednym zdaniem:** cały portfel bloga przeszedł pod wszystkie 5 bram, wszystkie 3 meta-komentarze redakcyjne usunięte.

**Otwarte pozycje po sprincie:**
- Cover dla `backup-321-praktyczny-setup-msp` — nadal używa `/generated/security/selfcheck.jpg` (z self-check, nie pasuje). Wymaga generacji dedykowanego covera przez Gemini Nano Banana.
- Smoke test (`npm run dev` + kliknięcie wszystkich linków wewnętrznych) — do zrobienia przed commitem.

---

## Sekcja historyczna — stan wyjściowy (przed rewrite'ami, 2026-04-18 rano)

Poniższa analiza jest snapshotem sprzed sprintu, zachowana jako dokumentacja rozjazdów, wzorców i rekomendacji, które w sprincie zostały wykonane. Scoring i rekomendacje w sekcjach 1-6 odnoszą się do stanu przed rewrite'ami.

---

## 1. Matryca zbiorcza

Legenda: 🟢 zgodne / 🟡 częściowo / 🔴 naruszenie

| # | Post | B1 Realia<br/>(aipulse.pl) | B2 Język<br/>MŚP | B3 Dyscyplina<br/>CTA | B4 Osadzenie<br/>w źródłach | Priorytet |
|---|------|:---:|:---:|:---:|:---:|:---:|
| 1 | mity-cyberbezpieczenstwa-msp | 🔴 | 🟡 | 🟡 | 🟡 | P2 |
| 2 | supply-chain-npm-atak-msp | 🔴 | 🟡 | 🟡 | 🟡 | P2 |
| 3 | ai-phishing-2026-deepfake | 🟡 | 🟡 | 🔴 | 🟡 | P1 |
| 4 | backup-321-praktyczny-setup-msp | 🔴 | 🔴 | 🔴 | 🟢 | **P0** |
| 5 | ubezpieczenie-cyber-underwriter-2026 | 🔴 | 🔴 | 🟡 | 🟡 | P1 |
| 6 | wyciek-sklepow-polska-130k-2026 | 🟡 | 🟢 | 🟡 | 🟢 | P3 |
| 7 | list-od-cert-polska-dmarc-msp (ref) | 🟢 | 🟢 | 🟢 | 🟢 | — |

**Podsumowanie jednym zdaniem:** 5 z 6 starszych postów nie linkuje do żadnego URL-a na `aipulse.pl/security`, żaden nie nazywa pakietów po imieniu, połowa to DIY tutoriale w duchu „zrób sobie sam".

---

## 2. Wspólne wzorce rozjazdów

### Wzorzec A — Brak linków do realnych zasobów strony
**Skala:** 5/6 postów.
Typowe CTA w starych postach: „napisz do nas", „skontaktuj się z Ai Pulse Security", „skontaktuj się ze mną na LinkedIn lub przez naszą stronę". Bez linku, bez nazwy pakietu, bez ścieżki — marnowany ruch z bloga.
Jedyny wyjątek: `wyciek-sklepow` (link do `/bezpieczenstwo-samoocena/`) oraz `ai-phishing` (link do `/security/#contact`, ale bez pakietu).

### Wzorzec B — Zero nazewnictwa pakietów
**Skala:** 6/6 postów.
Żaden ze starych postów nie nazywa po imieniu: `Audyt uproszczony` / `BASIC` / `ROZSZERZONY` / `PREMIUM + vCISO` / `Virtual CISO`. To wyraźne zmarnowanie — kilka postów idealnie pasuje do konkretnego pakietu (np. `ubezpieczenie` → `ROZSZERZONY`, który explicite zawiera „analiza luk pod ubezpieczenie cyber + kampania phishingu").

### Wzorzec C — DIY tutoriale zamiast zarysu usługi
**Skala:** 3/6 postów (backup, ai-phishing, częściowo wyciek-sklepow).
Najjaskrawszy przypadek: `backup-321` to kompletny przepis zakupowy (Synology DS224+, Backblaze B2, konkretne kwoty w zł, wyliczenie „112 zł/mies") — po tym poście właściciel może kupić stack u konkurencji. `ai-phishing` sprzedaje Proofpoint/Barracuda/YubiKey za 200 zł. Oddajemy wartość audytu + sugerujemy produkty niezwiązane z naszą ofertą.

### Wzorzec D — Bezźródłowe „popularne statystyki"
**Skala:** 4/6 postów.
Recyklowane liczby: „60% małych firm bankrutuje po cyberincydencie w pół roku" (mity, backup), „95% ataków zautomatyzowanych" (mity), „80-90% kodu to open source" (supply-chain), „30-40% niższa składka za SOC" (ubezpieczenie). Wszystkie krążą po branży bez konkretnego raportu, do którego można zalinkować. Efekt — autorytatywnie brzmiąca fałszywa precyzja.

### Wzorzec E — Ton „straszak" zamiast „ciekawość + koszt biznesowy"
**Skala:** 4/6 postów.
Frazy: „Brutalna prawda", „jeźdźcy apokalipsy Twojego budżetu", „hakerzy uwielbiają optymistów", „ignorancja jest zaproszeniem dla przestępcy", „cyfrowa bomba". Brama 2 mówi wprost: hook ciekawością i konkretnym kosztem biznesowym, nie strachem. Te posty „sprzedają panikę" — co działa u niektórych czytelników, ale u sceptyków-właścicieli firm (nasza docelówa) budzi dystans.

### Wzorzec F — Brak źródeł zewnętrznych
**Skala:** 5/6 postów.
Tylko `wyciek-sklepow` ma na końcu blok „Źródło:" z linkiem. Pozostałe — zero cytatów. Case'y są wymieniane po nazwie (Target, Colonial Pipeline, Arup, Ferrari, MGM, xz-utils) bez podlinkowania analizy. Łatwy win: mogą być w naturalnych linkach inline.

### Wzorzec G — Co jest zrobione dobrze (spójne)
- **Narrator:** Wszystkie posty „Maciej Konieczny, Ai Pulse Security" — spójna marka osobista ✅
- **Struktura makro:** hook → scenariusze → wnioski → CTA ✅
- **Analogie z realnego świata:** restauracja/przyprawy (supply-chain), klucz w stacyjce (ubezpieczenie), kłódka z czekolady (mity) — w większości postów dobre ✅
- **Format „Mit → Fakt → Co to dla Ciebie znaczy"** w poście mity — wzorcowy dla laika ✅
- **Kategorie i tagi** — każdy post ma oba, kategorie nie duplikują się ✅

---

## 3. Post po poście — szczegółowe znaleziska

### Post 1: `mity-cyberbezpieczenstwa-msp` (featured)

**Mocne strony:**
- Format „Mit → Fakt → Co to dla Ciebie znaczy" — najbardziej przystępny w całym stadzie
- Realne case'y: Target (HVAC vendor), Colonial Pipeline, MGM, LastPass
- Zamknięcie: „brutalna prawda jest zawsze tańsza niż słodkie kłamstwo" — dobra klamra

**Brama 1 (🔴):** Zero linków. Zero nazw pakietów. Końcowy CTA: „napisz do nas. Zrobimy audyt".

**Brama 2 (🟡):** Akronimy głównie wyjaśnione (MFA/2FA, EDR z rozwinięciem, Zero Trust). Ton cynic-straszak („hakerzy uwielbiają optymistów", „najdroższy mit", „kłódka z czekolady") — na granicy, dużo dramatu.

**Brama 3 (🟡):** „Twój plan minimum na ten tydzień: 1. MFA wszędzie, 2. Przywróć plik z backupu, 3. Porzuć antywirusa za 50 zł, kup EDR" — to DIY przepis. Brak samooceny jako first-step. CTA ogólne, bez nazwy pakietu.

**Brama 4 (🟡):** „Ataki są w 95% zautomatyzowane", „60% małych firm zamyka się w pół roku" — obie bezźródłowe.

**Rekomendowane edyty (P2 — kosmetyczne, nie rewrite):**
1. Zmienić „Plan minimum" na CTA do [Samooceny](/bezpieczenstwo-samoocena/) („zamiast odhaczać listę — zrób 35 pytań w 10 min i dostań priorytety na bazie Twojej sytuacji")
2. Hedge na „95%" i „60%" (→ „w większości przypadków", „branża notuje")
3. Dodać końcowy link do [oferty pakietów](/security/#section-oferta) z nazwą `Audyt Podstawowy`

### Post 2: `supply-chain-npm-atak-msp`

**Mocne strony:**
- Analogia restauracji/zatrutych przypraw — najlepsza analogia w całym stadzie 🎉
- Realne case'y: xz-utils 2024, event-stream, polyfill.io, ua-parser-js
- NIS2 wprowadzona z uzasadnieniem

**Brama 1 (🔴):** Zero linków. „Skontaktuj się z Ai Pulse Security" bez URL-a. Brak nazw pakietów — a post idealnie pasuje do `ROZSZERZONY` (ocena NIS2/KSC).

**Brama 2 (🟡):** SBOM wyjaśniony ✅, ale SCA (Software Composition Analysis) — wrzucone bez wyjaśnienia. NIS2 jako „dyrektywa" bez kontekstu, że implementacją w PL jest ustawa KSC z 2026.

**Brama 3 (🟡):** „5 konkretnych działań dla właściciela firmy" — to checklist, ale raczej na poziomie polityki (zapytaj o SBOM, weryfikuj dostawcę) niż technicznego DIY. Tolerowane. Końcówka „Robimy audyt, który pokaże Ci prawdę, zanim pokaże ją haker" — ton buńczuczny, hard-sell vibe.

**Brama 4 (🟡):** „80-90% elementów to open source" — bez źródła (popularna statystyka, można zalinkować Synopsys OSSRA). „ponad 100 000 stron internetowych" (polyfill) — znane z raportów Sansec, łatwo zalinkować.

**Rekomendowane edyty (P2):**
1. Dodać zdanie z linkiem do [ROZSZERZONY](/security/#section-oferta) („Jeśli NIS2 dotyczy Twojej branży — audyt ROZSZERZONY zawiera ocenę ryzyka NIS2/KSC po 60 elementach")
2. Zmiękczyć CTA („audyt, który pokaże Ci prawdę" → „raport zrozumiały dla zarządu, nie tylko dla IT")
3. Dodać inline linki do 2-3 źródeł dla case'ów (Sansec na polyfill, Wired na xz-utils)

### Post 3: `ai-phishing-2026-deepfake`

**Mocne strony:**
- Scenariusze wizualne (telefon do księgowej w piątek 15:45) — wzorcowe
- Case'y: Arup ($25M), Ferrari (Vigna) — realne i znane
- **Jedyny stary post z faktycznym linkiem do `/security/#contact`** ✅

**Brama 1 (🟡):** Link jest, ale nie ma nazwy pakietu ani odesłania do samooceny.

**Brama 2 (🟡):** Stos akronimów: LLM, Vishing 2.0, Quishing, FIDO2, MFA, Adversary-in-the-Middle. Większość tłumaczona, ale 5+ akronimów w treści głównej to próg bólu dla MŚP. Dodatkowo nazwy produktów enterprise (Microsoft Defender for Office 365, Proofpoint Essentials, Barracuda) — poza zasięgiem decyzji przeciętnego MŚP.

**Brama 3 (🔴):** „6 zasad, które uratują Twoją płynność finansową" + „Co zrobić w tym tygodniu" = pełen DIY playbook z kwotami: „YubiKey 200 zł/klucz", „Microsoft Defender 20-40 zł/skrzynkę", „klikowalność 28% → 7%". To sprzedaż Proofpointa/YubiKey za naszym pośrednictwem, bez wartości dla nas.

**Brama 4 (🟡):** Case'y realne. „28% → 7%" — wymyślona progresja. „20-40 zł/skrzynkę" — ceny bez źródła. „30-sek próbka głosu + $20/mies" — specyficzne bez linku.

**Rekomendowane edyty (P1 — średnie):**
1. Wyciąć konkretne nazwy produktów enterprise (Microsoft Defender, Proofpoint, Barracuda) — zostawić na poziomie „ochrona poczty klasy EDR/email security"
2. Zastąpić „6 zasad z cenami" na „4 zasady polityki + zapytaj dostawcę IT o resztę"
3. Zastąpić „28% → 7%" hedged language („w firmach, które po 6-9 mies cyklicznych szkoleń widzą spadek klikowalności z kilkudziesięciu do kilku procent")
4. Dodać link do samooceny jako first-step CTA przed końcowym linkiem do kontaktu

### Post 4: `backup-321-praktyczny-setup-msp` ⚠️ **P0 — NAJWAŻNIEJSZY DO PRZEPISANIA**

**Mocne strony:**
- Realne i sprawdzalne ceny (Synology DS224+, Backblaze B2)
- Jasna zasada 3-2-1 + Immutability dobrze wytłumaczone
- Checklist „Masz to?" — dobra UX-owo

**Brama 1 (🔴):** `kontakt@aipulse.security` — **email wygląda jak placeholder** (domena `.security`, nie `.pl`). Zero linków. Brak nazw pakietów.

**Brama 2 (🔴):** Post jest **de facto instrukcją zakupową stacku**. Czytelnik MŚP dostaje: kup Synology DS224+ (1500-1600 zł) + 2× WD Red Plus 4TB (1000 zł) + subskrypcję Backblaze B2 ($0.006/GB). Plus pojęcia: RPO, RTO, Object Lock, Air-gapped, Immutability — wrzucone gęsto.

**Brama 3 (🔴):** **Największe naruszenie w całym stadzie.** Post uczy czytelnika:
1. Co dokładnie kupić (3 produkty po imieniu z cenami)
2. Jak skonfigurować (Synology Active Backup for Business)
3. Ile to miesięcznie kosztuje (112 zł)
4. Jak testować (kwartalnie, 4 kroki)

Po tym poście czytelnik nie potrzebuje audytu. Wchodzi na allegro i zamawia Synology. Oddajemy całą wartość bezpłatnie + sprzedajemy kogoś innego (Synology, Backblaze). Naruszenie powodu biznesowego bramy 3.

**Brama 4 (🟢-ish):** Konkretne ceny są realne i sprawdzalne. „60% małych firm zamyka się w pół roku" — popularna nieźródłowa.

**Rekomendowane działanie (P0 — pełny rewrite):**
Post należy przepisać pod kątem **„jak sprawdzić, czy Twój backup Ci pomoże, kiedy go zniszczą"** zamiast **„oto stack do kupienia"**. Proponowana struktura po rewrite:

- Hook: prawdziwy scenariusz „backup był, nie pomógł" (Colonial Pipeline, wystarczy)
- Problem: ransomware najpierw szuka backupów → test „czy mój backup jest odporny"
- Trzy pytania diagnostyczne, które właściciel może zadać swojemu IT (bez podawania mu odpowiedzi): (1) czy kopia jest offline, (2) czy jest niemożliwa do usunięcia przez admina, (3) kiedy ostatni raz testowano odtworzenie
- Zarys tego, co robimy na audycie w tym obszarze (ocena setupu + test RTO, bez pokazywania jak)
- CTA do [samooceny](/bezpieczenstwo-samoocena/) + [Audyt Podstawowy](/security/#section-oferta)

**Uwaga edytorska:** ten post obecnie zdobywa SEO na frazy typu „backup dla MŚP" / „Synology 3-2-1" — wartościowy ruch. Rewrite nie musi oznaczać spadku SEO, jeśli zachowamy strukturę H2/H3 wokół terminu 3-2-1. Można też rozważyć: zostawić obecny post, ale usunąć dokładne ceny i modele, zachować zasadę.

### Post 5: `ubezpieczenie-cyber-underwriter-2026`

**Mocne strony:**
- Hook „odmowa polisy" — świetny problem-first
- Underwriter wytłumaczony jako postać
- Struktura „6 elementów ankiety" — czytelna

**Brama 1 (🔴):** Zero linków. Zero nazw pakietów — **szczególnie boli**, bo `ROZSZERZONY` zawiera explicite „analiza luk pod ubezpieczenie cyber" i pasuje 1:1 do tematu. Zmarnowane matchowanie oferty.

**Brama 2 (🔴):** MFA, EDR, XDR, IRP, SOC, Active Monitoring, Zero Day, Patch Management, Business Interruption, Adversary-in-the-Middle — **~10 akronimów/terminów technicznych** w treści głównej, część wyjaśniona, część nie. Czytelnik MŚP się wyłącza po 3-4.

**Brama 3 (🟡):** „Skorzystaj z usług zewnętrznej firmy security (takiej jak Ai Pulse Security)" — subtelne, lepsze niż hard-sell, ale marnuje okazję na nazwanie pakietu.

**Brama 4 (🟡):** „Firma X z Poznania, 1,2 mln strat" — prawdopodobnie fabrykowany case (bez nazwy, bez źródła). „SOC 24/7 → 30-40% niższa składka" — bez źródła. „seria potężnych ataków ransomware z przełomu 2024/2025" — bez konkretu.

**Rekomendowane edyty (P1):**
1. **Wstawić nazwę pakietu:** „Wszystkie 6 elementów, które sprawdza underwriter, nasz `Audyt Rozszerzony` adresuje w 7-10 dniach roboczych" + [link](/security/#section-oferta)
2. Odchudzić akronimy: XDR wyciąć (nadmiar), EDR zostawić z analogią („zamiast strażaka, który przybiega jak pali — strażak siedzi na miejscu i zauważa dym"), IRP zostawić ale pełną nazwą (Incident Response Plan) jednorazowo, SOC jednorazowo z rozwinięciem
3. „Firma X z Poznania" — albo z prawdziwym case'em (dużo spraw CERT/UODO), albo explicite hedged („widzieliśmy w naszej praktyce firmę produkcyjną, która...")
4. Link do [Samooceny](/bezpieczenstwo-samoocena/) jako „sprawdź wstępnie, czy Twoja firma odpowiedziałaby na te 6 pytań pozytywnie"

### Post 6: `wyciek-sklepow-polska-130k-2026` (featured) ⭐ **NAJBLIŻEJ WZORCA**

**Mocne strony:**
- **Jedyny stary post z faktycznym źródłem** (CyberDefence24 z datą publikacji) ✅
- **Jedyny stary post z linkiem do samooceny** ✅
- Sekcja „Czego ten wyciek NIE pokazuje" — wzorcowa dyscyplina faktograficzna (explicite dementuje błędne interpretacje)
- bcrypt wytłumaczone analogią czasową — top-tier tłumaczenie techniczne
- „50 tys. aliasów allegromail.pl = 38%" — konkretna liczba z podanego źródła

**Brama 1 (🟡):** Samoocena zalinkowana ✅. Brak linku do `/security/#section-oferta`. Brak nazwy pakietu (jest tylko „audyty ekspozycji zewnętrznej" — bez nazwy produktu).

**Brama 2 (🟢):** Najlepszy post pod kątem języka. phpMyAdmin/Adminer/cPanel podane po imieniu bez przeciążenia. bcrypt tłumaczony analogią. Basic Auth z kontekstu.

**Brama 3 (🟡):** „5 rzeczy, które powinieneś zrobić w ciągu najbliższego tygodnia" — DIY checklist z konkretnymi narzędziami (WireGuard, Tailscale, Cloudflare Access, dnsdumpster.com). To graniczy z naruszeniem bramy 3, ale ma kontekst „sprawdź u siebie", nie „napraw sam pełny setup". CTA na końcu idealne: samoocena + audyt jako **dwie opcje**, nie wciskanie.

**Brama 4 (🟢):** Bardzo mocne — fakty z cytowanego źródła, wnioski explicite rozgraniczone od faktów („To, co wiemy na pewno ze źródła"). Dwa wyskoki: „80% polskich MŚP" i „20 tysięcy średnich e-commerce" — hedge.

**Rekomendowane edyty (P3 — drobne kosmetyki):**
1. Hedge dwóch popularnych statystyk
2. Dodać nazwę pakietu przy „audyt ekspozycji zewnętrznej" (to jest element zarówno `BASIC`, jak i `ROZSZERZONY` — wskazać jedno)
3. Opcjonalnie: przyciąć DIY checklist o 1-2 punkty (np. komendę `site:twojafirma.pl -www` można zostawić, ale konkretne narzędzia VPN można skondensować do „VPN/IP whitelist — standard branżowy, pytaj dostawcę IT")

---

## 4. Spójność makro — struktura, długość, ton

### Długość (słowa)

| Post | Słowa | Reading time |
|------|------:|:---:|
| mity | ~2900 | 14 min |
| supply-chain | ~1400 | 7 min |
| ai-phishing | ~1500 | 7 min |
| backup-321 | ~1700 | 8 min |
| ubezpieczenie | ~1300 | 7 min |
| wyciek-sklepow | ~1900 | 9 min |
| cert (ref) | ~1960 | 10 min |

**Obserwacja:** `mity` jest 2× dłuższy od pozostałych — wynika z formatu (7 mitów × 3 sekcje). Reszta spójna w paśmie 1300-2000 słów / 7-10 min. OK.

### Struktura makro

Wszystkie posty mają wzorzec: **hook → problem → scenariusze/case'y → wnioski → CTA**. Spójne ✅.

Różnice: `mity` używa H2 dla sekcji mitów, reszta miesza H2/H3. Rekomendacja: hierarchia nagłówków ujednolicona — H2 dla głównych sekcji, H3 dla podsekcji, bez H4 (generator TOC i tak czyta tylko H2).

### Narrator i głos

Spójne: pierwsza osoba liczby mnogiej dla firmy („my w Ai Pulse Security"), pierwsza osoba liczby pojedynczej dla autora („widzę u klientów"). Stopka zawsze `Maciej Konieczny, Ai Pulse Security` ✅.

### Emoji i polskie znaki

Brak emoji w treści — spójne ✅. Polskie znaki poprawne ✅.

---

## 5. Plan pracy (rekomendowana kolejność)

### Sprint 1 (tydzień bieżący, ~4h pracy) — P0 + P1

1. **backup-321** — pełny rewrite (P0). Największe naruszenie, najbardziej oddaje wartość audytu za darmo.
2. **ai-phishing** — średni rewrite (P1): wyciąć produkty enterprise z cenami, wstawić link do samooceny
3. **ubezpieczenie** — średni rewrite (P1): odchudzić akronimy, wstawić nazwę `Audyt Rozszerzony` i link

### Sprint 2 (~2-3h pracy) — P2 kosmetyki

4. **mity** — hedge statystyk, zmienić „plan minimum na tydzień" na CTA do samooceny
5. **supply-chain** — dodać link do `ROZSZERZONY` (NIS2), zmiękczyć końcowe CTA

### Sprint 3 (~30 min) — P3 drobne

6. **wyciek-sklepow** — hedge dwóch liczb, dodać nazwę pakietu, opcjonalnie skondensować DIY

### Poza sprintem — operacyjne

- **Weryfikacja adresu `kontakt@aipulse.security`** w poście backup — prawdziwy czy placeholder? Jeśli placeholder, wymienić na realny kanał (formularz `/security/#contact`).
- **Lista weryfikowalnych źródeł** do powielania w przyszłych postach (Verizon DBIR, Sophos State of Ransomware, ENISA Threat Landscape, raporty CERT Polska, Synopsys OSSRA) — do dodania w FINAL-plan jako „biblioteka źródeł".

---

## 6. Kontrolny checklist dla przyszłych postów

Do wklejenia na początek każdego draftu, odhaczenie przed `draft: false`:

```
[ ] BRAMA 1 (Realia aipulse.pl/security)
    [ ] Min. 1 link do: /bezpieczenstwo-samoocena/ LUB /security/#section-oferta LUB /security/#contact
    [ ] Min. 1 pakiet nazwany po imieniu (Audyt uproszczony/BASIC/ROZSZERZONY/PREMIUM/vCISO)
    [ ] Żadnych wymyślonych nazw ofert
    [ ] Min. 1 fraza z lądowiska (np. „30 minut bez zobowiązań")

[ ] BRAMA 2 (Język MŚP)
    [ ] Max 3 akronimy techniczne w treści głównej, każdy z analogią przy 1. użyciu
    [ ] Zero kodu, komend, konfiguracji, rekordów DNS
    [ ] Zero MTA-STS/BIMI/EDR-bez-analogii/XDR/SIEM/SOAR
    [ ] Hook ciekawością lub kosztem biznesowym — nie strachem/dramatem

[ ] BRAMA 3 (Dyscyplina CTA)
    [ ] Brak pełnego DIY tutoriala (krok-po-kroku z produktami)
    [ ] Pierwszy CTA dopiero po wytłumaczeniu problemu i skutków
    [ ] Samoocena /bezpieczenstwo-samoocena/ jako default first-CTA
    [ ] Zero „kup teraz", „nie zwlekaj", „natychmiast"
    [ ] CTA w formie „opcja" (samodzielnie vs. z nami), nie „jedynej drogi"

[ ] BRAMA 4 (Osadzenie w źródłach)
    [ ] Każda liczba/procent/skala — podpięta pod (a) materiał źródłowy, (b) zewnętrzny link, (c) naszą praktykę oznaczoną explicite
    [ ] Tytuł/excerpt/description — nie asertuje faktów o czytelniku, których nie znamy
    [ ] Case'y zewnętrzne — inline link do analizy (Wired, Sansec, CERT, Bleeping itp.)
    [ ] Jeżeli nie znasz źródła — hedge language, nie sztuczna precyzja
```

---

**Następny krok:** zatwierdź priorytety i kolejność sprintów. Mogę od razu zabrać się za `backup-321` (P0) albo najpierw zrobić szybkie kosmetyki P2/P3, żeby wszystkie stare posty podciągnąć minimum do 🟡 we wszystkich bramach.

---

## 7. Log wykonania sprintu (2026-04-18)

1. **P0 — backup-321**: pełny rewrite. Wycięto Synology DS224+, Backblaze B2, konkretne kwoty, 112 zł/mies, wymyśloną usługę „15-min backup audit". Post przekierowany na „3 pytania diagnostyczne, które zadasz swojemu IT". Dodane CTA: samoocena + `Audyt Podstawowy` + `/security/#contact`. Usunięto `kontakt@aipulse.security` (placeholder). Tytuł: „Backup w małej firmie: zasada 3-2-1 i jedno słowo, którego zwykle brakuje".
2. **P1 — ai-phishing-2026-deepfake**: średni rewrite. Wycięto Microsoft Defender / Proofpoint / Barracuda / YubiKey, stos akronimów (LLM/MFA/FIDO2/AITM), 6-zasad playbook z cenami. Dodano 4 scenariusze (mail, telefon, QR, cichy podmiot w korespondencji) + 3 pytania diagnostyczne + przykład safe word („ile kosztuje kawa w kuchni"). Linki do szkoleń i pakietu ROZSZERZONY.
3. **P1 — ubezpieczenie-cyber-underwriter-2026**: średni rewrite. Wycięto fikcyjny case z Poznania (1,2 mln PLN), „30-40% rabat za SOC", LinkedIn-CTA. Wycięto wall akronimów (EDR/XDR/IRP/SOC/UODO/VPN/RDP). Struktura oparta o 5 obszarów, które sprawdza underwriter, dopasowanych 1:1 do pakietu `ROZSZERZONY`. Internal link do post `backup-321`.
4. **P2 — mity-cyberbezpieczenstwa-msp**: kosmetyka. Hedge „95% zautomatyzowanych" → „większość ataków". Usunięto DIY „plan minimum na ten tydzień" (pushował MFA/backup/EDR produkty). CTA → samoocena + 30-min konsultacja. Fix YAML w excerpt (typograficzne cudzysłowy).
5. **P2 — supply-chain-npm-atak-msp**: kosmetyka. Dodano paragraf z linkiem do `ROZSZERZONY` + sekcji compliance. CTA → samoocena + 30-min.
6. **P3 — wyciek-sklepow-polska-130k-2026**: drobna kosmetyka. Hedge „80% MŚP" → „regularnie obserwujemy w audytach". „20 tys. sklepów" → „wiele tysięcy". Usunięto hard „50-200 tys. zł" szacunek kary. Nazwa pakietu `Audyt Podstawowy` w CTA.
7. **CERT post (ref)** — Brama 5 fix. Zmieniono:
   - `## Co znaleźli u mnie — anonimizowany cytat` → `## Co znaleźli u mnie`
   - `Cytuję bezpośrednio z maila, podmieniając tylko nazwę domeny na twojafirma.pl:` → `Raport wskazał konkretny błąd w konfiguracji mojej poczty:`
   - Sekcja `## To, czego nie napiszę w tym poście` (z „mógłbym tu wkleić… świadomie tego nie robię") → `## Dlaczego DIY w konfiguracji poczty kończy się zwykle gorzej niż problem wyjściowy` (merytoryczna argumentacja branżowa).

**Build status:** `npm run blog:build` → `[blog] built 7 post(s) + index + RSS feed` (czysto).

**Co poszło dobrze:** wszystkie 6 postów w jednej sesji, struktura bram 1-4 świetnie działa jako checklist — każde naruszenie szybko wyłapywalne. Brama 5 wyszła z realnego feedbacku od użytkownika w trakcie sprintu i została zinternalizowana do pamięci + guide'a.

**Co wymaga uwagi na następnym sprincie:** generacja covera dla `backup-321` (wymaga GEMINI_API_KEY lokalnie), ręczny smoke test linków wewnętrznych przed commitem, rozważenie wprowadzenia „biblioteki cytowalnych źródeł" jako stałej sekcji w guide'ie (zrobione w pkt 8 guide'a).
