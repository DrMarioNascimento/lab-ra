import { agruparTrajetoria, HORIZONTES, PERFIS_TRAJETORIA, simularTrajetoria } from '../motor/trajetoria.js?v=8';
import { PASSO_INTEGRADO } from '../motor/bancada-hidrica.js?v=6';
import { desenharSerie, indiceNaSerie } from '../hidratacao/grafico.js?v=3';
import { criarEditor } from './editor.js?v=4';
import { DIAS_AGENDA } from '../motor/agenda.js?v=3';

const el = (id) => document.getElementById(id);
const perfis = [el('perfil-a'), el('perfil-b')];
const horizonte = el('horizonte');
const periodo = el('periodo');
const dia = el('dia-detalhe');
const instante = el('instante');
const painel = el('grafico');
const painelDia = el('grafico-dia');
const janelaTermica = el('janela-termica');
const indicador = el('indicador');
const passoGrafico = el('passo-grafico');
const variavel = el('variavel-dia');
const medidas = {
  fcMedia: ['FC média', 'bpm', 1], pamMedia: ['Pressão arterial média', 'mmHg', 1],
  quedaFC: ['Redução estimada da FC de repouso', 'bpm', 2], minPlasma: ['Menor volume plasmático', 'L', 3],
  maxOsm: ['Maior osmolalidade', 'mOsm/kg', 1], ureseL: ['Volume médio de urina por dia', 'L', 2],
  suorL: ['Volume médio de suor por dia', 'L', 2], horasSono: ['Duração média do sono', 'h', 1],
  saldoSono7d: ['Vigília em excesso nos últimos sete dias', 'h', 2],
  pressaoAoAcordar: ['Pressão de sono às 07h', '0 a 1', 3],
  vigiliaMaxH: ['Maior período seguido sem dormir', 'h', 1],
  sonoDiurnoH: ['Sono diurno médio', 'h/dia', 1],
  atividadeNoturnaH: ['Atividade noturna no período', 'h', 1],
  trabalhoNoturnoH: ['Trabalho noturno no período', 'h', 1],
  trabalhoH: ['Trabalho no período', 'h', 1],
  faseCircadianaH: ['Deslocamento no fim do período (+ atraso, − avanço)', 'h', 2],
  luzLuxH: ['Iluminância acumulada no período', 'lux·h', 0],
  sonoForaFaseH: ['Sono fora da noite biológica', 'h/dia', 2],
  pausaMin: ['Tempo programado de pausas no período', 'min', 0],
  biofeedbackMin: ['Biofeedback respiratório no período', 'min', 0],
  noitesEmClaro: ['Noites das 23h às 07h sem dormir', 'noites', 0],
  picoGlicemia: ['Pico de glicemia', 'mg/dL', 1],
  deltaAucCafe: ['Efeito acumulado no café padronizado', 'mmol/L × min', 2], mediaCortisol: ['Cortisol médio', 'µg/dL', 2],
  treinoMin: ['Minutos de exercício no período', 'min', 0],
};
const medidasDia = {
  fc: ['Frequência cardíaca', 'bpm', 1], sis: ['Pressão sistólica', 'mmHg', 1],
  dia: ['Pressão diastólica', 'mmHg', 1], volumeSistolico: ['Volume sistólico', 'mL', 1],
  debito: ['Débito cardíaco', 'L/min', 2], plasmaL: ['Volume plasmático', 'L', 3],
  osmolalidade: ['Osmolalidade', 'mOsm/kg', 1], sodio: ['Sódio plasmático', 'mmol/L', 1],
  urinaLHora: ['Fluxo urinário', 'L/h', 3], adh: ['Vasopressina', 'índice', 1],
  renina: ['Renina', 'índice', 1], angII: ['Angiotensina II', 'índice', 1],
  aldosterona: ['Aldosterona', 'índice', 1], anp: ['ANP', 'índice', 1], tfg: ['Filtração glomerular estimada', 'mL/min', 1],
  faseCircadianaH: ['Deslocamento da fase (+ atraso, − avanço)', 'h', 2],
  luzLux: ['Luz programada', 'lux', 0],
  ritmoOrientado: ['Ritmo respiratório programado (0 fora da pausa)', 'ciclos/min', 0],
  pressaoSono: ['Pressão de sono', '0 a 1', 3], vigiliaContinua: ['Vigília contínua', 'h', 1], cortisol: ['Cortisol', 'µg/dL', 2], glicemia: ['Glicemia', 'mg/dL', 1],
};
const termicasPeriodo = {
  picoCentralC: ['Pico de temperatura central estimada', '°C', 2],
  suorEvaporadoL: ['Suor evaporado médio por dia', 'L', 2],
  tempoCalorMin: ['Minutos de exercício acima de 37,5 °C', 'min', 0],
  calorSessaoKJ: ['Calor retido durante o exercício no período', 'kJ', 0],
};
const indicadoresAclima = {
  indiceAclima: ['Adaptação cardiovascular ao calor (índice)', '% da amplitude do modelo', 1],
  indiceSuorAclima: ['Adaptação da sudorese (índice)', '% da amplitude do modelo', 1],
};
const termicasDia = {
  centralC: ['Temperatura central estimada', '°C', 2],
  peleC: ['Temperatura da pele estimada', '°C', 2],
  suorProduzidoMl: ['Suor produzido por intervalo', 'mL/5 min', 1],
  suorEvaporadoMl: ['Suor evaporado por intervalo', 'mL/5 min', 1],
  suorEscorridoMl: ['Suor não evaporado por intervalo', 'mL/5 min', 1],
  calorRetidoKJ: ['Variação do calor armazenado por intervalo', 'kJ/5 min', 1],
};
Object.assign(medidas, termicasPeriodo, indicadoresAclima);
Object.assign(medidasDia, termicasDia);
const nomeHorizonte = { 1: '24 horas', 2: '48 horas', 5: '5 dias', 7: '7 dias', 12: '12 dias', 28: '4 semanas', 56: '8 semanas', 90: '90 dias', 180: '180 dias', 365: '365 dias' };
const fmt = (v, casas) => v.toLocaleString('pt-BR', { maximumFractionDigits: casas, minimumFractionDigits: casas });
const hhmm = (i) => {
  const min = i * PASSO_INTEGRADO;
  return [Math.floor(min / 60), min % 60].map((v) => String(v).padStart(2, '0')).join(':');
};
const valor = (p, k) => p[k] ?? p.termorregulacao?.[k] ?? p.renal[k] ?? p.renal.regulacao[k];
const classe = (i) => i ? 'rotina-b' : 'rotina-a';
let rotinas = [], configuracoes = [], resultados = [], agregados = [], curvas = [];
const observacoes = new Map();
const chaveObservacao = (rotina, i = instante.value) => `${rotina}:${dia.value}:${i}`;
const paineisAgenda = [el('agenda-a'), el('agenda-b')];
const editores = paineisAgenda.map((painel, i) => criarEditor(painel, (eventos) => {
  const outro = 1 - i;
  editores[outro].carregar(eventos);
  perfis[outro].value = 'personalizada';
  ajustarControles();
  paineisAgenda[outro].open = true;
  paineisAgenda[outro].querySelector('summary').focus();
}));

for (const [id, p] of Object.entries(PERFIS_TRAJETORIA)) perfis.forEach((input) => input.add(new Option(p.nome, id)));
perfis[0].value = 'treino';
perfis[1].value = 'calor';
HORIZONTES.forEach((n) => horizonte.add(new Option(nomeHorizonte[n], n)));
horizonte.value = '7';
for (const [input, dados] of [[indicador, medidas], [variavel, medidasDia]]) {
  Object.entries(dados).forEach(([id, [nome, unidade]]) => input.add(new Option(`${nome} (${unidade})`, id)));
}
indicador.value = 'minPlasma';
variavel.value = 'fc';

function mostrarPeriodo() {
  const i = Number(periodo.value);
  const p = agregados[0][i];
  const [nome, unidade, casas] = medidas[indicador.value];
  el('leitura-glicemia-acumulada').hidden = indicador.value !== 'deltaAucCafe';
  const intervalo = p.inicio === p.fim ? '' : ` · dias ${p.inicio} a ${p.fim}`;
  el('periodo-rotulo').value = p.nome + intervalo + (p.parcial ? ' · parcial' : '');
  periodo.setAttribute('aria-valuetext', el('periodo-rotulo').value);
  desenharSerie(painel, agregados.map((a) => a.map((x) => x[indicador.value])), agregados[0].length,
    i, (j) => agregados[0][j].nomeCurto, casas);
  el('resultados').innerHTML = agregados.map((a, j) => `<article class="leitura-cardio ${classe(j)}">
    <h3>${PERFIS_TRAJETORIA[rotinas[j]].nome}</h3>
    <p>${nome} <strong>${fmt(a[i][indicador.value], casas)} ${unidade}</strong></p></article>`).join('');
}

function prepararGrafico(diaPreferido = null) {
  agregados = resultados.map((r) => passoGrafico.value === 'dias'
    ? r.dias.map((d) => ({ ...d, inicio: d.dia, fim: d.dia, nome: `Dia ${d.dia}`, nomeCurto: `D${d.dia}` }))
    : agruparTrajetoria(r.dias));
  periodo.max = agregados[0].length - 1;
  periodo.disabled = agregados[0].length === 1;
  const i = diaPreferido ? agregados[0].findIndex((p) => p.inicio <= diaPreferido && p.fim >= diaPreferido) : 0;
  periodo.value = Math.max(0, i);
  mostrarPeriodo();
}

function contaDoCalor(t) {
  if (!t) return '';
  return `<details class="conta-termica" open>
    <summary>Conta do calor nos próximos 5 minutos</summary>
    <p>${fmt(t.temperatura, 0)} °C · ${fmt(t.umidade, 0)}% de umidade</p>
    <ul>
      <li>Calor metabólico: ${fmt(t.calorMetabolicoW, 1)} W</li>
      <li>Troca seca: ${fmt(t.perdaSecaW, 1)} W de perda (valor negativo indica ganho)</li>
      <li>Perda pela respiração: ${fmt(t.perdaRespiratoriaW, 1)} W</li>
      <li>Resfriamento por evaporação: ${fmt(t.evaporacaoW, 1)} W</li>
    </ul>
    <p>Saldo = calor metabólico − troca seca − respiração − evaporação.
    <strong>${fmt(t.armazenamentoW, 1)} W</strong> em média, ou <strong>${fmt(t.calorRetidoKJ, 1)} kJ</strong> no intervalo.</p>
    <p>Dos ${fmt(t.suorProduzidoMl, 1)} mL secretados, ${fmt(t.suorEvaporadoMl, 1)} mL evaporam e
    ${fmt(t.suorEscorridoMl, 1)} mL não evaporam. O total secretado entra como perda hídrica.</p>
  </details>`;
}

function usarDiaInteiro() {
  janelaTermica.value = 'dia';
  sincronizarJanela();
}

function sincronizarJanela() {
  const zoom = !el('controle-janela-termica').hidden && janelaTermica.value === 'sessao';
  instante.min = zoom ? '207' : '0';
  instante.max = zoom ? '231' : '287';
}

function ativarIndicadoresTermicos(ativo, aclima) {
  for (const [select, grupo, padrao, habilitado] of [[indicador, termicasPeriodo, 'minPlasma', ativo], [variavel, termicasDia, 'fc', ativo], [indicador, indicadoresAclima, 'minPlasma', aclima]]) {
    for (const opt of select.options) {
      if (Object.hasOwn(grupo, opt.value)) {
        opt.disabled = !habilitado;
        opt.hidden = !habilitado;
      }
    }
    if (!habilitado && Object.hasOwn(grupo, select.value)) select.value = padrao;
  }
  el('controle-janela-termica').hidden = !ativo;
  el('resumo-termico').hidden = !rotinas.every((id) => ['arSeco', 'arUmido'].includes(id));
  sincronizarJanela();
}

function mostrarInstante() {
  const i = Number(instante.value);
  const [nome, unidade, casas] = medidasDia[variavel.value];
  el('hora').value = hhmm(i);
  instante.setAttribute('aria-valuetext', hhmm(i));
  const inicio = Number(instante.min), fim = Number(instante.max);
  desenharSerie(painelDia, curvas.map((a) => a.slice(inicio, fim + 1).map((x) => valor(x, variavel.value))),
    fim - inicio + 1, i - inicio, (x) => hhmm(inicio + x), casas);
  const temBiofeedback = curvas.some((a) => a[i].ritmoOrientado);
  el('leitura-dia').innerHTML = curvas.map((a, j) => {
    const observacao = observacoes.get(chaveObservacao(j, i));
    return `<article class="leitura-cardio ${classe(j)}">
    <h3>Rotina ${j ? 'B' : 'A'}</h3>
    <p>${nome} <strong>${fmt(valor(a[i], variavel.value), casas)} ${unidade}</strong></p>
    <p><strong>${a[i].atividade || (a[i].dormindo ? 'Em sono' : a[i].exercicio ? 'Em exercício' : 'Em vigília')}</strong> · ${fmt(a[i].vigiliaContinua, 1)} h seguidas em vigília.</p>
    ${a[i].luzLux ? `<p>Luz programada: ${fmt(a[i].luzLux, 0)} lux.</p>` : ''}
    ${a[i].ritmoOrientado ? `<p>Ritmo programado: ${a[i].ritmoOrientado} ciclos/min. <a href="https://fisiologia.drmarionascimento.com.br/biofeedback-respiratorio.html">Abrir a prática de biofeedback</a></p>` : ''}
    ${observacao ? `<p>Frequência registrada: ${fmt(observacao.ciclos * 60 / observacao.segundos, 1)} ciclos/min.</p>` : ''}
    ${temBiofeedback ? `<button type="button" class="btn sec sm" data-observar="${j}">Contar minha respiração</button>` : ''}
    ${contaDoCalor(a[i].termorregulacao)}
    ${variavel.value === 'glicemia' ? `<p>Efeito acumulado no café padronizado de <strong>${fmt(resultados[j].dias[Number(dia.value) - 1].deltaAucCafe, 2)} mmol/L × min</strong> em relação ao dia 1.</p>` : ''}
    <p>FC ${fmt(a[i].fc, 1)} bpm · plasma ${fmt(a[i].plasmaL, 3)} L · ADH ${fmt(a[i].renal.regulacao.adh, 1)} · glicemia ${fmt(a[i].glicemia, 1)} mg/dL.</p>
    </article>`;
  }).join('');
}

function mostrarDia() {
  const selecionado = Number(dia.value);
  curvas = rotinas.map((id, i) => simularTrajetoria(id, selecionado, { ...configuracoes[i], detalharDia: selecionado - 1 }).leitura);
  mostrarInstante();
}

function ajustarControles() {
  perfis.forEach((s, i) => { paineisAgenda[i].hidden = s.value !== 'personalizada'; });
  el('opcoes-noite').hidden = !perfis.some((s) => PERFIS_TRAJETORIA[s.value]?.noite);
  el('opcoes-fase').hidden = !perfis.some((s) => PERFIS_TRAJETORIA[s.value]?.agenda || s.value === 'personalizada');
}

function mostrarExposicao() {
  const exposicao = resultados.map(({ dias }) => {
    const total = (k) => dias.reduce((soma, p) => soma + p[k], 0);
    return { trabalho: total('trabalhoNoturnoH'), noite: total('atividadeNoturnaH'), sono: total('sonoDiurnoH') / dias.length,
      noitesEmClaro: total('noitesEmClaro'), vigilia: Math.max(...dias.map((p) => p.vigiliaMaxH)),
      saldoSono: dias.at(-1).saldoSono7d };
  });
  el('evidencia-noturna').hidden = !exposicao.some((r) => r.noite || r.sono || r.noitesEmClaro);
  el('exposicao-noturna').innerHTML = exposicao.map((r, i) => `<article class="leitura-cardio ${classe(i)}">
    <h3>Rotina ${i ? 'B' : 'A'}</h3>
    <p>${fmt(r.trabalho, 1)} h de trabalho noturno · ${fmt(r.sono, 1)} h/dia de sono diurno.</p>
    <p>${r.noitesEmClaro} noites sem dormir das 23h às 07h · maior vigília seguida de ${fmt(r.vigilia, 1)} h. Índice de vigília em excesso no último bloco de até 7 dias: ${fmt(r.saldoSono, 2)} h.</p></article>`).join('');
}

function mostrarAclimatacao() {
  const comparacao = rotinas[0] === 'aclimaFresco' && rotinas[1] === 'aclimaQuente';
  el('resumo-aclima').hidden = !comparacao;
  el('painel-aclima').hidden = !comparacao || resultados[0].dias.length < 12;
  if (el('painel-aclima').hidden) return;
  const [a, b] = resultados;
  const exibidos = [a.dias[0], a.dias[11], b.dias[11]];
  const linhas = [
    ['Temperatura central no fim', 'centralFimC', 2, '°C'],
    ['FC no início do último intervalo', 'fcFinalBpm', 1, 'bpm'],
    ['Início da sudorese', 'inicioSuorMin', 0, 'min'],
    ['Suor produzido na caminhada', 'suorSessaoL', 2, 'L'],
  ];
  el('tabela-aclima').querySelector('tbody').innerHTML = linhas.map(([rotulo, chave, casas, unidade]) =>
    `<tr><th scope="row">${rotulo}</th>${exibidos.map((p) => `<td>${Number.isFinite(p[chave]) ? fmt(p[chave], casas) + ' ' + unidade : '—'}</td>`).join('')}</tr>`).join('');
}

function recalcular({ comparacaoPausa = false } = {}) {
  const n = Number(horizonte.value);
  const novas = perfis.map((s) => s.value);
  const escolhaFase = el('fase-circadiana').value;
  const opcoes = novas.map((id, i) => ({
    frequenciaNoturna: el('frequencia-noturna').value,
    sonoDiurno: el('sono-diurno').value === 'sim',
    eventos: id === 'personalizada' ? editores[i].ler() : null,
    modoFase: escolhaFase === 'padrao' ? null : escolhaFase,
  }));
  const erro = el('erro-agenda');
  let novosResultados;
  try {
    novosResultados = novas.map((id, i) => {
      try {
        return simularTrajetoria(id, n, opcoes[i]);
      } catch (excecao) {
        if (!(excecao instanceof RangeError)) throw excecao;
        throw new RangeError(`Rotina ${i ? 'B' : 'A'}. ${excecao.message}`);
      }
    });
  } catch (excecao) {
    if (!(excecao instanceof RangeError)) throw excecao;
    erro.hidden = false;
    erro.textContent = excecao.message;
    return;
  }
  erro.hidden = true;
  rotinas = novas;
  configuracoes = opcoes;
  resultados = novosResultados;
  observacoes.clear();
  ativarIndicadoresTermicos(novas.every((id) => PERFIS_TRAJETORIA[id].termico),
    novas.every((id) => PERFIS_TRAJETORIA[id].aclimatacao));
  prepararGrafico();
  dia.replaceChildren(...resultados[0].dias.map((x) => new Option(`Dia ${x.dia} · ${DIAS_AGENDA[(x.dia - 1) % 7]}`, x.dia)));
  dia.value = n > 1 && novas.some((id) => PERFIS_TRAJETORIA[id].noite) ? 2 : 1;
  el('resumo-luz').hidden = !(novas.includes('luzSuave') && novas.includes('luzIntensa'));
  el('resumo-pausa').hidden = !comparacaoPausa;
  el('resumo-lanche').hidden = !(n === 5 && novas.includes('carboAs19') && novas.includes('carboAs0030'));
  el('resumo-escala').hidden = !novas.every((id) => id.startsWith('escala'));
  el('situacao').textContent = `${n} ${n === 1 ? 'dia calculado' : 'dias calculados'} por rotina.`;
  mostrarDia();
  mostrarExposicao();
  mostrarAclimatacao();
}

perfis.forEach((s) => s.addEventListener('change', ajustarControles));
function compararTurno(id, dias) {
  usarDiaInteiro();
  perfis[0].value = 'regular';
  el('fase-circadiana').value = 'padrao';
  perfis[1].value = id;
  horizonte.value = dias;
  passoGrafico.value = 'marcos';
  el('frequencia-noturna').value = 'uma';
  el('sono-diurno').value = 'nao';
  indicador.value = id === 'turno' ? 'saldoSono7d' : 'vigiliaMaxH';
  variavel.value = 'pressaoSono';
  instante.value = 84;
  ajustarControles();
  recalcular();
}
function mostrarTesteAclima(d) {
  dia.value = d;
  prepararGrafico(d);
  instante.value = '219';
  mostrarDia();
}
el('ver-inicial-aclima').addEventListener('click', () => mostrarTesteAclima(1));
el('ver-final-aclima').addEventListener('click', () => mostrarTesteAclima(12));
el('atalho-aclima').addEventListener('click', () => {
  perfis[0].value = 'aclimaFresco';
  perfis[1].value = 'aclimaQuente';
  horizonte.value = '12';
  passoGrafico.value = 'dias';
  janelaTermica.value = 'sessao';
  el('fase-circadiana').value = 'padrao';
  indicador.value = 'indiceAclima';
  variavel.value = 'centralC';
  instante.min = '207';
  instante.max = '231';
  instante.value = '219';
  ajustarControles();
  recalcular();
  mostrarTesteAclima(12);
});
el('atalho-termico').addEventListener('click', () => {
  perfis[0].value = 'arSeco';
  perfis[1].value = 'arUmido';
  horizonte.value = '1';
  passoGrafico.value = 'marcos';
  janelaTermica.value = 'sessao';
  el('fase-circadiana').value = 'padrao';
  indicador.value = 'picoCentralC';
  variavel.value = 'centralC';
  instante.min = '207';
  instante.max = '231';
  instante.value = '216';
  ajustarControles();
  recalcular();
});
el('atalho-luz').addEventListener('click', () => {
  usarDiaInteiro();
  perfis[0].value = 'luzSuave';
  perfis[1].value = 'luzIntensa';
  horizonte.value = '7';
  passoGrafico.value = 'dias';
  el('fase-circadiana').value = 'luz';
  indicador.value = 'faseCircadianaH';
  variavel.value = 'luzLux';
  instante.value = 12;
  ajustarControles();
  recalcular();
  dia.value = '2';
  mostrarDia();
});
el('atalho-pausa').addEventListener('click', () => {
  usarDiaInteiro();
  const tipo = el('pausa-comparar').value;
  const cenarios = { biofeedback: 'pausaBiofeedback', meditacao: 'pausaMeditacao', oracao: 'pausaOracao' };
  perfis[0].value = 'pausaControle';
  perfis[1].value = cenarios[tipo];
  horizonte.value = '2';
  passoGrafico.value = 'dias';
  el('fase-circadiana').value = 'fixa';
  indicador.value = 'pausaMin';
  variavel.value = tipo === 'biofeedback' ? 'ritmoOrientado' : 'pressaoSono';
  instante.value = 36;
  ajustarControles();
  recalcular({ comparacaoPausa: true });
  periodo.value = 1;
  dia.value = '2';
  mostrarPeriodo();
  mostrarDia();
});
el('atalho-escalas').addEventListener('click', () => {
  usarDiaInteiro();
  perfis[0].value = 'escalaNoite';
  perfis[1].value = 'escalaFolgas';
  horizonte.value = '56';
  passoGrafico.value = 'dias';
  el('fase-circadiana').value = 'padrao';
  indicador.value = 'faseCircadianaH';
  variavel.value = 'pressaoSono';
  instante.value = 84;
  ajustarControles();
  recalcular();
});
el('atalho-lanche').addEventListener('click', () => {
  usarDiaInteiro();
  perfis[0].value = 'carboAs19';
  perfis[1].value = 'carboAs0030';
  horizonte.value = '5';
  passoGrafico.value = 'dias';
  el('fase-circadiana').value = 'padrao';
  indicador.value = 'deltaAucCafe';
  variavel.value = 'glicemia';
  instante.value = 78;
  ajustarControles();
  recalcular();
  dia.value = '4';
  prepararGrafico(4);
  mostrarDia();
});
el('atalho-noite').addEventListener('click', () => compararTurno('plantao', '2'));
el('atalho-turno').addEventListener('click', () => compararTurno('turno', '365'));

el('configuracao').addEventListener('submit', (evento) => {
  evento.preventDefault();
  recalcular();
});
periodo.addEventListener('input', () => {
  mostrarPeriodo();
  dia.value = agregados[0][Number(periodo.value)].fim;
  mostrarDia();
});
indicador.addEventListener('change', mostrarPeriodo);
passoGrafico.addEventListener('change', () => prepararGrafico(Number(dia.value)));
dia.addEventListener('change', mostrarDia);
variavel.addEventListener('change', mostrarInstante);
instante.addEventListener('input', mostrarInstante);
janelaTermica.addEventListener('change', () => {
  sincronizarJanela();
  mostrarInstante();
});
painelDia.addEventListener('click', (evento) => {
  const inicio = Number(instante.min);
  instante.value = inicio + indiceNaSerie(painelDia, evento.clientX, Number(instante.max) - inicio + 1);
  mostrarInstante();
});
el('exportar').addEventListener('click', () => {
  const chaves = Object.keys(medidas);
  const linhas = [['rotina', 'cenario', 'dia', ...chaves].join(';')];
  for (const [i, { dias }] of resultados.entries()) {
    for (const p of dias) linhas.push([i ? 'B' : 'A', rotinas[i], p.dia, ...chaves.map((k) => p[k]?.toFixed(4).replace('.', ',') ?? '')].join(';'));
  }
  const url = URL.createObjectURL(new Blob(['\ufeff', linhas.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mosaico-alostase-trajetorias.csv';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
const observacao = el('observacao');
const janela = el('janela-observacao');
const tempo = el('tempo-observacao');
let relogioObservacao = null, alvoObservacao = 0;
function pararContagem() {
  clearInterval(relogioObservacao);
  relogioObservacao = null;
}
el('leitura-dia').addEventListener('click', (evento) => {
  const botao = evento.target.closest('[data-observar]');
  if (!botao) return;
  alvoObservacao = Number(botao.dataset.observar);
  const previa = observacoes.get(chaveObservacao(alvoObservacao));
  el('alvo-observacao').textContent = `Rotina ${alvoObservacao ? 'B' : 'A'} · dia ${dia.value}, ${hhmm(Number(instante.value))}`;
  tempo.value = '';
  janela.value = previa?.segundos ?? 60;
  el('ciclos-contados').value = previa?.ciclos ?? '';
  el('frequencia-observada').value = '';
  observacao.showModal();
});
el('fechar-observacao').addEventListener('click', () => observacao.close());
observacao.addEventListener('close', () => {
  pararContagem();
  el('leitura-dia').querySelector(`[data-observar="${alvoObservacao}"]`)?.focus();
});
janela.addEventListener('change', () => {
  pararContagem();
  tempo.value = '';
  el('frequencia-observada').value = '';
});
el('contar-tempo').addEventListener('click', () => {
  pararContagem();
  const fim = performance.now() + Number(janela.value) * 1000;
  const atualizar = () => {
    const segundos = Math.max(0, Math.ceil((fim - performance.now()) / 1000));
    tempo.value = segundos ? `${segundos} s` : 'Tempo concluído';
    if (!segundos) pararContagem();
  };
  relogioObservacao = setInterval(atualizar, 250);
  atualizar();
});
el('form-observacao').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const ciclos = Number(el('ciclos-contados').value);
  const segundos = Number(janela.value);
  observacoes.set(chaveObservacao(alvoObservacao), { ciclos, segundos });
  el('frequencia-observada').value = `${fmt(ciclos * 60 / segundos, 1)} ciclos/min pela sua contagem.`;
  mostrarInstante();
});

ajustarControles();
recalcular();
const observer = new ResizeObserver(() => {
  mostrarPeriodo();
  mostrarInstante();
});
observer.observe(painel);
observer.observe(painelDia);
