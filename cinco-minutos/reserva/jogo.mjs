import { atividades, causas, ficcao, ordemCausas, pistas, provas, salas, voltas } from './banco.mjs';
import { aplicar, conviteCandidatos, criarPartida, disponivel, finalEquipe, tempo } from './motor.mjs';
import { comandar, ligarPartida, transporteFalso, transporteReal, transporteTelao } from './conexao.mjs';
import { abrirMinigame } from './minigames.mjs';

const app = document.querySelector('#app'), d = document.querySelector('#bancada');
const qs = new URLSearchParams(location.search);
const chaveLocal = 'loop-reserva-v1', configLocal = 'loop-reserva-config-v1';
const soloId = 'visitante';
let partida, sessao, transporte, plateia = false, painelMestre = false, modoSolo = false;
let msgTimer, transicao=false, pulsoAtivo=false;

function h(tag, texto, cls) {
  const n = document.createElement(tag);
  if (texto) n.textContent=texto;
  if (cls) n.className=cls;
  return n;
}
function botao(texto, func, cls='', disabled=false) {
  const b=h('button',texto,cls); b.type='button';b.onclick=func;b.disabled=disabled;return b;
}
function link(texto,url,cls='botao') {
  const a=h('a',texto,cls);a.href=url;return a;
}
function bloco(cls,...nos) { const div=h('div',null,cls);div.append(...nos);return div; }
function msg(t) {const n=document.querySelector('#aviso');n.textContent=t;clearTimeout(msgTimer);msgTimer=setTimeout(()=>{n.textContent='';},4800);}
function ler(key,fallback) {try{return JSON.parse(localStorage.getItem(key)) ?? fallback;}catch{return fallback;}}
function salvar(key,dado) {try{localStorage.setItem(key,JSON.stringify(dado));}catch{}}
function relogio() {return sessao?.agora() ?? Date.now();}
function uid() {return sessao?.uid ?? soloId;}

let config=ler(configLocal,{causa:'C',duracao:300,tamanho:5});
function seletor(rotulo, alternativas, atual, agir) {
  const label=h('label',rotulo), select=h('select');
  for(const [v,nome] of alternativas) {const op=h('option',nome);op.value=v;select.append(op);}
  select.value=String(atual);select.onchange=()=>agir(select.value);label.append(select);return label;
}
function configurar(k,v){config[k]=k==='causa'?v:Number(v);salvar(configLocal,config);}
function capa() {
  const escolhas=bloco('row',
    seletor('Noite', [['sorteio','Sortear'],...ordemCausas.map((x,i)=>[x,'Registro '+(i+1)])],config.causa,v=>configurar('causa',v)),
    seletor('Ritmo',[[300,'Completo · 5 min'],[30,'Ensaio · 30 s']],config.duracao,v=>configurar('duracao',v)),
    seletor('Pessoas por equipe',[[2,'2'],[4,'4'],[5,'5'],[6,'6']],config.tamanho,v=>configurar('tamanho',v)));
  const acoes=bloco('row',botao('Começar solo',()=>solo(false),'primary'),link('Jogar em turma','?turma=1'),link('Ensaiar a turma','?simulador=1'));
  if (ler(chaveLocal,null)) acoes.prepend(botao('Continuar solo',()=>solo(true)));
  const info=h('section',null,'hero');
  const mostrador=h('div','21:55','mostrador');mostrador.append(h('span','O museu recomeça'));
  const texto=bloco('hero-texto',h('p','INVESTIGAÇÃO NO MUSEU','kicker'),h('h1','A peça que o museu esqueceu'),
    h('p','Aurélio estranhou o peso da peça. Téo guardou um recado. Antes que as luzes apaguem, uma porta de serviço registra uma passagem.'),
    h('p','Você tem cinco voltas. Escolha uma sala, preserve o que descobriu e faça o relógio atravessar as 22h.'),escolhas,acoes);
  info.append(texto,mostrador);app.replaceChildren(info);
}
function causa() {return config.causa==='sorteio'?ordemCausas[Math.floor(Math.random()*ordemCausas.length)]:config.causa;}
function solo(continuar) {
  modoSolo=true;painelMestre=false;
  partida=(continuar && ler(chaveLocal,null))||criarPartida([{id:soloId,nome:'Investigador'}],causa(),config.duracao,1);
  salvar(chaveLocal,partida);mostrar();atualizarRelogio();
}
async function agir(acao,valor) {
  let err='';
  if(modoSolo) {
    [partida,err]=aplicar(partida,comandar(partida,soloId,acao,valor),relogio(),true);
    if(!err && acao==='escolher' && partida.etapa==='escolha') [partida,err]=aplicar(partida,comandar(partida,soloId,'iniciar'),relogio(),true);
    salvar(chaveLocal,partida);mostrar();
  } else if(sessao) err=await sessao.enviar(acao,valor);
  return err;
}
async function enviar(acao,valor) {const erro=await agir(acao,valor);if(erro)msg(erro);}
function dois(n){return String(n).padStart(2,'0');}
function mmss(seg){const n=Math.max(0,Math.ceil(seg));return dois(Math.floor(n/60))+':'+dois(n%60);}
function hora(seg){const n=21*3600+55*60+Math.floor(seg);return dois(Math.floor(n/3600))+':'+dois(Math.floor(n/60)%60)+':'+dois(n%60);}

function chegou(p, _pessoas, sala, expulso) {
  if (expulso || sala?.aulaEncerrada || sala?.ativa === false) {
    partida=null;if(d.open)d.close();
    app.replaceChildren(h('h1',expulso?'Você saiu da sala':'O Mestre encerrou a sessão'),link('Voltar ao episódio',location.pathname));
    return;
  }
  if (!p) return;
  const antes=partida;partida=p;
  if(d.open && antes && (antes.etapa!==p.etapa||antes.volta!==p.volta))d.close();
  mostrar();atualizarRelogio();
}
function cabecalho(titulo, subtitulo) {
  const cron=bloco('relogio',h('strong',mmss(partida.duracao),'tempo'),h('small',hora(0),'hora'));
  return bloco('linha',bloco('',h('p','VOLTA '+partida.volta+' DE 5','kicker'),h('h2',titulo),h('p',subtitulo,'suave')),cron);
}
function dicaRota(p,e){
  if (!e.chave) return 'O Ateliê guarda a caixa, e a Recepção guarda o primeiro registro do crachá.';
  if (!e.fatos.foto) return 'A chave leva à Reserva Técnica. Alguém já pode examinar a marca na Galeria.';
  if (!e.fatos.copia) return 'A foto ficou no dossiê. Compare a marca na Galeria.';
  if (!e.fatos.trajetoria || !e.fatos.identidade) return 'Central e Recepção cruzam os registros. Nas Coleções há uma fita arquivada.';
  if (partida.volta<5) return 'Prepare a Câmara, encaminhe a peça e confira se a equipe tem as três provas.';
  return 'O Subsolo cuida da Câmara. '+(modoSolo?'O interfone encaminha as provas.':'A Recepção comunica a troca.');
}
function mapa(p,e) {
  const escolhas=Object.entries(salas).map(([id,nome])=>{
    const travada=id==='reserva'&&e.chave!==uid();
    const b=botao(nome+(travada?' · trancada':''),()=>enviar('escolher',id),p.sala===id?'primary':'',travada);
    if(travada)b.title='A caixa do Ateliê guarda a chave.';
    return b;
  });
  return bloco('card',h('h3','Escolha o ambiente'),h('p',dicaRota(p,e),'nota'),bloco('grid',...escolhas));
}
function dossie(p,e) {
  const ul=h('ul',null,'lista');
  Object.keys(e.fatos).filter(x=>pistas[x]).forEach(x=>ul.append(h('li',pistas[x])));
  const ch=e.chave? 'Chave · '+(e.chave===uid()?'com você':partida.pessoas[e.chave]?.nome||'equipe'):'Chave ainda não encontrada';
  const n=provas.filter(x=>e.fatos[x]).length;
  return bloco('dossie',h('h3','Dossiê'),h('p',ch),h('p',n+' de 3 provas da revelação','kicker'),
    ul.children.length?ul:h('p','As descobertas aparecem aqui.'),h('p','Energia nesta volta · '+p.energia,'suave'));
}
function convites() {
  const conv=conviteCandidatos(partida,uid());
  if(!conv.length)return h('span');
  return bloco('card',h('h3','Pistas complementares'),...conv.map(c=>{
    const aceites=c.convite?.aceites??{};
    const pronta=c.convite?.membros?.every(id=>aceites[id]);
    return bloco('row',h('span',c.nome+' com '+c.apelido+' · '+c.salas.map(x=>salas[x]).join(' + ')),
      botao(pronta?'Dupla confirmada':aceites[uid()]?'Aguardando aceite':'Aceitar dupla',()=>enviar('dupla',c.id),'',!!aceites[uid()]),
      ...(c.convite?.membros.includes(uid())?[botao('Desfazer dupla',()=>enviar('desfazerDupla',c.id))]:[]));
  }));
}
function sala(p,e) {
  const ids=Object.keys(atividades).filter(id=>{
    const a=atividades[id];
    if(!a.salas.includes(p.sala) || partida.volta<(a.desde??1)||partida.volta>(a.ate??5)) return false;
    return !(p.sala==='reserva'&&p.turno!==partida.volta&&id!=='abrir');
  });
  const botoes=ids.map(id=>{
    const a=atividades[id], falta=disponivel(partida,uid(),id,relogio());
    const b=botao(a.nome,()=>abrirMinigame(d,a,partida.causa,r=>agir('resolver',{id,resposta:r})),'',!!falta);
    b.dataset.atividade=id; if (falta)b.append(h('small',falta));
    return b;
  });
  const material=bloco('card', h('p','O MUSEU ESTÁ EM MOVIMENTO','kicker'),h('h3',salas[p.sala]),
    h('p','O que mudou nesta volta?','suave'),h('p','','nota sinal'),bloco('acoes',...botoes));
  return material;
}
function pausa(p,e) {
  const acoes=bloco('row');
  if(e.chave===uid()&&!modoSolo) for(const [id,x] of Object.entries(partida.pessoas))
    if(id!==uid()&&x.equipe===p.equipe) acoes.append(botao('Oferecer chave a '+x.nome,()=>enviar('oferecerChave',id)));
  if(e.trocas?.para===uid())acoes.append(botao('Receber chave',()=>enviar('aceitarChave'),'primary'));
  if(modoSolo)acoes.append(botao('Escolher sala da próxima volta',()=>enviar('proxima'),'primary'));
  if(e.trocas?.de===uid())acoes.append(h('p','Aguardando '+partida.pessoas[e.trocas.para]?.nome+' aceitar a chave.'));
  return bloco('card',h('h3','Prepare a próxima visita'),h('p',dicaRota(p,e),'nota'),acoes);
}
function resultado(e) {
  const f=finalEquipe(e);
  const falta=provas.filter(x=>!e.fatos[x]).map(x=>pistas[x]);
  return bloco('card',h('p','DESFECHO','kicker'),h('h2',f.titulo),h('p',f.texto),
    h('p',e.fatos.conserto?'Câmara restaurada.':'A Câmara ainda precisa de conserto.'),
    h('p',e.fatos.revelada?'A autoria foi revelada.':falta.length?'Faltou registrar '+falta.join(', ')+'.':'As provas foram reunidas. Faltou apresentá-las.'),
    h('p','Qual evidência fez você mudar de hipótese?','nota'));
}
function palco(mestre) {
  const subtitulo=partida.etapa==='resultado'?'Desfechos da turma':voltas[partida.volta-1][1];
  app.replaceChildren(cabecalho('A peça que o museu esqueceu',subtitulo));
  if(partida.etapa==='investigacao')app.append(h('p',null,'sinal nota'));
  if(mestre) {
    const ctrl=bloco('row');
    if(partida.etapa==='escolha')ctrl.append(botao('Abrir relógio da volta',()=>enviar('iniciar'),'primary'));
    if(partida.etapa==='pausa')ctrl.append(botao('Abrir próxima volta',()=>enviar('proxima'),'primary'));
    if(partida.etapa==='investigacao'&&partida.duracao===30)ctrl.append(botao('Encerrar volta de ensaio',()=>enviar('encerrar')));
    const url=new URL(location.pathname,location.href);url.searchParams.set('telao','1');url.searchParams.set('sala',transporte.codigo);
    if(qs.has('sim'))url.searchParams.set('sim','1');
    ctrl.append(link('Abrir telão',url.href));
    app.append(ctrl);
  }
  const cards=partida.equipes.map((e,i)=>{
    const grp=Object.values(partida.pessoas).filter(x=>x.equipe===i);
    if(partida.etapa==='resultado')return bloco('',h('h3','Equipe '+(i+1)),resultado(e));
    const summary=h('p',grp.filter(p=>p.sala).length+' de '+grp.length+' escolheram sala.');
    const card=bloco('card',h('h3','Equipe '+(i+1)),summary,h('p',provas.filter(x=>e.fatos[x]).length+' de 3 provas da revelação.'));
    if(mestre) {
      const u=h('ul',null,'lista');grp.forEach(x=>u.append(h('li',x.nome+' · '+(salas[x.sala]??'no Saguão'))));card.append(u);
    }
    return card;
  });
  app.append(bloco('grid',...cards));
}
function mostrar() {
  if(!partida)return;
  if(plateia||painelMestre){palco(painelMestre);return;}
  const p=partida.pessoas[uid()];
  if(!p){app.replaceChildren(h('h2','A investigação já começou'),h('p','A equipe desta partida foi definida na abertura.'));return;}
  const e=partida.equipes[p.equipe], etapa=partida.etapa;
  const [titulo,sub]=voltas[partida.volta-1];
  const painel=etapa==='escolha'?mapa(p,e):etapa==='pausa'?pausa(p,e):
    etapa==='resultado'?resultado(e):p.sala?sala(p,e):mapa(p,e);
  app.replaceChildren(cabecalho(etapa==='resultado'?'Depois das 22h':titulo,sub),
    bloco('partida',bloco('acoes',painel,convites()),dossie(p,e)));
  if(modoSolo&&etapa==='investigacao'&&partida.duracao===30) app.append(bloco('row',botao('Encerrar volta de ensaio',()=>enviar('encerrar'))));
  if(modoSolo&&etapa==='resultado') app.append(bloco('row',botao('Investigar outra noite',()=>{partida=null;modoSolo=false;capa();},'primary')));
}
function atualizarRelogio() {
  if(!partida)return;
  const t=tempo(partida,relogio());
  const nd=app.querySelector('.tempo'),nh=app.querySelector('.hora');
  const keys=[...app.querySelectorAll('[data-atividade="raio"]')];
  if(keys.length && !d.open) {
    const habil=''+disponivel(partida,uid(),'raio',relogio());
    if(keys[0].disabled!==!!habil)mostrar();
  }
  if(nd)nd.textContent=mmss(t.restante);
  if(nh)nh.textContent=hora(t.roteiro);
  const sinal=app.querySelector('.sinal');
  if(sinal) {
    const p=partida.pessoas[uid()], e=p&&partida.equipes[p.equipe];
    const pulso=!!(e&&e.pulso>relogio());
    const texto=pulso?'A luz de inspeção está ativa · '+Math.ceil((e.pulso-relogio())/1000)+' s.':ficcao.findLast(([seg])=>t.roteiro>=seg)?.[1];
    if(sinal.textContent!==texto)sinal.textContent=texto;
    if(pulso!==pulsoAtivo){pulsoAtivo=pulso;if(!d.open)mostrar();}
    if(p?.sala==='corredor' && !pulso && d.open && cueAtivo==='pegadas') {d.close();msg('A iluminação terminou. Peça outro pulso ao Pátio.');}
  }
  if(t.restante<=0&&partida.etapa==='investigacao'&&(modoSolo||painelMestre)&&!transicao) {
    transicao=true;enviar('encerrar').finally(()=>{transicao=false;});
    if(d.open)d.close();
  }
}
let cueAtivo='';
app.addEventListener('click',e=>{
  const btn=e.target.closest('button');
  if(!btn)return;
  cueAtivo=btn.dataset.atividade||'';
},true);
const relogioTimer=setInterval(atualizarRelogio,250);
window.addEventListener('pagehide',()=>clearInterval(relogioTimer),{once:true});

function abrirSala(t) {
  transporte=t;painelMestre=t.papel==='master';
  if(!qs.has('sim') && t.sala?.fase==='jogo' && !t.sala?.episodio) {
    app.replaceChildren(h('h2','Este código pertence a outra partida do Loop.'),link('Voltar ao Mosaico Loop','../'));
    return;
  }
  sessao=ligarPartida(t,chegou);
}
function firebase() {
  app.replaceChildren(h('p','Abrindo a entrada da sala…','nota'),link('Voltar',location.pathname));
  window.DragonSalaAntesDeIniciar=({players})=>{
    const quem=players.filter(p=>!p.mestre&&!p.expulso);
    if(!quem.length){msg('Aguarde pelo menos um participante antes de abrir a partida.');throw new Error('Sala vazia');}
    return {episodio:criarPartida(quem,causa(),config.duracao,config.tamanho)};
  };
  window.addEventListener('reserva-pronta',async()=>{
    try {const t=await transporteReal(window.DragonSala);await t.sincronizar().catch(()=>{});abrirSala(t);}
    catch {app.replaceChildren(h('h2','A conexão com a sala falhou.'),link('Voltar ao episódio',location.pathname));}
  },{once:true});
  const s=h('script');s.src='../sala/firebase-room.js?v=1';s.type='module';
  Object.assign(s.dataset,{project:'loop',root:'mosaico',case:'loop-reserva',title:'Mosaico Loop · Reserva Técnica',readyEvent:'reserva-pronta',telao:location.pathname+'?telao=1',papelCamada:'nao',retomar:'sim'});
  s.onerror=()=>{app.replaceChildren(h('h2','A entrada de turma está indisponível.'),link('Jogar solo',location.pathname));};
  document.head.append(s);
}
async function telao() {
  plateia=true;
  const codigo=qs.get('sala');
  if(!codigo){app.replaceChildren(h('h2','Abra o telão pelo link da sala.'));return;}
  app.replaceChildren(h('h2','Buscando o episódio da sala…'));
  try {
    const t=qs.has('sim')?transporteFalso({codigo,papel:'telao',uid:'telao'}):await transporteTelao(codigo);
    await t.sincronizar().catch(()=>{});
    sessao={agora:()=>t.agora()};
    t.aoMudar(chegou);chegou(t.sala,t.jogadores,t.sala);
  } catch {app.replaceChildren(h('h2','O telão não conseguiu conectar à sala.')); }
}
function filme() {
  const code=qs.get('sim'), papel=qs.has('mestre')?'master':'guest', id=qs.get('p') || 'mestre';
  const t=transporteFalso({codigo:code,papel,uid:id,nome:papel==='master'?'Mestre':'Jogador '+id.slice(1)});
  abrirSala(t);
  if(t.sala?.episodio)return;
  const comecar=async()=>{
    const pessoas=t.jogadores.filter(p=>!p.mestre);
    if(!pessoas.length){msg('Abra os quadros dos participantes primeiro.');return;}
    await t.atualizarSala({fase:'jogo',episodio:criarPartida(pessoas,config.causa==='sorteio'?'C':config.causa,30,5)});
  };
  app.replaceChildren(h('h2',papel==='master'?'Ensaio do Mestre':'Aguardando o Mestre…'));
  if(papel==='master')app.append(botao('Abrir partida de ensaio',comecar,'primary'));
}
function simulador() {
  const code='RES'+crypto.randomUUID().slice(0,6).toUpperCase();
  app.replaceChildren(h('h1','Ensaio da turma'),h('p','Abra a partida no quadro do Mestre e jogue nos dois quadros abaixo. Cada volta dura 30 segundos.'));
  const painel=h('div',null,'grid');
  for(const [nome,param] of [['Mestre','&mestre=1'],['Jogador 1','&p=j1'],['Jogador 2','&p=j2']]) {
    const frame=h('iframe',null,'frame'); frame.title=nome; frame.src='?sim='+code+param;
    painel.append(bloco('',h('h3',nome),frame));
  }
  app.append(painel);
}
if(qs.has('telao'))telao();
else if(qs.has('simulador'))simulador();
else if(qs.has('sim'))filme();
else if(qs.has('turma')||qs.has('sala'))firebase();
else capa();
