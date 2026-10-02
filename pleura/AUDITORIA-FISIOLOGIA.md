# Pleura: revisão de cálculos e limites do modelo

Revisão de 2 de outubro de 2026. Escopo: motor `pleura/fisica.js`, sua integração com os cinco níveis, leituras, gráfico e controles. As outras bancadas receberam somente a retirada da porta de acesso.

| Item | Verificação e resultado |
| --- | --- |
| Unidades | 98,0665 Pa/cmH₂O e 133,3224 Pa/mmHg; uma constante compartilhada entre cálculo e apresentação. As pressões vasculares são comparadas à alveolar somente após conversão para mmHg. |
| Gravidade | 30·sen(θ) cm ao longo do eixo ápice–base. A inclinação não aumenta essa projeção. Em decúbito, a diferença entre os pontos desse eixo zera; o gradiente dorso–ventral continua descrito no painel, sem ser simulado por esses mesmos pontos. |
| Pleural em repouso | −10 cmH₂O no ápice e −2,5 na base são âncoras didáticas, com média geométrica −6,25; não são valores universais nem medidas esofágicas previstas. |
| Transpulmonar | P_L = P_alveolar − P_pleural em cada instante, com a variação do ciclo aplicada uma única vez. |
| Ciclo | Referência de 4 s (15/min), com inspiração de 40% e expiração de 60%. A pressão alveolar tem sinal negativo na inspiração, positivo na expiração e zero exato nos extremos. A forma prescrita representa um ciclo espontâneo, sem cálculo de trabalho muscular ou resistência clínica. |
| Coerência pressão/volume | A parcela resistiva alveolar também participa da pleural. Corrigida a redução inicial de volume causada pela soma anterior de duas curvas independentes. Teste de todo o ciclo: volume aumenta em toda a inspiração e diminui em toda a expiração, em posturas e cenários. |
| Complacência regional | V_rel=1−exp(−0,10·P_L), limitado a zero para P_L≤0. A curva vale como aproximação didática da faixa de expansão; não representa recrutamento, histerese ou doença. A complacência diminui nessa faixa. |
| Volume e ventilação | No repouso em pé: base≈22%, ápice≈63% da escala relativa; ao fim da inspiração: base≈42%, ápice≈73%. O ganho basal é maior. Percentuais relativos não são saturação nem capacidade pulmonar clínica medida. |
| Escala visual | Unidades alveolares ampliadas e contraste de tamanho não linear para leitura. Macroexpansão usa raiz cúbica do ganho de volume; costelas e diafragma usam a fase de expansão, não o sinal do fluxo. Peças e valores são esquemáticos. |
| Zonas de West | Zona 1: P_alv≥P_a; zona 2: P_a>P_alv≥P_v; zona 3: P_a>P_v>P_alv. Zonas classificam relações de pressão, não lobos anatômicos. Não é simulado o mecanismo adicional da zona 4. |
| Perfusão | Proxy proporcional a P_a−máx(P_v,P_alv), limitado a zero. Cor categórica e tamanho em referência fixa entre cenários; não são vazão em mL/min. Sem resistência vascular variável, não pretende reproduzir quantitativamente a curva de perfusão real inteira. |
| Cenários | Hemorragia reduz pressão vascular e pode produzir zona 1; elevação alveolar também pode produzir zona 1. Exercício aumenta perfusão; retirada a afirmação incorreta de zona 3 obrigatória em todo o pulmão, que não resultava das pressões escolhidas. O cenário elevado é uma comparação de pressão alveolar, não um ventilador mecânico completo. |
| Pneumotórax | Pleural afetada: zero no aberto e +12 cmH₂O no hipertensivo, constante neste cenário. Perda de expansão é à direita; pulmão contralateral conserva o ciclo. Pressões e volumes escolhidos representam situações ilustrativas, não qualquer grau de pneumotórax clínico. |
| Retorno venoso | Índice empírico, monotônico e limitado, compatível com a tendência da pressão intratorácica. Painel mostra estimativa, normalizada a 100% na referência de repouso. Não calcula débito cardíaco, pressão atrial direita ou pressão média de enchimento sistêmico; percentuais não são previsões clínicas. |
| Gráfico | Ventilação relativa por ciclo e perfusão no estado atual, ambas normalizadas separadamente e identificadas dessa forma. Não apresenta V/Q quantitativo. |
| Isolamento das abas | Pneumotórax atua em Camadas/Pneumotórax; cenário vascular atua em West. Ao visitar outra aba, o estado guardado deixa de contaminar seus cálculos. |
| Reprodução | Velocidade de 0,25× a 2× altera apenas a passagem visual do tempo. Pausa congela a fase; Próxima fase avança entre quatro marcos; sem execução contínua o ciclo termina no fim da expiração. |

## Referências

- [NIST SP 811, unidades convencionais de pressão](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9).
- [Teaching alveolar ventilation with simple, inexpensive models, Advances in Physiology Education](https://journals.physiology.org/doi/full/10.1152/advan.90156.2008): complacência e ventilação regionais.
- [Pleural Mechanics and Fluid Exchange, Physiological Reviews](https://journals.physiology.org/doi/10.1152/physrev.00026.2003): gradientes, postura e acoplamento pleural.
- [Lung Perfusion Measured Using MRI, Journal of Magnetic Resonance Imaging](https://pmc.ncbi.nlm.nih.gov/articles/PMC3359842/): modelo de zonas e limites da descrição gravitacional.
- [Clinical review: Respiratory mechanics in spontaneous and assisted ventilation](https://pmc.ncbi.nlm.nih.gov/articles/PMC1297597/): interação entre pressões, volume e mecânica.

Os testes verificam coerência matemática, sinais, tendências e regressões de interface. Essa validação é de um modelo didático simplificado; não equivale a calibração clínica individual.
