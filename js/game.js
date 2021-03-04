/* eslint-disable arrow-body-style */
const scoreCount = document.querySelector('#current-score-count');
const highScoreCount = document.querySelector('#high-score-count');
const canvas = document.querySelector('#canvas');
const canvasContext = canvas.getContext('2d');

const GRID_SIZE = 20;
const COLS = 30;
const ROWS = 24;
const MOVEMENT = 1;
const FRAMES_PER_SECOND = 140;

const appleLocation = {};

let gameIntervalId = null;
let score = 0;

const allowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'];

const updateHighScore = () => {
  const highScore = parseInt(localStorage.getItem('highScore'), 10);
  if (score > highScore) {
    localStorage.setItem('highScore', score);
    highScoreCount.innerText = score;
  }
};

const generateCoordinate = (range) => {
  let isReady = false;
  let number;
  while (isReady === false) {
    number = Math.floor((Math.random() * range) + 1);
    if (number % GRID_SIZE === 0) {
      isReady = true;
    }
  }
  return number;
};

const moveSnake = () => {
  // array of last positions
  const lastPosition = Snake.getLastPosition();

  Snake.setKeyBufferLength();
  // Move snake within the grid
  if (Snake.body[0].x % 20 === 0 && Snake.body[0].y % 20 === 0) {
    Snake.updateDirection();
  }

  Snake.moveBody(lastPosition);
  Snake.getNewTailPosition();
  Snake.getDirection();
};

// Generate a random position for the apple
const randomApplePosition = () => {
  let isReady = false;
  do {
    appleLocation.x = generateCoordinate(canvas.width - GRID_SIZE);
    appleLocation.y = generateCoordinate(canvas.height - GRID_SIZE);
    for (let i = 0; i < Snake.body.length; i += 1) {
      if (!(JSON.stringify(Snake.body[i]) === JSON.stringify(appleLocation))) {
        isReady = true;
      } else {
        isReady = false;
        break;
      }
    }
  } while (isReady === false);
};

const isSnakeOnApple = () => {
  if (Snake.body[0].x === appleLocation.x && Snake.body[0].y === appleLocation.y) {
    Snake.body.push({ x: Snake.body[Snake.body.length - 1].x, y: Snake.body[Snake.body.length - 1].y });
    score += 1;
    randomApplePosition();
    scoreCount.innerText = score;
  }
};

const isSnakeCollidingWithWall = () => {
  return (Snake.body[0].x < 0 || Snake.body[0].x > canvas.width - 20 || Snake.body[0].y < 0 || Snake.body[0].y > canvas.height - 20);
};

const isSnakeCollidingWithSelf = () => {
  for (let i = 1; i < Snake.body.length; i++) {
    if (JSON.stringify(Snake.body[i]) === JSON.stringify(Snake.body[0])) {
      return true;
    }
  }
};

const gameOver = () => {
  clearInterval(gameIntervalId);
  gameIntervalId = null;
  // Game Over screen
  CanvasRender.drawGameOverScreen(canvas, canvasContext, score);
  updateHighScore();
};

const gameLoop = () => {
  // Draw game board
  CanvasRender.colorBoard(canvasContext, GRID_SIZE, ROWS, COLS);

  const snakeMoving = Snake.movementBuffer.length > 0;
  if (snakeMoving) {
    moveSnake();
    // see if snake is eating an apple
    isSnakeOnApple();

    // Check to see if snake hit the sides of the board
    // or if snake hit itself
    if (isSnakeCollidingWithWall() === true || isSnakeCollidingWithSelf() === true) {
      gameOver();
      return;
    }
  }

  // Apple
  CanvasRender.drawApple(canvasContext, (appleLocation.x + 10), (appleLocation.y + 10), (GRID_SIZE / 2), '#9e170f');

  // Snake
  CanvasRender.drawSnake(canvasContext, Snake.body, GRID_SIZE);
};

const resetScore = () => {
  score = 0;
};

const resetScoreCounter = () => {
  scoreCount.innerText = score;
};

const clearKeyBuffer = () => {
  Snake.movementBuffer.length = 0;
};

const resetSnakePosition = () => {
  Snake.body.length = 0;
  Snake.body[0] = { x: GRID_SIZE * 3, y: GRID_SIZE * 10 };
  Snake.body[1] = { x: GRID_SIZE * 2, y: GRID_SIZE * 10 };
  Snake.body[2] = { x: GRID_SIZE, y: GRID_SIZE * 10 };
  Snake.body[3] = { x: GRID_SIZE, y: GRID_SIZE * 10 };
};

const resetGame = () => {
  resetScore();
  resetScoreCounter();
  clearKeyBuffer();
  resetSnakePosition();
};

const isValidDirection = (key) => {
  if (Snake.movementBuffer.length === 0 && key === 'ArrowLeft') {
    return false;
  }

  if (Snake.movementBuffer[0] === key) {
    return false;
  }

  if ((Snake.MovementBuffer[0] === 'ArrowLeft' && key === 'ArrowRight') || (Snake.movementBuffer[0] === 'ArrowRight' && key === 'ArrowLeft')) {
    return false;
  }

  if ((Snake.movementBuffer[0] === 'ArrowDown' && key === 'ArrowUp') || (Snake.movementBuffer[0] === 'ArrowUp' && key === 'ArrowDown')) {
    return false;
  }

  return true;
};

const setDirection = (validDirection, key) => {
  if (validDirection === true) {
    Snake.movementBuffer.push(key);
  }
};

document.addEventListener('keydown', (event) => {
  const { key } = event;
  if (gameIntervalId === null && key === ' ') {
    resetGame();
    gameIntervalId = setInterval(gameLoop, 1000 / FRAMES_PER_SECOND);
  }

  if (allowedKeys.includes(key)) {
    setDirection(isValidDirection(key), key);
  }
});

if (localStorage.getItem('highScore') === null) {
  localStorage.setItem('highScore', '0');
} else {
  highScoreCount.innerText = localStorage.getItem('highScore');
}

// Set apple location
randomApplePosition();

// Start initial game loop
gameIntervalId = setInterval(gameLoop, 1000 / FRAMES_PER_SECOND);
