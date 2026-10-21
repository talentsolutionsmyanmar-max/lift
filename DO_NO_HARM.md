# Do no harm

Lift is a research and design-review prototype for Myanmar migrant workers
in Thailand and their families. It is maintained in Yangon, Myanmar. This
note is a product rule, not a claim about a live public service or about
operations outside this project.

## Do not locate or track workers

Lift must not locate, map, follow, or fingerprint workers.

This repository has no geolocation, device GPS, workplace mapping, or
worker-tracking feature. Do not add those features. Do not add accounts or
identity-document collection unless a maintainer has agreed the product
change and [PRIVACY.md](PRIVACY.md) is updated to match the code.

## Minimal data

Collect as little as the tool needs, and only when the person chooses.

- No account is required
- Plan saving is off by default and stays on the person’s browser
- Spending and everyday answers stay in the open page
- The planner does not collect income or expense records
- Experimental server routes are closed unless a maintainer enables them
- The published team test keeps community sends in memory and does not take
  real submissions

See [PRIVACY.md](PRIVACY.md) for the fields the code can store.

## If user submissions ever open

Community intake is closed in the published team test. Opening it is a
separate maintainer decision. If submissions are opened, the existing code
already requires this plan — do not weaken it:

1. **Adult and consent.** A send must attest that the person is 18 or older
   and is sending their own text, and must agree to private review. Ask them
   to remove names, contact details, document numbers, exact addresses, and
   identifying details about other people.
2. **Not public by default.** A submission goes to private review storage. It
   is not published to the community board.
3. **Human review before any reply.** A private reply needs a human editor
   check for privacy, sources, and Myanmar wording. Documents and health
   topics also need a qualified reviewer. AI may see only a redacted packet,
   and only when the person opted in.
4. **Not an emergency service.** The copy already says the service is not
   continuously monitored. Urgent help must go to a support service, not
   this form.
5. **Time-limited and withdrawable.** Receipt access ends after 14 days.
   Scheduled cleanup removes expired records. Withdrawal removes the
   question text from the current record.
6. **Public wall is curated.** A public post is a separately reviewed item
   (title, body, sources, review dates), not the raw submission. Reviewer
   identities stay out of the public payload.

Team-test builds must keep simulating sends in memory. Do not point a design
review at a live intake.

## Child safety and YDC / youth topics

The family and learning pages talk about children’s learning. They are for
parents, caregivers, and educators.

- This snapshot does not collect children’s responses
- It does not connect children to strangers
- It does not ask for a child’s name, documents, school, or location
- Community intake, if opened, requires an 18-or-older attestation
- The optional research survey is described as an adult survey and asks
  people not to include children’s names or private details

YDC (Youth Development / learning pathway) is mentioned as related work and
as a planned adaptation for migrant children. Children’s lessons, Thai
audio, and age-appropriate learning packs are **not available through this
page yet**. Do not present YDC in this repository as a live child-facing
product, and do not add child accounts, child chat, or child-to-stranger
contact.

Health information is not a clinic, diagnosis tool, or emergency service.
It needs a qualified reviewer before it is published as guidance.
