import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'fs';
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [ent, sai] = process.argv.slice(2);
const d = await io.read(ent);
for (const m of d.getRoot().listMaterials()) {
  m.setMetallicFactor(0).setRoughnessFactor(0.85);
  const t = m.getBaseColorTexture(); t.setImage(fs.readFileSync('/tmp/desc_novo.jpg')).setMimeType('image/jpeg');
  m.setMetallicRoughnessTexture(null);
}
await io.write(sai, d);
