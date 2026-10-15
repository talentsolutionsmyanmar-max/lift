const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {createSession}=require('../dist/community-intake-session.js');
function harness({flags={submissionsOpen:false,receiptsOpen:false},downloaded=false}={}){
 const events={},metrics={refreshes:0,mounts:0,languages:[],consent:0},draft={kind:'question',topic:'family',text:'Fictional local draft'};
 let slot,notice,button,current='community';const element={remove(){}};
 const session=createSession({makeElement:()=>element,mountUI:(el,options)=>{metrics.mounts++;metrics.initial=options;return {setAvailability:value=>{metrics.availability=value;},setLanguage:(copy,locale)=>metrics.languages.push(locale),showLookup:()=>metrics.lookups=(metrics.lookups||0)+1,showConsent:()=>metrics.consent++,destroy(){}};}});
 const context={communityPage:()=>'<p>Draft tools</p>',route:()=>{context.document.body.dataset.route=current;slot=['community','receipts'].includes(current)?{append:node=>{metrics.lastElement=node;}}:null;notice={};},communityDraft:draft,communityPreview:true,communityLabel:()=> 'Closed draft notice',LiftI18n:{locale:'en'},LiftCommunityIntakeCopy:{en:{notice:'Optional private review',send:'Send privately'},my:{notice:'Myanmar reviewed notice',send:'Myanmar reviewed send'}},LiftCommunityIntakeSession:{createSession:()=>session},LiftCommunityIntakeAvailability:{createAvailability:()=>({current:()=>({...flags}),refresh:async()=>{metrics.refreshes++;return flags;}})},navigator:{onLine:true},window:{LIFT_DOWNLOADED_COPY:downloaded,addEventListener:(name,fn)=>events[name]=fn},document:{body:{dataset:{}},getElementById:()=>slot,querySelector:selector=>selector==='[data-community-notice]'?notice:selector==='.community-actions'?{before:el=>{metrics.previewSlot=el;}}:null,createElement:()=>({dataset:{}}),addEventListener:(name,fn)=>events[name]=fn}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../dist/community-intake-route.js'),'utf8'),context);
 return {context,metrics,draft,events,session,flags,get slot(){return slot;},get button(){return button;},navigate(route,locale='en'){current=route;context.LiftI18n.locale=locale;context.route();}};
}
test('closed local route preserves draft tools and does not mount a send panel',async()=>{
 const h=harness();await Promise.resolve();assert.equal(h.metrics.refreshes,1);assert.equal(h.metrics.mounts,0);assert.equal(h.slot.hidden,true);assert.match(h.context.communityPage(),/community-intake-slot/);assert.equal(h.draft.text,'Fictional local draft');
});
test('receipt panel survives route and language changes with one mounted client',async()=>{
 const h=harness({flags:{submissionsOpen:true,receiptsOpen:true}});await Promise.resolve();assert.equal(h.metrics.mounts,1);assert.equal(h.metrics.initial.initialMode,'lookup');assert.equal(h.metrics.previewSlot,h.slot);assert.ok(h.metrics.consent>0);
 const panel=h.metrics.lastElement;h.navigate('home');h.navigate('community','my');assert.equal(h.metrics.mounts,1);assert.equal(h.metrics.lastElement,panel);assert.deepEqual(h.metrics.languages,['my']);assert.equal(h.draft.text,'Fictional local draft');
 h.flags.submissionsOpen=false;h.navigate('community','my');assert.deepEqual(h.metrics.availability,{enabled:false,receiptsEnabled:true});
});
test('downloaded offline copy never requests server readiness, including reconnect events',async()=>{
 const h=harness({downloaded:true});h.events.online();await Promise.resolve();assert.equal(h.metrics.refreshes,0);assert.equal(h.metrics.mounts,0);
});

test('Mine receipt route mounts lookup even when new intake is closed, without sending',async()=>{const h=harness();h.navigate('receipts');await Promise.resolve();assert.equal(h.slot.hidden,false);assert.equal(h.metrics.mounts,1);assert.equal(h.metrics.initial.enabled,false);assert.equal(h.metrics.initial.receiptsEnabled,false);assert.ok(h.metrics.lookups>0);assert.equal(h.metrics.consent,0);});
