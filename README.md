# Laboratório do Pesquisar RA

**Aprender pesquisa fazendo pesquisa. Fazendo, errando e criando!**

Laboratório de realidade aumentada — separado do hub MOSAICO.

**Entrar:** [drmarionascimento.github.io/lab-ra/](https://drmarionascimento.github.io/lab-ra/)

## O que há aqui

Conteúdo migrado de `DrMarioNascimento/Dragon/laboratorio-ra`:

| Bancada | Arquivo |
|---|---|
| Escala e imprecisão (câmera) | `comparacao.html` |
| Escrivaninha circulável (3D/AR) | `laboratorio-ra.html` + `escrivaninha.glb` |
| Gaveta e papel | `gaveta-e-papel.html` + `escrivaninha-gaveta.glb` |
| A marca partida (anamorfose) | `a-marca-partida.html` |
| Cadeia · três telas | `cadeia-*.html` + `cadeia.js` |
| Do músculo ao sarcômero | `musculo-sarcomero/` |
| A película de carga (potencial de membrana) | `potencial-membrana/` |
| Coração em ação (esquemático, ao vivo) | `coracao/` |
| Coração 3D · pipeline WIP (não é o de ensino) | `bancadas/11-coracao/` |

A porta de entrada (`index.html`) autentica com Google contra `config/mestres` no projeto Firebase **mosaico-game**. As bancadas ficam em `bancadas.html` (protegidas por `guard.js` + `sessionStorage`).

> **[ACESSO.md](ACESSO.md) — leia antes de mexer em qualquer coisa de login.** Aquele documento do Firestore é a única peça de que o laboratório inteiro depende e que **não está neste repositório**. Se ele se perder, todas as bancadas fecham ao mesmo tempo e todo mundo — inclusive o dono — recebe a mesma mensagem de "conta não autorizada", que parece problema da conta e não é.

## GitHub Pages

1. Settings → Pages → Source: **Deploy from a branch**
2. Branch: `main` / folder: `/ (root)`
3. O arquivo `.nojekyll` evita o processamento Jekyll dos assets.

Domínio autorizado no Firebase Auth (mosaico-game): `drmarionascimento.github.io`.

## Dependências mínimas copiadas

- `brand/` — a marca: `mestre.webp` (a figura inteira, na capa) e `mestre-lap.webp` (o recorte redondo do cabeçalho). Vieram de PNG com fundo branco opaco; o fundo foi retirado por preenchimento a partir das bordas, e as duas são WebP com alfa.
- `vendor/v1/js/tarefa-sensor.js` (+ `sensor-casa-da-costa-v2.js`) — protocolo de sensor usado por A marca partida

## A paleta

Verde e amarelo sobre fundo escuro. O escuro fica porque as bancadas são
palcos 3D com iluminação própria — um tema claro brigaria com todas elas.

A regra de contraste, medida contra o fundo (`#050a06`), está comentada em
`laboratorio.css` e vale a pena repetir: **amarelo (11,6:1) e verde claro
(9,9:1) podem carregar texto; verde escuro (5,3:1) só carrega superfície,
borda e área grande.** É a armadilha da paleta — verde saturado parece
legível e não é.

Os palcos 3D e as cores anatômicas dentro dos modelos (tecido, íons,
membrana) **não** são marca e não seguem a paleta: mudá-los prejudicaria a
leitura do que a bancada existe para mostrar.

## Testes

`npm test` — sem dependência nenhuma, roda com `node --test`.

Rodam sozinhos a cada PR e a cada push no `main`, pelo workflow
`.github/workflows/testes.yml`. Vale saber **por que** existe essa porteira:
estes testes não guardam só código, guardam o que ficou decidido olhando a
tela — e com mais de uma pessoa (ou IA) trabalhando no mesmo repositório, uma
régua quebrada ficava vermelha sem ninguém ver até alguém lembrar de rodar à
mão.

O CI roda em **Linux**, e as bancadas são escritas no **Windows**. Isso é
recurso, não incômodo: caminho com maiúscula errada passa no Windows e quebra
no Linux, e essa é a única régua que apanha essa classe de defeito.
