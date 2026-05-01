import './styles.css';
import { initGA, trackEvent, trackPageView } from '../ga.js';
import { VERSION } from '../version.js';

initGA();
import { getQuestions } from './scoring.js';
import { scoreAssessment } from './scoring.js';
import {
  getState,
  setState,
  setStep,
  setProfile,
  setDnsScan,
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
  renderProfileDomain,
  renderCategoryIntro,
  renderQuestion,
  renderAwarenessQuestion,
  renderAwarenessSummary,
  renderThankYou,
  renderResults,
  renderError,
} from './ui.js';
import { getAwarenessQuestions } from './awareness.js';
import { submitAssessment, fetchBenchmark, scanDomain, sendReport } from './api.js';
import { showConfirmModal, showInputModal, showRaportRequestModal } from './modal.js';

const mainEl = document.getElementById('samoocena-main');
const versionEl = document.getElementById('app-version');
if (versionEl) versionEl.textContent = `v${VERSION}`;

const initial = getState();
if (initial.step === 'results' || initial.step === 'thank-you') {
  clearState();
}

let lastTrackedStep = null;

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
    if (state.step && state.step !== lastTrackedStep) {
      lastTrackedStep = state.step;
      trackPageView(`/bezpieczenstwo-samoocena/${state.step}`, `Samoocena — ${state.step}`);
    }
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
    case 'profile-domain':
      return renderProfileDomain(ctx);
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
  mainEl.addEventListener('input', handleChange);  // live validation dla domain input
  mainEl.addEventListener('submit', handleSubmit);
  // Global interceptor dla klików na nav linki podczas aktywnej samooceny —
  // modal „stracisz odpowiedzi" + reset state po potwierdzeniu.
  document.addEventListener('click', handleExitAttempt, true);
}

const BLOCKING_STEPS = new Set([
  'profiling',
  'profile-domain',
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
      setState({ step: 'profile-domain' });
    },
    'submit-profile-domain': () => {
      const input = mainEl.querySelector('[data-domain-input]');
      const raw = (input?.value || '').trim();
      if (!raw) return;
      const normalized = normalizeDomain(raw);
      if (!isValidDomain(normalized)) return;
      setProfile({ companyDomain: normalized, dnsScanOptOut: false });
      runScanFlow(normalized);
    },
    'optout-profile-domain': () => {
      setProfile({ companyDomain: null, dnsScanOptOut: true });
      setDnsScan(null);
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

      showRaportRequestModal({
        defaultCompanyName: state.profile?.companyName || '',
        defaultEmail: state.profile?.email || '',
        defaultMarketingConsent: state.profile?.marketingConsent ?? true,
        onConfirm: async ({ companyName, email, marketingConsent }) => {
          if (companyName) setProfile({ companyName });
          setProfile({ email, marketingConsent });
          const freshState = getState();
          const scoringResult = scoreAssessment(freshState.responses);
          const payload = {
            profile: freshState.profile,
            responses: freshState.responses,
            scoringResult,
            awarenessAnswers: freshState.awarenessAnswers || {},
            dnsScan: freshState.dnsScan || null,
          };

          // Fallback do localStorage (gdy sendReport failuje lub brak assessmentId)
          const fallbackOpen = () => {
            try {
              localStorage.setItem(
                'raportData',
                JSON.stringify({ ...payload, assessmentId: freshState.assessmentId || Date.now() }),
              );
            } catch (err) {
              console.error('[samoocena] localStorage failed:', err);
            }
            trackEvent('raport_requested', { channel: 'fallback' });
            window.open('/raport-audit/', '_blank', 'noopener');
          };

          if (!freshState.assessmentId) {
            console.warn('[samoocena] brak assessmentId — fallback localStorage');
            fallbackOpen();
            return;
          }

          const res = await sendReport(freshState.assessmentId, {
            email,
            marketingConsent,
            payload,
          });

          if (res.ok && res.reportUrl) {
            trackEvent('raport_requested', { channel: 'online' });
            // Otwórz online wersję raportu (dane przyjdą z DB przez ?id=)
            window.open(res.reportUrl, '_blank', 'noopener');
          } else {
            console.warn('[samoocena] sendReport failed, fallback to localStorage:', res.error);
            fallbackOpen();
          }
        },
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
  if (input.matches('[data-domain-input]')) {
    const status = mainEl.querySelector('[data-domain-status]');
    const submitBtn = mainEl.querySelector('[data-action="submit-profile-domain"]');
    const normalized = normalizeDomain(input.value);
    if (!input.value.trim()) {
      if (status) { status.textContent = ''; status.removeAttribute('data-state'); }
      submitBtn?.setAttribute('disabled', 'true');
    } else if (isValidDomain(normalized)) {
      if (status) { status.textContent = `✓ ${normalized}`; status.dataset.state = 'valid'; }
      submitBtn?.removeAttribute('disabled');
    } else {
      if (status) { status.textContent = '✗ Niepoprawny format domeny'; status.dataset.state = 'invalid'; }
      submitBtn?.setAttribute('disabled', 'true');
    }
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
      trackEvent('assessment_completed', {
        score: scoringResult.totalScore,
        level: scoringResult.maturityLevel,
        industry: state.profile?.industry,
        size: state.profile?.size,
      });
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

const DOMAIN_REGEX = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

function normalizeDomain(input) {
  return String(input).trim().toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}

function isValidDomain(d) {
  if (!d || d.length < 4) return false;
  if (!DOMAIN_REGEX.test(d)) return false;
  if (/^(localhost|127\.|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(d)) return false;
  if (/\.(local|internal|test|example)$/i.test(d)) return false;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(d)) return false;
  return true;
}

function showScanOverlay() {
  const existing = document.querySelector('.samoocena-scan-overlay');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.className = 'samoocena-scan-overlay';
  overlay.innerHTML = `
    <div class="samoocena-scan-overlay-inner">
      <div class="samoocena-scan-overlay-title">Skanujemy publiczne rekordy DNS</div>
      <ul class="samoocena-scan-overlay-list">
        <li data-step="dns" class="is-active">subdomeny i adresy IP</li>
        <li data-step="email">konfiguracja email security (SPF/DMARC)</li>
        <li data-step="parse">analiza i interpretacja</li>
      </ul>
      <div class="samoocena-scan-overlay-meta">~5 sekund · pasywnie</div>
    </div>
  `;
  document.body.appendChild(overlay);
  // Sequencjne podświetlanie kroków — czysto dekoracyjne, nie real progress
  setTimeout(() => {
    overlay.querySelector('[data-step="dns"]')?.classList.replace('is-active', 'is-done');
    overlay.querySelector('[data-step="email"]')?.classList.add('is-active');
  }, 1500);
  setTimeout(() => {
    overlay.querySelector('[data-step="email"]')?.classList.replace('is-active', 'is-done');
    overlay.querySelector('[data-step="parse"]')?.classList.add('is-active');
  }, 3000);
  return overlay;
}

function hideScanOverlay() {
  document.querySelector('.samoocena-scan-overlay')?.remove();
}

async function runScanFlow(domain) {
  const overlay = showScanOverlay();
  try {
    const result = await scanDomain(domain);
    // Zapisz cokolwiek dostaliśmy — `ok: true` z data lub `ok: false` z error.
    // Frontend nie pokazuje user-facing błędu (silent backend per Q3 odpowiedź).
    setDnsScan({
      ok: !!result?.ok,
      fetched_at: new Date().toISOString(),
      data: result?.ok ? result.data : null,
      error: result?.ok ? null : (result?.error || 'unknown'),
    });
  } catch (err) {
    console.warn('[samoocena] scan flow failed:', err);
    setDnsScan({
      ok: false,
      fetched_at: new Date().toISOString(),
      data: null,
      error: err.message || 'unknown',
    });
  } finally {
    hideScanOverlay();
    setState({ step: 'awareness-quiz', currentAwarenessIndex: 0 });
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
    setState({ step: 'profile-domain' });
  }
}
