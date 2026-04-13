import '../style.css'
import './cookie-consent/index.js'
import { VERSION } from './version.js'

// Inject version in landing footer
document.addEventListener('DOMContentLoaded', () => {
  const versionEl = document.getElementById('app-version');
  if (versionEl) versionEl.textContent = `v${VERSION}`;
});
