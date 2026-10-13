/* O Impostor — o jardim interno (revisão 2, Cap. 4).

   01/10/2026: refeito na planta da casa nova (a maquete do designer). O pátio é
   um retângulo de 8,7 m (leste-oeste) por 12,7 m (norte-sul). As aberturas que
   dão nele, como na maquete:
     oeste — janela do corredor dos retratos (D), no canto norte · porta-janela
             da sala do relógio · porta-janela da biblioteca · a alcova da mesa
             da ata, com janelas
     norte — janela do quarto de serviço (o jasmim, no canto dos fundos) · porta
             da despensa, que é a porta de serviço · porta da varanda (cozinha),
             com a varanda coberta na frente
     leste — janela da rouparia · portão do pátio (a saída para fora) · janela
             da lavanderia
     sul   — as três janelas da galeria
   A versão anterior (pátio quadrado) está em ra/jardim-trilhas_SUBSTITUIDO.js.
   (texto original abaixo)

   Mario, 30/09/2026: a maquete tem o jardim atrás da casa, encostado só na ala
   de serviço; na revisão 2 ele é um pátio cercado pela casa. Esta peça mostra
   só o pátio, em miniatura (1:10), com as portas e janelas que dão nele:

     oeste  — porta-janela da biblioteca · porta-janela da sala do relógio
     norte  — janela do quarto de serviço (o jasmim sobe no canto dos fundos)
     leste  — porta de serviço · porta da despensa · porta da varanda (cozinha),
              com a varanda coberta
     sul    — janela do corredor dos retratos

   Duas trilhas:
   · a SECA, de meses: pedras gastas, sem musgo, da porta de serviço até a
     janela do quarto de serviço;
   · a FRESCA, desta noite: pegadas de sola lisa na lama, com água parada
     dentro. O bico mostra a direção; ninguém diz para que lado vão.
   A trilha fresca termina na porta da partida (?fim=despensa|varanda|
   biblioteca|quarto|sala) e começa na porta-janela da biblioteca — ou na da
   sala do relógio, quando termina na biblioteca.

   Nada aqui se mexe: é para olhar de perto, girar e aproximar. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  var FIM = Q.get('fim') || 'sala';

  var b = OIBase.criar({
    vista: { alvo: [0, 0.02, 0.04], dist: 1.35, distRetrato: 2.3, dir: [0.05, 1.3, 0.8] },
    raioDoChao: 0.8, alturaDoAparelho: 0.45, miraEscala: 1.4, exposicao: 0.62,
    textoMira: 'Aponte para uma mesa ou o chão e toque em Pôr aqui.',
    textoInicio: 'O jardim interno, na chuva.'
  });

  function cor(h) { return new THREE.Color(h).convertSRGBToLinear(); }   /* as cores do modelo vêm em sRGB */
  var M = {
    terra: new THREE.MeshStandardMaterial({ color: cor(0x6e3222), roughness: 0.95 }),
    pedra: new THREE.MeshStandardMaterial({ color: cor(0x77736a), roughness: 0.9 }),
    pedraGasta: new THREE.MeshStandardMaterial({ color: cor(0x9a948a), roughness: 0.7 }),
    musgo: new THREE.MeshStandardMaterial({ color: cor(0x4f5f3a), roughness: 1 }),
    parede: new THREE.MeshStandardMaterial({ color: cor(0xd9ccb4), roughness: 0.9 }),
    rodape: new THREE.MeshStandardMaterial({ color: cor(0x8a7a64), roughness: 0.9 }),
    vao: new THREE.MeshStandardMaterial({ color: cor(0x1b1612), roughness: 0.6 }),
    vidro: new THREE.MeshStandardMaterial({ color: cor(0x3a4a55), roughness: 0.15, metalness: 0.3 }),
    madeira: new THREE.MeshStandardMaterial({ color: cor(0x5a3a24), roughness: 0.8 }),
    telha: new THREE.MeshStandardMaterial({ color: cor(0x8c4a32), roughness: 0.85 }),
    folha: new THREE.MeshStandardMaterial({ color: cor(0x2f5a2c), roughness: 0.9 }),
    flor: new THREE.MeshStandardMaterial({ color: cor(0xf4f0e2), roughness: 0.6 }),
    lama: new THREE.MeshStandardMaterial({ color: cor(0x2e1a12), roughness: 0.55 }),
    agua: new THREE.MeshStandardMaterial({ color: cor(0x5c6f7a), roughness: 0.05, metalness: 0.4 })
  };
  var R = b.raiz, H = 0.22, ESC = 0.84 / 12.7;      /* 1 m da casa = ESC; o lado maior (norte-sul) mede 0,84 */
  var LX = 4.35 * ESC, LZ = 6.35 * ESC;              /* meias medidas do pátio */
  function px(x) { return (x - 0.55) * ESC; }       /* x da casa (m) -> peça */
  function pz(z) { return (z + 1.45) * ESC; }       /* z da casa (m) -> peça (norte = -z) */

  function caixa(w, h, d, mat, x, y, z) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); R.add(m); return m;
  }
  function rotulo(txt, x, y, z) {
    var c = document.createElement('canvas'); c.width = 512; c.height = 96;
    var g = c.getContext('2d');
    g.fillStyle = 'rgba(12,9,7,.78)'; g.fillRect(0, 0, 512, 96);
    g.strokeStyle = 'rgba(224,177,58,.7)'; g.lineWidth = 4; g.strokeRect(2, 2, 508, 92);
    g.fillStyle = '#f3d078'; var fs = 44; do { g.font = '600 ' + fs + 'px Inter, system-ui, sans-serif'; fs -= 2; } while (g.measureText(txt).width > 480 && fs > 16); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(txt, 256, 50);
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false }));
    s.scale.set(0.16, 0.03, 1); s.position.set(x, y, z); s.renderOrder = 10; R.add(s); return s;
  }

  /* ---------- chão ---------- */
  var chao = new THREE.Mesh(new THREE.PlaneGeometry(2 * LX, 2 * LZ), M.terra);
  chao.rotation.x = -Math.PI / 2; chao.position.y = 0.002; R.add(chao);
  [[0, -LZ + 0.03, 2 * LX, 0.06], [0, LZ - 0.03, 2 * LX, 0.06], [-LX + 0.03, 0, 0.06, 2 * LZ], [LX - 0.03, 0, 0.06, 2 * LZ]].forEach(function (p) {
    caixa(p[2], 0.006, p[3], M.pedra, p[0], 0.005, p[1]);
  });
  var sorte = 7;
  function rnd() { sorte = (sorte * 16807) % 2147483647; return sorte / 2147483647; }
  for (var i = 0; i < 26; i++) {
    var x = (rnd() - 0.5) * (2 * LX - 0.1), z = (rnd() - 0.5) * (2 * LZ - 0.1);
    var s = 0.018 + rnd() * 0.02;
    var p = caixa(s, 0.005, s * (0.7 + rnd() * 0.5), M.pedra, x, 0.004, z); p.rotation.y = rnd() * 3;
    caixa(s * 0.5, 0.0015, s * 0.4, M.musgo, x + s * 0.15, 0.0075, z);
  }
  /* o canteiro do canto sudoeste */
  caixa(px(-1.07) - px(-3.45), 0.012, pz(4.72) - pz(3.9), M.pedra, (px(-1.07) + px(-3.45)) / 2, 0.006, (pz(4.72) + pz(3.9)) / 2);
  caixa(px(-1.17) - px(-3.35), 0.004, pz(4.62) - pz(4.0), M.lama, (px(-1.07) + px(-3.45)) / 2, 0.0135, (pz(4.72) + pz(3.9)) / 2);

  /* ---------- paredes, portas e janelas ---------- */
  function parede(lado, alt) {
    var t = 0.03;
    if (lado === 'N') return caixa(2 * LX + 2 * t, alt, t, M.parede, 0, alt / 2, -LZ - t / 2);
    if (lado === 'S') return caixa(2 * LX + 2 * t, alt, t, M.parede, 0, alt / 2, LZ + t / 2);
    if (lado === 'O') return caixa(t, alt, 2 * LZ, M.parede, -LX - t / 2, alt / 2, 0);
    if (lado === 'L') return caixa(t, alt, 2 * LZ, M.parede, LX + t / 2, alt / 2, 0);
  }
  parede('N', H); parede('O', H); parede('L', H); parede('S', 0.07);   /* o sul é baixo, para se ver dentro */
  function vao(lado, pos, w, h, peit, vidro) {
    var mat = vidro ? M.vidro : M.vao, fr = 0.006, d = 0.004, g = new THREE.Group();
    if (lado === 'O') { g.position.set(-LX + d, peit + h / 2, pos); g.rotation.y = Math.PI / 2; }
    if (lado === 'L') { g.position.set(LX - d, peit + h / 2, pos); g.rotation.y = -Math.PI / 2; }
    if (lado === 'N') { g.position.set(pos, peit + h / 2, -LZ + d); }
    if (lado === 'S') { g.position.set(pos, peit + h / 2, LZ - d); g.rotation.y = Math.PI; }
    var pl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); g.add(pl);
    [[0, h / 2, w + fr * 2, fr], [0, -h / 2, w + fr * 2, fr], [-w / 2, 0, fr, h], [w / 2, 0, fr, h]].forEach(function (q) {
      var f = new THREE.Mesh(new THREE.BoxGeometry(q[2], q[3], 0.006), M.madeira); f.position.set(q[0], q[1], 0.002); g.add(f);
    });
    if (vidro) { var mt = new THREE.Mesh(new THREE.BoxGeometry(fr, h, 0.006), M.madeira); mt.position.z = 0.002; g.add(mt); }
    R.add(g); return g;
  }
  /* as aberturas, nas posições da maquete (metros da casa) */
  var PORTAS = {
    retratos: { lado: 'O', pos: pz(-7.45), nome: 'Janela dos retratos (D)', ponto: [-LX + 0.03, pz(-7.45)] },
    sala: { lado: 'O', pos: pz(-3.79), nome: 'Porta-janela da sala do relógio', ponto: [-LX + 0.03, pz(-3.79)] },
    biblioteca: { lado: 'O', pos: pz(0), nome: 'Porta-janela da biblioteca', ponto: [-LX + 0.03, pz(0)] },
    quarto: { lado: 'N', pos: px(-3.12), nome: 'Janela do quarto de serviço', ponto: [px(-3.12), -LZ + 0.03] },
    despensa: { lado: 'N', pos: px(0.93), nome: 'Porta da despensa (de serviço)', ponto: [px(0.93), -LZ + 0.03] },
    varanda: { lado: 'N', pos: px(3.66), nome: 'Porta da varanda (cozinha)', ponto: [px(3.66), pz(-6.1)] },
    portao: { lado: 'L', pos: pz(-1.86), nome: 'Portão do pátio (para fora)', ponto: [LX - 0.03, pz(-1.86)] }
  };
  PORTAS.servico = PORTAS.despensa;                  /* a mesma porta, com os dois nomes */
  vao('O', PORTAS.retratos.pos, 0.07, 0.07, 0.07, true);
  vao('O', PORTAS.sala.pos, 0.07, 0.15, 0.006, true);
  vao('O', PORTAS.biblioteca.pos, 0.07, 0.15, 0.006, true);
  vao('N', PORTAS.quarto.pos, 0.07, 0.07, 0.08, true);
  vao('N', PORTAS.despensa.pos, 0.06, 0.15, 0.006, false);
  vao('N', PORTAS.varanda.pos, 0.06, 0.15, 0.006, false);
  /* o portão do pátio: grade de barras */
  (function () {
    var z0 = PORTAS.portao.pos, w = 0.09;
    caixa(0.006, 0.006, w, M.madeira, LX - 0.006, 0.17, z0);
    for (var k = 0; k < 7; k++) caixa(0.004, 0.17, 0.004, M.madeira, LX - 0.006, 0.085, z0 - w / 2 + k * w / 6);
  })();
  /* janelas que só olham (rouparia, lavanderia, alcova, galeria) */
  vao('L', pz(-5.52), 0.06, 0.07, 0.08, true);
  vao('L', pz(0.86), 0.06, 0.07, 0.08, true);
  [-3.03, -0.28, 2.48].forEach(function (x) { caixa(0.08, 0.012, 0.03, M.madeira, px(x), 0.076, LZ + 0.015); caixa(0.07, 0.004, 0.024, M.vidro, px(x), 0.083, LZ + 0.015); });
  /* a alcova da mesa da ata avança no pátio, com janelas */
  (function () {
    var x0 = -LX, x1 = px(-3.55), z0 = pz(0.86), z1 = pz(2.76);
    caixa(x1 - x0, 0.17, 0.012, M.parede, (x0 + x1) / 2, 0.085, z0);
    caixa(x1 - x0, 0.17, 0.012, M.parede, (x0 + x1) / 2, 0.085, z1);
    caixa(0.012, 0.17, z1 - z0, M.parede, x1, 0.085, (z0 + z1) / 2);
    var j = new THREE.Mesh(new THREE.PlaneGeometry((z1 - z0) * 0.7, 0.06), M.vidro); j.position.set(x1 + 0.007, 0.11, (z0 + z1) / 2); j.rotation.y = Math.PI / 2; R.add(j);
    var tt = caixa(x1 - x0 + 0.02, 0.008, z1 - z0 + 0.02, M.telha, (x0 + x1) / 2, 0.175, (z0 + z1) / 2); tt.rotation.z = 0.12;
  })();

  /* degrau da porta da despensa */
  caixa(0.06, 0.012, 0.03, M.pedra, PORTAS.despensa.pos, 0.006, -LZ + 0.015);

  /* varanda coberta, na frente da cozinha (x 1,97 a 4,38; z −7,76 a −6,2) */
  (function () {
    var x0 = px(1.97), x1 = px(4.38), z0 = -LZ, z1 = pz(-6.2);
    caixa(x1 - x0, 0.01, z1 - z0, M.pedra, (x0 + x1) / 2, 0.005, (z0 + z1) / 2);
    [[x0 + 0.006, z1 - 0.006], [x1 - 0.006, z1 - 0.006]].forEach(function (p) { caixa(0.012, 0.16, 0.012, M.madeira, p[0], 0.08, p[1]); });
    var tel = caixa(x1 - x0 + 0.03, 0.008, z1 - z0 + 0.03, M.telha, (x0 + x1) / 2, 0.165, (z0 + z1) / 2); tel.rotation.x = 0.18;
  })();

  /* o jasmim, no canto dos fundos, subindo até a janela do quarto */
  for (var j = 0; j < 40; j++) {
    var t = j / 40, jx = px(-3.4) + rnd() * 0.05 + t * 0.03, jy = 0.01 + t * 0.16 + rnd() * 0.02, jz = -LZ + 0.012 + rnd() * 0.02;
    var fo = new THREE.Mesh(new THREE.SphereGeometry(0.012 + rnd() * 0.008, 6, 5), M.folha); fo.position.set(jx, jy, jz); R.add(fo);
    if (rnd() > 0.5) { var fl = new THREE.Mesh(new THREE.SphereGeometry(0.003, 5, 4), M.flor); fl.position.set(jx + 0.006, jy + 0.006, jz + 0.01); R.add(fl); }
  }

  /* ---------- a trilha seca: pedras gastas, sem musgo, da porta da despensa à janela do quarto ---------- */
  (function () {
    var a = PORTAS.despensa.ponto, c = PORTAS.quarto.ponto;
    for (var k = 0; k <= 6; k++) {
      var u = k / 6, x = a[0] + (c[0] - a[0]) * u, z = a[1] + (c[1] - a[1]) * u + 0.035 + 0.02 * Math.sin(u * Math.PI);
      var p = caixa(0.03, 0.004, 0.024, M.pedraGasta, x, 0.004, z); p.rotation.y = 0.4 + k * 0.3;
    }
    var bat = new THREE.Mesh(new THREE.PlaneGeometry(Math.abs(c[0] - a[0]) + 0.04, 0.05), new THREE.MeshStandardMaterial({ color: cor(0x5a2a1c), roughness: 1 }));
    bat.rotation.x = -Math.PI / 2; bat.position.set((a[0] + c[0]) / 2, 0.0028, -LZ + 0.06); R.add(bat);
  })();

  /* ---------- a trilha fresca: pegadas de sola lisa ---------- */
  var sola = (function () {                     /* sola de sapato, bico para +y */
    var s = new THREE.Shape(), w = 0.0058, l = 0.028;
    s.moveTo(0, -l / 2);
    s.bezierCurveTo(w, -l / 2, w, -l / 2 + 0.008, w * 0.85, -l / 2 + 0.01);
    s.bezierCurveTo(w * 0.7, 0, w * 1.15, l * 0.2, w * 0.9, l * 0.34);
    s.bezierCurveTo(w * 0.6, l * 0.46, w * 0.15, l / 2, 0, l / 2);             /* o bico */
    s.bezierCurveTo(-w * 0.15, l / 2, -w * 0.6, l * 0.46, -w * 0.9, l * 0.34);
    s.bezierCurveTo(-w * 1.15, l * 0.2, -w * 0.7, 0, -w * 0.85, -l / 2 + 0.01);
    s.bezierCurveTo(-w, -l / 2 + 0.008, -w, -l / 2, 0, -l / 2);
    return new THREE.ShapeGeometry(s, 10);
  })();
  var pegadas = new THREE.Group(); R.add(pegadas);
  function trilhaFresca(de, ate) {
    var a = PORTAS[de].ponto, c = PORTAS[ate].ponto;
    var mx = (a[0] + c[0]) / 2, mz = (a[1] + c[1]) / 2, dx = c[0] - a[0], dz = c[1] - a[1], len = Math.hypot(dx, dz);
    var nx = -dz / len, nz = dx / len;
    if (nx * (0 - mx) + nz * (0 - mz) < 0) { nx = -nx; nz = -nz; }
    var bow = len < 0.3 ? 0.07 : 0.12;
    var ctl = [mx + nx * bow, mz + nz * bow];
    function pt(u) { var v = 1 - u; return [v * v * a[0] + 2 * v * u * ctl[0] + u * u * c[0], v * v * a[1] + 2 * v * u * ctl[1] + u * u * c[1]]; }
    var comp = 0, prev = pt(0); for (var k = 1; k <= 50; k++) { var q = pt(k / 50); comp += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q; }
    var passos = Math.max(6, Math.round(comp / 0.042));
    for (var n = 0; n <= passos; n++) {
      var u = 0.03 + 0.94 * n / passos, p0 = pt(u), p1 = pt(Math.min(1, u + 0.01));
      var tx = p1[0] - p0[0], tz = p1[1] - p0[1], tl = Math.hypot(tx, tz); tx /= tl; tz /= tl;
      var lado = n % 2 ? 1 : -1, ox = -tz * 0.011 * lado, oz = tx * 0.011 * lado;
      var g = new THREE.Group(); g.position.set(p0[0] + ox, 0.0034, p0[1] + oz);
      g.rotation.y = Math.atan2(tx, tz);        /* o bico aponta para onde a pessoa ia */
      var m = new THREE.Mesh(sola, M.lama); m.rotation.x = -Math.PI / 2; g.add(m);
      if (n % 3 !== 1) {                         /* água parada dentro da pegada */
        var w = new THREE.Mesh(sola, M.agua); w.rotation.x = -Math.PI / 2; w.scale.set(0.55, 0.55, 1); w.position.set(0, 0.0006, 0.002); g.add(w);
      }
      pegadas.add(g);
    }
  }
  var FIMp = FIM === 'servico' ? 'despensa' : FIM;
  var INICIO = FIMp === 'biblioteca' ? 'sala' : 'biblioteca';
  if (PORTAS[FIMp] && FIMp !== INICIO) trilhaFresca(INICIO, FIMp);

  /* ---------- nomes das portas (o jogador precisa saber qual é qual) ---------- */
  ['retratos', 'sala', 'biblioteca', 'quarto', 'despensa', 'varanda', 'portao'].forEach(function (k, i) {
    var p = PORTAS[k], y = H + 0.05 + (i % 2) * 0.035, x = 0, z = 0;
    if (p.lado === 'O') { x = -LX + 0.05; z = p.pos; }
    if (p.lado === 'L') { x = LX - 0.05; z = p.pos; }
    if (p.lado === 'N') { x = p.pos + (k === 'quarto' ? 0.07 : 0); z = -LZ + 0.03; }
    rotulo(p.nome, x, y + (k === 'quarto' ? 0.04 : 0), z);
  });

  /* ---------- chuva ---------- */
  var gotas = 260, pos = new Float32Array(gotas * 6);
  for (var d = 0; d < gotas; d++) {
    var gx = (rnd() - 0.5) * 2 * LX, gz = (rnd() - 0.5) * 2 * LZ, gy = rnd() * 0.6;
    pos.set([gx, gy, gz, gx, gy - 0.03, gz], d * 6);
  }
  var geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  var chuva = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0x9fb4c4, transparent: true, opacity: 0.35 }));
  chuva.raycast = function () {}; R.add(chuva);
  b.aCadaQuadro(function (dt) {
    var a = geo.attributes.position.array;
    for (var k = 0; k < gotas; k++) {
      var i0 = k * 6; a[i0 + 1] -= dt * 0.9; a[i0 + 4] -= dt * 0.9;
      if (a[i0 + 4] < 0) { a[i0 + 1] += 0.6; a[i0 + 4] += 0.6; }
    }
    geo.attributes.position.needsUpdate = true;
  });

  /* uma luz da cozinha, na varanda */
  var luz = new THREE.PointLight(0xffc27a, 0.8, 0.9); luz.position.set(px(3.2), 0.14, pz(-7)); R.add(luz);

  b.comecar();
  window.OIJardim = { fim: function () { return FIM; }, inicio: function () { return INICIO; }, pegadas: function () { return pegadas.children.length; } };
})();
