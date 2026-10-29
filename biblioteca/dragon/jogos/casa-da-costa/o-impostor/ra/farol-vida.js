/* O farol na tempestade (three.js r128).

   25/10/2026 (Mario: "trovões, nevoeiro e chuva… Idem Farol"). Além do
   clima, três coisas que a história sustenta:
   - o MAR em volta do rochedo, agitado, quebrando em espuma na pedra (a noite
     da cheia, "a ponte caiu com a cheia"). Fica num fosso em volta da base:
     o livro e o rádio saem para a mesa ao lado e não podem cair na água;
   - as JANELAS e o vidro da LANTERNA devolvem o clarão de cada raio;
   - o RÁDIO do Faroleiro, quando sai da portinha, tem o LED aceso piscando
     ("foi por ele que o farol falou com a casa").
   O giro de 20 s do feixe não é tocado: é o compasso dos clarões do apagão.
   Nada aqui recebe toque nem informa hora ou pista.

   FarolVida.criar(raiz, farol, radio()) → {update(dt, vento), clarao(b), dispose} */
(function (global) {
  'use strict';
  function criar(raiz, farol, pegarRadio, op) {
    op = op || {};
    var T = global.THREE, t = 0, descartar = [], reduzido = global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function guarda(x) { descartar.push(x); return x; }

    /* ---------- vidros que devolvem o clarão ---------- */
    var vidros = [];
    farol.traverse(function (o) {
      if (!o.isMesh || !/^(janela_\d_vidro|lanterna_vidro)$/.test(o.name) || !o.material || !o.material.emissive) return;
      o.material = guarda(o.material.clone());
      vidros.push({ m: o.material, e0: o.material.emissive.clone(), i0: o.material.emissiveIntensity });
    });
    var frio = new T.Color(0xc8dcff);
    function clarao(b) {
      vidros.forEach(function (v) {
        if (b > .01) { v.m.emissive.copy(v.e0).lerp(frio, Math.min(1, b)); v.m.emissiveIntensity = v.i0 + 1.4 * b; }
        else { v.m.emissive.copy(v.e0); v.m.emissiveIntensity = v.i0; }
      });
      if (agua) agua.material.color.setRGB(.72 + .28 * b, .72 + .28 * b, .72 + .28 * b);
    }

    /* ---------- o mar no fosso do rochedo ---------- */
    raiz.updateMatrixWorld(true);
    var base = farol.getObjectByName('embasamento') || farol.getObjectByName('rochedo') || farol;
    var bb = new T.Box3().setFromObject(base), inv = new T.Matrix4().copy(raiz.matrixWorld).invert();
    bb.applyMatrix4(inv);
    var c = bb.getCenter(new T.Vector3()), r0 = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z) * .5, r1 = r0 * 2.1;
    /* ondas de várias direções e tamanhos, todas com frequência inteira para o
       ladrilho fechar; a crista é a dobra do ruído (1 − |n|)³ */
    var ondas = [], sem2 = 77;
    function al() { sem2 = (Math.imul(sem2, 1664525) + 1013904223) >>> 0; return sem2 / 4294967296; }
    for (var w2 = 0; w2 < 9; w2++) ondas.push({ a: Math.round((al() - .5) * 8) || 1, b: Math.round((al() - .5) * 8), f: al() * 6.283, p: .4 + al() * .6 });
    var cv = document.createElement('canvas'); cv.width = cv.height = 256; var g = cv.getContext('2d'), img = g.createImageData(256, 256);
    for (var y = 0; y < 256; y++) for (var x = 0; x < 256; x++) {
      var u = x / 256 * 6.283, v = y / 256 * 6.283;
      /* cristas claras sobre o verde-petróleo: a cena do farol tem luzes
         fortes (a lâmpada do modelo), e água com material iluminado estourava
         em branco — a textura carrega o desenho e a cor fica sem luz */
      var n = 0, tot = 0; for (var q = 0; q < ondas.length; q++) { n += ondas[q].p * Math.sin(ondas[q].a * u + ondas[q].b * v + ondas[q].f); tot += ondas[q].p; }
      n /= tot; var k2 = Math.pow(1 - Math.min(1, Math.abs(n) * 2.2), 3), o2 = (y * 256 + x) * 4;
      img.data[o2] = 10 + 46 * k2; img.data[o2 + 1] = 40 + 66 * k2; img.data[o2 + 2] = 52 + 64 * k2; img.data[o2 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    var nm = guarda(new T.CanvasTexture(cv)); nm.wrapS = nm.wrapT = T.RepeatWrapping; nm.repeat.set(1.4, 1.4);
    var geo = guarda(new T.RingGeometry(r0 * .92, r1, 64, 6).rotateX(-Math.PI / 2));
    /* ondas de verdade na malha: a água sobe e desce, mais perto da pedra */
    var pos = geo.attributes.position, base0 = Float32Array.from(pos.array);
    nm.encoding = T.sRGBEncoding;
    var agua = new T.Mesh(geo, guarda(new T.MeshBasicMaterial({ map: nm, color: 0xb8b8b8, transparent: true, opacity: .96 })));
    agua.position.set(c.x, bb.min.y + r0 * .04, c.z); raiz.add(agua);
    /* a espuma: um anel claro colado à pedra, que bate e recua */
    var cf = document.createElement('canvas'); cf.width = 256; cf.height = 32; var gf = cf.getContext('2d');
    for (var k = 0; k < 220; k++) { gf.fillStyle = 'rgba(240,248,250,' + (.15 + Math.random() * .5) + ')'; gf.beginPath(); gf.arc(Math.random() * 256, Math.random() * 32, 1 + Math.random() * 4, 0, 6.3); gf.fill(); }
    var tf = guarda(new T.CanvasTexture(cf)); tf.wrapS = T.RepeatWrapping; tf.repeat.set(4, 1);
    var espuma = new T.Mesh(guarda(new T.RingGeometry(r0 * .92, r0 * 1.32, 64, 1).rotateX(-Math.PI / 2)),
      guarda(new T.MeshBasicMaterial({ map: tf, transparent: true, opacity: .7, depthWrite: false })));
    espuma.position.copy(agua.position); espuma.position.y += r0 * .01; raiz.add(espuma);
    /* borrifo: gotas que saltam da pedra quando a onda bate */
    var NB = 40, pb = new Float32Array(NB * 3), gb = guarda(new T.BufferGeometry()), sem = [];
    for (k = 0; k < NB; k++) sem.push({ a: Math.random() * 6.28, f: Math.random(), v: .6 + Math.random() * .8 });
    gb.setAttribute('position', new T.BufferAttribute(pb, 3));
    var borrifo = new T.Points(gb, guarda(new T.PointsMaterial({ color: 0xe8f4f8, size: r0 * .05, transparent: true, opacity: .8, depthWrite: false })));
    borrifo.position.copy(agua.position); raiz.add(borrifo);
    [agua, espuma, borrifo].forEach(function (o) { o.raycast = function () {}; o.userData.naoExportar = true; });

    /* ---------- o LED do rádio ---------- */
    var led = null;
    function ledDoRadio() {
      var r = pegarRadio && pegarRadio(); if (!r || led) return;
      led = new T.Mesh(guarda(new T.SphereGeometry(.0022, 10, 8)), guarda(new T.MeshBasicMaterial({ color: 0x44ff6a })));
      led.position.set(.012, .133, .0165); led.raycast = function () {}; r.add(led);
    }

    function update(dt, vento) {
      dt = Math.max(0, Math.min(.05, dt || 0)); t += dt; var w = vento === undefined ? .2 : vento;
      ledDoRadio();
      if (led) led.material.color.setHex((t % 1.6) < .12 ? 0x9dffb0 : 0x1d5a2a);
      if (reduzido) return;
      for (var i = 0; i < pos.count; i++) {
        var x0 = base0[i * 3], z0 = base0[i * 3 + 2], d = Math.hypot(x0, z0), ang = Math.atan2(z0, x0);
        var perto = 1 - Math.min(1, (d - r0) / (r1 - r0));
        pos.array[i * 3 + 1] = base0[i * 3 + 1] + r0 * (.035 * Math.sin(t * 1.7 - d / r0 * 5 + ang * 2) + .02 * Math.sin(t * 2.9 + ang * 5)) * (.4 + .6 * perto) * (1 + w);
      }
      pos.needsUpdate = true;
      nm.offset.set((t * .03 * (1 + w)) % 1, (t * .018) % 1);
      var bate = .5 + .5 * Math.sin(t * 1.7);
      tf.offset.x = (t * .04) % 1; espuma.scale.setScalar(1 + .06 * bate); espuma.material.opacity = .35 + .45 * bate;
      for (i = 0; i < NB; i++) {
        var s = sem[i], q = (s.f + t * s.v * .9) % 1, rr = r0 * (1 + q * .5);
        pb[i * 3] = Math.cos(s.a) * rr; pb[i * 3 + 1] = r0 * (.9 * q - 1.1 * q * q) * (.5 + bate); pb[i * 3 + 2] = Math.sin(s.a) * rr;
      }
      gb.attributes.position.needsUpdate = true;
    }
    function dispose() {
      clarao(0);
      [agua, espuma, borrifo].forEach(function (o) { if (o.parent) o.parent.remove(o); });
      if (led && led.parent) led.parent.remove(led);
      descartar.forEach(function (d) { if (d && d.dispose) d.dispose(); });
    }
    return { update: update, clarao: clarao, dispose: dispose,
      estado: function () { return { vidros: vidros.length, mar: true, radio: !!led }; } };
  }
  global.FarolVida = { criar: criar };
})(typeof window !== 'undefined' ? window : globalThis);
