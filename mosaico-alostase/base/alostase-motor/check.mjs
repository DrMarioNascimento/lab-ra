import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try {
for(const [width,height] of [[1440,900],[390,844]]) for(const mode of ['curta','estendida']) for(const pick of [0,1,2]) {
 const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8742/');if(mode==='estendida')await page.locator('input[name=modo][value=estendida]').check({force:true});
 await page.getByRole('button',{name:'Entrar na noite'}).click();
 let rounds=0;
 while(!(await page.getByRole('heading',{name:'O corpo ao acordar'}).count())&&rounds<30){
  const choices=page.locator('div.mt-6.grid.gap-3 > div > button:first-child');
  await choices.nth(pick % await choices.count()).click();
  const confirm=page.getByRole('button',{name:/^Responder com /});if(await confirm.count())await confirm.click();
  const predict=page.locator('[aria-labelledby=previsao] button');if(await predict.count())await predict.nth(pick%await predict.count()).click();
  const next=page.getByRole('button',{name:/Avançar as horas|Ver a manhã/});await next.click();rounds++;
 }
 assert.ok(rounds>=5&&rounds<30,'percurso não terminou');assert.deepEqual(errors,[]);
 await page.getByRole('heading',{name:'O corpo ao acordar'}).waitFor();
 await page.screenshot({path:`preview-${width}-${mode}-${pick}.png`,fullPage:true});
 await page.getByRole('button',{name:'Trocar formato ou corpo'}).click();await page.getByRole('button',{name:'Entrar na noite'}).waitFor();
 console.log(width,mode,pick,rounds,'etapas ok');await page.close();
}
}finally{await browser.close()}
