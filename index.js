const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const startBtn = document.querySelector("#startBtn");
const gameSound = document.querySelector("#gameSound");
const eatSound = document.querySelector("#eatSound");
const gameOverSound = document.querySelector("#gameOverSound");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "lightgrey";
const snakeColor = "lightskyblue";
const snakeBorder = "black";
const foodColor = "orange";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
startBtn.addEventListener("click", gameStart);

function gameStart() {
    if (!running) { 
        running = true;
        score = 0; 
        xVelocity = unitSize; 
        yVelocity = 0;
        scoreText.textContent = score; 
        snake = [ 
            {x: unitSize * 4, y: 0},
            {x: unitSize * 3, y: 0},
            {x: unitSize * 2, y: 0},
            {x: unitSize, y: 0},
            {x: 0, y: 0},
        ];
        createFood();
        drawFood();
        gameSound.play();
        nextTick(); 
    }
};

function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100);
    }
    else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.clearRect(0, 0, gameWidth, gameHeight); 
};
function createFood(){
    let foundCollision = true;
  while (foundCollision) {
    foundCollision = false; 

    
    foodX = Math.round((Math.random() * (gameWidth - unitSize)) / unitSize) * unitSize;
    foodY = Math.round((Math.random() * (gameHeight - unitSize)) / unitSize) * unitSize;

   
    for (let i = 0; i < snake.length; i++) {
      const snakePart = snake[i];
      if (foodX === snakePart.x && foodY === snakePart.y) {
        foundCollision = true; 
        break;
      }
    }
  }

};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.beginPath();
    ctx.arc(foodX + unitSize / 2, foodY + unitSize / 2, unitSize / 2, 0, 2 * Math.PI);
    ctx.fill();
};
function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    
    snake.unshift(head);
    
    if(snake[0].x == foodX && snake[0].y == foodY){
        score+=1;
        scoreText.textContent = score;
        createFood();
        eatSound.play();
    }
    else{
        snake.pop();
    }     
};
function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    const head = snake[0];
    ctx.beginPath();
    ctx.arc(head.x + unitSize / 2, head.y + unitSize / 2, unitSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    
    for (let i = 1; i < snake.length; i++) {
        const part = snake[i];
        ctx.beginPath();
        ctx.moveTo(part.x + 15, part.y);
        ctx.arcTo(part.x + unitSize, part.y, part.x + unitSize, part.y + unitSize, 15);
        ctx.arcTo(part.x + unitSize, part.y + unitSize, part.x, part.y + unitSize, 15);
        ctx.arcTo(part.x, part.y + unitSize, part.x, part.y, 15);
        ctx.arcTo(part.x, part.y, part.x + unitSize, part.y, 15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

    }
};
function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};
function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
                running = false;
                break;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
    if (!running) { 
        gameOverSound.play();
    }
};
function displayGameOver(){
    ctx.font = "50px Times New Roman, serif"; 
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!!!", gameWidth / 2, gameHeight / 2);
    gameSound.pause();
    gameSound.currentTime = 0;
    running = false;
};
function resetGame(){
    gameStart();
};

