# Mosaico Loop v4 (revisão 10): avaliação das seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliei do zero, sobre os dados e as telas da revisão 10 (`dados/pistas-v4.json` e `loop-central-dados.js`, os dois com "v4 revisão 10", 281 pistas). Não editei nada no repositório.

**O que li:** ESCALAS_AVALIACAO_JOGOS.md (inteiro); FICHAS.md (inteiro); DECISOES-V4.md ("Mundo", "Escada", "Regras e códigos" e as revisões 8, 9 e 10 inteiras, com o "Ficou para decidir"); ROTEIRO-LOOP.md (partes 1 e 2, 16 e 17); LOOP-CENTRAL.md, "Revisão 10"; pistas_legivel.txt (inteiro, as 281 pistas); atividades.txt (finais, papéis da volta 5, regras); loop-central.js (`LC_MG`, `LC_GLIFOS`, `LC_INSC`, `lcBancada`, `lcResumoFinal`, `LC_FATO_PISTA`); game.js (filtro de volta da lista).

**O que conferi por script** (em `/tmp/roda/esc/r9/pg/`): as 93 pistas com fala ou bilhete da rodada 8 (`r8/pg/falas.txt`) contra os dados de hoje (`falas_r10.txt`): só 6 mudaram de verdade (`man_pot_3`, `traj_2`, `ivone_ali_2`, `cracha_2`, `cracha_3`, `v4_teo`), o resto é só o marcador `{dia}`/`{reg}` trocado pelo valor; os 33 ids da última tabela da ficha existem nos dados; 18 traços extremos em negrito; varredura de 101 arquivos .js, .mjs, .html, .json, .css e .svg fora de docs/ atrás de nomes de escala e de traço; as frases que cada pessoa "nunca diria".

**O que vi na tela:** `r10/insc/` inteiro (livro com a tábua, minijogo aberto, com as opções e depois de um erro, Revelar com "O que foi feito: tem", caderno com a cópia, a tábua e a verdadeira, pontos da Galeria e da Sala das coleções, em 390×844 e 360×740); `r10/vis2/` (entrada individual, Dossiê, Atividades, telão). Não precisei abrir o servidor: as capturas cobrem o que mudou.

Aviso de autoavaliação: não escrevi nenhum texto do jogo. Não há desconto de autoria a aplicar.

---

## 1. Nota geral

**PASSA.** Seção 2: os 5 itens passam. Seção 3.1: **4,9** (mínimo 4,5), ninguém abaixo de 4. Seção 3.2: **4,6** (mínimo 4,5). A inscrição da máscara não mexe em fala de ninguém, então a 3.1 fica onde estava. Na 3.2 ela ajuda (um enigma visual que se confere sozinho, com tábua, cópia e verdadeira), mas não chega a subir nenhuma subescala de meio ponto: o minijogo desenha o símbolo em cada botão, e continuam as duas perguntas de bom senso. Sobram as ressalvas de antes (Nico na tranca, desfecho do celular) e uma nova, fora destas escalas (registro de `v4_teo` nos documentos).

---

## 2. Tabela por critério

### 2.A Seção 2: checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md: os 8 têm papel, 5 traços, honestidade-humildade e as 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". Seu Dirceu está registrado como figurante, sem necessidade e sem traço extremo. A revisão 10 não criou personagem: as 3 pistas novas são documento (`insc_tabua`) e observação (`insc_copia`, `insc_verdadeira`). |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 traços em negrito, 18 com cena; os 33 ids da última tabela existem nos dados (zero faltando). Conferi as cenas uma a uma (tabela 2.B). |
| Falas e ações não contradizem a ficha | **Passa** | coerente | Téo: os 12 textos com a letra dele terminam em "— T." (as 3 gravações do rádio são voz, não bilhete). "Fui eu" só com o Téo (`teo_radio_2d`, `d_fus_2b`). "Tá." só com o Braga (`c_esc_3`, `cracha_3`, `coop_veredito`); a Dra. Sato não diz. "Desculpa" só com Nico, Seu Dirceu (`dis_balde`) e Téo (`d_teo_1`). O nome "Lenz" só em pistas da volta 3 (`cracha_3`, `coop_veredito`, `v4_braga`, `lenz_2`). Nenhuma das 8 frases "nunca diria" aparece na boca de quem não pode ("Tenho certeza" só como rótulo de botão da camada antiga, em game.js). `v4_teo` agora diz "a mesma cara" (antes "o mesmo desenho"): não contradiz a inscrição e continua no jeito do Téo (peso e medida). Ressalvas de acabamento em 2.C. |
| Exceções registradas na ficha | **Passa** | completo | As 10 exceções batem com dados e código: Téo só por escrito ou gravado; Nico sai da repetição só em `nico_1`; Dra. Sato só pelo interfone (`sato_teo`, `man_3`), sem ver o prédio; Aurélio no Ouro, na Galeria ("Obrigado por não esquecer."); Lenz com nome só da volta 3; Seu Dirceu e o "desde ontem" (`c_anc_3`) e a noite do fusível (`d_teo_2`). A ficha diz por que não mudou na revisão 10 (DECISOES, "Não aplicado"). |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura limpa: os únicos achados são comentários de CSS ("rodada 3", "rodada 5 das escalas") e um comentário de game.js, que nenhuma tela mostra. `glifos.svg` não tem texto de projeto. |

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
| 1 | `nico_1.porque` (continua da rodada 8) | O Nico lista três condições em ordem, sem tropeçar ("só entrego se ele não aparecer, só para quem souber o número certo, e só depois que o curador puser o laudo no papel"). A ficha diz pouca ordem. Não é contradição (ele repete o que o Téo pediu), mas soa organizado demais. A correção A3 da rodada 8 não entrou nem está em "Não aplicado". | uns 10 palavras |
| 2 | `man_3`, respostas do interfone | 3 das 7 respostas ainda seguem o molde "ou isto, ou aquilo" (`sint_carga`, `sint_luz`, o par). Combina com "não aceita palpite". | nenhuma correção necessária |
| 3 | Aurélio e a inscrição | O curador, o único com "palavra de acervo", não fala da escrita da máscara em nenhum momento. Não contradiz a ficha (o laudo dele fala de verniz e peso), mas é o lugar natural para ele ganhar uma linha. | opcional |

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só por escrito, e só pode ser ele: peso e medida ("A peça tem a mesma cara e pesa diferente. Eu sei o que eu carrego.", `v4_teo`), frase curta ("Tinta não mente.", `teo_d3`), olho de montador ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`), a lista riscada até "falar com ele" (`fh_papel_teo`). "A mesma cara" ficou até melhor ao lado de uma máscara. |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada em toda fala: `lenz_0` ("rapidinho... Ótimo, ótimo."), `lenz_2` ("Eu devolvo tudo que eu pego." / "Lenz. Agora não."), `lenz_1` ("Nem você."), `b_hist_2` ("Cada litro de diesel sai do nosso bolso."). Nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Seca e com número: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone`, `dis_cafeira`. |
| Dra. Sato | 5,0 | 4 | O mesmo jeito em mais de 15 textos: chama a máquina de "ela", devolve a pergunta, humor seco (`man_2` "Ou não.", `e_hist_1` "Ninguém.", `fh_ficha_bc` "Levar o guarda-chuva."), frase de rádio. Ressalva 2.C-2 não pesa. |
| Seu Dirceu | 5,0 | 4 | Figurante com voz e agora com o objeto certo na mão: `traj_2` (aponta com o esfregão, "Nem boa-noite."), `ivone_ali_2` (queixo no cabo do esfregão, "passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `assim_leg` ("Quem sujou meu chão?"), `d_teo_2` ("Eu reparo."), `dis_balde`. |
| Braga | 5,0 | 4 | Fala muito e foge do assunto por três caminhos: a chuva e a porta (`traj_aviso`), o cunhado (`braga_1`, `c_esc_3`), o café. As três verdades começam com "Tá."; `cracha_3` ganhou "ali do lado da limpeza", que é jeito de quem conhece o prédio de olho fechado. |
| Aurélio | 5,0 | 4 | Quatro falas curtas, todas no tom da ficha: pergunta em vez de afirmar (`aurelio_0`, `aurelio_1` "Você também sentiu?"), palavra de acervo ("Peça de acervo não cheira a novo."), desculpa sem a palavra (`aurelio_2` "Era medo meu."), agradecimento no Ouro sem sair da Galeria. Dou 5 com margem curta: é pouco texto, e a ressalva 2.C-3 seria a fala que tira a dúvida. |
| Nico | 4,5 | 4 | Três falas com o jeito dele (`nico_0`, `nico_0b`, `nico_1`), mais o bilhete da cafeteira e o gato "Fusível" em fala relatada. Meio ponto fora, como na rodada 8: pouco texto para o guia do museu, a segunda fala só abre da volta 2, e a frase da tranca (`nico_1.porque`) é organizada demais para ele (2.C-1). |
| **Média (8 com fala)** | **4,9** | **4,5** | 39,5 ÷ 8 = 4,94. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 4,5 | O jogo puxa sozinho: o museu que esquece, gente que só muda de fala quando você mostra o caderno, tranca com frase do mundo, cofre com o registro de trás para a frente, pêndulo, gravador, O Raio, peças 3D com pontos fixos. A revisão 9 tirou a resposta do enunciado da fita (`traj_1`: agora é "aparecem gotas... entrando ou saindo?", o que pede inferência), e a revisão 10 trouxe o enigma mais visual do jogo: uma escrita inventada, com tábua de 12 símbolos (dois pares quase iguais, ir/voltar e ver/dizer, e o aviso "alguns são quase iguais"), uma cópia com um símbolo espelhado e a verdadeira para pôr ao lado. A prova se confere sem ajuda e é justa: a tábua chega na volta 1 e a inscrição só abre na volta 2. Falta para 5: os 4 botões do minijogo desenham cada símbolo, e aí a tarefa vira comparar 4 pares, um deles visivelmente virado (resolve-se em segundos, sem pensar na frase); a inscrição não tem nenhum símbolo-armadilha dentro dela (os quase iguais da tábua ficam de fora); e continuam duas perguntas de bom senso (`falsa_1.antes`, "o que uma peça de 300 anos mostraria?", e `c_peca`, "o que você sentiu", com a dica "Peça de 300 anos não cheira a coisa nova"). |
| Integrada | 5,0 | O papel aparece numa frase clara na entrada ("Nesta atividade você vive o papel de quem lembra das voltas. O museu esquece. Você e o seu caderno, não.", visto em `vis2/03`). Há 8 missões secretas, nenhuma fechando com um toque no primeiro minuto, página de missões no telão com o nome de quem cumpriu, "Quem trouxe" em cada fato, papéis da volta 5 com tarefa e dica própria. A escrita própria do Loop (símbolo entalhado, não emoji) dá ao museu uma cultura que é dele, e a máscara de pedra finalmente tem nome nas pistas. |
| Identificada | 4,5 | O diagnóstico pede um raciocínio que a pessoa reconhece como dela (2 sinais de tipos diferentes + 1 leitura normal); o erro volta com o motivo; os finais por causa cobram a escolha; "Para conversar" deixa a pergunta de valor no telão. A inscrição acrescenta um valor claro de método ("conferir com a fonte, símbolo por símbolo"; "quem gravou não erraria a própria escrita"), e entra no Revelar como prova ("O que foi feito: tem", `r10/insc/4`). Falta para 5 (igual às rodadas 7 e 8): o desfecho do celular (`lcResumoFinal`) mostra as 3 fichas e as 3 provas, mas não quais fatos da noite aquela pessoa trouxe (`window.lcFatos` existe e não é usado ali). |
| Externa (menos é melhor) | 1,5, invertida 4,5 | Sem ponto e sem ranking. A recompensa é +1 de energia, o nome no telão e o final. Errar o minijogo da inscrição não custa nada ("Ainda não fechou. Olhe de novo..."), o que tira a pressão de prêmio mas também está em "Ficou para decidir" (não pesou). Restos de formulário e voz de sistema: decisão registrada, não pesou. |
| Amotivação (menos é melhor) | 1,5, invertida 4,5 | A pessoa sempre sabe o que falta e por quê: frase do mundo em cada tranca (a da inscrição: "Sem estranhar a peça e sem a tábua para ler, é só enfeite."), "Falta: ..." nas atividades, três fichas de passo no Revelar. Pista que só vale da volta 2 some da lista na volta 1 (game.js, filtro `desde`), então ninguém vê tranca enganosa. O descompasso da caixa da rodada 8 foi corrigido ("Na estante, caixas etiquetadas"). Sobra o de sempre: muita palavra de regra junta no Dossiê. A tábua custa 1 de energia na volta 1 e só serve na volta 2; o texto diz para que serve ("Para ler, use a tábua"), então não pesa. "Tábua" com dois sentidos está em "Ficou para decidir" e não pesou. |
| **Nota da escala** | **4,6** | (4,5 + 5,0 + 4,5 + 4,5 + 4,5) ÷ 5 = 4,6. Mínimo 4,5. **Passa.** |

Introjetada: neutra, não pontua.

**O que não dá para julgar sem jogadores reais (não puni):**
- se 5 de energia diante de 5 a 19 itens por sala dá gosto de escolha ou sensação de falta, e se gastar 1 de energia na tábua na volta 1, sem uso imediato, parece aposta boa ou desperdício;
- se a turma liga a tábua da Conservação à máscara da Galeria sem ajuda, numa volta seguinte;
- se o minijogo da inscrição dá prazer de "achei" ou é rápido demais para ser lembrado;
- se alguém compara de fato a cópia e a verdadeira no caderno (ficam em cartões separados, um embaixo do outro);
- se gastar energia num item de ambiente (pares inocentes) é sentido como "o museu é vivo" ou como energia perdida;
- se girar a peça 3D e caçar os pontos dá prazer ou cansa em 15 salas;
- se os 10 segundos de caminhada criam tensão ou tédio;
- se falar em voz alta de salas diferentes funciona numa sala cheia;
- se alguém de fato blefa a missão secreta na pausa;
- se a legenda do gravador é sentida como clima ou como espera;
- se o pêndulo vira graça ou briga;
- o ritmo das voltas 3 e 4 para quem já tem diagnóstico e ensaio;
- se a turma lê a fita do telão ou só o título do desfecho;
- se a pergunta de "Para conversar" de fato abre conversa.

**Decisões já registradas (DECISOES-V4, "Ficou para decidir"): opcionais, não pesaram na nota:**
- "tábua" com dois sentidos (chão de tábuas da Sala das coleções × tábua dos símbolos);
- `v4_teo`, "o mesmo desenho" × "a mesma cara" (ver a observação no fim: os dados já trazem "a mesma cara");
- resposta errada em minijogo não custa nada; entrada por papel nos consertos em dupla;
- piso de volta em `nico_1`, `cracha_3` e `lenz_2`; missão do Nico só possível da volta 4;
- "quem" e "por quê" quase inteiros na volta 1;
- restos de formulário e voz de sistema;
- a Dra. Sato e as voltas; por que quem joga lembra; Revelar só na volta 5 sem motivo no mundo; `d_teo_2` sem tranca, `aurelio_1` na volta 1, `man_cal_3`, o alarme das 2:40;
- aviso de aula encerrada em todos os jogos de sala.

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

**Nada ficou abaixo do mínimo.** Abaixo, o que dá mais margem. Total: (a) 4 retoques de texto, uns 60 palavras, nenhum necessário para passar; (b) nenhuma mudança de mecânica necessária, 3 opcionais.

### (a) Texto e dado

**A1. Nico na tranca: `nico_1.porque` (uns 10 palavras).** Igual ao pedido da rodada 8, que não entrou: "É do Téo. Ele pediu... espera. Só entrego se ele não aparecer, e só para quem souber o número certo. E... o laudo! Só depois do laudo no papel. Desculpa." Leva o Nico para 5,0.

**A2. Minijogo da inscrição: `LC_MG.insc_copia.opcoes` (nenhuma palavra; é dado de tela).** Tirar o desenho dos 4 botões e deixar só "2º símbolo", "3º símbolo"... Assim a pessoa precisa olhar a faixa da máscara e a tábua, não comparar 4 botões com a tábua. Pôr um símbolo-armadilha dentro da inscrição daria mais dúvida, mas mudaria a frase e a peça: não recomendo. Basta tirar o desenho. É a que mais aproxima a Intrínseca de 5. Pede o teste `insc.mjs` de novo (390 e 360).

**A3. (Opcional) Pergunta de antes da luz: `LC_MG.falsa_1.antes` (uns 15 palavras).** Trocar o bom senso por memória da noite: "Antes de acender a luz: o que, no seu caderno, diz como a peça verdadeira é por fora?" com opções tiradas das pistas (fosca e riscada, `foto_solo`/`coop_copia_ok`; lisa e brilhante; com a rachadura do lado esquerdo...). Só funciona se a pessoa já tiver a foto; senão, manter.

**A4. (Opcional) Aurélio e a escrita (uns 25 palavras).** Uma linha dele que use a inscrição sem dar a resposta, por exemplo no `porque` ou numa fala nova da volta 2, com tranca `insc_tabua`: "Na testa dela tem uma frase. Eu sei de cor. Nunca pensei em ler de novo." Resolve a ressalva 2.C-3. Mexe em pista: pede a escala da história (seção 1), o validador e a conferência dos pontos.

A1 e A4 mexem em pista ou fala: pedem reconferir a escala da história (seção 1). A2 e A3 mexem em minijogo: pedem o teste de tela. Nenhuma muda enredo nem regra.

### (b) Mecânica (opcionais, pedem decisão do autor, já estão em "Ficou para decidir")

**B1. Resposta errada com preço.** Errou, a bancada fecha e o item fica "ainda não" por 30 segundos.

**B2. Entrada por papel nos consertos em dupla.** O aparelho do Subsolo pede só diagnóstico e receita; os valores ficam com quem dita.

**B3. (Identificada para 5) Fatos da pessoa no desfecho do celular.** Mostrar, abaixo das 3 provas, quais fatos da fita vieram do caderno dela (`window.lcFatos()`, já pronto). É tela, não regra.

### Observação fora destas escalas (para a seção 1, "Consistência do documento", e a seção 4)

`v4_teo`: os dados e o `loop-central-dados.js` (00:45) já dizem "A peça tem **a mesma cara** e pesa diferente", mas DECISOES-V4, revisão 10, ainda diz que a fala "não foi mexida" e deixa a troca em "Ficou para decidir" (a cópia `pistas-v4.json_SUBSTITUIDO_2026-11-25m` ainda tem "o mesmo desenho"). Ou a troca foi feita e falta registrar, ou foi feita sem decisão. Não pesou aqui (a fala nova está boa); registrar ou desfazer.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (r8) | Agora (r10) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem personagem novo. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | Os 33 ids conferidos por script. |
| 2.4 falas não contradizem a ficha | Passa (2 ressalvas) | Passa (3 ressalvas) | Seu Dirceu de esfregão (saiu o rodo) e o armário "ao lado da Base da limpeza" alinharam fala e peça. Continua a do `nico_1.porque` (a correção não entrou). Entrou uma opcional: o Aurélio não diz nada da inscrição. |
| 2.4 exceções registradas | Passa | Passa | Ouro na Galeria, com a notícia subindo até ele. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa, incluindo `glifos.svg`. |
| Téo | 5,0 | 5,0 | "A mesma cara" no lugar de "o mesmo desenho": mesma voz. |
| Lenz | 5,0 | 5,0 | Sem mudança. |
| Ivone | 5,0 | 5,0 | Sem mudança. |
| Dra. Sato | 5,0 | 5,0 | Sem mudança. |
| Seu Dirceu | 5,0 | 5,0 | Esfregão nas duas falas. |
| Braga | 5,0 | 5,0 | "ali do lado da limpeza". |
| Aurélio | 5,0 | 5,0 | Sem mudança; margem curta (pouco texto). |
| Nico | 4,5 | 4,5 | Pouco texto; tranca organizada demais (correção não aplicada). |
| **3.1 média** | **4,9** | **4,9** (4,94) | Passa. |
| Intrínseca | 4,5 | 4,5 | Sobe por dentro (fita sem resposta no enunciado; inscrição visual que se confere sozinha), mas os botões do minijogo desenham o símbolo e as duas perguntas de bom senso continuam. |
| Integrada | 5,0 | 5,0 | A escrita própria reforça a identidade do mundo. |
| Identificada | 4,5 | 4,5 | A inscrição ensina a conferir com a fonte; o desfecho do celular ainda não mostra os fatos da pessoa. |
| Externa (bruta) | 1,5 | 1,5 | Sem mudança. |
| Amotivação (bruta) | 1,5 | 1,5 | O descompasso da caixa saiu; nada novo pesa (a lista esconde o que só vale da volta 2). |
| **3.2 nota** | **4,6** | **4,6** | Passa. |

Nenhuma nota caiu.

## 5. Fim do ciclo

**As escalas das seções 2 e 3 passaram.** Seção 2: 5 de 5. Seção 3.1: 4,9. Seção 3.2: 4,6. As outras seções (história, conferência técnica, peças) não fazem parte desta avaliação.
