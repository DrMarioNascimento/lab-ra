# Ficha 04 · Pressão de sono (conta Sono e ritmo)

17/11/2026 · versão de projeto, não aparece para o aluno.

**Estado da ficha: parcial.** Nenhuma fonte desta ficha foi lida inteira ainda; os dois números do motor estão marcados como provisórios.

## 1. O que as fontes dizem

| Ponto | O que a fonte diz | Leitura |
|---|---|---|
| Modelo | O sono é regulado por dois processos: um homeostático (Processo S), que sobe acordado e cai dormindo, e um circadiano (Processo C), independente do sono. | [resumo] Borbély e colegas, 2016 e 2022 |
| Constantes clássicas | Subida saturante acordado, com constante de tempo de 18,18 h; queda dormindo, com 4,2 h. Derivadas da atividade de ondas lentas em experimentos de privação de sono. Escala teórica de 0 a 1. | [resumo] Daan e colegas, 1984, citado em revisão |
| Variação entre pessoas | Em outro ajuste, a subida variou de 14,1 a 26,4 h e a queda de 1,2 a 2,9 h. | [resumo] Rusterholz e colegas, 2010 |
| Dívida | 14 dias com 4 h ou 6 h por noite: déficit cognitivo cumulativo e proporcional à dose. | [resumo] Van Dongen e colegas, 2003 (da triagem) |

Divergência a resolver: a queda clássica é de 4,2 h; o ajuste de 2010 dá 1,2 a 2,9 h. A diferença muda bastante o quanto uma noite curta "paga" da pressão acumulada.

## 2. Decisões de modelagem no motor

- Processo S com as constantes clássicas (18,18 h e 4,2 h), **provisórias**.
- Sem unidade clínica: não há medida de rotina que o aluno conheça. Por isso a proposta é classificar como **observável** (aparece na revelação, não vale ponto no slider).
- Álcool: entra na qualidade do sono, pela ficha 02 (REM perdido), não na pressão de sono.

Atualização (semana 1): a dívida ao longo de dias está na ficha 07. O modelo de dois processos estabiliza em poucos dias e não reproduz o déficit que continua crescendo; por isso a semana mostra a pressão de sono e a dívida lado a lado.

## 3. O que falta

1. Ler inteiros Rusterholz (2010) e Borbély (2016) e decidir as constantes.
2. Melatonina e temperatura central, as outras variáveis da conta.
3. Processo C e a interação com o cortisol.
4. Dívida de sono ao longo de dias (Van Dongen inteiro): é a base do passo semanal.

## Fontes

- Borbély e colegas, 2016. The two-process model of sleep regulation: a reappraisal. J Sleep Res. doi 10.1111/jsr.12371
- Borbély, 2022. The two-process model of sleep regulation: beginnings and outlook. J Sleep Res. https://pmc.ncbi.nlm.nih.gov/articles/PMC9540767
- Rusterholz e colegas, 2010. Inter-individual differences in the dynamics of sleep homeostasis. Sleep. https://pmc.ncbi.nlm.nih.gov/articles/PMC2849788
- Van Dongen e colegas, 2003: ver `00-triagem-lote-1.md`.
