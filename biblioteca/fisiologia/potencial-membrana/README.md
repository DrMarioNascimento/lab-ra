# A película de carga · Fisiologia celular

Experiência independente em [Fisiologia Interativa](https://drmarionascimento.github.io/fisiologia-interativa/ra/potencial-membrana/), transferida da versão aprovada do Lab RA, revisão `303bad15b77d7c995fdc90f20fa0e2b9eaa0902f`. O arquivo `modelos.js` é integralmente idêntico à origem: dendritos, mielina, núcleos de Schwann, organelas, membranas, proteínas e ausência dos instrumentos e das bases preservados.

Seis níveis: Neurônio, Comunicação, Interior, Película, Travessias e A onda. A anatomia, a iluminação, as transições de mergulho, o enquadramento e os cálculos permanecem os aprovados. A apresentação segue os outros simuladores RA: assinatura, card celular nos dois percursos, retorno ao Tutor, botões com profundidade, ampliação e início/pausa/velocidade do giro. O giro afeta somente a visualização.

Goldman, Nernst, contagem de cargas por capacitância e propagação foram preservados. Nos níveis 01 e 03 a 05, o painel usa Goldman com concentrações e permeabilidades. A contagem usa uma célula esférica equivalente e não inclui a área dendrítica. A onda representa um axônio amielínico de 6 mm a 2 m/s, com curva didática por trechos independente de Goldman, sem simular Hodgkin–Huxley. O neurônio do nível 01 é um exemplo periférico mielinizado distinto.

Organelas, proteínas, membrana e cargas são representações didáticas com escalas próprias. A translucidez da mielina é um recurso de leitura. A RA exporta o estado estático selecionado; a câmera depende de dispositivo compatível. Não exige credencial Google e não carrega arquivos do Lab RA. Three.js e model-viewer conservam os CDNs e versões fixados nas outras experiências.

O catálogo compartilhado dos quatro acessos ao Tutor, com e sem IA, inclui o roteiro e três questões específicas. Modelos e texturas procedurais originais são cobertos pela [licença do projeto](../../LICENSE.md); as bibliotecas mantêm suas licenças.

## Comunicação (nível 02, 09/10/2026)

- Novo nível entre o Neurônio e o Interior; os demais passaram um número adiante (Interior 03, Película 04, Travessias 05, A onda 06). Links antigos com `?nivel=` apontam agora para o nível de mesmo número na tela.
- O modelo `impulso-nervoso.glb`, fornecido pelo professor, mostra três neurônios mielinizados em cadeia e duas sinapses, com a animação do sinal (7,9 s). Entra pela `GLTFLoader`, escalado ×8 e centrado na origem; `modelos.js` não foi alterado.
- O painel tem Disparar, Pausar/Seguir, posição do sinal e velocidade. O texto de cada trecho segue os quadros-chave do arquivo: potenciais graduados em dendritos e corpo, potencial de ação no cone de implantação e no axônio (saltos entre nódulos de Ranvier sob a mielina) e transmissão química na sinapse. A esfera e o tempo são didáticos; na sinapse o sinal elétrico não atravessa a fenda.
- `?nivel=2&t=3.2` abre a Comunicação parada naquele ponto da animação.
- Na RA, a Comunicação usa o arquivo original: o Android toca a animação; o iPhone recebe a peça parada.
- "Aprofundar" a partir da Comunicação mergulha no corpo do neurônio central.
- Placa **Disparar** no iPhone (09/10/2026): na Comunicação, o botão de RA abre a peça com uma placa no chão. Tocar nela leva a esfera do sinal pelos 23 quadros-chave do arquivo, com os mesmos tempos e as pausas nas sinapses, em série (`../ra-botoes-ios.js`). Só a esfera se move. Arquivo de cerca de 3,5 MB. No Android, a RA continua tocando a animação do próprio GLB. `?botoesios` liga a placa fora do iPhone.

- Mitocôndrias novas no Interior (09/10/2026): as três de `modelos.js` são trocadas, em `app.js`, pela mitocôndria compartilhada (`../mitocondria.js`): a de cima continua aberta, com membranas externa e interna, espaço intermembranas, cristas contínuas com a membrana interna (junções estreitas), ATP sintase, cadeia respiratória, DNA mitocondrial e ribossomos; as outras duas ficam fechadas. Mesmos lugares, tamanhos e giros de `modelos.js`, que não foi alterado. Até o GLB chegar, aparecem as antigas.
