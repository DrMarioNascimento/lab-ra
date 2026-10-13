import {CM,REGIOES,NIVEL_AD,projetarPostura,mmHgParaCmH2O} from './fisica.js?v=pa-pv-20261003';
const PA='#ff939b',PV='#88c5ff',numero=v=>v.toFixed(1).replace('.',',');
const valor=v=>numero(v)+' mmHg · '+numero(mmHgParaCmH2O(v))+' cmH₂O';
function preparar(canvas,H){
 const W=Math.max(220,Math.round(canvas.clientWidth)),dpr=Math.min(devicePixelRatio||1,2);
 canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);canvas.style.height=H+'px';
 const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);return {ctx,W};
}
// Projeta a malha aprovada de perfil: +Z é anterior, sem modificar o corpo 3D.
export function criarGraficoPostura(geo){
 geo.computeBoundingBox();const bb=geo.boundingBox,cz=(bb.min.z+bb.max.z)/2,cy=(bb.min.y+bb.max.y)/2;
 const scale=640/(bb.max.y-bb.min.y),bitmap=document.createElement('canvas');
 bitmap.width=Math.ceil((bb.max.z-bb.min.z)*scale)+40;bitmap.height=680;
 const c=bitmap.getContext('2d'),P=geo.attributes.position,I=geo.index;c.fillStyle='#425f73';
 for(let i=0;i<(I?.count??P.count);i+=3){c.beginPath();for(let j=0;j<3;j++){const k=I?I.getX(i+j):i+j,x=bitmap.width/2+(P.getZ(k)-cz)*scale,y=340-(P.getY(k)-cy)*scale;j?c.lineTo(x,y):c.moveTo(x,y)}c.closePath();c.fill()}
 return function desenhar(canvas,grau,leitura){
  const narrow=canvas.clientWidth<460,H=narrow?560:524,{ctx,W}=preparar(canvas,H);
  const a=(90-grau)*Math.PI/180,bw=bitmap.width/scale,bh=bitmap.height/scale;
  const extentX=Math.abs(Math.cos(a))*bw+Math.abs(Math.sin(a))*bh,extentY=Math.abs(Math.sin(a))*bw+Math.abs(Math.cos(a))*bh;
  const S=Math.min((W-48)/extentX,176/extentY),ox=W/2,oy=125;
  ctx.save();ctx.translate(ox,oy);ctx.rotate(-a);ctx.drawImage(bitmap,-bw*S/2,-bh*S/2,bw*S,bh*S);ctx.restore();
  ctx.font='12px Inter, sans-serif';ctx.fillStyle='#b6cad9';ctx.textAlign='center';
  ctx.fillText((grau<20?'Decúbito':grau>70?'Ortostatismo':'Inclinado')+' · '+grau.toFixed(0)+'°',W/2,22);
  REGIOES.forEach((r,i)=>{
   const v=leitura.regioes[r.id],q=projetarPostura(-cz,r.h*CM-cy,grau),x=ox+q.x*S,y=oy-q.y*S;
   ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fillStyle='#24485f';ctx.fill();ctx.strokeStyle='#cce3f6';ctx.lineWidth=1;ctx.stroke();
   ctx.font='bold 10px Inter, sans-serif';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(String(i+1),x,y+3.5);
   const lineY=258+i*(narrow?70:61);ctx.textAlign='left';ctx.font='12px Inter, sans-serif';ctx.fillStyle='#dce9f3';ctx.fillText((i+1)+'. '+r.nome+(r.id==='coracao'?' · átrio direito':''),16,lineY);
   ctx.font=(W<280?'10':'11')+'px Inter, sans-serif';
   for(const [prefix,p,color,dy] of [['PA',v.pa,PA,18],['PV',v.pv,PV,43]]){
    ctx.fillStyle=color;ctx.fillText(prefix+' '+(prefix==='PV'&&v.colabada?'jugular colabada':valor(p)),16,lineY+dy);
    const barY=lineY+dy+4,barW=W-32;ctx.fillStyle='#203645';ctx.fillRect(16,barY,barW,3);
    if(!(prefix==='PV'&&v.colabada)){ctx.fillStyle=color;ctx.fillRect(16,barY,Math.max(0,Math.min(200,p))/200*barW,3)}
   }
  });
  const ad=projetarPostura(-cz,NIVEL_AD*CM-cy,grau);ctx.beginPath();ctx.arc(ox+ad.x*S+13,oy-ad.y*S,3,0,Math.PI*2);ctx.fillStyle='#8cdcca';ctx.fill();
  ctx.textAlign='center';ctx.font='11px Inter, sans-serif';ctx.fillText('Verde: nível do átrio direito',W/2,230);
  ctx.textAlign='left';ctx.fillStyle='#aec6d5';ctx.font=(W<280?'10':'11')+'px Inter, sans-serif';ctx.fillText('PA/PV: mesma escala · 0–200 mmHg',16,H-16);
 };
}
export function desenharGraficoTemporal(canvas,historico,tempo,atual,janela=12){
 const H=310,{ctx,W}=preparar(canvas,H),L=39,R=W-59,T=80,B=H-37;
 ctx.textAlign='left';ctx.font='bold 12px Inter, sans-serif';ctx.fillStyle='#dce9f3';ctx.fillText('Tornozelo · PA/PV',L,18);
 ctx.font=(W<280?'10':'11')+'px Inter, sans-serif';ctx.fillStyle=PA;ctx.fillText('PA '+valor(atual.pa),16,35);ctx.fillStyle=PV;ctx.fillText('PV '+valor(atual.pv),16,51);
 ctx.font='10px Inter, sans-serif';ctx.fillStyle='#aec6d5';ctx.textAlign='right';ctx.fillText('mmHg',L-5,T-10);ctx.textAlign='left';ctx.fillText('cmH₂O',R+5,T-10);
 for(let p=0;p<=200;p+=50){const y=B-p/200*(B-T);ctx.strokeStyle='#284352';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(L,y);ctx.lineTo(R,y);ctx.stroke();ctx.fillStyle='#aec6d5';ctx.textAlign='right';ctx.fillText(String(p),L-5,y+3);ctx.textAlign='left';ctx.fillText(numero(mmHgParaCmH2O(p)),R+5,y+3)}
 const inicio=Math.max(0,tempo-janela),amostras=historico.filter(s=>s.t>=inicio&&s.t<=tempo);
 // O ponto corrente responde à postura durante pausa; o histórico não avança.
 amostras.push({t:tempo,pa:atual.pa,p:atual.pv});
 ctx.save();ctx.beginPath();ctx.rect(L,T,R-L,B-T);ctx.clip();
 for(const [campo,color] of [['pa',PA],['p',PV]]){
  ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();let first=true;
  for(const s of amostras){const x=L+(s.t-inicio)/janela*(R-L),y=B-s[campo]/200*(B-T);first?ctx.moveTo(x,y):ctx.lineTo(x,y);first=false}ctx.stroke();
 }
 ctx.restore();
 for(const [p,color] of [[atual.pa,PA],[atual.pv,PV]]){ctx.fillStyle=color;ctx.beginPath();ctx.arc(L+(tempo-inicio)/janela*(R-L),B-p/200*(B-T),3,0,2*Math.PI);ctx.fill()}
 ctx.fillStyle='#aec6d5';ctx.font='10px Inter, sans-serif';ctx.textAlign='center';
 for(let s=0;s<=janela;s+=janela/4)ctx.fillText((inicio+s).toFixed(0),L+s/janela*(R-L),B+15);
 ctx.fillText('Tempo simulado (s)',(L+R)/2,H-7);
}
