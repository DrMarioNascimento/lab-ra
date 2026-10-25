/* Objetos de perto (10/10/2026): uma mesa ou escrivaninha em 3D para mexer com o dedo,
   no espírito das folhas da escrivaninha e do livro do farol d'A Casa da Costa: O Impostor.

   · As GAVETAS saem quando tocadas (e voltam no segundo toque).
   · As FOLHAS ficam em montes: tocar lê a folha de cima (o texto aparece no cartão,
     legível no celular); "Tirar de cima" a põe de lado e mostra a de baixo.
   · A PASTA abre pela capa e vira página por página.
   · O que está ESCONDIDO (crachá, chave, cartão, bilhete) fica debaixo das folhas ou
     no fundo de uma gaveta: só dá para pegar depois de tirar o que está por cima.
     "Guardar" manda para o inventário, com a foto.
   · Na mesa em RA, pelo mesmo motor da maquete (lib/ac-ra.js e ac-maquete-ra.js).

   Uso: VCObjeto.abrir({titulo, sub, movel, gavetas:[{nome, folhas, item}], monte:{folhas, item},
     pasta:{titulo, paginas}, achados, digitar, aoAchar(item, img), aoFoto(f), aoFechar}).
   Os três precisam de lib/three.min.js e lib/OrbitControls.js (a maquete já carrega). */
(function (global) {
  'use strict';
  var BASE = (function () { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^/]*$/, '') : ''; })();
  var LIB = BASE + 'lib/', SCRIPTS = [LIB + 'three.min.js', BASE + 'ra-textos-volume.js?v=volume-20261025-auditoria', LIB + 'GLTFLoader.js', LIB + 'OrbitControls.js', LIB + 'ac-ra.js', LIB + 'ac-maquete-ra.js'];
  var el = null, renderer, cena, camera, controles, raiz, mundo, ra = null, op = {}, aberto = false, pronto = null;
  var gavetas = [], montes = [], pasta = null, itens = [], animando = [], anim = null, relogio = 0, tocando = null, atual = null;
  var FL = 0.24, FC = 0.33; /* folha: largura e comprimento (um pouco maior que A4, para ler na tela) */

  /* o selo do Arquivo Dragon Games, carimbado em vermelho nas folhas (pedido do Mario, 10/10) */
  var CARIMBO = (function () { try { var i = new Image(); i.src = BASE + 'media/carimbo.webp'; return i; } catch (e) { return null; } })();
  function hashTxt(t) { var h = 7; for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 9973; return h; }
  function carimbar(g, c, f) {
    if (!CARIMBO || !CARIMBO.complete || !CARIMBO.naturalWidth || f.carimbo === false) return;
    var h = hashTxt((f.titulo || '') + (f.linhas || []).join('')), tam = 150 + h % 40, x = c.width - tam - 30 - (h % 50), y = c.height - tam - 40 - (h % 90);
    g.save(); g.globalAlpha = 0.62 + (h % 20) / 100; g.translate(x + tam / 2, y + tam / 2); g.rotate(((h % 40) - 20) * Math.PI / 180); g.drawImage(CARIMBO, -tam / 2, -tam / 2, tam, tam); g.restore();
  }
  function carregarScript(src) { return new Promise(function (ok, falha) { if (document.querySelector('script[data-maq="' + src + '"]')) return ok(); var s = document.createElement('script'); s.src = src; s.async = false; s.setAttribute('data-maq', src); s.onload = function () { ok(); }; s.onerror = function () { falha(Error('Não carregou ' + src)); }; document.head.appendChild(s); }); }
  function carregar() { if (pronto) return pronto; var c = Promise.resolve(); SCRIPTS.forEach(function (s) { c = c.then(function () { if (/three\.min/.test(s) && global.THREE) return; if (/GLTFLoader/.test(s) && global.THREE && global.THREE.GLTFLoader) return; if (/OrbitControls/.test(s) && global.THREE && global.THREE.OrbitControls) return; if (/ac-ra\.js/.test(s) && global.ACRA) return; if (/ac-maquete-ra/.test(s) && global.ACMaquetteRA) return; return carregarScript(s); }); }); pronto = c.then(montarCena); pronto.catch(function () { pronto = null; }); return pronto; }

  /* ── tela ── */
  function criarTela() {
    el = document.createElement('div'); el.id = 'telaObjeto'; el.className = 'tela-obj'; el.hidden = true;
    el.innerHTML = '<div class="obj-palco" id="objPalco"></div>' +
      '<div class="obj-topo"><button type="button" class="obj-btn" id="objSair">‹ Voltar</button><div class="obj-tit"><b id="objTitulo"></b><span id="objDica">Toque nas gavetas, nas folhas e na pasta.</span></div></div>' +
      '<div class="obj-ferr"><button type="button" class="obj-btn" id="objVista">Vista de cima</button><button type="button" class="obj-btn ouro" id="objRA" hidden>Pôr na mesa (RA)</button><button type="button" class="obj-btn ouro" id="objPousar" hidden>Pousar aqui</button></div>' +
      '<div class="planta-card obj-card"><small id="objRot"></small><p id="objTxt"></p><div id="objAcao"></div></div>';
    document.body.appendChild(el);
    var css = document.createElement('style');
    css.textContent = '.tela-obj{position:fixed;inset:0;z-index:88;background:radial-gradient(110% 80% at 50% 25%,#2a2016,#0f0b08 65%,#060403);display:flex;flex-direction:column;touch-action:none}.tela-obj[hidden]{display:none}' +
      '.obj-palco{position:absolute;inset:0}.obj-palco canvas{display:block;width:100%;height:100%;touch-action:none}' +
      '.obj-topo{position:relative;z-index:3;display:flex;gap:10px;align-items:flex-start;padding:calc(env(safe-area-inset-top) + 10px) 10px 8px;background:linear-gradient(#0f0b08f0,#0f0b0800);pointer-events:none}.obj-topo>*{pointer-events:auto}' +
      '.obj-tit{display:flex;flex-direction:column;font:500 12.5px/1.45 var(--termfont,monospace);color:#e9d8b4}.obj-tit b{color:#efc878;font:600 18px/1.2 var(--display,Georgia,serif);text-shadow:0 2px 0 #000a}' +
      '.obj-btn{flex:0 0 auto;min-height:42px;padding:0 14px;border-radius:10px;border:1px solid #6b5636;border-bottom:3px solid #0a0604;background:linear-gradient(180deg,#3a2c1c,#1e160e);color:#efc878;font:700 13px var(--sans,system-ui);cursor:pointer;box-shadow:inset 0 2px 0 #ffffff14,inset 0 -3px 6px #000a,0 4px 0 #0a0604,0 8px 14px #0008}.obj-btn[hidden]{display:none}' +
      '.obj-btn:active,.obj-card .acao:active{transform:translateY(3px);box-shadow:inset 0 2px 0 #ffffff10,0 1px 0 #0a0604}' +
      '.obj-btn.ouro{background:linear-gradient(180deg,#f3d078,#e0b13a);color:#1a1206;border-color:#d6aa58;border-bottom-color:#5a4310;box-shadow:inset 0 2px 0 #fff6,0 4px 0 #5a4310,0 8px 14px #0008}' +
      '.obj-ferr{position:relative;z-index:3;display:flex;flex-wrap:wrap;gap:8px;padding:0 10px;margin-top:auto;justify-content:center}' +
      '.obj-card{position:relative;z-index:3;margin:8px 10px calc(env(safe-area-inset-bottom) + 10px)!important;max-height:38vh;overflow:auto;border-left-color:#d49a6a!important}' +
      '.obj-card #objTxt .folha-txt{display:block;margin-top:6px;padding:10px 12px;border-radius:8px;background:linear-gradient(180deg,#f4ecd8,#e8dcc0);color:#2a2014;font:500 13.5px/1.5 var(--termfont,monospace);box-shadow:inset 0 1px 0 #fff8,0 3px 0 #0006;white-space:pre-line}' +
      '.obj-card #objTxt .folha-txt{position:relative;overflow:hidden}.obj-card #objTxt .folha-txt .carimbo{position:absolute;right:6px;bottom:4px;width:84px;height:84px;background:url(' + BASE + 'media/carimbo.webp) center/contain no-repeat;opacity:.55;transform:rotate(var(--rot,-8deg));pointer-events:none;mix-blend-mode:multiply}' +
      '.obj-card #objTxt .folha-txt i{display:block;margin-top:6px;font:600 17px/1.3 Caveat,cursive;color:#1d3a8a;font-style:normal}' +
      '.obj-card #objAcao{display:flex;flex-wrap:wrap;gap:8px;margin-top:9px}.obj-card .acao{flex:1 1 45%;min-height:44px;border-radius:10px;border:1px solid #d6aa58;border-bottom:3px solid #5a4310;background:linear-gradient(180deg,#f3d078,#e0b13a);color:#1a1206;font:700 12.5px var(--termfont,monospace);cursor:pointer;box-shadow:inset 0 2px 0 #fff6,0 4px 0 #5a4310,0 8px 14px #0007}' +
      '.obj-card .acao.sec{background:linear-gradient(180deg,#3a2c1c,#1e160e);color:#efc878;border-color:#6b5636;border-bottom-color:#0a0604;box-shadow:inset 0 2px 0 #ffffff14,0 4px 0 #0a0604}';
    document.head.appendChild(css);
    el.querySelector('#objSair').onclick = function () { fechar(); };
    el.querySelector('#objVista').onclick = function () { voar([0, 1.75, 0.55], [0, 0.76, 0.05]); };
    el.querySelector('#objRA').onclick = entrarRA; el.querySelector('#objPousar').onclick = pousar;
  }
  function cartao(rot, html, acoes) {
    el.querySelector('#objRot').textContent = rot; var p = el.querySelector('#objTxt'); p.innerHTML = html;
    var a = el.querySelector('#objAcao'); a.innerHTML = '';
    (acoes || []).forEach(function (x, i) { if (!x) return; var b = document.createElement('button'); b.type = 'button'; b.className = 'acao' + (x[2] ? ' sec' : ''); b.textContent = x[0]; b.setAttribute('data-obj-acao', i); b.onclick = x[1]; a.appendChild(b); });
  }

  /* ── cena ── */
  function montarCena() {
    var THREE = global.THREE;
    cena = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, 1, 0.01, 30); cena.add(camera);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 1.8));
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1; renderer.xr.enabled = true;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.querySelector('#objPalco').appendChild(renderer.domElement);
    cena.add(new THREE.HemisphereLight(0xfff0d8, 0x2a1c10, 0.75));
    var sol = new THREE.DirectionalLight(0xffe6c0, 0.9); sol.position.set(-1.2, 2.6, 1.6); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024); sol.shadow.camera.left = -1.2; sol.shadow.camera.right = 1.2; sol.shadow.camera.top = 1.2; sol.shadow.camera.bottom = -1.2; sol.shadow.bias = -0.0006; cena.add(sol);
    raiz = new THREE.Group(); cena.add(raiz);
    controles = new THREE.OrbitControls(camera, renderer.domElement); controles.enableDamping = true; controles.dampingFactor = 0.09; controles.minDistance = 0.25; controles.maxDistance = 2.6; controles.maxPolarAngle = Math.PI * 0.49; controles.target.set(0, 0.76, 0.05);
    if (global.ACMaquetteRA) { try { ra = global.ACMaquetteRA.criar({ renderer: renderer, cena: cena, camera: camera, raiz: raiz, baseY: 0, aoMudar: botoesRA, desenhar: desenhar, aoTocar: function (x, y) { tocar(x, y); } }); ra.modosPossiveis(function (m) { el.querySelector('#objRA').hidden = !m.ra; }); } catch (e) { ra = null; } }
    var c = renderer.domElement;
    c.addEventListener('pointerdown', function (e) { tocando = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    c.addEventListener('pointerup', function (e) { if (!tocando) return; var dx = e.clientX - tocando.x, dy = e.clientY - tocando.y, dt = performance.now() - tocando.t; tocando = null; if (dx * dx + dy * dy > 81 || dt > 600) return; var est = ra && ra.estado(); if (est && est.modo === 'ra' && !est.posta) { pousar(); return; } tocar(e.clientX, e.clientY); });
    global.addEventListener('resize', redimensionar);
  }
  function redimensionar() { if (!renderer || !el || el.hidden) return; var w = global.innerWidth, h = global.innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  function mat(cor, o) { return new global.THREE.MeshStandardMaterial(Object.assign({ color: cor, roughness: 0.6, metalness: 0.05 }, o || {})); }
  function caixa(g, w, h, d, m, x, y, z) { var b = new global.THREE.Mesh(new global.THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true; g.add(b); return b; }

  /* ── texturas de papel ── */
  function quebra(g, txt, larg) { var p = String(txt).split(' '), l = [], cur = ''; p.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > larg && cur) { l.push(cur); cur = w; } else cur = t; }); if (cur) l.push(cur); return l; }
  function papel(f) {
    var c = document.createElement('canvas'); c.width = 600; c.height = Math.round(600 * FC / FL); var g = c.getContext('2d');
    var fundo = { amarela: ['#f3e7a8', '#e6d68a'], azul: ['#dfe9f2', '#c9d8e6'], branca: ['#f6f0e1', '#e9dfc8'] }[f.cor || 'branca'];
    var gr = g.createLinearGradient(0, 0, 0, c.height); gr.addColorStop(0, fundo[0]); gr.addColorStop(1, fundo[1]); g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
    for (var i = 0; i < 900; i++) { g.fillStyle = 'rgba(80,60,30,' + (Math.random() * 0.05) + ')'; g.fillRect(Math.random() * c.width, Math.random() * c.height, 2, 2); }
    if (f.timbre !== false) { g.fillStyle = '#1b3a46'; g.fillRect(36, 34, c.width - 72, 6); g.font = '700 22px "DM Mono",monospace'; g.fillText(f.timbre || 'VESTCHIP · TORRE DE CONTINUIDADE', 36, 72); }
    var y = 120; g.fillStyle = '#20180e'; g.font = '700 30px "DM Mono",monospace'; quebra(g, f.titulo || '', c.width - 72).forEach(function (l) { g.fillText(l, 36, y); y += 38; }); y += 10;
    g.font = '500 23px "DM Mono",monospace'; g.fillStyle = '#2a2014';
    (f.linhas || []).forEach(function (t) { quebra(g, t, c.width - 72).forEach(function (l) { g.fillText(l, 36, y); y += 31; }); y += 8; });
    if (f.mao) { y += 14; g.save(); g.translate(40, y); g.rotate(-0.035); g.font = '600 38px Caveat,"Segoe Print",cursive'; g.fillStyle = '#1d3a8a'; var yy = 0; [].concat(f.mao).forEach(function (t) { quebra(g, t, c.width - 100).forEach(function (l) { g.fillText(l, 0, yy); yy += 42; }); }); g.restore(); }
    carimbar(g, c, f);
    g.strokeStyle = 'rgba(60,40,20,.25)'; g.lineWidth = 3; g.strokeRect(2, 2, c.width - 4, c.height - 4);
    var t = new global.THREE.CanvasTexture(c); t.encoding = global.THREE.sRGBEncoding; t.anisotropy = 8; return t;
  }
  function etiqueta(it) {
    var c = document.createElement('canvas'); c.width = 512; c.height = 320; var g = c.getContext('2d');
    var cores = { cracha: ['#e9f3f6', '#1b3a46'], cartao: ['#1b3a46', '#86e1ea'], bilhete: ['#f3e7a8', '#3a2a10'], chave: ['#c9a061', '#3a2a10'] }[it.tipo] || ['#eee', '#333'];
    g.fillStyle = cores[0]; g.fillRect(0, 0, 512, 320); g.fillStyle = cores[1]; g.fillRect(0, 0, 512, 54);
    g.fillStyle = cores[0]; g.font = '700 30px "DM Mono",monospace'; g.fillText(it.cabecalho || 'VESTCHIP', 22, 38);
    g.fillStyle = cores[1]; g.font = '700 34px "DM Mono",monospace'; quebra(g, it.rotulo || it.nome, 470).forEach(function (l, i) { g.fillText(l, 22, 110 + i * 44); });
    if (it.tipo === 'cartao') { g.fillStyle = '#c9a061'; g.fillRect(380, 200, 90, 66); }
    var t = new global.THREE.CanvasTexture(c); t.encoding = global.THREE.sRGBEncoding; t.anisotropy = 8; return t;
  }

  /* ── o móvel ── */
  /* ── o móvel do designer (11/10/2026): obj-mesa-recepcao-12b.glb e obj-gaveteiro-gabinete.glb.
     O corpo e as gavetas vêm do modelo; as folhas, a pasta e o que está escondido continuam do jogo
     (o texto e a senha mudam a cada partida). Sem o GLB, o móvel feito em código, como antes. ── */
  var cacheGLB = {};
  function carregarGLB(url) {
    if (!url) return Promise.resolve(null);
    if (!cacheGLB[url]) cacheGLB[url] = new Promise(function (ok) { try { var L = new global.THREE.GLTFLoader(); L.load(url, function (g) { ok(g.scene); }, undefined, function () { delete cacheGLB[url]; ok(null); }); } catch (e) { delete cacheGLB[url]; ok(null); } });
    return cacheGLB[url];
  }
  function escreverArea(no, txt) {
    if (!no || !txt) return; var malha = null; no.traverse(function (o) { if (!malha && o.isMesh) malha = o; }); if (!malha) return;
    var c = document.createElement('canvas'); c.width = 512; c.height = 128; var g = c.getContext('2d'); g.fillStyle = '#f1e6c8'; g.fillRect(0, 0, 512, 128); g.fillStyle = '#2a2014'; g.textAlign = 'center'; g.textBaseline = 'middle';
    var t = String(txt).toUpperCase().slice(0, 20), tam = 64; g.font = '700 ' + tam + 'px "DM Mono",monospace'; while (g.measureText(t).width > 470 && tam > 20) { tam -= 4; g.font = '700 ' + tam + 'px "DM Mono",monospace'; } g.fillText(t, 256, 66);
    var tx = new global.THREE.CanvasTexture(c); tx.encoding = global.THREE.sRGBEncoding; malha.material = new global.THREE.MeshBasicMaterial({ map: tx, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
  }
  function slug(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_'); }
  function montarDoModelo(cenaG) {
    var THREE = global.THREE;
    var chao = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.ShadowMaterial({ opacity: 0.35 })); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; mundo.add(chao);
    mundo.add(cenaG);
    cenaG.traverse(function (o) {
      if (!o.userData.base3d) o.userData.base3d = { p: o.position.clone(), v: o.visible }; o.position.copy(o.userData.base3d.p); o.visible = o.userData.base3d.v;
      /* as folhas, a pasta e os achados do modelo saem: os do jogo entram no lugar, com o texto da partida */
      if (/^(folha_|pasta_|cracha|etiqueta_cofre|bilhete)/.test(o.name) && o.parent && !/^(folha_|pasta_|cracha|etiqueta_cofre|bilhete)/.test(o.parent.name)) o.visible = false;
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; var m = o.material; if (m && m.userData && m.userData.gltfExtensions && m.userData.gltfExtensions.KHR_materials_emissive_strength && !o.userData.forca) { o.userData.forca = true; m.emissiveIntensity = m.userData.gltfExtensions.KHR_materials_emissive_strength.emissiveStrength || 1; } }
    });
    cenaG.updateMatrixWorld(true);
    (op.gavetas || []).forEach(function (G, i) {
      var no = cenaG.getObjectByName('gaveta_' + slug(G.nome)) || cenaG.getObjectByName(['gaveta_recepcao', 'gaveta_material', 'gaveta_agenda', 'gaveta_chaves'].filter(function (n) { return cenaG.getObjectByName(n); })[i]);
      if (!no) return;
      no.traverse(function (o) { if (o.isMesh && o.visible) o.userData.gaveta = i; });
      escreverArea(cenaG.getObjectByName('gaveta_' + slug(G.nome) + '_etiqueta_area_texto') || no.getObjectByName(no.name + '_etiqueta_area_texto'), G.nome);
      var gv = { g: no, z0: no.position.z, aberta: false, z: 0, alvo: 0, nome: G.nome, i: i }; gavetas.push(gv);
      /* o fundo da gaveta, no espaço da própria gaveta */
      var b = new THREE.Box3().setFromObject(no), c = b.getCenter(new THREE.Vector3()), base = no.worldToLocal(new THREE.Vector3(c.x, b.min.y + 0.025, c.z + 0.02));
      if (G.folhas || G.item) montes.push(criarMonte(no, base, G.folhas || [], G.item, 0.6, gv));
    });
    var tampo = new THREE.Box3().setFromObject(cenaG.getObjectByName('mesa') || cenaG.getObjectByName('gaveteiro') || cenaG), y = tampo.max.y + 0.004, cx = (tampo.min.x + tampo.max.x) / 2;
    if (op.monte) montes.push(criarMonte(mundo, new THREE.Vector3(Math.min(0.32, tampo.max.x - 0.16), y, 0.08), op.monte.folhas || [], op.monte.item, 1, null));
    if (op.pasta) criarPasta(cenaG.getObjectByName('mesa') ? new THREE.Vector3(tampo.min.x + 0.09, y, 0.04) : new THREE.Vector3(cx - 0.13, y, 0.02));
  }
  function montarMovel() {
    var THREE = global.THREE;
    if (mundo) raiz.remove(mundo); mundo = new THREE.Group(); raiz.add(mundo);
    gavetas = []; montes = []; pasta = null; itens = []; animando = []; atual = null;
    if (op._modelo) { montarDoModelo(op._modelo); return; }
    var escura = op.movel === 'escrivaninha';
    var madeira = mat(escura ? 0x4a2e1c : 0xd8d2c6, { roughness: escura ? 0.55 : 0.4 }), lateral = mat(escura ? 0x3a2416 : 0xbfb8aa), metal = mat(0xb9a27a, { metalness: 0.8, roughness: 0.3 }), fundoG = mat(escura ? 0x2a1a10 : 0x9a948a);
    var chao = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.ShadowMaterial({ opacity: 0.35 })); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; mundo.add(chao);
    caixa(mundo, 1.3, 0.04, 0.7, madeira, 0, 0.74, 0);
    caixa(mundo, 0.04, 0.72, 0.62, lateral, -0.6, 0.36, 0); caixa(mundo, 0.04, 0.72, 0.62, lateral, 0.6, 0.36, 0); caixa(mundo, 1.16, 0.5, 0.02, lateral, 0, 0.47, -0.3);
    caixa(mundo, 0.04, 0.72, 0.62, lateral, 0.1, 0.36, 0);
    /* gaveteiro à direita */
    var n = (op.gavetas || []).length, alt = n ? Math.min(0.2, 0.66 / n) : 0.2;
    (op.gavetas || []).forEach(function (G, i) {
      var g = new THREE.Group(), y = 0.7 - alt * (i + 0.5); g.position.set(0.35, y, 0); mundo.add(g);
      var frente = caixa(g, 0.46, alt - 0.012, 0.02, madeira, 0, 0, 0.3); frente.userData.gaveta = i;
      var puxador = caixa(g, 0.14, 0.018, 0.025, metal, 0, 0.01, 0.325); puxador.userData.gaveta = i;
      caixa(g, 0.44, 0.01, 0.56, fundoG, 0, -alt / 2 + 0.02, 0.01); caixa(g, 0.01, alt - 0.04, 0.56, lateral, -0.215, -0.01, 0.01); caixa(g, 0.01, alt - 0.04, 0.56, lateral, 0.215, -0.01, 0.01); caixa(g, 0.44, alt - 0.04, 0.01, lateral, 0, -0.01, -0.27);
      var et = rotuloFrente(G.nome); if (et) { et.position.set(0, -alt * 0.28, 0.311); g.add(et); }
      var gv = { g: g, aberta: false, z: 0, alvo: 0, nome: G.nome, i: i };
      gavetas.push(gv);
      var base = new THREE.Vector3(0, -alt / 2 + 0.03, 0.02);
      if (G.folhas || G.item) montes.push(criarMonte(g, base, G.folhas || [], G.item, 0.6, gv));
    });
    /* monte sobre o tampo, à esquerda */
    if (op.monte) montes.push(criarMonte(mundo, new THREE.Vector3(-0.33, 0.762, 0.06), op.monte.folhas || [], op.monte.item, 1, null));
    /* a pasta, no centro do tampo */
    if (op.pasta) criarPasta(new THREE.Vector3(0.02, 0.762, -0.12));
    /* luminária */
    var lum = new THREE.Group(); lum.position.set(-0.5, 0.76, -0.22); mundo.add(lum);
    caixa(lum, 0.12, 0.02, 0.12, metal, 0, 0.01, 0); caixa(lum, 0.015, 0.34, 0.015, metal, 0, 0.18, 0);
    var cup = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.09, 20, 1, true), mat(0x1d3a46, { side: THREE.DoubleSide })); cup.position.set(0.05, 0.34, 0.03); cup.rotation.z = 0.9; lum.add(cup);
    var luz = new THREE.PointLight(0xffc98a, 1.2, 1.6); luz.position.set(0.08, 0.3, 0.06); luz.castShadow = false; lum.add(luz);
    (op.extras || []).forEach(function (x) { if (x === 'caneca') { var cn = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.09, 18), mat(0x2a3a46)); cn.position.set(-0.08, 0.805, 0.2); cn.castShadow = true; mundo.add(cn); } });
  }
  function rotuloFrente(txt) {
    if (!txt) return null; var c = document.createElement('canvas'); c.width = 256; c.height = 48; var g = c.getContext('2d'); g.fillStyle = '#f1e6c8'; g.fillRect(0, 0, 256, 48); g.strokeStyle = '#6b5636'; g.lineWidth = 3; g.strokeRect(2, 2, 252, 44); g.fillStyle = '#2a2014'; g.font = '700 22px "DM Mono",monospace'; g.textAlign = 'center'; g.fillText(txt.toUpperCase().slice(0, 18), 128, 32);
    var t = new global.THREE.CanvasTexture(c); t.encoding = global.THREE.sRGBEncoding; return new global.THREE.Mesh(new global.THREE.PlaneGeometry(0.12, 0.0225), new global.THREE.MeshStandardMaterial({ map: t, roughness: 0.8 }));
  }
  function criarMonte(pai, base, folhas, item, escala, gv) {
    var THREE = global.THREE, m = { pai: pai, base: base, folhas: [], lidas: 0, item: null, gv: gv };
    var esc = escala || 1;
    var n = folhas.length;
    folhas.forEach(function (f, i) {
      var me = new THREE.Mesh(new THREE.PlaneGeometry(FL * esc, FC * esc), new THREE.MeshStandardMaterial({ map: papel(f), roughness: 0.85, side: THREE.DoubleSide }));
      me.rotation.x = -Math.PI / 2; me.rotation.z = (Math.random() - 0.5) * 0.12; me.position.set(base.x + (Math.random() - 0.5) * 0.012, base.y + 0.004 + (n - i) * 0.0025, base.z + (Math.random() - 0.5) * 0.012);
      me.receiveShadow = true; me.castShadow = true; me.userData = { folha: f, monte: m, i: i };
      pai.add(me); m.folhas.push(me);
    });
    if (item && !(op.achados && op.achados[item.id])) {
      var dims = { cracha: [0.086, 0.004, 0.054], cartao: [0.086, 0.003, 0.054], bilhete: [0.09, 0.002, 0.07], chave: [0.07, 0.008, 0.025] }[item.tipo] || [0.08, 0.004, 0.05];
      var im;
      if (item.tipo === 'chave') { im = new THREE.Group(); var ouro = mat(0xc9a061, { metalness: 0.9, roughness: 0.25 }); var arg = new THREE.Mesh(new THREE.TorusGeometry(0.013, 0.004, 8, 20), ouro); arg.rotation.x = Math.PI / 2; arg.position.x = -0.03; im.add(arg); var haste = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.004, 0.006), ouro); haste.position.x = 0.0; im.add(haste); var dente = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.004, 0.012), ouro); dente.position.set(0.02, 0, 0.007); im.add(dente); im.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.userData.item = item; } }); }
      else { var mats = [mat(0xdddddd), mat(0xdddddd), new THREE.MeshStandardMaterial({ map: etiqueta(item), roughness: 0.5 }), mat(0x999999), mat(0xdddddd), mat(0xdddddd)]; im = new THREE.Mesh(new THREE.BoxGeometry(dims[0], dims[1], dims[2]), mats); im.castShadow = true; im.userData.item = item; }
      im.position.set(base.x + 0.02, base.y + 0.003, base.z + 0.03); im.rotation.y = 0.25; pai.add(im);
      m.item = { mesh: im, item: item }; itens.push(m.item);
    }
    return m;
  }
  function criarPasta(base) {
    var THREE = global.THREE, P = op.pasta, g = new THREE.Group(); g.position.copy(base); mundo.add(g);
    var capaM = mat(0x1d3a46, { roughness: 0.7 }), W = 0.26, C = 0.34;
    caixa(g, W, 0.012, C, capaM, W / 2, 0.006, 0); /* contracapa */
    var lomb = caixa(g, 0.02, 0.03, C, mat(0x16303a), -0.01, 0.014, 0);
    var paginas = [];
    var lista = (P.paginas || []);
    lista.slice().reverse().forEach(function (f, k) {
      var i = lista.length - 1 - k, piv = new THREE.Group(); piv.position.set(0, 0.014 + (lista.length - i) * 0.0012, 0); g.add(piv);
      var me = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.01, C - 0.01), [new THREE.MeshStandardMaterial({ map: papel(f), roughness: 0.85 })][0]); me.material.side = THREE.DoubleSide;
      me.rotation.x = -Math.PI / 2; me.position.set(W / 2, 0, 0); me.userData = { pagina: i }; piv.add(me); paginas[i] = { piv: piv, mesh: me, f: f, virada: false, ang: 0, alvo: 0 };
    });
    var capaPiv = new THREE.Group(); capaPiv.position.set(0, 0.014 + (lista.length + 1) * 0.0012 + 0.006, 0); g.add(capaPiv);
    var capa = caixa(capaPiv, W, 0.008, C, capaM, W / 2, 0, 0); capa.userData.capa = true;
    var c = document.createElement('canvas'); c.width = 400; c.height = 520; var gg = c.getContext('2d'); gg.fillStyle = '#1d3a46'; gg.fillRect(0, 0, 400, 520); gg.strokeStyle = '#c9a061'; gg.lineWidth = 6; gg.strokeRect(24, 24, 352, 472); gg.fillStyle = '#efc878'; gg.font = '700 30px "Cormorant Garamond",serif'; gg.textAlign = 'center'; quebra(gg, P.titulo || 'PASTA', 300).forEach(function (l, i) { gg.fillText(l, 200, 200 + i * 40); });
    var tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding;
    var rot = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.9, C * 0.9), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.6 })); rot.rotation.x = -Math.PI / 2; rot.position.set(W / 2, 0.0045, 0); rot.userData.capa = true; capaPiv.add(rot);
    pasta = { g: g, capa: { piv: capaPiv, ang: 0, alvo: 0, aberta: false }, paginas: paginas, atual: 0 };
  }

  /* ── animação ── */
  function voar(pos, alvo) { if (ra && ra.estado().modo === 'ra') return; var THREE = global.THREE, k = camera.aspect < 0.8 ? 1.45 : 1; pos = [alvo[0] + (pos[0] - alvo[0]) * k, alvo[1] + (pos[1] - alvo[1]) * k, alvo[2] + (pos[2] - alvo[2]) * k]; anim = { t: 0, de: camera.position.clone(), para: new THREE.Vector3(pos[0], pos[1], pos[2]), ade: controles.target.clone(), apara: new THREE.Vector3(alvo[0], alvo[1], alvo[2]) }; }
  function suave(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
  var antes = 0;
  function desenhar(tempo, xr) {
    var t = tempo || performance.now(), dt = Math.min(0.05, (t - (antes || t)) / 1000); antes = t; relogio += dt;
    if (ra) ra.atualizar(dt, xr);
    gavetas.forEach(function (g) { g.z += (g.alvo - g.z) * Math.min(1, dt * 7); g.g.position.z = (g.z0 || 0) + g.z; });
    if (pasta) { var c = pasta.capa; c.ang += (c.alvo - c.ang) * Math.min(1, dt * 6); c.piv.rotation.z = c.ang; pasta.paginas.forEach(function (p) { if (!p) return; p.ang += (p.alvo - p.ang) * Math.min(1, dt * 6); p.piv.rotation.z = p.ang; }); }
    animando = animando.filter(function (fn) { return fn(dt) !== true; });
    itens.forEach(function (it, i) { if (it.mesh.visible && livre(it)) { it.mesh.position.y += Math.sin(relogio * 3 + i) * 0.00003; } });
    if (anim) { anim.t = Math.min(1, anim.t + dt / 0.9); var s = suave(anim.t); camera.position.lerpVectors(anim.de, anim.para, s); controles.target.lerpVectors(anim.ade, anim.apara, s); if (anim.t >= 1) anim = null; }
    if (controles.enabled) controles.update();
    renderer.render(cena, ra ? ra.cameraAtiva() : camera);
  }
  function livre(it) { var m = montes.filter(function (x) { return x.item === it; })[0]; return !m || m.lidas >= m.folhas.length; }
  function acessivel(m) { return !m.gv || m.gv.aberta; }

  /* ── toque ── */
  function tocar(x, y) {
    if (!mundo) return;
    var THREE = global.THREE, cam = ra ? ra.cameraAtiva() : camera, r = renderer.domElement.getBoundingClientRect();
    var ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1), cam);
    var alvos = []; mundo.traverse(function (o) { if (o.isMesh && o.visible && (o.userData.gaveta != null || o.userData.folha || o.userData.item || o.userData.capa || o.userData.pagina != null)) alvos.push(o); });
    var h = ray.intersectObjects(alvos, false); if (!h.length) return;
    for (var i = 0; i < h.length; i++) {
      var u = h[i].object.userData;
      if (u.gaveta != null) return mexerGaveta(gavetas[u.gaveta]);
      if (u.folha) { if (!acessivel(u.monte)) continue; return lerFolha(u.monte); }
      if (u.item) { var it = itens.filter(function (x) { return x.item === u.item; })[0]; if (!it || !livre(it)) continue; var m0 = montes.filter(function (x) { return x.item === it; })[0]; if (m0 && !acessivel(m0)) continue; return mostrarItem(it); }
      if (u.capa) return mexerCapa();
      if (u.pagina != null) return lerPagina();
    }
  }
  function mexerGaveta(g) {
    g.aberta = !g.aberta; g.alvo = g.aberta ? 0.36 : 0; if (global.VCTrava) global.VCTrava.bip(g.aberta ? 180 : 140, 0.18, 'triangle', 0.05);
    if (g.aberta) {
      var m = montes.filter(function (x) { return x.gv === g; })[0], wp = g.g.getWorldPosition(new global.THREE.Vector3()), wx = g.z0 != null ? new global.THREE.Box3().setFromObject(g.g).getCenter(new global.THREE.Vector3()).x : 0.35, wy = g.z0 != null ? new global.THREE.Box3().setFromObject(g.g).min.y + 0.05 : wp.y;
      voar([wx, wy + 0.55, 0.95], [wx, wy, 0.36]);
      var resto = m ? m.folhas.length - m.lidas : 0;
      cartao(('Gaveta · ' + (g.nome || '')).toUpperCase(), m ? (resto ? 'Dentro, ' + resto + (resto > 1 ? ' folhas, umas por cima das outras' : ' folha') + '. Toque na de cima para ler.' : (m.item && m.item.mesh.visible ? 'As folhas estão de lado. No fundo, alguma coisa.' : 'As folhas já foram lidas.')) : 'Vazia.');
    } else cartao(('Gaveta · ' + (g.nome || '')).toUpperCase(), 'Fechada.');
  }
  function textoFolha(f) { var h = hashTxt((f.titulo || '') + (f.linhas || []).join('')), sel = f.carimbo !== false; return '<span class="folha-txt"' + (sel ? ' style="--rot:' + ((h % 40) - 20) + 'deg"' : '') + '>' + (sel ? '<em class="carimbo" aria-hidden="true"></em>' : '') + '<b>' + (f.titulo || '') + '</b>\n' + (f.linhas || []).join('\n') + (f.mao ? '<i>' + [].concat(f.mao).join('<br>') + '</i>' : '') + '</span>'; }
  function lerFolha(m) {
    if (m.lidas >= m.folhas.length) return; var me = m.folhas[m.lidas], f = me.userData.folha;
    var wp = me.getWorldPosition(new global.THREE.Vector3()); voar([wp.x, wp.y + 0.42, wp.z + 0.28], [wp.x, wp.y, wp.z]);
    atual = { tipo: 'folha', f: f };
    cartao('FOLHA ' + (m.lidas + 1) + ' DE ' + m.folhas.length, textoFolha(f), [['Tirar de cima ›', function () { tirar(m); }], ['📷 Fotografar', function () { foto(f.titulo || 'Folha', (f.linhas || []).join(' ')); }, true]]);
  }
  function tirar(m) {
    var me = m.folhas[m.lidas]; m.lidas++;
    var de = me.position.clone(), para = m.base.clone().add(new global.THREE.Vector3(m.gv ? -0.02 : -0.24, 0.002 + m.lidas * 0.0025 + 0.03, m.gv ? -0.17 : 0.05)), t = 0, r0 = me.rotation.z;
    animando.push(function (dt) { t = Math.min(1, t + dt / 0.6); var s = suave(t); me.position.lerpVectors(de, para, s); me.position.y += Math.sin(s * Math.PI) * 0.08; me.rotation.z = r0 + s * 0.5; if (m.gv) me.scale.setScalar(1 - 0.35 * s); return t >= 1; });
    if (global.VCTrava) global.VCTrava.bip(900, 0.05, 'triangle', 0.02);
    var resto = m.folhas.length - m.lidas;
    if (resto) lerFolha(m);
    else if (m.item && m.item.mesh.visible) { setTimeout(function () { var wp = m.item.mesh.getWorldPosition(new global.THREE.Vector3()); voar([wp.x, wp.y + 0.35, wp.z + 0.25], [wp.x, wp.y, wp.z]); }, 300); cartao('POR BAIXO DAS FOLHAS', 'Debaixo da última folha, alguma coisa. Toque nela.'); }
    else cartao('O MONTE', 'Nada mais debaixo destas folhas.');
  }
  function mostrarItem(it) {
    var I = it.item; atual = { tipo: 'item', it: it };
    cartao((I.nome || 'ACHADO').toUpperCase(), (I.ico ? I.ico + ' ' : '') + (I.desc || ''), [['Guardar no inventário ›', function () { guardar(it); }]]);
  }
  function guardar(it) {
    var img = instantaneo(); it.mesh.visible = false; if (op.achados) op.achados[it.item.id] = true;
    if (global.VCTrava) { global.VCTrava.bip(660, 0.1, 'sine', 0.07); setTimeout(function () { global.VCTrava.bip(990, 0.14, 'sine', 0.07); }, 110); }
    cartao((it.item.nome || '').toUpperCase(), 'Guardado no inventário.', [['‹ Voltar', function () { fechar(); }, true]]);
    if (op.aoAchar) op.aoAchar(it.item, img);
  }
  function mexerCapa() {
    var c = pasta.capa; c.aberta = !c.aberta; c.alvo = c.aberta ? Math.PI * 0.97 : 0;
    var wp = pasta.g.getWorldPosition(new global.THREE.Vector3()); voar([wp.x + 0.12, wp.y + 0.55, wp.z + 0.3], [wp.x + 0.12, wp.y, wp.z]);
    if (c.aberta) lerPagina(); else cartao((op.pasta.titulo || 'A PASTA').toUpperCase(), 'Fechada.');
  }
  function lerPagina() {
    if (!pasta.capa.aberta) return mexerCapa();
    var p = pasta.paginas[pasta.atual];
    if (!p) { cartao((op.pasta.titulo || 'A PASTA').toUpperCase(), 'Fim da pasta.', [['Fechar a pasta', function () { pasta.paginas.forEach(function (q) { q.alvo = 0; q.virada = false; }); pasta.atual = 0; mexerCapa(); }, true]]); return; }
    atual = { tipo: 'pagina', f: p.f };
    cartao(('Página ' + (pasta.atual + 1) + ' de ' + pasta.paginas.length).toUpperCase(), textoFolha(p.f), [['Virar a página ›', function () { p.alvo = Math.PI * (0.95 - pasta.atual * 0.004); p.virada = true; pasta.atual++; if (global.VCTrava) global.VCTrava.bip(700, 0.04, 'triangle', 0.02); lerPagina(); }], ['📷 Fotografar', function () { foto(p.f.titulo || 'Página', (p.f.linhas || []).join(' ')); }, true]]);
  }
  function instantaneo() { try { renderer.render(cena, ra ? ra.cameraAtiva() : camera); var c = document.createElement('canvas'), W = 640, H = Math.round(640 * renderer.domElement.height / renderer.domElement.width); c.width = W; c.height = H; c.getContext('2d').drawImage(renderer.domElement, 0, 0, W, H); return c.toDataURL('image/jpeg', 0.82); } catch (e) { return ''; } }
  function foto(nome, desc) { var img = instantaneo(); if (op.aoFoto) op.aoFoto({ nome: nome, desc: desc, img: img }); var f = document.createElement('div'); f.style.cssText = 'position:fixed;inset:0;z-index:99;background:#fff;opacity:.8;pointer-events:none;transition:opacity .35s'; document.body.appendChild(f); setTimeout(function () { f.style.opacity = 0; }, 30); setTimeout(function () { f.remove(); }, 420); }

  /* ── RA ── */
  function entrarRA() { if (!ra) return; ra.entrar('ra').then(function () { cartao('NA MESA', 'Aponte para uma mesa até aparecer o círculo e toque em “Pousar aqui”. Depois, as gavetas e as folhas respondem ao toque, como na tela.'); botoesRA(); }).catch(function (e) { cartao('RA', (e && e.message) || 'A câmera não abriu. O objeto segue na tela.'); botoesRA(); }); }
  function pousar() { if (!ra) return; var e = ra.estado(); if (e.modo === 'ra' && !e.temHit) return; if (ra.posicionar()) botoesRA(); }
  function botoesRA() {
    if (!el || !ra) return; var e = ra.estado();
    el.querySelector('#objPousar').hidden = !(e.modo === 'ra' && !e.posta);
    el.querySelector('#objRA').textContent = e.modo === 'ra' ? 'Sair da RA' : 'Pôr na mesa (RA)';
    el.querySelector('#objRA').onclick = e.modo === 'ra' ? function () { ra.sair().then(function () { inicio(); botoesRA(); }); } : entrarRA;
    controles.enabled = e.modo !== 'ra';
  }

  function inicio() { anim = null; var f = camera.aspect < 0.8 ? 1.9 : 1; camera.position.set(0.05 + 0.3 * f, 0.72 + 0.62 * f, 0.05 + 1.05 * f); controles.target.set(0.05, 0.66, 0.05); controles.update(); }
  function abrir(o) {
    op = o || {}; if (!el) criarTela(); el.hidden = false; aberto = true;
    /* o móvel anterior sai já (o novo pode demorar a carregar): nada responde por ele */
    gavetas = []; montes = []; pasta = null; itens = []; animando = []; if (mundo && raiz) { raiz.remove(mundo); mundo = null; }
    el.querySelector('#objTitulo').textContent = op.titulo || 'De perto'; el.querySelector('#objDica').textContent = op.sub || 'Toque nas gavetas, nas folhas e na pasta.';
    cartao((op.titulo || 'DE PERTO').toUpperCase(), op.abertura || 'Gire com um dedo. Toque nas gavetas para abrir; nas folhas, para ler.');
    return carregar().then(function () {
      var fontes = document.fonts && document.fonts.load ? Promise.all(['600 38px Caveat', '500 23px "DM Mono"'].map(function (f) { return document.fonts.load(f).catch(function () {}); })) : Promise.resolve();
      return Promise.race([fontes, new Promise(function (ok) { setTimeout(ok, 1500); })]);
    }).then(function () { return /[?&]sem3d=1/.test(location.search) ? null : carregarGLB(op.glb); }).then(function (cenaG) { op._modelo = cenaG; montarMovel(); redimensionar(); inicio(); renderer.setAnimationLoop(desenhar); });
  }
  function fechar(silencioso) {
    if (silencioso === true) op.aoFechar = null;
    aberto = false; var sai = ra && ra.estado().modo === 'ra' ? ra.sair() : Promise.resolve();
    return sai.then(function () { if (renderer) renderer.setAnimationLoop(null); if (el) el.hidden = true; if (global.VCTrava) global.VCTrava.fechar(); if (op.aoFechar) op.aoFechar(); });
  }
  global.VCObjeto = { abrir: abrir, fechar: fechar, aberto: function () { return aberto; },
    _estado: function () { return { gavetas: gavetas.map(function (g) { return g.aberta; }), montes: montes.map(function (m) { return [m.lidas, m.folhas.length, !!(m.item && m.item.mesh.visible)]; }), pasta: pasta ? pasta.atual : null }; },
    /* gancho de teste: abre tudo e pega os achados, pelo mesmo caminho do dedo */
    _ler: function () { var m = montes.filter(function (x) { return x.lidas < x.folhas.length && acessivel(x); })[0]; if (m) lerFolha(m); return !!m; },
    _vasculhar: function () { gavetas.forEach(function (g) { if (!g.aberta) mexerGaveta(g); }); montes.forEach(function (m) { while (m.lidas < m.folhas.length) { lerFolha(m); tirar(m); } if (m.item && m.item.mesh.visible) guardar(m.item); }); return itens.filter(function (i) { return !i.mesh.visible; }).length; },
    _acao: function (i) { var b = el.querySelector('[data-obj-acao="' + (i || 0) + '"]'); if (b) b.click(); return !!b; } };
})(window);
