# Viagem ao osso vivo

Experiência procedural original e independente de outros repositórios. Cinco ampliações: fêmur desmontável; compacto e esponjoso; ósteon vascularizado com corte e lacuna ampliada; osteoclasto em corte com escavação/transcitose; osteoblastos em corte, secreção e colágeno/hidroxiapatita ampliados. A matriz sob as células é o tecido estudado, sem pedestal de apresentação. Three.js 0.180.0 e model-viewer 4.0.0 vêm do CDN; apresentação, geometria e cálculos estão neste repositório.

## Reprodução e escalas

Iniciar/Pausar, Reiniciar, Recentrar, Ampliar, Repetir em loop, Rótulos, Velocidade e Progresso do ciclo. Separar estruturas controla a desmontagem (0–100%) somente no nível O osso, sem modificar os cálculos. Partes reunidas mantêm esponjoso dentro da cortical; o desmonte afasta cada peça sem sobreposição. Focar detalhe aproxima a estrutura destacada; Recentrar devolve o conjunto. O detalhe da matriz só fica disponível após haver osteoide. Mostrar carga exibe setas e deformação ampliada nos níveis 1–3. Em As trabéculas e O osteócito, o segmento aberto e o ósteon têm seu eixo longitudinal na vertical: carga e reação atuam nas extremidades, e o encurtamento acompanha o mesmo eixo. A base de apoio fica fixa; somente a anatomia encurta, enquanto as setas acompanham as superfícies. A carga periódica alivia até zero e o encurtamento visual é diretamente proporcional a ela, chegando a 12% no cenário Exercício. O valor instantâneo aparece na cena e não é uma deformação fisiológica medida. A câmera oblíqua permite ver a cortical e a rede interna. Isso não resolve os esforços locais de cada trabécula. Um único relógio atualiza cena, fase, leituras e cursor. A velocidade altera somente a apresentação. Um ciclo dura 40 segundos a 1×, sem conversão para dias; o loop reapresenta o estado inicial sem acumular matriz. A remodelação real se desenvolve em semanas a meses. A movimentação rápida do fluido e a renovação lenta são ampliações didáticas em escalas distintas.

Trocar nível mantém o progresso e o cenário. Trocar cenário mantém o progresso e a reprodução, permitindo comparar a cena no mesmo instante. Carga habitual, Exercício e Imobilização usam condições fixadas, não uma dose de treino. O percurso EF abre o destaque Osteoarticular; Fisioterapia utiliza Sistema muscular, preservando suas cinco unidades. Os dois Tutores nativos e os dois acessos Moodle compartilham roteiro, três questões e contexto para a IA opcional.

## Cálculo demonstrativo

Uma região inicia com matriz mineralizada = 1. As curvas cumulativas usam smoothstep e frações da apresentação. Reabsorção ocupa 8–30% do ciclo; deposição ocupa 40–85%. Cada parcela depositada começa a mineralizar após uma defasagem de 3% do ciclo, com transição de 12%. Esses intervalos são escolhas de apresentação, sem estimativa de velocidade biológica. A integração determinística usa 100 parcelas da deposição no ciclo acoplado. Nos níveis celulares, cada uma das três regiões ocupa um terço do tempo, com ação entre 6–75% dos dois primeiros intervalos locais e deslocamento entre 78–100%; a última região continua o trabalho até o fim da apresentação. São escolhas de apresentação: não calendário, área ou velocidade biológica. A formação isolada integra 40 parcelas por região, mineralizando depois da deposição; parte do osteoide mais recente pode ainda estar em maturação ao terminar a apresentação. Nesses dois estudos o total mineral final é, respectivamente, 1 − retirada ou 1 + parte nova mineralizada; não deve ser confundido com o balanço acoplado.

- Habitual: retirada final = 0,18; deposição final = 0,18.
- Exercício: retirada = 0,18; deposição = 0,18 × 1,12.
- Imobilização: retirada = 0,18 × 1,12; deposição = 0,18 × 0,65.
- Osteoide ainda não mineralizado = depositada − mineralizada.
- Matriz orgânica e mineral total = 1 − retirada + depositada.
- Matriz mineralizada total = 1 − retirada + mineralizada.

Coeficientes escolhidos para separar tendências, não extraídos de resultados clínicos. Não se calculam densitometria, risco de fratura, idade, hormônios, nutrição, doenças, fármacos, deformação, resistência ou dose de exercício. Esclerostina é uma tendência qualitativa, sem concentração calculada. A geometria não é uma reconstrução tomográfica. Carga relativa (habitual 1; exercício 1,55; imobilização 0,18) é um sinal escolhido; setas e encurtamento até 6% em O osso e até 12% em As trabéculas e O osteócito são ampliações visuais sem solução mecânica real ou força em newtons. A profundidade da escavação e o preenchimento seguem as curvas, com fator visual ampliado; não são o volume exato da malha.

## Anatomia e transporte

O canal de Havers abriga vasos; canais de Volkmann conectam a vascularização transversalmente. Lamelas, lacunas e canalículos expõem a relação entre matriz, células e espaço pericelular. O detalhe do osteócito usa outra ampliação; sangue não percorre seus processos. A rede esponjosa inclui lâminas perfuradas e hastes irregulares, sem ósteons completos típicos da cortical.

O osteoclasto apresenta corte de membrana, múltiplos núcleos, organelas, zona de selamento e borda pregueada. A superfície é acidificada; produtos degradados, não blocos intactos, entram em vesículas, atravessam a célula e saem no interstício antes da troca vascular. As vesículas são visíveis somente na parte intracelular da rota. Na formação, aminoácidos vindos do vaso abastecem síntese e secreção de colágeno, enquanto cálcio e fosfato chegam à matriz extracelular para mineralização posterior. Os níveis celulares isolam ações: não há osteoclasto na cena de osteoblastos, nem osteoblastos na cena de reabsorção. Cada ação percorre três regiões sucessivas durante os 40 segundos, com deslocamento suave entre regiões. Superfície, transporte, fase, leituras e gráficos usam `estadoNivel`; reabsorção mantém deposição zero, formação mantém retirada zero. A superfície inicial da formação já tem concavidades, cuja preparação não é encenada. O osteócito ampliado está incorporado ao corte do ósteon, em tom mais escuro.

Fibrilas entrelaçadas, bandamento ilustrativo e placas minerais dentro/entre fibrilas são ampliados no detalhe da matriz; não representam proporções moleculares reais. A deformação e o fluxo canalicular são periódicos; o transporte nos níveis celulares acompanha os períodos de trabalho em cada região, com uma pausa breve para o deslocamento. As três parcelas da reabsorção ou deposição somam os mesmos totais demonstrativos finais. A mineralização continua depois da deposição em cada região, sem precedê-la. Cena, material removido/reposto e cursor derivam de um relógio, preservando pausa e repetição.

## RA

Pause e selecione uma das cinco peças. O arquivo GLB preserva a geometria do estado escolhido, sem rótulos, controles ou referências de animação nos extras. A peça é normalizada para aproximadamente 65 cm. A prévia espacial estática funciona no navegador; ativar a câmera requer aparelho compatível e permissão. A animação permanece na página.

## Referências conceituais

- [NIAMS — biologia óssea, remodelação e mecanotransdução](https://www.niams.nih.gov/grants-funding/supported-scientific-areas/bone-biology-metabolic-bone-disorders-and-osteoporosis).
- [NIAMS — Skeletal Mechanobiology Laboratory](https://www.niams.nih.gov/skeletal-mechanobiology-laboratory).
- [Tu et al. — esclerostina, Wnt e resposta à carga](https://pmc.ncbi.nlm.nih.gov/articles/PMC3246572/).
- [NIAMS — exercício e saúde óssea](https://www.niams.nih.gov/health-topics/exercise-your-bone-health).
- [Salo et al. — Removal of osteoclast bone resorption products by transcytosis](https://pubmed.ncbi.nlm.nih.gov/9092479/).
- [Network architecture strongly influences the fluid flow pattern through the lacunocanalicular network in human osteons](https://pmc.ncbi.nlm.nih.gov/articles/PMC7203595/).
- [Intermolecular channels direct crystal orientation in mineralized collagen](https://pmc.ncbi.nlm.nih.gov/articles/PMC7545172/).

As fontes fundamentam mecanismos e tendências, não validam os coeficientes demonstrativos. Nenhum modelo ou textura foi copiado dessas fontes. Os modelos originais são abrangidos pela licença do repositório; bibliotecas conservam suas próprias licenças.

## Placas Montar e Desmontar no iPhone (09/10/2026)

- No nível 01 (O osso), no iPhone, o botão de RA abre a peça com duas placas no chão: **Montar** e **Desmontar**. Tocar numa placa desliza as camadas (periósteo, cortical, osso esponjoso, medula e cartilagem) entre a posição montada e a separada, em 1,2 s.
- As duas poses saem de `anatomy.atualizar` com separação 0 e 1, a mesma função da tela; carga, cenário e instante ficam como estão na tela. O empacotamento é o de `../ra-botoes-ios.js`, a mesma técnica do sarcômero.
- Tamanho: a peça montada e a desmontada cabem em cerca de 80 cm. Neste modo a pinça fica desligada, para a peça não cobrir as placas.
- Arquivo: cerca de 34 MB, porque a geometria do fêmur é detalhada. Ainda assim fica menor que o USDZ que o iPhone recebia pela RA comum (cerca de 52 MB), graças às 4 casas decimais e à união de geometrias repetidas no módulo. A preparação leva alguns segundos; o botão espera.
- Se as placas falharem, o botão abre a peça comum. Fora do iPhone, `?botoesios` liga as placas para conferência; `pacotePlacasIOS()` no console mostra tamanho e tempo.
