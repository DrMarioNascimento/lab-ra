import {NodeIO} from '@gltf-transform/core';import {tangents,prune,unweld,weld} from '@gltf-transform/functions';import {generateTangents} from 'mikktspace';
const io=new NodeIO(),path='./celula-mobile-v2.glb';const doc=await io.read(path);await doc.transform(unweld(),tangents({generateTangents}),weld(),prune());await io.write(path,doc);
