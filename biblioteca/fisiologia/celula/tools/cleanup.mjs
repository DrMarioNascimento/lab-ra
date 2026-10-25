import {NodeIO} from '@gltf-transform/core';import {prune,dedup} from '@gltf-transform/functions';
const io=new NodeIO(),path='./celula-mobile-v2.glb';const doc=await io.read(path);await doc.transform(dedup(),prune());await io.write(path,doc);
console.log('mobile materials',doc.getRoot().listMaterials().length,'textures',doc.getRoot().listTextures().length);
