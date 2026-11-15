# Mosaico Vila Ética

Versão do Mosaico Vila para a disciplina de Ética e Deontologia: o mesmo jogo da vila (famílias, bem público, mata, aluguel, voto da regra, propostas de corrupção, honestidade e confiança), com o vocabulário técnico da ética em cada momento, um glossário no celular e um Momento do Lazer para fixar os conceitos.

- **Base dos conceitos:** os slides de Ética e Deontologia da Educação Física (UDESC/CEFID, 2026/2: Aranha e Martins, Chaui; Sócrates, Aristóteles, Rousseau, Kant, Hegel, Espinosa, Freud, Bergson, MacIntyre, Sartre, Merleau-Ponty) e o texto de apoio (ética × moral, Platão, Hume, ética do afeto); complementos: utilitarismo, Rawls, Hardin, ética do cuidado e o Código de Ética do CONFEF. Os verbetes ficam em `js/content/glossario.js`.
- **Glossário:** botão no topo do celular; os verbetes se abrem conforme a partida avança (famílias, cada ano, o lazer e o fechamento), com "novo" nos do momento.
- **Termos técnicos:** faixa de conceitos no telão (famílias, aberturas, conversa antes do voto, lazer), o conceito de cada painel do "Como ficou a vila" e os conceitos de cada pergunta do fechamento na linha do título.
- **Momento do Lazer:** depois do voto (fim do ano 3), 60 s; a semente sorteia o jogo da memória (12 pares, 24 cartas) ou o Acerte a sequência (8 botões de cor fixa, uma por categoria do glossário, com o termo mudando a cada rodada), o máximo que o Mosaico Sala usa e que cabe no celular (medido de 320 × 568 a 412 × 915). Quem chega a 5 pares ou 5 rodadas dá 1 ponto ao bem público (menos, proporcional; teto de 1 por pessoa).
- **Tempo:** as conversas curtas vêm ligadas para pagar o lazer. Na simulação (315 partidas, × 1,25 para a sala): mediana de 48,2 min, pior caso de 49,6. Se atrasar, desligue a carta do ano 4.
- Herda da Vila a R38 (modo vizinhos, de 2 a 11 pessoas) e todas as regras de privacidade (nada no telão com menos de 5 respostas).

Arquivos próprios (cópia da pasta `mosaico-vila` em 14/11/2026); `/simulador` como na Vila. Testes: `node tests/partidas.mjs`.
