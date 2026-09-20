import React from "react";
import ReactDOM from "react-dom/client";
import { storage } from "./firebase.js";
import App from "./App.jsx";

// O App.jsx lê e grava tudo via window.storage. Aqui ligamos esse "atalho"
// ao Firebase (Firestore) antes de o app iniciar.
window.storage = storage;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
