'use strict';
// Bancada independente: o conteúdo fica no aparelho e não oferece sigilo contra inspeção do código.
const ANDARES = ['2º andar', '1º andar', 'Térreo'];
// Todos começam (e recomeçam a cada volta) no Saguão superior, no 2º andar; dali escolhem para onde ir.
const INICIO = {id:'saguao', name:'Saguão superior', andar:'2º andar', icon:'✦', sub:'Todo mundo começa aqui'};
const ROOMS = [
  {id:'gigantes', name:'Sala dos gigantes', andar:'2º andar', icon:'◈', sub:'Esqueleto de pescoço longo', peca:'D01'},
  {id:'predadores', name:'Sala dos predadores', andar:'2º andar', icon:'◍', sub:'Dentes e garras', peca:'D02'},
  {id:'veiculos', name:'Sala dos veículos', andar:'2º andar', icon:'▣', sub:'Caminhão de leite', peca:'N14'},
  {id:'porcelana', name:'Sala da porcelana', andar:'2º andar', icon:'❖', sub:'Xícara e delicadeza', peca:'N01'},
  {id:'jogos', name:'Sala dos jogos', andar:'2º andar', icon:'◐', sub:'Tabuleiro e estratégia', peca:'N15'},
  {id:'cranios', name:'Sala dos crânios', andar:'2º andar', icon:'⌘', sub:'Quem viveu antes', peca:'N13'},
  {id:'mobilia', name:'Sala da mobília', andar:'2º andar', icon:'▤', sub:'Cadeira de outra época', peca:'N02'},
  {id:'galeria', name:'Galeria especial', andar:'2º andar', icon:'▧', sub:'Obras e vitrines', peca:'F01'},
  {id:'auditorio', name:'Auditório', andar:'2º andar', icon:'▱', sub:'Programa e bastidores', peca:'C01'},
  {id:'asas', name:'Mezanino das asas', andar:'1º andar', icon:'✦', sub:'Outro jeito de voar', peca:'D08'},
  {id:'fosseis', name:'Sala dos fósseis', andar:'1º andar', icon:'◇', sub:'Provas na rocha', peca:'F02'},
  {id:'relogios', name:'Sala dos relógios', andar:'1º andar', icon:'⬡', sub:'Cada segundo conta', peca:'N03'},
  {id:'protecoes', name:'Sala das proteções', andar:'1º andar', icon:'✚', sub:'Capacete e história', peca:'N04'},
  {id:'fotografia', name:'Sala da fotografia', andar:'1º andar', icon:'☗', sub:'Câmera de outro tempo', peca:'N05'},
  {id:'prototipo', name:'Galeria do tempo', andar:'1º andar', icon:'◷', sub:'Protótipo e demonstração', peca:'D09'},
  {id:'eletrica', name:'Laboratório de formas', andar:'1º andar', icon:'⌁', sub:'Energia e equipamentos', peca:'B09'},
  {id:'deposito', name:'Sala das coleções', andar:'1º andar', icon:'▤', sub:'Inventário e movimentações', peca:'B02'},
  {id:'vidros', name:'Sala dos vidros', andar:'1º andar', icon:'▨', sub:'Transparência e brilho', peca:'N06'},
  {id:'mar', name:'Sala do mar', andar:'1º andar', icon:'▦', sub:'Peixes e águas', peca:'N12'},
  {id:'recepcao', name:'Recepção', andar:'Térreo', icon:'♧', sub:'Chegadas e convidados', peca:'B01'},
  {id:'conservacao', name:'Sala dos espécimes', andar:'Térreo', icon:'◇', sub:'Acervo e registros', peca:'B04'},
  {id:'seguranca', name:'Sala dos habitats', andar:'Térreo', icon:'◉', sub:'Alarmes e ocorrências', peca:'B07'},
  {id:'atelie', name:'Ateliê de descobertas', andar:'Térreo', icon:'✧', sub:'Ensaio e registros técnicos', peca:'L01'},
  {id:'corredor', name:'Área de descanso', andar:'Térreo', icon:'▥', sub:'Recados e caixas da equipe', peca:'L02'},
  {id:'sons', name:'Sala dos sons', andar:'Térreo', icon:'♢', sub:'Rádio e música', peca:'N07'},
  {id:'cotidiano', name:'Sala do cotidiano', andar:'Térreo', icon:'◌', sub:'Objetos de todo dia', peca:'N08'},
  {id:'ambar', name:'Sala do âmbar', andar:'Térreo', icon:'◑', sub:'Preso no tempo', peca:'N11'},
  {id:'patio', name:'Pátio de luz', andar:'Térreo', icon:'☼', sub:'Vista para a circulação', peca:'B05'},
  {id:'brinquedos', name:'Sala dos brinquedos', andar:'Térreo', icon:'✿', sub:'Carrinho e memória', peca:'N09'},
  {id:'lanternas', name:'Sala das lanternas', andar:'Térreo', icon:'◰', sub:'Luz de mão', peca:'N10'}
];
const EVENTS = {
  proteger:'Uma peça foi retirada para proteção.',
  troca:'Uma obra foi substituída por outra.',
  entrega:'Uma caixa chegou ao destino errado.',
  surpresa:'Uma apresentação surpresa foi interrompida.',
  documento:'Um documento foi retirado da exposição.',
  deslocamento:'Uma escultura foi levada para outro ambiente.',
  retorno:'Uma peça antiga retornou ao museu.',
  falsa:'A aparente falta de uma obra era um erro de registro.'
};
const ALARMS = {
  sensor:'O alarme disparou por uma falha do sensor.',
  manual:'O alarme foi acionado manualmente.',
  teste:'Um teste programado foi iniciado por engano.'
};
const FIGURES = {
  guarda:'Um guarda escondido entre as obras.',
  artista:'Uma artista preparada como estátua viva.',
  visitante:'Um visitante escondido na exposição.',
  restauradora:'Uma restauradora protegendo uma peça.',
  funcionario:'Uma funcionária preparando uma surpresa.'
};
const ACTIONS = {
  avisar:'Avisar a equipe de conservação antes da movimentação.',
  confirmar:'Conferir a identificação do item na entrega ou no transporte.',
  combinar:'Combinar a apresentação com a equipe de segurança.',
  revisar:'Revisar os registros antes de anunciar o desaparecimento.',
  isolar:'Isolar o equipamento que apresenta falha.'
};
// O índice identifica o cenário nas partidas salvas e nas salas cooperativas.
const CASES = [
 {event:'proteger',alarm:'sensor',figure:'guarda',room:'galeria',action:'avisar',subject:'uma pequena escultura de vidro',detail:'a equipe percebeu um risco na base da vitrine e deslocou a peça para evitar danos',clue:'uma base apresentava uma fissura'},
 {event:'troca',alarm:'manual',figure:'artista',room:'recepcao',action:'avisar',subject:'um retrato do acervo',detail:'uma cópia temporária substituiu o retrato durante uma verificação da moldura',clue:'uma ordem de serviço menciona a moldura'},
 {event:'entrega',alarm:'teste',figure:'visitante',room:'corredor',action:'confirmar',subject:'uma caixa identificada como lote 18',detail:'uma etiqueta antiga levou a caixa à sala de conservação, em vez do depósito',clue:'duas etiquetas com destinos diferentes foram encontradas na embalagem'},
 {event:'surpresa',alarm:'sensor',figure:'artista',room:'galeria',action:'combinar',subject:'uma apresentação de estátua viva',detail:'a apresentação prevista para o encerramento foi interrompida pela falha do sensor',clue:'o programa de encerramento indicava uma apresentação surpresa'},
 {event:'documento',alarm:'manual',figure:'funcionario',room:'recepcao',action:'revisar',subject:'uma carta de doação',detail:'a carta foi retirada da vitrine para conferir uma assinatura antes da apresentação',clue:'há um pedido de conferência da assinatura'},
 {event:'deslocamento',alarm:'teste',figure:'restauradora',room:'conservacao',action:'avisar',subject:'uma escultura de bronze',detail:'a escultura foi levada para uma inspeção do suporte antes do fechamento',clue:'a ficha da peça registra uma inspeção de suporte'},
 {event:'retorno',alarm:'sensor',figure:'visitante',room:'corredor',action:'confirmar',subject:'um pequeno relógio histórico',detail:'a peça retornou ao museu para uma exposição após um empréstimo',clue:'o comprovante de transporte aponta o fim de um empréstimo'},
 {event:'falsa',alarm:'manual',figure:'guarda',room:'seguranca',action:'revisar',subject:'um medalhão catalogado',detail:'o medalhão estava no local correto, mas seu número de inventário havia sido digitado incorretamente',clue:'os dois registros apresentam números de inventário diferentes'},
 {event:'proteger',alarm:'teste',figure:'restauradora',room:'conservacao',action:'avisar',subject:'um painel de papel antigo',detail:'o painel foi levado a um armário protegido após a equipe perceber umidade',clue:'um registro aponta aumento de umidade perto do painel'},
 {event:'troca',alarm:'sensor',figure:'funcionario',room:'galeria',action:'avisar',subject:'uma fotografia emoldurada',detail:'a fotografia foi substituída temporariamente por outra versão durante a montagem',clue:'o roteiro de montagem descreve duas versões da fotografia'},
 {event:'entrega',alarm:'manual',figure:'guarda',room:'corredor',action:'confirmar',subject:'uma caixa de ferramentas de restauração',detail:'a caixa foi entregue na recepção porque a etiqueta do setor se soltou',clue:'a embalagem estava sem a etiqueta do setor'},
 {event:'surpresa',alarm:'teste',figure:'funcionario',room:'recepcao',action:'combinar',subject:'uma homenagem ao antigo curador',detail:'a homenagem preparada em segredo foi interrompida quando o teste de alarme começou',clue:'um convite reservado menciona uma homenagem no encerramento'},
 {event:'documento',alarm:'sensor',figure:'visitante',room:'galeria',action:'revisar',subject:'um mapa antigo',detail:'o mapa foi retirado para registrar seu verso, que continha uma anotação',clue:'o pedido de fotografia menciona o verso do mapa'},
 {event:'deslocamento',alarm:'manual',figure:'artista',room:'corredor',action:'avisar',subject:'um pedestal com uma réplica',detail:'a réplica foi deslocada para preparar o espaço da apresentação',clue:'o plano da apresentação indica a mudança de posição do pedestal'},
 {event:'retorno',alarm:'teste',figure:'restauradora',room:'conservacao',action:'confirmar',subject:'um vaso restaurado',detail:'o vaso voltou da oficina de restauração e aguardava conferência antes de ser exposto',clue:'a ficha registra a conclusão da restauração'}
];
const labels={
  sensor:['Registro do sensor','O painel registrou uma falha no sensor antes do alarme; não há registro de acionamento manual.'],
  manual:['Registro de acionamento','O sistema registra um acionamento manual. Esse registro, sozinho, não informa a intenção de quem acionou.'],
  teste:['Calendário de manutenção','O painel registra que um teste programado foi iniciado. Um teste não prova, por si só, um incêndio.']
};
const figures={
  guarda:'O uniforme e o rádio indicam que a figura imóvel é um guarda. Ele sussurra: "Eu ia chamar a central, mas o estrondo me travou. Fiquei parado como manda o protocolo... só que de medo."',
  artista:'Uma credencial e o programa do evento mostram que a figura é uma artista de estátua viva. Ela fala sem mexer os lábios: "Se eu piscar, perco o personagem. A plateia volta, e eu não saio daqui sem o bis."',
  visitante:'Um ingresso e um relato identificam a figura como um visitante que entrou onde não deveria. Ele cochicha: "Eu só queria ver a sala por dentro, juro. A porta estava encostada. Agora não sei como sair sem ser visto."',
  restauradora:'Uma identificação e uma ficha de trabalho indicam que a figura é uma restauradora. Ela diz baixinho: "Não toque em nada. A umidade mudou e eu não largo esta peça até conferir o suporte."',
  funcionario:'Uma credencial de serviço identifica a figura como uma funcionária que preparava uma surpresa. Ela cochicha: "Shh! É surpresa para o pessoal. Ninguém pode saber ainda... você não vai contar, vai?"'
};
const roomDescriptions={galeria:'Vitrines, pedestais e obras aguardam o fechamento. Algo chama sua atenção entre os registros da exposição.',conservacao:'Fichas de acervo e materiais de trabalho contam uma parte da história dos objetos.',seguranca:'Um painel registra as ocorrências do edifício. O alarme é apenas um dos sinais daquela noite.',eletrica:'A luz de emergência revela equipamentos e anotações técnicas. Nem toda falha tem a mesma causa.',recepcao:'Convidados, entregas e registros de entrada se cruzam perto da porta principal, fechada pela grade de segurança.',corredor:'Pelo corredor passam pessoas e caixas. Olhar a passagem não revela, sozinho, toda a intenção.'};
const $=id=>document.getElementById(id);
const storageKey='cinco-minutos-ensaio-v1', historyKey='cinco-minutos-ciclo-v1';
let state=null,timerHandle=null,toastHandle=null;
function load(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function save(){try{localStorage.setItem(window.coop?.storageKey ?? storageKey,JSON.stringify(state))}catch{}}
function chooseCase(){let hist=load(historyKey,[]);if(!Array.isArray(hist))hist=[];let options=CASES.map((_,i)=>i).filter(i=>!hist.includes(i));if(!options.length){hist=[];options=CASES.map((_,i)=>i)}const i=options[Math.floor(Math.random()*options.length)];hist.push(i);try{localStorage.setItem(historyKey,JSON.stringify(hist))}catch{}return i}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const extraDescriptions = {
  prototipo: 'O protótipo da exposição fica ligado ao relógio de demonstração.',
  deposito: 'Etiquetas e fichas de movimentação documentam o trajeto de cada peça.',
  auditorio: 'Na coxia, a equipe prepara o encerramento da noite.',
  patio: 'O pátio oferece vista para a circulação entre as galerias.',
  atelie: 'A equipe deixou aqui a bancada de ensaio e um manual de demonstração.'
};
Object.assign(roomDescriptions, extraDescriptions);

const EXTRAS = {
  gigantes:"Um esqueleto de pescoço comprido ocupa a sala inteira. As luzes do teto o deixam ainda maior.",
  predadores:"Um predador montado em movimento domina a sala. A placa fala de dentes, garras e corrida.",
  veiculos:"Um caminhão de leite antigo está estacionado no meio da sala. A placa fala de entregas de madrugada.",
  porcelana:"Uma xícara de porcelana fina repousa numa base de vidro. A luz atravessa a borda como se fosse papel.",
  jogos:"Um tabuleiro de xadrez está com a partida no meio. As peças parecem aguardar o próximo lance.",
  cranios:"Um crânio antigo repousa numa vitrine escura. A luz suave atravessa o osso como uma vela.",
  mobilia:"Uma cadeira antiga de tecido bordado está cercada por uma cordinha. Uma plaquinha pede para não sentar.",
  asas:"Do mezanino se vê uma criatura de asas presa ao teto. As luzes de emergência ainda não acenderam.",
  fosseis:"Fósseis em placas de rocha estão nas bases de sempre. Uma criança deixou um desenho esquecido no chão.",
  relogios:"Um relógio de mão fica numa base inclinada. A placa fala de como a gente mede o tempo.",
  protecoes:"Um capacete antigo, arranhado e amassado, repousa num suporte. A placa fala de quem o usou.",
  fotografia:"Uma câmera fotográfica antiga fica sobre um tripé de madeira. A placa conta como as pessoas guardavam um instante.",
  vidros:"Um porta-velas de vidro guarda o reflexo da sala. Tudo que passa por trás aparece torto.",
  mar:"Um peixe grande de escamas prateadas nada no ar, preso por fios. A placa fala de rios e mares.",
  sons:"Um rádio de caixa grande fica sobre um pedestal. A placa pergunta se você ainda lembra de uma fita cassete.",
  cotidiano:"Uma garrafa d’água comum virou peça de museu. A placa pergunta o que a gente guarda e o que joga fora.",
  ambar:"Um mosquito aparece preso dentro de um bloco de âmbar. A placa diz que ele ficou parado por milhões de anos.",
  brinquedos:"Um carrinho de brinquedo está parado numa pista de madeira. Uma criança deixou a marca de um dedo no vidro.",
  lanternas:"Uma lanterna de metal pende de um gancho. A placa fala de como se andava no escuro antes da luz elétrica."
};
const EXTRA_ORDEM = Object.keys(EXTRAS);
Object.keys(EXTRAS).forEach(k => { roomDescriptions[k] = EXTRAS[k]; });

function makeClues(c){
 const evidence=labels[c.alarm][1],fig=figures[c.figure],room=ROOMS.find(r=>r.id===c.room).name;
 const base={
  galeria:[
   {id:'gal1',name:'Observar a montagem',time:0,text:'Preso à vitrine, um cartão escrito à mão fala de '+c.subject+'. Embaixo, uma observação de alguém da montagem: '+c.clue+'.'},
   {id:'gal2',name:'Examinar o registro de acervo',time:90,text:'No livro de turno da galeria, a última anotação diz: '+c.detail+'.'},
   {id:'gal3',name:'Procurar sinais da figura',time:180,text:c.room==='galeria'?fig:'Um registro de ronda indica uma figura imóvel em '+room+'.'}],
  conservacao:[
   {id:'con1',name:'Ler a ficha de conservação',time:0,text:'Na bancada, a ficha de '+c.subject+' traz uma nota de próprio punho: '+c.detail+'.'},
   {id:'con2',name:'Examinar a observação técnica',time:90,text:'Presa à pasta, outra nota técnica avisa: '+c.clue+'.'},
   {id:'con3',name:'Consultar o plano de prevenção',time:180,text:'No quadro de avisos, uma nota recomenda: '+ACTIONS[c.action]},
   ...(c.room==='conservacao'?[{id:'con4',name:'Conversar com a figura imóvel',time:180,text:fig}]:[])],
  seguranca:[
   {id:'seg1',name:'Ler o registro do alarme',time:165,text:evidence},
   {id:'seg2',name:'Consultar a ocorrência',time:195,text:ALARMS[c.alarm]+' O registro não permite concluir sozinho o que ocorreu com o acervo.'},
   {id:'seg3',name:'Verificar a ronda',time:180,text:c.room==='seguranca'?fig:'A ronda menciona uma figura imóvel em '+room+'.'}],
  eletrica:[
   {id:'ele1',name:'Examinar o painel',time:165,text:evidence},
   {id:'ele2',name:'Ler a anotação técnica',time:90,text:'Há uma anotação: '+c.clue+'. Ela deve ser relacionada a outros registros.'},
   {id:'ele3',name:'Analisar o protótipo',time:180,text:'O registrador do Laboratório de formas aponta um pulso do protótipo às 21h57, antes do alarme. O manual prevê outro pulso às 22h. O comando de suspensão fica na Galeria do tempo.'}],
  recepcao:[
   {id:'rec1',name:'Consultar a movimentação',time:0,text:'Atrás do balcão, um bilhete sobre '+c.subject+' ficou esquecido. Nele se lê: '+c.clue+'.'},
   {id:'rec2',name:'Examinar o livro de ocorrências',time:90,text:'No livro de ocorrências, a última linha diz: '+c.detail+'.'},
   {id:'rec3',name:'Observar a figura',time:180,text:c.room==='recepcao'?fig:'Uma pessoa da recepção comenta, baixando a voz: "Tinha alguém parado feito estátua em '+room+'. Eu não quis chegar perto."'}],
  corredor:[
   {id:'cor1',name:'Examinar o registro de passagem',time:0,text:'No registro de passagem, a letra é apressada: '+c.detail+'.'},
   {id:'cor2',name:'Ler o recado da equipe',time:90,text:'Colado na parede, o recado da equipe sugere: '+ACTIONS[c.action]},
   {id:'cor3',name:'Verificar a figura imóvel',time:180,text:c.room==='corredor'?fig:'Um recado indica que alguém viu uma figura imóvel em '+room+'.'}],
  prototipo:[
   {id:'pro1',name:'Ler a placa da demonstração',time:0,text:'A demonstração guarda o instante de referência, às 21h55. Ao terminar, o protótipo deveria apenas projetar uma imagem desse instante.'},
   {id:'pro2',name:'Observar o primeiro pulso',time:120,text:'Às 21h57, o relógio do protótipo recua por um segundo. O estrondo vem da Galeria especial e a luz cai. O alarme soa mais tarde.'},
   {id:'pro3',name:'Conferir o comando de suspensão',time:180,text:'O manual indica que suspender a demonstração antes das 22h interrompe o pulso de retorno. O comando não altera o que já aconteceu nas outras salas.'}],
  deposito:[
   {id:'dep1',name:'Consultar o inventário',time:0,text:'Na prancheta do depósito, a ficha de movimentação menciona '+c.subject+'.'},
   {id:'dep2',name:'Conferir a ficha de transferência',time:90,text:'Um papel dobrado dentro da prancheta registra a transferência: '+c.detail+'.'}],
  auditorio:[
   {id:'aud1',name:'Ler o aviso da produção',time:0,text:'A produção pede que as equipes de montagem e segurança confirmem separadamente suas tarefas de encerramento.'},
   {id:'aud2',name:'Consultar a mensagem da produção',time:90,text:'Uma mensagem sobre '+c.subject+' foi arquivada na pasta de encerramento: '+c.clue+'.'}],
  patio:[
   {id:'pat1',name:'Comparar a iluminação das alas',time:120,text:'O apagão atinge as galerias às 21h57. O aviso sonoro ainda não começou.'},
   {id:'pat2',name:'Ouvir a equipe da ronda',time:180,text:'Da circulação, a equipe localizou a figura imóvel em '+room+'.'}],
  atelie:[
   {id:'ate1',name:'Ler o caderno de ensaio',time:0,text:'O ensaio diferencia o pulso que fixa a referência do pulso que fecha a demonstração. O retorno acontece no segundo pulso.'},
   {id:'ate2',name:'Ler a instrução de encerramento',time:180,text:'Em caso de repetição, use Suspender demonstração na Galeria do tempo antes do pulso final, às 22h.'}]
 };
 // Salas sem peça-chave: um aviso de rotina e um eco, sempre verdadeiro, de um dos quatro eixos (acontecimento, alarme, figura, prevenção).
 const ecos=[
  ['Ler o bilhete de rotina','Um bilhete de rotina cita '+c.subject+'.'],
  ['Conferir o registro do alarme',evidence],
  ['Ouvir o relato da ronda','Um relato da ronda indica uma figura imóvel em '+room+'.'],
  ['Ler o recado da equipe','Um recado da equipe sugere: '+ACTIONS[c.action]]
 ];
 const ROTINA=[
  ['Observar a etiqueta de horário','Uma etiqueta de acervo marca o horário de fechamento da ala: 22h.'],
  ['Observar o carrinho de limpeza','Há um carrinho de limpeza encostado perto da porta.'],
  ['Ler o livro de visitas','O livro de visitas da sala tem poucas assinaturas hoje.'],
  ['Ouvir a equipe de limpeza','Uma pessoa da limpeza conta: "Passei aqui às 21h30, tudo em ordem. Só o carrinho ficou torto, culpa minha."'],
  ['Observar a luz de emergência','Uma lâmpada de emergência fica de prontidão acima da porta.'],
  ['Ler a planilha de umidade','A planilha de umidade da sala mostra números normais.'],
  ['Observar o piso','O piso foi encerado hoje e ainda tem cheiro de cera.'],
  ['Ouvir um guia','Um guia comenta, animado: "O grupo da tarde não queria sair desta sala! Eu quase perdi o horário."'],
  ['Observar a faixa de segurança','Há uma faixa de segurança pintada no chão, junto ao corrimão.'],
  ['Ler o aviso da parede','O aviso na parede lembra que a grade da porta principal desce depois do fechamento.'],
  ['Conferir o extintor','O extintor foi conferido na semana passada; a etiqueta está em dia.'],
  ['Ler a ordem de serviço','Uma ordem de serviço pede para trocar uma lâmpada da sala. Nada urgente.']
 ];
 EXTRA_ORDEM.forEach((id,k)=>{
  const [nome,texto]=ecos[k%4], [nome2,texto2]=ecos[(k+2)%4];
  const r=j=>ROTINA[(k*5+j*4)%ROTINA.length];
  base[id]=[
   {id:id+'-0',name:'Observar o ambiente',time:0,text:EXTRAS[id]},
   {id:id+'-r0',name:r(0)[0],time:25,text:r(0)[1]},
   {id:id+'-1',name:nome,time:60+(k%3)*45,text:texto},
   {id:id+'-r1',name:r(1)[0],time:110,text:r(1)[1]},
   {id:id+'-2',name:nome2,time:150+(k%3)*30,text:texto2},
   {id:id+'-r2',name:r(2)[0],time:200,text:r(2)[1]}];
 });
 Object.values(base).forEach(list=>list.forEach(cl=>{cl.tipo=/^(Ouvir|Conversar|Perguntar)/.test(cl.name)?'Relato':/^(Ler|Consultar|Examinar o registro|Examinar a ficha|Conferir a ficha|Conferir o registro|Comparar)/.test(cl.name)?'Registro':'Observação';}));
 return base;
}
const TIME_PATHS = {
 suspension: {
  room:'prototipo', source:'atelie', opens:120, closes:300, code:'P-7',
  control:'Painel da demonstração', action:'Suspender demonstração',
  alternative:'Silenciar o aviso da demonstração',
  observation:'No painel P-7, o relógio da demonstração perde um segundo no primeiro pulso. O visor ainda indica uma segunda emissão programada.',
  instruction:'A emissão final depende do modo Demonstração. Entre 21h57 e 22h, use Suspender demonstração no painel P-7.',
  distractor:'O aviso foi silenciado. O visor ainda mostra a emissão final programada.',
  reconstruction:'Na Galeria do tempo, a demonstração guardou uma referência às 21h55. O pulso das 21h57 derrubou a iluminação. A emissão programada para as 22h reconectava o museu à referência.',
  success:'Você suspendeu a demonstração na Galeria do tempo. Sem a emissão final, o relógio avançou depois das 22h.'
 },
 reserve: {
  room:'eletrica', source:'seguranca', opens:120, closes:240, code:'A-3',
  control:'Painel da alimentação de ensaio', action:'Desacoplar a reserva do protótipo',
  alternative:'Rearmar a iluminação principal',
  observation:'No painel A-3, depois do apagão, o protótipo transfere a alimentação para a reserva. Às 21h59, o painel trava essa alimentação até o fechamento.',
  instruction:'Depois da transferência às 21h57 e antes do travamento das 21h59, desacople a reserva do protótipo pelo painel A-3.',
  distractor:'O painel tentou rearmar as luzes. A reserva do protótipo continuou acoplada.',
  reconstruction:'Às 21h57, o pulso derrubou as luzes e transferiu o protótipo para a reserva. Às 21h59, o painel travava a reserva. Essa alimentação sustentava o retorno das 22h.',
  success:'Você desacoplou a reserva antes do travamento. O protótipo ficou sem alimentação no fechamento e o tempo seguiu.'
 },
 rehearsal: {
  room:'auditorio', source:'recepcao', opens:90, closes:210, code:'M-2',
  control:'Mesa de produção', action:'Cancelar o sinal de encerramento',
  alternative:'Silenciar os alto-falantes',
  observation:'Na mesa M-2, a produção agendou um sinal silencioso, independente do áudio. Às 21h58min30s, o comando sai da mesa e fica na fila do protótipo.',
  instruction:'Entre a abertura da mesa às 21h56min30s e o envio automático às 21h58min30s, cancele o sinal de encerramento na mesa M-2.',
  distractor:'Os alto-falantes ficaram mudos. O sinal silencioso continuou agendado.',
  reconstruction:'O pulso inicial causou o apagão, mas dependia de um disparo externo para repetir a noite. O sinal da produção entrou na fila às 21h58min30s e ordenou o retorno às 22h.',
  success:'Você cancelou o sinal na mesa de produção. Nenhuma ordem de retorno chegou ao protótipo.'
 },
 reference: {
  room:'atelie', source:'deposito', opens:60, closes:180, code:'R-5',
  control:'Leitor da referência de ensaio', action:'Retirar o cartão do leitor',
  alternative:'Fechar o caderno de ensaio',
  observation:'O leitor R-5 abriu às 21h56. Às 21h58, ele envia ao protótipo a referência gravada no cartão que estiver encaixado.',
  instruction:'Retire o cartão do leitor R-5 entre 21h56 e 21h58. Depois do envio, retirar o cartão não apaga a referência recebida.',
  distractor:'O caderno foi fechado. O leitor ainda pôde enviar a referência.',
  reconstruction:'O cartão do Ateliê guardava o instante das 21h55. O pulso inicial causava o apagão, mas só após receber o cartão às 21h58 o protótipo conseguia reconstruir a cena às 22h.',
  success:'Você retirou o cartão antes do envio. Sem a referência temporal, o pulso das 22h não refez a noite.'
 }
};
const CASE_PATHS = [
 'reserve','suspension','reference','rehearsal','reference',
 'reserve','reference','suspension','reserve','rehearsal',
 'reference','rehearsal','suspension','rehearsal','reserve'
];
// Código dos equipamentos: sorteado a cada partida (escalas: nenhum código fixo visível, para não decorar entre partidas).
// Os textos de TIME_PATHS guardam o código-modelo; ao usar, ele é trocado pelo código sorteado da partida.
function sortearCodigos(){
 const letras = 'ABCDEFGHJKLMNPRSTUVWXZ', usados = new Set(Object.values(TIME_PATHS).map(p => p.code)), out = {};
 for (const k of Object.keys(TIME_PATHS)) {
  let c;
  do { c = letras[Math.floor(Math.random()*letras.length)]+'-'+(1+Math.floor(Math.random()*9)); } while (usados.has(c));
  usados.add(c); out[k] = c;
 }
 return out;
}
function resolvePath(key){
 const modelo = TIME_PATHS[key];
 state.codes ??= sortearCodigos();
 const code = state.codes[key] ?? modelo.code, out = {key, ...modelo};
 for (const f of Object.keys(out)) if (typeof out[f] === 'string') out[f] = out[f].split(modelo.code).join(code);
 out.code = code;
 return out;
}
const LEGACY_PATH = {...TIME_PATHS.suspension, opens:0};
// História entre as voltas: cada retorno mostra um pouco mais do clima da noite, sem entregar a resposta.
const ENTRE_VOLTAS = [
 'As portas voltaram a fechar. Os objetos estão onde estavam. Você conserva o que descobriu.',
 'De novo. Você já sabe o que esperar perto das 22h: o estrondo e a luz que cai. O que ainda não sabe é por que a noite recomeça.',
 'Terceira vez. Alguns registros não batem com o que as pessoas contam. Anote quem disse o quê, e a que horas.',
 'Quarta vez. O museu fecha em minutos e alguma coisa precisa ser feita antes das 22h. Você já sabe onde, quando e como?'
];
// Uma pergunta para a turma conversar depois da revelação (uma por caso).
const VALORES = [
 'Vale mover uma obra sem avisar ninguém para evitar um dano?',
 'Uma cópia no lugar da obra é cuidado ou engano?',
 'Quem responde quando uma etiqueta antiga leva a caixa para o lugar errado?',
 'O que pesa mais: manter a surpresa ou seguir o protocolo de segurança?',
 'Conferir uma assinatura justifica retirar um documento sem avisar quem o expôs?',
 'Inspecionar uma peça justifica deixar a sala vazia na hora do fechamento?',
 'Quem confirma que uma peça emprestada voltou inteira?',
 'Anunciar um desaparecimento antes de revisar os registros é prudência ou pressa?',
 'Proteger uma obra pode ser mais importante do que mostrá-la?',
 'Quando existem duas versões de uma obra, qual delas o visitante deveria ver?',
 'Uma etiqueta solta é falha de quem entrega ou de quem recebe?',
 'Guardar segredo por carinho justifica atrapalhar o trabalho dos outros?',
 'Registrar o verso de uma obra muda o que ela significa?',
 'Mover uma réplica para uma apresentação é diferente de mover uma peça de verdade?',
 'Uma restauração apaga a história de uma peça ou ajuda a preservá-la?'
];
const timePath = () => state.caseRules === 2
 ? resolvePath(CASE_PATHS[state.caseIndex])
 : LEGACY_PATH;

function scenarioClues(){
 const clues = makeClues(current());
 if (state.caseRules !== 2) return clues;

 const path = timePath();
 // A primeira emissão é comum. As fontes da segunda dependem da partida.
 clues.eletrica.pop();
 clues.prototipo.pop();
 clues.atelie = [];
 clues.prototipo[0].text = 'O protótipo produz uma imagem temporal a partir de uma referência. O fechamento da demonstração depende de um comando que pode vir de outro setor.';
 clues.prototipo[1].text = 'Às 21h57, um pulso faz o relógio recuar um segundo. O estrondo vem da Galeria especial e a luz cai. O alarme soa mais tarde.';
 clues.atelie.push({id:'atebase',name:'Ler a anotação de ensaio',time:0,tipo:'Registro',text:'As duas emissões têm funções diferentes. O pulso inicial pode ocorrer mesmo quando a ordem de fechamento ainda não está pronta.'});
 clues[path.room].push({id:'time-control',name:'Observar o mecanismo',time:path.opens,tipo:'Observação',text:path.observation});
 clues[path.source].push({id:'time-source',name:'Consultar o procedimento de encerramento',time:60,tipo:'Registro',text:path.instruction});
 // O procedimento cita só o código do equipamento. Dois diretórios, em ambientes diferentes, dizem onde cada código fica.
 const diretorio = 'Diretório de equipamentos: ' + Object.keys(TIME_PATHS).map(resolvePath).map(p => p.code+' fica em '+ROOMS.find(r=>r.id===p.room).name).join('; ') + '.';
 clues.seguranca.push({id:'time-dir1',name:'Consultar o diretório de equipamentos',time:30,tipo:'Registro',text:diretorio,fatos:['dir']});
 clues.patio.push({id:'time-dir2',name:'Ler o mapa de equipamentos',time:60,tipo:'Registro',text:diretorio,fatos:['dir']});
 clues[path.source].find(q => q.id === 'time-source').fatos = ['when','how','predict','proc'];
 // Salas sem peça-chave: três ecos verdadeiros, de fatos diferentes (21/11/2026: mais caminhos até cada fato essencial).
 const c = current(), evidence = labels[c.alarm][1], room = ROOMS.find(r=>r.id===c.room).name;
 const eco = [
  ['Ler o aviso interno', 'Um aviso interno conta que '+c.detail+'.', 'Registro', ['event']],
  ['Conferir o registro do alarme', evidence, 'Registro', ['alarm']],
  ['Ouvir o relato da ronda', 'Um relato da ronda indica uma figura imóvel em '+room+'.', 'Relato', ['where']],
  ['Ler o recado da equipe', 'Um recado da equipe sugere: '+ACTIONS[c.action], 'Registro', ['action']],
  ['Ouvir um colega da ronda', figures[c.figure], 'Relato', ['figure']],
  ['Ler a cópia do procedimento', path.instruction, 'Registro', ['when','how','predict','proc']],
  ['Consultar o diretório afixado', diretorio, 'Registro', ['dir']],
  ['Ouvir uma técnica', 'Uma técnica conta: '+path.observation, 'Relato', ['when','how']]
 ];
 EXTRA_ORDEM.forEach((id, k) => {
  const fixos = clues[id].filter(q => !/-(1|2|r1)$/.test(q.id));
  const tempos = [60+(k%3)*45, 110, 150+(k%3)*30];
  const novos = [0,1,2].map(j => { const [name,text,tipo,fatos] = eco[(k*3+j)%eco.length]; return {id:id+'-'+(j+1), name, time:tempos[j], text, tipo, fatos}; });
  clues[id] = [...fixos, ...novos];
 });
 return clues;
}

function elapsedStoryTime(now){
 const duration = state.duration;
 return (duration - (state.endAt-now)/1000)*300/duration;
}

function clockAt(seconds){
 const minute = 55+Math.floor(seconds/60);
 return (minute<60?'21h':'22h')+String(minute%60).padStart(2,'0')+
  (seconds%60 ? 'min'+String(seconds%60).padStart(2,'0')+'s' : '');
}

function show(id){$('coopShortcut').classList.toggle('hidden',id==='start'||!!window.coop);['start','game','between','final','result'].forEach(x=>$(x).classList.toggle('hidden',x!==id));window.scrollTo({top:0,behavior:'instant'})}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastHandle);toastHandle=setTimeout(()=>$('toast').classList.remove('show'),2200)}
function popup(id){if(!$(id).open)$(id).showModal()}
function fmt(s){s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function museumTime(){
 const elapsed = Math.max(0, Math.min(300, Math.floor((state.duration-state.remaining)*300/state.duration)));
 const minutes = 55+Math.floor(elapsed/60);
 return (minutes<60?'21:':'22:')+String(minutes%60).padStart(2,'0')+':'+String(elapsed%60).padStart(2,'0');
}
function current(){return CASES[state.caseIndex]}
function reset(){clearInterval(timerHandle);state={caseIndex:chooseCase(),loop:1,phase:'choose',room:null,duration:Number($('speed').value),remaining:Number($('speed').value),endAt:null,clues:[],hints:0,notes:'',answers:null,liveFinal:true,caseRules:2,archive:[],codes:sortearCodigos()};save();renderGame();show('game')}
function enterRoom(id){if(window.coop){window.coop.choose(id);return}if(state.phase!=='choose')return;state.room=id;state.phase='playing';state.remaining=state.duration;state.endAt=Date.now()+state.remaining*1000;save();renderGame();tick();timerHandle=setInterval(tick,250)}
function renderGame(){
 const finalLoop = hasLiveFinal() && state.loop === 5;
 $('loopBrief').classList.toggle('hidden', !finalLoop);
 $('fictionTime').textContent = museumTime();
 $('museumSignal').textContent = '';
 $('loopLabel').textContent='LOOP '+state.loop+' DE 5';$('timer').textContent=fmt(state.remaining);
 $('clockStatus').textContent=state.phase==='playing'?'tempo em andamento':'aguardando escolha';
 $('phaseTitle').textContent=state.room?ROOMS.find(r=>r.id===state.room).name:'Escolha onde investigar';
 $('phaseDescription').textContent=state.phase==='playing'?'Gire a peça e toque nos pontos que brilham para achar pistas.':'Todo mundo começa no '+INICIO.name+', no '+INICIO.andar+'. Escolha para onde ir.';
 $('boardTitle').textContent=state.phase==='playing'?'Ambiente escolhido':'Escolha um ambiente';
 $('roomGrid').innerHTML='<div class="inicio" role="status"><span class="room-icon" aria-hidden="true">'+INICIO.icon+'</span><div><strong>'+INICIO.name+' · '+INICIO.andar+'</strong><small>'+(state.phase==='playing'?'Quando o tempo acabar, você volta para cá. A porta principal está trancada pela grade de segurança.':'Você está aqui. Todo mundo começa aqui, a cada volta. A porta principal está trancada pela grade de segurança.')+'</small></div></div>'+ANDARES.map(a=>'<h4 class="andar">'+a+'</h4>'+ROOMS.filter(r=>r.andar===a).map(r=>'<button class="room '+(state.room===r.id?'selected':'')+'" '+(state.phase==='playing'&&state.room?'disabled':'')+' data-room="'+r.id+'"><span class="room-icon" aria-hidden="true">'+r.icon+'</span><strong>'+r.name+'</strong><small>'+r.sub+'</small></button>').join('')).join('');
 document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>enterRoom(b.dataset.room)));
 $('endLoop').classList.toggle('hidden', state.phase!=='playing' || ((finalLoop || state.caseRules === 2) && state.duration===300));
 $('statusText').textContent=state.phase==='playing'?'Você fica nesta sala até o tempo voltar. Aí você acorda no '+INICIO.name+'.':'Você visita uma sala por volta.';
 $('roomPanel').classList.toggle('hidden',state.phase!=='playing');
 if(state.phase==='playing'&&state.room)renderClues();
 if(window.coop)window.coop.decorate();
 $('notes').value=state.notes||'';renderJournal();
}
const PECAS_URL = new URL('museu/pecas/', document.currentScript ? document.currentScript.src : location.href);
const hashTxt = t => { let h = 2166136261; for (const ch of String(t)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; };
/** Põe cada pista num ponto escondido da peça (ao redor do centro dela, só visível de certos ângulos). */
function pontosDaPeca(mv, clues){
 try {
  const c = mv.getBoundingBoxCenter(), d = mv.getDimensions();
  clues.forEach(clue => {
   const hs = mv.querySelector('[data-hs="'+clue.id+'"]'); if (!hs) return;
   const ang = hashTxt(clue.id+'a')*Math.PI*2, alt = hashTxt(clue.id+'b');
   const x = c.x + Math.cos(ang)*d.x*0.36, y = c.y + (alt-0.5)*d.y*0.7, z = c.z + Math.sin(ang)*d.z*0.36;
   hs.dataset.position = x+'m '+y+'m '+z+'m'; hs.dataset.normal = Math.cos(ang)+'m 0m '+Math.sin(ang)+'m';
   mv.updateHotspot({ name: hs.slot, position: hs.dataset.position, normal: hs.dataset.normal });
  });
 } catch (e) { console.warn('pontos da peça', e); }
}
function renderClues(){
 const room = ROOMS.find(item => item.id === state.room);
 const panel = $('roomPanel');
 const clues = scenarioClues()[room.id];
 const scene = [state.caseIndex, state.caseRules, !!window.coop, room.id].join(':');
 if (panel.dataset.scene !== scene) {
  panel.dataset.scene = scene;
  const hotspots = clues.map((clue, i) => '<button type="button" class="hs" slot="hotspot-'+i+'" data-hs="'+clue.id+'" data-visibility-attribute="visible" data-position="0m 0m 0m" data-normal="0m 1m 0m" aria-label="Ponto de interesse na peça"></button>').join('');
  panel.innerHTML = '<h3>'+room.name+'</h3><p>'+roomDescriptions[room.id]+'</p>'+
   '<div class="peca"><model-viewer loading="eager" reveal="auto" src="'+new URL(room.peca+'.glb', PECAS_URL).href+'" alt="Peça da sala '+esc(room.name)+'" camera-controls touch-action="pan-y" interaction-prompt="none" shadow-intensity="0.6" exposure="1.15" field-of-view="26deg" min-field-of-view="12deg" max-field-of-view="45deg">'+hotspots+'</model-viewer></div>'+
   '<p class="dica">Gire a peça e toque nos pontos que brilham. As pistas ficam escondidas nela.</p>'+
   '<details class="lista-pistas"><summary>Não consegue ver a peça? Use a lista</summary><div class="clue-list">'+
   clues.map(clue => '<button type="button" class="clue" data-clue="'+clue.id+'"><span>'+esc(clue.name)+'</span><small></small></button>').join('')+
   '</div></details><div id="intervention" hidden></div>';
  panel.querySelectorAll('[data-clue]').forEach(button => { button.onclick = () => collect(button.dataset.clue); });
  panel.querySelectorAll('[data-hs]').forEach(hs => { hs.onclick = () => collect(hs.dataset.hs); });
  const mv = panel.querySelector('model-viewer');
  if (mv) {
   mv.addEventListener('load', () => pontosDaPeca(mv, clues));
   setTimeout(() => { if (!customElements.get('model-viewer')) panel.querySelector('.lista-pistas').open = true; }, 8000);
  }
 }
 const elapsed = state.duration-state.remaining;
 const storySeconds = elapsed*300/state.duration;
 $('fictionTime').textContent = museumTime();
 const signal = $('museumSignal');
 const signalText = storySeconds >= 165 ? 'O alarme soa pelo museu.'
  : storySeconds >= 120 ? 'Um estrondo ecoa. A iluminação principal se apaga.' : '';
 if (signal.textContent !== signalText) signal.textContent = signalText;
 clues.forEach(clue => {
  const button = panel.querySelector('[data-clue="'+clue.id+'"]');
  const hs = panel.querySelector('[data-hs="'+clue.id+'"]');
  const registered = state.clues.some(item => item.id === clue.id);
  const wait = clue.time/300*state.duration-elapsed;
  const label = registered?'Registrada':wait>0?'Disponível em '+fmt(wait):'Examinar';
  button.disabled = registered || wait > 0;
  if (button.lastElementChild.textContent !== label) button.lastElementChild.textContent = label;
  if (hs) { hs.classList.toggle('on', wait <= 0); hs.classList.toggle('ok', registered); hs.disabled = registered; }
 });
 renderIntervention(room.id, storySeconds);
}
function hasLiveFinal(){
 return state.liveFinal === true;
}
const CONTROL_KEY = Object.fromEntries(Object.entries(TIME_PATHS).map(([k,p]) => [p.room,k]));
const GENERIC_COMMAND = 'Reiniciar o equipamento';
function activeKey(){ return state.caseRules === 2 ? CASE_PATHS[state.caseIndex] : 'suspension'; }
function controlAt(roomId){
 const key = CONTROL_KEY[roomId];
 return key ? resolvePath(key) : null;
}
// Cada equipamento oferece o comando dele, um comando-isca e o reinício genérico; a ordem muda com a partida.
function commandsOf(ctl){
 const list = [['break', ctl.action], ['other', ctl.alternative], ['reset', GENERIC_COMMAND]];
 const k = (state.caseIndex + ctl.code.charCodeAt(0)) % 3;
 return list.map((_, i) => list[(i+k)%3]);
}
function interventionNote(why, path){
 return why === 'sala' ? 'O equipamento respondeu, mas não está ligado ao retorno desta noite. O relógio ainda voltará às 22h.'
  : why === 'janela' ? 'O comando chegou fora da janela e o equipamento ignorou a ordem.'
  : why === 'isca' ? path.distractor
  : 'O equipamento reiniciou e voltou ao mesmo estado. O retorno das 22h continua programado.';
}
function renderIntervention(roomId, elapsed){
 const panel = $('intervention');
 const ctl = controlAt(roomId);
 panel.hidden = !hasLiveFinal() || state.loop !== 5 || !ctl;
 if (panel.hidden) return;
 const path = timePath();
 if (panel.dataset.ctl !== roomId) {
  panel.dataset.ctl = roomId;
  panel.innerHTML = '<h4>'+esc(ctl.control)+' · '+esc(ctl.code)+'</h4><label for="command">Comando</label><select id="command"><option value="">Escolha um comando</option>'+
   commandsOf(ctl).map(([v,t]) => '<option value="'+v+'">'+esc(t)+'</option>').join('')+
   '</select><button class="btn primary" type="button">Executar comando</button><p role="status"></p>';
  panel.querySelector('button').onclick = () => applyIntervention(panel.querySelector('select').value);
  panel.querySelector('select').addEventListener('change', () => renderIntervention(state.room, elapsedStoryTime(window.coop?.now() ?? Date.now())));
 }
 const button = panel.querySelector('button');
 const select = panel.querySelector('select');
 const recorded = !!state.intervention;
 button.disabled = recorded || !select.value;
 select.disabled = recorded;
 const status = panel.lastElementChild;
 const message = recorded
  ? (state.intervention === 'break' ? 'Comando registrado. O relógio seguirá adiante às 22h.' : interventionNote(state.interventionWhy, path))
  : 'Você só tem uma tentativa nesta volta. Hora no museu: '+clockAt(Math.floor(elapsed))+'.';
 if (status.textContent !== message) status.textContent = message;
}
function applyIntervention(command){
 const ctl = controlAt(state.room);
 const elapsed = elapsedStoryTime(window.coop?.now() ?? Date.now());
 if (!ctl || !hasLiveFinal() || state.loop !== 5 || state.phase !== 'playing' || state.intervention ||
     !commandsOf(ctl).some(([v]) => v === command)) return;
 const path = timePath();
 const rightEquipment = ctl.key === activeKey();
 const inWindow = elapsed >= path.opens && elapsed < path.closes;
 state.intervention = rightEquipment && command === 'break' && inWindow ? 'break' : 'other';
 state.interventionWhy = state.intervention === 'break' ? 'ok'
  : !rightEquipment ? 'sala'
  : command === 'break' && !inWindow ? 'janela'
  : command === 'other' ? 'isca' : 'reinicio';
 save();
 renderIntervention(state.room, elapsed);
}
function brokeLoop(){
 return state.intervention === 'break' || state.intervention === 'suspender';
}
function collect(id){if(state.phase!=='playing'||(window.coop?.now() ?? Date.now())>=state.endAt){tick();return}const q=scenarioClues()[state.room].find(x=>x.id===id);if(!q||state.clues.some(x=>x.id===id)||state.duration-(state.endAt-(window.coop?.now() ?? Date.now()))/1000<q.time/300*state.duration)return;const room=ROOMS.find(x=>x.id===state.room);state.clues.push({id:q.id,room:room.name,name:q.name,text:q.text,tipo:q.tipo,fatos:q.fatos,loop:state.loop});save();renderClues();renderJournal();toast('Pista guardada no caderno')}
function renderJournal(){
 const clues=state.clues||[];$('countBadge').textContent=clues.length;
 $('journalPreview').innerHTML=clues.length?clues.slice(-3).reverse().map(c=>'<div class="preview-item">'+esc(c.name)+' <br><small>'+esc(c.room)+'</small></div>').join(''):'<p class="muted">Suas descobertas aparecerão aqui.</p>';
 $('journalList').innerHTML=clues.length?clues.map(c=>'<article class="journal-item"><b>'+esc(c.room)+' · Loop '+c.loop+(c.tipo?' · '+esc(c.tipo):'')+'</b><p><strong>'+esc(c.name)+':</strong> '+esc(c.text)+'</p></article>').join(''):'<p class="muted">Você ainda não registrou pistas.</p>';
 if (!window.coop && state.archive?.length) {
  $('journalList').insertAdjacentHTML('beforeend', state.archive.map(key => {
   const axis = ANSWER_AXES.find(item=>item.key===key);
   return '<article class="journal-item"><b>Arquivo de fechamento · '+esc(axis.title)+
    '</b><p>'+esc(partialRecord(key))+'</p></article>';
  }).join(''));
 }
 const path = timePath();
 const figureRoom = ROOMS.find(room => room.id === current().room).name;
 const roomName = id => ROOMS.find(room => room.id === id).name;
 const nearingIntervention = hasLiveFinal() && (state.loop === 5 || (state.loop === 4 && state.phase === 'between'));
 const timeLead = nearingIntervention
  ? 'Compare os comandos no ambiente '+roomName(path.room)+'. Um atua sobre o retorno e o outro altera apenas um efeito secundário.'
  : 'Há um procedimento de encerramento em '+roomName(path.source)+'.';
 const hs = [
  'Separe o que aconteceu com o acervo, o disparo do alarme e o retorno do tempo. Procure uma fonte para cada fato.',
  'A Sala das coleções ou a Conservação ajuda a explicar o acervo. A Segurança e a Sala técnica ajudam a explicar o alarme.',
  'Procure a figura imóvel em '+figureRoom+'. '+timeLead
 ];
 $('hints').innerHTML=hs.slice(0,state.hints).map((x,i)=>'<p><strong>Orientação '+(i+1)+':</strong> '+esc(x)+'</p>').join('');$('getHint').disabled=state.hints>=3;
}
function tick(){if(window.coop){window.coop.tick();return}if(!state||state.phase!=='playing')return;const old=state.remaining;state.remaining=Math.max(0,(state.endAt-Date.now())/1000);$('timer').textContent=fmt(state.remaining);$('fictionTime').textContent=museumTime();if(Math.ceil(old)!==Math.ceil(state.remaining))renderClues();else if(state.loop===5 && state.room)renderIntervention(state.room,elapsedStoryTime(window.coop?.now() ?? Date.now()));if(state.remaining<=0)finishLoop()}
function renderBetween(){
 const finished = state.loop === 5;
 const interventionNext = hasLiveFinal() && state.loop === 4;
 $('betweenEyebrow').innerHTML = '<span></span> '+(finished && brokeLoop() ? 'O TEMPO SEGUIU' : 'O TEMPO RETORNOU');
 $('betweenCount').textContent = state.clues.length;
 $('betweenLoop').textContent = state.loop+' / 5';
 $('betweenTitle').textContent = finished
  ? (brokeLoop() ? 'O relógio passou das 22h.' : 'O museu retornou às 21h55.')
  : 'Você se lembra.';
 $('betweenStory').textContent = finished
  ? (brokeLoop() ? 'A cadeia do retorno foi interrompida. O museu permanece no presente.' : 'O museu voltou às 21h55. Use o que você descobriu para reconstruir a noite.')
  : (state.caseRules === 2 ? ENTRE_VOLTAS[Math.min(state.loop,ENTRE_VOLTAS.length)-1] : ENTRE_VOLTAS[0]);
 $('betweenHint').textContent = finished ? (state.caseRules === 2 && state.clues.length < 3 ? 'Com poucas pistas? Ao apresentar a hipótese, você pode consultar trechos do arquivo de fechamento.' : 'Seu caderno está disponível para a conclusão.')
  : interventionNext ? 'A próxima volta é sua oportunidade de intervir. Se faltou uma pista sobre o retorno, peça uma orientação no caderno antes de escolher o ambiente.'
  : 'O próximo ambiente pode confirmar ou mudar sua hipótese.';
 $('nextLoop').textContent = finished ? 'Apresentar hipótese' : 'Escolher próximo ambiente';
 show('between');
}
function finishLoop(){
 if(window.coop){window.coop.move('between');return}
 if(!state||state.phase!=='playing')return;
 if (state.caseRules === 2 && state.duration === 300 && Date.now() < state.endAt) return;
 clearInterval(timerHandle);
 state.phase='between';
 state.remaining=0;
 state.endAt=null;
 save();
 renderBetween();
}
function next(){
 if(window.coop){window.coop.move(state.loop>=5?'final':'choose');return}
 if(state.loop>=5){state.phase='final';save();renderForm();show('final');return}
 state.loop++;
 state.phase='choose';
 state.room=null;
 state.remaining=state.duration;
 save();
 renderGame();
 show('game');
}
function options(obj){return '<option value="">Ainda não sei</option>'+Object.entries(obj).map(([k,v])=>'<option value="'+k+'">'+esc(v)+'</option>').join('')}
const WHERES = Object.fromEntries(['galeria','recepcao','corredor','seguranca','conservacao'].map(id => [id, ROOMS.find(r=>r.id===id).name]));
const WHENS = {
 suspension:'Entre 21h57 e 22h',
 reserve:'Entre 21h57 e 21h59',
 rehearsal:'Entre 21h56min30s e 21h58min30s',
 reference:'Entre 21h56 e 21h58'
};
const HOWS = {
 suspension:'Uma emissão final, programada na demonstração, reconecta o museu à referência',
 reserve:'A alimentação de reserva do protótipo sustenta o retorno',
 rehearsal:'Um sinal agendado pela produção ordena o retorno',
 reference:'Um cartão de referência é lido e enviado ao protótipo'
};
const PREDICTIONS = {
 retorno:'O museu volta às 21h55 e tudo recomeça',
 seguir:'O tempo segue normalmente depois das 22h',
 alarme:'O alarme para sozinho antes das 22h',
 estrondo:'O estrondo deixa de acontecer'
};
const roomNameOf = id => ROOMS.find(r => r.id === id).name;
// As 8 perguntas da investigação. Soma: 100 pontos. Cada pergunta indica de onde podem vir as respostas.
const ANSWER_AXES = [
 {key:'event', pts:15, title:'O quê', question:'O quê: o que aconteceu com o acervo ou a exposição?', options:EVENTS,
  sources:['gal2','con1','rec2','cor1','dep2'],
  guide:'Compare o que a equipe esperava encontrar com os registros de movimentação.'},
 {key:'where', pts:10, title:'Onde', question:'Onde: em que ambiente o acontecimento se concentrou?', options:WHERES,
  test:clue => clue.text.includes(roomNameOf(current().room)),
  guide:'Rondas e recados citam o ambiente da figura imóvel. Procure o nome do ambiente, não só o objeto.'},
 {key:'when', pts:10, title:'Quando', question:'Quando era possível agir sobre o retorno?', options:WHENS,
  sources:['time-source','time-control'],
  guide:'Procure o horário em que o equipamento abre e o horário em que ele deixa de aceitar ordens.'},
 {key:'how', pts:15, title:'Como', question:'Como o tempo voltava às 22h?', options:HOWS,
  sources:['time-source','time-control','atebase'],
  guide:'O primeiro pulso causa o apagão. Descubra o que precisava acontecer depois, e em qual equipamento.'},
 {key:'alarm', pts:10, title:'Por quê', question:'Por quê: o que disparou o alarme?', options:ALARMS,
  sources:['seg1','seg2','ele1'],
  guide:'Separe o estrondo do disparo do alarme. Compare os horários e o tipo de registro.'},
 {key:'figure', pts:15, title:'Quem', question:'Quem: quem era a figura imóvel observada?', options:FIGURES,
  sources:['gal3','con4','seg3','rec3','cor3'],
  guide:'Procure uma credencial ou outro sinal de identidade. Estar no local não prova responsabilidade.'},
 {key:'predict', pts:10, title:'Previsão', question:'Previsão: se ninguém agir, o que acontece às 22h?', options:PREDICTIONS,
  sources:['atebase','time-source'],
  guide:'Pense no que o protótipo foi feito para fazer ao fim da demonstração.'},
 {key:'action', pts:15, title:'Intervenção', question:'Intervenção: qual procedimento ajudaria a equipe a lidar com o acontecimento?', options:ACTIONS,
  sources:['con3','cor2'],
  guide:'Pense em uma ação anterior ao problema. Qual registro ou acordo estava faltando?'}
];
// Resposta certa de cada pergunta nesta partida.
function truth(key){
 const c = current();
 return key === 'where' ? c.room : key === 'when' || key === 'how' ? activeKey() : key === 'predict' ? 'retorno' : c[key];
}
// Grau de certeza (21/11/2026): quanto mais certeza, mais pontos se acertar; errar com certeza custa pontos. O máximo continua 100.
const CERTEZAS = {
 palpite:{label:'Palpite', hit:.6, miss:0},
 provavel:{label:'Provável', hit:.8, miss:0},
 certeza:{label:'Tenho certeza', hit:1, miss:-.3}
};
const CERTEZA_PADRAO = 'provavel';
// Em Quem e Por quê, a resposta pede a pista do dossiê que a sustenta. Sem pista que valha, conta como palpite.
const SUPPORT_KEYS = ['alarm','figure'];
// Pistas que o jogador já guardou e que servem de fonte para a pergunta.
function axisSources(axis){
 return (state?.clues ?? []).filter(clue => axis.test ? axis.test(clue) : (axis.sources.includes(clue.id) ||
  clue.fatos?.includes(axis.key) ||
  (axis.key === 'alarm' && clue.text === labels[current().alarm][1])) &&
  (axis.key !== 'figure' || clue.text === figures[current().figure]));
}
function supportOk(axis, answers){
 const id = answers?.[axis.key+'__p'];
 return !!id && axisSources(axis).some(clue => clue.id === id);
}
function effectiveCerteza(axis, answers){
 if (SUPPORT_KEYS.includes(axis.key) && !supportOk(axis, answers)) return CERTEZAS.palpite;
 return CERTEZAS[answers?.[axis.key+'__c']] ?? CERTEZAS[CERTEZA_PADRAO];
}
// Pontuação por proximidade: metade dos pontos para o mesmo andar (Onde) ou a mesma abertura de janela (Quando).
// O grau de certeza multiplica o acerto; errar com "Tenho certeza" tira pontos.
function pointsFor(axis, answer, answers = {}){
 if (!answer) return 0;
 const right = truth(axis.key), cz = effectiveCerteza(axis, answers);
 if (answer === right) return Math.round(axis.pts*cz.hit);
 if (axis.key === 'where' && ROOMS.find(r=>r.id===answer).andar === ROOMS.find(r=>r.id===right).andar) return Math.floor(axis.pts/2*cz.hit);
 if (axis.key === 'when' && TIME_PATHS[answer].opens === TIME_PATHS[right].opens) return Math.floor(axis.pts/2*cz.hit);
 return Math.round(axis.pts*cz.miss);
}
const ARCHIVE_LIMIT = 2;
function partialRecord(key){
 const c = current(), path = timePath();
 switch (key) {
  case 'event': return 'O índice do acervo menciona '+c.subject+'. No verso, lê-se que '+c.clue+'. A ficha de desfecho está incompleta.';
  case 'where': return 'O mapa de rondas marca um ponto de atenção no '+ROOMS.find(r=>r.id===c.room).andar+'. O nome do ambiente está borrado.';
  case 'when': return 'A agenda do protótipo marca um comando que fecha às '+clockAt(path.closes)+'. O horário de abertura foi rasurado.';
  case 'how': return 'O manual do protótipo cita o equipamento '+path.code+'. A página sobre a função dele foi arrancada.';
  case 'alarm': return 'O aviso sonoro começou às 21h57min45s, depois do apagão. ' + ({
   sensor:'O fragmento recuperado veio do histórico de equipamentos.',
   manual:'O fragmento recuperado veio do registro de operações da equipe.',
   teste:'O fragmento recuperado veio da agenda de manutenção.'
  }[c.alarm]) + ' O campo de causa está ilegível.';
  case 'figure': return 'A ronda localiza a figura imóvel em '+ROOMS.find(room=>room.id===c.room).name+'. O campo de identificação está em branco.';
  case 'predict': return 'Um bilhete do inventor fala em marcar o fim da demonstração para as 22h. O resto do bilhete está rasgado.';
  case 'action': return 'A ficha de prevenção faz referência a '+c.subject+'. Há uma anotação de que '+c.clue+'. A folha de recomendações não foi localizada.';
 }
}
function renderArchive(){
 const panel = $('archivePanel');
 panel.classList.toggle('hidden', state.caseRules !== 2 || !!window.coop);
 if (state.caseRules !== 2 || window.coop) return;

 const recovered = state.archive ?? [];
 const hasSource = axis => axisSources(axis).length > 0;
 const remaining = ARCHIVE_LIMIT-recovered.length;
 const status = $('archiveStatus');
 const message = remaining === 0 ? 'Dois trechos consultados.' :
  remaining === 1 ? 'Você ainda pode consultar um trecho.' : 'Você pode consultar até dois trechos.';
 if (status.textContent !== message) status.textContent = message;
 $('archiveSections').innerHTML = ANSWER_AXES.map(axis => {
  const ready = recovered.includes(axis.key);
  const covered = hasSource(axis);
  const body = ready ? '<p>'+esc(partialRecord(axis.key))+'</p>' :
   covered ? '<p>Você já tem um registro sobre este ponto no caderno.</p>' :
   '<button class="text-button" type="button" data-archive="'+axis.key+'" '+(remaining ? '' : 'disabled')+
   ' aria-label="Consultar trecho sobre '+esc(axis.title.toLowerCase())+'">Consultar trecho</button>';
  return '<section class="archive-item"><h4>'+esc(axis.title)+'</h4><p>'+esc(axis.guide)+'</p>'+body+'</section>';
 }).join('');
}
function readArchive(event){
 const key = event.target.dataset.archive;
 const recovered = state.archive ?? [];
 if (window.coop || state.caseRules !== 2 || state.phase !== 'final' ||
  !ANSWER_AXES.some(axis=>axis.key===key) || recovered.length >= ARCHIVE_LIMIT || recovered.includes(key)) return;
 state.archive = [...recovered, key];
 save();
 renderArchive();
 const section = $('archiveSections').children[ANSWER_AXES.findIndex(axis=>axis.key===key)];
 section.tabIndex = -1;
 section.focus();
}
function selectedAnswers(){
 const out = {};
 for (const axis of ANSWER_AXES) {
  out[axis.key] = $(axis.key).value;
  out[axis.key+'__c'] = $(axis.key+'__c')?.value ?? '';
  if (SUPPORT_KEYS.includes(axis.key)) out[axis.key+'__p'] = $(axis.key+'__p')?.value ?? '';
 }
 return out;
}
function setCerteza(key, value){
 $(key+'__c').value = value;
 for (const b of document.querySelectorAll('[data-axis="'+key+'"]')) b.setAttribute('aria-pressed', String(b.dataset.certeza === value));
}
// Preenche o formulário com respostas guardadas (rascunho ou envio da sala do Mestre).
function fillAnswers(saved){
 for (const axis of ANSWER_AXES) {
  $(axis.key).value = saved?.[axis.key] ?? '';
  setCerteza(axis.key, saved?.[axis.key+'__c'] ?? '');
  if (SUPPORT_KEYS.includes(axis.key)) $(axis.key+'__p').value = saved?.[axis.key+'__p'] ?? '';
 }
}
function lockAnswerExtras(locked){
 for (const el of document.querySelectorAll('#answerFields .certeza-btn, #answerFields [id$="__p"]')) el.disabled = locked;
}
function saveDraft(){
 if (!window.coop && state?.phase === 'final') {
  state.draft = selectedAnswers();
  save();
 }
}
function certezaControl(axis){
 return '<div class="certeza" role="group" aria-label="Quanto você confia em: '+esc(axis.title)+'"><span>Quanto você confia?</span>'+
  Object.entries(CERTEZAS).map(([k,v]) => '<button type="button" class="certeza-btn certeza-'+k+'" data-axis="'+axis.key+'" data-certeza="'+k+'" aria-pressed="false">'+v.label+'</button>').join('')+
  '<input type="hidden" id="'+axis.key+'__c" value=""></div>';
}
function supportControl(axis){
 if (!SUPPORT_KEYS.includes(axis.key)) return '';
 const clues = state?.clues ?? [];
 return '<label for="'+axis.key+'__p" class="support-label">Qual pista do seu dossiê sustenta esta resposta?</label><select id="'+axis.key+'__p">'+
  '<option value="">Nenhuma pista</option>'+clues.map(c => '<option value="'+esc(c.id)+'">'+esc(c.name+' · '+c.room)+'</option>').join('')+'</select>';
}
function renderForm(){
 $('answerFields').innerHTML = '<p class="certeza-note">Escolha o quanto você confia em cada resposta. Com mais certeza você ganha mais pontos se acertar, mas perde pontos se errar. Em Quem e Por quê, aponte a pista que sustenta a resposta: sem ela, vale como palpite.</p>'+
  ANSWER_AXES.map(axis => '<div class="answer-field"><label for="'+axis.key+'">'+esc(axis.question)+
  '</label><select id="'+axis.key+'">'+options(axis.options)+'</select>'+certezaControl(axis)+supportControl(axis)+'</div>').join('');
 fillAnswers(state.draft);
 renderArchive();
}
function submit(event){
 event.preventDefault();
 const answers = selectedAnswers();
 if(window.coop){window.coop.move('result',answers);return}
 state.answers = answers;
 state.phase = 'result';
 save();
 renderResult();
 show('result');
}
function renderResult(){
 const c = current();
 const answers = state.answers || {};
 const score = Math.max(0, ANSWER_AXES.reduce((total, axis) => total+pointsFor(axis, answers[axis.key], answers), 0));
 const path = timePath();
 const reconstruction = hasLiveFinal()
  ? '<div class="result-card"><strong>Como o tempo voltou</strong><p>'+esc(path.reconstruction)+'</p></div>'
  : '';
 const ending = hasLiveFinal()
  ? (brokeLoop()
   ? path.success+' O que já ocorreu com o acervo faz parte da história.'
   : (state.intervention === 'other' ? interventionNote(state.interventionWhy, path)+' ' : '')+
     'O museu voltou às 21h55. '+path.instruction+' O equipamento '+path.code+' fica em '+roomNameOf(path.room)+'.')
  : 'Nesta partida, a ação foi avaliada como hipótese.';
 $('resultBody').innerHTML = '<p class="large">Investigação: <strong>'+score+' de 100 pontos</strong>. Cada pergunta vale 10 ou 15 pontos; resposta próxima vale metade. Palpite acerta 60%, provável 80% e certeza 100%, mas errar com certeza tira 30%.</p>'+
  ANSWER_AXES.map(axis => {
   const got = pointsFor(axis, answers[axis.key], answers);
   const cz = answers[axis.key] ? 'Seu grau de certeza: '+(CERTEZAS[answers[axis.key+'__c']]?.label ?? CERTEZAS[CERTEZA_PADRAO].label)+'.' : '';
   const clue = (state.clues ?? []).find(c => c.id === answers[axis.key+'__p']);
   const sup = !SUPPORT_KEYS.includes(axis.key) || !answers[axis.key] ? '' :
    supportOk(axis, answers) ? ' Pista que sustenta: '+esc(clue.name)+'.' :
    clue ? ' A pista que você apontou ('+esc(clue.name)+') não sustenta esta resposta, então valeu como palpite.' :
    ' Sem pista apontada, valeu como palpite.';
   return '<div class="result-card"><strong>'+axis.title+' · '+got+' de '+axis.pts+'</strong><p>Sua resposta: '+
   esc(axis.options[answers[axis.key]] || 'Ainda não sei')+'<br>Resultado desta partida: '+esc(axis.options[truth(axis.key)])+
   (cz || sup ? '<br>'+cz+sup : '')+'</p></div>'; }).join('')+
  '<div class="result-card"><strong>O que aconteceu</strong><p>'+esc(c.detail.charAt(0).toUpperCase()+c.detail.slice(1))+
  '. '+esc(labels[c.alarm][1])+'</p><p>'+esc(figures[c.figure])+'</p></div>'+reconstruction+
  '<div class="result-card"><strong>Desfecho</strong><p>'+esc(ending)+'</p></div>'+
  (VALORES[state.caseIndex] ? '<div class="result-card"><strong>Para conversar</strong><p>'+esc(VALORES[state.caseIndex])+'</p></div>' : '');
}
document.addEventListener('click',e=>{let id=e.target.dataset.close;if(id)$(id).close()});
$('helpOpen').onclick=$('howButton').onclick=()=>popup('helpDialog');
$('startButton').onclick=reset;$('nextLoop').onclick=next;$('endLoop').onclick=finishLoop;
['openJournal','openJournalSide','betweenJournal','finalJournal'].forEach(x=>$(x).onclick=()=>{renderJournal();popup('journalDialog')});
$('getHint').onclick=()=>{if(state&&state.hints<3){state.hints++;save();renderJournal()}};
$('notes').addEventListener('input',e=>{if(state){state.notes=e.target.value;save()}});
$('archiveSections').addEventListener('click', readArchive);
$('answerFields').addEventListener('change', saveDraft);
$('answerFields').addEventListener('click', e => {
 const b = e.target.closest('[data-certeza]');
 if (!b || b.disabled) return;
 setCerteza(b.dataset.axis, $(b.dataset.axis+'__c').value === b.dataset.certeza ? '' : b.dataset.certeza);
 saveDraft();
});
// Apresentação das telas (21/11/2026): passo a passo visual dentro do manual. Sem códigos fixos nem nomes de escala.
const TOUR = [
 {c:'Você chega ao museu no fim da tarde. Tudo calmo: gente passeando, luz quente, cheiro de cera no piso. Uma funcionária cochicha: "Shh! É surpresa para o pessoal. Depois eu explico."',t:'Escolha uma sala', d:'Toda volta começa no Saguão superior. Escolha só uma sala para investigar.',
  v:'<div class="tv-rooms"><span class="tv-room on"><i>◈</i>Sala dos gigantes</span><span class="tv-room"><i>◍</i>Sala dos predadores</span><span class="tv-room"><i>▣</i>Sala dos veículos</span><span class="tv-room"><i>◐</i>Sala dos jogos</span></div><p class="tv-floor">✦ Saguão superior · você começa aqui</p>'},
 {c:'Na vitrine, um objeto brilha de leve. A restauradora passa e avisa baixinho: "Pode olhar de perto, só não encoste. Eu confiro tudo antes de fechar."',t:'Gire a peça', d:'Toque nos pontos que brilham: cada um esconde uma pista. Eles aparecem com o tempo.',
  v:'<div class="tv-piece"><div class="tv-obj"></div><b class="tv-dot d1"></b><b class="tv-dot d2"></b><b class="tv-dot d3"></b></div><p class="tv-floor">Arraste para girar · toque no brilho</p>'},
 {c:'O relógio da parede marca a hora de sempre. Um guarda confere o rádio e murmura: "Faltam poucos minutos para fechar... eu odeio essa hora, tudo fica tão quieto." Num canto, uma artista de estátua viva se prepara para o bis, e um visitante olha para a porta, sem jeito.',t:'O tempo corre', d:'Cada volta tem 5 minutos. Quando acaba, o tempo volta, mas você guarda o que descobriu.',
  v:'<div class="tv-clock"><span>VOLTA 2 DE 5</span><strong>04:12</strong><small>21h56 no museu</small></div><div class="tv-bar"><i></i></div>'},
 {c:'No balcão, a ronda anota tudo: hora, sala, quem passou. "Se algo der errado hoje", diz o guarda, "estes registros salvam a gente. Mas cuidado: nem tudo que contam é fato."',t:'Seu dossiê', d:'Cada pista é uma Observação, um Relato ou um Registro. O que alguém diz nem sempre é fato.',
  v:'<div class="tv-dossie"><p><span class="tv-chip obs">Observação</span> O que você viu</p><p><span class="tv-chip rel">Relato</span> O que alguém contou</p><p><span class="tv-chip reg">Registro</span> O que está escrito</p></div>'},
 {c:'Falta pouco para fechar. De repente, um estrondo, o alarme toca e todo mundo fica imóvel. A grade desce. Agora é com você.',t:'A hora de agir', d:'Na 5ª volta você tem uma única tentativa: o equipamento, o comando e o horário certos.',
  v:'<div class="tv-panel"><b>Painel da demonstração</b><span class="tv-select">Escolha um comando ▾</span><span class="tv-btn">Executar comando</span></div><p class="tv-floor">1 tentativa · sem aviso de janela</p>'},
 {c:'Quando o tempo se fecha, a ronda reúne todos. Cada um tem uma versão. Para acertar, você precisa dizer o quanto confia e mostrar a pista que sustenta.',t:'As 8 perguntas', d:'Diga o quanto você confia em cada resposta. Em Quem e Por quê, aponte a pista que sustenta.',
  v:'<div class="tv-q"><b>Quem: quem era a figura imóvel?</b><span class="tv-select">Um guarda escondido ▾</span><span class="tv-cert"><i class="c1">Palpite</i><i class="c2">Provável</i><i class="c3 on">Tenho certeza</i></span><span class="tv-select tv-pista">Pista: Procurar sinais da figura ▾</span></div>'}
];
function montarTour(){
 const host = $('tour');
 if (!host) return;
 let i = 0;
 host.innerHTML = '<div class="tour-card"><p class="tour-step" aria-live="polite"></p><p class="tour-cena"></p><div class="tour-visual" aria-hidden="true"></div><h3 class="tour-title"></h3><p class="tour-text"></p></div>'+
  '<div class="tour-nav"><button class="btn secondary tour-prev" type="button">Voltar</button><span class="tour-dots" aria-hidden="true"></span><button class="btn primary tour-next" type="button">Próximo</button></div>';
 const q = sel => host.querySelector(sel);
 function draw(){
  const s = TOUR[i];
  q('.tour-step').textContent = 'Prólogo · uma visita normal · '+(i+1)+' de '+TOUR.length;
  q('.tour-cena').textContent = s.c;
  q('.tour-visual').innerHTML = s.v;
  q('.tour-title').textContent = s.t;
  q('.tour-text').textContent = s.d;
  q('.tour-dots').innerHTML = TOUR.map((_,k)=>'<b'+(k===i?' class="on"':'')+'></b>').join('');
  q('.tour-prev').disabled = i === 0;
  q('.tour-next').disabled = i === TOUR.length-1;
 }
 q('.tour-prev').onclick = () => { if (i > 0) { i--; draw(); } };
 q('.tour-next').onclick = () => { if (i < TOUR.length-1) { i++; draw(); } };
 host.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { q('.tour-next').click(); e.preventDefault(); }
  if (e.key === 'ArrowLeft') { q('.tour-prev').click(); e.preventDefault(); }
 });
 const dlg = host.closest('dialog');
 if (dlg) dlg.addEventListener('close', () => { i = 0; draw(); });
 draw();
}
montarTour();
$('answerForm').addEventListener('submit',submit);$('replay').onclick=()=>window.coop?window.coop.open():reset();
// Recupera a partida local sem confundir o prazo real do loop com o relógio do aparelho.
function restoreSolo(){
 $('betweenEyebrow').innerHTML='<span></span> O TEMPO RETORNOU';
 $('betweenStory').textContent='As portas voltaram a fechar. Os objetos estão onde estavam. Você conserva o que descobriu.';
 $('nextLoop').classList.remove('hidden');
 $('coopBegin').classList.add('hidden');
 $('answerFields').classList.remove('hidden');
 $('answerForm').querySelector('button[type=submit]').classList.remove('hidden');
 $('final').querySelector('.large').textContent='O que aconteceu? Use as pistas do dossiê e responda às 8 perguntas. Se não souber, pode deixar uma resposta em aberto.';
 $('replay').textContent='Jogar outra vez';
const prev=load(storageKey,null);if(prev&&Number.isInteger(prev.caseIndex)&&CASES[prev.caseIndex]&&prev.loop>=1&&prev.loop<=5){state=prev;$('speed').value=String(state.duration);if(state.phase==='playing'&&Number.isFinite(state.endAt)){state.remaining=Math.max(0,(state.endAt-Date.now())/1000);renderGame();show('game');if(state.remaining<=0)finishLoop();else timerHandle=setInterval(tick,250)}else if(state.phase==='choose'){renderGame();show('game')}else if(state.phase==='between'){renderBetween()}else if(state.phase==='final'){renderForm();show('final')}else if(state.phase==='result'&&state.answers){renderResult();show('result')}else{state=null;show('start')}}else show('start');
}
restoreSolo();
