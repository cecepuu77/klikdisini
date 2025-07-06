// coredb.js
const appCore = firebase.initializeApp(cfg);
const authCore = firebase.auth();
const dbCore = firebase.database();

authCore.signInAnonymously().catch((err) => {
  console.warn("Gagal login anonim:", err.message);
});

window.authCore = authCore;
window.dbCore = dbCore;