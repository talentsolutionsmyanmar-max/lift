'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../dist/job-card-extract.js');

describe('LiftJobCard fixtures paused', () => {
  it('lists no demo job fixtures until research review', () => {
    assert.deepEqual(api.listFixtures(), []);
  });

  it('unknown fixture id rejects', async () => {
    await assert.rejects(() => api.extract({ fixtureId: 'tiktok-01' }), /unknown_fixture/);
    await assert.rejects(() => api.extract({ fixtureId: 'demo-fee-ask' }), /unknown_fixture/);
  });
});

describe('LiftJobCard text rules (user paste only)', () => {
  it('never invents pay when absent', () => {
    const card = api.extractFromText('We are hiring a kitchen helper in Bangkok. Apply on LINE.');
    assert.equal(card.pay, api.NOT_STATED);
    assert.equal(card.fees_mentioned, api.NOT_STATED);
    assert.notEqual(card.job_title, api.NOT_STATED);
  });

  it('flags registration fee and passport hold from paste', () => {
    const text =
      'DEMONSTRATION PASTE — user-supplied text only.\n' +
      'Helper needed.\nSalary: 12,000 THB / month\n' +
      'Registration fee 3,000 baht before start.\n' +
      'Passport held until contract ends.\nApply via LINE.';
    const card = api.extractFromText(text);
    assert.notEqual(card.pay, api.NOT_STATED);
    assert.notEqual(card.fees_mentioned, api.NOT_STATED);
    const risk = api.assessFeeRisk(card, text);
    assert.equal(risk.flagged, true);
    assert.equal(risk.level, 'high');
  });

  it('no-agency-fee language is not high red-flag', () => {
    const text = 'Construction helper. Salary 450 THB / day. No agency fee. Apply via LINE.';
    const card = api.extractFromText(text);
    const risk = api.assessFeeRisk(card, text);
    assert.notEqual(risk.level, 'high');
    assert.equal(risk.flagged, false);
  });
});

describe('conversation coach', () => {
  it('stays local and highlights fee when flagged', () => {
    const text = 'Factory helper. Registration fee 2,000 baht. Passport held.';
    const card = api.extractFromText(text);
    const risk = api.assessFeeRisk(card, text);
    const prompts = api.conversationCoachPrompts(card, risk);
    assert.ok(prompts[0].toLowerCase().includes('fee') || prompts[0].toLowerCase().includes('passport'));
  });
});
