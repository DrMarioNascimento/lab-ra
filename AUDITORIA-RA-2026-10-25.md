# Auditoria da implantação de RA — 25/10/2026

Escopo: Fisiologia Interativa, Casa da Costa, Carro Forte, Eco do Amanhã, catálogo/cópias do Dragon e biblioteca Lab-RA. A auditoria abrange a implantação de volume, animações, arquivos nativos, carregamento e espelhamento.

## Achados e correções

| Achado | Efeito | Correção |
| --- | --- | --- |
| Textos em malhas com vários materiais eram ignorados | A etiqueta do rádio do farol continuava plana | Relevo por grupo de faces/material, com remoção ao apagar/trocar a textura. Conferidas capa, duas páginas e etiqueta do farol. |
| Carimbos de cache divergiam na Casa da Costa | Possibilidade de reutilizar módulos antigos; a verificação do Dragon estava falhando | Sincronizados módulos da mesa/atividades e CSS/JS de ac-janelas em todas as telas. Atualizada a referência de versão no teste do fluxo de personagens. |
| Comunicação Celular importava as placas sem a versão nova | Aparelhos com cache anterior podiam conservar as placas antigas | Atualizados o carregamento do aplicativo, a importação das placas e os hashes do manifesto. |

As correções foram propagadas às cópias pertinentes do Lab-RA, com histórico de procedência e hashes. O processo de sincronização também foi atualizado para conservar as correções em execuções futuras.

## Evidências

- **192 testes de fisiologia aprovados** após a correção.
- **27 GLB** novamente validados: zero erros de formato; todos contêm animação e texto geométrico.
- **27 USDZ** novamente abertos e validados com OpenUSD: zero erros; animações presentes, arquivos sem compressão interna e alinhamento de 64 bytes.
- **108 endereços públicos** dos GLB/USDZ (origem e Lab-RA): HTTP 200 e tamanho do arquivo conferido sem compressão HTTP.
- **26 arquivos públicos de entrada/código** conferidos por conteúdo com os fontes da revisão, antes do ajuste complementar de ac-janelas.
- Sete prévias de ciclos (coração, osso, junção, sarcômero, retorno venoso, pleura e Starling): carregamento, avanço da animação e pausa confirmados. Comunicação Celular, Célula Viva e a entrada correta de Película/Travessias carregaram sem erro de JavaScript.
- Cenas da Casa da Costa carregadas: duas maquetes, duas escrivaninhas, bandeja, farol, jardim, livro, quarto e relógio. O clima das duas maquetes e do farol pode ser desligado depois de fechar o portal inicial.
- Torre do Eco e maquete do Carro Forte carregadas; notebook do Eco com relevo confirmado e removido ao limpar seu texto.
- Teste de relevo: face com material próprio, deformação da superfície, opacidade, remoção do texto, vínculo do clima à âncora, passagem dos toques e preferência de movimento reduzido.
- Testes próprios dos jogos: Casa da Costa **4/4**, Carro Forte **6/6**, Eco do Amanhã **3/3**.
- Integridade, navegação e procedência do Lab-RA: **31/31** na preparação final.

## Método e limites

O navegador automatizado não conseguiu navegar diretamente nos domínios públicos por bloqueio de rede do ambiente. Os testes visuais e funcionais usaram cópias dos commits publicados, com as mesmas versões de Three.js e model-viewer; a implantação pública foi conferida separadamente por HTTP. Isso não equivale a um teste de câmera em aparelho físico.

A inspeção do livro/radio no farol tornou seus grupos visíveis no ambiente de teste para conferir cada superfície; não simula toda a sequência de investigação de uma partida. Não foram alterados estados de partidas reais.

A execução completa do Dragon é conferida no GitHub Actions, em Linux. A tentativa local em Windows foi interrompida após incompatibilidades de fim de linha/ambiente nos testes antigos; seu resultado não é contabilizado como aprovação.

**Pendente: câmera, rastreamento, gestos e desempenho em iPhone e Android físicos.** Os maiores ciclos (por exemplo, coração interno, cerca de 35 MiB em GLB e 33 MiB em USDZ) também precisam de medição em aparelho e conexão móvel. A validação de formato não garante desempenho nem comportamento do visualizador nativo.

## Revisões de origem

- [fisiologia-interativa — 5de49509](https://github.com/DrMarioNascimento/fisiologia-interativa/commit/5de49509f8c214dc1a0108a8feb9b20fda3e43b7)
- [casa-da-costa — 27360254](https://github.com/DrMarioNascimento/casa-da-costa/commit/273602545a68664391ccd436faf3cb9380fa9edc)
- [carro-forte — 604f4a08](https://github.com/DrMarioNascimento/carro-forte/commit/604f4a08cd49e23891c1c24761e82041d26151de)
- [eco-do-amanha — cd8c0923](https://github.com/DrMarioNascimento/eco-do-amanha/commit/cd8c09231feea3981ab99fa12cab48fcbced1bb6)
- [Dragon — b722697c](https://github.com/DrMarioNascimento/Dragon/commit/b722697c31eeceedca3c99557ab318ed1b8a1e6e)

A conclusão é de implantação corrigida e verificada no escopo acima, com homologação de câmera em celulares físicos ainda pendente.

