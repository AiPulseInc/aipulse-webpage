import './styles.css';
import { renderRaportB } from './template.js';
import { EXAMPLE_DATA } from './example.js';

const ROOT = document.getElementById('raport-main');

function getData() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('example')) {
    return EXAMPLE_DATA;
  }
  try {
    // localStorage — sessionStorage nie jest dzielony między nowymi tabami
    // (target=_blank w samoocena/app.js otwiera w izolowanym session context)
    const raw = localStorage.getItem('raportData');
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Cleanup po odczycie — nie zostawiamy danych na długo w localStorage
    localStorage.removeItem('raportData');
    return data;
  } catch {
    return null;
  }
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

function main() {
  if (!ROOT) return;
  const data = getData();
  const isExample = new URLSearchParams(window.location.search).has('example');

  if (!data) {
    renderError('Otwórz raport z poziomu samooceny (po ukończeniu testu kliknij "Pobierz swój raport"), albo obejrzyj przykładowy raport.');
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

  // Auto-trigger print dialog po chwili (pozwoli na render fontów)
  setTimeout(() => {
    try {
      window.print();
    } catch (err) {
      console.warn('[raport] auto-print failed:', err);
    }
  }, 800);
}

main();
