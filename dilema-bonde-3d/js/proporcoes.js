import * as THREE from 'three';

// Personagens +60%. A carroceria cresce em altura e largura; os truques,
// a bitola, o comprimento e o mecanismo do pantógrafo permanecem originais.
export const ESCALA_PERSONAGENS = 2.4;
export const FATOR_PERSONAGENS = ESCALA_PERSONAGENS / 1.5;
export const ALTURA_CHASSI = .8;
export const FATOR_CABINE = 2.2;
export const FATOR_LARGURA_BONDE = 1.12;
export const FATOR_OPERADOR = 1.35;
export const ESCALA_OFICINA = 1.4;
export const PISO_ESTACAO = 1.1;
export const FATOR_ESTACAO = 1.7;
export const ELEVACAO_PANTOGRAFO = (3.584097496 - ALTURA_CHASSI) * (FATOR_CABINE - 1);
const esticar = (y, piso, fator) => y <= piso ? y : piso + (y - piso) * fator;

// Trabalha nas coordenadas do modelo, inclusive quando o GLB usa atributos
// quantizados. Não muda os pivôs, importantes para rodas e ponteiros.
function esticarMalhas(modelo, piso, fator, ignorar, largura = 1) {
  modelo.updateMatrixWorld(true);
  const inversa = modelo.matrixWorld.clone().invert();
  modelo.traverse(o => {
    if (!o.isMesh || ignorar(o)) return;
    const matriz = inversa.clone().multiply(o.matrixWorld), volta = matriz.clone().invert();
    const normalIda = new THREE.Matrix3().getNormalMatrix(matriz);
    const normalVolta = new THREE.Matrix3().getNormalMatrix(volta);
    const g = o.geometry.clone(), p = g.attributes.position, n = g.attributes.normal;
    const pos = new Float32Array(p.count * 3), norm = n ? new Float32Array(n.count * 3) : null;
    const v = new THREE.Vector3(), normal = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(matriz);
      const acima = v.y > piso;
      v.y = esticar(v.y, piso, fator); v.z *= largura; v.applyMatrix4(volta).toArray(pos, i * 3);
      if (n) {
        normal.fromBufferAttribute(n, i).applyMatrix3(normalIda);
        if (acima) normal.y /= fator;
        normal.z /= largura;
        normal.applyMatrix3(normalVolta).normalize().toArray(norm, i * 3);
      }
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    if (norm) g.setAttribute('normal', new THREE.BufferAttribute(norm, 3));
    g.computeBoundingBox(); g.computeBoundingSphere(); o.geometry = g;
    o.userData.proporcoesRA7 = true;
  });
}
function temAncestral(o, teste) {
  for (let p = o; p; p = p.parent) if (teste(p.name)) return true;
  return false;
}
export function ajustarProporcoes(estacao, bonde) {
  if (estacao.userData.proporcoesRA7) return;
  esticarMalhas(estacao, PISO_ESTACAO, FATOR_ESTACAO, o => temAncestral(o, n => n === 'Relogio'));
  const relogio = estacao.getObjectByName('Relogio');
  if (relogio) relogio.position.y = esticar(relogio.position.y, PISO_ESTACAO, FATOR_ESTACAO);
  esticarMalhas(bonde, ALTURA_CHASSI, FATOR_CABINE, o => temAncestral(o, n => /^Truque_|^Pantografo$/.test(n)), FATOR_LARGURA_BONDE);
  const pantografo = bonde.getObjectByName('Pantografo');
  if (pantografo) pantografo.position.y += ELEVACAO_PANTOGRAFO;
  bonde.traverse(o => { if (o.isLight) { o.position.y = esticar(o.position.y, ALTURA_CHASSI, FATOR_CABINE); o.position.z *= FATOR_LARGURA_BONDE; } });
  estacao.userData.proporcoesRA7 = bonde.userData.proporcoesRA7 = true;
}
