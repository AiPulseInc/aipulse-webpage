/**
 * Cookie consent API for Ai Puls.
 *
 * Wiring instructions:
 * 1. Import `./src/cookie-consent/index.js` as early as possible in each page entry.
 * 2. Do not load Google Analytics, Meta Pixel, Google Ads or similar tools eagerly.
 * 3. Gate every non-essential script behind `hasConsent('analytics')` or `hasConsent('marketing')`.
 * 4. Listen for `window` event `cookie-consent:change` to react after the visitor updates preferences.
 * 5. Keep injections idempotent. Once a third-party script is added, guard against loading it twice.
 *
 * Stored shape:
 * {
 *   necessary: true,
 *   analytics: false,
 *   marketing: false,
 *   timestamp: '2026-01-01T12:34:56.000Z'
 * }
 *
 * Example: Google Analytics 4
 * ```js
 * import { hasConsent } from './src/cookie-consent/consent.js';
 *
 * const GA_ID = 'G-XXXXXXXXXX';
 * let gaLoaded = false;
 *
 * function loadGa4() {
 *   if (gaLoaded || !hasConsent('analytics')) return;
 *   gaLoaded = true;
 *
 *   window.dataLayer = window.dataLayer || [];
 *   window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
 *   window.gtag('js', new Date());
 *   window.gtag('config', GA_ID, { anonymize_ip: true });
 *
 *   const script = document.createElement('script');
 *   script.async = true;
 *   script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
 *   document.head.append(script);
 * }
 *
 * loadGa4();
 * window.addEventListener('cookie-consent:change', () => {
 *   loadGa4();
 * });
 * ```
 *
 * Example: Meta Pixel
 * ```js
 * import { hasConsent } from './src/cookie-consent/consent.js';
 *
 * const PIXEL_ID = '123456789012345';
 * let pixelLoaded = false;
 *
 * function loadMetaPixel() {
 *   if (pixelLoaded || !hasConsent('marketing')) return;
 *   pixelLoaded = true;
 *
 *   window.fbq = window.fbq || function fbq(){
 *     if (window.fbq.callMethod) {
 *       window.fbq.callMethod.apply(window.fbq, arguments);
 *     } else {
 *       window.fbq.queue.push(arguments);
 *     }
 *   };
 *
 *   if (!window._fbq) window._fbq = window.fbq;
 *   window.fbq.push = window.fbq;
 *   window.fbq.loaded = true;
 *   window.fbq.version = '2.0';
 *   window.fbq.queue = window.fbq.queue || [];
 *
 *   const script = document.createElement('script');
 *   script.async = true;
 *   script.src = 'https://connect.facebook.net/en_US/fbevents.js';
 *   document.head.append(script);
 *
 *   window.fbq('init', PIXEL_ID);
 *   window.fbq('track', 'PageView');
 * }
 *
 * loadMetaPixel();
 * window.addEventListener('cookie-consent:change', () => {
 *   loadMetaPixel();
 * });
 * ```
 */

export const CONSENT_KEY = 'cookie_consent';
export const CATEGORIES = Object.freeze(['necessary', 'analytics', 'marketing']);

function isStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function isValidConsent(candidate) {
  if (!candidate || typeof candidate !== 'object') return false;
  if (candidate.necessary !== true) return false;
  if (typeof candidate.analytics !== 'boolean') return false;
  if (typeof candidate.marketing !== 'boolean') return false;
  if (typeof candidate.timestamp !== 'string') return false;
  return !Number.isNaN(Date.parse(candidate.timestamp));
}

function dispatchConsentChange(detail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('cookie-consent:change', { detail }));
}

export function getConsent() {
  if (!isStorageAvailable()) return null;

  try {
    const rawValue = window.localStorage.getItem(CONSENT_KEY);
    if (!rawValue) return null;

    const parsedValue = JSON.parse(rawValue);
    if (!isValidConsent(parsedValue)) return null;

    return {
      necessary: true,
      analytics: parsedValue.analytics,
      marketing: parsedValue.marketing,
      timestamp: parsedValue.timestamp,
    };
  } catch {
    return null;
  }
}

export function setConsent({ analytics = false, marketing = false } = {}) {
  const consent = {
    necessary: true,
    analytics: Boolean(analytics),
    marketing: Boolean(marketing),
    timestamp: new Date().toISOString(),
  };

  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    } catch {
    }
  }

  dispatchConsentChange(consent);
  return consent;
}

export function hasConsent(category) {
  if (category === 'necessary') return true;
  if (!CATEGORIES.includes(category)) return false;

  const consent = getConsent();
  if (!consent) return false;

  return consent[category] === true;
}

export function clearConsent() {
  if (!isStorageAvailable()) return;

  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
  }
}
