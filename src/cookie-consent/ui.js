import { getConsent, setConsent } from './consent.js';

const IDS = {
  modalTitle: 'cookie-consent-modal-title',
  analytics: 'cookie-consent-analytics',
  marketing: 'cookie-consent-marketing',
};

let bannerElement = null;
let backdropElement = null;
let modalElement = null;
let modalFormElement = null;
let restoreFocusElement = null;
let releaseFocusTrap = null;
let listenersBound = false;

function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);

  if (options.className) element.className = options.className;
  if (options.id) element.id = options.id;
  if (options.text) element.textContent = options.text;

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([name, value]) => {
      if (value !== undefined && value !== null) {
        element.setAttribute(name, value);
      }
    });
  }

  return element;
}

function getFocusableElements(container) {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  return Array.from(container.querySelectorAll(selector)).filter((element) => {
    if (!(element instanceof HTMLElement)) return false;
    if (element.hidden) return false;
    if (element.getAttribute('aria-hidden') === 'true') return false;

    const styles = window.getComputedStyle(element);
    return styles.display !== 'none' && styles.visibility !== 'hidden';
  });
}

function trapFocus(container) {
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements(container);
    if (!focusableElements.length) {
      event.preventDefault();
      if (container instanceof HTMLElement) container.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;
    const focusIsInside = activeElement instanceof Node && container.contains(activeElement);

    if (event.shiftKey) {
      if (!focusIsInside || activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      return;
    }

    if (!focusIsInside || activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  container.addEventListener('keydown', handleKeydown);

  return () => {
    container.removeEventListener('keydown', handleKeydown);
  };
}

function createCategoryRow({ id, title, description, checked, disabled }) {
  const row = createElement('div', { className: 'cookie-category' });
  const copy = createElement('div', { className: 'cookie-category-copy' });
  const label = createElement('label', {
    className: 'cookie-category-title',
    attributes: { for: id },
    text: title,
  });
  const descriptionElement = createElement('p', {
    className: 'cookie-category-description',
    text: description,
  });
  const toggleLabel = createElement('label', {
    className: 'cookie-toggle',
    attributes: { for: id },
  });
  const input = createElement('input', {
    attributes: {
      id,
      type: 'checkbox',
      role: 'switch',
      ...(checked ? { checked: '' } : {}),
      ...(disabled ? { disabled: '' } : {}),
    },
  });
  const control = createElement('span', {
    className: 'cookie-toggle-control',
    attributes: { 'aria-hidden': 'true' },
  });
  const state = createElement('span', {
    className: 'cookie-toggle-state',
    text: disabled ? 'Zawsze aktywne' : 'Włącz / wyłącz',
  });

  copy.append(label, descriptionElement);
  toggleLabel.append(input, control, state);
  row.append(copy, toggleLabel);

  return row;
}

function renderBanner() {
  const banner = createElement('section', {
    className: 'cookie-banner',
    attributes: {
      role: 'region',
      'aria-label': 'Baner zgody na pliki cookies',
    },
  });
  const content = createElement('div', { className: 'cookie-banner-content' });
  const copy = createElement('div', { className: 'cookie-banner-copy' });
  const message = createElement('p', {
    className: 'cookie-banner-text',
    text: 'Używamy niezbędnych plików cookies i localStorage do działania strony. Analitykę oraz marketing uruchamiamy dopiero po Twojej zgodzie.',
  });
  const policyLink = createElement('a', {
    className: 'cookie-banner-link',
    text: 'Polityka cookies',
    attributes: { href: '/polityka-cookies/' },
  });
  const actions = createElement('div', { className: 'cookie-banner-actions' });
  const acceptButton = createElement('button', {
    className: 'cookie-btn cookie-btn-accent',
    text: 'Akceptuj wszystkie',
    attributes: { type: 'button', 'data-cookie-action': 'accept-all' },
  });
  const rejectButton = createElement('button', {
    className: 'cookie-btn cookie-btn-secondary',
    text: 'Odrzuć wszystkie',
    attributes: { type: 'button', 'data-cookie-action': 'reject-all' },
  });
  const customizeButton = createElement('button', {
    className: 'cookie-btn cookie-btn-secondary',
    text: 'Dostosuj',
    attributes: { type: 'button', 'data-cookie-action': 'customize' },
  });

  copy.append(message, policyLink);
  actions.append(acceptButton, rejectButton, customizeButton);
  content.append(copy, actions);
  banner.append(content);

  banner.addEventListener('click', handleBannerClick);

  return banner;
}

function renderModalBackdrop() {
  const backdrop = createElement('div', {
    className: 'cookie-modal-backdrop',
    attributes: { 'aria-hidden': 'true' },
  });
  const modal = createElement('div', {
    className: 'cookie-modal',
    attributes: {
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': IDS.modalTitle,
      tabindex: '-1',
    },
  });
  const header = createElement('div', { className: 'cookie-modal-header' });
  const title = createElement('h2', {
    className: 'cookie-modal-title',
    id: IDS.modalTitle,
    text: 'Ustawienia cookies',
  });
  const closeButton = createElement('button', {
    className: 'cookie-modal-close',
    text: 'Zamknij',
    attributes: { type: 'button', 'data-cookie-action': 'close-modal', 'aria-label': 'Zamknij ustawienia cookies' },
  });
  const intro = createElement('p', {
    className: 'cookie-modal-intro',
    text: 'Niezbędne pliki są zawsze aktywne. Analitykę i marketing możesz włączyć lub pozostawić wyłączone.',
  });
  const form = createElement('form', { className: 'cookie-modal-form' });
  const categories = createElement('div', { className: 'cookie-modal-categories' });
  const necessaryRow = createCategoryRow({
    id: 'cookie-consent-necessary',
    title: 'Niezbędne',
    description: 'Zapamiętanie wyboru, bezpieczeństwo i podstawowe działanie strony.',
    checked: true,
    disabled: true,
  });
  const analyticsRow = createCategoryRow({
    id: IDS.analytics,
    title: 'Analityczne',
    description: 'Google Analytics 4 i podobne narzędzia mierzące ruch oraz użycie strony.',
    checked: false,
    disabled: false,
  });
  const marketingRow = createCategoryRow({
    id: IDS.marketing,
    title: 'Marketingowe',
    description: 'Meta Pixel, Google Ads i podobne narzędzia reklamowe.',
    checked: false,
    disabled: false,
  });
  const actions = createElement('div', { className: 'cookie-modal-actions' });
  const cancelButton = createElement('button', {
    className: 'cookie-btn cookie-btn-secondary',
    text: 'Zamknij',
    attributes: { type: 'button', 'data-cookie-action': 'close-modal' },
  });
  const saveButton = createElement('button', {
    className: 'cookie-btn cookie-btn-accent',
    text: 'Zapisz preferencje',
    attributes: { type: 'submit' },
  });

  categories.append(necessaryRow, analyticsRow, marketingRow);
  actions.append(cancelButton, saveButton);
  form.append(categories, actions);
  header.append(title, closeButton);
  modal.append(header, intro, form);
  backdrop.append(modal);

  backdrop.addEventListener('click', handleBackdropClick);
  form.addEventListener('submit', handleModalSubmit);
  modal.addEventListener('click', handleModalClick);

  modalElement = modal;
  modalFormElement = form;

  return backdrop;
}

function ensureModal() {
  if (backdropElement || !document.body) return;

  backdropElement = renderModalBackdrop();
  document.body.append(backdropElement);
}

function syncModalState() {
  if (!modalFormElement) return;

  const consent = getConsent();
  const analyticsInput = modalFormElement.querySelector(`#${IDS.analytics}`);
  const marketingInput = modalFormElement.querySelector(`#${IDS.marketing}`);

  if (analyticsInput instanceof HTMLInputElement) {
    analyticsInput.checked = Boolean(consent?.analytics);
  }

  if (marketingInput instanceof HTMLInputElement) {
    marketingInput.checked = Boolean(consent?.marketing);
  }
}

function removeBanner() {
  if (!bannerElement) return;

  bannerElement.removeEventListener('click', handleBannerClick);
  bannerElement.remove();
  bannerElement = null;
}

function applyConsent(consentOptions) {
  setConsent(consentOptions);
  removeBanner();
  closeModal();
}

function handleBannerClick(event) {
  if (!(event.target instanceof Element)) return;

  const target = event.target.closest('[data-cookie-action]');
  if (!target) return;

  const action = target.getAttribute('data-cookie-action');
  if (action === 'accept-all') applyConsent({ analytics: true, marketing: true });
  if (action === 'reject-all') applyConsent({ analytics: false, marketing: false });
  if (action === 'customize') openModal();
}

function handleBackdropClick(event) {
  if (event.target === backdropElement) {
    closeModal();
  }
}

function handleModalClick(event) {
  if (!(event.target instanceof Element)) return;

  const target = event.target.closest('[data-cookie-action]');
  if (!target) return;

  const action = target.getAttribute('data-cookie-action');
  if (action === 'close-modal') {
    event.preventDefault();
    closeModal();
  }
}

function handleModalSubmit(event) {
  event.preventDefault();

  if (!modalFormElement) return;

  const analyticsInput = modalFormElement.querySelector(`#${IDS.analytics}`);
  const marketingInput = modalFormElement.querySelector(`#${IDS.marketing}`);

  applyConsent({
    analytics: analyticsInput instanceof HTMLInputElement ? analyticsInput.checked : false,
    marketing: marketingInput instanceof HTMLInputElement ? marketingInput.checked : false,
  });
}

function bindDocumentListeners() {
  if (listenersBound) return;

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest('.footer-cookie-link');
    if (!link) return;

    event.preventDefault();
    openModal();
  });

  listenersBound = true;
}

export function openModal() {
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', openModal, { once: true });
    return;
  }

  ensureModal();
  bindDocumentListeners();
  syncModalState();

  if (!backdropElement || !modalElement) return;

  if (!backdropElement.classList.contains('open')) {
    restoreFocusElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }

  backdropElement.classList.add('open');
  backdropElement.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cookie-modal-open');

  if (releaseFocusTrap) releaseFocusTrap();
  releaseFocusTrap = trapFocus(modalElement);

  const initialFocusTarget = modalElement.querySelector('[data-cookie-action="close-modal"]');
  if (initialFocusTarget instanceof HTMLElement) {
    initialFocusTarget.focus();
  } else {
    modalElement.focus();
  }
}

export function closeModal() {
  if (!backdropElement) return;

  backdropElement.classList.remove('open');
  backdropElement.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cookie-modal-open');

  if (releaseFocusTrap) {
    releaseFocusTrap();
    releaseFocusTrap = null;
  }

  if (restoreFocusElement && document.contains(restoreFocusElement)) {
    restoreFocusElement.focus();
  }

  restoreFocusElement = null;
}

export function init() {
  if (!document.body) return;

  ensureModal();
  bindDocumentListeners();

  if (getConsent() || bannerElement) return;

  bannerElement = renderBanner();
  document.body.append(bannerElement);
}
