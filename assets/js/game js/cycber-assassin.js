(function(){
    // ========== 初始化画布 ==========
    const canvas = document.getElementById('gameCanvas');
    let ctx = canvas.getContext('2d');
    
    const WORLD_WIDTH = 3400;
    let cameraX = 0;
    
    // ========== 虚拟摇杆变量 ==========
    let joystickActive = false;
    let joystickX = 0;
    let joystickY = 0;
    let joystickCenterX = 0;
    let joystickCenterY = 0;
    let joystickRadius = 50;
    
    // ========== 移动端检测 ==========
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 预加载角色立绘
    const playerImg = new Image();
    playerImg.src = "../../public/images/player.jpeg";
    const patrolImg = new Image();
    patrolImg.src = "../../public/images/patrol.jpeg";
    const gunnerImg = new Image();
    gunnerImg.src = "../../public/images/gunner.jpeg";
    const shielderImg = new Image();
    shielderImg.src = "../../public/images/shielder.jpeg";
    
    // 玩家属性
    let player = {
        x: 150, y: 0, width: 40, height: 60, 
        speed: 4.2,
        hp: 5,
        maxHp: 6,
        invincibleTimer: 0,
        direction: 1, // 1=右，-1=左
        // 隐身技能属性
        isStealth: false,
        stealthTimer: 0,
        stealthCooldown: 0,
        stealthMaxDuration: 180, // 3秒持续时间（60帧）
        stealthMaxCooldown: 600, // 10秒冷却时间
    };
    
    // 警觉系统
    let alertLevel = 0;
    let isAlerted = false;
    let alertTimer = 0;
    
    let enemies = [];
    let bullets = [];
    let terminals = [];
    let mainTerminal = null;
    let exitDoor = { x: WORLD_WIDTH - 90, y: 0, width: 70, height: 500, unlocked: false };
    
    let currentLevel = 1;
    let difficulty = 1.0;
    let gameState = 'playing'; // playing, hacking, gameover
    
    let particles = [];
    const keys = {};
    
    // 辅助函数：圆角矩形
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) h = h / 2;
            this.moveTo(x + r, y);
            this.lineTo(x + w - r, y);
            this.quadraticCurveTo(x + w, y, x + w, y + r);
            this.lineTo(x + w, y + h - r);
            this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            this.lineTo(x + r, y + h);
            this.quadraticCurveTo(x, y + h, x, y + h - r);
            this.lineTo(x, y + r);
            this.quadraticCurveTo(x, y, x + r, y);
            return this;
        };
    }
    
    function updateUI() {
        document.getElementById('hp-display').innerText = player.hp;
        document.getElementById('level-num').innerText = currentLevel;
        let diffText = difficulty < 1.2 ? "见习" : (difficulty < 1.7 ? "街头" : (difficulty < 2.2 ? "赛博" : "噩梦"));
        document.getElementById('difficulty-val').innerText = diffText;
        
        // 更新隐身状态显示
        const stealthStatus = document.getElementById('stealth-status');
        if(player.isStealth) {
            const remaining = Math.ceil(player.stealthTimer / 60);
            stealthStatus.innerHTML = `🗡️ 暗杀 [E] | 🥷 隐身激活 (${remaining}s)`;
            stealthStatus.style.color = '#0ff';
        } else if(player.stealthCooldown > 0) {
            const cooldown = Math.ceil(player.stealthCooldown / 60);
            stealthStatus.innerHTML = `🗡️ 暗杀 [E] | 🥷 隐身冷却 (${cooldown}s)`;
            stealthStatus.style.color = '#888';
        } else {
            stealthStatus.innerHTML = `🗡️ 暗杀 [E] | 🥷 隐身 [Q]`;
            stealthStatus.style.color = '#0ff';
        }
    }
    
    function addParticle(x, y, color, size=4, life=30) {
        particles.push({
            x, y, vx: (Math.random() - 0.5) * 2.2, vy: (Math.random() - 0.5) * 2 - 1.2,
            size, color, life, maxLife: life
        });
    }
    
    // 警觉更新
    function updateAlert() {
        if(gameState !== 'playing') return;
        // 隐身状态下，敌人无法检测到玩家
        if(player.isStealth) return;
        
        if (isAlerted) {
            alertTimer--;
            if (alertTimer <= 0) {
                isAlerted = false;
                alertLevel = 0;
                document.getElementById('status-msg').innerHTML = "警报解除 | 继续潜行";
                setTimeout(() => {
                    if(gameState === 'playing') document.getElementById('status-msg').innerHTML = "从暗影中接近，按 E 暗杀";
                }, 1600);
                for (let e of enemies) {
                    if (e.alive && e.alertMode) {
                        e.alertMode = false;
                        e.speed = e.originalSpeed;
                    }
                }
            }
            return;
        }
        
        let maxAlert = 0;
        for (let e of enemies) {
            if (!e.alive) continue;
            const dist = Math.abs(player.x - e.x);
            if (dist < e.fov) {
                const playerIsRight = player.x > e.x;
                const enemyFacingRight = e.direction === 1;
                const inCone = (enemyFacingRight && playerIsRight) || (!enemyFacingRight && !playerIsRight);
                if (inCone) {
                    let add = Math.min(15, Math.floor(4.5 * (1 - dist / e.fov) + 1.2));
                    maxAlert = Math.max(maxAlert, add);
                }
            }
        }
        
        if (maxAlert > 0) {
            alertLevel = Math.min(100, alertLevel + maxAlert);
            if (alertLevel >= 100 && !isAlerted) {
                isAlerted = true;
                alertTimer = 140;
                alertLevel = 100;
                document.getElementById('status-msg').innerHTML = "🚨 警戒协议启动！敌人进入猎杀模式！";
                for (let e of enemies) {
                    if (e.alive) {
                        e.alertMode = true;
                        e.originalSpeed = e.speed;
                        e.speed = e.speed * 1.35;
                    }
                }
                addParticle(player.x + player.width/2, player.y, '#ff5500', 10, 35);
            }
        } else {
            alertLevel = Math.max(0, alertLevel - 0.9);
        }
        
        const fill = document.getElementById('alert-fill');
        fill.style.width = alertLevel + '%';
        fill.style.background = alertLevel > 70 ? 'linear-gradient(90deg, #f0f, #ff44aa)' : 'linear-gradient(90deg, #0ff, #0a8)';
    }
    
    // 关卡生成
    function generateLevel(level, diff) {
        enemies = [];
        bullets = [];
        terminals = [];
        let baseEnemyCount = Math.floor(1 + diff * 0.8 + Math.random() * 1.2);
        let enemyCount = Math.min(baseEnemyCount, 5);
        if (level === 1) enemyCount = Math.min(enemyCount, 2);
        
        const occupied = [];
        function isOverlap(x, w) {
            for(let o of occupied) if(Math.abs(o.x - x) < (o.w + w)/2 + 40) return true;
            return false;
        }
        
        for(let i=0; i<enemyCount; i++) {
            let typeRand = Math.random();
            let type = 'patrol';
            if(diff > 0.9) {
                if(typeRand < 0.55) type = 'patrol';
                else if(typeRand < 0.78) type = 'gunner';
                else type = 'shielder';
            } else {
                type = 'patrol';
            }
            
            let xPos = 380 + Math.random() * (WORLD_WIDTH - 800);
            let patrolW = 210 + Math.random() * 220;
            let startX = Math.max(140, xPos - patrolW/2);
            let endX = Math.min(WORLD_WIDTH - 140, xPos + patrolW/2);
            if(endX - startX < 130) { endX = startX + 150; }
            
            let enemyObj = {
                type: type,
                x: startX + (endX-startX)/2,
                y: canvas.height - 86,
                width: 40, height: 60,
                hp: (type === 'shielder' && diff > 1.3) ? 2 : 1,
                direction: Math.random() > 0.5 ? 1 : -1,
                patrolStart: startX,
                patrolEnd: endX,
                fov: 140,
                attackCd: 0,
                color: type === 'gunner' ? '#ff8844' : (type === 'shielder' ? '#b77eff' : '#ff5a7c'),
                alive: true,
                speed: type === 'shielder' ? 0.98 : 1.35,
                alertMode: false,
                originalSpeed: type === 'shielder' ? 0.98 : 1.35
            };
            if(!isOverlap(enemyObj.x, enemyObj.width)) {
                enemies.push(enemyObj);
                occupied.push({x: enemyObj.x, w: enemyObj.width});
            }
        }
        
        if(enemies.length === 0) {
            enemies.push({ 
                type:'patrol', 
                x: 580, 
                y: canvas.height-86, 
                width:40, 
                height:60, 
                hp:1, 
                direction:1, 
                patrolStart:480, 
                patrolEnd:1020, 
                fov:140, 
                attackCd:0, 
                color:'#ff5a7c', 
                alive:true, 
                speed:1.35, 
                alertMode:false, 
                originalSpeed:1.35 
            });
        }
        
        let termX = 650 + Math.random() * (WORLD_WIDTH - 1300);
        mainTerminal = {
            x: termX, y: canvas.height - 70, width: 34, height: 34,
            hacked: false
        };
        terminals.push(mainTerminal);
        
        exitDoor.unlocked = false;
        exitDoor.x = WORLD_WIDTH - 90;
    }
    
    function resetPlayerForNewLevel() {
        player.x = 130;
        player.y = canvas.height - 86;
        player.hp = Math.min(player.hp + 1, player.maxHp);
        if(currentLevel === 1) player.hp = 5;
        player.invincibleTimer = 0;
        // 重置隐身状态
        player.isStealth = false;
        player.stealthTimer = 0;
        player.stealthCooldown = 0;
        alertLevel = 0;
        isAlerted = false;
        alertTimer = 0;
        updateUI();
    }
    
    function loadNewLevel() {
        difficulty = 0.68 + (currentLevel-1) * 0.13 + Math.random() * 0.18;
        generateLevel(currentLevel, difficulty);
        resetPlayerForNewLevel();
        gameState = 'playing';
        cameraX = 0;
        document.getElementById('hack-modal').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('status-msg').innerHTML = `⚡ 潜入节点 ${currentLevel} | 破解终端，抵达出口`;
        draw();
    }
    
    function gameOver(win, msg) {
        if(gameState === 'gameover') return;
        gameState = 'gameover';
        const endDiv = document.getElementById('game-over');
        const endTitle = document.getElementById('end-title');
        endTitle.innerText = msg;
        endTitle.style.color = win ? '#0f0' : '#ff6688';
        endDiv.classList.remove('hidden');
    }
    
    function nextLevel() {
        currentLevel++;
        loadNewLevel();
    }
    
    // 暗杀
    function attemptAssassinate() {
        if(gameState !== 'playing') return false;
        let assassinated = false;
        for(let i=0; i<enemies.length; i++) {
            const e = enemies[i];
            if(!e.alive) continue;
            const dist = Math.abs(player.x - e.x);
            if(dist < 65) {
                const playerIsRight = player.x > e.x;
                const enemyFacingRight = e.direction === 1;
                const fromBehind = (enemyFacingRight && !playerIsRight) || (!enemyFacingRight && playerIsRight);
                if(fromBehind) {
                    e.alive = false;
                    enemies.splice(i,1);
                    assassinated = true;
                    addParticle(e.x + e.width/2, e.y + e.height/2, '#ff44cc', 9, 28);
                    document.getElementById('status-msg').innerHTML = "🗡️ 暗杀成功 | 神经元熔断";
                    setTimeout(()=>{
                        if(gameState === 'playing') document.getElementById('status-msg').innerHTML = "目标已清除，继续渗透";
                    },1300);
                    break;
                } else {
                    if(!isAlerted) {
                        isAlerted = true;
                        alertTimer = 130;
                        alertLevel = 100;
                        document.getElementById('status-msg').innerHTML = "⚠️ 正面刺杀失败，触发区域警报！";
                        for (let e2 of enemies) {
                            if (e2.alive) {
                                e2.alertMode = true;
                                e2.originalSpeed = e2.speed;
                                e2.speed = e2.speed * 1.4;
                            }
                        }
                    }
                    addParticle(player.x + player.width/2, player.y, '#ffaa55', 7, 18);
                    return false;
                }
            }
        }
        return assassinated;
    }
    
    function damagePlayer(amount) {
        if(player.invincibleTimer > 0) return;
        if(gameState !== 'playing') return;
        player.hp -= amount;
        player.invincibleTimer = 30;
        addParticle(player.x + player.width/2, player.y + player.height/2, '#ff3366', 8, 22);
        updateUI();
        if(player.hp <= 0) {
            gameOver(false, "💀 神经链路崩溃 | 任务失败");
        }
        document.getElementById('status-msg').innerHTML = "⚠️ 受损! 寻找掩护";
        setTimeout(()=>{
            if(gameState === 'playing') document.getElementById('status-msg').innerHTML = "从背后接近，按E暗杀";
        },1200);
    }
    
    function gunnerShoot(enemy) {
        if(enemy.attackCd > 0) return;
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.hypot(dx, dy);
        if(dist < 280 && Math.abs(dx) > 18) {
            enemy.attackCd = 72;
            bullets.push({
                x: enemy.x + (enemy.direction===1? 18 : -8),
                y: enemy.y + 22,
                vx: (dx / dist) * 5.0,
                vy: (dy / dist) * 3.6,
                radius: 5
            });
        }
    }
    
    function updateEnemies() {
        for(let i=0; i<enemies.length; i++) {
            const e = enemies[i];
            if(!e.alive) {
                enemies.splice(i,1);
                i--;
                continue;
            }
            if(e.attackCd > 0) e.attackCd--;
            
            if(e.type !== 'shielder') {
                e.x += e.speed * e.direction;
                if(e.x > e.patrolEnd) { e.x = e.patrolEnd; e.direction = -1; }
                if(e.x < e.patrolStart) { e.x = e.patrolStart; e.direction = 1; }
            } else {
                if(player.x > e.x) e.direction = 1;
                else e.direction = -1;
                e.x += e.direction * 0.98;
                e.x = Math.min(Math.max(e.x, e.patrolStart), e.patrolEnd);
            }
            
            if(e.alertMode && alertTimer <= 0 && !isAlerted) {
                e.alertMode = false;
                e.speed = e.originalSpeed;
            }
            
            if(e.type === 'shielder' && Math.abs(player.x - e.x) < 44 && player.invincibleTimer <= 0) {
                damagePlayer(1);
                player.invincibleTimer = 26;
            }
            
            if(e.type === 'gunner' && e.alive) gunnerShoot(e);
        }
    }
    
    function updateBullets() {
        for(let i=0; i<bullets.length; i++) {
            const b = bullets[i];
            b.x += b.vx;
            b.y += b.vy;
            if(b.x < -100 || b.x > WORLD_WIDTH+100 || b.y < 0 || b.y > canvas.height+100) {
                bullets.splice(i,1);
                i--;
                continue;
            }
            if(Math.hypot(b.x - (player.x+player.width/2), b.y - (player.y+player.height/2)) < 20) {
                damagePlayer(1);
                bullets.splice(i,1);
                i--;
                continue;
            }
            for(let e of enemies) {
                if(!e.alive) continue;
                if(e.type === 'shielder' && Math.abs(b.x - e.x) < 32 && Math.abs(b.y - e.y) < 42) {
                    bullets.splice(i,1);
                    i--;
                    break;
                }
            }
        }
    }
    
    // ========== 终端入侵 (全新解密模式) ==========
    function tryInteractTerminal() {
        if(gameState !== 'playing') return false;
        for(let t of terminals) {
            if(!t.hacked && Math.abs(player.x - t.x) < 65) {
                gameState = 'hacking';
                openHackModal(t);
                return true;
            }
        }
        return false;
    }
    
    function openHackModal(terminal) {
        const modal = document.getElementById('hack-modal');
        const puzzleArea = document.getElementById('puzzle-area');
        puzzleArea.innerHTML = '';
        
        // 全新序列记忆解密模式
        const seqLen = 3 + Math.floor(Math.random() * 2); // 3-4位随机序列
        const answerSeq = [];
        for(let i=0;i<seqLen;i++) {
            answerSeq.push(Math.floor(Math.random() * 4) + 1); // 1-4的随机数字
        }
        let userSeq = [];
        let isPlaying = true; // 是否正在播放序列
        
        const feedbackDiv = document.createElement('div');
        feedbackDiv.id = 'seq-feedback';
        feedbackDiv.style.margin = '12px';
        feedbackDiv.style.fontFamily = 'monospace';
        feedbackDiv.style.letterSpacing = '2px';
        feedbackDiv.innerText = `⚡ 记住闪烁的序列...`;
        
        const seqDiv = document.createElement('div');
        seqDiv.className = 'sequence-area';
        const buttons = [];
        for(let i=1;i<=4;i++) {
            const btn = document.createElement('button');
            btn.innerText = i;
            btn.className = 'seq-btn';
            btn.disabled = true; // 播放阶段禁止点击
            btn.addEventListener('click', () => {
                if(isPlaying) return;
                userSeq.push(i);
                feedbackDiv.innerText = `输入: [${userSeq.join(',')}]`;
                if(userSeq.length === answerSeq.length) {
                    let success = true;
                    for(let j=0;j<answerSeq.length;j++) if(userSeq[j] !== answerSeq[j]) success=false;
                    if(success) {
                        hackSuccess(terminal);
                    } else {
                        hackFail();
                    }
                }
            });
            seqDiv.appendChild(btn);
            buttons.push(btn);
        }
        
        puzzleArea.appendChild(feedbackDiv);
        puzzleArea.appendChild(seqDiv);
        
        // 自动播放序列
        let playIndex = 0;
        const playInterval = setInterval(() => {
            if(playIndex >= answerSeq.length) {
                // 播放完成，允许玩家输入
                clearInterval(playInterval);
                isPlaying = false;
                feedbackDiv.innerText = `⚡ 现在输入你记住的序列!`;
                buttons.forEach(b => b.disabled = false);
                return;
            }
            // 闪烁当前按钮
            const currentBtn = buttons[answerSeq[playIndex]-1];
            currentBtn.classList.add('blink');
            setTimeout(() => {
                currentBtn.classList.remove('blink');
            }, 400);
            playIndex++;
        }, 600);
        
        const note = document.createElement('p');
        note.style.color = '#0ff';
        note.style.fontSize = '12px';
        note.innerText = '系统正在传输加密序列，请记住顺序后输入';
        puzzleArea.appendChild(note);
        
        document.getElementById('cancel-hack').onclick = () => {
            clearInterval(playInterval); // 清理定时器防止内存泄漏
            gameState = 'playing';
            modal.classList.add('hidden');
        };
        modal.classList.remove('hidden');
    }
    
    function hackSuccess(terminal) {
        terminal.hacked = true;
        exitDoor.unlocked = true;
        document.getElementById('hack-modal').classList.add('hidden');
        gameState = 'playing';
        document.getElementById('status-msg').innerHTML = "✅ 入侵成功 | 撤离通道已开启";
        addParticle(terminal.x + terminal.width/2, terminal.y, '#0f0', 12, 45);
    }
    
    function hackFail() {
        document.getElementById('hack-modal').classList.add('hidden');
        gameOver(false, "⚠️ 反入侵响应，系统熔断！");
    }
    
    function checkExit() {
        if(!exitDoor.unlocked) return;
        if(player.x + player.width > exitDoor.x && player.x < exitDoor.x + exitDoor.width) {
            nextLevel();
        }
    }
    
    function updateCamera() {
        let targetX = player.x + player.width/2 - canvas.width/2;
        targetX = Math.min(Math.max(targetX, 0), WORLD_WIDTH - canvas.width);
        cameraX = targetX;
    }
    
    function updateGame() {
        if(gameState !== 'playing') return;
        
        // 更新隐身计时器
        if(player.isStealth) {
            player.stealthTimer--;
            if(player.stealthTimer <= 0) {
                player.isStealth = false;
                player.stealthCooldown = player.stealthMaxCooldown;
                document.getElementById('status-msg').innerHTML = "🥷 光学迷彩关闭，进入冷却";
                updateUI();
            }
        }
        if(player.stealthCooldown > 0) {
            player.stealthCooldown--;
            updateUI();
        }
        
        // 玩家移动（键盘或摇杆）
        if(keys['a']) {
            player.x -= player.speed;
            player.direction = -1;
        } else if(keys['d']) {
            player.x += player.speed;
            player.direction = 1;
        } else if(joystickActive) {
            if(Math.abs(joystickX) > 0.1) {
                player.x += player.speed * joystickX;
                player.direction = joystickX > 0 ? 1 : -1;
            }
        }
        player.x = Math.min(Math.max(player.x, 20), WORLD_WIDTH - player.width - 12);
        player.y = canvas.height - 86;
        
        if(player.invincibleTimer > 0) player.invincibleTimer--;
        
        // 暗杀
        if(keys['e']) {
            attemptAssassinate();
            keys['e'] = false;
        }
        
        // 终端交互
        let nearTerminal = false;
        for(let t of terminals) {
            if(!t.hacked && Math.abs(player.x - t.x) < 65) {
                nearTerminal = true;
                document.getElementById('status-msg').innerHTML = "🔌 按 [F] 入侵终端";
                if(keys['f']) {
                    tryInteractTerminal();
                    keys['f'] = false;
                }
                break;
            }
        }
        if(!nearTerminal && gameState === 'playing' && !document.getElementById('status-msg').innerHTML.includes("成功") && !document.getElementById('status-msg').innerHTML.includes("受损") && !document.getElementById('status-msg').innerHTML.includes("迷彩")) {
            document.getElementById('status-msg').innerHTML = "▶ 从背后按E暗杀 | 找到终端按F破解";
        }
        
        updateAlert();
        updateEnemies();
        updateBullets();
        checkExit();
        updateCamera();
        
        // 更新粒子
        for(let i=0; i<particles.length; i++) {
            particles[i].x += particles[i].vx;
            particles[i].y += particles[i].vy;
            particles[i].life--;
            if(particles[i].life <= 0) particles.splice(i,1);
        }
    }
    
    // ========== 绘图 ==========
    function draw() {
        if(!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 赛博背景
        ctx.fillStyle = "#01010a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 地面网格
        for(let i=0; i<canvas.width+40; i+=40){
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 180, 255, ${0.1+Math.sin(Date.now()*0.003)*0.05})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(i-cameraX%40, canvas.height-70);
            ctx.lineTo(i-cameraX%40, canvas.height);
            ctx.stroke();
        }
        // 远景赛博建筑
        for(let i=0;i<18;i++){
            let x = (i*110 - cameraX*0.4) % (canvas.width+300) - 150;
            const colors = ['rgba(0, 150, 255, 0.08)', 'rgba(255, 0, 200, 0.08)', 'rgba(255, 150, 0, 0.08)'];
            ctx.fillStyle = colors[i%3];
            const h = 80 + Math.random()*80;
            ctx.fillRect(x, canvas.height-h, 55, h);
        }
        
        // 终端
        terminals.forEach(t => {
            let drawX = t.x - cameraX;
            ctx.shadowBlur = 16;
            ctx.shadowColor = t.hacked ? '#0f0' : '#f0f';
            ctx.fillStyle = t.hacked ? '#00ffaa' : '#ff44ff';
            ctx.beginPath();
            ctx.roundRect(drawX, t.y, t.width, t.height, 8);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = "bold 22 monospace";
            ctx.fillText("🔓", drawX+8, t.y+26);
        });
        
        // 出口
        let doorX = exitDoor.x - cameraX;
        ctx.fillStyle = exitDoor.unlocked ? 'rgba(0,255,150,0.85)' : 'rgba(255,40,60,0.7)';
        ctx.fillRect(doorX, exitDoor.y, exitDoor.width, exitDoor.height);
        ctx.fillStyle = '#fff';
        ctx.font = "bold 26 monospace";
        ctx.shadowBlur = 8;
        ctx.fillText("🚪", doorX+22, exitDoor.y+70);
        
        // 玩家
        let pX = player.x - cameraX;
        ctx.save();
        if(player.isStealth) {
            ctx.globalAlpha = 0.35; // 隐身半透明效果
        }
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#0cf';
        if(player.direction === -1) {
            // 朝左时翻转图片
            ctx.translate(pX + player.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(playerImg, 0, player.y, player.width, player.height);
        } else {
            ctx.drawImage(playerImg, 0, 0, 1024, 1024, pX, player.y, player.width, player.height);
        }
        ctx.restore();
        
        // 敌人
        enemies.forEach(e => {
            let ex = e.x - cameraX;
            ctx.save();
            ctx.shadowBlur = 12;
            let img;
            if(e.type === 'patrol') {
                img = patrolImg;
                ctx.shadowColor = '#ff5a7c';
            } else if(e.type === 'gunner') {
                img = gunnerImg;
                ctx.shadowColor = '#ff8844';
            } else if(e.type === 'shielder') {
                img = shielderImg;
                ctx.shadowColor = '#b77eff';
            }
            // 根据敌人方向翻转
            if(e.direction === -1) {
                ctx.translate(ex + e.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, e.y, e.width, e.height);
            } else {
                ctx.drawImage(img, 0, 0, 1024, 1024, ex, e.y, e.width, e.height);
            }
            ctx.restore();
        });
        
        // 子弹
        bullets.forEach(b => {
            let bx = b.x - cameraX;
            ctx.fillStyle = '#ffaa55';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(bx, b.y, 5, 0, Math.PI*2);
            ctx.fill();
        });
        
        // 粒子
        particles.forEach(p => {
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x - cameraX, p.y, p.size, 0, Math.PI*2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        
        // 无敌闪烁
        if(player.invincibleTimer > 0 && (Math.floor(Date.now()/60)%3===0)) {
            ctx.fillStyle = '#aaffffaa';
            ctx.fillRect(pX, player.y, player.width, player.height);
        }
        
        requestAnimationFrame(()=>{ if(gameState !== 'gameover') updateGame(); draw(); });
    }
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        player.y = canvas.height - 86;
        enemies.forEach(e => e.y = canvas.height - 86);
        if(mainTerminal) mainTerminal.y = canvas.height - 70;
        exitDoor.height = canvas.height;
        draw();
    }
    
    // 事件监听
    window.addEventListener('keydown', e => {
        const k = e.key.toLowerCase();
        keys[k] = true;
        // 隐身技能触发
        if(k === 'q' && gameState === 'playing') {
            if(!player.isStealth && player.stealthCooldown <= 0) {
                player.isStealth = true;
                player.stealthTimer = player.stealthMaxDuration;
                document.getElementById('status-msg').innerHTML = "🥷 光学迷彩启动，敌人无法检测到你";
                updateUI();
            }
        }
        // 阻止游戏常用键的默认行为
        if (k === 'e' || k === 'f' || k === 'a' || k === 'd' || k === 'w' || k === 's' || k === 'q') {
            e.preventDefault();
        }
    });
    window.addEventListener('keyup', e => {
        keys[e.key.toLowerCase()] = false;
    });
    
    // 重启游戏
    window.restartGame = function() {
        currentLevel = 1;
        player.hp = 5;
        player.maxHp = 6;
        loadNewLevel();
        gameState = 'playing';
        document.getElementById('game-over').classList.add('hidden');
        updateUI();
    };
    document.querySelector('.restart-btn').onclick = () => { window.restartGame(); };
    
    // ========== 虚拟摇杆事件处理 ==========
    function initJoystick() {
        const joystickContainer = document.getElementById('joystick-container');
        const joystickStick = document.getElementById('joystick-stick');
        
        if(!joystickContainer || !joystickStick) {
            console.log('Joystick elements not found');
            return;
        }
        
        console.log('Joystick initialized');
        
        let activeTouchId = null;
        
        function getTouchPos(e, touchId) {
            if(e.touches) {
                for(let i = 0; i < e.touches.length; i++) {
                    if(e.touches[i].identifier === touchId) {
                        return { x: e.touches[i].clientX, y: e.touches[i].clientY };
                    }
                }
            }
            if(e.changedTouches) {
                for(let i = 0; i < e.changedTouches.length; i++) {
                    if(e.changedTouches[i].identifier === touchId) {
                        return { x: e.changedTouches[i].clientX, y: e.changedTouches[i].clientY };
                    }
                }
            }
            return null;
        }
        
        function updateStickPosition(dx, dy) {
            const maxDistance = joystickRadius;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            let finalDx = dx;
            let finalDy = dy;
            
            if(distance > maxDistance) {
                finalDx = (dx / distance) * maxDistance;
                finalDy = (dy / distance) * maxDistance;
            }
            
            joystickX = finalDx / maxDistance;
            joystickY = finalDy / maxDistance;
            
            joystickStick.style.transform = `translate(${finalDx}px, ${finalDy}px)`;
        }
        
        function resetStick() {
            joystickActive = false;
            joystickX = 0;
            joystickY = 0;
            activeTouchId = null;
            joystickStick.style.transform = 'translate(0px, 0px)';
        }
        
        function handleJoystickStart(clientX, clientY, touchId) {
            activeTouchId = touchId;
            joystickActive = true;
            
            const rect = joystickContainer.getBoundingClientRect();
            joystickCenterX = rect.left + rect.width / 2;
            joystickCenterY = rect.top + rect.height / 2;
            
            const dx = clientX - joystickCenterX;
            const dy = clientY - joystickCenterY;
            updateStickPosition(dx, dy);
        }
        
        function handleJoystickMove(clientX, clientY) {
            if(!joystickActive) return;
            const dx = clientX - joystickCenterX;
            const dy = clientY - joystickCenterY;
            updateStickPosition(dx, dy);
        }
        
        // 触摸事件 - touchstart 在容器上
        joystickContainer.addEventListener('touchstart', (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            
            if(activeTouchId !== null) return;
            
            const touch = e.changedTouches[0];
            handleJoystickStart(touch.clientX, touch.clientY, touch.identifier);
            
            // 在document上添加移动和结束事件监听，以处理触摸移出容器的情况
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd, { passive: false });
            document.addEventListener('touchcancel', handleTouchCancel, { passive: false });
        }, { passive: false });
        
        function handleTouchMove(e) {
            if(!joystickActive || activeTouchId === null) return;
            
            const pos = getTouchPos(e, activeTouchId);
            if(!pos) return;
            
            if (e.cancelable) {
                e.preventDefault();
            }
            handleJoystickMove(pos.x, pos.y);
        }
        
        function handleTouchEnd(e) {
            if(activeTouchId === null) return;
            
            for(let i = 0; i < e.changedTouches.length; i++) {
                if(e.changedTouches[i].identifier === activeTouchId) {
                    resetStick();
                    // 移除事件监听
                    document.removeEventListener('touchmove', handleTouchMove);
                    document.removeEventListener('touchend', handleTouchEnd);
                    document.removeEventListener('touchcancel', handleTouchCancel);
                    break;
                }
            }
        }
        
        function handleTouchCancel(e) {
            if(activeTouchId === null) return;
            
            for(let i = 0; i < e.changedTouches.length; i++) {
                if(e.changedTouches[i].identifier === activeTouchId) {
                    resetStick();
                    // 移除事件监听
                    document.removeEventListener('touchmove', handleTouchMove);
                    document.removeEventListener('touchend', handleTouchEnd);
                    document.removeEventListener('touchcancel', handleTouchCancel);
                    break;
                }
            }
        }
        
        // 鼠标事件（用于桌面测试）
        joystickContainer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handleJoystickStart(e.clientX, e.clientY, 'mouse');
        });
        
        document.addEventListener('mousemove', (e) => {
            if(!joystickActive || activeTouchId !== 'mouse') return;
            handleJoystickMove(e.clientX, e.clientY);
        });
        
        document.addEventListener('mouseup', (e) => {
            if(activeTouchId === 'mouse') resetStick();
        });
    }
    
    // ========== 移动端按钮事件 ==========
    function initMobileButtons() {
        const btnAssassinate = document.getElementById('btn-assassinate');
        const btnStealth = document.getElementById('btn-stealth');
        const btnInteract = document.getElementById('btn-interact');
        
        console.log('Initializing mobile buttons:', { 
            btnAssassinate: !!btnAssassinate, 
            btnStealth: !!btnStealth, 
            btnInteract: !!btnInteract 
        });
        
        if(btnAssassinate) {
            const handleAssassinateStart = (e) => {
                if (e.cancelable) {
                    e.preventDefault();
                }
                btnAssassinate.classList.add('pressed');
                console.log('Assassinate button pressed');
                attemptAssassinate();
            };
            
            const handleAssassinateEnd = (e) => {
                if (e.cancelable) {
                    e.preventDefault();
                }
                btnAssassinate.classList.remove('pressed');
            };
            
            const handleAssassinateCancel = (e) => {
                btnAssassinate.classList.remove('pressed');
            };
            
            btnAssassinate.addEventListener('touchstart', handleAssassinateStart, { passive: false });
            btnAssassinate.addEventListener('touchend', handleAssassinateEnd, { passive: false });
            btnAssassinate.addEventListener('touchcancel', handleAssassinateCancel);
            
            // 添加鼠标事件支持，用于桌面测试
            btnAssassinate.addEventListener('mousedown', handleAssassinateStart);
            btnAssassinate.addEventListener('mouseup', handleAssassinateEnd);
            btnAssassinate.addEventListener('mouseleave', handleAssassinateCancel);
        }
        
        if(btnStealth) {
            const handleStealthStart = (e) => {
                if (e.cancelable) {
                    e.preventDefault();
                }
                btnStealth.classList.add('pressed');
                console.log('Stealth button pressed');
                if(gameState === 'playing' && !player.isStealth && player.stealthCooldown <= 0) {
                    player.isStealth = true;
                    player.stealthTimer = player.stealthMaxDuration;
                    document.getElementById('status-msg').innerHTML = "🥷 光学迷彩启动，敌人无法检测到你";
                    updateUI();
                }
            };
            
            const handleStealthEnd = (e) => {
                if (e.cancelable) {
                    e.preventDefault();
                }
                btnStealth.classList.remove('pressed');
            };
            
            const handleStealthCancel = (e) => {
                btnStealth.classList.remove('pressed');
            };
            
            btnStealth.addEventListener('touchstart', handleStealthStart, { passive: false });
            btnStealth.addEventListener('touchend', handleStealthEnd, { passive: false });
            btnStealth.addEventListener('touchcancel', handleStealthCancel);
            
            // 添加鼠标事件支持，用于桌面测试
            btnStealth.addEventListener('mousedown', handleStealthStart);
            btnStealth.addEventListener('mouseup', handleStealthEnd);
            btnStealth.addEventListener('mouseleave', handleStealthCancel);
        }
        
        if(btnInteract) {
            const handleInteractStart = (e) => {
                if (e.cancelable) {
                    e.preventDefault();
                }
                btnInteract.classList.add('pressed');
                console.log('Interact button pressed');
                tryInteractTerminal();
            };
            
            const handleInteractEnd = (e) => {
                if (e.cancelable) {
                    e.preventDefault();
                }
                btnInteract.classList.remove('pressed');
            };
            
            const handleInteractCancel = (e) => {
                btnInteract.classList.remove('pressed');
            };
            
            btnInteract.addEventListener('touchstart', handleInteractStart, { passive: false });
            btnInteract.addEventListener('touchend', handleInteractEnd, { passive: false });
            btnInteract.addEventListener('touchcancel', handleInteractCancel);
            
            // 添加鼠标事件支持，用于桌面测试
            btnInteract.addEventListener('mousedown', handleInteractStart);
            btnInteract.addEventListener('mouseup', handleInteractEnd);
            btnInteract.addEventListener('mouseleave', handleInteractCancel);
        }
    }
    
    // ========== 横屏检测 ==========
    function checkOrientation() {
        const orientationAlert = document.getElementById('orientation-alert');
        const gameContainer = document.getElementById('game-container');
        
        const isPortrait = window.innerHeight > window.innerWidth;
        const aspectRatio = window.innerWidth / window.innerHeight;
        
        if(isPortrait && aspectRatio < 0.75) {
            if(orientationAlert) orientationAlert.classList.remove('hidden');
            if(gameContainer) gameContainer.classList.add('hidden');
        } else {
            if(orientationAlert) orientationAlert.classList.add('hidden');
            if(gameContainer) gameContainer.classList.remove('hidden');
        }
    }
    
    // ========== 移动端初始化 ==========
    function initMobile() {
        const mobileControls = document.getElementById('mobile-controls');
        
        // 检测是否应该显示移动端控件
        // 1. 是移动设备
        // 2. 屏幕宽度小于等于 1024
        // 3. 支持触摸（用于 F12 模拟器）
        const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const shouldShowMobileControls = isMobile || window.innerWidth <= 1024 || hasTouchSupport;
        
        console.log('Mobile init:', { 
            isMobile, 
            windowWidth: window.innerWidth, 
            hasTouchSupport,
            shouldShowMobileControls 
        });
        
        if(shouldShowMobileControls) {
            if(mobileControls) {
                mobileControls.classList.remove('hidden');
                mobileControls.classList.add('force-show');
                mobileControls.style.display = 'flex';
                mobileControls.style.visibility = 'visible';
                mobileControls.style.opacity = '1';
            }
            initJoystick();
            initMobileButtons();
        } else {
            if(mobileControls) {
                mobileControls.classList.add('hidden');
                mobileControls.classList.remove('force-show');
            }
        }
        checkOrientation();
    }
    
    // 监听窗口尺寸变化
    window.addEventListener('resize', () => { 
        resizeCanvas(); 
        if(gameState === 'playing') draw();
        checkOrientation();
    });
    
    window.addEventListener('orientationchange', checkOrientation);
    
    // 防止触摸时页面滚动
    document.addEventListener('touchmove', (e) => {
        // 如果触摸点在虚拟摇杆或按钮上，阻止默认滚动行为
        const touch = e.touches[0];
        if (!touch) return;
        
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && (
            element.closest('#joystick-container') || 
            element.closest('.action-btn') ||
            element.closest('.mobile-controls')
        )) {
            if (e.cancelable) {
                e.preventDefault();
            }
        }
    }, { passive: false });
    
    // 等待DOM完全加载后初始化
    function initGame() {
        loadNewLevel();
        resizeCanvas();
        initMobile();
    }
    
    // 使用DOMContentLoaded确保DOM完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        // DOM已经加载完成
        initGame();
    }
})();