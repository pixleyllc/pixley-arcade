import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Firebase config (real, from your project)
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

const board = document.getElementById("snake-board");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("start-btn");

let snake, food, dir, nextDir, running, score, interval;

function init() {
  snake = [{ x: 10, y: 10 }];
  dir = { x: 0, y: -1 };
  nextDir = dir;
  food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
  score = 0;
  running = true;
  scoreEl.textContent = "Score: 0";
  draw();
  clearInterval(interval);
  interval = setInterval(move, 100);
}

function draw() {
  board.innerHTML = "";
  for (let y = 0; y < 20; y++)
    for (let x = 0; x < 20; x++) {
      const d = document.createElement("div");
      d.className = "cell";
      if (snake.some(s => s.x === x && s.y === y)) d.classList.add("snake");
      else if (food.x === x && food.y === y) d.classList.add("food");
      board.appendChild(d);
    }
}

function move() {
  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  if (
    head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20 ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    running = false;
    clearInterval(interval);
    submitScore(score); // SUBMIT SCORE TO FIRESTORE
    alert("Game Over! Your score: " + score);
    startBtn.style.display = "inline-block";
    return;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 100;
    scoreEl.textContent = "Score: " + score;
    // spawn new food, not on snake
    do {
      food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
  } else {
    snake.pop();
  }
  draw();
}

document.addEventListener("keydown", e => {
  if (!running) return;
  if (e.key === "ArrowUp" && dir.y === 0) nextDir = { x: 0, y: -1 };
  else if (e.key === "ArrowDown" && dir.y === 0) nextDir = { x: 0, y: 1 };
  else if (e.key === "ArrowLeft" && dir.x === 0) nextDir = { x: -1, y: 0 };
  else if (e.key === "ArrowRight" && dir.x === 0) nextDir = { x: 1, y: 0 };
});

startBtn.onclick = () => {
  startBtn.style.display = "none";
  init();
};
draw();

// --- REAL FIRESTORE SCORE SUBMISSION ---
async function submitScore(score) {
  try {
    const user = auth.currentUser;
    await addDoc(collection(db, "leaderboard"), {
      user: user ? user.displayName || user.email : "(anon)",
      score: score,
      game: "snake",
      timestamp: serverTimestamp()
    });
  } catch (err) {
    console.error("Score submission failed:", err);
    alert("Error saving score! " + err.message);
  }
}
