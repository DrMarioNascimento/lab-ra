# Alostase — fonte da experiência publicada

[Abrir Alostase](https://lab-ra.dragongames.dev.br/limiar/) · [Arquivos e documentação](https://lab-ra.dragongames.dev.br/alostase-arquivos/)

Esta pasta contém o código React/TypeScript da versão estática publicada em `../limiar/`. O endereço histórico foi preservado após a renomeação para **Alostase**.

- `src/`: interface, motor, rede de modulação, eventos, previsões, perfis e gráficos.
- `vite.config.js`: construção estática com caminhos relativos.
- `check.mjs`: verificação dos percursos curto e estendido.
- `check-etica.mjs`: verificação do Limiar Ético, cujo código está em `../limiar-etica/`.
- [GDD completo recuperado, versões 0.4 e 0.5](docs/GDD-Alostase-v0.5.md).

Construção: `npm install` e `npm run build`. A saída fica em `dist/`. Os testes existentes pressupõem servidores locais nas portas indicadas nos próprios scripts.

O pacote histórico original foi preservado integralmente em `../alostase-arquivos/limiar-v0.5-original.zip`. Ele registra o projeto antes da adaptação para o Lab-RA e da separação entre fisiologia e ética. Para manutenção da versão atual, use esta pasta.
