import { getConsent } from './cookie-consent/consent.js';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
let initialized = false;

function gtag() {
  window.dataLayer.push(arguments);
}

export function initGA() {
  if (initialized || !GA_ID) return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500,
  });

  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  const stored = getConsent();
  if (stored) applyConsentUpdate(stored);

  window.addEventListener('cookie-consent:change', (e) => {
    applyConsentUpdate(e.detail);
    gtag('event', 'cookie_consent_granted', {
      analytics: !!e.detail?.analytics,
      marketing: !!e.detail?.marketing,
    });
  });
}

function applyConsentUpdate(c) {
  gtag('consent', 'update', {
    analytics_storage: c.analytics ? 'granted' : 'denied',
    ad_storage: c.marketing ? 'granted' : 'denied',
    ad_user_data: c.marketing ? 'granted' : 'denied',
    ad_personalization: c.marketing ? 'granted' : 'denied',
  });
}

export function trackEvent(name, params = {}) {
  if (!initialized) return;
  window.gtag('event', name, params);
}

export function trackPageView(path, title) {
  if (!initialized || !GA_ID) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.origin + path,
  });
}
