import { agruparTrajetoria, HORIZONTES, PERFIS_TRAJETORIA, simularTrajetoria } from '../motor/trajetoria.js';
import { PASSO_INTEGRADO } from '../motor/bancada-hidrica.js?v=2';
import { desenharSerie } from '../hidratacao/grafico.js?v=2';

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
  pressaoAoAcordar: ['Pressão de sono ao acordar', '0 a 1', 3],
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
  pressaoSono: ['Pressão de sono', '0 a 1', 3], cortisol: ['Cortisol', 'µg/dL', 2], glicemia: ['Glicemia', 'mg/dL', 1],
};
const nomeHorizonte = { 1: '24 horas', 2: '48 horas', 7: '7 dias', 28: '4 semanas', 56: '8 semanas', 90: '90 dias', 180: '180 dias', 365: '365 dias' };
const fmt = (v, casas) => v.toLocaleString('pt-BR', { maximumFractionDigits: casas, minimumFractionDigits: casas });
const hhmm = (i) => {
  const min = i * PASSO_INTEGRADO;
  return [Math.floor(min / 60), min % 60].map((v) => String(v).padStart(2, '0')).join(':');
};
const valor = (p, k) => p[k] ?? p.renal[k] ?? p.renal.regulacao[k];
const classe = (i) => i ? 'rotina-b' : 'rotina-a';
let rotinas = [], resultados = [], agregados = [], curvas = [];

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
    <p>FC ${fmt(a[i].fc, 1)} bpm · plasma ${fmt(a[i].plasmaL, 3)} L · ADH ${fmt(a[i].renal.regulacao.adh, 1)} · glicemia ${fmt(a[i].glicemia, 1)} mg/dL.</p>
    </article>`).join('');
}

function mostrarDia() {
  const selecionado = Number(dia.value);
  curvas = rotinas.map((id) => simularTrajetoria(id, selecionado, { detalharDia: selecionado - 1 }).leitura);
  mostrarInstante();
}

function recalcular() {
  const n = Number(horizonte.value);
  rotinas = perfis.map((s) => s.value);
  resultados = rotinas.map((id) => simularTrajetoria(id, n));
  agregados = resultados.map((r) => agruparTrajetoria(r.dias));
  periodo.max = agregados[0].length - 1;
  periodo.disabled = agregados[0].length === 1;
  periodo.value = 0;
  dia.replaceChildren(...resultados[0].dias.map((x) => new Option(`Dia ${x.dia}`, x.dia)));
  dia.value = 1;
  el('situacao').textContent = `${n} ${n === 1 ? 'dia calculado' : 'dias calculados'} por rotina.`;
  mostrarPeriodo();
  mostrarDia();
}

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
recalcular();
const observer = new ResizeObserver(() => {
  mostrarPeriodo();
  mostrarInstante();
});
observer.observe(painel);
observer.observe(painelDia);
