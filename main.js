import './style.css'
import { VERSION } from './src/version.js'
import { szkoleniaData } from './src/training-data.js'

// Inject version into nav
document.addEventListener('DOMContentLoaded', () => {
  const versionEl = document.getElementById('app-version');
  if (versionEl) versionEl.textContent = `v${VERSION}`;
});

// --- Automatyzacje Modal Data ---

const automatyzacjeData = {
  1: {
    title: 'n8n',
    category: 'AUTOMATYZACJA_01',
    description:
      'Open-source platforma automatyzacji workflow. Pełna kontrola nad danymi — hosting on-premise lub w chmurze. Idealne dla firm wymagających zgodności z RODO. Łączy ponad 400 aplikacji: CRM, email, fakturowanie, social media. Budujemy przepływy, które eliminują godziny ręcznej pracy tygodniowo.',
    modules: [
      'Automatyzacja lead nurturing',
      'Synchronizacja CRM ↔ fakturowanie',
      'Powiadomienia i alerty biznesowe',
      'Raporty automatyczne',
    ],
  },
  2: {
    title: 'Make',
    category: 'AUTOMATYZACJA_02',
    description:
      'No-code platforma automatyzacji procesów. Intuicyjny interfejs drag-and-drop, setki gotowych integracji, szybkie wdrożenie bez programowania. Sprawdzone rozwiązanie dla MŚP — od prostych automatyzacji emailowych po złożone przepływy danych między systemami. Szkolimy i wdrażamy.',
    modules: [
      'Automatyzacja obsługi klienta',
      'Integracja e-commerce',
      'Marketing automation',
      'Przepływy dokumentów',
    ],
  },
  3: {
    title: 'Dedykowane Rozwiązania',
    category: 'AUTOMATYZACJA_03',
    description:
      'Automatyzacje szyte na miarę Twojego biznesu. Łączymy systemy, budujemy niestandardowe przepływy danych, eliminujemy powtarzalną pracę. Od audytu procesów po wdrożenie i wsparcie. Wykorzystujemy AI do inteligentnej automatyzacji — nie tylko przenoszenia danych, ale ich analizy i podejmowania decyzji.',
    modules: [
      'Audyt procesów biznesowych',
      'Projektowanie workflow',
      'Wdrożenie i testy',
      'Szkolenie zespołu + wsparcie',
    ],
  },
};

// --- Generalized Modal System ---

function renderAutoModal(data) {
  return `
    <div class="grid-fluid" style="gap: 4rem;">
      <div style="grid-column: span 7; background: transparent;">
        <div class="text-xs" style="color: var(--brand-accent); margin-bottom: 2rem;">${data.category}</div>
        <h3 style="font-size: 3.5rem; line-height: 1; margin-bottom: 2rem; color: #FFF; text-transform: uppercase;">${data.title}</h3>
        <p style="color: #999; font-size: 1.25rem; line-height: 1.6;">${data.description}</p>
      </div>
      <div style="grid-column: span 5; border-left: 1px solid #333; padding-left: 3rem; display: flex; flex-direction: column; justify-content: center; background: transparent;">
        <div class="text-xs" style="color: #666; margin-bottom: 2rem;">ZASTOSOWANIA</div>
        <div style="display: grid; gap: 1.5rem;">
          ${data.modules.map(m => `
            <div style="display: flex; align-items: center; gap: 1rem; color: #FFF; font-size: 1.1rem;">
              <span style="color: var(--brand-accent);">&gt;</span> ${m}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderSzkoleniaModal(data) {
  return `
    <div class="modal-training">
      <div class="text-xs" style="color: var(--brand-accent); margin-bottom: 1.5rem;">${data.category}</div>
      <h3 style="font-size: 3rem; line-height: 1; margin-bottom: 2rem; color: #FFF; text-transform: uppercase;">${data.title}</h3>

      <div class="modal-training-grid">
        <div>
          <div class="modal-section-label">DLA KOGO</div>
          <p class="modal-section-body">${data.audience}</p>

          <div class="modal-section-label" style="margin-top: 2rem;">CZEGO SIĘ NAUCZYSZ</div>
          <ul class="modal-benefits">
            ${data.benefits.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>

        <div>
          <div class="modal-section-label">FORMAT</div>
          <p class="modal-section-body">${data.format}</p>

          <div class="modal-section-label" style="margin-top: 2rem;">WYNIK</div>
          <p class="modal-section-body modal-outcome">${data.outcome}</p>

          <a href="#contact" class="btn btn-accent modal-cta" data-close-modal="true">Zapytaj o szkolenie</a>
        </div>
      </div>
    </div>
  `;
}

const MODAL_RENDERERS = {
  auto: renderAutoModal,
  szkolenia: renderSzkoleniaModal,
};

const MODAL_DATA = {
  auto: automatyzacjeData,
  szkolenia: szkoleniaData,
};

function openModal(type, id) {
  const data = MODAL_DATA[type]?.[id];
  const renderer = MODAL_RENDERERS[type];
  if (!data || !renderer) return;

  const modal = document.getElementById('app-modal');
  const body = document.getElementById('modal-body');
  if (!modal || !body) return;

  body.innerHTML = renderer(data);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('app-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// --- Slider Navigation ---

function goToSlide(section, index) {
  const track = document.getElementById(`track-${section}`);
  if (!track) return;

  track.style.transform = `translateX(-${index * 100}%)`;

  const nav = document.getElementById(`nav-${section}`);
  if (nav) {
    nav.querySelectorAll('.nav-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }
}

// --- Event Delegation ---

document.addEventListener('click', (e) => {
  // Modal triggers via data-modal-type + data-modal
  const modalTrigger = e.target.closest('[data-modal-type]');
  if (modalTrigger) {
    e.preventDefault();
    openModal(modalTrigger.dataset.modalType, Number(modalTrigger.dataset.modal));
    return;
  }

  // Close button
  const closeBtn = e.target.closest('#modal-close');
  if (closeBtn) {
    closeModal();
    return;
  }

  // Close on backdrop click
  const backdrop = e.target.closest('#app-modal');
  if (backdrop && e.target === backdrop) {
    closeModal();
    return;
  }

  // CTA inside modal that should close it first
  const closeAndNav = e.target.closest('[data-close-modal]');
  if (closeAndNav) {
    closeModal();
    // Let the link navigate normally
    return;
  }

  // Slider nav items
  const navItem = e.target.closest('[data-slider]');
  if (navItem) {
    goToSlide(navItem.dataset.slider, Number(navItem.dataset.slide));
    return;
  }
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// --- Context Nav Visibility (IntersectionObserver) ---

const SECTION_TO_NAV = {
  'section-szkolenia-zespoly': 'nav-szkolenia-zespoly',
  'section-szkolenia-dev': 'nav-szkolenia-dev',
};

const observerOptions = {
  root: null,
  threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const navId = SECTION_TO_NAV[entry.target.id];
    const nav = navId && document.getElementById(navId);
    if (!nav) return;

    const rect = entry.boundingClientRect;
    const percentScrolledPastTop = (rect.top * -1) / rect.height;

    if (entry.intersectionRatio > 0.5 && percentScrolledPastTop < 0.20) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }
  });
}, observerOptions);

Object.keys(SECTION_TO_NAV).forEach(id => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});
