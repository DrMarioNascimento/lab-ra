# Mosaico Loop v4 (revisão 13): avaliação das seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliação feita do zero sobre os dados e as telas da revisão 13. `dados/pistas-v4.json` e `loop-central-dados.js` dizem os dois "v4 revisão 13 (26/11/2026)", com 281 pistas; `/tmp/roda/v4_pistas.json`, de onde sai `pistas_legivel.txt`, é idêntico ao do repositório (conferido com `cmp`). Não editei nada no repositório. Escrevi só em `/tmp/roda/esc/rod11/`.

**O que li:** ESCALAS_AVALIACAO_JOGOS.md (inteiro); docs/FICHAS.md (inteiro); DECISOES-V4.md, revisões 10 a 13 inteiras (com "Não aplicado" e "Ficou para decidir"); as 281 pistas com todos os campos de texto (`rod11/pg/compacto.txt`, que inclui `porque`, `textoPorSintoma`, `textoPorPar`, `textoPorCausa`); finais e papéis da volta 5 (`finais`, `papeis_volta5`); loop-central.js (`LC_MG`, `LC_MGA`, `lcResumoFinal`, `LC_FATO_PISTA`/`window.lcFatos`, `LC_MISSOES`, papéis); ritmo.js (`LOOP_CONVERSA`); manual de entrada (`TOUR` em game.js); descrições das salas (`game.js` 157–162); páginas de fim do telão (`sala/telao/telao.mjs`: Desfecho, A noite, Para conversar, Missões, Turma).

**O que conferi por script** (`rod11/pg/checa.py`, saída em `rod11/pg/checa_saida.txt`, lista de arquivos em `rod11/pg/arquivos.txt`):
- os 34 ids da última tabela da ficha existem nos dados (nenhum faltando); 18 traços extremos em negrito (as 21 marcas em negrito incluem as 3 da legenda A/M/B);
- "Tá." só em `c_esc_3`, `cracha_3` e `coop_veredito` (Braga);
- "Desculpa" só em `d_teo_1` (Téo, por escrito), `nico_0`, `nico_0b`, `nico_1` (Nico) e `dis_balde` (Seu Dirceu, bilhete);
- "Fui eu" só em `teo_radio_2d` e `d_fus_2b` (Téo). As outras 7 frases de "nunca diria" não aparecem em pista nenhuma;
- o nome "Lenz" só aparece em pistas da volta 3 em diante (`cracha_3`, `coop_veredito`, `v4_braga`, `lenz_2`);
- os 11 textos com a letra do Téo terminam em "— T.", e nenhum bilhete dele ficou sem assinatura;
- varredura de 106 arquivos .js, .mjs, .html, .json, .css, .svg e .txt fora de docs/ atrás de nomes de escala e de traço.

**O que vi na tela:** `r12/vis/` (03 entrada individual com a frase do papel, 04 planta com orelhas, 06 lista da sala, 09 Dossiê, 10 Revelar, 14 telão) e `r12/extra/` (`luz_antes_390`: pergunta nova de `falsa_1.antes`; `luz_achou_390`: imagem da luz com a máscara e a inscrição). As capturas cobrem o que mudou nas revisões 12 e 13. Não precisei gerar outras.

Aviso de autoavaliação: não escrevi nenhum texto do jogo. Mesmo assim, 8 de 8 personagens saem com 5. Por isso reli de propósito cada fala procurando motivo para tirar ponto, e o que achei está na justificativa de cada um.

---

## 1. Nota geral

**PASSA.** Seção 2: os 5 itens passam. Seção 3.1: **5,0** (mínimo 4,5), ninguém abaixo de 4. Seção 3.2: **4,6** (mínimo 4,5). A revisão 13 não mexeu em fala de personagem. Nos minijogos, melhorou sem mudar de faixa: a dica de `c_peca` não entrega mais a resposta e `falsa_1.antes` agora manda olhar o que a pessoa leu. As duas perguntas ainda se resolvem sem pensar na noite. O desfecho do celular continua sem os fatos da pessoa (B3, em "Não aplicado", não em "Ficou para decidir"): contei.

---

## 2. Tabela por critério

### 2.A Seção 2: checklist 2.4 (passa / não passa)

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md: os 8 têm papel, 5 traços, honestidade-humildade e as 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". Seu Dirceu está registrado como figurante, sem necessidade e sem traço extremo. As revisões 12 e 13 não criaram personagem. |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 de 18 com cena, conferidos pista por pista (tabela 2.B). Os 34 ids existem. |
| Falas e ações não contradizem a ficha | **Passa** | coerente | As marcas de voz estão no lugar certo (ver a lista acima). Alguns exemplos: Ivone fala de parte do dia e de quantidade, nunca de hora (`ivone_1x` "no fim da tarde", `v5_ivone` "de manhã… 4,2 kg"). O Lenz nunca fala da peça como arte e entende a Câmara errado (`traj_3` "Só preciso de cinco minutos de volta"; `rev_3` "então apaga?"). A Dra. Sato só reage ao que ouve pelo interfone (`man_3`, `sato_teo`). O Seu Dirceu fala de pano ou esfregão na mão (`traj_2`, `d_teo_2`, `c_anc_3`, `dirceu_0`, `ivone_ali_2`). O que a revisão 13 cortou (frases de narrador em `insc_verdadeira`, `chao_peca` e `mancha_2`, cadeira "longe da bancada", "Dá para ouvir a chuva fina") não é fala de ninguém e não contradiz ficha nenhuma. O manual de entrada só cita falas que existem (`aurelio_0`, `traj_aviso`). Resta uma ressalva de acabamento (2.C). |
| Exceções registradas na ficha | **Passa** | completo | As 10 exceções batem com dados e código. O Téo só aparece por escrito ou gravado (diário, bilhetes, `teo_radio*`). O Nico só sai da repetição em `nico_1` (volta 4, "Pela primeira vez ele não pede desculpa"). A Dra. Sato fica fora do prédio e vê o céu (`man_3`, `sato_teo`, Raio). O Aurélio fica na Galeria no Ouro ("Obrigado por não esquecer.", depois que a notícia sobe). O nome do Lenz só aparece da volta 3, pelos três caminhos. O "desde ontem" do Seu Dirceu é o dia de ontem (`c_anc_3`). Na noite do fusível, o Seu Dirceu conta o que viu sem saber o que era (`d_teo_2`). O Téo não prevê o reinício (`abre_1` e `v4_teo` falam da montagem e da exposição). |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura limpa. Só aparecem comentários de CSS ("rodada 3", "rodada 5 das escalas", em bancada.css, style.css e sala.css), que nenhuma tela mostra. "Fichas" aparece como objeto do mundo (fichas de ensaio, fichas de movimentação) e como nome de componente de tela. "Escala" nos dados é a escala de crachás. |

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
| Ivone | Pouca curiosidade pelas pessoas | `ivone_2` ("Devia ter perguntado por quê."), `ivone_red` (aponta a porta sem olhar) | sim |
| Braga | Quer agradar | `traj_aviso` ("Pega um café, tá fresco"), `c_esc_3`, `cracha_3` ("Quer um café?"), `dis_cafe` | sim |
| Braga | Não aguenta pressão | `braga_1` (dá de ombros rápido demais), `v4_braga` (riscado duas vezes), `coop_veredito` (engole seco) | sim |
| Lenz | Pouca amabilidade | `lenz_0` (não espera a resposta), `lenz_1` ("Nem você."), `traj_2` (sem boa-noite), `traj_3` (sai sem olhar) | sim |
| Lenz | Pouca honestidade | `lenz_2` ("Eu devolvo tudo que eu pego."), `cracha_2` | sim |
| Lenz | Não aguenta pressão | `traj_3` (fala sozinho na escada), `lenz_mot_3` ("ou eu não tenho mais empresa pra te pagar") | sim |
| Lenz | Busca risco | `v5_lenz` ("Peça por fora: +?", "ninguém confere a base") | sim |
| Dra. Sato | Abertura | `man_anc_2` ("Nunca aconteceu, mas vai que"), `man_2` ("Ou não.") | sim |
| Dra. Sato | Não larga a lacuna | `man_3` ("Me conta o que você viu com os seus olhos."), `a_hist_1`, `e_hist_1` ("Ninguém.") | sim |
| Nico | Pouca ordem | `nico_0b` (perde o fio), `nico_1.porque` (a regra do Téo sai aos tropeços), `fh_fusivelx` (fusível para a cafeteira) | sim |
| Nico | Muita atenção às pessoas | `nico_0` ("cara de quem não jantou", "a Ivone hoje tá brava"), `nico_0b` (o Braga e o cinto) | sim |

### 2.C Ressalvas (nenhuma derruba item)

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | `man_3`, respostas do interfone | 3 das 7 respostas seguem o molde "ou isto, ou aquilo" (`sint_carga`, `sint_luz` e o par). Combina com "não aceita palpite". | menor, nenhuma correção necessária |

### 3.1 Big Five do conteúdo (1 a 5 por personagem com fala)

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só aparece por escrito ou gravado, e só pode ser ele: peso e medida ("A peça tem a mesma cara e pesa diferente. Eu sei o que eu carrego.", `v4_teo`), frase curta ("Tinta não mente.", `teo_d3`), olho de montador ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`), a lista riscada até "falar com ele" (`fh_papel_teo`). Procurei frase genérica e não achei. |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada em toda fala: `lenz_0` ("rapidinho… Ótimo, ótimo."), `lenz_2` ("Eu devolvo tudo que eu pego." / "Lenz. Agora não."), `lenz_1` ("Nem você."), `lenz_mot_3` (engole o fim das frases), `b_hist_2` ("Cada litro de diesel sai do nosso bolso."). |
| Ivone | 5,0 | 4 | Seca e com número: `ivone_1x` ("Pote 7, vermelho… Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone` (letra miúda e reta, 4,2 kg), `dis_cafeira`. |
| Dra. Sato | 5,0 | 4 | Mais de 15 textos no mesmo jeito: chama a máquina de "ela", devolve a pergunta, humor seco (`man_2` "Ou não.", `e_hist_1` "Ninguém.", `fh_ficha_bc` "Levar o guarda-chuva."), frase de rádio (`sato_teo`). O molde de 2.C-1 não pesa. |
| Seu Dirceu | 5,0 | 4 | Figurante com voz e objeto na mão: `traj_2` (aponta com o esfregão, "Nem boa-noite."), `ivone_ali_2` ("passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `dirceu_0` ("Amanhã ninguém lembra quem limpou."), `assim_leg` ("Quem sujou meu chão?"), `d_teo_2` ("Eu reparo."). |
| Braga | 5,0 | 4 | Fala muito e foge do assunto por três caminhos: a chuva e a porta (`traj_aviso`), o cunhado (`braga_1`, `c_esc_3`) e o café. As três verdades começam com "Tá.", e "ali do lado da limpeza" (`cracha_3`) é jeito de quem conhece o prédio. |
| Aurélio | 5,0 | 4 | Pergunta em vez de afirmar (`aurelio_0`; `aurelio_1` "Você também sentiu?"), usa palavra de acervo ("Peça de acervo não cheira a novo."), foge da lacuna com as próprias palavras ("eu sei de cor, nunca mais li."), pede desculpa sem dizer a palavra (`aurelio_2` "Era medo meu."), agradece no Ouro sem sair da Galeria. |
| Nico | 5,0 | 4 | Repara nas pessoas antes de falar de si (`nico_0`, `nico_0b`), perde o fio e se repete ("eu já te disse isso?" duas vezes), e a regra do Téo sai aos tropeços (`nico_1.porque`). Com o número, ele "pisca, como quem acorda" e não pede desculpa: a mudança se sente pela fala. Procurando motivo para descontar, só achei o pouco texto: na volta 1, só `nico_0` é certo. Mas a escala mede se a personalidade se reconhece, e em todo o texto que existe não há dúvida de quem fala. |
| **Média (8 com fala)** | **5,0** | **4,5** | 40 ÷ 8 = 5,0. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo (1 a 5)

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 4,5 | O jogo puxa sozinho: o museu que esquece, gente que só muda de fala quando você mostra o caderno, tranca com frase do mundo, cofre com o registro de trás para a frente, pêndulo, gravador, O Raio, peças 3D com pontos e a inscrição gravada na testa da máscara (o minijogo pede só a posição). A planta da revisão 12 dá ao prédio uma geografia que se lê com o olho (pegadas da Sala das coleções até a porta de serviço, armário ao lado da Base da limpeza). **Falta para 5:** `c_peca` pergunta "o que você sentiu diante da peça" quando a pista só abre com `falsa_1` no caderno, e a dica agora diz "No caderno, procure a pista 'A peça principal'". A revisão 13 tirou a resposta da dica, mas a pergunta continua sendo de lembrar, não de deduzir. `falsa_1.antes` ("o que a luz de lado deveria mostrar?") ganhou o apoio do caderno e do Dicionário, mas ainda se resolve por bom senso (coisa velha tem desgaste) (`r12/extra/luz_antes_390.png`). Errar sem custo está em "Ficou para decidir" e não pesou. |
| Integrada | 5,0 | O papel aparece numa frase clara na entrada ("Nesta atividade você vive o papel de quem lembra das voltas. O museu esquece. Você e o seu caderno, não.", `r12/vis/03`). 8 missões secretas (`LC_MISSOES`), página "Missões" no telão, papéis da volta 5 com dica própria em segunda pessoa, "Para conversar" no fim. A escrita própria do Loop dá ao museu uma cultura que é só dele. |
| Identificada | 4,5 | O diagnóstico pede um raciocínio que a pessoa reconhece como dela (2 sinais de tipos diferentes + 1 leitura normal), e o erro volta com o motivo. Os finais por causa cobram a escolha (por exemplo, D: "Você religou sem mostrar a verdade a ninguém. A manhã chega, limpa demais."). "Para conversar" deixa a pergunta de valor no telão (`LOOP_CONVERSA`). A inscrição ensina a conferir com a fonte. **Falta para 5:** o desfecho do celular (`lcResumoFinal`) mostra as 3 fichas e as 3 provas, mas não quais fatos da noite a pessoa trouxe (`window.lcFatos` existe e não é usado ali). Está em "Não aplicado" na revisão 13 (fica para o autor), não em "Ficou para decidir": contei. |
| Externa (menos é melhor) | 1,5 (invertida 4,5) | Não há ponto nem ranking. A recompensa é +1 de energia, o nome no telão e o final. Errar o minijogo não custa nada ("Ficou para decidir", não pesou). Restos de formulário e voz de sistema: decisão registrada, não pesou. |
| Amotivação (menos é melhor) | 1,5 (invertida 4,5) | A pessoa sempre sabe o que falta e por quê: frase do mundo em cada tranca, "Falta: …" nas atividades, as três fichas de passo no Revelar (`r12/vis/10`: "falta", com dica de onde olhar). A planta nova diz "Você está aqui" e "Para onde você vai" e abre no andar certo (`r12/vis/04`). Pista que só vale da volta 2 some da lista na volta 1. Sobra o de sempre: muita palavra de regra junta no Dossiê (`r12/vis/09`). |
| **Nota da escala** | **4,6** | (4,5 + 5,0 + 4,5 + 4,5 + 4,5) ÷ 5 = 4,6. Mínimo 4,5. **Passa.** |

Introjetada: neutra, não pontua.

#### O que segura a 3.2: (a) texto e dado × (b) mecânica

| O que segura | Tipo | Subescala |
|---|---|---|
| `c_peca`: pergunta de lembrar, com a dica apontando a pista | (a) texto/dado | Intrínseca |
| `falsa_1.antes`: pergunta de bom senso | (a) texto/dado | Intrínseca |
| Desfecho do celular sem os fatos da pessoa (`lcResumoFinal`) | (b) mecânica (tela) | Identificada |
| Muita palavra de regra junta no Dossiê | (a) texto | Amotivação (sozinho, não tira meio ponto) |

**O que só jogadores reais mostrariam (não puni):**
- se 5 de energia diante de 5 a 19 itens por sala dá gosto de escolha ou sensação de falta; se gastar 1 na tábua na volta 1, sem uso imediato, parece boa aposta;
- se a turma liga sozinha a tábua da Conservação à testa da máscara da Galeria, numa volta seguinte, e se a fala do Aurélio funciona como gancho;
- se alguém dá zoom na testa da máscara 3D (agora com o zoom indo para onde está o dedo) e confere ali, ou só usa o minijogo;
- se a imagem da luz com a inscrição chama a atenção para a testa antes da hora ou passa como cenário;
- se o minijogo da inscrição dá prazer de "achei" ou é rápido demais para ser lembrado;
- se a planta com orelhas faz a turma pensar no trajeto do culpado (pegadas, porta de serviço) ou é só navegação;
- se gastar energia em item de ambiente (pares inocentes) parece "o museu é vivo" ou energia perdida;
- se girar a peça 3D e caçar os pontos dá prazer ou cansa em 15 salas; se os 10 segundos de caminhada criam tensão ou tédio;
- se falar em voz alta de salas diferentes funciona numa sala cheia; se alguém blefa a missão secreta na pausa;
- se a legenda do gravador é sentida como clima ou como espera; se o pêndulo vira graça ou briga;
- o ritmo das voltas 3 e 4 para quem já tem diagnóstico e ensaio;
- se a turma lê a fita do telão ou só o título do desfecho; se "Para conversar" abre conversa.

**Em "Ficou para decidir" (DECISOES-V4), opcionais, não pesaram:** "tábua" com dois sentidos; resposta errada em minijogo sem custo; entrada por papel nos consertos em dupla; piso de volta em `nico_1`, `cracha_3` e `lenz_2`; missão do Nico só possível na volta 4; "quem" e "por quê" quase inteiros na volta 1; restos de formulário e voz de sistema; a Dra. Sato e as voltas; por que quem joga lembra; Revelar só na volta 5; `d_teo_2` sem tranca, `aurelio_1` na volta 1, `man_cal_3`, o alarme das 2:40; a disposição das salas da planta e o papel sobrando no 2º andar e no Subsolo; aviso de aula encerrada em todos os jogos de sala.

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

**(a) Obrigatórias para o mínimo: nenhuma.** Nada ficou abaixo do mínimo e não há falha que bloqueie.

**(b) Retoques opcionais (dão margem; nenhum é necessário para passar):**

- **A1. `LC_MG.c_peca` (umas 20 palavras).** Trocar a pergunta de lembrar por uma que cruze outra pista, por exemplo "Qual das caixas da estante pesa mais do que diz a etiqueta?", com opções tiradas de `c_esc_1` e `lenz_meio_1` ("BANNERS – NÃO ABRIR", lâmpadas, gesso, lista de entregas). Pede teste de tela.
- **A2. `LC_MG.falsa_1.antes` (umas 15 palavras).** Fazer a pergunta depender de algo do caderno que não é bom senso: por exemplo, o peso (`v5_ivone` 4,2 kg; `falsa_2` "mais leve") ou o lado da rachadura na foto (`tombo_2`/`par_foto`), só quando a pessoa já tem a pista.
- **A3. Imagem da luz × texto (menor).** Em `luz_achou_390.png`, a máscara aparece fosca e granulada, com a faixa de luz de lado, e a frase embaixo diz "O verniz brilha por igual, de ponta a ponta." A revisão 13 decidiu manter isso ("efeito de luz rasante"), mas na tela o grão da pedra fica mais visível que o brilho. Se o autor quiser, basta um reflexo mais forte na imagem ou a frase "Sob a luz de lado, o verniz cobre tudo por igual: nenhum risco, nenhum desgaste." É mais da escala visual e da história do que desta, e não pesou na nota.
- **B3. Fatos da pessoa no desfecho do celular** (`lcResumoFinal`, já fica para o autor): mostrar, abaixo das 3 provas, quais fatos da fita vieram do caderno dela (`window.lcFatos()`, pronto). É tela, não regra. É o que leva a Identificada a 5.

Com A1 e B3, a 3.2 iria a (5 + 5 + 5 + 4,5 + 4,5) ÷ 5 = 4,8. Nenhum desses retoques muda enredo nem regra.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (rodada 10, sobre a rev. 11) | Agora (rodada 11, sobre a rev. 13) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem personagem novo. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | 34 ids conferidos por script. |
| 2.4 falas não contradizem a ficha | Passa (1 ressalva) | Passa (1 ressalva) | A revisão 13 não mexeu em fala. Os cortes de narrador e as frases de sala não tocam em personagem. |
| 2.4 exceções registradas | Passa | Passa | Sem exceção nova. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa em 106 arquivos. |
| Téo | 5,0 | 5,0 | Sem mudança. |
| Lenz | 5,0 | 5,0 | Sem mudança. |
| Ivone | 5,0 | 5,0 | Sem mudança. |
| Dra. Sato | 5,0 | 5,0 | Sem mudança. |
| Seu Dirceu | 5,0 | 5,0 | Sem mudança. |
| Braga | 5,0 | 5,0 | Sem mudança. |
| Aurélio | 5,0 | 5,0 | Sem mudança. |
| Nico | 5,0 | 5,0 | Sem mudança. |
| **3.1 média** | **5,0** | **5,0** | Passa. |
| Intrínseca | 4,5 | 4,5 | Melhora por dentro: a dica de `c_peca` não dá mais a resposta, `falsa_1.antes` usa o caderno e o Dicionário, a imagem da luz tem a inscrição e há a planta. Mas as duas perguntas ainda não pedem dedução. |
| Integrada | 5,0 | 5,0 | Sem mudança. |
| Identificada | 4,5 | 4,5 | B3 não aplicado (fica para o autor). |
| Externa (bruta) | 1,5 | 1,5 | Sem mudança. |
| Amotivação (bruta) | 1,5 | 1,5 | A planta orienta melhor ("Você está aqui", "Para onde você vai"), mas o Dossiê continua com muita palavra de regra. |
| **3.2 nota** | **4,6** | **4,6** | Passa. |

Nenhuma nota caiu.

## 5. Fim do ciclo

**As escalas das seções 2 e 3 passaram.** Seção 2: 5 de 5. Seção 3.1: 5,0. Seção 3.2: 4,6. As outras seções (história, conferência técnica, peças) não fazem parte desta avaliação.
