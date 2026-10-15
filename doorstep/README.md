# Lift — Doorstep frontend

The founder-selected **Doorstep** design, built as a working, dependency-free mobile frontend.
It supersedes the earlier "Quiet doorway" (`redesign/`) and the separate local Codex redesign
where they conflict. **Nothing here is deployed.** `dist/`, the backend, `vercel.json` and the
team-test wrapper are untouched.

> Every activity hands you a card you can carry through the next door. The sill (a band of light
> under a door) is the brand gesture, the activity progress line and the lit edge of every card:
> **solid = saved by your choice · broken = on this page only · dashed outline = draft, not sent**,
> always paired with words.

## Run locally

```
python3 -m http.server 4180          # from the repository ROOT (fonts fall back to ../dist/fonts)
open http://localhost:4180/doorstep/index.html          # Myanmar (default)
open http://localhost:4180/doorstep/index.html?lang=en  # English
open http://localhost:4180/doorstep/index.html?copy=dev # shows copy-provenance markers
```

No install, no build step. Regenerate copy after editing `copy/copy-en.json`:
`node doorstep/tools/build-copy.mjs` (from the repository root).

## Tests

| Suite | Command | Result (15 Oct 2026, headless Chromium 148) |
|---|---|---|
| Unit (store boundaries, copy provenance) | `node --test doorstep/tests/unit.test.mjs` | 7 / 7 pass |
| End-to-end journeys + overflow matrix + a11y basics | `python3 doorstep/tests/e2e.py` (needs `pip install playwright`) | 60 / 60 pass |

The overflow check covers 320, 360, 430 and 1280px × English and Myanmar × light and dark ×
normal and A+ × 9 screens (288 combinations). These are **browser checks only**. Physical-phone,
TalkBack and migrant comprehension testing have not been done.

The repository-wide `npm test` fails on a clean `main` checkout without `npm ci` (missing
`@vercel/blob`). This is unrelated to `doorstep/`.

## What works

| Area | Behaviour |
|---|---|
| Shell | One header (A+, theme, language), the sill, and one 3-item nav (Home · Community · Mine). The nav is hidden inside activity steps, which show the dock instead. One delegated event handler, so re-renders never lose handlers. |
| Everyday questions | Intro → situation (housing / transport / phone / food, plus "Something else" → Community) → questions with Why we ask, per-option reasons, "I am not sure — add all three", and the live card tray → result card with the exact chosen questions, meaning, what is unclear, one next step, Show large, Copy, Download, Edit and optional Save. |
| Family learning | Intro → topics (each shows the question it adds) → educator question card plus the matching named resources (LearnBig / Google Translate for language or device; UNICEF / UNESCO otherwise), behind an external-link sheet. No child data collected. |
| Important dates | Process → date + source + "I have checked" confirmation → reminder card ("Date entered by you — not independently confirmed", past-date warning) and a valid `.ics` with a neutral title. **Not saved** in this version. |
| Money | Period → money available (**required; blank is never treated as zero**) → costs (blank = "Not entered — not included", with a note that the real remainder may be lower) → ≈ result with every input listed. Next step carries the calculated remainder into **Plan the days ahead** (existing `LiftCashflow` engine): first day with a gap, largest shortfall, an "earlier shortfall despite a positive end" lesson, a "what if income is three days late" toggle and a per-day table. **Never saved.** |
| Mine | Empty state; one or several real cards; "What to do next"; Open; Edit (answers restored, same card updated); saved / on this page only / changed since saved; Remove (with confirm); storage-unavailable note. No fictional examples. |
| Saving | The sheet opens with **no option chosen** and writes nothing. Confirm requires a choice. Shows exactly what is kept. Writes are verified by reading back; a failure keeps the result and says "Could not save". A failed delete never claims success. |
| Community | Closed. Private preparation from fixed choices; draft marked "Your draft — not reviewed · Not sent · On this page only"; Copy and Download only. No send, post, rating, voting or simulation. |
| Myanmar | Default language. Padauk is bundled (WOFF2, full glyph set; TTF fallback from `dist/fonts`). Strings with no Myanmar (P) display in English with `lang="en"`, never as fake Myanmar. |

## Data boundaries (what can leave memory)

Only after an explicit confirm, in `localStorage["lift.doorstep.saved.v1"]`, at most 20 records of:
`{id, kind: "everyday"|"family", topic, keys[] | topics[], next, savedAt}`. Keys are whitelisted on
both write and read. **Never stored:** money amounts, document dates, free text, community drafts,
identifying details, or preferences (theme, language and A+ live in memory). No network calls,
analytics or cloud storage. Under the team-test's opaque sandbox, storage throws and the app takes
the honest "Saving is not available in this browser" path. Do not add `allow-same-origin` to fix it.

## Copy provenance

`copy/copy-review.csv` and `copy/copy-review.md` list every key: English · Myanmar candidate ·
R / L / P · source file · review required. Provenance is **derived** by `tools/build-copy.mjs`
from the repository's CCO-reviewed files, never hand-labelled:

- **R 181**: exact English match in CCO-reviewed source.
- **L 42**: inherited Myanmar candidates (from the design package, originally the incumbent's
  working drafts) or shipped-but-unreviewed Myanmar. Shown in the UI and need CCO confirmation.
  Two known errors (ပြိုင်ဘက်, ကျွတ်ပါ) were excluded.
- **P 83**: new wording with no Myanmar. Shown in English. Needs CCO authoring.

A release candidate for Myanmar users needs CCO to clear L and P first.

## Architecture

```
doorstep/
  index.html            shell + script order
  css/doorstep.css      approved design system (tokens, components) — from the package
  css/app.css           behaviour-only additions (sticky shell, dialog, toast, focus)
  fonts/                Padauk WOFF2 + OFL.txt
  js/copy.js            GENERATED keyed copy with provenance
  js/engines/*.js       deterministic engines, verbatim from dist/ (spending, cashflow, dates, family)
  js/i18n.js            t()/txt(), Myanmar digits for counts, Latin ฿ for money
  js/icons.js           Lucide-grid icon set (ISC) + outlined wordmark
  js/store.js           explicit state + opt-in local save with verified read-back
  js/ui.js              components (mirrors docs/components.md)
  js/screens.js         route renderers: home, 5 activities, mine, community, show
  js/app.js             router, single delegated handler, sheets, copy/download/ics
  copy/                 copy-en.json (source), inherited-my.json, copy-review.{csv,md}
  docs/                 components.md, design-gallery.html (visual source of truth)
  tests/                unit.test.mjs, e2e.py
  tools/build-copy.mjs
```

## Deviations from the design gallery (intentional)

1. **Everyday has 2 steps** (situation → questions), so it shows "Step 2 of 2". The gallery showed
   the questions as step 1 of 2. The start card preselects Housing.
2. **No "Skip" link on the questions step.** Skipping there would produce no card; "I am not sure —
   add all three" covers uncertainty. Other steps use "I am not sure" or "Not sure / no date" where
   it is meaningful.
3. **Save sheet opens with nothing chosen** (the mockup preselected Keep), as the assignment requires.
4. **Family learning** follows the same intro → choose → result pattern. Resources sit on the result
   and match the chosen topics. The gallery showed facts, choices and resources on one screen.
5. **Reviewed wording replaced mockup wording** where meanings match exactly (e.g. "Questions to take
   with me", "What is still unclear", "One next step").
6. **Dates are not saved** (the assignment forbids persisting document dates), so date cards show
   "Not saved in this version" and offer the calendar file instead.
7. Dates are displayed exactly as entered (YYYY-MM-DD), not reformatted, so they match the paper.

## Deployment candidate & rollback

The candidate is the static folder `doorstep/` (manifest: `doorstep/MANIFEST.txt`, with SHA-256 per
file). It is **not wired** to Vercel: `vercel.json` still serves `dist/`. Recommended path when the
CTO approves:

1. Preview-deploy `doorstep/` as its own output directory on a separate preview project, or copy it
   to a preview path. Do not alias it to production.
2. Re-run `doorstep/tests/e2e.py` against the preview URL (`LIFT_URL=… python3 doorstep/tests/e2e.py`).
3. **Rollback:** the folder is additive, so rollback is reverting the merge commit (or pointing the
   alias back to the previous deployment). No data migration is involved, and the only browser data
   is the opt-in key `lift.doorstep.saved.v1`.

## Not done / remaining work

- CCO authoring for 83 P strings and confirmation of 42 L strings (see `copy/copy-review.md`).
- Physical low-end Android, TalkBack and offline (service-worker) checks. No service worker is
  included; `dist/sw.js` is not reused.
- Migrant comprehension test against the acceptance sentence; validating the "about 2 minutes" estimates.
- Thai rendering for Show large (no reviewed Thai exists).
- Durable saving beyond this browser, and staffed community review: product decisions, not built.
- Preferences (language, theme, A+) are not remembered between visits. Persisting them needs a
  product decision because it widens what is stored.
- Calendar event title "Review my saved date" is reviewed copy but says "saved" while dates are
  not stored in Lift. Ask CCO for a neutral variant.
