/* Lab RA — porta de acesso (Google + config/mestres no mosaico-game).
   Migrado de Dragon/laboratorio-ra. A validação é do lab inteiro: quem passa
   uma vez entra em qualquer bancada; quem não passa não entra em nenhuma.
   GitHub Pages é público: isto é barreira de acesso casual. */
(() => {
  "use strict";

  const ACCESS_KEY = "dragon.ra.access.v1";
  const isProtected = document.documentElement.hasAttribute("data-ra-protected");

  const script =
    document.currentScript ||
    document.querySelector('script[src*="guard.js"]');
  const scriptUrl = new URL(script?.src || "guard.js", location.href);
  const authUrl = new URL("index.html", scriptUrl).href;
  const bancadasUrl = new URL("bancadas.html", scriptUrl).href;

  let isUnlocked = false;
  try { isUnlocked = sessionStorage.getItem(ACCESS_KEY) === "liberado"; }
  catch (error) { isUnlocked = false; }

  if (isProtected && !isUnlocked) {
    const dest = authUrl + (authUrl.includes("?") ? "&" : "?") + "laboratorio=acesso";
    window.location.replace(dest);
    return;
  }

  const CFG = {
    apiKey: "AIzaSyDwshZbqaMOKxdRuyLtdpbijPRdrjVOcxE",
    authDomain: "mosaico-game.firebaseapp.com",
    projectId: "mosaico-game",
    storageBucket: "mosaico-game.firebasestorage.app",
    messagingSenderId: "436141261767",
    appId: "1:436141261767:web:6a83555a2f7c4ed4550fe2",
  };

  async function firebase() {
    const [appmod, authmod, fs] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"),
    ]);
    const app =
      appmod.getApps().find(a => a.name === "dragon-mesa") ||
      appmod.getApps().find(a => a.name === "dragon-lab") ||
      appmod.initializeApp(CFG, "dragon-lab");
    return { auth: authmod.getAuth(app), authmod, fs, db: fs.getFirestore(app) };
  }

  async function entrarComGoogle() {
    const { auth, authmod, fs, db } = await firebase();
    let user = auth.currentUser;
    if (!user || user.isAnonymous || !user.email) {
      const provider = new authmod.GoogleAuthProvider();
      user = (await authmod.signInWithPopup(auth, provider)).user;
    }
    const snap = await fs.getDoc(fs.doc(db, "config", "mestres"));
    const emails = snap.exists() && Array.isArray(snap.data().emails) ? snap.data().emails : [];
    if (!emails.includes((user.email || "").trim())) {
      await authmod.signOut(auth).catch(() => {});
      const erro = new Error("Esta conta Google não está autorizada no laboratório.");
      erro.recusado = true;
      throw erro;
    }
    return user;
  }

  function ready() {
    const form = document.getElementById("ra-access-form");
    const message = document.getElementById("ra-access-message");

    if (form && message) {
      // Se já liberou nesta sessão, vai direto às bancadas.
      if (isUnlocked) {
        window.location.replace(form.dataset.destination || bancadasUrl);
        return;
      }
      form.addEventListener("submit", async event => {
        event.preventDefault();
        const button = form.querySelector("button[type='submit']");
        button.disabled = true;
        message.textContent = "Verificando a conta…";
        try {
          await entrarComGoogle();
          try { sessionStorage.setItem(ACCESS_KEY, "liberado"); } catch (e) {}
          message.textContent = "Acesso liberado.";
          window.location.assign(form.dataset.destination || bancadasUrl);
        } catch (error) {
          message.textContent = error && error.recusado
            ? error.message
            : "Não foi possível entrar com Google. " + ((error && error.message) || "");
        } finally {
          button.disabled = false;
        }
      });
    }

    document.querySelectorAll("[data-ra-lock]").forEach(button => {
      button.addEventListener("click", () => {
        try { sessionStorage.removeItem(ACCESS_KEY); } catch (e) {}
        window.location.replace(authUrl);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready, { once: true });
  } else {
    ready();
  }
})();
