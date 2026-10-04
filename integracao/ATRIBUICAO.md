# Corpo em ação — modelos e componentes

Coração externo: [Realistic Human Heart](https://sketchfab.com/3d-models/realistic-human-heart-3f8072336ce94d18b3d0d055a1ece089), de **neshallads**, sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Cópia Meshopt da malha externa existente em `bancadas/11-coracao/fontes/scan/A-scan-realista.glb`, sem simplificar triângulos. Escala, acabamento e pulso visual foram adaptados. A referência corresponde somente à superfície externa; o pulso desta experiência é simplificado, distinto do cálculo segmentar de Coração em ação.

A silhueta reutiliza `retorno-venoso/corpo.glb`, preservando sua forma e metadados. Os pulmões reutilizam a geometria procedural local em `pleura/anatomia.js`. Os demais modelos, a interface e o motor didático são componentes originais do projeto, abrangidos pela licença do LAB-RA.

Three.js, Meshoptimizer e glTF Transform conservam suas licenças MIT. A compressão e os tamanhos estão registrados em `assets/compressao.json`.
