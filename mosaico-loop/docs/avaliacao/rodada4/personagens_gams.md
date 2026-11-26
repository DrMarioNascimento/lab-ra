# Loop v4 (revisão 4) — Avaliação, rodada 4 — Seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliação feita do zero, sobre os textos atuais. Li por inteiro: ESCALAS_AVALIACAO_JOGOS.md, FICHAS.md, DECISOES-V4.md, pistas_legivel.txt (278 pistas), e a avaliação da rodada 3 (só para a tabela do item 4). De atividades.txt li as 10 atividades, os 5 finais e as regras até "revelar" (o trecho final das regras ficou de fora). Do ROTEIRO-LOOP.md li as partes 1, 2, 5, 6 (atividades em dupla), 7 e 11; não li as partes 3, 4, 8, 9 e 10. De loop-central.js li as linhas 1 a 330 inteiras e, do resto, todos os textos de tela, minijogos e missões. De game.js li o `TOUR` e os textos da pausa; de ritmo.js, tudo; de telao.mjs, os textos. Vi 14 das 29 telas de r4/vis (entrada, sala, individual, lista de pistas, pista coletada, Máquina/Atividades, Máquina/Revelar, pausa, simulador na pausa da volta 4, simulador no fim e 4 páginas do telão final). Não editei nada no repositório.

Aviso de autoavaliação: não escrevi nenhum texto do jogo; não há desconto de autoria a aplicar.

---

## 1. Nota geral

**NÃO PASSA ainda.** Seção 2: 4 de 5 itens passam (o item "falas e ações não contradizem a ficha" cai por um detalhe de 4 palavras). Seção 3.1: **4,8** (mínimo 4,5), ninguém abaixo de 4: **passa**. Seção 3.2: **4,3** (mínimo 4,5): **não passa**. Nenhuma nota caiu em relação à rodada 3. Tudo o que falta para passar é texto ou dado; nenhuma mudança de mecânica é obrigatória.

---

## 2. Tabela por critério

### 2.A Seção 2 — checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md traz os 8 com papel, 5 traços, honestidade-humildade e as 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria" e "o que vê". |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 de 18 traços em negrito têm cena, e todo id citado na tabela da ficha existe nos dados com o texto que a ficha descreve (tabela 2.B). |
| Falas e ações não contradizem a ficha | **Não passa** | coerente | Um ponto só: a ficha do Téo diz "assina **sempre** '— T.', nos bilhetes e nas páginas do diário", e dois bilhetes dele estão sem assinatura: `man_cal_3` (envelope "Copiei do manual da doutora...") e `d_ord_1` (papel "Ordem pra religar..."). As duas contradições da rodada 3 (Dra. Sato agindo dentro do prédio; manual de entrada com gente de fora do elenco) estão resolvidas. Correção A1. |
| Exceções registradas na ficha | **Passa** | completo | 10 exceções escritas, incluindo a nova "Dra. Sato na linha" (ela dita e confere; "Desta vez eu confio" é confiança dada uma vez). Os três botões "com a Dra. Sato na linha" respeitam a exceção: quem prende a trava com o cinto e a chave com a luva é quem joga. |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura por 14 termos (nomes das escalas e dos traços) em game.js, loop-central.js, loop-central-dados.js, ritmo.js, noites.js, noites-motor.js, coop.mjs, rooms.mjs, os HTML, sala/ e telão, mais pistas e atividades: zero ocorrências. |

### 2.B Traço extremo × cena (conferido pista por pista)

| Pessoa | Traço extremo | Cena | Ok? |
|---|---|---|---|
| Aurélio | Ansiedade alta | `aurelio_0` ("Está linda, não está?" Ele não parece ter certeza), `falsa_1` (respira pela boca) | sim |
| Aurélio | Foge da lacuna | `aurelio_1` ("Eu demorei para acreditar.") | sim |
| Aurélio | Não aguenta pressão | `aurelio_2` ("Disse a mim mesmo que era cansaço dele. Era medo meu.") | sim |
| Téo | Honestidade alta | `data_3`, `d_teo_1` ("Desculpa, Dra. Sato."), `d_fus_2b` ("Fui eu. — T."), `teo_radio` (recusa o envelope) | sim |
| Téo | Não larga a lacuna | `teo_d1` ("Sozinho pra quê?"), `v4_teo` ("Eu sei o que eu carrego.") | sim |
| Téo | Aceita risco | `teo_d3` ("Hoje à noite eu falo com ele."), `teo_radio` ("cara a cara") | sim |
| Ivone | Método | `ivone_1x` ("Eu não perco pote."), `v5_ivone` (4,2 kg) | sim |
| Ivone | Pouca curiosidade pelas pessoas | `ivone_2` ("Devia ter perguntado por quê."), `ivone_red` (aponta sem olhar) | sim |
| Braga | Quer agradar | `traj_aviso`, `c_esc_3` ("Café?"), `cracha_3` ("Quer um café?") | sim |
| Braga | Não aguenta pressão | `braga_1` (dá de ombros rápido demais), `dis_cafe` (esconde a xícara), `v4_braga` (riscado duas vezes) | sim |
| Lenz | Pouca amabilidade | `lenz_0` (não espera a resposta), `lenz_1` ("Nem você.") | sim |
| Lenz | Pouca honestidade | `lenz_2` ("Eu devolvo tudo que eu pego."), `cracha_2` | sim |
| Lenz | Não aguenta pressão | `traj_3` (fala sozinho na escada), `lenz_mot_3` ("ou eu não tenho mais empresa") | sim |
| Lenz | Busca risco | `v5_lenz` ("Peça por fora: +?", "ninguém confere a base") | sim |
| Dra. Sato | Abertura | `man_anc_2` ("Nunca aconteceu, mas vai que"), `man_2` ("Ou não.") | sim |
| Dra. Sato | Não larga a lacuna | `man_3` ("Me conta o que você viu com os seus olhos."), `a_hist_1`, `e_hist_1` | sim |
| Nico | Pouca ordem | `nico_0b` (perde o fio), `fh_fusivelx` (fusível para a cafeteira) | sim |
| Nico | Muita atenção às pessoas | `nico_0` ("cara de quem não jantou"), `nico_0b` (o Braga e o cinto) | sim |

### 2.C Contradições e ressalvas

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | `man_cal_3`, `d_ord_1` × ficha do Téo | Dois bilhetes do Téo sem "— T.". A ficha diz "sempre". Todos os outros 9 textos dele estão assinados. | contradição (pequena) |
| 2 | Missões secretas, `LC_MISSOES` (loop-central.js) × fichas do Braga e da Ivone | A missão "o que o Braga está escondendo" fica cumprida com `braga_ali` (o álibi dele), que não é o segredo. A missão "por que a tinta da Ivone não faz dela culpada" aceita `ivone_2` (fala da limpeza, não da tinta) e não aceita `ivone_red` nem `ivone_1x`, que são a resposta. | ressalva (dado) |

Visto de passagem, fora do meu recorte (vale para as seções 1 e 4):
- ROTEIRO-LOOP.md, partes 2 e 5, cita falas do pendrive que não estão no jogo ("Quem pediu a 'limpeza' foi o patrocínio", "Eu carrego essa peça há seis anos"). O jogo (`teo_radio`) fala do envelope recusado.
- No interfone (`man_3`), a resposta ao sinal da base apitando ("Então ela não reconhece a peça que está na base. Procura 300 anos e acha outra coisa.") já é o diagnóstico da noite C inteiro; as outras cinco respostas devolvem pergunta.
- Telão final, página "A noite" (tl_result_1.png): a 10ª linha da fita ("5:00 · Por que a máquina travou") aparece cortada no pé do cartão na captura de 972×547.

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só por escrito e inconfundível: peso e medida ("Eu sei o que eu carrego", `v4_teo`), ordem curta ("Tinta não mente.", `teo_d3`), olho de quem monta ("Ele nem olhou pra ela. Olhou pra base.", `teo_d1`), e a recusa do envelope (`teo_radio`). |
| Lenz | 5,0 | 4 | Pressa, favor e ameaça educada em toda fala: `lenz_0` ("Ótimo, ótimo." e não espera), `lenz_2` ("Eu devolvo tudo que eu pego." ... "Lenz. Agora não."), `lenz_1` ("Ninguém quer confusão hoje. Nem você."), `b_hist_2` ("Cada litro de diesel sai do nosso bolso."). Nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Seca e com número nas quatro falas: `ivone_1x` ("Pote 7, vermelho... Eu não perco pote."), `ivone_2` (bate o dedo na linha), `ivone_red` ("O pote saiu daqui. Eu, não."), `v5_ivone` ("Limpei, pesei, devolvi: 4,2 kg."). |
| Dra. Sato | 5,0 | 4 | Constante em mais de 15 textos: "ela", pergunta de volta, humor seco (`man_3`, `man_2` "Ou não.", `e_hist_1` "Ninguém.", `fh_ficha_bc` "Levar o guarda-chuva."). O molde "pode ser duas coisas" sobrou numa resposta só. Em `sato_teo` ela responde sobre a máquina antes de perguntar da pessoa: é a ficha. |
| Seu Dirceu | 5,0 | 4 | Figurante com voz em sete textos: `traj_2` ("Nem boa-noite."), `ivone_ali_2` ("passei pano ali três vezes"), `c_anc_3` ("Já avisei duas vezes."), `assim_leg` ("Quem sujou meu chão?"), `d_teo_2` agora termina em "Eu reparo." |
| Aurélio | 4,5 | 4 | As três falas perguntam ou recuam (`aurelio_0`, `aurelio_1` "Você também sentiu?", `aurelio_2`). Meio ponto fora: a "palavra de acervo" da ficha só existe no laudo (`falsa_2`), e as três falas ficam na mesma sala. |
| Braga | 4,5 | 4 | Fala muito e foge do assunto (`traj_aviso`, `c_esc_3` "Meu cunhado também mexe com transporte. Café?", `cracha_3` "Tá. ... eu deixei quieto."). Meio ponto fora: o café fecha as quatro falas ao vivo e vira cacoete previsível; `v4_braga` é confissão em frase limpa, sem o jeito de quem "fala muito". |
| Nico | 4,5 | 4 | Três falas, as três dele (`nico_0`, `nico_0b`, `nico_1` "pela primeira vez ele não pede desculpa"). Meio ponto fora: é pouco texto para o guia do museu, tudo numa sala, e a segunda fala só abre da volta 2. |
| **Média (8 com fala)** | **4,8** | **4,5** | 38,5 ÷ 8 = 4,81. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 4,0 | Puxa sozinha: o museu que esquece, as pessoas que só mudam de fala quando você mostra o caderno, as trancas com motivo no mundo, o cofre, o pêndulo, O Raio, e agora Painel e Manual e Lado a Lado com informação diferente em cada tela. Tira ponto: (1) três dos cinco minijogos de sala têm a resposta no próprio enunciado: `tombo_2` ("A foto foi tirada de baixo. Em que parte você procura o número?"), `traj_1` (ordenar 4 cenas que só têm uma ordem possível) e `c_peca` ("A que pesa demais para banner", frase que a pista anterior já deu); (2) Acusação e Defesa, a atividade em dupla que dá o nome do culpado, é só trocar uma palavra: o papel diz "monta a acusação" e a tela não mostra escala nem bilhete. |
| Integrada | 4,5 | Papel em frase clara nas duas entradas (individual: "a única pessoa"; sala: "quem lembra das voltas"), 8 missões secretas com convite a blefar, papel da última volta escolhido na pausa da volta 4 e mostrado no telão, "Quem trouxe" com nome em cada fato da fita, e uma escolha final que é de valor (consertar ou contar). Falta para 5: a missão pode ser dada como cumprida pela pista errada (2.C, linha 2). |
| Identificada | 4,5 | O diagnóstico não é mais pulável (a leitura do painel não diz o defeito; quem dá nome é a pessoa), o acerto e o erro são devolvidos com motivo, o telão fecha com o final da história, a fita de 10 fatos e a pergunta para conversar. Falta para 5: a linha do defeito da noite cortada na fita (a conferir em TV) e o interfone que entrega a noite C numa resposta. |
| Externa (menos é melhor) | 1,5 → invertida 4,5 | Quase sem cara de tarefa. Restos de burocracia em mensagens ("Tentativa da volta gasta.", "Forma certa. (O jogo ainda confere se aponta o defeito.)") e o botão "Registrar meu desfecho". |
| Amotivação (menos é melhor) | 2,0 → invertida 4,0 | Os problemas da rodada 3 saíram (manual de entrada, caixa, "retorno", dicionário, telão). O que ainda faz a pessoa travar: (1) os papéis de Três Números ("mostram símbolos, não números") e Fio a Fio ("três fios de cores diferentes") prometem o que a tela não mostra, e é a tela do conserto em 3 das 5 noites; (2) a pausa das voltas 2 e 3 diz "Grave o gesto no Pátio ou deixe a peça verdadeira no Subsolo" em toda noite, mesmo quando nenhuma das duas coisas existe (e fala em "peça verdadeira" para quem ainda não achou); (3) o final Mínimo se chama "Faltou pouco"; (4) em As Duas Listas o papel manda ler um livro que a tela não mostra; (5) "Dois consertos na mesma volta viram meio conserto cada um." |
| **Nota da escala** | **4,3** | (4,0 + 4,5 + 4,5 + 4,5 + 4,0) ÷ 5. Mínimo 4,5. **Não passa.** |

Introjetada: neutra, não pontua.

**O que não deu para julgar sem jogadores reais (não puni):**
- se 5 de energia diante de 12 a 14 itens por sala dá gosto de escolha ou sensação de falta;
- se os 10 segundos de caminhada criam tensão ou tédio;
- se falar em voz alta de salas diferentes funciona numa sala de aula cheia;
- se alguém de fato blefa a missão secreta na pausa;
- o ritmo das voltas 3 e 4 para quem já tem diagnóstico e ensaio;
- o prazer de girar a peça 3D e de mexer na luz em `falsa_1` (é manuseio, não dedução; por ser a primeira pista da noite e de graça, não descontei);
- se ditar valores que os dois já têm no caderno (Três Números, Fio a Fio) é sentido como cooperação;
- a fita do telão numa TV de verdade (vi só a captura pequena).

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

Total aproximado: (a) 11 correções de texto ou dado, ~330 palavras, nenhuma muda enredo; (b) 2 mudanças de mecânica, opcionais.

### (a) Texto e dado

**A1. Assinatura do Téo — `man_cal_3` e `d_ord_1` (4 palavras).** Acrescentar ` — T.` antes da aspa final das duas. Fecha o item da seção 2.

**A2. Papéis de Três Números — atividades, `coop_calibrar` (~70 palavras).** Dizer o que a tela faz.
- `papelA`: `No Subsolo, você digita os 3 números nos mostradores: dia, hora e registro, nessa ordem. Digite o que ouvir e repita em voz alta.`
- `papelB`: `No Ateliê de descobertas, você dita em voz alta o dia em que mexeram na peça, a hora da queda de luz e o número de registro, do jeito que estão no seu caderno. Você não vê o painel.`
- `dicaTela.A`: `Digite só o que te ditarem. Repita em voz alta.`

**A3. Papéis de Fio a Fio — atividades, `coop_circuito` (~65 palavras).**
- `papelA`: `No Subsolo, de luva, você encaixa o fusível F2 e digita a ordem dos 3 pontos do jeito que ouvir. Quando terminar, diga "liguei".`
- `papelB`: `Na Oficina elétrica, você dita a ordem dos 3 pontos que está no seu caderno e, quando ouvir "liguei", arma o disjuntor da Câmara. Você não vê os pontos.`
- `dicaTela.A`: `Digite a ordem que te ditarem: três números com hífen.`

**A4. Acusação e Defesa com informação em cada tela — atividades, `coop_acusacao_defesa`, e `LC_MGA` (~90 palavras).** Usa o que Lado a Lado já usa (`telaPapel` e a pergunta da dupla); não é mecânica nova.
- `papelA`: `Na Central de monitoramento, a sua tela mostra a escala de crachás. Você lê em voz alta.`
- `papelB`: `Na Base da limpeza, a sua tela mostra o bilhete do armário. Você lê em voz alta e os dois respondem à mesma pergunta.`
- `telaPapel.A`: título `A escala de crachás`, itens `Porta de serviço: crachá BRAGA`, `liberado até o fim do turno`, `o Braga está sentado aqui, de cinto vazio`.
- `telaPapel.B`: título `O bilhete do armário`, itens `papel de bloco de hotel`, `"peguei teu crachá emprestado. Devolvo amanhã."`, `sem assinatura, letra corrida, deitada para a direita`.
- `LC_MGA.coop_acusacao_defesa`: `{ativ:'livro', resp:0, nome:'Pôr a escala e o bilhete lado a lado', texto:'O crachá é do Braga. O que mostra que a mão na porta não era a dele?', opcoes:['O Braga está na Central, de cinto vazio, e o bilhete diz que outra pessoa pegou','O bilhete não tem assinatura','O turno do Braga já acabou'], dicas:['Leia a escala em voz alta. Depois, o bilhete.','Uma pessoa não está em dois lugares.']}`

**A5. As Duas Listas com as listas na tela — atividades, `coop_entrou_nao_saiu` (~35 palavras).**
- `telaPapel.A`: título `Livro de visitas: quem entrou`, itens `alguém do patrocínio (assinatura quase um risco)`, `um entregador de flores`, `uma fotógrafa`.
- `telaPapel.B`: título `Roleta da saída: quem saiu`, itens `o entregador de flores`, `a fotógrafa`, `mais ninguém de fora`.

**A6. Minijogos que pedem o caderno — loop-central.js, `LC_MG` (~95 palavras).**
- `traj_1` (troca a ordenação por pergunta que liga duas pistas da mesma sala): `{ativ:'livro', resp:0, nome:'Olhar a fita da porta de serviço', texto:'Alguém de paletó encosta um crachá na porta de serviço. Pela escala de hoje, de quem é o crachá que abre essa porta?', opcoes:['Do Braga','Do Seu Dirceu','Do Nico'], dicas:['A escala de crachás está nesta sala.','A escala diz qual crachá abre a porta. Não diz quem está com ele.']}`
- `c_peca`: opções `['A que entrou leve no dia da troca e hoje pesa','A que chegou hoje, ainda com fita','A que está em cima das outras']`, dicas `['A lista de entregas desta sala anotou o peso.','Banner é pano e papel.']`
- `tombo_2`: tirar a entrada de `LC_MG` (a pista entra direto). A pergunta não pede nada além do próprio enunciado.

**A7. Pausa das voltas 2 e 3 — game.js, linhas 908 e 909 (~35 palavras).**
- Volta 2: `Sem dupla? Alguns consertos pedem duas voltas. Veja "Sem dupla?" na Máquina, aba Atividades.`
- Volta 3: `Sem dupla, esta é a última volta para deixar pronto o que o conserto pede em duas voltas.`

**A8. Missões secretas — loop-central.js, `LC_MISSOES` (dado).**
- Braga: `ok:() => lcTem('cracha_3') || lcTem('v4_braga') || lcTem('cofre_ronda')` (sai `alibi_braga`).
- Ivone: `ok:() => lcTemGrupo('alibi_ivone') || lcTem('ivone_red') || lcTem('ivone_1x')` (sai `ivone_2`).

**A9. Nome do final Mínimo — ritmo.js, `LOOP_FINAL_NOME` (3 palavras).** `'Mínimo': 'O museu esqueceu'` (é o título que o roteiro já usa).

**A10. "Sem dupla?" — loop-central.js, aba Atividades (~12 palavras).** Trocar a última frase por: `Na noite de dois defeitos, é um conserto por volta.`

**A11. Fita do telão — sala/telao (visual).** Conferir em 1920×1080 se a 10ª linha ("5:00 · Por que a máquina travou") cabe inteira; se não couber, reduzir a altura das linhas ou deixar o cartão rolar.

### (b) Mecânica (opcionais; não são necessárias para passar)

**B1. Três Números e Fio a Fio com informação de verdade.** Se a preferência for cumprir a promessa antiga em vez de reescrever o papel (A2, A3): a tela do Subsolo mostra símbolos (ou cores) e a da outra sala mostra a legenda (ou o esquema cor → número), no mesmo molde de Painel e Manual (`telaPapel` + `perguntaB`).

**B2. `tombo_2` com o número sorteado.** Em vez de tirar o minijogo (A6): a foto mostra a base de ponta-cabeça e a pessoa escolhe entre o registro, o registro invertido e um terceiro número. Pede que as opções do minijogo aceitem os marcadores `{reg}` e `{reg_inv}`.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (r3) | Agora (r4) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem mudança. |
| 2.4 traço extremo com cena | Passa (16 de 16) | Passa (18 de 18) | Contei os 18 negritos da ficha (a rodada 3 juntou dois pares). Todos com cena. |
| 2.4 falas não contradizem a ficha | Não passa (2) | Não passa (1, pequena) | Saíram a Dra. Sato agindo no prédio e o manual de entrada. As três páginas do diário ganharam "— T."; sobraram dois bilhetes sem assinatura. |
| 2.4 exceções registradas | Passa | Passa | Entrou "Dra. Sato na linha". |
| 2.4 sem nome de escala no texto público | Passa | Passa | Varredura limpa. |
| Téo | 5,0 | 5,0 | Mantém; ganhou o envelope recusado. |
| Lenz | 5,0 | 5,0 | Mantém; o nome agora nasce na boca dele (`lenz_2`). |
| Ivone | 5,0 | 5,0 | Mantém. |
| Aurélio | 4,5 | 4,5 | Sem mudança. |
| Braga | 4,5 | 4,5 | Sem mudança nas falas. |
| Dra. Sato | 4,5 | 5,0 | Saiu o molde repetido do interfone e ela não age mais dentro do prédio. |
| Nico | 4,5 | 4,5 | Sem mudança. |
| Seu Dirceu | 4,5 | 5,0 | `d_teo_2` reescrita com a voz dele ("Eu reparo."). |
| **3.1 média** | **4,7** | **4,8** | Sobe 0,1. Passa. |
| Intrínseca | 4,0 | 4,0 | Painel e Manual, Lado a Lado e a caixa melhoraram; seguram a nota os três minijogos de resposta óbvia e Acusação e Defesa só com palavra. |
| Integrada | 4,0 | 4,5 | Papéis da última volta na tela e no telão; frase própria para o jogo de sala. |
| Identificada | 4,0 | 4,5 | Diagnóstico não pulável, final da história e fita completa no telão, pergunta para conversar. |
| Externa (bruta) | 1,5 | 1,5 | Saíram "não tira ponto" e "sem punição"; sobram mensagens burocráticas. |
| Amotivação (bruta) | 2,0 | 2,0 | Os cinco pontos da rodada 3 saíram; ficaram os papéis de conserto que prometem o que a tela não mostra e a dica da pausa. |
| **3.2 nota** | **4,1** | **4,3** | Sobe 0,2; falta 0,2. |

Nenhuma nota caiu. Das correções desta rodada, A4, A5 e A6 mexem em atividade e em minijogo que dão pista essencial (pedem nova rodada do validador e reconferência de jogo limpo); as outras não tocam em enredo nem em regra.

## 5. Fim do ciclo

**Nem todas as escalas passaram.** Seção 2: 4 de 5 itens. Seção 3.1: 4,8, passa. Seção 3.2: 4,3 de 4,5, não passa. O ciclo de renovação continua.
