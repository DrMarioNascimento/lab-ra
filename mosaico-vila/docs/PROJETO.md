# Notas de projeto (não aparecem para o participante)

## De onde veio
O Mosaico Vila é a proposta P7 da biblioteca de GDDs "Fundo Comum" (núcleo de bens públicos com punição, mais módulos: Observador, Jogo da Mente, Mensagem Paga, Circuito do Dinheiro, Quem Defende?, Carteira de Valores e as combinações C1 a C8). Cada proposta passou por 15 partidas simuladas (turmas de 12 a 40), por uma rubrica automática de 34 critérios (Big Five, HEXACO, GAMS e o Padrão MOSAICO v2) e por avaliadores independentes, em rodadas de renovação até a nota mínima de 4,5 em todos os critérios. O GDD completo, com o histórico de renovações, está em `P7-mosaico-vila.md` na biblioteca.

## A regra em números (iguais em `regras.js` e no simulador em Python)
- 5 anos. Famílias: n ≥ 12 → entre 4 e 8 (uma a cada 4 pessoas). 24 lotes no mapa.
- Renda do ano: pessoas × (8 + 2 × nível do bem público), mais bônus (+2/pessoa com a mata em 50% ou mais) ou perda (−4/pessoa enquanto a mata estiver colapsada). Piso de renda: 6 por pessoa, depois de aluguel e imposto.
- Bem público: sobe um nível a cada 12 × número de famílias pontos; 5 níveis (praça, posto de saúde, academia ao ar livre, escola de esportes, centro comunitário).
- Mata: teto de 20 por família, começa em 70%, regenera 20% ao ano (logística). Carga de madeira: −2 na mata, +6 pontos. Replantio: cada 5 pontos devolvem 2. Abaixo de 30% do teto, colapsa; o colapso dura enquanto ela estiver abaixo dos 30% (R10): replantando, ela volta e o −4 acaba.
- Moradia (só a partir do ano 3, quando a regra entra): 1 lote a cada 3 pessoas. Quem não tem paga aluguel (8 no Monopólio, 2 na Prosperidade); o aluguel do ano é dividido entre as famílias com lotes sobrando, na proporção dos lotes que sobram a cada uma. Na Prosperidade, imposto de 1,5 por lote e contribuição de 1 por pessoa vão ao bem público.
- Mercado a partir do ano 4: até 3 lotes livres por ano, lance fechado, lance mínimo 6 + 2 × ano; empate, sorteio.
- Patrimônio = caixa + lotes × (10 + 2 × nível do bem público). É ele que aparece nas fileiras de casas do telão e conta nas metas.
- Herança desigual de propósito: a Família Verde começa com 50% a mais de caixa e 3 lotes; a última família começa sem lote.
- Decisão da família: mediana das propostas de quem está nela (ninguém decide sozinho; quem não envia mantém a proposta anterior).
- Metas coletivas das duas regras: Monopólio (eficiência) = patrimônio médio de 42 por pessoa e mata acima de 30%; Prosperidade (equidade) = a família mais pobre com pelo menos 60% do patrimônio médio e mata acima de 30%. Votação: maioria simples dos votos enviados; empate mantém a regra atual. A meta do Monopólio aparece desde o ano 1 (exemplo do ano 1 e barra no telão e no celular a cada "Como ficou a vila", `progressoMeta()` em `regras.js`); depois do voto, a barra mostra a meta da regra vigente.
- Placar de cada pessoa (só no celular dela, no fechamento) = patrimônio da família ÷ pessoas da família + pontos pessoais (os das cartas). Os pontos pessoais nunca entram no caixa, no patrimônio, nas metas ou no telão.

## Cada regra nova
Nos anos 1 a 4, o telão mostra um exemplo resolvido (`EXEMPLO_DO_ANO` em `vila.js`) e o celular faz uma pergunta de controle; quem erra vê a explicação. Não vale ponto.

## Os acontecimentos
- Todo ano, o telão mostra a desigualdade da renda do ano (por pessoa, depois do aluguel) ao lado da do patrimônio, e a linha do tempo do fechamento tem as duas (R10): a do patrimônio quase não se mexe num ano, porque os lotes já contam; a da renda mostra a regra mordendo.
- Fim do ano 3: a votação da regra (Monopólio × Prosperidade), que vale para os anos 4 e 5, respondida por cada um no próprio lugar, longe da família. Antes, o telão mostra em moedas quanto as famílias sem lote pagaram e quanto as com lote sobrando receberam, e a desigualdade da renda do ano antes e depois do aluguel; na tela do voto, um exemplo resolvido das duas regras e, no celular, uma pergunta de controle (`EXEMPLO_VOTO`).
- R13: as situações de corrupção, honestidade e confiança vêm de um baralho (`js/content/cartas.js`), sorteado por partida pela semente (`sortearCartas()`, chamado no `sortear` do motor), como o impostor do MOSAICO: a mesma semente refaz as mesmas cartas. A proposta vem sempre do sistema. Quem conduz vê as cartas no painel.
- Ano 2, a proposta pequena (fase `pequena`): cada um decide por si; cada "aceito" vale +2 pontos pessoais para quem aceitou e tira 1/n do estrago grande (`estragar()` no motor). A turma inteira aceitando = o estrago da grande. Quatro cartas: fiscal da mata, carga do vizinho (mata), madeira sem nota, taxa da praça (bem público).
- Ano 4, a carta de honestidade ou de confiança (fase `mente`; ligada por padrão, o professor desliga no painel): honestidade = o troco do mercado (o dado do Jogo da Mente), o extrato a mais ou o achado da praça (+3 pessoais para quem fica); confiança = o pedido na estrada, a venda fiado, o sinal adiantado ou a carroça dividida (arrisca 2; cada um encontra uma pessoa diferente, com 1 em 4 de golpe em todas as cartas; quem confiou perde sempre os 2 que arriscou). Depois de responder, o celular pergunta quem mais dá golpe; o telão mostra o total e a chance igual para todos.
- Ano 5, a proposta grande (fase `alvara`, logo depois da abertura e antes das decisões; R14): cada pessoa responde, no próprio lugar, se aceitaria 8 pontos pessoais (método da estratégia); vale a resposta de uma pessoa sorteada, que nunca é revelada. Três cartas: o alvará e o contrato da escola (o bem público perde um nível) e a licença da madeireira (a mata perde 20%). Como os pontos são pessoais e decide uma pessoa só, nenhum caixa de família revela voto de ninguém.
- Microtarefas com retorno (`palpitePct`, `quem`, `prev5` e o palpite do lance): o telão mostra quantos acertaram, com 5 ou mais respostas; o celular mostra o acerto de cada um no lance.
- Saíram da Vila: o boato do corretor (o ano 3 ficava com três novidades) e o módulo "Quem Defende?" (em 2 minutos e sem tempo de acolhimento, o tema fica exposto; ele segue na combinação C4).

## A vila na outra regra
No fim do ano 3, o motor guarda a vila (`snap3`). No fechamento, `contrafactual()` em `regras.js` refaz os anos 4 e 5 na regra que a turma não escolheu, com as mesmas propostas, lances e proposta grande (no bem público ou na mata), e o telão mostra a desigualdade final e se a meta seria batida, avisando que é um "e se".

## Anonimato e cuidado
- Nenhuma escolha individual aparece no telão; agregados só com 5 respostas ou mais.
- O telão não mostra extrato, caixa ou lote com nome ou cor de família (as famílias têm de 3 a 6 pessoas): os lotes aparecem numa cor neutra e o patrimônio por pessoa em moedas de 10 pontos, sem nome; cada família vê o próprio extrato e a própria posição só no celular.
- Nada de engano: o celular diz que o personagem da carta é do jogo e que os pontos valem no placar; o dado é rolado pelo sistema.
- Personagens (fiscal, vizinho, serraria, construtora, madeireira, pessoa na estrada, comprador…) são fictícios e não representam ninguém da sala. Na confiança, a chance de golpe e a perda são iguais em todas as cartas, para nenhum tipo de pessoa parecer mais perigoso.

## O que os testes verificam (`node tests/partidas.mjs`)
15 partidas completas, turmas de 12 a 40, com os mesmos participantes simulados do `/simulador`: chega ao fechamento; 5 anos em sequência; proposta pequena no ano 2, voto no ano 3, carta do ano 4 (desligada numa das partidas) e proposta grande no ano 5 decidida por uma pessoa sorteada, com os 8 pontos pessoais; cartas reproduzíveis pela semente e variando entre partidas (pelo menos 8 diferentes em 15); pequena com os 2 pontos pessoais e o estrago aplicado, no máximo 20% da mata; a turma inteira aceitando a pequena = o estrago da grande; golpe perto de 1 em 4; pergunta de controle antes do voto; a vila na outra regra calculada; desigualdade da renda registrada todo ano e subindo quando o aluguel entra (em pelo menos 12 de 15); barra da meta calculada; mata que volta acima de 30% replantando, com o fim do colapso; sem boato; mercado só a partir do ano 4; aluguel só a partir do ano 3; perguntas de controle respondidas nos anos 1 a 4; lotes do mapa = lotes das famílias; caixa finito; mata entre 0 e o teto; todos numa família; nenhuma renda negativa (piso); progresso coerente em todas as fases. Os resultados variam de partida a partida (os participantes simulados sorteiam). Na simulação em Python (versão r61, com as cartas), com as mesmas regras: 35 a 37,5 min simulados; a desigualdade da renda do ano vai de 0,00 para 0,19 quando o aluguel entra (15 de 15) e, no ano 5, fica em 0,13 no Monopólio e 0,02 na Prosperidade; a do patrimônio fica em 0,11 e 0,10; a troca passa em 6 de 15; 40% aceitam a pequena e 47% aceitariam a grande; a mata colapsa em 7 de 15 (quase sempre no ano 5, com a licença da madeireira) e a vila bate a meta em 6 de 15 (sem o estrago das cartas na mata, seriam 3 colapsos e 9 metas).

## Limites do protótipo
- Os prédios do bem público e a moeda são SVG provisórios, e as cartas usam por ora cópias de ícones 3D do jogo (ver ICONES-PROMPTS.md).
- O som opcional da revelação, previsto no GDD, ainda não está no protótipo.
- Sala real com celulares depende do Firebase.
- Não testado em aparelho físico nem com turma real; a simulação não reproduz emoção, qualidade da conversa e cansaço além do modelo.
- Listado em `bancadas.html` como protótipo privado de ética; não testado com turma real.

## Telão para TV (R12, 13/11/2026)
- Letra base de 1,9% da largura do telão (cerca de 36 px numa TV Full HD); nada essencial abaixo disso. Textos curtos no telão (`telao` em `NOVIDADE_DO_ANO`, `EVENTOS` e `REGRAS_TXT`), texto inteiro no celular.
- Barra de ícones fixa (`barra()` em `telao.js`): ano, regra, mata, bem público, meta e lotes livres; no resultado, o que mudou pisca e mostra +/−. O celular tem a mesma barra, pequena (`miniBarra()` em `aluno.js`).
- "Como ficou a vila" em revelações seguidas (`sequencia()`), dentro dos 30 s da fase (75 s no ano 3): a vila, o aluguel (ano 3), acontecimentos, o dinheiro (fileiras de casas, `fileira()` em `desenho.js`) e a desigualdade.
- As animações partem do tempo já decorrido na fase (`decorrido()`): o telão se redesenha a cada envio sem recomeçar a sequência.
- Exemplo resolvido linha a linha; cronômetro de 45 s na conversa da família (contado pelo CSS); fechamento com uma pergunta por vez (ação `pergunta` no motor, botões no painel do professor).
- Simulador: "Ver do fundo da sala" mostra o telão no tamanho aparente de uma TV de 55" a uns 6 m; o professor automático espera as animações (`duracaoTelao()`).

## Cartas sorteadas e correções dos avaliadores (R13, 14/11/2026)
- Baralho em `js/content/cartas.js` (ver "Os acontecimentos"); etapas `pequena`, `mente` e `alvara` no motor; telão `telaoCarta()`; celular `cartaCelular()`, com dois botões iguais.
- "Como ficou a vila" (`paineisResultado()`): painel da carta do ano com tempo próprio (15 s no ano 2, 20 s no ano 4, 40 s no ano 5, em dois painéis), aluguel numa fileira de moedas, patrimônio por pessoa em moedas de 10 pontos com a marca da meta (`dinheiroPorPessoa()`), desigualdade sem casas, linha do tempo em dois gráficos (`linhaDoTempo()` em `desenho.js`). Quem conduz segura, volta e avança os painéis (ação `painel`); o celular mostra o extrato da família quando começa o último painel (`tempoResultado()`).
- Bônus da mata no exemplo do ano 1; mata em % (exemplo do ano 2 calculado com o teto da vila; celular); famílias sem etiqueta de herança no telão; resultado do voto na abertura do ano 4; palpite da desigualdade no ano 5; cores do mapa como as da barra (30% e 50%); quanto falta replantar no colapso.
- Tamanhos mínimos no telão: texto 1,9% da largura (inclusive as linhas apagadas do exemplo), rótulos 1,6%. Prévia do fundo da sala com 460 px.

## R14 (14/11/2026, após os avaliadores DK e DL)
- Proposta grande antes das decisões do ano 5 (`montarFases()`): o estrago entra antes, a renda do ano é refeita (`rendaDoAno()` no `alvara` do motor) e o telão das decisões abre com o que aconteceu e quanto falta replantar (`bannerGrande()`). O fechamento do ano conta o estrago dela (`s.alvara.antes`). O "e se" (`contrafactual()`) faz o mesmo.
- Meta da Prosperidade em 75% (`VITORIA.pobreSobreMedia`); desigualdade do patrimônio e posição da família por pessoa. Em 60 partidas do protótipo, a meta foi batida em 20 de 37 no Monopólio e 15 de 23 na Prosperidade.
- Lance com o efeito na hora (`efeitoLance()` em `aluno.js`), começando em 0%, e as regras do mercado à vista; painel Mercado com preço e valor do lote.
- Fechamento: perguntas encadeadas com o dado real, linha de apoio por pergunta (`apoioPergunta()`: o "e se" na 2, a carta do ano 4 na 4), um gráfico grande por pergunta (`linhaDoTempo(…, { so })`), "o que guiou" na última; cartas com a forma contraída (`de`), regra com artigo.
