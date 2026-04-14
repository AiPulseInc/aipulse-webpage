// Smoke test: anonymous INSERT flow dla samooceny
// Uruchomienie: node scripts/test-supabase-insert.mjs
// Używa publishable key (jak frontend) — weryfikuje że RLS pozwala anon na insert
// completed assessment + batch responses zgodnie z polityką from migracji.

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const url = process.env.VITE_SUPABASE_URL;
const key =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('[test] Brak VITE_SUPABASE_URL lub VITE_SUPABASE_PUBLISHABLE_KEY w .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

const assessmentId = randomUUID();
const now = new Date().toISOString();

const assessment = {
  id: assessmentId,
  questionnaire_version: '2026-01',
  locale: 'pl',
  industry: 'it',
  company_size: '11-50',
  started_at: now,
  completed_at: now,
  overall_score: 58.33,
  score_people: 67.0,
  score_data: 33.0,
  score_systems: 58.0,
  score_governance: 42.0,
  score_compliance: 71.0,
  maturity_level: 'developing',
  report_status: 'none',
};

const responses = [
  { assessment_id: assessmentId, question_id: 'A1', category_key: 'people', option_id: 'A1_opt_2', score: 2, weight: 1.0, critical: false },
  { assessment_id: assessmentId, question_id: 'B1', category_key: 'data', option_id: 'B1_opt_0', score: 0, weight: 2.0, critical: true },
  { assessment_id: assessmentId, question_id: 'C1', category_key: 'systems', option_id: 'C1_opt_3', score: 3, weight: 2.0, critical: true },
];

console.log(`\n[test] Anon INSERT flow, assessment_id=${assessmentId}\n`);

const { error: aErr } = await supabase.from('assessments').insert(assessment);
if (aErr) {
  console.error('  ✗ assessments insert failed:', aErr.message);
  process.exit(1);
}
console.log('  ✓ assessments row inserted');

const { error: rErr } = await supabase.from('responses').insert(responses);
if (rErr) {
  console.error('  ✗ responses insert failed:', rErr.message);
  process.exit(1);
}
console.log(`  ✓ ${responses.length} responses rows inserted`);

// Try SELECT — should be blocked by RLS (no select policy for anon)
const { data: selectData, error: selectErr } = await supabase
  .from('assessments')
  .select('id')
  .eq('id', assessmentId);
if (selectErr) {
  console.log(`  ✓ SELECT blocked by RLS: ${selectErr.message}`);
} else if (!selectData || selectData.length === 0) {
  console.log('  ✓ SELECT returned 0 rows (RLS working — anon cannot read)');
} else {
  console.error('  ✗ SELECT returned data — RLS is broken!', selectData);
  process.exit(1);
}

// Try benchmark RPC
const { data: benchData, error: benchErr } = await supabase.rpc(
  'get_benchmark_snapshot',
  { p_industry: 'it', p_company_size: '11-50' }
);
if (benchErr) {
  console.error('  ✗ benchmark RPC failed:', benchErr.message);
  process.exit(1);
}
console.log(`  ✓ benchmark RPC returned ${benchData?.length || 0} rows:`, benchData);

console.log('\n[test] All checks passed.\n');
