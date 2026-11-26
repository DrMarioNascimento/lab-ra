# Mosaico Loop v4 revisão 14: escala da história (seção 1), avaliada do zero

Avaliador independente. Não escrevi o texto, então não há desconto de autoavaliação. Não abri navegador: usei o código, os dados e as capturas que já existiam.

**O que li inteiro:**
- ESCALAS_AVALIACAO_JOGOS.md;
- ROTEIRO-LOOP.md, partes 1 a 20;
- FICHAS.md;
- DECISOES-V4.md, revisões 13 e 14;
- LOOP-CENTRAL.md: cabeçalho, revisões 13 e 14, checklist e fontes por fato essencial.

**Dados:**
- `dados/pistas-v4.json` ("v4 revisão 14", 281 pistas). Tem os mesmos bytes que `/tmp/roda/v4_pistas.json`, o arquivo que o validador leu (`cmp`).
- `pistas_legivel.txt` confere com o JSON nas pistas que mudaram: `par_foto`, `conserto_C`, `conserto_D`, `lenz_3`, `e_hist_1`, `teo_cadeira` e `telaPapel.A`.
- `atividades.txt`: Lado a Lado, finais e `salas_em_reforma`.

**Código:**
- loop-central.js: `LC_MG` (luz com `antes.se:['par_foto']`, caixa, inscrição, foto antiga, fita), `lcBancada`, `lcAnexar`, `lcPreConf`, `LC_FATO_CURTO` e `lcFatosFinal`;
- ritmo.js: `LOOP_LINHA`;
- game.js, `sala/conteudo.js` e `museu/torre/salas-loop.json`: a frase do Pátio.

**Capturas** (`/tmp/roda/esc/r14/cap/`, em 390):
- luz antes, luz no achado;
- Galeria de perto;
- Lado a Lado;
- caixa;
- desfecho e desfecho vazio;
- planta do Térreo.

**Validador** (`r14/validar.txt`): "revisão 14", **APROVADO** nas 5 causas, com 1, 2 e 3 pessoas e 5 sementes. O bot aleatório fica em no máximo 0,05%.

Nada do repositório foi tocado.

## 1. Nota geral

**9,0 / 10. TODAS PASSARAM: os nove critérios estão em 9,0. O mínimo é 9,0, e na Prosa é 8,0.**

A revisão 14 fechou os quatro pontos que a rodada 13 deixou como menores (a):
- a luz de lado agora bate com a imagem;
- há uma chuva só (tempestade);
- a rachadura está desenhada no lado direito da máscara 3D, como diz a tela A do Lado a Lado;
- saíram as conclusões de narrador de `conserto_C` e `conserto_D`.

Saíram também os rótulos de formulário ("MEIO CERTO", "Você não chutou", "Registrar revelação"). Por isso a Prosa sobe de 8,5 para 9,0.

Entram três menores novos, todos da própria revisão 14. Nenhum mexe em prova, tranca, nome ou Revelar:
1. **A luz de lado já faz a comparação com a foto na volta 1.** `falsa_1` é da volta 1, e `par_foto` também. A pergunta de antes da luz ("A luz de lado vai dizer se esta aqui é igual") seguida de "Nenhuma borda gasta, nenhum risco de uso" põe na tela, na volta 1, o mesmo confronto de `foto_solo`. A ROTEIRO, parte 4, diz que "a comparação da foto" é "da volta 2 em diante".
2. **A caixa pede o que o caderno pode não ter.** A pergunta é "Pelo que o seu caderno diz da caixa do patrocínio, qual você abre?". A tranca de `c_peca` aceita `c_esc_3`, a gravação do Braga, que não fala em banners nem em patrocínio. A DECISOES 14 cita `lenz_meio_1` como fonte da etiqueta, mas essa pista não está na tranca.
3. **A rachadura da cópia, do lado oposto ao da foto, não tem explicação no mundo.** A cópia saiu de um molde que "pegou o rosto", e um molde copiaria a rachadura da esquerda no mesmo lugar.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu calou e só o caderno guarda (`aurelio_2` "Era medo meu.", `v4_braga`, `ivone_2`); Desligar tem preço por noite; a pergunta do telão fica com a turma. Revisão 14 não mexeu no enredo. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta fecha (queda antes de 0:00, chave às 4:10, 50 s, disparo às 5:00); a Dra. Sato só comenta o que ouve e devolve pergunta; `e_hist_1` sem "Alguém ligou." ficou só com a voz dela. |
| Estrutura | **9,0** | 9,0 | Escada 232/27/9/9/4, nenhuma volta, tranca ou rótulo mudou; títulos novos ("Abrir uma caixa da estante", "Antes de acender a luz") não entregam virada. Menor novo: a luz faz o confronto com a foto já na volta 1 (item 1). |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | Listas e rótulos iguais nas 5 noites; a Sala das esculturas em reforma é igual em todas as noites e voltas; validador: Ouro nas 5. |
| Jogo limpo e dedução | **9,0** | 9,0 | A inscrição continua limpa (tábua na V1, `insc_copia` na V2); a luz agora diz o que a imagem mostra. Menores: confronto com a foto na V1 sem caderno de prova; caixa aberta via `c_esc_3` sem etiqueta no caderno (errar não custa). |
| Personagens e fichas | **9,0** | 9,0 | 8 fichas completas; `lenz_3` virou cena (pegada e distância), `teo_cadeira` sem fecho; nenhuma fala contradiz voz ou "nunca diria". |
| **Prosa** | **9,0** | **8,0** | Saíram os fechos de narrador (`conserto_C` "A máquina para de puxar.", `conserto_D`, `lenz_3`, `teo_cadeira`) e os rótulos de formulário ("Quase.", "Revelar agora"). Ficam o inventário com algarismos de `maq_ver` e "Você marcou 3 de 3: 2 sinais (2 tipos)…", menores. |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial com 2 a 10 fontes; prova da cópia com 6; validador sobre os mesmos bytes: Ouro com 1, 2 e 3 pessoas nas 5 causas e 5 sementes. |
| Consistência do documento | **9,0** | 9,0 | Luz × imagem, chuva e rachadura fecharam (dados, `conteudo.js`, `salas-loop.json`, captura `galeria_perto` iguais). Ficam menores: ROTEIRO 4 × luz na V1; DECISOES 14 × tranca de `c_peca`; miniatura V11 (testa lisa) para "A cópia na Galeria". |

### Defeitos menores (não seguram nota sozinhos)

**(a)** = texto, dado ou imagem, corrigível já. **(b)** = só muda com decisão de regra do autor.

**Estrutura e Jogo limpo**

1. **(a) Novo, da revisão 14: a luz de lado faz a comparação com a foto na volta 1.**
   - Onde: `LC_MG.falsa_1.antes`, com `se:['par_foto']`. `lcBancada` não confere a volta. `falsa_1` e `par_foto` têm `volta_min` 1.
   - Na volta 1, quem passou antes pela Sala da fotografia responde "Pedra escura, riscos finos, bordas gastas". Logo depois lê "A luz de lado vai dizer se esta aqui é igual", e a luz responde "Nenhuma borda gasta, nenhum risco de uso".
   - É o confronto de `foto_solo` ("as bordas, gastas na foto, aqui estão inteiras") na volta 1, por 1 de energia em vez de 2. A ROTEIRO diz o contrário em dois lugares:
     - parte 4, volta 1: "O que ainda não dá: ... a comparação da foto (tudo isso é da volta 2 em diante)";
     - parte 11: "Comparar a foto sem ajuda. Passou para a volta 2."
   - Não derruba nota:
     - nada entra no grupo `prova_falsa`, e o Braga, o Lenz e o Revelar continuam pedindo a prova no caderno;
     - na volta 1 a troca já se lê por `v4_teo`, `data_3` e `aurelio_1`, e a testa da máscara 3D é cenário (pontos (b) já aceitos).
   - Mas ela esvazia um pouco o "Não é só cheiro" da volta 2.
   - Saídas (escolher uma):
     - mostrar o `antes` só da volta 2 em diante (`se` mais `volta_min`), o que é regra de tela;
     - ou tirar a ponte "A luz de lado vai dizer se esta aqui é igual." (cerca de 10 palavras);
     - ou registrar na ROTEIRO, parte 4, que a luz já confronta a foto na volta 1, sem valer como prova.
2. **(a) Novo, da revisão 14: a caixa pede o que o caderno pode não ter.**
   - A tranca de `c_peca` é `falsa_1` mais uma de `c_esc_1`, `c_esc_2` ou `c_esc_3`.
   - `c_esc_3`, a gravação do Braga, diz "duas caixas iguais", sem banners e sem patrocínio. Quem entrou só por ela não tem no caderno de onde tirar "BANNERS – NÃO ABRIR".
   - As dicas mandam para pistas que essa pessoa pode não ter. A DECISOES 14 cita `lenz_meio_1`, que não está na tranca.
   - Não bloqueia: errar não custa, e `c_esc_1` está na mesma sala, na volta 1.
   - Saídas:
     - pôr "de banners" na fala do Braga, por exemplo "duas caixas iguais, de banners, entram..." (cerca de 2 palavras);
     - ou acertar a frase da DECISOES.

**O oculto e Consistência**

3. **(a) A rachadura, do lado oposto ao da foto, não tem razão no mundo.**
   - A cópia vem de um molde que "pegou só o rosto" (ROTEIRO 1, `falsa_3`). Um molde levaria a rachadura da esquerda, a da foto, para o mesmo lado da cópia.
   - A máscara 3D mostra só uma rachadura, fina, do lado direito. A tela A diz "rachadura fina do lado direito".
   - A prova continua firme: é diferença, e há mais duas, a cor e as bordas. Mas um jogador atento de 17 a 40 anos pode perguntar "por que trocou de lado?".
   - Saída: dizer que a da direita é trinca nova no verniz e que a da esquerda falta, por exemplo na tela A: "trinca fina e nova do lado direito; do esquerdo, nada" (cerca de 8 palavras, sem mudar a prova). Também cabe "de quem olha" nas duas telas, para o lado não ficar ambíguo.
4. **(a)** "o grão da pedra" (luz) e "pedra cinza, mais clara" (tela A) descrevem uma cópia que a ROTEIRO, parte 2, diz ser "de gesso e verniz". É aparência vista por quem ainda não sabe, então se aceita. Fica registrado.
5. **(a) Arte.** A ficha "A cópia na Galeria", no desfecho novo do celular e na fita do telão, usa a miniatura `V11`. É a máscara antiga, de testa lisa e marrom. A peça da Galeria é a `GAL_B`, cinza, com inscrição e rachadura. Trocar o `ic` de `copia` em `LOOP_LINHA` para `GAL_B`.
6. **(a) Imagem.** A pergunta "Antes de acender a luz" fala da foto do catálogo, mas mostra a miniatura da Galeria (`img:['GAL_B']`). Não engana, mas uma imagem da Sala da fotografia (ou nenhuma) casaria melhor.

**Prosa.** `maq_ver` ("3 mostradores, 1 ponteiro de carga, 1 luz da peça e o botão...") é inventário com algarismos. "Você marcou 3 de 3: 2 sinais (2 tipos), 1 leitura normal." ainda soa a formulário. "Se saiu, foi por outra porta." é aceitável, porque é a leitura das listas.

**Antigos, que continuam:**
- (b) "Quem" e "por quê" quase inteiros na volta 1.
- (b) Testa à vista desde a volta 1 (decisão do autor).
- (b) `d_teo_2` sem tranca.
- (a) `d_fus_2` com a porta aberta.
- (a) `d_fus_2b` × etiqueta.
- "Ficou para decidir" da DECISOES 12 a 14.

### Conferência das mudanças da revisão 14

| Ponto | Resultado |
|---|---|
| Luz de lado × imagem | **Fechado.** `luz_achou_390` mostra pedra granulada, sem borda gasta, e o texto diz "O verniz cobre tudo por igual, até o grão da pedra. Nenhuma borda gasta, nenhum risco de uso." |
| Rachadura na GAL_B | **Desenhada**, no lado direito de quem olha, da sobrancelha pela bochecha (`galeria_perto_390`). Bate com a tela A. Menor de lógica: item 3. |
| Chuva | **Fechado.** "A tempestade não para..." em game.js, `conteudo.js` e `salas-loop.json`. Não sobra "chuva fina" em nenhum arquivo ativo. |
| `par_foto` × tela B × minijogo | **Coerentes:** "pedra escura, riscos finos, bordas gastas" (`tombo_2`: "escura, fosca"). |
| Minijogo antes da luz | Só com `par_foto`; a resposta está no caderno. Menor de volta: item 1. |
| Minijogo da caixa | 4 etiquetas e resposta no caderno para quem tem `c_esc_1` ou `c_esc_2`. Menor: item 2. |
| Prosa (`conserto_C`/`D`, `lenz_3`, `e_hist_1`, `teo_cadeira`) | **Fechado.** Fica o fato e o gesto, sem conclusão. |
| Telas da Máquina | "Quase." (noite E, "Mudou, não sumiu", igual à ROTEIRO 5), "Revelar agora", diagnóstico aceito sem "Você não chutou". |
| Desfecho do celular | Fichas com os rótulos de `LC_FATO_CURTO`, que só aparecem no fim e não adiantam nada. O desfecho vazio mostra "Nenhum fato da noite saiu do seu caderno desta vez.". Menor de arte: item 5. |
| Sala das esculturas na planta | **Coerente com `pose`.** Porta de vidro para a Área de descanso e escada do Subsolo ao lado. A `ivone_red` continua com a porta de vidro do Ateliê. |
| Manual, passo 1 | Planta igual à do jogo (vista pela DECISOES e LOOP-CENTRAL; não muda a história). |
| ROTEIRO 2: "já viu o Téo caído" | **Fechado** (partes 2 e 5). As partes 12 e FICHAS rev. 5 guardam a frase antiga como registro histórico; não conta. |
| Contradição nova entre dados, ROTEIRO, FICHAS, DECISOES e LOOP-CENTRAL? | Duas de palavra, menores: ROTEIRO 4 × luz na volta 1, e DECISOES 14 × tranca de `c_peca`. Nenhuma sobre fato do crime. |

## 3. Abaixo do mínimo

**Nenhum critério abaixo do mínimo.** Lista (a) de obrigatórias: **vazia**.

### 3.1 Menores (a) que vale fechar (não são condição para passar)

1. **Luz na volta 1:** mostrar o `antes` de `falsa_1` só da volta 2 em diante, ou tirar "A luz de lado vai dizer se esta aqui é igual." (cerca de 10 palavras). Outra saída é registrar na ROTEIRO 4 que a luz confronta a foto na volta 1 sem valer como prova. É o item mais ligado ao critério "pista forte cedo demais".
2. **Caixa:** pôr "de banners" em `c_esc_3` (2 palavras) ou acertar a DECISOES 14.
3. **Rachadura:** dar razão no mundo à troca de lado ("trinca fina e nova do lado direito; do esquerdo, nada", cerca de 8 palavras), e "de quem olha" nas duas telas.
4. **Miniatura da cópia:** `LOOP_LINHA.copia.ic` de `V11` para `GAL_B`.
5. **Prosa:** `maq_ver` sem algarismos de inventário (cerca de 10 palavras).

### 3.2 Decisões de regra do autor ("Ficou para decidir"; nenhuma baixa nota)

Iguais às da rodada 13, menos os restos de formulário, que a revisão 14 aplicou.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 13, rev. 13) | Agora (rev. 14) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança de enredo. |
| O oculto | 9,0 | **9,0** | Luz × imagem fechou e `e_hist_1` ficou mais seca. Entra a rachadura trocada de lado sem razão no mundo (menor). |
| Estrutura | 9,0 | **9,0** | Nenhuma volta, tranca ou rótulo mudou. Entra a luz que confronta a foto na volta 1 (menor). |
| Rodízio (causas A–E) | 9,0 | **9,0** | Igual nas 5 noites; a planta nova é igual em todas. |
| Jogo limpo e dedução | 9,0 | **9,0** | Fechou a imagem da luz. Entram a caixa via `c_esc_3` e o confronto na volta 1 (menores, fora da prova). |
| Personagens e fichas | 9,0 | **9,0** | `lenz_3` e `teo_cadeira` viraram cena; nenhuma fala mudou de voz. |
| Prosa | 8,5 | **9,0** | Saíram todos os fechos e rótulos que seguravam a nota em 8,5. Ficam `maq_ver` e o "Você marcou…", menores. |
| Robustez por número de jogadores | 9,0 | **9,0** | Validador sobre os mesmos bytes: APROVADO, bot até 0,05%. |
| Consistência do documento | 9,0 | **9,0** | Fecharam luz, chuva e rachadura. Entram ROTEIRO 4 × luz na V1, DECISOES 14 × tranca da caixa e a miniatura V11 (menores). |
| **Geral** | **8,9** (passou) | **9,0** (passou) | Nenhuma nota caiu por causa das correções; a Prosa subiu. |

## 5. Fim do ciclo

**A escala da história (seção 1) passou: os 9 critérios estão no mínimo ou acima, todos em 9,0.** Lista de obrigatórias (a): vazia.

Recomendação honesta: fechar o item 1 de 3.1, a luz na volta 1. É a única mudança da revisão 14 que adianta, na tela, uma comparação que os documentos guardam para a volta 2.
