'use strict';

(() => {
 const mount = $('signalMount');
 const journal = $('journalMap');
 const symbols = [
  ['○', 'Círculo'],
  ['△', 'Triângulo'],
  ['□', 'Quadrado'],
  ['◇', 'Losango']
 ];
 // Ordem das salas de oeste a leste na mesma planta usada pela maquete.
 const floors = {
  '2º andar': ['', '', 'galeria', 'auditorio', 'jogos', '', 'cranios', 'mobilia', '', '', 'gigantes', 'predadores', 'porcelana', 'saguao', '', 'veiculos'],
  '1º andar': ['', '', 'vidros', 'mar', 'prototipo', '', 'eletrica', 'deposito', '', '', 'fosseis', 'relogios', 'fotografia', 'asas', '', 'protecoes'],
  'Térreo': ['', '', 'brinquedos', 'lanternas', 'sons', 'patio', 'cotidiano', 'ambar', '', '', 'conservacao', 'seguranca', 'corredor', 'recepcao', '', 'atelie']
 };
 const rooms = Object.fromEntries([INICIO, ...ROOMS].map(room => [room.id, room]));
 mount.innerHTML = `
  <section class="signal-console hidden" aria-labelledby="signalTitle">
   <div class="signal-header">
    <div><h4 id="signalTitle">Painel de sinais do saguão</h4><p id="signalIntro"></p></div>
    <button id="signalOpen" class="btn secondary" type="button" aria-controls="signalBody" aria-expanded="false">Acionar painel</button>
   </div>
   <div id="signalBody" hidden>
    <p id="signalMessage" role="status" aria-atomic="true"></p>
    <div class="signal-keys" aria-label="Teclas do painel">
     ${symbols.map(([shape, name], i) => `<button class="signal-key" type="button" data-signal="${i}" aria-label="${name}"><span aria-hidden="true">${shape}</span></button>`).join('')}
    </div>
    <div class="signal-actions">
     <button id="signalRepeat" class="btn secondary" type="button">Rever sequência</button>
     <button id="signalClose" class="text-button" type="button">Voltar à escolha da sala</button>
    </div>
   </div>
  </section>`;
 journal.innerHTML = `<details class="museum-plan" hidden>
  <summary>Planta do museu</summary>
  <p>Planta esquemática dos três andares. A área central indica a circulação. Você começa no Saguão superior.</p>
  <div class="plan-floors" aria-label="Andares">
   ${ANDARES.map(andar => `<button class="btn secondary" type="button" aria-pressed="false" data-floor="${andar}">${andar}</button>`).join('')}
  </div>
  <ul id="planRooms" class="plan-rooms"></ul>
 </details>`;
 const consolePanel = mount.firstElementChild;
 const plan = journal.firstElementChild;
 const keys = [...mount.querySelectorAll('[data-signal]')];
 const floorButtons = [...journal.querySelectorAll('[data-floor]')];
 let playback;
 let generation = 0;
 let step = 0;
 let accepting = false;

 function canPlay(){
  return state?.phase === 'playing' && !state.room && !state.signalMap &&
   (window.coop?.now() ?? Date.now()) < state.endAt;
 }

 function canStart(){
  return !window.coop && state?.phase === 'choose' && !state.room && !state.signalMap;
 }

 function updateInputs(){
  keys.forEach(key => { key.disabled = !accepting; });
  $('signalRepeat').disabled = playback !== undefined;
 }

 function stopPlayback(){
  generation++;
  clearTimeout(playback);
  playback = undefined;
  accepting = false;
  keys.forEach(key => key.classList.remove('lit'));
  updateInputs();
 }

 function close(){
  stopPlayback();
  $('signalBody').hidden = true;
  $('signalOpen').setAttribute('aria-expanded', 'false');
 }

 function render(){
  const unlocked = state?.signalMap === true;
  const inLobby = state && !state.room && ['choose', 'playing'].includes(state.phase);
  consolePanel.classList.toggle('hidden', !inLobby);
  $('signalOpen').disabled = !unlocked && !canStart() && !canPlay();
  $('signalOpen').textContent = unlocked ? 'Consultar planta' : 'Acionar painel';
  $('signalIntro').textContent = unlocked ? 'A planta está disponível no dossiê.'
   : window.coop && state?.phase === 'choose' ? 'Disponível assim que o relógio da sala começar.'
   : 'Repita quatro sinais para abrir a planta. O relógio corre enquanto você joga.';
  if (!canPlay() && !$('signalBody').hidden) close();
 }

 function showFloor(andar){
  floorButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.floor === andar)));
  $('planRooms').setAttribute('aria-label', andar);
  $('planRooms').innerHTML = floors[andar].map((id, position) => {
   const style = `grid-row:${Math.floor(position / 4) + 1};grid-column:${position % 4 + 1}`;
   if (!id) return '';
   return `<li style="${style}" class="${id === INICIO.id ? 'plan-origin' : ''}">${rooms[id].name}</li>`;
  }).join('');
 }

 function updateJournal(){
  plan.hidden = state?.signalMap !== true;
  if (plan.hidden) plan.open = false;
 }

 function openPlan(){
  renderJournal();
  plan.open = true;
  $('signalOpen').focus();
  popup('journalDialog');
  plan.querySelector('summary').focus();
 }

 function playSequence(){
  if (!canPlay()) return;
  stopPlayback();
  step = 0;
  const run = generation;
  const sequence = state.signalSequence;
  function flash(index){
   if (run !== generation) return;
   if (!canPlay()) { close(); return; }
   if (index === sequence.length) {
    playback = undefined;
    accepting = true;
    updateInputs();
    $('signalMessage').textContent = 'Sua vez. Repita os quatro sinais.';
    keys[0].focus();
    return;
   }
   const signal = sequence[index];
   keys[signal].classList.add('lit');
   $('signalMessage').textContent = `Sinal ${index + 1} de ${sequence.length}: ${symbols[signal][1]}.`;
   playback = setTimeout(() => {
    keys[signal].classList.remove('lit');
    playback = setTimeout(() => flash(index + 1), 250);
   }, 850);
   updateInputs();
  }
  flash(0);
 }

 $('signalOpen').onclick = () => {
  if (state?.signalMap) {
   openPlan();
   return;
  }
  if (!$('signalBody').hidden) return;
  if (canStart()) {
   startSoloClock();
   save();
   renderGame();
  }
  if (!canPlay()) return;
  if (!state.signalSequence) {
   const signals = crypto.getRandomValues(new Uint8Array(4));
   state.signalSequence = Array.from(signals, (value, index) => {
    const previous = index ? signals[index - 1] % symbols.length : -1;
    const signal = value % symbols.length;
    signals[index] = signal === previous ? (signal + 1) % symbols.length : signal;
    return signals[index];
   });
   save();
  }
  $('signalOpen').setAttribute('aria-expanded', 'true');
  $('signalBody').hidden = false;
  playSequence();
 };
 $('signalRepeat').onclick = playSequence;
 $('signalClose').onclick = () => {
  close();
  $('signalOpen').focus();
 };
 keys.forEach((key, signal) => {
  key.onclick = () => {
   if (!accepting || !canPlay()) return;
   if (signal !== state.signalSequence[step]) {
    accepting = false;
    updateInputs();
    $('signalMessage').textContent = 'A ordem saiu diferente. Reveja a sequência ou vá para uma sala.';
    $('signalRepeat').focus();
    return;
   }
   step++;
   if (step < state.signalSequence.length) {
    $('signalMessage').textContent = `${step} de ${state.signalSequence.length} sinais confirmados.`;
    return;
   }
   state.signalMap = true;
   save();
   render();
   openPlan();
  };
 });
 floorButtons.forEach(button => { button.onclick = () => showFloor(button.dataset.floor); });
 showFloor(INICIO.andar);
 window.loopSignalPanel = { close, render, renderJournal: updateJournal };
 render();
 updateJournal();
})();
