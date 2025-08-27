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

const board = document.getElementById("blockdrop-board");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
let score = 0, interval, running = false;
const ROWS = 20, COLS = 10;

let grid, current;

function drawBoard() {
  board.innerHTML = "";
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const d = document.createElement("div");
      d.className = grid[y][x] ? "block" : "";
      board.appendChild(d);
    }
  }
  if (current) {
    current.shape.forEach(([dx, dy]) => {
      const index = (current.y + dy) * COLS + (current.x + dx);
      if (index >= 0 && index < board.children.length)
        board.children[index].className = "block";
    });
  }
}
function randomShape() {
  const shapes = [
    [[0,0],[1,0],[0,1],[1,1]], // square
    [[0,0],[0,1],[0,2],[0,3]], // line
    [[0,0],[1,0],[2,0],[1,1]], // T
    [[0,0],[1,0],[1,1],[2,1]], // Z
    [[1,0],[2,0],[0,1],[1,1]], // S
    [[0,0],[0,1],[1,1],[2,1]], // L
    [[2,0],[0,1],[1,1],[2,1]]  // J
  ];
  const idx = Math.floor(Math.random() * shapes.length);
  return shapes[idx];
}
function canMove(dx, dy) {
  return current.shape.every(([sx, sy]) => {
    const nx = current.x + sx + dx;
    const ny = current.y + sy + dy;
    return nx >= 0 && nx < COLS && ny < ROWS && (ny < 0 || !grid[ny][nx]);
  });
}
function placeShape() {
  current.shape.forEach(([sx, sy]) => {
    const nx = current.x + sx, ny = current.y + sy;
    if (ny >= 0) grid[ny][nx] = 1;
  });
}
function clearLines() {
  let cleared = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    if (grid[y].every(cell => cell)) {
      grid.splice(y, 1);
      grid.unshift(Array(COLS).fill(0));
      cleared++;
      y++;
    }
  }
  score += cleared * 100;
  scoreEl.textContent = `Score: ${score}`;
}
function drop() {
  if (!canMove(0, 1)) {
    placeShape();
    clearLines();
    if (current.y < 0) {
      running = false;
      clearInterval(interval);
      submitScore(score); // SUBMIT SCORE ON GAME OVER
      alert("Game Over! Your score: " + score);
      startBtn.style.display = "inline-block";
      return;
    }
    spawn();
  } else {
    current.y++;
  }
  drawBoard();
}
function spawn() {
  current = { x: 4, y: -2, shape: randomShape() };
  if (!canMove(0,0)) {
    running = false;
    clearInterval(interval);
    submitScore(score); // SUBMIT SCORE ON GAME OVER
    alert("Game Over! Your score: " + score);
    startBtn.style.display = "inline-block";
  }
}
function move(dx) {
  if (canMove(dx, 0)) {
    current.x += dx;
    drawBoard();
  }
}
function rotate() {
  const newShape = current.shape.map(([x, y]) => [-y, x]);
  const old = current.shape;
  current.shape = newShape;
  if (!canMove(0, 0)) current.shape = old;
  drawBoard();
}
document.addEventListener("keydown", (e) => {
  if (!running) return;
  if (e.key === "ArrowLeft") move(-1);
  else if (e.key === "ArrowRight") move(1);
  else if (e.key === "ArrowDown") drop();
  else if (e.key === "ArrowUp") rotate();
});
startBtn.onclick = () => {
  running = true;
  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  score = 0;
  scoreEl.textContent = "Score: 0";
  startBtn.style.display = "none";
  spawn();
  drawBoard();
  clearInterval(interval);
  interval = setInterval(drop, 550);
};
drawBoard();

// --- REAL FIRESTORE SUBMISSION ---
async function submitScore(score) {
  try {
    const user = auth.currentUser;
    await addDoc(collection(db, "leaderboard"), {
      user: user ? user.displayName || user.email : "(anon)",
      score: score,
      game: "block-drop",
      timestamp: serverTimestamp()
    });
  } catch (err) {
    console.error("Score submission failed:", err);
    alert("Error saving score! " + err.message);
  }
}
