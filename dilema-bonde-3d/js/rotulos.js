import * as THREE from 'three';
import {textoGrupo} from './configuracao.js?v=20261107-ra12';

// Placas baixas em pé, à esquerda do grupo e junto ao lado externo do trilho.
// A posição usa a caixa real das pessoas, inclusive ao trocar tipo e quantidade.
export function criarRotulos(m){
  const itens=[];
  const metal=new THREE.MeshStandardMaterial({color:0x3f4c46,roughness:.85,metalness:.25});
  for(const chave of ['principal','ramal']){
    const placa=new THREE.Group();placa.name='Rotulo_'+chave;m.root.add(placa);
    const canvas=document.createElement('canvas');canvas.height=128;
    const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
    const tabua=new THREE.Mesh(new THREE.BoxGeometry(1,1,.18),m.madeiraPlacas);placa.add(tabua);
    const texto=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshStandardMaterial({map:tex,transparent:true,roughness:1,depthWrite:false}));texto.position.z=.096;placa.add(texto);
    const postes=[-1,1].map(()=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.12,1.2,.12),metal);placa.add(p);return p;});
    itens.push({chave,placa,canvas,tex,tabua,texto,postes});
  }
  return {
    atualizar(c){for(const i of itens){
      const n=i.chave==='principal'?c.nPrincipal:c.nRamal,papel=c[i.chave],rotulo=textoGrupo(papel,n);
      const ctx=i.canvas.getContext('2d');ctx.font='800 38px sans-serif';
      i.canvas.width=Math.ceil(ctx.measureText(rotulo).width+72);
      ctx.font='800 38px sans-serif';ctx.clearRect(0,0,i.canvas.width,128);
      ctx.fillStyle='#243f44';ctx.fillRect(10,10,i.canvas.width-20,108);
      ctx.strokeStyle='#bd9561';ctx.lineWidth=3;ctx.strokeRect(13,13,i.canvas.width-26,102);
      ctx.fillStyle='#fff2d5';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(rotulo,i.canvas.width/2,64);
      const altura=1.65,largura=Math.max(3.2,Math.min(10.8,i.canvas.width/128*altura));
      i.tabua.scale.set(largura,altura,1);i.texto.scale.set(largura*.95,altura*.95,1);
      i.postes.forEach((p,j)=>p.position.set((j?1:-1)*(largura/2-.35),-.8,0));
      const grupo=m.gruposCena[i.chave],esquerda=grupo.userData.esquerda;
      i.placa.position.set(esquerda-.65-largura/2,1.65,grupo.position.z+(i.chave==='ramal'?-2.3:2.3));
      i.placa.visible=c.rotulos;i.placa.userData.texto=rotulo;i.placa.userData.largura=largura;i.tex.needsUpdate=true;
    }},
    remover(){for(const i of itens){i.placa.removeFromParent();i.placa.traverse(o=>o.geometry?.dispose());i.texto.material.dispose();i.tex.dispose();}metal.dispose();}
  };
}
