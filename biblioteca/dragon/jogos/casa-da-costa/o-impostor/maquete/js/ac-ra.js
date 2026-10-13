/* A realidade aumentada d'A Casa — um motor só para a escrivaninha e a maquete.

   O pedido (Mario, 18/09/2026): "RA tem que sair perfeita". A escrivaninha
   ficava presa no lugar porque abria no Quick Look do iPhone — que é o ARKit
   da Apple, mas não roda uma linha do jogo: só posiciona o móvel e acaba. A
   maquete no iPhone usava a câmera com o giroscópio: o aparelho sabia para
   onde apontava, não ONDE estava — um passo e a casa andava junto.

   Dois caminhos com rastreio de verdade (seis graus: onde o aparelho está e
   para onde olha), e o jogo inteiro roda dentro da RA nos dois:

   · `webxr` — Android/Chrome: sessão `immersive-ar` do navegador (ARCore),
               com teste de superfície;
   · `slam`  — iPhone/Safari (que não expõe o ARKit a páginas): o motor de RA
               da 8th Wall, que faz o rastreio no próprio navegador a partir
               da câmera e dos sensores. Binário gratuito da Niantic Spatial,
               carregado do CDN só quando a RA é pedida (licença e atribuição
               em v1/assets/ac/README.md e no "Como jogar").

   Sem nenhum dos dois (desktop, câmera negada, rastreio que não começa), a
   página segue no 3D de sempre — e é SÓ ali que aparecem os botões de apoio.

   Como funciona o `slam` aqui: a 8th Wall desenha a imagem da câmera num
   canvas próprio, POR BAIXO do canvas da cena, e a cada quadro entrega a pose
   do aparelho e a lente. A câmera da cena recebe as duas e a cena é desenhada
   no MESMO quadro da imagem (dentro do onRender da 8th Wall) — desenhar num
   laço separado deixava a casa um quadro atrás da imagem, e isso se vê como
   um tremor.

   A escala: no modo "responsivo" da 8th Wall a unidade da cena é a altura
   inicial do aparelho sobre a superfície. `altura` diz quanto isso vale em
   metros para cada atividade (a escrivaninha vai ao chão; a maquete, à mesa). */
(function (global) {
  'use strict';

  var XR8_SRC = 'https://cdn.jsdelivr.net/npm/@8thwall/engine-binary@1/dist/xr.js';
  var carregando = null;

  function ehIOS() {
    var ua = navigator.userAgent || '';
    return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && (navigator.maxTouchPoints || 0) > 1);
  }
  function ehCelular() {
    return ehIOS() || /Android|Mobile/i.test(navigator.userAgent || '');
  }

  /* Baixa o motor da 8th Wall uma vez. `data-preload-chunks="slam"` faz ele
     trazer o rastreio junto, em vez de esperar a primeira sessão. */
  function carregarXR8() {
    if (global.XR8) return Promise.resolve(global.XR8);
    if (carregando) return carregando;
    carregando = new Promise(function (ok, falha) {
      var s = document.createElement('script');
      s.src = global.AC_XR8_SRC || XR8_SRC;
      s.async = true; s.crossOrigin = 'anonymous';
      s.setAttribute('data-preload-chunks', 'slam');
      var pronto = function () { if (global.XR8) ok(global.XR8); };
      global.addEventListener('xrloaded', pronto, { once: true });
      s.onerror = function () { carregando = null; falha(Error('O motor de RA não pôde ser baixado.')); };
      s.onload = function () { setTimeout(pronto, 0); };
      document.head.appendChild(s);
      setTimeout(function () { if (!global.XR8) { carregando = null; falha(Error('O motor de RA demorou demais para abrir.')); } }, 45000);
    });
    return carregando;
  }

  /* No iPhone, a permissão dos sensores só vale pedida DENTRO do toque. Tem de
     ser a primeira coisa do clique — antes de qualquer await. */
  function pedirSensores() {
    var pedidos = [];
    try {
      if (global.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') pedidos.push(DeviceMotionEvent.requestPermission());
      if (global.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') pedidos.push(DeviceOrientationEvent.requestPermission());
    } catch (e) { return Promise.resolve(false); }
    if (!pedidos.length) return Promise.resolve(true);
    return Promise.all(pedidos).then(function (r) { return r.every(function (x) { return x === 'granted'; }); }, function () { return false; });
  }

  function criar(opcoes) {
    var renderer = opcoes.renderer, camera = opcoes.camera, cena = opcoes.cena;
    var altura = opcoes.altura || 1.4;
    var aoMudar = opcoes.aoMudar || function () {};
    var aoTocar = opcoes.aoTocar || null;
    var modo = 'nenhum', sessao = null, fonteDeHit = null, temMira = false, rastreando = false, motivo = '';
    var canvasCamera = null, laco = null, geracao = 0, espacoDeReferencia = null, aoRedimensionar = null;

    var mira = new THREE.Mesh(
      new THREE.RingGeometry(0.075, 0.095, 40).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xf2d194, transparent: true, opacity: 0.92, depthTest: false })
    );
    mira.matrixAutoUpdate = false; mira.visible = false; mira.renderOrder = 20;
    mira.userData.exportExclude = true; mira.raycast = function () {};
    cena.add(mira);
    var miraEscala = opcoes.miraEscala || 1;
    var pose = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpV = new THREE.Vector3(), escalaV = new THREE.Vector3(miraEscala, miraEscala, miraEscala);

    function avisar() { try { aoMudar(estado()); } catch (e) { console.error(e); } }

    function suporte() {
      var saida = { webxr: false, slam: false, camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) };
      saida.slam = saida.camera && ehCelular() && !global.AC_SEM_SLAM;
      if (!(navigator.xr && navigator.xr.isSessionSupported)) return Promise.resolve(saida);
      return navigator.xr.isSessionSupported('immersive-ar').then(function (ok) {
        saida.webxr = !!ok; return saida;
      }, function () { return saida; });
    }

    /* A mira: onde a casa (ou o móvel) vai pousar. A orientação vem só da
       guinada do aparelho — o objeto fica de pé e de frente para quem olha. */
    function mirarEm(posicao) {
      var olhar = new THREE.Vector3();
      cameraAtiva().getWorldDirection(olhar);
      var guinada = Math.atan2(-olhar.x, -olhar.z);
      tmpQ.setFromAxisAngle(new THREE.Vector3(0, 1, 0), guinada);
      pose.compose(posicao, tmpQ, new THREE.Vector3(1, 1, 1));
      mira.matrix.compose(posicao, tmpQ, escalaV);
    }

    /* ---------------- WebXR (Android) ---------------- */
    function entrarWebXR() {
      var minha = ++geracao;
      return navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay', 'local-floor'],
        domOverlay: { root: document.body }
      }).then(function (s) {
        if (minha !== geracao) { s.end(); throw Error('cancelado'); }
        sessao = s; modo = 'webxr'; temMira = false; rastreando = true;
        document.body.classList.add('in-ar', 'ra-webxr');
        cena.background = null; renderer.setClearAlpha(0);
        s.addEventListener('select', function (ev) {
          if (!aoTocar || !espacoDeReferencia) return;
          var p = ev.frame && ev.frame.getPose(ev.inputSource.targetRaySpace, espacoDeReferencia);
          if (!p) return;
          /* O toque vira um ponto da tela, para a página usar o mesmo alvo
             generoso (anéis em volta do dedo) que usa no 3D. */
          var o = p.transform.position, q = p.transform.orientation;
          var dir = new THREE.Vector3(0, 0, -1).applyQuaternion(new THREE.Quaternion(q.x, q.y, q.z, q.w));
          var ponto = new THREE.Vector3(o.x, o.y, o.z).addScaledVector(dir, 1);
          var tela = paraTela(ponto);
          if (tela) aoTocar(tela.x, tela.y, 'select');
        });
        s.addEventListener('end', function () {
          if (fonteDeHit) { fonteDeHit.cancel(); fonteDeHit = null; }
          sessao = null; espacoDeReferencia = null;
          terminar();
        });
        renderer.xr.setReferenceSpaceType('local');
        return renderer.xr.setSession(s).then(function () {
          espacoDeReferencia = renderer.xr.getReferenceSpace();
          return s.requestReferenceSpace('viewer');
        });
      }).then(function (viewer) {
        return sessao.requestHitTestSource({ space: viewer });
      }).then(function (fonte) {
        fonteDeHit = fonte; avisar(); return 'webxr';
      });
    }

    /* ---------------- 8th Wall (iPhone) ---------------- */
    function medirCanvas() {
      if (!canvasCamera) return;
      var r = renderer.domElement.getBoundingClientRect(), dpr = Math.min(global.devicePixelRatio || 1, 2);
      canvasCamera.style.left = r.left + 'px'; canvasCamera.style.top = r.top + 'px';
      canvasCamera.style.width = r.width + 'px'; canvasCamera.style.height = r.height + 'px';
      var w = Math.max(2, Math.round(r.width * dpr)), h = Math.max(2, Math.round(r.height * dpr));
      if (canvasCamera.width !== w || canvasCamera.height !== h) { canvasCamera.width = w; canvasCamera.height = h; }
    }

    function entrarSlam(permitido) {
      var minha = ++geracao;
      return carregarXR8().then(function (XR8) {
        if (minha !== geracao) throw Error('cancelado');
        canvasCamera = document.createElement('canvas');
        canvasCamera.id = 'ac-ra-camera';
        canvasCamera.setAttribute('aria-hidden', 'true');
        canvasCamera.style.cssText = 'position:fixed;z-index:0;pointer-events:none;display:block';
        var tela = renderer.domElement;
        tela.parentNode.insertBefore(canvasCamera, tela);
        tela.style.position = 'relative'; tela.style.zIndex = '1';
        medirCanvas();
        aoRedimensionar = function () { medirCanvas(); };
        global.addEventListener('resize', aoRedimensionar);

        return new Promise(function (ok, falha) {
          var comecou = false;
          var modulo = {
            name: 'ac-casa',
            onStart: function () {
              XR8.XrController.updateCameraProjectionMatrix({ origin: { x: 0, y: altura, z: 0 }, facing: { w: 1, x: 0, y: 0, z: 0 } });
              comecou = true; modo = 'slam'; rastreando = false; temMira = false;
              document.body.classList.add('in-ar', 'ra-slam');
              cena.background = null; renderer.setClearAlpha(0);
              camera.clearViewOffset();
              /* O laço da página para: quem desenha agora é a 8th Wall. */
              laco = renderer.getAnimationLoop ? renderer.getAnimationLoop() : null;
              renderer.setAnimationLoop(null);
              avisar(); ok('slam');
            },
            onUpdate: function (dados) {
              var r = dados && dados.processCpuResult && dados.processCpuResult.reality;
              if (!r || !r.intrinsics) return;
              for (var i = 0; i < 16; i++) camera.projectionMatrix.elements[i] = r.intrinsics[i];
              camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
              if (r.rotation) camera.quaternion.set(r.rotation.x, r.rotation.y, r.rotation.z, r.rotation.w);
              if (r.position) camera.position.set(r.position.x, r.position.y, r.position.z);
              camera.updateMatrixWorld(true);
              var antes = rastreando;
              rastreando = r.trackingStatus !== 'LIMITED' && r.trackingStatus !== 'NOT_AVAILABLE';
              motivo = r.trackingReason || '';
              atualizarMiraSlam(XR8);
              if (antes !== rastreando) avisar();
            },
            onRender: function () {
              if (opcoes.desenhar) opcoes.desenhar(global.performance.now(), null);
            },
            onCanvasSizeChange: function () { medirCanvas(); },
            onException: function (erro) {
              console.error('[RA]', erro);
              if (!comecou) falha(erro instanceof Error ? erro : Error(String(erro && erro.message || erro)));
              else { motivo = 'erro'; sair(); }
            }
          };
          XR8.XrController.configure({ disableWorldTracking: false, scale: 'responsive' });
          XR8.addCameraPipelineModules([XR8.GlTextureRenderer.pipelineModule(), XR8.XrController.pipelineModule(), modulo]);
          try { XR8.run({ canvas: canvasCamera }); }
          catch (e) { falha(e); }
          setTimeout(function () { if (!comecou) falha(Error('A câmera não abriu.')); }, 20000);
        });
      }).catch(function (erro) {
        desmontarSlam();
        throw erro;
      });
    }

    function atualizarMiraSlam(XR8) {
      var hits = [];
      try { hits = XR8.XrController.hitTest(0.5, 0.5, ['DETECTED_SURFACE', 'ESTIMATED_SURFACE', 'FEATURE_POINT']) || []; } catch (e) { hits = []; }
      var melhor = null, ordem = { DETECTED_SURFACE: 0, ESTIMATED_SURFACE: 1, FEATURE_POINT: 2 };
      for (var i = 0; i < hits.length; i++) if (!melhor || (ordem[hits[i].type] || 3) < (ordem[melhor.type] || 3)) melhor = hits[i];
      temMira = !!melhor;
      if (melhor) { tmpV.set(melhor.position.x, melhor.position.y, melhor.position.z); mirarEm(tmpV); }
    }

    function desmontarSlam() {
      if (global.XR8) {
        try { global.XR8.stop(); } catch (e) {}
        try { global.XR8.clearCameraPipelineModules(); } catch (e) {}
      }
      if (aoRedimensionar) { global.removeEventListener('resize', aoRedimensionar); aoRedimensionar = null; }
      if (canvasCamera && canvasCamera.parentNode) canvasCamera.parentNode.removeChild(canvasCamera);
      canvasCamera = null;
      renderer.domElement.style.position = ''; renderer.domElement.style.zIndex = '';
    }

    /* ---------------- entrada e saída ---------------- */

    /* Chamado DENTRO do toque do jogador. */
    function entrar() {
      var sensores = pedirSensores();
      return suporte().then(function (s) {
        if (s.webxr) return entrarWebXR();
        if (s.slam) return sensores.then(function (permitido) {
          if (permitido === false && ehIOS()) throw Object.assign(Error('Os sensores de movimento foram recusados.'), { name: 'NotAllowedError' });
          return entrarSlam(permitido);
        });
        throw Error('Este aparelho não tem realidade aumentada.');
      });
    }

    function terminar() {
      var eraSlam = modo === 'slam';
      modo = 'nenhum'; temMira = false; rastreando = false; mira.visible = false;
      document.body.classList.remove('in-ar', 'ra-webxr', 'ra-slam');
      renderer.setClearAlpha(1);
      if (eraSlam) {
        desmontarSlam();
        if (opcoes.desenhar) renderer.setAnimationLoop(laco || opcoes.desenhar);
      }
      camera.updateProjectionMatrix();
      avisar();
    }

    function sair() {
      geracao++;
      if (sessao) { var s = sessao; return s.end().catch(function () {}); }
      if (modo === 'slam') terminar();
      else desmontarSlam();
      return Promise.resolve();
    }

    /* Por quadro, no modo WebXR (o laço da página chama). */
    function quadro(frame) {
      if (modo !== 'webxr' || !frame || !fonteDeHit) return;
      var hits = frame.getHitTestResults(fonteDeHit);
      temMira = false;
      if (hits.length) {
        var p = hits[0].getPose(renderer.xr.getReferenceSpace());
        if (p) { tmpV.set(p.transform.position.x, p.transform.position.y, p.transform.position.z); mirarEm(tmpV); temMira = true; }
      }
    }

    function cameraAtiva() {
      if (modo === 'webxr' && renderer.xr.isPresenting) {
        var c = renderer.xr.getCamera(camera);
        return (c.cameras && c.cameras[0]) || c;
      }
      return camera;
    }

    /* Um ponto do mundo em coordenadas da tela (a página toca por pixels). */
    function paraTela(ponto) {
      var c = cameraAtiva(), v = ponto.clone().project(c);
      if (!(v.z > -1 && v.z < 1)) return null;
      var r = renderer.domElement.getBoundingClientRect();
      var w = r.width || global.innerWidth, h = r.height || global.innerHeight;
      return { x: r.left + (v.x + 1) * w / 2, y: r.top + (1 - v.y) * h / 2 };
    }

    function estado() {
      return { modo: modo, ativo: modo !== 'nenhum', rastreando: rastreando, temMira: temMira, motivo: motivo, iOS: ehIOS() };
    }

    return {
      suporte: suporte, entrar: entrar, sair: sair, quadro: quadro, estado: estado,
      cameraAtiva: cameraAtiva, paraTela: paraTela, mira: mira,
      pose: function () { return pose.clone(); },
      ativo: function () { return modo !== 'nenhum'; },
      mostrarMira: function (sim) { mira.visible = !!sim && temMira; }
    };
  }

  /* Adianta o download do motor enquanto o jogador lê a tela. */
  function preparar() {
    if (!ehCelular() || global.AC_SEM_SLAM) return;
    if (navigator.xr && navigator.xr.isSessionSupported) {
      navigator.xr.isSessionSupported('immersive-ar').then(function (ok) { if (!ok) carregarXR8().catch(function () {}); }, function () { carregarXR8().catch(function () {}); });
    } else carregarXR8().catch(function () {});
  }

  global.ACRA = { criar: criar, preparar: preparar, ehIOS: ehIOS, ehCelular: ehCelular, carregarXR8: carregarXR8 };
})(typeof window !== 'undefined' ? window : globalThis);
