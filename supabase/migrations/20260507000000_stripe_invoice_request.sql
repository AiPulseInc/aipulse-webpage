-- Migration: stripe_invoice_request
-- Description: Add per-transaction flag for VAT invoice request (Stripe Checkout custom_field).
-- Used by webhook to dispatch internal "fakture VAT request" notification email after payment completes.

alter table public.payments
  add column if not exists wants_invoice boolean not null default false;

comment on column public.payments.wants_invoice is
  'True if buyer ticked "Poproszę o fakturę VAT" via Stripe Checkout custom_field. Webhook dispatches notification email to admin when set.';
