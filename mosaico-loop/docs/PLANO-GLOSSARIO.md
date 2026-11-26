# Loop: análise e plano para o glossário (24/11/2026)

## 1. O que a simulação mostrou (45 relatórios, rodadas 7, 8 e 9, de 15 a 40 anos)

**Palavras do museu que travam, por quantos relatórios citam dúvida:**
tombo 45/45 · borne 44/45 · âncora 39/45 · catraca 34/45 · restauro 22/45 · disjuntor 18/45 · patrocínio 11/45.

**Palavras do jogo (regras) que travam:**
anexar 28/45 · descarte 17/45 · etiqueta 14/45 · modo livre 12/45 · sinal 11/45 · ensaio 9/45 · central, eco, "SISTEMA INTEIRO", trocar.

**Onde as palavras aparecem no texto das pistas:** âncora em 18 pistas, calibragem 16, tombo 13, pedestal 13, disjuntor 7, borne 6, patrocínio 5, catraca 1.

**Por que o glossário atual não resolve:**
1. É um parágrafo no Dossiê. Quem precisa dele está numa pista, no meio da volta, e não vai até lá.
2. Só explica palavras do museu. As que mais custam tentativa de anexar são as das regras (sinal, descarte, etiqueta).
3. É texto corrido, sem desenho. O público é visual e pula texto longo.
4. Fica igual para todos. Os de 17 a 20 pulam e os de 31 a 40 reclamam de ler glossário e termos de jogo.

## 2. Princípios

- **Quem lê não vai procurar o glossário. O glossário vai até quem lê.**
- **A palavra comum vem primeiro, o termo depois**: "número de registro (tombo)".
- **Uma linha, com exemplo.** Cada termo cabe em uma frase curta e um exemplo do próprio jogo.
- **Cada termo com um ícone**, para o olho achar rápido.
- **Termos de regra pesam mais que termos de museu**, porque custam a tentativa da volta.
- Sem limitar o jogador: o glossário explica palavras, não diz o que fazer.

## 3. Plano, em ordem de efeito

**Etapa 1. Toque na palavra (maior efeito)**
Palavra difícil dentro de uma pista aparece com sublinhado pontilhado. Um toque abre um balão pequeno: ícone, significado em uma linha e um exemplo. A lista de palavras fica em um único lugar (um dicionário no arquivo de dados), e o texto das pistas continua como está.

**Etapa 2. Trocar a palavra onde dá**
Nas pistas em que a palavra não é parte da trama, usar a palavra comum com o termo entre parênteses na primeira vez: "pontos de ligação (bornes)", "roleta da entrada (catraca)", "número de registro da peça (tombo)". Prioridade: as 13 pistas de tombo, as 6 de borne, a de catraca e a de patrocínio.

**Etapa 3. Glossário das regras, na tela do Anexar**
Um quadro fixo, com ícones, ao lado do botão:
- **Sinal** (ícone de alerta): pista que mostra o que está errado na máquina.
- **Descarte** (ícone de risco): pista que mostra o que está funcionando, ou seja, o que NÃO é o defeito.
- **Etiqueta** (ícone de etiqueta): o tipo da pista. Etiqueta igual vale um sinal só.
- Exemplo pronto de três pistas que o jogo aceita.

**Etapa 4. Botão "?" em toda tela**
O glossário completo abre em um painel, de qualquer lugar do jogo, com busca por palavra e os mesmos ícones. Hoje ele só existe no Dossiê.

**Etapa 5. Duas camadas por idade, sem perguntar a idade**
- Camada curta (padrão): uma linha por termo, para quem tem pressa.
- "Ver mais": uma segunda linha com exemplo, para quem lê com calma.
O jogador escolhe tocando. O balão da Etapa 1 já abre curto e tem "ver mais".

**Etapa 6. Termos de regra com nome mais simples**
Rever os nomes das atividades e comandos: "Eco" e "Ensaio" ganham subtítulo ("Eco: gravar o som"; "Ensaio: treino da volta 4"), e "SISTEMA INTEIRO / modo livre" vira "Isto está funcionando".

## 4. Como medir

Rodar a rodada 10 por faixa de idade (17–20, 25–30, 31–40) e pedir a cada grupo que liste as palavras que NÃO entendeu. Metas:
- Nenhum termo de museu citado como dúvida por mais de 10% dos grupos.
- "Sinal", "descarte" e "etiqueta" citados por menos de 10% dos grupos.
- Menos tentativas de anexar perdidas por regra escondida.

## 5. Riscos

- Balão aberto demais vira ruído. Usar só nas palavras do dicionário, no máximo uma vez por pista.
- Trocar palavras pode mexer em pista que o motor de teste usa para identificar. Os ids não mudam, só o texto.
- O glossário não pode entregar resposta. Nada de "isto é o defeito"; só o significado da palavra.

## 6. Feito em 24/11/2026 (primeira entrega)
Uma letrinha "?" ao lado da palavra difícil abre e fecha a explicação ali mesmo (vira "×" quando aberta), no mesmo jeito do "i" das regras. Vale para as pistas no caderno e para a regra do Anexar. São 16 termos (tombo, âncora, borne, catraca, calibrar, disjuntor, fusível, pedestal, patrocínio, restauro, dossiê, eco, sinal, descarte, etiqueta, ensaio); cada termo aparece uma vez por texto. Falta: botão "?" geral com busca (etapa 4), trocar a palavra comum nas pistas (etapa 2) e o quadro de regras com ícones (etapa 3).
