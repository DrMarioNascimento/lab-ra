import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup, weld, meshopt} from '@gltf-transform/functions';
import {MeshoptEncoder, MeshoptDecoder} from 'meshoptimizer';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
await MeshoptEncoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
const root=new URL('../',import.meta.url);
await fs.mkdir(new URL('integracao/assets/',root),{recursive:true});
const report=[];
for(const [source,name]of [['retorno-venoso/corpo.glb','corpo'],['bancadas/11-coracao/fontes/scan/A-scan-realista.glb','coracao']]){
 const input=new URL(source,root),output=new URL('integracao/assets/'+name+'.glb',root),doc=await io.read(fileURLToPath(input));
 // Sem simplificação: a silhueta e a anatomia aprovadas são preservadas.
 await doc.transform(dedup(),weld(),meshopt({encoder:MeshoptEncoder,level:'high',quantizePosition:16,quantizeNormal:12}));
 await io.write(fileURLToPath(output),doc);
 report.push({name,source,original:(await fs.stat(input)).size,compressed:(await fs.stat(output)).size});
}
await fs.writeFile(new URL('integracao/assets/compressao.json',root),JSON.stringify({method:'EXT_meshopt_compression; sem simplify; posição 16 bits',models:report},null,2)+'\n');
console.log(JSON.stringify(report));
