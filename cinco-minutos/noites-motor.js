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
 if (state.cargasVolta !== state.loop) { state.cargasVolta = state.loop; state.cargas = Math.max(0, cargasMax() - ((state.lc && state.lc.debitos && state.lc.debitos[state.loop]) || 0)); }
 return state.cargas;
}
function custoPista(q){ if (q.custo0) return 0; return kitDaPartida().some(f => FERRAMENTAS[f]?.livre && FERRAMENTAS[f].livre === q.tipo) ? 0 : 1; }
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

// ---- enigmas (cifras, cadeados e adivinhas): o jogador digita a resposta; só depois a pista é registrada. Catálogo completo em docs/CATALOGO-ENIGMAS.md.
const semAcento = t => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '');
const normResp = t => semAcento(t).toUpperCase().replace(/[^A-Z0-9]/g, '');
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const cifCesar = (t, k) => t.replace(/[A-Z]/g, ch => ABC[(ABC.indexOf(ch) + k) % 26]);
const cifAtbash = t => t.replace(/[A-Z]/g, ch => ABC[25 - ABC.indexOf(ch)]);
const cifA1Z26 = t => t.split('').map(ch => ABC.indexOf(ch) + 1).join('-');
const MORSE = {A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..'};
const cifMorse = t => t.split('').map(ch => MORSE[ch]).join(' ');
const cifBin = t => t.split('').map(ch => ch.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
function cifAnagrama(t, sem){ const a = t.split(''); let tent = 0, r; do { r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(hashTxt(sem+':'+tent+':'+i) * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } tent++; } while (r.join('') === t && tent < 20); return r.join(''); }
function fatoChave(tipo, c){
 const sc = sala(c.room).name;
 if (tipo === 0) return {palavra:c.room.toUpperCase(), fatos:['where'], texto:'A mensagem decifrada aponta para um lugar: a figura imóvel está em '+sc+'.'};
 if (tipo === 1) return {palavra:c.figure.toUpperCase(), fatos:['figure'], texto:'A mensagem decifrada aponta para uma pessoa. '+figures[c.figure]};
 if (tipo === 2) return {palavra:c.action.toUpperCase(), fatos:['action'], texto:'A mensagem decifrada manda fazer algo. '+ACTIONS[c.action]};
 if (tipo === 3) return {palavra:c.alarm.toUpperCase(), fatos:['alarm'], texto:'A mensagem decifrada fala do alarme. '+labels[c.alarm][1]};
 return {palavra:c.event.toUpperCase(), fatos:['event'], texto:'A mensagem decifrada conta o que houve: '+c.detail+'.'};
}
function pistasEnigmas(base, c, ci){
 const add = (sala, q) => (base[sala] ||= []).push({tipo:'Registro', ...q});
 const kw = i => fatoChave((i + ci) % 5, c);
 const mk = (i, sala, id, nome, time, enun, cifrado, rotulo) => { const f = kw(i); add(sala, {id:'enig'+ci+'-'+id, name:nome, time, fatos:f.fatos, text:'Cifra: '+cifrado(f.palavra).cifrado+'. Palavra-chave: '+f.palavra+'. '+f.texto, enigma:{rotulo:rotulo||'DECIFRAR', enunciado:enun, cifrado:cifrado(f.palavra).cifrado, resposta:f.palavra}}); };
 const k = 2 + (ci % 9);
 // 1 César: o deslocamento está no relógio de parede da mesma sala
 add('fotografia', {id:'enig'+ci+'-cesar-chave', name:'Olhar o relógio de parede', time:15, text:'O relógio de parede marca exatamente '+k+' horas. Um bilhete colado nele diz: "É o mesmo tanto que está no papel da mesa."'});
 mk(0, 'fotografia', 'cesar', 'Ler o bilhete cifrado', 30, 'Cada letra deste bilhete foi empurrada para a frente no alfabeto tantas casas quanto o relógio de parede marca. Qual é a palavra-chave?', p => ({cifrado:cifCesar(p, k)}));
 // 2 Morse: a tabela está afixada na parede
 add('sons', {id:'enig'+ci+'-morse-tab', name:'Ler a tabela de Morse na parede', time:15, text:'Na parede da sala há uma tabela de pontos e traços: '+Object.entries(MORSE).map(([a,b]) => a+' '+b).join(' · ')+'.'});
 mk(1, 'sons', 'morse', 'Ouvir as batidas no cano', 40, 'Alguém bate no cano: ponto é batida curta e traço é batida longa. A tabela está na parede. Qual é a palavra-chave?', p => ({cifrado:cifMorse(p)}));
 // 3 Atbash: o espelho mostra o alfabeto invertido
 add('vidros', {id:'enig'+ci+'-atbash-chave', name:'Olhar o alfabeto no espelho', time:15, text:'No espelho o alfabeto aparece de trás para a frente: o A vira Z, o B vira Y, o C vira X, e assim por diante.'});
 mk(2, 'vidros', 'atbash', 'Ler a mensagem no vidro', 40, 'Esta mensagem foi escrita com o alfabeto invertido. Qual é a palavra-chave?', p => ({cifrado:cifAtbash(p)}));
 // 4 A1Z26
 add('jogos', {id:'enig'+ci+'-a1z26-chave', name:'Ler o cartão da partida', time:15, text:'O cartão da partida lembra que A vale 1, B vale 2, C vale 3, e assim por diante, até o Z, que vale 26.'});
 mk(3, 'jogos', 'a1z26', 'Somar as casas do tabuleiro', 40, 'Cada número da fileira é a posição de uma letra no alfabeto. Qual é a palavra-chave?', p => ({cifrado:cifA1Z26(p)}));
 // 5 ROT13
 add('mobilia', {id:'enig'+ci+'-rot13-chave', name:'Ler a anotação no rodapé do livro', time:15, text:'No rodapé do livro alguém escreveu a lápis: "O alfabeto tem 26 letras. Gire exatamente metade."'});
 mk(4, 'mobilia', 'rot13', 'Ler o livro esquecido na poltrona', 40, 'Uma linha do livro está escrita com as letras giradas. Qual é a palavra-chave?', p => ({cifrado:cifCesar(p, 13)}));
 // 6 Binário
 add('eletrica', {id:'enig'+ci+'-bin-chave', name:'Ler a tabela do painel', time:15, text:'A tabela do painel diz: A é 01000001, B é 01000010, C é 01000011. Cada letra seguinte soma 1.'});
 mk(0, 'eletrica', 'bin', 'Ler a fileira de luzes do painel', 45, 'Luz acesa é 1 e luz apagada é 0. Cada grupo de oito vira uma letra. Qual é a palavra-chave?', p => ({cifrado:cifBin(p)}));
 // 7 Anagrama
 mk(1, 'asas', 'anagrama', 'Montar as letrinhas da placa', 45, 'As letras desta placa caíram embaralhadas. Reorganize para formar a palavra-chave.', p => ({cifrado:cifAnagrama(p, 'an'+ci).split('').join(' ')}), 'ANAGRAMA');
 // 8 Frase de trás para a frente
 { const f = kw(2); const frase = 'A PALAVRA SECRETA E '+f.palavra; add('auditorio', {id:'enig'+ci+'-inv', name:'Ler o bilhete de trás para a frente', time:50, fatos:f.fatos, text:'Bilhete lido ao contrário: "'+frase+'". '+f.texto, enigma:{rotulo:'DECIFRAR', enunciado:'Este bilhete está escrito de trás para a frente. Leia do fim para o começo. Qual é a palavra secreta?', cifrado:frase.split('').reverse().join(''), resposta:f.palavra}}); }
 // 9 Adivinha
 { const f = kw(3); add('mar', {id:'enig'+ci+'-adivinha', name:'Ler a adivinha da placa', time:55, fatos:f.fatos, text:'A resposta da adivinha é MAPA. No verso do mapa há um recado: '+f.texto, enigma:{rotulo:'ADIVINHA', enunciado:'A placa pergunta:', cifrado:'"Tenho cidades, mas não tenho casas. Tenho montanhas, mas não tenho árvores. Tenho água, mas não tenho peixes. O que eu sou?"', resposta:'MAPA', placeholder:'Uma palavra'}}); }
 // 10 Cadeado de 4 dígitos: um dígito em cada ponto da sala
 const dg = [0,1,2,3].map(j => 1 + Math.floor(hashTxt('cad'+ci+':'+j+':'+semente())*9));
 const pontos = [['Contar as cadeiras', 'Você conta {n} cadeiras.'],['Olhar o quadro', 'O quadro tem {n} molduras douradas.'],['Ler a placa da porta', 'A placa da porta indica a sala número {n}.'],['Contar os capacetes', 'Há {n} capacetes na prateleira.']];
 pontos.forEach((pt, j) => add('protecoes', {id:'enig'+ci+'-cad'+j, name:pt[0]+' (dígito '+(j+1)+')', time:10+j*20, text:pt[1].replace('{n}', dg[j])+' Esse é o dígito '+(j+1)+' do cadeado.'}));
 { const f = kw(4); add('protecoes', {id:'enig'+ci+'-cadeado', name:'Abrir o cadeado da caixa', time:100, fatos:f.fatos, text:'O cadeado abriu com '+dg.join('')+'. Dentro da caixa há um papel. '+f.texto, enigma:{rotulo:'CADEADO', enunciado:'Um cadeado de 4 dígitos. Os dígitos estão em quatro pontos da sala (dígito 1 ao 4).', cifrado:'[ _ ] [ _ ] [ _ ] [ _ ]', resposta:dg.join(''), placeholder:'4 dígitos'}}); }
 return base;
}
function abrirEnigma(q){
 let d = document.getElementById('enigmaDlg');
 if (!d) { d = document.createElement('dialog'); d.id = 'enigmaDlg'; d.style.cssText = 'width:min(92vw,520px);border:2px solid #9a7842;border-radius:16px;background:#12171d;color:#f3ead6;padding:16px;'; document.body.appendChild(d); }
 d.innerHTML = '<p style="margin:0;color:#e6c36b;font-weight:800;letter-spacing:.08em">'+esc(q.enigma.rotulo)+'</p><h3 style="margin:.2em 0 .4em">'+esc(q.name)+'</h3><p style="margin:.2em 0 .6em">'+esc(q.enigma.enunciado)+'</p>'+
  '<pre style="white-space:pre-wrap;word-break:break-word;margin:0 0 .8em;font:700 20px ui-monospace,Menlo,monospace;background:#0a0e12;padding:10px;border-radius:10px">'+esc(q.enigma.cofre ? '[ '+achadosCofre().map(n => n === null ? '_' : n).join(' ] [ ')+' ]   digital: '+(state.clues.some(x => x.id === q.enigma.digital) ? 'sim' : 'não') : q.enigma.cifrado)+'</pre>'+
  '<input id="enigmaIn" type="text" autocomplete="off" autocapitalize="characters" placeholder="'+esc(q.enigma.placeholder || 'Palavra-chave')+'" style="width:100%;box-sizing:border-box;font:700 18px system-ui;padding:12px;border-radius:10px;border:1px solid #5b6b78;background:#0a0e12;color:#fff">'+
  '<p id="enigmaMsg" style="min-height:1.4em;margin:.5em 0;color:#e6c36b">Se faltar uma dica, feche e procure outras pistas desta sala.</p>'+
  '<div style="display:flex;gap:8px"><button type="button" class="btn primary" id="enigmaOk">Decifrar</button><button type="button" class="btn secondary" id="enigmaNo">Fechar</button></div>';
 const ok = () => { const v = normResp(d.querySelector('#enigmaIn').value);
  if (q.enigma.cofre) { const ach = achadosCofre().filter(n => n !== null).length, dig = state.clues.some(x => x.id === q.enigma.digital);
   if (ach < 6 || !dig) { d.querySelector('#enigmaMsg').textContent = 'Não abre. O cofre pede seis números'+(dig ? '' : ' e a digital de alguém do posto')+'. Eles estão espalhados pelo museu. Você já achou '+ach+' de 6 números.'; return; } }
  if (v && v === normResp(q.enigma.resposta)) { (state.resolvidos ||= {})[q.id] = true; d.close(); collect(q.id); }
  else d.querySelector('#enigmaMsg').textContent = v ? 'Ainda não. Confira a cifra e procure a dica nesta sala.' : 'Digite a sua resposta.'; };
 d.querySelector('#enigmaOk').onclick = ok; d.querySelector('#enigmaNo').onclick = () => d.close();
 d.querySelector('#enigmaIn').onkeydown = e => { if (e.key === 'Enter') ok(); };
 if (!d.open) d.showModal(); setTimeout(() => d.querySelector('#enigmaIn')?.focus(), 50);
}

// ---- pistas que mudam a cada volta (ideias do professor, 23/11/2026): usam `volta` (só naquela volta) e `desde` (da volta em diante) e o que o jogador já fez nas voltas anteriores.
function pistasVoltas(base, c, ci){
 const L = state.loop || 1, salasVistas = [...new Set((state.clues || []).filter(x => x.loop < L).map(x => x.room))], ultima = salasVistas.length ? salasVistas[salasVistas.length - 1] : 'a sala ao lado';
 const naoVistas = ROOMS.filter(r => !salasVistas.includes(sala(r.id).name)), alvo = (naoVistas.length ? naoVistas : ROOMS)[Math.floor(hashTxt('alv'+ci+':'+L+':'+semente())*(naoVistas.length || ROOMS.length))];
 const add = (sl, id, v, nome, time, texto, extra) => (base[sl] ||= []).push({id:'lp'+ci+'-'+id+v, name:nome, time, tipo:'Registro', volta:v, text:texto, ...extra});
 const mais = (sl, id, desde, nome, time, texto, extra) => (base[sl] ||= []).push({id:'lp'+ci+'-'+id, name:nome, time, tipo:'Registro', desde, text:texto, ...extra});
 const eco = ECOS_CASO[Math.floor(hashTxt('lpe'+ci+':'+semente())*ECOS_CASO.length)](c);
 // 1 Etiqueta de exposição que muda (Galeria especial)
 const ETQ = ['A etiqueta da exposição está normal: nome da obra, ano e uma frase sobre o artista.',
  'A etiqueta mudou. Agora diz: "Um visitante curioso vai ler esta etiqueta às 21h56."',
  'A etiqueta diz: "O visitante curioso ainda vai passar por '+ultima+' e voltar aqui com mais perguntas."',
  'A etiqueta diz: "Neste momento, o visitante curioso sente que já leu esta frase antes."',
  'A etiqueta quase não fala mais da obra. Só repete: "Ele já sabe o bastante. Falta usar."'];
 for (let v = 1; v <= 5; v++) add('galeria', 'etq', v, 'Ler a etiqueta da exposição', 20, ETQ[v-1]);
 // 2 Câmera com atraso (Central de monitoramento)
 mais('seguranca', 'cam', 2, 'Olhar a tela da câmera com atraso', 70, 'Uma tela mostra você andando em '+sala(alvo.id).name+', uma sala aonde você ainda não foi. A hora do vídeo é daqui a pouco. Quando você aproxima o rosto, a imagem falha.');
 mais('seguranca', 'cam2', 4, 'Rever a gravação do apagão', 150, 'A câmera mostra uma poltrona vazia onde você estava e, logo depois, a luz caindo. A hora do vídeo é a do próximo apagão.');
 // 3 Diário do guarda e livro de visitantes (a letra é a sua)
 const feitos = (state.clues || []).filter(x => x.loop < L).slice(-3).map(x => x.name+' ('+x.room+')');
 mais('recepcao', 'diario', 2, 'Ler o diário do guarda', 40, feitos.length ? 'As páginas têm uma letra igualzinha à sua: "Volta anterior: '+feitos.join('; ')+'. Não esqueça de olhar o que ninguém olha."' : 'As páginas estão em branco, mas o papel parece ter sido apagado há pouco.');
 mais('recepcao', 'diario2', 3, 'Ler a página que só apareceu agora', 120, 'Uma página nova, com a sua letra, diz: "Se o apagão voltar, não confie só no relógio. Anote o que você viu."');
 for (let v = 1; v <= 5; v++) add('recepcao', 'reg', v, 'Ler o registro de entrada', 60, v < 3 ? 'No livro de visitantes aparece o seu nome com entrada às 22h01. A hora ainda não chegou.' : 'No livro de visitantes o seu nome aparece como "já saiu", mas você ainda está dentro do museu.');
 // 4 Retrato que reage (Sala da fotografia)
 const RET = ['No retrato do fundador, os olhos parecem olhar um pouco para a esquerda.','Os olhos do retrato olham mais para a esquerda. A mão apoiada na mesa mudou de posição.','A mão do retrato agora aponta para baixo, na direção do chão.','A mão do retrato aponta para a porta da sala.','A mão do retrato aponta para longe, para '+sala(c.room).name+'. Ele não olha mais para você.'];
 for (let v = 1; v <= 5; v++) add('fotografia', 'ret', v, 'Observar o retrato', 90, RET[v-1], v === 5 ? {fatos:['where']} : {});
 // 5 Relógio que marca as voltas (Sala dos relógios)
 for (let v = 1; v <= 5; v++) add('relogios', 'volt', v, 'Olhar o relógio da parede', 70, 'O relógio da parede não marca a hora de verdade: ele marca '+v+' volta'+(v > 1 ? 's' : '')+'. Um funcionário passa e diz que o relógio está normal.');
 // 6 Áudio-guia que fala com você (Sala dos sons)
 const AUD = ['', 'A narração muda de repente: "Você já esteve em '+ultima+'. Aqui, olhe com mais calma."', 'A voz do áudio-guia fala só com você: "Você já tentou a porta dos fundos. Não funciona."', 'O áudio-guia sussurra: "Quem se lembra do apagão não está sozinho."', 'O áudio-guia diz baixinho: "Esta é a última. Faça valer."'];
 for (let v = 2; v <= 5; v++) add('sons', 'aud', v, 'Ouvir o áudio-guia desta sala', 100, AUD[v-1]);
 // 7 Objeto que some e reaparece (Sala das coleções)
 const OBJ = ['O relógio de bolso está na vitrine, no lugar de sempre.','A vitrine está vazia. O relógio de bolso sumiu sem barulho.','O relógio de bolso voltou e tem um bilhete dobrado dentro da tampa: '+eco[1],'O relógio de bolso continua no lugar, agora com uma mancha de tinta vermelha na tampa.','O relógio de bolso está na vitrine. A mancha vermelha secou.'];
 for (let v = 1; v <= 5; v++) add('deposito', 'obj', v, 'Olhar a vitrine do relógio de bolso', 130, OBJ[v-1], v === 3 ? {fatos:eco[3], tipo:eco[2]} : {});
 // 8 Mapa antigo com sala que não existe mais (Área de descanso)
 mais('corredor', 'mapa', 1, 'Ler o mapa antigo do museu', 50, 'O mapa antigo mostra uma sala atrás desta parede, a "Sala do Relógio Mestre". Hoje ela não existe.');
 mais('corredor', 'mapa2', 3, 'Abrir o acesso secreto atrás do mapa', 140, 'Com tantas voltas, você nota uma fresta atrás do mapa e abre o acesso secreto. Dentro há um papel: '+eco[1], {fatos:eco[3], tipo:eco[2]});
 return base;
}

// ---- cofre da Recepção (etapa 3, versão para um jogador): seis números espalhados pelo museu + a digital do posto. O progresso fica no caderno, então vale em qualquer volta.
const cofreDig = ci => [0,1,2,3,4,5].map(j => Math.floor(hashTxt('cof'+ci+':'+j+':'+semente())*10));
const COFRE_PONTOS = [
 ['gigantes', 'Ler o número gravado no osso', 'Um número foi gravado a lápis num osso do esqueleto: {n}.', 30],
 ['cera', 'Ler a etiqueta no pé da figura', 'A etiqueta presa ao pé de uma figura de cera tem só um número: {n}.', 60],
 ['fosseis', 'Contar as marcas na rocha', 'Você conta as marcas na rocha, uma por uma: são {n}.', 120],
 ['vidros', 'Ler o número riscado no vidro', 'Alguém riscou um número no canto do vidro com a unha: {n}.', 90],
 ['conservacao', 'Ler o número no frasco', 'O frasco de verniz tem um número escrito na tampa: {n}.', 150],
 ['limpeza', 'Ler o número no carrinho', 'Na barra do carrinho de limpeza há um número pintado de branco: {n}.', 45]
];
function achadosCofre(){ const ci = state.caseIndex, dg = cofreDig(ci); return dg.map((d, i) => (state.clues || []).some(x => x.id === 'cof'+ci+'-n'+i) ? d : null); }
function pistasCofre(base, c, ci){
 const dg = cofreDig(ci);
 COFRE_PONTOS.forEach(([sl, nome, texto, t], i) => (base[sl] ||= []).push({id:'cof'+ci+'-n'+i, name:nome, time:t, tipo:'Registro', text:texto.replace('{n}', dg[i])+' Esse é o número '+(i+1)+' do cofre da Recepção.'}));
 (base.recepcao ||= []).push({id:'cof'+ci+'-cofre', name:'Tentar abrir o cofre', time:0, tipo:'Registro', fatos:['event','where'],
  text:'O cofre abriu. Dentro há um envelope com duas folhas. Primeira: '+c.detail+'. Segunda: a figura imóvel está em '+sala(c.room).name+'.',
  enigma:{rotulo:'COFRE', enunciado:'O cofre da Recepção tem seis números e um leitor de digital.', cifrado:'', resposta:dg.join(''), placeholder:'6 números', cofre:true, digital:'esp'+ci+'-taca3'}});
 return base;
}

// ---- segundo lote de pistas do loop (lista do professor, 23/11/2026). Ajustes: "morte" vira "apagão", "sangue" vira "mancha vermelha de tinta". Cada pista vale na volta indicada (volta) ou da volta em diante (desde).
function pistasLoop2(base, c, ci){
 const L = state.loop || 1, tem = id => (state.clues || []).some(x => x.id === id), dg = cofreDig(ci), restante = Math.max(0, Math.round(300 - (state.duration ? (state.duration - state.remaining) * 300 / state.duration : 0)));
 const salasVistas = [...new Set((state.clues || []).filter(x => x.loop < L).map(x => x.room))], naoVistas = ROOMS.filter(r => !salasVistas.includes(sala(r.id).name)).map(r => sala(r.id).name);
 const eco = ECOS_CASO[Math.floor(hashTxt('l2e'+ci+':'+semente())*ECOS_CASO.length)](c), eco2 = ECOS_CASO[(Math.floor(hashTxt('l2e'+ci+':'+semente())*ECOS_CASO.length)+1) % ECOS_CASO.length](c);
 const U = (sl, id, nome, time, texto, ex) => (base[sl] ||= []).push({id:'l2'+ci+'-'+id, name:nome, time, tipo:'Registro', text:texto, ...ex});
 const V = (sl, id, vs, nome, time, textos, ex) => vs.forEach(v => (base[sl] ||= []).push({id:'l2'+ci+'-'+id+v, name:nome, time, tipo:'Registro', volta:v, text:Array.isArray(textos) ? textos[v-1] : typeof textos === 'string' ? textos : textos(v), ...(typeof ex === 'function' ? ex(v) : ex)}));
 // Placas e etiquetas
 V('auditorio', 'amanha', [1,2,3,4,5], 'Ler a placa com a data de amanhã', 25, v => 'A placa do evento diz "amanhã, dia '+(23+v)+'". Ontem ela dizia dia '+(22+v)+'. Ninguém troca essa placa.');
 U('mar', 'preco', 'Ler a etiqueta de preço do presente', 55, 'A etiqueta do presente de aniversário do diretor tem um valor escrito à mão: "5 minutos".');
 V('galeria', 'naotoque', [1,4], 'Ler a placa de aviso', 30, v => v === 4 ? 'A placa "Não toque" foi trocada. Agora diz: "Toque agora." Embaixo, uma seta aponta para a base da vitrine. '+eco[1] : 'A placa diz: "Não toque."', v => v === 4 ? {fatos:eco[3]} : {});
 V('mobilia', 'saida', [5], 'Ler a placa de saída', 35, 'A placa de saída diz: "Saída bloqueada. Intervenha." Dá para ver a seta apagada embaixo.');
 // Crachás, fichas, registros, cartas
 U('corredor', 'cracha', 'Pegar o crachá no chão', 45, 'No chão há um crachá de funcionário com a sua foto e horário de saída às 22h30. Esse horário ainda não chegou.');
 U('recepcao', 'carta', 'Abrir a carta do correio interno', 80, 'A carta traz o seu nome e a data de ontem. Dentro, uma linha: "Você vai precisar de mais de uma volta." ');
 U('deposito', 'emprest', 'Ler a ficha de empréstimo', 85, 'A ficha de empréstimo tem o seu nome e uma data que ainda não aconteceu.');
 V('recepcao', 'visitante', [1,2,3,4,5], 'Ler o crachá de visitante', 100, v => v < 3 ? 'O crachá de visitante com o seu nome já está carimbado como "saiu". Você ainda está dentro.' : 'O carimbo "saiu" ficou borrado. Agora o crachá mostra a hora de saída em branco.');
 // Câmeras e sensores
 U('seguranca', 'cftv30', 'Ver a câmera 30 segundos antes', 55, 'Na câmera da sala ao lado você aparece parado na porta. O horário do vídeo está 30 segundos adiantado.');
 U('seguranca', 'sensor', 'Ler o sensor de movimento', 65, 'O sensor de movimento marcou alguém na porta da sala antes de você entrar. Foi você, só que mais cedo.');
 U('seguranca', 'cftvsub', 'Ver a câmera do subsolo', 175, 'A câmera do subsolo mostra as luzes caindo e todo o museu se apagando de uma vez. Depois, tudo recomeça como se nada tivesse acontecido.', {desde:3});
 U('seguranca', 'termica', 'Olhar a câmera térmica', 130, 'A câmera térmica mostra um ponto frio e parado. Alguém ficou imóvel por muito tempo em '+sala(c.room).name+'. Ainda está lá.', {fatos:['where']});
 U('seguranca', 'cftvfut', 'Ver a câmera do futuro', 210, 'A câmera mostra você parado perto da saída, com a luz do apagão sobre você. A hora do vídeo é a do próximo apagão.');
 U('seguranca', 'videoloop', 'Ver o vídeo em repetição', 190, 'Um vídeo passa sem parar. Ele mostra o que houve: '+c.detail+'.', {fatos:['event']});
 // Livros, diários e dossiês
 V('atelie', 'diretor', [1,2,3,4,5], 'Ler o diário do diretor', 60, v => v < 3 ? 'Três páginas do diário do diretor foram arrancadas. Sobraram só os cantinhos rasgados.' : 'As páginas arrancadas voltaram ao diário, preenchidas. Uma delas diz: '+eco[1], v => v >= 3 ? {fatos:eco[3]} : {});
 U('conservacao', 'restauro', 'Ler o livro de restauração', 105, 'O livro de restauração tem anotações com a sua letra sobre peças que você ainda não examinou.', {desde:2});
 U('atelie', 'notebook', 'Olhar o notebook da curadoria', 95, 'O notebook da curadoria está com uma aba aberta chamada "Dossiê do visitante". A primeira linha traz o seu nome.');
 U('recepcao', 'nota', 'Ler a nota que apareceu no dossiê', 5, 'Uma nota nova apareceu no seu dossiê depois do primeiro apagão: "Quem anota, lembra."', {desde:2});
 for (let v = 1; v <= 5; v++) U('conservacao', 'dossie'+v, 'Contar as páginas do dossiê físico', 110, 'O dossiê físico tem '+(v + 2)+' páginas. A cada volta completada surge uma nova.', {volta:v});
 U('atelie', 'ssel', 'Ler a nota adesiva do monitor', 120, 'Uma nota adesiva no monitor diz: "Intervir só no último momento."');
 // Objetos, esculturas, retratos, espelho
 U('vidros', 'digital', 'Ver a digital no vidro da vitrine', 70, 'No vidro da vitrine há uma impressão digital nítida. É igual à do seu dedo.');
 V('cera', 'pose', [1,2,3,4,5], 'Observar a escultura', 75, v => 'A escultura de bronze está '+['de braços junto do corpo','com a mão direita levemente levantada','com a mão levantada e a cabeça virada','com a cabeça virada para a porta','apontando para a porta, de braço esticado'][v-1]+'.');
 U('fotografia', 'olhar', 'Olhar o quadro que acompanha', 85, 'Os olhos do quadro seguem você pela sala, devagar, mesmo quando você muda de lado.', {desde:2});
 U('vidros', 'espelho', 'Olhar no espelho', 115, 'No espelho aparece você de ontem, olhando de volta e fazendo um sinal de que ouviu.', {desde:2});
 U('protecoes', 'estatua', 'Ler o bilhete da estátua', 100, 'A estátua segura um bilhete. Só você consegue ler: "Procure o que não combina."');
 V('jogos', 'foto', [1,2,3,4], 'Olhar a foto na parede', 65, v => 'Na foto da parede, ao fundo, há alguém parecido com você. A data da foto é de '+v+' volta'+(v > 1 ? 's' : '')+' no futuro.');
 V('porcelana', 'xicara', [2], 'Olhar a xícara de porcelana', 55, 'A xícara que quebrou na volta anterior está inteira de novo, sem uma única rachadura.');
 V('deposito', 'mancha', [1,2,3,4,5], 'Olhar a mancha vermelha de tinta', 140, v => 'A mancha vermelha de tinta no chão tem do tamanho de '+['uma moeda','uma mão','um prato','uma bacia','um tapete'][v-1]+'.');
 // Relógios e tempo
 U('relogios', 'manequim', 'Olhar o relógio de pulso do manequim', 85, 'O relógio de pulso do manequim marca o tempo que falta: '+Math.floor(restante/60)+' minutos e '+String(restante % 60).padStart(2, '0')+' segundos.');
 U('prototipo', 'digital5', 'Olhar o relógio digital', 90, 'O relógio digital conta de 5:00 até 0:00 e depois volta para 5:00.');
 U('sons', 'alarme', 'Ouvir o alarme antes do reset', 290, 'O alarme soa dez segundos antes do reset, e só dá para ouvir se você ficar quieto.');
 V('relogios', 'sol', [1,2,3,4,5], 'Olhar o relógio de sol do pátio', 100, v => v <= 3 ? 'A sombra do relógio de sol aponta para a direção errada, para uma parede sem porta.' : 'Agora a sombra do relógio de sol aponta direto para '+sala(c.room).name+'.', v => v > 3 ? {fatos:['where']} : {});
 U('relogios', 'chaveiro', 'Pegar o chaveiro', 95, 'O chaveiro tem 5 chaves, cada uma com uma etiqueta: "Volta 1", "Volta 2" e assim por diante. A da volta '+L+' brilha mais.');
 // Pessoas, vozes, passos
 V('limpeza', 'func', [1,2,3,4,5], 'Ouvir o funcionário repetir a frase', 30, v => v < 4 ? 'O funcionário diz a mesma frase de sempre: "Hoje a noite está tranquila."' : 'O funcionário para no meio da frase, olha para você e diz o seu nome, que você nunca disse a ele.');
 V('mar', 'visita', [2], 'Conversar com a visitante', 50, 'Uma visitante só aparece nesta volta, perto do aquário. Ela diz: "Você me viu antes? Eu não existia na volta anterior."');
 V('mobilia', 'passos', [1,2,3,4,5], 'Ouvir os passos atrás de você', 60, v => v < 5 ? 'Você ouve passos atrás de você. Quando se vira, eles param.' : 'Desta vez os passos não param quando você se vira: alguém caminha até você e passa direto.');
 V('gigantes', 'entrega', [1,2,3,4,5], 'Receber o item do funcionário', 45, ['uma lanterna pequena','um pacote de papel pardo','uma chave de latão','um lenço com um nó','um envelope sem nome'].map(x => 'O funcionário entrega a você '+x+' e não explica por quê.'));
 U('auditorio', 'radio', 'Ouvir o rádio de segurança', 115, 'O rádio de segurança transmite uma conversa que só vai acontecer na próxima volta: "'+eco2[1].replace(/^Um (aviso|recado|relato)[^:]*:?\s*/i, '')+'"');
 U('auditorio', 'gravacao', 'Ouvir a gravação da sua voz', 135, 'Uma gravação toca a sua voz dizendo: "O número 1 do cofre é '+dg[0]+'." Você ainda não sabia esse número.', {desde:2});
 // Mapas, portas, chaves, arquivos
 U('corredor', 'mapacalor', 'Ver o mapa de calor do museu', 145, 'O mapa de calor mostra o caminho que você ainda vai fazer: '+(naoVistas.slice(0, 3).join(', ') || 'todas as salas já visitadas')+'.', {desde:2});
 U('eletrica', 'disjuntor', 'Ler o quadro de disjuntores', 125, 'Num dos disjuntores do quadro está escrito "Reset do loop". Está desligado.');
 U('eletrica', 'elevador', 'Ler a mensagem do elevador', 105, 'A tela do elevador mostra "Subsolo, volta 5". O botão do subsolo está apagado.');
 U('eletrica', 'usb', 'Abrir a chave USB', 150, 'A chave USB agora tem arquivos. O primeiro é uma lista curta que termina com: '+eco2[1], {desde:4, fatos:eco2[3]});
 U('eletrica', 'arquivo', 'Abrir o arquivo digital', 155, 'O arquivo digital só abriu depois de três apagões. Dentro, um texto curto: '+eco[1], {desde:4, fatos:eco[3]});
 U('eletrica', 'morse', 'Ler a luz que pisca', 100, 'A luz do corredor pisca em Morse e soletra uma palavra. Quem vê o padrão percebe que é a figura fantasiada de estátua.', {fatos:['figure']});
 U('limpeza', 'bilhete', 'Ler o bilhete do banheiro', 85, 'Um bilhete colado no espelho do banheiro diz: "Na volta 3, não confie no relógio do segurança. Ele atrasa dois minutos."');
 U('asas', 'chave', 'Usar a chave na porta lateral', 120, 'A chave de latão do funcionário só gira se você já viu o apagão. Dentro da sala lateral há um papel: '+eco[1], {desde:2, fatos:eco[3]});
 U('asas', 'portavista', 'Abrir a porta que só abre para quem viu', 130, 'A porta só abre porque você já encontrou as pegadas. Atrás dela há um papel: '+eco2[1], {requer:'esp'+ci+'-infra2', fatos:eco2[3]});
 U('fosseis', 'quadro', 'Olhar o quadro do impostor', 135, 'O quadro de um "impostor" mostra um rosto parecido com o seu. É só um espelho pintado, mas a moldura diz: "Olhe de novo."', {volta:5});
 U('fosseis', 'hipotese', 'Ler o documento borrado', 140, 'O documento tem a hipótese correta, mas as letras estão borradas. Na última volta ele fica legível: a figura imóvel está em '+sala(c.room).name+'. '+c.detail+'.', {volta:5, fatos:['where','event']});
 // Botão vermelho: precisa de 11 pistas no caderno
 U('atelie', 'botao', 'Apertar o botão vermelho do subsolo', 5, 'O botão vermelho do subsolo acendeu, porque o seu caderno já tem pistas suficientes. Uma tela mostra o essencial: '+c.detail+'. A figura imóvel está em '+sala(c.room).name+'.', {minPistas:11, fatos:['event','where']});
 return base;
}
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
 // O outro preso: um NPC diferente em cada volta (campo volta), com uma fala nova e um "de novo não...".
 const GUARDA = ['O guarda boceja e diz: \"Plantão da noite é isso: a noite nunca acaba.\" Ele ri sozinho.','O guarda olha o relógio e resmunga: \"Esse café já esfriou duas vezes hoje.\" Ele parece estranhar a própria frase.','O guarda murmura \"de novo não...\" e esfrega o rosto. Quando vê você, disfarça e pergunta se vai demorar.','O guarda conta uma piada: \"Sabe por que o museu nunca fecha? Porque eu nunca consigo ir embora.\" Ninguém ri, nem ele.','O guarda fala baixinho: \"Você também sente que já passou por aqui? Acho que não sou o único.\" Depois muda de assunto.'];
 const REST = ['A restauradora diz, sem tirar os olhos da peça: \"Eu juro que acabei de limpar isso.\"','A restauradora ri: \"Tenho um déjà vu tão forte que já sei o que você vai perguntar.\" Ela não sabe.','A restauradora murmura \"de novo não...\" e põe os pincéis de volta no mesmo lugar de sempre.','A restauradora faz uma piada: \"Se eu trabalhasse todo dia assim, já tinha terminado esta obra umas dez vezes.\"','A restauradora cochicha: \"Eu anotei o que acontece aqui. Quem mais sabe disso? Vi nos seus olhos.\" Ela fecha o caderno.'];
 for (let v = 1; v <= 5; v++) {
  (base.seguranca ||= []).push({id:'esp'+ci+'-guarda'+v, name:'Ouvir o guarda noturno', time:20, volta:v, tipo:'Relato', text:GUARDA[v-1]});
  (base.conservacao ||= []).push({id:'esp'+ci+'-rest'+v, name:'Ouvir a restauradora', time:20, volta:v, tipo:'Relato', text:REST[v-1]});
 }
 return pistasCentral(pistasLoop2(pistasCofre(pistasVoltas(pistasEnigmas(base, c, ci), c, ci), c, ci), c, ci));
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
 if (state.loop >= 5 || state.caseRules === 2) return;   // no Loop ninguém do museu lembra das voltas
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
