import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {createHash} from 'node:crypto';
import {simular,em,bulhas} from '../coracao/fisica.js';import {faseDoInstante,mmHgParaCmH2O} from '../coracao/leituras.js';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url));
test('coração mantém exatamente os dois modelos confirmados',()=>{
 for(const [f,h]of [['assets/coracao.glb','fcb3c1036fe59dfdcc1c30917dbdaa8fbd52c858e6ba3cadaf126b44ccca4b5b'],['assets/coracao-interno.glb','b717a1f2e3880835703d4088a2cc99e06e01efc49695e7e55abf32d5c6af79cd']])assert.equal(createHash('sha256').update(read(f)).digest('hex'),h);
 const b=read('assets/coracao-interno.glb'),n=b.readUInt32LE(12),g=JSON.parse(b.subarray(20,20+n).toString());assert.equal(g.meshes.length,79);assert(g.nodes.filter(n=>n.mesh!==undefined).length===79);assert(g.buffers.every(b=>!b.uri));assert(g.images?.every(i=>!i.uri)??true);
});
test('instantes rápidos derivam das valvas do ciclo na frequência selecionada',()=>{
 for(const fc of [40,60,75,100,120,150,180,200]){const s=simular(fc);for(const tipo of ['enchimento','ejecao']){const f=faseDoInstante(s,tipo);assert(f!==null);const q=em(s,f);if(tipo==='enchimento')assert(q.mitral&&q.tricuspide&&!q.aortica&&!q.pulmonar&&q.qMitral>0&&q.qTri>0);else assert(!q.mitral&&!q.tricuspide&&q.aortica&&q.pulmonar&&q.qAortica>0&&q.qPulm>0)}const b=bulhas(s.quadro);assert(b.b1&&b.b2);assert.equal(b.todas.length,2)}
 assert(Math.abs(mmHgParaCmH2O(1)-1.35951)<.00001);
});
test('card cardiovascular mantém ambos os acessos nos dois percursos',()=>{
 const window={};vm.runInNewContext(read('../tutor-ra-card.js').toString(),{window});for(const curso of ['educacao-fisica','fisioterapia']){const html=window.cardRealidadeAumentada(curso,'cardiovascular');assert(html.includes('ra/coracao/?percurso='+curso));assert(html.includes('ra/retorno-venoso/?percurso='+curso));assert.equal((html.match(/target="_blank" rel="noopener noreferrer"/g)||[]).length,2);assert(!window.cardRealidadeAumentada(curso,'respiratorio').includes('ra/coracao/'))}
});
test('coração não exige autenticação e conserva créditos, assinatura e percurso',()=>{
 const h=read('coracao/index.html').toString();assert.doesNotMatch(h,/guard\.js|data-ra-protected|bancadas\.html|https?:\/\/drmarionascimento\.github\.io\/lab-ra/);assert(h.includes('data-voltar-tutor'));assert(h.includes('Simuladores interativos utilizados nas disciplinas de Fisiologia Humana'));assert(h.includes('BodyParts3D'));assert(h.includes('neshallads'));assert(h.includes('LICENSE.md'));assert(h.includes('Vista Interna')&&h.includes('Vista Externa'));assert(h.includes('somente Vista Externa'));assert(h.includes('Fonte da Vista Interna'));assert(h.includes('Os batimentos de cada área cardíaca (segmento) foram cuidadosamente calculados pelo Prof. Mário César Nascimento, PhD'));
});
