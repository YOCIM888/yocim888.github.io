// 为记事本图标添加交互效果
document.addEventListener('DOMContentLoaded', function() {
    const notebookIcon = document.getElementById('futureNotebookIcon');
    
    if (notebookIcon) {
        // 点击动画效果
        notebookIcon.addEventListener('click', function(e) {
            // 添加点击动画类
            this.classList.add('icon-clicked');
            
            // 移除动画类以便下次点击可以再次触发
            setTimeout(() => {
                this.classList.remove('icon-clicked');
            }, 300);
            
            // 可以在这里添加其他点击效果，比如声音等
            console.log('记事本图标被点击，即将跳转到记事本页面');
        });
        
        // 添加键盘支持（按Enter键也可触发）
        notebookIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
});

// 为音乐播放器图标添加交互效果
document.addEventListener('DOMContentLoaded', function() {
    const musicPlayerIcon = document.getElementById('futureMusicPlayerIcon');
    
    if (musicPlayerIcon) {
        // 点击动画效果
        musicPlayerIcon.addEventListener('click', function(e) {
            // 添加点击动画类
            this.classList.add('music-icon-clicked');
            
            // 移除动画类以便下次点击可以再次触发
            setTimeout(() => {
                this.classList.remove('music-icon-clicked');
            }, 300);
            
            // 可以在这里添加其他点击效果，比如声音等
            console.log('音乐播放器图标被点击，即将跳转到音乐播放器页面');
        });
        
        // 添加键盘支持（按Enter键也可触发）
        musicPlayerIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 为图标添加鼠标悬停时的音效增强效果
        musicPlayerIcon.addEventListener('mouseenter', function() {
            const waves = document.querySelectorAll('.music-wave');
            waves.forEach(wave => {
                wave.style.animationPlayState = 'running';
                wave.style.animationDuration = '0.8s';
            });
        });
        
        musicPlayerIcon.addEventListener('mouseleave', function() {
            const waves = document.querySelectorAll('.music-wave');
            waves.forEach(wave => {
                wave.style.animationPlayState = 'running';
                wave.style.animationDuration = '1.5s';
            });
        });
    }
});

// 为书架图标添加交互效果
document.addEventListener('DOMContentLoaded', function() {
    const bookshelfIcon = document.getElementById('futureBookshelfIcon');
    
    if (bookshelfIcon) {
        // 点击动画效果
        bookshelfIcon.addEventListener('click', function(e) {
            // 添加点击动画类
            this.classList.add('bookshelf-icon-clicked');
            
            // 模拟书本跳动的效果
            const books = document.querySelectorAll('.book');
            books.forEach((book, index) => {
                setTimeout(() => {
                    book.style.transform = 'translateY(-8px)';
                    setTimeout(() => {
                        book.style.transform = '';
                    }, 200);
                }, index * 50);
            });
            
            // 移除动画类以便下次点击可以再次触发
            setTimeout(() => {
                this.classList.remove('bookshelf-icon-clicked');
            }, 300);
            
            console.log('书架图标被点击，即将跳转到书架页面');
        });
        
        // 添加键盘支持（按Enter键也可触发）
        bookshelfIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 为图标添加鼠标悬停时的书本浮动效果
        bookshelfIcon.addEventListener('mouseenter', function() {
            const books = document.querySelectorAll('.book');
            books.forEach((book, index) => {
                setTimeout(() => {
                    book.style.transition = 'transform 0.3s ease';
                }, index * 50);
            });
        });
        
        // 添加书本随机颜色变化效果（可选）
        const books = document.querySelectorAll('.book');
        books.forEach(book => {
            book.addEventListener('mouseenter', function() {
                const randomHue = Math.floor(Math.random() * 360);
                this.style.background = `linear-gradient(to right, hsl(${randomHue}, 80%, 60%) 0%, hsl(${randomHue}, 80%, 70%) 100%)`;
            });
            
            book.addEventListener('mouseleave', function() {
                // 恢复原始颜色（需要根据原始颜色设置）
                if (this.classList.contains('book1')) {
                    this.style.background = 'linear-gradient(to right, #ff6b6b 0%, #ff8e8e 100%)';
                } else if (this.classList.contains('book2')) {
                    this.style.background = 'linear-gradient(to right, #4ecdc4 0%, #6ae6de 100%)';
                } else if (this.classList.contains('book3')) {
                    this.style.background = 'linear-gradient(to right, #45b7d1 0%, #6ad1e8 100%)';
                } else if (this.classList.contains('book4')) {
                    this.style.background = 'linear-gradient(to right, #96c93d 0%, #b0e05c 100%)';
                }
            });
        });
    }
});

// 为画板图标添加交互效果
document.addEventListener('DOMContentLoaded', function() {
    const drawingBoardIcon = document.getElementById('futureDrawingBoardIcon');
    
    if (drawingBoardIcon) {
        // 点击动画效果
        drawingBoardIcon.addEventListener('click', function(e) {
            // 添加点击动画类
            this.classList.add('drawing-board-icon-clicked');
            
            // 创建颜料飞溅效果
            createPaintSplash();
            
            // 移除动画类以便下次点击可以再次触发
            setTimeout(() => {
                this.classList.remove('drawing-board-icon-clicked');
            }, 300);
            
            console.log('画板图标被点击，即将跳转到画板页面');
        });
        
        // 添加键盘支持（按Enter键也可触发）
        drawingBoardIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 为图标添加鼠标悬停时的画笔移动效果
        drawingBoardIcon.addEventListener('mouseenter', function() {
            const brushHandle = document.querySelector('.brush-handle');
            const brushBristles = document.querySelector('.brush-bristles');
            
            if (brushHandle && brushBristles) {
                brushHandle.style.transition = 'transform 0.3s ease';
                brushBristles.style.transition = 'transform 0.3s ease';
            }
        });
        
        // 创建颜料飞溅效果函数
        function createPaintSplash() {
            const iconShape = document.querySelector('.drawing-board-icon-shape');
            
            // 创建多个飞溅点
            for (let i = 0; i < 8; i++) {
                const splash = document.createElement('div');
                splash.className = 'paint-splash';
                
                // 随机颜色
                const colors = ['#E91E63', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                // 随机大小和位置
                const size = Math.random() * 5 + 3;
                const startX = 35 + Math.random() * 20;
                const startY = 35 + Math.random() * 20;
                
                // 随机方向
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 20 + 10;
                
                splash.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${randomColor};
                    border-radius: 50%;
                    left: ${startX}px;
                    top: ${startY}px;
                    opacity: 0;
                    z-index: 5;
                `;
                
                iconShape.appendChild(splash);
                
                // 动画
                setTimeout(() => {
                    splash.style.transition = 'all 0.4s ease';
                    splash.style.opacity = '0.8';
                    splash.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.5)`;
                    
                    // 移除元素
                    setTimeout(() => {
                        splash.style.opacity = '0';
                        setTimeout(() => {
                            if (splash.parentNode === iconShape) {
                                iconShape.removeChild(splash);
                            }
                        }, 300);
                    }, 300);
                }, i * 30);
            }
        }
    }
});

// 为视频图标添加交互效果
document.addEventListener('DOMContentLoaded', function() {
    const videoIcon = document.getElementById('futureVideoIcon');
    
    if (videoIcon) {
        // 点击动画效果
        videoIcon.addEventListener('click', function(e) {
            // 添加点击动画类
            this.classList.add('video-icon-clicked');
            
            // 增强信号波动画效果
            enhanceSignalWaves();
            
            // 移除动画类以便下次点击可以再次触发
            setTimeout(() => {
                this.classList.remove('video-icon-clicked');
            }, 300);
            
            console.log('视频图标被点击，即将跳转到视频页面');
        });
        
        // 添加键盘支持（按Enter键也可触发）
        videoIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 为图标添加鼠标悬停时的信号增强效果
        videoIcon.addEventListener('mouseenter', function() {
            const waves = document.querySelectorAll('.signal-wave');
            waves.forEach(wave => {
                wave.style.animationPlayState = 'running';
                wave.style.animationDuration = '1s';
            });
            
            // 添加屏幕闪烁效果
            const screen = document.querySelector('.video-screen');
            if (screen) {
                screen.style.boxShadow = 'inset 0 0 20px rgba(0, 0, 0, 0.8), 0 3px 8px rgba(0, 0, 0, 0.5)';
            }
        });
        
        videoIcon.addEventListener('mouseleave', function() {
            const waves = document.querySelectorAll('.signal-wave');
            waves.forEach(wave => {
                wave.style.animationPlayState = 'running';
                wave.style.animationDuration = '2s';
            });
            
            // 恢复屏幕阴影
            const screen = document.querySelector('.video-screen');
            if (screen) {
                screen.style.boxShadow = 'inset 0 0 15px rgba(0, 0, 0, 0.7), 0 2px 5px rgba(0, 0, 0, 0.4)';
            }
        });
        
        // 增强信号波动画效果函数
        function enhanceSignalWaves() {
            const waves = document.querySelectorAll('.signal-wave');
            waves.forEach((wave, index) => {
                // 临时加快动画速度
                wave.style.animationDuration = '0.5s';
                
                // 添加颜色变化
                wave.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                
                // 恢复原样
                setTimeout(() => {
                    wave.style.animationDuration = '2s';
                    wave.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }, 500);
            });
            
            // 创建额外的脉冲效果
            createExtraPulse();
        }
        
        // 创建额外脉冲效果
        function createExtraPulse() {
            const iconShape = document.querySelector('.video-icon-shape');
            
            for (let i = 0; i < 3; i++) {
                const pulse = document.createElement('div');
                pulse.className = 'extra-pulse';
                
                pulse.style.cssText = `
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.6);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    z-index: 1;
                `;
                
                iconShape.appendChild(pulse);
                
                // 动画
                setTimeout(() => {
                    pulse.style.transition = 'all 0.5s ease';
                    pulse.style.opacity = '0.8';
                    pulse.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    pulse.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    
                    // 移除元素
                    setTimeout(() => {
                        pulse.style.opacity = '0';
                        setTimeout(() => {
                            if (pulse.parentNode === iconShape) {
                                iconShape.removeChild(pulse);
                            }
                        }, 300);
                    }, 500);
                }, i * 100);
            }
        }
    }
});

// 为代码库图标添加交互效果
document.addEventListener('DOMContentLoaded', function() {
    const codeIcon = document.getElementById('futureCodeIcon');
    
    if (codeIcon) {
        // 点击动画效果
        codeIcon.addEventListener('click', function(e) {
            // 添加点击动画类
            this.classList.add('code-icon-clicked');
            
            // 创建代码流效果
            createCodeFlowEffect();
            
            // 移除动画类以便下次点击可以再次触发
            setTimeout(() => {
                this.classList.remove('code-icon-clicked');
            }, 300);
            
            console.log('代码库图标被点击，即将跳转到代码库页面');
        });
        
        // 添加键盘支持（按Enter键也可触发）
        codeIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 为图标添加鼠标悬停时的代码动画效果
        codeIcon.addEventListener('mouseenter', function() {
            const brackets = document.querySelectorAll('.code-bracket');
            brackets.forEach(bracket => {
                bracket.style.transition = 'all 0.3s ease';
            });
            
            // 让代码行有打字机效果
            const lines = document.querySelectorAll('.code-line');
            lines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.width = '0px';
                    setTimeout(() => {
                        if (line.classList.contains('line1')) {
                            line.style.width = '35px';
                        } else if (line.classList.contains('line2')) {
                            line.style.width = '45px';
                        } else if (line.classList.contains('line3')) {
                            line.style.width = '30px';
                        }
                    }, 200);
                }, index * 100);
            });
        });
        
        // 创建代码流效果函数
        function createCodeFlowEffect() {
            const iconShape = document.querySelector('.code-icon-shape');
            const codeChars = ['{', '}', '<', '>', '(', ')', '[', ']', ';', '=', '+', '-', '*', '/'];
            
            // 创建多个代码字符流
            for (let i = 0; i < 12; i++) {
                const codeChar = document.createElement('div');
                codeChar.className = 'code-flow-char';
                
                // 随机字符
                const randomChar = codeChars[Math.floor(Math.random() * codeChars.length)];
                
                // 随机位置和大小
                const size = Math.random() * 12 + 8;
                const startX = Math.random() * 60 + 10;
                
                codeChar.textContent = randomChar;
                codeChar.style.cssText = `
                    position: absolute;
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    font-size: ${size}px;
                    color: rgba(255, 255, 255, 0.8);
                    left: ${startX}px;
                    top: 75px;
                    opacity: 0;
                    z-index: 5;
                    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
                `;
                
                iconShape.appendChild(codeChar);
                
                // 动画
                setTimeout(() => {
                    codeChar.style.transition = 'all 0.6s ease';
                    codeChar.style.opacity = '0.8';
                    codeChar.style.top = `${-10 - Math.random() * 20}px`;
                    codeChar.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
                    
                    // 移除元素
                    setTimeout(() => {
                        codeChar.style.opacity = '0';
                        setTimeout(() => {
                            if (codeChar.parentNode === iconShape) {
                                iconShape.removeChild(codeChar);
                            }
                        }, 300);
                    }, 600);
                }, i * 50);
            }
        }
        
        // 添加代码字符随机闪烁效果
        function addCodeCharBlink() {
            const brackets = document.querySelectorAll('.code-bracket');
            
            setInterval(() => {
                brackets.forEach(bracket => {
                    const originalColor = bracket.style.color;
                    bracket.style.color = 'rgba(255, 255, 255, 1)';
                    bracket.style.textShadow = '0 0 15px rgba(255, 255, 255, 0.9)';
                    
                    setTimeout(() => {
                        bracket.style.color = originalColor || 'rgba(255, 255, 255, 0.9)';
                        bracket.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.7)';
                    }, 200);
                });
            }, 3000);
        }
        
        // 启动代码字符闪烁效果
        setTimeout(addCodeCharBlink, 1000);
    }
});

// 为商城图标添加交互效果
document.addEventListener('DOMContentLoaded', function() {
    const shopIcon = document.getElementById('futureShopIcon');
    
    if (shopIcon) {
        // 点击动画效果
        shopIcon.addEventListener('click', function(e) {
            // 添加点击动画类
            this.classList.add('shop-icon-clicked');
            
            // 创建商品弹出效果
            createItemPopEffect();
            
            // 移除动画类以便下次点击可以再次触发
            setTimeout(() => {
                this.classList.remove('shop-icon-clicked');
            }, 300);
            
            console.log('商城图标被点击，即将跳转到商城页面');
        });
        
        // 添加键盘支持（按Enter键也可触发）
        shopIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 为图标添加鼠标悬停时的商品浮动效果
        shopIcon.addEventListener('mouseenter', function() {
            const items = document.querySelectorAll('.shop-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.animation = 'itemBounce 0.5s ease';
                    setTimeout(() => {
                        item.style.animation = '';
                    }, 500);
                }, index * 100);
            });
        });
        
        // 创建商品弹出效果函数
        function createItemPopEffect() {
            const iconShape = document.querySelector('.shop-icon-shape');
            const colors = ['#4CAF50', '#2196F3', '#E91E63', '#FF9800', '#9C27B0'];
            
            // 创建多个商品弹出元素
            for (let i = 0; i < 6; i++) {
                const item = document.createElement('div');
                item.className = 'pop-item';
                
                // 随机颜色
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                // 随机大小和位置
                const size = Math.random() * 8 + 5;
                const startX = 37;
                const startY = 42;
                
                // 随机方向
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 25 + 15;
                
                item.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${randomColor};
                    border-radius: 50%;
                    left: ${startX}px;
                    top: ${startY}px;
                    opacity: 0;
                    z-index: 5;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                `;
                
                iconShape.appendChild(item);
                
                // 动画
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '0.9';
                    item.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.8)`;
                    
                    // 移除元素
                    setTimeout(() => {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            if (item.parentNode === iconShape) {
                                iconShape.removeChild(item);
                            }
                        }, 300);
                    }, 400);
                }, i * 80);
            }
        }
        
        // 添加价格标签旋转效果
        const priceTag = document.querySelector('.price-tag');
        if (priceTag) {
            let rotation = 0;
            
            shopIcon.addEventListener('mouseenter', function() {
                rotation += 180;
                priceTag.style.transform = `rotate(${rotation}deg)`;
            });
        }
        
        // 添加商品随机颜色变化效果（可选）
        const items = document.querySelectorAll('.shop-item');
        items.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const colors = ['#4CAF50', '#2196F3', '#E91E63', '#FF9800', '#9C27B0', '#FF5722'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                this.style.background = `linear-gradient(135deg, ${randomColor} 0%, ${lightenColor(randomColor, 20)} 100%)`;
            });
            
            item.addEventListener('mouseleave', function() {
                // 恢复原始颜色
                if (this.classList.contains('item1')) {
                    this.style.background = 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)';
                } else if (this.classList.contains('item2')) {
                    this.style.background = 'linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)';
                } else if (this.classList.contains('item3')) {
                    this.style.background = 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)';
                }
            });
        });
        
        // 辅助函数：颜色变亮
        function lightenColor(color, percent) {
            const num = parseInt(color.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) + amt;
            const G = (num >> 8 & 0x00FF) + amt;
            const B = (num & 0x0000FF) + amt;
            
            return "#" + (
                0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                (B < 255 ? (B < 1 ? 0 : B) : 255)
            ).toString(16).slice(1);
        }
    }
});

// 为今日运势图标添加交互效果
document.addEventListener('DOMContentLoaded', function() {
    const luckIcon = document.getElementById('futureLuckIcon');
    
    if (luckIcon) {
        // 点击动画效果
        luckIcon.addEventListener('click', function(e) {
            // 添加点击动画类
            this.classList.add('luck-icon-clicked');
            
            // 创建幸运效果
            createLuckEffect();
            
            // 移除动画类以便下次点击可以再次触发
            setTimeout(() => {
                this.classList.remove('luck-icon-clicked');
            }, 300);
            
            console.log('今日运势图标被点击，即将跳转到运势页面');
        });
        
        // 添加键盘支持（按Enter键也可触发）
        luckIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 为图标添加鼠标悬停时的星光效果
        luckIcon.addEventListener('mouseenter', function() {
            const stars = document.querySelectorAll('.fortune-star');
            stars.forEach((star, index) => {
                star.style.transition = 'all 0.3s ease';
            });
            
            // 触发闪光效果
            const sparkles = document.querySelectorAll('.sparkle');
            sparkles.forEach(sparkle => {
                sparkle.style.opacity = '1';
            });
        });
        
        luckIcon.addEventListener('mouseleave', function() {
            // 恢复闪光效果
            const sparkles = document.querySelectorAll('.sparkle');
            sparkles.forEach(sparkle => {
                sparkle.style.opacity = '0';
            });
        });
        
        // 创建幸运效果函数
        function createLuckEffect() {
            const iconShape = document.querySelector('.luck-icon-shape');
            const symbols = ['★', '☆', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '♈', '♉', '♊'];
            
            // 创建多个幸运符号效果
            for (let i = 0; i < 8; i++) {
                const symbol = document.createElement('div');
                symbol.className = 'luck-symbol-effect';
                
                // 随机符号
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                
                // 随机大小和位置
                const size = Math.random() * 16 + 12;
                const startX = 37;
                const startY = 37;
                
                // 随机方向
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 30 + 20;
                
                symbol.textContent = randomSymbol;
                symbol.style.cssText = `
                    position: absolute;
                    font-family: 'Arial', sans-serif;
                    font-size: ${size}px;
                    color: rgba(255, 255, 255, 0.9);
                    left: ${startX}px;
                    top: ${startY}px;
                    opacity: 0;
                    z-index: 5;
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
                    transform: translate(-50%, -50%);
                `;
                
                iconShape.appendChild(symbol);
                
                // 动画
                setTimeout(() => {
                    symbol.style.transition = 'all 0.6s ease';
                    symbol.style.opacity = '0.8';
                    symbol.style.transform = `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(0.8)`;
                    symbol.style.color = getRandomColor();
                    
                    // 移除元素
                    setTimeout(() => {
                        symbol.style.opacity = '0';
                        setTimeout(() => {
                            if (symbol.parentNode === iconShape) {
                                iconShape.removeChild(symbol);
                            }
                        }, 300);
                    }, 600);
                }, i * 80);
            }
            
            // 创建水晶球光芒效果
            createCrystalGlow();
        }
        
        // 创建水晶球光芒效果
        function createCrystalGlow() {
            const crystalBall = document.querySelector('.crystal-ball');
            
            for (let i = 0; i < 5; i++) {
                const glowRing = document.createElement('div');
                glowRing.className = 'crystal-glow-ring';
                
                glowRing.style.cssText = `
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    z-index: 1;
                `;
                
                if (crystalBall.parentNode === document.querySelector('.luck-icon-shape')) {
                    document.querySelector('.luck-icon-shape').appendChild(glowRing);
                } else {
                    return;
                }
                
                // 动画
                setTimeout(() => {
                    glowRing.style.transition = 'all 0.8s ease';
                    glowRing.style.opacity = '0.6';
                    glowRing.style.transform = 'translate(-50%, -50%) scale(1.8)';
                    glowRing.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    
                    // 移除元素
                    setTimeout(() => {
                        glowRing.style.opacity = '0';
                        setTimeout(() => {
                            if (glowRing.parentNode === document.querySelector('.luck-icon-shape')) {
                                document.querySelector('.luck-icon-shape').removeChild(glowRing);
                            }
                        }, 300);
                    }, 800);
                }, i * 150);
            }
        }
        
        // 辅助函数：获取随机颜色
        function getRandomColor() {
            const colors = [
                '#FFD700', // 金色
                '#FF6B6B', // 红色
                '#4ECDC4', // 青色
                '#45B7D1', // 蓝色
                '#96C93D', // 绿色
                '#FFA500', // 橙色
                '#BA68C8'  // 紫色
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        // 添加随机星座符号变化
        const zodiacSymbol = document.querySelector('.zodiac-symbol');
        if (zodiacSymbol) {
            const zodiacs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
            
            luckIcon.addEventListener('mouseenter', function() {
                const randomIndex = Math.floor(Math.random() * zodiacs.length);
                zodiacSymbol.textContent = zodiacs[randomIndex];
            });
        }
    }
});

// 为超级计算图标添加交互效果
document.addEventListener('DOMContentLoaded', function() {
    const computerIcon = document.getElementById('futureComputerIcon');
    
    if (computerIcon) {
        // 点击动画效果
        computerIcon.addEventListener('click', function(e) {
            // 添加点击动画类
            this.classList.add('computer-icon-clicked');
            
            // 创建数据处理效果
            createDataProcessingEffect();
            
            // 移除动画类以便下次点击可以再次触发
            setTimeout(() => {
                this.classList.remove('computer-icon-clicked');
            }, 300);
            
            console.log('超级计算图标被点击，即将跳转到计算机页面');
        });
        
        // 添加键盘支持（按Enter键也可触发）
        computerIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 为图标添加鼠标悬停时的数据流动画
        computerIcon.addEventListener('mouseenter', function() {
            const dataLines = document.querySelectorAll('.data-line');
            dataLines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.transform = 'scaleX(1.2)';
                    setTimeout(() => {
                        line.style.transform = '';
                    }, 300);
                }, index * 100);
            });
            
            // 启动核心闪烁效果
            startCoreBlinking();
        });
        
        computerIcon.addEventListener('mouseleave', function() {
            // 停止核心闪烁效果
            stopCoreBlinking();
        });
        
        // 创建数据处理效果函数
        function createDataProcessingEffect() {
            const iconShape = document.querySelector('.computer-icon-shape');
            const binaryDigits = ['0', '1'];
            
            // 创建多个二进制数据流
            for (let i = 0; i < 10; i++) {
                const dataBit = document.createElement('div');
                dataBit.className = 'data-bit-effect';
                
                // 随机二进制数字
                const randomBit = binaryDigits[Math.floor(Math.random() * binaryDigits.length)];
                
                // 随机大小和位置
                const size = Math.random() * 10 + 8;
                const startX = Math.random() * 60 + 10;
                const startY = 75; // 从底部开始
                
                // 随机速度和方向
                const speed = Math.random() * 3 + 2;
                const angle = Math.random() * Math.PI * 2;
                
                dataBit.textContent = randomBit;
                dataBit.style.cssText = `
                    position: absolute;
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    font-size: ${size}px;
                    color: rgba(255, 255, 255, 0.9);
                    left: ${startX}px;
                    top: ${startY}px;
                    opacity: 0;
                    z-index: 5;
                    text-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
                `;
                
                iconShape.appendChild(dataBit);
                
                // 动画
                setTimeout(() => {
                    dataBit.style.transition = `all ${speed}s linear`;
                    dataBit.style.opacity = '0.8';
                    dataBit.style.top = `${-20 - Math.random() * 30}px`;
                    dataBit.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
                    
                    // 颜色变化
                    const colors = ['#00BCD4', '#2196F3', '#4CAF50', '#FF9800'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    dataBit.style.color = randomColor;
                    
                    // 移除元素
                    setTimeout(() => {
                        dataBit.style.opacity = '0';
                        setTimeout(() => {
                            if (dataBit.parentNode === iconShape) {
                                iconShape.removeChild(dataBit);
                            }
                        }, 300);
                    }, speed * 1000);
                }, i * 100);
            }
            
            // 创建核心脉冲效果
            createCorePulseEffect();
        }
        
        // 创建核心脉冲效果
        function createCorePulseEffect() {
            const cores = document.querySelectorAll('.chip-core');
            
            cores.forEach((core, index) => {
                setTimeout(() => {
                    // 保存原始背景
                    const originalBackground = core.style.background;
                    
                    // 脉冲效果
                    core.style.background = 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)';
                    core.style.boxShadow = '0 0 15px rgba(255, 87, 34, 0.9)';
                    
                    // 恢复
                    setTimeout(() => {
                        core.style.background = originalBackground || 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)';
                        core.style.boxShadow = '0 0 8px rgba(0, 188, 212, 0.7)';
                    }, 200);
                }, index * 100);
            });
        }
        
        // 启动核心闪烁效果
        let coreBlinkInterval;
        function startCoreBlinking() {
            const cores = document.querySelectorAll('.chip-core');
            
            coreBlinkInterval = setInterval(() => {
                const randomCore = cores[Math.floor(Math.random() * cores.length)];
                
                // 保存原始样式
                const originalBackground = randomCore.style.background;
                const originalBoxShadow = randomCore.style.boxShadow;
                
                // 闪烁效果
                randomCore.style.background = 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)';
                randomCore.style.boxShadow = '0 0 12px rgba(255, 87, 34, 0.9)';
                
                // 恢复
                setTimeout(() => {
                    randomCore.style.background = originalBackground || 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)';
                    randomCore.style.boxShadow = originalBoxShadow || '0 0 8px rgba(0, 188, 212, 0.7)';
                }, 150);
            }, 800);
        }
        
        // 停止核心闪烁效果
        function stopCoreBlinking() {
            if (coreBlinkInterval) {
                clearInterval(coreBlinkInterval);
            }
        }
        
        // 添加二进制数字变化效果
        const binaryDigits = document.querySelectorAll('.binary-digit');
        binaryDigits.forEach(digit => {
            digit.addEventListener('mouseenter', function() {
                const currentDigit = this.textContent;
                this.textContent = currentDigit === '0' ? '1' : '0';
                
                // 添加颜色变化
                this.style.color = currentDigit === '0' ? '#4CAF50' : '#2196F3';
                
                setTimeout(() => {
                    this.style.color = 'rgba(255, 255, 255, 0.8)';
                }, 500);
            });
        });
    }
});

// 为网址导航图标添加交互效果
document.addEventListener('DOMContentLoaded', function() {
    const linkStationIcon = document.getElementById('futureLinkStationIcon');
    
    if (linkStationIcon) {
        // 点击动画效果
        linkStationIcon.addEventListener('click', function(e) {
            // 添加点击动画类
            this.classList.add('link-station-icon-clicked');
            
            // 创建链接脉冲效果
            createLinkPulseEffect();
            
            // 移除动画类以便下次点击可以再次触发
            setTimeout(() => {
                this.classList.remove('link-station-icon-clicked');
            }, 300);
            
            console.log('网址导航图标被点击，即将跳转到网址导航页面');
        });
        
        // 添加键盘支持（按Enter键也可触发）
        linkStationIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 为图标添加鼠标悬停时的节点动画
        linkStationIcon.addEventListener('mouseenter', function() {
            const nodes = document.querySelectorAll('.link-node');
            nodes.forEach((node, index) => {
                setTimeout(() => {
                    node.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        node.style.transform = '';
                    }, 300);
                }, index * 100);
            });
            
            // 启动连接线闪烁效果
            startLineBlinking();
        });
        
        linkStationIcon.addEventListener('mouseleave', function() {
            // 停止连接线闪烁效果
            stopLineBlinking();
        });
        
        // 创建链接脉冲效果函数
        function createLinkPulseEffect() {
            const iconShape = document.querySelector('.link-station-icon-shape');
            const nodes = document.querySelectorAll('.link-node');
            
            // 为每个节点创建脉冲效果
            nodes.forEach((node, index) => {
                setTimeout(() => {
                    const pulse = document.createElement('div');
                    pulse.className = 'link-pulse-effect';
                    
                    const rect = node.getBoundingClientRect();
                    const parentRect = iconShape.getBoundingClientRect();
                    
                    const size = 8;
                    const left = rect.left - parentRect.left + size/2;
                    const top = rect.top - parentRect.top + size/2;
                    
                    pulse.style.cssText = `
                        position: absolute;
                        width: ${size}px;
                        height: ${size}px;
                        border-radius: 50%;
                        border: 2px solid rgba(255, 255, 255, 0.7);
                        left: ${left}px;
                        top: ${top}px;
                        opacity: 0;
                        z-index: 2;
                        transform: translate(-50%, -50%);
                    `;
                    
                    iconShape.appendChild(pulse);
                    
                    // 动画
                    setTimeout(() => {
                        pulse.style.transition = 'all 0.8s ease';
                        pulse.style.opacity = '0.8';
                        pulse.style.transform = 'translate(-50%, -50%) scale(3)';
                        pulse.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        
                        // 移除元素
                        setTimeout(() => {
                            pulse.style.opacity = '0';
                            setTimeout(() => {
                                if (pulse.parentNode === iconShape) {
                                    iconShape.removeChild(pulse);
                                }
                            }, 300);
                        }, 800);
                    }, 10);
                }, index * 150);
            });
            
            // 创建数据流动效果
            createDataFlowEffect();
        }
        
        // 创建数据流动效果
        function createDataFlowEffect() {
            const iconShape = document.querySelector('.link-station-icon-shape');
            const lines = document.querySelectorAll('.link-line');
            
            lines.forEach((line, index) => {
                setTimeout(() => {
                    // 创建流动光点
                    const flowDot = document.createElement('div');
                    flowDot.className = 'flow-dot';
                    
                    // 根据线的位置设置初始位置
                    let startX, startY, endX, endY;
                    
                    if (line.classList.contains('line1')) {
                        startX = 26;
                        startY = 22;
                        endX = 26 + 20 * Math.cos(45 * Math.PI/180);
                        endY = 22 + 20 * Math.sin(45 * Math.PI/180);
                    } else if (line.classList.contains('line2')) {
                        startX = 75 - 26;
                        startY = 22;
                        endX = startX - 20 * Math.cos(45 * Math.PI/180);
                        endY = 22 + 20 * Math.sin(45 * Math.PI/180);
                    } else if (line.classList.contains('line3')) {
                        startX = 35;
                        startY = 75 - 22;
                        endX = 35 + 20;
                        endY = 75 - 22;
                    }
                    
                    flowDot.style.cssText = `
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        background: rgba(255, 255, 255, 0.9);
                        border-radius: 50%;
                        left: ${startX}px;
                        top: ${startY}px;
                        box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
                        z-index: 3;
                    `;
                    
                    iconShape.appendChild(flowDot);
                    
                    // 动画
                    setTimeout(() => {
                        flowDot.style.transition = 'all 0.6s linear';
                        flowDot.style.left = `${endX}px`;
                        flowDot.style.top = `${endY}px`;
                        
                        // 移除元素
                        setTimeout(() => {
                            flowDot.style.opacity = '0';
                            setTimeout(() => {
                                if (flowDot.parentNode === iconShape) {
                                    iconShape.removeChild(flowDot);
                                }
                            }, 300);
                        }, 600);
                    }, 10);
                }, index * 200);
            });
        }
        
        // 启动连接线闪烁效果
        let lineBlinkInterval;
        function startLineBlinking() {
            const lines = document.querySelectorAll('.link-line');
            
            lineBlinkInterval = setInterval(() => {
                const randomLine = lines[Math.floor(Math.random() * lines.length)];
                
                // 保存原始样式
                const originalBackground = randomLine.style.background;
                
                // 闪烁效果
                randomLine.style.background = 'rgba(255, 255, 255, 0.9)';
                randomLine.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                
                // 恢复
                setTimeout(() => {
                    randomLine.style.background = originalBackground || 'rgba(255, 255, 255, 0.6)';
                    randomLine.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.4)';
                }, 200);
            }, 1000);
        }
        
        // 停止连接线闪烁效果
        function stopLineBlinking() {
            if (lineBlinkInterval) {
                clearInterval(lineBlinkInterval);
            }
        }
        
        // 添加地球旋转效果
        const globalIcon = document.querySelector('.global-icon');
        if (globalIcon) {
            let rotation = 0;
            
            linkStationIcon.addEventListener('mouseenter', function() {
                // 开始缓慢旋转
                const rotateInterval = setInterval(() => {
                    rotation += 0.5;
                    globalIcon.style.transform = `rotate(${rotation}deg)`;
                    
                    // 停止条件
                    if (!linkStationIcon.matches(':hover')) {
                        clearInterval(rotateInterval);
                    }
                }, 50);
                
                // 保存interval ID以便清理
                globalIcon.dataset.rotateInterval = rotateInterval;
            });
            
            linkStationIcon.addEventListener('mouseleave', function() {
                if (globalIcon.dataset.rotateInterval) {
                    clearInterval(parseInt(globalIcon.dataset.rotateInterval));
                }
            });
        }
    }
});

// 为YOCIM助手图标添加交互效果
document.addEventListener('DOMContentLoaded', function() {
    const yocimIcon = document.getElementById('futureYocimIcon');
    
    if (yocimIcon) {
        // 点击动画效果
        yocimIcon.addEventListener('click', function(e) {
            // 添加点击动画类
            this.classList.add('yocim-icon-clicked');
            
            // 创建AI激活效果
            createAIActivationEffect();
            
            // 移除动画类以便下次点击可以再次触发
            setTimeout(() => {
                this.classList.remove('yocim-icon-clicked');
            }, 300);
            
            console.log('YOCIM助手图标被点击，即将跳转到YOCIM助手页面');
        });
        
        // 添加键盘支持（按Enter键也可触发）
        yocimIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 为图标添加鼠标悬停时的AI效果
        yocimIcon.addEventListener('mouseenter', function() {
            const eyes = document.querySelectorAll('.assistant-eye');
            eyes.forEach(eye => {
                eye.style.animation = 'none';
                setTimeout(() => {
                    eye.style.animation = 'eyeBlink 1s infinite';
                }, 10);
            });
            
            // 启动电路脉冲效果
            startCircuitPulse();
            
            // 改变对话气泡文本
            const speechBubble = document.querySelector('.speech-bubble');
            if (speechBubble) {
                const originalText = speechBubble.textContent;
                speechBubble.textContent = 'Hi!';
                
                setTimeout(() => {
                    speechBubble.textContent = originalText;
                }, 1500);
            }
        });
        
        yocimIcon.addEventListener('mouseleave', function() {
            // 停止电路脉冲效果
            stopCircuitPulse();
        });
        
        // 创建AI激活效果函数
        function createAIActivationEffect() {
            const iconShape = document.querySelector('.yocim-icon-shape');
            
            // 创建多个数据粒子效果
            for (let i = 0; i < 12; i++) {
                const dataParticle = document.createElement('div');
                dataParticle.className = 'data-particle';
                
                // 随机大小和颜色
                const size = Math.random() * 6 + 3;
                const colors = ['#00BCD4', '#4CAF50', '#FF9800', '#9C27B0', '#2196F3'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                // 随机位置和方向
                const startX = 37;
                const startY = 37;
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 25 + 15;
                
                dataParticle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${randomColor};
                    border-radius: 50%;
                    left: ${startX}px;
                    top: ${startY}px;
                    opacity: 0;
                    z-index: 5;
                    box-shadow: 0 0 8px ${randomColor};
                `;
                
                iconShape.appendChild(dataParticle);
                
                // 动画
                setTimeout(() => {
                    dataParticle.style.transition = 'all 0.6s ease';
                    dataParticle.style.opacity = '0.9';
                    dataParticle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.8)`;
                    
                    // 移除元素
                    setTimeout(() => {
                        dataParticle.style.opacity = '0';
                        setTimeout(() => {
                            if (dataParticle.parentNode === iconShape) {
                                iconShape.removeChild(dataParticle);
                            }
                        }, 300);
                    }, 600);
                }, i * 50);
            }
            
            // 创建眼睛发光效果
            createEyeGlowEffect();
            
            // 创建电路激活效果
            createCircuitActivation();
        }
        
        // 创建眼睛发光效果
        function createEyeGlowEffect() {
            const eyes = document.querySelectorAll('.assistant-eye');
            
            eyes.forEach((eye, index) => {
                setTimeout(() => {
                    // 保存原始样式
                    const originalBackground = eye.style.background;
                    const originalBoxShadow = eye.style.boxShadow;
                    
                    // 发光效果
                    eye.style.background = 'linear-gradient(135deg, #FFEB3B 0%, #FFC107 100%)';
                    eye.style.boxShadow = '0 0 15px rgba(255, 235, 59, 0.9)';
                    
                    // 创建眼睛光晕
                    const eyeGlow = document.createElement('div');
                    eyeGlow.className = 'eye-glow';
                    
                    const rect = eye.getBoundingClientRect();
                    const parentRect = document.querySelector('.yocim-icon-shape').getBoundingClientRect();
                    
                    eyeGlow.style.cssText = `
                        position: absolute;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: radial-gradient(circle, rgba(255, 235, 59, 0.6) 0%, rgba(255, 235, 59, 0) 70%);
                        left: ${rect.left - parentRect.left - 3}px;
                        top: ${rect.top - parentRect.top - 3}px;
                        opacity: 0;
                        z-index: 2;
                    `;
                    
                    document.querySelector('.yocim-icon-shape').appendChild(eyeGlow);
                    
                    // 光晕动画
                    setTimeout(() => {
                        eyeGlow.style.transition = 'all 0.4s ease';
                        eyeGlow.style.opacity = '0.8';
                        eyeGlow.style.transform = 'scale(1.5)';
                        
                        // 移除光晕和恢复眼睛样式
                        setTimeout(() => {
                            eyeGlow.style.opacity = '0';
                            eye.style.background = originalBackground || 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)';
                            eye.style.boxShadow = originalBoxShadow || '0 0 8px rgba(0, 188, 212, 0.7)';
                            
                            setTimeout(() => {
                                if (eyeGlow.parentNode === document.querySelector('.yocim-icon-shape')) {
                                    document.querySelector('.yocim-icon-shape').removeChild(eyeGlow);
                                }
                            }, 300);
                        }, 400);
                    }, 10);
                }, index * 150);
            });
        }
        
        // 创建电路激活效果
        function createCircuitActivation() {
            const circuitLines = document.querySelectorAll('.circuit-line');
            const circuitDots = document.querySelectorAll('.circuit-dot');
            
            // 激活电路线
            circuitLines.forEach((line, index) => {
                setTimeout(() => {
                    const originalBackground = line.style.background;
                    line.style.background = 'rgba(255, 255, 255, 0.9)';
                    line.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                    
                    // 恢复
                    setTimeout(() => {
                        line.style.background = originalBackground || 'rgba(255, 255, 255, 0.6)';
                        line.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.4)';
                    }, 300);
                }, index * 100);
            });
            
            // 激活电路点
            circuitDots.forEach((dot, index) => {
                setTimeout(() => {
                    dot.style.background = 'rgba(255, 255, 255, 1)';
                    dot.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                    dot.style.transform = 'scale(1.5)';
                    
                    // 恢复
                    setTimeout(() => {
                        dot.style.background = 'rgba(255, 255, 255, 0.8)';
                        dot.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.5)';
                        dot.style.transform = 'scale(1)';
                    }, 300);
                }, index * 100 + 50);
            });
        }
        
        // 启动电路脉冲效果
        let circuitPulseInterval;
        function startCircuitPulse() {
            const circuitElements = document.querySelectorAll('.circuit-line, .circuit-dot');
            
            circuitPulseInterval = setInterval(() => {
                const randomElement = circuitElements[Math.floor(Math.random() * circuitElements.length)];
                
                // 保存原始样式
                const originalBackground = randomElement.style.background;
                const originalBoxShadow = randomElement.style.boxShadow;
                const originalTransform = randomElement.style.transform;
                
                // 脉冲效果
                if (randomElement.classList.contains('circuit-line')) {
                    randomElement.style.background = 'rgba(255, 255, 255, 0.9)';
                    randomElement.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                } else {
                    randomElement.style.background = 'rgba(255, 255, 255, 1)';
                    randomElement.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                    randomElement.style.transform = 'scale(1.3)';
                }
                
                // 恢复
                setTimeout(() => {
                    randomElement.style.background = originalBackground || 
                        (randomElement.classList.contains('circuit-line') ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.8)');
                    randomElement.style.boxShadow = originalBoxShadow || '0 0 5px rgba(255, 255, 255, 0.4)';
                    randomElement.style.transform = originalTransform || 'scale(1)';
                }, 200);
            }, 800);
        }
        
        // 停止电路脉冲效果
        function stopCircuitPulse() {
            if (circuitPulseInterval) {
                clearInterval(circuitPulseInterval);
            }
        }
        
        // 添加眼睛跟随鼠标效果
        const eyes = document.querySelectorAll('.assistant-eye');
        if (eyes.length === 2) {
            document.addEventListener('mousemove', function(e) {
                const iconRect = document.querySelector('.yocim-icon-shape').getBoundingClientRect();
                const iconCenterX = iconRect.left + iconRect.width / 2;
                const iconCenterY = iconRect.top + iconRect.height / 2;
                
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                const deltaX = mouseX - iconCenterX;
                const deltaY = mouseY - iconCenterY;
                
                // 计算角度
                const angle = Math.atan2(deltaY, deltaX);
                const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 100, 1);
                
                // 移动眼睛
                const eyeOffsetX = Math.cos(angle) * distance * 2;
                const eyeOffsetY = Math.sin(angle) * distance * 2;
                
                eyes[0].style.transform = `translate(${eyeOffsetX - 1}px, ${eyeOffsetY - 1}px)`;
                eyes[1].style.transform = `translate(${eyeOffsetX + 1}px, ${eyeOffsetY - 1}px)`;
            });
        }
    }
});

// 为CSS特效库图标添加交互效果
document.addEventListener('DOMContentLoaded', function() {
    const cssIcon = document.getElementById('futureCssIcon');
    
    if (cssIcon) {
        // 点击动画效果
        cssIcon.addEventListener('click', function(e) {
            // 添加点击动画类
            this.classList.add('css-icon-clicked');
            
            // 创建CSS特效展示
            createCssEffect();
            
            // 移除动画类以便下次点击可以再次触发
            setTimeout(() => {
                this.classList.remove('css-icon-clicked');
            }, 300);
            
            console.log('CSS特效库图标被点击，即将跳转到CSS特效库页面');
        });
        
        // 添加键盘支持（按Enter键也可触发）
        cssIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 为图标添加鼠标悬停时的特效
        cssIcon.addEventListener('mouseenter', function() {
            const gradientLines = document.querySelectorAll('.gradient-line');
            gradientLines.forEach(line => {
                line.style.background = 'linear-gradient(to right, #4CAF50, #2196F3, #FF9800, #E91E63, #9C27B0)';
                line.style.backgroundSize = '200% 100%';
                line.style.animation = 'colorChange 2s infinite linear';
            });
            
            // 启动图层波动效果
            startLayerWave();
        });
        
        cssIcon.addEventListener('mouseleave', function() {
            const gradientLines = document.querySelectorAll('.gradient-line');
            gradientLines.forEach(line => {
                line.style.background = 'linear-gradient(to right, #4CAF50, #2196F3, #FF9800)';
                line.style.animation = 'none';
            });
            
            // 停止图层波动效果
            stopLayerWave();
        });
        
        // 创建CSS特效函数
        function createCssEffect() {
            const iconShape = document.querySelector('.css-icon-shape');
            
            // 创建多个CSS属性粒子
            const cssProperties = ['color', 'background', 'border', 'transform', 'animation', 'transition', 'box-shadow', 'gradient'];
            
            for (let i = 0; i < 8; i++) {
                const cssProperty = document.createElement('div');
                cssProperty.className = 'css-property-effect';
                
                // 随机CSS属性
                const randomProperty = cssProperties[Math.floor(Math.random() * cssProperties.length)];
                
                // 随机大小和位置
                const size = Math.random() * 10 + 8;
                const startX = 37;
                const startY = 37;
                
                // 随机方向
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 25 + 15;
                
                cssProperty.textContent = randomProperty;
                cssProperty.style.cssText = `
                    position: absolute;
                    font-family: 'Courier New', monospace;
                    font-size: ${size}px;
                    color: rgba(255, 255, 255, 0.9);
                    left: ${startX}px;
                    top: ${startY}px;
                    opacity: 0;
                    z-index: 5;
                    text-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
                    transform: translate(-50%, -50%);
                    font-weight: bold;
                `;
                
                iconShape.appendChild(cssProperty);
                
                // 动画
                setTimeout(() => {
                    cssProperty.style.transition = 'all 0.6s ease';
                    cssProperty.style.opacity = '0.8';
                    cssProperty.style.transform = `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(0.8)`;
                    cssProperty.style.color = getRandomCssColor();
                    
                    // 移除元素
                    setTimeout(() => {
                        cssProperty.style.opacity = '0';
                        setTimeout(() => {
                            if (cssProperty.parentNode === iconShape) {
                                iconShape.removeChild(cssProperty);
                            }
                        }, 300);
                    }, 600);
                }, i * 80);
            }
            
            // 创建图层分离效果
            createLayerSeparation();
            
            // 创建渐变线流动效果
            createGradientFlow();
        }
        
        // 创建图层分离效果
        function createLayerSeparation() {
            const layers = document.querySelectorAll('.css-layer');
            
            layers.forEach((layer, index) => {
                setTimeout(() => {
                    const originalTransform = layer.style.transform;
                    layer.style.transform = originalTransform + ' translateY(-10px)';
                    
                    // 恢复
                    setTimeout(() => {
                        layer.style.transform = originalTransform;
                    }, 500);
                }, index * 100);
            });
        }
        
        // 创建渐变线流动效果
        function createGradientFlow() {
            const gradientLines = document.querySelectorAll('.gradient-line');
            
            gradientLines.forEach((line, index) => {
                setTimeout(() => {
                    const originalWidth = line.style.width;
                    line.style.width = '0px';
                    
                    // 恢复并扩展
                    setTimeout(() => {
                        line.style.transition = 'width 0.5s ease';
                        if (line.classList.contains('line1')) {
                            line.style.width = '40px';
                        } else if (line.classList.contains('line2')) {
                            line.style.width = '35px';
                        } else if (line.classList.contains('line3')) {
                            line.style.width = '30px';
                        }
                        
                        // 再次收缩
                        setTimeout(() => {
                            line.style.width = originalWidth;
                        }, 500);
                    }, 200);
                }, index * 150);
            });
        }
        
        // 启动图层波动效果
        let layerWaveInterval;
        function startLayerWave() {
            const layers = document.querySelectorAll('.css-layer');
            
            layerWaveInterval = setInterval(() => {
                const randomLayer = layers[Math.floor(Math.random() * layers.length)];
                
                // 保存原始变换
                const originalTransform = randomLayer.style.transform;
                
                // 波动效果
                if (randomLayer.classList.contains('layer1')) {
                    randomLayer.style.transform = 'rotate(8deg) translateY(-3px)';
                } else if (randomLayer.classList.contains('layer2')) {
                    randomLayer.style.transform = 'rotate(-6deg) translateY(-2px)';
                } else if (randomLayer.classList.contains('layer3')) {
                    randomLayer.style.transform = 'rotate(10deg) translateY(-4px)';
                }
                
                // 恢复
                setTimeout(() => {
                    randomLayer.style.transform = originalTransform;
                }, 300);
            }, 1200);
        }
        
        // 停止图层波动效果
        function stopLayerWave() {
            if (layerWaveInterval) {
                clearInterval(layerWaveInterval);
            }
        }
        
        // 辅助函数：获取随机CSS颜色
        function getRandomCssColor() {
            const colors = [
                '#4CAF50', // 绿色
                '#2196F3', // 蓝色
                '#FF9800', // 橙色
                '#E91E63', // 粉色
                '#9C27B0', // 紫色
                '#00BCD4', // 青色
                '#FFC107', // 黄色
                '#795548'  // 棕色
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        // 添加花括号旋转效果
        const braces = document.querySelectorAll('.css-brace');
        if (braces.length === 2) {
            let rotation = 0;
            
            cssIcon.addEventListener('mouseenter', function() {
                rotation += 5;
                braces[0].style.transform = `rotate(-${rotation}deg)`;
                braces[1].style.transform = `rotate(${rotation}deg)`;
            });
        }
        
        // 添加动画圆圈弹跳效果
        const animationCircle = document.querySelector('.animation-circle');
        if (animationCircle) {
            cssIcon.addEventListener('mouseenter', function() {
                animationCircle.style.animation = 'pulseCircle 0.8s infinite';
            });
            
            cssIcon.addEventListener('mouseleave', function() {
                animationCircle.style.animation = 'pulseCircle 2s infinite';
            });
        }
    }
});

// 为设置图标添加交互效果
document.addEventListener('DOMContentLoaded', function() {
    const settingIcon = document.getElementById('futureSettingIcon');
    
    if (settingIcon) {
        // 点击动画效果
        settingIcon.addEventListener('click', function(e) {
            // 添加点击动画类
            this.classList.add('setting-icon-clicked');
            
            // 创建设置调整效果
            createSettingAdjustEffect();
            
            // 移除动画类以便下次点击可以再次触发
            setTimeout(() => {
                this.classList.remove('setting-icon-clicked');
            }, 300);
            
            console.log('设置图标被点击，即将跳转到设置页面');
        });
        
        // 添加键盘支持（按Enter键也可触发）
        settingIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 为图标添加鼠标悬停时的齿轮动画
        settingIcon.addEventListener('mouseenter', function() {
            const gearLarge = document.querySelector('.gear-large');
            const gearSmall = document.querySelector('.gear-small');
            
            if (gearLarge) {
                gearLarge.style.transition = 'transform 0.5s ease';
                gearLarge.style.transform = 'rotate(30deg)';
            }
            
            if (gearSmall) {
                gearSmall.style.transition = 'transform 0.5s ease';
                gearSmall.style.transform = 'rotate(-30deg)';
            }
            
            // 启动齿轮点闪烁效果
            startDotBlinking();
        });
        
        settingIcon.addEventListener('mouseleave', function() {
            const gearLarge = document.querySelector('.gear-large');
            const gearSmall = document.querySelector('.gear-small');
            
            if (gearLarge) {
                gearLarge.style.transform = 'rotate(0deg)';
            }
            
            if (gearSmall) {
                gearSmall.style.transform = 'rotate(0deg)';
            }
            
            // 停止齿轮点闪烁效果
            stopDotBlinking();
        });
        
        // 创建设置调整效果函数
        function createSettingAdjustEffect() {
            const iconShape = document.querySelector('.setting-icon-shape');
            
            // 创建多个调整元素
            for (let i = 0; i < 6; i++) {
                const adjustElement = document.createElement('div');
                adjustElement.className = 'adjust-element';
                
                // 随机形状（齿轮齿形状）
                const isLong = Math.random() > 0.5;
                const width = isLong ? 3 : 5;
                const height = isLong ? 15 : 8;
                
                // 随机位置和方向
                const startX = 37;
                const startY = 37;
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 20 + 10;
                
                adjustElement.style.cssText = `
                    position: absolute;
                    width: ${width}px;
                    height: ${height}px;
                    background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.5));
                    left: ${startX}px;
                    top: ${startY}px;
                    opacity: 0;
                    z-index: 5;
                    border-radius: 1px;
                    transform-origin: center;
                    transform: translate(-50%, -50%) rotate(${angle * 180/Math.PI}deg);
                `;
                
                iconShape.appendChild(adjustElement);
                
                // 动画
                setTimeout(() => {
                    adjustElement.style.transition = 'all 0.5s ease';
                    adjustElement.style.opacity = '0.8';
                    adjustElement.style.transform = `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) rotate(${angle * 180/Math.PI + 180}deg)`;
                    
                    // 移除元素
                    setTimeout(() => {
                        adjustElement.style.opacity = '0';
                        setTimeout(() => {
                            if (adjustElement.parentNode === iconShape) {
                                iconShape.removeChild(adjustElement);
                            }
                        }, 300);
                    }, 500);
                }, i * 100);
            }
            
            // 创建齿轮快速旋转效果
            createGearSpinEffect();
        }
        
        // 创建齿轮快速旋转效果
        function createGearSpinEffect() {
            const gearLarge = document.querySelector('.gear-large');
            const gearSmall = document.querySelector('.gear-small');
            
            if (gearLarge) {
                gearLarge.style.transition = 'transform 0.8s ease';
                gearLarge.style.transform = 'rotate(720deg)';
                
                setTimeout(() => {
                    gearLarge.style.transform = 'rotate(0deg)';
                }, 800);
            }
            
            if (gearSmall) {
                gearSmall.style.transition = 'transform 0.8s ease';
                gearSmall.style.transform = 'rotate(-720deg)';
                
                setTimeout(() => {
                    gearSmall.style.transform = 'rotate(0deg)';
                }, 800);
            }
        }
        
        // 启动齿轮点闪烁效果
        let dotBlinkInterval;
        function startDotBlinking() {
            const dots = document.querySelectorAll('.gear-dot');
            
            dotBlinkInterval = setInterval(() => {
                const randomDot = dots[Math.floor(Math.random() * dots.length)];
                
                // 保存原始背景
                const originalBackground = randomDot.style.background;
                
                // 闪烁效果
                randomDot.style.background = 'white';
                randomDot.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.9)';
                
                // 恢复
                setTimeout(() => {
                    randomDot.style.background = originalBackground || 'rgba(255, 255, 255, 0.8)';
                    randomDot.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.7)';
                }, 200);
            }, 600);
        }
        
        // 停止齿轮点闪烁效果
        function stopDotBlinking() {
            if (dotBlinkInterval) {
                clearInterval(dotBlinkInterval);
            }
        }
        
        // 添加齿轮持续缓慢旋转效果（当悬停时）
        let gearRotateInterval;
        settingIcon.addEventListener('mouseenter', function() {
            gearRotateInterval = setInterval(() => {
                const gearLarge = document.querySelector('.gear-large');
                if (gearLarge) {
                    const currentTransform = gearLarge.style.transform || 'rotate(0deg)';
                    const match = currentTransform.match(/rotate\(([-0-9.]+)deg\)/);
                    const currentAngle = match ? parseFloat(match[1]) : 0;
                    gearLarge.style.transform = `rotate(${currentAngle + 0.5}deg)`;
                }
            }, 50);
        });
        
        settingIcon.addEventListener('mouseleave', function() {
            if (gearRotateInterval) {
                clearInterval(gearRotateInterval);
            }
        });
    }
});