import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const text=f=>fs.readFileSync(new URL('../starling/'+f,import.meta.url),'utf8').replace(/\r\n/g,'\n');
const hashes={
  "app.js": "aeb3b17f58710b3e72342ed1b8edecb15a36681ee5532174d878423db9db9629",
  "modelos.js": "6a18be432bd4d3e4e7d8d1a7720372d22f2203348532d7597f21b55b08aa76b1",
  "fisica.js": "9f4976e3663ef8f7ca1faeeefa8cc6cec11e5815d7b2b0b84d838bbfb025dec8",
  "variaveis.js": "ea7e64db03d4c2b662f8907df29bbfc8634fec435769d3de0dd320106ef5c777",
  "style.css": "cdd6680fbadc1cf4398ce49a3cb0d47572a33f91e861cb433745751103fdabd4"
};
test('Starling conserva app, anatomia, física, paleta e estilos da revisão aprovada 5ac3f4c',()=>{for(const [f,h]of Object.entries(hashes))assert.equal(createHash('sha256').update(text(f)).digest('hex'),h,f);});
test('Starling é independente e retorna ao Tutor do percurso de origem',()=>{for(const f of ['index.html','app.js','modelos.js','style.css'])assert.doesNotMatch(text(f),/https?:\/\/(?:drmarionascimento\.github\.io\/lab-ra|raw\.githubusercontent\.com\/DrMarioNascimento\/lab-ra)|bancadas\.html|guard\.js/i);assert.match(text('index.html'),/UNIDADE 1 · CELULAR/);assert.match(text('index.html'),/data-voltar-tutor/);assert.match(text('index.html'),/tutor-origem\.js/);});
test('os dois percursos mantêm as duas experiências celulares em botões iguais',()=>{const c={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../../tutor-ra-card.js',import.meta.url),'utf8'),c);for(const curso of ['educacao-fisica','fisioterapia']){const html=c.window.cardRealidadeAumentada(curso,'celular');for(const experiencia of ['potencial-membrana','starling'])assert.ok(html.includes('class="btn btn-primary" href="ra/'+experiencia+'/?percurso='+curso+'" target="_blank" rel="noopener noreferrer"'));}});
