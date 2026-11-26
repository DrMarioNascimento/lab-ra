import { causas, maquinaValores } from './banco.mjs';

function no(tag, texto, cls) {
  const el = document.createElement(tag);
  if (texto) el.textContent = texto;
  if (cls) el.className = cls;
  return el;
}

function botao(texto, agir, cls = '') {
  const b = no('button',texto,cls);
  b.type='button'; b.onclick=agir;
  return b;
}

let figura;   // {n, url}: a foto mostra o número de registro sorteado na partida
function quadro() {
  const n = String(typeof window !== 'undefined' && window.lcTok ? window.lcTok('{reg}') : '472');   // fora do Loop (episódio da Reserva) fica o número de origem
  if (figura && figura.n === n) return figura.url;
  const tela = document.createElement('canvas'); tela.width=480;tela.height=320;
  let ctx;
  try { ctx=tela.getContext('2d'); } catch { return ''; }
  if (!ctx) return '';
  const ceu = ctx.createLinearGradient(0,0,0,320);
  ceu.addColorStop(0,'#173638');ceu.addColorStop(.55,'#936b4a');ceu.addColorStop(1,'#22271e');
  ctx.fillStyle=ceu;ctx.fillRect(0,0,480,320);
  ctx.fillStyle='#f5c477';ctx.beginPath();ctx.arc(366,70,35,0,Math.PI*2);ctx.fill();
  function pol(c, pontos) { ctx.fillStyle=c;ctx.beginPath();pontos.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.fill(); }
  pol('#38483e',[[0,196],[75,97],[158,178],[239,101],[331,194],[480,134],[480,272],[0,272]]);
  pol('#152e2b',[[0,245],[110,167],[215,230],[319,154],[480,235],[480,320],[0,320]]);
  pol('#7d6640',[[122,249],[203,222],[203,275],[112,284]]);
  pol('#3d3222',[[118,250],[174,204],[215,225],[199,241]]);
  ctx.strokeStyle='#d7a95c';ctx.lineWidth=8;ctx.strokeRect(4,4,472,312);
  pol('#f1d19b',[[412,289],[443,249],[458,289]]);
  ctx.fillStyle='#2e231a';ctx.font='bold 16px Georgia';ctx.fillText(n,421,286);
  figura={n, url:tela.toDataURL('image/png')};
  return figura.url;
}

export function abrirMinigame(dialog, atividade, causa, aoResolver) {
  dialog.replaceChildren(no('p','Olhe de perto','kicker'),no('h2',atividade.nome),no('p',atividade.texto));
  const corpo=no('div',null,'puzzle');
  const aviso=no('p',null,'ajuda');
  aviso.setAttribute('role','status');
  dialog.append(corpo,aviso);
  let nivel=0, dispose=()=>{}, ocupado=false;
  const controles=no('div',null,'row');
  controles.append(botao('Pedir uma pista',()=>{
    const dicas=atividade.dicas ?? ['Leia o que está registrado no dossiê.','Compare a origem de cada registro com o que a bancada pede.'];
    aviso.textContent=dicas[Math.min(nivel++,dicas.length-1)];
  }),botao('Voltar à sala',()=>dialog.close()));
  dialog.append(controles);
  let ativa = true;
  dialog.addEventListener('close',()=>{ativa=false;dispose();},{once:true});

  async function conferir(v) {
    if (ocupado || !ativa) return;
    ocupado=true;
    const msg=await aoResolver(v);
    ocupado=false;
    if (!ativa) return;
    if (msg) aviso.textContent=msg;
    else dialog.close();
  }

  function cena(tipo, agir, passo) {
    const h=no('div',null,'cena');
    const modelo=no('div',null,'relevo relevo-'+tipo);
    const imagem=no('div',null,'objeto');
    imagem.setAttribute('aria-hidden','true');
    if(tipo==='caixa') {
      for(const parte of ['face','lateral','fundo','faixa','tampa','segredo']) imagem.append(no('span',null,parte));
    } else if(tipo==='luz') {
      for(const parte of ['obra','facho','marca']) imagem.append(no('span',null,parte));
    } else {
      for(const parte of ['mostrador-a','mostrador-b','mostrador-c','base']) imagem.append(no('span',null,parte));
    }
    modelo.append(imagem);
    h.append(modelo);
    corpo.append(h);
    function atualizar() { modelo.dataset.passo=String(passo()); h.dispatchEvent(new Event('cena')); }
    atualizar();
    import('./cena.mjs').then(m=>m.montarCena(h,tipo,agir,passo)).then(f=>{if(ativa)dispose=f;else f();})
      .catch(()=>{ if(ativa && !modelo.isConnected)h.replaceChildren(modelo); });
    return atualizar;
  }

  if (atividade.tipo === 'caixa') {
    let passo=0;
    function mover(qual) {
      if (qual !== ['faixa','fundo','tampa'][passo]) { aviso.textContent='O painel resiste. Uma peça precisa liberar a seguinte.'; return; }
      passo++;
      aviso.textContent=['','O entalhe apareceu. Examine o fundo.','A trava cedeu. Abra a tampa.','A chave está dentro da caixa.'][passo];
      desenhar();
      if (passo===3) conferir('faixa/fundo/tampa');
    }
    const desenhar=cena('caixa',mover,()=>passo);
    corpo.append(botao('Deslizar a faixa',()=>mover('faixa')),botao('Mover o painel do fundo',()=>mover('fundo')),botao('Abrir a tampa',()=>mover('tampa')));
  } else if (atividade.tipo === 'chave') {
    let giro=0;
    const status=no('p','Chave encaixada.');
    const porta = no('div',null,'porta-grafica');
    porta.append(no('span',null,'chave-grafica'));
    porta.setAttribute('aria-hidden','true');
    corpo.append(porta,status,botao('Girar a chave',()=>{
      giro++;
      porta.dataset.giro=String(giro);
      status.textContent=giro===1?'A lingueta começou a recolher. Gire mais uma vez.':'A porta da Reserva abriu.';
      if (giro>=2) conferir('aberta');
    },'primary'));
  } else if (atividade.tipo === 'foto') {
    const img=quadro(), pecas=[4,1,5,2,0,3], pos=Array(6).fill(null);
    const detalhes=['céu e montanha à esquerda','céu acima do vale','lua sobre a montanha','telhado abaixo da montanha','caminho no fundo do vale','selo abaixo da lua'];
    let escolhida=null;
    const tabuleiro=no('div',null,'foto-grid'), bandeja=no('div',null,'foto-grid bandeja');
    const pintar=(b,i)=>{
      if(img) b.style.backgroundImage='url('+img+')';
      b.style.backgroundPosition=(i%3)*50+'% '+Math.floor(i/3)*100+'%';
      b.classList.add('fragmento');
    };
    function colocar(slot, i) {
      if (!Number.isInteger(i) || i<0 || i>5 || pos.includes(i)) return;
      if (slot!==i) { aviso.textContent='As bordas não continuam aqui. Tente outro encaixe.';return; }
      pos[slot]=i; escolhida=null;
      aviso.textContent=pos.filter(n=>n!==null).length+' de 6 encaixes.';
      renovar();
      if(pos.every(n=>n!==null)) conferir(pos.join(''));
    }
    function renovar() {
      tabuleiro.replaceChildren(...pos.map((i,slot)=>{
        const b=botao(i===null?String(slot+1):'',()=>colocar(slot,escolhida),'encaixe');
        b.setAttribute('aria-label','Posição '+(slot+1)+(i===null?' livre':' preenchida'));
        b.ondragover=e=>e.preventDefault();
        b.ondrop=e=>{e.preventDefault();const v=e.dataTransfer.getData('text/plain');if(v)colocar(slot,Number(v));};
        if(i!==null)pintar(b,i);
        return b;
      }));
      bandeja.replaceChildren(...pecas.map((i,n)=>{
        const b=botao('',()=>{
          escolhida=i;
          for(const item of bandeja.children)item.setAttribute('aria-pressed',String(item===b));
          aviso.textContent='Fragmento selecionado. Escolha uma posição.';
        },'encaixe');
        b.disabled=pos.includes(i);b.draggable=!b.disabled;pintar(b,i);
        b.setAttribute('aria-label','Fragmento '+(n+1)+' · '+detalhes[i]);
        b.setAttribute('aria-pressed',String(escolhida===i));
        b.ondragstart=e=>e.dataTransfer.setData('text/plain',String(i));
        return b;
      }));
    }
    corpo.append(no('p','Toque num pedaço e depois no lugar dele.'),tabuleiro,bandeja);
    renovar();
  } else if (atividade.tipo==='luz') {
    let angulo=1;
    const status=no('p','Luz 1 de 5');
    const L=atividade.luz||{};
    const proxima=()=>{range.value=String(angulo%5+1);range.oninput();};
    let desenhar;
    if (L.img) {   // no Loop a cena é a própria peça da sala (miniatura 3D), com a luz andando por cima
      const h=no('div',null,'cena cena-peca'), im=no('img'), facho=no('span',null,'facho'), brilho=no('span',null,'brilho');
      im.src=L.img; im.alt=''; h.setAttribute('aria-hidden','true'); h.append(im,facho,brilho); h.onclick=proxima; corpo.append(h);
      desenhar=()=>{ h.dataset.passo=String(angulo); h.dataset.achou=String(angulo===(L.certo||4)); };
      desenhar();
    } else desenhar=cena('luz',proxima,()=>angulo);
    const range=no('input');range.type='range';range.min=1;range.max=5;range.value=1;range.setAttribute('aria-label','Posição da luz');
    const registrar=botao(L.botao||'Registrar a fissura',()=>conferir(angulo),'primary');registrar.disabled=true;
    range.oninput=()=>{angulo=Number(range.value);const claro=angulo===(L.certo||4);status.textContent=claro?(L.achou||'A luz revelou a fissura que cruza o selo.'):'Luz '+angulo+' de 5 · '+(L.falta||'a marca ainda está encoberta')+'.';registrar.disabled=!claro;desenhar();};
    corpo.append(range,status,registrar);
  } else if (atividade.tipo==='maquina' && maquinaValores[causa]) {
    const seletores=[];
    cena('maquina',()=>{},()=>0);
    for (const [rotulo,opcoes] of maquinaValores[causa]) {
      const label=no('label',rotulo), select=no('select');
      const vazio=no('option','Selecionar'); vazio.value='';select.append(vazio);
      opcoes.forEach((x,i)=>{const o=no('option',x);o.value=i;select.append(o);});
      label.append(select);seletores.push(select);corpo.append(label);
    }
    corpo.append(botao('Confirmar procedimento',()=>{
      if(seletores.some(x=>x.value==='')){aviso.textContent='Complete os três ajustes.';return;}
      conferir(seletores.map(x=>x.value).join('|'));
    },'primary'));
  } else if (atividade.tipo==='ordem' || atividade.tipo==='maquina') {
    const m=atividade.tipo==='maquina', dados=causas[causa];
    const itens=m?dados.conjunto:atividade.itens;
    const sequencia=[];
    const progresso=no('p','Toque nas cenas na ordem em que aconteceram.');
    const avancar=i=>{if(!sequencia.includes(i)){sequencia.push(i);progresso.textContent=sequencia.map(j=>itens[j]).join(' → ');}};
    if(m) {
      cena('maquina',i=>avancar(Number(i)),()=>sequencia.length);
      corpo.append(no('p','Procedimento conferido · '+dados.ordem.map(i=>itens[i]).join(' → ')));
    }
    const partes=itens.map((x,i)=>({x,i})).reverse().map(({x,i})=>{
      const controle=botao(x,()=>avancar(i));
      if(atividade.clipes) {
        const imagem=no('span',null,'clip clip-'+atividade.clipes[i]);
        imagem.setAttribute('aria-hidden','true');
        controle.prepend(imagem);
      }
      return controle;
    });
    const conjunto=no('div',null,atividade.clipes?'fita':'row');
    conjunto.append(...partes);
    corpo.append(conjunto,progresso,
      botao('Limpar',()=>{sequencia.length=0;progresso.textContent='Sequência limpa.';}),
      botao('Confirmar',()=>conferir(m?sequencia.join('|'):sequencia.map(i=>itens[i]).join('|')),'primary'));
  } else if(atividade.tipo==='comparar') {
    corpo.append(...atividade.opcoes.map((x,i)=>botao(x,()=>conferir(i))));
  } else if(atividade.tipo==='glifos' && Array.isArray(atividade.insc)) {
    // escrita antiga da máscara: os símbolos vêm do sprite embutido na página (#g-…); SVG criado com createElementNS
    const NS='http://www.w3.org/2000/svg', gl=id=>{const s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 48 48');s.setAttribute('class','glifo');s.setAttribute('aria-hidden','true');const u=document.createElementNS(NS,'use');u.setAttribute('href','#g-'+id);s.append(u);return s;};
    const faixa=no('div',null,'faixa-pedra'); faixa.setAttribute('role','img'); faixa.setAttribute('aria-label','Inscrição da máscara, com '+atividade.insc.length+' símbolos');
    atividade.insc.forEach(id=>faixa.append(gl(id)));
    corpo.append(no('p','Na testa da máscara','kicker'),faixa);
    if (Array.isArray(atividade.tabua)) { const t=no('div',null,'tabua-mini'); t.setAttribute('aria-hidden','true'); atividade.tabua.forEach(([id,w])=>{const c=no('span',null,'t'); c.append(gl(id),no('small',w)); t.append(c);}); corpo.append(no('p','A tábua, do seu caderno','kicker'),t); }
    const grade=no('div',null,'opc-glifos');
    // só a posição, sem o desenho: quem responde precisa olhar a faixa e a tábua (revisão 11)
    atividade.opcoes.forEach((n,i)=>grade.append(botao(n+'º símbolo',()=>conferir(i))));
    corpo.append(grade);
  } else if(atividade.tipo==='sintomas') {
    const dados=causas[causa];
    const selecao=new Set(), registros=no('div',null,'sintomas');
    for (const [i, texto] of [...dados.sintomas,'A parede do corredor tem um quadro torto.'].entries()) {
      const label=no('label'), input=no('input');input.type='checkbox';
      input.onchange=()=>input.checked?selecao.add(i):selecao.delete(i);
      label.append(input,document.createTextNode(texto));registros.append(label);
    }
    corpo.append(registros,...Object.entries(causas).map(([id,x])=>botao(x.nome,()=>{
      if(selecao.size!==3||selecao.has(3))aviso.textContent='Selecione dois sinais técnicos e o registro que descarta outra hipótese.';
      else conferir(id);
    })));
  } else corpo.append(botao('Registrar no dossiê',()=>conferir(true),'primary'));
  dialog.showModal();
}
