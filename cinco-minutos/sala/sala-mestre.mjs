// Loop (MOSAICO) · sala do Mestre.
// Liga o jogo de ../game.js a uma sala do firebase-room.js (projeto mosaico-loop): o Mestre abre a sala e conduz as voltas;
// cada participante escolhe o próprio ambiente, guarda o próprio caderno e envia a própria conclusão.
// game.js continua intacto: aqui só se monta o `window.coop` que ele já espera (storageKey, choose, decorate, move, now, tick, open).
// Estado da sala (documento mosaico/{código}): etapa, volta, caso, seg, iniEm, rodada. Do jogador: amb, ambVolta, resp, respEm.
import { transporteReal, transporteFalso, ms } from './transporte.mjs';
import { CASES, ROOMS } from './conteudo.js';

const P = new URLSearchParams(location.search);
const FALSA = P.get('falsa') === '1';
const ETAPAS = ['choose', 'playing', 'between', 'final', 'result'];
const EIXOS = ['event', 'alarm', 'figure', 'action'];
const ROTULO_EIXO = { event: 'Acontecimento', alarm: 'Alarme', figure: 'Figura imóvel', action: 'Prevenção no museu' };

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
  Object.assign(state, { caseIndex: room.caso, loop: room.volta, phase: e, duration: room.seg, endAt: fim, remaining: e === 'playing' ? restante() : room.seg, answers: euJogador().resp || null });
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
    $('betweenHint').textContent = 'Releia o seu caderno. O Mestre abre a próxima volta quando a turma estiver pronta.';
    show('between');
  } else if (e === 'final') {
    renderForm();
    if (euJogador().resp) { for (const k of EIXOS) $(k).value = euJogador().resp[k] ?? ''; }
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
  $('final').querySelector('.large').textContent = mandou
    ? 'Conclusão enviada. Aguarde: o Mestre revela o resultado para toda a turma.'
    : 'O que aconteceu? Use as pistas do caderno e indique como prevenir o acontecimento. Se não souber, deixe em aberto.';
}

function blocoTurma() {
  const c = CASES[room.caso], com = players.filter((p) => p.resp);
  if (!com.length) return '';
  const linhas = EIXOS.map((k) => {
    const certos = com.filter((p) => p.resp[k] === c[k]).length;
    return `<p>${ROTULO_EIXO[k]}: <strong>${certos} de ${com.length}</strong> acertaram</p>`;
  }).join('');
  return `<div class="result-card"><strong>A turma</strong>${linhas}</div>`;
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
  if (state.room && Math.ceil(antes) !== Math.ceil(state.remaining)) renderClues();
  const fim = fimDaVolta();
  if (eMestre() && !movendo && fim != null && T.agora() >= fim + 1250) avancar('between');
}

// A conclusão de cada participante: o jogo chama move('result', respostas) no envio do formulário.
async function move(fase, respostas) {
  if (fase !== 'result' || !respostas) return;
  enviou = true; marcarEnvio();
  const ok = await T.atualizarEu({ resp: respostas, respEm: Date.now() });
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
function barra() {
  const el = document.getElementById('mestreBar');
  if (!el || !eMestre() || !room || !ETAPAS.includes(room.etapa)) { if (el) el.classList.add('hidden'); return; }
  const total = Math.max(players.filter((p) => !p.mestre).length, 1);
  const noAmb = players.filter((p) => p.amb && p.ambVolta === room.volta).length;
  const mandaram = players.filter((p) => p.resp).length;
  const mm = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.ceil(s % 60)).padStart(2, '0');
  const e = room.etapa, v = room.volta;
  const btn = (id, rot, cls = 'primary') => `<button class="btn ${cls}" id="${id}" type="button" ${movendo ? 'disabled' : ''}>${rot}</button>`;
  let info = '', acao = '';
  if (e === 'choose') { info = `Volta ${v} de 5 · ${noAmb} de ${total} escolheram ambiente`; acao = btn('mbIniciar', 'Iniciar relógio da volta'); }
  else if (e === 'playing') { info = `Volta ${v} de 5 em andamento · ${mm(restante())}`; acao = room.seg === 30 ? btn('mbEncerrar', 'Encerrar volta', 'secondary') : ''; }
  else if (e === 'between') { info = `Volta ${v} de 5 concluída`; acao = v < 5 ? btn('mbProxima', 'Abrir próxima volta') : btn('mbFinal', 'Abrir conclusão'); }
  else if (e === 'final') { info = `${mandaram} de ${total} enviaram a conclusão`; acao = btn('mbRevelar', 'Revelar resultados'); }
  else { info = `Resultado revelado · ${mandaram} de ${total} participaram`; acao = btn('mbNova', 'Nova partida'); }
  el.classList.remove('hidden');
  const sinal = `${e}|${v}|${noAmb}|${mandaram}|${total}|${movendo}|${e === 'playing' ? Math.ceil(restante()) : ''}`;
  if (el.dataset.sinal === sinal) return;
  el.dataset.sinal = sinal;
  el.innerHTML = `<span class="mb-rot">MESTRE</span><span class="mb-info" role="status">${info}</span>${acao}`;
  const liga = (id, para) => { const b = document.getElementById(id); if (b) b.onclick = () => avancar(para); };
  liga('mbIniciar', 'playing'); liga('mbEncerrar', 'between'); liga('mbProxima', 'choose'); liga('mbFinal', 'final'); liga('mbRevelar', 'result'); liga('mbNova', 'nova');
}

// ---------------------------------------------------------------- simulador: a sala de mentira tem uma espera com botão
function esperaDoMestre() {
  let el = document.getElementById('salaEspera');
  if (!room || room.fase !== 'sala') { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('div'); el.id = 'salaEspera'; el.className = 'sala-espera'; document.body.appendChild(el); }
  el.innerHTML = eMestre()
    ? `<div class="card"><p class="kicker">SALA ABERTA</p><h2>${players.length} na sala</h2><button class="btn primary" id="mbComecar" type="button">Iniciar partida</button></div>`
    : '<div class="card"><p class="kicker">SALA</p><h2>Aguardando o Mestre iniciar a partida…</h2></div>';
  const b = document.getElementById('mbComecar');
  if (b) b.onclick = async () => { const seg = Number(P.get('seg')) || (FALSA ? 30 : await perguntarRitmo()); await T.atualizarSala({ fase: 'jogo', iniciadaEmMs: Date.now(), ...partidaNova(seg, 1) }); };
}

// ---------------------------------------------------------------- manual: abre logo após a entrada, com "Entendi"
function manualDeEntrada() {
  const chave = 'cinco-loop-manual-' + T.codigo + '-' + T.uid;
  try { if (sessionStorage.getItem(chave)) return; sessionStorage.setItem(chave, '1'); } catch { /* sem sessionStorage: abre sempre */ }
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
