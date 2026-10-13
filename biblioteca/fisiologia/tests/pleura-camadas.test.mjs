import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
function abrir(bytes){assert.equal(bytes.toString('ascii',0,4),'glTF');assert.equal(bytes.readUInt32LE(8),bytes.length);const l=bytes.readUInt32LE(12);return {json:JSON.parse(bytes.toString('utf8',20,20+l)),bin:bytes.subarray(28+l)};}
test('as camadas pleurais preservam os dados geométricos do modelo aprovado',async()=>{
 const original=abrir(await readFile(new URL('../assets/pleura-simulacao-aprovada.glb',import.meta.url)));
 const layers=abrir(await readFile(new URL('../assets/pleura-duas-camadas.glb',import.meta.url)));
 assert.deepEqual(layers.bin.subarray(0,original.bin.length),original.bin);
 assert.deepEqual(layers.json.accessors.slice(0,original.json.accessors.length),original.json.accessors);
 assert.deepEqual(layers.json.bufferViews.slice(0,original.json.bufferViews.length),original.json.bufferViews);
 const visceral=layers.json.nodes.filter(n=>n.name?.startsWith('pleura_visceral_'));
 const parietal=layers.json.nodes.filter(n=>n.name?.startsWith('pleura_parietal_'));
 assert.equal(visceral.length,5);assert.equal(parietal.length,2);
 for(const node of [...visceral,...parietal])for(const p of layers.json.meshes[node.mesh].primitives){const m=layers.json.materials[p.material];assert.equal(m.alphaMode,'BLEND');assert.equal(m.doubleSided,true);assert.ok(m.pbrMetallicRoughness.baseColorFactor[3]>0&&m.pbrMetallicRoughness.baseColorFactor[3]<1);}
});
