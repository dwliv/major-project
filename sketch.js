//Final Project
// Dinel Widyaratne
// Date
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let player;
let platforms = [];
let blocks = [];
let coins = []; 
let enemies = [];
let groundLevel = 350;
let gravity = 1;
let collectedCoins = 0;
let gameState = "start";
let windowWidth = 800;
let windowHeight = 500;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  if (gameState === "start") {
    showStartScreen();
  }
  else if (gameState === "run") {
    runGame();
  }
  else if (gameState === "gameOver") {
    gameOverScreen();
  }
}

function runGame() {
  fill(0);
  textSize(13);
  text(`Coins: ${collectedCoins}`, 10, 20);

  //Draw Platforms
  for (let platform of platforms) {
    platform.display();
  }

  //Draw Blocks
  for (let block of blocks) {
    block.display();
  } 

  //Coins
  for (let i = coins.length - 1; i >= 0; i--) {
    coins[i],display();
    if (player.collidesWtih(coins[i])) {
      //Remove Coins when you collect them
      coins.splice(1, i);
      collectedCoins++;
    }
  }

  //Enemies
  for (let enemie of enemies) {
    enemie.display();

    //Collision with enemie
    if (player.collidesWtih(enemie)) {
      gameState = "gameOver";
    }
  }
}

function showStartScreen() {
  fill(0);
  textSize(38);
  textAlign(CENTER, CENTER);
  text("New Super Mario Bros", width / 2, height / 2);
  textSize(22);
  text("Press Enter to Start", width / 2, height / 2);
  textAlign(BOTTOM, CENTER);
}

function gameOverScreen() {
  fill(0);
  textSize(38);
  textAlign(CENTER, CENTER);
  text("Game Over", width/2, height/2);
  textSize(22);
  text("Please press R to restart and hopefully you'll get better and win!");
}

function keyPressed() {
  if (gameState === "start" && key === 'W') {
    gameState = "playing";
  }
}
