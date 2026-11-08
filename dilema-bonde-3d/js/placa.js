import * as THREE from 'three';

// No gramado frontal indicado no print, entre a via e a borda da maquete.
export const POSICAO_PLACA={x:32,z:44};
export function criarPlaca(madeira) {
  const placa=new THREE.Group();placa.name='Placa_Menu';placa.position.set(POSICAO_PLACA.x,0,POSICAO_PLACA.z);
  const metal=new THREE.MeshStandardMaterial({color:0x4b4d43,metalness:.55,roughness:.65});
  const madeiraPoste=madeira.clone();madeiraPoste.color.setHex(0x80623e);
  for(const x of [-3.6,3.6]){
    const poste=new THREE.Mesh(new THREE.BoxGeometry(.5,8.8,.5),madeiraPoste);poste.position.set(x,4.4,0);poste.castShadow=true;placa.add(poste);
    const pe=new THREE.Mesh(new THREE.BoxGeometry(.62,.65,.62),metal);pe.position.set(x,.33,0);placa.add(pe);
  }
  const shape=new THREE.Shape();shape.moveTo(-4.8,-.94);shape.lineTo(4.8,-.94);shape.quadraticCurveTo(5,-.94,5,-.74);shape.lineTo(5,.74);shape.quadraticCurveTo(5,.94,4.8,.94);shape.lineTo(-4.8,.94);shape.quadraticCurveTo(-5,.94,-5,.74);shape.lineTo(-5,-.74);shape.quadraticCurveTo(-5,-.94,-4.8,-.94);
  const geo=new THREE.ExtrudeGeometry(shape,{depth:.3,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.06,bevelThickness:.06,curveSegments:3});geo.translate(0,0,-.15);
  const p=geo.attributes.position,uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(p.getX(i)+5)/5,(p.getY(i)+1)/2);
  const alvos=[];
  for(const [i,rotulo,secao] of [[0,'COMO JOGAR','ajuda'],[1,'CENÁRIOS','rodada'],[2,'REFLEXÃO','reflexao']]){
    const y=7.5-i*2.25;
    const tabua=new THREE.Mesh(geo,madeira);tabua.position.y=y;tabua.name='Placa_'+secao;tabua.userData.secaoMenu=secao;tabua.castShadow=tabua.receiveShadow=true;placa.add(tabua);alvos.push(tabua);
    const cv=document.createElement('canvas');cv.width=512;cv.height=128;const ctx=cv.getContext('2d');
    ctx.fillStyle='#fff0cf';ctx.font='800 49px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='#342616';ctx.shadowBlur=2;ctx.shadowOffsetY=3;ctx.fillText(rotulo,256,64);
    const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;
    const tinta=new THREE.Mesh(new THREE.PlaneGeometry(9.2,1.8),new THREE.MeshStandardMaterial({map:tex,transparent:true,depthWrite:false,roughness:1}));tinta.position.set(0,y,.215);tinta.name='Texto_'+secao;placa.add(tinta);
    for(const x of [-4.55,4.55]){const pino=new THREE.Mesh(new THREE.SphereGeometry(.075,8,6),metal);pino.scale.z=.45;pino.position.set(x,y,.22);placa.add(pino);}
  }
  return {placa,alvos};
}
