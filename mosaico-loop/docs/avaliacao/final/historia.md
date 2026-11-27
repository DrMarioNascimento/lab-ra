# Mosaico Loop v4 revisão 17 (lotes 14 e 15): escala da história (seção 1), rodada final, avaliada do zero

Avaliador independente. Não escrevi o texto, então não há desconto de autoavaliação. Não abri navegador e não mexi em nada do repositório.

**O que li inteiro:**
- ESCALAS_AVALIACAO_JOGOS.md;
- ROTEIRO-LOOP.md, partes 1 a 23;
- FICHAS.md;
- DECISOES-V4.md, revisões 16 e 17 (lotes 14 e 15);
- LOOP-CENTRAL.md: a revisão 17 e o checklist por volta;
- `pistas_legivel.txt` (v4 revisão 17).

**Diferença de dados, campo a campo:** comparei `dados/pistas-v4.json` com `pistas-v4.json_SUBSTITUIDO_2026-11-26f` (revisão 16). Mudaram:
- `traj_2`, `nico_0`, `empurra_2`, `man_3`, `coop_catraca_ok`, `catraca_solo`, `maq_ver`, `falsa_3`, `c_esc_3`, `coop_copia_ok`;
- tela A do Lado a Lado;
- `regras.achar`.

Nenhum `precisa`, `seg`, `soNaCausa`, `parDe` ou rótulo mudou.

**Código que conferi:**
- game.js: `PLANTA`, `ACHAR`, `revelarPontos`, `achouJa`, `marcarAchado`, `renderClues` (classe `on` = `wait <= 0 && !bloqueio`), `vagaDoPonto`, `PECA_PERTO`;
- `museu/pecas-compostas.mjs` (E02_B: gaveta "F2 · RESERVA", verso da ordem de serviço).

**Testes e capturas:**
- Rodei `caminho.mjs` (cópia em `final/`, saída em `final/caminho.txt`): TUDO CERTO.
- Li `r17/testes/achar.txt` e `/tmp/roda/r17/achar.mjs`.
- Vi `r17/folha_achar.png` (Oficina elétrica antes e depois de achar).
- Validador `r17/validar.txt`: APROVADO nas 5 causas, com 1, 2 e 3 pessoas. O bot fica em no máximo 0,10%.

## 1. Nota geral

**8,9 / 10. NÃO PASSOU.** A Consistência ficou em 8,5. A revisão 17 trouxe uma contradição nova de linha de visão, entre a fala nova do Seu Dirceu (`traj_2`) e a planta. Os outros critérios estão no mínimo ou acima. A Prosa subiu para 9,0.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | O enredo não mudou. "Era medo meu." (`aurelio_2`), "Devia ter perguntado por quê." (`ivone_2`), o Desligar com preço em cada noite e a pergunta do telão continuam de pé. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta fecha: queda uns 30 s antes de 0:00, chave às 4:10 (`traj_3`), 50 s para armar, disparo às 5:00. A Dra. Sato só comenta (`man_3` agora termina na fala dela). A foto ao contrário ficou só para a rachadura (ROTEIRO 21 e 22). |
| Estrutura | **9,0** | 9,0 | A escada de voltas segue igual, e nenhum `seg`, `volta` ou tranca mudou. Os títulos não adiantam virada. |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | Nenhum `soNaCausa`, `parDe` ou rótulo mudou. Os lugares dos pontos são iguais nas 5 causas (`achar.txt`). Ouro nas 5, e o bot fica em no máximo 0,10%. |
| Jogo limpo e dedução | **9,0** | 9,0 | O jogo limpo de texto não mudou: a caixa abre por banners, e a luz e a inscrição pedem o caderno. Com os pontos escondidos, todo fato essencial ainda tem fonte que não depende de hora marcada. Riscos menores em (b2) e (b3). |
| Personagens e fichas | **9,0** | 9,0 | As 8 fichas estão completas. O Nico fala "perto da cafeteira" e o Seu Dirceu fala curto, de esfregão na mão. A fala nova do Dirceu é coerente com a ficha ("Eu reparo"), mas é ela que cria o problema da Consistência. |
| **Prosa** | **9,0** | **8,0** | Saíram os três fechamentos de narrador (`empurra_2` termina em "descendo.", `man_3`, as Duas Listas), e `maq_ver` virou cena ("Você tenta os comandos. Nada se mexe."). |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem de 2 a 10 fontes, e o validador dá Ouro com 1, 2 e 3 pessoas. O tempo de procura não é simulado (b3). Com o toque que mira, cada lugar sai em 4 toques (20 nos dois piores, no Subsolo). |
| Consistência do documento | **8,5** | 9,0 | `traj_2` faz o Seu Dirceu ver o lado de dentro da Área de descanso desde o fim da tarde, e é por ali que o Lenz entrou e saiu da Sala das coleções. Ele não diz nada disso (a1). |

### O defeito (a1), conferido na planta

Grade do Térreo: `ele ate ate desc / tec col col desc / esc esc est desc / hall×4 / rec cen cen limp`.

**Por onde se entra e se sai da Área de descanso:**
- a porta de vidro do Ateliê (`ate`, lado r) e a porta da Sala das coleções (`col`, lado r) dão, as duas, para dentro da Área de descanso (`desc`);
- a Sala das coleções não tem outra saída;
- o Seu Dirceu (`limp`) só vê a Área de descanso pela porta dela para o corredor (`desc b`).

**O que cada pista diz:**
- `ivone_red`: "Pergunta ao Seu Dirceu quantas vezes eu passei por ela [a porta de vidro] desde o fim da tarde."
- `traj_2` (novo): "A Ivone, não: desde o fim da tarde, passou uma vez só, até a cafeteira e de volta."
- Para contar isso, ele tem de ver o lado de dentro da Área de descanso o tempo todo.

**O que ele teria visto, no mesmo período e no mesmo cômodo:**
- o Téo entrando na Sala das coleções;
- o Lenz chegando pela porta de serviço no começo da noite (ROTEIRO 2);
- o Lenz saindo da Sala das coleções uns 30 s antes de 0:00, pisando tinta, até a porta de serviço (pegadas: coleções → Área de descanso → porta de serviço).

**O que ele diz:** só "Passou um agora… Nem boa-noite", às 4:05, como novidade. A ficha dele diz que ele vê "quem passa com pressa" e nunca diria "Não reparei."

**Resultado.** A testemunha confirma o álibi da Ivone com uma vigilância que, se fosse verdade, faria dela testemunha do culpado. Quem pensa no caso pergunta: "então o Dirceu viu quem saiu da Sala das coleções?". O jogo não responde. A pista é do grupo `trajeto` e entra na prova do Revelar.

### Pedido de conferência desta rodada

| Ponto | Resultado |
|---|---|
| Contradições entre dados, telas, planta, peças 3D e os 4 documentos | **Uma que derruba nota:** a1 (`traj_2` × planta). Menores: b1 (verso da ordem de serviço na E02_B, noite E) e b4 (ROTEIRO 3, a lista). A gaveta "F2 · RESERVA" da E02_B bate com `d_f2_2`. Fica igual nas 5 noites e não entrega a causa. |
| Pista forte cedo demais | Nenhuma nova. Os pontos escondidos não mudam `volta` nem `seg`. Os pontos travados nem aparecem antes da hora. |
| Fato essencial sem fonte | Nenhum. `regras.achar` não tira nenhuma fonte. O livro (virar a folha) e o gravador (faixa depois de achar) continuam com acesso. |
| Narrador concluindo | Saíram os três que restavam. Não achei novo. |
| Achar antes de examinar: fato essencial difícil demais ou impossível sozinho | **Não fica impossível.** Todo lugar foi achado só com toque e "+", nas 15 salas, em 390 e 360. O que se acha numa volta fica achado nas seguintes. Os pontos ficam em cima do objeto que a pista cita (folha_achar: lâmpadas, painel, fita, folha). **Dois pontos frágeis, nenhum essencial:** (b2) as cenas das 4:00 às 4:10 não dão nenhum aviso e só se acham por acaso; (b3) os textos "porque" das trancas nunca mais aparecem. Os fatos dessas cenas (trajeto, nome) têm fontes fora do horário: roleta, pegadas, cofre, Acusação e Defesa, Braga. |

## 3. Abaixo do mínimo

**Consistência do documento (8,5; mínimo 9,0).**

### (a) Obrigatórias

1. **`traj_2`: tirar do Seu Dirceu a vigilância que ele não pode ter.**
   - **O que fazer.** Limitar o que ele viu da Ivone e dar um motivo de mundo para ele não ter visto o resto da noite antes de 0:00. A fala dela (`ivone_red`) continua sendo respondida.
   - **Texto proposto** (troca só a segunda metade de `traj_2`; cerca de 25 palavras):
     > Seu Dirceu aponta com o esfregão: "Passou um agora, de sapato social, com pressa, rumo à escada do Subsolo. Nem boa-noite. A Ivone? No fim da tarde, uma vez só: foi até a cafeteira e voltou. Depois eu fui passar pano na Recepção, um tempão."
   - **Documentos para acompanhar a troca** (cerca de 10 palavras em cada):
     - ROTEIRO 22: "Seu Dirceu responde à Ivone";
     - DECISOES 17: "Retoques de baixo risco";
     - FICHAS, linha da revisão 17.
   - **Por que basta.**
     - O Lenz entra no começo da noite e sai antes de 0:00, enquanto o Dirceu estava na Recepção. A Recepção fica do outro lado do corredor e não vê a Área de descanso.
     - Às 4:05 ele está de volta à Base, como o roteiro pede ("fica sempre na Base" vale para os 5 minutos da volta).
     - O álibi da Ivone não muda: as fontes continuam `ivone_ali_1` e `ivone_ali_2`, e a missão fecha com `ivone_red` + `ivone_1x`/`dis_cafeira`.
   - **Outra saída** (se o autor preferir): deixar `traj_2` como era na revisão 16, sem a frase da Ivone, e tirar de `ivone_red` o "Pergunta ao Seu Dirceu…". O texto dela ficaria: "Você fala da mancha. Ivone aponta a porta de vidro sem olhar: "Desde o fim da tarde passei por ela uma vez: fui colar um bilhete na cafeteira e voltei. O pote saiu daqui. Eu, não."" (cerca de 8 palavras).

### (b) Retoques opcionais (não seguram nota sozinhos)

1. **Verso da ordem de serviço na E02_B (noite E).**
   - **O que a peça mostra.** A parte de cima está dobrada e mostra o verso em todas as noites: mancha de graxa e um número riscado (`texVerso`, "55 3 1·4…").
   - **Onde não bate.** Nas noites A a D isso bate com `fh_verso_*` ("só uma mancha de graxa e um número de telefone riscado"). Na noite E, `e_hist_1` diz que o verso tem "a letra da Dra. Sato", e a peça mostra o telefone. Além disso, os algarismos à vista podem ser lidos como código.
   - **Saída.** Na textura, deixar só a mancha de graxa na dobra, sem algarismos. Ou, em `e_hist_1`: "No verso da ordem de serviço, embaixo da dobra, a letra da Dra. Sato: …" (2 palavras). Nos dois casos, a peça continua igual nas 5 noites.
2. **Cenas das 4:00 às 4:10 sem aviso** (`traj_1`, `lenz_0`, `traj_2`, `traj_3`, `lenz_1`, `lenz_2`).
   - **O problema.** Antes da hora, o ponto não existe (`on` falso) e a lista não mostra nada. Depois da hora, só aparece para quem procura naquele lugar. "Alguém de paletó passa por você" vira um detalhe escondido que se acha por acaso. Nenhum fato essencial depende só disso.
   - **Saída** (sem dar hora de graça): uma linha de clima na faixa da sala, igual à do alarme das 2:40, só na sala onde a cena acontece e só enquanto ela dura.
     - Área de descanso, das 4:00 às 4:05: "A porta de serviço apita e range."
     - Base da limpeza, das 4:05 às 4:10: "O Seu Dirceu bate o cabo do esfregão no balde."
     - Subsolo, a partir de 4:10: "Passos descem a escada."
3. **Os textos "porque" das trancas ficaram mudos.**
   - **O problema.** Com `LC_ACHAR`, ponto travado não se acha (`on` exige `!bl`), e o botão só aparece depois de achado. Frases como "Sem papel na frente dela, ela não comenta." (`ivone_2`) ou "Você ainda não pensou em descolar." nunca mais aparecem. A regra "mostrar muda a fala" continua no manual e no roteiro, então não é falta de jogo limpo. Mas ficou mais difícil saber que vale voltar a uma sala.
   - **Saída** (escolha do autor): deixar achar o ponto travado e, ao tocar, mostrar o "porque". Assim o lugar fica lembrado e a tranca ensina.
4. **ROTEIRO 3, "O que a lista de cada sala mostra".**
   - **O problema.** O texto diz "Os mesmos rótulos em qualquer noite… só 'ainda não'". Com os pontos escondidos, a lista começa vazia e "ainda não" não aparece mais.
   - **Texto proposto:** "A lista mostra só o que você achou. Os rótulos e os lugares são os mesmos em qualquer noite; onde o sinal de um defeito não existe, o mesmo lugar mostra a coisa normal." (cerca de 30 palavras).
5. **"Laudo do curador" × "Curador da sala".**
   - **O problema.** Em sala, quem conduz se chama Curador. A prévia de `falsa_2` e o "porque" ("Na mesa do curador") podem confundir.
   - **Texto proposto:** "Laudo do Aurélio" e "Na mesa do Aurélio".
   - **Atenção.** A prévia decide o lugar do ponto (`vagaDoPonto` usa o rótulo): trocar a prévia muda o ponto de lugar na Sala de conservação. Se trocar, rode `achar.mjs conservacao` de novo. Ou troque só o "porque".
6. **Antigos, sem mudança:**
   - F2 em dois lugares na noite D (`d_fus_1` × ROTEIRO 6 D);
   - "perto das 4:00" para a fala do Lenz (LOOP-CENTRAL 61 e 147, DECISOES 22), quando a cena é às 4:02.

### Decisões de regra do autor ("Ficou para decidir"; nenhuma baixa nota)

As mesmas de antes. E as do lote 15: os limites de `ACHAR` e o toque que mira e aproxima. A investigação com pontos escondidos é decisão do autor: aqui só conferi se dá para achar e se é justo (dá, com os riscos b2 e b3).

## 4. Antes | agora | motivo

| Critério | Antes (rodada 17, rev. 16) | Agora (rev. 17, lotes 14 e 15) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança de enredo. |
| O oculto | 9,0 | **9,0** | Saiu o menor da foto × inscrição. |
| Estrutura | 9,0 | **9,0** | Nenhuma volta, tranca ou horário mudou. |
| Rodízio (causas A–E) | 9,0 | **9,0** | Os lugares dos pontos são iguais nas 5 causas. Validador: Ouro nas 5. |
| Jogo limpo e dedução | 9,0 | **9,0** | Os pontos escondidos não tiram fonte essencial. Entraram os riscos b2 e b3. |
| Personagens e fichas | 9,0 | **9,0** | Saiu a "copa" do Nico. A fala do Dirceu está na voz dele. |
| Prosa | 8,5 | **9,0** | **Subiu:** saíram os três fechamentos de narrador, e `maq_ver` virou cena. |
| Robustez por número de jogadores | 9,0 | **9,0** | Validador APROVADO. Todo lugar se acha só com toque. |
| Consistência do documento | 9,0 | **8,5** | **Caiu:** a fala nova de `traj_2` contradiz a linha de visão da planta (a1). Saíram os menores da chuva, da "copa" e da foto espelhada. |
| **Geral** | **8,9** (passou) | **8,9** (**não passou**) | Um retoque de texto (`traj_2`) derrubou a Consistência. |

## 5. Fim do ciclo

**A escala da história (seção 1) não passou:** a Consistência ficou em 8,5. Basta a obrigatória (a1), uma troca de cerca de 25 palavras em `traj_2` e 3 notas de documento, para voltar a 9,0 sem mexer em regra, tranca, fonte ou rótulo. Os retoques (b) são opcionais.
