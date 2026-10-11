# Guided clinical tools 0.3 — release and validation

Prepared October 11, 2026 against main commit 9ade71decb5e4254c76e2d0b8289b7be6855366f in nrosario07/nrosario07.github.io. The professional profile and public CV are preserved. No original private attachments, personal email or phone number are added.

## Changes

- Guided SOAP and MTP fields explain what to document and why, with source links and structured action/status choices.
- Economic event scenarios are embedded in both the MTP and business tools, with provenance, uncertainty, implementation links and duplicate-event exclusions.
- The business outline adds thirteen teaching-focused sections and keeps collections separate from modeled value.
- Patient drafts reuse agreed SOAP plan, monitoring, follow-up and education; review and completeness gates precede export. Approximate readability is shown; medication details are preserved.
- A small FY2027 ICD-10-CM subset suggests references for confirmation. Service review is limited to in-person Original Medicare nonfacility office follow-up, with a 99211 incident-to candidate and clinic-specific MD/DO sign-off control.
- Annual 2026 Texas CMS base benchmarks require explicit locality, QP status, billing role and participation inputs. Quarterly revisions/claim adjustments are not applied.
- Adult BMI and legacy Cockcroft–Gault calculators include applicability checks and original source links.
- Structured JSON and MTP CSV support reporting without equating MTPs to claims or economic value to receipts.

## Automated verification

`node --test tests/*.test.js`: 59 tests pass. Includes formula/unit fixtures, unknown/zero/range states, diagnosis edition/negation/confirmation, payer and office-path exclusions, supervision and sign-off checks, patient plan preservation/review invalidation, shared events, nonreused session IDs, CSV safeguards, all routes and offline/privacy constraints.

No real-browser visual, screen-reader or institutional clinical validation was performed. DOM tests are simulations. This is an educational/reference release requiring governed clinical review before patient use.

## Fictional-case browser review

1. Open Clinical Tools → MTP workspace → Load fictional case. Confirm the fictional banner, instructional help and draft source text.
2. Verify the generated patient draft matches SOAP and contains no internal assessment rationale, service review or economic values. Download remains disabled until complete and reviewed; editing a field clears review.
3. Change the plan status to pending/mixed: proposed actions must not become patient instructions.
4. Enter a confirmed condition and appropriate FY2027 date, inspect candidate references, then review/confirm. Change the date or assessment: confirmation must clear. Other editions remain unavailable.
5. Choose Original Medicare office follow-up and review missing incident-to evidence. Higher E/M must never appear from added note text/problems. Hospital, telehealth and other payer products must require separate review.
6. Check a 2026 locality99 non-QP participating MD/DO benchmark against the pinned annual file: $23.43 base. It is explicitly not a current claim quote. QP annual base is $23.55. Unknown dimensions must produce unavailable.
7. Add one economic event and link multiple MTPs. Open business outline: same event appears. Repeat its ID: duplicate excluded. No avoided-event value enters collected receipts.
8. Add/remove/add MTPs: IDs must not be reused in the tab. Download JSON/CSV only with a de-identified encounter reference, inspect the schema and approved storage destination.
9. BMI 80kg/200cm at age30 with checked nonpregnant context →20.0kg/m². Cockcroft–Gault age65/80kg/creatinine1mg/dL with explicit actual-weight policy/stable kidney function →83.3mL/min legacy male,70.8 legacy female. AKI/dialysis must block calculation.
10. Check keyboard navigation, mobile widths, field labels, source links, clipboard/download and print. Reload must clear draft data. Confirm there are no patient-input network requests.

## Updating GitHub Pages manually if connector writes are unavailable

Extract the update ZIP. It contains the updated repository files with `docs`, `documentation`, `scripts` and `tests` at its root. In the repository, choose **Add file → Upload files**, drag these folders and README.md from inside the extracted folder, then commit to main with **Add guided clinical tools and integrated economic evidence**. Upload expanded files/folders, not the ZIP itself. Keep Settings → Pages set to main and `/docs`. After the Pages deployment completes, review https://nrosario07.github.io/#clinical-tools and use the fictional checklist above.

For local Git users, copy the files into the existing checkout, inspect `git diff`, run the tests, commit and push main. Do not replace unrelated changes made after the prepared baseline. No credentials are included in the package.
