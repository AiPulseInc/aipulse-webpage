// Integration test of the deployed assessment backend. Secrets stay in memory.
// Production Checkout creation requires explicit opt-in because it is LIVE.
// Every created database row is restricted to one synthetic UUID and cleaned up.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { randomUUID, createHmac } from 'node:crypto';
import { build } from 'esbuild';
import { parse } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const env = parse(await readFile(new URL('.env.local', root)));
const base = env.VITE_SUPABASE_URL;
const functionsBase = process.env.AIPULSE_FUNCTIONS_BASE || base;
const publicKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;
const admin = createClient(base, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const out = new URL(process.env.AIPULSE_TEST_OUTPUT || (process.env.AIPULSE_FUNCTIONS_BASE ? 'output/functional/post-transfer-local-test/' : 'output/functional/post-transfer/'), root);
await mkdir(out, { recursive: true });
const id = randomUUID();
const report = { assessmentId: id, functionsEnvironment: functionsBase === base ? 'deployed-live' : 'local-source-with-stripe-test-keys', startedAt: new Date().toISOString(), checks: [], limits: [] };
const check = (name, ok, details = {}) => {
  report.checks.push({ name, ok, ...details });
  console.log(JSON.stringify({ name, ok, ...details }));
};
async function moduleFrom(path, append = '') {
  const source = await readFile(new URL(path, root), 'utf8');
  const result = await build({ stdin: { contents: source + append, resolveDir: fileURLToPath(new URL('.', new URL(path, root))), loader: 'js' }, bundle: true, platform: 'node', format: 'esm', write: false, define: { 'import.meta.env': JSON.stringify({ VITE_SUPABASE_URL: base, VITE_SUPABASE_PUBLISHABLE_KEY: publicKey }) }, logLevel: 'silent' });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
}
async function request(path, body, extraHeaders = {}) {
  const target = path.startsWith('/functions/') ? functionsBase : base;
  const response = await fetch(target + path, { method: 'POST', headers: { apikey: publicKey, 'Content-Type': 'application/json', ...extraHeaders }, body: JSON.stringify(body), signal: AbortSignal.timeout(30000) });
  const text = await response.text();
  let data; try { data = JSON.parse(text); } catch { data = { text }; }
  return { status: response.status, data };
}
async function stripe(path, method = 'GET', body) {
  const key = env.STRIPE_SECRET_KEY || env.STRIPE_RESTRICTED_KEY;
  if (!key?.startsWith('sk_test_') && !key?.startsWith('rk_test_')) throw Error('Test Stripe key required');
  const response = await fetch('https://api.stripe.com/v1' + path, { method, headers: { Authorization: 'Bearer ' + key, ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}) }, body: body ? new URLSearchParams(body).toString() : undefined, signal: AbortSignal.timeout(30000) });
  return { status: response.status, data: await response.json() };
}
let sessionId;
try {
  const api = await moduleFrom('src/samoocena/api.js', '\nexport { buildAssessmentRow, buildResponsesRows };');
  const { scoreAssessment, getQuestions } = await moduleFrom('src/samoocena/scoring.js');
  const responses = Object.fromEntries(getQuestions().map((q, i) => [q.id, i % 2 ? 2 : 3]));
  const state = { assessmentId: id, responses, profile: { industry: 'IT / Software', size: '11-50', companyName: 'TEST TECHNICZNY - nie klient', dnsScanOptOut: true }, awarenessAnswers: {}, dnsScan: null, startedAt: new Date().toISOString(), completedAt: new Date().toISOString() };
  const scoringResult = scoreAssessment(responses);
  const assessment = api.buildAssessmentRow(state, scoringResult);
  const rows = api.buildResponsesRows(state);
  const insert = await request('/rest/v1/assessments', assessment);
  check('anonymous_assessment_insert', insert.status === 201, { status: insert.status, error: insert.data?.message });
  if (insert.status !== 201) throw Error('Assessment insert failed');
  const answerInsert = await request('/rest/v1/responses', rows);
  check('anonymous_35_responses_insert', answerInsert.status === 201 && rows.length === 35, { status: answerInsert.status, expected: rows.length, error: answerInsert.data?.message });
  const { data: saved, error: readError } = await admin.from('assessments').select('overall_score,questionnaire_version,report_status').eq('id', id).single();
  const { count: countResponses } = await admin.from('responses').select('id', { count: 'exact', head: true }).eq('assessment_id', id);
  check('database_persistence', !readError && Number(saved?.overall_score) === scoringResult.overall.percentage && countResponses === 35, { countResponses, version: saved?.questionnaire_version, score: saved?.overall_score });
  const bench = await request('/rest/v1/rpc/get_benchmark_snapshot', { p_industry: 'it', p_company_size: '11-50' });
  check('benchmark_rpc', bench.status === 200 && Array.isArray(bench.data), { status: bench.status });
  for (const [name, body, expected] of [
    ['create-checkout-session', {}, 'invalid_payload'],
    ['verify-checkout-session', { sessionId: 'invalid' }, 'invalid_session_id'],
    ['send-report', {}, 'report_delivery_via_checkout'],
  ]) {
    const result = await request('/functions/v1/' + name, body);
    check(name + '_invalid_input', result.data?.ok === false && result.data?.error === expected, { status: result.status, code: result.data?.error });
  }
  const missingSignature = await request('/functions/v1/stripe-webhook', {});
  check('webhook_rejects_missing_signature', missingSignature.status === 400 && missingSignature.data?.text === 'missing signature', { status: missingSignature.status });
  const invalidSignature = await request('/functions/v1/stripe-webhook', {}, { 'stripe-signature': 't=1,v1=invalid' });
  check('webhook_rejects_invalid_signature', invalidSignature.status === 400, { status: invalidSignature.status });
  if (functionsBase === base && process.env.AIPULSE_TEST_ALLOW_DEPLOYED_CHECKOUT !== '1') {
    report.limits.push('Production Stripe is LIVE; Checkout creation skipped. Set AIPULSE_TEST_ALLOW_DEPLOYED_CHECKOUT=1 only to create an unpaid synthetic session.');
    throw Error('Production Checkout creation skipped by default');
  }
  const payload = { profile: state.profile, responses, scoringResult, awarenessAnswers: {}, dnsScan: null };
  const checkout = await request('/functions/v1/create-checkout-session', { assessmentId: id, email: 'delivered@resend.dev', marketingConsent: false, payload });
  check('checkout_creation', checkout.status === 200 && checkout.data?.ok === true && checkout.data?.url?.startsWith('https://checkout.stripe.com/'), { status: checkout.status, code: checkout.data?.error });
  if (!checkout.data?.ok) throw Error('Deployed checkout creation failed');
  const { data: payment } = await admin.from('payments').select('status,stripe_session_id,amount_minor,currency').eq('assessment_id', id).single();
  sessionId = payment?.stripe_session_id;
  report.stripeSessionId = sessionId;
  check('checkout_database_state', payment?.status === 'open' && !!sessionId, { status: payment?.status, mode: sessionId?.startsWith('cs_test_') ? 'test' : 'live' });
  const unpaid = await request('/functions/v1/verify-checkout-session', { sessionId });
  check('unpaid_session_rejected', unpaid.data?.ok === true && unpaid.data?.paid === false && !unpaid.data?.payload, { status: unpaid.status, paid: unpaid.data?.paid });
  const { data: stored } = await admin.from('assessments').select('report_status,report_payload').eq('id', id).single();
  check('report_snapshot_saved', stored?.report_status === 'pending_payment' && Object.keys(stored?.report_payload?.responses || {}).length === 35);
  const unpaidRpc = await request('/rest/v1/rpc/get_paid_assessment_report', { p_assessment_id: id });
  check('unpaid_report_rpc_denied', unpaidRpc.status === 200 && unpaidRpc.data === null);
  const legacy = await request('/functions/v1/send-report', { assessmentId: id, email: 'delivered@resend.dev', payload });
  check('legacy_report_delivery_retired', legacy.status === 410 && legacy.data?.error === 'report_delivery_via_checkout', { status: legacy.status });
  const publicPayload = await fetch(base + '/rest/v1/assessments?select=report_payload&id=eq.' + id, { headers: { apikey: publicKey } });
  const publicRows = await publicPayload.json();
  const exposed = Array.isArray(publicRows) && !!publicRows[0]?.report_payload;
  check('unpaid_direct_report_access_denied', !exposed, { finding: exposed ? 'Report payload is readable anonymously before payment using the assessment UUID' : undefined });
  if (!sessionId?.startsWith('cs_test_')) throw Error('Payment session is not test-mode; payment not attempted');
  const remoteSession = await stripe('/checkout/sessions/' + sessionId);
  check('local_test_key_can_read_checkout', remoteSession.status === 200 && remoteSession.data?.livemode === false, { status: remoteSession.status });
  if (remoteSession.status === 200) {
    check('checkout_amount_and_tax', remoteSession.data?.amount_total === 12177 && remoteSession.data?.currency === 'pln', { amountTotal: remoteSession.data?.amount_total, currency: remoteSession.data?.currency });
    await writeFile(new URL('synthetic-report-payload.json', out), JSON.stringify({ ...payload, assessmentId: id, date: '01.11.2026', refNumber: 'QA-POST-TRANSFER' }, null, 2));
    if (process.env.AIPULSE_TEST_COMPLETE_PAYMENT === '1') {
      if (functionsBase !== base) {
        const event = { id: 'evt_qa_unpaid_' + id.replaceAll('-', ''), type: 'checkout.session.completed', data: { object: { id: sessionId, metadata: { assessment_id: id } } } };
        const timestamp = String(Math.floor(Date.now() / 1000));
        const signature = createHmac('sha256', env.STRIPE_WEBHOOK_SECRET.trim()).update(timestamp + '.' + JSON.stringify(event)).digest('hex');
        const ignored = await request('/functions/v1/stripe-webhook', event, { 'stripe-signature': `t=${timestamp},v1=${signature}` });
        const { data: stillPending } = await admin.from('assessments').select('report_status').eq('id', id).single();
        check('signed_completion_of_unpaid_session_does_not_unlock_report', ignored.status === 200 && stillPending?.report_status === 'pending_payment');
      }
      // Same sequence as the official Stripe CLI checkout.session.completed fixture.
      const pm = await stripe('/payment_methods', 'POST', { type: 'card', 'card[token]': 'tok_visa', 'billing_details[email]': 'delivered@resend.dev', 'billing_details[name]': 'TEST TECHNICZNY', 'billing_details[address][country]': 'PL', 'billing_details[address][postal_code]': '00-001' });
      check('stripe_test_payment_method', pm.status === 200, { status: pm.status, code: pm.data?.error?.code });
      if (pm.status === 200) {
        const page = await stripe('/payment_pages/' + sessionId);
        check('stripe_test_payment_page', page.status === 200, { status: page.status });
        const confirm = await stripe('/payment_pages/' + sessionId + '/confirm', 'POST', { payment_method: pm.data.id, expected_amount: '12177' });
        check('stripe_test_payment_confirm', confirm.status === 200, { status: confirm.status, code: confirm.data?.error?.code, message: confirm.data?.error?.message });
        if (confirm.status === 200) {
          if (functionsBase !== base) {
            let event;
            for (let attempt = 0; attempt < 12 && !event; attempt++) {
              if (attempt) await new Promise(resolve => setTimeout(resolve, 1000));
              const events = await stripe('/events?type=checkout.session.completed&limit=20');
              event = events.data?.data?.find(e => e.data?.object?.id === sessionId);
            }
            const completed = await stripe('/checkout/sessions/' + sessionId);
            report.stripePaymentConfirmed = completed.data?.payment_status === 'paid';
            const beforeFulfillment = await request('/functions/v1/verify-checkout-session', { sessionId });
            check('stripe_paid_without_webhook_does_not_expose_payload', beforeFulfillment.data?.paid === false && !beforeFulfillment.data?.payload);
            check('genuine_stripe_test_event_created', !!event);
            if (event) {
              const body = JSON.stringify(event);
              const timestamp = String(Math.floor(Date.now() / 1000));
              const signature = createHmac('sha256', env.STRIPE_WEBHOOK_SECRET.trim()).update(timestamp + '.' + body).digest('hex');
              const replay = await request('/functions/v1/stripe-webhook', event, { 'stripe-signature': `t=${timestamp},v1=${signature}` });
              check('signed_genuine_event_replay', replay.status === 200, { status: replay.status });
              const duplicate = await request('/functions/v1/stripe-webhook', event, { 'stripe-signature': `t=${timestamp},v1=${signature}` });
              check('webhook_duplicate_event_idempotent', duplicate.status === 200, { status: duplicate.status });
            }
          }
          for (let i = 0; i < 12; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const verified = await request('/functions/v1/verify-checkout-session', { sessionId });
            const { data: dbPayment } = await admin.from('payments').select('status,stripe_event_id,wants_invoice').eq('assessment_id', id).single();
            if (verified.data?.paid && dbPayment?.status === 'completed') {
              check('paid_verification_returns_report', Object.keys(verified.data.payload?.responses || {}).length === 35, { reportStatus: verified.data.reportStatus });
              check('stripe_event_processed', !!dbPayment.stripe_event_id && dbPayment.wants_invoice === false);
              report.completedTestPayment = true;
              const paidRpc = await request('/rest/v1/rpc/get_paid_assessment_report', { p_assessment_id: id });
              check('paid_uuid_report_rpc_works', paidRpc.status === 200 && Object.keys(paidRpc.data?.responses || {}).length === 35);
              break;
            }
          }
          if (!report.completedTestPayment) check('paid_webhook_and_report', false, { reason: 'Not confirmed within polling window' });
        }
      }
    } else report.limits.push('Payment confirmation was not requested in this run');
  }
} catch (error) {
  report.error = error.message;
  console.log(JSON.stringify({ error: error.message }));
} finally {
  if (sessionId?.startsWith('cs_test_') && !report.completedTestPayment && !report.stripePaymentConfirmed) {
    const expired = await stripe('/checkout/sessions/' + sessionId + '/expire', 'POST', {});
    check('test_checkout_expired', expired.status === 200, { status: expired.status });
  }
  // Only this run's exact UUID is ever deleted; child rows cascade.
  const { error } = await admin.from('assessments').delete().eq('id', id);
  const leftovers = {};
  for (const table of ['assessments', 'responses', 'payments', 'leads']) {
    const result = await admin.from(table).select('id', { count: 'exact', head: true }).eq(table === 'assessments' ? 'id' : 'assessment_id', id);
    leftovers[table] = result.error ? result.error.code : result.count;
  }
  check('synthetic_database_records_removed', !error && Object.values(leftovers).every(n => n === 0), { leftovers });
  report.finishedAt = new Date().toISOString();
  report.passed = report.checks.filter(c => c.ok).length;
  report.failed = report.checks.filter(c => !c.ok).length;
  await writeFile(new URL('results.json', out), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: report.passed, failed: report.failed, report: fileURLToPath(new URL('results.json', out)) }));
  if (report.failed || report.error) process.exitCode = 1;
}
