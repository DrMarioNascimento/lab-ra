import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';
const text=p=>readFile(new URL(`../${p}`,import.meta.url),'utf8');
async function abrir(endereco) {
 const destino=[],url=new URL(endereco),location={href:url.href,pathname:url.pathname,search:url.search,replace:u=>destino.push(u)};
 const context={URL,URLSearchParams,location,document:{currentScript:{src:'https://example.test/lab-ra/guard.js?v=livre'},querySelector:()=>null}};
 Object.defineProperty(context,'sessionStorage',{get(){throw Error('armazenamento indisponível')}});
 vm.runInNewContext(await text('guard.js'),context);return destino;
}
test('bancadas abrem diretamente sem conta nem armazenamento',async()=>{
 for(const p of ['pleura/?nivel=4&grau=90','coracao/','retorno-venoso/','bancadas.html'])assert.deepEqual(await abrir('https://example.test/lab-ra/'+p),[]);
});
test('links antigos conservam bancada, nível e postura',async()=>{
 const alvo='https://example.test/lab-ra/pleura/?nivel=4&grau=45&fase=0.4';
 assert.deepEqual(await abrir('https://example.test/lab-ra/index.html?laboratorio=acesso&destino='+encodeURIComponent(alvo)),[alvo]);
});
test('destinos externos, caminhos irmãos e laços abrem somente o catálogo',async()=>{
 for(const alvo of ['https://example.test/lab-ra/','https://example.test/lab-ra/?laboratorio=acesso','https://evil.test/lab-ra/pleura/','https://example.test/lab-ra-outro/','https://example.test/lab-ra/index.html?laboratorio=acesso','https://example.test/lab-ra/../privado/','http://example.test/lab-ra/pleura/'])assert.deepEqual(await abrir('https://example.test/lab-ra/index.html?destino='+encodeURIComponent(alvo)),['https://example.test/lab-ra/bancadas.html']);
});
test('entrada oferece acesso direto e não carrega autenticação',async()=>{
 assert.match(await text('index.html'),/href="bancadas.html">Abrir bancadas/);
 assert.doesNotMatch(await text('guard.js'),/firebase|signIn|sessionStorage|GoogleAuthProvider/);
 for(const p of ['bancadas.html','pleura/index.html','musculo-sarcomero/index.html','potencial-membrana/index.html','coracao/index.html','retorno-venoso/index.html','starling/index.html','bancadas/11-coracao/prototipo/duas-pecas.html'])assert.doesNotMatch(await text(p),/data-ra-protected|data-ra-lock/);
});
