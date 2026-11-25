'use strict';
// Bancada independente: o conteúdo fica no aparelho e não oferece sigilo contra inspeção do código.
const ANDARES = ['2º andar', '1º andar', 'Térreo', 'Subsolo'];
// Todos começam (e recomeçam a cada volta) no Saguão superior, no 2º andar; dali escolhem para onde ir.
const INICIO = {id:'saguao', name:'Saguão superior', andar:'2º andar', icon:'✦', sub:'Todo mundo começa aqui'};
const ROOMS = [
  {id:'gigantes', name:'Sala dos gigantes', andar:'2º andar', icon:'◈', sub:'Esqueleto de pescoço longo', peca:'D01'},
  {id:'predadores', name:'Sala dos predadores', andar:'2º andar', icon:'◍', sub:'Dentes e garras', peca:'D02'},
  {id:'veiculos', name:'Sala dos veículos', andar:'2º andar', icon:'▣', sub:'Caminhão de leite e bicicleta', peca:'VEI_A'},
  {id:'porcelana', name:'Sala da porcelana', andar:'2º andar', icon:'❖', sub:'Xícara e delicadeza', peca:'N01'},
  {id:'jogos', name:'Sala dos jogos', andar:'2º andar', icon:'◐', sub:'Tabuleiro e estratégia', peca:'N15'},
  {id:'cera', name:'Sala de cera', andar:'2º andar', icon:'⌘', sub:'Figuras que parecem vivas', peca:'CERA'},
  {id:'mobilia', name:'Sala da mobília', andar:'2º andar', icon:'▤', sub:'Cadeira de outra época', peca:'N02'},
  {id:'galeria', name:'Galeria especial', andar:'2º andar', icon:'▧', sub:'Obras e vitrines', peca:'F01'},
  {id:'auditorio', name:'Auditório', andar:'2º andar', icon:'▱', sub:'Programa e bastidores', peca:'C01'},
  {id:'asas', name:'Mezanino das asas', andar:'1º andar', icon:'✦', sub:'Outro jeito de voar', peca:'D08'},
  {id:'fosseis', name:'Sala dos fósseis', andar:'1º andar', icon:'◇', sub:'Provas na rocha', peca:'F02'},
  {id:'relogios', name:'Sala dos relógios', andar:'1º andar', icon:'⬡', sub:'Cada segundo conta', peca:'N03'},
  {id:'protecoes', name:'Sala das proteções', andar:'1º andar', icon:'✚', sub:'Capacete e história', peca:'N04'},
  {id:'fotografia', name:'Sala da fotografia', andar:'1º andar', icon:'☗', sub:'Câmera de outro tempo', peca:'N05'},
  {id:'prototipo', name:'Subsolo · Câmara do tempo', andar:'Subsolo', icon:'◷', sub:'A máquina do tempo', peca:'T01'},
  {id:'eletrica', name:'Oficina elétrica', andar:'1º andar', icon:'⌁', sub:'Energia e equipamentos', peca:'B09'},
  {id:'deposito', name:'Sala das coleções', andar:'1º andar', icon:'▤', sub:'Inventário e movimentações', peca:'B02'},
  {id:'vidros', name:'Sala dos vidros', andar:'1º andar', icon:'▨', sub:'Transparência e brilho', peca:'N06'},
  {id:'mar', name:'Sala do mar', andar:'1º andar', icon:'▦', sub:'Peixes e águas', peca:'N12'},
  {id:'recepcao', name:'Recepção', andar:'Térreo', icon:'♧', sub:'Chegadas e convidados', peca:'B01'},
  {id:'conservacao', name:'Sala dos espécimes', andar:'Térreo', icon:'◇', sub:'Acervo e registros', peca:'B04'},
  {id:'seguranca', name:'Central de monitoramento', andar:'Térreo', icon:'◉', sub:'Alarmes e ocorrências', peca:'S01'},
  {id:'atelie', name:'Ateliê de descobertas', andar:'Térreo', icon:'✧', sub:'Ensaio e registros técnicos', peca:'L01'},
  {id:'corredor', name:'Área de descanso', andar:'Térreo', icon:'▥', sub:'Recados e caixas da equipe', peca:'L02'},
  {id:'sons', name:'Sala dos sons', andar:'Térreo', icon:'♢', sub:'Rádio e música', peca:'N07'},
  {id:'limpeza', name:'Base da limpeza', andar:'Térreo', icon:'◌', sub:'Rotina e fechamento', peca:'L03'},
  {id:'ambar', name:'Sala do âmbar', andar:'Térreo', icon:'◑', sub:'Preso no tempo', peca:'N11'},
  {id:'patio', name:'Pátio de luz', andar:'Térreo', icon:'☼', sub:'Vista para a circulação', peca:'B05'},
  {id:'brinquedos', name:'Sala dos brinquedos', andar:'Térreo', icon:'✿', sub:'Carrinho e memória', peca:'N09'},
  {id:'manutencao', name:'Oficina técnica', andar:'Térreo', icon:'◰', sub:'Fios, lâmpadas e reparos', peca:'M01'}
];

// ---------------------------------------------------------------- museu vivo (rodízio de lugares e nomes por partida)
// Cada exposição tem 3 nomes (o de ROOMS é o A; aqui ficam B e C). A semente da partida decide o lugar (andar + número) e o nome de cada sala.
// Semente 0 = museu de origem (nomes A, andares de ROOMS). O mapa não muda dentro da partida. Ver docs/RODIZIO.md.
const NOMES_ALT = {
  gigantes:['Salão dos colossos','Galeria do pescoço longo'],
  predadores:['Salão das garras','Ala dos caçadores'],
  veiculos:['Garagem do passado','Sala das rodas'],
  porcelana:['Salão da louça fina','Sala das xícaras'],
  jogos:['Salão dos tabuleiros','Sala do passatempo'],
  cera:['Galeria das figuras','Salão de cera'],
  mobilia:['Salão das cadeiras','Sala da casa antiga'],
  galeria:['Galeria das vitrines','Sala das obras'],
  auditorio:['Sala dos bastidores','Palco pequeno'],
  asas:['Mezanino do voo','Terraço das asas'],
  fosseis:['Galeria da rocha','Sala das marcas'],
  relogios:['Sala das horas','Galeria dos ponteiros'],
  protecoes:['Sala dos capacetes','Galeria da armadura'],
  fotografia:['Sala das câmeras','Galeria das imagens'],
  prototipo:['Subsolo · Câmara do tempo','Subsolo · Câmara do tempo'],
  eletrica:['Oficina elétrica','Oficina elétrica'],
  deposito:['Sala do inventário','Galeria das caixas'],
  vidros:['Sala da transparência','Galeria do brilho'],
  mar:['Aquário antigo','Sala das águas'],
  recepcao:['Entrada de convidados','Balcão de chegada'],
  conservacao:['Gabinete dos espécimes','Sala do acervo'],
  seguranca:['Sala dos monitores','Posto de controle'],
  atelie:['Oficina de ensaios','Sala dos testes'],
  corredor:['Canto de descanso','Varanda da equipe'],
  sons:['Sala do rádio','Galeria da música'],
  limpeza:['Depósito de limpeza','Sala dos carrinhos'],
  ambar:['Sala do tempo preso','Galeria da resina'],
  patio:['Pátio da claridade','Jardim de luz'],
  brinquedos:['Sala das brincadeiras','Galeria dos carrinhos'],
  manutencao:['Bancada de reparos','Sala dos reparos']
};
// Peças extras por sala: [versão B, versão C]. A variante do nome sorteada (A, B ou C) também escolhe a peça, quando ela existe.
const PECAS_ALT = {
  limpeza:    [{peca:'L04', sub:'Ferramentas de limpeza'}, {peca:'L05', sub:'Produtos e panos coloridos'}],
  manutencao: [{peca:'M02', sub:'Baú de ferramentas'}, {peca:'M03', sub:'Armário de ferramentas'}],
  atelie:     [{peca:'L06', sub:'Projetos e bancada'}, {peca:'L07', sub:'Ferramentas de teste'}],
  prototipo:  [{peca:'T01', sub:'A máquina do tempo'}, {peca:'T01', sub:'A máquina do tempo'}],
  sons:       [{peca:'N16', sub:'Rádio comunicador'}, {peca:'V44', sub:'Gramofone'}],
  relogios:   [{peca:'R01', sub:'Relógio de custódia'}, {peca:'R02', sub:'Relógio de pêndulo'}],
  eletrica:   [{peca:'E01', sub:'Quadro elétrico'}, {peca:'E02', sub:'Central de energia'}],
  deposito:   [{peca:'I01', sub:'Fichário de registros'}, {livro:true, sub:'Livro de inventário', capa:'Livro de Inventário|MOVIMENTAÇÕES'}],
  recepcao:   [{peca:'P01', sub:'Mesa de recepção'}, {peca:'P02', sub:'Balcão com notebook'}],
  mobilia:    [{peca:'V12', sub:'Cômoda de madeira'}, {peca:'M04', sub:'Gaveteiro antigo'}],
  corredor:   [{peca:'V41', sub:'Sofá do descanso'}, {peca:'C02', sub:'Quadro de recados e alavancas'}],
  seguranca:  [{peca:'S02', sub:'Mesa com monitor'}, {peca:'S03', sub:'Parede de telas'}],
  patio:      [{peca:'F03', sub:'Farol de luz'}, {peca:'N10', sub:'Lanterna de rua'}],
  gigantes  : [{peca:'V01', sub:'Crânio de mamute'}, {peca:'V02', sub:'Costelas gigantes'}],
  predadores: [{peca:'V03', sub:'Mandíbula de tubarão'}, null],
  veiculos  : [{peca:'VEI_B', sub:'Carroça de madeira e bicicleta'}, {peca:'VEI_C', sub:'Motor a vapor e bicicleta'}],   // a bicicleta de roda alta aparece em todas as versões
  porcelana : [{peca:'V06', sub:'Bule de porcelana'}, {peca:'V07', sub:'Jarro de pintura azul'}],
  jogos     : [{peca:'V08', sub:'Jogo de xadrez'}, {peca:'V09', sub:'Dados antigos'}],
  cera      : [{peca:'V10', sub:'Crânio de primata'}, {peca:'V11', sub:'Máscara de pedra'}],
  galeria   : [{peca:'V13', sub:'Vitrine de vidro'}, {peca:'V14', sub:'Escultura abstrata'}],
  auditorio : [{peca:'V15', sub:'Refletor de palco'}, {peca:'V16', sub:'Microfone de pedestal'}],
  asas      : [{peca:'V17', sub:'Planador antigo'}, {peca:'V18', sub:'Esqueleto de pássaro'}],
  fosseis   : [{peca:'V19', sub:'Amonite'}, {peca:'V20', sub:'Trilobita'}],
  protecoes : [{peca:'V23', sub:'Capacete de bombeiro'}, {peca:'V24', sub:'Escudo de madeira'}],
  fotografia: [{peca:'V25', sub:'Câmera antiga'}, {peca:'V26', sub:'Projetor antigo'}],
  vidros    : [{peca:'V30', sub:'Garrafa de vidro soprado'}, {peca:'V31', sub:'Lustre de cristal'}],
  mar       : [{peca:'V32', sub:'Concha grande'}, {peca:'V33', sub:'Esqueleto de baleia'}],
  brinquedos: [{peca:'V48', sub:'Cavalinho de balanço'}, {peca:'V49', sub:'Pião'}],
  ambar     : [{peca:'V52', sub:'Inseto em âmbar'}, {peca:'V50', sub:'Âmbar polido'}],
  conservacao:[{livro:true, sub:'Livro de registros do acervo', capa:'Livro do Acervo|REGISTRO DE ESPÉCIMES'}, {peca:'B07', sub:'Inseto sob vidro'}]
};
const FUNCOES_ENTRADA = ['recepcao','conservacao','seguranca','limpeza','manutencao','patio'];
const LUGARES = {'2º andar':9, '1º andar':10, 'Térreo':11};
let MUSEU = null;
function rngMuseu(semente){let a=(semente>>>0)||1;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function embaralhar(v,rnd){const o=v.slice();for(let i=o.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[o[i],o[j]]=[o[j],o[i]]}return o}
function montarMuseu(semente){
 const mapa = {};
 if (!semente) {
  const cont = {};
  for (const r of ROOMS) { cont[r.andar] = (cont[r.andar]||0)+1; mapa[r.id] = {nome:r.name, v:0, andar:r.andar, lugar:cont[r.andar]}; }
  return {semente:0, mapa};
 }
 const rnd = rngMuseu(semente);
 const lugaresTerreo = Array.from({length:LUGARES['Térreo']}, (_, i) => i+1);
 const entrada = lugaresTerreo.slice(0, FUNCOES_ENTRADA.length);
 embaralhar(FUNCOES_ENTRADA, rnd).forEach((id, i) => { mapa[id] = {andar:'Térreo', lugar:entrada[i]}; });
 const livres = [];
 for (const a of ANDARES) for (let n=1; n<=LUGARES[a]; n++) if (!(a==='Térreo' && n<=FUNCOES_ENTRADA.length)) livres.push({andar:a, lugar:n});
 const grupoB = embaralhar(ROOMS.map(r => r.id).filter(id => !FUNCOES_ENTRADA.includes(id) && id !== 'prototipo'), rnd);
 grupoB.forEach((id, i) => { mapa[id] = livres[i]; });
 mapa.prototipo = {andar:'Subsolo', lugar:1};
 for (const r of ROOMS) { const v = [r.name, ...NOMES_ALT[r.id]]; const i = Math.floor(rnd()*3); mapa[r.id].nome = v[i]; mapa[r.id].v = i; }
 return {semente, mapa};
}
function definirMuseu(semente){ MUSEU = montarMuseu(Number(semente)||0); return MUSEU; }
function sala(id){
 const base = ROOMS.find(r => r.id === id); if (!base) return undefined;
 MUSEU ??= montarMuseu(0);
 const m = MUSEU.mapa[id];
 const alt = m.v ? PECAS_ALT[id]?.[m.v-1] : null;
 const r = {...base, name:m.nome, andar:m.andar, lugar:m.lugar, nomeBase:base.name, ...(alt ? alt : {})};
 const L = (typeof state !== 'undefined' && state && state.caseRules === 2) ? LOOP_SALAS[id] : null;   // no Loop: nome, peça e legenda da história
 if (L) { delete r.livro; delete r.capa; Object.assign(r, {name:L[0], sub:L[1], peca:L[2]}); }
 return r;
}
// Salas da história do Loop: um nome só por sala (o mesmo das pistas e do roteiro) e a peça que pertence à cena.
const LOOP_SALAS = {
 prototipo:['Subsolo · Câmara do tempo','A máquina do tempo','T01'], patio:['Pátio · Quadro externo','Quadro de energia e para-raios','E01'],
 eletrica:['Oficina elétrica','Gerador, fusíveis e luvas','E02'], relogios:['Sala dos relógios','Relógios que param na queda de luz','R02'],
 seguranca:['Central de monitoramento','Câmeras e crachás','S01'], recepcao:['Recepção','Livro de visitas e roleta','P01'],
 conservacao:['Sala de conservação','Registros e laudos do acervo','I01'], atelie:['Ateliê de descobertas','Bancada da Ivone e manual','L06'],
 deposito:['Sala das coleções','Caixas e movimentações','V12'], galeria:['Galeria especial','A peça principal','V11'],
 manutencao:['Oficina técnica','Ferramentas e fusíveis','M03'], corredor:['Corredor de serviço e descanso','Porta de serviço e recados','V41'],
 limpeza:['Base da limpeza','Armário da equipe e carrinho','L05'], sons:['Sala dos sons','Rádio da equipe','N07'], fotografia:['Sala da fotografia','Câmera antiga e catálogo','N05']
};
// Troca, em qualquer texto de pista, o nome de origem das salas pelo nome da partida.
function nomear(texto){
 if (typeof state !== 'undefined' && state && state.caseRules === 2) return texto;   // no Loop os nomes das salas são fixos
 MUSEU ??= montarMuseu(0);
 if (!MUSEU.semente) return texto;
 const por = Object.fromEntries(ROOMS.map(r => [r.name, MUSEU.mapa[r.id].nome]));
 const re = new RegExp(Object.keys(por).sort((x,y)=>y.length-x.length).map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
 return String(texto).replace(re, n => por[n]);
}
// Sorteia a semente da partida: as salas-chave do caso (onde, equipamento e fonte) não podem ficar todas no mesmo andar.
function sortearMuseu(chaves){
 for (let k=0; k<50; k++) {
  const semente = 1 + Math.floor(Math.random()*2147483646), m = montarMuseu(semente);
  if (!chaves || new Set(chaves.map(id => m.mapa[id].andar)).size > 1) return semente;
 }
 return 1;
}

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
const roomDescriptions={galeria:'Vitrines, pedestais e obras aguardam o fechamento. Algo chama sua atenção entre os registros da exposição.',conservacao:'Fichas de acervo e materiais de trabalho contam uma parte da história dos objetos.',seguranca:'Telas e botões cercam uma mesa de comando. O alarme é apenas um dos sinais daquela noite.',eletrica:'A luz de emergência revela equipamentos e anotações técnicas. Nem toda falha tem a mesma causa.',recepcao:'Convidados, entregas e registros de entrada se cruzam perto da porta principal, fechada pela grade de segurança.',corredor:'Pelo corredor passam pessoas e caixas. Olhar a passagem não revela, sozinho, toda a intenção.'};
const $=id=>document.getElementById(id);
const storageKey='cinco-minutos-ensaio-v1', historyKey='cinco-minutos-ciclo-v1';
let state=null,timerHandle=null,toastHandle=null;
function load(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function save(){try{localStorage.setItem(window.coop?.storageKey ?? storageKey,JSON.stringify(state))}catch{}}
function chooseCase(){let hist=load(historyKey,[]);if(!Array.isArray(hist))hist=[];let options=CASES.map((_,i)=>i).filter(i=>!hist.includes(i));if(!options.length){hist=[];options=CASES.map((_,i)=>i)}const i=options[Math.floor(Math.random()*options.length)];hist.push(i);try{localStorage.setItem(historyKey,JSON.stringify(hist))}catch{}return i}
function esc(s){return nomear(String(s)).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
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
  cera:"Seis figuras de cera estão paradas em seus pedestais, tão imóveis que parecem prender o fôlego. Uma delas pode não ser de cera.",
  mobilia:"Uma cadeira antiga de tecido bordado está cercada por uma cordinha. Uma plaquinha pede para não sentar.",
  asas:"Do mezanino se vê uma criatura de asas presa ao teto. As luzes de emergência ainda não acenderam.",
  fosseis:"Fósseis em placas de rocha estão nas bases de sempre. Uma criança deixou um desenho esquecido no chão.",
  relogios:"Um relógio de mão fica numa base inclinada. A placa fala de como a gente mede o tempo.",
  protecoes:"Um capacete antigo, arranhado e amassado, repousa num suporte. A placa fala de quem o usou.",
  fotografia:"Uma câmera fotográfica antiga fica sobre um tripé de madeira. A placa conta como as pessoas guardavam um instante.",
  vidros:"Um porta-velas de vidro guarda o reflexo da sala. Tudo que passa por trás aparece torto.",
  mar:"Um peixe grande de escamas prateadas nada no ar, preso por fios. A placa fala de rios e mares.",
  sons:"Um rádio de caixa grande fica sobre um pedestal. A placa pergunta se você ainda lembra de uma fita cassete.",
  limpeza:"Um balde com esfregão espera encostado na parede. A placa fala do trabalho que ninguém vê, mas que mantém tudo de pé.",
  ambar:"Um mosquito aparece preso dentro de um bloco de âmbar. A placa diz que ele ficou parado por milhões de anos.",
  brinquedos:"Um carrinho de brinquedo está parado numa pista de madeira. Uma criança deixou a marca de um dedo no vidro.",
  manutencao:"Uma caixa de ferramentas antiga está aberta sobre a bancada. A placa fala de quem conserta o que quebra, de uma lâmpada a um fio."
};
const EXTRA_ORDEM = Object.keys(EXTRAS);
Object.keys(EXTRAS).forEach(k => { roomDescriptions[k] = EXTRAS[k]; });

function makeClues(c){
 const evidence=labels[c.alarm][1],fig=figures[c.figure],room=sala(c.room).name;
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

// No Loop (camada central) o mapa mostra só as salas da história e as salas só trazem pistas dela.
let SALAS_LOOP = null;
function salasDoLoop(){ return SALAS_LOOP ||= new Set(LC.pistas.map(p => p.sala)); }
function scenarioClues(){
 const todas = mergeNoite(scenarioCluesBase()), out = {};
 for (const k of Object.keys(todas)) out[k] = todas[k].filter(q => (!q.volta || q.volta === state.loop) && (!q.desde || state.loop >= q.desde) && (!q.vmax || state.loop <= q.vmax) && (!q.lcp || lcVisivel(q)) && (state.caseRules !== 2 || q.lcp)).map(q => ({...q, name:nomear(q.name), text:nomear(q.lcp ? lcTextoClue(q) : q.text)}));
 return out;
}
function scenarioCluesBase(){
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
 const diretorio = 'Diretório de equipamentos: ' + Object.keys(TIME_PATHS).map(resolvePath).map(p => p.code+' fica em '+sala(p.room).name).join('; ') + '.';
 clues.seguranca.push({id:'time-dir1',name:'Consultar o diretório de equipamentos',time:30,tipo:'Registro',text:diretorio,fatos:['dir']});
 clues.patio.push({id:'time-dir2',name:'Ler o mapa de equipamentos',time:60,tipo:'Registro',text:diretorio,fatos:['dir']});
 clues[path.source].find(q => q.id === 'time-source').fatos = ['when','how','predict','proc'];
 // Salas sem peça-chave: três ecos verdadeiros, de fatos diferentes (21/11/2026: mais caminhos até cada fato essencial).
 const c = current(), evidence = labels[c.alarm][1], room = sala(c.room).name;
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

function show(id){
 $('coopShortcut').classList.toggle('hidden', id === 'start' || !!window.coop);
 ['start','game','between','final','result'].forEach(x => $(x).classList.toggle('hidden', x !== id));
 if (id !== 'game') document.getElementById('lcDialog')?.close();
 lcAtualizarBotao();
 window.scrollTo({top:0,behavior:'instant'});
}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastHandle);toastHandle=setTimeout(()=>$('toast').classList.remove('show'),2200)}
function popup(id){if(!$(id).open)$(id).showModal()}
function fmt(s){s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function museumTime(){ return loopHora(state.duration, state.remaining); }
function current(){return CASES[state.caseIndex]}
function reset(){clearInterval(timerHandle);state={caseIndex:chooseCase(),loop:1,phase:'choose',room:null,duration:Number($('speed').value),remaining:Number($('speed').value),endAt:null,clues:[],hints:0,notes:'',answers:null,liveFinal:true,caseRules:2,archive:[],codes:sortearCodigos()};state.museu=sortearMuseu(chavesDoCaso(state.caseIndex));definirMuseu(state.museu);save();renderGame();show('game')}
// Andar entre salas durante a volta: leva 10 segundos de caminhada (na proporção do relógio). O que está na mão vai junto.
function agoraJogo(){ return window.coop?.now() ?? Date.now(); }
function andando(){ return state.andandoAte && agoraJogo() < state.andandoAte; }
function marcarCaminhada(){ state.andandoAte = agoraJogo() + 10000 * (state.duration / 300); setTimeout(() => { if (typeof renderClues === 'function' && state.phase === 'playing' && state.room) renderClues(); }, 10000 * (state.duration / 300) + 80); }
function enterRoom(id){
 const anterior = state.room;
 if (window.coop) {
  window.coop.choose(id);
 } else if (state.phase === 'playing' && state.room && id !== state.room) {
  if (andando()) { toast('Você ainda está andando.'); return; }
  state.room = id; marcarCaminhada(); save(); renderGame(); toast('Você vai para ' + sala(id).name + '. A caminhada leva 10 segundos.');
 } else if (state.phase === 'choose') {
  state.room = id;
  state.phase = 'playing';
  state.remaining = state.duration;
  state.endAt = Date.now() + state.remaining * 1000;
  save();
  renderGame();
  tick();
  timerHandle = setInterval(tick, 250);
 }
 if (state.room && state.room !== anterior) {
  $('phaseTitle').focus({preventScroll:true});
  window.scrollTo({top:0,behavior:'instant'});
 }
}
function chavesDoCaso(i){ const t = TIME_PATHS[CASE_PATHS[i]]; return [CASES[i].room, ...(t ? [t.room, t.source] : [])]; }
function aplicarMuseu(){ if ((MUSEU?.semente ?? 0) !== (state.museu || 0)) definirMuseu(state.museu || 0); }
const ROTAS_INICIAIS = [
 ['galeria', 'Conferir a peça'],
 ['seguranca', 'Rastrear movimentações'],
 ['eletrica', 'Investigar a energia']
];
function renderRouteChoices(preparando) {
 const painel = $('routeChoices');
 const aberta = state.loop === 1 && !state.room && !preparando;
 painel.classList.toggle('hidden', !aberta);
 painel.innerHTML = aberta ? '<p>Por onde você quer começar?</p><div>' + ROTAS_INICIAIS.map(([id, pergunta]) =>
  '<button type="button" class="btn secondary" data-route="' + id + '"><strong>' + esc(pergunta) +
  '</strong><small>' + esc(sala(id).name) + '</small></button>').join('') + '</div>' : '';
 painel.querySelectorAll('[data-route]').forEach(b => b.onclick = () => {
  const escolha = $('roomGrid').querySelector('[data-room="' + b.dataset.route + '"]');
  if (escolha && !escolha.disabled) escolha.click();
 });
}
function renderRoomFocus() {
 const investigando = state.phase === 'playing' && !!state.room;
 $('game').classList.toggle('investigando', investigando);
 $('boardKicker').textContent = investigando ? 'INVESTIGAÇÃO' : 'MAPA DO MUSEU';
 $('roomMapButton').classList.toggle('hidden', !investigando);
 $('roomMapButton').setAttribute('aria-expanded', 'false');
 $('roomMapButton').textContent = 'Ver mapa';
 $('roomGrid').classList.toggle('hidden', investigando);
 $('roomPanel').classList.toggle('hidden', !investigando);
}
function renderGame(){
 aplicarMuseu();
 const finalLoop = hasLiveFinal() && state.loop === 5;
 $('loopBrief').classList.toggle('hidden', !finalLoop);
 $('fictionTime').textContent = museumTime();
 $('museumSignal').textContent = '';
 $('loopLabel').textContent='LOOP '+state.loop+' DE 5';$('timer').textContent=fmt(state.remaining);
 $('clockStatus').textContent=state.phase==='playing'?'tempo em andamento':'aguardando escolha';
 $('phaseTitle').textContent=state.room?sala(state.room).name:'Escolha onde investigar';
 $('phaseDescription').textContent=state.phase==='playing'?'Gire a peça e toque nos pontos que brilham para achar pistas.':'Todo mundo começa no '+INICIO.name+', no '+INICIO.andar+'. Escolha para onde ir.';
 $('boardTitle').textContent = state.room ? (state.phase === 'playing' ? 'Examine a sala' : 'Ambiente escolhido') : 'Escolha um ambiente';
 $('phaseTitle').tabIndex = -1;
 $('roomGrid').innerHTML='<div class="inicio" role="status"><span class="room-icon" aria-hidden="true">'+INICIO.icon+'</span><div><strong>'+INICIO.name+' · '+INICIO.andar+'</strong><small>'+(state.phase==='playing'?'Quando o tempo acabar, você volta para cá. A porta principal está trancada pela grade de segurança.':'Você está aqui. Todo mundo começa aqui, a cada volta. A porta principal está trancada pela grade de segurança.')+'</small></div></div>'+ANDARES.map(a=>'<h4 class="andar">'+a+'</h4>'+ROOMS.filter(r=>state.caseRules!==2||salasDoLoop().has(r.id)).map(r=>sala(r.id)).filter(r=>r.andar===a).sort((x,y)=>x.lugar-y.lugar).map(r=>'<button class="room an'+ANDARES.indexOf(a)+' '+(state.room===r.id?'selected':'')+'" '+(state.phase==='playing'&&state.room===r.id?'disabled':'')+' data-room="'+r.id+'">'+(r.peca?'<img class="room-3d" src="'+new URL('../icones/'+r.peca+'.webp',PECAS_URL).href+'" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement(\'span\'),{className:\'room-icon\',textContent:\''+r.icon+'\'}))">':'<span class="room-icon" aria-hidden="true">'+r.icon+'</span>')+'<strong>'+esc(r.name)+'</strong><small>'+esc(r.sub)+'</small></button>').join('')).join('');
 document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>enterRoom(b.dataset.room)));
 const preparando = renderPrep();
 renderRouteChoices(preparando);
 $('endLoop').classList.toggle('hidden', state.phase!=='playing' || ((finalLoop || state.caseRules === 2) && state.duration===300));
 $('statusText').textContent=state.phase==='playing'?'Você pode ir a outra sala quando quiser: a caminhada leva 10 segundos. No fim da volta você acorda no '+INICIO.name+'.':'Escolha por onde começar.';
 renderRoomFocus();
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
 const room = sala(state.room);
 const panel = $('roomPanel');
 const clues = scenarioClues()[room.id];
 const scene = [state.caseIndex, state.caseRules, !!window.coop, room.id, state.loop, state.museu||0].join(':');
 const visiveis = clues.map(pista => pista.id).join(',');
 if (panel.dataset.scene !== scene || panel.dataset.visiveis !== visiveis) {
  const manterLista = panel.dataset.scene === scene && panel.querySelector('.lista-pistas')?.open;
  panel.dataset.scene = scene;
  panel.dataset.visiveis = visiveis;
  const hotspots = clues.map((clue, i) => '<button type="button" class="hs" slot="hotspot-'+i+'" data-hs="'+clue.id+'" data-visibility-attribute="visible" data-position="0m 0m 0m" data-normal="0m 1m 0m" aria-label="Ponto de interesse na peça"></button>').join('');
  if (room.livro) {
   panel.innerHTML = '<h3>'+room.name+'</h3><p>'+roomDescriptions[room.id]+'</p>'+
    '<div class="peca livro"><iframe title="Livro da sala" src="'+new URL('livro/index.html?embed=1&solo=1&capa='+encodeURIComponent(room.capa||'Livro|REGISTRO'), PECAS_URL.href.replace('pecas/','')).href+'" allow="xr-spatial-tracking; camera; fullscreen" loading="eager"></iframe></div>'+
    '<p class="dica">Arraste a página para virar a folha. O que a página mostra fica registrado no seu caderno. Se o livro não abrir, use a lista.</p>'+
    '<details class="lista-pistas"><summary>Examinar pela lista</summary><div class="clue-list">'+
    clues.map(clue => '<button type="button" class="clue" data-clue="'+clue.id+'"><span>'+esc(clue.name)+'</span><small></small></button>').join('')+
    '</div></details><div id="intervention" hidden></div>';
   panel.querySelectorAll('[data-clue]').forEach(button => { button.onclick = () => collect(button.dataset.clue); });
   panel.dataset.livro = '';
  } else
  panel.innerHTML = '<h3>'+room.name+'</h3><p>'+roomDescriptions[room.id]+'</p>'+
   '<div class="peca"><model-viewer loading="eager" reveal="auto" src="'+new URL(room.peca+'.glb', PECAS_URL).href+'" alt="Peça da sala '+esc(room.name)+'" ar ar-modes="webxr scene-viewer quick-look" ar-scale="auto" ar-placement="floor" camera-controls touch-action="pan-y" interaction-prompt="none" shadow-intensity="0.6" exposure="1.15" field-of-view="26deg" min-field-of-view="12deg" max-field-of-view="45deg">'+hotspots+'<button type="button" slot="ar-button" class="btn secondary ar-btn">Ver no ambiente</button></model-viewer></div>'+
   '<p class="dica">Gire a peça e toque nos pontos que brilham. As pistas ficam escondidas nela.</p>'+
   '<details class="lista-pistas"><summary>Examinar pela lista</summary><div class="clue-list">'+
   clues.map(clue => '<button type="button" class="clue" data-clue="'+clue.id+'"><span>'+esc(clue.name)+'</span><small></small></button>').join('')+
   '</div></details><div id="intervention" hidden></div>';
  panel.querySelectorAll('[data-clue]').forEach(button => { button.onclick = () => collect(button.dataset.clue); });
  panel.querySelectorAll('[data-hs]').forEach(hs => { hs.onclick = () => collect(hs.dataset.hs); });
  const lista = panel.querySelector('.lista-pistas');
  panel.insertBefore(lista, panel.querySelector('.peca'));
  lista.open = !!manterLista;
  const mv = panel.querySelector('model-viewer');
  if (mv) {
   mv.addEventListener('load', () => pontosDaPeca(mv, clues));
   const abrirLista = () => { if (lista.isConnected) lista.open = true; };
   mv.addEventListener('error', abrirLista, {once:true});
   setTimeout(() => { if (!mv.loaded) abrirLista(); }, 5000);
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
  const bl = !registered && wait <= 0 ? bloqueioPista(clue, storySeconds) : '';
  const label = registered?'Registrada':wait>0?'Disponível em '+fmt(wait):bl?'Bloqueada agora':(clue.enigma&&!(state.resolvidos&&state.resolvidos[clue.id])?'Decifrar':'Examinar')+sufixoCusto(clue);
  button.disabled = registered || wait > 0 || !!bl;
  if (button.lastElementChild.textContent !== label) button.lastElementChild.textContent = label;
  if (hs) { hs.classList.toggle('on', wait <= 0 && !bl); hs.classList.toggle('ok', registered); hs.disabled = registered; }
 });
 if (room.livro) atualizarLivro(clues, elapsed);
 renderNoitePanel();
 const reserva = lcReservaDaSala();
 let lembrete = panel.querySelector('.loop-reserva');
 if (reserva && !lembrete) {
  lembrete = document.createElement('p');
  lembrete.className = 'loop-reserva muted';
  panel.querySelector('.lista-pistas').before(lembrete);
 }
 if (lembrete?.textContent !== reserva && lembrete) lembrete.textContent = reserva;
 if (!reserva) lembrete?.remove();
 lcRenderEncaminhamento(panel);
 renderIntervention(room.id, storySeconds);
}
// Livro folheável (museu/livro): cada pista vira uma página, escrita quando chega a hora dela; ao virar para a página, a pista é registrada.
function atualizarLivro(clues, elapsed){
 const panel = $('roomPanel'), fr = panel.querySelector('iframe'); if (!fr) return;
 const abertas = clues.map(c => c.time/300*state.duration-elapsed <= 0);
 const chave = abertas.map(x => x ? 1 : 0).join('');
 if (panel.dataset.livro === chave && fr.dataset.pronto === '1') return;
 const folhas = clues.map((c, i) => abertas[i] ? {titulo:c.name, linhas:[c.text]} : {titulo:'', linhas:[]});
 try { fr.contentWindow.postMessage({oi:'livro', evento:'paginas', folhas}, location.origin); panel.dataset.livro = chave; } catch (e) {}
}
addEventListener('message', e => {
 if (e.origin !== location.origin || !e.data || e.data.oi !== 'livro') return;
 const fr = document.querySelector('#roomPanel iframe'); if (!fr || e.source !== fr.contentWindow) return;
 if (e.data.evento === 'pronto') { fr.dataset.pronto = '1'; $('roomPanel').dataset.livro = ''; try { renderClues(); } catch (err) {} return; }
 if (e.data.evento !== 'folha' || !e.data.aberto || state.phase !== 'playing') return;
 const room = sala(state.room); if (!room?.livro) return;
 const clues = scenarioClues()[room.id], elapsed = state.duration-state.remaining;
 [2*e.data.par, 2*e.data.par+1].forEach(i => { const c = clues[i]; if (c && c.time/300*state.duration-elapsed <= 0 && !state.clues.some(x => x.id === c.id)) collect(c.id); });
});
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
 panel.hidden = !hasLiveFinal() || !ctl || state.caseRules === 2;   // no Loop, o conserto é pela Máquina
 if (panel.hidden) return;
 const path = timePath();
 const aberto = !!state.abertos?.[ctl.code];
 if (panel.dataset.ctl !== roomId+':'+(aberto ? 1 : 0)) {
  panel.dataset.ctl = roomId+':'+(aberto ? 1 : 0);
  if (!aberto) {
   panel.innerHTML = '<div class="cadeado"><svg viewBox="0 0 64 80" aria-hidden="true"><path d="M18 36V24a14 14 0 0 1 28 0v12" fill="none" stroke="#c9ccd2" stroke-width="7" stroke-linecap="round"/><rect x="8" y="34" width="48" height="40" rx="8" fill="#e0b13a" stroke="#7a5a12" stroke-width="3"/><circle cx="32" cy="50" r="5" fill="#3a2a08"/><rect x="30" y="52" width="4" height="12" rx="2" fill="#3a2a08"/></svg>'+
    '<div><h4>Equipamento trancado</h4><label for="codigoCadeado">Cadeado de código. Digite o código do equipamento.</label>'+
    '<div class="cadeado-linha"><input id="codigoCadeado" type="text" inputmode="text" autocomplete="off" autocapitalize="characters" maxlength="6" placeholder="Código"><button class="btn primary" type="button">Abrir</button></div><p role="status"></p></div></div>';
   const entrada = panel.querySelector('input'), aviso = panel.querySelector('p');
   const abrir = () => {
    const limpo = t => String(t).toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (limpo(entrada.value) === limpo(ctl.code)) { (state.abertos ??= {})[ctl.code] = true; save(); renderIntervention(roomId, elapsed); }
    else { state.erroCadeado = (state.erroCadeado||0)+1; aviso.textContent = state.erroCadeado >= 2 ? 'Código errado. O diretório de equipamentos diz o código de cada um; procure essa pista.' : 'Código errado.'; }
   };
   panel.querySelector('button').onclick = abrir;
   entrada.addEventListener('keydown', ev => { if (ev.key === 'Enter') abrir(); });
   return;
  }
  panel.innerHTML = '<h4>'+esc(ctl.control)+' · '+esc(ctl.code)+'</h4><label for="command">Comando</label><select id="command"><option value="">Escolha um comando</option>'+
   commandsOf(ctl).map(([v,t]) => '<option value="'+v+'">'+esc(t)+'</option>').join('')+
   '</select><button class="btn primary" type="button">Executar comando</button><p role="status"></p>';
  panel.querySelector('button').onclick = () => applyIntervention(panel.querySelector('select').value);
  panel.querySelector('select').addEventListener('change', () => renderIntervention(state.room, elapsedStoryTime(window.coop?.now() ?? Date.now())));
 }
 if (!aberto) return;
 const button = panel.querySelector('button');
 const select = panel.querySelector('select');
 const recorded = state.tentouVolta === state.loop || brokeLoop();
 button.disabled = recorded || !select.value;
 select.disabled = recorded;
 const status = panel.lastElementChild;
 const message = recorded
  ? (brokeLoop() ? (state.intervencaoVolta === state.loop ? 'Comando registrado. O relógio seguirá adiante às 22h.' : 'Você já interrompeu o retorno na volta '+state.intervencaoVolta+'.') : interventionNote(state.interventionWhy, path)+' Você pode tentar de novo na próxima volta.')
  : 'Você tem uma tentativa por volta, em qualquer volta. Hora no museu: '+clockAt(Math.floor(elapsed))+'.';
 if (status.textContent !== message) status.textContent = message;
}
function applyIntervention(command){
 const ctl = controlAt(state.room);
 const elapsed = elapsedStoryTime(window.coop?.now() ?? Date.now());
 if (!ctl || !hasLiveFinal() || state.phase !== 'playing' || brokeLoop() || state.tentouVolta === state.loop ||
     !commandsOf(ctl).some(([v]) => v === command)) return;
 const path = timePath();
 const rightEquipment = ctl.key === activeKey();
 const inWindow = elapsed >= path.opens && elapsed < path.closes;
 state.tentouVolta = state.loop;
 state.intervention = rightEquipment && command === 'break' && inWindow ? 'break' : 'other';
 if (state.intervention === 'break') state.intervencaoVolta = state.loop;
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
// Pistas com condição: requer (outra pista antes), ate (limite em segundos da história) e trava (depois dela, a sala fica vigiada até o fim da volta).
function bloqueioPista(q, storySec){
 if (q.lcp) { const m = lcBloqueio(q); if (m) return m; }
 if (q.requer && !state.clues.some(x => x.id === q.requer)) return 'Falta fazer algo antes. Veja as outras pistas desta sala.';
 if (q.minPistas && (state.clues || []).length < q.minPistas) return 'Faltam pistas no seu caderno. Precisa de pelo menos '+q.minPistas+'.';
 if (q.ate != null && storySec > q.ate) return 'Tarde demais nesta volta. Tente de novo na próxima.';
 const tr = state.trava && state.trava[state.loop+':'+state.room]; if (tr && tr !== q.id) return 'Os seguranças chegaram. Esta sala fica vigiada até o fim da volta.';
 return '';
}
function collect(id){if(andando()){toast('Você ainda está chegando na sala.');return}if(state.phase!=='playing'||(window.coop?.now() ?? Date.now())>=state.endAt){tick();return}const q=scenarioClues()[state.room].find(x=>x.id===id);if(!q||state.clues.some(x=>x.id===id)||state.duration-(state.endAt-(window.coop?.now() ?? Date.now()))/1000<q.time/300*state.duration)return;{const bl=bloqueioPista(q,(state.duration-(state.endAt-(window.coop?.now() ?? Date.now()))/1000)*300/state.duration);if(bl){toast(bl);return}}if(q.enigma&&!(state.resolvidos&&state.resolvidos[q.id])){abrirEnigma(q);return}if(q.lcp&&window.lcBancada&&lcBancada(q))return;if(!cobrarPista(q))return;const room=sala(state.room);state.clues.push({id:q.id,room:room.name,name:q.name,text:q.text,tipo:q.tipo,fatos:q.fatos,loop:state.loop,etq:q.etq||''});if(q.lcp)lcAposColetar(q);if(q.trava){(state.trava ||= {})[state.loop+':'+state.room]=q.id}save();renderClues();renderJournal();toast(q.trava?'Pista guardada. Os seguranças estão a caminho!':'Pista guardada no caderno')}
function renderJournal(){
 const clues=state.clues||[];$('countBadge').textContent=clues.length;
 $('journalPreview').innerHTML=clues.length?clues.slice(-3).reverse().map(c=>'<div class="preview-item">'+esc(c.name)+' <br><small>'+esc(c.room)+'</small></div>').join(''):'<p class="muted">Suas descobertas aparecerão aqui.</p>';
 $('journalList').innerHTML=clues.length?clues.map(c=>'<article class="journal-item"><b>'+esc(c.room)+' · Loop '+c.loop+(c.tipo?' · '+esc(c.tipo):'')+'</b><p><strong>'+esc(c.name)+':</strong> '+(window.lcGlos?lcGlos(esc(c.text)):esc(c.text))+'</p></article>').join(''):'<p class="muted">Você ainda não registrou pistas.</p>';
 if (!window.coop && state.archive?.length) {
  $('journalList').insertAdjacentHTML('beforeend', state.archive.map(key => {
   const axis = ANSWER_AXES.find(item=>item.key===key);
   return '<article class="journal-item"><b>Arquivo de fechamento · '+esc(axis.title)+
    '</b><p>'+esc(partialRecord(key))+'</p></article>';
  }).join(''));
 }
 const path = timePath();
 const figureRoom = sala(current().room).name;
 const roomName = id => sala(id).name;
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
function renderBetweenPlan(){
 const novas = state.clues.filter(pista => pista.loop === state.loop).length;
 $('betweenProgress').textContent = novas === 1 ? '1 pista registrada nesta volta.'
  : novas ? novas + ' pistas registradas nesta volta.' : 'Nenhuma pista registrada nesta volta.';
 $('betweenShare').classList.toggle('hidden', !window.coop || state.loop === 5);
 if (state.caseRules !== 2) return;
 const s = lcS();
 const assunto = s.diag ? 'Com o diagnóstico anexado, confira as exigências do conserto em Máquina → Atividades.'
  : 'Compare os sinais. Procure dois tipos de sinal e uma pista que ajude a descartar outro defeito.';
 const instrucoes = {
  1: 'Volta 2 · Teste uma hipótese. ' + assunto,
  2: 'Volta 3 · Prepare a intervenção. Confira o que precisa ser feito em outra sala ou numa volta anterior, como gravar o gesto no Pátio ou deixar a peça verdadeira no Subsolo.',
  3: 'Volta 4 · Ensaie a ação final. Sem dupla, esta é a última volta para gravar o gesto no Pátio ou deixar a peça verdadeira no Subsolo, quando o conserto exigir.',
  4: window.coop
   ? 'Volta 5 · Combinem quem vai operar a Máquina e quem leva as três provas para a Recepção. Guardem a energia necessária antes de explorar.'
   : 'Volta 5 · Escolha o objetivo que seu caderno permite concluir. Confira as provas, a sala e a energia antes de começar.',
  5: 'Os ciclos terminaram. Confira o desfecho que a sua investigação alcançou.'
 };
 $('betweenHint').textContent = instrucoes[state.loop];
}
function renderBetween(){
 const finished = state.loop === 5;
 const interrompeu = state.caseRules === 2 ? lcS().conserto === 5 : brokeLoop();
 $('betweenEyebrow').innerHTML = '<span></span> '+(finished && interrompeu ? 'O TEMPO SEGUIU' : 'O TEMPO RETORNOU');
 $('betweenCount').textContent = state.clues.length;
 $('betweenLoop').textContent = state.loop+' / 5';
 $('betweenTitle').textContent = finished
  ? (interrompeu ? 'O relógio passou das 22h.' : 'O museu retornou às 21h55.')
  : 'Você se lembra.';
 $('betweenStory').textContent = finished
  ? (interrompeu ? 'A cadeia do retorno foi interrompida. O museu permanece no presente.' : 'O museu voltou às 21h55. Use o que você descobriu para reconstruir a noite.')
  : (state.caseRules === 2 ? ENTRE_VOLTAS[Math.min(state.loop,ENTRE_VOLTAS.length)-1] : ENTRE_VOLTAS[0]);
 $('betweenHint').textContent = finished ? (state.caseRules === 2 && state.clues.length < 3 ? 'Com poucas pistas? Ao apresentar a hipótese, você pode consultar trechos do arquivo de fechamento.' : 'Seu caderno está disponível para a conclusão.')
  : brokeLoop() ? 'Você já interrompeu o retorno. Continue investigando para entender o que aconteceu e ajudar a turma.'
  : state.loop >= 2 ? 'Quando achar o equipamento do retorno, você pode tentar intervir. É uma tentativa por volta, e agir mais cedo vale bônus. Se faltou uma pista, peça orientação no caderno.'
  : 'O próximo ambiente pode confirmar ou mudar sua hipótese.';
 $('nextLoop').textContent = finished ? 'Apresentar hipótese' : 'Escolher próximo ambiente';
 if (finished && state.caseRules === 2) $('nextLoop').textContent = 'Ir para o desfecho';
 renderCombos();
 renderBetweenPlan();
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
const wheres = () => Object.fromEntries(['galeria','recepcao','corredor','seguranca','conservacao'].map(id => [id, sala(id).name]));
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
const roomNameOf = id => sala(id).name;
// As 8 perguntas da investigação. Soma: 100 pontos. Cada pergunta indica de onde podem vir as respostas.
const ANSWER_AXES = [
 {key:'event', pts:15, title:'O quê', question:'O quê: o que aconteceu com o acervo ou a exposição?', options:EVENTS,
  sources:['gal2','con1','rec2','cor1','dep2'],
  guide:'Compare o que a equipe esperava encontrar com os registros de movimentação.'},
 {key:'where', pts:10, title:'Onde', question:'Onde: em que ambiente o acontecimento se concentrou?', get options(){return wheres()},
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
 if (axis.key === 'where' && sala(answer).andar === sala(right).andar) return Math.floor(axis.pts/2*cz.hit);
 if (axis.key === 'when' && TIME_PATHS[answer].opens === TIME_PATHS[right].opens) return Math.floor(axis.pts/2*cz.hit);
 return Math.round(axis.pts*cz.miss);
}
const ARCHIVE_LIMIT = 2;
function partialRecord(key){
 const c = current(), path = timePath();
 switch (key) {
  case 'event': return 'O índice do acervo menciona '+c.subject+'. No verso, lê-se que '+c.clue+'. A ficha de desfecho está incompleta.';
  case 'where': return 'O mapa de rondas marca um ponto de atenção no '+sala(c.room).andar+'. O nome do ambiente está borrado.';
  case 'when': return 'A agenda do protótipo marca um comando que fecha às '+clockAt(path.closes)+'. O horário de abertura foi rasurado.';
  case 'how': return 'O manual do protótipo cita o equipamento '+path.code+'. A página sobre a função dele foi arrancada.';
  case 'alarm': return 'O aviso sonoro começou às 21h57min45s, depois do apagão. ' + ({
   sensor:'O fragmento recuperado veio do histórico de equipamentos.',
   manual:'O fragmento recuperado veio do registro de operações da equipe.',
   teste:'O fragmento recuperado veio da agenda de manutenção.'
  }[c.alarm]) + ' O campo de causa está ilegível.';
  case 'figure': return 'A ronda localiza a figura imóvel em '+sala(c.room).name+'. O campo de identificação está em branco.';
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
 Object.assign(out, lerTeoria());
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
 const central = state.caseRules === 2;
 $('reflectionForm').open = !central;
 $('answerForm').querySelector('button[type=submit]').textContent = central ? 'Ver meu desfecho' : 'Apresentar conclusão';
 $('final').querySelector('.large').textContent = central
  ? 'Veja até onde sua investigação chegou. As perguntas de reflexão são opcionais.'
  : 'Use as pistas do dossiê para reconstruir a noite.';
 $('reflectionForm').hidden = central;
 $('answerFields').innerHTML = '<p class="certeza-note">Escolha o quanto você confia em cada resposta. Com mais certeza você ganha mais pontos se acertar, mas perde pontos se errar. Em Quem e Por quê, aponte a pista que sustenta a resposta: sem ela, vale como palpite.</p>'+
  ANSWER_AXES.map(axis => '<div class="answer-field"><label for="'+axis.key+'">'+esc(axis.question)+
  '</label><select id="'+axis.key+'">'+options(axis.options)+'</select>'+certezaControl(axis)+supportControl(axis)+'</div>').join('');
 fillAnswers(state.draft);
 renderArchive();
 $('answerFields').insertAdjacentHTML('beforeend', renderTeoria());
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
// Caderno do museu: lembra, neste aparelho, quais noites já foram visitadas e a melhor pontuação de cada uma.
const CADERNO_KEY = 'cinco-caderno-v1';
function registrarCaderno(score){
 const cad = load(CADERNO_KEY, {casos:{}, partidas:0});
 if (!cad.casos || typeof cad.casos !== 'object') { cad.casos = {}; cad.partidas = 0; }
 if (!state.cadernoFeito) {
  const k = String(state.caseIndex), c = cad.casos[k] || {vezes:0, melhor:0};
  c.vezes += 1; c.melhor = Math.max(c.melhor, score); cad.casos[k] = c; cad.partidas = (cad.partidas||0)+1;
  try { localStorage.setItem(CADERNO_KEY, JSON.stringify(cad)); state.cadernoFeito = true; save(); } catch {}
 }
 return {noites:Object.keys(cad.casos).length, partidas:cad.partidas, melhor:cad.casos[String(state.caseIndex)]?.melhor ?? score, vezes:cad.casos[String(state.caseIndex)]?.vezes ?? 1};
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
 const caderno = registrarCaderno(score);
 const central = state.caseRules === 2;
 const bonusCedo = hasLiveFinal() && brokeLoop() && state.intervencaoVolta ? Math.max(0,(5-state.intervencaoVolta)*3) : 0;
 const reflexao = '<p class="large">Investigação: <strong>'+score+' de 100 pontos</strong>. Cada pergunta vale 10 ou 15 pontos; resposta próxima vale metade. Palpite acerta 60%, provável 80% e certeza 100%, mas errar com certeza tira 30%.</p>'+
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
  (central ? '' : '<div class="result-card"><strong>O que aconteceu</strong><p>'+esc(c.detail.charAt(0).toUpperCase()+c.detail.slice(1))+
  '. '+esc(labels[c.alarm][1])+'</p><p>'+esc(figures[c.figure])+'</p></div>'+reconstruction+
  '<div class="result-card"><strong>Desfecho</strong><p>'+esc(ending)+'</p></div>')+
  teoriaResultado(answers)+blocoT()+
  (VALORES[state.caseIndex] ? '<div class="result-card"><strong>Para conversar</strong><p>'+esc(VALORES[state.caseIndex])+'</p></div>' : '');
 const historico = '<div class="result-card"><strong>Caderno do museu</strong><p>Você já visitou '+caderno.noites+' de '+CASES.length+' noites diferentes neste aparelho.</p></div>';
 const bonus = bonusCedo ? '<div class="result-card"><strong>Você agiu na volta '+state.intervencaoVolta+' · bônus de '+bonusCedo+' pontos</strong><p>Quanto mais cedo você interrompe o retorno, maior o bônus.</p></div>' : '';
 const respondeu = ANSWER_AXES.some(axis => answers[axis.key]);
 $('resultBody').innerHTML = central ? lcResumoFinal() +
  (false ? '<details class="loop-reflection"><summary>Rever a reflexão</summary>'+reflexao+'</details>' : '')
  : historico + bonus + reflexao;
}
document.addEventListener('click',e=>{let id=e.target.dataset.close;if(id)$(id).close()});
$('roomMapButton').onclick = () => {
 const aberto = $('roomGrid').classList.toggle('hidden') === false;
 $('roomMapButton').setAttribute('aria-expanded', String(aberto));
 $('roomMapButton').textContent = aberto ? 'Fechar mapa' : 'Ver mapa';
};
$('betweenShare').onclick = () => lcAbrir('trocar');
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
