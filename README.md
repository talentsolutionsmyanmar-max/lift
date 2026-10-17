# Lift

Mobile-first daily-life and community prototype for Myanmar migrants in Thailand and their families. Free to use; designed around dignity, understandable next steps and family opportunity.

## Review status

Public source snapshot prepared15 October2026 for independent frontend/UI/UX review. This clean repository excludes private working history, local credentials, participant data, QA screenshots and internal operating notes.

Live isolated team test: https://lift-team-test.vercel.app/

The team test simulates community sends in memory. Real submissions are closed. Backend code here is experimental and not deployed as part of the team test. Do not connect a database, enable intake or deploy the repository root for a design review.

## Run locally

Serve `dist/` using `python3 -m http.server 4173 --directory dist`. For the exact isolated team-test experience, serve `artifacts/workflow-followup-team-test-release/` instead. Use invented examples only.

Run regression checks with `npm test`. Install dependencies with `npm ci` if needed for backend development; no credentials are needed for static UI review.

## Frontend entry points

- `dist/index.html`: app shell and script order.
- `dist/styles.css`, `dist/mobile.css`, `dist/myanmar.css`: layout and Myanmar typography.
- `dist/workflow.js`, `dist/workflow-ui.js`: navigation.
- `dist/companion-ui.js`: home/task structure.
- `dist/community-ui.js`, `dist/community-choices.js`: choice-based composer.
- `dist/cashflow-ui.js`, `dist/cashflow-transfer-ui.js`: result presentation and explicit cash carryover.
- `dist/learning.css`: learning and cash-flow components.
- `docs/`: selected build/test inputs and draft designs. Copy-review provenance denotes AI wording review, not participant validation.

## Current design assignment

Research/proposals only: explain each activity's benefit before starting, why questions matter, what result people receive, and one useful next action. Reduce crowding and confusing steps. Propose coherent mobile results/dashboard patterns and reusable light/dark design tokens. Preserve green identity, red dot on the i, and dim doorway/sunrise/plant motifs. All new Myanmar copy requires review and user comprehension testing.

No implementation of the proposed redesign is approved yet. Do not infer a job, renewed document, school place or improved finances from a checkbox.

No software licence is granted by publication alone. Bundled Padauk font licensing is in `dist/fonts/OFL.txt`.

## Clear Job Cards (Meta hackathon demo — 17 Oct 2026)

Privacy-first poster → honest job card for Myanmar migrant workers. Stays part of Lift’s non-commercial prototype; separate from ReferTRM’s commercial employer portal.

### What changed
- New page: `dist/job-card.html` (also `/job-card` via Vercel rewrite).
- Client modules: `dist/job-card-extract.js`, `dist/job-card-ui.js`, `dist/job-card.css`.
- Demo posters: `dist/demo-posters/tiktok-01.png`, `tiktok-02.png`, `tiktok-06.png` (from Meta harness OCR set).
- Fixture path quotes OCR-visible English only; garbled Burmese → `NOT STATED` (never invented).
- Synthetic `demo-fee-ask` fixture shows fee / deposit / passport-hold red-flag before download.
- Conversation coach prompts stay on-device; link back to `#prepare`.
- Open-weights hook: set `window.LIFT_JOB_CARD_ENDPOINT` to a self-hosted Muse Glimmer (or compatible) JSON extractor. Myanmar cannot use Meta Model API; demo works offline via fixtures + pasted text.
- Home and Useful information link to Clear Job Cards.
- Tests: `tests/job-card-extract.test.cjs` (7 passing).
- Docs: `docs/meta-hackathon/WHAT-CHANGED-2026-10-17.md`, `docs/meta-hackathon/META-PITCH-NOTE-2026-10-17.md`.

### Run the demo locally
```bash
python3 -m http.server 4173 --directory dist
# open http://127.0.0.1:4173/job-card.html
```

### Dignity wall (unchanged)
No GPS, no worker location maps, no accounts requiring ID, no employer dashboards of people, no analytics trackers on this page. Share = download on device only, gated if fee language is flagged.

### Burmese copy
English-first for new Clear Job Cards strings. Full Myanmar UI labels marked **NEED-CCO** — do not invent Burmese with an LLM.
