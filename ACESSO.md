# A porta do laboratório — e o documento de que ela depende

**Não apagar sem ler.** Esta é a única peça de que o laboratório inteiro
depende e que **não mora neste repositório**. Se ela se perder, todas as
bancadas fecham ao mesmo tempo, e nada no código dá pista do motivo — o aluno
e o professor recebem a mesma frase educada de recusa.

## O que é

Um documento no Firestore do projeto Firebase **`mosaico-game`**:

| | |
|---|---|
| coleção / documento | `config` / `mestres` |
| campo | `emails` |
| tipo | lista de textos (os e-mails Google autorizados) |

O `guard.js` faz o login com Google, lê esse documento e compara o e-mail da
conta contra a lista, com `trim()`. Quem está na lista entra; quem não está é
desconectado na hora, com *"Esta conta Google não está autorizada no
laboratório."*

## O que quebra sem ele, e como cada caso se manifesta

O código **não distingue** "lista vazia" de "documento inexistente":

```js
const emails = snap.exists() && Array.isArray(snap.data().emails) ? snap.data().emails : [];
```

Ou seja — apague o documento e a lista vira `[]`, **ninguém passa, e todo
mundo recebe a mesma mensagem de conta não autorizada.** Parece que o
problema é da conta da pessoa. Não é.

| o que se perde | o que a pessoa vê |
|---|---|
| o documento `config/mestres` | "Esta conta Google não está autorizada" — para todos, inclusive o dono |
| o campo `emails`, ou ele deixa de ser lista | idêntico ao caso acima |
| as Regras do Firestore passam a negar a leitura | idêntico ao caso acima |
| o projeto `mosaico-game` | "Não foi possível entrar com Google", com o erro do Firebase junto |
| o domínio autorizado no Firebase Auth | a janela do Google abre e fecha sem concluir |

Repare que **quatro dos cinco casos produzem a mesma tela**. Ao diagnosticar,
comece confirmando que o documento existe e que a leitura é permitida — e não
pela conta de quem reclamou.

## Como restaurar

No console do Firebase, projeto `mosaico-game` → Firestore → criar a coleção
`config`, documento `mestres`, campo `emails` do tipo *array*, e pôr dentro os
e-mails Google que devem entrar. Um e-mail por item, exatamente como o Google
os escreve.

Confirme também, em Authentication → Settings → Authorized domains, que
`drmarionascimento.github.io` está lá.

**Não há cópia da lista neste repositório, e isso é de propósito:** ela é dado
pessoal de terceiros, e repositório público não é lugar para e-mail de
ninguém. Se quiser um backup, guarde-o fora daqui.

## O que esta porta NÃO é

**Não é segurança.** O GitHub Pages é público: qualquer pessoa que saiba o
endereço de um arquivo o baixa, sem passar por login nenhum. A tranca é
barreira de acesso **casual** — impede que alguém tropece nas bancadas, não
que alguém decidido as leia. O que precise mesmo ficar fechado vai para as
Regras do Firestore, do lado do servidor.

É por isso que o aviso está escrito na própria `bancadas.html`, à vista de
quem entra, em vez de ficar só aqui.

## Dois nomes que parecem errados e estão certos

Estes dois carregam o nome antigo do projeto de propósito. **Renomear
qualquer um deles desconecta quem já está dentro:**

- a chave de sessão **`dragon.ra.access.v1`**, no `sessionStorage` — é ela que
  faz o laboratório lembrar que você já entrou nesta aba;
- o app Firebase **`dragon-lab`** (com `dragon-mesa` reaproveitado quando a
  mesa já o inicializou na mesma página).

## Um detalhe do `guard.js` que vale conhecer

Ele resolve o endereço da porta e o das bancadas a partir do endereço do
**próprio script**, não do da página:

```js
const scriptUrl = new URL(script?.src || "guard.js", location.href);
const authUrl = new URL("index.html", scriptUrl).href;
```

É por isso que a mesma tranca funciona numa bancada na raiz e numa página a
três pastas de fundura, sem ajuste. E o parâmetro `?destino=` guarda o
endereço pedido, para que um link fundo — `bancada/?nivel=5`, o que se manda a
um aluno — volte ao lugar certo depois do login, em vez de largar a pessoa no
índice sem ela perceber que perdeu o endereço. Só se volta para dentro do
próprio laboratório: destino de fora é recusado, porque a porta não é ponte.
