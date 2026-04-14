import { escapeHtml } from './charts.js';
import { topRecommendations } from './recommendations.js';
import { getCategoriesMeta } from './scoring.js';

// Fallback benchmark gdy RPC nie odpowiada albo n=0 (np. pierwsze submity po deploy).
// Wartości z KB — "przeciętne MŚP 11-50 os.".
const FALLBACK_BENCHMARK = {
  A: 55,
  B: 48,
  C: 52,
  D: 45,
  E: 58,
  sampleSize: 42,
  cohortLabel: 'MŚP 11–50 pracowników (szacunek wstępny)',
  scope: 'fallback',
};

const SIZE_LABELS = {
  '1-10': '1–10 pracowników',
  '11-50': '11–50 pracowników',
  '51-250': '51–250 pracowników',
};

export function renderManagementResults(ctx) {
  const { scoringResult, responses, profile } = ctx;
  const benchmark = ctx.benchmark || FALLBACK_BENCHMARK;
  const topRecs = topRecommendations(scoringResult, responses, 5);
  const topGaps = topRecommendations(scoringResult, responses, 3);
  const categoriesMeta = getCategoriesMeta();
  const today = new Date().toLocaleDateString('pl-PL');

  return `
    <article class="samoocena-report">
      ${renderReportCover(scoringResult, today, profile)}
      ${renderExecutiveSummary(scoringResult, topGaps)}
      ${renderCategoryAnalysis(scoringResult, categoriesMeta, profile, benchmark)}
      ${renderTopRecommendations(topRecs)}
      ${renderUpsellSection()}
      ${renderReportCTA()}
      <footer class="samoocena-report-restart">
        <button type="button" class="samoocena-cta samoocena-cta-ghost" data-action="restart">Zacznij nową samoocenę</button>
      </footer>
    </article>
  `;
}

function renderReportCover(scoringResult, date, profile) {
  const pct = scoringResult.overall.percentage;
  const sizeLabel = SIZE_LABELS[profile.size] || profile.size || '—';
  return `
    <section class="samoocena-report-cover">
      <div class="samoocena-report-cover-head">
        <div class="samoocena-report-brand-line">
          <div class="samoocena-report-brand">A<span class="brand-i">i</span> Puls <span class="samoocena-report-brand-accent">Security</span></div>
          <div class="samoocena-report-brand-tagline">Cyber Security</div>
        </div>
      </div>

      <p class="samoocena-kicker samoocena-report-label">// Raport samooceny cyberbezpieczeństwa</p>
      <h1 class="samoocena-report-cover-title">Twój<br>wynik</h1>

      <div class="samoocena-report-score-block">
        <div class="samoocena-report-score-row">
          <div class="samoocena-report-score ${pctToLevelClass(pct)}">${pct}</div>
          <div class="samoocena-report-score-unit">/ 100</div>
        </div>
        <div class="samoocena-report-maturity">${escapeHtml(scoringResult.maturity.label)}</div>
      </div>

      <div class="samoocena-report-cover-meta">
        <span>Data: ${date}</span>
        <span>Wersja: 2026-01</span>
        <span>Profil: ${escapeHtml(profile.industry || '—')} · ${escapeHtml(sizeLabel)}</span>
      </div>
    </section>
  `;
}

function renderExecutiveSummary(scoringResult, topGaps) {
  const pct = scoringResult.overall.percentage;
  const maturity = scoringResult.maturity;
  const risk = getRiskStatement(maturity.key);
  return `
    <section class="samoocena-report-section">
      <p class="samoocena-kicker">// Executive summary</p>
      <h2 class="samoocena-report-h2">Jedna strona, którą musi przeczytać właściciel firmy</h2>

      ${
        scoringResult.guardrailTriggered
          ? `
        <div class="samoocena-guardrail-callout">
          <p class="samoocena-guardrail-label">⚠ Wynik ograniczony</p>
          <p>
            Twój wynik jest ograniczony do <strong>"Developing"</strong> niezależnie od pozostałych odpowiedzi, ponieważ brak MFA oraz brak testowanego backupu to <strong>warunki minimalne</strong> w certyfikacjach CIS Controls v8 i większości polis cyber insurance. Bez tych dwóch elementów żadne inne zabezpieczenia nie kompensują ryzyka paraliżu działalności po incydencie ransomware.
          </p>
        </div>
      `
          : ''
      }

      <div class="samoocena-exec-highlight">
        <p>
          <strong>Twoja firma jest na poziomie "${escapeHtml(maturity.label)}" (${pct}/100)</strong> — ${escapeHtml(maturity.description)} Ryzyko paraliżu działalności w razie incydentu ransomware wynosi <strong>${risk.riskPct}</strong>.
        </p>
      </div>

      <div class="samoocena-exec-box">
        <h3>Co to znaczy w praktyce biznesowej</h3>
        <p>${risk.businessText}</p>
      </div>

      <h3 class="samoocena-report-h3">Twoje 3 największe luki</h3>
      <ol class="samoocena-report-gaps">
        ${topGaps
          .map(
            (g) => `
          <li>
            <strong>${escapeHtml(g.title)}</strong> — ${escapeHtml(g.action)}
          </li>
        `
          )
          .join('')}
      </ol>

      <h3 class="samoocena-report-h3">Ryzyko finansowe (szacowane)</h3>
      <p class="samoocena-report-paragraph">
        Przeciętny incydent ransomware w MŚP w 2026 roku: <strong>45–120 tys. zł</strong> (przestój + odzyskiwanie + kary RODO + koszt reputacji). Trzy pierwsze rekomendacje z tego raportu obniżają to ryzyko o szacowane <strong>75%</strong>.
      </p>
    </section>
  `;
}

function renderCategoryAnalysis(scoringResult, categoriesMeta, profile, benchmark) {
  const entries = categoriesMeta.map((cat) => ({
    id: cat.id,
    name: cat.name,
    pct: scoringResult.categories[cat.id]?.percentage ?? 0,
    benchmark: Math.round(benchmark[cat.id] ?? 50),
  }));
  const above = entries.filter((e) => e.pct > e.benchmark);
  const below = entries.filter((e) => e.pct < e.benchmark);
  const equal = entries.filter((e) => e.pct === e.benchmark);
  const isFallback = benchmark.scope === 'fallback';
  const scopeNote = {
    industry_size: 'dokładna kohorta (Twoja branża + rozmiar)',
    size_only: 'kohorta po rozmiarze firmy (wszystkie branże)',
    all_smb: 'wszystkie MŚP z próby',
    fallback: 'szacunek wstępny z bazy wiedzy (realne dane spłyną wraz z kolejnymi samoocenami)',
  }[benchmark.scope] || 'kohorta';
  return `
    <section class="samoocena-report-section">
      <p class="samoocena-kicker">// Analiza kategorii</p>
      <h2 class="samoocena-report-h2">Gdzie jesteś mocny, gdzie słaby</h2>
      <p class="samoocena-report-paragraph samoocena-report-muted">
        Pionowy znacznik = średnia dla ${escapeHtml(benchmark.cohortLabel)} (n=${benchmark.sampleSize}).${isFallback ? ' <em>Realne dane podłączą się automatycznie, gdy próba osiągnie wystarczający rozmiar.</em>' : ''}
      </p>

      <div class="samoocena-report-bars">
        ${entries.map((e) => renderReportBar(e)).join('')}
      </div>

      <div class="samoocena-exec-box">
        <h3>Co mówi benchmark</h3>
        ${
          above.length
            ? `<p><strong>Jesteś lepszy niż średnia w:</strong> ${above
                .map((a) => `${escapeHtml(a.name)} (+${a.pct - a.benchmark})`)
                .join(', ')}</p>`
            : ''
        }
        ${
          below.length
            ? `<p><strong>Jesteś gorszy niż średnia w:</strong> ${below
                .map((b) => `${escapeHtml(b.name)} (${b.pct - b.benchmark})`)
                .join(', ')}</p>`
            : ''
        }
        ${
          equal.length
            ? `<p><strong>Równy średniej w:</strong> ${equal.map((e) => escapeHtml(e.name)).join(', ')}</p>`
            : ''
        }
        <p class="samoocena-report-footnote">
          Próba: ${benchmark.sampleSize} firm z kohorty „${escapeHtml(benchmark.cohortLabel)}" — ${escapeHtml(scopeNote)}. Kwestionariusz 2026-01.
        </p>
      </div>
    </section>
  `;
}

function renderReportBar(e) {
  const levelClass = pctToLevelClass(e.pct);
  return `
    <div class="samoocena-report-bar ${levelClass}">
      <div class="samoocena-report-bar-label">${escapeHtml(e.name)}</div>
      <div class="samoocena-report-bar-track">
        <div class="samoocena-report-bar-fill" style="width: ${e.pct}%"></div>
        <div class="samoocena-report-bar-benchmark" style="left: ${e.benchmark}%" title="Średnia branży: ${e.benchmark}"></div>
      </div>
      <div class="samoocena-report-bar-value">${e.pct}</div>
    </div>
  `;
}

function renderTopRecommendations(recs) {
  return `
    <section class="samoocena-report-section">
      <p class="samoocena-kicker">// Top 5 rekomendacji</p>
      <h2 class="samoocena-report-h2">Co zrobić w pierwszej kolejności</h2>
      <p class="samoocena-report-paragraph samoocena-report-muted">
        Posortowane według: największy wpływ na bezpieczeństwo / najmniejszy koszt wdrożenia.
      </p>
      <ol class="samoocena-report-recs">
        ${recs.map((r, i) => renderReportRec(r, i + 1)).join('')}
      </ol>
    </section>
  `;
}

function renderReportRec(rec, num) {
  const impact = impactLabel(rec);
  return `
    <li class="samoocena-report-rec">
      <div class="samoocena-report-rec-num">${num}</div>
      <div class="samoocena-report-rec-body">
        <h4>${escapeHtml(rec.title)}</h4>
        <p>${escapeHtml(rec.action)}</p>
        <div class="samoocena-report-rec-meta">
          <span>Koszt: <strong class="samoocena-tag-cost">${escapeHtml(rec.cost)}</strong></span>
          <span>Wdrożenie: <strong class="samoocena-tag-effort">${escapeHtml(rec.effort)}</strong></span>
          <span>Impact: <strong class="samoocena-tag-impact impact-${impact.toLowerCase()}">${escapeHtml(impact)}</strong></span>
        </div>
        ${rec.impact ? `<p class="samoocena-report-rec-why">${escapeHtml(rec.impact)}</p>` : ''}
      </div>
    </li>
  `;
}

function renderUpsellSection() {
  return `
    <section class="samoocena-report-upsell">
      <p class="samoocena-kicker">// Pełny raport audytowy</p>
      <h2 class="samoocena-report-h2">Rozszerzona wersja raportu — 10 stron gotowych do druku</h2>
      <p class="samoocena-report-paragraph samoocena-report-muted">
        Wersja audit, którą możesz zapisać jako PDF, przekazać zarządowi albo dołączyć do wniosku ubezpieczeniowego.
      </p>

      <ul class="samoocena-report-upsell-benefits">
        <li><strong>Szczegółowa analiza</strong> wszystkich 35 pytań z Twoimi odpowiedziami i interpretacją</li>
        <li><strong>Mapowanie compliance</strong>: CIS Controls v8, NIST CSF 2.0, NIS2, RODO</li>
        <li><strong>Executive briefing</strong> dla zarządu + roadmap 30/60/90 dni</li>
        <li><strong>Gotowy materiał</strong> do rozmowy z ubezpieczycielem cyber lub audytorem</li>
        <li><strong>Wersja print-ready A4</strong> + PDF do archiwum</li>
      </ul>

      <div class="samoocena-report-upsell-cta">
        <button type="button" class="samoocena-cta samoocena-cta-primary" data-action="download-pdf">
          Pobierz swój raport
        </button>
        <button type="button" class="samoocena-cta samoocena-cta-ghost" data-action="view-example-report">
          Zobacz przykładowy raport
        </button>
      </div>

      <p class="samoocena-report-upsell-note">
        <em>W wersji beta oba raporty są darmowe. Docelowo raport rozszerzony: <strong>149 zł</strong>.</em>
      </p>
    </section>
  `;
}

function renderReportCTA() {
  return `
    <section class="samoocena-report-cta">
      <h3>Chcesz to zamienić na konkretny plan wdrożenia?</h3>
      <p>Umów bezpłatną 30-minutową konsultację. Porozmawiamy o Twojej sytuacji i powiemy, co zrobilibyśmy <strong>najpierw</strong>, w Twoim kontekście.</p>
      <a class="samoocena-report-cta-link" href="/security/#contact">Umów konsultację →</a>
    </section>
  `;
}

function pctToLevelClass(pct) {
  if (pct < 26) return 'level-initial';
  if (pct < 51) return 'level-developing';
  if (pct < 76) return 'level-managed';
  return 'level-optimized';
}

function impactLabel(rec) {
  if (rec.critical) return 'KRYTYCZNY';
  if (rec.gapPoints >= 2) return 'WYSOKI';
  return 'ŚREDNI';
}

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
