const basket = document.getElementById('basket');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');

let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let basketPosition = gameArea.clientWidth / 2 - 50;
let currentFruit;
let gameActive = true;

function createFruit() {
    if (currentFruit) {
        currentFruit.remove();
    }
    currentFruit = document.createElement('div');
    currentFruit.className = 'fruit';
    currentFruit.style.left = Math.random() * (gameArea.clientWidth - 50) + 'px';
    currentFruit.style.backgroundColor = getRandomFruitColor();
    gameArea.appendChild(currentFruit);
    fallFruit(currentFruit);
}

const hitSound = document.getElementById('hit-sound');

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
            hitSound.play();
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            updateHighScore();
            clearInterval(checkCollision);
            createFruit();
        } else if (fruitRect.top > gameArea.clientHeight) {
            clearInterval(checkCollision);
            gameOver();
        }
    }, 50);
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    }
}

const gameOverSound = document.getElementById('game-over-sound');

function gameOver() {
    gameActive = false;

    gameOverSound.play();

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

    const popupMessage = document.createElement('div');
    popupMessage.style.color = 'white';
    popupMessage.style.fontSize = '24px';
    popupMessage.style.textAlign = 'center';
    popupMessage.style.marginBottom = '20px';
    popupMessage.innerHTML = `Game Over!<br>Your score was ${score}.`;

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Play again!';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '18px';
    restartButton.style.cursor = 'pointer';
    restartButton.style.border = 'none';
    restartButton.style.borderRadius = '5px';
    restartButton.style.backgroundColor = '#28a745';
    restartButton.style.color = 'white';

    restartButton.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
        resetGame();
    });

    popupOverlay.appendChild(popupMessage);
    popupOverlay.appendChild(restartButton);

    document.body.appendChild(popupOverlay);
}

function resetGame() {
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    createFruit();
    gameActive = true;
}

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
        'images/lemon.png',
        'images/cherry.png',
        'images/plum.png',
        'images/grape.png',
        'images/peach.png',
        'images/black-berry.png'
    ];
    const fruitImage = document.createElement('img');
    const selectedColor = colors[Math.floor(Math.random() * colors.length)];
    fruitImage.src = selectedColor;
    fruitImage.style.width = '50px';
    fruitImage.style.height = '50px';
    currentFruit.appendChild(fruitImage);
}

document.addEventListener('keydown', (event) => {
    if (!gameActive) return;

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

let moveLeftInterval, moveRightInterval;

leftButton.addEventListener('touchstart', () => {
    if (!moveLeftInterval) {
        moveLeftInterval = setInterval(() => {
            if (basketPosition > 0) {
                basketPosition -= 10;
                basket.style.left = basketPosition + 'px';
            }
        }, 50);
    }
});

leftButton.addEventListener('touchend', () => {
    clearInterval(moveLeftInterval);
    moveLeftInterval = null;
});

rightButton.addEventListener('touchstart', () => {
    if (!moveRightInterval) {
        moveRightInterval = setInterval(() => {
            if (basketPosition < gameArea.clientWidth - 100) {
                basketPosition += 10;
                basket.style.left = basketPosition + 'px';
            }
        }, 50);
    }
});

rightButton.addEventListener('touchend', () => {
    clearInterval(moveRightInterval);
    moveRightInterval = null;
});

createFruit();

highScoreDisplay.textContent = `High Score: ${highScore}`;
