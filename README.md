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
