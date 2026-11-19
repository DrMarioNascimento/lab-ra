'use strict';
// Bancada independente: o conteúdo fica no aparelho e não oferece sigilo contra inspeção do código.
const ROOMS = [
  {id:'galeria', name:'Galeria principal', icon:'▧', sub:'Obras e vitrines'},
  {id:'conservacao', name:'Conservação', icon:'◇', sub:'Acervo e registros'},
  {id:'seguranca', name:'Segurança', icon:'◉', sub:'Alarmes e ocorrências'},
  {id:'eletrica', name:'Sala técnica', icon:'⌁', sub:'Energia e equipamentos'},
  {id:'recepcao', name:'Recepção', icon:'♧', sub:'Chegadas e convidados'},
  {id:'corredor', name:'Corredor de serviço', icon:'▥', sub:'Passagens e caixas'}
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
  confirmar:'Conferir a identificação antes de transportar a caixa.',
  combinar:'Combinar a apresentação com a equipe de segurança.',
  revisar:'Revisar os registros antes de anunciar o desaparecimento.',
  isolar:'Isolar o equipamento que apresenta falha.'
};
// Cada registro é uma variação de roteiro para ensaio, não uma história independente completa.
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
let state=null,timerHandle=null,toastHandle=null,started=false;
function load(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function save(){try{localStorage.setItem(storageKey,JSON.stringify(state))}catch{}}
function chooseCase(){let hist=load(historyKey,[]);if(!Array.isArray(hist))hist=[];let options=CASES.map((_,i)=>i).filter(i=>!hist.includes(i));if(!options.length){hist=[];options=CASES.map((_,i)=>i)}const i=options[Math.floor(Math.random()*options.length)];hist.push(i);try{localStorage.setItem(historyKey,JSON.stringify(hist))}catch{}return i}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
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
   {id:'con3',name:'Consultar o plano de prevenção',time:180,text:'Uma nota recomenda: '+ACTIONS[c.action]}],
  seguranca:[
   {id:'seg1',name:'Ler o registro do alarme',time:0,text:evidence},
   {id:'seg2',name:'Consultar a ocorrência',time:90,text:ALARMS[c.alarm]+' O registro não permite concluir sozinho o que ocorreu com o acervo.'},
   {id:'seg3',name:'Verificar a ronda',time:180,text:c.room==='seguranca'?fig:'A ronda menciona uma figura imóvel em '+room+'.'}],
  eletrica:[
   {id:'ele1',name:'Examinar o painel',time:0,text:evidence},
   {id:'ele2',name:'Ler a anotação técnica',time:90,text:'Há uma anotação: '+c.clue+'. Ela deve ser relacionada a outros registros.'},
   {id:'ele3',name:'Analisar o protótipo',time:180,text:'O protótipo apresenta uma anomalia. O estrondo e o alarme precisam ser investigados separadamente; o registro não comprova sozinho a causa do retorno do tempo.'}],
  recepcao:[
   {id:'rec1',name:'Consultar a movimentação',time:0,text:'A recepção recebeu uma anotação sobre '+c.subject+'. '+c.clue.charAt(0).toUpperCase()+c.clue.slice(1)+'.'},
   {id:'rec2',name:'Examinar o livro de ocorrências',time:90,text:'Na ocorrência consta: '+c.detail+'.'},
   {id:'rec3',name:'Observar a figura',time:180,text:c.room==='recepcao'?fig:'Uma pessoa da recepção comenta que havia uma figura imóvel em '+room+'.'}],
  corredor:[
   {id:'cor1',name:'Examinar o registro de passagem',time:0,text:'No registro de passagem: '+c.detail+'.'},
   {id:'cor2',name:'Ler o recado da equipe',time:90,text:'O recado sugere uma ação: '+ACTIONS[c.action]},
   {id:'cor3',name:'Verificar a figura imóvel',time:180,text:c.room==='corredor'?fig:'Um recado indica que alguém viu uma figura imóvel em '+room+'.'}]
 }
}
function show(id){['start','game','between','final','result'].forEach(x=>$(x).classList.toggle('hidden',x!==id));window.scrollTo({top:0,behavior:'instant'})}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastHandle);toastHandle=setTimeout(()=>$('toast').classList.remove('show'),2200)}
function popup(id){if(!$(id).open)$(id).showModal()}
function fmt(s){s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function current(){return CASES[state.caseIndex]}
function reset(){clearInterval(timerHandle);state={caseIndex:chooseCase(),loop:1,phase:'choose',room:null,duration:Number($('speed').value),remaining:Number($('speed').value),endAt:null,clues:[],hints:0,notes:'',answers:null};started=true;save();renderGame();show('game')}
function enterRoom(id){if(state.phase!=='choose')return;state.room=id;state.phase='playing';state.remaining=state.duration;state.endAt=Date.now()+state.remaining*1000;save();renderGame();tick();timerHandle=setInterval(tick,250)}
function renderGame(){
 $('loopLabel').textContent='LOOP '+state.loop+' DE 5';$('timer').textContent=fmt(state.remaining);
 $('clockStatus').textContent=state.phase==='playing'?'tempo em andamento':'aguardando escolha';
 $('phaseTitle').textContent=state.phase==='playing'?ROOMS.find(r=>r.id===state.room).name:'Escolha onde investigar';
 $('phaseDescription').textContent=state.phase==='playing'?'Observe o ambiente enquanto o tempo passa.':'Cada escolha revela uma perspectiva diferente da mesma noite.';
 $('boardTitle').textContent=state.phase==='playing'?'Ambiente escolhido':'Escolha um ambiente';
 $('roomGrid').innerHTML=ROOMS.map(r=>'<button class="room '+(state.room===r.id?'selected':'')+'" '+(state.phase==='playing'?'disabled':'')+' data-room="'+r.id+'"><span class="room-icon" aria-hidden="true">'+r.icon+'</span><strong>'+r.name+'</strong><small>'+r.sub+'</small></button>').join('');
 document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>enterRoom(b.dataset.room)));
 $('endLoop').classList.toggle('hidden',state.phase!=='playing');
 $('statusText').textContent=state.phase==='playing'?'Você permanece neste ambiente até o retorno.':'Você poderá visitar um ambiente em cada loop.';
 $('roomPanel').classList.toggle('hidden',state.phase!=='playing');
 if(state.phase==='playing')renderClues();
 $('notes').value=state.notes||'';renderJournal();
}
function renderClues(){let r=ROOMS.find(x=>x.id===state.room),clues=makeClues(current())[r.id],elapsed=state.duration-state.remaining;
 $('roomPanel').innerHTML='<h3>'+r.name+'</h3><p>'+roomDescriptions[r.id]+'</p><div class="clue-list">'+clues.map(q=>{let got=state.clues.some(x=>x.id===q.id),needed=q.time/300*state.duration,available=elapsed>=needed;return '<button class="clue" data-clue="'+q.id+'" '+(got||!available?'disabled':'')+'><span>'+esc(q.name)+'</span><small>'+(got?'Registrada':available?'Examinar':'Disponível em '+fmt(needed-elapsed))+'</small></button>'}).join('')+'</div>';
 document.querySelectorAll('[data-clue]').forEach(b=>b.addEventListener('click',()=>collect(b.dataset.clue)));
}
function collect(id){if(state.phase!=='playing'||Date.now()>=state.endAt){tick();return}const q=makeClues(current())[state.room].find(x=>x.id===id);if(!q||state.clues.some(x=>x.id===id))return;const room=ROOMS.find(x=>x.id===state.room);state.clues.push({id:q.id,room:room.name,name:q.name,text:q.text,loop:state.loop});save();renderClues();renderJournal();toast('Pista guardada no caderno')}
function renderJournal(){
 const clues=state.clues||[];$('countBadge').textContent=clues.length;
 $('journalPreview').innerHTML=clues.length?clues.slice(-3).reverse().map(c=>'<div class="preview-item">'+esc(c.name)+' <br><small>'+esc(c.room)+'</small></div>').join(''):'<p class="muted">Suas descobertas aparecerão aqui.</p>';
 $('journalList').innerHTML=clues.length?clues.map(c=>'<article class="journal-item"><b>'+esc(c.room)+' · Loop '+c.loop+'</b><p><strong>'+esc(c.name)+':</strong> '+esc(c.text)+'</p></article>').join(''):'<p class="muted">Você ainda não registrou pistas.</p>';
 const hs=['Compare o que aconteceu com a peça com os registros da galeria e de conservação.','O alarme tem registros próprios. Compare segurança e sala técnica antes de ligá-lo a outros fatos.','Procure uma recomendação de prevenção no corredor de serviço ou na conservação.'];
 $('hints').innerHTML=hs.slice(0,state.hints).map((x,i)=>'<p><strong>Orientação '+(i+1)+':</strong> '+esc(x)+'</p>').join('');$('getHint').disabled=state.hints>=3;
}
function tick(){if(!state||state.phase!=='playing')return;const old=state.remaining;state.remaining=Math.max(0,(state.endAt-Date.now())/1000);$('timer').textContent=fmt(state.remaining);if(Math.ceil(old)!==Math.ceil(state.remaining))renderClues();if(state.remaining<=0)finishLoop()}
function finishLoop(){if(!state||state.phase!=='playing')return;clearInterval(timerHandle);state.phase='between';state.remaining=0;state.endAt=null;save();$('betweenCount').textContent=state.clues.length;$('betweenLoop').textContent=state.loop+' / 5';$('betweenTitle').textContent=state.loop===5?'Os ciclos terminaram.':'Você se lembra.';$('betweenHint').textContent=state.loop===5?'É hora de reunir suas descobertas e apresentar sua conclusão.':'O próximo ambiente pode confirmar ou mudar sua hipótese.';$('nextLoop').textContent=state.loop===5?'Apresentar hipótese':'Escolher próximo ambiente';show('between')}
function next(){if(state.loop>=5){state.phase='final';save();renderForm();show('final');return}state.loop++;state.phase='choose';state.room=null;state.remaining=state.duration;save();renderGame();show('game')}
function options(obj){return '<option value="">Ainda não sei</option>'+Object.entries(obj).map(([k,v])=>'<option value="'+k+'">'+esc(v)+'</option>').join('')}
function renderForm(){$('answerFields').innerHTML='<div><label for="event">O que aconteceu com o acervo ou a exposição?</label><select id="event">'+options(EVENTS)+'</select></div><div><label for="alarm">O que disparou o alarme?</label><select id="alarm">'+options(ALARMS)+'</select></div><div><label for="figure">Quem era a figura imóvel observada?</label><select id="figure">'+options(FIGURES)+'</select></div><div><label for="action">Qual ação poderia melhorar o desfecho?</label><select id="action">'+options(ACTIONS)+'</select></div>'}
function submit(e){e.preventDefault();const c=current(),answers={event:$('event').value,alarm:$('alarm').value,figure:$('figure').value,action:$('action').value};state.answers=answers;state.phase='result';save();renderResult();show('result')}
function renderResult(){const c=current(),a=state.answers||{},keys=['event','alarm','figure','action'],maps={event:EVENTS,alarm:ALARMS,figure:FIGURES,action:ACTIONS},titles={event:'Acontecimento',alarm:'Alarme',figure:'Figura imóvel',action:'Intervenção'},score=keys.reduce((n,k)=>n+(a[k]===c[k]?25:0),0);
 $('resultBody').innerHTML='<p class="large">Você reconheceu <strong>'+score+' de 100 pontos possíveis</strong>. Cada eixo vale 25 pontos nesta bancada experimental.</p>'+keys.map(k=>'<div class="result-card"><strong>'+titles[k]+'</strong><p>Sua resposta: '+esc(maps[k][a[k]]||'Ainda não sei')+'<br>Resultado desta partida: '+esc(maps[k][c[k]])+'</p></div>').join('')+'<div class="result-card"><strong>O que aconteceu</strong><p>'+esc(c.detail.charAt(0).toUpperCase()+c.detail.slice(1))+'. '+esc(labels[c.alarm][1])+'</p><p>'+esc(figures[c.figure])+'</p></div><div class="result-card"><strong>Sua decisão</strong><p>'+(a.action===c.action?'A ação escolhida está alinhada ao registro de prevenção desta variação.':'A ação recomendada nesta variação era: '+esc(ACTIONS[c.action]))+'</p><p>O efeito sobre o loop temporal ainda será desenvolvido. Nesta bancada, a intervenção é avaliada como hipótese; ela não altera a simulação.</p></div>';
}
document.addEventListener('click',e=>{let id=e.target.dataset.close;if(id)$(id).close()});
$('helpOpen').onclick=$('howButton').onclick=()=>popup('helpDialog');
$('startButton').onclick=reset;$('nextLoop').onclick=next;$('endLoop').onclick=finishLoop;
['openJournal','openJournalSide','betweenJournal','finalJournal'].forEach(x=>$(x).onclick=()=>{renderJournal();popup('journalDialog')});
$('getHint').onclick=()=>{if(state&&state.hints<3){state.hints++;save();renderJournal()}};
$('notes').addEventListener('input',e=>{if(state){state.notes=e.target.value;save()}});
$('answerForm').addEventListener('submit',submit);$('replay').onclick=reset;
// Recupera a partida local sem confundir o prazo real do loop com o relógio do aparelho.
const prev=load(storageKey,null);if(prev&&Number.isInteger(prev.caseIndex)&&CASES[prev.caseIndex]&&prev.loop>=1&&prev.loop<=5){state=prev;started=true;if(state.phase==='playing'&&Number.isFinite(state.endAt)){state.remaining=Math.max(0,(state.endAt-Date.now())/1000);renderGame();show('game');if(state.remaining<=0)finishLoop();else timerHandle=setInterval(tick,250)}else if(state.phase==='choose'){renderGame();show('game')}else if(state.phase==='between'){$('betweenCount').textContent=state.clues.length;$('betweenLoop').textContent=state.loop+' / 5';$('betweenTitle').textContent=state.loop===5?'Os ciclos terminaram.':'Você se lembra.';$('nextLoop').textContent=state.loop===5?'Apresentar hipótese':'Escolher próximo ambiente';show('between')}else if(state.phase==='final'){renderForm();show('final')}else if(state.phase==='result'&&state.answers){renderResult();show('result')}else{state=null;show('start')}}else show('start');
