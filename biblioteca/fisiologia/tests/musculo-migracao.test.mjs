import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';import vm from 'node:vm';
const text=f=>fs.readFileSync(new URL('../musculo-sarcomero/'+f,import.meta.url),'utf8').replace(/\r\n/g,'\n');
test('os cinco modelos musculares conservam integralmente a versão aprovada, incluindo o sarcômero',()=>{
 assert.equal(createHash('sha256').update(text('modelos.js')).digest('hex'),'91323428e5b9fc1b7f6ca064b456daa36d30ee6a37c1421c5e98dafcf0595e0a');
});
test('a transferência conserva a contração e a curva comprimento–tensão da origem',()=>{
 const source=text('app.js'),start=source.indexOf('function tensaoRelativa'),end=source.indexOf('/* ------------------------------------------------------------ rótulos');
 assert(start>=0&&end>start);
 assert.equal(createHash('sha256').update(source.slice(start,end)).digest('hex'),'721d5096ade3bdfa1c618d251701c5c59da3fe927b7df8e8d9a0e83d15044b7c');
 const fn=source.match(/function tensaoRelativa\(L\) \{[\s\S]*?\n\}/)[0],context={};vm.runInNewContext(fn,context);
 assert.equal(context.tensaoRelativa(1.27),0);assert.equal(context.tensaoRelativa(2.1),1);assert.equal(context.tensaoRelativa(3.6),0);
 assert(Math.abs(context.tensaoRelativa(2.4)-6/7)<1e-12);
});
