import {bulhas} from './fisica.js?v=coracao-20261003';
const margem={e:43,d:16,t:18,b:33},numero=v=>Number(v.toFixed(1)).toString().replace('.',',');
export function criarWiggers(canvas){
 const tela=canvas.getContext('2d'),fundo=document.createElement('canvas'),p=fundo.getContext('2d');let ultima='';
 const x=(fase,W)=>margem.e+fase*(W-margem.e-margem.d);
 return function desenhar(sim,fase){
  const W=Math.max(220,Math.round(canvas.clientWidth)),H=410,dpr=Math.min(devicePixelRatio||1,2),chave=[W,dpr,sim.duracoes.rr].join('|');
  if(canvas.width!==Math.round(W*dpr)||canvas.height!==Math.round(H*dpr)){canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);canvas.style.height=H+'px';ultima=''}
  if(ultima!==chave||desenhar.quadro!==sim.quadro){
   fundo.width=canvas.width;fundo.height=canvas.height;p.setTransform(dpr,0,0,dpr,0,0);p.clearRect(0,0,W,H);p.font='10px Inter, sans-serif';
   const q=sim.quadro,altura=(H-margem.t-margem.b)/4,faixa=i=>({topo:margem.t+i*altura,alt:altura-22});
   function eixo(i,min,max,titulo){const f=faixa(i);p.fillStyle='#aec6d5';p.textAlign='left';p.fillText(titulo,margem.e,f.topo-4);for(const v of [min,(min+max)/2,max]){const y=f.topo+f.alt-(v-min)/(max-min)*f.alt;p.strokeStyle='#284352';p.lineWidth=1;p.beginPath();p.moveTo(margem.e,y);p.lineTo(W-margem.d,y);p.stroke();p.fillStyle='#aec6d5';p.textAlign='right';p.fillText(numero(v),margem.e-5,y+3)}return f}
   function linha(campo,f,min,max,cor){p.strokeStyle=cor;p.lineWidth=1.7;p.beginPath();q.forEach((v,i)=>{const py=f.topo+f.alt-(v[campo]-min)/(max-min)*f.alt;i?p.lineTo(x(i/(q.length-1),W),py):p.moveTo(x(0,W),py)});p.stroke()}
   const teto=Math.max(140,Math.ceil(Math.max(...q.map(v=>Math.max(v.pVE,v.pAo,v.pAE)))/20)*20),volumeMax=Math.max(140,Math.ceil(sim.vdf/20)*20);
   let f=eixo(0,0,teto,'Pressões · mmHg');for(const [campo,cor]of [['pAo','#ff939b'],['pVE','#dce9f3'],['pAE','#8cdcca']])linha(campo,f,0,teto,cor);
   f=eixo(1,30,volumeMax,'Volume VE · mL');linha('vVE',f,30,volumeMax,'#ffcb96');
   f=faixa(2);p.fillStyle='#aec6d5';p.textAlign='left';p.fillText('ECG esquemático',margem.e,f.topo-4);linha('ecg',f,-.35,1.1,'#88c5ff');
   f=faixa(3);p.fillStyle='#aec6d5';p.fillText('Bulhas',margem.e,f.topo-4);p.strokeStyle='#284352';p.beginPath();p.moveTo(margem.e,f.topo+f.alt);p.lineTo(W-margem.d,f.topo+f.alt);p.stroke();
   for(const b of bulhas(q).todas){const bx=x(b.fase,W);p.strokeStyle='#ffcb96';p.lineWidth=2;p.beginPath();p.moveTo(bx,f.topo+f.alt);p.lineTo(bx,f.topo+5);p.stroke();p.fillStyle='#ffcb96';p.fillText(b.nome,Math.min(W-29,bx+4),f.topo+14)}
   p.fillStyle='#aec6d5';p.textAlign='center';for(let i=0;i<=4;i++)p.fillText(numero(i/4*sim.duracoes.rr),x(i/4,W),H-18);p.fillText('Tempo no ciclo (s)',(margem.e+W-margem.d)/2,H-3);
   ultima=chave;desenhar.quadro=sim.quadro;
  }
  tela.setTransform(dpr,0,0,dpr,0,0);tela.clearRect(0,0,W,H);tela.drawImage(fundo,0,0,W,H);tela.strokeStyle='#9ce4ed';tela.lineWidth=1.5;tela.beginPath();const cursor=x(((fase%1)+1)%1,W);tela.moveTo(cursor,margem.t);tela.lineTo(cursor,H-margem.b);tela.stroke();
 };
}
