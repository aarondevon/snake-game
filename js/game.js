const scoreCount = document.querySelector('#current-score-count');
let score = 0;
let canvas;
let canvasContext;
const gridSize = 20;
const cols = 30;
const rows = 24;
const movement = 1;
let collision = false;
const keyBuffer = [];

const snakeHead = {
  x: gridSize * 3,
  y: gridSize * 10,
};

const allowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'];

// Initial starting snake
const snake = [snakeHead,
  { x: gridSize * 2, y: gridSize * 10 },
  { x: gridSize, y: gridSize * 10 },
  { x: gridSize, y: gridSize * 10 },
];

const generateCoordinate = (range) => {
  let isReady = false;
  let number;
  while (isReady === false) {
    number = Math.floor((Math.random() * range) + 1);
    if (number % gridSize === 0) {
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
    appleLocation.x = generateCoordinate(canvas.width - gridSize);
    appleLocation.y = generateCoordinate(canvas.height - gridSize);
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

const colorRectangle = (leftX, topY, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
};

const colorCircle = (centerX, centerY, radius, drawColor) => {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  // X (Center of circle), Y, Radius, Angle, Radian, top or bottom of circle
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
};

const colorBoard = () => {
  const lightGreen = '#365902';
  const mediumGreen = '#172601';

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      if ((i % 2 === 0 && j % 2 === 0) || (i % 2 !== 0 && j % 2 !== 0)) {
        colorRectangle(i * gridSize, j * gridSize, gridSize, gridSize, lightGreen);
      } else {
        colorRectangle(i * gridSize, j * gridSize, gridSize, gridSize, mediumGreen);
      }
    }
  }
};

const drawSnake = () => {
  snake.forEach((section, index) => {
    colorCircle((section.x + 10), (section.y + 10), (gridSize / 2), '#C1D911');
    if (index === snake.length - 1) {
      colorCircle((snakeHead.x + 10), (snakeHead.y + 10), (gridSize / 2), '#D9863D');
    }
  });
};

const drawGameOverScreen = () => {
  if (collision) {
    colorRectangle(60, 0, 480, canvas.height, 'rgba(23, 38, 1, 0.9)');
    canvasContext.font = '72px Hanalei';
    canvasContext.fillStyle = '#85A60F';
    canvasContext.fillText('Game Over', 130, 150);
    canvasContext.fillText(`Score: ${score}`, 130, 225);

    canvasContext.font = '48px Hanalei';
    canvasContext.fillText('Press Spacebar', 130, 300);
    canvasContext.fillText('to play again', 145, 350);
  }
};

// Draw all elements
const draw = () => {
  // Draw game board
  colorBoard(gridSize, rows, cols);

  // Apple
  colorCircle((appleLocation.x + 10), (appleLocation.y + 10), (gridSize / 2), '#9E170F');

  // Snake
  drawSnake();

  // Game Over screen
  drawGameOverScreen();
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
  snakeHead.x -= movement;
};

const snakeMoveRight = () => {
  snakeHead.x += movement;
};

const snakeMoveUp = () => {
  snakeHead.y -= movement;
};

const snakeMoveDown = () => {
  snakeHead.y += movement;
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
    Math.abs(snake[1].x - snake[0].x) === gridSize;
  const yPositionIsGridLengthApart =
    Math.abs(snake[1].y - snake[0].y) === gridSize;
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
  snakeHead.x = gridSize * 3;
  snakeHead.y = gridSize * 10;
  snake[0] = snakeHead;
  snake[1] = { x: gridSize * 2, y: gridSize * 10 };
  snake[2] = { x: gridSize, y: gridSize * 10 };
  snake[3] = { x: gridSize, y: gridSize * 10 };
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
    document.querySelector('#high-score-count').innerText = score;
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
    localStorage.setItem('highScore', 0);
  } else {
    document.querySelector('#high-score-count').innerText = localStorage.getItem('highScore');
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
