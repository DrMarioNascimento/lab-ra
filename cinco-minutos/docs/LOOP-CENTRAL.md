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
