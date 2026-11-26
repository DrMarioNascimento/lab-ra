# Loop v4 revisão 4 — Escala da história (seção 1) — rodada 4, avaliada do zero

Avaliador independente (não escrevi o texto; sem desconto de autoavaliação). Li por inteiro: ESCALAS_AVALIACAO_JOGOS.md, ROTEIRO-LOOP.md, FICHAS.md, LOOP-CENTRAL.md, DECISOES-V4.md, as 278 pistas de pistas_legivel.txt e atividades, finais, regras e grupos de atividades.txt. Li também o que quem joga lê fora das pistas: individual.html e sala/index.html (entrada e ajuda), game.js (passo a passo, dicas do caderno, textos de pausa, descrição das salas), loop-central.js (as 4 abas da Máquina, respostas do Anexar, mensagens das atividades, minijogos, missões), ritmo.js (finais do telão e fita da noite) e reserva/minigames.mjs. Conferi a saída do validador (r4/validar.txt: aprovado nas 5 causas com 1, 2 e 3 pessoas). Não rodei o jogo no navegador: o que digo das telas vem da leitura do código. Nada foi editado no repositório.

## 1. Nota geral

**8,7 / 10 — NÃO PASSA AINDA. 5 critérios passaram (Premissa, Rodízio, Personagens, Prosa, Robustez); 4 ficaram em 8,5 (O oculto, Estrutura, Jogo limpo, Consistência).** Tudo o que a rodada 3 pediu foi conferido nos textos atuais e está aplicado. O que segura agora são achados novos, quase todos de texto:

1. a aba Revelar mostra, desde o minuto 0, o texto do final "se a noite acabasse agora", e esse texto conta o raio e o homem de paletó descendo a escada;
2. a entrada do Lenz tem duas versões que não se encaixam (assinou o livro e passou pela roleta da frente; entrou pela porta de serviço) e a fita do telão usa as pistas da frente como prova da porta de serviço;
3. a noite da falta de força não fecha: o roteiro diz que o gerador só falha "quando o raio derruba a rede", mas a carga já está no chão no segundo 0;
4. a Dra. Sato diz "já pedi socorro" antes de saber do Téo;
5. meia dúzia de frases em que roteiro, documentos e telas se desmentem.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | O tema move o mistério: todo mundo viu e calou (`aurelio_2` "Era medo meu", `v4_braga`, `ivone_2`) e só o caderno não cala; os 5 textos do Desligar e a pergunta do telão deixam a escolha no ar. Defeito pequeno: Revelar sem consertar é esquecido às 5:00, então a pergunta "qual das duas" pende para um lado (decisão do autor). |
| O oculto (motor do mistério) | 8,5 | 9,0 | Regra de memória limpa nas pistas, mas a noite B não fecha (ROTEIRO §6-B "quando o raio derruba a rede" x `b_carga_1` no segundo 0), `sato_teo` diz "Já pedi socorro" antes de ouvir do Téo, e nenhum texto diz por que a máquina dispara às 5:00 se a chave vira às 4:10. |
| Estrutura | 8,5 | 9,0 | Escada 231/27/7/9/4 cumprida e volta 4 converge sem fechar, mas a aba Revelar mostra no minuto 0 "O raio cai, a luz volta, o homem de paletó desce a escada" (loop-central.js, linha 363) e, com o diagnóstico anexado, "a cópia continua na base"; a missão "o que derrubou o Téo" conta a queda antes da cena. |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | Listas iguais nas 5 noites, C e D com tranca (`d_teo_1`, `d_ord_1`), cena própria em A, B e E, final por causa. Defeito pequeno: na noite E o erro de anexar responde "é a opção Dois defeitos juntos" (linha 208) e, para C e D, a Dra. Sato dá o nome do defeito em vez de devolver pergunta (`man_3`). |
| Jogo limpo e dedução | 8,5 | 9,0 | Fontes e trancas em ordem, mas a entrada do Lenz se desmente (`cracha_4` e `lenz_op_1` pela roleta x `cofre_ronda` e `assim_par` pela porta de serviço) e `fh_base_perto` mostra na volta 1 "onde devia estar o número de registro, só verniz liso", com uma tranca cujo motivo (`dirceu_0`) não existe. |
| Personagens e fichas | **9,0** | 9,0 | 8 fichas completas, exceções registradas, falas coerentes (`cracha_3`, `ivone_red`, `nico_0b`, `lenz_2`, `d_teo_2`). Defeito pequeno: `sato_teo` (ela sabe antes de ouvir) e `aurelio_0` "não parece ter certeza" horas depois de assinar o laudo. |
| **Prosa** | **8,5** | **8,0** | Texto em cena, curto e com voz. Defeitos pequenos: narrador fechando a dedução em `foto_solo` e `coop_copia_ok` ("A peça exposta é cópia"), `lenz_mot_3` ("Você ainda não conhece essa voz", que pode ser falso) e a resposta "MEIO CERTO". |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem 2 a 10 fontes em salas diferentes, nenhuma presa a personagem de jogador; validador chega ao Ouro com 1, 2 e 3 pessoas nas 5 causas; papéis para 2 a 5. Defeito pequeno: `coop_veredito` cita o livro de visitas, que a dupla pode não ter. |
| Consistência do documento | 8,5 | 9,0 | Dados, roteiro e finais batem no grosso, mas: ROTEIRO §11 "a aba Revelar não conta o raio no minuto 0" x a tela; ROTEIRO §5 "Três carimbos" x o que o Anexar mostra; ROTEIRO §6-B x `b_carga_1`; LOOP-CENTRAL "o cofre não conta mais" x revisão 4; individual.html "um ambiente por volta" x a regra de andar entre salas. |

### O que conferi da rodada 3 (aplicado de fato nos textos atuais)

`man_dois_1` sem "o museu volta"; entrada e título da ajuda sem o raio; ROTEIRO §2 "menos de um minuto" e a frase das 4:10; ROTEIRO §6-D com a chave de ligar; `ceu`; `d_fus_2` com o cadeado aberto; objetivo da ajuda; título e rótulos da aba Revelar; as duas missões reescritas; minijogo da caixa na volta 2 e como pergunta; `lenz_mot_2` sem o nome e `lenz_2` com o telefone; `foto_solo` na volta 2; `teo_radio` com o envelope; `d_teo_1` e `fh_dobrada` com tranca; `d_teo_2` sem nomear o fusível; `c_modo_2` curto; ROTEIRO §6-E com um conserto por volta; os 7 pares apontados (e os outros) como objeto de ambiente; resposta do Anexar para par ("não é sinal nem leitura"); `coop_catraca_ok` e `catraca_solo` sem "ainda está aqui dentro"; `tombo_1` sem "verdadeira"; `coop_veredito` com a comparação da letra; minijogo da luz sem conclusão; `assim_leg` com dono; tabela de fontes do LOOP-CENTRAL; exceção do Nico nas FICHAS; `eco_chave` com frase de tranca; "(hoje são 8)". Não achei nenhuma dessas pendências de volta.

## 3. Abaixo do mínimo — o que corrigir

**(a)** = texto ou dado, corrigível já. **(b)** = só muda com decisão de regra (ou de enredo já fixado) do autor. Palavras: contagem aproximada. Depois de mexer em `precisaDe`, rodar o validador de novo.

### 3.1 O oculto (8,5)

(a)
1. **Noite da falta de força (B e E).** Hoje o ponteiro já está no zero no segundo 0 (`b_carga_1`, `b_carga_2`, `b_luz_1`), com a rede do museu ligada, e o ROTEIRO §6-B diz que o gerador só não dá conta "quando o raio derruba a rede". Falta dizer que a Câmara não usa a rede.
   - `man_pot_1` (existe em toda noite): *Manual, página 3: "A Câmara puxa só do gerador, nunca da rede do museu. Sem força, só um pico forte resolve. A linha do para-raios desce pelo Quadro externo do pátio até a Câmara, no Subsolo."* ~10 palavras a mais.
   - ROTEIRO §6-B, História: "Mas o gerador foi regulado para o mínimo e, quando o raio derruba a rede, ele não dá conta dela." vira *"Mas a Câmara puxa só do gerador, e o gerador foi regulado para o mínimo. Com raio ou sem raio, ele não dá conta dela."* ~25 palavras. Mesma troca na frase "quando o raio derrubou a rede" do §6-E.
2. **`sato_teo`** (ela pede socorro antes de saber que alguém caiu). Final da fala: *"...Para ele acordar, a noite tem que andar. Estou com o resgate da estrada no rádio. Peço socorro para aí agora: só chega se a noite andar."* ~14 palavras trocadas. Mesma troca no ROTEIRO §2 ("O que aconteceu com Téo") e na nota do final Ouro (§8).
3. **Por que 0:00 a 5:00.** Lenz vira a chave às 4:10 e o museu só recomeça às 5:00; nenhum texto diz por quê, e é aí que mora o engano (ele errou por segundos).
   - `raio_contagem` (toda noite, grátis), acrescentar no fim: *Na lateral, uma plaquinha de fábrica: "Depois de ligada, ela leva 50 segundos para armar."* ~15 palavras.
   - ROTEIRO §2, depois de "A máquina obedece pela metade.": *"Ela leva cinquenta segundos para armar. Dispara às 5:00 e devolve o museu a 0:00, segundos depois da queda. Lenz errou por menos de um minuto."* ~27 palavras. E na tabela: "Menos de um minuto antes de 0:00" vira *"Uns trinta segundos antes de 0:00"* (com "menos de um minuto", a conta das 4:10 pode passar de cinco minutos).
   - O número 50 é fato novo do mundo: se o autor preferir outro, vale o dele.
4. **ROTEIRO §11**, "O manual não sabe das voltas." (a página 6 diz "conserte um por volta"). Vira: *"O manual não sabe desta noite. Quando fala em 'volta', fala de cada vez que a Câmara recomeça num ensaio."* ~20 palavras.

(b) Nenhum ponto de regra neste critério.

### 3.2 Estrutura (8,5)

(a)
1. **Aba Revelar** (loop-central.js, linha 363). Hoje, em qualquer volta, ela mostra "Final se a noite acabasse agora: Faltou pouco. O museu esquece de novo. O raio cai, a luz volta, o homem de paletó desce a escada..." (minuto 0 da volta 1) e, com o diagnóstico anexado ou 2 provas, "...a cópia continua na base, cheirando a verniz". Mostrar só o nome: *"Se a noite acabasse agora: <nome do final>."*, sem o texto (o texto fica para o desfecho). Cerca de 40 palavras a menos na tela.
   - No mesmo passo, o nome de tela do final Mínimo (ritmo.js, `LOOP_FINAL_NOME`): "Faltou pouco" vira *"O museu esqueceu"* (é o subtítulo do ROTEIRO §8; "faltou pouco" no minuto 0 não é verdade). 3 palavras.
2. **Missão** (loop-central.js, linha 685): "Descubra o que derrubou o Téo." vira *"Descubra o que aconteceu com o Téo."* 6 palavras; atualizar a lista do ROTEIRO §6.

(b)
3. **Noite D adianta o engano.** `d_teo_1` ("O do patrocínio perguntou à doutora se a Câmara 'desfaz' as coisas") entrega na volta 1 o que a ata (`rev_3`) guarda para a volta 4. Ou fica assim, como preço da noite D, ou a página perde a pergunta: *"Se ela ligar inteira hoje, com o do patrocínio rondando o Subsolo, a noite some e ninguém nunca vai saber. Tirei o que segurava a energia..."* ~18 palavras (mexe no enredo da noite D).
4. **Trancas por volta sem motivo no mundo.** `nico_1` (volta 4), `cracha_3` e `lenz_2` (volta 3) não aparecem antes da hora mesmo para quem já tem tudo na mão (o número e o laudo; a escala, o bilhete e a prova). É a escada decidida na revisão 2; se o autor quiser um motivo no mundo, é texto novo de cena.
5. **Quem e por quê já estão na volta 1.** `data_2` ("Pedido do patrocinador"), `motivo_1` (contrato) e `c_esc_2` (guia "retira: patrocínio") não têm tranca: a volta 3 entrega um sobrenome, não uma virada. Se o autor quiser a virada, `motivo_1` ou `c_esc_2` sobem para a volta 2.

### 3.3 Jogo limpo e dedução (8,5)

(a)
1. **As duas entradas do Lenz.** O livro de visitas (`cracha_4`) e a roleta de entrada (`lenz_op_1`) dizem que ele entrou pela frente; o caderno de rondas (`cofre_ronda`), a foto com legenda (`assim_par`) e o ROTEIRO §2 dizem que entrou pela porta de serviço, e `arm_pendulo` avisa que quem entra por ela não passa pela roleta. As duas coisas só cabem se forem dois momentos, e isso não está escrito.
   - ROTEIRO §2, linha nova antes de "Hoje, fim da tarde": *"**Hoje, à tarde** | Lenz entra pela frente, assina o livro de visitas e passa pela roleta, para ser visto. Sai pela porta de serviço, com o crachá do Braga: a roleta da saída não registra. | Livro de visitas e roleta de entrada (Recepção), roleta da saída (Central), As Duas Listas"* ~45 palavras.
   - `lenz_op_1`: *"A roleta de entrada marcou três entradas hoje à tarde. A última foi a do patrocínio."* 2 palavras trocadas. `cracha_4`: *"Livro de visitas de hoje, à tarde: três assinaturas..."* 2 palavras.
   - Fita do telão (ritmo.js, linha 35; usa `lenz_op_1` e `cracha_4` como fonte): *"Alguém do patrocínio assina a entrada à tarde, não passa pela saída e volta de noite pela porta de serviço, com o crachá do Braga"* ~24 palavras.
2. **`fh_base_perto` e `d_f2_1`** (a falta do número é uma das três diferenças do Lado a Lado, que só abre na volta 2).
   - `fh_base_perto`: *"Você levanta um canto da peça exposta. Embaixo da base, um feltro novo, colado de ponta a ponta."* ~18 palavras.
   - `d_f2_1`: *"Você levanta um canto da peça exposta. Colado com fita embaixo da base, por cima de um feltro novo: um fusível de vidro. F2."* ~22 palavras.
   - A tranca promete motivo ("Você não tem motivo para mexer nela. Ainda.") e, fora das noites C e D, quem abre é `dirceu_0`, que não dá motivo nenhum. Texto: *Seu Dirceu torce o pano no balde: "Noite de festa é noite de chão sujo. Até embaixo daquela peça da Galeria tem pó branco. Amanhã ninguém lembra quem limpou."* ~10 palavras a mais.
3. **`lenz_op_2`** (a câmera antiga fica na Sala da fotografia, no 1º andar, por onde ele não passa em nenhuma versão). Texto: *"Entre as fotos de divulgação tiradas hoje à tarde, uma pegou de costas alguém de paletó saindo do quadro, com um crachá da casa pendurado na cintura."* ~26 palavras (casa com o item 1).
4. **`fh_pont_d`** (na noite D o ponteiro "não dá para ler", mas `a_falsa_1` vê o mesmo ponteiro tremer). Texto: *"O ponteiro de carga tem uma etiqueta de papel colada no vidro: 'aferir'. Ela tampa os números."* ~17 palavras.
5. **Resposta do Anexar na noite E** (loop-central.js, linha 208): *"MEIO CERTO: as provas combinam, mas a máquina só dá um tranco e o aviso muda de lugar. Mudou, não sumiu. A tentativa desta volta foi gasta."* Sai "Tem OUTRO defeito junto: é a opção Dois defeitos juntos". ~14 palavras a menos.
6. **Missões que fecham com a pista errada** (loop-central.js, linhas 684 e 686): a do Braga não deve fechar com o álibi (`alibi_braga`); a de "quem ganha dinheiro se a peça sumir" deve fechar também com o contrato (`motivo_1`), que responde a pergunta. Duas condições, nenhum texto.
7. **`coop_veredito`** cita o livro de visitas e a atividade só pede a escala: acrescentar `cracha_4` em `precisaDe.todas` da pista (e rodar o validador), ou trocar "No livro de visitas, uma assinatura deita igual: a do patrocínio." por *"Na própria escala, a assinatura de quem conferiu os crachás pelo patrocínio deita igual."* ~14 palavras.

(b)
8. **"Com a Dra. Sato na linha"** deixa faltar uma coisa do caderno ("você conta de cabeça uma coisa que viu e não anotou"). Para um valor, faz sentido; para o fusível F2 ou a luva, não (são objetos). Decidir se a confiança vale só para informação.

### 3.4 Consistência do documento (8,5)

Tudo (a).
1. **ROTEIRO §11**, item "Entrada" ("a aba Revelar e as missões não contam mais a troca nem o raio no minuto 0"): passa a ser verdade com 3.2-1 e 3.2-2.
2. **ROTEIRO §5, "Três carimbos".** A cena descreve carimbos um a um, placar no telão e a luz do museu baixando; a tela responde em texto, com outras palavras. Alinhar o roteiro com a tela: *"Você marca 3 pistas e escolhe o defeito. A resposta vem pista por pista: 'contou, sinal.' 'contou, sinal.' 'contou, leitura normal.' E o placar: '2 de 2 sinais e 1 de 1 leitura normal.' Lá embaixo, a Câmara dá um estalo, como quem escuta. Se você estiver no Subsolo, a Dra. Sato quase sussurra no interfone: 'Quem fez isso? Ela... ela escutou você.'"* E, no erro: *"'sinal repetido', 'tem explicação inocente, não conta', 'não é sinal nem leitura'."* ~90 palavras. (Se o autor preferir a cena dos carimbos, é tela nova, não texto.)
3. **ROTEIRO §6-B e §6-E** x `b_carga_1`: ver 3.1-1.
4. **ROTEIRO §2** sem a entrada pela frente: ver 3.3-1.
5. **LOOP-CENTRAL, "Novidades de 24/11"**: "o caderno de rondas... não conta mais como prova do trajeto" ganha *"(voltou a valer na revisão 4)"*. 6 palavras.
6. **LOOP-CENTRAL, "Missão secreta"** e **DECISOES, revisão 3**: ainda trazem "por que a Ivone não pode ter trocado" e "onde a peça verdadeira está". Copiar a redação do jogo: *"por que a tinta da Ivone não faz dela culpada"* e *"o que tem na caixa que pesa demais"*. ~20 palavras.
7. **individual.html, linha 42**: "Cada pessoa investiga um ambiente por volta." vira *"Cada pessoa anda pelas salas com o próprio caderno."* 9 palavras.
8. **Passo a passo** (game.js, linha 1247): "Fim de tarde no museu." vira *"Noite de véspera no museu."* (a volta é de noite; fim da tarde é quando o laudo foi escrito). E o ROTEIRO §3, tabela dos andares, 2º andar: *"Galeria especial (e o Saguão superior, onde toda volta começa)"*. ~14 palavras.
9. **ROTEIRO §8**, primeira linha: *"Os textos abaixo são os que cada aparelho mostra. O telão mostra a versão curta, no plural. Nomes na tela: Ouro, A noite andou, A verdade apareceu, Caso aberto, O museu esqueceu."* ~32 palavras.
10. **ROTEIRO §11**, o manual e as voltas: ver 3.1-4.

### Polimento de prosa (passou; não é exigência)

`foto_solo` e `coop_copia_ok` sem a última frase ("A peça exposta é cópia."): as três diferenças já dizem. `lenz_mot_3`: trocar "Você ainda não conhece essa voz." por *"Voz de homem, com pressa."* (quem já ouviu o "rapidinho" às 4:02 conhece).

## 4. Antes | agora | motivo

| Critério | Antes (rodada 3) | Agora (rodada 4) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança. A pergunta do telão reforça o tema. |
| O oculto | 8,5 | 8,5 | Os 6 itens da rodada 3 estão aplicados. Achados novos: força da noite B antes do raio, "já pedi socorro", disparo às 5:00 sem explicação. |
| Estrutura | 8,5 | 8,5 | Ajuda, título e rótulos da aba Revelar, missões, minijogo da caixa e o nome na volta 3 corrigidos. Achado novo: a mesma aba mostra o texto do final desde o minuto 0. |
| Rodízio (causas A–E) | 8,5 | **9,0** | Página dobrada com tranca, Seu Dirceu sem nomear o fusível, anotação da noite C curta, noite E com uma regra só. Sobra só a resposta "MEIO CERTO". |
| Jogo limpo e dedução | 8,0 | 8,5 | Pares viraram ambiente, listas e livro corrigidos, legenda com dono. Achados novos: as duas entradas do Lenz e a base "sem número" na volta 1. |
| Personagens e fichas | 9,0 | **9,0** | Sem mudança. |
| Prosa | 8,5 | **8,5** | Conclusões do narrador apontadas saíram; restam poucas e isoladas. |
| Robustez por número de jogadores | 9,0 | **9,0** | Sem mudança; validador aprovado de novo. |
| Consistência do documento | 8,0 | 8,5 | As 10 divergências da rodada 3 fechadas. Restam 5 novas, quase todas entre o roteiro e a tela. |
| **Geral** | **8,6** | **8,7** | Nenhuma nota caiu. Nenhum achado novo veio de correção técnica da revisão 4, salvo a entrada pela porta de serviço na fita do telão (item 3.3-1). |

## 5. Fim do ciclo

**Ainda não passou.** Faltam 0,5 em quatro critérios. As correções (a) somam cerca de 560 palavras e, a meu ver, bastam para os quatro chegarem a 9,0 sem decisão nova; as (b) (3.2-3 a 3.2-5 e 3.3-8) são do autor e não seguram a nota. Depois de corrigir, reavaliar a seção 1 do zero antes de seguir para a seção 2.
