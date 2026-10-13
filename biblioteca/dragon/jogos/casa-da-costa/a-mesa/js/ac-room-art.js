(function(global){
 global.ACRoomArt=function(sc){var PI=Math.PI,TAU=PI*2;
function rnd1(n){ var x=Math.sin(n*127.1+311.7)*43758.5453; return x-Math.floor(x); }

/* veio de madeira dentro de um retângulo, em metros */
function veioMadeira(x0,y0,larg,alt,n,sem,forca){
  sc.save();
  sc.beginPath(); sc.rect(x0,y0,larg,alt); sc.clip();
  for(var i=0;i<n;i++){
    var t=rnd1(sem+i*3.7);
    var y=y0+t*alt;
    var amp=alt*0.045*(0.35+rnd1(sem+i*7.1));
    sc.strokeStyle="rgba(26,14,7,"+((0.12+rnd1(sem+i*2.3)*0.26)*forca).toFixed(3)+")";
    sc.lineWidth=0.0022+rnd1(sem+i*5.3)*0.0032;
    sc.beginPath();
    for(var k=0;k<=7;k++){
      var xx=x0+larg*k/7, yy=y+Math.sin(k*0.95+t*11)*amp;
      if(k) sc.lineTo(xx,yy); else sc.moveTo(xx,yy);
    }
    sc.stroke();
  }
  /* dois nós, que é o que faz o olho aceitar como madeira */
  for(var m=0;m<2;m++){
    var nx=x0+larg*(0.18+rnd1(sem+m*11.3)*0.64);
    var ny=y0+alt*(0.22+rnd1(sem+m*13.7)*0.56);
    var nr=Math.min(larg,alt)*(0.06+rnd1(sem+m*17.1)*0.07);
    sc.strokeStyle="rgba(26,14,7,"+(0.26*forca).toFixed(3)+")";
    for(var a=1;a<=3;a++){
      sc.lineWidth=0.0022;
      sc.beginPath(); sc.ellipse(nx,ny,nr*a*0.45,nr*a*0.24,0.35,0,TAU); sc.stroke();
    }
  }
  /* luz rasante em cima, para a superfície não ficar chapada */
  var lg=sc.createLinearGradient(x0,y0+alt,x0,y0);
  lg.addColorStop(0,"rgba(255,226,186,"+(0.07*forca).toFixed(3)+")");
  lg.addColorStop(0.45,"rgba(255,226,186,0)");
  sc.fillStyle=lg; sc.fillRect(x0,y0,larg,alt);
  sc.restore();
}

function sombraChao(larg,prof){
  var g=sc.createRadialGradient(0,0,0,0,0,larg);
  g.addColorStop(0,"rgba(0,0,0,.62)"); g.addColorStop(1,"rgba(0,0,0,0)");
  sc.fillStyle=g;
  sc.save(); sc.scale(1,prof/larg);
  sc.beginPath(); sc.arc(0,0,larg,0,TAU); sc.fill();
  sc.restore();
}
function sombraParede(l,a){
  sc.fillStyle="rgba(0,0,0,.5)";
  sc.beginPath(); sc.rect(-l/2+0.025,-a/2-0.025,l,a); sc.fill();
}

/* --- o quadro torto ---------------------------------------------------- */
function dQuadro(o){
  var l=o.larg, a=o.altura, ab=o.abre||0;
  /* o retângulo limpo, MAIOR que a moldura — a pista visual de que o quadro
     saiu do lugar. Some quando a moldura abre e o cofre aparece.       */
  if(ab<0.99){
    sc.fillStyle="rgba(255,240,220,"+(0.055*(1-ab)).toFixed(3)+")";
    sc.fillRect(-l*0.60,-a*0.60,l*1.20,a*1.20);
  }

  sc.save();
  if(ab>0.001){
    /* NO CHÃO, ESCORADO NO RODAPÉ.
       Quadro em prego não abre como porta — é retirado e apoiado. Visto de
       pé, um quadro encostado na parede aparece encurtado na vertical (ele
       tomba para trás) e desalinhado, porque ninguém apoia no esquadro. */
    sombraChao(l*0.62, 0.10*ab);           /* contato com o assoalho */
    sc.rotate(-0.10*ab);                   /* fora de esquadro, para a esquerda */
    sc.scale(1, 1-ab*0.30);                /* tombado para trás */
    sc.translate(0, a*0.03*ab);
  } else {
    sc.rotate(-0.045);                     /* na parede: torto para a direita */
  }
  sombraParede(l,a);
  /* moldura dourada */
  var mg=sc.createLinearGradient(-l/2,a/2,l/2,-a/2);
  mg.addColorStop(0,"#6b5323"); mg.addColorStop(0.42,"#c9a45c");
  mg.addColorStop(0.55,"#f0d79a"); mg.addColorStop(1,"#5c471f");
  sc.fillStyle=mg; sc.fillRect(-l/2,-a/2,l,a);
  /* friso interno */
  sc.strokeStyle="#3a2c13"; sc.lineWidth=0.006;
  sc.strokeRect(-l/2+0.045,-a/2+0.045,l-0.09,a-0.09);
  /* a tela: marinha */
  var tl=l-0.11, ta=a-0.11;
  var cg=sc.createLinearGradient(0,ta/2,0,-ta/2);
  cg.addColorStop(0,"#1d2a36"); cg.addColorStop(0.52,"#243544"); cg.addColorStop(1,"#0d1620");
  sc.fillStyle=cg; sc.fillRect(-tl/2,-ta/2,tl,ta);
  /* horizonte e ondas */
  sc.strokeStyle="rgba(180,205,230,.30)"; sc.lineWidth=0.004;
  sc.beginPath(); sc.moveTo(-tl/2,0.01); sc.lineTo(tl/2,0.01); sc.stroke();
  for(var i=1;i<=4;i++){
    sc.strokeStyle="rgba(170,198,225,"+(0.18-i*0.03)+")";
    sc.beginPath();
    for(var xx=-tl/2; xx<=tl/2; xx+=0.02)
      sc.lineTo(xx, 0.005-i*0.026+Math.sin(xx*22+i)*0.004);
    sc.stroke();
  }
  /* o farol que não ilumina */
  sc.fillStyle="rgba(220,232,245,.5)";
  sc.fillRect(tl*0.29,0.012,0.016,0.075);
  sc.fillStyle="rgba(255,214,150,.35)";
  sc.beginPath(); sc.arc(tl*0.29+0.008,0.090,0.012,0,TAU); sc.fill();
  /* verniz */
  var vg=sc.createLinearGradient(-tl/2,ta/2,tl/2,-ta/2);
  vg.addColorStop(0,"rgba(255,255,255,.07)"); vg.addColorStop(0.5,"rgba(255,255,255,0)");
  sc.fillStyle=vg; sc.fillRect(-tl/2,-ta/2,tl,ta);
  sc.restore();
  /* poeira na borda de cima */
  sc.fillStyle="rgba(230,220,200,.10)";
  sc.fillRect(-l/2,a/2-0.008,l,0.008);
}

/* --- o abajur de pé (emite luz própria) --------------------------------- */
function dLuminaria(o){
  var A=o.altura;
  sombraChao(0.34,0.13);
  /* pés */
  sc.strokeStyle="#8a6a33"; sc.lineWidth=0.016;
  for(var i=0;i<3;i++){
    var a=i/3*TAU+0.5;
    sc.beginPath(); sc.moveTo(0,0.02);
    sc.lineTo(Math.cos(a)*0.19, 0.005);
    sc.stroke();
  }
  /* haste */
  var hg=sc.createLinearGradient(-0.012,0,0.012,0);
  hg.addColorStop(0,"#6b5223"); hg.addColorStop(0.4,"#d8b567");
  hg.addColorStop(0.6,"#f2dda6"); hg.addColorStop(1,"#5d471d");
  sc.fillStyle=hg; sc.fillRect(-0.012,0.02,0.024,A-0.30);
  /* nó decorativo */
  sc.fillStyle="#e0c079";
  sc.beginPath(); sc.ellipse(0,A*0.45,0.022,0.030,0,0,TAU); sc.fill();
  /* cúpula */
  var cy0=A-0.30, ct=0.13, cb=0.23, ch=0.28;
  var cg=sc.createLinearGradient(-cb,0,cb,0);
  cg.addColorStop(0,"#7d6a4e"); cg.addColorStop(0.35,"#e6d5b4");
  cg.addColorStop(0.55,"#fff2d8"); cg.addColorStop(1,"#6f5e45");
  sc.fillStyle=cg;
  sc.beginPath();
  sc.moveTo(-cb,cy0); sc.lineTo(cb,cy0); sc.lineTo(ct,cy0+ch); sc.lineTo(-ct,cy0+ch);
  sc.closePath(); sc.fill();
  /* costuras */
  sc.strokeStyle="rgba(90,70,45,.35)"; sc.lineWidth=0.004;
  for(var k=-2;k<=2;k++){
    sc.beginPath(); sc.moveTo(cb*k/2.4,cy0); sc.lineTo(ct*k/2.4,cy0+ch); sc.stroke();
  }
  /* brilho quente por dentro (fica visível mesmo fora do feixe) */
  sc.save();
  sc.globalCompositeOperation="lighter";
  var lg=sc.createRadialGradient(0,cy0+ch*0.4,0,0,cy0+ch*0.4,0.42);
  lg.addColorStop(0,"rgba(255,196,120,.30)");
  lg.addColorStop(0.45,"rgba(255,170,90,.10)");
  lg.addColorStop(1,"rgba(255,160,80,0)");
  sc.fillStyle=lg;
  sc.beginPath(); sc.arc(0,cy0+ch*0.4,0.42,0,TAU); sc.fill();
  sc.restore();
  /* cordinha */
  sc.strokeStyle="rgba(230,215,185,.55)"; sc.lineWidth=0.004;
  sc.beginPath(); sc.moveTo(cb*0.62,cy0+0.02); sc.lineTo(cb*0.66,cy0-0.16); sc.stroke();
  sc.fillStyle="#d8b567";
  sc.beginPath(); sc.arc(cb*0.66,cy0-0.175,0.012,0,TAU); sc.fill();
}

/* --- o vaso de plantas -------------------------------------------------- */
function dVaso(o){
  sombraChao(0.30,0.11);
  var A=0.34, rb=0.11, rt=0.155;
  /* corpo */
  var vg=sc.createLinearGradient(-rt,0,rt,0);
  vg.addColorStop(0,"#4a3428"); vg.addColorStop(0.32,"#8d6449");
  vg.addColorStop(0.5,"#a8795a"); vg.addColorStop(1,"#3e2b21");
  sc.fillStyle=vg;
  sc.beginPath();
  sc.moveTo(-rb,0); sc.lineTo(rb,0);
  sc.bezierCurveTo(rt*1.12,A*0.45, rt,A*0.8, rt,A);
  sc.lineTo(-rt,A);
  sc.bezierCurveTo(-rt,A*0.8, -rt*1.12,A*0.45, -rb,0);
  sc.closePath(); sc.fill();
  /* borda */
  sc.fillStyle="#b7855f";
  sc.beginPath(); sc.ellipse(0,A,rt,0.028,0,0,TAU); sc.fill();
  sc.fillStyle="#2b1d16";
  sc.beginPath(); sc.ellipse(0,A,rt-0.017,0.019,0,0,TAU); sc.fill();
  /* a trinca */
  sc.strokeStyle="rgba(30,18,12,.75)"; sc.lineWidth=0.005;
  sc.beginPath(); sc.moveTo(rt*0.30,A-0.01);
  sc.lineTo(rt*0.18,A*0.62); sc.lineTo(rt*0.30,A*0.34); sc.stroke();
  /* terra */
  sc.fillStyle="#241a12";
  sc.beginPath(); sc.ellipse(0,A-0.004,rt-0.020,0.016,0,0,TAU); sc.fill();
  /* folhas */
  var folhas=[[-0.9,0.30,-0.5],[-0.35,0.40,-0.15],[0.15,0.44,0.1],[0.7,0.34,0.5],
              [1.15,0.22,0.95],[-1.25,0.20,-0.9]];
  for(var i=0;i<folhas.length;i++){
    var incl=folhas[i][0], comp=folhas[i][1], curva=folhas[i][2];
    var tom=["#3f5c33","#4a6b3a","#365029","#527040"][i%4];
    sc.save(); sc.translate(0,A+0.005); sc.rotate(incl*0.45);
    var g=sc.createLinearGradient(0,0,0,comp);
    g.addColorStop(0,"#22331b"); g.addColorStop(0.5,tom); g.addColorStop(1,"#5d7d49");
    sc.fillStyle=g;
    sc.beginPath(); sc.moveTo(0,0);
    sc.bezierCurveTo(0.055+curva*0.03,comp*0.42, 0.030,comp*0.82, curva*0.05,comp);
    sc.bezierCurveTo(-0.030,comp*0.82, -0.055+curva*0.03,comp*0.42, 0,0);
    sc.fill();
    sc.strokeStyle="rgba(20,32,14,.5)"; sc.lineWidth=0.003;
    sc.beginPath(); sc.moveTo(0,0.01); sc.lineTo(curva*0.045,comp*0.94); sc.stroke();
    sc.restore();
  }
  /* as duas folhas caídas, cortadas */
  sc.fillStyle="#46613a";
  for(var f=0;f<2;f++){
    sc.save(); sc.translate(0.20+f*0.11,0.006); sc.rotate(0.9-f*1.7); sc.scale(1,0.30);
    sc.beginPath(); sc.ellipse(0,0,0.055,0.020,0,0,TAU); sc.fill();
    sc.restore();
  }
}

/* --- o relógio parado --------------------------------------------------- */
function dRelogio(o){
  var r=0.245;
  /* o pêndulo puxava a massa visual para baixo do ponto de mira: a pessoa
     centralizava o conjunto e errava o alvo por uns 3°. Sobe o desenho
     para que o que se vê e o que se acerta sejam a mesma coisa.      */
  sc.translate(0,0.12);
  /* A sombra acompanha o aro; não desenhar uma placa retangular atrás dele. */
  /* caixa */
  var cg=sc.createLinearGradient(-r,r,r,-r);
  cg.addColorStop(0,"#241812"); cg.addColorStop(0.45,"#4a3122");
  cg.addColorStop(0.6,"#5c3e2b"); cg.addColorStop(1,"#1d130e");
  sc.fillStyle=cg;
  sc.beginPath(); sc.arc(0,0,r,0,TAU); sc.fill();
  /* veio da madeira do aro, recortado no próprio aro */
  sc.save();
  sc.beginPath(); sc.arc(0,0,r,0,TAU);
  sc.arc(0,0,r*0.84,0,TAU,true);
  sc.clip("evenodd");
  veioMadeira(-r,-r,r*2,r*2,12,71,0.9);
  sc.restore();
  /* mostrador */
  var mg=sc.createRadialGradient(-r*0.3,r*0.3,0,0,0,r*0.84);
  mg.addColorStop(0,"#efe3c6"); mg.addColorStop(0.7,"#d8c9a5"); mg.addColorStop(1,"#a8977a");
  sc.fillStyle="#e6d9ba";
  sc.beginPath(); sc.arc(0,0,r*0.84,0,TAU); sc.fill();
  sc.fillStyle=mg; sc.globalAlpha=0.5;
  sc.beginPath(); sc.arc(0,0,r*0.84,0,TAU); sc.fill(); sc.globalAlpha=1;
  /* traços das horas */
  sc.strokeStyle="#3a2a1a";
  for(var i=0;i<12;i++){
    var a=i/12*TAU, g=(i%3===0);
    sc.lineWidth=g?0.008:0.004;
    sc.beginPath();
    sc.moveTo(Math.cos(a)*r*0.74, Math.sin(a)*r*0.74);
    sc.lineTo(Math.cos(a)*(g?r*0.60:r*0.66), Math.sin(a)*(g?r*0.60:r*0.66));
    sc.stroke();
  }
  /* 21h29 — ponteiros, o segundo em que a casa apagou */
  function ponteiro(ang,comp,esp){
    sc.save(); sc.rotate(-ang);
    sc.strokeStyle="#2a1c10"; sc.lineWidth=esp;
    sc.beginPath(); sc.moveTo(0,-0.012); sc.lineTo(0,comp); sc.stroke();
    sc.restore();
  }
  ponteiro((9+29/60)/12*TAU, r*0.44, 0.011);   /* horas */
  ponteiro(29/60*TAU,        r*0.68, 0.007);   /* minutos */
  sc.fillStyle="#c9a45c";
  sc.beginPath(); sc.arc(0,0,0.011,0,TAU); sc.fill();
  /* vidro */
  var vg=sc.createLinearGradient(-r,r,r*0.2,-r*0.2);
  vg.addColorStop(0,"rgba(255,255,255,.16)"); vg.addColorStop(0.5,"rgba(255,255,255,0)");
  sc.fillStyle=vg;
  sc.beginPath(); sc.arc(0,0,r*0.84,0,TAU); sc.fill();
  /* pêndulo parado, fora de prumo */
  sc.save(); sc.rotate(0.16);
  sc.strokeStyle="#8a6a33"; sc.lineWidth=0.005;
  sc.beginPath(); sc.moveTo(0,-r*0.9); sc.lineTo(0,-r*1.85); sc.stroke();
  var pg=sc.createRadialGradient(-0.01,-r*1.9,0,0,-r*1.92,0.045);
  pg.addColorStop(0,"#f0d79a"); pg.addColorStop(1,"#7d6128");
  sc.fillStyle=pg;
  sc.beginPath(); sc.arc(0,-r*1.92,0.042,0,TAU); sc.fill();
  sc.restore();
}

/* --- a escrivaninha ----------------------------------------------------- */
function dEscrivaninha(o){
  var l=o.larg, A=o.altura, prof=0.16;
  sombraChao(l*0.62,0.16);
  /* Same silhouette as assets/ac/escrivaninha.glb: two drawer pedestals,
     open knee space, rounded mahogany top and brass ring pulls. */
  var pedestal=l*.30, base=.10, top=A-.04;
  [-l/2+.025,l/2-pedestal-.025].forEach(function(x){
    var bg=sc.createLinearGradient(x,0,x+pedestal,0);
    bg.addColorStop(0,"#322018");bg.addColorStop(.45,"#61402d");bg.addColorStop(1,"#382319");
    sc.fillStyle=bg;sc.fillRect(x,base,pedestal,top-base);
    veioMadeira(x,base,pedestal,top-base,15,43,1);
    sc.fillStyle="#2a1d14";sc.fillRect(x+.015,0,.045,base);sc.fillRect(x+pedestal-.06,0,.045,base);
    for(var n=0;n<3;n++){
      var h=(top-base)/3,y=base+n*h;
      sc.fillStyle="#523522";sc.fillRect(x+.012,y+.008,pedestal-.024,h-.018);
      veioMadeira(x+.012,y+.008,pedestal-.024,h-.018,7,89+n,1);
      sc.strokeStyle="#a57a3c";sc.lineWidth=.005;
      sc.strokeRect(x+.023,y+.020,pedestal-.046,h-.042);
      var cx=x+pedestal/2,cy=y+h*.52;
      sc.fillStyle="#c39b51";sc.beginPath();sc.arc(cx,cy+.015,.013,0,TAU);sc.fill();
      sc.strokeStyle="#c39b51";sc.lineWidth=.006;sc.beginPath();sc.arc(cx,cy,.021,0,TAU);sc.stroke();
    }
  });
  var tg=sc.createLinearGradient(0,top,0,A+.004);
  tg.addColorStop(0,"#42291d");tg.addColorStop(.8,"#976447");tg.addColorStop(1,"#c3986e");
  sc.fillStyle=tg;sc.beginPath();
  sc.moveTo(-l/2+.005,top);sc.lineTo(l/2-.005,top);
  sc.quadraticCurveTo(l/2+.03,top,l/2+.03,top+.022);
  sc.quadraticCurveTo(l/2+.03,A+.004,l/2-.005,A+.004);
  sc.lineTo(-l/2+.005,A+.004);sc.quadraticCurveTo(-l/2-.03,A+.004,-l/2-.03,top+.022);
  sc.quadraticCurveTo(-l/2-.03,top,-l/2+.005,top);sc.fill();
  veioMadeira(-l/2,top,l,.04,9,61,1);
  /* papéis no tampo, um atravessado */
  var papeis=[[-0.20,0,0],[-0.186,.0015,.04],[-0.172,.003,.08],[.16,.0045,.38]];
  for(var i=0;i<papeis.length;i++){
    sc.save();
    sc.translate(papeis[i][0], A+.002+papeis[i][1]);
    sc.scale(1,.20);
    sc.rotate(papeis[i][2]);
    sc.fillStyle=i===3?"#d8cdb4":"#e5dcc6";
    sc.fillRect(-0.105,-0.001,0.21,0.145);
    sc.strokeStyle="rgba(90,75,50,.28)"; sc.lineWidth=0.0025;
    for(var r=0;r<5;r++){
      sc.beginPath(); sc.moveTo(-0.085,0.026+r*0.024); sc.lineTo(0.085,0.026+r*0.024); sc.stroke();
    }
    sc.restore();
  }
  /* tinteiro tampado */
  sc.fillStyle="#171b22";
  sc.beginPath(); sc.rect(0.325,A,0.070,0.058); sc.fill();
  sc.fillStyle="#c9a45c";
  sc.fillRect(0.325,A+0.058,0.070,0.012);
}

/* --- o espelho oval (devolve a lanterna) -------------------------------- */
function dEspelho(o){
  var rx=o.larg/2, ry=o.altura/2;
  sombraParede(o.larg,o.altura);
  /* moldura */
  var fg=sc.createLinearGradient(-rx,ry,rx,-ry);
  fg.addColorStop(0,"#4d3a26"); fg.addColorStop(0.45,"#9c7a4e");
  fg.addColorStop(0.58,"#c2a06d"); fg.addColorStop(1,"#3d2d1d");
  sc.fillStyle=fg;
  sc.beginPath(); sc.ellipse(0,0,rx,ry,0,0,TAU); sc.fill();
  /* vidro */
  var gg=sc.createLinearGradient(-rx,ry,rx,-ry);
  gg.addColorStop(0,"#83939c"); gg.addColorStop(0.45,"#c0cdd2");
  gg.addColorStop(0.62,"#e4ebeb"); gg.addColorStop(1,"#73818a");
  sc.fillStyle=gg;
  sc.beginPath(); sc.ellipse(0,0,rx-0.035,ry-0.035,0,0,TAU); sc.fill();
  /* prata comida nas bordas */
  sc.save();
  sc.beginPath(); sc.ellipse(0,0,rx-0.035,ry-0.035,0,0,TAU); sc.clip();
  sc.fillStyle="rgba(70,60,50,.55)";
  for(var i=0;i<14;i++){
    var a=i/14*TAU, rr=0.02+((i*37)%9)*0.004;
    sc.beginPath();
    sc.arc(Math.cos(a)*(rx-0.05), Math.sin(a)*(ry-0.05), rr, 0, TAU);
    sc.fill();
  }
  sc.restore();
  /* o clarão de volta */
  sc.save();
  sc.globalCompositeOperation="lighter";
  var bg=sc.createRadialGradient(-rx*0.12,ry*0.10,0,-rx*0.12,ry*0.10,rx*1.5);
  bg.addColorStop(0,"rgba(255,252,245,.55)");
  bg.addColorStop(0.28,"rgba(210,230,255,.18)");
  bg.addColorStop(1,"rgba(180,215,255,0)");
  sc.fillStyle=bg;
  sc.beginPath(); sc.arc(-rx*0.12,ry*0.10,rx*1.5,0,TAU); sc.fill();
  sc.restore();
}

/* --- a janela do mar ---------------------------------------------------- */
function dJanela(o){
  var l=o.larg, a=o.altura;
  /* vão escuro */
  var ng=sc.createLinearGradient(0,a/2,0,-a/2);
  ng.addColorStop(0,"#101c28"); ng.addColorStop(0.6,"#16232f"); ng.addColorStop(1,"#0a121a");
  sc.fillStyle=ng; sc.fillRect(-l/2,-a/2,l,a);
  /* chuva descendo por fora */
  sc.strokeStyle="rgba(180,210,235,.30)"; sc.lineWidth=0.004;
  for(var i=0;i<26;i++){
    var rx=-l/2+((i*97)%100)/100*l, ry=-a/2+((i*53)%100)/100*a;
    sc.beginPath(); sc.moveTo(rx,ry); sc.lineTo(rx-0.008,ry-0.055); sc.stroke();
  }
  /* caixilho */
  sc.fillStyle="#33261a";
  sc.fillRect(-l/2,-a/2,l,0.045); sc.fillRect(-l/2,a/2-0.045,l,0.045);
  sc.fillRect(-l/2,-a/2,0.045,a); sc.fillRect(l/2-0.045,-a/2,0.045,a);
  sc.fillRect(-0.020,-a/2,0.040,a); sc.fillRect(-l/2,-0.020,l,0.040);
  sc.strokeStyle="rgba(255,226,190,.10)"; sc.lineWidth=0.004;
  sc.strokeRect(-l/2+0.045,-a/2+0.045,l-0.09,a-0.09);
  /* trinco fechado */
  sc.fillStyle="#c9a45c";
  sc.fillRect(-0.030,-0.075,0.060,0.020);
  sc.beginPath(); sc.arc(0.030,-0.065,0.016,0,TAU); sc.fill();
  /* peitoril molhado */
  sc.fillStyle="#3d2d1d"; sc.fillRect(-l/2-0.035,-a/2-0.055,l+0.07,0.055);
  sc.save();
  sc.globalCompositeOperation="lighter";
  sc.fillStyle="rgba(170,205,235,.18)";
  sc.fillRect(-l/2-0.02,-a/2-0.050,l+0.04,0.016);
  sc.restore();
  /* cortina de um lado */
  sc.fillStyle="rgba(30,26,22,.88)";
  sc.beginPath();
  sc.moveTo(-l/2-0.02,a/2+0.02);
  sc.lineTo(-l/2+0.20,a/2+0.02);
  for(var y=a/2; y>=-a/2-0.06; y-=0.06)
    sc.lineTo(-l/2+0.20+Math.sin(y*7)*0.022, y);
  sc.lineTo(-l/2-0.02,-a/2-0.06);
  sc.closePath(); sc.fill();
}

/* --- o cofre ------------------------------------------------------------ */
function dCofre(o){
  var l=o.larg, a=o.altura;
  sombraParede(l,a);
  /* corpo */
  var bg=sc.createLinearGradient(-l/2,a/2,l/2,-a/2);
  bg.addColorStop(0,"#12211c"); bg.addColorStop(0.4,"#22392f");
  bg.addColorStop(0.55,"#2c4739"); bg.addColorStop(1,"#0e1a15");
  sc.fillStyle=bg; sc.fillRect(-l/2,-a/2,l,a);
  /* chanfro */
  sc.strokeStyle="rgba(255,240,215,.13)"; sc.lineWidth=0.007;
  sc.strokeRect(-l/2+0.020,-a/2+0.020,l-0.04,a-0.04);
  sc.strokeStyle="rgba(0,0,0,.5)"; sc.lineWidth=0.006;
  sc.strokeRect(-l/2+0.038,-a/2+0.038,l-0.076,a-0.076);
  /* dobradiças */
  sc.fillStyle="#7d6a4a";
  sc.fillRect(l/2-0.030,a/2-0.115,0.022,0.070);
  sc.fillRect(l/2-0.030,-a/2+0.045,0.022,0.070);
  /* disco de latão */
  var dr=0.105, dx=-l*0.10;
  var dg=sc.createRadialGradient(dx-0.025,0.025,0.005,dx,0,dr);
  dg.addColorStop(0,"#f6e2ab"); dg.addColorStop(0.45,"#c9a45c");
  dg.addColorStop(0.8,"#8a6a33"); dg.addColorStop(1,"#5c471f");
  sc.fillStyle=dg;
  sc.beginPath(); sc.arc(dx,0,dr,0,TAU); sc.fill();
  /* serrilha */
  sc.strokeStyle="rgba(50,38,16,.6)"; sc.lineWidth=0.0035;
  for(var i=0;i<36;i++){
    var an=i/36*TAU;
    sc.beginPath();
    sc.moveTo(dx+Math.cos(an)*dr, Math.sin(an)*dr);
    sc.lineTo(dx+Math.cos(an)*dr*0.90, Math.sin(an)*dr*0.90);
    sc.stroke();
  }
  /* números */
  sc.fillStyle="#3a2c13";
  for(var n=0;n<12;n++){
    var a2=n/12*TAU-PI/2;
    sc.beginPath();
    sc.arc(dx+Math.cos(a2)*dr*0.70, Math.sin(a2)*dr*0.70, 0.006, 0, TAU);
    sc.fill();
  }
  /* seta e miolo */
  sc.fillStyle="#2a1f0d";
  sc.beginPath();
  sc.moveTo(dx,dr+0.022); sc.lineTo(dx-0.016,dr+0.001); sc.lineTo(dx+0.016,dr+0.001);
  sc.closePath(); sc.fill();
  sc.fillStyle="#e8cf92";
  sc.beginPath(); sc.arc(dx,0,0.020,0,TAU); sc.fill();
  /* trava e a marca de dedo */
  var tx=l*0.30;
  sc.fillStyle="#8a6a33"; sc.fillRect(tx-0.020,-0.085,0.040,0.170);
  sc.fillStyle="#c9a45c"; sc.fillRect(tx-0.013,-0.070,0.026,0.140);
  sc.save();
  sc.globalCompositeOperation="lighter";
  sc.fillStyle="rgba(190,215,240,.14)";
  sc.beginPath(); sc.ellipse(tx+0.004,0.030,0.014,0.020,0.3,0,TAU); sc.fill();
  sc.restore();
  /* plaquinha do fabricante */
  sc.fillStyle="rgba(190,165,110,.55)";
  sc.fillRect(-l*0.10-0.045,-a/2+0.052,0.090,0.020);
  /* riscos */
  sc.strokeStyle="rgba(255,255,255,.05)"; sc.lineWidth=0.003;
  for(var s=0;s<7;s++){
    var yy=-a/2+0.09+s*0.045;
    sc.beginPath(); sc.moveTo(-l/2+0.06,yy); sc.lineTo(-l/2+0.06+0.05+(s%3)*0.04,yy+0.006); sc.stroke();
  }
  /* o nicho aberto no reboco onde o cofre foi embutido */
  sc.strokeStyle="rgba(0,0,0,.55)"; sc.lineWidth=0.012;
  sc.strokeRect(-l/2-0.012,-a/2-0.012,l+0.024,a+0.024);
  sc.strokeStyle="rgba(240,232,215,.10)"; sc.lineWidth=0.006;
  sc.beginPath();
  sc.moveTo(-l/2-0.014,-a/2-0.014); sc.lineTo(-l/2-0.014,a/2+0.014);
  sc.lineTo(l/2+0.014,a/2+0.014); sc.stroke();
}


return {quadro:dQuadro,luminaria:dLuminaria,vaso:dVaso,relogio:dRelogio,escrivaninha:dEscrivaninha,espelho:dEspelho,janela:dJanela,cofre:dCofre};
};
})(window);
