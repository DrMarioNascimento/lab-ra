'use strict';
// Bancada independente: o conteúdo fica no aparelho e não oferece sigilo contra inspeção do código.
const ANDARES = ['2º andar', '1º andar', 'Térreo'];
const ROOMS = [
  {id:'galeria', name:'Galeria especial', andar:'2º andar', icon:'▧', sub:'Obras e vitrines'},
  {id:'auditorio', name:'Auditório', andar:'2º andar', icon:'▱', sub:'Programa e bastidores'},
  {id:'prototipo', name:'Galeria do tempo', andar:'1º andar', icon:'◷', sub:'Protótipo e retorno'},
  {id:'eletrica', name:'Laboratório de formas', andar:'1º andar', icon:'⌁', sub:'Energia e equipamentos'},
  {id:'deposito', name:'Sala das coleções', andar:'1º andar', icon:'▤', sub:'Inventário e movimentações'},
  {id:'patio', name:'Pátio de luz', andar:'1º andar', icon:'☼', sub:'Vista para a circulação'},
  {id:'recepcao', name:'Recepção', andar:'Térreo', icon:'♧', sub:'Chegadas e convidados'},
  {id:'conservacao', name:'Sala dos espécimes', andar:'Térreo', icon:'◇', sub:'Acervo e registros'},
  {id:'seguranca', name:'Sala dos habitats', andar:'Térreo', icon:'◉', sub:'Alarmes e ocorrências'},
  {id:'corredor', name:'Área de descanso', andar:'Térreo', icon:'▥', sub:'Recados e caixas da equipe'},
  {id:'atelie', name:'Ateliê de descobertas', andar:'Térreo', icon:'✧', sub:'Ensaio e registros técnicos'}
];
const EVENTS = {
  proteger:'Uma peça foi retirada para proteção.',
  troca:'Uma obra foi substituída por outra.',
  entrega:'Uma caixa chegou ao destino errado.',
  surpresa:'Uma apresentação surpresa foi interrompida.',
  documento:'Um documento foi retirado da exposição.',
  deslocamento:'Uma escultura foi levada para outro ambiente.',
  retorno:'Uma peça antiga retornou ao museu.',
  falsa:'A aparente falta de uma obra era um erro de registro.'
};
const ALARMS = {
  sensor:'O alarme disparou por uma falha do sensor.',
  manual:'O alarme foi acionado manualmente.',
  teste:'Um teste programado foi iniciado por engano.'
};
const FIGURES = {
  guarda:'Um guarda escondido entre as obras.',
  artista:'Uma artista preparada como estátua viva.',
  visitante:'Um visitante escondido na exposição.',
  restauradora:'Uma restauradora protegendo uma peça.',
  funcionario:'Uma funcionária preparando uma surpresa.'
};
const ACTIONS = {
  avisar:'Avisar a equipe de conservação antes da movimentação.',
  confirmar:'Conferir a identificação do item na entrega ou no transporte.',
  combinar:'Combinar a apresentação com a equipe de segurança.',
  revisar:'Revisar os registros antes de anunciar o desaparecimento.',
  isolar:'Isolar o equipamento que apresenta falha.'
};
// O índice identifica o cenário nas partidas salvas e nas salas cooperativas.
const CASES = [
 {event:'proteger',alarm:'sensor',figure:'guarda',room:'galeria',action:'avisar',subject:'uma pequena escultura de vidro',detail:'a equipe percebeu um risco na base da vitrine e deslocou a peça para evitar danos',clue:'uma base apresentava uma fissura'},
 {event:'troca',alarm:'manual',figure:'artista',room:'recepcao',action:'avisar',subject:'um retrato do acervo',detail:'uma cópia temporária substituiu o retrato durante uma verificação da moldura',clue:'uma ordem de serviço menciona a moldura'},
 {event:'entrega',alarm:'teste',figure:'visitante',room:'corredor',action:'confirmar',subject:'uma caixa identificada como lote 18',detail:'uma etiqueta antiga levou a caixa à sala de conservação, em vez do depósito',clue:'duas etiquetas com destinos diferentes foram encontradas na embalagem'},
 {event:'surpresa',alarm:'sensor',figure:'artista',room:'galeria',action:'combinar',subject:'uma apresentação de estátua viva',detail:'a apresentação prevista para o encerramento foi interrompida pela falha do sensor',clue:'o programa de encerramento indicava uma apresentação surpresa'},
 {event:'documento',alarm:'manual',figure:'funcionario',room:'recepcao',action:'revisar',subject:'uma carta de doação',detail:'a carta foi retirada da vitrine para conferir uma assinatura antes da apresentação',clue:'há um pedido de conferência da assinatura'},
 {event:'deslocamento',alarm:'teste',figure:'restauradora',room:'conservacao',action:'avisar',subject:'uma escultura de bronze',detail:'a escultura foi levada para uma inspeção do suporte antes do fechamento',clue:'a ficha da peça registra uma inspeção de suporte'},
 {event:'retorno',alarm:'sensor',figure:'visitante',room:'corredor',action:'confirmar',subject:'um pequeno relógio histórico',detail:'a peça retornou ao museu para uma exposição após um empréstimo',clue:'o comprovante de transporte aponta o fim de um empréstimo'},
 {event:'falsa',alarm:'manual',figure:'guarda',room:'seguranca',action:'revisar',subject:'um medalhão catalogado',detail:'o medalhão estava no local correto, mas seu número de inventário havia sido digitado incorretamente',clue:'os dois registros apresentam números de inventário diferentes'},
 {event:'proteger',alarm:'teste',figure:'restauradora',room:'conservacao',action:'avisar',subject:'um painel de papel antigo',detail:'o painel foi levado a um armário protegido após a equipe perceber umidade',clue:'um registro aponta aumento de umidade perto do painel'},
 {event:'troca',alarm:'sensor',figure:'funcionario',room:'galeria',action:'avisar',subject:'uma fotografia emoldurada',detail:'a fotografia foi substituída temporariamente por outra versão durante a montagem',clue:'o roteiro de montagem descreve duas versões da fotografia'},
 {event:'entrega',alarm:'manual',figure:'guarda',room:'corredor',action:'confirmar',subject:'uma caixa de ferramentas de restauração',detail:'a caixa foi entregue na recepção porque a etiqueta do setor se soltou',clue:'a embalagem estava sem a etiqueta do setor'},
 {event:'surpresa',alarm:'teste',figure:'funcionario',room:'recepcao',action:'combinar',subject:'uma homenagem ao antigo curador',detail:'a homenagem preparada em segredo foi interrompida quando o teste de alarme começou',clue:'um convite reservado menciona uma homenagem no encerramento'},
 {event:'documento',alarm:'sensor',figure:'visitante',room:'galeria',action:'revisar',subject:'um mapa antigo',detail:'o mapa foi retirado para registrar seu verso, que continha uma anotação',clue:'o pedido de fotografia menciona o verso do mapa'},
 {event:'deslocamento',alarm:'manual',figure:'artista',room:'corredor',action:'avisar',subject:'um pedestal com uma réplica',detail:'a réplica foi deslocada para preparar o espaço da apresentação',clue:'o plano da apresentação indica a mudança de posição do pedestal'},
 {event:'retorno',alarm:'teste',figure:'restauradora',room:'conservacao',action:'confirmar',subject:'um vaso restaurado',detail:'o vaso voltou da oficina de restauração e aguardava conferência antes de ser exposto',clue:'a ficha registra a conclusão da restauração'}
];
const labels={
  sensor:['Registro do sensor','O painel registrou uma falha no sensor antes do alarme; não há registro de acionamento manual.'],
  manual:['Registro de acionamento','O sistema registra um acionamento manual. Esse registro, sozinho, não informa a intenção de quem acionou.'],
  teste:['Calendário de manutenção','O painel registra que um teste programado foi iniciado. Um teste não prova, por si só, um incêndio.']
};
const figures={
  guarda:'O uniforme e o rádio indicam que a figura escondida é um guarda; ele diz ter se escondido com medo.',
  artista:'Uma credencial e o programa do evento indicam que a figura é uma artista preparada como estátua viva.',
  visitante:'Um ingresso e um relato identificam a figura como um visitante que entrou onde não deveria.',
  restauradora:'Uma identificação e uma ficha de trabalho indicam que a figura é uma restauradora.',
  funcionario:'Uma credencial de serviço identifica a figura como uma funcionária que preparava uma surpresa.'
};
const roomDescriptions={galeria:'Vitrines, pedestais e obras aguardam o fechamento. Algo chama sua atenção entre os registros da exposição.',conservacao:'Fichas de acervo e materiais de trabalho contam uma parte da história dos objetos.',seguranca:'Um painel registra as ocorrências do edifício. O alarme é apenas um dos sinais daquela noite.',eletrica:'A luz de emergência revela equipamentos e anotações técnicas. Nem toda falha tem a mesma causa.',recepcao:'Convidados, entregas e registros de entrada se cruzam perto da saída.',corredor:'Pelo corredor passam pessoas e caixas. Olhar a passagem não revela, sozinho, toda a intenção.'};
const $=id=>document.getElementById(id);
const storageKey='cinco-minutos-ensaio-v1', historyKey='cinco-minutos-ciclo-v1';
let state=null,timerHandle=null,toastHandle=null;
function load(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function save(){try{localStorage.setItem(window.coop?.storageKey ?? storageKey,JSON.stringify(state))}catch{}}
function chooseCase(){let hist=load(historyKey,[]);if(!Array.isArray(hist))hist=[];let options=CASES.map((_,i)=>i).filter(i=>!hist.includes(i));if(!options.length){hist=[];options=CASES.map((_,i)=>i)}const i=options[Math.floor(Math.random()*options.length)];hist.push(i);try{localStorage.setItem(historyKey,JSON.stringify(hist))}catch{}return i}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const extraDescriptions = {
  prototipo: 'O protótipo da exposição fica ligado ao relógio de demonstração.',
  deposito: 'Etiquetas e fichas de movimentação documentam o trajeto de cada peça.',
  auditorio: 'Na coxia, a equipe prepara o encerramento da noite.',
  patio: 'O pátio oferece vista para a circulação entre as galerias.',
  atelie: 'A equipe deixou aqui a bancada de ensaio e um manual de demonstração.'
};
Object.assign(roomDescriptions, extraDescriptions);

function makeClues(c){
 const evidence=labels[c.alarm][1],fig=figures[c.figure],room=ROOMS.find(r=>r.id===c.room).name;
 return {
  galeria:[
   {id:'gal1',name:'Observar a montagem',time:0,text:'A ficha da exposição menciona '+c.subject+'. '+c.clue.charAt(0).toUpperCase()+c.clue.slice(1)+'.'},
   {id:'gal2',name:'Examinar o registro de acervo',time:90,text:'Um registro da galeria informa: '+c.detail+'.'},
   {id:'gal3',name:'Procurar sinais da figura',time:180,text:c.room==='galeria'?fig:'Um registro de ronda indica uma figura imóvel em '+room+'.'}],
  conservacao:[
   {id:'con1',name:'Ler a ficha de conservação',time:0,text:'A ficha referente a '+c.subject+' anota que '+c.detail+'.'},
   {id:'con2',name:'Examinar a observação técnica',time:90,text:'Na pasta consta: '+c.clue+'.'},
   {id:'con3',name:'Consultar o plano de prevenção',time:180,text:'Uma nota recomenda: '+ACTIONS[c.action]},
   ...(c.room==='conservacao'?[{id:'con4',name:'Conversar com a figura imóvel',time:180,text:fig}]:[])],
  seguranca:[
   {id:'seg1',name:'Ler o registro do alarme',time:165,text:evidence},
   {id:'seg2',name:'Consultar a ocorrência',time:195,text:ALARMS[c.alarm]+' O registro não permite concluir sozinho o que ocorreu com o acervo.'},
   {id:'seg3',name:'Verificar a ronda',time:180,text:c.room==='seguranca'?fig:'A ronda menciona uma figura imóvel em '+room+'.'}],
  eletrica:[
   {id:'ele1',name:'Examinar o painel',time:165,text:evidence},
   {id:'ele2',name:'Ler a anotação técnica',time:90,text:'Há uma anotação: '+c.clue+'. Ela deve ser relacionada a outros registros.'},
   {id:'ele3',name:'Analisar o protótipo',time:180,text:'O registrador do Laboratório de formas aponta um pulso do protótipo às 21h57, antes do alarme. O manual prevê outro pulso às 22h. O comando de suspensão fica na Galeria do tempo.'}],
  recepcao:[
   {id:'rec1',name:'Consultar a movimentação',time:0,text:'A recepção recebeu uma anotação sobre '+c.subject+'. '+c.clue.charAt(0).toUpperCase()+c.clue.slice(1)+'.'},
   {id:'rec2',name:'Examinar o livro de ocorrências',time:90,text:'Na ocorrência consta: '+c.detail+'.'},
   {id:'rec3',name:'Observar a figura',time:180,text:c.room==='recepcao'?fig:'Uma pessoa da recepção comenta que havia uma figura imóvel em '+room+'.'}],
  corredor:[
   {id:'cor1',name:'Examinar o registro de passagem',time:0,text:'No registro de passagem: '+c.detail+'.'},
   {id:'cor2',name:'Ler o recado da equipe',time:90,text:'O recado sugere uma ação: '+ACTIONS[c.action]},
   {id:'cor3',name:'Verificar a figura imóvel',time:180,text:c.room==='corredor'?fig:'Um recado indica que alguém viu uma figura imóvel em '+room+'.'}],
  prototipo:[
   {id:'pro1',name:'Ler a placa da demonstração',time:0,text:'A demonstração guarda o instante de referência, às 21h55. Ao terminar, o protótipo deveria apenas projetar uma imagem desse instante.'},
   {id:'pro2',name:'Observar o primeiro pulso',time:120,text:'Às 21h57, o relógio do protótipo recua por um segundo. O estrondo vem da Galeria especial e a luz cai. O alarme soa mais tarde.'},
   {id:'pro3',name:'Conferir o comando de suspensão',time:180,text:'O manual indica que suspender a demonstração antes das 22h interrompe o pulso de retorno. O comando não altera o que já aconteceu nas outras salas.'}],
  deposito:[
   {id:'dep1',name:'Consultar o inventário',time:0,text:'A ficha de movimentação menciona '+c.subject+'.'},
   {id:'dep2',name:'Conferir a ficha de transferência',time:90,text:'Uma anotação de transferência registra que '+c.detail+'.'}],
  auditorio:[
   {id:'aud1',name:'Ler o aviso da produção',time:0,text:'A produção pede que as equipes de montagem e segurança confirmem separadamente suas tarefas de encerramento.'},
   {id:'aud2',name:'Consultar a mensagem da produção',time:90,text:'Uma mensagem sobre '+c.subject+' foi arquivada na pasta de encerramento: '+c.clue+'.'}],
  patio:[
   {id:'pat1',name:'Comparar a iluminação das alas',time:120,text:'O apagão atinge as galerias às 21h57. O aviso sonoro ainda não começou.'},
   {id:'pat2',name:'Ouvir a equipe da ronda',time:180,text:'Da circulação, a equipe localizou a figura imóvel em '+room+'.'}],
  atelie:[
   {id:'ate1',name:'Ler o caderno de ensaio',time:0,text:'O ensaio diferencia o pulso que fixa a referência do pulso que fecha a demonstração. O retorno acontece no segundo pulso.'},
   {id:'ate2',name:'Ler a instrução de encerramento',time:180,text:'Em caso de repetição, use Suspender demonstração na Galeria do tempo antes do pulso final, às 22h.'}]
 }
}
const TIME_PATHS = {
 suspension: {
  room:'prototipo', source:'atelie', opens:120, closes:300,
  control:'Painel da demonstração', action:'Suspender demonstração',
  alternative:'Silenciar o aviso da demonstração',
  observation:'O relógio da demonstração perde um segundo no primeiro pulso. O visor ainda indica uma segunda emissão programada.',
  instruction:'A emissão final depende do modo Demonstração. Após o primeiro pulso, use Suspender demonstração na Galeria do tempo antes das 22h.',
  distractor:'O aviso foi silenciado. O visor ainda mostra a emissão final programada.',
  reconstruction:'Na Galeria do tempo, a demonstração guardou uma referência às 21h55. O pulso das 21h57 derrubou a iluminação. A emissão programada para as 22h reconectava o museu à referência.',
  success:'Você suspendeu a demonstração na Galeria do tempo. Sem a emissão final, o relógio avançou depois das 22h.'
 },
 reserve: {
  room:'eletrica', source:'seguranca', opens:120, closes:240,
  control:'Painel da alimentação de ensaio', action:'Desacoplar a reserva do protótipo',
  alternative:'Rearmar a iluminação principal',
  observation:'Depois do apagão, o protótipo transfere a alimentação para a reserva. Às 21h59, o painel trava essa alimentação até o fechamento.',
  instruction:'Depois da transferência às 21h57, o Laboratório de formas permite desacoplar a reserva do protótipo antes do travamento das 21h59.',
  distractor:'O painel tentou rearmar as luzes. A reserva do protótipo continuou acoplada.',
  reconstruction:'Às 21h57, o pulso derrubou as luzes e transferiu o protótipo para a reserva. Às 21h59, o painel travava a reserva. Essa alimentação sustentava o retorno das 22h.',
  success:'Você desacoplou a reserva antes do travamento. O protótipo ficou sem alimentação no fechamento e o tempo seguiu.'
 },
 rehearsal: {
  room:'auditorio', source:'recepcao', opens:90, closes:210,
  control:'Mesa de produção', action:'Cancelar o sinal de encerramento',
  alternative:'Silenciar os alto-falantes',
  observation:'A produção agendou um sinal silencioso, independente do áudio. Às 21h58min30s, o comando sai da mesa e fica na fila do protótipo.',
  instruction:'Entre a abertura da mesa às 21h56min30s e o envio automático às 21h58min30s, cancele o sinal de encerramento no Auditório.',
  distractor:'Os alto-falantes ficaram mudos. O sinal silencioso continuou agendado.',
  reconstruction:'O pulso inicial causou o apagão, mas dependia de um disparo externo para repetir a noite. O sinal da produção entrou na fila às 21h58min30s e ordenou o retorno às 22h.',
  success:'Você cancelou o sinal na mesa de produção. Nenhuma ordem de retorno chegou ao protótipo.'
 },
 reference: {
  room:'atelie', source:'deposito', opens:60, closes:180,
  control:'Leitor da referência de ensaio', action:'Retirar o cartão do leitor',
  alternative:'Fechar o caderno de ensaio',
  observation:'O leitor abriu às 21h56. Às 21h58, ele envia ao protótipo a referência gravada no cartão que estiver encaixado.',
  instruction:'Retire o cartão do leitor no Ateliê entre 21h56 e 21h58. Depois do envio, retirar o cartão não apaga a referência recebida.',
  distractor:'O caderno foi fechado. O leitor ainda pôde enviar a referência.',
  reconstruction:'O cartão do Ateliê guardava o instante das 21h55. O pulso inicial causava o apagão, mas só após receber o cartão às 21h58 o protótipo conseguia reconstruir a cena às 22h.',
  success:'Você retirou o cartão antes do envio. Sem a referência temporal, o pulso das 22h não refez a noite.'
 }
};
const CASE_PATHS = [
 'reserve','suspension','reference','rehearsal','reference',
 'reserve','reference','suspension','reserve','rehearsal',
 'reference','rehearsal','suspension','rehearsal','reserve'
];
const LEGACY_PATH = {...TIME_PATHS.suspension, opens:0};
const timePath = () => state.caseRules === 2
 ? TIME_PATHS[CASE_PATHS[state.caseIndex]]
 : LEGACY_PATH;

function scenarioClues(){
 const clues = makeClues(current());
 if (state.caseRules !== 2 || window.coop) return clues;

 const path = timePath();
 // A primeira emissão é comum. As fontes da segunda dependem da partida.
 clues.eletrica.pop();
 clues.prototipo.pop();
 clues.atelie = [];
 clues.prototipo[0].text = 'O protótipo produz uma imagem temporal a partir de uma referência. O fechamento da demonstração depende de um comando que pode vir de outro setor.';
 clues.prototipo[1].text = 'Às 21h57, um pulso faz o relógio recuar um segundo. O estrondo vem da Galeria especial e a luz cai. O alarme soa mais tarde.';
 clues.atelie.push({id:'atebase',name:'Ler a anotação de ensaio',time:0,text:'As duas emissões têm funções diferentes. O pulso inicial pode ocorrer mesmo quando a ordem de fechamento ainda não está pronta.'});
 clues[path.room].push({id:'time-control',name:'Observar o mecanismo',time:path.opens,text:path.observation});
 clues[path.source].push({id:'time-source',name:'Consultar o procedimento de encerramento',time:60,text:path.instruction});
 return clues;
}

function elapsedStoryTime(now){
 const duration = state.duration;
 return (duration - (state.endAt-now)/1000)*300/duration;
}

function clockAt(seconds){
 const minute = 55+Math.floor(seconds/60);
 return (minute<60?'21h':'22h')+String(minute%60).padStart(2,'0')+
  (seconds%60 ? 'min'+String(seconds%60).padStart(2,'0')+'s' : '');
}

function show(id){$('coopShortcut').classList.toggle('hidden',id==='start'||!!window.coop);['start','game','between','final','result'].forEach(x=>$(x).classList.toggle('hidden',x!==id));window.scrollTo({top:0,behavior:'instant'})}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastHandle);toastHandle=setTimeout(()=>$('toast').classList.remove('show'),2200)}
function popup(id){if(!$(id).open)$(id).showModal()}
function fmt(s){s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function museumTime(){
 const elapsed = Math.max(0, Math.min(300, Math.floor((state.duration-state.remaining)*300/state.duration)));
 const minutes = 55+Math.floor(elapsed/60);
 return (minutes<60?'21:':'22:')+String(minutes%60).padStart(2,'0')+':'+String(elapsed%60).padStart(2,'0');
}
function current(){return CASES[state.caseIndex]}
function reset(){clearInterval(timerHandle);state={caseIndex:chooseCase(),loop:1,phase:'choose',room:null,duration:Number($('speed').value),remaining:Number($('speed').value),endAt:null,clues:[],hints:0,notes:'',answers:null,liveFinal:true,caseRules:2,archive:[]};save();renderGame();show('game')}
function enterRoom(id){if(window.coop){window.coop.choose(id);return}if(state.phase!=='choose')return;state.room=id;state.phase='playing';state.remaining=state.duration;state.endAt=Date.now()+state.remaining*1000;save();renderGame();tick();timerHandle=setInterval(tick,250)}
function renderGame(){
 const finalLoop = hasLiveFinal() && state.loop === 5;
 $('loopBrief').classList.toggle('hidden', !finalLoop);
 $('fictionTime').textContent = museumTime();
 $('museumSignal').textContent = '';
 $('loopLabel').textContent='LOOP '+state.loop+' DE 5';$('timer').textContent=fmt(state.remaining);
 $('clockStatus').textContent=state.phase==='playing'?'tempo em andamento':'aguardando escolha';
 $('phaseTitle').textContent=state.room?ROOMS.find(r=>r.id===state.room).name:'Escolha onde investigar';
 $('phaseDescription').textContent=state.phase==='playing'?'Observe o ambiente enquanto o tempo passa.':'Cada escolha revela uma perspectiva diferente da mesma noite.';
 $('boardTitle').textContent=state.phase==='playing'?'Ambiente escolhido':'Escolha um ambiente';
 $('roomGrid').innerHTML=ANDARES.map(a=>'<h4 class="andar">'+a+'</h4>'+ROOMS.filter(r=>r.andar===a).map(r=>'<button class="room '+(state.room===r.id?'selected':'')+'" '+(state.phase==='playing'&&state.room?'disabled':'')+' data-room="'+r.id+'"><span class="room-icon" aria-hidden="true">'+r.icon+'</span><strong>'+r.name+'</strong><small>'+r.sub+'</small></button>').join('')).join('');
 document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>enterRoom(b.dataset.room)));
 $('endLoop').classList.toggle('hidden', state.phase!=='playing' || ((finalLoop || state.caseRules === 2) && state.duration===300));
 $('statusText').textContent=state.phase==='playing'?'Você permanece neste ambiente até o retorno.':'Você poderá visitar um ambiente em cada loop.';
 $('roomPanel').classList.toggle('hidden',state.phase!=='playing');
 if(state.phase==='playing'&&state.room)renderClues();
 if(window.coop)window.coop.decorate();
 $('notes').value=state.notes||'';renderJournal();
}
function renderClues(){
 const room = ROOMS.find(item => item.id === state.room);
 const panel = $('roomPanel');
 const clues = scenarioClues()[room.id];
 const scene = [state.caseIndex, state.caseRules, !!window.coop, room.id].join(':');
 if (panel.dataset.scene !== scene) {
  panel.dataset.scene = scene;
  panel.innerHTML = '<h3>'+room.name+'</h3><p>'+roomDescriptions[room.id]+'</p><div class="clue-list">'+
   clues.map(clue => '<button type="button" class="clue" data-clue="'+clue.id+'"><span>'+esc(clue.name)+'</span><small></small></button>').join('')+
   '</div><div id="intervention" hidden></div>';
  panel.querySelectorAll('[data-clue]').forEach(button => {
   button.onclick = () => collect(button.dataset.clue);
  });
 }
 const elapsed = state.duration-state.remaining;
 const storySeconds = elapsed*300/state.duration;
 $('fictionTime').textContent = museumTime();
 const signal = $('museumSignal');
 const signalText = storySeconds >= 165 ? 'O alarme soa pelo museu.'
  : storySeconds >= 120 ? 'Um estrondo ecoa. A iluminação principal se apaga.' : '';
 if (signal.textContent !== signalText) signal.textContent = signalText;
 clues.forEach(clue => {
  const button = panel.querySelector('[data-clue="'+clue.id+'"]');
  const registered = state.clues.some(item => item.id === clue.id);
  const wait = clue.time/300*state.duration-elapsed;
  const label = registered?'Registrada':wait>0?'Disponível em '+fmt(wait):'Examinar';
  button.disabled = registered || wait > 0;
  if (button.lastElementChild.textContent !== label) button.lastElementChild.textContent = label;
 });
 renderIntervention(room.id, storySeconds);
}
function hasLiveFinal(){
 return !window.coop && state.liveFinal === true;
}
function renderIntervention(roomId, elapsed){
 const panel = $('intervention');
 const path = timePath();
 panel.hidden = !hasLiveFinal() || state.loop !== 5 || roomId !== path.room;
 if (panel.hidden) return;
 if (!panel.hasChildNodes()) {
  const commands = state.caseRules === 2
   ? '<label for="command">Comando</label><select id="command"><option value="">Escolha um comando</option>'+
     (path.room === 'prototipo' || path.room === 'atelie'
      ? '<option value="other">'+esc(path.alternative)+'</option><option value="break">'+esc(path.action)+'</option>'
      : '<option value="break">'+esc(path.action)+'</option><option value="other">'+esc(path.alternative)+'</option>')+
     '</select><button class="btn primary" type="button">Executar comando</button>'
   : '<button class="btn primary" type="button">'+esc(path.action)+'</button>';
  panel.innerHTML = '<h4>'+esc(path.control)+'</h4>'+commands+'<p role="status"></p>';
  const button = panel.querySelector('button');
  button.onclick = () => applyIntervention(panel.querySelector('select')?.value ?? 'break');
  panel.querySelector('select')?.addEventListener('change', () => renderIntervention(state.room, elapsedStoryTime(Date.now())));
 }
 const button = panel.querySelector('button');
 const select = panel.querySelector('select');
 const recorded = !!state.intervention;
 const eligible = elapsed >= path.opens && elapsed < path.closes;
 button.disabled = recorded || !eligible || (select ? !select.value : false);
 if (select) select.disabled = recorded || !eligible;
 const status = panel.lastElementChild;
 const message = state.intervention === 'other' ? path.distractor
  : recorded ? 'Comando registrado. O relógio seguirá adiante às 22h.'
  : elapsed < path.opens ? 'O comando estará disponível às '+clockAt(path.opens)+'.'
  : elapsed >= path.closes ? 'A janela de intervenção terminou às '+clockAt(path.closes)+'.'
  : 'Você pode executar um comando até '+clockAt(path.closes)+'.';
 if (status.textContent !== message) status.textContent = message;
}
function applyIntervention(command){
 const path = timePath();
 const elapsed = elapsedStoryTime(Date.now());
 if (!hasLiveFinal() || state.loop !== 5 || state.phase !== 'playing' ||
     state.room !== path.room || state.intervention || !['break','other'].includes(command) ||
     elapsed < path.opens || elapsed >= path.closes) return;
 state.intervention = command;
 save();
 renderIntervention(state.room, elapsed);
}
function brokeLoop(){
 return state.intervention === 'break' || state.intervention === 'suspender';
}
function collect(id){if(state.phase!=='playing'||(window.coop?.now() ?? Date.now())>=state.endAt){tick();return}const q=scenarioClues()[state.room].find(x=>x.id===id);if(!q||state.clues.some(x=>x.id===id)||state.duration-(state.endAt-(window.coop?.now() ?? Date.now()))/1000<q.time/300*state.duration)return;const room=ROOMS.find(x=>x.id===state.room);state.clues.push({id:q.id,room:room.name,name:q.name,text:q.text,loop:state.loop});save();renderClues();renderJournal();toast('Pista guardada no caderno')}
function renderJournal(){
 const clues=state.clues||[];$('countBadge').textContent=clues.length;
 $('journalPreview').innerHTML=clues.length?clues.slice(-3).reverse().map(c=>'<div class="preview-item">'+esc(c.name)+' <br><small>'+esc(c.room)+'</small></div>').join(''):'<p class="muted">Suas descobertas aparecerão aqui.</p>';
 $('journalList').innerHTML=clues.length?clues.map(c=>'<article class="journal-item"><b>'+esc(c.room)+' · Loop '+c.loop+'</b><p><strong>'+esc(c.name)+':</strong> '+esc(c.text)+'</p></article>').join(''):'<p class="muted">Você ainda não registrou pistas.</p>';
 if (!window.coop && state.archive?.length) {
  $('journalList').insertAdjacentHTML('beforeend', state.archive.map(key => {
   const axis = ANSWER_AXES.find(item=>item.key===key);
   return '<article class="journal-item"><b>Arquivo de fechamento · '+esc(axis.title)+
    '</b><p>'+esc(partialRecord(key))+'</p></article>';
  }).join(''));
 }
 const path = timePath();
 const figureRoom = ROOMS.find(room => room.id === current().room).name;
 const roomName = id => ROOMS.find(room => room.id === id).name;
 const nearingIntervention = hasLiveFinal() && (state.loop === 5 || (state.loop === 4 && state.phase === 'between'));
 const timeLead = nearingIntervention
  ? 'Compare os comandos no ambiente '+roomName(path.room)+'. Um atua sobre o retorno e o outro altera apenas um efeito secundário.'
  : 'Há um procedimento de encerramento em '+roomName(path.source)+'.';
 const hs = [
  'Separe o que aconteceu com o acervo, o disparo do alarme e o retorno do tempo. Procure uma fonte para cada fato.',
  'A Sala das coleções ou a Conservação ajuda a explicar o acervo. A Segurança e a Sala técnica ajudam a explicar o alarme.',
  'Procure a figura imóvel em '+figureRoom+'. '+timeLead
 ];
 $('hints').innerHTML=hs.slice(0,state.hints).map((x,i)=>'<p><strong>Orientação '+(i+1)+':</strong> '+esc(x)+'</p>').join('');$('getHint').disabled=state.hints>=3;
}
function tick(){if(window.coop){window.coop.tick();return}if(!state||state.phase!=='playing')return;const old=state.remaining;state.remaining=Math.max(0,(state.endAt-Date.now())/1000);$('timer').textContent=fmt(state.remaining);$('fictionTime').textContent=museumTime();if(Math.ceil(old)!==Math.ceil(state.remaining))renderClues();else if(state.loop===5 && state.room)renderIntervention(state.room,elapsedStoryTime(Date.now()));if(state.remaining<=0)finishLoop()}
function renderBetween(){
 const finished = state.loop === 5;
 const interventionNext = hasLiveFinal() && state.loop === 4;
 $('betweenEyebrow').innerHTML = '<span></span> '+(finished && brokeLoop() ? 'O TEMPO SEGUIU' : 'O TEMPO RETORNOU');
 $('betweenCount').textContent = state.clues.length;
 $('betweenLoop').textContent = state.loop+' / 5';
 $('betweenTitle').textContent = finished
  ? (brokeLoop() ? 'O relógio passou das 22h.' : 'O museu retornou às 21h55.')
  : 'Você se lembra.';
 $('betweenStory').textContent = finished
  ? (brokeLoop() ? 'A cadeia do retorno foi interrompida. O museu permanece no presente.' : 'O museu voltou às 21h55. Use o que você descobriu para reconstruir a noite.')
  : 'As portas voltaram a fechar. Os objetos estão onde estavam. Você conserva o que descobriu.';
 $('betweenHint').textContent = finished ? (state.caseRules === 2 && state.clues.length < 3 ? 'Com poucas pistas? Ao apresentar a hipótese, você pode consultar trechos do arquivo de fechamento.' : 'Seu caderno está disponível para a conclusão.')
  : interventionNext ? 'A próxima volta é sua oportunidade de intervir. Se faltou uma pista sobre o retorno, peça uma orientação no caderno antes de escolher o ambiente.'
  : 'O próximo ambiente pode confirmar ou mudar sua hipótese.';
 $('nextLoop').textContent = finished ? 'Apresentar hipótese' : 'Escolher próximo ambiente';
 show('between');
}
function finishLoop(){
 if(window.coop){window.coop.move('between');return}
 if(!state||state.phase!=='playing')return;
 if (state.caseRules === 2 && state.duration === 300 && Date.now() < state.endAt) return;
 clearInterval(timerHandle);
 state.phase='between';
 state.remaining=0;
 state.endAt=null;
 save();
 renderBetween();
}
function next(){
 if(window.coop){window.coop.move(state.loop>=5?'final':'choose');return}
 if(state.loop>=5){state.phase='final';save();renderForm();show('final');return}
 state.loop++;
 state.phase='choose';
 state.room=null;
 state.remaining=state.duration;
 save();
 renderGame();
 show('game');
}
function options(obj){return '<option value="">Ainda não sei</option>'+Object.entries(obj).map(([k,v])=>'<option value="'+k+'">'+esc(v)+'</option>').join('')}
const ANSWER_AXES = [
 {key:'event', title:'Acontecimento', question:'O que aconteceu com o acervo ou a exposição?', options:EVENTS,
  sources:['gal2','con1','rec2','cor1','dep2'],
  guide:'Compare o que a equipe esperava encontrar com os registros de movimentação.'},
 {key:'alarm', title:'Alarme', question:'O que disparou o alarme?', options:ALARMS,
  sources:['seg1','seg2','ele1'],
  guide:'Separe o estrondo do disparo do alarme. Compare os horários e o tipo de registro.'},
 {key:'figure', title:'Figura imóvel', question:'Quem era a figura imóvel observada?', options:FIGURES,
  sources:['gal3','con4','seg3','rec3','cor3'],
  guide:'Procure uma credencial ou outro sinal de identidade. Estar no local não prova responsabilidade.'},
 {key:'action', title:'Prevenção no museu', question:'Qual procedimento ajudaria a equipe a lidar com o acontecimento?', options:ACTIONS,
  sources:['con3','cor2'],
  guide:'Pense em uma ação anterior ao problema. Qual registro ou acordo estava faltando?'}
];
const ARCHIVE_LIMIT = 2;
function partialRecord(key){
 const c = current();
 switch (key) {
  case 'event': return 'O índice do acervo menciona '+c.subject+'. No verso, lê-se que '+c.clue+'. A ficha de desfecho está incompleta.';
  case 'alarm': return 'O aviso sonoro começou às 21h57min45s, depois do apagão. ' + ({
   sensor:'O fragmento recuperado veio do histórico de equipamentos.',
   manual:'O fragmento recuperado veio do registro de operações da equipe.',
   teste:'O fragmento recuperado veio da agenda de manutenção.'
  }[c.alarm]) + ' O campo de causa está ilegível.';
  case 'figure': return 'A ronda localiza a figura imóvel em '+ROOMS.find(room=>room.id===c.room).name+'. O campo de identificação está em branco.';
  case 'action': return 'A ficha de prevenção faz referência a '+c.subject+'. Há uma anotação de que '+c.clue+'. A folha de recomendações não foi localizada.';
 }
}
function renderArchive(){
 const panel = $('archivePanel');
 panel.classList.toggle('hidden', state.caseRules !== 2 || !!window.coop);
 if (state.caseRules !== 2 || window.coop) return;

 const recovered = state.archive ?? [];
 const hasSource = axis => state.clues.some(clue => axis.sources.includes(clue.id) &&
  (axis.key !== 'figure' || clue.text === figures[current().figure]));
 const remaining = ARCHIVE_LIMIT-recovered.length;
 const status = $('archiveStatus');
 const message = remaining === 0 ? 'Dois trechos consultados.' :
  remaining === 1 ? 'Você ainda pode consultar um trecho.' : 'Você pode consultar até dois trechos.';
 if (status.textContent !== message) status.textContent = message;
 $('archiveSections').innerHTML = ANSWER_AXES.map(axis => {
  const ready = recovered.includes(axis.key);
  const covered = hasSource(axis);
  const body = ready ? '<p>'+esc(partialRecord(axis.key))+'</p>' :
   covered ? '<p>Você já tem um registro sobre este ponto no caderno.</p>' :
   '<button class="text-button" type="button" data-archive="'+axis.key+'" '+(remaining ? '' : 'disabled')+
   ' aria-label="Consultar trecho sobre '+esc(axis.title.toLowerCase())+'">Consultar trecho</button>';
  return '<section class="archive-item"><h4>'+esc(axis.title)+'</h4><p>'+esc(axis.guide)+'</p>'+body+'</section>';
 }).join('');
}
function readArchive(event){
 const key = event.target.dataset.archive;
 const recovered = state.archive ?? [];
 if (window.coop || state.caseRules !== 2 || state.phase !== 'final' ||
  !ANSWER_AXES.some(axis=>axis.key===key) || recovered.length >= ARCHIVE_LIMIT || recovered.includes(key)) return;
 state.archive = [...recovered, key];
 save();
 renderArchive();
 const section = $('archiveSections').children[ANSWER_AXES.findIndex(axis=>axis.key===key)];
 section.tabIndex = -1;
 section.focus();
}
function selectedAnswers(){
 return Object.fromEntries(ANSWER_AXES.map(axis=>[axis.key, $(axis.key).value]));
}
function renderForm(){
 $('answerFields').innerHTML = ANSWER_AXES.map(axis => '<div><label for="'+axis.key+'">'+esc(axis.question)+
  '</label><select id="'+axis.key+'">'+options(axis.options)+'</select></div>').join('');
 for (const axis of ANSWER_AXES) $(axis.key).value = state.draft?.[axis.key] ?? '';
 renderArchive();
}
function submit(event){
 event.preventDefault();
 const answers = selectedAnswers();
 if(window.coop){window.coop.move('result',answers);return}
 state.answers = answers;
 state.phase = 'result';
 save();
 renderResult();
 show('result');
}
function renderResult(){
 const c = current();
 const answers = state.answers || {};
 const score = ANSWER_AXES.reduce((total, {key}) => total+(answers[key]===c[key]?25:0), 0);
 const path = timePath();
 const reconstruction = hasLiveFinal()
  ? '<div class="result-card"><strong>Como o tempo voltou</strong><p>'+esc(path.reconstruction)+'</p></div>'
  : '';
 const ending = hasLiveFinal()
  ? (brokeLoop()
   ? path.success+' O que já ocorreu com o acervo faz parte da história.'
   : (state.intervention === 'other' ? path.distractor+' ' : '')+
     'O museu voltou às 21h55. '+path.instruction)
  : 'Nesta partida, a ação foi avaliada como hipótese.';
 $('resultBody').innerHTML = '<p class="large">Investigação: <strong>'+score+' de 100 pontos</strong>. Cada resposta vale 25 pontos.</p>'+
  ANSWER_AXES.map(({key,title,options:labels}) => '<div class="result-card"><strong>'+title+'</strong><p>Sua resposta: '+
   esc(labels[answers[key]] || 'Ainda não sei')+'<br>Resultado desta partida: '+esc(labels[c[key]])+'</p></div>').join('')+
  '<div class="result-card"><strong>O que aconteceu</strong><p>'+esc(c.detail.charAt(0).toUpperCase()+c.detail.slice(1))+
  '. '+esc(labels[c.alarm][1])+'</p><p>'+esc(figures[c.figure])+'</p></div>'+reconstruction+
  '<div class="result-card"><strong>Desfecho</strong><p>'+esc(ending)+'</p></div>';
}
document.addEventListener('click',e=>{let id=e.target.dataset.close;if(id)$(id).close()});
$('helpOpen').onclick=$('howButton').onclick=()=>popup('helpDialog');
$('startButton').onclick=reset;$('nextLoop').onclick=next;$('endLoop').onclick=finishLoop;
['openJournal','openJournalSide','betweenJournal','finalJournal'].forEach(x=>$(x).onclick=()=>{renderJournal();popup('journalDialog')});
$('getHint').onclick=()=>{if(state&&state.hints<3){state.hints++;save();renderJournal()}};
$('notes').addEventListener('input',e=>{if(state){state.notes=e.target.value;save()}});
$('archiveSections').addEventListener('click', readArchive);
$('answerFields').addEventListener('change', () => {
 if (!window.coop && state?.phase === 'final') {
  state.draft = selectedAnswers();
  save();
 }
});
$('answerForm').addEventListener('submit',submit);$('replay').onclick=()=>window.coop?window.coop.open():reset();
// Recupera a partida local sem confundir o prazo real do loop com o relógio do aparelho.
function restoreSolo(){
 $('betweenEyebrow').innerHTML='<span></span> O TEMPO RETORNOU';
 $('betweenStory').textContent='As portas voltaram a fechar. Os objetos estão onde estavam. Você conserva o que descobriu.';
 $('nextLoop').classList.remove('hidden');
 $('coopBegin').classList.add('hidden');
 $('answerFields').classList.remove('hidden');
 $('answerForm').querySelector('button[type=submit]').classList.remove('hidden');
 $('final').querySelector('.large').textContent='O que aconteceu? Use as pistas do dossiê e indique como prevenir o acontecimento. Se não souber, pode deixar uma resposta em aberto.';
 $('replay').textContent='Jogar outra vez';
const prev=load(storageKey,null);if(prev&&Number.isInteger(prev.caseIndex)&&CASES[prev.caseIndex]&&prev.loop>=1&&prev.loop<=5){state=prev;$('speed').value=String(state.duration);if(state.phase==='playing'&&Number.isFinite(state.endAt)){state.remaining=Math.max(0,(state.endAt-Date.now())/1000);renderGame();show('game');if(state.remaining<=0)finishLoop();else timerHandle=setInterval(tick,250)}else if(state.phase==='choose'){renderGame();show('game')}else if(state.phase==='between'){renderBetween()}else if(state.phase==='final'){renderForm();show('final')}else if(state.phase==='result'&&state.answers){renderResult();show('result')}else{state=null;show('start')}}else show('start');
}
restoreSolo();
