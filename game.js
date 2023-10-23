const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ground = {
  x: 0,
  y: canvas.height - 25,
  width: canvas.width,
  height: 25,
};

const dino = {
  x: 50,
  y: ground.y - 50,
  width: 50,
  height: 50,
  speed: 10,
  jumpPower: 10,
  isJumping: false,
};

const dinoImage = new Image();
dinoImage.src = "dino.png";

const cactusImage = new Image();
cactusImage.src = "cactus.png";

const dinoLostImage = new Image();
dinoLostImage.src = "dino_died.png";

const obstacle = {
  x: canvas.width,
  y: ground.y - 50,
  width: 27,
  height: 50,
  speed: 9,
};

let score = 0;
let highScore = localStorage.getItem("highScore");

if (highScore === null) {
  highScore = 0;
} else {
  highScore = parseInt(highScore);
}

const clouds = [];

let isGameOver = false;

function jump() {
  if (!dino.isJumping) {
    dino.isJumping = true;
    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
      dino.y -= dino.jumpPower;
      jumpHeight += dino.jumpPower;
      if (jumpHeight >= 150) {
        clearInterval(jumpInterval);
        const fallInterval = setInterval(() => {
          dino.y += dino.jumpPower;
          if (dino.y >= ground.y - dino.height) {
            dino.isJumping = false;
            clearInterval(fallInterval);
          }
        }, 20);
      }
    }, 20);

    var jumpSound = document.getElementById("jumpSound");
    jumpSound.play();
  }
}

function drawDino() {
  if (isGameOver) {
    ctx.drawImage(dinoLostImage, dino.x, dino.y, dino.width, dino.height);
  } else {
    ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
  }
}

function drawCactus() {
  ctx.drawImage(cactusImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function drawGround() {
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

  ctx.fillStyle = "black";
  ctx.fillRect(ground.x, ground.y - 5, ground.width, 1);
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "18px 'Press Start 2P', cursive";
  ctx.fillText(score.toString().padStart(4, '0'), canvas.width - 120, 50);
  ctx.fillText("HI:" + highScore.toString().padStart(4, '0'), canvas.width - 280, 50);
}


function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGround();
  drawDino();
  drawCactus();
  drawScore();

  if (!isGameOver) {
    obstacle.x -= obstacle.speed;
    if (obstacle.x + obstacle.width < 0) {
      obstacle.x = canvas.width;
      score++;
    }
  }

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  if (
    dino.x + dino.width > obstacle.x &&
    dino.x < obstacle.x + obstacle.width &&
    dino.y + dino.height > obstacle.y
  ) {
    gameOver();
  }

  requestAnimationFrame(update);
}

function gameOver() {
  if (!isGameOver) {
    isGameOver = true;

    var audio = document.getElementById("gameOverSound");
    audio.play();

    canvas.style.cursor = "auto"; // Hide the mouse cursor

    const gameOverDiv = document.getElementById("gameOverDiv");
    gameOverDiv.style.display = "block";
  }
}

function restartGame() {
  isGameOver = false;
  score = 0;
  obstacle.x = canvas.width;

  const gameOverDiv = document.getElementById("gameOverDiv");
  gameOverDiv.style.display = "none";

  canvas.style.cursor = "none"; // Show the mouse cursor

  dino.speed = initialspeed;
  dino.speed = 10;
  obstacle.speed = 9;
  update();
}

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    jump();
  }
});

update();
