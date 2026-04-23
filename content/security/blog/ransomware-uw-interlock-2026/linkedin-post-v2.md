# LinkedIn Post v2 — Atak na UW + polskie sklepy / premiera Ai Pulse Cyber Security

**Wersja do publikacji (cel: urgency + quick wins, ≤1900 znaków, aktualna długość 1725).**

---

850 GB danych UW już krąży po darknecie. 132 tys. klientów polskich sklepów (vegehome.pl, polskiekoldry.pl) — też. Oba wycieki w tym samym miesiącu.

PESEL-e, umowy, dane medyczne, adresy dostaw. Tego nie zmienisz jak hasła.

Jak do tego doszło?

UW: ktoś przejął login z przeglądarki pracownika i zalogował się normalnie. System widział prawidłowego użytkownika. Kopiowanie 850 GB trwało tygodniami — nikt nie patrzył na ruch wychodzący.

Polskie sklepy: zewnętrzne narzędzie admin w środowisku testowym. „Zapomniane drzwi" obok platformy sklepowej.

Dwa incydenty, dwie skale, jeden wzorzec: atak przez rzeczy, o których nikt nie pamiętał.

Masz MŚP 10-50 osób? Masz ten sam problem w mniejszej wersji. I mniejszy teren do zabezpieczenia.

Co realnie ogarniesz w weekend, bez dostawcy IT:

→ **MFA na wszystkich kontach z danymi osobowymi** — nie tylko mail. Dysk, CRM, panel hostingu. Pół dnia, 0 zł.

→ **Menedżer haseł** (Bitwarden, 1Password) + blokada zapisywania haseł w przeglądarce. 20 zł/os./mc. Główny wektor infostealerów zamknięty.

→ **Audyt subdomen** — wpisz `site:twojafirma.pl -www` w Google. Subdomeny, których nie umiesz uzasadnić — wyłącz. 1-2 godziny.

→ **Alerty logowań z nieznanych lokalizacji** w Microsoft 365 / Google Workspace. Godzina, darmowe.

Problem nie w tym, że to trudne. Problem w tym, że ludzie uruchamiają to dopiero po incydencie.

---

🔒 Właśnie uruchomiliśmy **Ai Pulse Cyber Security** — audyty dla MŚP. Rekomendacje w 7 dni.

→ Bezpłatna samoocena: https://aipulse.pl/bezpieczenstwo-samoocena/

→ Rozmowa + 3 rekomendacje: https://aipulse.pl/security/#contact

→ Analiza UW: https://aipulse.pl/security/blog/ransomware-uw-interlock-2026/

#cyberbezpieczeństwo #MŚP #RODO #AiPulse

---

## Notatki

- **Timing:** publikacja ASAP (22-23.04.2026), temat jest na topie ~tydzień
- **Format:** rekomendowany tekst-only (+30% engagement na LI vs tekst+obraz, pasuje do urgency). Alternatywa: og-security.png
- **Komentarz pod postem (po 1h):** link do bloga z pełną analizą incydentu
- **Struktura vs v1:** v2 zamienia „3 wnioski" na konkretne quick wins w weekend z kosztem i czasem. Hook skondensowany, hashtagi 6→4.
