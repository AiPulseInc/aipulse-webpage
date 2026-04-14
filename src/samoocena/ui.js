import { getQuestions, getCategoriesMeta } from './scoring.js';
import { renderProgressBar, escapeHtml } from './charts.js';
import { renderManagementResults } from './results-management.js';

const INDUSTRIES = [
  'Produkcja',
  'Handel',
  'Usługi profesjonalne',
  'IT / Software',
  'Zdrowie / Medyczna',
  'Finanse / Księgowość',
  'Transport / Logistyka',
  'Inne',
];

const SIZES = [
  { value: '1-10', label: '1–10 pracowników (mikro)' },
  { value: '11-50', label: '11–50 pracowników (małe)' },
  { value: '51-250', label: '51–250 pracowników (średnie)' },
];

export function renderLanding(ctx) {
  const { hasResume } = ctx;
  const today = new Date().toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return `
    <section class="samoocena-landing">
      <div class="samoocena-landing-tape" aria-hidden="true">
        <span>Ai Puls Security</span>
        <span>Samoocena v1</span>
        <span>Data: ${today}</span>
        <span>CIS v8 · NIST CSF 2.0</span>
        <span>Dla MŚP + JDG PL</span>
      </div>

      <div class="samoocena-landing-hero">
        <div class="samoocena-landing-eyebrow">
          <span class="samoocena-landing-dot"></span>
          <span>Audyt wstępny · Dokument #${today.replace(/\./g, '')}</span>
        </div>

        <h1 class="samoocena-display">Samoocena<br>cyberbezpieczeństwa</h1>
        <p class="samoocena-display-sub">35 pytań · 5 kategorii · 10 minut · Bezpłatnie</p>

        <p class="samoocena-hero-lead">
          Odpowiedź na pytanie, które zarząd zadaje co miesiąc — <strong>gdzie stoimy z cyberbezpieczeństwem</strong>. Framework CIS Controls v8 + NIST CSF 2.0. Bez jargonu, bez pytań o Red Team.
        </p>

        <div class="samoocena-hero-actions">
          ${
            hasResume
              ? `<button type="button" class="samoocena-cta samoocena-cta-primary" data-action="resume">
                   <span class="samoocena-cta-label">Wróć do ostatniej próby</span>
                   <span class="samoocena-cta-arrow" aria-hidden="true">→</span>
                 </button>
                 <button type="button" class="samoocena-cta samoocena-cta-ghost" data-action="restart">Zacznij od nowa</button>`
              : `<button type="button" class="samoocena-cta samoocena-cta-primary" data-action="start">
                   <span class="samoocena-cta-label">Rozpocznij audyt</span>
                   <span class="samoocena-cta-arrow" aria-hidden="true">→</span>
                 </button>
                 <a class="samoocena-cta samoocena-cta-ghost" href="#jak-to-dziala">Jak to działa</a>`
          }
        </div>
      </div>

      <div class="samoocena-stats" aria-label="Statystyki samooceny">
        <div class="samoocena-stat">
          <span class="samoocena-stat-kicker">// Zakres</span>
          <span class="samoocena-stat-num">35<em>pytań</em></span>
          <span class="samoocena-stat-label">W 5 kategoriach (CIS + NIST)</span>
        </div>
        <div class="samoocena-stat">
          <span class="samoocena-stat-kicker">// Czas</span>
          <span class="samoocena-stat-num">10<em>min</em></span>
          <span class="samoocena-stat-label">Średnio do ukończenia</span>
        </div>
        <div class="samoocena-stat">
          <span class="samoocena-stat-kicker">// Koszt</span>
          <span class="samoocena-stat-num">0<em>zł</em></span>
          <span class="samoocena-stat-label">Beta darmowa do końca Q2 2026</span>
        </div>
        <div class="samoocena-stat">
          <span class="samoocena-stat-kicker">// Dane</span>
          <span class="samoocena-stat-num">0<em>e-maili</em></span>
          <span class="samoocena-stat-label">Bez rejestracji, bez spamu</span>
        </div>
      </div>

      <div class="samoocena-deliverables" id="jak-to-dziala">
        <div class="samoocena-deliverables-head">
          <p class="samoocena-section-eyebrow">§ Co dostajesz</p>
          <h2 class="samoocena-section-title">Trzy rzeczy, natychmiast.</h2>
        </div>
        <ol class="samoocena-deliverables-list">
          <li class="samoocena-deliverable">
            <span class="samoocena-deliverable-index">01</span>
            <div class="samoocena-deliverable-body">
              <h3>Wynik dojrzałości</h3>
              <p>Maturity score 0–100 + benchmark na tle firm z Twojej branży i rozmiaru. Cztery poziomy: Initial, Developing, Managed, Optimized.</p>
              <span class="samoocena-deliverable-meta">// Per kategoria · Per pytanie krytyczne</span>
            </div>
          </li>
          <li class="samoocena-deliverable">
            <span class="samoocena-deliverable-index">02</span>
            <div class="samoocena-deliverable-body">
              <h3>Top 3 luki do załatania</h3>
              <p>Konkretne działania z szacowanym kosztem i nakładem. "Wdroż MFA w M365" a nie "rozważ poprawę uwierzytelniania".</p>
              <span class="samoocena-deliverable-meta">// Koszt · Nakład · Impact</span>
            </div>
          </li>
          <li class="samoocena-deliverable">
            <span class="samoocena-deliverable-index">03</span>
            <div class="samoocena-deliverable-body">
              <h3>Raport PDF</h3>
              <p>Dokument gotowy do wysłania zarządowi, ubezpieczycielowi albo audytorowi NIS2. Wersja audytowa, ~10 stron.</p>
              <span class="samoocena-deliverable-meta">// Darmowa w becie · Płatna od Q3 2026</span>
            </div>
          </li>
        </ol>
      </div>

      <footer class="samoocena-landing-footer">
        <p class="samoocena-landing-smallprint">
          Dane są anonimizowane i używane wyłącznie do zagregowanych benchmarków. Żadnych nazw firm, nazwisk, e-maili.
          <a href="/polityka-cookies/">Polityka prywatności</a>.
        </p>
        <div class="samoocena-landing-credits">
          <span>Framework</span>
          <strong>CIS Controls v8</strong>
          <span>+</span>
          <strong>NIST CSF 2.0</strong>
          <span>· Regulacje PL</span>
          <strong>NIS2 / KSC / RODO</strong>
        </div>
      </footer>
    </section>
  `;
}

export function renderProfiling(ctx) {
  const { profile } = ctx;
  return `
    <section class="samoocena-profiling">
      <p class="samoocena-kicker">// Krok 1 z 2</p>
      <h1>Powiedz coś o swojej firmie</h1>
      <p class="samoocena-lead">
        Potrzebujemy tego, żeby pokazać Ci benchmark z podobnych firm. Nie zbieramy nazwy firmy ani danych identyfikacyjnych.
      </p>
      <form class="samoocena-form" data-form="profiling">
        <label class="samoocena-field">
          <span class="samoocena-field-label">Branża</span>
          <select name="industry" required>
            <option value="">— Wybierz —</option>
            ${INDUSTRIES.map(
              (ind) => `<option value="${escapeHtml(ind)}"${
                profile.industry === ind ? ' selected' : ''
              }>${escapeHtml(ind)}</option>`
            ).join('')}
          </select>
        </label>
        <label class="samoocena-field">
          <span class="samoocena-field-label">Wielkość firmy</span>
          <select name="size" required>
            <option value="">— Wybierz —</option>
            ${SIZES.map(
              (s) =>
                `<option value="${s.value}"${
                  profile.size === s.value ? ' selected' : ''
                }>${escapeHtml(s.label)}</option>`
            ).join('')}
          </select>
        </label>
        <div class="samoocena-form-actions">
          <button type="button" class="samoocena-cta samoocena-cta-ghost" data-action="back-to-landing">Wstecz</button>
          <button type="button" class="samoocena-cta samoocena-cta-primary" data-action="submit-profiling">
            <span class="samoocena-cta-label">Rozpocznij audyt</span>
            <span class="samoocena-cta-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </section>
  `;
}

export function renderQuestion(ctx) {
  const { currentIndex, responses } = ctx;
  const questions = getQuestions();
  const question = questions[currentIndex];
  const categoriesMeta = getCategoriesMeta();
  const category = categoriesMeta.find((c) => c.id === question.category);
  const currentResponse = responses[question.id];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const progressNum = currentIndex + 1;

  return `
    <section class="samoocena-question-shell">
      ${renderProgressBar(progressNum, questions.length, category.name)}
      <div class="samoocena-question-category">
        <span class="samoocena-kicker">${escapeHtml(category.subtitle)}</span>
      </div>
      <article class="samoocena-question">
        <h2 class="samoocena-question-text">${escapeHtml(question.text)}</h2>
        <div class="samoocena-options" role="radiogroup" aria-label="Opcje odpowiedzi">
          ${question.options
            .map(
              (opt, i) => `
              <label class="samoocena-option${currentResponse === i ? ' is-selected' : ''}">
                <input type="radio" name="question-${question.id}" value="${i}"${
                  currentResponse === i ? ' checked' : ''
                } data-question-id="${question.id}" data-option-index="${i}">
                <span class="samoocena-option-label">${escapeHtml(opt.label)}</span>
              </label>
            `
            )
            .join('')}
        </div>
        <p class="samoocena-question-meta">${escapeHtml(question.mapping)}</p>
      </article>
      <footer class="samoocena-question-nav">
        <button type="button" class="samoocena-btn samoocena-btn-ghost" data-action="prev-question"${
          isFirst ? ' disabled' : ''
        }>← Poprzednie</button>
        <button type="button" class="samoocena-btn samoocena-btn-primary" data-action="${
          isLast ? 'finish' : 'next-question'
        }"${currentResponse === undefined ? ' disabled' : ''}>
          ${isLast ? 'Zakończ i pokaż wynik' : 'Następne →'}
        </button>
      </footer>
    </section>
  `;
}

export function renderCategoryIntro(ctx) {
  const { currentIndex } = ctx;
  const categoriesMeta = getCategoriesMeta();
  const categoryIndex = Math.floor(currentIndex / 7);
  const category = categoriesMeta[categoryIndex];
  const isFirst = categoryIndex === 0;
  const prevCategory = isFirst ? null : categoriesMeta[categoryIndex - 1];

  return `
    <section class="samoocena-category-intro">
      ${
        !isFirst
          ? `
        <div class="samoocena-category-transition">
          <p class="samoocena-kicker">// Koniec sekcji ${String(categoryIndex).padStart(2, '0')}</p>
          <p class="samoocena-category-transition-text">
            Dziękuję — to wszystkie pytania w kategorii <strong>${escapeHtml(prevCategory.name)}</strong>. Przejdźmy do następnej.
          </p>
        </div>
      `
          : ''
      }

      <div class="samoocena-category-meta">
        <span class="samoocena-category-number">${String(categoryIndex + 1).padStart(2, '0')}</span>
        <span class="samoocena-category-divider">/</span>
        <span class="samoocena-category-total">05</span>
      </div>

      <p class="samoocena-kicker">// Kategoria ${categoryIndex + 1} z 5</p>
      <h1 class="samoocena-category-title">${escapeHtml(category.name)}</h1>
      <p class="samoocena-category-subtitle">${escapeHtml(category.subtitle)}</p>
      <p class="samoocena-category-description">${escapeHtml(category.description)}</p>

      <dl class="samoocena-category-meta-grid">
        <div><dt>Pytań</dt><dd>7</dd></div>
        <div><dt>Czas</dt><dd>~2 min</dd></div>
        <div><dt>Postęp</dt><dd>${categoryIndex + 1}/5</dd></div>
      </dl>

      <div class="samoocena-category-actions">
        <button type="button" class="samoocena-cta samoocena-cta-primary" data-action="begin-category">
          <span class="samoocena-cta-label">${isFirst ? 'Rozpocznij pierwszą kategorię' : 'Kontynuuj'}</span>
          <span class="samoocena-cta-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  `;
}

export function renderThankYou(ctx) {
  const { profile, responses, startedAt, completedAt } = ctx;
  const answered = Object.keys(responses).length;
  const durationMinutes =
    startedAt && completedAt
      ? Math.max(1, Math.round((new Date(completedAt) - new Date(startedAt)) / 60000))
      : null;
  return `
    <section class="samoocena-thank-you">
      <p class="samoocena-kicker">// Ukończono samoocenę</p>
      <h1 class="samoocena-thank-you-title">Dziękujemy.<br>Raport jest gotowy.</h1>
      <p class="samoocena-thank-you-lead">
        Odpowiedzi zapisane lokalnie — żadne dane nie zostały wysłane poza Twoją przeglądarkę. Kliknij niżej, żeby zobaczyć pełny wynik z rekomendacjami.
      </p>

      <dl class="samoocena-thank-you-stats">
        <div><dt>Odpowiedzi</dt><dd>${answered}</dd></div>
        <div><dt>Czas</dt><dd>${durationMinutes ? `${durationMinutes} min` : '—'}</dd></div>
        <div><dt>Kategorii</dt><dd>5/5</dd></div>
      </dl>

      <div class="samoocena-thank-you-actions">
        <button type="button" class="samoocena-cta samoocena-cta-primary" data-action="go-to-results">
          <span class="samoocena-cta-label">Zobacz raport</span>
          <span class="samoocena-cta-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  `;
}

export function renderResults(ctx) {
  return renderManagementResults(ctx);
}

export function renderError(message) {
  return `
    <section class="samoocena-error">
      <p class="samoocena-kicker">// Błąd</p>
      <h1>Coś poszło nie tak</h1>
      <p class="samoocena-lead">${escapeHtml(message)}</p>
      <button type="button" class="samoocena-btn samoocena-btn-primary" data-action="restart">Zacznij od nowa</button>
    </section>
  `;
}
