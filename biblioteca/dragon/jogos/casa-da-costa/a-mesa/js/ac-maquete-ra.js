/* Pôr a maquete no ambiente.

   Dois caminhos (Mario, 18/09/2026: "a maquete não está ficando fixa no lugar
   que se escolheu … tem que usar qual parte do código funciona"):

   · `ra`   — realidade aumentada com rastreio de verdade, pelo motor comum
              d'A Casa (ac-ra.js): WebXR no Android, 8th Wall no iPhone. A
              casa pousa numa superfície de verdade e FICA lá: dá para andar
              em volta, chegar perto, olhar por cima do telhado.
   · `mesa` — sem RA (desktop, câmera negada, rastreio que não começou): a
              mesma cena num fundo escuro, com órbita. É só aqui que aparecem
              os botões de apoio.

   O modo antigo "câmera + giroscópio" saiu: ele sabia para onde o telefone
   apontava, mas não onde ele estava — qualquer passo levava a casa junto.

   Regra que vale para os dois: enquanto a maquete não está POSTA, a atividade
   não começa. */
(function (global) {
  'use strict';

  /* A maquete tem 1 de pegada; em RA ela vira ~42 cm. Pinça ajusta. */
  var ESCALA_MIN = 0.22, ESCALA_MAX = 0.90, ESCALA_PADRAO = 0.42;
  /* A unidade da cena em RA é a altura do aparelho sobre a mesa no começo —
     uns 45 cm para quem olha uma maquete apoiada à sua frente. */
  var ALTURA_SOBRE_A_MESA = 0.45;

  function criar(opcoes) {
    var renderer = opcoes.renderer, cena = opcoes.cena, camera = opcoes.camera, raiz = opcoes.raiz;
    var aoMudar = opcoes.aoMudar || function () {};
    var baseY = opcoes.baseY || 0;
    var modo = 'mesa', posta = false, escala = ESCALA_PADRAO, giroY = 0;
    var pose = new THREE.Matrix4();

    var motor = ACRA.criar({
      renderer: renderer, camera: camera, cena: cena, altura: ALTURA_SOBRE_A_MESA, miraEscala: 1,
      desenhar: opcoes.desenhar, aoTocar: opcoes.aoTocar,
      aoMudar: function (e) {
        if (!e.ativo && modo === 'ra') { modo = 'mesa'; posta = false; previa(); }
        aoMudar();
      }
    });

    function modosPossiveis(pronto) {
      motor.suporte().then(function (s) { pronto({ ra: s.webxr || s.slam, webxr: s.webxr, slam: s.slam, mesa: true }); });
    }

    function aplicarPose() {
      raiz.position.setFromMatrixPosition(pose);
      raiz.quaternion.setFromRotationMatrix(pose);
      raiz.scale.setScalar(escala);
      raiz.rotateY(giroY);
      /* A base pousa NA superfície. */
      raiz.position.add(new THREE.Vector3(0, -baseY * escala, 0).applyQuaternion(raiz.quaternion));
      raiz.updateMatrixWorld(true);
    }

    function entrar(qual) {
      if (qual === 'ra') {
        return motor.entrar().then(function (m) {
          modo = 'ra'; posta = false; escala = ESCALA_PADRAO; giroY = 0;
          raiz.visible = false;
          aoMudar();
          return m;
        });
      }
      modo = 'mesa'; posta = false; aoMudar();
      return Promise.resolve('mesa');
    }

    function sair() {
      var era = modo;
      modo = 'mesa'; posta = false;
      raiz.visible = true;
      return (era === 'ra' ? motor.sair() : Promise.resolve()).then(function () { previa(); aoMudar(); });
    }

    function posicionar() {
      if (modo === 'ra') {
        if (!motor.estado().temMira) return false;
        pose.copy(motor.pose());
      } else pose.identity();
      posta = true; raiz.visible = true; motor.mostrarMira(false); aplicarPose(); aoMudar();
      return true;
    }

    function soltar() { posta = false; if (modo === 'ra') raiz.visible = false; else previa(); aoMudar(); }

    /* A casa ANTES de ser posta, no modo sem câmera: pose de vitrine. */
    function previa() {
      pose.identity();
      raiz.position.set(0, 0, 0);
      raiz.quaternion.identity();
      raiz.scale.setScalar(1);
      raiz.position.y = -baseY;
      raiz.visible = true;
      raiz.updateMatrixWorld(true);
    }

    function mudarEscala(fator) {
      escala = Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, escala * fator));
      if (posta) aplicarPose();
      aoMudar();
    }

    function girar(radianos) {
      giroY += radianos;
      if (posta) aplicarPose();
    }

    function atualizar(dt, quadroXR) {
      motor.quadro(quadroXR);
      motor.mostrarMira(modo === 'ra' && !posta);
    }

    function estado() {
      var e = motor.estado();
      return { modo: modo, ra: e.modo, posta: posta, temHit: e.temMira, rastreando: e.rastreando, escala: escala, iOS: e.iOS };
    }

    return {
      modosPossiveis: modosPossiveis, entrar: entrar, sair: sair, posicionar: posicionar, previa: previa,
      soltar: soltar, mudarEscala: mudarEscala, girar: girar, atualizar: atualizar,
      estado: estado, aplicarPose: aplicarPose, mira: motor.mira, cameraAtiva: motor.cameraAtiva, paraTela: motor.paraTela,
      ativo: motor.ativo
    };
  }

  global.ACMaquetteRA = { criar: criar, ESCALA_PADRAO: ESCALA_PADRAO };
})(typeof window !== 'undefined' ? window : globalThis);
