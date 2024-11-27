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
let marioImg;
let backgroundImg;

function preload() {
  backgroundImg = loadImage("game.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background("#406274");
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
    if (player.collidesWith(enemie)) {
      gameState = "gameOver";
    }
  }
}

function showStartScreen() {
  image(backgroundImg, 0 , 0, width, height);
  fill(0);
  textSize(38);
  textAlign(CENTER, CENTER);
  text("New Super Mario Bros", width / 2, height / 2 - 40);
  textSize(22);
  text("Press Enter to Start", width / 2, height / 2);
  textAlign(BOTTOM, CENTER);
}

function gameOverScreen() {
  fill(0);
  textSize(38);
  textAlign(CENTER, CENTER);
  text("Game Over", width/2, height/2 - 40);
  textSize(22);
  text("Please press R to restart and hopefully you'll get better and win!", width / 2, height / 2);
}

function resetGame() {
  //Reset the player
  player = new Player(50, groundLevel - 40, 40, 40); // Create class for Player later

  //Reset the platforms
  platforms = [
    new Platform(0, groundLevel, width, 50),// Create class for Platform later
    new Platform(200, 350, 100, 20),
    new Platform(400, 300, 100, 20),
    new Platform(600, 250, 100, 20),
  ];

  //Reset the coins
  collectedCoins = 0;
}

function keyPressed() {
  if (gameState === "start" && keyCode === ENTER) {
    gameState = "playing";
  }
  else if (gameState === "gameOver" && keyCode === 82) { //82 is they keyCode() for R or r in JavaScript
    resetGame();
    gameState = "start";
  }
  else if (gameState === "playing" && keyCode === 87) { //87 is the keyCode() for W or w in JavaScript
    player.jump();
  }
}
