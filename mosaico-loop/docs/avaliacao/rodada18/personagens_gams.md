# Mosaico Loop v4 (revisão 16): avaliação das seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliei do zero sobre a revisão 16 (`dados/pistas-v4.json`: "v4 revisão 16 (26/11/2026)", 281 pistas). Não abri navegador e não editei nada no repositório. Escrevi só em `/tmp/roda/esc/rod18/`.

**O que li:** ESCALAS_AVALIACAO_JOGOS.md (inteiro); docs/FICHAS.md (inteiro); DECISOES-V4.md, revisões 14 a 16 inteiras (com "Não aplicado" e "Ficou para decidir"); as 281 pistas inteiras, com `finais`, `papeis_volta5`, `atividades_coop`, `regras`, `trancas` (gerei de novo do repositório em `rod18/pg/pistas_legivel.txt`); loop-central.js (`LC_MG`, `LC_MGA`, `LC_MG_ERRO`, `LC_FATO_PISTA`, `LC_MISSOES`, papéis da volta 5); ritmo.js (`LOOP_FINAIS`, `LOOP_CONVERSA`, `LOOP_LINHA`); a frase do papel na entrada (`individual.html`, `sala/index.html`).

**O que mudou desde a última avaliação destas seções** (`rod18/pg/diff.py`, saída em `rod18/pg/diff.txt`, comparando com `pistas-v4.json_SUBSTITUIDO_2026-11-26f`, que é a revisão 14): nenhuma pista entrou ou saiu; mudaram 4 textos: `maq_ver` (narrador, sem algarismos), `falsa_3` (folha com a foto do catálogo impressa ao contrário), `c_esc_3` (Braga: "duas caixas de banners iguais") e `coop_copia_ok` ("a cor", sem "da pedra"); mais a tela A do Lado a Lado ("cor cinza, mais clara"). Fora dos dados: `LC_MG.falsa_1.antes` (pergunta nova de previsão) e `falsa_1.luz.achou` ("até o grão").

**O que conferi por script** (`rod18/pg/checa.py`, saída em `rod18/pg/checa.txt`): os 34 ids da tabela "Onde cada traço extremo aparece" existem nos dados (nenhum falta); 18 traços extremos em negrito. "Tá." só em `c_esc_3`, `cracha_3`, `coop_veredito` (Braga; a Dra. Sato nunca diz). "Desculpa" só em `d_teo_1` (Téo, escrito), `nico_0`, `nico_0b`, `nico_1` e `dis_balde` (Seu Dirceu, escrito). Das 8 frases de "nunca diria", só "Fui eu" aparece, em `teo_radio_2d` e `d_fus_2b`, as duas do Téo (é a frase proibida do Lenz, e o Lenz não a diz). Os 11 textos com a letra do Téo terminam em "— T.". O nome "Lenz" só aparece em pistas da volta 3 em diante (`cracha_3`, `coop_veredito`, `v4_braga`, `lenz_2`). Varri 117 arquivos fora de docs/ atrás de nomes de escala e de traço: só achei comentários de CSS ("rodada 3", "rodada 5 das escalas"), comentários de código em game.js, README/GDD (documentos de projeto, não são tela), variáveis técnicas de escala 3D e "escala de crachás" (objeto do mundo).

**O que vi nas capturas (sem navegador):** `r15/cap/luz_antes_390` (pergunta nova antes da luz, 4 opções, imagens GAL_B e foto), `r15/cap/luz_pos3_390` (frase "O verniz cobre tudo por igual, até o grão. Nenhuma borda gasta, nenhum risco de uso." com a máscara), `r15/cap/desfecho_390` ("O que o seu caderno trouxe · 6 de 9 fatos", ficha "A cópia na Galeria" com a miniatura GAL_B). Juntas, cobrem tudo o que a revisão 16 mudou e que pesa nestas seções.

Aviso de autoavaliação: não escrevi nenhum texto do jogo. Como 8 de 8 personagens saem com 5, reli cada fala procurando motivo para tirar ponto; o que achei está nas justificativas.

---

## 1. Nota geral

**PASSA.** Seção 2: 5 de 5 itens. Seção 3.1: **5,0** (mínimo 4,5), ninguém abaixo de 4. Seção 3.2: **4,8** (mínimo 4,5). A única fala de personagem que mudou (`c_esc_3`, do Braga) manteve a voz. A 3.2 sobe 0,1 porque `falsa_1.antes` deixou de ser cópia de `par_foto` e virou previsão que a luz confirma ou desmente.

---

## 2. Tabela por critério

### 2.A Seção 2: checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md: os 8 têm papel, 5 traços, honestidade-humildade e 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". Seu Dirceu está registrado como figurante. A revisão 16 não criou personagem. |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 de 18 com cena; os 34 ids existem (tabela 2.B). |
| Falas e ações não contradizem a ficha | **Passa** | coerente | As marcas de voz estão no lugar certo e nenhum personagem diz a própria frase de "nunca diria". A Dra. Sato só fala pelo interfone ou por escrito e só vê o céu. O Téo só aparece escrito ou gravado. A Ivone fala de parte do dia e de quantidade. No Ouro, o Aurélio fica na Galeria. `c_esc_3` continua começando com "Tá." e fugindo para o cunhado e o café. A planta nova bate com `ivone_red` (a porta de vidro dá para a Área de descanso, e da Base da limpeza o Seu Dirceu vê essa porta) e com `traj_2`. Ressalva menor em 2.C. |
| Exceções registradas na ficha | **Passa** | completo | As 10 exceções batem com os dados: Téo; Nico em `nico_1` só da volta 4; Dra. Sato no interfone e confiança só para informação; ninguém lembra das voltas; o "desde ontem" do Seu Dirceu (`c_anc_3`); Aurélio no Ouro; Téo não prevê o reinício; nome do Lenz da volta 3; Seu Dirceu na noite do fusível (`d_teo_2`). A folha espelhada de `falsa_3` não é fala de ninguém e não pede registro. |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura de 117 arquivos limpa (ver acima). As telas novas (pergunta antes da luz, ficha da cópia) só usam palavras do mundo. |

### 2.B Traço extremo e cena (conferido pista por pista)

| Pessoa | Traço extremo | Cena | Ok? |
|---|---|---|---|
| Aurélio | Neuroticismo alto | `aurelio_0` ("Está linda, não está?" Ele não parece ter certeza), `falsa_1` (respira pela boca) | sim |
| Aurélio | Sensibilidade à privação baixa | `aurelio_1` ("Eu demorei para acreditar." / "eu sei de cor, nunca mais li.") | sim |
| Aurélio | Tolerância ao estresse baixa | `aurelio_2` ("Disse a mim mesmo que era cansaço dele. Era medo meu.") | sim |
| Téo | Honestidade alta | `data_3`, `d_teo_1` ("Desculpa, Dra. Sato."), `d_fus_2b` ("Fui eu. — T."), `teo_radio` (recusou o envelope) | sim |
| Téo | Sensibilidade à privação alta | `teo_d1` ("Sozinho pra quê?"), `v4_teo` ("Eu sei o que eu carrego.") | sim |
| Téo | Busca de emoção alta | `teo_d3` ("Hoje à noite eu falo com ele."), `teo_radio` ("cara a cara") | sim |
| Ivone | Conscienciosidade alta | `ivone_1x` ("Eu não perco pote."), `v5_ivone` ("Limpei, pesei, devolvi: 4,2 kg.") | sim |
| Ivone | Curiosidade social baixa | `ivone_2` ("Devia ter perguntado por quê."), `ivone_red` (aponta sem olhar) | sim |
| Braga | Amabilidade alta | `traj_aviso` ("Pega um café, tá fresco"), `c_esc_3` ("Café?"), `cracha_3` ("Quer um café?"), `dis_cafe` | sim |
| Braga | Tolerância ao estresse baixa | `braga_1` (dá de ombros rápido demais), `v4_braga` (riscado duas vezes), `coop_veredito` (engole seco) | sim |
| Lenz | Amabilidade baixa | `lenz_0` (não espera a resposta), `lenz_1` ("Nem você."), `traj_3` (sai sem olhar) | sim |
| Lenz | Honestidade baixa | `lenz_2` ("Eu devolvo tudo que eu pego."), `cracha_2` | sim |
| Lenz | Tolerância ao estresse baixa | `traj_3` (fala sozinho na escada), `lenz_mot_3` ("ou eu não tenho mais empresa pra te pagar") | sim |
| Lenz | Busca de emoção alta | `v5_lenz` ("Peça por fora: +?", "ninguém confere a base") | sim |
| Dra. Sato | Abertura alta | `man_anc_2` ("Nunca aconteceu, mas vai que"), `man_2` ("Ou não.") | sim |
| Dra. Sato | Sensibilidade à privação alta | `man_3` ("Me conta o que você viu com os seus olhos."), `a_hist_1`, `e_hist_1` ("Então ninguém liga isto sem mim. Ninguém.") | sim |
| Nico | Conscienciosidade baixa | `nico_0b` (perde o fio), `nico_1.porque` (a regra sai aos tropeços), `fh_fusivelx` (fusível para a cafeteira) | sim |
| Nico | Curiosidade social alta | `nico_0` ("cara de quem não jantou", "a Ivone hoje tá brava"), `nico_0b` (o Braga e o cinto) | sim |

### 2.C Ressalvas (nenhuma derruba item)

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | `man_3`, respostas do interfone | 2 das 6 respostas por sinal seguem o molde "ou isto, ou aquilo" (`sint_carga` "pode ser duas coisas"; `sint_luz` "Ou tem coisa puxando, ou tem coisa faltando"), e o par também ("Pode ser um defeito só, ou dois"). Combina com "não aceita palpite", porque ela devolve a tarefa, mas o molde se repete. | menor, sem correção necessária |

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só escrito e gravado, e só podia ser ele: peso e medida ("A peça tem a mesma cara e pesa diferente. Eu sei o que eu carrego.", `v4_teo`), frase curta ("Tinta não mente.", `teo_d3`), olho de montador ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`), a lista riscada até "falar com ele" (`fh_papel_teo`). |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada: `lenz_0` ("rapidinho... Ótimo, ótimo."), `lenz_2` ("Emprestado. Tá escrito aí" / "Lenz. Agora não."), `lenz_1` ("Nem você."), `lenz_mot_3` ("Fim do mês"), `b_hist_2` ("Cada litro de diesel sai do nosso bolso."). Nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Seca e com número: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone` ("4,2 kg", "letra miúda e reta"), `dis_cafeira`. |
| Dra. Sato | 5,0 | 4 | Mesmo jeito em mais de 15 textos: chama a máquina de "ela", devolve a pergunta, humor seco (`man_2` "Ou não.", `e_hist_1` "Ninguém.", `fh_ficha_bc` "Levar o guarda-chuva."), frase de rádio (`sato_teo` "Peço socorro agora: só chega se a noite andar."). O molde de 2.C-1 não chega a tirar meio ponto. |
| Seu Dirceu | 5,0 | 4 | Figurante com voz e objeto na mão: `traj_2` (aponta com o esfregão, "Nem boa-noite."), `ivone_ali_2` ("passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `dirceu_0` ("Amanhã ninguém lembra quem limpou."), `assim_leg` ("Quem sujou meu chão?"), `d_teo_2` ("Eu reparo."), `dis_balde`, `arm_aviso`. |
| Braga | 5,0 | 4 | Fala muito e foge por três caminhos (a chuva e a porta em `traj_aviso`, o cunhado em `braga_1` e `c_esc_3`, o café); as três verdades começam com "Tá."; "ali do lado da limpeza" (`cracha_3`) é de quem conhece o prédio; "Tive medo de perder o emprego" (`v4_braga`) é o desejo da ficha sem o "nunca diria". O acréscimo "de banners" em `c_esc_3` não tira nada da voz: ele continua falando sem parar e oferecendo café. |
| Aurélio | 5,0 | 4 | Pergunta em vez de afirmar (`aurelio_0`; `aurelio_1` "Você também sentiu?"), palavra de acervo ("Peça de acervo não cheira a novo."), foge da lacuna ("eu sei de cor, nunca mais li."), pede desculpa sem dizer a palavra (`aurelio_2` "Era medo meu."), e no Ouro agradece sem sair da Galeria. |
| Nico | 5,0 | 4 | Repara nas pessoas antes de falar de si (`nico_0`, `nico_0b`), perde o fio e se repete ("eu já te disse isso?" duas vezes), a regra do Téo sai aos tropeços (`nico_1.porque`), e com o número ele "pisca, como quem acorda" e não pede desculpa. Pesei tirar ponto porque ele tem pouco texto, mas o que existe não deixa dúvida de quem fala, e a escala mede reconhecimento, não volume. |
| **Média (8 com fala)** | **5,0** | **4,5** | 40 ÷ 8 = 5,0. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 5,0 | O jogo puxa sozinho: museu que esquece, pessoas que só mudam de fala quando você mostra o caderno, trancas com frase do mundo, cofre com o registro de trás para a frente, pêndulo, gravador, O Raio, escrita antiga na testa da máscara 3D, rachadura do lado certo. O que segurava meio ponto saiu: `falsa_1.antes` (`luz_antes_390`) agora pede uma previsão ("Se esta peça for a mesma da foto grande do catálogo, o que a luz de lado tem de mostrar nela?"). A resposta certa, "Arranhada, beiradas roídas", não repete as palavras de `par_foto` ("riscos finos, bordas gastas"), e as 4 opções cruzam superfície × beiradas. Depois a luz mostra o contrário ("Nenhuma borda gasta, nenhum risco de uso.", `luz_pos3_390`): é hipótese e teste. `falsa_3` ganhou um "ah, então é isso" que o jogo não entrega pronto (a foto impressa ao contrário explica a rachadura e o símbolo do outro lado). Desconto que considerei: a tradução de palavras na previsão é rasa. Não tirei ponto porque o salto está no confronto com a luz, não na pergunta. |
| Integrada | 5,0 | Papel numa frase clara na entrada ("Nesta atividade você vive o papel de quem lembra das voltas..."); 8 missões secretas, nenhuma se cumpre com um toque (`LC_MISSOES`); papéis da volta 5 com tarefa e dica próprias, em segunda pessoa; nome de quem trouxe cada fato no telão; uma escrita que só existe neste museu. |
| Identificada | 5,0 | O diagnóstico pede um raciocínio que a pessoa reconhece como dela (2 sinais de tipos diferentes e 1 leitura normal), o erro volta com o motivo, os finais por causa cobram a escolha (D: "A manhã chega, limpa demais."), "Para conversar" deixa a pergunta de valor no telão, a inscrição ensina a conferir com a fonte, e o desfecho do celular mostra "O que o seu caderno trouxe · 6 de 9 fatos", agora com a miniatura da peça certa na ficha da cópia (`desfecho_390`). |
| Externa (menos é melhor) | bruta 1,5, invertida 4,5 | Não há pontos nem ranking. A recompensa é +1 de energia, o nome no telão e o final. Os contadores ("6 de 9 fatos", "Você marcou 3 de 3") medem entendimento, não dão prêmio. Errar minijogo sem custo está em "Ficou para decidir" e não pesou. |
| Amotivação (menos é melhor) | bruta 1,5, invertida 4,5 | A pessoa sempre sabe o que falta e por quê (trancas com frase do mundo, "Falta: ...", fichas do Revelar com "falta"; as dicas da caixa e da luz apontam para o caderno). Continua: muita palavra de regra junta no Dossiê. Sozinho, isso não tira meio ponto, mas também não deixa a nota chegar a 1. |
| **Nota da escala** | **4,8** | (5,0 + 5,0 + 5,0 + 4,5 + 4,5) ÷ 5 = 24,0 ÷ 5 = 4,8. Mínimo 4,5. **Passa.** |

Introjetada: neutra, não pontua.

#### O que segura a 3.2: texto ou dado × mecânica

| O que segura | Tipo | Subescala |
|---|---|---|
| Muita palavra de regra junta no Dossiê | (a) texto | Amotivação (sozinha, não tira meio ponto) |
| Recompensa fora do entendimento (+1 de energia da missão) | (b) mecânica, de propósito | Externa (já baixa; não é defeito) |

**O que só jogadores reais mostrariam (não puni):**
- se 5 de energia para 5 a 19 itens por sala dá gosto de escolha ou sensação de falta;
- se a turma liga sozinha a tábua da Conservação à testa da máscara da Galeria, e se alguém repara na rachadura do lado direito no zoom;
- se a previsão antes da luz é sentida como hipótese ou como pergunta de escola, e se "beiradas roídas" é entendido de primeira;
- se alguém liga a "foto impressa ao contrário" de `falsa_3` à rachadura e ao símbolo trocados de lado;
- se escolher a caixa pelo caderno dá o prazer de "achei" ou vira chute entre quatro;
- se as fichas "O que o seu caderno trouxe" são lidas ou passam batido no fim;
- se girar a peça 3D e caçar pontos dá prazer ou cansa em 15 salas;
- se os 10 segundos de caminhada criam tensão ou tédio; se falar em voz alta de salas diferentes funciona numa sala cheia; se alguém blefa a missão secreta;
- se o pêndulo vira graça ou briga; o ritmo das voltas 3 e 4; se "Para conversar" abre conversa.

**Decisões em "Ficou para decidir" ou do autor (não pesaram):** seletor de entrada e "Obrigado por participar!"; resposta errada em minijogo sem custo; entrada por papel nos consertos em dupla; piso de volta em `nico_1`, `cracha_3`, `lenz_2`; "quem" e "por quê" quase inteiros na volta 1; voz de sistema; a Dra. Sato e as voltas; Revelar só na volta 5; testa da máscara à vista desde a volta 1; disposição da planta; luz de lado na volta 1 sem prova no caderno.

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

**Nada ficou abaixo do mínimo. Nada é obrigatório nestas seções.**

Retoques opcionais:

### (a) Texto e dado
**A1. Dossiê (sem estimativa fechada).** Juntar as frases de regra repetidas numa ficha só. Sozinho, não muda nota; daria margem na Amotivação.

**A2. `man_3`, `sint_carga` ou `sint_luz` (umas 10 a 15 palavras).** Tirar o molde "ou isto, ou aquilo" de uma das duas respostas (a do par pode ficar), para a Dra. Sato não soar igual em três falas seguidas. Exemplo para `sint_luz`: "Luz caindo a cada tentativa? Então alguma coisa mexeu no circuito. Vai até a caixa de fusíveis e me conta o que tem lá." Não muda o que a pista prova.

### (b) Mecânica
Nada.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (rodada 16, sobre a rev. 14) | Agora (rodada 18, sobre a rev. 16) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem personagem novo. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | 34 ids conferidos por script. |
| 2.4 falas não contradizem a ficha | Passa (1 ressalva) | Passa (1 ressalva) | `c_esc_3` manteve a voz; a planta nova bate com `ivone_red` e `traj_2`; continua o molde do interfone. |
| 2.4 exceções registradas | Passa | Passa | Nada mudou que precise de registro. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa em 117 arquivos. |
| Téo | 5,0 | 5,0 | Sem mudança. |
| Lenz | 5,0 | 5,0 | Sem mudança. |
| Ivone | 5,0 | 5,0 | Sem mudança. |
| Dra. Sato | 5,0 | 5,0 | Sem mudança. |
| Seu Dirceu | 5,0 | 5,0 | Sem mudança. |
| Braga | 5,0 | 5,0 | `c_esc_3` ganhou "de banners" e manteve "Tá.", o cunhado e o café. |
| Aurélio | 5,0 | 5,0 | Sem mudança. |
| Nico | 5,0 | 5,0 | Sem mudança. |
| **3.1 média** | **5,0** | **5,0** | Passa. |
| Intrínseca | 4,5 | 5,0 | `falsa_1.antes` virou previsão sem copiar `par_foto`; `falsa_3` ganhou a foto espelhada. |
| Integrada | 5,0 | 5,0 | Sem mudança. |
| Identificada | 5,0 | 5,0 | Miniatura certa na ficha da cópia (não muda a nota). |
| Externa (bruta) | 1,5 | 1,5 | Sem mudança. |
| Amotivação (bruta) | 1,5 | 1,5 | Dossiê ainda carregado. |
| **3.2 nota** | **4,7** | **4,8** | Passa. |

Nenhuma nota caiu.

## 5. Fim do ciclo

**As escalas das seções 2 e 3 passaram.** Seção 2: 5 de 5. Seção 3.1: 5,0. Seção 3.2: 4,8. As outras seções (história, conferência técnica, peças) não fazem parte desta avaliação.
