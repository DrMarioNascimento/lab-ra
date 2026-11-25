# Loop v4 — Avaliação, rodada 2 — Seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.
Avaliação feita do zero sobre os textos atuais. Material lido por inteiro: ESCALAS_AVALIACAO_JOGOS.md, FICHAS.md, ROTEIRO-LOOP.md, DECISOES-V4.md, pistas_legivel.txt (224 pistas), atividades.txt (10 atividades, 5 finais), 16 telas em r2/vis, e trechos do código que mostram texto ao jogador (loop-central.js, game.js, ritmo.js, individual.html, sala/index.html) para conferir o que as telas e o roteiro prometem.

Aviso de autoavaliação: várias falas hoje no jogo (lenz_0, lenz_1, lenz_2, aurelio_0, aurelio_2, ivone_2, v5_ivone, v5_lenz) saíram quase literais das propostas do avaliador da rodada 1. Não fui eu que as escrevi, mas é texto de avaliador avaliado por avaliador: descontei 0,5 do Lenz por isso (seria 5,0).

---

## 1. Nota geral

**NÃO PASSA, mas chegou perto nas fichas e na voz.** Seção 2: 3 de 5 itens passam (dois não passam por lacunas pequenas e localizadas). Seção 3.1: **4,3** (mínimo 4,5), com **1 personagem abaixo de 4** (Nico). Seção 3.2: **3,9** (mínimo 4,5). Nenhuma nota caiu em relação à rodada 1.

---

## 2. Tabela por critério

### 2.A Seção 2 — checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md tem os 8 (7 + Seu Dirceu) com papel, 5 traços, honestidade-humildade e as 5 dimensões da curiosidade em colunas separadas, mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". |
| Cada traço extremo aparece em ao menos uma cena | **Não passa** | completo | 15 de 16 traços extremos têm cena. **Lacuna: Nico, curiosidade social alta.** As cenas indicadas na ficha (nico_0, nico_1, dis_gato) mostram repetição, promessa cumprida e um gato; em nenhuma ele presta atenção em gente. Ressalva: a "abertura alta" da Dra. Sato está apontada para man_3, sato_teo e a_hist_1, que mostram método e teimosia; quem mostra imaginação é man_anc_2 ("Nunca aconteceu, mas vai que") e man_2 ("Ou não."). É erro de referência na ficha, não lacuna no jogo. |
| Falas e ações não contradizem a ficha | **Não passa** | coerente | 2 contradições reais e 4 ressalvas (lista em 2.C). As 9 contradições da rodada 1 foram todas resolvidas. |
| Exceções registradas na ficha | **Passa** (com ressalva) | completo | Téo (não fala ao vivo), Nico (repetição), Dra. Sato (só ouve), regra da memória e Dirceu figurante estão registrados. Ressalva: faltam duas linhas (assinatura do Téo; fala do Aurélio no final Ouro). Ver correção 7. |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura em pistas, atividades e nos arquivos vivos do jogo: zero ocorrências. A única palavra "traço" está num minijogo de código Morse (ponto e traço). |

### 2.B Traço extremo × cena (conferido pista por pista)

| Pessoa | Traço extremo | Cena que mostra | Ok? |
|---|---|---|---|
| Aurélio | Ansiedade alta | aurelio_0 ("Está linda, não está?" sem certeza) | sim |
| Aurélio | Foge da lacuna; não aguenta pressão | aurelio_2 ("Disse a mim mesmo que era cansaço dele. Era medo meu.") | sim |
| Téo | Honestidade alta | d_teo_1 ("Desculpa, Dra. Sato."), d_fus_2b ("Fui eu. — T.") | sim |
| Téo | Não larga a lacuna | teo_d1 ("Sozinho pra quê?"), v4_teo ("Eu sei o que eu carrego.") | sim |
| Téo | Aceita risco | teo_d3, teo_radio ("cara a cara") | sim |
| Ivone | Método | ivone_1x ("Eu não perco pote."), v5_ivone (4,2 kg) | sim |
| Ivone | Pouca curiosidade pelas pessoas | ivone_1x (nem levanta a cabeça), ivone_2 ("Devia ter perguntado por quê.") | sim |
| Braga | Quer agradar | braga_1, cracha_3 ("Quer um café?") | sim |
| Braga | Não aguenta pressão | braga_1 (dá de ombros rápido demais), dis_cafe (esconde a xícara) | sim |
| Lenz | Pouca amabilidade | lenz_0 (não espera a resposta), lenz_1 ("Nem você.") | sim |
| Lenz | Pouca honestidade | lenz_2 ("Eu devolvo tudo que eu pego."), v5_lenz | sim |
| Lenz | Não aguenta pressão; risco | traj_3 ("Só preciso de cinco minutos de volta.") | sim |
| Dra. Sato | Não larga a lacuna | man_3 ("Me conta o que você viu com os seus olhos."; "Espera.") | sim |
| Dra. Sato | Abertura | man_anc_2, man_2 (a ficha aponta outras pistas) | sim, corrigir referência |
| Nico | Pouca ordem | nico_0, fh_fusivelx (fusível para a cafeteira; só nas noites A, B, C) | sim |
| Nico | **Muita atenção às pessoas** | **nenhuma** | **não** |

### 2.C Contradições e ressalvas

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | cracha_3 × cracha_2, v4_braga, roteiro §2 | Braga diz que o Lenz "pediu 'rapidinho'". No bilhete e no roteiro o Lenz **pegou** e deixou bilhete sem assinatura. Se pediu, o bilhete não tem razão de existir; se só achou um bilhete sem assinatura, o Braga não tem como saber que foi o Lenz. | contradição |
| 2 | ivone_red × dis_cafeira | ivone_red: desde o fim da tarde "ela não saiu do Ateliê". Mas o bilhete "Quem pegou meu pote vermelho? — Ivone" está colado na cafeteira da Área de descanso, e só pode ter sido posto depois que o pote sumiu. | contradição |
| 3 | lenz_1 × regra da memória (FICHAS, exceções) | O Lenz muda de fala "quando percebe que você já sabe da peça", mas o texto não diz que você mostrou nem falou nada. A regra é: só muda quando quem joga mostra algo. | ressalva |
| 4 | teo_radio (trecho da noite C) × desejo do Téo | "A verdadeira não saiu do prédio: procura uma caixa pesada demais." Se ele sabia da caixa, a prova que "ninguém nega" era abrir a caixa, não marcar a cópia de tinta. | ressalva |
| 5 | data_3, d_teo_1 × ficha do Téo | A ficha diz que ele assina "— T."; no diário ele assina "— Téo" (2 pistas) e nos bilhetes "— T." (3 pistas). | ressalva |
| 6 | v5_ivone × DECISOES (sem hora do dia) | "com a hora anotada no canto", e o texto não traz hora nenhuma. A ficha da Ivone ainda pede "hora e quantidade". | ressalva |
| 7 | aviso_solo × voz da Dra. Sato | "Quem estiver sem dupla: comece cedo." é palavra de regra do jogo na letra dela. | ressalva |
| 8 | c_anc_3 × regra da memória | Seu Dirceu: "Toda vez é igual". Pode ser lido como lembrança das voltas. | ressalva |

Visto de passagem, fora do meu recorte (vale para quem avaliar seções 1 e 4): cofre_ronda fala de uma linha "na ronda de hoje" sobre o paletó entrando pela porta de serviço, disponível desde 0:00, e a porta só abre às 4:00; o laudo (falsa_2) "aparece" só na volta 2 num museu que volta sempre ao mesmo ponto.

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Voz inconfundível só por escrito: peso e medida ("Eu sei o que eu carrego", v4_teo), frase curta de ordem ("Tinta não mente.", teo_d3), culpa honesta (d_teo_1, d_fus_2b). Nenhuma fala serviria a outra pessoa. |
| Aurélio | 4,5 | 4 | Três falas, as três perguntam ou recuam antes de afirmar (aurelio_0, aurelio_1 "Você também sentiu?", aurelio_2); o laudo (falsa_2) tem a secura de acervo. Meio ponto fora: são só três falas, todas na mesma sala. |
| Ivone | 4,5 | 4 | ivone_1x ("Pote 7, vermelho... Eu não perco pote.") e ivone_2 (bate o dedo na linha) entregam método e secura sem adjetivo. v5_ivone promete hora e não dá. |
| Dra. Sato | 4,5 | 4 | Constante em 10 pistas: "ela" para a máquina, "olha a luz da peça!" (man_2), "É a minha tranca." (a_hist_1), sato_teo. Meio ponto fora: as seis respostas de man_3 soam tabela ("Carga baixa tem dois motivos"), e a fala dos três carimbos ("Ela... ela escutou você.") continua só no roteiro: não existe no jogo. |
| Lenz | 4,5 | 4 | lenz_0 ("Boa noite, boa noite... Ótimo, ótimo."), lenz_1 ("Nem você."), lenz_2 ("Eu devolvo tudo que eu pego.") e traj_3 dão pressa, favor e ameaça educada. Seria 5,0; desconto de 0,5 por autoavaliação (ver aviso). |
| Braga | 4,0 | 4 | "Tá." e o café marcam (braga_1, cracha_3). Mas a ficha promete alguém que **fala muito e muda de assunto**, e as falas dele são das mais curtas do jogo; v4_braga é depoimento limpo, sem o jeito dele. |
| Seu Dirceu | 4,0 | 4 | traj_2 ("Nem boa-noite.") e c_anc_3 ("e ninguém atende") são dele. ivone_ali_2 é álibi recitado: qualquer um diria. |
| **Nico** | **3,5** | 4 | Duas falas no jogo inteiro. O bordão (nico_0) é contado pelo narrador ("repete a mesma frase"), não mostrado; "simpático", "perde o fio" e a atenção às pessoas não aparecem. nico_1 é bom, mas é a única vez que ele fala de verdade. |
| **Média (8 personagens com fala)** | **4,3** | **4,5** | 34,5 ÷ 8 = 4,31. Só os 7 principais: 30,5 ÷ 7 = 4,36. **Não passa nos dois cálculos.** |

**Abaixo de 4 (lista de correção obrigatória):** Nico.
**No limite (4,0):** Braga e Seu Dirceu. Subindo Nico, Braga e Dirceu para 4,5 a média vai a 4,56.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 4,0 | A premissa puxa sozinha (o museu esquece, o caderno lembra, o chão guarda), e há achados que dão vontade de contar: caixa de "banners" que pesa demais, cadeado com a letra do Téo, o apagão que vira o raio. A peça 3D para girar e tocar é um bom brinquedo. Tira ponto: os minijogos das pistas têm pergunta óbvia ou fora da história (ver correção 11), e a sala vira lista de 10 a 12 botões "Examinar · 1 de energia" (tela 06). |
| Integrada | 3,5 | Melhorou com a missão secreta ("conte ou blefe") e com os cinco papéis da volta 5. Mas o papel segue genérico ("uma pessoa que investiga o museu do Loop"), a missão só paga +1 de energia e ninguém mais fica sabendo dela; são 5 missões, que se repetem a partir da 6ª pessoa. |
| Identificada | 4,0 | O diagnóstico ensina de verdade: o erro volta com o motivo ("é sinal, mas não combina"; "história, manual ou ferramenta"), e a fita do tempo no telão é recompensa de entendimento. Falta devolver o acerto com palavras de gente: hoje o acerto responde "DIAGNÓSTICO ANEXADO... O conserto da máquina pode acender." |
| Externa (menos é melhor) | 2,0 → invertida 4,0 | Pouca cara de obrigação. Restos: "Usá-las não impede a pontuação nesta bancada" (tela 11), receita de formato na mensagem de erro, e a missão premiada só com energia. |
| Amotivação (menos é melhor) | 2,0 → invertida 4,0 | Todo final diz alguma coisa a quem jogou, até o Mínimo. O risco está em texto velho que contradiz o jogo atual e faz a pessoa duvidar do que entendeu: pausa com "perto das 22h: o estrondo" (tela 12), entrada com "Explore uma sala a cada volta" (tela 03), botões "Painel desregulado / Falta de potência" quando o manual diz "falta ajustar / falta força" (tela 09), placar "1 de 1 descarte" quando a regra diz "leitura normal", e "mural do Corredor" numa sala que no mapa se chama Área de descanso. |
| **Nota da escala** | **3,9** | (4,0 + 3,5 + 4,0 + 4,0 + 4,0) ÷ 5. Mínimo 4,5. **Não passa.** |

Introjetada: neutra, não pontua.

**O que não deu para julgar sem jogadores reais (não puni):**
- se 5 de energia por volta dá gosto de escolha ou sensação de falta;
- se a caminhada de 10 segundos entre salas cria tensão ou tédio;
- se falar em voz alta de salas diferentes funciona numa sala de aula barulhenta;
- se alguém de fato blefa a missão secreta na pausa;
- se quem termina o conserto cedo tem o que fazer nas voltas 4 e 5 (a camada de pessoas existe no texto; o ritmo só se vê jogando);
- a fita do tempo no telão: a tela 14 mostra só a entrada por código, então julguei pelo texto dos fatos em ritmo.js;
- o prazer de girar a peça 3D e de resolver os minijogos (julguei só o enunciado).

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

Total aproximado: 13 pistas mexidas ou novas (~420 palavras), 5 linhas da ficha (~90 palavras), 9 textos de tela (~170 palavras), 5 enunciados de minijogo (~130 palavras), 2 mudanças pequenas de mecânica. Nenhuma muda enredo fixado; a 2 e a 5 escolhem entre duas versões que hoje convivem no texto.

### Fichas e coerência (Seção 2)

**1. nico_0 — dar cena à atenção dele às pessoas (~45 palavras).** Resolve a lacuna do item 2 e sobe a voz.
`Nico, guia do museu, repara em você antes de você chegar perto: "Você tá com cara de quem não jantou. Tem bolacha na copa, pega lá. E a Ivone hoje tá brava, mas não é com você. Desculpa... eu já te disse isso?"`

**2. cracha_3 — uma versão só do crachá (~55 palavras).**
`Braga olha a escala e o bilhete no seu caderno e coça a nuca: "Tá. O crachá é meu. Só que não tá comigo desde ontem. O Lenz, do patrocínio, ficou rondando o armário da equipe, falando 'rapidinho'. Quando eu voltei, tinha o bilhete no lugar do crachá. E eu... eu deixei quieto. Quer um café?"`

**3. ivone_red e v5_ivone — tirar a contradição da cafeteira e a hora que não existe (~50 palavras).**
- ivone_red: `A mancha é da tinta da Ivone, sim, e ainda está molhada. Só que o caderno dela marca o pote na bancada no fim da tarde. Desde então ela só foi até a cafeteira colar um bilhete e voltou: a porta de vidro do Ateliê dá para o corredor inteiro.`
- v5_ivone: trocar o começo por `Recado da Ivone na bancada, em letra miúda e reta:` (o resto fica).

**4. lenz_1 — ele só muda quando você fala (+10 palavras).**
`Você diz, alto, que a peça da Galeria é cópia. Na escada, ele para um segundo e ajeita o punho da camisa: "Olha, amanhã isso aqui tá cheio de câmera e de gente importante. Ninguém quer confusão hoje. Nem você."`

**5. teo_radio, trecho da noite C — o Téo desconfia, não sabe (~40 palavras).**
`E o Téo continua: "A doutora prendeu a máquina na peça da base. E a da base é mentira. A verdadeira eu ainda não achei, mas do prédio ela não saiu: nada daquele tamanho passou pela porta. Procura o que pesa mais do que devia."`

**6. aviso_solo e c_anc_3 — tirar palavra de regra e lembrança de volta (~35 palavras).**
- aviso_solo, última frase: `Quem vier sem ajudante: comece cedo.`
- c_anc_3: `Seu Dirceu, da limpeza, reclama: "Desde ontem é isso: a base lá da Galeria apita, acende amarelo, e ninguém atende. Já avisei duas vezes."`

**7. FICHAS.md — cinco linhas (~90 palavras).**
- Téo, voz: `assina "— T." nos bilhetes e "— Téo" no diário do acervo, que é documento da casa`.
- Ivone, voz: trocar "hora e quantidade" por `parte do dia e quantidade`.
- Dra. Sato, tabela de cenas: `man_3, man_2 ("Ou não."), man_anc_2 ("Nunca aconteceu, mas vai que"), a_hist_1`.
- Nico, tabela de cenas: `nico_0 (repara em quem chega), nico_0b, nico_1`; tirar dis_gato.
- Exceções, linha nova: `Aurélio, no final Ouro, agradece "por não esquecer": ele não lembra das voltas; fala do que acabou de ver no telão.`

### Voz (Seção 3.1)

**8. Nico — segunda fala, pista nova nico_0b (~40 palavras).** Base da limpeza, volta 2 em diante, clima, sem custo.
`Nico começa a explicar a Galeria e perde o fio: "A peça principal tem trezentos anos e... onde eu tava? O Braga hoje não parou de pôr a mão no cinto, você reparou? Desculpa, eu já te disse isso?"`
(Planta de graça o cinto vazio de braga_red.)

**9. Braga e Seu Dirceu — falar como a ficha manda (~95 palavras).**
- traj_aviso: `O monitor do corredor de serviço está parado e vazio. Braga nem olha: "Ali? Ali não passa ninguém a noite inteira, eu conheço esse corredor de olho fechado. Você tá molhado, hein? Chuva feia. Pega um café, tá fresco. Pode ver depois, se quiser."`
- ivone_ali_2: `Seu Dirceu apoia o queixo no cabo do rodo: "A Ivone? No dia {dia} ficou o dia inteiro no Ateliê, de porta aberta, que eu passei pano ali três vezes. Saiu pro ônibus antes de escurecer. Ela nem deixa eu encostar na bancada."`

**10. Dra. Sato — pôr no jogo a fala dos três carimbos (~18 palavras).** Em loop-central.js, na resposta de acerto do diagnóstico, depois de "DIAGNÓSTICO ANEXADO.":
`No interfone, a Dra. Sato quase sussurra: "Quem fez isso? Ela... ela escutou você."`

### Motivação (Seção 3.2)

**11. Minijogos: pergunta que exige pensar e que é da história (Intrínseca; ~130 palavras).** Em LC_MG e LC_MGA:
- cracha_1 (hoje: "Qual crachá aparece?", logo depois de ler que é o do Braga): `A escala diz que o crachá do Braga abre a porta de serviço às 4:00. Onde o Braga está nesse minuto?` Opções: `Na porta de serviço` / `Aqui na Central, na sua frente` / `No Subsolo`. Certa: a segunda.
- falsa_1 (hoje entrega a conclusão e fala de "selo" e "fissura", que não existem na história): `Mude o ângulo da luz até aparecer o que a luz de frente esconde.` Ao acertar: `O verniz brilha por igual, sem um risco. Peça de 300 anos não brilha assim.`
- traj_1 (hoje ordena "caixa, carrinho, bancada", que não é o que a câmera mostra): itens `Paletó cruza o corredor de serviço` / `Crachá abre a porta de serviço` / `Paletó desce a escada do Subsolo` / `A Câmara liga`.
- coop_entrou_nao_saiu (hoje: "Crachá 031 e a caixa 314", código sem razão no mundo): `Três pessoas assinaram a entrada. Qual delas a roleta da saída não registrou?` Opções: `O entregador de flores` / `A fotógrafa` / `Lenz, do patrocínio`.
- coop_original_copia (duas opções absurdas): opções `A rachadura está do outro lado` / `A peça está mais suja que na foto` / `A base é mais alta`.

**12. Limpar texto velho que contradiz o jogo (Amotivação; ~170 palavras).**
- Pausa da volta 2 (game.js): `De novo. Você já sabe o que esperar: o raio, a luz que cai, o homem de paletó perto das 4:00. O que ainda não sabe é por que a máquina não deixa a noite andar.`
- Entrada (individual.html e sala/index.html): `Ande pelas salas, guarde pistas no caderno e conserte a máquina antes que a quinta volta acabe.`
- Relógio: "LOOP 2 DE 5" → `VOLTA 2 DE 5`; "loops concluídos" → `voltas concluídas`.
- Botões do defeito: `Falta ajustar` / `Falta força` / `Peça errada na base` / `Alguém desligou na mão` / `Dois defeitos juntos` (as palavras do manual, man_1).
- Placar do diagnóstico: "de 1 descarte" → `de 1 leitura normal`; "não é sinal da máquina nem descarte" → `não é sinal da máquina nem leitura normal`.
- Caixa de orientação: `Pedir orientação não tira nada de você.`
- assim_leg: "mural do Corredor" → `mural da Área de descanso`; aba Revelar: "o chão do corredor" → `o chão da Área de descanso`.
- assim_foto: "legenda no mural do Corredor" → `legenda no mural da Área de descanso`.

**13. Devolver o entendimento com palavras de gente (Identificada; ~45 palavras).**
- Acerto do diagnóstico, depois da fala da Dra. Sato: `Você não chutou: dois sinais diferentes apontando para o mesmo lado e uma leitura dizendo "aqui não é".`
- Revelar aceito, antes do texto do final: `Três provas, três perguntas respondidas: o que foi feito, por onde passou, de quem era a mão.`

**14. Missão secreta que os outros veem (Integrada; mecânica pequena).**
- Na fita do tempo do telão, o fato ligado à missão cumprida ganha a linha `Quem trouxe: <nome>`. A turma vê quem achou o quê.
- Subir de 5 para 8 missões, para não repetir em grupo de 6 a 8: `Descubra para onde vão as pegadas.` (coop_pegadas, pegadas_solo ou lenz_3) / `Descubra onde a peça verdadeira está.` (c_peca) / `Descubra o que o Nico está guardando.` (nico_1).

**15. Papel com identidade (Integrada; ~16 palavras).** Na frase de abertura (individual.html, sala/index.html) e no roteiro, que hoje dizem coisas diferentes:
`Nesta atividade você vive o papel da única pessoa do museu que lembra das voltas.`

**16. Formato fora da mensagem de erro (Externa; mecânica pequena).** O formato do valor (`9`, `0:45`, `305`) vira texto-fantasma dentro do próprio campo de digitar. A mensagem de erro fica só com `A MÁQUINA NÃO REAGE: 2 de 3 valores aceitos. Ainda errado: a hora.`

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (r1) | Agora (r2) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Não passa | **Passa** | FICHAS.md reescrito com os 8 personagens. |
| 2.4 traço extremo com cena | Não passa | Não passa | 15 de 16 cobertos; falta só a atenção do Nico às pessoas. |
| 2.4 falas não contradizem a ficha | Não passa (9) | Não passa (2) | As 9 antigas sumiram; restam crachá "pediu × pegou" e Ivone na cafeteira. |
| 2.4 exceções registradas | Não passa | **Passa** | Cinco exceções escritas; faltam duas linhas menores. |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa. |
| Téo | 4,0 | 5,0 | Saíram as quatro contradições e a regra na boca dele (abre_1). |
| Dra. Sato | 4,0 | 4,5 | a_hist_1 e sato_teo novas; a fala dos carimbos continua fora do jogo. |
| Aurélio | 3,5 | 4,5 | De 1 para 3 falas, mais a do final Ouro. |
| Ivone | 3,0 | 4,5 | ivone_1x e ivone_2 novas; v5_ivone respeita o álibi. |
| Braga | 3,0 | 4,0 | Café e "Tá." em cena; ainda fala pouco para quem "fala muito". |
| Lenz | 2,0 | 4,5 | Passou a falar ao vivo em quatro pistas. |
| Nico | 3,0 | 3,5 | nico_1 melhorou; a segunda fala proposta na r1 não entrou. |
| Seu Dirceu | 3,5 (fora da média) | 4,0 (na média) | Agora tem ficha; ivone_ali_2 segue sem voz. |
| **3.1 média** | **3,2** | **4,3** | Sobe 1,1; falta 0,2. |
| Intrínseca | 3,5 | 4,0 | Cenas próprias por noite, peças 3D, pessoas que respondem; minijogos fracos seguram. |
| Integrada | 3,0 | 3,5 | Missão com efeito e papéis na volta 5; papel ainda genérico. |
| Identificada | 3,5 | 4,0 | Erro do diagnóstico explica o porquê; fita do tempo no fim. |
| Externa (bruta) | 2,5 | 2,0 | Regras saíram das pistas; receitas de formato encurtaram. |
| Amotivação (bruta) | 2,5 | 2,0 | Queda do Téo e engano do Lenz agora têm cena; sobra texto velho nas telas. |
| **3.2 nota** | **3,4** | **3,9** | Sobe 0,5; falta 0,6. |

Nenhuma nota caiu. Nenhuma correção desta rodada mexe em fato de enredo que derrube a seção 1; as correções 2 e 5 alteram frases de pista essencial e pedem reconferência de jogo limpo e de palavras proibidas por volta (a 2 mantém o nome do Lenz só da volta 2 em diante, como hoje).

## 5. Fim do ciclo

**Nem todas as escalas passaram.** Seção 2: 3 de 5 itens. Seção 3.1: 4,3 de 4,5, com Nico abaixo de 4. Seção 3.2: 3,9 de 4,5. O ciclo de renovação continua.
