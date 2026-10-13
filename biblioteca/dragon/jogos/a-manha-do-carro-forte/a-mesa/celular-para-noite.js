/* MOSAICO · ponte Celular (Manhã) → Noite (Captura).
   ==========================================================================
   Continuidade de sessão: mesmo código de sala + pergunta congelada +
   handoff rico (fecho, hipótese, fragmentos revelados) para a Noite rica.
   Coleções no mesmo projeto mosaico-noite:
     Manhã  → mosaico/{sala}
     Noite  → noite/{sala}
   A ponte semeia noite/{sala} com partida.pergunta + partida.handoff e
   navega com ?from=celular&sala=&pergunta=. Solo/offline guarda o payload
   em sessionStorage para refresh/rejoin local.
   Economia Captura: deriveNoiteEconomy(handoff); baralho: seedCapturaDeck — ver README da Noite. */
(function () {
  const PERGUNTAS = ['peso', 'janela', 'roubo', 'antes', 'quem', 'proteger'];
  const FROM_CELULAR = 'celular';
  const HANDOFF_VERSION = 1;
  const HANDOFF_STORAGE_PREFIX = 'mosaico-carro-handoff:';
  const ECONOMIA_STANDALONE = { coins: 12, handSize: 3 };
  const ECONOMIA_PONTE_SEM_FECHO = { coins: 10, handSize: 3 };
  const MANHA_PARA_CAPTURA = {
    F01: 'F1', F02: 'F2', F03: 'F2', F04: 'F2', F05: 'F3', F06: 'F3',
    F07: 'F17', F08: 'F17', F09: 'F5', F10: 'F4', F11: 'F7', F12: 'F7',
    F13: 'F8', F14: 'F9', F15: 'F9', F16: 'F10', F17: 'F11', F18: 'F12',
    F19: 'F13', F20: 'F13', F21: 'F14', F22: 'F16', F23: 'F6', F24: 'F6',
    F25: 'F18', F26: 'F18', F27: 'F19', F28: 'F15', F29: 'F1', F30: 'F5',
  };
  const CAPTURA_ROTULOS = {
    F1: 'Antecipação interna', F2: 'Âncora 7h47', F3: 'Erro 17',
    F4: 'Contato preparado', F5: 'Zona cega', F6: 'Afastamento',
    F7: 'Duas etiquetas', F8: 'O saco vazio', F9: 'O peso',
    F10: 'Conferência de destino', F11: 'Saque de madrugada', F12: 'Origem do penhor',
    F13: 'Consolidação duplicada', F14: 'Assinatura sem contagem',
    F15: 'Convocação da Auditoria', F16: 'Trajeto do malote', F17: 'Chave 17-B',
    F18: 'Pasta azul', F19: 'Protocolo do Cliente',
  };
  const CUSTOS_CAPTURA = { arriscar: 3, capturar: 2, comprar: 4 };
  const CFG = {
    apiKey: 'AIzaSyA160bkgHBrYBwvIxlENax-aAyLWPMaOU4',
    authDomain: 'mosaico-noite.firebaseapp.com',
    projectId: 'mosaico-noite',
    storageBucket: 'mosaico-noite.firebasestorage.app',
    messagingSenderId: '703343424116',
    appId: '1:703343424116:web:e6990b5c00d43aca6e9721',
  };

  const normalizeSala = (raw) => {
    const s = String(raw ?? '')
      .trim()
      .toUpperCase();
    return /^[A-Z2-9]{6}$/.test(s) ? s : '';
  };
  const normalizePergunta = (raw) => {
    const id = String(raw ?? '')
      .trim()
      .toLowerCase();
    return PERGUNTAS.includes(id) ? id : '';
  };

  function clampInt(n, min, max, fallback) {
    const v = Number(n);
    if (!Number.isFinite(v)) return fallback;
    return Math.max(min, Math.min(max, Math.round(v)));
  }
  function limparIds(lista, max = 24) {
    if (!Array.isArray(lista)) return [];
    const out = [];
    const seen = new Set();
    for (const raw of lista) {
      const id = String(raw ?? '')
        .trim()
        .toUpperCase();
      if (!/^F\d{2}$/.test(id) || seen.has(id)) continue;
      seen.add(id);
      out.push(id);
      if (out.length >= max) break;
    }
    return out;
  }
  function limparNomes(lista, max = 8) {
    if (!Array.isArray(lista)) return [];
    return lista
      .map((n) =>
        String(n ?? '')
          .trim()
          .slice(0, 40),
      )
      .filter(Boolean)
      .slice(0, max);
  }
  function normalizeFecho(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const total = clampInt(raw.total, 0, 100, NaN);
    if (!Number.isFinite(total)) return null;
    return {
      total,
      campos: clampInt(raw.campos, 0, 45, 0),
      hipotese: clampInt(raw.hipotese, 0, 15, 0),
      relacoes: clampInt(raw.relacoes, 0, 20, 0),
      leitura: clampInt(raw.leitura, 0, 10, 0),
      sensorial: clampInt(raw.sensorial, 0, 10, 0),
      revisao: clampInt(raw.revisao, 0, 5, 0),
      acertos: clampInt(raw.acertos, 0, 12, 0),
    };
  }

  function buildHandoffPayload(input = {}) {
    const pergunta = normalizePergunta(input.pergunta);
    if (!pergunta) throw new Error('pergunta inválida para o handoff');
    const sala = normalizeSala(input.sala);
    const fecho = normalizeFecho(input.fecho);
    const jogadores = clampInt(input.jogadores, 0, 12, 0); /* 11/10/2026: até 12 (era 8) */
    /* 11/10/2026 (Tarefa 4): a variação da solução da manhã atravessa para a Noite */
    const variacao = /^v\d{2}$/.test(String(input.variacao || '')) ? String(input.variacao) : null;
    const hipoteseFinal = String(input.hipoteseFinal ?? '')
      .trim()
      .toUpperCase();
    const hipoteseProv = String(input.hipoteseProv ?? '')
      .trim()
      .toUpperCase();
    return {
      v: HANDOFF_VERSION,
      from: FROM_CELULAR,
      pergunta,
      ...(sala ? { sala } : {}),
      ...(jogadores >= 2 ? { jogadores } : {}),
      nomes: limparNomes(input.nomes),
      fecho,
      hipoteseFinal: /^H([1-9]|10)$/.test(hipoteseFinal) ? hipoteseFinal : null,
      hipoteseProv: /^H([1-9]|10)$/.test(hipoteseProv) ? hipoteseProv : null,
      fragmentosRevelados: limparIds(input.fragmentosRevelados),
      ...(variacao ? { variacao } : {}),
      emMs: Number(input.emMs) || Date.now(),
    };
  }

  function normalizeHandoff(raw) {
    if (!raw || typeof raw !== 'object') return null;
    try {
      return buildHandoffPayload(raw);
    } catch {
      return null;
    }
  }

  function deriveNoiteEconomy(handoff, opts = {}) {
    const fromCelular =
      opts.fromCelular === true || handoff?.from === FROM_CELULAR || !!normalizeHandoff(handoff);
    if (!fromCelular) {
      return { ...ECONOMIA_STANDALONE, source: 'standalone', rule: 'standalone-experimental-12/3' };
    }
    const h = normalizeHandoff(handoff);
    const fecho = h?.fecho;
    if (!fecho) {
      return {
        ...ECONOMIA_PONTE_SEM_FECHO,
        source: 'celular-sem-fecho',
        rule: 'ponte-fair-seed-10/3',
      };
    }
    const coins = Math.max(9, Math.min(13, 9 + Math.floor(fecho.total / 25)));
    const handSize = fecho.total < 40 ? 2 : 3;
    return {
      coins,
      handSize,
      source: 'celular-fecho',
      rule: 'v1.1-9+floor(total/25)_hand-2se<40',
      fechoTotal: fecho.total,
    };
  }

  function mapFragmentosManhaParaCaptura(manhaIds) {
    const out = [];
    const seen = new Set();
    for (const raw of limparIds(manhaIds)) {
      const cap = MANHA_PARA_CAPTURA[raw];
      if (!cap || seen.has(cap)) continue;
      seen.add(cap);
      out.push(cap);
    }
    return out;
  }

  function shuffleCopy(list, rnd) {
    const a = list.slice();
    const r = typeof rnd === 'function' ? rnd : Math.random;
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  /** Prioriza no baralho Captura os Fx mapeados dos Fxx revelados na Manhã. */
  function seedCapturaDeck(opts = {}) {
    const allIds = Array.isArray(opts.allIds) ? opts.allIds.map(String) : [];
    const fromCelular =
      opts.fromCelular === true ||
      opts.handoff?.from === FROM_CELULAR ||
      !!normalizeHandoff(opts.handoff);
    const rnd = opts.rnd;
    if (!fromCelular) {
      return {
        deck: shuffleCopy(allIds, rnd),
        seededIds: [],
        seededLabels: [],
        source: 'standalone-default',
      };
    }
    const h = normalizeHandoff(opts.handoff);
    /* 11/10/2026: com variação, o baralho da Noite é o da própria manhã (F01…F31) e os ids
       revelados entram como estão, sem o mapa para o baralho antigo de 19 cartas. */
    const mesmoBaralho = allIds.indexOf('F01') >= 0;
    const preferred = (mesmoBaralho ? limparIds(h && h.fragmentosRevelados) : mapFragmentosManhaParaCaptura(h && h.fragmentosRevelados)).filter(function (id) {
      return allIds.indexOf(id) >= 0;
    });
    if (!preferred.length) {
      return {
        deck: shuffleCopy(allIds, rnd),
        seededIds: [],
        seededLabels: [],
        source: 'celular-sem-fragmentos',
      };
    }
    const preferSet = {};
    preferred.forEach(function (id) { preferSet[id] = true; });
    const rest = allIds.filter(function (id) { return !preferSet[id]; });
    const deck = shuffleCopy(preferred, rnd).concat(shuffleCopy(rest, rnd));
    const seededLabels = preferred.map(function (id) { return CAPTURA_ROTULOS[id] || id; });
    return {
      deck: deck,
      seededIds: preferred.slice(),
      seededLabels: seededLabels,
      source: 'handoff-fragmentos',
    };
  }

  function continuityBannerText(handoff, bits = {}) {
    const h = normalizeHandoff(handoff);
    const sala = normalizeSala(bits.sala || h?.sala);
    const pergunta = normalizePergunta(bits.pergunta || h?.pergunta);
    const parts = ['Continuação da manhã'];
    if (sala) parts.push('sala ' + sala);
    if (pergunta) parts.push('pergunta «' + pergunta + '»');
    if (h?.hipoteseFinal) parts.push('hipótese ' + h.hipoteseFinal);
    if (h?.fecho) parts.push('fecho ' + h.fecho.total + '/100');
    if (h?.fragmentosRevelados?.length)
      parts.push(h.fragmentosRevelados.length + ' fragmentos revelados');
    const seeded = mapFragmentosManhaParaCaptura(h && h.fragmentosRevelados);
    if (seeded.length) {
      const labels = seeded
        .slice(0, 3)
        .map(function (id) { return CAPTURA_ROTULOS[id] || id; })
        .join(', ');
      parts.push(
        'Captura prioriza ' +
          seeded.length +
          (seeded.length === 1 ? ' evidência' : ' evidências') +
          ' (' +
          labels +
          (seeded.length > 3 ? '…' : '') +
          ')',
      );
    }
    const eco = deriveNoiteEconomy(h || { from: FROM_CELULAR, pergunta: pergunta || 'peso' }, {
      fromCelular: true,
    });
    parts.push('Captura inicia com ' + eco.coins + ' moedas e ' + eco.handSize + ' fragmentos');
    return parts.join(' · ') + '.';
  }

  function handoffStorageKey({ sala, pergunta } = {}) {
    const code = normalizeSala(sala) || 'SOLO';
    const id = normalizePergunta(pergunta) || 'pauta';
    return HANDOFF_STORAGE_PREFIX + code + ':' + id;
  }

  function persistHandoffLocal(payload) {
    const h = normalizeHandoff(payload);
    if (!h) return null;
    try {
      sessionStorage.setItem(handoffStorageKey(h), JSON.stringify(h));
    } catch (e) {
      console.warn('MOSAICO: não consegui guardar o handoff localmente.', e);
    }
    return h;
  }

  function readHandoffLocal({ sala, pergunta } = {}) {
    try {
      const raw = sessionStorage.getItem(handoffStorageKey({ sala, pergunta }));
      if (!raw) return null;
      return normalizeHandoff(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  function parseHandoffSearch(search) {
    const p = new URLSearchParams(String(search || location.search || '').replace(/^\?/, ''));
    return {
      fromCelular: p.get('from') === 'celular',
      sala: normalizeSala(p.get('sala')),
      pergunta: normalizePergunta(p.get('pergunta')),
      variacao: /^v\d{2}$/.test(String(p.get('var') || '')) ? String(p.get('var')) : null,
    };
  }

  function buildNoiteHandoffUrl(opts = {}) {
    const base = String(opts.base || '../../../jogos/a-manha-do-carro-forte/a-noite/').replace(/\?.*$/, '');
    const withSlash = base.endsWith('/') ? base : base + '/';
    const q = new URLSearchParams();
    if (opts.fromCelular !== false) q.set('from', 'celular');
    const sala = normalizeSala(opts.sala);
    const pergunta = normalizePergunta(opts.pergunta);
    if (sala) q.set('sala', sala);
    if (pergunta) q.set('pergunta', pergunta);
    if (/^v\d{2}$/.test(String(opts.variacao || ''))) q.set('var', String(opts.variacao));
    const qs = q.toString();
    return qs ? withSlash + '?' + qs : withSlash;
  }

  let api = null;
  async function firebase() {
    if (api) return api;
    const [appmod, authmod, fs] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js'),
    ]);
    const app =
      appmod.getApps().find((a) => a.name === 'dragon-noite') ||
      appmod.getApps().find((a) => a.options && a.options.projectId === 'mosaico-noite') ||
      appmod.initializeApp(CFG, 'dragon-ponte-noite');
    const auth = authmod.getAuth(app);
    if (!auth.currentUser) await authmod.signInAnonymously(auth);
    api = { fs, db: fs.getFirestore(app), auth };
    return api;
  }

  /* Semeia noite/{sala} com pergunta + handoff. Idempotente na pergunta;
     handoff novo atualiza o pacote de continuidade.
     CREATE exige fase=='sala' (firestore.rules); depois o Mestre avança para
     'jogo' e anexa o handoff em partida.handoff — sem lobby extra na Manhã. */
  async function seedNoiteRoom({ sala, pergunta, jogadores, handoff } = {}) {
    const code = normalizeSala(sala);
    const id = normalizePergunta(pergunta);
    if (!code || !id) return { ok: false, reason: 'params' };
    const payload =
      normalizeHandoff({ ...(handoff || {}), pergunta: id, sala: code, jogadores }) ||
      buildHandoffPayload({ pergunta: id, sala: code, jogadores });
    persistHandoffLocal(payload);
    const { fs, db, auth } = await firebase();
    const u = auth.currentUser;
    if (!u || u.isAnonymous)
      return { ok: false, reason: 'mestre', message: 'Só o Mestre autenticado abre a ponte na sala.', handoff: payload };
    const ref = fs.doc(db, 'noite', code);
    const snap = await fs.getDoc(ref);
    const data = snap.exists() ? snap.data() : null;
    const perguntaFinal = normalizePergunta(data?.partida?.pergunta) || id;
    const n = Math.max(
      0,
      Math.min(12, Number(jogadores) || Number(payload.jogadores) || Number(data?.partida?.jogadores) || 0),
    );
    const continuidade = {
      from: 'celular',
      emMs: Date.now(),
      v: payload.v,
      hipoteseFinal: payload.hipoteseFinal,
      fechoTotal: payload.fecho?.total ?? null,
    };
    const handoffDoc = { ...payload, pergunta: perguntaFinal };
    const partidaBase = {
      pergunta: perguntaFinal,
      origem: 'celular',
      continuidade,
      handoff: handoffDoc,
      atualizadaEmMs: Date.now(),
      ...(n >= 2 ? { jogadores: n } : {}),
      ...(payload.variacao ? { variacao: payload.variacao } : {}),
    };
    if (!snap.exists()) {
      /* 1) create permitido só com fase:'sala' + ativa + mestreUid. */
      await fs.setDoc(ref, {
        ativa: true,
        fase: 'sala',
        mestreUid: u.uid,
        criadaEmMs: Date.now(),
        modo: 'sem-telao',
        ritmo: 'automatico',
        caseId: 'carro-forte',
        partida: partidaBase,
      });
      /* 2) Mestre avança para jogo; handoff já está em partida.handoff. */
      await fs.updateDoc(ref, { fase: 'jogo' });
    } else {
      const patch = {
        ativa: true,
        caseId: 'carro-forte',
        'partida.pergunta': perguntaFinal,
        'partida.origem': 'celular',
        'partida.continuidade': continuidade,
        'partida.handoff': handoffDoc,
        'partida.atualizadaEmMs': Date.now(),
      };
      if (n >= 2) patch['partida.jogadores'] = n;
      if (payload.variacao) patch['partida.variacao'] = payload.variacao;
      if (data?.fase !== 'jogo') patch.fase = 'jogo';
      await fs.updateDoc(ref, patch);
    }
    try {
      await fs.updateDoc(fs.doc(db, 'mosaico', code), {
        'partida.ponteNoite': {
          pergunta: perguntaFinal,
          emMs: Date.now(),
          handoffV: payload.v,
          fechoTotal: payload.fecho?.total ?? null,
          alvo: 'noite',
        },
      });
    } catch (e) {
      console.warn('MOSAICO: ponte marcada na Noite; marcador na Manhã falhou.', e);
    }
    return { ok: true, sala: code, pergunta: perguntaFinal, handoff: payload };
  }

  async function goToNoite({ sala, pergunta, jogadores, base, handoff } = {}) {
    const code = normalizeSala(sala || window.MOSAICO_ROOM?.code || '');
    const id = normalizePergunta(pergunta);
    let payload = null;
    try {
      payload = buildHandoffPayload({
        ...(handoff || {}),
        pergunta: id || handoff?.pergunta,
        sala: code || handoff?.sala,
        jogadores: jogadores || handoff?.jogadores,
      });
      persistHandoffLocal(payload);
    } catch (e) {
      console.warn('MOSAICO: handoff incompleto; seguindo só com URL.', e);
    }
    const url = buildNoiteHandoffUrl({
      base: base || '../../../jogos/a-manha-do-carro-forte/a-noite/',
      sala: code,
      pergunta: id,
      fromCelular: true,
      variacao: payload?.variacao || handoff?.variacao,
    });
    if (code && id && window.MOSAICO_ROOM?.role === 'master') {
      try {
        const r = await seedNoiteRoom({ sala: code, pergunta: id, jogadores, handoff: payload });
        if (!r.ok && r.reason === 'mestre') {
          console.warn('MOSAICO: ponte sem seed de Mestre; abrindo Noite assim mesmo.', r);
        }
      } catch (e) {
        console.error('MOSAICO: falha ao semear a sala da Noite; abrindo o link mesmo assim.', e);
      }
    }
    location.href = url;
  }

  /** Resolve handoff para a Noite: room doc → sessionStorage → URL mínima. */
  function resolveHandoff(opts = {}) {
    const search = parseHandoffSearch(opts.search || location.search);
    const fromRoom = normalizeHandoff(
      opts.roomHandoff ||
        window.MOSAICO_ROOM?.room?.partida?.handoff ||
        window.MosaicoSalaPartida?.handoff,
    );
    if (fromRoom) return fromRoom;
    const fromLocal = readHandoffLocal({
      sala: search.sala || opts.sala,
      pergunta: search.pergunta || opts.pergunta,
    });
    if (fromLocal) return fromLocal;
    if (search.fromCelular && search.pergunta) {
      try {
        return buildHandoffPayload({
          pergunta: search.pergunta,
          sala: search.sala,
        });
      } catch {
        return null;
      }
    }
    return null;
  }

  window.MosaicoCelularParaNoite = {
    PERGUNTAS,
    HANDOFF_VERSION,
    ECONOMIA_STANDALONE,
    ECONOMIA_PONTE_SEM_FECHO,
    MANHA_PARA_CAPTURA,
    CAPTURA_ROTULOS,
    CUSTOS_CAPTURA,
    normalizeSala,
    normalizePergunta,
    normalizeFecho,
    normalizeHandoff,
    buildHandoffPayload,
    parseHandoffSearch,
    buildNoiteHandoffUrl,
    handoffStorageKey,
    persistHandoffLocal,
    readHandoffLocal,
    resolveHandoff,
    deriveNoiteEconomy,
    mapFragmentosManhaParaCaptura,
    seedCapturaDeck,
    continuityBannerText,
    seedNoiteRoom,
    goToNoite,
  };
})();
