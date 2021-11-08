let game = {
    height: 400,
    width: 400,
}

let msg;
let msgContext;

let board;
let boardContext;

let snake = {
  length: 10,
  height: 10,
  increment: 10,
  direction: 0
}
let snakeContext;

let apple = {
    radius: snake.height / 2,
    x: 0,
    y: 0,
    eaten: 0
  }
  let appleContext;

const directions = {
  up: "up",
  left: "left",
  right: "right",
  down: "down"
}

const statuses = {
  start: "start",
  paused: "paused",
  over: "over",
  playing: "playing"
}

play = () => {
    updateMsg("pause");

    if (isSnakeEatingItself() || isSnakeHittingBorder()){
        game.gameStatus = statuses.over;
    } else {
        moveSnake();
    }

    isSnakeEatingApple();
    updateBoard();
    drawSnake();
    drawApple();
}

restartGame = () => {
    snake.array = [
        { x: game.width / snake.increment, y: game.height / 2 },
        { x: game.width / snake.increment - snake.increment, y: game.height / 2 },
        { x: game.width / snake.increment - snake.increment * 2, y: game.height / 2 },
        { x: game.width / snake.increment - snake.increment * 3, y: game.height / 2 }
    ];
    appleReset();
    apple.eaten = 0;

    snake.direction = directions.right;

    updateBoard();
    drawSnake();
    drawApple();
}

appleReset = () => {
    let x = Math.random() * (game.width - snake.increment * 2) + snake.increment;
    apple.x = Math.round(x / snake.increment) * snake.increment;

    let y = Math.random() * (game.height - snake.increment * 2) + snake.increment;
    apple.y = Math.round(y / snake.increment) * snake.increment;

    snake.array.some(item => {
        if (item.x === apple.x && item.y === apple.y) {
            appleReset();
        }
    })
}

keyPressed = (event) => {
    document.removeEventListener('keydown', keyPressed)
    const code = event.which;
    switch (code) {
        case 32:
            if (game.gameStatus === statuses.start) {
                game.gameStatus = statuses.playing;
            }
            else if (game.gameStatus === statuses.over) {
                game.gameStatus = statuses.playing;
                restartGame();
            }
            else if (game.gameStatus === statuses.paused) {
                game.gameStatus = statuses.playing;
            }
            else if (game.gameStatus === statuses.playing) {
                game.gameStatus = statuses.paused;
            }
            break;
        //left arrow
        case 37:
            if (snake.direction !== directions.right && snake.direction !== directions.left) {
                snake.direction = directions.left;
            }
            break;
        //up arrow
        case 38:
            if (snake.direction !== directions.up && snake.direction !== directions.down) {
                snake.direction = directions.up;
            }
            break;
        //right arrow
        case 39:
            if (snake.direction !== directions.left && snake.direction !== directions.right) {
                snake.direction = directions.right;
            }
            break;
        //down arrow
        case 40:
            if (snake.direction !== directions.up && snake.direction !== directions.down) {
                snake.direction = directions.down;
            }
            break;

    };
    document.addEventListener('keydown', keyPressed);
}

moveSnake = () => {
    nextMove = {
        x: snake.array[0].x,
        y: snake.array[0].y
    };

    if (snake.direction === directions.up) {
        nextMove.y -= snake.increment;
    }
    else if (snake.direction === directions.down) {
        nextMove.y += snake.increment;
    }
    else if (snake.direction === directions.right) {
        nextMove.x += snake.increment;
    }
    else if (snake.direction === directions.left) {
        nextMove.x -= snake.increment;
    }

    snake.array.unshift(nextMove);
    snake.array.pop();
}

isSnakeEatingItself = () => {
  let flag = false;
  snake.array.forEach((item, index) => {
    if (index !== 0 && item.x === snake.array[0].x && item.y === snake.array[0].y) {
      flag = true;
    }
  })
  return flag;
}

isSnakeHittingBorder = () => {
  return (snake.array[0].x > game.width - snake.increment || snake.array[0].x < 0 || snake.array[0].y > game.height - snake.increment || snake.array[0].y < 0)
}

isSnakeEatingApple = () => {
    if ((snake.array[0].y === apple.y) && (snake.array[0].x === apple.x)) {
        apple.eaten++;
        appleReset();
        ateApple = {
            x: 2*snake.array[snake.array.length - 1].x - snake.array[snake.array.length - 2].x,
            y: 2*snake.array[snake.array.length - 1].y - snake.array[snake.array.length - 2].y
        };
        snake.array.push(ateApple);
    }
}

updateMsg = (option) => {
    msgContext.fillStyle = 'rgb(166, 207, 207)';
    msgContext.fillRect(0, 0, msg.width, msg.height);
    msgContext.font = "bolder 20px serif";
    msgContext.fillStyle = 'rgb(24, 107, 24)';
    msgContext.fillText("Press spacebar to " + option, 50, 20); 
    msgContext.fillText("You have eaten " + apple.eaten + " apples", 50, 80);
}

updateBoard = () => {
    boardContext.fillStyle = 'black';
    boardContext.fillRect(0, 0, board.width, board.height);
}

drawSnake = () => {
    snake.array.forEach((coordinate) => {
        snakeContext.fillStyle = 'rgb(24, 107, 24)';
        snakeContext.fillRect(coordinate.x, coordinate.y, snake.length, snake.height);
    });
}

drawApple = () => {
    appleContext.fillStyle = 'red';
    appleContext.beginPath();
    appleContext.arc(apple.x + apple.radius, apple.y + apple.radius, apple.radius, 0, Math.PI * 2, true);
    appleContext.fill();
}

window.onload = () => {
    msg = document.getElementById('gameMessage');
    msgContext = msg.getContext('2d');

    board = document.getElementById('gameBoard');
    snakeContext = board.getContext('2d');
    appleContext = board.getContext('2d');
    boardContext = board.getContext('2d');

    restartGame();
    game.gameStatus = statuses.start;

    setInterval(() => {
        if (game.gameStatus === statuses.start) {
            updateMsg(game.gameStatus);
        }
        else if (game.gameStatus === statuses.over) {
            updateMsg("restart");
            msgContext.fillText("Game Over!!!", 50, 50);
        }
        else if (game.gameStatus === statuses.paused) {
            updateMsg("continue");
        }
        else {
            play();
        }
    }, 1000 / 12); 

    document.addEventListener('keydown', keyPressed);
};