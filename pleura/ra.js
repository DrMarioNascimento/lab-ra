/* Copia a árvore visual sem serializar referências do motor em userData.
   Geometria/material continuam compartilhados até prepararParaRA cloná-los. */
import * as THREE from 'three';

export function clonarVisual(objeto) {
  const fonte=Object.create(objeto);
  fonte.userData={};
  // Cada lobo leva seu próprio material para a preparação de cores da RA.
  // A cena original conserva uma malha agrupada para economizar desenho.
  const multipla=objeto.isMesh&&Array.isArray(objeto.material);
  const clone=multipla?new THREE.Group().copy(fonte,false):new objeto.constructor().copy(fonte,false);
  if(multipla)for(const group of objeto.geometry.groups) {
    const geo=objeto.geometry.clone();geo.clearGroups();
    geo.setIndex(Array.from(objeto.geometry.index.array.slice(group.start,group.start+group.count)));
    const recorte=geo.toNonIndexed();geo.dispose();
    const mat=objeto.material[group.materialIndex],lobo=new THREE.Mesh(recorte,mat);
    lobo.name=mat.name;lobo.castShadow=objeto.castShadow;lobo.receiveShadow=objeto.receiveShadow;clone.add(lobo);
  }
  for(const filho of objeto.children)clone.add(clonarVisual(filho));
  return clone;
}
