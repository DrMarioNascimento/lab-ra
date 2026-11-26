# Mosaico Loop v4 (revisão 13): avaliação das seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliei do zero, sobre `dados/pistas-v4.json` com a marca "v4 revisão 13 (26/11/2026)" (286 registros com texto) e sobre `loop-central.js`. Não mexi no repositório. Escrevi só em `/tmp/roda/esc/rod12/`.

**O que li:** ESCALAS_AVALIACAO_JOGOS.md (inteiro); docs/FICHAS.md (inteiro); DECISOES-V4.md (revisões 11, 12 e 13 inteiras, incluindo "Não aplicado" e "Ficou para decidir"); a avaliação anterior `docs/avaliacao/rodada10/personagens_gams.md` (só para a coluna "antes"); pistas_legivel.txt (todas as falas e todos os escritos das 8 pessoas, mais `man_3` com `textoPorSintoma` e `textoPorPar`); atividades.txt (finais, incluindo o Ouro do Aurélio); `LC_MG` (minijogos), `lcResumoFinal`, `window.lcFatos` e `LC_GLOS_LISTA` em loop-central.js.

**O que conferi por script** (`pg/checa.py`, saída em `pg/checa.out`; `pg/diff.py` compara a revisão 11 com a 13):
- os 34 ids da última tabela da ficha existem nos dados (nenhum falta); 18 traços extremos em negrito na tabela de base;
- "Tá." aparece só em `c_esc_3`, `cracha_3` e `coop_veredito` (Braga);
- "Desculpa" aparece só em `d_teo_1` (Téo, escrito), `nico_0`, `nico_0b`, `nico_1` (Nico) e `dis_balde` (Seu Dirceu);
- "Fui eu" aparece só em `teo_radio_2d` e `d_fus_2b` (Téo; quem nunca diria isso é o Lenz). As outras 7 frases da coluna "nunca diria" não aparecem;
- "Lenz" aparece só em pistas de volta 3 ou mais (`cracha_3`, `coop_veredito`, `v4_braga`, `lenz_2`);
- 11 textos com a letra do Téo terminam em "— T.", e nenhum ficou sem a assinatura;
- da revisão 11 para a 13, mudaram 9 pistas (`a_cheia_4`, `fh_med_pot_bce`, `fh_med_pot_d`, `foto_solo`, `coop_copia_ok`, `insc_verdadeira`, `chao_peca`, `mancha_2`, `quadro_aberto`). **Nenhuma é fala de personagem.** Nos minijogos mudaram a dica de `c_peca` e a pergunta e as dicas de `falsa_1.antes`;
- procurei nomes de escala e de traço em todos os .js, .mjs, .html, .json, .svg e .css fora de docs/: só apareceu um comentário de CSS (`style.css:521`, "rodada 5 das escalas"), que nenhuma tela mostra.

**O que vi na tela** (capturas da revisão 13 em `/tmp/roda/esc/r12/vis` e `extra`): entrada com a frase do papel (`vis/03`), planta (`vis/04`), Dossiê (`vis/09`), Revelar (`vis/10_maquina_revelar`), sala da Galeria com a máscara 3D (`extra/galeria_sala_390`), minijogo da luz nos três estados (`extra/luz_antes_390`, `luz_escuro_390`, `luz_achou_390`). As capturas cobrem o que mudou, então não gerei outras.

Aviso de autoavaliação: não escrevi nenhum texto do jogo. Como 8 de 8 personagens tiram 5, reli cada fala de propósito procurando motivo para tirar ponto. O que achei está anotado na justificativa de cada um.

---

## 1. Nota geral

**PASSA.** Seção 2: os 5 itens passam. Seção 3.1: **5,0** (mínimo 4,5), ninguém abaixo de 4. Seção 3.2: **4,6** (mínimo 4,5). A revisão 13 não mexeu em fala de personagem. Os dois minijogos que seguravam a Intrínseca melhoraram, mas ainda dá para acertar os dois por bom senso. O desfecho do celular continua sem os fatos que a pessoa trouxe (B3, "Não aplicado"), então a 3.2 fica na mesma faixa.

---

## 2. Tabela por critério

### 2.A Seção 2: checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md: os 8 têm papel (o perfil do cânone), os 5 traços, honestidade-humildade e as 5 dimensões da curiosidade (11 colunas), e também desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". Seu Dirceu está registrado como figurante. Nenhum personagem entrou. |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 de 18 têm cena, e os 34 ids da tabela existem. Conferi um por um (2.B). Nenhuma das 9 pistas alteradas era cena de traço. |
| Falas e ações não contradizem a ficha | **Passa** | coerente | As marcas de voz estão no lugar certo (ver acima). Ivone fala de parte do dia e de quantidade ("no fim da tarde", "de manhã", "4,2 kg"), nunca de hora marcada. A Dra. Sato não diz "Tá." e só comenta o que você conta (`man_3`). O Lenz nunca fala da peça como arte. O Seu Dirceu diz "Eu reparo." (`d_teo_2`), o contrário do "Não reparei." que ele nunca diria. A planta da revisão 12 (armário colado na Base da limpeza, porta de serviço na Área de descanso) bate com `cracha_2`, `cracha_3` e com a voz do Braga ("conheço aquela porta de olho fechado"). Fica uma ressalva de acabamento (2.C). |
| Exceções registradas na ficha | **Passa** | completo | As 10 exceções batem com os dados: Téo só escrito ou gravado; Nico só sai da repetição em `nico_1.texto`; a Dra. Sato fala só pelo interfone e vê o céu; o Aurélio, no Ouro, fica na Galeria e diz "Obrigado por não esquecer."; o nome do Lenz só aparece da volta 3 em diante; o "desde ontem" do Seu Dirceu (`c_anc_3`) e a noite do fusível (`d_teo_2`) estão lá. A revisão 13 não pedia registro novo na ficha (nenhuma fala mudou). |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura limpa, só o comentário de CSS citado acima. "Escala" nos dados é a escala de crachás, um objeto do mundo. |

### 2.B Traço extremo e cena (conferido pista por pista)

| Pessoa | Traço extremo | Cena | Ok? |
|---|---|---|---|
| Aurélio | Ansiedade alta | `aurelio_0` ("Está linda, não está?" Ele não parece ter certeza), `falsa_1` (respira pela boca) | sim |
| Aurélio | Foge da lacuna | `aurelio_1` ("Eu demorei para acreditar. Na testa dela tem uma frase; eu sei de cor, nunca mais li.") | sim |
| Aurélio | Não aguenta pressão | `aurelio_2` ("Disse a mim mesmo que era cansaço dele. Era medo meu.") | sim |
| Téo | Honestidade alta | `data_3`, `d_teo_1` ("Desculpa, Dra. Sato. — T."), `d_fus_2b` ("Fui eu. — T."), `teo_radio` ("Eu não peguei.") | sim |
| Téo | Não larga a lacuna | `teo_d1` ("Sozinho pra quê?"), `v4_teo` ("Eu sei o que eu carrego.") | sim |
| Téo | Aceita risco | `teo_d3` ("Hoje à noite eu falo com ele."), `teo_radio` ("cara a cara") | sim |
| Ivone | Método | `ivone_1x` ("Eu não perco pote."), `v5_ivone` ("Limpei, pesei, devolvi: 4,2 kg.") | sim |
| Ivone | Pouca curiosidade pelas pessoas | `ivone_2` ("Devia ter perguntado por quê."), `ivone_red` (aponta sem olhar) | sim |
| Braga | Quer agradar | `traj_aviso` ("Pega um café, tá fresco"), `c_esc_3` ("Café?"), `cracha_3` ("Quer um café?"), `dis_cafe` | sim |
| Braga | Não aguenta pressão | `braga_1` (dá de ombros rápido demais), `v4_braga` (riscado duas vezes), `coop_veredito` (engole seco) | sim |
| Lenz | Pouca amabilidade | `lenz_0` (não espera a resposta), `lenz_1` ("Nem você."), `traj_2` (sem boa-noite) | sim |
| Lenz | Pouca honestidade | `lenz_2` ("Eu devolvo tudo que eu pego."), `cracha_2` | sim |
| Lenz | Não aguenta pressão | `traj_3` (fala sozinho na escada), `lenz_mot_3` ("ou eu não tenho mais empresa pra te pagar") | sim |
| Lenz | Busca risco | `v5_lenz` ("Peça por fora: +?", "ninguém confere a base") | sim |
| Dra. Sato | Abertura | `man_anc_2` ("Nunca aconteceu, mas vai que"), `man_2` ("Ou não.") | sim |
| Dra. Sato | Não larga a lacuna | `man_3` ("Me conta o que você viu com os seus olhos."), `a_hist_1`, `e_hist_1` ("Ninguém.") | sim |
| Nico | Pouca ordem | `nico_0b` (perde o fio), `nico_1.porque` ("Ele pediu... espera.", "E... o laudo!"), `fh_fusivelx` (fusível para a cafeteira) | sim |
| Nico | Muita atenção às pessoas | `nico_0` ("cara de quem não jantou", "a Ivone hoje tá brava"), `nico_0b` (o Braga e o cinto) | sim |

### 2.C Ressalvas (nenhuma derruba item)

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | `man_3`, respostas do interfone | 3 das 7 respostas seguem o molde "ou isto, ou aquilo" (`sint_carga`, `sint_luz`, o par). Combina com "não aceita palpite". | menor, não precisa corrigir |

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só escreve, e só pode ser ele: peso e medida ("A peça tem a mesma cara e pesa diferente. Eu sei o que eu carrego.", `v4_teo`), frase curta ("Tinta não mente.", `teo_d3`), olho de montador ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`), lista riscada até "falar com ele" (`fh_papel_teo`). Procurei frase genérica e não achei. |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada em toda fala: `lenz_0` ("rapidinho... Ótimo, ótimo."), `lenz_2` ("Eu devolvo tudo que eu pego." / "Lenz. Agora não."), `lenz_1` ("Nem você."), `lenz_mot_3` (prazo e dinheiro), `b_hist_2` ("Cada litro de diesel sai do nosso bolso."). |
| Ivone | 5,0 | 4 | Seca e com número: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone` (letra miúda e reta), `dis_cafeira`. |
| Dra. Sato | 5,0 | 4 | Mais de 15 textos no mesmo tom: chama a máquina de "ela", devolve a pergunta, humor seco (`man_2` "Ou não.", `e_hist_1` "Ninguém.", `fh_ficha_bc` "Levar o guarda-chuva."), frase de rádio (`sato_teo`). O molde de 2.C-1 não chega a pesar. |
| Seu Dirceu | 5,0 | 4 | Figurante com voz e com objeto na mão: `traj_2` (aponta com o esfregão, "Nem boa-noite."), `ivone_ali_2` ("passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `assim_leg` ("Quem sujou meu chão?"), `d_teo_2` ("Eu reparo."), `dis_balde`, `arm_aviso`. |
| Braga | 5,0 | 4 | Fala muito e foge do assunto por três caminhos (a chuva e a porta em `traj_aviso`, o cunhado em `braga_1` e `c_esc_3`, o café). As três verdades começam com "Tá.". O "ali do lado da limpeza" (`cracha_3`) é jeito de quem conhece o prédio de olho fechado. |
| Aurélio | 5,0 | 4 | Pergunta em vez de afirmar (`aurelio_0`, `aurelio_1` "Você também sentiu?"), usa palavra de acervo ("Peça de acervo não cheira a novo."), foge da lacuna com as próprias palavras ("eu sei de cor, nunca mais li."), pede desculpa sem a palavra (`aurelio_2` "Era medo meu."), agradece no Ouro sem sair da Galeria. |
| Nico | 5,0 | 4 | Repara nas pessoas (`nico_0`, `nico_0b`), perde o fio e se repete ("eu já te disse isso?" duas vezes), e a regra do Téo sai aos tropeços (`nico_1.porque`). Com o número, ele "pisca, como quem acorda" e para de pedir desculpa. Desconto que considerei: tem pouco texto, e só `nico_0` é certo na volta 1. Mesmo assim, o que existe não deixa dúvida de quem está falando. |
| **Média (8 com fala)** | **5,0** | **4,5** | 40 ÷ 8 = 5,0. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 4,5 | O jogo puxa sozinho: o museu esquece e você não, as pessoas só mudam de fala quando você mostra o caderno, a inscrição está gravada na máscara 3D e reaparece agora na imagem da luz de lado (`extra/luz_achou_390`), tem o gancho do Aurélio ("Na testa dela tem uma frase"), cofre, pêndulo, gravador e peças com pontos. Na revisão 13, a dica de `c_peca` parou de entregar a resposta ("No caderno, procure a pista “A peça principal”.") e `falsa_1.antes` virou uma previsão feita a partir do que a pessoa já tem, que a luz depois confirma ou desmente (`extra/luz_antes_390`). Por que ainda não é 5: as duas perguntas continuam fáceis. `c_peca` é lembrar de uma pista que já está no caderno, e as quatro opções são cheiros. `falsa_1.antes` se resolve por bom senso ("coisa velha tem desgaste"), e a mensagem de erro diz isso ("Pense no que o tempo faz com uma peça."). Nenhuma das duas está em "Ficou para decidir", então contei. |
| Integrada | 5,0 | O papel aparece numa frase clara na entrada ("Nesta atividade você vive o papel de quem lembra das voltas. O museu esquece. Você e o seu caderno, não.", `vis/03`). Cada pessoa tem missão secreta, há a página "Missões" no telão, "Quem trouxe" em cada fato e papéis na volta 5. A escrita antiga entalhada dá ao museu uma cultura que é só dele. A planta em papel, com orelhas por andar (`vis/04`), reforça o "estou dentro deste prédio". |
| Identificada | 4,5 | O diagnóstico pede um raciocínio que a pessoa reconhece como dela (2 sinais de tipos diferentes + 1 leitura normal, `vis/09`). Os finais dependem da escolha, "Para conversar" deixa a pergunta de valor no telão e a inscrição ensina a conferir com a fonte. Por que não é 5 (igual à rodada anterior): o desfecho do celular (`lcResumoFinal`) mostra as 3 fichas e as 3 provas, mas não quais fatos da noite aquela pessoa trouxe (`window.lcFatos` existe e não é usado ali). Isso está em "Não aplicado" na revisão 13 (B3), não em "Ficou para decidir", então contei. |
| Externa (menos é melhor) | 1,5, invertida 4,5 | Não tem ponto nem ranking. A recompensa é +1 de energia, o nome no telão e o final. Errar minijogo sem custo está em "Ficou para decidir" e não pesou. Os restos de formulário e a voz de sistema são decisão registrada e não pesaram. |
| Amotivação (menos é melhor) | 1,5, invertida 4,5 | A pessoa sempre sabe o que falta e por quê: frase do mundo em cada tranca, "Falta: ..." nas atividades, três fichas de passo no Revelar (`vis/10_maquina_revelar`). A planta deixa claro onde você está e para onde vai, e o "Toda volta começa aqui." está escrito no Saguão. Ficam dois atritos pequenos, que não tiram meio ponto: (1) `falsa_1.antes` diz "Pelo que você já anotou...", mas abre ao pegar `falsa_1`, a primeira pista da Galeria, então o caderno pode estar vazio (a dica manda para o Dicionário, que sempre está lá); (2) no fim do minijogo da luz, a imagem mostra pedra fosca e granulada e o texto diz "O verniz brilha por igual, de ponta a ponta." (a decisão da revisão 13 explica que é efeito de luz rasante, mas a imagem não mostra esse brilho). Continua havendo muita palavra de regra junta no Dossiê. |
| **Nota da escala** | **4,6** | (4,5 + 5,0 + 4,5 + 4,5 + 4,5) ÷ 5 = 4,6. Mínimo 4,5. **Passa.** |

Introjetada: neutra, não pontua.

#### O que segura a 3.2

| O que segura | Tipo | Subescala |
|---|---|---|
| `c_peca`: pergunta de lembrar o que já está no caderno | texto/dado | Intrínseca |
| `falsa_1.antes`: previsão que o bom senso resolve | texto/dado | Intrínseca |
| Desfecho do celular sem os fatos da pessoa (`lcResumoFinal`) | mecânica (tela) | Identificada |
| Imagem da luz fosca × "verniz brilha por igual"; "já anotou" com o caderno talvez vazio | texto/imagem | Amotivação (não tira meio ponto) |

**O que não dá para julgar sem jogadores reais (não puni):**
- se 5 de energia contra 5 a 19 itens por sala dá gosto de escolher ou sensação de falta, e se gastar 1 na tábua na volta 1, sem uso imediato, parece boa aposta;
- se a turma liga a tábua da Conservação à testa da máscara da Galeria sem ajuda, e se a fala do Aurélio funciona como gancho;
- se alguém dá zoom na testa da máscara 3D (agora mais perto e para onde está o dedo) e confere ali, ou só usa o minijogo;
- se a previsão "antes de acender a luz" dá o prazer de acertar a hipótese ou parece pergunta de escola;
- se a imagem da luz de lado é lida como "brilho por igual" ou como desgaste;
- se o minijogo dá prazer de "achei" ou é rápido demais para ser lembrado;
- se a planta com orelhas se lê depressa durante os 10 s de caminhada;
- se gastar energia em item de ambiente parece "o museu é vivo" ou energia perdida;
- se girar a peça 3D e caçar os pontos dá prazer ou cansa ao longo de 15 salas;
- se falar em voz alta de salas diferentes funciona numa sala cheia; se alguém blefa a missão secreta na pausa;
- se a legenda do gravador é sentida como clima ou como espera; se o pêndulo vira graça ou briga;
- o ritmo das voltas 3 e 4 para quem já tem diagnóstico; se a turma lê a fita do telão e se "Para conversar" abre conversa.

**Decisões em "Ficou para decidir" ou do autor (opcionais, não pesaram):** "tábua" com dois sentidos; resposta errada em minijogo sem custo; entrada por papel nos consertos em dupla; piso de volta em `nico_1`, `cracha_3` e `lenz_2`; missão do Nico só possível na volta 4; "quem" e "por quê" quase inteiros na volta 1; restos de formulário e voz de sistema; a Dra. Sato e as voltas; Revelar só na volta 5; `d_teo_2` sem tranca; `aurelio_1` na volta 1; disposição das salas na planta e papel sobrando no 2º andar e no Subsolo; testa da máscara à vista desde a volta 1; seletor da entrada e "Obrigado por participar!".

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

**Nada ficou abaixo do mínimo. Lista (a), obrigatórias: nenhuma.**

**(b) Retoques opcionais** (dão margem na 3.2; nenhum é necessário para passar):

- **B1. Fatos da pessoa no desfecho do celular** (`lcResumoFinal`; já pede decisão do autor). Mostrar, abaixo das 3 provas, quais fatos da fita vieram do caderno dela (`window.lcFatos()` já está pronto). Mexe em tela, não em regra. Leva a Identificada a 5.
- **B2. `LC_MG.c_peca`** (umas 20 palavras). Trocar a pergunta de lembrar por uma que cruze duas pistas, por exemplo qual caixa pesa mais do que diz a etiqueta (`c_esc_1`, `lenz_meio_1`, `lenz_meio_2`). Pede teste de tela.
- **B3. `LC_MG.falsa_1.antes`** (umas 10 palavras). Trocar "Pelo que você já anotou e leu" por "Pelo que o Dicionário diz da peça principal" (o caderno pode estar vazio nessa hora).
- **B4. `falsa_1.luz.achou`** (umas 8 palavras) ou a imagem `GAL_B_mascara.webp`. Fazer a frase bater com o que a imagem mostra (por exemplo, "Nenhum risco, nenhuma borda gasta: tudo inteiro de ponta a ponta."), igual ao que a revisão 13 fez em `foto_solo` e `coop_copia_ok`.

Com B1 e B2, a 3.2 iria a (5 + 5 + 5 + 4,5 + 4,5) ÷ 5 = 4,8.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (rodada 10, sobre a rev. 11) | Agora (sobre a rev. 13) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Nenhum personagem entrou. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | 34 ids conferidos por script; nenhuma cena mudou. |
| 2.4 falas não contradizem a ficha | Passa (1 ressalva) | Passa (1 ressalva) | Nenhuma fala mudou; a planta da rev. 12 bate com o armário e a porta de serviço. |
| 2.4 exceções registradas | Passa | Passa | Nada novo a registrar. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa. |
| Téo / Lenz / Ivone / Dra. Sato / Seu Dirceu / Braga / Aurélio / Nico | 5,0 cada | 5,0 cada | Nenhuma fala mudou (diff da rev. 11 para a 13). |
| **3.1 média** | **5,0** | **5,0** | Passa. |
| Intrínseca | 4,5 | 4,5 | Melhorou por dentro (dica de `c_peca` sem a resposta, `falsa_1.antes` como previsão, imagem da luz com a inscrição), mas as duas perguntas continuam fáceis. |
| Integrada | 5,0 | 5,0 | A planta reforça o lugar. |
| Identificada | 4,5 | 4,5 | B3 continua "Não aplicado". |
| Externa (bruta) | 1,5 | 1,5 | Sem mudança. |
| Amotivação (bruta) | 1,5 | 1,5 | A planta ajuda; dois atritos pequenos e novos no minijogo da luz não tiram meio ponto. |
| **3.2 nota** | **4,6** | **4,6** | Passa. |

Nenhuma nota caiu.

## 5. Fim do ciclo

**As escalas das seções 2 e 3 passaram.** Seção 2: 5 de 5. Seção 3.1: 5,0. Seção 3.2: 4,6. As outras seções (história, conferência técnica, peças) não fazem parte desta avaliação.
