# Museu vivo — tabela de rodízio (documento de projeto, não público)

## O que a planta permite
A maquete 3D (página `museu/`) mostra o prédio em 3 andares e já tem **posições marcadas** por andar (coordenadas x e z de cada sala, repetidas nos três andares). No jogo, a sala hoje só guarda o andar. Nada impede o rodízio, mas a página da maquete hoje usa nomes fixos: para acompanhar uma partida, ela precisa receber o sorteio (ou mostrar só números de lugar).

- **Lugares por andar** (capacidade atual do jogo): 2º andar = 9, 1º andar = 10, Térreo = 11. Saguão superior fica fixo (todos começam nele).
- **Exposição** = a unidade que viaja: nome, subtítulo, ícone e peça 3D. A peça combina com o nome, então **nome e peça andam juntos**.
- **Lugar** = andar + número. É o que muda de uma partida para outra e é o que o jogador vê ("Térreo · lugar 4").
- **Pontuação do "Onde":** metade dos pontos por estar no mesmo andar continua valendo, usando o andar da partida.

## Regras do sorteio (uma semente por partida; em sala, o Mestre sorteia e todos veem o mesmo museu)
1. **Grupo A, funções perto da entrada** (5): recepção, segurança, conservação, **limpeza** e **manutenção**. Trocam de lugar **entre si**, nos 5 lugares da entrada (Térreo). São 120 arranjos. A função vai junto com o conteúdo: quem era a conservação continua sendo a conservação, só em outro lugar. Motivo: quem entra espera achar recepção e segurança perto da porta, e o apoio da equipe fica junto.
2. **Grupo B, todo o resto** (25): exposições, auditório, galeria especial, ateliê e área de descanso. Ocupam os 25 lugares restantes (9 no 2º andar, 10 no 1º, 6 no Térreo), **em qualquer andar e em qualquer posição**. Um auditório de 40 m² pode estar no 2º andar numa partida, no Térreo na outra, à frente ou ao fundo.
3. *(regra extra)* As funções do Grupo A **nunca** saem do Térreo.
4. **Nome:** cada exposição tem 3 nomes (A, B, C) coerentes com a peça. Um é sorteado por partida. O nome nunca muda dentro da partida.
5. **Sem pistas no nome:** nenhum nome usa palavras da solução (reserva, retorno, suspensão, referência, ensaio de repetição, cartão, pulso, loop, alarme).
6. **Dentro da partida o mapa não muda** entre as voltas.
7. **Equivalência:** as salas-chave do caso (onde o fato aconteceu, equipamento, fonte) nunca caem todas no mesmo andar.

## Tabela
Tipo: **F** = função perto da entrada (Grupo A), **E** = livre (Grupo B). Andar = onde está hoje.

| id | Peça | Tipo | Andar hoje | Nome A (atual) | Nome B | Nome C |
|---|---|---|---|---|---|---|
| gigantes | D01 | E | 2º | Sala dos gigantes | Salão dos colossos | Galeria do pescoço longo |
| predadores | D02 | E | 2º | Sala dos predadores | Salão das garras | Ala dos caçadores |
| veiculos | N14 | E | 2º | Sala dos veículos | Garagem do passado | Sala das rodas |
| porcelana | N01 | E | 2º | Sala da porcelana | Salão da louça fina | Sala das xícaras |
| jogos | N15 | E | 2º | Sala dos jogos | Salão dos tabuleiros | Sala do passatempo |
| cranios | N13 | E | 2º | Sala dos crânios | Galeria dos ancestrais | Sala dos rostos antigos |
| mobilia | N02 | E | 2º | Sala da mobília | Salão das cadeiras | Sala da casa antiga |
| galeria | F01 | E | 2º | Galeria especial | Galeria das vitrines | Sala das obras |
| auditorio | C01 | E | 2º | Auditório | Sala dos bastidores | Palco pequeno |
| asas | D08 | E | 1º | Mezanino das asas | Mezanino do voo | Terraço das asas |
| fosseis | F02 | E | 1º | Sala dos fósseis | Galeria da rocha | Sala das marcas |
| relogios | N03 | E | 1º | Sala dos relógios | Sala das horas | Galeria dos ponteiros |
| protecoes | N04 | E | 1º | Sala das proteções | Sala dos capacetes | Galeria da armadura |
| fotografia | N05 | E | 1º | Sala da fotografia | Sala das câmeras | Galeria das imagens |
| prototipo | D09 | E | 1º | Galeria do tempo | Sala das invenções | Galeria das demonstrações |
| eletrica | B09 | E | 1º | Laboratório de formas | Laboratório de energia | Oficina das formas |
| deposito | B02 | E | 1º | Sala das coleções | Sala do inventário | Galeria das caixas |
| vidros | N06 | E | 1º | Sala dos vidros | Sala da transparência | Galeria do brilho |
| mar | N12 | E | 1º | Sala do mar | Aquário antigo | Sala das águas |
| recepcao | B01 | F | Térreo | Recepção | Entrada de convidados | Balcão de chegada |
| conservacao | B04 | F | Térreo | Sala dos espécimes | Gabinete dos espécimes | Sala do acervo |
| seguranca | S01 | F | Térreo | Central de monitoramento | Sala dos monitores | Posto de controle |
| atelie | L01 | E | Térreo | Ateliê de descobertas | Oficina de ensaios | Sala dos testes |
| corredor | L02 | E | Térreo | Área de descanso | Canto de descanso | Varanda da equipe |
| sons | N07 | E | Térreo | Sala dos sons | Sala do rádio | Galeria da música |
| limpeza | L03 | F | Térreo | Base da limpeza | Depósito de limpeza | Sala dos carrinhos |
| ambar | N11 | E | Térreo | Sala do âmbar | Sala do tempo preso | Galeria da resina |
| patio | B05 | E | Térreo | Pátio de luz | Pátio da claridade | Jardim de luz |
| brinquedos | N09 | E | Térreo | Sala dos brinquedos | Sala das brincadeiras | Galeria dos carrinhos |
| manutencao | M01 | F | Térreo | Oficina técnica | Bancada de reparos | Sala dos reparos |

## Duas funções novas (decisão do autor, 22/11/2026)
- **Limpeza:** limpeza geral (chão, pó, rotina de fechamento). Já existe como pessoa recorrente da história; ganha sala própria.
- **Manutenção:** equipamentos e estrutura (troca de lâmpada, fio partido, ferramentas, sensor). Não é o mesmo que a **conservação**, que cuida das peças e do acervo (restauração, registros).
- **Peças 3D (feito em 22/11/2026):** modelos do Meshy enviados pelo autor, comprimidos e ligados ao jogo: Limpeza = L03 (esfregão com balde), Manutenção = M01 (caixa de ferramentas antiga), Segurança = S01 (central de monitoramento). A Sala do cotidiano (N08) e a Sala das lanternas (N10) saíram do jogo; a peça B07 (habitats) também ficou sem uso.
- **Enredo:** a Manutenção pode virar a **5ª perspectiva** (vê fios, lâmpadas, sensor, equipamento), que combina muito com as noites de falha de sensor e teste de alarme.

## Variedade
- Grupo A: 120 arranjos. Grupo B: mais de 10²⁵ arranjos. Nomes: 3³⁰ combinações. Na prática, nenhuma partida repete a outra.
- O rodízio sozinho **não conta** como conteúdo novo para as escalas: ele protege contra decorar lugar. O que sustenta o longo prazo continua sendo versões de caso e caderno do museu.

## O que isto pede do motor
- `state.museu` (semente, lugares, nomes) sorteado em `reset()` e guardado na partida; na sala do Mestre, a semente vai no documento da sala.
- Todas as telas e textos devem ler nome, andar e lugar por uma função (`sala(id)`), nunca de `ROOMS` direto. Isso inclui pistas, resposta do "Onde" e lista do telão.
- A resposta de "Onde" compara ids; o rótulo mostrado usa o nome da partida.
- `sala/conteudo.js` é gerado de `game.js`: regenerar depois da mudança.
