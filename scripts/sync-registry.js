'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'../docs');
const data=JSON.parse(fs.readFileSync(path.join(root,'data/registry.json'),'utf8'));
fs.writeFileSync(path.join(root,'assets/content.js'),'window.ClinicalData = '+JSON.stringify(data,null,2)+';\n');
console.log('Offline registry updated.');
