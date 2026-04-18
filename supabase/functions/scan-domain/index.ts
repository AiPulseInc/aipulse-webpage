// supabase/functions/scan-domain/index.ts
// POST /functions/v1/scan-domain
// Body: { domain: string }
// Response: { ok: true, scanned_at, data } | { ok: false, error }
//
// Walidacja per spec, DNSDumpster API call, DMARC supplement via Deno.resolveDns,
// parsing przez ./parse.ts, ZERO secret w logach (per feedback_no_secrets_in_output).

import { parseScanResult } from './parse.ts';

const DOMAIN_REGEX = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ErrCode = 'invalid_domain' | 'timeout' | 'service_unavailable';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function errResponse(code: ErrCode, status = 200): Response {
  // Status 200 nawet dla błędów aplikacyjnych — frontend rozróżnia po `ok` field
  return jsonResponse({ ok: false, error: code }, status);
}

function validateDomain(
  input: string,
): { ok: true; normalized: string } | { ok: false; reason: ErrCode } {
  const normalized = input.trim().toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
  if (normalized.length < 4) return { ok: false, reason: 'invalid_domain' };
  if (!DOMAIN_REGEX.test(normalized)) return { ok: false, reason: 'invalid_domain' };
  if (/^(localhost|127\.|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(normalized)) {
    return { ok: false, reason: 'invalid_domain' };
  }
  if (/\.(local|internal|test|example)$/i.test(normalized)) {
    return { ok: false, reason: 'invalid_domain' };
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(normalized)) return { ok: false, reason: 'invalid_domain' };
  return { ok: true, normalized };
}

async function callDnsdumpster(domain: string, apiKey: string): Promise<Response> {
  const url = `https://api.dnsdumpster.com/domain/${encodeURIComponent(domain)}`;
  return await fetch(url, {
    headers: { 'X-API-Key': apiKey },
    signal: AbortSignal.timeout(7000),
  });
}

async function lookupDmarc(domain: string): Promise<string | null> {
  try {
    const records = await Deno.resolveDns(`_dmarc.${domain}`, 'TXT');
    for (const chunks of records) {
      const joined = Array.isArray(chunks) ? chunks.join('') : String(chunks);
      if (/^v=DMARC1\b/i.test(joined)) return joined;
    }
    return null;
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return errResponse('invalid_domain', 405);
  }

  // LAZY: API key dopiero w handlerze, nie module-level (per feedback_lazy_init).
  const apiKey = Deno.env.get('DNSDUMPSTER_API_KEY');
  if (!apiKey) {
    console.error('[scan-domain] DNSDUMPSTER_API_KEY not set in env');
    return errResponse('service_unavailable');
  }

  let body: { domain?: unknown };
  try {
    body = await req.json();
  } catch {
    return errResponse('invalid_domain');
  }

  if (typeof body.domain !== 'string') return errResponse('invalid_domain');
  const validation = validateDomain(body.domain);
  if (!validation.ok) return errResponse(validation.reason);

  const domain = validation.normalized;
  console.log(`[scan-domain] target: ${domain}`);

  // 1. DNSDumpster API call (z 1 retry na 5xx)
  let dnsdumpsterResp: Response;
  try {
    dnsdumpsterResp = await callDnsdumpster(domain, apiKey);
    if (dnsdumpsterResp.status >= 500) {
      console.warn(`[scan-domain] DNSDumpster ${dnsdumpsterResp.status}, retry in 500ms`);
      await new Promise((r) => setTimeout(r, 500));
      dnsdumpsterResp = await callDnsdumpster(domain, apiKey);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[scan-domain] DNSDumpster fetch failed: ${msg}`);
    return errResponse(msg.includes('timeout') ? 'timeout' : 'service_unavailable');
  }

  if (!dnsdumpsterResp.ok) {
    console.warn(`[scan-domain] DNSDumpster ${dnsdumpsterResp.status} (rate limit or auth)`);
    return errResponse('service_unavailable');
  }

  // deno-lint-ignore no-explicit-any
  let raw: any;
  try {
    raw = await dnsdumpsterResp.json();
  } catch {
    return errResponse('service_unavailable');
  }

  // 2. DMARC supplement via native DNS
  const dmarcRecord = await lookupDmarc(domain);

  // 3. Parse
  const data = parseScanResult(raw, dmarcRecord, domain);

  return jsonResponse({
    ok: true,
    scanned_at: new Date().toISOString(),
    data,
  });
});
