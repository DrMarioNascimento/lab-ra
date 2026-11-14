# Mosaico Vila · Uma vila, cinco anos, uma regra para votar

Protótipo de teste no LAB-RA. A turma vira uma vila: cada grupo é uma família com caixa, lotes e uma parte da renda para decidir. A cada ano entra uma novidade (bem público, mata comum, moradia, mercado de lotes), cada uma com exemplo resolvido no telão e pergunta de controle no celular; a honestidade entra em cartas sorteadas a cada partida (como o impostor do MOSAICO), sempre propostas pelo sistema: uma proposta pequena no ano 2, em que cada um decide por si (somada, faz o estrago de uma grande), uma carta de honestidade ou de confiança no ano 4 (na confiança, a chance de golpe é a mesma para todo tipo de pessoa) e uma proposta grande no ano 5, em que vale a resposta de uma pessoa sorteada. Segmento, lado e tamanho mudam de partida para partida. No fim do ano 3, a turma vota se a vila continua no Monopólio (aluguel alto; meta de eficiência: patrimônio médio alto) ou passa à Prosperidade (aluguel baixo, imposto da terra e contribuição por pessoa ao bem público; meta de equidade: ninguém muito atrás). A ideia vem do Landlord's Game de Elizabeth Magie (1904), com mata comum (Ostrom) e jogos de honestidade da economia comportamental.

Cinco anos e fechamento, cerca de 44 a 47 minutos em sala (35 a 38 simulados), de 12 a 40 participantes (4 a 8 famílias).

- `simulador/`: aula simulada no PC (telão em cima, turma embaixo, celulares em piloto automático, professor automático opcional, tela cheia).
- `js/content/regras.js`: números e contas do jogo (renda, mata, aluguel, imposto, leilão, vitória coletiva). Espelho de `vila_regras.py` usado nas simulações.
- `js/content/vila.js`: famílias, níveis do bem público, textos de cada ano, acontecimentos e perguntas do fechamento.
- `js/engine.js`: motor da sala (redutor puro). `js/bots.js`: participantes simulados.
- `js/views/`: telas do telão, do celular e do professor; `desenho.js` traz o mapa da vila, os ícones provisórios das famílias e a linha do tempo.
- `tests/partidas.mjs`: 15 partidas sem tela, turmas de 12 a 40 (`node tests/partidas.mjs`).
- `docs/`: notas de projeto (não aparecem para o participante).

A versão definitiva vai para repositório próprio com Firebase.
