/* A maquete da Agência 0688 — a peça RA que entra no Capítulo 1 e vai sendo
   abastecida a cada capítulo (decisão do Mario, 06/10: "a maquete é que
   manda"; "no Cap 1 entra a maquete mais o malote").

   · Modelo base: modelos/agencia-0688-base.glb — o arquivo do designer sem o
     que a história ainda não revelou (Passagem de Serviço, malote, lacre,
     campos das câmeras), sem as luzes da noite e com as peças juntadas por
     sala (de ~3.400 para ~260 desenhos por quadro).
   · Itens: arquivos à parte no MESMO referencial (modelos/item-*.glb). Peças
     sem modelo próprio aparecem como um marcador dourado no lugar onde a
     história as põe; tocar abre a peça de perto (o desenho que já existe).
   · RA: o motor comum d'A Casa (../v1/js/ac-ra.js e ac-maquete-ra.js):
     WebXR no Android, 8th Wall no iPhone. Sem RA, a maquete fica na tela,
     com órbita.

   Uso (mesa.html): CFIMaquete.abrir({itens, revelados, info, aoAbrirItem}). */
(function (global) {
  'use strict';

  var BASE = (function () { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^/]*$/, '') : ''; })();
  var V1 = BASE + '../../../jogos/casa-da-costa/a-mesa/js/';
  var SCRIPTS = [V1 + 'three.min.js', V1 + 'vendor/GLTFLoader.js', V1 + 'vendor/OrbitControls.js', V1 + 'ac-ra.js', V1 + 'ac-maquete-ra.js'];
  var MODELO = BASE + 'modelos/agencia-0688-base.glb';
  /* 07/10: o malote de perto do designer (sem as etiquetas e sem a cinta do envio extra; ver preparar-malote.mjs) */
  var MALOTE_PERTO = BASE + 'modelos/malote-perto.glb', malotePronto = null;

  /* metros da maquete → "1 de pegada" do motor de RA (≈ 42 cm na mesa) */
  var LARGURA = 50, CENTRO = { x: -5, z: 1.5 };

  /* As salas que o jogo conhece, pelo número da etiqueta do designer. */
  var SALA = { 1: 'porta-giratoria', 2: 'saguao', 3: 'guiches', 4: 'mesa-recebimento', 5: 'sala-gerencia', 6: 'banheiro', 7: 'porta-lateral',
    8: 'corredor-restrito', 9: 'central', 10: 'arquivo-morto', 11: 'rack-tecnico', 13: 'antecamara', 14: 'cofre', 15: 'eclusa',
    16: 'vaga-blindada', 17: 'farmacia', 18: 'padaria' };
  /* Ruas que não são peça do modelo: decididas pelo ponto tocado. */
  /* Piso de cada lugar (metros, como na planta): o toque no chão, numa
     parede ou numa rua cai no lugar certo. Os pequenos vêm primeiro. */
  var RUAS = [['porta-giratoria', -4.2, -0.6, 7.7, 10.8], ['porta-lateral', -11.2, -9.9, 2.9, 4.5], ['rack-tecnico', -5.2, -4.5, -6.5, -5.4],
    ['mesa-recebimento', 0.9, 2.4, 3.6, 6.8], ['guiches', -0.3, 0.9, 3, 8.2], ['eclusa', 2.4, 4.85, 3, 8.2], ['saguao', -10.2, -0.3, 3, 8.5],
    ['sala-gerencia', -7.7, -4.5, -1, 3], ['banheiro', -10.2, -7.7, -1, 3], ['corredor-restrito', -4.5, -2.5, -6.5, 3],
    ['central', -2.5, 1.2, -3, 3], ['arquivo-morto', -9.4, -4.5, -5.4, -1.8], ['antecamara', -2.5, 1.2, -6.5, -3], ['cofre', 1.2, 4.2, -6.5, -1.5],
    ['vaga-blindada', 5, 9, -9.3, 11.5], ['farmacia', 9, 17, -6.8, 9], ['padaria', -27, -19.4, -0.5, 8.5],
    ['avenida', -30, 20, 11.5, 19.5], ['rua-de-tras', -19.4, -13, -9.3, 11.5]];

  /* Onde cada peça de capítulo fica na maquete (metros). */
  var ITENS = {
    c1: { nome: 'O malote murcho', em: [-6.9, 0.5, -4.0], modelo: 'modelos/item-malote.glb' },
    c2: { nome: 'O rádio reserva', em: [-7.47, 1.33, 1.5] },
    c3: { nome: 'A impressora de etiquetas', em: [-7.47, 1.45, 2.15] },
    c4: { nome: 'O armário de vestígios', em: [-4.9, 2.45, -5.95] },
    c5: { nome: 'A balança de custódia', em: [6.9, 3.1, 5.0] },
    c6: { nome: 'A noite de onze dias antes', em: [0.25, 1.75, 6.35] },
    c7: { nome: 'A escrivaninha das quinze versões', em: [1.1, 1.25, 5.2] }
  };
  /* Revelações que mudam a própria maquete. */
  var REVELA = {
    passagem: { modelo: 'modelos/item-passagem.glb', esconde: ['macico', 'rack-fundo', 'painel'] },
    pegadas: { fazer: fazerPegadas },
    campos: { modelo: 'modelos/item-campos.glb' }
  };

  var pronto = null, el = null, renderer, cena, camera, controles, raiz, modelo, ra = null, opcoes = {};
  var LUZ = {}, perto = null, emPerto = false, bordaAlvo = 0;
  var pinos = [], extras = {}, realce = null, relogio = 0, andarDeCima = false, tocando = null, ativo = false;

  function carregarScript(src) {
    return new Promise(function (ok, falha) {
      if (document.querySelector('script[data-maq="' + src + '"]')) return ok();
      var s = document.createElement('script'); s.src = src; s.async = false; s.setAttribute('data-maq', src);
      s.onload = function () { ok(); }; s.onerror = function () { falha(Error('Não carregou ' + src)); };
      document.head.appendChild(s);
    });
  }
  function carregarTudo() {
    if (pronto) return pronto;
    var cadeia = Promise.resolve();
    SCRIPTS.forEach(function (s) {
      cadeia = cadeia.then(function () {
        if (/three\.min/.test(s) && global.THREE) return;
        return carregarScript(s);
      });
    });
    pronto = cadeia.then(montar);
    pronto.catch(function () { pronto = null; });
    return pronto;
  }

  /* ---------------- tela ---------------- */
  function criarTela() {
    el = document.createElement('div');
    el.id = 'telaMaquete'; el.className = 'tela-maq'; el.hidden = true;
    el.innerHTML =
      '<div class="maq-palco" id="maqPalco"></div>' +
      '<div class="maq-topo"><button type="button" class="sair-ra" id="maqSair">‹ Voltar</button>' +
      '<div class="maq-tit"><b>A maquete · Agência 0688</b><span id="maqDica">Arraste para girar. Toque numa sala ou num marcador dourado.</span></div></div>' +
      '<div class="maq-ferr"><button type="button" id="maqAndar" aria-pressed="false">Ver o andar de cima</button>' +
      '<button type="button" id="maqRA" hidden>Pôr na mesa (RA)</button><button type="button" id="maqPousar" hidden>Pousar aqui</button></div>' +
      '<div class="planta-card maq-card"><small id="maqRot">A MAQUETE</small><p id="maqTxt">Toque numa sala para ver o que há nela.</p><div id="maqAcao"></div></div>' +
      '<div class="maq-carregando" id="maqCarregando">Montando a maquete…</div>';
    document.body.appendChild(el);
    var css = document.createElement('style');
    css.textContent =
      '.tela-maq{position:fixed;inset:0;z-index:86;background:#0b1520;display:flex;flex-direction:column;touch-action:none}' +
      '.tela-maq[hidden]{display:none}' +
      '.maq-palco{position:absolute;inset:0}.maq-palco canvas{display:block;width:100%;height:100%;touch-action:none}' +
      '.maq-topo{position:relative;z-index:3;display:flex;gap:10px;align-items:flex-start;padding:calc(env(safe-area-inset-top) + 10px) 10px 8px;background:linear-gradient(#0b1520f0,#0b152000);pointer-events:none}' +
      '.maq-topo>*{pointer-events:auto}.maq-topo .sair-ra{position:static;flex:0 0 auto;min-height:40px;padding:0 14px;border-radius:10px;border:1px solid #46667a;background:#0c1b26e6;color:#efc878;font:700 13px var(--sans,system-ui);cursor:pointer;box-shadow:0 3px 0 #020609}' +
      '.maq-tit{display:flex;flex-direction:column;font:500 12.5px/1.45 var(--termfont,monospace);color:var(--term,#9fe9c0)}' +
      '.maq-tit b{color:#efc878;font:600 18px/1.2 var(--display,Georgia,serif)}' +
      '.maq-ferr{position:relative;z-index:3;display:flex;flex-wrap:wrap;gap:8px;padding:0 10px;margin-top:auto;justify-content:center}' +
      '.maq-ferr button{min-height:44px;padding:0 14px;border-radius:22px;border:1px solid #46667a;background:#0c1b26e6;color:#efc878;font:700 12.5px var(--sans,system-ui);cursor:pointer}' +
      '.maq-ferr button[aria-pressed=true]{border-color:#efc878}' +
      '.maq-ferr #maqRA,.maq-ferr #maqPousar{background:linear-gradient(180deg,#f3d078,#e0b13a);color:#1a1206;border-color:#d6aa58}' +
      '.maq-card{position:relative;z-index:3;margin:8px 10px calc(env(safe-area-inset-bottom) + 10px)!important}' +
      '.maq-card .acao{margin-top:9px;width:100%;min-height:42px;border-radius:9px;border:1px solid #d6aa58;background:linear-gradient(180deg,#f3d078,#e0b13a);color:#1a1206;font:700 12.5px var(--termfont,monospace);cursor:pointer}' +
      '.maq-carregando{position:absolute;z-index:4;left:50%;top:45%;transform:translate(-50%,-50%);padding:12px 18px;border-radius:10px;background:#08130fe6;border:1px solid #2f6b4e;color:#9fe9c0;font:500 13px var(--termfont,monospace)}' +
      '.maq-carregando[hidden]{display:none}' +
      'body.in-ar{background:transparent!important}body.in-ar>*:not(#telaMaquete){visibility:hidden!important}' +
      'body.in-ar .tela-maq{background:transparent}body.ra-webxr .maq-palco canvas{visibility:hidden}' +
      'body.in-ar #maqAndar{display:none}';
    document.head.appendChild(css);
    el.querySelector('#maqSair').onclick = function () { if (emPerto) sairPerto(); else if (emPeca) sairPeca(); else fechar(); };
    el.querySelector('#maqAndar').onclick = function () { mostrarAndar(!andarDeCima); };
    el.querySelector('#maqRA').onclick = entrarRA;
    el.querySelector('#maqPousar').onclick = pousar;
  }

  function cartao(rot, txt, acao) {
    el.querySelector('#maqRot').textContent = rot;
    var p = el.querySelector('#maqTxt');
    if (opcoes.digitar) { p.innerHTML = ''; opcoes.digitar(p, txt); } else p.innerHTML = txt;
    var a = el.querySelector('#maqAcao'); a.innerHTML = '';
    if (acao) { var b = document.createElement('button'); b.className = 'acao'; b.type = 'button'; b.textContent = acao[0]; b.onclick = acao[1]; a.appendChild(b); }
  }
  function dica(t) { el.querySelector('#maqDica').textContent = t; }

  /* ---------------- cena ---------------- */
  function montar() {
    var THREE = global.THREE;
    var palco = el.querySelector('#maqPalco');
    cena = new THREE.Scene();
    cena.background = new THREE.Color(0x0b1520);
    camera = new THREE.PerspectiveCamera(42, 1, 0.005, 40);
    cena.add(camera);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 1.75));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.xr.enabled = true;
    palco.appendChild(renderer.domElement);

    /* Terça, 7h47, garoa: luz fria e difusa, sem sol marcado. */
    LUZ.hemi = new THREE.HemisphereLight(0xd6e2ec, 0x2a2f33, 0.95); cena.add(LUZ.hemi);
    LUZ.ceu = new THREE.DirectionalLight(0xe9eef2, 0.9); LUZ.ceu.position.set(-0.6, 1.6, 0.9); cena.add(LUZ.ceu);
    LUZ.fria = new THREE.DirectionalLight(0xa9c3d6, 0.35); LUZ.fria.position.set(1.2, 0.8, -1.1); cena.add(LUZ.fria);
    LUZ.amb = new THREE.AmbientLight(0xffffff, 0.18); cena.add(LUZ.amb);
    /* a lanterna da cena de perto: segue a câmera (na RA, o celular) */
    LUZ.lanterna = new THREE.SpotLight(0xfff0d2, 0, 8, 0.2, 0.55, 1); cena.add(LUZ.lanterna); cena.add(LUZ.lanterna.target);

    raiz = new THREE.Group(); raiz.name = 'raiz-maquete'; cena.add(raiz);
    return carregarGLB(MODELO).then(function (g) {
      modelo = g.scene;
      modelo.scale.setScalar(1 / LARGURA);
      modelo.position.set(-CENTRO.x / LARGURA, 0, -CENTRO.z / LARGURA);
      raiz.add(modelo);
      if (opcoes.malote) setTimeout(prepararMalote, 1500);
      modelo.traverse(function (o) { if (o.isMesh) { o.frustumCulled = true; if (o.material && o.material.name === 'vidro') o.material.depthWrite = false; } });
      mostrarAndar(false);
      var caixa = new THREE.Box3().setFromObject(raiz);
      var baseY = caixa.min.y;

      controles = new THREE.OrbitControls(camera, renderer.domElement);
      controles.enableDamping = true; controles.dampingFactor = 0.08;
      controles.minDistance = 0.18; controles.maxDistance = 2.4;
      controles.maxPolarAngle = Math.PI * 0.47;
      controles.target.set(0.046, 0.02, -0.016);
      camera.position.set(-0.05, 0.8, 0.48);

      if (global.ACMaquetteRA) {
        try {
          ra = global.ACMaquetteRA.criar({ renderer: renderer, cena: cena, camera: camera, raiz: raiz, baseY: baseY,
            aoMudar: aoMudarRA, desenhar: desenhar, aoTocar: function (x, y) { tocar(x, y); } });
          ra.modosPossiveis(function (m) { el.querySelector('#maqRA').hidden = !m.ra; });
        } catch (e) { console.warn('[maquete] RA indisponível', e); ra = null; }
      }
      ligarToques();
      redimensionar();
      global.addEventListener('resize', redimensionar);
      renderer.setAnimationLoop(desenhar);
    });
  }

  function carregarGLB(url) {
    return new Promise(function (ok, falha) { new global.THREE.GLTFLoader().load(url, ok, undefined, falha); });
  }

  function redimensionar() {
    if (!renderer || !el || el.hidden) return;
    var w = global.innerWidth, h = global.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  function mostrarAndar(sim) {
    andarDeCima = sim;
    ['telhado', 'piso-2'].forEach(function (n) { var o = modelo && modelo.getObjectByName(n); if (o) o.visible = sim; });
    if (el) { var b = el.querySelector('#maqAndar'); b.setAttribute('aria-pressed', sim ? 'true' : 'false'); b.textContent = sim ? 'Tirar o andar de cima' : 'Ver o andar de cima'; }
  }

  /* ---------------- itens e revelações ---------------- */
  function aplicarItens() {
    var THREE = global.THREE;
    pinos.forEach(function (p) { modelo.remove(p); }); pinos = [];
    (opcoes.itens || []).forEach(function (id) {
      var D = ITENS[id]; if (!D) return;
      if (D.modelo && !extras[id]) extras[id] = carregarGLB(BASE + D.modelo).then(function (g) { g.scene.userData.item = id; modelo.add(g.scene); marcar(g.scene, id); return g.scene; }).catch(function () {});
      var pino = new THREE.Group(); pino.userData.item = id; pino.userData.pino = true;
      var losango = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), new THREE.MeshBasicMaterial({ color: 0xffb21f, toneMapped: false }));
      losango.scale.set(1, 1.5, 1);
      var anel = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 8, 28), new THREE.MeshBasicMaterial({ color: 0xffb21f, transparent: true, opacity: 0.85, toneMapped: false }));
      anel.rotation.x = Math.PI / 2; anel.position.y = -0.9;
      /* um alvo invisível generoso, para o dedo */
      var alvo = new THREE.Mesh(new THREE.SphereGeometry(0.9, 10, 8), new THREE.MeshBasicMaterial({ visible: false }));
      /* acima das paredes (4,4 m), com um fio até o ponto exato */
      var topo = Math.max(D.em[1] + 1.6, 5.4);
      var fio = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, topo - D.em[1], 6), new THREE.MeshBasicMaterial({ color: 0xefc878, transparent: true, opacity: 0.75 }));
      fio.position.y = -(topo - D.em[1]) / 2;
      anel.position.y = -(topo - D.em[1]);
      losango.scale.set(1.4, 2.1, 1.4);
      pino.add(losango, anel, alvo, fio);
      pino.position.set(D.em[0], topo, D.em[2]);
      pino.userData.y0 = pino.position.y;
      marcar(pino, id);
      modelo.add(pino); pinos.push(pino);
    });
    var rev = opcoes.revelados || {};
    Object.keys(REVELA).forEach(function (k) {
      var R = REVELA[k], sim = !!rev[k];
      (R.esconde || []).forEach(function (n) { var o = modelo.getObjectByName(n); if (o) o.visible = !sim; });
      if (sim && R.fazer && !extras[k]) { extras[k] = R.fazer(); return; }
      if (sim && R.modelo && !extras[k]) extras[k] = carregarGLB(BASE + R.modelo).then(function (g) { modelo.add(g.scene); if (k === 'campos') g.scene.traverse(function (o) { if (o.isMesh) { o.material.transparent = true; o.material.opacity = 0.28; o.material.depthWrite = false; o.raycast = function () {}; } }); return g.scene; }).catch(function () {});
    });
  }
  /* Cap. 4: meias-luas úmidas do cesto do Arquivo, pela porta e pelo
     corredor, até o fundo do Nicho do Rack (metros da maquete) */
  function fazerPegadas() {
    var THREE = global.THREE, G = new THREE.Group(); G.name = 'pegadas';
    var rota = [[-8.6, -2.35], [-6.2, -3.9], [-4.65, -4.8], [-3.6, -5.15], [-3.75, -5.95], [-4.85, -5.95]];
    var mat = new THREE.MeshStandardMaterial({ color: 0x2a3d4a, emissive: 0x0b1820, roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.9, polygonOffset: true, polygonOffsetFactor: -2 });
    var geo = new THREE.CircleGeometry(0.12, 16, 0, Math.PI); geo.rotateX(-Math.PI / 2);
    var lado = 1;
    for (var i = 0; i < rota.length - 1; i++) {
      var a = rota[i], b = rota[i + 1], dx = b[0] - a[0], dz = b[1] - a[1], L = Math.sqrt(dx * dx + dz * dz), ang = Math.atan2(dx, dz);
      for (var d = 0; d < L; d += 0.4) {
        var m = new THREE.Mesh(geo, mat), t = d / L;
        m.position.set(a[0] + dx * t + Math.cos(ang) * 0.07 * lado, 0.445, a[1] + dz * t - Math.sin(ang) * 0.07 * lado);
        m.rotation.y = ang; m.scale.set(1, 1, 1.5); lado = -lado; G.add(m);
      }
    }
    G.traverse(function (o) { o.raycast = function () {}; });
    modelo.add(G); return Promise.resolve(G);
  }
  function marcar(obj, id) { obj.traverse(function (o) { o.userData.item = id; }); }

  /* ---------------- toque ---------------- */
  function ligarToques() {
    var c = renderer.domElement;
    c.addEventListener('pointerdown', function (e) { tocando = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    c.addEventListener('pointerup', function (e) {
      if (!tocando) return;
      var dx = e.clientX - tocando.x, dy = e.clientY - tocando.y, dt = performance.now() - tocando.t; tocando = null;
      if (dx * dx + dy * dy > 81 || dt > 600) return;
      var est = ra && ra.estado();
      if (est && est.modo === 'ra' && !est.posta) { pousar(); return; }
      tocar(e.clientX, e.clientY);
    });
  }

  function tocar(x, y) {
    var THREE = global.THREE, cam = ra ? ra.cameraAtiva() : camera;
    var r = renderer.domElement.getBoundingClientRect();
    var ponto = new THREE.Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    var ray = new THREE.Raycaster(); ray.setFromCamera(ponto, cam);
    if (emPerto) { tocarPerto(ray); return; }
    if (emPeca) { tocarPeca(ray); return; }
    var alvos = []; modelo.traverse(function (o) { if (o.isMesh && visivel(o)) alvos.push(o); });
    var hits = ray.intersectObjects(alvos, false);
    if (hits.length) {
      var o = hits[0].object;
      if (o.userData.item) { escolherItem(o.userData.item); return; }
      var hp = modelo.worldToLocal(hits[0].point.clone());
      if (hp.y > 4.3 && andarDeCima) return; /* andar de cima: cenário */
      var sala = salaDe(o);
      if (sala) { escolherSala(sala); return; }
    }
    /* sem móvel da sala: vale o ponto do chão para onde o dedo aponta
       (atravessa as paredes, como quem olha para dentro da sala) */
    var inv = new THREE.Matrix4().copy(modelo.matrixWorld).invert();
    var r0 = ray.ray.clone().applyMatrix4(inv);
    var chao = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.44), p = new THREE.Vector3();
    if (!r0.intersectPlane(chao, p)) return;
    for (var k = 0; k < RUAS.length; k++) { var R = RUAS[k]; if (p.x >= R[1] && p.x <= R[2] && p.z >= R[3] && p.z <= R[4]) { escolherSala(R[0], null, R); return; } }
  }
  function visivel(o) { for (var p = o; p; p = p.parent) if (!p.visible) return false; return true; }
  function salaDe(o) {
    for (var p = o; p && p !== modelo; p = p.parent) {
      if (p.userData && p.userData.n && SALA[p.userData.n]) return SALA[p.userData.n];
      var m = /^etiqueta-(\d+)$/.exec(p.name || ''); if (m && SALA[+m[1]]) return SALA[+m[1]];
    }
    return null;
  }

  function escolherSala(id, obj, R) {
    var info = opcoes.info ? opcoes.info(id) : null;
    if (!info) return;
    cartao(info[0].toUpperCase(), info[1]);
    if (!R) for (var k = 0; k < RUAS.length; k++) if (RUAS[k][0] === id) R = RUAS[k];
    destacar(R);
  }
  function escolherItem(id) {
    var D = ITENS[id];
    if (id === 'c1' && opcoes.malote) { cartao(D.nome.toUpperCase(), 'O malote está no chão do Arquivo Morto.', ['Chegar perto, com a lanterna ›', entrarPerto]); destacar(null); return; }
    cartao(D.nome.toUpperCase(), 'A peça do Capítulo ' + id.slice(1) + ' está aqui.', ['Examinar de perto ›', function () { entrarPeca(id); }]);
    destacar(null);
  }
  function destacar(obj) {
    var THREE = global.THREE;
    if (realce) { realce.parent && realce.parent.remove(realce); realce = null; }
    if (!obj) return;
    var a = modelo.localToWorld(new THREE.Vector3(obj[1], 0.45, obj[3])), z = modelo.localToWorld(new THREE.Vector3(obj[2], 0.5, obj[4]));
    var caixa = new THREE.Box3(a.clone().min(z), a.clone().max(z));
    realce = new THREE.Box3Helper(caixa, 0xefc878); realce.material.depthTest = false; realce.renderOrder = 10;
    cena.add(realce); realce.userData.nasceu = relogio;
  }

  /* ---------------- RA ---------------- */
  function entrarRA() {
    if (!ra) return;
    dica('Abrindo a câmera…');
    ra.entrar('ra').then(function () {
      mostrarAndar(false);
      dica('Aponte para a mesa até aparecer o círculo. Depois, toque em "Pousar aqui".');
      cartao('NA MESA', 'Ponha a agência sobre uma mesa de verdade. Dá para andar em volta e chegar perto. Com dois dedos, aumenta ou diminui.');
      atualizarBotoes();
    }).catch(function (e) {
      dica('Sem RA neste aparelho agora. A maquete segue na tela.');
      cartao('RA', (e && e.message) || 'A câmera não abriu.');
      atualizarBotoes();
    });
  }
  function pousar() {
    if (!ra) return;
    var e = ra.estado();
    if (e.modo === 'ra' && !e.temHit) { dica('Aponte para a mesa até aparecer o círculo.'); return; }
    if (ra.posicionar()) { dica('Toque numa sala ou num marcador dourado.'); atualizarBotoes(); }
  }
  function aoMudarRA() { atualizarBotoes(); }
  function atualizarBotoes() {
    if (!el || !ra) return;
    var e = ra.estado();
    el.querySelector('#maqPousar').hidden = !(e.modo === 'ra' && !e.posta);
    el.querySelector('#maqRA').textContent = e.modo === 'ra' ? 'Sair da RA' : 'Pôr na mesa (RA)';
    el.querySelector('#maqRA').onclick = e.modo === 'ra' ? function () { ra.sair().then(function () { enquadrar(); atualizarBotoes(); dica('Arraste para girar. Toque numa sala ou num marcador dourado.'); }); } : entrarRA;
    if (controles) controles.enabled = e.modo !== 'ra';
  }

  /* pinça e giro com dois dedos, só na RA */
  var dedos = {};
  function gestosRA() {
    var c = renderer.domElement, pinca = 0, ang = 0;
    c.addEventListener('touchstart', function (e) { if (e.touches.length === 2) { pinca = dist(e.touches); ang = angulo(e.touches); } }, { passive: true });
    c.addEventListener('touchmove', function (e) {
      if (!ra || ra.estado().modo !== 'ra' || e.touches.length !== 2) return;
      var d = dist(e.touches), a = angulo(e.touches);
      if (pinca > 0) ra.mudarEscala(d / pinca);
      ra.girar(a - ang); pinca = d; ang = a;
    }, { passive: true });
    function dist(t) { var x = t[0].clientX - t[1].clientX, y = t[0].clientY - t[1].clientY; return Math.sqrt(x * x + y * y); }
    function angulo(t) { return Math.atan2(t[1].clientY - t[0].clientY, t[1].clientX - t[0].clientX); }
  }

  function enquadrar() {
    if (!controles) return;
    controles.target.set(0.046, 0.02, -0.016); camera.position.set(-0.05, 0.8, 0.48); controles.update();
  }

  var antes = 0;
  function desenhar(tempo, quadroXR) {
    var t = tempo || performance.now(), dt = Math.min(0.05, (t - (antes || t)) / 1000); antes = t; relogio += dt;
    if (ra) ra.atualizar(dt, quadroXR);
    var est = ra && ra.estado();
    if (est && est.modo === 'ra') cena.background = null;
    else if (!cena.background) cena.background = new global.THREE.Color(0x0b1520);
    pinos.forEach(function (p, i) { var l = p.children[0]; l.position.y = Math.sin(relogio * 2.2 + i) * 0.22; l.rotation.y += dt * 1.2; });
    if (realce && relogio - realce.userData.nasceu > 2.4) { cena.remove(realce); realce = null; }
    if (controles && controles.enabled) controles.update();
    if (emPerto && perto) animarPerto(dt);
    if (emPeca && pecaG) animarPeca();
    renderer.render(cena, ra ? ra.cameraAtiva() : camera);
  }


  /* ---------------- de perto: o malote murcho (Cap. 1) ----------------
     Peça provisória, feita em código, até chegar o modelo do designer.
     O Arquivo Morto às 8h05: a lona no chão molhado, a ilha seca sob ela, a
     aba que a corrente de ar ergue, o vinco, o lacre com a grapa cortada, o
     fragmento (só quando a história chega nele) e a borda que se levanta. */
  function tela(w, h, pintar) {
    var c = document.createElement('canvas'); c.width = w; c.height = h; pintar(c.getContext('2d'), w, h);
    var t = new global.THREE.CanvasTexture(c); t.encoding = global.THREE.sRGBEncoding; t.anisotropy = 4; return t;
  }
  function ruido(g, w, h, n, cor, a) { for (var i = 0; i < n; i++) { g.fillStyle = cor; g.globalAlpha = Math.random() * a; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); } g.globalAlpha = 1; }
  function montarPerto() {
    var THREE = global.THREE, G = new THREE.Group(); G.name = 'perto-malote';
    var marca = function (o, k) { o.traverse(function (m) { m.userData.det = k; }); return o; };
    /* o piso: granilite molhado (brilha sob a lanterna) e a ilha seca */
    var tPiso = tela(512, 512, function (g, w, h) { g.fillStyle = '#3a4146'; g.fillRect(0, 0, w, h); ruido(g, w, h, 9000, '#8a949a', 0.35); g.strokeStyle = '#22282c'; g.lineWidth = 3; for (var i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * w / 4, 0); g.lineTo(i * w / 4, h); g.stroke(); g.beginPath(); g.moveTo(0, i * h / 4); g.lineTo(w, i * h / 4); g.stroke(); } });
    tPiso.wrapS = tPiso.wrapT = THREE.RepeatWrapping; tPiso.repeat.set(2, 2);
    var piso = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshStandardMaterial({ map: tPiso, roughness: 0.12, metalness: 0.15 }));
    piso.rotation.x = -Math.PI / 2; G.add(marca(piso, 'seco'));
    var ilha = new THREE.Mesh(new THREE.CircleGeometry(0.5, 48), new THREE.MeshStandardMaterial({ map: tPiso, roughness: 0.97, metalness: 0, color: 0xd9dcd6, polygonOffset: true, polygonOffsetFactor: -1 }));
    ilha.rotation.x = -Math.PI / 2; ilha.scale.set(0.7, 0.62, 1); ilha.position.set(0.01, 0.001, 0.01); G.add(marca(ilha, 'seco'));
    /* a lona */
    var tLona = tela(256, 256, function (g, w, h) { g.fillStyle = '#5b6355'; g.fillRect(0, 0, w, h); for (var y = 0; y < h; y += 3) { g.fillStyle = y % 6 ? '#545c4f' : '#636b5c'; g.fillRect(0, y, w, 1); } ruido(g, w, h, 3000, '#2f352c', 0.4); });
    tLona.wrapS = tLona.wrapT = THREE.RepeatWrapping; tLona.repeat.set(2, 2);
    var mLona = new THREE.MeshStandardMaterial({ map: tLona, roughness: 0.9, side: THREE.DoubleSide });
    /* um saco retangular vazio, achatado no chão: a lona assenta nas bordas e
       guarda dobras no meio */
    var W = 0.6, D = 0.5, gs = new THREE.PlaneGeometry(W, D, 60, 50); gs.rotateX(-Math.PI / 2);
    var pos = gs.attributes.position;
    for (var i = 0; i < pos.count; i++) {
      var x = pos.getX(i), z = pos.getZ(i), u = 2 * x / W, v = 2 * z / D;
      var f = Math.max(0, 1 - Math.pow(Math.abs(u), 6)) * Math.max(0, 1 - Math.pow(Math.abs(v), 6));
      var dobra = Math.sin(x * 26 + z * 9) * 0.35 + Math.sin(z * 31 - x * 12) * 0.25 + Math.sin((x + z) * 55) * 0.08;
      /* bordas levemente irregulares */
      var bx = x * (1 + 0.03 * Math.sin(z * 40)), bz = z * (1 + 0.03 * Math.sin(x * 33));
      pos.setXYZ(i, bx, 0.004 + f * (0.026 + 0.012 * dobra), bz);
    }
    gs.computeVertexNormals();
    var saco = new THREE.Mesh(gs, mLona); saco.rotation.y = 0.18; G.add(marca(saco, 'vazio'));
    var fecho = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.006, 0.012), new THREE.MeshStandardMaterial({ color: 0x23272a, roughness: 0.5, metalness: 0.6 }));
    fecho.position.set(-0.005, 0.012, -0.235); fecho.rotation.y = 0.18; G.add(marca(fecho, 'vazio'));
    /* a aba que respira */
    var abaPivo = new THREE.Group(); abaPivo.position.set(0.29, 0.01, 0.0); abaPivo.rotation.y = 0.18;
    var aba = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.08), mLona); aba.position.x = 0.06; aba.rotation.x = -Math.PI / 2;
    abaPivo.add(marca(aba, 'vazio')); G.add(abaPivo); G.userData.aba = abaPivo;
    /* o vinco, do lado oposto ao lacre: uma boca torta */
    var curva = new THREE.CatmullRomCurve3([new THREE.Vector3(0.07, 0.036, -0.08), new THREE.Vector3(0.12, 0.04, -0.12), new THREE.Vector3(0.17, 0.036, -0.15), new THREE.Vector3(0.23, 0.022, -0.2)]);
    var vinco = new THREE.Mesh(new THREE.TubeGeometry(curva, 24, 0.003, 6), new THREE.MeshStandardMaterial({ color: 0x14170f, roughness: 1, metalness: 0 }));
    G.add(marca(vinco, 'vinco'));
    var vincoAlvo = new THREE.Mesh(new THREE.TubeGeometry(curva, 12, 0.03, 6), new THREE.MeshBasicMaterial({ visible: false })); G.add(marca(vincoAlvo, 'vinco'));
    /* o lacre, com a grapa cortada */
    var lacre = new THREE.Group(); lacre.position.set(-0.24, 0.012, 0.19); lacre.rotation.y = 0.35;
    var tLacre = tela(256, 96, function (g, w, h) { g.fillStyle = '#c7782b'; g.fillRect(0, 0, w, h); ruido(g, w, h, 600, '#7a4512', 0.3); g.fillStyle = '#2a1606'; g.font = 'bold 52px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('ML-8842', w / 2, h / 2 + 3); });
    var corpo = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.012, 0.03), [0, 0, 1, 0, 0, 0].map(function (k) { return new THREE.MeshStandardMaterial(k ? { map: tLacre, roughness: 0.45 } : { color: 0xb5682a, roughness: 0.45 }); }));
    lacre.add(corpo);
    var mAco = new THREE.MeshStandardMaterial({ color: 0xb9c0c6, metalness: 0.9, roughness: 0.25 });
    [[0.012, 0.6], [-0.012, -0.5]].forEach(function (p) { var gr = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0022, 0.026, 8), mAco); gr.rotation.z = Math.PI / 2; gr.rotation.y = p[1]; gr.position.set(0.052, 0, p[0]); lacre.add(gr); });
    var lacreAlvo = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.04, 0.07), new THREE.MeshBasicMaterial({ visible: false })); lacre.add(lacreAlvo);
    G.add(marca(lacre, 'lacre'));
    /* o fragmento de papel térmico, na cola do lacre */
    var frag = new THREE.Mesh(new THREE.PlaneGeometry(0.016, 0.011), new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.6, side: THREE.DoubleSide }));
    frag.rotation.x = -Math.PI / 2; frag.position.set(-0.2, 0.02, 0.212); frag.visible = false;
    var fragAlvo = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshBasicMaterial({ visible: false })); fragAlvo.position.copy(frag.position);
    G.add(marca(frag, 'frag')); G.add(marca(fragAlvo, 'frag')); G.userData.frag = [frag, fragAlvo];
    /* a borda dobrada; embaixo, o envio extra */
    var bordaPivo = new THREE.Group(); bordaPivo.position.set(0.04, 0.004, 0.25); bordaPivo.rotation.y = 0.18;
    var borda = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.05), mLona); borda.rotation.x = -Math.PI / 2; borda.position.z = -0.025;
    bordaPivo.add(borda); G.add(marca(bordaPivo, 'borda')); G.userData.borda = bordaPivo;
    var envio = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.003, 0.03), new THREE.MeshStandardMaterial({ color: 0xefc878, emissive: 0x6b4d10, emissiveIntensity: 0.6, metalness: 0.4, roughness: 0.3 }));
    envio.position.set(0.05, 0.003, 0.235); envio.rotation.y = 0.18; G.add(marca(envio, 'borda'));
    var bordaAlvo2 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.08), new THREE.MeshBasicMaterial({ visible: false })); bordaAlvo2.position.set(0.04, 0.02, 0.25); G.add(marca(bordaAlvo2, 'borda'));
    /* o canto do Arquivo: parede com infiltração, estante, cesto, porta entreaberta */
    var tParede = tela(512, 256, function (g, w, h) { g.fillStyle = '#c9c6bd'; g.fillRect(0, 0, w, h); ruido(g, w, h, 4000, '#8e8b82', 0.25); var r = g.createRadialGradient(70, h, 10, 70, h, 150); r.addColorStop(0, 'rgba(92,84,60,.75)'); r.addColorStop(1, 'rgba(92,84,60,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); });
    var parede = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.6), new THREE.MeshStandardMaterial({ map: tParede, roughness: 0.95 })); parede.position.set(0, 0.3, -0.62); G.add(parede);
    var mMetal = new THREE.MeshStandardMaterial({ color: 0x6d757b, metalness: 0.5, roughness: 0.5 });
    var estante = new THREE.Group(); estante.position.set(0.42, 0, -0.5);
    [0.02, 0.16, 0.3, 0.44].forEach(function (y) { var pr = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.008, 0.18), mMetal); pr.position.y = y; estante.add(pr); });
    [[-0.2, -0.09], [0.2, -0.09], [-0.2, 0.09], [0.2, 0.09]].forEach(function (q) { var m = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.46, 0.01), mMetal); m.position.set(q[0], 0.23, q[1]); estante.add(m); });
    var mCaixa = new THREE.MeshStandardMaterial({ color: 0x8c7b5d, roughness: 0.9 });
    [[-0.12, 0.05], [0, 0.05], [0.12, 0.05], [-0.12, 0.19], [0.12, 0.19], [-0.06, 0.33], [0.08, 0.33]].forEach(function (q) { var c = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.09, 0.15), mCaixa); c.position.set(q[0], q[1] + 0.04, 0); estante.add(c); });
    G.add(estante);
    var cesto = new THREE.Group(); cesto.position.set(-0.47, 0, -0.38);
    cesto.add(new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.15, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0x4f565b, metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide })));
    cesto.children[0].position.y = 0.075;
    var tampa = new THREE.Mesh(new THREE.CylinderGeometry(0.069, 0.069, 0.01, 24), new THREE.MeshStandardMaterial({ color: 0x8d969c, metalness: 0.8, roughness: 0.3 }));
    tampa.position.set(0.006, 0.156, 0); tampa.rotation.z = 0.11; cesto.add(tampa); G.add(cesto);
    var batente = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.6, 0.03), mMetal); batente.position.set(-0.72, 0.3, 0.1); G.add(batente);
    var porta = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.58, 0.32), new THREE.MeshStandardMaterial({ color: 0x59636a, metalness: 0.4, roughness: 0.5 }));
    porta.geometry.translate(0, 0.29, 0.16); porta.position.set(-0.72, 0, 0.12); porta.rotation.y = -0.5; G.add(porta);
    var balde = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.1, 20), new THREE.MeshStandardMaterial({ color: 0x2f6fae, roughness: 0.6 })); balde.position.set(-0.58, 0.05, 0.42); G.add(balde);
    G.visible = false;
    return G;
  }
  /* o malote do designer: cada parte ganha o seu detalhe; a aba e a borda ganham
     dobradiça; o fragmento e o lacre, que são pequenos, ganham um alvo maior. */
  function montarPertoGLB(cena3d) {
    var THREE = global.THREE, G = new THREE.Group(); G.name = 'perto-malote'; G.add(cena3d);
    var achar = function (n) { return cena3d.getObjectByName(n); };
    var marca = function (o, k) { if (o) o.traverse(function (m) { m.userData.det = k; }); return o; };
    cena3d.traverse(function (o) { if (o.isMesh) { o.userData.det = /^(chao-umido|ilha-seca)$/.test(o.name) ? 'seco' : (o.userData.det || null); } });
    marca(achar('saco'), 'vazio');
    marca(achar('chao-umido'), 'seco'); marca(achar('ilha-seca'), 'seco');
    /* o vinco: a zona do designer é transparente; serve de alvo */
    var vz = achar('vinco'); if (vz) { marca(vz, 'vinco'); vz.traverse(function (m) { if (m.material) { m.material.transparent = true; m.material.opacity = 0; m.material.depthWrite = false; } }); }
    var lac = achar('lacre'); marca(lac, 'lacre');
    var fr = achar('fragmento'); marca(fr, 'frag');
    var env = achar('envio-extra'); marca(env, 'borda');
    var bo = achar('borda'); marca(bo, 'borda');
    function alvo(obj, raio, k) { if (!obj) return null; var b = new THREE.Box3().setFromObject(obj), c = b.getCenter(new THREE.Vector3());
      var m = new THREE.Mesh(new THREE.SphereGeometry(raio, 10, 8), new THREE.MeshBasicMaterial({ visible: false })); m.position.copy(c); m.userData.det = k; G.add(m); return m; }
    cena3d.updateMatrixWorld(true);
    alvo(lac, 0.06, 'lacre');
    var fa = alvo(fr, 0.03, 'frag');
    /* o vinco fica rente à lona: um alvo em caixa, um pouco acima dela */
    if (vz) { var bv = new THREE.Box3().setFromObject(vz), cv = bv.getCenter(new THREE.Vector3()), sv = bv.getSize(new THREE.Vector3());
      var mv = new THREE.Mesh(new THREE.BoxGeometry(sv.x, 0.14, sv.z), new THREE.MeshBasicMaterial({ visible: false })); mv.position.set(cv.x, 0.07, cv.z); mv.userData.det = 'vinco'; G.add(mv); }
    alvo(env, 0.07, 'borda');
    /* dobradiça da aba: a beira que encosta no saco (o menor x) */
    var abaM = achar('saco_aba'), abaPivo = new THREE.Group();
    if (abaM) { var ba = new THREE.Box3().setFromObject(abaM), par = abaM.parent; abaPivo.position.set(ba.min.x, ba.min.y, (ba.min.z + ba.max.z) / 2); par.add(abaPivo); abaPivo.updateMatrixWorld(true); abaPivo.attach(abaM); marca(abaM, 'vazio'); }
    G.userData.aba = abaPivo; G.userData.abaBase = 0;
    /* a borda já tem a dobradiça na origem (a beira do saco) */
    G.userData.borda = bo || new THREE.Group(); G.userData.bordaSinal = 1;
    G.userData.frag = [fr, fa].filter(Boolean);
    cena3d.traverse(function (o) { if (o.isMesh && o.material) { o.castShadow = false; if (o.material.name === 'vidro_fosco') o.material.depthWrite = false; } });
    G.visible = false;
    return G;
  }
  function prepararMalote() {
    if (!malotePronto) malotePronto = carregarGLB(MALOTE_PERTO).then(function (g) { return montarPertoGLB(g.scene); }, function () { return montarPerto(); });
    return malotePronto;
  }
  function entrarPerto() {
    if (!perto) {
      cartao('O MALOTE', 'Chegando perto…');
      prepararMalote().then(function (G) { if (!perto) { perto = G; raiz.add(perto); } entrarPerto(); });
      return;
    }
    emPerto = true; bordaAlvo = 0;
    modelo.visible = false; perto.visible = true;
    var f = !!(opcoes.malote && opcoes.malote.fragmento && opcoes.malote.fragmento());
    perto.userData.frag.forEach(function (o) { o.visible = f; });
    LUZ.hemi.intensity = 0.1; LUZ.ceu.intensity = 0.06; LUZ.fria.intensity = 0.03; LUZ.amb.intensity = 0.04; LUZ.lanterna.intensity = 4.2;
    if (realce) { cena.remove(realce); realce = null; }
    el.querySelector('#maqAndar').hidden = true;
    el.querySelector('.maq-tit b').textContent = 'O malote murcho · Arquivo Morto';
    dica('A lanterna segue o seu olhar. Gire em volta e toque nos detalhes.');
    cartao('O MALOTE', 'Toque num detalhe do saco para examiná-lo. Com a luz certa, o lacre se deixa ler.');
    if (controles && controles.enabled) {
      /* enquadra ~0,9 de largura, qualquer que seja a proporção da tela */
      var hf = 2 * Math.atan(Math.tan(camera.fov * Math.PI / 360) * camera.aspect), dist = Math.min(2.3, 0.53 / Math.tan(hf / 2));
      var dir = new global.THREE.Vector3(0.06, 0.78, 0.62).normalize();
      controles.minDistance = 0.12; controles.target.set(0.07, 0.02, 0.03); camera.position.copy(dir.multiplyScalar(dist)); controles.update();
    }
  }
  function sairPerto(silencioso) {
    emPerto = false;
    if (perto) perto.visible = false;
    modelo.visible = true;
    LUZ.hemi.intensity = 0.95; LUZ.ceu.intensity = 0.9; LUZ.fria.intensity = 0.35; LUZ.amb.intensity = 0.18; LUZ.lanterna.intensity = 0;
    if (silencioso) return;
    el.querySelector('#maqAndar').hidden = false;
    el.querySelector('.maq-tit b').textContent = 'A maquete · Agência 0688';
    dica('Arraste para girar. Toque numa sala ou num marcador dourado.');
    cartao('A MAQUETE', 'Toque numa sala para ver o que há nela. Os marcadores dourados são as peças do caso.');
    if (controles) { controles.minDistance = 0.18; enquadrar(); }
  }
  function tocarPerto(ray) {
    var alvos = []; perto.traverse(function (o) { if (o.isMesh && o.userData.det && visivel(o)) alvos.push(o); });
    var h = ray.intersectObjects(alvos, false);
    if (!h.length) return;
    var ordem = ['frag', 'lacre', 'borda', 'vinco', 'vazio', 'seco'], k = h[0].object.userData.det;
    /* entre alvos sobrepostos perto do dedo, o detalhe pequeno ganha */
    h.forEach(function (x) { if (x.distance - h[0].distance < 0.04 && ordem.indexOf(x.object.userData.det) < ordem.indexOf(k)) k = x.object.userData.det; });
    if (k === 'borda') bordaAlvo = 1;
    var d = opcoes.malote && opcoes.malote.detalhe ? opcoes.malote.detalhe(k) : null;
    if (d) cartao(d[0], d[1]);
  }
  function animarPerto(dt) {
    var THREE = global.THREE;
    var aba = perto.userData.aba, ab0 = perto.userData.abaBase === undefined ? 0.15 : perto.userData.abaBase, amp = perto.userData.abaBase === undefined ? 0.45 : 0.22;
    aba.rotation.z = ab0 + Math.pow(Math.sin(relogio * 1.1), 2) * amp;
    var b = perto.userData.borda, bs = perto.userData.bordaSinal || 1; b.rotation.x += ((bordaAlvo ? -1.1 * bs : 0) - b.rotation.x) * Math.min(1, dt * 4);
    var cam = ra ? ra.cameraAtiva() : camera, p = new THREE.Vector3(), d = new THREE.Vector3();
    cam.getWorldPosition(p); cam.getWorldDirection(d);
    LUZ.lanterna.position.copy(p).addScaledVector(d, -0.02);
    LUZ.lanterna.target.position.copy(p).addScaledVector(d, 1);
    LUZ.lanterna.target.updateMatrixWorld();
    var f = !!(opcoes.malote && opcoes.malote.fragmento && opcoes.malote.fragmento());
    if (perto.userData.frag[0].visible !== f) perto.userData.frag.forEach(function (o) { o.visible = f; });
  }

  /* ---------------- de perto: as peças dos Capítulos 2 a 7 ----------------
     Provisórias, feitas em código, até chegarem os modelos do designer. Cada
     peça tem um objeto central (o rádio, a impressora, o rack, a balança, o
     carimbo, a escrivaninha) e, na mesa à frente, os cartões que a história
     vai liberando. Os textos, o inventário, os envios e as regras (a ordem
     dos cartões da noite, as gavetas) são os do jogo: o toque aqui aciona o
     mesmo detalhe do desenho 2D (opcoes.pecas.examinar). */
  var pecaG = null, pecaId = null, emPeca = false, pecaPisca = [];
  function papel(rot, extra, cor) {
    return tela(384, 210, function (g, w, h) {
      g.fillStyle = cor || '#efe8d8'; g.fillRect(0, 0, w, h); ruido(g, w, h, 900, '#b9ae94', 0.25);
      g.strokeStyle = '#c9bc9c'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6);
      g.fillStyle = '#2a2318'; g.textAlign = 'center'; g.textBaseline = 'middle';
      var t = (rot || '').toUpperCase(), tam = 34; g.font = 'bold ' + tam + 'px Georgia, serif';
      while (g.measureText(t).width > w - 30 && tam > 16) { tam -= 2; g.font = 'bold ' + tam + 'px Georgia, serif'; }
      var pal = t.split(' '), linhas = [], l = '';
      pal.forEach(function (p) { if (g.measureText((l + ' ' + p).trim()).width > w - 30) { linhas.push(l.trim()); l = p; } else l += ' ' + p; }); linhas.push(l.trim());
      linhas.forEach(function (x, i) { g.fillText(x, w / 2, h / 2 + (i - (linhas.length - 1) / 2) * (tam + 6) - (extra ? 14 : 0)); });
      if (extra) { g.fillStyle = '#8a5a12'; g.font = 'bold 30px Georgia, serif'; g.fillText(extra, w / 2, h - 34); }
    });
  }
  function rotulo(txt, w, h, fundo, cor, tam) {
    return tela(w, h, function (g) { g.fillStyle = fundo; g.fillRect(0, 0, w, h); g.fillStyle = cor; g.font = 'bold ' + tam + 'px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
      String(txt).split('\n').forEach(function (l, i, a) { g.fillText(l, w / 2, h / 2 + (i - (a.length - 1) / 2) * (tam + 4)); }); });
  }
  function caixa(w, h, d, mat) { return new global.THREE.Mesh(new global.THREE.BoxGeometry(w, h, d), mat); }
  function std(cor, r, m) { return new global.THREE.MeshStandardMaterial({ color: cor, roughness: r == null ? 0.6 : r, metalness: m || 0 }); }

  /* os objetos centrais: cada parte leva o nome do detalhe do jogo */
  var CENTRAL = {
    c2: function (G, T) { /* o rádio reserva, sobre o aparador da Gerência */
      var r = new T.Group(); r.position.set(-0.1, 0, -0.1); r.rotation.y = 0.25;
      var corpo = caixa(0.13, 0.045, 0.3, std(0x22272b, 0.5, 0.2)); corpo.position.y = 0.0225; r.add(det(corpo, 'carcaca'));
      var tela_ = new T.Mesh(new T.PlaneGeometry(0.1, 0.07), new T.MeshBasicMaterial({ map: rotulo('▁▃▁▃▁▃▇▁\n3 + 1', 256, 180, '#0f2a1d', '#7ff0b0', 40), toneMapped: false }));
      tela_.rotation.x = -Math.PI / 2; tela_.position.set(0, 0.0455, -0.07); r.add(det(tela_, 'espectro'));
      var grade = new T.Mesh(new T.CircleGeometry(0.042, 24), new T.MeshBasicMaterial({ map: rotulo('▶', 128, 128, '#15191c', '#efc878', 70) }));
      grade.rotation.x = -Math.PI / 2; grade.position.set(0, 0.0455, 0.06); r.add(det(grade, 'gravacao'));
      var botao = caixa(0.012, 0.02, 0.045, std(0x6b4e8a, 0.4)); botao.position.set(0.071, 0.024, -0.02); r.add(det(botao, 'botao'));
      var ant = new T.Mesh(new T.CylinderGeometry(0.008, 0.01, 0.13, 10), std(0x111315, 0.4)); ant.rotation.x = Math.PI / 2; ant.position.set(0.035, 0.02, -0.215); r.add(det(ant, 'antena'));
      var elast = new T.Mesh(new T.TorusGeometry(0.012, 0.0035, 6, 16), std(0xc0392b, 0.7)); elast.position.set(0.035, 0.02, -0.165); r.add(det(elast, 'antena'));
      G.add(r);
      var doca = caixa(0.17, 0.05, 0.12, std(0x2e3439, 0.5)); doca.position.set(0.3, 0.025, -0.1); G.add(det(doca, 'carregador'));
      var vao = caixa(0.14, 0.012, 0.06, std(0x0b0d0f, 0.9)); vao.position.set(0.3, 0.052, -0.1); G.add(det(vao, 'carregador'));
      return ['carcaca', 'espectro', 'gravacao', 'botao', 'antena', 'carregador'];
    },
    c3: function (G, T) { /* a impressora térmica e o estabilizador, no aparador */
      var imp = caixa(0.22, 0.1, 0.2, std(0xd9d6cf, 0.5)); imp.position.set(-0.12, 0.05, -0.12); G.add(det(imp, 'impressora'));
      var rolo = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 0.12, 20), std(0xf4f1ea, 0.8)); rolo.rotation.z = Math.PI / 2; rolo.position.set(-0.12, 0.12, -0.15); G.add(det(rolo, 'impressora'));
      var et1 = new T.Mesh(new T.PlaneGeometry(0.09, 0.05), new T.MeshStandardMaterial({ map: rotulo('ML-8842', 256, 140, '#f6f3ea', '#1d1a14', 44), roughness: 0.7 }));
      et1.rotation.x = -Math.PI / 2; et1.position.set(0.08, 0.002, 0.02); et1.rotation.z = 0.15; G.add(det(et1, 'etiqueta'));
      var et2 = new T.Mesh(new T.PlaneGeometry(0.09, 0.05), new T.MeshStandardMaterial({ map: rotulo('ML-8847', 256, 140, '#f6f3ea', '#1d1a14', 44), roughness: 0.7 }));
      et2.rotation.x = -Math.PI / 2; et2.position.set(0.19, 0.002, -0.01); et2.rotation.z = -0.1; G.add(det(et2, 'etiqueta'));
      var frag = new T.Mesh(new T.PlaneGeometry(0.018, 0.012), std(0xffffff, 0.6)); frag.rotation.x = -Math.PI / 2; frag.position.set(-0.12, 0.156, -0.15); G.add(det(frag, 'sobrepor'));
      var est = caixa(0.1, 0.07, 0.1, std(0x26292c, 0.5)); est.position.set(0.25, 0.035, -0.17); G.add(det(est, 'estabilizador'));
      var led = new T.Mesh(new T.SphereGeometry(0.008, 10, 8), new T.MeshBasicMaterial({ color: 0x50ff8a, toneMapped: false })); led.position.set(0.25, 0.06, -0.118); G.add(det(led, 'estabilizador'));
      pecaPisca.push(led);
      return ['impressora', 'etiqueta', 'sobrepor', 'estabilizador'];
    },
    c4: function (G, T) { /* o rack: a grade quente do exaustor, o cabo derretido, o disjuntor */
      var rack = caixa(0.32, 0.36, 0.2, std(0x2a2f33, 0.45, 0.5)); rack.position.set(-0.1, 0.18, -0.25); G.add(rack);
      var grade = new T.Mesh(new T.PlaneGeometry(0.22, 0.1), new T.MeshBasicMaterial({ map: rotulo('|||||||||||||', 256, 120, '#3b2a1c', '#ff8a3a', 60) })); grade.position.set(-0.1, 0.28, -0.149); G.add(det(grade, 'cabo'));
      var c = new T.CatmullRomCurve3([new T.Vector3(-0.22, 0.02, 0.05), new T.Vector3(-0.15, 0.03, -0.05), new T.Vector3(-0.12, 0.2, -0.14), new T.Vector3(-0.08, 0.27, -0.145)]);
      var cabo = new T.Mesh(new T.TubeGeometry(c, 30, 0.008, 8), std(0x0c0c0c, 0.5)); G.add(det(cabo, 'cabo'));
      var derr = new T.Mesh(new T.SphereGeometry(0.016, 10, 8), std(0x5a2a10, 0.9)); derr.position.set(-0.085, 0.265, -0.143); derr.scale.set(1.4, 0.8, 0.8); G.add(det(derr, 'cabo'));
      var disj = caixa(0.1, 0.14, 0.05, std(0x8a8f93, 0.5, 0.3)); disj.position.set(0.22, 0.12, -0.25); G.add(det(disj, 'disjuntor'));
      var alav = caixa(0.02, 0.04, 0.02, std(0x1d1f21, 0.5)); alav.position.set(0.22, 0.1, -0.22); G.add(det(alav, 'disjuntor'));
      return ['cabo', 'disjuntor'];
    },
    c5: function (G, T) { /* a balança embarcada do carro-forte */
      var base = caixa(0.42, 0.04, 0.3, std(0x50565b, 0.5, 0.5)); base.position.set(-0.05, 0.02, -0.15); G.add(det(base, 'balanca'));
      var visor = new T.Mesh(new T.PlaneGeometry(0.16, 0.07), new T.MeshBasicMaterial({ map: rotulo('7,0 kg', 256, 112, '#0e1a12', '#7ff0b0', 54) }));
      visor.position.set(-0.05, 0.1, -0.31); visor.material.toneMapped = false; G.add(det(visor, 'balanca'));
      var poste = caixa(0.03, 0.12, 0.03, std(0x3a3f43, 0.5, 0.5)); poste.position.set(-0.05, 0.06, -0.33); G.add(det(poste, 'balanca'));
      var prato = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.012, 32), std(0xb9c0c6, 0.3, 0.9)); prato.position.set(-0.05, 0.046, -0.13); G.add(det(prato, 'prato'));
      return ['balanca', 'prato'];
    },
    c6: function (G, T) { /* o Guichê 2: o carimbo */
      var cab = new T.Mesh(new T.CylinderGeometry(0.025, 0.03, 0.07, 16), std(0x2b2b2e, 0.4)); cab.position.set(0.28, 0.075, -0.2); G.add(det(cab, 'carimbo'));
      var pe = caixa(0.07, 0.03, 0.05, std(0x4b3a2a, 0.6)); pe.position.set(0.28, 0.025, -0.2); G.add(det(pe, 'carimbo'));
      return ['carimbo'];
    },
    c7: function (G, T, lista) { /* a escrivaninha: uma gaveta por função, e o puxador solto */
      var gav = lista.filter(function (e) { return e.k.indexOf('g_') === 0; });
      var cols = 3, rows = Math.ceil(gav.length / cols), Lw = 0.6, Lh = 0.05 * rows + 0.02;
      var movel = caixa(Lw + 0.03, Lh, 0.2, std(0x6b4a2f, 0.7)); movel.position.set(0, Lh / 2, -0.32); G.add(movel);
      gav.forEach(function (e, i) {
        var x = -Lw / 2 + 0.1 + (i % cols) * 0.2, y = Lh - 0.035 - Math.floor(i / cols) * 0.05;
        var f = new T.Mesh(new T.PlaneGeometry(0.19, 0.044), new T.MeshStandardMaterial({ map: rotulo(e.label, 256, 60, '#7d5838', '#f3e3bb', 22), roughness: 0.7 }));
        f.position.set(x, y, -0.219); G.add(det(f, e.k));
      });
      var pux = new T.Mesh(new T.TorusGeometry(0.015, 0.005, 8, 16, Math.PI), std(0xc9a65a, 0.3, 0.9)); pux.rotation.x = -Math.PI / 2; pux.position.set(0.36, 0.005, -0.05); G.add(det(pux, 'puxador'));
      return gav.map(function (e) { return e.k; }).concat(['puxador']);
    }
  };
  function det(m, k) { m.traverse(function (o) { o.userData.det = k; }); return m; }

  function montarPeca(id) {
    var T = global.THREE, G = new T.Group(); G.name = 'perto-' + id;
    var tMad = tela(512, 512, function (g, w, h) { g.fillStyle = '#5d4630'; g.fillRect(0, 0, w, h); for (var y = 0; y < h; y += 4) { g.fillStyle = 'rgba(40,26,14,' + (0.1 + Math.random() * 0.15) + ')'; g.fillRect(0, y, w, 2); } });
    var mesa = new T.Mesh(new T.PlaneGeometry(1.3, 1.0), new T.MeshStandardMaterial({ map: tMad, roughness: 0.55 })); mesa.rotation.x = -Math.PI / 2; G.add(mesa);
    var fundo = new T.Mesh(new T.PlaneGeometry(1.3, 0.55), std(0x3b4248, 0.95)); fundo.position.set(0, 0.27, -0.5); G.add(fundo);
    G.userData.cartoes = new T.Group(); G.add(G.userData.cartoes);
    G.userData.chaves = CENTRAL[id](G, T, opcoes.pecas.listar(id));
    G.visible = false;
    return G;
  }
  /* os cartões da mesa: tudo o que a peça mostra além do objeto central */
  function atualizarPeca() {
    var T = global.THREE, lista = opcoes.pecas.listar(pecaId), presentes = {};
    lista.forEach(function (e) { presentes[e.k] = e; });
    pecaG.traverse(function (o) { if (o.userData.det && o.parent !== pecaG.userData.cartoes && pecaG.userData.chaves.indexOf(o.userData.det) >= 0) o.visible = !!presentes[o.userData.det]; });
    var C = pecaG.userData.cartoes; while (C.children.length) C.remove(C.children[0]);
    var resto = lista.filter(function (e) { return pecaG.userData.chaves.indexOf(e.k) < 0; });
    var cols = resto.length > 6 ? 4 : 3, cw = cols === 4 ? 0.19 : 0.25, ch = cw * 0.56;
    resto.forEach(function (e, i) {
      var x = -((cols - 1) * (cw + 0.02)) / 2 + (i % cols) * (cw + 0.02), z = 0.02 + Math.floor(i / cols) * (ch + 0.03);
      var extra = /\dº/.test(e.extra) ? e.extra : '';
      var c = new T.Mesh(new T.PlaneGeometry(cw, ch), new T.MeshStandardMaterial({ map: papel(e.label, extra), roughness: 0.85 }));
      c.rotation.x = -Math.PI / 2; c.rotation.z = (Math.sin(i * 7.3) * 0.04); c.position.set(x, 0.002 + i * 0.0002, z);
      C.add(det(c, e.k));
    });
  }
  function entrarPeca(id) {
    if (!opcoes.pecas || !CENTRAL[id]) { if (opcoes.aoAbrirItem) opcoes.aoAbrirItem(id); return; }
    if (pecaG) { raiz.remove(pecaG); pecaG = null; pecaPisca = []; }
    pecaId = id; pecaG = montarPeca(id); raiz.add(pecaG);
    emPeca = true; modelo.visible = false; pecaG.visible = true;
    atualizarPeca();
    if (realce) { cena.remove(realce); realce = null; }
    LUZ.hemi.intensity = 0.7; LUZ.ceu.intensity = 0.8;
    el.querySelector('#maqAndar').hidden = true;
    var D = ITENS[id]; el.querySelector('.maq-tit b').textContent = D.nome;
    dica('Gire em volta e toque nos detalhes. O que você examinar vai para o inventário.');
    cartao(D.nome.toUpperCase(), opcoes.pecas.aviso ? opcoes.pecas.aviso(id) : 'Toque num detalhe para examiná-lo.');
    if (controles && controles.enabled) {
      var hf = 2 * Math.atan(Math.tan(camera.fov * Math.PI / 360) * camera.aspect), dist = Math.min(2.3, 0.42 / Math.tan(hf / 2));
      var dir = new global.THREE.Vector3(0, 0.82, 0.58).normalize();
      controles.minDistance = 0.12; controles.target.set(0, 0.03, -0.05); camera.position.copy(dir.multiplyScalar(dist)).add(new global.THREE.Vector3(0, 0, -0.05)); controles.update();
    }
  }
  function sairPeca(silencioso) {
    emPeca = false;
    if (pecaG) pecaG.visible = false;
    modelo.visible = true;
    LUZ.hemi.intensity = 0.95; LUZ.ceu.intensity = 0.9;
    if (silencioso) return;
    el.querySelector('#maqAndar').hidden = false;
    el.querySelector('.maq-tit b').textContent = 'A maquete · Agência 0688';
    dica('Arraste para girar. Toque numa sala ou num marcador dourado.');
    cartao('A MAQUETE', 'Toque numa sala para ver o que há nela. Os marcadores dourados são as peças do caso.');
    if (controles) { controles.minDistance = 0.18; enquadrar(); }
  }
  function tocarPeca(ray) {
    var alvos = []; pecaG.traverse(function (o) { if (o.isMesh && o.userData.det && visivel(o)) alvos.push(o); });
    var h = ray.intersectObjects(alvos, false);
    if (!h.length) return;
    var k = h[0].object.userData.det, d = opcoes.pecas.examinar(pecaId, k);
    if (d) cartao(d[0], d[1]);
    atualizarPeca();
  }
  function animarPeca() {
    /* o estabilizador da impressora: três pulsações rápidas e uma lenta */
    var t = relogio % 2.4, on = (t < 0.15) || (t > 0.3 && t < 0.45) || (t > 0.6 && t < 0.75) || (t > 1.1 && t < 1.7);
    pecaPisca.forEach(function (l) { l.visible = on; });
  }

  /* ---------------- abrir e fechar ---------------- */
  function abrir(o) {
    opcoes = o || {};
    if (!el) criarTela();
    el.hidden = false; ativo = true;
    el.querySelector('#maqCarregando').hidden = false;
    cartao('A MAQUETE', opcoes.boasVindas || 'Toque numa sala para ver o que há nela. Os marcadores dourados são as peças do caso.');
    return carregarTudo().then(function () {
      el.querySelector('#maqCarregando').hidden = true;
      if (!gestosRA.feito) { gestosRA(); gestosRA.feito = true; }
      aplicarItens();
      redimensionar();
      renderer.setAnimationLoop(desenhar);
    }).catch(function (e) {
      el.querySelector('#maqCarregando').textContent = 'A maquete não abriu: ' + ((e && e.message) || e);
      throw e;
    });
  }
  function fechar() {
    ativo = false;
    if (emPerto) sairPerto(true);
    if (emPeca) sairPeca(true);
    var sai = ra && ra.estado().modo === 'ra' ? ra.sair() : Promise.resolve();
    return sai.then(function () {
      if (renderer) renderer.setAnimationLoop(null);
      if (el) el.hidden = true;
      if (opcoes.aoFechar) opcoes.aoFechar();
    });
  }

  global.CFIMaquete = { abrir: abrir, fechar: fechar, aberta: function () { return ativo; }, ITENS: ITENS,
    _teste: function () { return { pinos: pinos.map(function (p) { var v = p.getWorldPosition(new global.THREE.Vector3()).project(ra ? ra.cameraAtiva() : camera); return { id: p.userData.item, x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight }; }), itens: opcoes.itens }; },
    _perto: function () { entrarPerto(); }, _hitPerto: function (x, y, z) { var T = global.THREE, v = new T.Vector3(x, y, z); perto.localToWorld(v); var o = camera.position.clone(), r = new T.Raycaster(o, v.clone().sub(o).normalize()), todos = []; perto.traverse(function (m) { if (m.isMesh) todos.push(m); }); return r.intersectObjects(todos, false).slice(0, 6).map(function (h) { return h.object.name + ':' + h.object.userData.det + ':' + h.distance.toFixed(3) + ':' + (h.object.material && h.object.material.side); }); }, _peca: function (id) { entrarPeca(id); }, _projetarPeca: function (x, y, z) { var v = pecaG.localToWorld(new global.THREE.Vector3(x, y, z)).project(camera); return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight }; }, _vis: function (n) { var o = modelo.getObjectByName(n); return o ? o.visible : null; }, _camera: function (a, b) { camera.position.fromArray(a); controles.target.fromArray(b); controles.update(); }, _dbg: function () { var b = new global.THREE.Box3().setFromObject(perto); return { cam: camera.position.toArray(), alvo: controles.target.toArray(), raizEsc: raiz.scale.x, raizPos: raiz.position.toArray(), bmin: b.min.toArray(), bmax: b.max.toArray() }; }, _projetarPerto: function (x, y, z) { var v = perto.localToWorld(new global.THREE.Vector3(x, y, z)).project(camera); return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight }; },
    _projetar: function (x, y, z) { var v = modelo.localToWorld(new global.THREE.Vector3(x, y, z)).project(camera); return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight }; } };
})(window);
