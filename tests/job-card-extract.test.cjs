'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../dist/job-card-extract.js');

describe('LiftJobCard fixtures', () => {
  it('lists demo fixtures including fee sample', () => {
    const list = api.listFixtures();
    assert.ok(list.length >= 4);
    assert.ok(list.some((f) => f.id === 'demo-fee-ask' && f.demonstration_only));
  });

  it('tiktok-01 quotes pay and does not invent location', async () => {
    const card = await api.extract({ fixtureId: 'tiktok-01' });
    assert.equal(card.location, api.NOT_STATED);
    assert.notEqual(card.pay, api.NOT_STATED);
    assert.match(card.pay.source_quote_verbatim, /350,000/);
    assert.equal(card._meta.invented, false);
  });

  it('fee sample is high red-flag and blocks soft path', async () => {
    const card = await api.extract({ fixtureId: 'demo-fee-ask' });
    const risk = api.assessFeeRisk(card);
    assert.equal(risk.flagged, true);
    assert.equal(risk.level, 'high');
    assert.ok(risk.matches.length > 0);
  });

  it('no-agency-fees poster is not high red-flag', async () => {
    const card = await api.extract({ fixtureId: 'tiktok-01' });
    const risk = api.assessFeeRisk(card);
    assert.notEqual(risk.level, 'high');
    assert.equal(risk.flagged, false);
  });
});

describe('LiftJobCard text rules', () => {
  it('never invents pay when absent', () => {
    const card = api.extractFromText('We are hiring a kitchen helper in Bangkok. Apply on LINE.');
    assert.equal(card.pay, api.NOT_STATED);
    assert.equal(card.fees_mentioned, api.NOT_STATED);
    assert.notEqual(card.job_title, api.NOT_STATED);
  });

  it('captures registration fee from paste', () => {
    const card = api.extractFromText(
      'Factory helper.\nSalary: 15,000 THB / month\nRegistration fee 2,500 baht before start.\nApply via LINE.'
    );
    assert.notEqual(card.pay, api.NOT_STATED);
    assert.notEqual(card.fees_mentioned, api.NOT_STATED);
    const risk = api.assessFeeRisk(card);
    assert.equal(risk.flagged, true);
  });
});

describe('conversation coach', () => {
  it('stays local and highlights fee when flagged', async () => {
    const card = await api.extract({ fixtureId: 'demo-fee-ask' });
    const risk = api.assessFeeRisk(card);
    const prompts = api.conversationCoachPrompts(card, risk);
    assert.ok(prompts[0].toLowerCase().includes('fee') || prompts[0].toLowerCase().includes('passport'));
  });
});
