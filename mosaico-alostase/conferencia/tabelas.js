import { CENARIOS_HIDRICOS, SESSAO, simularHidratacao } from '../motor/bancada-hidrica.js?v=2';
import { resumirCardiovascular, simularCardiovascular } from '../motor/cardiovascular.js';
import { PARAMETROS_HIDRICOS } from '../motor/hidratacao.js';
import { regularRim } from '../motor/renal.js';
import { simularSemana } from '../motor/semana.js';
import { simularTrajetoria } from '../motor/trajetoria.js?v=3';

const n = (v, casas = 1) => v.toLocaleString('pt-BR', { maximumFractionDigits: casas, minimumFractionDigits: casas });
const pa = (p) => `${n(p.sis)} / ${n(p.dia)} mmHg`;
const faixa = (valores) => `${n(Math.min(...valores))} a ${n(Math.max(...valores))}`;
const basal = resumirCardiovascular(simularCardiovascular({ sono: [1380, 420] }));
const calor = simularHidratacao(CENARIOS_HIDRICOS.calor, { regular: regularRim });
const fresco = simularHidratacao(CENARIOS_HIDRICOS.fresco, { regular: regularRim });
const tfgBasal = calor.pontos[0].renal.tfg;
const quedaFC = simularTrajetoria('treino', 85).dias.at(-1).quedaFC;
const restricao = simularSemana(Array(14).fill({ sono: [{ inicio: 1, fim: 7 }], refeicoes: [], jornadas: [] }));

const plantao = simularTrajetoria('plantao', 2, { detalharDia: 1 });
const diurno = simularTrajetoria('regular', 2, { detalharDia: 1 });
const turno = simularTrajetoria('turno', 365);
const noiteAno = turno.dias.reduce((s, p) => s + p.trabalhoNoturnoH, 0);

const semanaFixa = simularTrajetoria('escalaNoite', 7);
const faseCincoDias = semanaFixa.dias[4].faseCircadianaH;
const semanaFolgas = simularTrajetoria('escalaFolgas', 7);
const soma = (dados, chave) => dados.dias.reduce((total, d) => total + d[chave], 0);

const fontes = {
  staessen: ['Staessen · 3.476 normotensos', 'https://pubmed.ncbi.nlm.nih.gov/1826069/'],
  speed: ['Speed · amostra ativa, medida em repouso', 'https://pubmed.ncbi.nlm.nih.gov/37115739/'],
  suor: ['Baker · faixa em atletas', 'https://www.gssiweb.org/docs/default-source/sse-docs/baker_sse_161.pdf'],
  osmo: ['Fluids and Electrolytes · faixa laboratorial', 'https://www.ncbi.nlm.nih.gov/books/NBK610839/'],
  urina: ['MedlinePlus · cerca de 2 L de ingestão de líquidos', 'https://medlineplus.gov/ency/article/003425.htm'],
  tfg: ['Physiology, Glomerular Filtration Rate', 'https://www.ncbi.nlm.nih.gov/books/NBK500032/'],
  treino: ['Reimers · meta-análise de intervenções', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/'],
  privacao: ['Skorucak e colegas · privação total de sono', 'https://doi.org/10.1093/sleep/zsy078'],
  processoS: ['Borbély e colegas · modelo de dois processos', 'https://pubmed.ncbi.nlm.nih.gov/26762182/'],
  turno: ['Gamboa Madeira e colegas · 45 estudos', 'https://pubmed.ncbi.nlm.nih.gov/34201492/'],
  metabolico: ['Pan e colegas · duas coortes de enfermeiras', 'https://pubmed.ncbi.nlm.nih.gov/22162955/'],
  luz: ['Smith, Cullnan e Eastman · tabela 2', 'https://stacks.cdc.gov/view/cdc/187008/cdc_187008_DS1.pdf'],
  ritmo: ['Russo e colegas · respiração lenta em pessoas saudáveis', 'https://doi.org/10.1183/20734735.009817'],
  vfc: ['Laborde e colegas · revisão e meta-análise', 'https://pubmed.ncbi.nlm.nih.gov/35623448/'],
  meditacao: ['Mandlik e colegas · estudo de sessão única', 'https://doi.org/10.1002/smi.3324'],
  fase: ['Folkard · revisão da fase da melatonina', 'https://pubmed.ncbi.nlm.nih.gov/18533325/'],
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
  ['Noite em claro e turno permanente', [
    ['Vigília contínua', 'Cerca de 40 h de vigília sustentada no protocolo de privação total', `${n(plantao.dias[1].vigiliaMaxH, 0)} h no plantão sem sono diurno`, 'Comparação da duração do protocolo. Os horários do cenário determinam este valor.', 'privacao'],
    ['Pressão de sono às 07h', 'O Processo S cresce na vigília e cai no sono', `${n(diurno.dias[1].pressaoAoAcordar, 3)} com sono / ${n(plantao.dias[1].pressaoAoAcordar, 3)} após plantão`, 'Conferência da direção. A escala de 0 a 1 pertence ao motor.', 'processoS'],
    ['Pressão arterial em trabalhadores noturnos permanentes', '+2,52 mmHg sistólica (IC95% 0,75–4,29) e +1,76 mmHg diastólica (0,41–3,12) entre grupos', `${n(noiteAno, 0)} h de trabalho na janela 22h–07h em 365 dias`, 'O motor calcula a exposição. A diferença entre grupos é referência externa, sem ajuste individual nem prazo de aparecimento.', 'turno'],
    ['Diabetes tipo 2 e turno noturno rotativo', 'Após 20 anos ou mais de exposição em duas coortes de enfermeiras, HR 1,24 (IC95% 1,13–1,37) após ajuste pelo IMC', 'O motor calcula a glicemia ligada aos horários e às refeições', 'O risco ao longo de décadas vem das coortes e pertence ao contexto clínico. Esse resultado diz respeito a turnos rotativos.', 'metabolico'],
    ['Ajuste do relógio biológico ao turno', 'A adaptação da fase da melatonina variou entre trabalhadores', 'A fase fixa serve de controle. As escalas semanais também permitem ajuste parcial.', 'Hipótese didática sem medição da luz nem da adaptação individual.', 'fase'],
    ['Atraso da fase da melatonina', 'Cerca de 4 h com intervenção de luz/escuro e 1 h no controle, após três plantões simulados e duas folgas', `${n(faseCincoDias, 2)} h no 5º dia de sono diurno do cenário fixo`, 'Comparação de ordem de grandeza sob protocolos distintos. O motor usa a agenda de sono como aproximação; o estudo mediu DLMO sob luz fraca.', 'luz'],
    ['Carga igual na comparação de escalas', 'O horário e a adaptação da fase são dimensões distintas da duração do sono', `${soma(semanaFixa, 'horasSono')} / ${soma(semanaFolgas, 'horasSono')} h de sono e ${soma(semanaFixa, 'trabalhoH')} / ${soma(semanaFolgas, 'trabalhoH')} h de trabalho por semana`, 'Controle do cenário, com o horário do sono como diferença experimental.', 'fase'],
  ]],
  ['Pausas na agenda', [
    ['Ritmo respiratório programado', '4–10 ciclos/min na revisão de respiração lenta', '5, 6 ou 7 ciclos/min durante a pausa', 'Frequência orientada na agenda. A prática de biofeedback abre separadamente.', 'ritmo'],
    ['Variabilidade da frequência cardíaca', 'Aumento de indicadores vagais de VFC durante a respiração lenta na meta-análise', 'Ritmo marcado no horário da sessão', 'A VFC exigiria sinais batimento a batimento. As curvas do Mosaico não atribuem um valor numérico de VFC à pausa.', 'vfc'],
    ['Meditação e reatividade ao estresse', 'Revisão de sessões únicas encontrou resultados favoráveis em parte dos estudos, com protocolos e desfechos diferentes', 'Minutos programados de pausa', 'Meditação e oração podem ser agendadas. Nenhuma redução fixa de PA ou cortisol é atribuída automaticamente a essas atividades.', 'meditacao'],
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
