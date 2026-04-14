// Lazy-init browser client dla Supabase.
// Zgodnie z feedback_lazy_init — klient inicjalizowany w momencie pierwszego użycia,
// nigdy na poziomie modułu (żeby brak env vars nie wywalał aplikacji przy imporcie).
//
// Używa nowego formatu klucza `sb_publishable_*` z fallbackiem na legacy `VITE_SUPABASE_ANON_KEY`.
// Oba są bezpieczne do expozycji w przeglądarce — dostęp jest ograniczony przez RLS.

import { createClient } from '@supabase/supabase-js';

let clientInstance = null;

export function getSupabaseBrowser() {
  if (clientInstance) return clientInstance;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const publishableKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      '[supabase] Brak VITE_SUPABASE_URL lub VITE_SUPABASE_PUBLISHABLE_KEY w env. ' +
        'Sprawdź .env.local.'
    );
  }

  clientInstance = createClient(url, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-application': 'aipulse-samoocena',
      },
    },
  });

  return clientInstance;
}
