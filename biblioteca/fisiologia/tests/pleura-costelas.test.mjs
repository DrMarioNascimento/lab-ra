import assert from 'node:assert/strict';
import test from 'node:test';
import {pontoCostal,pontoEsternal} from '../pleura/movimento-costal.js';
const distancia=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const dados=(lado,numero)=>({lado,numero,origem:{x:lado*.020,y:.24,z:-.08},eixo:{x:lado,y:0,z:0},insercao:numero<=10?{x:lado*.05,y:.18,z:.085}:null});
test('inserções anteriores seguem esterno/arco e articulações posteriores ficam ancoradas',()=>{
 for(const lado of [-1,1])for(let numero=1;numero<=12;numero++)for(const ec of [.65,1,1.38])for(const fase of [-.35,0,.5,1]) {
  const d=dados(lado,numero);
  assert(distancia(pontoCostal(d.origem,d,ec,fase),d.origem)<1e-12);
  if(d.insercao)for(const dx of [-.004,0,.004]) {
   const p={...d.insercao,x:d.insercao.x+dx};
   assert(distancia(pontoCostal(p,d,ec,fase),pontoEsternal(p,ec,fase))<1e-12);
  }
 }
});
test('movimento é contínuo na junção osso/cartilagem em ambos os lados',()=>{
 for(const lado of [-1,1])for(let numero=1;numero<=10;numero++)for(const ec of [.65,1.15,1.38])for(const fase of [-.35,.4,1]) {
  const d=dados(lado,numero),p={x:lado*.09,y:.175,z:.064};
  const a=pontoCostal(p,d,ec,fase),b=pontoCostal({...p,x:p.x+1e-7},d,ec,fase);
  assert(distancia(a,b)<5e-7,'Pontos vizinhos nos tecidos não podem desenvolver uma fresta');
 }
});
test('flutuantes mantêm ponta livre e retorno ao repouso não acumula deformação',()=>{
 for(const lado of [-1,1]) {
  const d=dados(lado,11),p={x:lado*.12,y:.12,z:.01};
  assert(distancia(pontoCostal(p,d,1,1),pontoEsternal(p,1,1))>.001);
  pontoCostal(p,d,1.38,1);assert(distancia(pontoCostal(p,d,1,0),p)<1e-12);
 }
});
