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
    title: 'Audyt Standardowy',
    category: '_02 // STANDARD',
    audience: 'Firmy 10-50 osób, które potrzebują compliance z NIS2/KSC lub przygotowują się do ubezpieczenia cyber.',
    benefits: [
      'Wszystko z pakietu BASIC',
      'Ocena ryzyka zgodnie z NIS2/KSC (60-elementowa checklist)',
      'Testy konfiguracji kluczowych systemów (Office 365, backup, firewall, MFA)',
      'Gap analysis — co brakuje do spełnienia wymagań ubezpieczyciela',
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
      'Wszystko ze STANDARD',
      'Wsparcie we wdrożeniu rekomendacji (do 40h konsultacji)',
      'Szkolenie security awareness dla zespołu (2h online)',
      'Re-audyt po 6 miesiącach — potwierdzenie, że zmiany działają',
      'Dokumentacja gotowa pod ISO 27001 (opcjonalna ścieżka certyfikacji)',
    ],
    format: '2 tygodnie audyt + 3 miesiące wsparcia + re-audyt · hybrid',
    outcome: 'Pełna zgodność NIS2 + dokumentacja pod ubezpieczenie + zespół przeszkolony. Cena: 12 000 – 18 000 PLN netto.',
  },
};

export const complianceData = {
  1: {
    title: 'NIS2 / KSC — Compliance',
    category: 'OBSZAR_01',
    description:
      '3 kwietnia 2026 w Polsce wchodzi ustawa o Krajowym Systemie Cyberbezpieczeństwa (KSC) implementująca dyrektywę NIS2. Obejmuje kluczowe i ważne podmioty — średnie firmy w wielu branżach muszą spełnić szczegółowe wymagania. Kary za brak zgodności: do 10 mln EUR lub 2% globalnego obrotu. Pomagamy przeanalizować czy Cię dotyczy, ocenić gap i wdrożyć minimum compliance.',
    modules: [
      'Analiza obowiązków dla Twojej firmy',
      'Gap assessment vs wymagania NIS2',
      'Plan wdrożenia minimum compliance',
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
      '85% incydentów bezpieczeństwa zaczyna się od pracownika. Phishing, weak passwords, social engineering. Szkolenie security awareness to najtańsza i najefektywniejsza inwestycja w cyberbezpieczeństwo — 2h online może zapobiec 6-cyfrowej stracie.',
    modules: [
      'Rozpoznawanie phishingu (z testami praktycznymi)',
      'Hasła, MFA, password managerów',
      'Social engineering i jak się bronić',
      'Incident reporting — co robić po kliknięciu',
    ],
  },
};
