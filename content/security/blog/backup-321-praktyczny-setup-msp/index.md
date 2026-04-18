---
title: "Backup w małej firmie: zasada 3-2-1 i jedno słowo, którego zwykle brakuje"
slug: "backup-321-praktyczny-setup-msp"
date: "2026-04-13"
updated: "2026-04-18"
excerpt: "„Mamy kopie, Pan Marek co piątek zgrywa na dysk.” Dzisiejszy ransomware na takie zdanie czeka — bo najpierw szuka backupu, dopiero potem szyfruje resztę. W 2026 roku klasyczna zasada 3-2-1 nie wystarcza. Pokazujemy, czego w Twojej firmie prawdopodobnie brakuje — i jak to sprawdzić bez kupowania niczego."
description: "Zasada 3-2-1 dla MŚP — dlaczego sama już nie wystarcza w erze ransomware i czego szukać w firmowym backupie, zanim zrobi to za Ciebie przestępca."
category: "Backup"
tags:
  - "backup"
  - "ransomware"
  - "ciagłość-biznesowa"
  - "msp"
  - "audyt"
cover: "/generated/security/blog/backup-321-praktyczny-setup-msp.jpg"
coverAlt: "Trzy białe izometryczne kostki danych na czarnym tle — dwie razem po lewej, trzecia odizolowana po prawej i otoczona fioletową linią ochronną — symbol architektury 3-2-1 z fizycznie odseparowaną kopią offsite."
featured: false
draft: false
author: "Maciej Konieczny"
---

„Mamy backup, Pan Marek co piątek zgrywa wszystko na dysk zewnętrzny."

To zdanie słyszę w audytach co drugi tydzień. Zwykle następuje po nim chwila ciszy, kiedy pytam: _a kiedy ostatni raz sprawdzaliście, czy te dane da się z powrotem odczytać?_

Odpowiedzi nie dostaję.

W 2020 roku to podejście jeszcze jakoś się trzymało. W 2026 — już nie. Bo współczesny ransomware nauczył się jednej brzydkiej sztuki: zanim zaszyfruje Twoje pliki, _najpierw_ szuka Twojego backupu i go kasuje. Tak, żeby nie było do czego wracać. Tak, żeby jedyną drogą do odzyskania firmy był przelew na portfel kryptowalutowy.

Dobrego backupu nie buduje się wyborem konkretnego serwera ani chmury — to są decyzje, które robi się w kontekście konkretnej firmy, jej branży i skali. Na początek warto natomiast poukładać sobie w głowie, **o co naprawdę chodzi w backupie dla małej firmy** — i jakie trzy pytania możesz dziś zadać swojemu informatykowi, żeby wiedzieć, czy w razie ataku wrócisz do pracy w poniedziałek, czy w przyszłym kwartale.

### Dlaczego akurat teraz zmienia się reguła gry

Kilka lat temu „backup" znaczył mniej więcej tyle: _mam gdzieś kopię, gdyby padł dysk_. I wystarczało. Bo największym zagrożeniem była awaria sprzętu albo pomyłka pracownika.

Dzisiaj zagrożenie wygląda inaczej. W raportach CERT Polska z ostatnich lat (publikowane w corocznym [Raporcie CERT](https://www.cert.pl/publikacje/)) ransomware konsekwentnie zajmuje czołowe miejsce wśród incydentów zgłaszanych przez firmy. Co ważniejsze — zmieniła się taktyka atakujących. Nowoczesne grupy ransomware nie uderzają w plikach od razu. Najpierw:

1. Włamują się do sieci, często przez phishing albo niezałatany serwer.
2. Spędzają w niej kilka dni (czasem tygodni), rozglądając się.
3. Szukają kopii zapasowych — dysków USB wpiętych na stałe, udziałów sieciowych, kont w chmurze.
4. Kasują lub szyfrują backupy jako pierwsze.
5. Dopiero wtedy uruchamiają szyfrowanie na środowisku produkcyjnym i wyświetlają żądanie okupu.

To jest inna szachowa gra. I stare reguły typu „co piątek zgrywamy na zewnętrzny dysk" w tej grze nie działają — bo Twój zewnętrzny dysk, jeśli jest podpięty do komputera lub widoczny w sieci, _jest częścią sieci_. A to znaczy, że przestępca dotrze do niego razem z resztą.

### Zasada 3-2-1 po ludzku

Zasada 3-2-1 nie jest nowa — w świecie IT funkcjonuje od lat. Ale w większości firm MŚP, które trafiają do nas na audyt, jeden z trzech warunków jest niespełniony. Oto ona bez branżowego bełkotu:

**3 — Trzy kopie Twoich danych.** Oryginał, na którym pracujesz, plus dwie kopie zapasowe. Nie jedna. Dwie.

**2 — Na dwóch różnych rodzajach nośnika.** Jeśli wszystko jest na jednym serwerze i serwer padnie — tracisz wszystko. Idea jest taka, żeby awaria jednego elementu nie dotykała kopii. Prosta analogia: nie wkładaj paszportu, dowodu i prawa jazdy do tego samego portfela przed wyjazdem.

**1 — Jedna kopia poza biurem.** Pożar, zalanie, kradzież laptopa razem z dyskiem USB w torbie — scenariusze, w których wszystko, co masz fizycznie w jednym miejscu, znika jednocześnie. Dlatego jedna kopia musi być gdzieś indziej. Zwykle w chmurze.

Wszystkie trzy warunki muszą być spełnione jednocześnie. Spełnienie dwóch z trzech to _nie jest_ backup 3-2-1. To backup 2-1-1 — i dokładnie z takim spotykamy się najczęściej w firmach, które potem do nas dzwonią po ataku.

### Element, którego nie było w oryginalnej zasadzie — niezmienność

Tu zaczyna się rzecz, którą wielu właścicieli firm słyszy po raz pierwszy.

Wyobraź sobie, że masz w biurze sejf. Wkładasz do niego dokumenty raz dziennie. Dobre rozwiązanie? W teorii tak. Ale co, jeśli przestępca — już w Twoim biurze — zna szyfr? Wtedy sejf nie jest sejfem. Jest szufladą z ładnym zamkiem.

Dokładnie tak wygląda backup bez niezmienności. Masz kopie w chmurze. Świetnie. Ale jeśli przestępca przejmie Twoje hasło do panelu tej chmury (a w 2026 roku to jest _pierwsza_ rzecz, której szuka), może tam wejść i te kopie skasować. Zanim zdążysz się zorientować.

**Niezmienność (po angielsku _immutability_)** to funkcja dostępna w większości profesjonalnych usług chmurowych do backupu. W skrócie: raz zapisany plik nie może być usunięty ani zmieniony przez _nikogo_ — nawet przez Ciebie, nawet przez administratora z pełnymi uprawnieniami — przez określony czas (np. 30 lub 90 dni).

To dzisiaj kluczowy mechanizm obronny przeciw ransomware. Jeśli Twój system backupu tego nie ma, nie jest on przygotowany na rok 2026 i dalej. Kropka.

W audytach to jest jedno z pierwszych pytań, które zadajemy. Zaskakująco często odpowiedź brzmi: _nie wiem, zapytamy informatyka_.

### Backup, którego nie testujesz, nie istnieje

Żeby było jasne: _backup, którego nie testujesz, to nie jest backup. To jest nadzieja zapisana na dysku._

W firmach, które obserwujemy w praktyce, test przywracania danych jest najczęściej pomijanym krokiem — nawet w miejscach, które mają wszystko inne zrobione poprawnie. Dlaczego? Bo nic się nie dzieje. Kopie się robią. Lampka na serwerze mruga. Informatyk mówi, że „wszystko śmiga". Po co tracić czas.

Aż do dnia, kiedy trzeba przywrócić faktury z zeszłego miesiąca — i okazuje się, że:

- kopie z ostatnich dwóch tygodni są uszkodzone,
- hasło do archiwum zapisał pracownik, który odszedł,
- przywrócenie jednego folderu zajmuje 6 godzin, bo chmura naliczy opłatę za odczyt wstecz,
- albo po prostu nikt w firmie nie wie, jak się tego od strony technicznej dokonuje.

Zasada jest prosta: **raz na kwartał, ktoś w Twojej firmie powinien odtworzyć losowy plik sprzed dwóch miesięcy — z każdego miejsca, gdzie trzymasz backup**. I zmierzyć, ile to zajęło.

Ten pomiar to jest dokładnie to, ile potrwa przywrócenie firmy po ataku. Jeśli przywrócenie jednego pliku zajmuje 2 godziny, przywrócenie wszystkich faktur, dokumentów i baz danych zajmie tygodnie. I właśnie tyle kosztuje Cię ransomware — nie okupem, a przestojem.

### Pięć pytań, które warto zadać swojemu informatykowi w tym tygodniu

Bez wchodzenia w techniczne szczegóły:

1. **Czy mamy trzy kopie najważniejszych danych (nie wliczając oryginału w komputerach pracowników)?**
2. **Czy przynajmniej jedna kopia jest fizycznie poza biurem — na przykład w chmurze?**
3. **Czy ta kopia w chmurze ma włączoną funkcję niezmienności (immutability / object lock)?** Jeśli pytanie wywoła zdziwienie — to już jest odpowiedź.
4. **Kiedy ostatni raz ktoś z nas przywracał jakikolwiek plik z backupu, żeby sprawdzić, że to w ogóle działa?**
5. **Czy logowanie do konsoli zarządzającej backupem jest chronione dwuskładnikowo?** (Czyli oprócz hasła — jeszcze kod z telefonu).

Pięć pytań. Dziesięć minut rozmowy. A potencjalnie różnica między „w poniedziałek jesteśmy na rynku" a „w poniedziałek wyłączamy firmę na pół roku".

### Dlaczego ten tekst nie kończy się listą zakupów

Bo budowanie dobrego backupu dla firmy to nie jest kwestia wyboru sprzętu. To kwestia **wyboru modelu ryzyka**, _zanim_ wybierze się sprzęt.

Inaczej zabezpieczasz biuro rachunkowe z trzema stanowiskami, inaczej kancelarię prawną z archiwum klienckim sprzed dwudziestu lat, inaczej sklep internetowy z bazą zamówień i danymi płatnościowymi. Cena nie jest głównym parametrem — zdolność do przywrócenia firmy w rozsądnym czasie jest.

W audycie Ai Pulse Security przeglądamy dokładnie to:

- co, gdzie i jak często jest kopiowane,
- czy kopie są rzeczywiście niezmienne, czy tylko _nazywane_ backupem,
- ile zajmie przywrócenie każdej warstwy firmy po ataku,
- kto ma dostęp do panelu backupu i jak ten dostęp jest chroniony,
- oraz czy cały system ma sens biznesowy względem Twojej branży i skali.

Wynikiem jest [raport zrozumiały dla właściciela firmy — nie tylko dla IT](/security/#section-oferta), z trzema najważniejszymi rekomendacjami w kolejności od „zrób w tym tygodniu" do „zaplanuj w kwartale".

### Jak to sprawdzić w swojej firmie — bez wydawania złotówki

Jeśli chcesz zrobić pierwszy krok sam, zanim w ogóle pomyślisz o rozmowie z kimś zewnętrznym — mamy do tego [bezpłatną samoocenę bezpieczeństwa](/bezpieczenstwo-samoocena/). 10 pytań, 15 minut, natychmiastowy wynik. Backup jest jedną z sekcji — zobaczysz w niej czarno na białym, czy Twoja firma jest bliżej „mamy to ogarnięte" czy „jest o czym rozmawiać".

Jeśli wolisz, żeby ktoś przyjrzał się temu z Tobą — [Audyt Podstawowy](/security/#section-oferta) trwa 3–5 dni roboczych, obejmuje backup razem z resztą firmowego bezpieczeństwa i zaczyna się od [bezpłatnej 30-minutowej rozmowy, podczas której dostaniesz trzy najważniejsze rekomendacje — nawet jeśli nie zdecydujesz się na audyt](/security/#contact).

Jest jeszcze trzecia droga. Jeśli wiesz, że właśnie teraz dzieje się coś złego — skasowane pliki, ktoś pisze o okupie, podejrzane zachowanie systemu — nie czytaj postów na blogu. Zadzwoń do nas. To, co w takiej sytuacji robi się w pierwszych godzinach, decyduje o skali strat w następnych tygodniach.

---

Ludzie dzielą się na tych, którzy mają przetestowane backupy, i tych, którzy dopiero się o tym dowiedzą w najgorszym możliwym momencie. Lepiej być w tej pierwszej grupie _zanim_ Pan Marek wróci z urlopu.

---
_Autor: Maciej Konieczny_
_Ai Pulse Security_
