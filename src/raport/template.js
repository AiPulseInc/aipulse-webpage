import { scoreAwareness } from '../samoocena/awareness.js';

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
    id: 'F-001', severity: 'crit', label: 'CRITICAL',
    title: 'Backupy nie są testowane pod kątem odtwarzania',
    detail: 'Respondent deklaruje wykonywanie backupów, ale nie przeprowadza regularnych testów odtwarzania. W praktyce oznacza to, że organizacja <strong>nie wie, czy jest w stanie odzyskać dane</strong> po incydencie. To jest root cause większości "udanych" ataków ransomware w segmencie MŚP.',
    mapping: 'CIS 11.5 · NIST PR.DS-01, RC.RP-01',
  },
  {
    id: 'F-002', severity: 'crit', label: 'CRITICAL',
    title: 'Brak immutable backup offsite',
    detail: 'Wszystkie kopie zapasowe są dostępne z głównej infrastruktury sieciowej. W przypadku przejęcia konta administratora lub udanego ataku ransomware, <strong>atakujący może skasować lub zaszyfrować również kopie zapasowe</strong>.',
    mapping: 'CIS 11.4 · NIST PR.DS-04',
  },
  {
    id: 'F-003', severity: 'high', label: 'HIGH',
    title: 'MFA wdrożone tylko w części systemów',
    detail: 'MFA działa na poczcie i VPN, ale brakuje na CRM, systemie księgowym, panelu hostingowym. Te trzy systemy są <strong>wektorami ataku</strong> — szczególnie CRM i hosting (dane klientów, możliwość deface\\u2019u strony).',
    mapping: 'CIS 6.5 · NIST PR.AA-03',
  },
  {
    id: 'F-004', severity: 'high', label: 'HIGH',
    title: 'Brak sformalizowanego Incident Response Plan',
    detail: 'W razie incydentu brak jasnej procedury: kto, kiedy, do kogo dzwoni. Konsekwencja: <strong>chaos decyzyjny w pierwszych 24h</strong>, które są najbardziej krytyczne dla ograniczenia szkód i spełnienia wymogu 72h notyfikacji RODO do UODO.',
    mapping: 'CIS 17.1 · NIST RS.RP-01 · NIS2 Art. 23',
  },
  {
    id: 'F-005', severity: 'med', label: 'MEDIUM',
    title: 'Brak formalnej oceny dostawców IT',
    detail: 'Dostawcy IT i cloud są wybierani na podstawie ceny i reputacji, bez ankiet bezpieczeństwa ani weryfikacji certyfikatów. W kontekście NIS2 (łańcuch dostaw) oraz RODO (procesorzy) — <strong>ryzyko regulacyjne</strong>.',
    mapping: 'CIS 15.1 · NIST GV.SC-01 · NIS2 Art. 21',
  },
  {
    id: 'F-006', severity: 'med', label: 'MEDIUM',
    title: 'Patch management nieformalny',
    detail: 'Aktualizacje systemów i aplikacji wykonywane ad-hoc, bez harmonogramu. Średnie opóźnienie w aplikowaniu krytycznych łatek może przekraczać 30 dni.',
    mapping: 'CIS 7.1 · NIST PR.IP-12',
  },
  {
    id: 'F-007', severity: 'low', label: 'LOW',
    title: 'Brak testów phishingowych symulowanych',
    detail: 'Pracownicy są szkoleni teoretycznie, ale nie są testowani (symulowany phishing co 3-6 miesięcy). Bez testów nie wiadomo, jak odporni są w praktyce.',
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

  return [
    renderCover({ companyName, industry, size, overall, maturityLabel, date }),
    renderTocMethodology({ refNumber, date, categoryScores: scoringResult?.categories, maturityLabel, hasAwareness }),
    renderRadarAndCategoryBreakdown({ refNumber, categoryScores: scoringResult?.categories, industry, size }),
    renderFindings({ refNumber }),
    awareness ? renderAwarenessPage({ refNumber, awareness }) : '',
    renderComplianceAndCta({ refNumber, overall, maturityLabel }),
  ].join('\n');
}

function renderCover({ companyName, industry, size, overall, maturityLabel, date }) {
  return `
    <div class="page cover">
      <div style="text-align:center; padding: 35mm 16mm 0;">
        <div style="font-family:'Space Grotesk',monospace; font-size:9pt; letter-spacing:0.3em; color:#666; text-transform:uppercase;">Ai Puls Security · Cyber Audit Division</div>
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

        <div class="auditor-signature">
          <div class="sig-block">
            <div class="sig-line sig-signed"></div>
            <div class="sig-name">Maciej Konieczny</div>
            <div class="sig-title">Lead Security Auditor · Ai Puls Security</div>
          </div>
          <div class="sig-block">
            <div class="sig-line"></div>
            <div class="sig-name">Data audytu</div>
            <div class="sig-title">${escape(date)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTocMethodology({ refNumber, date, categoryScores, maturityLabel, hasAwareness }) {
  const catRows = CATEGORIES.map((cat, i) => {
    const pct = categoryScores?.[cat.id]?.percentage ?? 0;
    return `<li>5.${i + 1} ${escape(cat.name)} (${escape(cat.subtitle)}) — ${pct}/100</li>`;
  }).join('');

  return `
    <div class="page">
      <div class="page-header">
        <span>AI PULS SECURITY · CYBER AUDIT REPORT</span>
        <span>REF: ${escape(refNumber)}</span>
      </div>

      <div class="letterhead">
        <div>
          <div class="brand">A<span class="dot">i</span> Puls <span style="color:#7E22CE;">Security</span></div>
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
      <div class="toc">
        <ol>
          <li><span>2. Podsumowanie zarządcze</span><span>str. 3</span></li>
          <li><span>3. Metodyka audytu</span><span>str. 4</span></li>
          <li><span>4. Zakres i ograniczenia</span><span>str. 4</span></li>
          <li><span>5. Wyniki szczegółowe per kategoria</span><span>str. 5</span>
            <ol>${catRows}</ol>
          </li>
          <li><span>6. Lista findings (identyfikacja luk)</span><span>str. 6</span></li>
          ${hasAwareness ? `<li><span>7. Świadomość regulacyjna (compliance literacy)</span><span>str. 8</span></li>` : ''}
          <li><span>${hasAwareness ? '8' : '7'}. Mapa zgodności z regulacjami</span><span>str. ${hasAwareness ? '9' : '8'}</span></li>
          <li><span>${hasAwareness ? '9' : '8'}. Następne kroki + kontakt audytora</span><span>str. ${hasAwareness ? '11' : '10'}</span></li>
        </ol>
      </div>

      <h2 style="margin-top:10mm;">3. Metodyka audytu</h2>
      <div class="methodology">
        <p>Niniejszy raport jest wynikiem <strong>samooceny deklaratywnej</strong> (self-assessment) przeprowadzonej przez przedstawiciela ocenianej organizacji za pośrednictwem kwestionariusza internetowego Ai Puls Security.</p>
        <p><strong>Ramy referencyjne:</strong></p>
        <ul>
          <li>Center for Internet Security (CIS) Controls v8 — Implementation Group 1 (IG1)</li>
          <li>NIST Cybersecurity Framework 2.0 (funkcje: Govern, Identify, Protect, Detect, Respond, Recover)</li>
          <li>Dyrektywa NIS2 (UE 2022/2555) w zakresie właściwym dla sektora MŚP</li>
          <li>Rozporządzenie RODO (UE 2016/679)</li>
        </ul>
        <p><strong>Skala punktowa:</strong> każde pytanie 0-3 pkt; wynik kategorii = suma/max × 100; wagi 2.0 dla krytycznych kontroli (MFA, tested backup).</p>
      </div>

      <h2>4. Zakres i ograniczenia</h2>
      <table class="scope">
        <tr><th style="width: 40%;">Zakres</th><th>Opis</th></tr>
        <tr><td>Typ oceny</td><td>Self-assessment deklaratywny</td></tr>
        <tr><td>Co jest mierzone</td><td>Deklarowane praktyki + stan procesów bezpieczeństwa</td></tr>
        <tr><td>Co NIE jest mierzone</td><td>Testy penetracyjne, audyt kodu, przegląd konfiguracji systemów, OSINT</td></tr>
        <tr><td>Wiarygodność</td><td>Zależy od rzetelności odpowiedzi respondenta</td></tr>
        <tr><td>Porównywalność</td><td>Benchmarki pochodzą z anonimowej bazy odpowiedzi (n=${BENCHMARK.sampleSize}, wersja wstępna)</td></tr>
      </table>
      <p style="margin-top:3mm; font-style:italic; color:#666; font-size:9pt;">W celu uzyskania oceny z rygorystyczną weryfikacją techniczną, zaleca się przeprowadzenie pełnego audytu technicznego (oferta Ai Puls Security: Audyt Basic / Standard / Premium).</p>

      <div class="page-footer">
        <span>Ai Puls Security · kontakt@aipulse.pl · aipulse.pl</span>
        <span>Strona 2 z 10</span>
      </div>
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
    <h4>5.${i + 1} ${escape(c.name)} — ${c.pct}/100 (${escape(c.maturity)})</h4>
    <p style="font-size:9.5pt;">${narrativeFor(c)}</p>
  `).join('');

  return `
    <div class="page">
      <div class="page-header">
        <span>AI PULS SECURITY · CYBER AUDIT REPORT</span>
        <span>REF: ${escape(refNumber)}</span>
      </div>

      <h2>5. Wyniki szczegółowe per kategoria</h2>

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

      ${categorySections}

      <div class="page-footer">
        <span>Ai Puls Security · kontakt@aipulse.pl · aipulse.pl</span>
        <span>Strona 3 z 10</span>
      </div>
    </div>
  `;
}

function renderFindings({ refNumber }) {
  const findingsHtml = FINDINGS.map(f => `
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
      <div class="page-header">
        <span>AI PULS SECURITY · CYBER AUDIT REPORT</span>
        <span>REF: ${escape(refNumber)}</span>
      </div>

      <h2>6. Lista findings (identyfikacja luk)</h2>
      <p style="color:#666; font-size:9.5pt; margin-bottom:5mm;">Poniżej lista przykładowych luk posortowanych według krytyczności. W wersji beta findings bazują na typowych problemach MŚP — w finalnej wersji będą generowane dynamicznie z Twoich odpowiedzi.</p>

      ${findingsHtml}

      <div class="page-footer">
        <span>Ai Puls Security · kontakt@aipulse.pl · aipulse.pl</span>
        <span>Strona 4 z 10</span>
      </div>
    </div>
  `;
}

function renderAwarenessPage({ refNumber, awareness }) {
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
      <div class="page-header">
        <span>AI PULS SECURITY · CYBER AUDIT REPORT</span>
        <span>REF: ${escape(refNumber)}</span>
      </div>

      <h2>7. Świadomość regulacyjna (compliance literacy)</h2>

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

      <div class="page-footer">
        <span>Ai Puls Security · kontakt@aipulse.pl · aipulse.pl</span>
        <span>Strona 8 z 11</span>
      </div>
    </div>
  `;
}

function renderComplianceAndCta({ refNumber, overall, maturityLabel }) {
  return `
    <div class="page">
      <div class="page-header">
        <span>AI PULS SECURITY · CYBER AUDIT REPORT</span>
        <span>REF: ${escape(refNumber)}</span>
      </div>

      <h2>7. Mapa zgodności z regulacjami</h2>
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
        </div>

        <div class="compliance-card">
          <h4>Ocena ogólna ryzyka</h4>
          <p style="font-size:9.5pt;"><strong>Wynik ogólny:</strong> ${overall}/100 — ${escape(maturityLabel)}</p>
          <p style="font-size:9.5pt;"><strong>Ryzyko regulacyjne:</strong> zależne od sektora</p>
          <p style="font-size:9.5pt;"><strong>Gotowość ubezpieczeniowa:</strong> Warunkowa — spodziewaj się wyższej składki lub wykluczeń</p>
        </div>
      </div>

      <h2 style="margin-top:8mm;">Podsumowanie i rekomendacje</h2>
      <p style="font-size:10pt;">Twoja organizacja znajduje się na poziomie "${escape(maturityLabel)}" z wynikiem ${overall}/100. Rekomendujemy <strong>priorytetowe zaadresowanie findings krytycznych</strong> (CRITICAL) w horyzoncie <strong>30 dni</strong>, a findingów High-severity w horyzoncie <strong>90 dni</strong>.</p>
      <p style="font-size:10pt;">Po wdrożeniu rekomendacji, spodziewany poziom dojrzałości: 75+/100 ("Managed / Stabilny"), co pozwoli:</p>
      <ul style="font-size:10pt; padding-left:5mm;">
        <li>Kwalifikować się do standardowych stawek ubezpieczenia cyber</li>
        <li>Spełnić wymogi NIS2 dla dostawców podmiotów kluczowych</li>
        <li>Znacząco ograniczyć ryzyko paraliżu biznesu w razie incydentu</li>
      </ul>

      <div class="cta-box">
        <h4>NASTĘPNY KROK</h4>
        <p style="color:#fff; font-size:10pt;">Umów bezpłatną 30-min konsultację, podczas której przełożymy niniejszy raport na konkretny plan wdrożenia dostosowany do Twojej organizacji i budżetu.</p>
        <p style="margin-top: 3mm;"><a href="https://aipulse.pl/security/#contact">aipulse.pl/security · kontakt@aipulse.pl</a></p>
      </div>

      <div style="margin-top:10mm; padding-top:5mm; border-top:1px solid #E5E5E5; font-size:8pt; color:#999; font-style:italic;">
        Niniejszy dokument stanowi wynik samooceny deklaratywnej i nie zastępuje pełnego audytu technicznego. Audyt pełny (np. Ai Puls Security Audyt Rozszerzony) obejmuje testy penetracyjne, przegląd konfiguracji oraz analizę logów i może ujawnić dodatkowe luki niewidoczne w samoocenie.
      </div>

      <div class="page-footer">
        <span>Ai Puls Security · kontakt@aipulse.pl · aipulse.pl</span>
        <span>Strona 5 z 10</span>
      </div>
    </div>
  `;
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
