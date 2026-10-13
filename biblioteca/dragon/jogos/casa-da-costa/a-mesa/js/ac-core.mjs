import './ac-ritmo.js';
import {startMaquette,actMaquette,maquetteView,adiarMaquete,FECHADURAS,TOLERANCIA} from './ac-maquete-state.mjs';
import {acenderVela,velaAcesa,vistaDaVela,podeReacender,VELA_MS} from './ac-vela.mjs';
export {VELA_MS} from './ac-vela.mjs';
export {FECHADURAS,TOLERANCIA} from './ac-maquete-state.mjs';
const validTip=tip=>Array.isArray(tip)&&tip.length===3&&tip.every(n=>Number.isFinite(n)&&Math.abs(n)<=3);
const RITMO=globalThis.ACRitmo;
export const PRAZO_ESCRIVANINHA_MS=RITMO.escrivaninha.total*1000;
/* A vela vale 30 e perde 1 a cada 8 s; aos 4 min (o tempo total da
   escrivaninha) vale zero. */
export const bonus = elapsed => RITMO.pontos('escrivaninha', Math.max(0, elapsed));
/* O que cada um GANHOU até aqui — com a atividade inteira feita ou não. Uma
   dupla que parou na maquete leva a vela; quem montou os papéis leva os
   papéis. Esgotar um tempo só zera AQUELA tarefa. */
export function earnedStages(room,role=null){
  const velaConcluida=room.stage==='registrado';
  const papeis=role&&room.papeis?.[role]?.pontos||0;
  return {velaConcluida,vela:velaConcluida&&!room.velaEsgotada?snapshot(room).bonus:0,chaves:room.maquete?.score||0,evidence:[...(room.maquete?.evidence||[])],...(role?{papeis}:{})};
}
/* Por quanto tempo a partida ficou pausada: todo relógio anda junto. */
function adiarRelogios(room,ms){
  if(!(ms>0))return;
  if(room.startedAt!==null&&room.finishedAt===null)room.startedAt+=ms;
  if(room.vela)room.vela.ate+=ms;
  adiarMaquete(room.maquete,ms);
}
export function apply(room, role, event, now = Date.now()) {
  if(room.percurso){
    const p=room.percurso;
    if(event.type==='percurso_identificar'){
      if(typeof event.jogador!=='string'||!event.jogador||event.jogador.length>128)return false;
      p.players??={};if(p.players[role]&&p.players[role]!==event.jogador)return false;
      if(Object.entries(p.players).some(([r,id])=>r!==role&&id===event.jogador))return false;
      p.players[role]=event.jogador;return true;
    }
    if(event.type==='sala_encerrar'){p.salaEncerrada??=[];if(!p.salaEncerrada.includes(role))p.salaEncerrada.push(role);return true;}
    if(event.type==='percurso_controle'){
      if(!['pausar','retomar'].includes(event.acao))return false;
      const wasPaused=p.paused.length>0;
      p.paused=p.paused.filter(r=>r!==role);if(event.acao==='pausar')p.paused.push(role);
      if(!wasPaused&&p.paused.length)p.pauseAt=now;
      if(wasPaused&&!p.paused.length){if(Number.isFinite(p.pauseAt))adiarRelogios(room,Math.max(0,now-p.pauseAt));p.pauseAt=null;}
      return true;
    }
    if(p.paused.length)return false;
    if(event.type==='sala_progresso'){
      if(p.ready.includes(role)||p.salaEncerrada?.includes(role)||event.total!==9||!Number.isInteger(event.objetos)||event.objetos<1||event.objetos>9)return false;
      p.salaIndividual??={};const old=p.salaIndividual[role]?.pontos||0;
      if(event.objetos<=old)return true;
      p.salaIndividual[role]={pontos:event.objetos};return true;
    }
    if(event.type==='sala_concluida'){
      if(p.salaEncerrada?.includes(role))return false;
      if(p.ready.includes(role))return false;
      if(event.objetos!==undefined||event.total!==undefined||event.tempoMs!==undefined){
        /* O prazo da sala (50 s) encerra quem não achou os nove: ele segue com o
           que achou. Exigir 9 prendia o jogador na sala para sempre (volta 2,
           17/09/2026) — o percurso reenviava a cada 3 s e o motor recusava. */
        if(!Number.isInteger(event.objetos)||event.objetos<0||event.objetos>9||event.total!==9||!Number.isFinite(event.tempoMs)||event.tempoMs<=0||event.tempoMs>3600000)return false;
        p.salaIndividual??={};p.salaIndividual[role]={pontos:event.objetos,tempoMs:Math.round(event.tempoMs)};
      }
      p.ready.push(role);
      /* A escrivaninha começa a contar quando a dupla inteira sai da sala —
         não no primeiro gesto: quem não mexe também gasta o tempo. */
      if(p.ready.length===(p.fragmento?.membros.length||2)&&room.startedAt===null)room.startedAt=now;
      return true;
    }
    if(p.ready.length!==(p.fragmento?.membros.length||2))return false;
  }
  /* Os papéis da passagem são de cada um: quem monta registra os próprios
     pontos (0 a 15), uma vez. */
  if(event.type==='papeis_concluidos'){
    if(!room.maquete||room.maquete.level<3||!Number.isInteger(event.pontos)||event.pontos<0||event.pontos>15)return false;
    room.papeis??={};if(room.papeis[role])return false;
    room.papeis[role]={pontos:event.pontos};return true;
  }
  /* O tempo total da escrivaninha acabou: a etiqueta aparece sozinha (a
     história segue) e a vela não pontua. Qualquer um avisa; o motor confere. */
  if(event.type==='escrivaninha_prazo'){
    if(room.startedAt===null||['encontrado','registrado'].includes(room.stage)||now-room.startedAt<PRAZO_ESCRIVANINHA_MS)return false;
    room.stage='registrado';room.finishedAt=now;room.velaEsgotada=true;return true;
  }
  /* Qualquer um dos dois segue a pista até a maquete: antes só quem guardou a
     etiqueta podia, e o botão aparecia para os dois — quem tinha a vela
     tocava e nada acontecia. */
  if(event.type==='iniciar_maquete'){
    if(room.stage!=='registrado'||room.maquete)return false;
    room.maquete=startMaquette(now);return true;
  }
  if(event.type.startsWith('maquete_')){
    if(!(room.percurso?.fragmento?.membros.map(m=>m.papel)||['luz','conhecimento']).every(r=>[...room.peers.values()].some(p=>p.role===r)))return false;
    const state=room.maquete;
    if(event.type==='maquete_mover'){
      /* A chave só anda depois que as DUAS metades foram achadas: antes disso
         não há para onde levá-la, e um arrasto às cegas viraria atalho. */
      if(!state?.key||!state.lock||maquetteView(state,role,now).chaveiro!==role||!validTip(event.tip))return false;
      room.keyMotion={tip:[...event.tip],at:now,level:state.level};return true;
    }
    if(event.type==='maquete_encaixar'){
      const motion=room.keyMotion;
      // A fechadura muda de lugar a cada capitulo: encaixar e conferido contra
      // a fechadura DAQUELE nivel, nunca contra um ponto fixo do modelo.
      const alvo=FECHADURAS[state?.level];
      if(!motion||!alvo||motion.level!==state?.level||now-motion.at>1500||Math.hypot(...motion.tip.map((n,i)=>n-alvo[i]))>=TOLERANCIA)return false;
    }
    const accepted=actMaquette(state,role,event,now);if(accepted)room.keyMotion=null;return accepted;
  }
  const rule = { iniciar: ['luz','posicionar','posicionar'], posicionar: ['luz','posicionar','castical'], encaixar: ['luz','castical','iluminar'], descobrir: ['conhecimento','iluminar','encontrado'], registrar: ['conhecimento','encontrado','registrado'] }[event.type];
  if (event.type === 'feixe') {
    if (role !== 'luz' || room.stage !== 'iluminar') return false;
    if (![event.origin,event.target].every(v => Array.isArray(v) && v.length === 3 && v.every(n => Number.isFinite(n) && Math.abs(n) <= 30))) return false;
    room.beam = { origin: event.origin, target: event.target, at: now }; return true;
  }
  /* O fósforo é de quem NÃO pôs a vela: só ele reacende, e só o que apagou. */
  if (event.type === 'reacender') {
    if (role !== 'conhecimento' || !podeReacender(room.vela, room.stage, now)) return false;
    room.vela = acenderVela(now); return true;
  }
  if (!rule || role !== rule[0] || room.stage !== rule[1]) return false;
  if (event.type === 'descobrir' && (!room.beam || now - room.beam.at > 1500 || !velaAcesa(room.vela, room.stage, now) || ![...room.peers.values()].some(p => p.role === 'luz'))) return false;
  if (event.type === 'iniciar' && room.startedAt !== null) return false;
  room.startedAt ??= now;
  room.stage = rule[2];
  if (event.type === 'descobrir') room.finishedAt = now;
  if (event.type === 'encaixar') room.vela = acenderVela(now);
  return true;
}
/* A dica da escrivaninha, pelo que falta em cada lado. */
const DICAS_ESCRIVANINHA={
  posicionar:{luz:['Aponte o aparelho para o chão e toque para apoiar a escrivaninha.','Toque no chão, perto de você: a escrivaninha aparece onde você tocar.'],conhecimento:['Seu colega está pondo um móvel no lugar. Fale com ele.','Peça ao colega para apoiar a escrivaninha no chão.']},
  castical:{luz:['A vela precisa de um lugar alto e firme — em cima do tampo.','Leve a vela até o castiçal de latão, sobre o tampo da escrivaninha.'],conhecimento:['A luz vai chegar de outro lugar. Diga ao colega que está no escuro.','Peça ao colega para pôr a vela no castiçal, em cima da escrivaninha.']},
  iluminar:{luz:['O que se esconde fica embaixo das coisas: leve a luz para baixo.','Abaixe o aparelho até a altura das gavetas e aponte a luz de baixo para cima, sob o gaveteiro da direita.'],conhecimento:['Debaixo das coisas também há coisas.','Sob o gaveteiro da direita, rente ao chão, há um papel colado. Olhe de baixo, com a luz do colega.']}
};
function dicaDaEscrivaninha(room,role,decorrido){
  const lado=role==='luz'?'luz':'conhecimento',nivel=RITMO.nivelDaDica(decorrido,RITMO.escrivaninha.dicas);
  const textos=(DICAS_ESCRIVANINHA[room.stage]||{})[lado]||[];
  return {nivel:textos.length?nivel:0,texto:nivel&&textos.length?textos[nivel-1]:null,textos:textos.slice(0,nivel)};
}
export function snapshot(room, now = Date.now(), role = null) {
  const agora=room.percurso?.paused.length?room.percurso.pauseAt:now;
  const elapsed = room.startedAt === null ? 0 : Math.max(0, ((room.finishedAt ?? agora ?? now) - room.startedAt) / 1000);
  const decorrido = room.startedAt === null ? 0 : Math.max(0, ((agora ?? now) - room.startedAt) / 1000);
  const total=RITMO.escrivaninha.total;
  return { percurso: room.percurso || null, stage: room.stage, elapsed, bonus: room.velaEsgotada?0:bonus(elapsed), started: room.startedAt !== null, finished: room.finishedAt !== null,
    prazo:{total,restante:room.finishedAt!==null?0:Math.max(0,total-decorrido),esgotado:!!room.velaEsgotada||(room.finishedAt===null&&room.startedAt!==null&&decorrido>=total)},
    velaEsgotada:!!room.velaEsgotada,
    dica:room.finishedAt!==null?{nivel:0,texto:null,textos:[]}:dicaDaEscrivaninha(room,role,decorrido),
    papeis:room.papeis?Object.fromEntries(Object.entries(room.papeis).map(([r,v])=>[r,v.pontos])):{},
    beam: room.beam ? { ...room.beam, age: now - room.beam.at } : null, vela: vistaDaVela(room.vela, room.stage, agora ?? now), online: [...new Set([...room.peers.values()].map(p => p.role))], keyMotion:room.keyMotion&&now-room.keyMotion.at<=1500&&role!==maquetteView(room.maquete,role,now)?.chaveiro?{tip:room.keyMotion.tip,age:now-room.keyMotion.at}:null, maquete:maquetteView(room.maquete,role,agora??now) };
}
