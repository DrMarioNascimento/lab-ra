/* ============================================================================
   TESTE 08 — RETORNO VENOSO E ORTOSTATISMO (Unidade IV)
   Geometria e materiais. Nada de DOM aqui.

   O QUE ESTA BANCADA EXISTE PARA DESFAZER: o aluno decora "a válvula impede o
   refluxo" e imagina que ela segura a coluna inteira. Não segura — nenhuma
   segura. Cada válvula sustenta SÓ O SEGMENTO ATÉ A DE CIMA, e é a soma dos
   segmentos que divide os 90 mmHg do tornozelo em degraus de poucos
   centímetros. Por isso o nível 03 mostra a coluna partida em degraus, e não
   uma tampa no pé.

   A REGRA DA CASA, herdada das bancadas 06 e 07 e válida aqui inteira:
   • face invertida mora na GEOMETRIA, nunca em `side: THREE.BackSide` — o
     glTF descarta o material, e o USDZ do iPhone descarta até o `doubleSided`
     (ver `../cores-para-ra.js`, que conserta o que der na exportação);
   • nada de `clearcoat` em tecido vivo: o brilho de verniz é o "efeito
     pílula", e o que dá vida é `sheen`;
   • cor é informação, não enfeite. Aqui a escala é de PRESSÃO, e ela vai do
     azul frio (coluna baixa, veia vazia) ao vermelho-escuro congesto (coluna
     alta, veia distendida). Sangue venoso é escuro nos dois extremos: o que
     muda é o quanto ele empoça.
   ========================================================================== */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ── A ESCALA DO CORPO ─────────────────────────────────────────────────────
   Uma unidade de mundo = 10 cm de gente. O corpo tem 17,0 (1,70 m) e as
   alturas anatômicas abaixo saem daí. Manter isto explícito é o que permite
   à física usar centímetros de verdade sem número mágico nenhum. */
export const CM = 0.02;                // 1 cm em unidades de mundo (corpo = 3,4)
export const CORPO = {
  altura: 170 * CM,
  /* alturas a partir do CHÃO, em cm, de quem está em pé */
  solo: 0, tornozelo: 12, joelho: 48, coxa: 75, quadril: 92,
  diafragma: 118, coracao: 128, ombro: 142, olhos: 160,
};
/* O PONTO INDIFERENTE HIDROSTÁTICO fica na altura do diafragma: é a altura em
   que a pressão venosa não muda ao levantar ou deitar. Toda a conta de coluna
   é medida a partir DELE, não do coração — usar o coração erra o sinal acima
   do diafragma e some com o fato de a jugular colabar em pé. */
export const PIH = CORPO.diafragma;

/* 1 cm de sangue = 0,78 mmHg. Vem de rho*g*h: 1060 kg/m3 x 9,81 x 0,01 m
   / 133,3 Pa por mmHg. Chumbar "90 mmHg no tornozelo" seria número mágico;
   assim o valor CAI da altura, e mudar o corpo muda a pressão sozinho. */
export const MMHG_POR_CM = 1060 * 9.81 * 0.01 / 133.3;

/* pressão venosa local, em mmHg, para uma altura e uma inclinação */
export function pressaoVenosa(alturaCm, grau, { base = 10 } = {}) {
  const sen = Math.sin(grau * Math.PI / 180);
  return base + (PIH - alturaCm) * MMHG_POR_CM * sen;
}

/* ── MATERIAIS ─────────────────────────────────────────────────────────── */
const phys = o => new THREE.MeshPhysicalMaterial(o);

export const M = {
  /* o corpo é silhueta, não anatomia: translúcido e dessaturado para que a
     árvore venosa seja a única coisa que o olho persegue */
  pele: phys({ color: 0xd9b8a4, roughness: .78, sheen: .8, sheenRoughness: .7,
               sheenColor: new THREE.Color(0xffd9c4), transparent: true, opacity: .11,
               depthWrite: false }),
  osso: phys({ color: 0xe8dfcc, roughness: .62, sheen: .35 }),
  /* o brilho tem de ser POUCO e FRIO: branco e forte, ele apagava a cor por
     vertice e a veia em repouso saia branca */
  veia: phys({ color: 0xffffff, roughness: .46, sheen: .22,
               sheenColor: new THREE.Color(0x5f86c8), vertexColors: true }),
  /* nos cortes o vaso é parede, não fluido: cor própria e sem cor por
     vértice, senão a pressão pintaria o cano e não o sangue */
  /* PAREDE TRANSLUCIDA, e nao meia parede cortada. A primeira versao cortava
     o vaso ao meio para se ver dentro, e a foto mostrou por que nao serve: a
     abertura fica virada para um lado so, e de qualquer outro angulo as
     cuspides aparecem de perfil, POR FORA. Translucida, ve-se dentro de todo
     angulo e a peca continua sendo um tubo fechado, que e o que ela e. */
  veia2: phys({ color: 0x8a7a90, roughness: .55, sheen: .45,
                sheenColor: new THREE.Color(0xc9b6d6),
                transparent: true, opacity: .26, depthWrite: false }),
  valvula: phys({ color: 0xf0e6dc, roughness: .44, sheen: .7,
                  sheenColor: new THREE.Color(0xffffff) }),
  coracao: phys({ color: 0x9e2f36, roughness: .55, sheen: .9,
                  sheenColor: new THREE.Color(0xff9a8a), emissive: 0x2a0a0c,
                  emissiveIntensity: .5 }),
  musculo: phys({ color: 0xa33a3a, roughness: .66, sheen: .85,
                  sheenColor: new THREE.Color(0xff8f7a) }),
};

/* ── A COR DA PRESSÃO ──────────────────────────────────────────────────────
   Azul frio a 0 mmHg, vinho congesto a 100. AS DUAS PONTAS TIVERAM DE
   ESCURECER E SATURAR: na primeira foto a veia em repouso saia PALIDA, quase
   branca — o material era branco com brilho por cima, e o tom mapeado pelo
   ACES lavava o pigmento. Cor que nao se le nao informa nada. A escala satura em 100 e não no
   máximo possível: acima disso o olho já não distingue, e a faixa que importa
   (10 a 90) usaria só metade da rampa. Mesma lição da onda da bancada 07, que
   satura em 50 mV e não em 92. */
const FRIO = [38, 92, 196], QUENTE = [162, 22, 34];
export function corDaPressao(mmHg) {
  const t = clamp(mmHg / 100, 0, 1);
  /* raiz para abrir a metade baixa: entre 10 e 40 mmHg está a diferença
     entre a perna descansada e a perna parada em pé, e ela tem de aparecer */
  const u = Math.sqrt(t);
  /* AS FRACOES ACIMA SAO sRGB, E O THREE.Color LE LINEAR POR PADRAO. Entregar
     as duas coisas trocadas CLAREIA tudo: corDaPressao(10) devolvia #968fc6,
     lavanda palido, no lugar de #265cc4. Foi por isso que a veia em repouso
     saia branca na foto, e nao por causa do brilho do material. Mesma
     armadilha que a paleta da bancada 07 ja tinha ensinado. */
  return new THREE.Color().setRGB(
    (FRIO[0] + (QUENTE[0] - FRIO[0]) * u) / 255,
    (FRIO[1] + (QUENTE[1] - FRIO[1]) * u) / 255,
    (FRIO[2] + (QUENTE[2] - FRIO[2]) * u) / 255,
    THREE.SRGBColorSpace);
}

/* pinta uma geometria inteira de uma cor só, no atributo de cor */
function tintar(geo, cor) {
  const n = geo.attributes.position.count, arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { arr[i * 3] = cor.r; arr[i * 3 + 1] = cor.g; arr[i * 3 + 2] = cor.b; }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}

/* ── AS VEIAS ──────────────────────────────────────────────────────────────
   Cada veia é um tubo varrido, e guarda no userData a ALTURA de cada anel
   para que a física possa engrossar e repintar anel por anel. Um tubo de raio
   fixo não serviria: distensão é justamente a coisa que muda ao longo da
   coluna, e é ela que mostra onde o sangue empoça. */
const SEGS_U = 26, SEGS_V = 9;

function veia(pontos, raioBase) {
  const curva = new THREE.CatmullRomCurve3(pontos);
  const geo = new THREE.TubeGeometry(curva, SEGS_U, 1, SEGS_V, false);
  const pos = geo.attributes.position;
  const centros = [], alturas = [];
  for (let s = 0; s <= SEGS_U; s++) {
    const p = curva.getPoint(s / SEGS_U);
    centros.push(p); alturas.push(p.y / CM);            // altura em cm
  }
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pos.count * 3), 3));
  geo.userData = { centros, alturas, raioBase, segsU: SEGS_U, segsV: SEGS_V };
  /* nasce no calibre de repouso; `aplicarPostura` refaz a cada quadro */
  return geo;
}

/* ── A LEI DA DISTENSÃO, E POR QUE ELA É UMA SÓ ────────────────────────────
   A veia é um saco complacente, não um cano: dobrar a pressão não dobra o
   raio. Ela sai de achatada, vira circular e então a parede endurece — muito
   volume por pouca pressão no começo, quase nada depois.

   O EXPOENTE FOI CALIBRADO CONTRA O LIVRO, não escolhido pelo desenho. Com
   raiz cúbica a perna engordava 2,9x em área e o modelo previa 1.140 ml
   empoçados nas duas pernas — o dobro do que se mede. Com raiz quarta e teto
   em 1,45 a área dobra e a previsão cai para ~600 ml, dentro da faixa de 300
   a 800 que a literatura relata ao levantar.

   E A LEI É A MESMA PARA O DESENHO E PARA A CONTA. Seria fácil engrossar mais
   a veia "para aparecer" e calcular o volume por outra régua — e seria
   exatamente a mentira que esta bancada existe para não contar. Quem faz a
   distensão aparecer é a COR, que tem rampa própria. */
export function fatorDeDistensao(mmHg, teto = 1.45) {
  return clamp(Math.pow(clamp(mmHg, 1, 120) / 12, .25), .80, teto);
}

function moldarVeia(malha, grau, opc = {}) {
  const g = malha.geometry, u = g.userData;
  const pos = g.attributes.position, cor = g.attributes.color;
  const base = opc.base ?? 10, teto = opc.teto ?? 1.45;
  for (let s = 0; s <= u.segsU; s++) {
    const p = pressaoVenosa(u.alturas[s], grau, { base });
    const f = fatorDeDistensao(p, teto);
    const c = corDaPressao(p);
    const ct = u.centros[s], r = u.raioBase * f;
    for (let k = 0; k <= u.segsV; k++) {
      const i = s * (u.segsV + 1) + k;
      /* o anel original tem raio 1 em torno do centro: escalar o vetor
         radial mantém a torção do tubo e evita recalcular o quadro móvel */
      const dx = pos.getX(i) - ct.x, dy = pos.getY(i) - ct.y, dz = pos.getZ(i) - ct.z;
      const d = Math.hypot(dx, dy, dz) || 1;
      pos.setXYZ(i, ct.x + dx / d * r, ct.y + dy / d * r, ct.z + dz / d * r);
      cor.setXYZ(i, c.r, c.g, c.b);
    }
  }
  pos.needsUpdate = true; cor.needsUpdate = true;
  g.computeVertexNormals();
}

/* ── O CORPO, EM SILHUETA ──────────────────────────────────────────────────
   Não é anatomia: é o suporte que dá ALTURA à coluna. Feito de revoluções
   suaves para não virar boneco de peças coladas — a queixa de sempre. */
/* Um solido de revolucao so NAO da gente: da vaso. A primeira versao era
   exatamente isso — um perfil girado, com a cabeca virando bojo e nenhuma
   perna. E aqui a leitura de PERNA e o assunto: e nela que o sangue empoca.
   Agora sao pecas com eixo proprio — duas pernas, tronco, pescoco, cabeca e
   dois bracos — fundidas numa malha so. */
function tubo(x, z, h0, h1, r0, r1, achataZ = 1) {
  const g = new THREE.CylinderGeometry(r1 * CM, r0 * CM, (h1 - h0) * CM, 20, 1, false);
  g.scale(1, 1, achataZ);
  g.translate(x * CM, (h0 + h1) / 2 * CM, z * CM);
  return g;
}

function corpoSilhueta() {
  const partes = [];
  for (const lado of [-1, 1]) {
    /* perna: tornozelo, panturrilha, joelho, coxa — quatro trechos, porque
       uma perna de calibre unico vira pau de vassoura */
    partes.push(tubo(lado * 8, 0, 0, 12, 5.0, 5.4, .9));
    partes.push(tubo(lado * 8, 0, 12, 34, 5.4, 8.0, .9));
    partes.push(tubo(lado * 8.4, 0, 34, 48, 8.0, 6.6, .9));
    partes.push(tubo(lado * 8.8, 0, 48, 92, 6.6, 10.5, .92));
    partes.push(tubo(lado * 17.5, 0, 112, 142, 4.0, 5.6, 1));   // braco
  }
  partes.push(tubo(0, 0, 88, 118, 15.5, 14.0, .66));      // abdome
  partes.push(tubo(0, 0, 118, 143, 14.5, 16.5, .60));     // torax
  partes.push(tubo(0, 0, 143, 151, 5.2, 5.6, 1));         // pescoco
  const cabeca = new THREE.SphereGeometry(9 * CM, 22, 16);
  cabeca.scale(.86, 1.1, .92); cabeca.translate(0, 160 * CM, 0);
  partes.push(cabeca);
  return new THREE.Mesh(mergeGeometries(partes), M.pele);
}

/* ── NÍVEL 01 — O CORPO E A COLUNA ────────────────────────────────────────
   A árvore venosa inteira, do tornozelo ao coração, com a pressão de cada
   altura escrita na própria espessura e na própria cor. */
/* ── O CORPO DE VERDADE ──────────────────────────────────────────────────
   A silhueta de revolução saía vaso. corpo.glb é um corpo, e os vasos nascem
   dos centróides dele — o desenho que se lê no visor, com a coluna de pressão
   por cima. A silhueta fica de reserva: se o arquivo não vier, a bancada
   ainda abre. */
function peleRaioX() {
  return new THREE.ShaderMaterial({
    name: 'pele_raio_x',
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    uniforms: {
      uColor: { value: new THREE.Color(0xa9dcff) },
      uCore: { value: new THREE.Color(0x2a5a7c) },
      uPower: { value: 2.0 },
      uIntensity: { value: 1.15 },
    },
    vertexShader: `
      varying vec3 vN; varying vec3 vV;
      void main(){
        vN = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor; uniform vec3 uCore; uniform float uPower; uniform float uIntensity;
      varying vec3 vN; varying vec3 vV;
      void main(){
        float d = abs(dot(normalize(vN), normalize(vV)));
        float f = pow(1.0 - d, uPower);
        vec3 c = uCore * 0.45 + uColor * f * uIntensity;
        gl_FragColor = vec4(c, 0.9);
      }`,
  });
}

function geometriaDoGlb(buf) {
  const dv = new DataView(buf);
  const jl = dv.getUint32(12, true);
  const json = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 20, jl)));
  const binOff = 20 + jl + 8;
  const acc = k => {
    const a = json.accessors[k], bv = json.bufferViews[a.bufferView];
    const off = binOff + (bv.byteOffset || 0) + (a.byteOffset || 0);
    const n = a.count * ({ SCALAR: 1, VEC3: 3 }[a.type]);
    if (a.componentType === 5126) return new Float32Array(buf, off, n);
    if (a.componentType === 5125) return new Uint32Array(buf, off, n);
    return new Uint16Array(buf, off, n);
  };
  const prim = json.meshes[0].primitives[0];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(acc(prim.attributes.POSITION).slice(), 3));
  if (prim.indices !== undefined) geo.setIndex(new THREE.BufferAttribute(acc(prim.indices).slice(), 1));
  geo.computeVertexNormals();
  return geo;
}

/* Pé no chão, eixo no meio, altura da bancada (1,70 m em unidades de mundo).
   Os limiares do visor estão em metros de malha crua; S leva-os para cá. */
async function carregarCorpo() {
  const buf = await (await fetch(new URL('./corpo.glb', import.meta.url))).arrayBuffer();
  const geo = geometriaDoGlb(buf);
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const k = CORPO.altura / (bb.max.y - bb.min.y);
  geo.translate(-(bb.max.x + bb.min.x) / 2, -bb.min.y, -(bb.max.z + bb.min.z) / 2);
  geo.scale(k, k, k);
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  return geo;
}

function centrar(P, y0, y1, f) {
  let sx = 0, sy = 0, sz = 0, n = 0;
  for (let k = 0; k < P.length; k += 3) {
    const x = P[k], y = P[k + 1], z = P[k + 2];
    if (y < y0 || y > y1 || !f(x, y, z)) continue;
    sx += x; sy += y; sz += z; n++;
  }
  return n ? V(sx / n, sy / n, sz / n) : null;
}
function centroid(P, y0, y1, f) {
  for (let w = 0; w < 0.6; w += 0.06) {
    const c = centrar(P, y0 - w, y1 + w, f);
    if (c) return c;
  }
  return null;
}

function texturaBolha() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d');
  const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,0.95)');
  gr.addColorStop(0.18, 'rgba(255,255,255,0.45)');
  gr.addColorStop(0.55, 'rgba(255,255,255,0.3)');
  gr.addColorStop(0.82, 'rgba(255,255,255,0.9)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function texturaFaisca() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d');
  const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.3, 'rgba(255,230,230,0.6)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/* Nível 01 com a malha. A veia continua tubo moldável: a pressão pinta e
   engrossa, como antes. Artéria é caminho, não coluna. */
function nivelCorpoMalha(bodyGeo) {
  const g = new THREE.Group();
  const geo = bodyGeo.clone();
  const pele = new THREE.Mesh(geo, peleRaioX());
  pele.name = 'corpo_translucido';
  pele.renderOrder = 5;
  pele.userData.semSombra = true;
  g.add(pele);
  /* prepass opaco, desenhado DEPOIS dos vasos: segura o fundo da casca sem
     apagar o que já foi pintado dentro. Não vai para a RA. */
  const prepass = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true }));
  prepass.name = 'prepass';
  prepass.renderOrder = 4;
  prepass.userData.foraDoQuadro = true;
  prepass.userData.naoExportar = true;
  prepass.userData.semSombra = true;
  g.add(prepass);

  const S = CORPO.altura / 1.75;
  const P = geo.attributes.position.array;
  const torsoF = x => Math.abs(x) < 0.16 * S;
  const legF = s => (x, y) => y < 0.86 * S && x * s > 0.005 * S && Math.abs(x) < 0.3 * S;
  const neckF = x => Math.abs(x) < 0.09 * S;
  const footF = s => (x, y, z) => x * s > 0.005 * S && Math.abs(x) < 0.3 * S && z > 0.02 * S;
  const route = (ys, f, dx = 0, dz = 0) => ys
    .map(y => centroid(P, y - 0.03 * S, y + 0.03 * S, f))
    .filter(Boolean)
    .map(p => p.clone().add(V(dx, 0, dz)));
  const footPt = (s, dx, dy) => {
    const c = centroid(P, 0, 0.05 * S, footF(s));
    return c ? c.clone().add(V(dx, dy, 0)) : null;
  };
  const anklePt = (s, dx, dz) => {
    const c = centroid(P, 0.05 * S, 0.09 * S, legF(s));
    return c ? c.clone().add(V(dx, 0, dz)) : null;
  };
  const legY = [0.1, 0.16, 0.26, 0.36, 0.46, 0.56, 0.66, 0.76, 0.84].map(y => y * S);
  const torsoY = [0.9, 0.98, 1.06, 1.14, 1.22, 1.3].map(y => y * S);
  const neckY = [1.46, 1.5, 1.53].map(y => y * S);
  const heartC = (centroid(P, 1.24 * S, 1.36 * S, torsoF) || V(0, CORPO.coracao * CM, 0)).add(V(-0.03 * S, 0, 0.03 * S));
  const bif = centroid(P, 0.84 * S, 0.92 * S, torsoF) || V(0, CORPO.quadril * CM, 0);

  const heart = new THREE.Mesh(new THREE.SphereGeometry(0.055 * S, 32, 24), M.coracao.clone());
  heart.name = 'coracao';
  heart.position.copy(heartC);
  heart.scale.set(0.95, 1.15, 0.85);
  heart.rotation.z = 0.35;
  g.add(heart);

  const artMat = new THREE.MeshStandardMaterial({
    name: 'arteria', color: 0xc81e1e, emissive: 0x5a0a0a, roughness: 0.35, metalness: 0.05,
  });
  const arteries = [
    { n: 'aorta', r: 0.013 * S, p: [heartC.clone(), heartC.clone().add(V(0.03 * S, 0.08 * S, -0.02 * S)), ...route(torsoY.slice().reverse(), torsoF, -0.022 * S, -0.035 * S), bif.clone().add(V(-0.012 * S, 0, -0.025 * S))] },
  ];
  const veinDefs = [
    { n: 'veia_cava_inferior', papel: 'cava', r: 0.016 * S, p: [bif.clone().add(V(0.022 * S, 0, 0.012 * S)), ...route(torsoY, torsoF, 0.03 * S, 0.012 * S), heartC.clone().add(V(0.03 * S, 0.02 * S, 0.02 * S))] },
  ];
  for (const s of [-1, 1]) {
    const L = s < 0 ? 'dir' : 'esq';
    arteries.push({ n: 'femoral_' + L, r: 0.008 * S, p: [bif.clone().add(V(0, 0, -0.02 * S)), ...route(legY.slice().reverse(), legF(s), s * 0.012 * S, 0.012 * S), anklePt(s, s * 0.006 * S, 0.016 * S), footPt(s, s * 0.004 * S, 0.012 * S)] });
    veinDefs.push({ n: 'femoral_safena_' + L, papel: 'perna', r: 0.009 * S, p: [footPt(s, s * 0.016 * S, 0.012 * S), anklePt(s, s * 0.024 * S, -0.002 * S), ...route(legY, legF(s), s * 0.03 * S, -0.004 * S), bif.clone().add(V(0.02 * S, 0, 0.01 * S))] });
    veinDefs.push({ n: 'jugular_' + L, papel: 'jugular', r: 0.007 * S, p: [...route(neckY.slice().reverse(), neckF, s * 0.035 * S, -0.012 * S), heartC.clone().add(V(0.03 * S, 0.02 * S, 0.02 * S))] });
  }

  const fluxo = [];
  const veias = [];
  const aneis = [];
  const valveMat = new THREE.MeshStandardMaterial({
    name: 'valvula_venosa', color: 0xbfd4ff, emissive: 0x6f8fff, emissiveIntensity: 0.9, roughness: 0.3,
  });
  for (const d of arteries) {
    const pts = d.p.filter(pt => pt && isFinite(pt.x));
    if (pts.length < 2) continue;
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, d.r, 10, false), artMat);
    mesh.name = d.n;
    g.add(mesh);
    fluxo.push({ curve, r: d.r, kind: 'a', len: curve.getLength(), name: d.n });
  }
  for (const d of veinDefs) {
    const pts = d.p.filter(pt => pt && isFinite(pt.x));
    if (pts.length < 2) continue;
    const mesh = new THREE.Mesh(veia(pts, d.r), M.veia);
    mesh.name = d.n;
    mesh.userData.papel = d.papel;
    veias.push(mesh);
    g.add(mesh);
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
    fluxo.push({ curve, r: d.r, kind: 'v', len: curve.getLength(), name: d.n });
    if (!d.n.startsWith('femoral_safena')) continue;
    const n = Math.max(4, Math.floor(curve.getLength() / (0.09 * S)));
    for (let k = 1; k <= n; k++) {
      const t = k / (n + 1);
      const pt = curve.getPointAt(t), tg = curve.getTangentAt(t);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(d.r * 1.25, d.r * 0.28, 8, 18), valveMat.clone());
      ring.name = 'valvula_' + d.n + '_' + k;
      ring.position.copy(pt);
      ring.quaternion.setFromUnitVectors(V(0, 0, 1), tg);
      ring.userData.altura = pt.y / CM;
      g.add(ring);
      aneis.push(ring);
    }
  }

  const bolha = texturaBolha(), faisca = texturaFaisca();
  const particulas = [];
  const tmp0 = new THREE.Vector3();
  const camada = (name, size, tex, color, density, speedMul, opacity, kind) => {
    const data = [];
    for (const path of fluxo) {
      if (path.kind !== kind) continue;
      const n = Math.max(8, Math.round(path.len / S * density));
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * path.r * 0.75;
        data.push({ path, t: Math.random(), off: [Math.cos(a) * rr, Math.sin(a) * rr], speed: (0.05 + Math.random() * 0.05) * speedMul / path.len, wob: Math.random() * Math.PI * 2 });
      }
    }
    if (!data.length) return;
    const pos = new Float32Array(data.length * 3);
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      name, size, map: tex, color, transparent: true, opacity,
      depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    data.forEach((d, i) => {
      d.path.curve.getPointAt(d.t, tmp0);
      pos[i * 3] = tmp0.x; pos[i * 3 + 1] = tmp0.y; pos[i * 3 + 2] = tmp0.z;
    });
    const pts = new THREE.Points(pg, mat);
    pts.name = name;
    pts.renderOrder = 8;
    pts.frustumCulled = false;
    pts.userData.foraDoQuadro = true;
    pts.userData.naoExportar = true;
    g.add(pts);
    particulas.push({ pts, pos, data });
  };
  camada('sangue_arterial_bolhas', 0.022 * S, bolha, 0xff4040, 90, 1, 0.7, 'a');
  camada('sangue_arterial_gas', 0.008 * S, faisca, 0xffb0a0, 120, 1.8, 0.6, 'a');
  camada('sangue_venoso_bolhas', 0.022 * S, bolha, 0x6a5cff, 90, 0.8, 0.55, 'v');
  camada('sangue_venoso_gas', 0.008 * S, faisca, 0xa8b4ff, 120, 1.4, 0.5, 'v');

  g.userData.veias = veias;
  g.userData.aneis = aneis;
  g.userData.particulas = particulas;
  g.userData.coracao = heart;
  g.position.y = -PIH * CM;
  return g;
}

function nivelCorpoSilhueta() {

  const g = new THREE.Group();
  g.add(corpoSilhueta());

  const veias = [];
  /* perna direita e esquerda: tibial -> poplítea -> femoral -> ilíaca */
  for (const lado of [-1, 1]) {
    const x = lado * 4.2 * CM;
    const pontos = [
      V(x * 1.15, CORPO.tornozelo * CM, .8 * CM),
      V(x * 1.1, 26 * CM, .5 * CM),
      V(x * 1.0, CORPO.joelho * CM, -.2 * CM),
      V(x * .95, 62 * CM, 0),
      V(x * .9, CORPO.coxa * CM, .4 * CM),
      V(x * .55, CORPO.quadril * CM, .6 * CM),
    ];
    const m = new THREE.Mesh(veia(pontos, 2.2 * CM), M.veia);
    m.userData.papel = 'perna';
    veias.push(m); g.add(m);
  }
  /* cava inferior: do cruzamento das ilíacas ao átrio direito */
  const cava = new THREE.Mesh(veia([
    V(0, CORPO.quadril * CM, .6 * CM),
    V(.6 * CM, 102 * CM, .5 * CM),
    V(1.0 * CM, PIH * CM, .2 * CM),
    V(1.2 * CM, CORPO.coracao * CM, 0),
  ], 3.0 * CM), M.veia);
  cava.userData.papel = 'cava';
  veias.push(cava); g.add(cava);

  /* jugular: a veia que DENUNCIA o sinal trocado acima do diafragma —
     em pé ela colaba, deitada ela ingurgita, e é o exame de cabeceira */
  const jugular = new THREE.Mesh(veia([
    V(2.6 * CM, CORPO.ombro * CM, 3.0 * CM),
    V(2.8 * CM, 150 * CM, 3.2 * CM),
    V(2.9 * CM, CORPO.olhos * CM, 2.6 * CM),
  ], 1.5 * CM), M.veia);
  jugular.userData.papel = 'jugular';
  veias.push(jugular); g.add(jugular);

  /* o coração, só como âncora do desenho */
  const cor = new THREE.Mesh(new THREE.SphereGeometry(3.4 * CM, 22, 16), M.coracao);
  cor.geometry.scale(1, 1.18, .8);
  cor.position.set(1.0 * CM, CORPO.coracao * CM, .6 * CM);
  g.add(cor);

  g.userData.veias = veias;
  /* A GEOMETRIA FICA EM ALTURA ABSOLUTA — `veia()` guarda `p.y / CM` como
     altura em cm, e a física depende disso. Quem desce o corpo é o GRUPO, e
     ele desce até o ponto indiferente hidrostático: é em torno dele que o
     corpo tem de girar, porque é a única altura cuja pressão não muda entre
     deitar e levantar. Girar em torno do pé ou do coração faria a peça
     escorregar no quadro e mentiria sobre a física. */
  g.position.y = -PIH * CM;
  return g;
}

/* ── A VÁLVULA ─────────────────────────────────────────────────────────────
   Duas cúspides — a válvula venosa é BICÚSPIDE, e isso não é detalhe: são
   duas bolsas que se encostam pelas bordas livres. Cada cúspide é uma
   superfície paramétrica: presa à parede na base, solta na borda de cima. O
   que abre e fecha é o RAIO DA BORDA LIVRE, e é ele que `moldarValvula` move.

   Por que não uma tampa: tampa é o modelo errado que esta bancada existe para
   desfazer. A válvula não veda um cano — ela se enche por trás e encosta as
   bordas, e por isso segura coluna, não vazão. */
const NU = 10, NV = 14;

function cuspide(R, comp, tetaInicio) {
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array((NU + 1) * (NV + 1) * 3);
  const idx = [];
  for (let i = 0; i <= NU; i++) for (let j = 0; j <= NV; j++) {
    const n = (i * (NV + 1) + j);
    pos[n * 3] = pos[n * 3 + 1] = pos[n * 3 + 2] = 0;
    if (i < NU && j < NV) {
      const a = i * (NV + 1) + j, b = a + 1, c = a + NV + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.userData = { R, comp, tetaInicio, nu: NU, nv: NV };
  return g;
}

/* `abertura` 1 = escancarada contra a parede, 0 = bordas encostadas */
function moldarCuspide(malha, abertura) {
  const g = malha.geometry, u = g.userData, pos = g.attributes.position;
  const rLivre = u.R * (0.06 + 0.86 * abertura);
  for (let i = 0; i <= u.nu; i++) {
    const s = i / u.nu;
    /* perfil em S: sai da parede devagar e chega à borda livre depressa,
       que é o formato de bolsa e não de funil */
    const t = s * s * (3 - 2 * s);
    const r = u.R * (1 - t) + rLivre * t;
    /* a bolsa incha para trás quando fechada: é o sangue retido nela */
    const bojo = (1 - abertura) * 0.22 * Math.sin(Math.PI * s);
    for (let j = 0; j <= u.nv; j++) {
      const teta = u.tetaInicio + (j / u.nv) * Math.PI;
      const n = i * (u.nv + 1) + j;
      /* o seno em teta afasta o meio da cúspide e mantém as pontas na
         parede: sem isso a cúspide descola do vaso nas bordas */
      const rr = r + u.R * bojo * Math.sin((j / u.nv) * Math.PI);
      pos.setXYZ(n, Math.cos(teta) * rr, s * u.comp, Math.sin(teta) * rr);
    }
  }
  pos.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere();
}

/* parede de vaso: tubo inteiro, translucido */
function parede(R, comp, mat) {
  const g = new THREE.CylinderGeometry(R, R, comp, 30, 1, true);
  g.translate(0, comp / 2, 0);
  const m = new THREE.Mesh(g, mat);
  m.userData.paredeR = R;
  m.renderOrder = 2;                    // desenha depois das cuspides
  return m;
}

/* ── NÍVEL 02 — A PERNA QUE ENCHE ─────────────────────────────────────────
   O mesmo tubo do nível 01, agora sozinho e grande. O que se lê aqui é
   VOLUME: quanto sangue sai da circulação central e fica parado na perna. */
function nivelPerna() {
  const g = new THREE.Group();
  /* a perna em silhueta, do quadril ao pé */
  const perfil = [[0, 4.6], [12, 5.2], [22, 6.4], [34, 5.4], [48, 5.6],
                  [60, 7.4], [72, 8.4], [88, 8.0], [96, 7.0]];
  const pts = perfil.map(([h, l]) => new THREE.Vector2(l * CM, h * CM));
  const perna = new THREE.Mesh(new THREE.LatheGeometry(pts, 34), M.pele);
  perna.geometry.scale(1, 1, .82);
  g.add(perna);

  const veias = [];
  /* profunda, entre os músculos — é ela que a bomba espreme */
  const prof = new THREE.Mesh(veia([
    V(0, 8 * CM, 0), V(.3 * CM, 26 * CM, .4 * CM), V(0, 48 * CM, .2 * CM),
    V(-.3 * CM, 72 * CM, 0), V(0, 94 * CM, .2 * CM),
  ], 2.4 * CM), M.veia);
  prof.userData.papel = 'profunda';
  veias.push(prof); g.add(prof);

  /* safena magna, superficial: sobe pela face interna e é a que se vê */
  const saf = new THREE.Mesh(veia([
    V(3.4 * CM, 10 * CM, 1.6 * CM), V(4.0 * CM, 30 * CM, 2.0 * CM),
    V(3.6 * CM, 52 * CM, 2.2 * CM), V(3.0 * CM, 74 * CM, 1.6 * CM),
    V(1.4 * CM, 92 * CM, .8 * CM),
  ], 1.6 * CM), M.veia);
  saf.userData.papel = 'safena';
  veias.push(saf); g.add(saf);

  /* perfurantes: ligam a superficial à profunda, e é por elas que a bomba
     alcança a safena — sem elas o desenho sugeriria dois sistemas soltos */
  for (const h of [24, 46, 68]) {
    const p = new THREE.Mesh(veia([
      V(3.5 * CM, h * CM, 1.8 * CM), V(1.6 * CM, (h + 2) * CM, .9 * CM),
      V(.2 * CM, (h + 3) * CM, .3 * CM),
    ], .9 * CM), M.veia);
    p.userData.papel = 'perfurante';
    veias.push(p); g.add(p);
  }
  g.userData.veias = veias;
  g.position.y = -52 * CM;
  return g;
}

/* ── NÍVEL 03 — A VÁLVULA, E O QUE ELA REALMENTE SEGURA ───────────────────
   Um segmento com três válvulas. A lição está na SOMA: nenhuma delas segura
   os 90 mmHg do tornozelo. Cada uma segura a diferença até a de cima —
   poucos centímetros de sangue, poucos mmHg. É a fila de degraus que parte a
   coluna, e é por isso que a competência de UMA válvula não salva a perna. */
const VALV_ALTURAS = [16, 30, 44];        // cm, no segmento desenhado

function nivelValvula() {
  const g = new THREE.Group();
  const R = 7 * CM, H = 56 * CM;
  g.add(parede(R, H, M.veia2));

  const valvulas = [];
  for (const h of VALV_ALTURAS) {
    const par = new THREE.Group();
    for (const teta of [0, Math.PI]) {
      const m = new THREE.Mesh(cuspide(R * .97, 11 * CM, teta), M.valvula);
      moldarCuspide(m, 1);
      par.add(m);
    }
    par.position.y = h * CM;
    par.userData.altura = h;
    valvulas.push(par); g.add(par);
  }
  g.userData.valvulas = valvulas;
  g.userData.alturaBase = 12;             // o segmento começa no tornozelo
  g.position.y = -H / 2;
  return g;
}

/* ── NÍVEL 04 — A BOMBA MUSCULAR ──────────────────────────────────────────
   O músculo da bancada 06 volta com FUNÇÃO NOVA: aqui ele não produz força
   para mover osso, ele espreme veia. Duas barrigas flanqueiam a profunda; a
   cada contração o segmento entre as válvulas se esvazia para cima, porque a
   de baixo fecha e a de cima abre. É a soma dos passos que derruba a pressão
   do tornozelo de 90 para perto de 25 — e é por isso que ficar PARADO em pé
   é pior que andar. */
function nivelBomba() {
  const g = new THREE.Group();
  const R = 5.5 * CM, H = 46 * CM;

  const veiaBomba = new THREE.Mesh(
    new THREE.CylinderGeometry(R, R, H, 26, 24, true), M.veia2);
  veiaBomba.renderOrder = 2;
  veiaBomba.geometry.translate(0, H / 2, 0);
  veiaBomba.userData.R = R; veiaBomba.userData.H = H;
  g.add(veiaBomba);

  /* duas barrigas de gastrocnêmio, uma de cada lado */
  const barrigas = [];
  for (const lado of [-1, 1]) {
    const perfil = [];
    for (let i = 0; i <= 12; i++) {
      const s = i / 12;
      perfil.push(new THREE.Vector2((3.0 + 4.6 * Math.sin(Math.PI * s)) * CM, s * H));
    }
    const m = new THREE.Mesh(new THREE.LatheGeometry(perfil, 26), M.musculo);
    m.position.x = lado * 7.4 * CM;
    m.userData.lado = lado; m.userData.x0 = m.position.x;
    barrigas.push(m); g.add(m);
  }

  const valvulas = [];
  for (const h of [10, 34]) {
    const par = new THREE.Group();
    for (const teta of [0, Math.PI]) {
      const m = new THREE.Mesh(cuspide(R * .97, 9 * CM, teta), M.valvula);
      moldarCuspide(m, 1); par.add(m);
    }
    par.position.y = h * CM; par.userData.altura = h;
    valvulas.push(par); g.add(par);
  }
  g.userData = { veiaBomba, barrigas, valvulas, R, H };
  g.position.y = -H / 2;
  return g;
}

/* ── NÍVEL 05 — O CICLO ───────────────────────────────────────────────────
   O corpo do nível 01 de volta, agora com a bomba trabalhando. O arco fecha
   onde começou, e a pergunta muda: não é mais "onde a coluna aperta", é
   "quanto volta ao coração". */
function nivelCiclo(geo) {
  const g = geo ? nivelCorpoMalha(geo) : nivelCorpoSilhueta();
  g.userData.comBomba = true;
  return g;
}

/* ========================================================================= */
export async function criar() {
  let geo = null;
  try { geo = await carregarCorpo(); }
  catch (err) { console.error('corpo.glb não entrou; segue a silhueta', err); }
  const modelos = [
    geo ? nivelCorpoMalha(geo) : nivelCorpoSilhueta(),
    nivelPerna(), nivelValvula(), nivelBomba(), nivelCiclo(geo),
  ];
  modelos.forEach((m, i) => { m.visible = i === 0; });

  /* ── VOLUME EMPOÇADO ───────────────────────────────────────────────────
     Somado das próprias veias desenhadas, não chumbado: pi*r^2*L anel a
     anel, comparado com o mesmo corpo deitado. O livro fala em 300 a 800 ml
     ao levantar, e o modelo tem de cair nessa faixa sozinho — se não cair, é
     o modelo que está errado, não o livro. */
  /* ── O VOLUME EMPOÇADO ─────────────────────────────────────────────────
     O tubo desenhado é EXAGERADO para se enxergar: medir volume no calibre
     do desenho deu 7.314 ml, dez vezes o que se mede numa perna. A saída não
     é corrigir o número no fim — é calibrar onde há medida.

     Repare que o CALIBRE DESENHADO NAO ENTRA nesta conta: so o fator de
     distensao e o comprimento. E por isso que se pode engrossar a veia para
     ela aparecer sem mexer um mililitro no resultado.

     Calibra-se o REPOUSO: as duas pernas guardam cerca de 600 ml de sangue
     venoso deitado, e isso é anatomia medida. O que acontece ao levantar sai
     então da lei de distensão, e é PREVISÃO do modelo, não entrada dele. Se a
     previsão não cair na faixa de 300 a 800 ml que a literatura relata, é o
     modelo que está errado — e é justamente isso que se quer poder descobrir. */
  const VOL_REPOUSO_PERNAS = 600;                 // ml, deitado, as duas pernas
  const DA_PERNA = new Set(['perna', 'profunda', 'safena', 'perfurante']);

  function somaArea(m, grau) {
    let soma = 0;
    for (const v of (m.userData.veias || [])) {
      if (!DA_PERNA.has(v.userData.papel)) continue;
      const u = v.geometry.userData;
      for (let s = 0; s < u.segsU; s++) {
        const f = fatorDeDistensao(pressaoVenosa(u.alturas[s], grau));
        const L = u.centros[s].distanceTo(u.centros[s + 1]) / CM;
        soma += f * f * L;                        // area vai com o quadrado do raio
      }
    }
    return soma;
  }
  const AREA0 = somaArea(modelos[0], 0);
  const volumeDe = (m, grau) => VOL_REPOUSO_PERNAS * somaArea(m, grau) / AREA0;

  /* Aplica a postura. `grau`: 0 = decúbito, 90 = ortostatismo. */
  function aplicarPostura(grau, { bombaOff = 0 } = {}) {
    for (const m of modelos) {
      for (const v of (m.userData.veias || [])) {
        moldarVeia(v, grau, v.userData.papel === 'jugular'
          ? { base: 6, teto: 1.2 } : {});
      }
    }
    /* AS VALVULAS DO NIVEL 03 FECHAM COM A COLUNA, e essa e a licao inteira.
       Deitado nao ha coluna que empurre para baixo: as cuspides ficam soltas
       contra a parede. Em pe, o peso do sangue acima as enche por tras e elas
       encostam as bordas — cada uma segurando o seu degrau. Mostra-las
       abertas em ortostatismo, como estavam na primeira foto, dizia o oposto
       do que o nivel existe para dizer. */
    const fechamento = clamp(Math.sin(grau * Math.PI / 180) * 1.15, 0, 1);
    for (const par of (modelos[2].userData.valvulas || [])) {
      const abre = clamp(1 - fechamento, .05, 1);
      par.children.forEach(c => moldarCuspide(c, abre));
      par.userData.abertura = abre;
    }

    const jug = pressaoVenosa(CORPO.olhos, grau, { base: 6 });
    return {
      tornozelo: pressaoVenosa(CORPO.tornozelo, grau),
      panturrilha: pressaoVenosa(30, grau),
      coxa: pressaoVenosa(CORPO.coxa, grau),
      coracao: pressaoVenosa(CORPO.coracao, grau),
      jugular: jug,
      jugularColabada: jug < 0,
      empocado: volumeDe(modelos[0], grau) - volumeDe(modelos[0], 0),
    };
  }

  /* ── A BOMBA ───────────────────────────────────────────────────────────
     `fase` 0..1 é um ciclo de contração. A válvula de BAIXO fecha quando o
     músculo aperta (senão o sangue voltaria ao pé) e a de CIMA abre. Na
     soltura o par troca de papel. Nunca as duas abertas ao mesmo tempo com o
     músculo apertando: isso seria um cano, e cano não bombeia. */
  function aplicarBomba(fase, grau) {
    const aperto = Math.max(0, Math.sin(fase * Math.PI * 2));
    const b = modelos[3].userData;
    for (const m of b.barrigas) {
      const e = 1 + .30 * aperto;
      m.scale.set(e, 1 - .12 * aperto, e);
      m.position.x = m.userData.x0 * (1 - .30 * aperto);
    }
    /* a veia entre as barrigas colaba onde o músculo aperta */
    const g = b.veiaBomba.geometry, pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i), s = clamp(y / b.H, 0, 1);
      const janela = Math.sin(Math.PI * s);
      const f = 1 - .82 * aperto * janela;
      const x = pos.getX(i), z = pos.getZ(i), d = Math.hypot(x, z) || 1;
      pos.setXYZ(i, x / d * b.R * f, y, z / d * b.R * f);
    }
    pos.needsUpdate = true; g.computeVertexNormals();

    b.valvulas.forEach((par, k) => {
      /* k=0 é a de baixo. Apertando: baixo fecha, cima abre. */
      const abre = k === 0 ? 1 - aperto : aperto;
      par.children.forEach(c => moldarCuspide(c, clamp(abre, .04, 1)));
      par.userData.abertura = abre;
    });

    /* A PRESSÃO DO TORNOZELO CAI COM O BOMBEAMENTO, e é esse o número que
       fecha a bancada: parado em pé são ~90 mmHg; andando, a coluna se parte
       nos segmentos e cai para perto de 25. */
    const eficacia = clamp(fase >= 0 ? 1 : 0, 0, 1);
    const parado = pressaoVenosa(CORPO.tornozelo, grau);
    return { aperto, parado, bombeando: parado - (parado - 25) * eficacia };
  }

  /* as válvulas do nível 03 seguram cada uma o seu degrau, e só ele */
  function degrausDaValvula(grau) {
    const m = modelos[2], base = m.userData.alturaBase;
    const alturas = [base, ...VALV_ALTURAS.map(h => base + h)];
    const passos = [];
    for (let i = 0; i < alturas.length - 1; i++) {
      passos.push({
        de: alturas[i], ate: alturas[i + 1],
        mmHg: (alturas[i + 1] - alturas[i]) * MMHG_POR_CM * Math.sin(grau * Math.PI / 180),
      });
    }
    return { passos, coluna: pressaoVenosa(base, grau) };
  }

  /* O sangue anda no desenho, e a velocidade é a fisiologia: em pé e parado
     a veia desacelera (o volume empoça); a bomba muscular devolve o fluxo.
     A artéria não espera a postura — ela pulsa. */
  const tmp = new THREE.Vector3(), nrm = new THREE.Vector3(), bin = new THREE.Vector3(), tan = new THREE.Vector3(), up = V(0, 1, 0);
  function animarCirculacao(dt, grau, andando) {
    const sen = Math.sin(grau * Math.PI / 180);
    const time = performance.now() / 1000;
    const beat = Math.pow(Math.max(0, Math.sin(time * 2 * Math.PI * 1.1)), 6);
    const fecha = clamp(sen * 1.15, 0, 1);
    for (const m of modelos) {
      if (!m.visible) continue;
      const h = m.userData.coracao;
      if (h) {
        h.scale.set(0.95 + 0.08 * beat, 1.15 + 0.1 * beat, 0.85 + 0.08 * beat);
        h.material.emissiveIntensity = 0.45 + beat * 1.4;
      }
      for (const ring of (m.userData.aneis || [])) {
        const e = 1.12 - 0.4 * fecha;
        ring.scale.setScalar(e);
        ring.material.emissiveIntensity = 0.3 + fecha * 1.15;
      }
      for (const layer of (m.userData.particulas || [])) {
        const { pos, data } = layer;
        for (let i = 0; i < data.length; i++) {
          const d = data[i];
          const venoso = d.path.kind === 'v';
          const pulso = venoso ? (andando ? 2.8 : Math.max(0.18, 1 - 0.78 * sen)) : (1 + beat * 2.2);
          d.t += d.speed * pulso * dt;
          if (d.t > 1) d.t -= 1;
          d.path.curve.getPointAt(d.t, tmp);
          d.path.curve.getTangentAt(d.t, tan);
          nrm.crossVectors(tan, up);
          if (nrm.lengthSq() < 1e-6) nrm.set(1, 0, 0);
          nrm.normalize();
          bin.crossVectors(tan, nrm).normalize();
          const w = Math.sin(time * 3 + d.wob) * d.path.r * 0.12;
          tmp.addScaledVector(nrm, d.off[0] + w).addScaledVector(bin, d.off[1] - w);
          pos[i * 3] = tmp.x; pos[i * 3 + 1] = tmp.y; pos[i * 3 + 2] = tmp.z;
        }
        layer.pts.geometry.attributes.position.needsUpdate = true;
      }
    }
  }

  aplicarPostura(0);
  aplicarBomba(0, 0);
  return { modelos, aplicarPostura, aplicarBomba, degrausDaValvula, animarCirculacao };
}
