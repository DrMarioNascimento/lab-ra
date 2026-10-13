import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';

const read = path => fs.readFileSync(new URL('../'+path,import.meta.url));
test('vista no tórax preserva integralmente o arquivo fornecido e sua atribuição',()=>{
 const bytes=read('assets/torax-vasos-encaixe.glb');
 assert.equal(createHash('sha256').update(bytes).digest('hex'),'7317d2261a01a662cf445e0fb32075cbf445b3e247e028d4162f0f1e63b96dc5');
 const gltf=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)));
 assert.equal(gltf.meshes.length,99);
 assert.equal(gltf.animations?.length||0,0);
 const root=gltf.nodes[gltf.scenes[0].nodes[0]];
 assert.equal(root.extras.units,'meters');
 assert.match(root.extras.attribution,/CC Attribution 4\.0/);
 for(const name of ['coracao_miocardio','coracao_aorta','coracao_cava_superior','cava_inferior','arteria_coronaria_descendente_anterior_LAD'])assert(gltf.nodes.some(n=>n.name===name),name);
});
