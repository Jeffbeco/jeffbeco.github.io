"""Maintainer-only rebuild of reviewed, pinned public references. Never runs in the site.

Requires Python's standard library and public CDC/CMS network access. Source hash
changes fail closed: review the new edition, code instructions and fee revisions
before updating the pins. No patient or private document data is read or sent.
"""
from pathlib import Path
import csv
import hashlib
import io
import json
import urllib.request
import zipfile

root = Path(__file__).resolve().parent.parent
target = root / 'docs/data/clinical-rules.json'
bundle = json.loads(target.read_text())
archives = {}
for source in bundle['provenance']:
    payload = urllib.request.urlopen(source['url'], timeout=60).read()
    digest = hashlib.sha256(payload).hexdigest()
    if digest != source['sha256']:
        raise SystemExit(f"Source {source['id']} changed: review required; no bundle written.")
    archives[source['id']] = zipfile.ZipFile(io.BytesIO(payload))

codefile = archives['R01'].read('icd10cm-code-descriptions-2027/icd10cm-codes-2027.txt').decode()
descriptions = dict(line.split(' ', 1) for line in codefile.splitlines())
for row in bundle['icds']:
    row['description'] = descriptions[row['code'].replace('.', '')].strip()

fees = []
for source, qp in [('R02', 'nonqp'), ('R03', 'qp')]:
    for row in csv.reader(archives[source].read('PFTX26A.TXT').decode().splitlines()):
        if len(row) > 7 and row[3] == '99211' and row[4].strip() == '':
            fees.append(dict(year=row[0], carrier=row[1], locality=row[2], code=row[3],
                             modifier='', nonfacility=float(row[5]), facility=float(row[6]), qp=qp))
assert len(fees) == 16 and {r['carrier'] for r in fees} == {'04412'}
bundle['fees'] = sorted(fees, key=lambda r: (r['qp'], r['locality']))
if 'R04' in archives:
    codes = {code for family in bundle.get('codeFamilies', []) for code in family['codes']}
    status_rows = csv.reader(archives['R04'].read('PPRRVU2026_Oct_nonQPP.csv').decode('utf-8-sig').splitlines())
    bundle['pfsStatusReferences'] = [dict(code=row[0], status=row[3], effectiveStart='2026-10-01', effectiveEnd='2026-12-31', source='R04') for row in status_rows if len(row) > 3 and row[0] in codes and not row[1].strip()]
    assert len(bundle['pfsStatusReferences']) == len(codes)
content = json.dumps(bundle, indent=2) + '\n'
target.write_text(content)
(root / 'docs/assets/rules.js').write_text(
    '/* Offline reference subset. Rebuild only from reviewed official sources. */\nwindow.ClinicalRules = '
    + json.dumps(bundle, indent=2) + ';\n')
print('Pinned public reference subset rebuilt. Run the complete test suite before release.')
