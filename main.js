import './style.css'
import { VERSION } from './src/version.js'

// Inject version into nav
document.addEventListener('DOMContentLoaded', () => {
  const versionEl = document.getElementById('app-version');
  if (versionEl) versionEl.textContent = `v${VERSION}`;
});

// --- Automatyzacje Modal Data ---

const automatyzacjeData = {
  1: {
    title: "n8n",
    desc: "Open-source platforma automatyzacji workflow. Pełna kontrola nad danymi — hosting on-premise lub w chmurze. Idealne dla firm wymagających zgodności z RODO. Łączy ponad 400 aplikacji: CRM, email, fakturowanie, social media. Budujemy przepływy, które eliminują godziny ręcznej pracy tygodniowo.",
    modules: ["Automatyzacja lead nurturing", "Synchronizacja CRM ↔ fakturowanie", "Powiadomienia i alerty biznesowe", "Raporty automatyczne"]
  },
  2: {
    title: "Make",
    desc: "No-code platforma automatyzacji procesów. Intuicyjny interfejs drag-and-drop, setki gotowych integracji, szybkie wdrożenie bez programowania. Sprawdzone rozwiązanie dla MŚP — od prostych automatyzacji emailowych po złożone przepływy danych między systemami. Szkolimy i wdrażamy.",
    modules: ["Automatyzacja obsługi klienta", "Integracja e-commerce", "Marketing automation", "Przepływy dokumentów"]
  },
  3: {
    title: "Dedykowane Rozwiązania",
    desc: "Automatyzacje szyte na miarę Twojego biznesu. Łączymy systemy, budujemy niestandardowe przepływy danych, eliminujemy powtarzalną pracę. Od audytu procesów po wdrożenie i wsparcie. Wykorzystujemy AI do inteligentnej automatyzacji — nie tylko przenoszenia danych, ale ich analizy i podejmowania decyzji.",
    modules: ["Audyt procesów biznesowych", "Projektowanie workflow", "Wdrożenie i testy", "Szkolenie zespołu + wsparcie"]
  }
};

function openModal(id) {
  const modal = document.getElementById('auto-modal');
  const body = document.getElementById('modal-body');
  const data = automatyzacjeData[id];

  if (!modal || !body || !data) return;

  body.innerHTML = `
    <div class="grid-fluid" style="gap: 4rem;">
       <div style="grid-column: span 7; background: transparent;">
          <div class="text-xs" style="color: var(--brand-primary); margin-bottom: 2rem;">AUTOMATYZACJA_${id.toString().padStart(2, '0')}</div>
          <h3 style="font-size: 3.5rem; line-height: 1; margin-bottom: 2rem; color: #FFF; text-transform: uppercase;">${data.title}</h3>
          <p style="color: #999; font-size: 1.25rem; line-height: 1.6;">${data.desc}</p>
       </div>
       <div style="grid-column: span 5; border-left: 1px solid #333; padding-left: 3rem; display: flex; flex-direction: column; justify-content: center; background: transparent;">
          <div class="text-xs" style="color: #666; margin-bottom: 2rem;">ZASTOSOWANIA</div>
          <div style="display: grid; gap: 1.5rem;">
             ${data.modules.map(m => `
               <div style="display: flex; align-items: center; gap: 1rem; color: #FFF; font-size: 1.1rem;">
                  <span style="color: #444;">></span> ${m}
               </div>
             `).join('')}
          </div>
       </div>
    </div>
  `;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('auto-modal');
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
  const autoItem = e.target.closest('[data-auto]');
  if (autoItem) {
    openModal(Number(autoItem.dataset.auto));
    return;
  }

  const closeBtn = e.target.closest('#modal-close');
  if (closeBtn) {
    closeModal();
    return;
  }

  const backdrop = e.target.closest('#auto-modal');
  if (backdrop && e.target === backdrop) {
    closeModal();
    return;
  }

  const navItem = e.target.closest('[data-slider]');
  if (navItem) {
    goToSlide(navItem.dataset.slider, Number(navItem.dataset.slide));
    return;
  }
});

// --- Context Nav Visibility (IntersectionObserver) ---

const observerOptions = {
  root: null,
  threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const sectionId = entry.target.id;
    let navId = '';
    if (sectionId === 'section-szkolenia') navId = 'nav-szkolenia';

    const nav = document.getElementById(navId);
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

document.querySelectorAll('#section-szkolenia')
  .forEach(s => observer.observe(s));
