/* Orquestra as cenas existentes. A conclusao canonica continua pertencendo a mesa.
   Primeiras atividades, iguais no Solo e na Mesa: Janela do Norte (fase inclinacao)
   → sala às escuras → escrivaninha e vela → maquete → os papéis da passagem. */
(()=>{
  'use strict';
  const $=id=>document.getElementById(id),params=new URLSearchParams(location.search);
  const run=params.get('run')||('percurso-'+crypto.randomUUID()),player=params.get('jogador')||'visitante';
  params.set('run',run);history.replaceState(null,'','?'+params);
  const key='ac:percurso:'+run+':'+player;
  let credentials=null,stream=null,current='',state=null,paused=false,finished=false,started=Date.now(),control='retomar';
  const frame=$('scene');
  function save(){try{sessionStorage.setItem(key,JSON.stringify({credentials,started}));}catch{}}
  function tell(data){if(parent!==window)parent.postMessage({...data,runId:run},location.origin);}
  function query(){return new URLSearchParams(credentials);}
  async function action(type,extra={}){
    const r=await (globalThis.ACFetch||fetch)('/api/ac/action?'+query(),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,...extra})});
    if(!r.ok){const error=Error('A ação não foi confirmada. Confira a conexão e tente novamente.');error.status=r.status;throw error;}
  }
  function showScene(name){
    if(current===name)return;current=name;
    const q=new URLSearchParams(params);q.set('run',run);q.set('embed','1');q.set('cenario',params.get('cenario')||'AC-COSTA');q.set('v','20261004-janelas');
    if(name!=='sala'){q.set('percurso','1');for(const [k,v]of Object.entries(credentials))q.set(k,v);}
    /* Ordem canônica das primeiras atividades (Mesa e Solo):
       1. Janela do Norte (fase inclinacao, fora deste iframe)
       2. Sala às Escuras
       3. Escrivaninha e vela
       4. Maquete
       5. Os papéis da passagem (individual: cada um monta os seus) */
    const path={sala:'MOSAICO-26-a-sala-as-escuras.html',mesa:'AC-escrivaninha.html',maquete:'AC-maquete.html',papeis:'AC-papeis.html'}[name];
    frame.src=path+'?'+q;frame.hidden=false;
    $('stage').textContent={sala:'1 / 4 · A sala às escuras',mesa:'2 / 4 · Sob outra luz',maquete:'3 / 4 · O lar em miniatura',papeis:'4 / 4 · Os papéis rasgados'}[name];
  }
  /* O bloqueio é um diálogo de decisão: sem ×, sem Esc — sai quando a
     partida retoma ou o colega chega. */
  function bloquear(texto){
    const d=$('block');
    if(texto){$('block-texto').textContent=texto;if(!d.open){try{d.showModal();}catch{d.setAttribute('open','');}}}
    else if(d.open){try{d.close();}catch{d.removeAttribute('open');}}
  }
  const vistaKey=key+':descoberta',papeisKey=key+':papeis';
  function descobertaVista(){try{return sessionStorage.getItem(vistaKey)==='1';}catch{return false;}}
  function papeisMontados(){try{return sessionStorage.getItem(papeisKey)==='1';}catch{return false;}}
  function applyFragmentTheme(hex){
    if(!/^#[0-9a-f]{6}$/i.test(hex))return;
    const rgb=[1,3,5].map(i=>Math.round(parseInt(hex.slice(i,i+2),16)*0.24));
    document.body.style.setProperty('--fragment-color',hex);
    document.body.style.setProperty('--fragment-dark','rgb('+rgb.join(',')+')');
    document.body.classList.add('fragment-themed');
    themeScene(hex,rgb);
  }
  function themeScene(hex,rgb){
    const doc=frame.contentDocument;if(!doc?.head)return;
    let style=doc.getElementById('ac-fragment-theme');
    if(!style){style=doc.createElement('style');style.id='ac-fragment-theme';doc.head.appendChild(style);}
    style.textContent='#intro{background:linear-gradient(145deg,rgb('+rgb.join(',')+'),#090f13)!important;border-top:2px solid '+hex+'}';
  }
  function receive(s){
    state=s;const p=s.percurso;if(!p||p.runId!==run)return;
    if(p.fragmento){applyFragmentTheme(p.fragmento.hex);$('partners-title').textContent='Seu Fragmento nesta atividade';$('partners-intro').textContent='Encontre seus colegas pela cor e pelo símbolo do Fragmento.';const badge=$('fragment-identity');badge.hidden=false;badge.textContent=p.fragmento.simbolo+' '+p.fragmento.nome+' · '+p.fragmento.cor;badge.style.color=p.fragmento.hex;
      /* Ninguém é avisado do papel (lei d'A Casa, 17/09/2026): ele se revela
         pelo efeito no colega. O convite diz só com quem se joga. */
      $('identity').textContent='Grupo desta atividade: '+p.fragmento.membros.map(m=>m.nome).join(', ');}
    frame.inert=p.paused.length>0;
    const waiting=p.ready.includes(credentials.papel)&&p.ready.length<(p.fragmento?.membros.length||2);
    bloquear(p.paused.length||waiting?(p.paused.length?'A partida está pausada. Aguarde a retomada.':'Você concluiu a sala. Aguarde os demais integrantes terminarem a investigação.'):null);
    /* A maquete concluída ainda mostra a descoberta e a passagem: o resumo
       só entra quando o jogador fecha a descoberta. Antes a moldura trocava
       na hora e ninguém via o que a atividade inteira serviu para achar
       (volta 3, 17/09/2026). */
    if(s.maquete?.complete&&!descobertaVista()){showScene('maquete');return;}
    /* Depois da maquete, a passagem: os papéis rasgados são de cada um, e o
       resumo espera o jogador montar os três e guardar o que juntou. */
    if(s.maquete?.complete&&!papeisMontados()){showScene('papeis');return;}
    if(s.maquete?.complete){$('points-sala').textContent=(p.salaIndividual?.[credentials.papel]?.pontos??0)+' pontos';$('points-candle').textContent=s.velaEsgotada?'0 pontos · o tempo acabou':s.bonus+' pontos';$('points-keys').textContent=s.maquete.score+' pontos'+(s.maquete.expired?' · o tempo acabou antes da última camada':'');$('points-papeis').textContent=(s.papeis?.[credentials.papel]!==undefined?s.papeis[credentials.papel]+' pontos':'sincronizando…');frame.hidden=true;bloquear(null);$('summary').hidden=false;
      /* A tela de dentro saiu: o chevron não pode ficar com o estado dela. */
      $('help').textContent='⌄';$('help').setAttribute('aria-expanded','true');$('stage').textContent='Investigação concluída';return;}
    showScene(!p.ready.includes(credentials.papel)?'sala':s.maquete?'maquete':'mesa');
  }
  async function connect(c){
    const r=await (globalThis.ACFetch||fetch)('/api/ac/state?'+new URLSearchParams(c));if(!r.ok)throw Error('Convite inválido ou expirado.');
    const s=await r.json();if(s.percurso?.runId!==run)throw Error('Este convite pertence a outra rodada. Use o convite desta mesa.');
    credentials=c;
    if(player!=='visitante')await action('percurso_identificar',{jogador:player});
    save();for(const [k,v]of Object.entries(c))params.set(k,v);history.replaceState(null,'','?'+params);$('setup').hidden=true;receive(s);
    stream?.close();stream=new (globalThis.ACEvents||EventSource)('/api/ac/events?'+query());stream.onmessage=e=>receive(JSON.parse(e.data));
    stream.onerror=()=>bloquear('Reconectando… seu progresso está preservado.');
    stream.onopen=()=>{if(state)receive(state);};
    if(!s.percurso?.fragmento)$('identity').textContent='';
    if(!s.percurso?.fragmento&&c.papel==='conhecimento'){$('invite').textContent='Você entrou pelo convite do colega.';$('invite').removeAttribute('href');}
    await action('percurso_controle',{acao:control});
    flushProgress();
  }
  let pending=[],sending=false,retry=null;
  const pendingKey=key+':pending';
  try{const saved=JSON.parse(sessionStorage.getItem(pendingKey)||'[]');if(Array.isArray(saved))pending=saved.filter(e=>['sala_progresso','sala_concluida','sala_encerrar','papeis_concluidos'].includes(e.type)).slice(0,12);}catch{}
  function persistPending(){try{sessionStorage.setItem(pendingKey,JSON.stringify(pending));}catch{}}
  function acknowledged(e,s){const p=s.percurso;if(!p)return false;const role=credentials.papel;
    if(e.type==='sala_progresso')return (p.salaIndividual?.[role]?.pontos||0)>=e.objetos;
    if(e.type==='sala_concluida')return p.ready.includes(role);
    if(e.type==='papeis_concluidos')return s.papeis&&s.papeis[role]!==undefined;
    return p.salaEncerrada?.includes(role);
  }
  async function flushProgress(){
    if(sending||!credentials||!pending.length)return;sending=true;
    try{
      while(pending.length){
        const e=pending[0],r=await (globalThis.ACFetch||fetch)('/api/ac/state?'+query());if(!r.ok)throw Error('Reconectando para guardar suas descobertas.');
        const s=await r.json();
        if(!acknowledged(e,s))await action(e.type,e);
        pending.shift();persistPending();
      }
      $('sync-status').hidden=true;$('result').textContent='Descobertas sincronizadas.';
    }catch(e){
      $('sync-status').hidden=false;$('result').textContent='Há descobertas aguardando sincronização. Mantenha esta aba aberta.';
      if(!retry)retry=setTimeout(()=>{retry=null;flushProgress();},3000);
    }finally{sending=false;}
  }
  function queueProgress(type,extra={}){
    if(type==='sala_progresso'){
      const tail=pending[pending.length-1];if(tail?.type===type&&tail.objetos>=extra.objetos)return;
    }
    pending.push({type,...extra});persistPending();flushProgress();
  }
  window.addEventListener('online',flushProgress);
  async function attempt(fn){try{$('error').textContent='';await fn();}catch(e){$('error').textContent=e.message;$('result').textContent=e.message;}}
  $('create').onclick=()=>attempt(async()=>{
    $('create').disabled=true;
    try{
      const r=await (globalThis.ACFetch||fetch)('/api/ac/rooms?'+new URLSearchParams({run}),{method:'POST'});if(!r.ok)throw Error('Não foi possível criar a dupla. Verifique o servidor da AC.');
      const room=await r.json(),c={sala:room.id,papel:'luz',chave:room.tokens.luz};
      const q=new URLSearchParams({run,cenario:params.get('cenario')||'AC-COSTA',sala:room.id,papel:'conhecimento',chave:room.tokens.conhecimento});
      const invite=new URL('AC-percurso.html?'+q,location.href).href;
      try{sessionStorage.setItem(key+':invite',invite);}catch{}
      $('invite').href=invite;$('invite').textContent=invite;
      await connect(c);$('partners').showModal();
    }finally{$('create').disabled=false;}
  });
  function parseInvite(value){
    const u=new URL(value,location.href);if(u.origin!==location.origin||u.searchParams.get('run')!==run)throw Error('Use um convite desta rodada e deste servidor.');
    const c=Object.fromEntries(['sala','papel','chave'].map(k=>[k,u.searchParams.get(k)]));
    if(c.papel!=='conhecimento'||!c.sala||!c.chave)throw Error('Convite incompleto.');return c;
  }
  $('join').onclick=()=>attempt(()=>connect(parseInvite($('join-link').value)));
  $('close').onclick=()=>$('partners').close();
  /* O chevron d'A Casa ABRE o que estiver recolhido. Enquanto a dupla não se
     formou, o que está recolhido é o convite: sem isto, quem tocou em
     "Entendi" nunca mais recuperava o link do colega. */
  window.addEventListener('ac-janelas-abrir',()=>{
    if(!credentials||!state)return;
    const faltando=!state.percurso?.fragmento&&credentials.papel==='luz'&&!(state.online||[]).includes('conhecimento')&&$('invite').getAttribute('href');
    if(faltando&&!$('partners').open){try{$('partners').showModal();}catch{}}
  });
  frame.onload=()=>{if(state?.percurso?.fragmento)applyFragmentTheme(state.percurso.fragmento.hex);frame.contentWindow.postMessage({mosaico:'controle-tarefa',runId:run,acao:control},location.origin);};
  window.addEventListener('message',e=>{
    if(e.origin!==location.origin||!e.data||e.data.runId!==run)return;
    if(e.source===parent&&e.data.mosaico==='controle-tarefa'){
      if(!['pausar','retomar','abortar'].includes(e.data.acao))return;
      if(e.data.acao==='abortar'&&credentials)queueProgress('sala_encerrar');
      control=e.data.acao;paused=control!=='retomar';frame.inert=paused;
      frame.contentWindow?.postMessage(e.data,location.origin);
      if(credentials)attempt(()=>action('percurso_controle',{acao:paused?'pausar':'retomar'}));return;
    }
    if(e.source!==frame.contentWindow||paused)return;
    if(e.data.mosaico==='ac-maquete-descoberta-vista'){try{sessionStorage.setItem(vistaKey,'1');}catch{}if(state)receive(state);return;}
    if(e.data.mosaico==='ac-papeis-completo'&&current==='papeis'){
      try{sessionStorage.setItem(papeisKey,'1');}catch{}
      const pontos=Math.max(0,Math.min(15,Math.round(Number(e.data.pontos)||0)));
      queueProgress('papeis_concluidos',{pontos});
      if(state)receive(state);return;
    }
    if(e.data.mosaico==='ac-sala-progresso'&&current==='sala')queueProgress('sala_progresso',{objetos:e.data.objetos,total:e.data.total});
    if(e.data.mosaico==='tarefa-status')tell(e.data);
    if(e.data.mosaico==='tarefa-ok'&&current==='sala'&&Number(e.data.tempoMs)>0)queueProgress('sala_concluida',{tempoMs:e.data.tempoMs,objetos:e.data.objetosEncontrados,total:e.data.objetosTotal});
  });
  $('finish').onclick=()=>attempt(async()=>{
    if(finished||paused)return;
    const r=await (globalThis.ACFetch||fetch)('/api/ac/state?'+query());if(!r.ok)throw Error('Aguarde a reconexão para concluir.');
    const s=await r.json();if(!s.maquete?.complete||s.percurso?.runId!==run||s.percurso.paused.length)throw Error('A investigação ainda não foi concluída.');
    if(parent===window){$('result').textContent='Percurso concluído. Esta página foi aberta fora de uma mesa; não altera a pontuação de uma partida.';return;}
    finished=true;tell({mosaico:'tarefa-ok',tempoMs:Math.max(1,Math.min(3600000,Date.now()-started))});
    $('result').textContent='Conclusão enviada à mesa.';
  });
  window.addEventListener('pagehide',()=>{stream?.close();if(retry)clearTimeout(retry);persistPending();});
  /* MESA DE UM SÓ: o percurso é de dupla, e com um jogador só a Mesa
     travava na Janela ("esta atividade precisa de dois"). Agora ele joga com
     o PARCEIRO AUTOMÁTICO do Solo, as mesmas cenas, e os pontos vão para a
     Mesa junto com a conclusão (pontosAC). */
  function iniciarSolo(){
    $('setup').hidden=true;
    const soloKey=key+':solo',pts={salaEscura:0,vela:0,chaves:0,papeis:0};
    let etapa='sala';
    try{const salvo=JSON.parse(sessionStorage.getItem(soloKey)||'null');if(salvo&&salvo.etapa){etapa=salvo.etapa;Object.assign(pts,salvo.pts||{});}}catch{}
    if(etapa==='sala'){try{sessionStorage.setItem('ac:solo-integral:v1',JSON.stringify({version:1,janelaConcluida:true}));}catch{}}
    const guardar=()=>{try{sessionStorage.setItem(soloKey,JSON.stringify({etapa,pts}));}catch{}};
    const cena={sala:'MOSAICO-26-a-sala-as-escuras.html',mesa:'AC-escrivaninha.html',papeis:'AC-papeis.html'};
    function mostrar(){
      guardar();
      if(etapa==='fim'){frame.hidden=true;$('points-sala').textContent=pts.salaEscura+' pontos';$('points-candle').textContent=pts.vela+' pontos';$('points-keys').textContent=pts.chaves+' pontos';$('points-papeis').textContent=pts.papeis+' pontos';$('summary').hidden=false;$('stage').textContent='Investigação concluída';return;}
      const q=new URLSearchParams({run,embed:'1',cenario:params.get('cenario')||'AC-COSTA',v:'20261004-janelas'});
      if(etapa!=='sala')q.set('demo','solo');
      current=etapa;frame.src=cena[etapa]+'?'+q;frame.hidden=false;
      $('stage').textContent={sala:'1 / 4 · A sala às escuras',mesa:'2 / 4 · Sob outra luz · com parceiro',papeis:'4 / 4 · Os papéis rasgados'}[etapa];
    }
    window.addEventListener('message',e=>{
      if(e.origin!==location.origin||!e.data||e.source!==frame.contentWindow)return;
      const d=e.data;
      if(d.mosaico==='tarefa-status')tell(d);
      if(etapa==='sala'&&d.mosaico==='tarefa-ok'){const o=Number(d.objetosEncontrados);pts.salaEscura=Number.isFinite(o)?Math.max(0,Math.min(9,Math.round(o))):0;etapa='mesa';mostrar();}
      else if(etapa==='mesa'&&(d.mosaico==='ac-solo-maquete-completa'||d.mosaico==='ac-solo-completo')){pts.chaves=Math.max(0,Math.min(24,Math.round(Number(d.score)||0)));pts.vela=Math.max(0,Math.min(30,Math.round(Number(d.vela)||0)));etapa='papeis';mostrar();}
      else if(etapa==='papeis'&&d.mosaico==='ac-papeis-completo'){pts.papeis=Math.max(0,Math.min(15,Math.round(Number(d.pontos)||0)));etapa='fim';mostrar();}
    });
    $('finish').onclick=()=>{if(finished)return;if(parent===window){$('result').textContent='Percurso concluído fora de uma mesa: não altera a pontuação.';return;}finished=true;tell({mosaico:'tarefa-ok',tempoMs:Math.max(1,Math.min(3600000,Date.now()-started)),pontosAC:{...pts}});$('result').textContent='Conclusão enviada à mesa.';};
    mostrar();
  }
  attempt(async()=>{
    if(params.get('solo')==='1'){iniciarSolo();return;}
    if(params.get('auto')==='1'){
      $('create').hidden=true;$('join').hidden=true;$('join-link').hidden=true;
      const response=await (globalThis.ACFetch||fetch)('/api/ac/fragmentos/entrar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({run,roster:JSON.parse(params.get('elenco')),jogador:player})});
      const entry=await response.json();if(!response.ok)throw Error(entry.error||'Não foi possível formar os Fragmentos. Reabra pela mesa.');
      $('invite').textContent='Grupo definido pela mesa para esta atividade. Na próxima atividade, os integrantes podem mudar.';$('invite').removeAttribute('href');
      await connect({sala:entry.sala,papel:entry.papel,chave:entry.chave});return;
    }
    if(params.has('sala')){await connect(Object.fromEntries(['sala','papel','chave'].map(k=>[k,params.get(k)])));return;}
    let saved;try{saved=JSON.parse(sessionStorage.getItem(key));const invite=sessionStorage.getItem(key+':invite');if(invite){$('invite').href=invite;$('invite').textContent=invite;}}catch{}
    if(saved?.credentials){started=saved.started||started;await connect(saved.credentials);}
  });
})();
