// Mantém texturas/UVs e materiais dos modelos aprovados. As variantes são
// reproduzíveis, sem substituir os arquivos originais.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplifyPrimitive, compactPrimitive, dequantize, meshopt } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder,
});
const base = new URL('../assets/', import.meta.url);
// Além da posição, preserva normais e UVs. Evita que a redução transforme
// grupos de folhas em grandes manchas de textura ou faces com luz incorreta.
function reduzir(d,ratio,error){
 for(const mesh of d.getRoot().listMeshes())for(const prim of mesh.listPrimitives()){
  compactPrimitive(prim);
  const count=prim.getAttribute('POSITION').getCount(),attrs=[prim.getAttribute('NORMAL'),prim.getAttribute('TEXCOORD_0')].filter(Boolean);
  const stride=attrs.reduce((n,a)=>n+a.getElementSize(),0),values=new Float32Array(count*stride),weights=[];
  let offset=0;for(const attr of attrs){const size=attr.getElementSize();weights.push(...Array(size).fill(attr===prim.getAttribute('NORMAL')?.5:.25));for(let i=0;i<count;i++)values.set(attr.getElement(i,[]),i*stride+offset);offset+=size;}
  const simplificador={...MeshoptSimplifier,simplify:(indices,positions,ps,target,error,flags=[])=>MeshoptSimplifier.simplifyWithAttributes(indices,positions,ps,values,stride,weights,null,target,error,[...flags,'Permissive','Prune'])};
  simplifyPrimitive(prim,{simplifier:simplificador,ratio,error,lockBorder:false});
 }
}
const contar = d => d.getRoot().listMeshes().reduce((s,m)=>s+m.listPrimitives().reduce((a,p)=>a+(p.getIndices()?.getCount()||p.getAttribute('POSITION').getCount())/3,0),0);
for (const [nome,ratio] of [['arvore',.60],['arvore_nova1',.35]]) {
  for (const [nivel,multiplicador] of [['mobile',1],['economica',.43]]) {
    const d=await io.read(new URL(nome+'_ra.glb',base).pathname), antes=contar(d);
    await d.transform(dequantize(),weld());reduzir(d,ratio*multiplicador,nivel==='economica'?.12:.08);await d.transform(meshopt({encoder:MeshoptEncoder,level:'medium'}));
    const depois=contar(d);
    if(depois>antes*.9)throw Error('Simplificação insuficiente: '+nome+' '+depois+'/'+antes);
    await io.write(new URL(nome+'_'+nivel+'.glb',base).pathname,d);
    console.log(`${nome}_${nivel}: ${antes} → ${depois} triângulos`);
  }
}
