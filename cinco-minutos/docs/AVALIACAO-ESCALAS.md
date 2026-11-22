# Avaliação por escalas — Loop (documento de projeto, não público)

**Aviso:** todas as notas abaixo são autoavaliação feita por mim (Claude) com base em simulação de 15 partidas por script e leitura do conteúdo. Não houve 15 grupos humanos. Use como roteiro de correção, não como certificação.

## Resultado geral
**Nem todas as escalas passaram.** O jogo melhorou bastante, mas a escala da história e a de Big Five/GAMS do conteúdo continuam abaixo do mínimo. Não declaro "todas as escalas passaram".

## Rodada 1 → Rodada 2 (escala da história, 0–10)
| Critério | Mínimo | Antes | Agora | Justificativa (agora) |
|---|---|---|---|---|
| Premissa e pergunta de valor | 9.0 | 6.5 | 7.5 | Cada caso tem uma pergunta para conversar; falta um dilema que atravesse a noite toda |
| Oculto | 9.0 | 6.5 | 7.0 | Ecos de fatos diferentes em várias salas; o enredo ainda é o mesmo mecanismo nos 15 casos |
| Estrutura | 9.0 | 6.0 | 6.5 | Voltas ganham texto próprio, mas não há prólogo nem viradas |
| Rodízio | 9.0 | 6.5 | 7.5 | Cobertura dos 8 eixos para quem visita 5 salas: 1% → 48% |
| Jogo limpo | 9.0 | 6.0 | 6.5 | Códigos agora sorteados; Quando e Como ainda são múltipla escolha fechada e dão para chutar |
| Personagens e fichas | 9.0 | 3.0 | 6.0 | Fichas e falas das 5 figuras feitas; não há diálogo ramificado |
| Prosa | 8.0 | 6.0 | 6.5 | Pistas ganharam cena e voz; modelos de texto ainda repetem estrutura |
| Robustez por nº de jogadores | 9.0 | 3.5 | 7.0 | Intervenção guiada alcançável em ~66% (antes ~14%); aleatória ~10% |
| Consistência do documento | 9.0 | 6.5 | 7.5 | GDD, README e fichas atualizados |

## Outras escalas
- **Big Five do conteúdo:** ~1.5 → ~2.5 de 5 (mínimo 4.5). Abaixo.
- **GAMS:** ~3.6 → ~3.8 (mínimo 4.5). Abaixo.
- **Técnica (passa/não passa):** código visível **passou** (sorteio por partida); documentação **passou**; cobertura **não passou** (all-8 em 48%); registro de 15 partidas reais **não passou** (só simulação).
- **Peças RA/3D:** viabilidade em celulares **não testada**.

## O que ficou abaixo do mínimo
Todos os critérios da história, Big Five, GAMS e a cobertura técnica.

## Decisões que são suas (mudam enredo/regra)
1. Trocar Quando/Como por resposta menos chutável (por exemplo, escolher entre mais opções ou montar a sequência).
2. Dar a cada caso um enredo próprio, não só o mesmo mecanismo em 4 cadeias.
3. Prólogo feito (visita normal que ensina as telas); faltam as viradas ao longo das 5 voltas.
4. Diálogo ramificado com as figuras.
5. Testar com grupos reais e com celulares.

## O que foi feito nesta rodada
Sorteio de códigos por partida; ecos com fatos verdadeiros nas salas sem peça-chave; falas das 5 figuras; pistas com cena; texto entre voltas; pergunta de valor por caso; apresentação das telas (tour); fichas em `docs/FICHAS.md`.

## Ícones do tour (provisórios em CSS/glifo) — prompts para gerar 3D
Ícone 3D, fundo transparente, estilo cartoon macio com brilho: (1) porta de sala de museu; (2) peça com pontos brilhantes; (3) relógio com ponteiros em 21h57; (4) dossiê com lupa; (5) painel com botão de ação; (6) balão de perguntas com seletor de certeza.
