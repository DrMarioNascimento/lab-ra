# Mosaico Loop v4 revisão 7 — Conferência técnica (seção 4 das escalas), do zero

**Resultado: NÃO PASSA.** Dos 10 itens, 9 passam (1, 2, 4, 5, 6, 7, 8, 9, 10) e 1 tem falha bloqueante (item 3). É 1 correção, de uma linha de código, sem mexer em texto. A seção 4 só aceita "passa limpo".

As 2 bloqueantes da rodada 6 estão fechadas e foram conferidas de novo:
- **ordem das listas:** igual nas 5 causas (600 sementes no código real, 0 de 75 combinações diferentes; e 2.760 telas comparadas com a mesma semente, 0 diferentes);
- **sirene e Téo no final:** só aparecem com a fonte no caderno (30 finais abertos por toque no celular e 5 no telão, 35 certos).

As correções da revisão 7 não quebraram nada do que foi pedido para olhar: as 208 pistas que mudaram de posição não mudaram texto nem tranca; as frases condicionais saem sem deixar espaço duplo; a página "A noite" do telão não corta linha com 40 nomes; a torre com `?loop=1` mostra as 15 salas com a peça inteira acima do cartão.

A falha de agora **não nasceu na revisão 7**. Existe pelo menos desde 23/11 e nenhuma rodada tinha olhado: as rodadas anteriores compararam a **lista** de cada sala; desta vez comparei também os **pontos que brilham na peça 3D**, que é o que a pessoa vê primeiro ao entrar na sala (a lista vem fechada).

**Critério usado.** Bloqueante: quem joga vê, ou a partida quebra. Menor: campo interno, comentário, bloco escondido, documento, decisão já registrada em "Ficou para decidir".

**Estado auditado (25/11/2026, 17:17 a 18:29).** Os 865 arquivos da pasta ficaram iguais do começo ao fim (md5 em `aud5/snap_ini.txt` e `aud5/snap_fim.txt`). Durante a auditoria só entraram 3 arquivos novos, de outras avaliações (`docs/avaliacao/rodada7/`). Nada foi escrito por mim no repositório.
`dados/pistas-v4.json` 16:34:27 (278 pistas, "v4 revisão 7") · `loop-central.js` 16:42:44 · `game.js` 16:29:53 · `docs/LOOP-CENTRAL.md` 16:52:32.
`loop-central-dados.js` é idêntico ao JSON. `/tmp/roda/sim/engine.py` e `validar.py` são idênticos a `dados/simulador-texto.py` e `dados/validar.py`. `/tmp/roda/v4_pistas.json` é idêntico aos dados do repositório.

**Como foi conferido (tudo em `/tmp/roda/esc/r7/aud5/`).**
- Dados: `an/dados.py`, `an/pares.py`, `an/palavras.py`, `an/docs.py`, `an/trio.py`, `n6/crono.py`, `n6/citacoes.py`; novos: `x/diffdados7.py` (revisão 6 × revisão 7, campo a campo: 16 campos e 208 posições) e `x/dump.txt` (as 278 pistas lidas uma a uma, sala por sala).
- Tela real (`individual.html`): `pw/varre.mjs`, **10 partidas, 2 por causa (A, B, C, D, E)**, 5 voltas, 15 salas, 4 abas da Máquina com e sem diagnóstico, pausa, final: 3.210 telas e 9.480 itens de lista (`pw/corpus.json`).
- **Novo, item 3:** `x/forca.mjs` abre a mesma partida (mesma semente, mesmos valores) trocando só a causa, e compara tudo o que a pessoa vê antes de ler qualquer pista: 4 sementes × 5 voltas × (mapa, 15 salas em 5 minutos diferentes da volta, 4 abas da Máquina em 15 salas, pausa, Passar pista) = 2.760 comparações entre as 5 causas (texto, ordem, custo, ícone, estado, altura e largura de cada botão, altura da lista). `x/hs.mjs`, `x/hs2.mjs` e `x/hs_toque.mjs` medem os pontos que brilham na peça 3D.
- **Toque de verdade, nas 5 causas** (celular 390×844 e 360×640, `hasTouch`): `n/trava_all.mjs` (toda pista travada), `n6/janela.mjs` (Máquina: todo botão de ação, marcas, campos, pausa), `n6/mini.mjs` (minijogos), `n6/sons.mjs` (gravador), `n6/campos.mjs`, `n6/torre6.mjs` e `r7x/torre15.mjs` (museu em 3D), `x/final_tela.mjs` (finais com e sem a fonte), `x/toques7.mjs` (o que a revisão 7 mudou: faixa antes da hora, Passar pista, dicionário, minijogos sem resposta marcada, missões), mais `n/msgclique2.mjs` (4 tamanhos de tela) e `n/dura.mjs`.
- Palavras por bloco no DOM: `n/blocos.mjs` (105.952 blocos, 1 partida por causa) e `n6/man3.mjs` (caderno cheio nas 5 causas).
- Código real: `pw/sem.mjs` (4.000 sementes), `pw/andar.mjs` (3.000), `pw/dist.mjs` (3.000), `n6/ordem.mjs` (600), `r7x/ordem.mjs` (300), `pw/real_solo.mjs`, `n6/real_solo_teo.mjs`, `pw/real_par.mjs`, **novo `x/real_trio.mjs` (3 aparelhos)**, `pw/extras.mjs`, `pw/extra2.mjs`, `pw/meu.mjs`, `pw/tranca_causa.mjs`, `pw/tel.mjs`, `pw/reserva.mjs`, `pw2/painel.mjs`, `pw2/glos.mjs`, `pw2/barra.mjs`, `pw2/cartoes.mjs`, `pw2/mgpeca.mjs`, `pw2/paginas.mjs`, `pw2/r404.mjs`, `n/extra.mjs`, `n/entrada.mjs`, `n/mgluz.mjs`, `n6/glosh.mjs`, `n6/salagate.mjs`.
- Sala simulada: `n6/simrun6.mjs`, 2 partidas inteiras em `sala/simulador/` (3 participantes, Professor automático, até o resultado, passando as 5 páginas do telão): 492 e 507 linhas distintas (noites E e A). Telão com 40 nomes: `r7x/tl40.mjs`; página Missões com 8 missões e 40 nomes: `r7x/miss8.mjs`.
- Simulador de texto: `validar.py 2000` com `LOOP_DATA` no repositório (`aud5/validar.txt`).
- **Scripts antigos corrigidos:** `n6/torre6.mjs` (o cartão da torre passou a mostrar o andar em maiúsculas e o teste acusava 15 diferenças falsas; na sala, o botão fica atrás da tela de entrada e o toque não chegava); `pw2/mgpeca.mjs` (procurava as opções antigas da caixa; agora são cheiros); `n6/ordem.mjs` (a metade da sala parava na tela de entrada; agora confere que a sala carrega os mesmos arquivos); `r7x/tl40.mjs` (gravava as fotos fora da pasta da auditoria). Em `n6/mini.mjs` e `n6/janela.mjs` o aviso "minijogo não abriu / abriu" na segunda sala é o comportamento que a revisão 7 passou a escrever no registro (abre uma vez por atividade e por volta); não é falha.

**O que não foi coberto.** A sala de verdade, com Firebase e vários celulares, não foi aberta: usei o simulador de sala (transporte de mentira) e, no telão, estado injetado. Nas 2 salas simuladas ninguém cumpriu missão; a página Missões foi vista cheia só com estado injetado. Na varredura de telas caíram 4 das 5 horas de raio (faltou 1:20); as 5 aparecem nas 4.000 sementes e 3 delas no teste de causa forçada. Os pontos da peça 3D foram medidos num tamanho de tela (390×844), no Chrome com desenho por software; em outro aparelho o número de pontos à vista pode ser outro, mas a diferença entre causas continua, porque o lugar de cada ponto sai do identificador da pista. Não testei em iPhone.

## Tabela

| # | Item | Resultado | Evidência |
|---|---|---|---|
| 1 | Cronologia e testemunhas | **PASSA** | Andares fixos: 0 contradição em 3.000 sementes. 17 pistas com horário; nos 9.480 itens de lista, 0 horário diferente do dado mais o deslocamento do raio; 200 textos de hora do apagão no caderno, todos com a hora sorteada. Trajeto do Lenz em ordem (4:00 porta de serviço, 4:02 Área de descanso, 4:05 Seu Dirceu aponta, 4:10 escada). Braga só na Central, Seu Dirceu e Nico só na Base da limpeza, Ivone só no Ateliê, Aurélio só na Galeria, Dra. Sato só por interfone, Téo só caído, em papel e em gravação. **Bloqueante da rodada 6 fechada:** final aberto por toque no celular, 5 causas × Desligar e Ouro × 3 cadernos (sem nada, só viu o Téo, viu e contou) = 30 de 30 certos: sem a conversa do interfone não há sirene; sem ter visto o Téo, ele não acorda no texto; 0 espaço duplo; 30 a 53 palavras. Telão, 5 casos: 5 certos (a sirene aparece se 1 pessoa da turma contou). No código real, o caminho sem dupla chega ao Ouro nas 5 causas sem ver o Téo, e o final vem sem as duas frases. Os 16 campos que mudaram nos dados não criam testemunha nem horário novo. Menores m1, m2. |
| 2 | Origem, volta e quem vê | **PASSA** | 278 pistas, ids únicos, 15 salas, `quemPodeVer` "todos" nas 278, 0 referência quebrada, 86 com `precisaDe` e as 86 com `porque`, 0 pista inalcançável nas 5 causas (validador). Toque de verdade em toda pista travada: 64 trancas × 5 causas = 320 toques, 320 com a frase certa na tela, 0 de energia gasta, 0 pista entrou, 0 botão coberto, 0 frase diferente entre causas. Nenhum item preso embaixo da barra (15 salas, 2 tamanhos). As 208 pistas que mudaram de posição têm os mesmos campos de antes (comparação campo a campo). |
| 3 | Palavras proibidas por volta e prévias | **NÃO PASSA** (1 bloqueante) | **Certo:** "Lenz": 0 nas 1.280 telas das voltas 0 a 2 e 0 antes da volta 3 nas 2 salas simuladas. **Ordem (bloqueante da rodada 6): fechada.** 600 sementes no código real: 0 de 75 combinações de sala e volta com ordem diferente entre causas; validador (g2): 0. Mesma partida com a causa trocada, caderno vazio: 2.760 comparações, **0 diferença** em rótulo, ordem, quantidade, custo, ícone, "ainda não", "travada", altura de cada botão, altura da lista, mapa, as 4 abas da Máquina, pausa e Passar pista. 216 rótulos, 0 em causa única; 1.000 rótulos por sala e causa, 0 repetido. Gravador: mesmas faixas, na mesma ordem, nas 5 causas. Painel: 0 à vista sem pagar. Livros de folhear: mesma sequência de páginas. **Falha:** os **pontos que brilham na peça 3D** mudam de lugar, e em 10 salas também de quantidade à vista, conforme o defeito. É a primeira coisa na tela da sala ("Gire a peça e toque nos pontos que brilham"; a lista entra fechada). Volta 1, minuto 0:00, caderno vazio, mesma semente: o desenho dos pontos é diferente entre causas em **13 das 15 salas** (só Galeria e Sala das coleções ficam iguais). Sala dos sons: 3 pontos em A, C e E, 2 em B e D. Área de descanso: 6, 7, 5, 7, 7 (A a E). Base da limpeza: 3, 4, 2, 3, 4. Subsolo: 9 só na noite D. Área de descanso e Base da limpeza juntas separam as 5 causas. O lugar não muda com a semente: é igual em toda partida. Quem já jogou (ou tirou foto da tela) lê o defeito no primeiro minuto, sem gastar energia. Nos dados, 45 dos 175 pontos da volta 1 trocam de lugar com a causa. |
| 4 | Fonte para cada fato essencial (1, 2 e 3 pessoas, 5 causas, simulador e código) | **PASSA** | **Simulador:** `validar.py` com 2.000 bots: ótimo com 1, 2 e 3 pessoas = Ouro na volta 5 nas 5 causas, com 5 jogos de valores sorteados; `trio.py` repete com 4 e 5; bot aleatório 0,00% a 0,10% de Ouro ou Desligar; 0 essencial sem 2 caminhos; 0 sala que fecha o diagnóstico sozinha; "APROVADO nas 5 causas". **Código real, 1 pessoa:** `collect()` de verdade, 5 de energia por volta: Ouro nas 5 causas (2 roteiros diferentes). **2 pessoas:** dois aparelhos, mesma semente: DESFECHO DA TURMA = Ouro nas 5 causas. **3 pessoas (novo):** três aparelhos, mesma semente; 1 e 2 fazem diagnóstico e conserto em dupla e não revelam; o 3 junta só as 3 provas (6 pistas no caderno, sem diagnóstico) e revela: Desligar + Revelar = DESFECHO DA TURMA Ouro nas 5 causas. Minijogos por toque nas 5 causas: a resposta certa põe a pista no caderno (40 janelas). Menores m3, m4. |
| 5 | Códigos decoráveis | **PASSA** | 4.000 sementes: dia 9 a 25 (17 valores, 194 a 262 cada), hora em 5 valores (748 a 827), registro 105 a 994 (882 distintos), 6 ordens (644 a 690), 3 chaves, 5 causas entre 19,3% e 20,5%; 0 partida com o trio padrão; 0 marcador `{…}` sobrando em 3.210 telas e nas 2 salas simuladas. Opções dos minijogos em todas as posições, em 3.000 sorteios: listas 982 a 1.023, foto (4 opções) 721 a 776, caixa (4) 715 a 776, fita 980 a 1.027, acusação 719 a 794, cópia 985 a 1.026, "antes da luz" (3) 959 a 1.022, luz nas posições 2 a 5 (721 a 777); a resposta certa acompanha o sorteio (0 erro). Código de Passar pista e palavra da dupla saem da semente. Menor m5. |
| 6 | Contagem de palavras (até 60 por bloco) | **PASSA** | 105.952 blocos medidos no DOM nas 5 causas: **0 acima de 60**. Maiores: "Como funciona" 58; interfone da Dra. Sato 58 (25 variantes); pendrive no rádio 57; finais até 53 (com a sirene); frase de tranca até 31; ajuda até 32; pausa até 31; papel da última volta até 22. Caderno cheio nas 5 causas: 1.041 anotações, rótulo em linha própria em todas. Recusa do Anexar, pior caso, 54; aceite 50. Minijogos até 30. Telão até 29 por bloco; linhas da sala até 45. Menor m6. |
| 7 | Documentação × dados × código | **PASSA** | Cabeçalho dos dados, do `loop-central-dados.js`, do validador e do LOOP-CENTRAL em "revisão 7". 0 termo antigo em ROTEIRO-LOOP, FICHAS, README e CATALOGO (parte central). Os 16 campos que mudaram nos dados batem com a parte 14 do ROTEIRO e com DECISOES "Revisão 7" (Lado a Lado, foto comparada, veredito do Braga, folha do Téo, papel do Raio, frases condicionais). Entrada: "O museu recomeça. Você não." nas 3 páginas. Itens por sala na volta 1 iguais aos da tela nas 15 salas. Por toque, nas 5 causas: 137 botões de ação da aba Atividades, 0 sem resposta à vista (87 com mensagem, 50 abrem o minijogo da dupla); resposta do Anexar (46 palavras) à vista no toque e 5 s depois; marcas e campos continuam depois do redesenho; em Passar pista, gerar código limpa "Código inválido."; a marca do dicionário vem depois de "fusível-mestre" (0 no meio da palavra em 556 textos); faixa do gravador antes da hora responde e não gasta. 0 resposta de erro de rede em 5 páginas, na torre e nos minijogos (o 404 do ícone da aba sumiu). Menores m7 a m12. |
| 8 | Registro de revisão e checklist | **PASSA** | LOOP-CENTRAL tem "Revisão 7 — 25/11/2026" com por quê, o que mudou (código, dados, validador, testes) e o que não foi aplicado. Comparei os dados da revisão 6 com os de agora: 16 campos mudaram e 208 pistas trocaram de posição; **tudo está no registro**. Checklist: 231/25/9/9/4 = 278 e ativas 207/208/207/207/212, iguais aos dados; os 17 horários iguais a `segundo_min`; finais e frases condicionais descritos. DECISOES tem "Revisão 7" com as escolhas, o que não foi aplicado e "Ficou para decidir" (9 pontos, nenhum bloqueia). O que a rodada 6 chamou de comportamento não escrito (minijogo da dupla uma vez por volta) ganhou linha. Menores m13, m14. |
| 9 | Vocabulário de projeto e gênero no texto visível | **PASSA** | 3.210 telas + 999 linhas das 2 salas simuladas (telão, Professor, participantes) + torre: 0 identificador interno, 0 "solo", "coop", "semente", "rodada", "jogador", "investigador", "aluno", 0 nome de escala ou de revisão, 0 "carga" como recurso, 0 "os dois", 0 "Mão A/B". "Sozinho" e "Sozinha" só em fala de personagem ou de objeto; "pronto" e "pronta" só para coisa. Papéis da última volta sem marca de gênero. "Bem-vindo", "Bem-vinda" ou "Olá" conforme a forma que a pessoa escolheu. Menores m15, m16. |
| 10 | Tela real sem camada antiga | **PASSA** | Mapa com as 15 salas nas 50 telas de mapa; 9.480 itens de lista, 0 fora da história (13.235 pistas antigas filtradas); 0 termo antigo em 3.210 telas e nas 999 linhas de sala; `reserva/` leva para a entrada; tela final sem formulário; 0 erro de página em todos os testes. **"Ver o museu em 3D", por toque, 2 tamanhos:** abre `museu/torre/?loop=1`, título "O museu do Mosaico Loop", 4 andares, 15 salas, 0 de fora, 0 faltando, andar e nome iguais ao jogo, "Sair" volta ao jogo. **Peça no meio da tela** (15 salas, 390×844): peça inteira, centrada e acima do cartão nas 15, 0 falha. **Gravador, por toque, 5 causas, voltas 1 a 5:** faixas iguais aos itens da lista, custo certo, "ouvir de novo" sem gastar, travada com a frase na tela, antes da hora responde; 0 falha; o gravador não muda de altura. **Minijogos, por toque, 5 causas:** 40 janelas, imagem carregada, a janela não muda de altura com o aviso nem com a dica, nenhuma resposta abre marcada (20 de 20), resposta certa fecha e entrega. **Telão:** 5 páginas no resultado (Desfecho, A noite, Para conversar, Missões, Turma); com 40 nomes em 1.280 e 1.920 de largura, 0 cartão cortado, 0 linha da fita cortada, 0 elemento fora da tela, letra mínima 1,35% da largura; Missões com 8 missões e 40 nomes: 0 corte. Menores m17, m18. |

## Antes | agora | motivo

| # | Rodada 6 | Rodada 7 | Motivo |
|---|---|---|---|
| 1 | não passa (1) | **passa** | A sirene e o Téo acordando viraram frases com condição: 35 finais conferidos, 35 certos. |
| 2 | passa | passa | Sem mudança; 320 toques de novo. |
| 3 | não passa (1) | **não passa (1)** | A ordem da lista foi corrigida e está igual nas 5 causas. A falha de agora é outra e já existia: os pontos da peça 3D. As rodadas anteriores compararam a lista; desta vez comparei o que aparece na peça. |
| 4 | passa | passa | Refeito; entrou o teste com 3 aparelhos no código real. |
| 5 | passa | passa | Refeito com as perguntas novas (foto com 4 opções, "antes da luz" com 3). |
| 6 | passa | passa | Mesmos 105.952 blocos; os finais com a sirene ficam em até 53. |
| 7 | passa | passa | As menores m3, m7 a m10 e m12 da rodada 6 foram corrigidas e conferidas (as de tela, por toque). |
| 8 | passa | passa | Registro da revisão 7 completo; os 16 campos e a troca de posição estão nele. |
| 9 | passa | passa | Nada novo vazou. |
| 10 | passa | passa | Torre, gravador, minijogos e telão conferidos de novo; a peça agora fica centrada acima do cartão. |

## Correção bloqueante (texto pronto)

**B1. Os pontos da peça 3D denunciam o defeito (item 3).** `game.js`, função `pontosDaPeca`, linha 636. O lugar de cada ponto sai do identificador da pista, e o sinal de cada noite tem identificador diferente do par inocente que ocupa o mesmo rótulo nas outras noites. A chave passa a ser a sala mais o rótulo, que são iguais nas 5 causas. Não mexe em texto, dado nem regra.
- Trocar
  `const ang = hashTxt(clue.id+'a')*Math.PI*2, alt = hashTxt(clue.id+'b');`
  por
  `const k = clue.lcp ? state.room+'|'+clue.name : clue.id, ang = hashTxt(k+'a')*Math.PI*2, alt = hashTxt(k+'b');`
- Testado só na página aberta (`x/hs2.mjs`, modo "remendo"): salas em que o desenho dos pontos muda com o defeito caem de **13 para 0 de 15**; o número de pontos à vista fica igual nas 5 causas em todas as salas. Não há dois rótulos iguais na mesma sala e na mesma noite (1.000 conferidos), então nenhum ponto cai em cima de outro por causa da troca.
- Para não voltar: guardar um teste de tela como `x/hs2.mjs` (mesma semente, causa trocada, pontos à vista em cada sala) junto dos testes de ordem. O validador de dados não enxerga isso, porque o lugar do ponto é calculado na tela.
- Depois da correção, a ordem das escalas não manda voltar à etapa 1: nenhum texto muda.

## Menores (não bloqueiam)

**Cronologia (item 1)**
- **m1.** Na noite D, quem conserta pelo fusível de reserva e pela tampa do painel pode chegar ao fim sem ter lido nada do Téo (no roteiro do teste, 1 de 15 anotações cita o Téo, e é o próprio conserto). O conserto diz "Você refez o que o Téo desfez" e o final Desligar diz "O Téo desligou a máquina para a verdade não sumir". É fato verdadeiro do mundo, mas chega sem preparo. Do mesmo tipo: o final "Caso aberto" e os Desligar das noites B e C falam em "cópia" e em "quem trocou a peça" para quem pode não ter achado a troca.
- **m2.** `coop_veredito` vai para os dois aparelhos da dupla; quem está na Base da limpeza lê "Na Central, Braga espia a escala" (decisão registrada: a frase situa a cena).

**Fontes (item 4)**
- **m3.** O simulador de texto continua diferente do jogo no dossiê do grupo, na pré-conferência e no limite de atividades em dupla (registrado em DECISOES).
- **m4.** Em dupla ou trio, o aparelho que não está no Subsolo termina em "Caso aberto" ou "A verdade apareceu"; o Ouro aparece no DESFECHO DA TURMA (regra escrita). O código não tem regra por tamanho de grupo.

**Códigos (item 5)**
- **m5.** A resposta certa de cada minijogo é sempre a mesma frase (só a posição é sorteada) e errar não custa nada (está em "Ficou para decidir").

**Palavras (item 6)**
- **m6.** Cartão de atividade aberto e o "Dicionário das palavras" somam mais de 60 no conjunto; cada bloco fica abaixo (decisão registrada).

**Documentos, campos internos e frases (item 7)**
- **m7.** ROTEIRO-LOOP, parte 4: cita a gravação como "...ou eu não tenho mais empresa." (no jogo: "...mais empresa pra te pagar.") e a fala do Braga sem o "Tá." do começo.
- **m8.** ROTEIRO-LOOP, parte 7, tabela dos papéis: "Quem opera ... (gira, baixa a alavanca...)"; nos dados passou a "digita".
- **m9.** LOOP-CENTRAL, linha 3: "Botão 🧭 Máquina no canto da tela"; na tela é a barra de baixo, com a miniatura da Câmara.
- **m10.** O registro diz que as missões do Téo, do Aurélio e da Ivone "não fecham mais com um toque". Téo e Aurélio, conferido. A da Ivone ainda fecha com um toque em "Conversa com Seu Dirceu" (volta 1, sem tranca, 1 de energia), como DECISOES descreve.
- **m11.** `simulador-texto.py` se apresenta como "revisao 3" (não mudou desde então); `GDD.md` ainda tem termos antigos; identificadores internos com palavra antiga; `prova_falsa` lista `c_peca` por fora do `grupoFonte`; etiqueta "MANUAL" em 6 grupos (todos registrados).
- **m12.** No telão do simulador, "Quem trouxe" encurta "Participante 2" para "Participante 2." e "Participante 1" para "Participante" (só acontece com os nomes de mentira).

**Registro (item 8)**
- **m13.** Quatro arquivos mudaram na revisão 7 (16:30 a 16:50) sem cópia nova da versão anterior: `individual.html`, `sala/index.html`, `sala/simulador/index.html` e `sala/telao/index.html` (a última cópia guardada é a `25h`, das 11:55 às 11:59). Os outros 17 arquivos alterados têm cópia `25i`.
- **m14.** Os testes de tela citados no registro ficam em `/tmp/roda/r7/`, fora do repositório.

**Vocabulário e gênero (item 9)**
- **m15.** Aviso de aula encerrada: "O Professor encerrou a aula. Obrigado por participar!" (padrão de sala dos outros jogos; em "Ficou para decidir").
- **m16.** "Simulador" e "Professor" aparecem na entrada como nomes do padrão de sala; no telão, o botão "Troca sozinha: sim" fala da troca de página.

**Camada antiga (item 10)**
- **m17.** `sala/conteudo.js` e `game.js` ainda carregam as salas e pistas antigas; a tela filtra todas (13.235 filtradas, 0 mostrada).
- **m18.** `museu/` e `museu/torre/` sem `?loop=1` continuam mostrando o museu antigo (5 andares) para quem digitar o endereço; nenhum botão do jogo leva até lá. O README ainda aponta para `museu/`.

## Fim do ciclo

A conferência técnica **não passou**: falta a correção B1, de uma linha em `game.js`. Ela não mexe em texto, então as notas da história, das fichas e do conteúdo não precisam ser revistas por causa dela. Depois de aplicada, a seção 4 é refeita do zero, com o teste dos pontos da peça junto dos outros.
