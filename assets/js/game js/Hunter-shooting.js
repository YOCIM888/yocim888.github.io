const CONFIG = {
    GAME_DURATION: 120,
    MAX_AMMO: 999,
    RELOAD_TIME: 2000,
    ANIMAL_SPAWN_RATE: 0.02,
    MAX_ANIMALS: 10
};

const gameState = {
    running: false,
    paused: false,
    gameOver: false,
    score: 0,
    timeLeft: CONFIG.GAME_DURATION,
    ammo: CONFIG.MAX_AMMO,
    animalsHit: 0,
    shotsFired: 0,
    isReloading: false
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const ammoElement = document.getElementById('ammo');
const gameTitle = document.getElementById('gameTitle');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const animalsHitElement = document.getElementById('animalsHit');
const shotsFiredElement = document.getElementById('shotsFired');
const accuracyElement = document.getElementById('accuracy');
const gradeDisplay = document.getElementById('gradeDisplay');
const restartBtn = document.getElementById('restartBtn');
const pauseOverlay = document.getElementById('pauseOverlay');
const notification = document.getElementById('notification');
const reloadIndicator = document.getElementById('reloadIndicator');
const reloadProgress = document.getElementById('reloadProgress');
const instructions = document.getElementById('instructions');
const crosshair = document.getElementById('crosshair');

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;
let gameScale = 1;

const animals = [];
const particles = [];
const floatingTexts = [];
const trees = [];
const clouds = [];

const keys = {
    'r': false, 'R': false,
    'p': false, 'P': false,
    'Enter': false
};

let mouseX = 0;
let mouseY = 0;

const ANIMAL_TYPES = {
    duck: {
        emoji: '🦆',
        size: 50,
        speed: 3,
        score: 100,
        color: '#FFD700'
    },
    rabbit: {
        emoji: '🐰',
        size: 45,
        speed: 4,
        score: 150,
        color: '#FFB6C1'
    },
    deer: {
        emoji: '🦌',
        size: 60,
        speed: 2,
        score: 200,
        color: '#8B4513'
    },
    fox: {
        emoji: '🦊',
        size: 55,
        speed: 5,
        score: 250,
        color: '#FF6347'
    },
    boar: {
        emoji: '🐗',
        size: 65,
        speed: 2.5,
        score: 300,
        color: '#654321'
    }
};

function setupCanvas() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    const scaleX = screenWidth / BASE_WIDTH;
    const scaleY = screenHeight / BASE_HEIGHT;
    gameScale = Math.min(scaleX, scaleY);
    
    canvas.width = screenWidth;
    canvas.height = screenHeight;
}

function initBackground() {
    trees.length = 0;
    clouds.length = 0;
    
    for (let i = 0; i < 15; i++) {
        trees.push({
            x: Math.random() * BASE_WIDTH,
            y: BASE_HEIGHT - 100 - Math.random() * 200,
            size: 40 + Math.random() * 40
        });
    }
    
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * BASE_WIDTH,
            y: 50 + Math.random() * 150,
            size: 60 + Math.random() * 40,
            speed: 0.3 + Math.random() * 0.5
        });
    }
}

function showNotification(message, type = '') {
    notification.textContent = message;
    notification.className = 'notification active ' + type;
    setTimeout(() => {
        notification.classList.remove('active');
    }, 2000);
}

function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const speed = Math.random() * 5 + 2;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 5 + 2,
            color: color,
            life: 30 + Math.random() * 20,
            maxLife: 50
        });
    }
}

function createFloatingText(x, y, text, color) {
    floatingTexts.push({
        x: x,
        y: y,
        text: text,
        color: color,
        life: 40,
        vy: -2
    });
}

function spawnAnimal() {
    const types = Object.keys(ANIMAL_TYPES);
    const type = types[Math.floor(Math.random() * types.length)];
    const config = ANIMAL_TYPES[type];
    
    const fromLeft = Math.random() < 0.5;
    
    animals.push({
        x: fromLeft ? -config.size : BASE_WIDTH,
        y: 100 + Math.random() * (BASE_HEIGHT - 300),
        width: config.size,
        height: config.size,
        speed: config.speed * (fromLeft ? 1 : -1),
        type: type,
        score: config.score,
        color: config.color,
        emoji: config.emoji,
        hitFlash: 0
    });
}

function drawBackground() {
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(0.5, '#98D8C8');
    skyGradient.addColorStop(1, '#4CAF50');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    clouds.forEach(cloud => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(cloud.x * gameScale, cloud.y * gameScale, cloud.size * gameScale * 0.6, 0, Math.PI * 2);
        ctx.arc((cloud.x + cloud.size * 0.4) * gameScale, cloud.y * gameScale, cloud.size * gameScale * 0.5, 0, Math.PI * 2);
        ctx.arc((cloud.x - cloud.size * 0.3) * gameScale, (cloud.y + cloud.size * 0.1) * gameScale, cloud.size * gameScale * 0.4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.fillStyle = '#2E7D32';
    ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
    
    ctx.fillStyle = '#388E3C';
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
    
    trees.forEach(tree => {
        ctx.fillStyle = '#5D4037';
        ctx.fillRect((tree.x - 5) * gameScale, tree.y * gameScale, 10 * gameScale, tree.size * gameScale);
        
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath();
        ctx.arc(tree.x * gameScale, (tree.y - tree.size * 0.3) * gameScale, tree.size * gameScale * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#388E3C';
        ctx.beginPath();
        ctx.arc((tree.x - tree.size * 0.2) * gameScale, (tree.y - tree.size * 0.1) * gameScale, tree.size * gameScale * 0.4, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawAnimals() {
    animals.forEach(animal => {
        ctx.save();
        ctx.translate(animal.x * gameScale + animal.width * gameScale / 2, animal.y * gameScale + animal.height * gameScale / 2);
        
        if (animal.speed < 0) {
            ctx.scale(-1, 1);
        }
        
        if (animal.hitFlash > 0) {
            ctx.globalAlpha = Math.max(0.3, animal.hitFlash / 10);
        }
        
        ctx.font = `${animal.width * gameScale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(animal.emoji, 0, 0);
        
        ctx.restore();
    });
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.save();
        ctx.translate(particle.x * gameScale, particle.y * gameScale);
        
        const alpha = particle.life / particle.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * gameScale * alpha, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    });
}

function drawFloatingTexts() {
    floatingTexts.forEach(text => {
        ctx.save();
        ctx.translate(text.x * gameScale, text.y * gameScale);
        
        const alpha = text.life / 40;
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = text.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        
        ctx.strokeText(text.text, 0, 0);
        ctx.fillText(text.text, 0, 0);
        
        ctx.restore();
    });
}

function drawCrosshair() {
    crosshair.style.left = mouseX + 'px';
    crosshair.style.top = mouseY + 'px';
}

function update() {
    if (!gameState.running || gameState.paused) return;
    
    clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > BASE_WIDTH + cloud.size) {
            cloud.x = -cloud.size;
        }
    });
    
    if (Math.random() < CONFIG.ANIMAL_SPAWN_RATE && animals.length < CONFIG.MAX_ANIMALS) {
        spawnAnimal();
    }
    
    for (let i = animals.length - 1; i >= 0; i--) {
        const animal = animals[i];
        animal.x += animal.speed;
        
        if (animal.hitFlash > 0) animal.hitFlash--;
        
        if ((animal.speed > 0 && animal.x > BASE_WIDTH + animal.width) ||
            (animal.speed < 0 && animal.x < -animal.width)) {
            animals.splice(i, 1);
        }
    }
    
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
    
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const text = floatingTexts[i];
        text.y += text.vy;
        text.life--;
        
        if (text.life <= 0) {
            floatingTexts.splice(i, 1);
        }
    }
    
    if (particles.length > 200) particles.splice(0, particles.length - 200);
    if (floatingTexts.length > 20) floatingTexts.splice(0, floatingTexts.length - 20);
}

function render() {
    drawBackground();
    drawAnimals();
    drawParticles();
    drawFloatingTexts();
    drawCrosshair();
}

function shoot(clickX, clickY) {
    if (gameState.isReloading || gameState.ammo <= 0) {
        if (gameState.ammo <= 0) {
            showNotification('弹药耗尽！按R装弹', 'warning');
        }
        return;
    }
    
    gameState.ammo--;
    gameState.shotsFired++;
    ammoElement.textContent = gameState.ammo;
    
    const gameX = clickX / gameScale;
    const gameY = clickY / gameScale;
    
    let hit = false;
    
    for (let i = animals.length - 1; i >= 0; i--) {
        const animal = animals[i];
        const animalCenterX = animal.x + animal.width / 2;
        const animalCenterY = animal.y + animal.height / 2;
        
        const dx = gameX - animalCenterX;
        const dy = gameY - animalCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < animal.width / 2) {
            hit = true;
            gameState.score += animal.score;
            gameState.animalsHit++;
            scoreElement.textContent = gameState.score;
            
            createParticles(animalCenterX, animalCenterY, animal.color, 15);
            createFloatingText(animalCenterX, animalCenterY, '+' + animal.score, animal.color);
            
            animals.splice(i, 1);
            break;
        }
    }
    
    createParticles(gameX, gameY, hit ? '#4CAF50' : '#FF5722', 5);
}

function reload() {
    if (gameState.isReloading || gameState.ammo === CONFIG.MAX_AMMO) return;
    
    gameState.isReloading = true;
    reloadIndicator.classList.add('active');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        reloadProgress.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            gameState.ammo = CONFIG.MAX_AMMO;
            gameState.isReloading = false;
            ammoElement.textContent = gameState.ammo;
            reloadIndicator.classList.remove('active');
            reloadProgress.style.width = '0%';
            showNotification('装弹完成！', 'success');
        }
    }, CONFIG.RELOAD_TIME / 20);
}

let lastTime = 0;
let timeAccumulator = 0;

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    update();
    render();
    
    requestAnimationFrame(gameLoop);
}

let timerInterval;

function startTimer() {
    timerInterval = setInterval(() => {
        if (!gameState.paused && gameState.running) {
            gameState.timeLeft--;
            timeElement.textContent = gameState.timeLeft;
            
            if (gameState.timeLeft <= 0) {
                endGame();
            }
        }
    }, 1000);
}

function startGame() {
    gameState.running = true;
    gameState.paused = false;
    gameState.gameOver = false;
    gameState.score = 0;
    gameState.timeLeft = CONFIG.GAME_DURATION;
    gameState.ammo = CONFIG.MAX_AMMO;
    gameState.animalsHit = 0;
    gameState.shotsFired = 0;
    gameState.isReloading = false;
    
    animals.length = 0;
    particles.length = 0;
    floatingTexts.length = 0;
    
    scoreElement.textContent = gameState.score;
    timeElement.textContent = gameState.timeLeft;
    ammoElement.textContent = gameState.ammo;
    
    gameTitle.classList.add('hidden');
    gameOverScreen.classList.remove('active');
    pauseOverlay.classList.remove('active');
    reloadIndicator.classList.remove('active');
    
    startTimer();
    
    setTimeout(() => {
        instructions.classList.add('show');
        setTimeout(() => {
            instructions.classList.remove('show');
            instructions.classList.add('hiding');
        }, 5000);
    }, 100);
}

function endGame() {
    gameState.running = false;
    gameState.gameOver = true;
    clearInterval(timerInterval);
    
    gameOverScreen.classList.add('active');
    finalScoreElement.textContent = gameState.score;
    animalsHitElement.textContent = gameState.animalsHit;
    shotsFiredElement.textContent = gameState.shotsFired;
    
    const accuracy = gameState.shotsFired > 0 ? 
        Math.round((gameState.animalsHit / gameState.shotsFired) * 100) : 0;
    accuracyElement.textContent = accuracy + '%';
    
    let grade = '';
    let gradeClass = '';
    
    if (gameState.score >= 3000) {
        grade = 'S';
        gradeClass = 'grade-s';
    } else if (gameState.score >= 2000) {
        grade = 'A';
        gradeClass = 'grade-a';
    } else if (gameState.score >= 1000) {
        grade = 'B';
        gradeClass = 'grade-b';
    } else {
        grade = 'C';
        gradeClass = 'grade-c';
    }
    
    gradeDisplay.textContent = grade;
    gradeDisplay.className = 'grade-display ' + gradeClass;
}

function togglePause() {
    if (!gameState.running || gameState.gameOver) return;
    
    gameState.paused = !gameState.paused;
    pauseOverlay.classList.toggle('active', gameState.paused);
}

setupCanvas();
initBackground();
requestAnimationFrame(gameLoop);

window.addEventListener('resize', () => {
    setupCanvas();
});

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

canvas.addEventListener('click', (e) => {
    if (!gameState.running) {
        if (!gameState.gameOver) {
            startGame();
        }
    } else {
        shoot(e.clientX, e.clientY);
    }
});

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if (e.key === 'Enter' && !gameState.running && !gameState.gameOver) {
        startGame();
    }
    
    if ((e.key === 'r' || e.key === 'R') && gameState.running && !gameState.paused) {
        reload();
    }
    
    if ((e.key === 'p' || e.key === 'P') && gameState.running) {
        togglePause();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

restartBtn.addEventListener('click', () => {
    startGame();
});
