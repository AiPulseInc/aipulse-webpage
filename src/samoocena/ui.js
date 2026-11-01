import { getCategoriesMeta } from './scoring.js';
import { getAwarenessQuestions, getAwarenessMeta, scoreAwareness, getBridgeComment } from './awareness.js';
import { renderProgressBar, escapeHtml } from './charts.js';
import { renderManagementResults } from './results-management.js';
import {
  getFunnelQuestions,
  getFunnelStageForIndex,
  getScreeningQuestionCount,
  getFullQuestionCount,
} from './funnel.js';
import { topRecommendations } from './recommendations.js';

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
        <span>Ai Pulse Security</span>
        <span>Samoocena v1</span>
        <span>Data: ${today}</span>
        <span>CIS v8 · NIST CSF 2.0</span>
        <span>Dla MŚP + JDG PL</span>
      </div>

      <div class="samoocena-landing-hero">
        <p class="samoocena-landing-eyebrow">// Audyt wstępny</p>

        <h1 class="samoocena-display">Samoocena<br>cyberbezpieczeństwa</h1>
        <p class="samoocena-display-sub">Pierwszy wynik w 2 minuty · Bez maila · Bezpłatnie</p>

        <p class="samoocena-hero-lead">
          Zacznij od <strong>3 najważniejszych pytań</strong> o MFA, backup i reakcję na incydent. Od razu zobaczysz pierwszy sygnał ryzyka. Potem sam zdecydujesz, czy chcesz doprecyzować wynik.
        </p>
      </div>

      <div class="samoocena-stats" aria-label="Statystyki samooceny">
        <div class="samoocena-stat">
          <span class="samoocena-stat-kicker">// Start</span>
          <span class="samoocena-stat-num">3<em>pytania</em></span>
          <span class="samoocena-stat-label">Pierwszy sygnał ryzyka od razu</span>
        </div>
        <div class="samoocena-stat">
          <span class="samoocena-stat-kicker">// Krok 2</span>
          <span class="samoocena-stat-num">+4<em>pytania</em></span>
          <span class="samoocena-stat-label">Dokładniejszy obraz codziennej praktyki</span>
        </div>
        <div class="samoocena-stat">
          <span class="samoocena-stat-kicker">// Diagnoza</span>
          <span class="samoocena-stat-num">+10<em>pytań</em></span>
          <span class="samoocena-stat-label">Rekomendacje z 5 obszarów bezpieczeństwa</span>
        </div>
        <div class="samoocena-stat">
          <span class="samoocena-stat-kicker">// Decyzja</span>
          <span class="samoocena-stat-num">Ty<em>wybierasz</em></span>
          <span class="samoocena-stat-label">Kończysz z wynikiem albo pogłębiasz audyt</span>
        </div>
      </div>

      <div class="samoocena-deliverables" id="jak-to-dziala">
        <div class="samoocena-deliverables-head">
          <p class="samoocena-section-eyebrow">// Co dostajesz</p>
          <h2 class="samoocena-section-title">Trzy rzeczy, natychmiast.</h2>
        </div>
        <ol class="samoocena-deliverables-list">
          <li class="samoocena-deliverable">
            <span class="samoocena-deliverable-index">01</span>
            <div class="samoocena-deliverable-body">
              <h3>Pierwszy sygnał po 3 pytaniach</h3>
              <p>Bez obowiązkowego formularza i bez adresu e-mail. Opcjonalny profil firmy możesz pominąć jednym kliknięciem.</p>
              <span class="samoocena-deliverable-meta">// MFA · Backup · Reakcja na incydent</span>
            </div>
          </li>
          <li class="samoocena-deliverable">
            <span class="samoocena-deliverable-index">02</span>
            <div class="samoocena-deliverable-body">
              <h3>Diagnoza przesiewowa</h3>
              <p>Po 17 odpowiedziach zobaczysz wynik 0–100, najsłabsze obszary i konkretne działania — bez obowiązku wypełniania pełnego audytu.</p>
              <span class="samoocena-deliverable-meta">// Koszt · Nakład · Impact</span>
            </div>
          </li>
          <li class="samoocena-deliverable">
            <span class="samoocena-deliverable-index">03</span>
            <div class="samoocena-deliverable-body">
              <h3>Opcjonalne pogłębienie</h3>
              <p>Jeśli potrzebujesz materiału dla zarządu, ubezpieczyciela lub audytora, możesz rozszerzyć diagnozę do pełnych 35 pytań.</p>
              <span class="samoocena-deliverable-meta">// Bez restartu · Twoje odpowiedzi zostają</span>
            </div>
          </li>
        </ol>
      </div>

      <div class="samoocena-final-cta">
        <div class="samoocena-hero-actions">
          ${
            hasResume
              ? `<button type="button" class="samoocena-cta samoocena-cta-primary" data-action="resume">
                   <span class="samoocena-cta-label">Wróć do ostatniej próby</span>
                   <span class="samoocena-cta-arrow" aria-hidden="true">→</span>
                 </button>
                 <button type="button" class="samoocena-cta samoocena-cta-ghost" data-action="restart">Zacznij od nowa</button>`
              : `<button type="button" class="samoocena-cta samoocena-cta-primary" data-action="start">
                   <span class="samoocena-cta-label">Sprawdź 3 najważniejsze rzeczy</span>
                   <span class="samoocena-cta-arrow" aria-hidden="true">→</span>
                 </button>
                 <a class="samoocena-cta samoocena-cta-ghost" href="#jak-to-dziala">Jak to działa</a>`
          }
        </div>
      </div>

      <footer class="samoocena-landing-footer">
        <p class="samoocena-landing-smallprint">
          Odpowiedzi są zapisywane lokalnie w przeglądarce. Nie prosimy o e-mail, żeby pokazać wynik. Domenę, branżę i wielkość firmy możesz podać opcjonalnie przed pytaniami albo pominąć cały krok.
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
  const prefilledDomain = profile?.companyDomain || '';
  return `
    <section class="samoocena-profiling">
      <p class="samoocena-kicker">// Opcjonalny krok · przed pytaniami</p>
      <h1>Dodaj kontekst do wyniku</h1>
      <p class="samoocena-lead">
        Pasywnie sprawdzimy publiczne rekordy DNS domeny, a profil firmy doda kontekst do wyniku. Po pełnej samoocenie pozwoli też dopasować porównanie z podobnymi firmami. Skan uruchomimy w tle, kiedy Ty będziesz odpowiadać na pytania — bez logowania i bez ingerencji w systemy firmy.
      </p>
      <form class="samoocena-form" data-form="profiling">
        <label class="samoocena-field">
          <span class="samoocena-field-label">Domena firmy</span>
          <input
            type="text"
            name="domain"
            value="${escapeHtml(prefilledDomain)}"
            placeholder="np. firma.pl"
            autocomplete="off"
            spellcheck="false"
            data-domain-input
            required
          />
          <span class="samoocena-field-status" data-domain-status></span>
          <span class="samoocena-field-help">Sprawdzamy wyłącznie publicznie dostępne informacje: zabezpieczenia poczty oraz widoczne subdomeny.</span>
        </label>
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
          <button type="button" class="samoocena-cta samoocena-cta-primary" data-action="submit-profiling" disabled>
            <span class="samoocena-cta-label">Zapisz kontekst i zacznij</span>
            <span class="samoocena-cta-arrow" aria-hidden="true">→</span>
          </button>
          <button type="button" class="samoocena-cta samoocena-cta-ghost" data-action="skip-profiling">Pomiń ten krok i przejdź do pytań</button>
        </div>
      </form>
    </section>
  `;
}

export function renderProfileDomain(ctx) {
  const prefilled = ctx.profile?.companyDomain || '';
  return `
    <section class="samoocena-profile-domain">
      <p class="samoocena-kicker">// Krok 2 z 2 — opcjonalne wzbogacenie</p>
      <h1>Twoja rzeczywista ekspozycja</h1>
      <p class="samoocena-lead">
        Sprawdzimy <strong>pasywnie</strong> co publiczny internet wie o Twojej infrastrukturze:
        widoczne subdomeny i konfigurację bezpieczeństwa email (SPF/DMARC).
        Bez logowania i bez ingerencji w systemy firmy — tylko publiczne rekordy DNS. ~5 sekund.
      </p>
      <form class="samoocena-form" data-form="profile-domain">
        <label class="samoocena-field">
          <span class="samoocena-field-label">Domena firmy</span>
          <input
            type="text"
            name="domain"
            value="${escapeHtml(prefilled)}"
            placeholder="np. firma.pl"
            autocomplete="off"
            spellcheck="false"
            data-domain-input
          />
          <span class="samoocena-field-status" data-domain-status></span>
        </label>
        <div class="samoocena-form-actions samoocena-form-actions-stacked">
          <button
            type="button"
            class="samoocena-cta samoocena-cta-primary"
            data-action="submit-profile-domain"
            disabled
          >
            <span class="samoocena-cta-label">Skanuj i dalej</span>
            <span class="samoocena-cta-arrow" aria-hidden="true">→</span>
          </button>
          <div class="samoocena-form-divider">albo</div>
          <button
            type="button"
            class="samoocena-cta samoocena-cta-ghost"
            data-action="optout-profile-domain"
          >
            <span class="samoocena-cta-label">Rezygnuję z tej części audytu</span>
            <span class="samoocena-cta-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </section>
  `;
}

export function renderQuestion(ctx) {
  const { currentIndex, responses } = ctx;
  const questions = getFunnelQuestions();
  const question = questions[currentIndex];
  const stage = getFunnelStageForIndex(currentIndex);
  const categoriesMeta = getCategoriesMeta();
  const category = categoriesMeta.find((c) => c.id === question.category);
  const currentResponse = responses[question.id];
  const isFirst = stage.localIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const isStageEnd = currentIndex === stage.endIndex;
  const progressNum = stage.localIndex + 1;

  return `
    <section class="samoocena-question-shell">
      ${renderProgressBar(progressNum, stage.questionIds.length, stage.title)}
      <div class="samoocena-question-category">
        <span class="samoocena-kicker">// ${escapeHtml(stage.eyebrow)} · ${escapeHtml(category.name)}</span>
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
      </article>
      <footer class="samoocena-question-footer">
        <div class="samoocena-question-nav">
          <button type="button" class="samoocena-btn samoocena-btn-ghost" data-action="prev-question"${
            isFirst ? ' disabled' : ''
          }>← Poprzednie</button>
          <button type="button" class="samoocena-btn samoocena-btn-primary" data-action="${
            isLast ? 'finish' : isStageEnd ? 'stage-checkpoint' : 'next-question'
          }"${currentResponse === undefined ? ' disabled' : ''}>
            ${isLast ? 'Zakończ pełną samoocenę' : isStageEnd ? 'Pokaż mój wynik →' : 'Następne →'}
          </button>
        </div>
        <p class="samoocena-question-meta">${escapeHtml(question.mapping)}</p>
      </footer>
    </section>
  `;
}

export function renderStageCheckpoint(ctx) {
  const { currentIndex, responses, scoringResult } = ctx;
  const stage = getFunnelStageForIndex(currentIndex);
  const answered = Object.keys(responses).length;
  const score = scoringResult.overall.percentage;
  const stageResponses = Object.fromEntries(
    stage.questionIds
      .filter((questionId) => responses[questionId] !== undefined)
      .map((questionId) => [questionId, responses[questionId]])
  );
  const topGap = topRecommendations(scoringResult, stageResponses, 1)[0];
  const isDiagnosis = stage.id === 'diagnosis';
  const signalLabel = score < 26 ? 'Wysokie ryzyko' : score < 51 ? 'Podstawy wymagają wzmocnienia' : score < 76 ? 'Solidna baza' : 'Dobra gotowość';

  return `
    <section class="samoocena-checkpoint">
      <p class="samoocena-kicker">// ${escapeHtml(stage.title)} · ${answered} odpowiedzi</p>
      <div class="samoocena-checkpoint-grid">
        <div>
          <p class="samoocena-checkpoint-label">Twój aktualny wynik</p>
          <div class="samoocena-checkpoint-score">${score}<span>/100</span></div>
          <h1>${escapeHtml(signalLabel)}</h1>
          <p class="samoocena-lead">
            ${escapeHtml(stage.checkpointCopy)}
          </p>
        </div>
        <aside class="samoocena-checkpoint-gap">
          <span>// Najważniejszy nowy sygnał z tego etapu</span>
          <strong>${escapeHtml(topGap?.title || 'Brak krytycznych luk w tej części')}</strong>
          <p>${escapeHtml(topGap?.action || 'Kontynuuj, aby sprawdzić pozostałe obszary.')}</p>
        </aside>
      </div>

      <div class="samoocena-checkpoint-actions">
        ${
          isDiagnosis
            ? `<button type="button" class="samoocena-cta samoocena-cta-primary" data-action="show-screening-profile">
                 <span class="samoocena-cta-label">Zobacz rekomendacje</span><span class="samoocena-cta-arrow" aria-hidden="true">→</span>
               </button>
               <button type="button" class="samoocena-cta samoocena-cta-ghost" data-action="continue-full">
                 Pełna samoocena — jeszcze ${getFullQuestionCount() - getScreeningQuestionCount()} pytań
               </button>`
            : `<button type="button" class="samoocena-cta samoocena-cta-primary" data-action="continue-stage">
                 <span class="samoocena-cta-label">${escapeHtml(stage.nextLabel)}</span><span class="samoocena-cta-arrow" aria-hidden="true">→</span>
               </button>
               <p class="samoocena-checkpoint-time">${escapeHtml(stage.timeLabel)} · odpowiedzi zostają zapisane</p>`
        }
      </div>
    </section>
  `;
}

export function renderAwarenessQuestion(ctx) {
  const { currentAwarenessIndex, awarenessAnswers } = ctx;
  const questions = getAwarenessQuestions();
  const meta = getAwarenessMeta();
  const question = questions[currentAwarenessIndex];
  const currentAnswer = awarenessAnswers[question.id];
  const isFirst = currentAwarenessIndex === 0;
  const isLast = currentAwarenessIndex === questions.length - 1;
  const progressNum = currentAwarenessIndex + 1;

  return `
    <section class="samoocena-question-shell samoocena-awareness-shell">
      ${renderProgressBar(progressNum, questions.length, 'Świadomość regulacyjna')}
      <div class="samoocena-question-category">
        <span class="samoocena-kicker">${escapeHtml(meta.subtitle)}</span>
      </div>
      <article class="samoocena-question">
        <h2 class="samoocena-question-text">${escapeHtml(question.text)}</h2>
        <div class="samoocena-options" role="radiogroup" aria-label="Opcje odpowiedzi">
          ${question.options
            .map(
              (opt) => `
              <label class="samoocena-option${currentAnswer === opt.id ? ' is-selected' : ''}">
                <input type="radio" name="awareness-${question.id}" value="${escapeHtml(opt.id)}"${
                  currentAnswer === opt.id ? ' checked' : ''
                } data-awareness-question-id="${question.id}" data-option-id="${escapeHtml(opt.id)}">
                <span class="samoocena-option-label">${escapeHtml(opt.label)}</span>
              </label>
            `
            )
            .join('')}
        </div>
      </article>
      <footer class="samoocena-question-footer">
        <div class="samoocena-question-nav">
          <button type="button" class="samoocena-btn samoocena-btn-ghost" data-action="prev-awareness"${
            isFirst ? ' disabled' : ''
          }>← Poprzednie</button>
          <button type="button" class="samoocena-btn samoocena-btn-primary" data-action="next-awareness"${
            currentAnswer === undefined ? ' disabled' : ''
          }>
            ${isLast ? 'Przejdź do samooceny →' : 'Następne →'}
          </button>
        </div>
        <p class="samoocena-question-meta">${escapeHtml(question.reference)}</p>
      </footer>
    </section>
  `;
}

export function renderAwarenessSummary(ctx) {
  const { awarenessAnswers } = ctx;
  const result = scoreAwareness(awarenessAnswers || {});
  const bridgeComment = getBridgeComment(result.correct);
  const scoreClass =
    result.correct === result.total
      ? 'awareness-summary-perfect'
      : result.correct >= 3
        ? 'awareness-summary-high'
        : result.correct >= 2
          ? 'awareness-summary-mid'
          : 'awareness-summary-low';

  return `
    <section class="samoocena-awareness-summary-screen ${scoreClass}">
      <div class="samoocena-awareness-summary-grid">
        <div class="samoocena-awareness-summary-left">
          <p class="samoocena-kicker">// Wynik świadomości regulacyjnej</p>

          <div class="samoocena-awareness-summary-score">
            <span class="samoocena-awareness-summary-num">${result.correct}</span>
            <span class="samoocena-awareness-summary-divider">/</span>
            <span class="samoocena-awareness-summary-total">${result.total}</span>
          </div>

          <h1 class="samoocena-awareness-summary-level">${escapeHtml(result.level.label)}</h1>

          <p class="samoocena-awareness-summary-bridge">${escapeHtml(bridgeComment)}</p>
        </div>

        <div class="samoocena-awareness-summary-right">
          <p class="samoocena-kicker">// Twoje odpowiedzi</p>
          <ol class="samoocena-awareness-summary-list">
            ${result.breakdown.map((item, i) => renderAwarenessSummaryItem(item, i + 1)).join('')}
          </ol>
        </div>
      </div>

      <footer class="samoocena-awareness-summary-actions">
        <button type="button" class="samoocena-cta samoocena-cta-primary" data-action="awareness-to-samoocena">
          <span class="samoocena-cta-label">Przejdź do samooceny</span>
          <span class="samoocena-cta-arrow" aria-hidden="true">→</span>
        </button>
        <p class="samoocena-awareness-summary-meta">Pełne wyjaśnienia w raporcie końcowym</p>
      </footer>
    </section>
  `;
}

function renderAwarenessSummaryItem(item, num) {
  const statusClass = item.isCorrect
    ? 'is-correct'
    : item.isUnknown
      ? 'is-unknown'
      : 'is-wrong';
  const statusIcon = item.isCorrect ? '✓' : item.isUnknown ? '?' : '✗';
  return `
    <li class="samoocena-awareness-summary-item ${statusClass}">
      <span class="samoocena-awareness-summary-item-num">${String(num).padStart(2, '0')}</span>
      <span class="samoocena-awareness-summary-item-icon" aria-hidden="true">${statusIcon}</span>
      <div class="samoocena-awareness-summary-item-body">
        <p class="samoocena-awareness-summary-item-q">${escapeHtml(item.questionText)}</p>
        <p class="samoocena-awareness-summary-item-correct">
          <span class="samoocena-awareness-summary-item-correct-label">Poprawnie:</span>
          ${escapeHtml(item.correctAnswerLabel)}
        </p>
      </div>
    </li>
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
  const { responses, startedAt, completedAt, scoringResult, assessmentDepth } = ctx;
  const answered = Object.keys(responses).length;
  const durationMinutes =
    startedAt && completedAt
      ? Math.max(1, Math.round((new Date(completedAt) - new Date(startedAt)) / 60000))
      : null;
  return `
    <section class="samoocena-thank-you">
      <p class="samoocena-kicker">// ${assessmentDepth === 'full' ? 'Pełna samoocena ukończona' : 'Diagnoza przesiewowa ukończona'}</p>
      <h1 class="samoocena-thank-you-title">Twój wynik: ${scoringResult?.overall?.percentage ?? 0}/100.<br>Rekomendacje są gotowe.</h1>
      <p class="samoocena-thank-you-lead">
        Kliknij niżej, żeby zobaczyć najsłabsze obszary i konkretne działania w kolejności od najważniejszych.
      </p>

      <dl class="samoocena-thank-you-stats">
        <div><dt>Odpowiedzi</dt><dd>${answered}</dd></div>
        <div><dt>Czas</dt><dd>${durationMinutes ? `${durationMinutes} min` : '—'}</dd></div>
        <div><dt>Zakres</dt><dd>${assessmentDepth === 'full' ? 'pełny' : 'przesiewowy'}</dd></div>
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
