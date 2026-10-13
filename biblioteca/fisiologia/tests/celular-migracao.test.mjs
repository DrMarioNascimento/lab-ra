import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';import vm from 'node:vm';
const text=f=>fs.readFileSync(new URL('../potencial-membrana/'+f,import.meta.url),'utf8').replace(/\r\n/g,'\n'),hash=s=>createHash('sha256').update(s).digest('hex');
test('modelos celulares preservam integralmente a revisão aprovada 303bad1',()=>assert.equal(hash(text('modelos.js')),'23ac7c4a4fb4c18e6d63d21b7c2e27c14899506b4ad74c5a61b0667571665c41'));
test('Goldman, Nernst, capacitância e onda conservam integralmente os cálculos aprovados',()=>{
 const app=text('app.js'),code=app.slice(app.indexOf('const CONC ='),app.indexOf('const dados ='));
 assert.equal(hash(code),'4e387ea812c2e8c22d8d2191f92503fca00c8d34ffe71f774c4f8546ea84cf20');const c={};vm.runInNewContext(code+';this.fn={goldman,nernst,contagem,vmNoTempo,AXONIO_MM,VEL_AXONIO};',c);
 assert(Math.abs(c.fn.goldman(.03,4)+76.3340336536194)<1e-8);assert.equal(c.fn.vmNoTempo(0),-70);assert.equal(c.fn.vmNoTempo(.4),38);assert.equal(c.fn.vmNoTempo(1.3),-82);assert.equal(c.fn.vmNoTempo(5.2),-70);
 assert.equal(c.fn.AXONIO_MM/c.fn.VEL_AXONIO,3);
 const q=c.fn.contagem(50,-70);assert(q.molSep>0&&q.razao>1e5);assert(Math.abs(c.fn.contagem(100,-70).razao/q.razao-2)<1e-12);
});
test('a experiência celular usa somente recursos locais do novo repositório e bibliotecas fixadas',()=>{
 for(const f of ['index.html','app.js','modelos.js','style.css'])assert.doesNotMatch(text(f),/https?:\/\/(?:drmarionascimento\.github\.io\/lab-ra|raw\.githubusercontent\.com\/DrMarioNascimento\/lab-ra)|bancadas\.html|guard\.js/i);
 assert.match(text('index.html'),/Fisiologia celular/);assert.match(text('index.html'),/data-voltar-tutor/);
});
