/* Loop · noites (dados do roteiro; ver docs/ROTEIRO.md). Texto de jogo: segunda pessoa, sem marca de gênero.
   Cada noite tem o mesmo índice de CASES. A verdade de cada caso não muda; aqui ficam a pergunta principal,
   as pistas de rotina (por horário), uma variação por versão, as combinações entre voltas, o caixote e o bilhete de T. */
const FERRAMENTAS = {
 prancheta:{nome:'Prancheta de registros', icone:'📋', texto:'Ler registros não gasta energia.', livre:'Registro'},
 radio:{nome:'Rádio', icone:'📻', texto:'Ouvir relatos pelo rádio não gasta energia.', livre:'Relato'},
 kit:{nome:'Kit de inspeção', icone:'🔍', texto:'Examinar etiquetas e suportes não gasta energia.', livre:'Observação'},
 planta:{nome:'Planta do museu', icone:'🗺️', texto:'Planeja o trajeto: +2 de energia em cada volta.', extra:2}
};
const CARGAS_BASE = 5, ERROS_CAIXOTE = 3;
// [sala, segundos da noite (0 a 300), nome da pista, texto, tipo]
const NOITES = [
 {p:'Por que a peça saiu da vitrine?', intro:'Uma peça de vidro não está na vitrine. Você vai descobrir por que ela saiu e quem sabia.',
  r:[['conservacao',30,'Ler a ficha da base','A ficha anota uma fissura nova na base da vitrine, às 21h56.','Registro'],['seguranca',150,'Ver o alarme','O sensor da vitrine falhou na hora da troca. Ninguém arrombou nada.','Registro']],
  v:[['recepcao',60,'Ouvir um recado','Alguém da equipe avisou na recepção: "A peça de vidro foi para a bancada. Cuidado com a base."','Relato'],['auditorio',60,'Ler o roteiro','O roteiro do dia lista a vitrine de vidro como "em manutenção".','Registro']],
  bil:'Na primeira vez, achei que alguém tinha levado a peça. — T.'},
 {p:'Qual dos dois retratos foi movido?', intro:'Dois retratos parecem iguais. Um é o original e o outro é uma cópia temporária. Você vai descobrir qual está onde.',
  r:[['conservacao',40,'Ler a ordem de serviço','A ordem de serviço diz que a moldura do original será conferida e que uma cópia ocupa o lugar.','Registro'],['recepcao',120,'Observar o público','Visitantes comentam que o retrato "está diferente". A moldura da cópia é mais nova.','Observação']],
  v:[['galeria',70,'Examinar a moldura','Só a moldura do original tem uma marca de restauro no canto.','Observação'],['corredor',70,'Ler o recado','Um recado pede que ninguém mexa na moldura até o fim da conferência.','Registro']],
  bil:'Na segunda, vi que todos olhavam para lugares diferentes. — T.'},
 {p:'O que confirmar antes de agir?', intro:'Uma caixa tem duas etiquetas e foi parar em outro lugar. Você vai descobrir qual vale antes de alguém mexer nela.',
  r:[['recepcao',30,'Ver a entrega','Às 21h55min30, uma caixa chega à recepção com duas etiquetas coladas. Quem recebeu leu só a de cima.','Observação'],['conservacao',150,'Examinar a caixa','A caixa chegou aqui com duas etiquetas. A de baixo é a mais recente.','Observação'],['seguranca',180,'Ler o registro de entrega','O corredor ficou parado às 21h58 por causa de um teste. O registro de entrega mostra o trajeto da caixa.','Registro']],
  v:[['deposito',60,'Conferir a agenda','A agenda do dia lista esta caixa para o depósito, não para a conservação.','Registro'],['auditorio',60,'Ler a nota de reimpressão','Uma nota diz que uma das etiquetas foi reimpressa depois de uma correção.','Registro']],
  bil:'Hoje li duas etiquetas na mesma caixa e demorei a perceber qual valia. — T.'},
 {p:'Qual parte da rotina foi interrompida?', intro:'Um encerramento parou no meio. Você vai descobrir qual etapa ficou para trás.',
  r:[['auditorio',20,'Ler o roteiro','O roteiro tem quatro etapas. A terceira é a apresentação surpresa.','Registro'],['seguranca',170,'Ler o registro do alarme','O sensor falhou durante a apresentação, antes do fim da terceira etapa.','Registro']],
  v:[['galeria',60,'Observar a galeria','Há uma figura parada, como estátua, de frente para a porta. Ela estava ali antes do apagão.','Observação'],['recepcao',60,'Ouvir um recado','Alguém da equipe lembra: "O aviso da apresentação saiu depois do horário."','Relato']],
  bil:'O evento parou no meio. Parece que sempre para no mesmo ponto. — T.'},
 {p:'Que informação está desatualizada?', intro:'Um registro era verdadeiro quando foi escrito, mas deixou de ser. Você vai descobrir qual.',
  r:[['recepcao',40,'Ler o pedido de conferência','Há um pedido para conferir a assinatura da carta, feito mais cedo.','Registro'],['conservacao',130,'Ver a vitrine','A vitrine da carta está vazia: ela saiu para a conferência.','Observação']],
  v:[['deposito',60,'Comparar registros','Dois registros da carta têm datas diferentes. O mais antigo ainda a dá como exposta.','Registro'],['seguranca',60,'Ler o alarme','O alarme foi manual, acionado por quem viu a vitrine vazia sem saber da conferência.','Registro']],
  bil:'Uma informação certa ontem pode estar errada hoje. Anotei a hora. — T.'},
 {p:'Quem precisa ser avisado?', intro:'Uma escultura foi levada para inspeção. A peça está segura, mas alguém não sabe disso.',
  r:[['conservacao',60,'Ler a ficha de inspeção','A ficha registra a inspeção do suporte da escultura antes do fechamento.','Registro'],['seguranca',180,'Ver o teste de alarme','O teste começou às 21h58. A sala da escultura está vazia no registro.','Registro'],['recepcao',90,'Ler o recado esquecido','Um recado deixado na recepção avisa da inspeção. Ninguém leu.','Registro']],
  v:[['seguranca',30,'Ouvir a ronda','A ronda não sabia da inspeção e tratou a sala vazia como desaparecimento.','Relato'],['auditorio',30,'Ler o horário','O fechamento da exposição está marcado para as 22h, com a escultura no programa.','Registro']],
  bil:'Quem sabia não avisou, e quem avisou ninguém ouviu. — T.'},
 {p:'Qual sala verificar primeiro?', intro:'Um relógio voltou de um empréstimo e não dá tempo de olhar tudo. Você vai escolher por onde começar.',
  r:[['conservacao',30,'Ler o comprovante','O comprovante de transporte mostra o fim do empréstimo e a hora da chegada.','Registro'],['corredor',100,'Observar a caixa','Um visitante parou perto da caixa do relógio, olhando a etiqueta.','Observação']],
  v:[['seguranca',60,'Ler o sensor','O sensor falhou na chegada da caixa, antes de ela ser aberta.','Registro'],['recepcao',60,'Ouvir um recado','Alguém avisou: "O relógio chega hoje, mas ninguém confirmou a hora."','Relato']],
  bil:'Faltou tempo para olhar tudo. Escolhi uma sala e voltei na seguinte. — T.'},
 {p:'Que informação une os dois relatos?', intro:'Dois registros dizem coisas diferentes sobre o mesmo medalhão. Os dois estão certos. Você vai descobrir como.',
  r:[['seguranca',50,'Ler o registro de segurança','Um registro dá o medalhão como sumido, com um número de inventário.','Registro'],['conservacao',120,'Ler a etiqueta','O medalhão está no lugar, com outro número na etiqueta.','Registro']],
  v:[['deposito',60,'Ler o inventário','O inventário foi digitado depois da etiqueta e com um número trocado.','Registro'],['recepcao',60,'Ouvir um relato','Alguém conta que digitou o número com pressa, antes do apagão.','Relato']],
  bil:'Dois relatos, os dois verdadeiros. Cada um falava de um momento. — T.'},
 {p:'Qual decisão pode esperar?', intro:'Umidade, um teste de alarme e um armário disputam a mesma volta. Você vai decidir o que fazer primeiro.',
  r:[['conservacao',40,'Ler a planilha de umidade','A umidade perto do painel de papel subiu aos poucos desde as 21h50.','Registro'],['seguranca',170,'Ver o teste','O teste de alarme começa às 21h58 e termina às 22h. Não envolve o painel.','Registro']],
  v:[['deposito',60,'Ver o armário','O armário protegido está livre desde as 21h55.','Observação'],['manutencao',60,'Ouvir a equipe','Alguém da manutenção diz que a umidade só vira risco depois de meia hora.','Relato']],
  bil:'Nem tudo precisa ser resolvido agora. Aprendi a esperar. — T.'},
 {p:'Qual é a sequência correta?', intro:'Duas versões da mesma fotografia passaram pela montagem. Você vai colocar os fatos em ordem.',
  r:[['auditorio',30,'Ler o roteiro de montagem','O roteiro descreve duas versões da fotografia, A e B.','Registro'],['galeria',120,'Observar a parede','Na parede está a versão B. O suporte vazio ao lado guardava a versão A.','Observação']],
  v:[['recepcao',60,'Ouvir o público','Visitantes comentam a diferença: "Ontem era outra imagem."','Relato'],['corredor',60,'Ler o recado','Um recado pede para trocar a versão só depois da conferência.','Registro']],
  bil:'Os fatos estavam todos lá, só fora de ordem. — T.'},
 {p:'Onde está a caixa?', intro:'Uma caixa de ferramentas apareceu fora do setor. Você vai reconstruir o trajeto dela.',
  r:[['recepcao',40,'Examinar a caixa','A caixa está na recepção, sem etiqueta de setor.','Observação'],['conservacao',130,'Sentir falta das ferramentas','A bancada está sem as ferramentas de restauração. Elas foram pedidas antes do apagão.','Relato']],
  v:[['corredor',60,'Ver o registro de passagem','A caixa passou pelo corredor às 21h56, com a etiqueta ainda presa.','Registro'],['limpeza',60,'Achar a etiqueta','A etiqueta do setor está no chão perto do carrinho de limpeza.','Observação']],
  bil:'Deixei um bilhete na caixa. Não sei se alguém lê. — T.'},
 {p:'Como combinar sem estragar a surpresa?', intro:'Uma homenagem em segredo foi interrompida. Você vai descobrir como avisar quem precisa sem contar a surpresa.',
  r:[['recepcao',30,'Ler o convite reservado','O convite pede segredo e marca a homenagem para o encerramento.','Registro'],['seguranca',160,'Ver o teste','O teste de alarme começou na hora da homenagem. A Segurança não sabia dela.','Registro']],
  v:[['auditorio',60,'Ouvir a produção','Quem organiza pede para avisar a Segurança só do horário, sem dizer o motivo.','Relato'],['corredor',60,'Ver o clima','Uma pessoa da equipe está escondendo algo atrás das costas e sorri.','Observação']],
  bil:'Guardei o segredo de outra pessoa. Foi o melhor que fiz esta noite. — T.'},
 {p:'Qual etapa já foi concluída?', intro:'Um mapa foi retirado para registrar uma anotação no verso. Você vai descobrir se o registro já foi feito.',
  r:[['galeria',40,'Ver a vitrine','A vitrine do mapa está vazia. O mapa saiu para fotografar o verso.','Observação'],['conservacao',130,'Ler o pedido de fotografia','O pedido pede o registro do verso, com uma anotação à mão.','Registro']],
  v:[['seguranca',60,'Ler o alarme','O sensor falhou às 21h58, antes de o registro do verso ser salvo.','Registro'],['auditorio',60,'Ouvir a equipe','Alguém da programação diz que a foto do verso ficou pronta mas não foi arquivada.','Relato']],
  bil:'Escrevi o que vi no verso do papel, para o caso de a noite recomeçar. — T.'},
 {p:'O que mudou depois da tentativa anterior?', intro:'Uma réplica saiu do pedestal. O que você fizer numa volta muda o que acontece na seguinte.',
  r:[['corredor',40,'Ver o pedestal','O pedestal está vazio. A réplica foi movida para abrir espaço.','Observação'],['auditorio',130,'Ler o plano','O plano da apresentação marca a mudança do pedestal às 21h57.','Registro']],
  v:[['seguranca',60,'Ouvir a ronda','A ronda viu o pedestal vazio e tratou como falta. Depois soube da mudança.','Relato'],['recepcao',60,'Ouvir um recado','Alguém lembra: "A mudança foi combinada, mas só por aviso curto."','Relato']],
  bil:'O que fizemos na volta passada mudou alguma coisa. Deu para ver. — T.'},
 {p:'Como montar o quadro completo?', intro:'Um vaso voltou da oficina. Nenhuma pessoa sozinha entende a noite: cada uma viu um pedaço.',
  r:[['conservacao',30,'Ler a ficha de conclusão','A ficha registra a conclusão da restauração do vaso.','Registro'],['recepcao',90,'Ver o vaso','O vaso está na recepção, esperando a conferência.','Observação'],['seguranca',170,'Ler o teste','O teste de alarme começou quando o vaso chegou.','Registro']],
  v:[['auditorio',60,'Ler o programa','O vaso está no programa da exposição seguinte.','Registro'],['corredor',60,'Ouvir um relato','Alguém lembra de ter visto o vaso passar, ainda embalado.','Relato']],
  bil:'Quem lê tudo isto está tentando entender o mesmo que eu. — T.'}
];
// Linhas da mensagem final de T.: aparecem a cada 3 bilhetes guardados (em qualquer ordem).
const MENSAGEM_T = ['Eu também lembro.','Se você encontrou estes bilhetes, não sou a única presença aqui.','Ainda não sei como sair.','Mas agora sei que há mais alguém.','— T.'];
// Combinações entre voltas: cada noite oferece 4 destas, com resultado escrito a partir da verdade do caso.
const COMBOS = [
 {id:'acompanhar', nome:'Pedir que a Segurança acompanhe o movimento', sala:'seguranca', t:60, nome2:'Relato da Segurança', tipo:'Relato', f:c=>'A Segurança acompanhou o movimento e anotou: '+c.detail+'.'},
 {id:'registrar', nome:'Pedir que a Conservação registre o destino', sala:'conservacao', t:60, nome2:'Registro do destino', tipo:'Registro', f:c=>'A Conservação registrou o destino. Na nota consta: '+c.clue+'.'},
 {id:'confirmar', nome:'Pedir que o Atendimento confirme a orientação', sala:'recepcao', t:60, nome2:'Orientação confirmada', tipo:'Registro', f:c=>'O Atendimento confirmou a orientação do dia: '+ACTIONS[c.action]},
 {id:'avisar', nome:'Pedir que a Programação avise antes de mudar uma sala', sala:'auditorio', t:60, nome2:'Aviso da Programação', tipo:'Registro', f:c=>'A Programação avisou antes de mudar a sala. O que se sabe do alarme: '+labels[c.alarm][1]},
 {id:'segurar', nome:'Pedir que alguém segure a peça por alguns minutos', sala:'galeria', t:80, nome2:'A peça segurada', tipo:'Observação', f:c=>'A peça foi segurada por alguns minutos e nada mudou na sala. Isso confirma o que já se sabia: '+c.detail+'.'},
 {id:'duas', nome:'Pedir que alguém confira duas versões lado a lado', sala:'deposito', t:80, nome2:'Duas conferências', tipo:'Registro', f:c=>'Duas conferências lado a lado mostram a mesma coisa: '+c.clue+'.'}
];
const SIMBOLOS = [['folha','🍃'],['roda','⚙️'],['estrela','⭐'],['chave','🗝️'],['sino','🔔'],['lua','🌙'],['raio','⚡'],['onda','🌊']];
const CAIXOTE_TIPOS = [
 {frase:'O caminho começa onde a peça descansou, passa por quem a levou e termina onde deveria chegar.', passos:['onde a peça descansou','por quem a levou','onde deveria chegar'], regra:'Os símbolos entram na ordem em que os fatos aconteceram.'},
 {frase:'Três salas guardam o segredo: a primeira, a do meio e a última.', passos:['a primeira sala','a sala do meio','a última sala'], regra:'Os símbolos seguem o trajeto, da primeira sala à última.'},
 {frase:'Receber, conferir, guardar. É o que se faz com tudo que chega.', passos:['receber','conferir','guardar'], regra:'Os símbolos seguem os procedimentos, na ordem em que são feitos.'},
 {frase:'O que valia antes do apagão não vale depois. Siga o relógio.', passos:['antes do apagão','durante o apagão','depois do apagão'], regra:'Os símbolos seguem o relógio da noite.'}
];
