'use strict';
(() => {
  const oc = window.LiftOfferCheck; if (!oc) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let modelAvailable = false;
  fetch('/api/offer-check', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(j => { if (j && j.configured) { modelAvailable = true; $('jc-model-wrap').hidden = false; } }).catch(() => {});
  const srcHtml = (list) => list && list.length ? `<p class="jc-note">Source: ${list.map(s => `<a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.name)}</a> (checked ${esc(s.checked)})`).join('; ')}</p>` : '';
  const item = (x) => `<div class="jc-field">${x.label ? `<div class="jc-field-label">${esc(x.label)}</div>` : ''}${x.quote ? `<blockquote class="jc-quote">${esc(x.quote)}</blockquote>` : ''}<p class="jc-field-value">${esc(x.concern)}</p><p class="jc-note"><strong>Ask:</strong> ${esc(x.question)}</p>${srcHtml(x.sources)}</div>`;
  const list = (arr, empty) => arr.length ? arr.map(item).join('') : `<p class="jc-note jc-not-stated">${esc(empty)}</p>`;
  async function run() {
    const text = $('jc-text').value;
    let report;
    if (modelAvailable && $('jc-model').checked) {
      $('jc-status').textContent = 'Sending text to the Meta Llama model for this one check…';
      try { const r = await fetch('/api/offer-check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) }); report = r.ok ? await r.json() : null; } catch { report = null; }
      if (!report) { report = await oc.analyze(text); report.engine = 'rules (model unavailable)'; }
    } else report = await oc.analyze(text);
    $('jc-notice').textContent = ' ' + report.noFlagsNotice;
    $('jc-concerning').innerHTML = list(report.concerning, 'No concerning wording found by Lift’s rules. This does not mean the offer is safe.');
    $('jc-missing').innerHTML = list(report.missing, 'Lift found mentions of each basic term. Check the details with the employer.');
    $('jc-cannot').innerHTML = list(report.cannotAssess, '');
    $('jc-engine').textContent = 'Checked with: ' + report.engine + ' · rules reviewed ' + report.reviewedRules + (report.personalDetailsHidden ? ' · personal details hidden from the quotes' : '');
    $('jc-result').hidden = false; $('jc-status').textContent = '';
  }
  $('jc-run').addEventListener('click', run);
  $('jc-clear').addEventListener('click', () => { $('jc-text').value = ''; $('jc-result').hidden = true; });
})();
