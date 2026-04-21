Tak. Ten kwestionariusz nadaje się jako lead magnet i sensowny pre-audit, ale bardziej jako narzędzie do rozmowy o ryzyku i higienie cyber niż jako wierny „symulator” realnego underwritingu cyber insurance w Polsce. Innymi słowy: dobry na wejście, słabszy jako narzędzie do przewidzenia, czy broker lub ubezpieczyciel powie „tak, dajemy ofertę”.    

Mój werdykt ogólny: 7/10 jako lead magnet, 6/10 jako pre-audit do ubezpieczenia.
Jest dobrze napisany, logicznie ułożony i dotyka fundamentów, które naprawdę interesują rynek cyber: MFA, backup, EDR, szkolenia, BEC, szyfrowanie, offboarding, procedury incydentowe i podstawy compliance. To są dokładnie te obszary, które regularnie pojawiają się w formularzach underwritingowych i materiałach przygotowujących do odnowienia polisy.    

Najmocniejsza rzecz w tym zestawie jest taka, że nie ucieka w akademickie ozdobniki, tylko pyta o rzeczy, które faktycznie redukują ryzyko szkody. Szczególnie trafne są pytania o backup i testy odtworzenia, MFA, ochronę endpointów, BEC, kontrolę uprzywilejowanych dostępów, offboarding i kanał zgłaszania incydentów. To bardzo dobrze odpowiada temu, czego zwykle szukają ubezpieczyciele: kontroli przeciw ransomware, przejęciu kont, fraudom płatniczym i chaosowi po incydencie.    

Druga mocna rzecz: podział na Ludzie, Dane, Infrastruktura, Procesy, Compliance jest dobry dydaktycznie i handlowo. Dla lead magnetu to działa, bo właściciel firmy widzi, że temat nie kończy się na „czy mamy antywirusa”, co ludzkość odkrywa z godnym podziwu opóźnieniem.  

Teraz ważniejsze: gdzie to nie dowozi jako pre-audit do cyber insurance.

Po pierwsze, kwestionariusz jest bardziej maturity-oriented niż underwriting-oriented. Realne formularze underwritingowe, oprócz samych zabezpieczeń, pytają też o profil ekspozycji: liczbę rekordów danych, historię incydentów i roszczeń, zależność od kluczowych systemów, oczekiwany zakres ochrony, czas odtworzenia, dostawców IT, czas patchowania, często też zewnętrzny dostęp, pocztę, płatności i rodzaje danych. W Twoim zestawie część tego jest, ale nie ma tego dość, by uznać wynik za dobry predyktor „ubezpieczalności”.  

Po drugie, dla segmentu 20-250 pracowników kilka pytań i odpowiedzi jest ustawionych trochę za wysoko, jakby celem było lekkie wejście w enterprise. Przykłady: centralny SIEM, firewall nowej generacji z VLAN-ami i IoT, pełny roczny pentest plus phishing plus tabletop, kwartalne raporty KPI dla zarządu, vCISO jako poziom „3”. To są rzeczy świetne, ale nie wszystkie są typowym minimum underwritingowym dla polskiego MŚP. Ubezpieczyciel częściej patrzy najpierw na twarde minimum: MFA, backup, test odtworzenia, EDR lub sensowną ochronę endpointów, patching, kontrolę płatności/BEC, szyfrowanie, podstawowy plan incydentowy.    

Po trzecie, sekcja Compliance jest trochę zbyt ciężka względem celu „przygotowanie do ubezpieczenia cyber” dla firm raczej poza kategorią podmiotów kluczowych i ważnych. To nie znaczy, że jest zła. Jest sensowna edukacyjnie. Ale w praktyce underwritingowej większą wagę mają zwykle kontrole techniczne i operacyjne niż np. formalne rozważania o IOD czy aktywności rejestru czynności przetwarzania. NIS2 może wpływać pośrednio przez łańcuch dostaw, ale dla Twojej grupy docelowej to zwykle nie jest pierwszy filtr decyzji underwritingowej.    

Po czwarte, jest tu trochę zlania trzech porządków w jedno:
cyber hygiene, compliance/regulacje, ubezpieczalność.
Na poziomie marketingowym to działa. Na poziomie diagnostycznym trochę miesza. Firma może mieć niezłe szanse na polisę mimo słabego formalizmu compliance, a jednocześnie nie dostać dobrej oferty przez brak MFA lub nieprzetestowany backup. Obecna konstrukcja może sugerować, że wszystko waży podobnie, a rynek zwykle tak nie działa.    

Największa luka merytoryczna: brakuje kilku pytań, które są bardzo „ubezpieczeniowe”, a nie tylko „bezpiecznościowe”.
Najbardziej odczuwalne braki to:

* historia incydentów / roszczeń / zdarzeń z ostatnich 3-5 lat,
* rodzaj i skala przetwarzanych danych,
* kluczowe zależności biznesowe i RTO/RPO,
* czy firma korzysta z zewnętrznego MSP / outsourcowanego IT i jak to kontroluje,
* email security filtering,
* czy MFA obejmuje webmail, zdalny dostęp i konta uprzywilejowane oddzielnie, zamiast jednego bardziej ogólnego pytania.
    Takie elementy widać w realnych formularzach underwritingowych dużo częściej niż np. pytanie o IOD.  

Ocena scoringu i logiki dojrzałości: tu mam największe zastrzeżenia.
Samo rozwiązanie z wagami i dwoma pytaniami critical ma sens, ale w obecnej formie jest zbyt łagodne. Guardrail działa tylko wtedy, gdy wszystkie pytania krytyczne mają 0. To oznacza, że firma może mieć np. szczątkowe MFA albo backup „na papierze” i nadal nabić całkiem ładny wynik ogólny, mimo że underwritingowo nadal byłaby słaba. Do tego sam plik wprost zauważa, że kolejność odpowiedzi jest hackowalna i klikając zawsze ostatnią opcję dostaje się 100%. To psuje wiarygodność lead magnetu jako narzędzia diagnostycznego.  

Dodatkowo opis poziomu Managed (51-75%) = „spełnia większość wymagań ubezpieczycieli” jest dla mnie zbyt odważny. Przy obecnym scoringu to może dawać fałszywe poczucie gotowości. Ubezpieczyciel nie patrzy tylko na procent z quizu. Potrafi wywrócić rozmowę jednym brakiem: bez MFA na poczcie, bez sensownego backupu, bez EDR, bez historii testów odtworzeniowych albo przy złej historii szkód.      

Awareness quiz jest dobry jako element edukacyjny, ale nie mieszałbym go z oceną gotowości do polisy. Cztery pytania są sensowne, lecz bardziej badają świadomość regulacyjno-incydentową niż realną gotowość underwritingową. Poza tym trzeba uważać z kategorycznością w obszarze NIS2: w Polsce obowiązki raportowe 24h/72h wynikają z projektowanego wdrożenia krajowego i są istotne dla podmiotów kluczowych/ważnych, ale dla zwykłego MŚP spoza zakresu nie należy sugerować, że to ich bezpośredni obowiązek „z automatu”. Natomiast 72 godziny do UODO przy naruszeniu danych osobowych to akurat jest poprawne i dobrze osadzone.    

Czy jako lead magnet działa?
Tak, i całkiem dobrze. Ma konkret, budzi zdrowy niepokój, daje prostą strukturę i pokazuje luki w sposób zrozumiały dla biznesu. To jest jego duży plus. Na tym etapie nie musi być perfekcyjnym odwzorowaniem formularza ubezpieczyciela, tylko powinien prowadzić do rozmowy: „gdzie mamy braki, co trzeba poprawić przed rozmową z brokerem”. Ten warunek spełnia.  

Czy jako pre-audit przed cyber insurance działa?
Tak, ale pod jednym warunkiem: trzeba go komunikować uczciwie jako „wstępny screening gotowości”, a nie jako „sprawdzenie, czy dostaniesz polisę”. Bez tego ktoś zobaczy 72% i pomyśli, że jest bezpieczny, a potem broker zada 8 pytań o szkody, RTO, liczbę rekordów, email security i zakres MFA, i cały piękny wynik zacznie się kruszyć jak motywacja działu po piątym status callu.    

Moje najważniejsze uwagi końcowe

1. To jest dobry lead magnet.
    Buduje wiarygodność i sensownie otwiera rozmowę sprzedażowo-doradczą.  
2. To nie jest jeszcze pełny pre-audit underwritingowy.
    Brakuje pytań o ekspozycję, historię szkód/incydentów, zależności biznesowe i kilka klasycznych pytań formularzowych.  
3. Sekcja technical controls jest mocniejsza niż compliance i to dobrze.
    Ale compliance jest trochę za szerokie względem celu „ubezpieczenie dla MŚP”.  
4. Scoring wymaga ostrożności interpretacyjnej.
    Największe ryzyko to nadmiernie optymistyczny wynik i anti-gaming, które sam plik zresztą uczciwie zauważa.  
5. Największa wartość biznesowa tego narzędzia
    to nie procent końcowy, tylko lista braków, które można potem zamienić na plan działań przed rozmową z brokerem albo ubezpieczycielem. To jest właściwy kierunek użycia.  