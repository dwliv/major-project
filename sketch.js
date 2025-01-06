//Final Project
// Dinel Widyaratne
// Date
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let player;
let flagpole;
let platforms = [];
let blocks = [];
let coins = []; 
let enemies = [];
let groundLevel = 400;
let gravity = 1;
let collectedCoins = 0;
let gameState = "start";
let windowWidth = 800;
let windowHeight = 500;
let marioImg;
let backgroundImg;
let goombaImg;
let blockImg;
let platformImg;
let coinImg;
let questionImg;
let startMusic;
let gameImg;


//makes the camera pan to the left when the player gets too close to the right edge
let cameraX = 0;

//Start button properties
let buttonX = 300;
let buttonY = 250;
let buttonWidth = 200;
let buttonHeight = 50;
let buttonHover = false;

function preload() {
  backgroundImg = loadImage("game.jpg");
  marioImg = loadImage("mario.jpg");
  goombaImg = loadImage("goomba.jpg");
  startMusic = loadSound("startMusic.mp3");
  blockImg = loadImage("block.png");
  platformImg = loadImage("platform.jpg");
  coinImg = loadImage("coin.jpg");
  questionImg = loadImage("question.jpg");
  gameImg = loadImage("sky.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  resetGame();
}

function draw() {
  image(gameImg, 0, 0, width, height);
  if (gameState === "start") {
    showStartScreen();
  }
  else if (gameState === "playing") {
    runGame();
  }
  else if (gameState === "gameOver") {
    gameOverScreen();
  }
}

function showStartScreen() {
  image(backgroundImg, 0 , 0, width, height);
  fill(0);
  textFont('Courier New');
  textAlign(CENTER, CENTER);
  textSize(50);
  text("New Super Mario Bros.", width / 2, height / 5);
  
  //Draw button
  if (buttonHover) {
    fill (112, 233, 86);
  }
  else {
    fill(200, 100, 90);
  }
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 10);

  //Button Text
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Start Game", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
  startMusic.loop();
}

function adjustVolume() {
  startMusic.amp(0.015);
}

function runGame() {
  //Pans the screen when the player si too close to the right side
  cameraX = constrain(player.x - width / 2 + player.w / 2, 0, 1600-width);

  //Saves the current transformation
  push();
  translate(-cameraX, 0);

  fill(0);
  textSize(23);
  text(`Coins: ${collectedCoins}`, 55, 20);
  

  //Draw Platforms
  for (let platform of platforms) {
    platform.display();
  }

  //Draw Blocks
  for (let block of blocks) {
    block.display();
  } 

  //Coins
  for (let i = coins.length-1; i >= 0; i--) {
    coins[i].display();
    if (player.collidesWith(coins[i])) {
      //Remove Coins when you collect them
      coins.splice(1, i);
      collectedCoins++;
    }
  }

  //Enemies
  for (let enemie of enemies) {
    enemies.update();
    enemie.display();
    if (player.collidesWith(enemie)) {
      gameState = "gameOver.";
    }

    //Collision with enemie
    if (player.collidesWith(enemie)) {
      gameState = "gameOver";
    }
  }

  player.update();
  player.display();

  for (let platform of plaforms) {
    if (player.collidesWith(platform)) {
      player.landOn(platform);
    }
  }
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
  player = new Player(50, groundLevel - 40, 40, 40);

  //Reset the platforms
  platforms = [
    new Platform(0, groundLevel, width, 50),
    new Platform(200, 350, 100, 20),
    new Platform(400, 300, 100, 20),
    new Platform(600, 250, 100, 20),
    new Platform(900, 250, 100, 20),
    new Platform(1300, 350, 100, 20),
    new Platform(1600, groundLevel, 400, 50),
  ];

  //Reset the blocks
  blocks = [
    new Block(320, 310),
    new Block(620, 260),
    new Block(920, 210),
    new Block(1320, 310,)
  ];

  //Reset the coins
  coins = [
    new Coin(330, 285),
    new Coin(630, 235),
    new Coin(930, 185),
    new Coin(1330, 285),
    new Coin(1500, 400),
  ];

  //Reset the enemies
  enemies = [
    new Enemy(400, groundLevel - 40, 40, 40, 1),
    new Enemy(700, groundLevel - 40, 40, 40, -1),
    new Enemy(1100, groundLevel - 40, 40, 40, 1),
    new Enemy(1400, groundLevel - 40, 40, 40, -1),
  ];

  //Reset score
  collectedCoins = 0;
}

class Player {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.onGround = false;
  }
  update() {
    //Add gravity
    this.ySpeed += gravity;
    this.y += this.ySpeed;

    //Add horizontal movement
    this.x+= this.xSpeed;

    //Prevents the player from falling below the ground level
    if (this.y + this.h >= groundLevel) {
      this.y = groundLevel - this.h;
      //Stop verticle movement
      this.ySpeed = 0;
      this.onGround = true;
    }
    if (keyIsDown(LEFT_ARROW)) {
      this.xSpeed = -5;
    }
    else if (keyIsDown(RIGHT_ARROW)) {
      this.xSpeed = 5;
    }
    else {
      this.xSpeed = 0;
    }

    //Limits the player's movement to the level bounds
    this.x = constrain(this.x, 0, 1600 - this.w); 
  }
  
  display() {
    image(marioImg, this.x, this.y, this.w, this.h);
  }
  jump() {
    if (this.onGround) {
      this.ySpeed = -15;
      this.onGround = false;
    }
  }

  landOn(platform) {
    this.y = platform.y - this.h;
    this.ySpeed = 0;
    this.onGround = true;
  }
}

class Enemy {
  constructor(x, y, w, h, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
  }

  update() {
    //moves the enemy horizontally by the speed value
    this.x += this.speed;
  }

  display() {
    image(goombaImg, this.x, this.y, this.w, this.h);
  }
}

class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 25;
    this.h = 25;
  }

  display() {
    image(coinImg, this.x + this.w / 2, this.y + this.h / 2, this.w, this.h);
  }
}

class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    image(platformImg, this.x, this.y, this.w, this.h);
  }
}

class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 45;
    this.h = 45;
  }
  display() {
    image(blockImg, this.x, this.y, this.w, this.h);
  }
}

class Flagpole {
  constructor(x, y, h) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.reached = false;
  }
  display() {
    stroke(150);
    strokeWeight(10);
    line(this.x, this.y, this.x, this.y - height);

    if (this.reached) {
      fill(255, 0, 0);
    }
    else {
      fill (255, 255, 0);
    }
    noStroke();
    rect(this.x, this.y - height, 30, 20);
  }
  checkPlayer(player) {
    //Checks if the player has reached the flagpole
    if (player.x + player.w >= this.x && //Right edge of the player
        player.y + player.h >=this.y - this.height //Left egde of the player
    ) {
      this.reached = true;
      return true; //Player reached the flagpole
    }
    return false; //Player has not reached the flagpole
  }
}

function keyPressed() {
  if (gameState === "start" && buttonHover) {
    gameState = "playing";
  }
  else if (gameState === "gameOver" && keyCode === "82") { //82 is they keyCode() for R or r in JavaScript
    resetGame();
    gameState = "start";
  }
  else if (gameState === "playing" && keyCode === "87") { //87 is the keyCode() for W or w in JavaScript
    player.jump();
  }
}

function  mouseMoved() {
  //checks if mouse is over button
  buttonHover = 
  mouseX > buttonX && //Checks if the mouse is past the left edge
  mouseX < buttonX + buttonWidth && //Checks if mouse is before the right edge
  mouseY > buttonY && //Checks if mouse is past the top edge 
   mouseY < buttonY + buttonHeight; //Checks if the mouse is before the bottom edge
}

function mousePressed() {
  if (gameState === "start" && buttonHover) {
    gameState = "playing";
  }
}

