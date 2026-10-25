import {NodeIO} from '@gltf-transform/core';
const io=new NodeIO(),path='./celula-mobile-v2.glb',doc=await io.read(path);let fixed=0;
for(const mesh of doc.getRoot().listMeshes())for(const p of mesh.listPrimitives()){
 const t=p.getAttribute('TANGENT'),n=p.getAttribute('NORMAL');if(!t)continue;
 for(let i=0;i<t.getCount();i++){const v=t.getElement(i,[]);if(Math.hypot(...v.slice(0,3))>.99)continue;const normal=n.getElement(i,[]);const u=Math.abs(normal[0])<.9?[0,normal[2],-normal[1]]:[-normal[2],0,normal[0]];const l=Math.hypot(...u);t.setElement(i,[...u.map(x=>x/l),v[3]||1]);fixed++;}
}
await io.write(path,doc);console.log('Degenerate UV tangents repaired',fixed);
