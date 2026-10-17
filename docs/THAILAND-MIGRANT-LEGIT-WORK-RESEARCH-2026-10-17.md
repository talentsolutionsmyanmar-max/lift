# Thailand migrant legitimate work — research note for Lift

**Date:** 17 Oct 2026 (Asia/Rangoon)  
**Status:** Research only. No outbound contact. No Clear Job Cards demo listings until Ko Ko reviews.  
**Audience:** Lift product decisions (Myanmar migrants already in / entering Thailand).  
**Dignity wall:** never track, locate, or map workers; never build an employer dashboard of people.

---

## Why this note exists

Ko Ko paused Clear Job Cards demo content. Jobs for migrants are sensitive: many Myanmar workers struggle to find new work and must stay on a **legitimate** pathway. Inventing Thailand job demos (or showing Myanmar domestic Makro/TRM posters) would mislead. Lift should help people **check legitimacy and ask better questions**, not act as a job board.

This note covers:

1. Legal pathways (especially changing employers / finding new work while already in Thailand)  
2. Common illegal / risky asks Lift should flag  
3. What Lift should and must **not** show as “jobs”  
4. Recommended feature framing  

Rules/windows change often via Cabinet resolutions. **Always tell users to confirm at the local Employment Office (สจจ./สจก.), Immigration, and/or a trusted support organisation.** This file is not legal advice.

---

## 1. Legal pathways (high-level map)

Thai migrant work for Myanmar nationals is mainly governed by the **Foreigners’ Working Management Emergency Decree B.E. 2560 (2017)** and amendments, administered by the **Department of Employment (DOE / สำนักบริหารแรงงานต่างด้าว)** under the Ministry of Labour, plus Immigration and (for documents) Myanmar authorities.

### 1.1 MOU channel (government-to-government recruitment)

- Workers enter/work under bilateral **MOUs** (Myanmar–Thailand). Typical pattern: passport + visa + **work permit**, often **2 years + possible 2-year extension** (IOM labour migration profile, Thailand, 2025).  
- **Changing employers is restricted.** DOE materials and practitioner summaries of the decree describe eligibility when, for example: the prior employer was at fault (e.g. labour-protection violations, unjust dismissal, employer death/bankruptcy), the worker paid required compensation to the former employer, or the worker left during a renewed contract period. Eligible workers must usually start with the new employer **within a short window** (commonly cited as **30 days** from actual termination under Sections 51–53-type rules; some news/embassy summaries have mentioned longer windows under later measures — **confirm locally**). Missing the window can expire the work permit and affect lawful stay.  
- Official DOE PDF on MOU employer change (Thai):  
  https://www.doe.go.th/prd/assets/upload/files/alien_th/96dd0f4c136f52018cc9700f067f0377.pdf  

### 1.2 Cabinet-resolution / “pink card” style regularisation (in-country windows)

- Periodic **Cabinet resolutions** open or extend permission for Cambodian, Lao, Myanmar (and sometimes Vietnamese) workers already in Thailand to register or renew — often described in everyday language as **pink card** (alien registration / ID-style card) **plus work permit**, sometimes with **CI (Certificate of Identity)** when a passport is not available.  
- These are **not the same legal basis as MOU**. Employer-change rules follow the specific resolution + DOE practice; they may be easier in practice than MOU but **are not “change jobs freely with no conditions.”** New work permit / notifications with the new employer are still required.  
- DOE announcements on CI processing for Myanmar workers under Cabinet resolutions (examples):  
  - https://www.doe.go.th/prd/alien/news/param/site/152/cat/7/sub/0/pull/detail/view/detail/object_id/78568  
  - https://doe.go.th/prd/alien/news/param/site/152/cat/7/sub/0/pull/detail/view/detail/object_id/78976  
- IOM notes that “official” in-country registration costs are relatively low (~USD 75 in authority language) while Myanmar workers reported a **median ~USD 890** in 2023 — a major exploitation risk (IOM Thailand Labour Migration Profile, 2025):  
  https://thailand.iom.int/sites/g/files/tmzbdl1371/files/documents/2025-03/iom-labour-migration-profile-thailand.pdf  

### 1.3 Changing or adding an employer / job type (general work-permit machinery)

- Under the older Working of Aliens Act framework and DOE forms, a permit holder who wants to **change or add employer, job category, or workplace** needs **registrar permission** (classic **Section 26**-style language).  
- DOE FAQ (alien): work permit not yet expired — change of employer possible under MOL announcement of 6 Jul 2560; file at **Employment Office in the current work area**; health check not required for that FAQ case:  
  https://www.doe.go.th/prd/alien/faq/param/site/152/cat/25/sub/24/pull/detail/view/faq-detail/object_id/184  
- Application forms for change/add employer are published by DOE (e.g. TT.2-style change forms):  
  https://www.doe.go.th/prd/download/download_by_pool_file/21236  

### 1.4 Section 64 — border / seasonal / commute-style work

- **Section 64** of the 2017 Emergency Decree covers work of a **border / seasonal / go-return** character under border-pass arrangements with neighbouring countries, including Myanmar. Work is limited to **designated border provinces/districts**; movement beyond authorised areas is restricted.  
- Immigration example (Chiang Saen) illustrating Section 64 work permits:  
  https://chiangsaen.immigration.go.th/wp-content/uploads/2024/01/%E0%B8%A7.7.pdf  
- MOL/DOE legal notices also address Section 64 COVID-era and later management (Thai PDFs on mol.go.th / doe.go.th).  
- **Lift implication:** a “job in Bangkok” offered to someone whose only status is Section 64 border work is a **legitimacy red flag**, not an opportunity to promote.

### 1.5 Social Security (SSO)

- Employers must register eligible employees, including many migrant workers with lawful work permission, with the **Social Security Office**. SSO publishes guidance/infographics on registering Cambodian, Lao, Myanmar and Vietnamese workers (e.g. register within timelines; forms such as สปส.1-03 with work-permit and passport/CI copies):  
  https://www.sso.go.th/wpr/  
  Example infographic hub:  
  https://www.sso.go.th/wpr/main/privilege/sso-infographic_detail_detail_1_127_778/996_996  
- **No SSO registration / “cash only, no documents”** is a risk signal, not proof — still tell the user to verify with SSO/DOE for their status type.

### 1.6 Myanmar-side documents (Embassy / Labour Attaché / CI)

- Myanmar Embassy Bangkok / Consulate Chiang Mai / Labour Attaché processes interact with Thai regularisation (passport, CI, tax slips). Press reports cite Embassy denials of unofficial “slip fees” charged in their name — useful for Lift’s **fee-scam** education, but always point users to **current Embassy/Labour Attaché notices**, not third-party Facebook posts.  
- Nation Thailand summary of Embassy denial of 1,800-baht slip fee claim (Dec 2024):  
  https://www.nationthailand.com/news/asean/40043977  

### 1.7 Practical “already in Thailand, need new work” checklist (non-advice)

Lift can help a user **prepare questions**, not decide status:

1. What document set do I hold today? (MOU work permit + passport/visa vs Cabinet/pink-card + work permit ± CI vs Section 64 border pass)  
2. Has my work permit expired or is it about to?  
3. Am I still inside any **employer-change time limit** after leaving the last job?  
4. Will the **new employer** file the change/new permit at the provincial Employment Office?  
5. Will I stay covered for **Social Security / health insurance** as required for my category?  
6. Who keeps my **passport / CI / pink card / work permit**?

---

## 2. Common illegal / risky asks Lift should flag

Sources: ILO “Travel Smart – Work Smart”; IOM Thailand labour migration profile (2025); ILO MOU review; Thai Royal Ordinance themes summarised in IOM policy papers.

| Risk pattern | Why it matters | Lift flag language (English; MY = NEED-CCO) |
|---|---|---|
| **Broker / employer keeps passport, CI, pink card, or work permit** | Document retention traps workers; ILO materials warn never to leave ID with broker/employer “for safekeeping.” | “This offer asks to hold your passport or papers. That is a serious risk. Keep your own documents.” |
| **Upfront “registration / agency / placement” fee to the worker in Thailand** | Thai rules restrict what Thai agencies may charge workers; IOM documents large gaps between official costs and what Myanmar workers actually pay. | “A fee before you start may be unlawful or abusive. Ask for a written breakdown and check with DOE / a support centre.” |
| **Deposit taken from first wages / debt bondage** | Ties worker to employer; common with inflated registration costs. | “A wage deposit can trap you. Ask how much, who holds it, and when it returns — in writing.” |
| **No written contract / contract substitution** | Worker arrives to different job, place, or pay than promised. | “Pay, hours, and workplace are NOT STATED or changed. Do not rely on verbal promises alone.” |
| **Work outside permitted area / status** (e.g. Section 64 worker offered deep inland job) | Can make the worker irregular overnight. | “This job location may not match border/seasonal permission. Confirm with Immigration / Employment Office.” |
| **“No need work permit / we handle police”** | Encourages irregular work; arrest/deportation risk. | “Working without a valid permit is high risk. Lift will not list this as a safe job.” |
| **Fake Embassy / CI / pink-card fee slips** | Scams using Myanmar Embassy name. | “Official fees change. Check Embassy/Labour Attaché and DOE notices — do not pay unnamed collectors.” |

**ILO Travel Smart – Work Smart (rights guide):**  
https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@asia/@ro-bangkok/documents/publication/wcms_099811.pdf  

**IOM Thailand Labour Migration Profile (recruitment costs & channels):**  
https://thailand.iom.int/sites/g/files/tmzbdl1371/files/documents/2025-03/iom-labour-migration-profile-thailand.pdf  

---

## 3. What Lift should and must NOT show as “jobs”

### Must NOT

- **Unverified job listings** scraped from Facebook/TikTok/Viber that could push someone into **irregular** work.  
- **Invented demo employers** presented as real Thailand opportunities (including fictional “Demo Factory Co.” used as if live inventory).  
- **Myanmar domestic hiring** (Makro / TRM Yangon / ReferTRM commercial jobs) inside Lift — wrong geography and wrong product boundary.  
- **Employer maps, GPS, “workers near you,”** or any feature that locates migrants.  
- **Guarantees** of a job, visa, pink card, or employer change.  
- **Outbound contact** to employers or brokers on the user’s behalf.

### May show (after research approval)

- **User’s own** poster/message → structured **honesty card** (quoted fields or NOT STATED) + **risk flags** — private, on-device.  
- **Questions to ask** before accepting an offer (prepare-a-conversation style).  
- **Pointers** to official pages (DOE, Immigration, SSO) and **known support organisations** the team has vetted (with “check current hours yourself”).  
- **Explainers** of pathway *types* (MOU vs Cabinet/pink-card vs Section 64) without deciding the user’s status.

---

## 4. Recommended Lift feature framing

**Name direction:** legitimacy / offer check — not “job board,” not “Clear Job Cards as hiring feed.”

**One-line product framing for Meta / funders:**  
“Lift helps Myanmar migrant workers in Thailand check whether a job *offer they already have* looks legitimate — flagging fees, passport holds, and missing contract terms — without accounts, tracking, or unverified listings.”

**Build order (proposed):**

1. **Offer check (private):** upload/paste → fields with quotes or NOT STATED → fee/deposit/passport-hold flags → on-device conversation coach. No demo job inventory until Ko Ko approves research.  
2. **Pathway explainer:** short, sourced cards for MOU / pink-card window / Section 64 / “confirm at Employment Office.”  
3. **Support directory:** reuse Lift’s existing Useful information pattern; link DOE/SSO/ILO/IOM and vetted NGOs — no scraping of jobs.  
4. **Open-weights vision (later):** only to read *the user’s* poster; Myanmar cannot use Meta Model API — self-host if needed.

**Success measure:** users report clearer questions and fewer unpaid fees — **not** number of job applications Lift facilitated.

---

## 5. Source list (primary / secondary)

| Source | URL | Use |
|---|---|---|
| DOE — alien FAQ, change employer | https://www.doe.go.th/prd/alien/faq/param/site/152/cat/25/sub/24/pull/detail/view/faq-detail/object_id/184 | Official FAQ |
| DOE — MOU employer-change PDF | https://www.doe.go.th/prd/assets/upload/files/alien_th/96dd0f4c136f52018cc9700f067f0377.pdf | MOU rules (Thai) |
| DOE — change/add employer form pack | https://www.doe.go.th/prd/download/download_by_pool_file/21236 | Procedure artefact |
| DOE — CI announcements (Cabinet) | https://www.doe.go.th/prd/alien/news/... object_id/78568 and 78976 | CI / regularisation |
| MOL laws index | https://www.mol.go.th/laws/ | Legal notices |
| Chiang Saen Immigration — Sec. 64 example | https://chiangsaen.immigration.go.th/wp-content/uploads/2024/01/%E0%B8%A7.7.pdf | Border work permit illustration |
| SSO | https://www.sso.go.th/wpr/ | Social security registration |
| IOM Thailand labour migration profile (2025) | https://thailand.iom.int/sites/g/files/tmzbdl1371/files/documents/2025-03/iom-labour-migration-profile-thailand.pdf | Channels, costs, risks |
| ILO Travel Smart – Work Smart | https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@asia/@ro-bangkok/documents/publication/wcms_099811.pdf | Worker rights / ID retention |
| Working of Aliens Act (DOE English PDF, historical) | https://www.mol.go.th/wp-content/uploads/sites/2/2019/03/WORKING_OF_ALIEN_ACT_2551_DOE.pdf | Section 26-style change permission |

Secondary / verify-before-citing in product copy: Exworker blog summaries, One News Myanmar (Aug 2025 “no resignation letter”), Nation Thailand Embassy fee denial — useful leads, **not** substitutes for DOE PDFs.

---

## 6. Open questions for Ko Ko / CCO / legal

1. Which **support organisations** may Lift name in Thailand (MAP Foundation, HRDF, IOM hotlines, etc.) after vetting?  
2. Should pathway explainers wait for a **Thai lawyer / labour NGO review** before Myanmar UI?  
3. After research approval: keep **upload/paste-only** offer check with **no demo employers**, or allow one clearly labelled fictional fee-flag sample?  
4. Confirm product name: “Offer check” / “Legitimacy check” vs “Clear Job Cards.”

---

## 7. Research path taken (this session)

1. Stopped inventing Thailand job demos; emptied `FIXTURES` in `dist/job-card-extract.js`; removed `dist/demo-posters/` TikTok/Makro images.  
2. Web search + fetch: DOE FAQ, DOE MOU PDF, DOE CI news, MOL laws, Section 64 Immigration PDF, SSO, IOM 2025 profile, ILO Travel Smart.  
3. Wrote this file. No emails, no calls, no Meta application, no deploy.

**Next (for Ko Ko):** review this note → decide framing → only then re-enable any DEMO content or ship offer-check UX.
