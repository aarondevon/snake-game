const scoreCount = document.querySelector('#current-score-count');
const highScoreCount = document.querySelector('#high-score-count');

const GRID_SIZE = 20;
const COLS = 30;
const ROWS = 24;
const MOVEMENT = 1;

let score = 0;
let canvas;
let canvasContext;

let collision = false;
const keyBuffer = [];

const snakeHead = {
  x: GRID_SIZE * 3,
  y: GRID_SIZE * 10,
};

const allowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'];

// Initial starting snake
const snake = [snakeHead,
  { x: GRID_SIZE * 2, y: GRID_SIZE * 10 },
  { x: GRID_SIZE, y: GRID_SIZE * 10 },
  { x: GRID_SIZE, y: GRID_SIZE * 10 },
];

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

// Generate a random position for the apple
const randomApplePosition = () => {
  let isReady = false;
  do {
    appleLocation.x = generateCoordinate(canvas.width - GRID_SIZE);
    appleLocation.y = generateCoordinate(canvas.height - GRID_SIZE);
    for (let i = 0; i < snake.length; i += 1) {
      if (!(JSON.stringify(snake[i]) === JSON.stringify(appleLocation))) {
        isReady = true;
      } else {
        isReady = false;
        break;
      }
    }
  } while (isReady === false);
};

// Draw all elements
const draw = () => {
  // Draw game board
  CanvasRender.colorBoard(GRID_SIZE, ROWS, COLS);

  // Apple
  CanvasRender.drawApple((appleLocation.x + 10), (appleLocation.y + 10), (GRID_SIZE / 2), '#9E170F');

  // Snake
  CanvasRender.drawSnake(snake, GRID_SIZE);

  // Game Over screen
  CanvasRender.drawGameOverScreen(score);
};

const getLastPosition = () => snake.map((position) => ({ x: position.x, y: position.y }));

const setKeyBufferLength = () => {
  if (keyBuffer.length > 2) {
    keyBuffer.length = 2;
  }
};

const updateDirection = () => {
  if (keyBuffer.length > 1) {
    keyBuffer.shift();
  }
};

const snakeBodySetLastPosition = (lastPosition) => {
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      snakeHead.x = lastPosition[i].x;
      snakeHead.y = lastPosition[i].y;
    } else {
      snake[i] = lastPosition[i];
    }
  }
};

const snakeMoveLeft = () => {
  snakeHead.x -= MOVEMENT;
};

const snakeMoveRight = () => {
  snakeHead.x += MOVEMENT;
};

const snakeMoveUp = () => {
  snakeHead.y -= MOVEMENT;
};

const snakeMoveDown = () => {
  snakeHead.y += MOVEMENT;
};

const moveSnake = () => {
  // eslint-disable-next-line default-case
  switch (keyBuffer[0]) {
    case 'ArrowLeft':
      snakeMoveLeft();
      // updateDirection();
      break;
    case 'ArrowRight':
      snakeMoveRight();
      // updateDirection();
      break;
    case 'ArrowUp':
      snakeMoveUp();
      // updateDirection();
      break;
    case 'ArrowDown':
      snakeMoveDown();
      // updateDirection();
      break;
  }
};

const updateSnakePosition = (lastPosition) => {
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = lastPosition[i - 1];
  }
};

const getNewTailPosition = () => {
  const snakeTail = snake[snake.length - 1];
  const snakeTailParent = snake[snake.length - 2];
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
    Math.abs(snake[1].x - snake[0].x) === GRID_SIZE;
  const yPositionIsGridLengthApart =
    Math.abs(snake[1].y - snake[0].y) === GRID_SIZE;
  if (xPositionIsGridLengthApart || yPositionIsGridLengthApart) {
    updateSnakePosition(lastPosition);
  }
};

const isSnakeOnApple = () => {
  if (snakeHead.x === appleLocation.x && snakeHead.y === appleLocation.y) {
    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
    score += 1;
    randomApplePosition();
    scoreCount.innerText = score;
  }
};

const snakeSideCollision = (lastPosition) => {
  if (snakeHead.x < 0 || snakeHead.x > canvas.width - 20 || snakeHead.y < 0 || snakeHead.y > canvas.height - 20) {
    collision = true;
    snakeBodySetLastPosition(lastPosition);
  }
};

const snakeOnSnakeCollision = (lastPosition) => {
  for (let i = 1; i < snake.length; i++) {
    if (JSON.stringify(snake[i]) === JSON.stringify(snakeHead)) {
      collision = true;
      snakeBodySetLastPosition(lastPosition);
    }
  }
};

const move = () => {
  // array of last positions
  const lastPosition = getLastPosition();

  setKeyBufferLength();
  // Move snake within the grid
  if (snakeHead.x % 20 === 0 && snakeHead.y % 20 === 0) {
    // moveSnake();
    updateDirection();
  }

  moveBody(lastPosition);
  getNewTailPosition();
  moveSnake();

  // see if snake is eating an apple
  isSnakeOnApple();

  // Check to see if snake hit the sides of the board
  snakeSideCollision(lastPosition);

  // Check to see if snake hits itself
  snakeOnSnakeCollision(lastPosition);
};

const resetScore = () => {
  score = 0;
};

const resetScoreCounter = () => {
  scoreCount.innerText = score;
};

const clearKeyBuffer = () => {
  keyBuffer.length = 0;
};

const resetSnakePosition = () => {
  snake.length = 0;
  snakeHead.x = GRID_SIZE * 3;
  snakeHead.y = GRID_SIZE * 10;
  snake[0] = snakeHead;
  snake[1] = { x: GRID_SIZE * 2, y: GRID_SIZE * 10 };
  snake[2] = { x: GRID_SIZE, y: GRID_SIZE * 10 };
  snake[3] = { x: GRID_SIZE, y: GRID_SIZE * 10 };
};

const resetCollision = () => {
  collision = false;
};

const resetGame = () => {
  resetScore();
  resetScoreCounter();
  clearKeyBuffer();
  resetSnakePosition();
  resetCollision();
};

const isValidDirection = (key) => {
  if (keyBuffer.length === 0 && key === 'ArrowLeft') {
    return false;
  }

  if (keyBuffer[0] === key) {
    return false;
  }

  if ((keyBuffer[0] === 'ArrowLeft' && key === 'ArrowRight') || (keyBuffer[0] === 'ArrowRight' && key === 'ArrowLeft')) {
    return false;
  }

  if ((keyBuffer[0] === 'ArrowDown' && key === 'ArrowUp') || (keyBuffer[0] === 'ArrowUp' && key === 'ArrowDown')) {
    return false;
  }

  return true;
};

const setDirection = (validDirection, key) => {
  if (validDirection === true) {
    keyBuffer.push(key);
  }
};

document.addEventListener('keydown', (event) => {
  if (collision === true && event.key === ' ') {
    resetGame();
  }

  if (allowedKeys.includes(event.key)) {
    const { key } = event;

    if (collision === false) {
      setDirection(isValidDirection(key), key);
    }
  }
});

const updateHighScore = () => {
  const highScore = parseInt(localStorage.getItem('highScore'), 10);
  if (score > highScore) {
    localStorage.setItem('highScore', score);
    highScoreCount.innerText = score;
  }
};

const executeMove = () => {
  if (keyBuffer.length > 0) {
    move();
  }
};

window.onload = function () {
  canvas = document.querySelector('#canvas');
  canvasContext = canvas.getContext('2d');
  if (localStorage.getItem('highScore') === null) {
    localStorage.setItem('highScore', '0');
  } else {
    highScoreCount.innerText = localStorage.getItem('highScore');
  }

  const framesPerSecond = 140;

  // Set apple location
  randomApplePosition();

  setInterval(() => {
    if (collision === true) {
      updateHighScore();
    }

    if (collision === false) {
      executeMove();
      draw();
    }
  }, 1000 / framesPerSecond);
};
