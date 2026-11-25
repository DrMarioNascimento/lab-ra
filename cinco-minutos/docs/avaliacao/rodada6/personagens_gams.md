# Mosaico Loop v4 (revisão 6) — Avaliação, rodada 6 — Seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliação feita do zero, sobre os textos e as telas atuais. Li: ESCALAS_AVALIACAO_JOGOS.md, FICHAS.md, DECISOES-V4.md (base, revisão 2 e revisão 6 por inteiro; revisões 3 a 5 só pelo que a 6 cita), pistas_legivel.txt (as 278 pistas), atividades.txt (regras, trancas, 10 atividades, 5 finais, papéis), loop-central.js (761 linhas), ritmo.js, o `TOUR`, as descrições de sala, os textos entre voltas e o gravador em game.js, o começo de reserva/minigames.mjs (como trata resposta e dica) e as linhas de texto de sala/telao/telao.mjs. Do ROTEIRO-LOOP.md li as partes 1 a 8 e a 13; não li as partes 9 a 12 (histórico das revisões 2 a 5). Vi 41 telas: as 17 de `esc/r6/vis`, 14 de `r6/cap` (manual, lista, caderno, livro, Sala dos sons parada e tocando, os 6 minijogos, provas), e 10 do telão com 40 pessoas. Rodei dois scripts meus (`/tmp/roda/esc/r6/pg/fita.mjs` e `fita2.mjs`) para medir a página "A noite" do telão. Não editei nada no repositório.

Não vi nenhum cartão de atividade em dupla aberto na tela (com palavra da dupla e lista do papel): esses eu li só no código.

Aviso de autoavaliação: não escrevi nenhum texto do jogo; não há desconto de autoria a aplicar.

---

## 1. Nota geral

**NÃO PASSA ainda, por 0,1.** Seção 2: 5 de 5 itens passam. Seção 3.1: **4,9** (mínimo 4,5), ninguém abaixo de 4: **passa**. Seção 3.2: **4,4** (mínimo 4,5): **não passa**. A Intrínseca subiu para 4,5 (as quatro correções da rodada 5 entraram). Quem segura agora é a Identificada (4,0): no telão final, a página "A noite" corta o texto de duas linhas da fita, uma delas a do engano do Lenz, sempre que a turma acha 7 fatos ou mais. Medido em 1280 e em 1920, com 6 e com 40 pessoas. É correção de folha de estilo ou de texto (uns 25 palavras); nenhuma mudança de mecânica é obrigatória.

---

## 2. Tabela por critério

### 2.A Seção 2 — checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md traz os 8 com papel, 5 traços, honestidade-humildade e as 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". Seu Dirceu sem necessidade e sem traço extremo: está registrado como figurante. |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 de 18 negritos com cena; os 33 ids citados na última tabela da ficha existem nos dados com o texto que a ficha descreve (tabela 2.B). |
| Falas e ações não contradizem a ficha | **Passa** | coerente | As 11 folhas e bilhetes do Téo terminam em "— T." (a lista de conferência `fh_papel_teo` não é bilhete). A Dra. Sato só fala e só ouve: saiu o "Tá." (`solosato`: "Desta vez eu confio. Gira."). O Braga não fecha mais tudo no café (`braga_1`: "igual à do carro do meu cunhado"). "Lenz" não está escrito em nenhuma pista abaixo da volta 3 (só `cracha_3`, `coop_veredito`, `v4_braga`, `lenz_2`). Uma ressalva de voz, que não chega a contradição (2.C). |
| Exceções registradas na ficha | **Passa** | completo | 10 exceções escritas; conferidas contra o código: "Pelo interfone não passa objeto." (`solosato`), a contagem do raio de fora (`raiosato`), o Aurélio no Ouro, o Nico só saindo da repetição em `nico_1` (volta 4). |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura por 21 termos em todos os .js, .mjs, .html, .json e .css fora de docs/: zero ocorrências com esse sentido ("escala" só como escala de crachás; "traços" só na tabela de Morse de outro modo de jogo). |

### 2.B Traço extremo × cena (conferido pista por pista)

| Pessoa | Traço extremo | Cena | Ok? |
|---|---|---|---|
| Aurélio | Ansiedade alta | `aurelio_0` ("Está linda, não está?" Ele não parece ter certeza), `falsa_1` (respira pela boca) | sim |
| Aurélio | Foge da lacuna | `aurelio_1` ("Eu demorei para acreditar.") | sim |
| Aurélio | Não aguenta pressão | `aurelio_2` ("Disse a mim mesmo que era cansaço dele. Era medo meu.") | sim |
| Téo | Honestidade alta | `data_3`, `d_teo_1` ("Desculpa, Dra. Sato."), `d_fus_2b` ("Fui eu. — T."), `teo_radio` (o envelope recusado) | sim |
| Téo | Não larga a lacuna | `teo_d1` ("Sozinho pra quê?"), `v4_teo` ("Eu sei o que eu carrego.") | sim |
| Téo | Aceita risco | `teo_d3` ("Hoje à noite eu falo com ele."), `teo_radio` ("cara a cara") | sim |
| Ivone | Método | `ivone_1x` ("Eu não perco pote."), `v5_ivone` ("Limpei, pesei, devolvi: 4,2 kg.") | sim |
| Ivone | Pouca curiosidade pelas pessoas | `ivone_2` ("Devia ter perguntado por quê."), `ivone_red` (aponta sem olhar) | sim |
| Braga | Quer agradar | `traj_aviso` ("Pega um café, tá fresco"), `c_esc_3`, `cracha_3` ("Quer um café?") | sim |
| Braga | Não aguenta pressão | `braga_1` (dá de ombros rápido demais), `dis_cafe` (esconde a xícara), `v4_braga` (riscado duas vezes), `coop_veredito` (engole seco) | sim |
| Lenz | Pouca amabilidade | `lenz_0` (não espera a resposta), `lenz_1` ("Nem você.") | sim |
| Lenz | Pouca honestidade | `lenz_2` ("Eu devolvo tudo que eu pego."), `cracha_2` | sim |
| Lenz | Não aguenta pressão | `traj_3` (fala sozinho na escada), `lenz_mot_3` ("ou eu não tenho mais empresa pra te pagar") | sim |
| Lenz | Busca risco | `v5_lenz` ("Peça por fora: +?", "ninguém confere a base") | sim |
| Dra. Sato | Abertura | `man_anc_2` ("Nunca aconteceu, mas vai que"), `man_2` ("Ou não.") | sim |
| Dra. Sato | Não larga a lacuna | `man_3` ("Me conta o que você viu com os seus olhos."), `a_hist_1`, `e_hist_1` | sim |
| Nico | Pouca ordem | `nico_0b` (perde o fio), `fh_fusivelx` (fusível para a cafeteira) | sim |
| Nico | Muita atenção às pessoas | `nico_0` ("cara de quem não jantou"), `nico_0b` (o Braga e o cinto) | sim |

### 2.C Ressalva (não derruba item)

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | `coop_veredito`: "Essa rubrica? É do Lenz, do patrocínio. Ele assina tudo assim." | A ficha diz que o Braga "começa a verdade com 'Tá.'". É a verdade mais importante que ele diz e é a única das três sem a marca. O "engole seco" segura o jeito dele. | ressalva (1 palavra) |

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só por escrito e inconfundível: peso e medida ("Eu sei o que eu carrego", `v4_teo`), ordem curta ("Tinta não mente.", `teo_d3`), olho de quem monta ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`), o envelope recusado (`teo_radio`). Assina tudo. |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada em toda fala: `lenz_0` ("Ótimo, ótimo."), `lenz_2` ("Eu devolvo tudo que eu pego." ... "Lenz. Agora não."), `lenz_1` ("Ninguém quer confusão hoje. Nem você."), `b_hist_2` ("Cada litro de diesel sai do nosso bolso."). Nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Seca e com número: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone`. |
| Dra. Sato | 5,0 | 4 | Constante em mais de 15 textos: "ela", pergunta de volta, humor seco (`man_3`, `man_2` "Ou não.", `e_hist_1` "Ninguém.", `fh_ficha_bc` "Levar o guarda-chuva."). Nos caminhos pelo interfone, frase de rádio ("Cinto na trava. Puxa. Agora a peça."). O "Tá." saiu. |
| Seu Dirceu | 5,0 | 4 | Figurante com voz em oito textos: `traj_2` ("Nem boa-noite."), `ivone_ali_2` ("passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `assim_leg` ("Quem sujou meu chão?"), `d_teo_2` ("Eu reparo."), `dis_balde` ("Desculpa, doutora. Compro outro."). |
| Braga | 5,0 | 4 | Fala muito e foge por três portas, como na ficha: a chuva e a porta (`traj_aviso`), o cunhado (`braga_1`, `c_esc_3`), o café (`traj_aviso`, `c_esc_3`, `cracha_3`); a verdade começa com "Tá." em `c_esc_3` e `cracha_3`; por escrito, a vergonha (`v4_braga`, `cofre_dica` "Esqueci a senha de novo"). O motivo do meio ponto da rodada 5 (café em todas) saiu. Fica a ressalva 2.C. |
| Aurélio | 4,5 | 4 | As três falas perguntam ou recuam (`aurelio_0`, `aurelio_1` "Você também sentiu?", `aurelio_2` "Era medo meu."). Meio ponto fora: a "palavra de acervo" da ficha só existe no laudo (`falsa_2`), e as três falas ficam na mesma sala. |
| Nico | 4,5 | 4 | Três falas, as três dele (`nico_0`, `nico_0b`, `nico_1` "pela primeira vez ele não pede desculpa"), mais o bilhete do fusível e o gato "Fusível". Meio ponto fora: pouco texto para o guia do museu, tudo numa sala, e a segunda fala só abre da volta 2. |
| **Média (8 com fala)** | **4,9** | **4,5** | 39 ÷ 8 = 4,875. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 4,5 | Puxa sozinha: o museu que esquece, gente que só muda de fala quando você mostra o caderno, tranca com motivo no mundo, cofre com o registro de trás para a frente, o pêndulo que adianta o relógio de todo mundo, o gravador da Sala dos sons com a legenda saindo aos poucos, O Raio, o ensaio que só diz "2 de 3 certos". Os três motivos de texto da rodada 5 saíram: a escala de crachás entra sem pergunta; a foto e a caixa têm 4 opções do mesmo tamanho, que só o caderno ou a dedução separam (a opção "Entrou hoje, com escolta" é armadilha boa para quem só leu a guia); em Acusação e Defesa quem acha a letra é a dupla, cada tela com metade (rubrica deitada / letra deitada). Falta para 5: (1) "Antes de acender a luz" é a primeira pergunta que quase todo mundo encontra e tem resposta de bom senso, com uma opção de descarte ("Nada: luz de lado não muda o que se vê"); (2) a pergunta da foto antiga diz "o que você anotou diante da peça da Galeria" e a pista não pede o cheiro de verniz no caderno (na captura `mg_tombo_2`, o caderno está em 0); (3) em O Raio, o papel do Pátio fala em "3 números gravados na chave" e a tela mostra um código que muda a cada 10 segundos. |
| Integrada | 4,5 | Papel em frase clara nas duas entradas e no manual ("Nesta atividade você vive o papel de quem lembra das voltas"), 8 missões secretas com convite a blefar, papel da última volta com nome de gente ("Quem opera", "Quem apoia") mostrado no telão, página de missões com o nome de quem cumpriu, "Quem trouxe" em cada fato da fita, pergunta de valor no fim. Falta para 5: as missões têm tamanhos muito diferentes. Três fecham com um ou dois toques numa sala só, no primeiro minuto (Téo: `teo_1` + `empurra_1`; Aurélio: `falsa_1` + `aurelio_1`; Ivone: a folha de ponto `ivone_ali_1`, que fala do dia 14 e não da tinta de hoje), e a do Nico só é possível da volta 4. É o mesmo defeito que a rodada 5 apontou na missão do dinheiro, e que lá foi corrigido. |
| Identificada | 4,0 | O diagnóstico pede raciocínio que a pessoa reconhece como dela ("Você não chutou: dois sinais diferentes... e uma leitura dizendo 'aqui não é'"), o erro volta com motivo, pista por pista, os finais por causa cobram a escolha ("A manhã chega, limpa demais."), as fichas do telão agora dizem "Achar o defeito · ✓ feito". O que derruba meio ponto: a página "A noite" do telão, que é a recompensa de entendimento da turma, corta texto. Com 8 linhas ou mais na fita (7 fatos achados, o que uma turma de 20 a 40 faz quase sempre), a linha da entrada perde o fim ("...pela porta de serviço, com o" e some "crachá do Braga") e, com 9 ou 10, a linha do engano perde a conclusão ("...achando que ela apaga cinco" e some "minutos. Ela arma em 50 segundos e só repete"). É a virada da história, cortada justo quando a turma achou tudo. Medido: 22 e 9 px fora em 1280×720; 31 e 12 px em 1920×1080; igual com 6 ou 40 pessoas (`pg/fita_6_1920.png`, `r6/tl40_result_todos_1_1280.png`). O teste `tl40.mjs` não pega porque mede o cartão, não a linha. |
| Externa (menos é melhor) | 1,5 → invertida 4,5 | Sem ponto, sem ranking; a recompensa é +1 de energia e o nome no telão. Os restos de formulário que a rodada 5 apontou estão em "Ficou para decidir" e não pesaram aqui. Sobra a voz de sistema em maiúsculas nas respostas da Máquina ("ATIVIDADE FEITA:", "ENSAIO (em dupla):", "Forma certa."). |
| Amotivação (menos é melhor) | 1,5 → invertida 4,5 | A pessoa sempre sabe o que falta e por quê (frase do mundo em cada tranca, "Falta: ..." em cada atividade, três fichas de passo em cada aba). Sobra: muita palavra de regra junta no Dossiê (sinal, leitura normal, etiqueta, ensaio, eco, meio conserto), amparada pelo "?" e pelo dicionário; e, no desfecho do celular, a ficha "Defeito · ficou aberto". |
| **Nota da escala** | **4,4** | (4,5 + 4,5 + 4,0 + 4,5 + 4,5) ÷ 5. Mínimo 4,5. **Não passa.** |

Introjetada: neutra, não pontua.

**O que não deu para julgar sem jogadores reais (não puni):**
- se 5 de energia diante de 12 a 14 itens por sala dá gosto de escolha ou sensação de falta;
- se os 10 segundos de caminhada criam tensão ou tédio;
- se falar em voz alta de salas diferentes funciona numa sala de aula cheia, e se a palavra que muda a cada 30 segundos atrapalha;
- se alguém de fato blefa a missão secreta na pausa;
- se a legenda do gravador saindo aos poucos é sentida como clima ou como espera;
- se o pêndulo (40 segundos a menos para todos) vira graça ou briga;
- o ritmo das voltas 3 e 4 para quem já tem diagnóstico e ensaio;
- o prazer de girar a peça 3D e de mexer na luz em `falsa_1`;
- se a turma lê a fita do telão ou só o título do desfecho.

**Decisão de regra já registrada (DECISOES-V4, "Revisão 6 · Ficou para decidir"): opcional, não pesou na nota:**
- resposta errada em minijogo não custa nada;
- nos consertos em dupla (Três Números, Fio a Fio, A Verdadeira) os dois aparelhos precisam de tudo no caderno, então quem dita não sabe nada que quem digita não saiba;
- piso de volta em `nico_1`, `cracha_3` e `lenz_2`;
- restos de formulário ("Marcadas: 3 de 3 · sinais: 2...", "A tentativa desta volta foi gasta.", botão "Registrar revelação", rótulo "MEIO CERTO");
- `man_cal_3` ("vai que precisa") diante da exceção do Téo na ficha;
- aviso de aula encerrada.

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

Só a 3.2 ficou abaixo. Total: (a) 1 correção que faz passar (folha de estilo, ou 2 frases, uns 25 palavras) e 6 de acabamento (uns 60 palavras e 3 linhas de dado); (b) nenhuma mudança de mecânica necessária; 2 opcionais, as mesmas da rodada 5.

### (a) Texto e dado

**Faz a Identificada chegar a 4,5 (e a escala a 4,5):**

**A1. Fita do telão sem corte — sala/telao (estilo da `.tl-fita li`) ou ritmo.js, `LOOP_LINHA`.** Duas saídas; basta uma.
- Estilo: a linha de duas frases precisa caber com 10 linhas (deixar a linha longa crescer e as curtas cederem, ou baixar a letra da `.tx` quando `--linhas` for 8 ou mais). Depois, incluir no `tl40.mjs` a medida por linha (texto dentro da própria `li`), que hoje não existe.
- Texto (uns 25 palavras), cada fato numa linha só:
  `entrada`: `O do patrocínio volta de noite pela porta de serviço`
  `engano`: `Ele liga a Câmara achando que ela apaga. Ela só repete`
  (o crachá do Braga já está na linha das 4:00; os 50 segundos ficam na pista `raio_contagem`).

Não muda enredo nem regra. Mexe em texto do telão: pede só reconferir a consistência do documento (seção 1) e a captura com 10 fatos nas duas larguras.

**Acabamento (não são necessárias para passar):**

**A2. Missões de um toque — loop-central.js, `LC_MISSOES` (3 linhas de dado).**
- Téo: `ok:() => lcTem('lenz_3') || (lcTem('empurra_1') && lcTem('empurra_2'))`
- Aurélio: `ok:() => lcTem('aurelio_2')` (o que ele sabia e não disse é o que ele conta diante do diário; `aurelio_1` vira o caminho até lá)
- Ivone: `ok:() => lcTem('ivone_red') || lcTem('ivone_ali_2')` (sai a folha de ponto, que é do dia 14, e `ivone_1x`, que não a inocenta)

**A3. Pergunta da foto antiga — `LC_MG.tombo_2` (uns 12 palavras).** `texto:'Na foto antiga, a peça é opaca, cor de pó. O que se nota diante da peça da Galeria que não combina com isso?'` (sai "você anotou", que nem sempre é verdade).

**A4. "Antes de acender a luz" — `LC_MG.falsa_1.antes` (uns 15 palavras).** Trocar a opção de descarte por uma que dispute: `opcoes:['Riscos, poeira e desgaste por toda parte','Um brilho liso e igual, sem marca nenhuma','Rachaduras só de um lado, o resto liso']`.

**A5. O Raio, papel do Pátio — loop-central-dados.js, `coop_raio.papelB` (uns 10 palavras).** "Você lê em voz alta os 3 números que aparecem enquanto segura a chave." (sai "gravados na chave").

**A6. Braga no veredito — `coop_veredito` (1 palavra).** `"Tá. Essa rubrica é do Lenz, do patrocínio. Ele assina tudo assim."`

**A7. Desfecho no celular — loop-central.js, `lcFichasFinal` (3 palavras).** Títulos iguais aos do telão: "Achar o defeito", "Consertar a Máquina", "Revelar a noite".

A2 a A4 mexem em missão e em minijogo: pedem nova rodada do validador. Nenhuma muda enredo.

### (b) Mecânica (opcionais; pedem decisão do autor; já estão em "Ficou para decidir")

**B1. Resposta errada com preço.** Errou, a bancada fecha e o item fica "ainda não" por 30 segundos.

**B2. Entrada por papel nos consertos em dupla.** O aparelho do Subsolo pede só diagnóstico e receita; os valores ficam com quem dita.

Com B1 e B2 a Intrínseca pode chegar a 5,0. Sem elas, a escala passa só com A1.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (r5) | Agora (r6) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem mudança. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | Sem mudança. |
| 2.4 falas não contradizem a ficha | Passa (2 ressalvas) | Passa (1 ressalva) | Saíram o "Tá." da Dra. Sato e o café em toda fala do Braga. Ressalva nova, pequena: o veredito do Braga sem "Tá.". |
| 2.4 exceções registradas | Passa | Passa | Sem mudança. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa. |
| Téo | 5,0 | 5,0 | Mantém. |
| Lenz | 5,0 | 5,0 | Mantém. |
| Ivone | 5,0 | 5,0 | Mantém. |
| Dra. Sato | 5,0 | 5,0 | Mantém; saiu o "Tá.". |
| Seu Dirceu | 5,0 | 5,0 | Mantém. |
| Braga | 4,5 | **5,0** | `braga_1` fecha no cunhado; as três fugas da ficha aparecem. |
| Aurélio | 4,5 | 4,5 | Sem mudança nas falas. |
| Nico | 4,5 | 4,5 | Sem mudança nas falas. |
| **3.1 média** | **4,8** | **4,9** | Sobe com o Braga. Passa. |
| Intrínseca | 4,0 | **4,5** | Saíram os três motivos de texto (pergunta óbvia do crachá, opção certa pela forma em duas, Acusação e Defesa sem a letra). Os dois motivos de regra viraram decisão pendente e não pesam. |
| Integrada | 4,5 | 4,5 | Nomes dos papéis e missão do dinheiro corrigidos; aparece o mesmo defeito em três outras missões. |
| Identificada | 4,5 | **4,0** | **Caiu.** O rótulo das fichas do telão foi corrigido, mas a fita cheia corta duas linhas. Não é efeito de correção da revisão 6: a rodada 5 não viu a fita com 8 linhas ou mais (a captura dela tinha 6 fatos). É defeito que já existia e só aparece com a fita cheia. |
| Externa (bruta) | 1,5 | 1,5 | Mesmos restos, agora registrados como decisão pendente. |
| Amotivação (bruta) | 1,5 | 1,5 | Sem mudança de peso. |
| **3.2 nota** | **4,4** | **4,4** | A Intrínseca subiu 0,5 e a Identificada caiu 0,5. Falta 0,1. |

Uma nota caiu (Identificada), por defeito de tela que a rodada anterior não tinha como ver, não por correção técnica.

## 5. Fim do ciclo

**Nem todas as escalas passaram.** Seção 2: 5 de 5. Seção 3.1: 4,9, passa. Seção 3.2: 4,4 de 4,5, não passa. O ciclo de renovação continua: aplicar A1, conferir a fita com 10 fatos em 1280 e 1920, e reavaliar do zero.
