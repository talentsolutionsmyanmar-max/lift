// Unit checks for the data boundaries and copy provenance. Run: node --test doorstep/tests/
import test from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs'; import vm from 'node:vm';
const load = (files, extra = {}) => { const store = new Map(); const ctx = { window: {}, console, Date, JSON, Math, ...extra };
  ctx.window.localStorage = extra.localStorage || { getItem: k => store.has(k) ? store.get(k) : null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) };
  vm.createContext(ctx); for (const f of files) vm.runInContext(fs.readFileSync(new URL('../js/' + f, import.meta.url), 'utf8'), ctx); return { ctx, store }; };

test('saved records keep only whitelisted keys — no money, dates or text', () => {
  const { ctx, store } = load(['store.js']); const St = ctx.window.LiftStore; St.init();
  const c = St.commit('everyday', { topic: 'housing', keys: ['housing1', 'housing3'] });
  assert.equal(St.save(c.id).ok, true);
  const rec = JSON.parse(store.get(St.KEY))[0];
  assert.deepEqual(Object.keys(rec).sort(), ['id', 'keys', 'kind', 'next', 'savedAt', 'topic']);
  assert.equal(JSON.stringify(rec.keys), '["housing1","housing3"]');
});
test('money and date cards can never be saved', () => {
  const { ctx, store } = load(['store.js']); const St = ctx.window.LiftStore; St.init();
  const m = St.commit('money', { period: 'week', values: { available: '100' } });
  const d = St.commit('dates', { process: 'report', date: '2026-11-20', source: 'receipt' });
  assert.equal(St.save(m.id).ok, false); assert.equal(St.save(d.id).ok, false);
  assert.equal(store.size, 0); assert.equal(St.status(m), 'never');
});
test('tampered or unknown stored values are discarded on load', () => {
  const bad = JSON.stringify([{ id: 'abcdef12', kind: 'everyday', topic: 'housing', keys: ['housing1', '<script>'] }, { id: 'x', kind: 'money', amount: 5 }, { id: 'zzzzzz99', kind: 'family', topics: ['start', 'evil'] }]);
  const { ctx } = load(['store.js'], { localStorage: { getItem: () => bad, setItem() {}, removeItem() {} } });
  const St = ctx.window.LiftStore; St.init();
  assert.equal(St.S.cards.length, 2); assert.equal(JSON.stringify(St.S.cards.find(c => c.kind === 'everyday').data.keys), '["housing1"]');
  assert.equal(JSON.stringify(St.S.cards.find(c => c.kind === 'family').data.topics), '["start"]');
});
test('a failing write never reports success, and the card stays unsaved', () => {
  const { ctx } = load(['store.js'], { localStorage: { getItem: () => null, setItem() { throw new Error('quota'); }, removeItem() {} } });
  const St = ctx.window.LiftStore; St.init(); const c = St.commit('family', { topics: ['start'] });
  assert.equal(St.save(c.id).ok, false); assert.equal(St.status(c), 'unsaved');
});
test('editing a saved card is reported as changed', () => {
  const { ctx } = load(['store.js']); const St = ctx.window.LiftStore; St.init();
  const c = St.commit('everyday', { topic: 'phone', keys: ['phone1'] }); St.save(c.id);
  St.commit('everyday', { topic: 'phone', keys: ['phone1', 'phone2'] }); assert.equal(St.status(c), 'changed');
});
test('copy provenance: every key has R, L or P and P never carries Myanmar', () => {
  const { ctx } = load(['copy.js']); const C = ctx.window.LIFT_COPY;
  for (const [k, e] of Object.entries(C)) { assert.ok(['R', 'L', 'P'].includes(e.p), k); if (e.p === 'P') assert.equal(e.my, undefined, k); else assert.match(e.my, /[က-႟]/, k); }
});
test('i18n never shows a P string as Myanmar', () => {
  const { ctx } = load(['copy.js', 'i18n.js']); const I = ctx.window.LiftI18n; I.setLang('my');
  const P = Object.entries(ctx.window.LIFT_COPY).find(([, e]) => e.p === 'P');
  assert.match(I.t(P[0]), /lang="en"/);
});

// ---------- Regressions for review of 5a0e515 ----------
function faultyStorage() {
  const m = new Map(); const ctl = { failReads: 0, dropWrites: false };
  const ls = { getItem: k => { if (ctl.failReads > 0) { ctl.failReads--; throw new Error('transient read failure'); } return m.has(k) ? m.get(k) : null; },
    setItem: (k, v) => { if (!ctl.dropWrites || k !== 'lift.doorstep.saved.v1') m.set(k, String(v)); }, removeItem: k => m.delete(k) };
  return { ls, m, ctl };
}
function twoSaved() {
  const f = faultyStorage(); const { ctx } = load(['store.js'], { localStorage: f.ls }); const St = ctx.window.LiftStore; St.init();
  const a = St.commit('everyday', { topic: 'housing', keys: ['housing1'] }); St.S.editing.everyday = null;
  const b = St.commit('family', { topics: ['start'] });
  assert.equal(St.save(a.id).ok, true); assert.equal(St.save(b.id).ok, true);
  return { St, f, a, b, bytes: f.m.get(St.KEY) };
}
test('P1: remove aborts on a transient read failure and keeps every saved card', () => {
  const { St, f, a, b, bytes } = twoSaved();
  f.ctl.failReads = 1;                                   // the next read throws
  const r = St.remove(a.id);
  assert.equal(r.ok, false); assert.equal(f.m.get(St.KEY), bytes, 'stored bytes unchanged');
  assert.ok(St.S.cards.find(c => c.id === a.id) && St.S.cards.find(c => c.id === b.id), 'both cards still on screen');
  assert.equal(St.remove(a.id).ok, true);                // once reads work, removing one keeps the other
  const left = JSON.parse(f.m.get(St.KEY)); assert.equal(left.length, 1); assert.equal(left[0].id, b.id);
});
test('P1: save aborts on a transient read failure and keeps every saved card', () => {
  const { St, f, a, b, bytes } = twoSaved();
  St.commit('family', { topics: ['start', 'cost'] });    // edit card b (editing points at b)
  f.ctl.failReads = 1;
  const r = St.save(b.id);
  assert.equal(r.ok, false); assert.equal(f.m.get(St.KEY), bytes, 'stored bytes unchanged');
  assert.equal(St.status(St.S.cards.find(c => c.id === b.id)), 'changed', 'edited result kept and shown as changed');
  assert.equal(JSON.parse(f.m.get(St.KEY)).length, 2);
});
test('P1: unparsable stored data is never overwritten by a save', () => {
  const f = faultyStorage(); f.m.set('lift.doorstep.saved.v1', '{not json');
  const { ctx } = load(['store.js'], { localStorage: f.ls }); const St = ctx.window.LiftStore; St.init();
  const c = St.commit('everyday', { topic: 'food', keys: ['food1'] });
  assert.equal(St.save(c.id).ok, false); assert.equal(f.m.get('lift.doorstep.saved.v1'), '{not json');
});
test('P2: read-back compares content — a stale same-id record is not reported as saved', () => {
  const { St, f, b } = twoSaved();
  St.commit('family', { topics: ['start', 'cost'] });    // two answers on screen, one stored
  f.ctl.dropWrites = true;                               // simulate a write that does not persist
  const r = St.save(b.id);
  assert.equal(r.ok, false); assert.equal(r.reason, 'verify-content');
  const card = St.S.cards.find(c => c.id === b.id);
  assert.equal(St.status(card), 'changed'); assert.equal(card.data.topics.length, 2, 'edited answers retained');
});
test('save refuses rather than silently dropping an older card when full', () => {
  const f = faultyStorage(); const { ctx } = load(['store.js'], { localStorage: f.ls }); const St = ctx.window.LiftStore; St.init();
  for (let i = 0; i < 20; i++) { St.S.editing.everyday = null; const c = St.commit('everyday', { topic: 'phone', keys: ['phone1'] }); assert.equal(St.save(c.id).ok, true); }
  St.S.editing.everyday = null; const extra = St.commit('everyday', { topic: 'phone', keys: ['phone2'] });
  const r = St.save(extra.id); assert.equal(r.ok, false); assert.equal(r.reason, 'full'); assert.equal(JSON.parse(f.m.get(St.KEY)).length, 20);
});
