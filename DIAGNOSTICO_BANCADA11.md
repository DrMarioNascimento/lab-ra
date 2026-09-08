# Bancada 11 — auditoria de viabilidade e estado da entrega

## Estado

**Modelo funcional solicitado: NÃO CONCLUÍDO.** Os arquivos `atlas_cardiaco_referencia.glb` e `atlas_cardiaco_geometria.blend` são referências extraídas para inspeção. Não atendem à especificação de produção e não devem substituir o modelo da bancada.

A decisão do professor nesta conversa prevalece sobre os limites externos do documento original: **priorizar anatomia e volumes reais; permitir aumentar as dimensões externas**. Não foi autorizada redução dos volumes para caber no envelope original.

## Requisitos de aceitação preservados

- GLB com estruturas nomeadas e hierarquia documentada; máximo de 60.000 triângulos, preferencialmente até 40.000.
- Coordenadas numéricas em milímetros para a bancada; sistema destro, Y superior, X para a esquerda do paciente, Z anterior. Origem no ápice do VE; transformações aplicadas.
- Paredes com epicárdio/endocárdio e fechamento das bordas; VE/septo nominalmente 10 mm, VD 3–4 mm, átrios 2–3 mm.
- Cavidades ventriculares de 120 ml no estado cheio e 50 ml no vazio; átrios aproximadamente 60 ml cheios.
- VD em crescente, envolvendo o VE; sem sobreposição artificial de cavidades ou duplicação do septo.
- 11 cúspides independentes: mitral 2, tricúspide 3, aórtica 3, pulmonar 3; quatro anéis; papilares e cordas; duas aurículas; vasos patentes; coronárias epicárdicas visíveis.
- Miocárdio escuro/fosco, roughness aproximadamente 0,75; endocárdio e vasos aproximadamente 0,25–0,30; sem sheen claro que elimine a diferenciação.
- Morphs são opcionais conforme o documento. Sua ausência precisa ser explícita, sem chamar o modelo estático de simulação fisiológica.
- Licença e atribuição acompanhando qualquer redistribuição pública.

## Fontes examinadas

1. Os dois GLBs Realistic Human Heart enviados pelo professor possuem a mesma geometria: 22.562 triângulos em uma malha, sem animação. Diferem na resolução das texturas (2048 e 1024). Seus metadados creditam neshallads, CC-BY-4.0. Não fornecem separação anatômica acionável.
2. `heart.usdz`: duas malhas e estrutura de animação, não equivalentes às peças pedidas.
3. `Heart_Low.usdz`: quatro malhas; a divisão não satisfaz a lista de estruturas exigida. Contagem maior de vértices não comprova fidelidade anatômica.
4. Z-Anatomy: arquivo `Z-Anatomy.zip`, `Startup.blend`, repositório oficial https://github.com/Z-Anatomy/Models-of-human-anatomy . Extração usando Blender 4.5.11, carregamento sem execução de scripts do atlas. Foram inspecionados geometria, nomes, materiais e cortes.

O FBX e os mapas PNG fornecidos não foram usados como base de reconstrução interna. Nenhum original do professor foi alterado.

## Resultado do Z-Anatomy extraído

O GLB de referência exportado contém **33 malhas e 179.246 triângulos**. A contagem inclui as curvas convertidas durante a exportação. O JSON `atlas_geometry_audit.json` cobre 30 objetos avaliados; três curvas tiveram avaliação vazia nessa etapa e só foram tesselladas na exportação. Portanto, o somatório daquele JSON não deve ser confundido com o total do GLB.

| Câmara | Arestas de borda abertas na avaliação |
|---|---:|
| VE | 360 |
| VD | 334 |
| AE | 121 |
| AD | 238 |

Essas bordas precisam ser classificadas: óstios anatômicos, bordas entre cascas e defeitos não são equivalentes. A presença de bordas abertas por si só não prova ausência de uma superfície interna. Os cortes mostram superfícies internas e partes do aparelho subvalvar. Entretanto, o conjunto ainda não é uma parede sólida fechada certificada para o teste solicitado.

Foram encontrados **9 objetos de cúspides**:

- Mitral: posterior (1 de 2).
- Tricúspide: septal e inferior (2 de 3).
- Aórtica: coronariana direita, coronariana esquerda e não coronariana (3 de 3).
- Pulmonar: anterior, direita e esquerda (3 de 3).

As duas cúspides anteriores AV não foram localizadas como objetos próprios nesta versão. Isso não exclui a possibilidade de alguma geometria estar incorporada a outro objeto; não foram consideradas atendidas.

Foram localizados quatro músculos papilares nomeados (três direitos e um esquerdo). Parte das cordas aparece integrada às malhas de cúspides. Aurículas, anéis e sistema de condução não foram confirmados como o conjunto independente solicitado. Não há validação de que os vasos convertidos tenham parede dupla e lúmen patente em todas as junções.

**Espessuras e volumes-alvo não foram comprovados.** Os valores algébricos de volume presentes no JSON bruto para malhas abertas não são volumes válidos de cavidades. As experiências com fechamento em leque e preenchimento voxel, guardadas como arquivos PLY de trabalho, são sondagens geométricas; não constituem reconstruções anatômicas aprovadas e não devem ser usadas na simulação.

## Trabalho necessário antes de chamar o modelo de pronto

1. Reconstruir endocárdio, epicárdio e junções dos óstios; preservar a anatomia do VD e a parede septal compartilhada. Não basta aplicar Solidify indiscriminadamente: isso pode gerar autointerseções e ocluir passagens.
2. Completar e separar aparelho valvar, cordas, papilares e aurículas, com revisão anatômica dos pontos de inserção.
3. Medir o volume da cavidade com tampas virtuais nos planos valvares, sem confundir o volume do tecido miocárdico com o volume de sangue. Documentar a convenção para papilares/trabéculas. Ajustar geometria mantendo conexões e sem interseções.
4. Verificar a espessura em múltiplas secções e regiões; conservar tecido na deformação caso os morphs sejam acrescentados. Escalar toda a câmara como um balão não demonstra deformação fisiológica.
5. Otimizar o modelo completo e medir novamente volumes, espessuras e topologia após a redução de polígonos.
6. Conferir visualmente cortes anterior, transversal, quatro câmaras e vistas dos tratos de saída com o professor.
7. Testar desempenho no celular e na cena da bancada, incluindo materiais, corte e fluxo. O orçamento de triângulos não garante 60 fps sozinho.

## Cuidados de integração que fazem parte da entrega final

- **Unidades:** glTF 2.0 padroniza distâncias em metros. Um GLB cujas coordenadas representam mm é uma convenção particular da bancada, que deve constar de `extras` e do manifesto. Produzir também uma versão física em metros para visualizadores genéricos; no USD usar `metersPerUnit = 0.001` quando os pontos estiverem em mm. Não inserir escala oculta nos nós.
- **Corte:** as duas superfícies delimitam a espessura, mas o recorte simples por `clippingPlanes` não cria faces de seção. O visualizador precisa de tampas de corte (por exemplo, stencil/capping) ou de uma malha de seção calculada para mostrar a faixa sólida.
- **Manifold versus passagem do sangue:** fechar o sólido da parede não significa tampar o lúmen. Unir epicárdio e endocárdio na borda do óstio mantém tecido fechado e passagem aberta. As tampas para medir volume são auxiliares e não devem obstruir os vasos no modelo exibido.
- **Acionamento:** GLB/USDZ não transportam automaticamente o modelo de elastância e o código de fluxo da aplicação. O USDZ estático para RA não pode ser descrito como equivalente à simulação WebGL acionada.

## Arquivos de referência e limites

- `atlas_cardiaco_referencia.glb`: recorte do atlas, coordenadas em metros, orientação exportada pelo Blender, posição corporal original; sem alinhamento final ao ápice e sem ajuste dos volumes.
- `atlas_cardiaco_geometria.blend`: geometria de inspeção; preserva estruturas separadas, mas não é o modelo final.
- `atlas_frente.png`, `atlas_posterior.png`, `atlas_corte_inspecao.png`: renderizações para avaliar forma e partes internas. O corte é uma operação de inspeção, não um teste aprovado de espessura.
- `atlas_geometry_audit.json`: medições topológicas brutas, com as ressalvas anteriores.
- `CREDITOS_ATLAS.md`: atribuição e licença da referência.

## Referências técnicas

- Atlas e atribuições: https://github.com/Z-Anatomy/Models-of-human-anatomy/blob/master/Readme.md
- glTF, unidades e morph targets: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
- Corte por stencil em Three.js: https://threejs.org/examples/webgl_clipping_stencil.html

A inspeção técnica não certifica exatidão anatômica. O modelo solicitado continua pendente de reconstrução, testes geométricos e revisão anatômica; nenhum arquivo nesta pasta é apresentado como tendo passado em todos os critérios.
