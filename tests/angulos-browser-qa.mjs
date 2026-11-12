import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const origin = 'http://127.0.0.1:8741';
await fs.mkdir('angulos-qa', {recursive:true});
const browser = await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
let bad=[];
try {
 for (const course of ['angulos','angulos-licenciatura']) for (const number of [6,35,40]) {
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  page.on('pageerror', e=>bad.push(`${course}/${number}: ${e.message}`));
  page.on('console', e=>{if(e.type()==='error'&&!/fonts.googleapis|fonts.gstatic/.test(e.text()))bad.push(`${course}/${number}: ${e.text().slice(0,300)}`)});
  await page.goto(`${origin}/${course}/simulador/`); await page.waitForSelector('#nAl',{timeout:120000});
  await page.locator('#nAl').fill(String(number));
  await page.getByRole('button',{name:'Sortear papéis'}).click();
  const avancar=page.getByRole('button',{name:'Avançar',exact:true});
  const fases=['grupos','lider','viagem','cena','posto','canais','laboratorio','confronto','linhas','integracao'];
  for (const fase of fases) {
   console.log(`Testando ${course}, ${number} alunos: ${fase}`);
   await page.waitForFunction(f=>window.__sala?.st.fase===f,fase,{timeout:45000});
   if(fase==='posto') {
    await page.waitForSelector('.foto img',{timeout:180000});
    if(number===6){await page.locator('.foto img').first().screenshot({path:`angulos-qa/${course}-foto.png`});}
    const info=await page.locator('.foto img').first().evaluate(img=>({loaded:img.complete&&img.naturalWidth>0,w:img.naturalWidth,h:img.naturalHeight}));
    assert.ok(info.loaded&&info.w>=900,`${course}: foto indisponível ou pequena ${JSON.stringify(info)}`);
    if(number===6){let label=page.locator('.foto-zoom-controle').first();await label.click();assert.equal(await label.locator('input').isChecked(),true);await page.screenshot({path:`angulos-qa/${course}-ampliada.png`});await label.click();}
   }
   if(fase==='confronto') {await page.waitForSelector('#slot3d canvas',{timeout:60000}); if(number===6)await page.locator('#telao').screenshot({path:`angulos-qa/${course}-confronto.png`});}
   if(fase==='integracao') break;
   await page.waitForFunction(()=>{let s=window.__sala.st,g=Object.values(s.grupos),id=s.ordem;switch(s.fase){case 'grupos':return g.every(x=>Object.keys(x.achou).length===x.membros.length);case 'lider':return g.every(x=>x.lider);case 'viagem':return id.every(i=>s.resp[i].viagem.concluida);case 'posto':return g.every(x=>x.h1)&&id.every(i=>s.resp[i].posto);case 'canais':return g.every(x=>x.ciente);case 'laboratorio':return g.every(x=>x.h2);default:return true;}},null,{timeout:180000});
   await avancar.click({timeout:30000});
  }
  await page.waitForFunction(()=>{let s=window.__sala.st;return s.ordem.every(i=>s.resp[i].saida)},null,{timeout:180000});
  assert.equal(bad.length,0,bad.join('\n'));
  console.log(`OK ${course}: ${number} alunos, da entrada ao encerramento`); await page.close();
 }
} finally { await browser.close(); }
