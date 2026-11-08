/* Entrada nativa leve: prepara sob demanda; o segundo toque abre o arquivo pronto no gesto do Safari. */
(async function () {
  'use strict';
  const {lerConfig,salvarConfig,novaEntrada,registrarEntrada,sortear}=await import('../js/configuracao.js?v=20261107-ra12');
  const $ = id => document.getElementById(id);
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const params = new URLSearchParams(location.search);
  const ensaioNativo = params.has('quicklook');
  const standalone = navigator.standalone === true || window.matchMedia?.('(display-mode: standalone)').matches === true
    || window.matchMedia?.('(display-mode: fullscreen)').matches === true;
  const interativo = params.get('modo') === 'interativo' || (standalone && params.get('modo') !== 'nativo');
  $('instalarRA').hidden = !ios || standalone;
  $('instalarRA').open = ios && interativo && !standalone;
  const link = $('linkAR'), status = $('statusAR'), trocar = $('trocarAR');
  let suporta = false;
  try { suporta = link.relList.supports('ar'); } catch {}
  if ((ios || suporta || ensaioNativo) && !interativo) {
    // Nunca retirar rel="ar": um resultado negativo não deve transformar RA em navegação/download.
    trocar.hidden = false;
    if (ios && !suporta) status.textContent = 'Abra esta página no Safari para usar a realidade aumentada. Em navegadores internos de aplicativos, a RA pode não abrir.';
    let preparando = false, pronta = false, url = null;
    $('instrucaoAR').textContent='Toque na maquete para preparar uma nova combinação.';
    $('paresAR').textContent='Os personagens e as quantidades variam a cada entrada.';
    link.addEventListener('click', event => {
      if (preparando) { event.preventDefault(); return; }
      if(!pronta){event.preventDefault();gerar(novaEntrada(lerConfig(),configNativa)).catch(()=>{});return;}
      // A próxima abertura prepara outra combinação; este toque continua nativo.
      pronta=false;$('instrucaoAR').textContent='Na próxima entrada, toque para preparar outra combinação.';
      // Como na Célula Viva, sair pelo documento superior quando há iframe de mesma origem.
      let doc;
      try { if (window.top !== window && window.top.document) doc = window.top.document; } catch {}
      if (!doc) return;
      event.preventDefault();
      const a = doc.createElement('a'); a.rel = 'ar'; a.href = link.href;
      if (link.hasAttribute('download')) a.setAttribute('download', link.getAttribute('download'));
      a.appendChild(doc.createElement('img')); a.hidden = true; doc.body.appendChild(a);
      a.click(); setTimeout(() => a.remove(), 4000);
    });
    let configNativa=lerConfig();
    const gerar=async proximaConfig=> {
      if (preparando) throw new Error('Aguarde a preparação em andamento.');
      preparando = true; trocar.disabled = true; trocar.textContent = 'Preparando personagens…';
      link.setAttribute('aria-disabled', 'true');
      status.textContent = 'Preparando a nova rodada. Aguarde antes de abrir a RA.';
      try {
        const { prepararPersonagens } = await import('./personagens.js?v=20261108-ra14');
        const proxima = await prepararPersonagens(proximaConfig);
        configNativa=registrarEntrada(proximaConfig);pronta=true;
        $('instrucaoAR').textContent='Pronto. Toque na maquete para abrir em realidade aumentada.';
        const anterior = url; url = proxima.url;
        link.href = url + '#allowsContentScaling=1'; link.setAttribute('download', 'dilema-bonde.usdz');
        $('paresAR').textContent = proxima.descricao;
        status.textContent = 'Pronto. Toque na maquete; se aparecer Objeto, selecione AR no alto da tela.';
        if (anterior) URL.revokeObjectURL(anterior);
      } catch (error) {
        console.warn('[Bonde RA] Preparação indisponível:', error);
        // Mantém arquivo E descrição da última rodada válida, inclusive após falha de rede.
        pronta=!!url;
        status.textContent = url?'Não foi possível trocar os personagens. A rodada indicada abaixo continua disponível; tente novamente quando a conexão melhorar.':'Não foi possível preparar a maquete. Toque novamente para tentar com uma conexão melhor.';
        throw error;
      } finally {
        preparando = false; trocar.disabled = false; trocar.textContent = 'Trocar personagens';
        link.removeAttribute('aria-disabled');
      }
    };
    trocar.onclick=()=>gerar(sortear(configNativa,{quantidades:true})).catch(()=>{});
    const {criarMenu}=await import('../js/menu.js?v=20261107-ra12');
    criarMenu({modo:'nativo',config:()=>configNativa,aplicar:gerar});
    addEventListener('pagehide', e => { if (!e.persisted && url) URL.revokeObjectURL(url); });
    return;
  }
  $('nativo').hidden = true; $('web').hidden = false;
  $('voltarNativo').hidden = !(ios || suporta || ensaioNativo);
  const botao = $('comecar'), estado = $('estadoEntrada');
  let app = null;
  const qualidade=$('qualidadeEntrada');qualidade.value=lerConfig().qualidade;
  qualidade.onchange=()=>{salvarConfig({...lerConfig(),qualidade:qualidade.value});if(app)location.reload();};
  botao.onclick = async () => {
    if (botao.disabled) return;
    botao.disabled = true;
    if(app&&app.qualidade!==lerConfig().qualidade){location.reload();return;}
    if (!app || app.precisaNova?.()) {
      estado.textContent = 'Preparando a maquete…';
      try {
        const config=novaEntrada({...lerConfig(),qualidade:qualidade.value},app?.configAtual?.());
        if(app)await app.prepararNova(config);
        else {const modulo=await import('./web.js?v=20261108-ra14');app=await modulo.preparar({config,informar:t=>{estado.textContent=t;}});}
        registrarEntrada(config);
        qualidade.disabled=true;botao.textContent = 'Abrir em realidade aumentada';
        estado.textContent = 'Pronto. Toque para abrir a câmera e aponte para a mesa ou o chão.';
      } catch (error) {
        console.warn('[Bonde RA] Preparação indisponível:', error);
        estado.textContent = 'Não foi possível preparar a RA. Confira a conexão e o suporte a 3D do navegador, ou use Ver sem RA. Você pode tentar novamente.';
      } finally { botao.disabled = false; }
      return;
    }
    try {
      // Já preparado: entrar() é chamado diretamente no gesto, antes de qualquer await.
      if(app.qualidade!==lerConfig().qualidade){location.reload();return;}
      await app.entrar();
    } catch (error) {
      estado.textContent = error.name === 'NotAllowedError'
        ? 'A câmera ou os sensores não foram autorizados. Permita o acesso nas configurações do navegador e tente novamente.'
        : 'A RA não abriu. Tente novamente ou continue em Ver sem RA.';
      console.warn('[Bonde RA] Abertura indisponível:', error);
    } finally { botao.disabled = false; }
  };
})();
