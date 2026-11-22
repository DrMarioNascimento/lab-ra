# Museu vivo — tabela de rodízio (documento de projeto, não público)

## O que a planta permite
A maquete 3D é só o prédio em 3 andares (sem coordenadas de sala). No jogo, a posição de uma sala hoje é **andar + ordem na lista**. Por isso nada na planta impede o rodízio. Falta criar o conceito de **lugar**: cada andar tem lugares numerados, e cada partida distribui as exposições entre eles.

- **Lugares por andar** (a capacidade atual): 2º andar = 9, 1º andar = 10, Térreo = 11. Saguão superior fica fixo (todos começam nele).
- **Exposição** = a unidade que viaja: nome, subtítulo, ícone e peça 3D. A peça combina com o nome, então **nome e peça andam juntos**.
- **Lugar** = andar + número. É o que muda de uma partida para outra e é o que o jogador vê ("Térreo · lugar 4").
- **Pontuação do "Onde":** metade dos pontos por estar no mesmo andar continua valendo, usando o andar da partida.

## Regras do sorteio (uma semente por partida; em sala, o Mestre sorteia e todos veem o mesmo museu)
1. **Grupo A, funções do Térreo** (recepção, sala dos espécimes = conservação, sala dos habitats = segurança): trocam de lugar **entre si**, dentro dos 3 lugares delas. São 6 arranjos. A função vai junto com o conteúdo: quem era a conservação continua sendo a conservação, só em outro lugar.
2. **Grupo B, funções de apoio** (auditório, galeria especial, ateliê, área de descanso): trocam entre si nos 4 lugares delas, **podendo mudar de andar**. São 24 arranjos. *(Proposta; o autor decide se entra.)*
3. **Grupo C, exposições** (as 23 restantes): ocupam os lugares restantes em qualquer andar.
4. **Nome:** cada exposição tem 3 nomes (A, B, C) coerentes com a peça. Um é sorteado por partida. O nome nunca muda dentro da partida.
5. **Sem pistas no nome:** nenhum nome usa palavras da solução (reserva, retorno, suspensão, referência, ensaio de repetição, cartão, pulso, loop, alarme).
6. **Dentro da partida o mapa não muda** entre as voltas.
7. **Equivalência:** as salas-chave do caso (onde o fato aconteceu, equipamento, fonte) nunca caem todas no mesmo andar.

## Tabela
Tipo: **F** = função (Grupo A), **S** = apoio (Grupo B), **E** = exposição (Grupo C). Andar = onde está hoje.

| id | Peça | Tipo | Andar hoje | Nome A (atual) | Nome B | Nome C |
|---|---|---|---|---|---|---|
| gigantes | D01 | E | 2º | Sala dos gigantes | Salão dos colossos | Galeria do pescoço longo |
| predadores | D02 | E | 2º | Sala dos predadores | Salão das garras | Ala dos caçadores |
| veiculos | N14 | E | 2º | Sala dos veículos | Garagem do passado | Sala das rodas |
| porcelana | N01 | E | 2º | Sala da porcelana | Salão da louça fina | Sala das xícaras |
| jogos | N15 | E | 2º | Sala dos jogos | Salão dos tabuleiros | Sala do passatempo |
| cranios | N13 | E | 2º | Sala dos crânios | Galeria dos ancestrais | Sala dos rostos antigos |
| mobilia | N02 | E | 2º | Sala da mobília | Salão das cadeiras | Sala da casa antiga |
| galeria | F01 | S | 2º | Galeria especial | Galeria das vitrines | Sala das obras |
| auditorio | C01 | S | 2º | Auditório | Sala dos bastidores | Palco pequeno |
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
| seguranca | B07 | F | Térreo | Sala dos habitats | Gabinete dos habitats | Sala dos ambientes |
| atelie | L01 | S | Térreo | Ateliê de descobertas | Oficina de ensaios | Sala dos testes |
| corredor | L02 | S | Térreo | Área de descanso | Canto de descanso | Varanda da equipe |
| sons | N07 | E | Térreo | Sala dos sons | Sala do rádio | Galeria da música |
| cotidiano | N08 | E | Térreo | Sala do cotidiano | Sala das coisas de casa | Galeria do dia a dia |
| ambar | N11 | E | Térreo | Sala do âmbar | Sala do tempo preso | Galeria da resina |
| patio | B05 | E | Térreo | Pátio de luz | Pátio da claridade | Jardim de luz |
| brinquedos | N09 | E | Térreo | Sala dos brinquedos | Sala das brincadeiras | Galeria dos carrinhos |
| lanternas | N10 | E | Térreo | Sala das lanternas | Sala das luzes de mão | Galeria das lanternas |

## Variedade
- Grupo A: 6 arranjos. Grupo B: 24 arranjos. Grupo C: mais de 10²⁰ arranjos. Nomes: 3³⁰ combinações. Na prática, nenhuma partida repete a outra.
- O rodízio sozinho **não conta** como conteúdo novo para as escalas: ele protege contra decorar lugar. O que sustenta o longo prazo continua sendo versões de caso e caderno do museu.

## O que isto pede do motor
- `state.museu` (semente, lugares, nomes) sorteado em `reset()` e guardado na partida; na sala do Mestre, a semente vai no documento da sala.
- Todas as telas e textos devem ler nome, andar e lugar por uma função (`sala(id)`), nunca de `ROOMS` direto. Isso inclui pistas, resposta do "Onde" e lista do telão.
- A resposta de "Onde" compara ids; o rótulo mostrado usa o nome da partida.
- `sala/conteudo.js` é gerado de `game.js`: regenerar depois da mudança.
