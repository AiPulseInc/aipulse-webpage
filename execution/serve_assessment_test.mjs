// Runs the unchanged Edge Function sources locally with private test credentials.
import { parse } from 'dotenv';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const env = parse(await readFile(new URL('.env.local', root)));
if (!(env.STRIPE_RESTRICTED_KEY || env.STRIPE_SECRET_KEY)?.startsWith('rk_test_') && !(env.STRIPE_RESTRICTED_KEY || env.STRIPE_SECRET_KEY)?.startsWith('sk_test_')) throw Error('Test keys required');
const child = spawn('npx', ['--yes', 'deno', 'run', '--node-modules-dir=none', '--no-lock', '--allow-env', '--allow-net', '--allow-read', fileURLToPath(new URL('serve_assessment_test.ts', import.meta.url))], {
  cwd: fileURLToPath(root), stdio: 'inherit', env: { ...process.env, ...env, npm_config_cache: '/private/tmp/aipulse-npm-cache', DENO_DIR: '/private/tmp/aipulse-deno-cache', SUPABASE_URL: env.VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SECRET_KEY, SITE_URL: 'https://aipulse.pl', ADMIN_EMAIL: 'delivered@resend.dev' },
});
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
child.on('exit', code => process.exit(code || 0));
