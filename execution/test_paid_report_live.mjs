// Live API regression: one synthetic UUID, no Stripe calls, exact-ID cleanup.
import { parse } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
const root = new URL('../', import.meta.url);
const env = parse(await readFile(new URL('.env.local', root)));
const base = env.VITE_SUPABASE_URL;
const publicKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;
const admin = createClient(base, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
const id = randomUUID();
const checks = [];
function check(name, ok, status) { checks.push({ name, ok, ...(status ? { status } : {}) }); console.log(JSON.stringify(checks.at(-1))); }
async function api(path, method = 'GET', body) {
  const r = await fetch(base + path, { method, headers: { apikey: publicKey, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const text = await r.text();
  return { status: r.status, data: text ? JSON.parse(text) : null };
}
const payload = { marker: id, profile: { companyName: 'QA paid access - synthetic' } };
const rpc = () => api('/rest/v1/rpc/get_paid_assessment_report', 'POST', { p_assessment_id: id });
try {
  const insert = await api('/rest/v1/assessments', 'POST', { id, questionnaire_version: 'qa-paid-access', locale: 'pl', industry: 'it', company_size: '11-50', started_at: new Date().toISOString(), completed_at: new Date().toISOString(), overall_score: 50, score_people: 50, score_data: 50, score_systems: 50, score_governance: 50, score_compliance: 50, maturity_level: 'developing', report_status: 'none' });
  check('live_anonymous_submission_works', insert.status === 201, insert.status);
  if (insert.status !== 201) throw Error('Fixture insert failed');
  const { error } = await admin.from('assessments').update({ report_status: 'pending_payment', report_payload: payload }).eq('id', id);
  if (error) throw error;
  let result = await rpc();
  check('live_unpaid_rpc_denied', result.status === 200 && result.data === null, result.status);
  result = await api('/rest/v1/assessments?select=report_payload&id=eq.' + id);
  check('live_original_direct_read_exploit_blocked', result.status === 403, result.status);
  result = await api('/rest/v1/assessments?select=id&limit=0');
  check('live_table_listing_blocked', result.status === 403, result.status);
  result = await api('/rest/v1/assessments?id=eq.' + id, 'PATCH', { report_status: 'paid' });
  check('live_anonymous_payment_status_tampering_blocked', result.status === 403, result.status);
  result = await api('/functions/v1/send-report', 'POST', { assessmentId: id, email: 'delivered@resend.dev', payload: { marker: 'forged' } });
  check('live_legacy_report_overwrite_blocked', result.status === 410, result.status);
  await admin.from('assessments').update({ report_status: 'paid' }).eq('id', id);
  result = await rpc();
  check('live_paid_status_without_payment_denied', result.status === 200 && result.data === null);
  // Database authorization fixture only: this is not a Stripe transaction.
  const payment = await admin.from('payments').insert({ assessment_id: id, provider: 'qa_regression', product_code: 'qa_report', status: 'completed', amount_minor: 12177, currency: 'pln' });
  if (payment.error) throw payment.error;
  result = await rpc();
  check('live_paid_report_link_works', result.status === 200 && result.data?.marker === id);
  result = await api('/rest/v1/assessments?select=report_payload&id=eq.' + id);
  check('live_paid_report_cannot_be_listed_or_read_as_table', result.status === 403);
  await admin.from('payments').update({ status: 'refunded' }).eq('assessment_id', id);
  result = await rpc();
  check('live_refunded_report_denied', result.status === 200 && result.data === null);
} catch (error) {
  check('unexpected_test_error', false);
  console.error(error.message);
} finally {
  const removed = await admin.from('assessments').delete().eq('id', id);
  const leftovers = await admin.from('assessments').select('id', { head: true, count: 'exact' }).eq('id', id);
  check('live_synthetic_fixture_removed', !removed.error && !leftovers.error && leftovers.count === 0);
  await mkdir(new URL('output/functional/paid-report-fix/', root), { recursive: true });
  await writeFile(new URL('output/functional/paid-report-fix/live-regression.json', root), JSON.stringify({ assessmentId: id, checks }, null, 2));
  if (checks.some(c => !c.ok)) process.exitCode = 1;
}
