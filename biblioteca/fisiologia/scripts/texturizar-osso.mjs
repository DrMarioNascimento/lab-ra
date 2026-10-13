import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
const table=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc(data){let c=0xffffffff;for(const x of data)c=table[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function chunk(type,data){const t=Buffer.from(type),n=Buffer.alloc(4),sum=Buffer.alloc(4);n.writeUInt32BE(data.length);sum.writeUInt32BE(crc(Buffer.concat([t,data])));return Buffer.concat([n,t,data,sum]);}
function png(size,pixel){const rows=Buffer.alloc(size*(1+size*4));for(let y=0;y<size;y++){const row=y*(1+size*4);for(let x=0;x<size;x++)pixel(x,y).forEach((v,k)=>rows[row+1+x*4+k]=Math.max(0,Math.min(255,Math.round(v))));}const h=Buffer.alloc(13);h.writeUInt32BE(size,0);h.writeUInt32BE(size,4);h[8]=8;h[9]=6;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',h),chunk('IDAT',zlib.deflateSync(rows)),chunk('IEND',Buffer.alloc(0))]);}
const size=512,tau=2*Math.PI;
const height=(x,y)=>{const u=x/size,v=y/size;const fine=Math.sin(tau*(31*u+17*v))*.055+Math.sin(tau*(53*u-43*v))*.025;const soft=Math.sin(tau*(7*u+3*v))*.14+Math.cos(tau*(11*u-5*v))*.08;const pores=Math.max(0,Math.cos(tau*47*u+.6*Math.sin(tau*3*v))*Math.cos(tau*51*v+.6*Math.cos(tau*5*u)));return soft+fine-.10*pores**12;};
fs.writeFileSync('ra/assets/textures/osso-cortical-normal-v1.png',png(size,(x,y)=>{const dx=(height((x+1)%size,y)-height((x-1+size)%size,y))*2,dy=(height(x,(y+1)%size)-height(x,(y-1+size)%size))*2,l=Math.hypot(dx,dy,1);return [128-dx/l*127,128-dy/l*127,128+127/l,255];}));
fs.writeFileSync('ra/assets/textures/osso-cortical-rugosidade-v1.png',png(size,(x,y)=>[255,211+15*Math.sin(tau*(7*x/size+3*y/size)),0,255]));
const maps=['ra/assets/textures/osso-cortical-albedo-v1.png','ra/assets/textures/osso-cortical-normal-v1.png','ra/assets/textures/osso-cortical-rugosidade-v1.png'];
function build(source,destination){
 const old=fs.readFileSync(source),jsonSize=old.readUInt32LE(12),g=JSON.parse(old.subarray(20,20+jsonSize).toString()),bin=old.subarray(28+jsonSize);
 const blocks=[bin];let length=bin.length;
 function append(bytes,target){const padding=(4-length%4)%4;if(padding){blocks.push(Buffer.alloc(padding));length+=padding;}const id=g.bufferViews.length;g.bufferViews.push({buffer:0,byteOffset:length,byteLength:bytes.length,...(target?{target}: {})});blocks.push(bytes);length+=bytes.length;return id;}
 g.images??=[];g.textures??=[];g.samplers??=[];
 const sampler=g.samplers.length;g.samplers.push({wrapS:10497,wrapT:10497,magFilter:9729,minFilter:9987});
 const textures=maps.map(path=>{const view=append(fs.readFileSync(path)),image=g.images.length;g.images.push({bufferView:view,mimeType:'image/png',name:path.split('/').at(-1)});const texture=g.textures.length;g.textures.push({source:image,sampler});return texture;});
 const bone=g.materials.findIndex(m=>m.name==='osso');if(bone<0)throw Error('Material ósseo ausente');
 const mat=g.materials[bone],alpha=mat.pbrMetallicRoughness.baseColorFactor?.[3]??1;
 mat.pbrMetallicRoughness={...mat.pbrMetallicRoughness,baseColorFactor:[.82,.81,.78,alpha],baseColorTexture:{index:textures[0]},metallicFactor:0,roughnessFactor:.92,metallicRoughnessTexture:{index:textures[2]}};
 mat.normalTexture={index:textures[1],scale:.24};
 if(mat.extensions?.KHR_materials_sheen)mat.extensions.KHR_materials_sheen.sheenColorFactor=[.03,.028,.025];
 let primitives=0,vertices=0;
 for(const mesh of g.meshes)for(const p of mesh.primitives){if(p.material!==bone)continue;const a=g.accessors[p.attributes.POSITION],v=g.bufferViews[a.bufferView],uv=Buffer.alloc(a.count*8);let centerX=0;for(let i=0;i<a.count;i++)centerX+=bin.readFloatLE((v.byteOffset??0)+(a.byteOffset??0)+i*(v.byteStride??12));const left=centerX/a.count<-.02;for(let i=0;i<a.count;i++){const o=(v.byteOffset??0)+(a.byteOffset??0)+i*(v.byteStride??12),x=bin.readFloatLE(o),y=bin.readFloatLE(o+4),z=bin.readFloatLE(o+8);let angle=Math.atan2(z,x);if(left&&angle<0)angle+=2*Math.PI;uv.writeFloatLE(angle/(2*Math.PI)*26,i*8);uv.writeFloatLE(y/.024,i*8+4);}const view=append(uv,34962),id=g.accessors.length;g.accessors.push({bufferView:view,componentType:5126,count:a.count,type:'VEC2'});p.attributes.TEXCOORD_0=id;primitives++;vertices+=a.count;}
 const padding=(4-length%4)%4;if(padding){blocks.push(Buffer.alloc(padding));length+=padding;}const data=Buffer.concat(blocks);if(!data.subarray(0,bin.length).equals(bin))throw Error('Dados geométricos alterados');g.buffers[0].byteLength=data.length;
 const text=Buffer.from(JSON.stringify(g)),json=Buffer.alloc((text.length+3)&~3,0x20);text.copy(json);const header=Buffer.from(old.subarray(0,20));header.writeUInt32LE(json.length,12);header.writeUInt32LE(20+json.length+8+data.length,8);const bh=Buffer.alloc(8);bh.writeUInt32LE(data.length,0);bh.writeUInt32LE(0x004e4942,4);const out=Buffer.concat([header,json,bh,data]);fs.writeFileSync(destination,out);
 return {source,destination,geometryBinaryUnchanged:true,bonePrimitives:primitives,boneVertices:vertices,normalScale:.24,tileMeters:.024,sha256:crypto.createHash('sha256').update(out).digest('hex')};
}
const reports=[build('ra/assets/pleura-duas-camadas.glb','ra/assets/pleura-osso-texturizado.glb'),build('ra/assets/pleura-simulacao-aprovada.glb','ra/assets/torax-osso-texturizado.glb')];
console.log(JSON.stringify(reports));
