// Lightweight modal confirm w stylu Ai Puls — violet accent, brutalist, square.
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

function escape(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
