# Mosaico Loop v4 revisão 16: conferência técnica (seção 4 das escalas), refeita do zero

**Resultado: PASSA.** Os 10 itens passaram, com 0 falha bloqueante e 15 menores. Das menores, 2 são novas (m10 e m15) e nenhuma aparece para quem joga.

**Critério.** É bloqueante o que quem joga vê errado ou o que quebra a partida. É menor o que fica em campo interno, em documento ou em decisão já registrada, ou uma frase que não revela nada nem quebra a partida.

## Estado conferido e limites

- **Retrato do repositório.** Tirei um retrato no começo, às 19:15 (`aud/snap_ini.txt`, 1.105 arquivos), e outro no fim, às 20:41 (`aud/snap_fim.txt`): md5 igual, arquivo por arquivo. O `git status` está limpo e o HEAD é `f10de0b` (lote 13, revisão 16). Não escrevi nada no repositório. Rodei o Python com `PYTHONDONTWRITEBYTECODE=1`, sem `-I`.
- **Scripts.** Copiei os scripts de `rod14/aud` (que já trazem os de `rod11`) para `rod17/aud` e troquei `cinco-minutos` por `mosaico-loop` e `rod14` por `rod17`.
  - Os testes de tela não guardam chave do navegador com nome antigo: usam `window.coop.storageKey` e o estado da página, então não houve chave para trocar. O jogo usa as chaves `mosaico-loop-ensaio-v1`, `-ciclo-v1`, `-caderno-v1`, `-bilhetes-v1`, `-sala-v1` e `-caderno-<código>`.
- **Um navegador por vez.** Rodei os testes um depois do outro, numa fila só (`aud/fila17.sh` e `aud/fila17b.sh`, registro em `aud/fila17.log`).
  - Antes de cada teste, a fila esperava até 60 s se houvesse um navegador de outra avaliação aberto. Às vezes rodou junto com um navegador de fora.
  - Nenhum teste estourou o tempo e nenhum caiu.
- **Testes novos desta rodada.**
  - `aud/t17/t17.mjs`: toque de verdade nas 5 causas, em 390×844 e 360×740. Adaptei do `t14` para a revisão 16: planta do Térreo com a geometria nova, resposta e texto novos da luz de lado, miniatura `GAL_B` no desfecho e `maq_ver`.
  - `aud/t17/maq.mjs`: `maq_ver` por toque nas 5 causas.
  - `aud/an17/espaco_terreo.py`: frases de lugar do Térreo.
  - `aud/an17/diff1416.txt`: diferença dos dados entre a revisão 14 e a 16.

## O que a revisão 16 mudou, conferido

- **Dados** (`an17/diff1416.txt`). Mudaram exatamente os 5 textos do registro (`maq_ver`, `falsa_3`, `c_esc_3`, `coop_copia_ok` e `telaPapel.A` do Lado a Lado) e a versão.
  - Os ids são os mesmos e estão na mesma ordem.
  - Nenhuma volta, horário, tranca, `precisaDe`, `soNaCausa`, prévia, custo ou `textoPorCausa` mudou.
- **Planta como grafo** (`r15/caminho.mjs`): 41 OK, 0 falha.
  - Da Área de descanso, há porta direto para o corredor.
  - Essa porta fica em frente à Base da limpeza (x = 255, dentro de 210–300).
  - A Área de descanso chega à escada do Subsolo pelo corredor, sem passar pela Sala das coleções.
  - A Sala das esculturas tem porta de vidro para a Área de descanso e encosta na escada. Nenhuma porta comum abre para dentro dela.
  - Todas as salas tocáveis têm porta e se alcançam a partir da escada.
- **Planta por toque** (`t17`, parte A): 10 de 10.
  - Na tela, as esculturas ficam entre a escada e a Área de descanso.
  - A porta de baixo da Área de descanso cai sobre a Base da limpeza, e o vidro fica na parede da Área de descanso.
  - Na escada, a seta fica em cima do nome.
  - Salas por andar: 1, 4, 9 e 1. A folha tem 520 px em 390 e 422 px em 360.
  - Nenhum alvo de toque abaixo de 44 px e nenhum nome cortado.
  - Tocar nas esculturas não faz nada e não gasta energia.
  - Com o botão Mapa, a folha termina acima da barra de baixo: 757 < 771 em 390 e 654 < 667 em 360 (`pl/jogo`).
- **Altura fixa nos minijogos** (`r15/luzalt.mjs`): 40 de 40 OK.
  - Luz de lado, em 4 sementes e 2 tamanhos: a janela fica com 73,5/697 px nas 5 posições da luz, com a 1ª e com a 2ª dica.
  - Os outros 8 minijogos, em 2 sementes e 2 tamanhos: nada mexe ao pedir as dicas nem ao errar, e nada rola.
- **Luz de lado e "Antes de acender a luz"** (`t17`, parte B): 10 de 10.
  - As 4 opções novas aparecem. A certa, "Arranhada, beiradas roídas", não repete as palavras de `par_foto`.
  - A 1ª dica aponta para "Foto grande do catálogo". Errar não gasta energia (4→4).
  - O texto achado é exatamente "O verniz cobre tudo por igual, até o grão. Nenhuma borda gasta, nenhum risco de uso.", sem "pedra".
  - A imagem `GAL_B_mascara` carrega e fica inteira.
- **Caixa da estante** (`t17`, parte C): 10 de 10. A 1ª dica é a nova e curta.
- **Desfecho** (`t17`, parte G): 10 de 10.
  - A ficha "A cópia na Galeria" usa `GAL_B.webp`.
  - A prova "a peça é cópia" também usa `GAL_B`.
- **`maq_ver`** (`t17/maq.mjs`): 5 de 5.
  - O texto que entra no caderno é igual nas 5 causas, sem algarismo, e tem "Loop Reset".
  - A parte H do `t17` acusou falha, mas o erro era do teste. Ele procurava o texto no painel, e o texto vai para o caderno.

## Tabela

| # | Item | Resultado | Bloqueantes | Menores | Evidência |
|---|---|---|---|---|---|
| 1 | Cronologia e testemunhas (com os caminhos na planta) | **PASSA** | 0 | 2 (m1, m2) | **Caminhos:** `caminho.mjs` deu 41 OK e 0 falha, com o caminho 4:00 → 4:02 → 4:05 → 4:10 feito na planta (porta de serviço → Área de descanso → corredor diante do Seu Dirceu → escada). **Horários e testemunhas** (`n6/crono17.txt`): iguais aos da rodada 14 (`diff` vazio). **Frases de lugar** (`an17/espaco_terreo.txt`): conferi 63 contra a planta, por exemplo pegadas "saem da Sala das coleções, cruzam a Área de descanso e somem na porta de serviço" (porta Coleções→Descanso e porta de fora existem); armário ao lado da Base da limpeza; `ivone_red` (vidro do Ateliê dá para a Área de descanso e o Seu Dirceu vê a porta dela); `pose` (vidro das esculturas, escultura aponta para a escada ao lado); Oficina elétrica com porta para o Pátio. Nenhuma contradição. **Testemunhas:** nenhuma que não poderia existir. |
| 2 | Origem, volta e quem vê | **PASSA** | 0 | 0 | São 281 pistas, ids únicos, `quemPodeVer` "todos" nas 281. As 88 com `precisaDe` têm `porque`. O validador dá 0 referência quebrada e 0 pista inalcançável nas 5 causas. `trava_all`: 66 trancas × 5 causas = 330 toques, todos com a frase certa, 0 energia gasta, 0 pista entrando, 0 botão coberto, 0 frase diferente entre causas. `insc_caminho` e `insc5` passaram nas 5 causas. `r10/insc` passou em 390 e 360. |
| 3 | Palavras proibidas e prévias (ordem, pontos, contagem, custo, ícone, altura, `textoPorCausa`, planta, desfecho) | **PASSA** | 0 | 1 (m3) | **Planta:** 1 versão de HTML em cada largura × volta (390 e 360 × voltas 1, 3, 5), igual entre as voltas, mesma altura nas 5 causas (`t17`). **Prévias** (`pares`): 219 chaves, 0 diferença por campo. Validador g e g2: 0 em causa única, 0 de 75 com ordem diferente. **Ordem:** `n6/ordem` deu 0 de 75 (também com o conserto) e `r7_ordem` deu 22.500 comparações, todas iguais. **Contagem** por sala igual nas 5 causas (`palavras17`). **Causa trocada** (`forca`): 2.760 combinações, 0 diferença. **Pontos:** `hs2` deu 0 de 15 salas com desenho que muda com a causa; `pnovo` passou. **Altura:** `luzalt` 40 de 40. **`textoPorCausa`:** nenhum mudou na revisão 16. **Textos novos:** `maq_ver` igual nas 5 causas e sem número; `falsa_3` só na volta 2 e só com `falsa_1`; a frase "impressa ao contrário" não conclui nada; `c_esc_3` existe nas 5 causas. **Desfecho:** `final_tela` com 0 ruins; sirene e Téo acordando só com a fonte. "Lenz" não aparece na volta 1. |
| 4 | Fonte para cada fato essencial (1, 2 e 3 pessoas, 5 causas, simulador e código) | **PASSA** | 0 | 1 (m4) | **Simulador:** `validar.py 2000`, semente 31353, APROVADO nas 5 causas (`val17/validar.txt`). Com 1, 2 e 3 pessoas o jogador ótimo chega ao Ouro na volta 5, e também em 4 sementes extras (todas Ouro). Bot entre 0,00% e 0,05%. 0 essencial sem 2 caminhos e 0 sala que fecha o diagnóstico sozinha. `trio.py`: 25 de 25 Ouro (1 a 5 pessoas × 5 causas). **Código real:** `real_solo` e `real_solo_teo` dão Ouro nas 5 causas; `real_par` dá Ouro no DESFECHO DA TURMA nas 5; `real_trio` também, nas 5. `ivone` passou. |
| 5 | Códigos decoráveis | **PASSA** | 0 | 2 (m5, m6) | `pw/sem` e `pw/dist` (4.000 sorteios): dia, hora, ordem, chave e causa espalhados; posição da resposta certa espalhada em todos os minijogos, também no "antes" novo (765/750/752/733). `z/dist10`: posição espalhada (762/745/733/760). Nenhum valor fixo aparece ao jogador. |
| 6 | Até 60 palavras por bloco mostrado | **PASSA** | 0 | 1 (m7) | `blocos`: 106.832 blocos no DOM nas 5 causas, **0 acima de 60**. Maiores: `cracha_3` e o dossiê com 58, final Ouro com 53. Textos novos: `falsa_3` 36, `c_esc_3` 38, `maq_ver` 33 (em 2 blocos de 14 e 19), Lado a Lado A com 4. No `t17`, o maior bloco do "antes" tem 21 e o texto achado da luz, 16. |
| 7 | Documentação × dados × código | **PASSA** | 0 | 2 (m8, m10) | O `loop-central-dados.js` é igual ao `pistas-v4.json`, com cabeçalho "v4 revisão 16". O diff de dados bate item por item com o LOOP-CENTRAL, a DECISOES e a ROTEIRO (parte 21). As versões nas páginas batem com o registro: `style.css?v=28` nas 5 páginas, `game.js?v=52`, `loop-central-dados.js?v=39`, `loop-central.js?v=44`, `ritmo.js?v=11`, e `minigames.mjs?v=9` e `bancada.css?v=7` dentro do `loop-central.js`. O código bate com o registro: grade de 4 colunas e portas iguais, `LC_PV_IC.prova_falsa`=`GAL_B` e `LOOP_LINHA.copia.ic`=`GAL_B`. Os trechos antigos citados nas partes 19 e 20 da ROTEIRO ficam como histórico: as partes 20 e 21 dizem que valem sobre o que está acima. |
| 8 | Registro de revisão e checklist | **PASSA** | 0 | 1 (m9) | A revisão 16 está no LOOP-CENTRAL, na DECISOES e na ROTEIRO, com porquê, dados, código, versões, testes e o que não foi aplicado. A revisão 15 (pasta renomeada) também está registrada. **Checklist:** 232/27/9/9/4; ativas 210/211/210/210/215; itens por sala na volta 1 (18/12/16/7/16/12/11/19/12/8/10/12/9/5/9). Os números recalculados dos dados (`dados17`, `palavras17`) são iguais. **Cópias:** os 16 arquivos que mudaram no lote 13 têm cópia `_SUBSTITUIDO_2026-11-26f` com md5 idêntico ao da versão da revisão 15 (`d66b7b3`). 0 arquivo apagado e 0 cópia antiga alterada. |
| 9 | Vocabulário de projeto e gênero | **PASSA** | 0 | 1 (m11) | `vocab` sobre a varredura (`varre`: 10 partidas, 3.220 telas): 0 identificador interno, 0 vocabulário de projeto, 0 "carga" como recurso de quem joga, 0 regra antiga. Os "sozinho/sozinha" são falas de personagem ou descrição de objeto, não marca de gênero para quem joga. "Pronta" e "pronto" concordam com "mão" e "o que". "Você tenta os comandos" (`maq_ver`) é ação no mundo. O seletor de entrada é decisão do autor. |
| 10 | Tela real sem camada antiga, sem erro de rede, sem 404, sem nome ou pasta antigos | **PASSA** | 0 | 4 (m12, m13, m14, m15) | **Rede** (`y/rede`): 829 pedidos, 0 resposta ≥ 400, 0 falha, 0 erro de página ou de console. Os 32 ícones deram 200 ou 304. `r404`: 0 nas 4 páginas. `z/entrada` passou em 4 tamanhos. No `t17` e no `maq`, 0 pedido ruim e 0 erro. **Camada antiga** (`tela`): 0 pista fora da história na lista (9.610 listadas); 50 mapas com 15 salas; `andar`: 0 sala no andar errado em 3.000 museus. **Telão:** `tl40` e `miss8` sem estouro. **Museu 3D:** `torre15` com 15 salas e 0 falha. **Nome e pasta antigos:** 0 ocorrência de `cinco-minutos`, "Para o Fim" ou `cinco_minutos` em todo o `lab-ra` (fora as cópias `_SUBSTITUIDO_` e os relatórios em `docs/avaliacao`). A pasta `cinco-minutos/` não existe mais. Os links de `bancadas.html` para `mosaico-loop/` apontam para pastas que existem. O Firebase é o projeto `mosaico-loop`. Os "cinco minutos" que sobram são a duração da volta (decisão da revisão 15). |

## Bloqueantes

Nenhuma.

## Menores (não bloqueiam)

**Item 1**
- **m1.** (Vem da rodada 11.) Na noite D, quem conserta pelo fusível de reserva pode chegar ao fim sem ter lido nada do Téo.
- **m2.** (Vem da rodada 11.) `coop_veredito` vai para os dois aparelhos da dupla. É decisão registrada.

**Item 3**
- **m3.** (Vem da rodada 11, preventiva.) O Subsolo tem 32 rótulos para 32 lugares na peça.
- A m3 da rodada 11 (esculturas fora da planta) **fechou**.
- A testa da máscara 3D à vista desde a volta 1 é decisão do autor e não entra aqui.

**Item 4**
- **m4.** (Vem da rodada 11.) O simulador de texto é diferente do jogo no dossiê do grupo. Em dupla ou trio, o Ouro aparece só no DESFECHO DA TURMA (regra escrita).

**Item 5**
- **m5.** (Vem da rodada 11.) A resposta certa de cada minijogo é sempre a mesma frase; só a posição muda. O "antes" novo segue igual: a certa é sempre "Arranhada, beiradas roídas".
- **m6.** (Vem da rodada 11.) No minijogo de símbolos, a resposta é sempre "5º símbolo", e a inscrição é sempre a mesma (3.000 de 3.000 em `dist10`).

**Item 6**
- **m7.** (Vem da rodada 11.) O livro do Dicionário e a conversa `man_3` montam até 178 palavras no conjunto. Cada bloco mostrado fica abaixo de 60.

**Item 7**
- **m8.** (Vem da rodada 11.) O `GDD.md` usa termos antigos, e há identificadores internos com palavra antiga (`tombo_*`, `fh_pedestal`, `chao_manopla`, `catraca_*`). Nenhum aparece na tela.
- **m10.** **Nova.** O `dados/validar.py` do repositório ainda imprime "VALIDADOR LOOP v4 revisão 14". A cópia de trabalho, `/tmp/roda/sim/validar.py`, já diz "revisão 16".
  - A revisão 14 do LOOP-CENTRAL diz que as duas são iguais. Hoje elas diferem só nessa linha (`diff`: linha 589).
  - O comentário do `simulador-texto.py` também diz "revisão 14". O motor está certo, sem mudança de regra.
  - Não muda nenhum resultado. Basta subir o número no repositório.

**Item 8**
- **m9.** (Vem da rodada 11.) Os testes e o resultado do validador citados no registro ficam fora do repositório (`/tmp/roda/r15/caminho.mjs`, `luzalt.mjs`, `/tmp/roda/esc/r15/validar.txt`).

**Item 9**
- **m11.** (Vem da rodada 11.) "Obrigado por participar!", "Simulador" e "Professor" na entrada, e "Troca sozinha" no telão. É padrão de sala, já registrado.

**Item 10**
- **m12.** (Vem da rodada 11.) `sala/conteudo.js` e `game.js` ainda carregam as salas antigas: 13.250 pistas antigas, todas filtradas da tela.
- **m13.** (Vem da rodada 11.) `museu/` e `museu/torre/` sem `?loop=1` mostram o museu antigo para quem digita o endereço. Não refiz o teste.
- **m14.** Não deu para provar por servidor que o endereço antigo `/cinco-minutos/` dá 404.
  - O servidor de teste serve a raiz da pasta `mosaico-loop`, e abrir um segundo servidor na raiz do `lab-ra` foi negado pela permissão desta sessão.
  - Fica pela conferência estática: a pasta não existe e nenhum arquivo do `lab-ra` aponta para ela.
- **m15.** **Nova.** As cópias `_SUBSTITUIDO_` (por exemplo `firebase/web-config.json_SUBSTITUIDO_2026-11-26e` e `coop.mjs_SUBSTITUIDO_*`) ainda têm o projeto e as chaves `cinco-minutos`. Ficam publicadas na pasta, mas nenhuma página as carrega nem aponta para elas (`rede`: 0 pedido a `_SUBSTITUIDO_`). Guardá-las é regra do autor.

**Para quem mantém os testes**
- `t14b/barra.mjs` dá "FALHA 16" (como na rodada 14) por erro do teste: ele rola até o fim da página, e a planta fica fora da tela.
  - O toque "trial" passou em todas as salas, menos na sala em que a pessoa já está (essa fica desativada de propósito).
  - O `pl/jogo` mostra que a folha aberta pelo Mapa termina acima da barra.
  - A variante `t14b/barra2.mjs` (folha encostada no fundo da janela) também não serve: põe a folha embaixo da barra, o que nenhuma pessoa faz.
- A parte H do `t17` lia o painel; o `t17/maq.mjs` é a versão certa.

## Antes | agora | motivo

A última conferência técnica registrada é a da rodada 11, sobre a revisão 13 (`docs/avaliacao/rodada11/tecnica.md`).

| # | Rodada 11 (rev. 13) | Rodada 17 (rev. 16) | Motivo |
|---|---|---|---|
| 1 | passa | passa | Planta nova conferida como grafo (41 OK) e por toque; o caminho do homem de paletó se faz sem as Coleções. |
| 2 | passa | passa | Nenhuma tranca mudou; os mesmos 330 toques. |
| 3 | passa | passa | Fechou a m3 antiga (esculturas na planta). Altura fixa dos minijogos conferida (40 de 40). |
| 4 | passa | passa | Validador e código real continuam Ouro nas 5 causas, com 1, 2 e 3 pessoas. |
| 5 | passa | passa | Sem mudança de sorteio; o "antes" novo também sorteia a posição. |
| 6 | passa | passa | 0 bloco acima de 60; textos novos entre 4 e 38 palavras. |
| 7 | passa | passa | Fecharam a m10 e a m11 antigas (texto do telão e `style.css?v=24`). Entra a m10 nova (`dados/validar.py` diz "revisão 14"). |
| 8 | passa | passa | 16 de 16 cópias idênticas à versão anterior. |
| 9 | passa | passa | Varredura refeita: 0 em 3.220 telas. |
| 10 | passa | passa | 829 pedidos e 0 erro; nenhuma referência à pasta antiga. Entra a m15 (cópias de segurança com o nome antigo). |

## Fim do ciclo

A conferência técnica **passou**: 10 de 10 itens, 0 bloqueante, 15 menores (2 novas: m10 e m15). Nenhuma obrigatória.

Retoques opcionais:
- subir o número da revisão no `dados/validar.py` e no `simulador-texto.py` (m10);
- se o autor quiser, tirar o nome antigo das cópias `_SUBSTITUIDO_` publicadas (m15).
