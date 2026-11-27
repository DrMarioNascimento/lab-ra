// Limiar Ético · sala ao vivo. Só é carregado quando alguém entra numa sala ou abre o módulo do professor.
// Projeto Firebase próprio (limiar-etico), estrutura sessoes/{codigo}/alunos/{id}. O aluno não faz login; o professor entra
// com a conta Google e as regras do Firestore (firestore.rules) decidem quem é professor. A chave abaixo é pública por desenho.
export const PROJETO = 'limiar-etico';
const VERSAO_FIREBASE = '12.17.1';
const CONFIG = {
  apiKey: 'AIzaSyAibhInsG1nZ9aSKzMIl8VVXQDQgd93f4I',
  authDomain: 'limiar-etico.firebaseapp.com',
  projectId: 'limiar-etico',
  storageBucket: 'limiar-etico.firebasestorage.app',
  messagingSenderId: '1025197130703',
  appId: '1:1025197130703:web:4c14850f5c9e6d5e0e08ba'
};

let api = null;

export async function conectar() {
  if (api) return api;
  // Gancho de teste: permite simular a sala sem rede.
  if (typeof window !== 'undefined' && window.__LIMIAR_SALA_FALSA) return (api = window.__LIMIAR_SALA_FALSA);
  // /simulador: cada tela simulada é um iframe com ?sim=<id>; a sala falsa mora na página do simulador.
  try { if (typeof window !== 'undefined' && new URLSearchParams(location.search).get('sim') && window.parent !== window && window.parent.__LIMIAR_SIM_API) return (api = window.parent.__LIMIAR_SIM_API); } catch (e) { /* outro domínio */ }
  const base = `https://www.gstatic.com/firebasejs/${VERSAO_FIREBASE}`;
  const [{ initializeApp }, fs, au] = await Promise.all([
    import(`${base}/firebase-app.js`), import(`${base}/firebase-firestore.js`), import(`${base}/firebase-auth.js`)
  ]);
  const { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, onSnapshot, serverTimestamp } = fs;
  const { getAuth, GoogleAuthProvider, signInWithPopup, signOut } = au;
  const app = initializeApp(CONFIG, 'limiar-etico'), db = getFirestore(app), auth = getAuth(app);
  api = {
    async entrarProfessor() {
      if (!auth.currentUser) await signInWithPopup(auth, new GoogleAuthProvider());
      try { await getDoc(doc(db, 'acesso', 'orientador')); return true; }
      catch (e) { if (e && e.code === 'permission-denied') { await signOut(auth).catch(() => {}); return false; } throw e; }
    },
    async sairProfessor() { await signOut(auth).catch(() => {}); },
    async criarSessao(codigo, config = {}) { await setDoc(doc(db, 'sessoes', codigo), { ativa: true, projeto: PROJETO, modo: config.modo === 'fixo' ? 'fixo' : 'livre', dia: config.modo === 'fixo' ? String(config.dia || '') : '', criadaEm: serverTimestamp(), criadaEmMs: Date.now() }); return codigo; },
    async encerrarSessao(codigo) { try { await updateDoc(doc(db, 'sessoes', codigo), { ativa: false, encerradaEmMs: Date.now() }); } catch (e) { /* já encerrada */ } },
    async lerSessao(codigo) { const s = await getDoc(doc(db, 'sessoes', codigo)); if (!s.exists()) return null; const d = s.data(); return d.ativa === true && d.projeto === PROJETO ? { modo: d.modo === 'fixo' ? 'fixo' : 'livre', dia: d.dia || '' } : null; },
    async sessaoAtiva(codigo) { const s = await getDoc(doc(db, 'sessoes', codigo)); if (!s.exists()) return false; const d = s.data(); return d.ativa === true && d.projeto === PROJETO; },
    async gravarAluno(codigo, id, dados) { await setDoc(doc(db, 'sessoes', codigo, 'alunos', id), { ...dados, projeto: PROJETO, atualizadoEmMs: Date.now() }, { merge: true }); },
    async apagarAluno(codigo, id) { await deleteDoc(doc(db, 'sessoes', codigo, 'alunos', id)); },
    ouvirAlunos(codigo, aoMudar, aoFalhar) {
      return onSnapshot(collection(db, 'sessoes', codigo, 'alunos'), s => {
        const lista = []; s.forEach(d => lista.push({ id: d.id, ...d.data() }));
        aoMudar(lista.filter(a => a.projeto === PROJETO));
      }, e => { console.error(e); if (aoFalhar) aoFalhar(e); });
    }
  };
  return api;
}

export const gerarCodigo = () => 'LE' + String(Math.floor(1000 + Math.random() * 9000));
export const limparCodigo = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
export const novoId = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random()).replaceAll('.', '-');
