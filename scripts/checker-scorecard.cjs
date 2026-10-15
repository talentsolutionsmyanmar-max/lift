'use strict';
// Summarise recorded synthetic runs, never infer human/semantic approval from HTTP 200.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),qa=path.join(root,'qa');
const files=fs.readdirSync(qa).filter(name=>/^evaluation-.*\.json$/.test(name));
const runs=files.map(file=>{
 const data=JSON.parse(fs.readFileSync(path.join(qa,file),'utf8')),e=data.evaluation||{};
 return {file,recordedAt:data.recordedAt||null,deployment:data.deployment||null,model:e.model||data.model||null,fixture:e.fixtureId||data.fixtureId||null,language:e.requestedLanguage||data.language||null,httpStatus:data.httpStatus||null,transportFailure:!!data.transportFailure,stage:e.stage||null,category:e.category||null,exactDateMatch:e.exactDateMatch??null,exactAmountMatch:e.exactAmountMatch??null,languageGate:e.languageGate??null,semanticApproval:'not_established'};
});
const groups=[];
for(const run of runs){
 let group=groups.find(g=>g.deployment===run.deployment&&g.model===run.model&&g.language===run.language);
 if(!group){group={deployment:run.deployment,model:run.model,language:run.language,runs:0,responses200:0,exactDatePasses:0,exactAmountPasses:0,transportFailures:0};groups.push(group)}
 group.runs++;if(run.httpStatus===200)group.responses200++;if(run.exactDateMatch===true)group.exactDatePasses++;if(run.exactAmountMatch===true)group.exactAmountPasses++;if(run.transportFailure)group.transportFailures++;
}
const report={generatedAt:new Date().toISOString(),scope:'Historical fixed synthetic tests only. Different deployments are grouped separately; no population or current-build pass rate is implied.',releaseReady:false,releaseReason:'Semantic failures recorded; native-human review and full fixture coverage incomplete.',groups,runs};
const output=path.join(root,'docs/checker/recorded-run-scorecard.json');fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({file:output,recordedRuns:runs.length,groups:groups.length,releaseReady:false}));
