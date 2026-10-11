"""Generate an original public CV summary from curated profile metadata."""
from pathlib import Path
import json
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak,KeepTogether
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont("NRBody","/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("NRBold","/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("NRSerif","/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"))
root=Path(__file__).resolve().parent.parent
p=json.loads((root/'docs/data/registry.json').read_text())['profile']
out=root/'docs/downloads/Norbert_Rosario_Public_CV.pdf'
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='NameNR',fontName='NRSerif',fontSize=25,leading=29,textColor=HexColor('#182e34'),spaceAfter=9))
styles.add(ParagraphStyle(name='SectionNR',fontName='NRBold',fontSize=12,leading=16,textColor=HexColor('#19564f'),spaceBefore=10,spaceAfter=7))
styles.add(ParagraphStyle(name='TitleNR',fontName='NRBold',fontSize=9.5,leading=13,textColor=HexColor('#182e34'),spaceAfter=3))
styles.add(ParagraphStyle(name='BodyNR',fontName='NRBody',fontSize=9,leading=12,spaceAfter=5,textColor=HexColor('#283e43')))
styles.add(ParagraphStyle(name='MetaNR',fontName='NRBody',fontSize=8,leading=11,textColor=HexColor('#617176'),spaceAfter=5))
def clean(x):return str(x).replace('–','-').replace('—','-').replace('’',"'").replace('“','"').replace('”','"').replace('·','|')
def para(x,style='BodyNR'):return Paragraph(escape(clean(x)),styles[style])
story=[]
def section(x):story.append(para(x,'SectionNR'))
def entry(x,compact=False):
 block=[para(x['title'],'TitleNR'),para(x['organization']+' | '+x['dates'],'MetaNR')]
 if x.get('summary') and not compact:block.append(para(x['summary']))
 story.append(KeepTogether(block));story.append(Spacer(1,3))
story.append(para('Norbert Rosario','NameNR'))
story.append(para('PharmD | BCPS | BCACP','TitleNR'))
story.append(Paragraph('<link href="https://www.linkedin.com/in/norbertrosario/" color="#19564f">linkedin.com/in/norbertrosario/</link>',styles['BodyNR']))
story.append(para('Public CV summary | Profile source: September 2026 CV and VA resume','MetaNR'))
story.append(para(p['bio']))
section('Professional experience')
for x in p['experience']:entry(x)
section('Education & postgraduate training')
for x in p['education']+p['training']:story.append(para(x['title']+' | '+x['organization']+' | '+x['dates'],'MetaNR'))
section('Credentials')
story.append(para('BCACP; BCPS. Texas and North Carolina pharmacist licensure, as reported in the supplied CV.'))
story.append(PageBreak())
section('Teaching & precepting')
for x in p['teaching']:entry(x)
section('Selected research')
for x in p['research']:entry(x,compact=True)
section('Professional service')
for x in p['service']:story.append(para(x))
story.append(PageBreak())
section('Publications & textbook contributions')
for x in p['publications']:
 block=[para(x['title'],'TitleNR'),para(x['authors']+'. '+x['citation']),para(x['status'],'MetaNR')]
 if x.get('url'):block.append(Paragraph('<link href="'+x['url']+'" color="#19564f">'+escape(x['url'])+'</link>',styles['MetaNR']))
 story.append(KeepTogether(block));story.append(Spacer(1,5))
section('Selected presentations')
for x in p['presentations'][:5]:entry(x,compact=True)
section('Selected recognition')
for x in p['awards']:story.append(para(x,'MetaNR'))
story.append(para('Selected public portfolio, not a complete credentialing CV. Contact is through LinkedIn only. Personal contact information, credential identifiers and confidential peer-review details are omitted.','MetaNR'))
def footer(canvas,doc):
 canvas.setStrokeColor(HexColor('#dce2df'));canvas.line(46,43,566,43)
 canvas.setFont('NRBody',8);canvas.setFillColor(HexColor('#617176'))
 canvas.drawString(46,29,'Dr. Rosario | Public professional portfolio | October 2026')
 canvas.drawRightString(566,29,str(doc.page))
SimpleDocTemplate(str(out),pagesize=(612,792),rightMargin=46,leftMargin=46,topMargin=40,bottomMargin=56,title='Norbert Rosario - Public CV Summary',author='Norbert Rosario').build(story,onFirstPage=footer,onLaterPages=footer)
text=['NORbert ROSARIO, PharmD, BCPS, BCACP'.replace('NORbert','Norbert'),'Public CV summary','Contact: '+p['contactUrl'],'Profile source: September 2026 CV and VA resume','',p['bio']]
for title,key in [('EXPERIENCE','experience'),('EDUCATION','education'),('TRAINING','training'),('TEACHING','teaching'),('RESEARCH','research'),('PRESENTATIONS','presentations')]:
 text.extend(['',title])
 for x in p[key]:text.extend([x['title'],x['organization']+' | '+x['dates'],x.get('summary',''),''])
text.extend(['PUBLICATIONS'])
for x in p['publications']:text.extend([x['title'],x['authors'],x['citation'],x['status'],x.get('url',''),''])
text.extend(['SELECTED RECOGNITION',*p['awards'],'','SELECTED PROFESSIONAL SERVICE',*p['service']])
(root/'docs/downloads/Norbert_Rosario_Public_CV.txt').write_text('\n'.join(text)+'\n')
print(out)
