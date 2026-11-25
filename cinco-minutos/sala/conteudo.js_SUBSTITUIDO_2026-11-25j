// Conteúdo do Loop (cópia própria de ../game.js, só os dados e a montagem das pistas).
// Usado pelo telão e pelo simulador. Se o conteúdo mudar em game.js, gere este arquivo de novo (sala/gerar-conteudo.sh).
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
 if (L) { delete r.livro; delete r.capa; Object.assign(r, {name:L[0], sub:L[1], peca:L[2], andar:L[3], lugar:L[4]}); if (L[5] && L[5].livro) r.livroLoop = L[5].livro; }   // no Loop o livro de folhear é por sala (segunda peça, com o conteúdo da história)
 return r;
}
// Salas da história do Loop: um nome só por sala (o mesmo das pistas e do roteiro), a peça que pertence à cena e o andar FIXO (as pistas falam de escada, porta de vidro e de quem sobe para a Galeria).
// [nome, legenda, peça, andar, ordem no andar, extras]  extras.livro = {capa, abrir, ids}: livro de folhear como segunda peça da sala, com as pistas listadas (na ordem das páginas)
const LOOP_SALAS = {
 galeria:['Galeria especial','A peça principal na base','GAL_A','2º andar',1],
 conservacao:['Sala de conservação','Registros e laudos do acervo','I01','1º andar',1,{livro:{capa:'Livro de registro|ACERVO DO MUSEU', abrir:'Abrir o livro de registro', ids:['tombo_1','livre_1','c_modo_1','b_verde_3','fh_carimbo','data_3','d_teo_1','fh_dobrada','teo_d1']}}], sons:['Sala dos sons','Rádio da equipe','N07','1º andar',2],
 fotografia:['Sala da fotografia','Câmera antiga e catálogo','N05','1º andar',3], relogios:['Sala dos relógios','Relógios que param na queda de luz','REL_A','1º andar',4],
 recepcao:['Recepção','Livro de visitas e roleta','P01','Térreo',1], seguranca:['Central de monitoramento','Câmeras e crachás','S01','Térreo',2],
 corredor:['Área de descanso','Porta de serviço e recados','DESC_A','Térreo',3], limpeza:['Base da limpeza','Armário da equipe e carrinho','L05','Térreo',4],
 atelie:['Ateliê de descobertas','Bancada da Ivone e manual','L06','Térreo',5,{livro:{capa:'Manual da Câmara|DRA. SATO', abrir:'Abrir o manual', ids:['man_1','man_cal_1','man_pot_1','man_anc_1','man_circ_1','man_dois_1','man_legenda']}}], deposito:['Sala das coleções','Caixas e movimentações','V12','Térreo',6],
 manutencao:['Oficina técnica','Ferramentas e fusíveis','M03','Térreo',7], eletrica:['Oficina elétrica','Gerador, fusíveis e luvas','E02','Térreo',8],
 patio:['Pátio · Quadro externo','Quadro de energia e para-raios','E01','Térreo',9],
 prototipo:['Subsolo · Câmara do tempo','A máquina do tempo','T01','Subsolo',1]
};
// Descrição de cada sala no Loop (uma linha, do mundo da história).
const LOOP_DESC = {
 prototipo:'A Câmara do tempo zumbe no meio da sala. Ligada, e ninguém consegue desligar.', patio:'Chove. O Quadro externo fica embaixo do para-raios.',
 eletrica:'O gerador ronca baixo entre fios, fusíveis e luvas.', relogios:'Dezenas de relógios, cada um no seu passo.',
 seguranca:'Monitores, um cofre pequeno e o café do Braga.', recepcao:'O livro de visitas, a roleta e um telefone que toca.',
 conservacao:'Diário do acervo, laudos e registros em cima da mesa.', atelie:'A bancada da Ivone e o manual da Câmara.',
 deposito:'Caixas empilhadas e uma mancha vermelha no chão.', galeria:'A peça principal na base. Aurélio não sai da frente dela.',
 manutencao:'Ferramentas, um armário travado e a cadeira vazia do Téo.', corredor:'A cafeteira, o mural e a porta de serviço.',
 limpeza:'O armário da equipe, o carrinho e Seu Dirceu de rodo na mão.', sons:'Um rádio, um gravador e a música de elevador.',
 fotografia:'Uma câmera antiga que dispara quando quer.'
};
const descSala = id => (typeof state !== 'undefined' && state && state.caseRules === 2 && LOOP_DESC[id]) || roomDescriptions[id];
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
const CASE_PATHS = [
 'reserve','suspension','reference','rehearsal','reference',
 'reserve','reference','suspension','reserve','rehearsal',
 'reference','rehearsal','suspension','rehearsal','reserve'
];
export { ANDARES, INICIO, ROOMS, LOOP_SALAS, sala, definirMuseu, sortearMuseu, montarMuseu, nomear, EVENTS, ALARMS, FIGURES, ACTIONS, CASES, labels, figures, makeClues, esc, CASE_PATHS };
