const basket = document.getElementById('basket');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');

let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0; // Retrieve high score from local storage
let basketPosition = gameArea.clientWidth / 2 - 50; // Center the basket
let currentFruit;
let gameActive = true; // Track whether the game is active

// Function to create a fruit
function createFruit() {
    if (currentFruit) {
        currentFruit.remove(); // Remove the previous fruit
    }
    currentFruit = document.createElement('div');
    currentFruit.className = 'fruit';
    currentFruit.style.left = Math.random() * (gameArea.clientWidth - 50) + 'px';
    currentFruit.style.backgroundColor = getRandomFruitColor();
    gameArea.appendChild(currentFruit);
    fallFruit(currentFruit);
}

// Function to fall the fruit
function fallFruit(fruit) {
    fruit.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(500px)' }], {
        duration: 4700,
        easing: 'linear',
        fill: 'forwards'
    });

    const checkCollision = setInterval(() => {
        const fruitRect = fruit.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();

        if (
            fruitRect.bottom >= basketRect.top &&
            fruitRect.left + fruitRect.width >= basketRect.left &&
            fruitRect.left <= basketRect.left + basketRect.width
        ) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            updateHighScore(); // Check and update high score
            clearInterval(checkCollision);
            createFruit(); // Create a new fruit after catching
        } else if (fruitRect.top > gameArea.clientHeight) {
            clearInterval(checkCollision);
            gameOver(); // End the game if the fruit is missed
        }
    }, 50);
}

// Function to update high score
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); // Save new high score to local storage
        highScoreDisplay.textContent = `High Score: ${highScore}`; // Update high score display
    }
}

// Function to handle game over
function gameOver() {
    gameActive = false; // Set game to inactive

    // Create a popup overlay
    const popupOverlay = document.createElement('div');
    popupOverlay.id = 'game-over-overlay';
    popupOverlay.style.position = 'fixed';
    popupOverlay.style.top = '0';
    popupOverlay.style.left = '0';
    popupOverlay.style.width = '100%';
    popupOverlay.style.height = '100%';
    popupOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popupOverlay.style.display = 'flex';
    popupOverlay.style.flexDirection = 'column';
    popupOverlay.style.justifyContent = 'center';
    popupOverlay.style.alignItems = 'center';
    popupOverlay.style.zIndex = '1000';

    // Create a popup message
    const popupMessage = document.createElement('div');
    popupMessage.style.color = 'white';
    popupMessage.style.fontSize = '24px';
    popupMessage.style.textAlign = 'center';
    popupMessage.style.marginBottom = '20px';
    popupMessage.innerHTML = `Game Over!<br>Your score was ${score}.`;

    // Create a restart button
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Play again!';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '18px';
    restartButton.style.cursor = 'pointer';
    restartButton.style.border = 'none';
    restartButton.style.borderRadius = '5px';
    restartButton.style.backgroundColor = '#28a745';
    restartButton.style.color = 'white';

    // Restart button click event
    restartButton.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
        resetGame();
    });

    // Append message and button to the overlay
    popupOverlay.appendChild(popupMessage);
    popupOverlay.appendChild(restartButton);

    // Append the overlay to the body
    document.body.appendChild(popupOverlay);
}

// Function to reset the game
function resetGame() {
    score = 0; // Reset score
    scoreDisplay.textContent = `Score: ${score}`; // Update score display
    createFruit(); // Create the first fruit again
    gameActive = true; // Set game to active
}

// Function to get random fruit color
function getRandomFruitColor() {
    const colors = [
        'images/watermelon.png',
        'images/banana.png',
        'images/apple.png',
        'images/lime.png',
        'images/coconut.png',
        'images/strawberry.png',
        'images/pear.png',
        'images/orange.png',
        'images/lemon.png'
    ];
    const fruitImage = document.createElement('img');
    const selectedColor = colors[Math.floor(Math.random() * colors.length)];
    fruitImage.src = selectedColor;
    fruitImage.style.width = '50px';
    fruitImage.style.height = '50px';
    currentFruit.appendChild(fruitImage);
}

// Move basket with 'A', 'D', left arrow, and right arrow keys
document.addEventListener('keydown', (event) => {
    if (!gameActive) return; // Prevent movement if game is over

    if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') {
        if (basketPosition > 0) {
            basketPosition -= 20;
            basket.style.left = basketPosition + 'px';
        }
    } else if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') {
        if (basketPosition < gameArea.clientWidth - 100) {
            basketPosition += 20;
            basket.style.left = basketPosition + 'px';
        }
    }
});

// Move basket with buttons
leftButton.addEventListener('click', () => {
    if (basketPosition > 0) {
        basketPosition -= 20;
        basket.style.left = basketPosition + 'px';
    }
});

rightButton.addEventListener('click', () => {
    if (basketPosition < gameArea.clientWidth - 100) {
        basketPosition += 20;
        basket.style.left = basketPosition + 'px';
    }
});

// Start the game
createFruit(); // Create the first fruit

// Initialize high score display
highScoreDisplay.textContent = `High Score: ${highScore}`;