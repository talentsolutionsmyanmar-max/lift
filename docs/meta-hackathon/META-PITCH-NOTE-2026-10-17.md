# Meta Global AI Developer Hackathon — pitch note (Lift / Clear Job Cards)

**Status:** Draft for Ko Ko. Do **not** submit until he reviews. Deadline 25 Oct 2026, 11:59 PM ET (= 26 Oct 2026, 10:29 AM Asia/Rangoon), or earlier if 20,000 spots fill.

## Track / theme
- Track: **Startup** (or Builder if form prefers a non-commercial prototype — Lift itself is non-commercial; Talent Resources Myanmar is the startup).
- Theme: **Build for Your World**.

## One-line pitch
Lift turns messy job posters into fee-safe next steps for Myanmar migrant workers in Thailand — with no account, no tracking, and every field either quoting the poster or marked NOT STATED — on Meta open weights.

## Project idea (paste-ready)
Clear Job Cards inside Lift: a worker photographs a Facebook / Viber / TikTok job poster. We structure eight fields (title, employer, location, pay + period, hours, requirements, how to apply, fees/deposits). The model must copy source text verbatim; anything missing is NOT STATED — never invented pay or fees. Fee, deposit or passport-hold language raises a red flag before the worker downloads a shareable card. Conversation-coach prompts stay on the device. Lift has no GPS, no worker maps, and no employer dashboard of people. Because Myanmar cannot use Meta’s hosted Model API, we design for self-hosted open-weights Muse Glimmer (llama.cpp) with a fixture-based demo path that already ships.

Success measure: zero invented pay/fee/hour claims on a reviewer-labelled poster set, versus a Tesseract OCR baseline.

## Technical skill (paste-ready)
- Lift prototype live at https://lift-next-step.vercel.app (no-account planner, localStorage, English + Myanmar UI, dignity wall).
- Clear Job Cards client extractor + fee gate + on-device coach (`job-card-extract.js`), fixture demos from real TRM TikTok posters.
- Muse Glimmer open-weights harness prepared (Modal + llama.cpp b10353, strict JSON prompt) in the Clear Job Cards test harness.
- ReferTRM production platform (Next.js + Supabase) shows shipped AI/product engineering; Lift stays non-commercial and separate.

## Location note
Answer Myanmar truthfully. Plan uses open weights only; no VPN workaround for Model API.

## Links to consider sharing
- https://lift-next-step.vercel.app/job-card.html (after deploy) or local demo
- https://github.com/talentsolutionsmyanmar-max/lift (public review snapshot)
- https://www.refertrm.com (company product; do not imply Lift sells worker location)

## Open blockers before a stronger live demo
1. Modal account + token to run Muse Glimmer on real poster bytes.
2. Human answer key for the 11 TikTok posters (Burmese reviewer; AI must not fill).
3. CCO-approved Burmese UI strings for Clear Job Cards.
4. Ko Ko decision: submit as Lift-first vs ReferTRM Clear Job Cards framing.
