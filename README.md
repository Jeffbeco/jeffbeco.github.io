[README.md](https://github.com/user-attachments/files/33313083/README.md)

# Dr.Rosario_PharmD.github.io

Dr. Rosario, PharmD — professional portfolio and free ClinicalRx tools for healthcare professionals and students.

Foundation release 0.2.0, October 11, 2026. ClinicalRx is a working platform name.

A free static professional portfolio and tools workspace. No build, account, database, API key, paid service, external font or CDN dependency is required. The profile is populated from the supplied September 2026 CV and VA resume. LinkedIn is the sole public contact method; a curated public CV summary is included. Clinical content is a foundation demonstration, not a validated decision-support release.

## Run and verify

Open `docs/index.html` in a browser. All scripts and reference data are local. Copy may require HTTPS; download works locally in normal browsers. Run `node --test tests/*.test.js` with Node 18 or newer. No package installation is required.

## Publish on GitHub Pages

Repository: https://github.com/nrosario07/Dr.Rosario_PharmD.github.io
Expected project-site URL after Pages activation: https://nrosario07.github.io/Dr.Rosario_PharmD.github.io/

1. Open repository Settings → Pages.
2. Under Build and deployment, choose Deploy from a branch.
3. Select main and /docs, then Save.
4. Leave Custom domain blank and keep HTTPS enabled.
5. Open the deployment URL shown by GitHub and check all navigation, a fictional note, source filters and downloads.

The repository name makes this a project site; renaming to nrosario07.github.io would use the account-root URL instead. Relative paths support either. This foundation does not require GitHub Actions configuration, a paid plan or a custom domain.

The files are prepared for this repository. The GitHub connector can read the repository but rejected a blob upload with HTTP 403, Resource not accessible by integration. No site files were uploaded through the connector. Upload this package through GitHub Add file → Upload files, or grant the connection repository-content write access. Pages activation and a live deployment are not yet verified.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Files

- `docs/index.html`: static entrypoint with restrictive content security policy.
- `docs/assets/styles.css`: responsive presentation, keyboard focus and print styles.
- `docs/assets/app.js`: navigation, forms and browser-memory workflow.
- `docs/assets/core.js`: pure note, financial and economic functions.
- `docs/data/registry.json`: canonical versioned source/rationale metadata.
- `docs/assets/content.js`: offline copy of the registry, avoiding any fetch requests.
- `docs/downloads/`: original generic note and EHR adaptation guide.
- `documentation/BUILD_SPECIFICATION.md`: architecture, contracts, limitations and next-release requirements.
- `tests/`: meaningful unit and route smoke tests.

## Edit and rebuild

Profile rendering is in `profile()` in `docs/assets/app.js`. Profile metadata is in `docs/data/registry.json`; rendered profile sections read it directly. LinkedIn is the sole public contact method. A curated public CV PDF/TXT is under `docs/downloads/`. Do not add the contact details or original CVs from the private source documents. Do not expose private credentialing packets.

Edit `docs/data/registry.json`, then regenerate its offline bundle:

```sh
node scripts/sync-registry.js
node --test tests/*.test.js
```

Do not alter monetary coefficients or introduce billing mappings without review, source provenance, applicable payer rules and validation. All 36 rationale coefficients default to null. The four historical E03 references are INACTIVE.

## Release limitations

Automated checks cover core calculations, unknown values, output separation, escaping, reference structure and route smoke behavior. Visual/browser QA was unavailable in this environment; a real browser and mobile accessibility review remain necessary before clinical release. This is plain-text EHR adaptation, not a certified integration, import format, authentication system or claims engine.

Patient inputs stay in tab memory; reload clears them. User-initiated clipboard/download/print operations create copies under the user's control. Native browser session/cache behavior and the user's institution still require assessment. There is no representation of HIPAA certification. The public demonstration requests fictional/de-identified inputs until institution approval.

Original materials remain subject to the owner's rights. External sources are linked and summarized, not relicensed or reproduced in full. No patient data or uploaded private forms are included.

## Public CV generation

The included public CV is an original selected summary. To regenerate it, run `python scripts/public-cv.py` in an environment with ReportLab and DejaVu fonts; adjust the font paths for other operating systems. These dependencies are only for document generation, never for site visitors. Run `python scripts/package.py` to create the standalone preview and ZIP.
