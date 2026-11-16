# Registro original recuperado

Documento histórico da versão publicada em 13/11/2026. As referências abaixo a `dist/` e à prévia privada descrevem a organização anterior. Nesta recuperação os arquivos estão diretamente em `mosaico-lastro/`, publicados pelo Lab-RA.

# Mosaico Lastro — vida em processo (0.3)

A versão principal acompanha um organismo fictício ao longo de 28 a 365 dias, com desgaste, recuperação, adaptações específicas e decisões de vida cotidiana.

- Entrada: `dist/index.html`; acesso por setores: `dist/teams.html`.
- Proposta extensa e dicionário das variáveis: `dist/proposta.html`.
- Motor puro: `dist/life-engine.js`; conteúdo e campos: `dist/life-content.js`.
- Interface: `dist/life-app.js`, `dist/life.css` e o estilo visual anterior `dist/style.css`.
- 23 indicadores de estado/contexto/resultado; 23 controles; 40 acontecimentos, em oito famílias; cinco perfis fictícios.
- Modo individual e 4–6 grupos presenciais em uma tela compartilhada. Não há sala sincronizada entre celulares.
- Campanhas salvas no navegador e em JSON; reconstrução validada ao importar; CSV, relatório HTML, contrafactual e encerramento automático.
- Tempo de deliberação livre. Não são inferidos estados fisiológicos a partir da velocidade de clique.

`npm test`: 364 campanhas longitudinais completas, 59.466 dias simulados, retomada integral e relações funcionais verificadas. As suítes anteriores também passaram. [Relatório de validação](VALIDACAO-0.3.md).

O modelo é experimental: não foi calibrado com dados humanos, não calcula biomarcadores clínicos e não prevê doença. Saturações e tempos de mudança exigem revisão docente. Não se afirma validade fisiológica apenas por passar nos testes.

O Site permanece privado para o proprietário. Não há imagens externas nem geração de imagens nesta atualização. A origem visual foi preservada. As versões anteriores continuam em `legacy.html` e `legacy-teams.html`, com seus motores e testes originais.

## Histórico anterior (0.1–0.2)

# LASTRO

Protótipo experimental criado para Prof. Mário César Nascimento. Cinco decisões sobre carga, recuperação, participação, autonomia e responsabilidade pelo estado entregue à próxima sessão. Nome provisório, sem declaração de exclusividade de marca ou inovação patenteável.

## Executar

Aplicação estática, sem dependências externas em execução. Servir `dist` por HTTP. `index.html` oferece o modo individual e o acesso a `teams.html`. Testes: `npm test` (Node 20+).

## Versão 0.2 — setores

- 4, 5 ou 6 equipes equilibradas; padrão de 35 estudantes em cinco grupos de sete.
- Fisiologia, cuidados pessoais, ambiente, voz, coordenação e investigação. Em cinco equipes, cuidados e ambiente se unem; em quatro, também a voz.
- Todos os setores contribuem antes da execução. A investigação registra previsão e análise posterior, necessária para avançar.
- Água, banheiro, proteção visual, ajuste e pausa têm efeitos distintos. Pedidos explícitos de pausa são vinculantes na condução normal. A ação “retirar por desempenho” permanece uma decisão distinta, visível na auditoria.
- Orçamento compartilhado entre ambiente e tarefa; no modo por equipes, a etapa 2 oferece adaptação da tarefa separada do gasto ambiental.
- Rascunhos e progresso salvos localmente, com reconstrução validada da história na retomada.
- Relatório HTML, impressão de roteiros e relatório, contrafactual controlado e sessão herdada com rodízio de funções.
- Operação presencial em uma tela. Abrir em vários celulares cria partidas independentes. Os painéis orientam responsabilidades; não autenticam identidades ou restringem o acesso por aluno.

## Arquitetura

- `dist/content.js`: pessoas, situações, contextos, compromissos e opções próprias do modo por equipes.
- `dist/engine.js`: transição determinística, indicadores, reprodução e código de continuidade. A extensão de cuidados só atua quando há intervenções; as regras individuais foram preservadas.
- `dist/team-engine.js`: composição dos grupos, contribuições, bloqueios de fase, revisão, restauração e rodízio.
- `dist/app.js`, `dist/teams-app.js`: interfaces, armazenamento local e exportação.
- `dist/style.css`, `dist/teams.css`: visual, responsividade e impressão.
- `tests/engine.test.mjs`, `tests/teams.test.mjs`: percursos, invariantes, efeitos distintos e continuidade.

O caderno individual documenta o modelo base, antecedentes, rubrica e hipótese de aprendizagem. O botão “Modelo aberto” dos setores documenta os coeficientes adicionais. Nenhum coeficiente foi calibrado em seres humanos.

## Verificação

Testes automatizados desta versão:

- 45 distribuições de grupos, cobrindo 4/5/6 equipes, 30/35/40 estudantes e todos os rodízios.
- 2.178 partidas completas por equipes, explorando todas as sequências viáveis da coordenação em três políticas de cuidado.
- 5.436 reconstruções de estados salvos e 21.690 contrafactuais viáveis.
- 99 rejeições corretas por orçamento nos percursos e comparações; há opção viável em cada estado testado.
- Efeitos distintos de água, banheiro, proteção visual e pausa; pausa mantém participação; bloqueios antes das contribuições e da análise; revisão de registros; herança e rodízio.
- Regressão individual: 241 percursos completos, 2.392 contrafactuais viáveis e 241 percursos com herança extrema.

Validação de interface no Chromium: uma partida completa de cinco equipes, rascunhos e análise após recarga, cuidado individual e pausa, comparação inviável e viável, exportação HTML e início da sessão herdada com grupos em novas funções. Configurações de quatro e seis equipes, contribuições combinadas/separadas e geração de seis roteiros conferidas na interface. O diálogo nativo de impressão não abriu no navegador de teste; a paginação impressa não foi verificada. Painéis e formulário conferidos a 337 pixels CSS via zoom, sem rolagem horizontal da página (as tabelas têm rolagem própria). Não houve teste em Safari/iPhone ou Android reais.

## Limites

Modelo didático qualitativo não validado. Índices de jogo, sem unidades clínicas, doses de água, medidas de balanço eletrolítico ou previsão de recuperação temporal. Não é prescrição, avaliação de saúde, diagnóstico nem medida de carga alostática. Não atribui notas morais ou acadêmicas.

Sem IA em execução, telemetria, contas de alunos ou multijogador online. Os três contextos compartilham o mesmo motor. O código transfere apenas quatro valores de lastro; o relatório conserva argumentos. A soma de verificação detecta erros de cópia e não autentica resultados.

O contrafactual mantém todas as contribuições e pedidos registrados e muda uma ação da coordenação. Não representa uma nova negociação: relatos que surgissem em outro percurso não geram automaticamente novas decisões das equipes.

A sessão herdada reinicia produção, orçamento e demandas narrativas. Somente margem e fadiga são alteradas pelo lastro anterior. O modelo não estima o intervalo real necessário para recuperação.
