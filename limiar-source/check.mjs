import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try {
 for (const [width,height] of [[1440,900],[390,844]]) for (let choice=0;choice<3;choice++){
  const page=await browser.newPage({viewport:{width,height}}); const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8742/',{waitUntil:'load'});
  await page.getByRole('button',{name:'Entrar na noite'}).click();
  let steps=0;
  while(!await page.getByText('O corpo ao acordar',{exact:true}).count() && steps<30){
    const options=page.locator('div.grid.gap-3 > button');await options.nth(choice).click();
    const next=page.getByRole('button',{name:/Avançar as horas|Ver a manhã/});await next.click();steps++;
  }
  assert.ok(steps>0&&steps<30,'não chegou ao laudo');assert.deepEqual(errors,[]);
  await page.getByRole('button',{name:'Outra noite'}).click();await page.getByRole('button',{name:'Entrar na noite'}).waitFor();
  if(choice===0)await page.screenshot({path:'preview-'+width+'.png',fullPage:true});
  console.log(width,choice,steps,'etapas ok');await page.close();
 }
} finally {await browser.close()}
