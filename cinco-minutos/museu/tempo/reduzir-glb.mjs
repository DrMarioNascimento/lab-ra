import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { weld, simplify, prune, dedup, textureCompress, getBounds } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf'; import { MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer'; import sharp from 'sharp';
await MeshoptDecoder.ready; await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.decoder': await draco3d.createDecoderModule(),'draco3d.encoder': await draco3d.createEncoderModule(),'meshopt.decoder':MeshoptDecoder});
const d = await io.read(process.argv[2]);
await d.transform(weld({tolerance:1e-5}), simplify({simplifier:MeshoptSimplifier, ratio:+process.argv[4]||0.02, error:0.01, lockBorder:false}), prune(), dedup(),
  textureCompress({encoder:sharp, targetFormat:'jpeg', resize:[1024,1024], quality:82}));
d.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({method:KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER});
await io.write(process.argv[3], d); console.log('ok');
