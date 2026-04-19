// supabase/functions/contact/index.ts
// POST /functions/v1/contact
// Body: { source, name, company?, email, phone?, message?, consent, website? }
//   - `website` to honeypot field (pusty = człowiek; wypełniony = bot → cichy 200)
// Response: { ok: true } | { ok: false, error: code }
//
// Zapisuje do `leads` (service role) + wysyła mail do maciek@aipulse.pl przez Resend.
// Resend failure nie przerywa sukcesu (fire-and-forget z logiem błędu).
// Zgodne z feedback_lazy_init (env czytane w handlerze), feedback_no_secrets_in_output.

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
  | 'invalid_source'
  | 'missing_consent'
  | 'service_unavailable';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const SOURCES = new Set(['security', 'business']);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function err(code: ErrCode, status = 200): Response {
  return json({ ok: false, error: code }, status);
}

function clean(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const trimmed = v.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendEmail(
  apiKey: string,
  subject: string,
  text: string,
  replyTo: string,
): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Ai Pulse Info <info@aipulse.pl>',
      to: ['maciek@aipulse.pl'],
      reply_to: replyTo,
      subject,
      text,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`resend ${res.status}: ${body.slice(0, 200)}`);
  }
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

  // Honeypot: bot fills `website`, człowiek nie.
  if (typeof body.website === 'string' && body.website.trim()) {
    return json({ ok: true }); // ciche 200, nic nie zapisujemy
  }

  const source = clean(body.source, 20);
  if (!source || !SOURCES.has(source)) return err('invalid_source');

  const name = clean(body.name, 200);
  if (!name || name.length < 2) return err('invalid_payload');

  const email = clean(body.email, 320);
  if (!email || !EMAIL_REGEX.test(email)) return err('invalid_email');

  if (body.consent !== true) return err('missing_consent');

  const company = clean(body.company, 200);
  const phone = clean(body.phone, 30);
  const message = clean(body.message, 2000);

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('[contact] missing Supabase env');
    return err('service_unavailable', 500);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from('contact_submissions')
    .insert({ source, name, company, email, phone, message, consent: true })
    .select('id')
    .single();

  if (error) {
    console.error('[contact] db error:', error.message);
    return err('service_unavailable', 500);
  }

  // Email do maciek@aipulse.pl — fire-and-forget (nie blokuje response)
  if (RESEND_API_KEY) {
    const subject = `[Ai Pulse · ${source}] Nowy kontakt: ${name}`;
    const text = [
      `Źródło: ${source === 'security' ? 'aipulse.pl/security' : 'aipulse.pl/business'}`,
      `Imię i nazwisko: ${name}`,
      company ? `Firma: ${company}` : null,
      `Email: ${email}`,
      phone ? `Telefon: ${phone}` : null,
      '',
      'Wiadomość:',
      message || '(brak wiadomości)',
      '',
      '---',
      `Lead ID: ${data.id}`,
      `Czas: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join('\n');

    sendEmail(RESEND_API_KEY, subject, text, email).catch((e) => {
      console.error('[contact] email send failed:', e.message);
    });
  } else {
    console.warn('[contact] RESEND_API_KEY missing — lead saved, no email sent');
  }

  return json({ ok: true });
});
