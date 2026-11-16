# Mosaico Lastro — vida em processo

Versão funcional 0.3.0, recuperada da publicação 4 em 15/11/2026 e incorporada ao repositório Lab-RA.

- [Abrir jogo](https://lab-ra.dragongames.dev.br/mosaico-lastro/)
- [Proposta completa](https://lab-ra.dragongames.dev.br/mosaico-lastro/proposta.html)
- [Card no Lab-RA](https://lab-ra.dragongames.dev.br/bancadas.html#lastro)

## Conteúdo recuperado

Campanhas de 28, 84, 180 e 365 dias, cinco cenários, 23 indicadores, 23 controles e 40 acontecimentos. Modos individual e presencial com quatro a seis equipes em uma tela compartilhada. Salvamento no navegador e em JSON, retomada, dados CSV, relatório HTML e comparação de trajetórias.

O modo por setores funciona em uma tela compartilhada; não sincroniza celulares. Campanhas salvas na prévia anterior podem ser exportadas lá e importadas nesta página. O armazenamento automático pertence ao endereço de cada site e não é transferido automaticamente entre domínios.

## Arquivos

- `index.html`, `teams.html`: experiência atual.
- `life-engine.js`, `life-content.js`, `life-app.js`, `life.css`: motor, conteúdo e interface atual.
- `proposta.html`: proposta pedagógica, variáveis, mecanismos e referências.
- `legacy.html`, `legacy-teams.html`: experiências anteriores preservadas, com seus motores e interfaces.
- `tests/`: três suítes originais com caminhos adaptados à estrutura do Lab-RA.
- `HISTORICO-ORIGINAL.md`, `VALIDACAO-0.3.md`: documentação recuperada.

## Execução e verificação

Aplicação estática sem dependências externas em execução. Sirva esta pasta por HTTP. Para verificar os motores com Node.js 20 ou superior:

```sh
cd mosaico-lastro
npm test
```

Origem verificada: commit `5802a8fcbcb9e7916ffdbd2befc8fc1dd9e4f68f` da publicação 4 do projeto original. Os 16 arquivos de execução recuperados corresponderam integralmente ao código dessa publicação antes das adaptações de navegação.

As equações e os coeficientes foram preservados. O modelo é didático e experimental; testes de software não constituem validação fisiológica. Autoria: Prof. Mário César Nascimento. Aplicam-se as condições de [LICENSE.md](../LICENSE.md).
