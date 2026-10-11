# Implementation specification — guided clinical tools 0.3.1

Date: October 11, 2026. Professional owner: Dr. Norbert Rosario, PharmD. Working platform name: ClinicalRx. Repository: https://github.com/nrosario07/nrosario07.github.io. Site: https://nrosario07.github.io/. Deploy `main:/docs` through GitHub Pages. The 0.3.1 payer clarification below supersedes earlier narrow billing descriptions; this current section supersedes the historical 0.2 specification below; master specification 1.3 remains the requirements baseline.

## Delivered scope

The eleven professional routes, curated public CV and LinkedIn-only contact remain. The tools are free, account-free and run locally in the browser. This release adds guided smart-note controls, integrated economic evidence, a teaching-focused practice plan, patient visit-plan drafts, a limited diagnosis-reference matcher, an office service review, and adult BMI/legacy Cockcroft–Gault calculators. Texas readiness and the searchable provenance directory remain available. No original private attachments are published.

| Workspace | Behavior | Explicit boundary |
|---|---|---|
| MTP/SOAP | Section help, original examples, source links, action/status radio controls, stable problem identifiers and outcome evidence | A note does not establish scope, diagnosis, claim eligibility or authentication |
| Patient plan | Generates from agreed SOAP plan, monitoring, follow-up, education and clinician-reviewed condition references | Clinician review required; readability estimate cannot guarantee grades 3–5 or comprehension |
| Diagnosis references | Twelve FY2027 ICD-10-CM references matched locally against reason/assessment; explicit confirmation | Not exhaustive; no drug-to-diagnosis inference, final sequencing or automatic coding of uncertain diagnoses |
| Service review | Structured payer/product inputs and a narrow in-person nonfacility Original Medicare office 99211 incident-to checklist | Original Medicare office limit is separate from commercial policy/contracts; broader families remain reference candidates |
| Fee reference | Sixteen published annual CY2026 Texas rows: eight localities × Medicare QP/non-QP | Not a current claim quote; annual data have not been reconciled to quarterly revisions or claim adjustments |
| Economic evidence | Shared event records inside MTP/business; risk models and direct comparator costs | No universal coefficients, causal realized-savings claim, automatic aggregation or inclusion in revenue |
| Business plan | Thirteen narrative sections with guidance/sources plus monthly collections arithmetic | Not a payer contract, CPA, full cash-flow projection or certification |
| Clinical calculators | Adult BMI and legacy Cockcroft–Gault with units/context checks | No diagnosis, dosing, pediatric, pregnancy BMI or unstable-kidney inference |

## Payer and code-family clarification — 0.3.1

This revision preserves broader possibilities rather than applying an Original Medicare office E/M limit to all payers. The tools now include 48 CPT/HCPCS reference identifiers in fourteen original service-family summaries. Families cover office E/M 99211–99215, MTM 99605–99607, self-management education, DSMT, CGM setup, wellness, CCM/PCM, TCM, BHI/CoCM, RPM including CY2026 updates, facility and vaccine services. Related practitioner-personal references are marked as role-restricted. These are candidate references, not an exhaustive licensed CPT database or a list of codes a pharmacist can independently report. Unknown additional identifiers can be entered for explicit current code/coverage review; they remain unverified.

Commercial products may have explicit policy/contract recognition permitting higher E/M or other services, subject to lawful scope, performer qualifications, service criteria, enrollment and the actual agreement. The tool no longer treats the absence of a Medicare-style rule as a universal prohibition. It still does not infer a level or timed units from SOAP prose, pharmacist minutes or MTP count.

Negotiation must name the payer and benefit. Medicare Advantage network payment terms and PartD sponsor MTM fees are distinct from Original Medicare physician-fee-schedule payment. A private agreement cannot negotiate away Original Medicare statutory provider recognition, coverage or service requirements. An approved CMS model/waiver, if relevant, needs its own verified authority; no model exception is presumed.

PartD MTM services may be paid through the sponsor's program/contract, with MTM CPT identifiers if the sponsor accepts that reporting method. CMS October2026 RVU file R04 (updated 2026-08-26) lists 99605, 99606 and 99607 with PFS status X: no physician-fee-schedule payment for these codes. This is not a statement that Medicare has no MTM benefit. PartB eligible-practitioner/team care-management work and PartD MTM must not be paid twice for the same work.

Texas Medicaid FFS clinical pharmacist E/M recognition must not be assumed. Pharmacy/provider enrollment for covered pharmacy benefits is distinct from independent clinical visit eligibility. Medicaid is state/program-specific; the site does not assert that all Medicaid programs exclude pharmacists or that every Texas payment arrangement must be an APM. For Texas MCOs, verify the specific benefit/contract and eligible billing entity; MTM, negotiated per-visit, PMPM, bundled or value-based arrangements may be strategies if permitted. A contract/APM does not automatically expand legal provider status or scope.

CMS May4,2026 guidance specifically discusses pharmacist participation in deprescribing under existing qualifying care-management families, including CCM/PCM, and related BHI/CoCM/TCM contexts. This is published guidance about existing services, not a newly created pharmacist-specific CPT code. CPT is maintained by AMA; CMS may establish HCPCS LevelII codes and determine Medicare payment. CY2027 PFS proposals are tracked separately, inactive until finalized with applicable effective dates. No unverified future pharmacist code is invented.

The shared contract-review schema adds contractCodes, planName, contractReference, contractBenefit, effective start/end, contractRecognition, contractCriteria, actual serviceElements, contractPayment, contractRate and rateUnit. Billing role can be a payer-recognized pharmacist contract role; this does not establish PartB recognition. All terms are user-entered review evidence, not independently verified approval. Missing recognition/evidence/dates/code validity/rate/unit yields PENDING_REVIEW and no amount. Completed documented terms yield USER_DOCUMENTED_CONTRACT_SCENARIO, never a claim or collection prediction. Original Medicare selection suppresses a private negotiated-rate scenario. PartD MTM does not approve non-MTM codes through that benefit. Practitioner-personal codes are blocked from pharmacist-only contract scenarios. Contract amounts never automatically fill business collected receipts.

MTP and business outputs include the same contract-review appendix. Business has an explicit planned/actual service date shared with encounter date; planning is not a claim. Structured JSON separates contract inputs/review, narrow office incident-to checklist, annual PFS benchmarks and economic evidence. Reference source R04 contains pinned October2026 PFS statuses for all 48 identifiers; status alone is not coverage or performer eligibility. Other benefits (for example vaccines or facility payment) require their own files/rules. The maintainer rebuild script verifies the R04 archive hash and extracts status identifiers only, not copyrighted descriptors.

## Code architecture and reproducible build

No framework, package installation, cloud language model or paid service is needed. Load these deferred classic scripts in order: `content.js`, `core.js`, `rules.js`, `clinical.js`, `workspaces.js`, `app.js`. `app.js` owns the portfolio/router and creates the workflow factory. `workspaces.js` renders guided inputs and binds memory state. Pure calculations and reference checks live in `clinical.js`; `core.js` retains note formatting, process counts and monthly finance arithmetic.

`docs/data/registry.json` is the source-directory/profile authority. Run `node scripts/sync-registry.js` after editing it. `docs/data/clinical-rules.json` is the small executable reference subset. Its JSON copy and `rules.js` must remain identical. `scripts/rebuild-clinical-references.py` downloads fixed public CDC/CMS archives, verifies SHA-256 pins, extracts only the approved diagnosis descriptions and Texas 99211 rows, and fails closed if upstream bytes change. This maintainer operation never runs in a patient workflow. A new source edition requires review, updated rules/tests, version and effective dates; do not update hash pins merely to bypass an error.

Run `node --test tests/*.test.js`. `python scripts/package.py` creates a portable single-file preview and source ZIP. The hosted site preserves a restrictive CSP with `connect-src 'none'`; the portable preview only permits its own inline script/style bundle. All downloaded reference archives are public-source maintenance intermediates and are excluded from site publication.

## State and exports

Memory state keys: `encounter`, `billing`, `mtps`, `events`, `business`, `checks`, `bmi`, `cg`. Route changes retain drafts; refresh clears everything. There is no fetch, account, database, analytics, localStorage, sessionStorage, IndexedDB or service worker. Hash routing contains only route names. External source links are user initiated, no-referrer and noopener. Patient text is never sent to a terminology service, PubMed, Google Scholar or a model.

Encounter schema includes de-identified encounterId, date, setting, reason, actual author/role, authority reference, subjective, objective, assessment, plan, planStatus, monitoring, followup, education, teachback, teachbackEvidence, confirmedCodes and diagnosisReview. The synthetic flag labels learning cases. IDs and source references are documentation inputs, not authentication or primary-source credential verification.

MTP schema includes immutable session-stable id, medication/indication, original rationale label, supporting facts, structured actionType, narrative action, decision, implementation, actual implementation details, resolution and follow-up evidence. IDs increase monotonically across additions/removals; an encounter reference namespaces exported records. Existing 36 original labels remain unpriced, with monetaryCoefficient null. Accepted is not implemented. Implemented counts require actual details; resolved counts require follow-up evidence. Prevented theoretical harm is not an observed outcome.

Structured JSON schema version 0.3.1 separates encounter/MTP inputs, reviewed diagnosis references, service inputs/checklist/benchmark and economic inputs/review. It contains draft clinical data: download only into an institution-approved location. MTP CSV includes schema version, encounter reference, date, MTP ID, rationale, action category, decision, implementation evidence, resolution evidence and nonduplicate related event IDs. Cells are quoted and spreadsheet formula prefixes are escaped. Exports require a nonblank de-identified encounter reference; no patient ID validation is implied. Stable IDs are session-scoped, not a cross-organization master patient index. No generated physician signature, credential approval, performed minutes or outcome is included.

## Guided documentation and patient generation

Each SOAP section explains what to record and why: subjective reports/barriers; objective dates/units/source; assessment status versus goal, cause, alternatives, benefit/risk and medical necessity; plan actual versus pending actions; monitoring thresholds/timing/owner; follow-up access; education and actual teach-back/show-me results. Guidance draws from CMS documentation principles, AHRQ teach-back and Texas scope references. Completing these local quality fields is not a claim that every field is separately required for CMS 99211.

Patient draft headings use simple language. Conditions use plain labels only after diagnosis-reference review. Plan is reused automatically only when the user marks the SOAP plan as agreed patient actions with no pending recommendations. Monitoring, follow-up and education are reused automatically. A small reviewed phrase list simplifies common wording, such as “Monitor your” to “Check your”; medication names, doses, numbers, units, negation and conditions are preserved. No medication instructions or return precautions are invented. Complex prose and abbreviations trigger review warnings. Approximate Flesch–Kincaid grade uses a basic syllable heuristic and is not validated patient comprehension; medical names can increase scores. The target is grades 3–5, not a guarantee or forced rewrite.

User reviews the entire generated draft against SOAP before download. Missing agreed plan/monitoring/follow-up/education blocks patient export. Every form edit clears the patient-review attestation; re-rendering the workspace also clears it. A pending/mixed plan never becomes instructions. The plan remains a draft even after a user review checkbox; final distribution belongs in the approved clinical workflow. Internal assessment rationale, billing and economic records do not flow into the patient document.

## Diagnosis and service reference logic

The diagnosis subset is FY2027, effective 2026-10-01 through 2027-09-30. Invalid/missing/out-of-window dates yield unavailable. Phrase matching uses only reason and assessment; conservative sentence suppression handles negatives, uncertain, family-history, prior-history and resolved terms. This is not a complete language-understanding engine. It never infers disease from medication or laboratory values. A diagnosing-provider record, specificity/complications, current index/tabular instructions and sequencing must be reviewed. Confirmation accepts only present candidates. Conflicting alternatives within one bundled code family produce no confirmed codes. Changing reason, assessment or date clears prior review. Other diagnoses/editions require manual coding review outside the subset.

Original Medicare Part B is distinct from Medicare Advantage, Texas Medicaid FFS/MCO, commercial, Part D MTM, APM arrangements and self-pay. Unknown or non-Medicare products yield product-specific review guidance without automatic codes or Medicare payment assumptions. APM participation needs an executed arrangement; it is not created by credentialing, and private APM terms do not establish Medicare QP status.

The one automated office path requires an in-person pharmacist medication follow-up, nonfacility office, established patient/initial eligible practitioner plan, active involvement, state scope/privileges, medical necessity, billing-practice expense, qualifying supervision, no Part D payment, actual EHR authentication and evidence references. CMS pharmacist auxiliary office E/M clarification limits this pathway to 99211. No number of MTPs, amount of prose, pharmacist minutes or clinical complexity creates higher E/M levels. Eligible billing practitioner work or other services need independently reviewed rules. This is a checklist, not a claims engine.

A supervising MD/DO sign-off with evidence is the user's clinic-specific control. It is not asserted as a universal CMS rule; CMS recognizes certain NPP supervisors. A later signature cannot substitute for applicable supervision. CY2026 qualifying direct supervision can use real-time audio/video for applicable services, subject to exceptions, state rules and clinic requirements; audio-only is not accepted. Clinical changes and changes to payer/service/site/modality/entity/supervision invalidate recorded authentication/sign-off attestations. The tool does not sign an EHR record.

## Fee benchmarks and economic integrity

Annual CMS files updated 2025-12-29 are pinned separately for QP and non-QP. Texas carrier 04412 has localities 09, 11, 15, 18, 20, 28, 31, 99. County mapping must be checked; 99 includes Bexar. The bundle retains facility and nonfacility published amounts for provenance, but this workflow only displays the nonfacility benchmark. A 2026 service date, Original Medicare pathway, locality, actual QP status, participating/assignment status and eligible billing-practitioner role are required. Eligible NPP role-adjusted reference uses 85%; MD/DO uses the published base. This is not payment to the PharmD and is not automatically collected revenue. Quarterly revisions, MIPS/other adjustments, deductible, coinsurance, charges, contractual terms and actual eligibility are not calculated. A blocked service checklist can still show a clearly labeled educational annual benchmark; it is never represented as an approved patient payment.

Economic records require an event ID, population/setting, horizon, perspective, USD price year, primary source/input locator, evidence design/uncertainty and local applicability. Method is risk-difference model or direct cost comparison. Risk net = (baseline absolute risk − after absolute risk) × event cost − incremental cost; direct net = complete comparator cost − complete intervention cost. Blank costs are unknown, not zero; out-of-range/overflow inputs are invalid. Negative differences remain visible. Coefficients are never loaded by MTP category.

Shared event IDs link multiple MTPs to one outcome. Repeated IDs are flagged and excluded from reporting, with no automatic cross-event total because horizons/perspectives/overlap may differ. Links require actual implementation evidence before being described as implemented; an unlinked/business-only record remains proposed. Even implemented-intervention modeled risk differences are not causally observed savings. Do not add drug savings already included in total claims costs. Four historical E03 amounts remain inactive; a literature link alone is not coefficient validation.

Business plan sections cover executive summary, need, service scope, CPA/credentialing/privileges, payer/APM strategy, operations, staffing/capacity, quality/equity, budget/cash flow, economic justification, milestones/governance, risks/audit evidence, and sources. Original guidance links SBA, CMS, Texas and AHRQ materials. Monthly collections = completed visits × collected receipts; expense = completed visits × variable cost + fixed cost; break-even = ceiling(fixed / positive contribution). Zero requires explicit entry. Modeled cost avoidance never enters collections/profit. A full multiscenario cash-flow and contract-specific financial engine remains future work.

## First clinical calculation rules

Adult BMI uses kg / m², with Metric kg/cm or US pounds/inches converted using 2.2046226218487757 lb/kg and 0.0254 m/in. Positive finite measurements and completed adult age 20–120 with nonpregnant/checked context are required. Result is kg/m², a screening measure; no category-derived diagnosis or dosing is emitted. Body composition and fluid context require clinician judgment.

Legacy Cockcroft–Gault uses (140 − age) × selected weight kg / (72 × serum creatinine mg/dL), multiplied by 0.85 for the explicitly selected legacy female coefficient. Accept adult ages 18–139, positive finite kg/creatinine, explicit weight policy and stable kidney function/no AKI or dialysis. Weight selection is clinical, not automatically ideal/adjusted. Low creatinine is not rounded upward. Result mL/min is not indexed eGFR. Legacy assay/population/body-composition limitations and contemporary kidney-function guidance are displayed. Follow drug labeling and clinical review; no medication dose is generated.

## Validation, release and next extensions

68 automated tests cover pure clinical/financial rules, unknown/zero/range states, negation/edition checks, code confirmation, payer/supervision/sign-off gates, official row dimensions, patient draft/dose preservation, review invalidation, shared economics, stable IDs, CSV injection defenses, structured output, formulas/unit conversion, all routes and privacy controls. Event-capable simulated DOM tests exercise form bindings. They do not substitute for real browser, keyboard, screen-reader, mobile, clipboard/download or print review. Browser QA was unavailable under this environment's preview rules; perform the fictional-case checklist in RELEASE_0.3.md before institutional clinical use. No claim of validated clinical deployment is made.

Keep a named clinical/billing maintainer and review sources whenever editions, laws, contracts or service rules change. Disable or leave unknown any unreviewed path. Next extensions require primary-source validation: device-specific inhaler competencies/handouts, diabetes education, broader payer/service rules, reviewed economic study coefficient records, business scenarios/cash-flow, EHR-native governed templates and later ASHP residency workflows. No audit-passing or accreditation guarantee is supplied.

---

The following historical 0.2 text records the earlier foundation; current behavior is specified above.

# Historical foundation specification — 0.2

Date: October 11, 2026. Master specification baseline: 1.3. Source inputs: Dr Rosario Clinical Tools Master Specification; MTP Note Template and Economic Evidence guide; original blank MTP note. This implementation addendum explains how to recreate and extend this first build.

## Purpose and ownership

The professional identity is Dr. Norbert Rosario, PharmD. The professional site owns a distinct tools experience, provisionally named ClinicalRx by Dr. Rosario. Final platform naming remains pending. The profile now uses the supplied September 2026 detailed CV and VA resume. LinkedIn is the only public contact method. All tools are free for healthcare professionals and students. Patient-facing text must be entered and reviewed by a healthcare professional.

Navigation order is About, Experience, Clinical Practice, Research, Publications, Teaching, Presentations, Projects, Clinical Tools, CV, Contact. Professional sections use curated profile metadata from both CVs. Two journal publications have publisher-verified metadata; textbook contributions are labeled as supplied-CV entries. Historical manuscript affiliations are not used to establish current appointments.

## Architecture and deployment

Use semantic HTML, responsive CSS and classic JavaScript with no framework or package dependency. This intentionally smaller foundation differs from the optional React/TypeScript approach in the master specification: it can be opened locally, inspected easily and hosted directly on GitHub Pages. A later framework migration must preserve data contracts, privacy constraints and test cases.

The repository uses GitHub Pages branch publishing from `main:/docs`. Hash routing avoids server rewrites and works at both root and project URLs. Asset and downloadable-template paths are relative. `.nojekyll` disables unintended Jekyll processing. No GitHub Actions workflow or installation is necessary.

The HTML loads content.js, core.js and app.js in that order using deferred scripts. Registry JSON is the editable authority; sync-registry.js generates its offline JavaScript copy. Pure functions in core.js support Node testing independently of the DOM. app.js owns route rendering, state, event handlers and user-initiated exports.

## Functional inventory

| Component | Foundation behavior | Release boundary |
|---|---|---|
| Professional profile | All eleven routes, populated portfolio, LinkedIn contact and curated public CV | Full source CVs stay private; credential status is reported from the supplied CV, not primary-source verification |
| MTP note | Encounter/SOAP sections, repeating problems, decision/implementation/resolution states, internal service review | No treatment inference, coding assignment, claim or authentication |
| Patient summary | Separate reviewed action and follow-up fields, text export | Does not derive instructions from clinician reasoning |
| Economic scenario | Explicit risk difference, event cost and incremental cost | User assumptions; no validated coefficients automatically applied |
| Business outline | Original service/workflow/payer/outcome/milestone outline and monthly scenario | Contract, privilege and reimbursement eligibility are external |
| Texas organizer | Prepared-item checklist with institutional examples and official reference links | Not a payer decision engine or universal credentialing standard |
| Source directory | Local search/category filtering, original summaries, identifiers and direct links | Inclusion is not validation or a license to republish source content |

Future diabetes and inhaler handouts, clinical calculators, payer-specific billing matrices and residency tools are marked planned. No completed module is implied by a roadmap card.

## State and output contracts

All form inputs live in one memory object for the current page session. Route changes preserve the draft; reload clears it. No persistent input storage, server calls, analytics, account or AI service exists. Hashes contain route identifiers only; patient inputs are never encoded in URLs. External public reference links are user-initiated and use no-referrer/noopener behavior.

Encounter fields: date, setting, reason, author, authority, subjective, objective, assessment, plan, monitoring, education, patientActions, patientFollowup. An optional synthetic flag adds an explicit fictional-case label.

MTP fields: id, medication, rationale, facts, action, decision, implementation, resolution, implementedDetails, followup. The 36 original rationale labels retain domain and research lead metadata; they are not reproduced licensed PQA value sets. Labels have no automatic billable-code or monetary mapping.

Decision states: Pending, Accepted, Declined. Implementation states: Not implemented, Implemented. Resolution states: Open, Resolved. An implemented count requires actual-action details. A resolved count requires follow-up evidence. The UI flags unsupported status selections; exported notes still reflect the entered status transparently and require review. Future clinical release should add stronger review gates and provenance timestamps.

Internal service-review fields: actual service, payer product/benefit, performer and billing entity, candidate code/units, referral/consent/supervision/time evidence, reviewer decision/source. This optional section is a review record only. Counting problems does not assign codes or justify a higher E/M level.

Blank fields render as `[not entered]`. No signer, time, result, treatment response, authorization or payer decision is invented. Patient outputs include only patientActions and patientFollowup, never billing text, economic outputs or clinician assessment. Note copy, TXT download and browser print are user initiated. The application does not transmit or sign an EHR note.

## EHR adaptation

The blank note and generated output are generic plain text for eClinicalWorks, Epic, Oracle Health/Cerner, athenahealth and Elation. Institutions adapt headings and repeated sections through approved note editors. No universal SmartPhrase, SmartText, dot phrase, macro, import package or FHIR integration is claimed. Retain native encounter identity, authentication and signatures inside the EHR. Test formatting and clinically required fields with a fictional case before use. The exported draft is not the final legal record until reviewed and entered through the approved workflow.

## Economic and business formulas

Economic fields baseline and after are probabilities from zero to one. Event cost and incremental cost must be nonnegative. All four inputs are required, including explicitly entered known zeros. Missing or nonnumeric inputs produce UNPRICED; invalid ranges produce INVALID. Gross modeled avoided-event cost equals `(baseline − after) × eventCost`. Net modeled difference equals gross minus incremental. Negative outputs remain visible. Units are per modeled individual over the stated horizon; source, perspective, population, event identity and price-year inputs accompany the output. These metadata are descriptive, not automated validation. Event overlap and cohort multiplication are not calculated.

Four historical E03 values appear only in an INACTIVE reference table. Their missing price-year metadata and unresolved transferability prevent automatic activation. Every rationale monetaryCoefficient is null. A future reviewed coefficient requires study design, population, comparator, event definition, effect uncertainty, currency/price year, cost perspective, eligibility, deduplication rules and clinical/research approval. Validated clinical effectiveness does not by itself validate an economic coefficient.

Business monthly revenue equals visits × collected receipts per visit. Expense equals visits × variable cost per visit plus monthly fixed cost. Operating difference equals revenue minus expense. Break-even visits are ceiling(fixed cost / positive per-visit contribution); nonpositive contribution has no finite break-even. Visits must be a nonnegative integer; all financial values must be nonnegative and explicitly entered. These are scenario arithmetic, not reimbursement forecasts. Cost avoidance is excluded from clinic collections.

## Texas / billing boundaries

Clinic credentialing, hospital/clinic privileges, Texas delegated authority and payer contracting are distinct. A CPA does not independently confer provider payment eligibility or authorize a code. Incident-to prerequisites, E/M performer rules, actual services, Medicare/Medicaid/commercial product requirements, plan recognition, billing entities, supervision and contract terms require current source review. This foundation supplies reference links and organization fields rather than asserting an exhaustive reimbursable-code matrix.

Three references and five progress notes reflect the user's clinic example; they are not stated as universal Texas requirements. MDAPP is a credentialing submission workflow, not evidence of approval. License, CE, references, note samples and certificates remain in an approved institutional system; no uploading UI exists here.

A future payer matrix needs effective dates, service definitions, source excerpts with locators, policy versions, code licensing review, supervising clinician requirements, enrollment/contract status, reviewer ownership and a conservative unknown state. APM participation requires an actual contractual model, not a checkbox or credentialing inference.

## Source layer and maintenance

Each reference has an identifier, title, category, URL, status, original summary, metadata-check date, review status, rights statement and bundle version. The layer links official Texas rules and statutes, CMS/TMHP/TDI materials, medication/terminology resources, owner publication metadata and economic research leads. Search operates locally without sending query text outward. Bundled summaries do not replace source inspection.

Before a reviewed clinical release, distinguish link/metadata checks from full evidence validation, add effective-version locators and applicability reviews, implement review-due dates, designate an owner, and retain change history. CMS policies and payer materials need timely rechecking. Broken links, withdrawn guidance or materially revised rules should move affected functions to unavailable/unverified. Do not imply all reference metadata was freshly clinically validated.

## Security, accessibility and quality

Dynamic form values are escaped before HTML interpolation; draft output uses textContent. No eval, remote script, storage API, fetch, XMLHttpRequest or service worker is used. The published entrypoint uses a restrictive CSP including connect-src none, object-src none and form-action none. The downloadable single-file preview permits inline scripts/styles solely to contain the bundle and uses no network-input connection. No secrets or original private uploads belong in the repository.

Use responsive navigation, visible keyboard focus, explicit labels, a skip link, polite status announcements, semantic headings, reduced-motion support and print styling. Current automated checks cannot establish accessibility conformance. Real keyboard, screen-reader, mobile layout, clipboard, TXT export and print QA remain required before release.

## Acceptance checks and extension process

Run the Node tests after every logic or source change. Confirm unknown values remain unknown, confirmed zero works, risks are bounded, negative scenarios are retained, acceptance is not implementation, resolved outcomes require evidence, patient output excludes internal content, all 36 coefficients stay null, historical values stay inactive, local links exist and every requested route renders.

Use real-browser fictional-case tests on desktop and mobile before publishing a clinical release. Test root and project GitHub Pages URLs. Verify relative paths, focus, menu behavior, sources, output transitions, patient-export separation and reload clearing. No browser visual QA was performed in the build environment.

For additions: define the intended audience, collect primary-source evidence, write explicit applicability/unknown rules, specify input/output units, test edge cases, review clinical and payer assumptions, document limits, and then enable the module with a version and review date. Residency development is a later build requiring the applicable current ASHP standards, program-specific context and confidentiality controls; no accreditation guarantee is implied.

## Profile revision 0.2

Profile metadata is now data-driven through registry.json. Personal email addresses and phone numbers are not used. LinkedIn contact URL: https://www.linkedin.com/in/norbertrosario/. The public CV is an original selected summary, not the uploaded full CV or federal-style resume. License/board credential identifiers, supervisors and confidential peer-review details are omitted from public assets. Original attachments remain unchanged.

Where the documents differ, the public summary uses the shared period and a broader title: University Health ambulatory clinical pharmacy service, January 2023–present, with the VA resume indicating a per-diem transition in July 2024; Assistant Professor role, 2020–2021, avoiding the June/July start-date disagreement. Spanish is listed without an inconsistent proficiency rating. Ongoing MBA study is not presented as an earned degree. A November 2026 newsletter entry is not presented as an already published item. The two Rosario N authors in the 13th-edition textbook entry reflect the explicit explanation in the full CV, not a deduplication error.

The user-suggested Optimizing Medications reference is a homepage link only. Its acceptable-use policy restricts copying, derivative tools and deep links. No assessment, framework, artwork, logo or tool is embedded; the original existing note workflow is retained. Source directory metadata does not grant content reuse permission.

GitHub repository selected by the owner: nrosario07/Dr.Rosario_PharmD.github.io. The prepared code targets main; publish through Settings → Pages → Deploy from a branch → main:/docs. The default project URL is https://nrosario07.github.io/Dr.Rosario_PharmD.github.io/. Repository read access is confirmed. A blob upload was rejected with HTTP 403, Resource not accessible by integration; no site files were uploaded. Manual browser upload or repository-content write access is required before Pages activation. A live deployment still requires verification.
