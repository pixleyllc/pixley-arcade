import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDR4bwMoeVZ39EstyiG-HNmHNdLuztn_cU",
  authDomain: "pixley-arcade.firebaseapp.com",
  projectId: "pixley-arcade",
  storageBucket: "pixley-arcade.firebasestorage.app",
  messagingSenderId: "115314116623",
  appId: "1:115314116623:web:556c994edb0a292f793b7a",
  measurementId: "G-Y7ZFC541XE"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Call this after Game Over:
async function submitScore(score) {
  const user = auth.currentUser;
  await addDoc(collection(db, "leaderboard"), {
    user: user ? user.displayName || user.email : "(anon)",
    score: score,
    game: "block-drop",
    timestamp: serverTimestamp()
  });
}

// In your drop() or game over logic, call:
if (!running) {
  // ...existing game over code...
  submitScore(score);
}
