/* A Casa · Os papéis da passagem — a 4ª cena do percurso, na Mesa e no Solo.

   Debaixo da despensa, três papéis rasgados. Cada um monta uma dimensão da
   MESMA pista que a Mesa entrega ao fim do percurso (tarefas.salaEscura):
     1. a planta de 1867 — ONDE  — toque: dois pedaços trocam de lugar;
     2. o bilhete        — O QUÊ — encaixe: pedaços com pontas, arrastados
                                   da bandeja até o recorte que preenchem;
     3. o relógio        — QUANDO — deslize: nove casas, uma vazia.
   Os pedaços não têm número: o que guia é o desenho — paredes que continuam,
   a letra que corre de um pedaço ao outro, os algarismos do mostrador.

   É individual (Mario, 18/09/2026): cada jogador monta os próprios papéis
   no próprio aparelho, e o Solo é igual. */
(()=>{
  'use strict';
  const $=id=>document.getElementById(id), params=new URLSearchParams(location.search);
  const mesa=$('mesa'), tabuleiro=$('tabuleiro'), bandeja=$('bandeja');
  const DPR=Math.min(2,window.devicePixelRatio||1);
  let caso=null, papeis=null, pista=null, etapa=-1, atual=null, inicio=0, tempos=[], guardado=false;
  /* Tempo, dicas e pontos (ac-ritmo.js): 4 minutos para os três papéis; cada
     papel vale 5 se montado em 30 s e perde 1 a cada 20 s (mínimo 2); duas
     dicas por papel, aos 40 s e aos 80 s. Esgotado o tempo, os papéis que
     faltavam se montam sozinhos e não pontuam — a pista vai para o dossiê. */
  const RITMO=window.ACRitmo;
  let pontos=[], esgotado=false, dicaVista='', relogio=null;
  const DICAS={
    planta:['As paredes continuam de um pedaço para o outro. Comece pelos cantos da folha.','Procure primeiro os pedaços com as marcas a lápis e o traço vermelho.'],
    bilhete:['Comece pelos cantos: são os pedaços com dois lados retos.','A hora fica no canto de cima, à esquerda; o selo, embaixo, à direita.'],
    relogio:['O XII fica em cima, no meio; o VI, embaixo, no meio.','Monte primeiro a fileira de cima, depois a do meio. A de baixo se acerta girando as três últimas casas.']
  };

  /* ---------- as três imagens ---------- */

  /* Centro dos rótulos da planta publicada (1600×1000), medidos no SVG:
     o térreo é translate(58 482) e os nomes são text-anchor middle. As
     marcas ficam no cômodo que o texto do fragmento diz. */
  const COMODOS={'SALA DE JANTAR':[166,610],'SALA DE ESTAR':[166,800],'HALL':[388,590],'ESCADA':[388,705],
    'COZINHA':[593,600],'DESPENSA':[593,735],'CORREDOR':[593,835]};

  function carregarImagem(src){
    return new Promise((ok,erro)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=erro;i.src=src;});
  }
  function tela(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}

  /* A folha é recortada no térreo e na fachada: a planta inteira é 16:10, e
     num telefone em pé ela virava uma tira de 360×228 com rótulos de 9 px
     (medido a 375×812, 18/09/2026). O térreo é onde a pista acontece. */
  const RECORTE={x:40,y:40,w:780,h:920};
  /* as plantas novas (1600×1000): os cômodos ficam entre x 440–1170 e y 190–900 */
  const RECORTE_NOVA={x:420,y:170,w:780,h:760};
  async function desenharPlanta(){
    const {x:X,y:Y,w:W,h:H}=papeis.planta?RECORTE_NOVA:RECORTE,c=tela(W,H),g=c.getContext('2d');
    let planta=null;
    /* 11/10/2026 (Tarefa 4): com variação, a planta é a da casa nova, do andar dos sinais (img/plantas), sem a foto da fachada */
    const nova=!!papeis.planta;
    try{planta=await carregarImagem(papeis.planta||'img/casa-da-costa-planta-1867.svg');g.drawImage(planta,X,Y,W,H,0,0,W,H);}
    catch(e){g.fillStyle='#d9bf8b';g.fillRect(0,0,W,H);}
    /* A fotografia da fachada é noturna: os três pedaços de cima saíam quase
       lisos (luminância média ~60, desvio ~40, contra 150–196 dos outros —
       medido a 800×540, volta 3). Só clarear achatava o desvio para ~25: a
       foto virava mancha. Os níveis sobem juntos — brilho E contraste — e a
       silhueta da casa, o céu e o raio voltam a separar um pedaço do outro. */
    const FOTO=[55,58,755,365];
    if(planta&&!nova&&'filter' in g){
      g.save();g.beginPath();g.rect(FOTO[0]-X,FOTO[1]-Y,FOTO[2],FOTO[3]);g.clip();
      g.filter='sepia(.45) brightness(2.3) contrast(1.35)';
      g.drawImage(planta,X,Y,W,H,0,0,W,H);g.restore();
    }
    /* As marcas a lápis: um círculo por fragmento, e o traço que as liga —
       um trajeto que ninguém do grupo fez. Dois no mesmo cômodo ficam lado a
       lado, um rótulo acima e o outro abaixo: lado a lado e na mesma altura,
       "Queda da colher" e "O vulto" se atropelavam. */
    const onde=papeis.onde||[],quantos={},usados={};
    for(const o of onde)quantos[o.comodo]=(quantos[o.comodo]||0)+1;
    const pontos=onde.map(o=>{
      const base=o.xy||COMODOS[o.comodo]||[400,700],n=usados[o.comodo]=(usados[o.comodo]||0)+1;
      const x=base[0]+(quantos[o.comodo]>1?(n-1)*120-60:0);
      return {x:x-X,y:base[1]-Y,abaixo:n>1,t:(caso.fragmentos[o.f]||{}).t||o.f};
    });
    g.save();g.strokeStyle='#8e231f';g.lineWidth=6;g.setLineDash([16,12]);g.beginPath();
    pontos.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.stroke();g.restore();
    g.font='italic 700 34px Georgia,serif';g.textAlign='center';
    for(const p of pontos){
      g.fillStyle='#8e231f';g.beginPath();g.arc(p.x,p.y,15,0,Math.PI*2);g.fill();
      g.lineWidth=4;g.strokeStyle='#f3e4c2';g.stroke();
      const w=g.measureText(p.t).width+20,topo=p.abaixo?p.y+24:p.y-66;
      g.fillStyle='#f3e4c2ee';g.fillRect(p.x-w/2,topo,w,42);
      g.fillStyle='#5a150f';g.fillText(p.t,p.x,topo+32);
    }
    return c;
  }

  function papelVelho(g,W,H){
    const f=g.createLinearGradient(0,0,W,H);f.addColorStop(0,'#efe0bd');f.addColorStop(.55,'#e2cb98');f.addColorStop(1,'#cdb07a');
    g.fillStyle=f;g.fillRect(0,0,W,H);
    g.strokeStyle='#8b6f4a33';g.lineWidth=2;
    for(let y=150;y<H-40;y+=64){g.beginPath();g.moveTo(40,y);g.lineTo(W-40,y);g.stroke();}
  }
  function quebrar(g,texto,largura){
    const linhas=[];let linha='';
    for(const p of texto.split(/\s+/)){const t=linha?linha+' '+p:p;if(g.measureText(t).width>largura&&linha){linhas.push(linha);linha=p;}else linha=t;}
    if(linha)linhas.push(linha);return linhas;
  }
  async function desenharBilhete(){
    const W=720,H=1080,c=tela(W,H),g=c.getContext('2d');
    papelVelho(g,W,H);
    g.fillStyle='#5b3d19';g.font='600 30px Georgia,serif';g.textAlign='left';
    g.fillText((pista.hora||'').replace(/:/g,'h'),60,100);
    g.textAlign='right';g.font='italic 28px Georgia,serif';g.fillText(papeis.achado||'',W-60,100);
    g.textAlign='left';g.fillStyle='#2b1d10';g.font='italic 58px Georgia,serif';
    const linhas=quebrar(g,pista.txt||'',W-120);
    const passo=Math.min(96,(H-330)/Math.max(1,linhas.length));
    linhas.forEach((l,i)=>g.fillText(l,60,215+i*passo));
    try{
      const selo=await carregarImagem('img/selo-arquivo-1867.png');
      g.globalAlpha=.8;g.drawImage(selo,W-250,H-250,190,190);g.globalAlpha=1;
    }catch(e){}
    g.strokeStyle='#5b3d19';g.lineWidth=3;g.beginPath();g.moveTo(60,H-120);g.quadraticCurveTo(170,H-160,300,H-110);g.stroke();
    return c;
  }

  function desenharRelogio(){
    const W=900,H=900,c=tela(W,H),g=c.getContext('2d'),cx=W/2,cy=H/2,R=400;
    g.fillStyle='#2a1d12';g.fillRect(0,0,W,H);
    const aro=g.createRadialGradient(cx,cy,R*.2,cx,cy,R);aro.addColorStop(0,'#f4e6c6');aro.addColorStop(.86,'#e0c992');aro.addColorStop(1,'#8a6a37');
    g.fillStyle=aro;g.beginPath();g.arc(cx,cy,R,0,Math.PI*2);g.fill();
    g.lineWidth=14;g.strokeStyle='#5b3d19';g.stroke();
    const ROMANOS=['XII','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI'];
    g.fillStyle='#2b1d10';g.textAlign='center';g.textBaseline='middle';g.font='600 62px Georgia,serif';
    for(let i=0;i<12;i++){const a=i*Math.PI/6-Math.PI/2;g.fillText(ROMANOS[i],cx+Math.cos(a)*(R-78),cy+Math.sin(a)*(R-78));}
    g.strokeStyle='#2b1d10';
    for(let i=0;i<60;i++){const a=i*Math.PI/30,l=i%5?14:30;g.lineWidth=i%5?3:6;g.beginPath();
      g.moveTo(cx+Math.cos(a)*(R-22),cy+Math.sin(a)*(R-22));g.lineTo(cx+Math.cos(a)*(R-22-l),cy+Math.sin(a)*(R-22-l));g.stroke();}
    g.font='italic 34px Georgia,serif';g.fillText('Costa · 1867',cx,cy+R*.36);
    const [h,m]=String(papeis.hora||'21:29').split(':').map(Number);
    const am=m/60*Math.PI*2-Math.PI/2, ah=((h%12)+m/60)/12*Math.PI*2-Math.PI/2;
    g.lineCap='round';g.strokeStyle='#15100a';
    g.lineWidth=18;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(ah)*R*.5,cy+Math.sin(ah)*R*.5);g.stroke();
    g.lineWidth=10;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(am)*R*.78,cy+Math.sin(am)*R*.78);g.stroke();
    g.fillStyle='#15100a';g.beginPath();g.arc(cx,cy,22,0,Math.PI*2);g.fill();
    /* O vidro trincado: o relógio de corda não depende da rede (F26). */
    g.strokeStyle='#ffffffb0';g.lineWidth=3;g.beginPath();
    g.moveTo(cx+60,cy-40);g.lineTo(cx+180,cy-150);g.lineTo(cx+230,cy-290);g.moveTo(cx+180,cy-150);g.lineTo(cx+320,cy-120);
    g.moveTo(cx+60,cy-40);g.lineTo(cx+10,cy-200);g.stroke();
    return c;
  }

  /* ---------- pedaços ---------- */

  function pedacoSimples(fonte,col,lin,cols,lins){
    const el=document.createElement('button');el.type='button';el.className='peca';
    el.setAttribute('aria-label','Um pedaço de papel');
    const w=fonte.width/cols,h=fonte.height/lins,c=tela(Math.round(w),Math.round(h));
    c.getContext('2d').drawImage(fonte,col*w,lin*h,w,h,0,0,c.width,c.height);
    el.append(c);return el;
  }

  /* O contorno de um pedaço com pontas: cada lado é reto (borda do papel),
     ponta (+1) ou encaixe (-1). Coordenadas em unidades de célula. */
  function contorno(g,x,y,w,h,lados){
    const aba=Math.min(w,h)*.22;
    const lado=(x0,y0,x1,y1,s)=>{
      if(!s){g.lineTo(x1,y1);return;}
      const dx=x1-x0,dy=y1-y0,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=uy*s,ny=-ux*s;
      const P=(t,k)=>[x0+ux*len*t+nx*aba*k,y0+uy*len*t+ny*aba*k];
      g.lineTo(...P(.36,0));
      g.bezierCurveTo(...P(.40,-.35),...P(.30,.9),...P(.5,.95));
      g.bezierCurveTo(...P(.70,.9),...P(.60,-.35),...P(.64,0));
      g.lineTo(x1,y1);
    };
    g.beginPath();g.moveTo(x,y);
    lado(x,y,x+w,y,lados[0]);lado(x+w,y,x+w,y+h,lados[1]);lado(x+w,y+h,x,y+h,lados[2]);lado(x,y+h,x,y,lados[3]);
    g.closePath();
  }
  function ladosDoEncaixe(cols,lins){
    /* h[l][c]: lado de baixo da célula (l,c); v[l][c]: lado direito. */
    const s=()=>Math.random()<.5?1:-1,h=[],v=[];
    for(let l=0;l<lins;l++){h[l]=[];v[l]=[];for(let c=0;c<cols;c++){h[l][c]=l<lins-1?s():0;v[l][c]=c<cols-1?s():0;}}
    return (l,c)=>[l?-h[l-1][c]:0, v[l][c], h[l][c], c?-v[l][c-1]:0];
  }
  function pedacoComPontas(fonte,col,lin,cols,lins,lados){
    const w=fonte.width/cols,h=fonte.height/lins,m=Math.min(w,h)*.26;
    const c=tela(Math.round(w+2*m),Math.round(h+2*m)),g=c.getContext('2d');
    contorno(g,m,m,w,h,lados);g.save();g.clip();
    g.drawImage(fonte,col*w-m,lin*h-m,w+2*m,h+2*m,0,0,c.width,c.height);g.restore();
    contorno(g,m,m,w,h,lados);g.lineWidth=2;g.strokeStyle='#5b3d1999';g.stroke();
    const el=document.createElement('div');el.className='peca pontas';el.setAttribute('role','button');el.tabIndex=0;
    el.setAttribute('aria-label','Um pedaço do bilhete');el.append(c);
    el._margem=m/w;return el;
  }

  /* ---------- geometria da mesa ----------
     A mesa ocupa o espaço que as janelas nunca cobrem: abaixo da barra e
     acima da faixa baixa (ou à direita da coluna, em paisagem). Não cresce
     quando os painéis recolhem — o pedaço não pode fugir do dedo (volta 1 da
     maquete: a cena que se reenquadra no toque faz o toque errar). */
  function px(v){const p=document.createElement('div');p.style.cssText='position:absolute;visibility:hidden;width:'+v;document.body.append(p);const r=p.getBoundingClientRect().width;p.remove();return r;}
  function area(){
    const W=innerWidth,H=innerHeight,margem=px('var(--ac-margem)'),barra=px('var(--ac-barra)');
    if(H<=560){const col=px('min(18rem, 32vw)')+2*margem;return {x:col,y:barra+margem,w:W-col-margem,h:H-barra-2*margem};}
    const baixo=px('var(--ac-baixo)')+2*margem;
    return {x:margem,y:barra+margem,w:W-2*margem,h:H-barra-margem-baixo};
  }

  function posicionar(el,x,y,w,h){el.style.left=x+'px';el.style.top=y+'px';if(w!=null){el.style.width=w+'px';el.style.height=h+'px';}}

  /* ---------- 1 · toque ---------- */
  function toque(fonte,cols,lins){
    const pecas=[];for(let i=0;i<cols*lins;i++)pecas.push(pedacoSimples(fonte,i%cols,Math.floor(i/cols),cols,lins));
    let ordem=embaralhar(pecas.map((_,i)=>i));
    let erguida=null, geo=null;
    tabuleiro.className='toque';bandeja.hidden=true;
    pecas.forEach((p,i)=>{p.dataset.i=i;mesa.append(p);p.addEventListener('click',()=>tocar(ordem.indexOf(i)));});
    function layout(){
      const a=area(),r=fonte.width/fonte.height,folga=4;
      let w=a.w,h=w/r;if(h>a.h){h=a.h;w=h*r;}
      geo={x:(a.w-w)/2,y:(a.h-h)/2,w,h,cw:w/cols,ch:h/lins};
      posicionar(mesa,a.x,a.y,a.w,a.h);posicionar(tabuleiro,geo.x-folga,geo.y-folga,w+2*folga,h+2*folga);
      ordem.forEach((p,pos)=>posicionar(pecas[p],geo.x+(pos%cols)*geo.cw,geo.y+Math.floor(pos/cols)*geo.ch,geo.cw,geo.ch));
    }
    function tocar(pos){
      if(atual.feito)return;
      if(erguida===null){erguida=pos;pecas[ordem[pos]].classList.add('erguida');return;}
      pecas[ordem[erguida]].classList.remove('erguida');
      if(erguida!==pos){[ordem[erguida],ordem[pos]]=[ordem[pos],ordem[erguida]];layout();}
      erguida=null;
      if(ordem.every((p,i)=>p===i))resolver();
    }
    layout();
    return {layout,resolvido:()=>ordem.every((p,i)=>p===i),
      /* Para os testes e para a auditoria: a ordem que a tela mostra. */
      ordem:()=>ordem.slice(),tocar};
  }

  /* ---------- 2 · encaixe ---------- */
  function encaixe(fonte,cols,lins){
    const lados=ladosDoEncaixe(cols,lins),pecas=[],presas=new Set();
    for(let i=0;i<cols*lins;i++){const l=Math.floor(i/cols),c=i%cols;pecas.push(pedacoComPontas(fonte,c,l,cols,lins,lados(l,c)));}
    const naBandeja=embaralhar(pecas.map((_,i)=>i));
    let geo=null;
    tabuleiro.className='encaixe';bandeja.hidden=false;
    /* O tabuleiro mostra os recortes vazios: é por eles que se sabe onde
       cada ponta cabe. */
    const moldes=tela(10,10);tabuleiro.replaceChildren(moldes);
    pecas.forEach((p,i)=>{p.dataset.i=i;mesa.append(p);arrastavel(p,i);});
    function layout(){
      const a=area(),n=pecas.length,mini=.55,vao=1.7; // na bandeja, a 55%; a vaga cabe as pontas (a 1,5 as pontas vizinhas se tocavam)
      const ca=(fonte.width/cols)/(fonte.height/lins); // largura/altura de uma célula
      /* Duas arrumações — bandeja embaixo ou ao lado, em k fileiras — e fica
         a que deixa o pedaço maior. */
      const opcoes=[];
      for(let k=1;k<=n;k++){
        const porLinha=Math.ceil(n/k);
        opcoes.push({ao:'baixo',k,cw:Math.min(a.w/cols,a.w/(porLinha*mini*vao),a.h/(lins/ca+.1+k*mini*vao/ca))});
        opcoes.push({ao:'lado',k,cw:Math.min(a.w/(cols+.1+k*mini*vao),a.h*ca/lins,a.h*ca/(porLinha*mini*vao))});
      }
      const best=opcoes.sort((x,y)=>y.cw-x.cw)[0],cw=best.cw;
      const chh=cw/ca,bw=cw*cols,bh=chh*lins;
      const porLinha=Math.ceil(n/best.k),passo=cw*mini*vao;
      let bx,by,tx,ty,tw,th;
      const alt=chh*mini*vao;
      if(best.ao==='baixo'){
        tw=porLinha*passo;th=best.k*alt;
        const total=bh+th+cw*.1;bx=(a.w-bw)/2;by=(a.h-total)/2;tx=(a.w-tw)/2;ty=by+bh+cw*.1;
      }else{
        tw=best.k*passo;th=porLinha*alt;
        const total=bw+tw+cw*.1;bx=(a.w-total)/2;by=(a.h-bh)/2;tx=bx+bw+cw*.1;ty=(a.h-th)/2;
      }
      geo={x:bx,y:by,cw,ch:chh,mini,tx,ty,passo,porLinha,ao:best.ao,alt};
      posicionar(mesa,a.x,a.y,a.w,a.h);posicionar(tabuleiro,bx,by,bw,bh);posicionar(bandeja,tx,ty,tw,th);
      desenharMoldes(bw,bh);
      pecas.forEach((p,i)=>colocar(p,i));
    }
    function desenharMoldes(bw,bh){
      moldes.width=Math.round(bw*DPR);moldes.height=Math.round(bh*DPR);
      const g=moldes.getContext('2d'),w=moldes.width/cols,h=moldes.height/lins;
      g.clearRect(0,0,moldes.width,moldes.height);g.lineWidth=1.5*DPR;g.strokeStyle='#e7c99366';g.fillStyle='#0f0a0655';
      for(let l=0;l<lins;l++)for(let c=0;c<cols;c++){contorno(g,c*w,l*h,w,h,lados(l,c));g.fill();g.stroke();}
    }
    function tamanho(p,i,escala){
      const m=pecas[i]._margem,w=geo.cw*(1+2*m)*escala,h=geo.ch*(1+2*m*geo.cw/geo.ch)*escala;return [w,h,m];
    }
    function colocar(p,i){
      if(p.classList.contains('arrastando'))return;
      if(presas.has(i)){const [w,h,m]=tamanho(p,i,1);posicionar(p,geo.x+(i%cols)*geo.cw-m*geo.cw,geo.y+Math.floor(i/cols)*geo.ch-m*geo.cw,w,h);return;}
      const k=naBandeja.indexOf(i),[w,h]=tamanho(p,i,geo.mini);
      const col=geo.ao==='baixo'?k%geo.porLinha:Math.floor(k/geo.porLinha),lin=geo.ao==='baixo'?Math.floor(k/geo.porLinha):k%geo.porLinha;
      posicionar(p,geo.tx+col*geo.passo+(geo.passo-w)/2,geo.ty+lin*geo.alt+(geo.alt-h)/2,w,h);
    }
    function arrastavel(p,i){
      let toque=null;
      p.addEventListener('pointerdown',ev=>{
        if(atual.feito||presas.has(i))return;
        ev.preventDefault();p.setPointerCapture(ev.pointerId);
        const r=mesa.getBoundingClientRect(),[w,h]=tamanho(p,i,1);
        toque={id:ev.pointerId,dx:w/2,dy:h/2,r};
        p.classList.add('arrastando');posicionar(p,ev.clientX-r.left-w/2,ev.clientY-r.top-h/2,w,h);
      });
      p.addEventListener('pointermove',ev=>{
        if(!toque||ev.pointerId!==toque.id)return;
        posicionar(p,ev.clientX-toque.r.left-toque.dx,ev.clientY-toque.r.top-toque.dy);
      });
      const soltar=ev=>{
        if(!toque||ev.pointerId!==toque.id)return;
        toque=null;p.classList.remove('arrastando');
        const m=pecas[i]._margem,x=parseFloat(p.style.left)+m*geo.cw,y=parseFloat(p.style.top)+m*geo.cw;
        const cx=geo.x+(i%cols)*geo.cw,cy=geo.y+Math.floor(i/cols)*geo.ch;
        const perto=Math.hypot(x-cx,y-cy)<Math.min(geo.cw,geo.ch)*.3;
        const noTabuleiro=x+geo.cw/2>geo.x&&x+geo.cw/2<geo.x+geo.cw*cols&&y+geo.ch/2>geo.y&&y+geo.ch/2<geo.y+geo.ch*lins;
        if(perto){presas.add(i);p.classList.add('presa');p.removeAttribute('tabindex');colocar(p,i);if(presas.size===pecas.length){bandeja.hidden=true;resolver();}return;}
        /* Fora do lugar dele, o pedaço não fica: volta à bandeja. Se foi
           solto em cima do tabuleiro, o recorte o recusa à vista. */
        colocar(p,i);
        if(noTabuleiro)recusar(p);
      };
      p.addEventListener('pointerup',soltar);p.addEventListener('pointercancel',soltar);
    }
    layout();
    return {layout,resolvido:()=>presas.size===pecas.length,presas:()=>[...presas]};
  }

  /* ---------- 3 · deslize ---------- */
  function deslize(fonte,cols,lins){
    const n=cols*lins,vazio=n-1,pecas=[];
    for(let i=0;i<n;i++)pecas.push(pedacoSimples(fonte,i%cols,Math.floor(i/cols),cols,lins));
    /* Embaralha andando: movimentos válidos a partir do relógio montado, sem
       desfazer o anterior. Todo embaralho assim tem solução, e 30 passos dão
       um ou dois minutos no telefone — um sorteio livre pode pedir oitenta. */
    const ordem=pecas.map((_,i)=>i);let buraco=vazio,anterior=-1;
    for(let k=0;k<30;k++){
      const viz=vizinhos(buraco).filter(v=>v!==anterior),v=viz[Math.floor(Math.random()*viz.length)];
      [ordem[buraco],ordem[v]]=[ordem[v],ordem[buraco]];anterior=buraco;buraco=v;
    }
    if(ordem.every((p,i)=>p===i)){const v=vizinhos(buraco)[0];[ordem[buraco],ordem[v]]=[ordem[v],ordem[buraco]];buraco=v;}
    let geo=null;
    tabuleiro.className='deslize';bandeja.hidden=true;tabuleiro.replaceChildren();
    pecas.forEach((p,i)=>{p.dataset.i=i;if(i===vazio){p.hidden=true;}mesa.append(p);gesto(p,i);});
    function vizinhos(pos){const c=pos%cols,l=Math.floor(pos/cols),v=[];if(c)v.push(pos-1);if(c<cols-1)v.push(pos+1);if(l)v.push(pos-cols);if(l<lins-1)v.push(pos+cols);return v;}
    function layout(){
      const a=area(),folga=4;let lado=Math.min(a.w,a.h);
      geo={x:(a.w-lado)/2,y:(a.h-lado)/2,c:lado/cols};
      posicionar(mesa,a.x,a.y,a.w,a.h);posicionar(tabuleiro,geo.x-folga,geo.y-folga,lado+2*folga,lado+2*folga);
      ordem.forEach((p,pos)=>posicionar(pecas[p],geo.x+(pos%cols)*geo.c,geo.y+Math.floor(pos/cols)*geo.c,geo.c,geo.c));
    }
    /* Toca ou arrasta: o pedaço na mesma linha ou coluna do vazio desliza
       (e empurra os que estão entre ele e o vazio). Fora disso, recusa. */
    function mover(pos){
      if(atual.feito)return false;
      const cb=buraco%cols,lb=Math.floor(buraco/cols),c=pos%cols,l=Math.floor(pos/cols);
      if(pos===buraco||(c!==cb&&l!==lb))return false;
      const passo=c===cb?(l<lb?-cols:cols):(c<cb?-1:1);
      while(buraco!==pos){const v=buraco+passo;[ordem[buraco],ordem[v]]=[ordem[v],ordem[buraco]];buraco=v;}
      layout();
      if(ordem.every((p,i)=>p===i)){pecas[vazio].hidden=false;pecas[vazio].classList.add('chegando');resolver();}
      return true;
    }
    function gesto(p,i){
      let ini=null;
      p.addEventListener('pointerdown',ev=>{ini={x:ev.clientX,y:ev.clientY,id:ev.pointerId};});
      p.addEventListener('pointerup',ev=>{
        if(!ini||ev.pointerId!==ini.id)return;ini=null;
        if(!mover(ordem.indexOf(i))&&!atual.feito)recusar(p);
      });
      p.addEventListener('pointercancel',()=>{ini=null;});
      p.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();if(!mover(ordem.indexOf(i)))recusar(p);}});
    }
    layout();
    return {layout,resolvido:()=>ordem.every((p,i)=>p===i),ordem:()=>ordem.slice(),buraco:()=>buraco,mover};
  }

  function embaralhar(a){
    const b=a.slice();
    do{for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}}
    while(b.length>1&&b.every((v,i)=>v===a[i]));
    return b;
  }
  function recusar(el){
    el.classList.remove('recusa');void el.offsetWidth;el.classList.add('recusa');
    setTimeout(()=>el.classList.remove('recusa'),450);
  }

  /* ---------- as etapas ---------- */
  const hora=()=>String(papeis.hora||'').replace(':','h');
  const titulos=()=>(papeis.onde||[]).map(o=>(caso.fragmentos[o.f]||{}).t||o.f);
  function lista(xs){return xs.length<2?xs.join(''):xs.slice(0,-1).join(', ')+' e '+xs[xs.length-1];}
  const ETAPAS=[
    {id:'planta',tipo:toque,cols:3,lins:3,desenhar:desenharPlanta,
      antes:()=>['1 · A PLANTA','Uma planta em pedaços.',papeis.planta?'Uma planta da casa, rasgada em nove. As paredes continuam de um pedaço para o outro.':'Uma folha do inventário de 1867, rasgada em nove. As paredes continuam de um pedaço para o outro.'],
      depois:()=>['1 · A PLANTA','A planta fecha.',papeis.planta?'Marcas a lápis '+(papeis.andar||'')+': '+lista(titulos().map(t=>t.toLowerCase()))+'. Um traço liga uma marca à outra.':'Marcas a lápis no térreo: '+lista(titulos().map(t=>t.toLowerCase()))+'. Um traço liga a sala ao corredor.','Pegar o bilhete']},
    {id:'bilhete',tipo:encaixe,cols:2,lins:3,desenhar:desenharBilhete,
      antes:()=>['2 · O BILHETE','Um bilhete rasgado.','Seis pedaços de papel de carta, com as bordas recortadas. A letra corre de um pedaço para o outro.'],
      depois:()=>['2 · O BILHETE','O bilhete se lê inteiro.','“'+(pista.txt||'')+'”','Pegar o relógio']},
    {id:'relogio',tipo:deslize,cols:3,lins:3,desenhar:desenharRelogio,
      antes:()=>['3 · O RELÓGIO','Um mostrador partido.','O vidro do relógio de corda, em pedaços. Falta um — e é pelo vão dele que os outros andam.'],
      depois:()=>['3 · O RELÓGIO','Os ponteiros param às '+hora()+'.','A hora em que a casa apagou. O relógio de corda não depende da rede.','Ver o que se juntou']}
  ];

  function painel([passo,titulo,texto,botao]){
    $('step').textContent=passo;$('heading').textContent=titulo;$('description').textContent=texto;
    const b=$('primary');b.hidden=!botao;if(botao)b.textContent=botao;
  }
  function limparMesa(){for(const p of mesa.querySelectorAll('.peca'))p.remove();tabuleiro.replaceChildren();tabuleiro.className='';}

  async function abrirEtapa(i){
    etapa=i;const e=ETAPAS[i];limparMesa();
    const fonte=await e.desenhar();
    atual={...e.tipo(fonte,e.cols,e.lins),feito:false,etapa:e.id,inicio:Date.now()};
    painel(e.antes());
    mesa.dataset.etapa=e.id;
  }
  function resolver(){
    if(atual.feito)return;atual.feito=true;tempos[etapa]=Date.now()-atual.inicio;
pontos[etapa]=esgotado||Date.now()-inicio>=RITMO.papeis.total*1000?0:RITMO.pontos('papeis',tempos[etapa]/1000);
    mesa.classList.add('montado');setTimeout(()=>mesa.classList.remove('montado'),900);
    const depois=ETAPAS[etapa].depois();
    if(!esgotado)depois[2]=depois[2]+' ('+pontos[etapa]+' pontos)';
    painel(depois);
    $('dica').hidden=true;
    window.ACJanelas?.abrir?.();
  }
  /* O relógio dos papéis e as dicas do papel da vez. */
  function tique(){
    if(guardado||!atual)return;
    const total=RITMO.papeis.total,decorrido=(Date.now()-inicio)/1000,resta=total-decorrido;
    if(resta<=0&&!esgotado){esgotar();return;}
    if(esgotado)return;
    const doPapel=(Date.now()-atual.inicio)/1000;
    $('timer').textContent=atual.feito?'⏳ '+RITMO.relogio(resta)+' · '+pontos.reduce((a,b)=>a+(b||0),0)+' pontos até aqui'
      :'⏳ '+RITMO.relogio(resta)+' · este papel vale '+RITMO.pontos('papeis',doPapel,Infinity);
    if(atual.feito)return;
    const nivel=RITMO.nivelDaDica(doPapel,RITMO.papeis.dicas),textos=DICAS[atual.etapa]||[];
    const el=$('dica');
    if(!nivel||!textos[nivel-1]){el.hidden=true;return;}
    el.hidden=false;el.textContent=(nivel===1?'💡 Dica: ':'💡 Dica 2: ')+textos[nivel-1];
    const marca=atual.etapa+'/'+nivel;
    if(marca!==dicaVista){dicaVista=marca;window.ACJanelas?.aviso?.((nivel===1?'Uma dica chegou. ':'Mais uma dica chegou. ')+textos[nivel-1],3);window.ACJanelas?.vida?.();}
  }
  /* O tempo acabou: os papéis se montam sozinhos, sem ponto. */
  function esgotar(){
    esgotado=true;
    for(let i=0;i<ETAPAS.length;i++)if(pontos[i]==null)pontos[i]=0;
    if(atual&&!atual.feito){atual.feito=true;tempos[etapa]=Date.now()-atual.inicio;}
    limparMesa();$('dica').hidden=true;
    $('timer').textContent='⏳ Tempo esgotado · os papéis que faltavam não pontuam';
    painel(['OS PAPÉIS','O tempo acabou.','Os papéis que faltavam se juntaram sozinhos. A pista segue para o dossiê.','Ver o que se juntou']);
    etapa=ETAPAS.length-1;
    window.ACJanelas?.aviso?.('O tempo dos papéis acabou. Os que faltavam se montaram sozinhos — sem pontos.',9);
  }
  $('primary').addEventListener('click',()=>{
    if(!atual||!atual.feito)return;
    if(etapa<ETAPAS.length-1){abrirEtapa(etapa+1);return;}
    mostrarAchado();
  });

  function mostrarAchado(){
    const carta=$('achado-carta');carta.replaceChildren();
    const h=document.createElement('h2');h.textContent=papeis.achado||'A passagem';carta.append(h);
    for(const [rot,val] of [['Onde',lista(titulos().map((t,i)=>i?t.toLowerCase():t))+' — da sala ao corredor'],['O quê',pista.txt||''],['Quando',pista.hora||'']]){
      const p=document.createElement('p'),b=document.createElement('b');b.textContent=rot+': ';p.append(b,document.createTextNode(val));carta.append(p);
    }
    const d=$('achado');try{d.showModal();}catch(e){d.setAttribute('open','');}
  }
  /* A conclusão vai uma vez só, pelo botão — o evento `close` nem sempre
     dispara num documento em segundo plano (volta 3 da maquete). */
  $('guardar').addEventListener('click',()=>{
    const d=$('achado');try{d.close();}catch(e){d.removeAttribute('open');}
    if(guardado)return;guardado=true;
    painel(['OS PAPÉIS','Os papéis estão guardados.','A pista foi para o dossiê: '+(pista.hora||'')+' · '+(pista.txt||'')]);
    clearInterval(relogio);
    const total=pontos.reduce((a,b)=>a+(b||0),0);
    $('timer').textContent='📜 Papéis: '+total+' pontos';
    const msg={mosaico:'ac-papeis-completo',runId:params.get('run'),tempos:tempos.slice(),tempoMs:Date.now()-inicio,pontos:total,porPapel:pontos.slice(),esgotado};
    if(parent!==window){try{parent.postMessage(msg,location.origin);}catch(e){}}
  });

  /* Girar o telefone rearruma a mesa NA HORA e sem animação: com a transição,
     os pedaços atravessavam a tela vindos do arranjo antigo — e o teste de
     sobreposição, numa máquina carregada, os pegou fora da tela no meio do
     caminho (390×844). */
  let quadro=0;
  addEventListener('resize',()=>{
    if(!atual)return;
    mesa.classList.add('sem-transicao');atual.layout();
    cancelAnimationFrame(quadro);quadro=requestAnimationFrame(()=>requestAnimationFrame(()=>mesa.classList.remove('sem-transicao')));
  });

  async function iniciar(){
    try{
      const r=await fetch('casos/casa-da-costa.json?v=20261011-t4');caso=await r.json();
      /* 11/10/2026 (Tarefa 4): dentro da Mesa ou do Solo, o caso é o da variação desta partida (procurado nas janelas acima) */
      try{let w=window;while(w.parent&&w.parent!==w){w=w.parent;const v=(w.CASO&&w.CASO.variacao&&w.CASO)||(w.CasaVariacoesSolo&&w.CasaVariacoesSolo.caso&&w.CasaVariacoesSolo.caso());if(v&&v.tarefas){caso=v;break;}}}catch(e){}
      papeis=caso.tarefas.salaEscura.papeis;pista=caso.tarefas.salaEscura.pista;
    }catch(e){$('loading').textContent='Os papéis não puderam ser abertos. Recarregue a página.';return;}
    inicio=Date.now();
    await abrirEtapa(0);
    relogio=setInterval(tique,500);tique();
    $('loading').hidden=true;
    window.ACJanelas?.entrarAtividade?.();
  }
  /* Para a auditoria e os testes: o estado e um atalho para montar. */
  window.__papeis={get etapa(){return ETAPAS[etapa]?.id;},get atual(){return atual;},tempos,pontos,abrirEtapa,esgotar,adiantar:ms=>{inicio-=ms;if(atual)atual.inicio-=ms;tique();}};
  iniciar();
})();
