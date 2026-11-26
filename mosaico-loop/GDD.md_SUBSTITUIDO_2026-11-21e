# GDD Loop

**Documento de concepção e design de jogo**  
**Versão:** 1.0 para discussão · 18 de novembro de 2026  
**Projeto:** Dragon Games · título provisório  
**Status:** proposta de design; narrativa, balanceamento, arquitetura e recursos 3D ainda dependem de definição e testes.

---

## 1. Visão geral

Loop é um jogo de investigação para navegador em que um museu e as pessoas dentro dele retornam repetidamente ao mesmo intervalo de cinco minutos. Vários jogadores investigam em tempo real, cada um escolhendo um ambiente por ciclo. Eles acumulam conhecimento, relacionam indícios, registram hipóteses e tentam antecipar ou modificar o acontecimento da partida.

O fato principal não é informado na abertura. Um estrondo, um apagão e um alarme são percebidos, mas suas causas, relações e consequências precisam ser descobertas. O que o jogador testemunha depende de onde está e do que pode ver ou ouvir.

A experiência combina suspense, descoberta, escolhas e colaboração ou competição amigável, sem depender de assassinato. A história pode ter humor, emoção, equívocos, segredos e ações intencionais. O universo permite diferentes partidas e acontecimentos, mantendo a coerência interna de cada uma.

### Identidade do projeto

| Aspecto | Direção inicial |
|---|---|
| Gênero | Investigação narrativa, dedução distribuída e loop temporal |
| Plataforma | Navegador em celulares e computadores; telão e RA são recursos opcionais a validar |
| Participantes | Multijogador simultâneo; modo solo desejado e ainda a projetar |
| Experiência central | Escolher um ambiente, observar, reunir informações, formular hipóteses e intervir |
| Sessão de referência | Cinco loops de cinco minutos reais, mais preparação, pausas e desfecho |
| Rejogabilidade | Meta mínima de 15 partidas com diferenças significativas; ainda não produzidas |
| Modelo de acesso | A definir em função do projeto e das autorizações existentes |
| Público | Pessoas interessadas em mistério, jogos sociais e investigação; classificação etária a definir |

## 2. Intenção e pilares

1. **Curiosidade antes da certeza.** O jogador conhece sinais de um acontecimento, mas precisa descobrir o que eles significam.
2. **O tempo passa para todos.** O mesmo intervalo acontece simultaneamente em diferentes ambientes.
3. **A informação permanece.** Os objetos e personagens retornam ao estado anterior; o conhecimento adquirido pelo jogador permanece no caderno.
4. **Nenhuma pessoa vê tudo.** As escolhas distribuem perspectivas e tornam a conversa valiosa, sem impedir a investigação individual.
5. **O engano precisa ser justo.** Uma interpretação equivocada deve decorrer de evidências incompletas e receber explicação coerente.
6. **O jogo pode ser revisitado.** Mistérios, relações, personagens e acontecimentos podem variar entre partidas de maneira planejada.
7. **Agir precisa ter consequência.** Quando uma intervenção é permitida, o resultado deve corresponder ao que foi alterado.

## 3. Terminologia

**Partida:** experiência completa, da abertura à revelação e ao placar.  
**Loop ou ciclo temporal:** uma repetição dos mesmos cinco minutos da história dentro da partida.  
**Ciclo de 15 partidas:** meta de variedade e cobertura entre partidas completas; não significa 15 loops em uma mesma sessão.  
**Realidade da partida:** conjunto dos fatos, acontecimentos, participantes e relações selecionados no começo da sessão.  
**Evidência:** registro, observação ou relato que pode apoiar ou contestar uma hipótese.  
**Hipótese:** interpretação formulada pelo jogador, ainda sujeita a revisão.  
**Intervenção:** ação prevista que altera alguma condição da sequência original.

## 4. Premissa e abertura

O museu está próximo do fechamento. Uma exposição temporária apresenta invenções experimentais, entre elas um protótipo doado por um inventor. O objeto está exposto sem uma explicação completa de seu funcionamento.

Na introdução proposta, o visitante observa o protótipo. Um estrondo ecoa, as luzes se apagam, a iluminação de emergência entra em operação e uma mensagem de segurança é reproduzida. Em seguida, o alarme de incêndio é acionado e as saídas de emergência são liberadas conforme a lógica ficcional. O jogador tenta compreender a situação e sair.

O tempo retorna. A partir daí, o jogador percebe a repetição e passa a investigar os minutos anteriores. O estrondo e o alarme são sinais conhecidos; não identificam por si só o fato central de todas as partidas. Não se revela antecipadamente se houve roubo, troca, acidente, ação deliberada ou outro acontecimento.

**Abertura a validar:** para possibilitar a observação de eventos anteriores ao estrondo, o primeiro retorno deve levar a um ponto antes dele. Uma introdução encenada pode mostrar apenas parte de um ciclo inicial; os cinco minutos completos passam a ser jogáveis depois do retorno. O roteiro apresentado originalmente colocava o retorno diante da máquina no instante do estrondo: essa adaptação temporal ainda precisa de validação narrativa.

## 5. O intervalo de cinco minutos

### Cronologia ilustrativa

Esta cronologia é uma estrutura de teste, não uma solução definitiva. Cada cenário terá sua própria cadeia de causas e horários compatíveis.

| Relógio da história | Tempo restante | Marco visível ou possível |
|---|---:|---|
| 21h55 | 05:00 | Âncora do loop; o museu e seus personagens retornam às posições definidas. |
| 21h56 | 04:00 | Movimentações e decisões preparatórias em ambientes diferentes. |
| 21h57 | 03:00 | Estrondo e interrupção da iluminação principal na proposta-base. |
| 21h57min45s | 02:15 | Alarme e liberação das saídas de emergência na proposta-base. |
| 21h59 | 01:00 | Sinais crescentes associados ao fenômeno temporal, se fizerem parte do cenário. |
| 22h00 | 00:00 | Retorno à âncora, salvo se uma intervenção válida alterar esse resultado. |

Os relógios de ficção são exemplos. Falhas elétricas, disparo do alarme, manipulação do protótipo e demais fatos devem ser ordenados e justificados em cada realidade de partida, sem presumir que sempre tenham a mesma causa.

### Estado e memória

No retorno, a posição física dos objetos, as portas, os personagens e as condições do museu voltam ao estado inicial da variante. Jogadores mantêm caderno, anotações e hipóteses. Um código aprendido só pode ser reutilizado se, naquela variante, seu valor for realmente válido no instante em que for inserido. Informações privadas não se tornam públicas automaticamente.

Os personagens que não são jogadores não conservam memória entre loops no modelo inicial. Qualquer exceção precisa ser estabelecida pela narrativa e produzir pistas verificáveis.

## 6. Laço principal e estados da partida

**Abertura → escolha simultânea de ambiente → observação durante o loop → retorno → consulta ao caderno e troca de informações → nova escolha → hipótese e intervenção → revelação e pontuação.**

1. O anfitrião cria a sala; participantes entram e se preparam.
2. A abertura apresenta o espaço e sinais do acontecimento, sem revelar sua explicação.
3. Cada participante escolhe um ambiente. A escolha é independente; mais de um pode escolher o mesmo local.
4. Os cinco minutos ocorrem com relógio compartilhado. Cada pessoa investiga sua perspectiva.
5. O retorno encerra o loop. Há uma pausa de duração configurável para leitura, troca e próxima escolha.
6. O processo se repete. O número de loops e as regras de intervenção são parâmetros da sessão.
7. Cada jogador registra uma hipótese final estruturada, com possibilidade de responder parcialmente ou não saber.
8. O grupo ou jogador executa uma intervenção quando disponível.
9. A revelação recompõe os acontecimentos, esclarece pistas enganosas e apresenta os resultados.

**Modelo para o primeiro teste:** quatro loops de investigação e um quinto com possibilidade de intervenção, totalizando 25 minutos de tempo de loop. Comparar com cinco de investigação mais um sexto de intervenção, que soma 30 minutos de loop. Em ambos, introdução, pausas, hipóteses e revelação acrescentam tempo; cerca de 37 a 51 minutos para a primeira opção é uma estimativa, não um resultado medido.

## 7. Escolha dos ambientes

### Regra de referência

Cada participante escolhe um ambiente por loop. Não há reserva exclusiva: pessoas podem se encontrar no mesmo ambiente. A observação ocorre em tempo real; ninguém deve receber conhecimento de outro local sem uma fonte narrativa ou compartilhamento autorizado.

No primeiro teste, o deslocamento até o ambiente escolhido pode ser representado por uma transição no início do loop. A duração dessa transição e sua coerência com o mapa devem ser definidas antes do roteiro final. A regra de um ambiente por ciclo preserva a escolha com custo e evita exigir que o jogador percorra todo o museu em cinco minutos.

| Ambiente sugerido | Possibilidades de investigação |
|---|---|
| Galeria principal | Vitrines, quadros, montagem, visitantes e possíveis estátuas vivas. |
| Sala do protótipo | Placa da exposição, sinais da máquina, posição de visitantes e registros acessíveis. |
| Recepção | Entrada, registros de presença, entregas e comunicações. |
| Corredor de serviço | Trânsito entre áreas, sons, caixas e rotas de funcionários. |
| Conservação | Inspeções, tratamento, movimentação autorizada e arquivos de peças. |
| Segurança ou sala técnica | Registros de sistema, iluminação, comunicações e controles apropriados. |
| Depósito | Embalagens, inventário e movimentação de obras. |
| Jardim de esculturas | Exposições externas, acessos visíveis e oportunidades para uma figura disfarçada. |

Esses espaços são candidatos, não uma lista fechada. O mapa definitivo precisará especificar conexões, rotas, distâncias, horários, o que é visto e ouvido, acessibilidade e disponibilidade de pistas.

### Sala de partida, objetivo de sair e peças (decisão de 20/11/2026)

Todas as pessoas começam na mesma sala, o **Saguão superior**, no 2º andar, no começo da partida e a cada retorno do tempo. Dali, cada pessoa escolhe uma das 30 salas do museu (três andares, a mesma planta em cada um, com o Pátio de luz vazado). Quando o tempo acaba, todo mundo volta ao Saguão superior. O objetivo principal é **responder às 8 perguntas da investigação**. **Sair do museu** continua em aberto e é a última prioridade da lista: ainda não foi decidido se existe, como funciona e se os jogadores ficam sabendo (21/11/2026).

**Porta principal (decisão de 20/11/2026):** a porta de entrada e saída do museu permanece fechada pela grade de segurança durante toda a partida, em todos os loops, para a saída não ser fácil. Isso passa a valer sobre a frase da abertura que fala em saídas de emergência liberadas pelo alarme: o alarme não abre a porta principal. A saída, se existir, será outra rota ou depende de descobrir como destravar a grade; a regra ainda precisa ser desenhada.

Cada sala exibe uma peça 3D (15 do ThreeMuseum, MIT, mais o Triceratops CC0 do Smithsonian, e 15 de outros tipos do acervo da Khronos, CC0 e CC BY: relógio, capacete, câmera antiga, rádio, xadrez, carrinho, lanterna, cadeira, xícara, crânio, âmbar com mosquito, peixe, caminhão, garrafa e vidro; todos otimizados em `museu/pecas/`). As pistas ficam **escondidas na peça**, em pontos que a pessoa precisa achar girando e tocando; os pontos só aparecem no horário em que a pista fica disponível. Onze salas guardam peças-chave da história; as outras 19 trazem pistas de rotina e ecos verdadeiros do caso.

### Perguntas centrais, objetivos e tipos de informação (recuperado em 20/11/2026)

**Perguntas da investigação:** O quê? (qual acontecimento) · Onde? (em que local) · Quando? (em que momento) · Como? (mecanismo ou sequência) · Por quê? (causas e motivações) · Quem? (pessoas e participação de cada uma) · Previsão (é possível antecipar?) · Intervenção (é possível impedir ou modificar o resultado?). Elas são o núcleo da investigação e valem para qualquer cenário. Não é preciso responder todas para pontuar; a pontuação é por proximidade com o que aconteceu.

**Objetivos do jogador:** investigar (explorar ambientes e recolher evidências), reconstruir (relacionar personagens, locais, horários e acontecimentos), formular hipóteses (mesmo incompletas) e prever e intervir. A porta principal fica fechada pela grade de segurança. Sair do museu não é prioridade: fica como a última opção da lista, a definir depois (21/11/2026). Uma ideia em aberto é tratá-la como consequência do que a pessoa descobre, sem anunciar como objetivo.

**Tipos de informação:** Observação (o que a pessoa presenciou), Relato (o que um personagem informou), Registro (o que veio de documentos) e Hipótese (interpretação da própria pessoa). No jogo, cada pista do dossiê mostra se é Observação, Relato ou Registro.

**Variedade de peças (decisão de 20/11/2026):** o museu não é só de história natural. Metade das salas tem outros tipos de peça (arte e objetos do dia a dia, fotografia, som, jogos, transporte, tempo), para a pessoa nunca saber que tipo de sala vem a seguir.

**Densidade de pistas (decisão de 20/11/2026):** cada peça de museu esconde vários detalhes, não só uma pista. As 19 salas de ambiente têm 6 pontos: 3 de rotina que não ajudam a resolver, e 3 verdadeiros (o ambiente e dois ecos de eixos diferentes do caso). As salas-chave têm de 2 a 4 pontos. A pessoa escolhe só uma sala por loop e não troca de sala dentro da volta, para não complicar.

### Acesso ao local do acontecimento

Pode haver um espaço inacessível durante a investigação, mas isso deve decorrer das regras do cenário e não revelar automaticamente onde ocorreu o fato. Se o jogador estiver em posição de ver ou ouvir um acontecimento, a interface deve mostrá-lo ou representá-lo de modo coerente. A revelação final pode mostrar perspectivas não acessadas, sem introduzir uma prova essencial que não pudesse ser inferida antes.

## 8. Ações durante o loop

As ações candidatas são observar uma área, selecionar um objeto, ler ou ouvir um registro, acompanhar um personagem visível, fazer perguntas previstas, marcar um horário e guardar uma pista. A quantidade de ações realizáveis em cinco minutos deve ser testada e acessível por toque, sem exigir destreza excessiva.

Uma ação de observação não altera a sequência central. Uma ação de intervenção é identificada claramente e tem consequência definida. No modelo inicial, ações que mudam a realidade ficam disponíveis na fase de intervenção. Intervenções em loops anteriores são expansão possível, mas exigem ramificações e efeitos consistentes; ainda não estão aprovadas.

Não se devem esconder automaticamente acontecimentos visíveis só para preservar o mistério. Objetos e falas podem ser percebidos parcialmente quando isso decorre de distância, obstáculos, horário ou atenção do personagem, sem contradizer a apresentação ao jogador.

## 9. Caderno, hipóteses e apoio

O caderno fica próximo das jogadas e contém registros com origem, local e momento. Os estados sugeridos são: **observado**, **relatado por alguém**, **registro consultado** e **hipótese pessoal**. Um relato não equivale automaticamente a um fato confirmado. O sistema não atribui certeza a uma informação apenas por ela ter sido compartilhada.

O jogador pode arriscar partes da resposta ao longo da partida e revisá-las. Campos candidatos: o que ocorreu; onde; quando; mecanismo; pessoas ou objetos envolvidos; causa; relação com o loop; ação para alterar o resultado. As perguntas finais devem depender da variante, para não pressupor roubo, culpado ou outra resposta que possa ser falsa. Opções incluem hipótese incompleta e não sei.

### Ajuda gradual inspirada no Mosaico Card

O jogador decide se pede ajuda durante a pausa. A ajuda tem graus progressivos: orientação ampla de raciocínio, indicação de tipo de fonte ou ambiente e, por fim, informação mais específica. Cada pista de apoio é escrita para uma variante válida e não entrega automaticamente uma resposta falsa ou incompatível.

São candidatos um apoio pessoal e um apoio compartilhado pelo grupo. Suas regras de custo, visibilidade e eventual efeito na pontuação precisam ser anunciadas antes da escolha e testadas. Pedir ajuda não impede continuar nem deve eliminar a possibilidade de pontuar. O jogo não deve depender de ajuda externa para que as pistas essenciais sejam acessíveis.

## 10. Pontuação e resolução

Cada participante apresenta suas respostas. A mesma realidade de partida fornece o gabarito; respostas parciais recebem crédito proporcional quando houver critérios definidos antecipadamente. Justificativas livres podem enriquecer a conversa, mas não devem ser pontuadas automaticamente sem um sistema de avaliação explicitamente projetado e testado.

### Distribuição inicial para teste

| Eixo | Pontos máximos | Exemplo de avaliação |
|---|---:|---|
| Natureza do acontecimento | 20 | Reconhecer o que ocorreu, inclusive quando não houve roubo ou crime. |
| Causa ou mecanismo | 20 | Identificar o mecanismo relevante para o mistério da variante. |
| Tempo e sequência | 15 | Ordenar marcos e reconhecer relações temporais. |
| Pessoas e objetos | 15 | Identificar participação comprovada sem confundir presença com responsabilidade. |
| Relações entre evidências | 15 | Escolher relações de apoio e contraprova previstas no gabarito. |
| Intervenção | 15 | Escolher uma ação coerente e o ponto adequado para alterar o resultado. |
| **Total** | **100** | Distribuição provisória, a calibrar por testes. |

Para cada variante, os campos e o crédito parcial precisam ser documentados; se um eixo não se aplicar, seus pontos serão redistribuídos previamente e comunicados. Pontuação por antecipação e custo de ajudas são propostas em aberto; não se somam a esta tabela até existir regra definida. O resultado destaca acertos, hipóteses plausíveis e limitações do que foi observado. A revelação mostra a sequência original, as fontes e as consequências da intervenção.

### Atualização de 21/11/2026: as 8 perguntas, pistas encadeadas e intervenção por dedução

**Formulário final (jogo individual).** Passa a ter as 8 perguntas do projeto original, em vez de 4. Pontuação por proximidade, 100 pontos: O quê (15) · Onde (10) · Quando (10) · Como (15) · Por quê, o que disparou o alarme (10) · Quem (15) · Previsão (10) · Intervenção, o procedimento que ajudaria a equipe (15). "Onde" vale metade se a pessoa acertar o andar; "Quando" vale metade se a janela abrir no mesmo horário da certa. "Ainda não sei" vale 0. O arquivo de fechamento continua com até 2 trechos, agora um para cada pergunta.

**Pistas encadeadas.** O procedimento de encerramento (na sala-fonte de cada caminho) cita só o **código do equipamento** (P-7 painel da demonstração, A-3 painel da alimentação, M-2 mesa de produção, R-5 leitor de referência) e a janela de horário. Onde cada código fica só aparece em dois diretórios de equipamentos, um na Sala dos habitats e outro no Pátio de luz. Para agir, a pessoa precisa cruzar: o código (procedimento) + o lugar (diretório) + o horário (janela). Cada fato essencial tem pelo menos duas fontes: o equipamento e a janela vêm do procedimento e da observação no próprio equipamento; o lugar vem de dois diretórios.

**Intervenção por dedução.** Na 5ª volta, as quatro salas de equipamento (Galeria do tempo, Laboratório de formas, Auditório, Ateliê) mostram um painel com 3 comandos: o do equipamento, um comando-isca e o reinício genérico, em ordem que muda a cada partida. A pessoa tem **uma única tentativa**, sem aviso de janela: precisa saber o equipamento certo, o comando certo e o horário (o relógio do museu aparece no painel). O resultado explica o motivo da falha: equipamento sem ligação com o retorno, fora da janela, comando-isca ou reinício. Na sala do Mestre vale a mesma regra, **uma tentativa por pessoa**, cada uma no próprio celular (a investigação é individual). O resumo da turma mostra quantas pessoas quebraram o loop, e o telão mostra a barra "Quebrou o loop". O modo em grupo antigo (coop.mjs) ainda trata a ação como hipótese.

**Saída do museu: a definir, última prioridade (21/11/2026).** O objetivo principal é responder às 8 perguntas. Ainda não foi decidido se há saída, como ela funciona nem se os jogadores precisam saber; uma ideia é que seja só consequência. Nada foi implementado e o texto do jogo não promete saída. Opções já levantadas: a grade abre quando o comando certo é executado a tempo; um código da grade espalhado nas pistas; ou uma saída de serviço.

## 11. Intervenção e finais

O grupo ou jogador escolhe entre ações viáveis construídas a partir das evidências disponíveis. O sistema deve explicitar qual ação foi escolhida, em que ambiente e quando será executada. Em sessões com pessoas suficientes, uma ação composta pode ser distribuída entre ambientes; para poucos participantes, a variante precisa oferecer um plano viável com a quantidade presente. O método de decisão coletiva, votação e resolução de ações incompatíveis ainda deve ser definido.

Cada cenário precisa registrar pelo menos: estado original; condições da ação; consequência direta; efeito sobre o acontecimento; efeito sobre o loop; e explicação mostrada depois. Acertar a hipótese e interromper o loop são resultados diferentes. É possível compreender o fato sem escolher a intervenção adequada, ou alterar uma consequência sem eliminar a causa.

Finais candidatos: tempo continua e acontecimento é evitado; tempo continua mas uma consequência permanece; acontecimento muda e loop persiste; nenhum dos objetivos é alcançado; conclusão parcial por falta de evidência. Não se deve prometer que todas as variantes terão todos os finais antes de serem escritos e testados.

## 12. Personagem disfarçado de obra

Uma pessoa pode se passar por escultura, manequim ou instalação. Sua existência, papel, local, aparência, motivo, relato e relação com a história mudam conforme a variante; também podem existir partidas sem essa pessoa. Não deve haver um único lugar que sempre revele a resposta.

| Versão candidata | Motivo | Contribuição e limite |
|---|---|---|
| Guarda | Escondeu-se por medo depois de perceber algo. | Testemunhou uma parte da movimentação; sua interpretação pode ser incompleta. |
| Artista | Prepara uma apresentação como estátua viva. | Ouviu uma conversa, mas pode não saber seu contexto. |
| Restaurador ou restauradora | Protege uma peça ou participa de uma montagem. | Conhece um procedimento, sem necessariamente conhecer o acontecimento inteiro. |
| Visitante | Escondeu-se após entrar em uma área restrita. | Viu parte de uma ação e tem motivo para omitir sua presença. |
| Funcionário ou funcionária | Prepara uma surpresa. | Explica uma movimentação suspeita que pode ser independente do evento central. |
| Figura com plano próprio | Tenta observar ou agir sem ser identificada. | Sua responsabilidade precisa ser estabelecida por evidências, não pelo disfarce. |

Todas as versões precisam de trajetória, tempo, visibilidade, evidências, relação causal ou independência explícita e explicação final. A mesma solução não deve ser indicada apenas por uma animação minúscula, um objeto sempre igual ou uma pergunta que entregue o segredo.

## 13. Rejogabilidade e matriz de 15 partidas

**Meta de design:** ao menos 15 configurações de partida com diferenças narrativas significativas, verificáveis e jogáveis. Não há 15 cenários prontos neste documento; a lista a seguir é uma matriz inicial de criação, sujeita a escrita, combinação compatível e testes.

| Nº | Foco provisório | Pergunta de criação para a equipe |
|---:|---|---|
| 01 | Ativação do protótipo | Quem ou o que completou as condições de ativação? |
| 02 | Falha elétrica | O que a originou e qual foi seu efeito sobre a máquina? |
| 03 | Alarme automático | Qual evento acionou o sistema e com que evidência? |
| 04 | Acionamento humano do alarme | Quem acionou o alarme e por qual motivo? |
| 05 | Peça retirada para proteção | O que motivou a retirada e onde ficou a peça? |
| 06 | Troca autorizada | Por que houve a substituição e quem sabia dela? |
| 07 | Troca indevida | Como distinguir a intenção, o método e o destino das peças? |
| 08 | Caixa identificada incorretamente | Como a divergência de registros gerou uma falsa conclusão? |
| 09 | Visita inesperada | Quem entrou e qual relação tem com os fatos da noite? |
| 10 | Homenagem interrompida | O que era preparado e qual acontecimento interrompeu o plano? |
| 11 | Instalação artística interrompida | Qual era a ação prevista e o que a alterou? |
| 12 | Informação do inventor | Que registro foi mal interpretado e por quem? |
| 13 | Guarda escondido | O que o guarda observou e o que interpretou equivocadamente? |
| 14 | Obra deslocada | Quem a movimentou e se isso se relaciona ao evento central? |
| 15 | Dois fatos independentes | Quais acontecimentos coincidiram sem relação causal? |

Esses focos precisam ser transformados em realidades completas e diferenciadas; simplesmente mudar nome, cor ou posição não conta como uma nova partida significativa. Uma variante pode combinar temas apenas quando causa, cronologia e evidências forem consistentes. Evitar sinalizações que entreguem a solução por reconhecimento de padrão.

### Seleção e histórico

O sistema seleciona apenas combinações previamente validadas e registra a variante usada no histórico definido para a mesa. Proposta: não repetir uma configuração completa no mesmo ciclo de 15 até esgotar as disponíveis, respeitando os cenários elegíveis para o número de participantes. O escopo desse histórico — anfitrião, grupo ou outro identificador — precisa ser decidido; mudanças de anfitrião, grupos mistos e perda de histórico impedem prometer ausência universal de repetição.

Em cada partida, registra-se em sigilo a realidade selecionada, sua versão e o estado inicial. Durante os loops, a sequência-base permanece consistente; a intervenção autorizada cria uma ramificação rastreável. O ciclo de validação de 15 partidas documentado para outro modo MOSAICO é referência de cobertura, não prova de que este jogo já possui 15 histórias nem regra automática de autoria para todos os cenários.

## 14. Distribuição de pistas e justiça

Para cada fato essencial, planejar pelo menos duas fontes independentes, incluindo uma fonte que não dependa exclusivamente do relato de um personagem. Uma observação direta, um registro e uma consequência podem sustentar a mesma conclusão por caminhos diferentes; não é necessário que todas as fontes estejam no mesmo ambiente.

O critério de duas fontes é necessário, mas não suficiente: com uma pessoa, cinco loops e um ambiente por loop, as fontes precisam ser alcançáveis nas rotas disponíveis. Cada variante deve apresentar uma matriz de cobertura por número de jogadores e por escolhas possíveis. Quando uma combinação de ambientes deixar o jogador sem fatos necessários, adicionar uma alternativa, uma recuperação planejada, mais oportunidade de acesso ou recalibrar a variante.

Pistas falsas devem ter uma explicação verdadeira no final. Registros contraditórios só podem existir quando a contradição tiver explicação estabelecida, como horário incorreto, relato parcial ou alteração comprovada. Não introduzir solução baseada em um fato sem evidência acessível. Assistências são complementares e opcionais.

## 15. Multijogador e solo

### Sala e sincronização

O anfitrião cria uma sala; participantes entram por código e/ou QR, conforme a implementação aprovada. O estado compartilhado precisa incluir fase, variante, número do loop, início, prazo, pausas, participantes e intervenção autorizada. Cada dispositivo recebe apenas a informação permitida à sua perspectiva.

O relógio de referência deve ser sincronizado por tempo confiável de servidor; uma mudança no relógio local não pode acelerar ou atrasar a sessão. Ao voltar de uma desconexão, a pessoa retoma o estado público corrente e seu próprio caderno, sem reiniciar o tempo para os demais. A política de pausa do anfitrião, ausência prolongada e entrada tardia precisa ser definida e testada.

O grupo pode discutir e compartilhar informações; detalhes de chat, comunicação presencial e ajuda comum estão em aberto. A pontuação pode ser individual, com avaliação coletiva da intervenção, desde que o modo e as regras estejam claros antes da partida.

### Modo solo

Modo desejado, ainda não especificado por completo. Exige cobertura verificável dos fatos, opções suficientes de observação e um plano final possível para uma só pessoa. Pode usar adaptações de fontes, oportunidades adicionais ou ações executáveis individualmente, sem pressupor que basta manter as regras do grupo. Número de loops e duração do modo solo dependem de testes.

## 16. Narrativa e estrutura de conteúdo

Cada cenário deve ser escrito antes de sua implementação com: premissa; atmosfera; situação inicial; fatos de fundo; história canônica da variante; personagens e objetivos; linha do tempo; mapa de deslocamentos; inventário de pistas; hipóteses alternativas; momentos de descoberta; intervenção; consequências; revelação; e textos públicos separados dos segredos de direção.

O roteiro do inventor propõe uma âncora temporal, um dispositivo aparentemente incompleto e experiências anteriores. Ele é material de desenvolvimento, não uma resposta fixa para todas as partidas. Sua cronologia exige resolver a aparente divergência entre estrondo, falha elétrica, descarga e ativação, bem como esclarecer como o inventor poderia conhecer o funcionamento de um protótipo depois entregue incompleto.

Manter a promessa de suspense sem assassinato obrigatório. As pessoas possuem razões e segredos próprios. Um acontecimento pode ser acidental, intencional ou resultar de decisões independentes. O final deve esclarecer pistas enganosas e deixar explícito o que foi observado e o que é interpretação.

## 17. Interface, acessibilidade e direção audiovisual

Priorizar celular: cronômetro legível, ambiente selecionado, ação atual e acesso ao caderno. Pistas pessoais e jogadas devem permanecer próximas. Evitar excesso de painéis sobre a maquete. Pausas mostram hipótese, pistas opcionais, compartilhamento e escolha do próximo ambiente sem expor respostas.

A direção visual desejada acompanha a identidade Dragon: atmosfera envolvente, profundidade, botões com volume, tipografia legível e cores que diferenciem estados. Os sinais essenciais não dependem apenas de cor, áudio ou gestos finos. Fornecer legendas, controles de som, alvos de toque adequados, opções de movimento reduzido e equivalentes para interações 3D. Compatibilidade real deve ser testada em dispositivos.

O som, a luz de emergência e o retorno do tempo podem produzir tensão. A intensidade e frequência de flashes exigem alternativa reduzida ou desativável. A arte final, personagens, efeitos e imagens não foram encomendados ou produzidos neste documento.

## 18. Museu e ativos tridimensionais

A maquete pode ser dividida por cômodos ou carregada progressivamente, com versões adequadas ao celular. A visualização pode ser em 3D convencional e, se validada para os dispositivos, em RA; as pistas essenciais devem ter acesso equivalente sem RA.

Candidatos encontrados em pesquisa anterior, ainda sem download, inspeção técnica ou validação visual nesta entrega:

- Art Gallery and Exhibition Rooms: https://3dassets.dev/packs/art-gallery-and-exhibition-rooms — conjunto anunciado como CC0 com cena inicial e peças separadas; verificar origem, versão, qualidade e licença no momento de uso.
- Galleries, 1DesignTool: https://1designtool.com/3d/models/museum-galleries — galeria leve sob licença própria; a página informa restrições de redistribuição do arquivo isolado ou em pacote.
- Museum, Grab3D: https://grab3d.com/models/buildings/museum/ — fachada anunciada como CC0; não se pressupõe interior utilizável.
- Smithsonian Open Access: https://www.si.edu/spotlight/openaccesshighlights — peças individuais quando marcadas como CC0, observando a identificação de cada item.

Licenças de modelos, texturas, obras, marcas e arquivos derivados devem ser registradas separadamente. A seleção de um modelo anunciado como gratuito não comprova, por si só, compatibilidade estética, desempenho ou direitos de todos os elementos incorporados.

## 19. Direção técnica inicial

O projeto existente da Dragon emprega HTML, CSS, JavaScript, Firebase e Three.js em diferentes experiências. Esta é uma referência para análise de compatibilidade, não uma decisão de copiar a arquitetura ou a configuração de outro jogo. A escolha final deve considerar o repositório próprio, custo, autenticação, privacidade, manutenção e testes.

Separar estado da partida e regras; relógio e sincronização; conteúdo narrativo; interface; renderização 3D; e persistência. O servidor ou serviço autorizado deve controlar a realidade selecionada e os dados secretos; esconder uma resposta na interface não protege um conteúdo enviado integralmente ao navegador. Avaliar regras de acesso, integridade de ações, reconexão e tratamento de dados antes de publicar.

Metas numéricas de carregamento, fluidez e limites de tamanho serão definidas após medir dispositivos de referência. Planejar compressão, carregamento por ambiente, descarte de recursos e qualidade adaptativa, preservando legibilidade e movimentos importantes.

## 20. Testes e critérios de aceite

### Coerência da história

- Cada cenário tem uma realidade documentada, uma cronologia única e uma relação de causa e efeito verificável.
- Os deslocamentos cabem nos horários; personagens não estão em dois lugares simultaneamente.
- Testemunhos, registros e observações correspondem ao que cada perspectiva pode perceber.
- Toda pista enganosa tem explicação e toda conclusão cobrada tem evidência acessível.
- Códigos, portas e objetos retornam corretamente no início do loop.
- Uma ação que altera eventos produz a ramificação prevista; a solução final esclarece o que mudou.

### Experiência e cobertura

- Executar pelo menos 15 partidas de cobertura com as configurações efetivamente implementadas; registrar cenário, variante, quantidade de pessoas, caminhos, resultado e falhas.
- Conferir variedade significativa entre as 15, não apenas alterações cosméticas, e não prometer 15 possibilidades antes de elas existirem.
- Testar grupos de tamanhos variados e solo, incluindo jogadores que escolhem o mesmo ambiente, caminhos pouco informativos e pessoas que não compartilham pistas.
- Verificar as duas fontes por fato e a possibilidade efetiva de alcançá-las no limite de escolhas.
- Cronometrar abertura, cinco loops, pausas, hipóteses, intervenção e revelação separadamente.
- Testar ajudas, respostas parciais, opções não sei, pontuação e ausência de pressupostos falsos.
- Testar desconexão, retorno, pausa, expiração de tempo, duplicidade de ação, dispositivos e navegadores prioritários.
- Realizar partidas observadas com pessoas; testes automatizados e simulações não substituem playtests humanos.

## 21. Etapas de produção

1. **Definição narrativa:** decidir o primeiro acontecimento, o papel do inventor, a ordem causal e a regra diegética do retorno.
2. **Mapa e cronologia:** fechar salas, visibilidade, rotas, cinco minutos e premissas para todos os participantes.
3. **Primeira história completa:** escrever uma variante com pistas, hipóteses, resultado e intervenções.
4. **Protótipo de fluxo:** testar seleção de ambientes, relógio, memória e resolução sem depender de maquete final.
5. **Multijogador e reconexão:** implementar sincronização e proteção de dados compatíveis com a infraestrutura escolhida.
6. **Museu e interação:** avaliar modelos candidatos, licenças, aparência e desempenho antes de incorporá-los.
7. **Expansão de conteúdo:** produzir e validar as variantes até alcançar a meta de 15 partidas significativas.
8. **Playtests e revisão:** testar duração, acessibilidade, compreensão, rejogabilidade e justiça; corrigir antes de disponibilizar.

## 22. Decisões pendentes

| Decisão | Estado atual |
|---|---|
| Fato principal da primeira história | Em aberto; deve ser descoberto durante o jogo. |
| Explicação definitiva do loop | Protótipo e inventor são proposta de roteiro; causalidade precisa ser consolidada. |
| Limite de jogadores e regras do anfitrião | Em aberto; definir com base em testes e infraestrutura. |
| Cinco loops de investigação ou quatro mais intervenção | Duas propostas; comparar ritmo, duração e cobertura. |
| Intervenções antes do loop final | Em aberto; exigem ramificações consistentes. |
| Histórico e prevenção de repetição | Proposta de ciclo de 15; identificar onde e para quem persistirá. |
| Cooperativo, competitivo e compartilhamento de pistas | Modos candidatos; formalizar antes da implementação. |
| Pesos finais, uso de ajudas e previsão antecipada | Valores de referência neste documento; calibrar com testes. |
| Maquete, 3D e RA | Modelos candidatos identificados; falta inspeção, direitos e desempenho. |
| Modo solo e adaptações | Desejado; requer regras e teste próprios. |

## 23. Referências de concepção

- Roteiro-base Loop fornecido por Mário para discussão; os elementos de revelação são tratados como proposta narrativa.
- Padrão de Personagens, Jogadores e Motor — Modo Impostor: https://chatgpt.com/library?file_id=libfile_1ea3784ba5a481919955b9f78bb90a14&account_id=personal. O ciclo de 15 mencionado ali se refere à cobertura e validação daquele modo.
- Guia da História MOSAICO: https://chatgpt.com/library?file_id=libfile_c63bd6e777d88191be2bc9e48525eb65&account_id=personal. O novo projeto pode variar acontecimentos entre partidas conforme a proposta atual, mesmo quando um guia de outro modo trabalha com um cânone comum.
- Dragon Games, documentação do repositório: https://github.com/DrMarioNascimento/Dragon

**Documento de trabalho.** As propostas e metas ainda não são funcionalidades implementadas, testes realizados ou decisões finais de publicação.
