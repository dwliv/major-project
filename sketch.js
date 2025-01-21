//Final Project
// Dinel Widyaratne
// Date
// Extra for Experts:
// - describe what you did to take this project "above and beyond"



//game variables
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
let timer = 15;

//Image variables
let marioImg;
let backgroundImg;
let goombaImg;
let blockImg;
let platformImg;
let coinImg;
let flagImg;
let questionImg;
let gameImg;
let sadImg;
let happyImg;

//Sound variables
let startMusic;
let deathSound;
let winSound;
let coinSound;
let menuMusic;
let jumpSound;
let killSound;


//Camera position for panning horizontally
let cameraX = 0;

//Start button property variables
let buttonX = 300;
let buttonY = 250;
let buttonWidth = 200;
let buttonHeight = 50;
let buttonHover = false;

function preload() {
  backgroundImg = loadImage("start.jpg");
  marioImg = loadImage("mario.png");
  goombaImg = loadImage("goomba.png");
  startMusic = loadSound("music.mp3");
  blockImg = loadImage("block.png");
  platformImg = loadImage("platform.png");
  coinImg = loadImage("coin.png");
  questionImg = loadImage("question.jpg");
  gameImg = loadImage("game.jpg");
  sadImg = loadImage("sad.png");
  happyImg = loadImage("happy.png");
  flagImg = loadImage("flag.png");
  deathSound = loadSound("death.mp3");
  winSound = loadSound("win.mp3");
  coinSound = loadSound("coinSnd.mp3");
  menuMusic = loadSound("startSnd.mp3");
  jumpSound = loadSound("jumpSnd.mp3");
  killSound = loadSound("killSnd.mp3");
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
    if (frameCount % 60 === 0 && timer > 0) {
      timer--;
    }

    if (timer === 0) {
      gameState = "gameOver";
    }
    
    runGame();
  
  }
  else if (gameState === "gameOver") {
    gameOverScreen();
  
  }
  else if (gameState === "win") {
    showWinScreen();
  }
}

function showStartScreen() {
  image(backgroundImg, 0 , 0, width, height);
  fill(0);
  textFont('Courier New');
  textAlign(CENTER, CENTER);
  textSize(50);
  text("New Super Mario Bros.", width / 2, height / 5 - 50);
  
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
  winSound.amp(1);
  coinSound.amp(1);
  jumpSound.amp(0.015);
  killSound.amp(1);
}

function runGame() {
  //Pans the screen when the player is too close to the right side
  cameraX = constrain(player.x - width / 2 + player.w / 2, 0, 3200 - width); //Center the player in the screen and doesn't overpan

  //creates the panning to make the player in the center of the screen when it's moving
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
      coins.splice(i, 1);
      coinSound.play();
      collectedCoins++;
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].display();
    
    //Checks if player collides with enemy from the top
    if (player.collidesWith(enemies[i])) {
      //Check if the player lands on top
      if (player.y + player.h <= enemies[i].y + 10) {
        enemies.splice(i, 1);
        killSound.play();
        player.ySpeed = -10;
      }
      else {
        gameState = "gameOver";
        deathSound.play();
      }
    }
  }

  player.update();
  player.display();

 

  for (let platform of platforms) {
    if (player.collidesWith(platform)) {
      player.landOn(platform);
    }
  }

  //Makes the flagpole
  flagpole.display();
  if (player.collidesWith(flagpole)) {
    gameState = "win";
    winSound.play();
    
  }
  pop();

  //Displays the score
  fill(0);
  textSize(23);
  text(`Coins: ${collectedCoins}`, 70, 20);

  //Display timer
  if (timer <= 10) {
    fill("red");
  }
  else {
    fill("black");
  }
  textSize(20);
  text(`Time: ${timer}`, width - 100, 20); 
}



function gameOverScreen() {
  clear();
  setup();
  background("black");
  textAlign(CENTER, CENTER);
  textSize(45);
  fill("red");
  text("GAME OVER", width / 2, height / 2 - 120);
  textSize(35);
  fill("red");
  text("Please hit r or R to restart.", width / 2, height / 2 - 75);
  image(sadImg, width/ 2 - 150, height / 2 - 5);
  startMusic.stop();
}

function showWinScreen() {
  clear();
  setup();
  background(0);
  textAlign(CENTER, CENTER);
  textSize(27);
  text("Congratulations! You have beaten the level!", width / 2, height / 2 - 150);
  textSize(20);
  text("Press r or R to restart", width / 2, height / 2 - 50);
  image(happyImg, width / 2 - 150, height / 2);
  startMusic.stop();
}

function resetGame() {
  //Reset the player
  player = new Player(50, groundLevel - 40, 40, 40);

  //Reset the platforms
  platforms = [
    new Platform(0, 375, 200, 50),
    new Platform(250, 300, 100, 20),
    new Platform(400, 300, 100, 20),
    new Platform(600, 250, 100, 20),
    new Platform(900, 250, 100, 20),
    new Platform(1100, 300, 100, 20),
    new Platform(1300, 350, 100, 20),
    new Platform(1600, 375, 400, 50),
    new Platform(2000, 300, 100, 20),
    new Platform(2400, 250, 100, 20),
    new Platform(2600, 200, 100, 20),
    new Platform(2800, 300, 100, 20),
    new Platform(3000, 350, 100, 20),
  ];

  //Reset the blocks
  blocks = [
    new Block(320, 310),
    new Block(530, 260),
    new Block(920, 300),
    new Block(1320, 210),
    new Block(1500, 300),
    new Block(1650, 285),
    new Block(1800, 190),
    new Block(2500, 152),
    new Block(2800, 200),
  ];

  //Reset the coins
  coins = [
    new Coin(330, 185),
    new Coin(630, 135),
    new Coin(930, 185),
    new Coin(1330, 285),
    new Coin(1400, 300),
    new Coin(2100, 285),
    new Coin(2500, 235),
    new Coin(2900, 185),
    new Coin(3100, 350),
  ];

  //Reset the enemies
  enemies = [
    new Enemy(400, groundLevel - 40, 40, 40, 1),
    new Enemy(700, groundLevel - 40, 40, 40, -1),
    new Enemy(1100, groundLevel - 40, 40, 40, 1),
    new Enemy(1400, groundLevel - 40, 40, 40, -1),
    new Enemy(2100, groundLevel - 40, 40, 40, -1),
    new Enemy(2500, groundLevel - 40, 40, 40, -1),
    new Enemy(2900, groundLevel- 40, 40, 40, -1),
  ];

  flagpole = new Flagpole(3100, groundLevel - 200, 10, 200);

  //Reset score
  collectedCoins = 0;
  timer = 15;
  cameraX = 0;
}

class Player {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
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

    //keep the player within the level bounds
    this.x = constrain(this.x, 0, 3200 - this.w);

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
  }
  
  display() {
    image(marioImg, this.x, this.y, this.w, this.h);
  }
  jump() {
    if (this.onGround) {
      this.ySpeed = -15; //makes you go high
      this.onGround = false; //Player is no longer on the ground after you jump
      jumpSound.play();
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

    //makes sure the enemy doesn't go off the screen
    if (this.x <= 0 || this.x + this.w >= 3200) {
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
    this.w = 20;
    this.h = 20;
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
    this.w = 40;
    this.h = 40;
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
    image(flagImg, this.x, this.y - 40, this.w + 50, this.h + 50);
  }
}

function keyPressed() {
  if (key === ' ') {
    player.jump();
  }
  else if ((gameState === "gameOver" || gameState === "win") && (key === 'R' || key === 'r')) {
    gameState = "playing";
    startMusic.play();
    deathSound.stop();
    winSound.stop();
    menuMusic.stop();
    resetGame();
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

