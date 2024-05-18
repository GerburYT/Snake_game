const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [
    { x: 300, y: 300 },
    { x: 280, y: 300 },
    { x: 260, y: 300 },
    { x: 240, y: 300 },
    { x: 220, y: 300 },
];

let dx = 20;
let dy = 0;

let foodX;
let foodY;

let changingDirection = false;
let score = 0;

document.addEventListener("keydown", changeDirection);

const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', restartGame);

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

main();
createFood();

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

function main() {
    if (didGameEnd()) {
        document.getElementById('game-over').classList.remove('hide');
        return;
    }

    setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        drawScore();

        main();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    ctx.fillStyle = "#ff4c4c";
    ctx.strokeStyle = "#cc0000";
    ctx.fillRect(foodX, foodY, 20, 20);
    ctx.strokeRect(foodX, foodY, 20, 20);
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = "#00FF00";
    ctx.strokeStyle = "darkgreen";
    ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
    ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - 20;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - 20;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 20) * 20;
}

function createFood() {
    foodX = randomTen(0, canvas.width - 20);
    foodY = randomTen(0, canvas.height - 20);

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x === foodX && part.y === foodY;
        if (foodIsOnSnake) createFood();
    });
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -20;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -20;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 20;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 20;
    }
}

function drawScore() {
    const scoreElement = document.getElementById("score");
    scoreElement.innerText = score;
}

function restartGame() {
    snake = [
        { x: 300, y: 300 },
        { x: 280, y: 300 },
        { x: 260, y: 300 },
        { x: 240, y: 300 },
        { x: 220, y: 300 },
    ];
    dx = 20;
    dy = 0;
    score = 0;
    changingDirection = false;
    document.getElementById('game-over').classList.add('hide');
    main();
}
