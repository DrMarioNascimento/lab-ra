import test from 'node:test';
import assert from 'node:assert/strict';
import {textoVolume,placaVolume} from '../texto-volume.js';
test('acentos, cargas e subscritos químicos produzem letras sólidas e finitas',()=>{
 for(const text of ['Célula viva','Inversão das cargas','3 Na⁺ / 2 K⁺','O₂ / CO₂','ATP → transporte','Contração e Relaxar']){
  const m=textoVolume(text,{largura:.4,altura:.035,profundidade:.003}),b=m.geometry.boundingBox;
  assert(b.max.z-b.min.z>.0029);assert(b.max.x-b.min.x<=.40001);assert(b.max.y-b.min.y<=.03501);
  assert(m.geometry.attributes.position.array.every(Number.isFinite));
  const normals=m.geometry.attributes.normal;let frente=false,costas=false,lado=false;
  for(let i=0;i<normals.count;i++){frente ||= normals.getZ(i)>.9;costas ||= normals.getZ(i)<-.9;lado ||= Math.abs(normals.getZ(i))<.5;}
  assert(frente&&costas&&lado,'letra precisa ter frente, verso e paredes');
  m.geometry.dispose();m.material.dispose();
 }
});
test('letras ficam acima da superfície de uma placa espessa',()=>{
 const p=placaVolume('Contrair',{largura:.16,altura:.065,espessura:.006}),base=p.children[0],texto=p.children[1];
 base.geometry.computeBoundingBox();texto.geometry.computeBoundingBox();
 assert(base.geometry.boundingBox.max.z-base.geometry.boundingBox.min.z>.0059);
 assert(texto.position.z+texto.geometry.boundingBox.min.z>base.geometry.boundingBox.max.z);
});

