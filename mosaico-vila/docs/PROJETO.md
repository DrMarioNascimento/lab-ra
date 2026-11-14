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
- Metas coletivas das duas regras: Monopólio (eficiência) = patrimônio médio de 54 por pessoa e mata acima de 30%; Prosperidade (equidade) = a família mais pobre com pelo menos 70% do patrimônio médio e mata acima de 30%. Votação: maioria simples dos votos enviados; empate mantém a regra atual. A meta do Monopólio aparece desde o ano 1 (exemplo do ano 1 e barra no telão e no celular a cada "Como ficou a vila", `progressoMeta()` em `regras.js`); depois do voto, a barra mostra a meta da regra vigente. (R19: antes 50 e 75%; ver a seção R19.)
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

## R15 (14/11/2026, após os avaliadores DM e DN)
- Meta do Monopólio em 50 por pessoa (`VITORIA.patrimonioPorPessoa`): com 42, ela já estava batida no voto. Nas 60 partidas do protótipo, o patrimônio médio fica entre 41 e 48 por pessoa no voto e entre 46 e 58 no fim do Monopólio.
- Lance: quem não envia oferece 0% (só o mínimo) e o lance não é herdado do ano anterior (`propor` e `decidir` no motor); os participantes simulados reagem ao efeito mostrado (quem precisa de moradia oferece mais).
- Voltar de quem conduz restaura um retrato do estado guardado a cada avanço (`s.pilha`, até 6 passos): as contas nunca rodam duas vezes.
- `pctL()` em `desenho.js`: perto de 30%, 50% e 75%, uma casa decimal (29,6%).
- Fechamento: pergunta 4 conforme o dado, pergunta 3 com o estrago no bem público (`s.estragoPublico`), "De onde vem" (`teoria()`), gráfico e mapa sem invadir os nomes dos painéis; "prefiro não responder" no quem mais dá golpe.

## R16 (14/11/2026, após os avaliadores DO e DP)
- Estrago das cartas com os números da partida (`textoCarta()` em `content/cartas.js`, marcas `{efeito}` e `{feito}`): "a mata cai de 39% para 19%", "o bem público cai do nível 2 para o 1".
- Pequena e grande sobre a mesma base (quem respondeu); o estrago da pequena continua contado sobre a turma inteira. Pergunta 4 com faixa de "quase o mesmo" (diferença menor que 10 pontos) e duas barras ao lado (`barrasPropostas()`); "o que guiou a turma" ao lado da pergunta 5 (`guiouTurma()`), com Ostrom no "De onde vem".
- Mercado: botão "Não queremos lote este ano" (lance −1 vira `semLote`; vale a maioria da família), teto de moradia + 1 lote por família (`tetoLotes()` em `content/regras.js`) e efeito para até 3 lotes no celular. O painel *Mercado* diz quantas famílias ficaram de fora, sem nomes.
- "Como ficou a vila": cada painel fica pelo menos 10 s; `tempoResultado()` soma os painéis (anos 4 e 5: 40 s, mais a carta).
- Meta do Monopólio com uma casa decimal perto de 50 (`nL()` em `desenho.js`).
- Confiança: cada pessoa recebe uma das 4 situações (`distribuirSituacoes()` e `cartaAno4()`), com as mesmas contas (o pedinte honesto volta para trabalhar: +2); o telão mostra as quatro e, no fim do ano, os golpes de cada situação com os números da turma; "não arriscar não custa nada".
- Etapa nova "Conversa antes do voto" (fase `conversa`, 90 s de relógio, pergunta-guia, pergunta de controle no celular); o voto abre depois. Relógio de 1 min em dupla na pergunta 1 do fechamento.
- Testes novos: conversa logo antes do voto, teto de lotes, as 4 situações na turma, e uma partida com 8 de 20 celulares que nunca respondem (as telas não quebram e quem marca "não queremos lote" não compra).

## R17 (14/11/2026, após os avaliadores DQ e DR)
- Pergunta 4 do fechamento: com o dado, "X% disseram 'acertei'; por acaso, seriam cerca de 17%" (antes, "ficaram com o que não era seu", que contava como desonesto quem acertou por acaso).
- Confiança: porcentagem de golpe por situação só quando cada uma teve 5 ou mais pessoas confiando; senão, só o total da turma contra 1 em 4.
- `textoCarta()` com três tempos (`{efeito}` cai, `{feito}` caiu, `{seria}` cairia); mercado sem venda com o motivo real; rodapé do mercado curto (cabe na Prosperidade).
- Pergunta 3: o saldo da mata em pontos da mata cheia (de quanto a quanto, o que as cargas e as propostas tiraram, o que voltou).
- `vista()` no motor: na carta e no mercado, barra, mapa e celular mostram a vila de antes das decisões (`s.antes`).
- Celular: "só para você" numa tela à parte (`loc.verPessoal`); aviso de tema na entrada (telão e celular).
- Conversa antes do voto com o exemplo resolvido das duas regras; "Conversas curtas" no painel (`s.curto`: 60 s antes do voto, 30 s na família nos anos 4 e 5).
- "Reduzir movimento": a sequência continua sem deslizar (as regras no fim de `style.css`); rótulos do mapa em 24 (cerca de 1,6% da TV).

## R18 (14/11/2026, após os avaliadores DS e DT)
- O mercado vem logo depois da abertura dos anos 4 e 5 (no ano 5, depois da proposta grande), antes das decisões (`montarFases`). Os lances ficam à parte (`s.lances`), para não contarem como proposta; o contrafactual faz o leilão antes de fechar o ano. Simulação: versão 44 (`mercado_antes`), r65.
- Proposta pequena com o estrago sem a mata e o nível de agora (`textoCarta(..., { rel: true })`): "a mata perde 20 pontos (de 100 da mata cheia)".
- Painel *A vila*: a variação é a diferença dos números da barra, e a natureza é o resto (as etiquetas fecham).
- Mapa: nome do nível em até duas linhas (`quebra()`), rótulos em 26.
- "De onde vem" da pergunta 4 conforme a carta (Jiang no dado, Cohn e colegas no achado e no extrato, Berg e colegas na confiança).
- Relógio da dupla começa depois dos 90 s da síntese; "quem conduz abre o voto"; no celular, os controles da proposta aparecem quando acaba a conversa da família (`.surge.trava`), com "Já conversamos" para abrir antes.

## R19 (14/11/2026, após os avaliadores DU e DV)
- Metas recalibradas (`VITORIA`): Monopólio 54 por pessoa, Prosperidade 70%. Com 50 e 75% e o mercado antes das decisões, o Monopólio passava quase sempre e a Prosperidade quase nunca. Em 64 partidas do protótipo: meta inteira do Monopólio em 20 de 34, da Prosperidade em 13 de 30; no voto, o patrimônio médio fica entre 42 e 47 e a mais pobre entre 70% e 90% da média. Simulação: versão 45, r66 (Monopólio 4 de 8, Prosperidade 4 de 7).
- Conversa e voto mostram as duas metas com os números de hoje (`duasMetas()`, `metaHoje()` no telão; o mesmo no celular).
- `fecharAno()`: as cargas nunca tiram mais do que a mata tem (acima disso, cada carga rende e tira a sua parte), e a "natureza" do painel deixa de ser um resto impossível.
- Nomes e cores das famílias embaralhados pela semente (a herança muda de cor); cabeçalho do celular com o caixa de antes das decisões nas cartas; o celular diz o que a família levou no mercado; deixas "voltem às famílias"; "1 família recebeu o piso".
- Telão: referências curtas no "De onde vem", confiança e conversa sem passar da TV, rótulos dos gráficos em F − 1 e do mapa em 26 a 27.

## R20 (14/11/2026, após os avaliadores DW e DX)
- Voto pela vila que a turma quer: pergunta-guia de valores ("a que faz o patrimônio médio crescer ou a que não deixa a família mais pobre para trás?"), as duas metas lado a lado sem o número de hoje (`duasMetas()` no telão, `duasMetasCel()` no celular, na conversa e no voto), barra com "duas metas" nessas duas etapas e a frase "nos testes, cada meta saiu em cerca de metade das partidas". O número de hoje inclinava o voto: no fim do ano 3, a meta de equidade estava batida em quase todas as partidas e a de eficiência em nenhuma.
- `contrafactual()` devolve também o patrimônio médio e a razão da mais pobre.
- "aceitariam" na barra da grande; escala da desigualdade a partir de 0,3; "6 + 2 × o ano"; "metade do que se oferece além do mínimo"; cartões das famílias em ordem alfabética; mata em 0% sem "cai de 0% para 0%"; nome do nível em 27.
