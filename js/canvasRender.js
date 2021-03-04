// eslint-disable-next-line
const CanvasRender = (function () {
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

  const colorBoard = (gridSize, rows, cols) => {
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

  const drawApple = (centerX, centerY, radius, drawColor) => {
    colorCircle(centerX, centerY, radius, drawColor);
  };

  const drawSnake = (snake, gridSize) => {
    snake.forEach((section, index) => {
      colorCircle((section.x + 10), (section.y + 10), (gridSize / 2), '#C1D911');
      if (index === snake.length - 1) {
        colorCircle((snake[0].x + 10), (snake[0].y + 10), (gridSize / 2), '#D9863D');
      }
    });
  };

  const drawGameOverScreen = (score) => {
    colorRectangle(60, 0, 480, canvas.height, 'rgba(23, 38, 1, 0.9)');
    canvasContext.font = '72px Hanalei';
    canvasContext.fillStyle = '#85A60F';
    canvasContext.fillText('Game Over', 130, 150);
    canvasContext.fillText(`Score: ${score}`, 130, 225);

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
