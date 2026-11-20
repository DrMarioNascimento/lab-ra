// Conteúdo do Loop (cópia própria de ../game.js, só os dados e a montagem das pistas).
// Usado pelo telão e pelo simulador. Se o conteúdo mudar em game.js, gere este arquivo de novo (sala/gerar-conteudo.sh).
const ROOMS = [
  {id:'galeria', name:'Galeria principal', icon:'▧', sub:'Obras e vitrines'},
  {id:'conservacao', name:'Conservação', icon:'◇', sub:'Acervo e registros'},
  {id:'seguranca', name:'Segurança', icon:'◉', sub:'Alarmes e ocorrências'},
  {id:'eletrica', name:'Sala técnica', icon:'⌁', sub:'Energia e equipamentos'},
  {id:'recepcao', name:'Recepção', icon:'♧', sub:'Chegadas e convidados'},
  {id:'corredor', name:'Corredor de serviço', icon:'▥', sub:'Passagens e caixas'},
  {id:'prototipo', name:'Galeria do tempo', icon:'◷', sub:'Protótipo e retorno'},
  {id:'deposito', name:'Sala das coleções', icon:'▤', sub:'Inventário e movimentações'},
  {id:'auditorio', name:'Auditório', icon:'▱', sub:'Programa e bastidores'},
  {id:'patio', name:'Pátio de luz', icon:'☼', sub:'Vista para a circulação'},
  {id:'atelie', name:'Ateliê de descobertas', icon:'✧', sub:'Ensaio e registros técnicos'}
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
  guarda:'O uniforme e o rádio indicam que a figura escondida é um guarda; ele diz ter se escondido com medo.',
  artista:'Uma credencial e o programa do evento indicam que a figura é uma artista preparada como estátua viva.',
  visitante:'Um ingresso e um relato identificam a figura como um visitante que entrou onde não deveria.',
  restauradora:'Uma identificação e uma ficha de trabalho indicam que a figura é uma restauradora.',
  funcionario:'Uma credencial de serviço identifica a figura como uma funcionária que preparava uma surpresa.'
};
const roomDescriptions={galeria:'Vitrines, pedestais e obras aguardam o fechamento. Algo chama sua atenção entre os registros da exposição.',conservacao:'Fichas de acervo e materiais de trabalho contam uma parte da história dos objetos.',seguranca:'Um painel registra as ocorrências do edifício. O alarme é apenas um dos sinais daquela noite.',eletrica:'A luz de emergência revela equipamentos e anotações técnicas. Nem toda falha tem a mesma causa.',recepcao:'Convidados, entregas e registros de entrada se cruzam perto da saída.',corredor:'Pelo corredor passam pessoas e caixas. Olhar a passagem não revela, sozinho, toda a intenção.'};
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const extraDescriptions = {
  prototipo: 'O protótipo da exposição fica ligado ao relógio de demonstração.',
  deposito: 'Etiquetas e fichas de movimentação documentam o trajeto de cada peça.',
  auditorio: 'Na coxia, a equipe prepara o encerramento da noite.',
  patio: 'O pátio oferece vista para a circulação entre as galerias.',
  atelie: 'A equipe deixou aqui a bancada de ensaio e um manual de demonstração.'
};
Object.assign(roomDescriptions, extraDescriptions);

function makeClues(c){
 const evidence=labels[c.alarm][1],fig=figures[c.figure],room=ROOMS.find(r=>r.id===c.room).name;
 return {
  galeria:[
   {id:'gal1',name:'Observar a montagem',time:0,text:'A ficha da exposição menciona '+c.subject+'. '+c.clue.charAt(0).toUpperCase()+c.clue.slice(1)+'.'},
   {id:'gal2',name:'Examinar o registro de acervo',time:90,text:'Um registro da galeria informa: '+c.detail+'.'},
   {id:'gal3',name:'Procurar sinais da figura',time:180,text:c.room==='galeria'?fig:'Um registro de ronda indica uma figura imóvel em '+room+'.'}],
  conservacao:[
   {id:'con1',name:'Ler a ficha de conservação',time:0,text:'A ficha referente a '+c.subject+' anota que '+c.detail+'.'},
   {id:'con2',name:'Examinar a observação técnica',time:90,text:'Na pasta consta: '+c.clue+'.'},
   {id:'con3',name:'Consultar o plano de prevenção',time:180,text:'Uma nota recomenda: '+ACTIONS[c.action]},
   ...(c.room==='conservacao'?[{id:'con4',name:'Conversar com a figura imóvel',time:180,text:fig}]:[])],
  seguranca:[
   {id:'seg1',name:'Ler o registro do alarme',time:165,text:evidence},
   {id:'seg2',name:'Consultar a ocorrência',time:195,text:ALARMS[c.alarm]+' O registro não permite concluir sozinho o que ocorreu com o acervo.'},
   {id:'seg3',name:'Verificar a ronda',time:180,text:c.room==='seguranca'?fig:'A ronda menciona uma figura imóvel em '+room+'.'}],
  eletrica:[
   {id:'ele1',name:'Examinar o painel',time:165,text:evidence},
   {id:'ele2',name:'Ler a anotação técnica',time:90,text:'Há uma anotação: '+c.clue+'. Ela deve ser relacionada a outros registros.'},
   {id:'ele3',name:'Analisar o protótipo',time:180,text:'O registrador da sala técnica aponta um pulso do protótipo às 21h57, antes do alarme. O manual prevê outro pulso às 22h. O comando de suspensão fica na Galeria do tempo.'}],
  recepcao:[
   {id:'rec1',name:'Consultar a movimentação',time:0,text:'A recepção recebeu uma anotação sobre '+c.subject+'. '+c.clue.charAt(0).toUpperCase()+c.clue.slice(1)+'.'},
   {id:'rec2',name:'Examinar o livro de ocorrências',time:90,text:'Na ocorrência consta: '+c.detail+'.'},
   {id:'rec3',name:'Observar a figura',time:180,text:c.room==='recepcao'?fig:'Uma pessoa da recepção comenta que havia uma figura imóvel em '+room+'.'}],
  corredor:[
   {id:'cor1',name:'Examinar o registro de passagem',time:0,text:'No registro de passagem: '+c.detail+'.'},
   {id:'cor2',name:'Ler o recado da equipe',time:90,text:'O recado sugere uma ação: '+ACTIONS[c.action]},
   {id:'cor3',name:'Verificar a figura imóvel',time:180,text:c.room==='corredor'?fig:'Um recado indica que alguém viu uma figura imóvel em '+room+'.'}],
  prototipo:[
   {id:'pro1',name:'Ler a placa da demonstração',time:0,text:'A demonstração guarda o instante de referência, às 21h55. Ao terminar, o protótipo deveria apenas projetar uma imagem desse instante.'},
   {id:'pro2',name:'Observar o primeiro pulso',time:120,text:'Às 21h57, o relógio do protótipo recua por um segundo. O estrondo vem da galeria e a luz cai. O alarme soa mais tarde.'},
   {id:'pro3',name:'Conferir o comando de suspensão',time:180,text:'O manual indica que suspender a demonstração antes das 22h interrompe o pulso de retorno. O comando não altera o que já aconteceu nas outras salas.'}],
  deposito:[
   {id:'dep1',name:'Consultar o inventário',time:0,text:'A ficha de movimentação menciona '+c.subject+'.'},
   {id:'dep2',name:'Conferir a ficha de transferência',time:90,text:'Uma anotação de transferência registra que '+c.detail+'.'}],
  auditorio:[
   {id:'aud1',name:'Ler o aviso da produção',time:0,text:'A produção pede que as equipes de montagem e segurança confirmem separadamente suas tarefas de encerramento.'},
   {id:'aud2',name:'Consultar a mensagem da produção',time:90,text:'Uma mensagem sobre '+c.subject+' foi arquivada na pasta de encerramento: '+c.clue+'.'}],
  patio:[
   {id:'pat1',name:'Comparar a iluminação das alas',time:120,text:'O apagão atinge as galerias às 21h57. O aviso sonoro ainda não começou.'},
   {id:'pat2',name:'Ouvir a equipe da ronda',time:180,text:'Da circulação, a equipe localizou a figura imóvel em '+room+'.'}],
  atelie:[
   {id:'ate1',name:'Ler o caderno de ensaio',time:0,text:'O ensaio diferencia o pulso que fixa a referência do pulso que fecha a demonstração. O retorno acontece no segundo pulso.'},
   {id:'ate2',name:'Ler a instrução de encerramento',time:180,text:'Em caso de repetição, use Suspender demonstração na Galeria do tempo antes do pulso final, às 22h.'}]
 }
}
export { ROOMS, EVENTS, ALARMS, FIGURES, ACTIONS, CASES, labels, figures, makeClues, esc };
