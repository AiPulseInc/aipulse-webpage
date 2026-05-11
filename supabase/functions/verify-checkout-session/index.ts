// supabase/functions/verify-checkout-session/index.ts
// POST /functions/v1/verify-checkout-session  Body: { sessionId: 'cs_xxx' }
// Response: { ok: true, paid: bool, assessmentId?, payload? } | { ok: false, error: code }
//
// Wywoływany przez frontend po redirect z Stripe Checkout (success_url).
// Idempotentne — można wywołać wielokrotnie. Zwraca payload raportu jeśli payment paid.
//
// Env: STRIPE_RESTRICTED_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.

import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@17';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-application',
};

type ErrCode = 'invalid_session_id' | 'session_not_found' | 'service_unavailable';

const SESSION_ID_REGEX = /^cs_(test|live)_[a-zA-Z0-9]+$/;

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
  if (req.method !== 'POST') return err('invalid_session_id', 405);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return err('invalid_session_id');
  }
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : '';
  if (!SESSION_ID_REGEX.test(sessionId)) return err('invalid_session_id');

  // Trim — Supabase UI paste can leave trailing \n which breaks Stripe API calls.
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')?.trim();
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim();
  const STRIPE_KEY = (Deno.env.get('STRIPE_RESTRICTED_KEY') || Deno.env.get('STRIPE_SECRET_KEY'))?.trim();

  if (!SUPABASE_URL || !SERVICE_ROLE || !STRIPE_KEY) {
    console.error('[verify-checkout-session] missing env vars');
    return err('service_unavailable', 500);
  }

  const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion });

  // Retrieve Stripe Checkout Session
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (e) {
    console.error('[verify-checkout-session] stripe retrieve failed:', (e as Error).message);
    return err('session_not_found', 404);
  }

  const assessmentId = session.metadata?.assessment_id;
  if (!assessmentId) {
    console.error('[verify-checkout-session] session missing assessment_id metadata');
    return err('session_not_found', 404);
  }

  const paid = session.payment_status === 'paid';

  if (!paid) {
    return json({ ok: true, paid: false, status: session.payment_status });
  }

  // Paid — fetch report payload from DB
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: assessment, error: aerr } = await supabase
    .from('assessments')
    .select('id, report_payload, report_status')
    .eq('id', assessmentId)
    .single();

  if (aerr || !assessment) {
    console.error('[verify-checkout-session] assessment lookup failed:', aerr?.message);
    return err('session_not_found', 404);
  }

  return json({
    ok: true,
    paid: true,
    assessmentId: assessment.id,
    payload: assessment.report_payload,
    reportStatus: assessment.report_status,
  });
});
