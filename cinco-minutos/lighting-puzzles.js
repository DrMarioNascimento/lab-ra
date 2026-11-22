'use strict';

(() => {
 const locationId = 'eletrica';
 const recordId = 'lighting-log';
 const source = 0;
 const lamps = [2, 7, 8];
 const directions = [
  {bit: 1, name: 'cima', css: 'north', opposite: 4, row: -1, col: 0},
  {bit: 2, name: 'direita', css: 'east', opposite: 8, row: 0, col: 1},
  {bit: 4, name: 'baixo', css: 'south', opposite: 1, row: 1, col: 0},
  {bit: 8, name: 'esquerda', css: 'west', opposite: 2, row: 0, col: -1}
 ];
 // Circuito de 9 posições, da esquerda para a direita e de cima para baixo.
 const connected = [2, 14, 8, 6, 11, 12, 3, 8, 1];
 const stages = ['Cadeado', 'Iluminação', 'Grade de registros'];
 const events = ['Alarme sonoro', 'Marca de referência', 'Queda da luz principal'];
 const times = ['21h55', '21h57', '21h57min45s'];
 const gradeAnswer = [2, 0, 1];
 const alarmSecond = 165;

 function rotate(mask){
  return ((mask << 1) & 15) | (mask >> 3);
 }

 function circuit(wires){
  const live = new Set([source]);
  let openEnds = 0;
  for (const tile of live) {
   const row = Math.floor(tile / 3);
   const col = tile % 3;
   for (const port of directions) {
    if (!(wires[tile] & port.bit)) continue;
    const r = row + port.row, c = col + port.col;
    if (r >= 0 && r < 3 && c >= 0 && c < 3 && (wires[r * 3 + c] & port.opposite)) {
     live.add(r * 3 + c);
    } else {
     openEnds++;
    }
   }
  }
  return {live, ready: live.size === wires.length && openEnds === 0};
 }

 function puzzle(){
  if (state.lightingPuzzle?.loop === state.loop) return state.lightingPuzzle;
  const wires = connected.map((wire, tile) => {
   for (let turn = (tile + state.caseIndex + state.loop) % 4; turn > 0; turn--) wire = rotate(wire);
   return wire;
  });
  state.lightingPuzzle = {loop: state.loop, stage: 0, attempts: [], wires, matches: [null, null, null]};
  save();
  return state.lightingPuzzle;
 }

 function shifted(digit){
  return (digit - 1 + state.caseIndex + state.loop - 1) % 6 + 1;
 }

 function score(guess){
  const answer = [2, 4, 6].map(shifted);
  const exact = guess.filter((value, index) => value === answer[index]).length;
  return [exact, guess.filter(value => answer.includes(value)).length - exact];
 }

 function canPlay(){
  return state?.room === locationId && state.phase === 'playing' &&
   (window.coop?.now() ?? Date.now()) < state.endAt;
 }

 function recordSaved(){
  return state?.clues.some(clue => clue.id === recordId);
 }

 function renderLock(form, data){
  form.innerHTML = `
   <p>Abra o compartimento de inspeção. A combinação tem três números distintos de 1 a 6.</p>
   <table class="lock-log">
    <caption>Tentativas anotadas na etiqueta</caption>
    <thead><tr><th scope="col">Combinação</th><th scope="col">Lugar certo</th><th scope="col">Lugar trocado</th></tr></thead>
    <tbody id="lockLog"></tbody>
   </table>
   <div class="lock-dials">
    ${[0, 1, 2].map(index => `<label>Posição ${index + 1}<select name="dial${index}">
     <option value="">—</option>${[1, 2, 3, 4, 5, 6].map(n => `<option>${n}</option>`).join('')}
    </select></label>`).join('')}
   </div>
   <button class="btn primary" type="submit">Testar combinação</button>`;
  function updateLog(){
   const notes = [[2, 1, 3], [5, 6, 2], [4, 2, 5], [1, 3, 4]].map(guess => guess.map(shifted));
   form.querySelector('#lockLog').innerHTML = [...notes, ...data.attempts.slice(-3)].map(guess => {
    const [exact, misplaced] = score(guess);
    return `<tr><td>${guess.join(' · ')}</td><td>${exact}</td><td>${misplaced}</td></tr>`;
   }).join('');
  }
  updateLog();
  form.onsubmit = event => {
   event.preventDefault();
   if (!canPlay()) return;
   const guess = [0, 1, 2].map(index => Number(form.elements['dial' + index].value));
   if (guess.includes(0) || new Set(guess).size !== 3) {
    setMessage('Escolha três números diferentes.');
    return;
   }
   const [exact, misplaced] = score(guess);
   if (exact === 3) {
    advance(data, 'Cadeado aberto. O circuito da iluminação auxiliar está acessível.');
    return;
   }
   if (!data.attempts.some(attempt => attempt.every((value, index) => value === guess[index]))) {
    data.attempts.push(guess);
    save();
    updateLog();
   }
   setMessage(`Lugar certo: ${exact}. Lugar trocado: ${misplaced}.`);
  };
 }

 function renderBoard(form, data){
  form.innerHTML = `
   <p>Gire os módulos para distribuir energia da fonte às três lâmpadas. O circuito precisa ficar inteiro, sem pontas soltas.</p>
   <div class="lighting-grid" aria-label="Quadro de iluminação">
    ${data.wires.map((_, index) => `<button type="button" data-wire="${index}" class="lighting-tile"></button>`).join('')}
   </div>
   <div class="lighting-legend"><span>◆ Fonte</span><span>● Lâmpada</span></div>
   <p id="lightingProgress" class="muted" role="status"></p>
   <button class="btn primary" type="submit">Energizar circuito</button>`;
  function updateBoard(){
   const {live} = circuit(data.wires);
   form.querySelectorAll('[data-wire]').forEach((button, index) => {
    const ports = directions.filter(port => data.wires[index] & port.bit);
    const terminal = index === source ? 'Fonte' : lamps.includes(index) ? 'Lâmpada' : 'Módulo';
    const powered = live.has(index);
    button.classList.toggle('powered', powered);
    button.setAttribute('aria-label', `${terminal}, linha ${Math.floor(index / 3) + 1}, coluna ${index % 3 + 1}, conexões: ${ports.map(port => port.name).join(', ')}. ${powered ? 'Ligado à fonte' : 'Sem ligação à fonte'}. Girar.`);
    button.innerHTML = ports.map(port => `<i class="lighting-wire ${port.css}" aria-hidden="true"></i>`).join('') +
     `<span class="lighting-node" aria-hidden="true">${index === source ? '◆' : lamps.includes(index) ? '●' : ''}</span>`;
   });
   form.querySelector('#lightingProgress').textContent = `Lâmpadas conectadas: ${lamps.filter(lamp => live.has(lamp)).length} de ${lamps.length}.`;
  }
  form.querySelectorAll('[data-wire]').forEach((button, index) => {
   button.onclick = () => {
    if (!canPlay()) return;
    data.wires[index] = rotate(data.wires[index]);
    save();
    updateBoard();
   };
  });
  form.onsubmit = event => {
   event.preventDefault();
   if (!canPlay()) return;
   if (!circuit(data.wires).ready) {
    setMessage('Ainda há conexões soltas ou módulos fora do circuito.');
    return;
   }
   advance(data, 'Iluminação auxiliar ligada. O leitor de registros voltou a funcionar.');
  };
  updateBoard();
 }

 function renderGrade(form, data){
  form.innerHTML = `
   <p>Cruze as três ocorrências com os horários da mesma noite. Use cada horário uma vez.</p>
   <ul class="grade-hints">
    <li>O estrondo derrubou a luz principal dois minutos depois da marca de referência.</li>
    <li>O aviso sonoro começou 45 segundos após o apagão.</li>
   </ul>
   <table class="lighting-grade">
    <caption>Grade de registros</caption>
    <thead><tr><th scope="col">Ocorrência</th>${times.map(time => `<th scope="col">${time}</th>`).join('')}</tr></thead>
    <tbody>${events.map((label, row) => `<tr><th scope="row">${label}</th>${times.map((time, col) => `
     <td><label><input type="radio" name="record${row}" value="${col}" aria-label="${label}, ${time}" ${data.matches[row] === col ? 'checked' : ''}></label></td>`).join('')}</tr>`).join('')}</tbody>
   </table>
   <button class="btn primary" type="submit">Validar registros</button>`;
  form.onchange = event => {
   if (!canPlay()) return;
   const row = Number(event.target.name.replace('record', ''));
   data.matches[row] = Number(event.target.value);
   save();
  };
  form.onsubmit = event => {
   event.preventDefault();
   if (!canPlay()) return;
   if (new Set(data.matches).size !== 3 || data.matches.includes(null)) {
    setMessage('Associe as três ocorrências a horários diferentes.');
    return;
   }
   if (!data.matches.every((value, index) => value === gradeAnswer[index])) {
    setMessage('Os horários não batem com as duas anotações. Confira os intervalos.');
    return;
   }
   advance(data, 'Ocorrências conferidas.');
  };
 }

 function setMessage(message){
  $('lightingStatus').textContent = message;
 }

 function advance(data, message){
  data.stage++;
  save();
  const section = $('lightingChallenge');
  draw(section, data);
  render(section, elapsedStoryTime(window.coop?.now() ?? Date.now()));
  if (data.stage < stages.length) setMessage(message);
  section.querySelector('h4, .lighting-success')?.focus();
 }

 function draw(section, data){
  section.innerHTML = `
   <ol class="lighting-steps" aria-label="Etapas">${stages.map((stage, index) => `
    <li ${index === data.stage ? 'aria-current="step"' : ''} class="${index < data.stage ? 'complete' : ''}">${index < data.stage ? '✓ ' : ''}${stage}</li>`).join('')}</ol>
   <h4 tabindex="-1">${stages[data.stage] ?? 'Registros conferidos'}</h4>
   <form></form><p id="lightingStatus" class="lighting-status" role="status"></p>`;
  section.dataset.stage = data.stage;
  const form = section.querySelector('form');
  [renderLock, renderBoard, renderGrade][data.stage]?.(form, data);
 }

 function render(section, storySeconds){
  if (!section) return;
  const energized = state.lightingPuzzle?.loop === state.loop && state.lightingPuzzle.stage >= 2;
  $('roomPanel').classList.toggle('auxiliary-lit', energized);
  if (recordSaved()) {
   if (section.dataset.stage !== 'saved') {
    section.dataset.stage = 'saved';
    section.innerHTML = '<p class="lighting-success" tabindex="-1">Registro da iluminação e do alarme guardado no dossiê.</p>';
   }
   return;
  }
  const data = puzzle();
  if (section.dataset.stage !== String(data.stage)) draw(section, data);
  if (data.stage < stages.length) return;
  if (storySeconds < alarmSecond) {
   const message = 'O leitor está pronto. Ele grava o registro no dossiê assim que o aviso sonoro tocar às 21h57min45s.';
   if ($('lightingStatus').textContent !== message) setMessage(message);
   return;
  }
  if (!canPlay()) return;
  const alarm = scenarioClues()[locationId].find(clue => clue.id === 'ele1');
  recordClue(locationId, {
   id: recordId,
   name: 'Registro da iluminação e do alarme',
   tipo: 'Registro',
   text: 'Às 21h57, a iluminação principal caiu. O alarme soou às 21h57min45s. ' + alarm.text
  });
  render(section, storySeconds);
 }

 window.loopLighting = { render };
 if (canPlay()) renderClues();
})();
