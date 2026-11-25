# Mosaico Loop v4 (revisão 7) — Avaliação, rodada 7 — Seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliação feita do zero, sobre os textos e as telas atuais. Não editei nada no repositório.

**O que li:** ESCALAS_AVALIACAO_JOGOS.md (inteiro), FICHAS.md (inteiro), DECISOES-V4.md (inteiro), pistas_legivel.txt (as 278 pistas), atividades.txt (regras, trancas, 10 atividades, 5 finais, papéis), ritmo.js (inteiro), loop-central.js (linhas 177 a 768: anexar, finais, tela da Máquina, atividades, Revelar, minijogos, missões, papéis; do começo só o dicionário e a mensagem de erro), o `TOUR` e as descrições de sala em game.js, os textos de sala/telao/telao.mjs, a entrada de sala/index.html. Do ROTEIRO-LOOP.md li as partes 1 a 5, o fim da 6, a 7, a 8 e a 14; **não li** as partes 9 a 13 (histórico das revisões 2 a 6) nem o miolo da parte 6 (as cinco causas, que conferi pelas pistas). De reserva/minigames.mjs não li o código: vi os minijogos abertos na tela.

**O que vi na tela:** 5 de `r7/vis`, 4 de `r7/tl`, 1 de `r7/fita` (missões com 40), 1 de `r7/torre`, e capturas minhas em `r7/pg/` (script `cap.mjs`): 3 minijogos abertos (luz, caixa, foto antiga), o cartão de As Duas Listas e o de Acusação e Defesa abertos na Central, o Dossiê. A Sala dos sons eu li pelo texto da tela (gravador parado e tocando); a captura dela não saiu na sala certa. O minijogo da fita da porta de serviço não abriu no meu teste (antes de 4:00 a pista fica "ainda não"); li no código.

**O que medi:** a página "A noite" do telão com 10 fatos, 2, 6 e 40 pessoas, em 1024, 1280, 1366 e 1920 de largura, com nomes longos ("Maximiliano Albuquerque", "Wellingtonzinho da Silva"): script `r7/pg/fita_av.mjs`, feito a partir do `r6/pg/fita.mjs`.

Aviso de autoavaliação: não escrevi nenhum texto do jogo; não há desconto de autoria a aplicar.

---

## 1. Nota geral

**PASSA, no limite.** Seção 2: 5 de 5 itens passam. Seção 3.1: **4,9** (mínimo 4,5), ninguém abaixo de 4. Seção 3.2: **4,5** (mínimo 4,5), sem folga nenhuma: as cinco subescalas estão em 4,5, e meio ponto a menos em qualquer uma derruba a escala para 4,4. A fita do telão, que segurava a rodada 6, está corrigida e medida. Sobra um defeito de dado que a revisão 7 diz ter corrigido e não corrigiu inteiro (a missão da Ivone ainda fecha com um toque); não derruba nota, mas é o primeiro a acertar.

---

## 2. Tabela por critério

### 2.A Seção 2 — checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md: os 8 com papel, 5 traços, honestidade-humildade e as 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". Seu Dirceu sem necessidade e sem traço extremo, registrado como figurante. |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 negritos, 18 com cena. Os 33 ids da última tabela da ficha existem nas pistas com o texto que a ficha cita (tabela 2.B). |
| Falas e ações não contradizem a ficha | **Passa** | coerente | Téo: 11 bilhetes e páginas, todos com "— T." (a lista de conferência `fh_papel_teo` é lista, não bilhete). "Tá." só na boca do Braga, e nas três verdades dele (`c_esc_3`, `cracha_3`, `coop_veredito`). "Desculpa" só em Nico, Seu Dirceu e Téo; Aurélio se desculpa sem a palavra (`aurelio_2`). "Lenz" só em pistas da volta 3 (`cracha_3`, `coop_veredito`, `v4_braga`, `lenz_2`) e na linha da fita que depende delas. A Dra. Sato só fala quando quem joga está no Subsolo (`lcAnexar` troca a fala dela pelo estalo da Câmara nas outras salas). Três ressalvas de acabamento, nenhuma é contradição (2.C). |
| Exceções registradas na ficha | **Passa** | completo | 10 exceções escritas e conferidas no código e nos dados: "Pelo interfone não passa objeto.", a contagem do raio de fora, o Aurélio no Ouro, o Nico saindo da repetição só em `nico_1`, o Braga reconhecendo a rubrica sem confessar o crachá, a sirene só com `sato_teo`. |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura por 22 termos em 98 arquivos .js, .mjs, .html, .json e .css fora de docs/ (sem as cópias guardadas): zero com esse sentido. "traços" só na tabela de Morse de outro modo; "revisão 7" só no campo `versao` dos dados, que nenhuma tela mostra. |

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
| Lenz | Pouca amabilidade | `lenz_0` (não espera a resposta), `lenz_1` ("Nem você."), `traj_2` (passa pelo Seu Dirceu sem boa-noite) | sim |
| Lenz | Pouca honestidade | `lenz_2` ("Eu devolvo tudo que eu pego."), `cracha_2` | sim |
| Lenz | Não aguenta pressão | `traj_3` (fala sozinho na escada), `lenz_mot_3` ("ou eu não tenho mais empresa pra te pagar") | sim |
| Lenz | Busca risco | `v5_lenz` ("Peça por fora: +?", "ninguém confere a base") | sim |
| Dra. Sato | Abertura | `man_anc_2` ("Nunca aconteceu, mas vai que"), `man_2` ("Ou não.") | sim |
| Dra. Sato | Não larga a lacuna | `man_3` ("Me conta o que você viu com os seus olhos."), `a_hist_1`, `e_hist_1` | sim |
| Nico | Pouca ordem | `nico_0b` (perde o fio), `fh_fusivelx` (fusível da Câmara para a cafeteira) | sim |
| Nico | Muita atenção às pessoas | `nico_0` ("cara de quem não jantou"), `nico_0b` (o Braga e o cinto) | sim |

### 2.C Ressalvas (não derrubam item)

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | loop-central.js, `solosato` ("Desta vez eu confio. Gira.") | A mesma fala serve ao ajuste e ao Fio a Fio. No circuito nada gira: quem joga liga pontos. | 1 palavra |
| 2 | `man_3`, respostas do interfone | 4 das 7 respostas saem do mesmo molde ("pode ser duas coisas", "Ou..., ou...", "um defeito só, ou dois"). A revisão 4 tirou duas; o molde ainda é o que mais se ouve. Combina com "não aceita palpite", mas repete. | uns 15 palavras |
| 3 | `man_3`, resposta do par ("Procura uma leitura normal") | A Dra. Sato usa o nome da etiqueta do jogo. | 3 palavras |

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só por escrito e inconfundível: peso e medida ("Eu sei o que eu carrego", `v4_teo`), ordem curta ("Tinta não mente.", `teo_d3`), olho de quem monta ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`), a lista riscada até "falar com ele" (`fh_papel_teo`). |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada em toda fala: `lenz_0` ("Ótimo, ótimo."), `lenz_2` ("Eu devolvo tudo que eu pego." ... "Lenz. Agora não."), `lenz_1` ("Ninguém quer confusão hoje. Nem você."), `b_hist_2` ("Cada litro de diesel sai do nosso bolso."). Nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Seca e com número: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone`, `dis_cafeira`. |
| Dra. Sato | 5,0 | 4 | Constante em mais de 15 textos: "ela", pergunta de volta, humor seco (`man_3`, `man_2` "Ou não.", `e_hist_1` "Ninguém.", `fh_ficha_bc` "Levar o guarda-chuva."), frase de rádio nos caminhos pelo interfone ("Cinto na trava. Puxa. Agora a peça."). Ressalvas 2.C-1 a 3 são de acabamento. |
| Seu Dirceu | 5,0 | 4 | Figurante com voz: `traj_2` ("Nem boa-noite."), `ivone_ali_2` ("passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `assim_leg` ("Quem sujou meu chão?"), `d_teo_2` ("Eu reparo."), `dirceu_0` ("Amanhã ninguém lembra quem limpou."). |
| Braga | 5,0 | 4 | Fala muito e foge por três portas: a chuva e a porta (`traj_aviso`), o cunhado (`braga_1`, `c_esc_3`), o café (`traj_aviso`, `c_esc_3`, `cracha_3`); as três verdades começam com "Tá."; por escrito, a vergonha (`v4_braga`, `cofre_dica` "Esqueci a senha de novo"). |
| Aurélio | 4,5 | 4 | As três falas perguntam ou recuam (`aurelio_0`, `aurelio_1` "Você também sentiu?", `aurelio_2` "Era medo meu."). Meio ponto fora: a "palavra de acervo" da ficha só existe no laudo (`falsa_2`), nunca na boca dele, e as três falas ficam na mesma sala. |
| Nico | 4,5 | 4 | Três falas, as três dele (`nico_0`, `nico_0b`, `nico_1` "pela primeira vez ele não pede desculpa"), mais o bilhete do fusível e o gato "Fusível". Meio ponto fora: pouco texto para o guia do museu, tudo numa sala, e a segunda fala só abre da volta 2. |
| **Média (8 com fala)** | **4,9** | **4,5** | 39 ÷ 8 = 4,875. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 4,5 | Puxa sozinha: o museu que esquece, gente que só muda de fala quando você mostra o caderno, tranca com frase do mundo, cofre com o registro de trás para a frente, o pêndulo que adianta o relógio de todo mundo, o gravador da Sala dos sons, O Raio com janela e código que muda, o ensaio que só diz "2 de 3 certos". Os três motivos da rodada 6 saíram ("Antes de acender a luz" tem três opções que disputam; a pergunta da foto não diz mais "você anotou"; o papel do Pátio bate com a tela). Falta para 5: das 8 perguntas, duas ainda se respondem por bom senso, sem caderno e sem ver nada: a da foto antiga ("O que aparece gravado na base?", com a dica "toda peça de museu tem um número só dela") e a da caixa (o cheiro de verniz contra mofo, tinta e "nenhum cheiro"). |
| Integrada | 4,5 | Papel em frase clara na entrada e no manual ("Nesta atividade você vive o papel de quem lembra das voltas"), 8 missões secretas com convite a blefar, página de missões no telão com o nome de quem cumpriu (vi com 40 nomes, sem corte), "Quem trouxe" em cada fato da fita, papéis da última volta com nome de gente. Falta para 5: a missão da Ivone ainda fecha com um toque só, no primeiro minuto (`ivone_ali_2`: sem tranca, 1 de energia), e a pista que fecha fala do dia 14, não da tinta de hoje. O ROTEIRO (parte 14) e a DECISOES (revisão 7) dizem que ela "pede mais do que um toque": os dados não. |
| Identificada | 4,5 | O diagnóstico pede raciocínio que a pessoa reconhece como dela ("Você não chutou: dois sinais diferentes... e uma leitura dizendo 'aqui não é'"), o erro volta com motivo, pista por pista, os finais por causa cobram a escolha ("A manhã chega, limpa demais."), o Revelar fecha em três perguntas ("o que foi feito, por onde passou, de quem era a mão"). O que derrubava na rodada 6 saiu: a fita do telão não corta mais nada. Medido com 10 fatos em 12 combinações (2, 6 e 40 pessoas; 1024, 1280, 1366 e 1920 de largura; nomes longos): nenhuma linha passa do cartão; "Quem trouxe" fica numa linha ("Maximiliano, Wellingtonzinho +38"); a letra fica em 1,44% a 1,50% da largura. Em 1920 a medida acusa 2 px em toda linha, inclusive nas de uma linha só: é arredondamento da altura da letra, e na captura não falta texto (`r7/pg/av_fita_40_1920.png`). Falta para 5: o desfecho do celular mostra as 3 fichas e as 3 provas, mas não quais fatos da noite aquela pessoa achou. |
| Externa (menos é melhor) | 1,5 → invertida 4,5 | Sem ponto, sem ranking; a recompensa é +1 de energia e o nome no telão. Os restos de formulário e a voz de sistema em maiúsculas estão em "Ficou para decidir" e não pesaram. |
| Amotivação (menos é melhor) | 1,5 → invertida 4,5 | A pessoa sempre sabe o que falta e por quê (frase do mundo em cada tranca, "Falta: ..." em cada atividade, três fichas de passo em cada aba). Sobra: muita palavra de regra junta no Dossiê (sinal, leitura normal, etiqueta, ensaio, eco, meio conserto), amparada pelo "Como funciona" e pelo dicionário. |
| **Nota da escala** | **4,5** | (4,5 + 4,5 + 4,5 + 4,5 + 4,5) ÷ 5. Mínimo 4,5. **Passa, sem folga.** |

Introjetada: neutra, não pontua.

**O que não deu para julgar sem jogadores reais (não puni):**
- se 5 de energia diante de 12 a 20 itens por sala dá gosto de escolha ou sensação de falta;
- se gastar 1 de energia num item de ambiente (os pares inocentes) é sentido como "o museu é vivo" ou como energia perdida;
- se os 10 segundos de caminhada criam tensão ou tédio;
- se falar em voz alta de salas diferentes funciona numa sala cheia, e se a palavra que muda a cada 30 segundos atrapalha;
- se alguém de fato blefa a missão secreta na pausa;
- se a legenda do gravador é sentida como clima ou como espera;
- se o pêndulo (40 segundos a menos para todos) vira graça ou briga;
- o ritmo das voltas 3 e 4 para quem já tem diagnóstico e ensaio;
- o prazer de girar a peça 3D e de mexer na luz;
- se a turma lê a fita do telão ou só o título do desfecho.

**Decisão de regra já registrada (DECISOES-V4, "Ficou para decidir"): opcional, não pesou na nota:**
- resposta errada em minijogo não custa nada;
- nos consertos em dupla os dois aparelhos precisam de tudo no caderno, então quem dita não sabe nada que quem digita não saiba;
- piso de volta em `nico_1`, `cracha_3` e `lenz_2`;
- missão do Nico só possível da volta 4;
- restos de formulário e voz de sistema ("ATIVIDADE FEITA:", "ENSAIO (em dupla):", "MEIO CERTO", "Marcadas: 3 de 3...", "A tentativa desta volta foi gasta.", botão "Registrar revelação");
- `man_cal_3` ("vai que precisa") diante da exceção do Téo na ficha;
- por que quem joga lembra; a Dra. Sato e as voltas; o alarme das 2:40;
- aviso de aula encerrada.

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

**Nada ficou abaixo do mínimo.** Como a 3.2 passou sem folga, segue a lista do que dá margem. Total: (a) 6 correções de texto ou dado, 2 linhas de dado e uns 60 palavras; (b) nenhuma mudança de mecânica necessária, 2 opcionais.

### (a) Texto e dado (acabamento; nenhuma é necessária para passar)

**A1. Missão da Ivone — loop-central.js, `LC_MISSOES` (1 linha de dado) e a frase dos documentos (uns 15 palavras).**
`ok:() => lcTem('ivone_red') && (lcTem('ivone_1x') || lcTem('dis_cafeira'))`
A resposta à missão é a fala da tinta (`ivone_red`), confirmada pelo pote que sumiu ou pelo bilhete da cafeteira. Sai `ivone_ali_2`, que fecha com um toque e fala do dia 14. Acertar junto o ROTEIRO, parte 14, e a DECISOES, revisão 7, que hoje dizem que ela já pede mais de um toque. Pede o teste das missões de novo. É a que leva a Integrada para perto de 5.

**A2. Pergunta da foto antiga — `LC_MG.tombo_2` (uns 12 palavras).** Opções que disputam, todas coisas que se gravam numa base: `['Um número de três algarismos','O nome de quem doou','O ano em que a peça chegou','A marca de quem restaurou']`. E a segunda dica sem a resposta: "O que identifica uma peça não muda quando ela troca de sala."

**A3. Pergunta da caixa — `LC_MG.c_peca` (uns 8 palavras).** Trocar "Nenhum cheiro" e "Cheiro de mofo" por opções que alguém que não anotou escolheria: `['Cheiro de verniz fresco','Cheiro de pó antigo','Cheiro de tinta vermelha','Cheiro de cola']`.

**A4. Aurélio com palavra de acervo — `aurelio_1` (uns 8 palavras).** "Você também sentiu? Peça de acervo não cheira a novo. O Téo me avisou no dia 14. Eu demorei para acreditar." Leva o Aurélio a 5,0.

**A5. Dra. Sato no Fio a Fio — loop-central.js, `solosato` (1 palavra).** No circuito: "Desta vez eu confio. Liga."

**A6. Interfone — `man_3` (uns 18 palavras).** Tirar uma das respostas do molde "ou..., ou...": `sint_pisca`: "Sem ritmo? Então ela não sabe onde está. Olha a caixa de fusíveis. Depois me liga." E no par: "Procura uma parte que esteja bem: isso separa uma coisa da outra."

A1 a A3 mexem em missão e em minijogo: pedem nova rodada dos testes. A4 e A6 mexem em pista: pedem reconferir a escala da história (seção 1). Nenhuma muda enredo nem regra.

### (b) Mecânica (opcionais; pedem decisão do autor; já estão em "Ficou para decidir")

**B1. Resposta errada com preço.** Errou, a bancada fecha e o item fica "ainda não" por 30 segundos.

**B2. Entrada por papel nos consertos em dupla.** O aparelho do Subsolo pede só diagnóstico e receita; os valores ficam com quem dita.

Com B1 e B2 a Intrínseca pode chegar a 5,0.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (r6) | Agora (r7) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem mudança. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | Sem mudança. |
| 2.4 falas não contradizem a ficha | Passa (1 ressalva) | Passa (3 ressalvas de acabamento) | O veredito do Braga ganhou o "Tá."; `teo_d3` perdeu "cópia". As três ressalvas novas já existiam: esta rodada olhou as falas da Dra. Sato fora das pistas. |
| 2.4 exceções registradas | Passa | Passa | Sem mudança. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa. |
| Téo | 5,0 | 5,0 | Mantém. |
| Lenz | 5,0 | 5,0 | Mantém. |
| Ivone | 5,0 | 5,0 | Mantém. |
| Dra. Sato | 5,0 | 5,0 | Mantém. |
| Seu Dirceu | 5,0 | 5,0 | Mantém. |
| Braga | 5,0 | 5,0 | Mantém; saiu a ressalva do veredito. |
| Aurélio | 4,5 | 4,5 | Sem mudança nas falas. |
| Nico | 4,5 | 4,5 | Sem mudança nas falas. |
| **3.1 média** | **4,9** | **4,9** | Passa. |
| Intrínseca | 4,5 | 4,5 | Saíram os três motivos de texto da rodada 6. Ficam duas perguntas que o bom senso responde (uma delas nasceu da troca da pergunta da foto). |
| Integrada | 4,5 | 4,5 | Missões do Téo e do Aurélio corrigidas; a da Ivone trocou uma pista de um toque por outra de um toque. |
| Identificada | 4,0 | **4,5** | A fita do telão não corta mais texto, com 10 fatos, em quatro larguras e com nomes longos. |
| Externa (bruta) | 1,5 | 1,5 | Sem mudança. |
| Amotivação (bruta) | 1,5 | 1,5 | Sem mudança; títulos do desfecho do celular iguais aos do telão. |
| **3.2 nota** | **4,4** | **4,5** | Sobe com a Identificada. |

Nenhuma nota caiu.

## 5. Fim do ciclo

**As escalas das seções 2 e 3 passaram.** Seção 2: 5 de 5. Seção 3.1: 4,9. Seção 3.2: 4,5, no mínimo exato. As outras seções (história, conferência técnica, peças) não fazem parte desta avaliação.
