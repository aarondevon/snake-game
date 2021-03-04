/* eslint-disable wrap-iife */
// eslint-disable-next-line no-unused-vars
const Snake = (function () {
  const movementBuffer = [];
  // Initial starting snake
  const body = [
    { x: GRID_SIZE * 3, y: GRID_SIZE * 10 },
    { x: GRID_SIZE * 2, y: GRID_SIZE * 10 },
    { x: GRID_SIZE, y: GRID_SIZE * 10 },
    { x: GRID_SIZE, y: GRID_SIZE * 10 },
  ];

  const getLastPosition = () => snake.body.map((position) => ({ x: position.x, y: position.y }));

  const setKeyBufferLength = () => {
    if (snake.snakeMovementBuffer.length > 2) {
      snake.snakeMovementBuffer.length = 2;
    }
  };

  const updateDirection = () => {
    if (snake.snakeMovementBuffer.length > 1) {
      snake.snakeMovementBuffer.shift();
    }
  };

  const moveLeft = () => {
    snake.body[0].x -= MOVEMENT;
  };

  const moveRight = () => {
    snake.body[0].x += MOVEMENT;
  };

  const moveUp = () => {
    snake.body[0].y -= MOVEMENT;
  };

  const moveDown = () => {
    snake.body[0].y += MOVEMENT;
  };

  const getDirection = () => {
    // eslint-disable-next-line default-case
    switch (snake.snakeMovementBuffer[0]) {
      case 'ArrowLeft':
        snakeMovement.left();
        break;
      case 'ArrowRight':
        snakeMovement.right();
        break;
      case 'ArrowUp':
        snakeMovement.up();
        break;
      case 'ArrowDown':
        snakeMovement.down();
        break;
    }
  };

  const updateSnakePosition = (lastPosition) => {
    for (let i = snake.body.length - 1; i > 0; i--) {
      snake.body[i] = lastPosition[i - 1];
    }
  };

  const getNewTailPosition = () => {
    const snakeTail = snake.body[snake.body.length - 1];
    const snakeTailParent = snake.body[snake.body.length - 2];
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
      Math.abs(snake.body[1].x - snake.body[0].x) === GRID_SIZE;
    const yPositionIsGridLengthApart =
      Math.abs(snake.body[1].y - snake.body[0].y) === GRID_SIZE;
    if (xPositionIsGridLengthApart || yPositionIsGridLengthApart) {
      updateSnakePosition(lastPosition);
    }
  };

  return {
    movementBuffer,
    body,
    getLastPosition,
    setKeyBufferLength,
    updateDirection,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    getDirection,
    getNewTailPosition,
    moveBody,
  };
})();
