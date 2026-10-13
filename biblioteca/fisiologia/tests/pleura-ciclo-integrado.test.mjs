import assert from 'node:assert/strict';
import test from 'node:test';
import {estadoRespiratorio,pressaoPleural,transpulmonar,volumeRelativo,cicloAlveolar,CENARIOS,zonaEm,fluxoEm,CMH2O_EM_MMHG,pressoesEm,retornoVenosoRelativo,PPL_MEDIA_FRC} from '../pleura/fisica.js';
test('volume aumenta em toda a inspiração e diminui em toda a expiração',()=>{
 for(const c of CENARIOS)for(const grau of [0,15,30,45,60,75,90])for(const f of [0,.25,.5,.75,1]) {
  let anterior=volumeRelativo(transpulmonar(f,grau,estadoRespiratorio(0,c.ajuste)));
  for(let i=1;i<=200;i++) {
   const fase=i/200,v=volumeRelativo(transpulmonar(f,grau,estadoRespiratorio(fase,c.ajuste)));
   assert(Number.isFinite(v)&&v>=0&&v<=1);
   assert(i<=80?v>=anterior-1e-12:v<=anterior+1e-12,`volume invertido: ${c.id}, ${grau}°, f=${f}, fase=${fase}`);
   anterior=v;
  }
 }
});
test('pressão alveolar é exatamente zero nos extremos e tem o sinal do fluxo',()=>{
 for(const fase of [0,.4,1])assert.equal(cicloAlveolar(fase),0);
 for(let i=1;i<400;i++){const fase=i/1000;assert(cicloAlveolar(fase)<0)}
 for(let i=401;i<1000;i++){const fase=i/1000;assert(cicloAlveolar(fase)>0)}
});
test('pressão transpulmonar, pleural e alveolar usam o mesmo estado',()=>{
 for(const c of CENARIOS)for(const grau of [0,45,90])for(let i=0;i<=100;i++)for(const f of [0,.5,1]) {
  const e=estadoRespiratorio(i/100,c.ajuste),pl=transpulmonar(f,grau,e);
  assert(Math.abs(pl-(e.palveolar-pressaoPleural(f,grau,e)))<1e-12);
  const p=pressoesEm(f,grau,e);assert(Math.abs(p.palv-e.palveolar*CMH2O_EM_MMHG)<1e-12);
  assert(fluxoEm(f,grau,e)>=0);if(zonaEm(f,grau,e)===1)assert.equal(fluxoEm(f,grau,e),0);
 }
});
test('repouso preserva zonas 2/3 e base mais ventilada em todo o ciclo',()=>{
 let maior=0;
 for(let i=0;i<=200;i++) {
  const e=estadoRespiratorio(i/200);
  assert(volumeRelativo(transpulmonar(1,90,e))>volumeRelativo(transpulmonar(0,90,e)));
  for(const f of [0,.125,.25,.375,.5,.625,.75,.875,1])assert.notEqual(zonaEm(f,90,e),1);
  maior=Math.max(maior,volumeRelativo(transpulmonar(0,90,e)));
 }
 const ganhoBase=maior-volumeRelativo(transpulmonar(0,90));
 const ganhoApice=volumeRelativo(transpulmonar(1,90,estadoRespiratorio(.4)))-volumeRelativo(transpulmonar(1,90));
 assert(ganhoBase>ganhoApice);
});
test('exercício aumenta perfusão, hemorragia e pressão positiva não a aumentam',()=>{
 for(const grau of [0,45,90])for(const f of [0,.25,.5,.75,1])for(let i=0;i<=100;i++) {
  const base=fluxoEm(f,grau,estadoRespiratorio(i/100));
  for(const c of CENARIOS.slice(1)) {
   const q=fluxoEm(f,grau,estadoRespiratorio(i/100,c.ajuste));
   assert(c.id==='exercicio'?q>=base-1e-12:q<=base+1e-12);
  }
 }
});
test('pneumotórax mantém a pressão do cenário, sem respiração normal no lado afetado',()=>{
 for(let i=0;i<=100;i++)for(const [pneumo,ppl] of [['aberto',0],['hipertensivo',12]]) {
  const e=estadoRespiratorio(i/100,{pneumo});assert.equal(e.palveolar,0);assert.equal(pressaoPleural(.5,90,e),ppl);
 }
 assert(retornoVenosoRelativo(12)<retornoVenosoRelativo(0));
 assert(retornoVenosoRelativo(0)<retornoVenosoRelativo(PPL_MEDIA_FRC));
});
