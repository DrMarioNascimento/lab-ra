/* MOSAICO — A Manhã do Carro-Forte · núcleo das atividades sensoriais.

   As três páginas compartilham: ler o lote que a Mesa entregou pela URL,
   mostrar o quanto já foi alcançado, contar o tempo da mesa e devolver a
   colheita. O que cada uma tem de próprio é o gesto — e só isso.

   O QUE MUDOU EM 04/09/2026, E POR QUÊ
   ------------------------------------
   1. O BOTÃO "CONCLUIR" SAIU. Ele ficava sempre liberado, no fim da página, e
      era a única saída: encostar nele antes de ver a primeira faixa do vidro
      encerrava a atividade e perdia o lote inteiro. Foi exatamente o que
      aconteceu com Mario — "não deu nem tempo de ver". Concluir cedo nunca foi
      decisão de jogador: a atividade é da mesa e acaba quando o tempo da mesa
      acaba, ou quando tudo foi alcançado.

   2. E DEPOIS DELE NÃO HAVIA VOLTA. O botão desabilitava com "volte para a
      Mesa" e a página ficava ali, sem link, sem nada — a aba tinha sido aberta
      por <a target="_blank"> e não dava para fechar por script. Agora a Mesa
      abre esta página com window.open(), então window.close() funciona, e há um
      botão explícito de voltar com instrução escrita para quando o navegador
      recusar fechar.

   3. A COLHEITA SOBE FRAGMENTO A FRAGMENTO. Antes ela viajava inteira no
      aviso de conclusão; com o fim vindo do relógio, uma aba encerrada de fora
      nunca mandaria nada e três fragmentos alcançados virariam zero.

   E uma regra que não mudou: o texto do fragmento não existe no DOM antes de
   ser alcançado. Antes o Vidro Embaçado escrevia os quatro fatos no
   carregamento e cobria com um CSS embaçado — quem abrisse o inspetor lia tudo
   sem passar o dedo. */
(function () {
  const par = new URLSearchParams(location.search);
  const banco = window.MOSAICO_FRAGMENTOS || {};
  const partida = par.get('partida') || 'peso';
  /* O instante do fim vem da Mesa, não daqui: quando há sala, ele é o mesmo
     para todos os aparelhos. Sem `fim` a página foi aberta solta — para
     conferir a atividade — e não há relógio nenhum. */
  const fimMs = Number(par.get('fim') || 0) || 0;

  const canal = (() => { try { return new BroadcastChannel('mosaico-carro-forte') } catch (e) { return null } })();

  function itens(sensor) {
    const pedidos = (par.get('itens') || '').split(',').map((s) => s.trim()).filter((c) => banco[c]);
    if (pedidos.length) return pedidos;
    /* Aberta fora da Mesa — para conferir a atividade, ou por link solto. Sem
       lote, a página se serve de alguns fragmentos para ter o que mostrar; a
       colheita não chega a mesa nenhuma. */
    return Object.keys(banco).slice(sensor === 'vidro' ? 12 : 0, (sensor === 'vidro' ? 12 : 0) + 4);
  }

  const titulo = (cod) => banco[cod]?.t || 'Fragmento';
  const texto = (cod) => banco[cod]?.d || '';

  /* ── Estado da página ─────────────────────────────────────────────────── */
  let contexto = null;      // {sensor, todos, achados}
  let encerrada = false;
  let enviados = new Set();
  let relogio = null;

  function avisar(dado) {
    const aviso = { fonte: 'mosaico-carro-forte', partida, ...dado };
    /* Duas vias: o BroadcastChannel alcança qualquer aba da mesma origem, e o
       opener cobre quem não tem BroadcastChannel. Marcar é idempotente. */
    try { canal && canal.postMessage(aviso) } catch (e) {}
    try { opener && opener.postMessage(aviso, location.origin) } catch (e) {}
  }

  /* Cada fragmento alcançado sobe na hora. A Mesa filtra pelo lote que ela
     mesma entregou, então isto não é uma porta para injetar fragmento. */
  function subirNovos(forcar) {
    if (!contexto || (encerrada && !forcar)) return;
    for (const cod of contexto.todos) {
      if (!contexto.achados.has(cod) || enviados.has(cod)) continue;
      enviados.add(cod);
      avisar({ tipo: 'sensor-fragmento', sensor: contexto.sensor, codigo: cod });
    }
  }

  function marcar(achados, todos) {
    const conta = document.getElementById('conta');
    if (conta) conta.textContent = `${achados.size} de ${todos.length}`;
    const lista = document.getElementById('lista');
    if (lista)
      lista.innerHTML = todos
        .filter((c) => achados.has(c))
        .map((c) => `<div class="achado"><b>${titulo(c)}</b><span>${texto(c)}</span></div>`)
        .join('');
    subirNovos();
    if (contexto && !encerrada && achados.size === todos.length) fechar('completa');
  }

  /* ── O relógio da mesa ────────────────────────────────────────────────── */
  function pintarRelogio() {
    const el = document.getElementById('cronoValor');
    if (!el) return;
    const r = Math.max(0, Math.ceil((fimMs - Date.now()) / 1000));
    el.textContent = `${String(Math.floor(r / 60)).padStart(2, '0')}:${String(r % 60).padStart(2, '0')}`;
    el.classList.toggle('urgente', r <= 10);
  }
  function montarRelogio() {
    if (!fimMs) return;
    const barra = document.createElement('div');
    barra.className = 'cronometro';
    barra.innerHTML = '<span>TEMPO DA MESA</span><b id="cronoValor">--:--</b>';
    const cabeca = document.querySelector('header');
    if (cabeca) cabeca.insertAdjacentElement('afterend', barra);
    else document.body.prepend(barra);
    pintarRelogio();
    relogio = setInterval(() => {
      if (encerrada) return clearInterval(relogio);
      if (Date.now() >= fimMs) fechar('tempo');
      else pintarRelogio();
    }, 250);
  }

  /* ── O fim, e a volta ─────────────────────────────────────────────────── */
  const RECADOS = {
    tempo: ['Tempo encerrado', 'O que ficou no escuro não entra no dossiê por nenhuma outra porta.'],
    completa: ['Tudo alcançado ✓', 'Os quatro fragmentos foram para o dossiê da mesa.'],
    mesa: ['A mesa encerrou esta atividade', 'O que você alcançou até aqui já subiu.'],
    'sem-precisao': ['Sem precisão', 'O tempo suave esgotou — o que você alcançou já subiu; a sala não fica presa.'],
  };
  const SOFT_MS = 50000;
  function fechar(motivo) {
    if (encerrada) return;
    encerrada = true;
    clearInterval(relogio);
    /* Sobe o que faltar antes de travar: quem alcançou no último segundo não
       pode perder o fragmento por causa da ordem das linhas. */
    subirNovos(true);
    /* O relógio sai de cena. Parado no segundo em que a atividade fechou, ele
       fica dizendo que ainda há tempo — e o que sobra na tela é justamente o
       que não vale mais. */
    document.querySelector('.cronometro')?.remove();
    const colheita = contexto ? contexto.todos.filter((c) => contexto.achados.has(c)) : [];
    avisar({ tipo: 'sensor-concluido', sensor: contexto?.sensor, colheita });
    document.body.classList.add('encerrada');

    const [manchete, explicacao] = RECADOS[motivo] || RECADOS.mesa;
    let fim = document.getElementById('fimDaAtividade');
    if (!fim) {
      fim = document.createElement('div');
      fim.id = 'fimDaAtividade';
      fim.className = 'fim';
      (document.querySelector('main') || document.body).appendChild(fim);
    }
    fim.innerHTML = `<b>${manchete}</b><span>${explicacao}</span><p id="fimNota"></p>`;

    const botao = document.getElementById('finish');
    if (botao) {
      botao.hidden = false;
      botao.disabled = false;
      botao.textContent = '← Voltar à Mesa';
      botao.onclick = voltar;
      fim.appendChild(botao);
    }
  }
  /* A Mesa abre esta página com window.open(), e é isso que dá a ela o direito
     de se fechar. Quando o navegador recusa — aba movida para outra janela,
     página aberta direto pelo endereço —, a instrução aparece escrita em vez
     de a pessoa ficar presa numa tela sem saída, que foi o defeito relatado. */
  function voltar() {
    try { opener && !opener.closed && opener.focus() } catch (e) {}
    try { window.close() } catch (e) {}
    setTimeout(() => {
      const nota = document.getElementById('fimNota');
      if (nota && !window.closed)
        nota.textContent = 'Este navegador não deixa a página se fechar sozinha. Volte para a aba da Mesa — ela já recebeu tudo.';
    }, 400);
  }

  function iniciar({ sensor, itens: todos, achados }) {
    contexto = { sensor, todos, achados };
    const kicker = document.getElementById('kicker');
    if (kicker) kicker.textContent = `MOSAICO · ${partida.toUpperCase()}`;
    const botao = document.getElementById('finish');
    /* Ele nasce escondido: só volta a existir como saída, no fim. */
    if (botao) { botao.hidden = true; botao.onclick = null; }
    marcar(achados, todos);
    montarRelogio();
    /* Soft 50s só sem relógio da mesa (ensaio/aba solta). Com fimMs a mesa manda. */
    if (!fimMs) setTimeout(() => { if (!encerrada) fechar('sem-precisao'); }, SOFT_MS);
  }

  /* A Mesa é quem manda encerrar: o relógio dela é o que vale, e esta página
     pode ter perdido a contagem (aba em segundo plano, aparelho dormindo). */
  function daMesa(dado) {
    if (!dado || dado.fonte !== 'mosaico-carro-forte') return;
    if (dado.tipo !== 'sensor-encerrado') return;
    if (dado.partida !== partida) return;
    if (contexto && dado.sensor !== contexto.sensor) return;
    fechar('mesa');
  }
  try { canal && (canal.onmessage = (e) => daMesa(e.data)) } catch (e) {}
  window.addEventListener('message', (e) => { if (e.origin === location.origin) daMesa(e.data) });

  window.MosaicoAtividade = { itens, titulo, texto, marcar, iniciar, partida };
})();
