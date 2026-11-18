# Limiar Ético · sala ao vivo e módulo do professor (v1.6)

Esta nota descreve o que a sala guarda, quem vê o quê e o que o professor precisa configurar.

## Como funciona
- **Professor:** abre `um-dia/?professor`, entra com a conta Google e cria uma sala (código `LE` + 4 dígitos). Mostra o código, o link ou o QR.
- **Aluno:** abre o link (`?sala=LE1234`) ou toca em "Entrar numa sala", informa identificação, código e um emoji. Escolhe o dia e joga no próprio celular. Entrar na sala só avisa o professor do andamento (dia e progresso).
- **Envio:** no fim, em "Salvar ou enviar…", o aluno escolhe **"Enviar tudo ao professor"**. Só então vão o resumo das decisões, a revelação e o texto da aba Aplicar. Sem esse clique, nada do conteúdo sai do celular.
- **Salvar:** janela com caixas de seleção por bloco de cada aba (Curvas, Decisões, Síntese, Aplicar), em PDF (impressão do navegador, "Salvar como PDF"), em imagem PNG (dividida em partes quando muito alta) ou nos dois. O professor usa a mesma janela na revelação de um aluno e na visão da turma.
- **Professor, um aluno:** cards da turma ao vivo; ao tocar num aluno que enviou, abre a mesma revelação dele; setas `‹ ›` (ou as teclas ← →) saltam entre alunos; "Telão" projeta em tela cheia e troca o nome por "Aluno".
- **Professor, turma:** estatística do dia escolhido, **só com 5 ou mais envios** do mesmo dia (e cada cena só com 5 ou mais respostas): médias de razão, emoção e impulso por cena, certo × desfecho, margem de escolha, lentes éticas, percentual por alternativa em cada cena, tempo mediano, competências (eixos) e as respostas da aba Aplicar sem nome.

## Onde ficam os dados
Mesmo projeto Firebase do Laboratório do Pesquisador (`laboratoriodopesquisador`), na estrutura `sessoes/{codigo}` e `sessoes/{codigo}/alunos/{id}`, separados pelo campo `projeto = "limiar-etico"`. Documento do aluno: `nome`, `avatar`, `dia`, `status`, `progresso`, e, se enviou, `enviado`, `dadosJson`, `extrasJson`, `aplicacao`.

## O que precisa estar nas regras do Firestore (conferir no console)
- Qualquer pessoa pode **ler** o documento da sessão (para validar o código) e **escrever** em `sessoes/{codigo}/alunos/{id}`.
- Só quem tem o documento `acesso/orientador` pode **criar** e **encerrar** sessões e **ler** a lista de alunos.
- Se as regras atuais do Laboratório do Pesquisador validam o campo `projeto`, incluir `limiar-etico`.
O código não foi testado contra o Firebase real (a rede do ambiente de desenvolvimento não alcança o serviço); o teste `um-dia/testes/sala_fumaca.py` usa uma sala simulada.

## Privacidade
O manual diz que nada é enviado a menos que o aluno entre numa sala e escolha enviar. A estatística da turma e o telão não mostram nomes. O balizamento interno (PSS-10 e NOM-035) continua fora das telas do aluno e do professor.
