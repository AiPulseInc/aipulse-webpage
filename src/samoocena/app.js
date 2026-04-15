import './styles.css';
import { VERSION } from '../version.js';
import { getQuestions } from './scoring.js';
import { scoreAssessment } from './scoring.js';
import {
  getState,
  setState,
  setStep,
  setProfile,
  saveResponse,
  saveAwarenessAnswer,
  setCurrentAwarenessIndex,
  setCurrentQuestionIndex,
  markStarted,
  markCompleted,
  clearState,
  hasResumableState,
  subscribe,
} from './state.js';
import {
  renderLanding,
  renderProfiling,
  renderCategoryIntro,
  renderQuestion,
  renderAwarenessQuestion,
  renderAwarenessSummary,
  renderThankYou,
  renderResults,
  renderError,
} from './ui.js';
import { getAwarenessQuestions } from './awareness.js';
import { submitAssessment, fetchBenchmark } from './api.js';
import { showConfirmModal, showInputModal } from './modal.js';

const mainEl = document.getElementById('samoocena-main');
const versionEl = document.getElementById('app-version');
if (versionEl) versionEl.textContent = `v${VERSION}`;

const initial = getState();
if (initial.step === 'results' || initial.step === 'thank-you') {
  clearState();
}

render();
subscribe(render);
bindDelegatedEvents();

function render() {
  if (!mainEl) return;
  const state = getState();
  const ctx = buildRenderContext(state);

  try {
    const html = routeToRenderer(state.step, ctx);
    mainEl.innerHTML = `<div class="container-fluid samoocena-viewport">${html}</div>`;
    mainEl.scrollTo?.({ top: 0, behavior: 'instant' });
    window.scrollTo?.({ top: 0, behavior: 'instant' });
  } catch (err) {
    console.error('[samoocena] render error:', err);
    mainEl.innerHTML = `<div class="container-fluid samoocena-viewport">${renderError(err.message || 'Nieznany błąd.')}</div>`;
  }
}

function buildRenderContext(state) {
  const ctx = {
    profile: state.profile,
    responses: state.responses,
    currentIndex: state.currentQuestionIndex,
    startedAt: state.startedAt,
    completedAt: state.completedAt,
    hasResume: hasResumableState(),
    awarenessAnswers: state.awarenessAnswers || {},
    currentAwarenessIndex: state.currentAwarenessIndex || 0,
  };

  if (state.step === 'results') {
    ctx.scoringResult = scoreAssessment(state.responses);
    ctx.benchmark = state.benchmark || null;
  }

  return ctx;
}

function routeToRenderer(step, ctx) {
  switch (step) {
    case 'landing':
      return renderLanding(ctx);
    case 'profiling':
      return renderProfiling(ctx);
    case 'awareness-quiz':
      return renderAwarenessQuestion(ctx);
    case 'awareness-summary':
      return renderAwarenessSummary(ctx);
    case 'category-intro':
      return renderCategoryIntro(ctx);
    case 'question':
      return renderQuestion(ctx);
    case 'thank-you':
      return renderThankYou(ctx);
    case 'results':
      return renderResults(ctx);
    default:
      return renderLanding(ctx);
  }
}

function bindDelegatedEvents() {
  mainEl.addEventListener('click', handleClick);
  mainEl.addEventListener('change', handleChange);
  mainEl.addEventListener('submit', handleSubmit);
  // Global interceptor dla klików na nav linki podczas aktywnej samooceny —
  // modal „stracisz odpowiedzi" + reset state po potwierdzeniu.
  document.addEventListener('click', handleExitAttempt, true);
}

const BLOCKING_STEPS = new Set([
  'profiling',
  'awareness-quiz',
  'awareness-summary',
  'category-intro',
  'question',
]);

function handleExitAttempt(event) {
  // Interesuje nas tylko klik na nav links wyprowadzający z samooceny
  const link = event.target.closest('a[href]');
  if (!link) return;
  // Jeśli link prowadzi gdzieś w ramach samooceny (np. hash#, /bezpieczenstwo-samoocena/...) — nic nie robimy
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#')) return;
  if (href.includes('/bezpieczenstwo-samoocena')) return;
  // Nowa karta — nie przerywa obecnej sesji, nie interceptujemy
  if (link.target === '_blank') return;

  const state = getState();
  if (!BLOCKING_STEPS.has(state.step)) return;

  event.preventDefault();
  event.stopPropagation();

  showConfirmModal({
    title: 'Stracisz wprowadzone odpowiedzi',
    message:
      'Jeśli teraz wyjdziesz, cała samoocena zostanie zresetowana. Przy następnym wejściu zaczniesz od nowa — nic nie zostanie zapisane.',
    confirmLabel: 'Wyjdź i zresetuj',
    cancelLabel: 'Kontynuuj samoocenę',
    onConfirm: () => {
      clearState();
      window.location.href = href;
    },
  });
}

function handleClick(event) {
  const btn = event.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;

  const actions = {
    start: () => {
      clearState();
      markStarted();
      setStep('profiling');
    },
    resume: () => {
      const state = getState();
      if (state.step === 'landing') setStep('question');
    },
    restart: () => {
      if (!confirm('Zacznij od nowa? Aktualne odpowiedzi zostaną usunięte.')) return;
      clearState();
      setStep('landing');
    },
    'back-to-landing': () => setStep('landing'),
    'prev-question': () => {
      const state = getState();
      if (state.currentQuestionIndex > 0) {
        setCurrentQuestionIndex(state.currentQuestionIndex - 1);
      }
    },
    'next-question': () => {
      const state = getState();
      const questions = getQuestions();
      const next = state.currentQuestionIndex + 1;
      const currentCat = Math.floor(state.currentQuestionIndex / 7);
      const nextCat = Math.floor(next / 7);
      if (nextCat > currentCat && nextCat < 5) {
        setState({ step: 'category-intro', currentQuestionIndex: next });
      } else if (next < questions.length) {
        setCurrentQuestionIndex(next);
      }
    },
    'begin-category': () => {
      setStep('question');
    },
    finish: () => {
      setState({
        step: 'thank-you',
        completedAt: new Date().toISOString(),
      });
    },
    'submit-profiling': () => {
      const form = mainEl.querySelector('[data-form="profiling"]');
      if (!form) return;
      const formData = new FormData(form);
      const industry = formData.get('industry');
      const size = formData.get('size');
      if (!industry || !size) {
        const firstEmpty =
          form.querySelector('select[name="industry"]').value === ''
            ? form.querySelector('select[name="industry"]')
            : form.querySelector('select[name="size"]');
        firstEmpty?.focus();
        if (typeof firstEmpty?.reportValidity === 'function') {
          firstEmpty.reportValidity();
        }
        return;
      }
      setProfile({ industry, size });
      setState({ step: 'awareness-quiz', currentAwarenessIndex: 0 });
    },
    'next-awareness': () => {
      const state = getState();
      const awarenessQuestions = getAwarenessQuestions();
      const next = state.currentAwarenessIndex + 1;
      if (next < awarenessQuestions.length) {
        setCurrentAwarenessIndex(next);
      } else {
        setStep('awareness-summary');
      }
    },
    'awareness-to-samoocena': () => {
      setState({ step: 'category-intro', currentQuestionIndex: 0 });
    },
    'prev-awareness': () => {
      const state = getState();
      if (state.currentAwarenessIndex > 0) {
        setCurrentAwarenessIndex(state.currentAwarenessIndex - 1);
      }
    },
    'go-to-results': () => {
      setStep('results');
      scheduleSubmit();
      scheduleBenchmark();
    },
    'download-pdf': () => {
      const state = getState();

      const openReport = (companyName) => {
        if (companyName) setProfile({ companyName });
        const freshState = getState();
        const scoringResult = scoreAssessment(freshState.responses);
        const payload = {
          profile: freshState.profile,
          responses: freshState.responses,
          scoringResult,
          awarenessAnswers: freshState.awarenessAnswers || {},
          assessmentId: freshState.assessmentId || freshState.startedAt || Date.now(),
        };
        try {
          // localStorage — sessionStorage nie jest współdzielony między nowymi tabami
          // ('target=_blank' tworzy izolowany session context w nowoczesnych browserach).
          // raport/app.js usuwa ten klucz po odczytaniu.
          localStorage.setItem('raportData', JSON.stringify(payload));
        } catch (err) {
          console.error('[samoocena] localStorage failed:', err);
        }
        window.open('/raport-audit/', '_blank', 'noopener');
      };

      showInputModal({
        title: 'Nazwa firmy',
        message:
          'Podaj nazwę firmy, która pojawi się na okładce raportu. Dane pozostają lokalne — nie wysyłamy ich nigdzie poza Twoją przeglądarką.',
        placeholder: 'np. Twoja Firma Sp. z o.o.',
        defaultValue: state.profile?.companyName || '',
        required: true,
        confirmLabel: 'Pobierz raport',
        cancelLabel: 'Anuluj',
        onConfirm: (companyName) => openReport(companyName),
      });
    },
    'view-example-report': () => {
      window.open('/raport-audit/?example=1', '_blank', 'noopener');
    },
  };

  const handler = actions[action];
  if (handler) {
    event.preventDefault();
    handler();
  }
}

function handleChange(event) {
  const input = event.target;
  if (input.matches('input[type="radio"][data-question-id]')) {
    const questionId = input.dataset.questionId;
    const optionIndex = Number(input.dataset.optionIndex);
    saveResponse(questionId, optionIndex);
  }
  if (input.matches('input[type="radio"][data-awareness-question-id]')) {
    const questionId = input.dataset.awarenessQuestionId;
    const optionId = input.dataset.optionId;
    saveAwarenessAnswer(questionId, optionId);
  }
}

let benchmarkInFlight = false;

async function scheduleBenchmark() {
  if (benchmarkInFlight) return;
  const state = getState();
  if (state.benchmark) return; // już pobrane w tej sesji
  if (!state.profile?.industry || !state.profile?.size) return;
  benchmarkInFlight = true;
  try {
    const benchmark = await fetchBenchmark(state.profile.industry, state.profile.size);
    if (benchmark) setState({ benchmark });
  } finally {
    benchmarkInFlight = false;
  }
}

let submitInFlight = false;

async function scheduleSubmit() {
  if (submitInFlight) return;
  const state = getState();
  if (state.submittedAt) return; // już wysłane w tej sesji
  submitInFlight = true;
  showSubmitToast('sending');
  try {
    const scoringResult = scoreAssessment(state.responses);
    const result = await submitAssessment(state, scoringResult);
    if (result.ok) {
      setState({ submittedAt: new Date().toISOString() });
      showSubmitToast('success');
    } else {
      showSubmitToast('failed', result.error);
    }
  } finally {
    submitInFlight = false;
  }
}

function showSubmitToast(status, errorMsg = '') {
  const existing = document.querySelector('.samoocena-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `samoocena-toast samoocena-toast-${status}`;
  const text =
    status === 'sending'
      ? 'Zapisywanie anonimowego wyniku…'
      : status === 'success'
        ? '✓ Odpowiedzi zapisane anonimowo (bez danych osobowych).'
        : `Nie udało się zapisać wyniku. Wynik widoczny lokalnie — spróbuję ponownie przy następnym otwarciu.${errorMsg ? ` [${errorMsg}]` : ''}`;
  toast.textContent = text;
  document.body.appendChild(toast);

  if (status !== 'sending') {
    setTimeout(() => toast.classList.add('samoocena-toast-hide'), 4500);
    setTimeout(() => toast.remove(), 5000);
  }
}

function handleSubmit(event) {
  const form = event.target.closest('[data-form]');
  if (!form) return;
  event.preventDefault();

  if (form.dataset.form === 'profiling') {
    const formData = new FormData(form);
    const industry = formData.get('industry');
    const size = formData.get('size');
    if (!industry || !size) return;
    setProfile({ industry, size });
    setState({ step: 'category-intro', currentQuestionIndex: 0 });
  }
}
