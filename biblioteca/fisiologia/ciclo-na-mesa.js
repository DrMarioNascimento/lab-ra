/* CICLO NA MESA · o movimento do motor gravado dentro do GLB.
   ---------------------------------------------------------------------------
   O QUE ISTO FAZ. Recebe, já amostradas pela própria experiência, as posições
   de cada malha ao longo de UM ciclo do motor — as mesmas funções que desenham
   a tela, nada aproximado à mão — e monta um GLB animado:
     · a geometria exportada fica no REPOUSO (a base);
     · cada amostra k vira um morph target com o deslocamento em relação à
       base (morphTargetsRelative = true);
     · um AnimationClip com uma NumberKeyframeTrack por malha
       ("<nome>.morphTargetInfluences"): no tempo t_k = k·T/N o peso do alvo k
       vale 1 e os outros 0; a interpolação linear faz a transição, e o laço
       fecha voltando ao alvo 0 em t = T.
   Malhas cuja excursão no ciclo fica abaixo de um limiar não recebem morphs:
   vão paradas, na forma da amostra 0.

   ONDE ISTO VALE. Android pela WebXR do model-viewer (three.js toca morph
   targets). O Scene Viewer do Google NÃO aceita morph targets (erro de
   validação MORPH_TARGET_USED na especificação dele), e o AR Quick Look do
   iPhone só lê USDZ, cuja conversão automática não leva animação. No iPhone
   continua valendo o instante escolhido.

   O QUE NÃO MUDA. Nada aqui calcula fisiologia. Este módulo só copia,
   subtrai e empacota o que o motor desenhou; também não toca a cena da tela:
   trabalha num clone com geometrias próprias.

   MEDIÇÕES. O retorno traz o que o professor pediu para diagnóstico —
   tamanho, tempo, malhas e vértices animados, amostras e o erro de
   interpolação em milímetros na escala real. Nada disso aparece para o aluno.
   --------------------------------------------------------------------------- */
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const agora = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

/* maior distância entre dois arranjos de posições (mesmo tamanho) */
function maiorDistancia(a, b) {
  let pior = 0;
  for (let j = 0; j < a.length; j += 3) {
    const dx = a[j] - b[j], dy = a[j + 1] - b[j + 1], dz = a[j + 2] - b[j + 2];
    const d = dx * dx + dy * dy + dz * dz;
    if (d > pior) pior = d;
  }
  return Math.sqrt(pior);
}

/* maior distância entre o ponto médio de a e b e a forma m */
function erroDoMeio(a, b, m) {
  let pior = 0;
  for (let j = 0; j < a.length; j += 3) {
    const dx = (a[j] + b[j]) / 2 - m[j], dy = (a[j + 1] + b[j + 1]) / 2 - m[j + 1],
          dz = (a[j + 2] + b[j + 2]) / 2 - m[j + 2];
    const d = dx * dx + dy * dy + dz * dz;
    if (d > pior) pior = d;
  }
  return Math.sqrt(pior);
}

/* normais suaves de uma forma, com o mesmo índice da malha */
function normaisDe(geoTemp, posicoes) {
  geoTemp.attributes.position.array.set(posicoes);
  geoTemp.attributes.position.needsUpdate = true;
  geoTemp.computeVertexNormals();
  return new Float32Array(geoTemp.attributes.normal.array);
}

/**
 * Monta e exporta o GLB animado de um ciclo.
 * @param {object} o
 * @param {THREE.Object3D} o.raiz         raiz da peça na tela (não é alterada)
 * @param {THREE.Mesh[]}   o.malhas       malhas da raiz, na ordem de `traverse`
 * @param {Float32Array[]} o.repouso      posições de repouso de cada malha
 * @param {Float32Array[][]} o.quadros    por malha, 2N+1 formas nas fases j/(2N):
 *                                        pares = alvos; ímpares = meio (conferência);
 *                                        a última (fase 1) confere o fechamento do laço
 * @param {number} o.N                    amostras por ciclo
 * @param {number} o.duracao              duração do ciclo, em segundos
 * @param {number} o.alturaRealM          altura real da peça em repouso, em metros
 * @param {Function} o.preparar           a mesma preparação de cores de RA do export estático
 * @param {boolean} [o.normais=true]      grava também morphs de normal
 * @param {number} [o.limiarMm=0.05]      excursão mínima, em mm reais, para ganhar morphs
 */
export async function assarCiclo(o) {
  const { raiz, malhas, repouso, quadros, N, duracao, alturaRealM, preparar } = o;
  const normais = o.normais !== false;
  const limiarMm = o.limiarMm ?? 0.05;
  const t0 = agora();

  /* ── escala real: a altura do REPOUSO em unidades de mundo vira alturaRealM.
     Uma única escala para o ciclo inteiro, como na mesa. */
  raiz.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  const caixaRepouso = new THREE.Box3();
  malhas.forEach((m, i) => {
    const a = repouso[i];
    for (let j = 0; j < a.length; j += 3) caixaRepouso.expandByPoint(v.set(a[j], a[j + 1], a[j + 2]).applyMatrix4(m.matrixWorld));
  });
  const alturaMundo = caixaRepouso.getSize(new THREE.Vector3()).y || 1;
  const metroPorMundo = alturaRealM / alturaMundo;
  const escMalha = malhas.map(m => {
    const e = m.matrixWorld.elements;
    return Math.hypot(e[0], e[1], e[2]);           // as malhas vivem em escala uniforme
  });
  const mmDe = (i, d) => d * escMalha[i] * metroPorMundo * 1000;

  /* ── excursão e erro, por malha ─────────────────────────────────────── */
  const porMalha = malhas.map((m, i) => {
    const q = quadros[i];
    let excursao = 0;
    for (let k = 1; k < N; k++) excursao = Math.max(excursao, maiorDistancia(q[2 * k], q[0]));
    return { nome: m.name || '(sem nome)', vertices: q[0].length / 3, excursaoMm: mmDe(i, excursao) };
  });
  const animada = porMalha.map(p => p.excursaoMm >= limiarMm);

  let erroInterpMm = 0, ondeInterp = null, erroParadasMm = 0, ondeParada = null, fechamentoMm = 0;
  const erroPorFase = new Array(N).fill(0);
  malhas.forEach((m, i) => {
    const q = quadros[i];
    fechamentoMm = Math.max(fechamentoMm, mmDe(i, maiorDistancia(q[2 * N], q[0])));
    if (animada[i]) {
      let pior = 0;
      for (let k = 0; k < N; k++) {
        const prox = k + 1 < N ? q[2 * k + 2] : q[0];          // o laço fecha no alvo 0
        const e = mmDe(i, erroDoMeio(q[2 * k], prox, q[2 * k + 1]));
        if (e > erroPorFase[k]) erroPorFase[k] = e;
        if (e > pior) pior = e;
      }
      porMalha[i].erroInterpMm = pior;
      if (pior > erroInterpMm) { erroInterpMm = pior; ondeInterp = porMalha[i].nome; }
    } else {
      let pior = 0;
      for (let j = 1; j < 2 * N; j++) pior = Math.max(pior, mmDe(i, maiorDistancia(q[j], q[0])));
      porMalha[i].erroParadaMm = pior;
      if (pior > erroParadasMm) { erroParadasMm = pior; ondeParada = porMalha[i].nome; }
    }
  });
  const tMedir = agora();

  /* ── o clone: geometrias próprias, base no repouso, morphs relativos ─── */
  const marcas = {};
  let tm = agora();
  const marca = k => { const t = agora(); marcas[k] = +(t - tm).toFixed(1); tm = t; };
  const clone = raiz.clone(true);
  clone.visible = true;
  const malhasClone = [];
  clone.traverse(x => { x.visible = true; if (x.isMesh) malhasClone.push(x); });
  if (malhasClone.length !== malhas.length) throw new Error('clone com malhas diferentes da tela');

  let verticesAnimados = 0;
  malhasClone.forEach((mc, i) => {
    const g = mc.geometry.clone();
    for (const k of Object.keys(g.morphAttributes)) delete g.morphAttributes[k];
    const q = quadros[i];
    const temp = new THREE.BufferGeometry();
    temp.setAttribute('position', new THREE.BufferAttribute(new Float32Array(q[0].length), 3));
    if (g.index) temp.setIndex(g.index);
    if (!animada[i]) {
      /* parada: vai na forma da amostra 0, com normal suave */
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(q[0]), 3));
      g.setAttribute('normal', new THREE.BufferAttribute(normaisDe(temp, q[0]), 3));
      g.morphTargetsRelative = false;
      mc.geometry = g;
      mc.updateMorphTargets();
      return;
    }
    const base = repouso[i];
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(base), 3));
    const nBase = normaisDe(temp, base);
    g.setAttribute('normal', new THREE.BufferAttribute(nBase, 3));
    const mPos = [], mNor = [];
    for (let k = 0; k < N; k++) {
      const alvo = q[2 * k];
      const d = new Float32Array(alvo.length);
      for (let j = 0; j < d.length; j++) d[j] = alvo[j] - base[j];
      mPos.push(new THREE.BufferAttribute(d, 3));
      if (normais) {
        const nk = normaisDe(temp, alvo);
        for (let j = 0; j < nk.length; j++) nk[j] -= nBase[j];
        mNor.push(new THREE.BufferAttribute(nk, 3));
      }
    }
    g.morphAttributes.position = mPos;
    if (normais) g.morphAttributes.normal = mNor;
    g.morphTargetsRelative = true;
    mc.geometry = g;
    mc.updateMorphTargets();
    mc.morphTargetInfluences.fill(0); mc.morphTargetInfluences[0] = 1;
    verticesAnimados += base.length / 3;
  });
  marca('msMorphs');

  /* ── escala real, centrado em x e z, base em y = 0 ───────────────────
     O chão é o ponto MAIS BAIXO do ciclo inteiro (a interpolação só combina
     alvos, então a união dos alvos limita tudo o que a mesa vai mostrar):
     a peça nunca afunda no piso em nenhuma fase. */
  clone.scale.multiplyScalar(metroPorMundo);
  clone.updateMatrixWorld(true);
  const uniao = new THREE.Box3();
  malhasClone.forEach((mc, i) => {
    const lista = animada[i] ? Array.from({ length: N }, (_, k) => quadros[i][2 * k]) : [quadros[i][0]];
    for (const a of lista)
      for (let j = 0; j < a.length; j += 3) uniao.expandByPoint(v.set(a[j], a[j + 1], a[j + 2]).applyMatrix4(mc.matrixWorld));
  });
  clone.position.set(clone.position.x - (uniao.min.x + uniao.max.x) / 2,
                     clone.position.y - uniao.min.y,
                     clone.position.z - (uniao.min.z + uniao.max.z) / 2);
  clone.updateMatrixWorld(true);
  marca('msPosicionar');

  /* ── a mesma preparação de cores de RA do export estático ───────────── */
  const conta = preparar ? preparar(clone) : {};
  marca('msPrepararCores');

  /* As gêmeas pelo avesso (dupla face na geometria) nascem de `geometry.clone()`,
     que leva os morphs. A posição é a mesma; a normal da gêmea é invertida,
     então o delta de normal também precisa ser. Sem índice, a gêmea troca a
     ordem dos vértices — os morphs têm de trocar junto. */
  const finais = [];
  clone.traverse(x => { if (x.isMesh) finais.push(x); });
  for (const mc of finais) {
    const g = mc.geometry;
    if (!g.morphAttributes.position || !/-avesso$/.test(mc.name)) continue;
    if (!g.index) {
      for (const lista of Object.values(g.morphAttributes)) for (const at of lista) {
        const arr = at.array;
        for (let t = 0; t < at.count; t += 3) for (let c = 0; c < 3; c++) {
          const i = t * 3 + c, j = (t + 2) * 3 + c, s = arr[i]; arr[i] = arr[j]; arr[j] = s;
        }
      }
    }
    for (const at of g.morphAttributes.normal || []) for (let j = 0; j < at.array.length; j++) at.array[j] = -at.array[j];
    mc.updateMorphTargets();
    mc.morphTargetInfluences.fill(0); mc.morphTargetInfluences[0] = 1;
  }

  /* ── nomes únicos e a animação ──────────────────────────────────────── */
  const tempos = new Float32Array(N + 1);
  for (let k = 0; k <= N; k++) tempos[k] = k * duracao / N;
  const pesos = new Float32Array((N + 1) * N);
  for (let k = 0; k <= N; k++) pesos[k * N + (k % N)] = 1;       // t = T volta ao alvo 0
  const trilhas = [];
  let malhasExportadasAnimadas = 0, verticesExportadosAnimados = 0, n = 0;
  for (const mc of finais) {
    mc.name = 'ciclo' + (n++) + '_' + THREE.PropertyBinding.sanitizeNodeName(mc.name || 'malha');
    if (!mc.geometry.morphAttributes.position) continue;
    trilhas.push(new THREE.NumberKeyframeTrack(mc.name + '.morphTargetInfluences', tempos, pesos));
    malhasExportadasAnimadas++;
    verticesExportadosAnimados += mc.geometry.attributes.position.count;
  }
  const clip = new THREE.AnimationClip('ciclo', duracao, trilhas);
  const tMontar = agora();

  const wrap = new THREE.Group(); wrap.name = 'ciclo_na_mesa'; wrap.add(clone);
  wrap.updateMatrixWorld(true);
  const glb = await new GLTFExporter().parseAsync(wrap, { binary: true, onlyVisible: true, animations: [clip] });
  const tFim = agora();

  const tamanhoFinal = uniao.getSize(new THREE.Vector3());
  return {
    glb,
    medidas: {
      bytes: glb.byteLength,
      mb: +(glb.byteLength / 1048576).toFixed(2),
      amostras: N,
      duracaoCicloS: +duracao.toFixed(4),
      normaisNoMorph: normais,
      limiarMm,
      malhasNaPeca: malhas.length,
      malhasAnimadas: animada.filter(Boolean).length,
      verticesAnimados,
      malhasExportadasAnimadas,                    // inclui gêmeas pelo avesso
      verticesExportadosAnimados,
      erroInterpolacaoMaxMm: +erroInterpMm.toFixed(3),
      ondeErroInterpolacao: ondeInterp,
      erroPorIntervaloMm: erroPorFase.map(e => +e.toFixed(3)),
      erroMalhasParadasMaxMm: +erroParadasMm.toFixed(3),
      ondeErroParadas: ondeParada,
      fechamentoDoLacoMm: +fechamentoMm.toFixed(4),
      caixaCicloM: [tamanhoFinal.x, tamanhoFinal.y, tamanhoFinal.z].map(x => +x.toFixed(4)),
      alturaRepousoM: +alturaRealM.toFixed(4),
      msMedirEMontar: +(tMontar - t0).toFixed(1),
      msMedir: +(tMedir - t0).toFixed(1),
      msExportar: +(tFim - tMontar).toFixed(1),
      preparacaoCores: conta,
      etapas: marcas,
      porMalha,
    },
  };
}
