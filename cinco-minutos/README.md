> **Aviso (25/11/2026).** A camada central do jogo (Câmara do tempo, 5 causas, Lenz, dossiê, atividades em dupla) segue `docs/ROTEIRO-LOOP.md` e `docs/LOOP-CENTRAL.md`.
> O restante deste arquivo descreve a camada antiga das 15 noites, mantida como ambiente.

# Loop

Bancada do LAB-RA com cinco voltas, 15 variações de um mistério, pistas temporizadas, caderno, orientações e tela de revelação. A sessão individual e o histórico de variações ficam no navegador. No modo individual, cada uma das 15 variações usa uma de quatro cadeias de retorno: emissão programada, alimentação de reserva, comando da produção ou cartão de referência. A quinta volta dá uma única tentativa de intervir: é preciso deduzir o equipamento (pelo código nos procedimentos e pelos diretórios), o comando e o horário. O desfecho depende do comando executado a tempo. A pontuação é independente da intervenção. Partidas salvas preservam as regras com que foram iniciadas.

O ritmo completo percorre cinco voltas de cinco minutos (25 minutos de relógio), além das escolhas, pausas e conclusão. O ensaio reduz cada volta a 30 segundos e aceita encerramento antecipado. Na conclusão individual, o arquivo permite consultar até dois trechos incompletos. O formulário tem 8 perguntas (O quê, Onde, Quando, Como, Por quê, Quem, Previsão, Intervenção), 100 pontos no total, com meio ponto de proximidade em Onde e Quando, grau de certeza em cada pergunta (Palpite 60%, Provável 80%, Tenho certeza 100%, e errar com certeza tira 30%) e, em Quem e Por quê, a pista do dossiê que sustenta a resposta (sem ela, vale como palpite); o rascunho e os trechos consultados persistem após recarregar.

A [maquete](museu/) apresenta 31 ambientes e sete peças do ThreeMuseum adaptadas sob licença MIT; as salas do jogo usam peças variadas (história natural, objetos, fotografia, jogos, transporte), com créditos em museu/CREDITOS.txt. A visualização em 3D e RA abre separadamente do jogo. Todo mundo começa no Saguão superior (2º andar) e escolhe uma das 30 salas, cada uma com uma peça 3D onde as pistas ficam escondidas. O mapa jogável tem 31 ambientes em três andares (térreo, 1º e 2º), os mesmos espaços da maquete, onde cada andar repete a planta. Onze deles guardam as peças da história e os outros 20 trazem pistas de rotina e ecos verdadeiros do caso, para criar dúvida sobre onde investigar.

## Modo cooperativo

O modo cooperativo mantém a intervenção como hipótese.

Uma sala comporta de dois a seis participantes. O anfitrião convida por código ou link, abre as cinco voltas e envia a conclusão discutida pela equipe. Cada pessoa escolhe um ambiente e mantém seu próprio caderno neste navegador, inclusive após recarregar. O relógio usa o instante de início registrado no Firestore. No ensaio, o anfitrião pode encerrar uma volta antecipadamente. As salas deixam de aceitar acessos após quatro horas. O conteúdo das 15 variações está no cliente, adequado para a bancada cooperativa experimental.

## Firebase

Use um projeto dedicado ao jogo. Registre um app Web, habilite o provedor de autenticação **Anônimo**, crie o Firestore e implante as regras do diretório `firebase` com `npx -y firebase-tools@latest deploy --only firestore:rules --project ID_DO_PROJETO`. Grave a configuração pública do SDK em `firebase/web-config.json` com os campos descritos em `firebase/web-config.example.json`. A página mantém a partida individual disponível se o serviço de salas estiver desativado.

Para teste local, execute `npx -y firebase-tools@latest emulators:start --project demo-cinco-minutos` no diretório `firebase`. Sirva o repositório por HTTP e adicione uma configuração de teste em `web-config.json` com `projectId: "demo-cinco-minutos"`, valores de exemplo em `apiKey` e `appId`, e `emulator: true`. Os emuladores só são usados em `localhost` ou `127.0.0.1`.

O GDD está em [GDD.md](GDD.md).

## Atualização de 22/11/2026
- **Rodadas e prólogo:** cada partida tem 5 voltas de 5 minutos; o manual abre com o Prólogo, uma visita normal que ensina as telas.
- **Códigos sorteados:** os códigos dos equipamentos mudam a cada partida.
- **Ecos:** salas sem peça-chave dão pistas verdadeiras sobre fatos diferentes, para todo fato ter mais de um caminho.
- **Museu vivo:** lugares e nomes das salas mudam a cada partida (semente única; na sala, o Mestre sorteia e jogadores e telão veem o mesmo museu). Detalhes em `docs/RODIZIO.md`.
- **Intervenção:** uma tentativa por volta, em qualquer volta; agir cedo dá bônus.
- **Caderno do museu:** lembra, no aparelho, as noites já visitadas.
- Documentos de projeto (não públicos): `docs/ENREDO.md`, `docs/RODIZIO.md`, `docs/AVALIACAO-ESCALAS.md`, `docs/FICHAS.md`.

## Atualização de 22/11/2026 (noites, energia, caixote)
- **Roteiro:** `docs/ROTEIRO.md`, `docs/ENREDO-MATRIZ.md`. As 15 noites estão em `noites.js`; o motor está em `noites-motor.js`.
- **Jogo:** preparação com 2 ferramentas, energia da lanterna por volta, pistas por horário, combinações entre voltas, caixote com bilhete de T. e teoria final em 3 partes. (Camada antiga: no Loop de hoje não há ferramentas, lanterna nem caixote. Ver docs/LOOP-CENTRAL.md, revisão 4.)
- **Maquete:** `museu/` agora mostra a peça 3D de cada sala (`museu/pecas-na-maquete.mjs`).
- **Peças:** 35 modelos novos como versões B e C das salas (`museu/pecas/V*.glb`).
