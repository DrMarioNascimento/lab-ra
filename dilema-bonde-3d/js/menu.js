import {PAPEIS,normalizar,salvarConfig,mudaRodada} from './configuracao.js?v=20261107-ra11';
export function criarMenu({pai=document.body,config,aplicar,aoAbrir=()=>{},aoFechar=()=>{},novaRodada,modo='pc'}){
  const host=document.createElement('div');host.className='menu-host';
  const opcoes=Object.entries(PAPEIS).map(([v,t])=>`<option value="${v}">${t}</option>`).join('');
  host.innerHTML=`<button id="menu" class="menu-botao" type="button" aria-haspopup="dialog" aria-expanded="false">Menu</button>
  <div class="menu-fundo" hidden><section class="menu-painel" role="dialog" aria-modal="true" aria-labelledby="menu-titulo" tabindex="-1">
  <header><h2 id="menu-titulo">Dilema do Bonde</h2><button type="button" id="fecharMenu" aria-label="Fechar menu">✕</button></header>
  <p class="menu-pausa">${modo==='nativo'?'Configure antes de abrir o visualizador do iPhone.':'A rodada fica pausada enquanto este menu está aberto.'}</p>
  <form id="configBonde">
  <details data-secao="rodada" open><summary>Cenários e personagens</summary>
    <label>Cenário<select name="modo"><option value="livre">Livre — configure os dois trilhos</option><option value="classico">Clássico — 3 pessoas e 1 pessoa</option></select></label>
    <div class="menu-grade"><fieldset><legend>Trilho principal</legend><label>Personagens<select name="principal">${opcoes}</select></label><label>Quantidade<input name="nPrincipal" type="number" min="1" max="5" step="1"></label></fieldset>
    <fieldset><legend>Ramal</legend><label>Personagens<select name="ramal">${opcoes}</select></label><label>Quantidade<input name="nRamal" type="number" min="0" max="5" step="1"></label></fieldset></div>
    <div class="menu-grade"><label data-web>Tempo de decisão (segundos)<input name="tempo" type="number" min="0" max="60"></label><label>Velocidade<select name="velocidade"><option value="6">Lenta</option><option value="12">Normal</option><option value="18">Rápida</option><option value="24">Muito rápida</option></select></label></div>
    <label class="check" data-web><input name="pressao" type="checkbox"> Pressão de tempo — 3 segundos</label>
    <label class="check" data-web><input name="loop" type="checkbox"> Continuar após a reflexão</label><p data-web class="menu-nota">Cada rodada termina com a reflexão. Você decide quando iniciar a próxima.</p>
  </details>
  <details data-secao="visual"><summary>Som, visual e qualidade</summary>
    <div data-web><label class="check"><input name="som" type="checkbox"> Sons</label><label>Volume<input name="volume" type="range" min="0" max="100"></label><label class="check"><input name="humor" type="checkbox"> Sons lúdicos</label>
    <label class="check"><input name="rotulos" type="checkbox"> Identificar os grupos nos trilhos</label><label class="check"><input name="movimentoReduzido" type="checkbox"> Reduzir movimento — mostrar o desfecho sem percurso animado</label></div>
    <label>Qualidade<select name="qualidade"><option value="auto">Automática</option><option value="economica">Econômica</option><option value="equilibrada">Equilibrada</option><option value="detalhada">Detalhada</option></select></label>
    <p class="menu-nota" id="notaQualidade">A qualidade escolhida será usada na próxima abertura. No modo automático, a resolução pode diminuir para manter a fluidez.</p>
  </details>
  </form>
  <details data-secao="maquete"><summary>Maquete e navegação</summary><div id="controlesMaquete"></div></details>
  <details data-secao="reflexao"><summary>Reflexão e resultado</summary><div id="resultadoBonde" aria-live="polite"><p>Jogue uma rodada e compare os efeitos da sua decisão.</p><p>Que responsabilidade existe ao agir? E ao manter o curso?</p></div><button id="novaRodada" type="button">Nova rodada</button></details>
  <details data-secao="ajuda"><summary>Como jogar e autoria</summary><p>Escolha quem está em cada trilho. Toque em ▶ para iniciar; toque novamente para pausar. Você pode mudar a decisão até o bonde passar pela agulha.</p><p>${modo==='pc'?'Arraste para girar; botão direito para mover; roda do mouse para aproximar. Use também os controles em Maquete e navegação.':'Depois de colocar a maquete, aproxime fisicamente o celular para observar os detalhes. Arraste para mover e use dois dedos para ampliar ou girar. Recolocar permite escolher outra superfície.'}</p><p>As placas junto à estação são atalhos para este menu.</p><p>Os indicadores éticos são ilustrativos: não são notas de acerto, avaliação psicológica ou medida validada. Discuta a justificativa, os vínculos e as consequências.</p><p>Prof. Dr. Mário César Nascimento · Ética Interativa · Dragon Games.</p></details>
  <p id="menuEstado" role="status"></p><footer><button id="aplicarMenu" type="button">Aplicar e preparar rodada</button><button id="retomarMenu" type="button">Voltar</button></footer>
  </section></div>`;
  pai.append(host);
  const $=s=>host.querySelector(s),form=$('form'),fundo=$('.menu-fundo'),painel=$('.menu-painel'),abrirBotao=$('#menu');
  let aberta=false,ocupada=false,origem=null;
  if(modo==='nativo'){
    document.body.classList.add('menu-na-entrada');
    $('[data-secao="visual"] summary').textContent='Qualidade';
    host.querySelectorAll('[data-web]').forEach(el=>el.hidden=true);
    $('[data-secao="maquete"]').hidden=true;$('[data-secao="reflexao"]').hidden=true;
    $('[data-secao="ajuda"]').innerHTML='<summary>Como jogar e autoria</summary><p>No visualizador do iPhone, toque nas placas Manter o curso, Desviar o bonde e Reiniciar. Ajuste tamanho e posição com os dedos.</p><p>O Menu, os sons, a contagem e a reflexão interativa estão disponíveis na opção RA com botões fixos na tela.</p><p>Prof. Dr. Mário César Nascimento · Ética Interativa · Dragon Games.</p>';
    $('#notaQualidade').textContent='A qualidade será aplicada ao preparar o arquivo para esta rodada.';
  }
  function preencher(){const c=config();for(const [k,v] of Object.entries(c)){const e=form.elements.namedItem(k);if(e)e.type==='checkbox'?e.checked=v:e.value=String(v);}bloquearClassico();atualizarAplicar();}
  function bloquearClassico(){const fixo=form.elements.modo.value==='classico';for(const k of ['principal','ramal','nPrincipal','nRamal'])form.elements[k].disabled=fixo;if(fixo){form.elements.principal.value=form.elements.ramal.value='desconhecidos';form.elements.nPrincipal.value='3';form.elements.nRamal.value='1';}}
  form.elements.modo.onchange=()=>{bloquearClassico();atualizarAplicar();};
  function atualizarAplicar(){$('#aplicarMenu').textContent=modo==='nativo'?'Preparar maquete':mudaRodada(config(),ler())?'Aplicar e preparar rodada':'Salvar ajustes';}
  form.oninput=atualizarAplicar;
  function ler(){const c={...config()};for(const e of form.elements)if(e.name)c[e.name]=e.type==='checkbox'?e.checked:e.value;return normalizar(c);}
  function fechar(){if(ocupada||!aberta)return;aberta=false;fundo.hidden=true;abrirBotao.setAttribute('aria-expanded','false');aoFechar();(origem?.isConnected?origem:abrirBotao).focus();}
  function abrir(secao){if(!aberta){origem=document.activeElement;preencher();aberta=true;fundo.hidden=false;abrirBotao.setAttribute('aria-expanded','true');aoAbrir();}
    if(secao){host.querySelectorAll('[data-secao]').forEach(el=>el.open=el.dataset.secao===secao);}
    $('#fecharMenu').focus();if(secao)$(`[data-secao="${secao}"]`)?.scrollIntoView({block:'nearest'});
  }
  abrirBotao.onclick=()=>abrir();$('#fecharMenu').onclick=fechar;$('#retomarMenu').onclick=fechar;
  fundo.onclick=e=>{if(e.target===fundo)fechar();};
  painel.onkeydown=e=>{
    if(e.key==='Escape'){e.preventDefault();fechar();}if(e.key!=='Tab')return;
    const foco=[...painel.querySelectorAll('button,input,select,summary,a[href]')].filter(el=>!el.disabled&&el.getClientRects().length);
    if(!foco.length)return;const primeiro=foco[0],ultimo=foco.at(-1);
    if(e.shiftKey&&document.activeElement===primeiro){e.preventDefault();ultimo.focus();}
    else if(!e.shiftKey&&document.activeElement===ultimo){e.preventDefault();primeiro.focus();}
  };
  async function executar(acao){if(ocupada)return;ocupada=true;$('#aplicarMenu').disabled=$('#novaRodada').disabled=true;$('#menuEstado').textContent='Preparando…';
    try{await acao();$('#menuEstado').textContent='Pronto.';ocupada=false;fechar();}
    catch(e){console.warn('[Bonde] Configuração:',e);$('#menuEstado').textContent='Não foi possível carregar os personagens. A rodada anterior foi mantida. Tente novamente.';}
    finally{ocupada=false;$('#aplicarMenu').disabled=$('#novaRodada').disabled=false;}
  }
  $('#aplicarMenu').onclick=()=>{if(form.reportValidity())executar(async()=>{const c=ler();await aplicar(c);salvarConfig(c);});};
  $('#novaRodada').onclick=()=>executar(()=>novaRodada?.());
  form.onsubmit=e=>{e.preventDefault();$('#aplicarMenu').click();};
  return {abrir,fechar,aberta:()=>aberta,host,controles:$('#controlesMaquete'),
    limparResultado(){$('#resultadoBonde').innerHTML='<p>Esta rodada ainda não tem resultado.</p><p>Que responsabilidade existe ao agir? E ao manter o curso?</p>';},
    resultado(r){const el=$('#resultadoBonde');el.replaceChildren();
      const p=document.createElement('p');p.textContent=`${r.rota==='ramal'?'O bonde foi desviado.':'O curso foi mantido.'} Pessoas atingidas: ${r.atingidos}. Pessoas poupadas: ${r.poupados}.`;el.append(p);
      for(const i of r.indicadores){const linha=document.createElement('label');linha.className='indicador';linha.textContent=`${i.nome}: ${i.valor}/100`;const meter=document.createElement('meter');meter.min=0;meter.max=100;meter.value=i.valor;linha.append(meter);el.append(linha);}
      const nota=document.createElement('p');nota.textContent='Indicadores ilustrativos, sem resposta moral automática. O que fundamentou sua decisão? O que mudaria ao trocar os personagens?';el.append(nota);
      $('#novaRodada').textContent=config().loop?'Continuar — próxima rodada':'Nova rodada';abrir('reflexao');
    },remover(){host.remove();}
  };
}
