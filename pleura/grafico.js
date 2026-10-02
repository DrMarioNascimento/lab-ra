import {fluxoEm} from './fisica.js?v=estados-20261002';
import {estadoDoPerfil,comEstado,ventilacaoDoPerfil,CAPACIDADE_MODELO,duracaoEstado} from './estados.js?v=estados-20261002';
const azul='#88c5ff',verde='#8bdbc0',rosa='#f2a9a4',cinza='#aec6d5';
export function desenharGrafico(ctx,{modo,estado,fase,grau,ajuste,e}) {
  const W=ctx.canvas.width,H=ctx.canvas.height;
  ctx.clearRect(0,0,W,H);ctx.font='18px Inter, sans-serif';ctx.fillStyle=cinza;
  const texto=(t,x,y,c=cinza)=>{ctx.fillStyle=c;ctx.fillText(t,x,y)};
  const linha=(x,y,x2,y2,c='#395b6c')=>{ctx.strokeStyle=c;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke()};
  if(modo==='perfil') {
    texto('Ventilação · ganho regional',65,25,azul);texto('Perfusão · índice relativo',340,25,rosa);
    const maxV=estado==='cvf'?1:.5,maxF=16;
    const rows=[1,.75,.5,.25,0],ys=rows.map((_,i)=>65+i*45),L=[75,350],largura=165;
    for(let j=0;j<2;j++)for(let i=0;i<=2;i++){const x=L[j]+largura*i/2;linha(x,45,x,270);texto(j===0?`${Math.round(maxV*100*i/2)}%`:`${maxF*i/2}`,x-8,297)}
    rows.forEach((f,i)=>{texto(i===0?'Ápice':i===4?'Base':`${Math.round(f*100)}%`,5,ys[i]+5);
      const vs=[ventilacaoDoPerfil(f,grau,estado,ajuste),fluxoEm(f,grau,e)],max=[maxV,maxF];
      vs.forEach((v,j)=>{const x=L[j],w=Math.min(1,v/max[j])*largura;ctx.fillStyle=j===0?azul:rosa;ctx.fillRect(x,ys[i]-8,Math.max(1,w),16);
        texto(j===0?`${(v*100).toFixed(1)}%`:v.toFixed(1),L[j]+largura+7,ys[i]+5);});
    });
    texto('Δvolume regional (p.p.)',65,322);texto('Escala fixa: 0 a 16',350,322);
    const a=ventilacaoDoPerfil(1,grau,estado,ajuste)*100,b=ventilacaoDoPerfil(0,grau,estado,ajuste)*100;
    return `Ventilação: ápice +${a.toFixed(1)} e base +${b.toFixed(1)} pontos percentuais. Perfusão: ápice ${fluxoEm(1,grau,e).toFixed(1)} e base ${fluxoEm(0,grau,e).toFixed(1)}, em escala relativa fixa.`;
  }
  const cvf=estado==='cvf',T=cvf?6:duracaoEstado(estado),x0=52,x1=W-50;
  const painels=cvf?[{top:40,base:275,max:6,min:0,nome:'Volume expirado (L)',cor:verde}]:[
    {top:36,base:147,max:6,min:0,nome:'Volume pulmonar (L)',cor:verde},
    {top:190,base:290,max:cvf?10:4,min:cvf?-10:-4,nome:'Fluxo (L/s)',cor:azul}];
  const X=t=>x0+(x1-x0)*t/T;
  painels.forEach((p,k)=>{
    texto(p.nome,x0,p.top-9,p.cor);const Y=v=>p.base-(v-p.min)/(p.max-p.min)*(p.base-p.top);
    for(let i=0;i<=2;i++){const v=p.min+(p.max-p.min)*i/2;linha(x0,Y(v),x1,Y(v));texto(v.toFixed(0),18,Y(v)+5)}
    const points=[];
    for(let i=0;i<=160;i++){const t=T*i/160,f=cvf?.25+t/8:t/T,q=estadoDoPerfil(f,estado,{...ajuste,pneumo:e.pneumo}),v=cvf?(1-q.volume)*CAPACIDADE_MODELO:k===0?q.volume*CAPACIDADE_MODELO:q.fluxo;points.push([X(t),Y(v)]);}
    ctx.strokeStyle=p.cor;ctx.lineWidth=2.5;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
    const t=cvf?Math.max(0,(fase-.25)*8):fase*T,v=cvf?(fase<=.25?0:Math.max(0,(1-e.volume)*CAPACIDADE_MODELO)):k===0?e.volume*CAPACIDADE_MODELO:e.fluxo;
    linha(X(t),p.top,X(t),p.base,'#ffffff66');ctx.fillStyle=p.cor;ctx.beginPath();ctx.arc(X(t),Y(v),5,0,Math.PI*2);ctx.fill();
    if(cvf){linha(X(1),p.top,X(1),p.base,'#f0c895');texto('VEF₁ · 1 s',X(1)+6,p.top+20,'#f0c895')}
  });
  for(let i=0;i<=4;i++){const t=T*i/4;texto(`${t.toFixed(1)} s`,X(t)-13,H-9)}
  return cvf?`Expiração forçada: ${((fase<=.25?0:Math.max(0,1-e.volume))*CAPACIDADE_MODELO).toFixed(2)} L expirados. Curva teórica de volume por tempo; VEF₁ marcado em 1 segundo.`:`Volume atual ${(e.volume*CAPACIDADE_MODELO).toFixed(2)} L; fluxo ${e.fluxo.toFixed(2)} L/s. Ciclo de ${T.toFixed(1)} segundos. ${comEstado(estado).nota}`;
}
