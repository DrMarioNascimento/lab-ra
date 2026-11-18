'use strict';
// Bancada independente: o conte�do fica no aparelho e n�o oferece sigilo contra inspe��o do c�digo.
const ROOMS = [
  {id:'galeria', name:'Galeria principal', icon:'?', sub:'Obras e vitrines'},
  {id:'conservacao', name:'Conserva��o', icon:'?', sub:'Acervo e registros'},
  {id:'seguranca', name:'Seguran�a', icon:'?', sub:'Alarmes e ocorr�ncias'},
  {id:'eletrica', name:'Sala t�cnica', icon:'?', sub:'Energia e equipamentos'},
  {id:'recepcao', name:'Recep��o', icon:'?', sub:'Chegadas e convidados'},
  {id:'corredor', name:'Corredor de servi�o', icon:'?', sub:'Passagens e caixas'}
];
const EVENTS = {
  proteger:'Uma pe�a foi retirada para prote��o.',
  troca:'Uma obra foi substitu�da por outra.',
  entrega:'Uma caixa chegou ao destino errado.',
  surpresa:'Uma apresenta��o surpresa foi interrompida.',
  documento:'Um documento foi retirado da exposi��o.',
  deslocamento:'Uma escultura foi levada para outro ambiente.',
  retorno:'Uma pe�a antiga retornou ao museu.',
  falsa:'A aparente falta de uma obra era um erro de registro.'
};
const ALARMS = {
  sensor:'O alarme disparou por uma falha do sensor.',
  manual:'O alarme foi acionado manualmente.',
  teste:'Um teste programado foi iniciado por engano.'
};
const FIGURES = {
  guarda:'Um guarda escondido entre as obras.',
  artista:'Uma artista preparada como est�tua viva.',
  visitante:'Um visitante escondido na exposi��o.',
  restauradora:'Uma restauradora protegendo uma pe�a.',
  funcionario:'Uma funcion�ria preparando uma surpresa.'
};
const ACTIONS = {
  avisar:'Avisar a equipe de conserva��o antes da movimenta��o.',
  confirmar:'Conferir a identifica��o antes de transportar a caixa.',
  combinar:'Combinar a apresenta��o com a equipe de seguran�a.',
  revisar:'Revisar os registros antes de anunciar o desaparecimento.',
  isolar:'Isolar o equipamento que apresenta falha.'
};
// Cada registro � uma varia��o de roteiro para ensaio, n�o uma hist�ria independente completa.
const CASES = [
 {event:'proteger',alarm:'sensor',figure:'guarda',room:'galeria',action:'avisar',subject:'uma pequena escultura de vidro',detail:'a equipe percebeu um risco na base da vitrine e deslocou a pe�a para evitar danos',clue:'uma base apresentava uma fissura'},
 {event:'troca',alarm:'manual',figure:'artista',room:'recepcao',action:'avisar',subject:'um retrato do acervo',detail:'uma c�pia tempor�ria substituiu o retrato durante uma verifica��o da moldura',clue:'uma ordem de servi�o menciona a moldura'},
 {event:'entrega',alarm:'teste',figure:'visitante',room:'corredor',action:'confirmar',subject:'uma caixa identificada como lote 18',detail:'uma etiqueta antiga levou a caixa � sala de conserva��o, em vez do dep�sito',clue:'duas etiquetas com destinos diferentes foram encontradas na embalagem'},
 {event:'surpresa',alarm:'sensor',figure:'artista',room:'galeria',action:'combinar',subject:'uma apresenta��o de est�tua viva',detail:'a apresenta��o prevista para o encerramento foi interrompida pela falha do sensor',clue:'o programa de encerramento indicava uma apresenta��o surpresa'},
 {event:'documento',alarm:'manual',figure:'funcionario',room:'recepcao',action:'revisar',subject:'uma carta de doa��o',detail:'a carta foi retirada da vitrine para conferir uma assinatura antes da apresenta��o',clue:'h� um pedido de confer�ncia da assinatura'},
 {event:'deslocamento',alarm:'teste',figure:'restauradora',room:'conservacao',action:'avisar',subject:'uma escultura de bronze',detail:'a escultura foi levada para uma inspe��o do suporte antes do fechamento',clue:'a ficha da pe�a registra uma inspe��o de suporte'},
 {event:'retorno',alarm:'sensor',figure:'visitante',room:'corredor',action:'confirmar',subject:'um pequeno rel�gio hist�rico',detail:'a pe�a retornou ao museu para uma exposi��o ap�s um empr�stimo',clue:'o comprovante de transporte aponta o fim de um empr�stimo'},
 {event:'falsa',alarm:'manual',figure:'guarda',room:'seguranca',action:'revisar',subject:'um medalh�o catalogado',detail:'o medalh�o estava no local correto, mas seu n�mero de invent�rio havia sido digitado incorretamente',clue:'os dois registros apresentam n�meros de invent�rio diferentes'},
 {event:'proteger',alarm:'teste',figure:'restauradora',room:'conservacao',action:'avisar',subject:'um painel de papel antigo',detail:'o painel foi levado a um arm�rio protegido ap�s a equipe perceber umidade',clue:'um registro aponta aumento de umidade perto do painel'},
 {event:'troca',alarm:'sensor',figure:'funcionario',room:'galeria',action:'avisar',subject:'uma fotografia emoldurada',detail:'a fotografia foi substitu�da temporariamente por outra vers�o durante a montagem',clue:'o roteiro de montagem descreve duas vers�es da fotografia'},
 {event:'entrega',alarm:'manual',figure:'guarda',room:'corredor',action:'confirmar',subject:'uma caixa de ferramentas de restaura��o',detail:'a caixa foi entregue na recep��o porque a etiqueta do setor se soltou',clue:'a embalagem estava sem a etiqueta do setor'},
 {event:'surpresa',alarm:'teste',figure:'funcionario',room:'recepcao',action:'combinar',subject:'uma homenagem ao antigo curador',detail:'a homenagem preparada em segredo foi interrompida quando o teste de alarme come�ou',clue:'um convite reservado menciona uma homenagem no encerramento'},
 {event:'documento',alarm:'sensor',figure:'visitante',room:'galeria',action:'revisar',subject:'um mapa antigo',detail:'o mapa foi retirado para registrar seu verso, que continha uma anota��o',clue:'o pedido de fotografia menciona o verso do mapa'},
 {event:'deslocamento',alarm:'manual',figure:'artista',room:'corredor',action:'avisar',subject:'um pedestal com uma r�plica',detail:'a r�plica foi deslocada para preparar o espa�o da apresenta��o',clue:'o plano da apresenta��o indica a mudan�a de posi��o do pedestal'},
 {event:'retorno',alarm:'teste',figure:'restauradora',room:'conservacao',action:'confirmar',subject:'um vaso restaurado',detail:'o vaso voltou da oficina de restaura��o e aguardava confer�ncia antes de ser exposto',clue:'a ficha registra a conclus�o da restaura��o'}
];
const labels={
  sensor:['Registro do sensor','O painel registrou uma falha no sensor antes do alarme; n�o h� registro de acionamento manual.'],
  manual:['Registro de acionamento','O sistema registra um acionamento manual. Esse registro, sozinho, n�o informa a inten��o de quem acionou.'],
  teste:['Calend�rio de manuten��o','O painel registra que um teste programado foi iniciado. Um teste n�o prova, por si s�, um inc�ndio.']
};
const figures={
  guarda:'O uniforme e o r�dio indicam que a figura escondida � um guarda; ele diz ter se escondido com medo.',
  artista:'Uma credencial e o programa do evento indicam que a figura � uma artista preparada como est�tua viva.',
  visitante:'Um ingresso e um relato identificam a figura como um visitante que entrou onde n�o deveria.',
  restauradora:'Uma identifica��o e uma ficha de trabalho indicam que a figura � uma restauradora.',
  funcionario:'Uma credencial de servi�o identifica a figura como uma funcion�ria que preparava uma surpresa.'
};
const roomDescriptions={galeria:'Vitrines, pedestais e obras aguardam o fechamento. Algo chama sua aten��o entre os registros da exposi��o.',conservacao:'Fichas de acervo e materiais de trabalho contam uma parte da hist�ria dos objetos.',seguranca:'Um painel registra as ocorr�ncias do edif�cio. O alarme � apenas um dos sinais daquela noite.',eletrica:'A luz de emerg�ncia revela equipamentos e anota��es t�cnicas. Nem toda falha tem a mesma causa.',recepcao:'Convidados, entregas e registros de entrada se cruzam perto da sa�da.',corredor:'Pelo corredor passam pessoas e caixas. Olhar a passagem n�o revela, sozinho, toda a inten��o.'};
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
   {id:'gal1',name:'Observar a montagem',time:0,text:'A ficha da exposi��o menciona '+c.subject+'. '+c.clue.charAt(0).toUpperCase()+c.clue.slice(1)+'.'},
   {id:'gal2',name:'Examinar o registro de acervo',time:90,text:'Um registro da galeria informa: '+c.detail+'.'},
   {id:'gal3',name:'Procurar sinais da figura',time:180,text:c.room==='galeria'?fig:'Um registro de ronda indica uma figura im�vel em '+room+'.'}],
  conservacao:[
   {id:'con1',name:'Ler a ficha de conserva��o',time:0,text:'A ficha referente a '+c.subject+' anota que '+c.detail+'.'},
   {id:'con2',name:'Examinar a observa��o t�cnica',time:90,text:'Na pasta consta: '+c.clue+'.'},
   {id:'con3',name:'Consultar o plano de preven��o',time:180,text:'Uma nota recomenda: '+ACTIONS[c.action]}],
  seguranca:[
   {id:'seg1',name:'Ler o registro do alarme',time:0,text:evidence},
   {id:'seg2',name:'Consultar a ocorr�ncia',time:90,text:ALARMS[c.alarm]+' O registro n�o permite concluir sozinho o que ocorreu com o acervo.'},
   {id:'seg3',name:'Verificar a ronda',time:180,text:c.room==='seguranca'?fig:'A ronda menciona uma figura im�vel em '+room+'.'}],
  eletrica:[
   {id:'ele1',name:'Examinar o painel',time:0,text:evidence},
   {id:'ele2',name:'Ler a anota��o t�cnica',time:90,text:'H� uma anota��o: '+c.clue+'. Ela deve ser relacionada a outros registros.'},
   {id:'ele3',name:'Analisar o prot�tipo',time:180,text:'O prot�tipo apresenta uma anomalia. O estrondo e o alarme precisam ser investigados separadamente; o registro n�o comprova sozinho a causa do retorno do tempo.'}],
  recepcao:[
   {id:'rec1',name:'Consultar a movimenta��o',time:0,text:'A recep��o recebeu uma anota��o sobre '+c.subject+'. '+c.clue.charAt(0).toUpperCase()+c.clue.slice(1)+'.'},
   {id:'rec2',name:'Examinar o livro de ocorr�ncias',time:90,text:'Na ocorr�ncia consta: '+c.detail+'.'},
   {id:'rec3',name:'Observar a figura',time:180,text:c.room==='recepcao'?fig:'Uma pessoa da recep��o comenta que havia uma figura im�vel em '+room+'.'}],
  corredor:[
   {id:'cor1',name:'Examinar o registro de passagem',time:0,text:'No registro de passagem: '+c.detail+'.'},
   {id:'cor2',name:'Ler o recado da equipe',time:90,text:'O recado sugere uma a��o: '+ACTIONS[c.action]},
   {id:'cor3',name:'Verificar a figura im�vel',time:180,text:c.room==='corredor'?fig:'Um recado indica que algu�m viu uma figura im�vel em '+room+'.'}]
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
 $('statusText').textContent=state.phase==='playing'?'Voc� permanece neste ambiente at� o retorno.':'Voc� poder� visitar um ambiente em cada loop.';
 $('roomPanel').classList.toggle('hidden',state.phase!=='playing');
 if(state.phase==='playing')renderClues();
 $('notes').value=state.notes||'';renderJournal();
}
function renderClues(){let r=ROOMS.find(x=>x.id===state.room),clues=makeClues(current())[r.id],elapsed=state.duration-state.remaining;
 $('roomPanel').innerHTML='<h3>'+r.name+'</h3><p>'+roomDescriptions[r.id]+'</p><div class="clue-list">'+clues.map(q=>{let got=state.clues.some(x=>x.id===q.id),needed=q.time/300*state.duration,available=elapsed>=needed;return '<button class="clue" data-clue="'+q.id+'" '+(got||!available?'disabled':'')+'><span>'+esc(q.name)+'</span><small>'+(got?'Registrada':available?'Examinar':'Dispon�vel em '+fmt(needed-elapsed))+'</small></button>'}).join('')+'</div>';
 document.querySelectorAll('[data-clue]').forEach(b=>b.addEventListener('click',()=>collect(b.dataset.clue)));
}
function collect(id){if(state.phase!=='playing'||Date.now()>=state.endAt){tick();return}const q=makeClues(current())[state.room].find(x=>x.id===id);if(!q||state.clues.some(x=>x.id===id))return;const room=ROOMS.find(x=>x.id===state.room);state.clues.push({id:q.id,room:room.name,name:q.name,text:q.text,loop:state.loop});save();renderClues();renderJournal();toast('Pista guardada no caderno')}
function renderJournal(){
 const clues=state.clues||[];$('countBadge').textContent=clues.length;
 $('journalPreview').innerHTML=clues.length?clues.slice(-3).reverse().map(c=>'<div class="preview-item">'+esc(c.name)+' <br><small>'+esc(c.room)+'</small></div>').join(''):'<p class="muted">Suas descobertas aparecer�o aqui.</p>';
 $('journalList').innerHTML=clues.length?clues.map(c=>'<article class="journal-item"><b>'+esc(c.room)+' � Loop '+c.loop+'</b><p><strong>'+esc(c.name)+':</strong> '+esc(c.text)+'</p></article>').join(''):'<p class="muted">Voc� ainda n�o registrou pistas.</p>';
 const hs=['Compare o que aconteceu com a pe�a com os registros da galeria e de conserva��o.','O alarme tem registros pr�prios. Compare seguran�a e sala t�cnica antes de lig�-lo a outros fatos.','Procure uma recomenda��o de preven��o no corredor de servi�o ou na conserva��o.'];
 $('hints').innerHTML=hs.slice(0,state.hints).map((x,i)=>'<p><strong>Orienta��o '+(i+1)+':</strong> '+esc(x)+'</p>').join('');$('getHint').disabled=state.hints>=3;
}
function tick(){if(!state||state.phase!=='playing')return;const old=state.remaining;state.remaining=Math.max(0,(state.endAt-Date.now())/1000);$('timer').textContent=fmt(state.remaining);if(Math.ceil(old)!==Math.ceil(state.remaining))renderClues();if(state.remaining<=0)finishLoop()}
function finishLoop(){if(!state||state.phase!=='playing')return;clearInterval(timerHandle);state.phase='between';state.remaining=0;state.endAt=null;save();$('betweenCount').textContent=state.clues.length;$('betweenLoop').textContent=state.loop+' / 5';$('betweenTitle').textContent=state.loop===5?'Os ciclos terminaram.':'Voc� se lembra.';$('betweenHint').textContent=state.loop===5?'� hora de reunir suas descobertas e apresentar sua conclus�o.':'O pr�ximo ambiente pode confirmar ou mudar sua hip�tese.';$('nextLoop').textContent=state.loop===5?'Apresentar hip�tese':'Escolher pr�ximo ambiente';show('between')}
function next(){if(state.loop>=5){state.phase='final';save();renderForm();show('final');return}state.loop++;state.phase='choose';state.room=null;state.remaining=state.duration;save();renderGame();show('game')}
function options(obj){return '<option value="">Ainda n�o sei</option>'+Object.entries(obj).map(([k,v])=>'<option value="'+k+'">'+esc(v)+'</option>').join('')}
function renderForm(){$('answerFields').innerHTML='<div><label for="event">O que aconteceu com o acervo ou a exposi��o?</label><select id="event">'+options(EVENTS)+'</select></div><div><label for="alarm">O que disparou o alarme?</label><select id="alarm">'+options(ALARMS)+'</select></div><div><label for="figure">Quem era a figura im�vel observada?</label><select id="figure">'+options(FIGURES)+'</select></div><div><label for="action">Qual a��o poderia melhorar o desfecho?</label><select id="action">'+options(ACTIONS)+'</select></div>'}
function submit(e){e.preventDefault();const c=current(),answers={event:$('event').value,alarm:$('alarm').value,figure:$('figure').value,action:$('action').value};state.answers=answers;state.phase='result';save();renderResult();show('result')}
function renderResult(){const c=current(),a=state.answers||{},keys=['event','alarm','figure','action'],maps={event:EVENTS,alarm:ALARMS,figure:FIGURES,action:ACTIONS},titles={event:'Acontecimento',alarm:'Alarme',figure:'Figura im�vel',action:'Interven��o'},score=keys.reduce((n,k)=>n+(a[k]===c[k]?25:0),0);
 $('resultBody').innerHTML='<p class="large">Voc� reconheceu <strong>'+score+' de 100 pontos poss�veis</strong>. Cada eixo vale 25 pontos nesta bancada experimental.</p>'+keys.map(k=>'<div class="result-card"><strong>'+titles[k]+'</strong><p>Sua resposta: '+esc(maps[k][a[k]]||'Ainda n�o sei')+'<br>Resultado desta partida: '+esc(maps[k][c[k]])+'</p></div>').join('')+'<div class="result-card"><strong>O que aconteceu</strong><p>'+esc(c.detail.charAt(0).toUpperCase()+c.detail.slice(1))+'. '+esc(labels[c.alarm][1])+'</p><p>'+esc(figures[c.figure])+'</p></div><div class="result-card"><strong>Sua decis�o</strong><p>'+(a.action===c.action?'A a��o escolhida est� alinhada ao registro de preven��o desta varia��o.':'A a��o recomendada nesta varia��o era: '+esc(ACTIONS[c.action]))+'</p><p>O efeito sobre o loop temporal ainda ser� desenvolvido. Nesta bancada, a interven��o � avaliada como hip�tese; ela n�o altera a simula��o.</p></div>';
}
document.addEventListener('click',e=>{let id=e.target.dataset.close;if(id)$(id).close()});
$('helpOpen').onclick=$('howButton').onclick=()=>popup('helpDialog');
$('startButton').onclick=reset;$('nextLoop').onclick=next;$('endLoop').onclick=finishLoop;
['openJournal','openJournalSide','betweenJournal','finalJournal'].forEach(x=>$(x).onclick=()=>{renderJournal();popup('journalDialog')});
$('getHint').onclick=()=>{if(state&&state.hints<3){state.hints++;save();renderJournal()}};
$('notes').addEventListener('input',e=>{if(state){state.notes=e.target.value;save()}});
$('answerForm').addEventListener('submit',submit);$('replay').onclick=reset;
// Recupera a partida local sem confundir o prazo real do loop com o rel�gio do aparelho.
const prev=load(storageKey,null);if(prev&&Number.isInteger(prev.caseIndex)&&CASES[prev.caseIndex]&&prev.loop>=1&&prev.loop<=5){state=prev;started=true;if(state.phase==='playing'&&Number.isFinite(state.endAt)){state.remaining=Math.max(0,(state.endAt-Date.now())/1000);renderGame();show('game');if(state.remaining<=0)finishLoop();else timerHandle=setInterval(tick,250)}else if(state.phase==='choose'){renderGame();show('game')}else if(state.phase==='between'){$('betweenCount').textContent=state.clues.length;$('betweenLoop').textContent=state.loop+' / 5';$('betweenTitle').textContent=state.loop===5?'Os ciclos terminaram.':'Voc� se lembra.';$('nextLoop').textContent=state.loop===5?'Apresentar hip�tese':'Escolher pr�ximo ambiente';show('between')}else if(state.phase==='final'){renderForm();show('final')}else if(state.phase==='result'&&state.answers){renderResult();show('result')}else{state=null;show('start')}}else show('start');

