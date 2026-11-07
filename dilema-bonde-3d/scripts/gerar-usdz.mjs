// Recria o USDZ a partir da cena e do exportador usados no celular.
// Uso: node dilema-bonde-3d/scripts/gerar-usdz.mjs [saida.usdz]
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const raiz = path.resolve(fileURLToPath(new URL('../../',import.meta.url)));
const saida = path.resolve(process.argv[2] || path.join(raiz,'dilema-bonde-3d/ar/maquete.usdz'));
const html = `<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>`;
const mime = {'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.jpg':'image/jpeg','.png':'image/png','.glb':'model/gltf-binary','.json':'application/json'};
const servidor = http.createServer(async(req,res)=>{
  try {
    const url = new URL(req.url,'http://localhost');
    if (url.pathname === '/__bonde_build') { res.setHeader('Content-Type','text/html'); res.end(html); return; }
    const arquivo = path.resolve(raiz,'.'+decodeURIComponent(url.pathname));
    if (!arquivo.startsWith(raiz+path.sep)) { res.writeHead(403).end(); return; }
    res.setHeader('Content-Type',mime[path.extname(arquivo)] || 'application/octet-stream');
    res.end(await fs.readFile(arquivo));
  } catch { res.writeHead(404).end(); }
});
await new Promise(r=>servidor.listen(0,'127.0.0.1',r));
let browser;
try {
  browser = await chromium.launch({headless:true,executablePath:process.env.BONDE_CHROMIUM || undefined,
    args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const pagina = await browser.newPage();
  pagina.on('pageerror',e=>console.error(e));
  await pagina.goto(`http://127.0.0.1:${servidor.address().port}/__bonde_build`);
  const tamanho = await pagina.evaluate(async()=>{
    const THREE = await import('three');
    const { criarMaquete } = await import('/dilema-bonde-3d/js/cena.js');
    const { montarUSDZ } = await import('/dilema-bonde-3d/ar/quicklook.js');
    const carregado = new Promise(r=>THREE.DefaultLoadingManager.onLoad=r);
    const m = await criarMaquete({ra:true,agora:()=>new Date(2026,0,1,10,10,30)});
    await carregado;
    const {usdz,alinhado} = await montarUSDZ(m);
    if (!alinhado.every(a=>a.ok)) throw new Error('USDZ desalinhado');
    window.pacote = usdz; return usdz.length;
  });
  const arquivo = await fs.open(saida+'.tmp','w');
  try {
    for(let i=0;i<tamanho;i+=65536) {
      const chunk = await pagina.evaluate(i=>btoa(String.fromCharCode(...window.pacote.subarray(i,i+65536))),i);
      await arquivo.write(Buffer.from(chunk,'base64'));
    }
  } finally { await arquivo.close(); }
  await fs.rename(saida+'.tmp',saida);
  console.log(`USDZ reconstruído: ${tamanho} bytes; ${saida}`);
} finally { await browser?.close(); servidor.close(); }
