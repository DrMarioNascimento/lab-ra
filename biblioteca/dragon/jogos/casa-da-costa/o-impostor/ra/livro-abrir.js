/* O Impostor — o livro do farol, com a mão.

   O livro chega FECHADO (a capa com a rosa dos ventos é a primeira coisa que
   se vê) e abre pela capa: a pega fica na borda livre da capa; o dedo levanta
   a capa em volta da lombada. Levantada além de uns 70 graus e solta, ela termina de
   abrir sozinha; antes disso, volta a fechar. O mesmo gesto fecha. */
(function () {
  'use strict';
  var FECHADO = -Math.PI, ABERTO = 0;

  var b = OIBase.criar({
    vista: { alvo: [0.03, 0.02, 0.0], dist: 0.8, distRetrato: 1.3, dir: [0.0, 1.0, 0.7] },
    raioDoChao: 0.5, alturaDoAparelho: 0.45, miraEscala: 1.2, exposicao: 1.1,
    textoMira: 'Aponte para uma mesa e toque em Pôr aqui.',
    textoInicio: 'O livro do farol.',
    deNovo: deNovo
  });

  var livro, charneira, metade, angulo = FECHADO, animando = null;

  b.carregar(['modelos/livro_do_farol_v2.glb']).then(function (r) {
    livro = r[0].scene; b.raiz.add(livro);
    charneira = livro.getObjectByName('charneira');
    metade = livro.getObjectByName('metade_esquerda');
    por(FECHADO);
    b.aCadaQuadro(function (dt) { if (animando) animando(dt); });
    b.pega({
      rotulo: 'Borda da capa',
      alvo: function () { return metade; },
      ancora: function () { return metade.localToWorld(new THREE.Vector3(-0.2, 0.0, 0.1)); },
      ativa: function () { return !animando; },
      mover: function (x, y) { var a = anguloNoDedo(x, y); if (a !== null) por(a); },
      fim: function () { soltar(); }
    });
    b.comecar();
  }).catch(function (e) { b.estado('O modelo não carregou: ' + (e && e.message || e)); });

  function por(a) { angulo = a; charneira.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), a); }

  /* o dedo num plano perpendicular à lombada, pela lombada */
  function anguloNoDedo(x, y) {
    var pai = charneira.parent;
    var eixo = new THREE.Vector3(0, 0, 1).transformDirection(pai.matrixWorld);
    var dobra = pai.localToWorld(charneira.position.clone());
    var p = b.dedoNoPlano(x, y, new THREE.Plane().setFromNormalAndCoplanarPoint(eixo, dobra));
    if (!p) return null;
    var v = pai.worldToLocal(p).sub(charneira.position);
    var a = Math.atan2(-v.y, -v.x);          /* capa aberta aponta para −x; fechada, para +x */
    if (a > 0) a = a > Math.PI / 2 ? FECHADO : ABERTO;
    return Math.max(FECHADO, Math.min(ABERTO, a));
  }

  function soltar() {
    var alvo = angulo > -0.62 * Math.PI ? ABERTO : FECHADO, de = angulo, t = 0, dur = 0.25 + 0.35 * Math.abs(alvo - de) / Math.PI;
    animando = function (dt) {
      t += dt;
      por(de + (alvo - de) * b.suave(t / dur));
      if (t >= dur) {
        animando = null; por(alvo);
        if (alvo === ABERTO) { b.vibrar(12); b.estado(''); b.mostrarDeNovo(true); }
        else b.estado('O livro do farol.');
      }
    };
  }

  function deNovo() { animando = null; por(FECHADO); b.mostrarDeNovo(false); b.estado('O livro do farol.'); }

  window.OILivro = { bordaNaTela: function () { return b.naTela(metade.localToWorld(new THREE.Vector3(-0.2, 0.0, 0.1))); }, angulo: function () { return angulo; } };
})();
