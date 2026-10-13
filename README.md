# LAB-RA — biblioteca e experimentação

**Aprender pesquisa fazendo pesquisa.**
*Fazendo, errando e criando!*

[Abra a biblioteca](https://drmarionascimento.github.io/lab-ra/bancadas.html).

Ambiente pessoal de criação, teste e acompanhamento. Dois conjuntos: Dragon Games, por história e versão, e Fisiologia, por unidade. As cópias em `biblioteca/` são locais e não carregam código ou modelos dos sites de origem. Serviços de RA e bibliotecas CDN utilizados pelos componentes continuam sendo dependências externas.

As versões de referência e a correspondência dos acessos estão em [biblioteca/origens.json](biblioteca/origens.json). O retorno dos módulos de Fisiologia foi adaptado para esta biblioteca. As maquetes de Carro-Forte e VestChip têm entradas próprias de estudo, com peças liberadas, fora das partidas. Os projetos de origem não são alterados.

Experimentos antigos foram retirados; alguns endereços antigos permanecem como atalhos de compatibilidade, sem manter o código dos experimentos. Corpo em ação não integra a biblioteca atual porque permanece exclusivo do LAB-RA e foi retirado conforme o escopo desta renovação.

Direitos autorais e restrições: [LICENSE.md](LICENSE.md). As licenças de bibliotecas copiadas acompanham seus arquivos.

## Conferência

`npm test` executa os testes da biblioteca e os motores independentes de Starling e junção neuromuscular. Testes copiados da Fisiologia que exigem a interface dos Tutores pertencem ao projeto de origem e não fazem parte deste comando. As telas de estudo de modelos GLB permitem inspeção e RA; não reproduzem a pontuação nem as etapas narrativas da partida. Os testes de câmera exigem aparelho compatível.
