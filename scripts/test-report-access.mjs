import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const source = (await readFile(new URL('src/raport/app.js', root), 'utf8')).replace(/main\(\);\s*$/, 'export { getData };');
const result = await build({
  stdin: { contents: source, resolveDir: fileURLToPath(new URL('src/raport/', root)), loader: 'js' },
  bundle: true, format: 'esm', platform: 'node', write: false, loader: { '.css': 'empty' },
  plugins: [{ name: 'mock-network', setup(build) {
    build.onResolve({ filter: /(?:samoocena\/api|\/ga)\.js$/ }, args => ({ path: args.path, namespace: 'mock' }));
    build.onLoad({ filter: /.*/, namespace: 'mock' }, args => ({ contents: args.path.endsWith('/ga.js')
      ? 'export function initGA() {}'
      : 'export const fetchReportPayload=(id)=>globalThis.reportTest.fetch(id); export const verifyCheckoutSession=(id)=>globalThis.reportTest.verify(id);', loader: 'js' }));
  } }],
});
globalThis.document = { getElementById: () => ({ innerHTML: '' }) };
globalThis.window = { location: { search: '' } };
globalThis.localStorage = { getItem() { throw Error('Payment authorization must never use localStorage'); } };
const { getData } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
const id = 'baf688aa-6f37-488a-a7c4-6465b5147f46';
const payload = { profile: { companyName: 'Paid fixture' }, responses: { A1: 3 } };
function context(search, fetch, verify) {
  window.location.search = search;
  globalThis.reportTest = { fetch: fetch || (() => { throw Error('Unexpected report read'); }), verify: verify || (() => { throw Error('Unexpected Stripe read'); }) };
}
test('unpaid UUID cannot display a report or fall back to browser storage', async () => {
  context('?id=' + id, async () => ({ ok: false, error: 'report_unavailable' }));
  assert.equal(await getData(), null);
});
test('browser storage without a verified link cannot display a report', async () => {
  context('');
  assert.equal(await getData(), null);
});
test('invalid payment links do not fall back to an assessment UUID', async () => {
  context('?session_id=invalid&id=' + id);
  assert.ok((await getData()).__paymentError);
});
test('a failed Stripe lookup does not fall back to another report path', async () => {
  context('?session_id=cs_test_invalid&id=' + id, undefined, async () => ({ ok: false }));
  assert.ok((await getData()).__paymentError);
});
test('a paid UUID link uses the verified RPC payload', async () => {
  context('?id=' + id, async requested => {
    assert.equal(requested, id);
    return { ok: true, payload };
  });
  assert.deepEqual(await getData(), { ...payload, assessmentId: id });
});
test('a paid and fulfilled Stripe session displays the returned report', async () => {
  context('?session_id=cs_test_valid', undefined, async () => ({ ok: true, paid: true, assessmentId: id, payload }));
  assert.deepEqual(await getData(), { ...payload, assessmentId: id });
});
test('the public example remains available without any paid-report lookup', async () => {
  context('?example=1');
  assert.ok((await getData()).profile);
});
