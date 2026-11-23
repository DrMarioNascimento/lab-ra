# Loop — Furos da simulação 1 (10 grupos)

Fontes: relatórios g01-g10, estados salvos em `sim/estados`, `v1_pistas.json` (109 pistas, 7 atividades) e os dois motores (`engine_v1.py` e `engine.py`). Nada foi alterado.

## 1. Tabela

| Grupo | Perfil | Causa | Final | Diagnóstico fechado | Cargas úteis x inúteis |
|---|---|---|---|---|---|
| g01 | dupla metódica | B | Parcial | V1 (aposta V3) | ~28 x ~13 |
| g02 | trio disperso | B | Parcial | V1-V2 (aposta V2) | ~40 x ~20 |
| g03 | apressados | B | Parcial | V1 (aposta V1) | ~45 x ~30 |
| g04 | solo | B | Parcial | V1 (aposta V4) | ~23 x ~7 |
| g05 | quarteto | A | Revelar | V2 (aposta V4) | ~62 x ~38 |
| g06 | solo + dupla | B | Parcial | V1 (firme V3, aposta V4) | ~34 x ~24 |
| g07 | trapaceiros | B | Parcial | V2 (chutou A na V1) | ~50 x ~20 |
| g08 | três solos | A | Parcial | V2 (aposta V4) | ~38 x ~28 |
| g09 | detetives | A | Revelar | V2 (aposta V4) | ~30 x ~45 |
| g10 | caóticos | B | Revelar | V1-V3 (aposta V3) | ~48 x ~40 |

Resumo: 10/10 acertaram a causa e o nome. 0/10 consertaram. 3 Revelar, 7 Parcial, 0 Desligar, 0 Ouro. Desperdício médio de cargas: ~37%.

## 2. Furos da história e dos dados (por gravidade)

**H1. O conserto da causa B não existe (7/7 grupos B).**
Sintoma: "Falta a pista de entrada" no `coop_raio` nas voltas 4 e 5. Causa-raiz: `entrada: "diagnostico_anexado"` não é pista, e não há comando de anexar. Conferi todos os ids do JSON: é o **único id inexistente** (todo `precisaDe`, `destrava`, `explica`, `quemPodeVer`, `produz` e fontes de `grupos_fonte` existem). Correção: trocar a entrada por regra calculada (2 que apontam + 1 que descarta + os 4 grupos de `exige`) e mostrar a lista do que falta.

**H2. O conserto da causa A não existe (3/3 grupos A).**
Sintoma: g08 achou 14 / 1:10 / 472 e "ninguém tinha como digitar"; g05 e g09 fizeram `coop_painel_manual` na V5 e não contou. Causa-raiz: `final_desligar` só aceita `coop_raio` (que é `soNaCausa B`); `coop_painel_A` é só leitura de diagnóstico; não há produto nem entrada dos 3 valores. Alcançável a tempo? **Não na V1.** A entrada (`man_1`) só nasce na V3 e só no ateliê; na prática os dois grupos A com coop só entraram na V5, então nem o ensaio da V4 aconteceu. Correção: criar a atividade `coop_calibrar` (protótipo + ateliê, V4 ensaio, V5 vale) que recebe os 3 valores e produz `conserto_A`; incluir em `final_desligar`; `man_1` desde a V2.

**H3. Solo sem conserto e sem Revelar (g04, g08, solo do g06).**
`saida_solo` (eco, luvas, "livro numa volta e catraca na outra") é só texto. `par_catraca`, `par_foto`, `par_tinta` ficam em "falta comparar" para sempre. Correção: criar pistas de fechamento solo (ex.: `catraca_solo` na segurança, `precisaDe: par_catraca + cracha_4`, volta seguinte) e o eco como ação real.

**H4. Trajeto só sai por coop (7/10 sem trajeto).**
`traj_1/2/3` exigem 240-250 s. Ninguém coletou nenhuma (0/10): as cargas acabam por volta dos 100-150 s. Os 3 Revelar vieram de `coop_entrou_nao_saiu` ou das pegadas. Correção: uma fonte de trajeto sem relógio (ex.: `traj_4` no corredor, marca de sapato social na porta de serviço, `precisaDe: cracha_1`) e aviso "volte depois dos 4:00" nas outras.

**H5. Hora do apagão escondida atrás do tempo (5/10 nunca acharam; só 2 dos 7 grupos B).**
As 4 fontes de `hora_apagao` têm `segundo_min` 71 a 80 e a sala diz "Nada novo" antes. Mesmo com H1 consertado, 5 dos 7 grupos B ficariam barrados no `exige`. A regra de beco 5 não olha trava de tempo. Correção: `hora_5` sem tempo (ex.: registro impresso do gerador na manutenção: "entrou 1:13, queda 1:10") e placa "os relógios param depois do apagão".

**H6. Painel e Manual aceita só `man_1` (g06, g08, g10 tinham manual, mas não esse).**
`coop_painel_A/B` aceitam `umaDe man_1/2/3`, mas a entrada e a `man_legenda` (`portador_man_1`) exigem `man_1`. Correção: entrada = qualquer fonte do grupo `manual`; legenda para portador de qualquer uma. Arrumar também `man_1.destrava` (lista `man_legenda`, `man_cal_1`, `man_pot_1`, que não têm `precisaDe` de volta).

**H7. Chavinha e cadeado não abrem nada (g04, g10, g01).**
`quadro_0` não tem `precisaDe`; `acesso_1/2/3` não destravam nada. Correção: criar `quadro_aberto` na elétrica (`precisaDe umaDe acesso_*`) mostrando a chave 3 por dentro; sem ela, `chave_3` só pelo vidro.

**H8. Diagnóstico fácil demais (10/10 certos, 7 já na V1).**
Protótipo + elétrica na V1 dão sintoma e dois descartes; `man_3` (Dra. Sato, V2, 1 carga) entrega a tabela inteira. Sem "anexar", apostar é de graça. Correção: `man_3` só responde ao sintoma que você já tem no caderno; `livre_1` e `fus_ok_2` saem das duas salas da máquina/quadro.

**H9. Ruído caro (10/10; 30% a 60% das cargas).**
20 das 109 pistas são falsas honestas ou suas explicações, quase todas com cara de causa D, que nem está jogável. Correção: explicação (`*x`) a 0 carga e na mesma sala; cortar `fh_gaveta`, `fh_fio`, `fh_digitais` enquanto D não existir; prévia sem truncar.

**H10. Atividades mortas.**
`coop_acusacao_defesa`: 0/10 fizeram, e `coop_veredito` não tem `grupoFonte` (não vale nada no final). `coop_correio`: 0/10; só g07 achou `iso_1` (73 s) e a `condicao` do chão é texto solto. Correção: `coop_veredito` vira fonte de `cracha`; criar ação "deixar no chão".

**H11. Relógios que se contradizem.**
"1:10", "o raio cai em 3:50" (contagem regressiva), "crachá às 4:00" e "entrou 21h" misturam três relógios. g02 e g05 leram "raio às 3:50"; g04 leu "4h". Correção: um padrão só (minuto da volta) e a contagem regressiva com a conversão escrita.

**H12. Na causa A sobram sinais de B sem explicação (g08, g09).**
Cabo do para-raios e chave 3 aberta existem iguais em A. Correção: `a_falsa_2x` na manutenção: "chave 3 fica aberta sempre; só fecha em teste".

**H13. Salas mortas.** `cera` só tem `pose` (clima, V2, 75 s); `sons` fica vazia até 30 s. Marcar "em reforma" ou dar 1 pista de decisão.

## 3. Furos do motor (não são da história)

1. Índice do `olhar` mudava a cada coleta (10/10). **Já corrigido** no `engine.py` atual (número fixo).
2. "J1" dava traceback. **Já corrigido** (`N()`).
3. `final` repetível, descobrindo o culpado por tentativa (g07). **Já corrigido.**
4. Aposta com texto inválido aceita. **Já corrigido.** Trocar a aposta na mesma volta continua livre.
5. `final` na volta 1 liberado; o ensaio da V4 não devolve resposta (g04, g08).
6. `coop` confere posição antes da entrada e entrega ids e salas de graça (g05, g06, g07).
7. "Anexar 3 provas" (regra 5.1), `exige` do raio e janela de 66-74 s não estão no código.
8. Revelar não exige estar na recepção nem prova no caderno de quem apresenta.
9. `trocar` funciona fora da pausa (g06) e sem limite de 1 por pausa.
10. Pista repetida entre jogadores cobra carga sem aviso "o grupo já tem".
11. Andar em círculo queima o relógio sem custo (g07, g09): falta o comando "esperar".
12. Sem papel de Central, sem eco, sem objeto de chão, sem dica do Mestre.

## 4. Pontos fortes (não mexer)

- **Tabela da Dra. Sato / manual**: "aha" citado por 9 grupos.
- **Dedução por descarte** ("modo livre" tira C, fusíveis inteiros tiram D): funcionou nos 10.
- **Entrou, mas não saiu**: 3 usos, 3 sucessos, sempre elogiado.
- **Original e Cópia** (g05) e **Painel e Manual** como confirmação (g01, g03, g05, g09).
- **Corrente do culpado**: crachá do Braga → emprestado → bilhete do Lenz; a tinta da Ivone como pista plantada. 10/10 nomearam Lenz com argumento.
- **Receita "dia, hora, tombo"**: os números como fatos da história (g02, g08, g09).
- **Falsa honesta com etiqueta que desmente** (Café, relógio adiantado): a ideia agrada; o problema é só o preço.
- **Cabo do para-raios + "pico forte" + clarão no vídeo** (g04).
- 3 fontes em 3 salas: ninguém travou no diagnóstico.

## 5. Doze correções para a V2 (em ordem)

1. Entrada do `coop_raio` por regra calculada, com lista do que falta (H1).
2. Criar `coop_calibrar` + `conserto_A` e pôr em `final_desligar` (H2).
3. Conserto solo de verdade: eco na V4, ação na V5, para A e para B (H3).
4. Fonte de `hora_apagao` sem trava de tempo + placa de aviso (H5).
5. Fonte de `trajeto` sem relógio e fechamento solo dos `par_*` (H3, H4).
6. `man_1` desde a V2; Painel e Manual aceita qualquer manual (H2, H6).
7. Toda recusa diz o motivo e onde procurar ("falta: hora do apagão; tente relógios") (regra 8).
8. Chavinha abre o quadro (`quadro_aberto`) (H7).
9. Explicações `*x` a 0 carga; cortar iscas de D; prévia inteira; marca "o grupo já tem" (H9).
10. Motor: anexar 3 provas, resposta do ensaio na V4, aposta única por volta, `esperar`.
11. `coop_veredito` vale como prova; ação de chão para o Correio (H10).
12. Um relógio só nos textos; validador passa a checar entradas de atividade, travas de tempo e existência de conserto por causa (H11).

**Cinco perguntas sem evidência**
1. Com a entrada consertada, a janela de 8 s do Raio é acertável na primeira tentativa?
2. Os valores de A no caderno de pessoas diferentes viram conversa ou viram gasto com `trocar`?
3. Solo com 6 cargas fecha o conserto em 5 voltas? Hoje não dá para medir.
4. As causas C, D e E mantêm a dedução por descarte ou a tabela resolve tudo de novo?
5. Endurecer o diagnóstico (H8) derruba os dispersos e caóticos abaixo de 55%?

## 6. Critérios de aprovação

| Critério | Veredito | Evidência |
|---|---|---|
| (a) Toda causa descoberta por algum perfil | **Passou para A e B; inconclusivo para C, D, E** | A: 3/3, B: 7/7. C, D, E não têm pistas nem foram sorteadas. |
| (b) Nenhuma pista essencial invisível | **Falhou** | `diagnostico_anexado` não existe; `hora_apagao` sumida para 5/10; `traj_*` 0/10. |
| (c) Ninguém ocioso mais de 1 volta no coop | **Falhou** | g03 J3 parado em V1 e V3; g05 J1 "várias voltas"; g01 e g10 sem coop nas V1-V2; Central não existe no motor. |
| (d) 2+ caminhos por porta | **Falhou** | Causa, cópia e nome: 2+ caminhos. Trajeto: só coop na prática. Conserto A e B: zero caminhos. Solo: zero. |
| (e) Resolução na volta 5 entre 55% e 85% | **Falhou** | Conserto: 0%. Revelar: 30%. Causa + nome: 100%. Nenhuma leitura cai na faixa. |

A V1 não passa. Os dois bloqueios (H1 e H2) são de dados, não de ideia: a história segura, o conserto é que não foi escrito.
