import { agruparTrajetoria, HORIZONTES, PERFIS_TRAJETORIA, simularTrajetoria } from '../motor/trajetoria.js?v=2';
import { PASSO_INTEGRADO } from '../motor/bancada-hidrica.js?v=2';
import { desenharSerie } from '../hidratacao/grafico.js?v=2';
import { criarEditor } from './editor.js';

const el = (id) => document.getElementById(id);
const perfis = [el('perfil-a'), el('perfil-b')];
const horizonte = el('horizonte');
const periodo = el('periodo');
const dia = el('dia-detalhe');
const instante = el('instante');
const painel = el('grafico');
const painelDia = el('grafico-dia');
const indicador = el('indicador');
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
  noitesEmClaro: ['Noites das 23h às 07h sem dormir', 'noites', 0],
  picoGlicemia: ['Pico de glicemia', 'mg/dL', 1], mediaCortisol: ['Cortisol médio', 'µg/dL', 2],
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
  pressaoSono: ['Pressão de sono', '0 a 1', 3], vigiliaContinua: ['Vigília contínua', 'h', 1], cortisol: ['Cortisol', 'µg/dL', 2], glicemia: ['Glicemia', 'mg/dL', 1],
};
const nomeHorizonte = { 1: '24 horas', 2: '48 horas', 7: '7 dias', 28: '4 semanas', 56: '8 semanas', 90: '90 dias', 180: '180 dias', 365: '365 dias' };
const fmt = (v, casas) => v.toLocaleString('pt-BR', { maximumFractionDigits: casas, minimumFractionDigits: casas });
const hhmm = (i) => {
  const min = i * PASSO_INTEGRADO;
  return [Math.floor(min / 60), min % 60].map((v) => String(v).padStart(2, '0')).join(':');
};
const valor = (p, k) => p[k] ?? p.renal[k] ?? p.renal.regulacao[k];
const classe = (i) => i ? 'rotina-b' : 'rotina-a';
let rotinas = [], configuracoes = [], resultados = [], agregados = [], curvas = [];
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
  const intervalo = p.inicio === p.fim ? '' : ` · dias ${p.inicio} a ${p.fim}`;
  el('periodo-rotulo').value = p.nome + intervalo + (p.parcial ? ' · parcial' : '');
  periodo.setAttribute('aria-valuetext', el('periodo-rotulo').value);
  desenharSerie(painel, agregados.map((a) => a.map((x) => x[indicador.value])), agregados[0].length,
    i, (j) => agregados[0][j].nomeCurto, casas);
  el('resultados').innerHTML = agregados.map((a, j) => `<article class="leitura-cardio ${classe(j)}">
    <h3>${PERFIS_TRAJETORIA[rotinas[j]].nome}</h3>
    <p>${nome} <strong>${fmt(a[i][indicador.value], casas)} ${unidade}</strong></p></article>`).join('');
}

function mostrarInstante() {
  const i = Number(instante.value);
  const [nome, unidade, casas] = medidasDia[variavel.value];
  el('hora').value = hhmm(i);
  instante.setAttribute('aria-valuetext', hhmm(i));
  desenharSerie(painelDia, curvas.map((a) => a.map((x) => valor(x, variavel.value))), curvas[0].length, i, hhmm, casas);
  el('leitura-dia').innerHTML = curvas.map((a, j) => `<article class="leitura-cardio ${classe(j)}">
    <h3>Rotina ${j ? 'B' : 'A'}</h3>
    <p>${nome} <strong>${fmt(valor(a[i], variavel.value), casas)} ${unidade}</strong></p>
    <p><strong>${a[i].atividade || (a[i].dormindo ? 'Em sono' : 'Em vigília')}</strong> · ${fmt(a[i].vigiliaContinua, 1)} h seguidas em vigília.</p>
    <p>FC ${fmt(a[i].fc, 1)} bpm · plasma ${fmt(a[i].plasmaL, 3)} L · ADH ${fmt(a[i].renal.regulacao.adh, 1)} · glicemia ${fmt(a[i].glicemia, 1)} mg/dL.</p>
    </article>`).join('');
}

function mostrarDia() {
  const selecionado = Number(dia.value);
  curvas = rotinas.map((id, i) => simularTrajetoria(id, selecionado, { ...configuracoes[i], detalharDia: selecionado - 1 }).leitura);
  mostrarInstante();
}

function ajustarControles() {
  perfis.forEach((s, i) => { paineisAgenda[i].hidden = s.value !== 'personalizada'; });
  el('opcoes-noite').hidden = !perfis.some((s) => PERFIS_TRAJETORIA[s.value]?.noite);
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

function recalcular() {
  const n = Number(horizonte.value);
  const novas = perfis.map((s) => s.value);
  const opcoes = novas.map((id, i) => ({
    frequenciaNoturna: el('frequencia-noturna').value,
    sonoDiurno: el('sono-diurno').value === 'sim',
    eventos: id === 'personalizada' ? editores[i].ler() : null,
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
  agregados = resultados.map((r) => agruparTrajetoria(r.dias));
  periodo.max = agregados[0].length - 1;
  periodo.disabled = agregados[0].length === 1;
  periodo.value = 0;
  dia.replaceChildren(...resultados[0].dias.map((x) => new Option(`Dia ${x.dia}`, x.dia)));
  dia.value = n > 1 && novas.some((id) => PERFIS_TRAJETORIA[id].noite) ? 2 : 1;
  el('situacao').textContent = `${n} ${n === 1 ? 'dia calculado' : 'dias calculados'} por rotina.`;
  mostrarPeriodo();
  mostrarDia();
  mostrarExposicao();
}

perfis.forEach((s) => s.addEventListener('change', ajustarControles));
function compararTurno(id, dias) {
  perfis[0].value = 'regular';
  perfis[1].value = id;
  horizonte.value = dias;
  el('frequencia-noturna').value = 'uma';
  el('sono-diurno').value = 'nao';
  indicador.value = id === 'turno' ? 'saldoSono7d' : 'vigiliaMaxH';
  variavel.value = 'pressaoSono';
  instante.value = 84;
  ajustarControles();
  recalcular();
}
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
dia.addEventListener('change', mostrarDia);
variavel.addEventListener('change', mostrarInstante);
instante.addEventListener('input', mostrarInstante);
el('exportar').addEventListener('click', () => {
  const chaves = Object.keys(medidas);
  const linhas = [['rotina', 'cenario', 'dia', ...chaves].join(';')];
  for (const [i, { dias }] of resultados.entries()) {
    for (const p of dias) linhas.push([i ? 'B' : 'A', rotinas[i], p.dia, ...chaves.map((k) => p[k].toFixed(4).replace('.', ','))].join(';'));
  }
  const url = URL.createObjectURL(new Blob(['\ufeff', linhas.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mosaico-alostase-trajetorias.csv';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
ajustarControles();
recalcular();
const observer = new ResizeObserver(() => {
  mostrarPeriodo();
  mostrarInstante();
});
observer.observe(painel);
observer.observe(painelDia);
