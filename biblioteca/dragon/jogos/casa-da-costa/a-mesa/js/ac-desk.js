/* A escrivaninha d'A Casa: o móvel original do lab-ra, com papéis e tinteiro sobre o tampo. */
(function(global){
  'use strict';
  const script=document.currentScript;
  const asset=new URL('../assets/ac/escrivaninha.glb',script.src).href;
  /* A escrivaninha é a ORIGINAL (a do lab-ra, com o sextante) — Mario,
     18/09/2026: "a escrivaninha original com o sextante está perfeita … é a
     referência (faltam as folhas de papéis em cima, só isso)". Então o modelo
     fica como veio: madeira, tampo, puxadores e o sextante com o braço. O que
     entra é só o que ela não tinha: folhas de papel sobre o tampo e o tinteiro.
     O castiçal e a vela são da atividade (ac-investigacao.js). */
  function finish(root){
    const T=global.THREE;
    root.name='AC-escrivaninha';
    root.traverse(o=>{if(!o.isMesh)return;o.castShadow=o.receiveShadow=true;if(o.material)o.material=o.material.clone();});
    const topo=.765; // face de cima do tampo (medida no GLB)
    const paperCanvas=document.createElement('canvas');paperCanvas.width=512;paperCanvas.height=700;const pc=paperCanvas.getContext('2d');
    pc.fillStyle='#e8dfc8';pc.fillRect(0,0,512,700);
    pc.fillStyle='rgba(120,95,60,.10)';for(let i=0;i<60;i++){pc.beginPath();pc.arc(Math.random()*512,Math.random()*700,Math.random()*18+4,0,Math.PI*2);pc.fill();}
    pc.strokeStyle='rgba(70,55,35,.55)';pc.lineWidth=3;
    for(let i=0;i<13;i++){const w=300+((i*97)%120);pc.beginPath();pc.moveTo(52,80+i*44);pc.lineTo(52+w,80+i*44);pc.stroke();}
    pc.strokeStyle='rgba(40,30,20,.7)';pc.lineWidth=4;pc.beginPath();pc.moveTo(300,640);pc.quadraticCurveTo(360,600,430,650);pc.stroke();
    const paperMap=new T.CanvasTexture(paperCanvas);paperMap.encoding=T.sRGBEncoding;
    const paperMat=new T.MeshStandardMaterial({map:paperMap,roughness:.95});
    /* Quatro folhas, longe do sextante (que fica à esquerda, x −0,31…−0,20) e
       do castiçal (à direita, x ≈ 0,28): uma pilha no meio e uma solta. */
    const folhas=[[-.02,-.05,.03],[.005,-.04,-.05],[-.01,-.06,.08],[.14,.10,.42]];
    folhas.forEach(([x,z,giro],i)=>{const paper=new T.Mesh(new T.BoxGeometry(.21,.0012,.297),paperMat);paper.position.set(x,topo+.0008+i*.0014,z);paper.rotation.y=giro;paper.castShadow=false;paper.receiveShadow=true;paper.name='folha-'+i;root.add(paper);});
    const brass=new T.MeshStandardMaterial({color:0xc39b51,metalness:.75,roughness:.3});
    const ink=new T.Mesh(new T.CylinderGeometry(.03,.034,.05,24),new T.MeshStandardMaterial({color:0x171b22,roughness:.25,metalness:.1}));ink.position.set(.44,topo+.025,-.16);ink.castShadow=true;root.add(ink);
    const cap=new T.Mesh(new T.CylinderGeometry(.018,.018,.012,20),brass);cap.position.set(.44,topo+.056,-.16);root.add(cap);
    const pena=new T.Mesh(new T.CylinderGeometry(.002,.0015,.2,6),new T.MeshStandardMaterial({color:0xe9e2d0,roughness:.8}));pena.position.set(.47,topo+.12,-.15);pena.rotation.z=-.5;pena.rotation.x=.2;root.add(pena);
    return root;
  }
  function load(done,error){new global.THREE.GLTFLoader().load(asset,g=>done(finish(g.scene)),undefined,error);}
  global.ACDesk={load,finish};
})(window);
