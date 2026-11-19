# Cinco Minutos para o Fim

Bancada do LAB-RA com cinco voltas, 15 variações de um mistério, pistas temporizadas, caderno, orientações e tela de revelação. A sessão individual e o histórico de variações ficam no navegador. No modo individual, cada uma das 15 variações usa uma de quatro cadeias de retorno: emissão programada, alimentação de reserva, comando da produção ou cartão de referência. A quinta volta permite intervir no ambiente e no intervalo que as pistas indicam. O desfecho depende do comando executado a tempo. A pontuação é independente da intervenção. Partidas salvas preservam as regras com que foram iniciadas.

O ritmo completo percorre cinco voltas de cinco minutos (25 minutos de relógio), além das escolhas, pausas e conclusão. O ensaio reduz cada volta a 30 segundos e aceita encerramento antecipado. Na conclusão individual, o arquivo permite consultar até dois trechos incompletos. Cada resposta correta vale 25 pontos, e o rascunho e os trechos consultados persistem após recarregar.

A [maquete](museu/) apresenta 11 ambientes e sete peças do ThreeMuseum adaptadas sob licença MIT. A visualização em 3D e RA abre separadamente do jogo. O mapa jogável tem 11 ambientes. A Galeria do tempo, a Sala das coleções, o Auditório, o Pátio de luz e o Ateliê de descobertas correspondem a espaços nomeados na maquete.

## Modo cooperativo

O modo cooperativo mantém a intervenção como hipótese.

Uma sala comporta de dois a seis participantes. O anfitrião convida por código ou link, abre as cinco voltas e envia a conclusão discutida pela equipe. Cada pessoa escolhe um ambiente e mantém seu próprio caderno neste navegador, inclusive após recarregar. O relógio usa o instante de início registrado no Firestore. No ensaio, o anfitrião pode encerrar uma volta antecipadamente. As salas deixam de aceitar acessos após quatro horas. O conteúdo das 15 variações está no cliente, adequado para a bancada cooperativa experimental.

## Firebase

Use um projeto dedicado ao jogo. Registre um app Web, habilite o provedor de autenticação **Anônimo**, crie o Firestore e implante as regras do diretório `firebase` com `npx -y firebase-tools@latest deploy --only firestore:rules --project ID_DO_PROJETO`. Grave a configuração pública do SDK em `firebase/web-config.json` com os campos descritos em `firebase/web-config.example.json`. A página mantém a partida individual disponível se o serviço de salas estiver desativado.

Para teste local, execute `npx -y firebase-tools@latest emulators:start --project demo-cinco-minutos` no diretório `firebase`. Sirva o repositório por HTTP e adicione uma configuração de teste em `web-config.json` com `projectId: "demo-cinco-minutos"`, valores de exemplo em `apiKey` e `appId`, e `emulator: true`. Os emuladores só são usados em `localhost` ou `127.0.0.1`.

O GDD está em [GDD.md](GDD.md).
