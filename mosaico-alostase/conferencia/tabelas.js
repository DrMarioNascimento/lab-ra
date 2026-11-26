import { CENARIOS_HIDRICOS, SESSAO, simularHidratacao } from '../motor/bancada-hidrica.js?v=2';
import { resumirCardiovascular, simularCardiovascular } from '../motor/cardiovascular.js';
import { PARAMETROS_HIDRICOS } from '../motor/hidratacao.js';
import { regularRim } from '../motor/renal.js';
import { simularSemana } from '../motor/semana.js';
import { simularTrajetoria } from '../motor/trajetoria.js';

const n = (v, casas = 1) => v.toLocaleString('pt-BR', { maximumFractionDigits: casas, minimumFractionDigits: casas });
const pa = (p) => `${n(p.sis)} / ${n(p.dia)} mmHg`;
const faixa = (valores) => `${n(Math.min(...valores))} a ${n(Math.max(...valores))}`;
const basal = resumirCardiovascular(simularCardiovascular({ sono: [1380, 420] }));
const calor = simularHidratacao(CENARIOS_HIDRICOS.calor, { regular: regularRim });
const fresco = simularHidratacao(CENARIOS_HIDRICOS.fresco, { regular: regularRim });
const tfgBasal = calor.pontos[0].renal.tfg;
const quedaFC = simularTrajetoria('treino', 85).dias.at(-1).quedaFC;
const restricao = simularSemana(Array(14).fill({ sono: [{ inicio: 1, fim: 7 }], refeicoes: [], jornadas: [] }));

const fontes = {
  staessen: ['Staessen · 3.476 normotensos', 'https://pubmed.ncbi.nlm.nih.gov/1826069/'],
  speed: ['Speed · amostra ativa, medida em repouso', 'https://pubmed.ncbi.nlm.nih.gov/37115739/'],
  suor: ['Baker · faixa em atletas', 'https://www.gssiweb.org/docs/default-source/sse-docs/baker_sse_161.pdf'],
  osmo: ['Fluids and Electrolytes · faixa laboratorial', 'https://www.ncbi.nlm.nih.gov/books/NBK610839/'],
  urina: ['MedlinePlus · cerca de 2 L de ingestão de líquidos', 'https://medlineplus.gov/ency/article/003425.htm'],
  tfg: ['Physiology, Glomerular Filtration Rate', 'https://www.ncbi.nlm.nih.gov/books/NBK500032/'],
  treino: ['Reimers · meta-análise de intervenções', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/'],
  sono: ['Van Dongen · protocolo com 14 noites', 'https://pubmed.ncbi.nlm.nih.gov/12683469/'],
};

const tabelas = [
  ['Cardiovascular basal em 24 horas', [
    ['PA média em 24 h', '115–120 / 70–75 mmHg', pa(basal.dia), 'Dentro da faixa publicada.', 'staessen'],
    ['PA média em vigília', '120–125 / 75–80 mmHg', pa(basal.vigilia), 'Calibração com a mesma base.', 'staessen'],
    ['PA média durante o sono', '105–110 / 60–65 mmHg', pa(basal.sono), 'O modelo fica 0,4 mmHg acima dos dois limites superiores.', 'staessen'],
    ['FC diurna em repouso', '54,5 ± 8,0 bpm', `${n(basal.vigilia.fc)} bpm`, 'Comparação de escala. O estudo selecionou períodos de repouso.', 'speed'],
    ['FC noturna em repouso', '50,5 ± 7,6 bpm', `${n(basal.sono.fc)} bpm`, 'Os valores de Speed são âncoras do modelo.', 'speed'],
  ]],
  ['Hidratação, suor e função renal', [
    ['Sudorese no exercício', '0,5–2,0 L/h', `${n(calor.totais.suorL * 60 / SESSAO.duracao, 2)} L/h`, 'Calor. A faixa de atletas é uma referência de ordem de grandeza.', 'suor'],
    ['Sódio do suor', '10–90 mmol/L', `${n(PARAMETROS_HIDRICOS.sodioSuorMgL / PARAMETROS_HIDRICOS.mgPorMmolSodio)} mmol/L`, 'Parâmetro didático dentro da faixa.', 'suor'],
    ['Osmolalidade plasmática', '275–295 mOsm/kg', `${faixa(calor.pontos.map((p) => p.osmolalidade))} mOsm/kg`, 'Mínimo e máximo do dia no calor.', 'osmo'],
    ['Urina em 24 h', '0,8–2,0 L', `${n(fresco.totais.urinaL, 2)} L (fresco) / ${n(calor.totais.urinaL, 2)} L (calor)`, 'O cenário inclui 2,4 L de água de bebidas e refeições.', 'urina'],
    ['Filtração glomerular de repouso', '≈120 mL/min', `${n(tfgBasal)} mL/min`, 'Valor basal adotado no modelo.', 'tfg'],
  ]],
  ['Semanas e meses', [
    ['FC de repouso após treino de endurance', 'Redução média de 2,7–5,8 bpm entre análises por sexo', `−${n(quedaFC, 2)} bpm após 12 semanas`, 'Comparação de magnitude. A meta-análise reúne intervenções com durações diferentes. O motor usa uma meia-vida didática.', 'treino'],
    ['Índice de vigília em excesso', 'Referência de 15,84 h de vigília, ajustada a lapsos de atenção', `${n(restricao.dividaFinal, 2)} h em 14 dias de 6 h de sono`, 'Reconstrução do índice cumulativo do protocolo. A trajetória usa uma janela de sete dias, sem extrapolar desempenho cognitivo.', 'sono'],
  ]],
];

document.querySelector('#tabelas').innerHTML = tabelas.map(([titulo, linhas]) => `<section class="painel">
  <h2>${titulo}</h2>
  <table><thead><tr><th scope="col">Variável</th><th scope="col">Literatura</th><th scope="col">Motor</th></tr></thead>
  <tbody>${linhas.map(([variavel, ref, sim, nota, fonte]) => {
    const [autor, url] = fontes[fonte];
    return `<tr><th scope="row">${variavel}</th><td>${ref}<small><a href="${url}">${autor}</a></small></td><td>${sim}<small>${nota}</small></td></tr>`;
  }).join('')}</tbody></table>
</section>`).join('');
