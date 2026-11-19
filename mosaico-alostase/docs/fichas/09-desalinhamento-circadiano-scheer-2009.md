# Ficha 09 · Desalinhamento circadiano (Scheer e colegas, 2009)

18/11/2026 · versão de projeto, não aparece para o aluno.

**Estado da ficha: [completo para resultados e limites]**, lido pelo texto aberto no PubMed Central (PMC2657421). Os números abaixo vêm dele. Serve ao trabalho noturno e à vida noturna ativa (ficha 02), à glicemia (ficha 03), ao cortisol (ficha 01) e à pressão (ficha 08).

## 1. Desenho

10 adultos (5 mulheres), idade média de 25,5 anos (19 a 41), IMC 25,1. Dez dias internados em luz fraca, com sete "dias" de 28 h, refeições com mesma energia e amostra de sangue de hora em hora. Condição alinhada: acordar por volta das 8 h. Desalinhada: acordar por volta das 20 h, isto é, comer e dormir cerca de 12 h fora de fase.

## 2. Resultados usados

| Ponto | O que a fonte diz |
|---|---|
| Glicemia média | 6% mais alta no desalinhamento (P < 0,001), sobretudo por subidas maiores depois das refeições, não por jejum mais alto. |
| Glicemia 2 h após o café | De 99,9 para 132 mg/dL (P = 0,025, n = 8). Três dos oito chegaram à faixa de pré-diabetes durante o desalinhamento; nenhum tinha tolerância alterada quando alinhado. |
| Insulina | 22% mais alta em média (P = 0,006): sugere menor sensibilidade à insulina. |
| Cortisol | O ritmo diário se inverteu por completo: baixo no começo da vigília e alto no fim. A parte do relógio, sozinha, vai de pico a vale em 113%, mais de duas vezes o efeito somado do comportamento. |
| Glicose, parte do relógio | O relógio sozinho explica 4% (P = 0,018); o resto vem do comportamento (dormir, comer, atividade). |
| Pressão | Pressão arterial média 3 mmHg mais alta (3%, P = 0,001) com desalinhamento. Medida só acordado (quatro vezes por vigília); não há pressão do sono. |
| Frequência cardíaca | Sem efeito mensurável do desalinhamento. |
| Eficiência do sono | De 84% para 67% (P = 0,002, n = 9). |

## 3. Limites

Amostra pequena; laboratório com dias de 28 h, que não imitam a vida real; metade tinha asma leve, sem efeito detectado nos resultados principais; tolerância à glicose avaliada em 8 pessoas. É desalinhamento **agudo**, de poucos ciclos; não mostra o que acontece depois de semanas de turno.

## 4. O que isso muda no motor (propostas; nada implementado)

- **Cortisol em turno noturno:** o motor já desloca a curva pelo relógio. Scheer sustenta que o ritmo acompanha o relógio e não o sono, e que ele se **inverte** em 12 h de desalinhamento. Falta saber em quantas noites o ritmo se desloca; a ficha 02 já registra adaptação completa em poucos estudos após 7 noites.
- **Glicemia no desalinhamento:** direção e tamanho agora têm fonte lida: +6% na média e subida pós-prandial maior (café: 99,9 → 132 mg/dL em 2 h). Como o experimento tem 8 pessoas e dias de 28 h, sugiro entrar no motor como **multiplicador da subida pós-refeição** quando o relógio estiver mais de 6 h fora de fase, com a faixa de incerteza declarada. **Decidido e implementado em 18/11/2026** (autorização do professor para decidir): entra só a média, +6% no valor total da glicemia, linear entre 3 e 6 h de deslocamento do relógio (`desalinhamento` em `parametros.js`, marcado como modelagem). A subida pós-prandial maior não entra, porque só a média tem número lido.
- **Pressão:** soma de cerca de 3 mmHg na pressão média acordado, coerente com os +2,5 mmHg sistólica e +1,8 diastólica da meta-análise de trabalhadores noturnos (ficha 08).
- **Frequência cardíaca:** sem efeito de desalinhamento; não alterar.

## Fontes

- Scheer, Hilton, Mantzoros, Shea, 2009. Adverse metabolic and cardiovascular consequences of circadian misalignment. PNAS 106:4453-4458. https://pubmed.ncbi.nlm.nih.gov/19255424/ · texto aberto: https://pmc.ncbi.nlm.nih.gov/articles/2657421/
