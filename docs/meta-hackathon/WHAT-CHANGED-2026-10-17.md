# Lift Clear Job Cards — what changed (17 Oct 2026, Asia/Rangoon)

## Goal
Make Lift eye-catching for the Meta Global AI Developer Hackathon (apply by 25 Oct ET) while keeping the dignity wall: no tracking, no GPS, no accounts requiring ID, Lift separate from ReferTRM commercially.

## Shipped
| Item | Path |
|------|------|
| Clear Job Cards UI | `dist/job-card.html` |
| Extractor + fee red-flag + coach prompts | `dist/job-card-extract.js` |
| UI controller | `dist/job-card-ui.js` |
| Styles | `dist/job-card.css` |
| Demo posters | `dist/demo-posters/*.png` |
| Vercel route | `/job-card` → `job-card.html` |
| Entry links | Home + Useful information in `dist/app.js` |
| Tests | `tests/job-card-extract.test.cjs` (7/7 pass) |
| Pitch note | `docs/meta-hackathon/META-PITCH-NOTE-2026-10-17.md` |

## Behaviour
1. **Poster → honest job card** — 8 fields: job title, employer, location, pay (+ period), hours/shift, requirements, how to apply, fees mentioned. Each field has a verbatim source quote or is `NOT STATED`.
2. **Fee / deposit red-flag** — keyword + negation rules; high/medium flag blocks download until the user acknowledges.
3. **Conversation coach** — browser-only prompt list; links to existing `#prepare` checklist.
4. **Demo path** — pick a fixture poster (no model required) or paste visible text. Optional `window.LIFT_JOB_CARD_ENDPOINT` for self-hosted open-weights vision later.

## Explicitly not done
- Meta application was **not** submitted.
- ReferTRM employer portal was **not** merged or linked as a worker-locator.
- No live Muse Glimmer call (needs Modal token + GPU; harness remains in `/workspace/meta-hackathon/harness`).
- No new Burmese UI copy invented (NEED-CCO).

## How to run
```bash
cd /workspace/lift-app
python3 -m http.server 4173 --directory dist
# http://127.0.0.1:4173/job-card.html
node --test tests/job-card-extract.test.cjs
```

Live production URL unchanged until deploy: https://lift-next-step.vercel.app/  
After deploy, Clear Job Cards will be at `/job-card` or `/job-card.html`.
