# Do músculo ao sarcômero · Sistema muscular

Experiência independente em `Fisiologia Interativa`, acessível pelo destaque RA do Sistema Muscular nos Tutores de Educação Física e Fisioterapia. “Voltar ao Tutor” preserva o percurso de origem. Não exige Google nem carrega recursos do Lab RA.

Origem: `DrMarioNascimento/lab-ra/musculo-sarcomero`, revisão aprovada `6792eb577870bb72933b845791743bc872bcbad2`. O arquivo `modelos.js` foi transferido sem alterações: ventre contínuo, janela no epimísio, fascículos, tendões e os cinco níveis mantêm a versão aprovada. Não há base em nenhum nível.

## Controles

- Músculo → Fascículo → Fibra → Miofibrila → Sarcômero: níveis e escalas distintas.
- Iniciar giro/Pausar giro e Velocidade do giro: rotação da peça, sem efeito nos cálculos. A página abre com o giro pausado.
- Rótulos, Restaurar vista e Ampliar: exploração da cena.
- Na Miofibrila e no Sarcômero, Comprimento do sarcômero, Contrair e Relaxar conservam o mecanismo original. O mesmo valor vale para os dois níveis. Restaurar parâmetros retorna a 2,4 µm e ao giro pausado, com velocidade 1×.
- Abrir em realidade aumentada exporta o nível e o comprimento selecionados como uma peça estática. A ativação da câmera depende de dispositivo compatível.

## Miofibrila contrátil (revisão de 05/10/2026)

- O controle de comprimento passou a valer também no nível 04. Os três sarcômeros internos usam a mesma função aprovada (`aplicarComprimento`); `modelos.js` não foi alterado. Os sarcômeros, os discos Z, os anéis e as tampas se reposicionam com o comprimento escolhido.
- A capa pintada encurta como tecido, por trechos: a banda A conserva 1,6 µm; a banda I e a zona H encolhem pela mesma regra do sarcômero; o disco Z mantém a largura. A capa tem anéis de vértices somente nas bordas das bandas.
- Dois acertos de montagem, feitos em `app.js`: os sarcômeros internos eram ampliados também no comprimento (discos Z internos a ±1,61 em vez dos anéis a ±1,2, sobreposição entre vizinhos e discos vazando nas pontas); agora a ampliação é só na espessura. As pontas da capa repetiam três sarcômeros nos próprios 2,3 de comprimento; agora a pintura segue a posição do fundo, e cada sarcômero pintado coincide com o vão entre dois anéis.
- Na RA, miofibrila e sarcômero usam a escala do repouso (2,4 µm): a peça contraída chega mais curta, na proporção correta (a 1,9 µm, 0,48 m na miofibrila e 0,72 m no sarcômero, contra 0,60 m e 0,90 m em repouso). Antes, cada instante era ajustado ao mesmo tamanho final, e o contraído parecia igual ao relaxado.
- Testes: `../tests/musculo-miofibrila.test.mjs` confere a ligação do controle, a regra de encurtamento (banda A fixa, zona H, discos Z, sem dobras) e a escala de RA.

## Limites didáticos e referência

A banda A mantém 1,6 µm; banda I e zona H variam com o comprimento, conforme a implementação aprovada. A curva de tensão ativa relativa é uma aproximação por trechos da relação isométrica em fibras musculares de rã de [Gordon, Huxley e Julian (1966)](https://pubmed.ncbi.nlm.nih.gov/5921536/). Não é força absoluta, tensão passiva, curva força–velocidade nem uma medida clínica individual. As contas e o sarcômero não foram modificados na transferência.

Modelos e texturas são procedurais, criados no código do projeto. Não foi acrescentado um modelo anatômico de terceiros. A autoria e a licença principal permanecem em [LICENSE.md](../../LICENSE.md); Three.js e model-viewer conservam suas licenças próprias.

## RA com botões no iPhone (revisão de 05/10/2026; botão único em 09/10/2026)

- No nível 05, no iPhone, o próprio botão "Abrir em realidade aumentada" abre a peça com as placas Contrair e Relaxar. O segundo botão de teste saiu em 09/10/2026. Nos outros níveis e no Android, o botão abre a peça de sempre.
- A peça abre no comprimento escolhido no controle. À frente dela, no chão, há duas placas: Relaxar (2,4 µm) e Contrair (1,9 µm). Tocar numa placa desliza os discos Z, com as actinas, e estica ou encurta a titina até aquele comprimento, em 1,2 s.
- As poses de cada estado saem de `aplicarComprimento`, a mesma função da tela. O módulo `../ra-botoes-ios.js` só as empacota: escreve o USDZ com o exportador do three e acrescenta os comportamentos da Apple (`Preliminary_Behavior`: toque na placa → ações `Transform` até alvos com a pose de cada estado), refazendo o arquivo com os dados alinhados a 64 bytes.
- Testado no iPhone do professor: os toques nas placas movem a peça. Depois de ampliar com a pinça, a peça passava a cobrir as placas e os toques paravam de funcionar; por isso, neste modo, a escala fica travada (tamanho real, sem pinça) e as placas são maiores (16 × 6,5 cm) e ficam 10 cm à frente da peça. Nos outros níveis a RA continua com a pinça.
- Conferido na biblioteca USD da Pixar: 2 comportamentos, 102 relações, nenhuma quebrada; cena de 0,90 m apoiada no chão. A abertura no Quick Look precisa ser confirmada num iPhone.
- Para conferir no computador: `?botoesios` faz o botão abrir a versão com placas também fora do iPhone; `pacoteBotoesIOS()` no console devolve tamanho, tempo e alinhamento.
- Correção de 09/10/2026: no iPhone, tocar em Contrair ou Relaxar separava as peças em vez de deslizar os filamentos. Os alvos de cada estado ficavam ao lado de cada parte, com a pose local (discos Z a ±1,2, sem a escala de 0,37 da peça), e o Quick Look os lia na escala da cena: os discos iam para longe, maiores, e as titinas para o centro. Agora os alvos ficam no topo da cena, com a pose já multiplicada pelos pais. Conferido no USDA gerado: em repouso cada alvo coincide com a parte; na contração os discos Z vão de ±0,442 m a ±0,350 m (proporção 1,9/2,4) e as titinas encurtam presas à banda A. Falta confirmar no iPhone.
- Exportações mais leves e rápidas: o clone para a RA deixou de copiar os dados internos das peças (`userData`), que eram convertidos em imagem a cada exportação (cerca de 3,6 s) e iam para o arquivo sem uso. Nível 05: 5,9 → 4,1 MB; nível 04: 1,6 → 1,1 MB.

## Mitocôndrias novas na Fibra (09/10/2026)

- As 84 mitocôndrias entre as miofibrilas eram cápsulas lisas fundidas numa malha só em `modelos.js` (aprovado, intocado). Em `app.js` a malha é desfeita cápsula por cápsula (todas têm o mesmo número de vértices); a caixa de cada uma dá o lugar e o comprimento da mitocôndria compartilhada fechada (`../mitocondria.js`) que entra no lugar, deitada no eixo da fibra. Se a estrutura não for a esperada, ou o GLB não chegar, ficam as antigas.
