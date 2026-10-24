/* Fisiologia Interativa — Célula-Mapa, ECG (relógio de 75 bpm), ficha da unidade e roleta das salas de fuga.
   Dados em inicio/dados-<curso>.js. Prof. Mário César Nascimento, PhD © */
(function(){
'use strict';
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const COL = {celular:css('--u1'),muscular:css('--u2'),osteoarticular:css('--u3'),cardiovascular:css('--u4'),respiratorio:css('--u5'),integracao:css('--u6')};

/* ---------- dados: vêm de inicio/dados-<curso>.js (fonte única) ---------- */
const D = window.FI_DADOS;
const course = D.curso;
const UNITS = {};
D.unidades.forEach(u => { UNITS[u.id] = Object.assign({}, u, {[course]: u.sims.map(s => s.t)}); });
const ORDER = {[course]: D.unidades.map(u => u.id)};
let sel = ORDER[course][0];
const esc = s => String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

const RR=800;let beatAt=190;let dpr=Math.min(2,devicePixelRatio||1),mapVisible=true,ecgVisible=false;
/* ---------- Célula-Mapa ---------- */
const cv=document.getElementById('celula-biblioteca'), c=cv.getContext('2d');
let W=0,H=0,CX=0,CY=0,R=0;
function sizeMap(){const r=cv.getBoundingClientRect(); if(!r.width) return;W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;c.setTransform(dpr,0,0,dpr,0,0);CX=W/2;CY=H/2;R=Math.min(W,H)*(W<520?.39:.44);}
let rot=0, rotTarget=null;
const mol=[]; for(let i=0;i<46;i++) mol.push({a:Math.random()*6.28,r:Math.random(),k:['O2','CO2','Na','K','Ca','gli'][i%6],s:.6+Math.random()*.8,ph:Math.random()*6.28});
function peri(){return ORDER[course].filter(k=>k!=='integracao')}
function unitPos(k){
  if(k==='integracao') return {x:CX,y:CY,a:0};
  const P=peri(), i=P.indexOf(k), n=P.length;
  const a=-Math.PI/2 + i*2*Math.PI/n + rot;
  return {x:CX+Math.cos(a)*R*.63,y:CY+Math.sin(a)*R*.63,a};
}
function sims(k){return UNITS[k][course]}
function hexA(h,a){const n=parseInt(h.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`}

function drawMembrane(t,beat){
  const n=Math.max(90,Math.round(R*.95)); const off=t*0.00004;
  for(let layer=0;layer<2;layer++){
    const rr=R+(layer?7:-7);
    for(let i=0;i<n;i++){
      const a=i/n*6.283+off+(layer?.5/n*6.283:0);
      const x=CX+Math.cos(a)*rr,y=CY+Math.sin(a)*rr;
      const tx=CX+Math.cos(a)*(rr+(layer?-6:6)),ty=CY+Math.sin(a)*(rr+(layer?-6:6));
      c.strokeStyle='rgba(63,224,200,.16)';c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(tx,ty);c.stroke();
      c.fillStyle='rgba(63,224,200,.42)';c.beginPath();c.arc(x,y,1.9,0,7);c.fill();
    }
  }
  // proteínas de membrana (canais) + onda de despolarização a cada batimento
  const wave=((t-beatAt)/RR);
  for(let i=0;i<14;i++){
    const a=i/14*6.283+off*1.0+.11;
    const x=CX+Math.cos(a)*R,y=CY+Math.sin(a)*R;
    const lit=Math.max(0,1-Math.abs(((a-off+Math.PI/2+6.283*4)%6.283)/6.283-wave)*9);
    c.save();c.translate(x,y);c.rotate(a);
    c.fillStyle=hexA('#3FE0C8',.28+lit*.6);c.shadowColor='#3FE0C8';c.shadowBlur=lit*14;
    c.beginPath();c.roundRect(-5,-5,10,10,3);c.fill();c.restore();
  }
  // rótulos da membrana: FISIOLOGIA HUMANA no topo; no lado oposto, MEIO EXTERNO (fora) e MEIO INTERNO (dentro)
  arcText('FISIOLOGIA HUMANA', R+22, -Math.PI/2+off, 'auto', '600 11px "JetBrains Mono", monospace', 'rgba(63,224,200,.9)', 9.2/(R+22));
  arcText('MEIO EXTERNO', R+22, Math.PI/2+off, 'auto', '500 10px "JetBrains Mono", monospace', 'rgba(163,179,190,.8)', 8.4/(R+22));
  arcText('MEIO INTERNO', R-(W<560?26:20), Math.PI/2+off, 'auto', '500 10px "JetBrains Mono", monospace', 'rgba(63,224,200,.75)', 8.4/(R-20));
  // cadeado da Operação Protocolo Eferente, preso na membrana (lado direito)
  const la=0.08+off, lx=CX+Math.cos(la)*R, ly=CY+Math.sin(la)*R;
  c.fillStyle='#0c1219';c.strokeStyle='#E8B05C';c.lineWidth=1.3;c.beginPath();c.arc(lx,ly,13,0,7);c.fill();c.stroke();
  drawLock(lx,ly+.5,7.5,'#E8B05C'); lockPos={x:lx,y:ly};
  c.save();c.font='600 9px "JetBrains Mono", monospace';c.fillStyle='#E8B05C';c.textAlign='center';
  const od=W<560?-40:34, ox=lx+Math.cos(la)*od, oy=ly+Math.sin(la)*od; if(W>=560){c.fillText('OPERAÇÃO',ox,oy-4);c.fillText('SECRETA',ox,oy+7);}c.restore();
}
// texto em arco; bottom=true escreve pela parte de baixo, legível da esquerda para a direita
function arcText(str,rr,center,bottom,font,fill,step,stroke){
  c.save();c.font=font;c.textAlign='center';c.textBaseline='middle';
  const st=step;
  if(bottom==='auto') bottom=Math.sin(center)>0; // sempre legível: embaixo escreve pelo lado de fora da curva
  const n=str.length; let a0 = bottom ? center+(n-1)*st/2 : center-(n-1)*st/2;
  for(const ch of str){
    c.save();c.translate(CX0+Math.cos(a0)*rr,CY0+Math.sin(a0)*rr);c.rotate(bottom?a0-Math.PI/2:a0+Math.PI/2);
    if(stroke&&/[0-9]/.test(ch)){c.strokeStyle=fill;c.lineWidth=1;c.strokeText(ch,0,0);} else {c.fillStyle=fill;c.fillText(ch,0,0);}
    c.restore(); a0 += bottom?-st:st;
  }
  c.restore();
}
let CX0=0,CY0=0;
let lockPos=null;
const lockArt = new Image();
lockArt.onload = () => { if (RM) frame(performance.now()); };
lockArt.src = new URL('../../assets/icons/locks/closed-white.png', document.currentScript.src).href;
function drawLock(x,y,s,col){
  if (!lockArt.complete || !lockArt.naturalWidth) return;
  c.drawImage(lockArt,318,104,792,1090,x-s*.8,y-s*1.1,s*1.6,s*2.2);
}
function rbc(x,y,r,sat){ // hemácia bicôncava vista de cima
  const col = sat>0.5 ? [255,77,90] : [150,40,70];
  const g=c.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,`rgba(${col[0]},${col[1]},${col[2]},.35)`);g.addColorStop(.55,`rgba(${col[0]},${col[1]},${col[2]},.75)`);g.addColorStop(1,`rgba(${col[0]},${col[1]},${col[2]},.95)`);
  c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();
}
function bez(p0,p1,p2,u){const v=1-u;return {x:v*v*p0.x+2*v*u*p1.x+u*u*p2.x,y:v*v*p0.y+2*v*u*p1.y+u*u*p2.y}}
let flow=0;
function drawVessels(t,dt){
  // velocidade pulsátil: acelera logo após o pico R
  const ph=((t-beatAt)%RR)/RR; const v=0.00008+0.00022*Math.exp(-ph*5);
  flow+= RM?0:v*dt;
  for(const k of peri()){
    const p=unitPos(k), col=COL[k];
    const dx=p.x-CX,dy=p.y-CY,L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L;
    const out={x:CX+dx*.5+nx*L*.22,y:CY+dy*.5+ny*L*.22}, back={x:CX+dx*.5-nx*L*.22,y:CY+dy*.5-ny*L*.22};
    for(const [ctrl,dir] of [[out,1],[back,-1]]){
      c.strokeStyle=hexA(col,.16);c.lineWidth=7;c.beginPath();c.moveTo(CX,CY);c.quadraticCurveTo(ctrl.x,ctrl.y,p.x,p.y);c.stroke();
      c.strokeStyle=hexA(col,.35);c.lineWidth=1;c.stroke();
      const nR=5;
      for(let i=0;i<nR;i++){
        let u=((flow*(dir>0?1:1)+i/nR)%1); if(dir<0)u=1-u;
        // fisiologia: sai do centro oxigenada, volta dessaturada; no alvéolo o inverso
        const going = dir>0; let sat = going?1:0; if(k==='respiratorio') sat = going?0:1;
        const q=bez({x:CX,y:CY},ctrl,p,u); if(Math.hypot(q.x-CX,q.y-CY)<R*.1||Math.hypot(q.x-p.x,q.y-p.y)<R*.1)continue;
        rbc(q.x,q.y,Math.max(3,R*.018),sat);
      }
    }
  }
}
function glowDisk(x,y,r,col,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,a));g.addColorStop(1,hexA(col,0));c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();}

function drawCell(k,x,y,s,t,hi){
  const col=COL[k]; const ph=((t-beatAt)%RR)/RR;
  glowDisk(x,y,s*2.1,col,hi?.26:.14);
  c.save();c.translate(x,y);c.lineWidth=1.4;c.strokeStyle=col;c.fillStyle=hexA(col,.12);
  if(k==='celular'){
    c.beginPath();c.arc(0,0,s,0,7);c.fill();c.stroke();
    c.fillStyle=hexA(col,.55);c.beginPath();c.arc(-s*.12,s*.05,s*.36,0,7);c.fill();
    c.fillStyle=hexA('#ffffff',.5);c.beginPath();c.arc(-s*.2,-s*.02,s*.08,0,7);c.fill();
    for(let i=0;i<8;i++){const a=i/8*6.283+t*.0002;c.save();c.rotate(a);c.fillStyle=i%2?'#FFD27A':col;c.fillRect(s-3,-2.5,6,5);c.restore();}
    // Na+ entrando por um canal
    const u=(t%2400)/2400; const a=t*.0002; c.fillStyle='#FFD27A';c.beginPath();c.arc(Math.cos(a)*(s*1.4-u*s*.9),Math.sin(a)*(s*1.4-u*s*.9),2,0,7);c.fill();
  } else if(k==='muscular'){
    const w=s*2.3,h=s*.82; const tw=.5+.5*Math.sin(t*.0012); const sq=1-.06*Math.max(0,tw-.6)/.4;
    c.beginPath();c.roundRect(-w/2,-h/2,w,h,h/2);c.fill();c.stroke();
    c.save();c.beginPath();c.roundRect(-w/2,-h/2,w,h,h/2);c.clip();
    const sp=s*.2*sq; for(let xx=-w/2+4;xx<w/2;xx+=sp){c.strokeStyle=hexA(col,.55);c.lineWidth=sp*.45;c.beginPath();c.moveTo(xx,-h/2);c.lineTo(xx,h/2);c.stroke();}
    c.restore();
    c.fillStyle=hexA('#ffffff',.7);for(const [nx,ny] of [[-w*.28,-h/2+3],[w*.05,h/2-3],[w*.3,-h/2+3]]){c.beginPath();c.ellipse(nx,ny,s*.16,2.2,0,0,7);c.fill();}
  } else if(k==='osteoarticular'){
    c.strokeStyle=hexA(col,.3);c.beginPath();c.ellipse(0,0,s*1.05,s*.7,0,0,7);c.stroke();
    c.strokeStyle=col;
    for(let i=0;i<12;i++){const a=i/12*6.283+.2;const r1=s*.55,r2=s*1.55;c.beginPath();c.moveTo(Math.cos(a)*r1*1.1,Math.sin(a)*r1*.7);const mx=Math.cos(a)*r2*.75,my=Math.sin(a)*r2*.55;c.lineTo(mx,my);c.lineTo(Math.cos(a+.18)*r2,Math.sin(a+.18)*r2*.72);c.moveTo(mx,my);c.lineTo(Math.cos(a-.15)*r2*.95,Math.sin(a-.15)*r2*.7);c.lineWidth=1;c.stroke();}
    c.fillStyle=hexA(col,.2);c.beginPath();c.ellipse(0,0,s*.62,s*.4,0,0,7);c.fill();c.lineWidth=1.4;c.stroke();
    c.fillStyle=hexA(col,.6);c.beginPath();c.ellipse(0,0,s*.3,s*.2,0,0,7);c.fill();
  } else if(k==='cardiovascular'){
    const sc=1-.05*Math.exp(-ph*9)*(ph<.45?1:0); c.scale(sc,sc);
    const path=()=>{c.beginPath();c.moveTo(-s*1.3,-s*.32);c.lineTo(s*.2,-s*.32);c.lineTo(s*1.1,-s*.95);c.lineTo(s*1.35,-s*.6);c.lineTo(s*.55,0);c.lineTo(s*1.3,s*.45);c.lineTo(s*1.05,s*.78);c.lineTo(s*.15,s*.32);c.lineTo(-s*1.3,s*.32);c.closePath();};
    path();c.fill();c.stroke();c.save();path();c.clip();
    for(let xx=-s*1.3;xx<s*1.4;xx+=s*.16){c.strokeStyle=hexA(col,.42);c.lineWidth=s*.06;c.beginPath();c.moveTo(xx,-s);c.lineTo(xx+s*.1,s);c.stroke();}
    c.restore();
    c.strokeStyle='#fff';c.lineWidth=2.2;c.beginPath();c.moveTo(-s*1.3,-s*.32);c.lineTo(-s*1.3,-s*.05);c.lineTo(-s*1.22,-s*.05);c.lineTo(-s*1.22,s*.32);c.stroke(); // disco intercalar em degrau
    c.fillStyle=hexA('#ffffff',.75);c.beginPath();c.ellipse(-s*.45,0,s*.2,s*.12,0,0,7);c.fill();
  } else if(k==='respiratorio'){
    const br=1+.08*Math.sin(t*2*Math.PI/4000); // 15 ipm
    const lob=[[0,-s*.45,s*.55],[-s*.55,s*.1,s*.5],[s*.55,s*.12,s*.5],[0,s*.62,s*.46]];
    for(const [lx,ly,lr] of lob){c.beginPath();c.arc(lx*br,ly*br,lr*br,0,7);c.fill();c.stroke();}
    c.strokeStyle=hexA('#FF7478',.55);c.lineWidth=2;c.beginPath();c.arc(0,s*.1,s*1.25*br,-2.6,1.2);c.stroke();
    c.fillStyle=col;for(const [lx,ly] of [[-s*.2,-s*.72],[s*.8,s*.25]]){c.beginPath();c.arc(lx*br,ly*br,2.6,0,7);c.fill();} // pneumócitos II
    // gases dentro dos alvéolos: O2 chega pelo ar; CO2 sai do sangue para o alvéolo
    const gas=[['O2',0],['CO2',1],['CO2',2],['O2',3]];
    c.textAlign='center';c.textBaseline='middle';
    for(const [g,ix] of gas){const [lx,ly,lr]=lob[ix];const jx=Math.sin(t*.0011+ix*1.7)*lr*.18,jy=Math.cos(t*.0009+ix)*lr*.14;
      const mx=lx*br+jx,my=ly*br-lr*.18+jy;
      if(g==='O2'){c.fillStyle='#8fd3ff';c.beginPath();c.arc(mx-2.6,my,2.4,0,7);c.arc(mx+2.6,my,2.4,0,7);c.fill();}
      else{c.fillStyle='#ff9f9f';c.beginPath();c.arc(mx-4.4,my,2,0,7);c.arc(mx+4.4,my,2,0,7);c.fill();c.fillStyle='#b9c6cf';c.beginPath();c.arc(mx,my,2.4,0,7);c.fill();}
      c.font='600 '+Math.max(8,Math.round(s*.2))+'px "JetBrains Mono", monospace';c.fillStyle='#e9f1f4';c.fillText(g==='O2'?'O₂':'CO₂',lx*br+jx*.5,ly*br+lr*.32);
    }
    c.textAlign='start';c.textBaseline='alphabetic';
  } else if(k==='integracao'){
    const sc=1+.05*Math.exp(-ph*6);
    c.scale(sc,sc);
    c.lineWidth=2;c.beginPath();c.arc(0,0,s*.95,0,7);c.fill();c.stroke();
    c.strokeStyle=hexA(col,.45);c.lineWidth=1;c.beginPath();c.arc(0,0,s*.78,0,7);c.stroke();
    for(let i=0;i<3;i++){const a=i*2.09+t*.0004;c.fillStyle=hexA(col,.7);c.beginPath();c.ellipse(Math.cos(a)*s*.86,Math.sin(a)*s*.86,s*.14,s*.06,a+1.57,0,7);c.fill();} // núcleos endoteliais
    c.restore(); rbc(x,y,s*.5,1); c.save();c.translate(x,y);
  }
  c.restore();
}
function drawSims(k,x,y,s,t){
  const L=sims(k), n=L.length, out=[];
  for(let i=0;i<n;i++){
    const a=i/n*6.283 + t*.00018*(k==='integracao'?-1:1);
    const rr=s*(k==='muscular'?1.95:1.75)+ (i%2)*5;
    const px=x+Math.cos(a)*rr, py=y+Math.sin(a)*rr*.86;
    glowDisk(px,py,9,COL[k],.35);
    c.fillStyle=COL[k];c.beginPath();c.arc(px,py,3.4,0,7);c.fill();
    c.fillStyle='#fff';c.beginPath();c.arc(px-1,py-1,1.1,0,7);c.fill();
    out.push({x:px,y:py,name:L[i],k,href:UNITS[k].sims[i].href});
  }
  return out;
}
function drawMolecules(t){
  for(const m of mol){
    const rr=R*(.12+m.r*.8), a=m.a+t*.00003*m.s;
    const x=CX+Math.cos(a)*rr+Math.sin(t*.0007+m.ph)*6, y=CY+Math.sin(a)*rr+Math.cos(t*.0006+m.ph)*6;
    c.globalAlpha=.55;
    if(m.k==='O2'){c.fillStyle='#8fd3ff';c.beginPath();c.arc(x,y,2,0,7);c.arc(x+3.4,y,2,0,7);c.fill();}
    else if(m.k==='CO2'){c.fillStyle='#9aa9b5';c.beginPath();c.arc(x,y,1.8,0,7);c.fill();c.fillStyle='#ff9f9f';c.beginPath();c.arc(x-3.2,y,1.6,0,7);c.arc(x+3.2,y,1.6,0,7);c.fill();}
    else if(m.k==='gli'){c.strokeStyle='#e8d38a';c.lineWidth=1;c.beginPath();for(let j=0;j<6;j++){const b=j/6*6.283;c.lineTo(x+Math.cos(b)*3.2,y+Math.sin(b)*3.2)}c.closePath();c.stroke();}
    else{c.fillStyle=m.k==='Na'?'#FFD27A':m.k==='K'?'#c3a6ff':'#7ff0d0';c.beginPath();c.arc(x,y,1.6,0,7);c.fill();}
    c.globalAlpha=1;
  }
}
let hits=[], hover=null, last=0;
function frame(t){
  const dt=Math.min(50,t-(last||t)); last=t;
  if(t-beatAt>=RR){beatAt=t-((t-beatAt)%RR);}
  if(!RM && ecgVisible) ecgFrame(t);
  if(!mapVisible && !RM) return requestAnimationFrame(frame);
  if(rotTarget!==null){const d=rotTarget-rot;rot+=d*Math.min(1,dt*.006);if(Math.abs(d)<.002){rot=rotTarget;rotTarget=null;}}
  else if(!RM) rot+=dt*.000035;
  if(!(W>60&&R>40&&isFinite(R))){ if(!RM) requestAnimationFrame(frame); return; } // canvas ainda sem tamanho (ex.: captura de tela)
  c.clearRect(0,0,W,H);
  glowDisk(CX,CY,R*1.05,'#3FE0C8',.05);
  drawMolecules(t);
  drawVessels(t,dt);
  CX0=CX;CY0=CY; drawMembrane(t);
  hits=[];
  const s=R*.13;
  for(const k of ORDER[course]){
    const p=unitPos(k); const hi=(sel===k)||(hover&&hover.k===k);
    const ss=k==='integracao'?s*1.05:s;
    if(sel===k&&k!=='integracao'){c.strokeStyle=hexA(COL[k],.55);c.setLineDash([3,5]);c.lineWidth=1;c.beginPath();c.arc(p.x,p.y,ss*2.55,0,7);c.stroke();c.setLineDash([]);}
    drawCell(k,p.x,p.y,ss,t,hi);
    const sm=drawSims(k,p.x,p.y,ss,t); hits.push(...sm.map(o=>({...o,type:'sim'})));
    hits.push({x:p.x,y:p.y,r:ss*1.5,k,type:'unit',name:UNITS[k].curto+' · '+sims(k).length+' simuladores'});
    let ux=0,uy=1; if(k!=='integracao'){const dx=p.x-CX,dy=p.y-CY,L=Math.hypot(dx,dy)||1;ux=dx/L;uy=dy/L;}
    const ed=k==='muscular'?ss*1.2:k==='cardiovascular'?ss*1.25:ss*1.08;
    const lx=p.x+ux*ed,ly=p.y+uy*ed; if(UNITS[k].sala) {c.fillStyle='#0c1219';c.strokeStyle='#E8B05C';c.lineWidth=1.2;c.beginPath();c.arc(lx,ly,9,0,7);c.fill();c.stroke();drawLock(lx,ly+.5,5.5,'#E8B05C'); hits.push({x:lx,y:ly,r:10,k,type:'lock',name:'Sala: '+salaNome(k)});}
    // número + nome circulando em volta da própria célula
    const num=String(ORDER[course].indexOf(k)+1).padStart(2,'0');
    const txt=num+' · '+UNITS[k].curto.toUpperCase();
    const rr=k==='integracao'?ss*1.4:ss*(k==='muscular'?2.3:2.1), spin=RM?0:t*.00012*(k==='integracao'?-1:1);
    const fs=Math.max(8,Math.round(R*.034));
    CX0=p.x;CY0=p.y;
    arcText(txt, rr, -Math.PI/2+spin, 'auto', '600 '+fs+'px "Space Grotesk", sans-serif', hi?'#ffffff':hexA(COL[k],.95), fs*.7/rr, true);
  }
  if(lockPos) hits.push({x:lockPos.x,y:lockPos.y,r:12,type:'lock',k:'protocolo',name:'Operação Secreta · Protocolo Eferente'});
  c.textAlign='start';
  if(!RM) requestAnimationFrame(frame);
}
function salaNome(k){return UNITS[k].sala.nome}

new ResizeObserver(sizeMap).observe(cv);sizeMap();if(RM)frame(performance.now());else requestAnimationFrame(frame);})();
