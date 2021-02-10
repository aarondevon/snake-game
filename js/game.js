const scoreCount = document.querySelector('#score-count');
let score = 0;
let canvas;
let canvasContext;
let direction = 0;
const gridSize = 20;
const cols = 30;
const rows = 24;
const movement = 20;
const startGame = false;
let collision = false;

const snakeHead = {
  x: 80,
  y: 200,
};

const allowedKeys = [37, 38, 39, 40];

// Initial starting snake
const snake = [snakeHead, { x: 60, y: 200 }, { x: 40, y: 200 }];

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

const draw = () => {
  colorRectangle(0, 0, canvas.width, canvas.height, 'green');
  colorBoard(gridSize, rows, cols);

  // Apple
  colorCircle((appleLocation.x + 10), (appleLocation.y + 10), (gridSize / 2), '#9E170F');

  // Snake
  snake.forEach((section, index) => {
    if (index === 0) {
      colorCircle((section.x + 10), (section.y + 10), (gridSize / 2), '#D9863D');
      // colorRectangle(section.x, section.y, gridSize, gridSize, '#D9863D');
    } else {
      colorCircle((section.x + 10), (section.y + 10), (gridSize / 2), '#C1D911');
      // colorRectangle(section.x, section.y, gridSize, gridSize, '#C1D911');
    }
  });

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

let currentDirection;

const snakeBodySetLastPosition = (lastPosition) => {
  collision = true;
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      snakeHead.x = lastPosition[i].x;
      snakeHead.y = lastPosition[i].y;
    } else {
      snake[i] = lastPosition[i];
    }
  }
};

const snakeMove = {
  left() {
    snakeHead.x -= movement;
  },
  right() {
    snakeHead.x += movement;
  },
  up() {
    snakeHead.y -= movement;
  },
  down() {
    snakeHead.y += movement;
  },
};

const move = () => {
  // array of last positions
  const lastPosition = snake.map((position) => ({ x: position.x, y: position.y }));

  if (startGame) {
    currentDirection = snakeMove.right;
    currentDirection();
  }

  if ((snakeHead.x % 20 === 0 || snakeHead.x === 0) && (snakeHead.y % 20 === 0 || snakeHead.y === 0)) {
    // eslint-disable-next-line default-case
    switch (direction) {
      case 37:
        currentDirection = snakeMove.left;
        currentDirection();
        break;
      case 39:
        currentDirection = snakeMove.right;
        currentDirection();
        break;

      case 38:
        currentDirection = snakeMove.up;
        currentDirection();
        break;
      case 40:
        currentDirection = snakeMove.down;
        currentDirection();
        break;
    }
  } else {
    currentDirection();
  }

  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = lastPosition[i - 1];
  }

  // see if snake is eating an apple
  if (snakeHead.x === appleLocation.x && snakeHead.y === appleLocation.y) {
    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
    score += 1;
    randomApplePosition();
    scoreCount.innerText = score;
  }

  // Check to see if snake hit the sides of the board
  if (snakeHead.x < 0 || snakeHead.x > canvas.width - 20 || snakeHead.y < 0 || snakeHead.y > canvas.height - 20) {
    snakeBodySetLastPosition(lastPosition);
  }

  // Check to see if snake hits itself
  for (let i = 1; i < snake.length; i++) {
    if (JSON.stringify(snake[i]) === JSON.stringify(snakeHead)) {
      snakeBodySetLastPosition(lastPosition);
      console.log('Snake on snake collision');
    }
  }
};

// eslint-disable-next-line no-undef
window.onload = function () {
  // eslint-disable-next-line no-undef
  canvas = document.querySelector('#canvas');
  canvasContext = canvas.getContext('2d');

  const framesPerSecond = 7;

  // Set apple location
  randomApplePosition();

  setInterval(() => {
    if (!collision) {
      if (direction) {
        move();
      }
      draw();
    }
  }, 1000 / framesPerSecond);

  document.addEventListener('keydown', (event) => {
    if (collision === true && event.key === ' ') {
      score = 0;
      scoreCount.innerText = score;
      direction = 0;
      snake.length = 0;
      snakeHead.x = 60;
      snakeHead.y = 200;
      snake[0] = snakeHead;
      snake[1] = { x: 40, y: 200 };
      snake[2] = { x: 20, y: 200 };
      collision = false;
    }
    if (allowedKeys.includes(event.which)) {
      let key;

      if (!direction) {
        direction = event.which;
      } else {
        key = event.which;
      }

      if ((direction === 37 && key === 39) || (direction === 39 && key === 37)) {

      } else if ((direction === 38 && key === 40) || (direction === 40 && key === 38)) {

      } else {
        direction = event.which;
      }
    }
  });
};