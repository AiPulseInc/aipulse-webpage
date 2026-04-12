// Security — audits and compliance modal content

export const audytyData = {
  1: {
    title: 'Audyt Podstawowy',
    category: '_01 // BASIC',
    audience: 'Firmy 5-20 osób rozpoczynające drogę do compliance. Dobry punkt startu jeśli nie miałeś wcześniej audytu.',
    benefits: [
      'Automatyczny skan podatności (sieć, endpointy, aplikacje webowe)',
      'Przegląd polityk bezpieczeństwa i procedur (lub ich brak)',
      'Raport z priorytetyzowanymi rekomendacjami',
      'Checklist 30 najważniejszych działań do wdrożenia',
    ],
    format: '2-3 dni robocze · audyt zdalny · 2h zaangażowania Twojego zespołu',
    outcome: 'Jasny obraz luk bezpieczeństwa + plan pierwszych działań. Cena: 3 500 – 5 000 PLN netto.',
  },
  2: {
    title: 'Audyt Rozszerzony',
    category: '_02 // ROZSZERZONY',
    audience: 'Firmy 10-50 osób, które potrzebują zgodności z NIS2/KSC lub przygotowują się do ubezpieczenia cyber.',
    benefits: [
      'Wszystko z pakietu BASIC',
      'Ocena ryzyka zgodnie z NIS2/KSC (60-elementowa lista kontrolna)',
      'Testy konfiguracji kluczowych systemów (Office 365, backup, firewall, MFA)',
      'Analiza luk — co brakuje do spełnienia wymagań ubezpieczyciela',
      'Plan działań z szacunkami kosztów i harmonogramem wdrożenia',
    ],
    format: '5-7 dni roboczych · audyt zdalny + 1 wizyta on-site · 4h zespołu',
    outcome: 'Spełnione 80% wymagań cyber-ubezpieczeń. Gotowa dokumentacja do negocjacji polisy. Cena: 7 000 – 10 000 PLN netto.',
  },
  3: {
    title: 'Audyt Premium',
    category: '_03 // PREMIUM',
    audience: 'Firmy wymagające pełnego cyklu: diagnoza → wdrożenie → walidacja. Dla tych, którzy chcą udowodnić bezpieczeństwo, nie tylko je zdeklarować.',
    benefits: [
      'Wszystko z pakietu ROZSZERZONY',
      'Wsparcie we wdrożeniu rekomendacji (do 40h konsultacji)',
      'Szkolenie security awareness dla zespołu (2h online)',
      'Re-audyt po 6 miesiącach — potwierdzenie, że zmiany działają',
      'Dokumentacja gotowa pod ISO 27001 (opcjonalna ścieżka certyfikacji)',
    ],
    format: '2 tygodnie audyt + 3 miesiące wsparcia + re-audyt · hybrid',
    outcome: 'Pełna zgodność NIS2 + dokumentacja pod ubezpieczenie + zespół przeszkolony. Cena: 12 000 – 18 000 PLN netto.',
  },
};

export const securitySzkoleniaData = {
  1: {
    title: 'Security Awareness',
    category: '_01 // LUDZIE',
    audience: 'Cały zespół — od recepcji po zarząd. 85% incydentów zaczyna się od kliknięcia pracownika, nie od luki technicznej.',
    benefits: [
      'Rozpoznawanie phishingu na prawdziwych przykładach',
      'Hasła, MFA, menedżery haseł — co, kiedy, jak',
      'Manipulacja socjotechniczna — przez telefon, email, LinkedIn',
      'Zgłaszanie incydentów — co robić po kliknięciu (pierwsze 30 min)',
      'Bezpieczeństwo pracy zdalnej i prywatnych urządzeń',
    ],
    format: '2h online · grupa do 20 osób · ćwiczenia praktyczne + symulacja phishingu',
    outcome: 'Zespół rozpoznaje typowe sposoby ataku. Mierzalna redukcja skuteczności phishingu w testach o 60-80%.',
  },
  2: {
    title: 'Bezpieczne używanie AI',
    category: '_02 // AI W FIRMIE',
    audience: 'Zespoły, które już używają ChatGPT, Claude, Copilot — lub właśnie mają zacząć. Dyrektorzy IT i zarządzający.',
    benefits: [
      'Nieautoryzowane AI w firmie — jak wykryć i co z tym zrobić',
      'Ochrona danych firmowych przed wyciekiem do narzędzi AI',
      'Dobór narzędzi AI pod wymagania RODO i NIS2',
      'Polityka AI w firmie — co regulować, a co puścić luzem',
      'AI Act — co wchodzi w 2026, jakie obowiązki dla MŚP',
    ],
    format: '1 dzień on-site lub 2× 3h online · grupa do 15 osób · praktyczne przykłady',
    outcome: 'Jasna polityka używania AI + lista zatwierdzonych narzędzi + szkolenie zespołu. Brak ryzyka wycieku danych przez ChatGPT.',
  },
  3: {
    title: 'Incident Response',
    category: '_03 // KADRA ZARZĄDZAJĄCA',
    audience: 'Zarząd, kadra kierownicza, IT leadzi. Osoby, które będą podejmować decyzje podczas incydentu.',
    benefits: [
      'Pierwsze 24h incydentu — kto, co, komu',
      'Komunikacja wewnętrzna i zewnętrzna (klienci, media, RODO)',
      'Obowiązek zgłoszenia do Prezesa UODO (72h) i CERT Polska',
      'Współpraca z organami ścigania podczas incydentu',
      'Ćwiczenie praktyczne — symulacja incydentu ransomware',
    ],
    format: '1 dzień on-site · do 10 osób · symulacja incydentu w czasie rzeczywistym',
    outcome: 'Gotowy plan reakcji na incydent dla Twojej firmy + przećwiczony scenariusz. Oszczędność pierwszych 24h w realnym incydencie.',
  },
  4: {
    title: 'RODO + NIS2 w praktyce',
    category: '_04 // COMPLIANCE',
    audience: 'Inspektorzy Ochrony Danych (IOD), kierownicy operacyjni, właściciele firm w regulowanych branżach.',
    benefits: [
      'RODO 2026 — co się zmieniło, na co uważać',
      'NIS2/KSC — czy Twoja firma jest podmiotem ważnym lub kluczowym',
      'Rejestr czynności przetwarzania — minimum dokumentacyjne',
      'Analiza ryzyka dla systemów przetwarzania danych',
      'Audyt wewnętrzny — jak przeprowadzić samodzielnie',
    ],
    format: '1 dzień on-site · grupa do 14 osób · praca na realnych procesach firmy',
    outcome: 'Zaktualizowany rejestr RODO + analiza luk NIS2 + plan działań. Gotowość na kontrolę Prezesa UODO lub organu sektorowego.',
  },
};

export const complianceData = {
  1: {
    title: 'NIS2 / KSC — Compliance',
    category: 'OBSZAR_01',
    description:
      '3 kwietnia 2026 w Polsce wchodzi ustawa o Krajowym Systemie Cyberbezpieczeństwa (KSC) implementująca dyrektywę NIS2. Obejmuje kluczowe i ważne podmioty — średnie firmy w wielu branżach muszą spełnić szczegółowe wymagania. Kary za brak zgodności: do 10 mln EUR lub 2% globalnego obrotu. Pomagamy przeanalizować czy Cię dotyczy, ocenić luki i wdrożyć minimum wymagane prawem.',
    modules: [
      'Analiza obowiązków dla Twojej firmy',
      'Analiza luk wobec wymagań NIS2',
      'Plan wdrożenia minimum zgodności',
      'Dokumentacja zarządu i procedury',
    ],
  },
  2: {
    title: 'Ubezpieczenie Cyber',
    category: 'OBSZAR_02',
    description:
      'Polskie firmy coraz częściej wymagają ubezpieczenia cyber jako warunku kontraktów. Ubezpieczyciele (PZU, Warta, TUiR Allianz) zaostrzyli wymagania — bez MFA, backupów i polityk incidentu nie kupisz polisy. Nasz audyt daje gotową dokumentację pod negocjacje i konkretne rekomendacje, które obniżają składkę.',
    modules: [
      'Analiza wymagań 3 głównych ubezpieczycieli',
      'Przygotowanie dokumentacji do wniosku',
      'Rekomendacje obniżające składkę',
      'Wsparcie w negocjacjach z brokerem',
    ],
  },
  3: {
    title: 'Security Awareness',
    category: 'OBSZAR_03',
    description:
      '85% incydentów bezpieczeństwa zaczyna się od pracownika. Phishing, słabe hasła, manipulacja socjotechniczna. Szkolenie z bezpieczeństwa pracowników to najtańsza i najefektywniejsza inwestycja w cyberbezpieczeństwo — 2h online może zapobiec 6-cyfrowej stracie.',
    modules: [
      'Rozpoznawanie phishingu (z testami praktycznymi)',
      'Hasła, MFA, menedżery haseł',
      'Manipulacja socjotechniczna — jak się bronić',
      'Zgłaszanie incydentów — co robić po kliknięciu',
    ],
  },
};
