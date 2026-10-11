'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'../docs/assets');
// Minimal DOM smoke harness: exercises route rendering and event binding, not browser layout.
function harness(hash){
 const elements=new Map();
 class El {constructor(){this.value='';this.textContent='';this.innerHTML='';this.dataset={};this.classList={add(){},remove(){},toggle(){return true;}};}setAttribute(){}focus(){}querySelectorAll(){return [];}}
 const main=new El();Object.defineProperty(main,'innerHTML',{get(){return this.html||'';},set(v){this.html=v;for(const m of v.matchAll(/\bid="([^"]+)"/g))elements.set(m[1],new El());}});elements.set('main',main);
 for(const id of ['navigation','breadcrumb','menu-button','toast'])elements.set(id,new El());
 const context={console,location:{hash},document:{getElementById(id){if(!elements.has(id))throw Error(`Missing DOM ID: ${id}`);return elements.get(id);},querySelector(){return new El();}},navigator:{},setTimeout(){},URL,Blob};context.window=context;context.addEventListener=()=>{};context.scrollTo=()=>{};vm.createContext(context);
 for(const file of ['content.js','core.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
 return {elements,main};
}
for(const route of ['about','experience','clinical-practice','research','publications','teaching','presentations','projects','clinical-tools','cv','contact','mtp','economics','business','texas','evidence'])test(`route ${route} renders and binds`,()=>{const h=harness('#'+route);assert.ok(h.main.innerHTML.length>100);assert.match(h.elements.get('navigation').innerHTML,/Contact/);if(['mtp','economics','business','texas'].includes(route))assert.ok(h.elements.get('output').textContent.length>30);});
test('unknown hash safely falls back to About',()=>assert.match(harness('#<script>').main.innerHTML,/Dr. Norbert/));
test('MTP add and fictional case actions regenerate notes',()=>{const h=harness('#mtp');h.elements.get('add-mtp').onclick();assert.match(h.elements.get('output').textContent,/Problem-1/);h.elements.get('example').onclick();assert.match(h.elements.get('output').textContent,/FICTIONAL LEARNING CASE/);h.elements.get('clear').onclick();assert.doesNotMatch(h.elements.get('output').textContent,/DEMO-1|Problem-1/);});
test('historical coefficients render as numbers, not empty/undefined',()=>{const h=harness('#economics');assert.match(h.main.innerHTML,/428.3/);assert.doesNotMatch(h.main.innerHTML,/undefined/);});
test('LinkedIn is active and profile placeholders replaced',()=>{assert.match(harness('#contact').main.innerHTML,/https:\/\/www.linkedin.com\/in\/norbertrosario\//);assert.doesNotMatch(harness('#contact').main.innerHTML,/mailto:|tel:|pending/i);assert.match(harness('#experience').main.innerHTML,/Community First Health Plans/);assert.match(harness('#teaching').main.innerHTML,/UT Health San Antonio/);assert.match(harness('#cv').main.innerHTML,/Norbert_Rosario_Public_CV.pdf/);});
test('external MTP reference stays a homepage link',()=>{const d=JSON.parse(fs.readFileSync(path.join(root,'../data/registry.json'),'utf8'));const s=d.sources.find(x=>x.id==='S37');assert.equal(s.url,'https://www.optimizingmeds.org/');assert.equal(s.status,'External link only');});
