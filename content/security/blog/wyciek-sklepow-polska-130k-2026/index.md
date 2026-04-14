---
title: "Wyciek 130 tys. klientów polskich sklepów"
slug: "wyciek-sklepow-polska-130k-2026"
date: "2026-04-14"
updated: "2026-04-14"
excerpt: "132 tysiące adresów e-mail, imiona, telefony i adresy dostaw z dwóch polskich sklepów — vegehome.pl i polskiekoldry.pl. Wektor ataku: narzędzie administracyjne w środowisku testowym. Co z tego wynika dla właściciela MŚP."
description: "Analiza wycieku danych z polskich sklepów vegehome.pl i polskiekoldry.pl (kwiecień 2026): 132k unikalnych e-maili, bcrypt uratował hasła, wektor ataku w środowisku dev. Wnioski dla MŚP."
category: "Wycieki danych"
tags:
  - "wycieki-danych"
  - "rodo"
  - "e-commerce"
  - "prestashop"
  - "incident-response"
  - "srodowiska-dev"
cover: "/generated/security/blog/wyciek-sklepow-polska-130k-2026.jpg"
coverAlt: "Biała geometryczna wieża bazy danych na czarnym tle, z rzędami violetowych prostokątów-rekordów uciekających po bokach w ciemność."
featured: true
draft: false
author: "Maciej Konieczny"
---

12 kwietnia 2026 — dane ponad 130 tysięcy klientów dwóch polskich sklepów internetowych (vegehome.pl i polskiekoldry.pl) trafiły do internetu. 13 kwietnia, po godzinie 21:30, właściciele sklepów dowiadują się o wycieku z portalu branżowego. 11 godzin później mają gotowy komunikat, resetują hasła, blokują wektor ataku i przygotowują zgłoszenie do UODO. Do 72-godzinnego deadline'u RODO — mieszczą się z zapasem.

Gdyby każdy wyciek w Polsce kończył się tak sprawnie, ten artykuł w ogóle by nie powstał. Ale istotniejsze jest **jak to się w ogóle stało** — bo to nie jest historia o hakerskim geniuszu, tylko o klasycznym błędzie, który popełnia 80% polskich MŚP prowadzących sklep na gotowej platformie.

### Co dokładnie wyciekło

Zbiór danych opublikowany w darkwebie miał ponad 9 milionów linii, z czego **146 377 rekordów** to konta klientów. Po deduplikacji adresów — **132 396 unikalnych e-maili**. Dodatkowo: imiona, nazwiska, numery telefonów, adresy dostaw i daty zamówień.

**Czego NIE było w pakiecie:** danych kart płatniczych.
**Co było ratunkiem:** hasła były zapisane w bazie **nowoczesną metodą ochrony** (bcrypt z kosztem 10). Mówiąc po ludzku: zamiast trzymać hasło jako czytelny tekst, programiści użyli metody, która **celowo spowalnia** każdą próbę odgadnięcia. Jedna próba zajmuje ok. 0,1 sekundy zamiast jednej mikrosekundy. Dla bazy 130 tysięcy kont to różnica między „gotowe w 15 godzin na zwykłym laptopie" a „praca na lata, nawet na drogim specjalistycznym GPU".

Gdyby programiści użyli starych metod z lat 90. (**MD5** albo **SHA-1** — takie same „zaszyfrowane odciski" haseł, ale policzalne tysiące razy szybciej), wyciek oznaczałby natychmiastowe przejęcie większości kont. Tu jedna decyzja techniczna sprzed lat — wybór „wolnego" algorytmu zamiast szybkiego — realnie ochroniła klientów.

Ciekawy szczegół: około **50 tysięcy adresów e-mail (38%)** to aliasy z domeny allegromail.pl. To klienci, którzy kupowali przez Allegro — a Allegro **celowo** nie udostępnia sprzedającym prawdziwych adresów, tylko tymczasowy alias, który kupujący może w każdej chwili wyłączyć. Dla tych 50 tysięcy osób wyciek jest **dużo mniej bolesny**: prawdziwy email pozostał ukryty, a sam alias można odciąć jednym kliknięciem w ustawieniach Allegro. To rzadki przypadek, gdzie decyzja platformy sprzed lat — na pozór drobna, irytująca dla sprzedawców, którzy chcieliby zbudować własną bazę mailingową — realnie ochroniła kupujących.

Gorzej mają klienci, którzy kupowali **bezpośrednio w sklepie** (pozostałe 62% — gmail.com, wp.pl, o2.pl): w bazie jest ich prawdziwy adres e-mail, sparowany z imieniem, adresem dostawy i numerem telefonu. Tu już **gotowa baza do targetowanego phishingu** („Witaj Panie Janie, kurier nie doręczył Twojej przesyłki z 15 marca z polskiekoldry.pl — kliknij tutaj…").

### Wektor ataku — tu jest właściwa lekcja

Sklepy działały na **PrestaShop**. Gdyby dziennikarze napisali „atak przez lukę w PrestaShop”, pół polskiego e-commerce wpadłoby w panikę. Ale nie. Zgodnie z oświadczeniem firm, wektor ataku to **zewnętrzne narzędzie administracyjne do zarządzania bazą danych, zlokalizowane w infrastrukturze testowo-rozwojowej**.

Mówiąc po ludzku: na środowisku testowo-rozwojowym (czyli „kopii produkcji" używanej do testów i poprawek przez programistów) działało narzędzie, które pozwalało zarządzać bazą danych. To nie jest wina samej platformy sklepowej — to osobna warstwa infrastruktury, wokół której firmy często mają słabszą higienę niż wokół głównego sklepu.

Szczegółów technicznych tego konkretnego incydentu firmy nie ujawniły (jakie dokładnie narzędzie, jak zostało skompromitowane) — i do czasu oficjalnego oświadczenia nie będziemy tego zgadywać. **To, co wiemy na pewno ze źródła:** wektor ataku był **poza PrestaShop**, w warstwie narzędzi administracyjnych otaczających sklep. Sam PrestaShop nic nie zawinił. Zawinił **proces zarządzania środowiskiem deweloperskim** — i to jest lekcja, która dotyczy każdej firmy z e-commerce, niezależnie od platformy.

### Dlaczego to powinno Cię obchodzić (jeśli prowadzisz MŚP)

Jeśli masz sklep online, CRM, system ticketowy, panel marketingowy — masz prawie na pewno **co najmniej jedno środowisko nieprodukcyjne**, o którym zapomniałeś. Typowe scenariusze, które widzę u klientów:

- **Stary serwer developerski** z czasów migracji 2 lata temu, formalnie „wyłączony”, ale wciąż online z backup-em produkcji z dnia przeniesienia.
- **Narzędzie admin bazy danych** na subdomenie `db.twojafirma.pl`, bo „programista musiał mieć dostęp zdalnie”.
- **Staging site** z prawdziwymi danymi klientów, żeby testy były realistyczne, dostępny publicznie, zabezpieczony najprostszym hasłem w oknie przeglądarki (Basic Auth).
- **Panel konfiguracyjny hostingu** (cPanel, DirectAdmin, Plesk) na domyślnym porcie, bez MFA, z hasłem generowanym przez hosting.

Każde z tych miejsc jest **tylnymi drzwiami** do Twojej produkcji. I każdy z nich — dokładnie jak w przypadku tych dwóch sklepów — może skutkować wyciekiem bazy klientów, zgłoszeniem do UODO i karą do 4% rocznego obrotu.

### 5 rzeczy, które powinieneś zrobić w ciągu najbliższego tygodnia

**1. Zrób audyt subdomen i portów.**
Wpisz w Google `site:twojafirma.pl -www` — zobaczysz co Google zindeksował. Użyj bezpłatnego narzędzia typu `dnsdumpster.com` albo zapytaj administratora o listę wszystkich rekordów DNS Twojej głównej domeny. Każda subdomena, której nie potrafisz uzasadnić biznesowo — wyłącz albo zabezpiecz VPN-em.

**2. Oddziel bazy: produkcja ≠ test ≠ development.**
Środowisko testowe **nie może** mieć dostępu do produkcyjnej bazy. Jeśli potrzebujesz realistycznych danych na testach, poproś programistów o **anonimizację** (skrypt, który zamienia prawdziwe imiona/emaile na fikcyjne, ale zachowuje strukturę). To standard w branży od 10 lat. Jeśli Twój dostawca oprogramowania robi inaczej — masz problem.

**3. Wszystkie panele administracyjne za VPN-em albo IP whitelist.**
phpMyAdmin, Adminer, panel CMS, panel hostingu, GitLab, Jenkins — żaden z tych paneli nie powinien być dostępny z dowolnego adresu IP na świecie. Koszt VPN-u dla 5-osobowej firmy to 0 zł (WireGuard na VPS-ie za 20 zł/mc) albo ~150 zł/mc za gotowe rozwiązanie typu Tailscale/Cloudflare Access. Porównaj z 40-dniowym postępowaniem UODO i karą 50-200 tys. zł.

**4. MFA wszędzie, gdzie jest panel administracyjny.**
Bez wyjątku. Hasło admina nie wystarczy w 2026 roku — bcrypt ochronił klientów tych sklepów, ale gdyby ten sam wyciek zawierał hasła administratorów bez MFA, następny krok atakującego byłby instant. Każdy panel bez MFA to nie „ryzyko”, tylko „kwestia czasu”.

**5. Miej plan Incident Response (IR) i przećwicz go zanim będzie potrzebny.**
Firmy z tego incydentu **bardzo dobrze zareagowały** — 11 godzin od zawiadomienia do komunikatu, reset haseł, blokada wektora, zgłoszenie do UODO/CERT/CBZC przygotowywane. To benchmark, nie wyjątek. Żeby tak zadziałać, musisz mieć z góry ustalone:

- kto dzwoni do prawnika (RODO: 72h deadline),
- kto pisze do klientów i przez jakie kanały,
- kto resetuje hasła i blokuje dostęp,
- kto rozmawia z mediami (tak, trzeba — unikanie tematu to najgorsza strategia PR).

Jeśli dzisiaj w razie incydentu nie masz na te pytania odpowiedzi w mniej niż 60 sekund, nie masz planu IR. Masz nadzieję, że się nie stanie.

### Czego ten wyciek NIE pokazuje

Parę rzeczy, które łatwo źle zinterpretować:

**„PrestaShop jest niebezpieczny.”** — Nie, nie jest. Sam PrestaShop nie był wektorem. Wymienianie tej platformy w tytule byłoby nieuczciwe. Każdy CMS (Shoper, IdoSell, WooCommerce, Magento) ma tę samą powierzchnię ataku: panele admin, środowiska dev, narzędzia zewnętrzne.

**„Wyciek bez kart płatniczych = pół biedy.”** — Nie. 132 tysiące par {imię, email, telefon, adres} to surowiec dla targetowanego phishingu na lata. Karty się wymienia w 10 minut. Numeru PESEL, adresu domowego i historii zakupów — nie.

**„Zrobię audyt, jak będę miał firmę >50 osób.”** — To myślenie, przez które giną polskie MŚP. vegehome.pl i polskiekoldry.pl to nie są korporacje, tylko średniej wielkości e-commerce — dokładnie taki, jakich w Polsce jest 20 tysięcy. Wyciek uderza ich w najczulsze miejsce: zaufanie klientów, których mają kilkaset tysięcy.

### Co z tego wyniesiesz w 2 minuty

1. Twoja platforma sklepowa (PrestaShop / Shoper / WooCommerce / własna) **nie jest najsłabszym ogniwem**. Najsłabszym ogniwem są **narzędzia wokół niej**: panele admin, środowiska dev, backupy na publicznych subdomenach.
2. **bcrypt uratował te sklepy** przed pełną katastrofą. Zapytaj dostawcę Twojego oprogramowania: „Jakim sposobem zabezpieczacie hasła użytkowników — bcrypt/argon2 czy starsze MD5/SHA-1?”. Jeśli odpowiedź to MD5, SHA-1 albo „nie wiem” — zmieńcie to w tym miesiącu.
3. **Incident Response w 11 godzin** to standard 2026. Jeśli Twój zespół nie ogarnąłby wycieku w 24h, masz o czym myśleć **dzisiaj**, nie po incydencie.

---

**Chcesz sprawdzić, gdzie masz „zapomniane drzwi” u siebie?**
Ai Puls Security robi audyty ekspozycji zewnętrznej — subdomeny, panele, środowiska nieprodukcyjne. Nie nudną prezentację, tylko listę konkretnych rzeczy do natychmiastowego zamknięcia.

Albo zacznij od **[samooceny cyberbezpieczeństwa](/bezpieczenstwo-samoocena/)** — 35 pytań, 10 minut, darmowy raport wskazujący Twoje największe luki, bez rejestracji.

---

**Źródło:**
- <a href="https://cyberdefence24.pl/cyberbezpieczenstwo/wycieki-danych/wyciekly-dane-130-tysiecy-klientow-dwoch-polskich-sklepow" target="_blank" rel="noopener">CyberDefence24: <em>Wyciekły dane 130 tysięcy klientów dwóch polskich sklepów</em></a> — portal, który wykrył i przeanalizował wyciek (publikacja: 13.04.2026).

---
*Autor: Maciej Konieczny, Ai Puls Security*
*Robimy audyty, których nie chcą zobaczyć marketingowcy.*
