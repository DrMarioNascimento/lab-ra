# Loop · A Máquina (camada central)

Arquivos: `dados/pistas-v4.json` (fonte dos dados, **281 pistas**, versão v4, **revisão 14 de 26/11/2026**) → `loop-central-dados.js` (gerado a partir dele), `loop-central.js` (regras e telas). Enredo: `ROTEIRO-LOOP.md`. Decisões aplicadas: `DECISOES-V4.md`. Botão **Máquina** na barra de baixo, com a miniatura da Câmara.

- **Defeito por semente** (5 causas): A falta ajustar, B falta força, C peça presa (a máquina se segura na peça errada da base), D fusível tirado de propósito, E dois defeitos juntos (A + B, em voltas diferentes). Roteiro completo em `ROTEIRO-LOOP.md`. Os sinais de cada defeito só existem quando ele é o sorteado, mas a lista de cada sala mostra os mesmos rótulos nas 5 noites (onde o sinal não existe, o mesmo rótulo traz a coisa normal: campo `parDe` nos dados); o manual (páginas 1 a 6), a folha amassada da impressora, o apito curto da base e a caixa de "banners" com a peça verdadeira existem em todas as noites.
- **Valores por semente** (nada decorável): dia da troca (9 a 25), hora do apagão (1:00, 1:05, 1:10, 1:15 ou 1:20), número de registro (3 algarismos), ordem dos 3 pontos de ligação, número da chave do para-raios e senha do cofre do Braga (o registro de trás para a frente). Nos dados os textos usam os marcadores `{dia}` `{hora}` `{reg}` `{reg_inv}` `{ordem}` `{ch}`; `valores_padrao` (14, 1:10, 472, 274, 3-1-2, chave 3) serve para os exemplos dos documentos. O validador sorteia os valores como o jogo.
- **Lugares**: andares fixos no Loop (2º andar: Galeria especial; 1º andar: Sala de conservação, Sala dos sons, Sala da fotografia, Sala dos relógios; Térreo: Recepção, Central de monitoramento, Área de descanso, Base da limpeza, Ateliê, Sala das coleções, Oficina técnica, Oficina elétrica, Pátio; Subsolo: Câmara do tempo). A sala `corredor` chama Área de descanso em toda parte. Máquina e botão "Loop Reset" no **Subsolo · Câmara do tempo**; Quadro externo e para-raios **fora do prédio**, no Pátio; Oficina elétrica com luvas e chavinha; a luva isolante do armário da Oficina técnica (só destrava no apagão) também conta como luva.
- **Dossiê**: a partir da volta 2, anexar o diagnóstico com 3 pistas (2 sinais da máquina de tipos diferentes + 1 leitura normal), uma tentativa por volta. A dupla "Painel e Manual" entrega a leitura completa do painel como pista: no Anexar ela vale sozinha, mas quem escolhe o defeito é a pessoa (revisão 4). Etiquetas no caderno: "SINAL DA MÁQUINA · <o que se vê>", "LEITURA NORMAL · <onde>", "MANUAL".
- **Atividades**: em dupla (cada pessoa numa sala; palavra da dupla que muda a cada 30 s; no Raio, código de 3 números da chave + **janela única de 6 s antes até 10 s depois do raio: 1:04 a 1:20 com o padrão, 64–80 s**) ou sem dupla (mais caro: ajustar sem dupla = 3 de energia com tudo no próprio caderno; Raio sem dupla = eco gravado pela Câmara numa volta, da 3 em diante, e alavanca em outra). Nomes: Lado a Lado, As Duas Listas, Apagão Combinado, Painel e Manual, Correio do Loop (todas da volta 2), Acusação e Defesa (da volta 3); consertos Três Números (A), O Raio (B), A Verdadeira (C), Fio a Fio (D).
- **Ensaio das voltas 2 a 4, volta 5 vale.** Finais: Ouro, Desligar, Revelar, Parcial, Mínimo (textos no campo `finais` dos dados, copiados na parte 8 do roteiro).
- **Passar pista**: só na pausa, por código de 4 letras, grátis, até 3 por pessoa por pausa (sem servidor).
- **Recurso de quem joga**: "energia". 5 por volta para todo mundo, com ou sem dupla (a missão secreta cumprida dá +1 na volta seguinte). A tela cobra o custo escrito nos dados (0, 1 ou 2). Carga é só o ponteiro da máquina.
- **Cada aparelho por si**: caderno, diagnóstico e tentativa de Revelar são de cada aparelho. Para abrir uma atividade, o aparelho precisa das fontes de entrada no próprio caderno; só os consertos pedem também o diagnóstico. Nos consertos em dupla, só o aparelho de quem está no Subsolo registra ensaio, meio conserto e conserto.
- **Revelar**: só na volta 5, na Recepção, uma tentativa por aparelho.
- Sem Firebase novo: tudo roda em cada aparelho. Dossiê compartilhado em tempo real exigiria regra nova do Firestore.

Simulação: rodada 1 (10 grupos, 0 conserto) → versão 2 → rodada 2 (12 grupos: 9 Desligar/Ouro, 3 Parcial) → ... → rodada 16 (20 grupos: 16 Ouro). Ver `docs/simulacao/`.

## Novidades de 24/11/2026
- **Detalhes que distraem**: 10 pistas novas (café, quadro torto, gato no quadro de energia, balde com multímetro, lâmpadas queimadas, relógio de pulso parado, rádio chiando, bilhete do eletricista, cola fresca, foto da festa). As que parecem sinal são "falsa honesta": não contam no anexar.
- **Quebra-cabeça**: o cofre do Braga (Central de monitoramento) pede 3 números. Desde a revisão 3 a senha é sorteada: o número de registro da peça principal, de trás para a frente (o bilhete preso no cofre diz isso). Na revisão 2 o caderno de rondas que está dentro dele deixou de contar como prova do trajeto (voltou a valer na revisão 4: mostra a volta do paletó pela porta de serviço, no começo da noite).
- **Armadilha do pêndulo** (Sala dos relógios): puxar a corda adianta 40 s no relógio de TODO mundo. Há uma plaquinha de aviso ao lado do pêndulo, com a letra do Seu Dirceu. Cada aparelho aplica uma vez; o aviso viaja pelos campos `alarmeVolta/alarmeSeg/alarmeId` do próprio jogador na sala do Mestre (regra nova em `firebase-loop/firestore.rules`: precisa publicar as regras para valer em todos os aparelhos; sem isso vale só para quem puxou).

## Ajuste 19:40 — mais pistas (Regra das Três Pistas)
- 170 → 201 pistas. Cada sinal e cada leitura normal do diagnóstico ganhou uma segunda fonte em outra sala (sinais diegéticos: quadro de consumo, lâmpada, visor, metrônomo, medidor, armário de fusíveis).
- Caso contra o suspeito com 3 pontas: motivo, meio e oportunidade do Lenz; álibis e pistas falsas com retorno para Ivone e Braga; diário do Téo em três dias (dia da troca, 2 e 4 dias antes); 6 detalhes de clima do museu.
- Teto do validador subiu de 125 para 160 pistas ativas; validar.py APROVADO nas 5 causas.

## União Loop + Reserva (24/11)
- Base: Loop (5 causas, Mestre). A Reserva ("A peça que o museu esqueceu") fica como episódio e seus minigames viram a BANCADA do Loop.
- Bancada (`bancada.css`, `LC_MG` em loop-central.js): ao coletar a foto antiga do catálogo, a peça principal (luz rasante), a fita da câmera da porta de serviço, a caixa de banners e a escala de crachás, abre o minigame; acertar entrega a pista. (Na revisão 6 a escala de crachás deixou de ter minigame: a pista entra direto.) Errar não gasta energia; há "Pedir uma pista".
- Ritmo: `abre_1` (cartão do Téo na Recepção, objetivo claro na volta 1, custo 0); `rev_3` (hoje é a ata da reunião com "então apaga?", o engano do Lenz); ensaio da volta 4 diz o que ainda pode falhar na execução final (por causa).
- Um jogo só: o Loop é a base. Minigames da Reserva entram como bancada em 5 pistas e em 2 atividades em dupla (Lado a Lado, As Duas Listas). Cooperação Pátio/Área de descanso já existia no Loop (Apagão Combinado).
- Desfecho mostra quais das 3 provas a equipe reuniu. A Reserva continua na pasta `reserva/`, mas saiu da entrada do Loop (revisão 4).

## Missão secreta e pista de metades (24/11)
- **Missão secreta** (8 no jogo): o que o Braga esconde; o que aconteceu com o Téo; quem ganha se a peça sumir; por que a tinta da Ivone não faz dela culpada; o que o Aurélio sabia; para onde vão as pegadas; o que tem na caixa que pesa demais; o que o Nico está guardando. Cada pessoa recebe uma (card no dossiê). Cumprir rende +1 de energia na volta seguinte.
- **Pista de metades** (`assim_foto` no Pátio, `assim_leg` na Área de descanso): cada sala vê uma metade; quem já viu uma não vê a outra. Desde a revisão 2 nenhuma metade vale sozinha: a prova do trajeto é a pista `assim_par` ("Foto e legenda, juntas", Área de descanso, 1 de energia), que só abre com as duas metades no caderno (a segunda chega por "Passar pista" na pausa). Quem joga sem dupla continua fechando o trajeto pelas outras fontes do grupo.

## Vocabulário (vale desde 25/11/2026)
Palavras que o jogo usa: **número de registro** (da peça), **base** (onde a peça fica exposta), **apoio** (onde a peça verdadeira deita, no Subsolo), **luva isolante**, **ajustar / ajuste**, **luz da peça**, **modo livre**, **peça presa**, **pontos** (de ligação), **roleta** (de entrada e de saída), **energia** (de quem joga), **carga** (ponteiro da máquina). Mantidas por serem comuns: registro, disjuntor, fusível, patrocinador. A lista das palavras antigas que saíram está no fim de `DECISOES-V4.md`; os identificadores internos dos dados e do código não mudaram.

## Registro de revisão — 25/11/2026

**Por quê.** O jogo passou pela avaliação das escalas (`ESCALAS_AVALIACAO_JOGOS.md`: história, personagens, Big Five e GAMS, conferência técnica) e a **rodada 1 foi reprovada**. Como manda o ciclo de renovação das escalas, o conteúdo foi corrigido para ser reavaliado do zero. O que mudou está em `DECISOES-V4.md`; resumo:

**Mundo e história**
- Uma versão só para o Téo: confrontou o Lenz na Sala das coleções uns trinta segundos antes de 0:00, foi empurrado e caiu ao lado do pote de tinta. Enquanto a Câmara gira ele "não piora nem melhora, fica guardado igual a uma peça numa vitrine". Saíram as frases em que ele encostava na Câmara ou ficava preso entre as voltas.
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
- Atividades renomeadas: "Lado a Lado" e "As Duas Listas". Missões secretas: 5 (hoje são 8).
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

## Revisão 4 — 25/11/2026

**Por quê.** A rodada 3 das escalas não passou: conferência técnica (6 de 10 itens com falha, 15 correções bloqueantes e 16 menores), escala da história (8,6; cinco critérios abaixo de 9), fichas e motivação (falas de tela contra a ficha; motivação 4,1 de 4,5) e padrão visual (média 8,1; 5 de 15 peças aprovadas). Os quatro relatórios estão em `docs/avaliacao/rodada3/`. Tudo o que era texto, dado, tela ou código foi aplicado, com as decisões do responsável (lista em `DECISOES-V4.md`, "Revisão 4").

**O que mudou no código** (`loop-central.js`, `game.js`, `ritmo.js`, `noites-motor.js`, `sala/`, `style.css`)
- Aba Atividades: o conserto da noite só aparece com o diagnóstico anexado.
- Pista travada aceita o toque e mostra a frase do mundo (campo `porque`) e a sala onde olhar; só entram salas de pistas que existem na noite.
- Pista recebida na pausa conserva a etiqueta.
- Resposta do Anexar em até 60 palavras (pior caso medido: 54).
- Painel e Manual não anexa mais sozinha: entrega a leitura completa do painel (etiqueta "LEITURA COMPLETA · painel"), que vale sozinha no Anexar. Quem joga escolhe o defeito.
- Dupla com informação de verdade na tela: em Painel e Manual, o Subsolo vê o estado dos 3 símbolos e o Ateliê vê a legenda e marca; em Lado a Lado, cada sala lista 3 coisas (da peça ou da foto); no Apagão Combinado, a palavra só aparece enquanto quem está no Pátio segura a chave geral.
- Dra. Sato só fala: nos caminhos sem dupla "com a Dra. Sato na linha" ela dita e confere; quem joga prende a trava com o cinto e a chave com a luva.
- Noite E: um conserto por volta, com ou sem dupla. Dois na mesma volta ficam gravados como meio cada um, com aviso próprio.
- Minijogos: a caixa de "banners" só abre na volta 2 (junto de "Abrir a caixa") e virou pergunta; a foto do catálogo virou pergunta; a luz de lado não conclui pelo narrador.
- Papéis da última volta na tela: na pausa da volta 4, em sala, cada pessoa toca num papel; a volta 5 mostra a dica e o telão mostra nome e papel.
- Telão no fim: Desfecho (final da história + 3 fichas), A noite (fita em ordem, com motivo, engano e o defeito da noite: 10 fatos), Para conversar, Turma. Saiu a página das 8 perguntas do caso antigo, e o formulário escondido também.
- Entrada sem "Episódio visual". Manual de entrada, título da sala, preparação, dicas, aba Revelar e missões não contam mais a troca no minuto 0.
- Livro de folhear como segunda peça: manual da Câmara no Ateliê e livro de registro na Sala de conservação (campo novo em `LOOP_SALAS`).
- Padrão visual: cabeçalho fixo menor, mapa em 4 colunas, cartão de pista mais baixo, letras de 12 px para cima, Máquina com a mesma altura nas 4 abas, aviso acima da barra, relógio de tamanho fixo, miniaturas 3D do próprio acervo no lugar dos 7 ícones copiados e de 9 emojis.

**O que mudou nos dados** (`dados/pistas-v4.json`, 278 pistas)
- Listas e pegadas: "Ele ainda está aqui dentro" saiu das duas listas (ele saiu pela porta de serviço antes de 0:00).
- "Lenz" só da volta 3 em diante: a carta da seguradora diz "quem assinou pelo patrocínio"; o nome aparece em cena (ele atende o telefone perto das 4:00), no Braga e em Acusação e Defesa.
- Comparar a foto sem ajuda passou para a volta 2.
- 30 pares de mesmo rótulo reescritos como objeto de ambiente: nenhum mostra o defeito da noite nem uma leitura normal de verdade. A tranca dos pares é a mesma nas 5 causas.
- Trajeto: o caderno de rondas do cofre e "Foto e legenda, juntas" valem os dois como prova.
- Pendrive: o Téo conta do envelope que recusou (fato novo).
- Noite D: página dobrada do diário com tranca; cadeado aberto, de aviso; Seu Dirceu não nomeia o que o Téo levava. Noite C: a anotação de ensaio não explica mais sozinha.
- Leitura do painel sem o nome do defeito. Interfone com duas respostas reescritas. Assinatura "— T." nas três páginas do diário.
- Regras reescritas: `diagnostico_anexado`, `dois_defeitos`, `revelar`, `precisaDe`, `parDe`, `escada`; novas: `sato`, `papeis_volta5`.

**Simulador de texto e validador** (`dados/simulador-texto.py`, `dados/validar.py`): um conserto por volta com ou sem dupla; Painel e Manual entrega a leitura e não anexa; anexar aceita a leitura completa sozinha. Resultado: APROVADO nas 5 causas com 1, 2 e 3 pessoas.

## Revisão 5 — 25/11/2026

**Por quê.** A rodada 4 das escalas não passou: conferência técnica (4 de 10 itens com falha, 6 correções bloqueantes e 16 menores), escala da história (8,7; quatro critérios em 8,5), fichas e motivação (dois bilhetes do Téo sem assinatura; motivação 4,3 de 4,5) e padrão visual (média 8,4; 7 de 15 peças aprovadas). Os quatro relatórios estão em `docs/avaliacao/rodada4/`. Tudo o que era texto, dado, tela ou código foi aplicado, com as decisões do responsável (lista em `DECISOES-V4.md`, "Revisão 5").

**O que mudou no código** (`loop-central.js`, `game.js`, `ritmo.js`, `style.css`, `sala/`, `museu/livro/`, `simulador/`)
- Aba Revelar: mostra só o nome do final ("Se a noite acabasse agora: ..."), sem o texto. O final mínimo chama "O museu esqueceu".
- Painel e Manual: no Subsolo, o painel só aparece depois de "Olhar o painel (1 de energia)"; fazer em dupla na mesma volta não cobra de novo.
- "Como funciona" com 58 palavras. No caderno, "etiqueta" e "ensaio" não abrem mais o dicionário (lá são palavras da história).
- Recusa do dossiê: "Ainda não. Você tem 1 sinal; precisa de 2 diferentes." e a leitura de cada pista, uma por linha (pior caso medido: 55 palavras). Na noite de dois defeitos, o "MEIO CERTO" não diz mais qual opção escolher.
- "Com a Dra. Sato na linha" cobre só informação que falte no caderno, nunca objeto (campo novo `solo.objetos`).
- Minijogos pedem o que está no caderno: a fita da porta de serviço pergunta de quem é o crachá (escala); a caixa pede o peso da lista de entregas; a foto antiga pede o que a pessoa anotou diante da peça. Na Galeria, uma pergunta de história vem antes do controle da luz. Acusação e Defesa ganhou pergunta própria.
- Missões: a do Braga não fecha mais com o álibi; a do dinheiro fecha também com o contrato; a da Ivone fecha com a fala da tinta e com o caderno de materiais. "O que aconteceu com o Téo".
- Fita do telão: cada fato com as fontes certas (a passagem conta a escada do Subsolo e não conta a marca de quem saiu). Os fatos que ninguém achou viram uma ficha só.
- Aba Atividades: cartão fechado mostra o nome e as duas salas; o texto entra ao tocar. O caminho sem dupla fica recolhido em "Sem dupla?" (aberto de saída no jogo sem turma). Quem não está no Subsolo num conserto vê "Confirmar a minha parte" (não gasta energia).
- Fim da volta e troca de etapa fecham o minijogo, a Máquina e o caderno.
- Pontos da peça: os que estão à vista nunca ficam a menos de 44 px um do outro (só a separação; o sorteio não mudou).
- Padrão visual: ícone de tipo de pista em 32 px; resultado e tela final do celular com 3 fichas e miniaturas; manual curto com "Entendi" sempre à vista; as 15 salas inteiras em 360×740; letras de 12 px para cima na tela inicial; etiqueta do dossiê embaixo do nome; livro de folhear com lugar reservado e leitura embaixo, em letra de tela; telão com letras de apoio de 1,35% da largura para cima, cabeçalho numa linha, mapa sem palavra quebrada e com miniatura maior, nomes da turma ocupando a página.
- Marca "Mosaico Loop" por inteiro nas telas e nos títulos. Endereço novo `simulador/` na raiz do jogo (abre `sala/simulador/`). `reserva/index.html` saiu do ar (redireciona para a entrada).

**O que mudou nos dados** (`dados/pistas-v4.json`, 278 pistas, "v4 revisão 5")
- Entrada do Lenz, numa versão só: hoje à tarde ele entrou pela frente como visita (livro de visitas e roleta de entrada) e saiu pela porta de serviço com o crachá do Braga; no começo da noite voltou por ela; às 4:00 de cada volta, volta de novo.
- Fatos novos do mundo: a Câmara leva 50 segundos para armar depois de ligada (plaquinha ao lado do relógio digital); a Câmara puxa só do gerador (manual, página 3).
- A Dra. Sato só pede socorro depois de ouvir do Téo. O interfone devolve pergunta também no sinal da base.
- Trancas com motivo no mundo: Nico (pede a primeira conversa, o Téo caído e o laudo), Braga (frase nova) e o homem de paletó (pede ter visto ele passar). O piso de volta continua.
- "O quadro, olhando de novo": frase de tranca que não supõe a primeira olhada, igual nas 5 causas.
- Noite D: a página dobrada não adianta mais o engano. Base da peça: feltro novo na volta 1; a falta do número fica para o Lado a Lado.
- Papéis reescritos: Lado a Lado, As Duas Listas (com as listas na tela), Acusação e Defesa (escala e bilhete, um em cada tela), Painel e Manual, Três Números e Fio a Fio (dizem o que a tela faz). Sem "os dois".
- O visto do patrocínio fica no pé da escala de crachás; o veredito compara a letra com ele.
- Os dois bilhetes do Téo sem assinatura ganharam "— T.". Meio conserto da noite E com `volta_min` 3. As 7 distrações com explicação no próprio texto têm o campo `explica`.

**Simulador de texto e validador** (`dados/simulador-texto.py`, `dados/validar.py`): sem regra nova; o validador se apresenta como "revisão 5". Resultado: APROVADO nas 5 causas com 1, 2 e 3 pessoas.

## Revisão 6 — 25/11/2026

**Por quê.** A rodada 5 das escalas não passou por pouco: escala da história 8,8 (Jogo limpo e Consistência em 8,5), motivação 4,4 de 4,5 (as perguntas dos minijogos), conferência técnica com 4 correções bloqueantes (a mensagem e as marcas da Máquina sumindo com toque de verdade, um parágrafo do caderno com 61 palavras, o museu em 3D antigo) e padrão visual com média 8,6 (critérios 2, 3, 5 e 6 em 8). Os quatro relatórios estão em `docs/avaliacao/rodada5/`. Tudo o que era texto, dado, tela ou código foi aplicado; as mudanças de regra que os relatórios deixam para o autor não foram (lista em `DECISOES-V4.md`, "Revisão 6").

**O que mudou no código** (`loop-central.js`, `game.js`, `ritmo.js`, `style.css`, `bancada.css`, `reserva/minigames.mjs`, `sala/`, `museu/torre/`, `museu/livro/`, `museu/icones/`, `telao/`)
- **Máquina, mensagem e marcas (B1 e B2).** A última mensagem fica guardada e volta depois de cada redesenho; some ao trocar de aba, fechar a janela ou mudar de volta. Ela fica presa no pé da janela, sempre à vista. O redesenho de 2 em 2 segundos não mexe em nada quando o conteúdo é o mesmo; quando muda, repõe o defeito e as pistas marcadas, o que foi digitado, as explicações abertas e a rolagem. Não depende de foco (no iPhone, tocar numa caixa de marcar não dá foco). Depois de valor errado, os campos digitados ficam.
- **Caderno (B3).** O rótulo da anotação fica em linha própria; o parágrafo é só o texto da pista (maior bloco medido: 57 palavras).
- **"Ver o museu em 3D" (B4).** O botão do jogo abre `museu/torre/?loop=1`: só as 15 salas da história, em 4 andares (2º andar, 1º andar, Térreo, Subsolo), com a peça que cada sala tem no Loop. A lista vem de `museu/torre/salas-loop.json`, gerado de `LOOP_SALAS` e `LOOP_DESC`. Sem `?loop=1` a página continua como era.
- **Minijogos.** A escala de crachás não tem mais pergunta (a pista entra direto). A foto antiga e a caixa têm 4 opções que só o caderno separa. Acusação e Defesa pergunta o que, na escala, foi escrito pela mesma mão do bilhete. Todo minijogo mostra a miniatura da sala ou da peça; a cena da luz mostra a máscara da Galeria. A linha da mensagem tem lugar reservado e o rótulo "Olhe de perto" tem 13 px.
- **Sala dos sons, o gravador.** Cada pista da sala é uma faixa; tocar numa faixa é examinar a pista (mesmo custo, mesma tranca, mesma hora) e a legenda aparece aos poucos. O que já está no caderno toca de novo sem gastar. Sem pista nova e sem regra nova.
- **Lista da sala.** O selo "✓ no caderno" ocupa a linha inteira (não corta em 390 nem em 360 px); em 360 px o nome da pista cabe em 3 linhas.
- **Livro de folhear.** Os botões "Ler" têm lugar de altura fixa (o máximo de páginas pagas por par de folhas): abrir o livro e virar a folha não mexem na tela. A leitura não repete o título. A mesa da cena ficou azul-noite.
- **Textos de tela.** Descrição do Subsolo igual nas 5 noites, sem o sinal de carga baixa. Entrada: "Noite de véspera no museu." Passo a passo sem "só você" (em sala, a turma inteira lembra) e com nome curto de sala. Missão secreta sem falar de turma e de telão no jogo sem turma; a do dinheiro não fecha mais com o contrato (um toque na volta 1). "Em dupla: cada pessoa numa sala". A Dra. Sato não diz mais "Tá." (é a marca do Braga). Valor único errado: "o valor não confere" (não "0 de 1 certos"). No caderno, "leitura normal" não abre mais a explicação de regra. Aba Revelar: a dica do crachá aponta a pergunta, não o caminho.
- **Fita do telão.** O primeiro fato diz o que os papéis do dia da troca mostram ("A peça principal sai para 'limpeza' e volta no mesmo dia"); a cópia fica no fato seguinte.
- **Telão com turma grande** (testado com 40 nomes, em 1280×720 e 1920×1080): nenhum cartão passa da caixa e nenhuma letra fica abaixo de 1,35% da largura. A letra dos nomes desce só o que for preciso; a largura de cada cartão acompanha a quantidade de nomes; se ainda faltar lugar, o papel sai da ficha. No resultado, as missões cumpridas ganharam página própria (uma linha por missão, com os nomes). As fichas do desfecho chamam "Achar o defeito", "Consertar a Máquina" e "Revelar a noite".
- **Miniaturas** `E02`, `DESC_A` e os 4 tipos de pista refeitas com novo enquadramento (sem arte nova); fichas das 3 provas do resultado com 40 px e fundo claro. O aviso da pausa não cobre mais o botão "Escolher a próxima sala".
- Endereço novo `telao/` na raiz do jogo (abre `sala/telao/`).

**O que mudou nos dados** (`dados/pistas-v4.json`, 278 pistas, "v4 revisão 6")
- `coop_veredito`: quem diz de quem é a rubrica é o Braga, na Central ("É do Lenz, do patrocínio. Ele assina tudo assim.").
- Lado a Lado e `foto_solo`: feltro novo embaixo da base, sem número à vista (bate com `fh_base_perto` e `d_f2_1`).
- `coop_catraca_ok`: saiu a frase do crachá na porta de serviço (não está em nenhuma das duas listas).
- Painel e Manual, noite D: "ponteiro: atrás de uma etiqueta de papel, tremendo" (tela e opção de quem marca), igual a `fh_pont_d`.
- `hora_5`: "gerador assumiu a luz" (a Câmara puxa do gerador desde o minuto 0).
- `braga_1`: a fuga é o cunhado, não o café. `man_3`, lacre cortado: a Dra. Sato devolve pergunta. `c_peca` e `iso_1` sem "Ela está na sua mão". `traj_4`: a marca de sola aponta para a rua (o texto mostra, não conclui).
- Finais: o Desligar (texto de base e os 5 por causa) diz o que acontece com o Téo ("Lá fora, uma sirene: o socorro do Téo."); nenhum final diz "só você" ou "a única memória".
- Papéis da última volta: "Quem opera" e "Quem apoia" (antes Mão A e Mão B), com dicas novas.
- Campo interno `trancas.hora_do_apagao` sem marca de gênero.

**Simulador de texto e validador** (`dados/simulador-texto.py`, `dados/validar.py`): sem regra nova; o validador se apresenta como "revisão 6". Resultado: APROVADO nas 5 causas com 1, 2 e 3 pessoas.

**Ficaram sem linha própria no registro da revisão 5** (apontado pela conferência técnica; todas já estavam aplicadas): a frase da pré-conferência ("Forma certa. Falta ver se o defeito é esse."); relógios de corda e elétricos (`a_rel_1`, `a_rel_2`, `fh_rel_recep`, `hora_2`); `fh_pont_d`; `mancha_2`; `dis_musica`; o pó branco de `dirceu_0`; o corte de "A peça exposta é cópia" em `coop_copia_ok` e `foto_solo`; a tranca nova de `eco_chave`.

**Não aplicado, e por quê**
- Mudanças de regra que os relatórios deixam para o autor: lista em `DECISOES-V4.md`, "Revisão 6 · Ficou para decidir".
- Os 6 ícones provisórios e as 8 peças 3D reprovadas dependem de arte nova (`ICONES-A-GERAR.md`, `PECAS-A-CONSEGUIR.md`).
- Recompressão da peça `L05`: já está em Draco + WebP; baixar mais piora a peça.
- Simulador de sala em notebook (telão menor e turma mais alta em 1280×720): ajuste que não reprova; a fórmula atual do tamanho ficou.

## Revisão 7 — 25/11/2026

**Por quê.** A rodada 6 das escalas não passou por pouco: escala da história 8,9 (Jogo limpo em 8,5: na noite do fusível a comparação da foto olhava embaixo da base e não via o F2; dois minijogos pediam papel que a tranca não garante), motivação 4,4 de 4,5 (a fita do telão cortava texto), conferência técnica com 2 bloqueantes (a ordem da lista mudava com o defeito; a sirene do final aparecia sem pedido de socorro) e padrão visual com os critérios 5 e 8 em 8 (museu em 3D sem enquadrar a peça; fita do telão). Os quatro relatórios estão em `docs/avaliacao/rodada6/`. Tudo o que era texto, dado, tela ou código foi aplicado; as escolhas estão em `DECISOES-V4.md`, "Revisão 7".

**O que mudou no código**
- **`loop-central.js`.** A lista de cada sala é ordenada pela primeira vez que o rótulo aparece nos dados (`LC_ORD`): mesma sequência nas 5 causas. `lcFinalTxt` tira do final as frases de `regras.final_frases` quando a fonte não está no caderno (sirene: `sato_teo`; o Téo acordando: `teo_1`). Dicionário: "Luz da peça" diz quando ela acende amarela; a marca "?" fica depois de "fusível-mestre", não no meio. Minijogos: a foto antiga pergunta o que a foto mostra na base; a caixa pergunta pelo cheiro de verniz (o que a tranca garante); "Antes de acender a luz" tem três opções que disputam; nenhuma resposta abre com contorno de escolhida. Missões do Téo, do Aurélio e da Ivone não fecham mais com um toque. Fichas do desfecho com os títulos do telão. Em "Passar pista", gerar um código limpa a mensagem anterior.
- **`ritmo.js`.** `loopFinalTexto(final, respostas)`: o texto do final da turma, sem a sirene quando ninguém contou do Téo e sem o Téo quando ninguém viu o Téo. Fita: dois fatos mais curtos; "Quem trouxe" numa linha ("Ana, João +38"), com título de coluna.
- **`sala/sala-mestre.mjs` e `sala/telao/telao.mjs`.** Cada pessoa manda, junto do desfecho, se tem `sato_teo` e `teo_1` (`loopSato`, `loopTeo`); o telão e o resultado da sala usam `loopFinalTexto`. O telão mede a fita depois de desenhar e baixa a letra (até 1,35% da largura) se alguma linha não couber.
- **`sala/sala.css`.** Fita: miniatura na altura da linha, "Quem trouxe" sem quebra, letra por `--fz`. Página Missões: nome nunca abaixo de 1,35% da largura.
- **`game.js`.** Gravador: "Som desligado" / "Som ligado"; tocar numa faixa antes da hora responde ("Esta gravação ainda não existe. A noite precisa andar mais um pouco.").
- **`museu/torre/index.html`** (só no modo `?loop=1`). Tocar numa sala: a gaveta termina de abrir na hora, só a sala escolhida fica à vista, a câmera mira a peça e a centra acima do cartão (o centro da imagem sobe o que o cartão cobre). Cartão na paleta do jogo. Só a peça do Loop fica na sala. `window.__t.medir()` devolve onde a peça aparece na tela (para o teste).
- **Entrada e ícone da aba.** `index.html`: "O museu recomeça. Você não." (saiu "Só você lembra"). As páginas ganharam ícone de aba (miniatura da Câmara), o que acaba com o 404 do `favicon.ico`.
- **Minijogo antes de atividade em dupla** (comportamento que não estava escrito): abre uma vez por atividade e por volta em cada aparelho; trocar de sala na mesma volta leva direto à palavra da dupla.

**O que mudou nos dados** (`dados/pistas-v4.json`, 278 pistas, "v4 revisão 7")
- Lado a Lado (telas A e B), `coop_copia_ok` e `foto_solo`: a comparação é rachadura, cor da pedra e riscos do tempo (revisão 13: desgaste nas bordas); nada de "embaixo da base".
- `coop_veredito`: "Tá. Essa rubrica é do Lenz, do patrocínio. Ele assina tudo assim."
- `teo_d3`: "a base dela" (sem "cópia"). `coop_raio.papelB`: "os 3 números que aparecem enquanto segura a chave".
- `regras.final_frases` (novo): as 3 frases de final que dependem do caderno.
- Ordem das pistas: cada par logo depois do original (208 pistas mudaram de posição; nenhum texto mudou por isso).
- Campos internos sem palavra antiga ("gira", "símbolos embaralhados", "cores embaralhadas", "peça falsa"): não vão para a tela.

**Simulador de texto e validador** (`dados/simulador-texto.py` sem mudança; `dados/validar.py`): dois testes novos. (g2) compara a SEQUÊNCIA das prévias por sala e por volta entre as 5 causas (75 combinações): erro se a ordem da tela muda, aviso se a ordem crua dos dados muda. (h) confere as frases condicionais dos finais (cada frase existe num final; nenhuma sirene fora delas). O validador se apresenta como "revisão 7". Resultado: APROVADO nas 5 causas com 1, 2 e 3 pessoas.

**Testes de tela novos** (fora do repositório, em `/tmp/roda/r7/`): `ordem.mjs` (código real: 22.500 comparações de sequência em 300 sementes, 150 listas na tela, e a sirene com e sem a fonte, nas 5 causas e no telão), `torre15.mjs` (as 15 salas do museu em 3D em 390×844: peça centrada, inteira e acima do cartão), `miss8.mjs` (página Missões com as 8 missões e 40 nomes); `tl40.mjs` passou a medir linha por linha da fita, a coluna "Quem trouxe" e a letra mínima.

**Não aplicado, e por quê:** ver `DECISOES-V4.md`, "Revisão 7 · Não aplicado" e "Ficou para decidir".

## Revisão 8 — 25/11/2026

**Por quê.** Na rodada 7, a história (8,9) e as fichas e motivação (4,9 e 4,5) passaram; a conferência técnica teve 1 bloqueante (os pontos da peça 3D mudavam de lugar e de quantidade com o defeito) e o padrão visual reprovou nos ícones (6 provisórios) e em 8 salas (peça). O autor entregou 8 modelos 3D e 6 ícones. Relatórios em `docs/avaliacao/rodada7/`; escolhas em `DECISOES-V4.md`, "Revisão 8".

**Peças e ícones**
- 8 peças novas em `museu/pecas/` (originais do autor, comprimidos: weld, simplify, normais refeitas, texturas 1024 em WebP, Draco): `Q01` Pátio (601 KB), `D10` Coleções (590 KB), `L08` Limpeza (651 KB), `N18` Fotografia (301 KB), `N17` Sons (334 KB), `DESC_B` Área de descanso (272 KB), `REL_B` Relógios (632 KB), `GAL_B` Galeria (base `GAL_B_base` + máscara V11, 739 KB). As antigas (E01, V12, L05, N05, N07, DESC_A, GAL_A, REL_A) continuam no acervo.
- Miniaturas novas das 8 salas em `museu/icones/` (160 px). `LOOP_SALAS` (peça e legenda), `LOOP_DESC` dos relógios, `museu/torre/salas-loop.json` e `sala/conteudo.js` gerados de novo. Minijogos, fita do telão, Revelar e gravador usam as peças novas.
- 6 ícones do autor em `museu/icones/ui/` (saguao, manual, uma-tentativa, missao, energia, fato-falta): nenhum emoji provisório na tela.
- Tamanho real para a RA: `museu/escala-real.mjs` + `tamanho_real_ra` em `museu/escala-pecas.json` (8 novas, N07, N05, E02).

**O que mudou no código**
- **`game.js`.** `LOOP_PONTOS` e `vagaDoPonto`: lugar fixo de cada ponto na superfície da peça, escolhido pela sala e pelo rótulo (igual nas 5 noites). Saguão com o ícone novo; número de energia com a miniatura (`data-en`); peças novas em `LOOP_SALAS`.
- **`loop-central.js`.** Missão da Ivone (`ivone_red` e o pote ou o bilhete). Minijogos `tombo_2`, `c_peca`, `traj_1` e a luz de `falsa_1`. "Liga." no Fio a Fio sem dupla. Dicionário: "Base da peça". Ícones de manual, missão, Revelar e energia.
- **`ritmo.js`.** "A noite andou" sem a caixa; fita com as peças novas e a moldura vazia para o fato que ninguém achou; "Participante 2" não vira "Participante 2.".
- **`noites-motor.js`, `sala/telao/telao.mjs`, `style.css`, `sala/sala.css`.** Ícones novos (energia, saguão, moldura).
- **`individual.html` e `sala/index.html`.** "Cinco minutos. A mesma noite. O museu recomeça. Você não."

**O que mudou nos dados** (`dados/pistas-v4.json`, 278 pistas, "v4 revisão 8")
- `aurelio_1`, `man_3` (mostradores piscando; par de avisos), `coop_apagao_combinado.papelA`, `nico_1.porque`, `teo_radio`, `man_pot_1`, final Ouro. Nenhuma volta nem tranca mudou. Rótulos: 8 mudaram (`chave_3`, `quadro_0`, `d_fus_2`, `fh_vidro`, `dis_balde`, `dis_gato`, `b_luz_4`, `fh_lamp_lab`), sempre iguais entre sinal e par inocente, e a pergunta da tranca `abrir_o_quadro` passou a dizer "porta".

**Simulador de texto e validador.** Só o cabeçalho (revisão 8). Resultado: APROVADO nas 5 causas com 1, 2 e 3 pessoas.

**Ferramenta interna.** `museu/pontos-pecas.html` gera `LOOP_PONTOS` (sem link no jogo).

**Testes de tela** (fora do repositório, em `/tmp/roda/r8/`): `pontos.mjs` (novo: pontos da peça entre as 5 causas, 15 salas × 5 voltas; modo `dados` compara lugar, direção, aceso e ordem de todos os pontos, em 0:03 e 4:30; modo `tela` compara o que fica à vista, em 390×844 e 360×740, e mede nenhum par a menos de 44 px e nenhum ponto fora da peça).

- **Revisão 8 · ajuste de texto às peças novas.** Texto das pistas alinhado ao que os 8 modelos mostram, sem mudar enredo, regra, tranca, culpado nem fonte de fato. Pátio: o quadro tem porta entreaberta presa pelo cadeado na trava (desde a revisão 9: fechada, só com a fresta); sem a chavinha só se espia pela fresta (`quadro_0`, `quadro_aberto`, `chave_3`, `fh_vidro`, `fh_quadro2`, `d_fus_2b`; tranca `abrir_o_quadro` e `coop_apagao_combinado.papelA` dizem "porta"); o cadeado de aviso de `d_fus_2`/`d_fus_2b` passou a amarelo, para não se confundir com o vermelho da trava; o gato vira pelo de gato (`dis_gato`). Fotografia: 3 fotos no varal (`d_fus_3`, `fh_varal`); a lâmpada vermelha virou a luminária de parede em cima do varal (`b_luz_4`, `fh_lamp_lab`); fotos da parede são detalhes do prédio (`fh_fotos_parede`). Limpeza: o armário da equipe fica no corredor ao lado (`cracha_2`, `LOOP_DESC`; desde a revisão 9: "ao lado da Base da limpeza"); multímetro molhado na prateleira de baixo do carrinho, bilhete no cabo do esfregão (`dis_balde`). Coleções: a caixa de "banners" é uma das caixas etiquetadas da estante (`c_esc_1`, `LOOP_DESC`). Área de descanso: sem geladeira (`b_luz_2`). Rótulos novos nos pares mantêm o mesmo rótulo entre sinal e par inocente. Validador APROVADO; lc3, mg, r5 e pontos (volta 1) sem erro.

**Não aplicado, e por quê:** ver `DECISOES-V4.md`, "Revisão 8".

## Revisão 9 — 25/11/2026

**Por quê.** Na rodada 8, a conferência técnica e as fichas passaram; a história ficou em 8,9 com Consistência do documento em 8,5 (o ajuste de texto às peças não tinha chegado ao ROTEIRO e à FICHAS, e sobravam choques pequenos no texto: minijogo da caixa, fresta do quadro); o padrão visual reprovou o Pátio (porta aberta no modelo × fresta no texto) e a Sala das coleções (sem mancha). O autor entregou duas peças novas. Relatórios em `docs/avaliacao/rodada8/`; escolhas em `DECISOES-V4.md`, "Revisão 9".

**Decisão do autor (25/11/2026).** O seletor "Bem-vindo / Bem-vinda / Tanto faz" (com 👨 👩 👥) e o campo "Como quer ser chamado", na tela de entrar com código (`sala/firebase-room.js`), são intencionais e padrão de todos os Mosaicos: não são defeito de gênero nem de ícone. Não mexer.

**Peças e miniaturas**
- `museu/pecas/Q01.glb` (Pátio, 451 KB: quadro fechado com cadeado vermelho na trava e fresta, mostrador na parede, cabo entrando no topo, para-raios, adesivo amarelo e papel branco na porta, pedra molhada) e `museu/pecas/D10.glb` (Coleções, 438 KB: estante com caixas etiquetadas, caixa vazia caída, caixote de lâmpadas, tubo de banner, poça vermelha com pote virado). Chão em y = 0, de frente, tamanho real por `museu/escala-real.mjs` (`tamanho_real_ra`: 2,3 m e 2,1 m; descrições novas em `escala-pecas.json`). Anteriores com `_SUBSTITUIDO_2026-11-25l`.
- Miniaturas das 8 peças novas (Q01, D10, L08, N18, N17, DESC_B, REL_B, GAL_B) refeitas em `museu/icones/`: objeto inteiro, com margem, fundo transparente, 160 px.
- `LOOP_PONTOS` de Q01 e D10 gerados de novo em `museu/pontos-pecas.html` (ferramenta interna, sem link no jogo, que acha os 32 lugares fixos da superfície de cada peça).
- `museu/torre/salas-loop.json` gerado de novo (Limpeza e Coleções estavam com o texto antigo; Pátio com "fechado a cadeado"). `sala/conteudo.js` gerado de novo.

**O que mudou no código**
- **`game.js`.** `LOOP_PONTOS` (Q01, D10); `LOOP_DESC.patio` ("Chove. O Quadro externo, fechado a cadeado, fica embaixo do para-raios."); `PECA_CANTO` e `giroDaPeca`: nos 5 cantos de sala (N18, N17, DESC_B, REL_B, GAL_B) o giro fica entre −75° e 75° da frente.
- **`loop-central.js`.** Minijogos `traj_1` (a pergunta não traz a resposta: gotas no tapete) e `c_peca` (a caixa da estante).
- **`style.css`.** Ícone de energia da lista com 22 px (era 18).
- **`sala/telao/telao.mjs` e `sala/sala.css`.** Página "Missões" com o ícone da missão em cada linha.
- **`index.html`.** Em tela baixa (até 780 px de altura e 720 de largura), a entrada fica mais compacta: em 360×740 tudo cabe sem rolar, até "Jogar sem turma"; os botões continuam com 52 px ou mais (revisão 14: medido de novo, o campo do código tem 50 px).
- **`dados/validar.py` e `dados/simulador-texto.py`.** Só o cabeçalho (revisão 9).

**O que mudou nos dados** (`dados/pistas-v4.json`, 278 pistas, "v4 revisão 9")
- Pátio: `quadro_0`, `quadro_aberto.porque`, `chave_3`, `d_fus_2`, `fh_vidro`, `man_pot_3`, `fh_disj`, `fh_disjx` (texto e rótulo "Giz na parede"), `a_falsa_2x` e `fh_etq_chave` (texto e o mesmo rótulo novo, "Adesivo na porta do quadro"), `iso_aviso`, `a_cheia_2`, `fh_med_quadro`, `dis_gato`. Coleções: `dis_lampadas`, `falsa_3.porque`. Outras: `cracha_2`, `cracha_3`, `traj_2` (texto e rótulo "Seu Dirceu, de esfregão na mão"), `ivone_ali_2`, `fh_folha_d`, final Ouro.
- **Rótulos que mudaram: 4** (`a_falsa_2x` e `fh_etq_chave`, par, com o mesmo rótulo novo; `fh_disjx`; `traj_2`). Nenhuma volta, horário, tranca, `precisaDe`, `soNaCausa` ou fonte de fato mudou; nenhuma pista entrou ou saiu.

**Simulador de texto e validador.** Só o cabeçalho. Resultado em `/tmp/roda/esc/r9/validar.txt`.

**Testes de tela** (fora do repositório): os do registro da revisão 8 (`/tmp/pwt`, `/tmp/roda/r6`, `/tmp/roda/r7`, `/tmp/roda/r8/pontos.mjs`), rodados depois da troca das peças. Os testes antigos `x/toques7.mjs` e `n6/mini.mjs` da rodada 8 esperam o comportamento anterior (ver DECISOES).

**Não aplicado, e por quê:** ver `DECISOES-V4.md`, "Revisão 9".

## Revisão 10 — 25/11/2026

**Por quê.** Enigma novo, desenhado e aprovado pelo autor (lote 9): **a inscrição da máscara**. Mais um caminho para a prova da cópia, que se confere sozinho e é visual. Material de preparação em `/tmp/roda/esc/r9/inscricao/` (fora do repositório). Enredo em `ROTEIRO-LOOP.md`, parte 17; escolhas em `DECISOES-V4.md`, "Revisão 10".

**Decisão do autor (25/11/2026).** A escrita é inventada, própria do Loop. Os símbolos são desenhados (não emoji, não ícone) e são conteúdo de pista, não ícone de interface. O nome "máscara" fica (combina com a peça 3D da Galeria).

**Arquivo novo**
- `museu/icones/ui/glifos.svg`: 12 símbolos (`g-ver`, `g-dizer`, `g-rosto`, `g-pedra`, `g-casa`, `g-guardar`, `g-tempo`, `g-ir`, `g-voltar`, `g-dia`, `g-noite`, `g-vida`) e 2 virados que não estão na tábua (`g-guardar-esp`, `g-noite-esp`), viewBox 48×48. Entalhe: beirada clara embaixo e à direita, parede escura, fundo do sulco em `currentColor` (dourado `#e7b975` na tábua, `#d9be8a` na pedra). No virado, o desenho vira e a luz não. Próprio do Loop: nenhum outro jogo usa este arquivo.

**O que mudou no código**
- **`loop-central.js`.** `LC_GLIFOS` (ordem da tábua) e `LC_INSC` (cópia e verdadeira); `lcGlifosSprite()` busca o sprite e embute no `body` (o `<use>` para arquivo externo falha no Safari e em file://) e já carrega `bancada.css`; `lcGlifosHtml(id)` desenha a tábua (4 × 3) ou a faixa (6 símbolos) quando a pista tem o campo `glifos` (o texto continua inteiro, para leitor de tela e simulador de texto); `LC_MG.insc_copia` (`ativ:'glifos'`, `insc`, `opcoes:['5','4','3','2']`, `resp:0`, `img:['V11']`); `lcBancada` repassa `insc` e a tábua; `LC_FATO_PISTA.copia` com `insc_copia`; dicionário com "Peça principal" e "Inscrição". `minigames.mjs?v=7`, `bancada.css?v=4`.
- **`game.js`.** Livro da Conservação: `insc_tabua` logo depois de `tombo_1`; na leitura embaixo do livro, a tábua desenhada aparece depois do texto da página (na folha 3D fica só o texto). No caderno, o desenho ocupa a largura do cartão: a tábua 4 × 3 e a inscrição em 2 linhas de 3, com 44 px por símbolo em 390 e 360 px.
- **`reserva/minigames.mjs`.** Ramo novo `tipo === 'glifos'`: faixa da máscara, tábua do caderno (6 × 2) e 4 botões com o símbolo e "Nº símbolo" (SVG por `createElementNS`).
- **`reserva/banco.mjs`.** Atividade `glifos` ("Conferir a inscrição").
- **`bancada.css`.** Pedra com grão e volume para a faixa e as casas da tábua; botões de 60 px com profundidade 3D; símbolos com 44 px.
- **`individual.html`, `sala/index.html`.** `loop-central-dados.js?v=35`, `loop-central.js?v=40`, `game.js?v=47`.

**O que mudou nos dados** (`dados/pistas-v4.json`, **281 pistas**, "v4 revisão 10")
- Novas: `insc_tabua` (Conservação, volta 1, custo 1, comum, rótulo "Tábua da escrita antiga", `glifos:'tabua'`, destrava as duas abaixo), `insc_copia` (Galeria, volta 2, custo 1, comum, essencial, grupo `prova_falsa`, `essencialPara:['final_revelar']`, precisa `falsa_1` + `insc_tabua`, destrava `cracha_3` e `lenz_1`, rótulo "Inscrição na máscara", `glifos:'copia'`), `insc_verdadeira` (Sala das coleções, volta 2, custo 0, clima, precisa `c_peca` + `insc_tabua`, rótulo "A testa, de perto", `glifos:'verdadeira'`).
- Mudaram: `grupos_fonte.prova_falsa.fontes` (+`insc_copia`, 6 fontes), `falsa_1.revela.destrava` (+`insc_copia`), `c_peca.revela.destrava` (+`insc_verdadeira`), `cracha_3.precisaDe.umaDe` e `lenz_1.precisaDe.umaDe` (+`insc_copia`), `trancas.provar_a_falsificacao.chaves.solo.como`, `regras.escada` (volta 2 com "inscrição da máscara"), regra nova `regras.glifos`. Nada da revisão 9 foi desfeito.
- **Rótulos novos: 3.** Nenhuma volta, horário, `soNaCausa` ou tranca das pistas antigas mudou.

**Simulador de texto e validador** (`dados/validar.py`, `dados/simulador-texto.py`). Só o cabeçalho (revisão 10): leem as pistas novas pelos dados (nenhuma contagem fixa). Resultado: APROVADO nas 5 causas (`/tmp/roda/esc/r10/validar.txt`).

**Testes de tela** (fora do repositório): os da revisão 9 e o novo `/tmp/roda/r10/insc.mjs` (por toque, numa partida: tábua, inscrição da cópia, minijogo com um erro e um acerto, prova da cópia no Revelar, inscrição verdadeira depois de `c_peca`; 390×844 e 360×740). `/tmp/pwt/r5.mjs` passou a esperar "revisão 10".

## Revisão 11 — 26/11/2026

**Por quê.** Na rodada 9, história, fichas e técnica passaram (a Consistência no limite: `v4_teo` trocado sem registro e um segundo medidor no Pátio); o visual reprovou no celular (rótulos da tábua com 11 px, minijogo dos símbolos rolando, tábua escondida na caixa do livro) e a Galeria reprovou em Pertencimento (testa da máscara lisa). Relatórios em `docs/avaliacao/rodada9/`; escolhas em `DECISOES-V4.md`, "Revisão 11".

**Peça e miniatura**
- `museu/pecas/GAL_B.glb` (796 KB, caixa igual à anterior): a máscara ganhou a inscrição da cópia na testa (6 símbolos, o 5º virado), feita por `museu/pecas-compostas.mjs` (funções `texturasTesta` e `gravarTesta`: película da superfície da testa, 1 mm acima, com cor de entalhe e mapa de relevo, desenhada de `museu/icones/ui/glifos.svg`; precisa de sharp na pasta do gltf-transform). Anterior com `_SUBSTITUIDO_2026-11-26a`.
- `museu/icones/GAL_B.webp` refeita (objeto inteiro, com margem). `museu/torre/salas-loop.json` e `sala/conteudo.js` gerados de novo.

**O que mudou no código**
- **`game.js`.** `PECA_PERTO` e `pertoDaPeca`: na Galeria, zoom até 5° (os outros continuam em 12°), câmera mirando a máscara (`-0.12m 1.3m 0.03m`) à mesma distância (8,32 m). `PECA_CANTO` com `D10`. `LOOP_PONTOS.GAL_B`: lugar 3 (pista "Inscrição na máscara") no alto da testa; lugar 8 ("Um quadro torto") no quadro; os outros 30 iguais. `LOOP_DESC.patio`: "Chuva fina na pedra molhada. O Quadro externo, fechado a cadeado, fica embaixo do para-raios." (revisão 13: "Dá para ouvir a chuva fina. ...") Livro: `livroGrande` (a leitura usa o vão dos botões "Ler" quando a página tem a tábua e não sobra botão).
- **`loop-central.js`.** `LC_MG.insc_copia` sem a miniatura (`img`). `minigames.mjs?v=8`, `bancada.css?v=5`.
- **`reserva/minigames.mjs`.** Ramo `glifos`: respostas só com "Nº símbolo" (sem o desenho); título da tábua "A tábua, do seu caderno".
- **`bancada.css`.** Rótulos da tábua com 12 px em Georgia; respostas com 52 px, centradas.
- **`style.css`.** Livro: `.livro-vaga` 24 px menor, `.livro-leitura` 192 px, classe `grande` e tábua em 2 linhas de 6 na leitura.
- **`sala/sala.css`.** Mapa do telão: a miniatura começa abaixo da contagem.
- **`museu/torre/index.html`.** Título numa plaqueta escura.
- **Versões nas páginas.** `style.css?v=24`, `loop-central-dados.js?v=36`, `loop-central.js?v=41`, `game.js?v=48`, `sala.css?v=7`.
- **`dados/validar.py` e `dados/simulador-texto.py`.** Só o cabeçalho (revisão 11).

**O que mudou nos dados** (`dados/pistas-v4.json`, 281 pistas, "v4 revisão 11")
- Mudaram: `a_cheia_4`, `fh_med_pot_bce`, `fh_med_pot_d` (texto e rótulo "Embaixo do medidor"), `insc_copia`, `insc_tabua`, `falsa_3`, `quadro_aberto` (`textoPorCausa` da noite D), `lenz_meio_2`, `nico_1.porque`, `aurelio_1`, `atividades_coop.coop_original_copia.solo_pistas` (+`insc_copia`). `v4_teo` ("a mesma cara") já estava assim desde a revisão 10, sem registro: registrado agora.
- **Rótulos que mudaram: 3** (um par de três, com o mesmo rótulo novo). Nenhuma volta, horário, tranca, `precisaDe`, `soNaCausa` ou fonte de fato mudou; nenhuma pista entrou ou saiu.

**Simulador de texto e validador.** Só o cabeçalho. Resultado: APROVADO nas 5 causas (`/tmp/roda/esc/r11/validar.txt`).

**Testes de tela** (fora do repositório): os da revisão 10, mais `/tmp/roda/esc/r11/gal/testa_jogo.mjs` (testa da máscara de perto, 390 e 360) e `/tmp/roda/esc/r11/scr/mgest.mjs` e `ll.mjs` (minijogo e livro sem rolar).

**Não aplicado, e por quê:** ver `DECISOES-V4.md`, "Revisão 11".

## Revisão 12 — 26/11/2026 · planta do museu no estilo do Limiar Ético (pedido do autor)

**Por quê.** O autor pediu que o mapa do celular fosse "mais estilo planta", com a paleta do Limiar Ético só nessa parte, e depois que a escolha do andar fosse por orelhas (pasta de arquiteto). Escolhas em `DECISOES-V4.md`, "Revisão 12". Protótipo em `/tmp/roda/planta/` (fora do repositório).

**O que mudou no código**
- **`game.js`.** Novo bloco antes de `renderRoomFocus`: tabela `PLANTA` (grade de cada andar, portas, escada), `PLANTA_AREA`, `plantaLoop()` (HTML da pasta com orelhas e folhas), `plantaAndarDe`, `plantaOnde`, `plantaMostrar(andar)` (troca de orelha, sem custo) e `plantaAtualizar()` (alfinete, tracejado, rótulos para leitor de tela; só troca classes). `renderGame` usa `plantaLoop()` no Loop (o modo antigo segue com a grade) e chama `plantaAtualizar()`. `marcarCaminhada` grava `state.andandoDe` e, ao chegar, chama `plantaAtualizar()`; em `enterRoom`, `marcarCaminhada()` vem antes de trocar `state.room`. O botão "Ver mapa" abre a planta no andar onde a pessoa está. Salas continuam como `button[data-room]` (mesmo `enterRoom`, mesma caminhada de 10 s).
- **`style.css`.** Bloco "Planta do museu" no fim (classes `pl-*`, variáveis do Limiar só dentro de `.planta`); com a sala aberta, a planta aparece inteira (sem caixa de rolagem) e o botão Mapa rola até ela abaixo do cabeçalho fixo.
- **Versões nas páginas.** `style.css?v=25` (`individual.html`, `sala/index.html`, `sala/simulador/index.html`), `game.js?v=49` (`individual.html`, `sala/index.html`). `sala/conteudo.js` gerado de novo: igual (o bloco novo fica fora do trecho copiado).

**O que mudou nos dados.** Nada (`dados/pistas-v4.json` continua "v4 revisão 11").

**Testes de tela** (fora do repositório): `/tmp/roda/planta/jogo.mjs` (planta em 390×844 e 360×740: início no Saguão, na Recepção, caminhando para o Subsolo, chegada, as 4 orelhas; confere que a folha cabe acima da barra, nenhum nome cortado, alvos ≥ 44 px, letra ≥ 12 px). Capturas em `/tmp/roda/planta/final/`.

## Revisão 13 — 26/11/2026 · retoques da rodada 10

**Por quê.** A rodada 10 das escalas saiu limpa (relatórios em `docs/avaliacao/rodada10/`); a revisão 12 (planta) recomeçou a contagem. Entram de uma vez os retoques menores apontados na rodada 10, para a rodada 11 ter folga. Escolhas e o que não foi aplicado em `DECISOES-V4.md`, "Revisão 13".

**O que mudou nos dados** (`dados/pistas-v4.json`, 281 pistas, "v4 revisão 13")
- Texto: `a_cheia_4`, `fh_med_pot_bce`, `fh_med_pot_d` ("o interruptor do ponteiro de potência", no lugar de "a chavinha"); `quadro_aberto.textoPorCausa.D_fusivel` ("Na mesma chave, ..."); `foto_solo` e `coop_copia_ok` (desgaste nas bordas); `insc_verdadeira`, `chao_peca`, `mancha_2` (sem a frase final de narrador); `atividades_coop.coop_original_copia.telaPapel.A` ("pedra cinza, mais clara", "bordas inteiras, sem desgaste").
- **Rótulos que mudaram: 0.** Nenhuma volta, horário, tranca, `precisaDe`, `soNaCausa`, custo, fonte ou etiqueta mudou; nenhuma pista entrou ou saiu. O checklist abaixo continua valendo.

**O que mudou no código**
- **`loop-central.js`.** `LC_MG.c_peca`: segunda dica aponta para o caderno. `LC_MG.falsa_1.antes`: pergunta e primeira dica (Dicionário das palavras). `LC_MG.falsa_1.luz.img`: `GAL_B_mascara` (antes `V11`, testa lisa). Dicionário: "Inscrição".
- **`ritmo.js`.** Fato "copia" da fita: "verniz novo, peso e escrita errados".
- **`game.js`.** `LOOP_DESC.patio` e `LOOP_DESC.manutencao`. `sala/conteudo.js` e `museu/torre/salas-loop.json` gerados de novo (só essas duas frases mudaram).
- **`museu/torre/index.html`.** Na Galeria (`?loop=1`), `OC.minDistance` 0,045 (as outras salas seguem com 0,12) e `zoomToCursor` (o zoom vai para onde está o dedo ou o cursor); ao sair, volta ao normal. `salas-loop.json?v=20261126c`.
- **`museu/icones/GAL_B_mascara.webp`** (novo, 320 px): a máscara da GAL_B atual (nó `V11`, com a película da inscrição), de frente, renderizada por script com a mesma luz de `museu/icones/gerar.html` (`/tmp/roda/esc/r12/scr/mascara.mjs`, fora do repositório). Cópia própria do Loop.
- **`style.css`.** Livro em até 375 px: a coluna de cada ficha da tábua do tamanho da casa (desenho de 44 px e rótulo centrados; "guardar" dentro da ficha). `.tv-clock span` com 12 px (relógio de exemplo do manual).
- **`bancada.css`.** `.cena-peca` com uma casa de grade da altura da cena: a imagem da luz de lado (320 px) cabe inteira (antes passaria da borda de baixo). `bancada.css?v=6` (as 3 chamadas em `loop-central.js`).
- **Versões nas páginas.** `style.css?v=26`, `loop-central-dados.js?v=37`, `loop-central.js?v=42`, `game.js?v=50`, `ritmo.js?v=10` (`individual.html`, `sala/index.html`; `sala/simulador/index.html` só o `style.css`); `ritmo.js?v=10` em `sala/telao/index.html`; `conteudo.js?v=5` em `sala/telao/telao.mjs`.
- **`dados/validar.py`.** Cabeçalho e linha impressa: "revisão 13" (a linha impressa ainda dizia "revisão 10"). `/tmp/roda/sim/validar.py` igual.

**Simulador de texto e validador.** APROVADO nas 5 causas (`/tmp/roda/esc/r12/validar.txt`).

**Testes de tela** (fora do repositório): os das revisões 9 a 12 e `/tmp/roda/esc/r12/scr/` (livro em 360, museu 3D na Galeria, minijogo da luz). `/tmp/pwt/r5.mjs` passou a esperar "revisão 13".

## Revisão 14 — 26/11/2026 · lote 12, depois das rodadas 11 a 13

**Por quê.** A história da rodada 12 reprovou na Consistência (8,5): a imagem do minijogo da luz é a máscara fosca e o texto dizia "O verniz brilha por igual". O autor mandou ajustar tudo o que as rodadas 11 a 13 apontaram. Escolhas e o que não foi aplicado em `DECISOES-V4.md`, "Revisão 14".

**O que mudou nos dados** (`dados/pistas-v4.json`, 281 pistas, "v4 revisão 14")
- Texto: `conserto_C`, `conserto_D`, `lenz_3`, `e_hist_1`, `teo_cadeira` (sem conclusão de narrador); `par_foto` ("pedra escura, riscos finos, bordas gastas"); `atividades_coop.coop_original_copia.telaPapel.A` ("rachadura fina do lado direito").
- **Rótulos que mudaram: 0.** Nenhuma volta, horário, tranca, `precisaDe`, `soNaCausa`, custo, fonte, ordem ou etiqueta mudou; nenhuma pista entrou ou saiu. O checklist abaixo continua valendo.

**O que mudou no código**
- **`loop-central.js`.** `LC_MG.falsa_1.luz.achou` ("O verniz cobre tudo por igual, até o grão da pedra. Nenhuma borda gasta, nenhum risco de uso."). Texto do controle da luz sem "Agora confira:" (a pergunta de antes pode não aparecer). `LC_MG.falsa_1.antes`: campo novo `se:['par_foto']` (a pergunta só aparece com a foto grande no caderno; `lcBancada` confere), pergunta e 4 opções da foto, dicas e mensagem de erro apontando para o caderno. `LC_MG.c_peca`: título "Abrir uma caixa da estante", pergunta pelo caderno, 4 etiquetas, dicas novas. Frases da Máquina: `lcPreConf` ("Você marcou..."), `lcAnexar` ("Quase.", diagnóstico aceito sem "Você não chutou"), botão "Revelar agora". Desfecho: `lcFatosFinal()` (novo, chamado por `lcResumoFinal`) com `LC_FATO_CURTO` e as miniaturas de `LOOP_LINHA` (ritmo.js).
- **`game.js`.** `PLANTA` do Térreo: área `est` (Sala das esculturas, em reforma: `div.pl-reforma`, sem toque), porta de vidro para a Área de descanso, porta fechada com fita, corredor `hall` de 14 px. `TOUR` passo 1: ilustração da planta (`.tv-planta`). `LOOP_DESC.patio`: "A tempestade não para, e a pedra está toda molhada." `sala/conteudo.js` e `museu/torre/salas-loop.json` gerados de novo (só a frase do Pátio mudou).
- **`style.css`.** `.lc-fim-fatos` (fichas do desfecho, com volume), `.pl-reforma`, `.pl-cadeado`, `.pl-porta.fechada`, `.pl-porta.vidro.t/.b`, `.tv-planta`.
- **`museu/pecas-compostas.mjs`.** `RACHA`, `texturasRacha`, `gravarRacha`: rachadura fina do lado direito da máscara da GAL_B (película 1 mm acima, cor + relevo, 220 triângulos); textura da inscrição gravada com qualidade 78 (era 82) para a peça caber. `museu/pecas/GAL_B.glb` (798.852 bytes), `museu/icones/GAL_B.webp` (160 px, com margem) e `museu/icones/GAL_B_mascara.webp` (320 px, `/tmp/roda/r14/masc.mjs`, fora do repositório) refeitos. `LOOP_PONTOS`: igual.
- **Versões nas páginas.** `style.css?v=27` (`index.html`, `individual.html`, `sala/index.html`, `sala/simulador/index.html`, `sala/telao/index.html`), `loop-central-dados.js?v=38`, `loop-central.js?v=43`, `game.js?v=51` (`individual.html`, `sala/index.html`); `conteudo.js?v=6` em `sala/telao/telao.mjs`; `salas-loop.json?v=20261126d` em `museu/torre/index.html`.
- **`dados/validar.py`, `dados/simulador-texto.py`.** Só o cabeçalho e a linha impressa ("revisão 14"). `/tmp/roda/sim/validar.py` igual.

**Simulador de texto e validador.** `/tmp/roda/esc/r14/validar.txt`.

**Testes de tela** (fora do repositório): os das revisões 9 a 13, `/tmp/roda/planta/jogo.mjs` e `/tmp/roda/r14/` (planta com a sala em reforma, desfecho, manual). `/tmp/pwt/r5.mjs`, `/tmp/roda/r6/cap.mjs` e `/tmp/roda/r10/insc.mjs` passaram a escolher as respostas novas dos minijogos.

## Revisão 15 — 26/11/2026 · pasta renomeada para mosaico-loop, sem redirecionamento; identificadores internos renomeados

**Por quê.** O autor pediu para o Loop não aparecer mais como "cinco minutos" no GitHub. A pasta agora é `mosaico-loop/`; os endereços da pasta antiga dão 404 (sem redirecionamento, por decisão do autor). Chaves do navegador com prefixo `mosaico-loop-`; salas cooperativas do jogo sem turma no projeto Firebase `mosaico-loop`, coleções `loopRooms` e `loopClocks`, regras em `firebase-loop/firestore.rules` (publicar). Detalhes em `DECISOES-V4.md`, "Revisão 15". O jogo, as pistas e as voltas não mudaram.

## Checklist por volta (recalculado dos dados em 26/11/2026, revisão 13; na revisão 14 nenhuma pista entrou ou saiu e nenhuma volta, horário, tranca nem rótulo mudou)

Conferido em `dados/pistas-v4.json` (campos `volta_min`, `volta_max`, `segundo_min`, `precisaDe`, `soNaCausa`, `parDe`, `grupos_fonte`, `atividades_coop`). Horários com `valores_padrao` (raio em 1:10); com outra hora sorteada, os horários ligados ao raio andam junto. Pistas por `volta_min`: **232 na volta 1, 27 na volta 2, 9 na volta 3, 9 na volta 4, 4 na volta 5** (281 no total). Por tipo: 216 comuns, 26 de dupla, 21 de observação (clima), 16 falsas honestas, 2 objetos. Ativas por noite: 210 (A), 211 (B), 210 (C), 210 (D), 215 (E) (as 3 novas valem nas 5 noites).

**Itens na lista de cada sala, na volta 1 (igual nas 5 causas):** Subsolo 18, Oficina elétrica 12, Pátio 16, Sala dos relógios 7, Central 16, Recepção 12, Sala de conservação 11, Ateliê 19, Sala das coleções 12, Galeria 8, Oficina técnica 10, Área de descanso 12, Base da limpeza 9, Sala dos sons 5, Sala da fotografia 9.

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
| 4:05 | — | Seu Dirceu aponta com o esfregão (Base da limpeza) |
| 4:10 | Lenz desce e vira a chave de ligar da Câmara. Ela leva 50 segundos para armar | "Cinco minutos de volta" (volta 1) e fala na escada (volta 4) |
| 5:00 | A Câmara dispara: reinício | — |

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
| **Prova da cópia** | Comparar a foto sem dupla (Galeria) | volta 2 | Ter a foto grande do catálogo; 2 de energia |
| | Laudo do Aurélio (Sala de conservação); molde de gesso (Sala das coleções) | volta 2 | Ter sentido o cheiro de verniz |
| | A peça verdadeira, dentro da caixa de "banners" (Sala das coleções) | volta 2 | Cheiro de verniz + uma pista da caixa (peso, guia de retirada ou gravação do Braga) |
| | Lado a Lado (Galeria + Sala da fotografia): rachadura, cor da pedra e desgaste nas bordas | volta 2 | Dupla; foto grande do catálogo |
| | Inscrição na máscara (Galeria): o quinto símbolo está virado e não existe na tábua | volta 2 | Cheiro de verniz + tábua do livro de registro (Sala de conservação, volta 1, 1 de energia); 1 de energia; minijogo |
| **Trajeto** | Marca de sola na porta de serviço (Área de descanso) | volta 1 | 1 de energia |
| | Câmera da porta de serviço (Central, 4:00); Seu Dirceu (Base da limpeza, 4:05); escada do Subsolo (4:10) | volta 1 | Só depois que o paletó passa |
| | Conferir as listas sem dupla (Central) | volta 1 | Registro da roleta da saída + livro de visitas; 2 de energia |
| | Chão da Área de descanso sem dupla (1:11) | volta 1 | Respingos de tinta já anotados; 2 de energia |
| | Foto e legenda, juntas (Área de descanso) | volta 2 (a segunda metade só chega por Passar pista, na pausa; sem turma, as duas metades aparecem na volta 1) | As duas metades no caderno (Pátio + Área de descanso); 1 de energia |
| | Caderno de rondas do Braga, no cofre (Central): a volta pela porta de serviço, no começo da noite | volta 1 | Abrir o cofre: o número de registro de trás para a frente; 1 de energia |
| | As Duas Listas (Recepção + Central); Apagão Combinado (Pátio + Área de descanso) | volta 2 | Dupla |
| **Crachá (o nome)** | Braga admite (Central) | volta 3 | Escala + bilhete + uma prova da cópia (laudo, Lado a Lado, foto comparada sem dupla, a peça verdadeira na mão ou a inscrição da máscara) |
| | Mostrar o bilhete ao homem de paletó (Área de descanso, 4:02) | volta 3 | Bilhete do armário + livro de visitas + já ter visto ele passar (4:02, grátis) |
| | Acusação e Defesa (Central + Base da limpeza) | volta 3 | Dupla; escala + bilhete |

Não contam como prova: o cheiro de verniz; o bilhete do armário e o livro de visitas soltos; a foto sem legenda ou a legenda sem foto, sozinhas.

### Volta 1
- **Abre:** 232 pistas (todas as salas). Sinais da máquina e leituras normais da noite, e os pares de mesmo rótulo, que são objetos de ambiente; manual, páginas 1 a 6, e a folha amassada da impressora; Téo caído, mancha, botão de paletó e prateleira; cheiro de verniz (suspeita); recibo, ficha e diário do dia da troca; as 3 fontes do registro; a tábua da escrita antiga (livro de registro, página logo depois do número); raio e hora do apagão; bilhete do crachá sem assinatura; escala; livro de visitas sem nome; contrato; caixa de "banners" fechada; cartão do Téo na Recepção; cofre do Braga (pede o registro, de trás para a frente) e pêndulo; Nico reparando em quem chega. Nenhuma atividade em dupla. Diagnóstico ainda fechado ("A página de diagnóstico abre na volta 2").
- **Não pode vazar:** o nome do culpado; laudo, molde, a peça verdadeira, a comparação da foto sem ajuda; páginas anteriores do diário, carta da seguradora, gravação; o pendrive; a ata; a causa pela lista da sala; a hora do raio pela lista; o conserto da noite pela aba Atividades (só aparece com o diagnóstico anexado); a troca da peça pelos textos de entrada, ajuda, aba Revelar e missões.
- **Conferência:** laudo, molde, caixa aberta, inscrição na máscara, testa da peça verdadeira, diário anterior e carta têm `volta_min` 2; "Braga admite", "mostrar o bilhete", Acusação e Defesa, livro da Central e gravação têm `volta_min` 3; pendrive, voz do Téo, ata, guardanapo e fala na escada têm `volta_min` 4. O nome "Lenz" não aparece em nenhuma pista de volta 1: OK. Prévias iguais nas 5 causas, sala por sala (0 rótulos em causa única): OK. Mesma sequência nas 5 causas, em toda sala e toda volta (validador g2 e `ordem.mjs`): OK. Lista sem contagem regressiva: OK. Aba Atividades sem conserto antes do diagnóstico, nas 5 causas: OK. Tranca igual nas 5 causas (`pares.py`: diferenças por campo = nenhuma): OK. Minijogo da caixa fora da volta 1: OK.
- **Horários que importam:** o raio (anotar a hora) e a volta do paletó, às 4:00.

### Volta 2
- **Abre:** +27 pistas: laudo do Aurélio, molde de gesso, a peça verdadeira na caixa, comparar a foto sem ajuda, a inscrição na máscara (com minijogo) e a testa da peça verdadeira (depois de abrir a caixa), páginas anteriores do diário (2), carta da seguradora, a mancha medida com o pé (para quem já viu a mancha), a escultura atrás da porta de vidro (para quem já viu o paletó passar), Nico explicando a Galeria (para quem já falou com ele), a música da Sala dos sons, objetos no chão (luva isolante no Pátio, peça verdadeira no Subsolo), produtos das atividades e ensaios (o meio conserto da noite E passou para a volta 3). **Anexar o diagnóstico** (1 tentativa por volta). Atividades em dupla (`volta_min` 2): Lado a Lado, As Duas Listas, Apagão Combinado, Painel e Manual (olhar o painel gasta 1 de energia; entrega a leitura completa; não anexa), Correio do Loop; ensaio do conserto para quem já anexou.
- **Não pode vazar:** o nome (a carta da seguradora diz só "quem assinou pelo patrocínio"); conserto valendo (só na volta 5); eco do Raio (só da volta 3); meio conserto da noite E (só da volta 3); Revelar (só na volta 5).
- **Conferência:** ensaios têm `volta_min` 2 e `volta_max` 4; consertos finais têm `volta_min` 5: OK. Eco: `volta_min_gravar` 3 e a pista do eco com `volta_min` 3: OK. Noite E: `regras.E_volta_min_meio` 3, lido pelo jogo e pelo simulador: OK.
- **Horários que importam:** a luva isolante só sai do armário depois do apagão (1:10).

### Volta 3
- **Abre:** +9 pistas (o nome "Lenz" nasce aqui): Braga admite, Acusação e Defesa (atividade e produto), mostrar o bilhete ao homem de paletó (4:02, para quem já viu ele passar), livro da Central, Aurélio diante do diário e do laudo, gravação do telefonema, eco da chave, os dois meios consertos da noite E. Eco do Raio (gravar no Pátio dentro da janela). Noite E: primeiro conserto pode ficar gravado na Câmara.
- **Não pode vazar:** pendrive, voz do Téo, ata, guardanapo; conserto valendo; Revelar; os dois consertos da noite E na mesma volta (com ou sem dupla: ficam gravados como meio cada um).
- **Conferência:** trava da noite E no código: OK.
- **Horários que importam:** janela do Raio (1:04 a 1:20) para o eco; 4:02 para mostrar o bilhete.

### Volta 4
- **Abre:** +9 pistas: pendrive do Nico (primeira conversa + Téo caído + laudo + registro), voz do Téo no rádio (com o envelope que ele recusou) e a continuação da gravação (um texto por noite), ata da reunião, guardanapo no paletó reserva, fala do homem de paletó na escada (4:10), o painel depois do ensaio (para quem já ensaiou). Ensaio geral: a máquina responde REAGE / NÃO REAGE, diz quantos valores estão certos (nunca qual) e avisa o que ainda pode falhar. Quem fica na Central de monitoramento confirma em voz alta quem está onde.
- **Não pode vazar:** conserto valendo; Revelar.
- **Conferência:** última volta dos ensaios (`volta_max` 4): OK. Noite E: se o primeiro conserto não foi gravado até aqui, não há mais como chegar ao Desligar. Em sala, na pausa desta volta cada pessoa toca no seu papel da última volta.
- **Horários que importam:** janela do Raio; quem vai apresentar precisa das 3 provas no próprio caderno até a pausa (passar pista: até 3).

### Volta 5
- **Abre:** +4 pistas (os consertos finais A, B, C, D). Conserto valendo. **Revelar**: só nesta volta, na Recepção, antes de 5:00, uma tentativa por aparelho, com 1 prova da cópia + 1 do trajeto + 1 do crachá no caderno de quem apresenta. Papéis: Quem opera, Quem apoia, Central, Porta-voz, Guarda do dossiê (escolhidos na tela, na pausa da volta 4; a dica do papel aparece nesta volta).
- **Não pode vazar:** nada mais a segurar. Não há ensaio nesta volta.
- **Conferência:** finais no campo `finais`: Desligar (causa certa, diagnóstico anexado, conserto na volta 5; texto próprio para cada uma das 5 causas; a sirene só aparece com `sato_teo` no caderno), Revelar (3 provas, Recepção, volta 5, até 300 s), Ouro (os dois na volta 5), Parcial, Mínimo: OK. Trava do Revelar no código (`lcRevelar`): OK.
- **Horários que importam:** janela do Raio (noites B e E); 5:00 é o limite do Revelar.

### Pendências
Nenhuma de texto, dado ou código (revisão 14). Os pontos de regra que as rodadas 5 e 6 deixam para o autor estão em `DECISOES-V4.md`, "Revisão 7 · Ficou para decidir": não bloqueiam o jogo. O que as revisões 2 e 3 deixaram em aberto foi fechado assim:

| Assunto | Como ficou | Quem decidiu |
|---|---|---|
| Escrita da máscara (revisão 10) | Inventada, própria do Loop; símbolos desenhados (não emoji, não ícone), conteúdo de pista e não ícone de interface; o nome "máscara" fica | Autor, 25/11/2026 |
| Seletor "Bem-vindo / Bem-vinda / Tanto faz" e "Como quer ser chamado" na entrada com código | Intencional, padrão de todos os Mosaicos: não é defeito de gênero nem de ícone; não mexer | Autor, 25/11/2026 |
| Energia de quem joga sem dupla | 5 por volta para todo mundo | Responsável, 25/11/2026 |
| Revelar | Só na volta 5, na Recepção | Responsável, 25/11/2026 |
| Senha do cofre | Sorteada: o registro de trás para a frente | Responsável, 25/11/2026 |
| Pegadas | Somem na porta de serviço; linha do tempo com a saída e a volta | Responsável, 25/11/2026 |
| Custo da escolha final | Fica como o código faz: Desligar e Revelar não têm custo extra | Regra desta revisão: vale o código, sem mecânica nova |
| Noite E sem dupla | Um conserto por volta, com ou sem dupla; primeiro conserto da volta 3 em diante (o validador aprovou sem precisar liberar a volta 2) | Responsável, revisão 4 |
| "Lenz" na volta 2 | Só da volta 3 em diante; a carta diz "quem assinou pelo patrocínio" | Responsável, revisão 4 |
| Comparar a foto sem ajuda | Volta 2 | Responsável, revisão 4 |
| Pares inocentes | Objeto de ambiente; par continua sem grupo nem etiqueta | Responsável, revisão 4 |
| Prova do trajeto | Caderno de rondas e foto com legenda valem os dois | Responsável, revisão 4 |
| Pendrive | Fato novo: o envelope recusado | Responsável, revisão 4 |
| Dra. Sato sem dupla | Só fala: dita e confere | Responsável, revisão 4 |
| Painel e Manual | Entrega a leitura completa; não anexa | Responsável, revisão 4 |
| Etiqueta no caderno | Mantida; a pista recebida conserva a etiqueta | Responsável, revisão 4 |
| Telão final | Final da história e fita completa em ordem; sem as 8 perguntas. Desde a revisão 6, as missões cumpridas têm página própria | Responsável, revisão 4 |
| Ensaio "2 de 3" | Já é o que o código faz: diz quantos, nunca qual. Dados e simulador alinhados | Regra desta revisão |
| Papel Central, bloqueio do Apagão Combinado, objeto de volta à mão | Dados e documentos dizem o que o código faz (Central falada; sem bloqueio; objeto pode ser pego de novo) | Regra desta revisão |
| Trava da noite E no navegador | Corrigida no código | Correção 1 da conferência técnica |
| Textos que ficavam no código | Minijogos e dica da aba Revelar reescritos; missões secretas listadas (8) | Correções 5 a 8 |
