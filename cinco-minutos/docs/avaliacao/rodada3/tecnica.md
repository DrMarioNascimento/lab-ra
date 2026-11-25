# Loop v4 revisão 3 — Conferência técnica (seção 4 das escalas), do zero

**Resultado: NÃO PASSA.** Dos 10 itens, 4 passam (4, 5, 8, 9) e 6 têm falha bloqueante (1, 2, 3, 6, 7, 10). A seção 4 só aceita "passa limpo".

**Estado auditado (25/11/2026, 09:43 a 10:17).** Nenhum arquivo mudou durante a auditoria (md5 do começo e do fim iguais, `aud/snap_ini.txt`).
`dados/pistas-v4.json` 09:21:50 (278 pistas) · `loop-central.js` 09:22:39 · `game.js` 09:27:56 · `docs/LOOP-CENTRAL.md` 09:28:06.
`loop-central-dados.js` é idêntico ao JSON; `/tmp/roda/sim/engine.py` e `validar.py` são idênticos a `dados/simulador-texto.py` e `dados/validar.py`.

**Como foi conferido (tudo em `/tmp/roda/esc/r3/aud/`, nada escrito no repositório):**
- Dados: `an/dados.py`, `an/palavras.py`, `an/docs.py`, `an/pares.py` (novo: lista igual nas 5 causas, incluindo tranca), `an/pistas_dump.txt` (as 278 pistas lidas uma a uma para a cronologia).
- Tela real (playwright, `individual.html`): `pw/varre.mjs` (5 partidas, uma por causa, 5 voltas, 15 salas, 4 abas da Máquina, mensagens, pausa, final: 1.560 telas em `pw/corpus.json`), analisado por `an/tela.py`, `an/vocab.py`, `an/linhas.py`, `an/salas.py`, `an/lista_tela.py` (novo).
- Código real: `pw/sem.mjs` (4.000 sementes), `pw/andar.mjs` (3.000), `pw/dist.mjs` (3.000), `pw/mg.mjs`, `pw/extras.mjs`, `pw/meu.mjs`, `pw/peca.mjs`, `pw/real_solo.mjs` (sem as ferramentas antigas e pegando a peça de novo pelo botão real), e novos: `pw/real_par.mjs` (dois aparelhos, partida inteira em dupla), `pw/trava.mjs`, `pw/tranca_causa.mjs`, `pw/extra2.mjs`, `pw/reserva.mjs`.
- Sala simulada: `pw/simrun.mjs` (novo: `sala/simulador/` com 3 participantes e Professor automático até o resultado; 511 linhas distintas de telão, Professor e participantes em `pw/simrun.json`).
- Simulador de texto: `validar.py 2000` com `LOOP_DATA` no repositório (`aud/validar.txt`).

## Tabela

| # | Item | Resultado | Evidência |
|---|---|---|---|
| 1 | Cronologia e testemunhas | **NÃO PASSA** (3 bloqueantes) | **Certo:** andares fixos (0 contradições em 3.000 sementes: Área de descanso no térreo, Galeria acima das Coleções, Ateliê e Base da limpeza no mesmo andar); Seu Dirceu só na Base da limpeza (4 pistas, 1 sala); pegadas somem na porta de serviço; fita da câmera só com o que a câmera vê (4 cenas); caixa de fusíveis num lugar só; alarme em 160 s no jogo e no telão; contas da hora sorteada coerentes em 4.000 sementes; horários 4:00, 4:02, 4:05, 4:10 batem em dados, checklist e roteiro. **Falhas:** (a) `catraca_solo` e `coop_catraca_ok` afirmam "Ele ainda está aqui dentro", mas a linha do tempo, as pegadas e a câmera dizem que ele saiu antes de 0:00 e só volta às 4:00 "do lado de fora"; (b) o telão, na página "A noite", escreve "Lenz entra no museu e não sai" e "O botão da Câmara é apertado" (a pista diz que ele vira a chave de ligar); (c) `ceu` (volta 1): "As nuvens giram sempre do mesmo jeito, volta após volta", antes de existir uma segunda volta (mesmo defeito que a música tinha). |
| 2 | Origem, volta e quem vê | **NÃO PASSA** (3 bloqueantes) | **Certo:** 278 pistas, ids únicos, todas nas 15 salas, voltas válidas, `quemPodeVer` "todos" nas 278, 0 referência quebrada, 82 pistas com `precisaDe` e 82 com `porque`, `destrava` em sincronia (0 sobra, 0 falta), 0 pré-requisito fora da causa, 0 pista inalcançável. **Falhas:** (a) a frase `porque` nunca aparece na lista da sala: o botão da pista travada fica desabilitado (`game.js:697`), o clique real é recusado e o toast fica vazio; vale para as 62 pistas de lista com tranca e para o aviso das duas metades (`excl`); só as 20 de atividade mostram a frase, na aba Atividades; (b) pista recebida por "Passar pista" perde a etiqueta (`loop-central.js:532`): o caderno mostra sem a marca de sinal e a pré-conferência responde "outras: 1 … não conta. Precisa de 2 sinais", enquanto a validação de verdade aceita (2 de 2); (c) `ivone_red` diz "Você fala da mancha" sem pedir nenhuma pista antes. |
| 3 | Palavras proibidas por volta e prévias | **NÃO PASSA** (2 bloqueantes) | **Certo:** "Lenz" em 0 pistas alcançáveis na volta 1 e 0 telas da volta 1; na volta 2 só na carta da seguradora, como está decidido em DECISOES L55; 0 prévias com hora ou "só quando"; 0 contagem regressiva nas 1.560 telas; 216 rótulos por sala, 0 em causa única, mesma quantidade nas 15 salas e nas 5 causas (dados e tela), mesmo custo, minuto e ícone nos pares; Revelar recusado na volta 3 e aceito na 5; minijogo das listas sem nome. **Falhas:** (a) a aba Atividades mostra, desde 0:00 da volta 1 e sem diagnóstico, o conserto da noite: "Três Números" (A), "O Raio" (B), "A Verdadeira" (C), "Fio a Fio" (D), os dois (E), com as salas e, da volta 2, a receita em "Falta:"; 5 de 5 causas entregues sem gastar energia; (b) a tranca muda com a causa em 7 rótulos: na Galeria, depois do cheiro de verniz (grátis), "A base, de perto" fica "1 ⚡" em A, B, C, E e continua "travada" em D (conferido na tela nas 5 causas); o mesmo em "A mão do Téo", "Ficha de ensaio de ontem", "Fita adesiva no painel", "Ordem de serviço no gerador", "E-mail impresso" e "Verso da ordem de serviço". |
| 4 | Fonte para cada fato essencial (1, 2 e 3 pessoas, 5 causas, simulador e código) | **PASSA** | **Simulador:** `validar.py` com 2.000 bots: APROVADO nas 5 causas; ótimo com 1, 2 e 3 pessoas = Ouro nas 5 causas, em 5 sementes de valores; bot aleatório 0,00% / 0,70% / 0,00% / 0,20% / 0,00%; 0 essencial sem 2 caminhos; 0 sala que fecha o diagnóstico sozinha. **Código real, 1 pessoa:** `collect()` de verdade, 5 de energia, sem ferramentas: Ouro nas 5 causas. **Código real, 2 pessoas:** dois aparelhos, mesma semente, cada um com o próprio diagnóstico, as entradas e as 3 provas, conserto em dupla com a palavra falada: aparelho do Subsolo = Ouro, o outro = Revelar, DESFECHO DA TURMA = Ouro, nas 5 causas. **3 pessoas:** o código não tem regra por tamanho de grupo (cada aparelho é independente); o terceiro segue o caminho sem dupla já conferido. Menores M5, M6, M7. |
| 5 | Códigos decoráveis | **PASSA** | 4.000 sementes: dia 9 a 25 (17 valores), hora em 5 valores, registro 105 a 994 (879 distintos), 6 ordens, 3 chaves, 5 causas entre 19% e 21%; 0 partidas com o trio padrão; 0 marcador `{…}` sobrando em 300 sementes × 278 pistas e em 1.560 telas. Cofre: 311 recusado, registro de trás para a frente aceito. Foto do catálogo mostra o registro sorteado (595 numa partida de registro 595). Opções dos minijogos em 3 posições quase iguais (958/1015/1027 em 3.000), luz nas posições 2 a 5, 0 opção certa trocada. Exemplos de formato (31, 0:45, 050, 0-0-0, 000) fora da faixa de qualquer resposta. Menor M12. |
| 6 | Contagem de palavras (até 60 por texto mostrado) | **NÃO PASSA** (1 bloqueante) | **Certo:** 278 pistas, maior texto que o código monta = 60 (`man_3`; na tela, 59); `teo_radio` 59; prévias até 7; `porque` até 25; papéis até 41; finais até 44; tour até 31; pausa até 36. **Falha:** a resposta do "Anexar" recusado é um bloco só de até 94 palavras (200 das mensagens do corpus passam de 60). Menor M13. |
| 7 | Documentação × dados × código | **NÃO PASSA** (4 bloqueantes) | **Certo:** cabeçalho dos dados em "v4 revisão 3"; 0 termos antigos em ROTEIRO-LOOP, LOOP-CENTRAL, FICHAS e nos 837 campos visíveis dos dados; custo 2 cobrado (5→3); objeto pego de novo sem gastar; E_volta_min_meio lido das regras; passar pista limitado a 3; `sala/conteudo.js` com as mesmas salas do `game.js`. **Falhas:** (a) `regras.precisaDe`, `regras.escada` e LOOP-CENTRAL dizem que a tela mostra a frase da tranca; o código não mostra (item 2a); (b) telão: "Nas voltas 3 e 4 é ensaio" e dicionário: "na volta 4 você treina" × dados e código (ensaio das voltas 2 a 4); (c) dicionário: "Dossiê: As pistas do grupo, juntas." × `regras.aparelho` (sem dossiê compartilhado), na mesma tela que diz "Cada pessoa tem o seu caderno"; (d) `sala/index.html` "Um estrondo. O tempo recomeça." × `individual.html` "Um raio. O tempo recomeça."; mais as frases do telão do item 1b. Menores M5, M8, M9. |
| 8 | Registro de revisão e checklist | **PASSA** | LOOP-CENTRAL tem "Revisão 3 — 25/11/2026" com por quê e o que mudou, e é o último arquivo alterado (09:28:06). Checklist recalculado: 232/26/7/9/4 = 278 e ativas 207/208/207/207/212, iguais aos dados; itens por sala (18, 12, 16, 7, 16, 12, 10, 19, 12, 9, 10, 12, 9, 5, 9) iguais à tela nas 5 causas; +7 da volta 3 e +9 da volta 4 conferidos por id; tabela de horários igual a `segundo_min`; "Pendências: nenhuma aberta" e "Ficou para decidir: nada". Menores M9, M16. |
| 9 | Vocabulário de projeto e gênero no texto visível | **PASSA** | 1.560 telas + 511 linhas da sala simulada + 837 campos visíveis dos dados: 0 identificador interno, 0 "solo", "coop", "semente", "rodada", 0 "carga" como recurso, 0 "jogador", "investigador", "aluno", 0 marca de gênero dirigida a quem joga ("sozinho/a", "pronta", "Obrigado" só em personagem, objeto ou mão). Saudação da sala é "Olá" quando a pessoa não escolhe forma. Menores M10, M13. |
| 10 | Tela real sem camada antiga | **NÃO PASSA** (4 bloqueantes) | **Certo:** mapa com as 15 salas nas 25 telas de mapa; 4.745 itens de lista, 0 fora da história (6.605 pistas antigas filtradas); 0 "protótipo", "pedestal", "lanterna", "21h/22h", "estrondo", "Faltou pista" nas 1.560 telas do jogo sem sala; preparação, descrição das 15 salas, tela final e dicas no mundo do Loop. **Falhas:** (a) manual da sala (`sala/index.html:42`), que abre para todo participante: "Um estrondo. O tempo recomeça."; (b) passo a passo, cenas 1, 2, 3, 4 e 6, com personagens do caso antigo (a cena 1 repete a fala da "funcionária que preparava uma surpresa", `game.js:242` e `:1210`); (c) a entrada (`index.html:66`) tem o botão "Episódio visual", que abre `reserva/`: "faça o relógio atravessar as 22h", relógio em 21:55, códigos fixos (472, 14, 314, 031) e o nome de quem pegou o crachá; (d) na sala simulada o telão ganha a página "Perguntas" com os 8 eixos antigos (O quê, Onde, Quando, Como, Por quê, Quem, Previsão, Intervenção) e cada participante vê "Respostas da turma às perguntas", porque o piloto preenche o formulário antigo escondido. |

## Antes | agora | motivo

| # | Rodada 2 | Rodada 3 | Motivo |
|---|---|---|---|
| 1 | não passa (8 falhas) | não passa (3) | As 8 foram corrigidas. A correção das pegadas (Lenz sai e só volta às 4:00) deixou para trás "Ele ainda está aqui dentro" e a frase do telão; `ceu` não tinha sido visto. |
| 2 | não passa | não passa (3) | Campos acertados. Sobrou o que só o clique de verdade mostra: a frase da tranca não chega à tela e a pista passada perde a etiqueta. |
| 3 | não passa (5 falhas) | não passa (2) | Prévias, contagem, minijogo e Revelar corrigidos. A aba Atividades e o estado da tranca não tinham sido conferidos por causa. |
| 4 | não passa | **passa** | Trio no validador, trava da noite E, peça pega de novo e regras por aparelho; a dupla foi jogada inteira no código real. |
| 5 | não passa | **passa** | Cofre sorteado, foto com o registro certo, opções embaralhadas, exemplos fora da faixa. |
| 6 | não passa | não passa (1) | `man_3` e `teo_radio` resolvidos. A mensagem do Anexar não tinha sido contada. |
| 7 | não passa (11 falhas) | não passa (4) | As 11 fechadas. Sobraram textos de tela fora dos três arquivos principais (telão, dicionário, manual da sala). |
| 8 | não passa | **passa** | Registro da revisão 3 posterior a todos os arquivos; checklist bate; nenhuma pendência aberta. |
| 9 | não passa | **passa** | Nomes internos e "(solo)" saíram da tela. |
| 10 | não passa (5 falhas) | não passa (4) | As 5 fechadas no jogo sem sala. O manual da sala, o resto do passo a passo, o Episódio visual e o telão do simulador não tinham sido varridos. |

## Correções bloqueantes (texto pronto)

### Código
**B1. `loop-central.js`, `lcPainelHtml`, aba `atividades` (linha 340).** Não listar conserto antes do diagnóstico.
Depois de `if (!lcAtiva(A)) continue;` acrescentar `if (A.conserto && !s.diag) continue;`
Antes do `for`, acrescentar: `if (!s.diag) h += '<section class="lc-ativ"><h4><i class="lc-luz" aria-hidden="true"></i>Conserto da máquina</h4><p class="lc-dica">A máquina ainda não sabe o que você quer dela.</p><p class="muted">Aparece quando o diagnóstico estiver anexado (aba Dossiê).</p></section>';`

**B2. `game.js:697`.** Pista travada tem que aceitar o toque para mostrar a frase.
Trocar `button.disabled = (registered && !repega) || wait > 0 || !!bl;` por `button.disabled = (registered && !repega) || wait > 0; button.setAttribute('aria-disabled', String(!!bl));`
(`collect()` já faz `toast(bl)` e sai sem cobrar.) Fazer junto com B3 e B11, senão a frase passa a mostrar salas diferentes por causa.

**B3. `loop-central.js`, `lcBloqueio` (linhas 153 e 154).** Só as salas das pistas que existem na noite.
Trocar as duas ocorrências de `pd.umaDe.map(i => lcNomeSala(LC_PID[i].sala))` por `pd.umaDe.filter(i => lcAtiva(LC_PID[i])).map(i => lcNomeSala(LC_PID[i].sala))`.

**B4. `loop-central.js:532`, `lcReceber`.** Pista passada guarda a etiqueta.
`state.clues.push({id:lcId(p.id), room:lcNomeSala(p.sala), name:lcTok(p.previa || p.id), text:lcTexto(p), tipo:'Relato', loop:state.loop, recebida:true, etq:p.etiqueta || ''}); save();`

**B5. `loop-central.js`, `lcValidaAnexo` e `lcAnexar`.** Resposta do Anexar em até 60 palavras (pior caso com as frases abaixo: 55).
Linhas por pista: `': leitura completa. Vale sozinha.'` · `': tem explicação inocente. Não conta.'` · `': sinal repetido.'` · `': contou, sinal.'` · `': contou, leitura normal.'` · `': sinal de outro defeito.'` · `': leitura que não ajuda aqui.'` · `': não é sinal nem leitura.'`
Placar: `ns + ' de 2 sinais e ' + nd + ' de 1 leitura normal.'` · falta sinal: `placar + ' Faltam sinais.'` · falta leitura: `placar + ' Falta 1 leitura normal.'`
Recusa (linha 202): `'O dossiê não aceita: ' + v.msg + ' ' + v.linhas.join(' ') + ' Tentativa da volta gasta.'`

**B6. `ritmo.js`, `LOOP_LINHA`.**
`entrada`: `'Lenz entra pela porta de serviço com o crachá do Braga'` · `passagem`: `'Alguém de paletó volta e desce para o Subsolo'` · `botao`: `'A chave de ligar da Câmara é virada'`

**B7. `sala/telao/telao.mjs`, `pgMaquina`.** `'Nas voltas 2 a 4 é ensaio. Na volta 5 vale.'`
**`loop-central.js:75`, `LC_GLOS_LISTA`.** `['Ensaio','Treino do conserto: das voltas 2 a 4 você treina, na 5 vale.']` · `['Dossiê','A página da Máquina onde você prova o defeito com 3 pistas do seu caderno.']`

**B8. `sala/index.html:42`.** `<h2>Um raio. O tempo recomeça.</h2>`

**B9. `game.js:1210` em diante, `TOUR`, campo `c` das cenas 1, 2, 3, 4 e 6.**
1: `'Você chega ao museu no fim da tarde, véspera de festa. Chove forte. Na mesa da Recepção, um cartão do Téo: "Começa pela peça."'`
2: `'Na Galeria, a peça principal brilha na base. Aurélio, o curador, não sai da frente dela: "Está linda, não está?"'`
3: `'No Subsolo, o relógio digital da máquina conta o minuto da volta, de 0:00 a 5:00. Lá fora, a tempestade aperta.'`
4: `'Na Central, o Braga anota a ronda e oferece café. No museu tem coisa escrita, coisa vista e coisa contada. Nem tudo que contam é fato.'`
6: `'Na última volta, o telão da Recepção espera. Para fechar a noite, você precisa de provas, não de palpite.'`

**B10. `index.html:66`.** Tirar `<a class="btn secondary" href="reserva/">…Episódio visual</a>` da entrada do Loop.

**B11. Sala simulada sem as 8 perguntas antigas.**
`sala/piloto.mjs`, ramo `e === 'final'`: apagar o `for (const sel of d.querySelectorAll('#answerFields select')) {…}` e deixar só `d.getElementById('answerForm').requestSubmit();`
`sala/telao/telao.mjs:60-61`: `return [['desfecho', 'Desfecho'], ['noite', 'A noite'], ['turma', 'Turma']];`
`sala/sala-mestre.mjs:123`, `blocoTurma`: primeira linha `return '';`

### Dados (`dados/pistas-v4.json`, depois regenerar `loop-central-dados.js`)
**B12. `catraca_solo` e `coop_catraca_ok`.**
`catraca_solo.texto`: "Com o livro de visitas no caderno, você confere nome por nome: o entregador e a fotógrafa saíram pela roleta. O do patrocínio, não. Se saiu, foi por outra porta."
`catraca_solo.porque`: "Uma lista só não diz quem passou por onde. Faltam a roleta da saída e o livro de visitas."
`coop_catraca_ok.texto`: "Comparando as duas listas: o entregador e a fotógrafa passaram pela roleta da saída. O do patrocínio, não. Se saiu, foi por outra porta. E alguém abriu a porta de serviço com o crachá do Braga."

**B13. `ceu.texto`.** "O céu sobre o pátio está carregado. As nuvens giram devagar em volta do para-raios."

**B14. `ivone_red`.** `precisaDe.umaDe`: `["mancha","teo_1","ivone_1"]`; `porque`: "Ivone trabalha de costas, debruçada na bancada. Você ainda não tem o que perguntar."; acrescentar `ivone_red` em `revela.destrava` das três.

**B15. Tranca igual nas 5 causas (campo `precisaDe.umaDe` dos pares; os rótulos e as salas ficam os mesmos em toda noite).**
- `fh_base_perto`: `["fh_dobrada","dirceu_0","c_anc_3","teo_radio_2x","teo_radio_2c"]`
- `fh_papel_teo`: `["fus_ok_1","fh_varal","fh_vidro","b_carga_3","fh_zumbido_a"]`
- `fh_ficha_bc` e `fh_fita_bc`: `["b_verde_1","b_verde_4","fh_cam_most_bc","fh_bipes_bc"]`
- `fh_os_cd` e `fh_email_cd`: `["b_carga_1","b_carga_2","b_carga_3","b_carga_4","b_luz_1","b_luz_2","b_luz_3","b_luz_4","fh_pont_d","fh_cam_agulha_d","d_fus_4","fh_consumo","fh_lamp_of","fh_luz_desc","fh_lamp_limp","fh_lamp_lab"]`
- `fh_os_a` e `fh_email_a`: `["a_cheia_1","a_cheia_3","fh_zumbido_a","fh_consumo","fh_lamp_of","fh_luz_desc","fh_lamp_limp","fh_lamp_lab"]`
- `fh_verso_b`: `["fh_ficha_bc","fh_fita_bc"]` · `fh_verso_cd`: `["fh_ficha_bc","fh_fita_bc","fh_ficha_d","fh_fita_d"]` · `fh_verso_a`: `["a_hist_1","a_hist_2"]`
- Regenerar `destrava` e rodar `aud/an/pares.py` até "diferenças por campo: {}".

## Menores (não bloqueiam; campo interno, comentário, bloco escondido ou documento)
- **M1.** 7 pistas de tipo `falsa_honesta` sem pista em `explica` (`dis_lampadas`, `dis_balde`, `dis_pulso`, `dis_radio`, `dis_bilhete`, `dis_cola`, `d_despiste`): a explicação está no próprio texto.
- **M2.** `grupos_fonte.prova_falsa.fontes` lista `c_peca`, que tem `grupoFonte` `peca_verdadeira` (declarado em `gruposExtras`).
- **M3.** Etiqueta "MANUAL" em 6 grupos diferentes (não conta no diagnóstico).
- **M4.** `explica` em sala diferente da falsa: `cracha_1` (Central) × `cracha_2` (Base da limpeza).
- **M5.** Simulador de texto e validador usam o dossiê do grupo (`uniao(s)`, `s['diag']` único) para diagnóstico e entradas; o código é por aparelho. O simulador ainda tem pré-conferência que não gasta a tentativa (o jogo gasta), limite de 2 atividades em dupla e um ramo morto de `bloqueada_segundos`. O "ótimo em dupla e em trio" do validador não é o caminho do código; o caminho real está em `aud/pw/real_par.mjs`.
- **M6.** Em dupla, quem não está no Subsolo termina com "A máquina continua ativa" no cartão individual, mesmo com o conserto feito (o cartão DESFECHO DA TURMA mostra Ouro). É a regra escrita em `regras.aparelho`.
- **M7.** Noite E em dupla: o segundo conserto na mesma volta é gravado como "meio" e a mensagem repete "falta o OUTRO defeito". Sem dupla a mensagem diz "em OUTRA volta" e a regra permite na mesma volta.
- **M8.** Blocos dos dados que o código não lê: `papeis_volta5` (com `dica_de_tela` "toque em Revelar"), `compensacao_solo` ("dica do Mestre", eco "sem pedir ao Mestre"), `suspeitos`.
- **M9.** Documentos: README linha 37 (ferramentas, lanterna, caixote), sob o aviso de camada antiga; LOOP-CENTRAL L69 e DECISOES L33 dizem "Missões secretas: 5" e o jogo tem 8 (DECISOES L138 já diz 8); checklist da volta 2 diz "não pode vazar: o nome" e DECISOES L55 e ROTEIRO L333 fixam que "Lenz" aparece na carta da seguradora na volta 2 (escrever "o nome como dono da mão no crachá"); `linha_do_tempo_s[250]` diz "liga a Câmara" e `traj_3` diz que a chave "já está virada".
- **M10.** Identificadores internos com palavra antiga (tombo 22, catraca 15, manopla 5, calibr 133, âncora 140; "solo" 17 em `regras` e `trancas`; id `Guardiao`), permitidos pela seção Vocabulário.
- **M11.** O formulário das 8 perguntas antigas continua no DOM da tela final, escondido (13 campos, "21h57"); é o que o piloto preenche (B11).
- **M12.** `reserva/minigames.mjs:18` usa '472' fora do Loop; `reserva/banco.mjs` tem códigos fixos. Só aparecem pelo Episódio visual (B10).
- **M13.** Na aba Atividades sai "Sem dupla: Sem dupla: …" nas 10 atividades (o campo `saida_solo` já começa com "Sem dupla:"). Um cartão de atividade aberto soma até 153 palavras (cada campo, até 41).
- **M14.** Pausa depois da volta 2: "o homem de paletó perto das 4:00" conta um horário que a pessoa pode não ter visto (não está na lista do que não pode vazar).
- **M15.** Noites A, C e E: `a_rel_1` ("cada relógio marca um segundo diferente") e `hora_1` ("todos param no mesmo ponto").
- **M16.** Depois das correções: abrir "Revisão 4" em LOOP-CENTRAL e pôr no checklist da volta 1 duas linhas novas: aba Atividades sem conserto antes do diagnóstico; tranca igual nas 5 causas.

## Fim do ciclo
A conferência técnica **não passou**. Faltam as 15 correções bloqueantes acima (11 de código, 4 de dados; nenhuma muda regra nem enredo: B12 só acerta o texto com a linha do tempo já decidida). Como B9, B12, B13 e B14 mexem em texto, depois delas a ordem das escalas manda voltar à etapa 1.
