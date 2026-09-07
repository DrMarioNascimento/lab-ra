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
  /* PARDO, E NÃO VERMELHO-SANGUE. A regra está escrita no cabeçalho deste
     arquivo desde o começo — "o miocárdio não usa nenhum dos dois" — e o
     valor a desrespeitava: 0x8f2f33 tem o mesmo matiz do sangue arterial.
     Contra a cavidade azul a parede lia; contra a vermelha, sumia. Músculo é
     carne: pardo quente, e aí a faixa se destaca dos DOIS lados. */
  miocardio: phys({ color: 0x7a4038, roughness: .78, sheen: .30,
                    sheenColor: cor(200, 130, 105), sheenRoughness: .85 }),
  miocardioFino: phys({ color: 0x8d5046, roughness: .76, sheen: .30,
                        sheenColor: cor(210, 145, 118), sheenRoughness: .85 }),
  atrio: phys({ color: 0x6f3140, roughness: .80, sheen: .28,
                sheenColor: cor(190, 100, 110), sheenRoughness: .85 }),
  endocardio: phys({ color: 0xd9b6b8, roughness: .30, sheen: .7,
                     sheenColor: cor(255, 235, 235) }),
  /* ── A CAVIDADE TEM A COR DO QUE HÁ DENTRO DELA ──────────────────────────
     No desenho anatômico as quatro cavidades eram forradas do mesmo rosa
     pálido, e o resultado com o corte aberto era um bicho branco: nada
     dizia de que lado se estava. Num esquema a cavidade é SANGUE, e o aluno
     já chega sabendo ler vermelho e azul. É a etiqueta mais barata que
     existe — não custa rótulo, não custa legenda, não custa girar. */
  interiorRico: phys({ color: 0xb8323a, roughness: .42, sheen: .55,
                       sheenColor: cor(255, 190, 180) }),
  interiorPobre: phys({ color: 0x3b4a94, roughness: .42, sheen: .55,
                        sheenColor: cor(185, 195, 255) }),
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
function perfilExterno(perfil, espessura) {
  return perfil.map((p, i, a) => {
    /* a normal do perfil, para engrossar para fora sem deformar a ponta */
    const ant = a[Math.max(0, i - 1)], pro = a[Math.min(a.length - 1, i + 1)];
    const tx = pro.x - ant.x, ty = pro.y - ant.y;
    const n = Math.hypot(tx, ty) || 1;
    return new THREE.Vector2(p.x + ty / n * espessura, p.y - tx / n * espessura);
  });
}

/* A FACE DO CORTE é a peça mais importante do nível "por dentro": é ela, e
   só ela, que mostra a ESPESSURA da parede. Sem ela o corte revela a cavidade
   mas a parede vira uma linha, e a diferença entre 10 mm e 3 mm — que é a
   resposta inteira à diferença de pressão entre os dois lados — desaparece. */
function faceDoCorte(dentro, fora, angulo) {
  const pos = [], idx = [];
  const cos = Math.cos(angulo), sin = Math.sin(angulo);
  for (let i = 0; i < dentro.length; i++) {
    pos.push(dentro[i].x * cos, dentro[i].y, dentro[i].x * sin);
    pos.push(fora[i].x * cos, fora[i].y, fora[i].x * sin);
    if (i < dentro.length - 1) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

function camaraDupla(perfilInterno, espessura, mat, matInterno, segs = 30, corte = null) {
  const g = new THREE.Group();
  const dentro = perfilInterno.map(p => new THREE.Vector2(p.x, p.y));
  const fora = perfilExterno(perfilInterno, espessura);
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
  if (corte) {
    /* ── O MÚSCULO PRECISA DE GÊMEA ────────────────────────────────────────
       Com o corte pela METADE, quem olha está DENTRO da metade que ficou — e
       a face visível da casca externa aponta para fora, de costas para a
       câmera. O backface culling a descarta, e o miocárdio simplesmente não
       aparece: cada câmara vira um bloco liso da cor da cavidade, e a lição
       número um da bancada — parede esquerda três vezes a direita — some.

       No cunho estreito antigo isso não incomodava, porque quase sempre se
       via o modelo por fora. Num corte frontal passa a ser o defeito
       principal. A gêmea de winding invertido resolve, e é o mesmo truque
       que `cores-para-ra.js` usa: `side: DoubleSide` não serve, porque o
       glTF descarta o material e o USDZ do iPhone descarta o `doubleSided`. */
    const gemea = new THREE.Mesh(peloAvesso(externa.geometry), mat);
    gemea.userData.papelParede = 'externa';
    g.add(gemea);

    const a = faceDoCorte(dentro, fora, t0);
    const b = peloAvesso(faceDoCorte(dentro, fora, t0 + tL));
    g.add(new THREE.Mesh(mergeGeometries([a, b]), mat));
  }
  g.userData = { externa, interna, espessura };
  return g;
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

/* perfil de um ventrículo: bala alongada, mais estreita na ponta */
function perfilVentriculo(raio, altura, pontudo = 1) {
  const pts = [];
  for (let i = 0; i <= 20; i++) {
    const u = i / 20;
    /* O VENTRÍCULO É CONE, NÃO OVO. Com expoente alto o perfil engorda no
       meio e a peça vira bola; a ponta tem de afinar de verdade, porque é a
       ponta que dá ao coração a silhueta que todo mundo reconhece. */
    const r = raio * Math.pow(Math.sin(Math.PI * (.04 + .78 * u)), .40 * pontudo)
                   * (u < .12 ? .55 + u / .12 * .45 : 1);
    pts.push(new THREE.Vector2(Math.max(.4, r), u * altura));
  }
  return pts;
}

/* ── OS VENTRÍCULOS, EM CORTE FRONTAL ─────────────────────────────────────
   A ANATOMIA FIEL NÃO ENSINAVA AQUI. No corpo o ventrículo direito é uma
   meia-lua abraçada no esquerdo — está certo, e é ilegível: nunca se vê as
   quatro câmaras ao mesmo tempo, e foi por isso que esta bancada precisou de
   VIDRO para mostrar as próprias válvulas. Vidro é remendo de composição.

   O esquema do livro põe os dois LADO A LADO, separados pelo septo, e corta
   o coração no plano frontal: a metade da frente sai e as quatro cavidades
   ficam abertas para quem olha. Perde-se a forma do órgão; ganha-se a lição,
   que é ver a parede esquerda ao lado da direita e poder COMPARAR as duas.

   O SEPTO NÃO É PEÇA SEPARADA: é a parede esquerda do ventrículo esquerdo, e
   a cavidade direita termina exatamente onde ela começa. Isso é verdade na
   anatomia, e é o que evita desenhar duas paredes onde existe uma. */
const VE_X = 22, VD_X = -30;
/* os átrios saem para fora para abrir o corredor das artérias */
/* O ÁTRIO VOLTA PARA CIMA DO SEU VENTRÍCULO. Empurrá-lo para fora abria o
   corredor da artéria, mas soltava a câmara do resto: ficava um caroço
   flutuando. A saída certa é a que o corpo já usa — a via de saída é
   ANTERIOR, e a artéria passa NA FRENTE do átrio, não ao lado dele. Num
   diagrama isso é o normal: desenha-se a aorta por cima do átrio. */
const AE_X = VE_X, AD_X = VD_X;
/* z de quem passa na frente e de quem chega por trás */
const Z_FRENTE = 30, Z_FUNDO = -26;
export const PAREDE_VE = 10, PAREDE_VD = 3.4;

/* A METADE DA FRENTE É A QUE SAI. O LatheGeometry começa em +Z, então
   desenhar de π/2 com comprimento π deixa a abertura centrada em zero — de
   frente para quem olha, que é de onde o esquema tem de ser lido. */
const METADE = [Math.PI / 2, Math.PI];

function ventriculoEsquerdo(corte) {
  const g = camaraDupla(perfilVentriculo(22, ALTURA_VE), PAREDE_VE,
                        M.miocardio, M.interiorRico, 34, corte ? METADE : null);
  g.position.x = VE_X;
  g.userData.papel = 've';
  return g;
}

function ventriculoDireito(corte) {
  /* Mesma construção do esquerdo, e é isso que permite comparar: a única
     coisa que muda entre os dois é a ESPESSURA — 3,4 mm contra 10. Se cada
     um fosse feito de um jeito, a diferença na tela poderia ser do desenho.
     Assim ela só pode ser do número. */
  const g = camaraDupla(perfilVentriculo(20, ALTURA_VD), PAREDE_VD,
                        M.miocardioFino, M.interiorPobre, 34, corte ? METADE : null);
  g.position.set(VD_X, VD_Y, 0);
  g.userData.papel = 'vd';
  return g;
}

/* ── OS ÁTRIOS ────────────────────────────────────────────────────────────
   Sacos de parede fina em cima dos ventrículos, cada um com a sua aurícula —
   que é a orelhinha que todo mundo reconhece e quase nenhum desenho põe. */
function atrio(lado, corte) {
  const perfil = [];
  for (let i = 0; i <= 14; i++) {
    const u = i / 14;
    perfil.push(new THREE.Vector2(Math.max(.4, 21 * Math.sin(Math.PI * (.12 + .82 * u))), u * 34));
  }
  /* A AURÍCULA SAIU. Ela é a orelhinha que todo mundo reconhece, e no
     desenho anatômico ela estava certa — mas pendurada na frente de um
     átrio meio enterrado, virava um caroço escuro grudado por fora, e foi
     o primeiro defeito que o professor apontou na foto. Num esquema ela não
     paga o que custa: não participa de nenhuma das quatro lições. */
  const g = camaraDupla(perfil, 2.6, M.atrio, lado > 0 ? M.interiorRico : M.interiorPobre, 30, corte ? METADE : null);
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
/* No esquema elas ficam na METADE DE TRÁS, a mesma do corte: uma corda que
   caísse na metade removida ficaria pendurada no vazio, que foi exatamente
   como elas apareceram na primeira foto — um feixe branco flutuando no vão
   entre as duas colunas, preso a nada. */
function cordas(R, deY, ateY, n = 10, a0 = 0, aL = Math.PI * 2) {
  const gs = [];
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / Math.max(1, n - 1)) * aL;
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

function grandesVasos() {
  const g = new THREE.Group();
  /* ── OS VASOS NO ESQUEMA, E UM CRUZAMENTO QUE SAI ──────────────────────
     No corpo a aorta e o tronco pulmonar SE CRUZAM, e isso é lição de
     verdade: é o que explica a artéria pulmonar tapar a aorta na
     radiografia. Mas num corte frontal achatado o cruzamento vira NÓ — foi
     ele que embaralhou a primeira foto deste esquema, com dois canos
     arqueando por cima de tudo.

     Aqui cada saída sobe do SEU ventrículo, pelo lado de dentro da coluna,
     e arqueia para fora. O cruzamento fica para o nível 01, que mostra o
     coração fechado e é onde ele de facto se vê. Um esquema escolhe o que
     conta; quem tenta contar tudo não conta nada.

     Tudo em z = 0: o corte é frontal, e o que sai do plano deixa de ser
     lido de frente. */
  /* aorta: sobe do ventrículo esquerdo junto ao septo e arqueia para fora */
  g.add(vasoTubo([[10, 74, Z_FRENTE], [10, 104, Z_FRENTE], [20, 128, Z_FRENTE], [46, 140, Z_FRENTE], [68, 130, Z_FRENTE]],
                 11, M.aorta));
  /* tronco pulmonar: o espelho, saindo do direito */
  g.add(vasoTubo([[-18, 68, Z_FRENTE], [-18, 100, Z_FRENTE], [-28, 122, Z_FRENTE], [-54, 133, Z_FRENTE], [-76, 123, Z_FRENTE]],
                 9.5, M.pulmonar));
  /* as cavas chegam ao átrio direito pela borda de fora, uma por cima e
     outra por baixo — é o que faz o sangue do corpo inteiro convergir */
  g.add(vasoTubo([[-88, 122, Z_FUNDO], [-70, 108, Z_FUNDO], [-46, 96, Z_FUNDO]], 8.5, M.cava));
  g.add(vasoTubo([[-88, 48, Z_FUNDO], [-70, 64, Z_FUNDO], [-46, 78, Z_FUNDO]], 9.5, M.cava));
  /* as veias pulmonares chegam ao átrio esquerdo pela outra borda */
  g.add(vasoTubo([[88, 120, Z_FUNDO], [68, 108, Z_FUNDO], [40, 96, Z_FUNDO]], 5.4, M.veiaPulmonar));
  g.add(vasoTubo([[88, 86, Z_FUNDO], [68, 84, Z_FUNDO], [40, 82, Z_FUNDO]], 5.4, M.veiaPulmonar));
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

  /* ── A CONDUÇÃO NO ESQUEMA ─────────────────────────────────────────────
     O trajeto é o argumento: o sinal NASCE no alto do átrio direito,
     atravessa os átrios, ENCALHA no nó atrioventricular — os cem
     milissegundos que deixam o átrio terminar de encher — e só então desce
     pelo septo e se abre nos dois ramos. Desenhado no esquema, esse caminho
     vira uma linha que se lê de cima para baixo, de uma coluna para a
     outra e de volta. Na anatomia ele existia, mas passava por trás do
     miocárdio e ninguém o seguia com o olho.

     Tudo um pouco atrás do plano do corte (z ≈ −5) para correr contra a
     parede de trás, e não flutuar no vão. */
  const Z = -5;

  const no = new THREE.Mesh(new THREE.SphereGeometry(4.4, 12, 9), M.conducao);
  no.position.set(VD_X - 15, 90, Z); no.scale.set(1, 1.4, .8);
  põe('sinusal', no);

  /* as vias internodais: três fitas descendo o átrio direito até o nó AV */
  for (const dz of [-5, 0, 5]) {
    const t = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(
      [V(VD_X - 14, 88, Z), V(VD_X - 8, 80, Z + dz * .5),
       V(VD_X + 8, 73, Z + dz * .4), V(-11, 69, Z)]), 16, 1.5, 6, false);
    põe('atrios', new THREE.Mesh(t, M.conducao));
  }

  const av = new THREE.Mesh(new THREE.SphereGeometry(3.9, 12, 9), M.conducao);
  av.position.set(-10, 68, Z); av.scale.set(1.3, .9, .9);
  põe('av', av);

  /* o feixe de His desce DENTRO DO SEPTO, que aqui é a parede esquerda do
     ventrículo esquerdo — a faixa entre x = −10 e x = 0 */
  põe('his', new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(
    [V(-10, 66, Z), V(-7, 60, Z), V(-5, 54, Z)]), 10, 2.0, 8, false), M.conducao));

  /* os dois ramos se abrem para as duas colunas, cada um pela face do septo
     que olha para o seu ventrículo */
  põe('ramos', new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(
    [V(-5, 54, Z), V(-12, 44, Z), V(-20, 30, Z), V(-26, 18, Z)]), 18, 1.5, 6, false), M.conducao));
  põe('ramos', new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(
    [V(-5, 54, Z), V(2, 44, Z), V(11, 30, Z), V(18, 18, Z)]), 18, 1.5, 6, false), M.conducao));

  /* Purkinje: UMA REDE POR VENTRÍCULO, abrindo da ponta para a parede. Antes
     era um anel só em torno da origem do modelo — que no esquema é o vão
     ENTRE as colunas, e a rede saía espalhada no nada. */
  const rede = (cx, deX, deY, apice, raio, n = 9) => {
    const fios = [];
    for (let i = 0; i < n; i++) {
      const lado = -1 + 2 * (i / (n - 1));
      fios.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(
        [V(deX, deY, Z),
         V(cx + lado * raio * .45, apice + 12 + rnd(-2, 4), Z + rnd(-2, 2)),
         V(cx + lado * raio, apice + 3 + rnd(0, 8), Z + rnd(-3, 3))]), 12, .9, 5, false));
    }
    return new THREE.Mesh(mergeGeometries(fios), M.conducao);
  };
  põe('purkinje', rede(VD_X, -26, 18, 6, 17));
  põe('purkinje', rede(VE_X, 18, 18, 3, 19));
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
/* ── O CAMINHO DO SANGUE NO ESQUEMA ───────────────────────────────────────
   Cada gota faz o circuito de UMA coluna: chega pela veia, atravessa a
   atrioventricular, desce até a ponta do ventrículo, sobe pela via de saída,
   atravessa a semilunar e vai embora pela artéria. Sempre no mesmo sentido,
   sempre dentro da própria coluna — é isso que faz o aluno ver DOIS
   circuitos em série e não um emaranhado.

   `uAV` e `uSL` marcam, ao longo do caminho, onde estão as duas portas. As
   gotas não passam por valva fechada, e é daí que sai o acúmulo no átrio
   durante a sístole e a parada na fase isovolumétrica — sem que nada disso
   tenha sido escrito. */
const CAMINHOS = {
  direito: {
    pontos: [[-58, 96, -26], [-44, 90, -16], [-34, 84, -6], [-30, 76, 0],
             [-30, 68, 0], [-30, 52, 0], [-30, 32, 0], [-28, 16, 0],
             [-24, 40, 6], [-20, 62, 16], [-18, 72, 26], [-18, 102, 30]],
    uAV: .36, uSL: .88, mat: 'sanguePobre',
  },
  esquerdo: {
    pontos: [[58, 92, -26], [46, 88, -16], [34, 84, -6], [22, 79, 0],
             [22, 74, 0], [22, 58, 0], [22, 36, 0], [20, 14, 0],
             [16, 40, 6], [12, 66, 16], [10, 79, 26], [10, 108, 30]],
    uAV: .36, uSL: .88, mat: 'sangueRico',
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
                     desvio: V(rnd(-2.4, 2.4), 0, rnd(-2.4, 2.4)) };
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
  const ve = ventriculoEsquerdo(corte); g.add(ve);
  const vd = ventriculoDireito(corte); g.add(vd);

  /* CADA ÁTRIO SENTA NO TOPO DO SEU VENTRÍCULO, no mesmo eixo — é o que faz
     as quatro câmaras se lerem como duas colunas, direita e esquerda, com o
     sangue subindo por uma e descendo pela outra. */
  /* O ÁTRIO SAI PARA FORA, e não fica em cima do ventrículo. Se ele senta
     no mesmo eixo, a artéria não tem por onde subir sem atravessá-lo — foi
     exatamente o que apertou o desenho na etapa anterior. Deslocado, sobra
     o corredor de dentro para a saída, e a valva atrioventricular fica na
     sobreposição das duas peças, que é onde ela está de verdade. */
  const ae = atrio(1, corte); ae.position.set(AE_X, ALTURA_VE - 4, 0); g.add(ae);
  const ad = atrio(-1, corte); ad.position.set(AD_X, VD_Y + ALTURA_VD - 4, 0); g.add(ad);

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
    /* UM FEIXE POR COLUNA, dentro do seu ventrículo. Antes havia um só,
       centrado na origem do modelo — que no esquema é o vão ENTRE as duas
       colunas, e por isso as cordas apareciam penduradas no vazio. Elas
       existem para a atrioventricular não virar do avesso na sístole; se
       não estiverem presas ao ventrículo certo, não dizem nada. */
    const meia = [Math.PI / 2, Math.PI];
    const cm = cordas(12, ALTURA_VE - 6, ALTURA_VE - 32, 7, ...meia);
    cm.position.x = VE_X; g.add(cm);
    const ct = cordas(11, VD_Y + ALTURA_VD - 6, VD_Y + ALTURA_VD - 28, 7, ...meia);
    ct.position.x = VD_X; g.add(ct);
  }
  if (comCoronarias) g.add(coronarias());
  let cond = null;
  if (comConducao) { cond = conducao(); g.add(cond); }
  const sangue = gotasDeSangue(); g.add(sangue);
  g.add(vasos);

  /* A INCLINAÇÃO ANATÔMICA SAIU. No tórax o coração pende torto, com a ponta
     para a esquerda e para a frente, e o desenho anterior copiava isso. Num
     ESQUEMA a inclinação só atrapalha: ela desalinha as duas colunas, tira a
     simetria que faz a comparação direita/esquerda ser imediata, e faz o
     corte frontal deixar de ser frontal. Diagrama se lê aprumado. */
  g.position.y = -52;
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
      const e = Math.cbrt(clamp(volume / referencia, .25, 2));
      const ef = 1 - (1 - e) * .34;
      for (const filho of o.children) {
        if (filho.userData?.papelParede === 'interna')
          filho.scale.set(e, 1 - (1 - e) * .35, e);
        if (filho.userData?.papelParede === 'externa')
          filho.scale.set(ef, 1 - (1 - ef) * .4, ef);
      }
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
        const e = Math.cbrt(clamp(volume / referencia, .25, 2));
        grupo.userData.interna.scale.set(e, 1 - (1 - e) * .35, e);
        /* a externa acompanha só um terço: o resto vira espessura de parede */
        const ef = 1 - (1 - e) * .34;
        grupo.userData.externa.scale.set(ef, 1 - (1 - ef) * .4, ef);
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
