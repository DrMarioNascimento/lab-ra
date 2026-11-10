# Viagem do O₂

Atividade de Fisiologia em equipe (até 40 alunos): revisão em viagem, caso por estações, simulação e desfecho.

- `index.html`: página inicial (Participar / Conduzir).
- `simulador/`: aula simulada no PC (telão em cima, turma embaixo, alunos em piloto automático).
- `js/model.js`: modelo fisiológico em cadeia.
- `js/content/`: paradas da viagem, postos, mecanismos e os 6 casos (2 por curso).
- `js/engine.js`: motor da sala (fases, grupos, líder, respostas).

Cópia de teste no LAB-RA (GitHub Pages). A versão definitiva vai para repositório próprio com Firebase.

## Identidade visual

- `assets/hemacias.webp`: cenário ilustrativo da abertura (90 KB).
- `assets/moleculas-parede.webp`: papel de parede molecular dos alunos (23 KB), com tonalidade aplicada por CSS.
- `assets/icons/`: nove ícones vetoriais (sete estações, O₂ e mochila).
- `css/visual.css` e `js/visual.js`: apresentação compartilhada e identificação por cor, nome e número.
- A cor identifica a equipe, não a saturação de oxigênio. O mapa é esquemático.
- A identidade permanece nas 11 fases. Preferência por movimento reduzido é respeitada.

As duas artes de fundo foram geradas para o projeto e convertidas para WebP. Os ícones são SVG autorais. Sem vídeo e sem nova dependência de execução.

## Cápsula de exploração (10/11/2026)

- `cabine/`: visita individual pelas nove paradas, com as mesmas perguntas, feedback, cálculos e mochila da aula. Respostas duram a visita; esta página não abre sala nem envia notas.
- No simulador, a fase **Viagem** abre a cápsula no telão. **Ver progresso da turma** alterna para o acompanhamento existente; a navegação do telão não muda a parada de cada aluno.
- Cada celular recebe sua janela durante a viagem, com número/cor da equipe na cabine. A paisagem mantém sua própria paleta.
- A chegada dura 3,2 segundos, espera a imagem carregar, pode ser pulada e respeita a preferência de movimento reduzido. Não há vídeo, WebGL, áudio automático, dependência nova ou laço de animação contínuo.
- `js/journey.js` / `css/journey.css`: janela, transições, legendas de escala e acessibilidade. A cabine é preservada durante os redesenhos das respostas.
- Artes ilustrativas geradas para este projeto: alvéolos (~94 KiB), coração (~109 KiB), célula muscular (~178 KiB), em WebP de 1400 px. O cenário de hemácias existente é reaproveitado. Cada imagem é reutilizada e carregada sob demanda.
- As legendas distinguem a passagem do O₂ pela barreira da permanência da hemácia no vaso; no retorno, acompanha-se o sangue venoso, não o O₂ que foi consumido.
- Verificação: seis casos × quatro tamanhos de turma (3, 12, 35 e 40), 264 passagens de fase, 11.880 renderizações de aluno; percurso individual de nove paradas com respostas preservadas. Navegação e aparência verificadas no navegador em desktop e em janelas móveis de 320 e 390 px.
