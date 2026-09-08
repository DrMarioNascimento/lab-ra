# A cadeia — três telas de RA, com estado

**Não apagar sem ler.** Isto não são três demonstrações soltas: é uma tarefa
encadeada, e cada elo só abre com o que o anterior entregou. O prejuízo de
apagar um deles não aparece na hora — aparece quando alguém clica no botão do
fim e cai no vazio.

Entrada: `cadeia-escrivaninha.html?s=LAB`

## A corrente

| tela | o que se faz | exige | leva a |
|---|---|---|---|
| **escrivaninha** | abre a gaveta de baixo à direita, vira o papel dentro dela, olha o latão do sextante | — | a janela |
| **janela** | o braço no grau 26 vira linha no céu; uma estrela pousa nela e, abaixo, entre nove luzes iguais, está o farol | a **frase** da escrivaninha | a parede |
| **parede** | no quarto escuro, o facho cruza a parede na altura de quem olha | o **farol** da janela |

A tranca é o `exige()` do `cadeia.js`, que devolve quem chega fora de ordem
para a tela anterior. A ordem também é proposital DENTRO da escrivaninha: o
sextante fica inerte até o papel ter sido lido.

## Os números são projetados, não gerados

Estão em `cadeia.js` e **não se refazem por dedução** — são desenho de enigma:

| | |
|---|---|
| frase | *"se você der cinco passos mais altos você estará mais perto do céu, e o céu te mostrará o caminho"* |
| hora | 21:29 |
| grau | 26 — o quinto degrau |
| azimute | 214 — o farol, a sudoeste |
| altura dos olhos | 1,55 m |
| semente | `?s=LAB` (o parâmetro `s`, maiúsculo) |

## Os arquivos

- `cadeia.js` — estado, tranca e os números acima. **A escrivaninha não roda sem ele.**
- `escrivaninha-gaveta.glb` — a mesa **com** gaveta e **com o sextante no tampo**. É o modelo que a corrente usa.
- `escrivaninha.glb` e `escrivaninha.usdz` — a mesa **sem** gaveta, versão anterior. Usada só por `laboratorio-ra.html`.

## O que está superado, e por quê

- `gaveta-e-papel.html` — carrega o mesmo `escrivaninha-gaveta.glb`; foi o teste isolado de "a gaveta abre e o papel vira?" que virou a escrivaninha.
- `laboratorio-ra.html` — a escrivaninha circulável, sem gaveta; foi o teste de "dá para andar em volta de um objeto em RA?".

Ambos responderam **sim**, e essa resposta é o que sobrevive a eles.

## O que isto é hoje

Prova de potencialidade, feita para saber se dava — gaveta abre, papel vira,
pista aparece. Deu. A intenção é virar jogo; **hoje não tem vínculo nenhum**
com o laboratório de aula, e não deve ganhar um por acidente.
