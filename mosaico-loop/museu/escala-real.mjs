// Tamanho real das peças para o "Ver no ambiente" (RA): lê "tamanho_real_ra" de escala-pecas.json e grava em cada GLB um nó "escala_real"
// que deixa a maior medida da peça com os metros do registro, o chão em y = 0 e a peça centrada (giro_y_graus vira a frente da peça para a câmera).
// Pode rodar de novo sem acumular: o nó é refeito a cada vez. No modo 3D nada muda (a câmera enquadra a peça); na RA a peça aparece do tamanho certo.
// Uso (na pasta do gltf-transform): node escala-real.mjs <pasta museu> [ids separados por vírgula; sem isso, todas as do registro]
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf'; import { MeshoptDecoder } from 'meshoptimizer'; import fs from 'fs'; import path from 'path';
const MUSEU = process.argv[2] || '.', SO = (process.argv[3] || '').split(',').filter(Boolean);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.decoder': await draco3d.createDecoderModule(), 'draco3d.encoder': await draco3d.createEncoderModule(), 'meshopt.decoder': MeshoptDecoder });
await MeshoptDecoder.ready;
const REG = JSON.parse(fs.readFileSync(path.join(MUSEU, 'escala-pecas.json'), 'utf8')).tamanho_real_ra.pecas;
for (const [id, r] of Object.entries(REG)) {
 if (SO.length && !SO.includes(id)) continue;
 const arq = path.join(MUSEU, 'pecas', id + '.glb'), doc = await io.read(arq), cena = doc.getRoot().listScenes()[0];
 let no = cena.listChildren().length === 1 && cena.listChildren()[0].getName() === 'escala_real' ? cena.listChildren()[0] : null;
 if (!no) { no = doc.createNode('escala_real'); for (const f of cena.listChildren()) { cena.removeChild(f); no.addChild(f); } cena.addChild(no); }
 const g = (r.giro_y_graus || 0) * Math.PI / 360;
 no.setTranslation([0, 0, 0]).setScale([1, 1, 1]).setRotation([0, Math.sin(g), 0, Math.cos(g)]);
 const b = getBounds(cena), t = [0, 1, 2].map(k => b.max[k] - b.min[k]), e = r.maior_m / Math.max(...t);
 no.setScale([e, e, e]).setTranslation([-(b.min[0] + b.max[0]) / 2 * e, -b.min[1] * e, -(b.min[2] + b.max[2]) / 2 * e]);
 if (!doc.getRoot().listExtensionsUsed().some(x => x.extensionName === 'KHR_draco_mesh_compression')) doc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({ method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER });
 for (const ext of doc.getRoot().listExtensionsUsed()) if (ext.extensionName === 'EXT_meshopt_compression') ext.dispose();
 await io.write(arq, doc);
 console.log('ok', id, t.map(v => (v * e).toFixed(2)).join(' x '), 'm', fs.statSync(arq).size, 'bytes');
}
