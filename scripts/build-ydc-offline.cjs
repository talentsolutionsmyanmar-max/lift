'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..');
require('./build-ydc-review.cjs');
const font=fs.readFileSync(path.join(root,'dist/fonts/Padauk-Regular.ttf'));
const license=fs.readFileSync(path.join(root,'dist/fonts/OFL.txt'),'utf8');
const escape=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
let html=fs.readFileSync(path.join(root,'docs/ydc-review-preview.html'),'utf8');
const fontRef="url('../dist/fonts/Padauk-Regular.ttf')";
if(!html.includes(fontRef))throw new Error('Expected local Myanmar font reference missing');
html=html.replace(fontRef,`url('data:font/ttf;base64,${font.toString('base64')}')`);
html=html.replace('</footer>',`<details class="font-license"><summary>Myanmar font licence</summary><pre>${escape(license)}</pre></details></footer>`);
html=html.replace('</style>','pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:11px}.font-license{margin-top:20px}</style>');
// The handoff must have no remote subresources or relative file dependencies.
if(/(?:src|href)\s*=\s*["'](?!#|data:)[^"']+["']/i.test(html))throw new Error('External or relative resource in offline artifact');
for(const match of html.matchAll(/url\(([^)]+)\)/gi)){const value=match[1].trim().replace(/^["']|["']$/g,'');if(!value.startsWith('data:'))throw new Error('Unbundled CSS resource');}
const output=path.join(root,'artifacts/ydc-adult-review-offline.html');
fs.writeFileSync(output,html);
const report={file:output,bytes:Buffer.byteLength(html),sha256:createHash('sha256').update(html).digest('hex'),embeddedMyanmarFont:true,fontLicenceIncluded:true,remoteSubresources:false,readyForChildren:false};
fs.writeFileSync(path.join(root,'qa/ydc-offline-build.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
