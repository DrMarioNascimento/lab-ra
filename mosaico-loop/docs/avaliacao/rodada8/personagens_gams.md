# Mosaico Loop v4 (revisão 8): avaliação da rodada 8, seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliei do zero, sobre os textos e as telas da revisão 8. Não editei nada no repositório.

**O que li:** ESCALAS_AVALIACAO_JOGOS.md (inteiro); FICHAS.md (inteiro); DECISOES-V4.md (Mundo, regras e as revisões 7 e 8 inteiras; da 2 à 6, os títulos e o "Ficou para decidir"); LOOP-CENTRAL.md, "Revisão 8" e o checklist por volta; pistas_legivel.txt (as 278 pistas; as 93 que têm fala ou bilhete de alguém eu reli uma a uma, extraídas de `dados/pistas-v4.json`, versão "v4 revisão 8", em `r8/pg/falas.txt`); atividades.txt (regras, finais, papéis); `man_3.textoPorSintoma` e `textoPorPar` no JSON; loop-central.js (minijogos `LC_MG` e `LC_MGA`, missões, papéis, desfecho, caminho "com a Dra. Sato na linha"). Do ROTEIRO-LOOP.md não li as partes de histórico: conferi o que importa pelas pistas e pelo código.

**O que vi na tela:** `r8/vis2` (entrada, sala com a peça 3D, Máquina/Dossiê, telão); `r8/tl` (Desfecho, A noite com 10 fatos e 40 pessoas, Para conversar, Missões, Turma); `r8/pecas` (Sala das coleções e Pátio com os pontos). E capturas minhas em `r8/pg/` (script `cap.mjs`, feito a partir do `r7/pg/cap.mjs`, e `cap_fita.mjs`): os quatro minijogos abertos (luz da Galeria com a pergunta de antes, caixa, foto antiga, fita da porta de serviço depois das 4:00), a Sala dos sons com o gravador parado e tocando, a aba Atividades e o Dossiê. Nenhum erro de página.

**O que varri:** 100 arquivos .js, .mjs, .html, .json e .css fora de docs/ (sem as cópias guardadas), atrás de 20 termos de escala e de traço: só aparecem em comentários de CSS ("rodada 3", "rodada 5"), que nenhuma tela mostra. Também varri as falas que a ficha diz que cada pessoa "nunca diria": nenhuma aparece na boca de quem não deve. ("Tenho certeza" só aparece como rótulo de botão da camada antiga em game.js, não como fala do Nico. "Fui eu" só aparece com o Téo, que pode dizer.)

Aviso de autoavaliação: não escrevi nenhum texto do jogo. Não há desconto de autoria a aplicar.

---

## 1. Nota geral

**PASSA.** Seção 2: os 5 itens passam. Seção 3.1: **4,9** (mínimo 4,5), ninguém abaixo de 4. Seção 3.2: **4,6** (mínimo 4,5). A escala sai do limite exato da rodada 7, porque a missão da Ivone agora pede mais de um toque e a Integrada sobe para 5,0. As seis correções de texto da rodada 7 (A1 a A6) estão nos dados e no código. Sobram três retoques pequenos (seção 3) e um minijogo novo cuja resposta já vem no enunciado.

---

## 2. Tabela por critério

### 2.A Seção 2: checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md: os 8 têm papel, 5 traços, honestidade-humildade e as 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". Seu Dirceu, sem necessidade e sem traço extremo, está registrado como figurante. |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 traços em negrito, 18 com cena. Os 33 ids da última tabela da ficha existem nos dados (zero faltando, conferido por script) e as cenas dizem o que a ficha cita (tabela 2.B). |
| Falas e ações não contradizem a ficha | **Passa** | coerente | Téo: os 6 bilhetes e páginas com a letra dele terminam em "— T." (`fh_papel_teo` é lista, não bilhete); "Fui eu" só com ele (`teo_radio_2d`, `d_fus_2b`). "Tá." só na boca do Braga (`c_esc_3`, `cracha_3`, `coop_veredito`). "Desculpa" só com Nico, Seu Dirceu (`dis_balde`) e Téo (`d_teo_1`); o Aurélio se desculpa sem a palavra (`aurelio_2`). "Lenz" só em pistas da volta 3 (`cracha_3`, `coop_veredito`, `v4_braga`, `lenz_2`). A Dra. Sato só diz o que ouve pelo interfone e não diz "Tá.". Os ajustes da revisão 8 às peças novas (armário no corredor, caixa na estante, cadeado amarelo) não mexeram em fala de ninguém e não criaram contradição. Uma ressalva de acabamento (2.C-1). |
| Exceções registradas na ficha | **Passa** | completo | As 10 exceções estão escritas e batem com dados e código: Téo só por escrito; Nico sai da repetição só em `nico_1` ("Pela primeira vez ele não pede desculpa"); Dra. Sato só pelo interfone, com confiança que cobre só informação (loop-central.js: "Objeto não vale: precisa estar com você."); Aurélio no Ouro, agora na Galeria e olhando para a base ("Obrigado por não esquecer."); Lenz com nome só da volta 3; Seu Dirceu e o "desde ontem" (`c_anc_3`). |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura limpa (ver o topo). "revisão 8" só aparece em comentário de game.js e no campo `versao` dos dados, que nenhuma tela mostra. |

### 2.B Traço extremo e cena (conferido pista por pista)

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
| Braga | Não aguenta pressão | `braga_1` (dá de ombros rápido demais), `v4_braga` (riscado duas vezes), `coop_veredito` (engole seco) | sim |
| Lenz | Pouca amabilidade | `lenz_0` (não espera a resposta), `lenz_1` ("Nem você."), `traj_2` (sem boa-noite) | sim |
| Lenz | Pouca honestidade | `lenz_2` ("Eu devolvo tudo que eu pego."), `cracha_2` | sim |
| Lenz | Não aguenta pressão | `traj_3` (fala sozinho na escada), `lenz_mot_3` ("ou eu não tenho mais empresa pra te pagar") | sim |
| Lenz | Busca risco | `v5_lenz` ("Peça por fora: +?", "ninguém confere a base") | sim |
| Dra. Sato | Abertura | `man_anc_2` ("Nunca aconteceu, mas vai que"), `man_2` ("Ou não.") | sim |
| Dra. Sato | Não larga a lacuna | `man_3` ("Me conta o que você viu com os seus olhos."), `a_hist_1`, `e_hist_1` ("Ninguém.") | sim |
| Nico | Pouca ordem | `nico_0b` (perde o fio), `fh_fusivelx` (fusível de reserva para a cafeteira) | sim |
| Nico | Muita atenção às pessoas | `nico_0` ("cara de quem não jantou"), `nico_0b` (o Braga e o cinto) | sim |

### 2.C Ressalvas (nenhuma derruba item)

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | `nico_1.porque` (mexido na revisão 8) | O Nico lista três condições em ordem, sem tropeçar: "só entrego se ele não aparecer, só para quem souber o número certo, e só depois que o curador puser o laudo no papel". A ficha diz que ele tem pouca ordem e perde o fio. Não chega a ser contradição (ele está repetindo o que o Téo pediu), mas soa organizado demais para ele. | uns 10 palavras |
| 2 | `man_3`, respostas do interfone | 3 das 7 respostas ainda seguem o molde "ou isto, ou aquilo" (`sint_carga` "pode ser duas coisas", `sint_luz` "Ou tem coisa puxando, ou tem coisa faltando", o par "Pode ser um defeito só, ou dois"). Na rodada 7 eram 4. Combina com "não aceita palpite". | nenhuma correção necessária |

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só por escrito, e não dá para confundir com ninguém: peso e medida ("Eu sei o que eu carrego", `v4_teo`), ordem curta ("Tinta não mente.", `teo_d3`), olho de quem monta ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`), a lista riscada até "falar com ele" (`fh_papel_teo`). `teo_radio` ("Você achou o número. Então escuta: a da Galeria é cópia.") ficou mais direto ainda. |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada em toda fala: `lenz_0` ("Ótimo, ótimo."), `lenz_2` ("Eu devolvo tudo que eu pego." ... "Lenz. Agora não."), `lenz_1` ("Ninguém quer confusão hoje. Nem você."), `b_hist_2` ("Cada litro de diesel sai do nosso bolso."). Nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Seca e com número: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone`, `dis_cafeira`. |
| Dra. Sato | 5,0 | 4 | O mesmo jeito em mais de 15 textos: chama a máquina de "ela", devolve a pergunta, humor seco (`man_2` "Ou não.", `e_hist_1` "Ninguém.", `fh_ficha_bc` "Levar o guarda-chuva."), frase de rádio ("Cinto na trava. Puxa. Agora a peça."). As três ressalvas da rodada 7 foram corrigidas: "Desta vez eu confio. Liga." no Fio a Fio; "Do jeito que eu deixei, eles não piscam." em `sint_pisca`; e no par saiu a palavra da etiqueta do jogo ("Procura uma parte que esteja bem"). |
| Seu Dirceu | 5,0 | 4 | Figurante com voz: `traj_2` ("Nem boa-noite."), `ivone_ali_2` ("passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `assim_leg` ("Quem sujou meu chão?"), `d_teo_2` ("Eu reparo."), `dis_balde` ("Desculpa, doutora. Compro outro. — Dirceu"). |
| Braga | 5,0 | 4 | Fala muito e foge do assunto por três caminhos: a chuva e a porta (`traj_aviso`), o cunhado (`braga_1`, `c_esc_3`), o café (`traj_aviso`, `c_esc_3`, `cracha_3`). As três verdades começam com "Tá.". Por escrito aparece a vergonha (`v4_braga`, `cofre_dica` "Esqueci a senha de novo"). |
| Aurélio | 5,0 | 4 | Era 4,5. Agora a palavra de acervo está na boca dele: `aurelio_1` ("Você também sentiu? Peça de acervo não cheira a novo."). As três falas perguntam ou recuam (`aurelio_0`, `aurelio_1`, `aurelio_2` "Era medo meu."), e no Ouro ele agradece sem se desculpar, olhando para a base. Ficar só na Galeria é o lugar dele, não uma falha de voz. |
| Nico | 4,5 | 4 | Três falas, as três com o jeito dele (`nico_0`, `nico_0b`, `nico_1`), mais o bilhete do fusível e o gato "Fusível". Meio ponto fora: pouco texto para o guia do museu, a segunda fala só abre da volta 2, e a frase da tranca (`nico_1.porque`) é organizada demais para ele (ressalva 2.C-1). |
| **Média (8 com fala)** | **4,9** | **4,5** | 39,5 ÷ 8 = 4,94. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 4,5 | O jogo puxa sozinho: o museu que esquece, gente que só muda de fala quando você mostra o caderno, tranca com frase do mundo, cofre com o registro de trás para a frente, o pêndulo, o gravador, O Raio com janela e código que muda, o ensaio que só diz "2 de 3 certos", e agora 8 peças novas com pontos fixos na superfície (vi o Pátio, com a porta entreaberta e o cadeado, e a estante da Sala das coleções). As duas perguntas que a rodada 7 apontou foram corrigidas: a foto antiga tem 4 opções que disputam ("Um número de três algarismos", "O nome de quem doou", "O ano em que a peça chegou", "A marca de quem restaurou"), e na caixa quem não anotou cai em "Cheiro de pó antigo". Falta para 5: a pergunta nova da fita (`traj_1`) traz a resposta no enunciado ("com o ombro molhado" mais a dica "Lá fora chove desde o começo da noite": é só ler), e a pergunta de antes da luz (`falsa_1`, "o que uma peça de 300 anos mostraria?") se responde por bom senso. |
| Integrada | 5,0 | O papel aparece numa frase clara na entrada e no manual ("Nesta atividade você vive o papel de quem lembra das voltas. O museu esquece. Você e o seu caderno, não."). Há 8 missões secretas com convite a blefar, uma página de missões no telão com o nome de quem cumpriu (vi com 40 nomes, sem corte), "Quem trouxe" em cada fato da fita e papéis da última volta com nome de gente. O que faltava na rodada 7 foi corrigido: a missão da Ivone pede `ivone_red` (que tem tranca: mancha, Téo ou Ivone de costas) e mais o pote (`ivone_1x`, outra tranca) ou o bilhete da cafeteira (outra sala). Já não fecha com um toque. Nenhuma das 8 missões fecha com um toque no primeiro minuto. A mesma marca e os ícones definitivos em toda tela fazem o jogo parecer uma coisa só. |
| Identificada | 4,5 | O diagnóstico pede um raciocínio que a pessoa reconhece como dela ("2 sinais de tipos diferentes, 1 leitura normal, 1 defeito"). O erro volta com o motivo, os finais por causa cobram a escolha, o Revelar fecha em três provas e "Para conversar" deixa a pergunta de valor no telão. A fita com 10 fatos e 40 pessoas cabe sem cortar texto (`tl40_result_todos_1`). Falta para 5 (igual à rodada 7): o desfecho do celular mostra as 3 fichas e as 3 provas, mas não quais fatos da noite aquela pessoa achou (`lcResumoFinal`). |
| Externa (menos é melhor) | 1,5, invertida 4,5 | Sem ponto e sem ranking. A recompensa é +1 de energia e o nome no telão. Os restos de formulário e a voz de sistema estão em "Ficou para decidir" e não pesaram. |
| Amotivação (menos é melhor) | 1,5, invertida 4,5 | A pessoa sempre sabe o que falta e por quê: frase do mundo em cada tranca, "Falta: ..." em cada atividade, três fichas de passo no Dossiê. Sobram duas coisas: muita palavra de regra junta no Dossiê (amparada pelo "Como funciona" e pelo dicionário) e um descompasso novo, pequeno: o minijogo da caixa diz "Três caixas de transporte empilhadas", mas a pista `c_esc_1` e a peça 3D nova mostram caixas etiquetadas numa estante. |
| **Nota da escala** | **4,6** | (4,5 + 5,0 + 4,5 + 4,5 + 4,5) ÷ 5 = 4,6. Mínimo 4,5. **Passa.** |

Introjetada: neutra, não pontua.

**O que não deu para julgar sem jogadores reais (não puni):**
- se 5 de energia diante de 5 a 19 itens por sala dá gosto de escolha ou sensação de falta;
- se gastar energia num item de ambiente (os pares inocentes) é sentido como "o museu é vivo" ou como energia perdida;
- se girar a peça 3D e caçar os pontos dá prazer ou cansa em 15 salas, e se os pontos na superfície ficam fáceis de tocar numa mão só;
- se os 10 segundos de caminhada criam tensão ou tédio;
- se falar em voz alta de salas diferentes funciona numa sala cheia, e se a palavra que muda a cada 30 segundos atrapalha;
- se alguém de fato blefa a missão secreta na pausa;
- se a legenda do gravador é sentida como clima ou como espera;
- se o pêndulo (40 segundos a menos para todo mundo) vira graça ou briga;
- o ritmo das voltas 3 e 4 para quem já tem diagnóstico e ensaio;
- se a turma lê a fita do telão ou só o título do desfecho;
- se a pergunta de "Para conversar" de fato abre conversa.

**Decisões de regra já registradas (DECISOES-V4, "Ficou para decidir"): opcionais, não pesaram na nota:**
- resposta errada em minijogo não custa nada;
- nos consertos em dupla os dois aparelhos precisam de tudo no caderno;
- piso de volta em `nico_1`, `cracha_3` e `lenz_2`;
- missão do Nico só possível da volta 4;
- "quem" e "por quê" quase inteiros na volta 1;
- restos de formulário e voz de sistema ("ATIVIDADE FEITA:", "MEIO CERTO", "Registrar revelação"...);
- a Dra. Sato e as voltas; por que quem joga lembra; Revelar só na volta 5 sem motivo no mundo; `man_cal_3`; o alarme das 2:40;
- aviso de aula encerrada em todos os jogos de sala.

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

**Nada ficou abaixo do mínimo.** Abaixo, o que dá mais margem. Total: (a) 4 retoques de texto, uns 45 palavras, nenhum necessário para passar; (b) nenhuma mudança de mecânica necessária, 2 opcionais.

### (a) Texto e dado

**A1. Minijogo da fita: `LC_MG.traj_1` (uns 15 palavras).** Tirar a resposta do enunciado e pedir o que a pessoa sabe da noite. Por exemplo: "A fita mostra a porta de serviço às 4:00. Alguém de paletó encosta um crachá no leitor. Pelo que você sabe da noite, essa pessoa está entrando ou saindo?", com a primeira dica "Repare no ombro do paletó." e a segunda "Lá fora chove desde o começo da noite." Assim o ombro molhado vira algo que se observa, não uma resposta pronta. É a que leva a Intrínseca para perto de 5.

**A2. Minijogo da caixa: `LC_MG.c_peca` (uns 8 palavras).** Alinhar com a pista e com a peça nova: "Na estante, várias caixas etiquetadas; só uma tem o adesivo do patrocínio."

**A3. Nico na tranca: `nico_1.porque` (uns 10 palavras).** Dar a ele o tropeço da ficha, sem mudar as três condições: "É do Téo. Ele pediu... espera. Só entrego se ele não aparecer, e só para quem souber o número certo. E... o laudo! Só depois do laudo no papel. Desculpa." Leva o Nico para 5,0.

**A4. (Opcional) Nico com mais uma fala de volta 1.** Uma fala curta dele em outra sala (Recepção ou Área de descanso), sem fato novo, só reparando em alguém. Uns 25 palavras. Mexe na lista da sala: pede o validador e a conferência dos pontos.

A1 e A2 mexem em minijogo: pedem o teste `mg` de novo. A3 e A4 mexem em pista: pedem reconferir a escala da história (seção 1). Nenhuma muda enredo nem regra.

### (b) Mecânica (opcionais, pedem decisão do autor, já estão em "Ficou para decidir")

**B1. Resposta errada com preço.** Errou, a bancada fecha e o item fica "ainda não" por 30 segundos.

**B2. Entrada por papel nos consertos em dupla.** O aparelho do Subsolo pede só diagnóstico e receita; os valores ficam com quem dita.

**B3. (Identificada para 5) Fatos da pessoa no desfecho do celular.** Mostrar, abaixo das 3 provas, quais dos 10 fatos da fita vieram do caderno dela. Os dados já existem (`window.lcFatos`). É tela, não é regra: entra se o autor quiser.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (r7) | Agora (r8) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem mudança. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | Os 33 ids conferidos por script. |
| 2.4 falas não contradizem a ficha | Passa (3 ressalvas) | Passa (2 ressalvas) | As três ressalvas da Dra. Sato saíram ("Liga.", "Do jeito que eu deixei", "uma parte que esteja bem"). Entrou a do `nico_1.porque`, que foi reescrito nesta revisão. O molde do interfone caiu de 4 para 3 respostas. |
| 2.4 exceções registradas | Passa | Passa | O Ouro agora acontece na Galeria, que é onde o Aurélio está. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa. |
| Téo | 5,0 | 5,0 | Mantém. |
| Lenz | 5,0 | 5,0 | Mantém. |
| Ivone | 5,0 | 5,0 | Mantém. |
| Dra. Sato | 5,0 | 5,0 | Mantém, sem as ressalvas. |
| Seu Dirceu | 5,0 | 5,0 | Mantém. |
| Braga | 5,0 | 5,0 | Mantém. |
| Aurélio | 4,5 | **5,0** | "Peça de acervo não cheira a novo." agora está na boca dele (`aurelio_1`). |
| Nico | 4,5 | 4,5 | Pouco texto; tranca organizada demais. |
| **3.1 média** | **4,9** | **4,9** (4,94) | Passa. |
| Intrínseca | 4,5 | 4,5 | Foto antiga e caixa corrigidas. Entrou a fita com a resposta no enunciado; a pergunta de antes da luz continua de bom senso. |
| Integrada | 4,5 | **5,0** | Missão da Ivone sem fechar com um toque, como a rodada 7 pediu. |
| Identificada | 4,5 | 4,5 | Sem mudança no desfecho do celular. |
| Externa (bruta) | 1,5 | 1,5 | Sem mudança. |
| Amotivação (bruta) | 1,5 | 1,5 | Ícones definitivos ajudam a ler a tela; entrou o descompasso pequeno da caixa (estante × "empilhadas"). |
| **3.2 nota** | **4,5** | **4,6** | Sobe com a Integrada. |

Nenhuma nota caiu.

## 5. Fim do ciclo

**As escalas das seções 2 e 3 passaram.** Seção 2: 5 de 5. Seção 3.1: 4,9. Seção 3.2: 4,6. As outras seções (história, conferência técnica, peças) não fazem parte desta avaliação.
