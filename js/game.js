let canvas;
let snakeX = 0;
let snakeY = 0;
let direction = 0;
let snakeLength = 20;
const movement = 20;
let firstKey = true;
const snakeHead = {
  x: snakeX,
  y: snakeY
}

let appleLocation = {
  x: 200,
  y: 100
}
const snake = [snakeHead];

const colorRectangle = (leftX, topY, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}

const draw = () => {
  colorRectangle(0,0, canvas.width, canvas.height, 'green')


  // Apple
  colorRectangle(appleLocation.x, appleLocation.y, 20, 20, 'red')
  

  // Snake
    snake.forEach((section, index) => {
      // if (index === 0) {
      //   colorRectangle(section.x, section.y, 20, 20, 'black')
      //   console.log(section.x )
      // } else {
      //   snake[index] = snake[index - 1];
      //   colorRectangle(section.x, section.y, 20, 20, 'black')
      // }
      colorRectangle(section.x, section.y, 20, 20, 'black')
      console.log('in foreach');
    
    
  });
  // colorRectangle(snakeX, snakeY, 20, 20, 'black')

}

const move = () => {
  // array of last positions
  let lastPosition = snake.map((position) => {
    return {x: position.x, y: position.y}
  });

  if (firstKey) {
    snakeHead.x += movement;
  } else {
    switch (direction) {
      case 37:
        snakeHead.x-= movement;
        break;
      case 39:
        snakeHead.x += movement;
        break;

      case 38:
        snakeHead.y -= 20;
        break;
      case 40:
        snakeHead.y += 20;
        break;
    }
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

      let framesPerSecond = 1;
      setInterval(() => {
      move();
      draw();
      }, 1000 / framesPerSecond);
      document.addEventListener("keydown", function(event) {
        direction = event.which;
        firstKey = false;
        console.log(event.which);
      });
    };