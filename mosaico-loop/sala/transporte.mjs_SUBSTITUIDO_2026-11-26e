// Loop · sala do Mestre: três transportes com a mesma forma.
//   transporteReal(DragonSala)  → jogador e Mestre, pela sala aberta pelo firebase-room.js (projeto mosaico-loop)
//   transporteTelao(codigo)     → telão: só lê a mesma sala e marca presença
//   transporteFalso(...)        → simulador: sala de mentira no localStorage, sem rede
// Forma: { real, uid, papel, codigo, sala, jogadores, agora(), carimbo(), atualizarSala(c), atualizarEu(c), aoMudar(cb), sincronizar() }
// O jogo e o telão só falam com esta forma, por isso o mesmo código roda na sala de verdade e no simulador.

const SDK = 'https://www.gstatic.com/firebasejs/12.17.1';
export const RAIZ = 'mosaico';
// Chave pública por desenho: quem protege a sala é o login do Mestre e as regras do Firestore (firebase-loop/firestore.rules).
export const CONFIG = {
  apiKey: 'AIzaSyABQnyO_Qze1eDgLSPxB6mxiTQaRJF9uOI',
  authDomain: 'mosaico-loop.firebaseapp.com',
  projectId: 'mosaico-loop',
  storageBucket: 'mosaico-loop.firebasestorage.app',
  messagingSenderId: '872568801702',
  appId: '1:872568801702:web:f89a9908a1bd7edc7b6767'
};

/** Instante em milissegundos, venha como Timestamp do Firestore ou como número. */
export const ms = (t) => (t && typeof t.toMillis === 'function' ? t.toMillis() : typeof t === 'number' ? t : null);

// ---------------------------------------------------------------- relógio: hora do servidor, não a do aparelho
async function relogioDoServidor(fs, db, codigo, uid) {
  const ref = fs.doc(db, RAIZ, codigo, 'relogios', uid);
  const antes = performance.now();
  await fs.setDoc(ref, { time: fs.serverTimestamp() });
  const depois = performance.now();
  const amostra = await fs.getDocFromServer(ref);
  return amostra.data().time.toMillis() - (antes + depois) / 2;   // hora do servidor menos performance.now()
}

// ---------------------------------------------------------------- jogador e Mestre (firebase-room.js)
export async function transporteReal(DS) {
  const fs = await import(`${SDK}/firebase-firestore.js`);
  let base = Date.now() - performance.now();
  const t = {
    real: true,
    get uid() { return DS.uid; },
    get papel() { return DS.papel; },
    get codigo() { return DS.codigo; },
    get sala() { return DS.sala; },
    get jogadores() { return DS.jogadores; },
    agora: () => performance.now() + base,
    carimbo: () => fs.serverTimestamp(),
    atualizarSala: (c) => DS.atualizarSala(c),
    atualizarEu: (c) => DS.atualizarEu(c),
    atualizarJogador: (id, c) => DS.atualizarJogador(id, c),
    aoMudar: (cb) => DS.aoMudar(cb),
    async sincronizar() { base = await relogioDoServidor(fs, DS.db, DS.codigo, DS.uid); }
  };
  return t;
}

// ---------------------------------------------------------------- telão: lê e marca presença
export async function transporteTelao(codigo) {
  const [appM, authM, fs] = await Promise.all([
    import(`${SDK}/firebase-app.js`), import(`${SDK}/firebase-auth.js`), import(`${SDK}/firebase-firestore.js`)
  ]);
  const app = appM.getApps().find((a) => a.name === 'cinco-telao') || appM.initializeApp(CONFIG, 'cinco-telao');
  const auth = authM.getAuth(app), db = fs.getFirestore(app);
  await auth.authStateReady();
  if (!auth.currentUser) await authM.signInAnonymously(auth);
  const uid = auth.currentUser.uid;
  let sala = null, jogadores = [], base = Date.now() - performance.now();
  const ouvintes = [];
  const avisar = () => ouvintes.forEach((f) => { try { f(sala, jogadores); } catch (e) { console.warn(e); } });
  let primeira;
  const pronta = new Promise((r) => { primeira = r; });
  fs.onSnapshot(fs.doc(db, RAIZ, codigo), (s) => { sala = s.exists() ? s.data() : null; primeira(); avisar(); }, (e) => { sala = null; primeira(); console.warn('telão: sala', e); avisar(); });
  fs.onSnapshot(fs.collection(db, RAIZ, codigo, 'jogadores'), (s) => {
    jogadores = s.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.entrouMs || 0) - (b.entrouMs || 0));
    avisar();
  }, (e) => console.warn('telão: jogadores', e));
  const presenca = () => fs.setDoc(fs.doc(db, RAIZ, codigo, 'telao', uid), { vistoEmMs: Date.now(), status: 'ready' }, { merge: true }).catch(() => {});
  presenca(); setInterval(presenca, 10000);
  await pronta;
  return {
    real: true, uid, papel: 'telao', codigo,
    get sala() { return sala; },
    get jogadores() { return jogadores; },
    agora: () => performance.now() + base,
    aoMudar: (cb) => ouvintes.push(cb),
    async sincronizar() { base = await relogioDoServidor(fs, db, codigo, uid); }
  };
}

// ---------------------------------------------------------------- simulador: sala de mentira entre abas e quadros
export function transporteFalso({ codigo = 'SIMUL', papel = 'guest', uid, nome = 'Participante' }) {
  const K = (k) => `CINCOF:${codigo}:${k}`;
  const ler = (k) => { try { return JSON.parse(localStorage.getItem(K(k))); } catch { return null; } };
  const gravar = (k, v) => localStorage.setItem(K(k), JSON.stringify(v));
  const meu = uid || 'u' + Math.random().toString(36).slice(2, 9);
  const ouvintes = [];
  let ultimo = '';
  const sala = () => ler('sala');
  const jogadores = () => Object.entries(ler('jogadores') || {}).map(([id, d]) => ({ id, ...d })).sort((a, b) => (a.entrouMs || 0) - (b.entrouMs || 0));
  const olhar = () => {
    const bruto = (localStorage.getItem(K('sala')) || '') + '|' + (localStorage.getItem(K('jogadores')) || '');
    if (bruto === ultimo) return;
    ultimo = bruto;
    ouvintes.forEach((f) => { try { f(sala(), jogadores()); } catch (e) { console.warn(e); } });
  };
  const eu = (campos) => { const todos = ler('jogadores') || {}; todos[meu] = { ...(todos[meu] || {}), ...campos, atualizadoEmMs: Date.now() }; gravar('jogadores', todos); olhar(); };
  if (papel === 'master' && !sala()) gravar('sala', { ativa: true, fase: 'sala', mestreUid: meu, criadaEmMs: Date.now() });
  if (papel !== 'telao' && !(ler('jogadores') || {})[meu]) eu({ nome, mestre: papel === 'master', entrouMs: Date.now(), pronto: true });
  setInterval(olhar, 150);
  window.addEventListener('storage', olhar);
  return {
    real: false, uid: meu, papel, codigo,
    get sala() { return sala(); },
    get jogadores() { return jogadores(); },
    agora: () => Date.now(),
    carimbo: () => Date.now(),
    atualizarSala: async (c) => { gravar('sala', { ...(sala() || {}), ...c }); olhar(); return true; },
    atualizarEu: async (c) => { eu(c); return true; },
    atualizarJogador: async (id, c) => { const todos = ler('jogadores') || {}; if (!todos[id]) return false; todos[id] = { ...todos[id], ...c, atualizadoEmMs: Date.now() }; gravar('jogadores', todos); olhar(); return true; },
    aoMudar: (cb) => ouvintes.push(cb),
    async sincronizar() {}
  };
}

/** Apaga a sala de mentira (usado pelo botão "Recomeçar" do simulador). */
export function limparSalaFalsa(codigo = 'SIMUL') {
  const p = `CINCOF:${codigo}:`;
  for (const k of Object.keys(localStorage)) if (k.startsWith(p)) localStorage.removeItem(k);
}
