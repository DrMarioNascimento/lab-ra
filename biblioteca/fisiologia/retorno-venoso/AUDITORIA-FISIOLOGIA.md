# Revisão de PA, PV, postura e sincronização

O modelo demonstra hidrostática, gradiente de pressão em repouso, válvulas e bomba muscular. Não resolve resistências vasculares completas, débito cardíaco, autorregulação, barorreflexo ou curva de retorno venoso de Guyton.

## Referências e unidades

A altura de referência é o átrio direito, a 128 cm do solo em um corpo de 170 cm. A PAM central é 100 mmHg; a pressão atrial direita é 2 mmHg. Em decúbito, os pontos periféricos apresentados têm PA média de 95 mmHg e PV de 5 mmHg. Esses valores são referências ilustrativas, mantidas fixas para isolar gravidade e bomba; não são previsão da resposta clínica ao levantar. A pressão atrial direita real pode diminuir transitoriamente com redistribuição sanguínea e retornar com compensação.

Densidade sanguínea: 1.060 kg/m³; gravidade: 9,80665 m/s²; 133,322387415 Pa/mmHg. A coluna vertical de sangue acrescenta 0,779693 mmHg/cm. Conversão: 1 mmHg = 1,35951 cmH₂O. PA significa pressão arterial **média**, não sistólica/diastólica.

Para uma altura anatômica h em cm, o desnível vertical abaixo do átrio é (128 − h) × sen(inclinação). PA e PV recebem o mesmo componente hidrostático. Um peso periférico suave, de zero no átrio até um a 20 cm de distância longitudinal, interpola a queda arterial de 5 mmHg e o gradiente venoso de 3 mmHg. É uma aproximação espacial didática do gradiente de escoamento; não calcula resistências ou fluxo. No decúbito há gradiente venoso periférico → central, em vez de pressão uniforme.

| Ponto | Altura do solo | PA/PV deitado | PA/PV em pé e parado |
| --- | ---: | ---: | ---: |
| Pescoço: carótida/jugular | 150 cm | 95 / 5 mmHg | 77,85 / jugular colabada |
| Coração: aorta/átrio direito | 128 cm | 100 / 2 mmHg | 100 / 2 mmHg |
| Coxa: femoral | 75 cm | 95 / 5 mmHg | 136,32 / 46,32 mmHg |
| Tornozelo | 12 cm | 95 / 5 mmHg | 185,44 / 95,44 mmHg |

O pescoço não representa pressão intracraniana ou perfusão cerebral. A extrapolação jugular negativa de uma coluna aberta é identificada como colapso; não é mostrada como pressão negativa sustentada nem usada para estimar diferença PA−PV nesse ponto. A pressão transmural e o sistema de drenagem cerebral exigiriam outro modelo.

A referência de altura no átrio direito não é sinônimo do ponto de indiferença hidrostática venoso. A constante histórica `PIH`, no diafragma, permanece somente para conservar a origem geométrica das malhas; não entra nas pressões.

## Relação com o slide e fluxo

O slide enviado usa correções hidrostáticas de +88 e −44 mmHg. Aplicadas às referências periféricas de 95/5 mmHg, resultam em PA/PV de 183/93 abaixo e 51/−39 acima, antes do colapso venoso. Aqui os desníveis vêm do corpo representado: por isso os números diferem ligeiramente. Os cards mostram a distância vertical em relação ao átrio, nas duas posturas e nos ângulos intermediários.

PA e PV sobem juntas abaixo do coração. Nos pontos periféricos pérvios em repouso, sua diferença permanece 90 mmHg ao inclinar. Pressão local alta não significa fluxo proporcionalmente maior: fluxo também depende da resistência e da função cardíaca. A diferença PA−PV regional não é o gradiente de retorno venoso sistêmico de Guyton.

## Bomba, volume e relógio

Válvulas competentes isoladamente não eliminam a pressão hidrostática estática em pé. As três válvulas do nível Válvula abrem na ejeção da caminhada e fecham no relaxamento, ilustrando o bloqueio do refluxo. Em repouso ficam abertas para o fluxo basal. Os valores entre marcos são desníveis hidrostáticos, não perdas nas válvulas; de 12 a 56 cm, a diferença é 34,31 mmHg em pé.

O ciclo muscular dura 1,15 s. A atividade aproxima a pressão média distal de 25 mmHg, com constante de tempo de 2,4 s na ativação e 7 s no reenchimento. São aproximações didáticas, não picos intramusculares ou um valor universal de normalidade. O efeito é pleno até o joelho e diminui suavemente até zero na coxa; não se atribui à caminhada queda da pressão média femoral. PA mantém a referência ilustrativa para aquela postura.

Cores venosas, distensão, leituras e volume usam o mesmo campo de pressão. A lei de complacência visual foi recalibrada para PV basal periférica de 5 mmHg, conservando o calibre basal anterior e limitando a expansão. O volume excedente usa referência de 600 mL e integração dos calibres relativos ao decúbito. É uma estimativa demonstrativa, sem balanço de toda a circulação; não é medida individual nem cálculo de débito cardíaco. Cores venosas indicam pressão, não oxigenação; artérias mantêm sua identificação visual.

Coração (66 bpm de referência), partículas, bomba, válvulas e histórico usam o tempo simulado. Pausa e velocidade afetam esse relógio. Mudar postura durante pausa atualiza pressões e cores, sem avançar o histórico. Caminhada e parada mantêm redução gradual e reenchimento.

## Apresentação e validação

Cada card regional reúne PA/PV, mmHg/cmH₂O, desnível e diferença. Corpo e Ciclo abrem em pé, de perfil, e reclinam para decúbito dorsal; a RA conserva essa postura. A figura do gráfico projeta a silhueta aprovada e adapta-se à janela. Barras regionais e curvas temporais comparam PA vermelha e PV azul na mesma escala de 0–200 mmHg; o eixo equivalente em cmH₂O conserva a conversão. O ponto verde marca o nível do átrio direito.

Corpo e contorno preservam malhas, materiais e shaders. A Bomba preserva geometria, materiais e fases. Os testes verificam gradiente, hidrostática compartilhada, unidades, colapso jugular, equivalência com o exemplo do slide, atividade e reenchimento, válvulas, relógio, enquadramento e consistência dos painéis/gráficos. A câmera RA depende de dispositivo e navegador compatíveis.

## Referências consultadas

- [CV Physiology — Effects of gravity](https://cvphysiology.com/cardiac-function/cf017): pressão arterial/venosa periférica e resposta central à postura.
- [CV Physiology — Venous return](https://cvphysiology.com/cardiac-function/cf016): gradiente, resistência e retorno venoso.
- [NCBI Bookshelf — Venous Insufficiency](https://www.ncbi.nlm.nih.gov/books/NBK534256/): pressão estática, válvulas e bomba muscular.
- [Calf muscle pump and venous hemodynamics](https://pmc.ncbi.nlm.nih.gov/articles/PMC3699225/): pressão média na coxa e ação da bomba.
- [PubMed — Hydrostatic and venous pressure indifference points](https://pubmed.ncbi.nlm.nih.gov/24481962/): distinção entre referência e ponto de indiferença.
- [PubMed — Upright cerebral venous outflow](https://pubmed.ncbi.nlm.nih.gov/15284348/): colapso jugular e drenagem cerebral na posição vertical.
