-- UUID links expose only a paid snapshot, never anonymous table SELECT.
begin;

create or replace function public.get_paid_assessment_report(p_assessment_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select a.report_payload
  from public.assessments as a
  where a.id = p_assessment_id
    and a.report_status in ('paid', 'ready')
    and exists (
      select 1 from public.payments as p
      where p.assessment_id = a.id and p.status = 'completed'
    );
$$;

revoke all on function public.get_paid_assessment_report(uuid) from public;
grant execute on function public.get_paid_assessment_report(uuid) to anon, authenticated, service_role;

drop policy if exists assessments_anon_select_by_id on public.assessments;
drop policy if exists assessments_anon_set_email on public.assessments;
revoke select, update, delete on table public.assessments from public, anon, authenticated;

-- Table REVOKE does not remove separately granted column privileges.
do $$
declare column_list text;
begin
  select string_agg(quote_ident(attname), ', ' order by attnum) into column_list
  from pg_attribute
  where attrelid = 'public.assessments'::regclass and attnum > 0 and not attisdropped;
  execute format('revoke select (%s), update (%s) on public.assessments from public, anon, authenticated', column_list, column_list);
end;
$$;

notify pgrst, 'reload schema';
commit;
