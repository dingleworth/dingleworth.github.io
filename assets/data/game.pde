 public class Background {
     private PImage img1, img2;
     private int x, y;


     public Background(String firstImgName, String secondImgName) {
         this.img1 = loadImage(firstImgName);
         this.img2 = loadImage(secondImgName);
     }



     public void draw() {
         background(0);
         //if (false) {
         //  image(img1, x, 0, width, height);
         //  image(img2, x+width, 0, width, height);
         //  image(img1, x+(width*2), 0, width, height);
         //} else {
         image(img1, x, y);
         image(img2, x + img2.width, y);
         image(img1, x + img1.width + img2.width, y);
         //}

         x--;

         if (x < -(img1.width + img2.width)) {
             x = 0;
         }
     }
 }

 public class Bird {
     private PImage img;
     private int posX, posY;
     private int vy;

     private int initX, initY;

     public Bird(String imgName, int x, int y) {
         this.img = loadImage(imgName);
         this.initX = x;
         this.initY = y;
         reset();
     }

     public void draw() {
         update();
         image(img, posX, posY);
     }

     public void onClick() {
         vy = -15;
     }

     public void reset() {
         this.posX = this.initX - (this.img.width / 2);
         this.posY = this.initY - (this.img.height / 2);
         this.vy = 0;
     }

     private void update() {
         posY += vy;
         vy += 1;

         if (posY > height - img.height) {
             posY = height - img.height;
             vy = 0;
         }
     }

     private int getY() {
         return this.posY;
     }

     private int getX() {
         return this.posX;
     }

     private int getWidth() {
         return this.img.width;
     }
 }

 Background bg;
 Bird bird;

 boolean gameState, drewFailScreen;

 PImage pipeImg, pipeImgReversed;

 int px, py;

 int currentScore, highScore;



 void setup() {
     size(600, 600);
     bg = new Background("assets/data/flappy/bg1.png", "assets/data/flappy/bg2.png");
     bird = new Bird("assets/data/flappy/libs3.png", width / 2, height / 2);
     pipeImg = loadImage("assets/data/flappy/pipe2.png");
     pipeImgReversed = loadImage("assets/data/flappy/pipe2_flipped.png");

     px = width;
     py = int(random(0, height));


     gameState = true;
 }

 void draw() {
     if (gameState) {
         bg.draw();
         bird.draw();

         drawPipes();

         checkCrash();
         drawScore();
     } else if (!drewFailScreen) {
         drawFailureScreen();
     }
 }

 boolean drawCollisionArea = false;

 void drawPipes() {
     px = px - 3;

     image(pipeImgReversed, px - 25, py - pipeImg.height - 100);
     image(pipeImg, px - 25, py + 100);


     if (px < -50) {
         px = width + 50;
         py = int(random(0, height));
     }

     if (drawCollisionArea) {
         noFill();
         stroke(255, 0, 0);
         // Top pipe collision area
         rect(px - 50, 0, 55 + bird.getWidth(), py - 110);

         // Bottom pipe collision area
         rect(px - 50, py + 110, 55 + bird.getWidth(), height - (py + 110));

         fill(255, 0, 0);
         circle(px, py, 10);
     }
 }

 void drawFailureScreen() {
     drewFailScreen = true;
     color bgColor = color(200, 200);
     color textColor = color(0);

     fill(bgColor);
     rect(0, 0, width, height);

     fill(textColor);
     textSize(64);
     textAlign(CENTER);
     text("Game Over!", width / 2, height / 2);

     textSize(32);
     text("Score: " + currentScore + ", High Score: " + highScore, width / 2, height / 2 + 64);
     text("Click to restart", width / 2, height / 2 + 112);
 }

 void drawScore() {
     color textColor = color(255);
     fill(textColor);
     textAlign(LEFT);
     textSize(28);
     text("Score: " + currentScore, 20, 32);
 }

 boolean hasPassedThroughCurrentPipe = false;

 void checkCrash() {
     if (px < bird.getX() + bird.getWidth() && px > bird.getX() - 50) {
         if (bird.getY() < py - 110 || bird.getY() > py + 110) {
             onFail();
             return;
         } else if (!hasPassedThroughCurrentPipe) {
             hasPassedThroughCurrentPipe = true;
             currentScore++;
         }
     } else {
         hasPassedThroughCurrentPipe = false;
     }
 }

 void onFail() {
     gameState = false;

     window.adController.startAd();
     if (currentScore > highScore) {
         highScore = currentScore;
     }
 }

 void resetGame() {
     rectMode(CORNER);
     bird.reset();
     gameState = true;
     drewFailScreen = false;
     currentScore = 0;
     px = width;
     py = int(random(0, height));
 }

 void mousePressed() {
     if (!gameState) {
         resetGame();
     } else {
         bird.onClick();
     }
 }