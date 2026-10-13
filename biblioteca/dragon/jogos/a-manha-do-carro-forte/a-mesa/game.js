/* MOSAICO — A Manhã do Carro-Forte · A MESA
   Consolidação V4 (31/08/2026): banco modular F01–F30, hipóteses concorrentes H1–H10,
   relações em pares/tríades R-A…R-G e duração por seleção de subconjuntos.

   A Mesa não é o Captura. Aqui não há moeda, vez nem carteira: a partida é coletiva,
   o dossiê abre em três terços e o que se administra é interpretação, não liquidez.
   REALIDADE CANÔNICA → FOCO DA PARTIDA → PERGUNTA → FRAGMENTOS → RELAÇÕES → INFERÊNCIA → DECISÃO */

/* O banco mora em fragmentos.js, lido também pelas três atividades sensoriais. */
const FRAGMENTOS=window.MOSAICO_FRAGMENTOS;

/* ── Relações (V4 §15). Cada peça é um grupo de alternativas: basta um código do grupo. */
const RELACOES=[
 {id:'R-A',t:'5,1 kg contra a tabela de peso',pecas:[['F14'],['F15']],efeito:'Transforma um número neutro em evidência de conteúdo.'},
 {id:'R-B',t:'O saco de 0,4 kg contra o malote de 5,1 kg',pecas:[['F13'],['F14']],efeito:'Separa o objeto descartado do malote efetivamente coletado.'},
 {id:'R-C',t:'5,1 kg contra os R$ 480.000 no destino',pecas:[['F14'],['F16']],efeito:'Derruba a retirada física do valor.'},
 {id:'R-D',t:'O saque contra o lacre novo e a janela',pecas:[['F17'],['F12','F30']],efeito:'Converte dinheiro suspeito em possível material de inserção.'},
 {id:'R-E',t:'O depósito único contra a duplicidade',pecas:[['F19'],['F20','F21']],efeito:'Localiza a origem escritural onze dias antes.'},
 {id:'R-F',t:'O acidente das pastas contra a prova em mãos',pecas:[['F25'],['F26']],efeito:'O mesmo acidente que incrimina Aprendiz explica por que a prova estava com Aprendiz.'},
 {id:'R-G',t:'O Erro 17 apagado contra a zona cega',pecas:[['F05','F06'],['F09','F10']],efeito:'Demonstra preparação da zona cega sem dizer se a finalidade era retirar ou inserir.'}
];

/* ── Hipóteses concorrentes (V4 §14). Nenhuma é pista falsa: todas nascem de fatos
      verdadeiros interpretados de forma incompleta. Canônica = sobrevive ao fechamento. */
const HIPOTESES=[
 {id:'H1',t:'Furto consumado de R$ 480 mil',d:'Saco vazio, câmera cega, vigilância afastada e lacre rompido.',apoia:['F13','F09','F24','F30'],enfraquece:['F14','F15','F16']},
 {id:'H2',t:'Furto parcial de R$ 96 mil',d:'A diferença entre R$ 384 mil físicos e R$ 480 mil declarados.',apoia:['F15','F17'],enfraquece:['F14','F16','F20']},
 {id:'H3',t:'Troca ou desvio do malote',d:'Duas etiquetas, coleta antecipada e trajeto pelo corredor.',apoia:['F11','F12','F01','F22'],enfraquece:['F16','F30']},
 {id:'H4',t:'Tentativa de furto frustrada',d:'Saco vazio e perturbação da segurança, mas o valor aparece no destino.',apoia:['F13','F09','F24'],enfraquece:['F16','F30']},
 {id:'H5',t:'Cumplicidade logística',d:'Rota antecipada, contestação do Transporte e confirmação interna.',apoia:['F01'],enfraquece:['F29']},
 {id:'H6',t:'Cumplicidade de acesso',d:'Chave 17-B, Limpeza e Aprendiz com pasta e chaveiro.',apoia:['F07','F08','F26'],enfraquece:['F25']},
 {id:'H7',t:'O saque é produto do desvio',d:'O dinheiro em espécie visto antes de sua origem e direção serem compreendidas.',apoia:['F17'],enfraquece:['F18','F16']},
 {id:'H8',t:'O saque é reposição',d:'384 + 96 = 480, com lacre novo e janela preparada.',apoia:['F17','F18','F12','F30','F15'],enfraquece:[],canonica:1},
 {id:'H9',t:'Fraude ou erro contábil anterior',d:'Duplicidade D-11 e ausência de contagem física explicam o buraco sem subtração.',apoia:['F19','F20','F21','F28'],enfraquece:[],canonica:1},
 {id:'H10',t:'Nenhum desaparecimento físico na manhã',d:'Peso de 5,1 kg, tabela operacional e conferência às 8h40.',apoia:['F14','F15','F16'],enfraquece:[],canonica:1}
];

/* ── Duração modular (V4 §16). O número é alvo, não teto: fragmentos centrais da pergunta
      e peças de relação garantida entram mesmo que estourem o alvo. */
const DURACOES={
 curta:{n:13,rel:3,rot:'Curta',nota:'12–14 fragmentos · foco em relações estruturais'},
 padrao:{n:18,rel:4,rot:'Padrão',nota:'16–20 fragmentos · equilíbrio entre as quatro funções'},
 longa:{n:24,rel:6,rot:'Longa',nota:'22–26 fragmentos · mais pistas paralelas e hipóteses intermediárias'}
};

const PARTIDAS={
 peso:{title:'O Peso do Malote 41',nature:'QUANTO + QUANDO',question:'O banco anuncia que faltam quatrocentos e oitenta mil reais. Quanto realmente desapareceu?',short:'Um número parece óbvio. A direção do dinheiro não.',
  activities:['vidro','escura'],hipotese:'H10',
  centrais:['F13','F14','F15','F16','F17','F19','F20','F21'],incidentais:['F25','F26','F27','F23','F07','F08'],
  fields:[
   ['Valor declarado',['R$ 480.000','R$ 384.000','R$ 96.000','R$ 0'],'R$ 480.000'],
   ['Valor físico antes da manhã',['R$ 480.000','R$ 384.000','R$ 96.000','R$ 0'],'R$ 384.000'],
   ['Movimento líquido da manhã',['+ R$ 96.000','− R$ 96.000','− R$ 480.000','R$ 0'],'+ R$ 96.000'],
   ['Diferença física real às 8h40',['R$ 480.000','R$ 384.000','R$ 96.000','R$ 0'],'R$ 0'],
   ['Quando nasceu a diferença?',['Na janela de 87 s','Às 8h02','Na véspera','Onze dias antes'],'Onze dias antes']],
  answer:'Naquela manhã, R$ 0 desapareceram fisicamente. A diferença de R$ 96.000 nasceu onze dias antes, como duplicidade escritural.',
  reveals:['O saco no chão pesa 0,4 kg. O malote coletado pesa 5,1 kg.','Às 8h40 a tesouraria confere R$ 480.000 íntegros.','A janela de 87 segundos foi usada para inserir R$ 96.000.','Um depósito de R$ 96.000 foi lançado duas vezes onze dias antes.']},

 janela:{title:'Os 87 Segundos',nature:'O QUÊ + COMO',question:'O que realmente aconteceu enquanto a câmera 3 ficou cega?',short:'Reconstrua a janela sem pressupor retirada.',
  activities:['norte','escura','vidro'],hipotese:'H8',
  centrais:['F09','F30','F11','F12','F24','F10'],incidentais:['F19','F20','F21','F27','F04','F03'],
  fields:[
   ['Primeiro evento',['Rádio afasta Vigilância','Lacre é rompido','Malote sai da agência','Etiqueta é impressa'],'Rádio afasta Vigilância'],
   ['O que ocorre no malote?',['R$ 480.000 saem','R$ 96.000 entram','Nada é tocado','O malote é trocado'],'R$ 96.000 entram'],
   ['O que ocorre com o lacre?',['Permanece ML-8842','É trocado por ML-8847','Desaparece','É rompido só no destino'],'É trocado por ML-8847'],
   ['Direção do fluxo',['Agência → rua','Malote → corredor','Fora → dentro do malote','Tesouraria → agência'],'Fora → dentro do malote'],
   ['Fim da janela',['7h58min12s','7h58min50s','7h59min39s','8h02'],'7h59min39s']],
  answer:'Durante os 87 segundos a vigilância foi afastada, o lacre foi rompido, R$ 96.000 foram inseridos no malote, um novo lacre foi aplicado e o malote voltou à custódia.',
  reveals:['A câmera cai às 7h58min12s.','A porta abre às 7h58min24s e o lacre ML-8842 é rompido às 7h58min50s.','R$ 96.000 entram e ML-8847 é aplicado às 7h59min20s.','A câmera retorna às 7h59min39s.']},

 roubo:{title:'Foi um roubo?',nature:'QUAL / QUE TIPO',question:'Todo mundo viu os sinais de um assalto. Mas houve realmente um roubo?',short:'Classifique o acontecimento sem confundir irregularidade com subtração.',
  activities:['vidro','escura'],hipotese:'H10',
  centrais:['F09','F13','F14','F16','F20','F30'],incidentais:['F03','F04','F27','F02'],
  fields:[
   ['Natureza da manhã',['Roubo consumado','Tentativa de roubo','Bagunça administrativa sem ação deliberada','Encenação operacional de reparação clandestina'],'Encenação operacional de reparação clandestina'],
   ['Houve subtração de valores?',['Sim, R$ 480.000','Sim, R$ 96.000','Não','Não é possível saber'],'Não'],
   ['A falha da câmera foi',['Acidental','Deliberadamente preparada','Rotina técnica','Produzida pela transportadora'],'Deliberadamente preparada'],
   ['A diferença central é',['Patrimonial','Escritural','De transporte','De lacre'],'Escritural'],
   ['A leitura “só bagunça” é',['Totalmente correta','Parcialmente correta','Totalmente falsa','Irrelevante'],'Parcialmente correta']],
  answer:'Não houve roubo naquela manhã. Houve uma encenação operacional deliberada para reparar clandestinamente uma diferença escritural anterior.',
  reveals:['Os sinais de crime são reais.','A preparação da câmera e do acesso foi deliberada.','Nenhum dinheiro foi subtraído.','A irregularidade é grave, mas não é furto.']},

 antes:{title:'Antes das 8h02',nature:'QUANDO',question:'Quando nasceu a diferença que todos procuram?',short:'A mesa olha para minutos; a resposta está onze dias atrás.',
  activities:['norte'],hipotese:'H9',
  centrais:['F19','F20','F21','F28','F02','F03','F04'],incidentais:['F22','F25','F26','F27','F13'],
  fields:[
   ['Âncora da manhã',['7h47','7h58min12s','8h02','8h40'],'7h47'],
   ['Janela crítica',['87 segundos','3 minutos','11 dias','40 minutos'],'87 segundos'],
   ['Momento da duplicidade',['Na manhã','Na véspera','Onze dias antes','No destino'],'Onze dias antes'],
   ['Evento que transforma o erro em ameaça',['Chegada do carro-forte','Auditoria anunciada na véspera','Grito às 8h02','Reset da câmera'],'Auditoria anunciada na véspera'],
   ['A diferença física nasce',['Às 7h58','Às 8h02','Onze dias antes','Nunca nasce'],'Nunca nasce']],
  answer:'A diferença nasce onze dias antes, quando um depósito de R$ 96.000 é reconsolidado e lançado pela segunda vez. A manhã apenas tenta dar corpo ao número.',
  reveals:['7h47 ancora a manhã, não a origem.','Os 87 segundos explicam uma operação, não a criação da diferença.','A auditoria da véspera torna urgente um erro antigo.','O nascimento factual está no D-11.']},

 quem:{title:'Quem construiu a janela?',nature:'QUEM COMPOSTO',question:'Quem colocou cada peça daqueles 87 segundos em movimento?',short:'Separe decisão, preparação, execução, participação sem conhecimento e negligência.',
  activities:['norte','escura'],hipotese:'H8',
  centrais:['F01','F05','F06','F07','F08','F10','F24','F26'],incidentais:['F15','F16','F19','F20','F03'],
  fields:[
   ['Quem decide a operação?',['Subgerente','Limpeza','Manutenção','Gerência'],'Subgerente'],
   ['Quem prepara a falha?',['Subgerente','Manutenção','Vigilância','Transporte'],'Subgerente'],
   ['Quem abre o acesso sem conhecer a finalidade?',['Limpeza','Aprendiz','Gerência','Cliente'],'Limpeza'],
   ['Quem executa o reset autorizado?',['Manutenção','Subgerente','Gerência','Vigilância'],'Manutenção'],
   ['Quem autoriza o reset sem contingência?',['Gerência','Manutenção','Transporte','Caixa Sênior'],'Gerência']],
  answer:'Subgerente decide e constrói a janela; Limpeza abre o acesso sem conhecer a finalidade; Manutenção executa um reset autorizado; Gerência autoriza sem contingência.',
  reveals:['Presença não é autoria.','Execução técnica não é decisão.','Abrir a porta não prova conhecimento da finalidade.','A cadeia é distribuída, mas a coordenação é identificável.']},

 proteger:{title:'O que estava sendo protegido?',nature:'POR QUÊ',question:'Se não era o dinheiro, o que alguém estava tentando salvar?',short:'A ação material contradiz o motivo aparente.',
  activities:['vidro'],hipotese:'H9',
  centrais:['F17','F18','F19','F20','F21','F28','F12'],incidentais:['F02','F03','F22','F25','F27'],
  fields:[
   ['O que Subgerente teme perder?',['R$ 480.000','A assinatura e a carreira','O malote 41','A chave 17-B'],'A assinatura e a carreira'],
   ['Por que usar dinheiro próprio?',['Para lavar produto de crime','Para completar fisicamente o saldo','Para pagar Transporte','Para comprar silêncio'],'Para completar fisicamente o saldo'],
   ['O que dispara a urgência?',['A garoa','A auditoria integral','O Cliente','O relógio da farmácia'],'A auditoria integral'],
   ['Qual ato original precisa ser escondido?',['Roubo anterior','Assinatura sem conferência física','Erro da transportadora','Abertura do cofre pelo Cliente'],'Assinatura sem conferência física'],
   ['O objetivo final é',['Enriquecimento','Desviar a auditoria para inocentes','Fazer registros e dinheiro coincidirem','Fechar a agência'],'Fazer registros e dinheiro coincidirem']],
  answer:'O objeto protegido era a assinatura — e, por extensão, a carreira. O dinheiro próprio foi usado para fazer a realidade física coincidir com um registro errado.',
  reveals:['R$ 96.000 saem da conta pessoal de Subgerente.','O dinheiro entra no malote; não sai.','A auditoria ameaça revelar uma assinatura sem conferência.','A operação tenta salvar reputação, não patrimônio.']}
};

/* As atividades não são interlúdio: são a distribuição.

   Cada uma tem um `rende` — a família de fragmentos que aquele gesto alcança.
   A Janela do Norte alcança tempo, posição e sequência; o Vidro Embaçado
   alcança número, peso, lacre e documento; a Sala às Escuras alcança vestígio
   material. Na hora da partida, o `rende` é cruzado com o que aquela pergunta
   torna relevante, e o resultado é o lote daquela atividade.

   O que o lote traz para o dossiê é só o que a mesa efetivamente descobriu.
   Quem varre a sala inteira leva os quatro; quem acha dois, leva dois — e os
   dois que ficaram para trás não entram por outra porta. É por isso que a
   montagem do dossiê deixou de acontecer na escolha da pergunta e passou a
   acontecer depois das atividades. */
const SENSORS={
 norte:{title:'A Janela do Norte',desc:'Oriente o aparelho pelos setores da agência e fixe horários e posições.',href:'janela-do-norte.html',
  rende:['F30','F09','F02','F03','F04','F01','F24','F28','F22']},
 vidro:{title:'O Vidro Embaçado',desc:'Limpe camadas de informação para revelar peso, lacres, valores e registros.',href:'vidro-embacado.html',
  rende:['F14','F15','F16','F13','F12','F11','F20','F21','F19','F17','F18']},
 escura:{title:'A Sala às Escuras',desc:'Procure no corredor objetos físicos da zona cega sem transformá-los automaticamente em culpa.',href:'sala-as-escuras.html',
  rende:['F13','F22','F23','F25','F26','F07','F08','F10','F05','F06']}
};
const POR_ATIVIDADE=4;

const FASES={intro:'PRÓLOGO',briefing:'PAUTA',sensory:'SENSORES',evidence:'DOSSIÊ',hypothesis:'HIPÓTESE',mosaic:'RELAÇÕES',final:'DECISÃO',reveal:'REVELAÇÃO',score:'RELATÓRIO'};
const PASSOS={intro:1,briefing:2,sensory:3,evidence:4,hypothesis:5,mosaic:6,final:7,reveal:8,score:9};
const TERCO_ROT=['PRIMEIRO TERÇO','SEGUNDO TERÇO','TERÇO FINAL'];

const state={screen:'intro',game:null,semente:0,players:6,pace:'pressure',duration:'padrao',
 dossie:[],tercos:[[],[],[]],aberto:1,marcados:new Set(),lotes:{},colhidos:new Set(),
 relacoes:new Set(),hipoteseProv:'',hipoteseFinal:'',
 sensorDone:new Set(),sensorAberto:null,prazo:0,janela:null,final:{},reveal:0,start:Date.now(),
 telao:false,entregue:false,placar:[],passos:[],passoFecho:0,podioMostrado:false,fechoComecou:false,
 fase:{nome:'intro',fimMs:0,vencida:false}};

/* ── O TEMPO DA ATIVIDADE ────────────────────────────────────────────────
   Este campo existia como "Ritmo · 30 s / 60 s" e não fazia nada: ia para a
   URL da atividade em &ritmo= e nenhuma das três páginas lia. Agora ele é o
   que de fato mede a atividade — e o número mudou.

   30 s não sobrevive à Janela do Norte: só a permissão de bússola do iPhone
   custa cerca de 20 s, e a pessoa perderia a atividade antes de a agulha
   girar. Os patamares são 60 s e 120 s, e vivem aqui, numa tabela só, porque
   playtest vai mexer neles. */
const TEMPOS={pressure:60,calm:120};
const tempoAtividadeMs=()=>(TEMPOS[state.pace]||TEMPOS.calm)*1000;

/* ── TUDO TEM TEMPO ──────────────────────────────────────────────────────
   Regra do Mario, 04/09/2026: "precisa terminar, tudo tem tempo; perdeu o
   tempo, segue; não está, perdeu". Antes só as atividades tinham relógio; o
   resto da partida esperava alguém tocar um botão, e a mesa podia ficar meia
   hora num terço do dossiê.

   O prazo é da MESA, não do aparelho: o Mestre abre a fase, o instante do fim
   desce pela sala, e todos entram e saem juntos. Quem não fez, não fez — o
   terço que não abriu não abre, a hipótese não registrada não pontua, o campo
   em branco fica em branco.

   Os números são um chute honesto e moram só aqui, porque é playtest que vai
   decidi-los. SENSORES não aparece: ela dura o que a fila das atividades
   durar, e cada atividade já tem o seu relógio. */
const FASE_SEG={
 briefing:{pressure:60,calm:120},
 evidence:{pressure:150,calm:300},
 hypothesis:{pressure:60,calm:120},
 mosaic:{pressure:120,calm:240},
 final:{pressure:90,calm:180},
};
const ORDEM_FASES=['briefing','sensory','evidence','hypothesis','mosaic','final'];
const fasePrazoMs=n=>{const t=FASE_SEG[n];return t?(t[state.pace]||t.calm)*1000:0};
const proximaFase=n=>ORDEM_FASES[ORDEM_FASES.indexOf(n)+1]||null;

/* Quem é quem nesta sala. Sem código de sala não há Mestre nem convidado: é o
   ensaio e o aparelho solto, onde o sistema abre tudo sozinho. */
const salaCodigo=()=>window.MOSAICO_ROOM?.code||'';
const souMestreDaSala=()=>!salaCodigo()||window.MOSAICO_ROOM?.role==='master';
const ritmoConduzido=()=>!!salaCodigo()&&window.MOSAICO_ROOM?.room?.ritmo==='conduzido';

/* As opções da mesa são do Mestre. Chegam pela sala junto com a pergunta;
   quando não há sala, valem os campos da tela deste aparelho. */
function aplicarOpcoes(o){
 if(!o)return;
 if(o.players)state.players=+o.players||state.players;
 if(TEMPOS[o.pace])state.pace=o.pace;
 if(DURACOES[o.duration])state.duration=o.duration;
 /* Se havia telão vivo quando a abertura tocou, há telão nesta partida — e é
    isso que decide onde o fecho acontece. Vem da sala junto com a pergunta, e
    não de cada aparelho perguntar por conta própria: dois aparelhos com
    respostas diferentes fariam metade da mesa olhar para a tela grande
    enquanto a outra metade narra sozinha no colo. */
 state.telao=!!o.telao;
}
function opcoesDaTela(){
 /* 11/10/2026: na sala, o número de investigadores é o de aparelhos que entraram (até 12); o campo só vale sem sala */
 const naSala=(window.MOSAICO_ROOM&&!window.MOSAICO_ROOM.local&&Array.isArray(window.MOSAICO_ROOM.players))?window.MOSAICO_ROOM.players.length:0;
 return {players:naSala?Math.max(1,Math.min(12,naSala)):+$('playerCount').value,pace:$('pace').value,duration:$('duration').value};
}

const $=id=>document.getElementById(id);
const screens=[...document.querySelectorAll('.screen')];
const embaralhar=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(p=>p[1]);
/* 11/10/2026: o dossiê sai de uma semente própria (state.sementeDossie; a ordem das opções
   continua com a sua, sorteada). Na sala, ela é o código da sala com a pergunta: todos os aparelhos montam o mesmo complemento e os mesmos terços (o que muda
   entre eles é só o que cada um colheu nas atividades). Sem sala, a semente segue sorteada. */
function rngDe(chave){let h=((state.sementeDossie>>>0)^2166136261)>>>0;for(let i=0;i<chave.length;i++)h=Math.imul(h^chave.charCodeAt(i),16777619)>>>0;return ()=>{h=Math.imul(h^h>>>15,2246822507)>>>0;h=Math.imul(h^h>>>13,3266489909)>>>0;return ((h^h>>>16)>>>0)/4294967296}}
const embaralharS=(a,r)=>a.map(v=>[r(),v]).sort((x,y)=>x[0]-y[0]).map(p=>p[1]);
function sementeDaSala(id){const sala=window.MOSAICO_ROOM,c=sala&&!sala.local&&sala.code;if(!c)return (Math.random()*0xffffffff)>>>0;let h=2166136261;const t=String(c).toUpperCase()+'|'+id;for(let i=0;i<t.length;i++)h=Math.imul(h^t.charCodeAt(i),16777619)>>>0;return h>>>0}
const listar=a=>a.length<2?a.join(''):`${a.slice(0,-1).join(', ')} e ${a[a.length-1]}`;
/* 12/10/2026 · nenhum código na tela (F31, H8, R-A). Os códigos são fixos entre as 15 variações:
   à vista, a mesa decora ("o F31 é sempre o desmentido", "a certa é a H10") e pula a dedução.
   Por dentro tudo continua pelo código; na tela vai o título, entre aspas quando citado em frase. */
const tituloF=c=>FRAGMENTOS[c]?`“${FRAGMENTOS[c].t}”`:'um fragmento';
const tituloR=r=>`“${r.t}”`;
const mao=()=>new Set(state.tercos.slice(0,state.aberto).flat());

function go(name){
 screens.forEach(s=>s.classList.toggle('active',s.dataset.screen===name));
 state.screen=name;
 $('phaseName').textContent=FASES[name]||name.toUpperCase();
 $('phaseStep').textContent=PASSOS[name]||'·';
 const rot=$('partidaLabel');
 rot.hidden=!state.game||name==='intro'||name==='games';
 if(state.game)rot.textContent=PARTIDAS[state.game].title;
 if(typeof ajustarDock==='function')ajustarDock();
 scrollTo(0,0);
}

/* ── Montagem do dossiê (V4 §12 e §16): relações garantidas, centrais da pergunta,
      preenchimento por função e proteção contra concentração de pistas de fechamento. */
function faltantes(rel,tem){return rel.pecas.filter(g=>!g.some(c=>tem.has(c))).map(g=>g[0])}
function relacaoCompleta(rel,tem){return rel.pecas.every(g=>g.some(c=>tem.has(c)))}

/* O lote de cada atividade: o que ela alcança, cruzado com o que esta pergunta
   torna relevante. Centrais primeiro — são eles que doem quando faltam —, e
   nenhum fragmento em dois lotes, senão falhar numa atividade seria perdoado
   pela outra. */
function montarLotes(){
 const g=PARTIDAS[state.game],usados=new Set(),lotes={};
 for(const id of g.activities){
  const s=SENSORS[id];
  const candidatos=s.rende.filter(c=>!usados.has(c)&&!g.incidentais.includes(c));
  const centrais=candidatos.filter(c=>g.centrais.includes(c));
  const resto=candidatos.filter(c=>!g.centrais.includes(c));
  const lote=[...centrais,...resto].slice(0,POR_ATIVIDADE);
  lote.forEach(c=>usados.add(c));
  lotes[id]=lote;
 }
 return lotes;
}
function sensoriais(){return Object.values(state.lotes).flat()}

function montarDossie(){
 const g=PARTIDAS[state.game],cfg=DURACOES[state.duration];
 /* Fragmentos sensoriais só entram se foram descobertos. Os perdidos não são
    substituídos: o dossiê encolhe, e é essa a consequência do gesto. */
 const doSensor=new Set(sensoriais()),perdidos=sensoriais().filter(c=>!state.colhidos.has(c));
 const alvo=Math.max(4,cfg.n-perdidos.length);
 const tem=new Set([...g.centrais.filter(c=>!doSensor.has(c)),...sensoriais().filter(c=>state.colhidos.has(c))]);
 /* Um fragmento perdido na atividade não pode voltar pela porta das relações
    nem pelo preenchimento — senão falhar não custaria nada. */
 const proibido=c=>doSensor.has(c)&&!state.colhidos.has(c);
 const ordem=[...RELACOES].filter(r=>!r.pecas.flat().every(c=>proibido(c)))
   .sort((a,b)=>faltantes(a,tem).length-faltantes(b,tem).length);
 let garantidas=0;
 for(const rel of ordem){
  if(garantidas>=cfg.rel)break;
  const faltam=faltantes(rel,tem).filter(c=>!proibido(c));
  if(faltam.length<faltantes(rel,tem).length)continue;
  faltam.forEach(c=>tem.add(c));
  garantidas++;
 }
 const resto=Object.keys(FRAGMENTOS).filter(c=>!tem.has(c)&&!proibido(c));
 const sorte={};resto.forEach(c=>sorte[c]=rngDe('dossie|'+c)());
 const peso=c=>(g.incidentais.includes(c)?2:0)+({estrutural:0,interpretativo:.3,relacional:.5,contextual:1.2})[FRAGMENTOS[c].f]+sorte[c];
 resto.sort((a,b)=>peso(a)-peso(b));
 for(const c of resto){if(tem.size>=alvo)break;tem.add(c)}
 state.dossie=[...tem].sort();
 state.tercos=distribuirTercos(state.dossie);
 state.aberto=1;state.marcados.clear();state.relacoes.clear();
}

function distribuirTercos(lista){
 const rt=rngDe('tercos'),fecho=embaralharS(lista.filter(c=>FRAGMENTOS[c].fecho),rt),livres=embaralharS(lista.filter(c=>!FRAGMENTOS[c].fecho),rt);
 const tam=Math.ceil(lista.length/3),t=[[],[],[]];
 /* O primeiro terço não recebe nenhuma pista de fechamento; o segundo recebe no
    máximo duas, para que a tensão entre “retirada” e “inserção” cresça sem que
    uma única leva entregue a conclusão (V4 §14 e §15). */
 while(t[0].length<tam&&livres.length)t[0].push(livres.shift());
 for(let i=0;i<2&&fecho.length&&t[1].length<tam;i++)t[1].push(fecho.shift());
 while(t[1].length<tam&&livres.length)t[1].push(livres.shift());
 t[2]=[...livres,...fecho];
 return t.map(embaralhar);
}

/* ── Rodízio: o sistema escolhe, e escolhe alternando ───────────────────
   Escolher a pergunta num menu ensinava a mesa a decorar — quem já tinha
   fechado "O Peso do Malote 41" reconhecia os fragmentos e pulava a dedução.
   O rodízio é um saco de seis: sorteia a ordem, entrega uma por vez e só
   reembaralha quando acaba. Ao reembaralhar, empurra para o fim a que acabou
   de sair, senão a virada do saco repetiria a mesma pergunta duas vezes
   seguidas. Ninguém revê uma pergunta antes de ver as seis.

   Em multiplayer o saco canônico mora no documento da sala (`partida.rodizio`),
   escrito pelo Mestre via pauta-da-mesa.js — como A Noite em sala-partida.js.
   localStorage fica só para ensaio/solo/offline: aparelhos na mesma sala não
   podem cada um sortear o próprio saco. */
const RODIZIO='mosaico-cf-rodizio';
function lerRodizio(){try{return JSON.parse(localStorage.getItem(RODIZIO))||{}}catch(e){return{}}}
function salvarRodizio(r){try{localStorage.setItem(RODIZIO,JSON.stringify(r))}catch(e){}}
/* Avança um saco sem I/O: multiplayer aplica o resultado no doc da sala;
   solo grava em localStorage via proximaPartida(). */
function avancarRodizio(r){
 const ids=Object.keys(PARTIDAS),base=r&&typeof r==='object'?r:{};
 let saco=Array.isArray(base.saco)?base.saco.filter(id=>ids.includes(id)):[];
 if(!saco.length){saco=embaralhar(ids);if(saco[0]===base.ultima&&saco.length>1)saco.push(saco.shift())}
 const id=saco.shift();
 const fechadas=[...new Set([...(Array.isArray(base.fechadas)?base.fechadas:[])].filter(x=>ids.includes(x)))];
 return {id,rodizio:{saco,ultima:id,fechadas}};
}
function proximaPartida(){
 const {id,rodizio}=avancarRodizio(lerRodizio());
 salvarRodizio(rodizio);
 return id;
}
function marcarFechada(id){
 if(window.MosaicoPauta?.marcarFechadaSala){
  window.MosaicoPauta.marcarFechadaSala(id);
  return;
 }
 const r=lerRodizio();
 salvarRodizio({...r,fechadas:[...new Set([...(r.fechadas||[]),id])]});
}
function fechadas(){
 const sala=window.MosaicoPauta?.rodizio?.();
 if(sala)return (sala.fechadas||[]).filter(id=>PARTIDAS[id]);
 return (lerRodizio().fechadas||[]).filter(id=>PARTIDAS[id]);
}

/* ── Telas ─────────────────────────────────────────────────────────────── */
function selectGame(id){
 state.game=id;state.semente=(Math.random()*0xffffffff)>>>0;state.sementeDossie=sementeDaSala(id);state.hipoteseProv='';state.hipoteseFinal='';state.final={};state.reveal=0;state.sensorDone.clear();state.colhidos.clear();state.lotes=montarLotes();
 /* A rodada nova apaga a fila da anterior: relógio parado, nenhuma atividade
    aberta e o alerta do Mestre desligado. Sem isto o cronômetro da última
    atividade da partida passada continuaria correndo por cima da nova. */
 pararRelogioSensor();state.sensorAberto=null;state.prazo=0;fecharJanelaAtividade();
 window.DragonSala?.acao(null);
 $('chooseGame').disabled=false;
 /* O fecho da rodada passada não atravessa para a nova: sem zerar, o Mestre
    entraria já achando que a revelação está no ar e ninguém entregaria nota. */
 clearTimeout(relogioFecho);pararRelogioFase();
 state.entregue=false;state.placar=[];state.passos=[];state.passoFecho=0;state.podioMostrado=false;state.fechoComecou=false;
 state.fase={nome:'intro',fimMs:0,vencida:false};state.tercos=[[],[],[]];
 document.body.classList.remove('fase-vencida');
 ligarSala();
 const g=PARTIDAS[id],cfg=DURACOES[state.duration];
 window.MosaicoPauta?.publicarPergunta(g);
 $('gameNature').textContent=g.nature;
 $('gameTitle').textContent=g.title;
 $('gameQuestion').textContent=g.question;
 const feitas=fechadas().filter(x=>x!==id).length,total=Object.keys(PARTIDAS).length;
 $('pautaNota').textContent=feitas
  ? `A pauta desta mesa foi sorteada. ${feitas} de ${total} perguntas já foram fechadas aqui — faltam ${total-feitas}.`
  : 'A pauta desta mesa foi sorteada. São seis perguntas sobre a mesma manhã, e você não escolhe qual delas cai.';
 /* 12/10/2026 (Manhã v2): quando a história é contada decide o que já chegou à mesa. */
 const narr=window.CarroVariacoes?.narracao?.();
 $('planCards').innerHTML=[
  ...(narr?[`<article class="plan-card depth-card green"><small>QUANDO A HISTÓRIA É CONTADA</small><strong>${narr.rotulo}</strong><p>A manhã: ${narr.data}. ${narr.texto}</p></article>`]:[]),
  `<article class="plan-card depth-card gold"><small>DOSSIÊ</small><strong>até ${cfg.n} fragmentos</strong><p>${cfg.rot}. ${sensoriais().length} deles só entram se a mesa descobrir nas atividades — o que ficar para trás não volta por outra porta. Depois, o dossiê abre em três terços.</p></article>`,
  `<article class="plan-card depth-card green"><small>CAMPOS DESTA PERGUNTA</small><strong>${g.fields.length} campos</strong><p>${g.fields.map(f=>f[0]).join(' · ')}</p></article>`,
  ...(window.CarroVariacoes?.presentes?.().length?[`<article class="plan-card depth-card"><small>NA AGÊNCIA NESTA MANHÃ</small><strong>${window.CarroVariacoes.presentes().length} pessoas</strong><p>${window.CarroVariacoes.presentes().map(p=>p.nome).join(' · ')}</p></article>`]:[]),
  `<article class="plan-card depth-card blue"><small>ATIVIDADES SENSORIAIS</small><strong>${g.activities.length} atividade${g.activities.length===1?'':'s'}</strong><p>${g.activities.map(a=>SENSORS[a].title).join(' · ')}</p></article>`
 ].join('');
 /* Quem abre a fase é o Mestre; o convidado recebe o prazo pela sala e cai
    aqui pelo ouvinte. Sem sala, o próprio aparelho abre. */
 if(souMestreDaSala())abrirFase('briefing');else go('briefing');
}

/* As atividades são uma fila, não um cardápio.

   A mesa faz uma de cada vez, todos juntos, na ordem que a partida declara em
   `activities`. Antes eram cartões soltos: qualquer um podia ser aberto, todos
   ao mesmo tempo, e o dossiê abria mesmo sem nenhum — cada participante via
   fatos diferentes na hora de relacionar.

   A conclusão também deixou de morar no localStorage. Guardada, ela voltava
   marcada na partida seguinte e no aparelho que já tinha jogado: a atividade
   aparecia pronta sem ninguém ter feito nada, que é exatamente o furo que a
   fila fecha. Agora vale por partida, e `selectGame` zera. */
/* NÃO EXISTE MAIS BOTÃO DE PULAR (04/09/2026).
   Havia um "Pular · perde N" ao lado de "Abrir atividade", com um confirm()
   por cima. Ele fazia duas coisas erradas ao mesmo tempo: dava ao JOGADOR o
   poder de encerrar uma atividade que é da mesa inteira, e ficava a um dedo de
   distância do botão que abre — Mario encostou nele sem querer e perdeu a
   atividade antes de ver a primeira tela.

   O que encerra a atividade agora é o RELÓGIO, igual para todos: a mesa tem o
   tempo declarado pelo Mestre, e quem não alcançou os fragmentos dentro dele
   fica sem eles. Perder é consequência do tempo, não uma opção de menu.

   E quem ABRE não é o jogador. No ritmo automático quem abre é o sistema,
   assim que a anterior fecha; no ritmo conduzido é o Mestre, pelo painel da
   Sala — e até ele tocar, o botão Sala fica piscando. */
function esperaTexto(){
 if(ritmoConduzido())return souMestreDaSala()
  ? 'A mesa está pronta. Abra esta atividade pelo painel da Sala — o botão está piscando.'
  : 'Aguardando o Mestre abrir esta atividade para a mesa.';
 return souMestreDaSala()?'Abrindo a atividade para a mesa…':'Aguardando a mesa abrir esta atividade.';
}
function renderSensors(){
 const g=PARTIDAS[state.game],host=$('sensoryCards'),ordem=g.activities;
 const atual=ordem.findIndex(id=>!state.sensorDone.has(id));
 host.innerHTML=ordem.map((id,i)=>{
  const s=SENSORS[id],feita=state.sensorDone.has(id),ativa=i===atual;
  const aberta=ativa&&state.sensorAberto===id;
  const lote=state.lotes[id]||[],pegos=lote.filter(c=>state.colhidos.has(c));
  const rot=feita?`${i+1} · ${pegos.length} DE ${lote.length} FRAGMENTOS`:ativa?`${i+1} DE ${ordem.length} · AGORA`:`${i+1} DE ${ordem.length} · AGUARDA A ANTERIOR`;
  /* O que está em jogo fica escrito antes, não depois. */
  const aposta=feita
   ? `<p class="lote">${pegos.length?`Trouxe ${pegos.join(', ')}.`:'Nada foi descoberto aqui.'}${pegos.length<lote.length?` ${lote.length-pegos.length} ficaram no escuro.`:''}</p>`
   : `<p class="lote">${lote.length} fragmentos do dossiê dependem desta atividade.</p>`;
  const corpo=!ativa?''
   :aberta
    ? `<div class="sensor-clock"><span>TEMPO DA MESA</span><b id="sensorClock">--:--</b></div><div class="sensor-actions"><button class="btn primary depth abrir-sensor" type="button">Abrir atividade</button></div><p class="lote aviso">Quando o tempo acabar, a atividade fecha sozinha — com o que você tiver alcançado até lá.</p>`
    : `<p class="lote aguardando">${esperaTexto()}</p>`;
  return `<article class="sensor-card depth-card blue ${feita?'feita':aberta?'atual':ativa?'esperando':'travada'}" data-sensor="${id}"><small>${rot}</small><h3>${s.title}</h3><p>${s.desc}</p>${aposta}${corpo}</article>`;
 }).join('');
 host.querySelectorAll('.abrir-sensor').forEach(btn=>btn.onclick=()=>{
  abrirJanelaAtividade(btn.closest('[data-sensor]').dataset.sensor);
 });
 pintarRelogioSensor();
 const n=state.sensorDone.size,faltam=ordem.length-n;
 const total=sensoriais().length,ganhos=state.colhidos.size;
 $('sensorDone').textContent=`${ganhos} de ${total} fragmentos descobertos`;
 $('sensorTags').innerHTML=ordem.filter(id=>state.sensorDone.has(id)).map(id=>`<span class="tag">${SENSORS[id].title}</span>`).join('');
 const seguir=$('toEvidence');
 seguir.disabled=faltam>0;
 seguir.innerHTML=faltam>0
  ? (faltam===1?'Falta 1 atividade':`Faltam ${faltam} atividades`)
  : 'Abrir o dossiê <span>→</span>';
}

/* A atividade abre em outra aba e agora avisa sozinha quando termina — antes
   quem marcava era só o botão daqui, e o aparelho da mesa tinha de lembrar.

   Só o aviso da atividade DA VEZ é aceito. A fila não anda fora de ordem nem
   por mensagem: uma aba velha de outra partida, ou um aviso repetido, não
   adianta o dossiê. O botão "A mesa concluiu" continua existindo para quando a
   atividade for feita fora do aparelho, ou a aba for fechada antes do fim. */
function atividadeDaVez(){
 if(!state.game)return null;
 const ordem=PARTIDAS[state.game].activities;
 return ordem.find(id=>!state.sensorDone.has(id))||null;
}
/* ── O RELÓGIO DA ATIVIDADE ──────────────────────────────────────────────
   Ele mora aqui, e não só na aba da atividade, por dois motivos. O primeiro é
   que a aba pode ser fechada, e a mesa não pode ficar esperando um aparelho
   que ninguém está olhando. O segundo é que o prazo é COMBINADO: quando há
   sala, o instante do fim é gravado nela e todos contam para o mesmo segundo,
   em vez de cada telefone medir o próprio. */
let relogioSensor=null;
function pararRelogioSensor(){clearInterval(relogioSensor);relogioSensor=null}
function pintarRelogioSensor(){
 const el=$('sensorClock');
 if(!el||!state.prazo)return;
 const r=Math.max(0,Math.ceil((state.prazo-Date.now())/1000));
 el.textContent=`${String(Math.floor(r/60)).padStart(2,'0')}:${String(r%60).padStart(2,'0')}`;
 el.classList.toggle('urgente',r<=10);
}
function iniciarAtividade(id,fimMs){
 if(!id||state.sensorDone.has(id)||id!==atividadeDaVez())return;
 state.sensorAberto=id;state.prazo=Number(fimMs)||Date.now()+tempoAtividadeMs();
 pararRelogioSensor();
 relogioSensor=setInterval(()=>{
  if(!state.sensorAberto)return pararRelogioSensor();
  if(Date.now()>=state.prazo)encerrarPorTempo(state.sensorAberto);
  else pintarRelogioSensor();
 },250);
 if(state.screen==='sensory')renderSensors();
 atualizarAcaoMestre();
}
/* A janela tem nome: a segunda atividade reaproveita a aba da primeira em vez
   de deixar três abas abertas na mesa. E ela é aberta por script, de dentro do
   toque, porque é isso que dá à Mesa o direito de FECHÁ-LA quando o tempo
   acabar — com <a target="_blank"> a aba fica órfã e a pessoa some do jogo. */
function abrirJanelaAtividade(id){
 const s=SENSORS[id],lote=state.lotes[id]||[];
 const url=`${s.href}?partida=${state.game}&itens=${lote.join(',')}&fim=${state.prazo||0}${state.variacao?`&var=${state.variacao}`:''}`;
 let j=null;
 try{j=window.open(url,'mosaico-atividade')}catch(e){j=null}
 if(!j){alert('O navegador bloqueou a janela da atividade. Libere as janelas para esta página e toque de novo.');return}
 state.janela=j;
 try{j.focus()}catch(e){}
}
function fecharJanelaAtividade(){
 try{if(state.janela&&!state.janela.closed)state.janela.close()}catch(e){}
 state.janela=null;
}
function encerrarPorTempo(id){
 pararRelogioSensor();
 /* Avisa a aba antes de fechá-la: se o navegador recusar o close (aba que a
    pessoa moveu para outra janela, por exemplo), ela pelo menos para de
    aceitar gestos e mostra a volta para a Mesa em vez de continuar valendo. */
 try{new BroadcastChannel('mosaico-carro-forte').postMessage({fonte:'mosaico-carro-forte',tipo:'sensor-encerrado',sensor:id,partida:state.game})}catch(e){}
 try{state.janela&&!state.janela.closed&&state.janela.postMessage({fonte:'mosaico-carro-forte',tipo:'sensor-encerrado',sensor:id,partida:state.game},location.origin)}catch(e){}
 setTimeout(fecharJanelaAtividade,1200);
 concluirSensor(id);
}
function concluirSensor(sensor){
 if(!sensor||sensor!==atividadeDaVez())return;
 pararRelogioSensor();
 state.sensorDone.add(sensor);
 state.sensorAberto=null;state.prazo=0;
 if(state.screen==='sensory')renderSensors();
 proximaAtividade();
}
/* ── QUEM ABRE A PRÓXIMA ─────────────────────────────────────────────────
   Nunca o jogador. No ritmo automático, o aparelho que manda na sala abre
   assim que a anterior fecha; no conduzido, ele espera o Mestre. O convidado
   nunca abre nada por conta própria: ele recebe o instante de fim pela sala,
   que é o que faz o tempo ser o mesmo para a mesa inteira. */
function proximaAtividade(){
 const id=atividadeDaVez();
 atualizarAcaoMestre();
 if(!id)return fimDaFila();
 if(state.sensorAberto)return;
 if(!souMestreDaSala())return;
 if(ritmoConduzido())return;
 liberarAtividade(id);
}
function liberarAtividade(id){
 if(!id||state.sensorAberto||!souMestreDaSala())return;
 const fim=Date.now()+tempoAtividadeMs();
 /* O nome viaja junto, como no da fase: o telão serve todas as mesas e não
    conhece as atividades de nenhuma — sem isto a tela grande escreveria
    'norte' em vez de 'A Janela do Norte'. */
 window.MosaicoPauta?.abrirAtividade?.(id,fim,state.game,SENSORS[id]?.title||id);
 iniciarAtividade(id,fim);
}
/* O botão da Sala pisca quando a mesa parou esperando uma decisão do Mestre —
   a mesma forma que a Mesa da Casa usa em .btn-menu-mestre.acao-necessaria. */
function atualizarAcaoMestre(){
 const sala=window.DragonSala;
 if(!sala)return;
 const id=atividadeDaVez();
 const precisa=!!id&&state.screen==='sensory'&&!state.sensorAberto&&ritmoConduzido()&&souMestreDaSala();
 sala.acao(precisa?{
  rotulo:`Abrir: ${SENSORS[id].title}`,
  texto:`A mesa está esperando esta atividade. A partir do momento em que você abrir, todos têm ${Math.round(tempoAtividadeMs()/1000)} segundos — quem não alcançar os fragmentos fica sem eles.`,
  aoTocar:()=>liberarAtividade(id)
 }:null);
}
/* ── O RELÓGIO DA FASE ────────────────────────────────────────────────────
   Um ouvinte só na sala entrega `partida` inteiro, e daqui saem três coisas:
   a atividade da vez, a fase da vez e o fecho. Eram três onSnapshot no mesmo
   documento. */
let ouvindoSala=false,relogioFase=null;
function ligarSala(){
 if(ouvindoSala||!window.MosaicoPauta?.ouvirPartida)return;
 ouvindoSala=true;
 window.MosaicoPauta.ouvirPartida(p=>{
  const a=p?.atividade;
  if(a&&a.sensor&&a.partida===state.game&&!state.sensorDone.has(a.sensor)&&state.sensorAberto!==a.sensor)
   iniciarAtividade(a.sensor,a.fimMs);
  const f=p?.fase;
  if(f&&f.nome&&(!f.partida||f.partida===state.game)&&f.nome!==state.fase.nome)aplicarFase(f);
  if(p?.fecho?.fase)receberFecho(p.fecho);
 });
 window.MosaicoPauta.arbitrarPlacar?.(conduzirFecho);
}
function pararRelogioFase(){clearInterval(relogioFase);relogioFase=null}
/* Quem abre é o Mestre — ou o próprio aparelho, quando não há sala. */
function abrirFase(nome){
 if(!nome)return;
 const prazo=fasePrazoMs(nome);
 const fim=prazo?Date.now()+prazo:0;
 /* O rótulo viaja junto porque quem desenha a tela grande não conhece as
    fases deste jogo — o telão serve todas as mesas e o que muda entre elas é
    uma tabela, não um arquivo. */
 if(salaCodigo()&&souMestreDaSala())window.MosaicoPauta?.abrirFase?.(nome,fim,state.game,FASES[nome]||nome.toUpperCase());
 aplicarFase({nome,fimMs:fim});
}
function aplicarFase(f){
 if(!f||!f.nome)return;
 pararRelogioFase();
 state.fase={nome:f.nome,fimMs:Number(f.fimMs)||0,vencida:false};
 document.body.classList.remove('fase-vencida');
 montarTelaDaFase(f.nome);
 if(state.fase.fimMs)relogioFase=setInterval(pulsarFase,250);
 pintarRelogio();
 atualizarAcaoDaMesa();
}
function montarTelaDaFase(nome){
 if(nome==='sensory'){renderSensors();go('sensory');proximaAtividade();return}
 if(nome==='evidence'){state.aberto=1;if(!state.tercos[0].length)montarDossie();renderDossie();go('evidence');return}
 if(nome==='hypothesis'){renderHypothesis();go('hypothesis');return}
 if(nome==='mosaic'){renderRelations();go('mosaic');return}
 if(nome==='final'){renderFinal();go('final');return}
 go(nome);
}
/* Os três terços abrem SOZINHOS, em um terço e em dois terços do tempo da
   fase. Antes havia um botão "abrir o segundo terço", e ele era do jogador:
   quem tocasse primeiro passava mais tempo com as pistas de fechamento na
   mão. Agora a janela é a mesma para a mesa inteira. */
function tercoPorTempo(){
 if(state.fase.nome!=='evidence'||!state.fase.fimMs)return 3;
 const total=fasePrazoMs('evidence');
 if(!total)return 3;
 const passado=total-(state.fase.fimMs-Date.now());
 return passado>=total*2/3?3:passado>=total/3?2:1;
}
function pulsarFase(){
 if(!state.fase.fimMs)return pararRelogioFase();
 if(state.fase.nome==='evidence'){
  const t=tercoPorTempo();
  if(t>state.aberto){state.aberto=t;renderDossie()}
 }
 if(Date.now()>=state.fase.fimMs)return venceuFase();
 pintarRelogio();
}
/* O sino. Ninguém é salvo por ter chegado tarde: o que estava por fazer fica
   por fazer, e o custo aparece no relatório. */
function venceuFase(){
 pararRelogioFase();
 const nome=state.fase.nome;
 state.fase={...state.fase,fimMs:0,vencida:true};
 document.body.classList.add('fase-vencida');
 pintarRelogio();
 if(nome==='final'){entregarDecisao();return}
 if(!souMestreDaSala())return atualizarAcaoDaMesa();
 if(ritmoConduzido())return atualizarAcaoDaMesa();
 abrirFase(proximaFase(nome));
}
/* Um alerta só para o Mestre, e ele sabe de qual assunto é: durante a fila
   das atividades quem manda é a atividade; fora dela, a fase. */
function atualizarAcaoDaMesa(){
 if(state.fase.nome==='sensory'&&atividadeDaVez())return atualizarAcaoMestre();
 const sala=window.DragonSala;
 if(!sala)return;
 const seguinte=proximaFase(state.fase.nome);
 const precisa=!!seguinte&&souMestreDaSala()&&ritmoConduzido()&&state.fase.vencida;
 sala.acao(precisa?{
  rotulo:`Abrir: ${FASES[seguinte]||seguinte.toUpperCase()}`,
  texto:'O tempo desta fase acabou e a mesa está esperando você virar a página.',
  aoTocar:()=>abrirFase(seguinte)
 }:null);
}
/* No fim da fila das atividades quem abre o dossiê é a mesa, não o jogador. */
function fimDaFila(){
 if(!souMestreDaSala())return atualizarAcaoDaMesa();
 if(ritmoConduzido()){state.fase={...state.fase,vencida:true};return atualizarAcaoDaMesa()}
 abrirFase('evidence');
}
function receberAviso(dado){
 if(!dado||dado.fonte!=='mosaico-carro-forte')return;
 if(dado.partida!==state.game)return;
 /* A colheita é filtrada pelo lote que a Mesa entregou àquela atividade: a
    página só devolve o que recebeu, e um aviso forjado não injeta fragmento.
    E ela chega FRAGMENTO A FRAGMENTO, não só no fim — sem isso, uma atividade
    encerrada pelo relógio chegaria vazia à Mesa mesmo com a pessoa tendo
    alcançado três de quatro, porque o único aviso vinha do botão de concluir
    que agora não existe mais. */
 const noLote=x=>(state.lotes[dado.sensor]||[]).includes(x);
 if(dado.tipo==='sensor-fragmento'){
  if(dado.sensor===state.sensorAberto&&noLote(dado.codigo))state.colhidos.add(dado.codigo);
  return;
 }
 if(dado.tipo!=='sensor-concluido')return;
 if(Array.isArray(dado.colheita))dado.colheita.filter(noLote).forEach(x=>state.colhidos.add(x));
 concluirSensor(dado.sensor);
}
try{new BroadcastChannel('mosaico-carro-forte').onmessage=e=>receberAviso(e.data)}catch(e){}
addEventListener('message',e=>{if(e.origin===location.origin)receberAviso(e.data)});

function cartaoFragmento(cod){
 const f=FRAGMENTOS[cod],m=state.marcados.has(cod);
 return `<button class="fragment depth ${m?'marked':''}" data-f="${cod}" type="button" aria-pressed="${m}"><small class="carta-num">${f.f.toUpperCase()}</small><strong>${f.t}</strong><p>${f.d}</p></button>`;
}

function renderDossie(){
 const host=$('dossierWaves');
 host.innerHTML=state.tercos.slice(0,state.aberto).map((lote,i)=>
  `<section class="wave"><div class="wave-head"><small>${TERCO_ROT[i]}</small><span>${lote.length} fragmento${lote.length===1?'':'s'}</span></div><div class="hand">${lote.map(cartaoFragmento).join('')}</div></section>`).join('');
 host.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{
  const c=b.dataset.f;
  state.marcados.has(c)?state.marcados.delete(c):state.marcados.add(c);
  renderDossie();
 });
 const tem=mao(),abertas=RELACOES.filter(r=>relacaoCompleta(r,tem)).length;
 /* 11/10/2026 (Tarefa 4): os depoimentos que só este aparelho ouviu. Cada pessoa que estava na
    agência fala para UM aparelho; a mentira de quem montou a janela só cai quando alguém conta o seu
    depoimento à mesa e outro acha o fragmento que o desmente. */
 const depo=window.CarroVariacoes?.meusDepoimentos?.()||[];
 if(depo.length){
  host.insertAdjacentHTML('beforeend',`<section class="wave depoimentos"><div class="wave-head"><small>DEPOIMENTOS · SÓ NESTE APARELHO</small><span>${depo.length} pessoa${depo.length===1?'':'s'}</span></div><p class="depo-nota">Ninguém mais na mesa leu estes. Conte o que importa.</p><div class="hand">${depo.map(d=>`<article class="fragment depth depo"><b class="depo-quem">${d.av} ${d.nome}</b><em class="depo-tom">${d.tom}</em><p>${d.fala}</p></article>`).join('')}</div></section>`);
 }
 $('dossierMeta').innerHTML=`<b>${state.marcados.size}</b> marcado${state.marcados.size===1?'':'s'} de ${tem.size} em mesa · <b>${abertas}</b> ${abertas===1?'relação já costurável':'relações já costuráveis'}`;
 /* O botão "abrir o segundo terço" era do JOGADOR, e isso dava a quem tocasse
    primeiro mais tempo com as pistas de fechamento na mão. Agora os terços
    abrem sozinhos, em um terço e em dois terços do tempo da fase, iguais para
    a mesa inteira — ver tercoPorTempo(). O nó fica, escondido, porque o
    rodapé conta com ele para o espaçamento. */
 $('nextWave').hidden=true;
 $('toHypothesis').hidden=state.aberto<3;
 ajustarDock();
}

/* Para o convidado os botões de virar a página não existem: a fase é da mesa
   e quem a abre é o Mestre, ou o relógio. Deixá-los visíveis e inertes seria
   pior — a pessoa toca, nada acontece, e ela acha que o jogo travou. */
const AVANCOS=['startGame','toEvidence','toHypothesis','toFinal'];
function ajustarDock(){
 const meu=souMestreDaSala();
 AVANCOS.forEach(id=>{
  const b=$(id);
  if(!b)return;
  b.dataset.mestre='1';
  if(!meu)b.hidden=true;
 });
 const aviso=$('esperaDaMesa');
 if(aviso)aviso.hidden=meu||state.screen==='intro'||state.screen==='reveal'||state.screen==='score';
}
function renderHypothesis(){
 const g=PARTIDAS[state.game],tem=mao();
 $('hypothesisPrompt').textContent=g.question;
 /* Camada só muda chrome/andaime — mesmas HIPOTESES (chaves canônicas). */
 const escolha=(window.MOSAICO_ROOM&&window.MOSAICO_ROOM.papelCamada)||(window.MosaicoPapelCamada&&window.MosaicoPapelCamada.carregar('carro-forte'))||{papel:'investigador',camada:'livre'};
 const camada=escolha.camada||'livre';
 const host=$('hypothesisList');
 host.innerHTML=ordenar(HIPOTESES,'hipoteses').map(h=>{
  const a=h.apoia.filter(c=>tem.has(c)),e=h.enfraquece.filter(c=>tem.has(c));
  const cls=a.length&&e.length?'tensao':a.length?'apoiada':e.length?'fraca':'neutra';
  const rot=a.length&&e.length?'EM TENSÃO':a.length?'APOIADA':e.length?'ENFRAQUECIDA':'SEM APOIO NA MESA';
  const marcas=[a.length?`apoiada por ${listar(a.map(tituloF))}`:'',e.length?`enfraquecida por ${listar(e.map(tituloF))}`:''].filter(Boolean).join(' · ')||'nenhum fragmento desta mesa a toca';
  return `<label class="hyp-card depth-card ${cls} ${state.hipoteseProv===h.id?'chosen':''}" data-hip-id="${h.id}"><input type="radio" name="hip" value="${h.id}" ${state.hipoteseProv===h.id?'checked':''}><span class="hyp-body"><small>${rot}</small><strong>${h.t}</strong><p>${h.d}</p><em>${marcas}</em></span></label>`;
 }).join('');
 host.querySelectorAll('input').forEach(i=>i.onchange=()=>{state.hipoteseProv=i.value;renderHypothesis()});
 /* Assistida/Guiada: densidade extra ao lado da lista (sem veredito / sem %). */
 let scaffold=host.parentElement&&host.parentElement.querySelector('[data-hpc-hyp-scaffold]');
 if(scaffold)scaffold.remove();
 if(camada!=='livre'&&window.MosaicoHipotesesCamada&&host.parentElement){
  const HPC=window.MosaicoHipotesesCamada;
  const wrap=document.createElement('div');
  wrap.setAttribute('data-hpc-hyp-scaffold','1');
  const playerId=(window.MOSAICO_ROOM&& (window.MOSAICO_ROOM.meuId||window.MOSAICO_ROOM.playerId))||'local';
  const scaffold=HPC.carregarScaffold('carro-forte',{
   partidaId:state.game,playerId,
   state:Object.assign({},state.hpcScaffold||{},{hipoteseId:state.hipoteseProv,selecionados:state.final||{}})
  });
  wrap.innerHTML=HPC.htmlPainel({
   caso:'carro-forte',papel:escolha.papel,camada,partidaId:state.game,
   omitHypothesisList:true,omitDecisionFields:true,
   state:scaffold
  });
  host.parentElement.insertBefore(wrap, host.nextSibling);
  HPC.ligarPainel(wrap,{
   caso:'carro-forte',papel:escolha.papel,camada,partidaId:state.game,playerId,
   onChange:function(st){
    state.hpcScaffold=st;
    /* Multiplayer hook: espelha contagens em campos do jogador quando existir. */
    try{
     const patch=HPC.roomPlayerFields(st);
     if(window.DragonSala&&typeof window.DragonSala.patchMe==='function')window.DragonSala.patchMe(patch);
     else if(window.MOSAICO_ROOM)window.MOSAICO_ROOM.hpcScaffold=patch.hpcScaffold;
    }catch(err){}
   }
  });
  /* Sync compare/radio → state.hipoteseProv (mesmas keys). */
  wrap.querySelectorAll('input[name="hpc-hip"]').forEach(inp=>{
   inp.onchange=()=>{state.hipoteseProv=inp.value;renderHypothesis();};
  });
 }
}

function renderRelations(){
 const tem=mao();
 $('relationGrid').innerHTML=RELACOES.map(r=>{
  const completa=relacaoCompleta(r,tem),feita=state.relacoes.has(r.id);
  const pecas=r.pecas.map(gr=>{const c=gr.find(x=>tem.has(x));return c?`<b>${tituloF(c)}</b>`:`<i>um fragmento que ainda não está na mesa</i>`}).join(' ↔ ');
  return `<button class="relation-card depth-card ${completa?'':'locked'} ${feita?'selected':''}" data-r="${r.id}" type="button" ${completa?'':'disabled'}><small>RELAÇÃO${completa?'':' · INCOMPLETA'}</small><h3>${r.t}</h3><div class="rel-pecas">${pecas}</div><p>${completa?r.efeito:'Falta o fragmento que permite interpretar o outro. Sem o par, o dado continua neutro.'}</p></button>`;
 }).join('');
 $('relationGrid').querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{
  const id=b.dataset.r;
  state.relacoes.has(id)?state.relacoes.delete(id):state.relacoes.add(id);
  renderRelations();
 });
 const h=HIPOTESES.find(x=>x.id===state.hipoteseProv);
 $('oldHypothesis').textContent=h?h.t:'Nenhuma hipótese registrada';
 const inimigas=h?RELACOES.filter(r=>relacaoCompleta(r,tem)&&h.enfraquece.some(c=>r.pecas.flat().includes(c))):[];
 $('counterPrompt').textContent=h
  ? (inimigas.length?`${inimigas.length>1?'As relações ':'A relação '}${listar(inimigas.map(tituloR))} contradiz${inimigas.length>1?'em':''} esta leitura sem tornar falso nenhum fato já revelado. Abandonar uma hipótese plausível diante de nova relação conta a favor no relatório.`
                    :'Nenhuma relação desta mesa contradiz a sua hipótese até aqui. Isso não a confirma: pode apenas significar que a peça que a testaria ainda não foi costurada.')
  : 'Registre uma hipótese provisória para que a contraprova tenha o que atacar.';
}

/* A RESPOSTA CERTA NÃO PODE SER SEMPRE A PRIMEIRA.
   Em "Quem construiu a janela?" os cinco campos tinham a verdade na primeira
   opção: escolher a de cima em tudo fechava 5/5 sem ler um fragmento — numa
   pergunta cuja graça é separar quem decidiu de quem executou e de quem abriu
   a porta sem saber para quê. É a forma como a lista nasce: escreve-se a
   verdade primeiro, porque é ela que se tem em mente, e as alternativas vêm
   depois. Por isso o conserto não é reordenar o arquivo à mão — a próxima
   lista que alguém acrescentar nasceria torta do mesmo jeito.

   A ordem é sorteada POR PARTIDA e POR CAMPO. Por partida, senão recarregar
   até a resposta subir vira estratégia, e a ordem mudaria debaixo do dedo de
   quem voltasse à tela. Por campo, senão as listas sairiam correlacionadas e
   quem notasse uma adivinharia as outras.

   O value de cada <option> é o próprio texto e pontuar() compara texto, então
   a ordem não mexe em quem pontua o quê. */
function ordenar(opts,chave){
 let h=state.semente>>>0;
 for(let i=0;i<chave.length;i++)h=Math.imul(h^chave.charCodeAt(i),16777619)>>>0;
 const a=opts.slice();
 for(let i=a.length-1;i>0;i--){h=Math.imul(h^h>>>15,2246822507)>>>0;const j=(h>>>8)%(i+1);[a[i],a[j]]=[a[j],a[i]]}
 return a;
}
/* 12/10/2026 (Manhã v2): "Ainda não é possível determinar" fica sempre por último. */
const NAO_DET='Ainda não é possível determinar';
function optionList(opts,value='',chave=''){const lista0=chave?ordenar(opts,chave):opts,lista=[...lista0.filter(o=>o!==NAO_DET),...lista0.filter(o=>o===NAO_DET)];return `<option value="">Selecione…</option>${lista.map(o=>`<option ${o===value?'selected':''}>${o}</option>`).join('')}`}

function renderFinal(){
 const g=PARTIDAS[state.game];
 $('finalPrompt').textContent=g.question;
 $('finalForm').innerHTML=g.fields.map(([label,opts])=>
  `<label class="field depth-card"><span>${label}</span><select name="${label}" required>${optionList(opts,'',state.game+'·'+label)}</select></label>`).join('')
 +`<label class="field depth-card green"><span>Hipótese que você sustenta no fechamento</span><select name="__hip" required><option value="">Selecione…</option>${ordenar(HIPOTESES,'hipotese-final').map(h=>`<option value="${h.id}" ${h.id===state.hipoteseProv?'selected':''}>${h.t}</option>`).join('')}</select></label>`
 +`<button class="btn primary depth" type="submit">Fechar a decisão <span>→</span></button>`;
}

function pontuar(){
 const g=PARTIDAS[state.game],tem=mao();
 let acertos=0;g.fields.forEach(([label,,ans])=>{if(state.final[label]===ans)acertos++});
 const campos=Math.round(acertos/g.fields.length*45);

 const hFinal=HIPOTESES.find(h=>h.id===state.hipoteseFinal);
 const hipotese=hFinal?(hFinal.id===g.hipotese?15:hFinal.canonica?10:0):0;

 const disp=RELACOES.filter(r=>relacaoCompleta(r,tem)),feitas=disp.filter(r=>state.relacoes.has(r.id));
 const relacoes=disp.length?Math.round(feitas.length/disp.length*20):0;

 const centrais=g.centrais.filter(c=>tem.has(c));
 const certos=[...state.marcados].filter(c=>centrais.includes(c)).length;
 const ruido=[...state.marcados].filter(c=>g.incidentais.includes(c)).length;
 const leitura=centrais.length?Math.max(0,Math.round(certos/centrais.length*10)-Math.min(4,ruido)):0;

 /* MEDE O QUE FOI ALCANÇADO, não quantas atividades "terminaram".
    Era sensorDone.size / activities.length — e desde que o relógio passou a
    fechar a atividade sozinho, TODA atividade termina: a conta dava 10 de 10
    para quem não encostou em nenhuma. O ponto sensorial deixou de medir
    qualquer coisa no dia em que o botão de pular saiu, e ninguém veria isso
    olhando a tela, só a nota alta de quem não fez nada.
    Agora vale o que entrou no dossiê. */
 const doSensor=sensoriais().length;
 const sensorial=doSensor?Math.round(state.colhidos.size/doSensor*10):0;
 const revisao=(state.hipoteseProv&&hFinal&&hFinal.canonica&&!HIPOTESES.find(h=>h.id===state.hipoteseProv).canonica)?5:0;

 return {total:Math.min(100,campos+hipotese+relacoes+leitura+sensorial+revisao),
  campos,hipotese,relacoes,leitura,sensorial,revisao,acertos,
  relFeitas:feitas.length,relDisp:disp.length};
}

/* A REVELAÇÃO TEM DUAS METADES, e só uma pode subir para a tela grande.
   Os passos canônicos — o que parecia, as relações, a inferência, o princípio —
   são os mesmos para a mesa inteira. O passo "HIPÓTESES QUE CAEM" não é: ele
   se calcula a partir do dossiê DESTE aparelho, e cada pessoa tem o seu. Pôr
   isso no telão seria anunciar como coletivo o que é de um — o mesmo defeito
   do placar que dizia "A mesa" e mostrava a nota do Mestre. Ele fica no
   celular, junto com o detalhe dos pontos. */
function passosDaRevelacao(incluirCaidas){
 const g=PARTIDAS[state.game],tem=mao();
 const caidas=HIPOTESES.filter(h=>!h.canonica&&h.enfraquece.some(c=>tem.has(c))).slice(0,3);
 const steps=[
  {k:'O QUE PARECIA',h:'R$ 480.000 desapareceram.',p:'Um saco vazio, uma câmera cega e a vigilância afastada organizam a interpretação antes de qualquer conferência.'},
  ...g.reveals.map((x,i)=>({k:`RELAÇÃO ${i+1}`,h:x,p:'Nenhum fato anterior foi alterado. Mudou a relação entre as evidências.'})),
  {k:'HIPÓTESES QUE CAEM',h:caidas.length?(caidas.length===1?'Uma leitura plausível cai.':`${caidas.length} leituras plausíveis caem.`):'Nenhuma hipótese foi derrubada nesta mesa.',
   p:caidas.length?caidas.map(h=>h.t).join('; ')+'. Cada uma nasceu de fatos verdadeiros lidos de forma incompleta.':'As pistas de fechamento não chegaram a se cruzar nesta duração.'},
  {k:'O QUE ACONTECEU',h:g.answer,p:'Nesta partida foi assim. Na próxima, a mesma manhã pode ter outra pessoa, outro motivo e outro valor.'},
  {k:'PRINCÍPIO',h:'A verdade devolve o dinheiro; a mentira fica com ele.',p:'No MOSAICO, um fato verdadeiro pode estar associado à interpretação errada.'},
  /* 12/10/2026 (Manhã v2): a conclusão máxima que os registros desta manhã sustentavam. */
  ...(g.ate?[{k:'COM O QUE VOCÊS TINHAM',h:'Dava para afirmar até aqui.',p:(t=>t.charAt(0).toUpperCase()+t.slice(1))(g.ate.replace(/^Com o que vocês tinham, dava para afirmar até isto:\s*/,''))+' O que ainda não tinha chegado à mesa não podia ser afirmado: “Ainda não é possível determinar” também é resposta certa.'}]:[])
 ];
 return incluirCaidas?steps:steps.filter(x=>x.k!=='HIPÓTESES QUE CAEM');
}
function renderReveal(){
 const steps=passosDaRevelacao(true);
 state.revealMax=steps.length-1;
 const s=steps[Math.min(state.reveal,state.revealMax)];
 /* 12/10/2026 (Manhã v2): a verdade completa é longa; o título longo desce de tamanho para caber. */
 $('revealStage').innerHTML=`<div class="reveal-card depth-card"><span class="eyebrow">${s.k}</span><h2${String(s.h).length>110?' class="longo"':''}>${s.h}</h2><p>${s.p}</p></div>`;
 $('nextReveal').hidden=false;
 $('nextReveal').innerHTML=state.reveal>=state.revealMax?'Ver o relatório <span>→</span>':'Continuar revelação <span>→</span>';
}

/* ── COM TELÃO, O CELULAR CALA ────────────────────────────────────────────
   Regra do Mario: revelação e pódio são sempre e só da tela grande. Aqui o
   aparelho não repete nada do que está lá em cima — nem a própria nota, que
   é justamente o que ninguém pode ver antes da hora. */
function esperarTelao(recado){
 $('revealStage').innerHTML=`<div class="reveal-card depth-card"><span class="eyebrow">A MESA FECHOU</span><h2>Olhe para a tela grande.</h2><p>${recado||'A revelação e o pódio acontecem lá. Este aparelho volta a falar quando o relatório de cada um abrir.'}</p></div>`;
 $('nextReveal').hidden=true;
}

function renderScore(){
 const g=PARTIDAS[state.game],s=pontuar(),hFinal=HIPOTESES.find(h=>h.id===state.hipoteseFinal);
 marcarFechada(state.game);
 /* COM TELÃO O PÓDIO NÃO SE REPETE AQUI: ele já foi na tela grande, e este
    aparelho mostra só o que é desta pessoa. Sem telão, é aqui que ele mora —
    e só aparece quando a mesa inteira entregou, nunca parcial. */
 const podio=$('podio');
 const temPodio=!state.telao&&state.placar.length>1;
 podio.hidden=!temPodio;
 if(temPodio)podio.innerHTML='<small>PÓDIO DA MESA</small>'+state.placar.map((x,i)=>
  `<div class="podio-linha${i===0?' primeiro':''}"><b>${i+1}º</b><span>${x.nome||'Investigador'}</span><i>${x.pontos}</i></div>`).join('');
 $('scoreTitle').textContent=g.title;
 $('totalScore').textContent=s.total;
 const rows=[['Campos da pergunta',s.campos,45],['Hipótese sustentada',s.hipotese,15],['Relações costuradas',s.relacoes,20],['Leitura do dossiê',s.leitura,10],['Atividades sensoriais',s.sensorial,10],['Revisão de hipótese',s.revisao,5]];
 $('scoreBars').innerHTML=rows.map(([n,v,m])=>`<div class="score-row"><span>${n}</span><div class="bar"><i style="width:${Math.min(100,v/m*100)}%"></i></div><b>${v}</b></div>`).join('');
 const hpcCards=[];
 try{
  const HPC=window.MosaicoHipotesesCamada;
  if(HPC){
   const playerId=(window.MOSAICO_ROOM&& (window.MOSAICO_ROOM.meuId||window.MOSAICO_ROOM.playerId))||'local';
   const sc=state.hpcScaffold||HPC.carregarScaffold('carro-forte',{partidaId:state.game,playerId});
   const bloco=HPC.htmlRelatorioProcesso(sc,{caso:'carro-forte'});
   if(bloco)hpcCards.push(bloco);
  }
 }catch(err){}
 $('endingCards').innerHTML=[
  `<article class="ending-card depth-card green"><small>PERGUNTA</small><h3>${g.question}</h3><p>${g.answer}</p></article>`,
  `<article class="ending-card depth-card gold"><small>CAMPOS</small><h3>${s.acertos}/${g.fields.length}</h3><p>Campos corretos da resolução específica desta partida.</p></article>`,
  `<article class="ending-card depth-card blue"><small>RELAÇÕES</small><h3>${s.relFeitas}/${s.relDisp}</h3><p>Relações completas nesta mesa que você efetivamente costurou.</p></article>`,
  `<article class="ending-card depth-card"><small>HIPÓTESE</small><h3>${hFinal?hFinal.t:'—'}</h3><p>${hFinal&&hFinal.canonica?'Sobrevive ao fechamento auditável.':'Continua plausível, mas não sobrevive às relações físicas.'}${s.revisao?' Você abandonou uma leitura anterior diante de nova evidência — isso conta a favor.':''}</p></article>`
 ].concat(hpcCards).join('');
 /* A coleção é o que traz a mesa de volta: as seis perguntas caem em rodízio,
    e o que falta fica visível sem revelar qual vem a seguir. */
 const feitas=fechadas(),total=Object.keys(PARTIDAS).length;
 $('colecao').innerHTML=`<small>PERGUNTAS DESTA MESA</small><b>${feitas.length} de ${total} fechadas</b><div class="colecao-marcas">${Object.keys(PARTIDAS).map(id=>`<span class="marca ${feitas.includes(id)?'on':''}">${feitas.includes(id)?PARTIDAS[id].nature:'?'}</span>`).join('')}</div><p>${feitas.length>=total?'A mesa fechou as seis. O rodízio recomeça em outra ordem, com outro dossiê.':'A próxima pergunta é sorteada pelo sistema — e nenhuma se repete antes que as seis tenham caído.'}</p>`;
 /* Ponte Manhã → Noite: mesmo código + pergunta congelada. */
 const hint=$('noiteBridgeHint'),btnNoite=$('toNoite');
 if(hint){
  hint.hidden=false;
  const code=salaCodigo();
  hint.innerHTML=code
   ?`A Noite continua com o <b>mesmo código ${code}</b> e a <b>mesma pergunta</b>. O Captura herda o fecho da manhã (${s.total}/100) para o orçamento inicial.`
   :`Abra a Noite com a <b>mesma pergunta</b> desta investigação. Sem sala, o Captura herda o fecho local (${s.total}/100) para o orçamento inicial.`;
 }
 if(btnNoite)btnNoite.hidden=false;
}

/* ── O FECHO DA MESA ──────────────────────────────────────────────────────
   Até 04/09/2026 não existia placar nenhum além do de cada aparelho: a nota
   nascia e morria no telefone de quem a fez, e o telão anunciava a do Mestre
   com o nome "A mesa". Agora cada um ENTREGA a sua, o Mestre arbitra, e o
   pódio só existe quando a mesa inteira entregou.

   NADA PARCIAL APARECE, para ninguém — nem para o Mestre, que também está
   jogando. Entre a entrega e o pódio não há tela de "3 de 6 já fecharam" com
   pontos: o que se sabe é quantos faltam, nunca quanto alguém fez. */
let relogioFecho=null;
const PASSO_MS=9000, PODIO_MS=12000;

/* A DECISÃO SE ENTREGA SOZINHA quando o tempo acaba. Antes era preciso tocar
   em enviar, e quem não tocasse não entrava no pódio nem via a revelação —
   ficava parado numa tela morta enquanto a mesa seguia. Vai o que estiver
   preenchido; campo em branco é campo errado, que é o custo de não ter feito. */
function entregarDecisao(){
 if(state.entregue)return;
 /* Guiada + Decisor: justificativa curta obrigatória (processo, sem spoiler). */
 try{
  const escolha=(window.MOSAICO_ROOM&&window.MOSAICO_ROOM.papelCamada)||(window.MosaicoPapelCamada&&window.MosaicoPapelCamada.carregar('carro-forte'))||{};
  const HPC=window.MosaicoHipotesesCamada;
  if(HPC&&HPC.canConfirmGuiada){
   const playerId=(window.MOSAICO_ROOM&& (window.MOSAICO_ROOM.meuId||window.MOSAICO_ROOM.playerId))||'local';
   const sc=state.hpcScaffold||HPC.carregarScaffold('carro-forte',{partidaId:state.game,playerId});
   const gate=HPC.canConfirmGuiada(sc,{papel:escolha.papel,camada:escolha.camada});
   if(!gate.ok){alert(gate.reason);return;}
  }
 }catch(err){}
 const form=$('finalForm');
 const dados=Object.fromEntries(new FormData(form));
 state.hipoteseFinal=(dados.__hip||'').split(' · ')[0]; /* o value é o próprio código (H10); o split segue aceitando o formato antigo */
 delete dados.__hip;
 state.final=dados;state.reveal=0;
 entregarAMesa();
 if(state.telao)esperarTelao();else renderReveal();
 go('reveal');
}
function entregarAMesa(){
 if(state.entregue)return;
 state.entregue=true;
 window.MosaicoPauta?.entregarNota?.(pontuar().total,state.game);
}
/* Só o Mestre chega aqui, e a cada nota que entra.

   ENQUANTO FALTA GENTE ELE NÃO FECHA — mas também não pode ficar refém de
   quem fechou a aba e foi embora: sem esta saída, uma pessoa que sai da sala
   sem entregar deixa a mesa inteira parada para sempre, com a tela grande na
   pergunta e ninguém sabendo o que esperar. O Mestre ganha o botão, e ele diz
   QUANTOS faltam — nunca quanto alguém fez. Contagem não é placar parcial. */
function conduzirFecho(lista,entregues,total){
 if(state.fechoComecou)return;
 state.placar=lista;
 if(total&&entregues>=total)return iniciarFecho();
 if(!entregues)return;
 window.DragonSala?.acao({
  rotulo:`Fechar a mesa com ${entregues} de ${total||entregues}`,
  texto:'Ainda falta alguém entregar a decisão. Se essa pessoa saiu da sala, feche agora — quem não entregou fica de fora do pódio.',
  aoTocar:iniciarFecho
 });
}
function iniciarFecho(){
 if(state.fechoComecou)return;
 state.fechoComecou=true;
 window.DragonSala?.acao(null);
 /* A TV PODE TER SIDO LIGADA DEPOIS. `state.telao` foi decidido lá atrás, na
    abertura, e ficaria mentindo pelo resto da partida: alguém liga o telão no
    meio e o fecho ainda cairia nos celulares, com a tela grande parada na
    pergunta. O Mestre é quem escuta a presença do telão ao vivo, então ele
    confere de novo na hora que importa. O contrário — telão que morreu — não
    precisa de conserto: o teto do fecho já solta a mesa. */
 if(window.DragonSala?.telaoPronto?.())state.telao=true;
 /* A RESOLUÇÃO SOBE AQUI, e não no relatório. Ela era publicada em
    renderScore(), que só roda quando o fecho chega em 'detalhe' — DEPOIS do
    pódio. O telão desenhava o pódio com o título da resolução vazio: um <h1>
    em branco na tela grande, na frente da mesa inteira, no momento em que
    todos estão olhando para lá. */
 window.MosaicoPauta?.publicarFim(PARTIDAS[state.game]);
 if(!state.telao)return void window.MosaicoPauta.publicarFecho({fase:'podio',placar:state.placar});
 state.passos=passosDaRevelacao(false);state.passoFecho=0;
 window.MosaicoPauta.publicarFecho({fase:'revelacao',passo:0,passos:state.passos});
 agendarFecho();
}
/* No ritmo automático a tela grande anda sozinha; no conduzido quem anda é o
   Mestre, pelo mesmo botão Sala que já pisca nas atividades. */
function agendarFecho(){
 clearTimeout(relogioFecho);
 if(ritmoConduzido()){acaoDoFecho();return}
 relogioFecho=setTimeout(avancarFecho,state.podioMostrado?PODIO_MS:PASSO_MS);
}
function avancarFecho(){
 if(state.passoFecho<state.passos.length-1){
  state.passoFecho++;
  window.MosaicoPauta.publicarFecho({fase:'revelacao',passo:state.passoFecho,passos:state.passos});
  return agendarFecho();
 }
 if(!state.podioMostrado){
  state.podioMostrado=true;
  window.MosaicoPauta.publicarFecho({fase:'podio',placar:state.placar});
  return agendarFecho();
 }
 clearTimeout(relogioFecho);
 /* O PLACAR VIAJA COM O 'detalhe' TAMBÉM. Ele ia só no 'podio', e no instante
    em que os celulares abriam a composição de pontos a tela grande perdia o
    pódio e ficava com a resolução sozinha — visto na sala 4CHRML. O pódio é o
    estado final da rodada: é o que a mesa olha enquanto cada um lê a própria
    nota, e fica lá até a próxima pergunta. */
 window.MosaicoPauta.publicarFecho({fase:'detalhe',placar:state.placar});
 window.DragonSala?.acao(null);
}
function acaoDoFecho(){
 const ultimo=state.passoFecho>=state.passos.length-1;
 window.DragonSala?.acao({
  rotulo:state.podioMostrado?'Abrir o relatório de cada um':ultimo?'Revelar o pódio':'Continuar a revelação',
  texto:state.podioMostrado
   ?'O pódio já está na tela grande. Isto solta a composição de pontos no aparelho de cada um.'
   :'A tela grande está esperando você virar a página.',
  aoTocar:avancarFecho
 });
}
/* O que cada aparelho faz com o que a mesa publicou. Sem telão ele ignora as
   fases de narração — a revelação é dele, no ritmo dele — e só guarda o pódio
   para o relatório. */
function receberFecho(f){
 if(!f||!f.fase)return;
 if(Array.isArray(f.placar))state.placar=f.placar;
 /* QUEM MANDA É O QUE O MESTRE PUBLICOU, não o que este aparelho achou lá na
    abertura. Uma revelação em fases só é publicada quando há telão — sem ele o
    Mestre vai direto ao pódio —, então a própria existência dela é o sinal, e
    o convidado acerta mesmo que a TV tenha sido ligada depois. */
 const naTelaGrande=f.fase==='revelacao'||(state.telao&&f.fase==='podio');
 if(naTelaGrande){
  /* Quem ainda não entregou a decisão não é arrastado para fora dela. */
  if(!state.entregue)return;
  if(f.fase==='revelacao')state.telao=true;
  esperarTelao(f.fase==='podio'?'O pódio está na tela grande. Em seguida este aparelho abre a sua composição de pontos.':null);
  if(state.screen!=='reveal')go('reveal');
  return;
 }
 if(f.fase==='podio'){if(state.screen==='score')renderScore();return}
 if(f.fase==='detalhe'&&state.entregue&&state.screen!=='score'){renderScore();go('score')}
}

/* ── Ligações ──────────────────────────────────────────────────────────── */
/* A abertura roda UMA vez, no começo da sessão — não espera o toque em
   "Começar a investigação". Casa toca sozinha na encenação / no Solo; aqui o
   prólogo já entregava o caso e a narração só nascia se alguém clicasse de
   novo, então o playtest via "Carro sem abertura".
   Começar ainda sorteia a pauta, mas espera a abertura terminar se ela
   ainda estiver no ar. Nas entradas seguintes (prólogo, próxima) ela não
   volta: MosaicoOpening.show() é inerte depois de terminada. */
let aberturaPedida=false;
let aberturaPronta=false;
const aposAbertura=[];
function quandoAbertura(fn){
  if(aberturaPronta)return fn();
  aposAbertura.push(fn);
  pedirAbertura();
}
function pedirAbertura(){
  if(aberturaPedida)return;
  aberturaPedida=true;
  const pronto=()=>{
    if(aberturaPronta)return;
    aberturaPronta=true;
    const fila=aposAbertura.splice(0);
    fila.forEach(f=>f());
  };
  if(window.MosaicoPauta?.abertura)return window.MosaicoPauta.abertura(pronto);
  if(window.MosaicoOpening?.show){
    window.addEventListener('mosaico-opening-finished',pronto,{once:true});
    window.MosaicoOpening.show();
    return;
  }
  pronto();
}
/* A pergunta da mesa é UMA. Quem sorteia é o Mestre e grava na sala; os outros
   recebem. Sem sala, `escolher` devolve o sorteio local intacto — é o caminho
   do ensaio e do aparelho solto, que continua sendo a maioria das partidas.
   Ver pauta-da-mesa.js: o defeito era dois celulares abrindo perguntas
   diferentes, cada um achando que jogava com o outro. */
/* 11/10/2026 (Tarefa 4): a variação da solução (variacoes-carro.js). Vem da sala, escolhida pelo
   Mestre junto com a pergunta; sem sala, este aparelho escolhe a menos jogada. Troca no lugar os
   fragmentos, as hipóteses, as relações e as perguntas, e reparte os depoimentos entre os aparelhos. */
function aplicarVariacao(vid){
 const CV=window.CarroVariacoes;if(!CV)return;
 state.variacao=vid&&CV.dados().variacoes[vid]?vid:CV.escolher(sementeDaSala('variacao'));
 CV.aplicar(state.variacao,{PARTIDAS,HIPOTESES,RELACOES,FRAGMENTOS},{jogadores:state.players});
}
function abrirPauta(anterior){
 const meu=opcoesDaTela();
 const local=()=>proximaPartida();
 const seguir=r=>{aplicarOpcoes(r?.opcoes||meu);const id=r?.pergunta||local();aplicarVariacao(r?.variacao);selectGame(id)};
 if(!window.MosaicoPauta){aplicarOpcoes(meu);aplicarVariacao(null);return selectGame(local())}
 /* avancarRodizio sobe o saco para a sala; local() só entra sem sala / fallback. */
 /* 11/10/2026 (Tarefa 4): o saco das seis perguntas continua entre salas. Cada sala nova chegava
    com o saco vazio, e a mesma pergunta podia sair três vezes seguidas em três noites. Sala sem saco
    herda o deste aparelho (o do Mestre), e o resultado volta para ele. */
 const avancarSalaELocal=r=>{const temSaco=r&&((Array.isArray(r.saco)&&r.saco.length)||r.ultima);const t=avancarRodizio(temSaco?r:{...lerRodizio(),...(r&&r.ultima?{ultima:r.ultima}:{})});salvarRodizio(t.rodizio);return t};
 window.MosaicoPauta.escolher(local,anterior||null,meu,avancarSalaELocal).then(seguir)
  .catch(e=>{console.error('MOSAICO: pauta falhou; sorteio local.',e);aplicarOpcoes(meu);aplicarVariacao(null);selectGame(local())});
}
/* A ABERTURA TOCA NUM APARELHO SÓ. Quem decide onde é o pauta-da-mesa.js: com
   telão vivo na sala, a narração vai para a tela grande e os celulares esperam;
   sem telão, ela toca só no aparelho do Mestre. Antes ela tocava aqui, sempre,
   em cada aparelho que abrisse a Mesa — inclusive nos dos convidados.

   O ouvinte global de 'mosaico-opening-finished' SAIU junto: quem espera o fim
   agora é o tocarAqui() de lá, que também escuta uma vez. Com os dois, a pauta
   era sorteada duas vezes seguidas. */
$('chooseGame').onclick=()=>{
 /* O botão sai de cena enquanto a abertura e a pauta estão em curso. Sem isto
    o segundo toque — e ele acontece, porque a abertura demora um pedido de
    rede para aparecer — dispara um sorteio paralelo por cima do primeiro: a
    mesa via a pergunta trocar sozinha depois da narração. selectGame devolve
    o botão. */
 $('chooseGame').disabled=true;
 quandoAbertura(()=>abrirPauta());
};
/* A sessão começa pela narração, não pelo prólogo. Sem esta chamada a
   abertura só existia se alguém tocasse em Começar — e o playtest relatava
   que Carro não tinha abertura. */
pedirAbertura();

/* A sala tem duas portas e só precisa de uma. O #dragonSalaBtn flutuante vem do
   firebase-room.js, compartilhado com A Noite, onde ele é a única porta e não
   pode sumir — aqui ele cobria o dock e atrapalhava a mão. Fica escondido pelo
   CSS, não removido: o clique programático continua funcionando e a presença do
   nó ainda é como esta página reconhece que este aparelho é o do Mestre.
   Quando game.js roda, liberar() já instalou o botão, então uma conferida
   basta. */
(function(){
 const flutuante=document.getElementById('dragonSalaBtn'),hud=$('hudSala');
 if(!flutuante)return;
 hud.hidden=false;
 /* O espelho carrega o alerta junto: firebase-room.js pinta acao-necessaria em
    tudo que tiver este atributo, e aqui o flutuante está escondido pelo CSS —
    se o alerta ficasse só nele, ninguém veria o botão piscar. */
 hud.setAttribute('data-dragon-sala-espelho','');
 hud.onclick=()=>flutuante.click();
})();
/* AS OPÇÕES SÃO DO MESTRE. Quem entra pelo QR não escolhe o tempo da atividade
   nem o tamanho do dossiê: recebe os dois pela sala, junto com a pergunta. */
(function(){
 if(souMestreDaSala())return;
 $('mesaOptions').hidden=true;
 const nota=$('mesaOptionsNote');
 nota.hidden=false;
 $('mesaOptionsText').textContent='O Mestre já definiu o ritmo e a duração desta mesa. Toque em começar para entrar.';
})();
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>go(b.dataset.back));
/* VIRAR A PÁGINA É DA MESA, NÃO DE QUEM ESTÁ COM O APARELHO. Estes quatro
   botões avançavam a fase no aparelho de cada um — e com fase coletiva isso
   deixaria duas pessoas em telas diferentes discutindo coisas diferentes.
   Ficam com o Mestre; para o convidado eles somem, e quem vira a página é o
   relógio. Sem sala, o próprio aparelho é a mesa. */
$('startGame').onclick=()=>abrirFase('sensory');
$('toEvidence').onclick=()=>{
 pararRelogioSensor();fecharJanelaAtividade();window.DragonSala?.acao(null);
 abrirFase('evidence');
};
$('toHypothesis').onclick=()=>abrirFase('hypothesis');
$('toFinal').onclick=()=>abrirFase('final');
/* A hipótese REGISTRA, e não avança mais. O alerta que travava quem não tinha
   escolhido também saiu: com relógio, travar a saída é prender a pessoa numa
   tela até o sino — e a regra é que quem não registrou apenas não pontua. */
$('hypothesisForm').onsubmit=e=>{
 e.preventDefault();
 renderHypothesis();
 if(souMestreDaSala())abrirFase('mosaic');
};
$('finalForm').onsubmit=e=>{e.preventDefault();entregarDecisao()};
$('nextReveal').onclick=()=>{
 if(state.reveal>=state.revealMax){renderScore();go('score')}
 else{state.reveal++;renderReveal()}
};
/* Na rodada nova o convidado espera a pergunta MUDAR: sem passar a que acabou,
   ele receberia de volta a mesma e jogaria duas vezes o mesmo caso. */
$('playAgain').onclick=()=>abrirPauta(state.game);
$('toNoite')&&($('toNoite').onclick=()=>{
 const ponte=window.MosaicoCelularParaNoite;
 const pergunta=state.game;
 const sala=salaCodigo();
 const jogadores=(window.MOSAICO_ROOM?.players||[]).length||0;
 const s=pontuar();
 const nomes=(window.MOSAICO_ROOM?.players||[]).map(p=>p?.nome||p?.name||p?.displayName).filter(Boolean);
 const fragmentosRevelados=[...new Set([...state.colhidos,...state.marcados])];
 const handoff={
  pergunta,sala,jogadores,nomes,variacao:state.variacao||null,
  fecho:{total:s.total,campos:s.campos,hipotese:s.hipotese,relacoes:s.relacoes,leitura:s.leitura,sensorial:s.sensorial,revisao:s.revisao,acertos:s.acertos},
  hipoteseFinal:state.hipoteseFinal||null,
  hipoteseProv:state.hipoteseProv||null,
  fragmentosRevelados
 };
 if(!ponte?.goToNoite){
  try{ponte?.persistHandoffLocal?.(handoff)||sessionStorage.setItem('mosaico-carro-handoff:'+(sala||'SOLO')+':'+(pergunta||'pauta'),JSON.stringify({...handoff,from:'celular',v:1,emMs:Date.now()}))}catch(e){}
  const q=new URLSearchParams({from:'celular'});
  if(sala)q.set('sala',sala);if(pergunta)q.set('pergunta',pergunta);
  location.href='../../../jogos/a-manha-do-carro-forte/a-noite/?'+q.toString();
  return;
 }
 ponte.goToNoite({sala,pergunta,jogadores,base:'../../../jogos/a-manha-do-carro-forte/a-noite/',handoff});
});
$('resetBtn').onclick=()=>{if(confirm('Reiniciar a Mesa e voltar à escolha inicial?'))location.reload()};
$('infoBtn').onclick=()=>$('drawer').classList.add('on');
$('drawerClose').onclick=()=>$('drawer').classList.remove('on');
$('drawer').onclick=e=>{if(e.target===$('drawer'))$('drawer').classList.remove('on')};

/* O cronômetro do cabeçalho era o tempo DECORRIDO desde que a mesa abriu, e
   não servia para decidir nada. Agora ele é o que falta na fase — que é o que
   muda o que a pessoa faz nos próximos segundos. Fora das fases com prazo
   (prólogo, revelação, relatório) ele volta a contar para cima. */
function pintarRelogio(){
 const el=$('timer');
 if(state.fase.fimMs){
  const r=Math.max(0,Math.ceil((state.fase.fimMs-Date.now())/1000));
  el.textContent=`${String(Math.floor(r/60)).padStart(2,'0')}:${String(r%60).padStart(2,'0')}`;
  el.classList.toggle('urgente',r<=10);
  return;
 }
 el.classList.remove('urgente');
 if(state.fase.vencida){el.textContent='00:00';return}
 const d=Math.floor((Date.now()-state.start)/1000);
 el.textContent=`${String(Math.floor(d/60)).padStart(2,'0')}:${String(d%60).padStart(2,'0')}`;
}
setInterval(pintarRelogio,1000);

go('intro');


/* Papel cognitivo + camada (MVP). Chip no HUD; andaime em Assistida/Guiada. */
(function mosaicoPapelCamadaCarro(){
  function aplicar(){
    const MPC=window.MosaicoPapelCamada;
    if(!MPC)return;
    const escolha=(window.MOSAICO_ROOM&&window.MOSAICO_ROOM.papelCamada)||MPC.carregar('carro-forte');
    const host=document.getElementById('mpcChipHost')||document.querySelector('.turnline-right')||document.querySelector('.topbar');
    const sessao=window.MOSAICO_ROOM?.role==='master'?'Mestre':(window.MOSAICO_ROOM?'Jogador':undefined);
    MPC.aplicarEmJogo({
      caso:'carro-forte',
      escolha,
      chipAlvo:host,
      sessao,
      andaimeAlvo:document.getElementById('app'),
      andaimePos:'afterbegin',
      partidaId:state.game||undefined,
      state:{hipoteseId:state.hipoteseProv,selecionados:state.final||{}}
    });
  }
  window.addEventListener('carroforte-mesa-ready',()=>setTimeout(aplicar,80),{once:true});
  if(window.MOSAICO_ROOM)setTimeout(aplicar,120);
  window.mosaicoReaplicarPapelCamada=aplicar;
})();
