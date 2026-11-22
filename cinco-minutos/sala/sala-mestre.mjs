// Loop (MOSAICO) · sala do Mestre.
// Liga o jogo de ../game.js a uma sala do firebase-room.js (projeto mosaico-loop): o Mestre abre a sala e conduz as voltas;
// cada participante escolhe o próprio ambiente, guarda o próprio dossiê e envia a própria conclusão.
// game.js continua intacto: aqui só se monta o `window.coop` que ele já espera (storageKey, choose, decorate, move, now, tick, open).
// Estado da sala (documento mosaico/{código}): etapa, volta, caso, seg, iniEm, rodada. Do jogador: amb, ambVolta, resp, respEm.
import { transporteReal, transporteFalso, ms } from './transporte.mjs';
import { CASES, ROOMS } from './conteudo.js';

const P = new URLSearchParams(location.search);
const FALSA = P.get('falsa') === '1';
const ETAPAS = ['choose', 'playing', 'between', 'final', 'result'];
// As 8 perguntas vêm do game.js (ANSWER_AXES): O quê, Onde, Quando, Como, Por quê, Quem, Previsão e Intervenção.
const EIXOS = ANSWER_AXES.map((a) => a.key);
const ROTULO_EIXO = Object.fromEntries(ANSWER_AXES.map((a) => [a.key, a.title]));

let T = null, room = null, players = [], tela = '', movendo = false, relogio = 0, enviou = false;
const eMestre = () => T?.papel === 'master';
const euJogador = () => players.find((p) => p.id === T.uid) || {};

// ---------------------------------------------------------------- ritmo da partida (perguntado ao Mestre antes de iniciar)
function perguntarRitmo() {
  return new Promise((resolve) => {
    const d = document.createElement('dialog');
    d.id = 'ritmoDialog';
    d.innerHTML = `<p class="kicker">ANTES DE COMEÇAR</p><h2>Ritmo da partida</h2>
      <p class="muted">Cada volta mostra o mesmo intervalo de cinco minutos do museu.</p>
      <div class="actions"><button class="btn primary" data-seg="300" type="button">Completo · 5 minutos por volta</button>
      <button class="btn secondary" data-seg="30" type="button">Ensaio · 30 segundos por volta</button></div>`;
    d.addEventListener('cancel', (e) => e.preventDefault());
    d.addEventListener('click', (e) => { const b = e.target.closest('[data-seg]'); if (b) { d.close(); d.remove(); resolve(Number(b.dataset.seg)); } });
    document.body.appendChild(d); d.showModal();
  });
}
const sorteio = () => (typeof chooseCase === 'function' ? chooseCase() : Math.floor(Math.random() * CASES.length));
const partidaNova = (seg, rodada) => ({ etapa: 'choose', volta: 1, caso: sorteio(), seg, iniEm: null, rodada });

// O firebase-room.js chama isto quando o Mestre toca em "Iniciar partida" e grava o que voltar junto com fase:'jogo'.
window.DragonSalaAntesDeIniciar = async () => partidaNova(await perguntarRitmo(), 1);

// ---------------------------------------------------------------- tela e estado do jogo (game.js)
function chaveLocal() { return `cinco-loop-${T.codigo}-${T.uid}-r${room.rodada || 1}`; }

function montarCoop() {
  window.coop = { storageKey: chaveLocal(), choose, decorate, move, now: () => T.agora(), tick, open: () => {} };
  state = load(window.coop.storageKey, {}) ?? {};
  state.clues ??= []; state.hints ??= 0; state.notes ??= '';
  enviou = false;
}

function fimDaVolta() { const i = ms(room.iniEm); return i == null ? null : i + room.seg * 1000; }
function restante() { const f = fimDaVolta(); return f == null ? room.seg : Math.max(0, Math.min(room.seg, (f - T.agora()) / 1000)); }

function aceitar(r, ps) {
  room = r; players = ps || [];
  if (!room) return;
  avisoDeSaida(); desenharTurma();
  esperaDoMestre();
  if (!ETAPAS.includes(room.etapa)) { barra(); return; }
  if (room.etapa === 'playing' && ms(room.iniEm) == null) return;   // o horário do servidor ainda não voltou
  if (!window.coop || window.coop.storageKey !== chaveLocal()) { clearInterval(timerHandle); montarCoop(); tela = ''; }
  const nova = `${room.etapa}:${room.volta}:${room.rodada || 1}`;
  if (tela !== nova) { tela = nova; desenhar(); }
  else if (room.etapa === 'choose' || room.etapa === 'playing') decorate();
  else if (room.etapa === 'final') marcarEnvio();          // não redesenha: a pessoa pode estar marcando as respostas
  else if (room.etapa === 'result') desenhar(true);       // a turma continua mandando; o resumo se atualiza
  barra();
}

function desenhar(leve) {
  const e = room.etapa;
  if (!leve && state.loop !== room.volta) state.room = null;
  const fim = fimDaVolta();
  Object.assign(state, { caseRules: 2, liveFinal: true, caseIndex: room.caso, loop: room.volta, phase: e, duration: room.seg, endAt: fim, remaining: e === 'playing' ? restante() : room.seg, answers: euJogador().resp || null });
  save();
  if (!leve) clearInterval(timerHandle);
  if (e === 'choose' || e === 'playing') {
    renderGame(); show('game');
    if (!leve) timerHandle = setInterval(tick, 250);
  } else if (e === 'between') {
    $('betweenCount').textContent = state.clues.length;
    $('betweenLoop').textContent = room.volta + ' / 5';
    $('betweenEyebrow').innerHTML = '<span></span> O TEMPO RETORNOU';
    $('betweenTitle').textContent = room.volta === 5 ? 'Os ciclos terminaram.' : 'Você se lembra.';
    $('betweenStory').textContent = 'As portas voltaram a fechar. Os objetos estão onde estavam. Você conserva o que descobriu.';
    $('betweenHint').textContent = 'Releia o seu dossiê. O Mestre abre a próxima volta quando a turma estiver pronta.';
    show('between');
  } else if (e === 'final') {
    renderForm();
    if (euJogador().resp) fillAnswers(euJogador().resp);
    marcarEnvio();
    show('final');
  } else {
    state.answers = euJogador().resp || {};
    renderResult();
    $('resultBody').insertAdjacentHTML('beforeend', blocoTurma());
    show('result');
  }
}

function marcarEnvio() {
  const mandou = !!euJogador().resp || enviou;
  const b = $('answerForm').querySelector('button[type=submit]');
  b.textContent = mandou ? 'Conclusão enviada' : 'Enviar minha conclusão';
  b.disabled = mandou;
  for (const k of EIXOS) $(k).disabled = mandou;
  lockAnswerExtras(mandou);
  $('final').querySelector('.large').textContent = mandou
    ? 'Conclusão enviada. Aguarde: o Mestre revela o resultado para toda a turma.'
    : 'O que aconteceu? Use as pistas do dossiê e responda às 8 perguntas. Se não souber, deixe em aberto.';
}

function blocoTurma() {
  const com = players.filter((p) => p.resp);
  if (!com.length) return '';
  const linhas = EIXOS.map((k) => {
    const certos = com.filter((p) => p.resp[k] === truth(k)).length;
    return `<p>${ROTULO_EIXO[k]}: <strong>${certos} de ${com.length}</strong> acertaram</p>`;
  }).join('');
  const quebraram = com.filter((p) => p.resp.interv === 'break').length;
  return `<div class="result-card"><strong>A turma</strong>${linhas}<p>Quebraram o loop: <strong>${quebraram} de ${com.length}</strong></p></div>`;
}

// ---------------------------------------------------------------- o que o jogo chama
function choose(id) {
  if (state.room || !['choose', 'playing'].includes(room?.etapa)) return;
  const fim = fimDaVolta(); if (fim != null && T.agora() >= fim) return;
  state.room = id; save();
  T.atualizarEu({ amb: id, ambVolta: room.volta });
  renderGame();
}

function decorate() {
  const escolhendo = room.etapa === 'choose', jogando = room.etapa === 'playing';
  $('boardTitle').textContent = state.room ? 'Ambiente escolhido' : 'Escolha um ambiente';
  $('phaseDescription').textContent = escolhendo ? 'Escolha onde investigar. O Mestre inicia o relógio.' : 'Todos investigam no mesmo intervalo, cada um por conta própria.';
  $('statusText').textContent = state.room ? 'Você permanece neste ambiente até o retorno.' : 'Escolha um ambiente para investigar nesta volta.';
  $('roomPanel').classList.toggle('hidden', !jogando || !state.room);
  for (const b of $('roomGrid').querySelectorAll('button')) b.disabled = !!state.room;
}

function tick() {
  if (room?.etapa !== 'playing') return;
  const antes = state.remaining;
  state.remaining = restante();
  $('timer').textContent = fmt(state.remaining);
  $('fictionTime').textContent = museumTime();
  if (state.remaining <= 0) window.loopSignalPanel?.render();
  if (state.room && Math.ceil(antes) !== Math.ceil(state.remaining)) renderClues();
  const fim = fimDaVolta();
  if (eMestre() && !movendo && fim != null && T.agora() >= fim + 1250) avancar('between');
}

// A conclusão de cada participante: o jogo chama move('result', respostas) no envio do formulário.
async function move(fase, respostas) {
  if (fase !== 'result' || !respostas) return;
  enviou = true; marcarEnvio();
  // Junto com as respostas segue o que a pessoa fez na última volta: quebrou o loop, tentou e errou, ou não agiu.
  const interv = state.intervention === 'break' ? 'break' : state.intervention ? 'other' : 'none';
  const ok = await T.atualizarEu({ resp: { ...respostas, interv }, respEm: Date.now() });
  if (!ok) { enviou = false; marcarEnvio(); toast('Não consegui enviar. Tente de novo.'); }
}

// ---------------------------------------------------------------- Mestre: avançar a sala
async function avancar(para) {
  if (!eMestre() || movendo || !room) return;
  movendo = true; barra();
  try {
    let c = null;
    if (para === 'playing' && room.etapa === 'choose') c = { etapa: 'playing', iniEm: T.carimbo() };
    else if (para === 'between' && room.etapa === 'playing') c = { etapa: 'between' };
    else if (para === 'choose' && room.etapa === 'between' && room.volta < 5) c = { etapa: 'choose', volta: room.volta + 1, iniEm: null };
    else if (para === 'final' && room.etapa === 'between' && room.volta === 5) c = { etapa: 'final' };
    else if (para === 'result' && room.etapa === 'final') c = { etapa: 'result' };
    else if (para === 'nova' && room.etapa === 'result') c = { ...partidaNova(room.seg, (room.rodada || 1) + 1) };
    if (c && (await T.atualizarSala(c)) === false) toast('Não consegui avançar. Confira a conexão e tente de novo.');
  } catch (e) { toast('Não consegui avançar. Tente de novo.'); console.warn(e); }
  finally { movendo = false; barra(); }
}

// ---------------------------------------------------------------- barra do Mestre
const hh = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const entradaLiberada = () => room?.entradaLiberada !== false;
/** Botões de poder do Mestre, os mesmos do Vila e do Comitê: turma (expulsar), entrada, encerrar a aula e sair. */
function poderes(cls = '') {
  const b = (mb, rot, c = 'secondary') => `<button class="btn ${c} ${cls}" data-mb="${mb}" type="button">${rot}</button>`;
  return b('turma', 'Turma') + b('lib', entradaLiberada() ? 'Entrada liberada' : 'Entrada fechada', entradaLiberada() ? 'secondary' : 'warn')
    + (room?.aulaEncerrada ? b('fim', 'Reabrir a aula') : b('fim', 'Encerrar a aula', 'danger')) + b('sair', 'Sair');
}
function barra() {
  const el = document.getElementById('mestreBar');
  if (!el || !eMestre() || !room) { if (el) el.classList.add('hidden'); return; }
  const total = Math.max(players.filter((p) => !p.mestre).length, 1);
  const noAmb = players.filter((p) => p.amb && p.ambVolta === room.volta).length;
  const mandaram = players.filter((p) => p.resp).length;
  const mm = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.ceil(s % 60)).padStart(2, '0');
  const e = room.etapa, v = room.volta;
  const btn = (id, rot, cls = 'primary') => `<button class="btn ${cls}" id="${id}" type="button" ${movendo ? 'disabled' : ''}>${rot}</button>`;
  let info = '', acao = '';
  if (room.aulaEncerrada) info = 'Aula encerrada para todos. Os dados ficam guardados.';
  else if (!ETAPAS.includes(e)) info = `Sala aberta · ${players.filter((p) => !p.mestre).length} na sala`;
  else if (e === 'choose') { info = `Volta ${v} de 5 · ${noAmb} de ${total} escolheram ambiente`; acao = btn('mbIniciar', 'Iniciar relógio da volta'); }
  else if (e === 'playing') { info = `Volta ${v} de 5 em andamento · ${mm(restante())}`; acao = room.seg === 30 ? btn('mbEncerrar', 'Encerrar volta', 'secondary') : ''; }
  else if (e === 'between') { info = `Volta ${v} de 5 concluída`; acao = v < 5 ? btn('mbProxima', 'Abrir próxima volta') : btn('mbFinal', 'Abrir conclusão'); }
  else if (e === 'final') { info = `${mandaram} de ${total} enviaram a conclusão`; acao = btn('mbRevelar', 'Revelar resultados'); }
  else { info = `Resultado revelado · ${mandaram} de ${total} participaram`; acao = btn('mbNova', 'Nova partida'); }
  if (room.aulaEncerrada) acao = '';
  el.classList.remove('hidden');
  const sinal = `${e}|${v}|${noAmb}|${mandaram}|${total}|${movendo}|${e === 'playing' ? Math.ceil(restante()) : ''}|${entradaLiberada()}|${!!room.aulaEncerrada}`;
  if (el.dataset.sinal === sinal) return;
  el.dataset.sinal = sinal;
  el.innerHTML = `<span class="mb-rot">MESTRE</span><span class="mb-info" role="status">${info}</span>${acao}<span class="mb-poderes">${poderes()}</span>`;
  const liga = (id, para) => { const b = document.getElementById(id); if (b) b.onclick = () => avancar(para); };
  liga('mbIniciar', 'playing'); liga('mbEncerrar', 'between'); liga('mbProxima', 'choose'); liga('mbFinal', 'final'); liga('mbRevelar', 'result'); liga('mbNova', 'nova');
}

// ---------------------------------------------------------------- poderes do Mestre (turma, entrada, encerrar a aula, sair)
function desenharTurma() {
  const d = document.getElementById('turmaDialog');
  if (!d || !d.open) return;
  const gente = players.filter((p) => !p.mestre);
  d.innerHTML = `<p class="kicker">TURMA</p><h2>${gente.length} na sala</h2>
    <ul class="turma-lista">${gente.map((p) => `<li class="${p.expulso ? 'fora' : ''}"><span>${hh(p.nome || 'Participante')}${p.expulso ? ' · fora da sala' : ''}</span>
      <button class="btn ${p.expulso ? 'secondary' : 'danger'} sm" data-exp="${hh(p.id)}" data-val="${p.expulso ? 0 : 1}" type="button">${p.expulso ? 'Readmitir' : 'Expulsar'}</button></li>`).join('') || '<li><span>Ninguém entrou ainda.</span></li>'}</ul>
    <button class="btn primary" data-fechar type="button">Fechar</button>`;
}
function abrirTurma() {
  let d = document.getElementById('turmaDialog');
  if (!d) { d = document.createElement('dialog'); d.id = 'turmaDialog'; document.body.appendChild(d); }
  if (!d.open) d.showModal();
  desenharTurma();
}
document.addEventListener('click', async (ev) => {
  const x = ev.target.closest('[data-exp],[data-fechar],[data-mb]');
  if (!x || !T || !eMestre()) return;
  if (x.dataset.fechar !== undefined) { document.getElementById('turmaDialog')?.close(); return; }
  if (x.dataset.exp) {
    const sair = x.dataset.val === '1';
    if (sair && !confirm('Retirar esta pessoa da sala? Ela não consegue voltar até você readmitir.')) return;
    if (!(await T.atualizarJogador(x.dataset.exp, { expulso: sair }))) toast('Não consegui. Confira a conexão e tente de novo.');
    return;
  }
  const mb = x.dataset.mb;
  if (mb === 'turma') abrirTurma();
  else if (mb === 'lib') { if (!(await T.atualizarSala({ entradaLiberada: !entradaLiberada() }))) toast('Não consegui mudar a entrada. Tente de novo.'); }
  else if (mb === 'fim') {
    if (room.aulaEncerrada) { await T.atualizarSala({ aulaEncerrada: false }); return; }
    if (!confirm('Encerrar a aula para todos? O telão e os celulares mostram “Aula encerrada”. Os dados ficam guardados e você pode reabrir depois.')) return;
    if (!(await T.atualizarSala({ aulaEncerrada: true, entradaLiberada: false }))) toast('Não consegui encerrar. Tente de novo.');
  } else if (mb === 'sair') {
    if (!room?.aulaEncerrada && !confirm('Sair sem encerrar a aula? Os celulares e o telão ficam sem o Mestre até você voltar a esta sala.')) return;
    location.href = '../../bancadas.html';
  }
});

/** Para quem não é Mestre: tela cheia quando a aula foi encerrada ou quando foi retirado da sala. */
function avisoDeSaida() {
  let el = document.getElementById('salaFim');
  const msg = eMestre() ? null : (euJogador().expulso ? ['VOCÊ SAIU DA SALA', 'O Mestre retirou você desta sala.'] : room?.aulaEncerrada ? ['AULA ENCERRADA', 'O Mestre encerrou a aula. Obrigado por participar!'] : null);
  if (!msg) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('div'); el.id = 'salaFim'; el.className = 'sala-espera sala-fim'; document.body.appendChild(el); }
  el.innerHTML = `<div class="card"><p class="kicker">${msg[0]}</p><h2>${msg[1]}</h2></div>`;
}

// ---------------------------------------------------------------- simulador: a sala de mentira tem uma espera com botão
function esperaDoMestre() {
  let el = document.getElementById('salaEspera');
  if (!room || room.fase !== 'sala') { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('div'); el.id = 'salaEspera'; el.className = 'sala-espera'; document.body.appendChild(el); }
  el.innerHTML = eMestre()
    ? `<div class="card"><p class="kicker">SALA ABERTA</p><h2>${players.length} na sala</h2><button class="btn primary" id="mbComecar" type="button">Iniciar partida</button><div class="espera-poderes">${poderes('sm')}</div></div>`
    : '<div class="card"><p class="kicker">SALA</p><h2>Aguardando o Mestre iniciar a partida…</h2></div>';
  const b = document.getElementById('mbComecar');
  if (b) b.onclick = async () => { const seg = Number(P.get('seg')) || (FALSA ? 30 : await perguntarRitmo()); await T.atualizarSala({ fase: 'jogo', iniciadaEmMs: Date.now(), ...partidaNova(seg, 1) }); };
}

// ---------------------------------------------------------------- manual: abre logo após a entrada, com "Entendi"
function manualDeEntrada() {
  const chave = 'cinco-loop-manual-' + T.codigo + '-' + T.uid;
  try { if (sessionStorage.getItem(chave)) return; sessionStorage.setItem(chave, '1'); } catch { /* sem sessionStorage: abre sempre */ }
  const eu = euJogador(), nome = hh(eu.nome || '').trim(), sd = document.getElementById('saudacao');
  if (sd && nome) { sd.textContent = ({ m: 'Bem-vindo', f: 'Bem-vinda' }[eu.forma] || 'Olá') + ', ' + (eu.nome || '').trim() + '.'; sd.classList.remove('hidden'); }
  popup('helpDialog');
}

// ---------------------------------------------------------------- partida
async function iniciar(transporte) {
  T = transporte;
  window.LoopSala = { get T() { return T; }, get room() { return room; }, get players() { return players; }, avancar };
  await T.sincronizar().catch((e) => console.warn('relógio do servidor', e));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) T.sincronizar().catch(() => {}); });
  T.aoMudar(aceitar);
  aceitar(T.sala, T.jogadores);
  relogio = setInterval(() => { if (room?.etapa === 'playing') { tick(); barra(); } }, 250);
  manualDeEntrada();
  window.dispatchEvent(new CustomEvent('loop-sala-pronta'));
}

if (FALSA) {
  const papel = P.get('papel') === 'master' ? 'master' : 'guest';
  iniciar(transporteFalso({ codigo: P.get('sala') || 'SIMUL', papel, uid: P.get('uid') || (papel === 'master' ? 'mestre' : undefined), nome: P.get('nome') || (papel === 'master' ? 'Mestre' : 'Participante') }));
} else {
  window.addEventListener('cinco-sala-ready', async () => iniciar(await transporteReal(window.DragonSala)));
}
