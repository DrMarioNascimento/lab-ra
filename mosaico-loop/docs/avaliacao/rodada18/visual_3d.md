# Loop · Rodada 18 (v4 revisão 16) · Avaliação visual (Parte A) e das peças 3D (Parte B)

Data: 26/11/2026. Avaliei do zero, sem ler as avaliações da rodada 17. Não alterei nada em `/home/claude/lab-ra`. Os scripts estão em `/tmp/roda/esc/rod18/pw/` e as capturas em `/tmp/roda/esc/rod18/vis/`. Abri um navegador meu por vez e fechei cada um ao terminar. Havia um Chrome de outra avaliação rodando, e não mexi nele.

**Nota geral:** a **Parte A passa**, com os 9 critérios em 9. A Estabilidade voltou ao mínimo: medi 0 px de variação em todos os estados de todos os minijogos, nas duas larguras. Na **Parte B, 14 de 15 salas passam**. A **Oficina elétrica (E02) reprova**: a peça não tem o gerador, a bancada, as luvas nem o painel de ferramentas que o cartão e as pistas citam, e no museu 3D só aparece o teto cinza da maquete.

## Fontes
- `pw/cap18.mjs` → `vis/cel/` (`pw/cap18_390.json`, `pw/cap18_360.json`), em 390×844 e 360×740. Cobre:
  - a entrada (sem código, com código e "Participar");
  - o manual (6 passos, com a altura de cada um);
  - 3 salas com peça (Galeria, Coleções, Central);
  - 8 minijogos, cada um medido em 6 estados (início, dica 1, dica 2, erro, logo após acertar, depois de acertar);
  - a luz de lado nas posições 1 a 5, com dica e com "Anotar";
  - o livro da Conservação em 10 páginas, com a tábua;
  - o gravador (parado e tocando), a Máquina, o caderno com 202 pistas e o desfecho (com 6 fatos e vazio).
- `pw/coop1.mjs`: confere com toque real as 3 bancadas em dupla. Erro e acerto funcionam nas duas larguras. Na 1ª rodada, uma bancada em 360 não fechou depois do acerto: era efeito do clique programado no teste, não do jogo.
- `pw/planta.mjs` e `pw/caminha.mjs` → `vis/planta/` (`planta.log`): as 4 orelhas, o Térreo e a caminhada da Recepção ao Subsolo.
- `pw/tl40.mjs` → `vis/telao/` (`tl40.log`): telão em 1280×720 e 1920×1080, com 12 e 40 nomes, em 9 estados (62 páginas).
- `pw/sim.mjs` → `vis/sim/` (`sim.log`): partida inteira no simulador, com 4 participantes, até o resultado.
- Museu 3D:
  - `pw/torre15.mjs` (390) → `vis/torre/` e `vis/folha_torre.png`;
  - a Galeria de perto: `pw/gal.mjs` (390) e `pw/gal360.mjs` → `vis/gal/`, com os recortes `crop_testa_390.png` e `crop_rach_390.png`.
- Peças na sala: `pw/pecas18.mjs` → `vis/pecas/` (15 salas, de frente e giradas 60°; `pecas390.log`, `pecas360.log`) e as folhas `vis/folha_pecas_390.png`, `vis/folha_pecas_giro_390.png` e `vis/folha_4.png`.
- Limites: o Chrome renderiza por software (headless, sem áudio). Não usei aparelho real e não abri a RA.

---

## PARTE A · Padrão visual (mínimo 9)

| # | Critério | Antes (r14) | Agora | Passa? | Motivo em uma linha |
|---|---|---|---|---|---|
| 1 | Profundidade 3D | 9 | **9** | sim | Todos os botões medidos têm sombra (entrada, bancada, barra Mapa/Máquina/Caderno); salas da planta em relevo; abas do telão e fichas do desfecho com volume |
| 2 | Ícones | 9 | **9** | sim | Miniaturas 3D próprias em planta, Máquina, gravador, caderno, desfecho, fita do telão e minijogos; emoji só de apoio (🔒 e 👨👩👥 por decisão) |
| 3 | Muito visual | 9 | **9** | sim | Planta com peças 3D por sala, Máquina com fichas e ícones, desfecho em fichas, telão em cartões com ícone; o manual começa pela planta |
| 4 | Paleta coerente | 9 | **9** | sim | Azul-noite com dourado e verde-água em todas as telas; planta em papel (decisão); roxo só no professor; vermelho-tijolo só na reforma |
| 5 | Celular | 9 | **9** | sim | 0 estouro em todas as telas; 0 botão < 44 px na bancada (controle da luz com 44 px); planta inteira acima da barra (757<771 em 390; 659<667 em 360); "?" do glossário com 22 px + área invisível de 11 px de cada lado (44 px) |
| 6 | Estabilidade | **8** | **9** | sim | 8 minijogos × 4 estados × 2 larguras: topo e altura da janela idênticos; luz 1–5 + dica: 697 px (390) e 638,5 px (360) sempre; livro com `doc` e leitura fixos em 10 páginas; telão sem estouro |
| 7 | Linguagem | 9 | **9** | sim | "Nesta atividade você vive o papel de quem lembra das voltas.", "Ainda não fechou. Olhe de novo…", "Agora você tem motivo.": 2ª pessoa, frases curtas, sem marca de gênero |
| 8 | Telão | 9 | **9** | sim | 62 páginas (12 e 40 nomes, 1280 e 1920): 0 estouro, letra ≥ 1,35% da largura, páginas por tema (Relógio/Mapa/Turma/Máquina; Desfecho/A noite/Para conversar/Missões/Turma), "Tela cheia" sempre à vista |
| 9 | Entrada | 9 | **9** | sim | Participar com código; Conduzir como professor (roxo, 🔒, "Só o Professor tem a chave"); Abrir telão; Simulador; com código: nome + Bem-vindo/Bem-vinda/Tanto faz (decisão) |

**9 de 9 no mínimo.**

### O que medi e vi
- **Minijogos (revisão 16: altura reservada).** Janela (topo/altura, em 390 e 360):
  - `tombo_2`: 101,5/641,5 e 65,5/609,5;
  - `traj_1`: 108,5/627 e 72,5/595;
  - `insc_copia`: 87/669,5 e 45/650,5;
  - `c_peca`: 90/664,5 e 54/632,5;
  - `falsa_1.antes`: 101,5/641,5 e 54,5/631;
  - as 3 bancadas em dupla: 584,5, 647,5 e 558,5 (390).
  - Nas duas larguras: início = dica 1 = dica 2 = erro, posição de cada elemento igual, 0 rolagem e letra mínima de 12 a 13 px.
  - Acertar fecha a janela, ou passa do `antes` para a luz.
- **Luz de lado:** a posição certa muda com a semente (nesta foi a 5). As 5 posições e a dica não mudam nada (0 px). "Anotar" fica apagado até achar a posição. Ao achar, aparece "O verniz cobre tudo por igual, até o grão. Nenhuma borda gasta, nenhum risco de uso." no espaço já reservado, e a janela não pula. Anotar guardou `falsa_1`. **A falha da r14 está resolvida.**
- **Livro com a tábua:** a tábua fica na página da direita do 1º par (12 símbolos de 43×63 px em 390 e 38×63 em 360, legenda de 12 a 12,8 px, 0 estouro). O documento tem 2370 px (390) em todas as 10 páginas.
- **Gravador:** 6 faixas de 138×64 (390) e 126×64 (360). O deck fica com 462 px parado e tocando.
- **Máquina:** 4 abas de 155×46 (390). Missão secreta, fichas "2 sinais / 1 leitura / 1 defeito" e defeitos em botões.
- **Planta:** veja as 4 orelhas.
  - Térreo: 3 colunas de salas e, na faixa da escada, 1º andar | Subsolo | Esculturas | Área de descanso. A Sala das esculturas está fechada (hachura, carimbo "em reforma", cadeado) entre a escada e a Área de descanso.
  - A porta de baixo da Área de descanso dá para o corredor de volta, em frente à porta da Base da limpeza.
  - Caminhada: alfinete na origem, destino tracejado (orelha e sala) e chegada em 10 s.
- **Telão:** a fita "A noite" tem 10 linhas com "Quem trouxe" e 0 corte. "Ouro" vem com a sirene e o Téo (quem tem a pista).
- **Simulador:** telão em cima e turma embaixo. Partida completa em cerca de 217 s, com 0 erro de página. Os celulares acabam em "A noite, reconstruída.".

### Menores (não derrubam nota)
- **Manual, passo 1:** "Voltar" e "Próximo" ficam abaixo da dobra. A janela rola 252 px (390) e 387 px (360) para chegar neles; "Entendi" fica fixo à vista. Sugestão: subir a navegação para cima da cena (`.tour-cena`) ou deixá-la fixa com o "Entendi".
- **Caderno:** os cabeçalhos das fichas têm até 4 linhas em 360 ("PÁTIO · QUADRO EXTERNO · VOLTA 3 · RELATO"). Funciona, mas é comprido.

---

## PARTE B · Peças 3D das 15 salas (Seção 5)

Mínimos: Pertencimento, Dedução, Segurança e Celular ≥ 9; Ambiente, Dinâmica, Persistência, Novidade e Viabilidade ≥ 8.

**Medições.**
- **Na sala** (`pecas18`, 390 e 360): 15 de 15 modelos carregados, 0 par de pontos a menos de 44 px (mínimo de 47 a 72 px), 0 ponto fora da caixa e 0 erro.
- **No museu 3D** (`torre15`, 390): 15 de 15 centradas acima do cartão, com 0 erro de página.

| Sala | Peça | Pert. | Ded. | Seg. | Cel. | Amb. | Din. | Pers. | Nov. | Viab. | Resultado | Antes (r14) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Subsolo · Câmara do tempo | T01 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Central de monitoramento | S01 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Recepção | P01 | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Oficina técnica | M03 | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Oficina elétrica | E02 | **8** | 9 | 9 | 9 | **7** | 8 | 9 | 8 | 8 | **REPROVA** | passa |
| Ateliê de descobertas | L06 + manual | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Sala de conservação | I01 + livro com a tábua | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 9 | 9 | **PASSA** | passa |
| Sala dos relógios | REL_B | 9 | 9 | 9 | 9 | 8 | 8 | 8 | 8 | 9 | **PASSA** | passa |
| Área de descanso | DESC_B | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | **PASSA** | passa |
| Base da limpeza | L08 | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Sala dos sons | N17 + gravador | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Sala da fotografia | N18 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Pátio · Quadro externo | Q01 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 9 | **PASSA** | passa |
| Sala das coleções | D10 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | **PASSA** | passa |
| Galeria especial | GAL_B | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | **PASSA** | passa |

**14 de 15.**

### Oficina elétrica (E02): por que reprova
- **O que o jogo diz.**
  - O cartão da sala e do museu 3D (`LOOP_DESC.eletrica`) diz: "O gerador ronca baixo entre fios, fusíveis e luvas."
  - A legenda (`LOOP_SALAS`) diz: "Gerador, fusíveis e luvas".
  - As pistas da sala falam de objetos que se veem e se tocam na peça: a fita de papel do gerador, a ordem de serviço colada no gerador e o verso dela, a gaveta de baixo da bancada, um fusível na bancada, o painel de ferramentas com a chavinha num prego, o gancho com as luvas, o painel de fusíveis e o procedimento na parede.
- **O que a peça tem.**
  - Os nós do GLB são piso, paredes, teto em pedaços, pilar com medalhão, canaletas, bandejas de cabos, luzes de emergência, um distribuidor de barras de cobre sob uma redoma, baterias, um quadro elétrico e um alçapão.
  - **Não há** gerador, bancada, gaveta, painel de ferramentas nem gancho com luvas.
  - O próprio `PECAS-A-CONSEGUIR.md` registra que "o modelo não tem painel de fusíveis".
  - Na sala (`vis/pecas/eletrica_390.png`), a peça é uma sala alaranjada quase vazia. Os 7 pontos visíveis caem no chão, nas quinas e no ar, sem objeto embaixo.
- **Pertencimento: 8.** A sala é da história, mas 4 dos objetos que as pistas mandam tocar não existem no modelo.
- **No museu 3D** (`vis/torre/sala_09_Oficina_ele_trica.png`), a câmera vê a maquete de cima e o teto (`teto`, `teto_a` a `teto_d`) cobre tudo. Aparece só uma laje cinza, embaixo do cartão que promete o gerador.
- **Ambiente: 7.** Não há lugar para explorar.
- **O que corrigir** (detalhes na lista (a), no fim).

### Galeria (GAL_B)
- **De perto no museu 3D** (`gal/crop_testa_390.png`, câmera a 0,152; o mesmo vale em 360, a 0,148): a fileira de 6 símbolos da testa se lê (rosto, pedra, ver, noite, guardar virado, tempo), e o 5º abre para o lado contrário ao da tábua.
- A rachadura fina aparece na bochecha direita de quem olha.
- A pedra cinza-clara e as bordas inteiras batem com "Peça e foto lado a lado" e com a bancada "A rachadura está do outro lado".
- **Luz de lado:** a imagem continua fosca e granulada, e o texto "até o grão" (sem chamar a cópia de pedra) combina com ela.
- **"Antes de acender a luz":** mostra as miniaturas da GAL_B e da N18 e pergunta pela foto grande do catálogo, sem contradição.

### Outras (menores, não derrubam)
- **Recepção (P01):** o cartão cita "a roleta e um telefone que toca", e nenhum dos dois está na peça (mesa, luminária, livro e crachá na gaveta). É o mesmo tipo de coisa da cadeira do Téo fora da M03: o telefone é som e a roleta é da sala. Ambiente 8.
- **Sala de conservação (I01):** "registros em cima da mesa", mas a peça é um fichário. A mesa de leitura é o livro 3D logo abaixo. Ambiente 8.
- **Oficina técnica (M03):** "armário travado" é o gaveteiro vermelho; a cadeira do Téo fica "num canto, longe da bancada", e o texto explica a ausência.
- **Área de descanso (DESC_B):** a cafeteira, o mural e a porta de serviço estão todos na peça. A porta de vidro das Esculturas aparece na planta (revisão 16), ao lado da escada.
- **Pátio (Q01):** pedra molhada, para-raios em cima do muro e cadeado pequeno: bate com o cartão.

---

## Resumo

**(a) Obrigatório para o mínimo**
1. **E02, Oficina elétrica (Parte B; Pertencimento 8 e Ambiente 7):**
   - fazer a peça ter o que as pistas mandam tocar: gerador, bancada com gaveta, painel de ferramentas com prego e gancho com luvas. Dá para compor com peças da biblioteca do LAB-RA em `museu/pecas-compostas.mjs` ou com arte nova, e depois reposicionar os pontos de `LOOP_PONTOS.E02` sobre esses objetos;
   - no museu 3D, esconder os nós `teto*` da E02 (ou abrir um corte), para que o interior apareça embaixo do cartão.
   - Se o autor preferir não mexer na arte, o caminho só de texto é reescrever o `LOOP_DESC`/legenda e as prévias para o que o modelo tem (distribuidor, baterias, quadro elétrico). Isso mexe em cerca de 20 pistas que citam o gerador e passa pelas escalas de história.

**(b) Retoques opcionais**
- Manual, passo 1: deixar "Voltar"/"Próximo" visíveis sem rolar (hoje rola 252 px em 390 e 387 px em 360).
- Recepção: pôr um telefone e uma roleta pequena na P01, ou tirar a roleta do cartão.
- Conservação: trocar "em cima da mesa" por "no fichário" no `LOOP_DESC`.
- Caderno em 360: cabeçalho da ficha mais curto (sala, volta e tipo numa linha só).

Todas as escalas desta parte **não** passaram: a Parte A passou e a Parte B tem 1 reprovação (E02).
