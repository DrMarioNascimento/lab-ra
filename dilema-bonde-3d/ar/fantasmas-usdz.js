import * as THREE from 'three';

// O Quick Look pode descartar entidades que já entram quase sem escala.
// No repouso, a malha fica inteira DENTRO da base opaca, sem ampliar seus
// limites. Durante o impacto, usamos exatamente as poses da animação web.
export function poseFantasmaNativo(matriz){
  const p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
  matriz.decompose(p,q,s);
  if(s.x<.01){p.y=-2.4;s.setScalar(.65);}
  return new THREE.Matrix4().compose(p,q,s);
}
