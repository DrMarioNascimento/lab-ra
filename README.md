# LAB-RA — biblioteca e experimentação

## Disponibilidade e novidades — 24 de outubro de 2026

**Biblioteca de experimentação**, com entradas em [bancadas.html](https://lab-ra.dragongames.dev.br/bancadas.html). As nove bancadas de Fisiologia usam os caminhos atuais em `biblioteca/fisiologia/`: célula, potencial de membrana, Starling, junção neuromuscular, músculo/sarcômero, osso vivo, coração, retorno venoso e pleura.

Para os materiais educacionais disponíveis ao público, o [portal de Fisiologia](https://fisiologia.drmarionascimento.com.br/) é a referência principal. As cópias locais de jogos conservam o estágio e as restrições da origem. Antigos atalhos de experiências retiradas não são contabilizados como atividades novas. Esta biblioteca não libera jogos fechados.

[Ver todos os recursos públicos](https://www.drmarionascimento.com.br/#acesso-publico). O acesso respeita [LICENSE.md](LICENSE.md).

## Contexto técnico — registro de 19 de outubro de 2026

Biblioteca pessoal de experimentação em [bancadas.html](bancadas.html), com cópias locais de Dragon Games e Fisiologia. A origem e a revisão de cada cópia estão em [biblioteca/origens.json](biblioteca/origens.json). Atualizar o projeto de origem não atualiza automaticamente estas cópias; confira a procedência antes de sincronizar. Os jogos continuam em testes internos.

## Ambiente de experimentação

Este repositório reúne materiais de estudo e experimentação. A disponibilidade de uma bancada de um jogo não representa lançamento público nem abertura para participação externa. Os materiais educacionais de Fisiologia permanecem acessíveis nos projetos de origem, conforme suas condições próprias.

Portal do autor: https://www.drmarionascimento.com.br/ · Dragon Games: https://dragongames.dev.br/


**Aprender pesquisa fazendo pesquisa.**
*Fazendo, errando e criando!*

[Abra a biblioteca](https://lab-ra.dragongames.dev.br/bancadas.html).

Ambiente pessoal de criação, teste e acompanhamento. O medalhão e a célula animada são decorativos, sem navegação. As listas usam Prólogo e Capítulo, sem numeração automática.

Dois conjuntos: Dragon Games, por história e versão, e Fisiologia, por unidade. As cópias em `biblioteca/` são locais e não carregam código ou modelos dos sites de origem. Serviços de RA e bibliotecas CDN utilizados pelos componentes continuam sendo dependências externas.

As versões de referência e a correspondência dos acessos estão em [biblioteca/origens.json](biblioteca/origens.json). O retorno dos módulos de Fisiologia foi adaptado para esta biblioteca. As maquetes de Carro-Forte e VestChip têm entradas próprias de estudo, com peças liberadas, fora das partidas. Os projetos de origem não são alterados.

Experimentos antigos foram retirados; alguns endereços antigos permanecem como atalhos de compatibilidade, sem manter o código dos experimentos. Corpo em ação não integra a biblioteca atual porque permanece exclusivo do LAB-RA e foi retirado conforme o escopo desta renovação.

Direitos autorais e restrições: [LICENSE.md](LICENSE.md). As licenças de bibliotecas copiadas acompanham seus arquivos.

## Conferência

`npm test` executa os testes da biblioteca e os motores independentes de Starling e junção neuromuscular. Testes copiados da Fisiologia que exigem a interface dos Tutores pertencem ao projeto de origem e não fazem parte deste comando. As telas de estudo de modelos GLB permitem inspeção e RA; não reproduzem a pontuação nem as etapas narrativas da partida. Os testes de câmera exigem aparelho compatível.

## Estado das verificações técnicas — 24 de outubro de 2026

A divergência de integridade foi reconciliada com o projeto de origem. Dez arquivos atualizados e dois arquivos novos foram comparados, byte a byte pelo identificador Git, com a revisão `b4087965d55256d0a73a852ddb179a0129be4ad7` de `fisiologia-interativa`. O manifesto registra os hashes correspondentes; `biblioteca/origens.json` preserva as referências anteriores e documenta esta atualização por arquivo.

Também foram reconciliadas oito adaptações documentais de 19/10: notas de procedência, domínio atualizado e caminhos para a licença preservada. A reversão apenas dessas adaptações reproduz exatamente os textos da origem registrada. O manifesto inclui essas cópias adaptadas, identificadas em `origens.json`.

O teste de integridade continua obrigatório e verifica os 588 arquivos registrados. Os resultados de cada revisão estão no [workflow de testes](https://github.com/DrMarioNascimento/lab-ra/actions). Testes automáticos não substituem inspeção visual, câmera/RA em aparelho compatível nem login Google real. Essas verificações interativas não foram repetidas nesta revisão porque a conexão do navegador estava indisponível.

## RA dos jogos — 25/10/2026

Sincronizados textos dinâmicos com relevo, clima das cenas externas da Casa da Costa e da Torre de Continuidade e preservação das animações de investigação. Confira biblioteca/dragon/RA-VOLUME-MOVIMENTO.md. A validação com câmera em iPhone e Android físicos permanece pendente.
## RA de fisiologia — 25/10/2026

Sincronizada a revisão a6253847bbe6c7435dc2f849b92bca87a15015bd do Fisiologia Interativa: textos e placas extrudados e 27 modelos animados com pares GLB/USDZ. Navegação própria do Lab-RA preservada. Validações e limites em biblioteca/fisiologia/REVISAO-VOLUME-MOVIMENTO.md.
