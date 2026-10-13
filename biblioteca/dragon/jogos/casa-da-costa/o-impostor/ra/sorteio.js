// O Impostor — sorteio reproduzível por partida e por jogador.
// Uso na RA: a posição de um objeto (ex.: a chave da maquete) varia a cada partida
// e é diferente para cada jogador, mas é sempre a mesma se o jogador sair e voltar.
//
//   const r = OISorteio.gerador(codigoPartida, idJogador, 'chave-maquete');
//   r.proximo()              -> número em [0, 1)
//   r.inteiro(0, 5)          -> inteiro entre 0 e 5
//   r.escolher(lista)        -> um item da lista
//   r.embaralhar(lista)      -> cópia embaralhada
//
//   // Coloca o objeto numa das âncoras do modelo (nós vazios cujo nome começa
//   // com o prefixo, ex.: "ancora_chave_tapete", "ancora_chave_vaso"...).
//   OISorteio.posicionarEmAncora(objChave, raizDaMaquete, 'ancora_chave_', r);
(function (global) {
  'use strict';

  // hash de texto -> semente de 32 bits (cyrb53 reduzido)
  function hash(texto) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < texto.length; i++) {
      const c = texto.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761);
      h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    return h1 >>> 0;
  }

  // gerador mulberry32
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function gerador(...partes) {
    const rnd = mulberry32(hash(partes.map(String).join('|')));
    return {
      proximo: rnd,
      inteiro(min, max) { return min + Math.floor(rnd() * (max - min + 1)); },
      escolher(lista) { return lista[Math.floor(rnd() * lista.length)]; },
      embaralhar(lista) {
        const a = lista.slice();
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(rnd() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      },
    };
  }

  // Procura no modelo os nós-âncora pelo prefixo, sorteia um e move o objeto
  // para a posição/rotação dele. Devolve o nome da âncora escolhida.
  function posicionarEmAncora(objeto, raiz, prefixo, r) {
    const ancoras = [];
    raiz.traverse(n => { if (n.name && n.name.startsWith(prefixo)) ancoras.push(n); });
    if (!ancoras.length) return null;
    ancoras.sort((a, b) => a.name.localeCompare(b.name)); // ordem estável
    const alvo = r.escolher(ancoras);
    raiz.updateMatrixWorld(true);
    const THREE = global.THREE;
    const pos = new THREE.Vector3(), quat = new THREE.Quaternion(), esc = new THREE.Vector3();
    alvo.matrixWorld.decompose(pos, quat, esc);
    if (objeto.parent) {
      objeto.parent.updateMatrixWorld(true);
      const inv = new THREE.Matrix4().copy(objeto.parent.matrixWorld).invert();
      const m = new THREE.Matrix4().compose(pos, quat, new THREE.Vector3(1, 1, 1)).premultiply(inv);
      m.decompose(objeto.position, objeto.quaternion, new THREE.Vector3());
    } else {
      objeto.position.copy(pos); objeto.quaternion.copy(quat);
    }
    objeto.userData.ancora = alvo.name;
    return alvo.name;
  }

  global.OISorteio = { gerador, posicionarEmAncora, hash };
})(typeof window !== 'undefined' ? window : globalThis);
