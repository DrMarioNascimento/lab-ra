/* RA NATIVA DO IPHONE (AR Quick Look) — mesmo caminho das outras RA do LAB-RA.
   A maquete vira um USDZ com três placas na mesa: "Manter o curso", "Desviar o bonde"
   e "Reiniciar". Cada placa dispara o percurso GRAVADO da própria simulação da tela
   (cena.js): o bonde sai da estação, a alavanca e a agulha mudam, o grupo atingido cai
   e o bonde volta a parar na estação. Tela cheia, apoio na mesa, pinça e arraste são
   do próprio iPhone. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { usdzComBotoes } from './ra-botoes-ios.js?v=20261107-ra7';

import {criarRotulos} from '../js/rotulos.js?v=20261107-ra12';
import {poseFantasmaNativo} from './fantasmas-usdz.js?v=20261107-ra12';

const PASSO = 0.3;            // s entre poses gravadas
const LARGURA_REAL = 1.2;
const ARVORES_RA = 27; // Malhas otimizadas; mantém a mesma distribuição do visualizador web.

function gravar(m) {
  const moveis = m.partesMoveis();
  const capt = () => moveis.map(o => { o.updateMatrix(); return o.userData.fantasma?poseFantasmaNativo(o.matrix):o.matrix.clone(); });
  const assentar = (n = 45) => { for (let i = 0; i < n; i++) m.update(1 / 30); };
  const s0 = m.estado.s0;
  const inicio = () => { m.reiniciar(); m.irPara('principal', s0); assentar(); return capt(); };
  const percurso = rota => {
    inicio();
    m.irPara(rota, s0); m.estado.travado = false; assentar();
    const passos = [{ poses: capt(), duracao: 0.6, ease: 'inout' }];
    m.partir(); let t = 0, acum = 0;
    while (m.estado.rodando && t < 120) { m.update(1 / 30); t += 1 / 30; acum += 1 / 30; if (acum >= PASSO) { passos.push({ poses: capt(), duracao: acum }); acum = 0; } }
    passos.push({ poses: capt(), duracao: Math.max(0.05, acum) });
    return passos;
  };
  const manter = percurso('principal'), desviar = percurso('ramal');
  const repouso = inicio();
  moveis.forEach((o,i)=>{if(o.userData.fantasma)repouso[i].decompose(o.position,o.quaternion,o.scale);});
  return { moveis, estados: [
    { rotulo: 'Manter o curso', passos: manter },
    { rotulo: 'Desviar o bonde', passos: desviar },
    { rotulo: 'Reiniciar', passos: [{ poses: repouso, duracao: 0.8, ease: 'inout' }] },
  ] };
}

// geometria em Float32 simples (o exportador lê os arrays direto; malhas quantizadas/intercaladas saem erradas)
function geoSimples(g) {
  const n = new THREE.BufferGeometry();
  for (const nome of ['position', 'normal', 'uv']) {
    const a = g.attributes[nome]; if (!a) continue;
    const it = a.itemSize, arr = new Float32Array(a.count * it);
    for (let i = 0; i < a.count; i++) for (let k = 0; k < it; k++) arr[i * it + k] = a.getComponent(i, k);
    n.setAttribute(nome, new THREE.BufferAttribute(arr, it));
  }
  if (g.attributes.color) { const a = g.attributes.color, arr = new Float32Array(a.count * 3); for (let i = 0; i < a.count; i++) for (let k = 0; k < 3; k++) arr[i * 3 + k] = a.getComponent(i, k); n.setAttribute('color', new THREE.BufferAttribute(arr, 3)); }
  if (g.index) n.setIndex(Array.from(g.index.array));
  if (!n.attributes.normal) n.computeVertexNormals();
  return n;
}
function matSimples(m) {
  if (!m.isMeshStandardMaterial) m = new THREE.MeshStandardMaterial({ color: m.color || 0xffffff, map: m.map || null, emissive: m.color || 0x000000, emissiveIntensity: 0.6, transparent: m.transparent, opacity: m.opacity });
  else { m = m.clone(); m.normalMap = null; m.aoMap = null; m.roughnessMap = null; m.metalnessMap = null; m.vertexColors = false; }
  if(m.name==='fantasma'){m.transparent=false;m.opacity=1;}
  m.side = THREE.FrontSide; // Quick Look exporta apenas a face frontal.
  return m;
}
// cor por vértice não atravessa o USDZ: separa a malha por cor, com um material de cor sólida para cada uma
function separarPorCor(mesh) {
  const g = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry, c = g.attributes.color, grupos = new Map();
  for (let t = 0; t < g.attributes.position.count; t += 3) {
    const hex = new THREE.Color(c.getX(t), c.getY(t), c.getZ(t)).getHex();
    if (!grupos.has(hex)) grupos.set(hex, []); grupos.get(hex).push(t);
  }
  const out = new THREE.Group(); out.name = mesh.name; out.matrix.copy(mesh.matrix); out.matrix.decompose(out.position, out.quaternion, out.scale);
  for (const [hex, tris] of grupos) {
    const ng = new THREE.BufferGeometry();
    for (const nome of ['position', 'normal', 'uv']) { const a = g.attributes[nome]; if (!a) continue; const arr = new Float32Array(tris.length * 3 * a.itemSize); let o = 0; for (const t of tris) for (let v = 0; v < 3; v++) for (let k = 0; k < a.itemSize; k++) arr[o++] = a.getComponent(t + v, k); ng.setAttribute(nome, new THREE.BufferAttribute(arr, a.itemSize)); }
    const mat = matSimples(mesh.material); mat.color.setHex(hex).multiply(mesh.material.color || new THREE.Color(1, 1, 1)); mat.map = null;
    out.add(new THREE.Mesh(ng, mat));
  }
  return out;
}
function prepararCena(raiz) {
  const trocas = [];
  raiz.traverse(o => {
    if (o.isLight || (o.isMesh && o.material && o.material.visible === false) || o.name === 'Alavanca_Toque' || o.name === 'Arbustos_Flores' || o.name === 'Placa_Menu') { trocas.push([o, null]); return; }
    if (o.isInstancedMesh) {
      const M = new THREE.Matrix4(), g = geoSimples(o.geometry), mat = matSimples(o.material), grupo = new THREE.Group(); grupo.name = o.name;
      grupo.position.copy(o.position); grupo.quaternion.copy(o.quaternion); grupo.scale.copy(o.scale);
      if (g.attributes.position.count < 400) {               // peças pequenas e numerosas (dormentes): uma malha só
        const gs = []; for (let i = 0; i < o.count; i += (o.name === 'Dormentes' ? 2 : 1)) { o.getMatrixAt(i, M); gs.push(g.clone().applyMatrix4(M)); }
        grupo.add(new THREE.Mesh(mergeGeometries(gs), mat));
      } else for (let i = 0; i < o.count; i += Math.max(1, Math.ceil(o.count / ARVORES_RA))) {   // árvores: poucas na RA (peso), mesma geometria
        o.getMatrixAt(i, M); const me = new THREE.Mesh(g, mat); M.decompose(me.position, me.quaternion, me.scale); grupo.add(me);
      }
      trocas.push([o, grupo]); return;
    }
    if (o.isMesh) {
      // desgaste do bonde (cor por vértice só escurece a pintura): fica de fora na RA
      if (o.material.vertexColors && /pintura|faixa|teto/.test(o.material.name || '')) { o.geometry = geoSimples(o.geometry); o.geometry.deleteAttribute('color'); o.material = matSimples(o.material); return; }
      if (o.material.vertexColors && o.geometry.attributes.color) { o.geometry = geoSimples(o.geometry); trocas.push([o, separarPorCor(o)]); return; }
      o.geometry = geoSimples(o.geometry); o.material = matSimples(o.material);
    }
  });
  for (const [velho, novo] of trocas) { const pai = velho.parent; if (!pai) continue; if (novo) { pai.add(novo); } pai.remove(velho); }
}

export async function montarUSDZ(m) {
  if(!m.root.getObjectByName('Rotulo_principal'))criarRotulos(m).atualizar({rotulos:true,principal:m.estado.presets[0],ramal:m.estado.presets[1],nPrincipal:m.gruposCena.principal.children.length,nRamal:m.gruposCena.ramal.children.length});
  let t = performance.now(); const log = msg => { console.log('[RA]', msg, Math.round(performance.now() - t) + ' ms'); t = performance.now(); };
  const { moveis, estados } = gravar(m); log('percursos gravados: ' + estados.map(e => e.passos.length).join('/') + ' passos, ' + moveis.length + ' partes');
  prepararCena(m.root); let tri = 0; m.root.traverse(o => { if (o.isMesh) tri += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; }); log('cena preparada: ' + Math.round(tri) + ' triângulos');
  const porParte = {}; for (const c of m.root.children) { let t = 0; c.traverse(o => { if (o.isMesh) t += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; }); const k = c.name || c.type; porParte[k] = (porParte[k] || 0) + Math.round(t); } console.log('[RA] ' + JSON.stringify(Object.entries(porParte).sort((a, b) => b[1] - a[1]).slice(0, 14)));
  const peca = new THREE.Group(); peca.name = 'Maquete_RA'; peca.add(m.root);
  m.root.scale.setScalar(LARGURA_REAL / 160); m.root.position.y = 0.015;
  return usdzComBotoes({ peca, moveis, estados });
}
