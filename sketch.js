var backgroundImg, characterImg, triImg, gemImg, gameOverImg
var bg, character, gem, gameOver, progress
var obstacles, platforms, gems, pads, edges
var winSound, loseSound, jumpSound, collectSound, music
var gameState = 1
var score = 0
var gemAmount = 0

function preload() {
  backgroundImg = loadImage("assets/background1.jpeg")
  characterImg = loadImage("assets/character.png")
  triImg = loadImage("assets/Triangle.png")
  gemImg = loadImage("assets/gem.gif")
  gameOverImg = loadImage("assets/gameOver2.gif")

  music = loadSound("SFX/music.mp3")
  jumpSound = loadSound("SFX/jump.wav")
  loseSound = loadSound("SFX/lose.wav")
  winSound = loadSound("SFX/win.wav")
  collectSound = loadSound("SFX/collect.wav")
}

function setup() 
{
  createCanvas(1200,600);
  
  character = createSprite(200,550)
  character.addImage(characterImg)
  character.scale = 0.2

  gameOver = createSprite(width/2,height/2)
  gameOver.addImage(gameOverImg)
  gameOver.visible = false

  ground = createSprite(width/2,height-10,width,20)

  edges = createEdgeSprites()
  
  obstacles = new Group()
  gems = new Group()
  platforms = new Group()
  pads = new Group()
  fakePlatforms = new Group()

  startGame()
}

function draw() 
{
  background(backgroundImg)

  character.collide(ground)

  rectMode(CENTER)
  rect(width/2,50,300,25)
  rectMode(CORNER)
  fill("blue")
  rect(450,38,score,25)

  character.velocityY += 0.6
  if (gameState == 1) {
    if (frameCount % 3 == 0) {
      score += 1
    }
  
    if (keyWentDown(UP_ARROW) && character.y > 540) {
      character.velocityY = -15
    }

    if (character.overlap(platforms,function() {
      character.collide(platforms)
      if (keyWentDown(UP_ARROW)) {
        character.velocityY = -15
      }
    })) {}
    
    if (character.overlap(obstacles,function() {
      gameState = 2
      loseSound.play()
    })) {}

    if (character.overlap(gems,function(collider,collided) {
        collectSound.play()
        collided.remove()
        gemAmount += 1
    })) {}

    if (character.isTouching(pads)) {
      jumpSound.play()
      character.velocityY = -25
    }

    if (character.x < 0) {
      loseSound.play()
      gameState = 2
    }

    if (score == 300) {
      winSound.play()
      gameState = 3
    }

  }
  else if (gameState == 2) {
    gameOver.visible = true
    obstacles.setVelocityXEach(0)
    platforms.setVelocityXEach(0)
    gems.setVelocityXEach(0)
    pads.setVelocityXEach(0)
    fakePlatforms.setVelocityXEach(0)
  }
  else {
    push()
    fill("yellow")
    textSize(40)
    text("YOU WON!",510,280)
    pop()

    obstacles.setVelocityXEach(0)
    platforms.setVelocityXEach(0)
    gems.setVelocityXEach(0)
    pads.setVelocityXEach(0)
    fakePlatforms.setVelocityXEach(0)
  }
  drawSprites()

  push()
  textSize(30)
  fill("white")
  text("Press up arrow to jump!",50,50)
  pop()

  push()
  textSize(30)
  fill("white")
  text("Gems: " + gemAmount,900,50)
  pop()

  if (!music.isPlaying()) {
    music.play()
  }
  
}

function startGame() {
  spawnObstacles(width,550)
  spawnObstacles(width+80,550)

  spawnObstacles(width+600,550)

  spawnPlatforms(width+800,550,300,80)
  spawnPlatforms(width+1700,400,width,80)

  spawnObstacles(width+1700,325)
  spawnObstacles(width+1780,325)
  
  spawnGem(width+1780,545)

  spawnObstacles(width+2800,550)
  spawnObstacles(width+2880,550)
  spawnObstacles(width+2960,550)

  spawnObstacles(width+3500,550)
  spawnObstacles(width+3580,550)
  spawnObstacles(width+3660,550)
  spawnObstacles(width+3740,550)

  spawnPlatforms(width+5000,550,1000,80)
  spawnFake(width+5300,470,800,80)
  spawnPlatforms(width+5300,430,800,10)
  spawnPlatforms(width+5500,385,400,80)
  spawnGem(width+5500,480)

  spawnJumpPad(width+6500,575,400,20)

  spawnPlatforms(width+7100,100,600,40)

  spawnFake(width+8020,height/2,50,height)
}

function spawnObstacles(x,y) {
  obstacle = createSprite(x,y)
  obstacle.addImage("tri",triImg)
  obstacle.scale = 0.2
  obstacle.velocityX = -10
  obstacles.add(obstacle)
}

function spawnPlatforms(x,y,w,h) {
  platform = createSprite(x,y,w,h)
  platform.velocityX = -10
  platforms.add(platform)
}

function spawnFake(x,y,w,h) {
  fakePlatform = createSprite(x,y,w,h)
  fakePlatform.velocityX = -10
  fakePlatform.shapeColor = rgb(145,144,144)
  fakePlatforms.add(fakePlatform)
}

function spawnGem(x,y) {
  gem = createSprite(x,y)
  gem.addImage(gemImg)
  gem.velocityX = -10
  gems.add(gem)
}

function spawnJumpPad(x,y,w,h) {
  jump = createSprite(x,y,w,h)
  jump.shapeColor = "green"
  jump.velocityX = -10
  pads.add(jump)
}
