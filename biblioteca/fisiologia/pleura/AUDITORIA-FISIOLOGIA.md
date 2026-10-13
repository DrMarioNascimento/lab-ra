# Pleura: revisão de cálculos e limites do modelo

Revisão de 2 de outubro de 2026. Escopo: motores `pleura/fisica.js` e `pleura/estados.js`, sua integração com os cinco níveis, leituras, gráfico e controles. As outras bancadas receberam somente a retirada da porta de acesso.

| Item | Verificação e resultado |
| --- | --- |
| Unidades | 98,0665 Pa/cmH₂O e 133,3224 Pa/mmHg; uma constante compartilhada entre cálculo e apresentação. As pressões vasculares são comparadas à alveolar somente após conversão para mmHg. |
| Gravidade | 30·sen(θ) cm ao longo do eixo ápice–base. A inclinação não aumenta essa projeção. Em decúbito, a diferença entre os pontos desse eixo zera; o gradiente dorso–ventral continua descrito no painel, sem ser simulado por esses mesmos pontos. |
| Pleural em repouso | −10 cmH₂O no ápice e −2,5 na base são âncoras didáticas, com média geométrica −6,25; não são valores universais nem medidas esofágicas previstas. |
| Transpulmonar | P_L = P_alveolar − P_pleural em cada instante, com a variação do ciclo aplicada uma única vez. |
| Ciclo | No repouso, referência de 4 s (15/min); estados rápidos possuem frequência própria, com inspiração de 40% e expiração de 60%. A pressão alveolar tem sinal negativo na inspiração, positivo na expiração e zero exato nos extremos. A forma prescrita representa um ciclo espontâneo, sem cálculo de trabalho muscular ou resistência clínica. |
| Coerência pressão/volume | A parcela resistiva alveolar também participa da pleural. Corrigida a redução inicial de volume causada pela soma anterior de duas curvas independentes. Teste de todo o ciclo: volume aumenta em toda a inspiração e diminui em toda a expiração, em posturas e cenários. |
| Complacência regional | V_rel=1−exp(−0,10·P_L), limitado a zero para P_L≤0. A curva vale como aproximação didática da faixa de expansão; não representa recrutamento, histerese ou doença. A complacência diminui nessa faixa. |
| Volume e ventilação | No repouso em pé: base≈22%, ápice≈63% da escala relativa; ao fim da inspiração: base≈42%, ápice≈73%. O ganho basal é maior. Percentuais relativos não são saturação nem capacidade pulmonar clínica medida. |
| Escala visual | Unidades alveolares ampliadas e contraste de tamanho não linear para leitura. Volume global: curva exponencial calibrada em CRF=40% a P_L=6,25 cmH₂O e CPT=100% a P_L=30 cmH₂O, com escala de 6 L. Macroexpansão usa raiz cúbica do ganho de volume; costelas e diafragma usam a fase de expansão, não o sinal do fluxo. Peças e valores são esquemáticos. |
| Zonas de West | Zona 1: P_alv≥P_a; zona 2: P_a>P_alv≥P_v; zona 3: P_a>P_v>P_alv. Zonas classificam relações de pressão, não lobos anatômicos. Não é simulado o mecanismo adicional da zona 4. |
| Perfusão | Proxy proporcional a P_a−máx(P_v,P_alv), limitado a zero. Cor categórica e tamanho em referência fixa entre cenários; não são vazão em mL/min. Sem resistência vascular variável, não pretende reproduzir quantitativamente a curva de perfusão real inteira. |
| Cenários | Hemorragia reduz pressão vascular e pode produzir zona 1; elevação alveolar também pode produzir zona 1. Exercício aumenta perfusão; retirada a afirmação incorreta de zona 3 obrigatória em todo o pulmão, que não resultava das pressões escolhidas. O cenário elevado é uma comparação de pressão alveolar, não um ventilador mecânico completo. |
| Pneumotórax | Pleural afetada: zero no aberto e +12 cmH₂O no hipertensivo, constante neste cenário. Perda de expansão é à direita; pulmão contralateral conserva o ciclo. Pressões e volumes escolhidos representam situações ilustrativas, não qualquer grau de pneumotórax clínico. |
| Retorno venoso | Índice empírico, monotônico e limitado, compatível com a tendência da pressão intratorácica. Painel mostra estimativa, normalizada a 100% na referência de repouso. Não calcula débito cardíaco, pressão atrial direita ou pressão média de enchimento sistêmico; percentuais não são previsões clínicas. |
| Gráfico | Perfis regionais em painéis com escalas separadas e fixas: ventilação em pontos percentuais de volume regional por inspiração; perfusão em índice de 0 a 16. Não calcula V/Q. Na outra vista, volume (L) e fluxo (L/s) usam o mesmo eixo temporal; fluxo é a derivada do volume global. A CVF mostra volume expirado por tempo e marca o primeiro segundo. |
| Isolamento das abas | Pneumotórax atua em Camadas/Pneumotórax; cenário vascular atua em West. Ao visitar outra aba, o estado guardado deixa de contaminar seus cálculos. |
| Reprodução | Velocidade de 0,25× a 2× altera apenas a passagem visual do tempo respiratório e cardíaco; as frequências de referência do estado não mudam. Pausa congela a fase; Próxima fase avança entre quatro marcos; sem execução contínua o ciclo termina no fim da expiração. CVF é sempre única, termina em fase 1 no volume residual e só reinicia por comando. |

## Estados rápidos e coração

Parâmetros ilustrativos do adulto virtual; não são graus GOLD, valores previstos individuais ou protocolos de diagnóstico. O repouso conserva os valores regionais anteriores. O volume global é outra curva, representando o pulmão inteiro; não é a soma de sete unidades acinares ampliadas.

| Estado | Respiração / coração | Mecânica do exemplo |
| --- | --- | --- |
| Repouso | 15/min / 75 bpm | P_L central de repouso 6,25 cmH₂O; amplitude elástica 3 cmH₂O. |
| Exercício | 30/min / 120 bpm | Amplitude 5 cmH₂O; pressão vascular no hilo 25/9 mmHg. |
| Enfisema | 12/min / 90 bpm | Coeficiente de complacência 0,16 versus 0,10; P_L central basal 5 cmH₂O; constante de tempo 2,4 s. |
| Fibrose | 24/min / 90 bpm | Coeficiente de complacência 0,045; amplitude elástica 4 cmH₂O, excursão visual reduzida à metade, volumes menores e ausência de retenção obstrutiva. |
| CVF | Manobra 8 s / 75 bpm | Inspiração máxima até 6 L em 2 s; expiração forçada até 1,2 L em 6 s. CVF=4,80 L; VEF₁≈4,02 L; VEF₁/CVF≈83,8%. Exemplo sem obstrução; Enfisema e Fibrose são exemplos de ciclos espontâneos, não espirometrias. |

No Enfisema, q=exp(−T_exp/τ) e pressão elástica retida=A·q/(1−q): regime periódico de um compartimento com incremento inspiratório A e esvaziamento exponencial. A progressão temporal é suavizada, preservando q nos extremos. Aumentar a frequência encurta T_exp e eleva a retenção; o volume global deriva da mesma pressão elástica. Não resolve heterogeneidade, compressão dinâmica de vias aéreas ou adaptação transitória de vários ciclos. A resistência prescrita gera a pressão alveolar a partir do fluxo; não representa a resistência clínica medida de cada indivíduo.

Na Fibrose, a curva pressão-volume tem menor complacência: sob a mesma pressão transpulmonar, resulta em menor volume. A pressão inspiratória prescrita é maior, mas seu ganho de volume e excursão visual são menores; a frequência é aumentada. Não há constante de tempo obstrutiva nem aprisionamento. Os coeficientes ilustram tendências, sem prever valores de um paciente.

Na CVF, volume expirado=CVF·[1−exp(−t/0,55)]/[1−exp(−6/0,55)]. Fluxo é sua derivada com sinal expiratório negativo; há esforço expiratório positivo. Os 6 segundos são a duração escolhida deste exemplo, não um requisito universal de aceitabilidade ATS/ERS. A curva prescrita não modela limitação de fluxo por compressão dinâmica.

O coração conserva o scan externo do protótipo. Um relógio próprio usa a duração sistólica de `ra/fisica-cardiaca.js`; a contração visual encurta e comprime suavemente a região ventricular, mantendo base e grandes vasos ancorados. Não estima débito cardíaco nem movimentos valvares. Iniciar, Pausar, Reiniciar, velocidade e restauração controlam ambos os relógios. A exportação em RA continua uma fotografia do estado, sem prometer batimento em RA.

Costelas e cartilagens usam o mesmo campo contínuo de deformação. As inserções de 1–7 seguem o esterno; 8–10 seguem o arco costal. A transição atravessa suavemente a junção entre tecidos, preservando as articulações posteriores e as pontas livres de 11–12.

## Referências

- [ATS/ERS, Standardization of Spirometry 2019 Update](https://pmc.ncbi.nlm.nih.gov/articles/PMC6794117/): definição de CVF e VEF₁, sequência e aceitabilidade da manobra.
- [Lung Parenchymal Mechanics](https://pmc.ncbi.nlm.nih.gov/articles/PMC3929318/): perda de recuo elástico no enfisema e aumento de rigidez na fibrose.
- [GOLD 2026](https://goldcopd.org/wp-content/uploads/2026/01/GOLD-REPORT-2026-v1.3-8Dec2025_WMV2.pdf): obstrução das pequenas vias aéreas, perda de recuo elástico e hiperinsuflação estática/dinâmica.
- [O’Donnell et al., Dynamic hyperinflation and exercise intolerance in COPD](https://pubmed.ncbi.nlm.nih.gov/11549531/): investigação de hiperinsuflação durante exercício.

- [NIST SP 811, unidades convencionais de pressão](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9).
- [Teaching alveolar ventilation with simple, inexpensive models, Advances in Physiology Education](https://journals.physiology.org/doi/full/10.1152/advan.90156.2008): complacência e ventilação regionais.
- [Pleural Mechanics and Fluid Exchange, Physiological Reviews](https://journals.physiology.org/doi/10.1152/physrev.00026.2003): gradientes, postura e acoplamento pleural.
- [Lung Perfusion Measured Using MRI, Journal of Magnetic Resonance Imaging](https://pmc.ncbi.nlm.nih.gov/articles/PMC3359842/): modelo de zonas e limites da descrição gravitacional.
- [Clinical review: Respiratory mechanics in spontaneous and assisted ventilation](https://pmc.ncbi.nlm.nih.gov/articles/PMC1297597/): interação entre pressões, volume e mecânica.

Os testes verificam coerência matemática, sinais, tendências e regressões de interface. Essa validação é de um modelo didático simplificado; não equivale a calibração clínica individual.
