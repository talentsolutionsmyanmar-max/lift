"""Import educator wording as drafts. Never infer approval from worksheet text."""
import argparse,csv,json,pathlib
parser=argparse.ArgumentParser();parser.add_argument('worksheet');parser.add_argument('--output',required=True);args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parent.parent
pack=json.loads((root/'docs/ydc-research/adult-audio-authoring-pack.json').read_text())
with open(args.worksheet,encoding='utf-8-sig',newline='') as f:rows=list(csv.DictReader(f))
expected={c['id'] for c in pack['cards']};ids=[r.get('card_id') for r in rows]
if len(set(ids))!=len(ids) or set(ids)!=expected:raise SystemExit('Worksheet must contain each of the ten original card IDs exactly once.')
by_id={r['card_id']:r for r in rows}
def value(row,key):return row.get(key,'').strip() or None
for card in pack['cards']:
 row=by_id[card['id']]
 if row.get('scenario_intent')!=card['scenarioIntent']:raise SystemExit('Scenario intent changed: '+card['id']+'; review separately before import.')
 for source,target in [('thai_phrase_draft','thaiText'),('thai_phrase_version','thaiTextVersion'),('home_language_code','meaningLanguage'),('home_language_meaning_draft','meaningText'),('meaning_version','meaningTextVersion'),('optional_sound_guide_draft','optionalSoundGuide')]:card[target]=value(row,source)
 card['authoringNotes']={k:value(row,k) for k in ['specific_fictional_context','intended_register_and_choices','normal_audio_filename','clear_audio_filename','meaning_audio_filename','thai_review_reference','meaning_review_reference','recording_rights_reference','review_notes']}
 # Filename/reference claims remain notes, never validated assets or approvals.
 card['readyForLearners']=False
pack['status']='imported_wording_draft_requires_review'
out=pathlib.Path(args.output)
if out.resolve()==pathlib.Path(args.worksheet).resolve():raise SystemExit('Output must differ from input.')
if out.exists():raise SystemExit('Output already exists; choose a new candidate file to preserve prior work.')
out.write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'output':str(out),'draftCards':len(pack['cards']),'readyForLearners':False}))
