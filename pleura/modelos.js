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
  amostraPulmao, unidadeAcinar, redeCapilar, yDiafragmaToracico, raioDiafragma, limiteCardiaco, wT, dT, geoLobos,
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
  pleuraP:    phys('pleura_parietal', { color: CORES.negativa.getHex(), roughness: .15, transparent: true, opacity: .025, depthWrite: false, side: THREE.DoubleSide }),
  pleuraAr:   phys('espaco_pleural_ar', { color: 0xf2d45c, roughness: .6, emissive: cor(115, 92, 15).getHex(), emissiveIntensity: .35,
                 transparent: true, opacity: .30, depthWrite: false, side: THREE.DoubleSide }),
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
  /* nível 01, o corte */
  parede:     phys('parede',     { color: 0xd8b9a6, roughness: .74, sheen: .8, sheenColor: cor(255, 214, 190), transparent: true, opacity: .16, depthWrite: false }),
  musculo:    phys('musculo',    { color: 0xa84f5a, roughness: .7, transparent: true, opacity: .3, depthWrite: false }),
  pleuraV:    phys('pleura_visceral', { color: 0xf0dfe4, roughness: .38, sheen: .9, sheenColor: cor(255, 255, 255), transparent: true, opacity: .52 }),
  pleuraPc:   phys('pleura_parietal_corte', { color: 0xe6d3c8, roughness: .42, sheen: .8, transparent: true, opacity: .36 }),
  liquido:    phys('liquido',    { color: 0xa8dcf0, roughness: .12, sheen: 1, sheenColor: cor(255, 255, 255), transparent: true, opacity: .66 }),
  frestaNeg:  phys('fresta_negativa', { color: CORES.negativa.getHex(), roughness: .4, emissive: cor(6, 24, 60).getHex(), emissiveIntensity: .7, transparent: true, opacity: .5 }),
  frestaPos:  phys('fresta_positiva', { color: CORES.positiva.getHex(), roughness: .4, emissive: cor(70, 34, 0).getHex(), emissiveIntensity: .7, transparent: true, opacity: .5 }),
};

const cacheLobos=new Map();
function materiaisLobos(s,colapso) {
  const key=`${s}:${colapso}`;
  if(!cacheLobos.has(key)) {
    const names=s===DIR?['superior','medio','inferior']:['superior','inferior'];
    const colors=s===DIR?[0xbc8998,0xcb9b88,0x997d9b]:[0xbc8998,0x997d9b];
    cacheLobos.set(key,names.map((nome,i)=>{
      const m=(colapso?M.pulmaoColapso:M.pulmao).clone();m.name=`lobo_${nome}_${s===DIR?'D':'E'}`;
      if(!colapso)m.color.setHex(colors[i]);return m;
    }));
  }
  return cacheLobos.get(key);
}
// Contraste didático normalizado: contínuo, crescente, zero continua zero.
// A física e os volumes exibidos no painel permanecem independentes.
export function escalaAlveolarVisual(volume) {
  const v=clamp(volume,0,1),sig=x=>1/(1+Math.exp(-7*(x-.46)));
  return Math.pow(clamp((sig(v)-sig(0))/(sig(1)-sig(0)),0,1),.60);
}
const elevarEsterno=(p,ec,inspiracao)=>V(p.x*ec,p.y+.005*inspiracao,p.z*ec+.004*inspiracao);
function moverCostelas(costal,ec,inspiracao) {
  for(const rib of costal.children) {
    if(!rib.isGroup) {
      if(!rib.isMesh)continue;
      const pos=rib.geometry.attributes.position,base=rib.userData.repouso;
      for(let i=0;i<pos.count;i++) {
        const v=elevarEsterno(V(base[i*3],base[i*3+1],base[i*3+2]),ec,inspiracao);
        pos.setXYZ(i,v.x/ec,v.y,v.z/ec);
      }
      pos.needsUpdate=true;rib.geometry.computeVertexNormals();rib.geometry.computeBoundingSphere();continue;
    }
    const {lado:s,numero,articulacao}=rib.userData;
    const origin=articulacao.cabeca,axis=articulacao.tuberculo.clone().sub(origin).normalize();
    const graus=(5-3*clamp((numero-3)/7,0,1))*inspiracao;
    rib.userData.angulo=graus;
    for(const m of rib.children) {
      const pos=m.geometry.attributes.position,base=m.userData.repouso,cart=m.material===M.cartilagem;
      for(let i=0;i<pos.count;i++) {
        const original=V(base[i*3],base[i*3+1],base[i*3+2]),radial=original.clone().sub(origin);
        const off=radial.clone().addScaledVector(axis,-radial.dot(axis)).length();
        const t=clamp((off-.012)/.038,0,1),peso=t*t*(3-2*t);
        const v=original.clone();v.x*=1+(ec-1)*peso;v.z*=1+(ec-1)*peso;
        v.sub(origin).applyAxisAngle(axis,-s*graus*Math.PI/180).add(origin);
        if(cart) {
          const anterior=clamp((original.z+.018)/.092,0,1),medial=clamp(1-Math.abs(original.x)/.115,0,1);
          const blend=anterior*medial;
          v.lerp(elevarEsterno(original,ec,inspiracao),blend*blend*(3-2*blend));
        }
        pos.setXYZ(i,v.x/ec,v.y,v.z/ec);
      }
      pos.needsUpdate=true;m.geometry.computeVertexNormals();m.geometry.computeBoundingSphere();
    }
  }
}
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
function nivelTorax() {
  const g = new THREE.Group();
  const cm = emCm(); g.add(cm);

  const caixa = new THREE.Group(); caixa.name = 'caixa';
  const costal=construirCaixa(M),coluna=construirColuna(M);
  caixa.add(costal);
  costal.traverse(o=>{if(o.isMesh)o.userData.repouso=o.geometry.attributes.position.array.slice();});
  const pleuras = {};
  for (const s of [DIR, ESQ]) {
    const m = mk(`pleura_parietal_${s === DIR ? 'D' : 'E'}`, geoPulmao(s, { inflate: .003, fissuras: false, toracico: true }), M.pleuraP);
    m.userData.repouso=m.geometry.attributes.position.array.slice();
    m.renderOrder = 4; m.castShadow = false; caixa.add(m); pleuras[s] = m;
  }
  const med = construirMediastino(M);
  const diafragma=construirDiafragma(M);
  diafragma.traverse(o=>{if(o.isMesh)o.userData.repouso=o.geometry.attributes.position.array.slice();});
  cm.add(caixa, coluna, diafragma, med);

  /* ordem [esquerdo, direito]: o doente é o direito, como na física */
  const pulmoes = [ESQ, DIR].map(s => {
    const p = new THREE.Group(); p.name = `pulmao_${s === DIR ? 'D' : 'E'}`;
    const h = HILO(s); p.position.copy(h);
    const malha = mk(`pulmao_${s === DIR ? 'D' : 'E'}_malha`, geoLobos(s), materiaisLobos(s,false));
    malha.position.copy(h).negate();
    p.add(malha);
    malha.userData.repouso=malha.geometry.attributes.position.array.slice();
    p.userData = { malha, lado: s, base: h.clone() };
    cm.add(p);
    return p;
  });

  g.userData = { caixa, costal, coluna, pulmoes, med, pleuras, diafragma };
  g.position.y = -15;
  return g;
}

/* ── NÍVEL 04 — O GRADIENTE ──────────────────────────────────────────────
   O pulmão direito em vidro, centrado no eixo, e uma coluna de alvéolos do
   ápice à base na parte posterior — onde o pulmão é mais alto. O raio de
   cada um vem da física. */
const N_ALV = 7;
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
  const amostras=Array.from({length:N_ALV},(_,i)=>amostraPulmao(DIR,.25+.70*i/(N_ALV-1)));
  const r=Math.min(.030,...amostras.map(a=>a.folga*.94));
  for (let i = 0; i < N_ALV; i++) {
    const f = i / (N_ALV - 1);
    const a=amostras[i];
    const m=unidadeAcinar(M,r);m.name=`unidade_alveolar_${i+1}`;
    m.position.copy(a.centro);
    m.userData.f = f;
    alveolos.push(m); cm.add(m);
  }
  cm.add(mk('bronquiolo_terminal',tuboGeo(alveolos.map(m=>m.position.clone()),.00115,64),M.traqueia));
  g.userData = { alveolos };
  const envelope=cm.children[0].geometry;
  envelope.computeBoundingBox();
  g.position.y=-(envelope.boundingBox.min.y+envelope.boundingBox.max.y)*50;
  return g;
}

/* ── NÍVEL 05 — AS ZONAS ─────────────────────────────────────────────────
   Redes com a mesma geometria de referência: o contorno do pulmão não pode
   produzir uma falsa diferença de perfusão. A cor identifica a zona. */
const N_FAIXA = 9;
function nivelZonas() {
  const g = new THREE.Group();
  const cm = pulmaoDeVidro(); g.add(cm);
  const faixas = [];
  const amostras=Array.from({length:N_FAIXA},(_,i)=>amostraPulmao(DIR,.25+.70*i/(N_FAIXA-1)));
  // A maior escala é 2; a margem esférica contém toda a rede nesse extremo.
  const rx=Math.min(.022,...amostras.map(a=>a.folga*.44)),rz=rx*.6;
  const referencia=redeCapilar(rx,rz);
  for (let i = 0; i < N_FAIXA; i++) {
    const f = i / (N_FAIXA - 1);
    const a=amostras[i];
    const geo=referencia.clone();
    const m = mk(`capilar_${i + 1}`, geo, M.zona3);
    m.position.copy(a.centro);
    m.userData.f = f; m.userData.rx=rx;
    faixas.push(m); cm.add(m);
  }
  referencia.dispose();
  const vasos=[];
  for(const side of [-1,1]) {
    const pts=faixas.map(m=>m.position.clone().add(V(side*m.userData.rx,0,0)));
    const vaso=mk(side<0?'arteriola_pulmonar':'venula_pulmonar',tuboGeo(pts,.0007,64),side<0?M.arteria:M.veia);
    vaso.geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
    vaso.geometry.attributes.normal.setUsage(THREE.DynamicDrawUsage);
    vaso.userData.side=side;vasos.push(vaso);cm.add(vaso);
  }
  g.userData = { faixas,vasos };
  g.position.y = -15;
  return g;
}

/* ========================================================================= */
export function criar() {
  const modelos = [nivelFresta(), nivelTorax(), nivelTorax(),
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

  function aplicarTorax(nivel, { pulmao, caixa, desvio = 0, ciclo = 1, inspiracao = 0 }) {
    const d = modelos[nivel].userData;
    if (!d || !d.pulmoes) return;
    // Entrar no nível chama atualizar() antes de desenhar e exportar.
    // Fora da cena (análises de geometria), a função continua disponível.
    if(modelos[nivel].parent&&!modelos[nivel].visible)return;
    const ep = escalaDe(pulmao)*(pulmao>=.3?ciclo:1), ec = escalaDe(caixa)*(pulmao>=.3?ciclo:1);
    d.pulmoes.forEach(p => {
      /* só o direito adoece: pneumotórax é de um lado só */
      const doente = p.userData.lado === DIR;
      const e = doente ? ep : escalaDe(0.40)*ciclo;
      p.scale.setScalar(e);
      p.userData.malha.material = materiaisLobos(p.userData.lado,doente && pulmao < .2);
      /* o mediastino empurrado: o pulmão bom é deslocado PARA LONGE do lado
         doente — para a esquerda do paciente (+x) */
      p.position.x = p.userData.base.x + (doente ? 0 : ESQ * desvio * 0.026);
      const pos=p.userData.malha.geometry.attributes.position,base=p.userData.malha.userData.repouso,h=p.userData.base;
      for(let i=0;i<pos.count;i++) {
        let x=p.position.x+(base[i*3]-h.x)*e,y=h.y+(base[i*3+1]-h.y)*e,z=h.z+(base[i*3+2]-h.z)*e;
        if((!doente||pulmao>=.3)&&base[i*3+1]>h.y) {
          const t=clamp((base[i*3+1]-.25)/.055,0,1),peso=1-t*t*(3-2*t);
          y=base[i*3+1]+(base[i*3+1]-h.y)*(e-1)*peso;
        }
        // A expansão continua derivada do volume, mas as bases acompanham
        // a cúpula e a face mediastinal respeita o coração do scan.
        if(!doente||pulmao>=.3)for(let k=0;k<3;k++) {
          y=Math.max(y,yDiafragmaToracico(x/ec,z/ec,inspiracao)+.0022);
          const limite=limiteCardiaco(p.userData.lado,y,z);
          x=p.userData.lado*Math.max(p.userData.lado*x,limite+p.userData.lado*desvio*.016);
          const q=Math.hypot(x/(wT(y)*ec),z/(dT(y)*ec));
          if(q>.97&&y<.283){x*=.97/q;z*=.97/q;}
        }
        pos.setXYZ(i,h.x+(x-p.position.x)/e,h.y+(y-h.y)/e,h.z+(z-h.z)/e);
      }
      pos.needsUpdate=true;p.userData.malha.geometry.computeVertexNormals();
      p.userData.malha.geometry.computeBoundingSphere();
    });
    d.caixa.scale.set(ec, 1, ec);
    moverCostelas(d.costal,ec,inspiracao);
    d.diafragma.scale.set(ec,1,ec);
    d.med.position.x = ESQ * desvio * 0.016;
    for(const s of [DIR,ESQ]) {
      const m=d.pleuras[s],p=m.geometry.attributes.position,base=m.userData.repouso,h=HILO(s);
      for(let i=0;i<p.count;i++) {
        let x=h.x+(base[i*3]-h.x)*ec,y=h.y+(base[i*3+1]-h.y)*ec,z=h.z+(base[i*3+2]-h.z)*ec;
        if(base[i*3+1]>h.y) {
          const t=clamp((base[i*3+1]-.25)/.055,0,1),peso=1-t*t*(3-2*t);
          y=base[i*3+1]+(base[i*3+1]-h.y)*(ec-1)*peso;
        }
        for(let k=0;k<3;k++) {
          y=Math.max(y,yDiafragmaToracico(x/ec,z/ec,inspiracao)+.0007);
          x=s*Math.max(s*x,limiteCardiaco(s,y,z)-.002+s*desvio*.016);
          const q=Math.hypot(x/(wT(y)*ec),z/(dT(y)*ec));
          if(q>.985&&y<.283){x*=.985/q;z*=.985/q;}
        }
        if(i<18*112||i===p.count-2)y=yDiafragmaToracico(x/ec,z/ec,inspiracao)+.0007;
        // A caixa já fornece a escala ec. Compensa-a para manter o limite
        // mediastinal no lado externo do pulmão também durante a inspiração.
        p.setXYZ(i,x/ec,y,z/ec);
      }
      p.needsUpdate=true;m.geometry.computeVertexNormals();m.geometry.computeBoundingSphere();
    }
    d.diafragma.traverse(o=>{
      if(!o.isMesh)return;
      const p=o.geometry.attributes.position,base=o.userData.repouso;
      for(let i=0;i<p.count;i++){
        const x=base[i*3],z=base[i*3+2],rho=raioDiafragma(x,z).rho;
        p.setY(i,base[i*3+1]-.014*inspiracao*(1-rho*rho));
      }
      p.needsUpdate=true;o.geometry.computeVertexNormals();
    });
    /* a pleura parietal ficou com a parede; o que sobra entre ela e o pulmão
       recolhido é o espaço — e ele é âmbar porque a pressão virou positiva */
    d.pleuras[DIR].material = pulmao < .3 ? M.pleuraAr : M.pleuraP;

  }

  /* Os alvéolos do nível 04: o raio sai do volume relativo (cubo). Em cm. */
  function aplicarAlveolos(volumeEm) {
    for (const m of modelos[3].userData.alveolos) {
      const v = volumeEm(m.userData.f);
      m.scale.setScalar(escalaAlveolarVisual(v));
    }
  }

  /* Cor pela zona; tamanho pelo fluxo, numa referência fixa entre cenários. */
  function aplicarZonas(zonaEm, fluxoEm, fluxoReferencia=1) {
    const {faixas,vasos} = modelos[4].userData;
    const fluxos = faixas.map(m => fluxoEm(m.userData.f));
    const referencia=Math.max(.001,fluxoReferencia);
    let mudou=false;
    faixas.forEach((m, i) => {
      const z = zonaEm(m.userData.f);
      m.material = z === 1 ? M.zona1 : z === 2 ? M.zona2 : M.zona3;
      const e = .35 + 1.65 * clamp(fluxos[i] / referencia,0,1);
      mudou ||= m.scale.x!==e;
      m.scale.setScalar(e);
    });
    if(mudou)for(const vaso of vasos) {
      // Mantém a geometria e os buffers GPU durante a respiração.
      const geo=vaso.geometry,{path,tubularSegments,radius,radialSegments}=geo.parameters;
      path.points.forEach((p,i)=>{const m=faixas[i];p.copy(m.position);p.x+=vaso.userData.side*m.userData.rx*m.scale.x;});
      path.updateArcLengths();
      const frames=path.computeFrenetFrames(tubularSegments,false);
      const pos=geo.attributes.position,norm=geo.attributes.normal,ponto=V(),normal=V();
      for(let i=0;i<=tubularSegments;i++) {
        path.getPointAt(i/tubularSegments,ponto);
        for(let j=0;j<=radialSegments;j++) {
          const ang=j/radialSegments*Math.PI*2,k=i*(radialSegments+1)+j;
          normal.copy(frames.normals[i]).multiplyScalar(-Math.cos(ang)).addScaledVector(frames.binormals[i],Math.sin(ang)).normalize();
          norm.setXYZ(k,normal.x,normal.y,normal.z);
          pos.setXYZ(k,ponto.x+radius*normal.x,ponto.y+radius*normal.y,ponto.z+radius*normal.z);
        }
      }
      geo.tangents=frames.tangents;geo.normals=frames.normals;geo.binormals=frames.binormals;
      pos.needsUpdate=true;norm.needsUpdate=true;
      geo.computeBoundingBox();geo.computeBoundingSphere();
    }
  }

  return { modelos, aplicarFresta, aplicarTorax, aplicarAlveolos, aplicarZonas, N_ALV, N_FAIXA };
}
