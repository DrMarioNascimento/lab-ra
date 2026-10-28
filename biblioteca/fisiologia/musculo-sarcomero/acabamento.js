/* Acabamento do músculo (01) e da miofibrila (04) — 28/10/2026
   ---------------------------------------------------------------------------
   `modelos.js` é a versão aprovada e continua intocado (o teste confere o
   hash). Tudo aqui é aplicado por cima das peças que ele devolve, como já se
   faz em app.js com as mitocôndrias da fibra e com a miofibrila contrátil.

   01 · MÚSCULO
   • O VENTRE TINHA GOMOS. O relevo era um cosseno de 17 ondas iguais em volta
     do ventre inteiro: dezessete gomos do mesmo tamanho, com a mesma fundura,
     de ponta a ponta. Isso desenha abóbora, não músculo. Agora o relevo vem de
     feixes (fascículos vistos por baixo da fáscia), cada um com largura,
     altura e torção próprias, e com um sulco de verdade entre um e outro —
     mais escuro, porque o vão recebe menos luz.
   • FIBRAS. Por cima do relevo, um mapa de relevo fino no comprimento: são as
     fibras que dão ao ventre o acabamento estriado que se vê de perto.
   • EPIMÍSIO. Estava em 5,5 % de opacidade: na prática, não existia. Volta a
     ser visto como uma película translúcida, levemente azulada (é a cor
     perolada da fáscia densa), que se acende na borda, onde a bainha vira de
     lado — na frente do ventre ela some e a carne é o que se vê.
   • A JANELA. Era um furo recortado na casca, sem espessura. Agora tem a borda
     do epimísio cortado em volta, que é como fica uma janela de dissecção.
   • TENDÃO. Ganha as fibras de colágeno no comprimento e o brilho perolado.

   04 · MIOFIBRILA
   • O SARCÔMERO DA JANELA ERA OUTRO MODELO. Os três de dentro eram a versão
     "simples" do 05: actina como bastão liso, sem tropomiosina, troponina,
     cabeças de miosina, pontes da linha M nem titina. O da janela passa a ser
     o próprio sarcômero do 05, com todos esses detalhes e com a mesma função
     de comprimento (`aplicarComprimento`). Os dois das pontas ficam fechados
     pela capa e continuam leves.
   • NADA ESTICADO. Para encher a capa de raio 0,60 os sarcômeros eram
     ampliados 1,34× na espessura: actinas e miosinas mais grossas e cabeças
     deformadas. Agora a capa tem o raio do disco Z do 05 (0,47) e os
     sarcômeros ficam em 1:1 — o mesmo desenho do nível 05, em série.
     A miofibrila fica mais esguia, e mais perto da proporção real
     (≈1 µm de diâmetro para 2,4 µm de sarcômero).
   • CAPA. Sem brilho de plástico, com o risco fino dos miofilamentos no
     comprimento, e o lado de dentro sombreado: pela janela, os filamentos se
     destacam contra o fundo em vez de se perderem nas faixas pintadas.
   O que vai para a RA continua sendo a geometria e a cor; o brilho de borda e
   a sombra de dentro são do navegador.                                       */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/* mesmas medidas do ventre em modelos.js (MUS e perfilVentre) */
const MUS = { A: 2.45, Rmax: .84, achata: .80 };
const perfilVentre = t => {
  const d = Math.max(-1, Math.min(1, (t + .09) / (1 + .09 * Math.sign(t + .09))));
  return Math.pow(Math.max(0, 1 - d * d), .58);
};
/* sorteio com semente: o músculo sai igual em toda abertura */
function sorteio(semente) {
  let a = semente >>> 0;
  return (min = 0, max = 1) => {
    a = (a + 0x6D2B79F5) >>> 0; let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return min + (((t ^ (t >>> 14)) >>> 0) / 4294967296) * (max - min);
  };
}
function textura(w, h, desenhar, { repetirX = 1, repetirY = 1, cor = false } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  desenhar(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = cor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repetirX, repetirY); t.anisotropy = 8;
  return t;
}
/* riscos finos numa direção: 'u' = ao longo da coordenada u da textura */
function fibrasFinas(base, { linhas = 900, ao = 'x', res = 1024, fundo = '#808080', claro = 200, escuro = 70, semente = 7 } = {}) {
  const r = sorteio(semente);
  return textura(res, res, (g, w, h) => {
    if (base) g.drawImage(base, 0, 0, w, h); else { g.fillStyle = fundo; g.fillRect(0, 0, w, h); }
    for (let i = 0; i < linhas; i++) {
      const v = r() < .5 ? claro : escuro;
      g.globalAlpha = r(.10, .38); g.fillStyle = `rgb(${v},${v},${v})`;
      const p = r(0, ao === 'x' ? h : w), e = r(.45, 1.5);
      if (ao === 'x') g.fillRect(0, p, w, e); else g.fillRect(p, 0, e, h);
    }
    g.globalAlpha = 1;
  });
}
/* borda que se acende onde a superfície vira de lado (película vista de raspão) */
function bordaAcesa(mat, cor, { forca = .55, alfa = .45, expoente = 2.6 } = {}) {
  mat.onBeforeCompile = sh => {
    sh.uniforms.uBorda = { value: new THREE.Color(cor).multiplyScalar(forca) };
    sh.fragmentShader = 'uniform vec3 uBorda;\n' + sh.fragmentShader
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n float bordaF = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), ' + expoente.toFixed(2) + ');')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += uBorda * bordaF;')
      .replace('#include <dithering_fragment>', '#include <dithering_fragment>\n gl_FragColor.a = clamp(gl_FragColor.a + bordaF * ' + alfa.toFixed(2) + ', 0.0, 1.0);');
  };
  mat.customProgramCacheKey = () => 'borda-' + cor + forca + alfa;
  mat.needsUpdate = true;
}

/* ============================================================ 01 MÚSCULO */
function acabarMusculo(musculo, M) {
  const ventre = musculo.getObjectByName('ventre_continuo');
  const fascia = musculo.getObjectByName('epimisio_continuo');
  if (!ventre || !ventre.geometry.attributes.uv) return;
  const geo = ventre.geometry, pos = geo.attributes.position, uv = geo.attributes.uv, cor = geo.attributes.color;

  /* os feixes sob a fáscia */
  const r = sorteio(2610);
  const N = 23, passo = Math.PI * 2 / N, feixes = [];
  for (let k = 0; k < N; k++) feixes.push({
    th: k * passo + r(-.22, .22) * passo,
    larg: passo * r(.60, .86),                 /* menos que o passo: sobra o sulco */
    alt: r(.036, .056),
    torcao: .24 + r(-.10, .10),
    fase: r(0, 6.283), onda: r(.12, .30),
    tom: r(-.05, .05),
  });
  const altMedia = feixes.reduce((s, f) => s + f.alt, 0) / N;
  const relevoEm = (u, a) => {
    const t = 2 * u - 1; let soma = 0, tom = 0, maior = 0;
    for (const f of feixes) {
      let d = a - (f.th + f.torcao * t + .06 * Math.sin(3.1 * t + f.fase));
      d = Math.atan2(Math.sin(d), Math.cos(d)) / f.larg;
      if (Math.abs(d) >= 1) continue;
      const forma = Math.pow(1 - d * d, 1.25);
      const h = f.alt * forma * (1 + f.onda * Math.sin(Math.PI * 2 * u * 1.4 + f.fase));
      soma += h; if (forma > maior) { maior = forma; tom = f.tom; }
    }
    /* o sulco nunca desce abaixo do ventre original: os fascículos de dentro não furam a casca */
    return { relevo: Math.max(-.012, soma - .40 * altMedia) + .006, crista: Math.min(1, soma / (altMedia * 1.1)), tom };
  };
  const corVentre = new THREE.Color(0x90352d), colageno = new THREE.Color(0xcdbf9f), c = new THREE.Color();
  const suave = x => x * x * (3 - 2 * x);
  for (let i = 0; i < pos.count; i++) {
    const u = uv.getX(i), a = uv.getY(i) * Math.PI * 2, t = 2 * u - 1, perfil = perfilVentre(t);
    const { relevo, crista, tom } = relevoEm(u, a);
    const raio = .105 + (MUS.Rmax + .025) * perfil + relevo * perfil;
    pos.setXYZ(i, t * MUS.A, Math.sin(a) * raio + .028 * Math.sin(Math.PI * u), Math.cos(a) * raio * MUS.achata);
    if (cor) {
      const transicao = suave(THREE.MathUtils.clamp((Math.abs(t) - .76) / .24, 0, 1));
      c.copy(corVentre).offsetHSL(0, 0, tom * .5).lerp(colageno, transicao);
      /* o sulco entre feixes recebe menos luz: a sombra de contato que faltava */
      c.multiplyScalar(.62 + .38 * suave(crista));
      cor.setXYZ(i, c.r, c.g, c.b);
    }
  }
  pos.needsUpdate = true; if (cor) cor.needsUpdate = true;
  geo.computeVertexNormals(); geo.computeBoundingBox(); geo.computeBoundingSphere();

  /* fibras finas por cima do relevo (o mesmo material reveste os fascículos da janela) */
  const bumpAntigo = M.musculo.bumpMap && M.musculo.bumpMap.image;
  M.musculo.bumpMap = fibrasFinas(bumpAntigo, { linhas: 1100, ao: 'x', semente: 11 });
  M.musculo.bumpMap.repeat.copy(M.musculo.map ? M.musculo.map.repeat : new THREE.Vector2(1, 1));
  M.musculo.bumpScale = .08; M.musculo.needsUpdate = true;

  /* epimísio: película fina, aderida, levemente azulada, acesa na borda */
  if (fascia) {
    const fg = geo.clone(); fg.deleteAttribute('color');
    const p = fg.attributes.position, n = fg.attributes.normal;
    for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) + n.getX(i) * .010, p.getY(i) + n.getY(i) * .010, p.getZ(i) + n.getZ(i) * .010);
    p.needsUpdate = true; fg.computeBoundingSphere();
    fascia.geometry.dispose(); fascia.geometry = fg;
    const fm = fascia.material;
    fm.color.set(0xd5e7f6); fm.opacity = .10; fm.roughness = .34;
    fm.clearcoat = .22; fm.clearcoatRoughness = .38;
    fm.sheen = .55; fm.sheenRoughness = .5; fm.sheenColor = new THREE.Color(0xcfe6ff);
    bordaAcesa(fm, 0x9fd3ff, { forca: .85, alfa: .62, expoente: 2.0 });
  }

  /* a borda da janela de dissecção: o epimísio cortado em volta */
  const laco = bordaDaJanela(geo);
  if (laco) {
    const curva = new THREE.CatmullRomCurve3(laco, true, 'centripetal');
    const borda = new THREE.Mesh(new THREE.TubeGeometry(curva, Math.min(400, laco.length * 2), .009, 8, true),
      new THREE.MeshPhysicalMaterial({ color: 0xb9d0e3, roughness: .55, sheen: .5, sheenColor: 0xdcefff, sheenRoughness: .6 }));
    borda.name = 'epimisio_borda_janela'; borda.castShadow = false; borda.receiveShadow = true;
    ventre.parent.add(borda); borda.position.copy(ventre.position); borda.quaternion.copy(ventre.quaternion); borda.scale.copy(ventre.scale);
  }

  /* tendão: colágeno paralelo, perolado */
  musculo.traverse(o => {
    if (!o.isMesh || !o.material || o.material === M.tendao || o.material.map !== M.tendao.map) return;
    const m = o.material;
    m.bumpMap = fibrasFinas(null, { linhas: 700, ao: 'y', semente: 23, claro: 190, escuro: 90 });
    m.bumpScale = .035; m.sheen = .9; m.sheenColor = new THREE.Color(0xf2f6ff); m.sheenRoughness = .38;
    m.needsUpdate = true;
  });
}

/* contorno da janela: arestas que pertencem a um triângulo só, fora das pontas do ventre */
function bordaDaJanela(geo) {
  const idx = geo.index && geo.index.array; if (!idx) return null;
  const pos = geo.attributes.position, conta = new Map();
  /* a malha tem uma costura (v = 0 e v = 1 no mesmo lugar): vértices na mesma
     posição contam como um só, senão a costura vira "borda" ao longo do ventre */
  const solda = new Map(), unico = new Int32Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    const k = pos.getX(i).toFixed(4) + ',' + pos.getY(i).toFixed(4) + ',' + pos.getZ(i).toFixed(4);
    if (!solda.has(k)) solda.set(k, i); unico[i] = solda.get(k);
  }
  const chave = (a, b) => (a < b ? a + ':' + b : b + ':' + a);
  for (let i = 0; i < idx.length; i += 3) for (let k = 0; k < 3; k++) {
    const a = unico[idx[i + k]], b = unico[idx[i + (k + 1) % 3]];
    if (a === b) continue;
    const ch = chave(a, b); conta.set(ch, (conta.get(ch) || 0) + 1);
  }
  const viz = new Map(), liga = (a, b) => { if (!viz.has(a)) viz.set(a, []); viz.get(a).push(b); };
  for (const [ch, n] of conta) {
    if (n !== 1) continue;
    const [a, b] = ch.split(':').map(Number);
    if (Math.abs(pos.getX(a)) > MUS.A * .93 || Math.abs(pos.getX(b)) > MUS.A * .93) continue;
    liga(a, b); liga(b, a);
  }
  let melhor = null; const visto = new Set();
  for (const ini of viz.keys()) {
    if (visto.has(ini)) continue;
    const laco = [ini]; visto.add(ini); let ant = -1, at = ini;
    for (;;) {
      const prox = (viz.get(at) || []).find(v => v !== ant && !visto.has(v));
      if (prox === undefined) break;
      laco.push(prox); visto.add(prox); ant = at; at = prox;
    }
    if (!melhor || laco.length > melhor.length) melhor = laco;
  }
  if (!melhor || melhor.length < 12) return null;
  const passo = Math.max(1, Math.round(melhor.length / 160));
  return melhor.filter((_, i) => i % passo === 0).map(i => new THREE.Vector3().fromBufferAttribute(pos, i));
}

/* ============================================================ 04 MIOFIBRILA */
const R_CAPA = .47;   /* disco Z do 05 (0,43) + aro (0,02) + folga */

/* cópia do sarcômero do 05 com as referências internas refeitas na cópia */
function copiarSarcomero(orig) {
  const ud = orig.userData; orig.userData = {};
  const copia = orig.clone(); orig.userData = ud;
  const a = [], b = []; orig.traverse(o => a.push(o)); copia.traverse(o => b.push(o));
  const par = o => b[a.indexOf(o)];
  copia.userData = {
    zL: par(ud.zL), zR: par(ud.zR), comprimento: ud.comprimento, foco: ud.foco && ud.foco.clone(),
    titinas: ud.titinas.map(t => ({ grp: par(t.grp), mola: par(t.mola), s: t.s })),
  };
  return copia;
}

function detalharMiofibrila(mio, sarcomero05, M, aplicarComprimento) {
  const aberto = mio.children.find(o => o.isGroup);
  if (!aberto || aberto.children.length !== 3) return;

  /* capa, tampas e anéis Z no raio do disco do 05 */
  const capaMat = M.miofibrilaCorte.clone();
  capaMat.roughness = .62; capaMat.clearcoat = 0; capaMat.sheen = .25; capaMat.sheenRoughness = .7; capaMat.sheenColor = new THREE.Color(0xffd2c8);
  capaMat.bumpMap = fibrasFinas(null, { linhas: 520, ao: 'y', semente: 41, claro: 175, escuro: 95 }); capaMat.bumpScale = .03;
  /* por dentro da capa, sombra: pela janela, os filamentos se destacam do fundo */
  capaMat.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n if (!gl_FrontFacing) diffuseColor.rgb *= 0.34;');
  };
  capaMat.customProgramCacheKey = () => 'capa-miofibrila-dentro';
  for (const o of mio.children) {
    if (!o.isMesh) continue;
    const g = o.geometry, p = g.parameters || {};
    if (g.type === 'TorusGeometry') { o.geometry = new THREE.TorusGeometry(R_CAPA + .008, p.tube, p.radialSegments, p.tubularSegments); g.dispose(); continue; }
    if (g.type !== 'CylinderGeometry') continue;
    if (p.openEnded) o.geometry = new THREE.CylinderGeometry(R_CAPA, R_CAPA, p.height, p.radialSegments, p.heightSegments, true, p.thetaStart, p.thetaLength);
    else o.geometry = new THREE.CylinderGeometry(R_CAPA + .012, R_CAPA + .012, p.height, p.radialSegments);
    o.material = capaMat; g.dispose();
  }

  /* a capa da frente, sobre os sarcômeros das pontas, fica translúcida, com as
     bandas pintadas: por ela se veem os filamentos dos três sarcômeros em série */
  const capas = mio.children.filter(o => o.isMesh && o.geometry.parameters && o.geometry.parameters.openEnded);
  const fundo = capas.reduce((a, b) => (a.geometry.parameters.height > b.geometry.parameters.height ? a : b), capas[0]);
  const frenteMat = capaMat.clone();
  frenteMat.transparent = true; frenteMat.opacity = .34; frenteMat.depthWrite = false; frenteMat.side = THREE.FrontSide;
  bordaAcesa(frenteMat, 0xffc9bd, { forca: .30, alfa: .40, expoente: 2.2 });
  capas.forEach(c => { if (c !== fundo) { c.material = frenteMat; c.castShadow = false; c.renderOrder = 2; } });

  /* os três sarcômeros são o do 05 (mesma função de comprimento) */
  const antigos = [...aberto.children];
  antigos.forEach(s => aberto.remove(s));
  antigos.forEach(a => {
    const s = copiarSarcomero(sarcomero05); s.position.copy(a.position); s.scale.setScalar(1);
    unirPorMaterial(s.userData.zL); unirPorMaterial(s.userData.zR);
    aberto.add(s); aplicarComprimento(s, s.userData.comprimento);
  });
}

/* junta as malhas paradas de um grupo, uma por material: menos chamadas de desenho no celular */
function unirPorMaterial(grp) {
  const porMat = new Map();
  grp.children.filter(o => o.isMesh).forEach(o => { if (!porMat.has(o.material)) porMat.set(o.material, []); porMat.get(o.material).push(o); });
  for (const [mat, lista] of porMat) {
    if (lista.length < 2) continue;
    const geos = lista.map(o => { o.updateMatrix(); const g = o.geometry.clone().applyMatrix4(o.matrix); for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k); return g.index ? g : g; });
    const todasIndexadas = geos.every(g => g.index), nenhuma = geos.every(g => !g.index);
    if (!todasIndexadas && !nenhuma) continue;
    const unida = mergeGeometries(geos); if (!unida) continue;
    lista.forEach(o => grp.remove(o));
    const m = new THREE.Mesh(unida, mat); m.castShadow = true; m.receiveShadow = true; grp.add(m);
  }
}

/* ============================================================ 01 · ORIGEM, ARTICULAÇÃO E INSERÇÃO
   O músculo ligava duas pontas de osso iguais, sem articulação: um músculo que
   não cruza articulação não move nada. Agora segue o desenho de um músculo do
   antebraço como o braquiorradial: ORIGEM na extremidade distal de um osso
   (mostrado só em parte, cortado na margem), ARTICULAÇÃO com cartilagem, fenda e
   cápsula, o segundo osso INTEIRO, e a INSERÇÃO perto do fim dele. O ventre corre
   ao lado do segundo osso e os tendões descem até a superfície óssea. A
   articulação fica levemente fletida: é o que faz ler "aqui dobra". */
const J = new THREE.Vector3(-3.08, -1.05, -.16);           /* centro da articulação */
const DIR_A = new THREE.Vector3(-Math.cos(.35), Math.sin(.35), 0).normalize(); /* osso da origem, 20° acima */
const N_A = new THREE.Vector3(Math.sin(.35), Math.cos(.35), 0);  /* lado de cima do osso da origem */
const EIXO_B = new THREE.Vector3(1, 0, 0);
const COMPR_B = 6.85;
const ORIGEM = J.clone().addScaledVector(DIR_A, 1.05).addScaledVector(N_A, .23);
const INSERCAO = new THREE.Vector3(J.x + 6.42, J.y + .25, J.z + .02);

function tornear(perfil, n, inicio, dir, mat, { radiais = 40, achata = 1 } = {}) {
  /* perfil(s) → raio, s de 0 a n; a peça cresce de `inicio` ao longo de `dir` */
  const pts = []; const passos = 90;
  for (let i = 0; i <= passos; i++) { const s = i / passos * n; pts.push(new THREE.Vector2(Math.max(1e-3, perfil(s)), s)); }
  const g = new THREE.LatheGeometry(pts, radiais); if (achata !== 1) g.scale(1, 1, achata);
  const m = new THREE.Mesh(g, mat);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()); m.position.copy(inicio);
  return m;
}
const liso = (a, b, x) => { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function tendaoCurvo(pontos, raio, mat) {
  const curva = new THREE.CatmullRomCurve3(pontos, false, 'centripetal');
  const g = new THREE.TubeGeometry(curva, 80, 1, 18, false);
  const pos = g.attributes.position, uv = g.attributes.uv, p = new THREE.Vector3(), c = new THREE.Vector3(), t = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    const u = uv.getX(i); p.fromBufferAttribute(pos, i); curva.getPointAt(u, c); curva.getTangentAt(u, t);
    p.sub(c); const r = raio(u);
    /* fita achatada: o tendão é largo de lado e fino de frente */
    p.z *= .62; p.multiplyScalar(r).add(c); pos.setXYZ(i, p.x, p.y, p.z);
  }
  g.computeVertexNormals();
  return new THREE.Mesh(g, mat);
}
function corteDoOsso() {
  /* a face cortada do osso da origem: cortical em anel, esponjosa e medula */
  return textura(256, 256, (g, w, h) => {
    const cx = w / 2, cy = h / 2;
    g.fillStyle = '#e9dfc8'; g.beginPath(); g.arc(cx, cy, 126, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#c99a6a'; g.beginPath(); g.arc(cx, cy, 84, 0, Math.PI * 2); g.fill();
    const r = sorteio(77);
    for (let i = 0; i < 260; i++) { const a = r(0, 6.283), d = r(0, 82); g.fillStyle = `rgba(150,70,48,${r(.25, .6)})`; g.beginPath(); g.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, r(2, 6), 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = 'rgba(160,140,110,.5)'; for (let k = 0; k < 6; k++) { g.lineWidth = 1.2; g.beginPath(); g.arc(cx, cy, 92 + k * 6, 0, Math.PI * 2); g.stroke(); }
  }, { cor: true });
}

function montarArticulacao(musculo, M) {
  /* sai o que havia nas pontas: ossos e tendões em linha reta */
  const sair = [];
  musculo.traverse(o => { if (o.isMesh && (o.userData.foraDoQuadro || (o.material && o.material.map === M.tendao.map && o.material !== M.tendao))) sair.push(o); });
  const tendaoMat = sair.find(o => o.material && o.material.map === M.tendao.map)?.material || M.tendao.clone();
  sair.forEach(o => o.parent.remove(o));

  const osso = M.osso.clone(); osso.roughness = .78;
  osso.bumpMap = fibrasFinas(null, { linhas: 380, ao: 'y', semente: 5, claro: 175, escuro: 105 }); osso.bumpScale = .02;
  const cart = M.cartilagem.clone(); cart.color.set(0xc4d9e2); cart.roughness = .36; cart.sheen = .7;
  const novos = [];

  /* osso da origem (como o úmero distal): diáfise cortada, alarga nos epicôndilos */
  const compA = 3.0;
  const ossoA = tornear(s => .205 + .03 * liso(0, 1.8, s) + .17 * liso(1.9, 2.72, s), 2.72, J.clone().addScaledVector(DIR_A, compA), DIR_A.clone().negate(), osso, { achata: .78 });
  ossoA.userData.foraDoQuadro = true; novos.push(ossoA);
  const face = new THREE.Mesh(new THREE.CircleGeometry(.205, 40), new THREE.MeshPhysicalMaterial({ map: corteDoOsso(), roughness: .85 }));
  face.scale.set(1, 1, 1); face.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), DIR_A); face.position.copy(J).addScaledVector(DIR_A, compA + .002);
  face.scale.set(1, .78, 1); face.userData.foraDoQuadro = true; novos.push(face);
  /* os dois côndilos, com cartilagem só na face articular */
  for (const lado of [-1, 1]) {
    const c = new THREE.Mesh(new THREE.SphereGeometry(.24, 28, 20), osso);
    c.scale.set(1, .95, .82); c.position.copy(J).addScaledVector(DIR_A, .27).add(new THREE.Vector3(0, 0, lado * .15));
    novos.push(c);
    const cc = new THREE.Mesh(new THREE.SphereGeometry(.247, 28, 20, 0, Math.PI * 2, 0, Math.PI / 2.4), cart);
    cc.scale.set(1, .95, .82); cc.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), DIR_A.clone().negate());
    cc.position.copy(c.position); novos.push(cc);
  }

  /* o segundo osso, inteiro (como o rádio): cabeça, colo, diáfise e extremidade larga */
  const iniB = J.clone().addScaledVector(EIXO_B, .06);
  const perfilB = s => {
    if (s < .05) return .17 + 1.9 * s;
    if (s < .30) return .265;
    if (s < .62) return .265 - .115 * liso(.30, .62, s);
    if (s < 5.55) return .15 + .055 * liso(.62, 5.55, s);
    if (s < 6.55) return .205 + .16 * liso(5.55, 6.55, s);
    return .365 * Math.sqrt(Math.max(0, 1 - Math.pow((s - 6.55) / .30, 2)));
  };
  const ossoB = tornear(perfilB, COMPR_B, iniB, EIXO_B, osso, { radiais: 44, achata: .86 });
  novos.push(ossoB);
  const capB = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .035, 36), cart);
  capB.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), EIXO_B); capB.position.copy(iniB).addScaledVector(EIXO_B, .005); capB.scale.set(1, 1, .86);
  novos.push(capB);
  /* processo estiloide na ponta da inserção */
  const estil = new THREE.Mesh(new THREE.ConeGeometry(.09, .32, 18), osso);
  estil.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, -.25, 0).normalize());
  estil.position.copy(iniB).add(new THREE.Vector3(COMPR_B + .02, -.12, .05)); novos.push(estil);

  /* cápsula articular: manga translúcida em volta da fenda */
  const capMat = new THREE.MeshPhysicalMaterial({ color: 0xcfe3f2, roughness: .4, transparent: true, opacity: .16, depthWrite: false, sheen: .6, sheenColor: 0xe2f1ff });
  bordaAcesa(capMat, 0x9fd3ff, { forca: .55, alfa: .45, expoente: 2.2 });
  const capsula = new THREE.Mesh(new THREE.SphereGeometry(.5, 36, 24), capMat);
  capsula.scale.set(1.15, .86, .82); capsula.position.copy(J).addScaledVector(DIR_A, .14); capsula.castShadow = false; capsula.renderOrder = 3;
  capsula.name = 'capsula_articular'; novos.push(capsula);

  /* tendões: do ventre até a superfície do osso, alargando onde prendem */
  const raioTendao = u => .30 - .19 * liso(0, .42, u) + .045 * liso(.80, 1, u);
  const origemT = tendaoCurvo([new THREE.Vector3(-1.98, 0, 0), new THREE.Vector3(-2.5, -.02, -.02), new THREE.Vector3(-3.25, -.22, -.08), ORIGEM.clone()], raioTendao, tendaoMat);
  const insercaoT = tendaoCurvo([new THREE.Vector3(1.98, 0, 0), new THREE.Vector3(2.5, -.04, -.01), new THREE.Vector3(3.0, -.42, -.01), INSERCAO.clone()], raioTendao, tendaoMat);
  origemT.name = 'tendao_origem'; insercaoT.name = 'tendao_insercao'; novos.push(origemT, insercaoT);

  novos.forEach(o => { o.castShadow = o !== capsula; o.receiveShadow = true; musculo.add(o); });

  /* centraliza o conjunto no palco (o giro é em torno da origem da cena) */
  const caixa = new THREE.Box3(); musculo.updateMatrixWorld(true);
  musculo.traverse(o => { if (o.isMesh && !o.userData.foraDoQuadro) caixa.expandByObject(o); });
  const centro = caixa.getCenter(new THREE.Vector3()); centro.z = 0;
  musculo.children.forEach(o => o.position.sub(centro));
  if (musculo.userData.foco) musculo.userData.foco.sub(centro);
  musculo.userData.desvio = centro.clone().negate();
  musculo.userData.pontos = { origem: ORIGEM.clone(), insercao: INSERCAO.clone(), articulacao: J.clone(), osso: iniB.clone().addScaledVector(EIXO_B, 3.6).add(new THREE.Vector3(0, -.2, .1)) };
}

export function aplicarAcabamento(modelos, M, aplicarComprimento) {
  try { acabarMusculo(modelos[0], M); } catch (e) { console.warn('acabamento do músculo', e); }
  try { montarArticulacao(modelos[0], M); } catch (e) { console.warn('articulação', e); }
  try { detalharMiofibrila(modelos[3], modelos[4], M, aplicarComprimento); } catch (e) { console.warn('detalhe da miofibrila', e); }
}
