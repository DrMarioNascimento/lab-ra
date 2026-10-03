/* O Impostor — o farol e o livro de registro (Cap. 5), com a mão.

   02/10/2026 (Mario: uma peça de RA por capítulo; o farol com o livro no Cap. 5,
   depois que a luz volta). Junta duas peças do laboratório que nunca tinham
   entrado na mesa: o farol em miniatura (modelos/farol_v2.glb, o feixe dá uma
   volta a cada 20 segundos, o mesmo ritmo dos clarões do apagão) e o livro do
   farol (modelos/livro_do_farol_v2.glb). As páginas do livro antigo (chegadas
   pelo portão, datas da versão anterior) não valem mais: as páginas são
   desenhadas aqui, com o texto que a mesa manda pela partida (?paginas=, JSON
   {esq:[linhas], dir:[linhas]}), e a capa também (sem o rabisco da casa antiga).
   02/10 (Mario: "caderno fechado, seria bom até ter várias páginas"; "carimbo,
   não esquecer"): o livro tem várias folhas (?paginas= {folhas:[{titulo, linhas}]},
   completadas com folhas pautadas em branco). Arrastar a página da direita para
   a esquerda vira a folha; a da esquerda para a direita volta. Um toque rápido
   fotografa as duas páginas abertas. O carimbo de tinta (marcas/carimbo_tinta.png,
   padrão de 26/09) vai na primeira página, num canto livre, girado.

   Gestos: girar e aproximar com os dedos; o livro abre pela capa (pegar a borda
   e levantar, como no laboratório) e um toque na página aberta tira a foto
   dela para o inventário. Fala com a mesa: {oi:'farol', evento:'foto', nome, img}. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  var PAG = { esq: ['Registro de serviço'], dir: ['A noite da leitura'] };
  try { var pp = JSON.parse(Q.get('paginas') || 'null'); if (pp) PAG = pp; } catch (e) {}
  var FECHADO = -Math.PI, ABERTO = 0;

  var b = OIBase.criar({
    vista: { alvo: [0.12, 0.12, 0], dist: 1.25, distRetrato: 2.1, dir: [0.2, 0.75, 1] },
    raioDoChao: 0.8, alturaDoAparelho: 0.45, miraEscala: 1.4, exposicao: 0.7,
    textoMira: 'Aponte para uma mesa e toque em Pôr aqui.',
    textoInicio: 'O farol, com o livro de registro do Faroleiro.'
  });

  /* ---------- as páginas e a capa, desenhadas ---------- */
  function folha(titulo, linhas) {
    var W = 1024, H = 1414, c = document.createElement('canvas'); c.width = W; c.height = H; var g = c.getContext('2d');
    g.fillStyle = '#efe6cf'; g.fillRect(0, 0, W, H);
    for (var k = 0; k < 60; k++) { g.fillStyle = 'rgba(150,120,70,' + (Math.random() * 0.05) + ')'; g.beginPath(); g.arc(Math.random() * W, Math.random() * H, 10 + Math.random() * 40, 0, 6.3); g.fill(); }
    g.strokeStyle = '#c9c2b0'; g.lineWidth = 2; for (var y = 170; y < H - 60; y += 64) { g.beginPath(); g.moveTo(40, y); g.lineTo(W - 40, y); g.stroke(); }
    g.strokeStyle = '#d9a3a3'; g.beginPath(); g.moveTo(150, 40); g.lineTo(150, H - 40); g.stroke();
    g.fillStyle = '#10131f'; g.font = 'italic 700 56px Georgia, serif'; g.fillText(titulo, 170, 130);
    g.font = 'italic 600 40px Georgia, serif';
    var yy = 226;
    linhas.forEach(function (l) {                     /* quebra simples em linhas da pauta */
      var m = /^(\d{1,2}h\d{2})\s+—\s+(.*)$/.exec(l), hora = m ? m[1] : '', txt = m ? m[2] : l, pal = txt.split(' '), lin = '';
      if (hora) { g.font = '700 32px Georgia, serif'; g.fillText(hora, 30, yy); g.font = 'italic 600 40px Georgia, serif'; }
      pal.forEach(function (p) { var t = lin ? lin + ' ' + p : p; if (g.measureText(t).width > W - 220) { g.fillText(lin, 170, yy); yy += 64; lin = p; } else lin = t; });
      if (lin) { g.fillText(lin, 170, yy); yy += 64; }
    });
    return c;
  }
  function capa() {
    var W = 1024, H = 1414, c = document.createElement('canvas'); c.width = W; c.height = H; var g = c.getContext('2d');
    g.fillStyle = '#3b2a1e'; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#b08a4a'; g.lineWidth = 4; g.strokeRect(50, 50, W - 100, H - 100); g.lineWidth = 2; g.strokeRect(70, 70, W - 140, H - 140);
    g.save(); g.translate(W / 2, 560); g.strokeStyle = '#b08a4a'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 280, 0, 6.3); g.stroke();
    g.fillStyle = '#c29a55';
    for (var i = 0; i < 8; i++) { g.save(); g.rotate(i * Math.PI / 4); var L = i % 2 ? 150 : 250; g.beginPath(); g.moveTo(0, -L); g.lineTo(i % 2 ? 22 : 34, 0); g.lineTo(0, L * 0.12); g.lineTo(i % 2 ? -22 : -34, 0); g.closePath(); g.globalAlpha = i % 2 ? 0.55 : 0.9; g.fill(); g.restore(); }
    g.globalAlpha = 1; g.font = '600 56px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('N', 0, -340); g.fillText('S', 0, 340); g.fillText('L', 340, 0); g.fillText('O', -340, 0); g.restore();
    g.fillStyle = '#c29a55'; g.textAlign = 'center'; g.font = '600 92px Georgia, serif'; g.fillText('Livro do Farol', W / 2, 1110);
    g.font = '600 44px Georgia, serif'; g.fillText('REGISTRO DE SERVIÇO', W / 2, 1200);
    return c;
  }
  function textura(cv) {                             /* o glTF não vira a textura: desenha de ponta-cabeça */
    var c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height; var g = c.getContext('2d');
    g.translate(0, cv.height); g.scale(1, -1); g.drawImage(cv, 0, 0);
    var t = new THREE.CanvasTexture(c); t.flipY = false; t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; return t;
  }
  /* SUBSTITUIDO 02/10: var cvEsq = folha('Noites anteriores', PAG.esq || []), cvDir = folha('A noite da leitura', PAG.dir || []); */
  var FOLHAS = (PAG.folhas || [{ titulo: 'Noites anteriores', linhas: PAG.esq || [] }, { titulo: 'A noite da leitura', linhas: PAG.dir || [] }]).slice();
  while (FOLHAS.length < 12 || FOLHAS.length % 2) FOLHAS.push({ titulo: '', linhas: [] });
  var CV = FOLHAS.map(function (f) { return folha(f.titulo, f.linhas || []); });
  var cvEsq = CV[0], cvDir = CV[1], TEX = [], par = 0, folheando = null, fotos = {}, matEsq = null, matDir = null;
  function tex(i) { return TEX[i] || (TEX[i] = textura(CV[i])); }
  function plano(i, espelho) {                       /* textura comum (para a folha que vira) */
    var t = new THREE.CanvasTexture(CV[i]); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
    if (espelho) { t.wrapS = THREE.RepeatWrapping; t.repeat.x = -1; t.offset.x = 1; }
    return t;
  }
  function carimbar(img) {                           /* canto de baixo, à direita, girado, sem cobrir texto */
    var g = CV[0].getContext('2d'), L = 300, A = L * img.height / img.width;
    g.save(); g.globalAlpha = 0.85; g.translate(CV[0].width - 60 - L / 2, CV[0].height - 90 - A / 2); g.rotate(-8 * Math.PI / 180);
    g.drawImage(img, -L / 2, -A / 2, L, A); g.restore(); TEX[0] = null;
  }
  var carimboPronto = new Promise(function (ok) {
    var im = new Image(); im.onload = function () { try { carimbar(im); } catch (e) {} ok(); }; im.onerror = function () { ok(); }; im.src = 'marcas/carimbo_tinta.png';
  });

  /* ══ 02/10 (Mario): a portinha do tamanho de um cofre, a 1,5 m do chão, do lado
     oposto à placa de metal, fechada com um cadeado de coração de código (4 dígitos,
     que a mesa manda: ?codigo=1234; o mesmo está desenhado a lápis num papel da
     escrivaninha, no Cap. 2). Dentro: o livro de registro e um rádio portátil.
     Aberta a portinha, o livro e o rádio saem para a mesa, em tamanho de ler. ══ */
  var CODIGO = (Q.get('codigo') || '').replace(/\D/g, '').slice(0, 4);
  var farol, livro, charneira, metade, angulo = FECHADO, animando = null, mixer = null, fotoDada = false;
  var porta = null, cadeado = null, aberta = false, destrancado = !CODIGO, gLivro = null, gRadio = null, saiu = false;
  var anims = [];
  function cor(h) { return new THREE.Color(h).convertSRGBToLinear(); }
  Promise.all([b.carregar(['modelos/farol_v2.glb', 'modelos/livro_do_farol_v2.glb']), carimboPronto]).then(function (rr) {
    var r = rr[0];
    /* o farol: miniatura de uns 70 cm (o modelo está em metros: 24 m de altura) */
    farol = r[0].scene; var g1 = new THREE.Group(); g1.add(farol); b.raiz.add(g1);
    var ESC = 0.7 / 24.22; farol.scale.setScalar(ESC);
    g1.position.set(-0.14, 0, -0.05);
    if (r[0].animations && r[0].animations.length) {
      mixer = new THREE.AnimationMixer(farol); var a = mixer.clipAction(r[0].animations[0]); a.setLoop(THREE.LoopRepeat); a.play();
    }
    ['feixe_luz', 'feixe_nucleo'].forEach(function (n, i) { var o = farol.getObjectByName(n); if (o) feixe(o, i); });
    montarPortinha();
    /* o livro, que sai da portinha para a mesa */
    livro = r[1].scene; gLivro = new THREE.Group(); gLivro.add(livro); b.raiz.add(gLivro);
    gLivro.position.set(0.22, 0.0, 0.12); gLivro.rotation.y = -0.35; gLivro.scale.setScalar(0.62);
    var lb = new THREE.Box3().setFromObject(livro); livro.position.y -= lb.min.y;
    livro.traverse(function (o) {
      if (!o.isMesh || !o.material) return;
      var nm = o.material.name;
      if (nm === 'pagina_esquerda') o.material = matEsq = new THREE.MeshBasicMaterial({ map: tex(0), color: 0xd9d2bf, name: 'pagina_esquerda' });
      if (nm === 'pagina_direita') o.material = matDir = new THREE.MeshBasicMaterial({ map: tex(1), color: 0xd9d2bf, name: 'pagina_direita' });
      if (nm === 'capa_rosa_dos_ventos') { o.material = o.material.clone(); o.material.map = textura(capa()); o.material.needsUpdate = true; }
    });
    charneira = livro.getObjectByName('charneira'); metade = livro.getObjectByName('metade_esquerda');
    por(FECHADO);
    gRadio = radio(); gRadio.position.set(0.04, 0, 0.2); gRadio.rotation.y = 0.5; b.raiz.add(gRadio);
    gLivro.visible = false; gRadio.visible = false;
    b.aCadaQuadro(function (dt) { if (mixer) mixer.update(dt); if (animando) animando(dt); if (folheando) folheando(dt); var vez = anims; anims = []; vez.forEach(function (f) { if (f(dt) !== true) anims.push(f); }); });
    /* gestos */
    b.pega({ rotulo: 'Portinha', alvo: function () { return porta; }, ativa: function () { return !aberta; },
      fim: function (x, y, c) { if (c) return; if (!destrancado) abrirPainel(); else abrirPorta(); } });
    b.pega({ rotulo: 'Cadeado', alvo: function () { return cadeado; }, ativa: function () { return !destrancado; },
      fim: function (x, y, c) { if (!c) abrirPainel(); } });
    b.pega({
      rotulo: 'Borda da capa', alvo: function () { return metade; },
      ancora: function () { return metade.localToWorld(new THREE.Vector3(-0.2, 0.0, 0.1)); },
      ativa: function () { return saiu && !animando && angulo !== ABERTO; },
      mover: function (x, y) { var a = anguloNoDedo(x, y); if (a !== null) por(a); },
      fim: function (x, y, cancelou) { if (angulo === FECHADO && !cancelou) { abrirSozinho(); return; } soltar(); }
    });
    /* SUBSTITUIDO 02/10: b.pega({ rotulo: 'Página', alvo: metade_direita, ..., fim: foto }) — agora arrastar vira a folha, tocar fotografa */
    var x0 = 0, xu = 0;
    function paginaPega(rotulo, nome, sentido) {
      b.pega({ rotulo: rotulo, alvo: function () { return livro.getObjectByName(nome); },
        ativa: function () { return saiu && !animando && !folheando && angulo === ABERTO; },
        inicio: function (x) { x0 = xu = x; }, mover: function (x) { xu = x; },
        fim: function (x, y, c) { if (c) return; var dx = xu - x0;
          if (Math.abs(dx) < 25) { foto(); return; }
          if (sentido > 0 && dx < 0) virar(1); else if (sentido < 0 && dx > 0) virar(-1); } });
    }
    paginaPega('Página da direita', 'folha_direita', 1);
    paginaPega('Página da esquerda', 'folha_esquerda', -1);
    b.pega({ rotulo: 'Rádio', alvo: function () { return gRadio; }, ativa: function () { return saiu; },
      fim: function (x, y, c) { if (!c) b.estado('O rádio portátil do Faroleiro. Foi por ele que o farol falou com a casa naquela noite.');   /* SUBSTITUIDO 02/10 (Mario: o rádio só caracteriza o aparelho que o Faroleiro usou): 'Um rádio portátil, sintonizado no mesmo canal do rádio VHF da casa.' */ } });
    b.pega({ rotulo: 'Farol', alvo: function () { return farol; }, ativa: function () { return true; },
      fim: function (x, y, c) { if (!c) b.estado(aberta ? 'A portinha está aberta.' : 'O feixe dá uma volta a cada vinte segundos. Na torre, do lado oposto à placa, uma portinha de ferro.'); } });
    b.comecar();
    b.estado('O farol. Na torre, do lado oposto à placa, há uma portinha de ferro.');
  }).catch(function (e) { b.estado('O modelo não carregou: ' + (e && e.message || e)); });

  /* 02/10 (Mario): o feixe sem a ponta redonda e perfeita. O cone do modelo ganha
     um material de luz: some aos poucos ao longo do comprimento (a tampa do fim fica
     invisível), as bordas se esfumam conforme o ângulo de quem olha, e há uma poeira
     leve e um tremor quase imperceptível. O giro de 20 s do modelo continua igual. */
  function feixe(o, nucleo) {
    o.geometry.computeBoundingBox(); var bb = o.geometry.boundingBox, sz = bb.getSize(new THREE.Vector3());
    var eixo = sz.x >= sz.y && sz.x >= sz.z ? 0 : (sz.y >= sz.z ? 1 : 2);
    var de = bb.min.getComponent(eixo), ate = bb.max.getComponent(eixo);
    var bmin = bb.min.clone(), bmax = bb.max.clone();
    /* o lado estreito do cone é o da lâmpada: descobre qual ponta é */
    var pos = o.geometry.attributes.position, raioDe = 0, raioAte = 0;
    for (var i = 0; i < pos.count; i++) {
      var v = new THREE.Vector3().fromBufferAttribute(pos, i), t = v.getComponent(eixo), r = 0;
      for (var k = 0; k < 3; k++) if (k !== eixo) { var c = (v.getComponent(k) - (bmin.getComponent(k) + bmax.getComponent(k)) / 2); r += c * c; }
      r = Math.sqrt(r); if (Math.abs(t - de) < 1e-3) raioDe = Math.max(raioDe, r); if (Math.abs(t - ate) < 1e-3) raioAte = Math.max(raioAte, r);
    }
    if (raioDe > raioAte) { var tmp = de; de = ate; ate = tmp; }
    /* o cone fica, mas invisível: a luz agora são três lâminas cruzadas ao longo do
       eixo, com raios desenhados (como a foto do Mario: feixes finos e desiguais que
       saem da lente e se apagam no escuro). Vistas de qualquer lado, parecem volume. */
    o.material.visible = false;
    var L = ate - de, R = Math.max(raioDe, raioAte) * (nucleo ? 1.1 : 1.35), tex = raiosTextura(nucleo);
    var geo = new THREE.BufferGeometry(), pts = [], uv = [];
    function pt(t, y) { var v = new THREE.Vector3(); v.setComponent(eixo, t); var outro = eixo === 1 ? 0 : 1; v.setComponent(outro, y); return v; }
    [[de, -R, 0, 0], [ate, -R, 1, 0], [ate, R, 1, 1], [de, -R, 0, 0], [ate, R, 1, 1], [de, R, 0, 1]].forEach(function (q) {
      var v = pt(q[0], q[1]); pts.push(v.x, v.y, v.z); uv.push(q[2], q[3]); });
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    /* o eixo da lâmina passa pelo centro do cone */
    var c0 = bmin.clone().add(bmax).multiplyScalar(0.5); c0.setComponent(eixo, 0);
    var mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, opacity: nucleo ? 0.55 : 0.75, color: nucleo ? 0xfffaf0 : 0xfff0d6 });
    var eixoV = new THREE.Vector3(); eixoV.setComponent(eixo, 1);
    for (var k = 0; k < 3; k++) {
      var m = new THREE.Mesh(geo, mat); m.position.copy(c0); m.quaternion.setFromAxisAngle(eixoV, k * Math.PI / 3);
      m.renderOrder = 5 + nucleo; o.add(m);
    }
    b.aCadaQuadro(function () { mat.opacity = (nucleo ? 0.55 : 0.75) * (0.97 + 0.03 * Math.sin(performance.now() / 160)); });
  }
  function raiosTextura(nucleo) {
    var W = 1024, H = 512, c = document.createElement('canvas'); c.width = W; c.height = H; var g = c.getContext('2d');
    var sorte = 7 + nucleo * 13; function rnd() { sorte = (sorte * 16807) % 2147483647; return sorte / 2147483647; }
    g.globalCompositeOperation = 'lighter';
    /* um brilho largo e macio por baixo */
    var n = nucleo ? 0.5 : 0.92;
    for (var p = 0; p < 6; p++) {
      var abre = H * n * (0.35 + p * 0.13), gr = g.createLinearGradient(0, 0, W, 0);
      gr.addColorStop(0, 'rgba(255,255,255,0.10)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.04)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(0, H / 2 - 4); g.lineTo(W, H / 2 - abre); g.lineTo(W, H / 2 + abre); g.lineTo(0, H / 2 + 4); g.fill();
    }
    /* os raios: finos, de força e largura desiguais */
    var qtos = nucleo ? 22 : 60;
    for (var r = 0; r < qtos; r++) {
      var y = (rnd() * 2 - 1); y = Math.sign(y) * Math.pow(Math.abs(y), 1.3) * H * n * 0.95;
      var larg = 3 + rnd() * (nucleo ? 14 : 26), forca = 0.04 + rnd() * 0.12, alcance = 0.55 + rnd() * 0.45;
      var gr2 = g.createLinearGradient(0, 0, W * alcance, 0);
      gr2.addColorStop(0, 'rgba(255,255,255,' + forca + ')'); gr2.addColorStop(0.35, 'rgba(255,255,255,' + forca * 0.55 + ')'); gr2.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr2; g.beginPath(); g.moveTo(0, H / 2); g.lineTo(W * alcance, H / 2 + y * alcance - larg); g.lineTo(W * alcance, H / 2 + y * alcance + larg); g.fill();
    }
    /* o nascimento na lente, sem corte */
    g.globalCompositeOperation = 'destination-in';
    var m = g.createLinearGradient(0, 0, W, 0); m.addColorStop(0, 'rgba(0,0,0,0)'); m.addColorStop(0.03, 'rgba(0,0,0,1)'); m.addColorStop(0.75, 'rgba(0,0,0,.85)'); m.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = m; g.fillRect(0, 0, W, H);
    var mv = g.createLinearGradient(0, 0, 0, H); mv.addColorStop(0, 'rgba(0,0,0,0)'); mv.addColorStop(0.3, 'rgba(0,0,0,1)'); mv.addColorStop(0.7, 'rgba(0,0,0,1)'); mv.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = mv; g.fillRect(0, 0, W, H);                /* nem borda de cima nem de baixo */
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
  }

  /* a portinha: 0,5 × 0,42 m, centro a 1,5 m acima do chão da torre (y = 1,8 m no modelo) */
  function montarPortinha() {
    var placa = farol.getObjectByName('placa_farol'), pc = new THREE.Box3().setFromObject(placa).getCenter(new THREE.Vector3());
    farol.worldToLocal(pc);
    var ang = Math.atan2(pc.x, pc.z) + Math.PI, Y = 1.8 + 1.5, RAIO = 2.52;
    var ferro = new THREE.MeshStandardMaterial({ color: cor(0x5a5b60), metalness: 0.7, roughness: 0.45 });
    var escuro = new THREE.MeshStandardMaterial({ color: cor(0x0e0d0c), roughness: 1 });
    var base = new THREE.Group(); base.position.set(Math.sin(ang) * RAIO, Y, Math.cos(ang) * RAIO); base.rotation.y = ang; farol.add(base);
    var vao = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.38, 0.12), escuro); vao.position.z = -0.03; base.add(vao);
    var moldura = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.5, 0.06), ferro); moldura.position.z = -0.02; base.add(moldura);
    vao.position.z = -0.05;
    /* a folha, com a dobradiça do lado esquerdo */
    var dob = new THREE.Group(); dob.position.set(-0.25, 0, 0.05); base.add(dob);
    porta = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.42, 0.035), ferro); porta.position.set(0.25, 0, 0); dob.add(porta);
    porta.userData.dob = dob;
    var aldrava = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 6, 16), ferro); aldrava.position.set(0.47, 0, 0.03); dob.add(aldrava);
    /* o cadeado de coração, pendurado na aldrava, com quatro rodinhas de números */
    cadeado = new THREE.Group(); cadeado.position.set(0.47 + 0.0, -0.09, 0.05); dob.add(cadeado);
    var prata = new THREE.MeshStandardMaterial({ color: cor(0x8f8f94), metalness: 0.85, roughness: 0.3 });
    var s = new THREE.Shape(); s.moveTo(0, -0.07); s.bezierCurveTo(-0.1, 0.0, -0.08, 0.07, 0, 0.035); s.bezierCurveTo(0.08, 0.07, 0.1, 0.0, 0, -0.07);
    var cor_ = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.025, bevelEnabled: true, bevelSize: 0.005, bevelThickness: 0.005, bevelSegments: 2 }), prata); cor_.position.z = -0.0125; cadeado.add(cor_);
    var alca = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.007, 8, 20, Math.PI), prata); alca.position.y = 0.05; cadeado.add(alca);
    cadeado.userData.alca = alca;
    for (var k = 0; k < 4; k++) { var rd = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.012, 10), new THREE.MeshStandardMaterial({ color: cor(0x2a2a2a), metalness: 0.5 })); rd.rotation.z = Math.PI / 2; rd.position.set(-0.03 + k * 0.02, -0.012, 0.022); cadeado.add(rd); }
    if (destrancado) cadeado.visible = false;
    /* dentro: o livro e o rádio, pequenos, antes de sair */
    var dentro = new THREE.Group(); dentro.position.z = -0.02; base.add(dentro);
    var lv = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.15), new THREE.MeshStandardMaterial({ color: cor(0x3b2a1e) })); lv.position.set(-0.08, -0.15, 0); dentro.add(lv);
    var rd2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.04), new THREE.MeshStandardMaterial({ color: cor(0x151515) })); rd2.position.set(0.12, -0.09, 0); dentro.add(rd2);
    porta.userData.dentro = dentro;
  }
  function abrirPorta() {
    if (aberta) return; aberta = true; var dob = porta.userData.dob, t = 0;
    b.vibrar([15, 30, 15]); b.estado('A portinha abriu. Dentro, um livro e um rádio portátil.');
    anims.push(function (dt) { t += dt; dob.rotation.y = -1.9 * b.suave(Math.min(1, t / 0.8)); if (t >= 0.8) { setTimeout(sair, 500); return true; } });
  }
  function sair() {                                   /* o livro e o rádio vêm para a mesa */
    porta.userData.dentro.visible = false; saiu = true;
    [gLivro, gRadio].forEach(function (g, i) {
      var alvo = g.position.clone(), de = alvo.clone().add(new THREE.Vector3(-0.2, 0.35, -0.2)), t = 0, sc = g.scale.x;
      g.visible = true; g.position.copy(de); g.scale.setScalar(sc * 0.2);
      anims.push(function (dt) { t += dt; var u = b.suave(Math.min(1, t / (0.7 + i * 0.2))); g.position.copy(de.clone().lerp(alvo, u)); g.scale.setScalar(sc * (0.2 + 0.8 * u)); if (u >= 1) return true; });
    });
    b.estado('O livro de registro e o rádio portátil do Faroleiro. Abra o livro pela capa.');
  }

  /* o rádio portátil: um rádio genérico de mão (antena, alto-falante, visor e teclado), sem marca */
  function radio() {
    var g = new THREE.Group(), H = 0.13, W = 0.055, D = 0.032;
    var preto = new THREE.MeshStandardMaterial({ color: cor(0x141414), roughness: 0.6 });
    var lat = new THREE.MeshStandardMaterial({ color: cor(0xc8741f), roughness: 0.5 });
    var c = document.createElement('canvas'); c.width = 256; c.height = 600; var x = c.getContext('2d');
    x.fillStyle = '#151515'; x.fillRect(0, 0, 256, 600);
    for (var yy = 0; yy < 9; yy++) for (var xx = 0; xx < 8; xx++) { x.fillStyle = '#050505'; x.beginPath(); x.arc(40 + xx * 25, 40 + yy * 22, 6, 0, 6.3); x.fill(); }
    x.fillStyle = '#9fb59a'; x.fillRect(36, 250, 184, 80); x.fillStyle = '#2c3a2a'; x.font = '600 34px monospace'; x.fillText('146.500', 52, 302);
    var tecl = [['1', '2', '3', 'A'], ['4', '5', '6', 'B'], ['7', '8', '9', 'C'], ['*', '0', '#', 'D']];
    tecl.forEach(function (l, i) { l.forEach(function (t, j) { x.fillStyle = '#222'; x.fillRect(30 + j * 52, 360 + i * 56, 44, 44); x.strokeStyle = '#c8741f'; x.lineWidth = 2; x.strokeRect(30 + j * 52, 360 + i * 56, 44, 44); x.fillStyle = '#ddd'; x.font = '600 22px sans-serif'; x.fillText(t, 45 + j * 52, 390 + i * 56); }); });
    var tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding;
    var mats = [lat, lat, preto, preto, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55 }), preto];
    var corpo = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), mats); corpo.position.y = H / 2; g.add(corpo);
    var ant = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.006, 0.07, 10), preto); ant.position.set(-W * 0.28, H + 0.035, 0); g.add(ant);
    var bot = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.012, 14), preto); bot.position.set(W * 0.25, H + 0.006, 0); g.add(bot);
    g.rotation.x = -0.15;
    return g;
  }

  /* o painel do cadeado: quatro rodinhas de 0 a 9 (no celular, mexer em rodinhas de 2 mm não dá) */
  function abrirPainel() {
    if (document.getElementById('painelCadeado')) return;
    var dig = [0, 0, 0, 0], d = document.createElement('div'); d.id = 'painelCadeado';
    d.style.cssText = 'position:fixed;inset:0;z-index:20;background:rgba(7,6,5,.86);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;font-family:Inter,system-ui,sans-serif;color:#f4ead0';
    d.innerHTML = '<svg viewBox="0 0 120 130" width="150" height="160" aria-hidden="true"><path d="M38 52 V32 a22 22 0 0 1 44 0 V52" fill="none" stroke="#a9a9ae" stroke-width="8"/><path d="M60 124 C10 92 8 58 32 50 C46 45 56 52 60 60 C64 52 74 45 88 50 C112 58 110 92 60 124Z" fill="#8f8f94" stroke="#5f5f64" stroke-width="2"/><circle cx="46" cy="70" r="7" fill="#a9a9ae"/></svg>' +
      '<div id="rodas" style="display:flex;gap:10px"></div><p id="cadMsg" style="min-height:1.3em;margin:0;font-size:14px;color:#c9bba3">Gire as rodinhas e toque em Abrir.</p>' +
      '<div style="display:flex;gap:10px"><button id="cadAbrir" class="forte">Abrir</button><button id="cadSair">Voltar</button></div>';
    document.body.appendChild(d);
    function pinta() { document.getElementById('rodas').innerHTML = dig.map(function (v, i) {
      return '<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><button data-r="' + i + '" data-s="1" style="min-width:52px">▲</button><b style="font:700 34px IBM Plex Mono,monospace;min-width:52px;text-align:center;padding:6px 0;border:1px solid rgba(224,177,58,.4);border-radius:8px;background:#1a1512">' + v + '</b><button data-r="' + i + '" data-s="-1" style="min-width:52px">▼</button></div>'; }).join('');
      d.querySelectorAll('[data-r]').forEach(function (bt) { bt.onclick = function () { var i = +bt.dataset.r; dig[i] = (dig[i] + (+bt.dataset.s) + 10) % 10; pinta(); b.vibrar(5); }; }); }
    pinta();
    document.getElementById('cadSair').onclick = function () { d.remove(); };
    document.getElementById('cadAbrir').onclick = function () {
      if (dig.join('') === CODIGO) { d.remove(); destravar(); }
      else { document.getElementById('cadMsg').textContent = 'Não abriu.'; b.vibrar([30, 40, 30]); }
    };
  }
  function destravar() {
    destrancado = true; var t = 0, alca = cadeado.userData.alca, y0 = alca.position.y;
    b.vibrar([20, 40, 60]); b.estado('O cadeado abriu.');
    anims.push(function (dt) { t += dt; alca.position.y = y0 + 0.03 * Math.min(1, t / 0.3); if (t > 0.3) cadeado.position.y -= dt * 0.5; if (t >= 0.9) { cadeado.visible = false; abrirPorta(); return true; } });
  }

  function por(a) { angulo = a; charneira.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), a); }
  function anguloNoDedo(x, y) {
    var pai = charneira.parent;
    var eixo = new THREE.Vector3(0, 0, 1).transformDirection(pai.matrixWorld);
    var dobra = pai.localToWorld(charneira.position.clone());
    var p = b.dedoNoPlano(x, y, new THREE.Plane().setFromNormalAndCoplanarPoint(eixo, dobra));
    if (!p) return null;
    var v = pai.worldToLocal(p).sub(charneira.position);
    var a = Math.atan2(-v.y, -v.x);
    if (a > 0) a = a > Math.PI / 2 ? FECHADO : ABERTO;
    return Math.max(FECHADO, Math.min(ABERTO, a));
  }
  function anima(alvo) {
    var de = angulo, t = 0, dur = 0.25 + 0.35 * Math.abs(alvo - de) / Math.PI;
    animando = function (dt) {
      t += dt; por(de + (alvo - de) * b.suave(t / dur));
      if (t >= dur) { animando = null; por(alvo); if (alvo === ABERTO) { b.vibrar(12); b.estado('O registro do Faroleiro. Arraste a página para virar a folha; um toque fotografa as duas páginas.'); } else b.estado('O livro do farol.'); }
    };
  }
  /* virar a folha: uma folha solta gira em torno da lombada, com a página de cá na
     frente e a de lá no verso; quando ela deita, as páginas fixas trocam */
  function virar(sentido) {
    var novo = par + sentido; if (folheando || novo < 0 || novo * 2 >= CV.length) return;
    var md = livro.getObjectByName('metade_direita'), g = new THREE.Group(); g.position.set(0, 0.0215, 0); md.add(g);
    var geo = new THREE.PlaneGeometry(0.205, 0.275); geo.rotateX(-Math.PI / 2); geo.translate(0.1025, 0, 0);
    var frenteI = sentido > 0 ? 2 * par + 1 : 2 * novo + 1, versoI = sentido > 0 ? 2 * novo : 2 * par;
    g.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: plano(frenteI), color: 0xd9d2bf, side: THREE.FrontSide })));
    g.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: plano(versoI, true), color: 0xd9d2bf, side: THREE.BackSide })));
    var a0 = sentido > 0 ? 0 : Math.PI, a1 = Math.PI - a0, t = 0;
    if (sentido > 0) matDir.map = tex(2 * novo + 1); else matEsq.map = tex(2 * novo);
    g.rotation.z = a0; b.vibrar(6);
    folheando = function (dt) {
      t += dt; var u = b.suave(Math.min(1, t / 0.55)); g.rotation.z = a0 + (a1 - a0) * u; g.position.y = 0.0215 + Math.sin(u * Math.PI) * 0.004;
      if (u >= 1) { if (sentido > 0) matEsq.map = tex(2 * novo); else matDir.map = tex(2 * novo + 1); md.remove(g); par = novo; folheando = null;
        var vazia = !FOLHAS[2 * par].linhas.length && !FOLHAS[2 * par + 1].linhas.length;
        b.estado(vazia ? 'Folhas em branco.' : 'Páginas ' + (2 * par + 1) + ' e ' + (2 * par + 2) + '. Um toque fotografa as duas.'); }
    };
  }
  function soltar() { anima(angulo > -0.62 * Math.PI ? ABERTO : FECHADO); }
  function abrirSozinho() { anima(ABERTO); }
  function foto() {
    /* SUBSTITUIDO 02/10: uma foto só, 'Livro do farol (o registro da noite)'. Agora uma foto por par de páginas. */
    var e_ = 2 * par, d_ = e_ + 1, nome = 'Livro do farol, páginas ' + (e_ + 1) + ' e ' + (d_ + 1);
    b.estado('Foto das páginas ' + (e_ + 1) + ' e ' + (d_ + 1) + ' guardada no inventário.'); b.vibrar(10);
    if (fotos[par]) return; fotos[par] = true; fotoDada = true;
    var c = document.createElement('canvas'); c.width = 1400; c.height = 1000; var g = c.getContext('2d');
    g.fillStyle = '#1a1410'; g.fillRect(0, 0, 1400, 1000);
    g.drawImage(CV[e_], 20, 20, 670, 925); g.drawImage(CV[d_], 710, 20, 670, 925);
    try { if (parent !== window) parent.postMessage({ oi: 'farol', evento: 'foto', nome: nome, img: c.toDataURL('image/jpeg', 0.85) }, location.origin); } catch (e) {}
  }
  window.OIFarol = { virar: virar, par: function () { return par; }, aberto: function () { return angulo === ABERTO; }, abrir: abrirSozinho, foto: foto, painel: abrirPainel, codigo: function () { return CODIGO; },
    destravar: destravar, portaAberta: function () { return aberta; }, saiu: function () { return saiu; },
    portaNaTela: function () { return b.naTela(porta.getWorldPosition(new THREE.Vector3())); },
    cam: function (px, py, pz, tx, ty, tz) { b.controles.target.set(tx, ty, tz); b.camera.position.set(px, py, pz); b.camera.lookAt(tx, ty, tz); b.controles.update(); },
    olhar: function (alvo, dist) { var p = alvo === 'porta' ? porta.getWorldPosition(new THREE.Vector3()) : (alvo === 'livro' ? livro.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3(0, 0.2, 0)); b.controles.target.copy(p); var dir = alvo === 'porta' ? porta.getWorldDirection(new THREE.Vector3()) : new THREE.Vector3(0, 0.9, 0.4); b.camera.position.copy(p).add(dir.normalize().multiplyScalar(dist || 0.35)); b.camera.lookAt(p); b.controles.update(); } };
})();
