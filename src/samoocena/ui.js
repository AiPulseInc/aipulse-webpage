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
  return `
    <section class="samoocena-landing">
      <p class="samoocena-kicker">// Samoocena bezpieczeństwa</p>
      <h1>Sprawdź w 10 minut, gdzie Twoja firma stoi z cyberbezpieczeństwem</h1>
      <p class="samoocena-lead">
        35 pytań, 5 kategorii. Na koniec dostajesz: wynik vs branża, mapę luk, top 3 rekomendacje i pełny raport PDF — darmowo w wersji beta.
      </p>
      <ul class="samoocena-landing-points">
        <li><strong>Oparte na CIS Controls v8 i NIST CSF 2.0</strong> — standardach używanych przez audytorów.</li>
        <li><strong>Dostosowane do realiów MŚP</strong> — brak pytań o pentest Red Team, brak jargonu.</li>
        <li><strong>Bez konta, bez płatności, bez spamu</strong> — darmowa beta do końca Q2 2026.</li>
      </ul>
      <div class="samoocena-landing-actions">
        ${
          hasResume
            ? `<button type="button" class="samoocena-btn samoocena-btn-primary" data-action="resume">Wróć do ostatniej próby</button>
               <button type="button" class="samoocena-btn samoocena-btn-ghost" data-action="restart">Zacznij od nowa</button>`
            : `<button type="button" class="samoocena-btn samoocena-btn-primary" data-action="start">Rozpocznij test</button>`
        }
      </div>
      <p class="samoocena-meta">
        Dane nie są łączone z Tobą — tylko zagregowane benchmarki.
        <a href="/polityka-cookies/">Polityka prywatności</a>
      </p>
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
      <form class="samoocena-form" data-form="profiling" novalidate>
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
          <button type="button" class="samoocena-btn samoocena-btn-ghost" data-action="back-to-landing">Wstecz</button>
          <button type="submit" class="samoocena-btn samoocena-btn-primary">Rozpocznij pytania →</button>
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
      ${renderProgressBar(progressNum, questions.length)}
      <div class="samoocena-question-category">
        <span class="samoocena-kicker">${escapeHtml(category.name)} · ${escapeHtml(category.subtitle)}</span>
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
        ${
          question.critical
            ? `<p class="samoocena-question-critical">⚠ Pytanie krytyczne — odpowiedź wpływa na poziom dojrzałości.</p>`
            : ''
        }
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
      <p class="samoocena-question-meta">${escapeHtml(question.mapping)}</p>
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
