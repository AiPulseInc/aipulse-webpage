// supabase/functions/create-checkout-session/index.ts
// POST /functions/v1/create-checkout-session
// Body: { assessmentId, email, marketingConsent, payload }
// Response: { ok: true, url } | { ok: false, error: code }
//
// Tworzy Stripe Checkout Session dla raportu PDF (99 PLN netto + 23% VAT = 121.77 PLN brutto).
// Mirror konwencji `send-report`: zapisuje email + marketing_consent + report_payload do assessment
// (aby raport był dostępny po payment'cie z linka emailowego). Plus insertuje row do `payments`
// (status 'open'), przepina assessment.report_status na 'pending_payment', upsert do `leads`,
// zwraca redirect URL na Stripe Checkout.
//
// Env: STRIPE_RESTRICTED_KEY, STRIPE_PRICE_ID, STRIPE_TAX_RATE_ID, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SITE_URL.

import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@17';

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
  | 'already_paid'
  | 'service_unavailable';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function err(code: ErrCode, status = 200): Response {
  return json({ ok: false, error: code }, status);
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
  const STRIPE_KEY = Deno.env.get('STRIPE_RESTRICTED_KEY') || Deno.env.get('STRIPE_SECRET_KEY');
  const STRIPE_PRICE_ID = Deno.env.get('STRIPE_PRICE_ID');
  const STRIPE_TAX_RATE_ID = Deno.env.get('STRIPE_TAX_RATE_ID');
  const SITE_URL = Deno.env.get('SITE_URL') || 'https://aipulse.pl';

  if (!SUPABASE_URL || !SERVICE_ROLE || !STRIPE_KEY || !STRIPE_PRICE_ID || !STRIPE_TAX_RATE_ID) {
    const missing = [
      !SUPABASE_URL && 'SUPABASE_URL',
      !SERVICE_ROLE && 'SUPABASE_SERVICE_ROLE_KEY',
      !STRIPE_KEY && 'STRIPE_RESTRICTED_KEY_or_STRIPE_SECRET_KEY',
      !STRIPE_PRICE_ID && 'STRIPE_PRICE_ID',
      !STRIPE_TAX_RATE_ID && 'STRIPE_TAX_RATE_ID',
    ].filter(Boolean);
    console.error('[create-checkout-session] missing env vars:', missing.join(', '));
    return err('service_unavailable', 500);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Validate assessment exists + not yet paid; UPSERT email/consent/payload + flip to pending_payment
  const { data: assessment, error: aerr } = await supabase
    .from('assessments')
    .update({
      email,
      marketing_consent: marketingConsent,
      report_payload: payload,
      report_status: 'pending_payment',
    })
    .eq('id', assessmentId)
    .not('report_status', 'in', '("paid","ready")') // idempotency: don't overwrite already-paid
    .select('id, report_status')
    .single();

  if (aerr || !assessment) {
    console.error('[create-checkout-session] assessment update failed:', aerr?.message);
    // Distinguish: already paid vs not found via separate lookup
    const { data: existing } = await supabase
      .from('assessments')
      .select('report_status')
      .eq('id', assessmentId)
      .maybeSingle();
    if (existing && (existing.report_status === 'paid' || existing.report_status === 'ready')) {
      return err('already_paid');
    }
    return err('assessment_not_found', 404);
  }

  // 2. Upsert lead (email + consent), capture for audit trail
  const { error: lerr } = await supabase
    .from('leads')
    .upsert(
      {
        assessment_id: assessmentId,
        email,
        consent_marketing: marketingConsent,
        consent_marketing_at: marketingConsent ? new Date().toISOString() : null,
        source: 'paid_pdf',
      },
      { onConflict: 'assessment_id' },
    );

  if (lerr) {
    console.error('[create-checkout-session] lead upsert failed:', lerr.message);
    return err('service_unavailable', 500);
  }

  // 3. Create Stripe Checkout Session
  const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion });

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'pl',
      customer_email: email,
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
          tax_rates: [STRIPE_TAX_RATE_ID],
        },
      ],
      tax_id_collection: { enabled: true },
      billing_address_collection: 'auto',
      custom_fields: [
        {
          key: 'wants_invoice',
          label: { type: 'custom', custom: 'Faktura VAT?' },
          type: 'dropdown',
          dropdown: {
            default_value: 'nie',
            options: [
              { label: 'Tak, poproszę o fakturę VAT', value: 'tak' },
              { label: 'Nie potrzebuję', value: 'nie' },
            ],
          },
        },
      ],
      metadata: {
        assessment_id: assessmentId,
        source: 'paid_pdf_report',
      },
      success_url: `${SITE_URL}/raport-audit/?id=${assessmentId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/bezpieczenstwo-samoocena/`,
    });
  } catch (e) {
    console.error('[create-checkout-session] stripe error:', (e as Error).message);
    return err('service_unavailable', 500);
  }

  // 4. Insert/update payments row (status 'open', stripe_session_id)
  const { error: perr } = await supabase
    .from('payments')
    .insert({
      assessment_id: assessmentId,
      provider: 'stripe',
      product_code: 'pdf_report',
      status: 'open',
      amount_minor: 9900, // 99.00 PLN netto in grosze
      currency: 'pln',
      stripe_session_id: session.id,
    });

  if (perr) {
    // Non-fatal: session is created in Stripe, payment row insert is for our audit.
    // Webhook will idempotently insert on completion if missing.
    console.error('[create-checkout-session] payment insert failed:', perr.message);
  }

  return json({ ok: true, url: session.url });
});
