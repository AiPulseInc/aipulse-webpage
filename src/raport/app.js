import './styles.css';
import { initGA } from '../ga.js';
import { renderRaportB } from './template.js';
import { EXAMPLE_DATA } from './example.js';
import { getSupabaseBrowser } from '../lib/supabase-browser.js';
import { verifyCheckoutSession } from '../samoocena/api.js';

initGA();

const ROOT = document.getElementById('raport-main');
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SESSION_ID_REGEX = /^cs_(test|live)_[a-zA-Z0-9]+$/;

async function fetchFromDB(id) {
  try {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase
      .from('assessments')
      .select('report_payload')
      .eq('id', id)
      .single();
    if (error || !data?.report_payload) {
      console.warn('[raport] DB fetch failed:', error?.message);
      return null;
    }
    return { ...data.report_payload, assessmentId: id };
  } catch (err) {
    console.error('[raport] DB fetch error:', err);
    return null;
  }
}

function readLocalStorage() {
  try {
    const raw = localStorage.getItem('raportData');
    if (!raw) return null;
    const data = JSON.parse(raw);
    localStorage.removeItem('raportData');
    return data;
  } catch {
    return null;
  }
}

async function getData() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('example')) {
    return EXAMPLE_DATA;
  }

  // Post-payment flow: ?session_id=cs_xxx → weryfikujemy w Stripe, dostajemy payload z DB
  const sessionId = params.get('session_id');
  if (sessionId && SESSION_ID_REGEX.test(sessionId)) {
    renderVerifying();
    const res = await verifyCheckoutSession(sessionId);
    if (res.ok && res.paid && res.payload) {
      return { ...res.payload, assessmentId: res.assessmentId };
    }
    if (res.ok && !res.paid) {
      // Webhook może być jeszcze w drodze — poll 3x co 2s zanim damy fail
      for (let i = 0; i < 3; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        const retry = await verifyCheckoutSession(sessionId);
        if (retry.ok && retry.paid && retry.payload) {
          return { ...retry.payload, assessmentId: retry.assessmentId };
        }
      }
      console.warn('[raport] payment not confirmed after retries:', res);
      return { __paymentPending: true };
    }
    console.error('[raport] verify session error:', res);
    return { __paymentError: res.error || 'unknown' };
  }

  // Direct link from email: ?id=<uuid> — fetch from DB
  const id = params.get('id');
  if (id && UUID_REGEX.test(id)) {
    const dbData = await fetchFromDB(id);
    if (dbData) return dbData;
    // Fallback do localStorage jeśli DB fetch fail (np. pierwsze otwarcie, rekord jeszcze nie widoczny)
  }
  return readLocalStorage();
}

function renderVerifying() {
  ROOT.innerHTML = `
    <div class="page" style="padding: 40mm 20mm; text-align: center;">
      <h2 style="color:#A855F7;">Weryfikujemy płatność…</h2>
      <p style="font-size:11pt; margin: 6mm 0;">Łączymy się ze Stripe, by potwierdzić sukces transakcji.</p>
      <p style="font-size:10pt; color:#666;">To trwa zwykle 2–5 sekund.</p>
    </div>
  `;
}

function renderPaymentPending() {
  ROOT.innerHTML = `
    <div class="page" style="padding: 40mm 20mm; text-align: center;">
      <h2 style="color:#F5A623;">Płatność w trakcie przetwarzania</h2>
      <p style="font-size:11pt; margin: 6mm 0;">Stripe potwierdził Twoją transakcję, ale nasz system jeszcze nie zarejestrował zmiany.</p>
      <p style="font-size:10pt; margin: 4mm 0;">Spróbuj odświeżyć tę stronę za 30 sekund. Jeśli problem nie zniknie, mailem otrzymasz raport zaraz po finalizacji — sprawdź skrzynkę.</p>
      <p style="margin-top: 8mm;">
        <button onclick="window.location.reload()" style="padding: 10px 20px; background:#7E22CE; color:#fff; border:0; font-weight:700; cursor:pointer;">Odśwież teraz</button>
      </p>
    </div>
  `;
}

function renderPaymentError(message) {
  ROOT.innerHTML = `
    <div class="page" style="padding: 40mm 20mm; text-align: center;">
      <h2 style="color:#D32F2F;">Problem z weryfikacją płatności</h2>
      <p style="font-size:11pt; margin: 6mm 0;">${message}</p>
      <p style="font-size:10pt; margin: 4mm 0;">Jeśli karta została obciążona, raport otrzymasz mailem po naszej weryfikacji manualnej. Skontaktuj się: <a href="mailto:maciek@aipulse.pl" style="color:#7E22CE;">maciek@aipulse.pl</a></p>
    </div>
  `;
}

function todayFormatted() {
  return new Date().toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function makeRefNumber(seed) {
  const pad = (n) => String(n).padStart(2, '0');
  const d = new Date();
  const numeric = String(seed ?? Date.now()).replace(/\D/g, '');
  const tail = numeric.slice(-5).padStart(5, '0');
  return `AP-SA-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${tail}`;
}

function renderError(msg) {
  ROOT.innerHTML = `
    <div class="page" style="padding: 40mm 20mm; text-align: center;">
      <h2 style="color:#D32F2F;">Brak danych raportu</h2>
      <p style="font-size:11pt; margin: 6mm 0;">${msg}</p>
      <p>
        <a href="/bezpieczenstwo-samoocena/" style="color:#7E22CE; font-weight:700; text-decoration:underline;">
          Wróć do samooceny →
        </a>
        &nbsp;&nbsp;
        <a href="/raport-audit/?example=1" style="color:#7E22CE; font-weight:700; text-decoration:underline;">
          Zobacz przykładowy raport →
        </a>
      </p>
    </div>
  `;
}

function renderControls(isExample) {
  const wrap = document.createElement('div');
  wrap.className = 'raport-controls print-hide';
  wrap.innerHTML = `
    <button type="button" data-action="print">Zapisz jako PDF</button>
    <a href="/bezpieczenstwo-samoocena/" style="text-decoration:none;">
      <button type="button" class="secondary">${isExample ? 'Zrób swój audyt' : 'Wróć do samooceny'}</button>
    </a>
  `;
  document.body.appendChild(wrap);
  wrap.querySelector('[data-action="print"]').addEventListener('click', () => {
    window.print();
  });
}

function renderLoading() {
  ROOT.innerHTML = `
    <div class="page" style="padding: 40mm 20mm; text-align: center;">
      <p style="font-size:11pt; color:#666;">Ładuję raport…</p>
    </div>
  `;
}

async function main() {
  if (!ROOT) return;

  const params = new URLSearchParams(window.location.search);
  const isExample = params.has('example');
  const hasId = params.has('id');
  const hasSessionId = params.has('session_id');

  // Loading state dla DB fetch (non-example, non-stripe — verify ma swój renderVerifying)
  if (hasId && !isExample && !hasSessionId) renderLoading();

  const data = await getData();

  if (data && data.__paymentPending) {
    renderPaymentPending();
    return;
  }

  if (data && data.__paymentError) {
    renderPaymentError(data.__paymentError);
    return;
  }

  if (!data) {
    renderError('Otwórz raport z poziomu samooceny (po ukończeniu testu kliknij "Zamów raport"), albo obejrzyj przykładowy raport.');
    renderControls(true);
    return;
  }

  const payload = {
    ...data,
    date: data.date || todayFormatted(),
    refNumber: data.refNumber || makeRefNumber(data.assessmentId),
  };

  ROOT.innerHTML = renderRaportB(payload);
  renderControls(isExample);
  // Brak auto-print — user sam decyduje kiedy drukować (przycisk w kontrolkach).
}

main();
