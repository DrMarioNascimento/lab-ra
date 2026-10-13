import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const base=new URL('../',import.meta.url),ler=p=>readFile(new URL(p,base));
test('instalação conserva todos os recursos declarados na migração de Pleura',async()=>{
 const manifest=JSON.parse(await ler('manifesto.json'));assert(manifest.arquivos.length>=20);
 for(const f of manifest.arquivos) {
  const b=await ler(f.path),content=/\.(glb|webp)$/.test(f.path)?b:b.toString('utf8').replace(/\r\n/g,'\n');
  assert.equal(createHash('sha256').update(content).digest('hex'),f.sha256,f.path);
 }
});
test('arquivos de execução não usam repositório antigo, catálogo ou autenticação',async()=>{
 const manifest=JSON.parse(await ler('manifesto.json'));
 for(const f of manifest.arquivos.filter(f=>/\.(html|js|css)$/.test(f.path)&&!f.path.startsWith('tests/')))assert.doesNotMatch((await ler(f.path)).toString(),/https?:\/\/(?:drmarionascimento\.github\.io\/lab-ra|raw\.githubusercontent\.com\/DrMarioNascimento\/lab-ra)|bancadas\.html|guard\.js/i,f.path);
 const html=(await ler('pleura/index.html')).toString();assert.doesNotMatch(html,/Laboratório do Pesquisar|Bancada 10|>Bancadas<|data-ra-lock|data-ra-protected/);
});
test('Voltar ao Tutor retorna ao percurso EF ou Fisioterapia de origem',async()=>{
 const code=(await ler('tutor-origem.js')).toString();
 for(const curso of ['educacao-fisica','fisioterapia'])for(const ready of ['complete','loading']) {
  const raiz='https://example.test/fisiologia-interativa/ra/',links=[{href:raiz+'pleura/'},{href:raiz+'index.html'}];let callback;
  const document={readyState:ready,currentScript:{src:raiz+'tutor-origem.js'},querySelectorAll:()=>links,addEventListener:(_,fn)=>callback=fn};
  vm.runInNewContext(code,{URL,URLSearchParams,document,location:{search:'?percurso='+curso}});if(callback)callback();
  for(const link of links)assert.equal(link.href,'https://example.test/fisiologia-interativa/tutor-'+(curso==='fisioterapia'?'fisio':'ef')+'.html');
 }
});
