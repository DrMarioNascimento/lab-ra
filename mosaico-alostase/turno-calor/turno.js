import { atividadeNoTurno, FIM_TURNO_MIN, FIM_OBSERVACAO_MIN, simularTurnoCalor } from '../motor/turno-calor.js?v=3';
import { desenharSerie, indiceNaSerie } from '../hidratacao/grafico.js?v=3';

const el = (id) => document.getElementById(id);
const variaveis = [
  { nome: 'Temperatura central', ler: (p) => p.centralC, casas: 2, unidade: '°C' },
  { nome: 'Osmolalidade plasmática', ler: (p) => p.osmolalidade, casas: 1, unidade: 'mOsm/kg' },
  { nome: 'Volume plasmático', ler: (p) => p.plasmaL, casas: 2, unidade: 'L' },
  { nome: 'Suor acumulado', ler: (p) => p.suor, casas: 2, unidade: 'L' },
  { nome: 'Suor evaporado', ler: (p) => p.suorEvaporado, casas: 2, unidade: 'L' },
  { nome: 'Sódio plasmático', ler: (p) => p.sodio, casas: 1, unidade: 'mmol/L' },
  { nome: 'Frequência cardíaca', ler: (p) => p.fc, casas: 1, unidade: 'bpm' },
  { nome: 'Volume sistólico', ler: (p) => p.volumeSistolico, casas: 1, unidade: 'mL/bat' },
  { nome: 'Débito cardíaco', ler: (p) => p.debito, casas: 2, unidade: 'L/min' },
  { nome: 'Pressão arterial média', ler: (p) => p.pam, casas: 1, unidade: 'mmHg' },
  { nome: 'Renina', ler: (p) => p.regulacao.renina, casas: 0, unidade: '' },
  { nome: 'Angiotensina II', ler: (p) => p.regulacao.angII, casas: 0, unidade: '' },
  { nome: 'Aldosterona', ler: (p) => p.regulacao.aldosterona, casas: 0, unidade: '' },
  { nome: 'Vasopressina (ADH)', ler: (p) => p.regulacao.adh, casas: 0, unidade: '' },
  { nome: 'Urina acumulada', ler: (p) => p.urina, casas: 2, unidade: 'L' },
];
const [temperatura, osmolalidade] = variaveis;
const medidas = [...variaveis,
  { nome: 'Água ingerida até o instante', ler: (p) => p.aguaMl, casas: 0, unidade: 'mL' },
  { nome: 'Água em absorção', ler: (p) => p.aguaDigestivaL * 1000, casas: 0, unidade: 'mL' },
];
const numero = (x, casas) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }).format(x);
const formatar = (v, p) => [numero(v.ler(p), v.casas), v.unidade].filter(Boolean).join(' ');
for (const [i, v] of variaveis.entries()) el('variavel').add(new Option(v.nome, i));

let series;
const inicio = () => Number(el('inicio').value);
function horario(min) {
  const hora = (inicio() * 60 + min) % 1440;
  return `${String(Math.floor(hora / 60)).padStart(2, '0')}:${String(hora % 60).padStart(2, '0')}`;
}
function curva() {
  const v = variaveis[Number(el('variavel').value)] ?? temperatura;
  desenharSerie(el('curva'), series.map((pontos) => pontos.map(v.ler)), FIM_OBSERVACAO_MIN + 1,
    Number(el('momento').value), horario, v.casas);
}
function linha(rotulo, v, min) {
  return `<tr><th scope="row">${rotulo}</th>${series.map((pontos) => `<td>${formatar(v, pontos[min])}</td>`).join('')}</tr>`;
}
function atualizarMomento() {
  const min = Number(el('momento').value);
  el('hora').textContent = horario(min);
  el('momento').setAttribute('aria-valuetext', horario(min));
  const doses = series.flatMap((pontos, i) => {
    const { entradaMl } = pontos[min];
    return entradaMl ? [`${i ? 'Água no fim' : 'Água nas pausas'} recebe ${numero(entradaMl, 0)} mL neste horário.`] : [];
  });
  el('fase').textContent = [`${atividadeNoTurno(min)}.`, ...doses].join(' ');
  el('estado').innerHTML = medidas.map((v) => linha(v.nome, v, min)).join('');
  curva();
}
function atualizarTurno() {
  series = ['pausas', 'fim'].map((cenario) => simularTurnoCalor(cenario, inicio()));
  el('marcos').innerHTML = [[FIM_TURNO_MIN, 'Fim do turno'], [FIM_TURNO_MIN + 60, 'Após 1 h'], [FIM_OBSERVACAO_MIN, 'Após 2 h']]
    .map(([min, nome]) => linha(`${nome} <small>${horario(min)}</small>`, osmolalidade, min)).join('');
  atualizarMomento();
}

el('inicio').addEventListener('change', atualizarTurno);
el('variavel').addEventListener('change', curva);
el('momento').addEventListener('input', atualizarMomento);
el('curva').addEventListener('click', (evt) => {
  el('momento').value = indiceNaSerie(el('curva'), evt.clientX, FIM_OBSERVACAO_MIN + 1);
  atualizarMomento();
});
atualizarTurno();
new ResizeObserver(curva).observe(el('curva'));
