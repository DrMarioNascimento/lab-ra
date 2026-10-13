import assert from 'node:assert/strict';
import test from 'node:test';
import {ESTADOS,comEstado,estadoDoPerfil,volumeRegional,ventilacaoDoPerfil,indicesCVF,contracaoCardiaca,CAPACIDADE_MODELO,duracaoEstado} from '../pleura/estados.js';
import {pressaoPleural,transpulmonar,fluxoEm} from '../pleura/fisica.js';
const perto=(a,b,t=1e-8)=>assert(Math.abs(a-b)<t,`${a} difere de ${b}`);
test('estados conservam a identidade das pressões e o sentido de enchimento',()=>{
 for(const p of ESTADOS) {
  let anterior=estadoDoPerfil(0,p.id).volume;
  for(let i=1;i<=400;i++) {
   const f=i/400,e=estadoDoPerfil(f,p.id);
   for(const x of [e.volume,e.fluxo,e.palveolar,e.deslocaPleural,e.expansao,e.arRetido])assert(Number.isFinite(x),p.id);
   assert(e.volume>=0&&e.volume<=1);
   assert(f<=p.fi?e.volume>=anterior-1e-10:e.volume<=anterior+1e-10,p.id);
   if(f<p.fi)assert(e.fluxo>=-1e-10);if(f>p.fi)assert(e.fluxo<=1e-10);
   for(const h of [0,.5,1])perto(transpulmonar(h,90,e),e.palveolar-pressaoPleural(h,90,e));
   anterior=e.volume;
  }
  if(p.id!=='cvf')perto(estadoDoPerfil(0,p.id).volume,estadoDoPerfil(1,p.id).volume);
 }
});
test('fluxo representa a derivada do volume e integra o volume corrente',()=>{
 for(const p of ESTADOS)for(const palveolar of p.id==='cvf'?[0]:[0,12])for(const f of [.06,.15,.31,.53,.79,.93]) {
  if(Math.abs(f-p.fi)<.01)continue;
  const d=1e-6,a=estadoDoPerfil(f-d,p.id,{palveolar}),b=estadoDoPerfil(f+d,p.id,{palveolar}),e=estadoDoPerfil(f,p.id,{palveolar});
  perto(e.fluxo,(b.volume-a.volume)*CAPACIDADE_MODELO/(2*d*duracaoEstado(p.id)),1e-5);
 }
});
test('exercício eleva frequência, volume corrente e perfusão',()=>{
 const r=comEstado('repouso'),x=comEstado('exercicio');
 assert(x.fr>r.fr&&x.fc>r.fc);
 const ganho=p=>estadoDoPerfil(p.fi,p.id).volume-estadoDoPerfil(0,p.id).volume;
 assert(ganho(x)>ganho(r));assert(fluxoEm(0,90,x.vascular)>fluxoEm(0,90));
});
test('Enfisema e Fibrose têm complacência, volumes e esvaziamento distintos',()=>{
 assert.deepEqual(ESTADOS.map(e=>e.id),['repouso','exercicio','enfisema','fibrose','cvf']);
 const normal=estadoDoPerfil(0),en=estadoDoPerfil(0,'enfisema'),fi=estadoDoPerfil(0,'fibrose');
 assert(en.arRetido>0&&en.volume>normal.volume);assert.equal(fi.arRetido,0);assert(fi.volume<normal.volume);
 for(const pl of [3,6,10])assert(volumeRegional(.5,0,{palveolar:pl-6.25,kComplacencia:fi.kComplacencia})<volumeRegional(.5,0,{palveolar:pl-6.25,kComplacencia:en.kComplacencia}));
 const pico=estadoDoPerfil(.4,'fibrose'),basePico=estadoDoPerfil(.4);
 assert(pico.volume-fi.volume<basePico.volume-normal.volume);
 assert(Math.abs(pico.deslocaPleural)>Math.abs(basePico.deslocaPleural));assert(pico.expansao<basePico.expansao);
 assert(comEstado('fibrose').fr>comEstado('repouso').fr);
});
test('CVF tem inspiração máxima, expiração forçada e volume residual distinto',()=>{
 const max=estadoDoPerfil(.25,'cvf'),fim=estadoDoPerfil(1,'cvf'),exp=estadoDoPerfil(.3,'cvf'),q=indicesCVF();
 perto(max.volume,1);perto(fim.volume,.2);perto(q.cvf,4.8);
 assert(q.vef1>0&&q.vef1<q.cvf&&q.razao>.7&&q.razao<1);
 assert(exp.fluxo<0&&exp.palveolar>0&&pressaoPleural(.5,90,exp)>0);
 assert(fim.volume<estadoDoPerfil(0,'cvf').volume);perto(fim.fluxo,0);
});
test('regiões mostram ganho basal maior e pneumotórax afeta metade do modelo',()=>{
 assert(ventilacaoDoPerfil(0,90,'repouso')>ventilacaoDoPerfil(1,90,'repouso'));
 for(const p of ESTADOS.filter(p=>p.id!=='cvf'))for(const pneumo of ['aberto','hipertensivo']) {
  const e=estadoDoPerfil(.15,p.id,{pneumo}),normal=estadoDoPerfil(.15,p.id);
  assert(e.volume<normal.volume);perto(e.fluxo,normal.fluxo/2);
  assert(volumeRegional(.5,90,e)>=0);
 }
});
test('coração tem relógio próprio e contrai cinco vezes em uma respiração de quatro segundos',()=>{
 perto(contracaoCardiaca(.13,75),contracaoCardiaca(.93,75));
 let picos=0,prev=0;
 for(let i=1;i<4000;i++){const atual=contracaoCardiaca(i/1000,75),proximo=contracaoCardiaca((i+1)/1000,75);if(atual>prev&&atual>=proximo)picos++;prev=atual;}
 assert.equal(picos,5);assert.equal(contracaoCardiaca(0,75),0);
});
