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
               sheenColor: new THREE.Color(0xffd9c4), transparent: true, opacity: .17,
               depthWrite: false }),
  osso: phys({ color: 0xe8dfcc, roughness: .62, sheen: .35 }),
  veia: phys({ color: 0xffffff, roughness: .52, sheen: .55,
               sheenColor: new THREE.Color(0x8fb4d8), vertexColors: true }),
  valvula: phys({ color: 0xf0e6dc, roughness: .44, sheen: .7,
                  sheenColor: new THREE.Color(0xffffff) }),
  coracao: phys({ color: 0x9e2f36, roughness: .55, sheen: .9,
                  sheenColor: new THREE.Color(0xff9a8a), emissive: 0x2a0a0c,
                  emissiveIntensity: .5 }),
  musculo: phys({ color: 0xa33a3a, roughness: .66, sheen: .85,
                  sheenColor: new THREE.Color(0xff8f7a) }),
};

/* ── A COR DA PRESSÃO ──────────────────────────────────────────────────────
   Azul frio a 0 mmHg, vinho congesto a 100. A escala satura em 100 e não no
   máximo possível: acima disso o olho já não distingue, e a faixa que importa
   (10 a 90) usaria só metade da rampa. Mesma lição da onda da bancada 07, que
   satura em 50 mV e não em 92. */
const FRIO = [64, 108, 168], QUENTE = [122, 26, 38];
export function corDaPressao(mmHg) {
  const t = clamp(mmHg / 100, 0, 1);
  /* raiz para abrir a metade baixa: entre 10 e 40 mmHg está a diferença
     entre a perna descansada e a perna parada em pé, e ela tem de aparecer */
  const u = Math.sqrt(t);
  return new THREE.Color(
    (FRIO[0] + (QUENTE[0] - FRIO[0]) * u) / 255,
    (FRIO[1] + (QUENTE[1] - FRIO[1]) * u) / 255,
    (FRIO[2] + (QUENTE[2] - FRIO[2]) * u) / 255);
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

/* Engorda e repinta um tubo de veia. `fator` 1 = calibre de repouso.
   A veia é um saco complacente, não um cano: dobrar a pressão não dobra o
   raio. A raiz cúbica vem da complacência venosa — muito volume por pouca
   pressão no começo, e quase nada depois que a parede estica. */
function moldarVeia(malha, grau, opc = {}) {
  const g = malha.geometry, u = g.userData;
  const pos = g.attributes.position, cor = g.attributes.color;
  const base = opc.base ?? 10, teto = opc.teto ?? 1.9;
  for (let s = 0; s <= u.segsU; s++) {
    const p = pressaoVenosa(u.alturas[s], grau, { base });
    const f = clamp(Math.cbrt(clamp(p, 0, 120) / 12), .72, teto);
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
function perfilCorpo() {
  /* [altura em cm, meia-largura em cm] do contorno de frente */
  return [[0, 5], [12, 5.5], [30, 6.5], [48, 7], [70, 9], [92, 12],
          [104, 13], [118, 13.5], [132, 15], [142, 15.5], [148, 8],
          [154, 9.5], [166, 9], [170, 4]];
}

function corpoSilhueta() {
  const perfil = perfilCorpo();
  const pts = perfil.map(([h, l]) => new THREE.Vector2(l * CM, h * CM));
  const g = new THREE.LatheGeometry(pts, 40);
  /* achatar em z: gente é mais larga que funda */
  g.scale(1, 1, .62);
  return new THREE.Mesh(g, M.pele);
}

/* ── NÍVEL 01 — O CORPO E A COLUNA ────────────────────────────────────────
   A árvore venosa inteira, do tornozelo ao coração, com a pressão de cada
   altura escrita na própria espessura e na própria cor. */
function nivelCorpo() {
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
    const m = new THREE.Mesh(veia(pontos, .85 * CM), M.veia);
    m.userData.papel = 'perna';
    veias.push(m); g.add(m);
  }
  /* cava inferior: do cruzamento das ilíacas ao átrio direito */
  const cava = new THREE.Mesh(veia([
    V(0, CORPO.quadril * CM, .6 * CM),
    V(.6 * CM, 102 * CM, .5 * CM),
    V(1.0 * CM, PIH * CM, .2 * CM),
    V(1.2 * CM, CORPO.coracao * CM, 0),
  ], 1.35 * CM), M.veia);
  cava.userData.papel = 'cava';
  veias.push(cava); g.add(cava);

  /* jugular: a veia que DENUNCIA o sinal trocado acima do diafragma —
     em pé ela colaba, deitada ela ingurgita, e é o exame de cabeceira */
  const jugular = new THREE.Mesh(veia([
    V(2.6 * CM, CORPO.ombro * CM, 3.0 * CM),
    V(2.8 * CM, 150 * CM, 3.2 * CM),
    V(2.9 * CM, CORPO.olhos * CM, 2.6 * CM),
  ], .62 * CM), M.veia);
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

/* ========================================================================= */
export function criar() {
  const modelos = [nivelCorpo()];
  modelos.forEach((m, i) => { m.visible = i === 0; });

  /* Aplica a postura a todos os níveis que tenham veias. `grau` é a
     inclinação do corpo: 0 = decúbito, 90 = ortostatismo. */
  function aplicarPostura(grau) {
    for (const m of modelos) {
      for (const v of (m.userData.veias || [])) {
        moldarVeia(v, grau, v.userData.papel === 'jugular'
          ? { base: 6, teto: 1.5 }        /* acima do PIH a coluna é negativa */
          : {});
      }
    }
    return {
      tornozelo: pressaoVenosa(CORPO.tornozelo, grau),
      coxa: pressaoVenosa(CORPO.coxa, grau),
      coracao: pressaoVenosa(CORPO.coracao, grau),
      jugular: pressaoVenosa(CORPO.olhos, grau, { base: 6 }),
    };
  }

  aplicarPostura(0);
  return { modelos, aplicarPostura };
}
