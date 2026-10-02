/* ============================================================================
   TESTE 10 — ESPAÇO PLEURAL E ZONAS DE WEST · geometria. Nada de DOM.
   A física mora em `fisica.js` e não é importada aqui: geometria não decide
   número. O app junta as duas. A INTERFACE com o app é a mesma de antes:
   `criar()` devolve { modelos, aplicarFresta, aplicarTorax, aplicarAlveolos,
   aplicarZonas, N_ALV, N_FAIXA }.

   O QUE MUDOU. As peças agora são anatômicas e vêm de `anatomia.js`
   (metros, lado direito do paciente em x negativo — como numa radiografia):
   doze pares de costelas em fita descendo até o esterno, coluna com
   processos, pulmões com fissuras e chanfradura cardíaca, pleura parietal
   como envelope, diafragma em duas cúpulas, coração e grandes vasos.

   A REGRA DE COR continua: pressão NEGATIVA é azul-frio, POSITIVA é âmbar.
   No pneumotórax o pulmão direito recolhe para o hilo e o envelope da pleura
   parietal — que fica com a parede — vira ESPAÇO âmbar entre os dois. Nas
   zonas de West a cor é categórica: cinza, âmbar, vermelho.
   ========================================================================== */
import * as THREE from 'three';
import {
  DIR, ESQ, mk, loft, tuboGeo, construirCaixa, construirColuna, construirDiafragma,
  construirMediastino, geoPulmao, secaoPulmao, HILO, fragmentoGeo, tecidoGeo,
  amostraPulmao, unidadeAcinar, redeCapilar,
} from './anatomia.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const cor = (r, g, b) => new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);

/* Uma unidade de mundo = 1 cm. A anatomia é construída em metros e entra num
   grupo `cm` com escala 100 — o nível em si fica com escala 1, que é o que a
   RA espera ao medir a caixa. */
export const TORAX = { altura: 30, largura: 28, fundo: 20 };

export const CORES = {
  negativa: cor(70, 132, 214),
  positiva: cor(245, 158, 46),
  zona1: cor(140, 146, 152),
  zona2: cor(233, 160, 62),
  zona3: cor(200, 54, 62),
};

const phys = (name, o) => Object.assign(new THREE.MeshPhysicalMaterial(o), { name });
export const M = {
  osso:       phys('osso',       { color: 0xc6b89e, roughness: .76, sheen: .16, sheenColor: cor(230, 216, 187) }),
  cartilagem: phys('cartilagem', { color: 0x9ab2b0, roughness: .62, sheen: .24 }),
  ossoJanela: phys('osso_janela', { color: 0xc6b89e, roughness: .76, transparent:true,opacity:.26,depthWrite:false }),
  cartilagemJanela: phys('cartilagem_janela', { color:0x9ab2b0,roughness:.62,transparent:true,opacity:.35,depthWrite:false }),
  disco:      phys('disco',      { color: 0xc8b5a2, roughness: .82 }),
  pulmao:     phys('pulmao',     { color: 0xb77383, roughness: .77, sheen: .36, vertexColors: true, sheenColor: cor(232, 151, 165) }),
  pulmaoColapso: phys('pulmao_colapsado', { color: 0x783747, roughness: .76, sheen: .28, vertexColors: true, sheenColor: cor(182, 112, 126) }),
  pulmaoVidro: phys('pulmao_translucido', { color: 0x749fae, roughness: .56, sheen: .25,
                 transparent: true, opacity: .14, depthWrite: false, side: THREE.DoubleSide }),
  pleuraP:    phys('pleura_parietal', { color: CORES.negativa.getHex(), roughness: .15, transparent: true, opacity: .12, depthWrite: false, side: THREE.DoubleSide }),
  pleuraAr:   phys('espaco_pleural_ar', { color: CORES.positiva.getHex(), roughness: .3, emissive: cor(70, 34, 0).getHex(), emissiveIntensity: .6,
                 transparent: true, opacity: .26, depthWrite: false, side: THREE.DoubleSide }),
  diafragma:  phys('diafragma',  { color: 0x8e404a, roughness: .78, sheen: .26, sheenColor: cor(214, 115, 123), side: THREE.DoubleSide }),
  tendao:     phys('tendao', { color: 0xd6c9af, roughness: .75, side: THREE.DoubleSide }),
  fibra:      phys('fibra', { color: 0xb26868, roughness: .85 }),
  coracao:    phys('coracao',    { color: 0x963b46, roughness: .74, sheen: .28 }),
  arteria:    phys('arteria',    { color: 0xc44b53, roughness: .5 }),
  veia:       phys('veia',       { color: 0x5c6fae, roughness: .5 }),
  traqueia:   phys('traqueia',   { color: 0xe8ded8, roughness: .55 }),
  alveolo:    phys('alveolo',    { color: 0xc88798, roughness: .69, sheen: .3, sheenColor: cor(237, 171, 185) }),
  zona1:      phys('zona1',      { color: CORES.zona1.getHex(), roughness: .5 }),
  zona2:      phys('zona2',      { color: CORES.zona2.getHex(), roughness: .5 }),
  zona3:      phys('zona3',      { color: CORES.zona3.getHex(), roughness: .5 }),
  seta:       phys('seta',       { color: 0xf5c518, roughness: .4, emissive: cor(70, 52, 0).getHex(), emissiveIntensity: .5, depthTest: false }),
  /* nível 01, o corte */
  parede:     phys('parede',     { color: 0xd8b9a6, roughness: .74, sheen: .8, sheenColor: cor(255, 214, 190), transparent: true, opacity: .16, depthWrite: false }),
  musculo:    phys('musculo',    { color: 0xa84f5a, roughness: .7, transparent: true, opacity: .3, depthWrite: false }),
  pleuraV:    phys('pleura_visceral', { color: 0xf0dfe4, roughness: .38, sheen: .9, sheenColor: cor(255, 255, 255), transparent: true, opacity: .52 }),
  pleuraPc:   phys('pleura_parietal_corte', { color: 0xe6d3c8, roughness: .42, sheen: .8, transparent: true, opacity: .36 }),
  liquido:    phys('liquido',    { color: 0xa8dcf0, roughness: .12, sheen: 1, sheenColor: cor(255, 255, 255), transparent: true, opacity: .66 }),
  frestaNeg:  phys('fresta_negativa', { color: CORES.negativa.getHex(), roughness: .4, emissive: cor(6, 24, 60).getHex(), emissiveIntensity: .7, transparent: true, opacity: .5 }),
  frestaPos:  phys('fresta_positiva', { color: CORES.positiva.getHex(), roughness: .4, emissive: cor(70, 34, 0).getHex(), emissiveIntensity: .7, transparent: true, opacity: .5 }),
};

const emCm = () => { const g = new THREE.Group(); g.name = 'cm'; g.scale.setScalar(100); return g; };

/* ── NÍVEL 01 — A FRESTA ──────────────────────────────────────────────────
   Close no corte da parede. Em cm, esquemático de propósito: duas costelas
   dentro do músculo intercostal, a pleura parietal forrando a parede, o
   filme de líquido, a pleura visceral, e o pulmão por dentro. A fresta é a
   lâmina azul; no pneumotórax ela engorda e vira âmbar. */
function nivelFresta() {
  const g = new THREE.Group(); g.name = 'corte_costopleural';
  const parede = new THREE.Group(); parede.name = 'parede_costal';
  // Ordem contínua de fora para dentro: pele, gordura, músculo, parietal,
  // filme seroso, visceral e parênquima. Espessuras ampliadas para leitura.
  const camada = (nome,a,b,mat,w=24,h=18) => mk(nome,fragmentoGeo(a,b,w,h,(24-w)/2),mat);
  const peleMat=phys('pele_corte',{color:0xc7987c,roughness:.86});
  const gorduraMat=phys('tecido_subcutaneo',{color:0xd2b56d,roughness:.82});
  const muscMat=phys('intercostais',{color:0x984757,roughness:.78,sheen:.2});
  const pleuraMat=phys('membrana_parietal',{color:0x8db7ca,roughness:.36,transparent:true,opacity:.72});
  const visceralMat=phys('membrana_visceral',{color:0xd9a1b2,roughness:.36,transparent:true,opacity:.68});
  const parietal=camada('pleura_parietal',.55,.64,pleuraMat,15);
  parede.add(parietal,camada('intercostais',.64,1.65,muscMat,12),
    camada('gordura',1.65,2.25,gorduraMat,9),camada('pele',2.25,2.65,peleMat,6));
  for(const y of [-4.8,4.8]) {
    const pts=[];for(let i=0;i<=24;i++){const x=i/2;pts.push(V(x,y-.07*x,1.22-.013*x*x-.004*y*y));}
    const osso=mk(`costela_${y}`,tuboGeo(pts,.50,48),M.osso);parede.add(osso);
  }
  const filme=camada('filme_seroso',.40,.55,M.liquido,18);
  const fresta=camada('espaco_pleural',.40,.55,M.frestaNeg,18);
  fresta.userData.repouso=fresta.geometry.attributes.position.array.slice();
  const visceral=camada('pleura_visceral',.30,.40,visceralMat,21,17.8);
  const dentro=new THREE.Group();dentro.name='parenquima_pulmonar';
  const tecidoMat=phys('parenquima_corte',{color:0xb77285,roughness:.81,sheen:.28});
  dentro.add(camada('tecido_pulmonar',-3.4,.30,tecidoMat,23.8,17.8));
  // Microestrutura visível na face seccionada, ligada a um bronquíolo.
  const alvMat=phys('alveolos_corte',{color:0x9c526c,roughness:.72});
  const arMat=phys('luz_alveolar',{color:0x392a37,roughness:1});
  for(let j=0;j<9;j++)for(let i=0;i<3;i++) {
    const x=-10.9+i*.65,y=-7.4+j*1.8,z=.24-.013*x*x-.004*y*y;
    const ring=new THREE.TorusGeometry(.23,.06,10,28),p=ring.attributes.position;
    for(let k=0;k<p.count;k++){const xx=p.getX(k),yy=p.getY(k),f=1+.12*Math.sin(Math.atan2(yy,xx)*5+i+j);p.setXYZ(k,xx*f,yy*f*.85,p.getZ(k));}ring.computeVertexNormals();
    const a=mk(`septo_alveolar_${i}_${j}`,ring,alvMat);a.position.set(x,y,z+.15);dentro.add(a);
    const luz=mk(`luz_alveolar_${i}_${j}`,new THREE.CircleGeometry(.21,28),arMat);luz.scale.y=.85;luz.position.set(x,y,z+.08);dentro.add(luz);
  }
  const bron=mk('bronquiolo_corte',tuboGeo([V(-9,-5,-2.6),V(-4,-1,-2.1),V(1,2,-1.6),V(7,5,-2)],.30,40),M.traqueia);
  dentro.add(bron);
  // Vista oblíqua de uma secção, com a borda de cada camada exposta.
  g.add(dentro,visceral,filme,fresta,parede);g.rotation.y=-.48;g.rotation.x=.16;
  g.userData={fresta,filme,visceral,parietal,dentro,parede};
  return g;
}

/* ── NÍVEL 02 e 03 — O TÓRAX ─────────────────────────────────────────────
   As duas molas e o pneumotórax usam a MESMA peça: é o mesmo tórax, com e
   sem furo. A caixa (costelas, esterno, coluna e a pleura PARIETAL, que é da
   parede) escala em x e z; cada pulmão escala em torno do seu hilo. */
function nivelTorax({ comSetas = false } = {}) {
  const g = new THREE.Group();
  const cm = emCm(); g.add(cm);

  const caixa = new THREE.Group(); caixa.name = 'caixa';
  caixa.add(construirCaixa(M), construirColuna(M));
  const pleuras = {};
  for (const s of [DIR, ESQ]) {
    const m = mk(`pleura_parietal_${s === DIR ? 'D' : 'E'}`, geoPulmao(s, { inflate: .0015, fissuras: false, assoalho: .0105 }), M.pleuraP);
    m.renderOrder = 4; m.castShadow = false; caixa.add(m); pleuras[s] = m;
  }
  const med = construirMediastino(M);
  const diafragma=construirDiafragma(M);
  diafragma.traverse(o=>{if(o.isMesh)o.userData.repouso=o.geometry.attributes.position.array.slice();});
  cm.add(caixa, diafragma, med);

  /* ordem [esquerdo, direito]: o doente é o direito, como na física */
  const pulmoes = [ESQ, DIR].map(s => {
    const p = new THREE.Group(); p.name = `pulmao_${s === DIR ? 'D' : 'E'}`;
    const h = HILO(s); p.position.copy(h);
    const malha = mk(`pulmao_${s === DIR ? 'D' : 'E'}_malha`, geoPulmao(s), M.pulmao);
    malha.position.copy(h).negate();
    p.add(malha);
    p.userData = { malha, lado: s, base: h.clone() };
    cm.add(p);
    return p;
  });

  let setas = null;
  if (comSetas) {
    /* uma seta para dentro (o pulmão recolhe) e uma para fora (a caixa
       empurra), na mesma altura, na parede lateral direita: é o EMPATE delas
       que faz a pressão negativa. Geometria em metros, dentro do `cm`. */
    setas = new THREE.Group(); setas.name = 'setas';
    for (const [nome, sinal] of [['pulmao', -1], ['caixa', 1]]) {
      const s = new THREE.Group(); s.name = `seta_${nome}`;
      const haste = mk(`haste_${nome}`, new THREE.CylinderGeometry(.0042, .0042, .01, 12), M.seta);
      haste.geometry.rotateZ(-Math.PI / 2); haste.geometry.translate(.005, 0, 0);   // 1 cm, esticado por scale.x
      const ponta = mk(`ponta_${nome}`, new THREE.ConeGeometry(.0105, .02, 14), M.seta);
      ponta.geometry.rotateZ(-Math.PI / 2); ponta.geometry.translate(.01, 0, 0);
      haste.renderOrder = ponta.renderOrder = 20;   // a seta se vê através do pulmão
      s.add(haste, ponta);
      s.userData = { nome, sinal, haste, ponta };
      setas.add(s);
    }
    cm.add(setas);
  }
  g.userData = { caixa, pulmoes, setas, med, pleuras, diafragma };
  g.position.y = -15;
  return g;
}

/* ── NÍVEL 04 — O GRADIENTE ──────────────────────────────────────────────
   O pulmão direito em vidro, centrado no eixo, e uma coluna de alvéolos do
   ápice à base na parte posterior — onde o pulmão é mais alto. O raio de
   cada um vem da física. */
const N_ALV = 9;
function pulmaoDeVidro() {
  const cm = emCm();
  cm.position.x = -secaoPulmao(DIR, 0.18).xc * 100;   // centra o pulmão no eixo de rotação
  const malha = mk('pulmao_D', geoPulmao(DIR), M.pulmaoVidro);
  malha.renderOrder = 6; malha.castShadow = false;
  cm.add(malha);
  return cm;
}
function nivelGradiente() {
  const g = new THREE.Group();
  const cm = pulmaoDeVidro(); g.add(cm);
  const alveolos = [];
  for (let i = 0; i < N_ALV; i++) {
    const f = i / (N_ALV - 1);
    const a=amostraPulmao(DIR,f),r=Math.min(.011,a.rx*.30,a.rz*.30);
    const m=unidadeAcinar(M,r);m.name=`unidade_alveolar_${i+1}`;
    m.position.copy(a.centro);
    m.userData.f = f;
    alveolos.push(m); cm.add(m);
  }
  cm.add(mk('bronquiolo_terminal',tuboGeo(alveolos.map(m=>m.position.clone()),.00115,64),M.traqueia));
  g.userData = { alveolos };
  g.position.y = -15;
  return g;
}

/* ── NÍVEL 05 — AS ZONAS ─────────────────────────────────────────────────
   Faixas horizontais de capilar atravessando o pulmão, uma por altura,
   pintadas pela zona. A cor é CATEGÓRICA de propósito. */
const N_FAIXA = 9;
function nivelZonas() {
  const g = new THREE.Group();
  const cm = pulmaoDeVidro(); g.add(cm);
  const faixas = [];
  for (let i = 0; i < N_FAIXA; i++) {
    const f = i / (N_FAIXA - 1);
    const a=amostraPulmao(DIR,f);
    const rx=Math.min(a.rx*.68,a.folga*.72),rz=Math.min(a.rz*.55,rx*.6);
    const geo=redeCapilar(rx,rz);
    const m = mk(`capilar_${i + 1}`, geo, M.zona3);
    m.position.copy(a.centro);
    m.userData.f = f; m.userData.rx=rx;
    faixas.push(m); cm.add(m);
  }
  for(const side of [-1,1]) {
    const pts=faixas.map(m=>m.position.clone().add(V(side*m.userData.rx,0,0)));
    cm.add(mk(side<0?'arteriola_pulmonar':'venula_pulmonar',tuboGeo(pts,.0007,64),side<0?M.arteria:M.veia));
  }
  g.userData = { faixas };
  g.position.y = -15;
  return g;
}

/* ========================================================================= */
export function criar() {
  const modelos = [nivelFresta(), nivelTorax({ comSetas: true }), nivelTorax(),
                   nivelGradiente(), nivelZonas()];
  modelos.forEach((m, i) => { m.visible = i === 0; });

  /* A fresta: fina e azul quando a pressão é negativa, grossa e âmbar quando
     alguém furou. O ESPAÇO PLEURAL SÓ VIRA ESPAÇO NO PNEUMOTÓRAX. */
  function aplicarFresta(ppl) {
    const d = modelos[0].userData;
    const positiva = ppl >= 0;
    d.fresta.material = positiva ? M.frestaPos : M.frestaNeg;
    const separacao = positiva ? 2.0 + clamp(ppl,0,12)*.15 : 0;
    d.parede.position.z=separacao;
    const p=d.fresta.geometry.attributes.position,base=d.fresta.userData.repouso;
    for(let i=0;i<p.count;i++) {
      const x=base[i*3],y=base[i*3+1],z=base[i*3+2],curva=-.013*x*x-.004*y*y;
      const t=clamp((z-curva-.40)/.15,0,1);
      p.setZ(i,z+(positiva?separacao+1.4:0)*t);
    }
    p.needsUpdate=true;d.fresta.geometry.computeVertexNormals();
    d.fresta.position.z=positiva?-1.4:0;
    // O espaço expande normal à parede, sem deslocar a membrana visceral.
    d.fresta.visible=positiva;
    d.filme.visible = !positiva;
    d.dentro.position.z=positiva ? -1.4 : 0;
    d.visceral.position.z=d.dentro.position.z;
  }

  /* fração da capacidade total → escala linear: volume vai com o cubo */
  const escalaDe = fracao => Math.cbrt(clamp(fracao, .02, 1.2) / .40);

  function aplicarTorax(nivel, { pulmao, caixa, desvio = 0, forcas = null, ciclo = 1, inspiracao = 0 }) {
    const d = modelos[nivel].userData;
    if (!d || !d.pulmoes) return;
    const ep = escalaDe(pulmao)*(pulmao>=.3?ciclo:1), ec = escalaDe(caixa)*(pulmao>=.3?ciclo:1);
    d.pulmoes.forEach(p => {
      /* só o direito adoece: pneumotórax é de um lado só */
      const doente = p.userData.lado === DIR;
      const e = doente ? ep : escalaDe(0.40)*ciclo;
      p.scale.setScalar(e);
      p.userData.malha.material = (doente && pulmao < .2) ? M.pulmaoColapso : M.pulmao;
      /* o mediastino empurrado: o pulmão bom é deslocado PARA LONGE do lado
         doente — para a esquerda do paciente (+x) */
      p.position.x = p.userData.base.x + (doente ? 0 : ESQ * desvio * 0.026);
    });
    d.caixa.scale.set(ec, 1, ec);
    d.med.position.x = ESQ * desvio * 0.016;
    d.diafragma.traverse(o=>{
      if(!o.isMesh)return;
      const p=o.geometry.attributes.position,base=o.userData.repouso;
      for(let i=0;i<p.count;i++){
        const x=base[i*3],z=base[i*3+2],rho=Math.min(1,Math.hypot(x/.128,(z+.004)/.088));
        p.setY(i,base[i*3+1]-.014*inspiracao*(1-rho*rho));
      }
      p.needsUpdate=true;o.geometry.computeVertexNormals();
    });
    /* a pleura parietal ficou com a parede; o que sobra entre ela e o pulmão
       recolhido é o espaço — e ele é âmbar porque a pressão virou positiva */
    d.pleuras[DIR].material = pulmao < .3 ? M.pleuraAr : M.pleuraP;

    if (d.setas && forcas) {
      /* na parede lateral direita, à altura do 5º espaço, em metros */
      const xParede = DIR * 0.128 * ec, y = 0.17, z = 0.03;
      for (const s of d.setas.children) {
        const v = Math.abs(forcas[s.userData.nome]) * .55 * 0.01;
        s.userData.haste.scale.x = Math.max(.01, v / .01);
        s.userData.ponta.position.x = Math.max(0, v - .02);
        if (s.userData.sinal < 0) { s.position.set(xParede + 0.012, y + 0.009, z); s.rotation.z = 0; }   // pulmão recolhe: para o centro
        else { s.position.set(xParede - 0.008, y - 0.009, z); s.rotation.z = Math.PI; }                 // caixa empurra: para fora
        s.visible = v > .002;
      }
    }
  }

  /* Os alvéolos do nível 04: o raio sai do volume relativo (cubo). Em cm. */
  function aplicarAlveolos(volumeEm) {
    for (const m of modelos[3].userData.alveolos) {
      const v = volumeEm(m.userData.f);
      m.scale.setScalar(.6 + 1.1 * Math.cbrt(clamp(v, 0, 1)));
    }
  }

  /* As faixas do nível 05: cor pela zona, espessura pelo fluxo. */
  function aplicarZonas(zonaEm, fluxoEm) {
    const faixas = modelos[4].userData.faixas;
    const fluxos = faixas.map(m => fluxoEm(m.userData.f));
    const maior = Math.max(.001, ...fluxos);
    faixas.forEach((m, i) => {
      const z = zonaEm(m.userData.f);
      m.material = z === 1 ? M.zona1 : z === 2 ? M.zona2 : M.zona3;
      const e = .45 + 1.5 * (fluxos[i] / maior);
      m.scale.set(1, e, e);
    });
  }

  return { modelos, aplicarFresta, aplicarTorax, aplicarAlveolos, aplicarZonas, N_ALV, N_FAIXA };
}
