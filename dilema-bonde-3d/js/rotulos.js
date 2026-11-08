import * as THREE from 'three';
import {PAPEIS} from './configuracao.js?v=20261107-ra11';
export function criarRotulos(root){
  const itens=[];
  for(const [x,z] of [[4,30],[-8,4]]){
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;
    const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
    const material=new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false});
    const sprite=new THREE.Sprite(material);sprite.scale.set(14,2.625,1);sprite.position.set(x,8,z);sprite.renderOrder=20;root.add(sprite);itens.push({canvas,tex,sprite});
  }
  return {atualizar(c){itens.forEach(({canvas,tex,sprite},i)=>{sprite.visible=c.rotulos;if(i)sprite.position.x=-8-Math.max(0,c.nRamal-3)*1.02;const ctx=canvas.getContext('2d');ctx.clearRect(0,0,512,96);ctx.fillStyle='#16223ae6';ctx.fillRect(0,0,512,96);ctx.fillStyle='#fff';ctx.font='700 34px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(i&&c.nRamal===0?'Ramal livre':`${i?c.nRamal:c.nPrincipal} · ${PAPEIS[i?c.ramal:c.principal]}`,256,48,490);tex.needsUpdate=true;});},remover(){itens.forEach(({tex,sprite})=>{sprite.removeFromParent();sprite.material.dispose();tex.dispose();});}};
}
