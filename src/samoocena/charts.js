import { getCategoriesMeta } from './scoring.js';

export function renderCategoryBars(scoringResult) {
  const categoriesMeta = getCategoriesMeta();
  return `
    <div class="samoocena-bars">
      ${categoriesMeta
        .map((cat) => {
          const data = scoringResult.categories[cat.id];
          const pct = data?.percentage ?? 0;
          const levelClass = pctToLevelClass(pct);
          return `
            <div class="samoocena-bar-row">
              <div class="samoocena-bar-head">
                <span class="samoocena-bar-label">${escapeHtml(cat.name)}</span>
                <span class="samoocena-bar-value">${pct}%</span>
              </div>
              <div class="samoocena-bar-track">
                <div class="samoocena-bar-fill ${levelClass}" style="width: ${pct}%"></div>
              </div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

export function renderOverallScore(scoringResult) {
  const pct = scoringResult.overall.percentage;
  const levelClass = pctToLevelClass(pct);
  return `
    <div class="samoocena-overall">
      <div class="samoocena-overall-number ${levelClass}">${pct}<span class="samoocena-overall-percent">/100</span></div>
      <div class="samoocena-overall-label">
        <span class="samoocena-maturity-key">${escapeHtml(scoringResult.maturity.label)}</span>
        <p class="samoocena-maturity-desc">${escapeHtml(scoringResult.maturity.description)}</p>
      </div>
    </div>
  `;
}

export function renderBenchmarkLine(benchmark) {
  if (!benchmark) return '';
  const delta = benchmark.you - benchmark.cohort;
  const deltaStr = delta >= 0 ? `+${delta}` : `${delta}`;
  const deltaClass = delta >= 0 ? 'is-positive' : 'is-negative';
  return `
    <div class="samoocena-benchmark">
      <span class="samoocena-benchmark-label">Benchmark</span>
      <span class="samoocena-benchmark-values">
        Ty: <strong>${benchmark.you}</strong> · Kohorta: <strong>${benchmark.cohort}</strong>
        <span class="samoocena-benchmark-delta ${deltaClass}">(${deltaStr})</span>
      </span>
      <span class="samoocena-benchmark-meta">n=${benchmark.sampleSize} · ${escapeHtml(benchmark.cohortLabel)}</span>
    </div>
  `;
}

export function renderProgressBar(current, total, categoryLabel) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return `
    <div class="samoocena-progress-wrap">
      <div class="samoocena-progress-counter">${current}<span class="samoocena-progress-counter-total">/${total}</span></div>
      ${categoryLabel ? `<div class="samoocena-progress-category-label">${escapeHtml(categoryLabel)}</div>` : ''}
    </div>
    <div class="samoocena-progress" role="progressbar" aria-valuenow="${current}" aria-valuemin="0" aria-valuemax="${total}">
      <div class="samoocena-progress-fill" style="width: ${pct}%"></div>
    </div>
  `;
}

function pctToLevelClass(pct) {
  if (pct < 26) return 'level-initial';
  if (pct < 51) return 'level-developing';
  if (pct < 76) return 'level-managed';
  return 'level-optimized';
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
