"""Consolidate the reviewed Phase 1 resource wording and navigation."""
import json,pathlib,hashlib
root=pathlib.Path(__file__).resolve().parent.parent;docs=root/'docs/family';dist=root/'dist'
en=json.loads((docs/'phase-one-tools-en.json').read_text());my=json.loads((docs/'phase-one-tools-my.json').read_text())
if set(en)!=set(my):raise SystemExit('Translation keys differ')
if any(not isinstance(v,str) or not v.strip() or '<' in v or '>' in v for v in my.values()):raise SystemExit('Invalid wording')
p=dist/'myanmar.js';text=p.read_text();start=text.index('window.LiftMyanmar=')+len('window.LiftMyanmar=');dictionary=json.loads(text[start:].strip().removesuffix(';'));dictionary.update({en[k]:my[k] for k in en});p.write_text(text[:start]+json.dumps(dictionary,ensure_ascii=False,indent=2)+';\n')
p=dist/'app.js';s=p.read_text();marker='const resources = [\n';rows=[{'title':'LearnBig','category':'skills','label':en['resourceLearn'],'description':en['learnText'],'url':'https://www.learnbig.net/thai-language-lessons/','note':en['status']},{'title':'Google Translate','category':'support','label':en['resourceTranslate'],'description':en['translateText'],'url':'https://translate.google.com/','note':en['limits']}]
# First execution only; keep all existing resources intact.
if "title: 'LearnBig'" not in s and '"title": "LearnBig"' not in s:s=s.replace(marker,marker+''.join('  '+json.dumps(row,ensure_ascii=False)+',\n' for row in rows))
p.write_text(s)
p=dist/'family-ui.js';s=p.read_text();old='We plan to adapt ReferTRM\'s YDC for migrant children with educators and families. Children\'s lessons, Thai audio and age-appropriate learning packs are not available through this page yet.';s=s.replace(old,en['ydcText'])
helper='const phaseOneTools='+json.dumps(en,ensure_ascii=False)+';\nfunction phaseOneLearningPanel(){const c=phaseOneTools;return `<section class="content-card"><h2>${c.title}</h2><p>${c.intro}</p><h3>${c.learn}</h3><p>${c.learnText}</p><a class="secondary" href="https://www.learnbig.net/thai-language-lessons/" target="_blank" rel="noopener noreferrer">${c.visitLearn}</a><h3>${c.translate}</h3><p>${c.translateText}</p><a class="secondary" href="https://translate.google.com/" target="_blank" rel="noopener noreferrer">${c.visitTranslate}</a><p class="dialog-note">${c.external}</p><p class="dialog-note">${c.limits}</p></section>`;}\n'
if 'function phaseOneLearningPanel' not in s:s=s.replace("'use strict';\n","'use strict';\n"+helper).replace('<div class="page-grid"><div><section class="content-card"><h2>${familyLabel(\'choose\')}','<div class="page-grid"><div>${phaseOneLearningPanel()}<section class="content-card"><h2>${familyLabel(\'choose\')}')
p.write_text(s)
p=dist/'sw.js';s=p.read_text().replace("lift-shell-v7","lift-shell-v8");p.write_text(s)
record={'scope':'Phase 1 external links, no embedded Google API or automatic text transmission','copy':'CCO AI wording pass; participant comprehension not yet tested','inputHash':hashlib.sha256((docs/'phase-one-tools-en.json').read_bytes()).hexdigest(),'outputHash':hashlib.sha256((docs/'phase-one-tools-my.json').read_bytes()).hexdigest()};(docs/'phase-one-tools-provenance.json').write_text(json.dumps(record,indent=2)+'\n')
print('Built Phase 1 external learning tools')
