# Mosaico Loop v4 (revisão 14): avaliação das seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliei do zero sobre a revisão 14 (`dados/pistas-v4.json`: "v4 revisão 14 (26/11/2026)", 281 pistas). Não abri navegador e não editei nada no repositório. Escrevi só em `/tmp/roda/esc/rod16/`.

**O que li:** ESCALAS_AVALIACAO_JOGOS.md (inteiro); docs/FICHAS.md (inteiro); DECISOES-V4.md, revisões 11 a 14 inteiras (com "Não aplicado" e "Ficou para decidir"); as 281 pistas inteiras (gerei de novo do repositório em `rod16/pg/pistas_legivel.txt`, e o arquivo saiu igual ao de `/tmp/roda/esc/`); `finais` e `papeis_volta5` dos dados; loop-central.js (`LC_MG`, `LC_MGA`, `LC_FATO_PISTA`, `LC_MISSOES`, `lcResumoFinal`, `lcFatosFinal`); ritmo.js (`LOOP_CONVERSA`, `LOOP_LINHA`).

**O que conferi por script** (`rod16/pg/checa.py`, saída em `rod16/pg/checa.txt`): os 34 ids da tabela "Onde cada traço extremo aparece" existem nos dados (nenhum falta); são 18 traços extremos em negrito. "Tá." só em `c_esc_3`, `cracha_3`, `coop_veredito` (Braga). "Desculpa" só em `d_teo_1` (Téo, escrito), `nico_0`, `nico_0b`, `nico_1` e `dis_balde` (Seu Dirceu, escrito). "Fui eu" só em `teo_radio_2d` e `d_fus_2b` (Téo; é o "nunca diria" do Lenz, e o Lenz não diz). As outras 7 frases de "nunca diria" não aparecem. Os 11 textos com a letra do Téo terminam em "— T.". O nome "Lenz" aparece no texto só em pistas da volta 3 em diante (`cracha_3`, `coop_veredito`, `v4_braga`, `lenz_2`); fora dos dados, só em `LOOP_LINHA` (fita do telão, que só acende com uma dessas pistas) e no banco de reserva dos minijogos, cujos textos o Loop substitui. A varredura de 116 arquivos fora de docs/ atrás de nomes de escala e de traço achou só comentários de CSS ("rodada 3", "rodada 5 das escalas"), a variável técnica `rodada` da sala e "escala de crachás" (objeto do mundo).

**O que vi nas capturas (sem navegador):** `r14/cap/caixa_390` (novo `c_peca`), `luz_antes_390` (novo `falsa_1.antes`), `luz_achou_390` (frase nova da luz sobre a máscara fosca), `desfecho_390` e `desfecho_vazio_390` (fichas "O que o seu caderno trouxe"). Cobrem tudo o que a revisão 14 mudou e que pesa nestas seções.

Aviso de autoavaliação: não escrevi nenhum texto do jogo. Como 8 de 8 personagens saem com 5, reli cada fala procurando motivo para tirar ponto; o que achei está nas justificativas.

---

## 1. Nota geral

**PASSA.** Seção 2: 5 de 5 itens. Seção 3.1: **5,0** (mínimo 4,5), ninguém abaixo de 4. Seção 3.2: **4,7** (mínimo 4,5). A revisão 14 não mexeu em fala de personagem (as frases cortadas de `lenz_3`, `e_hist_1`, `teo_cadeira`, `conserto_C/D` eram do narrador; a marca "Ninguém." da Dra. Sato ficou). A 3.2 sobe 0,1 porque o desfecho do celular agora mostra os fatos que a pessoa trouxe (B3, aprovado pelo autor e visível em `desfecho_390`).

---

## 2. Tabela por critério

### 2.A Seção 2: checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md: os 8 têm papel, 5 traços, honestidade-humildade e 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". Seu Dirceu registrado como figurante. A revisão 14 não criou personagem. |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 de 18 com cena; os 34 ids existem (tabela 2.B). |
| Falas e ações não contradizem a ficha | **Passa** | coerente | Marcas de voz no lugar certo; nenhum "nunca diria" na boca do dono. Dra. Sato só pelo interfone ou por escrito, e só vê o céu. Téo só escrito ou gravado. Ivone fala de parte do dia e quantidade ("fim da tarde", "4,2 kg"), como a ficha atual diz. Aurélio no Ouro fica na Galeria. Ressalva menor em 2.C. |
| Exceções registradas na ficha | **Passa** | completo | As 10 exceções batem com os dados (Téo, Nico em `nico_1` só da volta 4, Sato no interfone e confiança só de informação, ninguém lembra das voltas, "desde ontem" do Seu Dirceu em `c_anc_3`, Aurélio no Ouro, Téo não prevê o reinício, nome do Lenz da volta 3, Seu Dirceu na noite do fusível em `d_teo_2`). Nada novo pedia registro. |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura de 116 arquivos limpa (ver acima). As fichas novas do desfecho usam só rótulos do mundo ("A troca da peça", "O dinheiro do seguro"...). |

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
| Braga | Amabilidade alta | `traj_aviso` ("Pega um café, tá fresco"), `c_esc_3`, `cracha_3` ("Quer um café?"), `dis_cafe` | sim |
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
| 1 | `man_3`, respostas do interfone | 2 das 7 respostas seguem o molde "ou isto, ou aquilo" (`sint_carga` "pode ser duas coisas", `sint_luz` "Ou tem coisa puxando, ou tem coisa faltando") e o par também ("Pode ser um defeito só, ou dois"). Combina com "não aceita palpite": ela devolve a tarefa. | menor, sem correção necessária |

(A observação da rodada 13 sobre a luz de lado, "verniz brilha" × pedra fosca, saiu: `luz_achou_390` agora diz "O verniz cobre tudo por igual, até o grão da pedra", e a imagem mostra exatamente isso.)

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só escrito e gravado, e só podia ser ele: peso e medida ("A peça tem a mesma cara e pesa diferente. Eu sei o que eu carrego.", `v4_teo`), frase curta ("Tinta não mente.", `teo_d3`), olho de montador ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`), a lista riscada até "falar com ele" (`fh_papel_teo`). |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada: `lenz_0` ("rapidinho... Ótimo, ótimo."), `lenz_2` ("Emprestado. Tá escrito aí" / "Lenz. Agora não."), `lenz_1` ("Nem você."), `lenz_mot_3` ("Fim do mês"), `b_hist_2` ("Cada litro de diesel sai do nosso bolso."). Nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Seca e com número: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone` ("4,2 kg", "letra miúda e reta"), `dis_cafeira`. |
| Dra. Sato | 5,0 | 4 | Mesmo jeito em mais de 15 textos: chama a máquina de "ela", devolve a pergunta, humor seco (`man_2` "Ou não.", `e_hist_1` "Ninguém.", `fh_ficha_bc` "Levar o guarda-chuva."), frase de rádio (`sato_teo` "Peço socorro agora: só chega se a noite andar."). O molde de 2.C-1 não tira meio ponto. |
| Seu Dirceu | 5,0 | 4 | Figurante com voz e objeto na mão: `traj_2` (aponta com o esfregão, "Nem boa-noite."), `ivone_ali_2` ("passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `dirceu_0` ("Amanhã ninguém lembra quem limpou."), `assim_leg` ("Quem sujou meu chão?"), `d_teo_2` ("Eu reparo."), `dis_balde`, `arm_aviso`. |
| Braga | 5,0 | 4 | Fala muito e foge por três caminhos (a chuva e a porta em `traj_aviso`, o cunhado em `braga_1` e `c_esc_3`, o café); as três verdades começam com "Tá."; "ali do lado da limpeza" (`cracha_3`) é de quem conhece o prédio; "Tive medo de perder o emprego" (`v4_braga`) é o desejo da ficha sem o "nunca diria". |
| Aurélio | 5,0 | 4 | Pergunta em vez de afirmar (`aurelio_0`; `aurelio_1` "Você também sentiu?"), palavra de acervo ("Peça de acervo não cheira a novo."), foge da lacuna ("eu sei de cor, nunca mais li."), pede desculpa sem a palavra (`aurelio_2` "Era medo meu."), no Ouro agradece sem sair da Galeria. |
| Nico | 5,0 | 4 | Repara nas pessoas antes de falar de si (`nico_0`, `nico_0b`), perde o fio e se repete ("eu já te disse isso?" duas vezes), a regra do Téo sai aos tropeços (`nico_1.porque`), e com o número ele "pisca, como quem acorda" e não pede desculpa. Desconto considerado: pouco texto; mas o que existe não deixa dúvida de quem fala, e a escala mede reconhecimento, não volume. |
| **Média (8 com fala)** | **5,0** | **4,5** | 40 ÷ 8 = 5,0. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 4,5 | O jogo puxa sozinho: museu que esquece, pessoas que só mudam de fala quando você mostra o caderno, trancas com frase do mundo, cofre com o registro de trás para a frente, pêndulo, gravador, O Raio, escrita antiga na testa da máscara 3D, e agora uma rachadura do lado certo na peça. A revisão 14 tirou as duas perguntas da faixa do bom senso: `c_peca` (`caixa_390`) pede para cruzar o caderno com quatro etiquetas que todas têm aviso, então "NÃO ABRIR" não entrega; a certa só se acha por `c_esc_1`, `c_esc_2` ou `lenz_meio_1` (com só `c_esc_3`, que não diz "banners", a pessoa tem de buscar outra pista: bom). O que ainda segura meio ponto é `falsa_1.antes` (`luz_antes_390`): a resposta certa é cópia literal do texto de `par_foto` ("pedra escura, riscos finos, bordas gastas"). É consulta, não dedução; a graça vem depois, quando a luz mostra o contrário. Não é defeito, é o teto desta subescala. |
| Integrada | 5,0 | Papel numa frase clara na entrada ("Nesta atividade você vive o papel de quem lembra das voltas..."); 8 missões secretas, nenhuma de um toque (`LC_MISSOES`); papéis da volta 5 com tarefa e dica próprias, em segunda pessoa; nome de quem trouxe cada fato no telão; uma escrita que é só deste museu. |
| Identificada | 5,0 | O diagnóstico pede um raciocínio que a pessoa reconhece como dela (2 sinais de tipos diferentes e 1 leitura normal), o erro volta com o motivo, os finais por causa cobram a escolha (D: "A manhã chega, limpa demais."), "Para conversar" deixa a pergunta de valor no telão, e a inscrição ensina a conferir com a fonte. O que faltava nas rodadas 10 a 13 entrou: o desfecho do celular mostra "O que o seu caderno trouxe · 6 de 9 fatos", em fichas com miniatura (`desfecho_390`), e, quando não há nenhum, uma ficha honesta: "Nenhum fato da noite saiu do seu caderno desta vez." (`desfecho_vazio_390`). A pessoa vê o que ela, e não a turma, entendeu. |
| Externa (menos é melhor) | bruta 1,5, invertida 4,5 | Sem ponto nem ranking; a recompensa é +1 de energia, o nome no telão e o final. Os contadores "6 de 9 fatos" e "Você marcou 3 de 3" são de entendimento, não de prêmio. Errar minijogo sem custo está em "Ficou para decidir" e não pesou. |
| Amotivação (menos é melhor) | bruta 1,5, invertida 4,5 | A pessoa sempre sabe o que falta e por quê (trancas com frase do mundo, "Falta: ...", fichas do Revelar com "falta"). A revisão 14 limpou restos de formulário ("Quase.", "Revelar agora", "Assim está certo."). Continua: muita palavra de regra junta no Dossiê. Sozinho, não tira meio ponto, mas também não deixa chegar a 1. |
| **Nota da escala** | **4,7** | (4,5 + 5,0 + 5,0 + 4,5 + 4,5) ÷ 5 = 23,5 ÷ 5 = 4,7. Mínimo 4,5. **Passa.** |

Introjetada: neutra, não pontua.

#### O que segura a 3.2: texto ou dado × mecânica

| O que segura | Tipo | Subescala |
|---|---|---|
| `falsa_1.antes`: a resposta é a frase de `par_foto` copiada | (a) texto/dado | Intrínseca |
| Muita palavra de regra junta no Dossiê | (a) texto | Amotivação (não tira meio ponto sozinha) |

**O que só jogadores reais mostrariam (não puni):**
- se 5 de energia para 5 a 19 itens por sala dá gosto de escolha ou sensação de falta;
- se a turma liga sozinha a tábua da Conservação à testa da máscara da Galeria, e se alguém repara na rachadura do lado direito no zoom;
- se o palpite antes da luz é sentido como hipótese e teste ou como pergunta de escola;
- se escolher a caixa pelo caderno dá o prazer de "achei" ou vira chute entre quatro;
- se as fichas "O que o seu caderno trouxe" são lidas ou passam batido no fim;
- se girar a peça 3D e caçar pontos dá prazer ou cansa em 15 salas;
- se os 10 segundos de caminhada criam tensão ou tédio; se falar em voz alta de salas diferentes funciona numa sala cheia; se alguém blefa a missão secreta;
- se o pêndulo vira graça ou briga; o ritmo das voltas 3 e 4; se "Para conversar" abre conversa.

**Decisões em "Ficou para decidir" ou do autor (não pesaram):** seletor de entrada e "Obrigado por participar!"; resposta errada em minijogo sem custo; entrada por papel nos consertos em dupla; piso de volta em `nico_1`, `cracha_3`, `lenz_2`; "quem" e "por quê" quase inteiros na volta 1; voz de sistema; a Dra. Sato e as voltas; Revelar só na volta 5; testa da máscara à vista desde a volta 1; disposição da planta.

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

**Nada ficou abaixo do mínimo. Nada é obrigatório nestas seções.**

Retoques opcionais (dariam margem na 3.2):

### (a) Texto e dado
**A1. `LC_MG.falsa_1.antes` (umas 15 a 25 palavras).** Trocar a pergunta de cópia por uma que use a foto para prever o que a luz deve mostrar. Exemplo: "Se esta peça fosse a da foto, o que a luz de lado deveria mostrar nas bordas?", com opções do tipo "desgaste e riscos de uso" / "verniz liso de ponta a ponta" / "marcas de cola" / "nada, a luz não mostra borda". A resposta continua decidida pela foto, mas vira previsão, e a luz depois confirma ou desmente. Pede teste de tela.

**A2. Dossiê (opcional, sem estimativa fechada).** Juntar as frases de regra repetidas numa ficha só; não muda nota sozinha.

### (b) Mecânica
Nada.

Com A1, a 3.2 iria a (5 + 5 + 5 + 4,5 + 4,5) ÷ 5 = 4,8. Não muda enredo nem regra.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (rodada 13, sobre a rev. 13) | Agora (rodada 16, sobre a rev. 14) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem personagem novo. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | 34 ids conferidos por script. |
| 2.4 falas não contradizem a ficha | Passa (1 ressalva + 1 observação visual) | Passa (1 ressalva) | A frase da luz agora bate com a imagem; fica o molde do interfone. |
| 2.4 exceções registradas | Passa | Passa | Nada mudou que precise de registro. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa em 116 arquivos; fichas novas do desfecho limpas. |
| Téo | 5,0 | 5,0 | Sem mudança. |
| Lenz | 5,0 | 5,0 | `lenz_3` é narrador; ficou só mais seco. |
| Ivone | 5,0 | 5,0 | Sem mudança. |
| Dra. Sato | 5,0 | 5,0 | `e_hist_1` perdeu "Alguém ligou." e manteve "Ninguém.". |
| Seu Dirceu | 5,0 | 5,0 | Sem mudança. |
| Braga | 5,0 | 5,0 | Sem mudança. |
| Aurélio | 5,0 | 5,0 | Sem mudança. |
| Nico | 5,0 | 5,0 | Sem mudança. |
| **3.1 média** | **5,0** | **5,0** | Passa. |
| Intrínseca | 4,5 | 4,5 | `c_peca` virou cruzamento de caderno (melhora real); `falsa_1.antes` saiu do bom senso, mas virou cópia literal de `par_foto`. |
| Integrada | 5,0 | 5,0 | Sem mudança. |
| Identificada | 4,5 | 5,0 | B3 aplicado: fatos da pessoa no desfecho do celular. |
| Externa (bruta) | 1,5 | 1,5 | Sem mudança. |
| Amotivação (bruta) | 1,5 | 1,5 | Restos de formulário limpos; Dossiê ainda carregado. |
| **3.2 nota** | **4,6** | **4,7** | Passa. |

Nenhuma nota caiu.

## 5. Fim do ciclo

**As escalas das seções 2 e 3 passaram.** Seção 2: 5 de 5. Seção 3.1: 5,0. Seção 3.2: 4,7. As outras seções (história, conferência técnica, peças) não fazem parte desta avaliação.
