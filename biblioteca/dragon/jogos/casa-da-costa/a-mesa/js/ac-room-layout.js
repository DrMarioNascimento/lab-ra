(function(global){
 'use strict';
 const definitions={
  quadro:{larg:.86,altura:.66,alt:1.62},vaso:{larg:.42,altura:.78,alt:0,chao:true},
  escrivaninha:{larg:1.28,altura:.765,alt:0,chao:true},espelho:{larg:.52,altura:.74,alt:1.7},
  janela:{larg:1.05,altura:1.3,alt:1.5},relogio:{larg:.52,altura:.8,alt:1.82},
  luminaria:{larg:.46,altura:1.62,alt:0,chao:true},cofre:{larg:.50,altura:.44,alt:1.62,cover:'quadro'},
  secretaria:{larg:.30,altura:.11,alt:.66,cover:'escrivaninha'}
 };
 function random(seed){let h=2166136261>>>0;for(let i=0;i<seed.length;i++){h^=seed.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return ()=>{h=h+0x6D2B79F5|0;let t=Math.imul(h^h>>>15,1|h);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
 function layout(seed){
  const rnd=random('AC-COSTA'),sectors=[0,1,2,3,4,5,6,7],objects={};
  for(let i=7;i>0;i--){const j=Math.floor(rnd()*(i+1));[sectors[i],sectors[j]]=[sectors[j],sectors[i]];}
  let index=0;
  for(const [id,def] of Object.entries(definitions)){objects[id]={...def,id};if(!def.cover)objects[id].bearing=(sectors[index++]*45+(rnd()-.5)*17+360)%360;}
  const eye=[(rnd()-.5)*.7,(rnd()-.5)*.5,1.55];
  for(const o of Object.values(objects)){
   if(o.cover)o.bearing=objects[o.cover].bearing;
   const a=o.bearing*Math.PI/180,dx=Math.sin(a),dy=Math.cos(a);
   const distance=Math.min(Math.abs(dx)<1e-6?Infinity:((dx>0?2.75:-2.75)-eye[0])/dx,Math.abs(dy)<1e-6?Infinity:((dy>0?2.15:-2.15)-eye[1])/dy);
   o.d=o.chao?Math.max(.9,distance*.70):distance*.97;
  }
  for(const o of Object.values(objects))if(o.cover){const cover=objects[o.cover];cover.d*=.955;o.d=cover.d*1.042;}
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function updatePolar(o){const dx=o.pos[0]-eye[0],dy=o.pos[1]-eye[1];o.d=Math.hypot(dx,dy);o.bearing=(Math.atan2(dx,dy)*180/Math.PI+360)%360;}
  for(const o of Object.values(objects)){
    const a=o.bearing*Math.PI/180;o.pos=[eye[0]+Math.sin(a)*o.d,eye[1]+Math.cos(a)*o.d,o.alt];o.yaw=-a;
    if(!o.chao&&!o.cover){
      // Mount on the wall, with enough clearance that the frame cannot enter a corner.
      const dx=Math.sin(a),dy=Math.cos(a),tx=Math.abs(dx)<1e-6?Infinity:((dx>0?2.75:-2.75)-eye[0])/dx,ty=Math.abs(dy)<1e-6?Infinity:((dy>0?2.15:-2.15)-eye[1])/dy;
      const margin=o.larg/2+.08;
      if(tx<ty){const sign=Math.sign(dx);o.pos=[sign*2.63,clamp(eye[1]+dy*tx,-2.15+margin,2.15-margin),o.alt];o.yaw=-sign*Math.PI/2;o.normal=[-sign,0];}
      else {const sign=Math.sign(dy);o.pos=[clamp(eye[0]+dx*ty,-2.75+margin,2.75-margin),sign*2.03,o.alt];o.yaw=sign>0?0:Math.PI;o.normal=[0,-sign];}
      updatePolar(o);
    }
  }
  const painting=objects.quadro,safe=objects.cofre;
  safe.pos=[painting.pos[0]-painting.normal[0]*.06,painting.pos[1]-painting.normal[1]*.06,safe.alt];safe.yaw=painting.yaw;updatePolar(safe);
  return {seed:String(seed),eye,objects,width:5.5,depth:4.3,height:2.95};
 }
 function remember(seed){try{localStorage.setItem('ac:cenario',String(seed));}catch(_){}}
 function seed(){return new URLSearchParams(location.search).get('cenario')||'AC-COSTA';}
 global.ACRoom={layout,definitions,remember,seed};
})(window);
