// supabase/functions/scan-domain/providers.ts
// MX hostname → provider name lookup + self-hosted detection.
// Port z aipulse-dns-demo/parse.mjs (zwalidowany Phase 0).

const MX_PROVIDERS: Array<[RegExp, string]> = [
  [/aspmx\.l\.google\.com$/i, 'Google Workspace'],
  [/googlemail\.com$/i, 'Google Workspace'],
  [/\.outlook\.com$/i, 'Microsoft 365'],
  [/protection\.outlook\.com$/i, 'Microsoft 365'],
  [/\.protonmail\.ch$/i, 'Proton Mail'],
  [/\.mailgun\.org$/i, 'Mailgun (transactional)'],
  [/\.amazonses\.com$/i, 'Amazon SES (transactional)'],
  [/\.sendgrid\.net$/i, 'SendGrid (transactional)'],
  [/\.mimecast\.com$/i, 'Mimecast'],
  [/mx\.zoho\./i, 'Zoho Mail'],
  [/\.onet\.pl$/i, 'Onet'],
  [/\.home\.(net\.)?pl$/i, 'home.pl'],
  [/\.nazwa\.pl$/i, 'nazwa.pl'],
  [/\.ovh\.(net|pl)$/i, 'OVH'],
  [/\.hekko\.pl$/i, 'Hekko'],
  [/\.dhosting\.pl$/i, 'dhosting.pl'],
  [/\.cyberfolks\.pl$/i, 'cyberFolks'],
  [/\.kei\.pl$/i, 'kei.pl'],
  [/\.linuxpl\.com$/i, 'LinuxPL'],
  [/\.wp\.pl$/i, 'WP.pl'],
];

/**
 * Returns provider name dla danego MX setup.
 * - Known third-party patterns first (Google, MS365, polskie hostingi)
 * - Self-hosted detection: MX kończy się na queried domain (banki, własna infra)
 * - Unknown 3rd party fallback
 * @param mxHosts pełne hostnames MX records (po parseMxHost)
 * @param queriedDomain lowercase
 */
export function inferProvider(mxHosts: string[], queriedDomain: string): string | null {
  for (const host of mxHosts) {
    for (const [pattern, name] of MX_PROVIDERS) {
      if (pattern.test(host)) return name;
    }
  }
  const allSelfHosted = mxHosts.length > 0 && mxHosts.every((h) => {
    const lower = h.toLowerCase();
    return lower === queriedDomain || lower.endsWith('.' + queriedDomain);
  });
  if (allSelfHosted) return 'własny serwer (self-hosted)';
  return mxHosts.length > 0 ? 'inny dostawca (nieznany)' : null;
}
