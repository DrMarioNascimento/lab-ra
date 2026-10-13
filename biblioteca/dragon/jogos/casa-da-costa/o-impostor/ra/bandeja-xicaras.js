/* O Impostor — o aparador da sala (Capítulo 1), com a mão.

   01/10/2026 (auditoria, alinhado ao cânone): substitui a versão de sete
   xícaras (guardada em ra/bandeja-xicaras_SUBSTITUIDO.js). No cânone a xícara
   de outro jogo está SOZINHA no aparador: borda verde, um dedo de café frio e
   uma película por cima. A bandeja ao lado tem as SEIS xícaras da louça da sala
   (filete azul, carimbo da casa). As seis continuam com o enigma: viram pela
   alça, o fundo raspa e, postas em ordem, mostram que a louça da sala está
   completa. A xícara sozinha não vira (tem café): um toque tira a foto dela,
   que vai para o inventário. Sem marca de jasmim (seria do Cap. 4).

   (texto original abaixo)

   Mario, 28/09/2026: sete xícaras iguais por fora. Cada uma se VIRA (arrastar
   para cima) e o fundo se RASPA com o dedo, como raspadinha. Debaixo de cada
   raspadinha há um sinal (número, conta ou letra, conforme a partida). Seis
   formam uma sequência; a sétima não se encaixa em lugar nenhum. As xícaras se
   ARRASTAM para os lados na bandeja: quando as seis ficam em ordem e a sétima
   sobra numa ponta, a poeira do fundo sai e aparece a pista — a xícara que
   sobra é de OUTRO jogo, o de borda verde do quarto dos fundos (sem o carimbo Dragon Games das outras seis, uma florzinha de jasmim, fundo
   limpo; as da casa têm pó de cinco meses). Debaixo de uma das seis, junto do
   sinal, há um envio extra (muda por partida e por jogador).

   Nada marca o que se mexe: descobrir que a xícara vira e que o fundo raspa é
   parte da investigação. Mario, 29/09/2026: a xícara se vira PELA ALÇA (pegar a
   alça e arrastar: ela tomba em volta da própria alça, acompanhando o dedo);
   pegar o corpo arrasta de lado. A marca da casa é um carimbo de louça (azul-
   cobalto sob o esmalte), pequeno, abaixo do sinal. As xícaras são provisórias (modeladas aqui); a arte
   final entra no lugar com os mesmos nomes.

   Fala com a mesa por postMessage: {oi:'bandeja', evento:'envio'} e
   {oi:'bandeja', evento:'pista', nome, img}. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  var PARTIDA = Q.get('partida') || 'P-DEMO', JOGADOR = Q.get('jogador') || '0';
  var N = 6, PASSO = 0.1, ALTURA = 0.065, RAIO_FUNDO = 0.0232, RAIO_TOQUE = 0.04, S = 512, U = 256;
  /* os fundos são desenhados em 256 unidades num canvas de 512 px (mais nítido) */
  function ctx(c) { var g = c.getContext('2d'); g.setTransform(S / U, 0, 0, S / U, 0, 0); return g; }

  /* ---------------- o enigma desta partida ---------------- */
  var r = OISorteio.gerador(PARTIDA, JOGADOR, 'bandeja');
  var modos = ['pares', 'triplos', 'contas', 'letras'];
  var modo = Q.get('modo') || r.escolher(modos);
  var seq, intruso, tipo = 'numero';
  function conta(v) {                       /* uma conta pequena cujo resultado é v */
    var op = r.escolher(['+', '-', 'x']);
    if (op === 'x') { var ds = []; for (var d = 2; d <= 6; d++) if (v % d === 0 && v / d <= 6 && v / d >= 2) ds.push(d); if (ds.length) { var a = r.escolher(ds); return a + '×' + (v / a); } op = '+'; }
    if (op === '+') { var p = r.inteiro(1, Math.max(1, v - 1)); return p + '+' + (v - p); }
    var q = r.inteiro(1, 6); return (v + q) + '−' + q;
  }
  if (modo === 'letras') {
    tipo = 'letra';
    var palavra = r.escolher(['LACRES', 'CHUVAS', 'CORDAS']);
    seq = palavra.split('');
    intruso = r.escolher('BFGJKQXZ'.split('').filter(function (l) { return palavra.indexOf(l) < 0; }));
  } else if (modo === 'triplos') {
    seq = [3, 6, 9, 12, 15, 18]; intruso = r.escolher([4, 5, 7, 8, 10, 11, 13, 14, 16, 17]);
  } else {
    seq = [2, 4, 6, 8, 10, 12]; intruso = r.escolher([3, 5, 7, 9, 11]);
  }
  var itens = seq.map(function (v, i) { return { valor: v, ordem: i, intruso: false }; });
  itens.forEach(function (it) { it.texto = modo === 'contas' ? conta(it.valor) : String(it.valor); });
  var envioEm = r.inteiro(0, 5);            /* índice (na sequência) da xícara com o envio */
  itens[envioEm].envio = true;
  var ordemInicial = r.embaralhar(itens.map(function (_, i) { return i; }));

  /* ---------------- cena ---------------- */
  var b = OIBase.criar({
    vista: { alvo: [0.06, 0.05, 0.02], dist: 0.95, distRetrato: 1.9, dir: [0, 1.5, 0.55] },
    raioDoChao: 0.7, alturaDoAparelho: 0.45, miraEscala: 1.2, exposicao: 0.95,
    textoMira: 'Aponte para uma mesa e toque em Pôr aqui.',
    textoInicio: 'O aparador da sala.',
    deNovo: null
  });

  /* bambu: dourado claro, fibras retas e finas, com as faixas das lâminas coladas */
  function bambu() {
    var c = document.createElement('canvas'); c.width = 1024; c.height = 256; var g = c.getContext('2d');
    g.fillStyle = '#a2652a'; g.fillRect(0, 0, 1024, 256);
    for (var l = 0; l < 256; l += 32) { g.fillStyle = 'rgba(' + (150 + Math.random() * 60 | 0) + ',' + (95 + Math.random() * 40 | 0) + ',40,' + (0.04 + Math.random() * 0.06) + ')'; g.fillRect(0, l, 1024, 32); }
    for (var i = 0; i < 420; i++) {
      var y = Math.random() * 256; g.strokeStyle = Math.random() < 0.5 ? 'rgba(140,85,30,' + (0.08 + Math.random() * 0.18) + ')' : 'rgba(255,225,160,' + (0.06 + Math.random() * 0.12) + ')';
      g.lineWidth = 0.5 + Math.random() * 1.2; g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y + Math.random() * 2 - 1); g.stroke();
    }
    var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; return t;
  }
  function retRedondo(w, h, r, caminho) {
    var p = caminho || new THREE.Shape();
    p.moveTo(-w / 2 + r, -h / 2); p.lineTo(w / 2 - r, -h / 2); p.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    p.lineTo(w / 2, h / 2 - r); p.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); p.lineTo(-w / 2 + r, h / 2);
    p.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); p.lineTo(-w / 2, -h / 2 + r); p.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return p;
  }
  /* Bandeja de bambu maciço (Mario, 29/09/2026, pela referência): cantos
     arredondados, o miolo rebaixado na própria peça e, nas cabeceiras, alças de
     barra dourada sobre dois pés. */
  var bandeja = new THREE.Group(); b.raiz.add(bandeja); bandeja.position.y = 0.0125;   /* o fundo da bandeja pousa no chão (y = 0) */
  var texB = bambu();
  var matBambu = new THREE.MeshStandardMaterial({ map: texB, roughness: 0.42, metalness: 0.0 });
  var LARG = PASSO * N + 0.09, FUNDO_B = 0.2, CAB = 0.036, LAT = 0.014, PISO = 0.008, BORDA = 0.02;
  function aplicarUV(g, w, h) {                           /* uv planar, fibras ao longo do comprimento */
    var pos = g.attributes.position, uv = new Float32Array(pos.count * 2);
    for (var i = 0; i < pos.count; i++) { uv[i * 2] = (pos.getX(i) + w / 2) / w; uv[i * 2 + 1] = (pos.getY(i) + h / 2) / h * 0.35 + pos.getZ(i) * 3; }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g;
  }
  var gPiso = new THREE.ExtrudeGeometry(retRedondo(LARG, FUNDO_B, 0.03), { depth: PISO, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 3, curveSegments: 12 });
  aplicarUV(gPiso, LARG, FUNDO_B);
  var piso = new THREE.Mesh(gPiso, matBambu); piso.rotation.x = -Math.PI / 2; piso.position.y = -PISO - 0.002; bandeja.add(piso);
  var aro = retRedondo(LARG, FUNDO_B, 0.03); aro.holes.push(retRedondo(LARG - 2 * CAB, FUNDO_B - 2 * LAT, 0.014, new THREE.Path()));
  var gAro = new THREE.ExtrudeGeometry(aro, { depth: BORDA, bevelEnabled: true, bevelThickness: 0.0025, bevelSize: 0.0022, bevelSegments: 4, curveSegments: 14 });
  aplicarUV(gAro, LARG, FUNDO_B);
  var borda = new THREE.Mesh(gAro, matBambu); borda.rotation.x = -Math.PI / 2; borda.position.y = -0.001; bandeja.add(borda);
  var ouro = new THREE.MeshStandardMaterial({ color: 0xe0b44a, metalness: 1, roughness: 0.22 });
  var ALT_ALCA = 0.034, VAO = 0.13;
  [1, -1].forEach(function (lado) {
    var alca = new THREE.Group(); alca.position.set(lado * (LARG / 2 - CAB / 2), BORDA, 0); bandeja.add(alca);
    var barra = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, VAO + 0.05, 24), ouro); barra.rotation.x = Math.PI / 2; barra.position.y = ALT_ALCA; alca.add(barra);
    [1, -1].forEach(function (k) {
      var ponta = new THREE.Mesh(new THREE.SphereGeometry(0.0055, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), ouro);
      ponta.rotation.x = k * Math.PI / 2; ponta.position.set(0, ALT_ALCA, k * (VAO + 0.05) / 2); ponta.scale.set(1, 0.35, 1); alca.add(ponta);
      var pe = new THREE.Mesh(new THREE.CylinderGeometry(0.0036, 0.0042, ALT_ALCA, 16), ouro); pe.position.set(0, ALT_ALCA / 2, k * VAO / 2); alca.add(pe);
      var roseta = new THREE.Mesh(new THREE.CylinderGeometry(0.0062, 0.0066, 0.0015, 20), ouro); roseta.position.set(0, 0.0008, k * VAO / 2); alca.add(roseta);
    });
  });
  /* A marca Dragon Games fica no fundo das seis xícaras da casa (o carimbo), não na bandeja. */

  /* ---------------- as xícaras ---------------- */
  var porcelana = new THREE.MeshStandardMaterial({ color: 0xf6f2ea, roughness: 0.18, metalness: 0.02 });
  var filete = new THREE.MeshStandardMaterial({ color: 0x2f5e8c, roughness: 0.35 });
  /* perfil de xícara de chá: pé em anel (o fundo fica rebaixado dentro dele), bojo e boca */
  var perfil = [[0.0232, 0.0032], [0.0236, 0.0006], [0.0258, 0], [0.027, 0.0022], [0.0262, 0.0062], [0.03, 0.011], [0.036, 0.02], [0.041, 0.032],
    [0.0445, 0.046], [0.0462, 0.058], [0.0468, ALTURA - 0.001], [0.0462, ALTURA], [0.0448, ALTURA - 0.0005], [0.0438, 0.057], [0.0418, 0.045],
    [0.037, 0.032], [0.031, 0.021], [0.022, 0.0135], [0.01, 0.0112], [0, 0.011]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
  var geoCorpo = new THREE.LatheGeometry(perfil, 56);
  /* alça em orelha: sai perto da boca, faz a curva e volta rente ao bojo, mais fina embaixo */
  var curvaAlca = new THREE.CatmullRomCurve3([[0.0435, 0.054], [0.055, 0.058], [0.0655, 0.052], [0.068, 0.041], [0.0625, 0.029], [0.051, 0.021], [0.0365, 0.0185]]
    .map(function (p) { return new THREE.Vector3(p[0], p[1], 0); }));
  var geoAlca = new THREE.TubeGeometry(curvaAlca, 48, 0.0043, 12, false);
  (function afinar(g) {                                   /* achata de lado e afina na ponta de baixo */
    var pos = g.attributes.position, n = 48 + 1, rad = 12 + 1;
    for (var i = 0; i < n; i++) {
      var c = curvaAlca.getPointAt(i / 48), k = 1 - 0.35 * Math.max(0, (i / 48 - 0.55) / 0.45);
      for (var j = 0; j < rad; j++) {
        var v = i * rad + j, x = pos.getX(v) - c.x, y = pos.getY(v) - c.y, z = pos.getZ(v);
        pos.setXYZ(v, c.x + x * k, c.y + y * k, z * 0.72 * k);
      }
    }
    pos.needsUpdate = true; g.computeVertexNormals();
  })(geoAlca);
  var DIR_ALCA = -1.05;                                  /* a alça aponta para quem olha, um pouco à direita */
  /* depois de tombar em volta da alça, o fundo tem de ficar de pé para quem olha:
     gira o desenho no próprio plano o tanto que o tombo vai desfazer */
  var GIRO_FUNDO = (function () {
    var dx = Math.cos(DIR_ALCA), dz = -Math.sin(DIR_ALCA), wd = -dz;
    return -Math.atan2(2 * wd * dx, 2 * wd * dz + 1);
  })();
  var geoFilete = new THREE.TorusGeometry(0.0463, 0.0011, 6, 64);

  /* Marca de fábrica das seis da casa: o carimbo Dragon Games impresso como
     carimbo de louça — uma cor só (azul-cobalto sob o esmalte), traço um pouco
     espalhado pela queima, pequeno e abaixo do sinal (Mario, 29/09/2026). */
  var carimbo = new Image(), cobalto = null;
  carimbo.onload = function () {
    var c = document.createElement('canvas'); c.width = c.height = 320; var g = c.getContext('2d');
    g.drawImage(carimbo, 0, 0, 320, 320);
    var d = g.getImageData(0, 0, 320, 320), p = d.data;
    for (var i = 0; i < p.length; i += 4) {                 /* tinta = o que é escuro no carimbo */
      var lum = (p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11) / 255, a = (p[i + 3] / 255) * Math.min(1, Math.max(0, (0.93 - lum) * 1.9));
      if (Math.random() < 0.04) a *= 0.45;                  /* falhas de impressão */
      p[i] = 32; p[i + 1] = 62; p[i + 2] = 138; p[i + 3] = a * 255;
    }
    g.putImageData(d, 0, 0);
    cobalto = document.createElement('canvas'); cobalto.width = cobalto.height = 320;
    var g2 = cobalto.getContext('2d'); g2.filter = 'blur(0.7px)'; g2.drawImage(c, 0, 0); g2.filter = 'none'; g2.globalAlpha = 0.55; g2.drawImage(c, 0, 0);
    xicaras.forEach(function (x) { if (resolvido) { desenharConteudo(x.userData.item, ctx(x.userData.cc), true); compor(x); } });
  };
  carimbo.src = 'marcas/carimbo_xicara.webp';
  var MARCA_Y = 186, MARCA_R = 40;                          /* lugar do carimbo, em unidades de 256 */
  function marcaDaCasa(g, cx, cy) {
    if (!cobalto) return;
    g.save(); g.translate(cx, cy); g.rotate(-0.08); g.globalAlpha = 0.92;
    g.drawImage(cobalto, -MARCA_R, -MARCA_R, MARCA_R * 2, MARCA_R * 2); g.restore();
  }
  function marcaDeFora(g, cx, cy) {          /* outra fábrica, outra louça: um jasmim pintado à mão, em sépia */
    g.save(); g.translate(cx, cy); g.strokeStyle = '#7a4a2a'; g.lineWidth = 1.2;
    g.setLineDash([3, 3]); g.beginPath(); g.arc(0, 0, MARCA_R - 4, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
    for (var i = 0; i < 5; i++) { g.save(); g.rotate(i * Math.PI * 2 / 5); g.fillStyle = '#fbfaf3'; g.strokeStyle = '#8a6a44'; g.lineWidth = 1.1; g.beginPath(); g.ellipse(0, -11, 6, 11, 0, 0, Math.PI * 2); g.fill(); g.stroke(); g.restore(); }
    g.fillStyle = '#d9a93a'; g.beginPath(); g.arc(0, 0, 3.4, 0, Math.PI * 2); g.fill();
    g.font = 'italic 600 8px Georgia, serif'; g.fillStyle = '#7a4a2a'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('pintado à mão', 0, MARCA_R - 12);
    g.restore();
  }
  function arco(g, txt, raio, centro, baixo) {   /* texto em arco: em cima lê por fora, embaixo lê por dentro */
    var passo = 0.085, A = txt.length * passo;
    for (var i = 0; i < txt.length; i++) {
      var a = baixo ? centro + A / 2 - passo / 2 - i * passo : centro - A / 2 + passo / 2 + i * passo;
      g.save(); g.translate(Math.cos(a) * raio, Math.sin(a) * raio); g.rotate(baixo ? a - Math.PI / 2 : a + Math.PI / 2);
      g.textBaseline = 'middle'; g.fillText(txt[i], 0, 0); g.restore();
    }
  }
  function desenharConteudo(it, g, resolvida) {
    g.clearRect(0, 0, U, U);
    /* esmalte do fundo, com o anel do pé sem esmalte por fora */
    g.fillStyle = '#f7f3ec'; g.beginPath(); g.arc(U / 2, U / 2, U / 2, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(190,178,158,.55)'; g.lineWidth = 5; g.beginPath(); g.arc(U / 2, U / 2, U / 2 - 3, 0, Math.PI * 2); g.stroke();
    var t = it.texto; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#0c1219';
    if (!resolvida) {
      g.font = '800 ' + (t.length > 3 ? 54 : t.length > 2 ? 70 : 100) + 'px Georgia, serif';
      g.fillText(t, U / 2, U / 2 + (it.envio ? -12 : 4));
      if (it.envio) { g.font = '700 24px Georgia, serif'; g.fillStyle = '#7a5a10'; g.fillText('✉ +1 envio', U / 2, U / 2 + 44); }
      return;
    }
    /* resolvida: o sinal sobe, e aparece a marca de fábrica embaixo */
    g.font = '800 ' + (t.length > 3 ? 40 : t.length > 2 ? 52 : 72) + 'px Georgia, serif';
    g.fillText(t, U / 2, it.envio ? 84 : 96);
    if (it.envio) { g.font = '700 17px Georgia, serif'; g.fillStyle = '#7a5a10'; g.fillText('✉ +1 envio', U / 2, 124); }
    if (it.intruso) {                                    /* o jogo de borda verde, do quarto dos fundos */
      g.strokeStyle = '#3f8a5c'; g.lineWidth = 7; g.beginPath(); g.arc(U / 2, U / 2, U / 2 - 7, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = '#2f6e48'; g.lineWidth = 1.5; g.beginPath(); g.arc(U / 2, U / 2, U / 2 - 13, 0, Math.PI * 2); g.stroke();
    }
    (it.intruso ? marcaDeFora : marcaDaCasa)(g, U / 2, MARCA_Y);
  }

  var xicaras = [];
  itens.forEach(function (it, i) {
    var x = new THREE.Group(); x.userData.item = it;
    var corpo = new THREE.Mesh(geoCorpo, porcelana); x.add(corpo);
    var f = new THREE.Mesh(geoFilete, filete); f.rotation.x = Math.PI / 2; f.position.y = ALTURA - 0.004; x.add(f);
    /* a xícara tomba em volta da alça: 'corpo' é o que gira, x é o que anda na bandeja */
    var giro = new THREE.Group(); x.add(giro);
    giro.remove(corpo); x.remove(corpo); giro.add(corpo); x.remove(f); giro.add(f);
    var alca = new THREE.Mesh(geoAlca, porcelana); alca.rotation.y = DIR_ALCA; giro.add(alca);
    /* área de toque da alça, maior que a alça (o dedo é grosso) */
    var pegaAlca = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.05, 0.03), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    pegaAlca.position.set(0.058, 0.038, 0); var suporte = new THREE.Group(); suporte.rotation.y = DIR_ALCA; suporte.add(pegaAlca); giro.add(suporte);
    /* o fundo: conteúdo + raspadinha (centro) + pó (anel), num só canvas mostrado */
    var cc = document.createElement('canvas'); cc.width = cc.height = S;
    var cr = document.createElement('canvas'); cr.width = cr.height = S;
    var cm = document.createElement('canvas'); cm.width = cm.height = S;
    var gr = ctx(cr);
    var grad = gr.createRadialGradient(U / 2, U / 2, 10, U / 2, U / 2, 70); grad.addColorStop(0, '#c7c9cc'); grad.addColorStop(1, '#9fa3a8');
    gr.fillStyle = '#d8d0c2'; gr.beginPath(); gr.arc(U / 2, U / 2, U / 2, 0, Math.PI * 2); gr.fill();                  /* pó */
    for (var k = 0; k < 400; k++) { gr.fillStyle = 'rgba(120,105,85,' + Math.random() * 0.25 + ')'; gr.fillRect(Math.random() * U, Math.random() * U, 2, 2); }
    gr.fillStyle = grad; gr.beginPath(); gr.arc(U / 2, U / 2, 66, 0, Math.PI * 2); gr.fill();                            /* prata */
    for (k = 0; k < 160; k++) { gr.fillStyle = 'rgba(255,255,255,' + Math.random() * 0.35 + ')'; gr.fillRect(U / 2 - 60 + Math.random() * 120, U / 2 - 60 + Math.random() * 120, 1, 1); }
    var tex = new THREE.CanvasTexture(cm); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4;
    var fundo = new THREE.Mesh(new THREE.CircleGeometry(RAIO_FUNDO, 40), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.22, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 }));
    fundo.rotation.set(Math.PI / 2, 0, GIRO_FUNDO); fundo.position.y = 0.0028; giro.add(fundo);
    /* área de toque para raspar, um pouco maior que o fundo (o dedo é grosso) */
    var toque = new THREE.Mesh(new THREE.CircleGeometry(RAIO_TOQUE, 24), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    toque.rotation.copy(fundo.rotation); toque.position.y = -0.002; giro.add(toque);
    x.userData = { item: it, giro: giro, pegaAlca: pegaAlca, fundo: fundo, toque: toque, cc: cc, cr: cr, cm: cm, tex: tex, virada: false, raspado: 0, pego: false, slot: 0, alvoX: 0 };
    desenharConteudo(it, ctx(cc), false); compor(x);
    bandeja.add(x); xicaras.push(x);
  });
  function xDoSlot(s) { return (s - (N - 1) / 2) * PASSO; }
  ordemInicial.forEach(function (idx, s) { var x = xicaras[idx]; x.userData.slot = s; x.position.set(xDoSlot(s), 0, 0.005); });

  function compor(x) {
    var u = x.userData, g = ctx(u.cm);
    g.clearRect(0, 0, U, U); g.drawImage(u.cc, 0, 0, U, U); g.drawImage(u.cr, 0, 0, U, U);
    if (u.brilho) { g.fillStyle = 'rgba(255,255,255,' + (0.18 * u.brilho) + ')'; g.beginPath(); g.ellipse(U * 0.4, U * 0.35, 60, 26, -0.6, 0, Math.PI * 2); g.fill(); }
    if (u.po) { g.fillStyle = 'rgba(150,135,110,' + u.po + ')'; g.beginPath(); g.arc(U / 2, U / 2, U / 2, 0, Math.PI * 2); g.fill(); }
    u.tex.needsUpdate = true;
  }
  function raspar(x, uvToque) {
    var k = RAIO_TOQUE / RAIO_FUNDO, uv = { x: 0.5 + (uvToque.x - 0.5) * k, y: 0.5 + (uvToque.y - 0.5) * k };
    var u = x.userData, g = ctx(u.cr);
    var px = uv.x * U, py = (1 - uv.y) * U;
    g.save(); g.globalCompositeOperation = 'destination-out'; g.fillStyle = g.strokeStyle = '#000';
    g.beginPath(); g.arc(px, py, 15, 0, Math.PI * 2); g.fill();
    if (u.ultimo) { g.lineWidth = 30; g.lineCap = 'round'; g.beginPath(); g.moveTo(u.ultimo[0], u.ultimo[1]); g.lineTo(px, py); g.stroke(); }
    g.restore(); u.ultimo = [px, py];
    /* não deixa raspar o pó do anel: só a prata do meio sai com o dedo */
    var d = Math.hypot(px - U / 2, py - U / 2);
    if (d > 70) { repintarPo(x); }
    compor(x);
  }
  function repintarPo(x) {
    var u = x.userData, g = ctx(u.cr);
    g.save(); g.globalCompositeOperation = 'destination-over';
    g.beginPath(); g.arc(U / 2, U / 2, U / 2, 0, Math.PI * 2); g.arc(U / 2, U / 2, 68, 0, Math.PI * 2, true);
    g.fillStyle = '#d8d0c2'; g.fill(); g.restore();
  }
  function medirRaspado(x) {
    var u = x.userData, L = 100 * S / U, d = u.cr.getContext('2d').getImageData(S / 2 - L / 2, S / 2 - L / 2, L, L).data, livre = 0, tot = 0;
    for (var i = 0; i < d.length; i += 16) { var px = (i / 4) % L - L / 2, py = Math.floor(i / 4 / L) - L / 2; if (px * px + py * py > L * L / 4) continue; tot++; if (d[i + 3] < 40) livre++; }
    return tot ? livre / tot : 0;
  }

  /* ---------------- gestos ---------------- */
  var animando = [], resolvido = false, envioDado = false;
  b.aCadaQuadro(function (dt) {
    animando = animando.filter(function (f) { return f(dt) !== true; });
    xicaras.forEach(function (x) { var u = x.userData; if (!u.pego && !u.virando) x.position.x += (xDoSlot(u.slot) - x.position.x) * Math.min(1, dt * 12); });
  });
  /* pose de tombamento: s = 0 em pé, 1 de boca para baixo; gira em volta do eixo da alça */
  var EIXO = new THREE.Vector3(Math.cos(DIR_ALCA), 0, -Math.sin(DIR_ALCA)).normalize();
  function pose(x, s) {
    var u = x.userData; u.s = s;
    u.giro.quaternion.setFromAxisAngle(EIXO, Math.PI * s);
    u.giro.position.y = ALTURA * b.suave(s) + Math.sin(Math.PI * s) * 0.03;
  }
  function assentar(x, alvo, dur) {
    var u = x.userData; u.virando = true; var s0 = u.s || 0, t = 0;
    animando.push(function (dt) {
      t = Math.min(1, t + dt / dur); pose(x, s0 + (alvo - s0) * b.suave(t));
      if (t >= 1) { u.virando = false; if (alvo === 1) { u.virada = true; b.vibrar(12); } return true; }
    });
  }
  function virar(x) { var u = x.userData; if (u.virada || u.virando) return; assentar(x, 1, 0.55); }
  xicaras.forEach(function (x) {
    var u = x.userData, x0, y0, modoGesto, plano, dx0;
    b.pega({
      rotulo: 'Xícara',
      alvo: function () { return x; },
      ativa: function () { return !u.virando && !resolvido; },
      inicio: function (sx, sy) {
        x0 = sx; y0 = sy; modoGesto = null; u.ultimo = null;
        var raio = b.raioDoDedo(sx, sy), h = raio.intersectObject(u.toque, false)[0];
        if (u.virada && h && h.uv) { modoGesto = 'raspar'; raspar(x, h.uv); }
        else if (!u.virada && raio.intersectObject(u.pegaAlca, false)[0]) { modoGesto = 'virar'; b.vibrar(6); }
        var p = x.getWorldPosition(new THREE.Vector3());
        plano = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0).transformDirection(bandeja.matrixWorld), p);
        var q = b.dedoNoPlano(sx, sy, plano); dx0 = q ? bandeja.worldToLocal(q).x - x.position.x : 0;
      },
      mover: function (sx, sy) {
        if (modoGesto === 'raspar') {
          var h = b.raioDoDedo(sx, sy).intersectObject(u.toque, false)[0];
          if (h && h.uv) raspar(x, h.uv); else u.ultimo = null;
          return;
        }
        if (modoGesto === 'virar') {                     /* a xícara acompanha o dedo que puxa a alça */
          pose(x, Math.max(0, Math.min(1, Math.hypot(sx - x0, sy - y0) / 150)));
          return;
        }
        if (!modoGesto) {
          if (Math.hypot(sx - x0, sy - y0) < 10) return;
          modoGesto = 'mover'; u.pego = true;
        }
        if (modoGesto === 'mover') {
          var q = b.dedoNoPlano(sx, sy, plano); if (!q) return;
          var lx = bandeja.worldToLocal(q).x - dx0, lim = xDoSlot(N - 1) + 0.02;
          x.position.x = Math.max(-lim, Math.min(lim, lx));
        }
      },
      fim: function () {
        if (modoGesto === 'virar') { assentar(x, (u.s || 0) > 0.4 ? 1 : 0, 0.35); return; }
        if (modoGesto === 'raspar') {
          u.raspado = medirRaspado(x);
          if (u.raspado > 0.55 && !u.revelada) revelar(x);
          return;
        }
        if (modoGesto === 'mover') {
          u.pego = false;
          var novo = Math.max(0, Math.min(N - 1, Math.round(x.position.x / PASSO + (N - 1) / 2)));
          var outra = xicaras.find(function (o) { return o !== x && o.userData.slot === novo; });
          if (outra) outra.userData.slot = u.slot;
          u.slot = novo; b.vibrar(8);
          conferir();
        }
      }
    });
  });

  function revelar(x) {
    var u = x.userData; u.revelada = true;
    var g = ctx(u.cr); g.save(); g.globalCompositeOperation = 'destination-out'; g.fillStyle = g.strokeStyle = '#000'; g.beginPath(); g.arc(U / 2, U / 2, 68, 0, Math.PI * 2); g.fill(); g.restore();
    compor(x); b.vibrar(15);
    if (u.item.envio && !envioDado) {
      envioDado = true; b.estado('Um envio extra! +1');
      avisarMesa('envio', {});
    }
    conferir();
  }

  /* as seis em ordem (crescente ou decrescente; letras: a palavra) */
  function conferir() {
    if (resolvido) return;
    if (!xicaras.every(function (x) { return x.userData.revelada; })) return;
    var fila = xicaras.slice().sort(function (a, c) { return a.userData.slot - c.userData.slot; }).map(function (x) { return x.userData.item; });
    var seis = fila.filter(function (it) { return !it.intruso; }).map(function (it) { return it.ordem; });
    var cresce = seis.every(function (v, i) { return v === i; });
    var desce = tipo !== 'letra' && seis.every(function (v, i) { return v === 5 - i; });
    if (cresce || desce) resolver();
  }
  function resolver() {
    resolvido = true; b.vibrar([20, 60, 20, 60, 40]);
    var t = 0;
    xicaras.forEach(function (x) { desenharConteudo(x.userData.item, ctx(x.userData.cc), true); });
    animando.push(function (dt) {
      t = Math.min(1, t + dt / 1.6);
      xicaras.forEach(function (x) {
        var u = x.userData, g = ctx(u.cr);
        g.save(); g.globalCompositeOperation = 'destination-out'; g.fillStyle = g.strokeStyle = '#000'; g.globalAlpha = 0.12; g.beginPath(); g.arc(U / 2, U / 2, U / 2, 0, Math.PI * 2); g.fill(); g.restore();
        if (u.item.intruso) { u.brilho = t; x.position.y = Math.sin(t * Math.PI) * 0.025; }
        else u.po = 0.2 * t;
        compor(x);
      });
      if (t >= 1) { b.estado('As seis têm o carimbo da casa: a louça da sala está completa. A xícara sozinha é de outro jogo.'); avisarMesa('resolvido', {}); return true; }
    });
  }
  function mandarPista() {
    var x = xicaras.find(function (o) { return o.userData.item.intruso; });
    var c = document.createElement('canvas'); c.width = c.height = 512; var g = c.getContext('2d');
    g.fillStyle = '#10151b'; g.fillRect(0, 0, 512, 512);
    g.drawImage(x.userData.cm, 0, 0, S, S, 0, 0, 512, 512);
    avisarMesa('pista', { nome: 'Fundo da xícara de outro jogo', img: c.toDataURL('image/jpeg', 0.86) });
  }
  function avisarMesa(evento, extra) {
    try { if (parent !== window) parent.postMessage(Object.assign({ oi: 'bandeja', evento: evento }, extra || {}), location.origin); } catch (e) {}
  }

  /* ---------------- a xícara sozinha, de borda verde, com café frio ---------------- */
  var sozinha = new THREE.Group(); b.raiz.add(sozinha);
  sozinha.position.set(LARG / 2 + 0.085, 0, 0.02);
  (function () {
    var verde = new THREE.MeshStandardMaterial({ color: 0x3f8a5c, roughness: 0.35 });
    var pires = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.05, 0.008, 40), porcelana); pires.position.y = 0.004; sozinha.add(pires);
    var aroPires = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.0014, 6, 48), verde); aroPires.rotation.x = Math.PI / 2; aroPires.position.y = 0.0082; sozinha.add(aroPires);
    var corpo = new THREE.Mesh(geoCorpo, porcelana); corpo.position.y = 0.008; sozinha.add(corpo);
    var f = new THREE.Mesh(new THREE.TorusGeometry(0.0466, 0.0028, 8, 64), verde); f.rotation.x = Math.PI / 2; f.position.y = 0.008 + ALTURA - 0.003; sozinha.add(f);
    var alca = new THREE.Mesh(geoAlca, porcelana); alca.rotation.y = 0.6; alca.position.y = 0.008; sozinha.add(alca);
    /* um dedo de café frio, com a película: um disco escuro e outro, fosco, por cima */
    var cc = document.createElement('canvas'); cc.width = cc.height = 256; var g = cc.getContext('2d');
    var gr = g.createRadialGradient(128, 128, 20, 128, 128, 128); gr.addColorStop(0, '#2a1608'); gr.addColorStop(1, '#3d220e');
    g.fillStyle = gr; g.beginPath(); g.arc(128, 128, 128, 0, Math.PI * 2); g.fill();
    for (var k = 0; k < 14; k++) {                       /* a película: rugas foscas, mais claras */
      g.strokeStyle = 'rgba(170,140,105,' + (0.12 + Math.random() * 0.12) + ')'; g.lineWidth = 2 + Math.random() * 3;
      g.beginPath(); var a0 = Math.random() * 6.28, r0 = 30 + Math.random() * 80; g.arc(128 + Math.random() * 30 - 15, 128 + Math.random() * 30 - 15, r0, a0, a0 + 0.8 + Math.random()); g.stroke();
    }
    g.strokeStyle = 'rgba(90,60,30,.6)'; g.lineWidth = 6; g.beginPath(); g.arc(128, 128, 124, 0, Math.PI * 2); g.stroke();   /* a marca seca na parede da xícara */
    var tex = new THREE.CanvasTexture(cc); tex.encoding = THREE.sRGBEncoding;
    var cafe = new THREE.Mesh(new THREE.CircleGeometry(0.0225, 36), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75 }));
    cafe.rotation.x = -Math.PI / 2; cafe.position.y = 0.008 + 0.0135; sozinha.add(cafe);
    sozinha.userData.foto = cc;
  })();
  var fotoDada = false;
  b.pega({
    rotulo: 'Xícara sozinha',
    alvo: function () { return sozinha; },
    ativa: function () { return true; },
    fim: function (x, y, cancelou) {
      if (cancelou) return;
      b.estado('Um dedo de café frio, com uma película por cima. A borda é verde.');
      b.vibrar(10);
      if (fotoDada) return; fotoDada = true;
      var c = document.createElement('canvas'); c.width = c.height = 512; var g = c.getContext('2d');
      g.fillStyle = '#10151b'; g.fillRect(0, 0, 512, 512);
      g.fillStyle = '#f6f2ea'; g.beginPath(); g.arc(256, 256, 236, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#3f8a5c'; g.lineWidth = 16; g.beginPath(); g.arc(256, 256, 226, 0, Math.PI * 2); g.stroke();
      g.drawImage(sozinha.userData.foto, 76, 76, 360, 360);
      g.font = 'italic 600 22px Georgia, serif'; g.fillStyle = '#c9bba3'; g.textAlign = 'center'; g.fillText('borda verde · café frio, com película', 256, 500);
      avisarMesa('pista', { nome: 'Xícara de borda verde, com café frio', img: c.toDataURL('image/jpeg', 0.86) });
    }
  });

  b.comecar();
  b.estado('O aparador da sala.');

  /* para os testes */
  window.OIBandeja = {
    modo: modo, itens: itens,
    alcaNaTela: function (i) { return b.naTela(xicaras[i].userData.pegaAlca.getWorldPosition(new THREE.Vector3())); },
    xicaraNaTela: function (i) { return b.naTela(xicaras[i].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.03, 0))); },
    fundoNaTela: function (i) { return b.naTela(xicaras[i].userData.fundo.getWorldPosition(new THREE.Vector3())); },
    estado: function () { return xicaras.map(function (x) { var u = x.userData; return { texto: u.item.texto, slot: u.slot, virada: u.virada, revelada: !!u.revelada, intruso: u.item.intruso, envio: !!u.item.envio }; }); },
    resolvido: function () { return resolvido; },
    _pose: function (i, s) { pose(xicaras[i], s); },
    _canvas: function (i) { return xicaras[i].userData.cm.toDataURL(); },
    _virar: function (i) { virar(xicaras[i]); }, _revelar: function (i) { revelar(xicaras[i]); },
    _slot: function (i, s) { var x = xicaras[i], o = xicaras.find(function (k) { return k !== x && k.userData.slot === s; }); if (o) o.userData.slot = x.userData.slot; x.userData.slot = s; conferir(); }
  };
})();
