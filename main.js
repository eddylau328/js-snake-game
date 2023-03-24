let snake = [];
let apple = null;
let direction = null;
let prevDirection = null;
let board = [];
let isGameOver = false;
let gameLoopInterval = null;

const GAME_LOOP_SPEED = 250;
const BOARD_SIZE = 10;

function getRandomInt() {
  return Math.floor(Math.random() * BOARD_SIZE);
}

function generatePosition() {
  // find a way to random generate x and y position
  // 1 for snake
  // 1 for apple
  return {
    x: getRandomInt(),
    y: getRandomInt(),
  };
}

function generateApplePosition() {
  const check = (pos) =>
    snake.filter((s_pos) => s_pos.x === pos.x && s_pos.y === pos.y).length > 0;
  pos = generatePosition();
  while (check(pos) && snake.length >= BOARD_SIZE * BOARD_SIZE) {
    pos = generatePosition();
  }
  return pos;
}

function control(event) {
  const isOnlySnakeHead = snake.length === 1;
  // check move direction
  switch (event.keyCode) {
    case 37: // left key
      if (isOnlySnakeHead || prevDirection !== "right") {
        direction = "left";
      }
      break;
    case 38: // up key
      if (isOnlySnakeHead || prevDirection !== "down") {
        direction = "up";
      }
      break;
    case 39: // right key
      if (isOnlySnakeHead || prevDirection !== "left") {
        direction = "right";
      }
      break;
    case 40: // down key
      if (isOnlySnakeHead || prevDirection !== "up") {
        direction = "down";
      }
      break;
  }
}

function getNewHeadPosition() {
  const newSnakeHead = { ...snake[0] };
  if (prevDirection === "left") {
    newSnakeHead.x -= 1;
  } else if (prevDirection === "right") {
    newSnakeHead.x += 1;
  } else if (prevDirection === "down") {
    newSnakeHead.y += 1;
  } else if (prevDirection === "up") {
    newSnakeHead.y -= 1;
  }
  return newSnakeHead;
}

function updateSnakePosition() {
  const newSnakeHead = getNewHeadPosition();
  snake.pop();
  snake.unshift(newSnakeHead);
}

function checkHitBoundary() {
  // check next snake head hit the boundary or not
  const newHead = getNewHeadPosition();
  if (newHead.x >= BOARD_SIZE || newHead.x < 0) {
    isGameOver = true;
  } else if (newHead.y >= BOARD_SIZE || newHead.y < 0) {
    isGameOver = true;
  }
}

function checkHitBody() {
  // check next snake head hit the body or not
  const newHead = getNewHeadPosition();
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
      isGameOver = true;
    }
  }
}

function checkHitApple() {
  // check next snake head hit the apple or not
  const newHead = getNewHeadPosition();

  // early return if snake head don't touch apple
  if (!apple || !(newHead.x === apple.x && newHead.y === apple.y)) {
    return;
  }

  // increment snake tail
  const tail = { ...snake[snake.length - 1] };
  snake.push(tail);

  // regenerate apple
  apple = generateApplePosition();
}

function setupScreen() {
  const tbody = document.getElementsByTagName("tbody")[0];
  // Remove existing board rows
  while (tbody.firstChild) {
    tbody.removeChild(tbody.lastChild);
  }
  // Insert a row at the end of tbody
  for (let i = 0; i < BOARD_SIZE; i++) {
    const newRow = tbody.insertRow();
    board.push([]);
    for (let j = 0; j < BOARD_SIZE; j++) {
      const newCell = newRow.insertCell();
      let block = document.createElement("div");
      block.classList.add("block");
      newCell.appendChild(block);
      board[i].push(block);
    }
  }
}

function updateScreen() {
  const clearScreen = () => {
    board.forEach((row) => {
      row.forEach((block) => {
        block.classList.remove(...block.classList);
        block.classList.add("block");
      });
    });
  };
  const updateSnake = () => {
    snake.forEach((pos, i) => {
      isExceedBoundaryX = pos.x >= BOARD_SIZE || pos.x < 0
      isExceedBoundaryY = pos.y >= BOARD_SIZE || pos.y < 0
      if (isExceedBoundaryX || isExceedBoundaryY)
        return;
      if (i === 0) {
        board[pos.y][pos.x].classList.add("snakeHead");
      } else {
        board[pos.y][pos.x].classList.add("snakeBody");
      }
    });
  };
  const updateApple = () => {
    board[apple.y][apple.x].classList.add("apple");
  };
  clearScreen();
  updateApple();
  updateSnake();
}


function loop() {
  // lock your direction input
  // prevent changing after condition check
  prevDirection = direction;

  // should check next move instead of current
  checkHitBoundary();
  checkHitBody();

  // prevent game over continue update
  if (isGameOver)
    return;

  // whether need to increase the length
  checkHitApple();

  // update to next move
  updateSnakePosition();
  updateScreen();
}

function setup() {
  direction = 'right';
  prevDirection = null;
  board = [];
  isGameOver = false;
  gameLoopInterval = null;

  // before the game first
  snake = [];

  // generate snake head
  snake.push({x: 0, y: Math.floor(BOARD_SIZE / 2) - 1});
  // generate apple position
  apple = generateApplePosition();

  // create a control input detection
  document.addEventListener("keydown", control);

  // gui setup
  setupScreen();

  // 500ms it will run loop function again
  gameLoopInterval = setInterval(() => loop(), GAME_LOOP_SPEED);
}

setup();
setInterval(() => {
  if (isGameOver) {
    alert('Game over');
    clearInterval(gameLoopInterval);
    setup();
  }
}, GAME_LOOP_SPEED * 2);
