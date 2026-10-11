# Release 0.3.1 — broader payer and service-code review

Prepared October11,2026. Supersedes the 0.3 package before upload. GitHub still has read-only integration access; no upload or live update was performed.

## Changes

Adds 48 CPT/HCPCS reference candidates with payer/performer caveats, source links and pinned CMS October2026 PFS status data. Higher commercial E/M remains an explicit policy/contract possibility, while Original Medicare office pharmacist-only E/M retains its separate incident-to rule. PartD MTM sponsor payment is distinct from PFS payment. Texas Medicaid program/MCO review does not assume independent clinical visit recognition or a universally required APM. Published CMS May2026 deprescribing guidance is linked; future proposals remain inactive. Shared contract review records payer recognition, service elements, effective dates, payment model, rate/unit and evidence. Missing terms stay unavailable; user-entered negotiated terms never become collected receipts automatically.

## Verification and limitations

68 Node tests pass, including eight contract-rule tests and an event-capable form test for commercial terms shared across MTP/business and suppression under Original Medicare. Existing formula, patient-review, coding, economics, privacy and route checks remain. No real-browser visual or institutional clinical/payer validation was performed. This is not an exhaustive CPT database or approved claim generator.

## Upload placement

Extract ClinicalRx_0.3.1_GitHub_Update.zip. Upload the extracted docs, documentation, scripts and tests folders plus README.md to the root of nrosario07/nrosario07.github.io, preserving their paths. The current specification belongs at documentation/BUILD_SPECIFICATION.md and this release note at documentation/RELEASE_0.3.1.md. The standalone specification download is a copy of BUILD_SPECIFICATION.md; it need not also be uploaded under a different name. Markdown is developer/rebuild documentation, not the site's entrypoint. The public site files remain under docs, with Pages main:/docs.

Use Add file → Upload files and commit to main with: Expand payer-specific billing references and contract review. Upload expanded files/folders. Review the change list for unrelated repository edits before committing. Keep the old 0.3 release note only as history; use this revision for current guidance.

After deployment, use the fictional checklist in RELEASE_0.3.md and also test commercial 99214 as a manually reviewed contract candidate, PartD 99606/99607 with sponsor terms, a Texas MCO arrangement, unknown contract dates/rates, and switching to Original Medicare: no privately negotiated PFS override must appear. Compare source status references and confirm proposed policies are inactive.
