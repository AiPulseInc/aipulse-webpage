// Anonymous submission flow — wysyłka zakończonej samooceny do Supabase.
// Używa publishable key z RLS policy `assessments_anon_insert` + `responses_anon_insert`.
// Non-blocking: failure nie blokuje renderu wyników, retry z exp backoff w tle.

import { getSupabaseBrowser } from '../lib/supabase-browser.js';
import { getQuestions } from './scoring.js';
import { scoreAwareness } from './awareness.js';

const QUESTIONNAIRE_VERSION = '2026-01';

// Kategoria frontend (A-E) → kolumna schema (score_*)
const CATEGORY_TO_COLUMN = {
  A: 'score_people',
  B: 'score_data',
  C: 'score_systems',
  D: 'score_governance',
  E: 'score_compliance',
};

// Kategoria frontend (A-E) → enum response.category_key
const CATEGORY_TO_KEY = {
  A: 'people',
  B: 'data',
  C: 'systems',
  D: 'governance',
  E: 'compliance',
};

// Frontend label branży (8 opcji w ui.js) → schema enum (5 opcji — check constraint)
// Zgęszczenie ma dwa powody:
// (1) benchmark bez rozrzedzenia próby — na 8 kategoriach n<30 w każdej byłoby latami
// (2) granice branż dla MŚP są tak czy inaczej rozmyte (np. SaaS-Finanse)
const INDUSTRY_MAP = {
  Produkcja: 'produkcja',
  Handel: 'handel',
  'Usługi profesjonalne': 'uslugi',
  'IT / Software': 'it',
  'Zdrowie / Medyczna': 'uslugi',
  'Finanse / Księgowość': 'uslugi',
  'Transport / Logistyka': 'uslugi',
  Inne: 'inne',
};

function mapIndustry(raw) {
  return INDUSTRY_MAP[raw] || 'inne';
}

function buildAssessmentRow(state, scoringResult) {
  const overallPct = scoringResult.overall.percentage;
  const awareness = scoreAwareness(state.awarenessAnswers || {});
  const hasAwarenessAnswers = Object.keys(state.awarenessAnswers || {}).length > 0;

  const row = {
    id: state.assessmentId,
    questionnaire_version: QUESTIONNAIRE_VERSION,
    locale: 'pl',
    industry: mapIndustry(state.profile?.industry),
    company_size: state.profile?.size,
    started_at: state.startedAt,
    completed_at: state.completedAt || new Date().toISOString(),
    overall_score: overallPct,
    maturity_level: scoringResult.maturity.key,
    report_status: 'none',
    score_people: 0,
    score_data: 0,
    score_systems: 0,
    score_governance: 0,
    score_compliance: 0,
    awareness_score: hasAwarenessAnswers ? awareness.correct : null,
    awareness_answers: hasAwarenessAnswers ? state.awarenessAnswers : null,
    domain: state.profile?.companyDomain || null,
    dns_scan_opt_out: !!state.profile?.dnsScanOptOut,
    dns_scan: state.dnsScan?.ok ? state.dnsScan.data : null,
  };

  for (const [categoryId, column] of Object.entries(CATEGORY_TO_COLUMN)) {
    row[column] = scoringResult.categories[categoryId]?.percentage ?? 0;
  }

  return row;
}

function buildResponsesRows(state) {
  const questions = getQuestions();
  const rows = [];

  for (const q of questions) {
    const optionIndex = state.responses[q.id];
    if (optionIndex === undefined || optionIndex === null) continue;

    const option = q.options[optionIndex];
    if (!option) continue;

    rows.push({
      assessment_id: state.assessmentId,
      question_id: q.id,
      category_key: CATEGORY_TO_KEY[q.category] || 'people',
      option_id: `${q.id}_opt_${optionIndex}`,
      score: option.score,
      weight: q.weight,
      critical: q.critical,
    });
  }

  return rows;
}

// Retry z exponential backoff (3 próby, 500ms → 2s → 8s)
async function withRetry(fn, label, maxAttempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxAttempts) break;
      const delay = 500 * Math.pow(4, attempt - 1);
      console.warn(`[samoocena] ${label} attempt ${attempt}/${maxAttempts} failed, retry in ${delay}ms:`, err.message);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}

/**
 * Wysyła zakończoną samoocenę do Supabase (anon INSERT).
 * @param {object} state — pełny state z state.js (responses, profile, startedAt, completedAt, assessmentId)
 * @param {object} scoringResult — wynik scoreAssessment(state.responses)
 * @returns {Promise<{ ok: true, assessmentId: string } | { ok: false, error: string }>}
 */
export async function submitAssessment(state, scoringResult) {
  try {
    if (!state.assessmentId) {
      return { ok: false, error: 'brak assessmentId' };
    }

    const supabase = getSupabaseBrowser();
    const assessmentRow = buildAssessmentRow(state, scoringResult);
    const responsesRows = buildResponsesRows(state);

    if (responsesRows.length === 0) {
      return { ok: false, error: 'brak odpowiedzi do zapisania' };
    }

    await withRetry(async () => {
      const { error } = await supabase.from('assessments').insert(assessmentRow);
      if (error) throw new Error(`assessments insert: ${error.message}`);
    }, 'assessments');

    await withRetry(async () => {
      const { error } = await supabase.from('responses').insert(responsesRows);
      if (error) throw new Error(`responses insert: ${error.message}`);
    }, 'responses');

    return { ok: true, assessmentId: state.assessmentId };
  } catch (err) {
    console.error('[samoocena] submit failed:', err);
    return { ok: false, error: err.message || 'unknown' };
  }
}

/**
 * Zapisuje email + zgodę marketingową do istniejącego assessment row (UPDATE).
 * Wywoływane przy „Pobierz raport" — leadgen capture za PDF.
 * DEPRECATED: nowy flow używa sendReport (edge fn) który łączy save + email.
 * @param {string} assessmentId
 * @param {{ email: string, marketingConsent: boolean }} payload
 * @returns {Promise<{ ok: true } | { ok: false, error: string }>}
 */
export async function recordRaportRequest(assessmentId, { email, marketingConsent }) {
  try {
    if (!assessmentId) return { ok: false, error: 'brak assessmentId' };
    if (!email) return { ok: false, error: 'brak email' };

    const supabase = getSupabaseBrowser();
    await withRetry(async () => {
      const { error } = await supabase
        .from('assessments')
        .update({ email, marketing_consent: !!marketingConsent })
        .eq('id', assessmentId);
      if (error) throw new Error(`raport request update: ${error.message}`);
    }, 'raport-request');

    return { ok: true };
  } catch (err) {
    console.error('[samoocena] recordRaportRequest failed:', err);
    return { ok: false, error: err.message || 'unknown' };
  }
}

/**
 * Wywołuje edge function send-report — zapisuje payload, email, consent + wysyła email z linkiem.
 * @param {string} assessmentId
 * @param {{ email: string, marketingConsent: boolean, payload: object }} input
 * @returns {Promise<{ ok: true, reportUrl: string } | { ok: false, error: string }>}
 */
export async function sendReport(assessmentId, { email, marketingConsent, payload }) {
  try {
    if (!assessmentId) return { ok: false, error: 'brak assessmentId' };
    if (!email) return { ok: false, error: 'brak email' };
    if (!payload) return { ok: false, error: 'brak payload' };

    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.functions.invoke('send-report', {
      body: { assessmentId, email, marketingConsent, payload },
    });
    if (error) return { ok: false, error: error.message };
    return data || { ok: false, error: 'empty_response' };
  } catch (err) {
    console.error('[samoocena] sendReport failed:', err);
    return { ok: false, error: err.message || 'unknown' };
  }
}

/**
 * Wywołuje edge function create-checkout-session — zapisuje payload + email + consent,
 * tworzy Stripe Checkout Session i zwraca URL do redirect.
 * @param {string} assessmentId
 * @param {{ email: string, marketingConsent: boolean, payload: object }} input
 * @returns {Promise<{ ok: true, url: string } | { ok: false, error: string }>}
 */
export async function createCheckoutSession(assessmentId, { email, marketingConsent, payload }) {
  try {
    if (!assessmentId) return { ok: false, error: 'brak assessmentId' };
    if (!email) return { ok: false, error: 'brak email' };
    if (!payload) return { ok: false, error: 'brak payload' };

    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { assessmentId, email, marketingConsent, payload },
    });
    if (error) return { ok: false, error: error.message };
    return data || { ok: false, error: 'empty_response' };
  } catch (err) {
    console.error('[samoocena] createCheckoutSession failed:', err);
    return { ok: false, error: err.message || 'unknown' };
  }
}

/**
 * Wywołuje edge function verify-checkout-session — weryfikuje payment status w Stripe,
 * zwraca payload raportu jeśli paid.
 * @param {string} sessionId Stripe Checkout Session ID (cs_test_... or cs_live_...)
 * @returns {Promise<{ ok: true, paid: boolean, assessmentId?: string, payload?: object } | { ok: false, error: string }>}
 */
export async function verifyCheckoutSession(sessionId) {
  try {
    if (!sessionId) return { ok: false, error: 'brak sessionId' };

    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.functions.invoke('verify-checkout-session', {
      body: { sessionId },
    });
    if (error) return { ok: false, error: error.message };
    return data || { ok: false, error: 'empty_response' };
  } catch (err) {
    console.error('[samoocena] verifyCheckoutSession failed:', err);
    return { ok: false, error: err.message || 'unknown' };
  }
}

/**
 * Pobiera snapshot raportu z DB po assessmentId (używane przez stronę raportu z linka w emailu).
 * Dostęp anonimowy (polityka assessments_anon_select_by_id + UUID v4 entropy).
 * @param {string} assessmentId
 * @returns {Promise<{ ok: true, payload: object } | { ok: false, error: string }>}
 */
export async function fetchReportPayload(assessmentId) {
  try {
    if (!assessmentId) return { ok: false, error: 'brak assessmentId' };
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase
      .from('assessments')
      .select('report_payload')
      .eq('id', assessmentId)
      .single();
    if (error) return { ok: false, error: error.message };
    if (!data?.report_payload) return { ok: false, error: 'report_not_found' };
    return { ok: true, payload: data.report_payload };
  } catch (err) {
    console.error('[samoocena] fetchReportPayload failed:', err);
    return { ok: false, error: err.message || 'unknown' };
  }
}

/**
 * Pobiera benchmark snapshot z RPC. Zwraca obiekt zgodny z tym co renderuje mocked MOCKED_BENCHMARK
 * w results-management.js (żeby można było swap z minimalną zmianą).
 * @param {string} rawIndustry — oryginalny label z profilingu (8 opcji)
 * @param {string} companySize — '1-10' | '11-50' | '51-250'
 * @returns {Promise<{ scope, sampleSize, cohortLabel, A, B, C, D, E } | null>}
 */
export async function fetchBenchmark(rawIndustry, companySize) {
  try {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.rpc('get_benchmark_snapshot', {
      p_industry: mapIndustry(rawIndustry),
      p_company_size: companySize,
    });
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return null;

    const row = data[0];
    return {
      scope: row.scope,
      sampleSize: row.sample_size,
      cohortLabel: cohortLabelFor(row.scope, rawIndustry, companySize),
      A: Number(row.avg_people),
      B: Number(row.avg_data),
      C: Number(row.avg_systems),
      D: Number(row.avg_governance),
      E: Number(row.avg_compliance),
    };
  } catch (err) {
    console.warn('[samoocena] benchmark fetch failed:', err.message);
    return null;
  }
}

function cohortLabelFor(scope, rawIndustry, companySize) {
  const sizeLabel = {
    '1-10': '1–10 pracowników',
    '11-50': '11–50 pracowników',
    '51-250': '51–250 pracowników',
  }[companySize] || companySize;

  if (scope === 'industry_size') return `${rawIndustry}, ${sizeLabel}`;
  if (scope === 'size_only') return `MŚP ${sizeLabel}`;
  return 'Wszystkie MŚP';
}

/**
 * Wywołuje edge function scan-domain. Frontend timeout 10s.
 * Backend timeout 8s — frontend daje 2s buffer na cold start.
 * @param {string} domain — already normalized (lowercase, no protocol)
 * @returns {Promise<{ ok: true, scanned_at: string, data: object } | { ok: false, error: string }>}
 */
export async function scanDomain(domain) {
  try {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.functions.invoke('scan-domain', {
      body: { domain },
    });
    if (error) {
      console.warn('[samoocena] scanDomain edge fn error:', error.message);
      return { ok: false, error: error.message };
    }
    return data;
  } catch (err) {
    console.warn('[samoocena] scanDomain failed:', err.message);
    return { ok: false, error: err.message || 'unknown' };
  }
}
