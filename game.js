const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.querySelector('.score-display');
const startRestartButton = document.getElementById('startRestartButton');

const groundY = canvas.height - 30;
const gravity = 0.8;
const obstacleSpawnInterval = 1500;
const obstacleSpeed = 6;
const accentColor = '#3b82f6';

const dino = {
  x: 50,
  y: groundY - 50,
  width: 50,
  height: 50,
  jumpVelocity: 15,
  velocityY: 0,
  isJumping: false,
};

let obstacles = [];
let isGameRunning = false;
let isGameOver = false;
let score = 0;
let lastTimestamp = 0;
let lastObstacleTimestamp = 0;

function resetGame() {
  dino.y = groundY - dino.height;
  dino.velocityY = 0;
  dino.isJumping = false;
  obstacles = [];
  score = 0;
  isGameOver = false;
  scoreDisplay.textContent = 'Score: 0';
  lastTimestamp = 0;
  lastObstacleTimestamp = 0;
}

function startGame() {
  if (!isGameRunning) {
    isGameRunning = true;
    resetGame();
    requestAnimationFrame(gameLoop);
  }
}

function endGame() {
  isGameRunning = false;
  isGameOver = true;
  scoreDisplay.textContent = `Game Over | Score: ${Math.floor(score)}`;
}

function spawnObstacle() {
  const height = 40 + Math.random() * 20;
  obstacles.push({
    x: canvas.width + 20,
    y: groundY - height,
    width: 20,
    height: height,
    speed: obstacleSpeed,
  });
}

function handleJump() {
  if (!isGameRunning) {
    startGame();
    return;
  }

  if (!dino.isJumping) {
    dino.velocityY = -dino.jumpVelocity;
    dino.isJumping = true;
  }
}

function detectCollision(obstacle) {
  return (
    dino.x < obstacle.x + obstacle.width &&
    dino.x + dino.width > obstacle.x &&
    dino.y < obstacle.y + obstacle.height &&
    dino.y + dino.height > obstacle.y
  );
}

function update(deltaTime) {
  if (!isGameRunning) return;

  dino.velocityY += gravity;
  dino.y += dino.velocityY;

  if (dino.y + dino.height >= groundY) {
    dino.y = groundY - dino.height;
    dino.velocityY = 0;
    dino.isJumping = false;
  }

  if (lastObstacleTimestamp === 0 || performance.now() - lastObstacleTimestamp >= obstacleSpawnInterval) {
    spawnObstacle();
    lastObstacleTimestamp = performance.now();
  }

  obstacles = obstacles.filter(obstacle => {
    obstacle.x -= obstacle.speed;
    return obstacle.x + obstacle.width > 0;
  });

  for (const obstacle of obstacles) {
    if (detectCollision(obstacle)) {
      endGame();
      return;
    }
  }

  score += deltaTime * 0.01;
  scoreDisplay.textContent = `Score: ${Math.floor(score)}`;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(canvas.width, groundY);
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(dino.x + 10, dino.y + dino.height - 10);
  ctx.quadraticCurveTo(dino.x + 2, dino.y + dino.height - 28, dino.x + 16, dino.y + dino.height - 34);
  ctx.lineTo(dino.x + 24, dino.y + 18);
  ctx.quadraticCurveTo(dino.x + 32, dino.y + 8, dino.x + 44, dino.y + 12);
  ctx.lineTo(dino.x + 46, dino.y + 18);
  ctx.lineTo(dino.x + 42, dino.y + 22);
  ctx.lineTo(dino.x + 42, dino.y + 28);
  ctx.lineTo(dino.x + 36, dino.y + 28);
  ctx.lineTo(dino.x + 34, dino.y + 34);
  ctx.lineTo(dino.x + 20, dino.y + dino.height - 10);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(dino.x + 18, dino.y + dino.height - 16);
  ctx.lineTo(dino.x + 18, dino.y + dino.height - 8);
  ctx.lineTo(dino.x + 26, dino.y + dino.height - 12);
  ctx.fill();

  ctx.fillStyle = 'var(--primary-color)';
  ctx.beginPath();
  ctx.arc(dino.x + 38, dino.y + 18, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = accentColor;
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    ctx.fillRect(obstacle.x - 6, obstacle.y + obstacle.height * 0.35, 6, obstacle.height * 0.2);
    ctx.fillRect(obstacle.x + obstacle.width, obstacle.y + obstacle.height * 0.25, 6, obstacle.height * 0.15);
  });

  if (isGameOver) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '28px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText('Press Start/Restart to play again', canvas.width / 2, canvas.height / 2 + 25);
  }
}

function gameLoop(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const deltaTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  update(deltaTime);
  draw();

  if (isGameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

startRestartButton.addEventListener('click', () => {
  resetGame();
  isGameRunning = true;
  requestAnimationFrame(gameLoop);
});

window.addEventListener('keydown', event => {
  if (event.code === 'Space') {
    event.preventDefault();
    handleJump();
  }
});

canvas.addEventListener('touchstart', event => {
  event.preventDefault();
  handleJump();
});

canvas.addEventListener('mousedown', () => {
  handleJump();
});