export const salas = {
  atelie: 'Ateliê de manutenção', reserva: 'Reserva Técnica', galeria: 'Galeria principal', fotografia: 'Sala da Fotografia',
  recepcao: 'Recepção', central: 'Central de monitoramento', patio: 'Pátio de luz',
  corredor: 'Corredor de serviço', colecoes: 'Sala das Coleções', camara: 'Subsolo · Câmara do tempo', oficina: 'Oficina elétrica'
};

export const ficcao = [
  [0,'O museu recomeça. Aurélio observa o pedestal.'],
  [70,'O raio atinge o Pátio. As luzes apagam.'],
  [73,'O gerador devolve parte da iluminação.'],
  [160,'O alarme toca no museu.'],
  [240,'A porta de serviço registra uma passagem.'],
  [250,'A Câmara recebe o comando no Subsolo.']
];

export const voltas = [
  ['A chave','Encontre o que Téo deixou e escolha uma linha de investigação.'],
  ['A fotografia','Recupere a imagem do catálogo e compare as duas versões da peça.'],
  ['O trajeto','Cruze registros de movimentação e verifique a causa do retorno.'],
  ['A peça verdadeira','Descubra qual caixa guarda o original. Prepare o conserto para a última volta.'],
  ['Depois das 22h','Restaure a Câmara e reúna as três provas da revelação.']
];

export const pistas = {
  chave:'Chave da Reserva Técnica', manual:'Manual de manutenção e folha de calibração',
  foto:'Foto original remontada · registro 472, revisão de 14', marca:'Marca atual · uma fissura atravessa o selo',
  carga:'Relatório da carga e dos mostradores da Câmara', recibo:'Ficha de retirada · movimento 314, dia 14',
  copia:'Prova de que a peça exposta é uma cópia', fita:'Fita arquivada · carrinho, caixa e porta de serviço',
  catraca:'Catraca · crachá 031, passagem às 21h59', emprestimo:'Crachá 031 · Braga registrou o empréstimo a Lenz',
  trajetoria:'Prova do trajeto pela porta de serviço', identidade:'Prova de quem usou o crachá de Braga',
  oriente:'Cartão de serviço · orientação do painel da grade', grade:'Registro do portão · caixa 314 passou pelo corredor',
  original:'Peça original · número 472', diagnostico:'Diagnóstico da Câmara confirmado',
  rastro:'Mancha de tinta localizada no Corredor', eco:'Eco arquivado no circuito do Pátio', circuito:'Ordem simbólica dos conectores do painel',
  ensaio:'Ensaio da Câmara registrado', primeira:'Primeira intervenção registrada',
  conserto:'A Câmara voltou a funcionar', revelada:'A troca e sua autoria foram reveladas'
};

export const causas = {
  C:{nome:'Âncora presa à cópia', sintomas:['O pedestal não reconhece a idade da peça.','A carga cai quando o pedestal tenta responder.','A calibragem foi conferida.'], conjunto:['Selo','Dia','Trava'], ordem:[2,1,0]},
  A:{nome:'Calibragem perdida', sintomas:['Os mostradores piscam sem parar.','Os relógios da Câmara perdem a referência.','A carga está normal.'], conjunto:['Dia','Apagão','Registro'], ordem:[2,0,1]},
  B:{nome:'Potência insuficiente', sintomas:['O ponteiro de carga cai.','A iluminação enfraquece em cada tentativa.','Os mostradores estão calibrados.'], conjunto:['Chave','Reserva','Alavanca'], ordem:[1,0,2]},
  D:{nome:'Fusível retirado', sintomas:['O encaixe do fusível está vazio.','O lacre da manutenção foi interrompido.','A força chega ao painel externo.'], conjunto:['Losango','Círculo','Triângulo'], ordem:[2,0,1]},
  E:{nome:'Dois defeitos juntos', sintomas:['Os mostradores perderam a referência.','A carga também cai no quadro.','O circuito de fusíveis está inteiro.'], conjunto:['Calibrar','Carregar','Confirmar'], ordem:[0,1,2]}
};
export const maquinaValores = {
  A:[['Dia da troca',['9','14','18'],1],['Minuto do apagão',['0:45','1:10','2:40'],1],['Número da peça',['724','247','472'],2]],
  C:[['Número da peça',['247','472','724'],1],['Dia da troca',['14','18','4'],0],['Referência instalada',['A cópia','O original'],1]]
};
export const ordemCausas = ['C','A','B','D','E'];
export const provas = ['copia','trajetoria','identidade'];

export const missao = {
  quadro:{nome:'Original e Cópia', a:'foto', b:'marca', salas:['reserva','galeria']},
  trajeto:{nome:'Entrou, mas não saiu', a:'fita', b:'catraca', salas:['central','recepcao']},
  pegadas:{nome:'Pegadas no escuro', a:'oriente', b:'rastro', salas:['patio','corredor']}
};

export const atividades = {
  caixa:{nome:'Caixa de segredo', salas:['atelie'], tipo:'caixa', da:['chave','manual'], texto:'Reconheça a faixa móvel. Deslize, examine o fundo e abra a tampa.', dicas:['Observe onde os veios da madeira mudam de direção.','Deslize primeiro a faixa com o entalhe triangular.']},
  abrir:{nome:'Abrir a Reserva Técnica', salas:['reserva'], tipo:'chave', texto:'A chave abre a porta. Gire-a até o fim do curso.', dicas:['O símbolo da chave coincide com a placa da porta.','Toque em Girar a chave de novo.']},
  foto:{nome:'Reconstruir a foto de catálogo', salas:['reserva'], tipo:'foto', precisa:['abriu'], da:['foto','recibo','carga','emprestimo'], texto:'Reconstitua a imagem e observe o canto do suporte. O arquivo ao lado tem a ficha de empréstimo e a leitura da Câmara.', dicas:['Comece pela peça que tem o céu claro no canto.','O pedaço com a marca triangular fica no canto inferior direito.']},
  fotoConsulta:{nome:'Restaurar cópia de consulta do catálogo', salas:['fotografia','galeria'], tipo:'foto', desde:3, da:['foto'], texto:'O arquivo de consulta tem uma segunda cópia da fotografia. Reúna as seis partes e preserve o selo.'},
  marca:{nome:'Examinar com luz rasante', salas:['galeria'], tipo:'luz', da:['marca'], texto:'Mude o ângulo da luz até a fissura no selo ficar legível.', dicas:['A marca aparece quando a luz vem de lado.','A posição 4 projeta a sombra na direção certa.']},
  comparar:{nome:'Comparar a obra e a fotografia', salas:['galeria','reserva'], tipo:'comparar', precisa:['foto','marca'], da:['copia'], texto:'O que demonstra que a peça da Galeria é uma cópia?', opcoes:['A cor da parede','A fissura que cruza o selo atual','A sombra do fotógrafo'], certo:1},
  fita:{nome:'Restaurar a fita da câmera', salas:['central','colecoes'], tipo:'ordem', da:['fita'], texto:'Monte a sequência da movimentação. O material foi arquivado antes do retorno.', itens:['Caixa deixa a bancada','Carrinho dobra o corredor','Crachá libera a porta','Caixa entra nas Coleções'], clipes:['bancada','carrinho','porta','colecoes'], dicas:['A caixa sai da bancada antes de aparecer no corredor.','Comece pela bancada e termine nas Coleções.']},
  livro:{nome:'Conferir crachá e ficha', salas:['recepcao','colecoes'], tipo:'comparar', da:['catraca','emprestimo'], texto:'A escala mostra o responsável. A ficha registra quem levou a caixa 314. Qual registro deve ser cruzado com a fita?', opcoes:['Crachá 031, ficha 314','Crachá 013, ficha 341','Crachá 310, ficha 143'], certo:0},
  cruzar:{nome:'Cruzar fita, catraca e empréstimo', salas:['central','recepcao','colecoes'], tipo:'comparar', precisa:['fita','catraca','emprestimo'], da:['trajetoria','identidade'], texto:'O crachá cadastrado em nome de Braga passou na porta. Quem tem o empréstimo assinado e retirou a caixa?', opcoes:['Braga','Ivone','Lenz'], certo:2},
  patio:{nome:'Consultar o cartão do Pátio', salas:['patio','oficina'], tipo:'registro', da:['oriente'], texto:'O triângulo identifica a luz de inspeção. A sequência gravada no cartão libera o controle da grade.'},
  pulso:{nome:'Acionar a iluminação de inspeção', salas:['patio'], tipo:'registro', precisa:['oriente'], texto:'Combine com quem está no Corredor. A luz revela as marcas por 25 segundos.'},
  rastro:{nome:'Examinar a mancha no corredor', salas:['corredor'], tipo:'registro', da:['rastro'], texto:'A tinta vai além do primeiro rodapé. Um colega no Pátio pode ligar a iluminação de inspeção.'},
  raio:{nome:'Fechar a chave no instante do raio', salas:['patio','oficina'], tipo:'registro', desde:5, precisa:['diagnostico'], texto:'O raio passa entre 1:06 e 1:14 na linha do tempo. Combine a descarga com o Subsolo.'},
  pegadas:{nome:'Seguir marcas no escuro', salas:['corredor'], tipo:'ordem', precisa:['pulso'], da:['trajetoria'], texto:'Ordene a trilha de tinta enquanto a iluminação revela as marcas.', itens:['Marca junto ao pote','Marca no rodapé','Marca sob o carrinho','Marca na porta de serviço']},
  cadeado:{nome:'Cadeado direcional', salas:['patio','corredor'], tipo:'ordem', precisa:['oriente'], da:['cadeado'], texto:'Reproduza as setas anotadas no cartão de manutenção.', itens:['↑','→','↓'], dicas:['A primeira seta aponta para cima.','A sequência do cartão é cima, direita, baixo.']},
  painel:{nome:'Alinhar painel e grade', salas:['patio','oficina','corredor'], tipo:'ordem', precisa:['cadeado'], da:['grade','circuito','trajetoria'], texto:'O desenho de ronda passa pelo triângulo, pela linha e pelo círculo. Alinhe os símbolos para liberar a janela de inspeção.', itens:['Triângulo','Linha','Círculo']},
  banners:{nome:'Abrir o caixote de banners', salas:['colecoes'], tipo:'comparar', precisa:['foto','marca'], da:['original'], texto:'A imagem restaurada mostra o número da peça. Qual caixa tem a etiqueta correspondente?', opcoes:['Peça 247','Peça 472','Peça 724'], certo:1},
  enviar:{nome:'Encaminhar o original ao Subsolo', salas:['colecoes'], tipo:'registro', precisa:['original'], texto:'A portinhola de serviço leva o caixote ao berço. Ele ficará disponível na próxima volta. Custa 1 de energia.'},
  ler:{nome:'Identificar os sinais da Câmara', salas:['galeria','reserva','camara','oficina','patio'], tipo:'sintomas', precisa:['manual','carga','marca'], da:['diagnostico'], texto:'Compare dois sinais de famílias distintas e um descarte.'},
  eco:{nome:'Preparar o eco e conferir conectores', salas:['patio','oficina','colecoes'], tipo:'ordem', desde:3, precisa:['diagnostico'], da:['eco','circuito'], texto:'A gravação de manutenção preserva a sequência do Pátio. Ordene preparação, disparo e transferência.', itens:['Preparar','Disparar','Transferir']},
  bancada:{nome:'Ensaiar a operação', salas:['camara','colecoes'], tipo:'maquina', desde:3, ate:4, precisa:['diagnostico'], da:['ensaio'], texto:'Registre o ensaio. Na causa dupla, o primeiro trabalho fica gravado antes da última volta.'},
  fixar:{nome:'Consertar a Câmara', salas:['camara'], tipo:'maquina', desde:5, precisa:['diagnostico','preparo'], da:['conserto'], texto:'Confirme os controles segundo o diagnóstico e o registro da noite.'},
  glifos:{nome:'Conferir a inscrição', salas:['galeria'], tipo:'glifos', texto:'Qual símbolo não bate com a tábua?', opcoes:['5','4','3','2'], certo:0},
  revelar:{nome:'Revelar a troca ao museu', salas:['camara','recepcao'], tipo:'comparar', desde:4, precisa:provas, da:['revelada'], texto:'Encaminhe prova da cópia, trajeto e identificação a Aurélio. Quem usou o crachá emprestado para retirar a caixa?', opcoes:['Ivone','Lenz','Braga'], certo:1}
};

export const finais = {
  Ouro:'O relógio marca 22h00min01s. O socorro chega a Téo. Aurélio mostra os três registros no telão e o museu inteiro descobre a troca.',
  Desligar:'O relógio segue e a ajuda chega a Téo. A autoria ficou no caderno para ser investigada depois.',
  Revelar:'Aurélio recebe a prova. O tempo ainda volta, mas as três evidências ficam preservadas no canal da Câmara.',
  Parcial:'O museu retorna. O seu dossiê conserva o que a investigação conseguiu sustentar.',
  Mínimo:'A chuva, o alarme e o saguão voltam ao início. Você conserva o que descobriu.'
};
