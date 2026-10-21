# Lift

Lift is a non-commercial open-source project for Myanmar migrant workers in Thailand and their families.

It is a mobile-first daily-life and community prototype. The work is designed around dignity, understandable next steps and family opportunity. There is no platform revenue. Lift does not locate or track workers.

Related work: [www.refertrm.com](https://www.refertrm.com/)

## Healthcare

Everyday healthcare for migrants and families is a first-class product area — not a footnote.

Lift is being shaped so people can find a clear next step for health and support: what to ask, what to prepare, and where reviewed information may help. This is not a clinic, diagnosis tool or emergency service. Health information needs a qualified reviewer before it is published as guidance.

In this snapshot, health already appears as a community topic (“Health and support”). A dedicated Healthcare area is part of the product direction and is not a separate implemented UI here.

## What the prototype covers

- **Healthcare** — everyday health and support as a core topic
- Everyday life questions
- Family and learning
- Documents and dates
- Work and earnings
- Community questions and sharing
- Optional on-device spending calculations

No account or identity documents are required. Plans and optional spending calculations run on the person’s device.

## Current status

This repository is a research and design-review snapshot, not a live public service.

- Isolated team test: https://lift-team-test.vercel.app/
- The team test simulates community sends in memory. Real submissions are closed.
- Backend code here is experimental and is not deployed as part of the team test.
- Do not connect a database, enable intake or deploy the repository root for a design review.

## Review status

Public source snapshot prepared 15 October 2026 for independent frontend/UI/UX review. This clean repository excludes private working history, local credentials, participant data, QA screenshots and internal operating notes.

## Run locally

Serve `dist/` with:

```bash
python3 -m http.server 4173 --directory dist
```

For the exact isolated team-test experience, serve `artifacts/workflow-followup-team-test-release/` instead. Use invented examples only.

Run regression checks with `npm test`. Install dependencies with `npm ci` if needed for backend development. No credentials are needed for static UI review.

## Frontend entry points

- `dist/index.html`: app shell and script order
- `dist/styles.css`, `dist/mobile.css`, `dist/myanmar.css`: layout and Myanmar typography
- `dist/workflow.js`, `dist/workflow-ui.js`: navigation
- `dist/companion-ui.js`: home/task structure
- `dist/community-ui.js`, `dist/community-choices.js`: choice-based composer (includes Health and support)
- `dist/cashflow-ui.js`, `dist/cashflow-transfer-ui.js`: result presentation and explicit cash carryover
- `dist/learning.css`: learning and cash-flow components
- `docs/`: selected build/test inputs and draft designs. Copy-review provenance denotes AI wording review, not participant validation.

## Current design assignment

Research and proposals only: explain each activity’s benefit before starting, why questions matter, what result people receive, and one useful next action. Reduce crowding and confusing steps. Propose coherent mobile results/dashboard patterns and reusable light/dark design tokens. Preserve green identity, red dot on the i, and dim doorway/sunrise/plant motifs. All new Myanmar copy requires review and user comprehension testing.

No implementation of the proposed redesign is approved yet. Do not infer a job, renewed document, school place, improved finances or a health outcome from a checkbox.

## Licence

This project is released under the MIT Licence. See [LICENSE](LICENSE).

The bundled Padauk font is licensed separately under the SIL Open Font License. See `dist/fonts/OFL.txt`.
