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

let gameIntervalId = null;
let score = 0;

const allowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'];

// Initial starting snake
const snake = {
  snakeMovementBuffer: [],
  body: [
    { x: GRID_SIZE * 3, y: GRID_SIZE * 10 },
    { x: GRID_SIZE * 2, y: GRID_SIZE * 10 },
    { x: GRID_SIZE, y: GRID_SIZE * 10 },
    { x: GRID_SIZE, y: GRID_SIZE * 10 },
  ],
};

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

const appleLocation = {};

const getLastPosition = () => snake.body.map((position) => ({ x: position.x, y: position.y }));

const setKeyBufferLength = () => {
  if (snake.snakeMovementBuffer.length > 2) {
    snake.snakeMovementBuffer.length = 2;
  }
};

const updateDirection = () => {
  if (snake.snakeMovementBuffer.length > 1) {
    snake.snakeMovementBuffer.shift();
  }
};

const snakeMoveLeft = () => {
  snake.body[0].x -= MOVEMENT;
};

const snakeMoveRight = () => {
  snake.body[0].x += MOVEMENT;
};

const snakeMoveUp = () => {
  snake.body[0].y -= MOVEMENT;
};

const snakeMoveDown = () => {
  snake.body[0].y += MOVEMENT;
};

const getSnakeDirection = () => {
  // eslint-disable-next-line default-case
  switch (snake.snakeMovementBuffer[0]) {
    case 'ArrowLeft':
      snakeMoveLeft();
      break;
    case 'ArrowRight':
      snakeMoveRight();
      break;
    case 'ArrowUp':
      snakeMoveUp();
      break;
    case 'ArrowDown':
      snakeMoveDown();
      break;
  }
};

const updateSnakePosition = (lastPosition) => {
  for (let i = snake.body.length - 1; i > 0; i--) {
    snake.body[i] = lastPosition[i - 1];
  }
};

const getNewTailPosition = () => {
  const snakeTail = snake.body[snake.body.length - 1];
  const snakeTailParent = snake.body[snake.body.length - 2];
  if (
    snakeTail.x === snakeTailParent.x
    && snakeTail.y === snakeTailParent.y
  ) {
    return snakeTail;
  }

  if (snakeTail.x === snakeTailParent.x) {
    snakeTail.y += snakeTail.y < snakeTailParent.y ? 1 : -1;
    return snakeTail;
  }
  if (snakeTail.y === snakeTailParent.y) {
    snakeTail.x += snakeTail.x < snakeTailParent.x ? 1 : -1;
    return snakeTail;
  }
};

const moveBody = (lastPosition) => {
  const xPositionIsGridLengthApart =
    Math.abs(snake.body[1].x - snake.body[0].x) === GRID_SIZE;
  const yPositionIsGridLengthApart =
    Math.abs(snake.body[1].y - snake.body[0].y) === GRID_SIZE;
  if (xPositionIsGridLengthApart || yPositionIsGridLengthApart) {
    updateSnakePosition(lastPosition);
  }
};

const moveSnake = () => {
  // array of last positions
  const lastPosition = getLastPosition();

  setKeyBufferLength();
  // Move snake within the grid
  if (snake.body[0].x % 20 === 0 && snake.body[0].y % 20 === 0) {
    updateDirection();
  }

  moveBody(lastPosition);
  getNewTailPosition();
  getSnakeDirection();
};

// Generate a random position for the apple
const randomApplePosition = () => {
  let isReady = false;
  do {
    appleLocation.x = generateCoordinate(canvas.width - GRID_SIZE);
    appleLocation.y = generateCoordinate(canvas.height - GRID_SIZE);
    for (let i = 0; i < snake.body.length; i += 1) {
      if (!(JSON.stringify(snake.body[i]) === JSON.stringify(appleLocation))) {
        isReady = true;
      } else {
        isReady = false;
        break;
      }
    }
  } while (isReady === false);
};

const isSnakeOnApple = () => {
  if (snake.body[0].x === appleLocation.x && snake.body[0].y === appleLocation.y) {
    snake.body.push({ x: snake.body[snake.body.length - 1].x, y: snake.body[snake.body.length - 1].y });
    score += 1;
    randomApplePosition();
    scoreCount.innerText = score;
  }
};

const isSnakeCollidingWithWall = () => {
  return (snake.body[0].x < 0 || snake.body[0].x > canvas.width - 20 || snake.body[0].y < 0 || snake.body[0].y > canvas.height - 20);
};

const isSnakeCollidingWithSelf = () => {
  for (let i = 1; i < snake.body.length; i++) {
    if (JSON.stringify(snake.body[i]) === JSON.stringify(snake.body[0])) {
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

  const snakeMoving = snake.snakeMovementBuffer.length > 0;
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
  CanvasRender.drawSnake(canvasContext, snake.body, GRID_SIZE);
};

const resetScore = () => {
  score = 0;
};

const resetScoreCounter = () => {
  scoreCount.innerText = score;
};

const clearKeyBuffer = () => {
  snake.snakeMovementBuffer.length = 0;
};

const resetSnakePosition = () => {
  snake.body.length = 0;
  snake.body[0] = { x: GRID_SIZE * 3, y: GRID_SIZE * 10 };
  snake.body[1] = { x: GRID_SIZE * 2, y: GRID_SIZE * 10 };
  snake.body[2] = { x: GRID_SIZE, y: GRID_SIZE * 10 };
  snake.body[3] = { x: GRID_SIZE, y: GRID_SIZE * 10 };
};

const resetGame = () => {
  resetScore();
  resetScoreCounter();
  clearKeyBuffer();
  resetSnakePosition();
};

const isValidDirection = (key) => {
  if (snake.snakeMovementBuffer.length === 0 && key === 'ArrowLeft') {
    return false;
  }

  if (snake.snakeMovementBuffer[0] === key) {
    return false;
  }

  if ((snake.snakeMovementBuffer[0] === 'ArrowLeft' && key === 'ArrowRight') || (snake.snakeMovementBuffer[0] === 'ArrowRight' && key === 'ArrowLeft')) {
    return false;
  }

  if ((snake.snakeMovementBuffer[0] === 'ArrowDown' && key === 'ArrowUp') || (snake.snakeMovementBuffer[0] === 'ArrowUp' && key === 'ArrowDown')) {
    return false;
  }

  return true;
};

const setDirection = (validDirection, key) => {
  if (validDirection === true) {
    snake.snakeMovementBuffer.push(key);
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
