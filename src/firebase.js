import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

// Configuração do projeto Firebase "sistema-bombas-de-concre-3624d" (Sistema de Gestão — Locação de Bombas)
const firebaseConfig = {
  apiKey: "AIzaSyC1sa-AXHtLEToPYNnYA5ZLbacEwKa0kjU",
  authDomain: "sistema-bombas-de-concre-3624d.firebaseapp.com",
  projectId: "sistema-bombas-de-concre-3624d",
  storageBucket: "sistema-bombas-de-concre-3624d.firebasestorage.app",
  messagingSenderId: "799853045820",
  appId: "1:799853045820:web:3ea594a0d898fbaa06fb39",
  measurementId: "G-R2GERJ09HL",
};

const app = initializeApp(firebaseConfig);

// Algumas redes (principalmente domésticas, com certos provedores/roteadores)
// bloqueiam ou corrompem o tipo de conexão "streaming" que o Firestore tenta
// usar por padrão, fazendo as buscas ficarem penduradas para sempre sem erro
// nenhum. Forçar o modo de long-polling (mais lento, porém muito mais
// compatível) resolve esse travamento.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false,
});
export const auth = getAuth(app);

let authReadyPromise = null;

// Todo mundo que abre o app entra como um usuário anônimo do Firebase.
// Isso não pede login nenhum da equipe, mas impede que estranhos na
// internet leiam/escrevam direto no banco sem passar pelo app.
function ensureAuth() {
  if (!authReadyPromise) {
    console.log("[TopLocacoes] auth: iniciando login anônimo...");
    authReadyPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.error("[TopLocacoes] auth: TIMEOUT — não respondeu em 8s");
        reject(new Error("Timeout ao autenticar no Firebase (8s)"));
      }, 8000);
      const unsub = onAuthStateChanged(
        auth,
        (user) => {
          if (user) {
            clearTimeout(timeout);
            console.log("[TopLocacoes] auth: conectado, uid =", user.uid);
            unsub();
            resolve(user);
          } else {
            console.log("[TopLocacoes] auth: sem usuário ainda, chamando signInAnonymously...");
            signInAnonymously(auth)
              .then(() => console.log("[TopLocacoes] auth: signInAnonymously resolveu"))
              .catch((e) => {
                clearTimeout(timeout);
                console.error("[TopLocacoes] auth: signInAnonymously FALHOU:", e.code, e.message);
                reject(e);
              });
          }
        },
        (e) => {
          clearTimeout(timeout);
          console.error("[TopLocacoes] auth: onAuthStateChanged deu erro:", e.code, e.message);
          reject(e);
        }
      );
    });
  }
  return authReadyPromise;
}

// Roda uma promise com um limite de tempo — se estourar, rejeita em vez de
// ficar pendurada pra sempre (isso é o que fazia o app travar sem erro).
function comLimiteDeTempo(promise, ms, rotulo) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout (${ms}ms) em ${rotulo}`)), ms)
    ),
  ]);
}

// Shim com a mesma "forma" da API window.storage usada no app original,
// para que o restante do código (App.jsx) não precise mudar.
export const storage = {
  async get(key) {
    await ensureAuth();
    console.log("[TopLocacoes] get:", key, "- buscando...");
    const snap = await comLimiteDeTempo(getDoc(doc(db, "kv", key)), 15000, `get:${key}`);
    console.log("[TopLocacoes] get:", key, "- OK, existe?", snap.exists());
    return snap.exists() ? { key, value: snap.data().value } : null;
  },
  async set(key, value) {
    await ensureAuth();
    console.log("[TopLocacoes] set:", key, "- tamanho:", value.length, "bytes");
    await comLimiteDeTempo(setDoc(doc(db, "kv", key), { value }), 15000, `set:${key}`);
    console.log("[TopLocacoes] set:", key, "- OK");
    return { key, value };
  },
  async delete(key) {
    await ensureAuth();
    await comLimiteDeTempo(deleteDoc(doc(db, "kv", key)), 15000, `delete:${key}`);
    return { key, deleted: true };
  },
};
