const fs=require('fs'),http=require('http'),path=require('path'),{chromium}=require('playwright');
// Argumentos opcionais restringem a construção: node construir-portateis.cjs starling
const somente=process.argv.slice(2);
const root=path.resolve(__dirname,'../..'),port=8794,mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.glb':'model/gltf-binary','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost'),file=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}if(url.pathname==='/__build.html'){res.setHeader('Content-Type','text/html');res.end('<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>');return;}fs.readFile(file,(e,b)=>{res.writeHead(e?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(e?'missing':b);});});
(async()=>{await new Promise(r=>server.listen(port,'127.0.0.1',r));const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
try{const jobs=[...['osso-vivo','juncao-neuromuscular','starling'].flatMap(t=>Array.from({length:5},(_,i)=>[t,i])),['musculo-sarcomero',4],['retorno-venoso',2],['retorno-venoso',3],['pleura',1],['coracao',0],['coracao',1],...Array.from({length:4},(_,i)=>['celula',i])].filter(([t])=>!somente.length||somente.includes(t));for(const [tipo,nivel]of jobs){
 const page=await browser.newPage();page.on('pageerror',e=>console.error('PAGE',e.message));
 await page.route('https://cdn.jsdelivr.net/npm/three@0.180.0/**',async route=>{const rel=new URL(route.request().url()).pathname.split('three@0.180.0/')[1];await route.fulfill({path:path.join(root,'node_modules/three',rel),contentType:'text/javascript'});});
 if(tipo==='coracao'){
  await page.goto('http://127.0.0.1:'+port+'/ra/coracao/index.html');
  await page.waitForFunction(()=>typeof window.__compilarCiclo==='function'&&window.__cicloPronto(),null,{timeout:60000});
  const r=await page.evaluate(async n=>{const {glb,pacote}=await window.__compilarCiclo({vista:n===0?'A':'B',N:24,normais:true});const base64=await (await import('/ra/scripts/compilar-ciclos.js')).legendarGLB(glb,n===0?'Coração - vista externa':'Coração - vista interna');return {base64,pacote};},nivel);
  const dir=path.join(root,'ra/coracao/ciclos');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'nivel-'+(nivel+1)+'.glb'),Buffer.from(r.base64,'base64'));delete r.base64;fs.writeFileSync(path.join(dir,'nivel-'+(nivel+1)+'.json'),JSON.stringify(r.pacote,null,2));console.log('coracao',nivel+1,r.pacote.bytes,'bytes; erro máximo',r.pacote.erroInterpolacaoMaxMm,'mm');await page.close();continue;
 }
 await page.goto('http://127.0.0.1:'+port+'/__build.html');
 if(tipo==='celula'){
  const variant=['completa','sem-membrana-celular','sem-membranas-mitocondriais','sem-membranas'][nivel];
  const r=await page.evaluate(async variant=>(await import('/ra/scripts/compilar-ciclos.js')).compilarCelula(variant),variant);
  fs.writeFileSync(path.join(root,'ra/celula/visualizador/celula-v3-'+variant+'.glb'),Buffer.from(r,'base64'));console.log('celula',variant);await page.close();continue;
 }
 const r=await page.evaluate(async({tipo,nivel})=>{const b=await import('/ra/scripts/compilar-ciclos.js');return b.compilar(await b.preparar(tipo,nivel));},{tipo,nivel});
 const dir=path.join(root,'ra',tipo,'ciclos');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'nivel-'+(nivel+1)+'.glb'),Buffer.from(r.base64,'base64'));delete r.base64;fs.writeFileSync(path.join(dir,'nivel-'+(nivel+1)+'.json'),JSON.stringify(r,null,2));console.log(tipo,nivel+1,JSON.stringify(r));await page.close();
}}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});

