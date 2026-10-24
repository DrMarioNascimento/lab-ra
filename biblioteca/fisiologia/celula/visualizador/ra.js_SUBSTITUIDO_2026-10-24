import * as T from 'three';
import {GLTFExporter} from './vendor/GLTFExporter.js';
import {mergeGeometries} from './vendor/BufferGeometryUtils.js';
import {prepararParaRA} from '../../potencial-membrana/cores-para-ra.js';
export function configureAR(root){
 const prepare=document.getElementById('prepare-ar'),launch=document.getElementById('launch-ar'),viewer=document.getElementById('cell-ar'),status=document.getElementById('ar-state');let url,version=0;
 let timer;const invalidate=()=>{clearTimeout(timer);timer=setTimeout(()=>prepare.click(),700);version++;launch.disabled=true;status.textContent='Prepare o estado atual para RA.'};
 ['mem','nuc','motion','cut','speed'].forEach(id=>document.getElementById(id).addEventListener('click',invalidate));
 document.getElementById('cut').addEventListener('input',invalidate);
 prepare.onclick=async()=>{const id=++version;prepare.disabled=true;launch.disabled=true;status.textContent='Preparando a peça…';try{
  const clone=root.clone(true);clone.updateMatrixWorld(true);const instances=[];
  clone.traverse(o=>{if(o.isInstancedMesh)instances.push(o);if(!o.isMesh||!o.material.clippingPlanes?.length)return;const geo=o.geometry.clone(),pos=geo.attributes.position,idx=geo.index?.array,keep=[],point=new T.Vector3();for(let k=0;k<(idx?idx.length:pos.count);k+=3){point.set(0,0,0);for(let v=0;v<3;v++)point.add(new T.Vector3().fromBufferAttribute(pos,idx?idx[k+v]:k+v));point.multiplyScalar(1/3).applyMatrix4(o.matrixWorld);if(o.material.clippingPlanes.every(p=>p.distanceToPoint(point)>=0))keep.push(idx?idx[k]:k,idx?idx[k+1]:k+1,idx?idx[k+2]:k+2)}geo.setIndex(keep);o.geometry=geo;o.material=o.material.clone();o.material.clippingPlanes=[]});
  // Expand instancing in the export clone for compatibility with mobile AR viewers.
  for(const o of instances){const matrix=new T.Matrix4(),pieces=[];for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);pieces.push(o.geometry.clone().applyMatrix4(matrix))}const geo=mergeGeometries(pieces);pieces.forEach(g=>g.dispose());const mesh=new T.Mesh(geo,o.material);mesh.name=o.name;mesh.position.copy(o.position);mesh.quaternion.copy(o.quaternion);mesh.scale.copy(o.scale);mesh.visible=o.visible;o.parent.add(mesh);o.removeFromParent()}
  prepararParaRA(clone);const box=new T.Box3().setFromObject(clone),size=box.getSize(new T.Vector3());clone.scale.multiplyScalar(.6/Math.max(size.x,size.y,size.z));clone.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(clone),center=bounds.getCenter(new T.Vector3());clone.position.set(-center.x,-bounds.min.y,-center.z);
  const bytes=await new GLTFExporter().parseAsync(clone,{binary:true,onlyVisible:true});if(id!==version)return;if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(new Blob([bytes],{type:'model/gltf-binary'}));viewer.src=url;status.textContent='Carregando a peça para RA…';
 }catch(e){console.error(e);status.textContent='Não foi possível preparar esta peça para RA.'}finally{prepare.disabled=false}};
 viewer.addEventListener('load',()=>{launch.disabled=!viewer.canActivateAR;status.textContent=viewer.canActivateAR?'Peça pronta. No iPhone, toque em AR após abrir.':'Peça preparada. A câmera RA requer aparelho e navegador compatíveis.'});viewer.addEventListener('error',()=>{launch.disabled=true;status.textContent='A peça não carregou no visualizador RA.'});launch.onclick=()=>viewer.activateAR();prepare.click();
}
