(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ClinicalCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const value = x => String(x ?? '').trim();
  const line = (label, x) => value(x) ? `${label}: ${value(x)}` : `${label}: [not entered]`;
  function buildNote(encounter, mtps, billing = {}) {
    const out = ['PHARMACIST CLINICAL NOTE', 'Draft for clinician review', '',
      line('Encounter date', encounter.date), line('Setting and modality', encounter.setting),
      line('Reason for encounter', encounter.reason), line('Author and actual role', encounter.author),
      line('Scope or privilege reference', encounter.authority), '', 'SUBJECTIVE',
      line('Patient goals, symptoms, actual medication use and barriers', encounter.subjective), '', 'OBJECTIVE',
      line('Reconciliation, dated results and observed administration', encounter.objective), '', 'ASSESSMENT',
      line('Problems addressed and clinical reasoning', encounter.assessment)];
    mtps.forEach((m, index) => {
      out.push('', `MTP ${index + 1}`, line('Problem ID', m.id), line('Medication and indication', m.medication),
        line('Problem rationale', m.rationale), line('Supporting facts', m.facts), line('Intervention discussed', m.action),
        line('Decision', m.decision), line('Implementation', m.implementation), line('Resolution', m.resolution),
        line('Actual action, responsible person and date', m.implementedDetails), line('Follow-up evidence', m.followup));
    });
    out.push('', 'PLAN', line('Actions performed and recommendations pending approval', encounter.plan),
      line('Monitoring and follow-up', encounter.monitoring), line('Education and teach-back', encounter.education),
      '', 'AUTHENTICATION', '[Complete within the approved EHR; no signature is generated.]');
    if (Object.values(billing).some(x => value(x))) {
      out.push('', 'INTERNAL SERVICE REVIEW — NOT A CLAIM', line('Service actually furnished', billing.service),
        line('Payer product and benefit', billing.payer), line('Performer and eligible billing entity', billing.entity),
        line('Candidate code and reviewed units', billing.code), line('Referral, consent, supervision and time evidence', billing.support),
        line('Reviewer decision and source', billing.review), 'Payment eligibility remains unverified until payer-specific review.');
    }
    return out.join('\n');
  }
  function buildPatientSummary(encounter) {
    return ['PATIENT ACTION SUMMARY', 'Review with your healthcare professional before use.', '',
      line('Agreed actions and medication instructions', encounter.patientActions),
      line('Monitoring and follow-up', encounter.patientFollowup)].join('\n');
  }
  function numberOrNull(x) {
    if (x === null || x === undefined || String(x).trim() === '') return null;
    const n = Number(x); return Number.isFinite(n) ? n : null;
  }
  function economicEstimate(input) {
    const fields = ['baseline', 'after', 'eventCost', 'incremental'];
    const v = Object.fromEntries(fields.map(k => [k, numberOrNull(input[k])]));
    if (fields.some(k => v[k] === null)) return {status:'UNPRICED', reason:'Enter both risks, event cost and incremental cost. A confirmed zero must be entered explicitly.'};
    if (v.baseline < 0 || v.baseline > 1 || v.after < 0 || v.after > 1 || v.eventCost < 0 || v.incremental < 0) return {status:'INVALID', reason:'Risks must be from 0 to 1; event and incremental costs must be nonnegative.'};
    const gross = (v.baseline - v.after) * v.eventCost;
    return {status:'MODELED', gross, net:gross-v.incremental, riskDifference:v.baseline-v.after};
  }
  function financialScenario(input) {
    const fields=['visits','receipts','variable','fixed'];
    const v=Object.fromEntries(fields.map(k=>[k,numberOrNull(input[k])]));
    if(fields.some(k=>v[k]===null))return {status:'INCOMPLETE'};
    if(fields.some(k=>v[k]<0)||!Number.isInteger(v.visits))return {status:'INVALID'};
    const contribution=v.receipts-v.variable;
    return {status:'SCENARIO', revenue:v.visits*v.receipts, expense:v.visits*v.variable+v.fixed,
      profit:v.visits*contribution-v.fixed, breakEven:contribution>0?Math.ceil(v.fixed/contribution):null};
  }
  function countStates(mtps) {
    return {identified:mtps.length, implemented:mtps.filter(m=>m.implementation==='Implemented' && value(m.implementedDetails)).length,
      resolved:mtps.filter(m=>m.resolution==='Resolved' && value(m.followup)).length};
  }
  function escapeHtml(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  return {buildNote,buildPatientSummary,economicEstimate,financialScenario,countStates,numberOrNull,escapeHtml};
});
