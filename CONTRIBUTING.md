# Contributing to Lift

Thank you for helping with Lift. Lift is a research and design-review prototype
for Myanmar migrant workers in Thailand and their families. It is maintained by
[Talent Resources Myanmar Co.,Ltd](https://www.refertrm.com/) in Yangon,
Myanmar. See [GOVERNANCE.md](GOVERNANCE.md).

Please read the [code of conduct](CODE_OF_CONDUCT.md) before you take part.

Use invented examples only. Do not commit credentials, participant data, QA
screenshots, or internal operating notes.

## What you need

- For static UI review: Python 3 (to serve files). No npm install and no
  credentials.
- For tests or experimental backend work: Node.js 20 or newer, then
  `npm ci`. The only runtime dependencies are `@vercel/blob` and `@vercel/oidc`.

There is no linter, formatter, or framework build step. The shipped frontend is
the static files in `dist/`.

## Run the frontend

From the repository root:

```bash
python3 -m http.server 4173 --directory dist
```

Then open `http://localhost:4173/`.

For the isolated team-test build (community sends stay in memory; real
submissions are closed):

```bash
python3 -m http.server 4173 --directory artifacts/workflow-followup-team-test-release
```

Do not connect a database, enable community intake, or deploy the repository
root for a design review. Backend routes in `api/` are experimental and are not
part of the team test.

## Tests

```bash
npm test
```

That runs `node --test tests/*.test.cjs`. Pull requests run the same command
in GitHub Actions (`.github/workflows/test.yml`). Add or update a matching
file under `tests/` when you change behaviour in `dist/`, `lib/`, `api/`, or
`scripts/`.

## Repository layout

| Path | What it is |
| --- | --- |
| `dist/` | Static app shell, styles, and client scripts |
| `docs/` | Copy, fixtures, and draft designs used by build scripts |
| `scripts/` | Small Node or Python helpers that generate copy or review builds |
| `lib/` | Shared experimental backend logic |
| `api/` | Experimental Vercel serverless routes |
| `tests/` | Node test files |
| `artifacts/` | Isolated team-test snapshots |

Some English and Myanmar strings in `dist/` are generated from JSON in `docs/`
by scripts such as `scripts/build-privacy-copy.cjs`. If you change reviewed
copy, edit the `docs/` source and run the matching script rather than only
editing the generated file.

All new Myanmar copy needs review and user comprehension testing. Copy-review
provenance in `docs/` means AI wording review, not participant validation. Do
not treat a checkbox as proof of a job, a renewed document, a school place,
improved finances, or a health outcome.

Health information is not a clinic, diagnosis tool, or emergency service. It
needs a qualified reviewer before it is published as guidance.

## Branch and pull-request flow

1. Branch from the latest `main`. Use a short name that describes the change.
2. Keep the change focused. Do not mix a redesign with unrelated backend work.
3. Run `npm test` and, if you touched the UI, check the local server above.
4. Open a pull request against `main`. Say what you changed and how you checked
   it.
5. A maintainer reviews and merges. Do not merge your own pull request unless
   you are a maintainer acting under [GOVERNANCE.md](GOVERNANCE.md).

Pull requests should stay draft until tests pass and the description is
complete. The isolated team test at https://lift-team-test.vercel.app/ is a
published snapshot; do not assume a pull request is live there.

## Security and privacy

Report vulnerabilities privately. See [SECURITY.md](SECURITY.md). Do not open a
public issue for a security report.

Lift does not locate or track workers. Do not add location, tracking, accounts,
or identity-document collection unless a maintainer has agreed the product
change and [PRIVACY.md](PRIVACY.md) is updated to match the code.
