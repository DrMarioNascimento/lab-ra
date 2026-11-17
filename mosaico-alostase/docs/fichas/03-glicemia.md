# Ficha 03 · Glicemia (conta Energia)

17/11/2026 · versão de projeto, não aparece para o aluno.

**Estado da ficha: base e refeição fechadas para refeição de 50 g de carboidrato; o resto, parcial.** **[completo]** = artigo inteiro lido; **[resumo]** = só resumo ou trecho.

## 1. Curva de 24 h em pessoa saudável

| Ponto | O que a fonte diz | Leitura |
|---|---|---|
| Amostra | 36 adultos sem diabetes (15 homens, 21 mulheres), 23,7 anos em média. Monitor contínuo. Refeições às 8h, 13h e 18h em 4 dias; café e almoço padronizados em 50 g de carboidrato em 2 deles. 432 refeições. | [completo] Freckmann e colegas, 2022 |
| Mediana do dia | 95,0 mg/dL com refeições em hora fixa; 98,1 em vida livre. | [completo] Freckmann e colegas, 2022 |
| Antes da refeição | 92,8 mg/dL (desvio-padrão 9,4). | [completo] Freckmann e colegas, 2022 |
| Pico depois da refeição | 143,3 mg/dL (desvio-padrão 23,5); percentil 90 de 174,2. | [completo] Freckmann e colegas, 2022 |
| Subida | 50,9 mg/dL (desvio-padrão 23,6). | [completo] Freckmann e colegas, 2022 |
| Tempo até o pico | 50 min (desvio-padrão 19). | [completo] Freckmann e colegas, 2022 |
| Madrugada | Sem fenômeno do alvorecer entre 1h e 5h. | [completo] Freckmann e colegas, 2022 |
| Tempo na faixa de 70 a 140 | 93,5% com refeições fixas; 95,2% em vida livre. Abaixo de 70: 1,7% e 0,9%. | [completo] Freckmann e colegas, 2022 |
| Por refeição | Pico de 132,3 depois do café, 118,2 depois do almoço e 123,0 depois do jantar; tempo até o pico de 46 a 50 min. Refeição com mais fibra, proteína e gordura sobe menos e desce mais devagar. | [resumo] Freckmann e colegas, 2007 |
| Volta à base | Em outra amostra, média de 108 mg/dL em 1 h, 102 em 2 h e 97 em 3 h, partindo de 91. | [resumo] tabela vista em trecho |

O perfil serve ao público do jogo: a amostra de Freckmann (2022) é de adultos jovens.

## 2. Decisões de modelagem no motor

- Base plana de 92,8 mg/dL, sem queda por horas sem comer (a glicemia do saudável é defendida) e sem subida na madrugada.
- Refeição: subida de 50,9 mg/dL para 50 g de carboidrato, pico em 50 min, forma (t/tp)·exp(1 − t/tp), que devolve cerca de 60% do pico em 2 h e 27% em 3 h.
- Subida proporcional aos gramas de carboidrato, com teto de 81,4 mg/dL (percentil 90 do pico menos a base). **Só a refeição de 50 g tem dado lido**; a proporção é escolha deste projeto.
- Faixa de tolerância do modo Prognóstico: um desvio-padrão (9,4 na base; 23,6 perto do pico).

## 3. O que falta

1. Composição da refeição (fibra, proteína, gordura) e hora do dia sobre o pico: ler Freckmann, 2007, inteiro.
2. Exercício sobre a glicemia, durante e depois.
3. Comer de madrugada e jornada noturna (+6% de glicose no laboratório de Scheer, lido só no resumo).
4. Sono curto sobre a sensibilidade à insulina no dia seguinte (meta-análises da triagem, só resumo).
5. Insulina e glicogênio hepático, as outras variáveis da conta Energia.
6. Médio e longo prazo: nada lido além do que está na triagem. **Extrapolação declarada** por enquanto.

## 4. Proposta de classificação

Glicemia como **estimável**.

## Fontes

- Freckmann e colegas, 2022. Continuous glucose profiles in healthy people with fixed meal times and under everyday life conditions. J Diabetes Sci Technol. https://pmc.ncbi.nlm.nih.gov/articles/PMC10973852
- Freckmann e colegas, 2007. Continuous glucose profiles in healthy subjects under everyday life conditions and after different meals. J Diabetes Sci Technol. https://pmc.ncbi.nlm.nih.gov/articles/PMC2769652
- Shah e colegas, 2019: ver `00-triagem-lote-1.md`.
