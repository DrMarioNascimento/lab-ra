import fs from 'node:fs';
import crypto from 'node:crypto';
const source=new URL('../assets/pleura-simulacao-aprovada.glb',import.meta.url),destination=new URL('../assets/pleura-duas-camadas.glb',import.meta.url);
const original=fs.readFileSync(source),jsonSize=original.readUInt32LE(12),g=JSON.parse(original.subarray(20,20+jsonSize).toString()),bin=original.subarray(28+jsonSize);
const pieces=[bin];let length=bin.length;
const material=(name,color,alpha)=>({name,doubleSided:true,alphaMode:'BLEND',pbrMetallicRoughness:{baseColorFactor:[...color,alpha],metallicFactor:0,roughnessFactor:.38}});
const visceral=g.materials.length;g.materials.push(material('pleura_visceral_azul',[.18,.58,.88],.18));
const parietal=g.materials.length;g.materials.push(material('pleura_parietal_lilas',[.50,.23,.78],.14));
const parents=new Map();g.nodes.forEach((n,i)=>(n.children??[]).forEach(child=>parents.set(child,i)));
const initialCount=g.nodes.length;
let added=0,parietals=0;
for(let i=0;i<initialCount;i++){
 const node=g.nodes[i];
 if(node.mesh!==undefined&&node.name?.startsWith('pleura_parietal_')){
  for(const primitive of g.meshes[node.mesh].primitives){primitive.material=parietal;delete primitive.attributes.COLOR_0;}
  parietals++;continue;
 }
 if(node.mesh===undefined||!/^lobo_/.test(node.name??''))continue;
 const mesh=structuredClone(g.meshes[node.mesh]);
 for(const primitive of mesh.primitives){
  const a=g.accessors[primitive.attributes.POSITION],v=g.bufferViews[a.bufferView],n=g.accessors[primitive.attributes.NORMAL],nv=g.bufferViews[n.bufferView];
  const data=Buffer.alloc(a.count*12),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  for(let j=0;j<a.count;j++)for(let k=0;k<3;k++){
   const pos=bin.readFloatLE((v.byteOffset??0)+(a.byteOffset??0)+j*(v.byteStride??12)+k*4);
   const normal=bin.readFloatLE((nv.byteOffset??0)+(n.byteOffset??0)+j*(nv.byteStride??12)+k*4);
   const value=pos+.00025*normal;data.writeFloatLE(value,j*12+k*4);min[k]=Math.min(min[k],value);max[k]=Math.max(max[k],value);
  }
  const view=g.bufferViews.length;g.bufferViews.push({buffer:0,byteOffset:length,byteLength:data.length,target:34962});pieces.push(data);length+=data.length;
  const accessor=g.accessors.length;g.accessors.push({bufferView:view,componentType:5126,count:a.count,type:'VEC3',min,max});
  primitive.attributes={POSITION:accessor,NORMAL:primitive.attributes.NORMAL};primitive.material=visceral;
 }
 const meshId=g.meshes.length;g.meshes.push(mesh);const newNode={...structuredClone(node),name:'pleura_visceral_'+node.name,mesh:meshId};delete newNode.children;
 const nodeId=g.nodes.length;g.nodes.push(newNode);const parent=parents.get(i);if(parent===undefined)throw Error('Lobo sem grupo pai');g.nodes[parent].children.push(nodeId);added++;
}
if(added!==5||parietals!==2)throw Error('Número de camadas inesperado');
const newBin=Buffer.concat(pieces);if(!newBin.subarray(0,bin.length).equals(bin))throw Error('Geometria aprovada alterada');g.buffers[0].byteLength=newBin.length;
const text=Buffer.from(JSON.stringify(g)),chunk=Buffer.alloc((text.length+3)&~3,0x20);text.copy(chunk);const header=Buffer.from(original.subarray(0,20));header.writeUInt32LE(chunk.length,12);header.writeUInt32LE(20+chunk.length+8+newBin.length,8);const binHeader=Buffer.alloc(8);binHeader.writeUInt32LE(newBin.length,0);binHeader.writeUInt32LE(0x004e4942,4);
const output=Buffer.concat([header,chunk,binHeader,newBin]);fs.writeFileSync(destination,output);
const report={source:'pleura-simulacao-aprovada.glb',destination:'pleura-duas-camadas.glb',approvedGeometryBinaryUnchanged:true,visceralLobes:added,parietalEnvelopes:parietals,visceralOffsetMeters:.00025,sha256:crypto.createHash('sha256').update(output).digest('hex')};console.log(JSON.stringify(report));
