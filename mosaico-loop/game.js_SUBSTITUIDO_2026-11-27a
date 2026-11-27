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
 if (L) { delete r.livro; delete r.capa; Object.assign(r, {name:L[0], sub:L[1], peca:L[2], andar:L[3], lugar:L[4]}); if (L[5] && L[5].livro) r.livroLoop = L[5].livro; }   // no Loop o livro de folhear é por sala (segunda peça, com o conteúdo da história)
 return r;
}
// Salas da história do Loop: um nome só por sala (o mesmo das pistas e do roteiro), a peça que pertence à cena e o andar FIXO (as pistas falam de escada, porta de vidro e de quem sobe para a Galeria).
// [nome, legenda, peça, andar, ordem no andar, extras]  extras.livro = {capa, abrir, ids}: livro de folhear como segunda peça da sala, com as pistas listadas (na ordem das páginas)
const LOOP_SALAS = {
 galeria:['Galeria especial','A peça principal na base','GAL_B','2º andar',1],
 conservacao:['Sala de conservação','Registros e laudos do acervo','I01','1º andar',1,{livro:{capa:'Livro de registro|ACERVO DO MUSEU', abrir:'Abrir o livro de registro', ids:['tombo_1','insc_tabua','livre_1','c_modo_1','b_verde_3','fh_carimbo','data_3','d_teo_1','fh_dobrada','teo_d1']}}], sons:['Sala dos sons','Rádio, gravador e alto-falante','N17','1º andar',2],
 fotografia:['Sala da fotografia','Câmera antiga, varal e álbum','N18','1º andar',3], relogios:['Sala dos relógios','Relógios que param na queda de luz','REL_B','1º andar',4],
 recepcao:['Recepção','Livro de visitas e roleta','P01_B','Térreo',1], seguranca:['Central de monitoramento','Câmeras e crachás','S01_B','Térreo',2],
 corredor:['Área de descanso','Porta de serviço, mural e cafeteira','DESC_B','Térreo',3], limpeza:['Base da limpeza','Carrinho da equipe, balde e luvas','L08','Térreo',4],
 atelie:['Ateliê de descobertas','Bancada da Ivone e manual','L06','Térreo',5,{livro:{capa:'Manual da Câmara|DRA. SATO', abrir:'Abrir o manual', ids:['man_1','man_cal_1','man_pot_1','man_anc_1','man_circ_1','man_dois_1','man_legenda']}}], deposito:['Sala das coleções','Caixas e movimentações','D10','Térreo',6],
 manutencao:['Oficina técnica','Ferramentas e fusíveis','M03','Térreo',7], eletrica:['Oficina elétrica','Gerador, fusíveis e luvas','E02_B','Térreo',8],
 patio:['Pátio · Quadro externo','Quadro de energia e para-raios','Q01','Térreo',9],
 prototipo:['Subsolo · Câmara do tempo','A máquina do tempo','T01','Subsolo',1]
};
// Descrição de cada sala no Loop (uma linha, do mundo da história).
const LOOP_DESC = {
 prototipo:'A Câmara do tempo zumbe no meio da sala. Ligada, e ninguém consegue desligar.', patio:'A tempestade não para, e a pedra está toda molhada. O Quadro externo, fechado a cadeado, fica embaixo do para-raios.',
 eletrica:'O gerador ronca baixo entre fios, fusíveis e luvas.', relogios:'Uma parede de relógios, cada um no seu passo.',
 seguranca:'Monitores, um cofre pequeno e o café do Braga.', recepcao:'O livro de visitas, a roleta e um telefone que toca.',
 conservacao:'Diário do acervo, laudos e registros em cima da mesa.', atelie:'A bancada da Ivone e o manual da Câmara.',
 deposito:'Uma estante de caixas etiquetadas e uma mancha vermelha no chão.', galeria:'A peça principal na base. Aurélio não sai da frente dela.',
 manutencao:'Ferramentas e um armário travado. Num canto, longe da bancada, a cadeira vazia do Téo.', corredor:'A cafeteira, o mural e a porta de serviço.',
 limpeza:'O carrinho da equipe, o balde do esfregão e Seu Dirceu de pano na mão.', sons:'Um rádio, um gravador e a música de elevador.',
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
const $=id=>document.getElementById(id);
const storageKey='mosaico-loop-ensaio-v1', historyKey='mosaico-loop-ciclo-v1';
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
 'As portas fecharam de novo. Tudo voltou para o lugar. Mas você lembra do que achou.',
 'De novo. As mesmas falas, a mesma chuva, a luz que cai no mesmo ponto. O que você ainda não sabe é por que a máquina não deixa a noite andar.',
 'Terceira vez. Alguns registros não batem com o que as pessoas contam. Anote quem disse o quê, e em que minuto da volta.',
 'Quarta vez. Falta uma volta. Você já sabe o que consertar, em que sala e em que minuto?'
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
 document.body.dataset.tela = id;   // a folha de estilo sabe em que tela a pessoa está (o aviso da pausa sobe para não cobrir o botão)
 if (id !== 'game') document.getElementById('lcDialog')?.close();
 lcAtualizarBotao();
 window.scrollTo({top:0,behavior:'instant'});
}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastHandle);toastHandle=setTimeout(()=>$('toast').classList.remove('show'),Math.max(2200,String(text).length*60))}
function popup(id){if(!$(id).open)$(id).showModal()}
function fmt(s){s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function museumTime(){ return loopHora(state.duration, state.remaining); }
function current(){return CASES[state.caseIndex]}
function reset(){clearInterval(timerHandle);state={caseIndex:chooseCase(),loop:1,phase:'choose',room:null,duration:Number($('speed').value),remaining:Number($('speed').value),endAt:null,clues:[],hints:0,notes:'',answers:null,liveFinal:true,caseRules:2,archive:[],codes:sortearCodigos()};state.museu=sortearMuseu(chavesDoCaso(state.caseIndex));definirMuseu(state.museu);save();renderGame();show('game')}
// Andar entre salas durante a volta: leva 10 segundos de caminhada (na proporção do relógio). O que está na mão vai junto.
function agoraJogo(){ return window.coop?.now() ?? Date.now(); }
function andando(){ return state.andandoAte && agoraJogo() < state.andandoAte; }
function marcarCaminhada(){ state.andandoDe = state.room; state.andandoAte = agoraJogo() + 10000 * (state.duration / 300); setTimeout(() => { if (typeof plantaAtualizar === 'function') plantaAtualizar(); if (typeof renderClues === 'function' && state.phase === 'playing' && state.room) renderClues(); }, 10000 * (state.duration / 300) + 80); }   // andandoDe: o alfinete da planta fica na sala de onde se saiu até chegar
function enterRoom(id){
 const anterior = state.room;
 if (window.coop) {
  window.coop.choose(id);
 } else if (state.phase === 'playing' && state.room && id !== state.room) {
  if (andando()) { toast('Você ainda está andando.'); return; }
  marcarCaminhada(); state.room = id; save(); renderGame(); toast('Você vai para ' + sala(id).name + '. Andar até lá leva 10 segundos.');
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
 if (state.caseRules === 2 && painel.previousElementSibling !== $('roomGrid')) $('roomGrid').after(painel);   // as 15 salas vêm primeiro
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
// ---- Planta do museu (revisão 12, pedido do autor): no Loop, o mapa do celular é uma planta baixa em papel, numa pasta de arquiteto
// com uma orelha por andar (a folha do andar escolhido aparece inteira), na paleta do Limiar Ético (só aqui).
// Paredes = o vão da grade sobre a tinta; portas = aberturas no traço. A disposição é a mesma em todas as causas e voltas:
// Coleções e Ateliê dão para a Área de descanso (porta de serviço na parede de fora), armário da equipe colado na Base da limpeza,
// Central ao lado da Recepção, Oficina elétrica com porta para o Pátio (fora do prédio), escada ligando os andares.
// Trocar de orelha não custa nada; tocar numa sala de outro andar segue a mesma caminhada de 10 s.
// Revisão 14: a Sala das esculturas (em reforma) entra no Térreo como sala fechada, sem toque: porta de vidro para a Área de descanso,
// ao lado da escada (a pista `pose` vê a escultura por essa porta); um corredor estreito liga a escada, a Recepção, a Central e a Base da limpeza.
// Revisão 16: a Área de descanso volta a ter porta para o corredor, bem em frente à Base da limpeza (caminho 4:02 → 4:05 → escada do Subsolo
// e a fala da Ivone sobre o Seu Dirceu); a Sala das esculturas fica entre a escada e a Área de descanso, com o vidro virado para ela.
// Grade de 4 colunas só para isso (Ateliê, Coleções e Central ocupam as duas do meio, como antes). A Sala das coleções abre só para a Área de descanso. Conferido como grafo em /tmp/roda/r15/caminho.mjs.
// {andar, colunas, linhas, áreas da grade, portas [área, lado t/b/l/r, posição, tipo], altura do prédio na folha (0 = o resto da folha), escada [andar, seta]}
const PLANTA = [
 {andar:'2º andar', cl:'a2', alt:'64%', cols:'56px minmax(0,1.25fr) minmax(0,1fr)', rows:'minmax(0,1fr)', areas:['esc sag gal'],
  portas:[['esc','r','center'],['sag','r','center']], esc:[['1º andar','▼']]},
 {andar:'1º andar', cl:'a1', alt:'84%', cols:'56px minmax(0,1fr) minmax(0,1fr)', rows:'minmax(0,1fr) 20px minmax(0,1fr)', areas:['esc cons sons','esc corr corr','esc foto rel'],
  portas:[['esc','r','center'],['cons','b','center'],['sons','b','center'],['foto','t','center'],['rel','t','center']], esc:[['2º andar','▲'],['Térreo','▼']]},
 {andar:'Térreo', cl:'a0', alt:0, fora:true, cols:'minmax(0,1fr) minmax(0,.4fr) minmax(0,.92fr) minmax(0,1fr)', rows:'minmax(0,1fr) minmax(0,1fr) 54px 14px minmax(0,1fr)', areas:['ele ate ate desc','tec col col desc','esc esc est desc','hall hall hall hall','rec cen cen limp'],
  portas:[['ele','t','start'],['ele','b','center'],['tec','b','center'],['desc','b','center'],['est','r','center','vidro'],['ate','r','center','vidro'],['col','r','center'],['desc','r','end','fora'],['rec','t','center'],['cen','t','center'],['limp','t','center'],['rec','r','center'],['rec','b','center','fora'],['esc','b','center'],['est','b','center','fechada']], esc:[['1º andar','▲'],['Subsolo','▼']]},
 {andar:'Subsolo', cl:'as', alt:'56%', cols:'56px minmax(0,1fr)', rows:'minmax(0,1fr)', areas:['esc pro'], portas:[['esc','r','center']], esc:[['Térreo','▲']]}
];
const PLANTA_AREA = {gal:'galeria', cons:'conservacao', sons:'sons', foto:'fotografia', rel:'relogios', ele:'eletrica', ate:'atelie', desc:'corredor', tec:'manutencao', col:'deposito', rec:'recepcao', cen:'seguranca', limp:'limpeza', pro:'prototipo'};
function plantaLoop(){
 const e = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const pino = '<i class="pl-pino" aria-hidden="true"></i>', tem = salasDoLoop();
 const botao = (id, area) => {
  const st = area ? ' style="grid-area:' + area + '"' : '';
  if (!tem.has(id)) return '<div class="pl-vazio"' + st + ' aria-hidden="true"></div>';
  const s = sala(id), p = s.name.split(' · '), [nm, sub] = id === 'prototipo' ? [p[1] || p[0], ''] : [p[0], id === 'patio' ? p[1] || '' : ''];
  return '<button type="button" class="pl-sala' + (id === 'limpeza' ? ' armario' : '') + '" data-room="' + id + '"' + st + (state.phase === 'playing' && state.room === id ? ' disabled' : '') + ' aria-label="' + e(s.name) + '">' +
   (s.peca ? '<img src="' + new URL('../icones/' + s.peca + '.webp', PECAS_URL).href + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' : '') +
   '<span class="pl-nm"><b>' + e(nm) + '</b>' + (sub ? '<small>' + e(sub) + '</small>' : '') + '</span>' + pino + '</button>';
 };
 const folha = (f, i) => {
  let h = '';
  for (const a of new Set(f.areas.join(' ').split(' '))) {
   if (a === 'esc') h += '<div class="pl-esc" style="grid-area:esc">' + f.esc.map(([an, seta]) => '<button type="button" class="pl-sobe" data-andar="' + PLANTA.findIndex(x => x.andar === an) + '" aria-label="Ver a planta: ' + e(an) + '"><span aria-hidden="true">' + seta + '</span>' + e(f.fora ? an : an.replace(' andar', '')) + '</button>').join('') + '</div>';
   else if (a === 'corr') h += '<div class="pl-corr" style="grid-area:corr" aria-hidden="true"></div>';
   else if (a === 'hall') h += '<div class="pl-hall" style="grid-area:hall" aria-hidden="true"></div>';
   else if (a === 'est') h += '<div class="pl-reforma" style="grid-area:est" role="img" aria-label="Sala das esculturas, em reforma: fechada"><i class="pl-cadeado" aria-hidden="true"></i><span class="pl-nm" aria-hidden="true"><b>Esculturas</b><small>em reforma</small></span></div>';
   else if (a === 'sag') h += '<div class="pl-sag" style="grid-area:sag"><img src="' + ICONE_URL('ui/saguao') + '" alt=""><span class="pl-nm"><b>' + e(INICIO.name) + '</b><small>Toda volta começa aqui.</small></span>' + pino + '</div>';
   else h += botao(PLANTA_AREA[a], a);
  }
  h += f.portas.map(([a, lado, pos, tipo]) => '<i class="pl-porta ' + lado + (tipo ? ' ' + tipo : '') + '" style="grid-area:' + a + ';' + (lado === 't' || lado === 'b' ? 'justify-self:' : 'align-self:') + pos + '" aria-hidden="true"></i>').join('');
  const rosa = '<svg class="pl-rosa" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 4.5 15 13h-6z" class="n"/><path d="M12 21.5 9 13h6z"/><text x="12" y="4" text-anchor="middle">N</text></svg>';
  const carimbo = '<span class="pl-carimbo" aria-hidden="true"><small>Museu · planta</small>' + e(f.andar) + '</span>';
  return '<section class="pl-folha ' + f.cl + '" id="plFolha' + i + '" role="tabpanel" aria-labelledby="plOrelha' + i + '" hidden>' +
   (f.fora ? '<div class="pl-topo"><div class="pl-fora">' + botao('patio', '') + '</div><div class="pl-canto">' + rosa + carimbo + '</div></div>' : '') +
   '<div class="pl-predio" style="' + (f.alt ? 'height:' + f.alt + ';' : 'flex:1;') + 'grid-template-columns:' + f.cols + ';grid-template-rows:' + f.rows + ';grid-template-areas:' + f.areas.map(x => "'" + x + "'").join(' ') + '">' + h + '</div>' +
   (f.fora ? '' : '<div class="pl-canto">' + rosa + carimbo + '</div>') + '</section>';
 };
 return '<div class="planta"><p class="pl-leg" aria-hidden="true"><span><i class="pl-pino"></i>Você está aqui</span><span><i class="pl-tr"></i>Para onde você vai</span></p>' +
  '<p class="sr-only pl-status" role="status"></p>' +
  '<div class="pl-orelhas" role="tablist" aria-label="Andares do museu">' + PLANTA.map((f, i) => '<button type="button" class="pl-orelha" role="tab" id="plOrelha' + i + '" aria-controls="plFolha' + i + '" data-andar="' + i + '" aria-selected="false">' + e(f.andar) + pino + '</button>').join('') + '</div>' +
  '<div class="pl-pasta">' + PLANTA.map(folha).join('') + '</div></div>';
}
// Andar (índice em PLANTA) de uma sala; o Saguão superior fica no 2º andar.
const plantaAndarDe = id => !id ? -1 : PLANTA.findIndex(f => f.andar === (id === 'saguao' ? INICIO.andar : sala(id)?.andar));
function plantaOnde(){
 const anda = state.phase === 'playing' && state.room && andando();
 return {aqui: !state.room ? 'saguao' : anda ? (state.andandoDe || '') : state.room, indo: anda ? state.room : ''};
}
// Mostra a folha de um andar (sem custo: só troca a orelha). Sem andar: abre onde a pessoa está.
function plantaMostrar(i){
 const g = typeof document !== 'undefined' && document.getElementById('roomGrid'); if (!g || !g.querySelector('.planta')) return;
 if (i == null || i < 0) { const o = plantaOnde(); i = plantaAndarDe(o.aqui || o.indo); if (i < 0) i = 0; }
 g.querySelectorAll('.pl-orelha').forEach(b => { const on = +b.dataset.andar === i; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
 g.querySelectorAll('.pl-folha').forEach((f, k) => { f.hidden = k !== i; });
}
// Marca onde você está (alfinete) e, durante a caminhada, para onde vai (tracejado), nas salas e nas orelhas. Só troca classes: nada muda de tamanho.
function plantaAtualizar(){
 const g = typeof document !== 'undefined' && document.getElementById('roomGrid'); if (!g || !g.querySelector('.planta')) return;
 const {aqui, indo} = plantaOnde(), aA = plantaAndarDe(aqui), aI = plantaAndarDe(indo);
 g.querySelectorAll('.pl-sala').forEach(b => { const id = b.dataset.room, nm = sala(id).name;
  b.classList.toggle('aqui', id === aqui); b.classList.toggle('indo', id === indo); b.classList.toggle('selected', id === state.room);
  b.setAttribute('aria-label', nm + (id === aqui ? ', você está aqui' : id === indo ? ', você está indo para cá' : '')); });
 g.querySelectorAll('.pl-orelha').forEach(b => { const k = +b.dataset.andar; b.classList.toggle('aqui', k === aA); b.classList.toggle('indo', k === aI && aI !== aA);
  b.setAttribute('aria-label', PLANTA[k].andar + (k === aA ? ', você está aqui' : k === aI ? ', você está indo para cá' : '')); });
 const sg = g.querySelector('.pl-sag'); if (sg) sg.classList.toggle('aqui', aqui === 'saguao');
 const st = g.querySelector('.pl-status'); if (st) st.textContent = indo ? 'Você está indo para ' + sala(indo).name + '.' : aqui === 'saguao' ? 'Você está aqui: ' + INICIO.name + '. Toda volta começa aqui.' : aqui ? 'Você está aqui: ' + sala(aqui).name + '.' : '';
 g.querySelectorAll('[data-andar]').forEach(b => { b.onclick = () => { plantaMostrar(+b.dataset.andar); if (b.classList.contains('pl-orelha')) b.focus({preventScroll:true}); }; });
 const tl = g.querySelector('.pl-orelhas'); if (tl) tl.onkeydown = ev => { const d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0; if (!d) return; const at = +(tl.querySelector('[aria-selected="true"]')?.dataset.andar || 0), n = (at + d + PLANTA.length) % PLANTA.length; plantaMostrar(n); tl.children[n].focus(); };
 if (!g.querySelector('.pl-folha:not([hidden])')) plantaMostrar();
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
 $('loopLabel').textContent='VOLTA '+state.loop+' DE 5'; { const pd = state.caseRules === 2 && state.loop === 5 && typeof lcPapelDica === 'function' ? lcPapelDica() : ''; $('loopBrief').textContent = pd || 'Última volta. Agora o conserto vale. Abra a Máquina e veja o que falta.'; }$('timer').textContent=fmt(state.remaining);
 $('clockStatus').textContent=state.phase==='playing'?'tempo correndo':'escolha a sala';
 $('phaseTitle').textContent=state.room?sala(state.room).name:'Escolha uma sala';
 $('phaseDescription').textContent=state.phase==='playing'?(noAchar()?'Gire e chegue perto da peça: os detalhes só aparecem de perto.':'Gire a peça e toque nos pontos que brilham.'):'Toque numa sala para ir até lá.';
 $('boardTitle').textContent = state.room ? (state.phase === 'playing' ? 'Examine a sala' : 'Sala escolhida') : (state.caseRules === 2 ? '' : 'Para onde você vai?');
 $('boardTitle').hidden = !$('boardTitle').textContent;
 $('phaseTitle').tabIndex = -1;
 $('roomGrid').innerHTML=state.caseRules===2?plantaLoop():'<div class="inicio" role="status"><span class="ic3d" aria-hidden="true"><img src="'+ICONE_URL('ui/saguao')+'" alt=""></span><div><strong>'+INICIO.name+' · '+INICIO.andar+'</strong><small>'+(state.phase==='playing'?'No fim da volta, você volta para cá.':'Você está aqui. Toda volta começa aqui.')+'</small></div></div>'+ANDARES.map(a=>(state.caseRules===2?'':'<h4 class="andar">'+a+'</h4>')+ROOMS.filter(r=>state.caseRules!==2||salasDoLoop().has(r.id)).map(r=>sala(r.id)).filter(r=>r.andar===a).sort((x,y)=>x.lugar-y.lugar).map(r=>'<button class="room an'+ANDARES.indexOf(a)+' '+(state.room===r.id?'selected':'')+'" '+(state.phase==='playing'&&state.room===r.id?'disabled':'')+' data-room="'+r.id+'">'+(r.peca?'<img class="room-3d" src="'+new URL('../icones/'+r.peca+'.webp',PECAS_URL).href+'" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement(\'span\'),{className:\'room-icon\',textContent:\''+r.icon+'\'}))">':'<span class="room-icon" aria-hidden="true">'+r.icon+'</span>')+'<strong>'+esc(state.caseRules===2?r.name.split(' · ')[0]:r.name)+'</strong>'+(state.caseRules===2?'<small class="room-andar">'+esc(r.andar)+'</small>':'<small>'+esc(r.sub)+'</small>')+'</button>').join('')).join('');
 $('roomGrid').classList.toggle('loop-mapa', state.caseRules===2); $('roomGrid').classList.toggle('planta-on', state.caseRules===2);
 document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>enterRoom(b.dataset.room)));
 plantaAtualizar();
 const preparando = renderPrep();
 renderRouteChoices(preparando);
 $('endLoop').classList.toggle('hidden', state.phase!=='playing' || ((finalLoop || state.caseRules === 2) && state.duration===300));
 $('statusText').textContent=state.phase==='playing'?'Você pode ir a outra sala quando quiser. Andar até lá leva 10 segundos.':'Escolha por onde começar.';
 renderRoomFocus();
 if(state.phase==='playing'&&state.room)renderClues();
 if(window.coop)window.coop.decorate();
 $('notes').value=state.notes||'';renderJournal();
}
const PECAS_URL = new URL('museu/pecas/', document.currentScript ? document.currentScript.src : location.href);
const ICONE_URL = n => new URL('../icones/'+n+'.webp', PECAS_URL).href;
// Miniatura 3D da sala a partir do nome que ficou guardado na pista (caderno): a peça é a mesma do mapa.
function pecaDaSalaNome(nome){
 const L = Object.values(LOOP_SALAS).find(x => x[0] === nome); if (L) return L[2];
 const r = ROOMS.find(x => x.name === nome || sala(x.id).name === nome); return r ? r.peca : '';
}
const fichaSala = (nome, cls) => { const p = pecaDaSalaNome(nome); return '<span class="ic3d '+(cls||'')+'" aria-hidden="true">'+(p ? '<img src="'+ICONE_URL(p)+'" alt="" loading="lazy">' : '<img src="'+ICONE_URL('ui/caderno')+'" alt="" loading="lazy">')+'</span>'; };
// Tipo da pista na lista da sala: ícone e cor fixos por tipo (papel, olhar, conversa, objeto que se leva).
const TIPO_PISTA = {Registro:['reg','pista-registro'], 'Observação':['obs','pista-observacao'], Relato:['rel','pista-relato']};
function tipoDaPista(q){ const p = q.lcp && typeof LC_PID !== 'undefined' ? LC_PID[q.lcp] : null; if (p && p.tipo === 'objeto') return ['obj','pista-objeto']; return TIPO_PISTA[q.tipo] || TIPO_PISTA.Registro; }
// Na sala a faixa do cartão é neutra (o tipo vem do ícone): a cor de etiqueta só existe no caderno e no dossiê, depois de a pista ser lida, para não dizer de graça o que é sinal.
const botaoPista = clue => { const t = tipoDaPista(clue); return '<button type="button" class="clue t-'+t[0]+'" data-clue="'+clue.id+'"><i class="ic3d sm" aria-hidden="true"><img src="'+ICONE_URL('ui/'+t[1])+'" alt=""></i><span>'+esc(clue.name)+'</span><small></small></button>'; };
const etqClasse = e => /^SINAL/i.test(e || '') ? 'sinal' : /^LEITURA COMPLETA/i.test(e || '') ? 'completa' : /^LEITURA/i.test(e || '') ? 'normal' : /^MANUAL/i.test(e || '') ? 'manual' : 'outra';
const hashTxt = t => { let h = 2166136261; for (const ch of String(t)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; };
// Lugares fixos dos pontos em cada peça do Loop (revisão 8): 32 lugares na superfície da peça, gerados em museu/pontos-pecas.html. Cada um: [x, y, z, nx, ny, nz], posição em fração da caixa da peça (centro = 0) e direção para onde a superfície olha.
// Se a peça de uma sala mudar, gere de novo os lugares dela.
// Revisão 17 (conferência das 15 salas): Recepção e Central também passaram para peças novas (P01_B e S01_B), com os lugares sobre os objetos (pontosNos e toques na tela). Nas outras salas, as vagas das pistas que citam um objeto da peça foram postas em cima dele (toque na peça com positionAndNormalFromPoint, câmera inicial 390x844; /tmp/roda/r16/remap.json): 105 vagas em 11 salas; os outros lugares ficaram iguais. GAL_B: as vagas da inscrição e do quadro torto não mudaram.
// Revisão 17: a Oficina elétrica passou para a E02_B (oficina montada sobre a E02, sem teto). Os 12 lugares saem de pontosNos (museu/pontos-pecas.html), um em cima de cada objeto que a pista cita, na ordem das vagas da sala (gancho com luvas, ordem de serviço, gaveta de baixo, painel de ferramentas, fusível na bancada, painel de fusíveis, verso da ordem, fita do gerador, medidor, lâmpadas, procedimento, folha de conferência); os 20 seguintes repetem os 12. A E02 antiga fica no acervo, com os lugares dela.
// Revisão 17, lote 15 (pontos escondidos): cada lugar foi conferido com a câmera de toque (giro na horizontal, zoom até o fim, /tmp/roda/r17/conserta_vagas.mjs). Os que ficavam dentro da peça ou atrás de outra parte foram puxados para a superfície vista na frente: S01_B 18, I01 14, L06 13 e 15, D10 9, L08 3, N17 7. Os outros ficaram iguais.
// Revisão 11: na GAL_B, o lugar 3 foi para o alto da testa da máscara, acima da inscrição (é o da pista "Inscrição na máscara"), e o lugar 8, que caía em cima da inscrição, foi para o quadro torto (é o da pista "Um quadro torto"). Os outros 30 ficaram iguais.
const LOOP_PONTOS = {
 S01_B:[[0.34,-0.031,-0.025,-0.088,0.994,0.066],[-0.005,-0.477,0.114,-0.011,1,0.001],[-0.228,-0.248,0.232,-0.539,-0.212,0.815],[0.039,-0.194,-0.035,0,1,0],[0.282,-0.121,-0.005,-0.606,0.378,0.7],[-0.261,0.171,-0.074,0.603,0.032,0.797],[-0.008,0.22,-0.153,0.673,-0.063,0.737],[-0.154,-0.345,0.217,0.309,0,0.951],[-0.307,-0.08,0.006,0.604,0.381,0.7],[-0.031,-0.182,-0.026,0,1,0],[0.232,-0.19,0.046,0,0,1],[0.25,-0.307,0.195,0.167,0.032,0.985],[0.247,0.166,-0.085,-0.603,0.033,0.797],[-0.2,-0.184,-0.005,0,1,0],[-0.206,-0.065,-0.084,0.591,0.334,0.734],[0.183,-0.097,-0.095,-0.58,0.362,0.73],[-0.146,-0.354,0.215,0.309,0,0.951],[0.154,-0.333,0.212,-0.259,0,0.966],[-0.294,-0.313,0.139,-0.79,0.039,0.613],[0.34,-0.031,-0.025,-0.088,0.994,0.066],[-0.005,-0.477,0.114,-0.011,1,0.001],[-0.228,-0.248,0.232,-0.539,-0.212,0.815],[0.039,-0.194,-0.035,0,1,0],[0.282,-0.121,-0.005,-0.606,0.378,0.7],[-0.261,0.171,-0.074,0.603,0.032,0.797],[-0.008,0.22,-0.153,0.673,-0.063,0.737],[-0.154,-0.345,0.217,0.309,0,0.951],[-0.307,-0.08,0.006,0.604,0.381,0.7],[-0.031,-0.182,-0.026,0,1,0],[0.232,-0.19,0.046,0,0,1],[0.25,-0.307,0.195,0.167,0.032,0.985],[0.247,0.166,-0.085,-0.603,0.033,0.797]],
 P01_B:[[-0.161,0.178,-0.405,0,0,1],[0.104,-0.137,0.093,0,1,0],[0,0.042,-0.438,0,0,1],[0.175,-0.127,-0.091,-0.259,0,0.966],[-0.104,-0.159,0.062,0,1,0],[-0.309,0.092,-0.438,0,0,1],[0.097,-0.23,0.194,0,0,1],[0.001,-0.144,0.159,0.154,0.004,0.988],[0.035,-0.166,0.194,0,1,0],[0.132,0.194,-0.411,0,0,1],[0.097,-0.4,0.207,0,0,1],[0.321,-0.237,0.107,-1,0,0],[-0.379,0.078,-0.097,0,0,1],[0.309,0.104,-0.438,0,0,1],[-0.161,0.178,-0.405,0,0,1],[0.104,-0.137,0.093,0,1,0],[0,0.042,-0.438,0,0,1],[0.175,-0.127,-0.091,-0.259,0,0.966],[-0.104,-0.159,0.062,0,1,0],[-0.309,0.092,-0.438,0,0,1],[0.097,-0.23,0.194,0,0,1],[0.001,-0.144,0.159,0.154,0.004,0.988],[0.035,-0.166,0.194,0,1,0],[0.132,0.194,-0.411,0,0,1],[0.097,-0.4,0.207,0,0,1],[0.321,-0.237,0.107,-1,0,0],[-0.379,0.078,-0.097,0,0,1],[0.309,0.104,-0.438,0,0,1],[-0.161,0.178,-0.405,0,0,1],[0.104,-0.137,0.093,0,1,0],[0,0.042,-0.438,0,0,1],[0.175,-0.127,-0.091,-0.259,0,0.966]],
 GAL_B:[[-0.069,-0.438,0.394,0,1,-0.001],[-0.07,0.08,0.002,0,1,0],[-0.088,0.375,0.036,-0.006,0.674,0.738],[-0.302,-0.438,0.142,-0.003,1,0],[0.35,-0.438,0.34,0,1,-0.001],[0.152,-0.279,-0.459,-0.002,-0.002,1],[-0.379,-0.438,0.394,0.001,1,-0.001],[0.11,0.28,-0.443,0,0,1],[-0.124,0.244,0.064,-0.152,0.02,0.988],[0.281,0.018,-0.454,0,0.003,1],[-0.096,-0.068,0.148,0.001,-0.006,1],[0.012,-0.214,0.152,0.775,0,0.632],[-0.338,-0.438,0.017,0.002,1,-0.004],[-0.231,-0.045,-0.454,-0.032,-0.002,0.999],[-0.054,-0.438,0.249,-0.005,1,0.007],[-0.183,0.029,0.158,-0.003,0.267,0.964],[0.144,-0.438,-0.14,0,1,-0.002],[0.107,0.323,-0.443,0.001,0,1],[0.193,-0.178,0.256,0.027,-0.004,1],[-0.234,-0.148,-0.073,-1,0.004,-0.004],[0.191,0.092,0.056,1,-0.009,0.015],[0.029,-0.117,-0.443,0.009,0.144,0.99],[0.411,-0.113,0.069,1,0,0.001],[0.181,-0.439,0.137,0.004,1,0.004],[-0.088,-0.209,0.146,0.001,0.001,1],[-0.257,-0.439,-0.277,0.006,1,0.001],[0.42,-0.181,-0.45,-0.579,-0.002,0.816],[-0.051,0.113,-0.454,-0.002,0,1],[0.411,-0.308,0.202,1,0.003,0.001],[0.382,0.232,-0.454,0.002,-0.001,1],[-0.233,-0.279,-0.448,-0.003,0,1],[-0.189,0.08,-0.075,0,1,0]],
 I01:[[0.056,0.172,0.4,0,1,0],[-0.391,-0.366,-0.348,-1,0,0],[0.391,0.279,-0.414,1,0,0],[-0.367,0.5,-0.195,0,1,0],[0.359,-0.435,0.07,1,0,0],[-0.183,-0.225,0.428,0.012,0,1],[-0.406,0.493,0.417,-0.996,0,0.091],[0.394,0.5,0.099,0,1,0],[-0.391,0.043,0.099,-1,0,0],[0.391,-0.298,-0.405,1,0,0],[0.123,-0.291,0.463,0.017,-0.265,0.964],[0.391,0.032,0.012,1,0,0],[-0.391,0.09,-0.354,-1,0,0],[0.057,0.5,-0.233,0,1,0],[-0.096,-0.147,0.427,0.012,0,1],[-0.077,0.5,0.196,0,1,0],[0.391,-0.027,0.398,1,0,0],[-0.229,-0.064,0.417,0,0,1],[0.249,0.474,0.429,0,0,1],[-0.047,-0.163,-0.393,0,0,1],[-0.359,-0.44,0.069,-1,0,0],[-0.391,0.352,0.126,-1,0,0],[-0.391,0.192,0.382,-1,0,0],[0.391,0.236,0.254,1,0,0],[-0.391,-0.185,-0.103,-1,0,0],[0.391,-0.038,-0.274,1,0,0],[0.391,-0.353,0.386,1,0,0],[0.406,0.462,-0.207,1,0,0],[-0.391,-0.201,0.228,-1,0,0],[-0.173,0.36,0.417,0,0,1],[0.391,-0.275,-0.139,1,0,0],[-0.391,0.21,-0.105,-1,0,0]],
 N17:[[-0.011,0.012,0.055,0.006,1,0.026],[0.326,0.403,-0.37,0.066,0.011,0.998],[0.346,0.148,-0.209,0,0.166,0.986],[0.036,0.28,0.001,0.085,0.05,0.995],[0.117,0.222,0.053,0.112,-0.004,0.994],[0.201,0.247,-0.157,0.078,-0.081,0.994],[-0.032,0.225,0.002,-0.613,0.26,0.746],[0.053,0.103,0.063,0.068,0.02,0.997],[-0.401,0.278,-0.444,-0.001,0,1],[-0.42,0.013,-0.181,-0.011,1,-0.022],[-0.048,-0.403,-0.383,-0.003,0.002,1],[-0.415,-0.014,0.248,-0.056,0.065,0.996],[0.002,0.394,-0.444,0.001,0.001,1],[-0.266,0.289,0.021,-0.682,0.019,0.731],[0.183,0.247,-0.151,0.172,-0.012,0.985],[0.265,-0.041,0.256,-0.02,-0.029,0.999],[0.415,0.024,-0.446,0.802,0.007,0.597],[-0.373,-0.37,-0.145,-1,0.014,0],[0.349,-0.341,-0.076,-0.015,1,0.001],[-0.307,0.045,-0.444,-0.001,0,1],[-0.186,0.218,-0.243,0.003,0.001,1],[-0.217,-0.198,-0.444,0.001,0.001,1],[0.195,-0.279,-0.444,-0.001,0,1],[-0.161,-0.141,0.19,-0.006,-0.004,1],[-0.022,0.299,-0.016,0.003,1,0.012],[0.136,0.012,-0.187,-0.002,1,0.001],[0.217,0.198,-0.444,0.002,-0.002,1],[-0.242,0.052,0.085,-0.041,0.008,0.999],[-0.486,-0.106,-0.445,-0.004,-0.001,1],[0.385,-0.185,-0.36,0.999,-0.018,-0.043],[0.334,-0.221,0.137,-1,-0.005,-0.02],[-0.102,0.172,-0.444,-0.001,0.001,1]],
 N18:[[0.353,-0.048,-0.01,-0.009,0.999,0.048],[-0.368,0.357,-0.076,0.705,-0.002,0.709],[0.101,0.095,-0.33,-0.65,0.052,0.758],[0.339,0.107,-0.093,-0.709,0.048,0.704],[0.14,-0.358,-0.111,0.013,1,0.003],[0.209,0.414,-0.053,-0.164,0.691,0.705],[-0.317,0.125,-0.126,0.711,-0.005,0.704],[-0.218,0.351,-0.226,0.708,-0.001,0.706],[-0.103,0.169,0.11,0.871,0.012,0.492],[0.337,-0.156,0.09,-0.699,-0.008,0.716],[0.161,0.398,-0.28,-0.708,0.001,0.706],[0.057,-0.435,-0.021,0.005,0.999,0.034],[-0.189,-0.202,-0.268,0.71,0.002,0.704],[0.208,-0.228,-0.234,-0.705,-0.003,0.709],[-0.407,-0.114,-0.048,0.709,0,0.705],[-0.106,0.203,0.019,0.148,0.974,0.173],[-0.233,-0.437,0.227,-0.665,0.347,0.662],[-0.204,0.127,-0.243,0.708,-0.003,0.707],[0.239,-0.439,0.23,0.031,0.999,0.029],[-0.194,-0.435,-0.137,0.005,1,-0.001],[0.177,0.028,-0.244,-0.677,0.114,0.727],[0.314,0.26,-0.129,-0.706,-0.005,0.709],[-0.379,0.433,-0.077,0.71,0.001,0.704],[-0.041,0.336,-0.417,0.71,0,0.705],[0.262,-0.244,0.011,-0.75,0.001,0.661],[0.008,-0.176,-0.433,-0.704,0.005,0.711],[0.001,-0.326,-0.211,0.598,0.456,0.659],[0.362,-0.103,0.133,-0.731,0.032,0.681],[-0.108,-0.289,0.152,-0.021,0.345,0.939],[0.464,0.19,-0.005,0.72,0.006,0.694],[0.219,0.496,-0.112,0.508,0.661,0.553],[0.013,-0.435,0.219,-0.003,1,-0.001]],
 REL_B:[[-0.244,0.333,-0.39,0.018,0.001,1],[0.374,0.018,-0.373,-0.021,-0.047,0.999],[0.396,0.195,-0.433,0.003,-0.01,1],[0.21,-0.173,-0.433,0.001,0.082,0.997],[-0.056,0.325,-0.368,0.003,-0.002,1],[-0.4,-0.146,-0.433,-0.006,0.022,1],[-0.009,-0.266,0.075,-0.177,0.224,0.958],[0.464,0.071,-0.43,-0.913,0.001,0.408],[-0.04,-0.437,-0.419,0.026,0.057,0.998],[-0.097,0.403,-0.438,-0.001,-0.003,1],[-0.363,-0.084,-0.367,-0.02,0.213,0.977],[0.056,-0.169,-0.074,0.906,-0.007,0.424],[0.191,0.215,-0.438,-0.001,-0.021,1],[0.268,-0.151,-0.437,0.007,0,1],[0.045,0.14,-0.141,0.935,0.302,-0.184],[-0.212,0.153,-0.433,-0.021,0.055,0.998],[-0.174,-0.228,-0.43,0,-0.036,0.999],[-0.042,-0.093,0.135,-0.022,0.01,1],[0.193,-0.385,-0.443,-0.004,0,1],[-0.062,-0.371,-0.075,-1,-0.008,-0.001],[-0.288,0.361,-0.331,-0.621,0.475,0.623],[-0.273,-0.438,-0.418,0.011,0.024,1],[0.383,0.289,-0.364,0,-0.006,1],[0.045,-0.233,-0.431,-0.004,-0.06,0.998],[-0.01,0.216,-0.438,-0.004,-0.003,1],[-0.457,0.078,-0.438,-0.012,-0.001,1],[0.181,0.018,-0.366,0.505,0.209,0.838],[0.096,0.424,-0.403,-0.594,0.804,0.028],[-0.378,-0.269,-0.435,0.012,-0.176,0.984],[0.056,-0.262,0.099,0.657,-0.004,0.754],[0.464,-0.145,-0.432,-0.752,0.01,0.66],[-0.06,0.024,-0.02,-1,0.008,-0.001]],
 P01:[[0.089,-0.085,0.067,-1,0,0],[-0.424,-0.407,-0.329,-0.5,0.004,0.866],[-0.348,0.314,-0.258,-0.992,0.006,0.129],[-0.424,-0.371,0.369,-0.5,0.004,0.866],[0.431,-0.368,-0.361,1,0,0],[0.431,-0.388,0.321,1,0,0],[0.201,0.093,-0.399,0,1,0],[-0.33,0.122,0.27,0.087,0.996,-0.007],[0.405,0.093,0.403,0,1,0],[-0.157,-0.087,-0.317,0,0,1],[0.431,0.039,-0.081,1,0,0],[0.089,-0.398,-0.2,-1,0,0],[0.038,0.093,0.405,0,0.967,0.254],[0.09,-0.321,0.326,0,0,1],[-0.243,0.478,0.027,-0.36,0.93,0.071],[-0.161,0.106,-0.042,0,1,0],[0.431,-0.363,-0.011,1,0,0],[0.431,-0.133,0.189,1,0,0],[-0.43,-0.021,-0.341,-0.965,0,0.261],[0.431,-0.077,-0.331,1,0,0],[0.16,0.093,-0.12,0,1,0],[-0.431,-0.104,0.354,-0.965,0,0.261],[0.255,0.093,0.159,0,1,0],[-0.42,0.093,-0.046,0,1,0],[0.089,-0.386,0.05,-1,0,0],[0.207,-0.105,0.314,0,0,1],[-0.111,0.106,0.186,0,1,0],[-0.036,0.093,-0.393,0,1,0],[0.089,-0.179,-0.265,-1,0,0],[-0.268,0.093,-0.254,0,1,0],[0.431,-0.229,-0.18,1,0,0],[-0.318,-0.233,-0.315,0,0,1]],
 S01:[[-0.005,-0.038,-0.095,0.725,0.454,0.518],[-0.059,-0.39,0.49,-0.2,0.055,0.978],[0.407,0.488,0.014,0.738,0.118,0.665],[-0.373,0.497,-0.022,-0.086,0.994,0.07],[0.498,-0.388,-0.002,-0.045,0.939,0.342],[-0.447,-0.401,-0.198,0.891,0.07,0.448],[0.183,-0.425,-0.45,0.156,0.353,0.922],[-0.418,-0.382,0.253,-0.039,0.999,-0.031],[0.004,0.382,-0.189,-0.006,0.994,0.113],[0.025,-0.439,-0.053,0.008,0.981,0.192],[0.218,-0.229,0.24,-0.051,-0.207,0.977],[-0.373,0.093,-0.01,-0.628,-0.047,0.777],[0.347,0.121,-0.005,0.786,0.044,0.617],[-0.237,-0.213,0.049,0.054,0.992,0.117],[0.183,-0.229,-0.215,0.99,0.13,-0.056],[-0.255,-0.415,-0.409,0.552,0.012,0.834],[0.374,-0.144,0,-0.76,-0.086,0.644],[0.431,-0.399,0.246,0.852,-0.086,0.517],[-0.179,-0.255,-0.222,-0.875,-0.126,0.468],[-0.166,0.173,-0.14,0.679,0.038,0.734],[0.147,0.181,-0.14,-0.93,-0.023,0.367],[-0.182,-0.424,0.187,0.836,0.203,0.51],[0.123,-0.208,0.022,-0.145,0.985,0.09],[0.222,0.407,-0.138,-0.05,0.999,-0.005],[-0.227,-0.412,-0.055,0.791,-0.004,0.611],[0.242,-0.382,-0.037,-0.779,-0.001,0.627],[0.212,-0.022,-0.099,0.138,0.972,-0.192],[-0.221,-0.034,-0.108,0.273,0.916,0.292],[0.191,-0.436,0.205,-0.3,0.889,0.345],[-0.056,-0.403,-0.48,0.171,0.192,0.966],[-0.2,0.376,-0.137,0.686,-0.005,0.727],[0.45,-0.382,-0.201,-0.019,0.998,0.06]],
 DESC_B:[[0.267,-0.112,-0.151,-0.766,0.001,0.643],[0.419,0.435,-0.018,0.643,0.022,0.765],[0.035,0.339,-0.378,-0.764,-0.001,0.646],[-0.088,-0.436,0.09,0,1,-0.001],[-0.138,0.282,-0.292,0.641,-0.003,0.768],[0.164,-0.435,-0.14,-0.059,0.846,0.531],[-0.234,0.026,-0.085,-0.039,-0.082,0.996],[0.37,0.001,-0.022,-0.762,-0.001,0.647],[-0.28,0.197,-0.174,0.647,0.023,0.762],[0.31,-0.385,-0.1,-0.766,-0.001,0.643],[0.231,-0.338,-0.194,-0.766,-0.001,0.643],[0.034,-0.436,-0.081,0,1,-0.002],[-0.197,0.227,-0.237,0.643,0,0.766],[0.219,0.445,-0.188,-0.763,0.003,0.646],[-0.259,-0.229,-0.028,0.644,-0.003,0.765],[-0.223,-0.436,0.266,-0.001,1,0.009],[0.221,-0.437,0.256,-0.594,0.633,0.497],[0.227,-0.178,-0.194,-0.766,-0.001,0.643],[0.223,0.485,-0.196,-0.767,0.031,0.641],[0.041,-0.281,-0.412,-0.768,0.002,0.64],[-0.025,0.071,-0.383,0.643,0,0.766],[-0.154,0.463,-0.275,0.639,0.007,0.769],[0.421,-0.227,-0.021,0.844,0,0.537],[-0.191,0.017,-0.113,0.921,-0.069,0.385],[0.227,-0.436,-0.012,-0.002,1,0.004],[0.395,0.219,0.002,0.18,0.002,0.984],[-0.413,0.226,-0.111,-0.996,0.028,-0.081],[-0.218,-0.438,-0.02,0.401,0.765,0.504],[0.034,-0.436,-0.163,-0.003,1,0.002],[0.153,-0.048,-0.347,0.999,0.007,-0.033],[0.274,0.271,-0.138,-0.766,0,0.643],[-0.118,-0.258,-0.305,0.643,0,0.766]],
 L08:[[0.076,0.006,0.114,0.638,0.77,0.007],[0.419,0.2,0.231,0.034,0.316,0.948],[-0.029,-0.214,0.253,0.027,0,1],[0.278,-0.322,0.282,-0.001,0.012,1],[-0.322,0.304,-0.072,0.686,0.028,0.727],[0.443,0.297,0.276,-0.171,0.859,0.483],[0.306,-0.391,0.28,0.241,-0.013,0.971],[0.142,0.149,0.279,-0.994,0.035,0.099],[-0.117,-0.386,0.267,-0.127,0.047,0.991],[-0.277,-0.051,-0.24,-0.025,0.122,0.992],[0.015,0.003,0.139,0.003,-0.093,0.996],[-0.039,-0.298,-0.204,0.114,-0.142,0.983],[-0.303,-0.042,-0.247,-0.892,-0.049,0.449],[-0.198,0.212,0.06,-0.783,0.282,0.554],[-0.412,-0.373,0.131,-0.015,0.054,0.998],[0.329,-0.08,0.276,0.275,0.094,0.957],[0.092,-0.307,0.055,-0.059,0.998,-0.034],[0.348,0.192,0.034,-0.008,1,0.001],[-0.005,0.047,-0.17,-0.009,0.041,0.999],[-0.191,-0.203,0.072,0.609,-0.103,0.787],[0.114,0.27,0.156,0.154,-0.037,0.987],[0.229,-0.189,-0.153,-0.014,0.003,1],[-0.05,-0.16,0.253,-0.175,0.002,0.985],[0.486,0.08,0.181,0.813,0.065,0.579],[-0.051,0.16,0.269,-0.168,0.096,0.981],[0.191,0.108,0.294,0.018,0.345,0.938],[0.429,-0.243,0.159,0.999,-0.019,0.041],[-0.379,-0.259,-0.08,-0.993,-0.12,0.005],[-0.254,0.017,-0.031,-0.008,1,-0.002],[0.109,-0.301,0.285,0.011,-0.048,0.999],[0.25,-0.139,0.088,-1,0.002,-0.002],[0.249,0.186,-0.145,0.995,0.083,-0.051]],
 L06:[[-0.135,-0.17,-0.23,-0.014,0.351,0.936],[-0.499,0.366,0.498,0.108,0.909,0.403],[0.316,0.412,-0.482,0.01,0.011,1],[-0.266,-0.416,0.491,-0.002,-0.006,1],[-0.484,0.478,-0.213,0.001,0.998,-0.057],[0.496,-0.245,-0.492,0.289,0.099,0.952],[0.316,-0.427,-0.017,-0.353,0.34,0.872],[-0.5,-0.006,0.128,-1,0,0],[-0.152,0.265,-0.47,0.042,0.532,0.846],[-0.467,-0.439,0.049,0.843,-0.269,0.465],[-0.473,-0.048,-0.482,-0.001,-0.001,1],[0.059,-0.153,0.178,-0.911,-0.056,0.408],[0.18,0.034,-0.46,-0.009,0,1],[0.118,-0.188,-0.14,0.046,0.997,0.067],[-0.489,-0.035,0.5,-0.017,-0.001,1],[0.356,0.081,-0.464,0.729,-0.195,0.656],[-0.5,0.48,0.162,-1,0.009,0.027],[-0.086,-0.426,0.03,0.126,0.188,0.974],[-0.477,0.105,-0.201,1,-0.009,-0.004],[0.238,-0.199,-0.23,0,1,-0.016],[-0.185,-0.406,-0.482,0,0,1],[0.49,0.051,-0.497,0.198,0,0.98],[-0.435,0.362,-0.48,0.005,-0.02,1],[-0.5,-0.282,0.349,-1,0,0],[-0.466,-0.192,-0.098,1,0.001,0.001],[0.147,-0.422,0.217,0.026,0.999,-0.021],[-0.102,-0.012,-0.457,-0.011,-0.032,0.999],[-0.5,0.244,0.029,-1,0,0],[0.392,-0.173,-0.012,0.811,-0.013,0.584],[-0.03,-0.41,-0.241,0.97,-0.121,0.212],[0.343,-0.42,-0.388,-0.031,-0.011,0.999],[-0.5,0.185,0.32,-1,0,0]],
 D10:[[0.234,-0.43,0.113,-0.001,1,0],[-0.312,-0.437,0.43,0.009,1,0.001],[-0.316,0.137,-0.136,0.17,-0.009,0.985],[-0.35,0.359,-0.139,0.261,-0.011,0.965],[-0.163,-0.436,0.39,0.012,1,-0.001],[-0.011,0.303,-0.208,-0.012,0.037,0.999],[0.069,-0.43,0.204,0.003,1,-0.003],[-0.405,-0.436,0.249,-0.028,1,0.014],[-0.068,-0.079,-0.2,-0.862,0.051,0.505],[-0.499,0.337,-0.19,-1,0.002,0.014],[-0.011,0.042,-0.177,0.122,-0.002,0.993],[0.317,-0.436,0.431,0.014,1,-0.01],[0.39,-0.436,0.188,0.034,0.999,-0.011],[-0.46,0.127,0.071,0.025,0.05,0.998],[-0.093,-0.336,0.052,0.031,0.981,0.193],[-0.012,-0.294,-0.182,0.086,-0.028,0.996],[-0.253,-0.248,0.082,-0.302,0.952,0.04],[-0.33,0.469,-0.347,0,1,-0.008],[-0.5,-0.072,-0.236,-1,0.001,-0.006],[0.121,0.189,-0.191,0.996,0.035,0.086],[0.483,-0.436,-0.185,0.017,1,-0.004],[-0.498,0.218,-0.066,-1,0.002,0.014],[0.453,-0.437,0.156,0.036,0.999,-0.002],[-0.499,-0.333,0.037,-1,-0.001,0.004],[0.106,-0.296,-0.18,-0.11,0.014,0.994],[-0.145,-0.026,-0.432,0.027,-0.003,1],[0.16,0.261,-0.436,0.036,-0.002,0.999],[-0.317,0.066,-0.142,0.177,-0.052,0.983],[-0.338,-0.223,-0.154,0.005,0.999,-0.032],[0.187,-0.433,0.262,0.502,0.675,0.542],[0.238,-0.182,-0.334,0.73,0.19,0.656],[-0.229,-0.279,0.31,0.062,-0.003,0.998]],
 M03:[[-0.254,0.289,-0.429,-0.001,-0.005,1],[-0.058,0.202,-0.337,-0.194,0.939,0.283],[0.226,0.473,-0.254,0.054,0.853,0.52],[0.038,0.097,-0.05,-0.049,0.988,0.147],[0.481,0.057,0.105,-0.749,0.663,-0.001],[-0.19,-0.105,0.467,-0.175,0.577,0.798],[-0.147,-0.291,0.45,0,0,1],[0.112,0.322,-0.432,-0.114,-0.174,0.978],[-0.361,0.096,0.032,-0.101,0.995,-0.02],[0.286,-0.138,0.458,0.18,0.102,0.978],[0.055,0.461,-0.181,-0.135,0.898,0.418],[-0.054,-0.255,0.45,0,0,1],[0.431,-0.018,-0.179,1,0.001,0.002],[-0.438,0.087,-0.056,-0.086,0.996,0.031],[0.186,0.043,0.491,0.07,0.278,0.958],[0.432,-0.328,0.054,1,0.002,-0.001],[-0.5,-0.151,0.196,-1,-0.002,0.002],[0.384,0.421,-0.109,-0.089,0.962,0.257],[-0.404,0.119,-0.429,0.012,0.006,1],[-0.439,0.423,-0.106,0.018,1,-0.006],[0.239,0.09,-0.428,0,0.034,0.999],[-0.17,0.379,-0.374,-0.849,-0.094,0.52],[0.289,0.126,0.034,-0.996,-0.081,-0.028],[0.1,0.088,-0.183,0,1,0],[0.107,0.343,-0.43,-0.006,-0.026,1],[0.421,-0.111,0.477,0.002,-0.015,1],[-0.181,0.09,-0.123,0.049,0.999,0.002],[-0.079,0.038,0.48,0.078,-0.155,0.985],[-0.296,-0.193,0.444,-0.007,-0.018,1],[0.253,0.257,-0.25,0.102,0.995,-0.004],[0.431,-0.062,0.053,1,0,0],[-0.205,0.423,-0.079,0.011,1,0.013]],
 E02_B:[[0.365,0.01,-0.401,0,0,1],[-0.214,-0.252,0.22,0,0,1],[0.214,-0.438,-0.243,0,0,1],[0.038,0.076,-0.433,0,0,1],[0.027,-0.17,-0.305,0.308,0.434,0.847],[-0.321,0.161,-0.389,0,0,1],[-0.214,-0.205,0.204,0,1,0],[-0.401,-0.044,0.222,0,0,1],[-0.114,0.239,-0.416,0,0,1],[0.134,0.35,-0.356,-0.434,0,0.901],[0.401,0.284,-0.447,0,0,1],[0.214,-0.177,-0.328,0,1,0],[0.365,0.01,-0.401,0,0,1],[-0.214,-0.252,0.22,0,0,1],[0.214,-0.438,-0.243,0,0,1],[0.038,0.076,-0.433,0,0,1],[0.027,-0.17,-0.305,0.308,0.434,0.847],[-0.321,0.161,-0.389,0,0,1],[-0.214,-0.205,0.204,0,1,0],[-0.401,-0.044,0.222,0,0,1],[-0.114,0.239,-0.416,0,0,1],[0.134,0.35,-0.356,-0.434,0,0.901],[0.401,0.284,-0.447,0,0,1],[0.214,-0.177,-0.328,0,1,0],[0.365,0.01,-0.401,0,0,1],[-0.214,-0.252,0.22,0,0,1],[0.214,-0.438,-0.243,0,0,1],[0.038,0.076,-0.433,0,0,1],[0.027,-0.17,-0.305,0.308,0.434,0.847],[-0.321,0.161,-0.389,0,0,1],[-0.214,-0.205,0.204,0,1,0],[-0.401,-0.044,0.222,0,0,1]],
 E02:[[-0.164,0.216,-0.204,0.781,0,0.624],[0.48,-0.384,0.332,-1,0,0],[-0.407,-0.267,0.5,0,0,1],[0.389,-0.299,-0.44,0,0,1],[-0.495,0.5,0.435,0,1,0],[0.497,0.499,-0.205,0,1,0],[-0.32,-0.425,-0.48,0,0,1],[-0.5,-0.161,-0.004,-1,0,0],[0.187,-0.004,0.128,1,0,0],[0.234,0.2,-0.48,0,0,1],[-0.5,0.49,-0.397,-1,0,0],[0.077,-0.265,0.5,0,0,1],[0.185,0.43,0.152,0,1,0],[-0.409,-0.002,-0.48,0,0,1],[-0.5,0.256,0.059,-1,0,0],[0.494,-0.207,-0.04,0,1,0],[0.099,0.499,-0.226,0,1,0],[-0.5,0.115,0.409,-1,0,0],[-0.056,-0.094,-0.48,0,0,1],[-0.299,0.499,-0.072,0,1,0],[0.066,-0.396,-0.438,0,1,0],[0.156,-0.311,0.153,0,0,1],[-0.169,0.499,-0.378,0,1,0],[-0.393,-0.437,0.03,1,0,0],[-0.192,-0.186,-0.243,0.98,0.015,-0.197],[-0.5,0.263,-0.248,-1,0,0],[-0.393,-0.362,-0.225,1,0,0],[0.257,-0.069,-0.44,0,0,1],[-0.5,-0.211,0.254,-1,0,0],[-0.485,0.5,0.176,0,1,0],[0.48,-0.411,-0.23,-1,0,0],[0.357,0.499,-0.418,0,1,0]],
 Q01:[[-0.157,-0.226,-0.073,0.002,-0.006,1],[0.285,-0.425,-0.288,1,0.027,-0.013],[-0.041,-0.178,-0.073,0.002,-0.006,1],[-0.011,0.011,-0.075,0.008,0.004,1],[0.171,-0.01,-0.061,0.037,0.004,0.999],[0.034,-0.083,-0.073,0.049,0.003,0.999],[-0.225,-0.116,-0.072,0.041,0.165,0.985],[-0.159,0.471,-0.233,-0.149,0.23,0.962],[0.101,-0.452,0.192,-0.06,0.998,0.032],[-0.43,-0.37,-0.17,-0.008,0.02,1],[0.273,0.218,-0.138,-0.006,-0.093,0.996],[-0.159,0.188,-0.126,-0.196,0.511,0.837],[-0.16,0.358,-0.235,-0.056,0.003,0.998],[-0.069,-0.087,-0.073,0.001,0.003,1],[-0.171,-0.017,-0.073,0.008,0.004,1],[0.176,-0.123,-0.166,-0.005,-0.058,0.998],[0.035,-0.201,-0.07,0.889,0.02,0.458],[-0.012,-0.295,-0.17,0.007,0.889,0.458],[0.284,0.097,-0.179,0.999,-0.009,0.042],[-0.09,-0.215,-0.073,0.002,-0.006,1],[-0.476,0.104,-0.164,0.053,-0.07,0.996],[-0.471,-0.218,-0.167,0.023,0.791,0.612],[-0.067,0.093,-0.168,0,-0.018,1],[0.286,-0.2,-0.296,1,-0.014,-0.015],[-0.308,0.26,-0.241,0.001,0.987,-0.164],[0.219,0.246,-0.146,-0.001,0.963,0.268],[-0.161,0.23,-0.122,-0.041,-0.001,0.999],[0.024,0.246,-0.142,-0.008,0.969,0.246],[0.06,-0.082,-0.164,0.002,0.01,1],[0.286,0.003,-0.28,1,-0.028,0.002],[-0.301,-0.148,-0.164,-0.012,0.048,0.999],[-0.184,-0.305,-0.166,-0.002,-0.017,1]],
 T01:[[0.012,0.008,0.053,0.167,0.313,0.935],[-0.459,-0.423,0.003,-0.986,-0.163,0.031],[-0.008,-0.342,0.481,-0.058,0.192,0.98],[-0.395,0.402,-0.114,-0.689,0.695,0.203],[-0.108,-0.381,0.472,-0.256,0.048,0.965],[0.017,-0.293,-0.444,0.006,0.99,-0.144],[0.425,0.385,-0.084,0.902,0.18,0.393],[-0.449,0.01,0.105,-0.873,0.354,0.336],[-0.389,0.138,0.111,-0.435,-0.057,0.898],[-0.416,-0.008,0.108,-0.016,-0.017,1],[0.157,-0.286,-0.106,-0.002,1,-0.005],[-0.304,-0.018,0.068,0.236,0.173,0.956],[-0.009,-0.162,0.144,-0.345,0.061,0.937],[0.337,0.128,0.127,0.07,-0.015,0.997],[0.368,0.266,0.111,0.073,-0.026,0.997],[0.426,-0.126,0.258,0.08,0.11,0.991],[-0.35,-0.075,0.135,-0.013,0.018,1],[-0.211,0.219,0.021,0.003,0.947,0.321],[-0.008,0.173,0.175,-0.068,0.136,0.988],[-0.49,-0.172,-0.091,-0.703,-0.121,0.701],[-0.203,-0.04,-0.091,0.043,0.001,0.999],[-0.48,0.152,-0.099,-0.912,0.409,0.039],[0.462,0.062,0.241,-0.276,0.201,0.94],[0.044,0.239,0.114,0.24,0.551,0.8],[0.295,-0.194,0.072,-0.999,-0.015,-0.052],[0.367,-0.012,0.123,0,0,1],[0.449,-0.329,-0.056,0.242,0.97,-0.022],[0.013,-0.168,0.178,0.022,0.061,0.998],[0.331,0.177,0.093,-0.342,0.926,0.157],[0.193,-0.292,-0.332,0.001,1,-0.008],[0.454,0.181,-0.061,0.99,-0.007,0.138],[-0.13,-0.29,0.293,-0.002,1,0.002]],
};
// Peças que são canto de sala (revisão 9; D10 desde a revisão 11): de costas só mostram parede lisa, então o giro fica entre 75° para cada lado da frente (os pontos estão todos nessa faixa).
const PECA_CANTO = {N18:1, N17:1, DESC_B:1, REL_B:1, GAL_B:1, D10:1, E02_B:1, P01_B:1};
const giroDaPeca = id => PECA_CANTO[id] ? ' min-camera-orbit="-75deg auto auto" max-camera-orbit="75deg auto auto"' : '';
// Peças com detalhe pequeno que é pista (revisão 11): a Galeria deixa chegar mais perto (5°) e mira um pouco acima do centro, para o zoom cair na máscara e a inscrição da testa dar para ler.
// A distância da câmera fica a mesma do enquadramento automático (8,32 m), para a peça não encolher na tela.
// Revisão 17: a Oficina elétrica (E02_B), a Recepção (P01_B) e a Central (S01_B) são salas inteiras; a câmera começa 18% (22% na Recepção, 20% na Central) mais perto do que o enquadramento automático, para os objetos das pistas encherem a tela (as paredes do canto seguem à vista).
// Revisão 17 (pontos escondidos): o zoom de todas as peças vai até 8° (era 12°), para que em qualquer peça dê para chegar perto o bastante de cada ponto.
const PECA_PERTO = {GAL_B:['5deg', '-0.12m 1.3m 0.03m', '0deg 75deg 8.32m'], E02_B:['8deg', 'auto auto auto', '0deg 75deg 82%'], P01_B:['8deg', 'auto auto auto', '0deg 75deg 78%'], S01_B:['8deg', 'auto auto auto', '0deg 75deg 80%']};
const pertoDaPeca = id => PECA_PERTO[id] ? ' min-field-of-view="'+PECA_PERTO[id][0]+'" camera-target="'+PECA_PERTO[id][1]+'" camera-orbit="'+PECA_PERTO[id][2]+'"' : ' min-field-of-view="8deg"';
// Qual lugar cada pista ocupa: sai da sala e do rótulo (iguais nas 5 noites), nunca do identificador da pista. Assim os pontos ficam no mesmo lugar, na mesma quantidade e na mesma ordem em qualquer defeito sorteado, e o par inocente ocupa o ponto do sinal.
const LOOP_VAGA = {};
function vagaDoPonto(salaId, lcp){
 if (typeof LC === 'undefined' || typeof LC_PID === 'undefined' || !LC_PID[lcp]) return -1;
 if (!LOOP_VAGA[salaId]) { const rot = [...new Set(LC.pistas.filter(p => p.sala === salaId).map(p => p.previa || p.id))].sort((a, b) => hashTxt(salaId+'|'+a) - hashTxt(salaId+'|'+b) || (a < b ? -1 : 1)); LOOP_VAGA[salaId] = Object.fromEntries(rot.map((r, i) => [r, i])); }
 const v = LOOP_VAGA[salaId][LC_PID[lcp].previa || lcp]; return v == null ? -1 : v;
}
/** Põe cada pista num ponto da peça. No Loop: lugar fixo na superfície (LOOP_PONTOS), escolhido pela sala e pelo rótulo. Fora dele: ao redor do centro, como antes. */
function pontosDaPeca(mv, clues){
 try {
  const c = mv.getBoundingBoxCenter(), d = mv.getDimensions();
  clues.forEach(clue => {
   const hs = mv.querySelector('[data-hs="'+clue.id+'"]'); if (!hs) return;
   const sl = clue.lcp ? (ROOMS.find(r => r.id === state.room) || {}).id : '', L = sl && LOOP_SALAS[sl] && LOOP_PONTOS[LOOP_SALAS[sl][2]], vaga = L ? vagaDoPonto(sl, clue.lcp) : -1;
   if (L && vaga >= 0) { const v = L[vaga % L.length];
    hs.dataset.position = (c.x + v[0]*d.x)+'m '+(c.y + v[1]*d.y)+'m '+(c.z + v[2]*d.z)+'m'; hs.dataset.normal = v[3]+'m '+v[4]+'m '+v[5]+'m';
   } else {
   const k = clue.lcp ? state.room+'|'+clue.name : clue.id, ang = hashTxt(k+'a')*Math.PI*2, alt = hashTxt(k+'b');
   const x = c.x + Math.cos(ang)*d.x*0.36, y = c.y + (alt-0.5)*d.y*0.7, z = c.z + Math.sin(ang)*d.z*0.36;
   hs.dataset.position = x+'m '+y+'m '+z+'m'; hs.dataset.normal = Math.cos(ang)+'m 0m '+Math.sin(ang)+'m';
   }
   mv.updateHotspot({ name: hs.slot, position: hs.dataset.position, normal: hs.dataset.normal });
  });
  if (!mv._sep) { mv._sep = true; let q = 0; const ag = () => { if (q) return; q = requestAnimationFrame(() => { q = 0; revelarPontos(mv); separarPontos(mv); }); };
   mv.addEventListener('camera-change', ag); new MutationObserver(ag).observe(mv, {subtree:true, attributes:true, attributeFilter:['data-visible','class']}); addEventListener('resize', ag); }
  [60, 400, 1200, 2500].forEach(t => setTimeout(() => { revelarPontos(mv); separarPontos(mv); }, t));
 } catch (e) { console.warn('pontos da peça', e); }
}
/** Separação mínima entre os pontos que estão à vista: nenhum par fica a menos de 44 px na tela. Só afasta o desenho do ponto; o lugar sorteado na peça continua o mesmo. */
const PONTO_MIN = 48;
function separarPontos(mv){
 try {
  if (!mv.isConnected) return;
  const cx = mv.getBoundingClientRect(); if (!cx.width) return;
  const todos = [...mv.querySelectorAll('.hs')], achar = mv.classList.contains('achar'), vis = todos.filter(h => h.classList.contains('on') && h.hasAttribute('data-visible') && (!achar || h.classList.contains('perto') || h.classList.contains('tocado')));
  todos.forEach(h => { if (!vis.includes(h) && h._dx != null) { h._dx = h._dy = null; h.style.translate = ''; } });
  const P = vis.map(h => { const r = h.getBoundingClientRect(), ox = h._dx || 0, oy = h._dy || 0; const bx = r.left + r.width / 2 - ox, by = r.top + r.height / 2 - oy; return {h, bx, by, x:bx, y:by}; });
  const m = 20, lim = p => { p.x = Math.min(cx.right - m, Math.max(cx.left + m, p.x)); p.y = Math.min(cx.bottom - m, Math.max(cx.top + m, p.y)); };
  P.forEach(lim);
  for (let k = 0; k < 60; k++) { let mexeu = false;
   for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
    let dx = P[j].x - P[i].x, dy = P[j].y - P[i].y, d = Math.hypot(dx, dy); if (d >= PONTO_MIN) continue;
    if (d < 0.5) { const a = (i * 2.4 + j) % 6.283; dx = Math.cos(a); dy = Math.sin(a); d = 1; }
    const e = (PONTO_MIN - d) / 2 + 0.5; P[i].x -= dx / d * e; P[i].y -= dy / d * e; P[j].x += dx / d * e; P[j].y += dy / d * e; lim(P[i]); lim(P[j]); mexeu = true; }
   if (!mexeu) break; }
  P.forEach(p => { const dx = Math.round(p.x - p.bx), dy = Math.round(p.y - p.by); if (dx !== (p.h._dx || 0) || dy !== (p.h._dy || 0)) { p.h._dx = dx; p.h._dy = dy; p.h.style.translate = (dx || dy) ? dx + 'px ' + dy + 'px' : ''; } });
 } catch (e) {}
}
// Revisão 17 · pontos escondidos (decisão do autor: "A ideia era procurar, investigar; se entra e já está ali, é clique e veja").
// No Loop nada fica aceso ao entrar. Um ponto só aparece, com um brilho que cresce, quando a câmera está perto o bastante E apontada para ele:
//  - perto: a meia altura do que a câmera enxerga na profundidade do ponto (distância × tan(campo de visão/2)) é menor que 45% da mesma medida no
//    enquadramento inicial da peça (é preciso chegar mais ou menos 2 vezes mais perto; vale igual para peça grande e pequena), e a câmera
//    aproximou de fato (a mesma medida no alvo da câmera abaixo de 60% da inicial: ao entrar, ou depois de "voltar ao começo", nada aparece);
//  - apontada: o ponto cai num círculo central de raio 30% do lado menor da janela da peça, de frente para a câmera e sem nada da peça na frente
//    (um raio lançado da tela até o ponto tem de bater nele: tolerância de 6% da maior medida).
// Ao se afastar (folga de 18% na distância e 20% no círculo), o ponto que não foi tocado volta a sumir. Achar põe o rótulo na lista da sala; examinar
// continua como antes (energia, tranca, prévia, minijogo). O que já está no caderno, ou foi achado numa volta anterior, aparece achado: a pessoa lembra.
// A regra é a mesma para todas as salas e as 5 causas: depende só do lugar do ponto (vagaDoPonto) e da câmera.
const ACHAR = { perto: 0.45, zoom: 0.6, folga: 1.18, raio: 0.30, folgaRaio: 1.2, bate: 0.06 };
const LC_ACHAR = true;   // chave dos pontos escondidos (revisão 17, lote 15, decisão do autor). false volta à sala antiga (pontos acesos, lista cheia)
const noAchar = () => LC_ACHAR && !!state && state.caseRules === 2;
const chaveAchado = (salaId, clue) => salaId + '|' + ((clue.lcp && typeof LC_PID !== 'undefined' && LC_PID[clue.lcp] && LC_PID[clue.lcp].previa) || clue.lcp || clue.id);
const noCaderno = clue => state.clues.some(x => x.id === clue.id);
function achouJa(clue){ if (!noAchar() || !clue.lcp) return true; return noCaderno(clue) || !!(state.achados && state.achados[chaveAchado(state.room, clue)]); }
function tocouJa(clue){ return noCaderno(clue) || !!(state.tocados && state.tocados[chaveAchado(state.room, clue)]); }
function marcarAchado(clue, tocou){
 if (!clue || !state.room) return; const k = chaveAchado(state.room, clue); let m = false;
 if (!(state.achados ||= {})[k]) { state.achados[k] = state.loop || 1; m = true; }
 if (tocou && !(state.tocados ||= {})[k]) { state.tocados[k] = state.loop || 1; m = true; }
 if (m) { save(); if (state.phase === 'playing') renderClues(); }
}
function revelarPontos(mv){
 try {
  if (!mv.isConnected || !mv.loaded || !mv.classList.contains('achar')) return;
  const r = mv.getBoundingClientRect(); if (!r.width || !r.height) return;
  const o = mv.getCameraOrbit(), t = mv.getCameraTarget(), fov = mv.getFieldOfView() * Math.PI / 180, d = mv.getDimensions(), D = Math.max(d.x, d.y, d.z) || 1;
  const C = [t.x + o.radius * Math.sin(o.phi) * Math.sin(o.theta), t.y + o.radius * Math.cos(o.phi), t.z + o.radius * Math.sin(o.phi) * Math.cos(o.theta)];
  if (!mv._vista0) mv._vista0 = o.radius * Math.tan(fov / 2);   // meia altura da vista no enquadramento inicial (medida na primeira vez, logo depois de a peça carregar)
  const zoom = o.radius * Math.tan(fov / 2) / mv._vista0, raio = ACHAR.raio * Math.min(r.width, r.height), cx = r.width / 2, cy = r.height / 2, pistas = mv._pistas || {};
  mv.querySelectorAll('.hs').forEach(h => {
   const clue = pistas[h.dataset.hs]; if (!clue) return;
   h.classList.toggle('tocado', tocouJa(clue));
   if (!h.classList.contains('on')) { h.classList.remove('perto'); return; }
   const q = mv.queryHotspot(h.slot); if (!q) return;
   const P = h.dataset.position.split(' ').map(parseFloat), estava = h.classList.contains('perto');
   const vista = Math.hypot(P[0] - C[0], P[1] - C[1], P[2] - C[2]) * Math.tan(fov / 2) / mv._vista0, dc = Math.hypot(q.canvasPosition.x - cx, q.canvasPosition.y - cy);
   let perto = !!q.facingCamera && zoom < ACHAR.zoom * (estava ? ACHAR.folga : 1) && vista < ACHAR.perto * (estava ? ACHAR.folga : 1) && dc < raio * (estava ? ACHAR.folgaRaio : 1);
   if (perto && !estava) { const hit = mv.positionAndNormalFromPoint(r.left + q.canvasPosition.x, r.top + q.canvasPosition.y); /* coordenadas da janela */ perto = !!hit && Math.hypot(hit.position.x - P[0], hit.position.y - P[1], hit.position.z - P[2]) < ACHAR.bate * D; }
   if (perto !== estava) h.classList.toggle('perto', perto);
   if (perto && !achouJa(clue)) marcarAchado(clue);
  });
 } catch (e) {}
}
// Controles da peça: tocar num lugar da peça mira a câmera nele e chega um pouco mais perto; "+" e "−" aproximam e afastam; o terceiro volta ao começo.
function controlesDaPeca(mv){
 if (mv._ctl) return; mv._ctl = true;
 const alvo0 = mv.getAttribute('camera-target') || 'auto auto auto', orb0 = mv.getAttribute('camera-orbit') || '0deg 75deg 105%', fov0 = mv.getAttribute('field-of-view') || 'auto';
 let ini = null;
 mv.addEventListener('pointerdown', e => { ini = e.target === mv && e.isPrimary ? {x:e.clientX, y:e.clientY, t:Date.now()} : null; });
 mv.addEventListener('pointerup', e => {
  if (!ini || e.target !== mv || Math.hypot(e.clientX - ini.x, e.clientY - ini.y) > 10 || Date.now() - ini.t > 450) { ini = null; return; }
  ini = null; const hit = mv.positionAndNormalFromPoint(e.clientX, e.clientY); if (!hit) return;
  mv.cameraTarget = hit.position.x + 'm ' + hit.position.y + 'm ' + hit.position.z + 'm'; mv.zoom(3);
 });
 const box = mv.parentElement.querySelector('.peca-ctl'); if (!box) return;
 box.querySelector('[data-zoom="mais"]').onclick = () => mv.zoom(4);
 box.querySelector('[data-zoom="menos"]').onclick = () => mv.zoom(-4);
 box.querySelector('[data-zoom="inicio"]').onclick = () => { mv.cameraTarget = alvo0; mv.cameraOrbit = orb0; mv.fieldOfView = fov0; };
}
// Para o simulador e os testes: alguém que procura acha um detalhe que ainda não tinha achado (a mesma regra de lista; não examina nada).
window.acharAoAcaso = () => { if (!noAchar() || !state.room || state.phase !== 'playing') return false; const fal = (scenarioClues()[state.room] || []).filter(c => c.lcp && !achouJa(c)); if (!fal.length) return false; marcarAchado(fal[Math.floor(Math.random() * fal.length)]); return true; };
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
  const hotspots = clues.map((clue, i) => '<button type="button" class="hs" slot="hotspot-'+i+'" data-hs="'+clue.id+'" data-visibility-attribute="visible" data-position="0m 0m 0m" data-normal="0m 1m 0m" aria-label="Detalhe achado na peça"></button>').join('');
  const achar = noAchar(), dicaAchar = state.achados && Object.keys(state.achados).length ? 'Gire e chegue perto. Toque no que achar para examinar.' : 'Gire e chegue perto: os detalhes só aparecem de perto.';
  if (room.livro) {
   panel.innerHTML = '<h3>'+room.name+'</h3><p>'+descSala(room.id)+'</p>'+
    '<div class="peca livro"><iframe title="Livro da sala" src="'+new URL('livro/index.html?embed=1&solo=1&capa='+encodeURIComponent(room.capa||'Livro|REGISTRO'), PECAS_URL.href.replace('pecas/','')).href+'" allow="xr-spatial-tracking; camera; fullscreen" loading="eager"></iframe></div>'+
    '<p class="dica">Arraste a página para virar a folha. O que a página mostra vai para o seu caderno. Se o livro não abrir, use a lista.</p>'+
    '<details class="lista-pistas"><summary>Examinar pela lista</summary><div class="clue-list">'+
    clues.map(botaoPista).join('')+
    '</div></details><div id="intervention" hidden></div>';
   panel.querySelectorAll('[data-clue]').forEach(button => { button.onclick = () => collect(button.dataset.clue); });
   panel.dataset.livro = '';
  } else
  panel.innerHTML = '<h3>'+room.name+'</h3><p>'+descSala(room.id)+'</p>'+
   '<div class="peca"><model-viewer'+(achar ? ' class="achar" disable-tap' : '')+' loading="eager" reveal="auto" src="'+new URL(room.peca+'.glb', PECAS_URL).href+'" alt="Peça da sala '+esc(room.name)+'" ar ar-modes="webxr scene-viewer quick-look" ar-scale="auto" ar-placement="floor" camera-controls touch-action="pan-y" interaction-prompt="none" shadow-intensity="0.6" exposure="1.15" field-of-view="26deg" max-field-of-view="45deg"'+pertoDaPeca(room.peca)+giroDaPeca(room.peca)+'>'+hotspots+'<button type="button" slot="ar-button" class="btn secondary ar-btn">Ver no ambiente</button></model-viewer>'+
   (achar ? '<div class="peca-ctl" role="group" aria-label="Aproximar e afastar"><button type="button" data-zoom="mais" aria-label="Aproximar">+</button><button type="button" data-zoom="menos" aria-label="Afastar">−</button><button type="button" data-zoom="inicio" aria-label="Voltar ao começo">⟲</button></div>' : '')+'</div>'+
   '<p class="dica">'+(achar ? dicaAchar : 'Gire a peça e toque nos pontos que brilham. As pistas ficam escondidas nela.')+'</p>'+
   '<details class="lista-pistas"><summary>'+(achar ? 'Examinar o que você achou' : 'Examinar pela lista')+'</summary><div class="clue-list">'+
   clues.map(botaoPista).join('')+(achar ? '<p class="lista-vazia">Nada achado ainda nesta sala.</p>' : '')+
   '</div></details><div id="intervention" hidden></div>';
  panel.querySelectorAll('[data-clue]').forEach(button => { button.onclick = () => collect(button.dataset.clue); });
  panel.querySelectorAll('[data-hs]').forEach(hs => { hs.onclick = () => { const c = clues.find(x => x.id === hs.dataset.hs); if (achar && c && !hs.classList.contains('perto') && !hs.classList.contains('tocado')) return; if (achar && c) marcarAchado(c, true); collect(hs.dataset.hs); }; });
  const lista = panel.querySelector('.lista-pistas');
  panel.insertBefore(lista, panel.querySelector('.peca'));
  if (room.livroLoop) {
   panel.querySelector('.dica').insertAdjacentHTML('afterend', '<div class="livro-loop"><div class="livro-vaga"><button type="button" class="livro-capa" data-abrir-livro><span class="livro-capa-t">'+esc(room.livroLoop.capa.split('|')[0])+'</span><span class="livro-capa-s">'+esc(room.livroLoop.capa.split('|')[1]||'')+'</span><span class="livro-capa-b"><span class="ic3d sm" aria-hidden="true"><img src="'+ICONE_URL('ui/caderno')+'" alt=""></span>'+esc(room.livroLoop.abrir)+'</span></button></div><div class="livro-acoes"></div><div class="livro-leitura"><div class="ll-cab"><b>Leitura</b></div><p>Abra o livro e vire a folha. O texto da página aparece aqui, em letra grande.</p></div></div>');
   panel.querySelector('[data-abrir-livro]').onclick = e => {
    const host = e.currentTarget.parentNode; if (host.querySelector('iframe')) return;
    e.currentTarget.insertAdjacentHTML('afterend', '<div class="peca livro"><iframe title="'+esc(room.livroLoop.abrir)+'" src="'+new URL('livro/index.html?embed=1&solo=1&capa='+encodeURIComponent(room.livroLoop.capa), PECAS_URL.href.replace('pecas/','')).href+'" allow="fullscreen" loading="eager"></iframe></div>');
    e.currentTarget.style.display = 'none'; panel.dataset.livro = ''; panel.dataset.par = '0';
   };
  }
  if (room.livroLoop) livroReserva(room, clues);
  if (room.id === 'sons' && state.caseRules === 2) gravadorMontar(panel, clues);
  lista.open = !!manterLista;
  const mv = panel.querySelector('model-viewer');
  if (mv) {
   mv._pistas = Object.fromEntries(clues.map(c => [c.id, c]));
   if (achar) controlesDaPeca(mv);
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
 const signalText = storySeconds >= 160 ? 'O alarme soa pelo museu.'
  : (storySeconds >= 120 && state.caseRules !== 2) ? 'Um estrondo ecoa. A iluminação principal se apaga.' : '';   // no Loop a luz cai com o raio, na hora sorteada: a faixa não anuncia (seria a hora de graça)
 if (signal.textContent !== signalText) signal.textContent = signalText;
 clues.forEach(clue => {
  const button = panel.querySelector('[data-clue="'+clue.id+'"]');
  const hs = panel.querySelector('[data-hs="'+clue.id+'"]');
  const registered = state.clues.some(item => item.id === clue.id);
  const wait = clue.time/300*state.duration-elapsed;
  const bl = !registered && wait <= 0 ? bloqueioPista(clue, storySeconds) : '';
  const fechado = clue.enigma&&!(state.resolvidos&&state.resolvidos[clue.id]);
  const custoN = typeof custoPista==='function' ? custoPista(clue) : 0;
  const pp = clue.lcp && typeof LC_PID !== 'undefined' ? LC_PID[clue.lcp] : null, repega = registered && !!pp && pp.tipo === 'objeto' && !!pp.objeto;   // objeto do caderno pode voltar para a mão
  // no Loop a lista não conta quanto falta: a contagem entregaria a hora do raio
  const label = repega?'pegar de novo · grátis':registered?'✓ no caderno':wait>0?(clue.lcp?'ainda não':'em '+fmt(wait)):bl?'travada':fechado?'🔒 abrir':(custoN?String(custoN):'grátis'), comEn = !repega && !registered && wait <= 0 && !bl && !fechado && !!custoN;   // comEn: o número ganha a miniatura da energia (CSS, data-en)
  const estado = repega?'livre':registered?'feita':wait>0?'espera':bl?'travada':'livre';
  button.disabled = (registered && !repega) || wait > 0; button.setAttribute('aria-disabled', String(!!bl));
  if (button.dataset.estado !== estado) button.dataset.estado = estado;
  const aria = clue.name+': '+(repega?'já está no caderno; pegar de novo não gasta energia':registered?'já está no caderno':wait>0?(clue.lcp?'ainda não apareceu':'aparece em '+fmt(wait)):bl?'travada: toque para saber por quê':fechado?'tem tranca':(custoN?'gasta '+custoN+' de energia':'não gasta energia'));
  if (button.getAttribute('aria-label') !== aria) button.setAttribute('aria-label', aria);
  if (button.lastElementChild.textContent !== label) button.lastElementChild.textContent = label;
  button.lastElementChild.toggleAttribute('data-en', comEn);
  if (hs) { hs.classList.toggle('on', wait <= 0 && !bl); hs.classList.toggle('ok', registered); hs.disabled = registered && !repega; if (clue.lcp) hs.classList.toggle('tocado', tocouJa(clue)); }
  const achado = achouJa(clue); if (button.hidden === achado) button.hidden = !achado;
  const fx = panel.querySelector('[data-faixa="'+clue.id+'"]');
   if (fx && fx.hidden === achado) fx.hidden = !achado;
  if (fx) { const l2 = registered ? 'ouvir de novo' : label; if (fx.dataset.estado !== estado) fx.dataset.estado = estado; if (fx.lastElementChild.textContent !== l2) fx.lastElementChild.textContent = l2; fx.lastElementChild.toggleAttribute('data-en', comEn && !registered); if (fx.getAttribute('aria-label') !== aria) fx.setAttribute('aria-label', aria); }
 });
 if (room.livro || room.livroLoop) atualizarLivro(clues, elapsed);
 { const vazia = panel.querySelector('.lista-vazia'); if (vazia) { const nada = !panel.querySelector('.clue-list [data-clue]:not([hidden])'); if (vazia.hidden === nada) vazia.hidden = !nada; } }
 { const mv = panel.querySelector('model-viewer.achar'); if (mv && mv.loaded) revelarPontos(mv); }
 { const dc = panel.querySelector('model-viewer.achar') && panel.querySelector('.dica'); if (dc) { const t = state.achados && Object.keys(state.achados).length ? 'Gire e chegue perto. Toque no que achar para examinar.' : 'Gire e chegue perto: os detalhes só aparecem de perto.'; if (dc.textContent !== t) dc.textContent = t; } }
 renderNoitePanel();
 const reserva = lcReservaDaSala();
 let lembrete = panel.querySelector('.loop-reserva');
 if (reserva && !lembrete) {
  lembrete = document.createElement('p');
  lembrete.className = 'loop-reserva muted';
  (panel.querySelector('.dica') || panel.querySelector('.lista-pistas')).after(lembrete);
 }
 if (lembrete?.textContent !== reserva && lembrete) lembrete.textContent = reserva;
 if (!reserva) lembrete?.remove();
 lcRenderEncaminhamento(panel);
 renderIntervention(room.id, storySeconds);
}
// Sala dos sons: o gravador. Cada pista da sala é uma faixa. Tocar numa faixa é examinar a pista (mesmo custo, mesma tranca, mesma hora);
// a gravação "toca" com a legenda aparecendo aos poucos, e o que já está no caderno pode ser ouvido de novo sem gastar nada. Não cria pista nem muda regra.
let gravTocando = null, gravTimer = 0, gravSom = false, gravAudio = null;
const gravTrechos = t => String(t).match(/[^.!?:…]+[.!?:…]+["”’')]*\s*|[^.!?:…]+$/g) || [String(t)];
function gravadorMontar(panel, clues){
 const dica = panel.querySelector('.dica'); if (!dica || panel.querySelector('.sons-deck')) return;
 dica.insertAdjacentHTML('afterend', '<div class="sons-deck"><div class="sd-topo"><span class="ic3d sm" aria-hidden="true"><img src="'+ICONE_URL('N17')+'" alt=""></span><b>Gravador</b><span class="sd-vu" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><button type="button" class="sd-som" aria-pressed="'+gravSom+'">'+(gravSom?'Som ligado':'Som desligado')+'</button></div>'+
  '<div class="sd-legenda" role="status"><b class="sd-nome">Escolha uma faixa</b><p class="sd-texto">Toque numa faixa para escutar. A legenda aparece aqui.</p></div>'+
  '<div class="sd-faixas">'+clues.map(c => '<button type="button" class="sd-faixa" data-faixa="'+c.id+'"><span>'+esc(c.name)+'</span><small></small></button>').join('')+'</div></div>');
 panel.querySelectorAll('[data-faixa]').forEach(b => { b.onclick = () => gravadorTocar(b.dataset.faixa); });
 panel.querySelector('.sd-som').onclick = e => { gravSom = !gravSom; e.currentTarget.setAttribute('aria-pressed', String(gravSom)); e.currentTarget.textContent = gravSom?'Som ligado':'Som desligado'; if (!gravSom) gravadorCalar(); };
 gravadorPintar();
}
function gravadorTocar(id){
 if (!state.clues.some(c => c.id === id)) collect(id);   // examinar a pista: as regras de sempre
 const c = state.clues.find(x => x.id === id);
 if (!c) { const b = document.querySelector('[data-faixa="'+id+'"]'); if (b && b.dataset.estado === 'espera') toast('Esta gravação ainda não existe. A noite precisa andar mais um pouco.'); return; }
 gravTocando = {id, ini:Date.now(), n:gravTrechos(c.text).length};
 clearInterval(gravTimer); gravTimer = setInterval(gravadorPintar, 250);
 gravadorCalar(); if (gravSom) gravadorChiado(gravTocando.n * 1.1 + .4);
 gravadorPintar();
}
function gravadorPintar(){
 const deck = document.querySelector('#roomPanel .sons-deck'), c = gravTocando && state.clues.find(x => x.id === gravTocando.id);
 if (!deck || !c || state.room !== 'sons') { clearInterval(gravTimer); gravadorCalar(); if (deck) deck.classList.remove('tocando'); return; }
 const tr = gravTrechos(c.text), parado = matchMedia('(prefers-reduced-motion: reduce)').matches, k = parado ? tr.length : Math.min(tr.length, 1 + Math.floor((Date.now() - gravTocando.ini) / 1100)), fim = k >= tr.length;
 const html = fim ? (window.lcGlos ? lcGlos(esc(c.text), true) : esc(c.text)) : esc(tr.slice(0, k).join('')) + '<i class="sd-cursor" aria-hidden="true"></i>';
 const nome = deck.querySelector('.sd-nome'), tx = deck.querySelector('.sd-texto');
 if (nome.textContent !== c.name) nome.textContent = c.name;
 if (tx.dataset.k !== String(k) + c.id) { tx.dataset.k = String(k) + c.id; tx.innerHTML = html; }
 deck.classList.toggle('tocando', !fim);
 deck.querySelectorAll('[data-faixa]').forEach(b => b.classList.toggle('on', b.dataset.faixa === c.id));
 if (fim) { clearInterval(gravTimer); }
}
function gravadorCalar(){ try { if (gravAudio) { gravAudio.stop(); gravAudio = null; } } catch (e) { gravAudio = null; } }
function gravadorChiado(seg){   // chiado de fita, baixinho, só para quem ligou o som
 try {
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; const ac = gravadorChiado.ac || (gravadorChiado.ac = new AC()); if (ac.state === 'suspended') ac.resume();
  const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * seg), ac.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (0.6 + 0.4 * Math.sin(i / 900));
  const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); src.buffer = buf; f.type = 'bandpass'; f.frequency.value = 2400; g.gain.value = 0.035; src.connect(f); f.connect(g); g.connect(ac.destination); src.start(); gravAudio = src;
 } catch (e) {}
}
// Livro folheável (museu/livro): cada pista vira uma página, escrita quando chega a hora dela; ao virar para a página, a pista é registrada.
// No Loop (sala com livroLoop): as páginas são só as pistas da lista do livro. Página sem custo entra no caderno ao ser virada; página que gasta energia fica fechada até a pessoa tocar em "Ler" embaixo do livro.
const livroPistas = (room, clues) => room.livroLoop ? room.livroLoop.ids.map(id => clues.find(c => c.lcp === id)).filter(Boolean) : clues;
// altura fixa para os botões "Ler": o máximo de páginas pagas num par de folhas (nada sobe nem desce ao abrir o livro ou virar a folha)
function livroReserva(room, clues){
 const host = $('roomPanel').querySelector('.livro-acoes'); if (!host) return;
 const cl = livroPistas(room, clues); let n = 0;
 for (let i = 0; i < cl.length; i += 2) n = Math.max(n, [cl[i], cl[i+1]].filter(c => c && custoPista(c) > 0).length);
 const h = n ? (n * 56 + (n - 1) * 6) + 'px' : '0px'; if (host.style.height !== h) host.style.height = h;
}
function livroAcoes(room, clues){
 livroReserva(room, clues);
 const panel = $('roomPanel'), host = panel.querySelector('.livro-acoes'); if (!host || !panel.querySelector('iframe')) return;
 const par = Number(panel.dataset.par || 0), cl = livroPistas(room, clues), tem = c => state.clues.some(x => x.id === c.id);
 const html = [cl[2*par], cl[2*par+1]].filter(c => c && !tem(c) && custoPista(c) > 0).map(c => '<button type="button" class="btn secondary wide" data-ler="'+c.id+'">Ler “'+esc(c.name)+'” · '+custoPista(c)+' de energia</button>').join('');
 livroLeitura(panel, [cl[2*par], cl[2*par+1]].filter(Boolean), tem);
 if (host.dataset.k !== html) { host.dataset.k = html; host.innerHTML = html; host.querySelectorAll('[data-ler]').forEach(b => { b.onclick = () => collect(b.dataset.ler); }); }
 livroGrande(panel);
}
// Página com a tábua desenhada e nenhum botão "Ler" sobrando: a leitura usa o vão reservado aos botões. A altura total do painel fica a mesma, então nada pula (revisão 11).
function livroGrande(panel){
 const host = panel.querySelector('.livro-acoes'), box = panel.querySelector('.livro-leitura'); if (!host || !box) return;
 const reserva = parseFloat(host.style.height) || 0, grande = reserva > 0 && !host.querySelector('[data-ler]') && !!box.querySelector('.lc-gl');
 host.style.display = grande ? 'none' : ''; box.classList.toggle('grande', grande); box.style.height = grande ? (192 + 8 + reserva) + 'px' : '';
}
// O livro em 3D é o objeto; a leitura fica embaixo dele, em letra de tela (a folha do livro fica pequena demais no celular). Uma página por vez.
function livroLeitura(panel, pags, tem){
 const box = panel.querySelector('.livro-leitura'); if (!box) return;
 const n = Math.min(Number(box.dataset.pg || 0), Math.max(0, pags.length - 1)), c = pags[n];
 const semTit = t => t.startsWith(c.name + ':') ? t.slice(c.name.length + 1).trim() : t;   // o título já está em cima: a leitura traz só o texto da página
 const txt = !c ? 'Folhas em branco.' : tem(c) ? (window.lcGlos ? lcGlos(esc(semTit(c.text)), true) : esc(semTit(c.text))) : custoPista(c) > 0 ? 'Página fechada. Para ler, toque no botão “Ler”.' : 'Vire a folha até aqui para ler.';
 const html = '<div class="ll-cab"><b>' + esc(c ? c.name : 'Página') + '</b>' + (pags.length > 1 ? '<span>' + pags.map((_, k) => '<button type="button" class="ll-pg' + (k === n ? ' on' : '') + '" data-llpg="' + k + '" aria-label="Página ' + (k ? 'da direita' : 'da esquerda') + '">' + (k ? 'direita' : 'esquerda') + '</button>').join('') + '</span>' : '') + '</div><p>' + txt + '</p>' + (c && c.lcp && tem(c) && window.lcGlifosHtml ? lcGlifosHtml(c.lcp) : '');   // a tábua da escrita antiga aparece aqui, embaixo do livro (na folha 3D a letra fica pequena demais)
 if (box.dataset.k === html) return; box.dataset.k = html; box.innerHTML = html; box.hidden = false;
 box.querySelectorAll('[data-llpg]').forEach(b => { b.onclick = () => { box.dataset.pg = b.dataset.llpg; box.dataset.k = ''; livroLeitura(panel, pags, tem); livroGrande(panel); }; });
}
function atualizarLivro(clues, elapsed){
 const panel = $('roomPanel'), fr = panel.querySelector('iframe'); if (!fr) return;
 const sl = sala(state.room);
 if (sl && sl.livroLoop) {
  const cl = livroPistas(sl, clues), tem = c => state.clues.some(x => x.id === c.id), chaveL = 'L' + cl.map(c => tem(c) ? 1 : 0).join('');
  livroAcoes(sl, clues);
  if (panel.dataset.livro === chaveL && fr.dataset.pronto === '1') return;
  const folhasL = cl.map(c => tem(c) ? {titulo:c.name, linhas:[c.text]} : {titulo:c.name, linhas:[custoPista(c) > 0 ? 'Página fechada. Para ler, toque no botão embaixo do livro.' : 'Vire a folha até aqui para ler.']});
  try { fr.contentWindow.postMessage({oi:'livro', evento:'paginas', folhas:folhasL}, location.origin); panel.dataset.livro = chaveL; } catch (e) {}
  return;
 }
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
 const room = sala(state.room);
 if (room?.livroLoop) {
  const todas = scenarioClues()[room.id], cl = livroPistas(room, todas); $('roomPanel').dataset.par = String(e.data.par);
  [2*e.data.par, 2*e.data.par+1].forEach(i => { if (cl[i] && !achouJa(cl[i])) marcarAchado(cl[i]); });   // virar a folha é achar as duas páginas
  [2*e.data.par, 2*e.data.par+1].forEach(i => { const c = cl[i]; if (c && custoPista(c) === 0 && !state.clues.some(x => x.id === c.id) && !bloqueioPista(c, 0)) collect(c.id); });
  livroAcoes(room, todas); return;
 }
 if (!room?.livro) return;
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
function collect(id){if(andando()){toast('Você ainda está chegando na sala.');return}if(state.phase!=='playing'||(window.coop?.now() ?? Date.now())>=state.endAt){tick();return}const q=scenarioClues()[state.room].find(x=>x.id===id);{const pp=q&&q.lcp&&LC_PID[q.lcp];if(pp&&pp.tipo==='objeto'&&pp.objeto&&lcTem(q.lcp)){lcS().mao={obj:pp.objeto,volta:state.loop};save();renderClues();toast('Você pegou de novo. Está na sua mão.');return}}if(!q||state.clues.some(x=>x.id===id)||state.duration-(state.endAt-(window.coop?.now() ?? Date.now()))/1000<q.time/300*state.duration)return;{const bl=bloqueioPista(q,(state.duration-(state.endAt-(window.coop?.now() ?? Date.now()))/1000)*300/state.duration);if(bl){toast(bl);return}}if(q.enigma&&!(state.resolvidos&&state.resolvidos[q.id])){abrirEnigma(q);return}if(q.lcp&&window.lcBancada&&lcBancada(q))return;if(!cobrarPista(q))return;const room=sala(state.room);state.clues.push({id:q.id,room:room.name,name:q.name,text:q.text,tipo:q.tipo,fatos:q.fatos,loop:state.loop,etq:q.etq||''});if(q.lcp)lcAposColetar(q);if(q.trava){(state.trava ||= {})[state.loop+':'+state.room]=q.id}save();renderClues();renderJournal();toast(q.trava?'Pista no caderno. Os seguranças estão a caminho!':'Pista guardada no caderno')}
function renderJournal(){
 const clues=state.clues||[];$('countBadge').textContent=clues.length;
 $('journalPreview').innerHTML=clues.length?clues.slice(-3).reverse().map(c=>'<div class="preview-item">'+fichaSala(c.room,'sm')+'<div>'+esc(c.name)+'<small>'+esc(c.room)+'</small></div></div>').join(''):'<p class="muted">O que você achar aparece aqui.</p>';
 const nb=document.getElementById('lcBarN'); if(nb) nb.textContent=clues.length;
 $('journalList').innerHTML=clues.length?clues.map(c=>'<article class="journal-item '+etqClasse(c.etq)+'">'+fichaSala(c.room)+'<div><b>'+esc(c.room)+' · Volta '+c.loop+(c.tipo?' · '+esc(c.tipo):'')+'</b><strong class="ji-nome">'+esc(c.name)+'</strong><p>'+(window.lcGlos?lcGlos(esc(c.text),true):esc(c.text))+'</p></div>'+(window.lcGlifosHtml?lcGlifosHtml(c.id):'')+'</article>').join(''):'<p class="muted">Seu caderno ainda está vazio.</p>';
 if (!window.coop && state.archive?.length) {
  $('journalList').insertAdjacentHTML('beforeend', state.archive.map(key => {
   const axis = ANSWER_AXES.find(item=>item.key===key);
   return '<article class="journal-item">'+fichaSala('')+'<div><b>Arquivo de fechamento · '+esc(axis.title)+
    '</b><p>'+esc(partialRecord(key))+'</p></div></article>';
  }).join(''));
 }
 const path = timePath();
 const figureRoom = sala(current().room).name;
 const roomName = id => sala(id).name;
 const nearingIntervention = hasLiveFinal() && (state.loop === 5 || (state.loop === 4 && state.phase === 'between'));
 const timeLead = nearingIntervention
  ? 'Compare os comandos no ambiente '+roomName(path.room)+'. Um atua sobre o retorno e o outro altera apenas um efeito secundário.'
  : 'Há um procedimento de encerramento em '+roomName(path.source)+'.';
 const hs = state.caseRules === 2 ? [
  'São duas perguntas: por que a máquina travou e o que aconteceu nesta noite. Cada uma pede provas diferentes.',
  'Para a máquina: junte 2 sinais de tipos diferentes e 1 leitura normal. Depois abra a Máquina e escolha o defeito.',
  'Para a noite: olhe a peça da Galeria de perto, veja a câmera da Central e junte a escala com o bilhete do armário.'
 ] : [
  'Separe o que aconteceu com o acervo, o disparo do alarme e o retorno do tempo. Procure uma fonte para cada fato.',
  'A Sala das coleções ou a Conservação ajuda a explicar o acervo. A Segurança e a Sala técnica ajudam a explicar o alarme.',
  'Procure a figura imóvel em '+figureRoom+'. '+timeLead
 ];
 $('hints').innerHTML=hs.slice(0,state.hints).map((x,i)=>'<p><strong>Dica '+(i+1)+':</strong> '+esc(x)+'</p>').join('');$('getHint').disabled=state.hints>=3;
}
function tick(){if(window.coop){window.coop.tick();return}if(!state||state.phase!=='playing')return;const old=state.remaining;state.remaining=Math.max(0,(state.endAt-Date.now())/1000);$('timer').textContent=fmt(state.remaining);$('fictionTime').textContent=museumTime();if(Math.ceil(old)!==Math.ceil(state.remaining))renderClues();else if(state.loop===5 && state.room)renderIntervention(state.room,elapsedStoryTime(window.coop?.now() ?? Date.now()));if(state.remaining<=0)finishLoop()}
function renderBetweenPlan(){
 const novas = state.clues.filter(pista => pista.loop === state.loop).length;
 $('betweenProgress').textContent = novas === 1 ? '1 pista nova nesta volta.'
  : novas ? novas + ' pistas novas nesta volta.' : 'Nenhuma pista nova nesta volta.';
 $('betweenShare').classList.toggle('hidden', !window.coop || state.loop === 5);
 document.querySelectorAll('#betweenDots b').forEach((b, i) => b.classList.toggle('on', i < state.loop));
 if (state.caseRules !== 2) return;
 const s = lcS();
 const T = (ic, txt) => [ic, txt];
 const assunto = s.diag ? T('M03', 'Você já tem o diagnóstico. Veja o que o conserto pede em Máquina, aba Atividades.')
  : T('ui/alvo', 'Junte 2 sinais de tipos diferentes e 1 leitura normal.');
 const instrucoes = {
  1: [T('T01', 'Volta 2: teste um palpite na Máquina.'), assunto],
  2: [T('M03', 'Volta 3: hora de preparar o conserto.'), T('T01', 'Veja o que você precisa deixar pronto em outra sala.'), T('ui/dupla', 'Sem dupla? Alguns consertos pedem duas voltas. Veja "Sem dupla?" na Máquina, aba Atividades.')],
  3: [T('T01', 'Volta 4: ensaie o conserto. Ainda não vale.'), T('ui/dupla', 'Sem dupla, esta é a última volta para deixar pronto o que o conserto pede em duas voltas.')],
  4: window.coop
   ? [T('T01', 'Volta 5: agora vale. Quem opera a Máquina?'), T('P01', 'Quem leva as 3 provas para a Recepção?'), T('ui/energia', 'Guarde energia para a sua parte.')]
   : [T('T01', 'Volta 5: agora vale.'), T('ui/caderno', 'Escolha o que o seu caderno deixa você terminar.'), T('P01', 'Confira as provas, a sala e a energia antes de começar.')],
  5: [T('ui/caderno', 'As voltas terminaram. Veja o desfecho da sua investigação.')]
 };
 $('betweenHint').innerHTML = (state.loop === 4 && window.coop && typeof lcPapeisHtml === 'function' ? lcPapeisHtml() : '') + (instrucoes[state.loop] || []).map(([ic, txt]) => '<p class="bs-tarefa"><span class="ic3d sm" aria-hidden="true"><img src="'+ICONE_URL(ic)+'" alt=""></span><span>'+esc(txt)+'</span></p>').join('');
}
function fecharJanelas(aviso){
 const abertas = document.querySelectorAll('#lcBancada[open], #lcDialog[open], #journalDialog[open]'); if (!abertas.length) return;
 const tinhaMini = !!document.querySelector('#lcBancada[open]');
 abertas.forEach(d => { try { d.close(); } catch (e) {} });
 if (aviso && tinhaMini) toast('A volta acabou. A pista fica para a próxima.');
}
window.fecharJanelas = fecharJanelas;
function renderBetween(){
 fecharJanelas(true);
 const finished = state.loop === 5;
 const interrompeu = state.caseRules === 2 ? lcS().conserto === 5 : brokeLoop();
 $('betweenEyebrow').innerHTML = '<span></span> '+(finished && interrompeu ? 'O TEMPO SEGUIU' : 'O TEMPO RETORNOU');
 $('betweenCount').textContent = state.clues.length;
 $('betweenLoop').textContent = state.loop+' / 5';
 $('betweenTitle').textContent = finished
  ? (interrompeu ? 'A noite andou.' : 'A noite voltou ao começo.')
  : 'Você se lembra.';
 $('betweenStory').textContent = finished
  ? (interrompeu ? 'A máquina parou de puxar o tempo de volta. O museu segue em frente.' : 'O tempo voltou mais uma vez. Use o que você achou para fechar a noite.')
  : (state.caseRules === 2 ? ENTRE_VOLTAS[Math.min(state.loop,ENTRE_VOLTAS.length)-1] : ENTRE_VOLTAS[0]);
 $('betweenHint').textContent = finished ? (state.caseRules === 2 && state.clues.length < 3 ? 'Seu caderno vai com você para o desfecho.' : 'Seu caderno vai com você para o desfecho.')
  : brokeLoop() ? 'Você já parou a máquina. Continue procurando para entender a noite e ajudar a turma.'
  : state.loop >= 2 ? 'Faltou pista? Peça uma dica no caderno.'
  : 'A próxima sala pode confirmar ou mudar o seu palpite.';
 $('nextLoop').textContent = finished ? 'Ir para o desfecho' : 'Escolher a próxima sala';
 if (finished && state.caseRules === 2) $('nextLoop').textContent = 'Ir para o desfecho';
 renderCombos();
 renderBetweenPlan();
 show('between');
}
function finishLoop(){
 fecharJanelas(true);
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
 fecharJanelas(false);
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
 if (state.caseRules === 2) { panel.classList.add('hidden'); return; }   // no Loop não existe o arquivo do caso antigo
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
 if (state && state.caseRules === 2) return out;   // no Loop não há formulário de perguntas: o desfecho vem da Máquina
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
 if (state && state.caseRules === 2) return;
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
  ? 'Veja até onde a sua investigação chegou.'
  : 'Use as pistas do dossiê para reconstruir a noite.';
 $('reflectionForm').hidden = central;
 { const fr = $('finalResumo'); if (fr) fr.innerHTML = central && typeof lcFichasFinal === 'function' ? lcFichasFinal() : ''; }
 if (central) { $('answerFields').innerHTML = ''; renderArchive(); return; }   // o Loop não monta as 8 perguntas do caso antigo, nem escondidas
 $('answerFields').innerHTML = '<p class="certeza-note">Escolha o quanto você confia em cada resposta. Com mais certeza você ganha mais pontos se acertar, mas perde pontos se errar. Em Quem e Por quê, aponte a pista que sustenta a resposta: sem ela, vale como palpite.</p>'+
  ANSWER_AXES.map(axis => '<div class="answer-field"><label for="'+axis.key+'">'+esc(axis.question)+
  '</label><select id="'+axis.key+'">'+options(axis.options)+'</select>'+certezaControl(axis)+supportControl(axis)+'</div>').join('');
 fillAnswers(state.draft);
 renderArchive();
 $('answerFields').insertAdjacentHTML('beforeend', renderTeoria());
}
function submit(event){
 event.preventDefault();
 fecharJanelas(false);
 const answers = selectedAnswers();
 if(window.coop){window.coop.move('result',answers);return}
 state.answers = answers;
 state.phase = 'result';
 save();
 renderResult();
 show('result');
}
// Caderno do museu: lembra, neste aparelho, quais noites já foram visitadas e a melhor pontuação de cada uma.
const CADERNO_KEY = 'mosaico-loop-caderno-v1';
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
 if (aberto) plantaMostrar();   // a planta abre no andar onde você está
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
const TV_SALA = (id, on) => '<span class="tv-room'+(on?' on':'')+'"><img src="'+ICONE_URL(LOOP_SALAS[id][2])+'" alt="">'+((typeof LC_CURTO !== 'undefined' && LC_CURTO[id]) || LOOP_SALAS[id][0].split(' · ').pop())+'</span>';
const TOUR = [
 {c:'Noite de véspera no museu. Amanhã abre a maior exposição da casa. Na Galeria, o curador Aurélio não tira o olho da peça principal: "Está linda, não está?" Ele não parece ter certeza.',t:'Escolha uma sala', d:'Toda volta começa no Saguão. Toque numa sala para ir até lá.',
  v:()=>'<div class="tv-planta" aria-hidden="true"><div class="tvp-orelhas"><i class="on">2º andar</i><i>1º</i><i>Térreo</i><i>Subsolo</i></div><div class="tvp-folha"><span class="tvp-esc"></span><span class="tvp-sag"><img src="'+ICONE_URL('ui/saguao')+'" alt=""><b>Saguão superior</b><i class="tvp-pino"></i></span><span class="tvp-gal"><img src="'+ICONE_URL(LOOP_SALAS.galeria[2])+'" alt=""><b>Galeria</b></span></div></div><p class="tv-floor">Saguão superior · você começa aqui</p>'},
 {c:'Cada sala guarda um objeto. Gire, chegue perto. O que importa quase nunca está de frente.',t:LC_ACHAR?'Gire e chegue perto':'Gire a peça', d:LC_ACHAR?'Nada fica aceso. Gire, toque num lugar e aproxime: de perto, um brilho aparece. Toque nele para examinar.':'Toque nos pontos que brilham. Cada um guarda uma pista. Eles aparecem com o tempo.',
  v:()=>'<div class="tv-piece"><img class="tv-obj3d" src="'+ICONE_URL('V11')+'" alt="">'+(LC_ACHAR?'<b class="tv-lupa"></b><b class="tv-dot d2 tv-cresce"></b></div><p class="tv-floor">Arraste para girar · pinça ou + para chegar perto</p>':'<b class="tv-dot d1"></b><b class="tv-dot d2"></b><b class="tv-dot d3"></b></div><p class="tv-floor">Arraste para girar · toque no brilho</p>')},
 {c:'Na Central, o Braga empurra uma xícara: "Chuva feia, hein? Pega um café." Daqui a cinco minutos ele vai dizer isso de novo, sem lembrar que já disse.',t:'O tempo corre', d:'Cada volta tem 5 minutos. Quando acaba, o tempo volta. O museu esquece. Você lembra.',
  v:()=>'<div class="tv-clock"><span>VOLTA 2 DE 5</span><strong>04:12</strong><small>Minuto da volta · 0:48</small></div><div class="tv-bar"><i></i></div>'},
 {c:'O museu esquece. O caderno lembra. O chão guarda. O que você anota volta com você. O que você deixa no chão fica lá.',t:'Seu caderno', d:'Tudo que você acha vai para o caderno. O que alguém conta nem sempre é fato.',
  v:()=>'<div class="tv-dossie"><p><span class="tv-chip obs">Observação</span> O que você viu</p><p><span class="tv-chip rel">Relato</span> O que alguém contou</p><p><span class="tv-chip reg">Registro</span> O que está escrito</p></div>'},
 {c:'Cinco minutos depois, o museu inteiro recomeça. No Subsolo, uma máquina ligada que ninguém consegue desligar.',t:'A Máquina', d:'Descubra por que a máquina travou. Na 5ª volta, o conserto vale.',
  v:()=>'<div class="tv-panel"><b><img class="tv-mini" src="'+ICONE_URL('T01')+'" alt="">A Máquina</b><span class="tv-select">2 sinais + 1 leitura normal</span><span class="tv-btn">Escolher o defeito</span></div><p class="tv-floor">1 tentativa por volta</p>'},
 {c:'Na última volta, o telão da Recepção espera. Para fechar a noite, você precisa de provas, não de palpite.',t:'Revelar', d:'Na última volta, com 3 provas no caderno, vá à Recepção e diga o nome. É uma tentativa só.',
  v:()=>'<div class="tv-rooms">'+TV_SALA('galeria')+TV_SALA('seguranca')+TV_SALA('limpeza')+TV_SALA('recepcao',1)+'</div><p class="tv-floor">3 provas · 1 nome · 1 tentativa</p>'}
];
function montarTour(){
 const host = $('tour');
 if (!host) return;
 let i = 0;
 host.innerHTML = '<div class="tour-card"><p class="tour-step" aria-live="polite"></p><div class="tour-visual" aria-hidden="true"></div><h3 class="tour-title"></h3><p class="tour-text"></p><p class="tour-cena"></p></div>'+
  '<div class="tour-nav"><button class="btn secondary tour-prev" type="button">Voltar</button><span class="tour-dots" aria-hidden="true"></span><button class="btn primary tour-next" type="button">Próximo</button></div>';
 const q = sel => host.querySelector(sel);
 function draw(){
  const s = TOUR[i];
  q('.tour-step').textContent = 'Como jogar · '+(i+1)+' de '+TOUR.length;
  q('.tour-cena').textContent = s.c;
  q('.tour-visual').innerHTML = typeof s.v === 'function' ? s.v() : s.v;
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
 $('betweenStory').textContent=ENTRE_VOLTAS[0];
 $('nextLoop').classList.remove('hidden');
 $('coopBegin').classList.add('hidden');
 $('answerFields').classList.remove('hidden');
 $('answerForm').querySelector('button[type=submit]').classList.remove('hidden');
 $('final').querySelector('.large').textContent='O que aconteceu? Use as pistas do caderno e responda às 8 perguntas. Se não souber, pode deixar em aberto.';
 $('replay').textContent='Jogar outra vez';
const prev=load(storageKey,null);if(prev&&Number.isInteger(prev.caseIndex)&&CASES[prev.caseIndex]&&prev.loop>=1&&prev.loop<=5){state=prev;$('speed').value=String(state.duration);if(state.phase==='playing'&&Number.isFinite(state.endAt)){state.remaining=Math.max(0,(state.endAt-Date.now())/1000);renderGame();show('game');if(state.remaining<=0)finishLoop();else timerHandle=setInterval(tick,250)}else if(state.phase==='choose'){renderGame();show('game')}else if(state.phase==='between'){renderBetween()}else if(state.phase==='final'){renderForm();show('final')}else if(state.phase==='result'&&state.answers){renderResult();show('result')}else{state=null;show('start')}}else show('start');
}
restoreSolo();
