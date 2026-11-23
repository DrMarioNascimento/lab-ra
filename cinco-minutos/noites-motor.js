/* Loop · motor das noites (preparação, energia, pistas por horário, combinações, caixote, teoria). Ver docs/ROTEIRO.md.
   Usa as variáveis globais de game.js (state, $, sala, ROOMS, CASES...) só no momento da chamada. */
const BILHETES_KEY = 'cinco-bilhetes-v1';
const nt = () => NOITES[state.caseIndex];
const semente = () => state.museu || 0;
const versaoNoite = () => semente() % 2;
const maiuscula = s => String(s).charAt(0).toUpperCase() + String(s).slice(1);
function caixoteSala(){ const ids = ROOMS.map(r => r.id); return ids[Math.floor(hashTxt('cx'+semente()+':'+state.caseIndex)*ids.length)]; }
function caixoteTripla(){
 const out = []; let k = 0;
 while (out.length < 3) { const i = Math.floor(hashTxt('s'+k+':'+semente()+':'+state.caseIndex)*SIMBOLOS.length); if (!out.includes(i)) out.push(i); k++; }
 return out;
}
const tipoCaixote = () => CAIXOTE_TIPOS[state.caseIndex % 4];
// ---- energia e ferramentas
function kitDaPartida(){ return Array.isArray(state.kit) ? state.kit : []; }
function cargasMax(){ return CARGAS_BASE + kitDaPartida().reduce((n, f) => n + (FERRAMENTAS[f]?.extra || 0), 0); }
function cargasRestantes(){
 if (state.cargasVolta !== state.loop) { state.cargasVolta = state.loop; state.cargas = cargasMax(); }
 return state.cargas;
}
function custoPista(q){ return kitDaPartida().some(f => FERRAMENTAS[f]?.livre && FERRAMENTAS[f].livre === q.tipo) ? 0 : 1; }
function sufixoCusto(q){ return custoPista(q) ? ' · 1 de energia' : ' · sem custo'; }
function cobrarPista(q){
 const custo = custoPista(q);
 if (custo && cargasRestantes() <= 0) { toast('Sem energia na lanterna. Nesta volta, só dá para examinar o que as suas ferramentas facilitam.'); return false; }
 if (custo) { state.cargas = cargasRestantes() - 1; }
 return true;
}
// ---- pistas da noite (rotina por horário, combinações da volta e dicas do caixote), junto das pistas de cada sala
function pistasDaNoite(){
 const n = nt(), c = CASES[state.caseIndex], ci = state.caseIndex, out = {};
 const add = (sala, id, t, nome, texto, tipo) => { (out[sala] ||= []).push({id:'n'+ci+'-'+id, name:nome, time:t, text:texto, tipo}); };
 n.r.forEach((x, k) => add(x[0], 'r'+k, x[1], x[2], x[3], x[4]));
 const v = n.v[versaoNoite()]; add(v[0], 'v', v[1], v[2], v[3], v[4]);
 for (const id of (state.combos?.[state.loop] || [])) { const cb = COMBOS.find(x => x.id === id); if (cb) add(cb.sala, 'c-'+cb.id, cb.t, cb.nome2, cb.f(c), cb.tipo); }
 const tp = tipoCaixote(), tri = caixoteTripla();
 ['conservacao','seguranca','recepcao'].forEach((s, k) => add(s, 'x'+k, 40+k*30, 'Símbolo do caixote', 'Um papel preso à parede diz: "'+maiuscula(tp.passos[k])+': '+SIMBOLOS[tri[k]][1]+' '+SIMBOLOS[tri[k]][0]+'."', 'Registro'));
 add('auditorio', 'x3', 60, 'Regra do caixote', 'Um bilhete lembra: '+tp.regra, 'Registro');
 return out;
}

// ---- muitas pistas (etapa 1, 23/11/2026): em TODAS as salas, uma camada a mais de pistas espalhadas até 4 min 30 s da volta.
// Três de rotina (não decidem nada) e duas de eco (fatos verdadeiros do caso, vistos por outra pessoa; quando a mesma verdade aparece em mais de uma sala, é de propósito).
const ROTINA_MAIS = [
 ['Observar o quadro de avisos','No quadro de avisos, um papel lembra que o museu fecha às 22h e que a grade desce depois disso.'],
 ['Ouvir uma visitante','Uma visitante pergunta, meio perdida, onde fica o café. Ninguém sabe responder.'],
 ['Observar o rodapé','Há uma marca de sapato no rodapé, já meio apagada.'],
 ['Ler a lista de tarefas','A lista de tarefas da noite está quase toda riscada. Falta só uma linha, ilegível.'],
 ['Ouvir um guia cansado','Um guia comenta que o grupo da tarde falou muito e andou devagar.'],
 ['Observar a lixeira','A lixeira está vazia e com saco novo, trocado há pouco.'],
 ['Ler o cartaz da exposição','O cartaz da exposição foi trocado esta semana. A cola ainda cheira forte.'],
 ['Observar a porta','A porta fecha sozinha, devagar, com um barulho de mola.'],
 ['Ouvir o rádio da equipe','O rádio da equipe chia no canto. Dá para ouvir só pedaços de conversa sobre o fechamento.'],
 ['Observar o relógio da parede','O relógio da parede está adiantado uns dois minutos, como sempre.'],
 ['Ler o recibo preso na mesa','Um recibo de material de limpeza está preso na mesa, sem nada de importante.'],
 ['Observar a cadeira','Uma cadeira está fora do lugar, virada para a janela.'],
 ['Ouvir um funcionário','Um funcionário diz que a noite está calma e que quer ir embora cedo.'],
 ['Observar o corrimão','O corrimão foi polido hoje. Dá para ver o reflexo da luz.'],
 ['Ler a etiqueta da vitrine','A etiqueta da vitrine tem o número do lote e a data de entrada do acervo.'],
 ['Observar o tapete','O tapete tem um canto levantado. Alguém já avisou a manutenção.'],
 ['Ouvir passos no corredor','Passos de alguém andando devagar passam pelo corredor e somem.'],
 ['Observar a luz de emergência','A luz de emergência fica acesa, fraquinha, sobre a porta.'],
 ['Ler o aviso de silêncio','Um aviso pede silêncio nas galerias depois das 21h.'],
 ['Observar a janela','Pela janela dá para ver a rua molhada e um carro parado do lado de fora.']
];
const ECOS_CASO = [
 c => ['Ler o aviso interno', 'Um aviso interno conta que '+c.detail+'.', 'Registro', ['event']],
 c => ['Conferir o registro do alarme', labels[c.alarm][1], 'Registro', ['alarm']],
 c => ['Ouvir o relato da ronda', 'Um relato da ronda indica uma figura imóvel em '+sala(c.room).name+'.', 'Relato', ['where']],
 c => ['Ler o recado da equipe', 'Um recado da equipe sugere: '+ACTIONS[c.action], 'Registro', ['action']],
 c => ['Ouvir um colega da ronda', figures[c.figure], 'Relato', ['figure']]
];
function camadaMuitas(base){
 const c = CASES[state.caseIndex], ci = state.caseIndex, T = [30, 80, 140, 200, 255];
 ROOMS.forEach((r, k) => {
  const lista = (base[r.id] ||= []), jit = (k % 3) * 7;
  for (let j = 0; j < 5; j++) {
   const id = 'mp'+ci+'-'+r.id+'-'+j, time = T[j] + jit, h = hashTxt('mp'+id+':'+semente());
   if (j === 1 || j === 3) {
    const e = ECOS_CASO[Math.floor(h*ECOS_CASO.length)](c);
    lista.push({id, name:e[0], time, text:e[1], tipo:e[2], fatos:e[3]});
   } else {
    const x = ROTINA_MAIS[Math.floor(h*ROTINA_MAIS.length)];
    lista.push({id, name:x[0], time, text:x[1], tipo:/^(Ouvir|Conversar)/.test(x[0]) ? 'Relato' : /^(Ler)/.test(x[0]) ? 'Registro' : 'Observação'});
   }
  }
 });
 return pistasEspeciais(base, c, ci);
}
// Pistas especiais (ideias do professor, 23/11/2026). Ninguém mente: as duas são verdadeiras.
function pistasEspeciais(base, c, ci){
 const pend = (base.relogios ||= []), cons = (base.conservacao ||= []);
 pend.push({id:'esp'+ci+'-pend1', name:'Observar o relógio parado', time:20, tipo:'Observação', text:'Um relógio antigo de parede está parado em 21h47. A hora do museu agora é outra. Relógio parado não prova que horas eram.'});
 pend.push({id:'esp'+ci+'-pend2', name:'Abrir a caixa do mecanismo', time:95, tipo:'Observação', text:'Dentro da caixa, um clipe de papel prende os ponteiros às 21h47. Alguém fez isso de propósito, antes de o apagão começar. O relógio foi travado, não quebrou sozinho.'});
 cons.push({id:'esp'+ci+'-tinta1', name:'Examinar a carta em branco', time:0, tipo:'Observação', text:'Na mesa de restauro há uma carta em branco, um pouco enrugada, com cheiro leve de limão. Ao lado, um aquecedor desligado.'});
 cons.push({id:'esp'+ci+'-tinta2', name:'Reler a carta com o aquecedor ligado', time:215, tipo:'Registro', fatos:['event'], text:'O aquecedor da sala ligou sozinho e esquentou o papel. Letras marrons apareceram: "'+maiuscula(c.detail)+'."'});
 const gal = (base.galeria ||= []), rec = (base.recepcao ||= []);
 // Incêndio: dispara o alarme (com água), a tinta falsa escorre e mostra o mapa. A obra se estraga e os seguranças vêm: a sala fica vigiada e a informação só serve na volta seguinte.
 gal.push({id:'esp'+ci+'-fogo', name:'Disparar o alarme de incêndio', time:40, tipo:'Observação', trava:true, fatos:['where'], text:'A água cai, a tinta falsa do quadro valioso escorre e, por baixo, aparece um mapa antigo do museu com uma sala circulada: '+sala(c.room).name+'. A obra está estragada e os seguranças vêm correndo. Você não pode examinar mais nada aqui nesta volta. Use o que viu na próxima.'});
 // Taça: o segurança bebe da mesma taça às 21h58. Derrubar água nela antes disso o manda ao banheiro, e o posto fica sozinho.
 rec.push({id:'esp'+ci+'-taca1', name:'Observar a taça do segurança', time:0, tipo:'Observação', text:'Durante o evento de hoje, o segurança do posto bebe sempre da mesma taça às 21h58. Se algo cair nela antes disso, ele vai ter que sair.'});
 rec.push({id:'esp'+ci+'-taca2', name:'Derrubar água na taça', time:25, ate:110, tipo:'Observação', text:'Você esbarra na taça e a água se espalha. O segurança resmunga, pega um pano e se prepara para ir ao banheiro.'});
 rec.push({id:'esp'+ci+'-taca3', name:'Olhar o posto desprotegido', time:125, requer:'esp'+ci+'-taca2', tipo:'Registro', text:'O segurança saiu e o posto ficou sozinho. Preso sob o balcão há um leitor de impressão digital que guarda uma digital que não é de ninguém da equipe. Ela pode servir para abrir algo trancado.'});
 // Eco da estátua: o som muda se você bater antes ou depois de alguém esconder algo lá dentro.
 const cera = (base.cera ||= []), porc = (base.porcelana ||= []);
 cera.push({id:'esp'+ci+'-eco1', name:'Bater na estátua de bronze', time:10, ate:100, tipo:'Observação', text:'Ao lado das figuras de cera há uma estátua de bronze. Você bate nela com o nó do dedo: um som seco e cheio. Parece maciça.'});
 cera.push({id:'esp'+ci+'-eco2', name:'Bater na estátua outra vez', time:140, requer:'esp'+ci+'-eco1', tipo:'Observação', text:'Agora o som é oco e mais grave. Entre uma batida e outra, alguém escondeu alguma coisa lá dentro.'});
 cera.push({id:'esp'+ci+'-eco3', name:'Olhar dentro da estátua', time:160, requer:'esp'+ci+'-eco2', tipo:'Registro', fatos:['event'], text:'Por uma fresta na base você puxa um papel dobrado. Está escrito: \"'+maiuscula(c.detail)+'.\"'});
 // Peça que quebra e revela uma pista: a alça da xícara solta e traz um papel do cabo oco.
 const ec = ECOS_CASO[Math.floor(hashTxt('xic'+ci+':'+semente())*ECOS_CASO.length)](c);
 porc.push({id:'esp'+ci+'-xicara', name:'Segurar a xícara rachada', time:50, tipo:ec[2], fatos:ec[3], text:'A alça da xícara se solta na sua mão e quebra. Dentro do cabo oco havia um papel enrolado. Está escrito: '+ec[1]+' A xícara não tem mais conserto.'});
 // Fone da visita guiada: a faixa normal traz um eco do caso; uma faixa escondida, ouvida depois, traz outro.
 const sons = (base.sons ||= []), h1 = Math.floor(hashTxt('fone'+ci+':'+semente())*ECOS_CASO.length), e1 = ECOS_CASO[h1](c), e2 = ECOS_CASO[(h1+2)%ECOS_CASO.length](c);
 sons.push({id:'esp'+ci+'-fone1', name:'Colocar o fone da visita guiada', time:35, tipo:'Relato', fatos:e1[3], text:'No fone, a voz da visita guiada fala da sala. De repente ela erra a faixa e, ao fundo, se ouve: '+e1[1]});
 sons.push({id:'esp'+ci+'-fone2', name:'Ouvir a faixa escondida do fone', time:170, requer:'esp'+ci+'-fone1', tipo:'Relato', fatos:e2[3], text:'Você aperta o botão de avançar duas vezes e aparece uma faixa sem nome: uma gravação da ronda. '+e2[1]});
 // Câmera infravermelha: pegadas quentes no chão encerado mostram para onde alguém foi e ficou escondido.
 const seg = (base.seguranca ||= []);
 seg.push({id:'esp'+ci+'-infra1', name:'Ligar a câmera infravermelha', time:100, tipo:'Registro', fatos:['where'], text:'No monitor em visão noturna, pegadas quentes brilham no chão encerado da galeria. Elas saem de lá e seguem até '+sala(c.room).name+'.'});
 seg.push({id:'esp'+ci+'-infra2', name:'Seguir as pegadas no monitor', time:190, requer:'esp'+ci+'-infra1', tipo:'Relato', fatos:['figure'], text:'As pegadas terminam e não voltam. Quem as fez ainda está dentro do prédio, parado no mesmo lugar. '+figures[c.figure]});
 // Temperatura da sala de arquivos: o gráfico do ar-condicionado mostra calor de gente. Ninguém mente: ninguém falou disso.
 const dep = (base.deposito ||= []);
 dep.push({id:'esp'+ci+'-temp1', name:'Ler o gráfico de temperatura', time:45, tipo:'Registro', text:'O ar-condicionado dos arquivos é controlado e deixa a sala sempre fria. No gráfico do computador há um pico de calor das 21h10 às 21h30: duas pessoas ficaram ali dentro, com a porta fechada, por cerca de 20 minutos.'});
 dep.push({id:'esp'+ci+'-temp2', name:'Conferir a ficha de acesso dos arquivos', time:150, requer:'esp'+ci+'-temp1', tipo:'Registro', text:'A ficha de acesso mostra duas entradas às 21h10 e duas saídas às 21h30. Os nomes estão borrados. Ninguém comentou essa visita com a equipe.'});
 return base;
}
function mergeNoite(base){
 const extra = pistasDaNoite();
 for (const sala of Object.keys(extra)) { base[sala] = (base[sala] || []).concat(extra[sala]); }
 return camadaMuitas(base);
}
// ---- preparação (antes da volta 1)
function renderPrep(){
 if (state.prep || state.loop !== 1 || state.phase !== 'choose' || window.coop?.skipPrep) return false;
 const sel = kitDaPartida(), n = nt();
 $('roomGrid').innerHTML = '<div class="prep"><p class="kicker">PREPARAÇÃO</p><h3>'+esc(n.p)+'</h3><p>'+esc(n.intro)+'</p>'+
  '<p><strong>Escolha 2 ferramentas.</strong> Elas valem a noite toda. A lanterna tem '+CARGAS_BASE+' de energia por volta, e cada pista examinada gasta 1.</p>'+
  '<div class="ferramentas">'+Object.entries(FERRAMENTAS).map(([k, f]) => '<button type="button" class="ferramenta" data-nt="kit:'+k+'" aria-pressed="'+sel.includes(k)+'"><span aria-hidden="true">'+f.icone+'</span><strong>'+f.nome+'</strong><small>'+f.texto+'</small></button>').join('')+'</div>'+
  '<button type="button" class="btn primary" data-nt="prep" '+(sel.length === 2 ? '' : 'disabled')+'>Começar a noite</button></div>';
 return true;
}
// ---- caixote e energia dentro da sala
function renderNoitePanel(){
 const panel = $('roomPanel'); if (!panel || !state.room) return;
 let box = panel.querySelector('#noitePanel');
 if (!box) { box = document.createElement('div'); box.id = 'noitePanel'; const h = panel.querySelector('h3'); h ? h.after(box) : panel.prepend(box); }
 const cs = cargasRestantes(), mx = cargasMax();
 let html = '<p class="energia" aria-label="Energia da lanterna: '+cs+' de '+mx+'"><span aria-hidden="true">🔦</span> Energia '+'●'.repeat(cs)+'○'.repeat(Math.max(0, mx - cs))+'<small> '+(kitDaPartida().map(f => FERRAMENTAS[f]?.icone).join(' '))+'</small></p>';
 if (state.room === caixoteSala()) {
  const cx = state.cx || (state.cx = {sel:[0,0,0], erros:{}, aberto:false}), tp = tipoCaixote();
  html += '<div class="caixote"><strong>📦 Caixote trancado</strong><p>'+esc(tp.frase)+'</p>';
  if (cx.aberto && cx.abertoLoop !== state.loop) html += '<p>Você já abriu este caixote. O bilhete está no seu caderno. Ele voltou fechado, como sempre.</p>';
  else if (cx.aberto) html += '<p class="bilhete">Dentro, um papel dobrado: “'+esc(nt().bil)+'”</p>';
  else {
   html += '<div class="discos">'+[0,1,2].map(i => '<button type="button" class="disco" data-nt="disco:'+i+'" aria-label="Fecho '+(i+1)+': '+SIMBOLOS[cx.sel[i]][0]+'">'+SIMBOLOS[cx.sel[i]][1]+'<small>'+SIMBOLOS[cx.sel[i]][0]+'</small></button>').join('')+'</div>'+
    '<button type="button" class="btn secondary" data-nt="abrir">Tentar abrir (1 de energia)</button><p class="dica">'+(cx.msg ? esc(cx.msg) : 'Três erros na mesma volta travam os fechos até a próxima.')+'</p>';
  }
  html += '</div>';
 }
 if (box.dataset.k !== html) { box.dataset.k = html; box.innerHTML = html; }
}
function tentarCaixote(){
 const cx = state.cx, tri = caixoteTripla(), L = String(state.loop);
 if ((cx.erros[L] || 0) >= ERROS_CAIXOTE) { cx.msg = 'Os fechos travaram nesta volta. Tente na próxima.'; return; }
 if (cargasRestantes() <= 0) { cx.msg = 'Sem energia na lanterna para tentar de novo nesta volta.'; return; }
 state.cargas = cargasRestantes() - 1;
 const certos = cx.sel.filter((s, i) => s === tri[i]).length;
 if (certos === 3) {
  cx.aberto = true; cx.abertoLoop = state.loop; cx.msg = '';
  guardarBilhete();
  state.clues.push({id:'n'+state.caseIndex+'-bil', room:'Caixote', name:'Bilhete de T.', text:nt().bil, tipo:'Registro', loop:state.loop});
  toast('O caixote abriu. Um bilhete foi guardado no caderno.');
 } else {
  cx.erros[L] = (cx.erros[L] || 0) + 1;
  cx.msg = certos ? certos+' fecho'+(certos > 1 ? 's cederam' : ' cedeu')+', mas o caixote continua trancado.' : 'Nenhum fecho cedeu.';
 }
}
function guardarBilhete(){
 try { const l = JSON.parse(localStorage.getItem(BILHETES_KEY)) || []; if (!l.includes(state.caseIndex)) l.push(state.caseIndex); localStorage.setItem(BILHETES_KEY, JSON.stringify(l)); } catch {}
}
function bilhetesGuardados(){ try { return JSON.parse(localStorage.getItem(BILHETES_KEY)) || []; } catch { return []; } }
function blocoT(){
 const l = bilhetesGuardados(); if (!l.length) return '';
 const linhas = MENSAGEM_T.slice(0, Math.floor(l.length / 3));
 return '<div class="result-card"><strong>Bilhetes de T.</strong><p>Você guardou '+l.length+' de '+NOITES.length+' bilhetes.</p>'+
  l.map(i => '<p>“'+esc(NOITES[i].bil)+'”</p>').join('')+
  (linhas.length ? '<p><strong>A mensagem aos poucos:</strong><br>'+linhas.map(esc).join('<br>')+'</p>' : '<p>Com 3 bilhetes, a mensagem começa a aparecer.</p>')+'</div>';
}
// ---- combinações entre voltas
function renderCombos(){
 const old = $('comboBox'); if (old) old.remove();
 if (state.loop >= 5) return;
 state.combos ||= {};
 const L = state.loop + 1, esc2 = state.combos[L] || [];
 const opcoes = [0,1,2,3].map(k => COMBOS[(state.caseIndex + k) % COMBOS.length]);
 const box = document.createElement('div'); box.id = 'comboBox'; box.className = 'combo-box';
 box.innerHTML = '<p class="kicker">COMBINE ANTES DA PRÓXIMA VOLTA</p><p>Escolha até 2. As pessoas se lembram e fazem isso na próxima volta. O resultado aparece numa pista da sala certa.</p>'+
  opcoes.map(o => '<button type="button" class="combo" data-nt="combo:'+o.id+'" aria-pressed="'+esc2.includes(o.id)+'">'+o.nome+'</button>').join('');
 $('nextLoop').before(box);
}
// ---- teoria final (3 partes)
function opcoesTeoria(){
 const ci = state.caseIndex, c = CASES[ci], N = CASES.length;
 const a = {q:'1. O que aconteceu com a peça?', ok:maiuscula(c.detail)+'.', x:[maiuscula(CASES[(ci+4)%N].detail)+'.', maiuscula(CASES[(ci+9)%N].detail)+'.']};
 const al = Object.keys(ALARMS).filter(k => k !== c.alarm);
 const b = {q:'2. Por que pareceu um desaparecimento?', ok:ALARMS[c.alarm], x:al.map(k => ALARMS[k])};
 const ac = Object.keys(ACTIONS).filter(k => k !== c.action && k !== 'isolar');
 const cc = {q:'3. Que combinação entre setores evitaria a confusão?', ok:ACTIONS[c.action], x:[ACTIONS[ac[ci % ac.length]], ACTIONS[ac[(ci+1) % ac.length]]]};
 return {a, b, c:cc};
}
function ordemTeoria(parte, ops){ return [ops.ok, ...ops.x].map((t, i) => ({t, ok:i === 0, k:hashTxt('t'+parte+state.caseIndex+i)})).sort((p, q) => p.k - q.k); }
function renderTeoria(){
 const ops = opcoesTeoria(), sv = state.draft || {};
 return '<div class="teoria"><p class="kicker">SUA TEORIA</p><p>Junte tudo em três frases. Cada parte certa vale 10 pontos.</p>'+
  Object.entries(ops).map(([p, o]) => '<div class="answer-field"><label for="teo_'+p+'">'+o.q+'</label><select id="teo_'+p+'"><option value="">Ainda não sei</option>'+ordemTeoria(p, o).map(x => '<option value="'+esc(x.t)+'" '+(sv['teo_'+p] === x.t ? 'selected' : '')+'>'+esc(x.t)+'</option>').join('')+'</select></div>').join('')+'</div>';
}
function lerTeoria(){ const out = {}; for (const p of ['a','b','c']) out['teo_'+p] = $('teo_'+p)?.value ?? ''; return out; }
function teoriaResultado(answers){
 const ops = opcoesTeoria(); let pts = 0;
 const linhas = Object.entries(ops).map(([p, o]) => { const r = answers?.['teo_'+p] || '', ok = r === o.ok; if (ok) pts += 10;
  return '<p><strong>'+esc(o.q)+'</strong><br>Sua resposta: '+esc(r || 'Ainda não sei')+(ok ? ' ✓' : '<br>O que sustenta os fatos: '+esc(o.ok))+'</p>'; }).join('');
 const msg = pts === 30 ? 'Sua teoria fecha com os fatos.' : pts ? 'Sua teoria está em parte sustentada. Faltou confirmar o que está acima.' : 'Sua teoria ainda não se sustenta nos fatos. Veja o que faltou acima.';
 return '<div class="result-card"><strong>Sua teoria · '+pts+' de 30</strong>'+linhas+'<p>'+msg+'</p></div>';
}
// ---- cliques (delegação)
document.addEventListener('click', e => {
 const b = e.target.closest('[data-nt]'); if (!b || !state) return;
 const [acao, arg] = b.dataset.nt.split(':');
 if (acao === 'kit') { const k = kitDaPartida().slice(); const i = k.indexOf(arg); if (i >= 0) k.splice(i, 1); else if (k.length < 2) k.push(arg); state.kit = k; save(); renderPrep(); }
 else if (acao === 'prep') { if (kitDaPartida().length === 2) { state.prep = true; state.cargasVolta = 0; save(); renderGame(); } }
 else if (acao === 'combo') { state.combos ||= {}; const L = state.loop + 1, l = (state.combos[L] || []).slice(); const i = l.indexOf(arg); if (i >= 0) l.splice(i, 1); else if (l.length < 2) l.push(arg); state.combos[L] = l; save(); renderCombos(); }
 else if (acao === 'disco') { state.cx ||= {sel:[0,0,0], erros:{}, aberto:false}; const i = Number(arg); state.cx.sel[i] = (state.cx.sel[i] + 1) % SIMBOLOS.length; save(); renderNoitePanel(); }
 else if (acao === 'abrir') { state.cx ||= {sel:[0,0,0], erros:{}, aberto:false}; tentarCaixote(); save(); renderNoitePanel(); renderJournal(); }
});
