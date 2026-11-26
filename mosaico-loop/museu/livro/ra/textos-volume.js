/* Relevo geométrico dos textos desenhados em CanvasTexture, inclusive documentos.
   Conserva o desenho original da fonte; não troca nem reinterpreta as palavras. */
(function(global){
 'use strict';
 var T=global.THREE,P=global.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype;
 if(!T||!P||P.__raVolume)return;P.__raVolume=true;
 var fill=P.fillText,stroke=P.strokeText,draw=P.drawImage,clear=P.clearRect,rect=P.fillRect;
 function mask(ctx){
  var c=ctx.canvas,m=c.__raMask;
  var scale=Math.min(1,512/Math.max(c.width,c.height));
  if(!m||m.__sourceWidth!==c.width||m.__sourceHeight!==c.height){m=document.createElement('canvas');m.width=Math.max(1,Math.round(c.width*scale));m.height=Math.max(1,Math.round(c.height*scale));m.__sourceWidth=c.width;m.__sourceHeight=c.height;c.__raMask=m;c.__raRevision=0;}
  var g=m.getContext('2d'),a=ctx.getTransform();g.setTransform(a.a*scale,a.b*scale,a.c*scale,a.d*scale,a.e*scale,a.f*scale);return g;
 }
 function record(ctx,args,original){
  if(ctx.canvas.__raIsMask)return;
  var g=mask(ctx);g.canvas.__raIsMask=true;
  ['font','textAlign','textBaseline','direction','lineWidth','lineJoin','lineCap'].forEach(function(k){g[k]=ctx[k];});
  g.fillStyle=g.strokeStyle='white';g.globalAlpha=1;original.apply(g,args);ctx.canvas.__raRevision++;
 }
 P.fillText=function(){record(this,arguments,fill);return fill.apply(this,arguments);};
 P.strokeText=function(){record(this,arguments,stroke);return stroke.apply(this,arguments);};
 P.clearRect=function(){if(this.canvas.__raMask&&!this.canvas.__raIsMask){clear.apply(mask(this),arguments);this.canvas.__raRevision++;}return clear.apply(this,arguments);};
 P.fillRect=function(){if(this.canvas.__raMask&&!this.canvas.__raIsMask){clear.apply(mask(this),arguments);this.canvas.__raRevision++;}return rect.apply(this,arguments);};
 P.drawImage=function(){
  var src=arguments[0];if(src&&src.__raMask&&!this.canvas.__raIsMask){var args=Array.prototype.slice.call(arguments);args[0]=src.__raMask;if(args.length===3)args.push(src.width,src.height);else if(args.length===9){var scale=src.__raMask.width/src.width;for(var k=1;k<=4;k++)args[k]*=scale;}draw.apply(mask(this),args);this.canvas.__raRevision++;}
  return draw.apply(this,arguments);
 };
 function contours(canvas){
  var scale=Math.min(1,512/Math.max(canvas.width,canvas.height)),w=Math.max(1,Math.round(canvas.width*scale)),h=Math.max(1,Math.round(canvas.height*scale));
  var c=document.createElement('canvas');c.width=w;c.height=h;c.__raIsMask=true;var g=c.getContext('2d');draw.call(g,canvas,0,0,w,h);
  var pixels=g.getImageData(0,0,w,h).data,edges=new Map(),stride=w+1;
  function on(x,y){return x>=0&&y>=0&&x<w&&y<h&&pixels[(y*w+x)*4+3]>96;}
  function edge(x,y,a,b){var key=y*stride+x,list=edges.get(key);if(!list){list=[];edges.set(key,list);}list.push(b*stride+a);}
  for(var y=0;y<h;y++)for(var x=0;x<w;x++)if(on(x,y)){
   if(!on(x,y-1))edge(x,y,x+1,y);if(!on(x+1,y))edge(x+1,y,x+1,y+1);
   if(!on(x,y+1))edge(x+1,y+1,x,y+1);if(!on(x-1,y))edge(x,y+1,x,y);
  }
  var paths=new T.ShapePath(),loops=0;
  while(edges.size){
   var first=edges.keys().next().value,key=first,points=[],limit=0;
   do{points.push([key%stride,Math.floor(key/stride)]);var list=edges.get(key);if(!list)break;key=list.pop();if(!list.length)edges.delete(points[points.length-1][1]*stride+points[points.length-1][0]);if(++limit>100000)break;}while(key!==first);
   if(key!==first||points.length<3)continue;
   var simple=points.filter(function(p,i){var a=points[(i+points.length-1)%points.length],b=points[(i+1)%points.length];return (p[0]-a[0])*(b[1]-p[1])!==(p[1]-a[1])*(b[0]-p[0]);});
   if(simple.length<3)continue;loops++;paths.moveTo(simple[0][0]/w,1-simple[0][1]/h);
   for(var j=1;j<simple.length;j++)paths.lineTo(simple[j][0]/w,1-simple[j][1]/h);paths.lineTo(simple[0][0]/w,1-simple[0][1]/h);
  }
  return loops?paths.toShapes():[];
 }
 function relief(mesh,map,materialIndex){
  var image=map.image;if(!image||!image.__raMask||!mesh.geometry.attributes.uv)return null;
  var shapes=contours(image.__raMask);if(!shapes.length)return null;
  var src=mesh.geometry,pos=src.attributes.position,uv=src.attributes.uv,index=src.index,faces=[],largest=0,axis=new T.Vector3();
  function point(i){return new T.Vector3().fromBufferAttribute(pos,i);}
  for(var k=0;k<(index?index.count:pos.count);k+=3){
   if(materialIndex!==undefined&&!src.groups.some(function(g){return g.materialIndex===materialIndex&&k>=g.start&&k<g.start+g.count;}))continue;
   var ids=[0,1,2].map(function(j){return index?index.getX(k+j):k+j;}),a=point(ids[0]),b=point(ids[1]),c=point(ids[2]),n=new T.Vector3().crossVectors(b.clone().sub(a),c.clone().sub(a)),area=n.length();
   if(area>largest){largest=area;axis.copy(n).normalize();}faces.push({ids:ids,a:a,b:b,c:c,n:n.normalize(),area:area});
  }
  if(!largest)return null;var ai=Math.abs(axis.x)>Math.abs(axis.y)?(Math.abs(axis.x)>Math.abs(axis.z)?'x':'z'):(Math.abs(axis.y)>Math.abs(axis.z)?'y':'z');axis.set(0,0,0);axis[ai]=1;
  var grid=Array.from({length:32*32},function(){return [];});
  var selected=faces.filter(function(f){return f.n.dot(axis)>.45;});if(!selected.length){axis.negate();selected=faces.filter(function(f){return f.n.dot(axis)>.45;});}faces=selected;
  faces.forEach(function(f,faceIndex){f.index=faceIndex;
   f.uv=f.ids.map(function(i){return new T.Vector2().fromBufferAttribute(uv,i);});
   var minX=Math.max(0,Math.floor(Math.min.apply(null,f.uv.map(function(p){return p.x;}))*32)),maxX=Math.min(31,Math.floor(Math.max.apply(null,f.uv.map(function(p){return p.x;}))*32));
   var minY=Math.max(0,Math.floor(Math.min.apply(null,f.uv.map(function(p){return p.y;}))*32)),maxY=Math.min(31,Math.floor(Math.max.apply(null,f.uv.map(function(p){return p.y;}))*32));
   for(var y=minY;y<=maxY;y++)for(var x=minX;x<=maxX;x++)grid[y*32+x].push(f);
  });
  src.computeBoundingBox();var depth=src.boundingBox.getSize(new T.Vector3()).length()*.0012;
  var geo=new T.ExtrudeGeometry(shapes,{depth:1,bevelEnabled:false,curveSegments:1}),p=geo.attributes.position,missed=0,faceMap=new Int32Array(geo.attributes.position.count),weights=new Float32Array(geo.attributes.position.count*3),offsets=new Float32Array(geo.attributes.position.count);
  map.updateMatrix();var inverse=new T.Matrix3().copy(map.matrix).invert(),v=new T.Vector2(),normal=new T.Vector3(),out=new T.Vector3();
  for(var i=0;i<p.count;i++){
   v.set(p.getX(i),map.flipY?p.getY(i):1-p.getY(i)).applyMatrix3(inverse);
   var list=grid[Math.max(0,Math.min(31,Math.floor(v.y*32)))*32+Math.max(0,Math.min(31,Math.floor(v.x*32)))],found=false,z=p.getZ(i);
   for(var j=0;j<list.length;j++){
    var f=list[j],a=f.uv[0],b=f.uv[1],c=f.uv[2],den=(b.y-c.y)*(a.x-c.x)+(c.x-b.x)*(a.y-c.y);if(Math.abs(den)<1e-10)continue;
    var u=((b.y-c.y)*(v.x-c.x)+(c.x-b.x)*(v.y-c.y))/den,bb=((c.y-a.y)*(v.x-c.x)+(a.x-c.x)*(v.y-c.y))/den,cc=1-u-bb;
    if(u<-.002||bb<-.002||cc<-.002)continue;
    out.copy(f.a).multiplyScalar(u).addScaledVector(f.b,bb).addScaledVector(f.c,cc).addScaledVector(f.n,(z+.04)*depth);p.setXYZ(i,out.x,out.y,out.z);faceMap[i]=f.index;weights[i*3]=u;weights[i*3+1]=bb;weights[i*3+2]=cc;offsets[i]=(z+.04)*depth;found=true;break;
   }
   if(!found)missed++;
  }
  if(missed>p.count*.01){geo.dispose();return null;}
  geo.computeVertexNormals();geo.computeBoundingBox();geo.computeBoundingSphere();
  var ink=new T.Color(0x26221c);
  try{
   var inkCanvas=document.createElement('canvas');inkCanvas.width=image.__raMask.width;inkCanvas.height=image.__raMask.height;inkCanvas.__raIsMask=true;var c=inkCanvas.getContext('2d');draw.call(c,image,0,0,inkCanvas.width,inkCanvas.height);var data=c.getImageData(0,0,inkCanvas.width,inkCanvas.height).data,m=image.__raMask.getContext('2d').getImageData(0,0,inkCanvas.width,inkCanvas.height).data,r=0,g=0,b=0,n=0;
   for(i=0;i<m.length;i+=16)if(m[i+3]>220){r+=data[i];g+=data[i+1];b+=data[i+2];n++;}
   if(n)ink.setRGB(r/n/255,g/n/255,b/n/255).convertSRGBToLinear();
  }catch(e){}
  var child=new T.Mesh(geo,new T.MeshStandardMaterial({color:ink,roughness:.7,metalness:0}));child.name='texto_em_relevo';child.userData.raTextRelief=true;child.raycast=function(){};child.__raMapping={faces:faces,faceMap:faceMap,weights:weights,offsets:offsets,version:src.attributes.position.version};return child;
 }
 function atualizarRelevo(mesh,source){
  if(!mesh||!mesh.__raMapping)return;var m=mesh.__raMapping,src=source.attributes.position;
  if(src.version===m.version)return;m.version=src.version;
  m.faces.forEach(function(f){f.a.fromBufferAttribute(src,f.ids[0]);f.b.fromBufferAttribute(src,f.ids[1]);f.c.fromBufferAttribute(src,f.ids[2]);f.n.crossVectors(f.b.clone().sub(f.a),f.c.clone().sub(f.a)).normalize();});
  var p=mesh.geometry.attributes.position,w=m.weights;for(var i=0;i<p.count;i++){var f=m.faces[m.faceMap[i]],a=w[i*3],b=w[i*3+1],c=w[i*3+2],z=m.offsets[i];p.setXYZ(i,f.a.x*a+f.b.x*b+f.c.x*c+f.n.x*z,f.a.y*a+f.b.y*b+f.c.y*c+f.n.y*z,f.a.z*a+f.b.z*b+f.c.z*c+f.n.z*z);}
  p.needsUpdate=true;mesh.geometry.computeBoundingSphere();
 }
 var OriginalRenderer=T.WebGLRenderer;
 function VolumeRenderer(parameters){var renderer=new OriginalRenderer(parameters),render=renderer.render;
 renderer.render=function(scene,camera){
  var pending=[];
  function remover(record,o){if(record&&record.mesh){o.remove(record.mesh);record.mesh.geometry.dispose();record.mesh.material.dispose();}}
  function opacidade(record,material){if(record&&record.mesh){record.mesh.visible=material.visible!==false;record.mesh.material.opacity=material.opacity;record.mesh.material.transparent=material.transparent||material.opacity<1;}}
  scene.traverseVisible(function(o){
   if(!o.isMesh||o.userData.raTextRelief)return;
   var multi=Array.isArray(o.material),materials=multi?o.material:[o.material],previous=o.__raTextVolumes||[o.__raTextVolume],next=[];
   materials.forEach(function(material,slot){
    var map=material&&material.map,image=map&&map.image,old=previous[slot];
    if(!image||!image.__raMask){remover(old,o);next[slot]=null;return;}
    var revision=image.__raRevision||0,materialIndex=multi?slot:undefined;
    if(old&&old.image===image&&old.revision===revision&&old.geometry===o.geometry&&old.materialIndex===materialIndex){atualizarRelevo(old.mesh,o.geometry);opacidade(old,material);next[slot]=old;return;}
    remover(old,o);next[slot]=null;pending.push({object:o,map:map,image:image,revision:revision,slot:slot,material:material,materialIndex:materialIndex});
   });
   for(var i=materials.length;i<previous.length;i++)remover(previous[i],o);
   o.__raTextVolumes=next;o.__raTextVolume=next[0]||null;
  });
  pending.forEach(function(p){
   var o=p.object,m=relief(o,p.map,p.materialIndex),record={image:p.image,revision:p.revision,mesh:m,geometry:o.geometry,materialIndex:p.materialIndex};
   if(m){opacidade(record,p.material);o.add(m);}o.__raTextVolumes[p.slot]=record;o.__raTextVolume=o.__raTextVolumes[0]||null;
  });
  return render.call(renderer,scene,camera);
 };return renderer;}
 VolumeRenderer.prototype=OriginalRenderer.prototype;T.WebGLRenderer=VolumeRenderer;
})(typeof window!=='undefined'?window:globalThis);

