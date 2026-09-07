/* ============================================================================
   TESTE 11 — CORAÇÃO EM AÇÃO · geometria e materiais. Nada de DOM.
   O motor mora em `fisica.js` e NÃO é importado aqui: geometria não decide
   número. Quem junta os dois é o app — e é essa separação que permitiu afinar
   o ciclo contra o livro sem abrir navegador nenhum.

   ── O QUE ESTE DESENHO PRECISA DIZER, e que uma figura bonita não diz ─────
   1. A PAREDE DO VENTRÍCULO ESQUERDO É TRÊS VEZES A DO DIREITO. Não é
      detalhe de ilustrador: é a resposta inteira à pergunta "por que a
      pressão da aorta é cinco vezes a da artéria pulmonar". Por isso as
      câmaras são construídas com parede EXTERNA e INTERNA separadas, e não
      como cascas de espessura decorativa.
   2. O DIREITO ABRAÇA O ESQUERDO. Ele não é um segundo cone ao lado — é uma
      meia-lua colada na frente, e o septo é parede do esquerdo trabalhando
      para os dois. Desenhá-los como gêmeos é o erro mais comum.
   3. OS VASOS SE CRUZAM. O tronco pulmonar sai à frente e vai para a
      esquerda; a aorta sai atrás dele e curva para a direita. Se saírem
      paralelos, some a razão de a artéria pulmonar tapar a aorta na radiografia.
   4. AS CÚSPIDES SÃO BOLSAS, NÃO TAMPAS. Mesma regra da bancada 08: a valva
      se enche por trás e encosta as bordas. Tampa é o modelo errado.

   ── COR ──────────────────────────────────────────────────────────────────
   Vermelho é sangue oxigenado, azul é venoso — a convenção que o aluno já
   traz. O MIOCÁRDIO não usa nenhum dos dois: é pardo-avermelhado de músculo,
   porque se ele fosse vermelho-sangue as câmaras sumiriam dentro dele.
   ========================================================================== */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import {
  NIVEIS, ALTURA_VE, ALTURA_VD, VD_Y, SUBIR_PLANO, PLANO_VALVAR,
} from './niveis.js';
import {
  perfilVentriculo as perfilVentriculoXY,
  perfilAtrio as perfilAtrioXY,
  prepararPerfis,
  pontoNoLathe,
  perfilDoLabio,
  perfilDoTampo,
  JUNTAS_VASO,
  saidaDaParede,
} from './parede.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const cor = (r, g, b) => new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);

/* 1 unidade = 1 mm. O coração tem uns 120 de comprimento. */
export const CORACAO = { comprimento: 118, largura: 96, eixo: 26 };

const phys = o => new THREE.MeshPhysicalMaterial(o);
export const M = {
  /* ── O BRILHO ESTAVA LAVANDO TUDO ────────────────────────────────────────
     Na primeira foto o coração inteiro era um salmão só: músculo, átrio,
     aorta e coronária na mesma tinta, e nada se separava. A culpa não era da
     escolha das cores — era do `sheen` alto com cor quase branca por cima,
     que puxa todo pigmento para o claro. É o mesmo defeito que branqueou a
     veia na bancada 08.

     Agora o MIOCÁRDIO é fundo e fosco, com brilho baixo e quente; os vasos
     têm brilho ALTO porque são lisos e molhados de verdade; e a diferença
     entre fosco e lustroso passa a separar as peças sozinha, sem depender de
     matiz — que é o que sobra quando o ACES comprime a saturação. */
  miocardio: phys({ color: 0x8f2f33, roughness: .74, sheen: .35,
                    sheenColor: cor(210, 96, 84), sheenRoughness: .8 }),
  miocardioFino: phys({ color: 0xa03f42, roughness: .72, sheen: .34,
                        sheenColor: cor(220, 110, 96), sheenRoughness: .8 }),
  atrio: phys({ color: 0x6f3140, roughness: .80, sheen: .28,
                sheenColor: cor(190, 100, 110), sheenRoughness: .85 }),
  endocardio: phys({ color: 0xd9b6b8, roughness: .30, sheen: .7,
                     sheenColor: cor(255, 235, 235) }),
  valva: phys({ color: 0xf4ece6, roughness: .26, sheen: .9,
                sheenColor: cor(255, 255, 255),
                transparent: true, opacity: .94 }),
  corda: phys({ color: 0xd8c9bd, roughness: .48, sheen: .5 }),
  /* os grandes vasos são LISOS: brilho alto, e é ele que os separa do
     músculo mesmo quando a cor é parecida */
  aorta: phys({ color: 0xe4736b, roughness: .28, sheen: .95,
                sheenColor: cor(255, 210, 190) }),
  pulmonar: phys({ color: 0x6b79c8, roughness: .30, sheen: .95,
                   sheenColor: cor(200, 210, 255) }),
  cava: phys({ color: 0x4a55a0, roughness: .34, sheen: .85,
               sheenColor: cor(180, 195, 255) }),
  veiaPulmonar: phys({ color: 0xc85f60, roughness: .32, sheen: .9,
                       sheenColor: cor(255, 200, 190) }),
  /* a coronária precisa LER POR CIMA do músculo: quase escarlate, lustrosa,
     com um resto de emissiva. Sem isso ela some no próprio órgão que irriga. */
  coronaria: phys({ color: 0xf0454a, roughness: .24, sheen: 1,
                    sheenColor: cor(255, 190, 180),
                    emissive: cor(70, 8, 10).getHex(), emissiveIntensity: .55 }),
  gordura: phys({ color: 0xe3cf94, roughness: .82, sheen: .35 }),
  conducao: phys({ color: 0x33301c, roughness: .5,
                   emissive: cor(60, 52, 12).getHex(), emissiveIntensity: .5 }),
  sangueRico: phys({ color: 0xd83a3f, roughness: .3, sheen: .9,
                     sheenColor: cor(255, 190, 180), transparent: true, opacity: .88 }),
  sanguePobre: phys({ color: 0x4a56a8, roughness: .3, sheen: .9,
                      sheenColor: cor(180, 190, 255), transparent: true, opacity: .88 }),
};

export const ACESA = cor(255, 214, 88);

/* ── CÂMARA DE PAREDE DUPLA ───────────────────────────────────────────────
   Duas revoluções concêntricas: a externa é o epicárdio, a interna é a
   cavidade. A ESPESSURA É A INFORMAÇÃO — o esquerdo tem 10 mm de parede e o
   direito 3, e é daí que sai toda a diferença de pressão entre os dois lados.

   O grupo guarda as duas malhas para que a física possa mudar o VOLUME sem
   mudar a espessura: contrair é a cavidade encolher e a parede engrossar,
   não a peça inteira encolher. */
function xy(p) { return new THREE.Vector2(p.x, p.y); }

/* A FACE DO CORTE é a peça mais importante do nível "por dentro": é ela, e
   só ela, que mostra a ESPESSURA da parede. Sem ela o corte revela a cavidade
   mas a parede vira uma linha, e a diferença entre 10 mm e 3 mm — que é a
   resposta inteira à diferença de pressão entre os dois lados — desaparece.

   LatheGeometry gera (r·sin φ, y, r·cos φ). A face TEM de usar a mesma
   conta — com (r·cos, y, r·sin) ela nascia 90° ao lado do corte, e o anel
   do lathe ficava um vão aberto. */
function faceDoCorte(dentro, fora, t0) {
  const pos = [], idx = [];
  for (let i = 0; i < dentro.length; i++) {
    const a = pontoNoLathe(dentro[i].x, dentro[i].y, t0);
    const b = pontoNoLathe(fora[i].x, fora[i].y, t0);
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
    if (i < dentro.length - 1) {
      const k = i * 2;
      idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

function anelEntre(a, b, t0, tL, segs) {
  if (Math.hypot(a.x - b.x, a.y - b.y) < .08) return null;
  if (a.x < .25 && b.x < .25) return null;
  const g = new THREE.LatheGeometry([xy(a), xy(b)], segs, t0, tL);
  g.computeVertexNormals();
  return g;
}

function labioDoOstio(dentro, fora, t0, tL, segs) {
  const pts = perfilDoLabio(dentro[dentro.length - 1], fora[fora.length - 1]).map(xy);
  const g = new THREE.LatheGeometry(pts, segs, t0, tL);
  g.computeVertexNormals();
  return g;
}

/* Torus no teto: o lábio plano-alto ainda deixa um cresce quando o vaso
   não é coaxial com a câmara. A coroa tem de chegar perto do tubo, senão
   o vão em cresce da foto continua entre o anel e o vaso. */
function coroaDoOstio(dentro, fora, t0, tL, segs) {
  const i = dentro[dentro.length - 1], f = fora[fora.length - 1];
  const rMeio = (i.x + f.x) / 2;
  const tubo = Math.max(7.2, (f.x - i.x) * 0.7 + 4);
  const y = (i.y + f.y) / 2;
  const pts = [];
  for (let k = 0; k <= 10; k++) {
    const a = (k / 10) * Math.PI * 2;
    pts.push(new THREE.Vector2(rMeio + tubo * Math.cos(a), y + tubo * Math.sin(a)));
  }
  const g = new THREE.LatheGeometry(pts, segs, t0, tL);
  g.computeVertexNormals();
  return g;
}

function tampoDoOstio(dentro, fora, t0, tL, segs) {
  const pts = perfilDoTampo(dentro[dentro.length - 1], fora[fora.length - 1]);
  if (!pts) return null;
  const g = new THREE.LatheGeometry(pts.map(xy), segs, t0, tL);
  g.computeVertexNormals();
  return g;
}

function geometriaDosSelos(dentro, fora, t0, tL, segs) {
  const partes = [];
  const ostio = labioDoOstio(dentro, fora, t0, tL, segs);
  if (ostio) {
    partes.push(ostio);
    partes.push(peloAvesso(ostio));
  }
  const coroa = coroaDoOstio(dentro, fora, t0, tL, segs);
  if (coroa) {
    partes.push(coroa);
    partes.push(peloAvesso(coroa));
  }
  const tampo = tampoDoOstio(dentro, fora, t0, tL, segs);
  if (tampo) {
    partes.push(tampo);
    partes.push(peloAvesso(tampo));
  }
  const polo = anelEntre(fora[0], dentro[0], t0, tL, segs);
  if (polo) {
    partes.push(polo);
    partes.push(peloAvesso(polo));
  }
  if (tL < Math.PI * 2 - 1e-3) {
    partes.push(faceDoCorte(dentro, fora, t0));
    partes.push(peloAvesso(faceDoCorte(dentro, fora, t0 + tL)));
  }
  /* o lathe traz uv; a face do corte não. Sem apagar, o merge devolve null
     e o selo some — o vão volta. */
  for (const p of partes) p.deleteAttribute('uv');
  return partes.length ? mergeGeometries(partes) : null;
}

function camaraDupla(perfilInterno, espessura, mat, matInterno, segs = 30, corte = null) {
  const g = new THREE.Group();
  const { dentro: d0, fora: f0 } = prepararPerfis(perfilInterno, espessura);
  const dentro = d0.map(xy), fora = f0.map(xy);
  const t0 = corte ? corte[0] : 0, tL = corte ? corte[1] : Math.PI * 2;

  const externa = new THREE.Mesh(new THREE.LatheGeometry(fora, segs, t0, tL), mat);
  const interna = new THREE.Mesh(new THREE.LatheGeometry(dentro, segs, t0, tL), matInterno || M.endocardio);
  externa.userData.papelParede = 'externa';
  interna.userData.papelParede = 'interna';
  /* a cavidade é vista POR DENTRO: a face tem de estar invertida na
     GEOMETRIA, nunca em `side` — o glTF descarta o material e o USDZ do
     iPhone descarta até o `doubleSided` */
  interna.geometry = peloAvesso(interna.geometry);
  g.add(externa, interna);
  const geoSelo = geometriaDosSelos(dentro, fora, t0, tL, segs);
  let selo = null;
  if (geoSelo) {
    selo = new THREE.Mesh(geoSelo, mat);
    selo.userData.papelParede = 'selo';
    g.add(selo);
  }
  g.userData = { externa, interna, espessura };
  g.userData.selo = selo;
  g.userData.perfilDentro = d0;
  g.userData.perfilFora = f0;
  g.userData.phi0 = t0;
  g.userData.phiL = tL;
  g.userData.segsLathe = segs;
  return g;
}

function escalarCamara(grupo, volume, referencia) {
  const e = Math.cbrt(clamp(volume / referencia, .25, 2));
  /* a externa acompanha só um terço: o resto vira espessura de parede */
  const ef = 1 - (1 - e) * .34;
  const yIn = 1 - (1 - e) * .35;
  const yOut = 1 - (1 - ef) * .4;
  const interna = grupo.userData?.interna?.isMesh
    ? grupo.userData.interna
    : grupo.children.find(c => c.userData?.papelParede === 'interna');
  const externa = grupo.userData?.externa?.isMesh
    ? grupo.userData.externa
    : grupo.children.find(c => c.userData?.papelParede === 'externa');
  const selo = grupo.userData?.selo?.isMesh
    ? grupo.userData.selo
    : grupo.children.find(c => c.userData?.papelParede === 'selo');
  if (interna) interna.scale.set(e, yIn, e);
  if (externa) externa.scale.set(ef, yOut, ef);
  const d0 = grupo.userData?.perfilDentro, f0 = grupo.userData?.perfilFora;
  if (selo && d0 && f0) {
    const d = d0.map(p => new THREE.Vector2(p.x * e, p.y * yIn));
    const f = f0.map(p => new THREE.Vector2(p.x * ef, p.y * yOut));
    const geo = geometriaDosSelos(d, f, grupo.userData.phi0, grupo.userData.phiL, grupo.userData.segsLathe);
    if (geo) {
      const antiga = selo.geometry;
      selo.geometry = geo;
      if (antiga && antiga !== geo) antiga.dispose();
    }
  }
}

function peloAvesso(geo) {
  const g = geo.clone(), idx = g.getIndex();
  if (idx) {
    const a = idx.array.slice();
    for (let i = 0; i < a.length; i += 3) { const t = a[i]; a[i] = a[i + 2]; a[i + 2] = t; }
    g.setIndex(new THREE.BufferAttribute(a, 1));
  }
  const n = g.attributes.normal;
  if (n) { for (let i = 0; i < n.count; i++) n.setXYZ(i, -n.getX(i), -n.getY(i), -n.getZ(i)); n.needsUpdate = true; }
  return g;
}

/* perfil de um ventrículo: bala alongada, mais estreita na ponta.
   O polo vai ao eixo (senão o lathe deixa um furo na ponta) e o óstio
   fica aberto — o lúmen é a passagem; quem fecha a PAREDE é o anel do selo. */
function perfilVentriculo(raio, altura, pontudo = 1) {
  return perfilVentriculoXY(raio, altura, pontudo);
}

/* ── OS VENTRÍCULOS ───────────────────────────────────────────────────────
   O esquerdo é um cone de parede grossa. O direito NÃO é um segundo cone: é
   uma meia-lua abraçada nele, e o septo pertence ao esquerdo. */
function ventriculoEsquerdo(corte) {
  const g = camaraDupla(perfilVentriculo(26, ALTURA_VE), 10, M.miocardio, null, 30, corte);
  g.userData.papel = 've';
  return g;
}

function ventriculoDireito(corte) {
  /* a meia-lua: um perfil próprio, achatado e recortado em theta, encostado
     na frente e à direita do esquerdo. As duas faces em theta — o corte da
     frente e a junta septal — passam por camaraDupla, senão a parede do
     direito é um cano aberto. */
  const perfil = perfilVentriculo(23, ALTURA_VD, 1.15);
  const t0 = corte ? Math.max(corte[0], -Math.PI * .58) : -Math.PI * .58;
  const tL = corte ? Math.min(corte[1], Math.PI * 1.16) : Math.PI * 1.16;
  const gg = camaraDupla(perfil, 3.4, M.miocardioFino, null, 26, [t0, tL]);
  /* achatado contra o esquerdo, e encostado: a junta septal era um vão
     entre dois sólidos. A meia-lua continua meia-lua. */
  gg.scale.set(1, 1, .78);
  gg.position.set(-13.4, VD_Y, 9.4);
  gg.rotation.y = -.30;
  gg.userData.papel = 'vd';
  return gg;
}

/* Cordão de miocárdio no sulco interventricular: a meia-lua e o cone do
   esquerdo não compartilham vértices, e o vão entre os dois lia como furo. */
function soldaSepto() {
  const g = new THREE.Group();
  const pts = [
    [-6, 10, 20],
    [-8, 28, 24],
    [-11, 48, 22],
    [-13, 66, 16],
    [-13.2, 76, 11],
  ];
  const geo = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(pts.map(p => V(...p))), 24, 7.2, 10, false);
  g.add(new THREE.Mesh(geo, M.miocardio),
        new THREE.Mesh(peloAvesso(geo), M.miocardio));
  return g;
}

/* ── OS ÁTRIOS ────────────────────────────────────────────────────────────
   Sacos de parede fina em cima dos ventrículos, cada um com a sua aurícula —
   que é a orelhinha que todo mundo reconhece e quase nenhum desenho põe. */
function atrio(lado, corte) {
  const g = camaraDupla(perfilAtrioXY(), 2.6, M.atrio, M.endocardio, 26, corte);
  /* a aurícula: uma bolsa curva pendurada na frente */
  const pts = [];
  for (let i = 0; i <= 6; i++) {
    const t = i / 6;
    pts.push(V(lado * (10 + 14 * t), 16 + 8 * Math.sin(Math.PI * t), 12 + 9 * t - 5 * t * t));
  }
  const aur = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 6.2, 12, false), M.atrio);
  const raiz = new THREE.Mesh(new THREE.SphereGeometry(6.2, 12, 9), M.atrio);
  raiz.position.copy(pts[0]);
  const ponta = new THREE.Mesh(new THREE.SphereGeometry(6.2, 12, 9), M.atrio);
  ponta.position.copy(pts[pts.length - 1]);
  g.add(aur, raiz, ponta);
  g.userData.papel = lado > 0 ? 'ae' : 'ad';
  return g;
}

/* ── AS VÁLVULAS ──────────────────────────────────────────────────────────
   Cúspides como BOLSAS, com a mesma construção que a bancada 08 usou para a
   válvula venosa: presa ao anel na base, solta na borda, e o que abre e fecha
   é o raio da borda livre. Semilunares têm três; a mitral, duas. */
const NU = 8, NV = 12;
function cuspide(R, comp, tetaInicio, tetaLargura) {
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array((NU + 1) * (NV + 1) * 3), idx = [];
  for (let i = 0; i <= NU; i++) for (let j = 0; j <= NV; j++) {
    if (i < NU && j < NV) {
      const a = i * (NV + 1) + j, b = a + 1, c = a + NV + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.userData = { R, comp, tetaInicio, tetaLargura, nu: NU, nv: NV };
  return g;
}

export function moldarCuspide(malha, abertura) {
  const g = malha.geometry, u = g.userData, pos = g.attributes.position;
  const rLivre = u.R * (0.07 + 0.85 * abertura);
  for (let i = 0; i <= u.nu; i++) {
    const s = i / u.nu, t = s * s * (3 - 2 * s);
    const r = u.R * (1 - t) + rLivre * t;
    const bojo = (1 - abertura) * .26 * Math.sin(Math.PI * s);
    for (let j = 0; j <= u.nv; j++) {
      const teta = u.tetaInicio + (j / u.nv) * u.tetaLargura;
      const rr = r + u.R * bojo * Math.sin((j / u.nv) * Math.PI);
      pos.setXYZ(i * (u.nv + 1) + j, Math.cos(teta) * rr, s * u.comp, Math.sin(teta) * rr);
    }
  }
  pos.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere();
}

function valva(nCuspides, R, comp) {
  const g = new THREE.Group();
  const passo = Math.PI * 2 / nCuspides;
  for (let k = 0; k < nCuspides; k++) {
    const m = new THREE.Mesh(cuspide(R, comp, k * passo, passo), M.valva);
    moldarCuspide(m, 1);
    g.add(m);
  }
  /* o anel: sem ele a valva parece flutuar no vão */
  const anel = new THREE.Mesh(new THREE.TorusGeometry(R * 1.02, R * .09, 8, 26), M.corda);
  anel.rotation.x = Math.PI / 2;
  g.add(anel);
  g.userData = { nCuspides, R };
  return g;
}

/* cordas tendíneas: elas existem para a valva atrioventricular não VIRAR do
   avesso na sístole, e sem elas o desenho sugere que a pressão não faz força */
function cordas(R, deY, ateY, n = 10) {
  const gs = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const pts = [V(Math.cos(a) * R * .82, deY, Math.sin(a) * R * .82),
                 V(Math.cos(a) * R * .55, (deY + ateY) / 2, Math.sin(a) * R * .55),
                 V(Math.cos(a) * R * .34, ateY, Math.sin(a) * R * .34)];
    gs.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, .5, 5, false));
  }
  return new THREE.Mesh(mergeGeometries(gs), M.corda);
}

/* ── OS GRANDES VASOS ─────────────────────────────────────────────────────
   E ELES SE CRUZAM. O tronco pulmonar sai à frente do coração e vai para a
   ESQUERDA; a aorta sai atrás dele e curva para a DIREITA. Desenhá-los
   paralelos apaga a razão de a pulmonar cobrir a aorta na radiografia. */
function vasoTubo(pontos, raio, mat, segs = 28) {
  return new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos.map(p => V(...p))), segs, raio, 16, false), mat);
}

/* Cone + anel + torus no PLANO do teto (ySaida), não a uma fração fixa do
   primeiro segmento: essa fração punha o colar acima do furo e o cresce
   da foto — miocárdio cortando no vaso — seguia visível. Sem esfera maciça:
   ela tamponava o lúmen. O torus tem volume visto de lado. */
function colarDaRaiz(p0, p1, rTubo, rBase, mat) {
  const a = V(...p0), b = V(...p1);
  const dir = b.clone().sub(a);
  const span = dir.length() || 1;
  dir.multiplyScalar(1 / span);
  const saida = a.clone();
  const g = new THREE.Group();
  const len = Math.max(16, (rBase - rTubo) * 1.15);
  const cone = new THREE.CylinderGeometry(rTubo * 1.02, rBase, len, 24, 1, true);
  const mCone = new THREE.Mesh(cone, mat);
  mCone.position.copy(saida);
  mCone.quaternion.setFromUnitVectors(V(0, 1, 0), dir);
  const anel = new THREE.Mesh(new THREE.RingGeometry(rTubo * 0.92, rBase, 24, 2), mat);
  anel.position.copy(saida);
  anel.quaternion.setFromUnitVectors(V(0, 0, 1), dir);
  const rTorus = (rTubo + rBase) * 0.5;
  const tuboTorus = Math.max(4.8, (rBase - rTubo) * 0.42);
  const torus = new THREE.Mesh(new THREE.TorusGeometry(rTorus, tuboTorus, 14, 28), mat);
  torus.position.copy(saida);
  torus.quaternion.setFromUnitVectors(V(0, 0, 1), dir);
  const torusAlto = torus.clone();
  torusAlto.position.copy(saida).add(dir.clone().multiplyScalar(7));
  /* arruela com VOLUME (retângulo revolvido): anel/torus vistos de lado
     viram linha e o cresce da foto volta */
  const grosso = new THREE.LatheGeometry([
    new THREE.Vector2(rTubo * 0.98, -9),
    new THREE.Vector2(rBase, -9),
    new THREE.Vector2(rBase, 9),
    new THREE.Vector2(rTubo * 0.98, 9),
  ], 28);
  const mGrosso = new THREE.Mesh(grosso, mat);
  mGrosso.position.copy(saida);
  mGrosso.quaternion.setFromUnitVectors(V(0, 1, 0), dir);
  const avesso = (mesh) => {
    const m = new THREE.Mesh(peloAvesso(mesh.geometry), mesh.material);
    m.position.copy(mesh.position);
    m.quaternion.copy(mesh.quaternion);
    m.scale.copy(mesh.scale);
    return m;
  };
  g.add(mCone, anel, torus, torusAlto, mGrosso,
        avesso(mCone), avesso(anel), avesso(torus), avesso(torusAlto), avesso(mGrosso));
  return g;
}

function grandesVasos() {
  const g = new THREE.Group();
  const põe = (pts, mat, junta, matParede) => {
    g.add(vasoTubo(pts, junta.rTubo, mat));
    const { p, q } = saidaDaParede(pts, junta.ySaida);
    g.add(colarDaRaiz(p, q, junta.rTubo, junta.rBase, mat));
    /* arruela de miocárdio por fora do colar: o cresce da foto era o
       epicárdio cortando no ar, sem chegar no vaso */
    if (matParede)
      g.add(colarDaRaiz(p, q, junta.rTubo * 1.05, junta.rBase * 1.22, matParede));
  };
  /* aorta: sai do centro, sobe por trás e faz a crossa para a direita */
  põe([[4, 56, -4], [5, 82, -2], [4, 104, 2], [-8, 118, 4], [-26, 112, 2], [-32, 92, -2]],
      M.aorta, JUNTAS_VASO.aorta, M.miocardio);
  /* tronco pulmonar: sai à FRENTE e cruza para a esquerda, por cima */
  põe([[-12, 50, 16], [-10, 80, 14], [-4, 98, 8], [10, 106, 2]],
      M.pulmonar, JUNTAS_VASO.pulmonar, M.miocardioFino);
  /* os dois ramos pulmonares */
  g.add(vasoTubo([[10, 106, 2], [26, 104, -4], [38, 96, -10]], 6.4, M.pulmonar));
  g.add(vasoTubo([[10, 106, 2], [0, 100, -14], [-12, 92, -22]], 6.0, M.pulmonar));
  /* cavas: entram no átrio direito por cima e por baixo */
  põe([[-30, 96, -10], [-30, 76, -6], [-26, 60, -2]], M.cava, JUNTAS_VASO.cava, M.atrio);
  põe([[-24, 18, -10], [-26, 34, -8], [-25, 50, -4]], M.cava, JUNTAS_VASO.cavaInf, M.atrio);
  /* veias pulmonares: quatro, entrando no átrio esquerdo por trás */
  for (const [x, z] of [[30, -18], [34, -6], [18, -24], [12, -26]])
    põe([[x, 72 + z * .2, z - 8], [x * .7, 66, z * .5], [x * .35, 60, -4]],
        M.veiaPulmonar, JUNTAS_VASO.veiaPulm, M.atrio);
  return g;
}

/* ── AS CORONÁRIAS ────────────────────────────────────────────────────────
   Elas correm nos SULCOS: a descendente anterior no sulco interventricular,
   a circunflexa e a direita no sulco atrioventricular. Pô-las em qualquer
   lugar da superfície é desenhar cano, não artéria — o sulco é o que explica
   por que uma oclusão mata um território e não outro. */
/* O raio EXTERNO do ventrículo esquerdo numa dada altura. É com ele que a
   coronária é assentada na superfície: na primeira foto elas simplesmente não
   apareciam, porque eu as desenhei em coordenadas soltas e o miocárdio as
   engoliu. Artéria epicárdica corre POR CIMA do músculo — se ela não estiver
   na superfície, não é coronária, é um cano dentro da carne. */
const PERFIL_VE = perfilVentriculo(26, ALTURA_VE);
/* pontos do sulco AV e da base sobem com o plano valvar; a ponta fica */
const noSulco = ([x, y, z]) => [x, y >= 48 ? y + SUBIR_PLANO : y, z];
function raioExterno(y) {
  let melhor = PERFIL_VE[0];
  for (const p of PERFIL_VE) if (Math.abs(p.y - y) < Math.abs(melhor.y - y)) melhor = p;
  return melhor.x + 10;                       // + a espessura da parede
}
/* assenta um caminho na superfície, mantendo o azimute de cada ponto */
function naSuperficie(pontos, folga = 2.2) {
  return pontos.map(([x, y, z]) => {
    const a = Math.atan2(z, x), r = raioExterno(y) + folga;
    return V(Math.cos(a) * r, y, Math.sin(a) * r);
  });
}

function coronarias() {
  const gs = [];
  const fio = (pontos, raio, segs = 30) => gs.push(new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(naSuperficie(pontos)), segs, raio, 8, false));

  /* descendente anterior: desce pelo sulco interventricular, na frente */
  fio([[4, 60, 16], [0, 48, 20], [-4, 34, 20], [-4, 18, 14], [-2, 7, 6]].map(noSulco), 2.2);
  /* circunflexa: contorna para a esquerda pelo sulco atrioventricular */
  fio([[4, 60, 16], [16, 58, 10], [22, 56, -6], [16, 54, -18]].map(noSulco), 2.0, 24);
  /* coronária direita: contorna para a direita e desce por trás */
  fio([[-2, 60, 16], [-16, 57, 10], [-22, 55, -6], [-16, 48, -18], [-6, 30, -20]].map(noSulco), 2.1);
  /* dois marginais, para não parecer um circuito de três fios */
  fio([[-4, 34, 20], [-14, 28, 12], [-18, 18, 6]].map(noSulco), 1.4, 14);
  fio([[20, 55, 2], [22, 42, 4], [16, 26, 5]].map(noSulco), 1.4, 14);
  return new THREE.Mesh(mergeGeometries(gs), M.coronaria);
}

/* ── O SISTEMA DE CONDUÇÃO ────────────────────────────────────────────────
   Cada peça é um objeto SEPARADO, porque cada uma acende na sua vez — é essa
   a vista elétrica que o pedido nomeia. Nó sinusal, átrios, nó AV, His,
   ramos, Purkinje. */
function conducao() {
  const g = new THREE.Group();
  const põe = (id, malha) => { malha.userData.conducao = id; g.add(malha); return malha; };

  const no = new THREE.Mesh(new THREE.SphereGeometry(4.4, 12, 9), M.conducao);
  no.position.set(-26, 74 + SUBIR_PLANO, -2); no.scale.set(1, 1.5, .7);
  põe('sinusal', no);

  /* as vias internodais: três fitas do sinusal ao AV */
  for (const dz of [-8, 0, 8]) {
    const t = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(
      [V(-26, 72 + SUBIR_PLANO, -2), V(-20, 66 + SUBIR_PLANO, dz * .6),
       V(-10, 60 + SUBIR_PLANO, dz * .4), V(-2, 56 + SUBIR_PLANO, 0)]), 16, 1.5, 6, false);
    põe('atrios', new THREE.Mesh(t, M.conducao));
  }

  const av = new THREE.Mesh(new THREE.SphereGeometry(3.8, 12, 9), M.conducao);
  av.position.set(-2, 55 + SUBIR_PLANO, -2); av.scale.set(1.3, .9, .8);
  põe('av', av);

  põe('his', new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(
    [V(-2, 54 + SUBIR_PLANO, -2), V(-1, 48, 0), V(0, 43, 1)]), 10, 2.0, 8, false), M.conducao));

  /* dois ramos, e o esquerdo se divide — é ele que dá o hemibloqueio */
  põe('ramos', new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(
    [V(0, 43, 1), V(6, 34, 3), V(10, 22, 4), V(8, 12, 3)]), 18, 1.5, 6, false), M.conducao));
  põe('ramos', new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(
    [V(0, 43, 1), V(-8, 33, 4), V(-13, 21, 5), V(-11, 11, 4)]), 18, 1.4, 6, false), M.conducao));

  /* Purkinje: a rede que espalha pela parede, e ela precisa parecer REDE */
  const fios = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, r0 = 9 + rnd(-2, 2);
    fios.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(
      [V(Math.cos(a) * r0 * .5, 12, Math.sin(a) * r0 * .5),
       V(Math.cos(a) * r0 * 1.4, 18 + rnd(-3, 6), Math.sin(a) * r0 * 1.4),
       V(Math.cos(a) * r0 * 2.1, 30 + rnd(-4, 10), Math.sin(a) * r0 * 2.0)]), 12, .9, 5, false));
  }
  põe('purkinje', new THREE.Mesh(mergeGeometries(fios), M.conducao));
  return g;
}

/* ── O SANGUE ─────────────────────────────────────────────────────────────
   A terceira leitura do pedido, e ela não podia ser uma animação à parte: as
   gotas andam pelo caminho que o sangue faz e SÓ ATRAVESSAM UMA VALVA QUANDO
   ELA ESTÁ ABERTA. É por isso que elas se acumulam no átrio durante a
   sístole, ficam paradas no ventrículo durante a contração isovolumétrica —
   quando as duas estão fechadas e não há para onde ir — e disparam quando a
   semilunar abre. Ninguém escreveu esse comportamento: ele cai das mesmas
   comparações de pressão que abrem as válvulas.

   Vermelho é oxigenado, azul é venoso: a convenção que o aluno já traz. */
const CAMINHOS = {
  direito: {
    pontos: [[-25, 16, -8], [-24, 38, -6], [-21, 52, -2], [-18, 56, 2],
             [-16, 53, 6], [-16, 40, 11], [-15, 22, 12], [-14, 40, 15],
             [-12, 56, 16], [-11, 74, 15], [-6, 96, 9], [10, 106, 2]]
      .map(noSulco),
    uAV: .33, uSL: .70, mat: 'sanguePobre',
  },
  esquerdo: {
    pontos: [[28, 64, -14], [20, 60, -9], [12, 58, -5], [8, 57, -3],
             [6, 54, -1], [4, 38, 0], [3, 20, 1], [4, 40, -2],
             [4, 58, -4], [5, 82, -2], [0, 112, 3], [-26, 112, 2]]
      .map(noSulco),
    uAV: .35, uSL: .70, mat: 'sangueRico',
  },
};

function gotasDeSangue(n = 26) {
  const g = new THREE.Group();
  const base = new THREE.SphereGeometry(2.6, 8, 6);
  for (const [lado, c] of Object.entries(CAMINHOS)) {
    const curva = new THREE.CatmullRomCurve3(c.pontos.map(p => V(...p)));
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(base, M[c.mat]);
      m.userData = { lado, u: i / n, curva, uAV: c.uAV, uSL: c.uSL,
                     desvio: V(rnd(-1.1, 1.1), 0, rnd(-1.1, 1.1)) };
      g.add(m);
    }
  }
  return g;
}

/* ── MONTAGEM ─────────────────────────────────────────────────────────────
   O coração pende inclinado, com a ponta para a esquerda e para a frente,
   que é como ele fica no tórax — de pé e simétrico ele vira enfeite. */
function vidrar(grupo, opacidade) {
  grupo.traverse(o => {
    if (!o.isMesh || !o.material) return;
    /* clone: o miocárdio / a aorta são materiais COMPARTILHADOS. Sem
       clone o vidro do nível 03 vaza para o coração inteiro. */
    o.material = o.material.clone();
    o.material.transparent = true;
    o.material.opacity = opacidade;
    o.material.depthWrite = opacidade >= .85;
    o.material.needsUpdate = true;
  });
}

function corpo({
  comValvas = true, comCoronarias = true, comConducao = false,
  corte = false, revelarValvas = false, vidrarGrandesVasos = false,
} = {}) {
  const g = new THREE.Group();

  /* O CORTE ABRE UMA CUNHA VOLTADA PARA A FRENTE — é por onde se olha. Antes
     eu passava um sinalizador `corte` que o corpo ignorava: o nível 02 dizia
     "por dentro" e mostrava o mesmo exterior dos outros. */
  /* a cunha fica simétrica em torno de 180 graus para que a ABERTURA caia
     em theta zero, que no LatheGeometry é o +Z — de frente para a câmera */
  const janela = corte ? [Math.PI * .306, Math.PI * 1.389] : null;
  const ve = ventriculoEsquerdo(janela); g.add(ve);
  const vd = ventriculoDireito(janela); g.add(vd);
  g.add(soldaSepto());

  const ae = atrio(1, janela); ae.position.set(14, 58 + SUBIR_PLANO, -6); ae.rotation.z = -.16; g.add(ae);
  const ad = atrio(-1, janela); ad.position.set(-20, 56 + SUBIR_PLANO, 0); ad.rotation.z = .18; ad.scale.setScalar(.94); g.add(ad);

  const vasos = grandesVasos();
  vasos.userData.papel = 'vasos';
  /* a origem dos vasos acompanha o plano valvar; o grupo inteiro sobe, e
     a relação cava/átrio e aorta/semilunar se mantém */
  vasos.position.y = SUBIR_PLANO;

  /* o nível das válvulas não pode ser o coração opaco visto de longe: o
     miocárdio vira vidro para as cúspides lerem por cima do corte. Aorta e
     tronco pulmonar também — opacos, sentam NA FRENTE das cúspides. */
  if (revelarValvas) {
    vidrar(ve, .38); vidrar(vd, .38);
    vidrar(ae, .32); vidrar(ad, .32);
  }
  if (vidrarGrandesVasos) vidrar(vasos, .34);

  const valvas = {};
  if (comValvas) {
    /* as quatro, cada uma no seu anel. A mitral tem duas cúspides, as
       semilunares têm três — e a tricúspide, três, que é de onde vem o nome. */
    const põe = (nome, v, pos, rot) => {
      v.position.set(...pos); if (rot) v.rotation.set(...rot);
      v.userData.nomeValva = nome;
      valvas[nome] = v; g.add(v);
    };
    põe('mitral', valva(2, 14, 11), PLANO_VALVAR.mitral, [Math.PI, 0, .12]);
    põe('tricuspide', valva(3, 15, 10), PLANO_VALVAR.tricuspide, [Math.PI, 0, -.16]);
    põe('aortica', valva(3, 11, 8), PLANO_VALVAR.aortica);
    põe('pulmonar', valva(3, 10, 7.5), PLANO_VALVAR.pulmonar);
    g.add(cordas(14, 46 + SUBIR_PLANO, 22 + SUBIR_PLANO, 10));
  }
  if (comCoronarias) g.add(coronarias());
  let cond = null;
  if (comConducao) { cond = conducao(); g.add(cond); }
  const sangue = gotasDeSangue(); g.add(sangue);
  g.add(vasos);

  /* a inclinação anatômica */
  g.rotation.set(.16, 0, .30);
  g.position.y = -46;
  g.userData = { ve, vd, ae, ad, valvas, vasos, conducao: cond, sangue };
  return g;
}

/* Aplica um quadro do motor numa árvore — inclusive num clone de RA, cujos
   `userData.ve` / `userData.valvas` ainda apontam para as malhas VIVAS.
   Por isso as peças se identificam por `papel`, `papelParede` e `nomeValva`
   na própria árvore, e as geometrias do clone já têm de estar descoladas. */
export function aplicarQuadro(raiz, q) {
  const vol = { ve: [q.vVE, 120], vd: [q.vVD, 120], ae: [q.vAE, 60], ad: [q.vAD, 60] };
  raiz.traverse(o => {
    const par = o.userData?.papel;
    if (par && vol[par]) {
      const [volume, referencia] = vol[par];
      escalarCamara(o, volume, referencia);
    }
    const nome = o.userData?.nomeValva;
    if (!nome || q[nome] === undefined) return;
    const alvo = q[nome] ? 1 : .06;
    o.userData.abertura = alvo;
    for (const c of o.children) if (c.geometry?.userData?.nu) moldarCuspide(c, alvo);
  });
}

/* ========================================================================= */
export function criar() {
  /* a receita de cada nível vem de `niveis.js`: o nome e o que a cena
     constrói ficam na mesma tabela, e o teste lê essa tabela — não um
     comentário ao lado de um `corpo()` que já mentiu uma vez. */
  const modelos = NIVEIS.map(n => corpo({
    comValvas: n.comValvas,
    comCoronarias: n.comCoronarias,
    comConducao: n.comConducao,
    corte: n.corte,
    revelarValvas: n.revelarValvas,
    vidrarGrandesVasos: n.vidrarGrandesVasos,
  }));
  modelos.forEach((m, i) => { m.visible = i === 0; });

  /* ── O VOLUME MOVE A CÂMARA ────────────────────────────────────────────
     Contrair é a CAVIDADE encolher, não a peça inteira. O volume vai com o
     cubo do raio, então a escala é a raiz cúbica — ignorar isso faria a
     sístole parecer branda. A parede externa encolhe menos que a interna, e
     é por isso que ela ENGROSSA ao contrair, que é o que se vê no eco. */
  function aplicarVolumes(vVE, vVD, vAE, vAD) {
    for (const m of modelos) {
      const d = m.userData;
      const põe = (grupo, volume, referencia) => {
        if (!grupo) return;
        escalarCamara(grupo, volume, referencia);
      };
      põe(d.ve, vVE, 120); põe(d.vd, vVD, 120);
      põe(d.ae, vAE, 60); põe(d.ad, vAD, 60);
    }
  }

  /* as quatro válvulas, cada uma com a sua abertura vinda das pressões */
  function aplicarValvas(estado) {
    for (const m of modelos) {
      const vs = m.userData.valvas;
      if (!vs) continue;
      for (const [nome, aberta] of Object.entries(estado)) {
        const v = vs[nome];
        if (!v) continue;
        const alvo = aberta ? 1 : .06;
        v.userData.abertura = (v.userData.abertura ?? alvo) * .72 + alvo * .28;
        for (const c of v.children) if (c.geometry.userData.nu) moldarCuspide(c, v.userData.abertura);
      }
    }
  }

  /* a condução acende: quem está despolarizado fica emissivo */
  function aplicarConducao(ativos) {
    for (const m of modelos) {
      const c = m.userData.conducao;
      if (!c) continue;
      for (const peça of c.children) {
        const on = ativos.includes(peça.userData.conducao);
        if (!peça.material.__clonado) { peça.material = peça.material.clone(); peça.material.__clonado = true; }
        peça.material.emissiveIntensity = on ? 3.2 : .35;
        peça.material.emissive.copy(on ? ACESA : cor(60, 52, 12));
      }
    }
  }

  /* Move as gotas. `fluxos` traz a vazão de cada valva e se ela está aberta —
     tudo vindo do motor, no mesmo instante que move o resto. */
  function aplicarSangue(fluxos, dt) {
    for (const m of modelos) {
      const s = m.userData.sangue;
      if (!s) continue;
      for (const gota of s.children) {
        const d = gota.userData;
        const esq = d.lado === 'esquerdo';
        const entrada = esq ? fluxos.mitral : fluxos.tricuspide;
        const saida = esq ? fluxos.aortica : fluxos.pulmonar;
        /* a velocidade é a vazão do trecho em que a gota está */
        if (!entrada || !saida || typeof d.curva?.getPoint !== 'function') continue;
        const vazao = Number(d.u < d.uAV ? entrada.q : saida.q) || 0;
        let novo = d.u + vazao * dt * 0.0016 + dt * .012;
        /* AS PORTEIRAS: a gota não passa por uma valva fechada */
        if (d.u < d.uAV && novo >= d.uAV && !entrada.aberta) novo = d.uAV - 1e-4;
        if (d.u < d.uSL && novo >= d.uSL && !saida.aberta) novo = d.uSL - 1e-4;
        if (!Number.isFinite(novo)) continue;
        d.u = novo >= 1 ? 0 : novo < 0 ? 0 : novo;
        const p = d.curva.getPoint(d.u);
        gota.position.set(p.x + d.desvio.x, p.y, p.z + d.desvio.z);
      }
    }
  }

  return { modelos, aplicarVolumes, aplicarValvas, aplicarConducao, aplicarSangue };
}
