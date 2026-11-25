# Loop v4 — Escala da história (seção 1) — rodada 2, avaliada do zero

Avaliador independente (não escrevi o texto; sem desconto de autoavaliação). Base lida por inteiro: ROTEIRO-LOOP.md, FICHAS.md, LOOP-CENTRAL.md, DECISOES-V4.md, as 224 pistas de pistas_legivel.txt, atividades/finais/grupos de atividades.txt. Conferi também os campos `regras`, `trancas` e `compensacao_solo` de dados/pistas-v4.json, só para checar as pendências que o LOOP-CENTRAL.md lista. Nada foi editado no repositório.

## 1. Nota geral

**7,7 / 10 — NÃO PASSA. Os 9 critérios continuam abaixo do mínimo**, mas todos subiram e nenhum está abaixo de 7,0. A versão v4 resolveu de verdade os problemas grandes da rodada 1 (uma versão só para o Téo, fichas do elenco certo, manual igual nas 5 noites, pendrive com senha que o Téo podia saber, empurrão e engano plantados, sujeira de troca automática limpa). O que segura a nota agora é mais fino: a regra de memória é quebrada por objetos do próprio museu, as causas C e D se entregam com uma pista só, a história inteira cabe nas voltas 1 e 2, duas das três provas do Revelar saem de graça no minuto 0 e os documentos técnicos ficaram para trás dos dados.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 8,0 | 9,0 | Lema e "Se ninguém provar, quem fez isso sai pela porta da frente" (`data_3`) sustentam o tema, mas a pergunta não cobra nada (Ouro = fazer as duas coisas), o final Revelar desmente o lema ("o museu inteiro lembra junto com você") e o Desligar não diz o que se perde, já que o Téo acorda e a caixa continua lá. |
| O oculto (motor do mistério) | 7,5 | 9,0 | A Câmara é original, mas coisas do museu "lembram" (`cracha_1`: escala que diz "em toda volta"; `raio_3`: registro com a linha repetida; `mancha_2` maior; `pose`), a Dra. Sato sabe do "verniz fresco" sem ninguém contar (`man_3`, resposta da base apitando) e a impressora dá o diagnóstico pronto ("CIRCUITO ABERTO", `man_circ_3`, só na noite D). |
| Estrutura | 7,5 | 9,0 | 191 das 224 pistas abrem na volta 1 e 28 na 2; tudo que o roteiro põe nas voltas 3 e 4 (ata `rev_3`, guardanapo `v5_lenz`, livro `v4_braga`, pendrive `nico_1`) já sai na volta 2; a volta 4 fecha tudo (o ensaio diz qual valor está errado) e as mensagens de tranca (`porque`) contam a solução ("Nico só entrega o pendrive a quem diz o número de registro…"). |
| Rodízio e regras do culpado (causas A–E) | 7,5 | 9,0 | C e D têm sinal que só existe na noite delas e se resolvem com uma pista (`c_modo_1` "Câmara PRESA à peça principal" + base apitando na sala onde o cartão manda começar; `d_ord_1` papel na mão do Téo na volta 1); A, B e E exigem descarte; só D muda o final e E não tem cena própria. |
| Jogo limpo e dedução | 7,0 | 9,0 | Pista forte cedo: a peça verdadeira na mão (`c_esc_1` + `c_peca`) na volta 1 por 2 de energia; "Lenz, do patrocínio" por extenso no `cracha_4` (custo 0) e em `catraca_solo`; duas das 3 provas do Revelar custam 0 no minuto 0 (`falsa_1`, `traj_4`); a sirene do final Ouro e a gravação do telefonema (`lenz_mot_3`) não têm origem. |
| Personagens e fichas | 8,5 | 9,0 | Fichas completas para os 8 e vozes reconhecíveis (`ivone_1x`, `lenz_2`, `cracha_3`), mas o Téo escreve sobre o que não podia saber (`v4_teo`: "Não deixem desligar"; `abre_1`: "Confia no que você anotou"), a Dra. Sato fala de verniz sem ter ouvido, e o Braga diz "pediu rapidinho" quando o bilhete diz "peguei". |
| **Prosa** | **7,5** | **8,0** | Texto vivo na maioria das cenas, mas ainda há narrador concluindo pelo jogador (`falsa_1`, `ivone_red`, `c_esc_2` com uma "escolta" que a guia não cita, `mancha_2`), ordem de jogo dentro da pista (`man_legenda` "leia em voz alta", `iso_1` "deixe no chão", `aviso_solo` "sem dupla") e palavra de projeto em objeto do mundo ("em toda volta", "minuto da volta" em `cracha_1` e `hora_3`). |
| Robustez por número de jogadores | 8,5 | 9,0 | Todo fato essencial tem 2 a 5 fontes em salas diferentes e há caminho sem dupla para tudo; faltam: a luva isolante do armário (`iso_1`) não conta como "isolante" enquanto a luva do carrinho conta, a noite E sem dupla cabe nas 5 voltas sem nenhuma folga, a energia de quem joga sem dupla é 5 numa regra e 6 em `compensacao_solo`, e o roteiro só distribui papéis para 5 pessoas. |
| Consistência do documento | 7,0 | 9,0 | LOOP-CENTRAL.md está atrás dos dados (conta 194/25/1/4 pistas por volta, o real é 191/28/1/4; lista como pendência o que já foi corrigido); a mesma sala chama "Área de descanso" e "Corredor"; roteiro diz ensaio "ontem" e as pistas "de hoje"; `maq_ver` tem 1 botão e `traj_3` cria um segundo ("botão de ligar"), o que muda a senha do cofre (311). |

### O que conferi da rodada 1 (resolvido de fato nos textos atuais)

Téo com uma versão só (`teo_1`, `teo_cadeira`, `teo_d3`, `sato_teo`); reinício só às 5:00 (`raio_1` limpo); sem hora do dia; crachá do Braga com uma história só (`cracha_2`, `braga_red`, `v4_braga`); Ivone sem confissão que anula o álibi (`v5_ivone` virou a pesagem); Lenz com falas em cena (`lenz_0`, `lenz_1`, `lenz_2`, `traj_3`); manual páginas 1 a 6 em toda noite; caixa de "banners" em toda noite; senha do pendrive = número de registro, e a gravação não dá mais o nome; cadeado sem assinatura até ler o diário (`d_fus_2` / `d_fus_2b`); empurrão com 3 fontes (`empurra_1`, `empurra_2`, `lenz_3`); engano do Lenz com 2 fontes (`traj_3`, `rev_3`); por que a tinta brilha (`ivone_1x`); por que o Téo acorda (`sato_teo`); etiquetas neutras; sujeira de troca automática: não achei nenhuma; monograma e "hoje não choveu": saíram; `cracha_3`, `lenz_2` e `v4_braga` estão com volta 2 nos dados (o LOOP-CENTRAL.md ainda diz que não).

### Contradições e furos achados nesta rodada (evidência)

1. **Memória.** Regra: só caderno, chão e Câmara lembram. Contra ela: `cracha_1` ("Escala de crachás: em toda volta, no minuto 4:00, o crachá do Braga abre a porta", disponível no segundo 0, antes de acontecer); `raio_3` (registro com "a mesma linha repetida uma embaixo da outra"); `mancha_2` ("maior do que na volta passada") contra `sato_teo` ("não piora, nem melhora"); `pose` (escultura que muda de pose "de novo"); `eco_chave` e roteiro §6-B ("o museu guardou a sua mão" / "o museu grava o seu gesto"); roteiro §6-E ("A Câmara é a única coisa que não volta"), que apaga o caderno e o chão; final Revelar ("o museu inteiro lembra junto com você").
2. **Dra. Sato sabe demais.** `man_3`, resposta à base apitando: "Ela procura uma peça de 300 anos e acha verniz fresco." Ela está fora do prédio e você só contou do apito.
3. **Téo sabe demais.** `v4_teo`: "Não deixem desligar sem provar quem foi" (ele escreveu antes de existir o que desligar); `abre_1`: "não confia no museu. Confia no que você anotou" (prevê o reinício em toda noite, não só na D); `teo_radio` na noite C: "procura uma caixa pesada demais" (se ele sabia onde estava a verdadeira, não precisava do plano da tinta).
4. **Ontem x hoje.** Roteiro §2: a Dra. Sato fez o último ensaio ontem e saiu. Pistas: "ficha de ensaio de hoje" (`b_verde_2`), "registro de hoje" (`b_verde_3`, `livre_1`, `c_modo_1`), "Hoje ela roda…" (`livre_2`, `c_modo_2`). Na noite C, se o ensaio de ontem já foi "presa à peça" e a cópia está na base desde o dia da troca, a base já teria apitado ontem.
5. **Ajuste.** `man_cal_1` (manual escrito antes do crime) fala em "peça verdadeira"; nas noites B e C a máquina está "ajustada, três vistos" com um número (o minuto da queda de luz) que ainda não tinha acontecido; na noite A ela está em "modo livre, não se segura em peça nenhuma" (`livre_1`) e mesmo assim pede o registro da peça.
6. **Botões.** `maq_ver`: "3 mostradores, 1 ponteiro, 1 luz da peça e o botão vermelho". `traj_3`: "Aperta o botão de ligar". Dois botões: a dica do cofre (`cofre_dica`: "quantos mostradores, quantas luzes, quantos botões") deixa de dar 311.
7. **"Tentativa".** `b_carga_1` diz que a máquina "tenta ligar, perde o fôlego e o museu volta 5 minutos" (uma tentativa = um reinício), mas `b_luz_1/2/4` e `b_carga_2/4` mostram várias tentativas dentro da mesma volta.
8. **Cofre.** `cofre_ronda` (segundo 0): "paletó entrou pela porta de serviço com crachá da casa". Se é a passagem das 4:00, ainda não aconteceu; se é de antes de 0:00, não é o trajeto até o Subsolo, e mesmo assim conta como prova do trajeto.
9. **Crachá.** Bilhete: "peguei teu crachá" (`cracha_2`), livro: "levou e deixou bilhete" (`v4_braga`), fala: "pediu 'rapidinho'" (`cracha_3`).
10. **Diário em 3 salas.** `data_3` e `teo_d1` na Sala de conservação, `teo_d2` na Sala da fotografia (e a tranca diz "você só folheia o diário para trás"), `teo_d3` na Sala das coleções.
11. **Luva.** O aviso diz "só de luva isolante" (`iso_aviso`); a luva isolante de verdade (`iso_1`) não entra no grupo "isolante"; a luva de borracha do carrinho (`iso_3`) entra.
12. **Sirene.** Final Ouro: "Lá fora, uma sirene." Ninguém chamou socorro e a estrada está fechada pela tempestade (roteiro §2).
13. **Prova fraca x prova forte.** O cheiro de verniz (`falsa_1`, custo 0) vale como prova da cópia no Revelar; a peça verdadeira na mão (`c_peca`) não está no grupo `prova_falsa`.

## 3. Abaixo do mínimo — o que corrigir

Marca **[AUTOR]** = mexe em decisão de enredo ou de regra já fixada; precisa do aval do autor. Arquivo das pistas, finais e atividades: `dados/pistas-v4.json` (e o `loop-central-dados.js` gerado dele). Contagem de palavras aproximada.

### 3.1 Premissa, tema e pergunta de valor (8,0)

1. **Final Revelar não pode desmentir o lema** (`finais.final_revelar.texto` + ROTEIRO §8). Texto: *"As 3 provas aparecem no telão da Recepção. Todo mundo viu. Às 5:00 o museu esquece de novo. O seu caderno, não: as 3 provas continuam nele, na ordem certa. A máquina ainda gira, mas agora você sabe o que mostrar, e a quem."* ~45 palavras.
2. **Final Desligar precisa dizer o que se perde** (`finais.final_desligar.texto` + ROTEIRO §8). Texto: *"Com o defeito consertado, você aperta "Loop Reset". O relógio passa de 5:00 e continua. Você devolveu a manhã ao museu. Cedo, uma caixa de "banners" sai pela porta da frente, com guia assinada. Ninguém viu o que você viu."* ~45 palavras. Liga com `c_esc_2` (retirada amanhã cedo) e com `data_3`.
3. **Fazer a escolha custar** **[AUTOR]**. Hoje ninguém escolhe entre Desligar e Revelar. Opção de regra, uma linha na ajuda da Máquina: *"O Revelar leva 40 segundos de fala na Recepção, e o "Loop Reset" só responde com alguém segurando a tampa no Subsolo. Com 2 pessoas, uma das duas coisas fica para quem correr."* ~35 palavras.
4. **`v4_teo`**: trocar a última frase por *"Não deixem a exposição abrir sem provar quem foi. — T."* ~10 palavras.
5. **`abre_1`**: *"Na mesa da Recepção, um cartão do Téo: "Se eu não aparecer na montagem hoje, não pergunta pra ninguém: anota. Começa pela peça. — T.""* ~25 palavras. Ajustar a citação no ROTEIRO §4, volta 1.

### 3.2 O oculto (7,5)

1. **`man_3`, resposta `sint_ancora`**: *"Você conta da base apitando. Ela responde: "Então ela não reconhece a peça que está na base. Procura 300 anos e acha outra coisa. O quê, quem tem olho aí é você.""* ~30 palavras.
2. **`man_circ_3`**: passar a existir em todas as noites e sem diagnóstico. Texto: *"A impressora solta uma folha velha, amassada na bandeja: "F2, pontos na ordem de quem soltou, disjuntor. De luva!""* ~20 palavras; `soNaCausa`: todas.
3. **`cracha_1`** (sem "volta" e sem prever as 4:00). Texto: *"Escala de crachás de hoje: "Porta de serviço: crachá BRAGA, liberado até o fim do turno." O Braga está sentado na sua frente. O cinto dele está vazio."* ~28 palavras. A abertura das 4:00 continua em `traj_1`.
4. **`raio_3`**: *"Registro de quedas de luz dos últimos meses: toda queda em noite de tempestade tem a mesma causa anotada, com letras diferentes: "raio no para-raios"."* ~25 palavras.
5. **`hora_3`**: trocar "o minuto da volta: 1:10" por *"o carimbo do relógio da câmera: {hora}"*. ~6 palavras.
6. **`mancha_2` e `pose`** **[AUTOR]** (o roteiro §4 usa as duas na volta 2). Ou somem, ou ganham dono. Proposta que respeita a regra: `mancha_2`: *"A mancha está do mesmo tamanho da volta passada. Você mede com o pé: a tinta escorre até a mesma tábua e para. Só a sua pegada de ontem não está mais lá."*; `pose`: *"Pela porta de vidro da Sala das esculturas, em reforma, a escultura de bronze. Você não tinha reparado: o braço aponta para a escada do Subsolo."* ~30 palavras cada; ROTEIRO §4 volta 2: trocar "A mancha está maior, e não devia. A escultura de bronze mudou de pose" por "A mancha está igual. Você é que não está."
7. **Eco é da Câmara, não do museu**: `eco_chave`: *"Eco gravado: a Câmara guardou a sua mão fechando a chave {ch} no clarão. Nas próximas voltas ela repete o gesto sem você. Falta só a alavanca, lá no Subsolo."*; ROTEIRO §6-B: "o museu grava" vira "a Câmara grava"; ROTEIRO §6-E: "A Câmara é a única coisa que não volta com o museu" vira "Do museu, só a Câmara não volta." ~12 palavras no total.
8. **Ajuste com razão de existir** (`man_cal_1`): *"Manual, página 2: "Se ela perder os números (mostradores piscando), dê três pontos fixos para ela se achar, nesta ordem: o último dia em que mexeram na peça da base; o minuto da última queda de luz; o número de registro da peça.""* ~45 palavras. Tira "verdadeira" do manual e explica por que B e C estão ajustadas sem esses números.
9. **Ontem, não hoje** (6 pistas, 1 a 12 palavras cada): `b_verde_2` "A ficha do último ensaio diz…"; `b_verde_3` "caderno de registro de ontem"; `livre_1` e `c_modo_1` "Registro técnico de ontem"; `livre_2`: *"Para a abertura ela fica em modo livre, sem se segurar em peça nenhuma."*; `c_modo_2`: *"Para a abertura ela fica presa à peça principal. Deixei armado ontem, não deu tempo de testar. Se mexerem na peça da base, ela se perde."*
10. **`b_carga_1`**: *"O ponteiro de carga mal sai do zero. De tempos em tempos a máquina tenta ligar, perde o fôlego e desiste."* ~20 palavras (tira "e o museu volta 5 minutos").
11. **`traj_3`** (resolve o segundo botão e o "ligar o que já está ligado"): trocar a última frase por *"Vira a chave de ligar da Câmara, que já está virada, e sai sem olhar para você."* ~16 palavras; mesmo ajuste no ROTEIRO §2 ("Ele vira a chave de ligar").
12. **Por que só vale na volta 5** **[AUTOR]**. Hoje é regra sem motivo no mundo (na noite E o meio conserto fica gravado na volta 3, mas o conserto inteiro das outras noites não). Uma linha em `loop_reset`: *""Só responde com a Câmara inteira e depois de quatro ciclos completos: é a trava de segurança dela. Antes disso, ela só recomeça.""* ~22 palavras.

### 3.3 Estrutura (7,5)

1. **Refazer a escada pelo número da volta** **[AUTOR em parte: mexe no ritmo]**. Só campos, 0 palavras: volta 2 → `c_peca` (e pedir `falsa_1`); volta 3 → `cracha_3`, `lenz_2`, `v4_braga`, `aurelio_2`, `lenz_mot_3`, atividade Acusação e Defesa; volta 4 → `rev_3`, `v5_lenz`, `nico_1`, `teo_radio`, `lenz_1`. É o que o ROTEIRO §4 já descreve nas voltas 3 e 4 e os dados não cumprem. Atualizar o checklist por volta do LOOP-CENTRAL.md.
2. **Volta 4 converge sem fechar** **[AUTOR]**. Texto de retorno do ensaio: *"A máquina reage. 2 de 3 certos."* (não diz qual). ~8 palavras; ROTEIRO §4 volta 4: tirar "diz qual valor está errado".
3. **Mensagens de tranca (`porque`) sem contar a solução** (~15 palavras cada, 8 pistas):
   - `nico_1`: *"Nico olha para você como quem espera uma palavra. Ainda não é essa."*
   - `teo_radio`: *"O rádio tem uma entrada vazia. Falta alguma coisa para encaixar ali."*
   - `cracha_3`: *"Braga desconversa e oferece café. Sem papel na mão, ele não fala."*
   - `d_f2_1`: *"A peça está no lugar. Você não tem motivo para mexer nela. Ainda."*
   - `rev_3`: *"Uma pasta grossa de atas. Sem saber o que procurar, é só papel."*
   - `c_peca`: *"A caixa diz NÃO ABRIR. Você precisa de um motivo."*
   - `lenz_1`: *"Ele passa direto. Não tem por que parar para você."*
   - `falsa_2`: *"Na mesa do curador, papéis virados para baixo. Você não sabe qual virar."*
4. **Sirene com origem** (`sato_teo`, acrescentar no fim): *""Eu já pedi socorro pelo rádio da estrada. Ele só chega se a noite andar.""* ~15 palavras.
5. **Prévias que entregam** (1 a 4 palavras cada): `b_verde_4` "Visor repetidor"; `a_cheia_3` "Câmera do Subsolo"; `lenz_2` "Esperar no corredor (só perto das 4:00)"; `d_f2_1` "A base, de perto"; `nico_1` "Nico, de novo".

### 3.4 Rodízio e regras do culpado — causas A–E (7,5)

1. **C sem frase pronta**: `c_modo_1` fica só *"Registro técnico de ontem: "Câmara PRESA à peça principal.""* (a explicação já está na página 4 do manual). ~8 palavras a menos.
2. **Base que apita em toda noite** (tira a exclusividade do sinal de C). Trocar `fh_pedestal` / `fh_pedestalx` por: *"A base da peça principal dá um apito curto de tempos em tempos."* e *"Papel colado atrás da base: "Bateria do sensor fraca. Apita. Trocar.""* ~25 palavras. Na noite C, o que distingue é o amarelo e o medidor (`c_anc_2`, `c_anc_4`).
3. **D não se entrega na volta 1**: `d_ord_1` passa a pedir uma de `d_fus_1..4`, com tranca *"A mão do Téo está fechada. Você não quer mexer nele sem motivo."*; `d_fus_3`: tirar "de macacão" (*"a mão de alguém tirando uma pecinha de vidro da caixa da Câmara"*). ~15 palavras.
4. **Segunda fonte para as cenas de A e B** (hoje `a_hist_1` e `b_hist_1` têm uma sala só). Novas: `a_hist_2` (Subsolo, pede `a_pisca_*`): *"Fita adesiva sobre os três mostradores, com a letra da Dra. Sato: "Zerados. De propósito. Não é defeito, é cadeado.""*; `b_hist_2` (Recepção, pede sinal de carga ou luz): *"E-mail impresso do patrocínio para a administração: "Gerador no mínimo até a festa. Cada litro de diesel sai do nosso bolso.""* ~22 palavras cada.
5. **Cena própria para E** (nova `e_hist_1`, só na noite E, Oficina elétrica, pede `a_hist_1` e `b_hist_1`): *"No verso da ordem de serviço do gerador, a letra da Dra. Sato: "Zerada E sem força? Então ninguém liga isto sem mim. Ninguém." Alguém ligou."* ~28 palavras.
6. **Final Desligar com gosto próprio em toda noite** (`texto_por_causa`, ~22 palavras cada; hoje só D tem):
   - A: *"A tranca da Dra. Sato abriu com três verdades. Você usou as três e não contou nenhuma. A manhã chega."*
   - B: *"O raio que apagava o museu acendeu a máquina. O gerador continua no mínimo, a pedido de quem trocou a peça. Só você sabe."*
   - C: *"A máquina soltou a mentira e segurou a verdadeira. A cópia continua na base da Galeria, e amanhã vai ter fila para ver."*
   - E: *"Dois defeitos, duas voltas, uma máquina inteira. A manhã chega para todo mundo. A verdade ficou no seu caderno."*

### 3.5 Jogo limpo e dedução (7,0)

1. **Prova de verdade no Revelar** **[AUTOR: regra das provas]**. Grupo `prova_falsa`: sai `falsa_1` (fica como suspeita que abre o laudo), entra `c_peca`. Grupo `trajeto`: `assim_foto` e `assim_leg` só contam juntas; `traj_4` passa a custar 1. 0 palavras; atualizar a tabela "Fontes por fato essencial" do LOOP-CENTRAL.md.
2. **Nome fora da volta 1**. `cracha_4`: *"Livro de visitas de hoje: três assinaturas na entrada e nenhuma na saída. Uma do patrocínio, apressada, quase um risco; um entregador de flores; uma fotógrafa."* ~28 palavras. `coop_catraca_ok` e `catraca_solo`: "O Lenz, não" vira *"O do patrocínio, não."* O nome passa a sair só em `cracha_3`, `lenz_2` (pelo crachá) e `coop_veredito`. Aí a frase do DECISOES-V4.md ("não há mais como chegar ao nome na volta 1") fica verdadeira.
3. **Peça verdadeira só da volta 2** (ver 3.3-1).
4. **`lenz_mot_3` com origem**: começar por *"Alguém esqueceu o rádio da equipe ligado na escada. Ficou gravado:"* ~12 palavras.
5. **O acidente plantado** (`empurra_2`): *"Na prateleira atrás do Téo, na altura do ombro, o pó foi arrastado por uma mão espalmada. Mais abaixo, outra marca, de dedos abertos, descendo: alguém tentou segurar quem caía."* ~32 palavras. Dá fonte para "ninguém quis ferir ninguém" (roteiro §2).
6. **`cofre_ronda`**: trocar "Na ronda de hoje" por *"Na ronda de hoje, no começo da noite,"* e tirar a pista do grupo `trajeto` (ela prova o crachá em uso, não a descida). ~6 palavras.
7. **Dra. Sato pergunta, não entrega a árvore** (`man_3`, ~22 palavras cada):
   - carga: *""Carga baixa pode ser duas coisas. Não me pergunta qual: me diz como estão as luzes do museu e a luz da peça.""*
   - luz: *""Luz que enfraquece pode ser duas coisas. Vai até a caixa de fusíveis e me conta o que tem lá.""*
   - piscando: *""Piscando assim pode ser duas coisas. Olha a caixa de fusíveis. Depois me liga.""*
   - relógios: *""Relógio tremendo é ela perdida no tempo. Por quê, eu não sei daqui. Como está a luz da peça?""*
8. **`teo_radio`, trecho da noite C**: *"E o Téo continua: "A doutora prendeu a máquina na peça da base. E a da base é mentira. Se a verdadeira ainda estiver no prédio, é dela que a máquina precisa.""* ~30 palavras.
9. **`iso_1` no grupo `isolante`** (0 palavras) e texto sem ordem de jogo (ver 3.7-5).

### 3.6 Personagens e fichas (8,5)

1. Dra. Sato sem verniz (3.2-1); Téo sem previsão (3.1-4, 3.1-5, 3.5-8).
2. **`cracha_3`** coerente com o bilhete: *"Braga olha a escala e o bilhete no seu caderno e coça a nuca: "Tá. O crachá é meu. Só que não tá comigo desde ontem. O Lenz, do patrocínio, vive pedindo coisa 'rapidinho'. Dessa vez nem pediu: deixou bilhete. E eu... eu deixei quieto. Quer um café?""* ~48 palavras.
3. **Lenz cuidadoso não guarda a conta na gaveta do museu** (`v5_lenz`): começar por *"No bolso de um paletó reserva, pendurado na chapelaria da Recepção, um guardanapo…"* ~12 palavras.
4. **Assinatura do Téo igual à ficha** ("— T."): `data_3` e `d_teo_1`. 2 palavras.
5. **Seu Dirceu** com maiúscula em `arm_aviso` e `ivone_ali_2`; em `arm_aviso`, "Plaquinha de bronze" vira *"Plaquinha de papelão"* (bronze não tem letra de ninguém). 4 palavras.
6. **`teo_d2`**: mudar a sala para a Sala de conservação (junto do diário) ou abrir por *"Página arrancada do diário do Téo, usada de marcador num álbum:"* ~10 palavras.
7. **`v4_braga`**: "riscado duas vezes antes de sair" vira *"riscado duas vezes e ainda legível"*. 5 palavras.

### 3.7 Prosa (7,5; mínimo 8,0)

1. **`falsa_1`**: *"A peça principal cheira a verniz fresco. Aurélio, ao lado, respira pela boca."* ~13 palavras.
2. **`ivone_red`** em cena: *"Você fala da mancha. Ivone aponta a porta de vidro sem olhar: "Dá para o corredor inteiro. Pergunta ao Seu Dirceu quantas vezes eu passei por ela hoje. Nenhuma. O pote saiu daqui. Eu, não.""* ~38 palavras.
3. **`c_esc_2`**: *"Guia de retirada marcada para amanhã cedo: "1 caixa de banners · Sala das coleções · retira: patrocínio · com escolta"."* ~18 palavras (a escolta entra no papel e o comentário do narrador sai).
4. **`man_legenda`**: trocar a última frase por *"No painel do Subsolo não tem legenda nenhuma."* ~8 palavras.
5. **`iso_1`**: *"A trava do armário soltou com a queda de luz. Lá dentro, uma luva isolante comprida, de eletricista. Ela está na sua mão."* ~24 palavras.
6. **`aviso_solo`**: *"Bilhete da Dra. Sato na porta da Câmara: "Sem ajudante eu nunca dei conta numa noite só. Num ensaio eu deixo tudo no lugar (o peso de teste no chão, a chave marcada); no ensaio seguinte eu termino. Sozinha, começo cedo.""* ~42 palavras.
7. **`coop_veredito`** em cena: *"A escala diz de quem é o crachá. O bilhete diz "peguei emprestado" numa letra corrida, deitada para a direita. No livro de visitas, uma assinatura deita igual: a do patrocínio. O crachá era do Braga. A letra é do Lenz."* ~42 palavras.
8. **`dis_guarda`**: trocar a última frase por *"A poça embaixo dele ainda cresce."*; **`traj_4`**: trocar a última por *"Ao lado, a marca de uma bota de segurança: outro desenho."* ~8 palavras cada.
9. **`cracha_1`, `hora_3`, `mancha_2`**: ver 3.2-3, 3.2-5, 3.2-6.
10. **Etiqueta de `livre_4`**: "LEITURA NORMAL · base da Galeria" (hoje diz "registro técnico" num painel de luz). 3 palavras.
11. **Atividades**: em `coop_apagao_combinado`, "interruptor" (formato de 3) e "chave geral" (papel A) viram um nome só; se `formato_turma` aparecer para quem joga, tirar "Frente 'Culpado'" e "Frente 'Máquina'". ~6 palavras.

### 3.8 Robustez por número de jogadores (8,5)

1. `iso_1` conta como luva isolante (3.5-9).
2. **Energia de quem joga sem dupla, um número só** **[AUTOR]**: `regras.cargas_por_volta` diz 5 e `compensacao_solo.cargas_por_volta` diz 6. Escolher e escrever na ajuda da Máquina. ~10 palavras.
3. **Noite E sem dupla com uma volta de folga** **[AUTOR]**: liberar o primeiro conserto da noite E da volta 2 em diante para quem joga sem dupla (`E_volta_min_meio` 2 no caminho solo). Hoje: diagnóstico na 2, ajuste na 3, eco na 4, alavanca na 5; um erro e não há mais Desligar. 0 palavras; `man_dois_1` continua valendo.
4. **Papéis da volta 5 para 2, 3 e 4 pessoas** (ROTEIRO §7, depois da tabela): *"Com 2: quem faz a Mão B corre para a Recepção assim que a máquina reagir. Com 3: a Central vira Porta-voz depois de confirmar os valores. Com 4: Mão A, Mão B, Central e Porta-voz; cada pessoa confere o próprio caderno."* ~45 palavras.
5. Pista de metades: ver 3.5-1 (hoje cada metade vale sozinha, então a troca em voz alta não é necessária em nenhuma configuração).

### 3.9 Consistência do documento (7,0)

1. **LOOP-CENTRAL.md, checklist**: pistas por volta = 191 / 28 / 1 / 4; apagar as pendências já resolvidas nos dados (`cracha_3`, `lenz_2`, `v4_braga` com volta 2; palavra antiga em `b_verde_2`; nomes antigos em `formato_turma`; "dicas da limpeza" na tranca da caixa; `noite` = "exemplo_v3"); trocar "ver nota" por "volta 2". ~60 palavras.
2. **Campos internos ainda antigos em pistas-v4.json**: `regras.volta_4` e `regras.conserto` ("na volta 4 são ensaio"; os dados usam volta 2 a 4); `trancas.*.troca_dossie` ("gasta 1 carga, 1 pista por pessoa"; o jogo usa grátis, até 3); `trancas.trajeto_do_culpado` ("traj_4 pede cracha_1": não pede); `trancas.hora_do_apagao` ("hora_5 sem trava de tempo": tem, 1:13). ~50 palavras.
3. **Um nome por sala**: a sala `corredor` chama "Área de descanso" (roteiro §6, `b_luz_2`, `par_tinta`, atividade) e "Corredor" / "corredor de serviço" (`assim_leg`, `a_pisca_4`, `b_verde_4`, `c_anc_2`, LOOP-CENTRAL.md). Proposta: a sala é a Área de descanso, e a porta de serviço fica nela. `assim_leg`: "No mural da Área de descanso"; `assim_foto`: "legenda no mural da Área de descanso"; `a_pisca_4`/`b_verde_4`/`c_anc_2`: "na parede da Área de descanso, ao lado da porta de serviço"; LOOP-CENTRAL.md: trocar "Corredor" nas tabelas. Também: "Pátio de luz" (`man_pot_2`) vira "Pátio"; escolher entre "Ateliê" e "Ateliê de descobertas", "Galeria" e "Galeria especial". ~12 trechos, 2 a 6 palavras cada.
4. Ontem x hoje (3.2-9); Câmara "única" e eco (3.2-7); chave de ligar (3.2-11); final Revelar (3.1-1).
5. **O Raio, código de 3 números**: roteiro §6-B e LOOP-CENTRAL.md citam; os papéis da atividade não. `papelB`: acrescentar *"Você lê em voz alta os 3 números gravados na chave."*; `papelA`: *"Você digita os 3 números que ouvir antes de baixar a alavanca."* ~22 palavras.
6. **ROTEIRO §4, voltas 3 e 4**: alinhar com os dados depois de 3.3-1 (hoje o roteiro promete nas voltas 3 e 4 o que já saiu na 2).
7. **DECISOES-V4.md**: a linha "Não há mais como chegar ao nome na volta 1" só fica certa depois de 3.5-2.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 1) | Agora (rodada 2) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 7,5 | 8,0 | Regra de memória escrita e respeitada pelas pessoas (falas dependem do que você mostra); "sai pela porta da frente" em toda noite. Ainda: escolha sem custo, final Revelar contra o lema, Desligar sem perda. |
| O oculto | 6,0 | 7,5 | Uma explicação só para o Téo e para o reinício; Dra. Sato só responde ao que você conta; `e_sato` saiu. Ainda: objetos do museu que lembram, Sato e Téo sabendo demais, impressora que diagnostica. |
| Estrutura | 5,5 | 7,5 | Laudo, molde, diário anterior, carta, gravação e nome foram para a volta 2; abertura virou cartão; viradas plantadas. Ainda: voltas 3 e 4 sem revelação nova, ensaio fecha tudo, trancas contam a solução. |
| Rodízio (causas A–E) | 6,0 | 7,5 | Manual igual nas 5 noites, cadeado sem assinatura, despiste em D, cenas para A e B, caixa em toda noite. Ainda: C e D com sinal exclusivo, E sem cena, só D muda o final. |
| Jogo limpo e dedução | 5,5 | 7,0 | Gravação sem nome, pendrive com laudo, empurrão e engano plantados, etiquetas neutras. Ainda: peça verdadeira e nome por extenso na volta 1, provas de custo 0, sirene e gravação sem origem. |
| Personagens e fichas | 4,0 | 8,5 | Fichas completas dos 8, exceções registradas, falas próprias para Lenz, Aurélio, Ivone e Braga; contradições de Braga e Ivone resolvidas. Ainda: Téo e Sato sabem demais; "pediu" x "peguei". |
| Prosa | 6,0 | 7,5 | Sujeira de troca automática limpa; resumos do narrador cortados em `v4_braga`, `v5_lenz`, `rev_3`; regra de jogo saiu de `regras_quadro` e `raio_contagem`. Ainda: narrador concluindo, ordem de jogo e "volta" dentro de objetos. |
| Robustez por número de jogadores | 7,0 | 8,5 | Bilhete da porta e página 6 avisam o caminho sem dupla; Central com informação própria; segunda fonte para cada sinal. Ainda: luva, folga da noite E, energia 5 x 6, papéis só para 5. |
| Consistência do documento | 3,5 | 7,0 | ENREDO/RODIZIO/FICHAS alinhados ou avisados, janela do Raio única, vocabulário único. Ainda: LOOP-CENTRAL.md atrás dos dados, nomes de sala, ontem x hoje, segundo botão. |
| **Geral** | **5,7** | **7,7** | Nenhuma nota caiu. |

## 5. Fim do ciclo

**Nenhuma escala passou ainda.** Faltam de 0,5 a 2,0 pontos por critério. As correções marcadas [AUTOR] (3.1-3, 3.2-6, 3.2-12, 3.3-1, 3.3-2, 3.5-1, 3.8-2, 3.8-3) pedem decisão do autor antes; as demais são execução. Depois de corrigir, reavaliar a seção 1 do zero antes de seguir para a seção 2.
