// Training catalog — 7 offerings across 2 groups (Wdrażaj AI / Buduj z AI)
// Structure mirrors automatyzacjeData for shared modal rendering

export const szkoleniaData = {
  1: {
    title: 'Podstawy rozmowy z AI',
    category: '_01 // FUNDAMENTY',
    audience: 'Osoby poznające AI po raz pierwszy — managerowie, HR, administracja, każdy kto chce wdrożyć AI w codziennej pracy.',
    benefits: [
      'Jak rozmawiać z ChatGPT, Claude, Gemini żeby dostać to, czego naprawdę potrzebujesz',
      '5 sprawdzonych schematów rozmowy (Cel → Kontekst → Ograniczenia → Format)',
      'Kiedy użyć którego narzędzia AI (Gemini vs Claude vs Perplexity)',
      'Budowa własnej biblioteki poleceń dopasowanej do Twojej firmy',
    ],
    format: '1 dzień on-site lub 4 sesje online · grupa do 14 osób',
    outcome: 'Gotowa biblioteka 10+ poleceń do codziennej pracy w Twojej firmie',
  },
  2: {
    title: 'Prawo Jazdy AI',
    category: '_02 // SPRZEDAŻ B2B',
    audience: 'Handlowcy B2B, Key Account Managers, menedżerowie sprzedaży, specjaliści sprzedaży.',
    benefits: [
      'Automatyzacja prospectingu — od leada do umówionego spotkania',
      'Pisanie spersonalizowanych ofert i skutecznych follow-upów z AI',
      'Wybór narzędzi AI dla sprzedaży (Gemini, Claude, Perplexity, Notebook LM)',
      'Bezpieczeństwo danych klientów — RODO, RAG, unikanie halucynacji',
      'Budowa własnej biblioteki poleceń sprzedażowych',
    ],
    format: '1 dzień on-site · grupa do 14 osób · praca na Twoich realnych danych',
    outcome: 'Funkcjonalny proces sprzedażowy wspierany AI + biblioteka promptów dopasowana do Twoich produktów',
  },
  3: {
    title: 'Zbuduj własnego agenta AI',
    category: '_03 // ZAAWANSOWANE',
    audience: 'Dyrektorzy sprzedaży i marketingu, właściciele MŚP, specjaliści chcący przejść od używania AI do jego tworzenia.',
    benefits: [
      'Technika masterprompt — jeden prompt, który obsługuje cały proces',
      'Integracja z CRM bez ryzyka (RAG, bezpieczne połączenia)',
      'Deployment lokalny (Twoje dane zostają u Ciebie) vs chmurowy',
      'Autonomiczne agenty AI — jak projektować, budować i wdrażać',
    ],
    format: '6h warsztat · hands-on · poziom średniozaawansowany',
    outcome: 'Działający agent AI zbudowany podczas szkolenia na Twoich produktach i cennikach',
  },
  4: {
    title: 'Claude Code: Start',
    category: '_04 // DEV TOOLS',
    audience: 'Developerzy Junior-Mid, QA engineers, techniczni Product Managers. Osoby chcące zacząć pracę z AI coding tools.',
    benefits: [
      'Pełny setup: IDE integration, CLAUDE.md, permissions, plan mode',
      'Building web apps from scratch — zero to deployment',
      'Context management, slash commands, hooks',
      'Claude Code Skills i Model Context Protocol (MCP) — podstawy',
    ],
    format: '2-dniowy kurs online · hands-on · grupa do 10 osób',
    outcome: 'Pełny setup Claude Code + pierwsza aplikacja zbudowana od zera podczas kursu',
  },
  5: {
    title: 'Claude Code: Skills dla biznesu',
    category: '_05 // DEV TOOLS',
    audience: 'Developerzy z doświadczeniem w Claude Code, team leadzi, solopreneurs prowadzący biznes na AI.',
    benefits: [
      'Skills — jak projektować i wdrażać dla konkretnych procesów biznesowych',
      '10+ gotowych Skills do natychmiastowego reużycia',
      'Automatyzacja repetitive tasks (raportowanie, onboarding, maintenance)',
      'Metryki ROI dla AI workflows — jak mierzyć i pokazać wartość',
    ],
    format: '1-dniowy intensywny warsztat · hands-on · na Twoich procesach',
    outcome: '3-5 własnych Skills skonfigurowanych i przetestowanych dla Twojego biznesu',
  },
  6: {
    title: 'Claude Code: Pro',
    category: '_06 // DEV TOOLS',
    audience: 'Senior developerzy, architekci oprogramowania, tech leadzi chcący osiągnąć mastery level.',
    benefits: [
      'Multi-agent orchestration — kilka agentów współpracujących w jednym workflow',
      'Hooks, subagents, worktrees — zaawansowane wzorce architektoniczne',
      'Performance tuning + cost optimization dla AI workflows',
      'Production deployment + monitoring + error recovery',
    ],
    format: '3-dniowy zaawansowany kurs · hands-on · grupa do 8 osób',
    outcome: 'Kompletny workflow AI-assisted development gotowy do produkcji',
  },
  7: {
    title: 'Gemini + AntiGravity',
    category: '_07 // DEV TOOLS',
    audience: 'Developerzy chcący znać alternatywy dla Claude Code, solopreneurs budujący biznes na AI.',
    benefits: [
      'Setup AntiGravity + Gemini 3.1 Pro w środowisku dev',
      '"Vibe coding" methodology — pracuj szybko bez utraty kontroli',
      'Porównanie Claude Code vs Gemini+AntiGravity — kiedy którego używać',
      'Łączenie obu ekosystemów w jednym workflow',
    ],
    format: '2-dniowy kurs online · hands-on · grupa do 10 osób',
    outcome: 'Działający setup + pierwsza app zbudowana w stacku Gemini+AntiGravity',
  },
};
