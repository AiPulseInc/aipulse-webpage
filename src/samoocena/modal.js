// Lightweight modal confirm w stylu Ai Pulse — violet accent, brutalist, square.
// Global single instance, lazy DOM creation, keyboard + click-overlay = cancel.

let activeModal = null;

export function showConfirmModal({
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Anuluj',
  onConfirm,
  onCancel,
}) {
  // Tylko jeden modal na raz
  if (activeModal) activeModal.close();

  const overlay = document.createElement('div');
  overlay.className = 'samoocena-modal-overlay';
  overlay.innerHTML = `
    <div class="samoocena-modal" role="dialog" aria-modal="true" aria-labelledby="samoocena-modal-title">
      <div class="samoocena-modal-body">
        <h2 id="samoocena-modal-title" class="samoocena-modal-title">${escape(title)}</h2>
        <p class="samoocena-modal-message">${escape(message)}</p>
      </div>
      <footer class="samoocena-modal-footer">
        <button type="button" class="samoocena-modal-btn samoocena-modal-btn-ghost" data-modal-action="confirm">
          ${escape(confirmLabel)}
        </button>
        <button type="button" class="samoocena-modal-btn samoocena-modal-btn-primary" data-modal-action="cancel">
          ${escape(cancelLabel)}
        </button>
      </footer>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add('samoocena-modal-open');

  const confirmBtn = overlay.querySelector('[data-modal-action="confirm"]');
  const cancelBtn = overlay.querySelector('[data-modal-action="cancel"]');

  // Focus cancel (primary, non-destructive) po animacji —
  // żeby Enter = „kontynuuj", nie = „wyjdź i zresetuj"
  setTimeout(() => cancelBtn.focus(), 50);

  const close = () => {
    document.removeEventListener('keydown', onKey);
    overlay.classList.add('samoocena-modal-overlay-out');
    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('samoocena-modal-open');
    }, 180);
    activeModal = null;
  };

  const handleConfirm = () => {
    close();
    onConfirm?.();
  };
  const handleCancel = () => {
    close();
    onCancel?.();
  };

  confirmBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', handleCancel);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) handleCancel();
  });

  const onKey = (e) => {
    if (e.key === 'Escape') handleCancel();
    if (e.key === 'Enter' && document.activeElement === cancelBtn) handleCancel();
    if (e.key === 'Enter' && document.activeElement === confirmBtn) handleConfirm();
  };
  document.addEventListener('keydown', onKey);

  activeModal = { close };
  return activeModal;
}

/**
 * Input prompt modal — generic single-field text input.
 * @param {{ title, message?, placeholder?, defaultValue?, required?, confirmLabel?, cancelLabel?, onConfirm: (value: string) => void, onCancel? }} opts
 */
export function showInputModal({
  title,
  message,
  placeholder = '',
  defaultValue = '',
  required = false,
  confirmLabel = 'OK',
  cancelLabel = 'Anuluj',
  onConfirm,
  onCancel,
}) {
  if (activeModal) activeModal.close();

  const overlay = document.createElement('div');
  overlay.className = 'samoocena-modal-overlay';
  overlay.innerHTML = `
    <div class="samoocena-modal" role="dialog" aria-modal="true" aria-labelledby="samoocena-modal-title">
      <div class="samoocena-modal-body">
        <h2 id="samoocena-modal-title" class="samoocena-modal-title">${escape(title)}</h2>
        ${message ? `<p class="samoocena-modal-message">${escape(message)}</p>` : ''}
        <input
          type="text"
          class="samoocena-modal-input"
          data-modal-input
          placeholder="${escape(placeholder)}"
          value="${escape(defaultValue)}"
          autocomplete="organization"
          spellcheck="false"
        />
      </div>
      <footer class="samoocena-modal-footer">
        <button type="button" class="samoocena-modal-btn samoocena-modal-btn-ghost" data-modal-action="cancel">
          ${escape(cancelLabel)}
        </button>
        <button type="button" class="samoocena-modal-btn samoocena-modal-btn-primary" data-modal-action="confirm"${required && !defaultValue.trim() ? ' disabled' : ''}>
          ${escape(confirmLabel)}
        </button>
      </footer>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add('samoocena-modal-open');

  const input = overlay.querySelector('[data-modal-input]');
  const confirmBtn = overlay.querySelector('[data-modal-action="confirm"]');
  const cancelBtn = overlay.querySelector('[data-modal-action="cancel"]');

  setTimeout(() => {
    input.focus();
    input.select();
  }, 50);

  const close = () => {
    document.removeEventListener('keydown', onKey);
    overlay.classList.add('samoocena-modal-overlay-out');
    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('samoocena-modal-open');
    }, 180);
    activeModal = null;
  };

  const handleConfirm = () => {
    const value = input.value.trim();
    if (required && !value) {
      input.focus();
      input.classList.add('samoocena-modal-input-error');
      return;
    }
    close();
    onConfirm?.(value);
  };
  const handleCancel = () => {
    close();
    onCancel?.();
  };

  confirmBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', handleCancel);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) handleCancel();
  });

  input.addEventListener('input', () => {
    input.classList.remove('samoocena-modal-input-error');
    if (required) {
      confirmBtn.disabled = !input.value.trim();
    }
  });

  const onKey = (e) => {
    if (e.key === 'Escape') handleCancel();
    if (e.key === 'Enter' && document.activeElement === input) handleConfirm();
  };
  document.addEventListener('keydown', onKey);

  activeModal = { close };
  return activeModal;
}

/**
 * Raport request modal — leadgen capture za PDF.
 * Pola: nazwa firmy (required), email (required + walidacja), zgoda marketingowa (pre-checked, opt-out).
 * Email walidowany regex'em zgodnym z RLS check w DB (`assessments_anon_set_email`).
 */
export function showRaportRequestModal({
  defaultCompanyName = '',
  defaultEmail = '',
  defaultMarketingConsent = true,
  onConfirm,
  onCancel,
}) {
  if (activeModal) activeModal.close();

  const overlay = document.createElement('div');
  overlay.className = 'samoocena-modal-overlay';
  overlay.innerHTML = `
    <div class="samoocena-modal samoocena-modal-wide" role="dialog" aria-modal="true" aria-labelledby="samoocena-modal-title">
      <div class="samoocena-modal-body">
        <h2 id="samoocena-modal-title" class="samoocena-modal-title">Pobierz raport PDF</h2>
        <p class="samoocena-modal-message">
          Raport jest darmowy w okresie promocji (100 pierwszych użytkowników, normalnie 149&nbsp;zł).
          Aby Ci go dostarczyć i potwierdzić rezerwację — potrzebujemy nazwy firmy i adresu email.
        </p>

        <label class="samoocena-modal-field">
          <span class="samoocena-modal-field-label">Nazwa firmy</span>
          <input
            type="text"
            class="samoocena-modal-input"
            data-modal-company
            placeholder="np. Twoja Firma Sp. z o.o."
            value="${escape(defaultCompanyName)}"
            autocomplete="organization"
            spellcheck="false"
            required
          />
        </label>

        <label class="samoocena-modal-field">
          <span class="samoocena-modal-field-label">Email do dostarczenia raportu</span>
          <input
            type="email"
            class="samoocena-modal-input"
            data-modal-email
            placeholder="np. ja@twojafirma.pl"
            value="${escape(defaultEmail)}"
            autocomplete="email"
            spellcheck="false"
            inputmode="email"
            required
          />
          <span class="samoocena-modal-field-error" data-modal-email-error></span>
        </label>

        <label class="samoocena-modal-checkbox">
          <input type="checkbox" data-modal-marketing ${defaultMarketingConsent ? 'checked' : ''} />
          <span>Chcę otrzymywać od Ai&nbsp;Pulse&nbsp;Security okazjonalną komunikację — nowe analizy, ostrzeżenia o aktualnych zagrożeniach dla MŚP, oferty audytów. Zgoda dobrowolna, możesz wycofać w każdej chwili (link w każdej wiadomości).</span>
        </label>

        <p class="samoocena-modal-fineprint">
          Twoje dane (nazwa firmy, email, wybór zgody) są przetwarzane wyłącznie przez Ai&nbsp;Pulse w celu dostarczenia raportu i ewentualnej komunikacji marketingowej (jeśli wyrazisz zgodę). Nie są udostępniane stronom trzecim.
        </p>
      </div>
      <footer class="samoocena-modal-footer">
        <button type="button" class="samoocena-modal-btn samoocena-modal-btn-ghost" data-modal-action="cancel">
          Anuluj
        </button>
        <button type="button" class="samoocena-modal-btn samoocena-modal-btn-primary" data-modal-action="confirm" disabled>
          Pobierz raport
        </button>
      </footer>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add('samoocena-modal-open');

  const companyInput = overlay.querySelector('[data-modal-company]');
  const emailInput = overlay.querySelector('[data-modal-email]');
  const marketingCheckbox = overlay.querySelector('[data-modal-marketing]');
  const emailError = overlay.querySelector('[data-modal-email-error]');
  const confirmBtn = overlay.querySelector('[data-modal-action="confirm"]');
  const cancelBtn = overlay.querySelector('[data-modal-action="cancel"]');

  const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validate = () => {
    const company = companyInput.value.trim();
    const email = emailInput.value.trim();
    const emailValid = !email || EMAIL_RE.test(email);
    emailError.textContent = email && !emailValid ? 'Niepoprawny format email.' : '';
    emailInput.classList.toggle('samoocena-modal-input-error', !!email && !emailValid);
    confirmBtn.disabled = !(company && email && emailValid);
  };

  setTimeout(() => {
    if (!defaultCompanyName) companyInput.focus();
    else emailInput.focus();
  }, 50);

  const close = () => {
    document.removeEventListener('keydown', onKey);
    overlay.classList.add('samoocena-modal-overlay-out');
    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('samoocena-modal-open');
    }, 180);
    activeModal = null;
  };

  const handleConfirm = () => {
    const company = companyInput.value.trim();
    const email = emailInput.value.trim();
    if (!company || !email || !EMAIL_RE.test(email)) {
      validate();
      return;
    }
    close();
    onConfirm?.({
      companyName: company,
      email,
      marketingConsent: !!marketingCheckbox.checked,
    });
  };
  const handleCancel = () => {
    close();
    onCancel?.();
  };

  confirmBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', handleCancel);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) handleCancel();
  });

  companyInput.addEventListener('input', validate);
  emailInput.addEventListener('input', validate);
  emailInput.addEventListener('blur', validate);

  const onKey = (e) => {
    if (e.key === 'Escape') handleCancel();
    if (e.key === 'Enter' && (document.activeElement === companyInput || document.activeElement === emailInput)) {
      e.preventDefault();
      if (!confirmBtn.disabled) handleConfirm();
    }
  };
  document.addEventListener('keydown', onKey);

  activeModal = { close };
  return activeModal;
}

function escape(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
