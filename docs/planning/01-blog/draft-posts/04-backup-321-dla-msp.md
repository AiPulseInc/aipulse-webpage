---
title: "Backup 3-2-1 dla MŚP — praktyczny setup za mniej niż 200 zł/miesiąc"
slug: "backup-321-praktyczny-setup-msp"
date: "2026-04-13"
updated: "2026-04-13"
excerpt: "Dowiedz się, jak zbudować profesjonalny system kopii zapasowych odporny na ransomware, wykorzystując Synology, Backblaze B2 i mechanizm immutability w budżecie MŚP."
description: "Praktyczny przewodnik po strategii backupu 3-2-1 dla firm: od lokalnego NAS po chmurę z immutability. Sprawdź konkretne ceny i produkty."
category: "Backup"
tags:
  - "backup"
  - "ransomware"
  - "immutability"
  - "nas"
  - "msp"
cover: "./images/hero.jpg"
coverAlt: "Serwerownia z podświetlonymi dyskami twardymi symbolizująca bezpieczeństwo danych"
featured: false
draft: true
author: "Maciej Konieczny"
---

„Mamy backup, przecież Pan Marek co piątek zgrywa wszystko na dysk zewnętrzny” — to zdanie, które jako audytor bezpieczeństwa słyszę w polskich firmach zdecydowanie zbyt często. Zazwyczaj następuje po nim chwila ciszy, kiedy pytam: „A kiedy ostatni raz sprawdzaliście, czy te dane da się odczytać?”.

W świecie współczesnych zagrożeń, gdzie ransomware nie tylko szyfruje Twoje komputery, ale aktywnie szuka kopii zapasowych, by je usunąć, podejście „jakiś backup mam” jest prostą drogą do bankructwa. Według statystyk, ponad 60% małych firm, które utraciły dane w wyniku cyberataku, zamyka działalność w ciągu pół roku.

Nazywam się Maciej Konieczny i w Ai Pulse Security wierzymy, że bezpieczeństwo klasy enterprise nie musi kosztować dziesiątek tysięcy złotych. Dziś pokażę Ci, jak za mniej niż 200 zł miesięcznie zbudować pancerny system oparty o złotą zasadę 3-2-1.

### Czym właściwie jest zasada 3-2-1?

Zasada 3-2-1 to fundament zarządzania ciągłością biznesową. Nie jest to nowa koncepcja, ale w 2026 roku zyskała nowy, kluczowy element: **immutability** (niezmienność).

1.  **3 kopie danych:** Oryginał (to, na czym pracujesz) + dwie kopie zapasowe.
2.  **2 różne nośniki:** Nie trzymaj wszystkiego na jednym serwerze. Jeśli padnie płyta główna lub zasilacz spali dyski, tracisz wszystko. Używamy np. serwera NAS i chmury.
3.  **1 kopia poza siedzibą firmy (Off-site):** Na wypadek pożaru, zalania lub kradzieży. Jedna kopia musi fizycznie znajdować się w innej lokalizacji (najczęściej w chmurze).

### Dlaczego dyski zewnętrzne i pendrive’y to pułapka?

Wielu właścicieli MŚP uważa, że dysk USB w szufladzie załatwia sprawę. Oto dlaczego tak nie jest:

*   **Błąd ludzki:** Pan Marek zapomni. Pan Marek pójdzie na chorobowe. Pan Marek nie zauważy, że dysk od trzech tygodni zgłasza błąd zapisu.
*   **Ransomware:** Nowoczesne wirusy po zainfekowaniu sieci czekają. Skanują otoczenie sieciowe. Jeśli Twój dysk backupowy jest wpięty do komputera lub widoczny jako zasób sieciowy, zostanie zaszyfrowany w pierwszej kolejności.
*   **Zużycie mechaniczne:** Tanie dyski konsumenckie nie są projektowane do pracy ciągłej. Upadek z biurka to koniec Twoich danych.

### Praktyczny Stack: Twój setup za < 200 zł/miesiąc

Zbudujmy system, który działa automatycznie i wybacza błędy.

#### Krok 1: Fundament SaaS (Google Workspace / Microsoft 365)
Większość firm trzyma pocztę i dokumenty w chmurze. To świetne, ale pamiętaj: Google i Microsoft gwarantują dostępność usługi, a nie nienaruszalność Twoich plików. Jeśli pracownik skasuje folder i opróżni kosz, Microsoft Ci go nie odda (po określonym czasie).
*   **Koszt:** Masz to już w cenie licencji (ok. 30-70 zł/użytkownika).

#### Krok 2: Lokalny NAS (Serce systemu)
Kupujemy serwer NAS, np. **Synology DS224+**. To koszt ok. 1500–1600 zł brutto (jednorazowo). Do tego dwa dyski WD Red Plus 4TB (ok. 1000 zł).
**Dlaczego Synology?** Bo w cenie dostajesz oprogramowanie *Active Backup for Business*. Pozwala ono na bezpłatne robienie kopii całych komputerów pracowników, serwerów i kont Microsoft 365/Google Workspace na Twój lokalny dysk.
*   **Amortyzacja sprzętu (na 36 m-cy):** ok. 72 zł/miesiąc.

#### Krok 3: Chmura z „Immutability” (Pancerz)
To tutaj dzieje się magia. Twój NAS co noc wysyła najważniejsze dane do chmury. Polecam **Backblaze B2** lub **Cloudflare R2**.
*   **Cena Backblaze B2:** ok. $0.006 za GB. Za 1TB (1000 GB) zapłacisz ok. 6 USD, czyli ok. **25 zł/miesiąc**.
*   **Cena Cloudflare R2:** Pierwsze 10 GB jest za darmo, powyżej płacisz za odczyt i składowanie (podobnie jak w B2).

### Immutability: Dlaczego to „game changer” w walce z ransomware?

To najważniejsze pojęcie tego artykułu. **Immutability (Object Lock)** to funkcja, która sprawia, że raz zapisany plik w chmurze nie może zostać usunięty ani zmieniony przez nikogo (nawet przez administratora z najwyższymi uprawnieniami) przez określony czas (np. 30 dni).

Jeśli haker włamie się do Twojej firmy, przejmie hasło do NAS-a i wyda polecenie „usuń wszystkie backupy”, chmura mu odpowie: „Przykro mi, te pliki są zablokowane do 15 maja”. Dzięki temu zawsze masz punkt przywracania, którego nie da się zniszczyć.

### Podsumowanie kosztów miesięcznych:

1.  **Amortyzacja NAS (Synology DS224+ + dyski):** 72 zł
2.  **Prąd dla NAS:** ok. 15 zł
3.  **Chmura Backblaze B2 (1TB danych):** 25 zł
4.  **Utrzymanie / Przegląd (Twoje 15 min miesięcznie):** Bezcenne
---
**SUMA: ok. 112 zł netto / miesiąc** (zostaje nam jeszcze zapas na kawę i większą ilość danych!).

### Jak testować restore (i dlaczego co kwartał)?

Backup, którego nie da się przywrócić, nie istnieje. W Ai Pulse Security zalecamy „kwartalne ćwiczenia przeciwpożarowe”.
1.  Wybierz losowy plik z dokumentacji sprzed 2 miesięcy.
2.  Spróbuj go przywrócić z NAS-a.
3.  Spróbuj przywrócić ten sam plik bezpośrednio z chmury (Backblaze).
4.  Zapisz czas, jaki Ci to zajęło. To Twój RTO (Recovery Time Objective).

Jeśli przywrócenie jednego pliku zajmuje Ci 2 godziny, to przywrócenie całej firmy po ataku zajmie tygodnie. Musisz to wiedzieć wcześniej.

### Checklist: „Masz to?”

Sprawdź swoją firmę w 30 sekund:
- [ ] Czy mam co najmniej 3 kopie najważniejszych danych?
- [ ] Czy co najmniej jedna kopia jest fizycznie poza biurem?
- [ ] Czy moje backupy w chmurze mają włączoną funkcję **Object Lock / Immutability**?
- [ ] Czy NAS i chmura mają włączone **MFA (Logowanie dwuskładnikowe)**?
- [ ] Czy w ciągu ostatnich 90 dni zrobiłem testowy odczyt danych?

### Podsumowanie i CTA

Zbudowanie bezpiecznego setupu 3-2-1 dla MŚP to nie jest kwestia technologii NASA, ale dyscypliny i wyboru odpowiednich narzędzi. Za cenę dwóch obiadów na mieście możesz mieć pewność, że w poniedziałek rano Twoja firma będzie istnieć, niezależnie od tego, co wymyślą cyberprzestępcy.

**Nie wiesz, od czego zacząć?** 
W Ai Pulse Security pomagamy wdrażać dokładnie takie rozwiązania. Napisz do nas na [kontakt@aipulse.security], a przeprowadzimy dla Ciebie bezpłatny, 15-minutowy audyt Twojego obecnego systemu backupu. 

Pamiętaj: ludzie dzielą się na tych, którzy robią backupy, i tych, którzy *będą* je robić. Lepiej bądź w tej pierwszej grupie.

---
*Autor: Maciej Konieczny*
*Ai Pulse Security*
