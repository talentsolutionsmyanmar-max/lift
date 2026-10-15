const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
execFileSync(process.execPath,[path.join(root,'scripts/build-offline.cjs')]);
const html=fs.readFileSync(path.join(root,'dist/lift-offline.txt'),'utf8');
test('downloaded app contains its styling and scripts without external asset dependencies',()=>{
  assert.equal(/<script[^>]+src=/.test(html),false);
  assert.equal(/<link[^>]+rel="stylesheet"/.test(html),false);
  assert.equal(/<link[^>]+rel="manifest"/.test(html),false);
  assert.ok(html.includes('data:image/svg+xml;base64,'));
  assert.ok(html.includes('window.LIFT_DOWNLOADED_COPY=true'));
  assert.ok(html.indexOf('id="main"')<html.indexOf('<script>'));
});
test('offline copy contains the app source, not a snapshot of personal state',()=>{
  assert.ok(html.includes('LiftPlanner.empty()'));
  assert.ok(html.includes('downloaded offline copy'));
  assert.equal(html.includes('Explore a new skill <img src=x'),false);
});
test('offline app bundles both Padauk fonts, their license and Myanmar catalogue',()=>{
  assert.equal((html.match(/data:font\/ttf;base64,/g)||[]).length,2);
  assert.ok(html.includes('SIL OPEN FONT LICENSE Version 1.1'));
  assert.ok(html.includes('window.LiftMyanmar='));
  assert.ok(html.indexOf('window.LiftMyanmar=')<html.indexOf('/* Static, locally bundled copy.'));
  assert.equal(html.includes("src:url('./fonts/"),false);
});
test('downloaded app preserves the native-language browser-translation guard',()=>{
 assert.ok(html.includes('translate="no" class="notranslate"'));
 assert.ok(html.includes('<meta name="google" content="notranslate">'));
});
