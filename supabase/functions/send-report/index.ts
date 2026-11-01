// Retired unpaid delivery path. Reports are sent by the signed Stripe webhook.
// Never accept a browser-supplied snapshot or email to overwrite a paid report.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application',
};

Deno.serve((req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  return new Response(JSON.stringify({ ok: false, error: 'report_delivery_via_checkout' }), {
    status: 410,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
});
