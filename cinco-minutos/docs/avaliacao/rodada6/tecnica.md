# Mosaico Loop v4 revisão 6 — Conferência técnica (seção 4 das escalas), do zero

**Resultado: NÃO PASSA.** Dos 10 itens, 8 passam (2, 4, 5, 6, 7, 8, 9, 10) e 2 têm falha bloqueante (1 e 3). São 2 correções bloqueantes, as duas de código e pequenas. A seção 4 só aceita "passa limpo".

As 4 bloqueantes da rodada 5 (B1 a B4) estão fechadas e foram conferidas de novo com toque de verdade, nas 5 causas. As correções da revisão 6 não quebraram nada do que foi pedido para olhar (redesenho, gravador, minijogos, telão final, torre). Das 2 falhas de agora:
- uma **nasceu na revisão 6**: a frase "Lá fora, uma sirene: o socorro do Téo." entrou no final Desligar sem condição;
- a outra **já existia** na revisão 5 e passou despercebida: as comparações anteriores punham a lista de cada sala em ordem alfabética antes de comparar. Desta vez comparei a ordem que aparece na tela.

**Critério usado.** Bloqueante: quem joga vê a coisa errada, ou a partida quebra. Menor: campo interno, comentário, bloco escondido, documento, ou frase que depende de leitura.

**Estado auditado (25/11/2026, 15:22 a 16:05).** Nenhum arquivo mudou durante a auditoria: 493 arquivos, md5 do começo e do fim iguais (`aud4/snap_ini.txt`, `aud4/snap_fim.txt`). Nada foi escrito no repositório.
`dados/pistas-v4.json` 15:09:35 (278 pistas, "v4 revisão 6") · `loop-central.js` 13:50:54 · `game.js` 14:19:02 · `docs/LOOP-CENTRAL.md` 14:16:34.
`loop-central-dados.js` é idêntico ao JSON. `/tmp/roda/sim/engine.py` e `validar.py` são idênticos a `dados/simulador-texto.py` e `dados/validar.py`.

**Como foi conferido (tudo em `/tmp/roda/esc/r6/aud4/`).**
- Dados: `an/dados.py`, `an/pares.py`, `an/palavras.py`, `an/docs.py`, `an/trio.py`, `n/dump.py`, `n/pal.py`; novos: `n6/diffdados.py` (revisão 5 × revisão 6, campo a campo: 28 campos), `n6/citacoes.py` (frases entre aspas dos documentos × dados e código), `n6/crono.py`.
- Tela real (`individual.html`): `pw/varre.mjs`, **10 partidas, 2 por causa (A, B, C, D, E)**, 5 voltas, 15 salas, 4 abas da Máquina com e sem diagnóstico, pausa, final: 3.210 telas e 9.480 itens de lista (`pw/corpus.json`), lidas por `an/*.py`, `n/item3.py` e `n6/tela6.py`.
- **Toque de verdade, nas 5 causas** (celular 390×844 e 360×640, `hasTouch`): `n6/janela.mjs` (Máquina: todo botão de ação, marcas, campos, pausa), `n/trava_all.mjs` (toda pista travada), `n6/mini.mjs` (minijogos), `n6/sons.mjs` (gravador), `n6/campos.mjs`, `n6/torre6.mjs` (museu em 3D), mais `n/msgclique2.mjs` (4 tamanhos de tela) e `n/dura.mjs`.
- Palavras por bloco no DOM: `n/blocos.mjs` (105.952 blocos, 1 partida por causa) e `n6/man3.mjs` (caderno cheio nas 5 causas).
- Código real: `pw/sem.mjs` (4.000 sementes), `pw/andar.mjs` (3.000), `pw/dist.mjs` (3.000), `pw/real_solo.mjs`, `pw/real_par.mjs`, `n6/real_solo_teo.mjs`, `n6/ordem.mjs` (600 sementes), `pw/extras.mjs`, `pw/extra2.mjs`, `pw/meu.mjs`, `pw/tranca_causa.mjs`, `pw/tel.mjs`, `pw/reserva.mjs`, `pw2/painel.mjs`, `pw2/glos.mjs`, `pw2/barra.mjs`, `pw2/cartoes.mjs`, `pw2/mgpeca.mjs`, `pw2/paginas.mjs`, `pw2/r404.mjs`, `n/extra.mjs`, `n/entrada.mjs`.
- Sala simulada: `n6/simrun6.mjs`, 2 partidas inteiras em `sala/simulador/` (3 participantes, Professor automático, até o resultado, passando as 5 páginas do telão): 507 e 484 linhas distintas (noites C e B).
- Simulador de texto: `validar.py 2000` com `LOOP_DATA` no repositório (`aud4/validar.txt`).
- Scripts antigos corrigidos: `pw/dist.mjs` ainda sorteava a pergunta da escala de crachás, que saiu (agora sorteia foto, caixa, fita, acusação, cópia, listas e a pergunta de antes da luz). `n/blocos.mjs` só pegava o rótulo do interfone depois que ele foi para linha própria; o parágrafo foi medido em `n6/man3.mjs`. `an/lista_tela.py` comparava os botões em ordem alfabética; a ordem real foi comparada à parte. `n/torre.mjs` abria o museu antigo; `n6/torre6.mjs` entra pelo botão do jogo.

**O que não foi coberto.** A página "Missões" do telão só foi vista vazia (nas 2 salas simuladas ninguém cumpriu missão). No `sala/index.html` o botão "Ver o museu em 3D" fica atrás da tela de entrada até a pessoa entrar; conferi o endereço dele (`../museu/torre/?loop=1`, o mesmo). Na varredura de telas caíram 4 das 5 horas de raio (faltou 1:00); as 5 aparecem nas 4.000 sementes. Com 3 pessoas o código real não tem regra própria; o trio foi conferido no simulador de texto.

## Tabela

| # | Item | Resultado | Evidência |
|---|---|---|---|
| 1 | Cronologia e testemunhas | **NÃO PASSA** (1 bloqueante) | **Certo:** andares fixos: 0 contradição em 3.000 sementes. 17 pistas com horário; nos 9.480 itens de lista, 0 horário diferente do dado mais o deslocamento do raio; 200 textos de hora do apagão no caderno, todos com a hora sorteada. Trajeto do Lenz em ordem (4:00 porta de serviço, 4:02 Área de descanso, 4:05 Seu Dirceu aponta, 4:10 escada). Braga só na Central (inclusive na frase nova do veredito, que diz "Na Central"), Seu Dirceu e Nico só na Base da limpeza, Ivone só no Ateliê, Aurélio só na Galeria, Dra. Sato só por interfone, Téo só em papel e gravação. **Falha:** o final Desligar (texto de base e os 5 por causa, 6 de 6) diz "Lá fora, uma sirene: o socorro do Téo." para qualquer pessoa. Pelo ROTEIRO (parte 12) e pelo LOOP-CENTRAL, a Dra. Sato só pede socorro depois que a pessoa conta do Téo (`sato_teo`). No código real, o melhor caminho sem dupla chega ao fim nas 5 causas **sem ver o Téo e sem contar nada** (`teo_1` e `sato_teo` fora do caderno; em A, B, C e E o caderno não cita o Téo nenhuma vez). Essa pessoa lê um socorro que ninguém pediu, para alguém que ela não conheceu. O Ouro tem a mesma sirene sem condição. Menores m1, m2. |
| 2 | Origem, volta e quem vê | **PASSA** | 278 pistas, ids únicos, 15 salas, `quemPodeVer` "todos" nas 278, 0 referência quebrada, 86 com `precisaDe` e as 86 com `porque`, 0 pista inalcançável nas 5 causas. Toque de verdade em toda pista travada: 64 trancas × 5 causas = 320 toques, 320 com a frase certa na tela, 0 de energia gasta, 0 pista entrou, 0 botão coberto, 0 frase diferente entre causas. Nenhum item preso embaixo da barra (15 salas, 2 tamanhos). |
| 3 | Palavras proibidas por volta e prévias | **NÃO PASSA** (1 bloqueante) | **Certo:** "Lenz": 0 nas 1.280 telas das voltas 0 a 2 e 0 antes da volta 3 nas 2 salas simuladas. 216 rótulos de sala, 0 em causa única; mesma quantidade nas 15 salas e nas 5 causas, nos dados e na tela; custo, hora, tipo e tranca iguais; 0 rótulo com hora. Aba Atividades igual nas 5 causas em 75 combinações de volta e sala (só muda a palavra de dizer em voz alta); 0 nome de defeito e 0 título de conserto em 800 telas sem diagnóstico. Painel: 0 à vista sem pagar em 3.110 telas. Livros de folhear: mesma sequência de páginas nas 5 causas. **Falha:** a **ordem** dos itens da lista muda com o defeito em 5 das 15 salas, nas 5 voltas (25 de 75 combinações; 600 sementes no código real e os botões na tela). Subsolo e Central: "Os 3 mostradores" antes de "O ponteiro de carga" só nas noites A e D. Sala dos sons: "Alto-falante de teste" por último só na noite D. Base da limpeza: "Seu Dirceu, de pano na mão" antes de "Bilhete no armário" só na D. Galeria: "Papel atrás da base" antes de "A base da peça principal" só na C. Quem já jogou lê o defeito no minuto 0:00 da volta 1, sem gastar energia: A, C e D exatos; B ou E. A ordem das faixas do gravador é a mesma da lista. Menor m3. |
| 4 | Fonte para cada fato essencial (1, 2 e 3 pessoas, 5 causas, simulador e código) | **PASSA** | **Simulador:** `validar.py` com 2.000 bots: ótimo com 1, 2 e 3 pessoas = Ouro na volta 5 nas 5 causas, com 5 jogos de valores sorteados; `trio.py` repete com 4 e 5; bot aleatório 0,00% a 0,05% de Ouro ou Desligar; 0 essencial sem 2 caminhos; 0 sala que fecha o diagnóstico sozinha; "APROVADO nas 5 causas". **Código real, 1 pessoa:** `collect()` de verdade, 5 de energia por volta: Ouro nas 5 causas. **Código real, 2 pessoas:** dois aparelhos, mesma semente: DESFECHO DA TURMA = Ouro nas 5 causas. **3 pessoas:** sem regra por tamanho de grupo no código. Minijogos por toque nas 5 causas: a resposta certa põe a pista no caderno. Menores m4, m5. |
| 5 | Códigos decoráveis | **PASSA** | 4.000 sementes: dia 9 a 25 (17 valores, 220 a 262 cada), hora em 5 valores (771 a 820), registro 105 a 994 (879 distintos), 6 ordens, 3 chaves, 5 causas entre 19,4% e 20,4%; 0 partida com o trio padrão; 0 marcador `{…}` sobrando em 3.210 telas. Opções dos minijogos em todas as posições, em 3.000 sorteios: listas 968 a 1.032, foto 740 a 762, caixa 741 a 764, fita 958 a 1.059, acusação 729 a 796, cópia 992 a 1.011, luz nas posições 2 a 5 (723 a 769); a resposta certa acompanha o sorteio (0 erro). |
| 6 | Contagem de palavras (até 60 por bloco) | **PASSA** | 105.952 blocos medidos no DOM nas 5 causas: **0 acima de 60**. Maiores: "Como funciona" 58; interfone da Dra. Sato 58 (25 variantes medidas); pendrive no rádio 57; finais até 53; frase de tranca até 31; ajuda até 32; pausa até 31. Caderno cheio nas 5 causas: 1.041 anotações, rótulo em linha própria em todas (0 colado no texto). Recusa do Anexar, pior caso real, 54; aceite 50. Minijogos até 25. Legenda do gravador até 57. Telão até 26 por bloco; linhas da sala até 37. Menor m6. |
| 7 | Documentação × dados × código | **PASSA** | Cabeçalho dos dados, do `loop-central-dados.js` e do validador em "revisão 6"; 0 termo antigo em ROTEIRO-LOOP, FICHAS, README e CATALOGO (parte central). Os 28 campos que mudaram nos dados batem com os textos do ROTEIRO (finais, papéis "Quem opera" e "Quem apoia", painel da noite D, veredito). **As 2 bloqueantes da rodada 5, com toque de verdade nas 5 causas:** 137 botões de ação tocados na aba Atividades (27 a 28 por causa): 0 sem mensagem, 0 com a mensagem fora da vista, 0 que sumiu em 2,3 s. Resposta do Anexar (46 palavras) à vista no toque e 5,2 s depois; some ao trocar de aba. Defeito e 3 pistas marcadas continuam sem foco e depois que o conteúdo muda (lista de 4 para 5 pistas). Campo digitado continua depois do redesenho e depois de resposta errada. Na pausa, "Código inválido." fica na janela. Em 4 tamanhos de tela a mensagem está dentro da janela. Menores m7 a m13. |
| 8 | Registro de revisão e checklist | **PASSA** | LOOP-CENTRAL tem "Revisão 6 — 25/11/2026" com por quê, o que mudou (código, dados, simulador) e o que não foi aplicado. Comparei os dados da revisão 5 com os de agora: 28 campos mudaram em 9 pistas, 2 atividades, 2 finais, nos papéis da última volta, em 1 tranca e na versão; **os 28 estão no registro**. O que a rodada 5 apontou como sem linha própria ganhou linha. Checklist: 231/25/9/9/4 = 278 e ativas 207/208/207/207/212, iguais aos dados; itens por sala iguais à tela; os 17 horários iguais a `segundo_min`. DECISOES tem "Revisão 6" com as escolhas e "Ficou para decidir" (11 pontos, nenhum bloqueia). Menor m14. |
| 9 | Vocabulário de projeto e gênero no texto visível | **PASSA** | 3.210 telas + 991 linhas das 2 salas simuladas (telão, Professor, participantes): 0 identificador interno, 0 "solo", "coop", "semente", "rodada", "jogador", "investigador", "aluno", 0 nome de escala ou de revisão, 0 "carga" como recurso, 0 "os dois", 0 "Mão A/B". "Sozinho" e "Sozinha" só em fala de personagem ou de objeto. Papéis da última volta sem marca de gênero. "Professor" como nome de quem conduz, no padrão de entrada. Menores m15, m16. |
| 10 | Tela real sem camada antiga | **PASSA** | Mapa com as 15 salas nas 50 telas de mapa; 9.480 itens de lista, 0 fora da história (13.255 pistas antigas filtradas); 0 termo antigo em 3.210 telas e 991 linhas de sala; `reserva/` leva para a entrada; tela final sem formulário; 0 erro de página. **"Ver o museu em 3D", por toque:** abre `museu/torre/?loop=1` com o título "O museu do Mosaico Loop", 4 andares (2º andar, 1º andar, Térreo, Subsolo), 15 salas, 0 sala de fora, 0 faltando, andar e nome iguais ao jogo nas 15, texto do cartão igual ao do jogo, as 15 peças com arquivo; "Sair" volta ao jogo. **Gravador da Sala dos sons, por toque, 5 causas, voltas 1 a 5:** faixas iguais aos itens da lista (5, 6, 7 e 9); 45 pistas novas com o custo certo, 150 "ouvir de novo" sem gastar, 5 travadas com a frase na tela e sem gasto, 5 antes da hora sem entrar; legenda igual ao texto do caderno; o gravador não muda de altura. **Minijogos, por toque, 5 causas:** 40 janelas, imagem carregada e à vista em todas (25 com 1, 15 com 2), a janela não muda de altura com o aviso nem com a dica, resposta certa fecha e entrega; a escala de crachás entra direto, sem pergunta. **Telão no resultado:** 5 páginas (Desfecho, A noite, Para conversar, Missões, Turma), 0 cartão cortado, 0 elemento fora da tela, imagens carregadas, menor letra 17,3 px em 1.280 de largura. Menores m17, m18. |

## Antes | agora | motivo

| # | Rodada 5 | Rodada 6 | Motivo |
|---|---|---|---|
| 1 | passa | **não passa (1)** | A revisão 6 pôs "o socorro do Téo" no Desligar sem condição. O Ouro já tinha a sirene; na rodada 5 eu não tinha jogado o caminho que não passa pelo Téo. |
| 2 | passa | passa | Sem mudança; 320 toques de novo. |
| 3 | passa | **não passa (1)** | Não é texto novo: a ordem já mudava na revisão 5 (conferi no material guardado daquela rodada, as mesmas 5 salas). A comparação de antes ordenava as listas; a de agora usa a ordem da tela. |
| 4 | passa | passa | Sem mudança de regra; refeito com os minijogos novos. |
| 5 | passa | passa | Refeito com as perguntas novas. |
| 6 | não passa (1) | **passa** | Rótulo do caderno em linha própria: o parágrafo do interfone ficou em 58. |
| 7 | não passa (2) | **passa** | A mensagem fica guardada, volta depois de cada redesenho e fica presa no pé da janela; as marcas e os campos são repostos. |
| 8 | passa | passa | Registro da revisão 6 completo; os 28 campos estão nele. |
| 9 | passa | passa | Papéis "Quem opera" e "Quem apoia"; nada novo vazou. |
| 10 | não passa (1) | **passa** | O botão abre a torre no modo do Loop: 15 salas, 4 andares. |

## Correções bloqueantes (texto pronto)

**B1. A ordem da lista denuncia o defeito (item 3).** `loop-central.js`, função `pistasCentral` (linhas 139 e 140). A lista passa a seguir a primeira vez que cada rótulo aparece nos dados, igual nas 5 causas. Não mexe em texto.
- Antes da linha 139 (`function pistasCentral(base){`): `const LC_ORD = {}; LC.pistas.forEach((p, i) => { const k = p.sala + '|' + p.previa; if (!(k in LC_ORD)) LC_ORD[k] = i; });`
- Linha 140, trocar `for (const p of LC.pistas) {` por `for (const p of [...LC.pistas].sort((a, b) => LC_ORD[a.sala + '|' + a.previa] - LC_ORD[b.sala + '|' + b.previa])) {`
- Testado só na página aberta (`n6/ordem.mjs`): ordem diferente entre causas cai de 25 para **0 de 75**.
- Para não voltar: no `validar.py`, o teste (g) "prévias iguais nas 5 causas" compara conjuntos; passar a comparar a sequência.

**B2. Sirene sem pedido de socorro (item 1). Tira uma frase do final conforme o caso: pela ordem das escalas, volta à etapa 1.**
- `loop-central.js:260` (`lcFinalTxt`): guardar o texto em `t` e devolver `lcTem('sato_teo') ? t : t.replace(' Lá fora, uma sirene: o socorro do Téo.', '').replace(' Lá fora, uma sirene.', '')`. Testado só na página aberta (`n6/sirene_teste.mjs`): sem contar do Téo a frase sai do Desligar e do Ouro; contando, fica. A frase exata está nos 6 textos do Desligar.
- Telão e resultado da sala (`ritmo.js` `LOOP_FINAIS`, usado em `sala/telao/telao.mjs:169` e `sala/sala-mestre.mjs:105`): mandar `loopSato: lcTem('sato_teo')` junto da resposta (`sala/sala-mestre.mjs:171`) e tirar a frase quando ninguém da turma contou.
- Outra saída, se o autor preferir mudar o fato em vez do código: a Dra. Sato pedir socorro sem depender de quem joga. É mudança de enredo (desfaz a decisão da revisão 5) e pede aval.

## Menores (não bloqueiam)

**Cronologia (item 1)**
- **m1.** No Ouro, "Na Sala das coleções, o Téo abre os olhos" também aparece para quem nunca entrou na Sala das coleções. Não contradiz regra (ele acorda porque a noite andou), mas chega sem preparo.
- **m2.** `coop_veredito` vai para os dois aparelhos da dupla; quem está na Base da limpeza lê "Na Central, Braga espia a escala". A frase situa a cena (decisão registrada).

**Prévias (item 3)**
- **m3.** Tocar numa faixa do gravador antes da hora não responde nada (o botão da lista fica desligado; a faixa parece ligada e mostra "ainda não").

**Fontes (item 4)**
- **m4.** O simulador de texto continua diferente do jogo no dossiê do grupo, na pré-conferência e no limite de atividades em dupla (registrado em DECISOES).
- **m5.** Em dupla, o aparelho que não está no Subsolo termina em "A verdade apareceu"; o Ouro aparece no DESFECHO DA TURMA (regra escrita).

**Palavras (item 6)**
- **m6.** Cartão de atividade aberto e o "Dicionário das palavras" somam mais de 60 no conjunto; cada bloco fica abaixo (decisão registrada).

**Documentos, campos internos e frases (item 7)**
- **m7.** `index.html` (entrada): "Cinco minutos. A mesma noite. Só você lembra." O ROTEIRO e a revisão 6 dizem que em sala a turma inteira lembra; `individual.html` e `sala/index.html` já usam "O museu recomeça. Você não."
- **m8.** Na aba "Passar pista", depois de um código errado, "Código inválido." continua no pé da janela ao lado do código que a pessoa gerar em seguida.
- **m9.** "fusível?-mestre": a marca do dicionário cai no meio da palavra em 3 pistas (`man_circ_1`, `teo_radio_2d`, `coop_painel_D`), no caderno e no gravador.
- **m10.** ROTEIRO-LOOP cita a resposta do ensaio como "ENSAIO: A MÁQUINA REAGE."; a tela diz "ENSAIO (em dupla): A MÁQUINA REAGE."
- **m11.** `GDD.md` ainda tem termos antigos; `validar.py` se apresenta como revisão 6 mas o comentário do topo diz "revisao 3"; identificadores internos com palavra antiga (decisão registrada); `prova_falsa` lista `c_peca` por fora do `grupoFonte`; etiqueta "MANUAL" em 6 grupos.
- **m12.** Console: 404 do `favicon.ico` em `museu/torre/` e, numa das cargas, em `sala/simulador/`. Nenhum arquivo do jogo falhou (0 resposta de erro em 5 páginas e nos minijogos).
- **m13.** O minijogo de atividade em dupla abre uma vez por atividade e por volta em cada aparelho; se a pessoa trocar de sala na mesma volta, vai direto para a palavra (comportamento esperado, só não está escrito).

**Registro (item 8)**
- **m14.** O registro foi salvo às 14:16; `game.js`, `style.css`, `sala/sala.css` e `sala/telao/telao.mjs` às 14:19 e os dados às 15:09. Tudo o que mudou nos dados está descrito; não há cópia guardada entre 14:16 e 15:09 para conferir o que entrou por último.

**Vocabulário e gênero (item 9)**
- **m15.** Aviso de aula encerrada: "O Professor encerrou a aula. Obrigado por participar!" (padrão de sala dos outros jogos; registrado em "Ficou para decidir").
- **m16.** "Simulador" e "Professor" aparecem na entrada como nomes do padrão de sala.

**Camada antiga (item 10)**
- **m17.** `sala/conteudo.js` e `game.js` ainda carregam as salas e pistas antigas; a tela filtra todas (13.255 filtradas, 0 mostrada).
- **m18.** `museu/torre/` sem `?loop=1` e `museu/` continuam mostrando o museu antigo (5 andares) para quem digitar o endereço; nenhum botão do jogo leva até lá.

## Fim do ciclo

A conferência técnica **não passou**. Faltam as 2 correções bloqueantes acima. B1 é só código e não mexe em texto. B2 tira uma frase do final conforme o caso: depois dela, a ordem das escalas manda voltar à etapa 1 para conferir a nota da história.
