(function(global){
 global.ACRoom.create=function(options={}){
 const THREE=global.THREE,layout=ACRoom.layout(options.seed||ACRoom.seed()),salaGroup=new THREE.Group(),objects={};
 salaGroup.name="Casa-da-Costa";
    // Textura de tábuas para o chão
    var fCanvas = document.createElement("canvas");
    fCanvas.width = 512; fCanvas.height = 512;
    var fctx = fCanvas.getContext("2d");
    fctx.fillStyle = "#2a2119"; fctx.fillRect(0, 0, 512, 512);
    const plankWidth=512*.19/5.5;
    for(let i=0;i<29;i++){const v=(Math.sin(i*4.31)*43758.5453123)%1;const tone=v-Math.floor(v);fctx.fillStyle='rgb('+Math.floor(38+tone*16)+','+Math.floor(30+tone*13)+','+Math.floor(22+tone*10)+')';fctx.fillRect(i*plankWidth,0,plankWidth,512);fctx.fillStyle='rgba(0,0,0,.5)';fctx.fillRect(i*plankWidth,0,.7,512);fctx.fillStyle='rgba(255,220,180,.05)';fctx.fillRect(i*plankWidth+1.4,0,.5,512);}
    fctx.strokeStyle='rgba(0,0,0,.32)';fctx.lineWidth=.6;for(let z=.95;z<4.3;z+=.95){fctx.beginPath();fctx.moveTo(0,z/4.3*512);fctx.lineTo(512,z/4.3*512);fctx.stroke();}
    var floorTex = new THREE.CanvasTexture(fCanvas);
    floorTex.encoding=THREE.sRGBEncoding;
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 4.3), new THREE.MeshStandardMaterial({ map: floorTex, roughness: .9, metalness: 0 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; salaGroup.add(floor);
    var ceilMat = new THREE.MeshStandardMaterial({ color: 0x171b21, roughness: 0.9 });
    var ceiling = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 4.3), ceilMat);
    ceiling.visible=!options.miniature;ceiling.rotation.x = Math.PI / 2; ceiling.position.y = 2.95; salaGroup.add(ceiling);
    var wallMat = new THREE.MeshStandardMaterial({ color: 0x3a3730, roughness: 0.85 });
    var wallN = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 2.95), wallMat);
    wallN.position.set(0, 1.475, -2.15); wallN.receiveShadow = true; salaGroup.add(wallN);
    var wallS = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 2.95), wallMat.clone());
    wallS.rotation.y = Math.PI; wallS.position.set(0, 1.475, 2.15); salaGroup.add(wallS);
    var wallE = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 2.95), wallMat.clone());
    wallE.visible=!options.miniature;wallE.rotation.y = -Math.PI / 2; wallE.position.set(2.75, 1.475, 0); salaGroup.add(wallE);
    var wallW = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 2.95), wallMat.clone());
    wallW.rotation.y = Math.PI / 2; wallW.position.set(-2.75, 1.475, 0); salaGroup.add(wallW);

    // --- QUADRO + COFRE ---
    var quadroGroup = new THREE.Group();
    quadroGroup.position.set(-1.2, 1.68, -4.96);
    quadroGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.04), new THREE.MeshStandardMaterial({ color: 0xaa7828, metalness: 0.6, roughness: 0.4 })));
    var telaC = document.createElement("canvas"); telaC.width = 256; telaC.height = 320;
    var tctx = telaC.getContext("2d");
    tctx.fillStyle = "#06101a"; tctx.fillRect(0, 0, 256, 320);
    tctx.fillStyle = "#ffb266"; tctx.beginPath(); tctx.arc(128, 120, 18, 0, Math.PI * 2); tctx.fill();
    var tela = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 0.96), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(telaC) }));
    tela.position.z = 0.025; quadroGroup.add(tela);

    var cofreGroup = new THREE.Group();
    cofreGroup.position.set(-1.2, 1.68, -4.97);
    cofreGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.52, 0.12), new THREE.MeshStandardMaterial({ color: 0x182c22, metalness: 0.8, roughness: 0.3 })));
    var dial = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 24), new THREE.MeshStandardMaterial({ color: 0xe8a44c, metalness: 0.9, roughness: 0.2 }));
    dial.rotation.x = Math.PI / 2; dial.position.z = 0.07; cofreGroup.add(dial);
    salaGroup.add(cofreGroup); salaGroup.add(quadroGroup);
    objects["quadro"] = quadroGroup;
    objects["cofre"] = cofreGroup;

    // --- VASO ---
    var vasoGroup = new THREE.Group();
    vasoGroup.position.set(-3.2, 0, -4.2);
    const profile=[new THREE.Vector2(.11,0),new THREE.Vector2(.132,.08),new THREE.Vector2(.151,.18),new THREE.Vector2(.156,.27),new THREE.Vector2(.155,.34),new THREE.Vector2(.138,.34),new THREE.Vector2(.136,.31)];
    var vasoMesh = new THREE.Mesh(new THREE.LatheGeometry(profile,48), new THREE.MeshStandardMaterial({ color: 0x8d6449, roughness: .9, metalness: 0,side:THREE.DoubleSide }));
    vasoMesh.castShadow = true; vasoGroup.add(vasoMesh);
    const soil=new THREE.Mesh(new THREE.CircleGeometry(.136,32),new THREE.MeshStandardMaterial({color:0x241a12,roughness:1}));soil.rotation.x=-Math.PI/2;soil.position.y=.331;vasoGroup.add(soil);
    const leafSpecs=[[-.9,.30,-.5],[-.35,.40,-.15],[.15,.44,.1],[.7,.34,.5],[1.15,.22,.95],[-1.25,.20,-.9]];
    for (var fi = 0; fi < 6; fi++) {
      const [incl,len,curve]=leafSpecs[fi],vertices=[],indices=[];
      for(let j=0;j<=16;j++){const t=j/16,w=.042*Math.sin(Math.PI*t),cx=curve*.05*t*t;for(const s of [-1,0,1])vertices.push(cx+s*w,len*t,.014*Math.sin(Math.PI*t)*(1-Math.abs(s)));}
      for(let j=0;j<16;j++)for(let k=0;k<2;k++){const a=j*3+k;indices.push(a,a+3,a+1,a+1,a+3,a+4);}
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();
      var folha=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:[0x3f5c33,0x4a6b3a,0x365029,0x527040][fi%4],roughness:.9,side:THREE.DoubleSide}));
      folha.name='Folha-'+fi;folha.position.set(0,.345,(fi-2.5)*.009);folha.rotation.z=incl*.45;vasoGroup.add(folha);
      const veinPoints=[];for(let j=1;j<16;j++){const t=j/16;veinPoints.push(new THREE.Vector3(curve*.05*t*t,len*t,.014*Math.sin(Math.PI*t)+.0005));}
      folha.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(veinPoints),16,.0008,3,false),new THREE.MeshStandardMaterial({color:0x293b20,roughness:1})));
    }
    salaGroup.add(vasoGroup); objects["vaso"] = vasoGroup;

    // --- ESCRIVANINHA + GAVETA + SECRETARIA ---
    var escrivGroup = new THREE.Group();
    escrivGroup.position.set(4.3, 0, -1.5); escrivGroup.rotation.y = -Math.PI / 2;
    // The loaded furniture is identical to the desk used after the blackout.
    var gavetaGroup = new THREE.Group();
    gavetaGroup.position.set(.412,.207833,.286);
    var secretariaMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.18), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5, roughness: 0.4 }));
    secretariaMesh.position.set(0, 0.05, -0.05); gavetaGroup.add(secretariaMesh);
    var ledSec = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff2222 }));
    ledSec.position.set(0.08, 0.09, 0.02); gavetaGroup.add(ledSec);
    escrivGroup.add(gavetaGroup);
    salaGroup.add(escrivGroup);
    objects["escrivaninha"] = escrivGroup;
    objects["gaveta"] = gavetaGroup;
    objects["secretaria"] = secretariaMesh;
    if(options.desk!==false) ACDesk.load(function(model){
      escrivGroup.add(model);
      var drawer=model.getObjectByName('Gaveta');
      if(drawer){
        // Attach the existing recording clue without changing its discovery rules.
        escrivGroup.remove(gavetaGroup);
        secretariaMesh.position.set(0,-.01,-.18);drawer.add(secretariaMesh);
        ledSec.position.set(.08,.03,-.11);drawer.add(ledSec);
        drawer.userData.closedZ=drawer.position.z;
        objects["gaveta"]=drawer;
      }
    },function(error){console.error('Escrivaninha da sala indisponível',error);});


    // --- ESPELHO OVAL ---
    var espelhoGroup = new THREE.Group();
    espelhoGroup.position.set(0.8, 1.7, 4.96); espelhoGroup.rotation.y = Math.PI;
    espelhoGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 12, 32), new THREE.MeshStandardMaterial({ color: 0xb8860b, metalness: 0.8, roughness: 0.25 })));
    var eVidro = new THREE.Mesh(new THREE.CircleGeometry(0.36, 32), new THREE.MeshStandardMaterial({ color: 0xc6e4ff, metalness: 0.95, roughness: 0.05 }));
    eVidro.position.z = 0.01; espelhoGroup.add(eVidro);
    salaGroup.add(espelhoGroup); objects["espelho"] = espelhoGroup;

    // --- JANELA ---
    var janelaGroup = new THREE.Group();
    janelaGroup.position.set(1.4, 1.7, -4.95);
    janelaGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 0.08), new THREE.MeshStandardMaterial({ color: 0x111b24, roughness: 0.7 })));
    var vidroJ = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 1.35), new THREE.MeshStandardMaterial({ color: 0x7fd4ff, transparent: true, opacity: 0.45, roughness: 0.1, metalness: 0.1 }));
    vidroJ.position.z = 0.01; janelaGroup.add(vidroJ);
    salaGroup.add(janelaGroup); objects["janela"] = janelaGroup;

    // --- RELÓGIO DE PÊNDULO ---
    var relogioGroup = new THREE.Group();
    relogioGroup.position.set(-4.96, 1.82, 0); relogioGroup.rotation.y = Math.PI / 2;
    var caixaR=new THREE.Mesh(new THREE.CylinderGeometry(.245,.245,.08,48),new THREE.MeshStandardMaterial({color:0x4a3122,roughness:.48}));
    caixaR.rotation.x=Math.PI/2;caixaR.position.y=.12;relogioGroup.add(caixaR);
    var faceCanvas=document.createElement('canvas');faceCanvas.width=faceCanvas.height=512;
    var faceCtx=faceCanvas.getContext('2d');faceCtx.translate(256,256);faceCtx.scale(512/.49,-512/.49);faceCtx.translate(0,-.12);
    ACRoomArt(faceCtx).relogio(ACRoom.definitions.relogio);
    var faceTexture=new THREE.CanvasTexture(faceCanvas);faceTexture.encoding=THREE.sRGBEncoding;
    var mostrador=new THREE.Mesh(new THREE.CircleGeometry(.245,48),new THREE.MeshStandardMaterial({map:faceTexture,roughness:.5}));
    mostrador.position.set(0,.12,.043);relogioGroup.add(mostrador);
    var penduloGroup = new THREE.Group();
    penduloGroup.position.set(0, .12, .02);penduloGroup.rotation.z=.16;
    var haste = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.25, 0.01), new THREE.MeshStandardMaterial({ color: 0xffc46b, metalness: 0.9 }));
    haste.position.y = -.345; penduloGroup.add(haste);
    var peso = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16), new THREE.MeshStandardMaterial({ color: 0xffc46b, metalness: 0.9 }));
    peso.rotation.x = Math.PI / 2; peso.position.y = -.4704; penduloGroup.add(peso);
    relogioGroup.add(penduloGroup);
    salaGroup.add(relogioGroup);
    objects["relogio"] = relogioGroup;
    objects["pendulo"] = penduloGroup;

    // --- LUMINÁRIA ---
    var abajurGroup = new THREE.Group();
    abajurGroup.position.set(3.8, 0, 3.8);
    var hasteA = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 1.6, 12), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 }));
    hasteA.position.y = 0.8; hasteA.castShadow = true; abajurGroup.add(hasteA);
    var cupula = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.32, 18, 1, true), new THREE.MeshStandardMaterial({ color: 0xffe8c8, roughness: 0.6, side: THREE.DoubleSide }));
    cupula.position.y = 1.55; cupula.rotation.x = Math.PI; abajurGroup.add(cupula);
    salaGroup.add(abajurGroup); objects["luminaria"] = abajurGroup;
    function artFace(id,width,height,y=0){
      const c=document.createElement('canvas');c.width=512;c.height=Math.round(512*height/width);
      const ctx=c.getContext('2d');ctx.translate(c.width/2,c.height/2);ctx.scale(c.width/width,-c.height/height);ctx.translate(0,-y);
      ACRoomArt(ctx)[id](ACRoom.definitions[id]);const map=new THREE.CanvasTexture(c);map.encoding=THREE.sRGBEncoding;
      return new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshStandardMaterial({map,transparent:true,alphaTest:.02,roughness:.65}));
    }
    // Keep real depth; use the same painted detail as the fallback on the front.
    quadroGroup.clear();
    const frame=new THREE.Mesh(new THREE.BoxGeometry(.86,.66,.04),new THREE.MeshStandardMaterial({color:0x4d3320}));quadroGroup.add(frame);
    const painting=artFace('quadro',1.04,.80);painting.position.z=.025;quadroGroup.add(painting);
    janelaGroup.clear();const windowFrame=new THREE.Mesh(new THREE.BoxGeometry(1.05,1.3,.07),new THREE.MeshStandardMaterial({color:0x33261a}));janelaGroup.add(windowFrame);
    const rain=artFace('janela',1.15,1.46);rain.position.z=.04;janelaGroup.add(rain);
    espelhoGroup.clear();const oval=new THREE.Mesh(new THREE.CylinderGeometry(.26,.26,.06,48),new THREE.MeshStandardMaterial({color:0x9c7a4e}));oval.rotation.x=Math.PI/2;oval.scale.z=.74/.52;espelhoGroup.add(oval);
    const mirror=artFace('espelho',.60,.84);mirror.position.z=.04;espelhoGroup.add(mirror);
    const reflectionTarget=new THREE.WebGLCubeRenderTarget(128,{generateMipmaps:true,minFilter:THREE.LinearMipmapLinearFilter,encoding:THREE.sRGBEncoding});
    const mirrorGlass=new THREE.Mesh(new THREE.CircleGeometry(1,48),new THREE.MeshStandardMaterial({color:0xe4ebed,metalness:1,roughness:.07,envMap:reflectionTarget.texture,envMapIntensity:1.2}));
    mirrorGlass.scale.set(.225,.335,1);mirrorGlass.position.z=.045;espelhoGroup.add(mirrorGlass);
    const reflectionCamera=new THREE.CubeCamera(.001,25,reflectionTarget);
    let reflectionFrames=0;
    function updateReflection(renderer,scene){
      if(renderer.xr.isPresenting||!salaGroup.visible)return;
      // Refresh after async furniture loads, then occasionally for moving scene objects.
      if(reflectionFrames++%120!==0)return;
      salaGroup.updateWorldMatrix(true,true);mirrorGlass.getWorldPosition(reflectionCamera.position);
      mirrorGlass.visible=false;
      try{reflectionCamera.update(renderer,scene);}finally{mirrorGlass.visible=true;}
    }
    cofreGroup.clear();const safe=new THREE.Mesh(new THREE.BoxGeometry(.50,.44,.12),new THREE.MeshStandardMaterial({color:0x22392f,metalness:.65,roughness:.4}));cofreGroup.add(safe);
    const safeFace=artFace('cofre',.56,.50);safeFace.position.z=.065;cofreGroup.add(safeFace);
    const crack=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(.046,.33,.148),new THREE.Vector3(.028,.211,.139),new THREE.Vector3(.046,.116,.126)]),new THREE.LineBasicMaterial({color:0x241812}));vasoGroup.add(crack);
    for(let i=0;i<2;i++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),new THREE.MeshStandardMaterial({color:0x46613a,roughness:.9}));leaf.scale.set(.055,.003,.006);leaf.position.set(.20+i*.11,.006,.02);leaf.rotation.y=.9-i*1.7;vasoGroup.add(leaf);}
    for(let i=0;i<3;i++){const foot=new THREE.Mesh(new THREE.CylinderGeometry(.012,.016,.23,8),hasteA.material);foot.position.set(Math.cos(i*2.094)*.10,.07,Math.sin(i*2.094)*.10);foot.rotation.z=.9;foot.rotation.y=-i*2.094;abajurGroup.add(foot);}
    cupula.geometry.dispose();cupula.geometry=new THREE.CylinderGeometry(.13,.23,.32,32,1,true);cupula.rotation.x=0;cupula.position.y=1.46;
    for(let i=0;i<16;i++){const rib=new THREE.Mesh(new THREE.CylinderGeometry(.0015,.0015,.334,6),new THREE.MeshStandardMaterial({color:0xbca888}));const a=i*Math.PI/8;rib.position.set(Math.cos(a)*.18,1.46,Math.sin(a)*.18);rib.rotation.z=.30;rib.rotation.y=-a;abajurGroup.add(rib);}
    // Wallpaper stripes, wooden skirting and cornice from the same room palette.
    const trimMat=new THREE.MeshStandardMaterial({color:0x241d16,roughness:.8}),stripeMat=new THREE.MeshStandardMaterial({color:0x403d35,roughness:1});
    for(const side of [-1,1]){
      for(const y of [.085,2.89]){const t=new THREE.Mesh(new THREE.BoxGeometry(5.5,.17,.03),trimMat);t.position.set(0,y,side*2.135);salaGroup.add(t);const u=new THREE.Mesh(new THREE.BoxGeometry(.03,.17,4.3),trimMat);u.position.set(side*2.735,y,0);salaGroup.add(u);}
      for(let x=-2.6;x<2.7;x+=.27){const strip=new THREE.Mesh(new THREE.BoxGeometry(.085,2.49,.004),stripeMat);strip.position.set(x,1.545,side*2.146);salaGroup.add(strip);}
      for(let z=-2;z<2.1;z+=.27){const strip=new THREE.Mesh(new THREE.BoxGeometry(.004,2.49,.085),stripeMat);strip.position.set(side*2.746,1.545,z);salaGroup.add(strip);}
    }
    const ornamentPoints=[];
    function diamond(x,y,z,east){const corners=east?[[x,y+.1,z],[x,y,z+.06],[x,y-.1,z],[x,y,z-.06]]:[[x,y+.1,z],[x+.06,y,z],[x,y-.1,z],[x-.06,y,z]];for(let i=0;i<4;i++)ornamentPoints.push(new THREE.Vector3(...corners[i]),new THREE.Vector3(...corners[(i+1)%4]));}
    for(const side of [-1,1])for(let y=.62;y<2.60;y+=.58){for(let x=-2.48;x<2.6;x+=.54)diamond(x,y,side*2.143,false);for(let z=-1.88;z<2;z+=.54)diamond(side*2.743,y,z,true);}
    const ornamentVertices=[];
    for(let i=0;i<ornamentPoints.length;i+=2){const a=ornamentPoints[i],b=ornamentPoints[i+1],d=b.clone().sub(a),p=(Math.abs(d.x)<1e-8?new THREE.Vector3(0,-d.z,d.y):new THREE.Vector3(d.y,-d.x,0)).normalize().multiplyScalar(.0015);for(const v of [a.clone().add(p),a.clone().sub(p),b.clone().add(p),b.clone().add(p),a.clone().sub(p),b.clone().sub(p)])ornamentVertices.push(v.x,v.y,v.z);}
    const ornamentGeometry=new THREE.BufferGeometry();ornamentGeometry.setAttribute('position',new THREE.Float32BufferAttribute(ornamentVertices,3));ornamentGeometry.computeVertexNormals();salaGroup.add(new THREE.Mesh(ornamentGeometry,new THREE.MeshStandardMaterial({color:0x514b3f,roughness:1,side:THREE.DoubleSide})));
    const rose=new THREE.Mesh(new THREE.TorusGeometry(.42,.009,6,48),new THREE.MeshStandardMaterial({color:0x53554f,roughness:.85}));rose.rotation.x=Math.PI/2;rose.position.y=2.935;salaGroup.add(rose);
    for(const [id,pose] of Object.entries(layout.objects)){
      const object=objects[id];if(!object||id==='secretaria')continue;
      object.position.set(pose.pos[0],pose.alt,-pose.pos[1]);object.rotation.y=pose.yaw;
    }
    const calibratedMaterials=new Set();
    salaGroup.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;for(const material of (Array.isArray(o.material)?o.material:[o.material])){if(material?.color&&!calibratedMaterials.has(material)){material.color.convertSRGBToLinear();calibratedMaterials.add(material);}}}});
    if(options.powered){const lamp=new THREE.PointLight(0xffdfae,.7,5,2);lamp.position.set(0,1.45,0);abajurGroup.add(lamp);}
    return {root:salaGroup,objects,layout,updateReflection,disposeReflection:()=>reflectionTarget.dispose()};

};
})(window);
