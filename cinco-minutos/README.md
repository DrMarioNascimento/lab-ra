# Loop

Bancada do LAB-RA com cinco voltas, 15 variações de um mistério, pistas temporizadas, caderno, orientações e tela de revelação. A sessão individual e o histórico de variações ficam no navegador. No modo individual, cada uma das 15 variações usa uma de quatro cadeias de retorno: emissão programada, alimentação de reserva, comando da produção ou cartão de referência. A quinta volta dá uma única tentativa de intervir: é preciso deduzir o equipamento (pelo código nos procedimentos e pelos diretórios), o comando e o horário. O desfecho depende do comando executado a tempo. A pontuação é independente da intervenção. Partidas salvas preservam as regras com que foram iniciadas.

O ritmo completo percorre cinco voltas de cinco minutos (25 minutos de relógio), além das escolhas, pausas e conclusão. O ensaio reduz cada volta a 30 segundos e aceita encerramento antecipado. Na conclusão individual, o arquivo permite consultar até dois trechos incompletos. O formulário tem 8 perguntas (O quê, Onde, Quando, Como, Por quê, Quem, Previsão, Intervenção), 100 pontos no total, com meio ponto de proximidade em Onde e Quando, grau de certeza em cada pergunta (Palpite 60%, Provável 80%, Tenho certeza 100%, e errar com certeza tira 30%) e, em Quem e Por quê, a pista do dossiê que sustenta a resposta (sem ela, vale como palpite); o rascunho e os trechos consultados persistem após recarregar.

A [maquete](museu/) apresenta 31 ambientes e sete peças do ThreeMuseum adaptadas sob licença MIT; as salas do jogo usam peças variadas (história natural, objetos, fotografia, jogos, transporte), com créditos em museu/CREDITOS.txt. A visualização em 3D e RA abre separadamente do jogo. Todo mundo começa no Saguão superior (2º andar) e escolhe uma das 30 salas, cada uma com uma peça 3D onde as pistas ficam escondidas. O mapa jogável tem 31 ambientes em três andares (térreo, 1º e 2º), os mesmos espaços da maquete, onde cada andar repete a planta. Onze deles guardam as peças da história e os outros 20 trazem pistas de rotina e ecos verdadeiros do caso, para criar dúvida sobre onde investigar.

O painel de sinais do Saguão superior libera uma planta esquemática dos três andares. Na partida individual, acionar o painel inicia o relógio. Em sala, o painel fica disponível após o início da volta. Rever os sinais ou mudar de ideia consome o tempo já decorrido. A planta fica disponível no dossiê pelo restante da partida.

## Modo cooperativo

O modo cooperativo mantém a intervenção como hipótese.

Uma sala comporta de dois a seis participantes. O anfitrião convida por código ou link, abre as cinco voltas e envia a conclusão discutida pela equipe. Cada pessoa escolhe um ambiente e mantém seu próprio caderno neste navegador, inclusive após recarregar. O relógio usa o instante de início registrado no Firestore. No ensaio, o anfitrião pode encerrar uma volta antecipadamente. As salas deixam de aceitar acessos após quatro horas. O conteúdo das 15 variações está no cliente, adequado para a bancada cooperativa experimental.

## Firebase

Use um projeto dedicado ao jogo. Registre um app Web, habilite o provedor de autenticação **Anônimo**, crie o Firestore e implante as regras do diretório `firebase` com `npx -y firebase-tools@latest deploy --only firestore:rules --project ID_DO_PROJETO`. Grave a configuração pública do SDK em `firebase/web-config.json` com os campos descritos em `firebase/web-config.example.json`. A página mantém a partida individual disponível se o serviço de salas estiver desativado.

Para teste local, execute `npx -y firebase-tools@latest emulators:start --project demo-cinco-minutos` no diretório `firebase`. Sirva o repositório por HTTP e adicione uma configuração de teste em `web-config.json` com `projectId: "demo-cinco-minutos"`, valores de exemplo em `apiKey` e `appId`, e `emulator: true`. Os emuladores só são usados em `localhost` ou `127.0.0.1`.

O GDD está em [GDD.md](GDD.md).
