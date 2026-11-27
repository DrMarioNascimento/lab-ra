// Limiar Ético · Um dia — interface.
import { SINTESE, MOTIVOS, VERSAO, CONDICOES, BASE_ESTRESSE, NOME_NIVEL } from './dados.js?v=2.3';
import { DIAS, ORDEM_DIAS } from './dias.js?v=2.3';
import { GLOSSARIO } from './glossario.js?v=2.3';
import { gerarRetorno } from './retorno.js?v=2.3';
import { mapaDoDia } from './programa.js?v=2.3';
import { MANUAL } from './manual.js?v=2.3';
import { abrirSalvar, blocosDe } from './salvar.js?v=2.3';
import { agregar, enviosDoDia, MIN_TURMA } from './estatistica.js?v=2.3';
import { conectar, gerarCodigo, limparCodigo, novoId } from './sala.js?v=2.3';
import { novoEstado, sortearNiveis, cenaAtual, totalCenas, janelaInfo, decidir, terminou, resumo } from './motor.js?v=2.3';

import { PARES, EXIGENCIAS, prepararRodadas, cruzarRodadas } from './retomadas.js?v=2.3';

const app = document.querySelector('#app');
const topo = document.querySelector('#topo');

let dia = 'empresa';       // dia escolhido na entrada
const D = () => DIAS[dia];
let est = null;
let retomadas = null;
let visao = null;          // dados da cena em exibição
let rev = null;            // dados da revelação
const contestacoes = {};   // índice da decisão -> motivo escolhido (só em memória)

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const embaralhar = n => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function foco() { app.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }

/* ---------- O céu acompanha a hora ---------- */
function horaDecimal(hora) { const [h, m] = hora.split('h').map(Number); return h + (m || 0) / 60; }
function faseDe(hora) {
  const h = horaDecimal(hora);
  return h < 8 ? 'alvorada' : h < 12 ? 'manha' : h < 16 ? 'tarde' : h < 19 ? 'poente' : 'noite';
}
function ceu(fase) { document.body.dataset.fase = fase; }
const PERIODO = { alvorada: 'Manhã cedo', manha: 'Manhã', tarde: 'Tarde', poente: 'Fim de tarde', noite: 'Noite' };

// O arco do dia na abertura: os momentos que virão, do amanhecer à noite.
function arcoCapa() {
  const P0 = [16, 70], P1 = [160, -34], P2 = [304, 70];
  const em = t => [0, 1].map(k => (1 - t) ** 2 * P0[k] + 2 * (1 - t) * t * P1[k] + t ** 2 * P2[k]);
  const horas = D().CENAS.map(c => c.hora).concat(D().completo ? ['23h00'] : []);
  const pontos = horas.map(h => em(Math.min(1, Math.max(0, (horaDecimal(h) - 6) / 18))));
  const [sx, sy] = pontos[0];
  return `<svg class="arco-capa" viewBox="0 0 320 96" aria-hidden="true">
    <line class="horizonte" x1="6" y1="72" x2="314" y2="72"/>
    <path class="trilho" d="M${P0} Q${P1} ${P2}"/>
    ${pontos.slice(1).map(([x, y]) => `<circle class="momento" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5"/>`).join('')}
    <circle class="halo" cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="13"/><circle class="sol" cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="7.5"/>
    <text x="16" y="90">manhã</text><text x="160" y="90" text-anchor="middle">tarde</text><text x="304" y="90" text-anchor="end">noite</text>
  </svg>`;
}

/* ---------- Escolha do dia ---------- */
function telaEscolhaDia() {
  ceu('alvorada');
  topo.hidden = true;
  topo.innerHTML = '';
  app.innerHTML = `
    <div class="estreita">
      <section class="cartao capa-dia entra">
        <p class="rotulo">Limiar Ético</p>
        <h1>Qual dia você quer viver?</h1>
        <p>Cada dia tem várias situações, hora a hora. Escolha com sinceridade o que você faria em cada uma. Ao final, você recebe um retorno em conceitos de ética.</p>
        <div class="opcoes">
          ${ORDEM_DIAS.map((k, n) => `<button class="btn entra" style="--n:${n + 1}" data-acao="dia" data-dia="${k}"><strong>${esc(DIAS[k].nome)}</strong><br><span class="suave pequeno">${esc(DIAS[k].resumo)}</span></button>`).join('')}
        </div>
        ${sala ? `<p class="suave pequeno sala-aviso">Você está na sala <strong>${esc(sala.codigo)}</strong> como ${esc(sala.avatar)} ${esc(sala.nome)}. <button class="link" data-acao="sair-sala">Sair da sala</button></p>`
               : `<div class="acoes"><button class="btn secundario" data-acao="tela-sala">Entrar numa sala</button><button class="btn professor" data-acao="tela-prof" title="Abre ou retoma uma sala para a turma"><span class="entrada-prof"><img class="cadeado" src="icones/cadeado-fechado.png" width="40" height="40" alt="" aria-hidden="true">Abrir sala</span><small>Só o Professor tem a chave</small></button></div>`}
      </section>
      <p class="versao entra" style="--n:4">Versão ${esc(VERSAO)}</p>
    </div>`;
  foco();
}

/* ---------- Abertura ---------- */
function telaAbertura() {
  ceu('alvorada');
  topo.hidden = true;
  topo.innerHTML = '';
  app.innerHTML = `
    <div class="estreita">
      <section class="cartao capa-dia entra">
        <p class="rotulo">Limiar Ético</p>
        ${arcoCapa()}
        <h1>${esc(D().ABERTURA.titulo)}</h1>
        ${D().ABERTURA.texto.map(p => `<p>${esc(p)}</p>`).join('')}
        <p>Ao final, você poderá reconhecer padrões nas suas escolhas, comparar sua justificativa com as leituras do percurso e aplicar um conceito em outra situação. Se alguma situação pesar para você, pode só observar ou conversar com quem conduz a atividade. Reserve cerca de 30 minutos para a atividade. As respostas ficam nesta página e desaparecem ao fechá-la.</p>
        <div class="acoes"><button class="btn principal" data-acao="comecar">Começar o dia</button>${sala?.diaFixo ? '' : '<button class="btn secundario" data-acao="escolher-dia">Escolher outro dia</button>'}</div>
      </section>
      <p class="versao entra" style="--n:2">Versão ${esc(VERSAO)}</p>
    </div>`;
  foco();
}

/* ---------- O dia ---------- */
// O cabeçalho do dia é montado uma vez e depois só atualizado, para o astro deslizar no arco.
function barraDoDia(cena) {
  const total = totalCenas(est);
  topo.hidden = false;
  if (!topo.querySelector('.topo-dia')) {
    topo.innerHTML = `<div class="topo-dia">
        <div class="topo-linha">
          <span class="hora" aria-label="Hora do dia"></span>
          <div class="arco-caixa" aria-hidden="true">
            <svg class="arco" viewBox="0 0 200 40" preserveAspectRatio="none">
              <line class="horizonte" x1="2" y1="37" x2="198" y2="37"/>
              <path class="trilho" d="M8,36 Q100,-28 192,36"/>
              <path class="feito" d="M8,36"/>
            </svg>
            <span class="astro"></span>
          </div>
        </div>
        <div class="passos" role="img"></div>
      </div>`;
  }
  topo.querySelector('.hora').textContent = cena.hora;
  const passos = topo.querySelector('.passos');
  passos.setAttribute('aria-label', `Momento ${est.pos + 1} de ${total}`);
  passos.innerHTML = Array.from({ length: total }, (_, i) => `<span class="${i < est.pos ? 'feito' : i === est.pos ? 'agora' : ''}"></span>`).join('');
  // Posição no arco (curva quadrática de 8,36 a 192,36 com controle em 100,-28); o trecho percorrido é a mesma curva cortada em t.
  const t = Math.min(1, Math.max(0, (horaDecimal(cena.hora) - 6) / 18));
  const P0 = [8, 36], P1 = [100, -28], P2 = [192, 36];
  const mix = (a, b) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const q = mix(P0, P1), fim = mix(q, mix(P1, P2));
  const astro = topo.querySelector('.astro');
  astro.style.left = `${(fim[0] / 200) * 100}%`;
  astro.style.top = `${(fim[1] / 40) * 100}%`;
  topo.querySelector('.feito').setAttribute('d', `M${P0} Q${q.map(v => v.toFixed(2))} ${fim.map(v => v.toFixed(2))}`);
}

function telaCena() {
  sincronizar();
  const cena = cenaAtual(est);
  const janela = janelaInfo(est, cena);
  visao = { cena, ordem: embaralhar(cena.opcoes.length), inicio: performance.now(), abriuInfo: false, infoDisponivel: janela > 0, relogio: null };
  ceu(faseDe(cena.hora));
  barraDoDia(cena);
  const contado = cena.info && Number.isFinite(janela) && janela > 0;
  const botaoInfo = cena.info
    ? (janela > 0
        ? `<div id="zona-info" style="margin-top:18px"><button class="btn secundario${contado ? ' com-tempo' : ''}" ${contado ? `style="--janela:${janela}s"` : ''} data-acao="info">${esc(cena.info.rotulo)}</button></div>`
        : `<p class="sem-tempo" id="zona-info">Não há tempo para conferir mais nada agora.</p>`)
    : '';
  app.innerHTML = `
    <div class="cena-grade">
      <section class="cartao pagina entra">
        <span class="aba-hora">${PERIODO[faseDe(cena.hora)]}</span>
        <h2>${esc(cena.titulo)}</h2>
        <p class="cena-texto">${esc(cena.texto)}</p>
        ${botaoInfo}
      </section>
      <section class="lado" aria-label="O que você faz?">
        <p class="etiqueta entra" style="--n:1">O que você faz?</p>
        <div class="opcoes">
          ${visao.ordem.map((i, k) => `<button class="btn entra" style="--n:${k + 2}" data-acao="escolher" data-i="${i}">${esc(cena.opcoes[i].t)}</button>`).join('')}
        </div>
      </section>
    </div>`;
  if (contado) {
    visao.relogio = setTimeout(() => {
      const zona = document.querySelector('#zona-info');
      if (zona && !visao.abriuInfo) {
        visao.infoDisponivel = false;
        zona.outerHTML = `<p class="sem-tempo" id="zona-info">Não há mais tempo para conferir isso agora.</p>`;
      }
    }, janela * 1000);
  }
  foco();
}

function abrirInfo() {
  visao.abriuInfo = true;
  const zona = document.querySelector('#zona-info');
  zona.outerHTML = `<div class="info nova" id="zona-info"><p>${esc(visao.cena.info.texto)}</p></div>`;
}

function escolher(i) {
  clearTimeout(visao.relogio);
  const cena = visao.cena;
  const texto = cena.opcoes[i].t;
  const desfecho = decidir(est, i, {
    tempoMs: performance.now() - visao.inicio,
    abriuInfo: visao.abriuInfo,
    infoDisponivel: visao.infoDisponivel
  });
  const fim = terminou(est);
  app.innerHTML = `
    <div class="estreita">
      <section class="cartao pagina entra">
        <span class="aba-hora">${PERIODO[faseDe(cena.hora)]}</span>
        <p class="rotulo">${esc(cena.titulo)}</p>
        <p class="escolhido">${esc(texto)}</p>
        <p class="desfecho">${esc(desfecho)}</p>
        <div class="acoes"><button class="btn principal" data-acao="${fim ? 'revelar' : 'seguir'}">Continuar</button></div>
      </section>
    </div>`;
  foco();
}

import { graficoLinhas, graficoCertoDesfecho, graficoMargem, graficoEscala, COR, NOME, COR_CERTO, COR_DESFECHO } from './graficos.js?v=2.3';

/* ---------- Revelação ---------- */
function sinaisDe(p) {
  const s = [];
  if (p.tinhaInfo) s.push(p.abriuInfo ? 'Conferiu a informação antes de decidir' : 'Decidiu sem conferir a informação');
  if (p.tempoS != null) s.push(`Decidiu em ${p.tempoS} s`);
  return s.map(t => `<span class="sinal">${esc(t)}</span>`).join('');
}

function condicoesDe(p) {
  const nivel = p.nivel ? `<span class="sinal nivel-${p.nivel}">Situação de ${esc(NOME_NIVEL[p.nivel])}</span>` : '';
  return nivel + (p.cond || []).map(k => `<span class="sinal cond">${esc(CONDICOES[k].nome)}</span>`).join('');
}

function blocoPressao(r) {
  const total = r.pontos.length;
  return `<div class="bloco-grafico pressao">
        <h3>O que pressionava o seu dia</h3>
        <p class="sub">Condições que a história colocou em cada momento. Descrevem a situação, não você.</p>
        <ul class="limpa">${r.contextos.map(c => `<li><strong>${esc(c.nome)}</strong> · ${c.cenas.length} de ${total} momentos<br><span class="suave pequeno">${esc(c.texto)}</span>
          <span class="barra-pressao" aria-hidden="true"><i style="width:${Math.round(100 * c.cenas.length / total)}%"></i></span></li>`).join('')}</ul>
      </div>`;
}

function cartaoDetalhe(p, E) {
  return `<section class="cartao detalhe ${E}" style="--n:2" aria-live="polite">
      <p class="rotulo">Decisão ${p.n} · ${esc(p.hora)}</p>
      <h3>${esc(p.titulo)}</h3>
      <p class="escolhido">${esc(p.escolha)}</p>
      <p class="car">Uma leitura possível: ${esc(p.caracteristica)}</p>
      <div class="sinais">${sinaisDe(p)}${condicoesDe(p)}</div>
    </section>`;
}

function abaCurvas(E) {
  const r = rev.dados, sel = rev.sel;
  return `
    <div class="revela-topo">
      <section class="cartao painel ${E}" style="--n:1">
        <div class="bloco-grafico">
          <h3>Razão, emoção e impulso</h3>
          <p class="sub">Pesos atribuídos às alternativas na autoria do percurso. Selecione um ponto para rever a decisão.</p>
          <div class="legenda">${['razao', 'emocao', 'impulso'].map(s => `<span><i style="background:${COR[s]}"></i>${NOME[s]}</span>`).join('')}</div>
          ${graficoLinhas(r.pontos, sel)}
        </div>
      </section>
      ${cartaoDetalhe(r.pontos[sel], E)}
    </div>
    <section class="cartao painel ${E}" style="--n:3">
      <div class="duas">
        <div class="bloco-grafico">
          <h3>O certo ou o desfecho</h3>
          <p class="sub">Acima, aproximação com dever ou princípio. Abaixo, com a consideração das consequências.</p>
          ${graficoCertoDesfecho(r.pontos, sel)}
        </div>
        <div class="bloco-grafico">
          <h3>Margem de escolha</h3>
          <p class="sub">Quanto cada momento deixava você escolher. Barra baixa: pouca liberdade real.</p>
          ${graficoMargem(r.pontos, sel)}
        </div>
      </div>
      <div class="bloco-grafico">
        <h3>As lentes do seu dia</h3>
        <p class="sub">Como as ações escolhidas se aproximam das cinco lentes éticas, segundo os critérios de autoria.</p>
        ${graficoEscala(r.escala)}
      </div>
      ${blocoPressao(r)}
    </section>
    <section class="cartao liso ${E}" style="--n:4">
      <h3>Como o dia terminou</h3>
      ${r.metas
        ? `<ul class="limpa">
        <li>${esc(r.metas.evento)}</li>
        <li>${esc(r.metas.trabalho)}</li>
        ${r.metas.familia ? `<li>${esc(r.metas.familia)}</li>` : ''}
      </ul>`
        : `<p>${esc(D().FECHAMENTO)}</p>`}
    </section>`;
}

function abaDecisoes(E) {
  const r = rev.dados;
  return `<div class="estreita"><section class="cartao ${E}" style="--n:1">
      ${r.pontos.map((p, i) => {
        const minha = contestacoes[i];
        return `<article class="decisao">
          <p class="rotulo">Decisão ${p.n} · ${esc(p.hora)}</p>
          <h3>${esc(p.titulo)}</h3>
          <p class="escolhido">${esc(p.escolha)}</p>
          <p>Uma leitura possível: ${esc(p.caracteristica)}</p>
          <div class="sinais">${sinaisDe(p)}${condicoesDe(p)}</div>
          <p class="desfecho">${esc(p.desfecho)}</p>
          <div class="conceito"><strong>${esc(p.conceito.titulo)}</strong><p>${esc(p.conceito.texto)}</p></div>
          ${rev.abertas[i]
            ? `<div class="chips" role="group" aria-label="Qual foi o seu motivo?">${MOTIVOS.map((m, k) => `<button class="chip" data-acao="motivo" data-i="${i}" data-k="${k}" aria-pressed="${minha === k}">${esc(m)}</button>`).join('')}</div>`
            : `<div class="acoes"><button class="btn secundario" data-acao="contestar" data-i="${i}">Registrar o que pesou</button></div>`}
          ${minha != null ? `<p class="sua-leitura">Sua leitura: ${esc(MOTIVOS[minha])}.</p>` : ''}
        </article>`;
      }).join('')}
    </section></div>`;
}

function telaRetomadas() {
  const { rodada, pos, rodadas, consultou } = retomadas;
  const caso = rodadas[rodada][pos];
  const { forma } = caso;
  const opcoes = caso.opcoes;
  topo.hidden = true;
  app.innerHTML = `
    <div class="cena-grade">
      <section class="cartao pagina entra">
        <h2>${esc(forma.titulo)}</h2>
        <p class="cena-texto">${esc(forma.texto)}${caso.nivel >= 1 ? ' ' + esc(forma.urgencia) : ''}${caso.nivel === 2 ? ' ' + esc(caso.acrescimo) : ''}</p>
        ${consultou
          ? `<div class="info nova" tabindex="-1" id="fato-retomada"><p>${esc(forma.fato)}</p></div>`
          : `<button class="btn secundario" data-acao="consultar-retomada">${esc(forma.rotulo)}</button>`}
      </section>
      <section class="lado" aria-label="O que você faz?">
        <p class="etiqueta entra">O que você faz?</p>
        <div class="opcoes">${caso.ordem.map(i => `<button class="btn entra" data-acao="responder-retomada" data-i="${i}">${esc(opcoes[i])}</button>`).join('')}</div>
      </section>
    </div>`;
}

function apresentarRetomada() {
  telaRetomadas();
  foco();
}

function responderRetomada(escolha) {
  const { rodada, pos, rodadas, consultou, registros } = retomadas;
  registros[rodada].push({ ...rodadas[rodada][pos], escolha, consultou });
  retomadas.consultou = false;
  retomadas.pos++;
  if (retomadas.pos < rodadas[rodada].length) {
    apresentarRetomada();
  } else if (rodada < 2) {
    telaCena();
  } else {
    rev = { dados: resumo(est), aba: 'curvas', sel: 0, abertas: {}, respostaAplicacao: '', anima: true, estreia: true };
    telaRevelacao();
    foco();
  }
}

function relatorioRepeticao(E) {
  const pares = cruzarRodadas(retomadas.registros[0], retomadas.registros[2]);
  const grupos = EXIGENCIAS.map((titulo, nivel) => [titulo, pares.filter(p => p.nivel === nivel)]);
  return `<section class="cartao ${E}" style="--n:2">
    <h3>O que se repetiu nas suas decisões</h3>
    <p>Antes e depois do dia, você respondeu a situações diferentes com conflitos semelhantes. Em cada par, o nível de exigência foi o mesmo nas duas situações. Agora você pode ver onde seu modo de agir ou de buscar informação se repetiu e interpretar suas escolhas pelos conceitos de ética.</p>
    <div class="par">${grupos.map(([titulo, itens]) => `<div>
      <h4>${titulo}</h4>
      <p>Consulta em ${itens.flatMap(p => [p.antes, p.depois]).filter(r => r.consultou).length} de ${itens.length * 2} decisões.</p>
      <p>Mesma estratégia em ${itens.filter(p => p.repetiuEscolha).length} de ${itens.length} pares.
        Mesmo comportamento de consulta em ${itens.filter(p => p.repetiuConsulta).length} de ${itens.length}.</p>
      ${itens.map(p => `<details class="conceito">
        <summary>${esc(p.tema)} · ${p.repetiuEscolha ? 'estratégia repetida' : 'estratégia diferente'}</summary>
        <p><strong>Conceito ético:</strong> ${esc(p.lente.titulo)}</p>
        <ol>${[p.antes, p.depois].map(registro => `<li>
          <strong>${esc(registro.forma.titulo)}</strong>
          <p>${esc(PARES[registro.par].opcoes[registro.escolha])}</p>
          <p>${esc(p.lente.leituras[registro.escolha])}</p>
          <p class="suave pequeno">${registro.consultou ? 'Consultou a informação adicional.' : 'Seguiu sem abrir a informação adicional.'}</p>
        </li>`).join('')}</ol>
      </details>`).join('')}
    </div>`).join('')}</div>
    <h4>O mesmo conflito, de outro lugar</h4>
    <p>Compare o que você fez quando mudou a sua responsabilidade na situação.</p>
    ${pares.map(p => `<details class="conceito">
      <summary>${esc(p.tema)} · ${esc(EXIGENCIAS[p.nivel])}</summary>
      <p><strong>Conceito ético:</strong> ${esc(p.lente.titulo)}</p>
      <ol>${[p.antes, ...retomadas.registros[1].filter(r => r.par === p.antes.par), p.depois].map(r => `<li>
        <strong>${esc(r.forma.papel ?? 'Papel inicial')} · ${esc(r.forma.titulo)}</strong>
        <p>${esc(r.opcoes[r.escolha])}</p>
        <p>${esc(r.leituras[r.escolha])}</p>
        <p class="suave pequeno">${r.consultou ? 'Consultou a informação adicional.' : 'Seguiu sem abrir a informação adicional.'}</p>
      </li>`).join('')}</ol>
    </details>`).join('')}
    <p class="suave pequeno">As situações têm contextos diferentes e aconteceram na mesma sessão. A urgência faz parte do contexto. As leituras éticas são interpretações das ações, e uma mesma ação pode ter motivos diferentes.</p>
  </section>`;
}

function relatorioTensao(E) {
  const pontos = rev.dados.pontos;
  const conflito = pontos.find(p => p.cenaId === 'horario');
  return `<section class="cartao ${E}" style="--n:2">
    <h3>Quando trabalho e faculdade disputaram o mesmo tempo</h3>
    <p>A escala do trabalho, a possibilidade de outra advertência, a entrega e a prova colocaram compromissos importantes em conflito.</p>
    <p><strong>Sua escolha:</strong> ${esc(conflito.escolha)}</p>
    <p><strong>O que aconteceu:</strong> ${esc(conflito.desfecho)}</p>
    <p class="suave pequeno">${conflito.abriuInfo ? 'Você perguntou sobre a possibilidade de trocar a escala.' : 'Você decidiu sem perguntar sobre a possibilidade de trocar a escala.'}</p>
  </section>`;
}

function conceitosDe(a) {
  const lista = (a.conceitos || []).map(id => GLOSSARIO[id]).filter(Boolean);
  if (!lista.length) return '';
  return `<details class="conceito mini"><summary>Conceitos desta leitura</summary><ul class="limpa pequeno">${lista.map(c => `<li><strong>${esc(c.termo)}${c.autor ? ` (${esc(c.autor)})` : ''}.</strong> ${esc(c.def)}</li>`).join('')}</ul></details>`;
}

function relatorioNiveis(E) {
  const r = gerarRetorno(rev.dados.pontos, { instituicao: D().instituicao });
  return `<section class="cartao ${E}" style="--n:1">
    <h3>Nas situações de mais e de menos estresse</h3>
    <p class="suave pequeno">Cada cena do seu dia foi sorteada com um nível de estresse na história (baixo, médio ou alto). É o nível da situação, não o que você sentiu. As cenas mudam de um nível para outro, então use o que segue para conversar e discordar, não como veredito.</p>
    <div class="niveis">${r.porNivel.map(n => `<div class="nivel nivel-${n.nivel}"><strong>${esc(n.nome)}</strong><span>${n.cenas.length ? n.cenas.map(esc).join(' · ') : 'nenhuma cena'}</span></div>`).join('')}</div>
    ${r.achados.length ? `<ul class="achados">${r.achados.map(a => `<li><strong>${esc(a.titulo)}.</strong> ${esc(a.texto)}${conceitosDe(a)}</li>`).join('')}</ul>` : '<p>Poucas cenas em cada nível para uma comparação.</p>'}
    ${r.temComparacao ? '' : '<p class="suave pequeno">Neste sorteio houve poucas cenas de um dos níveis, então a comparação entre alto e baixo estresse não foi feita.</p>'}
  </section>`;
}

function relatorioEixos(E) {
  const mapa = mapaDoDia(dia, rev.dados.pontos);
  if (!mapa.length) return '';
  const verb = ids => ids.map(id => GLOSSARIO[id]).filter(Boolean);
  return `<section class="cartao ${E}" style="--n:1">
    <h3>O que o seu dia pôs à prova</h3>
    <p class="suave pequeno">Cada cena exercita uma competência ética. Aqui estão as que apareceram no seu dia, com a pergunta para levar à discussão.</p>
    <ul class="achados">${mapa.map(e => `<li><strong>${esc(e.titulo)}.</strong> ${esc(e.competencia)} <span class="suave">Cenas: ${e.cenas.map(esc).join(' · ')}.</span><br><em>${esc(e.pergunta)}</em>
      <details class="conceito mini"><summary>Conceitos deste eixo</summary><ul class="limpa pequeno">${verb(e.verbetes).map(c => `<li><strong>${esc(c.termo)}${c.autor ? ` (${esc(c.autor)})` : ''}.</strong> ${esc(c.def)}</li>`).join('')}</ul></details></li>`).join('')}</ul>
  </section>`;
}

function abaSintese(E) {
  const r = rev.dados;
  const motivos = MOTIVOS.map((texto, i) => ({
    texto, total: Object.values(contestacoes).filter(motivo => motivo === i).length
  })).filter(motivo => motivo.total > 0).sort((a, b) => b.total - a.total);
  const leituras = Object.entries(r.medias).sort((a, b) => b[1] - a[1]);
  return `
    <section class="cartao ${E}" style="--n:1">
      <h2>O seu dia, em resumo</h2>
      <ul class="limpa">
        <li><strong>Leitura das alternativas do percurso</strong>
          <ul>${leituras.map(([chave, valor]) => `<li>${NOME[chave]} · ${Math.round(valor * 100)}%</li>`).join('')}</ul>
        </li>
        <li>Você conferiu a informação disponível em ${r.conferiu} de ${r.podiaConferir} momentos.</li>
        <li><strong>O que você disse que pesou</strong>
          ${motivos.length
            ? `<ul>${motivos.map(m => `<li>${esc(m.texto)} · ${m.total} ${m.total === 1 ? 'decisão' : 'decisões'}</li>`).join('')}</ul>`
            : 'Você pode registrar seus motivos na aba Decisões.'}
        </li>
      </ul>
      <p class="suave pequeno" style="margin-top:12px">Compare os pesos das alternativas com os motivos que você relatou. Pense onde convergem e onde a mesma ação pode ter justificativas diferentes.</p>
    </section>
    ${relatorioNiveis(E)}
    ${relatorioEixos(E)}
    ${D().completo && retomadas?.registros?.[0] ? relatorioRepeticao(E) + relatorioTensao(E) : ''}
    <div class="par">
      <section class="cartao ${E}" style="--n:2">
        <h3>Sete perguntas para rever o dia</h3>
        <table class="sintese"><tbody>
          ${SINTESE.map(([p, c]) => `<tr><td>${esc(p)}</td><td>${esc(c)}</td></tr>`).join('')}
        </tbody></table>
      </section>
      <section class="cartao ${E}" style="--n:3">
        <h3>Para argumentar</h3>
        <ul class="limpa">
          <li>Que decisão você manteria, mesmo sabendo o desfecho?</li>
          <li>Que decisão você mudaria, e o que precisaria ter percebido antes?</li>
          <li>Em que momento você tinha menos liberdade do que parecia? E mais?</li>
          <li>Qual das suas escolhas você conseguiria justificar diante de todos os envolvidos?</li>
        </ul>
      </section>
    </div>
    <div class="estreita">
      ${D().completo ? `<details class="conceito"><summary>${esc(BASE_ESTRESSE.titulo)}</summary><p>${esc(BASE_ESTRESSE.texto)}</p><ul class="limpa pequeno">${BASE_ESTRESSE.referencias.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}
      <p class="aviso">Simulação de aprendizagem. As leituras são interpretações para discutir em aula. Nada foi salvo.</p>
      <div class="acoes"><button class="btn principal" data-acao="recomecar">Viver o dia de novo</button><button class="btn secundario" data-acao="escolher-dia">Escolher outro dia</button></div>
    </div>`;
}

const INTRO = {
  curvas: 'Reveja as suas escolhas pelas lentes propostas no percurso. Tempo de resposta e consulta de informações ajudam a descrever o contexto da decisão.',
  decisoes: 'Reveja a ação, o desfecho e o conceito. Se quiser, registre o que pesou para você em cada decisão.',
  sintese: 'O percurso inteiro, para rever e argumentar.',
  aplicar: 'Exercite um conceito do dia em uma nova situação do cotidiano.'
};

const MIN_APLICACAO = 40; // caracteres para liberar o conceito e a cópia do texto
function abaAplicar(E) {
  const ok = rev.respostaAplicacao.trim().length >= MIN_APLICACAO;
  return `<div class="estreita"><section class="cartao ${E}" style="--n:1">
    <h2>${esc(D().APLICACAO.titulo)}</h2>
    <p>${esc(D().APLICACAO.situacao)}</p>
    <label for="resposta-aplicacao"><strong>${esc(D().APLICACAO.pergunta)}</strong></label>
    ${rev.professor ? `<p class="resposta-folha">${esc(rev.respostaAplicacao || 'Sem resposta escrita.')}</p>` : `<textarea id="resposta-aplicacao" rows="6" maxlength="2000" aria-describedby="aviso-aplicacao">${esc(rev.respostaAplicacao)}</textarea>
    <p id="aviso-aplicacao" class="suave pequeno">Escreva a sua decisão e o porquê, com as suas palavras (pelo menos uma ou duas frases). Sem nota. O texto fica nesta página; copie ou baixe para levar à discussão. Só vai ao professor se você entrar numa sala e escolher enviar.</p>`}
    <div class="acoes" id="acoes-aplicacao"${rev.professor ? ' hidden' : ''}><button class="btn principal" data-acao="copiar-texto" ${ok ? '' : 'disabled'}>Copiar meu texto</button><button class="btn secundario" data-acao="baixar-texto" ${ok ? '' : 'disabled'}>Baixar (.txt)</button></div>
    ${rev.professor ? '' : '<p id="retorno-texto" class="suave pequeno" role="status"></p>'}
    <details class="conceito" id="conceito-aplicacao"${ok || rev.professor ? '' : ' hidden'}><summary>Explorar o conceito depois de refletir</summary><p>${esc(D().APLICACAO.leitura)}</p></details>
  </section></div>`;
}
function textoDaAplicacao() {
  const A = D().APLICACAO;
  return `Limiar Ético · ${D().nome}\n${A.titulo}\n\n${A.situacao}\n\n${A.pergunta}\n\nMinha resposta:\n${rev.respostaAplicacao.trim()}\n`;
}
function atualizarAplicacao() {
  const ok = rev.respostaAplicacao.trim().length >= MIN_APLICACAO;
  document.querySelectorAll('#acoes-aplicacao button').forEach(b => { b.disabled = !ok; });
  const c = document.querySelector('#conceito-aplicacao');
  if (c) c.hidden = !ok;
}

function telaRevelacao() {
  const abas = [['curvas', 'Curvas'], ['decisoes', 'Decisões'], ['sintese', 'Síntese'], ['aplicar', 'Aplicar']];
  ceu('noite');
  topo.hidden = false;
  topo.innerHTML = barraProfessor() + `<div class="abas" role="tablist" aria-label="Revelação do dia">
    ${abas.map(([id, nome]) => `<button class="aba" role="tab" data-acao="aba" data-aba="${id}" aria-selected="${rev.aba === id}">${nome}</button>`).join('')}
  </div>`;
  const E = rev.anima ? 'entra' : '';
  const corpo = { curvas: abaCurvas, decisoes: abaDecisoes, sintese: abaSintese, aplicar: abaAplicar }[rev.aba](E);
  app.innerHTML = `<div class="${rev.estreia ? 'estreia' : ''}">
      <section class="cartao capa ${E}${rev.aba === 'curvas' ? '' : ' estreita'}">
        <p class="rotulo">Fim do dia</p>
        <h1>Como você decidiu</h1>
        <p>${esc(INTRO[rev.aba])}</p>
      </section>
      ${corpo}
      ${cartaoLevar(E)}
    </div>`;
  rev.anima = false;
  rev.estreia = false;
}

/* ---------- Eventos ---------- */
// Redesenha a revelação sem perder a rolagem nem o foco do teclado.
function mantendoRolagem(f) {
  const yRol = window.scrollY;
  const ativo = document.activeElement?.dataset?.acao ? { ...document.activeElement.dataset } : null;
  f();
  telaRevelacao();
  if (ativo) {
    const acaoFoco = ativo.acao === 'contestar' ? 'motivo' : ativo.acao;
    const seletor = `[data-acao="${acaoFoco}"][data-i="${ativo.i}"]` + (ativo.k != null ? `[data-k="${ativo.k}"]` : '') + (acaoFoco === 'sel' ? '[tabindex]' : '');
    document.querySelector(seletor)?.focus({ preventScroll: true });
  }
  window.scrollTo({ top: yRol });
}


/* ---------- Sala ao vivo (aluno) ---------- */
const EMOJIS = ['⚖️', '🤝', '🧭', '🕊️', '🛡️', '🌱', '🔎', '⚽', '🏐', '🏃', '🥇', '🤸', '🏫', '🎽'];
const lerJSON = k => { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } };
const gravarJSON = (k, v) => { try { if (v == null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } };
let sala = lerJSON('le_sala');        // { codigo, alunoId, nome, avatar } quando o aluno entrou numa sala
let emojiEscolhido = sala?.avatar || '';

async function sincronizar(extra = {}) {
  if (!sala) return;
  try {
    const api = await conectar();
    const total = est ? totalCenas(est) : 0;
    await api.gravarAluno(sala.codigo, sala.alunoId, { nome: sala.nome, avatar: sala.avatar, dia: est ? dia : '', status: 'Jogando', progresso: total ? Math.round(100 * est.pos / total) : 0, ...extra });
  } catch (e) { console.warn('sala', e); }
}

function telaEntrarSala(codigo = '') {
  ceu('alvorada'); topo.hidden = true; topo.innerHTML = '';
  app.innerHTML = `<div class="estreita"><section class="cartao capa-dia entra">
    <p class="rotulo">Sala</p><h1>Entrar na sala</h1>
    <p>Quem conduz a atividade mostra um código. Entrar na sala só avisa que você está jogando. As suas respostas só vão para o professor se, no fim, você escolher enviar.</p>
    <label for="sala-nome"><strong>Sua identificação</strong></label>
    <input id="sala-nome" class="campo" maxlength="40" autocomplete="name" value="${esc(sala?.nome || '')}">
    <label for="sala-codigo"><strong>Código da sala</strong></label>
    <input id="sala-codigo" class="campo" maxlength="8" autocapitalize="characters" placeholder="Ex.: LE1234" value="${esc(codigo || sala?.codigo || '')}">
    <p><strong>Escolha um emoji</strong></p>
    <div class="emojis">${EMOJIS.map(e => `<button type="button" class="btn emoji" data-acao="emoji" data-e="${e}" aria-pressed="${emojiEscolhido === e}">${e}</button>`).join('')}</div>
    <p id="erro-sala" class="erro" role="alert"></p>
    <div class="acoes"><button class="btn principal" data-acao="entrar-sala">Entrar</button><button class="btn secundario" data-acao="escolher-dia">Voltar</button></div>
  </section></div>`;
  foco();
}

async function entrarSala() {
  const erro = document.querySelector('#erro-sala');
  const nome = document.querySelector('#sala-nome').value.trim(), codigo = limparCodigo(document.querySelector('#sala-codigo').value);
  if (nome.length < 2 || codigo.length < 4) { erro.textContent = 'Informe a sua identificação e o código da sala.'; return; }
  if (!emojiEscolhido) { erro.textContent = 'Escolha um emoji.'; return; }
  erro.textContent = 'Verificando a sala…';
  try {
    const api = await conectar();
    const info = await api.lerSessao(codigo);
    if (!info) { erro.textContent = 'Sala não encontrada ou já encerrada.'; return; }
    const alunoId = sala && sala.codigo === codigo && sala.nome === nome ? sala.alunoId : novoId();
    sala = { codigo, alunoId, nome, avatar: emojiEscolhido, modo: info.modo, diaFixo: info.modo === 'fixo' && DIAS[info.dia] ? info.dia : '' };
    gravarJSON('le_sala', sala);
    await api.gravarAluno(codigo, alunoId, { nome, avatar: emojiEscolhido, dia: sala.diaFixo, status: sala.diaFixo ? 'Na abertura' : 'Escolhendo o dia', progresso: 0, entrouEmMs: Date.now() });
    irParaInicio();
  } catch (e) { console.error(e); erro.textContent = 'Não foi possível entrar. Verifique a internet e tente de novo.'; }
}

function sairDaSala() { sala = null; emojiEscolhido = ''; gravarJSON('le_sala', null); telaEscolhaDia(); }
// Sala com história escolhida pelo professor: todos entram direto nela; no modo livre, cada aluno escolhe o dia.
function irParaInicio() {
  if (sala?.diaFixo && DIAS[sala.diaFixo]) { dia = sala.diaFixo; telaAbertura(); } else telaEscolhaDia();
}

async function enviarAoProfessor() {
  const api = await conectar();
  const texto = (rev.respostaAplicacao || '').trim();
  await api.gravarAluno(sala.codigo, sala.alunoId, {
    nome: sala.nome, avatar: sala.avatar, dia, status: 'Enviou', progresso: 100, enviado: true, enviadoEmMs: Date.now(),
    dadosJson: JSON.stringify(rev.dados),
    extrasJson: JSON.stringify({ registros: retomadas?.registros || null, contestacoes }),
    aplicacao: texto
  });
  return 'Enviado ao professor.';
}

function cartaoLevar(E) {
  if (rev.professor) return '';
  return `<div class="estreita"><section class="cartao ${E}">
    <h3>Levar o seu dia</h3>
    <p class="suave pequeno">Escolha os blocos que quer salvar, em PDF ou em imagem${sala ? ', ou envie tudo ao professor' : ''}.</p>
    <div class="acoes"><button class="btn principal" data-acao="abrir-salvar">Salvar${sala ? ' ou enviar' : ''}…</button></div>
  </section></div>`;
}

// Cada aba é renderizada sem animação e quebrada em blocos para a lista de caixas da janela Salvar.
function gruposDaRevelacao() {
  const abas = [['Curvas', abaCurvas], ['Decisões', abaDecisoes], ['Síntese', abaSintese], ['Aplicar', abaAplicar]];
  return abas.map(([nome, f]) => ({ nome, blocos: blocosDe(f('')) }));
}
function abrirSalvarRevelacao() {
  abrirSalvar({
    titulo: rev.professor ? 'Salvar este dia' : 'Salvar o seu dia',
    cabecalho: D().nome + (rev.professor && !document.body.classList.contains('telao') ? ' · ' + rev.professor.nome : ''),
    arquivo: `limiar-etico-${dia}${rev.professor ? '-aluno' : ''}`,
    grupos: gruposDaRevelacao(),
    enviar: sala && !rev.professor ? { rotulo: 'Enviar tudo ao professor', aoClicar: enviarAoProfessor } : null
  });
}

/* ---------- Módulo do professor ---------- */
const P = { modoNovo: 'livre', config: lerJSON('le_prof_cfg') || { modo: 'livre' }, logado: false, codigo: lerJSON('le_prof') || '', alunos: [], unsub: null, vista: 'alunos', diaTurma: null, selId: null, erro: '' };
const porNome = (a, b) => (a.nome || '').localeCompare(b.nome || '', 'pt-BR');
const enviados = () => P.alunos.filter(a => a.enviado && a.dadosJson).sort(porNome);

function barraProfessor() {
  if (!rev?.professor) return '';
  const lista = enviados(), i = lista.findIndex(a => a.id === rev.professor.id);
  return `<div class="prof-barra">
    <button class="btn pequeno-btn" data-acao="prof-voltar">← Turma</button>
    <button class="btn pequeno-btn" data-acao="prof-ant" ${i <= 0 ? 'disabled' : ''} aria-label="Aluno anterior">‹</button>
    <span class="prof-quem">${esc(rev.professor.avatar)} ${document.body.classList.contains('telao') ? 'Aluno' : esc(rev.professor.nome)} <small>${i + 1}/${lista.length}</small></span>
    <button class="btn pequeno-btn" data-acao="prof-prox" ${i < 0 || i >= lista.length - 1 ? 'disabled' : ''} aria-label="Próximo aluno">›</button>
    <button class="btn pequeno-btn" data-acao="abrir-salvar">Salvar…</button>
    <button class="btn pequeno-btn" data-acao="telao">Telão</button>
  </div>`;
}

// QR gerado aqui mesmo (sem serviço de terceiros), o mesmo codificador do MOSAICO.
function qrSvg() {
  try { return window.MosaicoQR ? window.MosaicoQR.svg(linkDaSala(), { rotulo: 'Código QR para entrar na sala ' + P.codigo }) : ''; } catch (e) { return ''; }
}
function abrirQR() {
  if (document.querySelector('#qr-grande')) return;
  const caixa = document.createElement('div');
  caixa.className = 'manual-fundo'; caixa.id = 'qr-grande';
  caixa.innerHTML = `<section class="cartao manual qr-painel" role="dialog" aria-modal="true" aria-label="QR da sala">
    <p class="rotulo">Entre na sala</p><div class="codigo-sala">${esc(P.codigo)}</div>
    <div class="qr-grande-img">${qrSvg()}</div>
    <p class="suave pequeno quebra">${esc(linkDaSala())}</p>
    <div class="acoes"><button class="btn principal" data-acao="fechar-qr">Fechar</button></div></section>`;
  caixa.addEventListener('click', e => { if (e.target === caixa) caixa.remove(); });
  document.body.appendChild(caixa);
}
function linkDaSala() { return location.origin + location.pathname + '?sala=' + encodeURIComponent(P.codigo); }

function telaProfessor() {
  ceu('noite'); topo.hidden = true; topo.innerHTML = '';
  if (!P.logado) {
    app.innerHTML = `<div class="estreita"><section class="cartao capa-dia entra">
      <p class="rotulo">Limiar Ético</p><h1>Módulo do professor</h1>
      <p>Crie uma sala para a turma, acompanhe em tempo real quem está jogando, veja a revelação de cada aluno que enviou e a estatística da turma.</p>
      <p id="erro-prof" class="erro" role="alert">${esc(P.erro)}</p>
      <div class="acoes"><button class="btn principal" data-acao="prof-entrar">Entrar com a conta Google</button><button class="btn secundario" data-acao="prof-sair">Voltar à atividade</button></div>
    </section></div>`;
    foco(); return;
  }
  if (!P.codigo) {
    app.innerHTML = `<div class="estreita"><section class="cartao capa-dia entra">
      <p class="rotulo">Limiar Ético</p><h1><img class="cadeado" src="icones/cadeado-aberto.png" width="44" height="44" alt="" aria-hidden="true"> Criar sala</h1>
      <p>Os alunos entram pelo QR ou pelo código e jogam no próprio celular. Cada um decide se envia o resultado. Escolha como a sala começa:</p>
      <div class="modos" role="group" aria-label="Como a sala começa">
        <button class="btn modo" data-acao="prof-modo" data-modo="livre" aria-pressed="${P.modoNovo === 'livre'}"><strong>Modo livre</strong><small>Cada aluno escolhe a história.</small></button>
        ${ORDEM_DIAS.map(k => `<button class="btn modo" data-acao="prof-modo" data-modo="${k}" aria-pressed="${P.modoNovo === k}"><strong>${esc(DIAS[k].nome)}</strong><small>Todos entram direto nesta história.</small></button>`).join('')}
      </div>
      <p id="erro-prof" class="erro" role="alert">${esc(P.erro)}</p>
      <div class="acoes"><button class="btn principal" data-acao="prof-criar">Criar sala</button><button class="btn secundario" data-acao="prof-sair">Voltar à atividade</button></div>
    </section></div>`;
    foco(); return;
  }
  const envs = enviados();
  const cab = `<section class="cartao capa-dia">
    <p class="rotulo">Sala ao vivo</p>
    <div class="sala-topo"><div><div class="codigo-sala">${esc(P.codigo)}</div>
      <p class="suave pequeno"><strong>${P.config.modo === 'fixo' && DIAS[P.config.dia] ? 'História: ' + esc(DIAS[P.config.dia].nome) : 'Modo livre: cada aluno escolhe a história'}</strong></p>
      <p class="suave pequeno">${P.alunos.length} na sala · ${envs.length} enviaram.</p></div>
      <button class="qr-inline" data-acao="prof-qr" aria-label="Ampliar o QR da sala">${qrSvg()}</button></div>
    <div class="acoes linha"><button class="btn secundario pequeno-btn" data-acao="prof-qr">QR grande</button><button class="btn secundario pequeno-btn" data-acao="prof-copiar">Copiar link</button><button class="btn secundario pequeno-btn" data-acao="telao">Telão (tela cheia)</button><button class="btn secundario pequeno-btn" data-acao="prof-encerrar">Encerrar sala</button></div>
    <div class="abas prof-abas" role="tablist"><button class="aba" role="tab" data-acao="prof-vista" data-v="alunos" aria-selected="${P.vista === 'alunos'}">Alunos</button><button class="aba" role="tab" data-acao="prof-vista" data-v="turma" aria-selected="${P.vista === 'turma'}">Turma</button></div>
  </section>`;
  const corpo = P.vista === 'turma' ? htmlTurma() : cardsAlunos();
  app.innerHTML = `<div class="prof-tela">${cab}${corpo}</div>`;
}

function cardsAlunos() {
  const tel = document.body.classList.contains('telao');
  if (!P.alunos.length) return `<section class="cartao"><p>Ninguém entrou ainda. Mostre o código ou o QR.</p></section>`;
  return `<div class="alunos-grade">${[...P.alunos].sort(porNome).map(a => `<button class="btn card-aluno ${a.enviado ? 'enviou' : ''}" data-acao="prof-ver" data-id="${esc(a.id)}" ${a.enviado ? '' : 'disabled'}>
    <span class="av">${esc(a.avatar || '👤')}</span><strong>${tel ? '' : esc(a.nome || 'Aluno')}</strong>
    <span class="suave pequeno">${a.enviado ? 'Enviou · ' + esc(DIAS[a.dia]?.nome || '') : esc(a.status || 'Entrou') + (a.dia ? ` · ${esc(DIAS[a.dia]?.nome || '')} · ${Math.round(a.progresso || 0)}%` : '')}</span></button>`).join('')}</div>`;
}

function dadosDoDiaTurma() {
  const contagem = Object.fromEntries(ORDEM_DIAS.map(k => [k, enviosDoDia(P.alunos, k).length]));
  if (P.config.modo === 'fixo' && DIAS[P.config.dia]) P.diaTurma = P.config.dia;
  else if (!P.diaTurma || !contagem[P.diaTurma]) P.diaTurma = ORDEM_DIAS.reduce((m, k) => contagem[k] > (contagem[m] || 0) ? k : m, ORDEM_DIAS.find(k => contagem[k] > 0) || ORDEM_DIAS[0]);
  return contagem;
}

function barraOpcao(texto, pct, n) {
  const p = Math.round(pct * 100);
  return `<div class="opt"><span class="opt-txt">${esc(texto)}</span><span class="opt-linha"><span class="opt-barra" aria-hidden="true"><i style="width:${Math.max(p, 1)}%"></i></span><b>${p}%</b><span class="suave pequeno">${n}</span></span></div>`;
}
const pc = v => Math.round(v * 100) + '%';

function htmlTurma() {
  const contagem = dadosDoDiaTurma(), DIA = DIAS[P.diaTurma];
  const ag = agregar(P.alunos, DIA, P.diaTurma);
  const abas = P.config.modo === 'fixo' ? '' : `<div class="abas prof-dias">${ORDEM_DIAS.map(k => `<button class="aba" data-acao="prof-dia" data-dia="${k}" aria-selected="${k === P.diaTurma}">${esc(DIAS[k].nome.replace('Um dia ', ''))} · ${contagem[k]}</button>`).join('')}</div>`;
  if (!ag.liberado) return `${abas}<section class="cartao"><h2>A turma</h2><p>A visão da turma aparece com ${MIN_TURMA} ou mais envios do mesmo dia. Hoje há ${ag.n}. Isso protege quem respondeu: com poucos alunos, qualquer resposta se reconheceria.</p></section>`;
  const visiveis = ag.cenas.filter(c => !c.oculta);
  const pts = visiveis.map((c, i) => ({ n: i + 1, hora: c.hora, titulo: c.titulo, ...c.medias }));
  const legenda = `<ol class="legenda-cenas pequeno suave">${visiveis.map(c => `<li>${esc(c.hora)} · ${esc(c.titulo)}</li>`).join('')}</ol>`;
  const tot = ag.niveis.baixo + ag.niveis.medio + ag.niveis.alto || 1;
  return `${abas}
  <section class="cartao painel"><h2>A turma neste dia</h2>
    <p><strong>${ag.n}</strong> alunos enviaram. Cada um viveu o dia com cenas sorteadas em níveis diferentes: ${pc(ag.niveis.baixo / tot)} baixo, ${pc(ag.niveis.medio / tot)} médio, ${pc(ag.niveis.alto / tot)} alto.</p>
    ${ag.conferiu ? `<p>Quando havia informação para conferir, a turma abriu em <strong>${pc(ag.conferiu.abriram / ag.conferiu.podiam)}</strong> das vezes.</p>` : ''}
    <ul class="limpa">${['razao', 'emocao', 'impulso'].map(s => `<li>${NOME[s]} · média ${pc(ag.medias[s])}</li>`).join('')}</ul>
  </section>
  <section class="cartao painel"><div class="bloco-grafico"><h3>Razão, emoção e impulso, em média</h3>
    <p class="sub">Média da turma em cada cena (só cenas com ${MIN_TURMA} ou mais respostas).</p>
    <div class="legenda">${['razao', 'emocao', 'impulso'].map(s => `<span><i style="background:${COR[s]}"></i>${NOME[s]}</span>`).join('')}</div>
    ${graficoLinhas(pts, -1, false)}${legenda}</div></section>
  <section class="cartao painel"><div class="bloco-grafico"><h3>O certo ou o desfecho, em média</h3>
    <p class="sub">Acima, a turma se aproximou mais do dever ou do princípio. Abaixo, mais das consequências.</p>
    ${graficoCertoDesfecho(pts, -1, false)}</div></section>
  <section class="cartao painel"><div class="bloco-grafico"><h3>Margem de escolha, em média</h3>
    <p class="sub">Barra baixa: pouca liberdade real naquele momento para a maioria.</p>
    ${graficoMargem(pts, -1, false)}</div></section>
  <section class="cartao painel"><div class="bloco-grafico"><h3>As lentes da turma</h3>
    <p class="sub">Peso médio de cada corrente ética nas escolhas.</p>
    ${graficoEscala(ag.escala)}</div></section>
  <section class="cartao painel"><h3>Como a turma decidiu, cena a cena</h3>
    <p class="suave pequeno">Percentual de alunos em cada alternativa; o número à direita é a quantidade.</p>
    ${ag.cenas.map(c => c.oculta ? `<div class="cena-turma"><h4>${esc(c.hora)} · ${esc(c.titulo)}</h4><p class="suave pequeno">Menos de ${MIN_TURMA} respostas (${c.n}).</p></div>`
      : `<div class="cena-turma"><h4>${esc(c.hora)} · ${esc(c.titulo)} <small class="suave">${c.n} respostas${c.tempoS != null ? ` · tempo mediano ${Math.round(c.tempoS)} s` : ''}</small></h4>${c.opcoes.map(o => barraOpcao(o.texto, o.pct, o.n)).join('')}</div>`).join('')}
  </section>
  ${ag.eixos.length ? `<section class="cartao painel"><h3>O que a turma pôs à prova, por competência</h3>
    <p class="suave pequeno">Em cada competência ética, o quanto a turma pesou razão, emoção e impulso nas cenas que a exercitam.</p>
    <ul class="limpa">${ag.eixos.map(e => `<li><strong>${esc(e.titulo)}</strong> <span class="suave pequeno">${e.cenas} cena(s)</span>
      ${['razao', 'emocao', 'impulso'].map(s => `<div class="mini-linha"><span>${NOME[s]}</span><span class="opt-barra"><i style="width:${Math.max(1, Math.round(e[s] * 100))}%;--c:${COR[s]}"></i></span><b>${pc(e[s])}</b></div>`).join('')}</li>`).join('')}</ul></section>` : ''}
  <section class="cartao painel"><h3>O que a turma escreveu na aba Aplicar</h3>
    <p class="suave pequeno">Sem nome, para discutir em grupo.</p>
    ${ag.aplicacoes.length ? `<ul class="citacoes">${ag.aplicacoes.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '<p>Ninguém escreveu ainda.</p>'}
  </section>
  <section class="cartao"><div class="acoes"><button class="btn principal" data-acao="prof-salvar-turma">Salvar a visão da turma…</button></div></section>`;
}

function salvarTurma() {
  abrirSalvar({ titulo: 'Salvar a visão da turma', cabecalho: DIAS[P.diaTurma].nome + ' · turma', arquivo: `limiar-etico-${P.diaTurma}-turma`, grupos: [{ nome: 'A turma', blocos: blocosDe(htmlTurma()) }] });
}

function redesenharProf() {
  if (P.vista === 'aluno') telaRevelacao(); else telaProfessor();
}

async function profEntrar() {
  try {
    const api = await conectar();
    const ok = await api.entrarProfessor();
    if (!ok) { P.erro = 'Esta conta não tem acesso ao módulo do professor.'; P.logado = false; } else { P.logado = true; P.erro = ''; if (P.codigo) await ouvirSala(); }
  } catch (e) { console.error(e); P.erro = 'Não foi possível entrar. Verifique a internet e tente de novo.'; }
  telaProfessor();
}
async function ouvirSala() {
  const api = await conectar();
  if (P.unsub) P.unsub();
  P.unsub = api.ouvirAlunos(P.codigo, lista => { P.alunos = lista; if (P.vista !== 'aluno') telaProfessor(); }, () => { P.erro = 'A conexão da sala foi interrompida.'; });
}
async function profCriar() {
  try {
    const api = await conectar();
    P.codigo = gerarCodigo(); P.config = P.modoNovo === 'livre' ? { modo: 'livre' } : { modo: 'fixo', dia: P.modoNovo };
    await api.criarSessao(P.codigo, P.config); gravarJSON('le_prof', P.codigo); gravarJSON('le_prof_cfg', P.config); P.alunos = []; P.vista = 'alunos'; P.diaTurma = P.config.dia || null;
    await ouvirSala();
  } catch (e) { console.error(e); P.codigo = ''; P.erro = 'Não consegui criar a sala. Verifique a internet e o acesso da conta.'; }
  telaProfessor();
}
async function profEncerrar() {
  if (!confirm('Encerrar esta sala? Os alunos não poderão mais entrar. Os envios já feitos somem desta tela.')) return;
  const api = await conectar();
  await api.encerrarSessao(P.codigo);
  if (P.unsub) P.unsub();
  P.unsub = null; P.codigo = ''; P.alunos = []; P.config = { modo: 'livre' }; gravarJSON('le_prof', null); gravarJSON('le_prof_cfg', null); telaProfessor();
}

function abrirAluno(id) {
  const a = P.alunos.find(x => x.id === id);
  if (!a || !a.enviado || !a.dadosJson) return;
  let dados, extras = {};
  try { dados = JSON.parse(a.dadosJson); extras = a.extrasJson ? JSON.parse(a.extrasJson) : {}; } catch (e) { return; }
  dia = a.dia; est = null;
  retomadas = extras.registros ? { registros: extras.registros } : null;
  for (const k of Object.keys(contestacoes)) delete contestacoes[k];
  Object.assign(contestacoes, extras.contestacoes || {});
  rev = { dados, aba: 'curvas', sel: 0, abertas: {}, respostaAplicacao: a.aplicacao || '', anima: true, estreia: true, professor: { id: a.id, nome: a.nome || 'Aluno', avatar: a.avatar || '👤' } };
  P.vista = 'aluno'; P.selId = id;
  telaRevelacao(); window.scrollTo({ top: 0 });
}
function saltar(delta) {
  const lista = enviados(), i = lista.findIndex(a => a.id === P.selId);
  const alvo = lista[i + delta];
  if (alvo) abrirAluno(alvo.id);
}

/* ---------- Telão ---------- */
const botaoSairTelao = document.createElement('button');
botaoSairTelao.className = 'btn botao-sair-telao';
botaoSairTelao.dataset.acao = 'telao';
botaoSairTelao.textContent = 'Sair do telão';
botaoSairTelao.hidden = true;
document.body.appendChild(botaoSairTelao);
function alternarTelao(forca) {
  const on = forca ?? !document.body.classList.contains('telao');
  document.body.classList.toggle('telao', on);
  botaoSairTelao.hidden = !on;
  if (on) document.documentElement.requestFullscreen?.().catch(() => {});
  else if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  if (rev?.professor || P.codigo) redesenharProf();
}
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && document.body.classList.contains('telao')) alternarTelao(false); });
document.addEventListener('keydown', e => {
  if (P.vista !== 'aluno' || !rev?.professor || e.target.matches?.('input, textarea')) return;
  if (e.key === 'ArrowRight') saltar(1);
  else if (e.key === 'ArrowLeft') saltar(-1);
});

/* ---------- Manual (abre na entrada; reabre no "i") ---------- */
let manualAberto = false;
function abrirManual() {
  if (manualAberto) return;
  manualAberto = true;
  const caixa = document.createElement('div');
  caixa.className = 'manual-fundo';
  caixa.id = 'manual';
  caixa.innerHTML = `<section class="cartao manual" role="dialog" aria-modal="true" aria-labelledby="manual-titulo">
      <h2 id="manual-titulo">${esc(MANUAL.titulo)}</h2>
      <ul class="manual-lista">${MANUAL.itens.map(([t, d]) => `<li><strong>${esc(t)}</strong> ${esc(d)}</li>`).join('')}</ul>
      <p class="manual-gancho">${esc(MANUAL.gancho)}</p>
      <div class="acoes"><button class="btn principal" data-acao="fechar-manual">${esc(MANUAL.botao)}</button></div>
    </section>`;
  document.body.appendChild(caixa);
  caixa.querySelector('[data-acao="fechar-manual"]').focus();
}
function fecharManual() {
  document.querySelector('#manual')?.remove();
  manualAberto = false;
  app.focus({ preventScroll: true });
}
const botaoI = document.createElement('button');
botaoI.className = 'btn botao-i';
botaoI.dataset.acao = 'abrir-manual';
botaoI.setAttribute('aria-label', 'Como funciona');
botaoI.textContent = 'i';
document.body.appendChild(botaoI);
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (manualAberto) fecharManual(); document.querySelector('#qr-grande')?.remove(); } });

function acao(alvo) {
  const a = alvo.dataset.acao, i = Number(alvo.dataset.i);
  if (a === 'copiar-texto' || a === 'baixar-texto') {
    const msg = document.querySelector('#retorno-texto');
    if (a === 'copiar-texto') {
      (navigator.clipboard?.writeText(textoDaAplicacao()) ?? Promise.reject()).then(() => { msg.textContent = 'Texto copiado.'; }, () => { msg.textContent = 'Não consegui copiar. Use "Baixar (.txt)" ou selecione o texto na caixa.'; });
    } else {
      const url = URL.createObjectURL(new Blob([textoDaAplicacao()], { type: 'text/plain;charset=utf-8' }));
      const l = document.createElement('a'); l.href = url; l.download = `limiar-etico-${dia}-aplicar.txt`; document.body.appendChild(l); l.click(); l.remove(); URL.revokeObjectURL(url);
      msg.textContent = 'Arquivo baixado.';
    }
    return;
  }
  if (a === 'tela-sala') { telaEntrarSala(); return; }
  if (a === 'tela-prof') { telaProfessor(); return; }
  if (a === 'emoji') { emojiEscolhido = alvo.dataset.e; document.querySelectorAll('.emojis .emoji').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.e === emojiEscolhido))); return; }
  if (a === 'entrar-sala') { entrarSala(); return; }
  if (a === 'sair-sala') { sairDaSala(); return; }
  if (a === 'abrir-salvar') { abrirSalvarRevelacao(); return; }
  if (a === 'prof-entrar') { profEntrar(); return; }
  if (a === 'prof-sair') { location.href = location.pathname; return; }
  if (a === 'prof-criar') { profCriar(); return; }
  if (a === 'prof-encerrar') { profEncerrar(); return; }
  if (a === 'prof-copiar') { navigator.clipboard?.writeText(linkDaSala()); return; }
  if (a === 'prof-qr') { abrirQR(); return; }
  if (a === 'fechar-qr') { document.querySelector('#qr-grande')?.remove(); return; }
  if (a === 'prof-modo') { P.modoNovo = alvo.dataset.modo; document.querySelectorAll('.modos .modo').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.modo === P.modoNovo))); return; }
  if (a === 'prof-vista') { P.vista = alvo.dataset.v; telaProfessor(); return; }
  if (a === 'prof-dia') { P.diaTurma = alvo.dataset.dia; telaProfessor(); return; }
  if (a === 'prof-ver') { abrirAluno(alvo.dataset.id); return; }
  if (a === 'prof-voltar') { P.vista = 'alunos'; rev = null; telaProfessor(); return; }
  if (a === 'prof-ant') { saltar(-1); return; }
  if (a === 'prof-prox') { saltar(1); return; }
  if (a === 'prof-salvar-turma') { salvarTurma(); return; }
  if (a === 'telao') { alternarTelao(); return; }
  if (a === 'abrir-manual') { abrirManual(); return; }
  if (a === 'fechar-manual') { fecharManual(); return; }
  if (a === 'comecar' || a === 'recomecar') {
    est = novoEstado(sortearNiveis(Math.random, dia), dia); rev = null; topo.innerHTML = '';
    for (const k of Object.keys(contestacoes)) delete contestacoes[k];
    if (D().completo) {
      retomadas = { rodadas: prepararRodadas(), registros: [[], [], []], rodada: 0, pos: 0, consultou: false };
      apresentarRetomada();
    } else telaCena();
  } else if (a === 'dia') {
    dia = alvo.dataset.dia; telaAbertura();
  } else if (a === 'escolher-dia') {
    telaEscolhaDia();
  } else if (a === 'consultar-retomada') {
    retomadas.consultou = true;
    telaRetomadas();
    document.querySelector('#fato-retomada')?.focus();
  } else if (a === 'responder-retomada') responderRetomada(i);
  else if (a === 'info') abrirInfo();
  else if (a === 'escolher') escolher(i);
  else if (a === 'seguir') {
    if (D().completo && est.log.length === 5 && retomadas.rodada === 0) {
      retomadas.rodada = 1;
      retomadas.pos = 0;
      apresentarRetomada();
    } else telaCena();
  }
  else if (a === 'revelar') {
    if (D().completo) {
      retomadas.rodada = 2;
      retomadas.pos = 0;
      apresentarRetomada();
    } else {
      rev = { dados: resumo(est), aba: 'curvas', sel: 0, abertas: {}, respostaAplicacao: '', anima: true, estreia: true };
      telaRevelacao();
      foco();
    }
  }
  else if (a === 'aba') { rev.aba = alvo.dataset.aba; rev.anima = true; telaRevelacao(); foco(); }
  else if (a === 'sel') mantendoRolagem(() => { rev.sel = i; });
  else if (a === 'contestar') mantendoRolagem(() => { rev.abertas[i] = true; });
  else if (a === 'motivo') mantendoRolagem(() => { contestacoes[i] = Number(alvo.dataset.k); });
}

document.addEventListener('click', e => {
  const alvo = e.target.closest('[data-acao]');
  if (alvo) acao(alvo);
});
app.addEventListener('input', e => {
  if (e.target.id === 'resposta-aplicacao') { rev.respostaAplicacao = e.target.value; atualizarAplicacao(); }
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('.ponto-alvo')) { e.preventDefault(); acao(e.target); }
});

// Link direto para um dia: ?dia=escola ou ?dia=bairro (útil para QR code e palestras).
const params = new URLSearchParams(location.search);
const diaDoLink = params.get('dia');
if (params.has('professor')) telaProfessor();
else if (params.get('sala')) { telaEntrarSala(limparCodigo(params.get('sala'))); abrirManual(); }
else if (diaDoLink && DIAS[diaDoLink] && !sala?.diaFixo) { dia = diaDoLink; telaAbertura(); abrirManual(); }
else { irParaInicio(); abrirManual(); }
