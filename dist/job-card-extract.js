/**
 * Lift Clear Job Cards — extraction interface + fee red-flag.
 * Privacy: runs in the browser. No GPS, no accounts, no analytics.
 * Myanmar cannot use Meta Model API; open-weights remote is optional.
 * Primary path: user upload or pasted poster text. Optional DEMO fixtures are fictional Thailand migrant samples only.
 */
(function (root) {
  'use strict';

  const NOT_STATED = 'NOT STATED';
  const FIELDS = [
    'job_title',
    'employer',
    'location',
    'pay',
    'hours_shift',
    'requirements',
    'how_to_apply',
    'fees_mentioned'
  ];

  /**
   * DEMO FIXTURES PAUSED (Ko Ko, 17 Oct 2026).
   * Do not invent Thailand or Myanmar job listings until research is reviewed:
   * see docs/THAILAND-MIGRANT-LEGIT-WORK-RESEARCH-2026-10-17.md
   * Primary path remains: user upload or paste of THEIR own poster text only.
   */
  const FIXTURES = {};

  function listFixtures() {
    return Object.keys(FIXTURES).map((id) => {
      const f = FIXTURES[id];
      return { id: f.id, label: f.label, image: f.image, note: f.note, demonstration_only: !!f.card._meta.demonstration_only };
    });
  }

  function getFixture(id) {
    return FIXTURES[id] || null;
  }

  function textBlobFromCard(card) {
    const parts = [];
    for (const k of FIELDS) {
      const v = card[k];
      if (v === NOT_STATED || v == null) continue;
      if (typeof v === 'string') parts.push(v);
      else {
        if (v.value != null) {
          if (typeof v.value === 'object') parts.push(JSON.stringify(v.value));
          else parts.push(String(v.value));
        }
        if (v.source_quote_verbatim && v.source_quote_verbatim !== NOT_STATED) {
          parts.push(String(v.source_quote_verbatim));
        }
      }
    }
    return parts.join('\n');
  }

  /**
   * Score fee / deposit risk for red-flag before share.
   * Returns { flagged, level, matches, reason }.
   */
  function assessFeeRisk(card, extraText) {
    const blob = [textBlobFromCard(card || emptyCard()), extraText || ''].join('\n');
    if (!blob.trim()) {
      return { flagged: false, level: 'none', matches: [], reason: 'No fee or deposit language found in extracted fields.' };
    }

    const lower = blob;
    const negations = FEE_NEGATION.filter((re) => re.test(lower)).map((re) => re.source);
    const matches = [];
    for (const re of FEE_ASK_PATTERNS) {
      const m = lower.match(re);
      if (m) matches.push(m[0]);
    }
    // Deduplicate
    const uniq = [...new Set(matches.map((s) => s.toLowerCase()))];

    // If only negation phrases matched "fee" via FEE_ASK but negation present and no deposit/passport/registration
    const serious = uniq.filter((m) =>
      /deposit|passport|registration|placement|guarantee|upfront|held|ကုန်ကျ|ကြိုတင်|အာမခံ|စာရင်းသွင်း|ပတ်စ်ပို့/.test(m)
    );
    const hasNegation = negations.length > 0;
    const onlySoftFee = uniq.length > 0 && serious.length === 0 && hasNegation;

    if (serious.length > 0) {
      return {
        flagged: true,
        level: 'high',
        matches: uniq,
        reason:
          'This card mentions a fee, deposit or passport hold asked of the worker. Review before sharing. Lift does not send this to anyone.'
      };
    }
    if (uniq.length > 0 && !onlySoftFee) {
      return {
        flagged: true,
        level: 'medium',
        matches: uniq,
        reason:
          'Fee-related words appear on this card. Check whether the worker is asked to pay. Confirm before sharing.'
      };
    }
    if (hasNegation || (uniq.length > 0 && onlySoftFee)) {
      return {
        flagged: false,
        level: 'cleared',
        matches: uniq,
        reason: 'Poster text says fees are not charged (or only “no fee” language). Still verify with the source.'
      };
    }
    return { flagged: false, level: 'none', matches: [], reason: 'No fee or deposit language found in extracted fields.' };
  }

  /**
   * Rule-based extract from pasted poster text (English-oriented).
   * Never invents missing fields — unmarked → NOT STATED.
   */
  function extractFromText(text, meta) {
    const raw = String(text || '').trim();
    const card = emptyCard(
      Object.assign({ extractor: 'text-rules', invented: false, mode: 'text' }, meta || {})
    );
    if (!raw) return card;

    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    // Title heuristics
    const titleLine =
      lines.find((l) => /^(?:we'?re\s+hiring|hiring|wanted|job\s*title)\b/i.test(l)) ||
      lines.find((l) => /\b(?:sales\s+staff|cashier|helper|staff|manager|worker)\b/i.test(l));
    if (titleLine && !/^we'?re\s+hiring$/i.test(titleLine)) {
      card.job_title = field(titleLine.replace(/^(?:job\s*title\s*[:：]\s*)/i, ''), titleLine, 0.6);
    } else if (titleLine) {
      const next = lines[lines.indexOf(titleLine) + 1];
      if (next) card.job_title = field(next, next, 0.55);
    }

    const salary = raw.match(/salary\s*[-–:]?\s*([^\n]+)/i);
    if (salary) {
      const period = /\/\s*month|per\s+month|monthly|တစ်လ/i.test(salary[1])
        ? salary[1].match(/(?:\/\s*month|per\s+month|monthly|တစ်လ)/i)[0]
        : NOT_STATED;
      card.pay = payField(salary[1].trim(), period === NOT_STATED ? NOT_STATED : period, salary[0]);
    }

    const loc = raw.match(/location\s*[:：]\s*([^\n]+)/i);
    if (loc) card.location = field(loc[1].trim(), loc[0], 0.7);

    const apply = raw.match(/apply[^\n]{0,80}/i);
    if (apply) card.how_to_apply = field(apply[0].trim(), apply[0], 0.6);

    const phone = raw.match(/(?:\+?95\s*)?0?9[\d\s-]{7,14}/);
    const url = raw.match(/https?:\/\/\S+|www\.\S+/i);
    if (phone || url) {
      const bits = [phone && phone[0], url && url[0]].filter(Boolean).join('; ');
      const quote = [phone && phone[0], url && url[0]].filter(Boolean).join('\n');
      if (card.how_to_apply === NOT_STATED) card.how_to_apply = field(bits, quote, 0.65);
    }

    const feeBlock = lines.filter((l) => FEE_ASK_PATTERNS.some((re) => re.test(l)));
    if (feeBlock.length) {
      card.fees_mentioned = field(feeBlock.join('; '), feeBlock.join('\n'), 0.8);
    }

    // Employer if "TRM" / company line
    const emp = lines.find((l) => /\b(?:talent resources myanmar|\btrm\b|company\s*[:：])/i.test(l));
    if (emp) card.employer = field(emp.replace(/^company\s*[:：]\s*/i, ''), emp, 0.55);

    return card;
  }

  /**
   * Open-weights / remote extractor placeholder.
   * When LIFT_JOB_CARD_ENDPOINT is set on window, POST { imageBase64, mime } and expect JSON card.
   * Otherwise returns null so caller falls back to fixture/text.
   */
  async function extractViaOpenWeights(imageBase64, mime) {
    const endpoint =
      (typeof root !== 'undefined' && root.LIFT_JOB_CARD_ENDPOINT) ||
      (typeof process !== 'undefined' && process.env && process.env.LIFT_JOB_CARD_ENDPOINT) ||
      '';
    if (!endpoint) return null;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mime: mime || 'image/png' }),
      signal: AbortSignal.timeout(120000)
    });
    if (!res.ok) throw new Error('open_weights_http_' + res.status);
    const data = await res.json();
    if (!data || typeof data !== 'object') throw new Error('open_weights_bad_json');
    // Expect either { parsed: card } or card fields directly
    const parsed = data.parsed || data.card || data;
    parsed._meta = Object.assign(
      { extractor: 'open-weights', invented: false, mode: 'remote' },
      parsed._meta || {}
    );
    return parsed;
  }

  /**
   * Main entry: extract a job card.
   * options: { fixtureId, text, imageBase64, mime }
   * Priority: fixtureId → open-weights (if configured) → text rules → empty.
   */
  async function extract(options) {
    const opts = options || {};
    if (opts.fixtureId) {
      const f = FIXTURES[opts.fixtureId];
      if (!f) throw new Error('unknown_fixture');
      // Deep clone card
      return JSON.parse(JSON.stringify(f.card));
    }
    if (opts.imageBase64) {
      try {
        const remote = await extractViaOpenWeights(opts.imageBase64, opts.mime);
        if (remote) return remote;
      } catch (err) {
        // Fall through to text if provided; otherwise rethrow with clear mode
        if (!opts.text) {
          const card = emptyCard({
            extractor: 'open-weights-unavailable',
            invented: false,
            mode: 'stub',
            error: String(err && err.message ? err.message : err)
          });
          card._meta.hint =
            'Open-weights endpoint not configured or failed. Use a demo poster or paste the visible poster text. Myanmar cannot use Meta Model API; self-host Muse Glimmer (see docs/meta-hackathon).';
          return card;
        }
      }
    }
    if (opts.text) return extractFromText(opts.text, { source: 'paste' });
    return emptyCard({ extractor: 'none', mode: 'empty' });
  }

  function conversationCoachPrompts(card, feeRisk) {
    const prompts = [
      'Who is the employer, and is this a direct hire or an agency?',
      'What is the exact pay amount and the pay period (day / week / month)?',
      'What are the working hours or shifts?',
      'Are there any fees, deposits or costs I must pay before or after starting?',
      'Will my passport or documents be held by anyone?'
    ];
    if (feeRisk && feeRisk.flagged) {
      prompts.unshift(
        'This poster may ask the worker for money or to hand over a passport. Ask for the fee amount in writing and who receives it before you share or apply.'
      );
    }
    if (card && card.pay === NOT_STATED) {
      prompts.push('Pay is NOT STATED on the card — ask the source to write the amount and period.');
    }
    return prompts;
  }

  const api = {
    NOT_STATED,
    FIELDS,
    listFixtures,
    getFixture,
    extract,
    extractFromText,
    assessFeeRisk,
    conversationCoachPrompts,
    extractViaOpenWeights,
    field,
    payField
  };

  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LiftJobCard = api;
})(typeof window === 'undefined' ? globalThis : window);
