import { CENARIOS_HIDRICOS, PASSO_INTEGRADO, SESSAO, simularHidratacao } from '../motor/bancada-hidrica.js';
import { desenharSerie } from './grafico.js';

const elemento = (id) => document.getElementById(id);
const seletores = [elemento('rotina-a'), elemento('rotina-b')];
const instante = elemento('instante');
const variavel = elemento('variavel');
const grafico = elemento('grafico');
const nomes = { fresco: 'Ambiente fresco', calor: 'Ambiente quente', adiada: 'Calor, água 60 min depois', sodio: 'Calor, bebida com sódio' };
const variaveis = {
  plasmaL: ['Volume plasmático', 'L', 3], osmolalidade: ['Osmolalidade', 'mOsm/kg', 1],
  sodio: ['Sódio plasmático', 'mmol/L', 1], extracelularL: ['Volume extracelular', 'L', 2],
  variacaoAguaPct: ['Variação de água em relação à massa inicial', '%', 2],
  suorMl: ['Suor acumulado', 'mL', 0], urinaMl: ['Urina acumulada', 'mL', 0],
  fc: ['Frequência cardíaca', 'bpm', 1], sis: ['Pressão sistólica', 'mmHg', 1],
  dia: ['Pressão diastólica', 'mmHg', 1], pam: ['Pressão arterial média', 'mmHg', 1],
  volumeSistolico: ['Volume sistólico', 'mL', 1], debito: ['Débito cardíaco', 'L/min', 2],
  resistencia: ['Resistência vascular sistêmica', 'mmHg·min/L', 2],
};
let simulacoes = [];

const fmt = (valor, casas = 1) => valor.toLocaleString('pt-BR', { maximumFractionDigits: casas, minimumFractionDigits: casas });
const hhmm = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
const classe = (i) => i === 0 ? 'rotina-a' : 'rotina-b';

for (const [k, nome] of Object.entries(nomes)) {
  seletores.forEach((el) => el.add(new Option(nome, k)));
}
seletores[1].value = 'calor';
for (const [k, [nome, unidade]] of Object.entries(variaveis)) variavel.add(new Option(`${nome} (${unidade})`, k));

function recalcular() {
  simulacoes = seletores.map((el) => simularHidratacao(CENARIOS_HIDRICOS[el.value]));
  elemento('resumos').innerHTML = simulacoes.map(({ totais, resumo }, i) =>
    `<article class="leitura-cardio ${classe(i)}"><h3>${nomes[seletores[i].value]}</h3>
    <p>Suor no dia ${fmt(totais.suorL * 1000, 0)} mL · FC máxima no cenário ${fmt(resumo.maxFC)} bpm.</p></article>`).join('');
  selecionar(Number(instante.value));
}
function selecionar(indice) {
  const [nome, unidade, casas] = variaveis[variavel.value];
  instante.value = indice;
  const hora = hhmm(indice * PASSO_INTEGRADO);
  instante.setAttribute('aria-valuetext', hora);
  elemento('hora').value = hora;
  desenharSerie(grafico, simulacoes.map(({ pontos }) => pontos.map((p) => p[variavel.value])), simulacoes[0].pontos.length,
    indice, (i) => hhmm(i * PASSO_INTEGRADO), casas);
  elemento('contas').innerHTML = simulacoes.map(({ pontos }, i) => {
    const p = pontos[indice];
    return `<article class="leitura-cardio ${classe(i)}"><h3>Rotina ${i === 0 ? 'A' : 'B'}</h3>
      <p>${nome} <strong>${fmt(p[variavel.value], casas)} ${unidade}</strong></p>
      <ul class="conta">
        <li>No intervalo de 5 min, o corpo absorve ${fmt(p.aguaAbsorvida * 1000, 0)} mL e perde ${fmt(p.suorL * 1000, 0)} mL no suor, ${fmt(p.urinaL * 1000, 0)} mL na urina e ${fmt(p.perdaInsensivelL * 1000, 0)} mL em perdas insensíveis.</li>
        <li>O estado inicial do intervalo tem ${fmt(p.plasmaL, 3)} L de plasma, ${fmt(p.osmolalidade)} mOsm/kg e sódio plasmático de ${fmt(p.sodio)} mmol/L.</li>
        <li>Débito = FC (${fmt(p.fc)}) × volume sistólico (${fmt(p.volumeSistolico)} mL) ÷ 1.000 ≈ ${fmt(p.debito, 2)} L/min.</li>
        <li>PAM ≈ débito × resistência vascular (${fmt(p.resistencia, 2)}) = ${fmt(p.pam)} mmHg.</li>
      </ul></article>`;
  }).join('');
}
seletores.forEach((el) => el.addEventListener('change', recalcular));
variavel.addEventListener('change', () => selecionar(Number(instante.value)));
instante.addEventListener('input', () => selecionar(Number(instante.value)));
elemento('fim-exercicio').addEventListener('click', () => selecionar((SESSAO.inicio + SESSAO.duracao) / PASSO_INTEGRADO));
grafico.addEventListener('click', ({ clientX }) => {
  const area = grafico.getBoundingClientRect();
  const valor = Math.round((clientX - area.left - 58) * Number(instante.max) / (area.width - 78));
  selecionar(Math.min(Number(instante.max), Math.max(0, valor)));
});
recalcular();
new ResizeObserver(() => selecionar(Number(instante.value))).observe(grafico);
