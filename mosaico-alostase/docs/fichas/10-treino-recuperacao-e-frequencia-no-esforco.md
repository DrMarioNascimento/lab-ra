# Ficha 10 · Treino: frequência no esforço, recuperação e efeito no dia seguinte

18/11/2026 · versão de projeto, não aparece para o aluno.

**Estado da ficha:** o artigo de Tanaka (2001) foi lido **inteiro** (texto do PDF), o resto é [resumo]. É a base da conta de Treino. **Entrou no motor só a frequência cardíaca no esforço** (`motor/treino.js`, 4 testes); recuperação, EPOC e glicemia depois do exercício continuam fora.

## 1. Frequência cardíaca máxima e intensidade

| Ponto | O que a fonte diz | Leitura |
|---|---|---|
| Equação | FCmáx = 208 − 0,7 × idade (r = −0,90; 351 estudos, 492 grupos, 18.712 pessoas). Por hábito: sedentário 211 − 0,8 × idade; ativo 207 − 0,7 × idade; treinado em resistência 206 − 0,7 × idade. Validação em laboratório com 514 pessoas de 18 a 81 anos: 209 − 0,7 × idade; sem diferença entre homens e mulheres. A idade sozinha explica cerca de 80% da variação individual. | [completo] Tanaka e colegas, 2001 |
| Erro | Desvio-padrão da FCmáx individual de 7 a 11 bpm segundo a idade (cerca de 10 na discussão); o artigo não traz erro-padrão de estimativa. Em sedentários negros e brancos do HERITAGE, 11,4 bpm (Tanaka) e 12,4 (220 − idade). A equação de 220 − idade superestima em jovens e subestima com a idade. Limite: sem fumantes nem doença cardiovascular. | [completo] Tanaka, 2001; [resumo] HERITAGE |
| Intensidade | %FC de reserva ≈ %VO2 de reserva (Swain, 1997; 1998), com contraponto (ficha 08). | [resumo] |

Consequência: a frequência no esforço é **uma faixa**, não um valor; o jogo deve mostrar incerteza de cerca de 10 bpm na FCmáx.

## 2. Recuperação da frequência cardíaca

| Ponto | O que a fonte diz | Leitura |
|---|---|---|
| Definição | Queda da frequência no primeiro minuto depois do pico do esforço; é mediada por reativação parasimpática e retirada simpática (padrão bifásico). | [resumo] |
| Valores | Em teste máximo, recuperação normal de 29 ± 5 bpm contra 14 ± 5 em quem tem recuperação lenta; limite de 18 bpm usado como anormal em um estudo e 12 bpm no clássico de Cole (1999, 2.468 adultos), em que ≤12 bpm no primeiro minuto se associou a mais mortalidade. | [resumo] Evaluation of autonomic function underlying slow postexercise HRR, 2006; texto de divulgação sobre Cole 1999 |
| Calor | Calor passivo atrasou a recuperação em 12 homens jovens. | [resumo] Frontiers in Neuroscience, 2017 |

Limite: os valores dependem do protocolo (máximo ou submáximo, ativo ou parado) e são clínicos; não usar como curva geral sem escolher o protocolo.

## 3. Consumo de oxigênio depois do exercício

Revisão sistemática de 22 estudos: o consumo extra depois do exercício (EPOC) é maior após exercício intervalado de alta intensidade (cerca de 136 kJ em até 3 h) do que após contínuo moderado (cerca de 101 kJ); em avaliações com mais de 3 h, 289 contra 159 kJ. Para sprint intervalado, 241 contra 151 kJ. Faltam métodos padronizados para o tempo efetivo de EPOC **[resumo]** Panissa e colegas, 2021. Em geral, a intensidade pesa mais que a duração (fonte secundária, sem número).

## 4. Glicemia depois do exercício

- Uma sessão de 30 min de exercício aeróbico em adultos jovens saudáveis, com teste de glicose 24 h depois, reduziu a glicemia basal e a de 1 h após a carga e a insulina de 1 h, com aumento de sensibilidade à insulina **[resumo]** (Journal of Endocrinological Investigation, 2025). Tamanho não lido.
- Uma sessão única reduz resistência à insulina frente a nenhum exercício (diferença de −0,53 pmol/L; IC95% −0,93 a −0,13) **[resumo]** (revisão BMJ Open Sport & Exercise Medicine). O mesmo trabalho não achou efeito sobre hemoglobina glicada de sessão única.
- Efeito de até 24 a 48 h depois de uma sessão intensa aparece em texto de divulgação, sem fonte primária lida: **não usar**.

## 5. Efeito no motor (propostas)

1. **Feito (18/11):** frequência no esforço = repouso + fração × (FCmáx − repouso), com FCmáx de Tanaka e faixa de 10 bpm; fração da reserva de VO2 calculada com VO2 de repouso de 3,5 ml/kg/min (modelagem, 1 MET). Repouso diurno de 54,5 bpm (Speed, 2023). Fora: perfis fumantes ou com doença cardiovascular.
2. Recuperação da frequência: esperar o protocolo e a fonte lida antes de desenhar curva.
3. Glicemia no dia seguinte: direção sustentada (sensibilidade maior), tamanho não; **fora do motor**.

## 6. O que falta

Artigos inteiros de Panissa e do estudo de glicose de 24 h; curva de FC no esforço em jovens com VO2 medido; recuperação da pressão e da frequência depois de exercício em intensidades diferentes; fonte primária para o efeito de 24 a 48 h.

## Fontes

- Tanaka, Monahan, Seals, 2001. Age-predicted maximal heart rate revisited. J Am Coll Cardiol 37:153-156. https://pubmed.ncbi.nlm.nih.gov/11153730/
- HERITAGE: precisão das equações de Fox e Tanaka. https://pmc.ncbi.nlm.nih.gov/articles/PMC3935487
- Evaluation of autonomic function underlying slow postexercise heart rate recovery. Med Sci Sports Exerc 2006;38:2095-2101. https://pubmed.ncbi.nlm.nih.gov/17146315/
- Passive heating attenuates post-exercise cardiac autonomic recovery in healthy young males. Front Neurosci 2017. https://frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2017.00727/text
- Panissa e colegas, 2021. Magnitude and duration of EPOC between HIIE and MICE. Obes Rev 22:e13099. https://pubmed.ncbi.nlm.nih.gov/32656951/
- A single bout of physical exercise improves 1-hour post-load plasma glucose in healthy young adults. J Endocrinol Invest 2025;48:455-464. https://pmc.ncbi.nlm.nih.gov/articles/PMC11785650/
- Revisão sobre exercício de sessão única e controle glicêmico. BMJ Open Sport Exerc Med. https://pmc.ncbi.nlm.nih.gov/articles/PMC6350746
