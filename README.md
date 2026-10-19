# LAB-RA — biblioteca e experimentação

## Situação atual — 19 de outubro de 2026

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
