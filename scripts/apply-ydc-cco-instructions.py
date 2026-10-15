"""Apply an exact-source CCO wording candidate to unpublished YDC research drafts."""
import copy,datetime,hashlib,json,pathlib,re
from jsonschema import Draft202012Validator
root=pathlib.Path(__file__).resolve().parent.parent;docs=root/'docs';folder=docs/'ydc-zcode-drafts'
input_path=docs/'ydc-cco-instructions-input.json';copy_path=docs/'ydc-cco-instructions-copy.json';data_path=folder/'sample-lessons.json'
inputs=json.loads(input_path.read_text())['strings'];translated=json.loads(copy_path.read_text());data=json.loads(data_path.read_text())
if set(inputs)!=set(translated):raise SystemExit('Review keys differ')
for key,text in translated.items():
 if not isinstance(text,str) or not re.search('[\u1000-\u109f]',text) or re.search('[A-Za-z<>]',text):raise SystemExit('Invalid or incomplete Myanmar wording: '+key)
prior=[]
for lesson in data['lessons']:
 key=lesson['lesson_id']+'-title'
 if inputs[key]!=lesson['title']['en']:raise SystemExit('English title changed: '+key)
 prior.append({'key':key,'priorMyanmar':lesson['title'].get('my')})
 lesson['title']['my']=translated[key];lesson['title']['my_status']='DRAFT FOR CCO REVIEW'
 for step in lesson['activity_steps']:
  key=lesson['lesson_id']+'-step-'+str(step['step_no'])
  if inputs[key]!=step['instruction']:raise SystemExit('English instruction changed: '+key)
  prior.append({'key':key,'priorMyanmar':step.get('instruction_my')})
  step['instruction_my']=translated[key];step['instruction_my_status']='DRAFT FOR CCO REVIEW'
 if lesson['status']!='research_draft_not_for_children' or any(lesson[k] for k in ['educator_review','language_review','rights_review']):raise SystemExit('Draft review gate changed')
schema=json.loads((folder/'lesson-schema.json').read_text());validator=Draft202012Validator(schema)
for lesson in data['lessons']:validator.validate(lesson)
record={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'review':'CCO AI wording candidate; independent human, educator, safety and rights approval remain pending.','conversation':'CCO-private-review','scope':'Six titles and 28 activity instructions only; not every background curriculum/assessment/teacher note.','inputHash':hashlib.sha256(input_path.read_bytes()).hexdigest(),'copyHash':hashlib.sha256(copy_path.read_bytes()).hexdigest(),'priorCopy':prior,'readyForChildren':False}
# Write only after exact English correspondence and full draft-schema validation.
(docs/'ydc-cco-instructions-provenance.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
data_path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'updatedStrings':len(prior),'lessons':len(data['lessons']),'readyForChildren':False}))
