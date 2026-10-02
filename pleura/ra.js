/* Copia a árvore visual sem serializar referências do motor em userData.
   Geometria/material continuam compartilhados até prepararParaRA cloná-los. */
export function clonarVisual(objeto) {
  const fonte=Object.create(objeto);
  fonte.userData={};
  const clone=new objeto.constructor().copy(fonte,false);
  for(const filho of objeto.children)clone.add(clonarVisual(filho));
  return clone;
}
