import * as THREE from 'three';

// Uma única placa, com três alvos de toque largos. O texto usa uma textura
// pequena; cada acesso abre o mesmo painel HTML acessível pelo botão Menu.
export function criarPlaca(madeira) {
  const placa=new THREE.Group(); placa.name='Placa_Menu'; placa.position.set(-27,0,-8);
  const metal=new THREE.MeshStandardMaterial({color:0x455164,metalness:.5,roughness:.5});
  for(const x of [-3.6,3.6]) {
    const poste=new THREE.Mesh(new THREE.BoxGeometry(.35,8.7,.35),metal);poste.position.set(x,4.35,0);placa.add(poste);
  }
  const alvos=[];
  for(const [i,rotulo,secao] of [[0,'COMO JOGAR','ajuda'],[1,'CENÁRIOS','rodada'],[2,'REFLEXÃO','reflexao']]) {
    const y=7.5-i*2.25;
    const tabua=new THREE.Mesh(new THREE.BoxGeometry(10,2.05,.4),madeira);tabua.position.y=y;tabua.name='Placa_'+secao;tabua.userData.secaoMenu=secao;placa.add(tabua);alvos.push(tabua);
    const cv=document.createElement('canvas');cv.width=512;cv.height=128;const ctx=cv.getContext('2d');
    ctx.fillStyle='#fff6df';ctx.font='800 49px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(rotulo,256,64);
    const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;
    const tinta=new THREE.Mesh(new THREE.PlaneGeometry(9.2,1.8),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,toneMapped:false}));tinta.position.set(0,y,.205);tinta.name='Texto_'+secao;placa.add(tinta);
    for(const x of [-4.55,4.55]) {const pino=new THREE.Mesh(new THREE.SphereGeometry(.06,6,4),metal);pino.position.set(x,y,.23);placa.add(pino);}
  }
  return {placa,alvos};
}
