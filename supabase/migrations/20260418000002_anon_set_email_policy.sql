-- Allow anon to UPDATE email + marketing_consent on assessment row they just inserted.
-- Constraint: only when email IS NULL (one-time set, can't be modified later — prevents tampering across sessions).
-- Email validated by regex + length cap.

create policy assessments_anon_set_email on public.assessments
  for update
  to anon
  using (email is null)
  with check (
    email is not null
    and char_length(email) <= 320
    and email ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
  );
