# Corpo em ação — Integração dos sistemas

Experiência experimental exclusiva do LAB-RA, acessível pelas bancadas. Não integra a página dos alunos nem os catálogos dos Tutores. Cinco aproximações compartilham o mesmo estado e relógio: corpo integrado, alvéolo, circulação, músculo e mitocôndria. Iniciar/Pausar, Reiniciar, esforço, velocidade, rótulos e sequência automática não duplicam motores. A rotação e as aproximações não reiniciam fases.

## Cálculos e limites

Adulto didático em ar ambiente ao nível do mar, Hb 15 g/dL. FC 70–150 bpm, FR 12–30/min e VO2 0,25–2,20 L/min variam linearmente com esforço relativo escolhido. VS cresce de 70 a 110 mL pela curva saturante 70 + 40 × 2e/(1+e), onde e é esforço de 0 a 1. São curvas de referência ilustrativas, não regressões clínicas nem teste de esforço individual. PaCO2 40 mmHg e gradiente alveolar–arterial 8 mmHg são fixados.

- Débito: FC × VS / 1000, L/min.
- Saturação: Hill, P50 26,8 mmHg e n 2,7.
- CaO2 = 1,34 × 15 × SaO2 + 0,003 × PaO2, mL/dL.
- VO2 = DC × (CaO2 − CvO2) / 100, L/min. CvO2 é derivado, nunca independente.
- Oferta = DC × CaO2 / 100; extração = VO2 / oferta.
- VCO2 = VO2 × R; R 0,8–1. VA = 0,863 × VCO2(mL/min) / PaCO2; VT = VA / FR + 0,15 L; VE = VT × FR.
- PAO2 ≈ 0,21 × (760 − 47) − PaCO2/R; PaO2 = PAO2 − 8. São pressões parciais de gás.

Transição de esforço exponencial com constante ilustrativa de 8 s, sem ajuste a dados de cinética humana. Frequências são integradas em fases independentes. A velocidade apenas multiplica tempo. Em pausa, ajustes comparam equilíbrio; durante reprodução, preservam continuidade. O loop de 70 s repete 15 s de repouso, 25 s de esforço e 30 s de recuperação; a resposta continua sem saltar no reinício. Nada é acumulado como treino ou fadiga.

Sístole é um pulso visual, sem valvas, pressões, eletrofisiologia ou cálculo cardíaco segmentar. Movimentos pulmonares seguem a fase respiratória e o esforço; não são medidas da malha em litros. Fluxo das partículas acompanha o débito, mas o trânsito espacial é ilustrativo. A saturação venosa é mista sistêmica; o músculo ampliado não resolve a mistura regional de órgãos. O2 é aceptor final de elétrons; partículas de ATP e encurtamento são visuais, sem estequiometria de ATP ou modelo de força.

## Modelos e Meshopt

Three.js 0.180.0 e seu MeshoptDecoder. Cópias comprimidas da silhueta já existente em `retorno-venoso/corpo.glb` e do coração externo `bancadas/11-coracao/fontes/scan/A-scan-realista.glb`. Dedup, weld e EXT_meshopt_compression com posições de 16 bits; **sem simplificação de triângulos**. Buffers normalizados são convertidos para Float32 antes de transformar/deformar a geometria, evitando saturar coordenadas quantizadas. `assets/compressao.json` registra tamanhos. Não se modifica nenhum arquivo das experiências aprovadas.

Reconstruir: `npm ci`, depois `npm run build:integracao`. A dependência de build é separada da execução no navegador. Pulmões reutilizam a função procedural de Pleura. Demais ampliações são procedurais. Crédito do coração refere-se somente à superfície externa: neshallads, Realistic Human Heart, CC BY 4.0; [atribuição](ATRIBUICAO.md). Escala, acabamento, compressão e pulso visual adaptados. O pulso desta experiência não é o cálculo segmentar do simulador cardíaco do autor.

## RA viva

WebXR `immersive-ar`, hit-test e DOM overlay. O mesmo `setAnimationLoop`, estado fisiológico, malhas e partículas continuam na câmera. O aluno posiciona o corpo sobre a superfície e usa Iniciar/Pausar, Repouso e Exercício. O corpo tem cerca de 1,53 m nesta apresentação; as ampliações ficam disponíveis na página 3D.

Sem WebXR ou sem overlay, a interface informa a limitação e mantém a viagem 3D. Não exporta uma peça congelada para Quick Look fingindo conservar interação. Encerrar RA restaura vista, tamanho e controles. Compatibilidade e sessão de câmera precisam ser confirmadas em aparelho físico; os testes locais de navegador não substituem essa validação.

## Referências

- [Modelagem da cascata do oxigênio](https://pmc.ncbi.nlm.nih.gov/articles/PMC6697208/): conteúdo, afinidade e acoplamento entre oferta e utilização.
- [González-Alonso et al.](https://pubmed.ncbi.nlm.nih.gov/9950843/): conteúdo arterial, débito e fluxo muscular no exercício.
- [WebXR e controles](https://modelviewer.dev/examples/augmentedreality/) e [EXT_meshopt_compression](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Vendor/EXT_meshopt_compression).

Referências conceituais não validam as curvas de esforço escolhidas. Hemoglobina, altitude, doenças, acidose, controle neural, distribuição regional, fadiga e recrutamento motor não são variáveis do modelo.
