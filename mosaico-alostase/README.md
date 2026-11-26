# Mosaico Alostase

Jogo pedagógico de fisiologia da rotina. Terceira versão, criada em 17/11/2026 para o trabalho novo, ao lado dos dois protótipos de origem, que ficam intactos:

- **Alostase** (`limiar/`, fontes em `limiar-source/`): a rede fisiológica hora a hora.
- **Mosaico Lastro** (`mosaico-lastro/`): a agenda de 24 horas, os painéis e as contas.

## O que há aqui

- `docs/GDD-mosaico-alostase-v0.5.md`: o desenho do jogo (versões anteriores com sufixo `_SUBSTITUIDO_<data>`).
- `docs/ANDAMENTO.md`: onde o trabalho parou, decisões, suposições a conferir e próximo passo.
- `docs/fichas/`: fichas de literatura das variáveis (versão de projeto; não aparecem para o aluno).
- `index.html` e `jogo/`: modos Prognóstico e Diagnóstico, de um dia e da semana 1, primeira versão jogável (celular). O Diagnóstico tem o "Desafio da semana": perfis com compromissos fixos, meta de estudo e de atividade física, e a dívida de sono como custo. Endereço: `lab-ra.dragongames.dev.br/mosaico-alostase/`. Ainda não está ligado a nenhuma página do LAB-RA.
- `motor/`: motor de um dia, hora a hora (cortisol, glicemia e pressão de sono), sem interface. `parametros.js` traz cada número com a origem; `PENDENCIAS` lista o que o motor ainda não calcula. Para conferir: `npm test` nesta pasta.
- `motor/hemodinamica.js`: pressão arterial de um normotenso ao longo do dia (parte do sono e parte do relógio). Ainda não aparece no jogo.
- `cardiovascular/` e `motor/cardiovascular.js`: bancada de 24 h com pressão e frequência cardíaca, dois cenários de exercício, inspeção das contas e CSV. Os pontos da MAPA e as curvas são simulados.
- `motor/treino.js`: frequência cardíaca no esforço (FCmáx de Tanaka, reserva de FC). Ainda não aparece no jogo.
- `motor/semana.js`: sete dias seguidos, com dívida de sono, pressão de sono contínua e REM perdido somado.
- `docs/motor-um-dia-conferencia.png`: as curvas das três rotinas de exemplo.
- `base/alostase-motor/` e `base/lastro/`: cópias dos dois protótipos, tiradas em 17/11/2026, como ponto de partida.

## Situação

Fichas 00 a 12, motor de um dia e da semana 1, Prognóstico e Diagnóstico jogáveis no celular, relógio do dia, e primeira versão da sala de aula (`sala/`, `professor/`, `telao/`, `aluno/`, `simulador/`). Nenhum número entra no motor sem origem declarada.
