import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { PADRAO, CLASSICO, TECIDO, cmH2O, pressaoCapilar, pressaoLiquida,
  oncExterna, mediaLiquida, pontoDeVirada, fluxos, balanco, avancar,
  edemaEm, estadoDoTecido, comCausa, CAUSAS } from '../starling/fisica.js';
const close=(actual,expected,eps=1e-9)=>assert.ok(Math.abs(actual-expected)<eps,actual+' versus '+expected);
test('conversão física mmHg para cmH2O preserva sinal e zero',()=>{
 close(cmH2O(1),1.35951);close(cmH2O(-10),-13.5951);assert.equal(cmH2O(0),0);
});
test('comparação clássica mantém +13 / −7 mmHg e cruzamento 65%',()=>{
 close(pressaoLiquida(0,CLASSICO),13);close(pressaoLiquida(1,CLASSICO),-7);
 close(mediaLiquida(CLASSICO),3);close(pontoDeVirada(CLASSICO),.65);
});
test('revisado usa πsg, sem trocar silenciosamente por πi',()=>{
 close(pressaoLiquida(0,PADRAO),7);close(pressaoLiquida(1,PADRAO),1);
 assert.equal(oncExterna(PADRAO),6);
 assert.equal(pressaoLiquida(.5,{...PADRAO,oncInter:99}),pressaoLiquida(.5,PADRAO));
 close(pressaoLiquida(.5,{...PADRAO,oncSub:10}),8);
});
test('revisado não oculta pressão negativa por um clamp',()=>{
 const e={...PADRAO,oncPlasma:34};assert.ok(pressaoLiquida(1,e)<0);
 assert.ok(fluxos(e).reabsorvido>0);
});
test('integral exata separa áreas positivas e negativas',()=>{
 const f=fluxos(CLASSICO);close(f.filtrado,.0845);close(f.reabsorvido,.0245);close(f.liquido,.06);
 for(const e of [PADRAO,CLASSICO,{...PADRAO,oncPlasma:34},{...PADRAO,oncPlasma:4}]){
  close(fluxos(e).liquido,e.kf*mediaLiquida(e));
 }
});
test('zero nos extremos não é cruzamento interior',()=>{
 const e={...CLASSICO,pcVenular:17};assert.equal(pontoDeVirada(e),null);
 assert.equal(pontoDeVirada({...e,pcArterial:17}),null);
});
test('σ=0 elimina ambas as contribuições oncóticas',()=>{
 const e={...PADRAO,sigma:0};close(pressaoLiquida(.5,e),23);
 close(pressaoLiquida(.5,{...e,oncPlasma:4,oncSub:25}),23);
});
test('pressão microvascular linear limita a posição ao leito',()=>{
 close(pressaoCapilar(-1),24);close(pressaoCapilar(2),18);close(pressaoCapilar(.5),21);
});
test('normal em ambos os modos não acumula volume',()=>{
 for(const e of [PADRAO,CLASSICO]){
  close(balanco(e).acumula,0);close(edemaEm(1440,e),0);
  close(balanco(e).liquido,balanco(e).linfa);
 }
});
test('cada estado de edema altera o determinante esperado',()=>{
 assert.equal(CAUSAS.length,6);
 assert.ok(comCausa('depe').estado.pcVenular>PADRAO.pcVenular);
 assert.ok(comCausa('cardiaca').estado.pcVenular>PADRAO.pcVenular);
 assert.ok(comCausa('hipoalbuminemia').estado.oncPlasma<PADRAO.oncPlasma);
 assert.ok(comCausa('inflamacao').estado.sigma<PADRAO.sigma);
 assert.ok(comCausa('inflamacao').estado.kf>PADRAO.kf);
 assert.deepEqual(comCausa('linfatico').estado,PADRAO);
 for(const c of CAUSAS.filter(c=>c.id!=='normal')){
  const {estado,semLinfa}=comCausa(c.id);assert.ok(edemaEm(30,estado,{semLinfa})>0,c.id);
 }
});
test('retorno linfático não cresce com o Kf da inflamação',()=>{
 const a=balanco(PADRAO,{volume:100}), b=balanco({...PADRAO,kf:.08},{volume:100});
 assert.equal(a.linfa,b.linfa);close(a.linfa,TECIDO.capacidadeLinfa);
});
test('aumento de Pi reduz filtração e edema permite drenagem posterior',()=>{
 const c=comCausa('inflamacao'), accumulated=edemaEm(60,c.estado);
 assert.ok(accumulated>20);
 assert.ok(estadoDoTecido(c.estado,accumulated).pi>c.estado.pi);
 assert.ok(balanco(c.estado,{volume:accumulated}).filtrado<balanco(c.estado).filtrado);
 assert.ok(balanco(PADRAO,{volume:accumulated}).acumula<0);
 assert.ok(avancar(accumulated,60,PADRAO)<accumulated);
});
test('taxa mostrada obedece ao balanço de massa e ao incremento numérico',()=>{
 for(const c of CAUSAS){
  const {estado:e,semLinfa}=comCausa(c.id), opts={volume:12,semLinfa};
  const b=balanco(e,opts);close(b.acumula,b.filtrado-b.reabsorvido-b.linfa);
  const dt=.00001;close((avancar(12,dt,e,{semLinfa})-12)/dt,b.acumula,1e-6);
 }
});
test('volume positivo não tem teto arbitrário; integração converge',()=>{
 const e=comCausa('inflamacao').estado;
 const a=edemaEm(1440,e);assert.ok(a>60);assert.ok(Number.isFinite(a));
 const first=avancar(0,15,e), split=avancar(first,15,e);
 close(split,avancar(0,30,e),1e-8);
 assert.equal(avancar(0,-2,e),0);assert.equal(avancar(0,NaN,e),0);
 assert.ok(avancar(1,1440,{...PADRAO,oncPlasma:34})>=0);
});
test('linfático obstruído remove a drenagem, não as forças iniciais',()=>{
 const {estado:e,semLinfa}=comCausa('linfatico');
 close(balanco(e,{semLinfa}).linfa,0);close(balanco(e,{semLinfa}).acumula,.08);
});
test('cenários clássicos e revisados têm referências distintas explícitas',()=>{
 assert.equal(comCausa('normal','classico').estado.modelo,'classico');
 assert.equal(comCausa('desconhecida').nome,'Basal');
});
