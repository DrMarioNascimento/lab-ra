# Loop — Versão 2 dos dados (depois da simulação 1)

Arquivos: `v2_pistas.json` (118 pistas, 103 ativas em cada causa, 8 atividades, 15 salas abertas + 1 em reforma), `sim/engine.py` (motor v2; a cópia anterior ficou em `sim/engine_v1c.py`), `sim/validar.py` (validador) e `build/build_v2.py` (gera o JSON a partir da V1). Nada do repositório foi tocado.

## 1. Decisões do autor aplicadas

- **Subsolo.** A máquina e o botão "Loop Reset" ficam no **Subsolo · Câmara do tempo** (id `prototipo`). Todo texto que dizia "Galeria do tempo" mudou.
- **Quadro fora do prédio.** O Quadro externo e o para-raios ficam no **Pátio** (`patio`): cabo, chave 3, cadeado, disjuntor do café, medidor de carga.
- **Oficina elétrica** (`eletrica`): ferramentas, luvas (`iso_2`), chavinha reserva (`acesso_3`), fita do gerador (`hora_5`), folha dos fusíveis.
- **O Raio** (`coop_raio`) passou a ser Subsolo (alavanca + relógio) e Pátio (chave 3, na chuva, sem relógio).
- **Solo e dupla juntos.** Toda tranca tem chave `solo` e chave `dupla` com custo; 7 das 9 têm também `troca_dossie`.
- **Nada depende de uma pessoa.** As entradas olham o dossiê do grupo. Só duas coisas pedem o próprio caderno: Revelar (de quem apresenta, qualquer pessoa) e calibrar sem dupla.
- **Um relógio só.** Tudo em minuto da volta. Saíram "21h" e a contagem regressiva "3:50" (virou "o raio cai quando ele marca 1:10").
- **C, D e E não foram ligadas.** Ficam em `causas_em_projeto`. A tabela do manual continua citando os 4 defeitos, para a dedução por descarte.

## 2. As 12 correções

1. **Entrada calculada do conserto.** `diagnostico_anexado` agora é **estado do grupo**, não pista (explicado em `regras` e em `estados_do_grupo`). Nasce com `anexar <causa> <3 pistas>` ou ao concluir Painel e Manual. Toda atividade tem `entrada: {estado, grupos, pistas}`; a recusa lista o que falta e uma sala para tentar.
2. **Conserto da causa A.** Nova atividade `coop_calibrar` ("Três Números"): um gira os mostradores no Subsolo, outro dita no Ateliê. Recebe dia, hora e tombo, dá `coop_calibrar_ensaio` na volta 4 e `conserto_A` na volta 5. `final_desligar` tem `conserto_por_causa` para A e para B.
3. **Conserto solo de verdade.** B: **eco** (grava a chave 3 no Pátio da volta 3 em diante, 2 cargas; baixa a alavanca no Subsolo em outra volta, 2 cargas). A: comando solo no Subsolo, 3 cargas, 2 minutos, com manual, receita e os 3 valores no próprio caderno.
4. **Hora do apagão sem trava.** `hora_5`: a fita de papel do gerador "não volta com o museu" e repete "queda 1:10 · gerador 1:13". Mais a plaquinha grátis `hora_aviso` na Sala dos relógios.
5. **Trajeto sem relógio e fechamento solo dos pares.** `traj_4` (marca de sapato social na porta de serviço, pede `cracha_1`), `catraca_solo`, `foto_solo`, `pegadas_solo` (2 cargas cada). `traj_aviso` grátis avisa do minuto 4:00.
6. **Manual.** `man_1`, `man_cal_1` e `man_pot_1` desde a volta 2. Painel e Manual aceita qualquer fonte do grupo `manual`; a legenda aparece para quem tem qualquer uma. `destrava` foi recalculado a partir de `precisaDe` (sem ponta solta).
7. **Recusa com motivo.** No motor: "Falta ao grupo: hora do apagão (tente Oficina elétrica)".
8. **Chavinha abre o quadro.** `quadro_aberto` (Pátio, pede uma `acesso_*`) mostra a chave 3 por dentro e vale como fonte de `chave_certa`. Sem chavinha, `chave_3` só pelo vidro.
9. **Ruído mais barato.** Explicações das falsas honestas custam 0 e estão na mesma sala da falsa. Cortadas `fh_gaveta`, `fh_fio`, `fh_digitais` e suas explicações. Toda pista tem `previa` (rótulo inteiro, que não entrega o conteúdo). Nova `a_falsa_2x` na causa A: "chave 3 fica aberta sempre; só fecha em teste".
10. **Motor.** Anexar, ensaio da volta 4 ("A MÁQUINA REAGE" / "NÃO REAGE", com quantos mostradores acertaram), aposta única por volta, `esperar`, `deixar`, `revelar`, `atividades`.
11. **Atividades mortas.** `coop_veredito` virou fonte de `cracha` (a atividade lê o bilhete; só pede `cracha_1`). Correio do Loop virou ação de chão: `iso_1` (manopla) vai para a mão, `deixar` no Pátio, e na volta seguinte `chao_manopla` custa 0 para qualquer pessoa.
12. **Validador** confere ids, entradas, travas de tempo e conserto por causa.

**Diagnóstico endurecido.** `man_3` (Dra. Sato no interfone) só aparece para quem tem um sintoma no próprio caderno e só comenta esse sintoma (campo `textoPorSintoma`). `livre_1` foi para a Sala de conservação; `fus_ok_2` ficou na Oficina elétrica, que não é mais a sala do quadro. `raio_*` e `man_pot_1` deixaram de "apontar B" (o raio cai em toda noite). Anexar pede **exatamente 3 pistas**: 2 sinais de grupos diferentes + 1 que descarta outra causa; falsa honesta não conta. Se as 3 não provam, a tentativa da volta é gasta. Nenhuma sala fecha o diagnóstico sozinha (o validador confere). Painel e Manual ficou na volta 3.

**Salas mortas.** `cera` virou "Sala das esculturas (em reforma)", fora da lista; a escultura que muda de pose é vista do corredor. `sons` tem pista desde o segundo 0.

**Pontos fortes mantidos sem mexer:** tabela do manual (`man_1`, `man_2`), descarte por modo livre e fusíveis inteiros, Entrou mas não saiu, Original e Cópia, corrente crachá do Braga → emprestado → bilhete do Lenz, tinta da Ivone, receita dia/hora/tombo, cabo do para-raios + clarão.

## 3. Motor v2 (o que mudou para quem joga)

- `LOOP_DATA` escolhe o arquivo (padrão `v2_pistas.json`); `LOOP_ESTADOS` a pasta (padrão `sim/estados_v2`, para não pisar nos estados da rodada 1).
- `anexar`: da volta 2 em diante, uma tentativa por volta. `apostar` é só o palpite do telão, um por volta.
- `coop`: confere a entrada **antes** da posição e não entrega sala nem id de graça. O Raio exige os dois no lugar entre 1:06 e 1:14 (cedo: `esperar`; tarde: só na próxima volta). Máximo de 2 atividades em dupla por pessoa por volta.
- Volta 4 = ensaio; volta 5 = vale. `final` só existe na volta 5.
- `trocar`: só na pausa (acaba quando alguém se mexe), 1 pista recebida por pessoa.
- `revelar <grupo> <jogador> <nome>`: volta 5, na Recepção, antes de 5:00, 3 provas no caderno de quem apresenta, uma tentativa por grupo.
- `atividades` mostra só nome nas apagadas (inclusive as da outra causa, para não entregar o defeito).

## 4. Resultado do validador

| Causa | Ótimo solo | Ótimo dupla | Bot aleatório (2000) |
|---|---|---|---|
| A_calibrar | Ouro; diagnóstico V2, ensaio V4, conserto V5; 17 de 30 cargas | Ouro; 14 de 50 cargas | 0,00% de Ouro/Desligar |
| B_potencia | Ouro; eco V3, ensaio V4, conserto V5; 16 de 30 cargas | Ouro; 14 de 50 cargas | 0,55% de Ouro/Desligar |

Ids: todos existem. Entradas: todas alcançáveis. Os 9 caminhos de atividade por causa (dupla e solo) rodam no motor. Essenciais sem 2 caminhos: nenhuma. O JSON passou na primeira rodada completa; os ajustes depois dela foram de rigor (ver seção 5), não de bloqueio.

## 5. O que o validador mostrou e ainda preocupa

1. **Sobra carga.** O plano certo usa 28% a 57% do orçamento. Simulei o mesmo plano jogando fora 37% e 50% das cargas: Ouro em 99% a 100% das partidas. Ou seja, **carga não é mais o gargalo; o gargalo é saber o que procurar**. A faixa de 55% a 85% de resolução só dá para medir com a rodada 2 de grupos.
2. **Painel e Manual é um atalho sem raciocínio.** Nos bots aleatórios, quase todo diagnóstico anexado (cerca de 20% das partidas) veio dessa atividade, não do anexar. O bot conhece as salas, o aluno não, mas vale decidir: a leitura do painel anexa sozinha, ou só entrega as 3 pistas para o grupo anexar?
3. **Bot em B chega a 0,55% de Desligar** porque o conserto de B pede 4 informações que um grupo de 4 junta sem querer. Está abaixo de 2%, mas é a causa mais "chutável".
4. **Ótimo fica pronto na volta 2** e a volta 3 sobra. Para grupo forte, pode faltar o que fazer na volta 3.
5. **Texto de `hora_5` e `raio_3`** apoia-se na ideia de que papel impresso atravessa o reinício. É coerente com "o chão guarda", mas é regra nova de mundo: precisa de confirmação.
6. **Nomes de sala** em `salas_nomes` (Sala de conservação, Sala das coleções, Sala dos sons) são provisórios: não conferi com o jogo real.
7. **`sim/regras_jogador.md` é da rodada 1.** Para a rodada 2 precisa citar os comandos novos (`esperar`, `anexar`, `deixar`, `revelar`, `atividades`, `solo`) e o Subsolo.

## 6. Ficou de fora

- Causas C, D e E (sem pistas próprias).
- Papel de Central no motor (está só nos textos das atividades).
- Dica dirigida por pessoa; hoje a dica é uma por grupo por volta, da volta 3 em diante.
- Janela de 8 s do Raio em tempo real: o motor trata como "estar no lugar entre 66 e 74 s", não mede reflexo.
