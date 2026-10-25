import fs from 'node:fs';import validator from 'gltf-validator';
const p=process.argv[2]||'./celula-mobile-v2.glb';const r=await validator.validateBytes(new Uint8Array(fs.readFileSync(p)),{maxIssues:1000});fs.writeFileSync(p+'.validation.json',JSON.stringify(r,null,2));console.log(JSON.stringify({errors:r.issues.numErrors,warnings:r.issues.numWarnings,messages:r.issues.messages.slice(0,12)}));
