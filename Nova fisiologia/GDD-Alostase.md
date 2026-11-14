# GDD · Alostase

Versão 0.3 · 13 de novembro de 2026\n\n> Documento histórico da versão 0.3. A experiência de fisiologia passou a se chamar Alostase; o projeto de ética é independente. Alguns trechos descrevem propostas anteriores e não devem ser tomados como estado atual.

Documento do que o protótipo faz hoje e do que ficou combinado e ainda não existe. Quando os dois discordam, vale o que está marcado como **no ar**.

## O que está havendo

O jogo trocou de objeto três vezes. Por isso a tela de agora não parece a conversa de ontem.

| Versão | O que era | Estado |
|---|---|---|
| Robô e as leis de Asimov | O jogador preserva um humano em cenas pós-modernas | Abandonada como jogo. Ficou só a pergunta: quem age, e à custa de quê |
| Noite fundida | O corpo escondia a opção ética. HRV baixa, o botão sumia | Descartada. Ficou simples: a fisiologia era trava de menu, e a ética não chegava a acontecer |
| Fundo Comum | Jogo de turma, cooperação e punição custosa | Outro jogo. Não entra neste |
| Passagem 1 · Fisiologia | Uma noite. O jogador escolhe qual sistema responde | **No ar** |
| Passagem 2 · Ética | A mesma noite, menu inteiro, sem número escondendo opção | Combinada. **Não construída** |

O que se joga agora não é um dilema moral. É um modelo de alostase. A ética entra depois, ao lado deste laudo, não no lugar dele.

## Visão

Alostase é um simulador de uma noite para aula de fisiologia, com uma segunda passagem prevista para aula de ética. Um jogador, no celular. Sem turma, sem telão, sem pontuação contra os outros.

A noite vai de 03:10 a 23:48. De manhã o jogo lê o corpo que sobrou e projeta o mesmo passo em 48 horas, em meses e em anos.

Pergunta da passagem 1: quando o corpo liga uma defesa, quem paga, e quando?

Pergunta da passagem 2, ainda não jogável: o gesto que você defende cabia no corpo que a primeira passagem deixou?

## Público e forma

| Item | Definição |
|---|---|
| Público | Graduação em fisiologia; depois, ética e deontologia. Também serve a aula única se o professor ficar só na passagem 1 |
| Jogadores | 1 |
| Duração | Cerca de oito minutos a passagem. As duas, se existirem, cabem numa aula com conversa no laudo |
| Aparelho | Celular. Texto e painel. Sem cena ilustrada |
| Tom | Clínico, seco. Sem medalha de “você foi ético” |
| Números | Índice do modelo. Não são exame. O Cr basal é 8, não é mg/dL |

## Loop

1. O painel mostra o corpo nesta hora.
2. Três respostas de sistema. Não há opção correta pintada.
3. A consequência diz o que esta hora fez e o que esta hora ainda não pode mostrar.
4. O botão avança as horas reais até a próxima cena. As meias-vidas correm nesse intervalo, não no clique.
5. O que só aparece depois entra como aviso no topo da hora seguinte.
6. Depois das 23:48, oito horas até a manhã. O laudo é o corpo ao acordar, não o corpo da meia-noite.

## O corpo às 03:10

Plantão já em curso. Última refeição longe. A curva do cortisol está subindo porque é madrugada, não porque houve um susto.

| Leitura | Índice inicial | O que é |
|---|---|---|
| Vago | 44 | Tônus vagal cardíaco. A HRV seria a leitura, não uma virtude |
| Catecolamina | 16 | Efeito circulante. Acaba em minutos |
| Excesso de cortisol | 8 | Quanto o cortisol está acima do basal desta hora |
| Cortisol mostrado | 50 | Basal da hora (42) mais o excesso |
| Glicose | 76 | Índice, não mg/dL. Com o excesso baixo, caminha de volta para 78 |
| Adenosina | 62 | Pressão de sono, processo S. Só cai dormindo |
| IL-6 | 14 | Inflamação. Cai sob cortisol agudo. Sobe quando ele desce sem sono |
| Volume | 64 | Volemia. Cai devagar enquanto a pessoa está acordada e sem beber |
| Cafeína | 0 | Máscara da adenosina. Meia-vida de 5 h |
| Fluxo renal | alto, na faixa | Não é mmHg. É o índice de perfusão |
| TFG | na faixa | Segura enquanto o fluxo não sai da autoregulação |
| Creatinina | 8 | Basal do modelo. Atrasa em relação à TFG |
| Prostaglandina | intacta | PGE2 e PGI2 aferentes. O AINE tira por cerca de 6 h |

Frequência e pressão não são botões. São leitura do vago, da catecolamina e do excesso de cortisol.

## Tempo

O clique não é o relógio. Entre uma cena e outra o modelo aplica o intervalo real.

| Coisa | Meia-vida ou regra no modelo |
|---|---|
| Catecolamina | ~0,45 h. Em duas horas já era |
| Excesso de cortisol | ~1,5 h. Um pulso das 3h não está mais alto às 9h40 |
| Cafeína | ~5 h. Bloqueia o receptor. Não apaga a adenosina |
| AINE sobre a COX | ~6 h. Depois a prostaglandina volta. A creatinina, se subiu, continua contando |
| Adenosina acordado | Sobe devagar a cada hora |
| Adenosina dormindo | Cai por hora de sono. Uma noite não zera a semana |
| Volume | Cai um pouco por hora acordado. Sobe se a pessoa bebe ou dorme |
| Glicose | Se o cortisol está alto, o fígado empurra para cima. Se não, volta para o basal |
| IL-6 | Contida enquanto o excesso de cortisol está alto. Aparece quando ele cai e o sono não veio |
| Creatinina | Não se move no minuto da queda da TFG. Sobe no intervalo seguinte |

Basal de cortisol por hora, antes de qualquer pulso: 42 às 03:10, 36 às 09:40, 30 às 11:41, 22 às 16:20, 12 às 23:48. Manhã limpa: 52, no desenho de um pico de despertar. Manhã com a curva quebrada: 40, e a noite anterior não desceu.

## Rim: carga não é falha

Três palavras, e só estas.

| Palavra | Condição no modelo | Leitura |
|---|---|---|
| Folga | Fluxo e TFG dentro da faixa | O rim não é o limitante desta hora |
| Carga | Fluxo baixo, TFG segura | Autoregulação. O rim filtra quase o mesmo com menos sangue |
| Falha | TFG saiu da faixa | Falha hemodinâmica. Não é necrose. Não é doença renal crônica |

A falha pede as três coisas juntas: pouco volume, angiotensina alta, prostaglandina aferente bloqueada. Falta uma, a TFG segura.

O que o modelo deliberadamente não faz: o degrau em que a angiotensina II moderada contrai sobretudo a eferente e ainda segura a TFG, com fração de filtração maior. O jogo só simula o extremo.

Creatinina: se a pior TFG do intervalo ficou abaixo da faixa, o índice sobe na hora seguinte. Se a pessoa repõe volume e o COX libera, o desenho reverte. Um turno não escreve insuficiência crônica.

Potássio, dito e não numerado: catecolamina alta empurra K+ para dentro da célula na hora. TFG baixa faz o rim excretar menos, horas depois. O plasma de um minuto não separa os dois. Saturação da 11β-HSD2, com cortisol agindo como mineralocorticoide, é excesso sustentado. O jogo não finge isso.

## As cinco horas

Cada hora tem três respostas. O texto da consequência sai do estado real. Se a TFG não caiu, o jogo não diz que caiu.

### 03:10 · A vigília

A triagem pede córtex acordado em minutos. A curva das 3h já sobe sozinha.

| Resposta | O que faz | O que não faz |
|---|---|---|
| Catecolamina | Medula e simpático em segundos. Glicose por glicogenólise. Fluxo renal cai. Se o volume aguenta, a TFG segura: é carga | Não tira adenosina. A vigília é química |
| Eixo HPA | CRH, ACTH, cortisol. Útil em dezenas de minutos. Segura IL-6. Prepara neoglicogênese | Não garante o minuto da triagem. Às 9h40 este pulso já caiu |
| Não montar | Vago fica. Rim nem é chamado | O risco é microssono. Folga renal aqui não é vitória |

### 09:40 · O segundo pulso

A curva do dia já deveria descer. Há uma conversa difícil. Ela é pano de fundo. A escolha é do eixo, não do conteúdo da conversa.

| Resposta | O que faz |
|---|---|
| Segundo pulso | Outro pico com a curva já devendo cair. O feedback negativo ainda existe. O segundo pico atrasa a descida. IL-6 segue contida enquanto o cortisol está alto |
| Freio vagal | Braço rápido do barorreflexo. A frequência cede. Não apaga o cortisol que já está decaindo |
| Platô simpático | Sem pico. Catecolamina média, sem desligar. Pico curto o corpo devolve. Platô é pressão que deixa de ter para onde cair |

### 11:41 · A defesa

Alarme. Aqui a descarga é o sistema certo. O erro novo é não desligar.

| Resposta | O que faz |
|---|---|
| Ligar e desligar | Catecolamina na hora. O freio vagal entra no intervalo, não no clique. Alostase com retorno. O fluxo cai e volta |
| Ligar e manter | A mesma descarga, sem freio. Caminho do non-dipping se isso chegar à noite |
| Não ligar | Sem taquicardia, sem glicose de defesa. Não é calma. É defesa que não montou. O rim fica folgado porque ninguém pediu vasoconstrição |

### 16:20 · Volume e COX

Reunião longa, cabeça doendo, horas sem beber. Três químicas diferentes.

| Resposta | O que faz |
|---|---|
| Cafeína | Bloqueia receptor A1 e A2A. A adenosina fica. Meia-vida ~5 h: às 23h a máscara ainda está. Diurese leve só no desenho de quem não habituou |
| AINE | Inibe a COX. A dor cede. PGE2 e PGI2 aferentes saem por ~6 h. Em rim folgado a TFG quase não se move. Em rim já contraído, com pouco volume, a TFG cai. A creatinina não se move neste minuto |
| Água e pausa | Volume volta, prostaglandina intacta, freio vagal. A adenosina continua perceptível. É a condição em que um AINE faria pouco |

### 23:48 · A curva

Perto da meia-noite o cortisol deveria estar no chão.

| Resposta | O que faz |
|---|---|
| Cortisol no nadir | O eixo sobe na hora em que devia calar. A curva achata. Sono de uma hora, fragmentado. A manhã não faz pico de despertar limpo. IL-6 e glicose amanhecem piores. Desenho de restrição de sono, não laudo de diabetes |
| Uma frase e dormir | Descarga curta, sem pulso cheio. Cerca de cinco horas de sono. O nadir sobrevive. A recuperação é pela metade |
| Dormir | Cerca de sete horas. Processo S descarrega parte. O cortisol fica baixo. A mensagem de alguém fica sem resposta. Isso é fato para a passagem de ética. Nesta passagem, o eixo fez o que a hora pedia |

## Laudo da manhã

Prioridade fixa. O primeiro que couber é o nome. Os outros não somem do corpo. Somem do título.

| Ordem | Nome | Quando |
|---|---|---|
| 1 | Falha hemodinâmica | Alguma hora saiu em falha, ou a creatinina da manhã chegou a 11 |
| 2 | Curva quebrada | Houve cortisol no nadir |
| 3 | Sem defesa | Na sirene, não ligou |
| 4 | Patamar | Platô simpático ou ligar-e-manter, e não dormiu de verdade |
| 5 | Carga renal | Alguma hora o fluxo baixou com a TFG segura |
| 6 | Dívida | Os eixos devolveram, mas a manhã abre com adenosina ainda alta, volume curto ou IL-6 acima do basal |
| 7 | Retorno | Descarga onde cabia, freio depois, noite com cortisol baixo, TFG na faixa, manhã sem a dívida acima |

Viés conhecido: carga renal ganha de um retorno quase limpo se a sirene, ainda que breve e com freio, tiver baixado o fluxo. O título fala do rim. O resto da noite fica na lista “o que cada hora fez”.

O laudo não dá nota de caráter. Dá três tempos, se aquele passo se repetir.

| Tempo | O que pergunta |
|---|---|
| Curto · 48 h | O que a creatinina, a curva, o sono e a IL-6 ainda estão contando |
| Médio · meses | Se o custo continua episódico ou vira inclinação: cortisol de fim de dia, manhã sem pico, pressão sem dipping |
| Longo · anos | A década cobra a noite sem volta. Doença renal crônica, se entrar, entra por pressão, glicose e inflamação repetidas. Não por uma tarde |

Três perguntas para a sala, ajustadas ao que aconteceu. Sempre uma sobre a sirene, uma sobre o rim, uma sobre repetir o passo três noites por semana.

O bloco “Abrir o modelo” é a letra miúda: meias-vidas, o extremo renal, o que não é exame, a restrição de sono e a glicose do dia seguinte, e a recusa da história de que raciocinar esvazia a glicose do sangue.

## O que o modelo recusa

- Não é clearance, não é KDIGO, não é mg/dL.
- Não diagnostica diabetes, hipertensão ou doença renal crônica a partir de um turno.
- Não simula a angiotensina em dose moderada segurando a TFG pela eferente.
- Não satura a 11β-HSD2.
- Não usa ego-depletion. Argumentar não derruba a glicose.
- Glicose e IL-6 da manhã mostram direção da restrição de sono. Não calculam o experimento.
- Non-dipping aqui é mecanismo visto numa noite. O risco de década é o ritmo, e o texto diz isso.

## Passagem 2 · Ética

Não está no ar. Fica especificada para não ser reinventada como outro jogo.

Mesma noite, mesmos fatos, menu inteiro. Nenhum número esconde opção. O jogador responde à pessoa, não ao eixo.

| Hora | O fato, do lado de quem espera | O que a fisiologia já decidiu por outro critério |
|---|---|---|
| 03:10 | Dois casos, atenção plena para um | A passagem 1 só perguntou se a vigília foi montada |
| 09:40 | A conversa difícil. Alguém pede silêncio, alguém precisa de registro | A passagem 1 só perguntou se houve segundo pulso |
| 11:41 | Sair agora, encerrar com protocolo, ou tratar a sirene como fundo | A passagem 1 já sabe se a defesa ligou e se desligou |
| 16:20 | A reunião segue. A dor de cabeça foi resolvida com café, AINE ou pausa. O conteúdo da reunião volta a importar | A passagem 1 já sabe se a TFG caiu |
| 23:48 | A mensagem. Responder com limite, ligar sem borda, ou dormir | A passagem 1 já sabe se a curva quebrou |

O fechamento das duas passagens é uma tela só. De um lado, o gesto defendido. Do outro, o corpo da manhã. A pergunta da aula: esse gesto cabia nesse corpo, ou foi defendido com um córtex que naquela hora não o sustentava?

Até essa tela existir, dormir às 23:48 é fisiologicamente o retorno e, para a outra pessoa, silêncio. O jogo de hoje não pune isso. Também não elogia. Deixa o fato na frase.

## Fora deste jogo

- Turma, grupos, telão, punição custosa. Isso é Fundo Comum.
- Leis da robótica como regra de pontuação.
- Opção que some quando a HRV cai.
- Cor verde na alternativa “certa”.
- Transformar índice em laudo clínico.

## Como usar numa aula, hoje

Passagem 1 sozinha já dá uma aula de fisiologia.

Duas noites, em sequência, se houver tempo:

1. Catecolamina às 3h, platô de manhã, ligar e manter, AINE, cortisol no nadir. A TFG cai às 16h20 com creatinina ainda basal. A creatinina sobe só na hora seguinte. De manhã, falha hemodinâmica e curva achatada.
2. Não montar ou freio, ligar e desligar, água e pausa, dormir. A mesma lógica de AINE, se alguém quiser testar, não derruba a TFG. De manhã, retorno, com pico de despertar e adenosina mais baixa.

A conversa cabe nas três perguntas. O modelo aberto serve para quem perguntar “isso é exame?”.

## Próximo passo de construção

A passagem 2, em cima desta noite, sem novo cenário. O laudo fisiológico permanece. A tela final é a comparação.
