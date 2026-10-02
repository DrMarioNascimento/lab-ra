/* ============================================================================
   ANATOMIA DO TÓRAX · geometria compartilhada (metros, y para cima, +z é a
   frente). Lado DIREITO do paciente em x NEGATIVO: visto de frente, fica à
   esquerda de quem olha, como numa radiografia. Nada de DOM, nada de física.
   ========================================================================== */
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const DIR = -1, ESQ = 1;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const gauss = (v, c, s) => Math.exp(-(((v - c) / s) ** 2));
const lado = s => (s === DIR ? 'D' : 'E');

export const mk = (name, geo, mat) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.castShadow = m.receiveShadow = true; return m; };

// Agrupa por tecido para manter a anatomia detalhada leve no celular.
function compactar(g) {
  const buckets=new Map();g.updateMatrixWorld(true);
  for(const m of g.children) {
    if(!m.isMesh)continue;
    const geo=m.geometry.clone().applyMatrix4(m.matrix);geo.deleteAttribute('uv');
    if(!buckets.has(m.material))buckets.set(m.material,{geos:[],nomes:[]});
    buckets.get(m.material).geos.push(geo);buckets.get(m.material).nomes.push(m.name);
  }
  const children=[...g.children];g.clear();
  for(const [mat,{geos,nomes}] of buckets) {
    const m=mk(`${g.name}_${mat.name}`,mergeGeometries(geos),mat);m.userData.partes=nomes;g.add(m);
    geos.forEach(geo=>geo.dispose());
  }
  children.forEach(m=>{if(m.isMesh)m.geometry.dispose();else g.add(m)});
  return g;
}

/* ── O envelope do tórax: meia-largura e meio-fundo por altura ─────────── */
const tabela = pts => y => {
  if (y <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [y0, v0] = pts[i], [y1, v1] = pts[i + 1];
    if (y <= y1) { const k = (1 - Math.cos(Math.PI * (y - y0) / (y1 - y0))) / 2; return v0 + (v1 - v0) * k; }
  }
  return pts[pts.length - 1][1];
};
export const wT = tabela([[0, .122], [.09, .14], [.18, .128], [.25, .095], [.30, .055], [.34, .045]]);
export const dT = tabela([[0, .094], [.09, .10], [.18, .094], [.25, .072], [.30, .042], [.34, .035]]);
export const wIn = y => wT(y) - .012, dIn = y => dT(y) - .012;
export const zS = y => -dT(y) * .80;            // o corpo vertebral invade o tórax por trás

/* ── Loft: anéis de pontos → superfície, orientada para fora quando fechada ── */
export function loft(rings, caps = [true, true]) {
  const n = rings.length, k = rings[0].length, pos = [], idx = [];
  for (const r of rings) for (const p of r) pos.push(p.x, p.y, p.z);
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < k; j++) {
    const a = i * k + j, b = i * k + (j + 1) % k;
    idx.push(a, b, a + k, b, b + k, a + k);
  }
  let base = n * k;
  const centro = r => { const c = new THREE.Vector3(); r.forEach(p => c.add(p)); return c.multiplyScalar(1 / r.length); };
  if (caps[0]) { const c = centro(rings[0]); pos.push(c.x, c.y, c.z); for (let j = 0; j < k; j++) idx.push(base, (j + 1) % k, j); base++; }
  if (caps[1]) { const c = centro(rings[n - 1]); pos.push(c.x, c.y, c.z); const o = (n - 1) * k; for (let j = 0; j < k; j++) idx.push(base, o + j, o + (j + 1) % k); base++; }
  if (caps[0] && caps[1]) {
    let vol = 0; const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();
    for (let i = 0; i < idx.length; i += 3) { A.fromArray(pos, idx[i] * 3); B.fromArray(pos, idx[i + 1] * 3); C.fromArray(pos, idx[i + 2] * 3); vol += A.dot(B.cross(C)); }
    if (vol < 0) for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
/* fita varrida ao longo de uma curva, seção elíptica alinhada à parede torácica */
function fita(curve, t0, t1, perfil, n = 40, k = 12) {
  const rings = [];
  for (let i = 0; i <= n; i++) {
    const t = t0 + (t1 - t0) * i / n;
    const p = curve.getPointAt(t), T = curve.getTangentAt(t);
    const N = V(p.x, 0, p.z).normalize(); N.addScaledVector(T, -N.dot(T)).normalize();
    const B = new THREE.Vector3().crossVectors(T, N);
    const { h, w } = perfil(t), r = [];
    for (let j = 0; j < k; j++) { const a = j / k * Math.PI * 2; r.push(p.clone().addScaledVector(N, w * Math.cos(a)).addScaledVector(B, h * Math.sin(a))); }
    rings.push(r);
  }
  return loft(rings);
}
export const tuboGeo = (pts, r, seg = 24) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 14, false);

/* Superfícies de tecido com variação suave, sem facetas ou esferas perfeitas.
   A deformação é determinística e permanece na geometria exportada para RA. */
export function tecidoGeo(rx, ry, rz, detalhe = .018) {
  const g = new THREE.SphereGeometry(1, 28, 20), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = 1 + detalhe * Math.sin(x * 8 + y * 5) * Math.sin(z * 7 - y * 4);
    p.setXYZ(i, x * rx * k, y * ry * k, z * rz * k);
  }
  g.computeVertexNormals(); return g;
}

/* Um fragmento curvo da parede costal, com espessura e faces de corte reais. */
export function fragmentoGeo(z0, z1, largura = 24, altura = 18, centroX = 0) {
  const p = [], idx = [], nx = 48, ny = 30;
  const curvatura = (x, y) => -.013 * x * x - .004 * y * y;
  for (const z of [z0, z1]) for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
    const y = (j / ny - .5) * altura;
    const organic = .88 + .12 * Math.sin(Math.PI*j/ny)**.7;
    const x = (centroX + (i / nx - .5) * largura)*organic+.10*Math.sin(y*.53);
    p.push(x, y, z + curvatura(x, y));
  }
  const n = (nx + 1) * (ny + 1), at = (i, j) => j * (nx + 1) + i;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const a = at(i, j), b = a + 1, c = at(i, j + 1), d = c + 1;
    idx.push(a, c, b, b, c, d, a + n, b + n, c + n, b + n, d + n, c + n);
  }
  const borda = [];
  for (let i = 0; i <= nx; i++) borda.push(at(i, 0));
  for (let j = 1; j <= ny; j++) borda.push(at(nx, j));
  for (let i = nx - 1; i >= 0; i--) borda.push(at(i, ny));
  for (let j = ny - 1; j > 0; j--) borda.push(at(0, j));
  for (let i = 0; i < borda.length; i++) {
    const a = borda[i], b = borda[(i + 1) % borda.length];
    idx.push(a, b, a + n, b, b + n, a + n);
  }
  const g = new THREE.BufferGeometry();g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));g.setIndex(idx);g.computeVertexNormals();return g;
}

/* ── Coluna: C7, T1–T12, L1–L2 ──────────────────────────────────────────── */
export const yPost = j => 0.283 - j * 0.0205;     // altura posterior da costela j (0 = 1ª)
// Cabeça, colo e tubérculo usam os mesmos pontos que as facetas vertebrais.
export function articulacaoCostal(s,j) {
  const y=yPost(j),r=.013+j*.0006,h=.0155+j*.00027;
  const yy=j>0&&j<9?y+h/2+.001:y;
  return {cabeca:V(s*r*.94,yy,zS(yy)-r*.22),
    tuberculo:V(s*(j<10?.029:.022),y+.001,zS(y)-r*.55-.005)};
}
// Seção óssea achatada, afilada nas pontas; eixo contínuo e sem cilindros.
function processoGeo(pts,largura,altura) {
  const curve=new THREE.CatmullRomCurve3(pts),rings=[];
  for(let i=0;i<=20;i++) {
    const t=i/20,p=curve.getPoint(t),T=curve.getTangent(t);
    const N=V(1,0,0);N.addScaledVector(T,-N.dot(T)).normalize();
    if(N.lengthSq()<.01)N.set(0,1,0);
    const B=new THREE.Vector3().crossVectors(T,N).normalize();
    const k=.22+.78*Math.sin(Math.PI*(.16+.84*t))**.65;
    rings.push(Array.from({length:16},(_,j)=>{const a=j/16*Math.PI*2;
      return p.clone().addScaledVector(N,largura*k*Math.cos(a)).addScaledVector(B,altura*k*Math.sin(a));}));
  }
  return loft(rings);
}
export function construirColuna(M) {
  const g = new THREE.Group(); g.name = 'coluna';
  const vertebras = [['C7', 0.3035, 0.012, 0.014]];
  for (let j = 0; j < 12; j++) vertebras.push([`T${j + 1}`, yPost(j), 0.013 + j * 0.0006, 0.0155+j*.00027]);
  vertebras.push(['L1', 0.0345, 0.0205, 0.0195], ['L2', 0.0105, 0.021, 0.02]);
  for (let v=0;v<vertebras.length;v++) {
    const [n, y, r, h] = vertebras[v];
    const z = zS(y);
    const rings = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10, cintura = 1 - .10 * Math.sin(Math.PI * t), ring = [];
      for (let k = 0; k < 32; k++) {
        const a = k / 32 * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a);
        ring.push(V(Math.sign(c) * Math.abs(c) ** .65 * r * cintura, (t - .5) * h,
          Math.sign(sn) * Math.abs(sn) ** .75 * r * .82 * cintura));
      }
      rings.push(ring);
    }
    const corpo = mk(`corpo_${n}`, loft(rings), M.osso); corpo.position.set(0, y, z);
    if(v+1<vertebras.length) {
      const [,yn,rn,hn]=vertebras[v+1],superior=y-h/2,inferior=yn+hn/2;
      const discos=[];
      for(let k=0;k<=6;k++) {
        const t=k/6,yy=inferior+(superior-inferior)*t,rr=(rn+(r-rn)*t)*(.96+.035*Math.sin(Math.PI*t));
        discos.push(Array.from({length:32},(_,a)=>{const th=a/32*Math.PI*2;return V(Math.sign(Math.cos(th))*Math.abs(Math.cos(th))**.65*rr,yy,zS(yy)+Math.sign(Math.sin(th))*Math.abs(Math.sin(th))**.75*rr*.82);}));
      }
      g.add(mk(`disco_${n}_${vertebras[v+1][0]}`,loft(discos),M.disco));
    }
    g.add(corpo);
    const toracica=n.startsWith('T'),j=toracica?Number(n.slice(1))-1:-1;
    const meio=toracica?gauss(j,5.5,3.4):0;
    const base=V(0,y-.002,z-r*.80-.018);
    // Pedículos e lâminas delimitam o canal, em vez de um meio-toro isolado.
    for(const sign of [DIR,ESQ]) {
      const ped=V(sign*r*.66,y+.002,z-r*.68);
      const jun=V(sign*.012,y+.001,z-r*.80-.012);
      g.add(mk(`pediculo_${lado(sign)}_${n}`,processoGeo([
        V(sign*r*.62,y,z-r*.45),ped,jun],.004,.0038),M.osso));
      g.add(mk(`lamina_${lado(sign)}_${n}`,processoGeo([jun,
        V(sign*.006,y,z-r*.80-.018),base],.0045,.003),M.osso));
      const ponta=toracica?articulacaoCostal(sign,j).tuberculo.clone():V(sign*.029,y,z-r*.72-.005);
      // A faceta fica na face anterior do processo, encostada ao tubérculo.
      const osso=ponta.clone();osso.z-=.0025;
      g.add(mk(`transverso_${lado(sign)}_${n}`,processoGeo([jun,
        V(sign*.019,y+.002,z-r*.65-.009),osso],.0042,.0034),M.osso));
      for(const sup of [-1,1]) {
        const art=mk(`articular_${sup>0?'superior':'inferior'}_${lado(sign)}_${n}`,
          tecidoGeo(.004,.0045,.0028,.01),M.osso);
        art.position.set(sign*.010,y+sup*h*.43,z-r*.80-.012);g.add(art);
      }
      if(toracica) {
        const {cabeca,tuberculo}=articulacaoCostal(sign,j);
        const faceta=mk(`faceta_costovertebral_${lado(sign)}_${n}`,tecidoGeo(.0015,.004,.003),M.cartilagem);
        faceta.position.copy(cabeca);g.add(faceta);
        if(j<10) {
          const ft=mk(`faceta_costotransversa_${lado(sign)}_${n}`,tecidoGeo(.0037,.003,.0012),M.cartilagem);
          ft.position.copy(tuberculo).add(V(0,0,-.0009));g.add(ft);
        }
      }
    }
    // T4–T8: longa lâmina inclinada caudalmente; extremidades de transição
    // menos oblíquas. A base larga se continua com ambas as lâminas.
    const comprimento=toracica?.018+.006*meio:n==='C7'?.022:.016;
    const queda=toracica?.007+.012*meio:n==='C7'?.006:.003;
    g.add(mk(`espinhosa_${n}`,processoGeo([base,
      V(0,y-.003-queda*.35,base.z-comprimento*.43),
      V(0,y-queda,base.z-comprimento)],toracica?.004:.0055,toracica?.0045:.005),M.osso));
  }
  return compactar(g);
}

/* ── Caixa torácica: costelas em fita, cartilagens, esterno, clavículas ──── */
const ESTERNAL = [0.268, 0.246, 0.224, 0.202, 0.182, 0.164, 0.148];   // onde 1–7 chegam ao esterno
const MARGEM = [[0.045, 0.138], [0.075, 0.116], [0.1, 0.092]];        // 8–10 na margem costal
const DIP = [0.004, 0.009, 0.015, 0.021, 0.027, 0.033, 0.038, 0.044, 0.046, 0.04];
const ESTERNO = [[.118,.0015],[.128,.004],[.142,.009],[.16,.010],[.18,.012],[.20,.012],[.22,.014],[.236,.013],[.244,.013],[.251,.014],[.268,.020],[.279,.023],[.287,.019]];
const larguraEsterno=tabela(ESTERNO);
const insercaoEsternal=(s,y)=>V(s*(larguraEsterno(y)-.0012),y,dT(y)-.0055);
// Margem cartilaginosa contínua: 8–10 encontram a cartilagem acima,
// que finalmente alcança a 7ª inserção no esterno.
const arcoCostal=s=>[insercaoEsternal(s,ESTERNAL[6]),...MARGEM.map(([x,y])=>V(s*x,y,dT(y)*Math.sqrt(1-(x/wT(y))**2)))];
function costela(g, M, s, j) {
  const yP = yPost(j), flutuante = j >= 10;
  let xEnd, yA;
  if (j < 7) { yA = ESTERNAL[j]; xEnd = larguraEsterno(yA)-.0012; }
  else if (j < 10) { [xEnd, yA] = MARGEM[j - 7]; }
  else { yA = yP - (j === 10 ? 0.03 : 0.018); }
  const theta1 = flutuante ? (j === 10 ? 0.46 : 0.31) * Math.PI : Math.PI - Math.asin(xEnd / wT(yA));
  const theta0 = Math.asin(0.03 / wT(yP)) + 0.15;
  const tj = flutuante ? 1 : 0.88 - j * 0.018;
  const dip = flutuante ? 0 : DIP[j];
  const {cabeca,tuberculo}=articulacaoCostal(s,j);
  const pts = [cabeca,cabeca.clone().lerp(tuberculo,.52),tuberculo];
  const head=mk(`cabeca_costela_${lado(s)}_${j+1}`,tecidoGeo(.0028,.0038,.0032,.01),M.osso);
  head.position.copy(cabeca).add(V(s*.001,0,.001));g.add(head);
  if(!flutuante){const tub=mk(`tuberculo_costela_${lado(s)}_${j+1}`,tecidoGeo(.0035,.003,.0026,.01),M.osso);
    tub.position.copy(tuberculo).add(V(0,0,.0012));g.add(tub);}
  for (let i = 0; i <= 16; i++) {
    const t = i / 16, th = theta0 + (theta1 - theta0) * t;
    const y = yP + (yA - yP) * Math.pow(t, 1.35) - dip * gauss(t, tj, 0.2);
    pts.push(V(s * wT(y) * Math.sin(th), y, -dT(y) * Math.cos(th)));
  }
  if(j<7)pts[pts.length-1]=insercaoEsternal(s,yA);
  else if(!flutuante)pts[pts.length-1]=arcoCostal(s)[j-6].clone();
  const curva = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const hb = j === 0 ? 0.0034 : j === 1 ? 0.0046 : flutuante ? 0.0028 : 0.0046;
  const wb = j === 0 ? 0.0068 : j === 1 ? 0.0038 : flutuante ? 0.0026 : 0.0029;
  const perfil = t => { const k = flutuante ? .10+.90*Math.pow(1-t,.65) : 1; const q = 0.6 + 0.4 * Math.pow(Math.sin(Math.PI * clamp(t / tj, 0, 1)), .4); return { h: hb * q * k, w: wb * (0.8 + 0.2 * q) * k }; };
  // A frente direita fica translúcida, mantendo todas as articulações.
  // Os segmentos posteriores continuam opacos para delimitar o pulmão.
  const janela=false;
  const janelaOsso=M.ossoJanela||M.osso,janelaCart=M.cartilagemJanela||M.cartilagem;
  const corte=janela?Math.min(.60,tj):tj;
  g.add(mk(`costela_${lado(s)}_${j+1}_posterior`,fita(curva,0,corte,perfil,48),M.osso));
  if(janela)g.add(mk(`costela_${lado(s)}_${j+1}_anterior`,fita(curva,corte,tj,perfil,24),janelaOsso));
  if (!flutuante) g.add(mk(`cartilagem_${lado(s)}_${j + 1}`, fita(curva, tj - 0.01, 1, () => ({ h: 0.0038, w: 0.0030 }), 28), janela?janelaCart:M.cartilagem));
}
export function construirCaixa(M) {
  const g = new THREE.Group(); g.name = 'caixa_toracica';
  for (let j = 0; j < 12; j++) for(const sign of [DIR,ESQ]) {
    const rib=new THREE.Group();rib.name=`costela_articulada_${lado(sign)}_${j+1}`;
    costela(rib,M,sign,j);compactar(rib);
    rib.userData={lado:sign,numero:j+1,articulacao:articulacaoCostal(sign,j)};
    g.add(rib);
  }
  for(const s of [DIR,ESQ])g.add(mk(`margem_costal_${lado(s)}`,tuboGeo(arcoCostal(s),.0033,48),M.cartilagem));
  const perfil = [...ESTERNO].reverse();
  const rings = perfil.map(([y, hw]) => {
    const z0 = dT(y) - 0.0055, r = [];
    for (let j = 0; j < 20; j++) {
      const a = j / 20 * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a);
      r.push(V(Math.sign(c) * Math.pow(Math.abs(c), .65) * hw, y, z0 + Math.sign(sn) * Math.pow(Math.abs(sn), .65) * 0.0038));
    }
    return r;
  });
  g.add(mk('esterno', loft(rings), M.osso));
  for (const s of [DIR, ESQ]) {
    const raiz=insercaoEsternal(s,.283);
    g.add(mk(`articulacao_esternoclavicular_${lado(s)}`,tecidoGeo(.0045,.005,.0045),M.cartilagem));
    g.children[g.children.length-1].position.copy(raiz);
    g.add(mk(`clavicula_${lado(s)}`,tuboGeo([raiz,V(s*.041,.288,.052),V(s*.072,.291,.052),V(s*.101,.292,.038),V(s*.128,.285,.028)],.0043,40),M.osso));
  }
  return compactar(g);
}

/* ── Diafragma: duas cúpulas, a direita mais alta (fígado); rebordo baixo
   atrás, alto na frente ───────────────────────────────────────────────── */
const W_r = 0.128, D_r = 0.088, ZD = -0.004;
const apexY = x => 0.12 + 0.055 * gauss(x, DIR * 0.055, 0.06) + 0.045 * gauss(x, ESQ * 0.06, 0.06);
export function yDiafragma(x, z) {
  const zz = z - ZD; let rho = Math.hypot(x / W_r, zz / D_r);
  const cosT = rho > 1e-6 ? clamp(-zz / (rho * D_r), -1, 1) : 0;
  rho = Math.min(1, rho);
  const rim = 0.045 + 0.085 * (1 - cosT) / 2;
  return rim + (apexY(x) - rim) * (1 - Math.pow(rho, 2.6));
}
// Superfície macroscópica: margem costal variável, duas cúpulas e sela
// central. O perfil didático do gradiente permanece independente e intacto.
const rimDia=th=>.042+.078*(1-Math.cos(th))/2;
function pontoDia(rho,th) {
  const rim=rimDia(th),w=wT(rim)-.011,d=dT(rim)-.010;
  return V(rho*w*Math.sin(th),0,ZD-rho*d*Math.cos(th));
}
export function raioDiafragma(x,z) {
  let th=Math.atan2(x/.128,-(z-ZD)/.088);
  for(let i=0;i<3;i++){const rim=rimDia(th);th=Math.atan2(x/(wT(rim)-.011),-(z-ZD)/(dT(rim)-.010));}
  const rim=rimDia(th);
  return {rho:Math.min(1,Math.hypot(x/(wT(rim)-.011),(z-ZD)/(dT(rim)-.010))),th,rim};
}
export function yDiafragmaToracico(x,z,inspiracao=0) {
  const {rho,rim}=raioDiafragma(x,z);
  const sela=.011*gauss(x,.006,.024)*gauss(z,.012,.043);
  const teto=.119+.055*gauss(x,-.059,.062)+.043*gauss(x,.066,.06)-sela;
  return rim+(teto-rim)*(1-rho**2.4)-.014*inspiracao*(1-rho*rho);
}
export function construirDiafragma(M) {
  const rings=[];
  for(let i=1;i<=32;i++)rings.push(Array.from({length:96},(_,j)=>{
    const p=pontoDia(i/32,j/96*Math.PI*2);p.y=yDiafragmaToracico(p.x,p.z);return p;}));
  const grupo=new THREE.Group();grupo.name='diafragma';
  grupo.add(mk('musculo_diafragmatico',loft(rings,[true,false]),M.diafragma));
  const inferior=rings.map(r=>r.map(p=>p.clone().add(V(0,-.0018,0))));
  grupo.add(mk('face_abdominal_diafragma',loft(inferior,[true,false]),M.diafragma));
  grupo.add(mk('rebordo_diafragmatico',loft([rings.at(-1),inferior.at(-1)],[false,false]),M.diafragma));
  const tendon=[];
  for(let i=1;i<=18;i++)tendon.push(Array.from({length:96},(_,j)=>{
    const t=j/96*Math.PI*2,r=i/18,trevo=1+.20*Math.cos(3*t-.35);
    const x=r*.043*trevo*Math.sin(t),z=.010+r*.027*trevo*Math.cos(t);
    return V(x,yDiafragmaToracico(x,z)+.0005,z);}));
  grupo.add(mk('tendao_central_trilobado',loft(tendon,[true,false]),M.tendao||M.cartilagem));
  for(let j=0;j<48;j++) {
    const th=j/48*Math.PI*2,pts=[];
    for(let i=0;i<=18;i++){const p=pontoDia(.37+i/18*.60,th+.07*Math.sin(i/18*Math.PI));
      p.y=yDiafragmaToracico(p.x,p.z)+.0005;pts.push(p);}
    grupo.add(mk(`fibra_diafragma_${j}`,tuboGeo(pts,.00022,26),M.fibra||M.diafragma));
  }
  // Pilares posteriores descendo até os corpos lombares, sem falsos tubos.
  for(const sign of [DIR,ESQ]) {
    const yy=sign===DIR?.019:.035;
    const p=V(sign*.017,.073,-.064);
    p.y=yDiafragmaToracico(p.x,p.z)-.002;
    grupo.add(mk(`pilar_diafragma_${lado(sign)}`,processoGeo([
      V(sign*.016,yy,zS(yy)+.013),V(sign*.020,.068,-.059),p],.0045,.0035),M.diafragma));
  }
  return compactar(grupo);
}

/* ── Pulmão: superfície paramétrica — base côncava sobre o diafragma, face
   costal seguindo as costelas, face mediastinal plana, ápice arredondado,
   fissura oblíqua (e horizontal à direita), chanfradura cardíaca à esquerda ── */
export const HILO = s => V(s * 0.03, 0.21, -0.012);
const medias = s => y => 0.02 + (s === ESQ ? 0.03 : 0.016) * gauss(y, 0.195, 0.045);
/* meia-largura e centro x do pulmão numa altura: serve às faixas do nível 05 */
export function secaoPulmao(s, y) {
  const m = medias(s)(y), a = Math.max(0.004, (wIn(y) - m) / 2);
  return { xc: s * (m + a), a };
}
export function geoPulmao(s, { inflate = 0, fissuras = true, assoalho = 0.012, toracico = false } = {}) {
  if(toracico)return geoPulmaoToracico(s,{inflate,fissuras});
  const yApex = (s === DIR ? 0.306 : 0.299) + inflate, K = 96, NB = 14, NW = 76, ZC = -0.008;
  const med = medias(s);
  const ponto = (y, phi, R) => {
    const m = med(y), a = Math.max(0.004, (wIn(y) - m) / 2 + inflate), xc = m + a - inflate;
    const dI = dIn(y) + inflate, bAnt = dI * .74, bPost = dI * .92;
    const c = Math.cos(phi), sn = Math.sin(phi), nx = c > 0 ? 2 : 3.4;
    let px = Math.sign(c) * Math.pow(Math.abs(c), 2 / nx) * a * R;
    let pz = Math.sign(sn) * Math.pow(Math.abs(sn), 2 / 2.3) * (sn > 0 ? bAnt : bPost) * R;
    if (s === ESQ) px += 0.022 * gauss(y, 0.172, 0.03) * clamp((sn - .2) / .6, 0, 1) * clamp(-c * 1.5, 0, 1) * R;
    // A parede costal é elíptica, não um retângulo arredondado. Restringe
    // a face posterior/lateral e reserva espaço para corpos vertebrais.
    const x=s*(xc+px),w=wT(y)-.007+inflate,d=dT(y)-.007+inflate;
    const alcance=d*Math.sqrt(Math.max(.002,1-(x/w)**2));
    const posterior=Math.max(-alcance+.002,zS(y)+.016*gauss(x,0,.029));
    const z=clamp(ZC+pz,posterior,alcance-.002);
    pz=z-ZC;
    return { x: s * (xc + px), z: ZC + pz, xc: s * xc, pz };
  };
  const yBase = [];
  for (let j = 0; j < K; j++) {
    const phi = j / K * Math.PI * 2; let y = 0.1;
    for (let it = 0; it < 3; it++) { const p = ponto(y, phi, 1); y = yDiafragma(p.x, p.z) + assoalho; }
    yBase.push(y);
  }
  const rings = [];
  for (let i = 1; i <= NB; i++) {
    const rho = i / NB, r = [];
    for (let j = 0; j < K; j++) {
      const per = ponto(yBase[j], j / K * Math.PI * 2, 1);
      const x = per.xc + (per.x - per.xc) * rho, z = ZC + per.pz * rho;
      r.push(V(x, yDiafragma(x, z) + assoalho, z));
    }
    rings.push(r);
  }
  for (let i = 1; i < NW; i++) {
    const v = i / NW, r = [];
    const R = v < .62 ? 1 : Math.sqrt(Math.max(0, 1 - ((v - .62) / .38) ** 2));
    for (let j = 0; j < K; j++) {
      const y = yBase[j] + (yApex - yBase[j]) * v;
      const p = ponto(y, j / K * Math.PI * 2, R);
      let x = p.x, z = p.z;
      if (fissuras && R > .3) {
        const f = (y - 0.18) + 0.8 * (z - ZC);
        let g = gauss(f, 0, 0.0025);
        if (s === DIR && f > 0.004 && z > -.025) g = Math.max(g, gauss(y, 0.207, 0.0022));
        const k = 1 - 0.045 * g;
        x = p.xc + (x - p.xc) * k; z = ZC + (z - ZC) * k;
      }
      r.push(V(x, y, z));
    }
    rings.push(r);
  }
  const geo = loft(rings), pos = geo.attributes.position, colors = [];
  for (let i=0;i<pos.count;i++) {
    const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
    const grain = .93 + .055*Math.sin(x*680+y*410)*Math.sin(z*720-y*370);
    const fissure = fissuras ? gauss((y-.18)+.8*(z-ZC),0,.002) : 0;
    const inferior=(y-.18)+.8*(z-ZC)<0;
    const medio=s===DIR&&!inferior&&y<.207&&z>-.025;
    colors.push((grain-.17*fissure)*(inferior?.87:1),(grain-.22*fissure)*(medio?.88:1),(grain-.19*fissure)*(inferior?1:medio?.94:.98));
  }
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  return geo;
}

// Impressão cardíaca derivada da superfície do scan, em secções y/z.
let envelopeCardiaco;
function indexarCoracao(g) {
  const passo=.0015,bb=new THREE.Box3().setFromObject(g);
  const y0=bb.min.y-.007,z0=bb.min.z-.007;
  const ny=Math.ceil((bb.max.y-y0+.007)/passo)+1,nz=Math.ceil((bb.max.z-z0+.007)/passo)+1;
  const min=new Float32Array(ny*nz).fill(Infinity),max=new Float32Array(ny*nz).fill(-Infinity);
  g.updateMatrixWorld(true);
  for(const m of g.children){const p=m.geometry.attributes.position,idx=m.geometry.index;
    const a=V(0,0,0),b=V(0,0,0),c=V(0,0,0);
    for(let k=0;k<(idx?.count||p.count);k+=3) {
      a.fromBufferAttribute(p,idx?idx.getX(k):k).applyMatrix4(m.matrixWorld);
      b.fromBufferAttribute(p,idx?idx.getX(k+1):k+1).applyMatrix4(m.matrixWorld);
      c.fromBufferAttribute(p,idx?idx.getX(k+2):k+2).applyMatrix4(m.matrixWorld);
      const det=(b.y-c.y)*(a.z-c.z)+(c.z-b.z)*(a.y-c.y);if(Math.abs(det)<1e-12)continue;
      const iy0=Math.max(0,Math.floor((Math.min(a.y,b.y,c.y)-y0)/passo)),iy1=Math.min(ny-1,Math.ceil((Math.max(a.y,b.y,c.y)-y0)/passo));
      const iz0=Math.max(0,Math.floor((Math.min(a.z,b.z,c.z)-z0)/passo)),iz1=Math.min(nz-1,Math.ceil((Math.max(a.z,b.z,c.z)-z0)/passo));
      for(let iy=iy0;iy<=iy1;iy++)for(let iz=iz0;iz<=iz1;iz++) {
        const y=y0+iy*passo,z=z0+iz*passo;
        const u=((b.y-c.y)*(z-c.z)+(c.z-b.z)*(y-c.y))/det;
        const v=((c.y-a.y)*(z-c.z)+(a.z-c.z)*(y-c.y))/det;
        if(u<0||v<0||u+v>1)continue;
        const x=u*a.x+v*b.x+(1-u-v)*c.x,t=iy*nz+iz;
        min[t]=Math.min(min[t],x);max[t]=Math.max(max[t],x);
      }
    }
  }
  const campos=[DIR,ESQ].map(s=>{
    const campo=new Float32Array(ny*nz);
    for(let iy=0;iy<ny;iy++)for(let iz=0;iz<nz;iz++) {
      let limite=s===ESQ?.017:.013;
      for(let dy=-4;dy<=4;dy++)for(let dz=-4;dz<=4;dz++) {
        const yy=iy+dy,zz=iz+dz;if(yy<0||yy>=ny||zz<0||zz>=nz)continue;
        const v=s===ESQ?max[yy*nz+zz]:-min[yy*nz+zz];
        limite=Math.max(limite,v+.004-(dy*dy+dz*dz)*passo*passo/.004);
      }
      campo[iy*nz+iz]=limite;
    }
    return campo;
  });
  envelopeCardiaco={passo,y0,z0,ny,nz,campos};
}
export function limiteCardiaco(s,y,z) {
  let limite=s===ESQ?.017:.013;
  if(!envelopeCardiaco)return limite;
  const {passo,y0,z0,ny,nz,campos}=envelopeCardiaco;
  const fy=(y-y0)/passo,fz=(z-z0)/passo,iy=Math.floor(fy),iz=Math.floor(fz);
  if(iy<0||iy>=ny-1||iz<0||iz>=nz-1)return limite;
  const c=campos[s===DIR?0:1],ty=fy-iy,tz=fz-iz;
  return (1-ty)*((1-tz)*c[iy*nz+iz]+tz*c[iy*nz+iz+1])+
    ty*((1-tz)*c[(iy+1)*nz+iz]+tz*c[(iy+1)*nz+iz+1]);
}
function geoPulmaoToracico(s,{inflate=0,fissuras=true}={}) {
  const K=112,NB=18,NW=96,ZC=-.008,apice=(s===DIR?.301:.308)+inflate;
  const assoalho=Math.max(.0007,.0022-inflate);
  const ponto=(y,phi,R=1)=> {
    const c=Math.cos(phi),sn=Math.sin(phi),w=wT(y)-.010+inflate,d=dT(y)-.010+inflate;
    const medial=(s===ESQ?.017:.013)-inflate,xc=(w+medial)/2;
    let x=xc+(w-medial)/2*c*R,z=ZC+sn*(sn>0?d*.85:d*.90)*R;
    if(s===ESQ) {
      const anterior=clamp((sn-.10)/.75,0,1)*clamp(-c*1.8,0,1);
      // Incisura sobre a projeção lingular do lobo superior esquerdo.
      x+=.009*gauss(y,.202,.026)*anterior;
      z+=.004*gauss(y,.167,.013)*anterior;
    }
    // Face costal convexa, sem a antiga parede posterior recortada em plano.
    const q=Math.hypot(x/w,z/d);if(q>.96){x*=.96/q;z*=.96/q;}
    const impressao=limiteCardiaco(s,y,z)-inflate;
    x=Math.max(x,impressao);
    const recuo=zS(y)+.014*gauss(x,0,.027)-inflate;
    z=Math.max(z,recuo);
    return {x:s*x,z,xc:s*xc};
  };
  const base=Array.from({length:K},(_,j)=>{
    let y=.10;for(let i=0;i<12;i++){const p=ponto(y,j/K*Math.PI*2);y=yDiafragmaToracico(p.x,p.z)+assoalho;}
    return y;
  });
  const rings=[];
  for(let i=1;i<=NB;i++)rings.push(Array.from({length:K},(_,j)=>{
    const p=ponto(base[j],j/K*Math.PI*2),r=i/NB;
    let x=p.xc+(p.x-p.xc)*r,z=ZC+(p.z-ZC)*r,y=yDiafragmaToracico(x,z)+assoalho;
    x=s*Math.max(s*x,limiteCardiaco(s,y,z)-inflate);
    y=yDiafragmaToracico(x,z)+assoalho;return V(x,y,z);
  }));
  for(let i=1;i<NW;i++)rings.push(Array.from({length:K},(_,j)=>{
    const v=i/NW,y=base[j]+(apice-base[j])*v;
    const t=clamp((y-.277)/(apice-.277),0,1),R=Math.sqrt(Math.max(.0001,1-t*t));
    const p=ponto(y,j/K*Math.PI*2,R);
    let x=p.x,z=p.z;
    if(fissuras&&R>.25) {
      let f=gauss(y-.184+.85*(z-ZC),0,.0022);
      if(s===DIR&&z>-.025&&y-.184+.85*(z-ZC)>.005)f=Math.max(f,gauss(y,.211,.002));
      const k=1-.035*f;x=p.xc+(x-p.xc)*k;z=ZC+(z-ZC)*k;
    }
    x=s*Math.max(s*x,limiteCardiaco(s,y,z)-inflate);
    return V(x,Math.max(y,yDiafragmaToracico(x,z)+assoalho),z);
  }));
  const g=loft(rings),p=g.attributes.position,colors=[];
  for(let i=0;i<p.count;i++) {
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i),f=y-.184+.85*(z-ZC);
    const grain=.96+.025*Math.sin(x*620+y*420)*Math.sin(z*700-y*370);
    const sulco=fissuras?Math.max(gauss(f,0,.002),s===DIR&&z>-.025&&f>.005?gauss(y,.211,.0017):0):0;
    colors.push(grain-.17*sulco,(grain-.20*sulco)*(f<0?.94:1),(grain-.18*sulco)*(f<0?1:.97));
  }
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));return g;
}

function recortarLobo(geo,normal,constant) {
  const pos=geo.attributes.position,col=geo.attributes.color,norm=geo.attributes.normal,idx=geo.index;
  const vertices=[],colors=[],normals=[],segments=[];
  const distance=p=>normal.dot(p)+constant;
  const emit=v=>{vertices.push(...v.p.toArray());colors.push(...v.c.toArray());normals.push(...v.n.toArray());};
  for(let i=0;i<idx.count;i+=3) {
    const original=Array.from({length:3},(_,j)=>{const k=idx.getX(i+j);return {p:V(pos.getX(k),pos.getY(k),pos.getZ(k)),c:V(col.getX(k),col.getY(k),col.getZ(k)),n:V(norm.getX(k),norm.getY(k),norm.getZ(k))};});
    const out=[],cut=[];
    for(let j=0;j<3;j++) {
      const a=original[j],b=original[(j+1)%3],da=distance(a.p),db=distance(b.p);
      if(da>=0)out.push(a);
      if((da>=0)!==(db>=0)) {
        const t=da/(da-db),v={p:a.p.clone().lerp(b.p,t),c:a.c.clone().lerp(b.c,t),n:a.n.clone().lerp(b.n,t).normalize()};
        out.push(v);cut.push(v.p);
      }
    }
    for(let k=1;k<out.length-1;k++){emit(out[0]);emit(out[k]);emit(out[k+1]);}
    if(cut.length===2)segments.push(cut);
  }
  const points=[],edges=[],lookup=new Map(),key=p=>p.toArray().map(v=>Math.round(v*1e8)).join(',');
  const add=p=>{const k=key(p);if(!lookup.has(k)){lookup.set(k,points.length);points.push(p);}return lookup.get(k);};
  segments.forEach(([a,b])=>edges.push([add(a),add(b)]));
  const links=new Map();edges.forEach(([a,b],i)=>{for(const v of [a,b]){if(!links.has(v))links.set(v,[]);links.get(v).push(i);}});
  const used=new Set(),N=normal.clone().normalize(),U=V(1,0,0),W=new THREE.Vector3().crossVectors(N,U).normalize();
  for(let e=0;e<edges.length;e++) {
    if(used.has(e))continue;
    const loop=[edges[e][0]],start=loop[0];let at=edges[e][1];used.add(e);
    while(at!==start&&loop.length<=edges.length+1) {
      loop.push(at);const next=(links.get(at)||[]).find(k=>!used.has(k));
      if(next===undefined)break;used.add(next);const edge=edges[next];at=edge[0]===at?edge[1]:edge[0];
    }
    if(at!==start||loop.length<3)continue;
    const contour=loop.map(k=>new THREE.Vector2(points[k].dot(U),points[k].dot(W)));
    for(const face of THREE.ShapeUtils.triangulateShape(contour,[])) {
      const tri=face.map(k=>points[loop[k]]),cross=new THREE.Vector3().crossVectors(tri[1].clone().sub(tri[0]),tri[2].clone().sub(tri[0]));
      if(cross.dot(N)>0)[tri[1],tri[2]]=[tri[2],tri[1]];
      tri.forEach(p=>emit({p,c:V(.78,.75,.78),n:N.clone().negate()}));
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
  // Compartilha vértices da superfície lisa; mantém normais distintas nos
  // cortes. Evita deformar a mesma posição uma vez por triângulo ao respirar.
  const welded=mergeVertices(g,1e-7);g.dispose();return welded;
}
export function geoLobos(s) {
  const original=geoPulmao(s,{toracico:true,fissuras:false});
  const n=V(0,1,1.18).normalize(),c=-.199/Math.hypot(1,1.18),gap=.00065;
  const inferior=recortarLobo(original,n.clone().negate(),-c-gap);
  const anterior=recortarLobo(original,n,c-gap);
  const lobos=s===DIR?
    [recortarLobo(anterior,V(0,1,0),-.218-gap),recortarLobo(anterior,V(0,-1,0),.218-gap),inferior]:[anterior,inferior];
  const combined=mergeGeometries(lobos,true);
  lobos.forEach(g=>g.dispose());if(s===DIR)anterior.dispose();original.dispose();
  return combined;
}

/* ── Mediastino: traqueia anelada, brônquios, coração, aorta, cava, tronco pulmonar ── */
let matrizCardiaca,carregamentoCardiaco;
export function carregarCoracao() {
  if(!carregamentoCardiaco)carregamentoCardiaco=new GLTFLoader().loadAsync(
    new URL('../bancadas/11-coracao/fontes/scan/A-scan-realista.glb',import.meta.url).href
  ).then(({scene})=>{
    scene.updateMatrixWorld(true);
    const bb=new THREE.Box3().setFromObject(scene),centro=bb.getCenter(new THREE.Vector3());
    const escala=.105/bb.getSize(new THREE.Vector3()).y;
    const g=new THREE.Group();g.name='coracao_scan_prototipo';
    scene.traverse(o=>{
      if(!o.isMesh)return;
      const geo=o.geometry.clone().applyMatrix4(o.matrixWorld);
      geo.translate(-centro.x,-centro.y,-centro.z);geo.scale(escala,escala,escala);
      const mat=o.material.clone();
      // Mesmo acabamento da Vista Externa do protótipo; textura preservada.
      mat.roughnessMap=null;mat.metalness=0;mat.roughness=.55;
      mat.emissive=new THREE.Color('#a8494a');mat.emissiveIntensity=.16;
      mat.userData={};
      g.add(mk('coracao_scan_realista',geo,mat));
    });
    g.position.set(.012,.207,.018);
    // Assenta a face diafragmática sem atravessar a cúpula.
    let elevar=0;
    for(const m of g.children){const p=m.geometry.attributes.position;
      for(let i=0;i<p.count;i++){
        const x=p.getX(i)+g.position.x,y=p.getY(i)+g.position.y,z=p.getZ(i)+g.position.z;
        elevar=Math.max(elevar,yDiafragmaToracico(x,z)+.001-y);
      }
    }
    g.position.y+=elevar;
    indexarCoracao(g);matrizCardiaca=g;return g;
  });
  return carregamentoCardiaco;
}
function coracaoDoRepositorio() {
  if(!matrizCardiaca)return new THREE.Group();
  const g=matrizCardiaca.clone();
  // Cada tórax tem seus buffers. Contrair um não deforma a outra vista.
  g.traverse(o=>{if(o.isMesh){o.geometry=o.geometry.clone();o.userData.repousoCardiaco=o.geometry.attributes.position.array.slice();}});
  return g;
}
export function construirMediastino(M) {
  const g = new THREE.Group(); g.name = 'mediastino';
  g.add(mk('traqueia', tuboGeo([V(0, 0.345, -0.004), V(0, 0.29, -0.009), V(0, 0.24, -0.014)], 0.0085, 12), M.traqueia));
  for (let i = 0; i < 11; i++) {
    const y = 0.252 + i * 0.0085;
    const anel = mk(`anel_traqueal_${i + 1}`, new THREE.TorusGeometry(0.0088, 0.0014, 8, 24, Math.PI * 1.5), M.cartilagem);
    anel.rotation.x = Math.PI / 2; anel.rotation.z = Math.PI * .75; anel.position.set(0, y, -0.004 - (0.345 - y) / 0.105 * 0.01);
    g.add(anel);
  }
  /* o brônquio direito é mais largo e mais vertical */
  g.add(mk('bronquio_D', tuboGeo([V(0, 0.242, -0.014), V(DIR * 0.018, 0.228, -0.013), V(DIR * 0.042, 0.212, -0.01)], 0.0066, 12), M.traqueia));
  g.add(mk('bronquio_E', tuboGeo([V(0, 0.242, -0.014), V(ESQ * 0.022, 0.232, -0.014), V(ESQ * 0.05, 0.218, -0.012)], 0.0058, 12), M.traqueia));
  const coracao=coracaoDoRepositorio();
  g.add(coracao);
  return g;
}

/* Amostras dentro da MESMA superfície pulmonar usada nos níveis macroscópicos.
   O centro vem da secção real; a margem limita os exemplos ampliados. */
const amostras = new Map();
export function amostraPulmao(s,f) {
  if(!amostras.has(s)) {
    const geo=geoPulmao(s),mesh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
    geo.computeBoundingBox();amostras.set(s,{geo,mesh,cache:new Map()});
  }
  const {geo,mesh,cache}=amostras.get(s);
  if(cache.has(f))return cache.get(f);
  const p=geo.attributes.position,idx=geo.index;
  const bb=geo.boundingBox,y=bb.min.y+(bb.max.y-bb.min.y)*(.23+.61*f),pts=[];
  for(let i=0;i<idx.count;i+=3) for(let j=0;j<3;j++) {
    const a=idx.getX(i+j),b=idx.getX(i+(j+1)%3),ya=p.getY(a),yb=p.getY(b);
    if((ya<y)===(yb<y))continue;
    const t=(y-ya)/(yb-ya);pts.push(V(p.getX(a)+(p.getX(b)-p.getX(a))*t,y,p.getZ(a)+(p.getZ(b)-p.getZ(a))*t));
  }
  const c=V(0,y,0);for(const p of pts){c.x+=p.x;c.z+=p.z;}c.x/=pts.length;c.z/=pts.length;
  const ray=new THREE.Raycaster();
  const span=(from,d,axis)=>{ray.set(from,d);const h=ray.intersectObject(mesh);return [h[0].point.getComponent(axis),h[h.length-1].point.getComponent(axis)];};
  const xs=span(V(-1,y,c.z),V(1,0,0),0);c.x=(xs[0]+xs[1])/2;
  const zs=span(V(c.x,y,-1),V(0,0,1),2);c.z=(zs[0]+zs[1])/2;
  const tri=new THREE.Triangle(),near=new THREE.Vector3();let folga=Infinity;
  for(let i=0;i<idx.count;i+=3) {
    tri.a.fromBufferAttribute(p,idx.getX(i));tri.b.fromBufferAttribute(p,idx.getX(i+1));tri.c.fromBufferAttribute(p,idx.getX(i+2));
    tri.closestPointToPoint(c,near);folga=Math.min(folga,c.distanceTo(near));
  }
  const result={centro:c,rx:(xs[1]-xs[0])/2,rz:(zs[1]-zs[0])/2,folga};cache.set(f,result);return result;
}

export function unidadeAcinar(M,r=.01) {
  const g=new THREE.Group();g.name='unidade_acinar';
  g.add(mk('ducto_alveolar',tuboGeo([V(0,r*.72,-r*.1),V(0,r*.18,0),V(0,-r*.65,0)],r*.12,16),M.traqueia));
  const centers=[V(-.40,.36,0),V(.40,.36,0),V(-.48,-.20,0),V(.48,-.20,0),V(0,-.65,0)];
  centers.forEach((c,i)=>{
    c.multiplyScalar(r);
    g.add(mk(`saco_alveolar_${i}`,tecidoGeo(r*.36,r*.39,r*.30,.055),M.alveolo));g.children[g.children.length-1].position.copy(c);
    g.add(mk(`abertura_alveolar_${i}`,tuboGeo([V(0,c.y,0),c],r*.10,12),M.traqueia));
  });
  return compactar(g);
}

/* Rede ramificada, com anastomoses; não uma barra atravessando o órgão. */
export function redeCapilar(rx,rz) {
  const geos=[],r=Math.min(.00065,rx*.045),dy=rx*.060;
  for(let row=-2;row<=2;row++) {
    const pts=[];
    for(let i=0;i<=22;i++) {const u=i/22*2-1;pts.push(V(u*rx,row*dy+Math.sin(u*Math.PI*3+row)*rx*.025,Math.sin(u*Math.PI)*rz*.32));}
    geos.push(tuboGeo(pts,r,30));
  }
  for(let j=-3;j<=3;j++) {
    const pts=[];
    for(let i=0;i<=8;i++) {const v=i/8*2-1;pts.push(V(j/3*rx*.88+Math.sin(v*Math.PI)*rx*.045,v*dy*2,Math.sin((j/3)*Math.PI)*rz*.32));}
    geos.push(tuboGeo(pts,r*.74,16));
  }
  // Concatena as malhas sem dependência extra, preservando normais e índices.
  const p=[],n=[],idx=[];
  for(const geo of geos){const off=p.length/3;p.push(...geo.attributes.position.array);n.push(...geo.attributes.normal.array);idx.push(...Array.from(geo.index.array,i=>i+off));geo.dispose();}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(n,3));geo.setIndex(idx);return geo;
}
