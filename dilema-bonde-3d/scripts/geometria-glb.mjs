// Carregamento sem GPU para medições e construção do pacote nativo.
import * as THREE from 'three';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
function converter(node) {
  const grupo = new THREE.Group(); grupo.name = node.getName();
  grupo.position.fromArray(node.getTranslation()); grupo.quaternion.fromArray(node.getRotation()); grupo.scale.fromArray(node.getScale());
  for (const prim of node.getMesh()?.listPrimitives() || []) {
    const geo = new THREE.BufferGeometry();
    for (const [chave,nome] of [['POSITION','position'],['NORMAL','normal'],['TEXCOORD_0','uv'],['COLOR_0','color']]) {
      const a = prim.getAttribute(chave); if (!a) continue;
      geo.setAttribute(nome,new THREE.Float32BufferAttribute(Array.from({length:a.getCount()},(_,i)=>a.getElement(i,[])).flat(),a.getElementSize()));
    }
    if (prim.getIndices()) geo.setIndex(Array.from(prim.getIndices().getArray()));
    grupo.add(new THREE.Mesh(geo,new THREE.MeshStandardMaterial()));
  }
  node.listChildren().forEach(n=>grupo.add(converter(n))); return grupo;
}
export async function lerGeometriaGLB(path) {
  const d = await io.read(path), scene = new THREE.Group();
  (d.getRoot().getDefaultScene() || d.getRoot().listScenes()[0]).listChildren().forEach(n=>scene.add(converter(n)));
  return scene;
}
