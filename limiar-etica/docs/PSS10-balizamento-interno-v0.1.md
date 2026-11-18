# Limiar Ético · Balizamento interno do estresse provocado (régua PSS-10)

Versão 0.1 · 18/11/2026 · documento de projeto (não é conteúdo para o aluno)
Complementa `PSS10-situacoes-e-contextos-v0.1.md`. Código: `um-dia/balizamento/cargas.mjs` e `um-dia/testes/balizamento.test.mjs`.

## 1. A ideia

O professor quer cenas de estresse mais próximo do limite, criadas pela **frequência** com que a pressão volta (a terceira advertência, a quinta cobrança do dia), e uma forma interna de saber quanto estresse cada cena e cada dia provocam. A PSS-10 entra como **régua do autor**, e não como medida do aluno.

Três regras:
1. **Nada disso aparece para o aluno nem é calculado sobre ele.** O balizamento vive em `um-dia/balizamento/`, que a página não carrega (um teste garante isso).
2. **A escala não é reproduzida.** Os dez temas ficam como rótulos curtos; o texto dos itens deve ser obtido com o autor da escala.
3. **Sem validade psicométrica.** As notas são julgamento do autor sobre "com que frequência esta vivência apareceria numa pessoa comum nesta situação" (de 0, nunca, a 4, muito frequentemente). Servem para comparar cenas e dias entre si. A PSS não tem pontos de corte clínicos; as faixas leve, moderada, alta e limite são só deste projeto.

Os quatro temas de enfrentamento da escala (itens 4, 5, 7 e 8) já estão registrados na direção do estresse, então a soma de 0 a 40 é comparável ao total da PSS-10 depois da inversão.

## 2. Carga das cenas do dia atual (proposta para revisão)

| Cena | Soma | Faixa | Observação |
|---|---|---|---|
| 1 A mensagem | 15 | moderada | o imprevisto pesa, o resto é leve |
| 2 O nome no trabalho | 22 | alta | |
| 3 O número redondo | 12 | leve | pressão social, pouca urgência |
| 4 Até que horas | 28 | **limite** | trabalho, madrugada, prova e advertência juntos |
| 5 A troca | 21 | moderada | |
| 6 A verba | 25 | alta | dez minutos para decidir |
| 7 A figurinha | 15 | moderada | |
| 8 A ligação | 28 | **limite** | família, chefia e evento ao mesmo tempo |
| 9 As fotos | 20 | moderada | |
| 10 O que deu errado | 29 | **limite** | erro próprio com a plateia presente |
| 11 O que voltou | 27 | alta | o acúmulo cobra |

Média do dia: 22,0. Pico: 29. Seis de onze cenas em faixa alta ou limite, e a segunda metade do dia pesa mais que a primeira (o teste confere). O dia atual já chega perto do limite, mas por picos isolados, não por repetição.

## 3. Situações-limite por frequência (propostas, ainda não escritas)

A frequência eleva a carga sem inventar um evento novo: o mesmo tipo de pressão volta. Cada proposta é uma versão "recorrente" de uma cena existente, com a repetição dita na própria história.

| Cena base | Versão recorrente | Efeito esperado nos temas | Carga prevista |
|---|---|---|---|
| 4 Até que horas | "É a terceira vez neste mês que a chefia pede para ficar até o fim e a terceira advertência já foi falada." | confiança em lidar, domínio e acúmulo sobem para 4 | 33 |
| 2 O nome no trabalho | "É a terceira entrega do semestre em que o colega some." (já aparece na informação opcional; passa para o texto principal) | raiva do que escapa e acúmulo sobem | 27 |
| 8 A ligação | "Esta é a quarta consulta da mãe neste mês que cai num dia de evento." | dar conta de tudo e acúmulo sobem | 32 |
| 10 O que deu errado | "É o segundo item que você esquece nesta semana." | tensão, domínio e confiança sobem | 33 |
| 7 A figurinha | "Já é a terceira figurinha do mesmo colega nesta semana." | manejo de irritações e acúmulo sobem | 21 |
| 6 A verba | "É o terceiro corte de verba no mês e a equipe já cortou duas vezes." | controle e acúmulo sobem | 31 |

Meta para um **dia limite**: pelo menos quatro cenas na faixa limite (acima de 27), com a frequência explícita no texto, e nunca mais de duas seguidas, para o ritmo respirar.

## 4. Cuidados

- Estas cenas são ficção, mas a carga alta pode tocar situações reais de alunos que trabalham e estudam, cuidam de familiares ou já viveram assédio. Manter a abertura honesta ("simulação para aprender e discutir") e acrescentar no dia limite a mesma frase usada no Mosaico Vila: quem sentir que o tema pesa pode só observar ou conversar com quem conduz.
- A revelação deve falar da história ("o dia colocou isto no seu caminho"), nunca de quanto estresse o aluno sentiu. Nada é salvo.
- Não usar a escala real com os alunos para "conferir" a régua sem protocolo de pesquisa, termo de consentimento, comitê de ética e tratamento dos dados.

## 5. Como dar mais firmeza à régua (sem aplicar nada nos alunos)

1. Dois ou três avaliadores independentes (colegas docentes) dão as notas de cada cena sem ver as suas; comparar e anotar as divergências.
2. Reescrever as cenas em que a divergência passar de 6 pontos na soma.
3. Só se o professor quiser tornar isto pesquisa: protocolo e comitê primeiro; depois, comparar a ordem de carga das cenas com o relato de participantes sobre a mesma situação.

## 6. Decisões para o professor

- Aprovar as notas da seção 2, ou ajustar cena a cena.
- Escolher quais versões recorrentes da seção 3 escrever primeiro. Sugestão: 4, 8 e 10, as que já estão na faixa limite.
- Decidir se o dia limite é um dia à parte (sorteado) ou uma opção do modo Um dia.

## Referências
- Cohen, S., Kamarck, T., & Mermelstein, R. (1983). A global measure of perceived stress. *Journal of Health and Social Behavior*, 24(4), 385-396.
- Cohen, S., & Williamson, G. (1988). Perceived stress in a probability sample of the United States. In S. Spacapan & S. Oskamp (Eds.), *The social psychology of health*. Sage.
- Reis, R. S., Hino, A. A. F., & Añez, C. R. R. (2010). Perceived Stress Scale: reliability and validity study in Brazil. *Journal of Health Psychology*, 15(1), 107-114.
