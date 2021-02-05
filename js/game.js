const DEBUG = true;

let canvas;
let direction = 0;
let snakeLength = 20;
const movement = 20;
let startGame = false;
let collision = false;

const snakeHead = {
  x: 80,
  y: 200
}

const appleLocation = {
  x: 100,
  y: 120
}

const allowedKeys = [37, 38, 39, 40]

const snake = [snakeHead, {x:60,y:200}, {x:40,y:200}];

const colorRectangle = (leftX, topY, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}

const colorCircle = (centerX, centerY, radius, drawColor) => {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  // X (Center of circle), Y, Radius, Angle, Radian, top or bottom of circle
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

let cols = 30
let rows = 30
let squareSize = 20

const colorBoard = (squareSize, rows, cols) => {
    let lightGreen = "#8ECC39"
    let mediumGreen = "#A7D948"

    for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
            if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) 
              colorRectangle(i * squareSize,j * squareSize, squareSize, squareSize, lightGreen)
            else {
              colorRectangle(i * squareSize,j * squareSize, squareSize, squareSize, mediumGreen)
            }

        }
}


const draw = () => {
  colorRectangle(0,0, canvas.width, canvas.height, 'green')
  colorBoard(squareSize, rows, cols) 

  // Apple
  colorCircle((appleLocation.x + 10), (appleLocation.y + 10), (squareSize / 2), 'red');
  
  // Snake
    snake.forEach((section, index) => {
      colorRectangle(section.x, section.y, squareSize, squareSize, 'black')
  });
}

let currentDirection;

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
  }
}

const move = () => {
  // array of last positions
  let lastPosition = snake.map((position) => {
    return {x: position.x, y: position.y}
  });

  if (startGame) {
    currentDirection = snakeMove.right; 
    currentDirection();
  }

  if ( snakeHead.x < 60 || snakeHead.x > canvas.width - 60) {
    collision = true;
    console.log('side hit');
  }


  if ((snakeHead.x % 20 === 0 || snakeHead.x === 0) && (snakeHead.y % 20 === 0 || snakeHead.y === 0)) {
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
    snake[i] = lastPosition[i-1];
  }

  if (snakeHead.x === appleLocation.x && snakeHead.y === appleLocation.y) {
    snake.push({x:snake[snake.length - 1].x, y:snake[snake.length -1].y});
  }
  
}

window.onload = function () {
  canvas = document.querySelector('#canvas');
      canvasContext = canvas.getContext('2d');

      let framesPerSecond = 5.5;

      if (DEBUG) {
        direction = 0;
        snakeHead.x = 20; 
        snakeHead.y = 200;
        snake[1] = {x: 40, y: 200};
        snake[2] = {x: 60, y: 200};

        framesPerSecond = 10;
      }

      
        setInterval(() => {
          if (!collision) {
          if (direction) {
            move();
          }
            
          draw();
        }
          }, 1000 / framesPerSecond);




      document.addEventListener("keydown", function(event) {
        if ( allowedKeys.includes(event.which))
        {
          let key;

          if (!direction) {
            direction = event.which;
          } else {
            key = event.which;
          }


          if (direction === 37 && key === 39 || direction === 39 && key === 37) {
            return;
          } else if (direction === 38 && key === 40 || direction === 40 && key === 38) {
            return;
          } else {
            direction = event.which;
          }
        }
      });
    };