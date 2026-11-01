// Test the migration and role privileges in one rolled-back transaction.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
const root = new URL('../', import.meta.url);
const migration = (await readFile(new URL('supabase/migrations/20261101000000_paid_report_access.sql', root), 'utf8')).replace(/^begin;$/m, '').replace(/^commit;$/m, '');
const id = randomUUID();
const fakeId = randomUUID();
const sql = `begin;
${migration}
create temporary table qa_report_access (name text, ok boolean);
grant insert,select on qa_report_access to anon,authenticated;
insert into public.assessments(id,questionnaire_version,locale,industry,company_size,started_at,completed_at,overall_score,score_people,score_data,score_systems,score_governance,score_compliance,maturity_level,report_status,report_payload)
values('${id}','qa-rollback','pl','it','11-50',now(),now(),50,50,50,50,50,50,'developing','pending_payment','{"test":"paid-gate"}');
set local role anon;
insert into qa_report_access values('unpaid_rpc_denied', public.get_paid_assessment_report('${id}') is null);
do $$ begin
  begin perform report_payload from public.assessments where id='${id}'; raise exception 'Direct SELECT unexpectedly allowed'; exception when insufficient_privilege then null; end;
  begin update public.assessments set report_status='paid' where id='${id}'; raise exception 'UPDATE unexpectedly allowed'; exception when insufficient_privilege then null; end;
end $$;
insert into qa_report_access values('anonymous_table_select_and_update_denied', true);
reset role;
update public.assessments set report_status='paid' where id='${id}';
set local role anon;
insert into qa_report_access values('forged_paid_status_without_payment_denied',public.get_paid_assessment_report('${id}') is null);
reset role;
insert into public.payments(assessment_id,status,amount_minor,currency) values('${id}','completed',12177,'pln');
set local role anon;
insert into qa_report_access values('paid_rpc_returns_only_requested_payload',public.get_paid_assessment_report('${id}')='{"test":"paid-gate"}'::jsonb);
insert into qa_report_access values('unknown_uuid_denied',public.get_paid_assessment_report('${fakeId}') is null);
insert into qa_report_access values('null_uuid_cannot_list_reports',public.get_paid_assessment_report(null) is null);
do $$ begin
  begin perform id from public.assessments; raise exception 'Listing unexpectedly allowed'; exception when insufficient_privilege then null; end;
end $$;
insert into qa_report_access values('paid_table_listing_denied',true);
reset role;
update public.payments set status='refunded' where assessment_id='${id}';
set local role anon;
insert into qa_report_access values('refunded_payment_denied',public.get_paid_assessment_report('${id}') is null);
reset role;
update public.payments set status='completed' where assessment_id='${id}';
update public.assessments set report_status='none' where id='${id}';
set local role anon;
insert into qa_report_access values('completed_payment_without_fulfillment_denied',public.get_paid_assessment_report('${id}') is null);
reset role;
update public.assessments set report_status='ready' where id='${id}';
set local role authenticated;
insert into qa_report_access values('authenticated_paid_rpc_works',public.get_paid_assessment_report('${id}')='{"test":"paid-gate"}'::jsonb);
do $$ begin
  begin perform report_payload from public.assessments; raise exception 'Authenticated SELECT unexpectedly allowed'; exception when insufficient_privilege then null; end;
end $$;
insert into qa_report_access values('authenticated_direct_read_denied',true);
reset role;
delete from public.assessments where id='${id}';
set local role anon;
insert into public.assessments(id,questionnaire_version,locale,industry,company_size,started_at,completed_at,overall_score,score_people,score_data,score_systems,score_governance,score_compliance,maturity_level,report_status)
values('${id}','qa-rollback','pl','it','11-50',now(),now(),50,50,50,50,50,50,'developing','none');
insert into public.responses(assessment_id,question_id,category_key,option_id,score,weight,critical) values('${id}','A1','people','A1_opt_3',3,1,false);
insert into qa_report_access values('anonymous_submission_still_works',true);
reset role;
do $$ begin if exists(select 1 from qa_report_access where not ok) then raise exception 'Paid report regression'; end if; end $$;
select jsonb_agg(jsonb_build_object('name',name,'ok',ok)) as checks from qa_report_access;
rollback;`;
await mkdir(new URL('.tmp/', root), { recursive: true });
const path = new URL('.tmp/test-paid-report-migration.sql', root);
await writeFile(path, sql);
const result = spawnSync('supabase', ['db', 'query', '--linked', '--output', 'json', '--file', path.pathname], { cwd: root, encoding: 'utf8' });
process.stdout.write(result.stdout);
process.stderr.write(result.stderr);
process.exitCode = result.status || 0;
