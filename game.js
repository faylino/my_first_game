//Game Variables
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let spaceship = { x: 370, y: 500, width: 50, height: 50, speed: 5 };
let asteroids = [];
let score = 0;
let gameInterval;
let asteroidInterval;
let gameRunning = false;
let stars = [];

// Start and Reset Game
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("resetBtn").addEventListener("click", resetGame);

// Controls
document.addEventListener("keydown", moveSpaceship);

function moveSpaceship(e) {
    if (e.key === "ArrowLeft" && spaceship.x > 0) {
        spaceship.x -= spaceship.speed;
    }
    if (e.key === "ArrowRight" && spaceship.x < canvas.width - spaceship.width) {
        spaceship.x += spaceship.speed;
    }
}

function startGame() {
    gameRunning = true;
    document.getElementById("startBtn").style.display = "none";
    document.getElementById("resetBtn").style.display = "block";
    score = 0;
    spaceship.x = 370;
    spaceship.y = 500;
    asteroids = [];
    stars = generateStars(100); // Generate 100 stars
    gameInterval = setInterval(gameLoop, 1000 / 60);
    asteroidInterval = setInterval(generateAsteroids, 2000);
}

function resetGame() {
    clearInterval(gameInterval);
    clearInterval(asteroidInterval);
    gameRunning = false;
    document.getElementById("startBtn").style.display = "block";
    document.getElementById("resetBtn").style.display = "none";
    document.getElementById("score").textContent = "Score: 0";
}

// Function to generate stars
function generateStars(numStars) {
    let starArray = [];
    for (let i = 0; i < numStars; i++) {
        starArray.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.2,
        });
    }
    return starArray;
}

function generateAsteroids() {
    let size = Math.random() * 50 + 30;
    let x = Math.random() * (canvas.width - size);
    asteroids.push({ x, y: -size, size, speed: Math.random() * 2 + 2 });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Stars
    drawStars();

    // Update Asteroids
    asteroids.forEach(asteroid => {
        asteroid.y += asteroid.speed;
        ctx.fillStyle = "#7f8c8d";
        ctx.fillRect(asteroid.x, asteroid.y, asteroid.size, asteroid.size);
    });

    // Update Spaceship
    ctx.fillStyle = "#f39c12";
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    // Check Collision
    for (let asteroid of asteroids) {
        if (
            spaceship.x < asteroid.x + asteroid.size &&
            spaceship.x + spaceship.width > asteroid.x &&
            spaceship.y < asteroid.y + asteroid.size &&
            spaceship.y + spaceship.height > asteroid.y
        ) {
            resetGame();
            alert("Game Over! Final Score: " + score);
            return;
        }
    }

    // Update Score
    score++;
    document.getElementById("score").textContent = "Score: " + score;

    // Remove off-screen asteroids
    asteroids = asteroids.filter(asteroid => asteroid.y < canvas.height);

    // Increase difficulty
    if (score % 100 === 0) {
        spaceship.speed += 0.1;
    }
}

// Function to draw stars on the canvas
function drawStars() {
    ctx.fillStyle = "white";
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Move the stars slightly
        star.x += star.speed;
        if (star.x > canvas.width) {
            star.x = 0; // Reset star position to the left once it moves off-screen
        }
    });
}