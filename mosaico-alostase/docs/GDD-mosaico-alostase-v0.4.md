# GDD · Mosaico Alostase

Jogo pedagógico de fisiologia da rotina

Versão 0.4 · 17/11/2026 · documento de projeto (não é conteúdo para o aluno)
Mudanças da 0.4: entram as **jornadas** (seção 8.4): o exercício físico passa a ser tratado como jornada, e entram a jornada noturna e a noite ativa; o esporte competitivo fica para depois. As duas primeiras fichas estão em `docs/fichas/`.
Mudanças da 0.3: o projeto ganha nome e pasta próprios (**Mosaico Alostase**, em `mosaico-alostase/`), como terceira versão ao lado do Alostase e do Mosaico Lastro, que ficam intactos; a classificação das variáveis volta a se chamar "estimáveis" e "observáveis"; entra a exigência de evidência de longo prazo (seção 4.5). As versões 0.1 e 0.2 ficam em `mosaico-lastro/docs/`.
Autoria da concepção: Prof. Mário César Nascimento, PhD
Nome do jogo: **Mosaico Alostase** (decidido em 17/11/2026)

Este documento registra o desenho combinado em conversa de 15/11/2026. Ele reúne num projeto só o que hoje está em dois protótipos do LAB-RA: a rotina e as contas do **Mosaico Lastro** (`mosaico-lastro/`) e a rede fisiológica por hora do **Alostase** (`limiar/`, fontes em `limiar-source/`). Nada foi programado a partir deste documento ainda. O trabalho novo acontece em `mosaico-alostase/`, que começa com uma cópia dos dois protótipos em `base/`.

---

## 1. Visão

Um simulador de fisiologia jogável: o jogador acompanha, ao longo do dia e depois ao longo de semanas e meses, o que a rotina faz com o corpo. Trabalho, sono, alimentação, treino, pausas e estresse mexem em variáveis fisiológicas reais, que se influenciam entre si.

A base é científica. A camada de jogo (moeda, pontuação, alertas, personagem) é fantasia declarada, construída em cima dessa base. O objetivo é ensinar as relações entre os sistemas e, ao mesmo tempo, divertir: a gamificação da situação fisiológica.

## 2. Público e uso

- Estudantes de fisiologia, da graduação à pós-graduação (fisiologia endócrina, cardiovascular, balanço simpatovagal). A profundidade do conteúdo é um valor do projeto, não uma barreira.
- Uso individual no celular e uso em sala, com telão e celulares.
- Depois dos estudantes, público geral interessado em entender a própria rotina.

## 3. Pilares

1. **Fidelidade fisiológica em primeiro lugar.** Cada variável roda na sua unidade real e segue curvas descritas na literatura. Adaptação pedagógica entra quando couber, nunca no lugar do rigor.
2. **Interligação.** Nenhuma variável se resolve sozinha. O que se ensina é a relação entre elas.
3. **Sem saldo único.** O estado do corpo é uma combinação de contas, cada uma com a sua moeda.
4. **O "quanto" importa.** O aluno estima valores, não só direções: que horas foi a refeição, qual a carga, quanto se espera de variação X horas depois.
5. **Simulação de aprendizagem.** Não é exame, diagnóstico nem prescrição. Nada substitui a avaliação de um profissional e exames reais.

## 4. Base científica

### 4.1 Duas camadas

- **Camada científica.** Cada variável na unidade real (cortisol em µg/dL, glicemia em mg/dL, sono em horas, frequência cardíaca em bpm), com curva de 24 horas e respostas a estímulos tiradas da literatura.
- **Camada de jogo.** O que vira moeda é o **desvio**: o quanto cada variável está fora da faixa esperada para aquela hora. Desvio é comparável entre variáveis de unidades diferentes.

A fantasia fica concentrada num ponto só, declarado como regra do jogo: a **taxa de câmbio** (quantos pontos vale um desvio de cada conta). A ciência dá a direção e a ordem de grandeza; o valor exato do câmbio é desenho de jogo.

Na tela, o jogador vê a moeda; um toque mostra o valor real por trás.

### 4.2 Variáveis candidatas, por conta

| Conta | Variáveis |
|---|---|
| Energia | Glicemia, insulina, glucagon, glicogênio hepático, glicogênio muscular, ácidos graxos livres |
| Estresse | Cortisol, adrenalina e noradrenalina |
| Autonômico e cardiovascular | Frequência cardíaca, variabilidade da frequência cardíaca, pressão arterial sistólica e diastólica |
| Sono e ritmo | Pressão de sono, melatonina, temperatura central |
| Hídrico | Osmolalidade, hormônio antidiurético, volume plasmático |
| Treino | Lactato, CK, aptidão e fadiga (modelo aptidão-fadiga) |
| Inflamação | IL-6 |

Cerca de vinte variáveis. Boa parte já existe como nó da rede do Alostase (`limiar-source/src/network.ts`).

### 4.3 Estimáveis e observáveis

- **Estimáveis:** variáveis com curva horária bem descrita. No modo Prognóstico, entram no slider e valem pontos.
- **Observáveis:** variáveis com dado horário mais fraco (por exemplo glucagon e IL-6 hora a hora). Aparecem na revelação e no modo Diagnóstico, mas o aluno não é pontuado por elas.

A classificação de cada variável sai da ficha de literatura. Estes nomes classificam variáveis; os modos de jogo se chamam Prognóstico e Diagnóstico (seção 8).

### 4.4 Fichas de literatura (em andamento)

Cada variável entra no motor com uma ficha: curva basal de 24 h, resposta a cada estímulo (refeição, exercício por intensidade e duração, estresse psicológico, privação de sono, meditação ou relaxamento), variabilidade entre pessoas e referências. As fichas ficam na versão de projeto; no jogo publicado aparecem só as referências, em "Autoria e referências".

Pontos de rigor já identificados, a confirmar nas fichas:

- Em pessoa saudável a glicemia é bem defendida entre as refeições; as grandes variações são pós-prandiais. O alerta de "trabalhar sem comer" precisa ser calibrado para não exagerar o efeito. Talvez o alerta mais fiel venha do glicogênio hepático.
- O efeito agudo de meditação e relaxamento sobre cortisol e pressão existe, mas é modesto e variável. Pede faixas e perfis, não um número único.
- As interações entre variáveis são menos quantificadas que cada curva isolada. As escolhas de modelagem nessas ligações devem ser declaradas.

**Nenhum número deste documento foi conferido na literatura.** Os valores entram só depois das fichas.

Fichas abertas em 17/11/2026 (em `docs/fichas/`), todas ainda com partes por ler:

- `01-cortisol.md`: curva de 24 h e exercício fechados; estresse psicológico e longo prazo parciais.
- `02-trabalho-noturno-e-vida-noturna.md`: base da jornada noturna e da noite ativa.
- `03-glicemia.md`: base e refeição de 50 g de carboidrato fechadas.
- `04-pressao-de-sono.md`: provisória.
- `05-exercicio-como-jornada.md`: aberta só para o cortisol.
- `06-estresse-psicologico.md`: direção, condições e tempo fechados; sem tamanho em unidade real, por isso fora do motor.
- `07-divida-de-sono-e-semana.md`: acúmulo da dívida fechado; efeito sobre cortisol e glicemia fora do motor.

A frase acima vale para este documento. No motor (`motor/parametros.js`), cada número traz a origem e até onde a fonte foi lida.

### 4.5 Evidência de longo prazo

Os passos semanais (semanas 2 a 8) e mensais (até 1 ano) só entram no motor com sustentação própria. Para cada efeito de médio e longo prazo, a ficha registra, nesta ordem de preferência: meta-análise ou revisão sistemática; estudo longitudinal ou ensaio de longa duração; na falta dos dois, o efeito fica marcado como extrapolação do curto prazo e aparece assim declarado em "Autoria e referências".

Um efeito agudo bem descrito não autoriza, sozinho, uma curva de meses.

## 5. Contas, dívida e crédito

Cada conta acumula dívida ou crédito conforme a rotina.

| Conta | Gera dívida | Gera crédito | Base |
|---|---|---|---|
| Sono | Dormir menos que a necessidade, horário desalinhado | Sono suficiente e regular | Pressão de sono e déficit acumulado |
| Estresse | Carga de trabalho, prazos, cortisol fora da curva | Pausas, meditação, lazer, convívio | Carga alostática |
| Energia | Horas sem comer, esforço sem reposição | Alimentação compatível | Glicemia e glicogênio |
| Treino | Carga acima da recuperação | Estímulo com descanso (adaptação) | Modelo aptidão-fadiga |

Regras centrais:

1. **As contas se cobram entre si.** Mais trabalho aumenta o estresse; estresse alto aumenta a necessidade de sono; dívida de sono reduz o crédito que o treino gera.
2. **Dívida tem juros.** Quanto mais tempo aberta, mais cara de pagar. Uma noite ruim se recupera rápido; duas semanas não se pagam num fim de semana.
3. **Crédito não é transferível.** Dormir bem não repõe glicose; meditar não paga dívida de sono.
4. **Trabalho noturno é uma taxa.** O mesmo sono, no horário errado, paga menos da dívida. Permite comparar o mesmo personagem em turno diurno e noturno com rotina idêntica.
5. **Bônus.** Com treino, trabalho e descanso equilibrados, as contas ficam em crédito e o corpo converte isso em adaptação (mais aptidão, mais tolerância).

## 6. Moeda

Nome proposto: **lastro** (moeda com lastro científico). Ela mede desvio convertido pelo câmbio da seção 4.1. Não existe saldo único de saúde: há um saldo por conta, e o resultado é a combinação.

## 7. Meta externa

O jogo precisa de algo que puxe contra a fisiologia. A meta é da vida cotidiana: trabalhar para ter renda e cumprir compromissos. Cada hora vira um dilema: trabalhar mais rende, mas afasta da alimentação e do sono; a pausa para meditar custa renda, mas melhora o balanço simpatovagal e reduz pressão e cortisol.

No protótipo atual do Mosaico Lastro, o plano padrão vence sem nenhuma decisão. A meta externa e a calibração existem para corrigir isso.

## 8. Modos de jogo

Decisão de 17/11/2026: os modos se chamam **Prognóstico** e **Diagnóstico**. Na versão 0.1 eram "Estimativa" e "Rotina".

### 8.1 Modo Diagnóstico (o aluno monta a rotina, o sistema mostra o esperado)

O aluno escolhe uma rotina do dia a dia: levantar a tal hora, trabalhar de x a y, meditação por x minutos, estudo, prova, refeições, treino, sono. O sistema mostra o que se espera do organismo para aquele quadro, hora a hora, com alertas quando uma variável sai da faixa. A meta externa dá o conflito.

Aviso obrigatório: o organismo é um modelo médio, não o corpo do jogador.

### 8.2 Modo Prognóstico (o sistema dá o contexto, o aluno estima)

O sistema escolhe a atividade e o momento. O aluno estima em que valores as variáveis deveriam estar naquele contexto.

- A rotina aparece completa: linha do tempo com horários, composição e carga das refeições, intensidade e duração do treino, horas de sono.
- O jogo sorteia pares de hora e variável, sem repetir, alternando variáveis para o aluno não decorar. O sorteio pode puxar variáveis ligadas em sequência, para evidenciar a interligação.
- **Valor âncora:** o valor ao acordar é mostrado, para a primeira estimativa ser raciocínio e não chute.
- O aluno corre um **slider na unidade real**, com o número visível.
- **Revelação:** mostra o raciocínio (o que aconteceu antes, há quanto tempo, quanto se espera de variação), o valor do motor, a faixa de tolerância e a posição do palpite.
- No modo de hora em hora, cada revelação vira a âncora da seguinte, e ao final o aluno construiu a curva inteira, sobreposta à do motor.

**Pontuação:** pela distância em unidade real. Dentro da faixa de tolerância vale tudo; fora, cai proporcionalmente. A faixa pode ser a variabilidade entre pessoas descrita na literatura.

**Tempo disponível.** O jogador informa quanto tempo tem; isso define o número de estimativas. Estimativa de planejamento (a confirmar com alunos): 1 a 2 minutos para ler a rotina, 40 a 60 segundos por estimativa.

| Tempo | Estimativas |
|---|---|
| 5 min | 4 ou 5 |
| 10 min | 9 ou 10 |
| 20 min | 18 a 20 |
| 40 min (aula) | 35 a 40 |

### 8.3 Variações

- **Uma variável só:** modo opcional de treino (por exemplo, só glicemia).
- **Dedução inversa (para depois):** o jogo mostra as curvas do dia e o aluno deduz a rotina.

### 8.4 Jornadas

Decisão de 17/11/2026. Jornada é um bloco da rotina com começo, fim e carga, que o aluno encaixa no dia (modo Diagnóstico) ou que o sistema apresenta (modo Prognóstico). O trabalho e o estudo já eram tratados assim; agora o exercício físico e a noite entram no mesmo molde.

| Jornada | Parâmetros | Base |
|---|---|---|
| Trabalho ou estudo diurno | Início, fim, carga (leve, pesada), prova ou apresentação | Ficha 01 (estresse psicológico) |
| **Exercício físico** | Tipo (aeróbio, força), intensidade em faixas, duração, horário | Ficha 01 para o cortisol; ficha própria a escrever |
| **Jornada noturna** | Início e fim do turno, número de noites seguidas, horário do sono de dia | Ficha 02, base própria |
| **Noite ativa** | Hora de dormir, álcool (não, pouco, muito), horas de sono, hora de acordar no dia seguinte | Ficha 02, por componentes; o que vem de trabalhador noturno entra como analogia declarada |

Regras que já saem das fichas:

- O efeito de uma jornada é calculado sobre a curva do horário em que ela acontece, não sobre um valor fixo de repouso. O mesmo treino de manhã e à noite dá resultados diferentes.
- No exercício, o cortisol responde por limiar de intensidade, com faixa de transição entre 60% e 80% do VO2máx; abaixo disso, treino curto não eleva.
- Nas primeiras noites de jornada noturna as curvas não se deslocam: o relógio fica no horário antigo e o comportamento vai para o novo.
- Álcool na noite ativa custa qualidade de sono, não horas. A conta Sono precisa de qualidade além de duração.

**Esporte competitivo:** fica para uma etapa posterior, depois de aprofundar a base do exercício (carga de treino, competição, recuperação, modelo aptidão-fadiga).

## 9. Escalas de tempo

Um motor só, sempre calculando hora a hora. Decisão de 17/11/2026: a linha do tempo anda em três passos.

| Trecho | Passo | Pontos | O que aparece |
|---|---|---|---|
| Semana 1 | A cada 24 horas | 7 | Cada dia hora a hora: as curvas subindo e descendo |
| Semanas 2 a 8 | A cada semana | 7 | Acúmulos: dívida de sono, carga de treino, estresse |
| Do mês 3 ao mês 12 | A cada mês | 10 | Adaptações |

São 24 pontos de leitura até completar 1 ano. O número de pontos mensais (10) é conta deste documento, a confirmar: supõe que as 8 primeiras semanas cobrem os meses 1 e 2.

Com essa linha do tempo, o desenho mais direto é um jogo só, em que os dois modos usam os mesmos passos. Isso ainda não foi decidido (ver "Decisões em aberto").

## 10. Sala de aula

- Mesma semente: a turma inteira recebe a mesma rotina.
- Cada aluno estima no celular; o telão revela a curva e a distribuição das respostas.
- Segue o padrão dos projetos de sala: endereço `/simulador` (telão em cima e turma simulada embaixo, no PC, comandado pelo celular) e telão com botão de tela cheia que ocupa a tela toda.

## 11. Fim de partida

- Sem relatório e sem salvar. A tela final mostra as curvas, os palpites e a pontuação, e some ao fechar.
- Aviso na abertura e no final: simulação de aprendizagem; não substitui avaliação profissional nem exames.
- "Autoria e referências" lista as referências acadêmicas usadas.
- Consequência: em sala não fica registro individual. Uso como atividade avaliada exigiria outra solução.

## 12. Personagem 3D

Um personagem em Three.js cujo corpo mostra o estado do momento: postura caída com dívida de sono, agitado com estresse alto, disposto em crédito. Comunica a fase mais rápido que as barras.

- Um personagem só, com cinco ou seis estados de animação reaproveitados.
- Entra depois do motor de um dia funcionar. Antes disso, um ícone 3D por estado.
- Modelo pelo designer (GLB), como nos outros projetos.

## 13. Padrões de interface

- Botões, cards e sliders com profundidade 3D: volume e reação ao toque.
- Ícones só em 3D de boa qualidade, próprios do projeto. Provisórios entram com lista de prompts para substituição.
- Celular: abas em vez de coluna única, cabeçalho fixo com os controles principais, fonte carregada por link real, alvos de toque grandes, o máximo de controles que couber na tela.
- Conteúdo de projeto (validação, proveniência de parâmetros, fases, notas de governança, a palavra "GDD") não aparece para o aluno.

## 14. O que se aproveita dos protótipos

- **Alostase:** rede por hora com meias-vidas e cerca de 50 ligações, previsões por hora, perfis de corpo de partida, curvas e mapa de influências.
- **Mosaico Lastro:** agenda de 24 horas, painéis por setor, acontecimentos, tela de créditos e débitos, comparação de trajetórias, cenário de turnos.
- **Limiar Ética:** fica fora deste projeto. É outra linha (decisões guiadas com base filosófica e psicológica), a tratar em documento próprio.

## 15. Etapas de construção

1. Fichas de literatura das primeiras variáveis e das jornadas (em andamento: cortisol; trabalho noturno e vida noturna).
2. Motor de um dia, hora a hora, com o primeiro lote de variáveis e a meta externa. **Primeira versão em `motor/` (17/11/2026):** cortisol, glicemia e pressão de sono, com as jornadas de exercício, noturna e noite ativa; ainda sem meta externa e sem estresse psicológico.
3. Modo Prognóstico em um dia (exige menos interface e valida as curvas). **Primeira versão jogável em `index.html` (17/11/2026):** seis rotinas, cortisol e glicemia no slider, âncora ao acordar, revelação com faixa e raciocínio, curva do dia no fim. Faltam: modo de hora em hora completo, uma variável só, sala de aula.
4. Modo Diagnóstico. **Primeira versão em `index.html` (17/11/2026):** o aluno monta sono, refeições, jornada, exercício e álcool; o jogo mostra cortisol, glicemia e pressão de sono hora a hora, com o porquê de cada hora e a leitura da rotina. Ainda sem meta externa, contas e moeda (seções 5 a 7).
5. Semana: acúmulos e juros das dívidas. **Primeira versão (17/11/2026), dentro do modo Diagnóstico:** sete dias com dois tipos de dia (útil e livre), dívida de sono em horas de vigília em excesso, pressão de sono contínua e REM perdido somado. As curvas de cortisol e glicemia ainda não mudam com a dívida. **Semana no modo Prognóstico (17/11/2026):** quatro semanas prontas; o aluno estima cortisol e glicemia em horas de dias diferentes e a dívida de sono ao fim do dia. Faixa da dívida: erro-padrão do limite de vigília (0,73 h) vezes os dias corridos, escolha deste projeto.
6. Meses: adaptações.
7. Personagem 3D.
8. Sala de aula com telão e `/simulador`.

A complexidade final é alta por decisão de projeto. As variáveis entram em lotes, cada lote com suas fichas.

## 16. Decisões em aberto

- Um jogo só com a linha do tempo em três passos (seção 9) ou dois jogos sobre o mesmo motor.
- Se o nome "Diagnóstico" precisa de aviso reforçado na tela, para não ser lido como diagnóstico clínico.
- Primeiro lote de variáveis.
- Valores do câmbio e das faixas de tolerância.
- Perfis de corpo de partida (idade, treinamento, turno).
- Meio de medida do cortisol no slider (proposta da ficha 01: total no soro).
- Faixas de intensidade do exercício (proposta: leve, moderada, intensa, com a transição do cortisol entre 60% e 80% do VO2máx).
- Componentes da noite ativa que entram na primeira versão (luz e tela, cafeína e comer de madrugada ainda sem base).
- Onde o projeto será publicado depois do LAB-RA.

## 17. Riscos

- **Escopo:** tentar todas as variáveis antes de as primeiras estarem boas.
- **Rigor nas interações:** a parte menos sustentada por dados é justamente a que o jogo mais quer mostrar.
- **Leitura pessoal:** o jogador tomar o resultado como diagnóstico.
- **Tensão de jogo:** sem calibração, a rotina padrão vence sozinha.
