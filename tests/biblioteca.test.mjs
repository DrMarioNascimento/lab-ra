import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const page=readFileSync(new URL('bancadas.html',root),'utf8');
test('biblioteca apresenta dois cards e duas ilustracoes sem links',()=>{
 assert.equal((page.match(/class="card"/g)||[]).length,2);
 assert.equal((page.match(/class="emblema"/g)||[]).length,2);
 const emblemas=page.slice(page.indexOf('<div class="emblemas"'),page.indexOf('<div class="cards"'));
 assert.doesNotMatch(emblemas,/<a\b/);
 assert.match(page,/Capítulo 1: O malote murcho/);
 assert.match(page,/Prólogo: Agência 0688/);
 assert.match(page,/Aprender pesquisa fazendo pesquisa/);
 assert.match(page,/Fazendo, errando e criando/);
});
test('todos os acessos do catalogo existem localmente',()=>{
 for(const [,href] of page.matchAll(/href="([^"]+)"/g)){
  const url=new URL(href,root);if(!url.pathname.endsWith('.html')&&!url.pathname.endsWith('.css')&&!url.pathname.endsWith('.webp'))url.pathname=url.pathname.replace(/\/$/,'')+'/index.html';
  assert.ok(existsSync(fileURLToPath(url)),href);
 }
});
test('componentes originais copiados mantem os hashes registrados',()=>{
 const hashes=JSON.parse(readFileSync(new URL('biblioteca/arquivos-originais.json',root),'utf8'));
 assert.ok(Object.keys(hashes).length>100);
 for(const [p,sha] of Object.entries(hashes)){
  let payload=readFileSync(new URL(p,root));
  if(/\.(?:js|mjs|cjs|html|css|md|json|txt|py|svg|vtt|rules|gitkeep)$/i.test(p)||!p.split(/[\\/]/).pop().includes('.'))payload=Buffer.from(payload.toString('utf8').replace(/\r\n/g,'\n'));
  assert.equal(createHash('sha256').update(payload).digest('hex'),sha,p);
 }
});
test('Fisiologia retorna para biblioteca sem entrar em Tutor',()=>{
 const s=readFileSync(new URL('biblioteca/fisiologia/tutor-origem.js',root),'utf8');assert.match(s,/bancadas.html#fisiologia/);assert.doesNotMatch(s,/tutor-ef|tutor-fisio/);
});
