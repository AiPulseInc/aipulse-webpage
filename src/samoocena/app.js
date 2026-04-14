import './styles.css';
import { VERSION } from '../version.js';
import { getCategoriesMeta, getQuestions } from './scoring.js';
import './recommendations.js';

const versionEl = document.getElementById('app-version');
if (versionEl) {
  versionEl.textContent = `v${VERSION}`;
}

if (typeof window !== 'undefined') {
  window.__samoocenaSmoke = {
    categories: getCategoriesMeta().length,
    questions: getQuestions().length,
  };
}
