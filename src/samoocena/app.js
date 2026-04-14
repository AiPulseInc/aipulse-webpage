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
  renderThankYou,
  renderResults,
  renderError,
} from './ui.js';

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
  };

  if (state.step === 'results') {
    ctx.scoringResult = scoreAssessment(state.responses);
    ctx.benchmark = null;
  }

  return ctx;
}

function routeToRenderer(step, ctx) {
  switch (step) {
    case 'landing':
      return renderLanding(ctx);
    case 'profiling':
      return renderProfiling(ctx);
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
      setState({ step: 'category-intro', currentQuestionIndex: 0 });
    },
    'go-to-results': () => {
      setStep('results');
    },
    'download-pdf': () => {
      // Placeholder do A6 — Edge Function generate-report
      alert('Generowanie PDF zostanie podpięte w A6 (Edge Function + Supabase Storage).');
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
