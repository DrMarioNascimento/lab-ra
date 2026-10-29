/* Obras de Mário César Nascimento projetadas na cena (three.js r128).

   25/10/2026 (Mario: "esses anexos eu considero obras minhas e queria inserir
   … nem que seja uma projeção em algum laboratório… quero ver no jogo"). Três
   peças, a mesma figura em três suportes: a MOEDA da IA (a médica de jaleco,
   metade anatomia, com o chip IA), o BUSTO de anatomia sintética e o CORPO com
   a circulação. Aqui elas viram projeção: uma base de projetor, o feixe, a
   peça flutuando, e o movimento que cada uma pede:
   - moeda: gira como moeda lançada, com um brilho que corre a face;
   - busto: gira devagar; o coração pulsa em luz vermelha (72 por minuto) e o
     chip IA pisca como quem processa;
   - corpo: a pele vira vidro, o coração bate, as válvulas abrem e fecham no
     mesmo compasso e o sangue pulsa com o batimento.
   A placa da base leva a autoria. Nada aqui recebe toque nem altera o jogo.

   ObraProjecao.criar(THREE, pai, {tipo, cena (gltf.scene já carregada),
   altura (m, padrão .32), reduzido, semBase (true quando a cena já tem o
   projetor: só a obra, a varredura, a poeira e a placa)}) → {grupo, update(dt), dispose} */
(function (global) {
  'use strict';
  var ROTULO = { moeda: 'A moeda da IA', busto: 'Anatomia sintética', corpo: 'O corpo e a circulação' };

  function placa(T, texto) {
    var c = document.createElement('canvas'); c.width = 1024; c.height = 192; var g = c.getContext('2d');
    var gr = g.createLinearGradient(0, 0, 0, 192); gr.addColorStop(0, '#20303c'); gr.addColorStop(1, '#0e1820');
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 192); g.strokeStyle = '#8fd8ff'; g.lineWidth = 6; g.strokeRect(8, 8, 1008, 176);
    g.fillStyle = '#e8f6ff'; g.textAlign = 'center'; g.font = '600 64px Georgia, serif'; g.fillText(texto, 512, 88);
    g.fillStyle = '#9ccbe0'; g.font = '500 40px Georgia, serif'; g.fillText('Obra de Mário César Nascimento', 512, 150);
    var t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t;
  }
  function gradiente(T) {                     /* feixe: forte embaixo, some em cima */
    var c = document.createElement('canvas'); c.width = 4; c.height = 128; var g = c.getContext('2d');
    var gr = g.createLinearGradient(0, 128, 0, 0); gr.addColorStop(0, 'rgba(150,225,255,.55)'); gr.addColorStop(.6, 'rgba(120,205,255,.14)'); gr.addColorStop(1, 'rgba(120,205,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 4, 128); return new T.CanvasTexture(c);
  }

  function criar(T, pai, op) {
    op = op || {};
    var tipo = op.tipo || 'busto', H = op.altura || 0.32, cena = op.cena, semBase = !!op.semBase;
    var reduzido = op.reduzido === undefined ? (global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) : op.reduzido;
    var grupo = new T.Group(); grupo.name = 'obra_' + tipo; grupo.userData.naoExportar = true; pai.add(grupo);
    var descartar = [];
    function guarda(o) { descartar.push(o); return o; }

    /* ---------- o projetor ---------- */
    var R = H * 0.42;
    var base = new T.Mesh(guarda(new T.CylinderGeometry(R, R * 1.08, H * 0.06, 48)), guarda(new T.MeshStandardMaterial({ color: 0x1c252c, metalness: .8, roughness: .35 })));
    base.position.y = H * 0.03; grupo.add(base);
    var anel = new T.Mesh(guarda(new T.TorusGeometry(R * .82, R * .035, 8, 64)), guarda(new T.MeshBasicMaterial({ color: 0x8fe0ff })));
    anel.rotation.x = Math.PI / 2; anel.position.y = H * 0.062; grupo.add(anel);
    var lente = new T.Mesh(guarda(new T.CircleGeometry(R * .55, 40)), guarda(new T.MeshBasicMaterial({ color: 0xbff0ff, transparent: true, opacity: .85 })));
    lente.rotation.x = -Math.PI / 2; lente.position.y = H * 0.0625; grupo.add(lente);
    var texFeixe = guarda(gradiente(T));
    var feixe = new T.Mesh(guarda(new T.CylinderGeometry(R * .95, R * .55, H, 40, 1, true)),
      guarda(new T.MeshBasicMaterial({ map: texFeixe, transparent: true, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending })));
    feixe.position.y = H * 0.0625 + H / 2; grupo.add(feixe);
    if (semBase) { base.visible = anel.visible = lente.visible = feixe.visible = false; }
    /* a varredura: um anel de luz que sobe pela projeção */
    var scan = new T.Mesh(guarda(new T.TorusGeometry(R * .7, R * .012, 6, 64)), guarda(new T.MeshBasicMaterial({ color: 0xbff0ff, transparent: true, opacity: .7, blending: T.AdditiveBlending, depthWrite: false })));
    scan.rotation.x = Math.PI / 2; grupo.add(scan);
    /* poeira no feixe */
    var NP = 70, pg = new T.BufferGeometry(), pp = new Float32Array(NP * 3), sem = [], s = 4242;
    function rnd() { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }
    for (var i = 0; i < NP; i++) { var a = rnd() * 6.28, r = Math.sqrt(rnd()) * R * .75; sem.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, f: rnd(), v: .25 + rnd() * .4 }); }
    pg.setAttribute('position', new T.BufferAttribute(pp, 3)); guarda(pg);
    var poeira = new T.Points(pg, guarda(new T.PointsMaterial({ color: 0xcff3ff, size: H * .012, transparent: true, opacity: .7, depthWrite: false, blending: T.AdditiveBlending })));
    grupo.add(poeira);
    if (semBase) poeira.visible = false; /* o projetor da cena já tem feixe; ponto em escala de maquete vira borrão */
    var texPlaca = guarda(placa(T, ROTULO[tipo] || 'Obra'));
    var plaq = new T.Mesh(guarda(new T.PlaneGeometry(R * 1.9, R * 1.9 * 192 / 1024)), guarda(new T.MeshBasicMaterial({ map: texPlaca })));
    plaq.position.set(0, H * .03, R * 1.1); plaq.rotation.x = -.35; grupo.add(plaq);
    if (semBase) { plaq.position.set(0, -H * .02, R * .9); plaq.rotation.x = -.6; plaq.scale.setScalar(.8); }

    /* ---------- a obra, flutuando ---------- */
    var suporte = new T.Group(); grupo.add(suporte);
    /* mede ANTES de pendurar: dentro de uma maquete em escala, a caixa no mundo
       sai encolhida e a obra nascia cem vezes maior que o andar */
    var obra = cena; if (obra.parent) obra.parent.remove(obra); obra.updateMatrixWorld(true);
    var bb = new T.Box3().setFromObject(obra), sz = bb.getSize(new T.Vector3()), ct = bb.getCenter(new T.Vector3());
    suporte.add(obra);
    var alvo = tipo === 'moeda' ? H * .62 : H * .8, esc = alvo / Math.max(sz.x, sz.y, sz.z);
    obra.scale.multiplyScalar(esc); obra.position.sub(ct.multiplyScalar(esc));
    var alturaObra = H * 0.0625 + H * (tipo === 'moeda' ? .55 : .5);
    suporte.position.y = alturaObra;
    var sob = { coracao: null, chip: null, valvulas: [], sangue: [] };
    var luzes = [];

    if (tipo === 'busto') {
      /* a malha é uma só: o coração e o chip ganham luz, não geometria */
      var hb = new T.Box3().setFromObject(obra), hs = hb.getSize(new T.Vector3());
      sob.coracao = new T.PointLight(0xff2a2a, 0, hs.y * .35, 2); sob.coracao.position.set(hs.x * .02, -hs.y * .22, hs.z * .55); suporte.add(sob.coracao);
      sob.chip = new T.PointLight(0xffc35a, 0, hs.y * .22, 2); sob.chip.position.set(hs.x * .18, hs.y * .4, hs.z * .4); suporte.add(sob.chip);
      luzes.push(sob.coracao, sob.chip);
    }
    if (tipo === 'corpo') {
      obra.traverse(function (o) {
        if (!o.isMesh) return;
        var n = o.name || '';
        if (/^corpo/.test(n)) {        /* a pele vira vidro: a circulação aparece */
          /* vidro com tom de holograma: transparente demais, o corpo sumia na sala */
          o.material = guarda(new T.MeshPhysicalMaterial({ color: 0xa8e6ff, emissive: 0x1d5e78, emissiveIntensity: .5, roughness: .25, metalness: 0, transparent: true, opacity: /translucido/.test(n) ? .14 : .24, depthWrite: false, side: T.DoubleSide }));
          o.renderOrder = 2;
        } else if (n === 'coracao') sob.coracao = o;
        else if (/^valvula/.test(n)) sob.valvulas.push({ o: o, r0: o.rotation.x, f: sob.valvulas.length * .37 });
        else if (/^sangue/.test(n)) { o.material = o.material.clone(); guarda(o.material); sob.sangue.push({ o: o, art: /arterial/.test(n), op0: o.material.opacity }); }
      });
      if (sob.coracao) sob.coracao.userData.s0 = sob.coracao.scale.clone();
    }

    var brilho = null;
    if (tipo === 'moeda') { brilho = new T.PointLight(0xffffff, .9, H * 1.4, 2); grupo.add(brilho); luzes.push(brilho); }

    grupo.traverse(function (o) { o.raycast = function () {}; });
    var t = 0;
    function bat(tt) { var f = (tt * 1.2) % 1; return f < .12 ? Math.sin(f / .12 * Math.PI) : f < .3 ? .45 * Math.sin((f - .12) / .18 * Math.PI) : 0; }
    function update(dt) {
      dt = Math.max(0, Math.min(.05, dt || 0)); if (reduzido) dt *= .25; t += dt;
      var y = H * 0.0625, sub = (t * .35) % 1;
      scan.position.y = y + H * .05 + sub * H * .9; scan.material.opacity = .7 * Math.sin(sub * Math.PI);
      feixe.material.opacity = .85 + .15 * Math.sin(t * 9.3) * Math.sin(t * 2.1);
      if (semBase) suporte.children[0].visible = (Math.sin(t * 23.0) > -.985); /* um soluço raro, de projeção */
      for (var i = 0; i < NP; i++) { var q = sem[i], u = (q.f + t * q.v * .2) % 1; pp[i * 3] = q.x * (1 + u * .25); pp[i * 3 + 1] = y + u * H * .95; pp[i * 3 + 2] = q.z * (1 + u * .25); }
      pg.attributes.position.needsUpdate = true;
      suporte.position.y = alturaObra + Math.sin(t * .9) * H * .015;
      if (tipo === 'moeda') { suporte.rotation.y = t * (Math.PI * 2 / 6); suporte.rotation.z = Math.sin(t * .7) * .08; brilho.position.set(Math.cos(t * 1.7) * R, alturaObra + H * .25, Math.sin(t * 1.7) * R); }
      else suporte.rotation.y = t * (Math.PI * 2 / 22);
      var b = bat(t);
      if (tipo === 'busto') { sob.coracao.intensity = .4 + 2.6 * b; sob.chip.intensity = .3 + 1.2 * (Math.sin(t * 6.1) > .55 ? 1 : 0) * (.6 + .4 * Math.sin(t * 2.3)); }
      if (tipo === 'corpo') {
        if (sob.coracao) sob.coracao.scale.copy(sob.coracao.userData.s0).multiplyScalar(1 + .09 * b);
        sob.valvulas.forEach(function (v) { v.o.rotation.x = v.r0 + .45 * Math.max(0, Math.sin(t * 1.6 + v.f)); });
        sob.sangue.forEach(function (sg) { sg.o.material.opacity = Math.min(1, sg.op0 * (sg.art ? .7 + .6 * b : .8 + .25 * Math.sin(t * 1.6))); });
      }
    }
    function dispose() {
      if (grupo.parent) grupo.parent.remove(grupo);
      descartar.forEach(function (d) { if (d && d.dispose) d.dispose(); });
    }
    update(0);
    return { grupo: grupo, update: update, dispose: dispose, tipo: tipo };
  }
  global.ObraProjecao = { criar: criar, rotulo: ROTULO };
})(typeof window !== 'undefined' ? window : globalThis);
