import { getQuestions, getCategoriesMeta } from './scoring.js';

const RECOMMENDATION_LIBRARY = {
  A1: {
    title: 'Wdroż regularne szkolenia z phishingu',
    action: 'Minimum co pół roku + symulacje phishingu (np. KnowBe4, PhishER, lub własne testy przez gophish).',
    cost: 'Niski (od ok. 20 zł/os/mies.)',
    effort: '1 tydzień wdrożenia',
    impact: '82% ataków zaczyna się od człowieka — trening obniża click-rate o 60-70%.',
  },
  A2: {
    title: 'Wyznacz jeden kanał zgłaszania incydentów',
    action: 'Dedykowany adres np. security@firma.pl + przycisk "Zgłoś phishing" w Outlooku/Gmailu.',
    cost: 'Zero-minimalny',
    effort: '1 dzień',
    impact: 'Każde szybsze zgłoszenie incydentu = krótszy dwell time atakującego.',
  },
  A3: {
    title: 'Wprowadź firmowy menedżer haseł',
    action: 'Wykup licencje 1Password Business / Bitwarden Teams (od 3 USD/os/mies.) i zrób onboarding.',
    cost: '~15 zł/os/mies.',
    effort: '2 tygodnie (pilot + rollout)',
    impact: 'Eliminuje 80% ryzyka credential reuse.',
  },
  A4: {
    title: 'Zautomatyzuj offboarding',
    action: 'Checklist HR+IT: wyłączenie konta w dniu 0, rotacja haseł w systemach współdzielonych, odebranie sprzętu.',
    cost: 'Niski',
    effort: '1-2 tygodnie',
    impact: 'Zombie accounts to jeden z top 5 wektorów ataku na MŚP.',
  },
  A5: {
    title: 'Zdefiniuj politykę urządzeń (BYOD / firmowe)',
    action: 'Wymagaj MDM (Microsoft Intune/Jamf) na urządzeniach z dostępem do danych firmowych.',
    cost: 'Od 5-10 USD/urządzenie/mies.',
    effort: '3-4 tygodnie',
    impact: 'Zdalne czyszczenie urządzenia w razie kradzieży/zwolnienia.',
  },
  A6: {
    title: 'Rozdziel konta admin od codziennych',
    action: 'Każdy admin ma 2 konta: codzienne (user) + admin (używane tylko do zadań admina).',
    cost: 'Zero',
    effort: '1 tydzień',
    impact: 'Nawet jeśli phish trafi w codzienne konto, atakujący nie ma admin rights.',
  },
  A7: {
    title: 'Wdroż dual-approval dla przelewów',
    action: 'Przelewy > ustalonej kwoty (np. 10 000 zł) wymagają weryfikacji głosowej lub 2 osób.',
    cost: 'Zero',
    effort: '1 dzień procedury',
    impact: 'Polskie MŚP tracą średnio 200k zł na BEC rocznie — dual approval eliminuje to.',
  },
  B1: {
    title: 'Wdroż backup zgodny z regułą 3-2-1',
    action: '3 kopie danych, 2 różne media, 1 offsite (najlepiej immutable cloud — np. Veeam, Backblaze B2 z object lock).',
    cost: 'Od 100 zł/mies. dla MŚP',
    effort: '2-3 tygodnie',
    impact: 'Ransomware = 80% firm bez backupu upada w 6 miesięcy.',
  },
  B2: {
    title: 'Regularnie testuj odtwarzanie z backupu',
    action: 'Minimum co 6 miesięcy — odtwórz losowo wybrany system z backupu, zmierz RTO/RPO.',
    cost: 'Zero',
    effort: '4-8h co test',
    impact: 'Backup którego nie testowałeś = backup który nie istnieje.',
  },
  B3: {
    title: 'Wymuś szyfrowanie dysków (BitLocker/FileVault)',
    action: 'Polityka MDM wymuszająca szyfrowanie + centralny backup kluczy recovery.',
    cost: 'Zero (wbudowane w Windows Pro/macOS)',
    effort: '1-2 tygodnie',
    impact: 'Skradziony laptop = skradzione dane. Szyfrowanie neutralizuje ryzyko.',
  },
  B4: {
    title: 'Przeprowadź access review',
    action: 'Minimum raz na pół roku — właściciele systemów przeglądają listę użytkowników + uprawnień.',
    cost: 'Zero',
    effort: '1-2 dni kwartalnie',
    impact: 'Privilege creep to cichy zabójca — rośnie latami.',
  },
  B5: {
    title: 'Sklasyfikuj dane (publiczne/wewnętrzne/poufne)',
    action: 'Zdefiniuj 3-4 poziomy klasyfikacji + zasady gdzie mogą być przechowywane.',
    cost: 'Zero',
    effort: '1 tydzień',
    impact: 'Bez klasyfikacji wszystkie zabezpieczenia są "one size fits all".',
  },
  B6: {
    title: 'Zdefiniuj politykę retencji (RODO Art. 5)',
    action: 'Okresy przechowywania per typ danych + automatyczne kasowanie.',
    cost: 'Zero',
    effort: '2-3 tygodnie',
    impact: 'Mniej danych = mniejsze ryzyko wycieku + zgodność z RODO.',
  },
  B7: {
    title: 'Wymuszaj bezpieczne linki do plików zewnętrznych',
    action: 'SharePoint/Google Drive z wygaśnięciem + zawężenie do adresów e-mail.',
    cost: 'Zero (wbudowane)',
    effort: '1 dzień konfiguracji',
    impact: 'Publiczne linki to top wector wycieku danych.',
  },
  C1: {
    title: 'Wdroż MFA wszędzie',
    action: 'Wszystkie systemy firmowe (poczta, chmura, VPN, bank) — najlepiej z aplikacjami authenticator, nie SMS.',
    cost: 'Zero (wbudowane w M365/Google Workspace)',
    effort: '1-2 tygodnie',
    impact: '99.9% redukcja ryzyka przejęcia konta (dane Microsoft).',
  },
  C2: {
    title: 'Wdroż central patch management',
    action: 'Windows Update for Business / Intune / WSUS. Critical CVE < 72h.',
    cost: 'Niski',
    effort: '2-3 tygodnie',
    impact: '60% naruszeń wykorzystuje znane podatności z łatkami dostępnymi > 30 dni.',
  },
  C3: {
    title: 'Wymień antywirus na EDR/XDR',
    action: 'Microsoft Defender for Endpoint (Plan 1/2), SentinelOne, CrowdStrike.',
    cost: 'Od 3 USD/endpoint/mies.',
    effort: '2-4 tygodnie',
    impact: 'EDR widzi to czego AV nie — fileless attacks, living-off-the-land.',
  },
  C4: {
    title: 'Zabezpiecz sieć i Wi-Fi',
    action: 'Firewall NGFW (np. Fortinet/pfSense) + osobne VLAN-y: firmowe, gościnne, IoT.',
    cost: 'Sprzęt od ~2000 zł',
    effort: '1-2 tygodnie',
    impact: 'Segmentacja = atakujący nie przechodzi swobodnie po całej firmie.',
  },
  C5: {
    title: 'Wymuś VPN lub Zero Trust dla remote',
    action: 'Cloudflare Zero Trust / Tailscale / WireGuard — wymuszenie przez politykę urządzenia.',
    cost: 'Od zero (Tailscale Free do 3 osób) do ~7 USD/os/mies.',
    effort: '1-2 tygodnie',
    impact: 'Publiczne Wi-Fi = złoto dla atakujących. VPN neutralizuje.',
  },
  C6: {
    title: 'Wdroż automatyczny inwentarz IT',
    action: 'Microsoft Intune / Jamf / Kandji — widzisz wszystkie urządzenia firmowe w real-time.',
    cost: 'Od 2 USD/urządzenie/mies.',
    effort: '3-4 tygodnie',
    impact: 'Nie możesz chronić tego o czym nie wiesz że istnieje.',
  },
  C7: {
    title: 'Skonfiguruj SPF + DKIM + DMARC',
    action: 'DMARC w trybie p=quarantine lub p=reject + monitoring raportów (np. Postmark, EasyDMARC).',
    cost: 'Od zero do ~30 USD/mies.',
    effort: '2-4 tygodnie',
    impact: 'Eliminuje email spoofing z Twojej domeny — kluczowe dla reputacji i BEC.',
  },
  D1: {
    title: 'Stwórz Incident Response Plan',
    action: 'Spisz procedurę: kto, kiedy, co robi przy ataku. Lista kontaktów 24/7. Testuj symulacją co rok.',
    cost: 'Zero (własna praca)',
    effort: '2-3 tygodnie',
    impact: 'Chaos w pierwszych godzinach ataku kosztuje więcej niż sam atak.',
  },
  D2: {
    title: 'Zbuduj playbook z numerami alarmowymi',
    action: 'Dokument (papier + offline) z kontaktami: IT, CSIRT, prawnik, ubezpieczyciel, CEO.',
    cost: 'Zero',
    effort: '1 dzień',
    impact: 'Po ataku możesz nie mieć dostępu do maila — numery muszą być dostępne offline.',
  },
  D3: {
    title: 'Wdroż centralny logging + alerty',
    action: 'SIEM (Microsoft Sentinel, Wazuh) albo SaaS (Datadog, Elastic). Min. logi z AD, EDR, firewall.',
    cost: 'Od 100 USD/mies.',
    effort: '4-6 tygodni',
    impact: 'Dwell time atakującego bez monitoringu: 200+ dni. Z SIEM: dni.',
  },
  D4: {
    title: 'Wdroż regularne testy bezpieczeństwa',
    action: 'Roczny pentest + kwartalny phishing test + tabletop exercise z zarządem co pół roku.',
    cost: 'Pentest od ~15k zł, phishing test ~2k zł',
    effort: '1-2 tyg/rok',
    impact: 'Znajdziesz luki zanim zrobi to atakujący.',
  },
  D5: {
    title: 'Spisz i udostępnij polityki bezpieczeństwa',
    action: 'Minimum: Password Policy, Acceptable Use Policy, Incident Response Policy. Onboarding = zapoznanie.',
    cost: 'Zero',
    effort: '2 tygodnie',
    impact: 'Polityki to fundament compliance — bez nich NIS2/RODO audyt nie przejdzie.',
  },
  D6: {
    title: 'Wyznacz osobę odpowiedzialną za bezpieczeństwo',
    action: 'CISO / Security Officer wewnętrzny, lub vCISO zewnętrzny (np. Ai Puls).',
    cost: 'vCISO od ~3-5k zł/mies.',
    effort: '1-2 tygodnie',
    impact: 'Bez właściciela żaden security program nie istnieje.',
  },
  D7: {
    title: 'Wprowadź kwartalny raport dla zarządu',
    action: 'KPI: liczba incydentów, klikalność phishingu, patch compliance, findings pentestu.',
    cost: 'Zero',
    effort: '1-2 dni kwartalnie',
    impact: 'Zarząd nie inwestuje w to czego nie widzi.',
  },
  E1: {
    title: 'Zrób analizę applicability NIS2/KSC',
    action: 'Klasyfikacja: kluczowy / ważny / dostawca / poza scope. Udokumentuj decyzję.',
    cost: 'Zero (lub konsultacja prawna ~2k zł)',
    effort: '1-2 tygodnie',
    impact: 'Brak analizy = ryzyko kary do 10 mln EUR lub 2% obrotu.',
  },
  E2: {
    title: 'Zaktualizuj rejestr czynności przetwarzania',
    action: 'Rejestr per proces: cel, podstawa prawna, kategorie danych, odbiorcy, retencja.',
    cost: 'Zero',
    effort: '2-3 tygodnie',
    impact: 'UODO zaczyna każdy audyt od rejestru — jego brak = mandat.',
  },
  E3: {
    title: 'Wdroż supplier risk management',
    action: 'Lista kluczowych dostawców + wymóg ISO 27001/SOC 2 + okresowe ankiety security.',
    cost: 'Zero',
    effort: '3-4 tygodnie',
    impact: 'Łańcuch dostaw to top wektor ataku na MŚP (vide supply chain NPM 2025).',
  },
  E4: {
    title: 'Stwórz procedurę zgłaszania naruszeń',
    action: 'Decision tree: czy to naruszenie? kto powiadamia UODO/CSIRT? szablony notyfikacji.',
    cost: 'Zero',
    effort: '1-2 tygodnie',
    impact: 'Niezłożenie notyfikacji w 72h = kara administracyjna.',
  },
  E5: {
    title: 'Zweryfikuj polisę cyber insurance',
    action: 'Przejrzyj wyłączenia, wymogi (MFA/backup/szkolenia), limity. Skontaktuj się z brokerem.',
    cost: 'Zależne od skali firmy',
    effort: '1 tydzień',
    impact: 'Polisa bez spełnionych wymogów = odmowa wypłaty odszkodowania.',
  },
  E6: {
    title: 'Rozszerz umowy o klauzule bezpieczeństwa',
    action: 'DPA, wymogi security, klauzule zgłaszania incydentów, prawo audytu.',
    cost: 'Zero (konsultacja z prawnikiem)',
    effort: '2-3 tygodnie',
    impact: 'Bez klauzul nie wyegzekwujesz nic w razie incydentu u dostawcy.',
  },
  E7: {
    title: 'Wyznacz Inspektora Ochrony Danych',
    action: 'Własny IOD lub DPO as a Service (zewnętrzny, np. ~1-2k zł/mies.).',
    cost: 'Od ~12k zł/rok',
    effort: '1-2 tygodnie',
    impact: 'Jeśli spełniasz warunki z RODO Art. 37 — brak IOD = kara.',
  },
};

export function topRecommendations(scoringResult, responses, limit = 3) {
  const categoriesMeta = getCategoriesMeta();
  const gaps = getQuestions()
    .map((q) => buildGap(q, responses))
    .filter((g) => g.severity > 0)
    .sort((a, b) => b.severity - a.severity);

  return gaps.slice(0, limit).map((gap) => ({
    ...gap,
    categoryName: categoriesMeta.find((c) => c.id === gap.category)?.name || gap.category,
  }));
}

function buildGap(question, responses) {
  const response = responses[question.id];
  const maxScore = Math.max(...question.options.map((o) => o.score));
  const actualScore =
    response !== undefined && response !== null
      ? question.options[response]?.score ?? 0
      : 0;
  const gapPoints = maxScore - actualScore;
  const severity = gapPoints * question.weight * (question.critical ? 1.5 : 1);

  const rec = RECOMMENDATION_LIBRARY[question.id] || {
    title: question.text,
    action: 'Szczegółowa rekomendacja w pełnym raporcie.',
    cost: '—',
    effort: '—',
    impact: '—',
  };

  return {
    questionId: question.id,
    category: question.category,
    critical: question.critical,
    severity,
    gapPoints,
    title: rec.title,
    action: rec.action,
    cost: rec.cost,
    effort: rec.effort,
    impact: rec.impact,
  };
}
