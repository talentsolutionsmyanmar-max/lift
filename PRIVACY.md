# Privacy

Lift does not locate or track workers. This repository has no geolocation,
device GPS, workplace mapping, or worker-tracking feature.

This note describes what the code can store. It is not a claim about a live
public service. The published team test keeps community sends in memory and
does not take real submissions. Experimental API routes exist in the source and
are not part of that team test.

Lift does not require an account or identity documents.

## On the person’s device

### Language

The interface language is stored in `localStorage` under `lift-language-v1` as
`en` or `my`.

### Optional saved plan

Plan saving is off by default. If the person turns on Remember, the browser
writes `lift-plan-v1`. That object can include:

- the Remember flag
- the chosen plan key (`work`, `skills`, `support`, `stability`, or `assets`)
- checked step indexes
- an optional goal (up to 100 characters) and up to 20 earlier goals (goal
  text, plan key, timestamp, and step counts)
- edited default steps and up to six custom steps (title and detail)
- preparation-checklist indexes
- family topic and “ready” checkboxes (no child’s name, school, or location)
- up to six dates: an id, a calendar date, a process category, a source
  category, and a revision number

Anyone who uses the same browser can see values that were saved.

### Session-only tools

Spending amounts, everyday question choices, and cash-flow numbers stay in the
open page. They are not written to `localStorage`, even when Remember is on.
Clearing the Lift plan also clears them. Copied text and downloaded files
remain outside Lift.

The planner does not collect income or expense records.

### Community receipt (optional)

A community receipt is not saved automatically. If the person chooses to
remember one, `lift-private-community-receipt-v1` holds the 43-character
receipt string and an expiry time (14 days).

Community intake UI state is not serialised. It lives in the open page only.

### Offline app copy

If the person saves an offline copy, Cache Storage keeps generic application
files under `lift-shell-*`. Personal plan values are not copied into that
cache. The separate offline HTML download contains the app, not the person’s
plan.

## Experimental server storage

These routes write to private Vercel Blob storage only if they are deployed and
enabled. Opening community intake is a separate operational decision. No
default environment enables it. The team-test origin does not use these writes.

When a request is accepted, the handlers also write short-lived rate-limit
tokens. Those tokens are HMACs of the request hour plus the forwarded IP. The
survey response file itself does not include the IP.

### Research survey (`api/survey.js`)

A consented POST from `https://lift-next-step.vercel.app` may store a private
JSON record under `responses/` with:

- a client-generated UUID and instrument version (`1` or `2`)
- consent and interface language (`en` or `my`)
- answers named `role`, `recent`, `source`, `trust`, `agent`, `threeMonths`,
  `format`, `language`, and `anything`
- up to three topic tags
- up to three own question/answer pairs
- a `submittedAt` timestamp

Survey records are eligible for cleanup after 89 days. Rate-limit tokens are
eligible after one day.

### Community questions (`api/community.js`)

When intake is enabled, a consented submit may store a private record under
`community-private/v1/` with:

- language, kind (`question` or `experience`), and topic (`daily`, `family`,
  `work`, `documents`, or `health`)
- the submitted text (up to 1,200 characters)
- adult and review-consent flags, and whether AI-assisted review was allowed
- a content digest, `createdAt`, and `expiresAt` (14 days)

The receipt code stays with the person. The storage path is an HMAC of that
receipt. Status and withdraw use the same receipt. Withdrawal replaces the
record with a tombstone that has no question text.

An approved human reply (English and Myanmar text plus source URLs) and review
metadata may later be attached to the same private record. Reviewer identities
are not placed on the public community wall.

Published wall posts are separately reviewed items (title, body, sources, and
review dates), not raw submissions.

Expired community records and rate-limit tokens are removed by scheduled
cleanup.

### Experimental information checker (`api/check.js`)

A consented POST may send the typed text and an optional image to the Vercel AI
Gateway for that request. The code asks the gateway for zero data retention and
no prompt training. The checker does not write the message or image into Blob
storage. It may write hashed rate-limit tokens under `check-limits/` (cleaned
after two days). Myanmar generated guidance is currently withheld.

The preview-only evaluation route uses fixed synthetic fixtures. It does not
accept a user message or image.

## What this code does not store

- No account, password, or identity-document upload
- No worker location, GPS, or workplace tracking
- No children’s responses on the family page
- No analytics, advertising, or payment ledger in this repository
- No blockchain or token balance

Hosting platforms may keep their own request logs. That is outside this
codebase.

If the code starts storing more, this file should be updated to match.
