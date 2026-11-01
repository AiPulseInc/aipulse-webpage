// Runtime harness: actual function handlers, no deployed configuration changes.
const serve = Deno.serve.bind(Deno);
const handlers = new Map<string, (req: Request) => Response | Promise<Response>>();
let importing = '';
(Deno as any).serve = (handler: (req: Request) => Response | Promise<Response>) => handlers.set(importing, handler);
const originalFetch = globalThis.fetch;
globalThis.fetch = async (...args: Parameters<typeof fetch>) => {
  const url = String(args[0]);
  if (url === 'https://api.resend.com/emails' && args[1]?.method === 'POST') {
    const body = JSON.parse(String(args[1].body));
    if (body.to.some((email: string) => email !== 'delivered@resend.dev')) throw Error('Only Resend test sink allowed');
    const response = await originalFetch(...args);
    const data = await response.clone().json();
    console.log(JSON.stringify({ test_email_api_status: response.status, test_email_id: data.id, error_code: data.name }));
    return response;
  }
  return originalFetch(...args);
};
for (const name of ['create-checkout-session', 'verify-checkout-session', 'stripe-webhook', 'send-report']) {
  importing = name;
  await import(new URL('../supabase/functions/' + name + '/index.ts', import.meta.url).href);
}
serve({ hostname: '127.0.0.1', port: 8088 }, req => {
  const name = new URL(req.url).pathname.split('/').at(-1)!;
  return handlers.get(name)?.(req) || new Response('not found', { status: 404 });
});
