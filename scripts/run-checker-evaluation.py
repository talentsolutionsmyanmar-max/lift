"""Run a fixed synthetic fixture on an authorised evaluation preview. Never print tokens."""
import argparse,json,pathlib,subprocess,time,sys
parser=argparse.ArgumentParser();parser.add_argument('--deployment',required=True);parser.add_argument('--fixture',required=True);parser.add_argument('--model',choices=['meta/llama-4-scout','meta/llama-4-maverick','meta/muse-glimmer-30b'],required=True);parser.add_argument('--language',choices=['en','my'],default='my');parser.add_argument('--token-file',default='/tmp/lift-eval-session.json');args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parent.parent
fixtures=json.loads((root/'lib/checker/evaluation-fixtures.json').read_text())
if args.fixture not in {f['id'] for f in fixtures}:sys.exit('Unknown fixed fixture.')
if not args.deployment.startswith('https://lift-next-step-') or not args.deployment.endswith('.vercel.app'):sys.exit('Expected a Lift preview URL.')
session=json.loads(pathlib.Path(args.token_file).read_text());token=session['token']
if int(session['expires'])<time.time()*1000:sys.exit('Evaluation token expired; create a new authorised preview session.')
run_id=time.strftime('%Y%m%dT%H%M%SZ',time.gmtime())+'-'+str(time.time_ns()%1000000)
body={'fixtureId':args.fixture,'model':args.model,'language':args.language}
cmd=['vercel','curl','/api/check-evaluation','--deployment',args.deployment,'--','--silent','--show-error','--max-time','115','--write-out','\n%{http_code}','--header','Authorization: Bearer '+token,'--header','Content-Type: application/json','--request','POST','--data',json.dumps(body)]
start=time.time();response=subprocess.run(cmd,cwd=root,capture_output=True,text=True)
if response.returncode:
 failure={'transportFailure':True,'exitCode':response.returncode,'fixtureId':args.fixture,'model':args.model,'language':args.language,'elapsedSeconds':round(time.time()-start,2),'semanticReview':'not_possible_no_response'}
 output=root/'qa'/('evaluation-'+args.model.split('/')[-1]+'-'+args.fixture+'-'+args.language+'-'+run_id+'-transport-failure.json');output.write_text(json.dumps(failure,indent=2)+'\n');print(json.dumps(failure));sys.exit(response.returncode)
try:
 raw,status=response.stdout.rsplit('\n',1);result=json.loads(raw);status=int(status)
except (ValueError,TypeError):sys.exit('The evaluation did not return JSON; no model result recorded.')
name='evaluation-'+args.model.split('/')[-1]+'-'+args.fixture+'-'+args.language+'-'+run_id+'.json';out=root/'qa'/name
out.write_text(json.dumps({'httpStatus':status,'recordedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'deployment':args.deployment,'elapsedSeconds':round(time.time()-start,2),'evaluation':result},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':status,'file':str(out),'result':result},ensure_ascii=False)[:10000])
