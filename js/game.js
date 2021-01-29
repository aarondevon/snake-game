let canvas;
let snakeX = 0;
let snakeY = 0;
let direction = 0;
const movement = 20;
let firstKey = true;

const colorRectangle = (leftX, topY, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}

const draw = () => {
  colorRectangle(0,0, canvas.width, canvas.height, 'green')
  colorRectangle(snakeX,snakeY, 20, 20, 'black')
}

const move = () => {
  if ( firstKey) {
    snakeX += movement;
  } else {
    switch (direction) {
      case 37:
        snakeX -= movement;
        break;
      case 39:
        snakeX += movement;
        break;

      case 38:
        snakeY -= 20;
        break;
      case 40:
        snakeY += 20;
        break;
    }
  }
  
}


window.onload = function () {
  canvas = document.querySelector('#canvas');
      canvasContext = canvas.getContext('2d');

      let framesPerSecond = 5;
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