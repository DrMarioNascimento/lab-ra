# Loop · A Máquina (camada central)

Arquivos: `dados/pistas-v4.json` (fonte dos dados, **278 pistas**, versão v4, **revisão 3 de 25/11/2026**) → `loop-central-dados.js` (gerado a partir dele), `loop-central.js` (regras e telas). Enredo: `ROTEIRO-LOOP.md`. Decisões aplicadas: `DECISOES-V4.md`. Botão **🧭 Máquina** no canto da tela.

- **Defeito por semente** (5 causas): A falta ajustar, B falta força, C peça presa (a máquina se segura na peça errada da base), D fusível tirado de propósito, E dois defeitos juntos (A + B, em voltas diferentes). Roteiro completo em `ROTEIRO-LOOP.md`. Os sinais de cada defeito só existem quando ele é o sorteado, mas a lista de cada sala mostra os mesmos rótulos nas 5 noites (onde o sinal não existe, o mesmo rótulo traz a coisa normal: campo `parDe` nos dados); o manual (páginas 1 a 6), a folha amassada da impressora, o apito curto da base e a caixa de "banners" com a peça verdadeira existem em todas as noites.
- **Valores por semente** (nada decorável): dia da troca (9 a 25), hora do apagão (1:00, 1:05, 1:10, 1:15 ou 1:20), número de registro (3 algarismos), ordem dos 3 pontos de ligação, número da chave do para-raios e senha do cofre do Braga (o registro de trás para a frente). Nos dados os textos usam os marcadores `{dia}` `{hora}` `{reg}` `{reg_inv}` `{ordem}` `{ch}`; `valores_padrao` (14, 1:10, 472, 274, 3-1-2, chave 3) serve para os exemplos dos documentos. O validador sorteia os valores como o jogo.
- **Lugares**: andares fixos no Loop (2º andar: Galeria especial; 1º andar: Sala de conservação, Sala dos sons, Sala da fotografia, Sala dos relógios; Térreo: Recepção, Central de monitoramento, Área de descanso, Base da limpeza, Ateliê, Sala das coleções, Oficina técnica, Oficina elétrica, Pátio; Subsolo: Câmara do tempo). A sala `corredor` chama Área de descanso em toda parte. Máquina e botão "Loop Reset" no **Subsolo · Câmara do tempo**; quadro de energia e para-raios **fora do prédio**, no Pátio; Oficina elétrica com luvas e chavinha; a luva isolante do armário da Oficina técnica (só destrava no apagão) também conta como luva.
- **Dossiê**: a partir da volta 2, anexar o diagnóstico com 3 pistas (2 sinais da máquina de tipos diferentes + 1 leitura normal), uma tentativa por volta. Também sai pela dupla "Painel e Manual". Etiquetas no caderno: "SINAL DA MÁQUINA · <o que se vê>", "LEITURA NORMAL · <onde>", "MANUAL".
- **Atividades**: em dupla (cada pessoa numa sala; palavra da dupla que muda a cada 30 s; no Raio, código de 3 números da chave + **janela única de 6 s antes até 10 s depois do raio: 1:04 a 1:20 com o padrão, 64–80 s**) ou sem dupla (mais caro: ajustar sem dupla = 3 de energia com tudo no próprio caderno; Raio sem dupla = eco gravado pela Câmara numa volta, da 3 em diante, e alavanca em outra). Nomes: Lado a Lado, As Duas Listas, Apagão Combinado, Painel e Manual, Correio do Loop (todas da volta 2), Acusação e Defesa (da volta 3); consertos Três Números (A), O Raio (B), A Verdadeira (C), Fio a Fio (D).
- **Ensaio das voltas 2 a 4, volta 5 vale.** Finais: Ouro, Desligar, Revelar, Parcial, Mínimo (textos no campo `finais` dos dados, copiados na parte 8 do roteiro).
- **Passar pista**: só na pausa, por código de 4 letras, grátis, até 3 por pessoa por pausa (sem servidor).
- **Recurso de quem joga**: "energia". 5 por volta para todo mundo, com ou sem dupla (a missão secreta cumprida dá +1 na volta seguinte). A tela cobra o custo escrito nos dados (0, 1 ou 2). Carga é só o ponteiro da máquina.
- **Cada aparelho por si**: caderno, diagnóstico e tentativa de Revelar são de cada aparelho. Para abrir uma atividade, o aparelho precisa do diagnóstico e das fontes de entrada no próprio caderno. Nos consertos em dupla, só o aparelho de quem está no Subsolo registra ensaio, meio conserto e conserto.
- **Revelar**: só na volta 5, na Recepção, uma tentativa por aparelho.
- Sem Firebase novo: tudo roda em cada aparelho. Dossiê compartilhado em tempo real exigiria regra nova do Firestore.

Simulação: rodada 1 (10 grupos, 0 conserto) → versão 2 → rodada 2 (12 grupos: 9 Desligar/Ouro, 3 Parcial) → ... → rodada 16 (20 grupos: 16 Ouro). Ver `docs/simulacao/`.

## Novidades de 24/11/2026
- **Detalhes que distraem**: 10 pistas novas (café, quadro torto, gato no quadro de energia, balde com multímetro, lâmpadas queimadas, relógio de pulso parado, rádio chiando, bilhete do eletricista, cola fresca, foto da festa). As que parecem sinal são "falsa honesta": não contam no anexar.
- **Quebra-cabeça**: o cofre do Braga (Central de monitoramento) pede 3 números. Desde a revisão 3 a senha é sorteada: o número de registro da peça principal, de trás para a frente (o bilhete preso no cofre diz isso). Desde a revisão 2 o caderno de rondas que está dentro dele não conta mais como prova do trajeto (mostra o crachá em uso no começo da noite, não a descida ao Subsolo).
- **Armadilha do pêndulo** (Sala dos relógios): puxar a corda adianta 40 s no relógio de TODO mundo. Há uma plaquinha de aviso ao lado do pêndulo, com a letra do Seu Dirceu. Cada aparelho aplica uma vez; o aviso viaja pelos campos `alarmeVolta/alarmeSeg/alarmeId` do próprio jogador na sala do Mestre (regra nova em `firebase-loop/firestore.rules`: precisa publicar as regras para valer em todos os aparelhos; sem isso vale só para quem puxou).

## Ajuste 19:40 — mais pistas (Regra das Três Pistas)
- 170 → 201 pistas. Cada sinal e cada leitura normal do diagnóstico ganhou uma segunda fonte em outra sala (sinais diegéticos: quadro de consumo, lâmpada, visor, metrônomo, medidor, armário de fusíveis).
- Caso contra o suspeito com 3 pontas: motivo, meio e oportunidade do Lenz; álibis e pistas falsas com retorno para Ivone e Braga; diário do Téo em três dias (dia da troca, 2 e 4 dias antes); 6 detalhes de clima do museu.
- Teto do validador subiu de 125 para 160 pistas ativas; validar.py APROVADO nas 5 causas.

## União Loop + Reserva (24/11)
- Base: Loop (5 causas, Mestre). A Reserva ("A peça que o museu esqueceu") fica como episódio e seus minigames viram a BANCADA do Loop.
- Bancada (`bancada.css`, `LC_MG` em loop-central.js): ao coletar a foto antiga do catálogo, a peça principal (luz rasante), a fita da câmera da porta de serviço, a caixa de banners e a escala de crachás, abre o minigame; acertar entrega a pista. Errar não gasta energia; há "Pedir uma pista".
- Ritmo: `abre_1` (cartão do Téo na Recepção, objetivo claro na volta 1, custo 0); `rev_3` (hoje é a ata da reunião com "então apaga?", o engano do Lenz); ensaio da volta 4 diz o que ainda pode falhar na execução final (por causa).
- Um jogo só: o Loop é a base. Minigames da Reserva entram como bancada em 5 pistas e em 2 atividades em dupla (Lado a Lado, As Duas Listas). Cooperação Pátio/Área de descanso já existia no Loop (Apagão Combinado).
- Desfecho mostra quais das 3 provas a equipe reuniu. A Reserva fica na entrada como "Episódio visual", sem competir com o Loop.

## Missão secreta e pista de metades (24/11)
- **Missão secreta** (8 no jogo): o que o Braga esconde; o que derrubou o Téo; quem ganha se a peça sumir; por que a Ivone não pode ter trocado; o que o Aurélio sabia; para onde vão as pegadas; onde a peça verdadeira está; o que o Nico está guardando. Cada pessoa recebe uma (card no dossiê). Cumprir rende +1 de energia na volta seguinte.
- **Pista de metades** (`assim_foto` no Pátio, `assim_leg` na Área de descanso): cada sala vê uma metade; quem já viu uma não vê a outra. Desde a revisão 2 nenhuma metade vale sozinha: a prova do trajeto é a pista `assim_par` ("Foto e legenda, juntas", Área de descanso, 1 de energia), que só abre com as duas metades no caderno (a segunda chega por "Passar pista" na pausa). Quem joga sem dupla continua fechando o trajeto pelas outras fontes do grupo.

## Vocabulário (vale desde 25/11/2026)
Palavras que o jogo usa: **número de registro** (da peça), **base** (onde a peça fica exposta), **apoio** (onde a peça verdadeira deita, no Subsolo), **luva isolante**, **ajustar / ajuste**, **luz da peça**, **modo livre**, **peça presa**, **pontos** (de ligação), **roleta** (de entrada e de saída), **energia** (de quem joga), **carga** (ponteiro da máquina). Mantidas por serem comuns: registro, disjuntor, fusível, patrocinador. A lista das palavras antigas que saíram está no fim de `DECISOES-V4.md`; os identificadores internos dos dados e do código não mudaram.

## Registro de revisão — 25/11/2026

**Por quê.** O jogo passou pela avaliação das escalas (`ESCALAS_AVALIACAO_JOGOS.md`: história, personagens, Big Five e GAMS, conferência técnica) e a **rodada 1 foi reprovada**. Como manda o ciclo de renovação das escalas, o conteúdo foi corrigido para ser reavaliado do zero. O que mudou está em `DECISOES-V4.md`; resumo:

**Mundo e história**
- Uma versão só para o Téo: confrontou o Lenz na Sala das coleções minutos antes de 0:00, foi empurrado e caiu ao lado do pote de tinta. Enquanto a Câmara gira ele "não piora nem melhora, fica guardado igual a uma peça numa vitrine". Saíram as frases em que ele encostava na Câmara ou ficava preso entre as voltas.
- Regra de memória: ninguém do museu lembra das voltas. Lembram o caderno de quem joga, o chão (objeto deixado) e a Câmara (meio conserto, eco). Uma pessoa só muda de fala quando quem joga MOSTRA algo do caderno (campos `precisaDe` + `porque`).
- O reinício é às 5:00 (não na queda de luz). Não há mais hora do dia nos textos: só minuto da volta, "fim da tarde", "ontem", "dia da troca".
- Vigia = Braga. Zelador = Seu Dirceu (figurante da limpeza).
- A Dra. Sato não diagnostica por conta própria: só comenta o que quem joga conta pelo interfone.
- O engano do Lenz ficou plantado (fala na escada às 4:10 e ata com "então apaga?"), o empurrão também (botão de paletó, pó arrastado na prateleira, primeira pegada dentro da tinta; a tinta é de marcação e brilha no escuro).
- Lenz, Aurélio, Ivone e Braga ganharam falas ao vivo próprias.
- A caixa de "banners" com a peça verdadeira existe em todas as noites; na noite C ela também é ferramenta do conserto. O manual tem as páginas 1 a 6 em todas as noites (a lista de pistas não denuncia mais a causa).
- Noites A, B e E ganharam cena própria (a tranca da Dra. Sato; o gerador no mínimo a pedido do patrocínio). Na noite D, a assinatura do cadeado só aparece para quem leu a página dobrada do diário, e há um despiste (fusível queimado da fachada).

**Escada de revelações** (a da revisão 1; a que vale hoje está na seção "Revisão 2", mais abaixo)
- Volta 1: sinais da máquina, Téo caído, cheiro de verniz, recibo, registro, raio e hora, manual, bilhete do crachá SEM assinatura.
- Da volta 2 em diante (ou para quem já viu a pista anterior): laudo, molde, páginas anteriores do diário, carta da seguradora, gravação, mancha maior, escultura.
- Nome do culpado: só com prova da cópia + escala + bilhete (Braga admite), ou mostrando o bilhete ao homem de paletó perto das 4:00, ou na atividade Acusação e Defesa.
- Pendrive do Nico: senha = número de registro da peça verdadeira (antes era a hora do apagão, que o Téo não podia saber). A gravação não dá mais o nome nem sabe do travamento.

**Regras e códigos**
- Valores sorteados pela semente (ver o cabeçalho). Janela do Raio única, acompanhando a hora sorteada.
- Etiquetas novas ("SINAL DA MÁQUINA", "LEITURA NORMAL", "MANUAL"). Anexar: 2 sinais de tipos diferentes + 1 leitura normal.
- Troca de pistas na pausa: grátis, até 3 por pessoa. Recurso de quem joga: "energia".
- Regras de jogo saíram das pistas e ficam na ajuda da Máquina (o bilhete da porta da Câmara e o painel depois do ensaio viraram objetos do mundo).
- Atividades renomeadas: "Lado a Lado" e "As Duas Listas". Missões secretas: 5.
- Vocabulário simplificado (seção acima).

**Documentos atualizados nesta revisão:** `ROTEIRO-LOOP.md` (inteiro), este arquivo, `FICHAS.md`, e avisos no topo de `ENREDO.md`, `RODIZIO.md`, `CATALOGO-ENIGMAS.md`, `GDD.md` e `README.md` (versões anteriores guardadas com o sufixo `_SUBSTITUIDO_2026-11-25`).

## Revisão 2 — 25/11/2026

**Por quê.** A rodada 2 das escalas (`ESCALAS_AVALIACAO_JOGOS.md`) também reprovou, com notas mais altas (história 7,7; vozes 4,3; motivação 3,9). As correções de dados e de documentos pedidas pelos relatórios da história e dos personagens foram aplicadas; a lista completa está na seção "Revisão 2" de `DECISOES-V4.md`. Resumo:

- **Memória:** só o caderno de quem joga, o chão e a Câmara guardam. Reescritas as pistas em que um objeto do museu "lembrava" (escala de crachás, registro de quedas de luz, foto da câmera antiga, mancha, escultura, eco da chave, fala do Seu Dirceu) e o final Revelar.
- **Escada de voltas** nos dados (`volta_min`): peça verdadeira na volta 2; nome do culpado, livro da Central, Aurélio diante do diário e gravação do telefonema na volta 3; ata, guardanapo, pendrive, voz do Téo e fala na escada na volta 4. Toda pista com `volta_min` maior que 1 tem `porque` escrito como frase do mundo (sem a palavra "volta" e sem contar a solução). Todas as mensagens de tranca foram reescritas assim.
- **Provas do Revelar:** o cheiro de verniz saiu do grupo da prova da cópia e a peça verdadeira entrou (campo novo `gruposExtras` na pista `c_peca`, que continua sendo a ferramenta do conserto da noite C); no trajeto, saíram o cofre e as metades soltas, entrou `assim_par`, e a marca de sola passou a custar 1; o nome do patrocinador saiu do livro de visitas e das Duas Listas.
- **Causas:** C e D não se entregam mais com uma pista (base que apita em toda noite, registro sem explicação, papel do Téo com tranca, folha da impressora em toda noite e sem diagnóstico); cenas novas `a_hist_2`, `b_hist_2` e `e_hist_1` (esta só na noite E).
- **Finais:** Revelar e Desligar reescritos; Desligar com um texto por causa (`texto_por_causa`, as 5).
- **Vozes:** Nico repara nas pessoas (`nico_0`, nova `nico_0b`); Braga fala mais e muda de assunto; Seu Dirceu fala com o rodo na mão; uma versão só do crachá (o Lenz pegou e deixou bilhete).
- **Salas:** a sala `corredor` chama **Área de descanso** em todo texto (a porta de serviço fica nela; a câmera da Central que olha para ela, do lado de fora, chama "câmera da porta de serviço").
- **Campos internos** acertados: `regras.volta_4`, `regras.conserto`, `regras.revelar`, `regras.escada` (novo), `trancas.*.troca_dossie` (grátis, até 3), chaves de `trancas` da prova da cópia, do trajeto, do nome, da hora e da luva.
- **Validador** (`/tmp/roda/sim/validar.py`): duas regras mudaram para acompanhar as decisões: uma pista pode constar em um segundo grupo quando declara `gruposExtras`; para as provas do Revelar, "fonte sem trava" aceita `volta_min` até 3 (o nome só sai na volta 3). Resultado: APROVADO nas 5 causas.

**Não entrou na revisão 2 (tudo fechado na revisão 3, ver abaixo):** custo da escolha final entre Desligar e Revelar; energia de quem joga sem dupla com um número só (5 em `regras`, 6 em `compensacao_solo`); folga de uma volta para a noite E sem dupla; ensaio respondendo "2 de 3" sem dizer qual valor está errado; fala da Dra. Sato nos três carimbos; minijogos e textos de tela citados no relatório de personagens.

## Revisão 3 — 25/11/2026

**Por quê.** A conferência técnica da rodada 2 (seção 4 das escalas) não passou em nenhum dos 10 itens e listou 43 correções. As 43 foram aplicadas, com as decisões do responsável para as que pediam aval. A lista completa, com as decisões, está na seção "Revisão 3" de `DECISOES-V4.md`. Resumo do que mudou:

**Código**
- Noite E: a trava do primeiro conserto (volta 3) passou a valer no navegador (o jogo lê `regras.E_volta_min_meio`).
- Revelar só na volta 5: trava no código, texto novo na aba Revelar e no passo a passo.
- A lista da sala não conta mais o tempo que falta: mostra "ainda não" (a contagem entregava a hora do raio).
- A foto do catálogo mostra o registro sorteado. As opções dos minijogos mudam de ordem com a semente e a posição da luz também (2 a 5).
- A fita da câmera da porta de serviço só tem o que a câmera vê, até o crachá encostar na porta.
- Objeto na mão aparece com nome de gente ("a luva isolante", "a peça verdadeira"). Mensagens dizem "sem dupla" e "em dupla".
- A tela cobra o custo escrito nos dados (as 5 pistas de custo 2 passam a custar 2).
- Objeto já anotado pode ser pego de novo na sala dele, sem gastar energia (acabou o beco sem saída da peça verdadeira).
- Andares fixos e um nome só para a Área de descanso; descrição de cada sala no mundo do Loop.
- Preparação com a premissa do Loop, sem as ferramentas da camada antiga. Energia: 5 por volta para todo mundo.
- Tela final sem o arquivo do caso antigo e sem a frase das perguntas de reflexão. Passo a passo com o raio no lugar do estrondo.
- Alarme em 2:40 (160 s), igual aos dados, no jogo e no telão. A faixa de aviso do museu não anuncia mais um estrondo aos 2:00 no Loop: a luz cai com o raio, na hora sorteada, e a faixa não entrega essa hora.
- Interfone da Dra. Sato: a resposta fica em até 60 palavras (só o sinal mais recente do caderno, ou o trecho dos dois avisos).
- A aba Atividades mostra a frase do mundo que explica por que a atividade ainda não abre.

**Dados** (`dados/pistas-v4.json`, de 229 para 278 pistas)
- 47 pares de mesmo rótulo e texto inocente: em cada sala, a lista tem os mesmos rótulos, o mesmo tamanho, o mesmo custo e o mesmo ícone nas 5 causas.
- Rótulos sem hora e sem "só quando". Exemplos de formato que nunca são resposta (31, 050, 0-0-0).
- Cofre com senha sorteada (marcador `{reg_inv}`).
- Pegadas que somem na porta de serviço; foto de ronda do começo da noite; linha do tempo com a saída e a volta do Lenz (4:00 na porta, 4:02 na Área de descanso, 4:10 no Subsolo).
- Seu Dirceu só na Base da limpeza. Caixa de fusíveis da Câmara num lugar só.
- Gravação do Téo em duas partes. A música da Sala dos sons só vira lembrança na segunda vez.
- Campo `destrava` refeito a partir de `precisaDe`. Marcações de essencial acertadas. Toda pista com `porque` tem a tranca escrita.
- Regras reescritas com o que o código faz (aparelho, entrada, objeto, Central, Revelar, valores errados). "Energia" no lugar de "cargas" nos campos internos. Papel "Guarda do dossiê".

**Validador e simulador de texto**
- Jogador ótimo com 1, 2 e 3 pessoas; valores sorteados como no jogo (5 sementes por rodada); aviso de prévia que muda com a causa (erro se existir numa causa só).
- Simulador: energia 5 para todo mundo, Revelar só na volta 5, tranca conferida no caderno de quem olha, valor errado sem dizer qual, Central sem devolução.
- Teto de pistas ativas por noite: de 190 para 230 (por causa dos pares).

## Checklist por volta (recalculado dos dados em 25/11/2026, revisão 3)

Conferido em `dados/pistas-v4.json` (campos `volta_min`, `volta_max`, `segundo_min`, `precisaDe`, `soNaCausa`, `parDe`, `grupos_fonte`, `atividades_coop`). Horários com `valores_padrao` (raio em 1:10); com outra hora sorteada, os horários ligados ao raio andam junto. Pistas por `volta_min`: **232 na volta 1, 26 na volta 2, 7 na volta 3, 9 na volta 4, 4 na volta 5** (278 no total). Ativas por noite: 207 (A), 208 (B), 207 (C), 207 (D), 212 (E).

**Itens na lista de cada sala, na volta 1 (igual nas 5 causas):** Subsolo 18, Oficina elétrica 12, Pátio 16, Sala dos relógios 7, Central 16, Recepção 12, Sala de conservação 10, Ateliê 19, Sala das coleções 12, Galeria 9, Oficina técnica 10, Área de descanso 12, Base da limpeza 9, Sala dos sons 5, Sala da fotografia 9.

**Horários fixos de toda volta**

| Minuto | O que acontece | Pistas que dependem do horário |
|---|---|---|
| 1:04 a 1:20 | Janela do Raio | Conserto O Raio e eco |
| 1:10 | Raio no para-raios, apagão | Para-raios no Pátio (1:10); armário de ferramentas da Oficina técnica, com a luva isolante (1:10) |
| 1:11 | — | Relógios elétricos (Sala dos relógios), gravador do rádio (Sala dos sons), chão da Área de descanso sem dupla |
| 1:13 | Gerador entra | Relógio de parede (Recepção), fita de papel do gerador (Oficina elétrica) |
| 1:15 | — | Câmera do pátio e câmera 4 (Central) |
| 1:20 | — | Câmera antiga (Sala da fotografia) |
| 2:40 | Alarme | — |
| 4:00 | O crachá do Braga abre a porta de serviço | Câmera da porta de serviço (Central) |
| 4:02 | Homem de paletó cruza a Área de descanso | Fala dele (volta 1) e "mostrar o bilhete" (volta 3) |
| 4:05 | — | Seu Dirceu aponta com o rodo (Base da limpeza) |
| 4:10 | Lenz desce e vira a chave de ligar da Câmara | "Cinco minutos de volta" (volta 1) e fala na escada (volta 4) |
| 5:00 | Reinício | — |

Antes da hora, a lista mostra "ainda não" (sem contagem).

**Fontes por fato essencial**

| Fato | Fontes (sala) | Desde | Condição |
|---|---|---|---|
| **Hora do apagão** | Sala dos relógios; Recepção; Sala da fotografia; Sala dos sons; Oficina elétrica (5 fontes) | volta 1 | Só depois do apagão (1:11 a 1:20, conforme a sala) |
| **Dia da troca** | Recibo do restauro (Ateliê); ficha de movimentação (Sala das coleções); diário do acervo (Sala de conservação) | volta 1 | Nenhuma |
| **Número de registro** | Livro de registro (Sala de conservação); foto antiga do catálogo (Sala da fotografia); etiqueta da caixa vazia (Sala das coleções) | volta 1 | Nenhuma |
| **Luva isolante** | Gancho da Oficina elétrica; carrinho de limpeza (Base da limpeza) | volta 1 | Nenhuma |
| | Armário de ferramentas da Oficina técnica | volta 1 | Só depois do apagão (1:10) |
| | Luva deixada no chão do Pátio | volta 2 | Alguém deixou em volta anterior |
| **Prova da cópia** | Comparar a foto sem dupla (Galeria) | volta 1 | Ter a foto grande do catálogo; 2 de energia |
| | Laudo do Aurélio (Sala de conservação); molde de gesso (Sala das coleções) | volta 2 | Ter sentido o cheiro de verniz |
| | A peça verdadeira, dentro da caixa de "banners" (Sala das coleções) | volta 2 | Cheiro de verniz + uma pista da caixa (peso, guia de retirada ou gravação do Braga) |
| | Lado a Lado (Galeria + Sala da fotografia) | volta 2 | Dupla; foto grande do catálogo |
| **Trajeto** | Marca de sola na porta de serviço (Área de descanso) | volta 1 | 1 de energia |
| | Câmera da porta de serviço (Central, 4:00); Seu Dirceu (Base da limpeza, 4:05); escada do Subsolo (4:10) | volta 1 | Só depois que o paletó passa |
| | Conferir as listas sem dupla (Central) | volta 1 | Registro da roleta da saída + livro de visitas; 2 de energia |
| | Chão da Área de descanso sem dupla (1:11) | volta 1 | Respingos de tinta já anotados; 2 de energia |
| | Foto e legenda, juntas (Área de descanso) | volta 1 | As duas metades no caderno (Pátio + Área de descanso); 1 de energia |
| | As Duas Listas (Recepção + Central); Apagão Combinado (Pátio + Área de descanso) | volta 2 | Dupla |
| **Crachá (o nome)** | Braga admite (Central) | volta 3 | Escala + bilhete + uma prova da cópia (laudo, Lado a Lado, foto comparada sem dupla ou a peça verdadeira na mão) |
| | Mostrar o bilhete ao homem de paletó (Área de descanso, 4:02) | volta 3 | Bilhete do armário + livro de visitas |
| | Acusação e Defesa (Central + Base da limpeza) | volta 3 | Dupla; escala + bilhete |

Não contam como prova: o cheiro de verniz; o bilhete do armário e o livro de visitas soltos; o caderno de rondas do cofre; a foto sem legenda ou a legenda sem foto, sozinhas.

### Volta 1
- **Abre:** 232 pistas (todas as salas). Sinais da máquina e leituras normais da noite, e os pares de mesmo rótulo com a coisa normal; manual, páginas 1 a 6, e a folha amassada da impressora; Téo caído, mancha, botão de paletó e prateleira; cheiro de verniz (suspeita); recibo, ficha e diário do dia da troca; as 3 fontes do registro; raio e hora do apagão; bilhete do crachá sem assinatura; escala; livro de visitas sem nome; contrato; caixa de "banners" fechada; cartão do Téo na Recepção; cofre do Braga (pede o registro, de trás para a frente) e pêndulo; Nico reparando em quem chega. Nenhuma atividade em dupla. Diagnóstico ainda fechado ("A página de diagnóstico abre na volta 2").
- **Não pode vazar:** o nome do culpado; laudo, molde, a peça verdadeira; páginas anteriores do diário, carta da seguradora, gravação; o pendrive; a ata; a causa pela lista da sala; a hora do raio pela lista.
- **Conferência:** laudo, molde, caixa aberta, diário anterior e carta têm `volta_min` 2; "Braga admite", "mostrar o bilhete", Acusação e Defesa, livro da Central e gravação têm `volta_min` 3; pendrive, voz do Téo, ata, guardanapo e fala na escada têm `volta_min` 4. O nome "Lenz" não aparece em nenhuma pista de volta 1: OK. Prévias iguais nas 5 causas, sala por sala (0 rótulos em causa única): OK. Lista sem contagem regressiva: OK.
- **Horários que importam:** o raio (anotar a hora) e a volta do paletó, às 4:00.

### Volta 2
- **Abre:** +26 pistas: laudo do Aurélio, molde de gesso, a peça verdadeira na caixa, páginas anteriores do diário (2), carta da seguradora, a mancha medida com o pé (para quem já viu a mancha), a escultura atrás da porta de vidro (para quem já viu o paletó passar), Nico explicando a Galeria (para quem já falou com ele), a música da Sala dos sons, objetos no chão (luva isolante no Pátio, peça verdadeira no Subsolo), produtos das atividades e ensaios. **Anexar o diagnóstico** (1 tentativa por volta). Atividades em dupla (`volta_min` 2): Lado a Lado, As Duas Listas, Apagão Combinado, Painel e Manual, Correio do Loop; ensaio do conserto para quem já anexou.
- **Não pode vazar:** o nome; conserto valendo (só na volta 5); eco do Raio (só da volta 3); meio conserto da noite E (só da volta 3); Revelar (só na volta 5).
- **Conferência:** ensaios têm `volta_min` 2 e `volta_max` 4; consertos finais têm `volta_min` 5: OK. Eco: `volta_min_gravar` 3 e a pista do eco com `volta_min` 3: OK. Noite E: `regras.E_volta_min_meio` 3, lido pelo jogo e pelo simulador: OK.
- **Horários que importam:** a luva isolante só sai do armário depois do apagão (1:10).

### Volta 3
- **Abre:** +7 pistas: Braga admite, Acusação e Defesa (atividade e produto), mostrar o bilhete a quem entra pela porta de serviço (4:02), livro da Central, Aurélio diante do diário e do laudo, gravação do telefonema, eco da chave. Eco do Raio (gravar no Pátio dentro da janela). Noite E: primeiro conserto pode ficar gravado na Câmara.
- **Não pode vazar:** pendrive, voz do Téo, ata, guardanapo; conserto valendo; Revelar; os dois consertos da noite E na mesma volta (em dupla).
- **Conferência:** trava da noite E no código: OK.
- **Horários que importam:** janela do Raio (1:04 a 1:20) para o eco; 4:02 para mostrar o bilhete.

### Volta 4
- **Abre:** +9 pistas: pendrive do Nico (registro + laudo), voz do Téo no rádio e a continuação da gravação (um texto por noite), ata da reunião, guardanapo no paletó reserva, fala do homem de paletó na escada (4:10), o painel depois do ensaio (para quem já ensaiou). Ensaio geral: a máquina responde REAGE / NÃO REAGE, diz quantos valores estão certos (nunca qual) e avisa o que ainda pode falhar. Quem fica na Central de monitoramento confirma em voz alta quem está onde.
- **Não pode vazar:** conserto valendo; Revelar.
- **Conferência:** última volta dos ensaios (`volta_max` 4): OK. Noite E: se o primeiro conserto não foi gravado até aqui, não há mais como chegar ao Desligar em dupla.
- **Horários que importam:** janela do Raio; quem vai apresentar precisa das 3 provas no próprio caderno até a pausa (passar pista: até 3).

### Volta 5
- **Abre:** +4 pistas (os consertos finais A, B, C, D). Conserto valendo. **Revelar**: só nesta volta, na Recepção, antes de 5:00, uma tentativa por aparelho, com 1 prova da cópia + 1 do trajeto + 1 do crachá no caderno de quem apresenta. Papéis: Mão A, Mão B, Central, Porta-voz, Guarda do dossiê.
- **Não pode vazar:** nada mais a segurar. Não há ensaio nesta volta.
- **Conferência:** finais no campo `finais`: Desligar (causa certa, diagnóstico anexado, conserto na volta 5; texto próprio para cada uma das 5 causas), Revelar (3 provas, Recepção, volta 5, até 300 s), Ouro (os dois na volta 5), Parcial, Mínimo: OK. Trava do Revelar no código (`lcRevelar`): OK.
- **Horários que importam:** janela do Raio (noites B e E); 5:00 é o limite do Revelar.

### Pendências
Nenhuma aberta. O que a revisão 2 deixou em aberto foi fechado assim:

| Assunto | Como ficou | Quem decidiu |
|---|---|---|
| Energia de quem joga sem dupla | 5 por volta para todo mundo | Responsável, 25/11/2026 |
| Revelar | Só na volta 5, na Recepção | Responsável, 25/11/2026 |
| Senha do cofre | Sorteada: o registro de trás para a frente | Responsável, 25/11/2026 |
| Pegadas | Somem na porta de serviço; linha do tempo com a saída e a volta | Responsável, 25/11/2026 |
| Custo da escolha final | Fica como o código faz: Desligar e Revelar não têm custo extra | Regra desta revisão: vale o código, sem mecânica nova |
| Noite E sem dupla | Fica como o código faz: primeiro conserto da volta 3 em diante; sem dupla os dois podem ser gravados na mesma volta | Regra desta revisão |
| Ensaio "2 de 3" | Já é o que o código faz: diz quantos, nunca qual. Dados e simulador alinhados | Regra desta revisão |
| Papel Central, bloqueio do Apagão Combinado, objeto de volta à mão | Dados e documentos dizem o que o código faz (Central falada; sem bloqueio; objeto pode ser pego de novo) | Regra desta revisão |
| Trava da noite E no navegador | Corrigida no código | Correção 1 da conferência técnica |
| Textos que ficavam no código | Minijogos e dica da aba Revelar reescritos; missões secretas listadas (8) | Correções 5 a 8 |
