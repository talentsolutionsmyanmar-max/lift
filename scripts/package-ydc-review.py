"""Package only the explicit, non-personal YDC adult-review deliverables."""
import hashlib,json,pathlib,subprocess,sys,zipfile
root=pathlib.Path(__file__).resolve().parent.parent
subprocess.run(['node','scripts/build-ydc-offline.cjs'],cwd=root,check=True)
subprocess.run([sys.executable,'scripts/validate-ydc-drafts.py'],cwd=root,check=True)
files={}
patterns=['docs/ydc-zcode-drafts/*','docs/ydc-research/*','docs/ydc-cco-*.json']
for pattern in patterns:
 for p in root.glob(pattern):
  if p.is_file():files[str(p.relative_to(root))]=p.read_bytes()
for rel in ['docs/migrant-family-learning-brief.txt','docs/ydc-independent-validation.json','docs/ydc-review-preview.html','artifacts/ydc-adult-review-offline.html','scripts/build-ydc-review.cjs','scripts/build-ydc-offline.cjs','scripts/ydc-preview.css','scripts/validate-ydc-drafts.py','scripts/apply-ydc-cco-instructions.py','scripts/package-ydc-review.py','dist/fonts/Padauk-Regular.ttf','dist/fonts/OFL.txt','qa/ydc-offline-build.json','qa/ydc-theme-contrast.json','qa/ydc-reader-navigation.json','scripts/validate-audio-pack.cjs','scripts/import-audio-worksheet.py','tests/audio-pack.test.cjs','qa/audio-authoring-validation.json']:
 files[rel]=(root/rel).read_bytes()
files['START-HERE.txt']=b'''YDC adult review package\n\nOpen artifacts/ydc-adult-review-offline.html for the self-contained preview.\nLight/dark themes and Myanmar + English core interface are included.\nSome goals, assessments and research notes remain English.\n\nThis is an unpublished design and curriculum draft for adult review. It is not\napproved for use with children or a replacement for school. All educator,\nlanguage and rights review flags remain false. CCO wording is AI-assisted.\nThe Thailand collection contains research topics, not available Thai lessons.\nExisting production YDC and public Lift were not modified by this package.\n\nRead docs/ydc-research/thailand-language-culture-2026-10-14.txt and\ndocs/ydc-zcode-drafts/10-handoff.md for evidence, limitations and review work.\n\nThe HTML includes its Myanmar font and needs no remote assets. Local-file\nopening/offline operation on actual Android/iPhone devices remains unverified.\nBrowser preview flows were exercised; a requested phone viewport override did\nnot produce the requested 360px width in the latest browser session.\n\nNo child records, private credentials or API services are included.\n'''
manifest={'purpose':'Adult review only; not a child learning release','files':{name:{'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()} for name,data in sorted(files.items())}}
files['manifest.json']=json.dumps(manifest,indent=2).encode()
output=root/'artifacts/lift-ydc-adult-review-2026-10-14.zip';temp=output.with_suffix('.tmp')
with zipfile.ZipFile(temp,'w',zipfile.ZIP_DEFLATED) as z:
 for rel,data in sorted(files.items()):z.writestr('lift-ydc-review/'+rel,data)
with zipfile.ZipFile(temp) as z:
 for rel,row in manifest['files'].items():
  assert hashlib.sha256(z.read('lift-ydc-review/'+rel)).hexdigest()==row['sha256'],rel
 assert z.testzip() is None
 temp_manifest=json.loads(z.read('lift-ydc-review/manifest.json'))
 assert len(temp_manifest['files'])==len(files)-1
temp.replace(output)
print(json.dumps({'package':str(output),'entries':len(files),'bytes':output.stat().st_size,'manifestVerified':True,'readyForChildren':False}))
