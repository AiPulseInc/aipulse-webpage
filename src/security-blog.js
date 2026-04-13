import '../style.css';
import './security-blog.css';
import { VERSION } from './version.js';

// Version badge in nav
document.addEventListener('DOMContentLoaded', () => {
  const versionEl = document.getElementById('app-version');
  if (versionEl) versionEl.textContent = `v${VERSION}`;

  initBlogNav();
  initNavHeightTracking();
});

function initBlogNav() {
  const toggle = document.querySelector('.site-nav-toggle');
  const menu = document.getElementById('site-nav-menu');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(willOpen);
  });

  menu.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (e.target.closest('.site-nav')) return;
    setOpen(false);
  });

  const mq = window.matchMedia('(min-width: 1024px)');
  mq.addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

function initNavHeightTracking() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const update = () => {
    const h = Math.round(nav.getBoundingClientRect().height);
    if (h > 0) document.documentElement.style.setProperty('--nav-height', `${h}px`);
  };

  update();
  window.addEventListener('resize', update);

  if ('ResizeObserver' in window) {
    new ResizeObserver(update).observe(nav);
  }
}
