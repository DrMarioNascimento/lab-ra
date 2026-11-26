# Loop · Rodada 11 (v4 revisão 13) · Avaliação visual (Parte A) e das peças 3D (Parte B)

Data: 26/11/2026. Avaliei do zero sobre o commit `6e52ff2` (revisões 12, a planta em papel, e 13, os retoques). Não alterei nada em `/home/claude/lab-ra`. Por engano, um script de fila chegou a ser criado em `cinco-minutos/museu/`; apaguei na hora, e o `git status` ficou limpo.

**Nota geral:** na Parte A, os 9 critérios estão no mínimo (média 9,0). Na Parte B, as 15 salas passam. **Sobre esta leva:** ela já reprovou na escala da história, por causa da imagem fosca da máscara contra o texto "o verniz brilha por igual" no minijogo da luz. Pela ótica visual e 3D, eu confirmo esse ponto como achado (ver B, Galeria, e a lista de opcionais). Ele não derruba nenhuma das escalas desta avaliação.

## Fontes (tudo em `/tmp/roda/esc/rod11/`)
- `vis/vis3/`: as 17 telas do `vis3.mjs`, em 390 de largura, mais o simulador e o telão em 1280.
- `vis/planta/`: as 4 orelhas, nas larguras 390 e 360 (`orelha_*`). Também a partida no Saguão (`1_*`), a chegada na Recepção (`2_*`) e a **caminhada** de Recepção até o Subsolo (`c1`–`c4`, `pw/caminha.mjs`).
- `vis/visB_extra/` (`pw/auditA`, `pw/auditB`): entrada, sala de entrada, manual com 6 passos, mapa, 3 salas, lista, as 4 abas da Máquina, caderno, pausa, final, resultado, Professor, participante e conduzir, nas duas larguras.
- `vis/capB/` (`pw/cap.log` = `cap_1.log`): minijogos (`tombo_2`, `falsa_1` com antes/meio/achou da luz, `traj_1`, `c_peca`), livro, gravador (parado e tocando), caderno e provas.
- `vis/insc/` (`pw/insc.mjs`, que dá OK nas duas larguras): livro com a tábua, minijogo dos símbolos, erro, revelar e caderno com a cópia, a tábua e a verdadeira.
- `vis/pecas/` e `vis/folha_pecas.png` (`pw/pecas.mjs`): as 15 peças na sala.
- Telão: `vis/r6/tl40_*` (1280; 12 e 40 nomes), `vis/fitaB/` (1280 e 1920: "A noite" e "Missões" com 8×40) e os logs `tl40`, `tlB`, `fita_pwB`, `miss8`, `fins`, `mgest`, `ll2`, `join`, `gate` e `stats`.
- Museu 3D: `vis/gal/h0_390.png` e `h1_roda_390.png` (`pw/gal2.mjs`): Galeria aberta pela lista e aproximada com a roda do mouse sobre a testa.
- Limites:
  - A máquina caiu por falta de memória (OOM) enquanto outras avaliações rodavam ao mesmo tempo. Por isso, `torre15`, `torre15_360`, `torre_testa2` e a segunda rodada do `cap` não chegaram ao fim.
  - Depois da queda, o `torre15` (390×844) rodou sozinho e deu **15 salas, 0 falha e 0 erro de página**, com a peça centrada acima do cartão (`pw/torre15.log`, `vis/torre/`). O `torre15_360` não foi refeito.
  - O `tl40` estourou o tempo (900 s) depois de gravar 53 medições, todas com "estouro 0".
  - O Chrome renderiza por software, não usei aparelho real e não abri a RA.

---

## PARTE A · Padrão visual (mínimo 9)

| # | Critério | Antes (r10) | Agora | Passa? | Motivo em uma linha |
|---|---|---|---|---|---|
| 1 | Profundidade 3D | 9 | **9** | sim | Botões da escada (▲ 1º andar / ▼ Subsolo), orelhas e salas da planta com borda inferior e sombra; o resto igual à r10 |
| 2 | Ícones | 9 | **9** | sim | Salas da planta com a miniatura 3D da peça; censo da `auditA`/`auditB`: só ✕ e 🔒 de apoio. As setas ▲▼ da escada são texto, menor |
| 3 | Muito visual | 9 | **9** | sim | Planta com paredes, portas, escada, Pátio de fora, rosa dos ventos e carimbo do andar. O manual (passo 1) ainda mostra o mapa antigo de cartões |
| 4 | Paleta coerente | 9 | **9** | sim | Planta em papel na paleta do Limiar (decisão do autor) dentro da moldura azul-noite/dourado; alfinete dourado e tracejado verde-água iguais na legenda, nas orelhas e nas salas |
| 5 | Celular | 9 | **9** | sim | Planta inteira acima da barra (folha termina em y 757/752 contra a barra em 771 com 390; em 659/654 contra 667 com 360), 0 alvo < 44, 0 corte, letra ≥ 12 (fora o "N" decorativo de 6 px) |
| 6 | Estabilidade | 9 | **9** | sim | Na caminhada só mudam as classes (fim da folha igual antes e depois); minijogo dos símbolos 87:670 antes = depois do erro; Máquina 250:112 nas 4 abas; livro com 316 px fixos |
| 7 | Linguagem | 9 | **9** | sim | "Você está aqui", "Para onde você vai", "Toda volta começa aqui.", "Dá para ouvir a chuva fina.": 2ª pessoa, curtas, sem marca de gênero |
| 8 | Telão | 9 | **9** | sim | `fita_pwB` com `maxCortePx` 0; `miss8` com 0 falha (8×40 em 1280 e 1920); `tl40` com 0 estouro em 53 medições; "Tela cheia" sempre à vista |
| 9 | Entrada | 9 | **9** | sim | Tela-padrão inteira; em 360×740 "Jogar sem turma" fica dentro da tela; os 7 endereços respondem 200 (`stats`) |

**9 de 9 no mínimo. Média 9,0.**

### O que medi e vi de novo
- **Planta (revisão 12):** nas 4 orelhas, nas duas larguras, nada estoura, nada é cortado e nenhum alvo fica abaixo de 44 px.
  - O alfinete começa no Saguão (2º andar), e a orelha do 2º andar também ganha o alfinete.
  - Durante a caminhada, a origem fica com o alfinete (Recepção), o destino fica tracejado (a sala Subsolo e a orelha Subsolo) e o aviso de leitor de tela diz "Você está indo para Subsolo · Câmara do tempo.". Isso está certo nos dois sentidos (`caminha.log`; o tempo restante logo depois do toque é de 9,96 s).
  - No Térreo de 360, "Central de monitoramento" cabe em 2 linhas.
- **Retoque novo (A3/A4):** o passo 1 do manual ("Escolha uma sala") ainda ilustra o mapa antigo, com 4 cartões (Galeria, Central, Subsolo, Recepção). Quem abre o mapa depois encontra a planta de papel com orelhas (`visB_extra/b07_mestre_390.png` contra `planta/orelha_*`). É uma ilustração só, não reprova.
- **Retoque novo (A1/A6):** durante os 10 s de caminhada, o cabeçalho e o painel já mostram a sala de destino ("Subsolo · Câmara do tempo", peça e pontos), sem nenhum aviso visível de "andando". Só a planta mostra a caminhada. Tocar num ponto avisa "Você ainda está chegando na sala." (`planta/c4_sala_andando_390.png`). Uma faixa "Chegando… 10 s" no painel resolveria. Isso já vinha de antes da planta e é menor.
- Ficam como na rodada 10: aviso do `c_peca` com 4 px de rolagem em 360; telão do simulador com 745×419 fixos; "guardar" com 34 px numa ficha de 39 px no livro em 360 (agora não encosta: `ll2`).

---

## PARTE B · Peças 3D das 15 salas (Seção 5)

Mínimos: Pertencimento, Dedução, Segurança e Celular ≥ 9; Ambiente, Dinâmica, Persistência, Novidade e Viabilidade ≥ 8.

**O que mudou para as peças desde a r10:**
- LOOP_DESC da Oficina técnica: a cadeira agora fica "num canto, longe da bancada", o que explica por que ela não aparece na M03.
- LOOP_DESC do Pátio: "Dá para ouvir a chuva fina" explica o piso seco do Q01.
- Atividade da cópia: "pedra cinza, mais clara" e "bordas inteiras, sem desgaste", no lugar de "brilhando" e "lisa".
- Q01: "interruptor do ponteiro" e "Na mesma chave".
- Luz de lado: usa `GAL_B_mascara.webp`, agora com a inscrição.
- Museu 3D: na Galeria, `minDistance` foi para 0,045 e o zoom vai para onde está o dedo.

| Sala | Peça | Pert. | Ded. | Seg. | Cel. | Amb. | Din. | Pers. | Nov. | Viab. | Resultado | Antes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Subsolo · Câmara do tempo | T01 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Central de monitoramento | S01 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Recepção | P01 | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Oficina técnica | M03 | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | passa (agora sem a falta da cadeira) |
| Oficina elétrica | E02 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Ateliê de descobertas | L06 + manual | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Sala de conservação | I01 + livro com a tábua | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 9 | 9 | **PASSA** | passa |
| Sala dos relógios | REL_B | 9 | 9 | 9 | 9 | 8 | 8 | 8 | 8 | 9 | **PASSA** | passa |
| Área de descanso | DESC_B | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | **PASSA** | passa |
| Base da limpeza | L08 | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Sala dos sons | N17 + gravador | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Sala da fotografia | N18 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Pátio · Quadro externo | Q01 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 9 | **PASSA** | passa |
| Sala das coleções | D10 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | **PASSA** | passa |
| Galeria especial | GAL_B | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 8 | **PASSA** | passa |

**Passam 15 de 15.** Nas 15 salas: 0 par de pontos a menos de 44 px (distância mínima de 47 a 72 px), 0 ponto fora da caixa e 0 estouro (`auditA`, `pecas`).

### Galeria (GAL_B)
- **Na sala:** máscara cinza-clara, de bordas inteiras, com a fileira de 6 símbolos na testa. Agora bate com "pedra cinza, mais clara" e "bordas inteiras, sem desgaste" (antes estava "brilhando" e "lisa").
- **Minijogo da luz** (`capB/mg_luz_achou_390.png`): a imagem agora tem a inscrição, então a pendência da r10 sumiu. Mas a superfície que aparece é granulada e fosca, enquanto o texto diz "O verniz brilha por igual, de ponta a ponta.". **Confirmo o achado que reprovou a leva na história.** Do lado visual, a correção é renderizar a máscara da cópia com reflexo uniforme (pouca rugosidade e um realce largo sob a luz) ou mudar o texto. Na Seção 5 isso fica como menor, porque a pista e a dedução estão certas.
- **Museu 3D** (`gal/h1_roda_390.png`): com a roda sobre a testa, a câmera chegou a 0,136 em 30 passos, sem bater no limite de 0,045. A fileira já se lê, com cerca de 10 px por símbolo, e o 5º virado se distingue. Na r10 eram cerca de 7 px, sem leitura. Com pinça de dois dedos chega mais perto.
- **Retoque mantido:** a peça fica baixa na caixa da sala, com cerca de 100 px vazios em cima (`pecas/peca_galeria.png`, igual à r10).

### Outras
- **M03:** o texto agora tira a cadeira do quadro, e a peça (bancada vermelha, ferramentas, armário) bate com "Ferramentas e um armário travado".
- **Q01:** "Dá para ouvir a chuva" não promete chuva visível. O medidor redondo e a chave de baixo batem com "o interruptor do ponteiro". Segue faltando a luva no chão e o giz na parede (secundários).
- **Nenhuma peça tem animação nem reage ao apagão.** Por isso Dinâmica e Persistência ficam como estavam.

---

## (a) OBRIGATÓRIO para o mínimo
Nenhum item derruba as escalas visual e 3D. (Fora desta avaliação, a leva já está reprovada na história pela luz de lado. Ver o primeiro item de (b), que é a mesma correção vista pelo lado da imagem.)

## (b) Retoques opcionais
| Retoque | Onde | Tipo |
|---|---|---|
| Luz de lado: máscara granulada e fosca contra "verniz brilha por igual" | `GAL_B_mascara.webp` (render com reflexo uniforme) ou `LC_MG.falsa_1.luz.achou` | render ou texto |
| Passo 1 do manual ilustra o mapa antigo de cartões, não a planta com orelhas | ilustração do manual em `game.js`/`style.css` | CSS/HTML |
| Sem aviso visível de "andando" no painel da sala durante os 10 s | `renderClues`/painel da sala | JS/CSS |
| Galeria baixa na caixa da sala (cerca de 100 px vazios em cima) | `PECA_PERTO.GAL_B` (alvo/raio) | JS |
| Setas ▲▼ da escada como glifo de texto; "N" da rosa dos ventos com 6 px | planta (`style.css`) | CSS ou ícone |
| `c_peca` rola 4 px em 360; telão do simulador com largura fixa | CSS | CSS |
| Q01 sem a luva no chão e o giz; nenhuma peça reage ao apagão | modelos | arte |

**Fim:** nesta rodada, as escalas visual (9 de 9) e de peças 3D (15 de 15) passaram. Como a leva reprovou na história, a contagem de rodadas limpas recomeça depois da correção.
