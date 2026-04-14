import './styles.css';
import { VERSION } from '../version.js';

const versionEl = document.getElementById('app-version');
if (versionEl) {
  versionEl.textContent = `v${VERSION}`;
}
