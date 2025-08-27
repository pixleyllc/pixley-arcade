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
    alert("Game Over! Your score: " + score);
    startBtn.style.display = "inline-block";
    return;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 100;
    scoreEl.textContent = "Score: " + score;
    food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
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

