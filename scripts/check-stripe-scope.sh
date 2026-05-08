#!/usr/bin/env bash
# Functional test of STRIPE_RESTRICTED_KEY scopes — does it have what create-checkout-session,
# verify-checkout-session, and stripe-webhook need?
#
# Usage (from project root):
#   bash scripts/check-stripe-scope.sh
#
# Auto-sources .env (or .env.local) z project root. Never prints the key.

set -e

# Locate project root (script dir's parent)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Auto-source env file (try .env, then .env.local)
ENV_FILE=""
if [ -f "$PROJECT_ROOT/.env" ]; then
  ENV_FILE="$PROJECT_ROOT/.env"
elif [ -f "$PROJECT_ROOT/.env.local" ]; then
  ENV_FILE="$PROJECT_ROOT/.env.local"
fi

if [ -n "$ENV_FILE" ]; then
  echo "Sourcing env from: $(basename "$ENV_FILE")"
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
fi

KEY=""
KEY_SOURCE=""
if [ -n "${STRIPE_RESTRICTED_KEY:-}" ]; then
  KEY="$STRIPE_RESTRICTED_KEY"
  KEY_SOURCE="STRIPE_RESTRICTED_KEY"
elif [ -n "${STRIPE_SECRET_KEY:-}" ]; then
  KEY="$STRIPE_SECRET_KEY"
  KEY_SOURCE="STRIPE_SECRET_KEY (fallback)"
fi

if [ -z "$KEY" ]; then
  echo "❌ STRIPE_RESTRICTED_KEY (or STRIPE_SECRET_KEY) not in env or in $ENV_FILE"
  echo "   Add line: STRIPE_RESTRICTED_KEY=rk_test_xxx to your .env file."
  exit 1
fi

KEY_LEN=${#KEY}
KEY_PREFIX="${KEY:0:8}"
echo "Using: $KEY_SOURCE (prefix: $KEY_PREFIX..., length: $KEY_LEN)"
if [ "$KEY_LEN" -lt 50 ]; then
  echo "⚠️  Key looks suspiciously short — real Stripe keys are ~107+ chars."
  echo "   Sprawdź czy w .env wartość po '=' jest pełnym kluczem, nie tylko prefixem."
fi
echo

PRICE_ID="${STRIPE_PRICE_ID:-price_1TUVcPDPaW7KSS0m9qFRfw7q}"
TAX_RATE_ID="${STRIPE_TAX_RATE_ID:-txr_1TUVPPDPaW7KSS0m4WkuBXnm}"

echo "Testing scopes (key prefix: ${KEY:0:7}...)"
echo

probe() {
  local label="$1"
  local method="$2"
  local path="$3"
  local data="$4"

  if [ "$method" = "GET" ]; then
    code=$(curl -s -o /tmp/stripe_probe_body -w "%{http_code}" \
      -H "Authorization: Bearer $KEY" \
      "https://api.stripe.com/v1$path")
  else
    code=$(curl -s -o /tmp/stripe_probe_body -w "%{http_code}" \
      -X "$method" \
      -H "Authorization: Bearer $KEY" \
      -d "$data" \
      "https://api.stripe.com/v1$path")
  fi

  case "$code" in
    200|201)
      echo "✅ $label — $code OK"
      ;;
    401|403)
      msg=$(grep -oE '"message":\s*"[^"]*"' /tmp/stripe_probe_body | head -1)
      echo "❌ $label — $code (missing scope?) $msg"
      ;;
    400)
      # 400 = bad request, but auth was OK (means scope is fine, just wrong test args)
      msg=$(grep -oE '"message":\s*"[^"]*"' /tmp/stripe_probe_body | head -1)
      echo "✅ $label — 400 (scope OK, just expected validation error) $msg"
      ;;
    *)
      echo "⚠️  $label — $code (unexpected)"
      head -c 200 /tmp/stripe_probe_body
      echo
      ;;
  esac
}

echo "=== Read scopes ==="
probe "Products read"        GET "/products?limit=1"
probe "Prices read"           GET "/prices/$PRICE_ID"
probe "Tax Rates read"        GET "/tax_rates/$TAX_RATE_ID"
probe "Customers read"        GET "/customers?limit=1"
probe "Payment Intents read"  GET "/payment_intents?limit=1"
probe "Checkout Sessions read" GET "/checkout/sessions?limit=1"

echo
echo "=== Write scopes (Checkout Sessions create) ==="
# Minimal valid create — uses real price + tax rate, will create test session
probe "Checkout Sessions WRITE" POST "/checkout/sessions" \
  "mode=payment&success_url=https://aipulse.pl/raport-audit/?session_id={CHECKOUT_SESSION_ID}&cancel_url=https://aipulse.pl/&line_items[0][price]=$PRICE_ID&line_items[0][quantity]=1&line_items[0][tax_rates][0]=$TAX_RATE_ID"

echo
echo "Done. Any ❌ above = need to add that scope to Restricted Key in Stripe Dashboard."
rm -f /tmp/stripe_probe_body
