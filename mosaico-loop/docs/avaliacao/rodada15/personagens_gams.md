# Mosaico Loop v4 (revisão 14): avaliação das seções 2 e 3 (fichas, Big Five do conteúdo, GAMS) · rodada 15

Documento de projeto. Nada daqui aparece para quem joga.

Avaliei do zero sobre a revisão 14 (`dados/pistas-v4.json` e `LC_DADOS.versao`: "v4 revisão 14 (26/11/2026)", 281 pistas). Não abri navegador e não editei nada no repositório; escrevi só em `/tmp/roda/esc/rod15/`.

**O que li:** ESCALAS_AVALIACAO_JOGOS.md (inteiro); docs/FICHAS.md (inteiro); DECISOES-V4.md, revisão 14 inteira (e as linhas das revisões 11 a 13 que ela atualiza); ROTEIRO parte 20 (por busca); as falas de todos os personagens nas pistas (`rod15/pg/falas.py` imprime as 46 pistas citadas abaixo, direto do JSON); `LC_MG` inteiro, `lcResumoFinal`, `lcFatosFinal`, `LC_FATO_PISTA`, `LC_MISSOES`, mensagens do diagnóstico e do interfone em loop-central.js; `man_3.textoPorSintoma` e `textoPorPar`.

**O que conferi por script** (`rod15/pg/checa.py`): os 34 ids da tabela "Onde cada traço extremo aparece" existem (nenhum falta); 18 traços extremos em negrito (21 negritos menos os 3 da legenda). "Tá." só em `c_esc_3`, `cracha_3`, `coop_veredito` (Braga). "Desculpa" só em `d_teo_1` (Téo, escrito), `nico_0`, `nico_0b`, `nico_1` e `dis_balde` (Seu Dirceu, escrito). "Fui eu" só em `teo_radio_2d` e `d_fus_2b` (Téo). As outras 7 frases de "nunca diria" não aparecem em pista nenhuma; "Tenho certeza" aparece só em `game.js`, como rótulo do modo antigo de perguntas, que o Loop não monta (`game.js:1383`: "o Loop não monta as 8 perguntas do caso antigo"). "Lenz" no texto só da volta 3 em diante (`cracha_3`, `coop_veredito`, `v4_braga`, `lenz_2`). Os 11 textos com a letra do Téo terminam em "— T.". Varredura de 106 arquivos .js/.mjs/.html/.json/.css/.svg/.txt fora de docs/ (lista em `rod15/pg/arquivos.txt`) atrás de nomes de escala e de traço: só comentários de CSS ("rodada 3", "rodada 5 das escalas"), "escala de crachás" (objeto do mundo) e "escala da maquete" (comentário de código).

**O que vi nas capturas existentes** (`r14/cap/`): `desfecho_390` (fichas "O que o seu caderno trouxe · 6 de 9 fatos"), `desfecho_vazio_390` ("0 de 9", "Nenhum fato da noite saiu do seu caderno desta vez."), `caixa_390` (novo `c_peca`), `luz_antes_390` (novo `falsa_1.antes`), `luz_achou_390` (frase nova da luz sobre a máscara fosca com a inscrição). Isso cobre tudo o que a revisão 14 mudou e que pesa nestas seções.

Aviso: não escrevi nenhum texto do jogo. Como 8 de 8 personagens saem com 5 e a 3.2 sobe, reli cada fala e cada pergunta nova procurando motivo para tirar ponto; o que achei está nas justificativas e nas ressalvas.

---

## 1. Nota geral

**PASSA.** Seção 2: 5 de 5 itens passam. Seção 3.1: **5,0** (mínimo 4,5), ninguém abaixo de 4. Seção 3.2: **4,8** (mínimo 4,5). A revisão 14 não mexeu em fala de personagem (as frases reescritas são do narrador). Sobem Identificada (B3 aplicado: o desfecho do celular mostra os fatos que a pessoa trouxe) e Intrínseca (as duas perguntas fracas agora são decididas pelo caderno).

---

## 2. Tabela por critério

### 2.A Seção 2: checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md: os 8 têm papel, 5 traços, honestidade-humildade e 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". Seu Dirceu registrado como figurante, sem necessidade. A revisão 14 não criou personagem. |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 de 18 com cena; os 34 ids existem e o texto de cada um ainda mostra o traço (tabela 2.B). `e_hist_1` perdeu "Alguém ligou." mas mantém "Então ninguém liga isto sem mim. Ninguém.", que é a cena citada na ficha. |
| Falas e ações não contradizem a ficha | **Passa** | coerente | Marcas de voz no lugar certo (ver script). Ninguém diz o "nunca diria". Dra. Sato só pelo interfone ou por escrito (`man_3`, `sato_teo`, `a_hist_1`, `e_hist_1`, `man_2`); Téo só escrito ou gravado antes de 0:00 (`d_teo_2` cita uma fala dele relatada pelo Seu Dirceu, de antes de escurecer). As mudanças de prosa da revisão 14 (`lenz_3`, `teo_cadeira`, `e_hist_1`, `conserto_C`, `conserto_D`) são de narrador ou cortam frase de narrador; `lenz_3` agora descreve a pegada e a distância sem concluir, o que não toca a voz de ninguém. |
| Exceções registradas na ficha | **Passa** | completo | As 10 exceções batem com os dados: Téo só escrito/gravado; Nico só sai da repetição em `nico_1` (volta 4, com o número, "Pela primeira vez ele não pede desculpa"); Dra. Sato pelo interfone, vê o céu ("A Dra. Sato conta o raio pelo interfone: "Agora.""), "Desta vez eu confio" só para informação (objeto barrado: "Pelo interfone não passa objeto"); Aurélio na Galeria no Ouro; Lenz nomeado só da volta 3; "desde ontem" do Seu Dirceu (`c_anc_3`); noite do fusível (`d_teo_1`, `d_teo_2`, `d_fus_2b`). Nada da revisão 14 pede registro novo. |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura de 106 arquivos limpa (só comentários de CSS e de código, e "escala de crachás"). As frases do papel e dos minijogos novos não usam termo de projeto. |

### 2.B Traço extremo e cena (conferido pista por pista)

| Pessoa | Traço extremo | Cena | Ok? |
|---|---|---|---|
| Aurélio | Neuroticismo alto | `aurelio_0` ("Está linda, não está?" Ele não parece ter certeza), `falsa_1` (respira pela boca) | sim |
| Aurélio | Sensibilidade à privação baixa | `aurelio_1` ("Eu demorei para acreditar." / "eu sei de cor, nunca mais li.") | sim |
| Aurélio | Tolerância ao estresse baixa | `aurelio_2` ("Disse a mim mesmo que era cansaço dele. Era medo meu.") | sim |
| Téo | Honestidade alta | `data_3`, `d_teo_1` ("Desculpa, Dra. Sato."), `d_fus_2b` ("Fui eu. — T."), `teo_radio` (o envelope: "Eu não peguei.") | sim |
| Téo | Sensibilidade à privação alta | `teo_d1` ("Sozinho pra quê?"), `v4_teo` ("Eu sei o que eu carrego.") | sim |
| Téo | Busca de emoção alta | `teo_d3` ("Hoje à noite eu falo com ele."), `teo_radio` ("cara a cara") | sim |
| Ivone | Conscienciosidade alta | `ivone_1x` ("Eu não perco pote."), `v5_ivone` ("Limpei, pesei, devolvi: 4,2 kg.") | sim |
| Ivone | Curiosidade social baixa | `ivone_2` ("Devia ter perguntado por quê."), `ivone_red` (aponta a porta "sem olhar") | sim |
| Braga | Amabilidade alta | `traj_aviso` ("Pega um café, tá fresco"), `c_esc_3`, `cracha_3` ("Quer um café?"), `dis_cafe` | sim |
| Braga | Tolerância ao estresse baixa | `braga_1` (dá de ombros rápido demais), `v4_braga` (riscado duas vezes), `coop_veredito` (engole seco) | sim |
| Lenz | Amabilidade baixa | `lenz_0` (não espera a resposta), `lenz_1` ("Nem você."), `traj_3` (sai sem olhar para você) | sim |
| Lenz | Honestidade baixa | `lenz_2` ("Eu devolvo tudo que eu pego.", com a foto do Braga no crachá) | sim |
| Lenz | Tolerância ao estresse baixa | `traj_3` (fala sozinho na escada), `lenz_mot_3` ("ou eu não tenho mais empresa pra te pagar") | sim |
| Lenz | Busca de emoção alta | `v5_lenz` ("Peça por fora: +?", "ninguém confere a base") | sim |
| Dra. Sato | Abertura alta | `man_anc_2` ("Nunca aconteceu, mas vai que"), `man_2` ("Ou não.") | sim |
| Dra. Sato | Sensibilidade à privação alta | `man_3` ("Me conta o que você viu com os seus olhos."; `textoPorSintoma` sempre devolve uma pergunta), `a_hist_1`, `e_hist_1` ("Ninguém.") | sim |
| Nico | Conscienciosidade baixa | `nico_0b` ("onde eu tava?"), `nico_1.porque` ("Ele pediu... espera." / "E... o laudo!"), `fh_fusivelx` (fusível para a cafeteira) | sim |
| Nico | Curiosidade social alta | `nico_0` ("cara de quem não jantou", "a Ivone hoje tá brava"), `nico_0b` (o Braga e o cinto) | sim |

### 2.C Ressalvas (nenhuma derruba item)

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | `man_3.textoPorSintoma` e `textoPorPar` | 3 das 7 respostas seguem o molde "ou isto, ou aquilo" (`sint_carga` "pode ser duas coisas", `sint_luz` "Ou tem coisa puxando, ou tem coisa faltando", e o par). Combina com "não aceita palpite" e sempre termina devolvendo a tarefa. | menor, sem correção necessária |
| 2 | `loop-central-dados.js`, linha 1 | O comentário de cabeçalho ainda diz "v4 revisão 13", enquanto `LC_DADOS.versao` diz revisão 14. Comentário de código, invisível ao jogador; é da conferência técnica, não destas seções. | menor (fora do escopo) |

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só escrito e gravado, e só podia ser ele: peso e medida ("A peça tem a mesma cara e pesa diferente. Eu sei o que eu carrego.", `v4_teo`), frase curta e ordem direta ("Tinta não mente.", `teo_d3`; "Não religar. Fui eu.", `d_fus_2b`), olho de montador ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`). Procurei frase genérica e não achei. |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada: `lenz_0` ("rapidinho... Ótimo, ótimo."), `lenz_2` ("Emprestado. Tá escrito aí" / "Lenz. Agora não."), `lenz_1` ("Ninguém quer confusão hoje. Nem você."), `lenz_mot_3` ("Fim do mês"), `v5_lenz` (a conta no guardanapo). Nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Seca e com número: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone` ("4,2 kg", "letra miúda e reta"). |
| Dra. Sato | 5,0 | 4 | Chama a máquina de "ela", frase de rádio, devolve a pergunta, humor seco: `man_2` ("Ou não."), `e_hist_1` ("Ninguém."), `a_hist_1` ("É a minha tranca."), `sato_teo` ("Nem melhora. Fica guardado, igual a uma peça numa vitrine."), `man_3` (cada sintoma termina com uma ordem ou pergunta para quem joga). O molde de 2.C-1 não tira meio ponto. |
| Seu Dirceu | 5,0 | 4 | Figurante com voz e esfregão/pano na mão: `traj_2` ("Nem boa-noite."), `ivone_ali_2` ("passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `dirceu_0` ("Amanhã ninguém lembra quem limpou."), `d_teo_2` ("Eu reparo."), `dis_balde` ("Compro outro."). |
| Braga | 5,0 | 4 | Fala muito e foge do assunto (chuva e porta em `traj_aviso`, cunhado em `braga_1` e `c_esc_3`, café em quatro pistas); as verdades começam com "Tá."; "ali do lado da limpeza" (`cracha_3`); "Tive medo de perder o emprego" (`v4_braga`) é o desejo da ficha sem a frase de "nunca diria". |
| Aurélio | 5,0 | 4 | Pergunta em vez de afirmar (`aurelio_0`; `aurelio_1` "Você também sentiu?"), palavra de acervo ("Peça de acervo não cheira a novo."), foge da lacuna ("eu sei de cor, nunca mais li."), pede desculpa sem a palavra ("Era medo meu."). |
| Nico | 5,0 | 4 | Repara nas pessoas antes de falar de si (`nico_0`, `nico_0b`), perde o fio e se repete ("eu já te disse isso?", duas vezes), tropeça na regra do Téo (`nico_1.porque`) e, com o número, "pisca, como quem acorda" e não pede desculpa. Desconto considerado: pouco texto; mas o que existe não deixa dúvida de quem fala, e a escala mede reconhecimento, não volume. |
| **Média (8 com fala)** | **5,0** | **4,5** | 40 ÷ 8 = 5,0. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 5,0 | O jogo puxa sozinho: o museu esquece, as pessoas só mudam de fala quando você mostra o caderno, as trancas têm frase do mundo, há gravador, pêndulo, O Raio, escrita antiga na máscara e cofre pelo registro. O que segurava em 4,5 eram as duas perguntas resolvidas por memória ou bom senso, e a revisão 14 mexeu nas duas: `c_peca` ("Pelo que o seu caderno diz da caixa do patrocínio, qual você abre?", `caixa_390`) agora pede ligar "patrocínio" a "banners" pelas pistas `c_esc_1`, `c_esc_2` ou `lenz_meio_1`, e as 4 etiquetas têm aviso, então "NÃO ABRIR" não salta sozinho; `falsa_1.antes` só aparece para quem tem `par_foto` e pede a descrição da foto em 4 combinações de cor, superfície e bordas (`luz_antes_390`), o que arma a comparação que a luz confirma ("Nenhuma borda gasta, nenhum risco de uso.", `luz_achou_390`). Descontos que considerei e que não tiram meio ponto: a resposta de `falsa_1.antes` é a frase literal de `par_foto` (é conferir, não deduzir, mas é conferir com a fonte certa, que é o que o jogo ensina); quem abriu `c_peca` só com `c_esc_3` não tem "banners" no caderno (as dicas mandam à guia e à lista, e errar não custa: ressalva A1). |
| Integrada | 5,0 | Papel numa frase clara na entrada ("Nesta atividade você vive o papel de quem lembra das voltas. O museu esquece. Você e o seu caderno, não.", `sala/index.html:48`). 8 missões secretas, nenhuma fecha com um toque no primeiro minuto (`LC_MISSOES`); papéis da volta 5 com tarefa própria; nome de quem trouxe cada fato no telão. |
| Identificada | 5,0 | O diagnóstico pede um raciocínio que a pessoa reconhece como dela, e o texto aceito agora diz isso sem voz de formulário ("Os seus dois sinais apontam para o mesmo lado, e a sua leitura normal diz "aqui não é"."). O que faltava para 5 nas rodadas 11 a 13 entrou: o desfecho do celular mostra "O que o seu caderno trouxe · 6 de 9 fatos" em fichas com miniatura e rótulo curto (`desfecho_390`; `lcFatosFinal` usa `window.lcFatos`), e, quando nada veio, uma frase honesta e sem castigo (`desfecho_vazio_390`). A inscrição ensina a conferir com a fonte; "Para conversar" deixa a pergunta de valor no telão. |
| Externa (menos é melhor) | bruta 1,5, invertida 4,5 | Não há ponto nem ranking no Loop (o placar de 100 pontos de `game.js` é do modo antigo e não é montado no Loop). A recompensa é +1 de energia, o nome no telão e o final. Errar minijogo sem custo está em "Ficou para decidir" e não pesou. Fica meio ponto pelo tom de sistema que resta em algumas mensagens ("A MÁQUINA NÃO REAGE", "(A tentativa desta volta foi gasta.)"), que puxa para "cumprir tarefa". |
| Amotivação (menos é melhor) | bruta 1,5, invertida 4,5 | A pessoa sempre sabe o que falta e por quê: trancas com frase do mundo, "Falta: ...", fichas do Revelar, e agora o desfecho que mostra o que ela trouxe mesmo quando o caso fica aberto. Sobra o de sempre: muita palavra de regra junta no Dossiê. |
| **Nota da escala** | **4,8** | (5,0 + 5,0 + 5,0 + 4,5 + 4,5) ÷ 5 = 4,8. Mínimo 4,5. **Passa.** |

Introjetada: neutra, não pontua.

#### O que ainda segura a 3.2 abaixo de 5: texto ou dado × mecânica

| O que segura | Tipo | Subescala |
|---|---|---|
| Mensagens com voz de sistema e caixa alta no diagnóstico ("A MÁQUINA NÃO REAGE", "(A tentativa desta volta foi gasta.)") | (a) texto | Externa |
| Muita palavra de regra junta no Dossiê | (a) texto | Amotivação |

**O que só jogadores reais mostrariam (não puni):**
- se 5 de energia diante de 5 a 19 itens por sala dá gosto de escolha ou sensação de falta;
- se a turma liga sozinha a tábua da Conservação à testa da máscara da Galeria, e se a rachadura nova do lado direito é notada na peça 3D;
- se o palpite antes da luz é sentido como hipótese e teste ou como cópia do caderno;
- se "6 de 9 fatos" no desfecho é sentido como reconhecimento ou como nota;
- se gastar energia em item de ambiente parece "o museu é vivo" ou energia perdida;
- se girar a peça 3D e caçar os pontos dá prazer ou cansa em 15 salas;
- se os 10 segundos de caminhada criam tensão ou tédio; se a Sala das esculturas fechada desperta curiosidade ou frustração;
- se falar em voz alta de salas diferentes funciona numa sala cheia; se alguém blefa a missão secreta;
- se a legenda do gravador é clima ou espera; se o pêndulo vira graça ou briga;
- o ritmo das voltas 3 e 4; se a turma lê a fita do telão; se "Para conversar" abre conversa.

**Decisões do autor ou em "Ficou para decidir" (não pesaram):** seletor de entrada e "Obrigado por participar!"; erro de minijogo sem custo; piso de volta em `nico_1`, `cracha_3`, `lenz_2`; a testa da máscara à vista desde a volta 1; Revelar só na volta 5; a disposição da planta; os símbolos da escrita antiga.

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

**Nada ficou abaixo do mínimo. Nada é obrigatório nestas seções.**

(a) Obrigatórias: nenhuma.

(b) Retoques opcionais:

- **A1. `LC_MG.c_peca`, caminho só com `c_esc_3` (umas 10 palavras ou 1 condição).** Quem abre a caixa tendo só a gravação do Braga ("duas caixas iguais") não tem "banners" no caderno para decidir. Ou pôr em `c_esc_3` a palavra da etiqueta ("duas caixas de banners iguais"), ou mostrar a pergunta só a quem tem `c_esc_1`, `c_esc_2` ou `lenz_meio_1` (como já se faz em `falsa_1.antes` com `par_foto`). Não muda regra.
- **A2. Voz de sistema no diagnóstico (umas 15 palavras).** Trocar "A MÁQUINA NÃO REAGE" e "(A tentativa desta volta foi gasta.)" por frase do mundo, no tom de "Quase." (ex.: "A Câmara fica muda. As provas até combinam, mas o defeito é outro. Só na próxima volta."). Levaria a Externa a 5 e a 3.2 a 4,9.
- **A3. Comentário de cabeçalho de `loop-central-dados.js`** ("revisão 13" → "revisão 14"). Da conferência técnica; invisível ao jogador.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (rodada 13, rev. 13) | Agora (rodada 15, rev. 14) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem personagem novo. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | 34 ids conferidos por script; `e_hist_1` segue com a frase da ficha. |
| 2.4 falas não contradizem a ficha | Passa (1 ressalva + 1 observação visual) | Passa (1 ressalva) | A observação da luz saiu: o texto agora fala de "grão da pedra", que bate com a imagem. Fica o molde do interfone. |
| 2.4 exceções registradas | Passa | Passa | Nada pede registro novo. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa. |
| Téo | 5,0 | 5,0 | Sem mudança de fala. |
| Lenz | 5,0 | 5,0 | `lenz_3` mudou, mas é narrador. |
| Ivone | 5,0 | 5,0 | Sem mudança. |
| Dra. Sato | 5,0 | 5,0 | `e_hist_1` perdeu uma frase de narrador; a voz ficou. |
| Seu Dirceu | 5,0 | 5,0 | Sem mudança. |
| Braga | 5,0 | 5,0 | Sem mudança. |
| Aurélio | 5,0 | 5,0 | Sem mudança. |
| Nico | 5,0 | 5,0 | Sem mudança. |
| **3.1 média** | **5,0** | **5,0** | Passa. |
| Intrínseca | 4,5 | 5,0 | `c_peca` e `falsa_1.antes` agora são decididas pelo caderno, não por memória do cheiro nem pela idade da peça. |
| Integrada | 5,0 | 5,0 | Sem mudança. |
| Identificada | 4,5 | 5,0 | B3 aplicado: fatos da pessoa no desfecho do celular, com estado vazio honesto. |
| Externa (bruta) | 1,5 | 1,5 | Restos de formulário reescritos em parte; "A MÁQUINA NÃO REAGE" continua. |
| Amotivação (bruta) | 1,5 | 1,5 | Dossiê continua carregado. |
| **3.2 nota** | **4,6** | **4,8** | Passa. |

Nenhuma nota caiu.

## 5. Fim do ciclo

**As escalas das seções 2 e 3 passaram.** Seção 2: 5 de 5. Seção 3.1: 5,0. Seção 3.2: 4,8. Obrigatórias: nenhuma. As outras seções (história, conferência técnica, peças) não fazem parte desta avaliação.
