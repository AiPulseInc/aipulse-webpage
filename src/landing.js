import '../style.css'
import { VERSION } from './version.js'

// Inject version in landing footer
document.addEventListener('DOMContentLoaded', () => {
  const versionEl = document.getElementById('app-version');
  if (versionEl) versionEl.textContent = `v${VERSION}`;
});
