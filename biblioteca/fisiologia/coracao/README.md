# Coração em ação · realidade aumentada

Experiência independente do Fisiologia Interativa. Origem confirmada pelo professor: `DrMarioNascimento/lab-ra/bancadas/11-coracao/prototipo/duas-pecas.html`, revisão `85d13200078f5201d251c857efde5326cd53daa7`.

## Vistas preservadas

- Vista Externa: `../assets/coracao.glb`, idêntico ao scan da origem e ao arquivo já usado na Pleura/Retorno venoso; SHA-256 `fcb3c1036fe59dfdcc1c30917dbdaa8fbd52c858e6ba3cadaf126b44ccca4b5b`.
- Vista Interna: `../assets/coracao-interno.glb`, cópia integral do GLB de 79 malhas; SHA-256 `b717a1f2e3880835703d4088a2cc99e06e01efc49695e7e55abf32d5c6af79cd`.

Modelos, cores, materiais, campos de deformação e motor cardíaco conservam a origem. A transferência não corrige as limitações anatômicas do modelo interno em desenvolvimento; consulte `MODELO-INTERNO.json`. Marcação externa é aproximada. Não existe trajeto anatômico do sistema de condução nesses dois modelos; a leitura elétrica e o ECG são esquemáticos.

A referência *Realistic Human Heart*, de neshallads, corresponde **somente à Vista Externa**. A Vista Interna tem fonte própria, BodyParts3D. Os batimentos de cada área cardíaca (segmento) foram cuidadosamente calculados pelo **Prof. Mário César Nascimento, PhD**, e sincronizados ao ciclo simulado. Os créditos das duas fontes permanecem visíveis abaixo do card de RA, independentemente da vista selecionada.

## Apresentação e controles

Tema, assinatura, cards e navegação seguem as experiências RA do novo repositório. Os dois Tutores oferecem Coração e Retorno venoso no destaque cardiovascular, em nova aba. Voltar ao Tutor preserva Educação Física/Fisioterapia. Não há credencial Google ou dependência de execução do Lab RA.

A experiência abre na Vista Interna, pausada, em 75 bpm e fase 0,300. Iniciar/Pausar, Um ciclo e Reiniciar usam o mesmo relógio da peça, das leituras, das valvas e do gráfico. Um ciclo percorre uma volta a partir do instante corrente e pausa. Mudar o instante pausa a reprodução. Velocidade altera apenas a reprodução; frequência recalcula o ciclo; amplitude e ajustes visuais não alteram o motor. Restaurar parâmetros recupera os valores iniciais e a vista interna; Restaurar vista recupera apenas a câmera.

Enchimento/Ejeção selecionam amostras do ciclo na frequência atual, com os pares apropriados de valvas abertos e fluxo positivo. O gráfico de Wiggers mostra as mesmas pressões/volume/ECG/bulhas do motor, com dimensão responsiva e cursor compartilhado. Cards mostram pressões em mmHg e cmH₂O; a conversão é 1 mmHg = 1,35951 cmH₂O.

## Exportação RA

A RA recebe a vista e o instante pausado escolhidos, com escala anatômica herdada da origem. O exportador calcula normais ausentes antes de preparar o GLB. Trocar vista/instante ou iniciar o ciclo invalida exportações anteriores; o botão permanece desativado durante batimento. A página tem animação; a RA apresenta o estado estático escolhido. Câmera RA exige dispositivo/navegador compatíveis.

## Validação

Testes fisiológicos herdados verificam referências a 75 bpm, fases isovolumétricas, gradientes valvulares, redução de diástole com frequência, condução e atividade elétrica. Testes de migração conferem identidade dos dois GLBs, 79 malhas internas, recursos locais, atribuições, percursos e instantes rápidos. Comparação no navegador verifica posições, transformações, atributos e materiais das duas vistas ao longo do ciclo; verifica também início/pausa, ciclo único, velocidade, responsividade, legendas e exportação GLB de ambas as vistas.

Veja [atribuições](ATTRIBUTION.md) e [licenças](LICENSE.md). A origem permanece disponível e não foi alterada.


## Vista no tórax — 10/10/2026

Terceira vista compartilhada pelos percursos de Educação Física e Fisioterapia. Arquivo `../assets/torax-vasos-encaixe.glb`, fornecido por Mário César Nascimento; SHA-256 `7317d2261a01a662cf445e0fb32075cbf445b3e247e028d4162f0f1e63b96dc5`. Metadados declaram BodyParts3D como fonte e ajuste local do diafragma. O arquivo original é preservado, sem redução das malhas. Normalização de enquadramento e atenuação de materiais ocorrem somente na cena. O modelo não contém animações; não se atribui a ele o batimento das vistas interna e externa.

Carregamento sob demanda, com nova tentativa em caso de falha. A atenuação de pulmões e arcabouço facilita a observação do coração e dos vasos; os rótulos cardíacos A/B não são aplicados ao tórax. A exportação RA conserva a escala anatômica medida do arquivo, separada da escala do coração isolado.
