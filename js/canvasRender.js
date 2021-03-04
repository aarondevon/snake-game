// eslint-disable-next-line
const CanvasRender = (function () {
  const colorRectangle = (canvasContext, leftX, topY, width, height, color) => {
    // eslint-disable-next-line no-param-reassign
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX, topY, width, height);
  };

  const colorCircle = (canvasContext, centerX, centerY, radius, drawColor) => {
    // eslint-disable-next-line no-param-reassign
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    // X (Center of circle), Y, Radius, Angle, Radian, top or bottom of circle
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
  };

  const colorBoard = (canvasContext, gridSize, rows, cols) => {
    const lightGreen = '#365902';
    const mediumGreen = '#172601';

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        if ((i % 2 === 0 && j % 2 === 0) || (i % 2 !== 0 && j % 2 !== 0)) {
          colorRectangle(canvasContext, i * gridSize, j * gridSize, gridSize, gridSize, lightGreen);
        } else {
          colorRectangle(canvasContext, i * gridSize, j * gridSize, gridSize, gridSize, mediumGreen);
        }
      }
    }
  };

  const drawApple = (canvasContext, centerX, centerY, radius, drawColor) => {
    colorCircle(canvasContext, centerX, centerY, radius, drawColor);
  };

  const drawSnake = (canvasContext, snake, gridSize) => {
    snake.forEach((section, index) => {
      colorCircle(canvasContext, (section.x + 10), (section.y + 10), (gridSize / 2), '#C1D911');
      if (index === snake.length - 1) {
        colorCircle(canvasContext, (snake[0].x + 10), (snake[0].y + 10), (gridSize / 2), '#D9863D');
      }
    });
  };

  const drawGameOverScreen = (canvas, canvasContext, score) => {
    colorRectangle(canvasContext, 60, 0, 480, canvas.height, 'rgba(23, 38, 1, 0.9)');
    // eslint-disable-next-line no-param-reassign
    canvasContext.font = '72px Hanalei';
    // eslint-disable-next-line no-param-reassign
    canvasContext.fillStyle = '#85A60F';
    canvasContext.fillText('Game Over', 130, 150);
    canvasContext.fillText(`Score: ${score}`, 130, 225);
    // eslint-disable-next-line no-param-reassign
    canvasContext.font = '48px Hanalei';
    canvasContext.fillText('Press Spacebar', 130, 300);
    canvasContext.fillText('to play again', 145, 350);
  };

  return {
    colorRectangle,
    colorCircle,
    colorBoard,
    drawApple,
    drawSnake,
    drawGameOverScreen,
  };
})();
