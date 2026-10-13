/* Service Worker do MOSAICO.

   Serve a dois propósitos, e recusa um terceiro de propósito.

   1. A mídia pesada fica no aparelho entre partidas. A abertura vertical
      tem 13,6 MB e era rebaixada a cada sessão: doze pessoas numa rede de
      celular puxavam ~165 MB antes da primeira cena. Vídeo, áudio e
      imagens passam a vir do cache quando já estiverem lá.

   2. Existir um handler de fetch é o que faz o Chrome no Android oferecer
      a instalação. No iPhone o caminho continua sendo "Adicionar à Tela de
      Início", que o manifest já cobre.

   O que este arquivo NÃO faz: servir HTML ou JavaScript do cache antes da
   rede. Num jogo publicado direto no GitHub Pages e corrigido entre
   playtests, um aparelho preso numa versão antiga durante uma sessão
   presencial é pior do que qualquer ganho de velocidade. Por isso código
   é sempre rede-primeiro, com o cache servindo apenas de rede de segurança
   quando a conexão cai. */

const VERSAO = "20260825-integridade";
const CACHE_MIDIA  = "mosaico-midia-" + VERSAO;
const CACHE_CODIGO = "mosaico-codigo-" + VERSAO;

const EH_MIDIA = /\.(mp4|mp3|jpg|jpeg|png|webp|woff2?)$/i;

self.addEventListener("install", () => {
  /* Sem pré-cache: baixar 24 MB de mídia na instalação seria pior do que o
     problema que este arquivo resolve. A mídia entra conforme é usada. */
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const nomes = await caches.keys();
    await Promise.all(nomes.map(n => {
      if (n !== CACHE_MIDIA && n !== CACHE_CODIGO) return caches.delete(n);
    }));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   /* Firebase e fontes passam direto */

  if (EH_MIDIA.test(url.pathname)) {
    /* Cache primeiro: estes arquivos não mudam sem trocar o ?v= */
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_MIDIA);
      const guardado = await cache.match(req, { ignoreSearch: false });
      if (guardado) return guardado;
      const resposta = await fetch(req);
      /* Respostas parciais (206) vêm de seek no vídeo e não podem ser
         guardadas: o cache devolveria um pedaço no lugar do arquivo. */
      if (resposta && resposta.ok && resposta.status === 200) {
        cache.put(req, resposta.clone());
      }
      return resposta;
    })());
    return;
  }

  /* Código e dados: rede primeiro, cache só se a rede falhar. */
  event.respondWith((async () => {
    try {
      const resposta = await fetch(req);
      if (resposta && resposta.ok) {
        const cache = await caches.open(CACHE_CODIGO);
        cache.put(req, resposta.clone());
      }
      return resposta;
    } catch (e) {
      const guardado = await caches.match(req);
      if (guardado) return guardado;
      throw e;
    }
  })());
});

/* Permite à página forçar a troca sem esperar o próximo carregamento. */
self.addEventListener("message", event => {
  if (event.data === "trocar-agora") self.skipWaiting();
});
