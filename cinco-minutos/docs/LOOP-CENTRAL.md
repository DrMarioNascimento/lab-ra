# Loop · A Máquina (camada central)

Arquivos: `loop-central-dados.js` (dados gerados de `docs/simulacao/versao2.md`), `loop-central.js` (regras e telas). Botão **🧭 Máquina** no canto da tela.

- **Defeito por semente** (5 causas): A painel desregulado, B falta de potência, C âncora presa à peça falsa, D fusível tirado de propósito, E dois defeitos juntos (A + B, em voltas diferentes). Roteiro completo em `ROTEIRO-LOOP.md`. As pistas de cada defeito só existem quando ele é o sorteado.
- **Lugares**: máquina e botão "Loop Reset" no **Subsolo · Câmara do tempo**; quadro de energia e para-raios **fora do prédio**, no Pátio; Oficina elétrica com luvas e chavinha.
- **Dossiê**: a partir da volta 2, anexar o diagnóstico com 3 pistas (2 sinais de tipos diferentes + 1 que descarta outra causa), uma tentativa por volta. Também sai pela dupla "Painel e Manual".
- **Atividades**: em dupla (cada pessoa numa sala; palavra da dupla que muda a cada 30 s; no Raio, código da chave + janela de 1:06 a 1:14) ou solo (mais caro: calibrar sozinho = 3 de energia com tudo no próprio caderno; Raio solo = eco gravado numa volta e alavanca em outra).
- **Volta 4 ensaio, volta 5 vale.** Finais: Ouro, Desligar, Revelar, Parcial, Mínimo.
- **Passar pista**: só na pausa, por código de 4 letras, 1 por pausa, custa 1 de energia na volta seguinte (sem servidor).
- Sem Firebase novo: tudo roda em cada aparelho. Dossiê compartilhado em tempo real exigiria regra nova do Firestore.

Simulação: rodada 1 (10 grupos, 0 conserto) → versão 2 → rodada 2 (12 grupos: 9 Desligar/Ouro, 3 Parcial). Ver `docs/simulacao/`.

## Novidades de 24/11/2026
- **Detalhes que distraem**: 10 pistas novas (café, quadro torto, gato no quadro de energia, balde com multímetro, lâmpadas queimadas, relógio de pulso parado, rádio chiando, bilhete do eletricista, cola fresca, foto da festa). As que parecem sinal são "falsa honesta": não contam no anexar.
- **Quebra-cabeça**: o cofre do vigia (Segurança, a partir da volta 2) pede 3 números tirados da descrição da máquina do Subsolo (3 mostradores, 1 luz de âncora, 1 botão). Abre mais uma fonte da prova do trajeto.
- **Armadilha do pêndulo** (sala dos Relógios, a partir da volta 2): puxar a corda adianta 40 s no relógio de TODO mundo. Há um bilhete de aviso na Manutenção. Cada aparelho aplica uma vez; o aviso viaja pelos campos `alarmeVolta/alarmeSeg/alarmeId` do próprio jogador na sala do Mestre (regra nova em `firebase-loop/firestore.rules`: precisa publicar as regras para valer em todos os aparelhos; sem isso vale só para quem puxou).

## Ajuste 19:40 — mais pistas (Regra das Três Pistas)
- 170 → 201 pistas. Cada sinal e cada descarte do diagnóstico ganhou uma segunda fonte em outra sala (sinais diegéticos: quadro de consumo, lâmpada, visor, metrônomo, medidor, armário de fusíveis).
- Caso contra o suspeito com 3 pontas: motivo, meio e oportunidade do Lenz (2+2+2 pistas); álibis e pistas falsas com retorno para Ivone e Braga; diário do Téo em três dias (dias 10, 12 e 14); 6 detalhes de clima do museu.
- Teto do validador subiu de 125 para 160 pistas ativas; validar.py APROVADO nas 5 causas.

## União Loop + Reserva (24/11, 23h)
- Base: Loop (201+ pistas, 5 causas, Mestre). A Reserva ("A peça que o museu esqueceu") fica como episódio e seus minigames viram a BANCADA do Loop.
- Bancada (`bancada.css`, `LC_MG` em loop-central.js): ao coletar tombo_2 (foto), falsa_1 (luz rasante), traj_1 (fita), c_esc_1 (caixa), cracha_1 (escala), abre o minigame; acertar entrega a pista. Errar não gasta carga; há "Pedir uma pista".
- Ritmo: abre_1 (cartão do Téo na Recepção, objetivo claro na volta 1, custo 0); rev_3 (reviravolta da volta 3: o seguro foi pedido antes do dia 14, a troca foi planejada); ensaio da volta 4 agora diz o que ainda pode falhar na execução final (por causa).
- Falta: cooperação Pátio/Corredor na bancada, final reconstruído no telão com as provas, mais minigames (cadeado, painel).

## Vocabulário simples (24/11, 23h30)
Trocadas nos textos do jogo: peça-guia → peça de referência; catraca → roleta de entrada; pedestal → base da peça; berço → apoio; tombo → número da peça; manopla → alavanca; calibrar/calibragem → ajustar/ajuste. Mantidos (palavras comuns): registro, disjuntor, fusível, patrocinador. IDs internos (A_calibrar, C_ancora) não mudam.

## União concluída (24/11, 23h50)
- Um jogo só: o Loop é a base. Minigames da Reserva entram como bancada em 5 pistas e em 2 atividades em dupla (Original e Cópia, Entrou mas não saiu). Cooperação Pátio/Corredor já existia no Loop (Apagão Combinado).
- Desfecho mostra quais das 3 provas a equipe reuniu. A Reserva fica na entrada como "Episódio visual", sem competir com o Loop.
- Pendente: cadeado/painel como minigame; rodada 14 de simulação.
