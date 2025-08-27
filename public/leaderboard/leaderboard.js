import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

async function loadLeaderboard(game = null) {
  let q = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(10));
  if (game) {
    // If you want game-specific leaderboard, adjust query here
  }
  const snapshot = await getDocs(q);
  const lb = [];
  snapshot.forEach(doc => {
    lb.push(doc.data());
  });

  const list = document.getElementById("leaderboard-list");
  list.innerHTML = `<table style="width:100%;margin:auto;text-align:center;">
    <tr><th>Rank</th><th>User</th><th>Score</th><th>Game</th></tr>
    ${lb.length === 0 ? `<tr><td colspan="4">No scores yet!</td></tr>` : ""}
    ${lb.map((d, i) =>
      `<tr>
        <td>${i + 1}</td>
        <td>${d.user || "(anon)"}</td>
        <td>${d.score}</td>
        <td>${d.game || ""}</td>
      </tr>`
    ).join("")}
  </table>`;
}

loadLeaderboard();
