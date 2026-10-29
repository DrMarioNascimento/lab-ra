/* Superfície de tecido para os ciclos portáteis de RA.
   ---------------------------------------------------------------------------
   POR QUE EXISTE. Os ciclos saíam com cor chapada: sob a luz do aparelho,
   parede, núcleo e fibra liam como plástico. Aqui cada família de tecido
   ganha três mapas procedurais — cor, relevo (normal) e aspereza — gerados
   no navegador, sem imagem externa. Nasceu no piloto do Starling e serve a
   qualquer experiência: TECIDOS diz que cor ou nome de material pertence a
   que família.

   ONDE ISTO É USADO. Só na cópia que vai para GLB/USDZ (compilar-ciclos.js).
   A bancada na tela continua com os materiais aprovados de cada modelos.js.

   TRÊS REGRAS QUE O USDZ IMPÕE:
   1. a repetição tem de estar no UV, não no material — o conversor
      (celula/tools/usdz.py) não lê KHR_texture_transform;
   2. a aspereza vai no canal G e o metal no B do MESMO mapa — por isso
      metalnessMap e roughnessMap são a mesma textura (metalness = 0);
   3. a cor do mapa é quase branca: no glTF e no USDZ ela MULTIPLICA a cor do
      material, que é a cor didática e não muda.

   DETERMINISMO. Nada de Math.random: a mesma semente gera os mesmos bytes,
   e o ciclo pode ser reconstruído e comparado.
   --------------------------------------------------------------------------- */
import * as T from 'three';

const LADO = 256;

/* Material → família, por experiência (cor sRGB ou nome do material).
   Moléculas, íons, setas e cores que codificam uma grandeza ficam lisos de
   propósito: são esquema, não superfície de tecido. */
export const TECIDOS = {
  // Starling: glicocálix, albumina, água e gel ficam lisos.
  starling: { cor: {
    bc4456: 'vaso', '8566a7': 'vaso', d87588: 'vaso', '5fb7a0': 'vaso',
    dba0ab: 'endotelio', c3b4dd: 'basal', '744471': 'nucleo',
    af8eae: 'citoplasma', b897b9: 'citoplasma', aaa0ad: 'colageno', b62649: 'hemacia',
  } },
  // Pleura: a pleura parietal e as zonas de West são cor de pressão; ficam lisas.
  pleura: { nome: {
    osso: 'osso', cartilagem: 'cartilagem', disco: 'cartilagem', traqueia: 'cartilagem',
    diafragma: 'musculo', fibra: 'musculo', intercostais: 'musculo', tendao: 'colageno',
  } },
  // Retorno venoso: a válvula é uma prega de endotélio.
  'retorno-venoso': { nome: { valvula_venosa: 'endotelio' } },
};

/* Lado de um ladrilho da textura, em metros no ambiente de RA. */
/* Medido nas fotos: com ladrilhos de 1–3 cm o desenho caía abaixo do pixel
   a meio metro e a superfície voltava a parecer lisa. */
const LADRILHO = {
  vaso: .06, endotelio: .05, basal: .04, nucleo: .03,
  citoplasma: .03, colageno: .02, hemacia: .04,
  osso: .05, cartilagem: .05, musculo: .04,
};

function gerador(semente) {
  let s = semente >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

/* Ruído de valor periódico: o ladrilho fecha nas bordas. */
function ruido(periodo, semente) {
  const r = gerador(semente), grade = Float32Array.from({ length: periodo * periodo }, r);
  const suave = t => t * t * (3 - 2 * t);
  return (u, v) => {
    const x = u * periodo, y = v * periodo, x0 = Math.floor(x), y0 = Math.floor(y);
    const fx = suave(x - x0), fy = suave(y - y0);
    const g = (i, j) => grade[((j % periodo + periodo) % periodo) * periodo + ((i % periodo + periodo) % periodo)];
    const a = g(x0, y0) + (g(x0 + 1, y0) - g(x0, y0)) * fx;
    const b = g(x0, y0 + 1) + (g(x0 + 1, y0 + 1) - g(x0, y0 + 1)) * fx;
    return a + (b - a) * fy;
  };
}

function fbm(periodo, oitavas, semente) {
  const camadas = Array.from({ length: oitavas }, (_, k) => ruido(periodo << k, semente + 977 * k));
  return (u, v) => {
    let soma = 0, peso = .5, total = 0;
    for (const n of camadas) { soma += n(u, v) * peso; total += peso; peso *= .5; }
    return soma / total;
  };
}

/* Distância ao ponto mais próximo (Worley), periódica, com estiramento em u. */
function celulas(quantidade, semente, estiraU = 1) {
  const r = gerador(semente), pts = Array.from({ length: quantidade }, () => [r(), r()]);
  return (u, v) => {
    let d1 = 9, d2 = 9;
    for (const [px, py] of pts) {
      let dx = Math.abs(u - px), dy = Math.abs(v - py);
      dx = Math.min(dx, 1 - dx) / estiraU; dy = Math.min(dy, 1 - dy);
      const d = Math.hypot(dx, dy);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
    }
    return [d1, d2];
  };
}

/* Cada família devolve altura (0–1), tom (≈0,75–1) e aspereza (≈0,8–1). */
const RECEITAS = {
  vaso() {
    const mancha = fbm(4, 4, 11), ruga = fbm(8, 3, 23);
    return (u, v) => {
      const r = ruga(u * .25, v); // rugas alongadas no sentido do vaso (u)
      return { h: .55 * r + .45 * mancha(u, v), tom: .7 + .3 * mancha(u, v) - .06 * r, as: .84 + .16 * r };
    };
  },
  endotelio() {
    /* Membrana com cavéolas: pequenas fossetas na face da célula, sobre uma
       ondulação larga. Sem bordas de célula desenhadas — a bancada conta seis
       núcleos por capilar e a textura não pode prometer outra contagem. */
    const onda = fbm(3, 3, 31), fosseta = celulas(90, 37);
    return (u, v) => {
      const [d] = fosseta(u, v), pit = Math.max(0, 1 - d / .028);
      return { h: .7 * onda(u, v) - .55 * pit * pit, tom: .76 + .24 * onda(u, v) - .14 * pit, as: .84 + .16 * onda(u, v) };
    };
  },
  basal() {
    // Feltro de fibras finas (lâmina densa), em várias direções.
    const a = fbm(16, 3, 41), b = fbm(16, 3, 43);
    return (u, v) => {
      const f = Math.abs(a(u, v) - b(u + .5, v + .5));
      const fio = Math.max(0, 1 - f / .06);
      return { h: .6 * fio + .4 * a(u, v), tom: .88 + .12 * fio, as: .9 + .1 * a(u, v) };
    };
  },
  nucleo() {
    /* Cromatina: grumos de heterocromatina mais escuros sobre fundo granular. */
    const grao = fbm(16, 3, 51), grumo = celulas(28, 53);
    return (u, v) => {
      /* cúpula suave, não cone: o cone do Worley facetava o núcleo como cristal */
      const [d1] = grumo(u, v), t = Math.min(1, Math.max(0, (.13 - d1) / .1));
      const massa = t * t * (3 - 2 * t);
      return { h: .6 * massa + .4 * grao(u, v), tom: .62 + .3 * (1 - massa) + .12 * grao(u, v), as: .8 + .2 * grao(u, v) };
    };
  },
  citoplasma() {
    // Citoplasma com grânulos finos e mancha suave.
    const grao = celulas(140, 61), mancha = fbm(4, 3, 67);
    return (u, v) => {
      const [d] = grao(u, v), g = Math.max(0, 1 - d / .022);
      return { h: .5 * g * g + .5 * mancha(u, v), tom: .74 + .22 * mancha(u, v) + .06 * g, as: .84 + .16 * mancha(u, v) };
    };
  },
  colageno() {
    /* Feixe de fibrilas paralelas: estrias ao longo do comprimento (u), com
       leve ondulação. O tubo leva u no comprimento e v na volta. */
    /* larguras irregulares: ruído quase só em v, esticado ao longo de u */
    const fibrila = fbm(24, 2, 71), desvio = fbm(4, 2, 73);
    return (u, v) => {
      const estria = fibrila(u * .08, v + .04 * desvio(u, v));
      return { h: estria, tom: .72 + .28 * estria, as: .86 + .14 * estria };
    };
  },
  osso() {
    /* Cortical: poros dos canais vasculares e lamelas suaves; tom de marfim
       mosqueado. Sem branco puro, que vira plástico. */
    const poro = celulas(70, 91), mancha = fbm(4, 4, 93), lamela = fbm(16, 2, 95);
    return (u, v) => {
      const [d] = poro(u, v), p = Math.max(0, 1 - d / .02);
      return { h: .5 * lamela(u * .3, v) + .3 * mancha(u, v) - .5 * p * p, tom: .82 + .14 * mancha(u, v) - .18 * p * p, as: .9 + .1 * mancha(u, v) };
    };
  },
  cartilagem() {
    // Hialina: matriz lisa e vítrea, com lacunas de condrócitos esparsas.
    const lacuna = celulas(26, 101, 1.6), onda = fbm(3, 3, 103);
    return (u, v) => {
      const [d] = lacuna(u, v), l = Math.max(0, 1 - d / .035);
      return { h: .6 * onda(u, v) - .35 * l * l, tom: .9 + .1 * onda(u, v) - .08 * l, as: .74 + .14 * onda(u, v) };
    };
  },
  musculo() {
    /* Estriado: fascículos ao longo de u (o comprimento da peça) e estrias
       transversais finas, que dão o aspecto de carne e não de borracha. */
    const fasc = fbm(12, 2, 111), estria = fbm(64, 1, 113), mancha = fbm(4, 3, 115);
    return (u, v) => {
      const f = fasc(u * .15, v), e = .5 + .5 * Math.sin(2 * Math.PI * (u * 40 + .3 * estria(u, v)));
      return { h: .65 * f + .2 * e + .15 * mancha(u, v), tom: .72 + .2 * f + .06 * e + .06 * mancha(u, v), as: .84 + .16 * f };
    };
  },
  hemacia() {
    // A membrana da hemácia é lisa: só uma variação larga de tom e brilho.
    const mancha = fbm(3, 3, 81);
    return (u, v) => ({ h: mancha(u, v), tom: .92 + .08 * mancha(u, v), as: .8 + .2 * mancha(u, v) });
  },
};

/* Força do relevo por família: o relevo é para ler o tecido, não para
   competir com a forma. */
const RELEVO = { vaso: 3.4, endotelio: 3.2, basal: 2.4, nucleo: 3.6, citoplasma: 2.8, colageno: 3, hemacia: .9, osso: 2.6, cartilagem: 1.8, musculo: 3.2 };

function tela() {
  const c = document.createElement('canvas'); c.width = c.height = LADO;
  return [c, c.getContext('2d'), new ImageData(LADO, LADO)];
}

function mapa(canvas, cor) {
  const t = new T.CanvasTexture(canvas);
  t.colorSpace = cor ? T.SRGBColorSpace : T.NoColorSpace;
  t.wrapS = t.wrapT = T.RepeatWrapping;
  t.anisotropy = 4;
  t.userData.mimeType = 'image/jpeg'; // JPEG: um terço do PNG, e o USDZ aceita
  return t;
}

const cache = new Map();
export function mapasDe(familia) {
  if (cache.has(familia)) return cache.get(familia);
  const f = RECEITAS[familia](), H = new Float32Array(LADO * LADO);
  const [cC, xC, iC] = tela(), [cN, xN, iN] = tela(), [cR, xR, iR] = tela();
  for (let y = 0; y < LADO; y++) for (let x = 0; x < LADO; x++) {
    const { h, tom, as } = f(x / LADO, y / LADO), k = y * LADO + x, p = k * 4;
    H[k] = h;
    iC.data[p] = iC.data[p + 1] = iC.data[p + 2] = Math.round(255 * Math.min(1, tom)); iC.data[p + 3] = 255;
    // G = aspereza, B = metal (zero); R e A sem uso
    iR.data[p] = 255; iR.data[p + 1] = Math.round(255 * Math.min(1, as)); iR.data[p + 2] = 0; iR.data[p + 3] = 255;
  }
  const forca = RELEVO[familia], at = (x, y) => H[((y + LADO) % LADO) * LADO + ((x + LADO) % LADO)];
  for (let y = 0; y < LADO; y++) for (let x = 0; x < LADO; x++) {
    const dx = (at(x + 1, y) - at(x - 1, y)) * forca, dy = (at(x, y + 1) - at(x, y - 1)) * forca;
    const l = Math.hypot(dx, dy, 1), p = (y * LADO + x) * 4;
    iN.data[p] = Math.round(128 - dx / l * 127); iN.data[p + 1] = Math.round(128 + dy / l * 127);
    iN.data[p + 2] = Math.round(128 + 127 / l); iN.data[p + 3] = 255;
  }
  xC.putImageData(iC, 0, 0); xN.putImageData(iN, 0, 0); xR.putImageData(iR, 0, 0);
  const m = { map: mapa(cC, true), normalMap: mapa(cN, false), roughnessMap: mapa(cR, false) };
  cache.set(familia, m);
  return m;
}

/* Marca os materiais ORIGINAIS pela cor ou pelo nome, antes da cópia de
   compilar(). A marca viaja no userData, que Material.copy preserva. */
export function marcarTecidos(raizes, { cor = {}, nome = {} }) {
  for (const raiz of raizes) raiz.traverse(o => {
    if (!o.isMesh || Array.isArray(o.material) || !o.material.color) return;
    const familia = nome[o.material.name] || cor[o.material.color.getHexString()];
    if (familia) o.material.userData.tecido = familia;
  });
}

/* Quantos metros cabem numa unidade de u e de v, medidos na própria malha
   (jacobiano do UV, ponderado pela área). Funciona também nas geometrias
   fundidas, onde o tipo original se perdeu. */
function metrosPorUV(geo, matriz) {
  const pos = geo.attributes.position, uv = geo.attributes.uv, idx = geo.index;
  const n = idx ? idx.count : pos.count, P = [new T.Vector3(), new T.Vector3(), new T.Vector3()];
  const e1 = new T.Vector3(), e2 = new T.Vector3(), du = new T.Vector3(), dv = new T.Vector3();
  let su = 0, sv = 0, peso = 0;
  for (let t = 0; t < n; t += 3) {
    const ids = [0, 1, 2].map(k => idx ? idx.getX(t + k) : t + k);
    ids.forEach((id, k) => P[k].fromBufferAttribute(pos, id).applyMatrix4(matriz));
    const [a, b, c] = ids;
    const d1x = uv.getX(b) - uv.getX(a), d1y = uv.getY(b) - uv.getY(a);
    const d2x = uv.getX(c) - uv.getX(a), d2y = uv.getY(c) - uv.getY(a);
    const det = d1x * d2y - d2x * d1y;
    if (Math.abs(det) < 1e-12) continue;
    e1.subVectors(P[1], P[0]); e2.subVectors(P[2], P[0]);
    du.copy(e1).multiplyScalar(d2y).addScaledVector(e2, -d1y).divideScalar(det);
    dv.copy(e2).multiplyScalar(d1x).addScaledVector(e1, -d2x).divideScalar(det);
    const area = e1.clone().cross(e2).length();
    su += du.length() * area; sv += dv.length() * area; peso += area;
  }
  return peso ? [su / peso, sv / peso] : [0, 0];
}

/* Núcleos e corpos celulares são esferas ACHATADAS, e o polo do UV esférico
   cai justo na face larga, a que se vê: o desenho convergia num redemoinho
   (visto no nível 4). Projeção plana pelo eixo mais fino, em metros: sem
   polo e sem costura; só a borda estreita estica. */
function planar(geo, matriz, L) {
  const pos = geo.attributes.position, uv = geo.attributes.uv, p = new T.Vector3();
  const caixa = new T.Box3();
  for (let i = 0; i < pos.count; i++) caixa.expandByPoint(p.fromBufferAttribute(pos, i).applyMatrix4(matriz));
  const tam = caixa.getSize(new T.Vector3()).toArray();
  const fino = tam.indexOf(Math.min(...tam)), [a, b] = [0, 1, 2].filter(k => k !== fino);
  for (let i = 0; i < pos.count; i++) {
    const q = p.fromBufferAttribute(pos, i).applyMatrix4(matriz).toArray();
    uv.setXY(i, q[a] / L, q[b] / L);
  }
}

function caixa(geo, matriz, L) {
  if (!geo.attributes.normal) geo.computeVertexNormals();
  const pos = geo.attributes.position, nor = geo.attributes.normal, p = new T.Vector3(), n = new T.Vector3();
  const normalMatriz = new T.Matrix3().getNormalMatrix(matriz), uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const q = p.fromBufferAttribute(pos, i).applyMatrix4(matriz).toArray();
    const m = n.fromBufferAttribute(nor, i).applyMatrix3(normalMatriz).toArray().map(Math.abs);
    const eixo = m.indexOf(Math.max(...m)), [a, b] = [0, 1, 2].filter(k => k !== eixo);
    uv[i * 2] = q[a] / L; uv[i * 2 + 1] = q[b] / L;
  }
  geo.setAttribute('uv', new T.BufferAttribute(uv, 2));
}

/* Aplica os mapas na cópia exportada. A repetição é inteira nos dois eixos:
   tubo e esfera fecham o UV na volta, e ladrilho fracionário abriria costura. */
export function texturizar(raiz) {
  raiz.updateMatrixWorld(true);
  const conta = { malhas: 0, familias: {} };
  raiz.traverse(o => {
    if (!o.isMesh || Array.isArray(o.material)) return;
    const familia = o.material.userData.tecido;
    if (!familia) return;
    delete o.material.userData.tecido;
    if (o.material.map) return; // textura própria da bancada (ex.: pulmões da pleura): não se cobre
    const geo = o.geometry, L = LADRILHO[familia];
    /* Sem UV (malha feita à mão): projeção pela face dominante, já em metros.
       A costura entre faces some num desenho de ruído. */
    if (!geo.attributes.uv) { caixa(geo, o.matrixWorld, L); conta.semUV = (conta.semUV || 0) + 1; }
    else if (geo.type === 'SphereGeometry') planar(geo, o.matrixWorld, L);
    else {
      const uv = geo.attributes.uv, [mu, mv] = metrosPorUV(geo, o.matrixWorld);
      const ru = Math.max(1, Math.round(mu / L)), rv = Math.max(1, Math.round(mv / L));
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * ru, uv.getY(i) * rv);
    }
    geo.attributes.uv.needsUpdate = true;
    const m = mapasDe(familia);
    Object.assign(o.material, { map: m.map, normalMap: m.normalMap, roughnessMap: m.roughnessMap, metalnessMap: m.roughnessMap, metalness: 0 });
    o.material.roughness = Math.min(1, o.material.roughness + .12); // o mapa escurece a aspereza média
    o.material.needsUpdate = true;
    conta.malhas++; conta.familias[familia] = (conta.familias[familia] || 0) + 1;
  });
  return conta;
}
