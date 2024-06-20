// Constants and Variables
const foodSound = new Audio("../assets/music/food.mp3");
const gameOverSound = new Audio("../assets/music/gameover.mp3");
const moveSound = new Audio("../assets/music/move.mp3");
const musicSound = new Audio("../assets/music/music.mp3");

let inputDir = { x: 0, y: 0 };
let speed = 8;
let lastPaintScreen = 0;
let snakeArr = [randomPosition(1, 18, null, "snake")];
let food = randomPosition(2, 16, snakeArr, "food");
let score = 0;
const maxSegments = 18 * 18; // Maximum number of segments

// Utility functions
function randomPosition(min, max, sarr, mode) {
  const x = Math.round(Math.random() * (max - min) + min);
  const y = Math.round(Math.random() * (max - min) + min);

  if (mode === "food") {
    // Check if the random position coincides with any part of the snake
    if (sarr.some((segment) => segment.x === x && segment.y === y)) {
      // Recursively call the function with the same parameters
      return randomPosition(min, max, sarr, "food");
    }
    return { x, y };
  } else if (mode === "snake") {
    return { x, y };
  } else {
    throw new Error("Invalid mode provided");
  }
}

// Function to simulate a win
function simulateWin() {
  snakeArr = [];
  for (let x = 1; x <= 18; x++) {
    for (let y = 1; y <= 18; y++) {
      snakeArr.push({ x, y });
    }
  }
  render();
  if (snakeArr.length === maxSegments) {
    alert("You won!");
    inputDir = { x: 0, y: 0 };
    snakeArr = [{ x: 3, y: 5 }];
    score = 0;
    return;
  }
}

// Game functions
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintScreen) / 1000 < 1 / speed) return;
  lastPaintScreen = ctime;
  gameEngine();
}

function isCollide(sarr) {
  // 1. If the snake collides with a wall
  if (
    sarr[0].x === 0 ||
    sarr[0].x === 18 ||
    sarr[0].y === 0 ||
    sarr[0].y === 18
  )
    return true;

  // 2. If the snake head collides with its own segments
  const isOwnCollided = sarr
    .filter((segment) => segment !== sarr[0])
    .some((segment) => sarr[0].x === segment.x && sarr[0].y === segment.y);
  if (isOwnCollided) return true;

  // 3.
  return false;
}

function gameEngine() {
  // Step 1: Update snake array & food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    alert("Game over. Press any key to continue.");
    snakeArr = [{ x: 3, y: 5 }];
    musicSound.play();
    score = 0;
  }
  // If the snake eats the food
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    // Check if the user has won
    if (snakeArr.length === maxSegments) {
      alert("You won!");
      inputDir = { x: 0, y: 0 };
      snakeArr = [{ x: 3, y: 5 }];
      score = 0;
      return;
    }
    const min = 2;
    const max = 16;
    food = randomPosition(min, max, snakeArr, "food");
  }
  //   Moving snake
  if (isCollide(snakeArr)) return;
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;
  // Step 2: Display snake and food
  //   Displaying snake
  board.innerHTML = "";
  snakeArr.forEach((segment, index) => {
    const segmentBox = document.createElement("div");
    segmentBox.style.gridColumnStart = segment.x;
    segmentBox.style.gridRowStart = segment.y;
    segmentBox.classList.add(index === 0 ? "head" : "snake");

    board.appendChild(segmentBox);
  });
  // Display Food
  const foodElement = document.createElement("div");
  foodElement.style.gridColumnStart = food.x;
  foodElement.style.gridRowStart = food.y;
  foodElement.classList.add("food");

  board.appendChild(foodElement);
}

// Function to render the snake and food
function render() {
  board.innerHTML = "";
  snakeArr.forEach((segment, index) => {
    const segmentBox = document.createElement("div");
    segmentBox.style.gridColumnStart = segment.x;
    segmentBox.style.gridRowStart = segment.y;
    segmentBox.classList.add(index === 0 ? "head" : "snake");

    board.appendChild(segmentBox);
  });
  // Display Food
  const foodElement = document.createElement("div");
  foodElement.style.gridColumnStart = food.x;
  foodElement.style.gridRowStart = food.y;
  foodElement.classList.add("food");

  board.appendChild(foodElement);
}

// Main Logic Starts here
window.requestAnimationFrame(main);
simulateWin(); // Simulate win condition on game start for testing

window.addEventListener("keydown", (e) => {
  moveSound.play();
  musicSound.play();

  switch (e.key) {
    case "ArrowUp":
      if (inputDir.y === 1) return; // Disallow moving up if currently moving down
      inputDir.x = 0;
      inputDir.y = -1;
      break;
    case "ArrowDown":
      if (inputDir.y === -1) return; // Disallow moving down if currently moving up
      inputDir.x = 0;
      inputDir.y = 1;
      break;
    case "ArrowLeft":
      if (inputDir.x === 1) return; // Disallow moving left if currently moving right
      inputDir.x = -1;
      inputDir.y = 0;
      break;
    case "ArrowRight":
      if (inputDir.x === -1) return; // Disallow moving right if currently moving left
      inputDir.x = 1;
      inputDir.y = 0;
      break;
  }
});
