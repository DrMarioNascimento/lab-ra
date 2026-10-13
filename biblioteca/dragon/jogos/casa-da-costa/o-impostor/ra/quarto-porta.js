/* O Impostor — o quarto de serviço, com a mão (miniatura sobre a mesa).

   A porta do corredor em dois tempos, como uma porta de verdade:
   · a ALAVANCA — a pega fica na ponta da maçaneta; o dedo a baixa em volta
     do eixo. Passando de LINGUETA e soltando, a lingueta solta e a porta
     desencosta um palmo; a alavanca volta sozinha para cima.
   · a FOLHA — com a porta desencostada, a pega passa para a borda da folha;
     o dedo empurra a porta em volta das dobradiças. Ela fica onde soltar.

   As variantes sorteadas (gato, flores, remédio, cama feita) não são gesto do
   jogador: são estado do mundo, que o motor liga pelo nome do nó. */
(function () {
  'use strict';
  var DESCE = -38 * Math.PI / 180, LINGUETA = -34 * Math.PI / 180;
  var ENCOSTADA = 0, DESENCOSTA = -14 * Math.PI / 180, TODA = -92 * Math.PI / 180;

  var b = OIBase.criar({
    vista: { alvo: [0.4, 0.9, 0.6], dist: 4.2, distRetrato: 6.0, dir: [-0.3, 0.55, -1] },
    giroRA: Math.PI,   /* quem olha fica do lado da janela-fundo, de frente para a porta */
    raioDoChao: 2.4, alturaDoAparelho: 0.45, escalaRA: 0.2, miraEscala: 1.4,
    textoMira: 'Aponte para uma mesa e toque em Pôr aqui. O quarto vira uma maquete.',
    textoInicio: 'O quarto de serviço.',
    deNovo: deNovo
  });

  var quarto, porta, macaneta, destrancada = false, anguloPorta = ENCOSTADA, anguloAlavanca = 0, animando = null;

  b.carregar(['modelos/quarto_de_servico_v2.glb']).then(function (r) {
    quarto = r[0].scene; b.raiz.add(quarto);
    porta = quarto.getObjectByName('porta_corredor');
    macaneta = quarto.getObjectByName('macaneta_latao');
    b.aCadaQuadro(function (dt) { if (animando) animando(dt); });

    /* a alavanca, pelo lado de dentro do quarto (alavanca 1) */
    b.pega({
      rotulo: 'Maçaneta',
      alvo: function () { return macaneta; },
      ancora: function () { return macaneta.localToWorld(new THREE.Vector3(0.1, -0.004, -0.07)); },
      ativa: function () { return !destrancada && !animando; },
      mover: function (x, y) {
        var pai = macaneta.parent;
        var n = new THREE.Vector3(0, 0, 1).transformDirection(pai.matrixWorld);
        var eixo = pai.localToWorld(macaneta.position.clone());
        var p = b.dedoNoPlano(x, y, new THREE.Plane().setFromNormalAndCoplanarPoint(n, eixo));
        if (!p) return;
        var v = pai.worldToLocal(p).sub(macaneta.position);
        porAlavanca(Math.max(DESCE, Math.min(0, Math.atan2(v.y, v.x))));
      },
      fim: function () {
        if (anguloAlavanca <= LINGUETA) {
          destrancada = true; b.vibrar([15, 30, 15]);
          animar(0.45, function (k) { porAlavanca(DESCE * (1 - k)); porPorta(DESENCOSTA * k); }, function () {
            b.mostrarDeNovo(true);
          });
        } else {
          animar(0.2, function (k) { porAlavanca(anguloAlavanca * (1 - k)); });
          
        }
      }
    });

    /* a folha, pela borda livre, depois de destrancada */
    b.pega({
      rotulo: 'Borda da porta',
      alvo: function () { return porta; },
      ancora: function () { return porta.localToWorld(new THREE.Vector3(-0.74, 1.55, -0.05)); },
      ativa: function () { return destrancada && !animando; },
      mover: function (x, y) {
        var pai = porta.parent;
        var cima = new THREE.Vector3(0, 1, 0).transformDirection(pai.matrixWorld);
        var borda = porta.localToWorld(new THREE.Vector3(-0.74, 1.55, -0.05));
        var p = b.dedoNoPlano(x, y, new THREE.Plane().setFromNormalAndCoplanarPoint(cima, borda));
        if (!p) return;
        var v = pai.worldToLocal(p).sub(porta.position);
        var a = Math.atan2(v.z, -v.x);
        if (a > Math.PI / 2) a = TODA;
        porPorta(Math.max(TODA, Math.min(ENCOSTADA, a)));
      },
      fim: function () {
        
      }
    });
    b.comecar();
  }).catch(function (e) { b.estado('O modelo não carregou: ' + (e && e.message || e)); });

  function porAlavanca(a) { anguloAlavanca = a; macaneta.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), a); }
  function porPorta(a) { anguloPorta = a; porta.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), a); }
  function animar(dur, passo, fim) {
    var t = 0;
    animando = function (dt) {
      t += dt; passo(b.suave(t / dur));
      if (t >= dur) { animando = null; passo(1); fim && fim(); }
    };
  }

  function deNovo() {
    animando = null; destrancada = false; porAlavanca(0); porPorta(ENCOSTADA);
    b.mostrarDeNovo(false); b.estado('O quarto de serviço.');
  }

  window.OIQuarto = {
    alavancaNaTela: function () { return b.naTela(macaneta.localToWorld(new THREE.Vector3(0.1, -0.004, -0.07))); },
    bordaNaTela: function () { return b.naTela(porta.localToWorld(new THREE.Vector3(-0.74, 1.55, -0.05))); },
    estado: function () { return { destrancada: destrancada, porta: anguloPorta, alavanca: anguloAlavanca }; }
  };
})();
