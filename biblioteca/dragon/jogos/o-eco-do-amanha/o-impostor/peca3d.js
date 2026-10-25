/* As peças de RA dos capítulos em 3D (11/10/2026): os GLB do designer (modelos/rec-*.glb)
   no lugar dos desenhos 2D, com a MESMA mecânica: cada detalhe que se toca no esquema 2D
   é um nó do modelo; tocar no nó faz o mesmo que tocar no desenho (examinar).

   · O motor (motor2.js) diz, por peça e por etapa: que nós respondem a que detalhe
     (alvos), como as partes se mexem (pose: gaveta sai, porta abre, ponteiro gira),
     o que se escreve nas áreas de texto (textos) e de onde se olha (vista).
   · Os números da partida (atraso, lote, peso, horários) são escritos pelo jogo nas
     áreas lisas do modelo (*_area_texto): o modelo nunca traz a resposta pintada.
   · Na mesa em RA, pelo mesmo motor da maquete (lib/ac-ra.js e ac-maquete-ra.js).
   · Se o WebGL ou o GLB falhar, o motor volta ao esquema 2D (o SVG de sempre).

   Uso: VCPeca3D.abrir(host, cfg) → Promise; VCPeca3D.atualizar(st); VCPeca3D.fechar().
   cfg = { glb, nome, alvos(st) → {det: [nós]}, pose(st) → {nó: {p:[dx,dy,dz], r:[rx,ry,rz], v}},
           textos(st) → {nó: {linhas, fundo, cor, tam, desenho(g,w,h)}}, vista(st) → [[pos],[alvo]],
           vistos(st) → {det: true}, aoTocar(det), aoAviso(txt) } */
(function (global) {
  'use strict';
  var BASE = (function () { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^/]*$/, '') : ''; })();
  var LIB = BASE + 'lib/', SCRIPTS = [LIB + 'three.min.js', BASE + 'ra-textos-volume.js?v=volume-20261025-auditoria', LIB + 'GLTFLoader.js', LIB + 'OrbitControls.js', LIB + 'ac-ra.js', LIB + 'ac-maquete-ra.js'];
  var pronto = null, renderer, cena, camera, controles, raiz, ra = null, host = null, ui = null, cfg = null, st = null, vivo = false;
  var cache = {}, modelo = null, nos = {}, base = {}, atual = {}, areas = {}, marcados = [], anim = null, relogio = 0, tocando = null, ultimaVista = '';

  function suporta() { try { var c = document.createElement('canvas'); return !!(global.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; } }
  function carregarScript(src) { return new Promise(function (ok, falha) { if (document.querySelector('script[data-maq="' + src + '"]')) return ok(); var s = document.createElement('script'); s.src = src; s.async = false; s.setAttribute('data-maq', src); s.onload = function () { ok(); }; s.onerror = function () { falha(Error('Não carregou ' + src)); }; document.head.appendChild(s); }); }
  function carregar() {
    if (pronto) return pronto; if (!suporta()) return Promise.reject(Error('Sem WebGL'));
    var c = Promise.resolve();
    SCRIPTS.forEach(function (s) { c = c.then(function () { if (/three\.min/.test(s) && global.THREE) return; if (/GLTFLoader/.test(s) && global.THREE && global.THREE.GLTFLoader) return; if (/OrbitControls/.test(s) && global.THREE && global.THREE.OrbitControls) return; if (/ac-ra\.js/.test(s) && global.ACRA) return; if (/ac-maquete-ra/.test(s) && global.ACMaquetteRA) return; return carregarScript(s); }); });
    pronto = c.then(montarCena); pronto.catch(function () { pronto = null; }); return pronto;
  }

  /* ── a cena (uma só, reaproveitada pelas oito peças) ── */
  function montarCena() {
    var THREE = global.THREE;
    cena = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, 1, 0.01, 30); cena.add(camera);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 1.8));
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; renderer.xr.enabled = true;
    renderer.domElement.className = 'peca3d-canvas';
    /* a noite da torre: luz de emergência quente de cima, o ciano frio do Echo de lado */
    cena.add(new THREE.HemisphereLight(0xe6eef5, 0x20180f, 0.85));
    var sol = new THREE.DirectionalLight(0xfff0dc, 1.0); sol.position.set(-1.0, 2.4, 1.8); cena.add(sol);
    var frio = new THREE.DirectionalLight(0x7fd6e2, 0.45); frio.position.set(1.6, 1.0, -0.8); cena.add(frio);
    var frente = new THREE.DirectionalLight(0xffffff, 0.35); frente.position.set(0, 0.8, 3); cena.add(frente);
    raiz = new THREE.Group(); raiz.name = 'raiz-peca'; cena.add(raiz);
    controles = new THREE.OrbitControls(camera, renderer.domElement); controles.enableDamping = true; controles.dampingFactor = 0.09; controles.enablePan = false; controles.minDistance = 0.15; controles.maxDistance = 6; controles.maxPolarAngle = Math.PI * 0.62;
    controles.addEventListener('start', function () { anim = null; });
    if (global.ACMaquetteRA) { try { ra = global.ACMaquetteRA.criar({ renderer: renderer, cena: cena, camera: camera, raiz: raiz, baseY: 0, aoMudar: botoesRA, desenhar: desenhar, aoTocar: function (x, y) { tocar(x, y); } }); } catch (e) { ra = null; } }
    var c = renderer.domElement;
    c.addEventListener('pointerdown', function (e) { tocando = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    c.addEventListener('pointerup', function (e) { if (!tocando) return; var dx = e.clientX - tocando.x, dy = e.clientY - tocando.y, dt = performance.now() - tocando.t; tocando = null; if (dx * dx + dy * dy > 100 || dt > 700) return; var est = ra && ra.estado(); if (est && est.modo === 'ra' && !est.posta) { pousar(); return; } tocar(e.clientX, e.clientY); });
    global.addEventListener('resize', redimensionar);
  }
  function redimensionar() { if (!renderer || !vivo) return; var w = global.innerWidth, h = global.innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }

  /* ── o modelo ── */
  function carregarGLB(url) {
    if (cache[url]) return cache[url];
    cache[url] = new Promise(function (ok, falha) {
      var L = new global.THREE.GLTFLoader(); if (global.MeshoptDecoder) L.setMeshoptDecoder(global.MeshoptDecoder);
      L.load(url, function (g) { ok(g.scene); }, undefined, function (e) { delete cache[url]; falha(Error('Não carregou ' + url + (e && e.message ? ': ' + e.message : ''))); });
    });
    return cache[url];
  }
  function preparar(cenaG) {
    var THREE = global.THREE;
    if (modelo) raiz.remove(modelo);
    modelo = cenaG; raiz.add(modelo); nos = {}; base = {}; atual = {}; areas = {}; marcados = [];
    modelo.traverse(function (o) {
      if (o.name && !nos[o.name]) nos[o.name] = o;
      if (!o.userData.base3d) o.userData.base3d = { p: o.position.clone(), r: o.rotation.clone(), v: o.visible };
      o.position.copy(o.userData.base3d.p); o.rotation.copy(o.userData.base3d.r); o.visible = o.userData.base3d.v;
      if (o.isMesh) {
        o.frustumCulled = false;
        var m = o.material;
        /* emissive_strength não existe no three r128: aplica à mão (como na maquete) */
        if (m && m.userData && m.userData.gltfExtensions && m.userData.gltfExtensions.KHR_materials_emissive_strength && !o.userData.forca) { o.userData.forca = true; m.emissiveIntensity = m.userData.gltfExtensions.KHR_materials_emissive_strength.emissiveStrength || 1; }
      }
    });
    modelo.traverse(function (o) { base[o.uuid] = o.userData.base3d; atual[o.uuid] = { o: o, p: o.position.clone(), r: new THREE.Vector3(o.rotation.x, o.rotation.y, o.rotation.z), v: o.visible }; });
    modelo.updateMatrixWorld(true);
    var b = new THREE.Box3().setFromObject(modelo); modelo.userData.caixa = b;
  }

  /* um nó pelo nome, ou pelo caminho "pai/filho" quando o nome se repete (ficha_01 em cada gaveta) */
  function achar(nome) {
    if (nos[nome] && nome.indexOf('/') < 0) return nos[nome];
    var partes = nome.split('/'), o = nos[partes[0]];
    for (var i = 1; o && i < partes.length; i++) { var alvo = partes[i], achou = null; o.traverse(function (x) { if (!achou && x !== o && x.name === alvo) achou = x; }); o = achou; }
    return o || null;
  }

  /* ── áreas de texto: o jogo escreve por cima ── */
  function quebra(g, txt, larg) { var p = String(txt).split(' '), l = [], cur = ''; p.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > larg && cur) { l.push(cur); cur = w; } else cur = t; }); if (cur) l.push(cur); return l; }
  function medidas(o) {
    /* largura e altura do plano no próprio espaço (os dois maiores eixos da caixa local) */
    var THREE = global.THREE, g = o.geometry; if (!g.boundingBox) g.computeBoundingBox(); var s = g.boundingBox.getSize(new THREE.Vector3());
    var ax = [s.x, s.y, s.z].sort(function (a, b) { return b - a; }); return [Math.max(ax[0], 0.001), Math.max(ax[1], 0.001)];
  }
  function escrever(nome, T) {
    var THREE = global.THREE, no = achar(nome); if (!no) return;
    var malha = no.isMesh ? no : null; if (!malha) no.traverse(function (o) { if (!malha && o.isMesh) malha = o; }); if (!malha) return;
    var A = areas[nome];
    if (!A) {
      var md = medidas(malha), asp = md[0] / md[1], W = 1024, H = Math.max(64, Math.round(W / asp)); if (H > 1024) { H = 1024; W = Math.max(64, Math.round(H * asp)); }
      var c = document.createElement('canvas'); c.width = W; c.height = H;
      var tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; tx.anisotropy = 4; tx.flipY = T.flipY != null ? T.flipY : true;
      var m = new THREE.MeshBasicMaterial({ map: tx, transparent: !!T.transparente, toneMapped: false, side: THREE.DoubleSide, depthWrite: !T.transparente, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
      A = areas[nome] = { c: c, tx: tx, m: m, malha: malha, orig: malha.material, chave: '' };
      malha.material = m; malha.renderOrder = 2;
    }
    var chave = JSON.stringify(T); if (chave === A.chave) return; A.chave = chave;
    var g = A.c.getContext('2d'), w = A.c.width, h = A.c.height;
    g.clearRect(0, 0, w, h);
    if (!T.transparente || T.fundo) { g.fillStyle = T.fundo || '#efe9dc'; g.fillRect(0, 0, w, h); }
    if (T.desenho) T.desenho(g, w, h);
    else {
      var linhas = T.linhas || [], tam = Math.round((T.tam || 0.16) * h), lh = tam * 1.22, y0;
      g.fillStyle = T.cor || '#20180e'; g.textBaseline = 'middle'; g.textAlign = T.alinhar || 'center';
      g.font = (T.peso || '700') + ' ' + tam + 'px "DM Mono",monospace';
      var todas = []; linhas.forEach(function (l) { quebra(g, l, w * 0.9).forEach(function (q) { todas.push(q); }); });
      while (todas.length * lh > h * 0.92 && tam > 10) { tam = Math.round(tam * 0.88); lh = tam * 1.22; g.font = (T.peso || '700') + ' ' + tam + 'px "DM Mono",monospace'; todas = []; linhas.forEach(function (l) { quebra(g, l, w * 0.9).forEach(function (q) { todas.push(q); }); }); }
      y0 = T.topo != null ? h * T.topo + lh / 2 : h / 2 - (todas.length - 1) * lh / 2;
      var x = T.alinhar === 'left' ? w * 0.05 : w / 2;
      todas.forEach(function (l, i) { g.fillText(l, x, y0 + i * lh); });
    }
    if (T.girar) { var tmp = document.createElement('canvas'); tmp.width = w; tmp.height = h; tmp.getContext('2d').drawImage(A.c, 0, 0); g.clearRect(0, 0, w, h); g.save(); g.translate(w, h); g.rotate(Math.PI); g.drawImage(tmp, 0, 0); g.restore(); }
    A.tx.needsUpdate = true;
  }

  /* ── destaque dos detalhes que ainda respondem: um anel ciano pulsando sobre cada um
     (não mexe na cor do modelo: as cores dos cabos e o mostrador do relógio ficam como são) ── */
  var texAnel = null;
  function anel() {
    if (texAnel) return texAnel; var c = document.createElement('canvas'); c.width = c.height = 128; var g = c.getContext('2d');
    g.strokeStyle = '#86e1ea'; g.lineWidth = 9; g.shadowColor = '#3fb6c4'; g.shadowBlur = 14; g.beginPath(); g.arc(64, 64, 42, 0, 2 * Math.PI); g.stroke();
    g.fillStyle = '#c9f6fb'; g.beginPath(); g.arc(64, 64, 9, 0, 2 * Math.PI); g.fill();
    texAnel = new global.THREE.CanvasTexture(c); return texAnel;
  }
  function centroAlvo(n) {
    var THREE = global.THREE, z = n && typeof n === 'object' ? n : null, no = achar(z ? z.no : n); if (!no || !visivel(no)) return null;
    var b = new THREE.Box3().setFromObject(no); if (b.isEmpty()) return null; var c = b.getCenter(new THREE.Vector3());
    if (z) { var sz = b.getSize(new THREE.Vector3()), u = (z.r[0] + z.r[2]) / 2, v = (z.r[1] + z.r[3]) / 2; if (sz.z < sz.y) c.set(b.min.x + u * sz.x, b.max.y - v * sz.y, b.max.z + 0.01); else c.set(b.min.x + u * sz.x, b.max.y + 0.01, b.min.z + v * sz.z); }
    return c;
  }
  function marcar() {
    marcados.forEach(function (M) { if (M.spr.parent) M.spr.parent.remove(M.spr); }); marcados = [];
    var A = (cfg.alvos && cfg.alvos(st)) || {}, V = (cfg.vistos && cfg.vistos(st)) || {};
    Object.keys(A).forEach(function (k) {
      if (V[k]) return; var lista = [].concat(A[k]); if (!lista.length) return;
      var spr = new global.THREE.Sprite(new global.THREE.SpriteMaterial({ map: anel(), transparent: true, depthTest: false, depthWrite: false, toneMapped: false }));
      spr.renderOrder = 50; spr.raycast = function () {}; cena.add(spr); marcados.push({ spr: spr, alvo: lista[0] });
    });
  }

  /* ── pose: o que se mexe em cada etapa ── */
  function aplicarPose() {
    var THREE = global.THREE, P = (cfg.pose && cfg.pose(st)) || {};
    var porId = {}; Object.keys(P).forEach(function (n) { var o = achar(n); if (o) porId[o.uuid] = P[n]; });
    Object.keys(atual).forEach(function (k) {
      var b = base[k], q = porId[k], a = atual[k]; if (!b || !a) return;
      a.alvoP = q && q.p ? new THREE.Vector3(b.p.x + q.p[0], b.p.y + q.p[1], b.p.z + q.p[2]) : b.p.clone();
      a.alvoR = q && q.r ? new THREE.Vector3(b.r.x + q.r[0], b.r.y + q.r[1], b.r.z + q.r[2]) : new THREE.Vector3(b.r.x, b.r.y, b.r.z);
      a.alvoV = q && q.v != null ? q.v : b.v;
      var o = a.o, e = q && q.e;
      if (o && (e || o.userData.aceso)) o.traverse(function (m) {
        if (!m.isMesh || !m.material || !m.material.emissive) return;
        if (!m.userData.matProprio) { m.material = m.material.clone(); m.userData.matProprio = true; }
        if (!m.userData.e0) m.userData.e0 = [m.material.emissive.getHex(), m.material.emissiveIntensity];
        if (e) { m.material.emissive.set(e); m.material.emissiveIntensity = 2.2; } else { m.material.emissive.setHex(m.userData.e0[0]); m.material.emissiveIntensity = m.userData.e0[1]; }
      });
      if (o) o.userData.aceso = !!e;
    });
  }
  function passo(dt) {
    var k1 = Math.min(1, dt * 5.5);
    Object.keys(atual).forEach(function (k) {
      var a = atual[k], o = a.o; if (!a.alvoP || !o) return;
      a.p.lerp(a.alvoP, k1); a.r.lerp(a.alvoR, k1);
      o.position.copy(a.p); o.rotation.set(a.r.x, a.r.y, a.r.z);
      if (o.visible !== a.alvoV) o.visible = a.alvoV;
    });
    var pulso = 0.5 + 0.5 * Math.sin(relogio * 3.2), cam = ra ? ra.cameraAtiva() : camera;
    marcados.forEach(function (M, i) {
      var c = centroAlvo(M.alvo); M.spr.visible = !!c; if (!c) return;
      M.spr.position.copy(c); var d = cam.position.distanceTo(c) || 1; M.spr.scale.setScalar(d * (0.05 + 0.012 * Math.sin(relogio * 3.2 + i)));
      M.spr.material.opacity = 0.45 + 0.4 * pulso;
    });
  }

  /* ── câmera ── */
  function fator() { return camera.aspect < 0.8 ? Math.min(1.9, 0.82 / camera.aspect) : 1; }
  function voar(v, ja) {
    if (!v || (ra && ra.estado().modo === 'ra')) return; var THREE = global.THREE, f = fator();
    var alvo = new THREE.Vector3(v[1][0], v[1][1], v[1][2]), pos = new THREE.Vector3(v[0][0], v[0][1], v[0][2]).sub(alvo).multiplyScalar(f).add(alvo);
    if (ja) { camera.position.copy(pos); controles.target.copy(alvo); controles.update(); anim = null; return; }
    anim = { t: 0, de: camera.position.clone(), para: pos, ade: controles.target.clone(), apara: alvo };
  }
  function suave(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
  function desenhar(tempo, xr) {
    var dt = Math.min(0.05, (tempo - (desenhar.t0 || tempo)) / 1000); desenhar.t0 = tempo; relogio += dt;
    if (anim) { anim.t = Math.min(1, anim.t + dt / 0.9); var s = suave(anim.t); camera.position.lerpVectors(anim.de, anim.para, s); controles.target.lerpVectors(anim.ade, anim.apara, s); if (anim.t >= 1) anim = null; }
    if (ra) ra.atualizar(dt, xr);
    passo(dt);
    if (controles.enabled) controles.update();
    renderer.render(cena, ra ? ra.cameraAtiva() : camera);
  }

  /* ── toque: a malha (sem quantização, o raio funciona) e, para peças pequenas, a tela ── */
  function tocar(x, y) {
    if (!cfg || !modelo) return;
    var THREE = global.THREE, A = (cfg.alvos && cfg.alvos(st)) || {}, dono = {}, zonas = [];
    Object.keys(A).forEach(function (k) { [].concat(A[k]).forEach(function (n) {
      if (n && typeof n === 'object') { var nz = achar(n.no); if (nz) nz.traverse(function (o) { if (o.isMesh) zonas.push({ id: o.uuid, k: k, r: n.r }); }); return; }
      var no = achar(n); if (no) no.traverse(function (o) { if (!dono[o.uuid]) dono[o.uuid] = k; }); }); });
    var r = renderer.domElement.getBoundingClientRect(), cam = (ra && ra.cameraAtiva) ? ra.cameraAtiva() : camera;
    var v = new THREE.Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    var rc = new THREE.Raycaster(); rc.setFromCamera(v, cam);
    var hits = rc.intersectObject(modelo, true).filter(function (h) { var o = h.object; while (o) { if (!o.visible) return false; o = o.parent; } return true; });
    var escolhido = null;
    if (hits.length) {
      var d0 = hits[0].distance;
      for (var i = 0; i < hits.length && !escolhido; i++) {
        var h = hits[i]; if (h.distance - d0 > 0.06) break;
        if (h.uv) zonas.forEach(function (z) { if (escolhido || z.id !== h.object.uuid) return; var u = h.uv.x, v = 1 - h.uv.y; if (u >= z.r[0] && u <= z.r[2] && v >= z.r[1] && v <= z.r[3]) escolhido = z.k; });
        if (!escolhido && dono[h.object.uuid]) escolhido = dono[h.object.uuid];
      }
    }
    if (!escolhido) {
      /* peças pequenas (chave, pendrive, bilhete): o centro do nó na tela, até 30 px do dedo */
      var melhor = 30 * 30;
      Object.keys(A).forEach(function (k) { [].concat(A[k]).forEach(function (n) { if (n && typeof n === 'object') return; var no = achar(n); if (!no || !visivel(no)) return; var b = new THREE.Box3().setFromObject(no); if (b.isEmpty()) return; var c = b.getCenter(new THREE.Vector3()).project(cam); if (c.z > 1) return; var sx = (c.x + 1) / 2 * r.width + r.left, sy = (1 - c.y) / 2 * r.height + r.top, d = (sx - x) * (sx - x) + (sy - y) * (sy - y); if (d < melhor) { melhor = d; escolhido = k; } }); });
    }
    if (escolhido && cfg.aoTocar) cfg.aoTocar(escolhido);
  }
  function visivel(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
  /* coordenada de tela de um detalhe (para o teste de interface tocar como o dedo) */
  function ondeEsta(k) {
    if (!cfg || !modelo) return null; var THREE = global.THREE, A = (cfg.alvos && cfg.alvos(st)) || {}, ns = [].concat(A[k] || []), r = renderer.domElement.getBoundingClientRect(), cam = camera;
    function tela(v) { var c = v.clone().project(cam); return c.z > 1 ? null : [(c.x + 1) / 2 * r.width + r.left, (1 - c.y) / 2 * r.height + r.top]; }
    function dentro(p) { return p && p[0] > r.left + 4 && p[0] < r.right - 4 && p[1] > r.top + 4 && p[1] < r.bottom - 4; }
    for (var i = 0; i < ns.length; i++) {
      var n = ns[i], z = n && typeof n === 'object' ? n : null, no = achar(z ? z.no : n); if (!no || !visivel(no)) continue;
      var b = new THREE.Box3().setFromObject(no); if (b.isEmpty()) continue; var c = b.getCenter(new THREE.Vector3());
      if (z) { var mn = b.min, mx = b.max, sz = b.getSize(new THREE.Vector3()), u = (z.r[0] + z.r[2]) / 2, v = (z.r[1] + z.r[3]) / 2;
        if (sz.z < sz.y) c.set(mn.x + u * sz.x, mx.y - v * sz.y, c.z); else c.set(mn.x + u * sz.x, c.y, mn.z + v * sz.z); return tela(c); }
      /* um ponto do detalhe que o dedo alcança: o centro de cada parte, e pontos da caixa, até o raio cair nele */
      var cand = [c], malhas = []; no.traverse(function (o) { if (o.isMesh && visivel(o)) malhas.push(o); });
      malhas.forEach(function (m) { var bb = new THREE.Box3().setFromObject(m); if (!bb.isEmpty()) cand.push(bb.getCenter(new THREE.Vector3())); });
      [0.25, 0.75].forEach(function (fx) { [0.25, 0.75].forEach(function (fy) { [0.25, 0.75].forEach(function (fz) { cand.push(new THREE.Vector3(b.min.x + fx * (b.max.x - b.min.x), b.min.y + fy * (b.max.y - b.min.y), b.min.z + fz * (b.max.z - b.min.z))); }); }); });
      var rc = new THREE.Raycaster(), meus = {}; no.traverse(function (o) { meus[o.uuid] = 1; });
      for (var j = 0; j < cand.length; j++) {
        var p = tela(cand[j]); if (!dentro(p)) continue;
        rc.setFromCamera(new THREE.Vector2(((p[0] - r.left) / r.width) * 2 - 1, -((p[1] - r.top) / r.height) * 2 + 1), cam);
        var hs = rc.intersectObject(modelo, true).filter(function (h) { return visivel(h.object); });
        if (hs.length && meus[hs[0].object.uuid]) return p;
      }
      var p0 = tela(c); if (dentro(p0)) return p0;
    }
    return null;
  }
  /* ── RA ── */
  function botoesRA() {
    if (!ui) return; var bRA = ui.querySelector('[data-p3="ra"]'), bP = ui.querySelector('[data-p3="pousar"]');
    if (!ra) { bRA.hidden = true; bP.hidden = true; return; }
    var e = ra.estado(); bP.hidden = !(e.modo === 'ra' && !e.posta);
    bRA.textContent = e.modo === 'ra' ? 'Sair da RA' : 'Pôr na mesa (RA)';
    controles.enabled = e.modo !== 'ra';
  }
  function entrarRA() {
    if (!ra) return; var e = ra.estado();
    if (e.modo === 'ra') { ra.sair().then(function () { ultimaVista = ''; atualizar(st); botoesRA(); }); return; }
    ra.entrar('ra').then(function () { if (cfg.aoAviso) cfg.aoAviso('Aponte para uma mesa até aparecer o círculo e toque em “Pousar aqui”. Depois, a peça responde ao toque, como na tela.'); botoesRA(); })
      .catch(function (er) { if (cfg.aoAviso) cfg.aoAviso((er && er.message) || 'A câmera não abriu. A peça segue na tela.'); botoesRA(); });
  }
  function pousar() { if (!ra) return; var e = ra.estado(); if (e.modo === 'ra' && !e.temHit) return; if (ra.posicionar()) botoesRA(); }

  /* ── abrir / atualizar / fechar ── */
  function abrir(h, c) {
    host = h; cfg = c;
    return carregar().then(function () { return carregarGLB(c.glb); }).then(function (g) {
      if (cfg !== c) return false;
      preparar(g);
      if (!renderer.domElement.parentNode || renderer.domElement.parentNode !== host) host.insertBefore(renderer.domElement, host.firstChild);
      if (!ui || ui.parentNode !== host) {
        ui = document.createElement('div'); ui.className = 'peca3d-ui';
        ui.innerHTML = '<button type="button" class="p3-btn" data-p3="esquema">Esquema 2D</button><button type="button" class="p3-btn" data-p3="vista">Enquadrar</button><button type="button" class="p3-btn ouro" data-p3="ra" hidden>Pôr na mesa (RA)</button><button type="button" class="p3-btn ouro" data-p3="pousar" hidden>Pousar aqui</button>';
        host.appendChild(ui);
        ui.querySelector('[data-p3="esquema"]').onclick = function () { var on = host.classList.toggle('ver-esquema'); this.textContent = on ? 'Ver em 3D' : 'Esquema 2D'; };
        ui.querySelector('[data-p3="vista"]').onclick = function () { voar(cfg.vista && cfg.vista(st)); };
        ui.querySelector('[data-p3="ra"]').onclick = entrarRA; ui.querySelector('[data-p3="pousar"]').onclick = pousar;
        if (ra) ra.modosPossiveis(function (m) { ui.querySelector('[data-p3="ra"]').hidden = !m.ra; });
      }
      vivo = true; redimensionar(); ultimaVista = '';
      renderer.setAnimationLoop(desenhar);
      return true;
    });
  }
  function atualizar(s) {
    if (!cfg || !modelo) return; st = s;
    var T = (cfg.textos && cfg.textos(st)) || {}; Object.keys(T).forEach(function (n) { if (T[n]) escrever(n, T[n]); });
    aplicarPose(); marcar();
    var so2d = !!(cfg.so2d && cfg.so2d(st)); host.classList.toggle('so-esquema', so2d);
    var v = cfg.vista && cfg.vista(st), kv = JSON.stringify(v);
    if (kv !== ultimaVista) { voar(v, !ultimaVista); ultimaVista = kv; }
  }
  function fechar() {
    vivo = false; cfg = null;
    if (renderer) renderer.setAnimationLoop(null);
    var p = (ra && ra.estado().modo === 'ra') ? ra.sair() : Promise.resolve();
    return p.then(function () { if (renderer && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); if (ui && ui.parentNode) ui.parentNode.removeChild(ui); ui = null; if (host) host.classList.remove('ver-esquema'); });
  }
  /* a câmera e as partes já pararam (o dedo toca no que vê) */
  function parado() {
    if (!vivo || anim) return false;
    return Object.keys(atual).every(function (k) { var a = atual[k]; return !a.alvoP || (a.p.distanceToSquared(a.alvoP) < 1e-6 && a.r.distanceToSquared(a.alvoR) < 1e-5); });
  }
  function foto() { try { if (!renderer || !vivo) return ''; renderer.render(cena, camera); return renderer.domElement.toDataURL('image/jpeg', 0.82); } catch (e) { return ''; } }
  global.VCPeca3D = { foto: foto, parado: parado, suporta: suporta, abrir: abrir, atualizar: atualizar, fechar: fechar, ondeEsta: ondeEsta, tocarEm: tocar, ativo: function () { return vivo; }, nos: function () { return nos; }, achar: achar };
})(window);
