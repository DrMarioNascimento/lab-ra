export const VERSION = '0.3.0';
export const PROFILES = {
 escritorio:{name:'Trabalho e vida urbana',brief:'Prazos, deslocamento e tempo para cuidar de si.',physical:.15,cognitive:1,control:55,shift:false,fitness:40,strength:35,support:55,commute:1},
 estudo:{name:'Estudo e trabalho',brief:'Estudo, entregas e uma rotina com pouco tempo disponível.',physical:.2,cognitive:1.2,control:45,shift:false,fitness:38,strength:32,support:55,commute:1.5},
 turnos:{name:'Vida em turnos',brief:'Horários variáveis, transporte e recuperação entre jornadas.',physical:.55,cognitive:.9,control:35,shift:true,fitness:42,strength:42,support:50,commute:1},
 cuidado:{name:'Trabalho e cuidado familiar',brief:'Responsabilidades de cuidado, interrupções e rede de apoio.',physical:.4,cognitive:1,control:40,shift:false,fitness:36,strength:36,support:45,commute:.5},
 movimento:{name:'Rotina fisicamente ativa',brief:'Trabalho em movimento, ambiente e exercício planejado.',physical:.85,cognitive:.6,control:50,shift:false,fitness:50,strength:48,support:55,commute:1}
};
export const METRICS = [
 ['water','Equilíbrio hídrico','recursos',-4,4,'Faixa próxima de zero','Desvio abstrato da faixa de equilíbrio. Não representa litros. Crédito excessivo também pode afastar da faixa.'],
 ['fuel','Reserva de combustível','recursos',0,100,'Disponibilidade','Índice de substrato disponível para tarefas; não equivale a glicemia, ATP ou gordura corporal.'],
 ['sleepDebt','Recuperação de sono pendente','sono',0,32,'Menor é favorável','Unidades didáticas de recuperação pendente. Não são horas de sono a repor em proporção de um para um.'],
 ['sleepQuality','Continuidade do sono','sono',0,100,'Continuidade','Índice que responde a interrupções, ativação, cafeína tardia e alinhamento de horário.'],
 ['circadian','Desalinhamento de horário','sono',0,100,'Menor é favorável','Mudanças de horário acumulam desalinhamento; rotina consistente favorece redução gradual.'],
 ['mental','Fadiga cognitiva','carga',0,100,'Menor é favorável','Demanda recente, sono e ativação contribuem para a disponibilidade cognitiva.'],
 ['physical','Fadiga física','carga',0,100,'Menor é favorável','Saldo entre demanda física e recuperação. Fadiga não significa lesão.'],
 ['tissue','Carga musculoesquelética residual','carga',0,100,'Menor é favorável','Representa persistência de demanda mecânica, sem diagnosticar lesão.'],
 ['arousal','Ativação','regulacao',0,100,'Depende da tarefa','Ativação não é ruim em si. Persistência elevada pode contribuir para recuperação incompleta.'],
 ['wear','Desgaste acumulado','carga',0,100,'Menor é favorável','Índice lento de demandas não recuperadas. Não é marcador clínico de carga alostática.'],
 ['heat','Exigência térmica residual','ambiente',0,100,'Menor é favorável','Índice influenciado por ambiente, esforço, sombra e adaptação. Não é temperatura corporal.'],
 ['glare','Desconforto por luminosidade','ambiente',0,100,'Menor é favorável','Proteção visual reduz desconforto no modelo; não altera automaticamente a carga térmica.'],
 ['comfort','Desconforto de necessidades básicas','recursos',0,100,'Menor é favorável','Adiar banheiro e pausas interfere no conforto. Não há previsão de doença renal.'],
 ['fitness','Capacidade aeróbia','adaptacao',0,100,'Específica','Muda lentamente com estímulo e recuperação; não representa VO₂max medido.'],
 ['strength','Capacidade de força','adaptacao',0,100,'Específica','Adaptação relacionada ao tipo de estímulo; não é intercambiável com capacidade aeróbia.'],
 ['heatAdapt','Adaptação ao calor','adaptacao',0,100,'Específica','Adaptação gradual e reversível. A exposição extrema não oferece ganho ilimitado.'],
 ['regulation','Repertório de autorregulação','adaptacao',0,100,'Específico','Convenção de aprendizagem gradual de práticas de regulação; não mede personalidade.'],
 ['support','Apoio disponível','contexto',0,100,'Recurso de contexto','Índice contextual da rede de apoio, sem atribuição de valor moral ou afetivo.'],
 ['backlog','Demandas pendentes','contexto',0,100,'Menor é favorável','Pendências operacionais afetam pressão; não são uma variável biológica.'],
 ['caffeine','Estímulo residual','regulacao',0,100,'Depende do horário','Exposição abstrata à cafeína, sem dose em mg nem recomendação de consumo.'],
 ['readiness','Disponibilidade funcional','funcao',0,100,'Depende da tarefa','Síntese operacional para limitar tarefas; os componentes permanecem visíveis.'],
 ['attention','Desempenho de atenção','funcao',0,100,'Capacidade simulada','Indicador calculado do estado, não medido do jogador.'],
 ['perceived','Cansaço percebido','funcao',0,100,'Percepção simulada','Pode diferir do desempenho; não infere como o estudante se sente.']
];
export const FIELDS = [
 {key:'work',sector:'rotina',label:'Trabalho / estudo nos dias de atividade',unit:'h',min:0,max:12,step:.5,default:8},
 {key:'demand',sector:'rotina',label:'Intensidade da tarefa',options:[[.65,'Reduzida'],[1,'Habitual'],[1.35,'Intensa']],default:1},
 {key:'commute',sector:'rotina',label:'Tempo de deslocamento',unit:'h',min:0,max:3,step:.25,default:1},
 {key:'autonomy',sector:'rotina',label:'Uso da autonomia disponível',options:[[0,'Manter organização'],[1,'Reorganizar e negociar']],default:0},
 {key:'exercise',sector:'movimento',label:'Exercício por sessão',unit:'min',min:0,max:120,step:10,default:30},
 {key:'exerciseDays',sector:'movimento',label:'Sessões por semana',options:[[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6'],[7,'7']],default:3},
 {key:'intensity',sector:'movimento',label:'Intensidade relativa',options:[[.5,'Leve'],[1,'Moderada'],[1.6,'Elevada']],default:1},
 {key:'exerciseType',sector:'movimento',label:'Estímulo predominante',options:[['aerobic','Aeróbio'],['strength','Força'],['mixed','Misto']],default:'mixed'},
 {key:'activeTravel',sector:'movimento',label:'Parte do deslocamento em movimento',options:[[0,'Nenhuma'],[.25,'Um quarto'],[.5,'Metade']],default:0},
 {key:'sleep',sector:'cuidados',label:'Oportunidade de sono',unit:'h',min:4,max:10,step:.5,default:8},
 {key:'bedtime',sector:'cuidados',label:'Horário planejado para dormir',options:[[21,'21h'],[22,'22h'],[23,'23h'],[24,'0h'],[25,'1h'],[26,'2h'],[27,'3h']],default:23},
 {key:'nutrition',sector:'cuidados',label:'Reposição alimentar',options:[[.65,'Insuficiente para a demanda'],[1,'Compatível com a demanda'],[1.3,'Acima da demanda']],default:1},
 {key:'hydration',sector:'cuidados',label:'Reposição de água',options:[[.6,'Abaixo das perdas'],[1,'Compatível com as perdas'],[1.5,'Acima das perdas']],default:1},
 {key:'breaks',sector:'cuidados',label:'Pausas durante a atividade',unit:'min',min:0,max:60,step:10,default:20},
 {key:'toilet',sector:'cuidados',label:'Necessidades básicas',options:[[1,'Atender quando necessário'],[0,'Adiar repetidamente']],default:1},
 {key:'meditation',sector:'regulacao',label:'Meditação / prática respiratória',unit:'min',min:0,max:60,step:5,default:10},
 {key:'leisure',sector:'regulacao',label:'Lazer e descanso escolhido',unit:'min',min:0,max:180,step:15,default:45},
 {key:'contact',sector:'regulacao',label:'Convívio e apoio',unit:'min',min:0,max:120,step:15,default:30},
 {key:'caffeine',sector:'regulacao',label:'Cafeína no cenário',options:[[0,'Sem consumo'],[1,'Uso pela manhã'],[2,'Uso também no fim do dia']],default:0},
 {key:'temperature',sector:'ambiente',label:'Temperatura do cenário',unit:'°C',min:18,max:38,step:1,default:24},
 {key:'noise',sector:'ambiente',label:'Ruído / interrupções ambientais',options:[[0,'Baixo'],[1,'Moderado'],[2,'Elevado']],default:1},
 {key:'shade',sector:'ambiente',label:'Proteção do ambiente',options:[[1,'Organizar sombra / abrigo'],[0,'Sem adaptação']],default:1},
 {key:'glasses',sector:'ambiente',label:'Conforto visual',options:[[1,'Proteção adequada à luminosidade'],[0,'Sem ajuste']],default:1}
];
export const SECTORS = {
 rotina:{name:'Rotina e compromissos',brief:'Trabalho, estudo, transporte e prazos.',color:'#ee9d76'},
 movimento:{name:'Movimento e esforço',brief:'Exercício, intensidade e deslocamento ativo.',color:'#8fbcae'},
 cuidados:{name:'Cuidados e recuperação',brief:'Sono, alimentação, água e necessidades básicas.',color:'#b8b6e5'},
 regulacao:{name:'Regulação e relações',brief:'Pausas de regulação, lazer e apoio.',color:'#e8bf78'},
 ambiente:{name:'Ambiente',brief:'Calor, ruído, sombra e conforto visual.',color:'#8cb8ce'},
 fisiologia:{name:'Fisiologia e integração',brief:'Inspecionar os saldos, aprovar a previsão e executar.',color:'#dba5ad'}
};
export function teams(count=5,students=35,rotation=0) {
 const groups=count===4?[['rotina'],['movimento','ambiente'],['cuidados','regulacao'],['fisiologia']]:count===5?[['rotina'],['movimento','ambiente'],['cuidados'],['regulacao'],['fisiologia']]:[['rotina'],['movimento'],['cuidados'],['regulacao'],['ambiente'],['fisiologia']];
 return groups.map((sectors,i)=>({id:i,sectors,name:sectors.map(s=>SECTORS[s].name).join(' + '),team:((i+rotation)%count)+1,size:Math.floor(students/count)+(i<students%count?1:0)}));
}
const families = [
 ['Prazos', {pressure:12,demand:.2}, [
 ['Uma entrega se aproxima','Há um prazo que compete com o tempo de recuperação.'],
 ['O projeto ganhou uma etapa','A tarefa ficou mais exigente, mas a duração planejada continua sob sua decisão.'],
 ['O grupo precisa de uma resposta','O trabalho depende de coordenação e traz pressão adicional.'],
 ['Uma revisão inesperada','Será preciso revisar parte do que já estava pronto.'],
 ['Fechamento de ciclo','As entregas se concentram neste dia.']]],
 ['Transporte',{travel:.5,pressure:4},[
 ['Deslocamento demorado','O trajeto exige mais tempo hoje. A folga da agenda será usada primeiro.'],
 ['Mudança de percurso','O trajeto habitual está indisponível.'],
 ['Conexão perdida','Uma espera adicional alonga o deslocamento.'],
 ['Chuva no caminho','O transporte fica mais demorado, sem transformar chuva automaticamente em doença.'],
 ['Trânsito no retorno','O caminho para casa toma parte do tempo disponível.']]],
 ['Calor',{temperature:5,light:12},[
 ['Uma tarde quente','O ambiente acrescenta demanda térmica às atividades.'],
 ['Atividade ao ar livre','Calor e luminosidade acompanham parte da rotina.'],
 ['Sala abafada','O ambiente oferece menos conforto térmico.'],
 ['Sol no trajeto','A luminosidade aumenta o desconforto quando falta proteção.'],
 ['Semana de temperaturas altas','O calor de hoje se soma ao estado construído nos dias anteriores.']]],
 ['Interrupções',{interrupt:.7,pressure:5},[
 ['Uma noite interrompida','A continuidade do sono será menor neste ciclo.'],
 ['Responsabilidade de cuidado','Uma demanda de cuidado interrompe parte do descanso.'],
 ['Barulho durante a noite','O horário reservado não garante sono contínuo.'],
 ['Um chamado inesperado','Há uma interrupção do período de repouso.'],
 ['Preocupação que atravessa a noite','Uma demanda permanece ativa durante parte do descanso.']]],
 ['Apoio',{support:6,pressure:-5},[
 ['Uma tarefa compartilhada','Há apoio disponível para enfrentar o dia.'],
 ['Conversa que organiza','O contato ajuda a esclarecer uma demanda.'],
 ['Ajuda no cuidado','Uma responsabilidade pode ser dividida.'],
 ['Equipe disponível','O suporte do grupo reduz parte da pressão contextual.'],
 ['Rede de apoio presente','O personagem recebe apoio neste dia.']]],
 ['Autonomia',{control:15,pressure:-3},[
 ['Prazo com flexibilidade','É possível reorganizar parte da rotina.'],
 ['Mais controle da agenda','Há margem para escolher a sequência das atividades.'],
 ['Uma reunião foi dispensada','A pressão contextual diminui, mantendo as escolhas de duração.'],
 ['Ambiente cooperativo','O trabalho oferece mais espaço para negociação.'],
 ['Previsibilidade','O dia traz menos incerteza do que o habitual.']]],
 ['Exigência mental',{pressure:8,noise:1},[
 ['Estudo concentrado','A tarefa pede atenção em meio a interrupções.'],
 ['Muitas solicitações','A rotina exige alternância entre demandas.'],
 ['Aprender algo novo','A demanda cognitiva aumenta neste dia.'],
 ['Decisões em sequência','O personagem enfrenta uma sucessão de tarefas mentais.'],
 ['Trabalho em ambiente agitado','Ruído e pressão fazem parte do cenário.']]],
 ['Rotina',{pressure:0},[
 ['Um dia habitual','O resultado de hoje depende principalmente da rotina escolhida.'],
 ['Continuidade','Os saldos de ontem chegam ao novo dia.'],
 ['Pequenos compromissos','Atividades comuns disputam espaço na agenda.'],
 ['Manutenção da rotina','Há oportunidade de observar os efeitos da repetição.'],
 ['Dia de observação','Compare os sinais atuais com o início da campanha.']]]
];
export const EVENTS = families.flatMap(([family,effects,items])=>items.map(([title,body])=>({family,title,body,...effects})));
export const RESPONSES=[
 {id:'maintain',name:'Manter a rotina',text:'Executar o plano e usar a folga para absorver imprevistos.'},
 {id:'negotiate',name:'Negociar a demanda',text:'Nos dias de trabalho: reduzir 1 h de atividade e parte da pressão; a meta diminui apenas até o limite da autonomia disponível.'},
 {id:'recover',name:'Reservar recuperação',text:'Nos dias de trabalho: converter 1 h de atividade em 30 min de oportunidade de sono e 15 min de pausa; menos produção disponível.'}
];
export const SOURCES=[
 ['Sono e desempenho','https://pubmed.ncbi.nlm.nih.gov/12683469/','Van Dongen et al., 2003. Restrição repetida de sono e desempenho.'],
 ['Adaptação ao treinamento','https://pmc.ncbi.nlm.nih.gov/articles/PMC2853203/','Murias et al., 2010. Resposta do consumo de oxigênio ao treinamento.'],
 ['Adaptação ao calor','https://pubmed.ncbi.nlm.nih.gov/39583901/','Cubel et al., 2024. Aquisição e perda de adaptações ao calor.'],
 ['Meditação e reatividade','https://pubmed.ncbi.nlm.nih.gov/29040891/','Lindsay et al., 2018. Ensaio com treinamento de mindfulness e resposta ao estresse.'],
 ['Práticas respiratórias','https://pubmed.ncbi.nlm.nih.gov/36630953/','Balban et al., 2023. Práticas respiratórias, humor e ativação.'],
 ['Estresse no trabalho','https://pubmed.ncbi.nlm.nih.gov/31083053/','ELSA-Brasil, 2019. Relações limitadas e não uniformes entre trabalho e variabilidade cardíaca.']
];
