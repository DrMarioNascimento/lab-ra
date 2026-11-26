# Mosaico Loop v4 (revisão 13): avaliação das seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliei do zero sobre a revisão 13: `dados/pistas-v4.json` e `loop-central-dados.js` dizem "v4 revisão 13 (26/11/2026)", com 281 pistas. Não editei nada no repositório. Escrevi só em `/tmp/roda/esc/rod13/`.

**O que li:** ESCALAS_AVALIACAO_JOGOS.md (inteiro); docs/FICHAS.md (inteiro); DECISOES-V4.md, revisões 11, 12 e 13 inteiras (com "Não aplicado" e "Ficou para decidir"); as 281 pistas inteiras (gerei de novo a partir do repositório em `rod13/pg/pistas_legivel.txt`, e o arquivo saiu igual ao de `/tmp/roda/esc/`); atividades.txt (regras, frases de final, os 5 finais); loop-central.js (`LC_MG`, `LC_MGA`, `LC_INSC`, `LC_FATO_PISTA`, `LC_MISSOES`, `lcResumoFinal`); ritmo.js (`LOOP_CONVERSA`); sala/telao/telao.mjs (páginas do fim).

**O que conferi por script** (`rod13/pg/checa.py`): os 34 ids da tabela "Onde cada traço extremo aparece" existem nos dados (nenhum falta); são 18 traços extremos em negrito. "Tá." aparece só em `c_esc_3`, `cracha_3` e `coop_veredito` (Braga). "Desculpa" aparece só em `d_teo_1` (Téo, escrito), `nico_0`, `nico_0b`, `nico_1` e `dis_balde` (Seu Dirceu, escrito). "Fui eu" aparece só em `teo_radio_2d` e `d_fus_2b` (Téo). As outras 7 frases de "nunca diria" não aparecem em pista nenhuma. O nome "Lenz" aparece no texto só em pistas da volta 3 em diante (`cracha_3`, `coop_veredito`, `v4_braga`, `lenz_2`); nas outras ele só está no campo interno `revela.aponta`, que a tela não mostra. Os 11 textos com a letra do Téo terminam em "— T.", e as 3 gravações (`teo_radio*`) são voz, não bilhete. A varredura de 116 arquivos .js, .mjs, .html, .json, .css, .svg e .txt fora de docs/, atrás de nomes de escala e de traço, achou só comentários de CSS ("rodada 3", "rodada 5 das escalas"), que nenhuma tela mostra, e "escala de crachás", que é um objeto do mundo.

**O que vi na tela:** `r12/vis/03` (frase do papel na entrada), `r12/vis/10_maquina_revelar`, `r12/extra/luz_antes_390` e `luz_achou_390` (o minijogo da luz já com a pergunta nova e a máscara com a inscrição), `r12/extra/torre_gal_zoom` (testa da máscara 3D no zoom da Galeria). Essas capturas cobrem o que a revisão 13 mudou e que pesa nestas seções. Não precisei gerar capturas novas.

Aviso de autoavaliação: não escrevi nenhum texto do jogo. Mesmo assim, como 8 de 8 personagens saem com 5, reli cada fala procurando motivo para tirar ponto. O que achei está na justificativa de cada um.

---

## 1. Nota geral

**PASSA.** Seção 2: os 5 itens passam. Seção 3.1: **5,0** (mínimo 4,5), ninguém abaixo de 4. Seção 3.2: **4,6** (mínimo 4,5). A revisão 13 não mexeu em fala de personagem. Os retoques de `c_peca` e `falsa_1.antes` melhoram a Intrínseca, mas não tiram as duas perguntas da faixa "dá para responder por bom senso". O desfecho do celular continua sem mostrar os fatos que a pessoa trouxe (B3, que está em "Não aplicado" e não em "Ficou para decidir"). Por isso a 3.2 fica em 4,6, como antes.

---

## 2. Tabela por critério

### 2.A Seção 2: checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md: os 8 têm papel, os 5 traços, honestidade-humildade e as 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". Seu Dirceu está registrado como figurante, sem necessidade. As revisões 12 e 13 não criaram personagem. |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 de 18 têm cena, e os 34 ids existem. Conferi um a um (tabela 2.B). |
| Falas e ações não contradizem a ficha | **Passa** | coerente | As marcas de voz estão no lugar certo (ver "O que conferi por script"). Nenhum personagem diz a frase de "nunca diria". A Dra. Sato só fala pelo interfone ou por escrito (`man_3`, `sato_teo`, `loop_reset`, `a_hist_1`). O Téo só aparece escrito ou gravado antes de 0:00. Em `aurelio_1` o Aurélio sabe a frase da testa "de cor" e "nunca mais leu", e isso continua coerente com o "o que vê" dele. As frases que a revisão 13 cortou (`insc_verdadeira`, `chao_peca`, `mancha_2`) eram do narrador, não de personagem. Fica uma ressalva de acabamento (2.C). |
| Exceções registradas na ficha | **Passa** | completo | As 10 exceções batem com os dados: Téo só escrito ou gravado; Nico sai da repetição só em `nico_1` (volta 4, com o número); a Dra. Sato só pelo interfone, e vê o céu; o Aurélio fica na Galeria no Ouro ("A notícia das 3 provas sobe até a Galeria"); o nome do Lenz só aparece da volta 3; o "desde ontem" do Seu Dirceu (`c_anc_3`); a noite do fusível (`d_teo_2`, "Eu reparo."). Não houve mudança de personagem nas revisões 12 e 13, então não faltava registro novo. |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | A varredura de 116 arquivos está limpa (só comentários de CSS e "escala de crachás"). `glifos.svg` não tem texto de projeto. |

### 2.B Traço extremo e cena (conferido pista por pista)

| Pessoa | Traço extremo | Cena | Ok? |
|---|---|---|---|
| Aurélio | Neuroticismo alto | `aurelio_0` ("Está linda, não está?" Ele não parece ter certeza), `falsa_1` (respira pela boca) | sim |
| Aurélio | Sensibilidade à privação baixa | `aurelio_1` ("Eu demorei para acreditar." / "eu sei de cor, nunca mais li.") | sim |
| Aurélio | Tolerância ao estresse baixa | `aurelio_2` ("Disse a mim mesmo que era cansaço dele. Era medo meu.") | sim |
| Téo | Honestidade alta | `data_3`, `d_teo_1` ("Desculpa, Dra. Sato."), `d_fus_2b` ("Fui eu. — T."), `teo_radio` (o envelope que ele recusou) | sim |
| Téo | Sensibilidade à privação alta | `teo_d1` ("Sozinho pra quê?"), `v4_teo` ("Eu sei o que eu carrego.") | sim |
| Téo | Busca de emoção alta | `teo_d3` ("Hoje à noite eu falo com ele."), `teo_radio` ("cara a cara") | sim |
| Ivone | Conscienciosidade alta | `ivone_1x` ("Eu não perco pote."), `v5_ivone` ("Limpei, pesei, devolvi: 4,2 kg.") | sim |
| Ivone | Curiosidade social baixa | `ivone_2` ("Devia ter perguntado por quê."), `ivone_red` (aponta sem olhar) | sim |
| Braga | Amabilidade alta | `traj_aviso` ("Pega um café, tá fresco"), `c_esc_3`, `cracha_3` ("Quer um café?"), `dis_cafe` | sim |
| Braga | Tolerância ao estresse baixa | `braga_1` (dá de ombros rápido demais), `v4_braga` (riscado duas vezes), `coop_veredito` (engole seco) | sim |
| Lenz | Amabilidade baixa | `lenz_0` (não espera a resposta), `lenz_1` ("Nem você."), `traj_3` (sai sem olhar para você) | sim |
| Lenz | Honestidade baixa | `lenz_2` ("Eu devolvo tudo que eu pego."), `cracha_2` | sim |
| Lenz | Tolerância ao estresse baixa | `traj_3` (fala sozinho na escada), `lenz_mot_3` ("ou eu não tenho mais empresa pra te pagar") | sim |
| Lenz | Busca de emoção alta | `v5_lenz` ("Peça por fora: +?", "ninguém confere a base") | sim |
| Dra. Sato | Abertura alta | `man_anc_2` ("Nunca aconteceu, mas vai que"), `man_2` ("Ou não.") | sim |
| Dra. Sato | Sensibilidade à privação alta | `man_3` ("Me conta o que você viu com os seus olhos."), `a_hist_1`, `e_hist_1` ("Ninguém.") | sim |
| Nico | Conscienciosidade baixa | `nico_0b` (perde o fio), `nico_1.porque` (a regra sai aos tropeços), `fh_fusivelx` (fusível para a cafeteira) | sim |
| Nico | Curiosidade social alta | `nico_0` ("cara de quem não jantou", "a Ivone hoje tá brava"), `nico_0b` (o Braga e o cinto) | sim |

### 2.C Ressalvas (nenhuma derruba item)

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | `man_3`, respostas do interfone | 3 das 7 respostas seguem o molde "ou isto, ou aquilo" (`sint_carga` "pode ser duas coisas", `sint_luz`, e a do par). Combina com "não aceita palpite". | menor, sem correção necessária |
| 2 | Minijogo da luz (`falsa_1`, `luz_achou_390`) | O texto diz "O verniz brilha por igual, de ponta a ponta", mas a imagem mostra pedra granulada e fosca, só com uma faixa de luz. A revisão 13 decidiu manter ("efeito de luz rasante"). Isto é do texto do mundo, não da voz de personagem, e fica registrado só como observação. | menor (é da escala visual, não desta) |

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só escrito e gravado, e só podia ser ele: peso e medida ("A peça tem a mesma cara e pesa diferente. Eu sei o que eu carrego.", `v4_teo`), frase curta ("Tinta não mente.", `teo_d3`), olho de montador ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`), a lista riscada até "falar com ele" (`fh_papel_teo`). Procurei frase genérica e não achei. |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada em toda fala: `lenz_0` ("rapidinho... Ótimo, ótimo."), `lenz_2` ("Emprestado. Tá escrito aí" / "Lenz. Agora não."), `lenz_1` ("Nem você."), `lenz_mot_3` ("Fim do mês"), `b_hist_2` ("Cada litro de diesel sai do nosso bolso."). Nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Seca e com número: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone` ("4,2 kg", "letra miúda e reta"), `dis_cafeira`. |
| Dra. Sato | 5,0 | 4 | Mais de 15 textos com o mesmo jeito: chama a máquina de "ela", devolve a pergunta, humor seco (`man_2` "Ou não.", `e_hist_1` "Ninguém.", `fh_ficha_bc` "Levar o guarda-chuva."), frase de rádio (`sato_teo`, "Peço socorro agora: só chega se a noite andar."). O molde de 2.C-1 não tira meio ponto: até ali ela devolve a tarefa a você. |
| Seu Dirceu | 5,0 | 4 | Figurante com voz e objeto na mão: `traj_2` (aponta com o esfregão, "Nem boa-noite."), `ivone_ali_2` ("passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `dirceu_0` ("Amanhã ninguém lembra quem limpou."), `assim_leg` ("Quem sujou meu chão?"), `d_teo_2` ("Eu reparo."), `dis_balde`, `arm_aviso`. |
| Braga | 5,0 | 4 | Fala muito e foge do assunto por três caminhos (a chuva e a porta em `traj_aviso`, o cunhado em `braga_1` e `c_esc_3`, o café); as três verdades começam com "Tá."; "ali do lado da limpeza" (`cracha_3`) é o jeito de quem conhece o prédio de olho fechado; "Tive medo de perder o emprego" (`v4_braga`) é o desejo da ficha, dito sem a frase de "nunca diria". |
| Aurélio | 5,0 | 4 | Pergunta em vez de afirmar (`aurelio_0`; `aurelio_1`: "Você também sentiu?"), usa palavra de acervo ("Peça de acervo não cheira a novo."), foge da lacuna com as próprias palavras ("eu sei de cor, nunca mais li."), pede desculpa sem dizer a palavra (`aurelio_2`: "Era medo meu."), e no Ouro agradece sem sair da Galeria. |
| Nico | 5,0 | 4 | Repara nas pessoas antes de falar de si (`nico_0`, `nico_0b`), perde o fio e se repete ("eu já te disse isso?", duas vezes), a regra do Téo sai aos tropeços em `nico_1.porque`, e com o número ele "pisca, como quem acorda" e não pede desculpa. Desconto que considerei: é pouco texto, e só `nico_0` aparece com certeza na volta 1. Mesmo assim, o que existe não deixa dúvida de quem fala, e a escala mede se dá para reconhecer, não quanto texto tem. |
| **Média (8 com fala)** | **5,0** | **4,5** | 40 ÷ 8 = 5,0. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 4,5 | O jogo puxa sozinho: o museu esquece, as pessoas só mudam de fala quando você mostra o caderno, as trancas têm frase do mundo, o cofre abre com o registro de trás para a frente, há pêndulo, gravador, O Raio e a escrita antiga entalhada na testa da máscara 3D (legível no zoom da Galeria, `torre_gal_zoom`). A revisão 13 melhorou as duas perguntas fracas, mas não as tirou da faixa do bom senso. `falsa_1.antes` agora manda olhar o que você já anotou e o "Dicionário das palavras" (`luz_antes_390`): virou palpite antes do teste, o que é bom. Só que "peça de 300 anos mostra riscos e desgaste" ainda se responde sem a noite. `c_peca` perdeu a dica que entregava a resposta ("No caderno, procure a pista “A peça principal”."), mas a pergunta continua sendo lembrar o cheiro da pista que é a própria condição para abrir a caixa. As quatro opções são "Cheiro de...", e só "pó antigo" faz pensar um pouco. Errar sem custo está em "Ficou para decidir" e não pesou. |
| Integrada | 5,0 | O papel aparece numa frase clara na entrada ("Nesta atividade você vive o papel de quem lembra das voltas. O museu esquece. Você e o seu caderno, não.", `r12/vis/03`). São 8 missões secretas, e nenhuma fecha com um toque no primeiro minuto (`LC_MISSOES`). O telão tem a página "Missões" e o nome de quem trouxe cada fato, e os papéis da volta 5 têm tarefa e dica próprias. A escrita própria do Loop dá ao museu uma cultura que é só dele. |
| Identificada | 4,5 | O diagnóstico pede um raciocínio que a pessoa reconhece como dela (2 sinais de tipos diferentes e 1 leitura normal). O erro volta com o motivo, os finais por causa cobram a escolha (D: "A manhã chega, limpa demais."), e "Para conversar" deixa a pergunta de valor no telão. A inscrição ensina a conferir com a fonte e entra no Revelar como prova. Falta para 5, como nas rodadas anteriores: `lcResumoFinal` mostra as 3 fichas e as 3 provas, mas não quais fatos da noite aquela pessoa trouxe (`window.lcFatos` existe e não é usado ali). A DECISOES (revisão 13) põe isso em "Não aplicado", como B3, e não em "Ficou para decidir". Por isso contei. |
| Externa (menos é melhor) | bruta 1,5, invertida 4,5 | Não há ponto nem ranking. A recompensa é +1 de energia, o nome no telão e o final. Errar o minijogo não custa nada, mas isso está em "Ficou para decidir" e não pesou. Restos de formulário e voz de sistema também são decisão registrada e não pesaram. |
| Amotivação (menos é melhor) | bruta 1,5, invertida 4,5 | A pessoa sempre sabe o que falta e por quê: cada tranca tem frase do mundo, as atividades mostram "Falta: ...", e o Revelar mostra as três fichas de passo com "falta" (`10_maquina_revelar`). A revisão 13 tirou duas confusões de leitura: "chavinha" agora tem um sentido só, e "Na mesma chave" diz qual cabo é. Sobra o de sempre: muita palavra de regra junta no Dossiê, que não tira meio ponto sozinha. |
| **Nota da escala** | **4,6** | (4,5 + 5,0 + 4,5 + 4,5 + 4,5) ÷ 5 = 4,6. Mínimo 4,5. **Passa.** |

Introjetada: neutra, não pontua.

#### O que segura a 3.2: texto ou dado × mecânica

| O que segura | Tipo | Subescala |
|---|---|---|
| `c_peca`: a pergunta pede para lembrar o cheiro, e a resposta está na condição de abrir | (a) texto/dado | Intrínseca |
| `falsa_1.antes`: a pergunta ainda se resolve por bom senso (a idade da peça) | (a) texto/dado | Intrínseca |
| Desfecho do celular sem os fatos da pessoa (`lcResumoFinal`) | (b) mecânica (tela) | Identificada |
| Muita palavra de regra junta no Dossiê | (a) texto | Amotivação (não tira meio ponto sozinha) |

**O que só jogadores reais mostrariam (não puni):**
- se 5 de energia diante de 5 a 19 itens por sala dá gosto de escolha ou sensação de falta, e se gastar 1 na tábua na volta 1, sem uso imediato, parece uma boa aposta;
- se a turma liga sozinha a tábua da Conservação à testa da máscara da Galeria, numa volta seguinte, e se a fala do Aurélio funciona como gancho;
- se alguém usa o zoom novo da Galeria para conferir a inscrição na peça 3D, ou só usa o minijogo;
- se o palpite antes da luz (`falsa_1.antes`) é sentido como hipótese e teste ou como pergunta de escola;
- se o minijogo dá o prazer de "achei" ou passa rápido demais para ser lembrado;
- se gastar energia em item de ambiente (pares inocentes) parece "o museu é vivo" ou energia perdida;
- se girar a peça 3D e caçar os pontos dá prazer ou cansa em 15 salas;
- se os 10 segundos de caminhada (agora vistos na planta, com o alfinete) criam tensão ou tédio;
- se falar em voz alta de salas diferentes funciona numa sala cheia; se alguém blefa a missão secreta na pausa;
- se a legenda do gravador é sentida como clima ou como espera; se o pêndulo vira graça ou briga;
- o ritmo das voltas 3 e 4 para quem já tem diagnóstico e ensaio;
- se a turma lê a fita do telão ou só o título do desfecho; se "Para conversar" abre conversa.

**Decisões em "Ficou para decidir" ou do autor (não pesaram):** seletor de entrada e "Obrigado por participar!"; resposta errada em minijogo sem custo; entrada por papel nos consertos em dupla; piso de volta em `nico_1`, `cracha_3`, `lenz_2`; "quem" e "por quê" quase inteiros na volta 1; restos de formulário e voz de sistema; a Dra. Sato e as voltas; Revelar só na volta 5; a testa da máscara à vista desde a volta 1; a disposição da planta.

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

**Nada ficou abaixo do mínimo.** Nada é obrigatório nestas seções. O que daria mais margem na 3.2 (opcional):

### (a) Texto e dado

**A1. `LC_MG.c_peca` (umas 20 palavras).** Trocar a pergunta de memória por uma que cruze outra pista da noite. Exemplo: "Qual caixa da estante pesa mais do que diz a etiqueta?", com opções tiradas de `c_esc_1`, `lenz_meio_1`, `dis_lampadas` (banners, lâmpadas queimadas, gesso, lista de entregas). Pede teste de tela.

**A2. `LC_MG.falsa_1.antes` (umas 15 palavras).** Ligar a pergunta a um dado do caderno que não seja de bom senso. Exemplo: "Na foto do catálogo, como estavam as bordas da peça?", só para quem já tem `par_foto`; para os outros, manter a pergunta de agora.

### (b) Mecânica

**B3. Fatos da pessoa no desfecho do celular** (`lcResumoFinal`; pede decisão do autor). Mostrar, abaixo das 3 provas, quais fatos da fita vieram do caderno dela. `window.lcFatos()` já está pronto. É tela, não regra, e é o que leva a Identificada a 5.

Com A1 e B3, a 3.2 iria a (5 + 5 + 5 + 4,5 + 4,5) ÷ 5 = 4,8. Nenhum dos três muda enredo nem regra.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (rodada 10, sobre a rev. 11) | Agora (rodada 13, sobre a rev. 13) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem personagem novo. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | 34 ids conferidos por script. |
| 2.4 falas não contradizem a ficha | Passa (1 ressalva) | Passa (1 ressalva + 1 observação visual) | A revisão 13 não mexeu em fala. Fica o molde do interfone. A observação sobre a imagem da luz é da escala visual. |
| 2.4 exceções registradas | Passa | Passa | Nada mudou que precise de registro novo. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa em 116 arquivos. |
| Téo | 5,0 | 5,0 | Sem mudança. |
| Lenz | 5,0 | 5,0 | Sem mudança. |
| Ivone | 5,0 | 5,0 | Sem mudança. |
| Dra. Sato | 5,0 | 5,0 | Sem mudança. |
| Seu Dirceu | 5,0 | 5,0 | Sem mudança. |
| Braga | 5,0 | 5,0 | Sem mudança. |
| Aurélio | 5,0 | 5,0 | Sem mudança. |
| Nico | 5,0 | 5,0 | Sem mudança. |
| **3.1 média** | **5,0** | **5,0** | Passa. |
| Intrínseca | 4,5 | 4,5 | Sobe por dentro (`c_peca` sem dica que entrega, `falsa_1.antes` como palpite com fonte, zoom da Galeria), mas as duas perguntas ainda se respondem por memória ou por bom senso. |
| Integrada | 5,0 | 5,0 | Sem mudança. |
| Identificada | 4,5 | 4,5 | B3 ainda não aplicado. |
| Externa (bruta) | 1,5 | 1,5 | Sem mudança. |
| Amotivação (bruta) | 1,5 | 1,5 | "Chavinha" com um sentido só e "Na mesma chave" ajudam, mas o Dossiê continua carregado. |
| **3.2 nota** | **4,6** | **4,6** | Passa. |

Nenhuma nota caiu.

## 5. Fim do ciclo

**As escalas das seções 2 e 3 passaram.** Seção 2: 5 de 5. Seção 3.1: 5,0. Seção 3.2: 4,6. As outras seções (história, conferência técnica, peças) não fazem parte desta avaliação.
