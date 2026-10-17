'use strict';
(() => {
  const api = window.LiftJobCard;
  if (!api) return;

  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let selectedFixture = null;
  let imageReady = false;
  let imageDataUrl = '';
  let currentCard = null;
  let feeRisk = null;
  let feeAck = false;
  let busy = false;

  function fieldHtml(key, value) {
    const label = {
      job_title: 'Job title',
      employer: 'Employer',
      location: 'Location',
      pay: 'Pay (amount + period)',
      hours_shift: 'Hours / shift',
      requirements: 'Requirements',
      how_to_apply: 'How to apply',
      fees_mentioned: 'Fee / deposit mentioned'
    }[key] || key;

    if (value === api.NOT_STATED || value == null) {
      return `<div class="jc-field"><div class="jc-field-label">${esc(label)}</div><p class="jc-field-value jc-not-stated">NOT STATED</p></div>`;
    }
    let display;
    if (value.value && typeof value.value === 'object') {
      display = `Amount: ${value.value.amount || 'NOT STATED'} · Period: ${value.value.period || 'NOT STATED'}`;
    } else {
      display = value.value != null ? String(value.value) : String(value);
    }
    const quote =
      value.source_quote_verbatim && value.source_quote_verbatim !== api.NOT_STATED
        ? `<blockquote class="jc-quote">${esc(value.source_quote_verbatim)}</blockquote>`
        : `<p class="jc-note">No source quote (field still marked from rules/fixture).</p>`;
    return `<div class="jc-field"><div class="jc-field-label">${esc(label)}</div><p class="jc-field-value">${esc(display)}</p>${quote}</div>`;
  }

  function renderFixtures() {
    const list = api.listFixtures();
    $('jc-fixtures').innerHTML = list
      .map((f) => {
        const img = f.image
          ? `<img src="${esc(f.image)}" alt="" width="64" height="64">`
          : `<span class="jc-demo-tag" style="width:64px;text-align:center;padding:18px 4px">TEXT</span>`;
        return `<button type="button" class="jc-fixture" data-fixture="${esc(f.id)}" aria-pressed="${selectedFixture === f.id}">${img}<span class="jc-fixture-body"><strong>${esc(f.label)}</strong><small>${esc(f.note || '')}</small>${f.demonstration_only ? '<span class="jc-demo-tag">Demonstration only</span>' : ''}</span></button>`;
      })
      .join('');
    for (const btn of $('jc-fixtures').querySelectorAll('[data-fixture]')) {
      btn.onclick = () => {
        selectedFixture = btn.dataset.fixture;
        renderFixtures();
        const f = api.getFixture(selectedFixture);
        if (f && f.image) {
          $('jc-preview').src = f.image;
          $('jc-image-tools').hidden = false;
          imageReady = false;
          imageDataUrl = '';
          $('jc-image').value = '';
        } else {
          $('jc-image-tools').hidden = true;
        }
        if (f && f.demoText) $('jc-text').value = f.demoText;
        $('jc-status').textContent = 'Demo poster selected. Tap “Build honest job card”.';
      };
    }
  }

  function renderFlag() {
    if (!feeRisk) {
      $('jc-flag').hidden = true;
      return;
    }
    $('jc-flag').hidden = false;
    $('jc-flag').className = 'jc-flag ' + (feeRisk.level || 'none');
    const title =
      feeRisk.level === 'high'
        ? 'Fee / deposit red flag'
        : feeRisk.level === 'medium'
          ? 'Fee language — check carefully'
          : feeRisk.level === 'cleared'
            ? 'No fee ask detected (verify)'
            : 'No fee language found';
    $('jc-flag').innerHTML = `<strong>${esc(title)}</strong><p>${esc(feeRisk.reason)}</p>${
      feeRisk.matches.length ? `<p class="jc-note">Matched: ${esc(feeRisk.matches.join(', '))}</p>` : ''
    }`;
  }

  function renderCoach() {
    const prompts = api.conversationCoachPrompts(currentCard, feeRisk);
    $('jc-coach').innerHTML = prompts.map((p) => `<li>${esc(p)}</li>`).join('');
  }

  function renderResult() {
    if (!currentCard) {
      $('jc-result').hidden = true;
      return;
    }
    $('jc-result').hidden = false;
    const meta = currentCard._meta || {};
    $('jc-fields').innerHTML = api.FIELDS.map((k) => fieldHtml(k, currentCard[k])).join('');
    $('jc-meta').textContent = `Extractor: ${meta.extractor || 'unknown'} · Mode: ${meta.mode || 'n/a'} · Invented fields: ${meta.invented ? 'yes (blocked)' : 'no'}`;
    if (meta.hint) $('jc-hint').textContent = meta.hint;
    else $('jc-hint').textContent = '';
    if (meta.demonstration_only) {
      $('jc-demo-banner').hidden = false;
    } else {
      $('jc-demo-banner').hidden = true;
    }
    renderFlag();
    renderCoach();
    updateShareGate();
  }

  function updateShareGate() {
    const panel = $('jc-share-panel');
    if (!currentCard) {
      panel.hidden = true;
      return;
    }
    panel.hidden = false;
    const needsAck = !!(feeRisk && feeRisk.flagged);
    $('jc-fee-ack-wrap').hidden = !needsAck;
    $('jc-share').disabled = needsAck && !feeAck;
    $('jc-share-note').textContent = needsAck
      ? 'Sharing stays on your device. Confirm you have read the fee red flag before downloading a copy.'
      : 'Sharing stays on your device. Lift never uploads this card or your location.';
  }

  function cardPlainText(card, risk) {
    const lines = ['Lift — Clear Job Card', 'Privacy: this file was created on your device. Nothing was uploaded by Lift.', ''];
    if (card._meta && card._meta.demonstration_only) lines.push('DEMONSTRATION ONLY — NOT A REAL JOB', '');
    for (const k of api.FIELDS) {
      const v = card[k];
      lines.push(k.toUpperCase());
      if (v === api.NOT_STATED || v == null) lines.push('NOT STATED');
      else if (v.value && typeof v.value === 'object') {
        lines.push(`value: amount=${v.value.amount}; period=${v.value.period}`);
        lines.push(`source_quote: ${v.source_quote_verbatim || 'NOT STATED'}`);
      } else {
        lines.push(`value: ${v.value != null ? v.value : v}`);
        if (v.source_quote_verbatim) lines.push(`source_quote: ${v.source_quote_verbatim}`);
      }
      lines.push('');
    }
    if (risk) {
      lines.push('FEE CHECK');
      lines.push(`level: ${risk.level}; flagged: ${risk.flagged}`);
      lines.push(risk.reason);
      lines.push('');
    }
    lines.push('CONVERSATION PROMPTS (on-device only)');
    for (const p of api.conversationCoachPrompts(card, risk)) lines.push('- ' + p);
    lines.push('', 'Every field must quote the poster or be NOT STATED. Do not invent pay or fees.');
    return lines.join('\n');
  }

  function download(name, content) {
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function buildCard() {
    if (busy) return;
    busy = true;
    feeAck = false;
    $('jc-fee-ack').checked = false;
    $('jc-status').textContent = 'Building honest job card…';
    $('jc-run').disabled = true;
    try {
      let card;
      if (selectedFixture) {
        card = await api.extract({ fixtureId: selectedFixture });
      } else if (imageDataUrl) {
        const base64 = imageDataUrl.split(',')[1] || '';
        const mime = (imageDataUrl.match(/^data:([^;]+);/) || [])[1] || 'image/jpeg';
        card = await api.extract({
          imageBase64: base64,
          mime,
          text: $('jc-text').value.trim() || undefined
        });
      } else if ($('jc-text').value.trim()) {
        card = await api.extract({ text: $('jc-text').value.trim() });
      } else {
        $('jc-status').textContent = 'Choose a demo poster, upload an image, or paste visible poster text.';
        return;
      }
      currentCard = card;
      feeRisk = api.assessFeeRisk(card, $('jc-text').value);
      renderResult();
      $('jc-status').textContent = 'Card ready. Every field is quoted or NOT STATED.';
      $('jc-result').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      $('jc-status').textContent = 'Could not build card: ' + (err && err.message ? err.message : String(err));
    } finally {
      busy = false;
      $('jc-run').disabled = false;
    }
  }

  $('jc-image').onchange = async () => {
    const file = $('jc-image').files[0];
    if (!file) return;
    selectedFixture = null;
    renderFixtures();
    if (file.size > 12 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      $('jc-status').textContent = 'Use a JPEG, PNG or WebP under 12 MB.';
      imageReady = false;
      $('jc-image-tools').hidden = true;
      return;
    }
    let url;
    try {
      url = URL.createObjectURL(file);
      const image = new Image();
      image.src = url;
      await image.decode();
      const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      imageDataUrl = canvas.toDataURL('image/jpeg', 0.82);
      $('jc-preview').src = imageDataUrl;
      $('jc-image-tools').hidden = false;
      imageReady = true;
      $('jc-status').textContent =
        'Image ready on this device only. Open-weights model is not connected in this demo — paste visible text or use a demo poster for a full card.';
    } catch {
      imageReady = false;
      $('jc-status').textContent = 'Could not read that image.';
    } finally {
      if (url) URL.revokeObjectURL(url);
    }
  };

  $('jc-remove-image').onclick = () => {
    imageReady = false;
    imageDataUrl = '';
    $('jc-image').value = '';
    $('jc-image-tools').hidden = true;
    $('jc-preview').removeAttribute('src');
  };

  $('jc-run').onclick = (e) => {
    e.preventDefault();
    buildCard();
  };

  $('jc-fee-ack').onchange = () => {
    feeAck = $('jc-fee-ack').checked;
    updateShareGate();
  };

  $('jc-share').onclick = () => {
    if (!currentCard) return;
    if (feeRisk && feeRisk.flagged && !feeAck) {
      $('jc-status').textContent = 'Acknowledge the fee red flag before downloading a copy.';
      return;
    }
    download('lift-clear-job-card.txt', cardPlainText(currentCard, feeRisk));
    $('jc-status').textContent = 'Downloaded on this device. Nothing was sent.';
  };

  $('jc-clear').onclick = () => {
    currentCard = null;
    feeRisk = null;
    feeAck = false;
    selectedFixture = null;
    imageReady = false;
    imageDataUrl = '';
    $('jc-text').value = '';
    $('jc-image').value = '';
    $('jc-image-tools').hidden = true;
    $('jc-result').hidden = true;
    $('jc-share-panel').hidden = true;
    $('jc-fee-ack').checked = false;
    $('jc-status').textContent = '';
    renderFixtures();
  };

  renderFixtures();
})();
