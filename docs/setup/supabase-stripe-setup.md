# Setup: Supabase + Stripe dla Ai Puls Samooceny

Przewodnik krok po kroku — co zrobić, gdzie kliknąć, gdzie wkleić klucze. Zaplanowane na **~60-90 minut** łącznie (Stripe zajmie dłużej z powodu weryfikacji biznesu).

## Przed startem — sprawdź że masz

- [ ] **NIP firmy** + adres siedziby (do Stripe — weryfikacja)
- [ ] **Numer konta bankowego firmowego** (IBAN, do Stripe payouts)
- [ ] **Dowód osobisty / paszport** (Stripe KYC dla reprezentanta)
- [ ] **Firmowy e-mail** (nie `gmail.com`, idealnie `@aipulse.pl`) do obu kont
- [ ] **Menadżer haseł** (Bitwarden / 1Password) — do zapisania kluczy, nie plaintext notatki

Jeśli czegoś brakuje — zacznij od Supabase (nie wymaga weryfikacji), Stripe odpal potem.

---

## Część A — Supabase (20-30 min)

### A1. Założenie konta

1. Wejdź na **https://supabase.com** → „Start your project"
2. Zaloguj się **przez GitHub** (polecane — będzie użyte do integracji Deploy)
3. Po zalogowaniu wylądujesz w **Dashboard**

### A2. Stworzenie projektu

1. Klik **„New project"** (zielony przycisk, prawy górny)
2. Wybierz **Organization** (jeśli nie masz — Supabase utworzy `Personal`)
3. Wypełnij:
   - **Name:** `aipulse-samoocena`
   - **Database Password:** wygeneruj silne hasło (16+ znaków), **zapisz w menadżerze haseł** — nie będzie do odzyskania przez UI
   - **Region:** **`Central EU (Frankfurt) eu-central-1`** — **krytyczne** dla RODO / polskich klientów
   - **Pricing Plan:** `Free` (wystarczy do końca Phase A)
4. Klik **„Create new project"**
5. Czekaj 2-3 min aż się utworzy (zobaczysz splash screen „Setting up project...")

### A3. Kopiowanie kluczy API

Po utworzeniu projektu wylądujesz w jego dashboardzie.

1. Lewy panel → **⚙ Project Settings** (ikona zębatki, na dole)
2. → **API** (w menu Settings)
3. Widzisz sekcję **Project URL** i **Project API keys**. Skopiuj **trzy wartości** do menadżera haseł:

#### A3.1. Publiczne klucze (frontend)

W **Project Settings → API**:

| Pole w UI Supabase | Nazwa zmiennej env | Gdzie użyjesz |
|---|---|---|
| **Project URL** (`https://xxx.supabase.co`) | `VITE_SUPABASE_URL` | frontend (Vite) |
| **Publishable key** (`sb_publishable_...`) | `VITE_SUPABASE_PUBLISHABLE_KEY` | frontend (Vite) — nowy format |
| **anon public** (legacy JWT `eyJ...`) | `VITE_SUPABASE_ANON_KEY` | frontend (Vite) — fallback dla kompatybilności SDK |

#### A3.2. Secret API key (server-only) — NIE używamy legacy service_role

Supabase rekomenduje nowy system **Secret API keys** zamiast legacy `service_role` JWT. Powody:
- **Per-key rotation** — leak jednego klucza nie wywala user sessions
- **Per-key scope** — dedicated keys per Edge Function (dla audit + least privilege)
- **Kompromitacja lokalizowana** — kasujesz ten jeden klucz, inne działają dalej

**W UI:**

1. **Project Settings → API Keys** → zakładka **„Secret API keys"** (nie „Project API keys" ze starym `service_role`)
2. Klik **„Create new secret key"**
3. Wypełnij:
   - **Name:** `edge-functions` (na start jeden, później split per-funkcję: `stripe-webhook`, `generate-report`, itd.)
   - **Scope:** zostaw default (full access) na Phase A
4. **Create** → skopiuj wartość (`sb_secret_xxxxxxxxx`) — pokazywana **TYLKO RAZ**, zapisz w menadżerze haseł
5. Do env: `SUPABASE_SECRET_KEY=sb_secret_...`

**Uwaga:** jeśli w panelu widzisz banner „This key has the ability to bypass Row Level Security. Prefer using Secret API keys instead." przy starym `service_role` — to właśnie o tym. Nie używamy legacy service_role w nowym kodzie.

**Dlaczego NIGDY do frontendu:** omija RLS (Row Level Security), daje pełny dostęp do bazy. Exposed = data breach.

### A4. Instalacja Supabase CLI (do migracji SQL)

```bash
# macOS (masz Homebrew):
brew install supabase/tap/supabase

# Sprawdź:
supabase --version    # oczekiwana: 2.x.x
```

### A5. Login + link projektu

W terminalu, w katalogu projektu:

```bash
cd /Users/mk/code-sandbox/toolbox-project/aipulse-webpage

# Login — otworzy się przeglądarka, autoryzuj
supabase login

# Link do projektu — potrzebne project-ref (z URL projektu, np. "abcdefghijklm")
# Project ref znajdziesz w Dashboard → Project Settings → General → Reference ID
supabase link --project-ref <YOUR_PROJECT_REF>
```

Po tym CLI będzie wiedział, do którego projektu pushować migracje.

### A6. Co zrobimy w CLI później (nie teraz — informacyjnie)

```bash
# Po tym jak A5 z planu implementacji będzie gotowe:
supabase db push              # apply migracji SQL
supabase functions deploy     # deploy Edge Functions
supabase secrets set KEY=val  # ustawianie sekretów dla Edge Functions
```

**Supabase gotowe. Przejdź do Części B lub odpocznij.**

---

## Część B — Stripe (30-60 min — weryfikacja może zająć)

### B1. Założenie konta

1. Wejdź na **https://dashboard.stripe.com/register**
2. Podaj firmowy e-mail + silne hasło
3. Wybierz **Kraj: Poland** (❗ krytyczne — ustala obsługiwane metody płatności)
4. Potwierdź e-mail
5. Po pierwszym zalogowaniu jesteś od razu w **Test mode** (widać toggle `Test mode` w górze) — możesz już pracować z kluczami testowymi

### B2. Aktywacja konta (do prawdziwych płatności — możesz zrobić później)

Bez tego zostajesz w Test mode — **to jest OK na Phase A**. Aktywuj zanim pójdziesz live z Phase B (Stripe paywall 149 zł).

1. Dashboard → top banner „Activate payments" lub lewy panel → **Balance** → „Activate your account"
2. Wypełnij formularz (zajmie ~15-20 min):
   - **Business type:** `Company` → `Sp. z o.o.` (lub `JDG` jeśli jednoosobowa)
   - **Business details:** NIP, adres, numer rejestrowy
   - **Representative:** Twoje dane osobowe + dowód (KYC)
   - **Bank account:** IBAN firmowy dla payouts
3. Stripe weryfikuje 1-3 dni robocze. Do tego czasu — Test mode.

### B3. Test mode vs Live mode — ważne rozróżnienie

- **Test mode** (domyślny): klucze `sk_test_...` / `pk_test_...`, żadne prawdziwe pieniądze, testowe karty (`4242 4242 4242 4242`)
- **Live mode**: klucze `sk_live_...` / `pk_live_...`, prawdziwe transakcje

**Dla Phase A pracujemy w Test mode.** Przełączaj się przez toggle w lewym górnym rogu Dashboard.

### B4. Kopiowanie kluczy (Test mode)

1. Dashboard → upewnij się że toggle pokazuje **Test mode** (pomarańczowa plakietka)
2. Lewy panel → **Developers** → **API keys**
3. Zobaczysz dwa klucze:

| Pole w UI Stripe | Nazwa zmiennej env | Gdzie użyjesz |
|---|---|---|
| **Publishable key** (`pk_test_...`) | `VITE_STRIPE_PUBLISHABLE_KEY` | frontend (Vite) — bezpieczny do exposé |
| **Secret key** (`sk_test_...`, klik „Reveal test key") | `STRIPE_SECRET_KEY` | **TYLKO** Edge Functions, NIGDY frontend |

**Webhook signing secret** (`whsec_...`) utworzysz w kroku B7, po deploy Edge Functions.

### B5. Włączenie polskich metod płatności (BLIK, Przelewy24)

❗ **Nie włączą się same** nawet z `automatic_payment_methods`. Trzeba ręcznie:

1. Dashboard → **Settings** (ikona zębatki, dół lewego panelu) → **Payment methods**
2. Znajdź sekcję **Payment methods** → zakładka **„Test"** (lewy górny, jeśli jesteś w Test mode)
3. **Enable BLIK** (klik „Turn on") — status powinien zmienić się na `Enabled`
4. **Enable Przelewy24** — tak samo
5. Zostaw **Card** włączone (Visa/Mastercard — default)
6. **Apple Pay / Google Pay** — opcjonalne, można włączyć dla mobilnych klientów

**BLIK/Przelewy24 w Live mode**: wymaga aktywacji konta (B2) + pozytywnej weryfikacji biznesu przez Stripe. Czasem trzeba osobno napisać do supportu jeśli nie aktywują się automatycznie.

### B6. Utworzenie produktu „Raport rozszerzony"

Ten krok jest opcjonalny dla samego setupu — `create-checkout-session` Edge Function może tworzyć produkt dynamicznie. Ale warto mieć zdefiniowany produkt dla porządku w Dashboardzie.

1. Dashboard → **Products** (lewy panel) → **Add product** (zielony, prawy górny)
2. Wypełnij:
   - **Name:** `Raport samooceny cyberbezpieczeństwa — wersja audytowa`
   - **Description:** „10-stronicowy raport z mapowaniem CIS Controls / NIST CSF / NIS2 / RODO"
   - **Pricing model:** `Standard pricing` → `One-time`
   - **Price:** `149.00 PLN`
   - **Tax behavior:** `Exclusive` (cena + VAT 23% naliczany osobno) — sprawdź z księgową, zależnie czy jesteś VAT-owcem
3. **Save product**
4. Zapisz **Price ID** (`price_1PxYz...`) — użyjesz w Edge Function `create-checkout-session`

### B7. Webhook (robimy PO deploy Edge Functions — nie teraz)

Webhook Stripe → Supabase Edge Function `stripe-webhook` wymaga publicznego HTTPS endpointu. Zrobisz to po deploy funkcji. Procedura:

1. Supabase Dashboard → Edge Functions → `stripe-webhook` → zobaczysz URL: `https://<ref>.supabase.co/functions/v1/stripe-webhook`
2. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
3. **Endpoint URL:** wklej URL z Supabase
4. **Events to send:** wybierz:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
5. **Add endpoint** → skopiuj **Signing secret** (`whsec_...`) → zapisz jako `STRIPE_WEBHOOK_SECRET`

**Stripe gotowe (Test mode).**

---

## Część C — Wklejanie kluczy do `.env.local`

### C1. Utwórz `.env.local` w katalogu projektu

```bash
cd /Users/mk/code-sandbox/toolbox-project/aipulse-webpage
touch .env.local
```

### C2. Wklej wszystkie klucze (szablon do wypełnienia)

```bash
# =============================================
# Frontend (prefix VITE_ — exposed do przeglądarki)
# =============================================
VITE_SUPABASE_URL=https://XXXXXXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_XXXXXXXXXXX
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXX

# =============================================
# Server-only (Edge Functions — NIGDY frontend)
# =============================================
# Używamy nowego Secret API key (sb_secret_*) zamiast legacy service_role
SUPABASE_SECRET_KEY=sb_secret_XXXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXX  # puste na razie, wypełnij po B7
RESEND_API_KEY=re_XXXXXXXXXXX            # puste na razie, jeśli Resend jeszcze nieskonfigurowany

# =============================================
# Konfig aplikacji
# =============================================
REPORT_BUCKET_NAME=reports
```

### C3. Sprawdź `.gitignore`

```bash
grep -E "^\.env" .gitignore
```

Powinno zwrócić co najmniej `.env*.local` albo `.env.local`. Jeśli nie — **dopisz** przed commitem:

```bash
echo ".env.local" >> .gitignore
```

❗ **`.env.local` NIE IDZIE do gita. Nigdy.**

---

## Część D — Secrets w Supabase (dla Edge Functions)

Edge Functions **nie widzą** `.env.local` — to plik lokalny dla dev servera. Produkcyjnie musisz wrzucić secrets do Supabase przez CLI:

```bash
cd /Users/mk/code-sandbox/toolbox-project/aipulse-webpage

# Ustaw secrets (server-only klucze)
supabase secrets set STRIPE_SECRET_KEY="sk_test_XXX"
supabase secrets set STRIPE_WEBHOOK_SECRET="whsec_XXX"
supabase secrets set RESEND_API_KEY="re_XXX"
supabase secrets set REPORT_BUCKET_NAME="reports"

# Sprawdź listę (zwraca nazwy, nie wartości — bezpiecznie)
supabase secrets list
```

**Nie ustawiaj** `SUPABASE_URL` — jest **automatycznie dostępny** w Edge Functions (Supabase wstrzykuje jako `Deno.env.get('SUPABASE_URL')`).

**`SUPABASE_SECRET_KEY` ustaw** przez `supabase secrets set SUPABASE_SECRET_KEY="sb_secret_..."` — nowy system nie wstrzykuje automatycznie (w odróżnieniu od legacy service_role).

**Nie ustawiaj** `VITE_*` — te są tylko dla frontendu.

---

## Część E — Vercel (kiedy deployujemy produkcję)

Tego nie robisz teraz, ale pamiętaj — po deploy na Vercel:

1. Vercel Dashboard → projekt `aipulse-webpage` → **Settings** → **Environment Variables**
2. Dodaj **tylko frontendowe** zmienne (`VITE_*`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
3. Environment: **Production** i **Preview** (obie)
4. Redeploy żeby zmienne weszły

Backendowe klucze (`STRIPE_SECRET_KEY` itp.) **nie idą do Vercel** — są w Supabase Secrets.

---

## Checklist finalna

Po tym guide'ie masz:

- [ ] Konto Supabase + projekt w `eu-central-1` (Frankfurt)
- [ ] 3 klucze Supabase zapisane w menadżerze haseł
- [ ] Supabase CLI zainstalowany, zalogowany, zlinkowany z projektem
- [ ] Konto Stripe (Test mode — Live aktywacja opcjonalna)
- [ ] 2 klucze Stripe (publishable + secret) zapisane
- [ ] BLIK + Przelewy24 + Card włączone w Test mode
- [ ] Produkt „Raport rozszerzony 149 zł" utworzony (opcjonalne)
- [ ] `.env.local` w projekcie z kluczami
- [ ] `.gitignore` obejmuje `.env.local`
- [ ] Supabase CLI wie że tam pójdą secrets (komendy z Części D — do wykonania gdy będziemy deploy'ować Edge Functions)

## Co zostało do zrobienia POTEM (nie teraz)

1. **Migracje SQL** (A5 z planu implementacji) — po tym setupie uruchomimy `supabase db push`
2. **Webhook Stripe** (B7) — po deploy `stripe-webhook` Edge Function
3. **Aktywacja Live mode Stripe** — tuż przed uruchomieniem Phase B
4. **Vercel env vars** — przy deploy production

---

## Pomocne linki

- Supabase docs: https://supabase.com/docs
- Supabase CLI ref: https://supabase.com/docs/reference/cli
- Stripe dla Polski (BLIK/P24): https://stripe.com/docs/payments/blik, https://stripe.com/docs/payments/p24
- Stripe test cards: https://stripe.com/docs/testing (karta: `4242 4242 4242 4242`, BLIK: `777 123`, data przyszła, CVC dowolne)

## Troubleshooting

**„Stripe pokazuje mi tylko kartę w checkout — gdzie BLIK?"**
→ Upewnij się że (a) Test mode jest włączony, (b) B5 wykonany, (c) checkout session jest tworzona z `automatic_payment_methods: { enabled: true }` (bez tego trzeba ręcznie wymienić `payment_method_types: ['card', 'blik', 'p24']`).

**„Supabase CLI mówi `not logged in`"**
→ `supabase login` powinno otworzyć przeglądarkę. Jeśli nie — dopełnij `--browser false` i wklej URL ręcznie.

**„Zgubiłem secret API key (sb_secret_*)"**
→ Supabase Dashboard → **API Keys** → znajdź swój secret key → **Revoke** (starego) → **Create new secret key** (nowy). W odróżnieniu od legacy service_role, revocation nie wywala user sessions, bo anon/publishable działają niezależnie.

**„Widzę w UI stary service_role z banerem 'Prefer Secret API keys'"**
→ Ignorujemy. Używamy nowego Secret API keys (A3.2). Legacy service_role nie używamy w nowym kodzie.

**„Stripe wymaga aktywacji konta żeby zobaczyć Live keys"**
→ Zostań w Test mode do czasu zakończenia weryfikacji (1-3 dni robocze).
