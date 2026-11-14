// Mosaico Vila · baralho de situações (R13). A cada partida, o sistema sorteia as cartas, como o impostor do
// MOSAICO: a semente da partida refaz o mesmo sorteio. Muda quem propõe (segmento), de que lado a pessoa está e o
// tamanho (poder); a proposta vem sempre do sistema, nunca de um colega.
//
// · Pequena (ano 2): cada pessoa decide por si e cada resposta vale para quem respondeu (+2 pontos pessoais).
//   Cada "aceito" tira uma parte do estrago grande: se a turma inteira aceitar, o estrago é do mesmo tamanho do da grande.
// · Grande (ano 5): todos respondem; vale a resposta de UMA pessoa sorteada, que nunca aparece (+8 pontos pessoais).
// · Ano 4 (opcional): uma carta de honestidade (um erro a seu favor) ou de confiança (você decide antes de saber se a
//   outra parte é honesta). Na confiança, a chance de má-fé é a mesma em todas as cartas (1 em 4) e quem confiou perde
//   sempre o mesmo (os 2 que arriscou): nenhum tipo de pessoa é "mais perigoso" que outro.
// Os ícones de cada carta são provisórios (cópias dos ícones 3D do jogo); os prompts dos definitivos estão em docs/ICONES-PROMPTS.md.

export const GANHO_PEQUENA = 2, GANHO_GRANDE = 8, GANHO_HONESTIDADE = 3, RISCO_CONFIANCA = 2, CHANCE_GOLPE = 0.25;
export const ESTRAGO_MATA = 0.2;    // estrago grande na mata: 20% do teto (devolver custa cerca de 10 pontos de replantio por família, perto de um nível do bem público)

export const PEQUENAS = [
  { id: "fiscal", segmento: "o fiscal da mata", lado: "paga", alvo: "mata", icone: "toco", titulo: "O fiscal da mata",
    telao: "O fiscal da mata cobra 1 ponto para você tirar madeira sem registro, que rende 3. Saldo: +2 para quem aceita.",
    texto: "O fiscal da mata cobra 1 ponto seu para fazer vista grossa: você tira madeira sem registro, que rende 3. Saldo: +2 pontos pessoais. Cada pessoa que aceita tira um pouco da mata de todos; se a turma inteira aceitar, a mata perde 20%.",
    sim: "Pagar 1 ao fiscal", nao: "Não pagar" },
  { id: "vizinho", segmento: "um vizinho", lado: "recebe", alvo: "mata", icone: "grupos", titulo: "A carga do vizinho",
    telao: "Você ajuda a anotar as cargas. Um vizinho oferece 2 pontos para você não anotar a carga extra dele.",
    texto: "Este ano, você ajuda a anotar as cargas de madeira da vila. Um vizinho oferece 2 pontos pessoais para você não anotar a carga extra dele. Cada pessoa que aceita tira um pouco da mata de todos; se a turma inteira aceitar, a mata perde 20%.",
    sim: "Aceitar os 2", nao: "Recusar" },
  { id: "serraria", segmento: "a serraria", lado: "recebe", alvo: "publico", icone: "arvore-dourada", titulo: "A madeira sem nota",
    telao: "A serraria paga 2 a mais pela sua madeira sem nota. Sem nota, o imposto não chega ao bem público.",
    texto: "A serraria oferece 2 pontos pessoais a mais se você vender a madeira sem nota. Sem nota, o imposto da venda não chega ao bem público. Cada pessoa que aceita tira um pouco do bem público; se a turma inteira aceitar, ele perde o equivalente a um nível.",
    sim: "Vender sem nota", nao: "Vender com nota" },
  { id: "taxa", segmento: "um funcionário da prefeitura", lado: "paga", alvo: "publico", icone: "economia", titulo: "A taxa da praça",
    telao: "Um funcionário cobra 1 ponto para tirar seu nome da taxa da praça, que custa 3. Saldo: +2 para quem aceita.",
    texto: "Todo mundo paga 3 pontos de taxa para a praça. Um funcionário da prefeitura cobra 1 ponto seu para tirar o seu nome da lista. Saldo: +2 pontos pessoais. Cada pessoa que aceita tira um pouco do bem público; se a turma inteira aceitar, ele perde o equivalente a um nível.",
    sim: "Pagar 1 ao funcionário", nao: "Pagar a taxa" },
];

export const GRANDES = [
  { id: "alvara", segmento: "a construtora", lado: "recebe", alvo: "publico", icone: "alvara", titulo: "O alvará",
    telao: "Uma construtora oferece 8 pontos pessoais para aprovar uma obra sem vistoria. Aprovada, o bem público de todos perde um nível.",
    texto: "Uma construtora oferece 8 pontos pessoais a quem aprovar uma obra sem a vistoria. Se for aprovada, o bem público de todos perde um nível.",
    sim: "Aceitaria", nao: "Recusaria", aceito: "A obra foi aprovada sem vistoria: o bem público perdeu um nível.", recusado: "A obra não foi aprovada." },
  { id: "madeireira", segmento: "a madeireira", lado: "recebe", alvo: "mata", icone: "alvara", titulo: "A licença da madeireira",
    telao: "Uma madeireira de fora oferece 8 pontos pessoais para você assinar a licença de derrubar um quinto da mata.",
    texto: "Uma madeireira de fora oferece 8 pontos pessoais a quem assinar a licença para ela derrubar um quinto da mata. Se for assinada, a mata de todos perde 20%.",
    sim: "Assinaria", nao: "Não assinaria", aceito: "A licença foi assinada: a mata perdeu 20%.", recusado: "A licença não foi assinada." },
  { id: "escola", segmento: "a empresa da obra", lado: "recebe", alvo: "publico", icone: "alvara", titulo: "O contrato da escola",
    telao: "Você escolhe a empresa da reforma da escola. A mais cara oferece 8 pontos para ser escolhida; com ela, o bem público perde um nível.",
    texto: "Você escolhe a empresa que vai reformar a escola. A mais cara oferece 8 pontos pessoais para ser a escolhida. Com ela, a obra custa o dobro e o bem público de todos perde um nível.",
    sim: "Escolheria a mais cara", nao: "Escolheria a mais barata", aceito: "A empresa mais cara foi escolhida: o bem público perdeu um nível.", recusado: "A empresa mais barata foi escolhida." },
];

// Ano 4 (opcional). tipo "dado": o Jogo da Mente; "honesto": ficar ou devolver; "confia": confiar antes de saber.
export const ANO4 = [
  { id: "dado", grupo: "honestidade", tipo: "dado", icone: "ideia", titulo: "O troco do mercado",
    telao: "Pense num número de 1 a 6, sem digitar. O celular rola o dado. Acertou? 3 pontos pessoais.",
    texto: "Pense num número de 1 a 6. Não digite. O celular vai rolar um dado. Se você acertar, ganha 3 pontos pessoais (não vão para a família)." },
  { id: "extrato", grupo: "honestidade", tipo: "honesto", icone: "participar", titulo: "O extrato a mais",
    telao: "O banco da vila errou e pôs 3 pontos a mais no seu placar. Ninguém vai conferir. Avisa ou fica?",
    texto: "O banco da vila errou e pôs 3 pontos pessoais a mais no seu placar. Ninguém vai conferir. Você avisa o banco ou fica com os 3?",
    sim: "Ficar com os 3", nao: "Avisar o banco" },
  { id: "achado", grupo: "honestidade", tipo: "honesto", icone: "economia", titulo: "O achado da praça",
    telao: "Você acha 3 pontos caídos na praça, sem nome. Entrega no achados e perdidos ou fica?",
    texto: "Você acha 3 pontos caídos na praça, sem nome de ninguém. Entrega no achados e perdidos da vila ou fica com eles?",
    sim: "Ficar com os 3", nao: "Entregar" },
  { id: "pedinte", grupo: "confianca", tipo: "confia", icone: "economia", titulo: "O pedido na estrada",
    telao: "Na estrada da vila, uma pessoa pede 2 pontos para comer. Você ajuda?",
    texto: "Na estrada da vila, uma pessoa pede 2 pontos para comer. Se ajudar, você perde 2 pontos pessoais. Só depois você descobre se era necessidade de verdade ou golpe.",
    sim: "Ajudar com 2", nao: "Não ajudar", bom: "Era necessidade de verdade: a sua ajuda chegou.", ruim: "Era golpe: alguém se passou por necessitado. Você perdeu os 2.",
    ganhoBom: -2 },
  { id: "fiado", grupo: "confianca", tipo: "confia", icone: "grupos", titulo: "A venda fiado",
    telao: "Um comprador bem de vida quer levar 2 pontos da sua madeira e pagar 4 na semana que vem. Você vende fiado?",
    texto: "Um comprador bem de vida quer levar madeira sua que vale 2 pontos e pagar 4 na semana que vem. Só depois você descobre se ele paga ou dá calote.",
    sim: "Vender fiado", nao: "Não vender", bom: "Ele pagou os 4: +2 para você.", ruim: "Calote: ele não pagou. Você perdeu os 2.", ganhoBom: 2 },
  { id: "sinal", grupo: "confianca", tipo: "confia", icone: "participar", titulo: "O sinal adiantado",
    telao: "Um comerciante vende uma ferramenta que rende 4. Pede 2 de sinal adiantado. Você paga?",
    texto: "Um comerciante da feira vende uma ferramenta que rende 4 pontos. Ele pede 2 pontos de sinal adiantado. Só depois você descobre se ele entrega ou some com o sinal.",
    sim: "Pagar o sinal", nao: "Não pagar", bom: "Ele entregou a ferramenta: +2 para você.", ruim: "Golpe: ele sumiu com o sinal. Você perdeu os 2.", ganhoBom: 2 },
  { id: "carroca", grupo: "confianca", tipo: "confia", icone: "grupos", titulo: "A carroça dividida",
    telao: "Um morador da vila vizinha propõe: cada um põe 2 numa carroça que rende 8, para dividir. Você entra?",
    texto: "Um morador da vila vizinha propõe: cada um põe 2 pontos numa carroça que rende 8, e vocês dividem. Só depois você descobre se ele cumpre o trato ou fica com tudo.",
    sim: "Entrar no trato", nao: "Não entrar", bom: "Ele cumpriu: +2 para você.", ruim: "Ele ficou com a carroça. Você perdeu os 2.", ganhoBom: 2 },
];

// Antes da revelação da confiança: "Quem você acha que mais dá golpe?" (o telão mostra só o total, com 5 ou mais respostas)
export const QUEM_GOLPE = ["Quem pede ajuda na rua", "Quem compra fiado", "Quem vende com sinal", "Quem propõe sociedade", "Todos do mesmo jeito"];
// Palpite de quantos aceitam (pequena e grande)
export const FAIXAS_PCT = ["Menos de 25%", "25% a 50%", "Mais de 50%"];
export const faixaDe = (p) => (p < 0.25 ? 0 : p <= 0.5 ? 1 : 2);

const POR_ID = Object.fromEntries([...PEQUENAS, ...GRANDES, ...ANO4].map((c) => [c.id, c]));
export const carta = (id) => POR_ID[id];

// Sorteio das cartas da partida, só a partir da semente (o mesmo código refaz a mesma partida).
// O ano 4 alterna entre honestidade e confiança; pequena e grande nunca atingem o mesmo alvo duas vezes seguidas por acaso:
// sorteia-se a grande entre as de alvo diferente do da pequena sempre que houver uma.
export function sortearCartas(r) {
  const pick = (xs) => xs[Math.floor(r() * xs.length)];
  const pequena = pick(PEQUENAS);
  const outras = GRANDES.filter((g) => g.alvo !== pequena.alvo);
  const grande = r() < 0.5 && outras.length ? pick(outras) : pick(GRANDES);
  const grupo = r() < 0.5 ? "honestidade" : "confianca";
  const ano4 = pick(ANO4.filter((c) => c.grupo === grupo));
  return { pequena: pequena.id, grande: grande.id, ano4: ano4.id };
}
