// supabase/functions/send-report/index.ts
// POST /functions/v1/send-report
// Body: { assessmentId, email, marketingConsent, payload }
// Response: { ok: true, reportUrl } | { ok: false, error: code }
//
// Zapisuje snapshot raportu (payload) + email + marketing_consent do assessments,
// wysyła email przez Resend z linkiem do raportu online.

import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-application',
};

type ErrCode =
  | 'invalid_payload'
  | 'invalid_email'
  | 'missing_consent'
  | 'assessment_not_found'
  | 'service_unavailable';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SITE_URL = 'https://aipulse.pl';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function err(code: ErrCode, status = 200): Response {
  return json({ ok: false, error: code }, status);
}

async function sendEmail(
  apiKey: string,
  to: string,
  subject: string,
  text: string,
  html: string,
): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Ai Pulse Info <info@aipulse.pl>',
      to: [to],
      reply_to: 'maciek@aipulse.pl',
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`resend ${res.status}: ${body.slice(0, 200)}`);
  }
}

function renderEmail(
  reportUrl: string,
  companyName: string | null,
  maturityLabel: string | null,
): { text: string; html: string } {
  const who = companyName ? `dla firmy ${companyName}` : '';
  const maturity = maturityLabel
    ? `\nPoziom dojrzałości: ${maturityLabel}\n`
    : '';

  const text = [
    `Dzień dobry,`,
    ``,
    `Dziękujemy za wypełnienie samooceny cyberbezpieczeństwa Ai Pulse${who ? ' ' + who : ''}.`,
    maturity,
    `Twój raport audytu jest dostępny pod linkiem:`,
    reportUrl,
    ``,
    `Raport zawiera szczegółową analizę 5 obszarów bezpieczeństwa (Ludzie, Dane, Systemy, Zarządzanie, Compliance), wynik benchmarku dla Twojej branży oraz priorytety poprawy w Twojej organizacji.`,
    ``,
    `Masz pytania albo chcesz umówić bezpłatną konsultację? Odpisz na tego maila lub zadzwoń: +48 508 406 948.`,
    ``,
    `Pozdrawiam,`,
    `Maciej Konieczny`,
    `Ai Pulse Security`,
    `https://aipulse.pl/security`,
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8"><title>Twój raport audytu Ai Pulse</title></head>
<body style="font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; line-height: 1.55; max-width: 560px; margin: 24px auto; padding: 24px;">
  <p>Dzień dobry,</p>
  <p>Dziękujemy za wypełnienie samooceny cyberbezpieczeństwa <strong>Ai Pulse</strong>${who ? ` ${escapeHtml(who)}` : ''}.</p>
  ${maturityLabel ? `<p><strong>Poziom dojrzałości:</strong> ${escapeHtml(maturityLabel)}</p>` : ''}
  <p style="margin: 24px 0;">
    <a href="${reportUrl}" style="display: inline-block; background: #8B5CF6; color: #fff; text-decoration: none; padding: 12px 24px; font-weight: 600; border-radius: 4px;">Otwórz raport →</a>
  </p>
  <p>Raport zawiera szczegółową analizę 5 obszarów bezpieczeństwa (Ludzie, Dane, Systemy, Zarządzanie, Compliance), wynik benchmarku dla Twojej branży oraz priorytety poprawy w Twojej organizacji.</p>
  <p>Masz pytania albo chcesz umówić bezpłatną konsultację? Odpisz na tego maila lub zadzwoń: <strong>+48 508 406 948</strong>.</p>
  <p style="margin-top: 32px;">Pozdrawiam,<br>Maciej Konieczny<br><a href="https://aipulse.pl/security" style="color: #8B5CF6;">Ai Pulse Security</a></p>
</body>
</html>`;

  return { text, html };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') return err('invalid_payload', 405);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return err('invalid_payload');
  }

  const assessmentId = typeof body.assessmentId === 'string' ? body.assessmentId : '';
  if (!UUID_REGEX.test(assessmentId)) return err('invalid_payload');

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!email || !EMAIL_REGEX.test(email) || email.length > 320) return err('invalid_email');

  const marketingConsent = body.marketingConsent === true;

  const payload = body.payload;
  if (!payload || typeof payload !== 'object') return err('invalid_payload');

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('[send-report] missing Supabase env');
    return err('service_unavailable', 500);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // UPDATE assessment — set email + marketing_consent + report_payload + report_sent_at
  const { data, error } = await supabase
    .from('assessments')
    .update({
      email,
      marketing_consent: marketingConsent,
      report_payload: payload,
      report_sent_at: new Date().toISOString(),
    })
    .eq('id', assessmentId)
    .select('id')
    .single();

  if (error || !data) {
    console.error('[send-report] db error:', error?.message);
    return err('assessment_not_found', 404);
  }

  const reportUrl = `${SITE_URL}/raport-audit/?id=${assessmentId}`;

  // Pobierz metadata z payload żeby zbudować email
  const companyName =
    payload && typeof payload === 'object' && 'profile' in payload
      ? (payload as { profile?: { companyName?: string } }).profile?.companyName ?? null
      : null;
  const maturityLabel =
    payload && typeof payload === 'object' && 'scoringResult' in payload
      ? (payload as { scoringResult?: { maturity?: { label?: string } } }).scoringResult?.maturity?.label ?? null
      : null;

  const { text, html } = renderEmail(reportUrl, companyName, maturityLabel);

  if (RESEND_API_KEY) {
    try {
      await sendEmail(RESEND_API_KEY, email, 'Twój raport audytu Ai Pulse', text, html);
    } catch (e) {
      console.error('[send-report] email send failed:', e.message);
      // Nie failujemy — raport jest zapisany w DB, user może otworzyć link w success toast
    }
  } else {
    console.warn('[send-report] RESEND_API_KEY missing — no email sent');
  }

  return json({ ok: true, reportUrl });
});
