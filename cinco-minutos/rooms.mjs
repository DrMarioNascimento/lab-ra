const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const sdk = 'https://www.gstatic.com/firebasejs/12.7.0';

export function normalizeCode(value) {
  return value.toUpperCase().replace(/[\s\p{Dash_Punctuation}]/gu, '');
}

function randomCode() {
  return Array.from(crypto.getRandomValues(new Uint8Array(12)), byte => alphabet[byte % alphabet.length]).join('');
}

export async function readConfig() {
  const response = await fetch('firebase/web-config.json', { cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('O serviço de salas ainda aguarda ativação.');
  const config = await response.json();
  if (!config.apiKey || !config.projectId || !config.appId) throw new Error('O serviço de salas ainda aguarda ativação.');

  return config;
}

export async function connect(config) {
  const [appModule, authModule, dbModule] = await Promise.all([
    import(sdk + '/firebase-app.js'),
    import(sdk + '/firebase-auth.js'),
    import(sdk + '/firebase-firestore.js')
  ]);
  const app = appModule.getApps().find(candidate => candidate.name === 'cinco-minutos')
    ?? appModule.initializeApp(config, 'cinco-minutos');
  const auth = authModule.getAuth(app);
  const db = dbModule.getFirestore(app);
  if (config.emulator && ['localhost', '127.0.0.1'].includes(location.hostname) && !auth.emulatorConfig) {
    authModule.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    dbModule.connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
  await auth.authStateReady();
  const user = auth.currentUser ?? (await authModule.signInAnonymously(auth)).user;
  const { doc, runTransaction, onSnapshot, getDocFromServer, setDoc, serverTimestamp } = dbModule;
  const clock = doc(db, 'cincoClocks', user.uid);
  let clockBase;

  async function syncClock() {
    const before = performance.now();
    await setDoc(clock, { time: serverTimestamp() });
    const after = performance.now();
    const sample = await getDocFromServer(clock);
    clockBase = sample.data().time.toMillis() - (before + after) / 2;
  }

  await syncClock();

  async function mutate(code, makeChanges) {
    const ref = doc(db, 'cincoRooms', code);
    return runTransaction(db, async tx => {
      const snapshot = await tx.get(ref);
      const changes = makeChanges(snapshot.data());
      if (changes) tx.update(ref, changes);
    });
  }

  return {
    uid: user.uid,
    now: () => performance.now() + clockBase,
    syncClock,
    async create(name, seconds, caseIndex) {
      for (let attempt = 0; attempt < 4; attempt++) {
        const code = randomCode();
        const ref = doc(db, 'cincoRooms', code);
        const created = await runTransaction(db, async tx => {
          if ((await tx.get(ref)).exists()) return false;
          tx.set(ref, {
            host: user.uid, members: { [user.uid]: name }, phase: 'lobby', loop: 1,
            caseIndex, seconds, startedAt: null, createdAt: serverTimestamp(), answers: null
          });
          return true;
        });
        if (created) return code;
      }
      throw new Error('Não foi possível reservar um código. Tente novamente.');
    },
    async join(code, name) {
      return mutate(code, room => {
        if (!room) throw new Error('Sala não encontrada. Confira o código do convite.');
        if (Object.hasOwn(room.members, user.uid)) return;
        if (room.phase !== 'lobby') throw new Error('Esta partida já começou.');
        if (Object.keys(room.members).length >= 6) throw new Error('Esta sala está cheia.');
        return { members: { ...room.members, [user.uid]: name } };
      });
    },
    leave(code) {
      return mutate(code, room => {
        if (!room || room.phase !== 'lobby' || room.host === user.uid || !Object.hasOwn(room.members, user.uid)) return;
        const members = { ...room.members };
        delete members[user.uid];
        return { members };
      });
    },
    watch(code, onRoom, onError) {
      return onSnapshot(doc(db, 'cincoRooms', code), { includeMetadataChanges: true }, snapshot => {
        if (snapshot.metadata.hasPendingWrites) return;
        onRoom(snapshot.data(), snapshot.metadata.fromCache);
      }, onError);
    },
    advance(code, expected, phase, answers) {
      return mutate(code, room => {
        if (!room || room.phase !== expected.phase || room.loop !== expected.loop) return;
        if (room.host !== user.uid) throw new Error('Apenas o anfitrião controla a partida.');
        if (phase === 'choose' && room.phase === 'between') return { phase, loop: room.loop + 1, startedAt: null };
        if (phase === 'playing') return { phase, startedAt: serverTimestamp() };
        if (phase === 'result') return { phase, answers };
        return { phase };
      });
    }
  };
}
