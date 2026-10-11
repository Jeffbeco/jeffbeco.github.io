# Implementation specification — foundation 0.2

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
