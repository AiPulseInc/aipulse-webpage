# LinkedIn Post v1 — Atak na UW + polskie sklepy / premiera Ai Pulse Cyber Security

**Wersja alternatywna (dłuższa narracja, bez sekcji quick wins, ~2100 znaków).**

---

850 GB danych z Uniwersytetu Warszawskiego trafiło do darknetu.

PESEL-e. Umowy. Dokumenty medyczne. Korespondencja. Dane podatkowe. Ok. 32,8 tys. plików mogło zawierać dane osobowe studentów, pracowników i kandydatów na studia.

Jak się włamano? Bez żadnego „hakowania".

Ktoś przejął login i hasło — prawdopodobnie przez malware na urządzeniu użytkownika. Zalogował się normalnie, jak uprawniony pracownik. System nie widział nic podejrzanego, bo to BYŁO prawidłowe logowanie. Kopiowanie danych trwało tygodniami.

Trzy wnioski, które dotyczą każdej firmy w Polsce:

1. Hasło zapisane w przeglądarce = hasło do wzięcia. Infostealery zbierają wszystkie loginy z Chrome/Edge w sekundy. MFA to jedyna realna bariera — i nie tylko na mailu, ale na KAŻDYM systemie z dostępem do danych osobowych.

2. 850 GB nie kopiuje się w 5 minut. Nikt nie monitorował ruchu wychodzącego. W firmie 30-osobowej taki monitoring uruchamia się w godzinę — i kosztuje zero.

3. PESEL-u nie zmienisz jak hasła. Wyciek danych osobowych to nie „zresetuj i zapomnij". To problem na lata — phishing, wyłudzenia kredytów, kradzież tożsamości.

**I to nie jest jednorazowy incydent.**

W tym samym miesiącu wyciekły dane **132 tys. klientów dwóch polskich sklepów** — vegehome.pl i polskiekoldry.pl. 146 tys. kont, imiona, telefony, adresy dostaw. Wektor? Zewnętrzne narzędzie administracyjne w środowisku testowo-rozwojowym. **Nie sama platforma sklepowa — „zapomniane drzwi" obok niej.**

Dwa incydenty, dwie różne skale, jeden wzorzec: dostęp przez rzeczy, o których nikt nie pamiętał. Skradzione hasło tam, zapomniany panel admin tu.

Jeśli prowadzisz firmę 10-50 osób — masz ten sam problem w mniejszej wersji:

→ MFA wszędzie, nie tylko na mailu — jeden dzień
→ Audyt subdomen i środowisk dev — pół dnia
→ Monitoring logowań z geolokalizacją — godzina

30 kont do zabezpieczenia, nie 30 000. Mniejsza skala to Twoja supermoc. Ale tylko jeśli z niej skorzystasz.

---

🔒 Właśnie uruchomiliśmy **Ai Pulse Cyber Security** — audyty bezpieczeństwa dla MŚP. Konkretne rekomendacje w 7 dni, nie PowerPointy na kwartał.

→ Zacznij od bezpłatnej samooceny (15 min, bez rejestracji): https://aipulse.pl/bezpieczenstwo-samoocena/

→ Albo od rozmowy — 30 minut, 3 rekomendacje, nawet jeśli nie pójdziemy dalej: https://aipulse.pl/security/#contact

→ Pełna analiza incydentu UW na blogu: https://aipulse.pl/security/blog/ransomware-uw-interlock-2026/

#cyberbezpieczeństwo #MŚP #NIS2 #ransomware #AiPulse #audytbezpieczeństwa

---

## Notatki

- **Status:** fallback, gdy chcemy dłuższy format albo inny angle (dydaktyczny zamiast action-oriented)
- **Timing:** ten sam co v2 — temat UW jest na topie ~tydzień od publikacji na darknecie (16.04.2026)
- **Struktura vs v2:** v1 zachowuje „3 wnioski" jako element dydaktyczny, pomija sekcję quick wins. Dłuższy, mniejsze poczucie urgency, większy zakres edukacyjny.
