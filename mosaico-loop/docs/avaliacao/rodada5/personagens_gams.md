# Mosaico Loop v4 (revisão 5) — Avaliação, rodada 5 — Seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliação feita do zero, sobre os textos atuais. Li por inteiro: ESCALAS_AVALIACAO_JOGOS.md, FICHAS.md, DECISOES-V4.md, pistas_legivel.txt (278 pistas), atividades.txt (10 atividades, 5 finais, regras e grupos), loop-central.js (739 linhas), ritmo.js, e reserva/minigames.mjs no trecho que trata resposta errada. Do ROTEIRO-LOOP.md li as partes 1, 2, 6 (atividades em dupla), 7 e 12; não li as partes 3, 4, 5 e 8 a 11. De game.js li o `TOUR`, os textos da pausa e os textos entre voltas; de telao.mjs, as linhas de texto. Vi 18 telas (entrada, manual, sala, lista, dossiê, Atividades, Revelar, pausa, livro, última decisão, resultado, e 4 páginas do telão final). A captura `v5/a08_atividade_aberta.png` mostra a aba Revelar, não um cartão de atividade aberto: o cartão aberto eu li só no código. Não editei nada no repositório.

Aviso de autoavaliação: não escrevi nenhum texto do jogo; não há desconto de autoria a aplicar.

---

## 1. Nota geral

**NÃO PASSA ainda, por 0,1.** Seção 2: 5 de 5 itens passam. Seção 3.1: **4,8** (mínimo 4,5), ninguém abaixo de 4: **passa**. Seção 3.2: **4,4** (mínimo 4,5): **não passa**. Quem segura é a Intrínseca (4,0): as perguntas dos minijogos. O que falta para 4,5 é texto e dado (4 correções, ~110 palavras); nenhuma mudança de mecânica é obrigatória.

---

## 2. Tabela por critério

### 2.A Seção 2 — checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md traz os 8 com papel, 5 traços, honestidade-humildade e as 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 de 18 negritos com cena; todo id citado na ficha existe nos dados com o texto que a ficha descreve (tabela 2.B). |
| Falas e ações não contradizem a ficha | **Passa** | coerente | A contradição da rodada 4 saiu: `man_cal_3` e `d_ord_1` agora terminam em "— T." (os 11 bilhetes e páginas do Téo estão assinados). Dra. Sato só pede socorro depois de ouvir do Téo (`sato_teo`: "Peço socorro agora"). Nico só entrega com motivo dito por ele (`nico_1`, tranca: "só entrego se ele não aparecer"). Lenz entra pela frente e é visto (`cracha_4`, `lenz_op_1`, `lenz_op_2`). Duas ressalvas de voz, que não chegam a contradição (2.C). |
| Exceções registradas na ficha | **Passa** | completo | 10 exceções escritas. A nova frase "a confiança cobre só informação, objeto precisa estar com quem joga" bate com o código (`solosato`: "Pelo interfone não passa objeto."). |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura por 20 termos em game.js, loop-central.js, loop-central-dados.js, ritmo.js, noites.js, noites-motor.js, coop.mjs, rooms.mjs, os HTML, sala/, telão, simulador/, reserva/, pistas e atividades: zero ocorrências com esse sentido ("abertura" só aparece como palavra comum). |

### 2.B Traço extremo × cena (conferido pista por pista)

| Pessoa | Traço extremo | Cena | Ok? |
|---|---|---|---|
| Aurélio | Ansiedade alta | `aurelio_0` ("Está linda, não está?"), `falsa_1` (respira pela boca) | sim |
| Aurélio | Foge da lacuna | `aurelio_1` ("Eu demorei para acreditar.") | sim |
| Aurélio | Não aguenta pressão | `aurelio_2` ("Disse a mim mesmo que era cansaço dele. Era medo meu.") | sim |
| Téo | Honestidade alta | `data_3`, `d_teo_1` ("Desculpa, Dra. Sato."), `d_fus_2b` ("Fui eu. — T."), `teo_radio` (recusa o envelope) | sim |
| Téo | Não larga a lacuna | `teo_d1` ("Sozinho pra quê?"), `v4_teo` ("Eu sei o que eu carrego.") | sim |
| Téo | Aceita risco | `teo_d3` ("Hoje à noite eu falo com ele."), `teo_radio` ("cara a cara") | sim |
| Ivone | Método | `ivone_1x` ("Eu não perco pote."), `v5_ivone` (4,2 kg) | sim |
| Ivone | Pouca curiosidade pelas pessoas | `ivone_2` ("Devia ter perguntado por quê."), `ivone_red` (aponta sem olhar) | sim |
| Braga | Quer agradar | `traj_aviso`, `c_esc_3` ("Café?"), `cracha_3` ("Quer um café?") | sim |
| Braga | Não aguenta pressão | `braga_1` (dá de ombros rápido demais), `dis_cafe` (esconde a xícara), `v4_braga` (riscado duas vezes) | sim |
| Lenz | Pouca amabilidade | `lenz_0` (não espera a resposta), `lenz_1` ("Nem você.") | sim |
| Lenz | Pouca honestidade | `lenz_2` ("Eu devolvo tudo que eu pego."), `cracha_2` | sim |
| Lenz | Não aguenta pressão | `traj_3` (fala sozinho na escada), `lenz_mot_3` ("ou eu não tenho mais empresa") | sim |
| Lenz | Busca risco | `v5_lenz` ("Peça por fora: +?", "ninguém confere a base") | sim |
| Dra. Sato | Abertura | `man_anc_2` ("Nunca aconteceu, mas vai que"), `man_2` ("Ou não.") | sim |
| Dra. Sato | Não larga a lacuna | `man_3` ("Me conta o que você viu com os seus olhos."), `a_hist_1`, `e_hist_1` | sim |
| Nico | Pouca ordem | `nico_0b` (perde o fio), `fh_fusivelx` (fusível para a cafeteira) | sim |
| Nico | Muita atenção às pessoas | `nico_0` ("cara de quem não jantou"), `nico_0b` (o Braga e o cinto) | sim |

### 2.C Ressalvas (não derrubam item)

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | loop-central.js, caminho "com a Dra. Sato na linha": `"Tá. Desta vez eu confio. Gira."` | "Tá." é a marca do Braga na ficha ("começa a verdade com 'Tá.'"). Na boca da Dra. Sato, mistura duas vozes. | ressalva (1 palavra) |
| 2 | Braga, 4 falas ao vivo (`braga_1`, `traj_aviso`, `c_esc_3`, `cracha_3`) | As quatro fecham no café. A ficha dá três fugas (a chuva, o cunhado, a porta); o café virou cacoete. | ressalva (voz) |

Visto de passagem, fora do meu recorte (vale para as seções 1, 4 e para o padrão visual):
- game.js, linha 157: a descrição do Subsolo ("A Câmara do tempo zumbe, tenta ligar e desiste.") é a mesma nas 5 noites e repete, quase palavra por palavra, o sinal de carga baixa (`b_carga_1`: "tenta ligar, perde o fôlego e desiste"), que só existe em 3 delas.
- `v5/a02_manual.png` (360 px): no primeiro passo do manual, os nomes das salas quebram no meio da palavra ("Centra l de monito ramento", "Câmar a do tempo").

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só por escrito e inconfundível: peso e medida ("Eu sei o que eu carrego", `v4_teo`), ordem curta ("Tinta não mente.", `teo_d3`), olho de quem monta ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`), o envelope recusado (`teo_radio`). Agora assina tudo. |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada em toda fala: `lenz_0` ("Ótimo, ótimo."), `lenz_2` ("Eu devolvo tudo que eu pego." ... "Lenz. Agora não."), `lenz_1` ("Ninguém quer confusão hoje. Nem você."), `b_hist_2` ("Cada litro de diesel sai do nosso bolso."). Nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Seca e com número: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone` ("Limpei, pesei, devolvi: 4,2 kg."). |
| Dra. Sato | 5,0 | 4 | Constante em mais de 15 textos: "ela", pergunta de volta, humor seco (`man_3`, `man_2` "Ou não.", `e_hist_1` "Ninguém.", `fh_ficha_bc` "Levar o guarda-chuva."). A resposta à base apitando agora devolve pergunta ("quem tem olho é você. Como está a peça?"). Em `sato_teo` fala da máquina antes da pessoa: é a ficha. Fora da nota, por ser uma palavra num caminho opcional: o "Tá." (2.C, linha 1). |
| Seu Dirceu | 5,0 | 4 | Figurante com voz em oito textos: `traj_2` ("Nem boa-noite."), `ivone_ali_2` ("passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `assim_leg` ("Quem sujou meu chão?"), `d_teo_2` ("Eu reparo."), `dirceu_0`. |
| Aurélio | 4,5 | 4 | As três falas perguntam ou recuam (`aurelio_0`, `aurelio_1` "Você também sentiu?", `aurelio_2` "Era medo meu."). Meio ponto fora: a "palavra de acervo" da ficha só existe no laudo (`falsa_2`), e as três falas ficam na mesma sala. |
| Braga | 4,5 | 4 | Fala muito e foge do assunto (`traj_aviso`, `c_esc_3`, `cracha_3` "Tá. ... eu deixei quieto."). Meio ponto fora: o café fecha as quatro falas ao vivo (2.C, linha 2). |
| Nico | 4,5 | 4 | Três falas, as três dele (`nico_0`, `nico_0b`, `nico_1` "pela primeira vez ele não pede desculpa"), mais o bilhete do fusível e o gato "Fusível". Meio ponto fora: pouco texto para o guia do museu, tudo numa sala, e a segunda fala só abre da volta 2. |
| **Média (8 com fala)** | **4,8** | **4,5** | 38,5 ÷ 8 = 4,81. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 4,0 | Puxa sozinha: o museu que esquece, gente que só muda de fala quando você mostra o caderno, tranca com motivo no mundo, cofre com a senha de trás para a frente, o pêndulo, O Raio, o ensaio que só diz "2 de 3 certos", e quatro atividades em dupla com informação diferente em cada tela (Lado a Lado, As Duas Listas, Painel e Manual, Acusação e Defesa). Os dois motivos da rodada 4 saíram. O que segura a nota agora: (1) `cracha_1` continua pergunta óbvia ("Onde o Braga está agora?" / "Aqui na Central, na sua frente") e não pede o caderno; (2) em `tombo_2` e `c_peca` a opção certa se reconhece pela forma, sem caderno ("A cor da parede"; só uma opção fala de peso, e o rótulo da própria caixa já diz "pesa demais"); (3) a pergunta de Acusação e Defesa não usa a letra deitada, que é o que dá o nome: quem liga o bilhete ao visto é o texto da pista (`coop_veredito`), não a dupla; (4) resposta errada em minijogo não custa nada e são 3 opções (reserva/minigames.mjs: só troca a mensagem), então dá para passar tocando; (5) em Três Números, Fio a Fio e A Verdadeira, os dois aparelhos precisam ter tudo no próprio caderno para o cartão abrir (`lcFaltas`), então quem dita não sabe nada que quem digita não saiba. |
| Integrada | 4,5 | Papel em frase clara nas duas entradas ("você vive o papel de quem lembra das voltas"), 8 missões secretas com convite a blefar e agora ligadas à pista certa (Braga, Ivone), papel da última volta escolhido na pausa e mostrado no telão, "Quem trouxe" com nome em cada fato da fita, escolha final de valor. Falta para 5: os papéis chamam "Mão A" e "Mão B" (nome de projeto, não de gente); a missão "quem ganha dinheiro" se cumpre com um toque na volta 1 (`motivo_1`) e a do Nico só é possível da volta 4. |
| Identificada | 4,5 | O diagnóstico pede raciocínio que a pessoa reconhece como dela ("Você não chutou: dois sinais diferentes... e uma leitura dizendo 'aqui não é'"), o erro volta com motivo, pista por pista, os finais por causa cobram a escolha ("A manhã chega, limpa demais."), o telão fecha com a fita e a pergunta para conversar. Falta para 5: no telão final, as fichas dizem "Defeito achado · ficou aberto" (o título afirma e o selo nega; `tl/u_res_desfecho_1920.png`). |
| Externa (menos é melhor) | 1,5 → invertida 4,5 | Sem ponto, sem ranking; a recompensa é +1 de energia e o nome no telão. Restos de formulário: "Marcadas: 3 de 3 · sinais: 2 (2 tipos) · leitura normal: 1.", "A tentativa desta volta foi gasta.", botão "Registrar revelação". |
| Amotivação (menos é melhor) | 1,5 → invertida 4,5 | Os cinco pontos da rodada 4 saíram: os papéis de Três Números e Fio a Fio dizem o que a tela faz, a pausa não fala de conserto que não existe, o final mínimo chama "O museu esqueceu", As Duas Listas mostra as listas, "um conserto por volta". Sobra pouco: muita palavra de regra junta no Dossiê (sinal, leitura normal, etiqueta, ensaio, eco, meio conserto), amparada pelo "?" e pelo dicionário. |
| **Nota da escala** | **4,4** | (4,0 + 4,5 + 4,5 + 4,5 + 4,5) ÷ 5. Mínimo 4,5. **Não passa.** |

Introjetada: neutra, não pontua.

**O que não deu para julgar sem jogadores reais (não puni):**
- se 5 de energia diante de 12 a 14 itens por sala dá gosto de escolha ou sensação de falta;
- se os 10 segundos de caminhada criam tensão ou tédio;
- se falar em voz alta de salas diferentes funciona numa sala de aula cheia;
- se alguém de fato blefa a missão secreta na pausa;
- se, na prática, as pessoas passam os minijogos tocando nas 3 opções (pesei só o fato de o jogo deixar, não o hábito);
- se ditar valores que os dois já têm é sentido como cooperação (pesei só o fato de não haver diferença de informação);
- o ritmo das voltas 3 e 4 para quem já tem diagnóstico e ensaio;
- o prazer de girar a peça 3D e de mexer na luz em `falsa_1`;
- a fita do telão numa TV de verdade (vi capturas de 1280 e 1920, com 6 de 10 fatos; a décima linha não apareceu porque ninguém anexou o defeito).

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

Só a 3.2 ficou abaixo. Total: (a) 4 correções que fazem passar (~110 palavras) e 5 de acabamento (~45 palavras); (b) 2 mudanças de mecânica, opcionais, que pedem decisão do autor.

### (a) Texto e dado

**Fazem a Intrínseca chegar a 4,5 (todas em loop-central.js):**

**A1. `LC_MG.cracha_1` — tirar a entrada (0 palavras).** A pista entra direto. A pergunta é óbvia e o conteúdo dela já é cobrado, melhor, em `traj_1` (de quem é o crachá) e em Acusação e Defesa (o Braga sentado na Central).

**A2. `LC_MG.tombo_2` — 4 opções da mesma sala, do mesmo tamanho (~20 palavras).**
`opcoes:['O cheiro de verniz fresco','O apito curto da base','A luva branca numa mão só','O quadro que entorta sozinho']`

**A3. `LC_MG.c_peca` — opções que só o caderno separa (~25 palavras).**
`opcoes:['A que entrou leve e hoje pesa','A que entrou pesada e hoje está leve','A que entrou hoje, com escolta','A que ninguém pesou']`

**A4. `LC_MGA.coop_acusacao_defesa` — a dupla acha a letra (~60 palavras).**
`{ativ:'livro', resp:0, nome:'Pôr a escala e o bilhete lado a lado', texto:'O bilhete não tem assinatura. O que, na escala, foi escrito pela mesma mão?', opcoes:['O visto do patrocínio, no pé da folha','O nome BRAGA, na linha da porta de serviço','A linha "liberado até o fim do turno"','Nada: a escala é toda impressa'], dicas:['Quem está com o bilhete diz como é a letra. Quem está com a escala procura igual.','A letra do bilhete deita para a direita.']}`

A1 a A4 mexem em minijogo que dá pista essencial: pedem nova rodada do validador e reconferência de jogo limpo. Nenhuma muda enredo.

**Acabamento (não são necessárias para passar):**

**A5. Papéis da última volta — loop-central-dados.js, `papeis_volta5`, e ROTEIRO parte 7 (~25 palavras).** "Mão A" → `Quem opera`; "Mão B" → `Quem apoia`. Dicas: `Você opera o conserto. Faça só a sua parte e fale o que vê.` / `Você apoia o conserto, da outra sala. Faça só a sua parte e fale o que sabe.`

**A6. Fichas do telão final — sala/telao/telao.mjs, linha 163 (9 palavras).** Títulos `Achar o defeito`, `Consertar a Máquina`, `Revelar a noite` (os mesmos da página de objetivos, linhas 140 a 142), para "✓ feito / ficou aberto" fazer sentido.

**A7. Dra. Sato — loop-central.js, `solosato` (1 palavra).** `"Desta vez eu confio. Gira."` (sai o "Tá.").

**A8. Braga — `braga_1` (~8 palavras).** Trocar "Senta aí, quer café?" por `Bateria velha, igual à do carro do meu cunhado.` O café fica nas outras três.

**A9. Missão "quem ganha dinheiro" — `LC_MISSOES` (dado).** `ok:() => lcTemGrupo('motivo_lenz')` (sai `motivo_1`, que se pega com um toque no primeiro minuto).

### (b) Mecânica (opcionais; pedem decisão do autor)

**B1. Resposta errada com preço.** Hoje errar um minijogo não custa nada. Opção barata: errou, a bancada fecha e o item fica "ainda não" por 30 segundos. Mexe em regra.

**B2. Entrada por papel nos consertos em dupla (Três Números, Fio a Fio, A Verdadeira).** Hoje os dois aparelhos precisam de tudo. Se o aparelho do Subsolo pedir só diagnóstico e receita, e os valores ficarem só no caderno de quem dita, o ditado vira informação de verdade, sem tela nova. A revisão 5 decidiu só reescrever os papéis; esta proposta reabre essa decisão e pede o validador de novo.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (r4) | Agora (r5) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem mudança. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | Sem mudança. |
| 2.4 falas não contradizem a ficha | Não passa (1, pequena) | **Passa** | Os dois bilhetes do Téo ganharam "— T.". Sobram duas ressalvas de voz. |
| 2.4 exceções registradas | Passa | Passa | "Dra. Sato na linha" ganhou o limite: só informação, nunca objeto. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa. |
| Téo | 5,0 | 5,0 | Mantém; assinatura em tudo. |
| Lenz | 5,0 | 5,0 | Mantém. |
| Ivone | 5,0 | 5,0 | Mantém. |
| Dra. Sato | 5,0 | 5,0 | Mantém; a resposta à base apitando deixou de entregar o diagnóstico. |
| Seu Dirceu | 5,0 | 5,0 | Mantém. |
| Aurélio | 4,5 | 4,5 | Sem mudança nas falas. |
| Braga | 4,5 | 4,5 | Sem mudança nas falas. |
| Nico | 4,5 | 4,5 | Sem mudança nas falas; a tranca do pendrive ganhou motivo. |
| **3.1 média** | **4,8** | **4,8** | Igual. Passa. |
| Intrínseca | 4,0 | 4,0 | Os dois motivos da r4 saíram (três minijogos e Acusação e Defesa só com palavra). Não subiu porque, lendo do zero, achei o que a r4 não pesou: `cracha_1` óbvia, opção certa reconhecível pela forma em duas, erro sem custo, e a regra de entrada que tira a diferença de informação de três consertos (a r4 deixou isso como "não observável"; a regra está no código). |
| Integrada | 4,5 | 4,5 | Missões do Braga e da Ivone corrigidas; faltam os nomes dos papéis. |
| Identificada | 4,5 | 4,5 | Interfone corrigido; falta o rótulo das fichas do telão. |
| Externa (bruta) | 1,5 | 1,5 | Mesmos restos de formulário. |
| Amotivação (bruta) | 2,0 | 1,5 | Saíram os cinco pontos: papéis de conserto, dica da pausa, nome do final mínimo, listas na tela, frase do meio conserto. |
| **3.2 nota** | **4,3** | **4,4** | Sobe 0,1; falta 0,1. |

Nenhuma nota caiu.

## 5. Fim do ciclo

**Nem todas as escalas passaram.** Seção 2: 5 de 5. Seção 3.1: 4,8, passa. Seção 3.2: 4,4 de 4,5, não passa. O ciclo de renovação continua.
