// supabase/functions/scan-domain/parse.ts
// Port z aipulse-dns-demo/parse.mjs — DNSDumpster raw → ScanData.
// Zwalidowany na 5 sample domenach w Phase 0 demo.

import { inferProvider } from './providers.ts';

export type Subdomain = { hostname: string; a: string[] };
export type MxRecord = { priority: number; host: string; provider: string | null };
export type DmarcInfo = { record: string; policy: 'none' | 'quarantine' | 'reject' };
export type ScanData = {
  domain: string;
  subdomains: Subdomain[];
  mx: MxRecord[];
  txt: { spf: string | null; dmarc: DmarcInfo | null };
  ns: string[];
  summary: {
    subdomain_count: number;
    has_spf: boolean;
    spf_strict: boolean;
    has_dmarc: boolean;
    dmarc_enforcing: boolean;
    mail_provider: string | null;
  };
};

// DNSDumpster zwraca TXT records z literal cudzysłowami w środku stringa
// (artifact serializacji DNS) — strip leading/trailing quotes.
function cleanTxt(raw: unknown): string {
  return String(raw).trim().replace(/^"|"$/g, '').trim();
}

function parseSpf(txtRecords: unknown[]): { raw: string | null; strict: boolean } {
  const cleaned = txtRecords.map(cleanTxt);
  const spf = cleaned.find((t) => /^v=spf1\b/i.test(t));
  if (!spf) return { raw: null, strict: false };
  const strict = /[-]all\s*$/.test(spf.trim());
  return { raw: spf, strict };
}

// MX `host` field z DNSDumpster ma format "10 mail.example.com" — priority jako prefix.
function parseMxHost(raw: unknown): { priority: number; host: string } {
  const match = String(raw || '').trim().match(/^(\d+)\s+(.+)$/);
  if (match) {
    return { priority: parseInt(match[1], 10), host: match[2].trim() };
  }
  return { priority: 0, host: String(raw || '').trim() };
}

function parseDmarc(dmarcRecord: string | null): DmarcInfo | null {
  if (!dmarcRecord) return null;
  if (!/v=DMARC1\b/i.test(dmarcRecord)) return null;
  const policyMatch = dmarcRecord.match(/\bp=(none|quarantine|reject)\b/i);
  const policy = (policyMatch ? policyMatch[1].toLowerCase() : 'none') as DmarcInfo['policy'];
  return { record: dmarcRecord, policy };
}

export function parseScanResult(
  // deno-lint-ignore no-explicit-any
  raw: any,
  dmarcRecord: string | null,
  queriedDomain: string,
): ScanData {
  const aRecs = raw.a || [];
  // deno-lint-ignore no-explicit-any
  const subdomains: Subdomain[] = aRecs.map((r: any) => ({
    hostname: r.host,
    // deno-lint-ignore no-explicit-any
    a: (r.ips || []).map((i: any) => i.ip),
  }));

  const mxRecs = raw.mx || [];
  // deno-lint-ignore no-explicit-any
  const mxFlat = mxRecs.map((r: any) => parseMxHost(r.host));
  const mxHosts = mxFlat.map((m: { host: string }) => m.host);
  const provider = inferProvider(mxHosts, queriedDomain.toLowerCase());
  const mx: MxRecord[] = mxFlat.map((m: { priority: number; host: string }) => ({
    ...m,
    provider,
  }));

  // deno-lint-ignore no-explicit-any
  const ns: string[] = (raw.ns || []).map((r: any) => r.host);

  const txt = raw.txt || [];
  const spfParsed = parseSpf(txt);
  const dmarcParsed = parseDmarc(dmarcRecord);

  const summary = {
    subdomain_count: subdomains.length,
    has_spf: !!spfParsed.raw,
    spf_strict: spfParsed.strict,
    has_dmarc: !!dmarcParsed,
    dmarc_enforcing: dmarcParsed ? dmarcParsed.policy !== 'none' : false,
    mail_provider: provider,
  };

  return {
    domain: queriedDomain,
    subdomains,
    mx,
    txt: { spf: spfParsed.raw, dmarc: dmarcParsed },
    ns,
    summary,
  };
}
