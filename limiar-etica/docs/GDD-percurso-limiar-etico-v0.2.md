# GDD · Limiar Ético — "Um dia"

Versão 0.2 · 15/11/2026 · documento de projeto (não é conteúdo para o aluno)
Autoria da concepção: Prof. Dr. Mário César Nascimento
Nome da atividade: **Limiar Ético**.

Este documento registra o desenho de 15/11/2026. Consulte a atualização abaixo para o estado da implementação.

---

## 1. Visão

Um percurso ético de um dia inteiro. O jogador vive um dia comum em que exigências legítimas se cruzam (o trabalho, a universidade, a família, um evento que precisa acontecer) e toma decisões ao longo das horas.

A proposta é um **aulão prático e exemplificado**: reunir os conceitos e as teorias da disciplina e levá-los para situações do dia a dia.

O objetivo não é acertar. É **mostrar os conceitos em ação**: em que momento a pessoa agiu mais por impulso, por emoção ou por razão; quando buscou o certo e quando buscou o desfecho; quanta liberdade real tinha. No fim, o dia aparece como curvas e como uma leitura pela escala ética, para a pessoa comparar e argumentar.

**A leitura é sutil.** Durante o dia o jogador não vê rótulos nem conceitos: ele só decide, como decidiria na vida. É no final que descobre que característica teve cada decisão (mais emotiva, mais racional, mais voltada ao dever ou ao desfecho). Se as alternativas viessem rotuladas, a pessoa escolheria o que parece mais bonito.

Nem todos os conceitos cabem num dia só. Cada dia cobre uma parte, e o conjunto dos dias cobre a matéria.

## 2. De onde parte

O projeto não nasce do zero. Ele reúne peças que já existem:

| Peça | Onde está | O que oferece |
|---|---|---|
| Percursos Éticos | repositório Etica, `percursos-eticos/` | Seis temas, doze histórias, telas de contexto, investigação, decisão, desfecho, reflexão e registro; roteiro de deliberação |
| Casos Éticos | repositório Etica, `casos-eticos/` | O "primeiro impulso" marcado no início e comparado no final; caminhos; duas famílias de leitura |
| Escala do Dilema do Bonde | repositório Etica, `dilema-bonde/` | Cinco correntes: Utilitarismo, Virtudes, Intenção, Existencialismo e Ética da Complexidade |
| Glossário do Mosaico Vila Ética | `mosaico-vila-etica/js/content/glossario.js` | Dezenas de verbetes de ética e deontologia |
| "Passagem 2 · Ética" | `limiar-source/docs/GDD-Alostase-v0.5.md` | A ideia de reviver o mesmo dia pelo lado das pessoas e comparar o gesto com o estado do corpo |
| Limiar Ético (protótipo) | `limiar-etica/` | Cinco cenas do cotidiano, sem acúmulo; serve como banco inicial de situações |
| Percursos de Fisiologia | repositório fisiologia-em-fuga, `percursos/` | A estrutura de percurso: tema, contexto, questões ligadas à situação, síntese |

## 3. Base teórica

Os textos do professor ficam no Google Drive, pasta `A-LINK / Textos Éticos`. Este documento só os referencia e resume a estrutura; os textos não são reproduzidos aqui.

### 3.1 "Entre o impulso e a escolha"

É a espinha do jogo. Dele vêm:

- **A cadeia da decisão:** desejo (impulso), consciência (reconhecimento), deliberação (avaliação), vontade (decisão), conduta (ação).
- **Intenção, motivo e consequência**, com a distinção entre dano pretendido, usado como meio ou apenas previsto.
- **Liberdade situada** (Sartre, Merleau-Ponty): escolhe-se dentro de regras, relações de poder, tempo, recursos, medo e expectativas.
- **Ação, omissão e responsabilidade**, com o roteiro de cinco perguntas.
- **O roteiro de análise de um dilema**, em oito passos.
- **O quadro-síntese** de sete perguntas: o que estou desejando, o que compreendi, o que decidi, o que fiz, o que pretendia, o que aconteceu, o que assumo.
- **As três ferramentas:** diário de decisão, mapa de atores, matriz intenção-meio-consequência.

### 3.2 Texto de abertura sobre ética e moral

- Moral como valores e normas de pessoas e grupos; ética como reflexão sobre esses referenciais.
- A alma em três dimensões na concepção platônica: desejos e impulsos, emoções e razão.
- Aristóteles e o lugar da razão; Hume e o lugar dos sentimentos; ética do afeto.
- A razão sozinha não garante que uma ação seja ética; reflexão ética não é privilégio de escolaridade.
- Interesse individual e coletivo: considerar o outro sem anular a si mesmo.

### 3.3 "A Academia"

Diálogo bem-humorado entre quatro personagens numa academia, cada um com uma maneira de justificar a própria conduta (dever, desempenho, pragmatismo do cotidiano, crítica existencial). Serve de referência de tom e de como dar voz a posições diferentes sem caricaturar nem apontar um vencedor.

### 3.4 Slides das disciplinas (ainda não lidos)

"1 Ética e Deontologia da Educação Física - 2026 2" e "2 Ética dos profissionais de saúde - 2026". A conferir antes de fechar a lista de conceitos.

## 4. Estrutura do dia

- O dia corre hora a hora, do início da manhã à noite.
- Um fio principal: um evento ou uma entrega que precisa acontecer naquele dia.
- Fios que cruzam: o grupo da universidade cobrando o trabalho, a família pedindo presença, um colega que falha, uma informação que chega pela metade.
- Cada cena é um confronto entre duas ou mais exigências defensáveis. Nenhuma alternativa é marcada como certa.
- As cenas atuais do protótipo (mensagem fora do expediente, divisão do trabalho em grupo, o assento no ônibus, a acusação no grupo da turma, o compromisso de fim de semana) podem ser costuradas num dia só.

## 5. Fluxo de cada cena

Durante o dia:

1. **Entender o cenário:** fatos, quem está envolvido, o que não se sabe. Buscar mais informação (abrir os fatos, ouvir outro personagem) é opcional.
2. **Decidir.**
3. **Ver o desfecho**, que depende também do que foi feito antes.

Nenhum conceito aparece antes nem logo depois da decisão. Se cada cena revelasse a leitura, da segunda em diante o jogador já estaria jogando para a curva.

No fim do dia, a revelação:

4. **Ver as curvas** e a característica de cada decisão.
5. **Conhecer o conceito** por trás de cada uma.
6. **Comparar e argumentar:** o que as outras lentes diriam, o que a pessoa consegue justificar, e onde ela discorda da leitura.

Regras de escrita das alternativas:

- São escritas como **ações**, nunca como motivos.
- Todas são plausíveis. Nenhuma pode parecer "a resposta emocional" ou "a resposta certa".
- Não há rótulo, cor ou ordem fixa que denuncie o tipo de cada uma.

## 6. As curvas

As curvas aparecem só na revelação final. O dia é mostrado numa linha do tempo, com um ponto por decisão; tocar no ponto abre o conceito daquela cena.

| Curva | O que mostra | Base |
|---|---|---|
| Desejo, emoção e razão | Qual das três dimensões pesou mais em cada decisão | Alma em três dimensões; Hume |
| Do impulso à conduta | Se o impulso foi seguido, contido ou modificado pela deliberação | Cadeia desejo, consciência, deliberação, vontade, conduta |
| Busca do certo e busca do desfecho | Quando a decisão se apoiou em dever e quando em consequência | Intenção, motivo e consequência |
| Liberdade situada | Quanta margem real de escolha a cena dava | Sartre, Merleau-Ponty |
| Escala ética | Peso das cinco correntes ao longo do dia | Escala do Dilema do Bonde |

A lista final de curvas é decisão em aberto. Candidatas a acrescentar: empatia e pressão da meta.

## 7. Como a leitura é feita

Tudo é captado de forma discreta, sem perguntar nada ao jogador:

- **Peso de autoria:** cada alternativa encarna um tipo de justificativa, e o professor define o peso dela em cada curva.
- **Tempo de resposta**, como na decisão cronometrada do Bonde.
- **Busca de informação:** se a pessoa abriu os fatos ou ouviu outro personagem antes de decidir. Procurar informação é sinal de deliberação.

O "primeiro impulso" não é perguntado neste modo. A pergunta faria a pessoa parar e refletir, e mudaria a decisão que se quer observar.

A mesma ação pode nascer da razão ou da emoção. Por isso a revelação diz "esta escolha tem característica de...", e convida o jogador a discordar e explicar o próprio motivo. Essa contestação é a argumentação que o jogo quer provocar.

É uma leitura interpretativa do percurso, não uma medida da pessoa. O fechamento fala de escolhas e tensões, nunca de caráter.

## 8. Acúmulo, meta e corpo

- **As decisões se acumulam.** Variáveis seguem o jogador pelo dia: confiança de cada personagem, pendências, pressão da meta e cansaço. O que foi feito de manhã muda as opções e as reações da tarde.
- **A meta puxa contra.** O evento precisa acontecer. É possível entregar tudo atropelando as pessoas, ou preservar as relações e falhar na entrega.
- **Respingo fisiológico.** O estresse e o cansaço acumulados alteram as cenas do fim do dia (menos tempo para decidir, opções reflexivas mais custosas). A ligação com o jogo de fisiologia da rotina (ver `mosaico-lastro/docs/`) é opcional e fica para depois.
- Para a autoria não explodir, o encadeamento usa variáveis de estado que modulam cenas fixas, e não uma árvore com um texto para cada caminho.

## 9. Fechamento

- As curvas do dia e a leitura pela escala.
- O quadro-síntese de sete perguntas aplicado ao próprio percurso.
- Perguntas para argumentar: o que você manteria, o que mudaria, o que consegue justificar publicamente.
- Espaço para o jogador contestar a leitura de cada decisão.
- Sem nota e sem gabarito.
- **Nada é salvo.** O percurso aparece na tela e some ao fechar (decisão do professor em 15/11/2026).

## 10. Modos

- **Casos:** o Percursos Éticos atual, com histórias independentes.
- **Um dia:** o percurso encadeado descrito aqui. A primeira partida é espontânea; as seguintes já são conscientes. Com dias diferentes sorteados, o aluno compara como decide sem saber e como decide sabendo.

Os dois podem conviver no mesmo lugar.

## 11. Padrões dos simuladores de ética

- Sem barra ou menu superior com link de volta.
- Assinatura: "Simuladores interativos utilizados nas disciplinas de Ética do Prof. Dr. Mário César Nascimento ©".
- Aviso padrão, na linha de "História fictícia para aprendizagem e discussão."
- Personagens com nomes únicos, sem repetir nomes de outras histórias ou atividades.
- Botões e cards com profundidade 3D e reação ao toque; ícones 3D próprios do projeto.
- Celular primeiro, com alvos de toque grandes.
- Conteúdo de projeto não aparece para o aluno.

## 12. Etapas de construção

1. Conferir os slides e montar a tabela de conceitos: de um lado os conceitos e teorias, do outro a cena do cotidiano que exemplifica cada um, distribuídos pelos dias.
2. Escrever o dia-piloto: fio principal, cenas, alternativas e pesos.
3. Motor do dia com variáveis de estado e desfechos.
4. Linha do tempo com as curvas e a escala.
5. Fechamento com o quadro-síntese.
6. Integração ao Percursos Éticos como segundo modo.

## 13. Decisões em aberto

- Só individual, ou também com versão de sala (telão e celulares).
- Lista final de curvas.
- Onde publicar: LAB-RA primeiro e depois o site de Ética, ou direto no site.
- Usar ou não os quatro personagens de "A Academia" como elenco, respeitando a regra de nomes únicos.
- Quantos dias diferentes existirão, e se o sistema sorteia o dia.

## 14. Riscos

- **Sobreposição** com o Casos Éticos, que também tem caminhos e escala. A diferença a preservar: aqui o resultado é a curva de um dia contínuo.
- **Rotular pessoas.** As curvas podem ser lidas como diagnóstico de caráter.
- **Peso de autoria.** Um dia encadeado exige muito texto bem escrito.
- **Teoria decorativa.** Na revelação, o conceito precisa explicar a decisão que foi tomada, e não aparecer como verbete solto.
- **Alternativa que se denuncia.** Se o jogador percebe qual é a opção "racional", a sutileza acaba.
- **Rejogo.** Depois da primeira revelação o jogador conhece o mecanismo; a variedade de dias e cenas precisa sustentar as partidas seguintes.


## 15. Atualização da implementação · versão 0.3

O Lab-RA abre **Um dia** pelo card do Limiar Ético e oferece o protótipo de cinco situações independentes como modalidade curta. O dia-piloto tem onze ou doze decisões, conforme o percurso. A abertura pede escolhas sinceras e informa que não há gabarito nem nota. Durante o percurso aparecem as consequências narrativas. Conceitos, curvas e motivos relatados entram no fechamento.

- **Consequência acumulada.** Na cena do intérprete de Libras, o relacionamento com a equipe construído durante o dia pode mudar a ajuda recebida e o desfecho quando a personagem decide improvisar legendas e distribuir roteiros. Esse apoio reduz a demora e a lacuna de acessibilidade persiste.
- **Leitura das respostas.** A síntese mostra os pesos definidos na autoria e a frequência dos motivos que o participante relatou opcionalmente. Tempo de resposta e consulta a informações descrevem o contexto. Leitura, distrações e condições de acesso podem afetar esses sinais.
- **Aplicação conceitual.** Ao final, um novo caso pede que o participante aplique intenção, meio e consequência à circulação de um vídeo. A reflexão escrita é opcional, com uma leitura conceitual disponível depois. As respostas ficam em memória durante a sessão.

### Próximos passos para um instrumento de pesquisa

1. Definir quais aspectos serão observados: escolha no cenário, motivo declarado e capacidade de aplicar o conceito a um caso novo. Para estudar aprendizagem, preparar casos equivalentes antes e depois da experiência e definir critérios de análise das justificativas.
2. Criar versões pareadas de dilemas, mudando uma condição por vez, como pressão de tempo, relação de poder ou presença de uma pessoa afetada. Fixar o núcleo do percurso quando a comparação entre participantes exigir exposição equivalente e registrar quais cenas e informações estiveram disponíveis.
3. Fazer entrevistas cognitivas e um piloto para verificar a compreensão das instruções e se alguma alternativa soa claramente mais desejável. Revisar as atribuições dos pesos com avaliadores independentes e documentar as discordâncias.
4. Para uma coleta futura, definir o protocolo de participação e o plano de gestão dos dados antes de habilitar armazenamento ou exportação. A versão atual funciona como atividade pedagógica exploratória, com leitura individual do percurso.


## 16. Urgência narrativa e devolutiva · versão 0.4

Em cada sessão, um elemento de urgência narrativa é sorteado para uma cena de cada par. Os pares abrangem decisões de trabalho e decisões que envolvem conciliar necessidades de outras pessoas. O elemento aparece como uma informação da história, com as mesmas alternativas e a mesma possibilidade de consultar os fatos nas duas versões de cada cena. Nas cenas selecionadas, nenhuma janela de informação é reduzida pela condição sorteada.

A relação com a tensão aparece apenas na síntese após a última decisão. O relatório apresenta as quatro cenas, as escolhas e as consultas de informação. Os relatos dizem respeito a condutas no percurso. Para investigar o efeito da urgência, comparar a mesma cena entre participantes alocados às duas versões, em um piloto com protocolo definido. A comparação individual reúne dilemas diferentes e serve para reflexão.


## 17. Conflito entre trabalho e faculdade · versão 0.5

A cena “Até que horas” reúne uma escala de trabalho que se estende até a madrugada, risco de nova advertência, entrega em grupo e prova decisiva na manhã seguinte. Esses fatos aparecem no momento da decisão. A síntese final recupera o conflito, a escolha, a consulta opcional e a consequência narrativa. A leitura se limita ao comportamento que a atividade registra.
