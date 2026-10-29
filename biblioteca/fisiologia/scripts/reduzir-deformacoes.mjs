/* Reduz as deformações (morph targets) de um GLB já pronto.
   ---------------------------------------------------------------------------
   Para os ciclos que não passam por compilar-ciclos.js, como o coração,
   gerado pelo próprio motor da bancada (window.__compilarCiclo). Lá cada
   instante vira uma cópia inteira da malha: 32 dos 37 MB do nível 2 eram isso.

   Para cada malha animada por pesos: reconstrói o deslocamento de cada
   instante, decompõe (formas-reduzidas.js), e regrava alvos e trilha. As
   normais deformadas recebem a mesma combinação. O resultado repete as
   formas de cada instante até 0,1% do tamanho da peça; fora dos instantes,
   a interpolação é a mesma linear de antes.

   Roda sobre o GLB CRU, antes do USDZ e da compressão.
   Uso: node ra/scripts/reduzir-deformacoes.mjs ra/coracao/ciclos/nivel-2.glb …
   --------------------------------------------------------------------------- */
import fs from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { formasReduzidas, aplicarCombinacao } from './formas-reduzidas.js';

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

for (const arquivo of process.argv.slice(2)) {
  const antes = fs.statSync(arquivo).size, doc = await io.read(arquivo), raiz = doc.getRoot();
  let malhas = 0, alvosAntes = 0, alvosDepois = 0, pulos = 0;
  for (const anim of raiz.listAnimations()) for (const canal of anim.listChannels()) {
    if (canal.getTargetPath() !== 'weights') continue;
    const no = canal.getTargetNode(), malha = no.getMesh(), amostra = canal.getSampler();
    const prims = malha.listPrimitives(), nAlvos = prims[0].listTargets().length;
    /* Uma malha compartilhada por outro nó animado teria dois donos para os
       mesmos alvos: fica como está. */
    if (malha.listParents().filter(p => p.propertyType === 'Node').length > 1) { pulos++; continue; }
    const tempos = amostra.getInput().getArray(), W = amostra.getOutput().getArray(), nInst = tempos.length;
    if (W.length !== nInst * nAlvos || amostra.getInterpolation() === 'CUBICSPLINE') { pulos++; continue; }
    let comb = null, k = 0;
    /* As primitivas de uma malha dividem os pesos: a decomposição usa a
       primeira, e as demais recebem a mesma combinação. */
    prims.forEach((prim, pi) => {
      const alvos = prim.listTargets();
      const instantes = atributo => {
        const base = prim.getAttribute(atributo).getArray();
        const deltas = alvos.map(a => a.getAttribute(atributo)?.getArray());
        if (deltas.some(d => !d)) return null;
        return { base, formas: Array.from({ length: nInst }, (_, i) => {
          const f = Float32Array.from(base);
          for (let j = 0; j < nAlvos; j++) { const w = W[i * nAlvos + j]; if (w) { const d = deltas[j]; for (let q = 0; q < f.length; q++) f[q] += w * d[q]; } }
          return f;
        }) };
      };
      const pos = instantes('POSITION'), nor = instantes('NORMAL');
      let r;
      if (pi === 0) { r = formasReduzidas(pos.base, pos.formas); comb = r.comb; k = r.alvos.length; amostra.getOutput().setArray(r.pesos); }
      else r = aplicarCombinacao(pos.base, pos.formas, comb);
      const rn = nor && aplicarCombinacao(nor.base, nor.formas, comb);
      prim.getAttribute('POSITION').setArray(r.base);
      /* a troca de base desloca a normal de repouso; o glTF a quer unitária */
      if (rn) { const n = rn.base; for (let q = 0; q < n.length; q += 3) { const l = Math.hypot(n[q], n[q + 1], n[q + 2]) || 1; n[q] /= l; n[q + 1] /= l; n[q + 2] /= l; } prim.getAttribute('NORMAL').setArray(n); }
      for (const a of alvos) { prim.removeTarget(a); a.dispose(); }
      r.alvos.forEach((arr, j) => {
        const t = doc.createPrimitiveTarget();
        t.setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(arr).setBuffer(raiz.listBuffers()[0]));
        if (rn) t.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(rn.alvos[j]).setBuffer(raiz.listBuffers()[0]));
        prim.addTarget(t);
      });
    });
    malha.setWeights(new Array(k).fill(0));
    malhas++; alvosAntes += nAlvos; alvosDepois += k;
  }
  /* alvos e acessores velhos ficam órfãos: sai tudo o que nada usa */
  for (const a of raiz.listAccessors()) if (a.listParents().every(p => p.propertyType === 'Root')) a.dispose();
  await io.write(arquivo, doc);
  console.log(arquivo, antes, '→', fs.statSync(arquivo).size, `bytes; ${malhas} malhas, ${alvosAntes} → ${alvosDepois} alvos` + (pulos ? `; ${pulos} puladas` : ''));
}
