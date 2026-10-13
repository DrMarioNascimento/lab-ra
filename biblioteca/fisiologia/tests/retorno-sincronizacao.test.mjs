import test from 'node:test';import assert from 'node:assert/strict';
import {NIVEL_AD,CORPO,MMHG_POR_CM,pressaoArterial,pressaoVenosa,pressaoLocal,leiturasHemodinamicas,fatorVenoso,mmHgParaCmH2O,aberturaValvula,projetarPostura,pulsoCardiaco} from '../retorno-venoso/fisica.js';
import {pressaoComBomba} from '../retorno-venoso/bomba.js';
const perto=(a,b)=>assert(Math.abs(a-b)<1e-9,`${a} ≠ ${b}`);
test('referências centrais e gradiente de escoamento periférico no decúbito',()=>{
 for(const grau of [0,15,45,70,90]){assert.equal(pressaoArterial(NIVEL_AD,grau),100);assert.equal(pressaoVenosa(NIVEL_AD,grau),2)}
 for(const h of [12,48,75,CORPO.jugular]){assert.equal(pressaoArterial(h,0),95);assert.equal(pressaoVenosa(h,0),5)}
 assert.equal(leiturasHemodinamicas(0).tornozelo.diferenca,90);
 assert.equal(leiturasHemodinamicas(0).coracao.diferenca,98);
});
test('hidrostática arterial e venosa usa a mesma altura, seno e conversão',()=>{
 assert(Math.abs(MMHG_POR_CM-.78)<.001);assert(Math.abs(mmHgParaCmH2O(1)-1.35951)<.00001);
 perto(pressaoVenosa(12,90),5+116*MMHG_POR_CM);perto(pressaoArterial(12,90),95+116*MMHG_POR_CM);
 perto(pressaoVenosa(12,45)-5,(pressaoVenosa(12,90)-5)/Math.sqrt(2));
 for(const g of [0,15,45,70,90])for(const h of [12,48,75])perto(pressaoArterial(h,g)-pressaoVenosa(h,g),90);
});
test('exemplo do slide depende do desnível e não de valores fixos por região',()=>{
 const abaixo=NIVEL_AD-88/MMHG_POR_CM,acima=NIVEL_AD+44/MMHG_POR_CM;
 perto(pressaoArterial(abaixo,90),183);perto(pressaoVenosa(abaixo,90),93);
 perto(pressaoArterial(acima,90),51);perto(pressaoVenosa(acima,90),-39);
 assert(Math.abs(pressaoArterial(CORPO.tornozelo,90)-183)>1);
});
test('jugular colabada não apresenta pressão negativa sustentada ou perfusão cerebral',()=>{
 const r=leiturasHemodinamicas(90).jugular;assert(r.pvLivre<0);assert.equal(r.pv,0);assert(r.colabada);assert.equal(r.diferenca,null);
 assert(!leiturasHemodinamicas(0).jugular.colabada);
 for(let g=0;g<=90;g++)for(const v of Object.values(leiturasHemodinamicas(g))){assert(v.pv>=0);assert(v.pa>0&&v.pa<200)}
});
test('caminhada diminui PV distal, preserva PA e a pressão média da coxa',()=>{
 let anterior=Infinity;for(let i=0;i<=10;i++){const a=i/10,p=pressaoLocal(12,90,a);assert(p<=anterior);assert(p>=25);anterior=p;assert.equal(pressaoLocal(75,90,a),pressaoVenosa(75,90));assert.equal(pressaoLocal(12,0,a),5);assert.equal(leiturasHemodinamicas(90,a).tornozelo.pa,pressaoArterial(12,90));
  for(const g of [0,30,60,90])perto(pressaoComBomba(pressaoVenosa(12,g),a),pressaoLocal(12,g,a));
 }
 assert.equal(pressaoLocal(12,90,1),25);
 const eps=1e-7;for(const h of [48,75])assert(Math.abs(pressaoLocal(h-eps,90,1)-pressaoLocal(h+eps,90,1))<1e-5);
});
test('gradiente e complacência demonstrativa são contínuos e limitados',()=>{
 for(const h of [NIVEL_AD-20,NIVEL_AD,NIVEL_AD+20])assert(Math.abs(pressaoVenosa(h-1e-7,90)-pressaoVenosa(h+1e-7,90))<1e-5);
 perto(fatorVenoso(5),Math.pow(10/12,.25));let anterior=0;
 for(let p=-40;p<=200;p++){const f=fatorVenoso(p);assert(f>=anterior&&f>=.8&&f<=1.45);anterior=f}
});
test('valva demonstra ejeção e bloqueio do refluxo no mesmo ciclo da bomba',()=>{
 assert.equal(aberturaValvula(0,false),1);assert.equal(aberturaValvula(.25,true),1);assert.equal(aberturaValvula(.75,true),0);assert.equal(aberturaValvula(0,true),aberturaValvula(1,true));
 for(let t=0;t<=1;t+=.01){const a=aberturaValvula(t,true);assert(a>=0&&a<=1)}
});
test('figura vertical em pé, horizontal deitada; coração usa tempo simulado',()=>{
 const head=projetarPostura(0,1,90),feet=projetarPostura(0,-1,90);assert.equal(head.x,feet.x);assert(head.y>feet.y);
 const lyingHead=projetarPostura(0,1,0),lyingFeet=projetarPostura(0,-1,0);assert(Math.abs(lyingHead.y-lyingFeet.y)<1e-12);assert(lyingHead.x<lyingFeet.x);
 assert(Math.abs(pulsoCardiaco(1/4/1.1)-1)<1e-12);assert.equal(pulsoCardiaco(0),0);assert(Math.abs(pulsoCardiaco(.12)-pulsoCardiaco(.12+1/1.1))<1e-12);
});
