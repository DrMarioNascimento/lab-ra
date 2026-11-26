import { CENARIOS_HIDRICOS, SESSAO, simularHidratacao } from '../motor/bancada-hidrica.js?v=2';
import { resumirCardiovascular, simularCardiovascular } from '../motor/cardiovascular.js';
import { PARAMETROS_HIDRICOS } from '../motor/hidratacao.js';
import { regularRim } from '../motor/renal.js';
import { simularSemana } from '../motor/semana.js';
import { simularTrajetoria } from '../motor/trajetoria.js?v=7';
import { AREA_TERMICA_M2 } from '../motor/termorregulacao.js?v=2';

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

const plantaoLuzSuave = simularTrajetoria('luzSuave', 7);
const plantaoLuzIntensa = simularTrajetoria('luzIntensa', 7);

const termicos = ['arSeco', 'arUmido'].map((id) => simularTrajetoria(id, 1, { detalharDia: 0 }).leitura);
const inicioCaminhada = SESSAO.inicio / 5;
const termicoEm = (pontos, min) => pontos[inicioCaminhada + min / 5].termorregulacao;
const exercicioTermico = (pontos, minutos) => pontos.slice(inicioCaminhada, inicioCaminhada + minutos / 5).map((p) => p.termorregulacao);
const mediaCalor30 = (pontos) => exercicioTermico(pontos, 30).reduce((s, p) => s + p.armazenamentoW, 0) / (6 * AREA_TERMICA_M2);
const fimExercicioC = termicos.map((pontos) => termicoEm(pontos, 45).centralC);
const recuperacao15C = termicos.map((pontos) => termicoEm(pontos, 60).centralC);
const evap45 = termicos.map((pontos) => exercicioTermico(pontos, 45).reduce((s, p) => s + p.suorEvaporadoMl, 0));
const secretado45 = termicos.map((pontos) => exercicioTermico(pontos, 45).reduce((s, p) => s + p.suorProduzidoMl, 0));

const [controleCalor, aclimatado] = ['aclimaFresco', 'aclimaQuente'].map((id) => simularTrajetoria(id, 12).dias.at(-1));
const deltaAclima = (chave, casas) => n(aclimatado[chave] - controleCalor[chave], casas);

const fontes = {
  staessen: ['Staessen · 3.476 normotensos', 'https://pubmed.ncbi.nlm.nih.gov/1826069/'],
  speed: ['Speed · amostra ativa, medida em repouso', 'https://pubmed.ncbi.nlm.nih.gov/37115739/'],
  aclima: ['Lorenzo e colegas · tabela 2', 'https://doi.org/10.1152/japplphysiol.00495.2010'],
  suc: ['Heathcote e colegas · revisão de aquecimento passivo', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6306444/'],
  decaimento: ['Daanen e colegas · revisão sistemática', 'https://pubmed.ncbi.nlm.nih.gov/29129022/'],
  diasCalor: ['Estudo de aclimatação isoterma · tabela 1', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10119217/'],
  perdaAclima: ['Daanen, Racinais e Périard · revisão e meta-análise', 'https://doi.org/10.1007/s40279-017-0808-x'],
  termico: ['Che Muhamed e colegas · tabela 1, corredores treinados', 'https://doi.org/10.1080/23328940.2016.1182669'],
  latente: ['Gagnon e colegas · calorimetria direta', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3690695/'],
  recuperacao: ['Kenny e McGinn · tabela 1', 'https://doi.org/10.1152/japplphysiol.00517.2016'],
  suor: ['Baker · faixa em atletas', 'https://www.gssiweb.org/docs/default-source/sse-docs/baker_sse_161.pdf'],
  osmo: ['Fluids and Electrolytes · faixa laboratorial', 'https://www.ncbi.nlm.nih.gov/books/NBK610839/'],
  urina: ['MedlinePlus · cerca de 2 L de ingestão de líquidos', 'https://medlineplus.gov/ency/article/003425.htm'],
  tfg: ['Physiology, Glomerular Filtration Rate', 'https://www.ncbi.nlm.nih.gov/books/NBK500032/'],
  treino: ['Reimers · meta-análise de intervenções', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6306777/'],
  privacao: ['Skorucak e colegas · privação total de sono', 'https://doi.org/10.1093/sleep/zsy078'],
  processoS: ['Borbély e colegas · modelo de dois processos', 'https://pubmed.ncbi.nlm.nih.gov/26762182/'],
  turno: ['Gamboa Madeira e colegas · 45 estudos', 'https://pubmed.ncbi.nlm.nih.gov/34201492/'],
  metabolico: ['Pan e colegas · duas coortes de enfermeiras', 'https://pubmed.ncbi.nlm.nih.gov/22162955/'],
  curvaLuz: ['Khalsa e colegas · curva de resposta de fase', 'https://doi.org/10.1113/jphysiol.2003.040477'],
  doseLuz: ['Zeitzer e colegas · dose–resposta à luz', 'https://doi.org/10.1111/j.1469-7793.2000.00695.x'],
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
  ['Termorregulação no ar seco e úmido', [
    ['Calor armazenado em 30 minutos', 'Em corrida a 31 °C e 70% do VO₂máx, 66,3 W/m² a 23% de umidade e 100,2 W/m² a 71% (n = 11).', `${n(mediaCalor30(termicos[0]))} W/m² no seco e ${n(mediaCalor30(termicos[1]))} W/m² no úmido.`, 'Mesma direção. A caminhada simulada usa 40% do VO₂máx e umidades de 25% e 75%.', 'termico'],
    ['Temperatura central e recuperação', 'Em um protocolo de ciclismo a 24 °C e 49% de umidade, a temperatura esofágica subiu 0,7 °C em 45 min e estava 0,4 °C acima do repouso aos 15 min de recuperação.', `${n(fimExercicioC[0], 2)} → ${n(recuperacao15C[0], 2)} °C no seco e ${n(fimExercicioC[1], 2)} → ${n(recuperacao15C[1], 2)} °C no úmido.`, 'Comparação da ordem de grandeza e da recuperação. As temperaturas do motor são estimativas de um compartimento e os protocolos são distintos.', 'recuperacao'],
    ['Resfriamento pela evaporação', 'A evaporação de 1 g de suor a 30 °C retira cerca de 2.426 J, nas condições da calorimetria direta.', `${n(100 * evap45[0] / secretado45[0], 0)}% do suor produzido evaporou no seco e ${n(100 * evap45[1] / secretado45[1], 0)}% no úmido durante a caminhada.`, 'Frações simuladas. Todo o suor produzido conta na perda hídrica. O resfriamento evaporativo usa somente a parcela evaporada.', 'latente'],
    ['Produção total de suor', 'Após 30 min de corrida, a tabela apresenta 20,8 g/min a 23% e 19,4 g/min a 71%.', `${n(exercicioTermico(termicos[0], 30).reduce((s, p) => s + p.suorProduzidoMl, 0) / 30)} mL/min no seco e ${n(exercicioTermico(termicos[1], 30).reduce((s, p) => s + p.suorProduzidoMl, 0) / 30)} mL/min no úmido nos primeiros 30 min.`, 'O motor prevê mais secreção no úmido neste cenário. O estudo de corrida não mostrou a mesma diferença entre umidades. Intensidade, ventilação e amostra também diferem.', 'termico'],
  ]],
  ['Aclimatação ao calor', [
    ['Frequência cardíaca no fim do esforço', 'No ciclismo a 40 °C, a FC passou de 165 a 150 bpm entre a primeira e a décima exposição.', `${deltaAclima('fcFinalBpm', 1)} bpm no teste final, grupo calor menos grupo fresco.`, 'A magnitude do ciclismo é uma referência para o ganho do motor. A caminhada simulada usa outro protocolo.', 'aclima'],
    ['Temperatura central no fim do esforço', 'No mesmo ciclismo, 39,3 °C na primeira exposição e 38,8 °C na décima.', `${deltaAclima('centralFimC', 2)} °C no teste final, calor menos fresco.`, 'No teste úmido, a capacidade de evaporação limita o efeito térmico do aumento de suor.', 'aclima'],
    ['Sudorese no teste final', 'Em aclimatação isoterma a 50 °C, o estudo observou cerca de +0,4 L/h no dia 5 e +0,6 L/h no dia 10, em relação ao dia 1.', `${n((aclimatado.suorSessaoL - controleCalor.suorSessaoL) * 60 / 45, 2)} L/h no teste final, calor menos fresco.`, 'Faixa de comparação. O motor usa exposição mais leve e não reproduz o protocolo isotermo.', 'diasCalor'],
    ['Perda da adaptação da sudorese', 'Os estudos de perda de aclimatação mostram variação na retenção da resposta do suor.', 'Meia-vida de 14 dias sem exposição suficiente.', 'Hipótese didática para representar perda gradual, sem valor individual inferido.', 'decaimento'],
    ['Início da sudorese', 'Uma revisão relatou redução aproximada de 4 min em protocolos de repouso no calor e limiar central cerca de 0,31 °C menor em outros estudos.', `${controleCalor.inicioSuorMin} min no grupo fresco e ${aclimatado.inicioSuorMin} min no grupo calor.`, 'Estimativa didática. O início é o primeiro minuto em que o modelo secretaria pelo menos 0,10 L/h.', 'suc'],
    ['Perda da adaptação', 'Revisão estimou perda de aproximadamente 2,5% das adaptações de FC e temperatura por dia sem exposição. A evidência para o suor é menos definida.', 'O índice cardiovascular decai 2,5% por dia sem estímulo. O índice de suor fica estável neste recorte.', 'Hipóteses explícitas do motor. A queda da frequência durante o esforço usa o índice cardiovascular, e a temperatura responde ao balanço térmico.', 'perdaAclima'],
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
  ['Luz programada durante o plantão', [
    ['Horário da luz e direção do ajuste', 'O estudo observou atraso antes do mínimo da temperatura central e avanço depois desse mínimo.', 'Nas faixas próximas ao nadir do modelo, luz antes produz atraso e luz depois produz avanço.', 'A direção segue a curva humana; a forma e o ganho são aproximações.', 'curvaLuz'],
    ['Intensidade e saturação', 'Em um protocolo de início da noite biológica, cerca de 100 lux provocaram aproximadamente metade da resposta obtida com luz intensa.', 'O modelo usa 120 lux como ponto didático de meia resposta.', 'A relação depende do protocolo, da duração e do espectro. Lux fotópicos são uma aproximação.', 'doseLuz'],
    ['Cinco plantões e duas folgas', 'Em estudo distinto, após três plantões simulados e duas folgas, a fase da melatonina atrasou cerca de 4 h com intervenção de luz/escuro e 1 h no controle.', `${n(plantaoLuzSuave.estadoFinal.faseCircadianaH, 2)} h com 100 lux e ${n(plantaoLuzIntensa.estadoFinal.faseCircadianaH, 2)} h com 2.500 lux ao fim da semana.`, 'Comparação de ordem de grandeza. Somente a intensidade das 0h às 2h muda nesta simulação; os protocolos do estudo incluíram outras intervenções.', 'luz'],
  ]],
  ['Pausas na agenda', [
    ['Ritmo respiratório programado', '4–10 ciclos/min na revisão de respiração lenta', '5, 6 ou 7 ciclos/min durante a pausa', 'Frequência orientada na agenda. A prática abre separadamente. A página também calcula os ciclos por minuto a partir de uma contagem manual.', 'ritmo'],
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
