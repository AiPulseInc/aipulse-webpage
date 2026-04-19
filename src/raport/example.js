export const EXAMPLE_DATA = {
  profile: {
    companyName: 'TwojaFirma Sp. z o.o.',
    industry: 'Produkcja',
    size: '11-50',
  },
  scoringResult: {
    overall: { percentage: 58, earned: 0, max: 0 },
    maturity: {
      key: 'developing',
      label: 'Developing · Podstawowy',
      description: 'Podstawy są, ale brakuje procesów i spójności.',
    },
    categories: {
      A: { percentage: 67, earned: 0, max: 0 },
      B: { percentage: 33, earned: 0, max: 0 },
      C: { percentage: 58, earned: 0, max: 0 },
      D: { percentage: 42, earned: 0, max: 0 },
      E: { percentage: 71, earned: 0, max: 0 },
    },
    guardrailTriggered: false,
  },
  date: '13.04.2026',
  refNumber: 'AP-SA-2026-04-13-00042',
  topRecs: [],
  // Realistyczny mix odpowiedzi typowej MŚP 11-50 os. (produkcja):
  // dobre A/E (szkolenia + basic compliance), słabe B/D (backup + procesy), średnie C.
  // Indeksy odpowiadają option indices w questions.json (score = 0 / 0 / 1 / 3).
  responses: {
    A1: 3, A2: 2, A3: 2, A4: 2, A5: 3, A6: 2, A7: 3,
    B1: 1, B2: 0, B3: 3, B4: 1, B5: 2, B6: 1, B7: 3,
    C1: 3, C2: 2, C3: 3, C4: 2, C5: 2, C6: 1, C7: 2,
    D1: 1, D2: 1, D3: 0, D4: 1, D5: 2, D6: 0, D7: 1,
    E1: 2, E2: 3, E3: 1, E4: 1, E5: 2, E6: 1, E7: 3,
  },
};
