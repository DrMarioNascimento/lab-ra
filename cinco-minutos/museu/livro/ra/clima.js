/* Clima local à maquete: acompanha a âncora nos motores WebXR e 8th Wall. */
(function(global){
 'use strict';
 function criar(raiz,op){
  op=op||{};var T=global.THREE,box=new T.Box3().setFromObject(raiz),inv=new T.Matrix4().copy(raiz.matrixWorld).invert();
  if(op.limites)box=new T.Box3(new T.Vector3().fromArray(op.limites[0]),new T.Vector3().fromArray(op.limites[1]));
  else box.applyMatrix4(inv);
  var size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3()),L=Math.max(size.x,size.y,size.z,.1);
  var grupo=new T.Group();grupo.name='clima_local';grupo.userData.naoExportar=true;raiz.add(grupo);
  var reduzido=op.reduzido===undefined?matchMedia('(prefers-reduced-motion: reduce)').matches:op.reduzido;
  var ligado=!reduzido,tempo=0,seed=251026,dummy=new T.Object3D(),drops=[];
  function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
  var chuva=new T.InstancedMesh(new T.BoxGeometry(L*.0008,L*.018,L*.0008),new T.MeshBasicMaterial({color:0xbad6e8,transparent:true,opacity:.32,depthWrite:false}),72);
  chuva.instanceMatrix.setUsage(T.DynamicDrawUsage);chuva.frustumCulled=false;grupo.add(chuva);
  for(var i=0;i<72;i++)drops.push({x:box.min.x+size.x*rnd(),z:box.min.z+size.z*rnd(),fase:rnd(),speed:.7+rnd()*.5});
  var canvas=document.createElement('canvas');canvas.width=canvas.height=128;var ctx=canvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,0,64,64,64);
  gradient.addColorStop(0,'rgba(200,217,224,.30)');gradient.addColorStop(.45,'rgba(190,208,220,.12)');gradient.addColorStop(1,'rgba(180,205,220,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  var tex=new T.CanvasTexture(canvas),mist=[],mat=new T.MeshBasicMaterial({map:tex,color:0xb6cbd3,transparent:true,opacity:.17,depthWrite:false,side:T.DoubleSide});
  for(i=0;i<8;i++){
   var m=new T.Mesh(new T.PlaneGeometry(Math.min(size.x,L*.38),Math.min(size.y,L*.20)),mat);
   m.rotation.y=i*Math.PI*.618;m.position.set(center.x+(rnd()-.5)*size.x*.55,box.min.y+size.y*(.12+rnd()*.22),center.z+(rnd()-.5)*size.z*.55);
   m.userData.x=m.position.x;m.userData.z=m.position.z;grupo.add(m);mist.push(m);
  }
  var light=new T.PointLight(0xc4dcff,0,0);light.position.set(center.x,box.max.y,center.z);grupo.add(light);
  var points=[new T.Vector3(box.min.x+size.x*.12,box.max.y,center.z),new T.Vector3(box.min.x+size.x*.16,box.max.y-size.y*.12,center.z),new T.Vector3(box.min.x+size.x*.10,box.max.y-size.y*.12,center.z),new T.Vector3(box.min.x+size.x*.15,box.max.y-size.y*.30,center.z)];
  var bolt=new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0xdcecff,transparent:true,opacity:.7}));bolt.visible=false;grupo.add(bolt);
  grupo.traverse(function(o){o.raycast=function(){};});
  var button=document.createElement('button');button.type='button';button.className='ra-clima-toggle';button.style.cssText='min-height:44px;padding:8px 12px;border-radius:12px;border:1px solid #9baebc;background:linear-gradient(#374653,#162531);box-shadow:inset 0 1px 2px #ffffff50,0 3px 8px #0006;color:#edf5f8;font:600 12px system-ui;cursor:pointer';
  var host=op.host||document.querySelector('.tools,.acoes')||document.body;host.appendChild(button);
  function pintar(){grupo.visible=ligado;light.intensity=0;bolt.visible=false;button.textContent=ligado?'Clima: ligado':'Clima: desligado';button.setAttribute('aria-pressed',String(ligado));}
  button.title='Nevoeiro leve, chuva e um relâmpago ocasional. Não interfere nas pistas.';button.onclick=function(){ligado=!ligado;pintar();};pintar();
  function update(dt){
   if(!ligado||document.hidden)return;tempo+=Math.max(0,Math.min(.05,dt||0));
   for(var i=0;i<drops.length;i++){var d=drops[i],u=(d.fase+tempo*d.speed)%1;dummy.position.set(d.x,box.max.y-size.y*u,d.z);dummy.rotation.z=-.16;dummy.updateMatrix();chuva.setMatrixAt(i,dummy.matrix);}chuva.instanceMatrix.needsUpdate=true;
   mist.forEach(function(m,i){m.position.x=m.userData.x+Math.sin(tempo*.10+i)*size.x*.025;m.position.z=m.userData.z+Math.cos(tempo*.08+i)*size.z*.025;});
   var t=tempo%23,flash=t>19&&t<19.13;light.intensity=flash?.65*Math.sin((t-19)/.13*Math.PI):0;bolt.visible=flash;
  }
  function dispose(){button.remove();if(grupo.parent)grupo.parent.remove(grupo);grupo.traverse(function(o){if(o.geometry)o.geometry.dispose();});chuva.material.dispose();mat.dispose();bolt.material.dispose();tex.dispose();}
  update(0);return {update:update,dispose:dispose,grupo:grupo,estado:function(){return {ligado:ligado,gotas:drops.length,tempo:tempo};}};
 }
 global.RAClima={criar:criar};
})(typeof window!=='undefined'?window:globalThis);

