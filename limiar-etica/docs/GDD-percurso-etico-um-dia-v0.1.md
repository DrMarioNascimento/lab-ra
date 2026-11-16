# GDD · Percurso / Limiar Ético — "Um dia"

Versão 0.1 · 15/11/2026 · documento de projeto (não é conteúdo para o aluno)
Autoria da concepção: Prof. Dr. Mário César Nascimento
Nome do jogo, por enquanto: **Percurso / Limiar Ético** (decisão do professor em 15/11/2026).

Este documento registra o desenho combinado em conversa de 15/11/2026. Nada foi programado a partir dele ainda.

---

## 1. Visão

Um percurso ético de um dia inteiro. O jogador vive um dia comum em que exigências legítimas se cruzam (o trabalho, a universidade, a família, um evento que precisa acontecer) e toma decisões ao longo das horas.

A proposta é um **aulão prático e exemplificado**: reunir os conceitos e as teorias da disciplina e levá-los para situações do dia a dia.

O objetivo não é acertar. É **mostrar os conceitos em ação**: em que momento a pessoa agiu mais por impulso, por emoção ou por razão; quando buscou o certo e quando buscou o desfecho; quanta liberdade real tinha. No fim, o dia aparece como curvas e como uma leitura pela escala ética, para a pessoa comparar e argumentar.

## 2. De onde parte

O projeto não nasce do zero. Ele reúne peças que já existem:

| Peça | Onde está | O que oferece |
|---|---|---|
| Percursos Éticos | repositório Etica, `percursos-eticos/` | Seis temas, doze histórias, telas de contexto, investigação, decisão, desfecho, reflexão e registro; roteiro de deliberação |
| Casos Éticos | repositório Etica, `casos-eticos/` | O "primeiro impulso" marcado no início e comparado no final; caminhos; duas famílias de leitura |
| Escala do Dilema do Bonde | repositório Etica, `dilema-bonde/` | Cinco correntes: Utilitarismo, Virtudes, Intenção, Existencialismo e Ética da Complexidade |
| Glossário do Mosaico Vila Ética | `mosaico-vila-etica/js/content/glossario.js` | Dezenas de verbetes de ética e deontologia |
| "Passagem 2 · Ética" | `limiar-source/docs/GDD-Alostase-v0.5.md` | A ideia de reviver o mesmo dia pelo lado das pessoas e comparar o gesto com o estado do corpo |
| Limiar Ética (protótipo) | `limiar-etica/` | Cinco cenas do cotidiano, sem acúmulo; serve como banco inicial de situações |
| Percursos de Fisiologia | repositório fisiologia-em-fuga, `percursos/` | A estrutura de percurso: tema, contexto, questões ligadas à situação, síntese |

## 3. Base teórica

Os textos do professor ficam no Google Drive, pasta `A-LINK / Textos Éticos`. Este documento só os referencia e resume a estrutura; os textos não são reproduzidos aqui.

### 3.1 "Entre o impulso e a escolha"

É a espinha do jogo. Dele vêm:

- **A cadeia da decisão:** desejo (impulso), consciência (reconhecimento), deliberação (avaliação), vontade (decisão), conduta (ação).
- **Intenção, motivo e consequência**, com a distinção entre dano pretendido, usado como meio ou apenas previsto.
- **Liberdade situada** (Sartre, Merleau-Ponty): escolhe-se dentro de regras, relações de poder, tempo, recursos, medo e expectativas.
- **Ação, omissão e responsabilidade**, com o roteiro de cinco perguntas.
- **O roteiro de análise de um dilema**, em oito passos.
- **O quadro-síntese** de sete perguntas: o que estou desejando, o que compreendi, o que decidi, o que fiz, o que pretendia, o que aconteceu, o que assumo.
- **As três ferramentas:** diário de decisão, mapa de atores, matriz intenção-meio-consequência.

### 3.2 Texto de abertura sobre ética e moral

- Moral como valores e normas de pessoas e grupos; ética como reflexão sobre esses referenciais.
- A alma em três dimensões na concepção platônica: desejos e impulsos, emoções e razão.
- Aristóteles e o lugar da razão; Hume e o lugar dos sentimentos; ética do afeto.
- A razão sozinha não garante que uma ação seja ética; reflexão ética não é privilégio de escolaridade.
- Interesse individual e coletivo: considerar o outro sem anular a si mesmo.

### 3.3 "A Academia"

Diálogo bem-humorado entre quatro personagens numa academia, cada um com uma maneira de justificar a própria conduta (dever, desempenho, pragmatismo do cotidiano, crítica existencial). Serve de referência de tom e de como dar voz a posições diferentes sem caricaturar nem apontar um vencedor.

### 3.4 Slides das disciplinas (ainda não lidos)

"1 Ética e Deontologia da Educação Física - 2026 2" e "2 Ética dos profissionais de saúde - 2026". A conferir antes de fechar a lista de conceitos.

## 4. Estrutura do dia

- O dia corre hora a hora, do início da manhã à noite.
- Um fio principal: um evento ou uma entrega que precisa acontecer naquele dia.
- Fios que cruzam: o grupo da universidade cobrando o trabalho, a família pedindo presença, um colega que falha, uma informação que chega pela metade.
- Cada cena é um confronto entre duas ou mais exigências defensáveis. Nenhuma alternativa é marcada como certa.
- As cenas atuais do protótipo (mensagem fora do expediente, divisão do trabalho em grupo, o assento no ônibus, a acusação no grupo da turma, o compromisso de fim de semana) podem ser costuradas num dia só.

## 5. Fluxo de cada cena

1. **Relembrar o conceito** em jogo (curto, do texto-base ou do glossário).
2. **Entender o cenário:** fatos, quem está envolvido, o que não se sabe.
3. **Marcar o primeiro impulso:** o que dá vontade de fazer agora.
4. **Decidir.**
5. **Ver o desfecho**, que depende também do que foi feito antes.
6. **Comparar e argumentar:** impulso e decisão lado a lado, o que as outras lentes diriam, o que a pessoa consegue justificar.

## 6. As curvas

O dia aparece numa linha do tempo, com um ponto por decisão. Tocar no ponto abre o conceito daquela cena.

| Curva | O que mostra | Base |
|---|---|---|
| Desejo, emoção e razão | Qual das três dimensões pesou mais em cada decisão | Alma em três dimensões; Hume |
| Do impulso à conduta | Se o impulso foi seguido, contido ou modificado pela deliberação | Cadeia desejo, consciência, deliberação, vontade, conduta |
| Busca do certo e busca do desfecho | Quando a decisão se apoiou em dever e quando em consequência | Intenção, motivo e consequência |
| Liberdade situada | Quanta margem real de escolha a cena dava | Sartre, Merleau-Ponty |
| Escala ética | Peso das cinco correntes ao longo do dia | Escala do Dilema do Bonde |

A lista final de curvas é decisão em aberto. Candidatas a acrescentar: empatia e pressão da meta.

## 7. Como a leitura é feita

Três fontes, combinadas:

- **Peso de autoria:** cada alternativa é escrita para encarnar um tipo de justificativa, e o professor define o peso dela em cada curva.
- **Impulso e decisão:** a distância entre o primeiro impulso marcado e a decisão tomada.
- **Tempo de resposta**, como na decisão cronometrada do Bonde.

É uma leitura interpretativa do percurso, não uma medida da pessoa. O jogo diz isso de forma clara, e o fechamento fala de escolhas e tensões, nunca de caráter.

## 8. Acúmulo, meta e corpo

- **As decisões se acumulam.** Variáveis seguem o jogador pelo dia: confiança de cada personagem, pendências, pressão da meta e cansaço. O que foi feito de manhã muda as opções e as reações da tarde.
- **A meta puxa contra.** O evento precisa acontecer. É possível entregar tudo atropelando as pessoas, ou preservar as relações e falhar na entrega.
- **Respingo fisiológico.** O estresse e o cansaço acumulados alteram as cenas do fim do dia (menos tempo para decidir, opções reflexivas mais custosas). A ligação com o jogo de fisiologia da rotina (ver `mosaico-lastro/docs/`) é opcional e fica para depois.
- Para a autoria não explodir, o encadeamento usa variáveis de estado que modulam cenas fixas, e não uma árvore com um texto para cada caminho.

## 9. Fechamento

- As curvas do dia e a leitura pela escala.
- O quadro-síntese de sete perguntas aplicado ao próprio percurso.
- Perguntas para argumentar: o que você manteria, o que mudaria, o que consegue justificar publicamente.
- Sem nota e sem gabarito.
- **Nada é salvo.** O percurso aparece na tela e some ao fechar (decisão do professor em 15/11/2026).

## 10. Modos

- **Casos:** o Percursos Éticos atual, com histórias independentes.
- **Um dia:** o percurso encadeado descrito aqui.

Os dois podem conviver no mesmo lugar.

## 11. Padrões dos simuladores de ética

- Sem barra ou menu superior com link de volta.
- Assinatura: "Simuladores interativos utilizados nas disciplinas de Ética do Prof. Dr. Mário César Nascimento ©".
- Aviso padrão, na linha de "História fictícia para aprendizagem e discussão."
- Personagens com nomes únicos, sem repetir nomes de outras histórias ou atividades.
- Botões e cards com profundidade 3D e reação ao toque; ícones 3D próprios do projeto.
- Celular primeiro, com alvos de toque grandes.
- Conteúdo de projeto não aparece para o aluno.

## 12. Etapas de construção

1. Conferir os slides e fechar a lista de conceitos e de curvas.
2. Escrever o dia-piloto: fio principal, cenas, alternativas e pesos.
3. Motor do dia com variáveis de estado e desfechos.
4. Linha do tempo com as curvas e a escala.
5. Fechamento com o quadro-síntese.
6. Integração ao Percursos Éticos como segundo modo.

## 13. Decisões em aberto

- Só individual, ou também com versão de sala (telão e celulares).
- Lista final de curvas.
- Onde publicar: LAB-RA primeiro e depois o site de Ética, ou direto no site.
- Usar ou não os quatro personagens de "A Academia" como elenco, respeitando a regra de nomes únicos.
- Quantos dias diferentes existirão, e se o sistema sorteia o dia.

## 14. Riscos

- **Sobreposição** com o Casos Éticos, que também tem caminhos e escala. A diferença a preservar: aqui o resultado é a curva de um dia contínuo.
- **Rotular pessoas.** As curvas podem ser lidas como diagnóstico de caráter.
- **Peso de autoria.** Um dia encadeado exige muito texto bem escrito.
- **Teoria decorativa.** O conceito precisa explicar a decisão que acabou de ser tomada, e não aparecer como verbete solto.
