/* Compressão dos GLB animados (só o caminho do Android; o USDZ não muda).
   ---------------------------------------------------------------------------
   Os ciclos são quase só geometria em float32 sem compressão. Aqui:
   1. dedup — acessores, malhas, materiais e texturas idênticos viram um só
      (os tempos das trilhas, por exemplo, se repetem em todas);
   2. Draco — quantiza e comprime as posições, normais e UV.

   Draco e não Meshopt de propósito: Draco não mexe nas transformações dos
   nós, e são elas que a animação move. O model-viewer 4.1 decodifica Draco
   sozinho.

   ORDEM NA ESTEIRA. Roda DEPOIS de converter-ciclos.py: o conversor de USDZ
   lê o GLB cru e não entende Draco. O conversor pula os GLB já comprimidos.

   Uso: node ra/scripts/comprimir-ciclos.mjs starling [outra-experiencia…]
   --------------------------------------------------------------------------- */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, draco } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const experiencias = process.argv.slice(2);
if (!experiencias.length) throw Error('Diga quais experiências comprimir, por exemplo: starling');

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.encoder': await draco3d.createEncoderModule(),
  'draco3d.decoder': await draco3d.createDecoderModule(),
});

const resumo = doc => { const g = doc.getRoot(); return {
  animacoes: g.listAnimations().map(a => a.getName() + ':' + a.listChannels().length),
  placas: g.listNodes().filter(n => n.getExtras()?.textoRA).length,
  nos: g.listNodes().length,
}; };

for (const exp of experiencias) {
  const dir = path.join(root, exp, 'ciclos');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.glb')).sort()) {
    const file = path.join(dir, f), antes = fs.statSync(file).size;
    const doc = await io.read(file);
    if (doc.getRoot().listExtensionsUsed().some(e => e.extensionName === 'KHR_draco_mesh_compression')) {
      console.log(exp, f, 'já comprimido; pulado');
      continue;
    }
    const r0 = resumo(doc);
    await doc.transform(dedup(), draco({ method: 'edgebreaker' }));
    const r1 = resumo(doc);
    /* A compressão não pode tirar movimento nem placa: se tirar, para aqui. */
    if (JSON.stringify(r0) !== JSON.stringify(r1)) throw Error(`${exp}/${f}: estrutura mudou ${JSON.stringify(r0)} → ${JSON.stringify(r1)}`);
    await io.write(file, doc);
    const depois = fs.statSync(file).size;
    console.log(exp, f, antes, '→', depois, 'bytes', `(-${Math.round(100 * (1 - depois / antes))}%)`, JSON.stringify(r1));
  }
}
