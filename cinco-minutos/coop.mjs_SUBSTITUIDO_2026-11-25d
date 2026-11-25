import { connect, normalizeCode, readConfig } from './rooms.mjs?v=2';

const sessionKey = 'cinco-minutos-sala-v1';
let service;
let config;
let code;
let room;
let unwatch;
let online = false;
let moving = false;
let entering = false;
let screen;
let syncAt = 0;

const isHost = () => room?.host === service?.uid;
const status = message => $('coopStatus').textContent = message;
const messageFor = error => ({
  'permission-denied': 'Sala indisponível. Confira o código, o prazo do convite ou se a partida já começou.',
  'auth/operation-not-allowed': 'A entrada de convidados ainda aguarda ativação.',
  'auth/unauthorized-domain': 'Este endereço ainda aguarda liberação para as salas.',
  unavailable: 'A conexão com a sala caiu. Tente novamente quando estiver online.'
}[error.code] ?? error.message);

function invitation() {
  const url = new URL(location.href);
  url.searchParams.set('sala', code);
  return url.href;
}

function savedCode(value) {
  try {
    if (value) localStorage.setItem(sessionKey, JSON.stringify(value));
    else localStorage.removeItem(sessionKey);
  } catch {}
}

function setEntryBusy(busy) {
  entering = busy;
  $('coopCreate').disabled = busy;
  $('coopJoinForm').querySelector('button').disabled = busy;
}

async function enter(create, resume) {
  if (entering || code) return;
  const name = $('coopName').value.trim();
  const candidate = resume || normalizeCode($('coopCodeInput').value);
  if (!resume && !name) {
    status('Escolha um apelido.');
    $('coopName').focus();
    return;
  }
  if (!create && !/^[A-Z2-9]{12}$/.test(candidate)) {
    status('Confira as 12 letras ou números do código.');
    $('coopCodeInput').focus();
    return;
  }

  setEntryBusy(true);
  status('Conectando à sala…');
  try {
    service ??= await connect(config ??= await readConfig());
    if (create) {
      code = await service.create(name, Number($('coopSpeed').value), chooseCase());
    } else {
      if (!resume) await service.join(candidate, name);
      code = candidate;
    }
    unwatch = service.watch(code, accept, error => {
      resetSession();
      status(messageFor(error));
      popup('coopDialog');
    });
  } catch (error) {
    if (resume) savedCode(null);
    status(messageFor(error));
    popup('coopDialog');
  } finally {
    setEntryBusy(false);
  }
}

function resetSession() {
  if (unwatch) unwatch();
  unwatch = null;
  if (window.coop) clearInterval(timerHandle);
  const wasPlaying = !!window.coop;
  room = code = screen = undefined;
  online = false;
  window.coop = null;
  savedCode(null);
  $('coopBar').classList.add('hidden');
  $('coopEntry').classList.remove('hidden');
  $('coopLobby').classList.add('hidden');
  $('coopLink').classList.add('hidden');
  if (wasPlaying) restoreSolo();
}

function updateLobby() {
  $('coopCode').textContent = code.match(/.{4}/g).join('–');
  $('coopLink').value = invitation();
  $('coopMembers').replaceChildren(...Object.entries(room.members).map(([uid, name]) => {
    const item = document.createElement('li');
    item.textContent = name + (uid === room.host ? ' · anfitrião' : '');
    return item;
  }));
  $('coopEntry').classList.add('hidden');
  $('coopLobby').classList.remove('hidden');
  $('coopStart').classList.toggle('hidden', !isHost() || room.phase !== 'lobby');
  $('coopStart').disabled = !online || moving || Object.keys(room.members).length < 2;
  $('coopLobbyHint').textContent = room.phase === 'lobby'
    ? (isHost() ? 'Compartilhe o convite. A investigação começa com pelo menos duas pessoas.' : 'Aguarde o anfitrião começar.')
    : 'A investigação já começou. Quem já entrou pode retornar neste mesmo navegador.';
  $('coopBar').classList.remove('hidden');
  $('coopBarText').textContent = 'Sala ' + $('coopCode').textContent + (online ? '' : ' · reconectando');
}

function accept(data, fromCache) {
  online = !fromCache;
  if (!data || !Object.hasOwn(data.members, service.uid)) {
    if (fromCache) return;
    resetSession();
    status('Convite indisponível. Entre novamente com um código válido.');
    popup('coopDialog');
    return;
  }
  const previous = room;
  room = data;
  if (online) savedCode(code);
  status(online ? '' : 'Reconectando…');
  updateLobby();
  if (data.phase === 'lobby') {
    if (!previous) popup('coopDialog');
    return;
  }
  if (previous?.phase === 'lobby' && $('coopDialog').open) $('coopDialog').close();
  if (!window.coop) {
    clearInterval(timerHandle);
    window.coop = {
      storageKey: 'cinco-minutos-caderno-' + code,
      choose, decorate, move, now: service.now, tick: tickRoom, open: () => popup('coopDialog')
    };
    state = load(window.coop.storageKey, {}) ?? {};
    state.clues ??= [];
    state.hints ??= 0;
    state.notes ??= '';
    timerHandle = setInterval(tickRoom, 250);
  }
  const newScreen = data.phase + ':' + data.loop;
  if (screen !== newScreen) {
    screen = newScreen;
    renderPhase();
  } else if (data.phase === 'choose' || data.phase === 'playing') {
    decorate();
  }
}

function remainingSeconds(endAt) {
  return Math.max(0, Math.min(room.seconds, (endAt - service.now()) / 1000));
}

function renderPhase() {
  if (state.loop !== room.loop) state.room = null;
  Object.assign(state, {
    caseIndex: room.caseIndex,
    loop: room.loop,
    phase: room.phase,
    caseRules: 2,
    duration: room.seconds,
    endAt: room.startedAt ? room.startedAt.toMillis() + room.seconds * 1000 : null,
    remaining: room.phase === 'playing' ? remainingSeconds(room.startedAt.toMillis() + room.seconds * 1000) : room.seconds,
    answers: room.answers
  });
  save();
  if (room.phase === 'choose' || room.phase === 'playing') {
    renderGame();
    show('game');
  } else if (room.phase === 'between') {
    $('betweenCount').textContent = state.clues.length;
    $('betweenLoop').textContent = room.loop + ' / 5';
    $('betweenTitle').textContent = room.loop === 5 ? 'Os ciclos terminaram.' : 'Vocês se lembram.';
    $('nextLoop').textContent = room.loop === 5 ? 'Abrir conclusão' : 'Abrir próxima volta';
    $('nextLoop').classList.toggle('hidden', !isHost());
    renderBetweenPlan();
    show('between');
  } else if (room.phase === 'final') {
    renderForm();
    $('reflectionForm').classList.toggle('hidden', !isHost());
    $('answerFields').classList.toggle('hidden', !isHost());
    $('answerForm').querySelector('button[type=submit]').classList.toggle('hidden', !isHost());
    $('final').querySelector('.large').textContent = isHost()
      ? 'Registre o desfecho do grupo. As perguntas são opcionais.'
      : 'O anfitrião registra o desfecho depois da discussão do grupo.';
    show('final');
  } else {
    renderResult();
    $('replay').textContent = 'Voltar à sala';
    show('result');
  }
}

function choose(id) {
  if (!online || !['choose', 'playing'].includes(room.phase) || state.room === id) return;
  if (state.endAt && service.now() >= state.endAt) return;
  if (state.room && room.phase !== 'playing') return;
  if (state.room) { if (andando()) return; marcarCaminhada(); toast('Você vai para outra sala. A caminhada leva 10 segundos.'); }
  state.room = id;
  save();
  renderGame();
}

function decorate() {
  const choosing = room.phase === 'choose';
  const playing = room.phase === 'playing';
  $('coopBegin').classList.toggle('hidden', !choosing || !isHost());
  $('coopBegin').disabled = moving || !online;
  $('endLoop').classList.toggle('hidden', !playing || !isHost() || room.seconds !== 30);
  $('endLoop').disabled = moving || !online;
  $('phaseDescription').textContent = choosing ? 'Escolha onde investigar. O anfitrião inicia o relógio.' :
    state.room ? 'Examine a peça ou use a lista de pistas.' : 'O relógio começou. Escolha onde investigar.';
  $('statusText').textContent = state.room ? 'Você pode ir a outra sala quando quiser: a caminhada leva 10 segundos.' : 'Escolha um ambiente para investigar nesta volta.';
  $('roomPanel').classList.toggle('hidden', !playing || !state.room);
  for (const button of $('roomGrid').querySelectorAll('button')) button.disabled = !!state.room || !online;
}

function tickRoom() {
  if (room?.phase !== 'playing') return;
  const old = state.remaining;
  state.remaining = remainingSeconds(state.endAt);
  $('timer').textContent = fmt(state.remaining);
  $('fictionTime').textContent = museumTime();
  if (state.room && Math.ceil(old) !== Math.ceil(state.remaining)) renderClues();
  if (online && isHost() && !moving && service.now() >= state.endAt + 1250) move('between');
}

async function move(phase, answers) {
  if (!room || !online || !isHost() || moving) return;
  moving = true;
  updateLobby();
  if (room.phase === 'choose' || room.phase === 'playing') decorate();
  try {
    await service.advance(code, room, phase, phase === 'result' ? { ...answers, loopFinal: lcFinal(), loopFatos: window.lcFatos ? window.lcFatos() : [] } : answers);
  } catch (error) {
    toast(messageFor(error));
    if (room?.phase === 'playing' && phase === 'between') await service.syncClock().catch(() => {});
    await new Promise(resolve => setTimeout(resolve, 1750));
  } finally {
    moving = false;
    if (room) updateLobby();
    if (['choose', 'playing'].includes(room?.phase)) decorate();
  }
}

async function open() {
  popup('coopDialog');
  if (room) {
    updateLobby();
    return;
  }
  if (entering || config) return;
  setEntryBusy(true);
  try {
    config = await readConfig();
    status('');
    setEntryBusy(false);
  } catch (error) {
    status(messageFor(error));
    entering = false;
  }
}

for (const button of document.querySelectorAll('[data-coop]')) button.onclick = open;
$('coopControls').onclick = open;
$('coopCreate').onclick = () => enter(true);
$('coopJoinForm').onsubmit = event => { event.preventDefault(); enter(false); };
$('coopStart').onclick = () => move('choose');
$('coopBegin').onclick = () => move('playing');
$('coopCopy').onclick = async () => {
  try {
    await navigator.clipboard.writeText(invitation());
    status('Link copiado.');
  } catch {
    $('coopLink').classList.remove('hidden');
    $('coopLink').select();
  }
};
$('coopLeave').onclick = async () => {
  if (room?.phase === 'lobby' && !isHost()) {
    try {
      await service.leave(code);
    } catch (error) {
      status(messageFor(error));
      return;
    }
  }
  const url = new URL(location.href);
  url.searchParams.delete('sala');
  history.replaceState(null, '', url);
  resetSession();
  $('coopDialog').close();
};

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && service && room && performance.now() - syncAt > 15000) {
    syncAt = performance.now();
    service.syncClock().catch(() => {});
  }
});

const requested = normalizeCode(new URL(location.href).searchParams.get('sala') ?? '');
const remembered = load(sessionKey, null);
if (requested && requested !== remembered) {
  $('coopCodeInput').value = requested;
  open();
} else if (/^[A-Z2-9]{12}$/.test(remembered)) {
  enter(false, remembered);
}
