import './styles.css';
import { init, openModal } from './ui.js';

export {
  getConsent,
  setConsent,
  hasConsent,
  clearConsent,
  CATEGORIES,
} from './consent.js';

export { openModal as openCookieSettings } from './ui.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
