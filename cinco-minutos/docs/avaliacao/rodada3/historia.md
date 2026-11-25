# Loop v4 revisão 3 — Escala da história (seção 1) — rodada 3, avaliada do zero

Avaliador independente (não escrevi o texto; sem desconto de autoavaliação). Li por inteiro: ESCALAS_AVALIACAO_JOGOS.md, ROTEIRO-LOOP.md, FICHAS.md, LOOP-CENTRAL.md, DECISOES-V4.md, as 278 pistas de pistas_legivel.txt e atividades/finais/regras/grupos de atividades.txt. Conferi também, só para checar o que quem joga lê fora das pistas: a tela de entrada e a ajuda (individual.html), os minijogos, as missões, a aba Revelar e as respostas do anexar (loop-central.js, reserva/minigames.mjs) e a saída do validador (/tmp/roda/esc/r3/validar.txt). Nada foi editado no repositório.

## 1. Nota geral

**8,6 / 10 — NÃO PASSA AINDA. 4 critérios passaram (Premissa, Personagens e fichas, Prosa, Robustez); 5 ficaram entre 8,0 e 8,5.** Tudo o que a rodada 2 pediu foi conferido nos textos atuais e está aplicado. O que segura agora é fino e quase todo de texto: (1) os pares de mesmo rótulo criados na revisão 3 às vezes mostram o próprio defeito da noite e o dossiê responde que "não é sinal"; (2) textos fora das pistas (entrada, ajuda, aba Revelar, missões, minijogo da caixa) contam no minuto 0 o que a escada guarda para as voltas 2 e 3; (3) C e D ainda se explicam com uma pista sem tranca; (4) meia dúzia de frases em que os documentos se desmentem.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | O tema é o motor: todo mundo viu e calou (`aurelio_2` "Era medo meu", `v4_braga`, `ivone_2` "Devia ter perguntado por quê") e só o caderno de quem joga não cala; `data_3` e os 5 textos do Desligar deixam a pergunta. Defeito pequeno: o Ouro não cobra escolha (decisão já registrada do autor). |
| O oculto (motor do mistério) | 8,5 | 9,0 | A Câmara é original e a regra de memória está limpa nas pistas, mas o manual escrito antes do acidente já sabe que o museu volta (`man_dois_1`: "ela não volta com o museu"), a entrada diz "Um raio. O tempo recomeça." (o reinício é às 5:00, pela Câmara) e o engano dos "cinco minutos" não fecha com "minutos antes de 0:00" (ROTEIRO §2). |
| Estrutura | 8,5 | 9,0 | Escada 232/26/7/9/4 cumprida nos dados e volta 4 converge sem fechar, mas a ajuda ("descobrir quem trocou a peça"), a aba Revelar ("prova de que a peça é cópia") e 2 missões entregam a troca no minuto 0; o minijogo de `c_esc_1` manda "abrir a tampa" da caixa na volta 1; "Lenz" sai na volta 2 (`lenz_mot_2`). |
| Rodízio e regras do culpado (causas A–E) | 8,5 | 9,0 | Listas iguais nas 5 noites e chute igual (~26% em todas), mas C e D ainda têm a explicação inteira numa pista sem tranca (`c_modo_2` "Se mexerem na peça da base, ela se perde"; `d_teo_1`; `d_teo_2` "pecinha de vidro"), enquanto as cenas de A, B e E pedem um sinal antes. |
| Jogo limpo e dedução | 8,0 | 9,0 | Fontes e trancas em ordem, mas 7 pares "inocentes" mostram o defeito da noite (`fh_med_pot_bce` "barra quase vazia", `fh_status_c` "luz amarela, piscando") e o dossiê responde "não é sinal da máquina"; `coop_catraca_ok`/`catraca_solo` concluem "Ele ainda está aqui dentro" (ele saiu antes de 0:00); `tombo_1` diz "verdadeira" na volta 1; `coop_veredito` tira o nome do nada. |
| Personagens e fichas | **9,0** | 9,0 | 8 fichas completas, exceções registradas e falas coerentes (`cracha_3`, `ivone_red`, `nico_0b`, `lenz_2`). Defeitos pequenos: FICHAS diz que o Nico "é quem mais sente o reinício" (a regra é sem exceção) e a legenda `assim_leg` não tem dono (o Braga "não registrou"). |
| **Prosa** | **8,5** | **8,0** | Texto em cena, curto e com voz. Defeitos pequenos: narrador concluindo em `a_cheia_1` ("Força não falta."), `d_fus_4` ("som de circuito aberto, de fusível faltando"), `empurra_1`, `lenz_3`, `foto_solo`, e `braga_red` (vê o cinto do Braga estando na Recepção). |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem 2 a 5 fontes em salas diferentes, nenhuma presa a personagem de jogador; validador chega ao Ouro com 1, 2 e 3 pessoas nas 5 causas; papéis para 2 a 5. Defeito pequeno: `assim_par` só fecha com duas pessoas e depois de uma pausa. |
| Consistência do documento | 8,0 | 9,0 | Dados, roteiro e finais batem no grosso, mas: ROTEIRO §6-D "apertou o botão" x "chave de ligar"; §6-E "os dois na mesma volta não funcionam" x regra "sem dupla podem"; LOOP-CENTRAL/DECISOES "o nome não vaza na volta 2" x `lenz_mot_2`; ROTEIRO volta 1 "não dá prova" x `foto_solo` na volta 1; minijogo da caixa x `c_peca`; entrada x reinício às 5:00. |

### O que conferi da rodada 2 (aplicado de fato nos textos atuais)

Finais Revelar e Desligar (um por causa); `v4_teo`, `abre_1`, `teo_radio_2c` sem prever o que o Téo não sabia; `man_3` devolvendo pergunta e sem verniz; `man_circ_3` em toda noite e sem diagnóstico; `cracha_1`, `raio_3`, `hora_3`, `mancha_2`, `pose`, `eco_chave` dentro da regra de memória; "ontem" nas fichas e registros; `traj_3` com a chave de ligar; `loop_reset` com motivo; escada por volta nos dados; ensaio sem dizer qual valor errou; 82 frases de tranca sem contar a solução; sirene com origem (`sato_teo`); `c_modo_1` curto, base que apita em toda noite, `d_ord_1` com tranca, cenas `a_hist_2`, `b_hist_2`, `e_hist_1`; grupo da prova da cópia sem o cheiro e com `c_peca`; livro de visitas e listas sem nome; `lenz_mot_3` e `v5_lenz` com origem; `cracha_3` coerente com o bilhete; assinatura "— T."; um nome por sala; energia 5; papéis para 2, 3 e 4; papéis do Raio com os 3 números. Não achei nenhuma dessas pendências de volta.

## 3. Abaixo do mínimo — o que corrigir

**(a)** = texto ou dado, corrigível já. **(b)** = só muda com decisão de regra (ou de enredo já fixado) do autor. Palavras: contagem aproximada. Depois de mexer em `precisaDe`, rodar o validador de novo.

### 3.1 O oculto (8,5)

(a)
1. **`man_dois_1`** (manual escrito antes do acidente não pode saber que o museu volta). Texto: *Manual, página 6: "Dois defeitos na mesma noite: conserte um por volta. O primeiro fica gravado na Câmara (o que ela já guardou, ela não desfaz) e o aviso muda de lugar. Mudou, não sumiu. O segundo, em outra volta, libera o botão."* ~9 palavras trocadas.
2. **Entrada e ajuda** (individual.html, linhas 19 e 35; fora das pistas, mas é a primeira coisa que se lê). "Um raio. O tempo retorna." vira *"Cinco minutos. O museu recomeça. Você não."*; o título "Um raio. O tempo recomeça." vira *"Cinco minutos. Depois, tudo de novo."* ~12 palavras. Hoje a frase liga o reinício ao raio (DECISOES: "o reinício é às 5:00, não na queda de luz") e entrega de graça que o apagão é um raio (grupo `raio_e_apagao`).
3. **ROTEIRO §2, linha "Minutos antes de 0:00"**: vira *"Menos de um minuto antes de 0:00"*, e em "O que aconteceu com Téo", depois de "lembrou da frase da Dra. Sato": *"Às 4:10 ainda não tinham passado cinco minutos da queda."* ~16 palavras. Sem isso, "Só preciso de cinco minutos de volta" (`traj_3`) não alcança o empurrão nem na cabeça do Lenz.
4. **ROTEIRO §6-D**: "quando Lenz apertou o botão" vira *"quando Lenz virou a chave de ligar"*. 5 palavras.
5. **`ceu`** (volta 1 não pode falar "volta após volta"). Texto: *"O céu sobre o pátio está carregado. As nuvens giram devagar em cima do para-raios."* ~14 palavras.
6. **Cadeado da noite D** (`d_fus_2` prende a chave em DESLIGADO e nenhum passo do conserto abre o cadeado). Texto: *Pelo vidro do Quadro externo: na chave "Circuito da Câmara", um cadeado vermelho pendurado, aberto, só de aviso. A etiqueta do cadeado está molhada e a tinta escorreu.* ~28 palavras; ROTEIRO §6-D: "prendeu a chave … em DESLIGADO com um cadeado vermelho" vira *"pendurou na chave 'Circuito da Câmara' um cadeado vermelho, aberto, de aviso"*.

(b) Nenhum ponto de regra neste critério.

### 3.2 Estrutura (8,5)

(a)
1. **Objetivo na ajuda** (individual.html, linha 35): "consertar a máquina e descobrir quem trocou a peça" vira *"consertar a máquina e descobrir o que aconteceu nesta noite"*. ~10 palavras. A troca é a descoberta das voltas 1 e 2 ("Tem algo errado aqui" / "Não é só cheiro").
2. **Aba Revelar** (visível desde a volta 1). Título "Revelar quem trocou a peça" vira *"Revelar o que aconteceu"*; rótulos dos 3 grupos (`grupos_fonte.*.rotulo`): `prova_falsa` *"o que foi feito"*, `trajeto` *"por onde passou"*, `cracha` *"de quem era a mão"* (são as três perguntas que a própria aba usa na mensagem final). ~12 palavras.
3. **Missões** (LC_MISSOES): "Descubra por que a Ivone não pode ter trocado a peça." vira *"Descubra por que a tinta da Ivone não faz dela culpada."*; "Descubra onde a peça verdadeira está." vira *"Descubra o que tem na caixa que pesa demais."* ~20 palavras; atualizar a lista no ROTEIRO §6 e no LOOP-CENTRAL.
4. **Minijogo da caixa** (LC_MG, chave `c_esc_1`): hoje, na volta 1, "Abrir a caixa de banners… abra a tampa" e, no fim, "A chave está dentro da caixa.", enquanto `c_peca` diz que a caixa só abre na volta 2, com motivo. Passar a entrada de `c_esc_1` para `c_peca` e trocar a última mensagem por *"Debaixo da manta, uma coisa pesada."*; se a mensagem não puder ser trocada sem mexer no minijogo, apagar a entrada (1 linha).
5. **ROTEIRO §4, volta 2**: "O laudo do Aurélio aparece na Sala de conservação" vira *"Você acha o laudo do Aurélio na Sala de conservação"* (o museu não muda). 4 palavras.

(b)
6. **"Lenz" na volta 2** (`lenz_mot_2`). Foi decisão registrada, mas esvazia a virada da volta 3. Proposta pronta: `lenz_mot_2` termina em *"Quem assinou o recebimento: uma rubrica apressada, quase um risco."*; e `lenz_2` ganha o nome em cena, no fim: *O telefone dele toca. "Lenz. Agora não."* ~18 palavras. Se o autor mantiver como está, corrigir os documentos (3.5-3).
7. **`foto_solo` na volta 1** (prova da cópia por 3 de energia antes de "Não é só cheiro"): passar `volta_min` para 2, ou manter e assumir no roteiro (3.5-4).
8. **Pendrive sem fato novo** (`teo_radio`, volta 4: tudo o que o Téo diz já está em `data_2` e `data_3`). Se o autor quiser pagar a promessa com informação, uma frase que só ele sabe: *"Ontem ele me estendeu um envelope pra eu 'não ter carregado nada'. Eu não peguei."* ~15 palavras (mexe no enredo).

### 3.3 Rodízio e regras do culpado — causas A–E (8,5)

(a)
1. **`d_teo_1` e o par `fh_dobrada`** com a mesma tranca que `d_ord_1`/`fh_papel_teo` já usam: `d_teo_1` pede uma de `d_fus_1..4`; `fh_dobrada` pede uma de `fus_ok_1`, `fus_ok_2`, `fus_ok_4`. `porque` das duas: *"O diário tem meia dúzia de páginas dobradas. Você não sabe qual abrir."* ~13 palavras.
2. **`d_teo_2`** sem nomear o fusível. Texto: *Seu Dirceu conta: "Antes de escurecer o Téo passou de mão fechada, indo para a Galeria. Disse que ia guardar uma coisa onde ninguém olha: embaixo da estrela da festa."* ~30 palavras.
3. **`c_modo_2`** sem a frase que explica. Texto: *Uma anotação de ensaio da Dra. Sato: "Para a abertura ela fica presa à peça principal. Deixei armado ontem, não deu tempo de testar."* 9 palavras a menos (a explicação fica na página 4 do manual, como em `c_modo_1`).
4. **ROTEIRO §6-E** (hoje desmente a regra): "Os dois na mesma volta não funcionam." vira *"Em dupla, os dois na mesma volta não funcionam."*; "Sem dupla: o ajuste numa volta, eco e alavanca em outras." vira *"Sem dupla: o ajuste e o eco podem ficar gravados na mesma volta; a alavanca, em outra."* ~22 palavras.
5. Cadeado da noite D: ver 3.1-6.

(b)
6. C e D continuam com um sinal só delas e que se explica pelo manual (`sint_ancora`, `sint_fusivel`); A e B só se fecham por descarte. Com 1 a 3 feitos, a diferença fica pequena e aceitável; igualar de vez pediria regra nova.
7. Noite E: sem dupla os dois consertos cabem na mesma volta e em dupla não. Se for de propósito, fica; se não, é regra para rever.

### 3.4 Jogo limpo e dedução (8,0)

(a)
1. **Pares que mostram o defeito da noite e não contam** (o anexar responde "não é sinal da máquina nem leitura normal (história, manual ou ferramenta)"). Trocar por texto de fato neutro, ~20 palavras cada:
   - `fh_med_quadro` (B, C, E): *"O medidor do Quadro externo está com o vidro embaçado por dentro. Não dá para ler a linha que desce para o Subsolo."*
   - `fh_med_pot_bce` (B, C, E): *"O medidor de potência ao lado do quadro de energia está desligado. No vidro, um papel: 'aferir depois da festa'."*
   - `fh_status_c` (C): *"No painel de status da Oficina técnica, a linha da base da Galeria está coberta com fita crepe: 'sensor novo, ainda não ligado aqui'."*
   - `fh_painel_fus_d` (D): *"No painel de fusíveis da Oficina elétrica, a tampa da fileira da Câmara está parafusada. Daqui não dá para ver nada."*
   - `fh_pont_d` (D): *"O ponteiro de carga está atrás de uma etiqueta de papel: 'aferir'. Não dá para ler."*
   - `fh_cam_agulha_d` (D): *"Na câmera do Subsolo, um reflexo de lâmpada cai bem em cima da agulha de carga. Não dá para ler."*
   - `fh_folha_d` (D): *"Folha de conferência da Oficina elétrica, de hoje: só a linha da iluminação da fachada está preenchida. O resto ficou para amanhã."*
2. **Resposta do anexar para par** (loop-central.js, linha 184): quando a pista tem `parDe`, responder *"<rótulo>: está como sempre, mas não é leitura da máquina. NÃO CONTOU."* ~12 palavras. Hoje a mensagem chama de "história, manual ou ferramenta" uma lâmpada firme ou um metrônomo no compasso.
3. **`coop_catraca_ok`**: *"…O do patrocínio, não. Pela roleta ele não saiu. E alguém abriu a porta de serviço com o crachá do Braga."* **`catraca_solo`**: *"…O do patrocínio, não. Por onde ele saiu, a roleta não viu."* ~10 palavras cada. Entre 0:00 e 4:00 ele está fora do prédio (revisão 3).
4. **`tombo_1`** (livro de registro não fala em "verdadeira" na volta 1). Texto: *Livro de registro: "Peça principal. Número {reg}, gravado embaixo da base."* ~10 palavras.
5. **`coop_veredito`** (o nome precisa nascer da comparação). Final: *"…No livro de visitas, uma assinatura deita igual: a do patrocínio. Lado a lado com o bilhete, o risco vira letra: Lenz. O crachá era do Braga. A mão, não."* ~25 palavras.
6. **Minijogo da luz** (LC_MG, `falsa_1`, campo `achou`): fica *"O verniz brilha por igual, sem um risco."* (sai "Peça de 300 anos não brilha assim.", conclusão do narrador no minuto 0). 7 palavras a menos.
7. **`assim_leg` com dono** (hoje é uma legenda de perícia sem autor, e o Braga "não registrou"). Texto: *No mural da Área de descanso, uma legenda sem foto, com a letra do Seu Dirceu: "Quem sujou meu chão? Sola lisa, de couro, número 42. Não é bota da casa." Atrás: "foto no Quadro externo, no Pátio".* ~35 palavras.
8. Minijogo da caixa: ver 3.2-4.

(b)
9. **Pares que são leitura normal de verdade e não contam** (cerca de 18: `fh_zumbido_a`, `fh_consumo`, `fh_cam_most_bc`, `fh_bipes_bc`, `fh_lamp_*`, `fh_rel_*`, `fh_metronomo`, `fh_med_base`, `fh_cx_passagem`, `fh_varal`, `fh_vidro`, `fh_tampa`, `fh_med_pot_d`). A regra "par não tem grupo nem etiqueta" é decisão da revisão 3. Ou o autor dá grupo e etiqueta aos que são leitura de fato (e roda o validador, por causa das salas que fecham o diagnóstico sozinhas), ou fica só o item 2 acima.
10. **Etiqueta no caderno faz a triagem** (quem joga vê na hora o que é sinal e o que é coisa estranha; o carimbo "explicação inocente" quase nunca acontece para quem presta atenção). É decisão de interface; tirar a etiqueta do caderno e mostrar só no carimbo devolveria a dedução.
11. **Mesmo fato, dois pesos**: `cofre_ronda` (entrada no começo da noite) saiu do grupo do trajeto "porque não mostra a descida"; `assim_par` mostra a mesma entrada e conta. Escolher um critério só.
12. `foto_solo` na volta 1: ver 3.2-7.

### 3.5 Consistência do documento (8,0)

Tudo (a), salvo indicação.
1. ROTEIRO §6-D, botão x chave: ver 3.1-4. ROTEIRO §2, "minutos antes": ver 3.1-3.
2. ROTEIRO §6-E x `regras.dois_defeitos`: ver 3.3-4.
3. **O nome na volta 2** (se o autor não fizer 3.2-6): LOOP-CENTRAL, volta 1 e volta 2, "Não pode vazar: o nome" vira *"Não pode vazar: de quem era a mão no crachá (o sobrenome Lenz já está na carta da seguradora, volta 2)"*; DECISOES, tirar *"nem na 2"*; ROTEIRO §4, volta 3: "O nome só sai nesta volta" vira *"A mão no crachá só ganha dono nesta volta"*. ~35 palavras.
4. **ROTEIRO §4, volta 1** (se o autor não fizer 3.2-7), em "O que ainda não dá", acrescentar: *"Só quem compara a foto do catálogo sem ajuda sai daqui com a primeira prova, e paga caro por ela."* ~18 palavras.
5. **LOOP-CENTRAL, tabela de fontes**, linha "Foto e legenda, juntas": "volta 1" vira *"volta 2 (a segunda metade só chega por Passar pista, na pausa)"*. ~10 palavras.
6. **FICHAS, exceção do Nico**: *"Nico repete a mesma frase por jeito dele: já fala assim na primeira volta. Não é memória."* ~17 palavras.
7. **`eco_chave` sem `porque`** (a regra `escada` e o LOOP-CENTRAL dizem que toda pista com volta mínima maior que 1 tem). Texto: *"A chave do para-raios está aberta. Ninguém fechou no clarão ainda."* ~11 palavras.
8. **ROTEIRO §9**, item do trajeto: "(mostra o crachá em uso, não a descida)" fica desmentido pelo §10 (ninguém desce antes das 4:00); alinhar com a decisão de 3.4-11.
9. Seções antigas que ainda dizem "Missões secretas: 5" (DECISOES, "Regras e códigos"; LOOP-CENTRAL, "Registro de revisão"): acrescentar *"(hoje são 8)"*. 6 palavras.
10. Entrada x reinício (3.1-2); minijogo da caixa x `c_peca` (3.2-4); listas x pegadas (3.4-3).

### Polimento de prosa (passou; não é exigência)

`a_cheia_1` sem "Força não falta."; `d_fus_4` só com o estalo ("um estalo seco a cada tentativa da Câmara."); `empurra_1` sem "Ninguém da montagem trabalha de paletó."; `lenz_3` terminando em "a um braço de distância."; `braga_red`: *"Na folha do Braga, a lápis: 'crachá: ver depois'. Na foto 3x4 grampeada na folha, o crachá está preso no cinto."*

## 4. Antes | agora | motivo

| Critério | Antes (rodada 2) | Agora (rodada 3) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 8,0 | **9,0** | Revelar não desmente mais o lema; Desligar diz o que se perde, com texto por causa; Téo sem previsão. Fica só a escolha sem custo (decisão do autor). |
| O oculto | 7,5 | 8,5 | Objetos do museu não lembram mais; Dra. Sato pergunta; eco é da Câmara; botão com motivo. Ainda: manual que sabe das voltas do museu, entrada "Um raio", conta dos cinco minutos, cadeado solto. |
| Estrutura | 7,5 | 8,5 | Escada por volta nos dados, ensaio que não fecha, trancas sem solução, sirene com origem. Ainda: ajuda, aba Revelar, missões e minijogo da caixa adiantam a troca; nome na volta 2. |
| Rodízio (causas A–E) | 7,5 | 8,5 | Listas iguais (47 pares), base que apita em toda noite, cenas para A, B e E, final próprio por causa. Ainda: C e D explicadas por uma pista sem tranca. |
| Jogo limpo e dedução | 7,0 | 8,0 | Provas de verdade, nome fora da volta 1, peça verdadeira só da volta 2, origens plantadas. Ainda: pares que mostram o defeito e "não contam" (novo, veio com a revisão 3), conclusão errada nas listas, "verdadeira" no livro, nome sem origem no veredito. |
| Personagens e fichas | 8,5 | **9,0** | Sato e Téo sabem só o que podem; crachá com uma versão; fichas alinhadas. |
| Prosa | 7,5 | **8,5** | Narrador concluindo e ordens de jogo saíram das pistas apontadas; restam conclusões pequenas e isoladas. |
| Robustez por número de jogadores | 8,5 | **9,0** | Luva do armário conta, energia única, papéis para 2 a 5, Ouro validado com 1, 2 e 3 pessoas. |
| Consistência do documento | 7,0 | 8,0 | LOOP-CENTRAL recalculado dos dados, um nome por sala, ontem x hoje resolvido. Ainda: 6 frases em que roteiro, documentos, regra e telas se desmentem. |
| **Geral** | **7,7** | **8,6** | Nenhuma nota caiu. A única perda veio de correção técnica: os pares da revisão 3 criaram o item 3.4-1. |

## 5. Fim do ciclo

**Ainda não passou.** Faltam 0,5 (O oculto, Estrutura, Rodízio) e 1,0 (Jogo limpo, Consistência). As correções (a) somam cerca de 600 palavras e, a meu ver, bastam para os cinco critérios chegarem a 9,0 sem nenhuma decisão nova; as (b) (3.2-6 a 3.2-8, 3.3-6, 3.3-7, 3.4-9 a 3.4-12) são do autor. Depois de corrigir, reavaliar a seção 1 do zero antes de seguir para a seção 2.
