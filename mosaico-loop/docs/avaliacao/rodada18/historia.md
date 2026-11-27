# Mosaico Loop v4 revisão 16: escala da história (seção 1), avaliada do zero

Avaliador independente. Não escrevi o texto, então não há desconto de autoavaliação. Não abri navegador: usei código, dados e capturas que já existiam. Nada do repositório foi tocado.

**O que li inteiro:**
- ESCALAS_AVALIACAO_JOGOS.md;
- ROTEIRO-LOOP.md, partes 1 a 21;
- FICHAS.md;
- DECISOES-V4.md, revisões 14 a 16;
- LOOP-CENTRAL.md: cabeçalho ("Lugares"), revisões 14 a 16 e checklist por volta;
- as 281 pistas de `pistas_legivel.txt` (gerado às 19:13 dos dados de 19:12, "v4 revisão 16");
- de `atividades.txt`: `telaPapel` do Lado a Lado e os finais.
- Conferi com `cmp` que `/tmp/roda/v4_pistas.json`, lido pelo validador, tem os mesmos bytes de `dados/pistas-v4.json`.

**Código que conferi:**
- game.js: `PLANTA` e `PLANTA_AREA`, com o comentário da revisão 16, e `LOOP_DESC`;
- loop-central.js: `LC_MG` (luz de lado, "Antes de acender a luz", caixa da estante, fita, inscrição), `LC_INSC` e `LC_FATO_CURTO`;
- ritmo.js: `LOOP_LINHA`;
- `museu/icones/ui/glifos.svg`: o desenho dos 12 símbolos.

**Testes e capturas:**
- Rodei `/tmp/roda/r15/caminho.mjs` (copiado para `rod18/`; a saída está em `rod18/caminho.txt`). Ele só lê a planta. Resultado: TUDO CERTO.
- Capturas que vi:
  - `r15/cap`: planta do Térreo 390, "Antes de acender a luz", luz nas posições 4 e 5, desfecho;
  - `r14/cap`: máscara da Galeria de perto, com a inscrição e a rachadura.
- O validador (`r15/validar.txt`, "revisão 16") deu APROVADO nas 5 causas, com 1, 2 e 3 pessoas. O bot fica em no máximo 0,10%.

## 1. Nota geral

**8,9 / 10. TODAS PASSARAM.** Os oito critérios de mínimo 9,0 ficaram em 9,0. A Prosa ficou em 8,5 (mínimo 8,0).

A revisão 16 fechou a obrigatória da rodada 16: a Área de descanso voltou a ter porta para o corredor, bem em frente à Base da limpeza. Também fechou três opcionais:
- `c_esc_3` agora fala de banners;
- a Sala das esculturas entrou na ROTEIRO 3 e no "Lugares" da LOOP-CENTRAL;
- a cópia não é mais chamada de pedra.

Contradição nova que derrube nota: nenhuma. Um retoque novo cria uma explicação que só fecha pela metade (a foto espelhada, menor 1). Fica como menor, porque nenhuma pista conclui isso e a prova não muda.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu calou, e só o caderno guarda: `aurelio_2` ("Era medo meu."), `v4_braga` ("Tive medo de perder o emprego"), `ivone_2` ("Devia ter perguntado por quê."). O Desligar tem preço em cada noite, e a pergunta do telão fica com a turma. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta da Câmara fecha: queda uns 30 s antes de 0:00, chave às 4:10 (`traj_3`), 50 s para armar (`raio_contagem`), disparo às 5:00. A Dra. Sato só comenta o que ouve (`man_3`, `sato_teo`). Menor novo: a foto espelhada explica a rachadura, mas não o quinto símbolo (menor 1). |
| Estrutura | **9,0** | 9,0 | Escada de voltas 232/27/9/9/4 sem mudança. Nenhum título adianta virada ("Fundo de uma caixa", "Antes de acender a luz", "Abrir uma caixa da estante"). |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | Nenhum `soNaCausa`, `parDe` ou rótulo mudou. As prévias são iguais nas 5 causas (validador g e g2). Ouro nas 5, e o bot fica em no máximo 0,10%. |
| Jogo limpo e dedução | **9,0** | 9,0 | As três pistas que abrem a caixa falam de banners. "Antes de acender a luz" pede para entender a foto ("Arranhada, beiradas roídas" ≠ "riscos finos, bordas gastas"). A inscrição continua limpa: tábua na volta 1, cópia e verdadeira na volta 2. |
| Personagens e fichas | **9,0** | 9,0 | As 8 fichas estão completas. A fala nova de `c_esc_3` mantém o Braga ("Tá. Olha aí… Meu cunhado… Café?"). Lenz fala com "rapidinho", Nico tropeça, Seu Dirceu tem o esfregão na mão. |
| **Prosa** | **8,5** | **8,0** | `maq_ver` ficou sem inventário de algarismos e `falsa_3` não conclui nada. Ficam os fechamentos de narrador de antes: "alguém tentou segurar quem caía." (`empurra_2`), "Ela só comenta o que você contar." (`man_3`), "Se saiu, foi por outra porta." (`coop_catraca_ok`, `catraca_solo`). |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem de 2 a 10 fontes, e a prova da cópia tem 6. O validador, sobre os mesmos bytes dos dados, dá Ouro com 1, 2 e 3 pessoas nas 5 causas. |
| Consistência do documento | **9,0** | 9,0 | A planta agora deixa fazer todos os caminhos que as pistas descrevem (conferido no grafo, item a item). ROTEIRO 3 e LOOP-CENTRAL citam a sala em reforma. Ficam menores isolados: a foto espelhada na ROTEIRO 21 e na DECISOES 16, e o F2 em dois lugares na noite D. |

### Planta do Térreo × pistas (tabela `PLANTA`, conferida como grafo)

Grade: `ele ate ate desc / tec col col desc / esc esc est desc / hall×4 / rec cen cen limp`, com o Pátio fora, em cima.

| Caminho que a pista descreve | Na planta | Resultado |
|---|---|---|
| 4:00, câmera da porta de serviço (`traj_1`): alguém chega de fora | porta `desc r end fora` | OK |
| 4:02, cruza a Área de descanso (`lenz_0`) → 4:05, Seu Dirceu: "rumo à escada do Subsolo" (`traj_2`) → 4:10, escada (`traj_3`) | desc → hall → esc. A porta da Área de descanso fica em x 255, em frente à Base da limpeza (210–300). Não passa pela Sala das coleções | OK |
| Pegadas: saem da Sala das coleções, cruzam a Área de descanso e somem na porta de serviço (`coop_pegadas`, `pegadas_solo`, ROTEIRO 2) | col → desc → fora. A Sala das coleções só tem a porta para a Área de descanso | OK |
| Caixas do dia 14: entram na Sala das coleções e só uma sobe para a Galeria (`c_esc_3`) | col → desc → hall → esc | OK |
| `ivone_red`: a porta de vidro do Ateliê dá para a Área de descanso; "pergunta ao Seu Dirceu" | vidro `ate → desc`. Da Base da limpeza, pelo corredor, dá para ver a porta da Área de descanso | OK |
| `pose`: pela porta de vidro da Sala das esculturas, o braço aponta para a escada do Subsolo | vidro `est → desc`. A sala encosta na escada, a oeste | OK |
| Armário da equipe ao lado da Base da limpeza (`cracha_2`, `cracha_3`) | armário desenhado colado na Base da limpeza | OK |
| `c_anc_2`, `a_pisca_4`, `dis_guarda`, `traj_4`: coisas ao lado da porta de serviço | porta de serviço na parede de fora da Área de descanso | OK |
| Pátio e Quadro externo fora do prédio; luvas e chavinha na Oficina elétrica | ele → pátio (porta de cima) | OK |
| Recepção ao lado da Central; porta da frente | rec ↔ cen, `rec b fora` | OK |

### Pedido de conferência: revisão 16

| Ponto | Resultado |
|---|---|
| Planta do Térreo | **Fechado.** Os 4 caminhos acima são feitos sem entrar na Sala das coleções. A captura `r15/cap/planta_terreo_390.png` confirma as portas. |
| "Até o grão" / a cópia não é de pedra | **Coerente.** A luz diz "até o grão". A tela A diz "cor cinza, mais clara", e `coop_copia_ok`, "a cor". Os outros "pedra" são da peça verdadeira, da escrita ("O rosto de pedra…") ou do Pátio. A imagem da luz (`luz_pos4/5`) mostra a superfície granulada. |
| `c_esc_3` "caixas de banners" | **Fechado.** Agora a resposta do minijogo da caixa está nas 3 pistas que o abrem. |
| `falsa_3` + foto do catálogo impressa ao contrário | **Coerente com a rachadura.** O molde pegou o rosto; a rachadura foi feita à mão, olhando a imagem espelhada. **Não fecha com a inscrição** (menor 1). |
| Miniatura GAL_B no desfecho e na fita | **Coerente.** `LOOP_LINHA.copia.ic = GAL_B` e `LC_PV_IC.prova_falsa = GAL_B`, com a peça que tem inscrição e rachadura. |
| `maq_ver` sem algarismos | **Fechado.** Não diz nada que mude de causa para causa. |
| `falsa_1.antes` reescrito | **Coerente.** Só aparece com `par_foto`. A resposta pede para traduzir a foto, e a luz confirma ou desmente. Comparar já na volta 1 está registrado (ROTEIRO 4, 11 e 21). |
| Contradição nova entre dados, telas, planta, peças 3D e os 4 documentos | Nenhuma que derrube nota. Há um menor novo, só nos documentos (menor 1). |

## 3. Abaixo do mínimo

**Nenhum critério.**

### (a) Obrigatórias

Nenhuma.

### (b) Retoques opcionais (não seguram nota sozinhos)

1. **Foto espelhada × inscrição. Novo, da revisão 16; só nos documentos.**
   - **O que os documentos dizem.** A ROTEIRO 21 e a DECISOES 16 dizem que, por causa da foto impressa ao contrário, "a rachadura foi parar do outro lado **e o quinto símbolo saiu virado**".
   - **Por que não fecha.** Copiada de uma imagem espelhada, a frase sairia na ordem invertida, e todo símbolo assimétrico sairia virado.
   - **O que o jogo mostra.** Na máscara 3D (`galeria_perto`) e em `LC_INSC.copia`, "pedra" e "noite" (a lua crescente) estão do lado certo, a ordem é a da peça verdadeira e só "guardar" está virado.
   - **No jogo, nada quebra.** `insc_copia` atribui o erro à pressa ("riscados à mão, de traço novo"), e nenhuma pista liga a foto ao símbolo.
   - **Saída.** Tirar "e o quinto símbolo saiu virado" das duas frases (cerca de 6 palavras em cada documento): a foto espelhada fica só como explicação da rachadura. 0 palavras no jogo.
2. **F2 em dois lugares na noite D. Antigo.**
   - **O que o jogo diz.** Na Oficina técnica, `d_fus_1` diz: "O lugar do fusível-mestre, o F2, está vazio" (e a caixa tem o lacre). No Subsolo, o painel (`coop_painel_D`) mostra "o encaixe do fusível-mestre está vazio", e o manual (`man_circ_1`) manda pôr o F2 "no encaixe do Subsolo".
   - **O que o roteiro diz.** A ROTEIRO 6 D diz que o Téo "passou no Subsolo [...] cortou o lacre, tirou o fusível-mestre F2", e a ROTEIRO 10 diz que a caixa fica "num lugar só (Oficina técnica)".
   - **Efeito.** O conserto não fica em dúvida, porque o procedimento é claro. Mas existem dois lugares vazios para o mesmo fusível.
   - **Saída.**
     - `d_fus_1`: "O F2, que liga esta caixa ao encaixe do Subsolo, foi tirado." (ou parecido; cerca de 10 palavras);
     - ROTEIRO 6 D: "passou na Oficina técnica e no Subsolo" (3 palavras).
3. **Prosa.** Cortar "alguém tentou segurar quem caía." (`empurra_2`) e "Ela só comenta o que você contar." (`man_3`). São cerca de 12 palavras; fica a marca e fica a fala.
4. **Chuva.** A dica da fita diz "chove desde o começo da noite". Já a ROTEIRO 2 diz que a tempestade fechou a estrada ontem, e `fh_ficha_bc` diz "Saio antes da chuva" (ontem). Saída: "chove desde ontem" (2 palavras).
5. **"Copa".** Em `nico_0`, o Nico diz "Tem bolacha na copa", e a ficha dele diz "O que vê: … a copa". A ROTEIRO 3 diz que a sala da cafeteira "chama Área de descanso, sempre", e não há copa na planta. Saída: "Tem bolacha na Área de descanso" ou "perto da cafeteira" (cerca de 3 palavras).

### Decisões de regra do autor ("Ficou para decidir"; nenhuma baixa nota)

As mesmas de antes: a Dra. Sato e as voltas; o alarme das 2:40; "quem" e "por quê" quase inteiros na volta 1; piso de volta; Revelar só na volta 5; por que quem joga lembra; `d_teo_2` sem tranca e `man_cal_3`; "tábua" com dois sentidos; minijogo sem custo de erro; a testa à vista desde a volta 1; a luz de lado comparando com a foto já na volta 1.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 16, rev. 14) | Agora (rev. 16) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança de enredo. |
| O oculto | 9,0 | **9,0** | Saiu o menor do molde × rachadura: a foto espelhada explica a rachadura. Entrou o menor 1 (inscrição), que fica só nos documentos. |
| Estrutura | 9,0 | **9,0** | Nenhuma volta, tranca ou rótulo mudou. |
| Rodízio (causas A–E) | 9,0 | **9,0** | Nada mudou por causa. Validador: Ouro nas 5. |
| Jogo limpo e dedução | 9,0 | **9,0** | Fechado o menor de `c_esc_3`. A luz na volta 1 virou decisão registrada. |
| Personagens e fichas | 9,0 | **9,0** | Só a fala de `c_esc_3` mudou, e na voz do Braga. |
| Prosa | 8,5 | **8,5** | `maq_ver` ficou mais limpo. Os três fechamentos de narrador continuam, então a nota não sobe. |
| Robustez por número de jogadores | 9,0 | **9,0** | Validador da revisão 16: APROVADO. |
| Consistência do documento | 8,5 | **9,0** | **Subiu:** a planta voltou a deixar fazer o trajeto 4:02 → 4:05 → 4:10 e a fala da Ivone. A sala em reforma entrou na ROTEIRO 3 e na LOOP-CENTRAL. Ficam menores isolados (1, 2, 4, 5). |
| **Geral** | **8,9** (não passou) | **8,9** (**passou**) | Nenhuma nota caiu por causa da correção técnica. |

## 5. Fim do ciclo

**A escala da história (seção 1) passou: todos os critérios estão no mínimo ou acima.** Não há obrigatória (a). Os retoques (b) são opcionais.
