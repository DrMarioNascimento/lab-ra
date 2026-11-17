export const PEOPLE = [
 {id:'lia',name:'Lia',color:'#ee9d76',capacity:1.12,thermal:1,initial:{reserve:82,heat:18,fatigue:10},story:'Tem experiência, mas chegou após uma noite curta. Capacidade e recuperação não são a mesma coisa.'},
 {id:'rui',name:'Rui',color:'#8fbcae',capacity:.78,thermal:1.08,initial:{reserve:74,heat:22,fatigue:18},story:'Está retomando a prática. Quer participar, sem precisar acompanhar o ritmo de quem já treina.'},
 {id:'noa',name:'Noa',color:'#b6abd2',capacity:.94,thermal:1.2,initial:{reserve:67,heat:27,fatigue:15},story:'O deslocamento foi cansativo. Começa com menos margem e maior sensibilidade ao calor neste cenário.'},
 {id:'ivo',name:'Ivo',color:'#e1c77e',capacity:1.2,thermal:.85,initial:{reserve:88,heat:14,fatigue:7},story:'Chegou descansado e costuma se recuperar bem. Deseja avançar, mas não fala pelo grupo inteiro.'}
];
export const CONTEXTS = {
 comunidade:{label:'Comunidade · Bacharelado',place:'Circuito aberto no parque',brief:'Você coordena um circuito de movimento. A organização espera 180 unidades de percurso coletivo. Quatro pessoas representam respostas diferentes à mesma atividade.',goal:'percurso coletivo'},
 escola:{label:'Escola · Licenciatura',place:'Festival de movimento na escola',brief:'Você coordena um festival escolar. A escola espera 180 unidades de participação motora. Quatro personagens representam respostas diferentes; a meta é da organização, não uma nota dos alunos.',goal:'participação motora'},
 movimento:{label:'Movimento · Fisioterapia',place:'Oficina educativa de movimento',brief:'Você coordena uma oficina educativa de movimento para adultos. A organização espera 180 unidades de atividade coletiva. Não há casos clínicos, diagnósticos nem prescrição neste protótipo.',goal:'atividade coletiva'}
};
export const PLEDGES = [
 {id:'inclusion',name:'Ninguém será descartado pela meta.',short:'Participação',detail:'Não retirar alguém da atividade para melhorar o resultado agregado.'},
 {id:'autonomy',name:'Um pedido de pausa terá consequência.',short:'Autonomia',detail:'Diante de um pedido de pausa, reduzir a carga dessa pessoa ou suspender a tarefa.'},
 {id:'truth',name:'O relatório mostrará também o custo.',short:'Transparência',detail:'Registrar a participação e as condições deixadas, mesmo quando a meta não for atingida.'}
];
export const STAGES = [
 {name:'A régua',time:'01 · antes do ritmo',heat:3,title:'A mesma tarefa. Quatro custos.',text:'O cronograma foi planejado para uma pessoa média. Observe cada participante antes de transformar esse plano em regra.',question:'Uma tarefa igual produz esforço igual?',options:[
 {id:'uniform',name:'Um ritmo para todos',desc:'Manter a tarefa prevista e o mesmo ritmo externo.',load:19,cost:0,gain:15,recovery:0,cooling:1,listen:false,reason:'A mesma carga externa produz cargas relativas diferentes quando as capacidades e condições iniciais diferem.'},
 {id:'relative',name:'Regular pelo esforço de cada um',desc:'Organizar percursos distintos. Exige 2 fichas de apoio.',load:15,cost:2,gain:12,recovery:1,cooling:2,adaptive:true,listen:true,reason:'Ajustar a carga externa à capacidade reduz diferenças de custo relativo, sem tornar os corpos idênticos.'},
 {id:'calibrate',name:'Começar menor e escutar',desc:'Usar a primeira janela para conhecer limites. Custa 1 ficha.',load:9,cost:1,gain:7,recovery:4,cooling:4,listen:true,reason:'Uma demanda menor preserva margem e permite observar respostas antes de aumentar a exigência.'}
 ]},
 {name:'O ambiente',time:'02 · o calor chega',heat:9,title:'O ambiente também participa.',text:'A área aberta ficou mais quente. Transferir a atividade exige apoio. O prazo permanece o mesmo.',question:'Qual variável muda quando a tarefa continua igual, mas o ambiente muda?',options:[
 {id:'open',name:'Manter no espaço aberto',desc:'Preservar a programação sem gastar apoio.',load:19,cost:0,gain:16,recovery:0,cooling:1,reason:'O calor ambiental se soma ao produzido pela atividade. O desempenho imediato não revela todo o custo acumulado.'},
 {id:'shade',name:'Reorganizar na sombra',desc:'Reduzir a demanda térmica. Custa 2 fichas de apoio.',load:14,cost:2,gain:11,recovery:2,cooling:12,adaptive:true,listen:true,reason:'A mudança de ambiente facilita a perda de calor no modelo. Há menos produção de trabalho nesta janela.'},
 {id:'break',name:'Pausa coletiva',desc:'Interromper a tarefa e usar a estrutura já disponível.',load:0,cost:0,gain:0,recovery:13,cooling:17,listen:true,reason:'Reduzir a atividade diminui a produção de calor e permite recuperação. Isso não apaga instantaneamente a história anterior.'}
 ]},
 {name:'A voz',time:'03 · alguém pede espaço',heat:5,title:'Quem pode mudar o plano?',text:'Agora os relatos individuais importam mais que a média. Uma pessoa pode pedir pausa enquanto outra deseja continuar.',question:'O pedido de alguém altera a atividade ou só o discurso?',options:[
 {id:'push',name:'Pedir que todos continuem',desc:'Priorizar a meta e manter a carga coletiva.',load:22,cost:0,gain:18,recovery:0,cooling:1,reason:'Insistir preserva produção imediata, mas a fadiga anterior amplia o custo da nova demanda.'},
 {id:'veto',name:'Dar efeito ao pedido de pausa',desc:'Quem precisa descansa; os demais seguem com ajuste. Custa 2 fichas.',load:13,cost:2,gain:11,recovery:4,cooling:6,adaptive:true,listen:true,veto:true,reason:'A pausa individual muda efetivamente a carga. O ritmo coletivo deixa de ser imposto por uma média.'},
 {id:'select',name:'Retirar quem tem menos margem',desc:'A pessoa descansa fora da atividade; o restante acelera.',load:24,cost:0,gain:26,recovery:0,cooling:1,exclude:true,reason:'Retirar quem tem menos margem reduz sua carga, mas transfere o acesso à atividade para quem suporta melhor a tarefa.'}
 ]},
 {name:'O atraso',time:'04 · a conta reaparece',heat:4,title:'O passado ainda está em campo.',text:'O trecho final chegou. Pausas anteriores podem parecer tempo perdido; a recuperação insuficiente também chega até aqui.',question:'O que é efeito da decisão atual e o que veio das anteriores?',options:[
 {id:'sprint',name:'Acelerar o trecho final',desc:'Buscar o resultado restante com uma carga alta.',load:25,cost:0,gain:21,recovery:0,cooling:1,reason:'A mesma aceleração custa mais a quem chega com pouca reserva e fadiga acumulada.'},
 {id:'relay',name:'Alternar atividade e recuperação',desc:'Distribuir a tarefa com intervalos. Custa 2 fichas.',load:12,cost:2,gain:10,recovery:7,cooling:6,adaptive:true,listen:true,reason:'Intervalos reduzem a carga desta janela e permitem recuperação parcial; não eliminam todas as diferenças.'},
 {id:'end',name:'Encerrar o esforço',desc:'Aceitar o resultado alcançado e preservar a próxima etapa.',load:0,cost:0,gain:0,recovery:15,cooling:15,listen:true,reason:'O encerramento limita novas demandas. A recuperação acontece sobre um estado que já foi modificado.'}
 ]},
 {name:'O que fica',time:'05 · depois do aplauso',heat:0,title:'A atividade acabou. A responsabilidade?',text:'Você decide o que será entregue ao próximo coordenador: uma vitrine de produção, uma transição cuidada ou uma prestação de contas com poucos recursos.',question:'O que o próximo grupo tem direito de saber?',options:[
 {id:'trophy',name:'Fechar com o resultado de produção',desc:'Encerrar sem transição assistida e registrar só a meta.',load:0,cost:0,gain:0,recovery:4,cooling:7,conceal:true,reason:'O registro incompleto não altera os corpos. Apenas torna parte do custo menos visível para quem recebe a atividade.'},
 {id:'care',name:'Cuidar da transição e abrir os dados',desc:'Organizar recuperação e escuta. Custa 2 fichas.',load:0,cost:2,gain:0,recovery:20,cooling:19,listen:true,reason:'Recuperação assistida melhora as condições de continuidade. Transparência permite discutir o custo sem confundi-lo com fracasso.'},
 {id:'report',name:'Registrar os limites e transferir',desc:'Entregar o relato completo, com recuperação breve.',load:0,cost:0,gain:0,recovery:8,cooling:10,listen:true,reason:'Nomear os limites preserva informação. Isso, por si só, não substitui condições materiais de recuperação.'}
 ]}
];

// No modo por setores, a equipe de ambiente já decide o espaço e seu custo.
export function optionsForTeams(round){return STAGES[round]?.options.map(o=>o.id==='shade'?{...o,name:'Adaptar o circuito ao espaço',desc:'Ajustar a tarefa ao ambiente escolhido pelo setor. Custa 1 ficha.',cost:1,cooling:3,reason:'A organização da tarefa e a exposição ambiental têm decisões distintas. A carga adaptada reduz diferenças relativas; o ambiente escolhido pelo setor define a proteção adicional.'}:o.id==='veto'?{...o,name:'Ajustar a carga e apoiar as pausas',desc:'Acrescentar recuperação e ajustar a tarefa de quem continua. Custa 2 fichas.'}:o);}
