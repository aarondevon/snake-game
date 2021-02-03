let canvas;
let snakeX = 0;
let snakeY = 0;
let direction = 0;
let snakeLength = 20;
const movement = 1;
let firstKey = true;
const snakeHead = {
  x: snakeX,
  y: snakeY
}

let appleLocation = {
  x: 100,
  y: 120
}

const allowedKeys = [37, 38, 39, 40]

const snake = [snakeHead];

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

let cols = 24 
let rows = 21
let squareSize = 20

const colorBoard = (squareSize, rows, cols) => {
    let lightGreen = "#8ECC39"
    let mediumGreen = "#A7D948"

    for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
            if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) 
              colorRectangle(i * squareSize,j * squareSize, squareSize, squareSize, lightGreen)
                // ctx.fillStyle = whiteSquareColor
            else {
              colorRectangle(i * squareSize,j * squareSize, squareSize, squareSize, mediumGreen)
              // ctx.fillStyle = blackSquareColor
            }
            
            // ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize)
        }
}


const draw = () => {
  colorRectangle(0,0, canvas.width, canvas.height, 'green')
  colorBoard(squareSize, rows, cols) 


  // Apple
  colorCircle((appleLocation.x + 10), (appleLocation.y + 10), (squareSize / 2), 'red');
  // colorRectangle(appleLocation.x, appleLocation.y, squareSize, squareSize, 'red')
  

  // Snake
    snake.forEach((section, index) => {
      // if (index === 0) {
      //   colorRectangle(section.x, section.y, 20, 20, 'black')
      //   console.log(section.x )
      // } else {
      //   snake[index] = snake[index - 1];
      //   colorRectangle(section.x, section.y, 20, 20, 'black')
      // }
      colorRectangle(section.x, section.y, squareSize, squareSize, 'black')
      console.log('in foreach');
    
    
  });
  // colorRectangle(snakeX, snakeY, 20, 20, 'black')

}

let currentDirection;

const moveMethods = {
  left() {
    snakeHead.x-= movement;
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

  if (firstKey) {
    currentDirection = moveMethods.right;
    // snakeHead.x += movement;
    currentDirection();
  }

  if ((snakeHead.x % 20 === 0 || snakeHead.x === 0) && (snakeHead.y % 20 === 0 || snakeHead.y === 0)) {
    switch (direction) {
      case 37:
        currentDirection = moveMethods.left;
        // snakeHead.x-= movement;
        currentDirection();
        break;
      case 39:
        currentDirection = moveMethods.right;
        // snakeHead.x += movement;
        currentDirection();
        break;

      case 38:
        currentDirection = moveMethods.up;
        // snakeHead.y -= movement;
        currentDirection();
        break;
      case 40:
        currentDirection = moveMethods.down;
        // snakeHead.y += movement;
        currentDirection();
        break;
    }
    console.log(direction);
  } else {
    currentDirection();
  }
  
  // if (firstKey) {
  //   snakeHead.x += movement;
  // } else {
  //   switch (direction) {
  //     case 37:
  //       snakeHead.x-= movement;
  //       break;
  //     case 39:
  //       snakeHead.x += movement;
  //       break;

  //     case 38:
  //       snakeHead.y -= movement;
  //       break;
  //     case 40:
  //       snakeHead.y += movement;
  //       break;
  //   }
  // }

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

      let framesPerSecond = 60;
      setInterval(() => {
      move();
      draw();
      }, 1000 / framesPerSecond);
      document.addEventListener("keydown", function(event) {
        if ( allowedKeys.includes(event.which))
        {
          direction = event.which;
          firstKey = false;
          console.log(event.which);
        }
        
      });
    };