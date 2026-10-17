/* Lift offer check v1 — paste only. Rules engine + optional Meta (Llama) extraction step.
   Privacy: this module never logs, stores or transmits pasted text. Explanations come ONLY from
   the reviewed RULES table below (dated sources), never from model output. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LiftOfferCheck = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var REVIEWED = '2026-10-17';
  var SOURCES = {
    doe_change: { name: 'Department of Employment (DOE) — change of employer FAQ', url: 'https://www.doe.go.th/prd/alien/faq/param/site/152/cat/25/sub/24/pull/detail/view/faq-detail/object_id/184', checked: REVIEWED },
    doe_mou: { name: 'DOE — MOU employer-change rules (Thai PDF)', url: 'https://www.doe.go.th/prd/assets/upload/files/alien_th/96dd0f4c136f52018cc9700f067f0377.pdf', checked: REVIEWED },
    mol_laws: { name: 'Ministry of Labour (MOL) — laws index', url: 'https://www.mol.go.th/laws/', checked: REVIEWED },
    sso: { name: 'Social Security Office (SSO)', url: 'https://www.sso.go.th/wpr/', checked: REVIEWED },
    iom: { name: 'IOM Thailand — labour migration profile (2025)', url: 'https://thailand.iom.int/sites/g/files/tmzbdl1371/files/documents/2025-03/iom-labour-migration-profile-thailand.pdf', checked: REVIEWED },
    ilo: { name: 'ILO — Travel Smart, Work Smart', url: 'https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@asia/@ro-bangkok/documents/publication/wcms_099811.pdf', checked: REVIEWED },
    s64: { name: 'Chiang Saen Immigration — Section 64 border-work example', url: 'https://chiangsaen.immigration.go.th/wp-content/uploads/2024/01/%E0%B8%A7.7.pdf', checked: REVIEWED }
  };
  // Reviewed rules: id -> pattern + explanation + question + sources. Status: Lift team draft, CTO review pending.
  var RULES = [
    { id: 'document_hold', re: /\b(passport|ID card|identity card|pink card|work permit|documents?)\b[^.]*\b(held|hold|keep|kept|retain|retained|collect|surrender|give us|hand over|deposit)\b|\b(hold|keep|retain|collect|surrender)\b[^.]*\b(passport|ID card|pink card|work permit)\b/i,
      concern: 'The offer talks about someone else holding your passport or ID. Workers should keep their own identity documents; losing control of them can make it hard to leave or to prove your status.',
      question: 'Will I keep my own passport, ID and work permit the whole time? Can you write that in the contract?', sources: ['ilo', 'iom'] },
    { id: 'upfront_fee', re: /\b(registration|recruitment|agency|processing|placement|service|broker|application|visa|permit|training|medical|document)\s+(fee|fees|charge|cost)s?\b|\bpay\b[^.]*\b(before|first|in advance|upfront)\b|\b(fee|fees)\b[^.]*\b(baht|thb|฿|kyat|mmk)\b|\b(baht|thb|฿)\b[^.]*\bfee\b|\bfees?\b[^.]*\b(apply|may|discuss(ed)?|later)\b/i,
      concern: 'The offer asks for money connected to getting the job or the paperwork. Charges paid to brokers are often much higher than official government fees, and money paid upfront is hard to get back.',
      question: 'What exactly is this fee for, who receives it, and can I see the official government fee for it in writing with a receipt?', sources: ['iom', 'doe_change'] },
    { id: 'wage_deposit', re: /\b(deposit|bond|guarantee money|deduct(ed|ion)?|withh(e|o)ld)\b[^.]*\b(salary|wage|pay|month)/i,
      concern: 'The offer mentions deposits, bonds or deductions from wages. Unclear deductions can leave you owing money or unable to leave.',
      question: 'What will be deducted from my wages each month, for how long, and will it be written in the contract and on my payslip?', sources: ['ilo', 'iom'] },
    { id: 'no_permit', re: /\b(no|without|don'?t need( a)?|not needed|no need for)\b[^.]*\b(work permit|permit|visa|papers|documents|MOU|pink card)\b/i,
      concern: 'The offer suggests you can work without a permit or proper papers. Working without the right permit can put your status at risk.',
      question: 'Which work permit will I hold for this job, and who files it with the Department of Employment?', sources: ['doe_change', 'mol_laws'] },
    { id: 'area_scope', re: /\b(border|section 64|daily pass|border pass)\b|\b(any province|move you|transfer(red)? to)\b/i,
      concern: 'Some permits only allow work in a certain area or for a certain employer. Work outside what your permit allows can put your status at risk.',
      question: 'Does my current permit allow this job in this province with this employer? If not, who files the change and when?', sources: ['s64', 'doe_mou'] },
    { id: 'embassy_fee', re: /\bembassy\b[^.]*\b(fee|pay|charge|money)\b|\b(fee|pay|charge)\b[^.]*\bembassy\b/i,
      concern: 'The offer mentions Embassy fees through a middleman. Check official fees directly; fake or inflated Embassy fees are a known problem.',
      question: 'What is the official Embassy fee, and can I pay it directly and get an official receipt?', sources: ['iom'] }
  ];
  var MISSING = [
    { id: 'pay', re: /\b(salary|wages?)\b[^.]*\d|\d[^.]*(per day|\/day|a day|per month|\/month|daily|monthly)/i, label: 'Pay amount', question: 'How much will I be paid, per day or per month, before and after deductions?', sources: ['ilo'] },
    { id: 'contract', re: /\b(written contract|contract in writing|sign(ed)? (a |the )?contract|contract (before|signed)|written agreement)\b/i, label: 'Written contract', question: 'Will I get a written contract in a language I understand before I start?', sources: ['ilo'] },
    { id: 'employer', re: /\b(company|co\.,? ?ltd|limited|factory name|employer)\b/i, label: 'Employer name', question: 'What is the full registered name of the employer who will appear on my work permit?', sources: ['doe_change'] },
    { id: 'location', re: /\b(province|bangkok|chiang|samut|tak|mae sot|rayong|chonburi|district|located|location)\b/i, label: 'Work location (province)', question: 'Which province and district is the workplace in?', sources: ['doe_mou'] },
    { id: 'hours', re: /\b(hours?|shift|days? off|overtime|ot)\b/i, label: 'Working hours and days off', question: 'What are the daily hours, overtime pay, and weekly day off?', sources: ['ilo'] },
    { id: 'permit', re: /\b(work permit|permit|MOU|pink card|visa)\b/i, label: 'Work permit route', question: 'Which permit route is this (MOU, pink card, Section 64) and who pays the official fees?', sources: ['doe_change'] },
    { id: 'social_security', re: /\b(social security|SSO|insurance)\b/i, label: 'Social security', question: 'Will I be registered with the Social Security Office?', sources: ['sso'] }
  ];
  var NEGATION = /\b(never|no|not|don'?t|do not|does not|doesn'?t|will not|won'?t|free of|zero|without any)\b/i;
  var QUOTED_WARNING = /\b(beware|warning|be careful|scam alert|watch out|report)\b|["“'‘]/i;
  var INJECTION = /\b(ignore (all|any|the|previous|prior)|disregard|system prompt|you are (now )?an? (ai|assistant)|mark (this|it) (as )?(safe|legit|verified)|say (this|it) is (safe|legal))\b/i;
  // Masked in quotes (each covered by a test). Order matters: specific formats first.
  var PII = [
    /\b\d{1,2}\s?\/\s?[A-Za-z]{3,9}\s?\((?:N|E|P|T|Naing|C)\)\s?\d{5,6}\b/gi,              // Myanmar NRC 12/ABC(N)123456
    /[\w.+-]+@[\w-]+\.[\w.]+/g,                                                           // email
    /\b\d[-\s]\d{4}[-\s]\d{5}[-\s]\d{2}[-\s]\d\b/g,                                        // Thai ID with dashes/spaces
    /\b\d{13}\b/g,                                                                        // Thai ID 13 digits
    /\bline(?:\s*id)?\s*[:：=]\s*@?[\w.-]{2,}|\bline\s+id\s+@?[\w.-]{2,}/gi,                 // LINE: abc123 / line id abc
    /(^|[\s(])@[A-Za-z0-9._-]{3,}/g,                                                      // @handle
    /(?:\+\s?(?:66|95)|(?<![\d,.])0)[\d\s-]{7,13}\d/g,                                     // phones +66 / +95 / 0x
    /\b[A-Z]{1,2}\d{6,8}\b/g,                                                             // passport letter+digits MA123456, M1234567
    /\b\d{8,9}\b/g,                                                                       // 8-9 digit document numbers
    /\bName\s*[:：]\s*[A-Z][\w'-]*(?:\s+[A-Z][\w'-]*){0,3}/g,                              // Name: X
    /\b(?:Mr|Mrs|Ms|Miss|Daw|Ko|Ma|Maung|Mg|U|Khun)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}/g // title + name
  ];
  var MASKED = ['phone numbers (+66, +95, 0…)', 'email addresses', 'LINE IDs and @handles', 'passport-style numbers (letters + digits, or 8–9 digits)', 'Thai 13-digit ID numbers', 'Myanmar NRC numbers', 'names written after “Name:” or a title (Mr, Ms, U, Daw, Ko, Ma, Khun…)'];
  var BANNED = /\b(safe|legal|verified|legit(imate)?|scam|trustworthy|genuine)\b/i;

  function sentences(text) {
    return String(text || '').replace(/\r/g, '').split(/(?<=[.!?。])\s+|\n+/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 200);
  }
  function redact(s) { var out = s; PII.forEach(function (re) { out = out.replace(re, function (m, lead) { return (typeof lead === 'string' && /^[\s(]$/.test(lead) ? lead : '') + '[personal detail hidden]'; }); }); return out; }
  function hasPII(text) { return PII.some(function (re) { re.lastIndex = 0; var r = re.test(text); re.lastIndex = 0; return r; }); }
  function ruleById(id) { for (var i = 0; i < RULES.length; i++) if (RULES[i].id === id) return RULES[i]; return null; }
  function srcs(ids) { return ids.map(function (k) { return SOURCES[k]; }); }

  // Clauses: negation only applies inside the clause that contains the trigger.
  function clauses(s) { return s.split(/\s*(?:[;:]|,(?!\s*[\d฿]))\s*|\s+(?:but|and|however|although|though|except|while|plus|then)\s+/i).filter(Boolean); }
  function classifyClause(rule, c) {
    if (!rule.re.test(c)) return null;
    if (QUOTED_WARNING.test(c) && /\b(beware|warning|be careful|watch out|report|never pay)\b/i.test(c)) return 'unclear';
    if (rule.id !== 'no_permit' && NEGATION.test(c)) return 'negated';
    if (rule.id === 'upfront_fee' && /\b(may|might|some|possible|depends|to be discussed|discuss|ask)\b/i.test(c)) return 'unclear';
    return 'concern';
  }
  // Classify one sentence for one rule: 'concern' | 'unclear' | null
  function classify(rule, s) {
    var ks = clauses(s).map(function (c) { return classifyClause(rule, c); }).filter(Boolean);
    if (!ks.length) return null; // trigger must sit inside one clause
    var hasNeg = ks.indexOf('negated') >= 0, hasConcern = ks.indexOf('concern') >= 0;
    if (hasNeg && hasConcern) return 'unclear'; // same practice both denied and stated in one sentence
    if (hasConcern) return 'concern';
    if (ks.indexOf('unclear') >= 0) return 'unclear';
    return null;
  }

  /** Rules-only analysis. Returns sentence-level hits (indices into sentences()). */
  function rulesExtract(text) {
    var ss = sentences(text), hits = [];
    ss.forEach(function (s, i) {
      if (INJECTION.test(s)) hits.push({ sentence: i, rule: 'instruction_in_text', kind: 'unclear' }); // keep evaluating every rule
      RULES.forEach(function (r) { var k = classify(r, s); if (k) hits.push({ sentence: i, rule: r.id, kind: k }); });
    });
    return { engine: 'rules', hits: hits };
  }

  /** Validate untrusted model output: only known rule ids, valid sentence indices, known kinds. */
  function sanitizeModelHits(raw, n) {
    var list = raw && Array.isArray(raw.hits) ? raw.hits : [];
    return list.filter(function (h) { return h && Number.isInteger(h.sentence) && h.sentence >= 0 && h.sentence < n && ruleById(h.rule) && (h.kind === 'concern' || h.kind === 'unclear'); }).slice(0, 40)
      .map(function (h) { return { sentence: h.sentence, rule: h.rule, kind: h.kind }; });
  }

  /** Build the report. Explanations always from RULES; quotes are exact sentences (personal details hidden). */
  function buildReport(text, extraction) {
    var ss = sentences(text), seen = {}, concerning = [], cannot = [], missing = [];
    (extraction && extraction.hits || []).forEach(function (h) {
      var key = h.sentence + ':' + h.rule; if (seen[key]) return; seen[key] = 1;
      var quote = redact(ss[h.sentence] || '');
      if (h.rule === 'instruction_in_text') {
        cannot.push({ id: 'instruction_in_text', quote: quote, concern: 'This sentence reads like an instruction to a computer rather than part of a job offer. Lift ignored it and did not follow it.', question: 'Ask the sender to send the offer again without this sentence.', sources: [] });
        return;
      }
      var r = ruleById(h.rule); if (!r) return;
      var item = { id: r.id, quote: quote, concern: r.concern, question: r.question, sources: srcs(r.sources) };
      if (h.kind === 'concern') concerning.push(item);
      else { item.concern = 'Lift could not tell from this wording whether it is a concern (it may be a warning, a negation, or a vague amount). ' + r.concern; cannot.push(item); }
    });
    MISSING.forEach(function (m) { if (!m.re.test(text)) missing.push({ id: m.id, label: m.label, concern: m.label + ' is not written in the text you pasted.', question: m.question, sources: srcs(m.sources) }); });
    if (!ss.length) cannot.push({ id: 'empty', quote: '', concern: 'Nothing was pasted, so Lift cannot check anything.', question: 'Paste the words of the offer you received.', sources: [] });
    cannot.push({ id: 'scope', quote: '', concern: 'Lift cannot check whether the employer, the broker or the permit is real, or whether what is written will actually happen. Lift only reads the words you pasted.', question: 'Confirm the employer and permit at your provincial Employment Office.', sources: [SOURCES.doe_change] });
    return {
      engine: extraction && extraction.engine || 'rules',
      reviewedRules: REVIEWED,
      concerning: concerning, missing: missing, cannotAssess: cannot,
      noFlagsNotice: 'Finding no concerning wording does NOT mean this offer is safe or real. Lift only reads the words you pasted.',
      personalDetailsHidden: hasPII(text)
    };
  }

  /** Model step interface. `model` = async (sentences) => {hits:[...]}. Falls back to rules on any failure. */
  async function analyze(text, opts) {
    opts = opts || {};
    var base = rulesExtract(text);
    if (typeof opts.model === 'function') {
      try {
        var raw = await opts.model(sentences(text));
        var mh = sanitizeModelHits(raw, sentences(text).length);
        // Union: model can add meaning from varied wording; rules hits stay (model cannot remove a rules concern).
        return buildReport(text, { engine: 'llama+rules', hits: base.hits.concat(mh) });
      } catch (e) { var r = buildReport(text, base); r.engine = 'rules (model unavailable)'; return r; }
    }
    return buildReport(text, base);
  }

  function reportText(report) { return JSON.stringify(report); }
  return { MASKED: MASKED, clauses: clauses, REVIEWED: REVIEWED, SOURCES: SOURCES, RULES: RULES, MISSING: MISSING, BANNED: BANNED, sentences: sentences, redact: redact, rulesExtract: rulesExtract, sanitizeModelHits: sanitizeModelHits, buildReport: buildReport, analyze: analyze, reportText: reportText };
});
