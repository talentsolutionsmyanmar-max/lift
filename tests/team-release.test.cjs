const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../artifacts/team-test-release');
test('team-release contains static pages only, no submission backend or external script dependencies',()=>{
 assert.deepEqual(fs.readdirSync(root).sort(),['icon.svg','index.html','robots.txt','survey.html','vercel.json']);
 const config=JSON.parse(fs.readFileSync(path.join(root,'vercel.json')));assert.equal(config.buildCommand,null);assert.equal(config.installCommand,null);assert.equal(config.functions,undefined);assert.equal(config.crons,undefined);
 const html=fs.readFileSync(path.join(root,'survey.html'),'utf8');assert.match(html,/connect-src 'none'/);assert.match(html,/form-action 'none'/);assert.doesNotMatch(html,/<script[^>]+src=/);assert.match(html,/window.LIFT_SURVEY_TEST=true/);
 for(const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g))assert.doesNotThrow(()=>new vm.Script(script[1]));
 assert.ok(html.indexOf('window.LIFT_SURVEY_TEST=true')<html.indexOf("if(window.LIFT_SURVEY_TEST){message('success')"));
});
