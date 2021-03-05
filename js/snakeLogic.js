/* eslint-disable wrap-iife,no-param-reassign */
// eslint-disable-next-line no-unused-vars
const SnakeLogic = (function () {
  const getLastPosition = (snake) => snake.body.map((position) => ({ x: position.x, y: position.y }));

  const setKeyBufferLength = (snake) => {
    if (snake.movementBuffer.length > 2) {
      snake.movementBuffer.length = 2;
    }
  };

  const updateDirection = (snake) => {
    if (snake.movementBuffer.length > 1) {
      snake.movementBuffer.shift();
    }
  };

  const moveLeft = (snake, movement) => {
    snake.body[0].x -= movement;
  };

  const moveRight = (snake, movement) => {
    snake.body[0].x += movement;
  };

  const moveUp = (snake, movement) => {
    snake.body[0].y -= movement;
  };

  const moveDown = (snake, movement) => {
    snake.body[0].y += movement;
  };

  const getDirection = (snake, movement) => {
    // eslint-disable-next-line default-case
    switch (snake.movementBuffer[0]) {
      case 'ArrowLeft':
        moveLeft(snake, movement);
        break;
      case 'ArrowRight':
        moveRight(snake, movement);
        break;
      case 'ArrowUp':
        moveUp(snake, movement);
        break;
      case 'ArrowDown':
        moveDown(snake, movement);
        break;
    }
  };

  const updateSnakePosition = (snake, lastPosition) => {
    for (let i = snake.body.length - 1; i > 0; i--) {
      snake.body[i] = lastPosition[i - 1];
    }
  };

  const getNewTailPosition = (snake) => {
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

  const moveBody = (snake, lastPosition) => {
    const xPositionIsGridLengthApart =
      Math.abs(snake.body[1].x - snake.body[0].x) === GRID_SIZE;
    const yPositionIsGridLengthApart =
      Math.abs(snake.body[1].y - snake.body[0].y) === GRID_SIZE;
    if (xPositionIsGridLengthApart || yPositionIsGridLengthApart) {
      updateSnakePosition(snake, lastPosition);
    }
  };

  return {
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
