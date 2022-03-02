var gameState = 0;

var jump, die, checkpoint;
var gameOver, restart;
var gameOverImg, restartImg;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cacto;
var cloudImg, cloud;
var score;
var obs1, obs2, obs3, obs4, obs5, obs6;
var grupodecactos;
var grupodenuvens;
var score = 0;

function preload() {

  trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");

  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkpoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  gameOver = createSprite(windowWidth - 650, 100, 10, 10);
  gameOver.addImage("game over", gameOverImg);
  gameOver.scale = 1.5;
  
  restart = createSprite(windowWidth - 650, 130, 10, 10);
  restart.addImage("reiniciar", restartImg);
  restart.scale = 0.4;

  //crie um sprite de trex
  trex = createSprite(windowWidth / 15, windowHeight / 4, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addImage("collide", trex_collided);
  trex.scale = 0.5;

  //crie um sprite ground (solo)
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -6;

  //crie um solo invisível
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  //gerar números aleatórios
  var r = Math.round(random(1, 100));

  grupodecactos = createGroup();
  grupodenuvens = createGroup();

  trex.setCollider("rectangle", 0, 0, 100, 100);
}

function draw() {
  //definir cor de fundo
  background(180);

  text("score: " + score, windowWidth - 100, 20);
  
  
  if (gameState === 0) {
    score = score + round(frameCount % 5);
    
    gameOver.visible = false;
    restart.visible = false;
    
    trex.changeAnimation("running");
    
    // pular quando tecla espaço for pressionada
    if (keyDown("space") && trex.y >= 150 && touches.length > 0) {
      trex.velocityY = -15;
      touches = [];
      jump.play();
    }

    trex.velocityY = trex.velocityY + 0.8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (score > 0 && score % 800 === 0){
      checkpoint.play();
    }

    ground.velocityX = -(4 + 3* score / 100);

    //impedir que o trex caia
    trex.collide(invisibleGround);

    //gerar as nuvens
    spawnClouds();

    cactos();

    if (trex.isTouching(grupodecactos)) {
      gameState = 1;

      die.play();
    }
  }

  if (gameState === 1) {

    gameOver.visible = true;
    restart.visible = true;
    
    trex.collide(invisibleGround);
    
    trex.velocityY = trex.velocityY + 0.8;

    ground.setVelocity(0, 0);
    grupodenuvens.setVelocityXEach(0);
    grupodecactos.setVelocityXEach(0);

    trex.changeAnimation("collide");
    
    grupodenuvens.setLifetimeEach(-1);
    grupodecactos.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {

      grupodecactos.destroyEach();
      grupodenuvens.destroyEach();
      
      gameState = 0;
    }  
  }

  drawSprites();
}

//função para gerar as nuvens
function spawnClouds() {
  // escreva seu código aqui
  if (frameCount % 60 === 0) {
    cloud = createSprite(windowWidth, windowHeight, 40, 10);
    cloud.addImage("nuvens", cloudImg);
    cloud.y = random(10, 60);
    cloud.scale = 0.4;
    cloud.velocityX = -3;

    cloud.lifetime = 500;
    grupodenuvens.add(cloud);
  }
}

function cactos() {
  if (frameCount % 70 === 0) {
    cacto = createSprite(windowWidth, 160, 10, 35);
    cacto.velocityX = -6;
    cacto.scale = 0.5;
    grupodecactos.add(cacto);

    var r = round(random(1, 6));

    switch (r) {
      case 1:
        cacto.addImage(obs1);
        break;
      case 2:
        cacto.addImage(obs2);
        break;
      case 3:
        cacto.addImage(obs3);
        break;
      case 4:
        cacto.addImage(obs4);
        break;
      case 5:
        cacto.addImage(obs5);
        break;
      case 6:
        cacto.addImage(obs6);
      default:
        break;
    }
    cacto.lifetime = 500;
  }
}
