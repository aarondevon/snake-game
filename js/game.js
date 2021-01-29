let canvas;
let snakeX = 0;
let snakeY = 0;
let direction = 20;

const colorRectangle = (leftX, topY, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}

const draw = () => {
  colorRectangle(0,0, canvas.width, canvas.height, 'green')
  colorRectangle(snakeX,snakeY, 20, 20, 'black')
}

const move = () => {

}


window.onload = function () {
  canvas = document.querySelector('#canvas');
      canvasContext = canvas.getContext('2d');

      let framesPerSecond = 30;
      setInterval(() => {
      move();
      draw();
      }, 1000 / framesPerSecond);
      document.addEventListener("keydown", function(event) {
        switch (event.which) {
          case 37:
            snakeX -= 20;
            break;
          case 39:
            snakeX += 20;
            break;
          case 38:
            snakeY -= 20;
            break;
          case 40:
            snakeY += 20;
            break;
        }
        console.log(event.which);
      });
    };