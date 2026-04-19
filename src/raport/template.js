import { scoreAwareness } from '../samoocena/awareness.js';
import { topRecommendations } from '../samoocena/recommendations.js';

// Copy z results-management.js:370 — keeps PDF template free of online-report coupling
function getRiskStatement(maturityKey) {
  const map = {
    initial: {
      riskPct: '80–95%',
      businessText:
        'Masz pojedyncze zabezpieczenia, ale brak procesów. Jeśli dziś zdarzy się poważny incydent (ransomware, wyciek danych), Twoja firma prawdopodobnie <strong>stanie na tygodnie</strong> i będzie reagować chaotycznie bez planu.',
    },
    developing: {
      riskPct: '~50%',
      businessText:
        'Masz narzędzia (firewall, antywirus, backup), ale nie masz procesów, które by je sprawiały naprawdę skutecznymi. Jeśli dziś zdarzy się poważny incydent, Twoja firma będzie <strong>reagować w trybie kryzysowym</strong>, a nie zgodnie z planem.',
    },
    managed: {
      riskPct: '~25%',
      businessText:
        'Masz solidne podstawy — narzędzia i procesy. Brakuje jeszcze kilku elementów, które wypełniają wymagania ubezpieczycieli cyber i dużych klientów w łańcuchu dostaw NIS2. Warto <strong>domknąć te luki</strong>, zanim staną się blokerem kontraktu.',
    },
    optimized: {
      riskPct: '<10%',
      businessText:
        'Jesteś w czołówce MŚP pod względem cyberbezpieczeństwa. Ryzyko poważnego incydentu jest niskie, a Ty spełniasz wymogi NIS2, RODO i większości ubezpieczycieli. Utrzymanie tego poziomu wymaga <strong>regularnych testów i aktualizacji</strong>.',
    },
  };
  return map[maturityKey] || map.developing;
}

const SIZE_LABELS = {
  '1-10': '1–10 pracowników',
  '11-50': '11–50 pracowników',
  '51-250': '51–250 pracowników',
};

const CATEGORIES = [
  { id: 'A', name: 'Ludzie', subtitle: 'Awareness i kultura' },
  { id: 'B', name: 'Dane', subtitle: 'Ochrona informacji i backup' },
  { id: 'C', name: 'Infrastruktura', subtitle: 'Systemy i sieć' },
  { id: 'D', name: 'Procesy', subtitle: 'Governance i reagowanie' },
  { id: 'E', name: 'Compliance', subtitle: 'NIS2 / RODO / dostawcy' },
];

const BENCHMARK = {
  A: 55, B: 48, C: 52, D: 45, E: 58,
  sampleSize: 42,
  cohortLabel: 'MŚP 11–50',
};

const FINDINGS = [
  {
    id: 'L-01', severity: 'crit', label: 'KRYTYCZNE',
    title: 'Kopie zapasowe nie są testowane',
    detail: 'Kopie zapasowe są wykonywane, ale nie przeprowadzacie regularnych prób odtworzenia danych z backupu. W praktyce oznacza to, że organizacja <strong>nie wie, czy jest w stanie odzyskać dane</strong> po incydencie. To jest najczęstsza przyczyna „udanych" ataków ransomware w sektorze MŚP.',
    mapping: 'CIS 11.5 · NIST PR.DS-01, RC.RP-01',
  },
  {
    id: 'L-02', severity: 'crit', label: 'KRYTYCZNE',
    title: 'Brak kopii zapasowej odpornej na atak (offsite + niezmiennej)',
    detail: 'Wszystkie kopie zapasowe są dostępne z głównej sieci firmowej. W przypadku przejęcia konta administratora lub udanego ataku ransomware <strong>atakujący może skasować lub zaszyfrować również kopie zapasowe</strong>. Zasada 3-2-1: 3 kopie, 2 różne nośniki, 1 w innej lokalizacji + tryb niezmienny (immutable).',
    mapping: 'CIS 11.4 · NIST PR.DS-04',
  },
  {
    id: 'L-03', severity: 'high', label: 'WYSOKIE',
    title: 'Uwierzytelnianie dwuskładnikowe (MFA) tylko częściowo wdrożone',
    detail: 'MFA działa na poczcie i VPN, ale brakuje na CRM, systemie księgowym, panelu hostingowym. Te trzy systemy są <strong>najczęstszymi wektorami ataku</strong> — szczególnie CRM i hosting (dane klientów, możliwość podmiany treści strony).',
    mapping: 'CIS 6.5 · NIST PR.AA-03',
  },
  {
    id: 'L-04', severity: 'high', label: 'WYSOKIE',
    title: 'Brak formalnego planu reagowania na incydenty',
    detail: 'W razie incydentu brak jasnej procedury: kto, kiedy, do kogo dzwoni. Konsekwencja: <strong>chaos decyzyjny w pierwszych 24 godzinach</strong>, które są najbardziej krytyczne dla ograniczenia szkód i spełnienia wymogu zgłoszenia naruszenia do UODO w ciągu 72h (RODO Art. 33).',
    mapping: 'CIS 17.1 · NIST RS.RP-01 · NIS2 Art. 23',
  },
  {
    id: 'L-05', severity: 'med', label: 'ŚREDNIE',
    title: 'Brak formalnej oceny dostawców IT',
    detail: 'Dostawcy IT i chmury są wybierani na podstawie ceny i reputacji, bez ankiet bezpieczeństwa ani weryfikacji certyfikatów. W kontekście NIS2 (łańcuch dostaw) oraz RODO (procesorzy) — <strong>istotne ryzyko regulacyjne</strong>.',
    mapping: 'CIS 15.1 · NIST GV.SC-01 · NIS2 Art. 21',
  },
  {
    id: 'L-06', severity: 'med', label: 'ŚREDNIE',
    title: 'Aktualizacje oprogramowania bez harmonogramu',
    detail: 'Aktualizacje systemów i aplikacji wykonywane doraźnie, bez harmonogramu. Średnie opóźnienie w nakładaniu krytycznych łatek może przekraczać 30 dni — a znane podatności są wykorzystywane przez ataki zazwyczaj w ciągu 7–14 dni od publikacji.',
    mapping: 'CIS 7.1 · NIST PR.IP-12',
  },
  {
    id: 'L-07', severity: 'low', label: 'NISKIE',
    title: 'Brak symulacji phishingu dla pracowników',
    detail: 'Pracownicy są szkoleni teoretycznie, ale nie są testowani (symulowany phishing co 3–6 miesięcy). Bez testów nie wiadomo, jak odporni są w praktyce — a phishing pozostaje bramą wjazdową do ~82% udanych ataków na MŚP.',
    mapping: 'CIS 14.2 · NIST PR.AT-01',
  },
];

export function renderRaportB(data) {
  const { profile, scoringResult, date, refNumber, awarenessAnswers } = data;
  const overall = scoringResult?.overall?.percentage ?? 0;
  const maturityLabel = scoringResult?.maturity?.label ?? '—';
  const companyName = profile.companyName || 'Nazwa firmy (do uzupełnienia)';
  const industry = profile.industry || '—';
  const size = SIZE_LABELS[profile.size] || profile.size || '—';
  const hasAwareness = awarenessAnswers && Object.keys(awarenessAnswers).length > 0;
  const awareness = hasAwareness ? scoreAwareness(awarenessAnswers) : null;

  // A7 — DNS scan logic
  const dnsVariant = pickDnsVariant(profile, data.dnsScan);
  const hasDnsScan = dnsVariant !== null;
  const dnsFindings = (dnsVariant === 'success' && data.dnsScan)
    ? deriveDnsFindings(data.dnsScan)
    : [];

  // Dual paginacja strategy:
  // 1. Primary: @page margin boxes z CSS Paged Media (Chrome/Edge 85+)
  // 2. Fallback: position: fixed DIVs (Safari, starszy Firefox) — display w @media print
  // Cover pokrywa fixed elementy (position: relative; z-index:10; background).
  const printChrome = `
    <div class="print-header">
      <span>AI PULSE SECURITY · CYBER AUDIT REPORT</span>
      <span>REF: ${escape(refNumber)}</span>
    </div>
    <div class="print-footer">
      <span>Ai Pulse Security · info@aipulse.pl · aipulse.pl/security</span>
      <span class="page-num"></span>
    </div>`;

  return [
    printChrome,
    renderCover({ companyName, industry, size, overall, maturityLabel, date }),
    renderReaderGuide(),
    renderToc({ refNumber, date, categoryScores: scoringResult?.categories, maturityLabel, hasAwareness, hasDnsScan }),
    renderExecutiveSummary({ scoringResult, responses: data.responses || {}, overall, maturityLabel }),
    renderMaturityLadder({ currentMaturityKey: scoringResult?.maturity?.key, overall }),
    renderMethodologyAndScope({ refNumber, date, maturityLabel }),
    renderRadarAndCategoryBreakdown({ refNumber, categoryScores: scoringResult?.categories, industry, size }),
    renderFindings({ refNumber, dynamicFindings: dnsFindings }),
    hasDnsScan ? renderDnsExposure({ refNumber, variant: dnsVariant, scan: data.dnsScan, profile, hasAwareness }) : '',
    awareness ? renderAwarenessPage({ refNumber, awareness, hasDnsScan }) : '',
    renderComplianceAndCta({ refNumber, overall, maturityLabel, dnsScan: data.dnsScan, dnsVariant, hasDnsScan, hasAwareness }),
    renderNextStepsContact({
      scoringResult,
      responses: data.responses || {},
      overall,
      maturityLabel,
      sectionNumber: 8 + (hasDnsScan ? 1 : 0) + (hasAwareness ? 1 : 0) + 1, // = 9/10/11 zależnie od config
    }),
  ].join('\n');
}

// A7 — wybór wariantu sekcji 7 per spec
function pickDnsVariant(profile, dnsScan) {
  if (profile?.dnsScanOptOut) return 'optout';
  if (dnsScan?.ok && dnsScan.data) return 'success';
  if (profile?.companyDomain && dnsScan && dnsScan.ok === false) return 'fail';
  return null;  // backward compat — assessment sprzed A7 → omit section
}

function renderCover({ companyName, industry, size, overall, maturityLabel, date }) {
  return `
    <div class="page cover">
      <div style="text-align:center; padding: 20mm 16mm 0;">
        <div style="font-family:'Space Grotesk',monospace; font-size:9pt; letter-spacing:0.3em; color:#666; text-transform:uppercase;">Ai Pulse Security · Cyber Audit Division</div>
        <div style="margin-top:3mm; font-family:'Space Grotesk',monospace; font-size:8pt; letter-spacing:0.2em; color:#999; text-transform:uppercase;">Dokument poufny · Nie do redystrybucji bez zgody autora</div>
      </div>

      <div class="crest">
        <div class="crest-title">// Raport Audytu Samooceny</div>
        <div class="crest-main">CYBER<br>SECURITY<br>ASSESSMENT</div>
        <div class="crest-sub">Zgodny z CIS Controls IG1 + NIST CSF 2.0</div>
      </div>

      <div class="cover-body">
        <div class="cover-for">
          <div class="cover-for-label">Raport przygotowany dla</div>
          <div class="cover-for-name">${escape(companyName)}</div>
          <div class="cover-for-meta">Branża: ${escape(industry)} · Wielkość: ${escape(size)}</div>
        </div>

        <div class="seal-box">
          <div style="font-family:'Space Grotesk',monospace; font-size:9pt; letter-spacing:0.2em; color:#666; text-transform:uppercase;">Wynik ogólny</div>
          <div class="seal-score">${overall}<span style="font-size:28pt; color:#666;">/100</span></div>
          <div class="seal-maturity">${escape(maturityLabel)}</div>
          <div class="seal-scope">Kwestionariusz v2026-01 · 35 pytań · 5 kategorii kontroli</div>
        </div>
      </div>

      <div class="auditor-signature">
        <div class="sig-block">
          <div class="sig-line sig-signed"></div>
          <div class="sig-name">Maciej Konieczny</div>
          <div class="sig-title">Lead Security Auditor · Ai Pulse Security</div>
        </div>
      </div>
    </div>
  `;
}

function renderReaderGuide() {
  return `
    <div class="page">
      <p class="section-kicker">// Przedsłowie</p>
      <h2>Jak czytać ten raport</h2>
      <p style="font-size:10.5pt; margin-bottom:6mm;">Raport jest całością i pisany jest z myślą o całej organizacji. Poniżej wskazówki, które sekcje zainteresują Cię szczególnie — w zależności od Twojej roli.</p>

      <div class="reader-boxes">
        <div class="reader-box">
          <div class="reader-role">Jeśli jesteś właścicielem firmy / CEO</div>
          <p class="reader-note">Szczególnie mogą Cię zainteresować sekcje mówiące o biznesowym wpływie i planie działania:</p>
          <ul>
            <li><strong>Podsumowanie zarządcze</strong> — wynik, ryzyko finansowe, trzy największe luki</li>
            <li><strong>Model dojrzałości</strong> — gdzie jesteś na skali i co dzieli Cię od kolejnego poziomu</li>
            <li><strong>Następne kroki + kontakt audytora</strong> — konkretny plan wdrożenia z kosztami</li>
          </ul>
        </div>

        <div class="reader-box">
          <div class="reader-role">Jeśli jesteś IT managerem / CISO</div>
          <p class="reader-note">Najciekawsze mogą być sekcje techniczne z konkretnymi findings i mapowaniem na standardy:</p>
          <ul>
            <li><strong>Wyniki szczegółowe per kategoria</strong> — radar, benchmark vs MŚP, analiza mocnych/słabych stron</li>
            <li><strong>Lista findings</strong> — konkretne luki z mapowaniem na CIS Controls / NIST CSF</li>
            <li><strong>Twoja rzeczywista ekspozycja (DNS)</strong> — co o Twojej infrastrukturze wie publiczny internet</li>
          </ul>
        </div>

        <div class="reader-box">
          <div class="reader-role">Jeśli jesteś compliance officerem / IOD</div>
          <p class="reader-note">Najbardziej wartościowe będą sekcje regulacyjne i audytowalne:</p>
          <ul>
            <li><strong>Świadomość regulacyjna</strong> — test wiedzy o RODO / NIS2 z wyjaśnieniami odpowiedzi</li>
            <li><strong>Mapa zgodności z regulacjami</strong> — status per artykuł NIS2, RODO, wymogi ubezpieczycieli</li>
            <li><strong>Lista findings</strong> — z perspektywy ryzyka regulacyjnego (mapowanie na NIS2 Art. 21/23)</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

function renderMaturityLadder({ currentMaturityKey, overall }) {
  const levels = [
    { key: 'initial', label: 'INITIAL', subtitle: 'Krytyczny', range: '0–25', description: 'Brak podstawowych zabezpieczeń. Wysokie ryzyko paraliżu firmy w razie ataku. Prawdopodobieństwo spełnienia wymogów ubezpieczycieli: zero.' },
    { key: 'developing', label: 'DEVELOPING', subtitle: 'Podstawowy', range: '26–50', description: 'Pewne narzędzia są (antywirus, backup), brak procesów. Podatność na masowe/automatyczne ataki. Ubezpieczyciele: wysoka składka lub odmowa.' },
    { key: 'managed', label: 'MANAGED', subtitle: 'Stabilny', range: '51–75', description: 'Dobra higiena cyfrowa. Spełnia większość wymagań ubezpieczycieli cyber. Nadaje się na dostawcę podmiotu NIS2. Próg dla dużych kontraktów.' },
    { key: 'optimized', label: 'OPTIMIZED', subtitle: 'Lider', range: '76–100', description: 'Gotowość na NIS2, proaktywne podejście do ryzyka. Niskie koszty ubezpieczenia, pełna zgodność. Wartość marketingowa (certyfikat bezpieczeństwa jako element sprzedaży).' },
  ];

  const rowsHtml = levels.map((l) => {
    const isCurrent = l.key === currentMaturityKey;
    return `
      <tr class="${isCurrent ? 'ladder-current' : ''}">
        <td class="ladder-label">
          <div class="ladder-label-main">${l.label}</div>
          <div class="ladder-label-sub">${l.subtitle}</div>
        </td>
        <td class="ladder-range">${l.range}</td>
        <td class="ladder-desc">${l.description}${isCurrent ? ` <span class="ladder-you">← Twój poziom (${overall}/100)</span>` : ''}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="page">
      <h2>3. Model dojrzałości cyberbezpieczeństwa</h2>
      <p style="font-size:10.5pt; margin-bottom:5mm;">Twój wynik (<strong>${overall}/100</strong>) umieszcza Cię na jednym z 4 poziomów. Oto pełna skala — wiedząc gdzie jesteś i jakie są następne stopnie, łatwiej zaplanować inwestycję w cyberbezpieczeństwo.</p>

      <table class="ladder">
        <thead>
          <tr>
            <th style="width:22%;">Poziom</th>
            <th style="width:12%;">Zakres pkt.</th>
            <th>Charakterystyka</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>

      <p style="margin-top:6mm; font-size:9.5pt; color:#555;">Każdy poziom wymaga innych inwestycji. Sekcja <strong>"Następne kroki"</strong> (ostatnia strona) pokazuje konkretnie, które luki musisz zamknąć, żeby awansować o jeden stopień.</p>
    </div>
  `;
}

function renderToc({ refNumber, date, categoryScores, maturityLabel, hasAwareness, hasDnsScan }) {
  const catRows = CATEGORIES.map((cat, i) => {
    const pct = categoryScores?.[cat.id]?.percentage ?? 0;
    return `<li>5.${i + 1} ${escape(cat.name)} (${escape(cat.subtitle)}) — ${pct}/100</li>`;
  }).join('');

  // Sekcje static: 2=Exec Summary, 3=Maturity, 4=Metodyka, 5=Zakres, 6=Wyniki, 7=Findings.
  // Opcjonalne: 8=DNS, 9=Awareness. Ostatnie 2 przesuwają się: Compliance + Next steps.
  let sec = 7;
  const tocItems = [
    `<li><span>2. Podsumowanie zarządcze</span></li>`,
    `<li><span>3. Model dojrzałości cyberbezpieczeństwa</span></li>`,
    `<li><span>4. Metodyka audytu</span></li>`,
    `<li><span>5. Zakres i ograniczenia</span></li>`,
    `<li><span>6. Wyniki szczegółowe per kategoria</span><ol>${catRows}</ol></li>`,
    `<li><span>7. Zidentyfikowane luki bezpieczeństwa</span></li>`,
  ];
  if (hasDnsScan) {
    sec++;
    tocItems.push(`<li><span>${sec}. Twoja rzeczywista ekspozycja (DNS)</span></li>`);
  }
  if (hasAwareness) {
    sec++;
    tocItems.push(`<li><span>${sec}. Świadomość regulacyjna</span></li>`);
  }
  sec++;
  tocItems.push(`<li><span>${sec}. Mapa zgodności z regulacjami</span></li>`);
  sec++;
  tocItems.push(`<li><span>${sec}. Następne kroki + kontakt audytora</span></li>`);

  return `
    <div class="page">
      <div class="letterhead">
        <div>
          <div class="brand">A<span class="dot">i</span> Pulse <span style="color:#7E22CE;">Security</span></div>
          <div style="font-family:'Space Grotesk',monospace; font-size:8pt; letter-spacing:0.15em; color:#666; margin-top:2mm; text-transform:uppercase;">Cyber Audit Division</div>
        </div>
        <div class="doc-meta">
          <div><strong>Dokument:</strong> ${escape(refNumber)}</div>
          <div><strong>Data:</strong> ${escape(date)}</div>
          <div><strong>Metodyka:</strong> CIS IG1 + NIST CSF 2.0</div>
          <div><strong>Wynik ogólny:</strong> ${escape(maturityLabel)}</div>
        </div>
      </div>

      <h2>1. Spis treści</h2>
      <div class="toc"><ol>${tocItems.join('')}</ol></div>
    </div>
  `;
}

function renderExecutiveSummary({ scoringResult, responses, overall, maturityLabel }) {
  const maturity = scoringResult?.maturity;
  const risk = getRiskStatement(maturity?.key || 'developing');
  const topGaps = topRecommendations(scoringResult, responses || {}, 3);

  const guardrailBlock = scoringResult?.guardrailTriggered
    ? `<div class="exec-guardrail">
        <p class="exec-guardrail-label">⚠ Wynik ograniczony</p>
        <p>Twój wynik jest ograniczony do <strong>"Developing"</strong> niezależnie od pozostałych odpowiedzi, ponieważ brak MFA oraz brak testowanego backupu to <strong>warunki minimalne</strong> w certyfikacjach CIS Controls v8 i większości polis cyber insurance.</p>
       </div>`
    : '';

  const gapsHtml = topGaps.length
    ? `<ol class="exec-gaps">${topGaps
        .map(
          (g) =>
            `<li><strong>${escape(g.title)}</strong> — ${escape(g.action)}</li>`,
        )
        .join('')}</ol>`
    : '<p><em>Brak istotnych luk — wszystkie kluczowe kontrole na poziomie oczekiwanym.</em></p>';

  return `
    <div class="page">
      <p class="section-kicker">// Executive summary</p>
      <h2>2. Podsumowanie zarządcze</h2>

      ${guardrailBlock}

      <div class="exec-highlight">
        <p>
          <strong>Twoja firma jest na poziomie "${escape(maturityLabel)}" (${overall}/100)</strong> — ${escape(maturity?.description || '')} Ryzyko paraliżu działalności w razie incydentu ransomware wynosi <strong>${risk.riskPct}</strong>.
        </p>
      </div>

      <div class="exec-box">
        <h3>Co to znaczy w praktyce biznesowej</h3>
        <p>${risk.businessText}</p>
      </div>

      <h3 style="margin-top:8mm;">Twoje 3 największe luki</h3>
      ${gapsHtml}

      <h3 style="margin-top:8mm;">Ryzyko finansowe (szacowane)</h3>
      <p>Przeciętny incydent ransomware w MŚP w 2026 roku: <strong>45–120 tys. zł</strong> (przestój + odzyskiwanie + kary RODO + koszt reputacji). Trzy pierwsze rekomendacje z tego raportu obniżają to ryzyko o szacowane <strong>75%</strong>.</p>
    </div>
  `;
}

function renderMethodologyAndScope() {
  return `
    <div class="page">
      <h2>4. Metodyka audytu</h2>
      <div class="methodology">
        <p>Niniejszy raport jest wynikiem <strong>samooceny deklaratywnej</strong> (self-assessment) przeprowadzonej przez przedstawiciela ocenianej organizacji za pośrednictwem kwestionariusza internetowego Ai Pulse Security.</p>
        <p><strong>Ramy referencyjne:</strong></p>
        <ul>
          <li>Center for Internet Security (CIS) Controls v8 — Implementation Group 1 (IG1)</li>
          <li>NIST Cybersecurity Framework 2.0 (funkcje: Govern, Identify, Protect, Detect, Respond, Recover)</li>
          <li>Dyrektywa NIS2 (UE 2022/2555) w zakresie właściwym dla sektora MŚP</li>
          <li>Rozporządzenie RODO (UE 2016/679)</li>
        </ul>
        <p><strong>Skala punktowa:</strong> każde pytanie 0-3 pkt; wynik kategorii = suma/max × 100; wagi 2.0 dla krytycznych kontroli (MFA, tested backup).</p>
      </div>

      <h2 style="margin-top:10mm;">5. Zakres i ograniczenia</h2>
      <table class="scope">
        <tr><th style="width: 40%;">Zakres</th><th>Opis</th></tr>
        <tr><td>Typ oceny</td><td>Self-assessment deklaratywny</td></tr>
        <tr><td>Co jest mierzone</td><td>Deklarowane praktyki + stan procesów bezpieczeństwa</td></tr>
        <tr><td>Co NIE jest mierzone</td><td>Testy penetracyjne, audyt kodu, przegląd konfiguracji systemów, OSINT</td></tr>
        <tr><td>Wiarygodność</td><td>Zależy od rzetelności odpowiedzi respondenta</td></tr>
        <tr><td>Porównywalność</td><td>Benchmarki pochodzą z anonimowej bazy odpowiedzi (n=${BENCHMARK.sampleSize}, wersja wstępna)</td></tr>
      </table>
      <p style="margin-top:3mm; font-style:italic; color:#666; font-size:9pt;">W celu uzyskania oceny z rygorystyczną weryfikacją techniczną, zaleca się przeprowadzenie pełnego audytu technicznego (oferta Ai Pulse Security: Audyt Basic / Standard / Premium).</p>
    </div>
  `;
}

function renderRadarAndCategoryBreakdown({ refNumber, categoryScores, industry, size }) {
  const catsList = CATEGORIES.map((cat) => {
    const pct = categoryScores?.[cat.id]?.percentage ?? 0;
    const maturity = pctToMaturity(pct);
    return { ...cat, pct, benchmark: BENCHMARK[cat.id], maturity };
  });

  const yourPoly = catsList.map((c, i) => pentPoint(c.pct, i)).join(' ');
  const benchPoly = catsList.map((c, i) => pentPoint(c.benchmark, i)).join(' ');
  const dots = catsList.map((c, i) => {
    const [x, y] = pentPoint(c.pct, i).split(',');
    return `<circle cx="${x}" cy="${y}" r="3" fill="#7E22CE"/>`;
  }).join('');
  const labels = catsList.map((c, i) => {
    const labelPos = pentLabelPos(i);
    return `<text x="${labelPos.x}" y="${labelPos.y}" font-family="Space Grotesk, monospace" font-size="10" text-anchor="middle" fill="#111" font-weight="700">${escape(c.name.toUpperCase())} (${c.pct})</text>`;
  }).join('');

  const categorySections = catsList.map((c, i) => `
    <h4>6.${i + 1} ${escape(c.name)} — ${c.pct}/100 (${escape(c.maturity)})</h4>
    <p style="font-size:9.5pt;">${narrativeFor(c)}</p>
  `).join('');

  // Benchmark comparison text (port z online renderCategoryAnalysis)
  const above = catsList.filter((c) => c.pct > c.benchmark);
  const below = catsList.filter((c) => c.pct < c.benchmark);
  const aboveText = above.length
    ? `<p><strong>Powyżej średniej:</strong> ${above.map((a) => `${escape(a.name)} (+${a.pct - a.benchmark})`).join(', ')}.</p>`
    : '';
  const belowText = below.length
    ? `<p><strong>Poniżej średniej:</strong> ${below.map((b) => `${escape(b.name)} (${b.pct - b.benchmark})`).join(', ')}.</p>`
    : '';
  const benchmarkBlock = (aboveText || belowText)
    ? `<div class="benchmark-box"><h4>Co mówi benchmark</h4>${aboveText}${belowText}</div>`
    : '';

  return `
    <div class="page">
      <h2>6. Wyniki szczegółowe per kategoria</h2>

      <div class="radar">
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#DDD" fill="none" stroke-width="0.8">
            <polygon points="${pentPolyStatic(100)}"/>
            <polygon points="${pentPolyStatic(75)}" fill="#F9F6FC" fill-opacity="0.3"/>
            <polygon points="${pentPolyStatic(50)}" fill="#F4EFFA" fill-opacity="0.3"/>
            <polygon points="${pentPolyStatic(25)}" fill="#EFE7F8" fill-opacity="0.3"/>
          </g>
          <g stroke="#CCC" stroke-width="0.5">
            ${CATEGORIES.map((_, i) => {
              const p = pentPoint(100, i);
              return `<line x1="200" y1="160" x2="${p.split(',')[0]}" y2="${p.split(',')[1]}"/>`;
            }).join('')}
          </g>
          <polygon points="${benchPoly}" stroke="#111" fill="none" stroke-width="1.5" stroke-dasharray="3,2"/>
          <polygon points="${yourPoly}" stroke="#7E22CE" fill="#7E22CE" fill-opacity="0.25" stroke-width="2"/>
          ${dots}
          ${labels}
        </svg>
      </div>

      <div class="radar-legend">
        <span><span class="dot-you"></span> Twoja firma</span>
        <span><span class="dot-bench"></span> Średnia ${escape(BENCHMARK.cohortLabel)} (n=${BENCHMARK.sampleSize})</span>
      </div>

      ${benchmarkBlock}

      ${categorySections}
    </div>
  `;
}

function renderFindings({ refNumber, dynamicFindings = [] }) {
  // FINDINGS = hardcoded baseline (F-001..F-007 dla typowych MŚP)
  // dynamicFindings = derived from DNS scan (F-DNS-01..05)
  const allFindings = [...FINDINGS, ...dynamicFindings];

  const findingsHtml = allFindings.map(f => `
    <div class="finding ${f.severity}">
      <div class="finding-header">
        <span class="finding-id">${f.id}</span>
        <span class="finding-sev">${f.label}</span>
      </div>
      <div class="finding-title">${f.title}</div>
      <div class="finding-detail">${f.detail}</div>
      <div class="finding-mapping">${f.mapping}</div>
    </div>
  `).join('');

  return `
    <div class="page">
      <h2>7. Zidentyfikowane luki bezpieczeństwa</h2>
      <p style="color:#666; font-size:9.5pt; margin-bottom:5mm;">Poniżej konkretne luki uporządkowane według krytyczności. Wpisy z prefiksem <strong>DNS-*</strong> wynikają z faktycznego skanu publicznych rekordów Twojej domeny; pozostałe to typowe luki w sektorze MŚP, dla których Twoje odpowiedzi wskazują ryzyko.</p>

      ${findingsHtml}
    </div>
  `;
}

function renderAwarenessPage({ refNumber, awareness, hasDnsScan }) {
  const { correct, total, breakdown, level } = awareness;
  const items = breakdown
    .map((item, i) => {
      const statusClass = item.isCorrect
        ? 'awareness-correct'
        : item.isUnknown
          ? 'awareness-unknown'
          : 'awareness-wrong';
      const statusIcon = item.isCorrect ? '✓' : item.isUnknown ? '?' : '✗';
      const statusLabel = item.isCorrect
        ? 'Poprawnie'
        : item.isUnknown
          ? 'Brak odpowiedzi'
          : 'Niepoprawnie';
      const explanation = escape(item.explanation).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      const userLine =
        item.userAnswerLabel && !item.isCorrect && !item.isUnknown
          ? `<div class="awareness-user">Twoja odpowiedź: <em>${escape(item.userAnswerLabel)}</em></div>`
          : '';
      return `
        <div class="awareness-item ${statusClass}">
          <div class="awareness-item-head">
            <span class="awareness-item-num">${String(i + 1).padStart(2, '0')}</span>
            <span class="awareness-item-icon">${statusIcon}</span>
            <span class="awareness-item-status">${statusLabel}</span>
            <span class="awareness-item-ref">${escape(item.reference)}</span>
          </div>
          <div class="awareness-item-q"><strong>${escape(item.questionText)}</strong></div>
          ${userLine}
          <div class="awareness-item-correct-answer">Poprawna odpowiedź: <strong>${escape(item.correctAnswerLabel)}</strong></div>
          <div class="awareness-item-explanation">${explanation}</div>
        </div>
      `;
    })
    .join('');

  return `
    <div class="page">
      <h2>${hasDnsScan ? 9 : 8}. Świadomość regulacyjna</h2>

      <p class="awareness-intro">
        Przed właściwą samooceną sprawdziliśmy Twoją znajomość podstawowych przepisów — terminów zgłoszenia incydentu, punktów kontaktowych i wysokości kar. Wynik to wskaźnik <strong>literacy</strong>, nie działania: wiedza nie zastępuje wdrożonych procesów, ale pokazuje, na ile jesteś w stanie szybko reagować w razie incydentu.
      </p>

      <div class="awareness-score-summary">
        <div class="awareness-score-big">${correct}<span>/${total}</span></div>
        <div class="awareness-score-label">
          <div class="awareness-score-level">${escape(level.label)}</div>
          <div class="awareness-score-comment">${escape(level.comment)}</div>
        </div>
      </div>

      <h3 style="margin-top: 8mm;">Wszystkie pytania z wyjaśnieniami</h3>
      <div class="awareness-list">
        ${items}
      </div>
    </div>
  `;
}

function renderComplianceAndCta({ refNumber, overall, maturityLabel, dnsScan, dnsVariant, hasDnsScan, hasAwareness }) {
  return `
    <div class="page">
      <h2>${(() => {
        let n = 8;
        if (hasDnsScan) n++;
        if (hasAwareness) n++;
        return n;
      })()}. Mapa zgodności z regulacjami</h2>
      <p style="color:#666; font-size:9.5pt; margin-bottom:5mm;">Jak Twój wynik przekłada się na konkretne wymogi NIS2, RODO oraz wymogi ubezpieczycieli cyber 2026.</p>

      <div class="compliance-grid">
        <div class="compliance-card">
          <h4>NIS2 / KSC</h4>
          <div class="compliance-item"><span>Art. 21 — Środki techniczne</span><span class="compliance-status status-partial">Częściowo</span></div>
          <div class="compliance-item"><span>Art. 21 — Szkolenia zarządu</span><span class="compliance-status status-missing">Brak</span></div>
          <div class="compliance-item"><span>Art. 21 — Łańcuch dostaw</span><span class="compliance-status status-missing">Brak</span></div>
          <div class="compliance-item"><span>Art. 23 — Raportowanie 24h</span><span class="compliance-status status-missing">Brak</span></div>
          <div class="compliance-item"><span>Art. 23 — Raportowanie 72h</span><span class="compliance-status status-partial">Częściowo</span></div>
        </div>

        <div class="compliance-card">
          <h4>RODO / GDPR</h4>
          <div class="compliance-item"><span>Art. 32 — Środki techniczne</span><span class="compliance-status status-partial">Częściowo</span></div>
          <div class="compliance-item"><span>Art. 33 — Powiadomienie UODO 72h</span><span class="compliance-status status-partial">Częściowo</span></div>
          <div class="compliance-item"><span>Art. 30 — Rejestr czynności</span><span class="compliance-status status-ok">Tak</span></div>
          <div class="compliance-item"><span>Art. 37 — Inspektor Ochrony Danych</span><span class="compliance-status status-ok">Tak</span></div>
          <div class="compliance-item"><span>Art. 28 — Umowy z procesorami</span><span class="compliance-status status-ok">Tak</span></div>
        </div>

        <div class="compliance-card">
          <h4>Wymogi ubezpieczycieli (2026)</h4>
          <div class="compliance-item"><span>MFA na kluczowych systemach</span><span class="compliance-status status-partial">Częściowo</span></div>
          <div class="compliance-item"><span>EDR lub antywirus zarządzany</span><span class="compliance-status status-ok">Tak</span></div>
          <div class="compliance-item"><span>Tested backup</span><span class="compliance-status status-missing">Brak</span></div>
          <div class="compliance-item"><span>User awareness training</span><span class="compliance-status status-partial">Częściowo</span></div>
          <div class="compliance-item"><span>Incident Response Plan</span><span class="compliance-status status-missing">Brak</span></div>
          ${(() => {
  let dmarcStatus, dmarcLabel;
  if (dnsVariant === 'optout' || dnsVariant === 'fail' || !hasDnsScan) {
    dmarcStatus = 'status-missing'; dmarcLabel = '—';
  } else if (dnsScan?.data?.summary?.has_dmarc && dnsScan.data.summary.has_spf && dnsScan.data.summary.dmarc_enforcing) {
    dmarcStatus = 'status-ok'; dmarcLabel = 'Tak';
  } else if (dnsScan?.data?.summary?.has_dmarc || dnsScan?.data?.summary?.has_spf) {
    dmarcStatus = 'status-partial'; dmarcLabel = 'Częściowo';
  } else {
    dmarcStatus = 'status-missing'; dmarcLabel = 'Brak';
  }
  return `<div class="compliance-item"><span>SPF + DMARC dla email security</span><span class="compliance-status ${dmarcStatus}">${dmarcLabel}</span></div>`;
})()}
        </div>

        <div class="compliance-card">
          <h4>Ocena ogólna ryzyka</h4>
          <p style="font-size:9.5pt;"><strong>Wynik ogólny:</strong> ${overall}/100 — ${escape(maturityLabel)}</p>
          <p style="font-size:9.5pt;"><strong>Ryzyko regulacyjne:</strong> zależne od sektora</p>
          <p style="font-size:9.5pt;"><strong>Gotowość ubezpieczeniowa:</strong> Warunkowa — spodziewaj się wyższej składki lub wykluczeń</p>
        </div>
      </div>

    </div>
  `;
}

// Sekcja 10 — Następne kroki + kontakt audytora. Port z online renderTopRecommendations.
function renderNextStepsContact({ scoringResult, responses, overall, maturityLabel, sectionNumber }) {
  const top5 = topRecommendations(scoringResult || {}, responses || {}, 5);

  const recsHtml = top5.length
    ? top5
        .map(
          (r, i) => `
      <li class="rec-item">
        <div class="rec-num">${i + 1}</div>
        <div class="rec-body">
          <h4>${escape(r.title)}</h4>
          <p class="rec-action">${escape(r.action)}</p>
          <div class="rec-meta">
            <span><strong>Koszt:</strong> ${escape(r.cost)}</span>
            <span><strong>Wdrożenie:</strong> ${escape(r.effort)}</span>
            ${r.critical ? '<span class="rec-critical">CRITICAL</span>' : ''}
          </div>
          ${r.impact ? `<p class="rec-why">${escape(r.impact)}</p>` : ''}
        </div>
      </li>`,
        )
        .join('')
    : '<p><em>Brak pilnych rekomendacji — utrzymuj obecny poziom przez regularne przeglądy kwartalne.</em></p>';

  // Prosta derivation timeline: pierwsze 3 → 30 dni, kolejne 2 → 90 dni, reszta → 6 miesięcy/dalej.
  const phase30 = top5.slice(0, 3).map((r) => escape(r.title)).join(', ') || '—';
  const phase90 = top5.slice(3, 5).map((r) => escape(r.title)).join(', ') || '—';

  return `
    <div class="page">
      <h2>${sectionNumber}. Następne kroki + kontakt audytora</h2>

      <p style="font-size:10pt;">Twoja organizacja znajduje się na poziomie <strong>"${escape(maturityLabel)}"</strong> z wynikiem ${overall}/100. Poniżej konkretny plan działania — wywiedziony z Twoich odpowiedzi i listy findings.</p>

      <h3 style="margin-top:8mm;">Top 5 rekomendacji</h3>
      <p style="color:#666; font-size:9.5pt; margin-bottom:4mm;">Posortowane według: największy wpływ na bezpieczeństwo / najmniejszy koszt wdrożenia.</p>
      <ol class="recs-list">
        ${recsHtml}
      </ol>

      <h3 style="margin-top:10mm;">Roadmapa — 30 / 90 dni / dalej</h3>
      <div class="roadmap">
        <div class="roadmap-phase">
          <div class="roadmap-phase-label">0–30 DNI</div>
          <p><strong>Quick wins z największym impactem:</strong> ${phase30}</p>
        </div>
        <div class="roadmap-phase">
          <div class="roadmap-phase-label">30–90 DNI</div>
          <p><strong>Średniowymagane wdrożenia:</strong> ${phase90}</p>
        </div>
        <div class="roadmap-phase">
          <div class="roadmap-phase-label">90+ DNI</div>
          <p><strong>Upgrade na CIS IG2 / Managed → Optimized:</strong> Incident Response Plan z testami symulacyjnymi, SIEM + log retention, pełen supplier risk management, BCP/DRP z RTO/RPO.</p>
        </div>
      </div>

      <h3 style="margin-top:10mm;">Kontakt audytora</h3>
      <div class="auditor-contact">
        <div class="auditor-main">
          <strong>Maciej Konieczny</strong> · Lead Security Auditor
          <div style="font-size:9.5pt; color:#666; margin-top:1mm;">Certyfikaty: CompTIA Security+, ISO 27001 Lead Implementer</div>
        </div>
        <div class="auditor-channels">
          <div>📧 <a href="mailto:info@aipulse.pl">info@aipulse.pl</a></div>
          <div>📞 <a href="tel:+48508406948">+48 508 406 948</a></div>
          <div>🔗 <a href="https://www.linkedin.com/in/koniecznymaciej/">linkedin.com/in/koniecznymaciej</a></div>
        </div>
      </div>

      <div class="cta-box" style="margin-top:8mm;">
        <h4>NASTĘPNY KROK — BEZPŁATNA KONSULTACJA</h4>
        <p style="color:#fff; font-size:10pt;">30 minut. Bez zobowiązań. Wyjdziemy z 3 najważniejszymi rekomendacjami dostosowanymi do Twojej organizacji — nawet jeśli nie kupisz audytu.</p>
        <p style="margin-top: 3mm;"><a href="https://aipulse.pl/security/#contact">aipulse.pl/security · info@aipulse.pl</a></p>
      </div>

      <div class="oferta-box">
        <h4>Dalsza współpraca — oferta Ai Pulse Security</h4>
        <ul style="font-size:9.5pt; padding-left:5mm; margin:2mm 0;">
          <li><strong>Audyt Standard</strong> — pogłębiona weryfikacja z testami technicznymi (SPF/DMARC/DKIM, skany subdomen, konfigurację MFA, policy review). ~1 tydzień.</li>
          <li><strong>Audyt Premium</strong> — Standard + pentest external + architecture review + wdrożenie incident response playbook. ~3 tygodnie.</li>
          <li><strong>Cykl szkoleń Awareness</strong> — 4x30min dla zespołu + symulowany phishing co 3 miesiące.</li>
        </ul>
      </div>

      <div style="margin-top:8mm; padding-top:4mm; border-top:1px solid #E5E5E5; font-size:8pt; color:#999; font-style:italic;">
        Niniejszy dokument stanowi wynik samooceny deklaratywnej i nie zastępuje pełnego audytu technicznego. Audyt pełny (Audyt Standard / Premium) obejmuje testy penetracyjne, przegląd konfiguracji oraz analizę logów i może ujawnić dodatkowe luki niewidoczne w samoocenie.
      </div>
    </div>
  `;
}

// A7 — derive dynamic findings z DNS scan data (per spec F-DNS-01..05)
function deriveDnsFindings(scanData) {
  const findings = [];
  const summary = scanData?.data?.summary;
  if (!summary) return findings;

  // SPF
  if (!summary.has_spf) {
    findings.push({
      id: 'F-DNS-01', severity: 'high', label: 'HIGH',
      title: 'Brak rekordu SPF dla domeny pocztowej',
      detail: 'Domena nie ma rekordu SPF — pozwala dowolnemu serwerowi na świecie wysyłać email "od" Twojej firmy. Klient widzi prawdziwy adres, ufa, klika fakturę z fałszywego źródła.',
      mapping: 'CIS 9.5 · NIST PR.AC-3 · NIS2 Art. 21',
    });
  } else if (!summary.spf_strict) {
    findings.push({
      id: 'F-DNS-02', severity: 'low', label: 'LOW',
      title: 'SPF w trybie soft-fail (~all)',
      detail: 'SPF istnieje ale w trybie "soft" — emaile spoof przejdą jako "podejrzane" zamiast być odrzucone. Rozważ zaostrzenie do -all po sprawdzeniu logów DMARC.',
      mapping: 'CIS 9.5 · NIST PR.AC-3',
    });
  }

  // DMARC
  if (!summary.has_dmarc) {
    findings.push({
      id: 'F-DNS-03', severity: 'high', label: 'HIGH',
      title: 'Brak rekordu DMARC',
      detail: 'Bez DMARC nie wiesz że ktoś próbuje podszywać się pod Twoją domenę. Wymóg ubezpieczycieli cyber 2026.',
      mapping: 'CIS 9.6 · NIST PR.AC-3 · NIS2 Art. 21',
    });
  } else if (!summary.dmarc_enforcing) {
    findings.push({
      id: 'F-DNS-04', severity: 'med', label: 'MEDIUM',
      title: 'DMARC w trybie p=none — nie egzekwuje',
      detail: 'DMARC istnieje ale tylko monitoruje. Dla realnej ochrony przed spoofingiem przejdź do p=quarantine (po analizie raportów).',
      mapping: 'CIS 9.6 · NIST PR.AC-3',
    });
  }

  // Subdomeny dev/stage publicznie widoczne
  const subs = scanData?.data?.subdomains || [];
  const dev = subs.filter(s =>
    /^(dev|stage|stg|test|qa|uat|beta|preview)\./i.test(s.hostname)
  );
  if (dev.length > 0) {
    findings.push({
      id: 'F-DNS-05', severity: 'med', label: 'MEDIUM',
      title: `${dev.length} subdomen dev/staging publicznie widoczne`,
      detail: `Wykryto subdomeny: ${dev.map(d => escape(d.hostname)).join(', ')}. Typowy wektor wycieku — wersje testowe z realnymi danymi.`,
      mapping: 'CIS 4.1 · NIST PR.IP-1',
    });
  }

  return findings;
}

// A7 — sekcja "X. Twoja rzeczywista ekspozycja" w 3 wariantach.
function renderDnsExposure({ variant, scan, profile }) {
  // Sekcja numerowana — 8 zawsze (po Findings=7), niezależnie od awareness.
  // Kolejność w pipeline: Findings → DNS → Awareness → Compliance → Next steps
  const sectionNum = 8;

  let body = '';
  if (variant === 'optout') {
    body = renderDnsOptout();
  } else if (variant === 'success') {
    body = renderDnsSuccess(scan, profile);
  } else if (variant === 'fail') {
    body = renderDnsFail(profile);
  }

  return `
    <div class="page">
      <h2>${sectionNum}. Twoja rzeczywista ekspozycja</h2>
      ${body}
    </div>
  `;
}

function renderDnsOptout() {
  return `
    <div class="dns-notice dns-notice-optout">
      <div class="dns-notice-header">⚠ AUDYT POMINIĘTY ZGODNIE Z DECYZJĄ UCZESTNIKA</div>
      <p>Niniejszy obszar (publiczna ekspozycja DNS: subdomeny, email security SPF/DMARC) nie został audytowany — uczestnik samodzielnie zrezygnował z tej części audytu na etapie profilowania.</p>
    </div>
    <table class="scope" style="margin-top:5mm;">
      <tr><th>Typ</th><th>Stan</th></tr>
      <tr><td>Subdomeny</td><td>—</td></tr>
      <tr><td>SPF</td><td>—</td></tr>
      <tr><td>DMARC</td><td>—</td></tr>
      <tr><td>Mail provider</td><td>—</td></tr>
    </table>
  `;
}

function renderDnsFail(profile) {
  const domain = escape(profile?.companyDomain || '—');
  return `
    <div class="dns-notice dns-notice-fail">
      <div class="dns-notice-header">⚠ SKAN NIE ZAKOŃCZONY POMYŚLNIE</div>
      <p>Próba pasywnego skanowania domeny <code>${domain}</code> nie powiodła się w momencie audytu. Możliwe przyczyny: tymczasowy timeout API, rate limit, domena niedostępna z naszych endpointów.</p>
    </div>
    <table class="scope" style="margin-top:5mm;">
      <tr><th>Typ</th><th>Stan</th></tr>
      <tr><td>Subdomeny</td><td>—</td></tr>
      <tr><td>SPF</td><td>—</td></tr>
      <tr><td>DMARC</td><td>—</td></tr>
      <tr><td>Mail provider</td><td>—</td></tr>
    </table>
  `;
}

function renderDnsSuccess(scan, profile) {
  const data = scan?.data;
  if (!data) return renderDnsOptout(); // safety fallback
  const domain = escape(data.domain || profile?.companyDomain || '—');
  const scannedAt = formatScanTime(scan.scanned_at || scan.fetched_at);

  // 7.1 Email security
  const spf = data.summary.has_spf
    ? `<span style="color:#2E7D32;">${data.summary.spf_strict ? '✓ Strict (-all)' : '⚠ Soft (~all)'}</span>`
    : '<span style="color:#C62828;">✗ Brak</span>';
  const spfRecord = data.txt?.spf ? `<br><code style="font-size:8pt;color:#666;">${escape(data.txt.spf.substring(0, 70))}${data.txt.spf.length > 70 ? '…' : ''}</code>` : '';
  const spfInterp = !data.summary.has_spf
    ? 'Domena bez SPF — totalnie otwarta na phishing przez podszywanie. Wymóg ubezpieczycieli cyber 2026.'
    : data.summary.spf_strict
      ? 'Domena chroniona — atakujący nie może wysyłać emaili "od" Twojej firmy.'
      : 'Soft fail — emaile spoof oznaczane jako "podejrzane" zamiast odrzucane. Rozważ zaostrzenie do -all.';

  const dmarcStatus = data.summary.has_dmarc
    ? (data.summary.dmarc_enforcing
        ? `<span style="color:#2E7D32;">✓ ${data.txt.dmarc.policy}</span>`
        : '<span style="color:#C77700;">⚠ p=none</span>')
    : '<span style="color:#C62828;">✗ Brak</span>';
  const dmarcInterp = !data.summary.has_dmarc
    ? 'Bez DMARC nie wiesz że ktoś próbuje podszywać się pod Twoją domenę.'
    : data.summary.dmarc_enforcing
      ? 'Polityka egzekwowana — phishing emails są blokowane lub kierowane do spamu.'
      : 'Polityka p=none — DMARC istnieje, ale nie egzekwuje (raporty bez blokowania).';

  const provider = data.summary.mail_provider || '—';
  const providerInterp = providerInterpretation(provider);

  // 7.2 Subdomain mapping
  const subs = data.subdomains || [];
  const cap = subs.length >= 50 ? `<strong>co najmniej ${subs.length}</strong>` : `<strong>${subs.length}</strong>`;
  const grouped = groupSubdomains(subs);
  const subRows = ['mail', 'web', 'dev', 'api', 'other'].map(cat => {
    const items = grouped[cat] || [];
    if (items.length === 0) return `<tr><td>${categoryLabel(cat)} (0)</td><td>—</td></tr>`;
    const display = items.length > 8
      ? items.slice(0, 8).map(s => s.hostname.split('.')[0]).join(' · ') + ` · …i ${items.length - 8} więcej`
      : items.map(s => s.hostname.split('.')[0]).join(' · ');
    return `<tr><td>${categoryLabel(cat)} (${items.length})</td><td>${escape(display)}</td></tr>`;
  }).join('');

  const devSubs = grouped.dev || [];
  const devWarning = devSubs.length > 0 ? `
    <div class="dns-warning" style="margin-top:4mm;">
      <strong>⚠ UWAGA:</strong> ${devSubs.length} subdomen dev/stage publicznie widoczne.
      Typowy wektor wycieku — wersje testowe z realnymi danymi klientów. Sprawdź czy wymagają autentykacji,
      są oznaczone noindex, i logują dostęp.
    </div>
  ` : '';

  return `
    <p style="font-size:9pt; color:#666; margin-bottom:5mm;">Domena: <strong>${domain}</strong> · skan: ${scannedAt} · pasywny (DNS records, bez aktywnego skanowania)</p>

    <h3 style="margin-top:6mm;">7.1 Email security (anti-spoofing)</h3>
    <table class="scope">
      <tr><th style="width:25%;">Typ</th><th style="width:25%;">Stan</th><th>Interpretacja</th></tr>
      <tr><td>SPF</td><td>${spf}${spfRecord}</td><td>${spfInterp}</td></tr>
      <tr><td>DMARC</td><td>${dmarcStatus}</td><td>${dmarcInterp}</td></tr>
      <tr><td>Mail provider</td><td>${escape(provider)}</td><td>${providerInterp}</td></tr>
    </table>
    <p style="margin-top:3mm; font-size:9pt; color:#666;">
      <strong>Kontekst:</strong> Wymogi ubezpieczycieli cyber 2026 zwykle oczekują DMARC w trybie
      p=quarantine|reject. p=none to brak realnej ochrony — tylko logowanie.
    </p>

    <h3 style="margin-top:8mm;">7.2 Subdomain mapping (publicznie widoczne)</h3>
    <p style="font-size:9.5pt;">Wykryto: ${cap} subdomen${subs.length >= 50 ? ' (limit Free tier API — pełna lista wymaga Plus)' : ''}.</p>
    <table class="scope">
      ${subRows}
    </table>
    ${devWarning}

    ${renderDnsSummary(data, devSubs.length)}
  `;
}

// 7.3 — narrative summary + priorities + educational note (success variant only)
function renderDnsSummary(data, devCount) {
  const s = data.summary;
  const priorities = [];

  if (!s.has_spf) {
    priorities.push({ p: 1, action: 'Wdroż SPF z polityką -all', why: 'bez tego dowolny serwer na świecie może wysyłać email "od" Twojej firmy' });
  } else if (!s.spf_strict) {
    priorities.push({ p: 3, action: 'Zaostrz SPF z ~all do -all', why: 'po analizie raportów DMARC, żeby spoof emails były odrzucane, nie tylko oznaczane jako podejrzane' });
  }

  if (!s.has_dmarc) {
    priorities.push({ p: 1, action: 'Wdroż DMARC w trybie p=quarantine', why: 'bez DMARC nie wykrywasz prób podszywania, a ubezpieczyciele cyber 2026 traktują to jako wymóg podstawowy' });
  } else if (!s.dmarc_enforcing) {
    priorities.push({ p: 2, action: 'Przejdź z DMARC p=none na p=quarantine', why: 'p=none tylko monitoruje — phishing wciąż dociera do skrzynek odbiorców jako pełnoprawne wiadomości' });
  }

  if (devCount > 0) {
    priorities.push({ p: 2, action: `Zabezpiecz ${devCount} subdomen${devCount === 1 ? 'ę' : ''} dev/stage`, why: 'wersje testowe z realnymi danymi to klasyczny vector wycieku — sprawdź autentykację, noindex, logging' });
  }

  if (/self-hosted/i.test(s.mail_provider || '')) {
    priorities.push({ p: 4, action: 'Ustaw monitoring patchowania serwera mail', why: 'self-hosted = pełna odpowiedzialność za CVE, anti-spam i dostępność — outsource\'owany monitoring kosztuje mniej niż jeden incydent' });
  }

  priorities.sort((a, b) => a.p - b.p);
  const top = priorities.slice(0, 3);
  const urgentCount = priorities.filter(x => x.p <= 2).length;

  let posture;
  if (priorities.length === 0) {
    posture = 'Twoja publiczna ekspozycja DNS nie generuje istotnych zagrożeń. Konfiguracja email anti-spoofing jest skutecznie wdrożona, a powierzchnia subdomen jest pod kontrolą. Główny obszar do utrzymania to dyscyplina przy dodawaniu nowych subdomen oraz regularne sprawdzanie raportów DMARC.';
  } else if (urgentCount === 0) {
    posture = 'Konfiguracja podstawowa jest na miejscu, ale są usprawnienia warte zaadresowania w ciągu kwartału. Te zmiany podnoszą ocenę ryzyka u ubezpieczycieli i zamykają drobne wektory ataku.';
  } else if (urgentCount <= 2) {
    posture = `Wykryto ${urgentCount} ${urgentCount === 1 ? 'pilne ryzyko' : 'pilne ryzyka'} w publicznej ekspozycji — warto zaadresować w ciągu 30 dni. Te zmiany zamykają typowe wektory phishingowe i odpowiadają na konkretne wymogi ubezpieczycieli cyber 2026.`;
  } else {
    posture = `Wykryto ${urgentCount} pilnych problemów. To jest profil ryzyka, który ubezpieczyciele cyber 2026 zwykle klasyfikują jako "wysokie ryzyko" — oznacza to wyższą składkę, wykluczenia w polisie albo odmowę pokrycia. Zaadresowanie poniższych priorytetów to minimum, żeby przejść próg warunkowego pokrycia.`;
  }

  const prioritiesHtml = top.length > 0 ? `
    <div style="margin-top:4mm;">
      <strong>Priorytety na najbliższe 30 dni:</strong>
      <ol style="margin-top:2mm; padding-left:6mm;">
        ${top.map(p => `<li style="margin-bottom:2mm;"><strong>${p.action}</strong> — ${p.why}.</li>`).join('')}
      </ol>
    </div>
  ` : '';

  return `
    <h3 style="margin-top:8mm;">7.3 Co to dla Ciebie znaczy</h3>
    <p style="font-size:10pt;">${posture}</p>
    ${prioritiesHtml}
    <p style="margin-top:5mm; font-size:9pt; color:#666;">
      <strong>Dlaczego to ma znaczenie:</strong> publiczne rekordy DNS to pierwsze, co widzi atakujący przy reconnaissance — i pierwsze, co audytuje broker ubezpieczeniowy. SPF/DMARC zamykają najtańszy wektor ataku (phishing przez podszywanie), a ekspozycja subdomen dev/stage to klasyczny vector wycieku danych. Te dwa obszary kosztują najmniej do naprawienia, a ich brak najmocniej obciąża ocenę ryzyka cybersec.
    </p>
  `;
}

function formatScanTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString('pl-PL')}, ${d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} UTC`;
  } catch { return '—'; }
}

function providerInterpretation(provider) {
  if (!provider || provider === '—') return 'Brak konfiguracji email — domena nie odbiera maili.';
  if (/Google Workspace|Microsoft 365|Proton/.test(provider)) {
    return 'Enterprise-grade, monitorowane, regularne aktualizacje.';
  }
  if (/self-hosted/i.test(provider)) {
    return 'Email na własnej infrastrukturze — pełna kontrola, ale pełna odpowiedzialność za bezpieczeństwo (patche, monitoring, anti-spam).';
  }
  if (/Onet|home\.pl|nazwa|OVH|Hekko|dhosting|cyberFolks|kei|LinuxPL|WP\.pl/i.test(provider)) {
    return 'Polski hosting — sprawdź jakie SLA na incident response oferują.';
  }
  if (/transactional/i.test(provider)) {
    return 'Service do email transakcyjnych (powiadomienia, faktury). Główna poczta firmowa może być gdzie indziej.';
  }
  return 'Nieznany dostawca — sprawdź standardy SOC2/ISO 27001.';
}

function categoryLabel(cat) {
  return ({
    mail: 'Mail',
    web: 'Web',
    dev: 'Dev/staging',
    api: 'API/services',
    other: 'Inne',
  })[cat] || cat;
}

function groupSubdomains(subs) {
  const groups = { mail: [], web: [], dev: [], api: [], other: [] };
  for (const s of subs) {
    const sub = (s.hostname || '').split('.')[0].toLowerCase();
    if (/^(mail|smtp|mx|imap|pop3?|webmail)/.test(sub)) groups.mail.push(s);
    else if (/^(dev|stage|stg|test|qa|uat|beta|preview)/.test(sub)) groups.dev.push(s);
    else if (/^(api|app|graphql|rest)/.test(sub)) groups.api.push(s);
    else if (/^(www|sklep|shop|blog|pomoc|help|support|partner|admin|panel)/.test(sub)) groups.web.push(s);
    else groups.other.push(s);
  }
  // Sort within each by alphabetical hostname
  for (const k of Object.keys(groups)) {
    groups[k].sort((a, b) => a.hostname.localeCompare(b.hostname));
  }
  return groups;
}

// Pentagon math: 5 vertices at angles (from top, clockwise)
const PENT_ANGLES = [-90, -18, 54, 126, 198];
const PENT_CENTER = { x: 200, y: 160 };
const PENT_RADIUS = 130;

function pentPoint(pct, idx) {
  const angle = (PENT_ANGLES[idx] * Math.PI) / 180;
  const r = (pct / 100) * PENT_RADIUS;
  const x = PENT_CENTER.x + r * Math.cos(angle);
  const y = PENT_CENTER.y + r * Math.sin(angle);
  return `${x.toFixed(0)},${y.toFixed(0)}`;
}

function pentPolyStatic(pct) {
  return PENT_ANGLES.map((_, i) => pentPoint(pct, i)).join(' ');
}

function pentLabelPos(idx) {
  const angle = (PENT_ANGLES[idx] * Math.PI) / 180;
  const r = PENT_RADIUS + 22;
  return {
    x: Math.round(PENT_CENTER.x + r * Math.cos(angle)),
    y: Math.round(PENT_CENTER.y + r * Math.sin(angle)),
  };
}

function pctToMaturity(pct) {
  if (pct < 26) return 'Initial / Krytyczny';
  if (pct < 51) return 'Developing / Podstawowy';
  if (pct < 76) return 'Managed / Stabilny';
  return 'Optimized / Lider';
}

function narrativeFor(cat) {
  const { name, pct } = cat;
  const lev = pctToMaturity(pct);
  const narratives = {
    Ludzie: {
      high: 'Dobry poziom świadomości. Regularne szkolenia i jasne procedury zgłaszania incydentów.',
      mid: 'Podstawy świadomości są, ale brakuje testów praktycznych (symulowany phishing) i formalnych procedur.',
      low: 'Brak systematycznych szkoleń. Pracownicy to największy wektor ryzyka — bez awareness żadne narzędzie nie pomoże.',
    },
    Dane: {
      high: 'Backup 3-2-1 z testami, szyfrowanie, klasyfikacja, polityka retencji. Solidna baza.',
      mid: 'Backup istnieje, ale nie jest testowany. Szyfrowanie częściowe. Brak formalnej polityki retencji.',
      low: 'KRYTYCZNE — brak lub nietestowany backup. Przy ataku ransomware wysokie ryzyko utraty danych i paraliżu biznesu.',
    },
    Infrastruktura: {
      high: 'MFA wszędzie, EDR, patch management z raportami, Zero Trust dla remote. Higiena techniczna na poziomie.',
      mid: 'MFA w kluczowych systemach, ale brakuje w CRM/hostingu. Patch management ad-hoc.',
      low: 'MFA brak lub tylko w banku. EDR nie wdrożony. Duże powierzchnia ataku.',
    },
    Procesy: {
      high: 'Incident Response Plan z listą kontaktów 24/7, testy symulacyjne, centralny SIEM, kwartalne raporty zarządowe.',
      mid: 'Ogólne wytyczne IR są, ale brak testowania. Polityki spisane, ale nie egzekwowane.',
      low: 'Brak IR Plan, brak odpowiedzialności za cybersecurity. W razie incydentu — chaos decyzyjny.',
    },
    Compliance: {
      high: 'Rejestr RODO aktualny, IOD wyznaczony, analiza NIS2 zrobiona, supplier risk management wdrożony.',
      mid: 'Podstawy RODO spełnione (IOD, rejestr), ale NIS2 i supplier management wymagają uzupełnienia.',
      low: 'Luki w obszarze RODO. Brak świadomości NIS2. Ryzyko kar regulacyjnych.',
    },
  };
  const lookup = narratives[name] || {};
  if (pct >= 60) return lookup.high || `Kategoria na poziomie ${escape(lev)}.`;
  if (pct >= 30) return lookup.mid || `Kategoria na poziomie ${escape(lev)}.`;
  return lookup.low || `Kategoria na poziomie ${escape(lev)}.`;
}

function escape(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
