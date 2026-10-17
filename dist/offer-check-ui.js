'use strict';
(() => {
  const oc = window.LiftOfferCheck; if (!oc) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let modelAvailable = false;
  fetch('/api/offer-check', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(j => { if (j && j.configured) { modelAvailable = true; $('jc-model-wrap').hidden = false; } }).catch(() => {});
  const srcHtml = (list) => list && list.length ? `<p class="oc-src">${list.map(s => `<a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.name)}</a> · checked ${esc(s.checked)}`).join('<br>')}</p>` : '';
  const card = (x) => `<article class="oc-card">${x.label ? `<div class="oc-label">${esc(x.label)}</div>` : ''}
    <div class="oc-ask"><p>${esc(x.question)}</p><button type="button" class="oc-copy" data-copy="${esc(x.question)}" aria-label="Copy question">Copy</button></div>
    ${x.quote ? `<p class="oc-quote">${esc(x.quote)}</p>` : ''}
    <details class="oc-why"><summary>Why?</summary><p>${esc(x.concern)}</p>${srcHtml(x.sources)}</details></article>`;
  const list = (arr, empty) => arr.length ? arr.map(card).join('') : `<p class="oc-empty">${esc(empty)}</p>`;
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  function headline(r) {
    const c = r.concerning.length, m = r.missing.length;
    if (c) return plural(c, 'thing', 'things') + ' to ask before you sign';
    if (m) return plural(m, 'detail', 'details') + ' missing';
    return 'Nothing flagged in the wording. That does not mean it is safe.';
  }
  async function run() {
    const text = $('jc-text').value;
    let report;
    if (modelAvailable && $('jc-model').checked) {
      $('jc-status').textContent = 'Sending text to Meta Llama for this one check…';
      try { const r = await fetch('/api/offer-check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) }); report = r.ok ? await r.json() : null; } catch { report = null; }
      if (!report) { report = await oc.analyze(text); report.engine = 'rules (model unavailable)'; }
    } else report = await oc.analyze(text);
    $('jc-notice').textContent = report.noFlagsNotice;
    $('oc-headline').textContent = headline(report);
    const n = [report.concerning.length, report.missing.length, report.cannotAssess.length];
    $('n-c').textContent = n[0]; $('n-m').textContent = n[1]; $('n-u').textContent = n[2];
    $('oc-chips').innerHTML = `<a class="oc-chip c" href="#sec-c"><b>${n[0]}</b> to ask</a><a class="oc-chip m" href="#sec-m"><b>${n[1]}</b> missing</a><a class="oc-chip u" href="#sec-u"><b>${n[2]}</b> can’t assess</a>`;
    $('jc-concerning').innerHTML = list(report.concerning, 'No concerning wording found. This does not mean the offer is safe.');
    $('jc-missing').innerHTML = list(report.missing, 'Each basic term is mentioned. Still confirm the details.');
    $('jc-cannot').innerHTML = list(report.cannotAssess, '');
    $('jc-engine').textContent = 'Checked with ' + report.engine + ' · rules reviewed ' + report.reviewedRules + (report.personalDetailsHidden ? ' · some personal details hidden (tap i for what)' : '');
    $('oc-input').hidden = true; $('jc-result').hidden = false; $('jc-status').textContent = ''; window.scrollTo(0, 0);
  }
  function toast(msg) { const t = $('oc-toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1400); }
  $('jc-text').addEventListener('input', () => { $('jc-run').disabled = !$('jc-text').value.trim(); });
  $('jc-run').addEventListener('click', run);
  $('jc-clear').addEventListener('click', () => { $('jc-text').value = ''; $('jc-run').disabled = true; $('jc-result').hidden = true; $('oc-input').hidden = false; });
  $('oc-info').addEventListener('click', (e) => { const s = $('oc-disclaimer'); s.hidden = !s.hidden; e.currentTarget.setAttribute('aria-expanded', String(!s.hidden)); });
  document.addEventListener('click', (e) => { const b = e.target.closest('.oc-copy'); if (!b) return; const q = b.dataset.copy; (navigator.clipboard ? navigator.clipboard.writeText(q) : Promise.reject()).then(() => toast('Question copied'), () => toast('Long-press the question to copy')); });
})();
