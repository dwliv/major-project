//Final Project
// Dinel Widyaratne
// Date
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


//type in terminal in the spotlight then press enter to enter the console on mac
//To download eslint on mac go to wmci comp sci, go to "setting up work environment" add cs30-p5 then downnload nodes.js
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

//Image variables
let marioImg;
let backgroundImg;
let goombaImg;
let blockImg;
let platformImg;
let coinImg;
let questionImg;
let gameImg;

//Sound variables
let startMusic;
let deathSound;


//makes the camera pan to the left when the player gets too close to the right edge
let cameraX = 0;

//Start button properties
let buttonX = 300;
let buttonY = 370;
let buttonWidth = 200;
let buttonHeight = 50;
let buttonHover = false;

function preload() {
  backgroundImg = loadImage("games.jpg");
  marioImg = loadImage("mario.png");
  goombaImg = loadImage("goomba.png");
  startMusic = loadSound("music.mp3");
  blockImg = loadImage("block.png");
  platformImg = loadImage("platform.png");
  coinImg = loadImage("coin.png");
  questionImg = loadImage("question.jpg");
  gameImg = loadImage("sky.jpg");
  deathSound = loadSound("death.mp3");
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
  deathSound.amp(1);
}

function runGame() {
  //Pans the screen when the player is too close to the right side
  cameraX = constrain(player.x - width / 2 + player.w / 2, 0, 1600-width);

  //Saves the current transformation
  push();
  translate(-cameraX, 0);
  
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
    enemie.update();
    enemie.display();
    
    //Collision
    if (player.collidesWith(enemie)) {
      gameState = "gameOver";
      deathSound.play();
    }
  }

  player.update();
  player.display();

  for (let platform of platforms) {
    if (player.collidesWith(platform)) {
      player.landOn(platform);
    }
    pop();

    //Displays the score
    fill(0);
    textSize(23);
    text(`Coins: ${collectedCoins}`, 70, 20);
  }

  //Makes the flagpole
  flagpole.display();
  if (player.collidesWith(flagpole)) {
    gameState = "start";
    resetGame();
    console.log("Congratulations! You've beaten the level!");
  }
}


function gameOverScreen() {
  fill(0);
  textSize(38);
  textAlign(CENTER, CENTER);
  text("Game Over", width/2, height/2 - 40);
  textSize(12);
  text("Please press R or r to restart and hopefully you'll get better and win!", width / 2, height / 2);
  startMusic.stop();
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
    new Coin(330, 185),
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

  flagpole = new Flagpole(1750, groundLevel - 200, 10, 200);

  //Reset score
  collectedCoins = 0;
}

class Player {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 75;
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
      this.ySpeed = -15; //makes you go high
      this.onGround = false; //PLayer is no longer on the ground after you jump
    }
  }
  collidesWith(object) {
    return this.x < object.x + object.w && this.x + this.w > object.x && this.y < object.y + object.h && this.y + this.h > object.y;
  }

  landOn(platform) {
    this.y = platform.y - this.h; //Places player on top of the platform
    this.ySpeed = 0; // stops the verticle movement making you land on the platform
    this.onGround = true; // You are now on the ground allowing you to jump again
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

    //makes sure the enemy doesn;t go off the screen
    if (this.x <= 0 || this.x + this.w >= 1600) {
      this.speed *= -1;
    }
  }


  display() {
    image(goombaImg, this.x, this.y, 50, 50);
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
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    //Draw the flagpole
    fill(255, 255, 255);
    rect(this.x, this.y, this.w, this.h);
    
    fill(255, 0, 0);
    triangle(this.x + this.w, this.y, this.x + this.w + 30, this.y + 15, this.x + this.w, this.y + 30);
  }
}

function keyPressed() {
  if (key === ' ') {
    player.jump();
  }
  if (gameState === "start" && buttonHover) {
    gameState = "playing";
  }
  if (keyCode === ' ') {
    player.jump();
  }
  else if (gameState === "gameOver" && key === "r" || key === 'R') { //82 is they keyCode() for R or r in JavaScript
    resetGame();
    gameState = "playing";
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

