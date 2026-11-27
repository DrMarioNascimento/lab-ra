# Mosaico Loop v4 revisão 16: escala da história (seção 1), avaliada do zero

Avaliador independente. Não escrevi o texto, então não há desconto de autoavaliação. Não abri navegador: usei código, dados e capturas que já existiam. Nada do repositório foi tocado.

**O que li inteiro:**
- ESCALAS_AVALIACAO_JOGOS.md;
- ROTEIRO-LOOP.md, partes 1 a 21;
- FICHAS.md;
- DECISOES-V4.md, revisões 12 a 16;
- LOOP-CENTRAL.md: cabeçalho, revisão 16 e checklist;
- as 281 pistas de `pistas_legivel.txt`. Foi gerado às 19:13 de `dados/pistas-v4.json` ("v4 revisão 16"). O JSON tem os mesmos bytes de `/tmp/roda/v4_pistas.json`, que o validador usou (conferi com `cmp`);
- de `atividades.txt`: `regras`, `linha_do_tempo_s`, `salas_em_reforma`, `salas_nomes` e as `telaPapel`.

**Código que conferi:**
- game.js: `PLANTA` (todas as portas do Térreo, uma por uma), `PLANTA_AREA` e `LOOP_DESC`;
- loop-central.js: `LC_MG`, `LC_MG_ERRO`, `LC_MGA`, `LC_PV_IC` e `LC_FATO_CURTO`;
- ritmo.js: `LOOP_LINHA`;
- museu/icones/ui/glifos.svg: o desenho dos 12 símbolos.

**Capturas que vi:**
- `r15/cap`: planta do Térreo em 390 e 360, "Antes de acender a luz" e desfecho em 390.

**Testes já rodados:**
- `r15/t_caminho.txt`: a planta lida como grafo, TUDO CERTO;
- `r15/t_luzalt.txt`: TUDO CERTO;
- `r15/validar.txt`: "revisão 16", APROVADO nas 5 causas, com 1, 2 e 3 pessoas e 5 sementes. O bot fica em no máximo 0,10%.

## 1. Nota geral

**8,9 / 10. PASSOU.** Os oito critérios de mínimo 9,0 estão em 9,0, e a Prosa está em 8,5 (mínimo 8,0).

A revisão 16 fechou a única obrigatória da rodada anterior. A Área de descanso voltou a ter porta para o corredor, em frente à Base da limpeza. Conferi cada caminho que as pistas descrevem contra a tabela `PLANTA` e as capturas, e todos se fazem no mapa. Ficam só menores, nenhum abaixo do mínimo.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu calou, e só o caderno guarda: `aurelio_2` ("Era medo meu."), `v4_braga` ("Tive medo de perder o emprego"), `ivone_2` ("Devia ter perguntado por quê."). O Desligar tem preço em cada noite, e a pergunta do telão fica com a turma. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta fecha: a queda acontece uns 30 s antes de 0:00, a chave é virada às 4:10 (`traj_3`), a Câmara leva 50 s para armar (`raio_contagem`) e dispara às 5:00. A Dra. Sato só comenta o que ouve. Menor novo: a "foto impressa ao contrário" (`falsa_3`) explica a rachadura, mas não explica que só o 5º símbolo esteja virado. |
| Estrutura | **9,0** | 9,0 | A escada de voltas é 232/27/9/9/4, e nenhuma volta, tranca ou rótulo mudou. Nenhum título adianta virada ("Abrir uma caixa da estante", "Antes de acender a luz", "Inscrição na máscara"). |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | `soNaCausa`, `parDe` e prévias não mudaram (validador: prévias iguais nas 75 combinações de sala e volta). Ouro nas 5 causas, e o bot fica em no máximo 0,10%. |
| Jogo limpo e dedução | **9,0** | 9,0 | `c_esc_3` agora diz "caixas de banners", então as três entradas da caixa respondem ao minijogo. "Antes de acender a luz" pede para entender a foto ("Arranhada, beiradas roídas" sem repetir as palavras de `par_foto`). A luz na volta 1 está documentada e não dá prova. |
| Personagens e fichas | **9,0** | 9,0 | As 8 fichas estão completas, e a voz bate com a ficha: Braga com "Tá." e café, Lenz com "rapidinho", Nico com o tropeço, Seu Dirceu de esfregão. A revisão 16 não mexeu em fala de personagem. |
| **Prosa** | **8,5** | **8,0** | `maq_ver` perdeu o inventário de algarismos, e a frase nova de `falsa_3` é só descrição. Ficam três fechamentos de narrador: "alguém tentou segurar quem caía." (`empurra_2`), "Ela só comenta o que você contar." (`man_3`) e "Se saiu, foi por outra porta." (`coop_catraca_ok`, `catraca_solo`). |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem pelo menos 2 caminhos, e a prova da cópia tem 6. O validador, sobre os mesmos bytes dos dados, dá Ouro com 1, 2 e 3 pessoas nas 5 causas. |
| Consistência do documento | **9,0** | 9,0 | A planta de agora bate com o trajeto das 4:00 às 4:10, com as pegadas, com `ivone_red`, com `pose` e com o armário. ROTEIRO 3 e LOOP-CENTRAL já citam a sala em reforma. Ficam menores de palavra: "copa", a chuva e o motivo do símbolo virado (ROTEIRO 1 × 21). |

### Caminhos das pistas conferidos na planta

A grade do Térreo é esta:

```
'ele ate ate desc'
'tec col col desc'
'esc esc est desc'
'hall hall hall hall'
'rec cen cen limp'
```

| Pista ou fato | Caminho que o texto descreve | Na planta | Resultado |
|---|---|---|---|
| ROTEIRO 3, `lenz_0` (4:02), `traj_2` (4:05), `traj_3` (4:10) | porta de serviço → cruza a Área de descanso → passa diante do Seu Dirceu → escada do Subsolo | `desc r end fora` → `desc b` → hall (em frente a `limp t`) → `esc b` | **Fecha.** Não passa pela Sala das coleções. |
| `coop_pegadas`, `pegadas_solo`, `mancha`, ROTEIRO 2 | saem da Sala das coleções, cruzam a Área de descanso e somem na porta de serviço | `col r` → desc → `desc r end fora` | **Fecha.** |
| `ivone_red` | porta de vidro do Ateliê dá para a Área de descanso; Ivone foi até a cafeteira e voltou; o Seu Dirceu poderia contar | `ate r vidro` → desc; da Base da limpeza, a porta da Área de descanso fica bem em frente | **Fecha.** Ele não vê a porta do Ateliê diretamente, mas vê a sala pela porta (ver menor 6). |
| `pose` | pela porta de vidro da Sala das esculturas, o braço aponta para a escada do Subsolo | `est r vidro` → desc; `est` encosta em `esc` | **Fecha.** |
| `cracha_2`, `cracha_3`, ROTEIRO 2 | armário da equipe ao lado da Base da limpeza | armário desenhado colado em `limp` | **Fecha.** |
| `c_esc_3`, ROTEIRO 2 | duas caixas entram na Sala das coleções, e só uma sobe para a Galeria | `col` → desc → hall → esc | **Fecha.** |
| `d_teo_2` (noite D) | Téo passa diante do Seu Dirceu, sobe para a Galeria e volta | hall → esc ▲ | **Fecha.** |
| Correio do Loop, `iso_1`, `chao_manopla` | luva da Oficina técnica deixada no Pátio | `tec b` → esc / `tec` → `ele` → `ele t start` → Pátio | **Fecha.** |
| Conserto C, `chao_peca` | peça verdadeira da Sala das coleções até o Subsolo | `col` → desc → hall → esc ▼ | **Fecha.** |
| `assim_foto`, `cofre_ronda`, `traj_1`, `traj_4` | volta de noite pela porta de serviço | porta `desc r end fora` | **Fecha.** |

Nenhuma contradição entre a planta e as pistas.

## 3. Abaixo do mínimo

**Nenhum critério ficou abaixo do mínimo.**

### (a) Obrigatórias

**Nenhuma.**

### (b) Retoques opcionais (não seguram nota sozinhos)

**O oculto e consistência**
1. **Foto espelhada × só um símbolo virado. Novo, da revisão 16.**
   - O que dizem os documentos: a ROTEIRO 21 e a DECISOES 16 explicam que quem copiou trabalhou com a foto "impressa ao contrário", e que por isso "a rachadura foi parar do outro lado e o quinto símbolo saiu virado".
   - O problema: no `glifos.svg`, "pedra" e "noite" também são desenhos assimétricos. Copiada de uma imagem espelhada, a frase sairia com esses dois símbolos virados e na ordem inversa, não só com o 5º virado.
   - Os documentos discordam entre si: a ROTEIRO 1 dá outro motivo ("riscou a frase à mão, com pressa, e gravou o quinto símbolo virado").
   - Por que é menor: no jogo nenhuma pista conclui isso, e a prova continua sendo "a frase não fecha".
   - Saída: na ROTEIRO 21 e na DECISOES 16, ligar a foto espelhada só à rachadura e deixar o símbolo virado como erro de pressa, como na parte 1 (cerca de 20 palavras).
2. **Molde × rachadura e bordas** (já vinha da rodada 16). Se o molde "pegou o rosto" da verdadeira, a cópia repetiria o lado da rachadura e o desgaste. A foto espelhada só ajuda se a cópia foi feita olhando a foto. Saída: na ROTEIRO 1, "molde com o formato" em vez de "o molde pegou", ou deixar como está.

**Prosa**
3. Cortar "alguém tentou segurar quem caía." (`empurra_2`) e "Ela só comenta o que você contar." (`man_3`), deixando a marca e a fala (cerca de 12 palavras). Com isso, a Prosa iria a 9,0.

**Consistência (palavra)**
4. **"Copa".** Em `nico_0`, o Nico diz "Tem bolacha na copa, pega lá", mas a ROTEIRO 3 manda que a sala da cafeteira se chame "Área de descanso, sempre". Quem joga pode procurar uma sala que não existe. Saída: "na Área de descanso" ou "perto da cafeteira" (3 palavras).
5. **Chuva × estrada.** A dica de `traj_1` diz "Lá fora chove desde o começo da noite", mas a tempestade já tinha fechado a estrada ontem (ROTEIRO 2; `fh_ficha_bc`: "Saio antes da chuva"). Saída: "chove desde ontem" (2 palavras).
6. **`ivone_red`.** "Pergunta ao Seu Dirceu" funciona, porque da Base da limpeza ele vê a Área de descanso pela porta que fica em frente. Nenhuma pista traz a resposta dele, e isso é aceitável (é desafio da Ivone). Só registro.
7. A DECISOES 14 ainda descreve a planta antiga ("embaixo da Área de descanso", "corredor estreito"). A revisão 16 vale sobre ela, mas uma nota "(revisão 16: ver abaixo)" evita leitura errada (cerca de 5 palavras).

### Pedido de conferência: revisão 16

| Ponto | Resultado |
|---|---|
| Planta do Térreo × trajeto 4:02 → 4:05 → 4:10 | **Fechado** (tabela de caminhos acima; captura 390/360; `t_caminho` TUDO CERTO). |
| Sala das esculturas | **Coerente:** fechada, com vidro para a Área de descanso, encostada na escada (`pose`). Nenhuma porta comum entra nela. |
| "A cópia não é de pedra" | **Coerente:** luz "até o grão", tela A "cor cinza, mais clara", `coop_copia_ok` "a cor". As outras ocorrências de "pedra" são da verdadeira, da frase da máscara ou do Pátio. A cópia é de gesso: "Mais leve que no registro", `dis_gesso`, `dirceu_0` (pó branco). |
| `c_esc_3` "duas caixas de banners" | **Coerente** com `c_esc_1`, `c_esc_2`, `lenz_meio_1` e o minijogo. Fecha o menor da rodada 16. |
| `falsa_3` foto impressa ao contrário | Explica a rachadura do outro lado. **Menor 1** sobre o símbolo virado. |
| Miniatura GAL_B (desfecho e fita) | **Coerente:** a ficha "A cópia na Galeria" e a prova "O que foi feito" mostram a peça da Galeria. |
| `maq_ver` | **Coerente** com `LOOP_DESC.prototipo` ("Ligada, e ninguém consegue desligar.") e com `loop_reset`. |
| `falsa_1.antes` | **Coerente:** só aparece com `par_foto`, e a certa ("Arranhada, beiradas roídas") pede para entender "riscos finos, bordas gastas". Errar não custa. |
| Luz de lado na volta 1 | Documentada (ROTEIRO 4, 11 e 21). Não entra prova no caderno. Não baixa nota. |
| Contradição nova entre dados, telas, planta, peças 3D e os 4 documentos? | **Nenhuma** que derrube nota. Só os menores 1, 4, 5 e 7. |

### Decisões de regra do autor ("Ficou para decidir"; nenhuma baixa nota)

As mesmas de antes:
- a Dra. Sato e as voltas;
- o alarme das 2:40;
- "quem" e "por quê" quase inteiros na volta 1 (trajeto já na volta 1, nome só na 3);
- piso de volta;
- Revelar só na volta 5;
- por que quem joga lembra;
- `d_teo_2` sem tranca e `man_cal_3`;
- "tábua" com dois sentidos;
- minijogo sem custo de erro;
- a testa à vista desde a volta 1.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 16, rev. 14) | Agora (rev. 16) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança de enredo. |
| O oculto | 9,0 | **9,0** | A foto espelhada responde a parte da rachadura, mas abre o menor do símbolo (1). Fica igual. |
| Estrutura | 9,0 | **9,0** | Nenhuma volta, tranca ou rótulo mudou. |
| Rodízio (causas A–E) | 9,0 | **9,0** | Nada mudou por causa. Validador: Ouro nas 5. |
| Jogo limpo e dedução | 9,0 | **9,0** | Fechou o menor de `c_esc_3`, e a luz na volta 1 virou decisão documentada. Não sobe porque o trajeto continua inteiro já na volta 1 (decisão do autor). |
| Personagens e fichas | 9,0 | **9,0** | Sem mudança de fala. |
| Prosa | 8,5 | **8,5** | `maq_ver` melhorou. Ficam `empurra_2`, `man_3` e "Se saiu, foi por outra porta.", então a nota não sobe. |
| Robustez por número de jogadores | 9,0 | **9,0** | Validador da revisão 16: APROVADO. |
| Consistência do documento | 8,5 | **9,0** | **Subiu:** a porta da Área de descanso para o corredor voltou, e o trajeto, `ivone_red` e `pose` se fazem na planta. Nenhuma nota caiu por causa de correção técnica. |
| **Geral** | **8,9** (não passou) | **8,9** (**passou**) | Todos os critérios no mínimo ou acima. |

## 5. Fim do ciclo

**A escala da história (seção 1) passou:** todos os critérios estão no mínimo ou acima. Obrigatórias (a): nenhuma. Os retoques (b) são opcionais.
