# Mosaico Loop v4 (revisão 11): avaliação das seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliei do zero, sobre os dados e as telas da revisão 11 (`dados/pistas-v4.json` e `loop-central-dados.js`, os dois com "v4 revisão 11 (26/11/2026)", 281 pistas). Não editei nada no repositório; escrevi só em `/tmp/roda/esc/r10/`.

**O que li:** ESCALAS_AVALIACAO_JOGOS.md (inteiro); docs/FICHAS.md (inteiro, com a revisão 11); docs/DECISOES-V4.md ("Mundo", "Escada", "Regras e códigos" e as revisões 8 a 11 inteiras, com "Não aplicado" e "Ficou para decidir"); docs/ROTEIRO-LOOP.md (consulta pontual); pistas_legivel.txt (as 281 pistas, inteiro); atividades.txt (regras, papéis da volta 5, finais, frases de final); loop-central.js (`LC_MG`, `LC_INSC`/glifos, `lcResumoFinal`, `LC_FATO_PISTA`, `window.lcFatos`, `LC_MISSOES`); ritmo.js (`LOOP_CONVERSA`); sala/telao/telao.mjs (páginas do fim: Desfecho, A noite, Para conversar, Missões, Turma).

**O que conferi por script** (`/tmp/roda/esc/r10/pg/checa.py`, lista de arquivos em `pg/arquivos.txt`): os 34 ids da última tabela da ficha existem nos dados (zero faltando); 18 traços extremos em negrito; "Tá." só em `c_esc_3`, `cracha_3`, `coop_veredito` (Braga); "Desculpa" só em `d_teo_1` (Téo, escrito), `nico_0`, `nico_0b`, `nico_1` (Nico) e `dis_balde` (Seu Dirceu); "Fui eu" só em `teo_radio_2d` e `d_fus_2b` (Téo); as outras 7 frases "nunca diria" não aparecem em pista nenhuma; o nome "Lenz" só em pistas de volta 3 (`cracha_3`, `coop_veredito`, `v4_braga`, `lenz_2`); os 11 textos com letra do Téo terminam em "— T." e nenhum bilhete dele ficou sem assinatura; varredura de 101 arquivos .js, .mjs, .html, .json, .css e .svg fora de docs/ atrás de nomes de escala e de traço.

**O que vi na tela:** `r11/insc/` (livro com a tábua, minijogo aberto, com as opções só por posição e depois de um erro, Revelar com "O que foi feito: tem", caderno; testa da máscara 3D em zoom máximo, 390 e 360), `r11/vis/` (entrada individual com a frase do papel, telão, Máquina). As capturas cobrem o que mudou; não precisei abrir o servidor.

Aviso de autoavaliação: não escrevi nenhum texto do jogo. Mesmo assim, como 8 de 8 personagens saem com 5, reli de propósito cada fala procurando motivo para tirar ponto (registrado na justificativa de cada um).

---

## 1. Nota geral

**PASSA.** Seção 2: 5 de 5 itens passam. Seção 3.1: **5,0** (mínimo 4,5), ninguém abaixo de 4. Seção 3.2: **4,6** (mínimo 4,5). A revisão 11 fechou as duas ressalvas de fala da rodada anterior (Nico na tranca e Aurélio sobre a inscrição) e o ponto que mais segurava a Intrínseca (botões do minijogo com o desenho). A 3.2 não sobe de faixa porque continuam duas perguntas óbvias e o desfecho do celular sem os fatos da pessoa: essas três coisas estão em "Não aplicado" (pedem decisão do autor), mas **não** no "Ficou para decidir", então contei.

---

## 2. Tabela por critério

### 2.A Seção 2: checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md: os 8 têm papel, 5 traços, honestidade-humildade e as 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". Seu Dirceu registrado como figurante, sem necessidade e sem traço extremo. A revisão 11 não criou personagem. |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 de 18 com cena; os 34 ids da tabela existem nos dados. Conferido um a um (tabela 2.B). |
| Falas e ações não contradizem a ficha | **Passa** | coerente | Marcas de voz no lugar certo (ver "conferido por script"). `nico_1.porque` agora tem o tropeço da ficha ("Ele pediu... espera.", "E... o laudo!", "Desculpa."), e com o número ele para de pedir desculpa, como manda a exceção. `aurelio_1` ganhou "Na testa dela tem uma frase; eu sei de cor, nunca mais li.": pouca sensibilidade à privação e ansiedade, e explica por que ele não viu o símbolo virado, sem contradizer o "o que vê" (Galeria, peça, laudo). `v4_teo` "a mesma cara" combina com a inscrição e continua no jeito do Téo (peso e medida). Resta uma ressalva de acabamento (2.C). |
| Exceções registradas na ficha | **Passa** | completo | As 10 exceções batem com dados e código: Téo só escrito ou gravado; Nico sai da repetição só em `nico_1`; Dra. Sato só pelo interfone (`man_3`, `sato_teo`) e vê o céu; Aurélio no Ouro, na Galeria ("Obrigado por não esquecer."); Lenz com nome só da volta 3; Seu Dirceu e o "desde ontem" (`c_anc_3`), a noite do fusível (`d_teo_2`). A revisão 11 está registrada no fim da ficha. |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura limpa: só comentários de CSS ("rodada 3", "rodada 5 das escalas") e de game.js, que nenhuma tela mostra. "Escala" nos dados é a escala de crachás (objeto do mundo). `glifos.svg` sem texto de projeto. |

### 2.B Traço extremo e cena (conferido pista por pista)

| Pessoa | Traço extremo | Cena | Ok? |
|---|---|---|---|
| Aurélio | Ansiedade alta | `aurelio_0` ("Está linda, não está?" Ele não parece ter certeza), `falsa_1` (respira pela boca) | sim |
| Aurélio | Foge da lacuna | `aurelio_1` ("Eu demorei para acreditar." / "eu sei de cor, nunca mais li.") | sim |
| Aurélio | Não aguenta pressão | `aurelio_2` ("Disse a mim mesmo que era cansaço dele. Era medo meu.") | sim |
| Téo | Honestidade alta | `data_3`, `d_teo_1` ("Desculpa, Dra. Sato."), `d_fus_2b` ("Fui eu. — T."), `teo_radio` (o envelope recusado) | sim |
| Téo | Não larga a lacuna | `teo_d1` ("Sozinho pra quê?"), `v4_teo` ("Eu sei o que eu carrego.") | sim |
| Téo | Aceita risco | `teo_d3` ("Hoje à noite eu falo com ele."), `teo_radio` ("cara a cara") | sim |
| Ivone | Método | `ivone_1x` ("Eu não perco pote."), `v5_ivone` ("Limpei, pesei, devolvi: 4,2 kg.") | sim |
| Ivone | Pouca curiosidade pelas pessoas | `ivone_2` ("Devia ter perguntado por quê."), `ivone_red` (aponta sem olhar) | sim |
| Braga | Quer agradar | `traj_aviso` ("Pega um café, tá fresco"), `c_esc_3`, `cracha_3` ("Quer um café?"), `dis_cafe` | sim |
| Braga | Não aguenta pressão | `braga_1` (dá de ombros rápido demais), `v4_braga` (riscado duas vezes), `coop_veredito` (engole seco) | sim |
| Lenz | Pouca amabilidade | `lenz_0` (não espera a resposta), `lenz_1` ("Nem você."), `traj_2` (sem boa-noite) | sim |
| Lenz | Pouca honestidade | `lenz_2` ("Eu devolvo tudo que eu pego."), `cracha_2` | sim |
| Lenz | Não aguenta pressão | `traj_3` (fala sozinho na escada), `lenz_mot_3` ("ou eu não tenho mais empresa pra te pagar") | sim |
| Lenz | Busca risco | `v5_lenz` ("Peça por fora: +?", "ninguém confere a base") | sim |
| Dra. Sato | Abertura | `man_anc_2` ("Nunca aconteceu, mas vai que"), `man_2` ("Ou não.") | sim |
| Dra. Sato | Não larga a lacuna | `man_3` ("Me conta o que você viu com os seus olhos."), `a_hist_1`, `e_hist_1` ("Ninguém.") | sim |
| Nico | Pouca ordem | `nico_0b` (perde o fio), `nico_1.porque` (a regra sai aos tropeços), `fh_fusivelx` (fusível para a cafeteira) | sim |
| Nico | Muita atenção às pessoas | `nico_0` ("cara de quem não jantou", "a Ivone hoje tá brava"), `nico_0b` (o Braga e o cinto) | sim |

### 2.C Ressalvas (nenhuma derruba item)

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | `man_3`, respostas do interfone | 3 das 7 respostas seguem o molde "ou isto, ou aquilo" (`sint_carga`, `sint_luz`, o par). Combina com "não aceita palpite". | nenhuma correção necessária |
| — | `nico_1.porque` (ressalva 1 da rodada 9) | **Resolvida** na revisão 11. | — |
| — | Aurélio e a inscrição (ressalva 3 da rodada 9) | **Resolvida** em `aurelio_1`. | — |

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só por escrito, e só pode ser ele: peso e medida ("A peça tem a mesma cara e pesa diferente. Eu sei o que eu carrego.", `v4_teo`), frase curta ("Tinta não mente.", `teo_d3`), olho de montador ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`), a lista riscada até "falar com ele" (`fh_papel_teo`). Procurei frase genérica: não achei. |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada em toda fala: `lenz_0` ("rapidinho... Ótimo, ótimo."), `lenz_2` ("Eu devolvo tudo que eu pego." / "Lenz. Agora não."), `lenz_1` ("Nem você."), `b_hist_2` ("Cada litro de diesel sai do nosso bolso."). Nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Seca e com número: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone`, `dis_cafeira`. |
| Dra. Sato | 5,0 | 4 | Mais de 15 textos com o mesmo jeito: chama a máquina de "ela", devolve a pergunta, humor seco (`man_2` "Ou não.", `e_hist_1` "Ninguém.", `fh_ficha_bc` "Levar o guarda-chuva."), frase de rádio (`sato_teo`). O molde de 2.C-1 não pesa. |
| Seu Dirceu | 5,0 | 4 | Figurante com voz e objeto na mão: `traj_2` (aponta com o esfregão, "Nem boa-noite."), `ivone_ali_2` ("passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `assim_leg` ("Quem sujou meu chão?"), `d_teo_2` ("Eu reparo."), `dis_balde`, `arm_aviso`. |
| Braga | 5,0 | 4 | Fala muito e foge do assunto por três caminhos (a chuva e a porta em `traj_aviso`, o cunhado em `braga_1` e `c_esc_3`, o café); as três verdades começam com "Tá."; "ali do lado da limpeza" (`cracha_3`) é jeito de quem conhece o prédio de olho fechado. |
| Aurélio | 5,0 | 4 | Agora com margem: pergunta em vez de afirmar (`aurelio_0`, `aurelio_1` "Você também sentiu?"), palavra de acervo ("Peça de acervo não cheira a novo."; "Na testa dela tem uma frase"), foge da lacuna dita por ele mesmo ("eu sei de cor, nunca mais li."), desculpa sem a palavra (`aurelio_2` "Era medo meu."), agradecimento no Ouro sem sair da Galeria. A linha nova casa traço e enredo: é o motivo de ele não ter visto o símbolo virado. |
| Nico | 5,0 | 4 | Antes 4,5. Agora as três falas e a tranca têm o jeito dele: repara nas pessoas (`nico_0`, `nico_0b`), perde o fio e se repete ("eu já te disse isso?" duas vezes, como diz a exceção), a regra do Téo sai aos tropeços em `nico_1.porque`, e com o número ele "pisca, como quem acorda" e não pede desculpa: a mudança é sentida pela fala, sem nome de traço. Ainda é pouco texto (e só `nico_0` é certo na volta 1), mas o que existe não deixa dúvida de quem fala. |
| **Média (8 com fala)** | **5,0** | **4,5** | 40 ÷ 8 = 5,0. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 4,5 | O jogo puxa sozinho: o museu que esquece, gente que só muda de fala quando você mostra o caderno, tranca com frase do mundo, cofre com o registro de trás para a frente, pêndulo, gravador, O Raio, peças 3D com pontos. A revisão 11 deixou a inscrição inteira de verdade: a frase está **gravada na testa da máscara 3D** (legível no zoom máximo, `testa_390_zoom_max.png`), o Aurélio planta a curiosidade já na volta 1 ("Na testa dela tem uma frase"), o molde tem "a testa lisa" e o minijogo pede **só a posição** ("5º símbolo"...), então é preciso conferir a faixa com a tábua, símbolo por símbolo (`390x844_2b`). Falta para 5: duas perguntas que se resolvem por bom senso ou pela dica, sem pensar na noite: `falsa_1.antes` ("o que uma peça dessa idade mostraria?") e `c_peca` ("o que você sentiu diante da peça", com a dica "Peça de 300 anos não cheira a coisa nova"). `falsa_1.antes` está em "Não aplicado" (pede decisão do autor), não em "Ficou para decidir"; por isso contei. Errar sem custo (o que permite chutar as 4 posições) está em "Ficou para decidir" e não pesou. |
| Integrada | 5,0 | O papel aparece numa frase clara na entrada ("Nesta atividade você vive o papel de quem lembra das voltas. O museu esquece. Você e o seu caderno, não.", `r11/vis/03`). 8 missões secretas, nenhuma fechando com um toque no primeiro minuto (`LC_MISSOES`), página "Missões" no telão, "Quem trouxe" em cada fato, papéis da volta 5 com tarefa e dica própria. A escrita própria do Loop, agora entalhada na pedra, dá ao museu uma cultura que é só dele. |
| Identificada | 4,5 | O diagnóstico pede um raciocínio que a pessoa reconhece como dela (2 sinais de tipos diferentes + 1 leitura normal); o erro volta com o motivo; os finais por causa cobram a escolha; "Para conversar" deixa a pergunta de valor no telão ("Consertar a noite ou contar a verdade..."). A inscrição ensina a conferir com a fonte e entra no Revelar como prova ("O que foi feito: tem", `390x844_4`). Falta para 5 (igual às rodadas anteriores): o desfecho do celular (`lcResumoFinal`) mostra as 3 fichas e as 3 provas, mas não quais fatos da noite aquela pessoa trouxe (`window.lcFatos` existe e não é usado ali). Está em "Não aplicado" como B3 (pede decisão do autor), não em "Ficou para decidir": contei. |
| Externa (menos é melhor) | 1,5, invertida 4,5 | Sem ponto e sem ranking. A recompensa é +1 de energia, o nome no telão e o final. Errar o minijogo não custa nada ("Ainda não fechou. Olhe de novo...", `390x844_3`): isso está em "Ficou para decidir" e não pesou. Restos de formulário e voz de sistema: decisão registrada, não pesou. |
| Amotivação (menos é melhor) | 1,5, invertida 4,5 | A pessoa sempre sabe o que falta e por quê: frase do mundo em cada tranca (a da inscrição: "Sem estranhar a peça e sem a tábua para ler, é só enfeite."), "Falta: ..." nas atividades, três fichas de passo no Revelar. Pista que só vale da volta 2 some da lista na volta 1. O minijogo cabe sem rolar em 390×844 e 360×740; a tábua cabe inteira na leitura do livro (`390x844_1b`). O medidor do Pátio virou um objeto só. Sobra o de sempre: muita palavra de regra junta no Dossiê. A tábua custa 1 de energia na volta 1 e só serve na volta 2, mas o texto diz para que serve ("Para ler, use a tábua"). |
| **Nota da escala** | **4,6** | (4,5 + 5,0 + 4,5 + 4,5 + 4,5) ÷ 5 = 4,6. Mínimo 4,5. **Passa.** |

Introjetada: neutra, não pontua.

#### (a) Texto e dado × (b) mecânica, no que segura a 3.2

| O que segura | Tipo | Subescala |
|---|---|---|
| `c_peca`: pergunta e dica que entregam a resposta | (a) texto/dado | Intrínseca |
| `falsa_1.antes`: pergunta de bom senso | (a) texto/dado | Intrínseca |
| Desfecho do celular sem os fatos da pessoa (`lcResumoFinal`) | (b) mecânica (tela) | Identificada |
| Muita palavra de regra junta no Dossiê | (a) texto | Amotivação (não tira meio ponto sozinho) |

**O que não dá para julgar sem jogadores reais (não puni):**
- se 5 de energia diante de 5 a 19 itens por sala dá gosto de escolha ou sensação de falta, e se gastar 1 na tábua na volta 1, sem uso imediato, parece boa aposta;
- se a turma liga a tábua da Conservação à testa da máscara da Galeria sem ajuda, numa volta seguinte, e se a fala do Aurélio funciona como gancho;
- se alguém dá zoom na testa da máscara 3D e confere ali, ou só usa o minijogo;
- se o minijogo dá prazer de "achei" ou é rápido demais para ser lembrado;
- se alguém compara a cópia e a verdadeira no caderno (cartões separados);
- se gastar energia em item de ambiente (pares inocentes) parece "o museu é vivo" ou energia perdida;
- se girar a peça 3D e caçar os pontos dá prazer ou cansa em 15 salas;
- se os 10 segundos de caminhada criam tensão ou tédio;
- se falar em voz alta de salas diferentes funciona numa sala cheia;
- se alguém blefa a missão secreta na pausa;
- se a legenda do gravador é sentida como clima ou como espera; se o pêndulo vira graça ou briga;
- o ritmo das voltas 3 e 4 para quem já tem diagnóstico e ensaio;
- se a turma lê a fita do telão ou só o título do desfecho; se "Para conversar" abre conversa.

**Decisões em "Ficou para decidir" (DECISOES-V4): opcionais, não pesaram:**
- "tábua" com dois sentidos (chão de tábuas × tábua dos símbolos);
- resposta errada em minijogo não custa nada; entrada por papel nos consertos em dupla;
- piso de volta em `nico_1`, `cracha_3` e `lenz_2`; missão do Nico só possível da volta 4;
- "quem" e "por quê" quase inteiros na volta 1;
- restos de formulário e voz de sistema;
- a Dra. Sato e as voltas; por que quem joga lembra; Revelar só na volta 5 sem motivo no mundo; `d_teo_2` sem tranca, `aurelio_1` na volta 1, `man_cal_3`, o alarme das 2:40;
- aviso de aula encerrada em todos os jogos de sala.

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

**Nada ficou abaixo do mínimo.** O que dá mais margem na 3.2 (nenhum necessário para passar):

### (a) Texto e dado

**A1. `LC_MG.c_peca` (uns 20 palavras).** Trocar a pergunta de sentido por uma que use outra pista da noite, por exemplo: "Qual das caixas da estante pesa mais do que diz a etiqueta?" com opções tiradas de `c_esc_1` / `lenz_meio_1` ("BANNERS – NÃO ABRIR", lâmpadas, gesso, lista de entregas), e tirar a dica "Peça de 300 anos não cheira a coisa nova". Pede o teste de tela.

**A2. `LC_MG.falsa_1.antes` (uns 15 palavras; já pede decisão do autor).** Mesma proposta da rodada 9: perguntar o que o caderno diz da verdadeira por fora (`foto_solo`, `coop_copia_ok`), só se a pessoa já tiver a foto; senão, manter.

### (b) Mecânica

**B3. Fatos da pessoa no desfecho do celular** (`lcResumoFinal`, já pede decisão do autor). Mostrar, abaixo das 3 provas, quais fatos da fita vieram do caderno dela (`window.lcFatos()`, pronto). É tela, não regra. É o que leva a Identificada a 5.

Com A1 e B3, a 3.2 iria a (5 + 5 + 5 + 4,5 + 4,5) ÷ 5 = 4,8. A1 e A2 mexem em minijogo (teste de tela); B3 mexe em tela. Nenhum muda enredo nem regra.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (r9, sobre a rev. 10) | Agora (r10, sobre a rev. 11) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem personagem novo. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | 34 ids conferidos por script; `nico_1.porque` virou mais uma cena de pouca ordem. |
| 2.4 falas não contradizem a ficha | Passa (3 ressalvas) | Passa (1 ressalva) | Saíram a do `nico_1.porque` e a do Aurélio sem fala sobre a inscrição; fica só o molde do interfone. |
| 2.4 exceções registradas | Passa | Passa | Revisão 11 registrada na ficha. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa em 101 arquivos. |
| Téo | 5,0 | 5,0 | Sem mudança de fala. |
| Lenz | 5,0 | 5,0 | Sem mudança. |
| Ivone | 5,0 | 5,0 | Sem mudança. |
| Dra. Sato | 5,0 | 5,0 | Sem mudança. |
| Seu Dirceu | 5,0 | 5,0 | Sem mudança. |
| Braga | 5,0 | 5,0 | Sem mudança. |
| Aurélio | 5,0 (margem curta) | 5,0 (com margem) | "Na testa dela tem uma frase; eu sei de cor, nunca mais li." |
| Nico | 4,5 | **5,0** | Tranca com o tropeço da ficha. |
| **3.1 média** | **4,9** (4,94) | **5,0** | Passa. |
| Intrínseca | 4,5 | 4,5 | Sobe por dentro (testa gravada em 3D, gancho do Aurélio, testa lisa do molde, botões só por posição), mas ficam `c_peca` e `falsa_1.antes`. |
| Integrada | 5,0 | 5,0 | Sem mudança. |
| Identificada | 4,5 | 4,5 | Desfecho do celular ainda sem os fatos da pessoa (B3). |
| Externa (bruta) | 1,5 | 1,5 | Sem mudança. |
| Amotivação (bruta) | 1,5 | 1,5 | Minijogo e tábua cabem sem rolar; medidor do Pátio num objeto só; nada novo pesa. |
| **3.2 nota** | **4,6** | **4,6** | Passa. |

Nenhuma nota caiu.

## 5. Fim do ciclo

**As escalas das seções 2 e 3 passaram.** Seção 2: 5 de 5. Seção 3.1: 5,0. Seção 3.2: 4,6. As outras seções (história, conferência técnica, peças) não fazem parte desta avaliação.
