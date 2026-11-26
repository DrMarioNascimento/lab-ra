# Mosaico Loop v4 (revisão 14): avaliação das seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliei do zero sobre a revisão 14. `dados/pistas-v4.json` diz "v4 revisão 14 (26/11/2026)" e tem 281 pistas. Não editei nada no repositório. Escrevi só em `/tmp/roda/esc/rod14/`, com os scripts em `rod14/pg/`. Não abri navegador.

**O que li:** ESCALAS_AVALIACAO_JOGOS.md (inteiro), FICHAS.md (inteiro), DECISOES-V4.md revisões 13 e 14 (com "Não aplicado" e "Ficou para decidir"), ROTEIRO-LOOP parte 20, as 281 pistas (gerei de novo do repositório em `rod14/pg/pistas_legivel.txt`, e o arquivo saiu igual a `/tmp/roda/esc/pistas_legivel.txt`), as falas com nome de personagem (`rod14/pg/falas.txt`, 83 pistas, mais as 6 do Lenz sem nome no texto), `LC_MG`, `LC_MGA`, `LC_FATO_PISTA`, `lcFatosFinal` e os textos da Máquina em loop-central.js, e os finais (frase do Aurélio no Ouro, frases da sirene).

**O que conferi por script** (`rod14/pg/checa.py`, saída em `checa_saida.txt`):
- os 34 ids da tabela "Onde cada traço extremo aparece" existem (nenhum falta). São 18 traços extremos em negrito.
- "Tá." aparece só em `c_esc_3`, `cracha_3` e `coop_veredito` (Braga).
- "Desculpa" aparece em `d_teo_1` (Téo, escrito), `nico_0`, `nico_0b` e `nico_1.porque` (Nico) e `dis_balde` (Seu Dirceu, escrito). Em `nico_1` a palavra está na narração: "não pede desculpa".
- "Fui eu" aparece só em `teo_radio_2d` e `d_fus_2b` (Téo).
- As outras 8 frases de "nunca diria" não aparecem em pista nenhuma.
- "Lenz" só aparece no texto da volta 3 em diante: `cracha_3`, `coop_veredito`, `v4_braga` e `lenz_2`.
- Os 11 bilhetes e páginas com a letra do Téo terminam em "— T.". Ficam sem assinatura só `fh_papel_teo` (uma lista riscada, não um bilhete) e as 3 gravações (são voz).
- Varri os 106 arquivos públicos (.js, .mjs, .html, .json, .css, .svg, .txt fora de docs/, sem os `_SUBSTITUIDO`) atrás de nome de escala ou de traço. Só achei comentários de código ("rodada 3", "rodada 5 das escalas", "escalas: nenhum código fixo visível"), que nenhuma tela mostra. Achei também `ESCALAS` em `museu/sala3d`, que é tamanho de peça em metros.

**O que vi nas capturas** (`/tmp/roda/esc/r14/cap/`):
- `luz_antes_390`: a pergunta nova, decidida pelo caderno.
- `caixa_390`: as 4 etiquetas, com a pergunta que manda ao caderno.
- `luz_achou_390`: a frase nova do verniz. Ela bate com a pedra fosca da imagem.
- `desfecho_390` e `desfecho_vazio_390`: a parte "O que o seu caderno trouxe · 6 de 9 fatos" e o estado vazio, "Nenhum fato da noite saiu do seu caderno desta vez."

Aviso de autoavaliação: não escrevi nenhum texto do jogo. Mesmo assim, como 8 de 8 personagens saem com 5, reli as falas procurando motivo para tirar ponto. O que achei está nas justificativas e nas ressalvas.

---

## 1. Nota geral

**PASSA.** Seção 2: os 5 itens passam. Seção 3.1: **5,0** (mínimo 4,5), ninguém abaixo de 4. Seção 3.2: **4,8** (mínimo 4,5). A revisão 14 não mexeu em fala de personagem: o que mudou foi narração, minijogo e tela. A 3.2 sobe de 4,6 para 4,8 por dois motivos. As duas perguntas que se respondiam por bom senso agora só se respondem pelo caderno. E o desfecho do celular mostra os fatos que aquela pessoa trouxe (B3).

---

## 2. Tabela por critério

### 2.A Seção 2: checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md: os 8 têm papel, os 5 traços, honestidade-humildade e as 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". O Seu Dirceu está registrado como figurante. A revisão 14 não criou personagem. |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 de 18 têm cena, e os 34 ids existem (tabela 2.B). `e_hist_1` perdeu "Alguém ligou.", mas a frase que a ficha cita ("Então ninguém liga isto sem mim. Ninguém.") continua. |
| Falas e ações não contradizem a ficha | **Passa** | coerente | As marcas de voz estão no lugar certo (ver o script acima), e ninguém diz a frase de "nunca diria". A Dra. Sato só fala pelo interfone ou por escrito. O Téo só aparece escrito ou gravado antes de 0:00. O Lenz nunca fala da peça como arte. O Aurélio pede desculpa sem a palavra ("Era medo meu.") e, no Ouro, agradece da Galeria ("Obrigado por não esquecer."). As frases que a revisão 14 cortou ou reescreveu (`conserto_C`, `conserto_D`, `lenz_3`, `teo_cadeira`) são do narrador. Em `e_hist_1`, o corte só tirou a conclusão. Fica uma ressalva menor (2.C-1). |
| Exceções registradas na ficha | **Passa** | completo | As 10 exceções batem com os dados: Téo só escrito ou gravado; Nico só sai da repetição em `nico_1` (volta 4, com o número); a Dra. Sato só pelo interfone, vendo o céu; o Aurélio fica na Galeria no Ouro; o nome do Lenz só da volta 3; o "desde ontem" do Seu Dirceu (`c_anc_3`); a noite do fusível (`d_teo_2`). A sirene só sai para quem tem `sato_teo`, e o Téo só abre os olhos para quem tem `teo_1`, nas frases de final. A revisão 14 não mudou personagem, então não faltava registro novo. |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | A varredura dos 106 arquivos está limpa: só comentários de código e palavras do mundo ("escala de crachás", tamanho das peças). |

### 2.B Traço extremo e cena (conferido pista por pista)

| Pessoa | Traço extremo | Cena | Ok? |
|---|---|---|---|
| Aurélio | Neuroticismo alto | `aurelio_0` ("Está linda, não está?" Ele não parece ter certeza), `falsa_1` (respira pela boca) | sim |
| Aurélio | Sensibilidade à privação baixa | `aurelio_1` ("Eu demorei para acreditar." / "eu sei de cor, nunca mais li.") | sim |
| Aurélio | Tolerância ao estresse baixa | `aurelio_2` ("Disse a mim mesmo que era cansaço dele. Era medo meu.") | sim |
| Téo | Honestidade alta | `data_3`, `d_teo_1` ("Desculpa, Dra. Sato."), `d_fus_2b` ("Fui eu. — T."), `teo_radio` (o envelope recusado) | sim |
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
| 1 | `man_3`, respostas do interfone | 3 das 7 respostas seguem o molde "ou isto, ou aquilo" (`sint_carga`, `sint_luz` e a do par). Combina com "não aceita palpite". | menor, sem correção necessária |

A ressalva visual da rodada 13 (o texto da luz dizia brilho e a imagem mostra pedra fosca) foi resolvida na revisão 14: "O verniz cobre tudo por igual, até o grão da pedra." bate com `luz_achou_390`.

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só escrito e gravado, e só podia ser ele: peso e medida ("A peça tem a mesma cara e pesa diferente. Eu sei o que eu carrego.", `v4_teo`), frase curta ("Tinta não mente.", `teo_d3`), olho de montador ("Olhou pra base.", `teo_d1`), lista riscada até "falar com ele" (`fh_papel_teo`). |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada: `lenz_0` ("rapidinho... Ótimo, ótimo."), `lenz_2` ("Emprestado. Tá escrito aí" / "Lenz. Agora não."), `lenz_1` ("Nem você."), `lenz_mot_3` ("Fim do mês"), `b_hist_2` (diesel e bolso). Nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Seca, com número e papel: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone` ("4,2 kg", letra miúda e reta), `dis_cafeira`. |
| Dra. Sato | 5,0 | 4 | Mais de 15 textos com o mesmo jeito: chama a máquina de "ela", devolve a pergunta, humor seco (`man_2` "Ou não.", `e_hist_1` "Ninguém.", `fh_ficha_bc` "Levar o guarda-chuva."), frase de rádio (`sato_teo`). O molde de 2.C-1 não tira meio ponto: ali também ela devolve a tarefa a você. `e_hist_1`, sem "Alguém ligou.", ficou mais dela, não menos. |
| Seu Dirceu | 5,0 | 4 | Figurante com voz e objeto na mão: `traj_2` (aponta com o esfregão, "Nem boa-noite."), `ivone_ali_2` ("passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `dirceu_0`, `assim_leg` ("Quem sujou meu chão?"), `d_teo_2` ("Eu reparo."), `arm_aviso`. |
| Braga | 5,0 | 4 | Fala muito e foge do assunto por três caminhos (a chuva e a porta em `traj_aviso`, o cunhado em `braga_1` e `c_esc_3`, o café). As três verdades começam com "Tá.". "Tive medo de perder o emprego" (`v4_braga`) é o desejo da ficha, dito sem a frase de "nunca diria". |
| Aurélio | 5,0 | 4 | Pergunta em vez de afirmar (`aurelio_0`; `aurelio_1`: "Você também sentiu?"), usa palavra de acervo ("Peça de acervo não cheira a novo."), foge da lacuna ("eu sei de cor, nunca mais li."), pede desculpa sem a palavra (`aurelio_2`), e no Ouro agradece sem sair da Galeria. |
| Nico | 5,0 | 4 | Repara nas pessoas antes de falar de si (`nico_0`, `nico_0b`), perde o fio e se repete ("eu já te disse isso?", duas vezes), a regra do Téo sai aos tropeços (`nico_1.porque`), e com o número ele "pisca, como quem acorda". Desconto que pesei e não apliquei: é pouco texto. Mas a escala mede se dá para reconhecer quem fala, não quanto texto tem. |
| **Média (8 com fala)** | **5,0** | **4,5** | 40 ÷ 8 = 5,0. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 5,0 | Saiu o que segurava a nota em 4,5 nas rodadas 11 a 13: as duas perguntas que se respondiam por bom senso. `falsa_1.antes` agora só aparece para quem tem `par_foto` e pergunta como a peça aparece na foto: 4 combinações de cor, superfície e bordas, e a idade da peça já não basta (`luz_antes_390`). `c_peca` pergunta qual caixa abrir pelo que o caderno diz da caixa do patrocínio, entre 4 etiquetas com aviso (`caixa_390`). O resto continua puxando sozinho: o museu esquece, as pessoas mudam de fala com o caderno, há o cofre de trás para a frente, a escrita antiga na testa da máscara, o pêndulo, o gravador e O Raio. A luz de lado agora mostra o que o texto diz. Ressalva menor (sem meio ponto): as duas perguntas são de "achar no caderno", não de cruzar duas pistas. E em `c_peca`, quem chegou só por `c_esc_3` não tem "banners" no caderno, mas a 2ª dica ("entrou leve e agora pesa demais") resolve por raciocínio. |
| Integrada | 5,0 | O papel aparece numa frase clara na entrada ("Nesta atividade você vive o papel de quem lembra das voltas…"). Há 8 missões secretas, e nenhuma fecha com um toque. O telão tem a página "Missões" e o nome de quem trouxe cada fato. A escrita própria do Loop dá ao museu uma cultura que é só dele. |
| Identificada | 5,0 | B3 entrou. Embaixo das 3 provas, "O que o seu caderno trouxe · N de 9 fatos" mostra, em fichas com a miniatura da fita, os fatos que aquela pessoa trouxe (`lcFatosFinal`, `desfecho_390`). Quem não trouxe nada lê uma frase do mundo, não um erro (`desfecho_vazio_390`). Isso fecha o "final com recompensa de entendimento" pessoal. Já estavam lá: o diagnóstico com motivo ("Os seus dois sinais apontam para o mesmo lado…"), os finais que cobram a escolha, "Para conversar" no telão e a inscrição como prova. |
| Externa (menos é melhor) | bruta 1,5, invertida 4,5 | Não há ponto nem ranking. A recompensa é +1 de energia, o nome no telão e o final. Os restos de formulário saíram ("Você marcou 3 de 3", "Quase.", "Revelar agora"). Mas a contagem do diagnóstico ainda lembra um checklist, e a contagem "6 de 9 fatos" do desfecho pode virar meta numérica. Por isso não desce para 1. Errar sem custo está em "Ficou para decidir" e não pesou. |
| Amotivação (menos é melhor) | bruta 1,5, invertida 4,5 | A pessoa sempre sabe o que falta e por quê: cada tranca tem frase do mundo, há "Falta: ..." nas atividades e as fichas do Revelar mostram o que falta. Sobra o de sempre: muita palavra de regra junta no Dossiê, que sozinha não tira meio ponto. |
| **Nota da escala** | **4,8** | (5,0 + 5,0 + 5,0 + 4,5 + 4,5) ÷ 5 = 4,8. Mínimo 4,5. **Passa.** |

Introjetada: neutra, não pontua.

**O que só jogadores reais mostrariam (não puni):**
- se 5 de energia diante de 5 a 19 itens por sala dá gosto de escolha ou sensação de falta;
- se a turma liga sozinha a tábua da Conservação à testa da máscara da Galeria numa volta seguinte, e se alguém usa o zoom para ver a inscrição e a rachadura na peça 3D;
- se a pergunta antes da luz é sentida como hipótese e teste ou como consulta ao caderno;
- se "6 de 9 fatos" no desfecho é lido como orgulho do que trouxe ou como nota;
- se o minijogo dá o prazer de "achei" ou passa rápido demais;
- se gastar energia em item de ambiente parece "o museu é vivo" ou energia perdida;
- se girar a peça 3D e caçar os pontos dá prazer ou cansa em 15 salas;
- se os 10 segundos de caminhada criam tensão ou tédio; se a Sala das esculturas fechada desperta curiosidade (a pista `pose`);
- se falar em voz alta de salas diferentes funciona numa sala cheia; se alguém blefa a missão secreta;
- o ritmo das voltas 3 e 4 para quem já tem diagnóstico e ensaio; se "Para conversar" abre conversa.

**Decisões em "Ficou para decidir" ou do autor (não pesaram):** seletor de entrada e "Obrigado por participar!"; resposta errada em minijogo sem custo; entrada por papel nos consertos em dupla; piso de volta em `nico_1`, `cracha_3` e `lenz_2`; a Dra. Sato e as voltas; Revelar só na volta 5; a testa da máscara à vista desde a volta 1; a disposição da planta e a Sala das esculturas em reforma.

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

**Nada ficou abaixo do mínimo, e nada é obrigatório nestas seções.**

**(a) Obrigatórias:** nenhuma.

**(b) Retoques opcionais:**
1. **`LC_MG.c_peca`, a 2ª dica, ou a condição de abrir (umas 10 palavras ou 1 id).** Quem chegou só por `c_esc_3` (o vídeo do Braga: "duas caixas iguais") não tem "banners" no caderno. Há duas saídas. Uma: a 1ª dica cita também "a gravação da Central". A outra: `c_esc_3` diz "duas caixas de banners iguais". Hoje a 2ª dica já resolve por raciocínio, então isto é só acabamento.
2. **`falsa_1.antes`, a imagem (1 campo).** A pergunta é sobre a foto do catálogo, mas a miniatura mostrada é `GAL_B` (a vitrine da Galeria, onde está a cópia). Uma miniatura da foto (como `N18`, usada em `LC_MGA.coop_original_copia`) ficaria mais clara.
3. **Interfone (`man_3`), 2 respostas (umas 30 palavras).** Variar o molde "ou isto, ou aquilo" em `sint_luz` ou na resposta do par, se o autor quiser mais variedade. A voz já passa assim.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (rodada 13, sobre a rev. 13) | Agora (rodada 14, sobre a rev. 14) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem personagem novo. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | 34 ids conferidos por script. A frase de `e_hist_1` citada na ficha continua. |
| 2.4 falas não contradizem a ficha | Passa (1 ressalva + 1 observação visual) | Passa (1 ressalva) | O texto da luz agora bate com a pedra fosca. Fica o molde do interfone. |
| 2.4 exceções registradas | Passa | Passa | Nada mudou que precise de registro novo. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa em 106 arquivos. |
| Téo | 5,0 | 5,0 | Sem mudança de fala. |
| Lenz | 5,0 | 5,0 | `lenz_3` é narração. Sem mudança de fala. |
| Ivone | 5,0 | 5,0 | Sem mudança. |
| Dra. Sato | 5,0 | 5,0 | `e_hist_1` ficou mais enxuto, ainda com a voz dela. |
| Seu Dirceu | 5,0 | 5,0 | Sem mudança. |
| Braga | 5,0 | 5,0 | Sem mudança. |
| Aurélio | 5,0 | 5,0 | Sem mudança. |
| Nico | 5,0 | 5,0 | Sem mudança. |
| **3.1 média** | **5,0** | **5,0** | Passa. |
| Intrínseca | 4,5 | 5,0 | `falsa_1.antes` e `c_peca` agora são decididos pelo caderno, não por bom senso. A luz de lado mostra o que o texto diz. |
| Integrada | 5,0 | 5,0 | Sem mudança. |
| Identificada | 4,5 | 5,0 | B3 aplicado: os fatos da pessoa aparecem no desfecho do celular. |
| Externa (bruta) | 1,5 | 1,5 | Os restos de formulário saíram, mas a contagem do diagnóstico e o "N de 9" seguem com cara de meta. |
| Amotivação (bruta) | 1,5 | 1,5 | O Dossiê continua carregado. |
| **3.2 nota** | **4,6** | **4,8** | Passa. |

Nenhuma nota caiu.

## 5. Fim do ciclo

**As escalas das seções 2 e 3 passaram.** Seção 2: 5 de 5 itens. Seção 3.1: 5,0. Seção 3.2: 4,8. As outras seções (história, conferência técnica, peças) não fazem parte desta avaliação.
