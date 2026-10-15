# Lift — "Quiet doorway" frontend

The approved Lift frontend, implemented faithfully from the design review.
This is a self-contained static build — no framework, no build step, no
credentials, no network calls for the core experience.

## Run locally

```
python3 -m http.server 4173 --directory redesign
# open http://localhost:4173/index.html
```

No install needed. The deterministic engines (`spending.js`, `cashflow.js`,
`dates.js`, `family.js`, `community.js`) are reused verbatim from `dist/`.

## What this is

- **One navigation model** — Home · Daily life · Family · Community · Mine — rendered
  once from a single source (`SECTIONS` in `app.js`). No hardcoded shell nav, no
  runtime overwrite, no script-order-dependent screen overrides.
- **Explicit page renderers** — each route maps to a function; nothing is
  monkey-patched across files.
- **Three-beat activity pattern** — why start → answer → result + meaning + one
  next action — applied to everyday questions, family learning, dates and money.
- **Token-based design system** (`styles.css`) with light + dark themes, bundled
  Padauk for Myanmar, enlarged-text mode, and a single icon family.
- **Keyed bilingual copy** (`copy.js`) — templates look strings up by key; no DOM
  text-node rewriting. New Myanmar wording is marked `DRAFT-CCO` for review.

## Data boundaries (deliberate)

- Session-only by default. Optional **local** save of standard selection-cards,
  behind an explicit user choice (Mine → privacy), with honest failure handling.
- **Never persisted:** raw money amounts, entered document dates, free text, or
  community drafts. Community submissions remain closed; the composer only prepares
  a draft you can copy/download — nothing is sent.

## Files

| file | role |
|---|---|
| `index.html` | shell + script order |
| `styles.css` | tokens, themes, components |
| `copy.js` | bilingual keyed copy (review surface for CCO) |
| `i18n.js` | locale state + formatters |
| `store.js` | session state + honest local-save |
| `app.js` | shell, single nav source, router, shared components |
| `pages.js` | the four situations + community + mine |
| `spending/cashflow/dates/family/community.js` | deterministic engines (reused) |
| `fonts/` | bundled Padauk (OFL) |

## Status

Design approved; implemented per the review. New Myanmar copy is draft pending
CCO language review. Not published; community submissions closed by design.
