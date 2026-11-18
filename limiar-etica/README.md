# Limiar Ético

**Entrada única:** [`um-dia/`](um-dia/) (lab-ra.dragongames.dev.br/limiar-etica/um-dia/). Nove histórias: empresa e faculdade, escola, projeto do bairro, academia, laboratório (iniciação científica), clube (categorias de base), reabilitação cardiovascular, evento da escola (passeio e festival esportivo) e estágio. Links diretos: `?dia=empresa`, `?dia=escola`, `?dia=bairro`, `?dia=academia`, `?dia=pesquisa`, `?dia=clube`, `?dia=reabilitacao`, `?dia=evento`, `?dia=estagio`. O endereço antigo `limiar-etica/` redireciona para o jogo.

## Documentos (só do projeto)

- [`docs/GDD-percurso-limiar-etico-v0.2.md`](docs/GDD-percurso-limiar-etico-v0.2.md): visão geral, decisões e histórico por versão.
- [`docs/PROGRAMA-limiar-etico-v0.1.md`](docs/PROGRAMA-limiar-etico-v0.1.md): conteúdo programático (teoria → competências → cenas) e fontes.
- [`docs/ROTEIRO-de-uso-limiar-etico-v0.1.md`](docs/ROTEIRO-de-uso-limiar-etico-v0.1.md): uso em aula e palestra.
- [`docs/PSS10-situacoes-e-contextos-v0.1.md`](docs/PSS10-situacoes-e-contextos-v0.1.md) e [`docs/PSS10-balizamento-interno-v0.1.md`](docs/PSS10-balizamento-interno-v0.1.md): régua interna de estresse (nunca mostrada ao aluno).

## Código e testes

Vanilla HTML/JS/CSS, sem compilação. A partir de `limiar-etica/um-dia/`: `node testes/motor.test.mjs`, `balizamento.test.mjs`, `niveis.test.mjs` e `programa.test.mjs`. O protótipo original de cinco situações (15/11/2026) está arquivado em `alostase-arquivos/limiar-etica-fontes-atuais.zip`. Versões antigas de qualquer arquivo ficam no histórico do Git.

- `docs/SALA-ao-vivo-v0.1.md`: sala ao vivo, envio opcional do aluno, módulo do professor, telão e estatística da turma (v1.6).
