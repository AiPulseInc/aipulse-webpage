-- Contact form submissions z security/ i business/
-- Nie mylić z `public.leads` (inne use case — rozbudowana tabela leadów z NIP/VAT dla samooceny/płatnych).

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('security', 'business')),
  name text not null check (char_length(name) between 2 and 200),
  company text check (company is null or char_length(company) <= 200),
  email text not null check (
    char_length(email) <= 320
    and email ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
  ),
  phone text check (phone is null or char_length(phone) <= 30),
  message text check (message is null or char_length(message) <= 2000),
  consent boolean not null default false
);

create index if not exists contact_submissions_created_idx on public.contact_submissions (created_at desc);
create index if not exists contact_submissions_source_idx on public.contact_submissions (source);

alter table public.contact_submissions enable row level security;
-- brak policy dla anon — INSERT wyłącznie przez edge function z service role
