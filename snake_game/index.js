const canvas = snake_game;
const context = canvas.getContext("2d");

const COLORS = {
  board: "#161d2a",
  grid: "#1f2838",
  snakeHead: "#3dd68c",
  snakeBody: "#2a9d63",
  snakeBodyAlt: "#248f58",
  food: "#fbbf24",
  foodGlow: "rgba(251, 191, 36, 0.25)",
};

class Scene {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.canvas.width = "800";
    this.canvas.height = "800";
    this.entities = [];
    this.stopAnimate = false;
    this.food = new class_food(this);
    this.direction = "";
    this.score = 0;

    this.snake_speed = 50;

    this.snake_body = null;
  }

  drawBoard() {
    const { context, canvas } = this;
    context.fillStyle = COLORS.board;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const cell = 40;
    context.strokeStyle = COLORS.grid;
    context.lineWidth = 1;
    context.beginPath();
    for (let x = cell; x < canvas.width; x += cell) {
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
    }
    for (let y = cell; y < canvas.height; y += cell) {
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
    }
    context.stroke();
  }

  clearCanvas() {
    this.drawBoard();
  }

  updateScore() {
    const el = document.getElementById("score");
    if (el) el.textContent = String(this.score);
  }
  setGameObject(entity) {
    // this recieve an entire linkedList object
    this.snake_body = entity;
  }

  gameOver() {
    this.stopAnimate = true;
    const overlay = document.getElementById("game-over");
    const finalScore = document.getElementById("final-score");
    if (finalScore) finalScore.textContent = String(this.score);
    if (overlay) {
      overlay.classList.add("visible");
      overlay.setAttribute("aria-hidden", "false");
    }
  }
  //what i want is to check colisioin b/w food and snake
  gameBorder() {
    const snake = this.snake_body.Head;
    if (!snake) return;
    const x1 = snake.posX + snake.width / 2;
    const y1 = snake.posY + snake.height / 2;
    const x2 = this.food.posX + this.food.width / 2;
    const y2 = this.food.posY + this.food.height / 2;
    const distance = Math.hypot(x2 - x1, y2 - y1); // use + inside sqrt
    // console.log(x2,x1,y2,y1);
    console.log(distance);

    if (distance <= 70) {
      this.food.spawn();
      this.score += 10;
      this.updateScore();
      this.snake_speed += 0.005;
      this.snake_body.appendLL(
        this,
        this.snake_body.Head.posX,
        this.snake_body.Head.posY,
      );
    }
  }

  renderAnimation() {
    if (this.stopAnimate) return;
    this.gameBorder();
    this.clearCanvas();
    this.food.draw();
    this.snake_body.moveHead_rest_follow(this.snake_speed);
  }
}

//Linked list of game_objects forms body of snake
class snake {
  constructor() {
    this.Head = null;
  }
  appendLL(scene, posX, posY) {
    const newNode = new Game_object(scene, posX, posY);

    if (!this.Head) {
      this.Head = newNode;
      newNode.isHead = true;
    } else {
      newNode.next = this.Head;
      this.Head = newNode;
    }
  }

  moveHead_rest_follow(speed
  ) {
    let tempX = this.Head.posX;
    let tempY = this.Head.posY;
    let current = this.Head;
    this.Head.move(speed);
    // this.Head.color="red"

    let segmentIndex = 0;
    while (current) {
      current.isHead = segmentIndex === 0;
      current.draw(segmentIndex);
      segmentIndex++;
      if (current.next) {
        //just checking 
        if (
          current.next.posX == this.Head.posX &&
          current.next.posY == this.Head.posY
        ) {
          // scene.gameOver();
          current.next=null
          console.log("game over");
          return;
        }
        let anotherTempX = current.next.posX;
        let anotherTempY = current.next.posY;
        current.next.posX = tempX;
        current.next.posY = tempY;
        tempX = anotherTempX;
        tempY = anotherTempY;
      }
      current = current.next;
    }
  }

  // Check_hit_itself(){

  // }
}

class Game_object {
  constructor(scene, posX, posY) {
    //this next points to next node ("game_object")
    this.next = null;

    this.height = 50;
    this.width = 50;
    this.isHead = false;
    this.scene = scene;
    this.posX = posX || 0;
    this.posY = posY || 0;
  }

  draw(segmentIndex = 0) {
    const ctx = this.scene.context;
    const pad = 3;
    const x = this.posX + pad;
    const y = this.posY + pad;
    const w = this.width - pad * 2;
    const h = this.height - pad * 2;
    const r = 8;

    ctx.fillStyle = this.isHead
      ? COLORS.snakeHead
      : segmentIndex % 2 === 0
        ? COLORS.snakeBody
        : COLORS.snakeBodyAlt;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();

    if (this.isHead) {
      ctx.fillStyle = "rgba(12, 15, 20, 0.85)";
      const eye = 4;
      const offset = 10;
      if (game.direction === "ArrowLeft" || game.direction === "") {
        ctx.beginPath();
        ctx.arc(x + offset, y + h / 2 - 6, eye, 0, Math.PI * 2);
        ctx.arc(x + offset, y + h / 2 + 6, eye, 0, Math.PI * 2);
        ctx.fill();
      } else if (game.direction === "ArrowRight") {
        ctx.beginPath();
        ctx.arc(x + w - offset, y + h / 2 - 6, eye, 0, Math.PI * 2);
        ctx.arc(x + w - offset, y + h / 2 + 6, eye, 0, Math.PI * 2);
        ctx.fill();
      } else if (game.direction === "ArrowUp") {
        ctx.beginPath();
        ctx.arc(x + w / 2 - 6, y + offset, eye, 0, Math.PI * 2);
        ctx.arc(x + w / 2 + 6, y + offset, eye, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x + w / 2 - 6, y + h - offset, eye, 0, Math.PI * 2);
        ctx.arc(x + w / 2 + 6, y + h - offset, eye, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  checkCollision() {
    this.posX > this.scene.canvas.width - this.width ||
    this.posX < 0 ||
    this.posY > this.scene.canvas.height - this.height ||
    this.posY < 0
      ? this.scene.gameOver()
      : "";
  }

  move(speed) {
    this.checkCollision();

    switch (game.direction) {
      case "ArrowLeft":
        if (game.direction == "ArrowRight") break;
        this.posX -= speed;
        break;
      case "ArrowRight":
        if (game.direction == "ArrowLeft") break;
        this.posX += speed;
        break;
      case "ArrowUp":
        if (game.direction == "ArrowDown") break;
        this.posY -= speed;
        break;
      case "ArrowDown":
        if (game.direction == "ArrowUp") break;
        this.posY += speed;
        break;
    }
  }
}

class class_food {
  constructor(scene) {
    this.scene = scene;
    this.width = 50;
    this.height = 50;
    this.posX = Math.random() * this.scene.canvas.width - this.width;
    this.posY = Math.random() * this.scene.canvas.height - this.height;
    // this  
  }

  draw() {
    const ctx = this.scene.context;
    const cx = this.posX + this.width / 2;
    const cy = this.posY + this.height / 2;
    const radius = this.width / 2 - 4;

    ctx.fillStyle = COLORS.foodGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLORS.food;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.beginPath();
    ctx.arc(cx - 6, cy - 6, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  move() {}
  spawn() {
    this.posX = Math.random() * (this.scene.canvas.width - this.width);
    this.posY = Math.random() * (this.scene.canvas.height - this.height);
  }
}
