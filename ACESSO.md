# Acesso livre ao laboratório

A entrada e as bancadas do Lab RA não exigem conta Google, credencial ou lista de e-mails. O botão **Abrir bancadas** leva ao catálogo, e cada modelo pode ser aberto diretamente por seu endereço.

`guard.js` permanece como compatibilidade de navegação: favoritos antigos do tipo `index.html?laboratorio=acesso&destino=...` seguem para a bancada pedida, incluindo `nivel`, `grau` e os demais parâmetros. Destinos externos ao laboratório e destinos para a própria entrada são recusados; nesses casos abre-se o catálogo.

Não há importação de Firebase Auth, consulta a `config/mestres` nem dependência de sessionStorage para abrir as páginas. Os arquivos deste repositório eram servidos publicamente pelo GitHub Pages. A retirada da porta local não modifica o projeto Firebase, o documento de mestres nem as regras de outros projetos.
