# Loop · A Máquina (camada central)

Arquivos: `dados/pistas-v4.json` (fonte dos dados, **224 pistas**, versão v4 de 25/11/2026) → `loop-central-dados.js` (gerado a partir dele), `loop-central.js` (regras e telas). Enredo: `ROTEIRO-LOOP.md`. Decisões aplicadas: `DECISOES-V4.md`. Botão **🧭 Máquina** no canto da tela.

- **Defeito por semente** (5 causas): A falta ajustar, B falta força, C peça presa (a máquina se segura na peça errada da base), D fusível tirado de propósito, E dois defeitos juntos (A + B, em voltas diferentes). Roteiro completo em `ROTEIRO-LOOP.md`. Os sinais de cada defeito só existem quando ele é o sorteado; o manual (páginas 1 a 6) e a caixa de "banners" com a peça verdadeira existem em todas as noites.
- **Valores por semente** (nada decorável): dia da troca (9 a 25), hora do apagão (1:00, 1:05, 1:10, 1:15 ou 1:20), número de registro (3 algarismos), ordem dos 3 pontos de ligação, número da chave do para-raios. Nos dados os textos usam os marcadores `{dia}` `{hora}` `{reg}` `{ordem}` `{ch}`; `valores_padrao` (14, 1:10, 472, 3-1-2, chave 3) serve para simulação e para os exemplos dos documentos.
- **Lugares**: máquina e botão "Loop Reset" no **Subsolo · Câmara do tempo**; quadro de energia e para-raios **fora do prédio**, no Pátio; Oficina elétrica com luvas e chavinha.
- **Dossiê**: a partir da volta 2, anexar o diagnóstico com 3 pistas (2 sinais da máquina de tipos diferentes + 1 leitura normal), uma tentativa por volta. Também sai pela dupla "Painel e Manual". Etiquetas no caderno: "SINAL DA MÁQUINA · <o que se vê>", "LEITURA NORMAL · <onde>", "MANUAL".
- **Atividades**: em dupla (cada pessoa numa sala; palavra da dupla que muda a cada 30 s; no Raio, código de 3 números da chave + **janela única de 6 s antes até 10 s depois do raio: 1:04 a 1:20 com o padrão, 64–80 s**) ou solo (mais caro: ajustar sem dupla = 3 de energia com tudo no próprio caderno; Raio solo = eco gravado numa volta, da 3 em diante, e alavanca em outra). Nomes: Lado a Lado, As Duas Listas, Apagão Combinado, Painel e Manual, Correio do Loop, Acusação e Defesa; consertos Três Números (A), O Raio (B), A Verdadeira (C), Fio a Fio (D).
- **Volta 4 ensaio, volta 5 vale.** Finais: Ouro, Desligar, Revelar, Parcial, Mínimo (textos no campo `finais` dos dados, copiados na parte 8 do roteiro).
- **Passar pista**: só na pausa, por código de 4 letras, grátis, até 3 por pessoa por pausa (sem servidor).
- **Recurso de quem joga**: "energia". Carga é só o ponteiro da máquina.
- Sem Firebase novo: tudo roda em cada aparelho. Dossiê compartilhado em tempo real exigiria regra nova do Firestore.

Simulação: rodada 1 (10 grupos, 0 conserto) → versão 2 → rodada 2 (12 grupos: 9 Desligar/Ouro, 3 Parcial) → ... → rodada 16 (20 grupos: 16 Ouro). Ver `docs/simulacao/`.

## Novidades de 24/11/2026
- **Detalhes que distraem**: 10 pistas novas (café, quadro torto, gato no quadro de energia, balde com multímetro, lâmpadas queimadas, relógio de pulso parado, rádio chiando, bilhete do eletricista, cola fresca, foto da festa). As que parecem sinal são "falsa honesta": não contam no anexar.
- **Quebra-cabeça**: o cofre do Braga (Central de monitoramento) pede 3 números tirados da descrição da máquina do Subsolo (3 mostradores, 1 luz da peça, 1 botão). Abre mais uma fonte da prova do trajeto.
- **Armadilha do pêndulo** (Sala dos relógios): puxar a corda adianta 40 s no relógio de TODO mundo. Há uma plaquinha de aviso ao lado do pêndulo, com a letra do Seu Dirceu. Cada aparelho aplica uma vez; o aviso viaja pelos campos `alarmeVolta/alarmeSeg/alarmeId` do próprio jogador na sala do Mestre (regra nova em `firebase-loop/firestore.rules`: precisa publicar as regras para valer em todos os aparelhos; sem isso vale só para quem puxou).

## Ajuste 19:40 — mais pistas (Regra das Três Pistas)
- 170 → 201 pistas. Cada sinal e cada leitura normal do diagnóstico ganhou uma segunda fonte em outra sala (sinais diegéticos: quadro de consumo, lâmpada, visor, metrônomo, medidor, armário de fusíveis).
- Caso contra o suspeito com 3 pontas: motivo, meio e oportunidade do Lenz; álibis e pistas falsas com retorno para Ivone e Braga; diário do Téo em três dias (dia da troca, 2 e 4 dias antes); 6 detalhes de clima do museu.
- Teto do validador subiu de 125 para 160 pistas ativas; validar.py APROVADO nas 5 causas.

## União Loop + Reserva (24/11)
- Base: Loop (5 causas, Mestre). A Reserva ("A peça que o museu esqueceu") fica como episódio e seus minigames viram a BANCADA do Loop.
- Bancada (`bancada.css`, `LC_MG` em loop-central.js): ao coletar a foto antiga do catálogo, a peça principal (luz rasante), a fita da câmera do corredor de serviço, a caixa de banners e a escala de crachás, abre o minigame; acertar entrega a pista. Errar não gasta energia; há "Pedir uma pista".
- Ritmo: `abre_1` (cartão do Téo na Recepção, objetivo claro na volta 1, custo 0); `rev_3` (hoje é a ata da reunião com "então apaga?", o engano do Lenz); ensaio da volta 4 diz o que ainda pode falhar na execução final (por causa).
- Um jogo só: o Loop é a base. Minigames da Reserva entram como bancada em 5 pistas e em 2 atividades em dupla (Lado a Lado, As Duas Listas). Cooperação Pátio/Corredor já existia no Loop (Apagão Combinado).
- Desfecho mostra quais das 3 provas a equipe reuniu. A Reserva fica na entrada como "Episódio visual", sem competir com o Loop.

## Missão secreta e pista de metades (24/11)
- **Missão secreta** (5): o que o Braga esconde; o que derrubou o Téo; quem ganha se a peça sumir; por que a Ivone não pode ter trocado; o que o Aurélio sabia. Cada pessoa recebe uma (card no dossiê). Cumprir rende +1 de energia na volta seguinte.
- **Pista de metades** (`assim_foto` no Pátio, `assim_leg` no Corredor): cada sala vê uma metade; quem já viu uma não vê a outra, então as duas pessoas precisam descrever em voz alta. Solo continua completável pelas outras pistas do grupo trajeto.

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

**Escada de revelações**
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

## Checklist por volta (preenchido em 25/11/2026)

Conferido em `dados/pistas-v4.json` (campos `volta_min`, `volta_max`, `segundo_min`, `precisaDe`, `soNaCausa`, `grupos_fonte`, `atividades_coop`). Horários com `valores_padrao` (raio em 1:10); com outra hora sorteada, os horários ligados ao raio andam junto. Pistas por `volta_min`: 194 na volta 1, 25 na volta 2, 1 na volta 4, 4 na volta 5. Ativas por noite: 175 (A), 175 (B), 174 (C), 177 (D), 177 (E).

**Horários fixos de toda volta**

| Minuto | O que acontece | Pistas que dependem do horário |
|---|---|---|
| 1:04 a 1:20 | Janela do Raio | Conserto O Raio e eco |
| 1:00 a 1:20 | Apagão Combinado bloqueada | — |
| 1:10 | Raio no para-raios, apagão | Para-raios no Pátio (1:10); armário da luva isolante destrava na Oficina técnica (1:10) |
| 1:11 | — | Relógios parados (Sala dos relógios), gravador do rádio (Sala dos sons), pegadas brilhando sem dupla (Corredor) |
| 1:13 | Gerador entra | Relógio da Recepção, fita de papel do gerador (Oficina elétrica) |
| 1:15 | — | Câmera do pátio e câmera 4 (Central) |
| 1:20 | — | Foto da câmera antiga (Sala da fotografia) |
| 2:40 | Alarme | — |
| 3:58 | Homem de paletó no corredor de serviço | Fala dele e "mostrar o bilhete" (Corredor) |
| 4:00 | Crachá do Braga abre a porta de serviço | Câmera do corredor de serviço (Central) |
| 4:05 | — | Seu Dirceu aponta com o rodo (Base da limpeza) |
| 4:10 | Lenz desce e liga a Câmara | "Cinco minutos de volta" e fala na escada (Subsolo) |
| 5:00 | Reinício | — |

**Fontes por fato essencial**

| Fato | Fontes (sala) | Desde | Condição |
|---|---|---|---|
| **Hora do apagão** | Sala dos relógios; Recepção; Sala da fotografia; Sala dos sons; Oficina elétrica (5 fontes) | volta 1 | Só depois do apagão (1:11 a 1:20, conforme a sala) |
| **Dia da troca** | Recibo do restauro (Ateliê); ficha de movimentação (Sala das coleções); diário do acervo (Sala de conservação) | volta 1 | Nenhuma |
| **Número de registro** | Livro de registro (Sala de conservação); foto antiga do catálogo (Sala da fotografia); etiqueta da caixa vazia (Sala das coleções) | volta 1 | Nenhuma |
| **Prova da cópia** | Cheiro de verniz (Galeria) | volta 1 | Nenhuma |
| | Comparar a foto sem dupla (Galeria) | volta 1 | Ter a foto grande do catálogo; 2 de energia |
| | Laudo do Aurélio (Sala de conservação); molde de gesso (Sala das coleções) | volta 2 | Ter sentido o cheiro de verniz |
| | Lado a Lado (Galeria + Sala da fotografia) | volta 2 | Dupla; foto grande do catálogo |
| **Trajeto** | Marca de sola na porta de serviço (Corredor); foto sem legenda (Pátio) ou legenda sem foto (Corredor); cofre do Braga (Central, senha 311) | volta 1 | Nenhuma (o cofre pede a senha) |
| | Câmera do corredor de serviço (Central, 4:00); Seu Dirceu (Base da limpeza, 4:05); escada do Subsolo (4:10) | volta 1 | Só perto das 4:00 |
| | Conferir as listas sem dupla (Central) | volta 1 | Registro da roleta da saída + livro de visitas; 2 de energia |
| | Pegadas sem dupla (Corredor, 1:11) | volta 1 | Respingos de tinta já anotados; 2 de energia |
| | As Duas Listas (Recepção + Central); Apagão Combinado (Pátio + Corredor) | volta 2 | Dupla |
| **Crachá (o nome)** | Braga admite (Central) | ver nota | Escala + bilhete + uma prova da cópia (laudo, Lado a Lado, foto comparada sem dupla ou a peça verdadeira na mão) |
| | Mostrar o bilhete ao homem de paletó (Corredor, 3:58) | ver nota | Bilhete do armário + livro de visitas |
| | Acusação e Defesa (Central + Base da limpeza) | volta 2 | Dupla; escala + bilhete |

O bilhete do armário e o livro de visitas, soltos, **não** contam mais como prova do crachá.

### Volta 1
- **Abre:** 194 pistas (todas as salas). Sinais da máquina e leituras normais da noite; manual, páginas 1 a 6; Téo caído, mancha, botão de paletó e prateleira; cheiro de verniz; recibo, ficha e diário do dia da troca; as 3 fontes do registro; raio e hora do apagão; bilhete do crachá sem assinatura; escala; contrato; caixa de "banners"; cartão do Téo na Recepção; cofre do Braga e pêndulo. Nenhuma atividade em dupla. Diagnóstico ainda fechado ("A página de diagnóstico abre na volta 2").
- **Não pode vazar:** o nome do culpado; laudo, molde, páginas anteriores do diário, carta da seguradora, gravação; o pendrive; a ata.
- **Conferência:** laudo, molde, diário anterior, carta, gravação, mancha maior e escultura têm `volta_min` 2: OK. Pendrive pede o laudo: OK (só da volta 2). Ata pede a carta: OK (só da volta 2).
- **PENDÊNCIA (dados):** "Braga admite" e "mostrar o bilhete" têm `volta_min` 1. Pela foto comparada sem dupla ou pela peça verdadeira na mão (as duas de volta 1), "Braga admite" pode sair na volta 1; "mostrar o bilhete" também (bilhete + livro de visitas, 3:58). Isso contraria a linha "não há mais como chegar ao nome na volta 1" de `DECISOES-V4.md`. Correção sugerida nos dados: `volta_min` 2 nas duas pistas (e no livro da Central, que depende da primeira). Não alterado nesta tarefa (só documentação).
- **Horários que importam:** o raio (anotar a hora) e a passagem das 4:00.

### Volta 2
- **Abre:** +25 pistas: laudo do Aurélio, molde de gesso, páginas anteriores do diário (2), carta da seguradora, gravação no rádio, mancha maior, escultura que mudou de pose, objetos no chão (luva isolante no Pátio, peça verdadeira no Subsolo), produtos das atividades. **Anexar o diagnóstico** (1 tentativa por volta). Todas as atividades em dupla (`volta_min` 2): Lado a Lado, As Duas Listas, Apagão Combinado, Painel e Manual, Correio do Loop, Acusação e Defesa; ensaio do conserto para quem já anexou. Pendrive do Nico (registro + laudo) e voz do Téo. Nome do culpado pelos 3 caminhos.
- **Não pode vazar:** conserto valendo (só na volta 5); eco do Raio (só da volta 3); meio conserto da noite E (só da volta 3); Revelar (só na volta 5).
- **Conferência:** ensaios têm `volta_min` 2 e `volta_max` 4; consertos finais têm `volta_min` 5: OK. Eco: `volta_min_gravar` 3: OK. Noite E: `E_volta_min_meio` 3: OK.
- **Horários que importam:** luva isolante só sai do armário depois do apagão (1:10); Apagão Combinado fora de 1:00 a 1:20.

### Volta 3
- **Abre:** nenhuma pista nova por número de volta; abrem as falas que dependem do caderno (Braga, Ivone, Aurélio, Lenz na escada, ata, guardanapo, bilhete atrás do quadro de avisos). Eco do Raio (gravar no Pátio dentro da janela). Noite E: primeiro conserto pode ficar gravado na Câmara.
- **Não pode vazar:** conserto valendo; Revelar; os dois consertos da noite E na mesma volta.
- **Conferência:** dica dirigida do Mestre para quem joga sem dupla começa aqui (`compensacao_solo`): OK.
- **Horários que importam:** janela do Raio (1:04 a 1:20) para o eco; 3:58 para mostrar o bilhete.

### Volta 4
- **Abre:** +1 pista (o painel depois do ensaio, no Subsolo). Comando da Central de monitoramento (0 de energia): mostra onde cada pessoa está, o que falta para o conserto e quem tem as 3 provas. Ensaio geral: a máquina responde REAGE / NÃO REAGE, diz qual valor está errado e o que ainda pode falhar.
- **Não pode vazar:** conserto valendo; Revelar.
- **Conferência:** última volta dos ensaios (`volta_max` 4): OK. Noite E: se o primeiro conserto não foi gravado até aqui, não há mais como chegar ao Desligar.
- **Horários que importam:** janela do Raio; quem vai apresentar precisa das 3 provas no próprio caderno até a pausa (passar pista: até 3).

### Volta 5
- **Abre:** +4 pistas (os consertos finais A, B, C, D). Conserto valendo. **Revelar**: na Recepção, antes de 5:00, uma tentativa por grupo, com 1 prova da cópia + 1 do trajeto + 1 do crachá no caderno de quem apresenta. Papéis: Mão A, Mão B, Central, Porta-voz, Guardião do dossiê.
- **Não pode vazar:** nada mais a segurar. Não há ensaio nesta volta.
- **Conferência:** finais no campo `finais`: Desligar (causa certa, diagnóstico anexado, conserto na volta 5), Revelar (3 provas, Recepção, até 300 s), Ouro (os dois na volta 5), Parcial, Mínimo: OK.
- **Horários que importam:** janela do Raio (noites B e E); 5:00 é o limite do Revelar.

### Outras pendências encontradas na conferência (dados, não alteradas)
- `regras.janela_segundos` ainda descreve a janela antiga do Raio, mais curta; a atividade, os finais e o código usam 64–80 s.
- `regras.trocar` ainda diz 1 pista por pausa custando 1; o código e `DECISOES-V4.md` usam grátis, até 3.
- `trancas` (pergunta "De quem era a mão no crachá?") ainda cita como chave o bilhete do armário, o livro de visitas e a gravação do Téo, que não contam mais como prova do crachá.
- `regras.diagnostico_anexado` diz Painel e Manual "da volta 3 em diante"; a atividade tem `volta_min` 2.
- `regras.relogio` fixa a hora em 1 min 10 s, mas a hora agora é sorteada.
- Restos de texto antigo visíveis: a ficha de ensaio `b_verde_2` ainda usa a palavra antiga para ajuste; em `formato_turma`, os nomes antigos de duas atividades. A mensagem `porque` de "Abrir a caixa" fala em "dicas da limpeza", mas as dicas da caixa ficam na Sala das coleções, na Recepção e na Central.
- `versao` = "v4 (25/11/2026)", mas `noite` = "exemplo_v3".
