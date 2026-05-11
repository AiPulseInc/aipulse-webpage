// supabase/functions/stripe-webhook/index.ts
// POST /functions/v1/stripe-webhook
// Endpoint dla Stripe webhooków. Verifies signature przed jakimkolwiek processingiem.
//
// Obsługuje:
//   - checkout.session.completed → mark payment paid + update assessment + dispatch emails
//
// Idempotentne via payments.stripe_event_id unique constraint.
//
// Env: STRIPE_RESTRICTED_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//      RESEND_API_KEY, ADMIN_EMAIL, SITE_URL.

import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@17';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'stripe-signature, content-type',
};

const SITE_URL = Deno.env.get('SITE_URL') || 'https://aipulse.pl';
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'aipulse.inc@gmail.com';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

function renderUserReportEmail(reportUrl: string, maturityLabel: string | null): { text: string; html: string } {
  const maturity = maturityLabel ? `\nPoziom dojrzałości: ${maturityLabel}\n` : '';
  const text = [
    `Dzień dobry,`,
    ``,
    `Dziękujemy za zakup raportu cyberbezpieczeństwa Ai Pulse Security.`,
    maturity,
    `Twój raport jest dostępny pod linkiem:`,
    reportUrl,
    ``,
    `Raport zawiera szczegółową analizę 5 obszarów bezpieczeństwa, benchmark branżowy i listę priorytetów na pierwsze 30 dni.`,
    ``,
    `Pozdrawiam,`,
    `Maciej Konieczny`,
    `Ai Pulse Security`,
    `+48 508 406 948`,
    `https://aipulse.pl/security`,
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8"><title>Twój raport audytu Ai Pulse</title></head>
<body style="font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; line-height: 1.55; max-width: 560px; margin: 24px auto; padding: 24px;">
  <p>Dzień dobry,</p>
  <p>Dziękujemy za zakup raportu cyberbezpieczeństwa <strong>Ai Pulse Security</strong>.</p>
  ${maturityLabel ? `<p><strong>Poziom dojrzałości:</strong> ${escapeHtml(maturityLabel)}</p>` : ''}
  <p style="margin: 24px 0;">
    <a href="${reportUrl}" style="display: inline-block; background: #7E22CE; color: #fff; text-decoration: none; padding: 12px 24px; font-weight: 600; border-radius: 4px;">Otwórz raport →</a>
  </p>
  <p>Raport zawiera szczegółową analizę 5 obszarów bezpieczeństwa, benchmark branżowy i listę priorytetów na pierwsze 30 dni.</p>
  <p style="margin-top: 32px;">Pozdrawiam,<br>Maciej Konieczny<br><a href="https://aipulse.pl/security" style="color: #7E22CE;">Ai Pulse Security</a> · +48 508 406 948</p>
</body>
</html>`;

  return { text, html };
}

function renderAdminInvoiceRequest(payload: {
  email: string;
  customerName: string | null;
  companyName: string | null;
  vatId: string | null;
  amountGross: string;
  sessionId: string;
  paymentIntentId: string | null;
  address: string | null;
}): { subject: string; text: string; html: string } {
  const subject = `[FAKTURA VAT] ${payload.companyName || payload.email} — Raport AiPulse Cyber Audit`;
  const text = [
    `Klient zaznaczył checkbox "Faktura VAT" przy zakupie raportu.`,
    ``,
    `=== Dane do faktury ===`,
    `Klient: ${payload.customerName || '(brak)'}`,
    `Firma: ${payload.companyName || '(brak)'}`,
    `NIP: ${payload.vatId || '(brak)'}`,
    `Adres: ${payload.address || '(nie zebrano)'}`,
    `Email kontaktowy: ${payload.email}`,
    ``,
    `=== Transakcja ===`,
    `Kwota brutto: ${payload.amountGross} PLN (99 PLN netto + 23% VAT)`,
    `Stripe session: ${payload.sessionId}`,
    `PaymentIntent: ${payload.paymentIntentId || '(jeszcze nie ustalony)'}`,
    ``,
    `Wystaw fakturę i wyślij do klienta na ${payload.email}.`,
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="pl"><head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, sans-serif; max-width: 600px; padding: 24px;">
<h2>Faktura VAT — prośba</h2>
<p>Klient zaznaczył checkbox <strong>"Faktura VAT"</strong> przy zakupie raportu.</p>
<h3>Dane do faktury</h3>
<table style="border-collapse: collapse;">
<tr><td style="padding: 4px 12px 4px 0;"><strong>Klient:</strong></td><td>${escapeHtml(payload.customerName || '(brak)')}</td></tr>
<tr><td style="padding: 4px 12px 4px 0;"><strong>Firma:</strong></td><td>${escapeHtml(payload.companyName || '(brak)')}</td></tr>
<tr><td style="padding: 4px 12px 4px 0;"><strong>NIP:</strong></td><td>${escapeHtml(payload.vatId || '(brak)')}</td></tr>
<tr><td style="padding: 4px 12px 4px 0;"><strong>Adres:</strong></td><td>${escapeHtml(payload.address || '(nie zebrano)')}</td></tr>
<tr><td style="padding: 4px 12px 4px 0;"><strong>Email:</strong></td><td>${escapeHtml(payload.email)}</td></tr>
</table>
<h3>Transakcja</h3>
<table style="border-collapse: collapse;">
<tr><td style="padding: 4px 12px 4px 0;"><strong>Kwota brutto:</strong></td><td>${escapeHtml(payload.amountGross)} PLN <em>(99 PLN netto + 23% VAT)</em></td></tr>
<tr><td style="padding: 4px 12px 4px 0;"><strong>Stripe session:</strong></td><td><code>${escapeHtml(payload.sessionId)}</code></td></tr>
<tr><td style="padding: 4px 12px 4px 0;"><strong>PaymentIntent:</strong></td><td><code>${escapeHtml(payload.paymentIntentId || '(brak)')}</code></td></tr>
</table>
<p>Wystaw fakturę i wyślij do klienta na <strong>${escapeHtml(payload.email)}</strong>.</p>
</body></html>`;

  return { subject, text, html };
}

async function handleCheckoutCompleted(
  supabase: SupabaseClient,
  stripe: Stripe,
  resendKey: string | undefined,
  event: Stripe.CheckoutSessionCompletedEvent,
): Promise<void> {
  const session = event.data.object;
  const assessmentId = session.metadata?.assessment_id;
  if (!assessmentId) {
    console.error('[stripe-webhook] checkout.session.completed missing assessment_id metadata');
    return;
  }

  // Idempotency: skip if event already processed
  const { data: existing } = await supabase
    .from('payments')
    .select('id, status')
    .eq('stripe_event_id', event.id)
    .maybeSingle();

  if (existing) {
    console.log('[stripe-webhook] event already processed:', event.id);
    return;
  }

  // Read full session with line_items for amount + custom_fields
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items', 'customer_details', 'total_details'],
  });

  // wants_invoice from custom_fields
  const wantsInvoice = (fullSession.custom_fields || []).some(
    (cf) => cf.key === 'wants_invoice' && cf.dropdown?.value === 'tak',
  );

  // Amount details
  const amountTotal = fullSession.amount_total ?? 0; // grosze, brutto
  const customerDetails = fullSession.customer_details;
  const taxIds = customerDetails?.tax_ids || [];
  const vatId = taxIds.find((t) => t.type === 'eu_vat' || t.type === 'pl_nip')?.value || null;
  const address = customerDetails?.address;
  const addressFormatted = address
    ? [address.line1, address.line2, address.postal_code, address.city, address.country]
        .filter(Boolean)
        .join(', ')
    : null;

  // Upsert payments row (idempotent)
  const { error: perr } = await supabase
    .from('payments')
    .upsert(
      {
        assessment_id: assessmentId,
        provider: 'stripe',
        product_code: 'pdf_report',
        status: 'completed',
        amount_minor: amountTotal,
        currency: (fullSession.currency || 'pln').toLowerCase(),
        stripe_session_id: fullSession.id,
        stripe_payment_intent_id: typeof fullSession.payment_intent === 'string'
          ? fullSession.payment_intent
          : fullSession.payment_intent?.id || null,
        stripe_event_id: event.id,
        wants_invoice: wantsInvoice,
        paid_at: new Date().toISOString(),
      },
      { onConflict: 'stripe_session_id' },
    );

  if (perr) {
    console.error('[stripe-webhook] payment upsert failed:', perr.message);
    throw perr;
  }

  // Update assessment.report_status → 'paid'
  const { error: uerr } = await supabase
    .from('assessments')
    .update({ report_status: 'paid' })
    .eq('id', assessmentId);

  if (uerr) {
    console.error('[stripe-webhook] assessment update failed:', uerr.message);
  }

  // Update lead with vat_id + company_name + full_name from Stripe
  const { error: lerr } = await supabase
    .from('leads')
    .update({
      vat_id: vatId,
      company_name: customerDetails?.name || null,
      full_name: customerDetails?.name || null,
    })
    .eq('assessment_id', assessmentId);

  if (lerr) {
    console.error('[stripe-webhook] lead update failed:', lerr.message);
  }

  // Fetch report payload (for maturity label in email)
  const { data: assessment } = await supabase
    .from('assessments')
    .select('report_payload')
    .eq('id', assessmentId)
    .single();

  const maturityLabel =
    assessment?.report_payload && typeof assessment.report_payload === 'object'
      ? (assessment.report_payload as { scoringResult?: { maturity?: { label?: string } } })
          .scoringResult?.maturity?.label ?? null
      : null;

  // Send report email to user
  if (resendKey && customerDetails?.email) {
    const reportUrl = `${SITE_URL}/raport-audit/?id=${assessmentId}`;
    const { text, html } = renderUserReportEmail(reportUrl, maturityLabel);
    try {
      await sendEmail(
        resendKey,
        customerDetails.email,
        'Twój raport audytu Ai Pulse',
        text,
        html,
      );
    } catch (e) {
      console.error('[stripe-webhook] user report email failed:', (e as Error).message);
    }
  }

  // Send invoice request email to admin if checkbox ticked
  if (resendKey && wantsInvoice) {
    const amountGross = (amountTotal / 100).toFixed(2);
    const invoiceEmail = renderAdminInvoiceRequest({
      email: customerDetails?.email || '(brak)',
      customerName: customerDetails?.name || null,
      companyName: customerDetails?.name || null,
      vatId,
      amountGross,
      sessionId: fullSession.id,
      paymentIntentId: typeof fullSession.payment_intent === 'string'
        ? fullSession.payment_intent
        : fullSession.payment_intent?.id || null,
      address: addressFormatted,
    });
    try {
      await sendEmail(resendKey, ADMIN_EMAIL, invoiceEmail.subject, invoiceEmail.text, invoiceEmail.html);
    } catch (e) {
      console.error('[stripe-webhook] admin invoice email failed:', (e as Error).message);
    }
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return new Response('method not allowed', { status: 405 });
  }

  // Trim all env values — Supabase UI paste can leave trailing \n which breaks Stripe signature verification.
  const STRIPE_KEY = (Deno.env.get('STRIPE_RESTRICTED_KEY') || Deno.env.get('STRIPE_SECRET_KEY'))?.trim();
  const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')?.trim();
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')?.trim();
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim();
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')?.trim();

  if (!STRIPE_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SERVICE_ROLE) {
    const missing = [
      !STRIPE_KEY && 'STRIPE_RESTRICTED_KEY_or_STRIPE_SECRET_KEY',
      !STRIPE_WEBHOOK_SECRET && 'STRIPE_WEBHOOK_SECRET',
      !SUPABASE_URL && 'SUPABASE_URL',
      !SERVICE_ROLE && 'SUPABASE_SERVICE_ROLE_KEY',
    ].filter(Boolean);
    console.error('[stripe-webhook] missing env vars:', missing.join(', '));
    return new Response('config error', { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('missing signature', { status: 400 });

  const rawBody = await req.text();

  const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion });

  let event: Stripe.Event;
  try {
    // Use async variant for Deno-compatible crypto
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (e) {
    console.error('[stripe-webhook] signature verification failed:', (e as Error).message);
    return new Response('invalid signature', { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(supabase, stripe, RESEND_API_KEY, event);
    } else {
      console.log('[stripe-webhook] unhandled event type:', event.type);
    }
  } catch (e) {
    console.error('[stripe-webhook] handler error:', (e as Error).message);
    // Return 500 so Stripe retries delivery
    return new Response('handler error', { status: 500 });
  }

  return new Response('ok', { status: 200 });
});
