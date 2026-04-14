import { renderOverallScore, renderCategoryBars, renderBenchmarkLine, escapeHtml } from './charts.js';
import { topRecommendations } from './recommendations.js';

export function renderManagementResults(ctx) {
  const { scoringResult, responses, profile, benchmark } = ctx;
  const recs = topRecommendations(scoringResult, responses, 3);

  return `
    <section class="samoocena-results">
      <header class="samoocena-results-head">
        <p class="samoocena-kicker">// Wynik samooceny</p>
        <h1>Twój wynik</h1>
        <p class="samoocena-lead">
          Jedna strona, którą musi przeczytać właściciel firmy. Pełny raport audytowy (~10 stron) do pobrania niżej.
        </p>
      </header>

      ${renderOverallScore(scoringResult)}
      ${renderBenchmarkLine(benchmark)}

      <div class="samoocena-section-card">
        <h2>Gdzie jesteś mocny, gdzie słaby</h2>
        ${renderCategoryBars(scoringResult)}
      </div>

      <div class="samoocena-section-card">
        <h2>Co zrobić w pierwszej kolejności</h2>
        <ol class="samoocena-recs">
          ${recs
            .map(
              (rec, i) => `
              <li class="samoocena-rec">
                <div class="samoocena-rec-head">
                  <span class="samoocena-rec-num">${i + 1}</span>
                  <div>
                    <h3>${escapeHtml(rec.title)}</h3>
                    <p class="samoocena-rec-cat">${escapeHtml(rec.categoryName)}${rec.critical ? ' · krytyczne' : ''}</p>
                  </div>
                </div>
                <p class="samoocena-rec-action">${escapeHtml(rec.action)}</p>
                <div class="samoocena-rec-meta">
                  <span><strong>Koszt:</strong> ${escapeHtml(rec.cost)}</span>
                  <span><strong>Nakład:</strong> ${escapeHtml(rec.effort)}</span>
                </div>
                <p class="samoocena-rec-impact">${escapeHtml(rec.impact)}</p>
              </li>
            `
            )
            .join('')}
        </ol>
      </div>

      <div class="samoocena-section-card samoocena-cta-card">
        <h2>Pełny raport audytowy PDF</h2>
        <p>Szczegółowa analiza ~10 stron: wyniki per pytanie, mapa zgodności NIS2/RODO, roadmap 30/60/90 dni. Darmowy w wersji beta.</p>
        <button type="button" class="samoocena-btn samoocena-btn-primary" data-action="download-pdf" disabled>
          Pobierz PDF (dostępne po A6)
        </button>
        <p class="samoocena-meta">${escapeHtml(profile.industry || '—')} · ${escapeHtml(sizeLabel(profile.size))}</p>
      </div>

      <div class="samoocena-section-card samoocena-cta-card">
        <h2>Chcesz tego w swojej firmie?</h2>
        <p>Ai Puls pomaga MŚP domknąć luki z tego raportu — szkolenia, vCISO, wdrożenia narzędzi.</p>
        <a class="samoocena-btn samoocena-btn-outline" href="/security/#contact">Umów konsultację</a>
      </div>

      <div class="samoocena-restart">
        <button type="button" class="samoocena-btn samoocena-btn-ghost" data-action="restart">Zacznij od nowa</button>
      </div>
    </section>
  `;
}

function sizeLabel(size) {
  const map = {
    '1-10': '1–10 pracowników',
    '11-50': '11–50 pracowników',
    '51-250': '51–250 pracowników',
  };
  return map[size] || size || '—';
}
