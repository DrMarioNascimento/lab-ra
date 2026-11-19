# Cinco Minutos para o Fim

Bancada do LAB-RA com cinco voltas, 15 variações de um mistério, pistas temporizadas, caderno, orientações e tela de revelação. A sessão individual e o histórico de variações ficam no navegador. A intervenção final é avaliada como hipótese.

A [maquete](museu/) apresenta 11 ambientes e sete peças do ThreeMuseum adaptadas sob licença MIT. A visualização em 3D e RA abre separadamente do jogo. O mapa de investigação tem seis ambientes próprios e controla as pistas.

## Modo cooperativo

Uma sala comporta de dois a seis participantes. O anfitrião convida por código ou link, abre as cinco voltas e envia a conclusão discutida pela equipe. Cada pessoa escolhe um ambiente e mantém seu próprio caderno neste navegador, inclusive após recarregar. O relógio usa o instante de início registrado no Firestore. No ensaio, o anfitrião pode encerrar uma volta antecipadamente. As salas deixam de aceitar acessos após quatro horas. O conteúdo das 15 variações está no cliente, adequado para a bancada cooperativa experimental.

## Firebase

Use um projeto dedicado ao jogo. Registre um app Web, habilite o provedor de autenticação **Anônimo**, crie o Firestore e implante as regras do diretório `firebase` com `npx -y firebase-tools@latest deploy --only firestore:rules --project ID_DO_PROJETO`. Grave a configuração pública do SDK em `firebase/web-config.json` com os campos descritos em `firebase/web-config.example.json`. A página mantém a partida individual disponível se o serviço de salas estiver desativado.

Para teste local, execute `npx -y firebase-tools@latest emulators:start --project demo-cinco-minutos` no diretório `firebase`. Sirva o repositório por HTTP e adicione uma configuração de teste em `web-config.json` com `projectId: "demo-cinco-minutos"`, valores de exemplo em `apiKey` e `appId`, e `emulator: true`. Os emuladores só são usados em `localhost` ou `127.0.0.1`.

O GDD está em [GDD.md](GDD.md).
