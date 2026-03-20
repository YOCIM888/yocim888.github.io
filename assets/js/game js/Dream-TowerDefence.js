        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        let gold = 100;
        let lives = 20;
        let wave = 1;
        let kills = 0;
        let gameStarted = false;
        let selectedTower = -1;
        let towers = [];
        let enemies = [];
        let projectiles = [];
        let particles = [];

        const towerTypes = [
            { name: '激光塔', cost: 50, damage: 10, range: 100, fireRate: 500, color: '#00ffff', aoe: false, slow: 0 },
            { name: '等离子塔', cost: 100, damage: 20, range: 80, fireRate: 800, color: '#ff00ff', aoe: false, slow: 0 },
            { name: '电磁塔', cost: 150, damage: 15, range: 120, fireRate: 1000, color: '#ffff00', aoe: true, slow: 0 },
            { name: '零度塔', cost: 120, damage: 5, range: 90, fireRate: 600, color: '#00ccff', aoe: false, slow: 0.5 }
        ];

        const path = [
            { x: 0, y: 300 },
            { x: 150, y: 300 },
            { x: 150, y: 150 },
            { x: 350, y: 150 },
            { x: 350, y: 450 },
            { x: 550, y: 450 },
            { x: 550, y: 200 },
            { x: 800, y: 200 }
        ];

        const gridSize = 50;
        let grid = [];

        function initGrid() {
            grid = [];
            for (let y = 0; y < canvas.height / gridSize; y++) {
                grid[y] = [];
                for (let x = 0; x < canvas.width / gridSize; x++) {
                    grid[y][x] = 0;
                }
            }
            markPath();
        }

        function markPath() {
            for (let i = 0; i < path.length - 1; i++) {
                const start = path[i];
                const end = path[i + 1];
                const steps = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y)) / gridSize;
                for (let j = 0; j <= steps; j++) {
                    const x = Math.floor((start.x + (end.x - start.x) * j / steps) / gridSize);
                    const y = Math.floor((start.y + (end.y - start.y) * j / steps) / gridSize);
                    if (grid[y] && grid[y][x] !== undefined) {
                        grid[y][x] = 1;
                    }
                }
            }
        }

        function selectTower(index) {
            selectedTower = index;
            document.querySelectorAll('.tower-btn').forEach((btn, i) => {
                btn.classList.toggle('selected', i === index);
            });
        }

        function placeTower(x, y) {
            if (selectedTower < 0) return;
            
            const gridX = Math.floor(x / gridSize);
            const gridY = Math.floor(y / gridSize);
            
            if (grid[gridY] && grid[gridY][gridX] === 0 && gold >= towerTypes[selectedTower].cost) {
                const tower = {
                    x: gridX * gridSize + gridSize / 2,
                    y: gridY * gridSize + gridSize / 2,
                    type: selectedTower,
                    lastFire: 0,
                    ...towerTypes[selectedTower]
                };
                towers.push(tower);
                gold -= towerTypes[selectedTower].cost;
                grid[gridY][gridX] = 2;
                updateUI();
            }
        }

        function spawnEnemy() {
            const baseSpeed = 1 + wave * 0.2;
            const enemy = {
                x: path[0].x,
                y: path[0].y,
                pathIndex: 0,
                speed: baseSpeed,
                baseSpeed: baseSpeed,
                health: 30 + wave * 10,
                maxHealth: 30 + wave * 10,
                reward: 10 + wave * 2,
                color: `hsl(${Math.random() * 60 + 0}, 100%, 50%)`,
                slowTimer: 0
            };
            enemies.push(enemy);
        }

        function updateEnemies() {
            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i];
                
                if (enemy.slowTimer > 0) {
                    enemy.slowTimer--;
                    if (enemy.slowTimer <= 0) {
                        enemy.speed = enemy.baseSpeed;
                    }
                }
                
                const target = path[enemy.pathIndex + 1];
                
                if (target) {
                    const dx = target.x - enemy.x;
                    const dy = target.y - enemy.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < enemy.speed) {
                        enemy.pathIndex++;
                    } else {
                        enemy.x += (dx / dist) * enemy.speed;
                        enemy.y += (dy / dist) * enemy.speed;
                    }
                } else {
                    lives--;
                    enemies.splice(i, 1);
                    updateUI();
                    if (lives <= 0) {
                        gameOver();
                    }
                    continue;
                }

                if (enemy.health <= 0) {
                    gold += enemy.reward;
                    kills++;
                    for (let j = 0; j < 10; j++) {
                        particles.push({
                            x: enemy.x,
                            y: enemy.y,
                            vx: (Math.random() - 0.5) * 5,
                            vy: (Math.random() - 0.5) * 5,
                            life: 30,
                            color: enemy.color
                        });
                    }
                    enemies.splice(i, 1);
                    updateUI();
                }
            }
        }

        function updateTowers() {
            const now = Date.now();
            for (const tower of towers) {
                let nearestEnemy = null;
                let nearestDist = tower.range;

                for (const enemy of enemies) {
                    const dx = enemy.x - tower.x;
                    const dy = enemy.y - tower.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < nearestDist) {
                        nearestDist = dist;
                        nearestEnemy = enemy;
                    }
                }

                if (nearestEnemy && now - tower.lastFire > tower.fireRate) {
                    tower.lastFire = now;
                    
                    if (tower.aoe) {
                        for (const enemy of enemies) {
                            const dx = enemy.x - tower.x;
                            const dy = enemy.y - tower.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < tower.range) {
                                enemy.health -= tower.damage;
                                for (let j = 0; j < 3; j++) {
                                    particles.push({
                                        x: enemy.x + (Math.random() - 0.5) * 20,
                                        y: enemy.y + (Math.random() - 0.5) * 20,
                                        vx: (Math.random() - 0.5) * 3,
                                        vy: (Math.random() - 0.5) * 3,
                                        life: 20,
                                        color: tower.color
                                    });
                                }
                            }
                        }
                        particles.push({
                            x: tower.x,
                            y: tower.y,
                            vx: 0,
                            vy: 0,
                            life: 20,
                            color: tower.color,
                            radius: tower.range
                        });
                    } else if (tower.slow > 0) {
                        projectiles.push({
                            x: tower.x,
                            y: tower.y,
                            targetX: nearestEnemy.x,
                            targetY: nearestEnemy.y,
                            damage: tower.damage,
                            color: tower.color,
                            speed: 10,
                            target: nearestEnemy,
                            slow: tower.slow,
                            isSlowTower: true
                        });
                    } else {
                        projectiles.push({
                            x: tower.x,
                            y: tower.y,
                            targetX: nearestEnemy.x,
                            targetY: nearestEnemy.y,
                            damage: tower.damage,
                            color: tower.color,
                            speed: 8,
                            target: nearestEnemy
                        });
                    }
                }
            }
        }

        function updateProjectiles() {
            for (let i = projectiles.length - 1; i >= 0; i--) {
                const proj = projectiles[i];
                
                if (!proj.target || !enemies.includes(proj.target)) {
                    projectiles.splice(i, 1);
                    continue;
                }
                
                const dx = proj.target.x - proj.x;
                const dy = proj.target.y - proj.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < proj.speed) {
                    proj.target.health -= proj.damage;
                    if (proj.isSlowTower && proj.slow > 0) {
                        proj.target.speed = proj.target.baseSpeed * (1 - proj.slow);
                        proj.target.slowTimer = 120;
                        for (let j = 0; j < 8; j++) {
                            particles.push({
                                x: proj.target.x,
                                y: proj.target.y,
                                vx: (Math.random() - 0.5) * 4,
                                vy: (Math.random() - 0.5) * 4,
                                life: 25,
                                color: '#00ccff'
                            });
                        }
                    }
                    projectiles.splice(i, 1);
                } else {
                    proj.x += (dx / dist) * proj.speed;
                    proj.y += (dy / dist) * proj.speed;
                }
            }
        }

        function updateParticles() {
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                if (p.life <= 0) {
                    particles.splice(i, 1);
                }
            }
        }

        function drawGrid() {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y <= canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        }

        function drawPath() {
            ctx.strokeStyle = '#ff00ff';
            ctx.lineWidth = 40;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) {
                ctx.lineTo(path[i].x, path[i].y);
            }
            ctx.stroke();
            ctx.strokeStyle = '#ff66ff';
            ctx.lineWidth = 44;
            ctx.stroke();
        }

        function drawTowers() {
            for (const tower of towers) {
                ctx.beginPath();
                ctx.arc(tower.x, tower.y, 20, 0, Math.PI * 2);
                ctx.fillStyle = tower.color;
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.shadowColor = tower.color;
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
                ctx.strokeStyle = `${tower.color}33`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        function drawEnemies() {
            for (const enemy of enemies) {
                ctx.beginPath();
                ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2);
                ctx.fillStyle = enemy.color;
                ctx.fill();
                ctx.shadowColor = enemy.color;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
                
                if (enemy.slowTimer > 0) {
                    ctx.beginPath();
                    ctx.arc(enemy.x, enemy.y, 18, 0, Math.PI * 2);
                    ctx.strokeStyle = '#00ccff';
                    ctx.lineWidth = 2;
                    ctx.shadowColor = '#00ccff';
                    ctx.shadowBlur = 8;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
                
                ctx.fillStyle = '#000';
                ctx.fillRect(enemy.x - 15, enemy.y - 25, 30, 4);
                ctx.fillStyle = '#00ff00';
                ctx.fillRect(enemy.x - 15, enemy.y - 25, 30 * (enemy.health / enemy.maxHealth), 4);
            }
        }

        function drawProjectiles() {
            for (const proj of projectiles) {
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, 5, 0, Math.PI * 2);
                ctx.fillStyle = proj.color;
                ctx.fill();
                ctx.shadowColor = proj.color;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function drawParticles() {
            for (const p of particles) {
                ctx.globalAlpha = p.life / 30;
                if (p.radius) {
                    const radius = Math.max(0, p.radius * (1 - p.life / 20));
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                    ctx.strokeStyle = p.color;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
            }
        }

        function updateUI() {
            document.getElementById('gold').textContent = gold;
            document.getElementById('lives').textContent = lives;
            document.getElementById('wave').textContent = wave;
            document.getElementById('kills').textContent = kills;
            
            towerTypes.forEach((tower, i) => {
                const btn = document.getElementById(`tower${i + 1}`);
                btn.disabled = gold < tower.cost;
            });
        }

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            drawGrid();
            drawPath();
            drawTowers();
            drawEnemies();
            drawProjectiles();
            drawParticles();
            
            if (gameStarted) {
                updateEnemies();
                updateTowers();
                updateProjectiles();
                updateParticles();
            }
            
            requestAnimationFrame(gameLoop);
        }

        function startGame() {
            if (!gameStarted) {
                gameStarted = true;
                initGrid();
                spawnWave();
            }
        }

        function spawnWave() {
            const enemyCount = 5 + wave * 2;
            for (let i = 0; i < enemyCount; i++) {
                setTimeout(() => {
                    if (gameStarted) spawnEnemy();
                }, i * 1000);
            }
        }

        function nextWave() {
            if (gameStarted && enemies.length === 0) {
                wave++;
                updateUI();
                spawnWave();
            }
        }

        function resetGame() {
            gameStarted = false;
            gold = 100;
            lives = 20;
            wave = 1;
            kills = 0;
            towers = [];
            enemies = [];
            projectiles = [];
            particles = [];
            selectedTower = -1;
            initGrid();
            updateUI();
            document.querySelectorAll('.tower-btn').forEach(btn => btn.classList.remove('selected'));
        }

        function gameOver() {
            gameStarted = false;
            alert(`游戏结束！你坚持到了第 ${wave} 波，击杀了 ${kills} 个敌人！`);
        }

        function getCanvasCoordinates(e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            let clientX, clientY;
            
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            const x = (clientX - rect.left) * scaleX;
            const y = (clientY - rect.top) * scaleY;
            return { x, y };
        }

        function handleCanvasInteraction(e) {
            e.preventDefault();
            const coords = getCanvasCoordinates(e);
            placeTower(coords.x, coords.y);
        }

        canvas.addEventListener('click', handleCanvasInteraction);
        canvas.addEventListener('touchstart', handleCanvasInteraction, { passive: false });

        initGrid();
        updateUI();
        gameLoop();