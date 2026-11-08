import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const raiz=path.resolve(fileURLToPath(new URL('../../',import.meta.url)));
const servidor=http.createServer(async(req,res)=>{try{const file=path.resolve(raiz,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(raiz+path.sep)){res.writeHead(403).end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404).end();}});
await new Promise(r=>servidor.listen(0,'127.0.0.1',r));let browser;
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.BONDE_CHROMIUM||undefined,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1280,height:800}}),erros=[],glbs=[];page.on('pageerror',e=>erros.push(e.message));page.on('request',r=>{if(r.url().includes('.glb'))glbs.push(r.url());});await page.route('https://fonts.**',r=>r.abort());await page.addInitScript(()=>window.__captura=true);
 const url=`http://127.0.0.1:${servidor.address().port}/dilema-bonde-3d/index.html?leve=1&auditoria`;
 await page.goto(url,{waitUntil:'networkidle'});assert.equal(glbs.length,0,'nenhum GLB antes de escolher qualidade');
 await page.locator('#qualidadeEntrada').selectOption('equilibrada');await page.locator('#carregarMaquete').click();await page.waitForFunction(()=>window.__pronto,null,{timeout:90000});
 const estado=()=>page.evaluate(()=>({cam:__testePC.camera.position.toArray(),alvo:__testePC.controls.target.toArray(),dist:__testePC.camera.position.distanceTo(__testePC.controls.target),rota:__maquete.rota}));const distancia=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
 const abrirNav=async()=>{await page.locator('#menu').click();if(!await page.locator('[data-secao=maquete]').evaluate(e=>e.open))await page.locator('[data-secao=maquete] summary').first().click();};const fechar=()=>page.locator('#fecharMenu').click();
 await abrirNav();const antes=await estado();await page.getByRole('button',{name:'Aproximar',exact:true}).click();assert((await estado()).dist<antes.dist*.9);await page.getByRole('button',{name:'Visão geral',exact:true}).click();await fechar();
 await page.mouse.move(700,370);await page.mouse.down();await page.mouse.move(810,410,{steps:8});await page.mouse.up();let depois=await estado();assert(distancia(depois.cam,antes.cam)>2);assert(distancia(depois.alvo,antes.alvo)<.001);
 await abrirNav();await page.getByRole('button',{name:'Mover',exact:true}).click();await fechar();const panAntes=await estado();await page.mouse.move(700,370);await page.mouse.down();await page.mouse.move(800,420,{steps:8});await page.mouse.up();depois=await estado();assert(distancia(panAntes.alvo,depois.alvo)>1);assert(Math.abs(panAntes.dist-depois.dist)<.001);assert.equal(depois.rota,antes.rota);
 await abrirNav();await page.getByRole('button',{name:'Girar',exact:true}).click();await fechar();const direitoAntes=await estado();await page.mouse.move(700,370);await page.mouse.down({button:'right'});await page.mouse.move(780,400,{steps:8});await page.mouse.up({button:'right'});assert(distancia((await estado()).alvo,direitoAntes.alvo)>1);
 const rodaAntes=(await estado()).dist;await page.mouse.wheel(0,-200);await page.waitForFunction(d=>__testePC.camera.position.distanceTo(__testePC.controls.target)<d*.95,rodaAntes);
 await page.locator('#cena').focus();await page.keyboard.press('r');let tecladoAntes=await estado();await page.keyboard.press('ArrowUp');assert(distancia((await estado()).alvo,tecladoAntes.alvo)>1);await page.keyboard.press('+');assert((await estado()).dist<tecladoAntes.dist);await page.keyboard.press('r');
 await abrirNav();for(const foco of ['bonde','operador','oficina','estacao','cima','geral']){await page.locator('#vista').selectOption(foco);assert((await estado()).dist>=4);}
 await fechar();await page.locator('#play').click();const tempo=await page.locator('#crono').textContent();await page.locator('#menu').click();await page.waitForTimeout(1100);assert.equal(await page.locator('#crono').textContent(),tempo,'menu pausa contagem');await fechar();
 await page.locator('#play').click();assert.equal(await page.locator('#crono').textContent(),'Ⅱ');
 await page.locator('#menu').click();if(!await page.locator('[data-secao=rodada]').evaluate(e=>e.open))await page.locator('[data-secao=rodada] summary').click();await page.locator('[name=nPrincipal]').fill('2');await page.locator('[name=nRamal]').fill('0');await page.locator('[name=tempo]').fill('0');await page.locator('#aplicarMenu').click();await page.waitForFunction(()=>!__testePC.ui.menu.aberta());
 assert.equal(await page.evaluate(()=>__testePC.ui.rodada.config().nRamal),0);await page.locator('#desviar').click();await page.locator('#play').click();
 // O mesmo controlador e as geometrias reais, avançando somente o relógio do teste.
 await page.evaluate(()=>{for(let i=0;i<6000&&__testePC.ui.rodada.estado().fase!=='resultado';i++)__testePC.ui.rodada.atualizar(.05);});
 assert(await page.locator('#resultadoBonde').isVisible());assert((await page.locator('#resultadoBonde').textContent()).includes('Pessoas atingidas: 0'));assert.equal(await page.locator('#resultadoBonde meter').count(),5);
 await page.locator('#novaRodada').click();await page.waitForFunction(()=>!__testePC.ui.menu.aberta());assert.equal(await page.locator('#crono').textContent(),'0');assert(!(await page.locator('#resultadoBonde').textContent()).includes('Pessoas atingidas:'));
 for(const tamanho of [{width:1280,height:800},{width:1024,height:768},{width:390,height:844},{width:844,height:390}]){
  await page.setViewportSize(tamanho);assert(await page.evaluate(()=>{__testePC.navegacao.focar('geral');__testePC.camera.updateMatrixWorld();const obj=__maquete.root.getObjectByName('Base_Terra');obj.updateMatrixWorld(true);const a=obj.geometry.attributes.position,v=__testePC.camera.position.clone();for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i).applyMatrix4(obj.matrixWorld).project(__testePC.camera);if(Math.abs(v.x)>1.001||Math.abs(v.y)>1.001)return false;}return true;}),'visão geral deve enquadrar a base inteira');await page.locator('#menu').click();const box=await page.locator('.menu-painel').boundingBox();assert(box.x>=0&&box.y>=0&&box.x+box.width<=tamanho.width+.1&&box.y+box.height<=tamanho.height+.1);await fechar();assert(await page.locator('#play').isVisible());
 }
 await page.setViewportSize({width:1280,height:800});const sec=await page.evaluate(()=>__maquete.root.getObjectByName('Ponteiro_Segundos').rotation.z);await page.waitForFunction(v=>__maquete.root.getObjectByName('Ponteiro_Segundos').rotation.z!==v,sec,{timeout:15000});
 if(process.env.BONDE_CAPTURAS){await fs.mkdir(process.env.BONDE_CAPTURAS,{recursive:true});await page.evaluate(()=>__testePC.renderer.setAnimationLoop(null));for(const foco of ['geral','operador','oficina','bonde','estacao','cima']){const imagem=await page.evaluate(f=>{__testePC.navegacao.focar(f);__testePC.renderer.render(__testePC.scene,__testePC.camera);return __testePC.renderer.domElement.toDataURL();},foco);await fs.writeFile(path.join(process.env.BONDE_CAPTURAS,foco+'.png'),Buffer.from(imagem.split(',')[1],'base64'));}await page.locator('#menu').click();await page.screenshot({path:path.join(process.env.BONDE_CAPTURAS,'menu.png')});}


 // Posições e rótulos reais, incluindo uma maquete escalada/girada como na RA.
 await page.evaluate(async()=>{const t=__testePC;await t.ui.rodada.nova({...t.ui.rodada.config(),modo:'livre',principal:'trabalhador',ramal:'desconhecidos',nPrincipal:1,nRamal:3,tempo:0,movimentoReduzido:false});t.rotulos.atualizar(t.ui.rodada.config());});
 const placas=await page.evaluate(()=>['principal','ramal'].map(k=>{const p=__maquete.root.getObjectByName('Rotulo_'+k);return {texto:p.userData.texto,w:p.userData.largura,x:p.position.x,y:p.position.y,z:p.position.z,esquerda:__maquete.gruposCena[k].userData.esquerda};}));
 assert.equal(placas[0].texto,'1 Trabalhador');assert.equal(placas[1].texto,'3 Desconhecidos');assert(placas[0].w<placas[1].w);
 for(const p of placas){assert(p.x+p.w/2<p.esquerda-.5);assert(p.y<2);}
 const posicaoPlacas=await page.evaluate(()=>['principal','ramal'].map(k=>__maquete.root.getObjectByName('Rotulo_'+k).position.toArray()));
 await page.evaluate(()=>{const m=__maquete;m.root.scale.setScalar(.005);m.root.rotation.y=.7;__testePC.rotulos.atualizar(__testePC.ui.rodada.config());});
 assert.deepEqual(await page.evaluate(()=>['principal','ramal'].map(k=>__maquete.root.getObjectByName('Rotulo_'+k).position.toArray())),posicaoPlacas);
 await page.evaluate(()=>{__maquete.root.scale.setScalar(1);__maquete.root.rotation.y=0;__testePC.navegacao.focar('geral');});
 if(process.env.BONDE_CAPTURAS){await page.evaluate(()=>{__testePC.renderer.setAnimationLoop(null);__testePC.renderer.render(__testePC.scene,__testePC.camera);});
  for(const nome of ['geral-ra12','menu-ra12','placa-ra12']){
   if(nome==='menu-ra12')await page.locator('#menu').click();
   if(nome==='placa-ra12'){await page.locator('#fecharMenu').click();await page.evaluate(()=>{const t=__testePC;t.camera.position.set(32,11,64);t.controls.target.set(32,4,44);t.controls.update();t.renderer.render(t.scene,t.camera);});}
   const jpg=await page.screenshot({type:'jpeg',quality:58});console.log('RA12_VISUAL:'+JSON.stringify({nome,data:jpg.toString('base64')}));
  }
 }
 await page.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'});
 const ar=await mobile.newPage();ar.on('pageerror',e=>erros.push(e.message));
 await ar.addInitScript(()=>{
  for(const tipo of [window.DeviceMotionEvent,window.DeviceOrientationEvent])if(tipo)Object.defineProperty(tipo,'requestPermission',{configurable:true,value:()=>Promise.resolve('granted')});
  window.XR8={XrController:{configure(){},updateCameraProjectionMatrix(){},pipelineModule:()=>({}),hitTest:()=>[{type:'FEATURE_POINT',position:{x:0,y:0,z:-1}}]},GlTextureRenderer:{pipelineModule:()=>({})},addCameraPipelineModules:ms=>window.pipeline=ms.at(-1),run:()=>window.pipeline.onStart(),stop(){},clearCameraPipelineModules(){}};
 });
 await ar.goto(`http://127.0.0.1:${servidor.address().port}/dilema-bonde-3d/ar/index.html?modo=interativo&auditoria`,{waitUntil:'networkidle'});
 await ar.locator('#qualidadeEntrada').selectOption('economica');await ar.locator('#comecar').click();await ar.waitForFunction(()=>window.__testeRA,null,{timeout:90000});await ar.locator('#comecar').click();await ar.waitForFunction(()=>__testeRA.ra.ativo());
 const quadro=async(status,z=0)=>ar.evaluate(({status,z})=>{const lens=__testeRA.camera.projectionMatrix.elements;pipeline.onUpdate({processCpuResult:{reality:{trackingStatus:status,trackingReason:status==='NORMAL'?'UNSPECIFIED':'INITIALIZING',intrinsics:lens,position:{x:0,y:1.2,z},rotation:{x:0,y:0,z:0,w:1}}}});pipeline.onRender();},{status,z});
 await quadro('LIMITED');assert(await ar.locator('#colocar').isDisabled());await quadro('NORMAL');await ar.locator('#colocar').click();await quadro('NORMAL');assert(!await ar.locator('#play').isDisabled());
 const ancora=await ar.evaluate(()=>__testeRA.ancora.position.toArray());await ar.locator('#play').click();await ar.locator('#menu').click();const cronometro=await ar.locator('#crono').textContent();await ar.evaluate(()=>__testeRA.ui.rodada.atualizar(5));assert.equal(await ar.locator('#crono').textContent(),cronometro);
 await ar.locator('#fecharMenu').click();await quadro('NORMAL',-.2);assert.deepEqual(await ar.evaluate(()=>__testeRA.ancora.position.toArray()),ancora);assert.equal(await ar.evaluate(()=>__testeRA.camera.position.z),-.2);
 await quadro('LIMITED');assert(await ar.locator('#play').isDisabled());await quadro('NORMAL',-.2);assert(!await ar.locator('#play').isDisabled());
 await ar.locator('#menu').click();await ar.locator('[data-secao=maquete] summary').click();await ar.locator('#aumentar').click();assert.equal(await ar.locator('#tamanho').textContent(),'120%');await ar.locator('#colocar').click();await quadro('NORMAL',-.2);assert.equal(await ar.locator('#colocar').textContent(),'Colocar aqui');await ar.locator('#colocar').click();await quadro('NORMAL',-.2);assert.deepEqual(await ar.evaluate(()=>__testeRA.ancora.position.toArray()),ancora);

 // A RA interativa mantém a animação visível após o impacto, com âncora estável.
 const fantasmasRA=await ar.evaluate(async()=>{const t=__testeRA,r=t.ui.rodada;await r.nova({...r.config(),modo:'livre',principal:'trabalhador',ramal:'desconhecidos',nPrincipal:1,nRamal:3,tempo:0,movimentoReduzido:false});t.rotulos.atualizar(r.config());r.play();r.atualizar(.05);t.m.irPara('principal',t.m.S_ALVO.principal-7.5);let pico=0,altura=0;for(let i=0;i<100;i++){r.atualizar(1/30);for(const f of t.m.gruposCena.principal.userData.fantasmas.children){pico=Math.max(pico,f.scale.x);altura=Math.max(altura,f.position.y);}}return {pico,altura,ancora:t.ancora.position.toArray()};});
 assert(fantasmasRA.pico>2&&fantasmasRA.altura>5);assert.deepEqual(fantasmasRA.ancora,ancora);
 await ar.evaluate(async()=>{const r=__testeRA.ui.rodada;await r.nova({...r.config(),tempo:0});r.play();for(let i=0;i<6000&&r.estado().fase!=='resultado';i++)r.atualizar(.05);});assert((await ar.locator('#resultadoBonde').textContent()).includes('Pessoas atingidas:'));await ar.locator('#fecharMenu').click();await ar.locator('#sair').click();assert(!(await ar.locator('#resultadoBonde').textContent()).includes('Pessoas atingidas:'));assert(await ar.locator('#inicio').isVisible());const configAntes=await ar.evaluate(()=>__testeRA.ui.rodada.config());await ar.locator('#comecar').click();await ar.waitForFunction(()=>document.getElementById('comecar').textContent==='Abrir em realidade aumentada'&&!document.getElementById('comecar').disabled);const configDepois=await ar.evaluate(()=>__testeRA.ui.rodada.config());assert.notEqual(configAntes.principal,configDepois.principal);assert.notEqual(configAntes.nPrincipal,configDepois.nPrincipal);await ar.locator('#comecar').click();await quadro('NORMAL');await ar.locator('#colocar').click();await quadro('NORMAL');assert.equal(await ar.evaluate(()=>__testeRA.ancora.scale.x),1);await ar.locator('#sair').click();
 assert.equal(await ar.evaluate(()=>__testeRA.m.root.userData.arvoresComuns),18);
 await ar.goto(`http://127.0.0.1:${servidor.address().port}/dilema-bonde-3d/ar/index.html?modo=nativo`,{waitUntil:'networkidle'});assert(await ar.locator('#linkAR').isVisible());await ar.locator('#menu').click();assert(await ar.locator('[name=nPrincipal]').isVisible());assert(!await ar.locator('[name=tempo]').isVisible());assert.equal(await ar.locator('#linkAR').getAttribute('rel'),'ar');
 await mobile.close();
 assert.deepEqual(erros,[]);console.log('OK: qualidade antes de carregar; zoom/giro/pan/mouse/teclado; 6 vistas; pausa; configuração 2/0; percurso e reflexão; nova rodada; 4 tamanhos; relógio; console limpo; RA com rastreador simulado: preparo econômico, colocação, menu, âncora, perda/retorno, escala e reentrada; entrada nativa. GLBs: '+glbs.length);
}finally{await browser?.close();servidor.close();}
