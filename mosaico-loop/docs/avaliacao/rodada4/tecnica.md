# Loop v4 revisão 4 — Conferência técnica (seção 4 das escalas), do zero

**Resultado: NÃO PASSA.** Dos 10 itens, 6 passam (1, 4, 5, 7, 8, 10) e 4 têm falha bloqueante (2, 3, 6, 9). São 6 correções bloqueantes, todas pequenas: 3 de código, 2 de dados e 1 que mexe numa decisão da revisão 4 e pede o aval do responsável (B2). A seção 4 só aceita "passa limpo".

**Critério usado para classificar.** Bloqueante: a tela afirma algo falso, entrega uma revelação sem preço ou passa do limite, no caminho comum de quem joga. Menor: campo interno, documento, bloco escondido, ou frase que só fica errada num caminho raro ou que depende de leitura.

**Estado auditado (25/11/2026, 11:10 a 11:35).** Nenhum arquivo mudou durante a auditoria (169 arquivos, md5 do começo e do fim iguais: `aud2/snap_ini.txt` e `aud2/snap_fim.txt`).
`dados/pistas-v4.json` 10:56:17 (278 pistas, "v4 revisão 4") · `loop-central.js` 10:59:39 · `game.js` 10:47:23 · `docs/LOOP-CENTRAL.md` 11:03:14.
`loop-central-dados.js` é idêntico ao JSON. `/tmp/roda/sim/engine.py` e `validar.py` são idênticos a `dados/simulador-texto.py` e `dados/validar.py`.

**Como foi conferido (tudo em `/tmp/roda/esc/r4/aud2/`, nada escrito no repositório).**
- Dados: `an/dados.py`, `an/palavras.py`, `an/pares.py`, `an/docs.py`, `an/trio.py`; as 278 pistas lidas uma a uma em `an/pistas_dump.txt`.
- Tela real (`individual.html`, playwright): `pw/varre.mjs` (5 partidas, uma por causa, 5 voltas, 15 salas, 4 abas da Máquina com e sem diagnóstico, mensagens, pausa, final: 1.560 telas em `pw/corpus.json`), lido por `an/tela.py`, `an/vocab.py`, `an/linhas.py`, `an/lista_tela.py`, `an/conta_tela.py` (novo).
- Código real: `pw/sem.mjs` (4.000 sementes), `pw/andar.mjs` (3.000), `pw/dist.mjs` (3.000), `pw/real_solo.mjs`, `pw/real_par.mjs`, `pw/mg.mjs`, `pw/extras.mjs`, `pw/meu.mjs`, `pw/extra2.mjs`, `pw/tranca_causa.mjs`, `pw/reserva.mjs`, `pw/tel.mjs`.
- Scripts novos em `pw2/`: `trava3.mjs` (toque de verdade, por coordenada, em 9 pistas travadas nas 5 causas), `barra.mjs` (itens da lista × barra de baixo), `msgmax.mjs` (pior caso das mensagens que o código monta), `cartoes.mjs` (palavras por cartão), `mgpeca.mjs` (minijogo da caixa por clique), `glos.mjs` (dicionário dentro do caderno), `paginas.mjs` (DOM escondido, formulário final, aba Revelar), `painel.mjs` (Painel e Manual sem dupla nas 5 causas).
- Scripts antigos corrigidos: `pw/trava.mjs` dava "clique recusado" porque o Playwright não clica em botão com `aria-disabled`; o toque de verdade funciona (ver `pw2/trava3.mjs`). `pw/peca.mjs` ainda abria a caixa na volta 1; o caminho atual está em `pw2/mgpeca.mjs`. `pw/mg.mjs` ainda testa `c_esc_1`, que não tem mais minijogo.
- Sala simulada: `pw/simrun.mjs` (`sala/simulador/`, 3 participantes, Professor automático, até o resultado: 436 linhas distintas de telão, Professor e participantes em `pw/simrun.json`).
- Simulador de texto: `validar.py 2000` com `LOOP_DATA` no repositório (`aud2/validar.txt`, semente 16059).

## Tabela

| # | Item | Resultado | Evidência |
|---|---|---|---|
| 1 | Cronologia e testemunhas | **PASSA** | Andares fixos: 0 contradição em 3.000 sementes (Área de descanso no térreo, Galeria acima das Coleções, Ateliê e Base da limpeza no andar da Área de descanso). 17 pistas com horário: todas batem com `linha_do_tempo_s`, com a tabela do checklist e com o roteiro (1:10, 1:11, 1:13, 1:15, 1:20, 4:00, 4:02, 4:05, 4:10); as de 60 a 100 s andam com a hora sorteada, as de 4:00 em diante não. Alarme em 160 s no jogo e no telão. "Ele ainda está aqui dentro": 0 ocorrência; as duas listas dizem "Se saiu, foi por outra porta". Pegadas somem na porta de serviço; marca de sola "de quem saiu por ela"; câmera mostra o paletó "chegando do lado de fora" às 4:00. Telão: "Alguém do patrocínio entra pela porta de serviço com o crachá do Braga", "Alguém de paletó volta e vai para o Subsolo", "Ele vira a chave da Câmara". `ceu` sem "volta após volta". Seu Dirceu só na Base da limpeza (4 falas, 1 sala); Braga só na Central; Ivone só no Ateliê; Aurélio só na Galeria; Dra. Sato só por interfone; Téo só em papel e gravação. Menores M1 a M5. |
| 2 | Origem, volta e quem vê | **NÃO PASSA** (1 bloqueante) | **Certo:** 278 pistas, ids únicos, 15 salas, voltas válidas, `quemPodeVer` "todos" nas 278, 0 referência quebrada, 85 com `precisaDe`, `destrava` em sincronia (0 sobra, 0 falta), 0 pré-requisito fora da causa, 0 pista inalcançável. O toque na pista travada mostra a frase e a sala: 9 pistas × 5 causas: 40 de 45 toques com a frase na tela, 0 de energia gasta, 0 diferença entre causas, 23 a 32 palavras (os outros 5 toques, na "Ordem de serviço no gerador", caíram na barra de baixo por causa da rolagem do teste; a frase dela foi conferida direto na função da tranca). Nenhum item da lista fica preso embaixo da barra (15 salas, 2 tamanhos de tela). Pista recebida na pausa guarda a etiqueta e a pré-conferência conta certo ("sinais: 2 (2 tipos) · leitura normal: 1"). `ivone_red` agora pede mancha, Téo ou bancada. **Falha:** a frase da tranca de "O quadro, olhando de novo" (`fh_quadro2` e `d_fus_2b`) diz "Você já olhou o quadro." para quem ainda não olhou: a pista que falta é justamente a primeira olhada (visto na sala simulada, volta 1: "Você já olhou o quadro. … (em Pátio · Quadro externo)"). Menores M6, M7. |
| 3 | Palavras proibidas por volta e prévias | **NÃO PASSA** (2 bloqueantes) | **Certo:** "Lenz" em 0 das 630 telas das voltas 0 a 2 e em 0 linha da sala simulada antes da volta 3; nasce em `cracha_3`, `lenz_2`, `v4_braga`, `coop_veredito` (volta 3). 216 rótulos de sala, 0 em causa única, mesma quantidade nas 15 salas e nas 5 causas (dados e tela), 0 diferença de custo, minuto, ícone e tranca (`pares.py`: diferenças por campo = nenhuma; na tela, 0 sala e 0 botão diferente). 0 contagem regressiva em 1.560 telas ("ainda não"). Aba Atividades sem conserto antes do diagnóstico, igual nas 5 causas na volta 1. Caixa de "banners" fora da volta 1. Entrada, ajuda, preparação e mapa iguais nas 5 causas. **Falhas:** (a) a aba Revelar escreve o texto do final "se a noite acabasse agora": na volta 1, às 0:00, com o caderno vazio, "O raio cai, a luz volta, o homem de paletó desce a escada"; da volta 2, para quem só anexou o diagnóstico (0 prova, sem o cheiro de verniz), "Na Galeria, a cópia continua na base, cheirando a verniz"; (b) Painel e Manual, da volta 2: quem está no Subsolo com 1 página do manual (grátis), sem dupla, sem diagnóstico e com 5 de 5 de energia, vê o painel da noite na aba Atividades, e os 5 painéis são diferentes (A "lá em cima, parado / piscando / verde", B "lá embaixo / paradas / verde", C "descendo aos poucos / paradas / amarela", D "balançando no meio / piscando / verde", E "lá embaixo / piscando / verde"): com a página 1 do manual, 5 de 5 defeitos entregues sem gastar energia. |
| 4 | Fonte para cada fato essencial (1, 2 e 3 pessoas, 5 causas, simulador e código) | **PASSA** | **Simulador:** `validar.py` com 2.000 bots: ótimo com 1, 2 e 3 pessoas = Ouro na volta 5 nas 5 causas; `trio.py` repete com 4 e 5; bot aleatório 0,00% a 0,05% de Ouro ou Desligar; 0 essencial sem 2 caminhos; 0 sala que fecha o diagnóstico sozinha. **Código real, 1 pessoa:** `collect()` de verdade, 5 de energia por volta, caminho sem dupla: Ouro nas 5 causas (E: eco na volta 3, meio conserto na 3, ensaio na 4, vale na 5). **Código real, 2 pessoas:** dois aparelhos, mesma semente: um Ouro, outro Revelar, DESFECHO DA TURMA = Ouro, nas 5 causas. **3 pessoas:** o código não tem regra por tamanho de grupo; a terceira segue o caminho sem dupla já conferido. Menores M8, M9. |
| 5 | Códigos decoráveis | **PASSA** | 4.000 sementes: dia 9 a 25 (17 valores, 216 a 260 cada), hora em 5 valores (768 a 829), registro 105 a 994 (879 distintos), 6 ordens, 3 chaves, 5 causas entre 19,3% e 20,4%; 0 partida com o trio padrão; 0 marcador `{…}` sobrando em 1.560 telas. Cofre: 123 e 311 recusados, registro de trás para a frente aceito. Opções dos minijogos nas 3 posições (973 a 1.046 em 3.000), luz nas posições 2 a 5. Exemplos de formato (31, 0:45, 050, 0-0-0, 000) fora da faixa de qualquer resposta. Palavra da dupla, código da chave e código de passar pista mudam com a semente. |
| 6 | Contagem de palavras (até 60 por bloco de texto mostrado) | **NÃO PASSA** (1 bloqueante) | **Certo:** maior texto de pista que o código monta = 60 (`man_3` com o sinal da base; na tela, 59), `teo_radio` 57; rótulos até 7; frase de tranca até 32; Anexar recusado até 57 (teto com as 3 linhas mais longas), aceito 50; fim de atividade até 60 (Raio com a Dra. Sato, ensaio); pausa até 31; finais até 44; ajuda até 32. **Falha:** o parágrafo "Como funciona", na aba Dossiê, tem 64 palavras num bloco só (eram 57 na revisão 3; entrou "A leitura completa do painel vale sozinha."). Menor M13 (cartões inteiros). |
| 7 | Documentação × dados × código | **PASSA** | Cabeçalho dos dados e do `loop-central-dados.js` em "v4 revisão 4". 0 termo antigo em ROTEIRO-LOOP, LOOP-CENTRAL, FICHAS, README, CATALOGO e nos campos visíveis dos dados. Telão e dicionário: "Das voltas 2 a 4 é ensaio. Na volta 5 vale." Dossiê: "A página da Máquina onde você prova o defeito com 3 pistas do seu caderno." Manual da sala e do jogo sem turma com o mesmo título ("Cinco minutos. Depois, tudo de novo."). Regras `precisaDe` e `escada` agora batem com a tela. Custo 2 cobrado (5→3). `E_volta_min_meio` lido das regras. Dois consertos na mesma volta viram meio cada um, na tela, nos dados e no checklist. Passar pista limitado a 3. Menores M5, M10, M11, M12, M14. |
| 8 | Registro de revisão e checklist | **PASSA** | LOOP-CENTRAL tem "Revisão 4 — 25/11/2026" com por quê e o que mudou (código, dados, simulador) e é o último arquivo alterado (11:03:14). Checklist: 231/27/7/9/4 = 278 e ativas 207/208/207/207/212, iguais aos dados; itens por sala (18, 12, 16, 7, 16, 12, 10, 19, 12, 9, 10, 12, 9, 5, 9) iguais à tela nas 5 causas; +27, +7, +9 e +4 conferidos por id; os 17 horários da tabela iguais a `segundo_min`; "Pendências: nenhuma aberta"; DECISOES "Ficou para decidir: Nada". Menor M10. |
| 9 | Vocabulário de projeto e gênero no texto visível | **NÃO PASSA** (2 bloqueantes) | **Certo:** 1.560 telas + 436 linhas da sala + campos visíveis dos dados: 0 identificador interno, 0 "solo", "coop", "semente", "rodada", "jogador", "investigador", "aluno", 0 "carga" como recurso. "Sozinha" e "Obrigado" só em fala de personagem. **Falhas:** (a) três papéis de atividade tratam a dupla no masculino: "os dois dizem o que não bate" (Lado a Lado) e "Depois os dois respondem à mesma pergunta" (As Duas Listas, nas duas salas); (b) no caderno, o "?" ao lado de "etiqueta" e de "ensaio" abre a explicação da regra do jogo em palavra da história: num caderno da noite C, 10 vezes "etiqueta" ("A etiqueta do disjuntor caído diz: Café" → "O tipo da pista. Duas pistas com a mesma etiqueta valem um sinal só.") e 5 vezes "ensaio" ("A ficha do último ensaio" → "Treino do conserto: das voltas 2 a 4 você treina, na 5 vale."). Nos dados, 13 e 13 textos. Menor M15. |
| 10 | Tela real sem camada antiga | **PASSA** | Mapa com as 15 salas nas 25 telas de mapa; 4.740 itens de lista, 0 fora da história (6.625 pistas antigas filtradas); 0 "protótipo", "pedestal", "lanterna", "estrondo", "21h/22h", "caixote", "funcionária", "Faltou pista" em 1.560 telas e em 436 linhas da sala. Passo a passo com as 6 cenas no mundo do Loop. Entrada sem "Episódio visual" (0 link para `reserva/` em toda a pasta). Tela final sem formulário (0 campo no DOM; "Ver meu desfecho"). Telão: Desfecho, A noite, Para conversar, Turma; 0 página das 8 perguntas; participante só "Registrar meu desfecho". 0 texto antigo escondido no DOM do começo e do fim. 0 erro de página. Menor M16. |

## Antes | agora | motivo

| # | Rodada 3 | Rodada 4 | Motivo |
|---|---|---|---|
| 1 | não passa (3) | **passa** | As 3 fechadas (listas, telão, céu). Sobraram só frases de caminho raro e pontos de documento. |
| 2 | não passa (3) | não passa (1) | As 3 fechadas. A falha nova nasceu na revisão 4: o par "O quadro, olhando de novo" ganhou uma frase de tranca que supõe a primeira olhada. |
| 3 | não passa (2) | não passa (2) | As 2 fechadas (conserto na aba Atividades, tranca por causa). Uma nova nasceu na revisão 4 (o painel na tela de quem está no Subsolo). A outra já existia e não tinha sido conferida (texto do final na aba Revelar). |
| 4 | passa | passa | Sem mudança; noite E sem dupla refeita com "um conserto por volta". |
| 5 | passa | passa | Sem mudança. |
| 6 | não passa (1) | não passa (1) | Anexar resolvido (teto 57). A frase nova sobre a leitura completa levou "Como funciona" de 57 para 64. |
| 7 | não passa (4) | **passa** | As 4 fechadas. Sobraram só documentos e campos internos. |
| 8 | passa | passa | Registro da revisão 4 depois de todos os arquivos; checklist bate. |
| 9 | passa | não passa (2) | "os dois" entrou nos papéis reescritos na revisão 4. O "?" do dicionário no caderno já existia e não tinha sido conferido. A nota não caiu por correção técnica errada: são textos novos e uma conferência nova. |
| 10 | não passa (4) | **passa** | As 4 fechadas (manual da sala, passo a passo, Episódio visual, 8 perguntas). |

## Correções bloqueantes (texto pronto)

### Código

**B1. `loop-central.js:363`, aba Revelar (item 3a).** Mostrar só o nome do final, sem o texto.
Trocar o fim da linha, de `'</b>. ' + esc(lcFinalTxt(lcFinal())) + '</p><p class="lc-msg" id="lcMsg" role="status"></p>'` para `'</b>.</p><p class="lc-msg" id="lcMsg" role="status"></p>'`.
Fica: "Final se a noite acabasse agora: **Faltou pouco**."

**B2. `loop-central.js`, `lcAtivHtml` (linhas 398 e 399) e `lcAgir` (linhas 461 a 467), Painel e Manual (item 3b). Pede aval: mexe na decisão "dupla com informação de verdade na tela" da revisão 4.** O painel só aparece depois de pagar a energia da atividade; o "Fazer em dupla" não cobra de novo na mesma volta.
- Linha 399, trocar `if (tp) {` por `const pago = !(A.entrega_diagnostico && papel === 'A') || s.painelVisto === state.loop; if (tp && !pago) h += '<button type="button" class="lc-btn" data-lcagir="verpainel:' + A.id + '">Olhar o painel (1 de energia)</button>'; if (tp && pago) {`
- Em `lcAgir`, antes de `if (tipo === 'dupla') {`: `if (tipo === 'verpainel') { if (!lcGastar(A.custo_por_pessoa || 1)) return; s.painelVisto = state.loop; save(); return lcMsg('O painel acende na sua frente. Descreva em voz alta o que você vê.'); }`
- Linha 467, trocar `if (!lcGastar(A.custo_por_pessoa || 1)) return;` por `const jaPagou = A.entrega_diagnostico && papel0 === 'A' && s.painelVisto === state.loop; if (!jaPagou && !lcGastar(A.custo_por_pessoa || 1)) return;`
- `dados`, `coop_painel_manual.papelA`: "No Subsolo, você olha o painel (1 de energia): a sua tela mostra os 3 símbolos e como cada um está. Você descreve em voz alta. Você não sabe o que eles querem dizer."
Depois, conferir com `pw2/painel.mjs`: a saída tem que ser "(sem painel)" nas 5 causas.

**B3. `loop-central.js:334`, parágrafo "Como funciona" (item 6).** 58 palavras:
`<p>Um <b>sinal</b> mostra o que está errado na máquina. Dois sinais com a mesma etiqueta valem um só. Uma <b>leitura normal</b> mostra uma parte que está bem: ela afasta outro defeito. Manual, ferramenta e coisa estranha com explicação inocente não contam. A leitura completa do painel vale sozinha. Para outra pessoa usar uma pista sua, passe na pausa.</p>`
(Sai "Cada pessoa tem o seu caderno.", que a frase seguinte já diz.)

**B4. `loop-central.js:72`, `:73`, `:74`, `:76` e `game.js:868`, dicionário no caderno (item 9b).** No caderno, "etiqueta" e "ensaio" são palavras da história: sem "?".
- Linhas 72 e 73: `['etiquetas?', 'O tipo da pista. Duas pistas com a mesma etiqueta valem um sinal só.', 1],` e `['ensaio', 'Treino do conserto: das voltas 2 a 4 você treina, na 5 vale.', 1]`
- Linha 74: `].map(([re, txt, jogo]) => ({re: new RegExp('(?<![\\p{L}])(' + re + ')(?![\\p{L}])', 'iu'), txt, jogo: !!jogo}));`
- Linha 76: `function lcGlos(html, soMundo){` e, dentro do `for`, trocar `if (usados.has(g.txt)) continue;` por `if (usados.has(g.txt) || (soMundo && g.jogo)) continue;`
- `game.js:868`: trocar `lcGlos(esc(c.text))` por `lcGlos(esc(c.text), true)`
Depois, conferir com `pw2/glos.mjs`: "O que é etiqueta?" e "O que é ensaio?" têm que sumir da contagem do caderno.

### Dados (`dados/pistas-v4.json`, depois regenerar `loop-central-dados.js`)

**B5. `fh_quadro2.porque` e `d_fus_2b.porque` (item 2).** O mesmo texto nas duas, para a tranca continuar igual nas 5 causas:
"O vidro, a chuva, as chaves lá dentro. Sem saber o que procurar, você não vê nada de novo."

**B6. Três papéis sem "os dois" (item 9a).**
- `coop_original_copia.papelB`: "Na Sala da fotografia, a sua tela lista 3 coisas da foto do catálogo. Você lê em voz alta e a dupla diz o que não bate."
- `coop_entrou_nao_saiu.papelA`: "Na Recepção, você lê o livro de visitas em voz alta: quem entrou. Depois cada pessoa responde à mesma pergunta."
- `coop_entrou_nao_saiu.papelB`: "Na Central de monitoramento, você lê o registro da roleta da saída: quem saiu. Depois cada pessoa responde à mesma pergunta."

## Menores (não bloqueiam)

**Cronologia (item 1)**
- **M1.** `mancha_2` (volta 2): "A marca que o seu sapato deixou aqui da outra vez sumiu." Fica errada só para quem vê a mancha pela primeira vez na mesma volta. `dis_musica` tem o mesmo desenho ("Você já sabe a hora em que o violino entra"). Texto possível para a mancha: "Você mede a mancha com o pé: a tinta escorre até a mesma tábua e para. Ainda molhada, como se tivesse acabado de cair. O museu não guardou nada."
- **M2.** `lenz_mot_3` (volta 3): "Você ainda não conhece essa voz." Quem ouviu o homem de paletó às 4:02 (grátis, desde a volta 1) já ouviu essa voz. Texto possível para o fim: "A voz tem pressa e engole o fim das frases."
- **M3.** `lenz_op_2`: a câmera antiga fica na Sala da fotografia, no 1º andar, e "pegou de costas alguém de paletó, com um crachá pendurado na cintura". Nenhum documento põe o Lenz no 1º andar com o crachá (porta de serviço, Coleções e Subsolo são térreo e subsolo). Texto possível: "A câmera antiga, virada para a janela, disparou sozinha e pegou lá embaixo, perto da porta de serviço, alguém de paletó, de costas, com um crachá pendurado na cintura."
- **M4.** Noites A, C e E: `a_rel_1` ("cada um marca um segundo diferente") e `a_rel_2` ("anda, para e anda de novo") convivem com `hora_1` e `hora_2`, que dão a hora exata do apagão nos mesmos relógios.
- **M5.** ROTEIRO-LOOP, parte 2: a tabela "A noite antes do crime" só tem a entrada pela porta de serviço. Os dados também têm a entrada de hoje pela frente (`lenz_op_1`: "três entradas depois do expediente. A última foi a do patrocínio"; `cracha_4`: assinatura no livro). Falta a linha: entrou pela roleta, saiu pela porta de serviço, voltou por ela no começo da noite.

**Tranca (item 2)**
- **M6.** `catraca_solo.porque` diz "Faltam a roleta da saída e o livro de visitas" mesmo quando falta só um; `cracha_3.porque` diz "Sem papel na mão" quando a pessoa já tem a escala e o bilhete e só falta a prova da cópia. `nico_1` chama "Nico, de novo" e diz "Pela primeira vez ele não pede desculpa" sem pedir a primeira conversa (`nico_0`).
- **M7.** `eco_chave` tem `porque` e não tem `precisaDe`: a frase nunca aparece.

**Fontes (item 4)**
- **M8.** O simulador de texto continua diferente do jogo no dossiê do grupo, na pré-conferência que não gasta a tentativa e no limite de 2 atividades em dupla (registrado em DECISOES, "Revisão 4").
- **M9.** Em dupla, o aparelho que não está no Subsolo termina em "A verdade apareceu"; o Ouro aparece só no DESFECHO DA TURMA. É a regra escrita em `regras.aparelho`.

**Documentos e campos internos (itens 7 e 8)**
- **M10.** `dados/validar.py` (e a cópia em `/tmp/roda/sim/`) ainda se apresenta como "VALIDADOR LOOP v4 revisão 3".
- **M11.** CATALOGO-ENIGMAS: o cofre "não conta como prova do trajeto"; nos dados e em DECISOES (revisão 4) conta. FICHAS: segredo do Lenz "a troca, o empurrão, o botão" (é a chave de ligar).
- **M12.** `regras.aparelho`: "Para abrir uma atividade, o aparelho precisa do diagnóstico anexado"; no código só os consertos pedem. `e_meio_A` e `e_meio_B` têm `volta_min` 2 e a regra é 3 (`E_volta_min_meio`).
- **M14.** Na tela: "1 de energia de cada pessoa" e "Fazer em dupla (1 de energia)" também para quem está fora do Subsolo nos consertos, que o código não cobra; "(3 de energia, 2 minutos)" sem os 2 minutos no código; o aviso do ensaio do Raio diz "combine com a dupla" também no caminho sem dupla. No telão, o fato "entra pela porta de serviço" é creditado a quem achou a roleta de entrada ou o livro de visitas, e "volta e vai para o Subsolo" não conta a escada do Subsolo (`traj_3`) e conta a marca de sola de quem saiu (`traj_4`): `LC_FATO_PISTA`, `loop-central.js:678`.
- Seguem da rodada 3, sem mudança: 7 pistas `falsa_honesta` sem `explica`; `prova_falsa` lista `c_peca` por `gruposExtras`; etiqueta "MANUAL" em 6 grupos; `cracha_1` e `cracha_2` em salas diferentes; identificadores internos com palavra antiga.

**Palavras (item 6)**
- **M13.** Um cartão de atividade aberto soma de 95 a 194 palavras (A Verdadeira 194, Fio a Fio 163, Três Números 159, O Raio 153, Painel e Manual 148, Lado a Lado 126); cada campo tem até 43. O "Dicionário das palavras" aberto soma 209, em 15 linhas. Se o limite de 60 valer por cartão e não por texto, o item 6 tem mais 9 falhas.

**Vocabulário (item 9)**
- **M15.** "Ensaio · 30 segundos por volta" (ritmo da partida) usa a palavra "ensaio", que no jogo é o treino do conserto.

**Camada antiga (item 10)**
- **M16.** `reserva/index.html` continua no ar para quem digitar o endereço ("faça o relógio atravessar as 22h", relógio em 21:55, códigos fixos). Nenhuma tela leva até lá.

## Fim do ciclo

A conferência técnica **não passou**. Faltam as 6 correções bloqueantes acima. B5 e B6 mexem em texto de pista e de papel (cerca de 60 palavras ao todo): depois delas, a ordem das escalas manda voltar à etapa 1. B2 muda o custo de olhar o painel e precisa do aval do responsável antes de entrar.
