const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..','dist');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
let html=read('index.html');
let css=read('styles.css')+'\n'+read('myanmar.css')+'\n'+read('mobile.css')+'\n'+read('companion.css')+'\n'+read('community-intake.css')+'\n'+read('brand-cards.css')+'\n'+read('learning.css');
for(const name of ['Padauk-Regular.ttf','Padauk-Bold.ttf'])css=css.replace(`./fonts/${name}`,`data:font/ttf;base64,${fs.readFileSync(path.join(root,'fonts',name)).toString('base64')}`);
html=html.replace('</head>',`<!-- Padauk license\n${read('fonts/OFL.txt')}\n-->\n</head>`);
html=html.replace('<link rel="stylesheet" href="./styles.css">',`<style>${css}</style>`);
html=html.replace('<link rel="stylesheet" href="./myanmar.css">','');
html=html.replace('<link rel="stylesheet" href="./mobile.css">','');
html=html.replace('<link rel="stylesheet" href="./companion.css">','');
html=html.replace('<link rel="stylesheet" href="./community-intake.css">','');
html=html.replace('<link rel="stylesheet" href="./brand-cards.css">','');
html=html.replace('<link rel="stylesheet" href="./learning.css">','');
html=html.replace(/\s*<link rel="manifest"[^>]+>/,'');
html=html.replace('href="./icon.svg"',`href="data:image/svg+xml;base64,${Buffer.from(read('icon.svg')).toString('base64')}"`);
for(const name of ['myanmar.js','i18n.js','dates.js','family.js','planner.js','spending.js','workflow-copy.js','workflow.js','community-intake-copy.js','app.js','extras.js','dates-ui.js','family-ui.js','spending-ui.js','everyday-ui.js','community.js','community-data.js','choice-copy.js','community-ui.js','community-choices.js','companion-ui.js','community-intake-client.js','community-receipt-store.js','community-intake-ui.js','community-intake-session.js','community-intake-availability.js','community-wall-copy.js','community-intake-route.js','community-wall-ui.js','cashflow.js','learning.js','learning-copy.js','cashflow-ui.js','cash-transfer-copy.js','cashflow-transfer.js','cashflow-transfer-ui.js','learning-ui.js','workflow-ui.js']){
  const code=read(name).replace(/<\/script/gi,'<\\/script');
  html=html.replace(`<script src="./${name}" defer></script>`,`<script${name==='extras.js'?' data-offline-copy="true"':''}>${name==='extras.js'?'window.LIFT_DOWNLOADED_COPY=true;\n':''}${code}</script>`);
}
// Inline scripts run after the document exists, preserving the normal defer order.
const scripts=[];
html=html.replace(/<script(?: data-offline-copy="true")?>[\s\S]*?<\/script>/g,script=>{scripts.push(script);return '';});
html=html.replace('</body>',scripts.join('\n')+'\n</body>');
html=html.replace('<title>Lift — your next step, together</title>','<title>Lift — downloaded offline copy</title>');
fs.writeFileSync(path.join(root,'lift-offline.txt'),html);
console.log(`Built generic offline copy: ${Buffer.byteLength(html)} bytes`);
