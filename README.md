# Laboratório do Pesquisar RA

## Estado e manutenção — 10 de outubro de 2026

Este laboratório mantém experiências de pesquisa e protótipos separados dos percursos de estudantes. [Corpo em ação](integracao/) permanece exclusivo deste LAB-RA; os catálogos de ensino de Fisiologia Interativa são mantidos em outro repositório.

Além das bancadas de exploração espacial, o código contém experiências de coração, retorno venoso, pleura, músculo, potencial de membrana e Starling. A presença de uma bancada não declara validação científica ou compatibilidade universal com câmera/RA. Execute `npm test` para os contratos locais e valide a abertura da câmera em aparelho físico. Os créditos específicos permanecem em [CREDITOS_ATLAS.md](CREDITOS_ATLAS.md) e nos documentos das bancadas.


**Estado em 7 de outubro de 2026.** Bancadas de RA no ar, com acesso livre. Corpo em ação fica só aqui, fora da página dos alunos. Licença de uso restrito: repositório público não é código aberto. Revisão documental desta nota: 7 de outubro de 2026.

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
| O Impostor · as peças de RA (maquete e uma por capítulo, cópia independente do Dragon) | `o-impostor/` |

A entrada (`index.html`) e todas as bancadas têm acesso livre. O `guard.js` apenas mantém links antigos com `destino`, preservando os parâmetros da bancada e recusando redirecionamento externo. [ACESSO.md](ACESSO.md) descreve esse percurso.

## GitHub Pages

1. Settings → Pages → Source: **Deploy from a branch**
2. Branch: `main` / folder: `/ (root)`
3. O arquivo `.nojekyll` evita o processamento Jekyll dos assets.

O laboratório não depende de Firebase Auth para abrir as páginas.

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

## Licença e uso

Este repositório é público para consulta e acesso à experiência no GitHub Pages, mas não é código aberto. O uso educacional permitido e as restrições de cópia, adaptação, redistribuição e exploração comercial estão descritos em [LICENSE.md](LICENSE.md). Revisão documental desta nota: 7 de outubro de 2026.

**Autor:** Mário César Nascimento, PhD.

## Corpo em ação — Integração experimental

[Corpo em ação](https://drmarionascimento.github.io/lab-ra/integracao/) permanece **somente no LAB-RA**, fora da página dos alunos e dos Tutores. Cinco aproximações conectam respiração, bombeamento, transporte e utilização de oxigênio no mesmo estado de repouso/exercício. Malhas Meshopt sem simplificação; RA animada via WebXR com indicação de compatibilidade. As curvas são didáticas; a câmera exige validação em aparelho físico. [Modelo e limites](integracao/README.md) · [Atribuição](integracao/ATRIBUICAO.md).
