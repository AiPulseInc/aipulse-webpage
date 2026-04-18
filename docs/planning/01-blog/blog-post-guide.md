# Blog Post Guide — `aipulse.pl/security/blog`

**Cel:** jedno miejsce z obowiązującymi regułami contentowymi dla każdego posta publikowanego pod `/security/blog/`. Źródło prawdy dla autora i dla AI, która pisze/edytuje drafty.

**Historia:** reguły 1-3 dodane po pierwszej iteracji 5 testowych postów + post CERT (2026-04-18). Reguła 4 dodana po znalezieniu wymyślonych liczb w drafcie CERT. Reguła 5 dodana po znalezieniu meta-komentarza redakcyjnego w opublikowanym poście („anonimizowany cytat", „świadomie tego nie robię").

**Zakres:** wszystkie posty pod `content/security/blog/<slug>/index.md`. Niezależnie od tematu, kategorii i długości.

**Workflow:** przed flipem `draft: true` → `draft: false` autor/asystent przechodzi świadomie wszystkie pięć bram jako checklist. Punkt 7 poniżej (checklist gotowy do wklejenia) jest obowiązkowy.

---

## Brama 1 — Obowiązkowe osadzenie w realiach `aipulse.pl/security`

Post nie istnieje w próżni. To frontowy artykuł firmy szkoleniowo-audytorskiej z konkretną ofertą, brand voicem i pakietami. Każdy draft musi:

1. **Znać i nazywać po imieniu nasze pakiety:**
   - `Audyt uproszczony` (free, kwestionariusz online — samoocena)
   - `BASIC` / `Audyt Podstawowy` (3-5 dni, zdalny)
   - `ROZSZERZONY` (NIS2/KSC + ubezpieczenie + phishing)
   - `PREMIUM + vCISO` (6 mies cykl)
   - `Virtual CISO` (8h/mies, stała współpraca)
   - 4 ścieżki szkoleniowe: Security Awareness, Bezpieczne używanie AI, Incident Response, RODO + NIS2 w praktyce
2. **Linkować do realnych zasobów strony** (nie wymyślać URL-i):
   - `/bezpieczenstwo-samoocena/` — samoocena
   - `/security/#section-oferta` — pakiety
   - `/security/#section-szkolenia-security` — szkolenia
   - `/security/#section-compliance` — NIS2/KSC
   - `/security/#contact` — 30 min konsultacja
3. **Trzymać brand language z lądowiska.** Recykluj frazy, nie wymyślaj nowych — utrzymujemy spójność tonu między landing page a blogiem:
   - „raport zrozumiały dla właściciela firmy — nie tylko dla IT"
   - „30 minut. Bez zobowiązań. 3 najważniejsze rekomendacje — nawet jeśli nie kupisz audytu"
   - „compliance NIS2/KSC"
   - „audyt pod ubezpieczenie cyber"
4. **Nie wymyślać nazw ofert ani pakietów.** Jeśli post potrzebuje nawiązania do usługi, której nie ma w ofercie — zatrzymujemy się i pytamy, zamiast zmyślać.
   - Antyprzykład: „Email Security Setup" (wymyślony w pierwszym drafcie CERT post).

**Test bramy 1:** czy w poście pada przynajmniej jeden konkretny link do `/bezpieczenstwo-samoocena/` / `/security/#section-oferta` / `/security/#contact` **i** przynajmniej jedna nazwa pakietu z lądowiska? Jeśli nie — post nie jest osadzony.

---

## Brama 2 — Język MŚP, nie język SOC-a

Audytorium: właściciele małych firm, księgowe, prezesi 10-50-osobowych spółek. Nie devops, nie CISO, nie hacker. Przed publikacją: **przeczytaj draft głośno, wyobrażając sobie odbiorcę z gabinetu firmy księgowej w Radomiu**. Jeżeli musi się zatrzymać i googlować pojęcie — przepisujemy.

Konkretne reguły:

- **Żargon zostawiamy tylko tam, gdzie jest niezbędny do nazwania problemu** (np. „DMARC" — bo to nazwa rzeczy, nie da się obejść). Wprowadzamy go zawsze z analogią z realnego świata („to jak alarm w sklepie podpięty do agencji ochrony — bez podpięcia tylko wisi na ścianie"). Nie wprowadzamy 5 akronimów obok siebie.
- **Terminy MTA-STS, BIMI, ARC, EDR, XDR, SIEM, SOAR i pokrewne — nie pojawiają się w treści głównej.** Jeśli absolutnie muszą — przypis albo sekcja „dla zaawansowanych".
- **Polecenia, kod, rekordy DNS, fragmenty konfiguracji — NIE.** Post ma być czytany w autobusie albo nad kawą, nie kopiowany do terminala. (To również wpływa na Bramę 3.)
- **Hookujemy ciekawością i konkretnym kosztem biznesowym, nie strachem ani liczbami typu „95% firm…".** Zamiast „zaraz wszystko stracisz" — „prawdopodobny scenariusz: Twój klient płaci na konto przestępcy zamiast Tobie. Jak rozliczysz to przed swoim ubezpieczycielem?".
- **Tekst alternatywny dla każdego pojęcia branżowego** przy pierwszym użyciu. „Phishing" → „phishing (sfałszowane maile, które wyglądają jak od znanej firmy)".

**Test bramy 2:** policz akronimy i nazwy techniczne wprowadzone bez analogii. Jeśli więcej niż 3 — przepisujemy.

---

## Brama 3 — Dyscyplina CTA: Ai Pulse Security jako opcja, nie jako wciskanie

Blog jest edukacyjny. Cel czytelnika: zrozumieć problem, zobaczyć jego konsekwencje biznesowe, podjąć świadomą decyzję — sam, z kimkolwiek innym, albo z nami.

Zasady:

1. **Nie publikujemy kompletnych instrukcji DIY rozwiązujących problem od A do Z.** Trzy powody:
   - **Biznesowy:** jeśli czytelnik naprawia sam dzięki naszemu postowi — świetnie dla niego, ale dla nas to oddanie wartości audytu za darmo.
   - **Jakościowy:** instrukcje wymagają kontekstu (jakich masz dostawców poczty, jakie subdomeny, czy używasz Mailchimpa) — bez kontekstu czytelnik narobi sobie szkód, które obciążą nas reputacyjnie.
   - **Strategiczny:** chcemy, żeby blog był wabikiem do `Audyt uproszczony` (samoocena), a nie zamiennikiem.
2. **Co zostaje w poście:** edukacja problemu, konsekwencje biznesowe, **bezpłatny first-step check** (np. `bezpiecznapoczta.cert.pl`, kwestionariusz `/bezpieczenstwo-samoocena/`), zarys tego, co robimy podczas audytu w tym obszarze (zarys, nie tutorial).
3. **Co znika z postu:** rekordy DNS gotowe do wklejenia, polecenia konsoli, kompletne playbooki, „naprawa krok po kroku".
4. **CTA na końcu — opcja, nie nakaz.** Wzorzec:

   > „Jeśli chcesz to zrobić samodzielnie — masz darmowe narzędzia [link]. Jeśli wolisz, żeby ktoś przeszedł przez to z Tobą i zostawił raport zrozumiały także dla zarządu — `Audyt Podstawowy` zaczyna się od bezpłatnej 30-minutowej konsultacji [link do `/security/#contact`]."

   **Nigdy:** „kup nasz audyt", „skontaktuj się natychmiast", „nie zwlekaj". Język oferty z lądowiska — spokojny, dorosły, bez sztucznego pilnego.
5. **Pierwsza wzmianka o nas pojawia się dopiero, gdy czytelnik rozumie problem i jego skutki.** Nie w pierwszym akapicie. Nie w sekcji „co to jest". Najwcześniej — w sekcji o tym, jak ten problem rozwiązuje się w praktyce.
6. **Bezpłatna samoocena `/bezpieczenstwo-samoocena/` to domyślny pierwszy CTA** w każdym poście dotyczącym diagnozy/audytu. Działa, zwraca konkretny wynik — przekonwertuje czytelnika z „ciekawe" na „już coś od was dostałem, dalej widzę sens rozmowy".

**Test bramy 3:** czy w poście są (a) konkretne polecenia, kod, rekordy do skopiowania? → wytnij. (b) hard-sell („musisz teraz", „nie zwlekaj", „kup nasz")? → przepisz. (c) CTA pozycjonowany jako opcja, z jasnym wskazaniem darmowej alternatywy? → jeśli nie, dopisz.

---

## Brama 4 — Bezwzględne osadzenie w materiale źródłowym

Każdy post pisany jest na podstawie **konkretnego materiału źródłowego** wskazanego przez autora — mail od CERT, raport branżowy, artykuł, case z audytu, incydent, screenshot panelu. Ten materiał to **jedyny autoryzowany fundament faktograficzny posta**. Wszystko, co wykracza poza jego treść, wymaga albo drugiego źródła, które da się wskazać palcem, albo wyraźnego oznaczenia jako obserwacja z naszej praktyki.

Zasady:

1. **Nie wymyślamy liczb, statystyk ani procentów.** Antyprzykłady z iteracji CERT: „8 na 10 polskich małych firm", „kosztuje polski sektor MŚP grube miliony rocznie", „ostatnie dwa lata". Jeżeli materiał źródłowy nie zawiera liczby i nie znamy jej z wiarygodnego raportu, który można zalinkować — używamy hedged language („większość firm, które widzimy na audycie", „najczęstszy wniosek z pierwszego dnia pracy"), nie sztucznej precyzji.
2. **Nie ekstrapolujemy poza to, co pokazuje źródło.** Jeżeli mail od CERT mówi, że _moja_ domena ma problem — nie piszemy, że _Twoja_ też ma, bo tego nie wiemy. Piszemy, że „może mieć", „często widzimy ten sam problem u firm, które trafiają do nas na audyt".
3. **Każda twarda asercja potrzebuje jednego z trzech fundamentów:**
   - **(a)** Cytat/parafraza z materiału źródłowego (np. cytat z maila CERT).
   - **(b)** Zewnętrzne, zalinkowalne źródło (raport branżowy, dokumentacja CERT, publikacja NASK, ENISA, CERT.PL, Verizon DBIR, Sophos State of Ransomware, Synopsys OSSRA itp. — link w tekście).
   - **(c)** Obserwacja z **naszej** praktyki audytorskiej, oznaczona explicite („w naszych audytach", „u klientów, których widzimy", „w firmach, które audytujemy").

   Jeżeli asercji nie da się podpiąć pod żaden z trzech — przepisujemy ją na hedge albo wycinamy.
4. **Tytuł, excerpt i description nie mogą asertować faktów, których nie znamy o czytelniku.**
   - Antyprzykład: „CERT właśnie przeskanował Twoją domenę" (nie wiemy, czy przeskanował).
   - Poprawne: „CERT skanuje polskie domeny. Oto co mogą znaleźć u Ciebie".
5. **Gdy coś brzmi dobrze, a źródła nie ma — zatrzymujemy się i pytamy.** Lepiej wrócić do autora z „tej liczby nie znalazłem w mailu ani w źródłach publicznych, skąd ją bierzemy?" niż wkleić ją, żeby ładnie wyglądała. Jakość > tempo.

**Test bramy 4:** przejdź przez draft akapit po akapicie i zaznacz każdą asercję faktograficzną (liczba, procent, skala zjawiska, stwierdzenie o tym, co kto robi, kiedy i ile to kosztuje). Przy każdej zaznaczonej zapisz: z czego to wynika? Jeśli nie ma odpowiedzi z kategorii (a), (b) lub (c) — przepisujemy na hedge albo wycinamy.

---

## Brama 5 — Głos eksperta, zero meta-komentarza redakcyjnego

Czytelnik dostaje **ekspercki komentarz**, nie relację z kuchni produkcyjnej. Post NIE ujawnia, że treść była anonimizowana, skracana, pisana „pod oczekiwania", generowana ani recenzowana. Decyzje edytorskie (np. „dlaczego nie DIY", „dlaczego nie konkretny produkt") uzasadniamy merytorycznym argumentem branżowym, nie wyznaniem „świadomie tego nie robię".

Zasady:

1. **Zakazane frazy — meta-komentarz o produkcji i źródle:**
   - „anonimizowany cytat"
   - „cytuję bezpośrednio z maila, podmieniając tylko nazwę domeny"
   - „to, czego nie napiszę w tym poście"
   - „mógłbym tu wkleić… świadomie tego nie robię"
   - „dla potrzeb tego posta", „na potrzeby tego artykułu"
2. **Zakazane frazy — wyznania redakcyjne o samoograniczeniu** (nawet jeśli merytoryczne, brzmią jak przyznanie się do reguły):
   - „ten post nie jest listą zakupów"
   - „ten artykuł nie jest katalogiem narzędzi"
   - „nie będę tu tłumaczyć krok po kroku"

   Zamiast nich — **merytoryczna teza pozytywna**:
   - ✅ „dobrego backupu nie buduje się wyborem konkretnego serwera — to decyzje w kontekście firmy"
   - ✅ „zanim zastanowisz się nad narzędziami — warto zobaczyć, jak wygląda mapa zagrożeń z 2026 roku"
3. **Anonimizacja jest niewidzialna.** Domena typu `twojafirma.pl` służy jako **narracyjny trik** (czytelnik czyta „swoją" domenę) — nie jako wyznanie anonimizacji. Jeśli cytujesz mail po podmianie danych, podmiana nie jest ogłaszana; cytat płynie jakby był oryginalny.
4. **Uzasadnienia decyzji edytorskich robimy przez merytoryczny argument branżowy**, nie przez wyznanie.
   - Źle: „świadomie nie wklejam tu gotowych rekordów DNS, bo wiem, że większość czytelników zrobi sobie krzywdę".
   - Dobrze: „gotowe rekordy DNS dla cudzej domeny zwykle kończą się przerwą w dostarczaniu maili — konfiguracja wymaga znajomości Twojego setupu (dostawca poczty, Mailchimp, subdomeny)".
5. **Wyjątek — pierwszoosobowa narracja autora jest pożądana.** Frazy typu „mój przypadek", „mój audyt", „nasze audyty", „widzimy u klientów" — to **głos eksperta**, nie meta-komentarz. Zostają.

**Test bramy 5:** zrób search po draftu za frazami: `ten post`, `ten artykuł`, `mógłbym`, `świadomie`, `anonimizowan`, `cytuję`, `dla potrzeb`, `na potrzeby`, `nie będę`, `celowo`. Każde znalezisko przepisz albo usuń.

---

## 6. Workflow walidacji (per draft)

Przed flipem `draft: true` → `draft: false`:

1. **Brama 1** (osadzenie w realiach `aipulse.pl/security`) — checklist: link do samooceny? nazwa min. jednego pakietu? brak wymyślonych nazw?
2. **Brama 2** (język MŚP) — przeczytaj głośno, policz akronimy, zostaw tylko niezbędne z analogią.
3. **Brama 3** (dyscyplina CTA) — wytnij DIY tutoriale, sprawdź ton CTA, samoocena jako pierwszy CTA.
4. **Brama 4** (osadzenie w materiale źródłowym) — zaznacz każdą asercję, podpnij pod (a), (b) albo (c). Bezźródłowe liczby — wycinamy.
5. **Brama 5** (głos eksperta) — search po frazach-trigger, każde znalezisko przepisz lub usuń.
6. Dopiero wtedy flip.

Te pięć bram jest ważniejsze od długości, ważniejsze od SEO i ważniejsze od „świetnego tytułu". Post może być krótszy niż planowany, tytuł mniej chwytliwy — ale musi być spójny z firmą, jej ofertą, źródłem, z którego się wywodzi, i głosem eksperta.

---

## 7. Kontrolny checklist (do wklejenia na początek draftu)

```
[ ] BRAMA 1 — Realia aipulse.pl/security
    [ ] Min. 1 link do: /bezpieczenstwo-samoocena/ LUB /security/#section-oferta LUB /security/#contact
    [ ] Min. 1 pakiet nazwany po imieniu (Audyt uproszczony / BASIC / ROZSZERZONY / PREMIUM / vCISO)
    [ ] Żadnych wymyślonych nazw ofert (antyprzykład: „Email Security Setup")
    [ ] Min. 1 fraza recyklowana z lądowiska („30 minut bez zobowiązań", „raport zrozumiały dla właściciela")

[ ] BRAMA 2 — Język MŚP
    [ ] Max 3 akronimy techniczne w treści głównej, każdy z analogią przy 1. użyciu
    [ ] Zero kodu, komend, konfiguracji, rekordów DNS
    [ ] Zero MTA-STS / BIMI / EDR-bez-analogii / XDR / SIEM / SOAR w treści głównej
    [ ] Hook ciekawością lub kosztem biznesowym — nie strachem/dramatem

[ ] BRAMA 3 — Dyscyplina CTA
    [ ] Brak pełnego DIY tutoriala (krok-po-kroku z produktami/cenami)
    [ ] Pierwszy CTA dopiero po wytłumaczeniu problemu i skutków
    [ ] Samoocena /bezpieczenstwo-samoocena/ jako default first-CTA
    [ ] Zero „kup teraz", „nie zwlekaj", „natychmiast"
    [ ] CTA w formie „opcja" (samodzielnie vs. z nami), nie „jedynej drogi"

[ ] BRAMA 4 — Osadzenie w materiale źródłowym
    [ ] Każda liczba/procent/skala — podpięta pod (a) materiał źródłowy, (b) zewnętrzny link, (c) naszą praktykę oznaczoną explicite
    [ ] Tytuł/excerpt/description — nie asertuje faktów o czytelniku, których nie znamy
    [ ] Case'y zewnętrzne — inline link do analizy (Wired, Sansec, CERT Polska, ENISA, Bleeping itp.)
    [ ] Jeżeli nie znam źródła — hedge language („w większości audytów widzimy"), nie sztuczna precyzja

[ ] BRAMA 5 — Głos eksperta, zero meta-komentarza
    [ ] Search po: „ten post", „ten artykuł", „mógłbym", „świadomie", „anonimizowan", „cytuję",
        „dla potrzeb", „na potrzeby", „nie będę", „celowo" → każde znalezisko przepisać lub usunąć
    [ ] Anonimizacja cytatów niewidzialna (bez komentarza „podmieniłem dane")
    [ ] Uzasadnienia decyzji edytorskich — przez merytoryczny argument branżowy, nie wyznanie
    [ ] Pierwsza osoba („mój przypadek", „nasze audyty") — tak; meta o procesie pisania — nie
```

---

## 8. Biblioteka źródeł do recyklowania (Brama 4)

Kiedy potrzebujesz zewnętrznego źródła dla twardej asercji — sięgaj najpierw po te. Wszystkie są publiczne, linkowalne, cytowane przez branżę.

- **CERT Polska / NASK** — raporty roczne, dane z `bezpiecznapoczta.cert.pl`, incydenty krajowe
- **ENISA Threat Landscape** — europejska perspektywa, coroczny raport
- **Verizon DBIR** (Data Breach Investigations Report) — największy korpus breachy globalnie
- **Sophos State of Ransomware** — coroczne badanie kosztów ransomware per rozmiar firmy
- **Synopsys OSSRA** (Open Source Security and Risk Analysis) — statystyki open source w kodzie
- **CyberDefence24** — polskie case'y i wycieki krajowe
- **Bleeping Computer / The Record / Wired Security** — analizy incydentów międzynarodowych
- **Sansec** — specjaliści od supply chain e-commerce (polyfill.io, Magento)
- **UODO** — kary RODO w PL, publikowane decyzje
- **NIS2 Directive (EU) 2022/2555** + polska ustawa KSC — dla compliance

---

_Ostatnia aktualizacja: 2026-04-18. Ten plik jest jedynym źródłem prawdy dla reguł contentowych bloga. Zmiany procesu pisania = zmiana tego pliku + wzmianka w commicie._
