const canvas = document.querySelector(".canva");
const brush = canvas.getContext("2d");
const bgImage = new Image();

const play = document.getElementById("play");
const replay = document.getElementById("replay");

canvas.width = (window.innerWidth * 2) / 3;
canvas.height = (window.innerHeight * 2) / 3;

let arrayOfBubbles = [];
let obstaclesArray = [];
let angle = 0;
let hue = 0;
let obstacleColor = 0;
let jump;
let spacePressed = false;
let steps = 0;
let score = 0;
let scoreColor = 0;

bgImage.src = "https://i.ibb.co/DD5xnSM/flappy-bird-0.jpg";
bgImage.addEventListener("load", () => {
    brush.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
});

class FlappyBird {
    constructor() {
        this.x = canvas.width / 3;
        this.y = canvas.height / 2;
        this.speed = 0;
        this.weight = 0.25;
    }
    update() {
        jump = Math.sin(angle) * 15;
        this.speed += this.weight;
        this.y += this.speed;
        if (this.y > canvas.height - 40 + jump) {
            this.y = canvas.height - 40 + jump;
            this.speed = 0;
        }
        if (this.y < 20 + jump) {
            this.y = 20 + jump;
            this.speed = 0;
        }
        if (spacePressed === true) {
            this.fly();
        }
    }
    bird() {
        brush.fillStyle = "blue";
        brush.fillRect(this.x, this.y, 20, 20);
    }
    fly() {
        this.speed -= 0.5;
    }
}

class Bubbles {
    constructor() {
        this.x = flappybird.x - 5;
        this.y = flappybird.y + 5;
        this.size = Math.random() * 7 + 2;
        this.speed = Math.random() * 1 - 0.5;
    }
    update() {
        this.y += this.speed;
        this.x -= 3;
    }
    drawCircle() {
        brush.fillStyle = `hsla(${hue}, 100%, 50%, 0.6)`;
        // brush.strokeStyle = "black";
        brush.beginPath();
        // brush.lineWidth = 1;
        brush.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // brush.stroke();
        brush.fill();
    }
}

class Obstacles {
    constructor() {
        this.color = `hsl(${obstacleColor}, 100%, 50%)`;
        this.x = canvas.width;
        this.passed = false;
        this.width = (Math.random() * canvas.width) / 5 + 20;
        this.heightOfUpperRect = Math.random() * (canvas.height / 3) + 20;
        this.heightOfLowerRect = Math.random() * (canvas.height / 3) + 20;
    }
    drawRect() {
        brush.fillStyle = this.color;
        brush.fillRect(this.x, 0, this.width, this.heightOfUpperRect);
        brush.fillRect(
            this.x,
            canvas.height - this.heightOfLowerRect,
            this.width,
            this.heightOfLowerRect
        );
    }
    update() {
        this.x -= 3;
        if (this.passed === false && flappybird.x > this.x + this.width) {
            score++;
            this.passed = true;
        }
        this.drawRect();
    }
}

const flappybird = new FlappyBird();
const image = new Image();
image.src = "https://i.ibb.co/m0yyxGy/bang.png";

window.addEventListener("resize", () => {
    canvas.width = (window.innerWidth * 2) / 3;
    canvas.height = (window.innerHeight * 2) / 3;
});

window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        spacePressed = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
        spacePressed = false;
    }
});

play.addEventListener("click", () => {
    play.style.display = "none";
    animate();
});

replay.addEventListener("click", () => {
    replay.style.display = "none";
    flappybird.x = canvas.width / 3;
    flappybird.y = canvas.height / 2;
    flappybird.speed = 0;
    score = 0;
    animate();
});

function initializeBubbles() {
    arrayOfBubbles.push(new Bubbles());
    for (let i = 0; i < arrayOfBubbles.length; i++) {
        arrayOfBubbles[i].drawCircle();
        arrayOfBubbles[i].update();
    }
    if (arrayOfBubbles.length > 250) {
        arrayOfBubbles = [];
    }
}

function initializeObstacles() {
    if (steps % 50 === 0) {
        obstaclesArray.push(new Obstacles());
    }
    for (let i = 0; i < obstaclesArray.length; i++) {
        obstaclesArray[i].update();
    }
    if (obstaclesArray.length > 50) {
        obstaclesArray.splice(0, 25);
    }
}

function detectCollision() {
    for (let i = 0; i < obstaclesArray.length; i++) {
        if (
            flappybird.x < obstaclesArray[i].x + obstaclesArray[i].width &&
            flappybird.x + 20 > obstaclesArray[i].x &&
            ((flappybird.y < obstaclesArray[i].heightOfUpperRect &&
                flappybird.y + 20 > 0) ||
                (flappybird.y + 20 >
                    canvas.height - obstaclesArray[i].heightOfLowerRect &&
                    flappybird.y + 20 < canvas.height))
        ) {
            return true;
        }
    }
}

function animate() {
    brush.clearRect(0, 0, canvas.width, canvas.height);
    initializeObstacles();
    flappybird.bird();
    flappybird.update();
    initializeBubbles();
    brush.fillStyle = `hsl(${scoreColor}, 100%, 50%)`;
    brush.strokeStyle = "black";
    brush.font = "64px Avalon";
    brush.fillText(score, canvas.width - 80, 70);
    brush.strokeText(score, canvas.width - 80, 70);
    if (detectCollision()) {
        brush.drawImage(image, flappybird.x - 15, flappybird.y - 15, 50, 50);
        brush.fillStyle = "black";
        brush.font = "64px Avalon";
        brush.fillText("Game over", canvas.width / 10, canvas.height / 2);
        replay.style.display = "block";
        return;
    }
    angle += 0.15;
    hue++;
    steps++;
    obstacleColor += 10;
    scoreColor += 1;

    requestAnimationFrame(animate);
}
