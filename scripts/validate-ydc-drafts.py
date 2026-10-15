"""Independent structural review. Never turns schema validity into child-use approval."""
import copy,datetime,hashlib,json,pathlib,sys
from jsonschema import Draft202012Validator
root=pathlib.Path(__file__).resolve().parent.parent
folder=root/'docs/ydc-zcode-drafts'
schema_path=folder/'lesson-schema.json';data_path=folder/'sample-lessons.json'
schema=json.loads(schema_path.read_text());data=json.loads(data_path.read_text())
Draft202012Validator.check_schema(schema);validator=Draft202012Validator(schema)
lessons=data['lessons'];results=[]
for lesson in lessons:
 errors=[{'path':list(e.path),'message':e.message} for e in validator.iter_errors(lesson)]
 results.append({'id':lesson.get('lesson_id'),'pathway':lesson.get('pathway'),'schemaErrors':errors,'reviewFlags':{k:lesson.get(k) for k in ['educator_review','language_review','rights_review']}})
counts={p:sum(l.get('pathway')==p for l in lessons) for p in ['under6','6to11','12to17']}
coverage=len(lessons)==6 and len({l.get('lesson_id') for l in lessons})==6 and all(n==2 for n in counts.values()) and {l['age_band'] for l in lessons if l['pathway']=='under6'}=={'0-2','3-5'}
negative=[]
for locale,status in [('my','DRAFT FOR CCO REVIEW'),('th','DRAFT FOR THAI EDUCATOR REVIEW')]:
 for scope in ['title','step']:
  base=copy.deepcopy(lessons[0]);obj=base['title'] if scope=='title' else base['activity_steps'][0]
  text=locale if scope=='title' else 'instruction_'+locale
  label=locale+'_status' if scope=='title' else 'instruction_'+locale+'_status'
  obj[text]='synthetic translation';obj[label]=status
  if not validator.is_valid(base):raise SystemExit('Cannot construct a valid paired-language base')
  for mode in ['missing','wrong']:
   changed=copy.deepcopy(base);target=changed['title'] if scope=='title' else changed['activity_steps'][0]
   if mode=='missing':del target[label]
   else:target[label]='approved'
   negative.append({'case':scope+'_'+locale+'_'+mode+'_status','rejected':not validator.is_valid(changed)})
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Independent structural validation only, not educator, language, rights or safety approval.','hashes':{str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [schema_path,data_path]},'coverage':{'allThreePathways':coverage,'counts':counts},'lessons':results,'pairedSchemaNegativeChecks':negative,'pairedStatusSchemaEnforced':all(c['rejected'] for c in negative),'readyForChildren':False,'limits':['Schema cannot establish semantic correctness, age suitability or translation quality.','Card/story/timetable completeness and source-answer consistency require content review.','Independent educator, native-language, rights and safeguarding reviews remain pending.']}
output=root/'docs/ydc-independent-validation.json';output.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'file':str(output),'coverage':coverage,'schemaErrors':sum(len(r['schemaErrors']) for r in results),'pairedStatusSchemaEnforced':report['pairedStatusSchemaEnforced'],'readyForChildren':False}))
if not coverage or any(r['schemaErrors'] for r in results) or not report['pairedStatusSchemaEnforced']:sys.exit(1)
