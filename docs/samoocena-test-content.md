# Samoocena cyberbezpieczeństwa Ai Pulse — pełna treść

**Źródło:** `src/samoocena/questions.json` + `awareness-questions.json`  
**Wersja pytań:** 1  
**Pytania:** 35 (w 5 kategoriach)  
**Awareness quiz:** 4 pytań

> Ten plik jest generowany programowo. Edytuj `questions.json` / `awareness-questions.json`, nie ten plik.

---

## Kategorie

| ID | Nazwa | Opis |
|----|-------|------|
| A | Ludzie | Pracownicy są pierwszą linią obrony. Około 82% udanych ataków zaczyna się od człowieka — kliknięty link, podejrzany załącznik, telefon z "banku". Trening i jasne procedury zgłaszania zmniejszają to ryzyko bardziej niż jakiekolwiek narzędzie. |
| B | Dane | Co się stanie, jeśli jutro ransomware zaszyfruje wszystkie Twoje dane? Backup, szyfrowanie, retencja i kontrola dostępu to cztery filary, bez których firma po incydencie nie wstaje. |
| C | Infrastruktura | MFA, aktualizacje, hardening sieci, EDR. Podstawy technicznej higieny — bez nich najlepsze procesy nie uratują przed automatycznym atakiem wykorzystującym znaną podatność sprzed sześciu miesięcy. |
| D | Procesy | Incydent się wydarzy — pytanie brzmi, czy wiesz, kogo dzwonić o 3 w nocy. Plan reagowania, logi, testy, odpowiedzialność. Przechodzenie z reaktywnego trybu w proaktywny. |
| E | Compliance | Polski rynek regulacyjny: KSC, NIS2, RODO. Nawet jeśli nie jesteś "podmiotem kluczowym", Twój klient z NIS2 wymusi na Tobie standardy w ramach audytu łańcucha dostaw. Lepiej przygotować się wcześniej niż reagować pod presją. |

## Poziomy dojrzałości

| Key | Label | Zakres % | Opis |
|-----|-------|----------|------|
| `initial` | **Initial (Krytyczny)** | 0–25 | Brak podstawowych zabezpieczeń. Wysokie ryzyko paraliżu firmy w razie ataku. |
| `developing` | **Developing (Podstawowy)** | 26–50 | Pewne narzędzia są, brak procesów. Podatność na masowe ataki. |
| `managed` | **Managed (Stabilny)** | 51–75 | Dobra higiena cyfrowa. Spełnia większość wymagań ubezpieczycieli. |
| `optimized` | **Optimized (Lider)** | 76–100 | Gotowość na NIS2, proaktywne podejście do ryzyka. |

---

## Pytania — samoocena maturity

### Kategoria A — Ludzie

#### A1. Jak często pracownicy przechodzą szkolenia z cyberbezpieczeństwa (phishing, hasła, inżynieria społeczna)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nigdy lub rzadziej niż raz na 2 lata. |
| 2 | `1` | Raz w roku, w formie prezentacji lub e-learningu. |
| 3 | `3` | Minimum co pół roku + testy kontrolowanego phishingu. |

#### A2. Czy pracownicy wiedzą, komu i jak zgłosić podejrzany e-mail, telefon lub incydent?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie wiadomo — prawdopodobnie skasowaliby wiadomość albo przesłali koledze. |
| 2 | `1` | Jest ogólna wiedza "zgłoś do IT", ale brak formalnej procedury. |
| 3 | `3` | Jest jasny kanał zgłoszeń (dedykowany e-mail, przycisk w Outlooku), z którego faktycznie korzystają. |

#### A3. Jak firma wymusza używanie silnych, unikalnych haseł?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Pracownicy używają tych samych haseł w różnych miejscach, czasem zapisują je na karteczkach. |
| 2 | `1` | Jest polityka haseł, ale bez centralnego narzędzia — każdy radzi sobie sam. |
| 3 | `3` | Firmowy menedżer haseł (np. 1Password, Bitwarden) jest wymagany i opłacony dla wszystkich. |

#### A4. Co dzieje się z dostępami pracownika w dniu, w którym kończy on współpracę z firmą?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Zwykle ktoś pamięta, żeby wyłączyć konto — często po kilku dniach lub tygodniu. |
| 2 | `2` | Jest checklist offboardingu, ale wykonanie zależy od działu HR. |
| 3 | `3` | Wyłączenie dostępów uruchamia się automatycznie w dniu zakończenia umowy (integracja HR–IT). |

#### A5. Czy pracownicy używają prywatnych urządzeń (laptopów, telefonów) do pracy i jak firma to kontroluje?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Tak, używają prywatnych urządzeń bez żadnej kontroli. |
| 2 | `2` | Tak, ale obowiązuje polityka BYOD (hasło, szyfrowanie). |
| 3 | `3` | Nie — tylko urządzenia firmowe z MDM, lub BYOD z wymuszoną separacją danych firmowych. |

#### A6. Jak firma zarządza uprawnieniami administracyjnymi (kto ma konto administratora)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Wszyscy pracownicy mają uprawnienia administratora na swoich komputerach "dla wygody". |
| 2 | `2` | Uprawnienia administratora ma 1–2 osoby z IT, reszta korzysta z kont użytkownika. |
| 3 | `3` | Konto administratora jest oddzielne od codziennego (nie używane do maili, przeglądania) i używane tylko do zadań administracyjnych. |

#### A7. Czy zespół księgowości i finansów jest przeszkolony w zakresie ataków BEC (Business Email Compromise) — fałszywe przelewy, fałszywe faktury?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie — przelew zatwierdza pierwsza osoba, która zobaczy e-mail. |
| 2 | `1` | Jest świadomość ryzyka, ale brak formalnej procedury weryfikacji. |
| 3 | `3` | Przelewy powyżej ustalonej kwoty wymagają weryfikacji głosowej lub akceptacji dwóch osób. |

### Kategoria B — Dane

#### B1. Czy firma ma kopie zapasowe kluczowych danych przechowywane poza siecią firmową (offline lub w chmurze z immutability)?

*waga: 2.0 · ⚠️ **CRITICAL***

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie robimy backupu albo backup jest na pendrive lub dysku stale podpiętym do komputera. |
| 2 | `1` | Backup robi się automatycznie, ale nigdy nie testowaliśmy odtworzenia. |
| 3 | `3` | Backup zgodny z regułą 3-2-1 (3 kopie, 2 media, 1 offsite) + regularne testy odtwarzania. |

#### B2. Kiedy ostatnio firma faktycznie odtwarzała dane z backupu (test, nie incydent)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie pamiętam. |
| 1 | `0` | Nigdy. |
| 2 | `1` | Ponad rok temu. |
| 3 | `3` | W ciągu ostatnich 6 miesięcy, z udokumentowanym wynikiem. |

#### B3. Czy dyski laptopów i telefonów służbowych są szyfrowane (BitLocker, FileVault, szyfrowanie Androida/iOS)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie / tylko niektóre urządzenia. |
| 2 | `2` | Tak, na laptopach firmowych — ale telefony nie są weryfikowane. |
| 3 | `3` | Wszystkie urządzenia firmowe mają wymuszone szyfrowanie przez politykę MDM. |

#### B4. Czy firma prowadzi aktualną listę osób z dostępem do najważniejszych danych (klienci, finanse, dane osobowe)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie ma pełnej listy — dostępy urosły historycznie i nikt ich nie weryfikuje. |
| 2 | `1` | Znamy listę w przybliżeniu, ale nie weryfikujemy jej okresowo. |
| 3 | `3` | Prowadzimy aktywny przegląd uprawnień (access review) minimum raz na pół roku. |

#### B5. Jak firma klasyfikuje dane (co jest poufne, co publiczne, co wrażliwe w rozumieniu RODO)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Brak klasyfikacji — wszystko leży razem. |
| 2 | `1` | Mamy ogólne pojęcie, ale bez formalnej klasyfikacji. |
| 3 | `3` | Dane są oznaczone lub skategoryzowane, poufne trafiają do osobnych folderów lub systemów. |

#### B6. Jak długo firma przechowuje dane pracowników i klientów po zakończeniu współpracy?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | W nieskończoność — nikt nigdy nie kasuje danych. |
| 2 | `1` | Usuwamy ręcznie, gdy ktoś przypomni. |
| 3 | `3` | Obowiązuje polityka retencji zgodna z RODO — usuwanie automatyczne lub planowane w kalendarzu. |

#### B7. Jak firma udostępnia pliki zewnętrznym kontrahentom?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Załącznikami w mailach albo przez prywatny Dysk / WeTransfer. |
| 2 | `1` | Przez firmowy SharePoint / Drive z linkiem typu "każdy, kto ma link". |
| 3 | `3` | Przez linki z datą wygaśnięcia zawężone do konkretnych adresów e-mail, z wymuszonym logowaniem. |

### Kategoria C — Infrastruktura

#### C1. W ilu systemach firmowych (poczta, CRM, bankowość, VPN, chmura) wdrożone jest uwierzytelnianie dwuetapowe (MFA)?

*waga: 2.0 · ⚠️ **CRITICAL***

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | W żadnym albo tylko w banku. |
| 2 | `2` | W najważniejszych (poczta, VPN) — reszta zależy od pracownika. |
| 3 | `3` | Wszędzie, gdzie to technicznie możliwe, wymuszone politycznie. |

#### C2. Czy systemy operacyjne i aplikacje są regularnie aktualizowane (patch management)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Pracownicy sami decydują, kiedy instalować aktualizacje. |
| 2 | `2` | Aktualizacje instalują się automatycznie, ale bez weryfikacji, czy faktycznie się zastosowały. |
| 3 | `3` | Centralny patch management z raportami i priorytetem na krytyczne CVE w mniej niż 72 godziny. |

#### C3. Jakie narzędzie chroni endpointy (laptopy, serwery) przed złośliwym oprogramowaniem?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Windows Defender na ustawieniach domyślnych lub darmowy antywirus. |
| 2 | `2` | Komercyjny antywirus zarządzany centralnie. |
| 3 | `3` | EDR lub XDR (np. Defender for Endpoint, SentinelOne, CrowdStrike) z monitoringiem. |

#### C4. Jak zabezpieczona jest sieć firmowa i Wi-Fi?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Używamy domyślnych ustawień routera od dostawcy internetu. |
| 2 | `2` | Zmieniliśmy hasło Wi-Fi, mamy osobną sieć gościnną. |
| 3 | `3` | Firewall nowej generacji + osobne VLAN-y: sieć firmowa, gościnna, IoT. |

#### C5. Czy pracownicy pracujący zdalnie łączą się przez VPN lub Zero Trust?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Łączą się bezpośrednio, publiczne Wi-Fi w kawiarni to norma. |
| 2 | `1` | Mamy VPN, ale nie wszyscy z niego korzystają. |
| 3 | `3` | VPN wymuszony polityką urządzenia lub Zero Trust Network Access (np. Cloudflare, Tailscale). |

#### C6. Czy firma ma aktualny spis (inwentarz) urządzeń i oprogramowania używanego w firmie?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie — nikt nie wie, ile laptopów jest w obrocie. |
| 2 | `1` | Mamy Excel z listą, ale nie zawsze jest aktualny. |
| 3 | `3` | Automatyczny inwentarz (np. Intune, Jamf) z alertami o nowych urządzeniach. |

#### C7. Czy systemy poczty i chmury są zabezpieczone przed spoofingiem domeny (SPF, DKIM, DMARC)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie mam pojęcia, o co chodzi. |
| 2 | `1` | Mamy SPF, ale DMARC jest nieskonfigurowany lub ustawiony na p=none. |
| 3 | `3` | SPF + DKIM + DMARC w trybie p=quarantine lub p=reject, monitorujemy raporty. |

### Kategoria D — Procesy

#### D1. Czy firma ma spisany i przetestowany plan reagowania na incydent (Incident Response Plan)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie — liczymy na informatyka wewnętrznego lub zewnętrznego. |
| 2 | `1` | Mamy ogólne wytyczne, ale nie były testowane. |
| 3 | `3` | Tak, z listą kontaktów 24/7, testowany symulacją minimum raz w roku. |

#### D2. Gdyby teraz wydarzył się atak ransomware, do kogo firma zadzwoni najpierw?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem. |
| 1 | `0` | Nie wiadomo — najpierw do Google. |
| 2 | `1` | Do informatyka wewnętrznego lub zewnętrznego — numer mamy w telefonie. |
| 3 | `3` | Mamy playbook: IT, CSIRT (NASK/MON/MSWiA), prawnik, ubezpieczyciel, CEO. Numery dostępne także offline. |

#### D3. Czy logi z kluczowych systemów są zbierane centralnie i regularnie przeglądane?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie zbieramy logów albo są tylko lokalnie na serwerach. |
| 2 | `1` | Logi są zbierane, ale nikt ich regularnie nie przegląda. |
| 3 | `3` | Centralny SIEM lub log aggregator z regułami alertującymi o anomaliach. |

#### D4. Czy firma testuje swoje zabezpieczenia (pentest, symulacja phishingu, tabletop exercise)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nigdy. "Wszystko działa, więc po co?" |
| 2 | `1` | Raz na kilka lat robimy test phishingowy. |
| 3 | `3` | Roczny pentest + regularne symulacje phishingu + tabletop z zarządem. |

#### D5. Czy firma ma polityki bezpieczeństwa spisane i dostępne dla pracowników?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie — albo są gdzieś w mailach i nikt nie pamięta gdzie. |
| 2 | `1` | Są spisane, ale pracownicy ich nigdy nie czytali. |
| 3 | `3` | Polityki są w firmowym wiki, aktualizowane, zapoznanie jest wymagane przy onboardingu. |

#### D6. Kto w firmie odpowiada za cyberbezpieczeństwo?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nikt konkretny — wszyscy i nikt. |
| 2 | `1` | Dział IT, ale to tylko jedna z wielu rzeczy na ich liście. |
| 3 | `3` | Wyznaczona osoba (CISO / Security Officer) lub zewnętrzny vCISO z jasnym zakresem obowiązków. |

#### D7. Czy zarząd regularnie otrzymuje raport o stanie cyberbezpieczeństwa?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie — zarząd dowiaduje się, gdy coś wybuchnie. |
| 2 | `1` | Raz w roku, przy okazji planowania budżetu. |
| 3 | `3` | Kwartalny raport z KPI: incydenty, szkolenia, patche, wyniki pentestów. |

### Kategoria E — Compliance

#### E1. Czy firma wie, czy jest objęta NIS2 lub KSC (jako podmiot kluczowy, ważny, lub dostawca podmiotu objętego)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie — zakładamy, że nas to nie dotyczy. |
| 2 | `1` | Słyszeliśmy o NIS2, ale nie zrobiliśmy formalnej analizy applicability. |
| 3 | `3` | Mamy udokumentowaną analizę i plan zgodności (lub udokumentowany status "poza zakresem"). |

#### E2. Czy firma ma rejestr czynności przetwarzania danych osobowych (RODO Art. 30)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie mamy albo nie wiemy, co to jest. |
| 2 | `1` | Mamy, ale nie był aktualizowany od wdrożenia RODO w 2018 roku. |
| 3 | `3` | Rejestr jest aktywny i aktualizowany przy każdej zmianie procesu lub systemu. |

#### E3. Czy firma weryfikuje poziom bezpieczeństwa swoich kluczowych dostawców IT / Cloud / SaaS?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie — ufamy dużym dostawcom bez weryfikacji. |
| 2 | `1` | Sprawdzamy tylko zapisy w umowach (DPA, SLA). |
| 3 | `3` | Wymagamy certyfikatów (ISO 27001, SOC 2) lub przeprowadzamy własne security assessment. |

#### E4. Czy firma ma spisaną procedurę zgłaszania naruszeń — do UODO (72 godziny) i, jeśli dotyczy, do CSIRT (24 godziny)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie mamy — nie wiemy, jak się zgłasza. |
| 2 | `1` | Mamy procedurę na papierze, ale nie była testowana. |
| 3 | `3` | Procedura z jasnymi terminami, przetestowana w ramach tabletop exercise. |

#### E5. Czy firma ma wykupione ubezpieczenie cyber (cyber insurance)?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie mamy. |
| 2 | `1` | Mamy polisę, ale nie znamy szczegółowych warunków i wyłączeń. |
| 3 | `3` | Mamy polisę dopasowaną do ryzyka i znamy wymagania (MFA, backup, szkolenia). |

#### E6. Czy umowy z pracownikami i kontrahentami zawierają klauzule dotyczące bezpieczeństwa i poufności?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Używamy standardowej NDA pobranej z internetu, bez specyfiki branżowej. |
| 2 | `1` | Mamy NDA, ale bez szczegółowych zapisów o bezpieczeństwie IT. |
| 3 | `3` | Umowy zawierają wymagania bezpieczeństwa, obowiązek zgłaszania incydentów, prawo audytu. |

#### E7. Czy w firmie wyznaczono Inspektora Ochrony Danych (IOD / DPO), jeśli dotyczy?

*waga: 1.0*

| # | Score | Odpowiedź |
|---|-------|-----------|
| 0 | `0` | Nie wiem / nie jestem pewny. |
| 1 | `0` | Nie wiemy, czy nas to dotyczy, i nikogo nie wyznaczyliśmy. |
| 2 | `1` | Wyznaczyliśmy kogoś pro forma (np. prezesa), ale bez formalnego przeszkolenia. |
| 3 | `3` | IOD ma odpowiednie kwalifikacje lub korzystamy z zewnętrznego DPO as a Service. |

---

## Awareness quiz (orientacyjny test wiedzy)

Liczba pytań: 4

#### AW1. W ciągu jakiego czasu od wykrycia naruszenia ochrony danych osobowych musisz zgłosić incydent do Prezesa UODO?

- [0] 24 godziny
- [1] 48 godzin
- [2] 72 godziny
- [3] 7 dni
- [4] Nie wiem / nie jestem pewny

> **Wyjaśnienie:** Termin to **72 godziny od momentu wykrycia naruszenia** — nie od samego zdarzenia. Liczy się chwila, w której dowiadujesz się, że coś poszło nie tak (np. po telefonie od pracownika, który zobaczył coś podejrzanego). Jeśli nie zdążysz w 72h, musisz dodatkowo wyjaśnić Prezesowi UODO przyczynę opóźnienia. Skomplikowane przypadki można zgłaszać etapami (zgłoszenie wstępne + uzupełnienia), ale ten 72h zegar tyka od pierwszej informacji.

#### AW2. Twoja firma padła ofiarą ransomware. Komu OPRÓCZ Prezesa UODO musisz / powinieneś zgłosić incydent?

- [0] Tylko Policji
- [1] CERT Polska + (CSIRT NASK / GOV / MON właściwy dla sektora)
- [2] Tylko swojemu ubezpieczycielowi cyber
- [3] Nikomu poza UODO
- [4] Nie wiem / nie jestem pewny

> **Wyjaśnienie:** Pełen łańcuch zgłoszenia poważnego incydentu cyber w Polsce (2026): **CERT Polska (NASK)** — punkt kontaktowy dla MŚP i podmiotów spoza administracji; **CSIRT GOV** — administracja publiczna; **CSIRT MON** — sektor obronny; **CSIRT sektorowy** (np. KNF dla finansów) — jeśli dotyczy. Dodatkowo: UODO (gdy są dane osobowe), ubezpieczyciel cyber (jeśli masz polisę — często obowiązek umowny w 24h), Policja/CBZC (gdy podejrzewamy czyn karalny ścigany z urzędu — wymuszenie, oszustwo). NIS2 wymaga zgłoszenia wstępnego w 24h i pełnego raportu w 72h.

#### AW3. Jaka jest maksymalna kara za poważne naruszenie RODO dla średniej firmy w Polsce?

- [0] 100 tysięcy złotych
- [1] 1 milion złotych
- [2] Do 4% rocznego globalnego obrotu lub 20 milionów EUR (kwota wyższa)
- [3] Do wysokości udokumentowanej szkody klientów
- [4] Nie wiem / nie jestem pewny

> **Wyjaśnienie:** **4% rocznego globalnego obrotu LUB 20 milionów EUR — kwota wyższa.** To górna granica dla najpoważniejszych naruszeń (np. brak podstawy prawnej przetwarzania, naruszenie praw osób). Mniejsze naruszenia: do 2% obrotu lub 10 mln EUR. Realne polskie kary 2024-2025: Morele.net 2,8 mln zł, ID Finance 1 mln zł, Toyota Bank 1 mln zł — i to wszystko za błędy bezpieczeństwa technicznego, nie za zaniechanie zgłoszenia. Plus: kara dla MŚP nie jest „wirtualna” — UODO konsekwentnie wymierza kary proporcjonalne do możliwości finansowych firmy.

#### AW4. Pracownik zgubił służbowy laptop z bazą klientów. Laptop NIE był szyfrowany. Czy to wymaga zgłoszenia do UODO?

- [0] Nie, to drobny incydent operacyjny
- [1] Tylko jeśli laptop trafi w niepowołane ręce (potwierdzony fakt)
- [2] Tak — utrata kontroli nad nośnikiem z danymi osobowymi to naruszenie wymagające oceny i zgłoszenia
- [3] Tylko jeśli baza miała ponad 1000 osób
- [4] Nie wiem / nie jestem pewny

> **Wyjaśnienie:** **Tak.** Naruszenie ochrony danych (RODO Art. 4(12)) to **utrata kontroli, dostępności, integralności lub poufności danych** — niezależnie od tego, czy ktoś faktycznie z nich skorzystał. Brak szyfrowania = brak skutecznych środków technicznych = wysokie prawdopodobieństwo ryzyka dla osób. Zgłoszenie: 72h do UODO + powiadomienie samych osób, jeśli ryzyko jest „wysokie”. Polityka „nie zgłaszamy, bo może nikt nie znajdzie” = **dodatkowe naruszenie obowiązku informacyjnego** — kara potrafi być wyższa niż za samo wycieknięcie. Gdyby laptop był zaszyfrowany silnym hasłem (FileVault, BitLocker), zgłoszenie wciąż jest wymagane, ale ryzyko jest niskie i często wystarczy wpis do wewnętrznego rejestru.

---

## Logika scoringu (z `scoring.js`)

1. **Per kategoria:** suma `option.score × question.weight` ÷ max możliwy w kategorii × 100%
2. **Overall:** suma wszystkich `earned` ÷ suma wszystkich `max` × 100%
3. **Maturity level:** dopasowanie overall % do `maturity_levels[].min/max`
4. **Critical guardrail:** jeśli **wszystkie** pytania oznaczone `critical: true` mają score 0 — maturity jest ograniczony do `developing` (nawet jeśli overall % by sugerował wyżej)

**Uwaga anti-gaming:** w obecnej wersji ostatnia opcja w każdym pytaniu ma najwyższy score. Wybierając zawsze ostatnią opcję user dostaje 100% (trywialnie hackowalne). Do rozważenia: randomizacja kolejności opcji per-pytanie per-sesja.
