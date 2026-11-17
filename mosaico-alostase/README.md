# Mosaico Alostase

Jogo pedagógico de fisiologia da rotina. Terceira versão, criada em 17/11/2026 para o trabalho novo, ao lado dos dois protótipos de origem, que ficam intactos:

- **Alostase** (`limiar/`, fontes em `limiar-source/`): a rede fisiológica hora a hora.
- **Mosaico Lastro** (`mosaico-lastro/`): a agenda de 24 horas, os painéis e as contas.

## O que há aqui

- `docs/GDD-mosaico-alostase-v0.4.md`: o desenho do jogo.
- `docs/fichas/`: fichas de literatura das variáveis (versão de projeto; não aparecem para o aluno).
- `motor/`: motor de um dia, hora a hora (cortisol, glicemia e pressão de sono), sem interface. `parametros.js` traz cada número com a origem; `PENDENCIAS` lista o que o motor ainda não calcula. Para conferir: `cd motor && npm test`.
- `docs/motor-um-dia-conferencia.png`: as curvas das três rotinas de exemplo.
- `base/alostase-motor/` e `base/lastro/`: cópias dos dois protótipos, tiradas em 17/11/2026, como ponto de partida.

## Situação

Fichas em andamento e primeira versão do motor de um dia. Nenhum número entra no motor sem origem declarada; ainda não há tela de jogo.
