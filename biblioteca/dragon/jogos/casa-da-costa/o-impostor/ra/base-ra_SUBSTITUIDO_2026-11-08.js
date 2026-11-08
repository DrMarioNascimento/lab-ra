/* O Impostor — base comum das peças de RA que o jogador MODIFICA com a mão.

   Mario, 26/09/2026: aplicar o método da chave (cena three.js da própria
   página + motor de RA copiado) a todas as peças do Impostor que precisam
   mudar dentro da RA. O que cada peça faz com a mão fica no arquivo dela
   (relogio-chave.js, livro-abrir.js, quarto-porta.js); aqui fica o que é igual:

   · a cena, a luz, o chão da mesa e a órbita (modo sem RA);
   · a entrada na RA — WebXR no Android, 8th Wall no iPhone (ra/motor-ra.js) —
     com a mira, "Pôr aqui" e "Sair";
   · as PEGAS invisíveis: o dedo toca o próprio objeto (raio do dedo) e o
     arquivo da peça decide o que o movimento faz. Nada na tela indica o que
     se mexe — descobrir isso é parte da investigação.

   Tudo aqui é do Impostor e só do Impostor: nenhum caminho para v1/.

   04/10/2026 — qualidade de imagem e fluidez (ver Avaliacao_motor_RA.md):
   · SOMBRA DE CONTATO: a luz principal projeta sombra num plano que só
     recebe sombra. O plano mora dentro da `raiz`, então acompanha a peça
     quando ela é posta na mesa real (RA) e some o efeito de "colado".
     O sol segue a peça, como na maquete. `op.sombra === false` desliga.
   · NITIDEZ: as texturas dos modelos carregados ganham filtragem
     anisotrópica, para papéis, etiquetas e páginas lidos de lado.
     Peças que criam texturas próprias podem chamar `api.prepararModelo(obj)`.
   · RESOLUÇÃO ADAPTATIVA: fora da RA, a resolução desce quando os quadros
     atrasam e sobe quando sobra folga (entre 1,0 e 1,8 da densidade da
     tela). Dentro da RA não muda nada. */
(function (global) {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  function criar(op) {
    var api = {}, pegas = [], aCadaQuadro = [], mixers = [];
    var modo = 'mesa', posto = false, ra = null, relogio0 = new THREE.Clock();
    var raio = new THREE.Raycaster();

    /* ---------- cena ---------- */
    var renderer = new THREE.WebGLRenderer({ canvas: $('cena'), antialias: true, alpha: true });
    var PR_MAX = Math.min(devicePixelRatio, 1.8), PR_MIN = Math.min(devicePixelRatio, 1.0), pixelRatio = PR_MAX;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(innerWidth, innerHeight, false);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = op.exposicao || 1.05;
    renderer.xr.enabled = true;
    var comSombra = op.sombra !== false;
    if (comSombra) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
    var ANISO = Math.min(8, (renderer.capabilities.getMaxAnisotropy && renderer.capabilities.getMaxAnisotropy()) || 1);
    var FUNDO = 0x0c0907;
    var cena = new THREE.Scene(); cena.background = new THREE.Color(FUNDO);
    if (global.OIAmbiente) cena.environment = OIAmbiente(renderer); /* reflexos para os metais do padrão */
    var camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.005, 50);
    cena.add(camera);
    cena.add(new THREE.HemisphereLight(0xffe8c0, 0x201008, 0.9));
    var raioDoChao = op.raioDoChao || 1.4;
    var sol = new THREE.DirectionalLight(0xffddb0, 1.6); sol.position.set(-1.5, 3, 2.5); cena.add(sol);
    cena.add(sol.target);
    if (comSombra) {
      sol.castShadow = true;
      sol.shadow.mapSize.set(1024, 1024);
      sol.shadow.bias = -0.0005; sol.shadow.normalBias = 0.02;
      sol.shadow.radius = 3;
      ajustarCaixaDaSombra(1);
    }
    var chao = new THREE.Mesh(new THREE.CircleGeometry(raioDoChao, 48).rotateX(-Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x120c08, roughness: 0.95 }));
    chao.raycast = function () {}; cena.add(chao);
    var raiz = new THREE.Group(); cena.add(raiz);

    /* A sombra de contato: um plano que só recebe sombra, dentro da raiz.
       Na mesa ele escurece o chão escuro sob a peça; na RA, onde o chão some,
       é ele que pousa a peça na mesa real. */
    var sombra = null;
    if (comSombra) {
      sombra = new THREE.Mesh(new THREE.CircleGeometry(raioDoChao, 48).rotateX(-Math.PI / 2),
        new THREE.ShadowMaterial({ opacity: op.opacidadeDaSombra || 0.35 }));
      sombra.position.y = 0.001; sombra.receiveShadow = true;
      sombra.raycast = function () {}; sombra.userData.exportExclude = true;
      raiz.add(sombra);
    }
    function ajustarCaixaDaSombra(escalaAtual) {
      var c = sol.shadow.camera, r = raioDoChao * 1.1 * escalaAtual;
      c.left = -r; c.right = r; c.top = r; c.bottom = -r;
      c.near = 0.05 * escalaAtual; c.far = 10 * escalaAtual;
      c.updateProjectionMatrix();
    }
    /* O sol acompanha a peça: na RA ela pode estar longe da origem, e a caixa
       de sombra ficaria no lugar errado (o mesmo cuidado da maquete). */
    var solOffset = sol.position.clone(), escalaDoSol = 1;
    function seguirComOSol() {
      if (!comSombra) return;
      var centro = raiz.getWorldPosition(new THREE.Vector3()), e = raiz.getWorldScale(new THREE.Vector3()).x || 1;
      sol.target.position.copy(centro); sol.target.updateMatrixWorld();
      sol.position.copy(centro).addScaledVector(solOffset, e);
      if (e !== escalaDoSol) { escalaDoSol = e; ajustarCaixaDaSombra(e); }
    }

    var controles = new THREE.OrbitControls(camera, renderer.domElement);
    controles.enableDamping = true; controles.maxPolarAngle = Math.PI * 0.52;

    /* enquadramento sem RA: `op.vista` = { alvo:[x,y,z], dist, distRetrato, dir:[x,y,z] } */
    function enquadrar() {
      var v = op.vista, a = innerWidth / innerHeight, d = a < 0.8 ? (v.distRetrato || v.dist * 1.4) : v.dist;
      controles.target.fromArray(v.alvo);
      var dir = new THREE.Vector3().fromArray(v.dir || [0.35, 0.3, 1]).normalize().multiplyScalar(d * 1.1);
      camera.position.set(v.alvo[0], v.alvo[1], v.alvo[2]).add(dir);
      controles.minDistance = d * 0.2; controles.maxDistance = d * 1.8;
      camera.lookAt(controles.target);
    }
    enquadrar();
    addEventListener('resize', function () {
      if (renderer.xr.isPresenting || (ra && ra.ativo())) return;
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight, false);
    });

    /* ---------- qualidade dos modelos ----------
       Sombra projetada e nitidez em ângulo para tudo que a peça carregar. */
    var MAPAS = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap', 'alphaMap', 'bumpMap'];
    function prepararModelo(obj) {
      obj.traverse(function (o) {
        if (!o.isMesh) return;
        if (comSombra && !o.userData.semSombra) o.castShadow = true;
        var mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(function (m) {
          if (!m) return;
          MAPAS.forEach(function (k) {
            var t = m[k];
            if (t && t.anisotropy !== ANISO) { t.anisotropy = ANISO; t.needsUpdate = true; }
          });
        });
      });
      return obj;
    }

    /* ---------- resolução adaptativa (só fora da RA) ---------- */
    var amostras = 0, somaDt = 0, lentas = 0, folgadas = 0;
    function ajustarResolucao(dt) {
      if (modo !== 'mesa' || renderer.xr.isPresenting || (ra && ra.ativo())) { amostras = 0; somaDt = 0; return; }
      amostras++; somaDt += dt;
      if (amostras < 90) return;
      var media = somaDt / amostras; amostras = 0; somaDt = 0;
      if (media > 1 / 40) { lentas++; folgadas = 0; } else if (media < 1 / 55) { folgadas++; lentas = 0; } else { lentas = 0; folgadas = 0; }
      var novo = pixelRatio;
      if (lentas >= 2 && pixelRatio > PR_MIN) { novo = Math.max(PR_MIN, pixelRatio - 0.2); lentas = 0; }
      else if (folgadas >= 3 && pixelRatio < PR_MAX) { novo = Math.min(PR_MAX, pixelRatio + 0.1); folgadas = 0; }
      if (novo !== pixelRatio) {
        pixelRatio = novo;
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(innerWidth, innerHeight, false);
      }
    }

    /* ---------- utilidades para as peças ---------- */
    function cameraAgora() { return ra && ra.ativo() ? ra.cameraAtiva() : camera; }
    function ndc(x, y) {
      var c = renderer.domElement.getBoundingClientRect();
      return new THREE.Vector2(((x - c.left) / c.width) * 2 - 1, 1 - ((y - c.top) / c.height) * 2);
    }
    function naTela(p) {
      var v = p.clone().project(cameraAgora()), r = renderer.domElement.getBoundingClientRect();
      var x = r.left + (v.x + 1) * r.width / 2, y = r.top + (1 - v.y) * r.height / 2;
      return { x: x, y: y, dentro: v.z > -1 && v.z < 1 && x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight };
    }
    function raioDoDedo(x, y) { raio.setFromCamera(ndc(x, y), cameraAgora()); return raio; }
    function escala() { return raiz.getWorldScale(new THREE.Vector3()).x || 1; }
    function visivel(o) { for (; o; o = o.parent) if (!o.visible) return false; return true; }
    function suave(x) { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); }
    function vibrar(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }
    function estado(t) { $('estado').textContent = t; }
    function pronto() { return modo === 'mesa' || posto; }
    /* um ponto da tela sobre um plano do mundo */
    function dedoNoPlano(x, y, plano) {
      var p = new THREE.Vector3();
      return raioDoDedo(x, y).ray.intersectPlane(plano, p) ? p : null;
    }
    function tocarClipe(raizDoModelo, clipe, fim) {
      var m = mixers.find(function (k) { return k.getRoot() === raizDoModelo; });
      if (!m) { m = new THREE.AnimationMixer(raizDoModelo); mixers.push(m); }
      var a = m.clipAction(clipe); a.reset(); a.setLoop(THREE.LoopOnce); a.clampWhenFinished = true; a.play();
      if (fim) { var ouvir = function (e) { if (e.action === a) { m.removeEventListener('finished', ouvir); fim(); } }; m.addEventListener('finished', ouvir); }
      return a;
    }
    function pararClipes(raizDoModelo) {
      mixers.forEach(function (m) { if (m.getRoot() === raizDoModelo) { m.stopAllAction(); m.uncacheRoot(raizDoModelo); } });
    }

    /* ---------- pegas (invisíveis) ----------
       Mario, 26/09/2026: nada de círculos marcando o que se pega — descobrir o que se
       mexe, e onde, faz parte da investigação. O dedo toca o PRÓPRIO objeto: um raio
       sai do dedo e, se bate numa peça que se mexe (def.alvo), ela vem junto.
       Para peças miúdas vale também tocar perto do ponto de pega (def.ancora).
       def = { alvo(): Object3D, ancora(): Vector3, ativa(): bool, inicio, mover, fim } */
    var PERTO_PX = 40, segurada = null, dedo = null;
    function pega(def) { var p = { def: def }; pegas.push(p); return p; }
    function pegaSobODedo(x, y) {
      var r = raioDoDedo(x, y), melhor = null, dist = Infinity;
      pegas.forEach(function (p) {
        if (!p.def.ativa()) return;
        var alvo = p.def.alvo && p.def.alvo();
        if (alvo) {
          var h = r.intersectObject(alvo, true).find(function (h) { return visivel(h.object); });
          if (h && h.distance < dist) { dist = h.distance; melhor = p; }
        }
      });
      if (melhor) return melhor;
      var perto = null, dpx = PERTO_PX;
      pegas.forEach(function (p) {
        if (!p.def.ativa() || !p.def.ancora) return;
        var s = naTela(p.def.ancora()); if (!s.dentro) return;
        var d = Math.hypot(s.x - x, s.y - y); if (d < dpx) { dpx = d; perto = p; }
      });
      return perto;
    }
    function ehInterface(e) { return e.target && e.target.closest && e.target.closest('button, a, .topo, .base'); }
    addEventListener('pointerdown', function (e) {
      if (segurada || !pronto() || ehInterface(e)) return;
      var p = pegaSobODedo(e.clientX, e.clientY); if (!p) return;
      e.stopPropagation(); e.preventDefault();
      segurada = p; dedo = e.pointerId; controles.enabled = false;
      p.def.inicio && p.def.inicio(e.clientX, e.clientY);
    }, true);
    addEventListener('pointermove', function (e) {
      if (!segurada || e.pointerId !== dedo) return;
      e.stopPropagation(); segurada.def.mover && segurada.def.mover(e.clientX, e.clientY);
    }, true);
    ['pointerup', 'pointercancel'].forEach(function (tipo) {
      addEventListener(tipo, function (e) {
        if (!segurada || e.pointerId !== dedo) return;
        e.stopPropagation();
        var p = segurada; segurada = null; dedo = null; controles.enabled = modo === 'mesa';
        p.def.fim && p.def.fim(e.clientX, e.clientY, tipo === 'pointercancel');
      }, true);
    });

    /* ---------- RA ---------- */
    function montarRA() {
      ra = OIRA.criar({
        renderer: renderer, camera: camera, cena: cena, altura: op.alturaDoAparelho || 1.35, miraEscala: op.miraEscala || 1,
        desenhar: desenhar,
        aoTocar: function () { porAqui(); }, /* no WebXR, tocar a tela também põe a peça */
        aoMudar: function (e) {
          if (!e.ativo && modo === 'ra') voltarParaMesa();
          $('btPor').disabled = !(e.ativo && e.temMira);
        }
      });
      ra.suporte().then(function (s) { if (s.webxr || s.slam) $('btRA').hidden = false; });
      OIRA.preparar();
      $('btRA').onclick = function () {
        $('btRA').disabled = true; estado('Abrindo a câmera…');
        ra.entrar().then(function () {
          modo = 'ra'; posto = false; raiz.visible = false; chao.visible = false; controles.enabled = false;
          $('btRA').hidden = true; $('btPor').hidden = false; $('btSair').hidden = false; tinhaMira = null;
          estado(op.textoMira || 'Aponte para onde a peça vai ficar e toque em Pôr aqui.');
        }).catch(function (e) {
          $('btRA').disabled = false;
          estado('A RA não abriu (' + (e && e.message || e) + '). Siga aqui mesmo, girando com o dedo.');
        });
      };
      $('btPor').onclick = porAqui;
      /* na 8th Wall (iPhone) o toque na própria cena também põe a peça */
      renderer.domElement.addEventListener('pointerup', function () { if (modo === 'ra' && !posto) porAqui(); });
    }
    /* A mira muda a cada quadro, mas o motor só avisa em mudanças de sessão: por isso o
       botão "Pôr aqui" é conferido no laço (ver desenhar). Sem isso ele ficava sempre apagado. */
    var tinhaMira = null, poseReserva = null;
    /* iPhone (8th Wall, escala "responsiva"): o chão do mundo é y = 0 e o aparelho começa
       na altura op.alturaDoAparelho. Se o teste de superfície ainda não achou nada, a mira
       vai para onde o olhar do aparelho cruza esse chão — assim "Pôr aqui" sempre funciona. */
    function poseDoChao() {
      if (ra.estado().modo !== 'slam') return null;
      var c = ra.cameraAtiva(); c.updateMatrixWorld();
      var o = new THREE.Vector3().setFromMatrixPosition(c.matrixWorld), d = c.getWorldDirection(new THREE.Vector3());
      if (d.y > -0.08) return null;
      var t = -o.y / d.y; if (!(t > 0 && t < 8)) return null;
      var p = o.addScaledVector(d, t), q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(-d.x, -d.z));
      return new THREE.Matrix4().compose(p, q, new THREE.Vector3(1, 1, 1));
    }
    function conferirMira() {
      var acerto = !!ra.estado().temMira;
      poseReserva = acerto ? null : poseDoChao();
      if (poseReserva) {
        var e = op.miraEscala || 1;
        ra.mira.matrix.copy(poseReserva).multiply(new THREE.Matrix4().makeScale(e, e, e)); ra.mira.visible = true;
      }
      var tem = acerto || !!poseReserva;
      if (tem === tinhaMira) return;
      tinhaMira = tem;
      $('btPor').disabled = !tem;
      estado(tem ? (op.textoMira || 'Toque em Pôr aqui.') : 'Procurando a superfície… mova o celular devagar, apontando para ela.');
    }
    function porAqui() {
      if (modo !== 'ra' || posto) return;
      var m = ra.estado().temMira ? ra.pose() : (poseReserva || poseDoChao());
      if (!m) { estado('Ainda não achei a superfície. Mova o celular devagar, apontando para ela.'); return; }
      raiz.position.setFromMatrixPosition(m); raiz.quaternion.setFromRotationMatrix(m);
      if (op.giroRA) raiz.rotateY(op.giroRA); /* qual lado da peça fica de frente para quem olha */
      raiz.scale.setScalar(op.escalaRA || 1); raiz.visible = true; posto = true;
      ra.mostrarMira(false); $('btPor').hidden = true;
      estado(op.textoInicio || '');
    }
    function ligarBotoesRA() {
      $('btSair').onclick = function () { ra.sair(); };
      ['btPor', 'btSair', 'btDeNovo', 'btRA'].forEach(function (id) {
        $(id).addEventListener('beforexrselect', function (e) { e.preventDefault(); });
      });
    }
    function voltarParaMesa() {
      modo = 'mesa'; posto = false;
      raiz.position.set(0, 0, 0); raiz.quaternion.identity(); raiz.scale.setScalar(1); raiz.visible = true;
      chao.visible = true; cena.background = new THREE.Color(FUNDO); controles.enabled = true;
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); enquadrar();
      $('btRA').hidden = false; $('btRA').disabled = false; $('btPor').hidden = true; $('btSair').hidden = true;
      estado(op.textoInicio || '');
    }

    /* ---------- laço ---------- */
    function desenhar(t, quadroXR) {
      var dt = Math.min(0.05, relogio0.getDelta());
      if (ra) { ra.quadro(quadroXR); ra.mostrarMira(modo === 'ra' && !posto); if (modo === 'ra' && !posto) conferirMira(); }
      if (modo === 'mesa') controles.update();
      aCadaQuadro.forEach(function (f) { f(dt); });
      mixers.forEach(function (m) { m.update(dt); });
      seguirComOSol();
      ajustarResolucao(dt);
      renderer.render(cena, camera);
    }

    function carregar(urls) {
      var L = new THREE.GLTFLoader();
      if (global.OIMeshopt && L.setMeshoptDecoder) L.setMeshoptDecoder(global.OIMeshopt); /* modelos comprimidos, se o decodificador estiver na página */
      return Promise.all(urls.map(function (u) {
        return new Promise(function (ok, falha) {
          L.load(u, function (g) { if (g && g.scene) prepararModelo(g.scene); ok(g); }, undefined, falha);
        });
      }));
    }

    function comecar() {
      montarRA(); ligarBotoesRA();
      $('btDeNovo').onclick = function () { op.deNovo && op.deNovo(); };
      renderer.setAnimationLoop(desenhar);
      estado(op.textoInicio || '');
    }

    Object.assign(api, {
      cena: cena, camera: camera, renderer: renderer, raiz: raiz, controles: controles,
      cameraAgora: cameraAgora, naTela: naTela, raioDoDedo: raioDoDedo, dedoNoPlano: dedoNoPlano,
      escala: escala, visivel: visivel, suave: suave, vibrar: vibrar, estado: estado, pronto: pronto,
      tocarClipe: tocarClipe, pararClipes: pararClipes, pega: pega, carregar: carregar, comecar: comecar,
      prepararModelo: prepararModelo, sombra: sombra,
      resolucao: function () { return pixelRatio; },
      aCadaQuadro: function (f) { aCadaQuadro.push(f); },
      mostrarDeNovo: function (sim) { $('btDeNovo').hidden = !sim; }
    });
    return api;
  }

  global.OIBase = { criar: criar };
})(window);
