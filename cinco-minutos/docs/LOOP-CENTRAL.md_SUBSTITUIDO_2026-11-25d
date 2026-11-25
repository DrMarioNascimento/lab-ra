# Loop · A Máquina (camada central)

Arquivos: `dados/pistas-v4.json` (fonte dos dados, **229 pistas**, versão v4, **revisão 2 de 25/11/2026**) → `loop-central-dados.js` (gerado a partir dele), `loop-central.js` (regras e telas). Enredo: `ROTEIRO-LOOP.md`. Decisões aplicadas: `DECISOES-V4.md`. Botão **🧭 Máquina** no canto da tela.

- **Defeito por semente** (5 causas): A falta ajustar, B falta força, C peça presa (a máquina se segura na peça errada da base), D fusível tirado de propósito, E dois defeitos juntos (A + B, em voltas diferentes). Roteiro completo em `ROTEIRO-LOOP.md`. Os sinais de cada defeito só existem quando ele é o sorteado; o manual (páginas 1 a 6), a folha amassada da impressora, o apito curto da base e a caixa de "banners" com a peça verdadeira existem em todas as noites.
- **Valores por semente** (nada decorável): dia da troca (9 a 25), hora do apagão (1:00, 1:05, 1:10, 1:15 ou 1:20), número de registro (3 algarismos), ordem dos 3 pontos de ligação, número da chave do para-raios. Nos dados os textos usam os marcadores `{dia}` `{hora}` `{reg}` `{ordem}` `{ch}`; `valores_padrao` (14, 1:10, 472, 3-1-2, chave 3) serve para simulação e para os exemplos dos documentos.
- **Lugares**: máquina e botão "Loop Reset" no **Subsolo · Câmara do tempo**; quadro de energia e para-raios **fora do prédio**, no Pátio; Oficina elétrica com luvas e chavinha; a luva isolante do armário da Oficina técnica (só destrava no apagão) também conta como luva.
- **Dossiê**: a partir da volta 2, anexar o diagnóstico com 3 pistas (2 sinais da máquina de tipos diferentes + 1 leitura normal), uma tentativa por volta. Também sai pela dupla "Painel e Manual". Etiquetas no caderno: "SINAL DA MÁQUINA · <o que se vê>", "LEITURA NORMAL · <onde>", "MANUAL".
- **Atividades**: em dupla (cada pessoa numa sala; palavra da dupla que muda a cada 30 s; no Raio, código de 3 números da chave + **janela única de 6 s antes até 10 s depois do raio: 1:04 a 1:20 com o padrão, 64–80 s**) ou solo (mais caro: ajustar sem dupla = 3 de energia com tudo no próprio caderno; Raio solo = eco gravado pela Câmara numa volta, da 3 em diante, e alavanca em outra). Nomes: Lado a Lado, As Duas Listas, Apagão Combinado, Painel e Manual, Correio do Loop (todas da volta 2), Acusação e Defesa (da volta 3); consertos Três Números (A), O Raio (B), A Verdadeira (C), Fio a Fio (D).
- **Ensaio das voltas 2 a 4, volta 5 vale.** Finais: Ouro, Desligar, Revelar, Parcial, Mínimo (textos no campo `finais` dos dados, copiados na parte 8 do roteiro).
- **Passar pista**: só na pausa, por código de 4 letras, grátis, até 3 por pessoa por pausa (sem servidor).
- **Recurso de quem joga**: "energia". Carga é só o ponteiro da máquina.
- Sem Firebase novo: tudo roda em cada aparelho. Dossiê compartilhado em tempo real exigiria regra nova do Firestore.

Simulação: rodada 1 (10 grupos, 0 conserto) → versão 2 → rodada 2 (12 grupos: 9 Desligar/Ouro, 3 Parcial) → ... → rodada 16 (20 grupos: 16 Ouro). Ver `docs/simulacao/`.

## Novidades de 24/11/2026
- **Detalhes que distraem**: 10 pistas novas (café, quadro torto, gato no quadro de energia, balde com multímetro, lâmpadas queimadas, relógio de pulso parado, rádio chiando, bilhete do eletricista, cola fresca, foto da festa). As que parecem sinal são "falsa honesta": não contam no anexar.
- **Quebra-cabeça**: o cofre do Braga (Central de monitoramento) pede 3 números tirados da descrição da máquina do Subsolo (3 mostradores, 1 luz da peça, 1 botão). Desde a revisão 2 o caderno de rondas que está dentro dele não conta mais como prova do trajeto (mostra o crachá em uso no começo da noite, não a descida ao Subsolo).
- **Armadilha do pêndulo** (Sala dos relógios): puxar a corda adianta 40 s no relógio de TODO mundo. Há uma plaquinha de aviso ao lado do pêndulo, com a letra do Seu Dirceu. Cada aparelho aplica uma vez; o aviso viaja pelos campos `alarmeVolta/alarmeSeg/alarmeId` do próprio jogador na sala do Mestre (regra nova em `firebase-loop/firestore.rules`: precisa publicar as regras para valer em todos os aparelhos; sem isso vale só para quem puxou).

## Ajuste 19:40 — mais pistas (Regra das Três Pistas)
- 170 → 201 pistas. Cada sinal e cada leitura normal do diagnóstico ganhou uma segunda fonte em outra sala (sinais diegéticos: quadro de consumo, lâmpada, visor, metrônomo, medidor, armário de fusíveis).
- Caso contra o suspeito com 3 pontas: motivo, meio e oportunidade do Lenz; álibis e pistas falsas com retorno para Ivone e Braga; diário do Téo em três dias (dia da troca, 2 e 4 dias antes); 6 detalhes de clima do museu.
- Teto do validador subiu de 125 para 160 pistas ativas; validar.py APROVADO nas 5 causas.

## União Loop + Reserva (24/11)
- Base: Loop (5 causas, Mestre). A Reserva ("A peça que o museu esqueceu") fica como episódio e seus minigames viram a BANCADA do Loop.
- Bancada (`bancada.css`, `LC_MG` em loop-central.js): ao coletar a foto antiga do catálogo, a peça principal (luz rasante), a fita da câmera do corredor de serviço, a caixa de banners e a escala de crachás, abre o minigame; acertar entrega a pista. Errar não gasta energia; há "Pedir uma pista".
- Ritmo: `abre_1` (cartão do Téo na Recepção, objetivo claro na volta 1, custo 0); `rev_3` (hoje é a ata da reunião com "então apaga?", o engano do Lenz); ensaio da volta 4 diz o que ainda pode falhar na execução final (por causa).
- Um jogo só: o Loop é a base. Minigames da Reserva entram como bancada em 5 pistas e em 2 atividades em dupla (Lado a Lado, As Duas Listas). Cooperação Pátio/Área de descanso já existia no Loop (Apagão Combinado).
- Desfecho mostra quais das 3 provas a equipe reuniu. A Reserva fica na entrada como "Episódio visual", sem competir com o Loop.

## Missão secreta e pista de metades (24/11)
- **Missão secreta** (5): o que o Braga esconde; o que derrubou o Téo; quem ganha se a peça sumir; por que a Ivone não pode ter trocado; o que o Aurélio sabia. Cada pessoa recebe uma (card no dossiê). Cumprir rende +1 de energia na volta seguinte.
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
- **Salas:** a sala `corredor` chama **Área de descanso** em todo texto (a porta de serviço fica nela; "corredor de serviço" é só o que a câmera da Central mostra do outro lado da porta).
- **Campos internos** acertados: `regras.volta_4`, `regras.conserto`, `regras.revelar`, `regras.escada` (novo), `trancas.*.troca_dossie` (grátis, até 3), chaves de `trancas` da prova da cópia, do trajeto, do nome, da hora e da luva.
- **Validador** (`/tmp/roda/sim/validar.py`): duas regras mudaram para acompanhar as decisões: uma pista pode constar em um segundo grupo quando declara `gruposExtras`; para as provas do Revelar, "fonte sem trava" aceita `volta_min` até 3 (o nome só sai na volta 3). Resultado: APROVADO nas 5 causas.

**Não entrou (pede código):** custo da escolha final entre Desligar e Revelar; energia de quem joga sem dupla com um número só (5 em `regras`, 6 em `compensacao_solo`); folga de uma volta para a noite E sem dupla; ensaio respondendo "2 de 3" sem dizer qual valor está errado; fala da Dra. Sato nos três carimbos; minijogos e textos de tela citados no relatório de personagens.

## Checklist por volta (recalculado dos dados em 25/11/2026, revisão 2)

Conferido em `dados/pistas-v4.json` (campos `volta_min`, `volta_max`, `segundo_min`, `precisaDe`, `soNaCausa`, `grupos_fonte`, `atividades_coop`). Horários com `valores_padrao` (raio em 1:10); com outra hora sorteada, os horários ligados ao raio andam junto. Pistas por `volta_min`: **188 na volta 1, 25 na volta 2, 6 na volta 3, 6 na volta 4, 4 na volta 5** (229 no total). Ativas por noite: 179 (A), 179 (B), 177 (C), 179 (D), 183 (E).

**Horários fixos de toda volta**

| Minuto | O que acontece | Pistas que dependem do horário |
|---|---|---|
| 1:04 a 1:20 | Janela do Raio | Conserto O Raio e eco |
| 1:00 a 1:20 | Apagão Combinado bloqueada | — |
| 1:10 | Raio no para-raios, apagão | Para-raios no Pátio (1:10); armário da luva isolante destrava na Oficina técnica (1:10) |
| 1:11 | — | Relógios parados (Sala dos relógios), gravador do rádio (Sala dos sons), pegadas brilhando sem dupla (Área de descanso) |
| 1:13 | Gerador entra | Relógio da Recepção, fita de papel do gerador (Oficina elétrica) |
| 1:15 | — | Câmera do pátio e câmera 4 (Central) |
| 1:20 | — | Foto da câmera antiga (Sala da fotografia) |
| 2:40 | Alarme | — |
| 3:58 | Homem de paletó cruza a Área de descanso | Fala dele (volta 1) e "mostrar o bilhete" (volta 3) |
| 4:00 | Crachá do Braga abre a porta de serviço | Câmera do corredor de serviço (Central) |
| 4:05 | — | Seu Dirceu aponta com o rodo (Base da limpeza) |
| 4:10 | Lenz desce e vira a chave de ligar da Câmara | "Cinco minutos de volta" (volta 1) e fala na escada (volta 4) |
| 5:00 | Reinício | — |

**Fontes por fato essencial**

| Fato | Fontes (sala) | Desde | Condição |
|---|---|---|---|
| **Hora do apagão** | Sala dos relógios; Recepção; Sala da fotografia; Sala dos sons; Oficina elétrica (5 fontes) | volta 1 | Só depois do apagão (1:11 a 1:20, conforme a sala) |
| **Dia da troca** | Recibo do restauro (Ateliê); ficha de movimentação (Sala das coleções); diário do acervo (Sala de conservação) | volta 1 | Nenhuma |
| **Número de registro** | Livro de registro (Sala de conservação); foto antiga do catálogo (Sala da fotografia); etiqueta da caixa vazia (Sala das coleções) | volta 1 | Nenhuma |
| **Luva isolante** | Gancho da Oficina elétrica; carrinho de limpeza (Base da limpeza) | volta 1 | Nenhuma |
| | Armário da Oficina técnica | volta 1 | Só depois do apagão (1:10) |
| | Luva deixada no chão do Pátio | volta 2 | Alguém deixou em volta anterior |
| **Prova da cópia** | Comparar a foto sem dupla (Galeria) | volta 1 | Ter a foto grande do catálogo; 2 de energia |
| | Laudo do Aurélio (Sala de conservação); molde de gesso (Sala das coleções) | volta 2 | Ter sentido o cheiro de verniz |
| | A peça verdadeira, dentro da caixa de "banners" (Sala das coleções) | volta 2 | Cheiro de verniz + uma pista da caixa (peso, guia de retirada ou gravação do Braga) |
| | Lado a Lado (Galeria + Sala da fotografia) | volta 2 | Dupla; foto grande do catálogo |
| **Trajeto** | Marca de sola na porta de serviço (Área de descanso) | volta 1 | 1 de energia |
| | Câmera do corredor de serviço (Central, 4:00); Seu Dirceu (Base da limpeza, 4:05); escada do Subsolo (4:10) | volta 1 | Só perto das 4:00 |
| | Conferir as listas sem dupla (Central) | volta 1 | Registro da roleta da saída + livro de visitas; 2 de energia |
| | Pegadas sem dupla (Área de descanso, 1:11) | volta 1 | Respingos de tinta já anotados; 2 de energia |
| | Foto e legenda, juntas (Área de descanso) | volta 1 | As duas metades no caderno (Pátio + Área de descanso); 1 de energia |
| | As Duas Listas (Recepção + Central); Apagão Combinado (Pátio + Área de descanso) | volta 2 | Dupla |
| **Crachá (o nome)** | Braga admite (Central) | volta 3 | Escala + bilhete + uma prova da cópia (laudo, Lado a Lado, foto comparada sem dupla ou a peça verdadeira na mão) |
| | Mostrar o bilhete ao homem de paletó (Área de descanso, 3:58) | volta 3 | Bilhete do armário + livro de visitas |
| | Acusação e Defesa (Central + Base da limpeza) | volta 3 | Dupla; escala + bilhete |

Não contam como prova: o cheiro de verniz; o bilhete do armário e o livro de visitas soltos; o caderno de rondas do cofre; a foto sem legenda ou a legenda sem foto, sozinhas.

### Volta 1
- **Abre:** 188 pistas (todas as salas). Sinais da máquina e leituras normais da noite; manual, páginas 1 a 6, e a folha amassada da impressora; Téo caído, mancha, botão de paletó e prateleira; cheiro de verniz (suspeita); recibo, ficha e diário do dia da troca; as 3 fontes do registro; raio e hora do apagão; bilhete do crachá sem assinatura; escala; livro de visitas sem nome; contrato; caixa de "banners" fechada; cartão do Téo na Recepção; cofre do Braga e pêndulo; Nico reparando em quem chega. Nenhuma atividade em dupla. Diagnóstico ainda fechado ("A página de diagnóstico abre na volta 2").
- **Não pode vazar:** o nome do culpado; laudo, molde, a peça verdadeira; páginas anteriores do diário, carta da seguradora, gravação; o pendrive; a ata.
- **Conferência:** laudo, molde, caixa aberta, diário anterior e carta têm `volta_min` 2; "Braga admite", "mostrar o bilhete", Acusação e Defesa, livro da Central e gravação têm `volta_min` 3; pendrive, voz do Téo, ata, guardanapo e fala na escada têm `volta_min` 4. O nome "Lenz" não aparece em nenhuma pista de volta 1: OK.
- **Horários que importam:** o raio (anotar a hora) e a passagem das 4:00.

### Volta 2
- **Abre:** +25 pistas: laudo do Aurélio, molde de gesso, a peça verdadeira na caixa, páginas anteriores do diário (2), carta da seguradora, a mancha medida com o pé, a escultura atrás da porta de vidro, Nico explicando a Galeria, objetos no chão (luva isolante no Pátio, peça verdadeira no Subsolo), produtos das atividades e ensaios. **Anexar o diagnóstico** (1 tentativa por volta). Atividades em dupla (`volta_min` 2): Lado a Lado, As Duas Listas, Apagão Combinado, Painel e Manual, Correio do Loop; ensaio do conserto para quem já anexou.
- **Não pode vazar:** o nome; conserto valendo (só na volta 5); eco do Raio (só da volta 3); meio conserto da noite E (só da volta 3); Revelar (só na volta 5).
- **Conferência:** ensaios têm `volta_min` 2 e `volta_max` 4; consertos finais têm `volta_min` 5: OK. Eco: `volta_min_gravar` 3: OK. Noite E: `regras.E_volta_min_meio` 3: OK nos dados (ver nota técnica no fim).
- **Horários que importam:** luva isolante só sai do armário depois do apagão (1:10); Apagão Combinado fora de 1:00 a 1:20.

### Volta 3
- **Abre:** +6 pistas: Braga admite, Acusação e Defesa (atividade e produto), mostrar o bilhete perto das 4:00, livro da Central, Aurélio diante do diário e do laudo, gravação do telefonema. Eco do Raio (gravar no Pátio dentro da janela). Noite E: primeiro conserto pode ficar gravado na Câmara.
- **Não pode vazar:** pendrive, voz do Téo, ata, guardanapo; conserto valendo; Revelar; os dois consertos da noite E na mesma volta.
- **Conferência:** dica dirigida do Mestre para quem joga sem dupla começa aqui (`compensacao_solo`): OK.
- **Horários que importam:** janela do Raio (1:04 a 1:20) para o eco; 3:58 para mostrar o bilhete.

### Volta 4
- **Abre:** +6 pistas: pendrive do Nico (registro + laudo), voz do Téo no rádio, ata da reunião, guardanapo no paletó reserva, fala do homem de paletó na escada (4:10), o painel depois do ensaio. Comando da Central de monitoramento (0 de energia): mostra onde cada pessoa está, o que falta para o conserto e quem tem as 3 provas. Ensaio geral: a máquina responde REAGE / NÃO REAGE, diz qual valor está errado e o que ainda pode falhar.
- **Não pode vazar:** conserto valendo; Revelar.
- **Conferência:** última volta dos ensaios (`volta_max` 4): OK. Noite E: se o primeiro conserto não foi gravado até aqui, não há mais como chegar ao Desligar.
- **Horários que importam:** janela do Raio; quem vai apresentar precisa das 3 provas no próprio caderno até a pausa (passar pista: até 3).

### Volta 5
- **Abre:** +4 pistas (os consertos finais A, B, C, D). Conserto valendo. **Revelar**: na Recepção, antes de 5:00, uma tentativa por grupo, com 1 prova da cópia + 1 do trajeto + 1 do crachá no caderno de quem apresenta. Papéis: Mão A, Mão B, Central, Porta-voz, Guardião do dossiê.
- **Não pode vazar:** nada mais a segurar. Não há ensaio nesta volta.
- **Conferência:** finais no campo `finais`: Desligar (causa certa, diagnóstico anexado, conserto na volta 5; texto próprio para cada uma das 5 causas), Revelar (3 provas, Recepção, até 300 s), Ouro (os dois na volta 5), Parcial, Mínimo: OK.
- **Horários que importam:** janela do Raio (noites B e E); 5:00 é o limite do Revelar.

### Pendências que continuam (não são de dados)
- **Regra, pede código e aval do autor:** custo da escolha final; energia de quem joga sem dupla (5 em `regras.cargas_por_volta`, 6 em `compensacao_solo.cargas_por_volta`); folga de uma volta para a noite E sem dupla; ensaio respondendo "2 de 3" sem dizer qual valor.
- **Nota técnica (código):** `loop-central.js` lê `LC.E_volta_min_meio`, mas o valor está em `regras.E_volta_min_meio`; no navegador a trava "primeiro conserto da noite E só da volta 3" fica sem efeito (o simulador em Python lê do lugar certo).
- **Textos que ficam no código:** minijogos da bancada (a pergunta da escala de crachás ainda fala em "toda volta"; a da peça principal fala em "selo" e "fissura"; a das Duas Listas usa números de crachá e de caixa), dica "o chão do corredor" na aba Revelar, missões secretas.
- As pendências de dados listadas na revisão de 25/11 foram resolvidas (nome na volta 1, janela do Raio, troca de pistas, chave do crachá em `trancas`, Painel e Manual, relógio, palavra antiga na ficha de ensaio, "dicas da limpeza", `noite`).
