const STORAGE_KEY = 'samoocena_state_v1';

const INITIAL_STATE = {
  step: 'landing',
  profile: { industry: '', size: '' },
  responses: {},
  currentQuestionIndex: 0,
  startedAt: null,
  completedAt: null,
  assessmentId: null,
};

let state = loadState();
const listeners = new Set();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...INITIAL_STATE };
    const parsed = JSON.parse(raw);
    return { ...INITIAL_STATE, ...parsed };
  } catch {
    return { ...INITIAL_STATE };
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage pełne lub niedostępne — pozwalamy działać w pamięci
  }
}

function notify() {
  for (const listener of listeners) listener(state);
}

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setState(patch) {
  state = { ...state, ...patch };
  persist();
  notify();
}

export function setStep(step) {
  setState({ step });
}

export function setProfile(profile) {
  setState({ profile: { ...state.profile, ...profile } });
}

export function saveResponse(questionId, optionIndex) {
  state = {
    ...state,
    responses: { ...state.responses, [questionId]: optionIndex },
  };
  persist();
  notify();
}

export function setCurrentQuestionIndex(index) {
  setState({ currentQuestionIndex: index });
}

export function markStarted() {
  if (!state.startedAt) setState({ startedAt: new Date().toISOString() });
}

export function markCompleted() {
  setState({
    completedAt: new Date().toISOString(),
    step: 'results',
  });
}

export function setAssessmentId(id) {
  setState({ assessmentId: id });
}

export function clearState() {
  state = { ...INITIAL_STATE };
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
  notify();
}

export function hasResumableState() {
  return (
    state.step !== 'landing' &&
    state.step !== 'results' &&
    Object.keys(state.responses).length > 0
  );
}
