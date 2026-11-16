# Recuperação e integração ao Lab-RA — 15/11/2026

## Origem

Recuperada a publicação 4 do Mosaico Lastro, código funcional 0.3.0, commit de origem `5802a8fcbcb9e7916ffdbd2befc8fc1dd9e4f68f`. A lista de versões consultada não continha versão posterior. O pacote recuperado e os 16 arquivos de execução do repositório original eram idênticos antes das adaptações de navegação.

## Alterações para publicação

- Código, proposta, documentação e três suítes originais incorporados em `mosaico-lastro/`.
- Card de `bancadas.html` direcionado para as páginas locais do Lab-RA.
- Retorno ao Lab-RA nas páginas atuais; referências entre experiências antigas corrigidas.
- Caminhos dos testes adaptados à pasta final. Equações, coeficientes e conteúdo principal preservados.
- Nenhuma dependência do login da prévia privada para abrir a nova publicação.

## Verificações desta recuperação

`npm test` passou no código original e novamente na estrutura final: 364 campanhas longitudinais, 59.466 dias simulados, 364 reconstruções integrais, 241 partidas individuais antigas e 2.178 sessões antigas por equipes. Todos os arquivos JavaScript passaram na verificação de sintaxe; referências locais de arquivos foram conferidas.

No Chromium da bancada: campanhas completas de 28 dias individual e com seis equipes; bloqueios de avanço e integração antes das confirmações; retomada após recarregamento; comparação de trajetórias; downloads de campanha JSON, CSV e relatório HTML. O motor também verifica configurações de quatro e cinco equipes.

A verificação de software não calibra o modelo fisiológico. Não foram testados aparelhos físicos iPhone/Android nem impressão em papel. O modo por setores continua presencial em uma tela compartilhada, sem sincronização entre celulares.
