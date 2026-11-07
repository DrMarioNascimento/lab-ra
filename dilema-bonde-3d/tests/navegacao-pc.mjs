// Exercita os controles reais no Chromium, além dos testes de geometria sem GPU.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const raiz=path.resolve(fileURLToPath(new URL('../../',import.meta.url)));
const servidor=http.createServer(async(req,res)=>{
  try {
    const file=path.resolve(raiz,'.'+new URL(req.url,'http://localhost').pathname);
    if(!file.startsWith(raiz+path.sep)){res.writeHead(403).end();return;}
    res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':'application/octet-stream');
    let conteudo=await fs.readFile(file);
    if(file.endsWith('/dilema-bonde-3d/index.html'))conteudo=conteudo.toString().replace('// ---------- interface ----------','window.__testePC={camera,controls,renderer,scene};\n// ---------- interface ----------');
    res.end(conteudo);
  } catch { res.writeHead(404).end(); }
});
await new Promise(r=>servidor.listen(0,'127.0.0.1',r));
let browser;
const relatorio=[];
try {
  browser=await chromium.launch({headless:true,executablePath:process.env.BONDE_CHROMIUM||undefined,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1280,height:800}}),erros=[];
  page.on('pageerror',e=>erros.push(e.message));
  await page.route('https://fonts.**',r=>r.abort());
  await page.addInitScript(()=>window.__captura=true);
  await page.goto(`http://127.0.0.1:${servidor.address().port}/dilema-bonde-3d/index.html?leve=1`,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__pronto,null,{timeout:60000});
  await page.waitForSelector('#carregando',{state:'detached'});
  const estado=()=>page.evaluate(()=>({cam:__testePC.camera.position.toArray(),alvo:__testePC.controls.target.toArray(),dist:__testePC.camera.position.distanceTo(__testePC.controls.target),rota:__maquete.rota}));
  const distancia=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
  assert(await page.locator('#navegacao').isVisible());
  const antes=await estado();await page.getByRole('button',{name:'Aproximar',exact:true}).click();assert((await estado()).dist<antes.dist*.9);
  await page.getByRole('button',{name:'Visão geral',exact:true}).click();assert(Math.abs((await estado()).dist-antes.dist)<.001);
  relatorio.push('Zoom por botão e restauração da visão geral');
  await page.mouse.move(700,370);await page.mouse.down();await page.mouse.move(810,410,{steps:8});await page.mouse.up();
  let depois=await estado();assert(distancia(depois.cam,antes.cam)>2);assert(distancia(depois.alvo,antes.alvo)<.001);
  await page.getByRole('button',{name:'Mover',exact:true}).click();const panAntes=await estado();
  await page.mouse.move(700,370);await page.mouse.down();await page.mouse.move(800,420,{steps:8});await page.mouse.up();
  depois=await estado();assert(distancia(panAntes.alvo,depois.alvo)>1);assert(Math.abs(panAntes.dist-depois.dist)<.001);
  assert.equal(depois.rota,antes.rota);relatorio.push('Mouse: giro e deslocamento sem acionar a alavanca');
  await page.getByRole('button',{name:'Girar',exact:true}).click();const direitoAntes=await estado();
  await page.mouse.move(700,370);await page.mouse.down({button:'right'});await page.mouse.move(780,400,{steps:8});await page.mouse.up({button:'right'});
  assert(distancia((await estado()).alvo,direitoAntes.alvo)>1);assert.equal((await estado()).rota,antes.rota);
  const rodaAntes=(await estado()).dist;await page.mouse.wheel(0,-200);
  await page.waitForFunction(d=>__testePC.camera.position.distanceTo(__testePC.controls.target)<d*.95,rodaAntes);
  relatorio.push('Botão direito e roda do mouse');
  await page.getByRole('button',{name:'Visão geral',exact:true}).click();
  let tecladoAntes=await estado();await page.keyboard.press('ArrowUp');assert(distancia((await estado()).alvo,tecladoAntes.alvo)>1);
  await page.keyboard.press('+');assert((await estado()).dist<tecladoAntes.dist);
  await page.keyboard.press('r');assert(distancia((await estado()).cam,antes.cam)<.001);relatorio.push('Teclado: setas, zoom e R');
  for(const foco of ['bonde','operador','oficina','estacao','cima','geral']) {
    await page.locator('#vista').selectOption(foco);
    assert((await estado()).dist>=4);
    if(!['geral','cima'].includes(foco)) {
      const enquadrado=await page.evaluate(nome=>{
        const obj=__maquete.focos[nome];obj.updateMatrixWorld(true);
        const centro=obj.getWorldPosition(__testePC.controls.target.clone());centro.project(__testePC.camera);
        return Math.abs(centro.x)<1&&Math.abs(centro.y)<1;
      },foco);assert(enquadrado,`foco ${foco}`);
    }
  }
  relatorio.push('Atalhos para seis vistas');
  for(const tamanho of [{width:1280,height:800},{width:1024,height:768}]) {
    await page.setViewportSize(tamanho);
    const a=await page.locator('#navegacao').boundingBox(),b=await page.locator('.barra').boundingBox();
    assert(a.y+a.height<b.y,'painel não cobre os controles do jogo');
  }
  await page.locator('#navegacao summary').click();assert(!await page.locator('#vista').isVisible());await page.locator('#navegacao summary').click();
  const sec=await page.evaluate(()=>__maquete.root.getObjectByName('Ponteiro_Segundos').rotation.z);
  await page.waitForFunction(anterior=>__maquete.root.getObjectByName('Ponteiro_Segundos').rotation.z!==anterior,sec,{timeout:30000,polling:250});
  relatorio.push('Painel recolhível, duas resoluções e relógio em movimento com bonde parado');
  // Captura sem depender do compositor: útil em GPUs de software no CI.
  await page.evaluate(()=>__testePC.renderer.setAnimationLoop(null));
  if(process.env.BONDE_CAPTURAS) {
    await fs.mkdir(process.env.BONDE_CAPTURAS,{recursive:true});
    for(const foco of ['geral','operador','oficina','bonde','estacao','cima']) {
      await page.locator('#vista').selectOption(foco);
      const imagem=await page.evaluate(()=>{__testePC.renderer.render(__testePC.scene,__testePC.camera);return __testePC.renderer.domElement.toDataURL();});
      await fs.writeFile(path.join(process.env.BONDE_CAPTURAS,foco+'.png'),Buffer.from(imagem.split(',')[1],'base64'));
    }
  }
  const mobile=await browser.newContext({viewport:{width:926,height:428},isMobile:true,hasTouch:true});
  const p=await mobile.newPage();await p.route('**/*',async r=>{
    if(r.request().resourceType()==='script'||r.request().resourceType()==='font')await r.abort();else await r.continue();
  });
  await p.goto(`http://127.0.0.1:${servidor.address().port}/dilema-bonde-3d/index.html`,{waitUntil:'domcontentloaded'});
  assert(!await p.locator('#navegacao').isVisible());relatorio.push('Painel de PC ausente no celular');
  assert.deepEqual(erros,[]);console.log('OK: '+relatorio.join('; '));
} finally {await browser?.close();servidor.close();}
