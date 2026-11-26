/* O museu inteiro em RA (Loop). Um só objeto: a maquete com as 31 peças dentro das cabines.
   Na mesa ele aparece em miniatura; com o gesto de pinça ele cresce até o tamanho de andar dentro dele. */
(function () {
  'use strict';
  var b = OIBase.criar({
    vista: { alvo: [0, 0.14, -0.07], dist: 1.5, distRetrato: 2.4, dir: [0.2, 0.9, 0.8] },
    raioDoChao: 0.9, alturaDoAparelho: 0.5, miraEscala: 1.2, exposicao: 0.55,
    escalaRA: 0.5, pincaMin: 0.3, pincaMax: 80, draco: 'ra/draco/',
    textoMira: 'Aponte para o chão ou uma mesa e toque em Pôr aqui. Use a pinça para crescer o museu.',
    textoInicio: 'O museu inteiro, com as peças nas cabines.'
  });
  var modelo = null, nivel = 0, rotulos = ['todos', 'até o 1º', 'só o térreo'];
  b.carregar(['museu-andares.glb']).then(function (r) {
    modelo = r[0].scene; b.raiz.add(modelo); b.estado('Pronto.');
    document.getElementById('btRA').disabled = false; b.pronto && b.pronto();
  }).catch(function (e) { b.estado('Não consegui abrir o museu (' + (e && e.message || e) + ').'); });
  document.getElementById('btAnd').onclick = function () {
    nivel = (nivel + 1) % 3; document.getElementById('btAnd').textContent = 'Andares: ' + rotulos[nivel];
    if (!modelo) return;
    modelo.traverse(function (o) {
      if (!o.isMesh || !o.material) return; var n = o.material.name || '';
      var up2 = /^A2_/.test(n), up1 = /^A1_/.test(n);
      o.visible = !((nivel >= 1 && up2) || (nivel >= 2 && up1));
    });
  };
  b.comecar();
})();
