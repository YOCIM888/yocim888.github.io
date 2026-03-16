// 画板应用程序主对象
const CyberCanvas = {
    // 初始化变量
    canvas: null,
    ctx: null,
    isDrawing: false,
    currentTool: 'pencil',
    currentColor: '#00ffff',
    brushSize: 5,
    brushOpacity: 1.0,
    blendMode: 'source-over',
    lastX: 0,
    lastY: 0,
    history: [],
    historyIndex: -1,
    textInputActive: false,
    gridVisible: false,
    gridSize: 20,
    gridOpacity: 0.3,
    symmetryEnabled: false,
    
    // 初始化函数
    init() {
        // 获取画布和上下文
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布大小为容器大小
        this.resizeCanvas();
        
        // 初始化画布
        this.clearCanvas();
        
        // 设置初始状态
        this.setupEventListeners();
        this.setupToolButtons();
        this.setupColorSwatches();
        this.setupControls();
        this.setupAdvancedTools();
        
        // 添加初始状态到历史记录
        this.saveState();
        
        // 窗口大小变化时调整画布
        window.addEventListener('resize', () => this.resizeCanvas());
        
        console.log('赛博朋克画板已初始化');
    },
    
    // 调整画布大小以适应窗口
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth - 30;
        this.canvas.height = container.clientHeight - 150;
        
        // 如果网格可见，重新绘制网格
        if (this.gridVisible) {
            this.drawGrid();
        }
    },
    
    // 设置事件监听器
    setupEventListeners() {
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        // 触摸事件
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.startDrawing(touch);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.draw(touch);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            // 撤销: Ctrl+Z
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                this.undo();
            }
            
            // 重做: Ctrl+Y
            if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                this.redo();
            }
            
            // 清除画布: Ctrl+L
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                this.clearCanvas();
            }
            
            // 保存图片: Ctrl+S
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveImage();
            }
        });
        
        // 坐标显示
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor(e.clientX - rect.left);
            const y = Math.floor(e.clientY - rect.top);
            document.getElementById('coords').textContent = `${x}, ${y}`;
        });
    },
    
    // 设置工具按钮
    setupToolButtons() {
        // 工具按钮
        const tools = ['pencil', 'eraser', 'line', 'rectangle', 'circle', 'text'];
        tools.forEach(tool => {
            document.getElementById(tool).addEventListener('click', () => {
                this.setTool(tool);
                document.getElementById('currentTool').textContent = 
                    document.getElementById(tool).querySelector('span').textContent;
            });
        });
        
        // 清除画布
        document.getElementById('clearCanvas').addEventListener('click', () => {
            if (confirm('确定要清除整个画布吗？')) {
                this.clearCanvas();
            }
        });
        
        // 撤销
        document.getElementById('undo').addEventListener('click', () => this.undo());
        
        // 重做
        document.getElementById('redo').addEventListener('click', () => this.redo());
        
        // 保存图片
        document.getElementById('saveImage').addEventListener('click', () => this.saveImage());
    },
    
    // 设置颜色选择
    setupColorSwatches() {
        // 颜色样本
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                // 移除所有激活状态
                document.querySelectorAll('.color-swatch').forEach(s => {
                    s.classList.remove('active');
                });
                
                // 设置当前颜色
                swatch.classList.add('active');
                this.currentColor = swatch.dataset.color;
                document.getElementById('customColorPicker').value = this.currentColor;
                
                // 如果是橡皮擦工具，切换回铅笔
                if (this.currentTool === 'eraser') {
                    this.setTool('pencil');
                }
            });
        });
        
        // 自定义颜色选择器
        document.getElementById('customColorPicker').addEventListener('input', (e) => {
            this.currentColor = e.target.value;
            
            // 更新激活的颜色样本
            document.querySelectorAll('.color-swatch').forEach(swatch => {
                swatch.classList.remove('active');
            });
        });
    },
    
    // 设置控制元素
    setupControls() {
        // 笔刷大小
        const brushSize = document.getElementById('brushSize');
        const brushSizeValue = document.getElementById('brushSizeValue');
        
        brushSize.addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            brushSizeValue.textContent = this.brushSize;
        });
        
        // 不透明度
        const brushOpacity = document.getElementById('brushOpacity');
        const opacityValue = document.getElementById('opacityValue');
        
        brushOpacity.addEventListener('input', (e) => {
            this.brushOpacity = parseInt(e.target.value) / 100;
            opacityValue.textContent = parseInt(e.target.value);
        });
        
        // 混合模式
        document.getElementById('brushBlend').addEventListener('change', (e) => {
            this.blendMode = e.target.value;
        });
        
        // 背景颜色
        document.getElementById('canvasBg').addEventListener('input', (e) => {
            this.canvas.style.backgroundColor = e.target.value;
        });
        
        // 网格大小
        const gridSize = document.getElementById('gridSize');
        const gridSizeValue = document.getElementById('gridSizeValue');
        
        gridSize.addEventListener('input', (e) => {
            this.gridSize = parseInt(e.target.value);
            gridSizeValue.textContent = this.gridSize;
            
            if (this.gridVisible) {
                this.drawGrid();
            }
        });
        
        // 网格不透明度
        document.getElementById('gridOpacity').addEventListener('input', (e) => {
            this.gridOpacity = parseInt(e.target.value) / 100;
            
            if (this.gridVisible) {
                this.drawGrid();
            }
        });
        
        // 显示/隐藏网格
        document.getElementById('toggleGrid').addEventListener('click', () => {
            this.toggleGrid();
        });
        
        // 网格按钮
        document.getElementById('grid').addEventListener('click', () => {
            this.toggleGrid();
        });
    },
    
    // 设置高级工具
    setupAdvancedTools() {
        // 高级工具按钮
        const advancedTools = ['spray', 'gradient', 'pattern', 'blur', 'symmetry'];
        advancedTools.forEach(tool => {
            document.getElementById(tool).addEventListener('click', () => {
                this.activateAdvancedTool(tool);
            });
        });
        
        // 对称模式
        document.getElementById('symmetry').addEventListener('click', () => {
            this.symmetryEnabled = !this.symmetryEnabled;
            const btn = document.getElementById('symmetry');
            
            if (this.symmetryEnabled) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-sync-alt"></i><span>对称模式 (开)</span>';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="fas fa-sync-alt"></i><span>对称模式 (关)</span>';
            }
        });
        
        // 图层管理
        document.getElementById('addLayer').addEventListener('click', () => {
            this.addLayer();
        });
        
        document.getElementById('mergeLayers').addEventListener('click', () => {
            this.mergeLayers();
        });
        
        // 文字工具模态框
        const textModal = document.getElementById('textModal');
        const textInput = document.getElementById('textInput');
        const confirmText = document.getElementById('confirmText');
        const cancelText = document.getElementById('cancelText');
        
        document.getElementById('text').addEventListener('click', () => {
            textModal.style.display = 'flex';
            textInput.focus();
            this.textInputActive = true;
        });
        
        confirmText.addEventListener('click', () => {
            if (textInput.value.trim() !== '') {
                this.addText(textInput.value, this.lastX, this.lastY);
                textInput.value = '';
            }
            textModal.style.display = 'none';
            this.textInputActive = false;
        });
        
        cancelText.addEventListener('click', () => {
            textModal.style.display = 'none';
            textInput.value = '';
            this.textInputActive = false;
        });
        
        // 点击模态框外部关闭
        textModal.addEventListener('click', (e) => {
            if (e.target === textModal) {
                textModal.style.display = 'none';
                textInput.value = '';
                this.textInputActive = false;
            }
        });
    },
    
    // 开始绘图
    startDrawing(e) {
        if (this.textInputActive) return;
        
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
        
        // 如果是形状工具，保存画布当前状态
        if (['line', 'rectangle', 'circle'].includes(this.currentTool)) {
            this.savedImage = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        }
    },
    
    // 绘图过程
    draw(e) {
        if (!this.isDrawing || this.textInputActive) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 设置绘图样式
        this.ctx.globalAlpha = this.brushOpacity;
        this.ctx.globalCompositeOperation = this.blendMode;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        switch (this.currentTool) {
            case 'pencil':
            case 'eraser':
                this.drawFreehand(x, y);
                break;
            case 'line':
                this.drawLinePreview(x, y);
                break;
            case 'rectangle':
                this.drawRectanglePreview(x, y);
                break;
            case 'circle':
                this.drawCirclePreview(x, y);
                break;
            case 'spray':
                this.drawSpray(x, y);
                break;
        }
        
        // 对称绘图
        if (this.symmetryEnabled && this.currentTool !== 'text') {
            const centerX = this.canvas.width / 2;
            const symmetryX = centerX - (x - centerX);
            
            switch (this.currentTool) {
                case 'pencil':
                case 'eraser':
                    this.drawFreehand(symmetryX, y, true);
                    break;
                case 'spray':
                    this.drawSpray(symmetryX, y, true);
                    break;
            }
        }
        
        this.lastX = x;
        this.lastY = y;
    },
    
    // 停止绘图
    stopDrawing() {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        this.ctx.beginPath();
        
        // 保存状态到历史记录
        if (this.currentTool !== 'text') {
            this.saveState();
        }
    },
    
    // 自由绘制（铅笔/橡皮擦）
    drawFreehand(x, y, isSymmetry = false) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        
        if (this.currentTool === 'eraser') {
            this.ctx.strokeStyle = getComputedStyle(this.canvas).backgroundColor;
        } else {
            this.ctx.strokeStyle = this.currentColor;
        }
        
        this.ctx.lineWidth = this.brushSize;
        this.ctx.stroke();
    },
    
    // 绘制直线预览
    drawLinePreview(x, y) {
        // 恢复保存的画布状态
        this.ctx.putImageData(this.savedImage, 0, 0);
        
        // 绘制新直线
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.stroke();
    },
    
    // 绘制矩形预览
    drawRectanglePreview(x, y) {
        // 恢复保存的画布状态
        this.ctx.putImageData(this.savedImage, 0, 0);
        
        // 绘制新矩形
        const width = x - this.lastX;
        const height = y - this.lastY;
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.strokeRect(this.lastX, this.lastY, width, height);
    },
    
    // 绘制圆形预览
    drawCirclePreview(x, y) {
        // 恢复保存的画布状态
        this.ctx.putImageData(this.savedImage, 0, 0);
        
        // 绘制新圆形
        const radius = Math.sqrt(
            Math.pow(x - this.lastX, 2) + Math.pow(y - this.lastY, 2)
        );
        
        this.ctx.beginPath();
        this.ctx.arc(this.lastX, this.lastY, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.stroke();
    },
    
    // 喷雾效果
    drawSpray(x, y, isSymmetry = false) {
        const density = this.brushSize * 2;
        
        this.ctx.fillStyle = this.currentColor;
        
        for (let i = 0; i < density; i++) {
            const radius = Math.random() * this.brushSize * 2;
            const angle = Math.random() * Math.PI * 2;
            const sprayX = x + Math.cos(angle) * radius;
            const sprayY = y + Math.sin(angle) * radius;
            
            this.ctx.beginPath();
            this.ctx.arc(sprayX, sprayY, Math.random() * 2 + 1, 0, Math.PI * 2);
            this.ctx.fill();
        }
    },
    
    // 设置当前工具
    setTool(tool) {
        this.currentTool = tool;
        
        // 更新按钮状态
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(tool).classList.add('active');
        
        // 如果是橡皮擦，设置光标样式
        if (tool === 'eraser') {
            this.canvas.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\'><circle cx=\'12\' cy=\'12\' r=\'10\' fill=\'white\' stroke=\'black\' stroke-width=\'2\'/></svg>") 12 12, auto';
        } else {
            this.canvas.style.cursor = 'crosshair';
        }
    },
    
    // 激活高级工具
    activateAdvancedTool(tool) {
        // 更新按钮状态
        document.querySelectorAll('.adv-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const btn = document.getElementById(tool);
        btn.classList.add('active');
        
        // 根据工具执行相应操作
        switch (tool) {
            case 'gradient':
                this.applyGradient();
                break;
            case 'pattern':
                this.applyPattern();
                break;
            case 'blur':
                this.applyBlur();
                break;
        }
    },
    
    // 添加文字
    addText(text, x, y) {
        this.ctx.font = `${this.brushSize * 5}px 'Segoe UI', monospace`;
        this.ctx.fillStyle = this.currentColor;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(text, x, y);
        
        this.saveState();
    },
    
    // 清除画布
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制默认背景
        const bgColor = document.getElementById('canvasBg').value;
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.saveState();
    },
    
    // 保存当前状态
    saveState() {
        // 如果当前不是最新状态，删除之后的状态
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        // 保存当前画布状态
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.history.push(imageData);
        this.historyIndex++;
        
        // 更新历史记录显示
        this.updateHistoryUI();
    },
    
    // 撤销
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const imageData = this.history[this.historyIndex];
            this.ctx.putImageData(imageData, 0, 0);
            
            this.updateHistoryUI();
        }
    },
    
    // 重做
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const imageData = this.history[this.historyIndex];
            this.ctx.putImageData(imageData, 0, 0);
            
            this.updateHistoryUI();
        }
    },
    
    // 更新历史记录UI
    updateHistoryUI() {
        document.getElementById('historyCount').textContent = this.history.length;
    },
    
    // 保存图片
    saveImage() {
        const link = document.createElement('a');
        link.download = `赛博朋克画板-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    },
    
    // 切换网格显示
    toggleGrid() {
        this.gridVisible = !this.gridVisible;
        const btn = document.getElementById('toggleGrid');
        
        if (this.gridVisible) {
            this.drawGrid();
            btn.innerHTML = '<i class="fas fa-eye-slash"></i> 隐藏网格';
            document.getElementById('grid').innerHTML = '<i class="fas fa-th"></i><span>隐藏网格</span>';
        } else {
            // 清除网格
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const imageData = this.history[this.historyIndex];
            this.ctx.putImageData(imageData, 0, 0);
            
            btn.innerHTML = '<i class="fas fa-eye"></i> 显示网格';
            document.getElementById('grid').innerHTML = '<i class="fas fa-th"></i><span>显示网格</span>';
        }
    },
    
    // 绘制网格
    drawGrid() {
        // 保存当前画布状态
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        // 清除并重新绘制
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.putImageData(imageData, 0, 0);
        
        // 绘制网格
        this.ctx.strokeStyle = `rgba(0, 255, 255, ${this.gridOpacity})`;
        this.ctx.lineWidth = 1;
        
        // 垂直线
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 水平线
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    },
    
    // 应用渐变
    applyGradient() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#00ffff');
        gradient.addColorStop(0.5, '#ff00ff');
        gradient.addColorStop(1, '#00ff00');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.saveState();
    },
    
    // 应用图案
    applyPattern() {
        // 创建图案画布
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = 20;
        patternCanvas.height = 20;
        const patternCtx = patternCanvas.getContext('2d');
        
        // 绘制简单图案
        patternCtx.fillStyle = this.currentColor;
        patternCtx.fillRect(0, 0, 10, 10);
        patternCtx.fillRect(10, 10, 10, 10);
        
        // 创建图案
        const pattern = this.ctx.createPattern(patternCanvas, 'repeat');
        this.ctx.fillStyle = pattern;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.saveState();
    },
    
    // 应用模糊效果
    applyBlur() {
        // 简单的模糊效果 - 实际应用中可以使用更复杂的算法
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // 简单模糊算法（平均模糊）
        for (let i = 0; i < data.length; i += 4) {
            if (i > 4 && i < data.length - 4) {
                // 取当前像素和周围像素的平均值
                data[i] = (data[i-4] + data[i] + data[i+4]) / 3;     // R
                data[i+1] = (data[i-3] + data[i+1] + data[i+5]) / 3; // G
                data[i+2] = (data[i-2] + data[i+2] + data[i+6]) / 3; // B
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        this.saveState();
    },
    
    // 添加图层
    addLayer() {
        alert('高级图层功能将在后续版本中实现！');
    },
    
    // 合并图层
    mergeLayers() {
        alert('高级图层功能将在后续版本中实现！');
    }
};

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    CyberCanvas.init();
});