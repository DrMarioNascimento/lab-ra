/* Transporte do ensaio em dupla. Nao simula o outro jogador. */
(function(global){
  /* O Solo precisa do MESMO motor da Mesa. Enquanto ele teve uma cópia dos
     capítulos aqui dentro, qualquer mudança de dica, esconderijo ou fechadura
     tinha de ser feita duas vezes — e a segunda vez nunca é feita. */
  var MEU_SRC=(document.currentScript&&document.currentScript.src)||location.href;
  var motorSolo=null;
  function motor(){return motorSolo||(motorSolo=Promise.all([import(new URL('ac-core.mjs',MEU_SRC).href),import(new URL('ac-maquete-state.mjs',MEU_SRC).href)]).then(function(m){return Object.assign({},m[1],{core:m[0]});}));}

  /* O PARCEIRO AUTOMÁTICO do Solo (Mario, 18/09/2026: "avalie se não é melhor
     colocar uma forma de jogo automático só para preencher a vaga — talvez a
     falta disso esteja embolando tudo"). Estava: o Solo ocupava as duas
     metades no mesmo aparelho — duas pegas na mesma tela, uma sobre a outra,
     e uma pessoa fazendo de conta que não sabia o que a outra metade sabia.

     Agora o Solo roda o MESMO motor da Mesa (ac-core.mjs), numa sala local, e
     a outra metade é do parceiro:
     · na escrivaninha, quem joga põe a mesa, a vela e procura a etiqueta; o
       parceiro está com o fósforo — quando a vela apaga, ele risca;
     · na maquete, quem joga fica com a CHAVE (procura o esconderijo e leva a
       chave); o parceiro fica com a FECHADURA: acha a dele depois de um
       tempo, diz onde ela está e guia (a fala do guia é da página, que sabe
       para onde o jogador olha).
     O que ele diz chega em `snapshot.parceiro`. */
  const TEMPO_DA_FECHADURA=[16000,22000,19000]; // quanto o parceiro leva para achar a fechadura de cada camada
  const FOSFORO_MS=3500;

  global.ACCooperation = async function(onState,onStatus,options={}){
    let params=new URLSearchParams(location.search),tokens;
    if(params.get('demo')==='solo'&&!params.has('sala')){
      const M=await motor(),core=M.core;
      const KEY='ac:solo-integral:v1';
      let saved=null;try{saved=JSON.parse(sessionStorage.getItem(KEY)||'null')}catch(_){ }
      const janelaConcluida=!!(saved&&saved.janelaConcluida);
      const novo=()=>({id:'solo',stage:'posicionar',startedAt:Date.now(),finishedAt:null,beam:null,vela:null,maquete:null,keyMotion:null,papeis:null,velaEsgotada:false,percurso:null});
      let room=saved&&saved.version===2&&saved.room?Object.assign(novo(),saved.room):novo();
      room.peers=new Map([['eu',{role:'luz'}],['parceiro',{role:'conhecimento'}]]);
      let fala=saved&&saved.version===2&&saved.fala||null;
      const persist=()=>{try{const {peers,beam,keyMotion,...resto}=room;sessionStorage.setItem(KEY,JSON.stringify({version:2,janelaConcluida,room:resto,fala}));}catch(_){ }};
      persist();
      const dizer=(texto,tipo)=>{fala={texto,tipo:tipo||'fala',at:Date.now()};persist();};
      /* O papel de quem joga, pelo que falta fazer. */
      const soloRole=()=>{
        if(!room.maquete)return ['posicionar','castical'].includes(room.stage)?'luz':'conhecimento';
        return M.papelDoSolo(room.maquete);
      };
      /* Cada gesto vale pelo papel que o faz na Mesa. */
      const papelDoGesto=type=>{
        if(['iniciar','posicionar','encaixar','feixe'].includes(type))return 'luz';
        if(['descobrir','registrar','reacender'].includes(type))return 'conhecimento';
        return soloRole();
      };
      const snapshot=()=>{
        const now=Date.now(),v=core.snapshot(room,now,soloRole());
        v.soloRole=soloRole();v.online=['luz','conhecimento'];v.parceiro=fala;v.solo=true;
        return v;
      };
      /* O relógio do parceiro. */
      let fosforoEm=null,fechaduraMarcada=null;
      function parceiro(){
        const now=Date.now();
        /* O fósforo: a vela apagou, o parceiro risca. */
        if(room.stage==='iluminar'&&room.vela&&now>=room.vela.ate){
          if(fosforoEm===null){fosforoEm=now+FOSFORO_MS;dizer('A vela apagou. Espere — estou riscando um fósforo.');}
          else if(now>=fosforoEm&&core.apply(room,'conhecimento',{type:'reacender'},now)){fosforoEm=null;dizer('Pronto, acendi de novo. Rápido, antes que apague.');persist();}
        }else fosforoEm=null;
        /* A fechadura: o parceiro acha a dele depois de um tempo. */
        const m=room.maquete;
        if(m&&m.level<3&&!m.lock){
          const marca=m.level+':'+m.layerAt;
          if(fechaduraMarcada!==marca){fechaduraMarcada=marca;dizer(m.level===0?'Estou procurando do meu lado da maquete.':'Nova camada. Vou procurar do meu lado.');}
          const cap=M.CAPITULOS[m.level],lado=M.papelDaFechadura(cap);
          if(now-m.layerAt>=TEMPO_DA_FECHADURA[m.level]&&now-(m.lastAttempt?.[lado]||0)>=M.INTERVALO_ENTRE_TOQUES){
            core.apply(room,lado,{type:'maquete_examinar',object:cap.fechadura},now);
            if(m.lock){dizer(m.key?'Achei a minha também: '+cap.achado.fechadura:'Achei uma coisa do meu lado: '+cap.achado.fechadura+' E você?','achou');persist();}
          }
        }
      }
      const tick=setInterval(()=>{parceiro();onState(snapshot());},200);
      setTimeout(()=>{onStatus(true);onState(snapshot());},0);
      return {role:soloRole(),invite:null,demo:true,parceiro:true,close(){clearInterval(tick);},
        falar(texto,tipo){dizer(texto,tipo);onState(snapshot());},
        async send(type,extra={}){
          const now=Date.now();let ok=false;
          if(type==='iniciar_maquete'&&!janelaConcluida)ok=false;
          else ok=core.apply(room,papelDoGesto(type),{type,...extra},now);
          if(ok&&type!=='feixe'&&type!=='maquete_mover')persist();
          if(ok&&type==='iniciar_maquete')dizer('Vamos à maquete. Eu fico do outro lado da mesa.');
          onState(snapshot());return ok;
        }};
    }

    const scenario=window.ACRoom?ACRoom.seed():params.get('cenario');
    if(!params.has('sala')){
      const res=await (globalThis.ACFetch||fetch)('/api/ac/rooms'+(options.maquette?'?atividade=maquete':''),{method:'POST'});if(!res.ok)throw Error('Abra pelo servidor de cooperação da AC.');
      const room=await res.json();tokens=room.tokens;
      const edition=params.has('edicao');
      params=new URLSearchParams({sala:room.id,papel:'luz',chave:tokens.luz});if(edition)params.set('edicao','1');if(scenario)params.set('cenario',scenario);
      history.replaceState(null,'','?'+params);
      sessionStorage.setItem('ac:convite:'+room.id,JSON.stringify(tokens));
    }
    if(scenario&&!params.has('cenario')){params.set('cenario',scenario);history.replaceState(null,'','?'+params);}
    const role=params.get('papel');if(!['luz','conhecimento','apoio'].includes(role))throw Error('Papel inválido.');
    tokens ??= JSON.parse(sessionStorage.getItem('ac:convite:'+params.get('sala'))||'null');
    const query=new URLSearchParams({sala:params.get('sala'),papel:role,chave:params.get('chave')});
    const stream=new (globalThis.ACEvents||EventSource)('/api/ac/events?'+query);
    stream.onopen=()=>onStatus(true);stream.onerror=()=>onStatus(false);
    stream.onmessage=e=>onState(JSON.parse(e.data));
    return {role,invite:tokens?location.origin+location.pathname+'?'+new URLSearchParams({sala:params.get('sala'),papel:'conhecimento',chave:tokens.conhecimento,...(scenario?{cenario:scenario}:{})}):null,
      async send(type,extra={}){const res=await (globalThis.ACFetch||fetch)('/api/ac/action?'+query,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,...extra})});if(!res.ok&&res.status!==409)throw Error('Conexão interrompida.');return res.ok;},close(){stream.close();}};
  };
})(window);
