# GDD Cinco Minutos para o Fim

**Documento de concep��o e design de jogo**  
**Vers�o:** 1.0 para discuss�o � 18 de novembro de 2026  
**Projeto:** Dragon Games � t�tulo provis�rio  
**Status:** proposta de design; narrativa, balanceamento, arquitetura e recursos 3D ainda dependem de defini��o e testes.

---

## 1. Vis�o geral

Cinco Minutos para o Fim � um jogo de investiga��o para navegador em que um museu e as pessoas dentro dele retornam repetidamente ao mesmo intervalo de cinco minutos. V�rios jogadores investigam em tempo real, cada um escolhendo um ambiente por ciclo. Eles acumulam conhecimento, relacionam ind�cios, registram hip�teses e tentam antecipar ou modificar o acontecimento da partida.

O fato principal n�o � informado na abertura. Um estrondo, um apag�o e um alarme s�o percebidos, mas suas causas, rela��es e consequ�ncias precisam ser descobertas. O que o jogador testemunha depende de onde est� e do que pode ver ou ouvir.

A experi�ncia combina suspense, descoberta, escolhas e colabora��o ou competi��o amig�vel, sem depender de assassinato. A hist�ria pode ter humor, emo��o, equ�vocos, segredos e a��es intencionais. O universo permite diferentes partidas e acontecimentos, mantendo a coer�ncia interna de cada uma.

### Identidade do projeto

| Aspecto | Dire��o inicial |
|---|---|
| G�nero | Investiga��o narrativa, dedu��o distribu�da e loop temporal |
| Plataforma | Navegador em celulares e computadores; tel�o e RA s�o recursos opcionais a validar |
| Participantes | Multijogador simult�neo; modo solo desejado e ainda a projetar |
| Experi�ncia central | Escolher um ambiente, observar, reunir informa��es, formular hip�teses e intervir |
| Sess�o de refer�ncia | Cinco loops de cinco minutos reais, mais prepara��o, pausas e desfecho |
| Rejogabilidade | Meta m�nima de 15 partidas com diferen�as significativas; ainda n�o produzidas |
| Modelo de acesso | A definir em fun��o do projeto e das autoriza��es existentes |
| P�blico | Pessoas interessadas em mist�rio, jogos sociais e investiga��o; classifica��o et�ria a definir |

## 2. Inten��o e pilares

1. **Curiosidade antes da certeza.** O jogador conhece sinais de um acontecimento, mas precisa descobrir o que eles significam.
2. **O tempo passa para todos.** O mesmo intervalo acontece simultaneamente em diferentes ambientes.
3. **A informa��o permanece.** Os objetos e personagens retornam ao estado anterior; o conhecimento adquirido pelo jogador permanece no caderno.
4. **Nenhuma pessoa v� tudo.** As escolhas distribuem perspectivas e tornam a conversa valiosa, sem impedir a investiga��o individual.
5. **O engano precisa ser justo.** Uma interpreta��o equivocada deve decorrer de evid�ncias incompletas e receber explica��o coerente.
6. **O jogo pode ser revisitado.** Mist�rios, rela��es, personagens e acontecimentos podem variar entre partidas de maneira planejada.
7. **Agir precisa ter consequ�ncia.** Quando uma interven��o � permitida, o resultado deve corresponder ao que foi alterado.

## 3. Terminologia

**Partida:** experi�ncia completa, da abertura � revela��o e ao placar.  
**Loop ou ciclo temporal:** uma repeti��o dos mesmos cinco minutos da hist�ria dentro da partida.  
**Ciclo de 15 partidas:** meta de variedade e cobertura entre partidas completas; n�o significa 15 loops em uma mesma sess�o.  
**Realidade da partida:** conjunto dos fatos, acontecimentos, participantes e rela��es selecionados no come�o da sess�o.  
**Evid�ncia:** registro, observa��o ou relato que pode apoiar ou contestar uma hip�tese.  
**Hip�tese:** interpreta��o formulada pelo jogador, ainda sujeita a revis�o.  
**Interven��o:** a��o prevista que altera alguma condi��o da sequ�ncia original.

## 4. Premissa e abertura

O museu est� pr�ximo do fechamento. Uma exposi��o tempor�ria apresenta inven��es experimentais, entre elas um prot�tipo doado por um inventor. O objeto est� exposto sem uma explica��o completa de seu funcionamento.

Na introdu��o proposta, o visitante observa o prot�tipo. Um estrondo ecoa, as luzes se apagam, a ilumina��o de emerg�ncia entra em opera��o e uma mensagem de seguran�a � reproduzida. Em seguida, o alarme de inc�ndio � acionado e as sa�das de emerg�ncia s�o liberadas conforme a l�gica ficcional. O jogador tenta compreender a situa��o e sair.

O tempo retorna. A partir da�, o jogador percebe a repeti��o e passa a investigar os minutos anteriores. O estrondo e o alarme s�o sinais conhecidos; n�o identificam por si s� o fato central de todas as partidas. N�o se revela antecipadamente se houve roubo, troca, acidente, a��o deliberada ou outro acontecimento.

**Abertura a validar:** para possibilitar a observa��o de eventos anteriores ao estrondo, o primeiro retorno deve levar a um ponto antes dele. Uma introdu��o encenada pode mostrar apenas parte de um ciclo inicial; os cinco minutos completos passam a ser jog�veis depois do retorno. O roteiro apresentado originalmente colocava o retorno diante da m�quina no instante do estrondo: essa adapta��o temporal ainda precisa de valida��o narrativa.

## 5. O intervalo de cinco minutos

### Cronologia ilustrativa

Esta cronologia � uma estrutura de teste, n�o uma solu��o definitiva. Cada cen�rio ter� sua pr�pria cadeia de causas e hor�rios compat�veis.

| Rel�gio da hist�ria | Tempo restante | Marco vis�vel ou poss�vel |
|---|---:|---|
| 21h55 | 05:00 | �ncora do loop; o museu e seus personagens retornam �s posi��es definidas. |
| 21h56 | 04:00 | Movimenta��es e decis�es preparat�rias em ambientes diferentes. |
| 21h57 | 03:00 | Estrondo e interrup��o da ilumina��o principal na proposta-base. |
| 21h57min45s | 02:15 | Alarme e libera��o das sa�das de emerg�ncia na proposta-base. |
| 21h59 | 01:00 | Sinais crescentes associados ao fen�meno temporal, se fizerem parte do cen�rio. |
| 22h00 | 00:00 | Retorno � �ncora, salvo se uma interven��o v�lida alterar esse resultado. |

Os rel�gios de fic��o s�o exemplos. Falhas el�tricas, disparo do alarme, manipula��o do prot�tipo e demais fatos devem ser ordenados e justificados em cada realidade de partida, sem presumir que sempre tenham a mesma causa.

### Estado e mem�ria

No retorno, a posi��o f�sica dos objetos, as portas, os personagens e as condi��es do museu voltam ao estado inicial da variante. Jogadores mant�m caderno, anota��es e hip�teses. Um c�digo aprendido s� pode ser reutilizado se, naquela variante, seu valor for realmente v�lido no instante em que for inserido. Informa��es privadas n�o se tornam p�blicas automaticamente.

Os personagens que n�o s�o jogadores n�o conservam mem�ria entre loops no modelo inicial. Qualquer exce��o precisa ser estabelecida pela narrativa e produzir pistas verific�veis.

## 6. La�o principal e estados da partida

**Abertura  escolha simult�nea de ambiente  observa��o durante o loop  retorno  consulta ao caderno e troca de informa��es  nova escolha  hip�tese e interven��o  revela��o e pontua��o.**

1. O anfitri�o cria a sala; participantes entram e se preparam.
2. A abertura apresenta o espa�o e sinais do acontecimento, sem revelar sua explica��o.
3. Cada participante escolhe um ambiente. A escolha � independente; mais de um pode escolher o mesmo local.
4. Os cinco minutos ocorrem com rel�gio compartilhado. Cada pessoa investiga sua perspectiva.
5. O retorno encerra o loop. H� uma pausa de dura��o configur�vel para leitura, troca e pr�xima escolha.
6. O processo se repete. O n�mero de loops e as regras de interven��o s�o par�metros da sess�o.
7. Cada jogador registra uma hip�tese final estruturada, com possibilidade de responder parcialmente ou n�o saber.
8. O grupo ou jogador executa uma interven��o quando dispon�vel.
9. A revela��o recomp�e os acontecimentos, esclarece pistas enganosas e apresenta os resultados.

**Modelo para o primeiro teste:** quatro loops de investiga��o e um quinto com possibilidade de interven��o, totalizando 25 minutos de tempo de loop. Comparar com cinco de investiga��o mais um sexto de interven��o, que soma 30 minutos de loop. Em ambos, introdu��o, pausas, hip�teses e revela��o acrescentam tempo; cerca de 37 a 51 minutos para a primeira op��o � uma estimativa, n�o um resultado medido.

## 7. Escolha dos ambientes

### Regra de refer�ncia

Cada participante escolhe um ambiente por loop. N�o h� reserva exclusiva: pessoas podem se encontrar no mesmo ambiente. A observa��o ocorre em tempo real; ningu�m deve receber conhecimento de outro local sem uma fonte narrativa ou compartilhamento autorizado.

No primeiro teste, o deslocamento at� o ambiente escolhido pode ser representado por uma transi��o no in�cio do loop. A dura��o dessa transi��o e sua coer�ncia com o mapa devem ser definidas antes do roteiro final. A regra de um ambiente por ciclo preserva a escolha com custo e evita exigir que o jogador percorra todo o museu em cinco minutos.

| Ambiente sugerido | Possibilidades de investiga��o |
|---|---|
| Galeria principal | Vitrines, quadros, montagem, visitantes e poss�veis est�tuas vivas. |
| Sala do prot�tipo | Placa da exposi��o, sinais da m�quina, posi��o de visitantes e registros acess�veis. |
| Recep��o | Entrada, registros de presen�a, entregas e comunica��es. |
| Corredor de servi�o | Tr�nsito entre �reas, sons, caixas e rotas de funcion�rios. |
| Conserva��o | Inspe��es, tratamento, movimenta��o autorizada e arquivos de pe�as. |
| Seguran�a ou sala t�cnica | Registros de sistema, ilumina��o, comunica��es e controles apropriados. |
| Dep�sito | Embalagens, invent�rio e movimenta��o de obras. |
| Jardim de esculturas | Exposi��es externas, acessos vis�veis e oportunidades para uma figura disfar�ada. |

Esses espa�os s�o candidatos, n�o uma lista fechada. O mapa definitivo precisar� especificar conex�es, rotas, dist�ncias, hor�rios, o que � visto e ouvido, acessibilidade e disponibilidade de pistas.

### Acesso ao local do acontecimento

Pode haver um espa�o inacess�vel durante a investiga��o, mas isso deve decorrer das regras do cen�rio e n�o revelar automaticamente onde ocorreu o fato. Se o jogador estiver em posi��o de ver ou ouvir um acontecimento, a interface deve mostr�-lo ou represent�-lo de modo coerente. A revela��o final pode mostrar perspectivas n�o acessadas, sem introduzir uma prova essencial que n�o pudesse ser inferida antes.

## 8. A��es durante o loop

As a��es candidatas s�o observar uma �rea, selecionar um objeto, ler ou ouvir um registro, acompanhar um personagem vis�vel, fazer perguntas previstas, marcar um hor�rio e guardar uma pista. A quantidade de a��es realiz�veis em cinco minutos deve ser testada e acess�vel por toque, sem exigir destreza excessiva.

Uma a��o de observa��o n�o altera a sequ�ncia central. Uma a��o de interven��o � identificada claramente e tem consequ�ncia definida. No modelo inicial, a��es que mudam a realidade ficam dispon�veis na fase de interven��o. Interven��es em loops anteriores s�o expans�o poss�vel, mas exigem ramifica��es e efeitos consistentes; ainda n�o est�o aprovadas.

N�o se devem esconder automaticamente acontecimentos vis�veis s� para preservar o mist�rio. Objetos e falas podem ser percebidos parcialmente quando isso decorre de dist�ncia, obst�culos, hor�rio ou aten��o do personagem, sem contradizer a apresenta��o ao jogador.

## 9. Caderno, hip�teses e apoio

O caderno fica pr�ximo das jogadas e cont�m registros com origem, local e momento. Os estados sugeridos s�o: **observado**, **relatado por algu�m**, **registro consultado** e **hip�tese pessoal**. Um relato n�o equivale automaticamente a um fato confirmado. O sistema n�o atribui certeza a uma informa��o apenas por ela ter sido compartilhada.

O jogador pode arriscar partes da resposta ao longo da partida e revis�-las. Campos candidatos: o que ocorreu; onde; quando; mecanismo; pessoas ou objetos envolvidos; causa; rela��o com o loop; a��o para alterar o resultado. As perguntas finais devem depender da variante, para n�o pressupor roubo, culpado ou outra resposta que possa ser falsa. Op��es incluem hip�tese incompleta e n�o sei.

### Ajuda gradual inspirada no Mosaico Card

O jogador decide se pede ajuda durante a pausa. A ajuda tem graus progressivos: orienta��o ampla de racioc�nio, indica��o de tipo de fonte ou ambiente e, por fim, informa��o mais espec�fica. Cada pista de apoio � escrita para uma variante v�lida e n�o entrega automaticamente uma resposta falsa ou incompat�vel.

S�o candidatos um apoio pessoal e um apoio compartilhado pelo grupo. Suas regras de custo, visibilidade e eventual efeito na pontua��o precisam ser anunciadas antes da escolha e testadas. Pedir ajuda n�o impede continuar nem deve eliminar a possibilidade de pontuar. O jogo n�o deve depender de ajuda externa para que as pistas essenciais sejam acess�veis.

## 10. Pontua��o e resolu��o

Cada participante apresenta suas respostas. A mesma realidade de partida fornece o gabarito; respostas parciais recebem cr�dito proporcional quando houver crit�rios definidos antecipadamente. Justificativas livres podem enriquecer a conversa, mas n�o devem ser pontuadas automaticamente sem um sistema de avalia��o explicitamente projetado e testado.

### Distribui��o inicial para teste

| Eixo | Pontos m�ximos | Exemplo de avalia��o |
|---|---:|---|
| Natureza do acontecimento | 20 | Reconhecer o que ocorreu, inclusive quando n�o houve roubo ou crime. |
| Causa ou mecanismo | 20 | Identificar o mecanismo relevante para o mist�rio da variante. |
| Tempo e sequ�ncia | 15 | Ordenar marcos e reconhecer rela��es temporais. |
| Pessoas e objetos | 15 | Identificar participa��o comprovada sem confundir presen�a com responsabilidade. |
| Rela��es entre evid�ncias | 15 | Escolher rela��es de apoio e contraprova previstas no gabarito. |
| Interven��o | 15 | Escolher uma a��o coerente e o ponto adequado para alterar o resultado. |
| **Total** | **100** | Distribui��o provis�ria, a calibrar por testes. |

Para cada variante, os campos e o cr�dito parcial precisam ser documentados; se um eixo n�o se aplicar, seus pontos ser�o redistribu�dos previamente e comunicados. Pontua��o por antecipa��o e custo de ajudas s�o propostas em aberto; n�o se somam a esta tabela at� existir regra definida. O resultado destaca acertos, hip�teses plaus�veis e limita��es do que foi observado. A revela��o mostra a sequ�ncia original, as fontes e as consequ�ncias da interven��o.

## 11. Interven��o e finais

O grupo ou jogador escolhe entre a��es vi�veis constru�das a partir das evid�ncias dispon�veis. O sistema deve explicitar qual a��o foi escolhida, em que ambiente e quando ser� executada. Em sess�es com pessoas suficientes, uma a��o composta pode ser distribu�da entre ambientes; para poucos participantes, a variante precisa oferecer um plano vi�vel com a quantidade presente. O m�todo de decis�o coletiva, vota��o e resolu��o de a��es incompat�veis ainda deve ser definido.

Cada cen�rio precisa registrar pelo menos: estado original; condi��es da a��o; consequ�ncia direta; efeito sobre o acontecimento; efeito sobre o loop; e explica��o mostrada depois. Acertar a hip�tese e interromper o loop s�o resultados diferentes. � poss�vel compreender o fato sem escolher a interven��o adequada, ou alterar uma consequ�ncia sem eliminar a causa.

Finais candidatos: tempo continua e acontecimento � evitado; tempo continua mas uma consequ�ncia permanece; acontecimento muda e loop persiste; nenhum dos objetivos � alcan�ado; conclus�o parcial por falta de evid�ncia. N�o se deve prometer que todas as variantes ter�o todos os finais antes de serem escritos e testados.

## 12. Personagem disfar�ado de obra

Uma pessoa pode se passar por escultura, manequim ou instala��o. Sua exist�ncia, papel, local, apar�ncia, motivo, relato e rela��o com a hist�ria mudam conforme a variante; tamb�m podem existir partidas sem essa pessoa. N�o deve haver um �nico lugar que sempre revele a resposta.

| Vers�o candidata | Motivo | Contribui��o e limite |
|---|---|---|
| Guarda | Escondeu-se por medo depois de perceber algo. | Testemunhou uma parte da movimenta��o; sua interpreta��o pode ser incompleta. |
| Artista | Prepara uma apresenta��o como est�tua viva. | Ouviu uma conversa, mas pode n�o saber seu contexto. |
| Restaurador ou restauradora | Protege uma pe�a ou participa de uma montagem. | Conhece um procedimento, sem necessariamente conhecer o acontecimento inteiro. |
| Visitante | Escondeu-se ap�s entrar em uma �rea restrita. | Viu parte de uma a��o e tem motivo para omitir sua presen�a. |
| Funcion�rio ou funcion�ria | Prepara uma surpresa. | Explica uma movimenta��o suspeita que pode ser independente do evento central. |
| Figura com plano pr�prio | Tenta observar ou agir sem ser identificada. | Sua responsabilidade precisa ser estabelecida por evid�ncias, n�o pelo disfarce. |

Todas as vers�es precisam de trajet�ria, tempo, visibilidade, evid�ncias, rela��o causal ou independ�ncia expl�cita e explica��o final. A mesma solu��o n�o deve ser indicada apenas por uma anima��o min�scula, um objeto sempre igual ou uma pergunta que entregue o segredo.

## 13. Rejogabilidade e matriz de 15 partidas

**Meta de design:** ao menos 15 configura��es de partida com diferen�as narrativas significativas, verific�veis e jog�veis. N�o h� 15 cen�rios prontos neste documento; a lista a seguir � uma matriz inicial de cria��o, sujeita a escrita, combina��o compat�vel e testes.

| N� | Foco provis�rio | Pergunta de cria��o para a equipe |
|---:|---|---|
| 01 | Ativa��o do prot�tipo | Quem ou o que completou as condi��es de ativa��o? |
| 02 | Falha el�trica | O que a originou e qual foi seu efeito sobre a m�quina? |
| 03 | Alarme autom�tico | Qual evento acionou o sistema e com que evid�ncia? |
| 04 | Acionamento humano do alarme | Quem acionou o alarme e por qual motivo? |
| 05 | Pe�a retirada para prote��o | O que motivou a retirada e onde ficou a pe�a? |
| 06 | Troca autorizada | Por que houve a substitui��o e quem sabia dela? |
| 07 | Troca indevida | Como distinguir a inten��o, o m�todo e o destino das pe�as? |
| 08 | Caixa identificada incorretamente | Como a diverg�ncia de registros gerou uma falsa conclus�o? |
| 09 | Visita inesperada | Quem entrou e qual rela��o tem com os fatos da noite? |
| 10 | Homenagem interrompida | O que era preparado e qual acontecimento interrompeu o plano? |
| 11 | Instala��o art�stica interrompida | Qual era a a��o prevista e o que a alterou? |
| 12 | Informa��o do inventor | Que registro foi mal interpretado e por quem? |
| 13 | Guarda escondido | O que o guarda observou e o que interpretou equivocadamente? |
| 14 | Obra deslocada | Quem a movimentou e se isso se relaciona ao evento central? |
| 15 | Dois fatos independentes | Quais acontecimentos coincidiram sem rela��o causal? |

Esses focos precisam ser transformados em realidades completas e diferenciadas; simplesmente mudar nome, cor ou posi��o n�o conta como uma nova partida significativa. Uma variante pode combinar temas apenas quando causa, cronologia e evid�ncias forem consistentes. Evitar sinaliza��es que entreguem a solu��o por reconhecimento de padr�o.

### Sele��o e hist�rico

O sistema seleciona apenas combina��es previamente validadas e registra a variante usada no hist�rico definido para a mesa. Proposta: n�o repetir uma configura��o completa no mesmo ciclo de 15 at� esgotar as dispon�veis, respeitando os cen�rios eleg�veis para o n�mero de participantes. O escopo desse hist�rico - anfitri�o, grupo ou outro identificador - precisa ser decidido; mudan�as de anfitri�o, grupos mistos e perda de hist�rico impedem prometer aus�ncia universal de repeti��o.

Em cada partida, registra-se em sigilo a realidade selecionada, sua vers�o e o estado inicial. Durante os loops, a sequ�ncia-base permanece consistente; a interven��o autorizada cria uma ramifica��o rastre�vel. O ciclo de valida��o de 15 partidas documentado para outro modo MOSAICO � refer�ncia de cobertura, n�o prova de que este jogo j� possui 15 hist�rias nem regra autom�tica de autoria para todos os cen�rios.

## 14. Distribui��o de pistas e justi�a

Para cada fato essencial, planejar pelo menos duas fontes independentes, incluindo uma fonte que n�o dependa exclusivamente do relato de um personagem. Uma observa��o direta, um registro e uma consequ�ncia podem sustentar a mesma conclus�o por caminhos diferentes; n�o � necess�rio que todas as fontes estejam no mesmo ambiente.

O crit�rio de duas fontes � necess�rio, mas n�o suficiente: com uma pessoa, cinco loops e um ambiente por loop, as fontes precisam ser alcan��veis nas rotas dispon�veis. Cada variante deve apresentar uma matriz de cobertura por n�mero de jogadores e por escolhas poss�veis. Quando uma combina��o de ambientes deixar o jogador sem fatos necess�rios, adicionar uma alternativa, uma recupera��o planejada, mais oportunidade de acesso ou recalibrar a variante.

Pistas falsas devem ter uma explica��o verdadeira no final. Registros contradit�rios s� podem existir quando a contradi��o tiver explica��o estabelecida, como hor�rio incorreto, relato parcial ou altera��o comprovada. N�o introduzir solu��o baseada em um fato sem evid�ncia acess�vel. Assist�ncias s�o complementares e opcionais.

## 15. Multijogador e solo

### Sala e sincroniza��o

O anfitri�o cria uma sala; participantes entram por c�digo e/ou QR, conforme a implementa��o aprovada. O estado compartilhado precisa incluir fase, variante, n�mero do loop, in�cio, prazo, pausas, participantes e interven��o autorizada. Cada dispositivo recebe apenas a informa��o permitida � sua perspectiva.

O rel�gio de refer�ncia deve ser sincronizado por tempo confi�vel de servidor; uma mudan�a no rel�gio local n�o pode acelerar ou atrasar a sess�o. Ao voltar de uma desconex�o, a pessoa retoma o estado p�blico corrente e seu pr�prio caderno, sem reiniciar o tempo para os demais. A pol�tica de pausa do anfitri�o, aus�ncia prolongada e entrada tardia precisa ser definida e testada.

O grupo pode discutir e compartilhar informa��es; detalhes de chat, comunica��o presencial e ajuda comum est�o em aberto. A pontua��o pode ser individual, com avalia��o coletiva da interven��o, desde que o modo e as regras estejam claros antes da partida.

### Modo solo

Modo desejado, ainda n�o especificado por completo. Exige cobertura verific�vel dos fatos, op��es suficientes de observa��o e um plano final poss�vel para uma s� pessoa. Pode usar adapta��es de fontes, oportunidades adicionais ou a��es execut�veis individualmente, sem pressupor que basta manter as regras do grupo. N�mero de loops e dura��o do modo solo dependem de testes.

## 16. Narrativa e estrutura de conte�do

Cada cen�rio deve ser escrito antes de sua implementa��o com: premissa; atmosfera; situa��o inicial; fatos de fundo; hist�ria can�nica da variante; personagens e objetivos; linha do tempo; mapa de deslocamentos; invent�rio de pistas; hip�teses alternativas; momentos de descoberta; interven��o; consequ�ncias; revela��o; e textos p�blicos separados dos segredos de dire��o.

O roteiro do inventor prop�e uma �ncora temporal, um dispositivo aparentemente incompleto e experi�ncias anteriores. Ele � material de desenvolvimento, n�o uma resposta fixa para todas as partidas. Sua cronologia exige resolver a aparente diverg�ncia entre estrondo, falha el�trica, descarga e ativa��o, bem como esclarecer como o inventor poderia conhecer o funcionamento de um prot�tipo depois entregue incompleto.

Manter a promessa de suspense sem assassinato obrigat�rio. As pessoas possuem raz�es e segredos pr�prios. Um acontecimento pode ser acidental, intencional ou resultar de decis�es independentes. O final deve esclarecer pistas enganosas e deixar expl�cito o que foi observado e o que � interpreta��o.

## 17. Interface, acessibilidade e dire��o audiovisual

Priorizar celular: cron�metro leg�vel, ambiente selecionado, a��o atual e acesso ao caderno. Pistas pessoais e jogadas devem permanecer pr�ximas. Evitar excesso de pain�is sobre a maquete. Pausas mostram hip�tese, pistas opcionais, compartilhamento e escolha do pr�ximo ambiente sem expor respostas.

A dire��o visual desejada acompanha a identidade Dragon: atmosfera envolvente, profundidade, bot�es com volume, tipografia leg�vel e cores que diferenciem estados. Os sinais essenciais n�o dependem apenas de cor, �udio ou gestos finos. Fornecer legendas, controles de som, alvos de toque adequados, op��es de movimento reduzido e equivalentes para intera��es 3D. Compatibilidade real deve ser testada em dispositivos.

O som, a luz de emerg�ncia e o retorno do tempo podem produzir tens�o. A intensidade e frequ�ncia de flashes exigem alternativa reduzida ou desativ�vel. A arte final, personagens, efeitos e imagens n�o foram encomendados ou produzidos neste documento.

## 18. Museu e ativos tridimensionais

A maquete pode ser dividida por c�modos ou carregada progressivamente, com vers�es adequadas ao celular. A visualiza��o pode ser em 3D convencional e, se validada para os dispositivos, em RA; as pistas essenciais devem ter acesso equivalente sem RA.

Candidatos encontrados em pesquisa anterior, ainda sem download, inspe��o t�cnica ou valida��o visual nesta entrega:

- Art Gallery and Exhibition Rooms: https://3dassets.dev/packs/art-gallery-and-exhibition-rooms - conjunto anunciado como CC0 com cena inicial e pe�as separadas; verificar origem, vers�o, qualidade e licen�a no momento de uso.
- Galleries, 1DesignTool: https://1designtool.com/3d/models/museum-galleries - galeria leve sob licen�a pr�pria; a p�gina informa restri��es de redistribui��o do arquivo isolado ou em pacote.
- Museum, Grab3D: https://grab3d.com/models/buildings/museum/ - fachada anunciada como CC0; n�o se pressup�e interior utiliz�vel.
- Smithsonian Open Access: https://www.si.edu/spotlight/openaccesshighlights - pe�as individuais quando marcadas como CC0, observando a identifica��o de cada item.

Licen�as de modelos, texturas, obras, marcas e arquivos derivados devem ser registradas separadamente. A sele��o de um modelo anunciado como gratuito n�o comprova, por si s�, compatibilidade est�tica, desempenho ou direitos de todos os elementos incorporados.

## 19. Dire��o t�cnica inicial

O projeto existente da Dragon emprega HTML, CSS, JavaScript, Firebase e Three.js em diferentes experi�ncias. Esta � uma refer�ncia para an�lise de compatibilidade, n�o uma decis�o de copiar a arquitetura ou a configura��o de outro jogo. A escolha final deve considerar o reposit�rio pr�prio, custo, autentica��o, privacidade, manuten��o e testes.

Separar estado da partida e regras; rel�gio e sincroniza��o; conte�do narrativo; interface; renderiza��o 3D; e persist�ncia. O servidor ou servi�o autorizado deve controlar a realidade selecionada e os dados secretos; esconder uma resposta na interface n�o protege um conte�do enviado integralmente ao navegador. Avaliar regras de acesso, integridade de a��es, reconex�o e tratamento de dados antes de publicar.

Metas num�ricas de carregamento, fluidez e limites de tamanho ser�o definidas ap�s medir dispositivos de refer�ncia. Planejar compress�o, carregamento por ambiente, descarte de recursos e qualidade adaptativa, preservando legibilidade e movimentos importantes.

## 20. Testes e crit�rios de aceite

### Coer�ncia da hist�ria

- Cada cen�rio tem uma realidade documentada, uma cronologia �nica e uma rela��o de causa e efeito verific�vel.
- Os deslocamentos cabem nos hor�rios; personagens n�o est�o em dois lugares simultaneamente.
- Testemunhos, registros e observa��es correspondem ao que cada perspectiva pode perceber.
- Toda pista enganosa tem explica��o e toda conclus�o cobrada tem evid�ncia acess�vel.
- C�digos, portas e objetos retornam corretamente no in�cio do loop.
- Uma a��o que altera eventos produz a ramifica��o prevista; a solu��o final esclarece o que mudou.

### Experi�ncia e cobertura

- Executar pelo menos 15 partidas de cobertura com as configura��es efetivamente implementadas; registrar cen�rio, variante, quantidade de pessoas, caminhos, resultado e falhas.
- Conferir variedade significativa entre as 15, n�o apenas altera��es cosm�ticas, e n�o prometer 15 possibilidades antes de elas existirem.
- Testar grupos de tamanhos variados e solo, incluindo jogadores que escolhem o mesmo ambiente, caminhos pouco informativos e pessoas que n�o compartilham pistas.
- Verificar as duas fontes por fato e a possibilidade efetiva de alcan��-las no limite de escolhas.
- Cronometrar abertura, cinco loops, pausas, hip�teses, interven��o e revela��o separadamente.
- Testar ajudas, respostas parciais, op��es n�o sei, pontua��o e aus�ncia de pressupostos falsos.
- Testar desconex�o, retorno, pausa, expira��o de tempo, duplicidade de a��o, dispositivos e navegadores priorit�rios.
- Realizar partidas observadas com pessoas; testes automatizados e simula��es n�o substituem playtests humanos.

## 21. Etapas de produ��o

1. **Defini��o narrativa:** decidir o primeiro acontecimento, o papel do inventor, a ordem causal e a regra dieg�tica do retorno.
2. **Mapa e cronologia:** fechar salas, visibilidade, rotas, cinco minutos e premissas para todos os participantes.
3. **Primeira hist�ria completa:** escrever uma variante com pistas, hip�teses, resultado e interven��es.
4. **Prot�tipo de fluxo:** testar sele��o de ambientes, rel�gio, mem�ria e resolu��o sem depender de maquete final.
5. **Multijogador e reconex�o:** implementar sincroniza��o e prote��o de dados compat�veis com a infraestrutura escolhida.
6. **Museu e intera��o:** avaliar modelos candidatos, licen�as, apar�ncia e desempenho antes de incorpor�-los.
7. **Expans�o de conte�do:** produzir e validar as variantes at� alcan�ar a meta de 15 partidas significativas.
8. **Playtests e revis�o:** testar dura��o, acessibilidade, compreens�o, rejogabilidade e justi�a; corrigir antes de disponibilizar.

## 22. Decis�es pendentes

| Decis�o | Estado atual |
|---|---|
| Fato principal da primeira hist�ria | Em aberto; deve ser descoberto durante o jogo. |
| Explica��o definitiva do loop | Prot�tipo e inventor s�o proposta de roteiro; causalidade precisa ser consolidada. |
| Limite de jogadores e regras do anfitri�o | Em aberto; definir com base em testes e infraestrutura. |
| Cinco loops de investiga��o ou quatro mais interven��o | Duas propostas; comparar ritmo, dura��o e cobertura. |
| Interven��es antes do loop final | Em aberto; exigem ramifica��es consistentes. |
| Hist�rico e preven��o de repeti��o | Proposta de ciclo de 15; identificar onde e para quem persistir�. |
| Cooperativo, competitivo e compartilhamento de pistas | Modos candidatos; formalizar antes da implementa��o. |
| Pesos finais, uso de ajudas e previs�o antecipada | Valores de refer�ncia neste documento; calibrar com testes. |
| Maquete, 3D e RA | Modelos candidatos identificados; falta inspe��o, direitos e desempenho. |
| Modo solo e adapta��es | Desejado; requer regras e teste pr�prios. |

## 23. Refer�ncias de concep��o

- Roteiro-base Cinco Minutos para o Fim fornecido por M�rio para discuss�o; os elementos de revela��o s�o tratados como proposta narrativa.
- Padr�o de Personagens, Jogadores e Motor - Modo Impostor: https://chatgpt.com/library?file_id=libfile_1ea3784ba5a481919955b9f78bb90a14&account_id=personal. O ciclo de 15 mencionado ali se refere � cobertura e valida��o daquele modo.
- Guia da Hist�ria MOSAICO: https://chatgpt.com/library?file_id=libfile_c63bd6e777d88191be2bc9e48525eb65&account_id=personal. O novo projeto pode variar acontecimentos entre partidas conforme a proposta atual, mesmo quando um guia de outro modo trabalha com um c�none comum.
- Dragon Games, documenta��o do reposit�rio: https://github.com/DrMarioNascimento/Dragon

**Documento de trabalho.** As propostas e metas ainda n�o s�o funcionalidades implementadas, testes realizados ou decis�es finais de publica��o.

