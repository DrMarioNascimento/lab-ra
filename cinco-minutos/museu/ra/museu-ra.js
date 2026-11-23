/* O museu inteiro em RA (Loop). Um só objeto: a maquete com as 31 peças dentro das cabines.
   Na mesa ele aparece em miniatura; com o gesto de pinça ele cresce até o tamanho de andar dentro dele. */
(function () {
  'use strict';
  var b = OIBase.criar({
    vista: { alvo: [-0.08, 0.22, 0.02], dist: 1.4, distRetrato: 2.2, dir: [0.5, 0.45, 0.9] },
    raioDoChao: 0.9, alturaDoAparelho: 0.5, miraEscala: 1.2, exposicao: 0.55,
    escalaRA: 0.5, pincaMin: 0.3, pincaMax: 80, draco: 'ra/draco/',
    textoMira: 'Aponte para o chão ou uma mesa e toque em Pôr aqui. Use a pinça para crescer o museu.',
    textoInicio: 'O museu inteiro, com as 30 salas.'
  });
  var modelo = null, topo = 4, fachada = true;
  var rotulos = ['todos os andares', 'até o 3º', 'até o 2º', 'até o 1º', 'só o térreo'];
  function aplica() {
    if (!modelo) return;
    modelo.traverse(function (o) {
      var n = o.name || '', m = /^andar_(\d)$/.exec(n), f = /^fachada_/.test(n);
      if (m) o.visible = +m[1] <= topo;
      if (f) o.visible = fachada;
    });
  }
  b.carregar(['torre/torre.glb?v=20261123d']).then(function (r) {
    modelo = r[0].scene; b.raiz.add(modelo); b.estado('Pronto.');
    document.getElementById('btRA').disabled = false; b.pronto && b.pronto();
  }).catch(function (e) { b.estado('Não consegui abrir o museu (' + (e && e.message || e) + ').'); });
  document.getElementById('btAnd').onclick = function () {
    topo = topo > 0 ? topo - 1 : 4; document.getElementById('btAnd').textContent = 'Andares: ' + rotulos[4 - topo]; aplica();
  };
  document.getElementById('btFach').onclick = function () {
    fachada = !fachada; document.getElementById('btFach').textContent = 'Fachada: ' + (fachada ? 'ligada' : 'desligada'); aplica();
  };
  b.comecar();
})();
