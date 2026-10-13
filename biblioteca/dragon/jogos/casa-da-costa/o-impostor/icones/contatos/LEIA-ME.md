# Contatos — O Impostor

Bonecos de vidro usados como foto de contato no grupo (Grupo, Privadas, cabeçalho da conversa e Suspeitos).

**Números e cores mudam a cada partida.** A `mesa.html` sorteia, pela semente da partida, o final de número (2 dígitos) e a cor de cada personagem. O mesmo 08 azul de uma noite é outro personagem na seguinte. Há um contato por personagem; a Acompanhante escreve pelo celular do proprietário.

- Mesa base: 7 contatos. Com extras (Tabelião, Advogado, Governanta, Chefe de Cozinha, Jardineiro, Eletricista), até 13.
- Para simular mesas maiores: `mesa.html?contatos=12`.

| Arquivo | Vidro | Cor do nome na tela |
|---------|-------|---------------------|
| `azul.webp` | azul | `#6fa8ff` |
| `transparente.webp` | transparente | `#d8dee4` |
| `esmeralda.webp` | verde-esmeralda | `#5fd68a` |
| `dourado.webp` | âmbar/dourado | `#e6c36a` |
| `roxo.webp` | roxo | `#b9a6ff` |
| `verde-agua.webp` | verde-água | `#3cc9a8` |
| `ciano.webp` | ciano | `#5fd8ec` |
| `vermelho.webp` | vermelho | `#ff8a80` |
| `rosa.webp` | rosa | `#f28cc0` |
| `laranja.webp` | laranja | `#ffa05a` |
| `lima.webp` | verde-lima | `#b8e05a` |
| `cobre.webp` | cobre | `#d49a6a` |
| `indigo.webp` | índigo | `#9a9eff` |
| `branco.webp` | branco opaco (porcelana) — 14ª cor, entra com o Médico | `#f4f1ea` (a ligar na `PALETA`) |

As oito primeiras são as artes originais (192×192, recortadas das de 1408 px). O laranja também já é arte final (02/10/2026; a versão colorida antiga ficou como `laranja_SUBSTITUIDO.webp`). As outras quatro (rosa, lima, cobre, índigo) foram coloridas a partir do boneco transparente; se quiser, troque pelas artes finais com o mesmo nome.

`ligar.js` (carregado no fim da `mesa.html`) lê `window.OIContatos` (número → arquivo) e põe a foto certa em cada avatar.
