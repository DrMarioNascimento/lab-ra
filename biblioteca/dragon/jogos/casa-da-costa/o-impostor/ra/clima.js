/* Clima local à maquete: acompanha a âncora nos motores WebXR e 8th Wall.

   25/10/2026 (Mario: "a maquete d'A Casa merece atenção: trovões, nevoeiro e
   chuva. Idem farol."). A versão de 25/10 era tímida: 72 riscos finos, oito
   véus a 17% e um traço de relâmpago por 0,13 s a cada 23 s, sem som — e as
   gotas atravessavam o telhado. Esta é uma tempestade, com a MESMA interface
   (criar → update, dispose, grupo, estado) e as mesmas garantias:

   - tudo é filho da raiz da peça: acompanha a âncora, a pose e a escala;
   - nada recebe toque (raycast desligado em todo o grupo);
   - o botão liga e desliga num toque; movimento reduzido começa desligado;
   - não toca em estados, pistas, temporizadores nem pontuação.

   O que há agora:
   - CHUVA com vento em rajadas; cada gota pousa onde a peça está (um raio para
     baixo, só contra as peças sob ela, refeito aos poucos para acompanhar as
     camadas que se abrem) e respinga ali — no telhado, no pátio, na pedra;
   - NEVOEIRO em bancos que rastejam junto à base e sobem em fiapos, com
     profundidade: a casa esconde o que está atrás dela;
   - RELÂMPAGO ramificado, que ilumina a peça de cima, e clarões distantes sem
     raio entre um e outro; no máximo dois pulsos por descarga, espaçados, para
     ficar longe do limite de três clarões por segundo;
   - TROVÃO e chuva no som, sintetizados (sem arquivo), com o atraso que a
     distância daria. O som obedece à chave de silêncio do iPhone
     (audioSession 'ambient') e só nasce depois do primeiro toque na tela.

   op: { limites:[[x,y,z],[x,y,z]], reduzido, host, forca (1 = tempestade;
   0,6 = chuva de narrativa), som (padrão true),
   interno (true = cômodo: sem chuva nem nevoeiro na peça; só o clarão que
   entra pela janela e o trovão), janela:[x,y,z] (de onde vem o clarão),
   aoClarao(brilho 0–1, a cada quadro: para janelas e luzes reagirem) }
   O objeto devolvido também expõe vento(t), a mesma rajada da chuva. */
(function(global){
 'use strict';
 var AUDIO=null;
 function audio(){
  if(AUDIO)return AUDIO;
  var AC=global.AudioContext||global.webkitAudioContext;if(!AC)return null;
  try{if(global.navigator&&navigator.audioSession)navigator.audioSession.type='ambient';}catch(e){}
  var ctx;try{ctx=new AC();}catch(e){return null;}
  function ruido(seg,marrom){var n=Math.floor(ctx.sampleRate*seg),buf=ctx.createBuffer(1,n,ctx.sampleRate),d=buf.getChannelData(0),u=0,s=99173;
   for(var i=0;i<n;i++){s=(Math.imul(s,1664525)+1013904223)>>>0;var w=s/2147483648-1;if(marrom){u=(u+.02*w)/1.02;d[i]=u*3.5;}else d[i]=w;}return buf;}
  var mestre=ctx.createGain();mestre.gain.value=.9;mestre.connect(ctx.destination);
  var branco=ruido(2.5,false),marrom=ruido(6,true);
  var chuva=ctx.createBufferSource();chuva.buffer=branco;chuva.loop=true;
  var hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=900;
  var lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=6500;
  var gChuva=ctx.createGain();gChuva.gain.value=0;
  chuva.connect(hp);hp.connect(lp);lp.connect(gChuva);gChuva.connect(mestre);chuva.start();
  AUDIO={ctx:ctx,mestre:mestre,branco:branco,marrom:marrom,gChuva:gChuva,usuarios:0};
  return AUDIO;
 }
 function trovao(A,distancia,forca){
  var ctx=A.ctx,t0=ctx.currentTime+.02,perto=Math.max(0,1-distancia/3.2),pico=(.35+.55*perto)*forca;
  var src=ctx.createBufferSource();src.buffer=A.marrom;
  var lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(260+300*perto,t0);lp.frequency.exponentialRampToValueAtTime(90,t0+4.5);
  var g=ctx.createGain();g.gain.setValueAtTime(0,t0);
  /* o estalo de perto, depois o rolar: rajadas que se apagam de forma desigual */
  g.gain.linearRampToValueAtTime(pico,t0+.04+.25*(1-perto));
  var t=t0+.3,v=pico;for(var k=0;k<7;k++){t+=.25+Math.random()*.45;v*=.62+Math.random()*.3;g.gain.linearRampToValueAtTime(v*(.6+Math.random()*.6),t);}
  g.gain.linearRampToValueAtTime(0,t+1.2);
  src.connect(lp);lp.connect(g);g.connect(A.mestre);src.start(t0,Math.random()*1.5);src.stop(t+1.3);
  if(perto>.45){var s2=ctx.createBufferSource();s2.buffer=A.branco;var hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=1800;
   var g2=ctx.createGain();g2.gain.setValueAtTime(.0001,t0);g2.gain.exponentialRampToValueAtTime(.32*perto*forca,t0+.012);g2.gain.exponentialRampToValueAtTime(.0001,t0+.35);
   s2.connect(hp);hp.connect(g2);g2.connect(A.mestre);s2.start(t0);s2.stop(t0+.4);}
 }

 function criar(raiz,op){
  op=op||{};var T=global.THREE,box=new T.Box3().setFromObject(raiz),inv=new T.Matrix4().copy(raiz.matrixWorld).invert();
  if(op.limites)box=new T.Box3(new T.Vector3().fromArray(op.limites[0]),new T.Vector3().fromArray(op.limites[1]));
  else box.applyMatrix4(inv);
  var size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3()),L=Math.max(size.x,size.y,size.z,.1);
  var forca=op.forca===undefined?1:op.forca,comSom=op.som!==false,interno=!!op.interno,aoClarao=op.aoClarao||null,brilhoAgora=0;
  var grupo=new T.Group();grupo.name='clima_local';grupo.userData.naoExportar=true;raiz.add(grupo);
  var reduzido=op.reduzido===undefined?(global.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches):op.reduzido;
  var ligado=!reduzido,tempo=0,seed=251026,dummy=new T.Object3D(),drops=[];
  function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
  var topo=box.max.y+size.y*.45,chao=box.min.y;

  /* ---------- vento: a mesma rajada move chuva e nevoeiro ---------- */
  function vento(t){var r=.5+.5*Math.sin(t*.21+1.3);return .16+.12*Math.sin(t*.37)+.06*Math.sin(t*1.31+1)+.22*r*r*r;}

  /* ---------- chuva ---------- */
  var N=Math.max(60,Math.round(420*forca));
  var chuva=new T.InstancedMesh(new T.BoxGeometry(L*.0007,L*.03,L*.0007),new T.MeshBasicMaterial({color:0xc9dcea,transparent:true,opacity:.38,depthWrite:false}),N);
  chuva.instanceMatrix.setUsage(T.DynamicDrawUsage);chuva.frustumCulled=false;grupo.add(chuva);chuva.visible=!interno;
  var mx=size.x*.12,mz=size.z*.12;
  for(var i=0;i<N;i++)drops.push({x:box.min.x-mx+(size.x+2*mx)*rnd(),z:box.min.z-mz+(size.z+2*mz)*rnd(),pouso:chao,fase:rnd(),speed:.85+rnd()*.45,volta:-1});
  /* respingos: anéis que se abrem onde a gota pousa */
  var NS=Math.round(56*forca),resp=[],ri=0;
  var anel=new T.InstancedMesh(new T.RingGeometry(L*.0016,L*.0026,10).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0xb9ccd8,transparent:true,opacity:.32,depthWrite:false,side:T.DoubleSide}),NS);
  anel.instanceMatrix.setUsage(T.DynamicDrawUsage);anel.frustumCulled=false;grupo.add(anel);anel.visible=!interno;
  for(i=0;i<NS;i++)resp.push({x:0,y:-1e3,z:0,t:9});

  /* onde a gota pousa: um raio por gota, só contra as peças sob ela */
  var ray=new T.Raycaster(),alvos=[],alvosEm=-9,cursor=0,origem=new T.Vector3(),baixo=new T.Vector3(),q=new T.Quaternion(),bb=new T.Box3();
  function coletar(){
   alvos=[];raiz.updateMatrixWorld(true);var invR=new T.Matrix4().copy(raiz.matrixWorld).invert();
   raiz.traverseVisible(function(o){if(!o.isMesh||o===chuva||o===anel)return;for(var p=o;p;p=p.parent)if(p===grupo)return;
    if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld).applyMatrix4(invR);
    alvos.push({o:o,x0:bb.min.x,x1:bb.max.x,z0:bb.min.z,z1:bb.max.z});});
  }
  function pousar(d){
   var cand=[];for(var k=0;k<alvos.length;k++){var a=alvos[k];if(d.x>=a.x0&&d.x<=a.x1&&d.z>=a.z0&&d.z<=a.z1)cand.push(a.o);}
   if(!cand.length){d.pouso=chao;return;}
   origem.set(d.x,topo,d.z);raiz.localToWorld(origem);raiz.getWorldQuaternion(q);baixo.set(0,-1,0).applyQuaternion(q);
   ray.set(origem,baixo);var h=ray.intersectObjects(cand,false);
   d.pouso=h.length?raiz.worldToLocal(h[0].point.clone()).y:chao;
  }

  /* ---------- nevoeiro: bancos baixos e fiapos, com profundidade ---------- */
  var cv=document.createElement('canvas');cv.width=cv.height=128;var g=cv.getContext('2d');
  /* muitos tufos pequenos dentro de um envelope redondo: borda que se desfaz,
     sem a mancha de contorno nítido da primeira volta */
  for(i=0;i<60;i++){var an=rnd()*6.28,rr=rnd()*34,cx=64+Math.cos(an)*rr,cy=64+Math.sin(an)*rr*.7,r=10+rnd()*18,gr=g.createRadialGradient(cx,cy,0,cx,cy,r);
   gr.addColorStop(0,'rgba(236,242,245,.16)');gr.addColorStop(1,'rgba(230,238,242,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);}
  var env=g.getImageData(0,0,128,128);for(i=0;i<128*128;i++){var px=i%128-64,py=(i/128|0)-64,dd=Math.sqrt(px*px+py*py*1.6)/64;env.data[i*4+3]*=Math.max(0,1-dd*dd);}g.putImageData(env,0,0);
  var tex=new T.CanvasTexture(cv),mist=[],mats=[.32,.44,.56].map(function(o){return new T.SpriteMaterial({map:tex,color:0xeef3f6,transparent:true,opacity:o*Math.min(1,.6+.4*forca),depthWrite:false});});
  var NM=Math.round(40*Math.min(1,.5+.5*forca));
  for(i=0;i<NM;i++){
   var baixoBanco=i<NM*.75,s=new T.Sprite(mats[i%3]),e=L*(baixoBanco?.34+rnd()*.26:.18+rnd()*.14);
   s.scale.set(e*1.6,e*(baixoBanco?.55:.8),1);
   s.userData={x:box.min.x-mx+(size.x+2*mx)*rnd(),z:box.min.z-mz+(size.z+2*mz)*rnd(),y:baixoBanco?chao+size.y*(.04+rnd()*.16):chao+size.y*(.25+rnd()*.35),f:rnd()*6.28,v:.6+rnd()*.8};
   s.renderOrder=3;s.visible=!interno;grupo.add(s);mist.push(s);
  }

  /* ---------- relâmpago ---------- */
  var luz=new T.PointLight(0xc4dcff,0,0,1);luz.position.set(center.x,topo,center.z);grupo.add(luz);
  /* no cômodo, o clarão vem de onde está a janela */
  if(op.janela)luz.position.fromArray(op.janela);
  var ceu=new T.HemisphereLight(0xb8d0ff,0x1a2230,0);grupo.add(ceu);
  var matRaio=new T.MeshBasicMaterial({color:0xf2f7ff,transparent:true,opacity:1,depthWrite:false,blending:T.AdditiveBlending});
  var matHalo=new T.MeshBasicMaterial({color:0x6f9cff,transparent:true,opacity:.28,depthWrite:false,blending:T.AdditiveBlending});
  var raio=null,descarga=null,proxima=4+rnd()*4,clarao=null,proxClarao=2+rnd()*3,trovoes=[],nRaios=0;
  function zigue(a,b,nivel,desvio,pts){
   if(nivel===0){pts.push(b);return;}
   var m=a.clone().lerp(b,.5);m.x+=(rnd()-.5)*desvio;m.z+=(rnd()-.5)*desvio;m.y+=(rnd()-.5)*desvio*.3;
   zigue(a,m,nivel-1,desvio*.55,pts);zigue(m,b,nivel-1,desvio*.55,pts);
  }
  function tubo(pts,rr,mat){var c=new T.CurvePath();for(var k=1;k<pts.length;k++)c.add(new T.LineCurve3(pts[k-1],pts[k]));return new T.Mesh(new T.TubeGeometry(c,pts.length*2,rr,4,false),mat);}
  function limparRaio(){if(!raio)return;grupo.remove(raio);raio.traverse(function(o){if(o.geometry)o.geometry.dispose();});raio=null;}
  function cair(){
   limparRaio();nRaios++;
   var lado=rnd()<.5?-1:1,ini=new T.Vector3(center.x+(rnd()-.5)*size.x*.9,topo+size.y*.55,center.z+(rnd()-.5)*size.z*.9);
   var fim=new T.Vector3(center.x+lado*(size.x*.35+rnd()*size.x*.35),chao,center.z+(rnd()-.5)*size.z*1.1);
   var pts=[ini];zigue(ini,fim,5,L*.22,pts);
   raio=new T.Group();raio.add(tubo(pts,L*.0016,matRaio));raio.add(tubo(pts,L*.0042,matHalo));
   for(var k=0;k<3;k++){var j=3+Math.floor(rnd()*(pts.length-8)),a=pts[j],b=a.clone().add(new T.Vector3((rnd()-.5)*L*.35,-size.y*(.15+rnd()*.25),(rnd()-.5)*L*.35)),pr=[a];zigue(a,b,3,L*.08,pr);raio.add(tubo(pr,L*.0009,matRaio));}
   raio.traverse(function(o){o.raycast=function(){};});grupo.add(raio);
   luz.position.copy(ini.clone().lerp(fim,.6));
   descarga={t:0,dist:.6+rnd()*2.4};
   trovoes.push({em:tempo+descarga.dist*.9,dist:descarga.dist});
  }
  /* dois pulsos por descarga, o segundo a 0,35 s: abaixo de três por segundo */
  function pulso(t){var a=t<.09?1-t/.09*.4:t<.35?Math.max(0,.6-(t-.09)*3):t<.46?.85*(1-(t-.35)/.11):0;return Math.max(0,a);}

  grupo.traverse(function(o){o.raycast=function(){};});

  /* ---------- som ---------- */
  var A=null,ultimo=0,vigia=0;
  function destravar(){if(!comSom)return;A=A||audio();if(A){if(A.ctx.state!=='running')A.ctx.resume();}}
  if(comSom){global.addEventListener('pointerdown',destravar,true);global.addEventListener('touchend',destravar,true);}
  /* só quando o alvo muda: agendar a cada quadro empilha eventos de automação sem fim */
  var volAtual=-1;function volumeChuva(alvo){if(!A||Math.abs(alvo-volAtual)<.004)return;volAtual=alvo;try{A.gChuva.gain.setTargetAtTime(alvo,A.ctx.currentTime,.4);}catch(e){}}
  vigia=global.setInterval(function(){if(performance.now()-ultimo>450)volumeChuva(0);},300);

  /* ---------- botão ---------- */
  var button=document.createElement('button');button.type='button';button.className='ra-clima-toggle';button.style.cssText='min-height:44px;padding:8px 12px;border-radius:12px;border:1px solid #9baebc;background:linear-gradient(#374653,#162531);box-shadow:inset 0 1px 2px #ffffff50,0 3px 8px #0006;color:#edf5f8;font:600 12px system-ui;cursor:pointer';
  var host=op.host||document.querySelector('.tools,.acoes')||document.body;host.appendChild(button);
  function pintar(){grupo.visible=ligado;luz.intensity=0;ceu.intensity=0;if(!ligado){limparRaio();descarga=null;volumeChuva(0);brilhoAgora=0;if(aoClarao)aoClarao(0);}
   button.textContent=ligado?'Clima: ligado':'Clima: desligado';button.setAttribute('aria-pressed',String(ligado));}
  button.title='Chuva, nevoeiro, relâmpagos e trovões. Não interfere nas pistas.';
  button.onclick=function(){ligado=!ligado;destravar();pintar();};pintar();

  function update(dt){
   ultimo=performance.now();
   if(!ligado||document.hidden){volumeChuva(0);if(brilhoAgora&&aoClarao)aoClarao(0);brilhoAgora=0;return;}
   dt=Math.max(0,Math.min(.05,dt||0));tempo+=dt;var w=vento(tempo);
   /* pouso das gotas: as peças visíveis a cada 2 s, duas gotas por quadro
      (cada raio contra a casa custa ~0,26 ms no computador; doze passavam de 3 ms; a volta inteira leva uns 3,5 s) */
   if(!interno){if(tempo-alvosEm>2){coletar();alvosEm=tempo;}
   for(var k=0;k<2;k++){pousar(drops[cursor]);cursor=(cursor+1)%N;}}
   /* a inclinação do vento é a mesma para todas as gotas no quadro: a rotação
      vai uma vez, e por gota só se escreve a posição na matriz */
   if(!interno){var ang=-Math.atan(w*.35),cs=Math.cos(ang),sn=Math.sin(ang),M=chuva.instanceMatrix.array;
   for(var i=0;i<N;i++){
    var d=drops[i],cai=topo-d.pouso,c=tempo*d.speed*(size.y*2.2/Math.max(cai,1e-3))*.5+d.fase,volta=Math.floor(c),u=c-volta;
    if(volta!==d.volta){if(d.volta>=0){var sp=resp[ri];sp.x=d.x+w*cai*.35;sp.y=d.pouso+L*.001;sp.z=d.z;sp.t=0;ri=(ri+1)%NS;}d.volta=volta;}
    var y=topo-cai*u,o=i*16;
    M[o]=cs;M[o+1]=sn;M[o+2]=0;M[o+3]=0;M[o+4]=-sn;M[o+5]=cs;M[o+6]=0;M[o+7]=0;M[o+8]=0;M[o+9]=0;M[o+10]=1;M[o+11]=0;
    M[o+12]=d.x+w*(topo-y)*.35;M[o+13]=y;M[o+14]=d.z;M[o+15]=1;
   }
   chuva.instanceMatrix.needsUpdate=true;
   var R=anel.instanceMatrix.array;
   for(i=0;i<NS;i++){var p=resp[i];p.t+=dt;var a=p.t/.28,e=a<1?.4+a*1.6:1e-4,o2=i*16;
    R[o2]=e;R[o2+1]=0;R[o2+2]=0;R[o2+3]=0;R[o2+4]=0;R[o2+5]=1;R[o2+6]=0;R[o2+7]=0;R[o2+8]=0;R[o2+9]=0;R[o2+10]=e;R[o2+11]=0;
    R[o2+12]=p.x;R[o2+13]=a<1?p.y:-1e3;R[o2+14]=p.z;R[o2+15]=1;}
   anel.instanceMatrix.needsUpdate=true;
   for(i=0;i<mist.length;i++){var m=mist[i],u2=m.userData;
    var dx=((u2.x-box.min.x+mx+tempo*w*L*.03*u2.v)%(size.x+2*mx)+(size.x+2*mx))%(size.x+2*mx);
    m.position.set(box.min.x-mx+dx,u2.y+Math.sin(tempo*.3+u2.f)*size.y*.02,u2.z+Math.sin(tempo*.11+u2.f)*size.z*.03);}}
   /* relâmpagos e clarões distantes */
   var brilho=0;
   if(descarga){descarga.t+=dt;brilho=descarga.segura?1:pulso(descarga.t);if(raio){matRaio.opacity=Math.min(1,brilho*1.2);matHalo.opacity=.28*brilho;raio.visible=brilho>.05;}if(descarga&&descarga.t>.6&&!descarga.segura){descarga=null;limparRaio();proxima=tempo+9+rnd()*14;}}
   else if(tempo>proxima){if(interno){descarga={t:0,dist:.8+rnd()*2.2};trovoes.push({em:tempo+descarga.dist*.9,dist:descarga.dist});}else cair();}
   if(clarao){clarao.t+=dt;brilho=Math.max(brilho,.35*pulso(clarao.t*1.3));if(clarao.t>.5)clarao=null;}
   else if(tempo>proxClarao&&!descarga){clarao={t:0};proxClarao=tempo+5+rnd()*8;trovoes.push({em:tempo+2.6+rnd()*1.5,dist:3+rnd()});}
   luz.intensity=2.4*forca*brilho;ceu.intensity=.9*forca*brilho;brilhoAgora=brilho;if(aoClarao)aoClarao(brilho);
   /* som */
   volumeChuva(A&&comSom?(interno?.05:.11)*forca*(.8+.4*w):0);
   for(i=trovoes.length-1;i>=0;i--)if(tempo>=trovoes[i].em){if(A&&comSom&&A.ctx.state==='running')trovao(A,trovoes[i].dist,forca);trovoes.splice(i,1);}
  }
  function dispose(){
   button.remove();global.clearInterval(vigia);volumeChuva(0);
   if(global.__raClimas){var k=global.__raClimas.indexOf(inst);if(k>=0)global.__raClimas.splice(k,1);}
   if(comSom){global.removeEventListener('pointerdown',destravar,true);global.removeEventListener('touchend',destravar,true);}
   limparRaio();if(grupo.parent)grupo.parent.remove(grupo);
   grupo.traverse(function(o){if(o.geometry)o.geometry.dispose();});
   chuva.material.dispose();anel.material.dispose();mats.forEach(function(m){m.dispose();});matRaio.dispose();matHalo.dispose();tex.dispose();
  }
  update(0);
  var inst={update:update,dispose:dispose,grupo:grupo,
   vento:vento,
   estado:function(){return {ligado:ligado,brilho:brilhoAgora,interno:interno,gotas:interno?0:drops.length,tempo:tempo,respingos:NS,nevoeiro:mist.length,raios:nRaios,som:!!(A&&A.ctx.state==='running')};},
   /* para conferência: força uma descarga agora (segura=true a mantém acesa para a foto) */
   relampago:function(segura){if(!ligado)return;if(interno)descarga={t:0,dist:1};else cair();descarga.segura=!!segura;}};
  /* para conferência no navegador: a lista das tempestades vivas */
  (global.__raClimas=global.__raClimas||[]).push(inst);
  return inst;
 }
 global.RAClima={criar:criar};
})(typeof window!=='undefined'?window:globalThis);
