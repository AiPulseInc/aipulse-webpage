---
title: "List od CERT — co znajdują u MŚP"
slug: "list-od-cert-polska-dmarc-msp"
date: "2026-04-18"
updated: "2026-04-18"
excerpt: "CERT Polska bezpłatnie skanuje polskie domeny i wysyła raporty do firm. Wyjaśniam, co dokładnie tam sprawdzają, czemu najczęstszy problem (zła konfiguracja maila) potrafi kosztować dziesiątki tysięcy złotych — i co warto zrobić, zanim trafisz na ich radar."
description: "CERT Polska wysyła do polskich firm bezpłatne raporty bezpieczeństwa. Wyjaśniam bez żargonu, co państwowy zespół skanuje w domenach polskich firm, czemu najczęstszy problem to ryzyko biznesowe, a nie technikalia, i jak rozsądnie zareagować — niezależnie od tego, czy Twój mail od nich już przyszedł."
category: "Email Security"
tags:
  - "cert-polska"
  - "dmarc"
  - "ochrona-poczty"
  - "msp"
  - "audyt"
cover: "/generated/security/blog/list-od-cert-polska-dmarc-msp.jpg"
coverAlt: "Stylizowana koperta z urzędową pieczęcią rozwijająca się w elementy ochrony domeny"
featured: true
draft: false
author: "Maciej Konieczny"
---

W sobotę rano dzwoni do mnie znajomy przedsiębiorca — prowadzi małą firmę produkcyjną pod Warszawą. „Słuchaj, dostałem o 2:27 w nocy maila od jakiegoś `moje@cert.pl`, tytuł 'Wyniki skanowania bezpieczeństwa'. To phishing czy coś prawdziwego?". Spojrzałem. Nie phishing. Krótki, rzeczowy raport o tym, że domena jego firmy ma źle skonfigurowaną ochronę poczty.

To nie była pomyłka i nikt nie próbował niczego wcisnąć. To państwowy zespół CERT Polska zrobił dokładnie to, co robi od kilku lat: bez pytania o pozwolenie przeskanował to, co i tak każdy widzi z internetu, i grzecznie napisał, gdzie u znajomego jest dziura. Bezpłatnie. Bez ukrytego CTA.

Jeśli masz firmę i własną domenę `.pl` — to taki mail mógł już do Ciebie przyjść, a jeśli jeszcze nie, to jest całkiem możliwe, że trafisz na listę w którymś z kolejnych skanów. Niezależnie od tego, czy już go dostałeś, ten artykuł pokaże Ci dwie rzeczy. Po pierwsze: co konkretnie CERT sprawdza i czemu jeden konkretny błąd widzimy u większości firm MŚP, które audytujemy. Po drugie: czemu to nie jest temat „dla informatyka", tylko realne ryzyko finansowe — które warto rozumieć w roli właściciela biznesu, zanim ktoś Ci je wytłumaczy w gorszych okolicznościach.

## Kto to CERT Polska i czemu w ogóle do Ciebie pisze

CERT Polska to zespół przy NASK — instytucji państwowej. Działa od 1996 roku, reaguje na incydenty cyberbezpieczeństwa w polskim internecie. Jednym z ich publicznych projektów jest serwis `moje.cert.pl`. Skanuje on rzeczy widoczne z zewnątrz — bez logowania się do Twoich systemów, bez naruszania prywatności. Trochę tak, jak ktoś, kto chodzi po ulicy i sprawdza, czy w Twoim sklepie nie zostawili otwartego okna na zaplecze.

Jeżeli coś znajdą — wysyłają wiadomość na adres techniczny powiązany z domeną. To nie jest oferta sprzedaży. Nie ma faktury. Nikt Ci niczego nie wciska. To po prostu darmowe ostrzeżenie z oficjalnego źródła.

Stąd dwa wnioski praktyczne:

- **Jeśli dostałeś takiego maila** — to dobra wiadomość. Ktoś odwalił za Ciebie kawałek pracy audytora i wskazał palcem konkretne miejsce do poprawki.
- **Jeśli nie dostałeś** — to nie znaczy, że nie masz problemów. To znaczy najwyżej, że jeszcze nie trafiłeś na ich kolejkę. CERT skanuje cały czas, ale Polska to ponad 2 miliony aktywnych domen `.pl` — kolejka jest długa.

## Co dokładnie sprawdzają

Z analizy publicznych raportów i tego, co krąży po branży, lista skanowanych obszarów wygląda mniej więcej tak: bezpieczeństwo Twojej witryny (czy szyfrowanie HTTPS jest aktualne, czy nie zdradza zbyt wiele), otwarte usługi w internecie (czy gdzieś nie świeci stary panel administratora, czy nie wisi przestarzała wersja serwera) oraz — i to dotyczy zdecydowanej większości raportów — **konfiguracja Twojej poczty firmowej**.

Konkretnie: czy świat zewnętrzny ma jasną informację, kto naprawdę może wysyłać maile w imieniu Twojej domeny. Bo jeśli nie ma — każdy może wysłać maila „od Ciebie".

I właśnie ten ostatni punkt to problem znajomego z raportu. Tak samo jak prawdopodobnie problem większości małych firm, które trafiają do nas na audyt — to zdecydowanie najczęstszy wniosek z pierwszego dnia pracy.

## Co znaleźli u znajomego

Raport wskazał konkretny błąd w konfiguracji jego poczty (domenę zanonimizowałem):

> **Błąd:** `[domena-firmy].pl`: Polityka DMARC jest ustawiona na 'none' i nie ustawiono odbiorcy raportów (...), co oznacza, że ustawienie DMARC nie będzie skuteczne.

Tłumacząc na ludzki: **DMARC** to mechanizm, który mówi serwerom pocztowym Twoich klientów (Gmail, Outlook, poczta korporacyjna) — „cześć, jeśli ktoś próbuje wysłać do was maila rzekomo z mojej domeny, ale nie ma do tego upoważnienia, to nie wpuszczajcie go do skrzynki". To jak instrukcja dla recepcjonistki w biurowcu: kogo wpuszczać, kogo zatrzymywać.

Problem znajomego: instrukcja istnieje, ale jest ustawiona w trybie „obserwuj i zapisuj, ale nikogo nie zatrzymuj". I co gorsza — nawet ta obserwacja nigdzie nie spływa, bo nie wskazano adresu, na który Gmail i Microsoft mają wysyłać codzienne raporty.

To trochę jak zainstalowanie alarmu w sklepie, ale nie podpięcie go ani do syreny, ani do agencji ochrony. Wisi na ścianie, miło to wygląda, w razie kontroli można pokazać palcem — i nic nie robi.

## Czemu to nie jest sprawa „dla informatyka"

Tu jest moment, w którym zwykle właściciel firmy mówi „aha, OK, niech się tym Mariusz z IT zajmie". Stop. Zatrzymaj się na chwilę, bo to nie jest temat IT. To jest temat księgowości, prawa i Twojej osobistej odpowiedzialności. Wyjaśnię na jednym scenariuszu, który widzimy w branży regularnie.

Twój klient — załóżmy duża firma produkcyjna, z którą fakturujesz na sześciocyfrowe kwoty — dostaje maila „od Ciebie". Nadawca wygląda jak `ksiegowosc@twojafirma.pl`. Treść: „Zmieniliśmy numer konta bankowego, prosimy o aktualizację. W załączniku faktura i nowy numer rachunku".

Jeżeli Twoja domena ma poprawnie skonfigurowaną ochronę i działającą politykę DMARC — serwer pocztowy klienta widzi, że to fałszywka, i wiadomość nigdy nie trafia do skrzynki. Sprawa zamknięta, klient nawet nie wie, że ktoś próbował.

Jeżeli ochrony nie ma albo jest w trybie „obserwuj, ale nie blokuj" (jak u znajomego z tego raportu i — co widzimy regularnie — jak u większości MŚP, które trafiają do nas na audyt) — wiadomość wpada do skrzynki klienta jak każda inna. Wygląda autentycznie. Często trafia do głównego folderu, nie do spamu.

Co dzieje się dalej:

1. Klient płaci kilkadziesiąt albo kilkaset tysięcy złotych na konto przestępcy.
2. Orientuje się dwa, trzy tygodnie później, gdy wysyłasz mu monit za niezapłaconą fakturę.
3. Awantura. Wezwania prawników. Pytanie zadane przez sąd albo ubezpieczyciela: kto dołożył należytej staranności?

W tego typu sprawach winą obarcza się tę stronę, której domena była najsłabiej zabezpieczona. Brak ochrony poczty = nie dołożyłeś staranności. Twój ubezpieczyciel cyber, jeśli go masz, chętnie powoła się na wyłączenie z ogólnych warunków. Twój klient — zależnie od umowy — może próbować przerzucić część strat na Ciebie. A Twoja reputacja w tej branży właśnie spadła w cholerę.

To nie hipoteza. Ten mechanizm ma swoją branżową nazwę — **Business Email Compromise (BEC)** — i jest jednym ze scenariuszy, które regularnie widzimy w rozmowach z firmami zgłaszającymi się do nas po incydencie, a także na pierwszych stronach raportów CERT Polska o incydentach zgłaszanych w sektorze biznesowym.

## Sprawdź swoją domenę w naszej bezpłatnej samoocenie

Zanim podejmiesz jakąkolwiek decyzję, zrób prosty test sytuacji wyjściowej. To zajmie kilkanaście minut, bez kont, bez formularzy, bez handlowca dzwoniącego za godzinę.

Wejdź na naszą **bezpłatną samoocenę** [`/bezpieczenstwo-samoocena/`](/bezpieczenstwo-samoocena/). Po krótkim profilowaniu firmy (branża, wielkość) pokażemy Ci opcjonalny krok „Twoja rzeczywista ekspozycja". Wpisujesz tam domenę i klikasz „Skanuj" — w ciągu kilku sekund nasz silnik analizuje publiczne rekordy Twojej domeny: SPF, DMARC (czy istnieje, czy jest w trybie egzekwującym, czy w ogóle ma to ręce i nogi), widoczne subdomeny (z osobnym flagowaniem środowisk dev/staging) i dostawcę poczty.

W raporcie końcowym dostajesz nie tylko status zielono/żółto/czerwono dla każdego obszaru, ale przede wszystkim **interpretację biznesową** — co konkretnie znaczy „DMARC w trybie p=none" dla Twojej firmy, dlaczego ten konkretny błąd kosztuje średnio kilkadziesiąt tysięcy złotych w scenariuszu BEC, i które trzy poprawki dają największy efekt w 30 dni. Plus pełny audyt 35 pytań w pozostałych pięciu kategoriach (backup, MFA, awareness, procesy, compliance) — bo ochrona poczty to tylko jedna z warstw, które dziś sprawdza ubezpieczyciel cyber albo audytor NIS2.

Czarno na białym widzisz, w jakim punkcie jest dziś bezpieczeństwo Twojej firmy. Bez wykładu, bez straszenia, bez DIY-poradnika, którym za miesiąc nikt się nie zajmie.

## Co dalej — trzy ścieżki, w zależności od wyniku

Po przejściu samooceny zwykle są trzy scenariusze:

**Scenariusz pierwszy — wszystko zielone, ochrona poczty działa, wynik ogólny powyżej 75/100.**

Gratulacje, jesteś w mniejszości. Zapisz wynik (najlepiej w prostym dokumencie „nasza konfiguracja bezpieczeństwa") i wróć za pół roku z ponowną samooceną — żeby sprawdzić, czy nic się nie posypało po jakiejś migracji albo zmianie dostawcy. W tym temacie nie potrzebujesz na dziś nic więcej.

**Scenariusz drugi — kilka rzeczy świeci na żółto albo czerwono, ale masz jasny obraz priorytetów z raportu.**

Tutaj masz wybór. Jeśli ufasz, że masz w firmie kogoś, kto zrobi naprawę kompetentnie — zlec mu konkretne pozycje z naszego raportu z deadline'em (tydzień, dwa) i poproś o pisemne potwierdzenie po fakcie. Sprawdzisz to powtarzając samoocenę — wynik powie Ci, czy poprawa była realna, czy „prawie". Jeśli „prawie", a Ty nie umiesz ocenić, czy to wystarczy — patrz scenariusz trzeci. Jeśli nie masz takiej osoby albo zwyczajnie nie chcesz tracić uwagi na koordynację tego tematu — od razu scenariusz trzeci.

**Scenariusz trzeci — wynik jest słaby, nie masz w firmie kompetencji albo pewności, że ktokolwiek to ogarnia poprawnie.**

To dokładnie ten moment, w którym rozmowa z kimś z zewnątrz po prostu się opłaca — bo koszt audytu jest o cały rząd wielkości niższy niż koszt jednej pomyłki typu „faktura na fałszywe konto". W naszej ofercie pierwszym krokiem jest **Audyt Podstawowy** — 3-5 dni roboczych, zdalnie, kończy się raportem zrozumiałym dla właściciela firmy (nie tylko dla IT), z listą priorytetów i konkretnymi rekomendacjami. Ochrona poczty (SPF, DKIM, DMARC) jest standardową częścią audytu, ale rzadko jedynym znaleziskiem — najczęściej wyciągamy 2-3 inne luki, których nikt w firmie nie zauważył. [Zobacz pakiety i co dokładnie obejmują](/security/#section-oferta).

Jeżeli wolisz najpierw porozmawiać niż od razu zamawiać audyt — mamy 30-minutową bezpłatną konsultację, w której wychodzisz z trzema najważniejszymi rekomendacjami **niezależnie od tego, czy potem cokolwiek u nas kupisz**. To nie jest spotkanie sprzedażowe ze slajdami — to konkretna rozmowa o Twojej sytuacji. Umówisz się przez [formularz na stronie kontaktowej](/security/#contact).

## Dlaczego DIY w konfiguracji poczty kończy się zwykle gorzej niż problem wyjściowy

Konfiguracja ochrony poczty wygląda z zewnątrz jak kilka rekordów DNS do dopisania. W praktyce to decyzja infrastrukturalna, która dotyka każdego systemu, z którego Twoja firma wysyła maila: serwera pocztowego, systemu do fakturowania, narzędzia do newslettera, panelu CRM, systemu kadrowo-płacowego, czasem nawet strony WordPress, która potrafi wysłać formularz kontaktowy.

Każda firma ma inny zestaw tych elementów i inną historię zmian dostawców. Wklejenie „standardowego" zestawu rekordów z poradnika, bez audytu tego, co u Ciebie realnie wysyła maile z Twojej domeny, kończy się zwykle w jeden z dwóch sposobów: albo ochrona jest nieszczelna i nic nie blokuje (efekt jak przed naprawą), albo jest za szczelna i Twoje faktury przestają docierać do klientów, bo trafiają do spamu. Naprawia się wtedy coś gorszego, niż się miało na starcie — i robi się to pod presją, bo klient dzwoni z pretensjami, że nie dostał płatności.

Dla właściciela firmy, który nie siedzi w konfiguracji DNS na co dzień, próg ryzyka jest wysoki nieproporcjonalnie do potencjalnej oszczędności. Wiedzieć, że problem istnieje i jakie ma konsekwencje — to rola właściciela. Wpisywanie rekordów do panelu rejestratora — to robota dla kogoś, kto robi to regularnie, zna Twoje środowisko i bierze za to odpowiedzialność.

## Podsumowując — jeden ruch, który warto zrobić dziś

CERT Polska właśnie przypomniał temu znajomemu (i prawdopodobnie też Tobie), że bezpieczeństwo poczty to nie ozdoba ani „nice to have", tylko warstwa, która rozdziela „normalną awarię" od „wpłaciłem cudzy przelew, koniec relacji z kluczowym klientem". Naprawa nie jest droga ani trudna — pod warunkiem, że ktoś ją robi z głową, na bazie audytu Twojego konkretnego środowiska, a nie poradnika z internetu.

**Jeden ruch na dziś** — przejdź naszą [bezpłatną samoocenę](/bezpieczenstwo-samoocena/) wraz z opcjonalnym skanem domeny. Dostajesz pełen obraz: stan ochrony poczty, status w pozostałych pięciu kategoriach (backup, MFA, awareness, procesy, compliance), interpretację biznesową problemów i listę priorytetów na 30 dni. Bez konta, bez płatności, bez handlowca.

Jeśli wolisz porozmawiać przed jakimkolwiek narzędziem — mamy [bezpłatną 30-minutową konsultację](/security/#contact). Wychodzisz z trzema rekomendacjami niezależnie od tego, czy coś u nas zamówisz.

CERT skanuje cały czas. Lepiej znaleźć dziurę u siebie pierwszym — i mieć w ręku raport, który mówi nie tylko *co*, ale i *co dalej*.

---

*Maciej Konieczny prowadzi Ai Pulse Security — zespół audytorski i szkoleniowy specjalizujący się w cyberbezpieczeństwie dla MŚP i jednoosobowych działalności gospodarczych. Pomagamy firmom przejść od „mamy antywirusa" do realnej, mierzalnej ochrony — zrozumiałej dla zarządu, nie tylko dla IT.*
