import '../style.css';
import './cookie-consent/index.js';
import { initGA } from './ga.js';
import { VERSION } from './version.js';

initGA();

function initPolicyPage() {
  const versionElement = document.getElementById('app-version');
  if (versionElement) versionElement.textContent = `v${VERSION}`;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPolicyPage, { once: true });
} else {
  initPolicyPage();
}
