# Loop v4 (revisão 3) — Avaliação, rodada 3 — Seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliação feita do zero, sobre os textos atuais. Li por inteiro: ESCALAS_AVALIACAO_JOGOS.md, FICHAS.md, ROTEIRO-LOOP.md, DECISOES-V4.md, pistas_legivel.txt (278 pistas), atividades.txt (10 atividades, 5 finais, regras), loop-central.js (689 linhas). Vi 38 das 63 telas de r3/vis e r3/vis_extra (todas as de celular com texto novo, os 5 minijogos, as 4 páginas do telão em jogo e as 4 do fim). Para conferir de onde vem cada texto de tela, abri também trechos de game.js, ritmo.js, noites.js, noites-motor.js, sala/telao/telao.mjs, individual.html e sala/index.html. Não editei nada no repositório.

Aviso de autoavaliação: não escrevi nenhum texto do jogo. Na rodada 2 o avaliador tirou 0,5 do Lenz porque as falas vinham de proposta dele mesmo; esse desconto não se aplica a mim e eu não o repeti. Conferi que a média da 3.1 passa mesmo se eu baixar Lenz e Ivone para 4,5 (dá 4,56).

---

## 1. Nota geral

**NÃO PASSA ainda. Fichas e vozes resolvidas; o que segura é a motivação.** Seção 2: 4 de 5 itens passam (falta o item "falas e ações não contradizem a ficha", por 2 contradições que estão em texto de tela, não nas pistas). Seção 3.1: **4,7** (mínimo 4,5), ninguém abaixo de 4: **passa**. Seção 3.2: **4,1** (mínimo 4,5): **não passa**. Nenhuma nota caiu em relação à rodada 2.

---

## 2. Tabela por critério

### 2.A Seção 2 — checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md traz os 8 (7 + Seu Dirceu) com papel, 5 traços, honestidade-humildade e as 5 dimensões da curiosidade, mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 16 de 16. A lacuna da rodada 2 (Nico, atenção às pessoas) fechou: `nico_0` ("cara de quem não jantou", "a Ivone hoje tá brava, mas não é com você") e `nico_0b` ("O Braga hoje não parou de pôr a mão no cinto"). Tabela 2.B abaixo. |
| Falas e ações não contradizem a ficha | **Não passa** | coerente | 2 contradições (2.C, linhas 1 e 2): a Dra. Sato **agindo dentro do prédio** pelo interfone, e o manual de entrada com três falas de gente que não é do elenco. As 2 da rodada 2 (crachá "pediu × pegou"; Ivone na cafeteira) estão resolvidas. |
| Exceções registradas na ficha | **Passa** | completo | 8 exceções escritas (Téo sem fala ao vivo, Nico e a repetição, Dra. Sato só ouve, regra da memória, Dirceu figurante, Aurélio no Ouro, Téo não prevê o reinício, Lenz na escada). Se a ajuda da Dra. Sato ficar no jogo, precisa virar a 9ª (correção B3). |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura em 11 arquivos vivos + pistas + atividades: zero. As 2 ocorrências de "traço" são do código Morse, em noites-motor.js, e essas pistas nem entram na lista do Loop. |

### 2.B Traço extremo × cena (conferido pista por pista)

| Pessoa | Traço extremo | Cena | Ok? |
|---|---|---|---|
| Aurélio | Ansiedade alta | `aurelio_0` ("Está linda, não está?"), `falsa_1` (respira pela boca) | sim |
| Aurélio | Foge da lacuna; não aguenta pressão | `aurelio_1` ("Eu demorei para acreditar."), `aurelio_2` ("Era medo meu.") | sim |
| Téo | Honestidade alta | `d_teo_1` ("Desculpa, Dra. Sato."), `d_fus_2b` ("Fui eu. — T."), `data_3` | sim |
| Téo | Não larga a lacuna | `teo_d1` ("Sozinho pra quê?"), `v4_teo` ("Eu sei o que eu carrego.") | sim |
| Téo | Aceita risco | `teo_d3` ("Hoje à noite eu falo com ele."), `teo_radio` ("cara a cara") | sim |
| Ivone | Método | `ivone_1x` ("Eu não perco pote."), `v5_ivone` (4,2 kg) | sim |
| Ivone | Pouca curiosidade pelas pessoas | `ivone_2` ("Devia ter perguntado por quê."), `ivone_red` (aponta sem olhar) | sim |
| Braga | Quer agradar | `traj_aviso`, `c_esc_3` ("Café?"), `cracha_3` | sim |
| Braga | Não aguenta pressão | `braga_1` (dá de ombros rápido demais), `dis_cafe` (esconde a xícara), `v4_braga` ("Tive medo") | sim |
| Lenz | Pouca amabilidade | `lenz_0` (não espera a resposta), `lenz_1` ("Nem você.") | sim |
| Lenz | Pouca honestidade | `lenz_2` ("Eu devolvo tudo que eu pego."), `cracha_2` | sim |
| Lenz | Não aguenta pressão; risco | `traj_3`, `lenz_mot_3` ("ou eu não tenho mais empresa"), `v5_lenz` ("ninguém confere a base") | sim |
| Dra. Sato | Abertura | `man_anc_2` ("Nunca aconteceu, mas vai que"), `man_2` ("Ou não.") | sim |
| Dra. Sato | Não larga a lacuna | `man_3` ("Me conta o que você viu com os seus olhos."), `a_hist_1` | sim |
| Nico | Pouca ordem | `nico_0b` (perde o fio), `fh_fusivelx` (fusível para a cafeteira, agora em toda noite) | sim |
| Nico | Muita atenção às pessoas | `nico_0`, `nico_0b` | sim |

### 2.C Contradições e ressalvas

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | loop-central.js, botões "📞 Com a Dra. Sato" (linhas 398, 405, 421) e mensagens (468, 493) | "Ela **segura a trava** pelo interfone", "Ela **fecha a chave do Pátio** por você", "A Dra. Sato fecha a chave do Pátio pelo interfone". A ficha diz: "Nada: está fora do prédio e só ouve". Ela também "cobre uma fonte que faltar", e a ficha diz que ela "não aceita palpite". | contradição |
| 2 | game.js, `TOUR` (linhas 1210 a 1221): os 6 passos do manual que abre na entrada (telas e02, e09, e10) | Três falas de gente que não é do elenco e uma cena que não existe: "Uma funcionária cochicha: 'Shh! É surpresa para o pessoal.'" (resto do caso antigo); "A restauradora passa e avisa baixinho..." (a Ivone é seca e não sai da bancada); "Um guarda... murmura: 'eu odeio essa hora, tudo fica tão quieto'" (o Braga fala muito e oferece café); "a ronda reúne todos. Cada um tem uma versão." O título em sala/index.html:42 ainda é "Um estrondo. O tempo recomeça." (o de individual.html já é "Um raio"). É o primeiro texto que a pessoa lê. | contradição |
| 3 | `teo_d1`, `teo_d2`, `teo_d3` × ficha do Téo | A ficha diz "assina **sempre** '— T.', nos bilhetes e nas páginas do diário". Essas três páginas não têm assinatura. | ressalva |
| 4 | `d_teo_2` (noite D) × Téo e Seu Dirceu | O Téo, que "faz tudo sem ninguém", conta ao Seu Dirceu onde vai esconder o fusível; e "embaixo da estrela da festa" não é jeito de falar de quem "conta o que fez". | ressalva |
| 5 | Mensagem do diagnóstico aceito (loop-central.js:206) | "No interfone, a Dra. Sato quase sussurra" aparece em qualquer sala, porque a Máquina abre de qualquer lugar. O interfone fica no Subsolo. | ressalva |

Visto de passagem, fora do meu recorte (vale para quem avaliar as seções 1 e 4):
- `coop_catraca_ok` e `catraca_solo` concluem "Ele ainda está aqui dentro", e a fita do telão diz "Lenz entra no museu e não sai". Na revisão 3 ele saiu pela porta de serviço antes de 0:00.
- O minijogo de `c_esc_1` (volta 1) manda "abrir a tampa" da caixa de banners; a pista `c_peca` diz que ela só abre da volta 2, com motivo ("A caixa diz NÃO ABRIR").
- A tela m_traj_1.png mostra, atrás do minijogo, o cartão de preparação do caso antigo ("Como combinar sem estragar a surpresa?", noites.js:57). Em m00 e m_cracha_1 o cartão é o certo. Não consegui reproduzir a condição pelo código (`renderPrep` troca o texto quando `caseRules === 2`); vale conferir no fluxo do Professor.
- A fita do tempo e o texto da pista chamam a mesma coisa de "botão da Câmara" e "chave de ligar".

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só por escrito e inconfundível: peso e medida ("Eu sei o que eu carrego", `v4_teo`), ordem curta ("Tinta não mente.", `teo_d3`), olho de quem monta ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`; "Quando me viu, perguntou do tempo.", `teo_d2`). |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada em toda fala: `lenz_0` ("Boa noite, boa noite... Ótimo, ótimo."), `lenz_2` ("Tá escrito aí: emprestado. Eu devolvo tudo que eu pego."), `lenz_1` ("Nem você."), `lenz_mot_3`, `b_hist_2` ("Cada litro de diesel sai do nosso bolso."). Nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Quatro falas, quatro vezes seca e com número: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone` ("Limpei, pesei, devolvi: 4,2 kg."). |
| Aurélio | 4,5 | 4 | As três falas perguntam ou recuam (`aurelio_0`, `aurelio_1` "Você também sentiu?", `aurelio_2`); o laudo (`falsa_2`) tem a secura de acervo. Meio ponto fora: três falas, todas na mesma sala; a "palavra de acervo" só existe no laudo. |
| Braga | 4,5 | 4 | Agora fala muito e foge do assunto: `traj_aviso` ("eu conheço aquela porta de olho fechado. Chuva feia, hein? Pega um café"), `c_esc_3` ("Meu cunhado também mexe com transporte. Café?"), `cracha_3` ("Tá. ... E eu... eu deixei quieto."). Meio ponto fora: `v4_braga` é confissão limpa, sem o jeito dele. |
| Dra. Sato | 4,5 | 4 | Constante em 15 textos: "ela", pergunta de volta, humor seco ("O quê, quem tem olho aí é você.", `man_3`; "Ou não.", `man_2`; "Então ninguém liga isto sem mim. Ninguém.", `e_hist_1`). A fala do acerto entrou no jogo. Meio ponto fora: três das seis respostas de `man_3` usam o mesmo molde ("X pode ser duas coisas"), e os botões de ajuda põem a mão dela onde ela não está (2.C, linha 1). |
| Nico | 4,5 | 4 | Três falas e as três são dele: repara em quem chega (`nico_0`), perde o fio e repara no cinto do Braga (`nico_0b`), e pela primeira vez não pede desculpa (`nico_1`). O bordão agora é mostrado, não contado. |
| Seu Dirceu | 4,5 | 4 | `traj_2` ("Nem boa-noite."), `dirceu_0` ("Amanhã ninguém lembra quem limpou."), `ivone_ali_2` ("que eu passei pano ali três vezes"), `c_anc_3`. Meio ponto fora: `d_teo_2` ("embaixo da estrela da festa") não soa como ele. |
| **Média (8 com fala)** | **4,7** | **4,5** | 37,5 ÷ 8 = 4,69. **Passa.** Só os 7 principais: 33 ÷ 7 = 4,71. |

**Abaixo de 4:** ninguém.

Fora da média, mas é fala em texto público: a "funcionária", a "restauradora" e o "guarda" do manual de entrada (game.js `TOUR`). São falas genéricas (nota 1 a 2) de gente sem ficha. Não entraram na conta porque não são do elenco; entram na lista de correção (A1).

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 4,0 | Puxa sozinha: o lema, as pessoas que respondem ao que você mostra, o cofre com senha que tem motivo, o pêndulo que adianta o relógio de todo mundo, O Raio (código que muda a cada 10 s + janela de tempo: é a melhor coisa do jogo). Dois minijogos viraram dedução de verdade (`cracha_1`: "Onde o Braga está agora?"; As Duas Listas). Tira ponto: (1) em 4 das 6 atividades de investigação em dupla, a tela só pede **trocar uma palavra** (LUZ, MOLA...); o papel promete "você vê os símbolos e descreve", "segura a chave por 20 segundos", "segue as pegadas", e nada disso aparece (loop-central.js `lcAtivHtml`); (2) `falsa_1` é varrer 5 posições de luz e `c_esc_1` é apertar 3 botões numa caixa que a história diz que ainda não abre. |
| Integrada | 4,0 | Subiu: o papel é uma frase clara, são 8 missões secretas e o telão mostra no fim quem cumpriu e quem trouxe cada fato (t09, t10). Falta para 4,5: no jogo de sala, 30 pessoas leem ao mesmo tempo que são "a única pessoa que lembra"; e os 5 papéis da volta 5 (Mão A, Mão B, Central, Porta-voz, Guarda do dossiê) só existem no roteiro e nos dados: ninguém escolhe nem vê o seu na tela. |
| Identificada | 4,0 | O diagnóstico ensina e devolve com palavras de gente ("Você não chutou: dois sinais diferentes apontando para o mesmo lado e uma leitura dizendo 'aqui não é'."), o Revelar também ("o que foi feito, por onde passou, de quem era a mão"), e a fita do tempo é recompensa de entendimento. Falta para 4,5: (1) em dupla, Painel e Manual **anexa o diagnóstico sozinha** com uma página do manual (que é grátis) e a troca de uma palavra: a melhor lição do jogo fica pulável; (2) a fita não tem o motivo, nem o engano ("então apaga?"), nem o defeito da noite, e está fora de ordem; (3) no telão, o desfecho é frase de relatório ("A investigação avançou e deixou registros para a próxima tentativa."), não o final da história; (4) não há pergunta para a turma conversar, e a escolha Desligar × Revelar é uma ótima. |
| Externa (menos é melhor) | 1,5 → invertida 4,5 | Quase sem cara de obrigação. Restos: "Pedir dica não tira ponto" (não existe ponto), "(-1 de energia; ensaio sem punição)" na mesma frase, "Registrem o desfecho no celular". |
| Amotivação (menos é melhor) | 2,0 → invertida 4,0 | Todo final diz alguma coisa, até o Mínimo. O que faz a pessoa duvidar do que entendeu: o manual de entrada conta outra história (funcionária da surpresa, guarda calado, ronda que reúne todos); papéis de dupla que prometem o que a tela não mostra; minijogo que abre caixa que não abre; "Encaminhe a peça ao Subsolo" (a história diz "desce com ela nos braços"); "CONSERTO FEITO. O retorno foi interrompido." (palavra que não existe em mais nenhum lugar); telão dizendo "Nas voltas 3 e 4 é ensaio" (a regra é da 2 à 4); dicionário ainda com "Descarte" e "Dossiê: as pistas do grupo, juntas" (cada pessoa tem o seu). |
| **Nota da escala** | **4,1** | (4,0 + 4,0 + 4,0 + 4,5 + 4,0) ÷ 5. Mínimo 4,5. **Não passa.** |

Introjetada: neutra, não pontua.

**O que não deu para julgar sem jogadores reais (não puni):**
- se 5 de energia por volta, diante de 12 a 14 itens por sala, dá gosto de escolha ou sensação de falta;
- se os 10 segundos de caminhada criam tensão ou tédio;
- se falar em voz alta de salas diferentes funciona numa sala de aula barulhenta;
- se alguém de fato blefa a missão secreta na pausa;
- o ritmo das voltas 3 e 4: o validador mostra a dupla ótima com diagnóstico e conserto prontos na volta 2, gastando 19 de 50 de energia. Pode sobrar tempo morto; só se vê jogando;
- o prazer de girar a peça 3D e de montar a foto (`tombo_2`): julguei só o enunciado;
- a tela final do celular: não há captura; julguei pelo texto de `lcResumoFinal`;
- a página "Perguntas" do telão (t11): pelo código só aparece se alguém respondeu o formulário, que no Loop fica escondido. No simulador ela apareceu.

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

Total aproximado: (a) 16 correções de texto ou dado, ~640 palavras, nenhuma muda enredo; (b) 6 mudanças de mecânica, uma delas (B3) pede decisão do autor porque mexe em fato fixado da Dra. Sato.

### (a) Texto e dado

**A1. Manual de entrada — game.js, `TOUR`, campo `c` dos 6 passos, e título em sala/index.html:42 (~150 palavras).** Resolve a contradição 2 e o maior peso da Amotivação. Usa só falas que já existem no jogo.
- Título (sala/index.html): `Um raio. O tempo recomeça.`
- Passo 1: `Fim de tarde no museu. Amanhã abre a maior exposição da casa. Na Galeria, o curador não tira o olho da peça principal: "Está linda, não está?" Ele não parece ter certeza.`
- Passo 2: `Cada sala guarda um objeto. Gire, chegue perto. O que importa quase nunca está de frente.`
- Passo 3: `Na Central, o Braga empurra uma xícara: "Chuva feia, hein? Pega um café." Daqui a cinco minutos ele vai dizer isso de novo. Só você vai saber.`
- Passo 4: `O museu esquece. O caderno lembra. O chão guarda. O que você anota volta com você. O que você deixa no chão fica lá.`
- Passo 5: `Um raio. A luz cai, volta mais fraca, e o museu inteiro recomeça. No Subsolo, uma máquina ligada que ninguém consegue desligar.`
- Passo 6: `Alguém trocou a peça principal por uma cópia. Na última volta, quem tiver 3 provas no caderno diz o nome na Recepção. Uma chance só.`

**A2. Ajuda da Dra. Sato no ajuste e no circuito — loop-central.js:398, 463, 468 (~45 palavras).** Resolve metade da contradição 1 sem mexer em regra: ela não entrega nada, ela confia no que você viu.
- Botão: `📞 Com a Dra. Sato na linha (N de energia)`
- Linha pequena: `Você conta de cabeça uma coisa que viu e não anotou. Desta vez, ela confia.`
- Recusa: `A Dra. Sato confia em UMA coisa que você viu e não anotou. Ainda faltam: ...`
- Acerto: `Pelo interfone, a Dra. Sato escuta e demora: "Tá. Desta vez eu confio. Gira."`
(A outra metade, trava e chave, está em B3.)

**A3. Assinatura do Téo — `teo_d1`, `teo_d2`, `teo_d3` (3 palavras).** Acrescentar ` — T.` antes da aspa final de cada uma.

**A4. Papel no jogo de sala — sala/index.html, frase de abertura (~20 palavras).** O individual continua com "a única pessoa".
`Nesta atividade você vive o papel de quem lembra das voltas. O museu esquece. Você e o seu caderno, não.`

**A5. Desfecho no telão — ritmo.js, `LOOP_FINAIS` (~110 palavras).** O celular já mostra o final da história; o telão passa a mostrar também, falando com a turma.
- Ouro: `A máquina para e a verdade fica. O relógio marca 5:01 pela primeira vez. Lá fora, uma sirene. Na Sala das coleções, o Téo abre os olhos.`
- Desligar: `O relógio passa de 5:00 e continua. Vocês devolveram a manhã ao museu. Cedo, uma caixa de "banners" sai pela porta da frente. Ninguém viu o que vocês viram.`
- Revelar: `As 3 provas apareceram neste telão. Às 5:00 o museu esquece de novo. Os cadernos, não. A máquina ainda gira.`
- Parcial: `O museu reinicia mais uma vez. Na Galeria, a cópia continua na base, cheirando a verniz. O caso fica aberto, e os cadernos de vocês são a peça principal.`
- Mínimo: `O museu esquece de novo. O raio cai, a luz volta, o homem de paletó desce a escada. Os cadernos não esquecem. Já é um começo.`

**A6. Fita do tempo — ritmo.js, `LOOP_LINHA`, e loop-central.js, `LC_FATO_PISTA` (~90 palavras).** Pôr na ordem em que aconteceu, trocar a câmera 4 (que é despiste) pelo engano, e acrescentar o motivo. Fica com 9 fatos:
1. `troca` · Dias antes · `A peça verdadeira é trocada por uma cópia`
2. `motivo` · Dias antes · `Se a peça sumir, o seguro paga o patrocinador` — pistas: `motivo_1`, `lenz_mot_2`, `lenz_mot_3`, `v5_lenz`
3. `copia` · Hoje · `A peça da Galeria é cópia: verniz novo, peso errado`
4. `entrada` · Começo da noite · `Alguém do patrocínio entra pela porta de serviço com o crachá do Braga` — pistas: `lenz_op_1`, `cracha_4`, `cofre_ronda`, `assim_par`
5. `teo` · Antes de 0:00 · `O Téo confronta quem trocou a peça e é empurrado`
6. `raio` · Apagão · `O raio atinge o Pátio e a luz apaga`
7. `passagem` · 4:00 · `Alguém de paletó volta e vai para o Subsolo`
8. `cracha` · 4:00 · `A mão no crachá do Braga é a do Lenz`
9. `engano` · 4:10 · `Ele vira a chave da Câmara achando que ela apaga cinco minutos. Ela só repete` — pistas: `rev_3` (a ata "então apaga?")

**A7. Leitura do painel sem dar o nome do defeito — `coop_painel_A` a `coop_painel_E` (~75 palavras).** Anda junto com B1.
- A: `Leitura completa do painel: carga cheia, luz da peça verde, fusíveis no lugar. Os 3 mostradores estão fora do ponto.`
- B: `Leitura completa do painel: números parados, luz da peça verde, fusíveis no lugar. Só a carga está baixa.`
- C: `Leitura completa do painel: números parados, fusíveis no lugar. A carga cai e a luz da peça está amarela.`
- D: `Leitura completa do painel: tem força chegando e a luz da peça está verde. Os mostradores piscam, a luz cai, e o encaixe do fusível-mestre está vazio.`
- E: `Leitura completa do painel: luz da peça verde, fusíveis no lugar. Mostradores fora do ponto E carga baixa.`

**A8. Minijogo da caixa na hora certa — loop-central.js, `LC_MG` (~25 palavras).** Tirar a entrada `c_esc_1` e pôr a mesma atividade em `c_peca` (volta 2, quando abrir tem motivo):
`c_peca:{ativ:'caixa', resp:'faixa/fundo/tampa', nome:'Abrir a caixa de banners', texto:'Agora você tem motivo. Corte a faixa, solte o fundo e levante a tampa.'}`

**A9. Respostas do interfone com menos molde — `man_3`, `textoPorSintoma` (~45 palavras).**
- `sint_luz`: `Você conta da luz fraca. Ela responde: "Luz caindo a cada tentativa? Ou tem coisa puxando, ou tem coisa faltando. Vai até a caixa de fusíveis e me conta o que tem lá."`
- `sint_pisca`: `Você conta dos mostradores piscando. Ela responde: "Sem ritmo? Ou ela perdeu os números, ou perdeu um pedaço. Olha a caixa de fusíveis. Depois me liga."`

**A10. Seu Dirceu na noite D — `d_teo_2` (~40 palavras).** Mexe em pista essencial (aponta a Galeria para achar o F2): pede reconferência de jogo limpo.
`Seu Dirceu conta, de pano na mão: "Antes de escurecer o Téo passou com uma pecinha de vidro, indo pra Galeria. Perguntei o que era. 'Coisa que não pode ficar no lugar.' Subiu. Voltou de mão vazia. Eu reparo."`

**A11. Caixa de dica — individual.html e sala/index.html, `journalDialog` (6 palavras).** `Pedir dica não tira nada de você.`

**A12. Valor errado — loop-central.js:54 (~12 palavras).** Tirar "; ensaio sem punição". Na volta 4, a frase passa a ser: `A MÁQUINA NÃO REAGE: 2 de 3 certos. Era ensaio: você só gastou a energia.`

**A13. Conserto feito — loop-central.js:244 (~14 palavras).** `CONSERTO FEITO. A máquina está inteira. Agora o botão "Loop Reset" responde.`

**A14. Dicionário — loop-central.js, `LC_GLOS` e `LC_GLOS_LISTA` (~45 palavras).**
- Trocar "Descarte" por `Leitura normal`: `Pista que mostra uma parte da máquina que está bem. Ela afasta outro defeito.`
- `Dossiê`: `O seu caderno de provas sobre a máquina.`
- `Ensaio`: `Treino do conserto: até a volta 4 você treina, na 5 vale.`

**A15. Telão, página Máquina — sala/telao/telao.mjs, `pgMaquina` (9 palavras).** `Até a volta 4 é ensaio. Na volta 5 vale.`

**A16. Peça levada ao Subsolo — loop-central.js:284, 295, 298 (~40 palavras).**
- Texto: `Desça com a peça verdadeira e deixe ao lado do apoio, no Subsolo. O chão guarda.`
- Botão: `Descer com a peça e deixar no chão · 1 de energia`
- Aviso: `Você desceu com a peça e deixou ao lado do apoio. Na próxima volta ela está lá.`

### (b) Mecânica

**B1. Painel e Manual não anexa mais sozinha (Identificada).** A atividade entrega a leitura completa (texto A7), que no Dossiê continua valendo sozinha, mas é a pessoa que escolhe o defeito entre os cinco, usando o manual. Tirar `anexa_diagnostico` da atividade e o aviso da linha 240.

**B2. Dupla com informação de verdade, não só palavra (Intrínseca, Amotivação).** Aproveitar o que o jogo já tem (o botão de segurar do Raio, a legenda `man_legenda`):
- Painel e Manual: a tela do Subsolo mostra 3 símbolos com estado (ponteiro, três janelas, luz redonda) e a do Ateliê mostra a legenda. Quem está no Subsolo descreve; quem está no Ateliê traduz e digita.
- Apagão Combinado: quem está no Pátio segura um botão por 20 s; as pegadas só aparecem na tela da Área de descanso enquanto o botão estiver seguro.
- Lado a Lado: a tela da Galeria lista 3 traços da peça, a da Sala da fotografia lista 3 da foto; a pergunta "o que não bate?" vem depois.
- Se não der para fazer agora, pelo menos reescrever `papelA` e `papelB` dessas atividades para dizer o que a tela faz de fato.

**B3. Dra. Sato fechando chave e segurando trava (contradição 1, segunda metade). PEDE DECISÃO DO AUTOR.** Dois caminhos:
- (i) tirar os botões "Numa volta só, com a Dra. Sato" (linha 405) e "Sem eco, com a Dra. Sato" (linha 421). Os caminhos do chão e do eco continuam. Não mexe na ficha.
- (ii) manter e dar razão no mundo: pista nova no Subsolo, grátis, `Plaquinha ao lado do interfone, com a letra da Dra. Sato: "Linha de serviço: daqui de fora eu destravo o apoio e fecho a chave do para-raios. Uma vez por noite. Não vejo nada: me diz a hora."`, e a 9ª exceção em FICHAS.md: `Dra. Sato tem uma linha de serviço com a Câmara: de fora, destrava o apoio ou fecha a chave do para-raios uma vez por noite. Continua sem ver.` Os textos dos botões passam a dizer "pela linha de serviço".

**B4. Defeito da noite na fita (Identificada).** Décima linha, vinda de quem anexou o diagnóstico: `5:00 · Por que a máquina travou: <nome do defeito> · Quem trouxe: <nomes>`.

**B5. Papéis da volta 5 na tela (Integrada).** Na pausa da volta 4, cada pessoa toca num papel (Mão A, Mão B, Central, Porta-voz, Guarda do dossiê); a página Turma do telão mostra nome e papel; o celular mostra a dica de tela do papel escolhido (os textos já estão no roteiro, parte 7).

**B6. Pergunta para a turma no fim (Identificada).** Página nova no telão, depois de "A noite": `Para conversar` · `Consertar a noite ou contar a verdade: dava para fazer os dois? Se só desse uma, qual vocês escolhiam, e quem pagava por ela?`

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (r2) | Agora (r3) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem mudança. |
| 2.4 traço extremo com cena | Não passa (15 de 16) | **Passa** (16 de 16) | `nico_0` reescrita e `nico_0b` nova; ficha aponta as cenas certas da Dra. Sato. |
| 2.4 falas não contradizem a ficha | Não passa (2) | Não passa (2, outras) | As duas antigas sumiram (crachá; cafeteira). As de agora estão em texto de tela que a rodada 2 não tinha olhado: ajuda da Dra. Sato e manual de entrada. |
| 2.4 exceções registradas | Passa (com ressalva) | Passa | Entraram Aurélio, Téo não prevê, Lenz na escada, Dirceu "desde ontem". |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa. |
| Téo | 5,0 | 5,0 | Mantém. |
| Lenz | 4,5 | 5,0 | Mesmas falas; saiu o desconto de autoavaliação do avaliador anterior, que não vale para mim. |
| Ivone | 4,5 | 5,0 | `ivone_red` virou cena com a voz dela; `v5_ivone` não promete mais hora. |
| Aurélio | 4,5 | 4,5 | Sem mudança. |
| Braga | 4,0 | 4,5 | `traj_aviso` e `c_esc_3` com o jeito dele. |
| Dra. Sato | 4,5 | 4,5 | A fala do acerto entrou; o molde de `man_3` e os botões de ajuda seguram. |
| Nico | 3,5 | 4,5 | De 2 para 3 falas, bordão mostrado, atenção às pessoas em cena. |
| Seu Dirceu | 4,0 | 4,5 | `ivone_ali_2` e `dirceu_0` com voz. |
| **3.1 média** | **4,3** | **4,7** | Sobe 0,4. Passa. |
| Intrínseca | 4,0 | 4,0 | Minijogos melhoraram (2 viraram dedução); apareceu a dupla que só troca palavra. |
| Integrada | 3,5 | 4,0 | Papel em frase clara, 8 missões, nome no telão. |
| Identificada | 4,0 | 4,0 | Acerto devolvido com palavras de gente; em compensação, Painel e Manual pula o diagnóstico e o telão fecha com frase de relatório. |
| Externa (bruta) | 2,0 | 1,5 | Formato saiu da mensagem de erro; sobram três frases. |
| Amotivação (bruta) | 2,0 | 2,0 | O texto velho da rodada 2 foi limpo (pausa, botões, placar, Área de descanso); o manual de entrada e os papéis de dupla trouxeram outro tanto. |
| **3.2 nota** | **3,9** | **4,1** | Sobe 0,2; falta 0,4. |

Nenhuma nota caiu. Das correções desta rodada, só A10 mexe em pista essencial (pede reconferência de jogo limpo, seção 1) e só B3 mexe em fato fixado de personagem (pede decisão do autor). B1 muda quando a dupla consegue o diagnóstico: o validador precisa rodar de novo.

## 5. Fim do ciclo

**Nem todas as escalas passaram.** Seção 2: 4 de 5 itens. Seção 3.1: 4,7, passa. Seção 3.2: 4,1 de 4,5, não passa. O ciclo de renovação continua.
