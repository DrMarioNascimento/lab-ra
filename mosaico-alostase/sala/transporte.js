// Sala ao vivo do Mosaico Alostase (cópia própria do transporte da Vila Ética), no mesmo desenho do Comitê de Ética: o "cérebro" do jogo roda no aparelho do professor;
// alunos e telão só leem o que ele publica e mandam pedidos. Usa o projeto Firebase do Comitê (as regras
// de salas/pub/pedidos/respostas/presenca já servem a qualquer jogo) e a lista de mestres dele.
// A chave abaixo é pública por desenho: a proteção vem do login e das regras do Firestore.
// Para testar sem rede: localStorage.setItem('SALA_FALSA', '1') troca o Firestore por um banco local entre abas.

const VERSAO_FIREBASE = '12.17.1';
const CONFIG = {
  apiKey: 'AIzaSyBRgILqLlVwm613G9F_3FhkvGN5QhhEvAw',
  authDomain: 'comite-etica-3cfdd.firebaseapp.com',
  projectId: 'comite-etica-3cfdd',
  storageBucket: 'comite-etica-3cfdd.firebasestorage.app',
  messagingSenderId: '648675086125',
  appId: '1:648675086125:web:406f431e2ee8d622c20da4'
};

export const normalizar = (c) => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
export const gerarCodigo = () => {
  const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // sem 0/O/1/I, para ler no telão
  let s = ''; for (let i = 0; i < 5; i++) s += L[Math.floor(Math.random() * L.length)];
  return s;
};
const falsa = () => { try { return localStorage.getItem('SALA_FALSA') === '1'; } catch { return false; } };

let banco = null;

// ---------------------------------------------------------------- banco real (Firestore)
async function bancoReal() {
  const base = `https://www.gstatic.com/firebasejs/${VERSAO_FIREBASE}`;
  const [{ initializeApp }, fs, au] = await Promise.all([
    import(`${base}/firebase-app.js`), import(`${base}/firebase-firestore.js`), import(`${base}/firebase-auth.js`)
  ]);
  const app = initializeApp(CONFIG, 'sala-mosaico');
  // long polling: redes de universidade e alguns roteadores bloqueiam o canal padrão do Firestore
  const db = fs.initializeFirestore(app, { experimentalAutoDetectLongPolling: true, ignoreUndefinedProperties: true });
  const auth = au.getAuth(app);
  const ref = (caminho) => fs.doc(db, ...caminho.split('/'));
  const ehGoogle = (u) => !!(u && !u.isAnonymous && u.providerData.some((p) => p.providerId === 'google.com'));
  return {
    real: true,
    async identificar() {
      await auth.authStateReady();
      if (!auth.currentUser) await au.signInAnonymously(auth);
      return auth.currentUser.uid;
    },
    // abre a janela do Google direto no toque, sem await antes (o Safari do iPhone bloqueia a janela se houver)
    entrarGoogleNoToque() {
      if (ehGoogle(auth.currentUser)) return Promise.resolve({ uid: auth.currentUser.uid, email: auth.currentUser.email, nome: auth.currentUser.displayName });
      return au.signInWithPopup(auth, new au.GoogleAuthProvider()).then((r) => ({ uid: r.user.uid, email: r.user.email, nome: r.user.displayName }));
    },
    async usuario() { await auth.authStateReady(); const u = auth.currentUser; return ehGoogle(u) ? { uid: u.uid, email: u.email, nome: u.displayName } : null; },
    async sair() { await au.signOut(auth).catch(() => {}); },
    async ehMestre(email) {
      try {
        const s = await fs.getDoc(ref('config/mestres'));
        return (s.data()?.emails ?? []).map((e) => String(e).toLowerCase().trim()).includes(String(email || '').toLowerCase());
      } catch { return false; }
    },
    async ler(caminho) { const s = await fs.getDoc(ref(caminho)); return s.exists() ? s.data() : null; },
    async gravar(caminho, dados) { await fs.setDoc(ref(caminho), dados); },
    async criar(caminho, dados) { await fs.setDoc(ref(caminho), dados); },
    async atualizar(caminho, dados) { await fs.updateDoc(ref(caminho), dados); },
    async apagar(caminho) { await fs.deleteDoc(ref(caminho)); },
    async adicionar(colecao, dados) { const r = await fs.addDoc(fs.collection(db, ...colecao.split('/')), dados); return r.id; },
    agora: () => fs.serverTimestamp(),
    ouvir(caminho, cb, erro) { return fs.onSnapshot(ref(caminho), (s) => cb(s.exists() ? s.data() : null), (e) => erro && erro(e)); },
    ouvirNovos(colecao, cb, erro) {
      return fs.onSnapshot(fs.collection(db, ...colecao.split('/')), (s) => s.docChanges().forEach((m) => { if (m.type === 'added') cb(m.doc.id, m.doc.data()); }), (e) => erro && erro(e));
    }
  };
}

// ---------------------------------------------------------------- banco de teste (localStorage entre abas)
function bancoFalso() {
  const P = 'SF:';
  const ler = (k) => { try { return JSON.parse(localStorage.getItem(P + k)); } catch { return null; } };
  const gravarLocal = (k, v) => localStorage.setItem(P + k, JSON.stringify(v));
  const ouvintes = [];
  const quem = (() => { let u = sessionStorage.getItem('SF_UID'); if (!u) { u = 'u' + Math.random().toString(36).slice(2, 10); sessionStorage.setItem('SF_UID', u); } return u; })();
  setInterval(() => ouvintes.forEach((f) => f()), 120);
  return {
    real: false,
    async identificar() { return quem; },
    async entrarGoogleNoToque() { sessionStorage.setItem('SF_PROF', '1'); return { uid: quem, email: 'prof@teste', nome: 'Professor de teste' }; },
    async usuario() { return sessionStorage.getItem('SF_PROF') ? { uid: quem, email: 'prof@teste', nome: 'Professor de teste' } : null; },
    async sair() { sessionStorage.removeItem('SF_PROF'); },
    async ehMestre() { return true; },
    async ler(c) { return ler(c); },
    async gravar(c, d) { gravarLocal(c, d); },
    async criar(c, d) { gravarLocal(c, d); },
    async atualizar(c, d) { gravarLocal(c, { ...(ler(c) || {}), ...d }); },
    async apagar(c) { localStorage.removeItem(P + c); },
    async adicionar(col, d) { const id = Math.random().toString(36).slice(2, 12); gravarLocal(col + '/' + id, d); return id; },
    agora: () => Date.now(),
    ouvir(c, cb) { let ult; const f = () => { const t = localStorage.getItem(P + c); if (t !== ult) { ult = t; cb(t ? JSON.parse(t) : null); } }; ouvintes.push(f); f(); return () => ouvintes.splice(ouvintes.indexOf(f), 1); },
    ouvirNovos(col, cb) {
      const vistos = new Set();
      const f = () => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(P + col + '/')) { const id = k.slice((P + col + '/').length); if (!vistos.has(id)) { vistos.add(id); cb(id, JSON.parse(localStorage.getItem(k))); } } } };
      ouvintes.push(f); f(); return () => ouvintes.splice(ouvintes.indexOf(f), 1);
    }
  };
}

export async function conectar() {
  if (!banco) banco = falsa() ? bancoFalso() : await bancoReal();
  return banco;
}

// ---------------------------------------------------------------- professor (anfitrião)
const PUB_MIN_MS = 250;
const ACOES_DO_ALUNO = new Set(['responder']);

export async function abrirSala(jogo, aoEntrar, aoAcao) {
  const b = await conectar();
  const uid = await b.identificar();
  let codigo = null;
  for (let i = 0; i < 8; i++) { const c = gerarCodigo(); if (!(await b.ler('salas/' + c))) { codigo = c; break; } }
  if (!codigo) throw new Error('Não consegui um código livre. Tente de novo.');
  await b.criar('salas/' + codigo, { dono: uid, jogo, info: JSON.stringify({ jogo, liberada: true }), criadaEm: b.agora() });
  return ligarAnfitriao(b, codigo, uid, aoEntrar, aoAcao);
}

export async function retomarSala(codigo, aoEntrar, aoAcao) {
  const b = await conectar();
  const uid = await b.identificar();
  const s = await b.ler('salas/' + codigo);
  if (!s || s.dono !== uid) throw new Error('Esta sala não é sua ou já não existe.');
  return ligarAnfitriao(b, codigo, uid, aoEntrar, aoAcao);
}

function ligarAnfitriao(b, codigo, uid, aoEntrar, aoAcao) {
  let guardado = []; try { guardado = JSON.parse(localStorage.getItem('SALA-MAPA-' + codigo) || '[]'); } catch {}
  const mapa = new Map(guardado);   // uid do aluno → id no jogo (guardado no aparelho, para o professor poder recarregar a página)
  const processados = new Set();
  let ultimo = '', ultimoEm = 0, timer = 0, pendente = null;
  const desligar = [];
  const responder = (pedido, resp, uidAluno) => b.gravar(`salas/${codigo}/respostas/${pedido}`, { uid: uidAluno, ok: !!resp.ok, erro: resp.erro || '', j: JSON.stringify(resp.dados || {}) }).catch(() => {});
  desligar.push(b.ouvirNovos(`salas/${codigo}/pedidos`, async (id, p) => {
    if (processados.has(id)) return; processados.add(id);
    try {
      const j = JSON.parse(p.j || '{}');
      if (p.tipo === 'entrar') {
        let idJogo = mapa.get(p.uid);
        if (!idJogo) { const r = aoEntrar(String(j.nome || '').trim().slice(0, 24), p.uid); if (!r || !r.ok) { await responder(id, { ok: false, erro: (r && r.erro) || 'A entrada não está liberada.' }, p.uid); return; } idJogo = r.id; mapa.set(p.uid, idJogo); try { localStorage.setItem('SALA-MAPA-' + codigo, JSON.stringify([...mapa])); } catch {} }
        await responder(id, { ok: true, dados: { id: idJogo } }, p.uid);
      } else if (p.tipo === 'aluno') {
        const idJogo = mapa.get(p.uid);
        const a = j.a;
        if (idJogo && a && typeof a === 'object' && ACOES_DO_ALUNO.has(a.t)) { if ('id' in a) a.id = idJogo; aoAcao(a, idJogo); }
      }
    } catch { /* pedido malformado: ignora */ }
    b.apagar(`salas/${codigo}/pedidos/${id}`).catch(() => {});
  }));
  const gravar = () => { timer = 0; if (pendente == null) return; const j = pendente; pendente = null; ultimo = j; ultimoEm = Date.now(); b.gravar(`salas/${codigo}/pub/estado`, { j, em: b.agora() }).catch(() => {}); };
  return {
    codigo, uid,
    publicar(estado) {
      const j = JSON.stringify(estado);
      if (j === ultimo || j === pendente) return;
      pendente = j;
      const espera = Math.max(0, PUB_MIN_MS - (Date.now() - ultimoEm));
      if (!timer) timer = setTimeout(gravar, espera);
    },
    entradaLiberada(sim) { return b.atualizar('salas/' + codigo, { info: JSON.stringify({ liberada: !!sim }) }).catch(() => {}); },
    ouvirTelao(cb) { return b.ouvir(`salas/${codigo}/presenca/telao`, cb); },
    encerrar() { desligar.forEach((f) => f && f()); clearTimeout(timer); }
  };
}

// ---------------------------------------------------------------- telão e aluno
export async function lerSala(codigo) {
  const b = await conectar(); await b.identificar();
  const s = await b.ler('salas/' + codigo);
  if (!s) return null;
  let info = {}; try { info = JSON.parse(s.info || '{}'); } catch {}
  return { jogo: s.jogo || info.jogo, liberada: info.liberada !== false };
}

export async function ouvirEstado(codigo, cb, erro) {
  const b = await conectar(); await b.identificar();
  return b.ouvir(`salas/${codigo}/pub/estado`, (d) => { if (d && d.j) { try { cb(JSON.parse(d.j)); } catch { /* publicação ilegível */ } } }, erro);
}

export async function marcarPresencaTelao(codigo) {
  const b = await conectar(); await b.identificar();
  const f = () => b.gravar(`salas/${codigo}/presenca/telao`, { em: b.agora() }).catch(() => {});
  f(); return setInterval(f, 10000);
}

export async function entrarNaSala(codigo, nome) {
  const b = await conectar(); const uid = await b.identificar();
  const info = await lerSala(codigo);
  if (!info) throw new Error('Sala não encontrada. Confira o código.');
  if (!info.liberada) throw new Error('A entrada ainda não foi liberada pelo professor. Aguarde.');
  const id = await b.adicionar(`salas/${codigo}/pedidos`, { uid, tipo: 'entrar', j: JSON.stringify({ nome }), em: b.agora() });
  return new Promise((resolve, reject) => {
    const fim = Date.now() + 25000;
    const off = b.ouvir(`salas/${codigo}/respostas/${id}`, (r) => {
      if (!r) { return; }
      if (off) off();
      if (!r.ok) reject(new Error(r.erro || 'Não foi possível entrar.')); else resolve(JSON.parse(r.j).id);
    }, () => reject(new Error('Sem conexão. Tente de novo.')));
    const t = setInterval(() => { if (Date.now() > fim) { clearInterval(t); if (off) off(); reject(new Error('O professor não respondeu ainda (a tela dele pode estar fechada). Tente de novo.')); } }, 1000);
  });
}

export async function enviarAcao(codigo, a) {
  const b = await conectar(); const uid = await b.identificar();
  await b.adicionar(`salas/${codigo}/pedidos`, { uid, tipo: 'aluno', j: JSON.stringify({ a }), em: b.agora() });
}

export { conectar as banco };
