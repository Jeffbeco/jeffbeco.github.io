(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ClinicalEngine=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const version='0.3.1', text=x=>String(x??'').trim();
const num=x=>text(x)===''?null:(Number.isFinite(Number(x))?Number(x):null);
const validDate=x=>/^\d{4}-\d{2}-\d{2}$/.test(text(x))&&!Number.isNaN(Date.parse(x))&&new Date(x).toISOString().slice(0,10)===x;
function diagnose(encounter,rules){
 const date=text(encounter.date);if(!validDate(date)||date<rules.icdStart||date>rules.icdEnd)return {status:'UNAVAILABLE',candidates:[],reason:'Enter a valid encounter date within the FY2027 reference window (2026-10-01 to 2027-09-30). Other editions are not bundled.'};
 const body=[encounter.reason,encounter.assessment].map(text).join('\n');
 const sentences=body.split(/[\n;.!?]+/);
 const candidates=rules.icds.filter(row=>sentences.some(s=>new RegExp(row.pattern,'i').test(s)&&!/(\bno\b|\bnot\b|denies|without|rule[ -]?out|suspect|possible|probable|questionable|family history|history of|resolved|working diagnosis|consistent with|compatible with)/i.test(s)));
 return {status:'CANDIDATES',candidates,reason:'Limited phrase matching only. Confirm the diagnosing provider, exact condition, specificity, complications, index/tabular instructions and sequencing. No diagnosis is inferred from a drug or laboratory value.'};
}
function reviewedDiagnoses(encounter,rules){
 const r=diagnose(encounter,rules);if(r.status!=='CANDIDATES')return [];
 if(encounter.diagnosisReview!=='Reviewed against diagnosing-provider documentation and index/tabular instructions')return [];
 const selections=text(encounter.confirmedCodes).split(/[\s,;]+/);
 const chosen=r.candidates.filter(row=>selections.includes(row.code));
 // Mutually exclusive alternatives within this small bundle cannot both be confirmed.
 if(chosen.some((x,i)=>chosen.some((y,j)=>i!==j&&x.code.slice(0,3)===y.code.slice(0,3))))return [];
 return chosen;
}
const serviceGates=[['established','Established patient and initial personal service/plan by eligible billing practitioner'],['active','Billing practitioner remains actively involved'],['scope','CPA/state scope and institutional privileges verified'],['necessary','Medical necessity and service actually performed documented'],['expense','Service is an expense of the billing practice'],['supervision','Applicable direct supervision and Texas/clinic rules verified'],['notPartD','Service not paid under the Part D benefit'],['record','Approved EHR documentation/authentication completed']];
function serviceReview(encounter,billing){
 const result={status:'UNREVIEWED',code:null,pathway:'Payer-specific review needed',missing:[],warnings:[],version};
 if(billing.payer!=='Original Medicare Part B'){result.pathway=({ 'Medicare Advantage':'Verify plan recognition, benefit and negotiated contract. Network rates/payment arrangements may differ from Original Medicare; no automatic higher E/M approval.', 'Texas Medicaid FFS':'Do not assume pharmacist direct clinical E/M eligibility. Verify the current Texas benefit, enrollment, service and eligible billing entity. Pharmacy benefits are distinct; no blanket statement that all Medicaid excludes pharmacists.', 'Texas Medicaid managed care':'Verify the named MCO product, recognized billing entity, covered benefit and contract. A negotiated MTM, per-visit, PMPM or value-based/APM arrangement may be an option, not a universal requirement or waiver of law.', 'Commercial':'Higher E/M and other code families remain potential contract/policy-dependent references. Verify explicit pharmacist recognition, lawful scope, billing entity and actual code requirements; no universal 99211 cap is imposed.', 'Part D MTM':'Part D sponsor MTM payment and accepted reporting method, potentially 99605–99607 under the contract. No physician-fee-schedule rate or Part B payment is inferred.', 'APM / value-based contract':'Verify the signed arrangement, attribution, services, measures and payment terms. A contract may not require visit claims and cannot waive provider/scope requirements.', 'Self-pay':'Verify scope, patient agreement, prices and applicable requirements; no insurer payment inferred.'})[billing.payer]||result.pathway;return result;}
 result.pathway='Original Medicare office E/M: pharmacist auxiliary service reviewed through incident-to; higher E/M levels are not inferred from pharmacist time, SOAP detail or MTP count.';
 if(billing.service!=='Pharmacist medication follow-up in physician office'||billing.site!=='Nonfacility office'||billing.modality!=='In person'){result.status='OUTSIDE_RULE';result.warnings.push('This limited rule covers in-person nonfacility physician-office follow-up only. Hospital, telehealth and other services require separate rules.');return result;}
 result.code='99211';
 result.missing=serviceGates.filter(([key])=>billing[key]!=='Yes — evidence recorded').map(([,label])=>label);
 for(const key of ['date','author','authority','reason','subjective','objective','assessment','plan','monitoring','education'])if(!text(encounter[key]))result.missing.push('Encounter documentation: '+key);
 if(!text(billing.entity))result.missing.push('Identify eligible billing practitioner/entity and actual supervisor');
 if(!text(billing.support))result.missing.push('Record evidence locations for plan, supervision, medical necessity and authentication');
 if(!['Physically available','Real-time audio and video'].includes(billing.supervisionMode))result.missing.push('Confirm qualifying direct-supervision mode; audio-only is not accepted');
 if(billing.cosign!=='Completed in approved EHR by supervising MD/DO'||!text(billing.cosignEvidence))result.missing.push('User clinic policy: supervising MD/DO sign-off in approved EHR with evidence reference');
 result.warnings.push('MD/DO sign-off is this clinic’s requested control, not a universal CMS co-sign rule. CMS permits certain eligible NPP supervisors; signature alone does not establish incident-to eligibility.');
 result.status=result.missing.length?'REVIEW_BLOCKED':'CHECKLIST_COMPLETE';
 result.warnings.push('Checklist completion is a user attestation for reviewer use, not payer approval or an authenticated claim. CPT identifiers are referenced from CMS; no licensed CPT descriptor database is included.');
 return result;
}
function contractReview(encounter,billing,rules){
 const requested=[...new Set(text(billing.contractCodes).toUpperCase().split(/[\s,;]+/).filter(Boolean))];
 const known=new Set((rules.codeFamilies||[]).flatMap(x=>x.codes));
 const result={status:'PENDING_REVIEW',requestedCodes:requested,referenceCodes:requested.filter(x=>known.has(x)),unlistedCodes:requested.filter(x=>!known.has(x)),missing:[],amount:null,unit:null,notes:['All entered codes are manual review candidates, not automatically assigned services.','Negotiated payment is separate from CMS benchmarks, economic value and actual collections.']};
 if(billing.payer==='Original Medicare Part B'){result.status='ORIGINAL_MEDICARE_RULES';result.notes.push('A private payer contract does not negotiate away Original Medicare statutory provider rules or PFS coverage. Other Part B service families require their own rules. MTM 99605–99607 are CY2026 PFS status X; Part D MTM is a separate sponsor pathway.');return result;}
 if(!['Medicare Advantage','Commercial','Part D MTM','Texas Medicaid managed care','APM / value-based contract'].includes(billing.payer)){result.notes.push('No contracted-plan payment determination is supplied for this selection. Texas FFS needs a verified benefit/legal payment route; APM is not presumed mandatory.');return result;}
 for(const key of ['planName','contractReference','contractBenefit','entity','serviceElements','contractPayment','rateUnit'])if(!text(billing[key]))result.missing.push(key);
 if(!validDate(encounter.date)||!validDate(billing.contractStart)||!validDate(billing.contractEnd)||billing.contractStart>billing.contractEnd||encounter.date<billing.contractStart||encounter.date>billing.contractEnd)result.missing.push('Valid contract dates covering the encounter');
 if(billing.contractRecognition!=='Yes — evidence recorded')result.missing.push('Documented lawful provider recognition, enrollment/privileges and billing entity');
 if(billing.contractCriteria!=='Yes — evidence recorded')result.missing.push('Actual service/code criteria, time/units, exclusions and nonduplicated work reviewed');
 if(billing.contractPayment==='Fee-for-service with agreed codes'&&!requested.length)result.missing.push('Agreed service code(s)');
 if(result.unlistedCodes.length)result.missing.push('Unlisted codes need current validity/descriptor/coverage review');
 if(billing.payer==='Part D MTM'&&requested.some(x=>!['99605','99606','99607'].includes(x)))result.missing.push('Non-MTM codes need a separately verified benefit; they are not approved by the Part D MTM pathway');
 const restricted=(rules.codeFamilies||[]).find(x=>x.id==='restricted');if(billing.billingRole==='Pharmacist — payer-recognized contract role'&&requested.some(x=>restricted&&restricted.codes.includes(x)))result.missing.push('Practitioner-personal codes cannot be attributed to pharmacist-only work by this contract scenario');
 const rate=num(billing.contractRate);if(rate===null||rate<0)result.missing.push('Explicit nonnegative USD contracted amount; blank is unknown');
 if(!result.missing.length){result.status='USER_DOCUMENTED_CONTRACT_SCENARIO';result.amount=rate;result.unit=billing.rateUnit;result.notes.push('User-entered terms only; not independently verified payer approval or a predicted collection. No total is inferred from units or MTP count.');}
 return result;
}
function feeBenchmark(encounter,billing,review,rules){
 if(review.code!=='99211'||billing.payer!=='Original Medicare Part B'||billing.site!=='Nonfacility office'||!validDate(encounter.date)||encounter.date<'2026-01-01'||encounter.date>'2026-12-31'||billing.participation!=='Participating / assignment accepted'||!['qp','nonqp'].includes(billing.qp)||!['MD/DO','Eligible NPP'].includes(billing.billingRole))return {status:'UNAVAILABLE',reason:'Benchmark requires a 2026 encounter, Original Medicare office pathway, participating/assigned billing entity, actual Medicare QP status, billing role and Texas locality.'};
 const row=rules.fees.find(x=>x.code===review.code&&x.locality===billing.locality&&x.qp===billing.qp);
 if(!row)return {status:'UNAVAILABLE',reason:'Select a verified Texas fee locality. County mapping must be checked.'};
 return {status:'PUBLISHED_ANNUAL_REFERENCE',base:row.nonfacility,roleAdjusted:row.nonfacility*(billing.billingRole==='Eligible NPP'?0.85:1),row,reason:'Published annual 2026 base benchmark (12/29/2025 file), not a current claim quote. Quarterly revisions, MIPS/other adjustments, deductible, coinsurance, charge caps and contract rules are not applied. No payment is predicted; incident-to eligibility may still be blocked.'};
}
function economicRecord(x,mtps=[]){
 const required=['eventId','population','horizon','perspective','priceYear','source','applicability','method','evidenceGrade'];
 const missing=required.filter(k=>!text(x[k]));
 if(!/^\d{4}$/.test(text(x.priceYear)))missing.push('valid price year');
 if(x.method==='Risk-difference model'){
  const a=num(x.baseline),b=num(x.after),cost=num(x.eventCost),incremental=num(x.incremental);
  if([a,b,cost,incremental].includes(null))missing.push('both risks, event cost and incremental cost (explicit zeros)');
  if(missing.length)return {status:'UNPRICED',missing};
  if(a<0||a>1||b<0||b>1||cost<0||incremental<0)return {status:'INVALID',missing:['Risks 0–1 and costs ≥0 required']};
  const gross=(a-b)*cost,net=gross-incremental;if(!Number.isFinite(gross)||!Number.isFinite(net))return {status:'INVALID',missing:['Calculation overflow: check input magnitudes']};
  return {status:'MODELED',gross,net,label:'Per modeled individual over stated horizon; not observed savings or revenue'};
 }
 if(x.method==='Direct cost comparison'){
  const before=num(x.comparatorCost),after=num(x.implementedCost);
  if(before===null||after===null)missing.push('both complete comparator costs');
  if(missing.length)return {status:'UNPRICED',missing};
  if(before<0||after<0)return {status:'INVALID',missing:['Costs must be nonnegative']};
  return {status:'COMPARISON',gross:before-after,net:before-after,label:'User-entered comparator difference; not proof of causally realized savings'};
 }
 return {status:'UNPRICED',missing:['Select a modeled risk or direct cost comparison method']};
}
function economicPortfolio(events,mtps=[]){
 const seen=new Set(),rows=events.map(x=>{const key=text(x.eventId).toLowerCase();const duplicate=key&&seen.has(key);if(key)seen.add(key);const result=economicRecord(x,mtps);const links=text(x.mtpIds).split(/[\s,;]+/).filter(Boolean);const implemented=links.length>0&&links.every(id=>mtps.some(m=>m.id===id&&m.implementation==='Implemented'&&text(m.implementedDetails)));return {id:x.id,eventId:x.eventId,duplicate,implemented,links,result};});
 // Do not aggregate different perspectives, horizons or event definitions automatically.
 return {rows,conflicts:rows.filter(r=>r.duplicate).length,notice:'Values are shown per event; no cross-event total. Repeated event IDs are excluded from reporting. Acceptance is not implementation; modeled avoided events are not actual revenue.'};
}
function economicText(events,mtps){const p=economicPortfolio(events,mtps);return ['ECONOMIC EVIDENCE APPENDIX — SEPARATE FROM REVENUE',p.notice,...p.rows.map((r,i)=>{const x=events[i];return `\n${r.id} / ${text(r.eventId)||'[event ID missing]'}${r.duplicate?' — DUPLICATE: EXCLUDED':''}\nMTP links: ${text(x.mtpIds)||'[none]'}; implementation supported: ${r.implemented?'yes, per entered record':'no / proposed'}\n${r.result.status}: ${r.result.net===undefined?(r.result.missing||[]).join('; '):'$'+r.result.net.toFixed(2)+' USD — '+r.result.label}\nPopulation: ${text(x.population)}\nHorizon: ${text(x.horizon)}; perspective: ${text(x.perspective)}; USD price year: ${text(x.priceYear)}\nSource: ${text(x.source)}\nEvidence grade / design: ${text(x.evidenceGrade)}\nApplicability and limitations: ${text(x.applicability)}`;})].join('\n');}
function syllables(word){let w=word.toLowerCase().replace(/[^a-z]/g,'');if(!w)return 0;if(w.length<=3)return 1;w=w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,'');return Math.max(1,(w.match(/[aeiouy]{1,2}/g)||[]).length);}
function readability(body){const words=text(body).match(/[A-Za-z]+(?:['-][A-Za-z]+)*/g)||[];const sentences=Math.max(1,(text(body).match(/[.!?]+(?:\s|$)/g)||[]).length);if(words.length<20)return null;return 0.39*(words.length/sentences)+11.8*(words.reduce((s,w)=>s+syllables(w),0)/words.length)-15.59;}
function plainInstructions(body){
 // Narrow substitutions change common instruction phrases, never a drug, number, unit or clinical threshold.
 const replacements=[[/\bMonitor your\b/gi,'Check your'],[/\bReturn to the clinic\b/gi,'Come back to the clinic'],[/\bContact your care team\b/gi,'Call your care team'],[/\bprior to\b/gi,'before'],[/\bfollowing your visit\b/gi,'after your visit'],[/\bas directed by your care team\b/gi,'as your care team told you']];
 let out=text(body);const changes=[];for(const [rx,replacement] of replacements){if(rx.test(out)){rx.lastIndex=0;out=out.replace(rx,replacement);changes.push(replacement);}}
 return {text:out,changes};
}
function patientDraft(encounter,rules){
 // Copy clinical instructions verbatim; never invent, translate doses, remove negation or turn pending actions into instructions.
 const confirmed=reviewedDiagnoses(encounter,rules).map(x=>x.plain);
 const actualPlan=encounter.planStatus==='Agreed patient actions; no pending recommendations'?text(encounter.plan):'';
 const parts=[['Your health',confirmed.length?confirmed.join('. ')+'.':'Ask your care team which health problems you worked on today.'],['Your plan',actualPlan||'[SOAP plan contains unreviewed or pending actions. Care team must select the agreed patient plan.]'],['What to check',text(encounter.monitoring)||'[Care team: add what to check and when.]'],['Next visit',text(encounter.followup)||'[Care team: add when and how to follow up.]'],['What we learned',text(encounter.education)||'[Care team: add the teaching provided.]']];
 const transformations=[];for(let i=1;i<parts.length;i++){const r=plainInstructions(parts[i][1]);parts[i][1]=r.text;transformations.push(...r.changes);}
 const instructions=parts.slice(1).map(([,x])=>x).join(' '),grade=readability(instructions);
 const warnings=[];if(!actualPlan)warnings.push('Agreed patient plan is missing; SOAP may contain pending recommendations.');if(/\b(BID|TID|QID|PRN|qd|qhs|po|SC|SQ)\b/.test(instructions))warnings.push('Clinical abbreviations need clinician expansion.');if(grade!==null&&grade>5)warnings.push('Estimated reading level exceeds grade 5; simplify reviewed wording without changing medication names, doses, units, timing or conditions.');
 const body=['YOUR VISIT PLAN','DRAFT — Your care team must check this page before you use it.',...parts.map(([h,x])=>`\n${h}\n${x}`),'\nPlease tell us your plan in your own words. Ask us about any part that is hard to follow.'].join('\n');
 return {body,grade,warnings,transformations,complete:!!actualPlan&&['monitoring','followup','education'].every(k=>text(encounter[k])),reviewNeeded:true,method:'Plain-language headings, confirmed condition labels and a short reviewed phrase-substitution list. Drug names, doses, numbers, units, negation and clinical conditions retained. Approximate Flesch–Kincaid grade, not validated comprehension.'};
}
function bmi(x){let weight=num(x.weight),height=num(x.height),age=num(x.age);if([weight,height,age].includes(null))return {status:'INCOMPLETE'};if(x.units==='US'){weight/=2.2046226218487757;height*=0.0254;}else if(x.units==='Metric'){height/=100;}else return {status:'INVALID'};if(age<20||age>120||weight<=0||height<=0||!Number.isInteger(age)||x.context!=='Adult, nonpregnant; measurements checked')return {status:'OUTSIDE_RULE',reason:'Adults age 20–120 with checked positive measurements, nonpregnant context required. No pediatric or pregnancy interpretation.'};const result=weight/(height*height);if(!Number.isFinite(result))return {status:'INVALID'};return {status:'CALCULATED',value:result,units:'kg/m²',reason:'BMI is a screening measure, not a diagnosis. Assess body composition, fluid status and clinical context.'};}
function cockcroft(x){const age=num(x.age),w=num(x.weight),scr=num(x.scr);if([age,w,scr].includes(null))return {status:'INCOMPLETE'};if(age<18||age>=140||!Number.isInteger(age)||w<=0||scr<=0||!['Legacy male coefficient','Legacy female coefficient (×0.85)'].includes(x.coefficient)||x.stable!=='Stable kidney function; no AKI or dialysis'||!text(x.weightPolicy))return {status:'OUTSIDE_RULE',reason:'Requires adult age 18–139, positive kg and mg/dL, explicit legacy coefficient/weight policy, stable kidney function and no AKI/dialysis.'};const result=(140-age)*w/(72*scr)*(x.coefficient==='Legacy female coefficient (×0.85)'?0.85:1);if(!Number.isFinite(result))return {status:'INVALID'};return {status:'CALCULATED',value:result,units:'mL/min (not indexed)',reason:'Legacy Cockcroft–Gault estimate. Weight choice affects results. Do not round low creatinine upward. Limited accuracy with modern assays/extreme body composition; contemporary kidney-function guidance may favor other methods. Follow the medication label and clinician review; no dosing is generated.'};}
function csv(rows){const quote=x=>'"'+String(x??'').replace(/^[\s]*[=+\-@]/,m=>"'"+m).replace(/"/g,'""')+'"';return rows.map(r=>r.map(quote).join(',')).join('\r\n');}
function report(encounter,mtps,billing,events,rules){const review=serviceReview(encounter,billing);const portfolio=economicPortfolio(events,mtps);return {schemaVersion:version,referenceVersion:rules.version,encounter:{...encounter},mtps:mtps.map(m=>({...m})),reviewedDiagnosisReferences:reviewedDiagnoses(encounter,rules).map(x=>x.code),service:{inputs:{...billing},review,contractReview:contractReview(encounter,billing,rules),benchmark:feeBenchmark(encounter,billing,review,rules)},economicEvents:events.map(x=>({...x})),economicReview:portfolio,notes:['Unverified user-entered draft; no generated signatures.','Economic values are not collections or claims. Store only in an institution-approved location.']};}
function mtpCSV(encounter,mtps,events){const p=economicPortfolio(events,mtps);return csv([['schema_version','encounter_id','date','mtp_id','rationale','action_type','decision','implementation','implementation_evidence','resolution','followup_evidence','economic_event_ids'],...mtps.map(m=>[version,encounter.encounterId,encounter.date,m.id,m.rationale,m.actionType,m.decision,m.implementation,m.implementedDetails,m.resolution,m.followup,p.rows.filter(r=>!r.duplicate&&r.links.includes(m.id)).map(r=>r.eventId).join(';')])]);}
return {version,num,validDate,diagnose,reviewedDiagnoses,serviceGates,serviceReview,contractReview,feeBenchmark,economicRecord,economicPortfolio,economicText,readability,plainInstructions,patientDraft,bmi,cockcroft,csv,report,mtpCSV};
});
