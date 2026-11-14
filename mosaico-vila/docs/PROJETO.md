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
- Patrimônio = caixa + lotes × (10 + 2 × nível do bem público). É ele que aparece nas barras do telão e conta nas metas.
- Herança desigual de propósito: a Família Verde começa com 50% a mais de caixa e 3 lotes; a última família começa sem lote.
- Decisão da família: mediana das propostas de quem está nela (ninguém decide sozinho; quem não envia mantém a proposta anterior).
- Metas coletivas das duas regras: Monopólio (eficiência) = patrimônio médio de 42 por pessoa e mata acima de 30%; Prosperidade (equidade) = a família mais pobre com pelo menos 60% do patrimônio médio e mata acima de 30%. Votação: maioria simples dos votos enviados; empate mantém a regra atual. A meta do Monopólio aparece desde o ano 1 (exemplo do ano 1 e barra no telão e no celular a cada "Como ficou a vila", `progressoMeta()` em `regras.js`); depois do voto, a barra mostra a meta da regra vigente.
- Placar de cada pessoa (só no celular dela, no fechamento) = patrimônio da família ÷ pessoas da família + pontos pessoais (alvará e troco). Os pontos pessoais nunca entram no caixa, no patrimônio, nas metas ou no telão.

## Cada regra nova
Nos anos 1 a 4, o telão mostra um exemplo resolvido (`EXEMPLO_DO_ANO` em `vila.js`) e o celular faz uma pergunta de controle; quem erra vê a explicação. Não vale ponto.

## Os acontecimentos
- Todo ano, o telão mostra a desigualdade da renda do ano (por pessoa, depois do aluguel) ao lado da do patrimônio, e a linha do tempo do fechamento tem as duas (R10): a do patrimônio quase não se mexe num ano, porque os lotes já contam; a da renda mostra a regra mordendo.
- Fim do ano 3: a votação da regra (Monopólio × Prosperidade), que vale para os anos 4 e 5, respondida por cada um no próprio lugar, longe da família. Antes, o telão mostra em barras quanto as famílias sem lote pagaram e quanto as com lote sobrando receberam, e a desigualdade da renda do ano antes e depois do aluguel; na tela do voto, um exemplo resolvido das duas regras e, no celular, uma pergunta de controle (`EXEMPLO_VOTO`).
- Ano 4, o troco do mercado (opcional, desligado por padrão; o professor liga no painel): Jogo da Mente com 1 rodada; cada "acertei" vale 3 pontos pessoais, que não vão para o caixa da família (o caixa de 3 a 6 pessoas revelaria os relatos). O telão compara a porcentagem de "acertei" com o acaso (≈17%) só com 5 ou mais respostas.
- Ano 5, o alvará: cada pessoa responde, no próprio lugar, se aceitaria 8 pontos pessoais para aprovar uma obra sem vistoria (método da estratégia); vale a resposta de uma pessoa sorteada, que nunca é revelada. Se ela aceitar, ganha os 8 pontos pessoais e o bem público perde um nível. O telão mostra só a porcentagem de quem aceitaria. Como os pontos são pessoais e decide uma pessoa só, nenhum caixa de família revela voto de ninguém.
- Saíram da Vila: o boato do corretor (o ano 3 ficava com três novidades) e o módulo "Quem Defende?" (em 2 minutos e sem tempo de acolhimento, o tema fica exposto; ele segue na combinação C4).

## A vila na outra regra
No fim do ano 3, o motor guarda a vila (`snap3`). No fechamento, `contrafactual()` em `regras.js` refaz os anos 4 e 5 na regra que a turma não escolheu, com as mesmas propostas, lances e alvará, e o telão mostra a desigualdade final e se a meta seria batida, avisando que é um "e se".

## Anonimato e cuidado
- Nenhuma escolha individual aparece no telão; agregados só com 5 respostas ou mais.
- O telão não mostra extrato, caixa ou lote com nome ou cor de família (as famílias têm de 3 a 6 pessoas): os lotes aparecem numa cor neutra e o patrimônio em barras sem nome; cada família vê o próprio extrato e a própria posição só no celular.
- Nada de engano: o celular diz que a construtora é personagem do jogo e que os pontos valem no placar; o dado é rolado pelo sistema.
- Personagens (corretor, construtora) são fictícios e não representam ninguém da sala.

## O que os testes verificam (`node tests/partidas.mjs`)
15 partidas completas, turmas de 12 a 40, com os mesmos participantes simulados do `/simulador`: chega ao fechamento; 5 anos em sequência; voto no ano 3; troco no ano 4 só quando ligado (testado numa das partidas) e, nesse caso, em pontos pessoais; alvará no ano 5 decidido por uma pessoa sorteada, com os 8 pontos pessoais; pergunta de controle antes do voto; a vila na outra regra calculada; desigualdade da renda registrada todo ano e subindo quando o aluguel entra (em pelo menos 12 de 15); barra da meta calculada; mata que volta acima de 30% replantando, com o fim do colapso; sem boato; mercado só a partir do ano 4; aluguel só a partir do ano 3; perguntas de controle respondidas nos anos 1 a 4; lotes do mapa = lotes das famílias; caixa finito; mata entre 0 e o teto; todos numa família; nenhuma renda negativa (piso); progresso coerente em todas as fases. Os resultados variam de partida a partida (os participantes simulados sorteiam). Na simulação em Python (versão r11), com as mesmas regras: a desigualdade da renda do ano vai de 0,00 para 0,18 quando o aluguel entra (15 de 15) e, no ano 5, fica em 0,13 no Monopólio e 0,02 na Prosperidade; a do patrimônio fica em 0,13 e 0,09; a troca passa em 7 de 15 (nos testes do protótipo, entre 3 e 9 de 15, conforme o sorteio); a mata colapsa em 2 de 15, sempre no ano 5.

## Limites do protótipo
- Ícones das famílias, do bem público e dos acontecimentos são SVG provisórios (ver ICONES-PROMPTS.md).
- O som opcional da revelação, previsto no GDD, ainda não está no protótipo.
- Sala real com celulares depende do Firebase.
- Não testado em aparelho físico nem com turma real; a simulação não reproduz emoção, qualidade da conversa e cansaço além do modelo.
- Não está listado em `bancadas.html` nem publicado no repositório: aguarda aprovação do professor.
