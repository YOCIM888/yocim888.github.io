// CyberCanvas - 赛博朋克风格画板
class CyberCanvas {
    constructor() {
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('canvasOverlay');
        this.overlayCtx = this.overlay.getContext('2d');
        
        // 状态管理
        this.state = {
            isDrawing: false,
            currentTool: 'brush',
            currentColor: '#409CFF',
            brushSize: 5,
            opacity: 1,
            smoothness: 5,
            lineStyle: 'solid',
            lastX: 0,
            lastY: 0,
            zoom: 1,
            offsetX: 0,
            offsetY: 0,
            layers: [],
            activeLayer: 0,
            history: [],
            historyIndex: -1,
            tempPoints: [] // 临时点存储
        };

        // 工具配置
        this.tools = {
            brush: { name: '画笔', cursor: 'crosshair' },
            eraser: { name: '橡皮', cursor: 'cell' },
            line: { name: '直线', cursor: 'crosshair' },
            spray: { name: '喷枪', cursor: 'crosshair' },
            fill: { name: '填充', cursor: 'cell' },
            gradient: { name: '渐变', cursor: 'crosshair' },
            rect: { name: '矩形', cursor: 'crosshair' },
            circle: { name: '圆形', cursor: 'crosshair' },
            triangle: { name: '三角形', cursor: 'crosshair' },
            star: { name: '星形', cursor: 'crosshair' },
            polygon: { name: '多边形', cursor: 'crosshair' },
            arrow: { name: '箭头', cursor: 'crosshair' },
            select: { name: '选择', cursor: 'move' },
            crop: { name: '裁剪', cursor: 'crosshair' },
            transform: { name: '变换', cursor: 'move' }
        };

        // 颜色预设
        this.colorPalette = [
            '#409CFF', '#00FFEA', '#FF00FF', '#FFAA00', '#00FF00',
            '#FF0066', '#00AAFF', '#AA00FF', '#FF5500', '#55FF00',
            '#FFFFFF', '#888888', '#444444', '#000000',
            '#FF3366', '#33FFCC', '#3366FF', '#CC33FF', '#FFCC33'
        ];

        // 初始化
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.setupUI();
        this.setupLayers();
        this.updateUI();
        this.saveState();
    }

    setupCanvas() {
        // 设置画布尺寸
        this.canvas.width = 1920;
        this.canvas.height = 1080;
        this.overlay.width = this.canvas.width;
        this.overlay.height = this.canvas.height;
        
        // 初始填充黑色背景
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 设置样式
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.overlayCtx.lineCap = 'round';
        this.overlayCtx.lineJoin = 'round';
    }

    setupEventListeners() {
        // 阻止画布上的默认拖拽行为
        this.canvas.addEventListener('dragstart', (e) => e.preventDefault());
        this.canvas.addEventListener('drop', (e) => e.preventDefault());
        
        // 鼠标事件 - 只响应左键
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // 左键
                this.startDrawing(e);
            }
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.state.isDrawing) {
                this.draw(e);
            } else {
                this.drawOverlay(e);
            }
        });
        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) { // 左键
                this.stopDrawing(e);
            }
        });
        this.canvas.addEventListener('mouseout', (e) => {
            if (this.state.isDrawing) {
                this.stopDrawing(e);
            }
        });
        
        // 右键菜单阻止
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        
        // 触摸事件
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', (e) => {
            if (this.state.isDrawing) {
                this.stopDrawing(e);
            }
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // 窗口大小调整
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    setupUI() {
        // 初始化颜色面板
        this.initColorPalette();
        
        // 初始化工具按钮
        this.initToolButtons();
        
        // 初始化滑块
        this.initSliders();
        
        // 初始化其他UI组件
        this.initUIComponents();
    }

    initColorPalette() {
        const palette = document.getElementById('colorPalette');
        palette.innerHTML = '';
        
        this.colorPalette.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.dataset.color = color;
            
            if (color === this.state.currentColor) {
                swatch.classList.add('active');
            }
            
            swatch.addEventListener('click', () => {
                this.setColor(color);
                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
            });
            
            palette.appendChild(swatch);
        });
        
        // 颜色选择器
        const colorPicker = document.getElementById('colorPicker');
        colorPicker.value = this.state.currentColor;
        colorPicker.addEventListener('change', (e) => {
            this.setColor(e.target.value);
        });
        
        // HEX输入
        const hexInput = document.getElementById('hexInput');
        hexInput.value = this.state.currentColor.substring(1).toUpperCase();
        hexInput.addEventListener('input', (e) => {
            const color = '#' + e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                this.setColor(color);
                colorPicker.value = color;
            }
        });
    }

    initToolButtons() {
        // 绘制工具
        document.getElementById('brushBtn').addEventListener('click', () => this.setTool('brush'));
        document.getElementById('eraserBtn').addEventListener('click', () => this.setTool('eraser'));
        document.getElementById('lineBtn').addEventListener('click', () => this.setTool('line'));
        document.getElementById('sprayBtn').addEventListener('click', () => this.setTool('spray'));
        document.getElementById('fillBtn').addEventListener('click', () => this.setTool('fill'));
        document.getElementById('gradientBtn').addEventListener('click', () => this.setTool('gradient'));
        
        // 形状工具
        document.getElementById('rectBtn').addEventListener('click', () => this.setTool('rect'));
        document.getElementById('circleBtn').addEventListener('click', () => this.setTool('circle'));
        document.getElementById('triangleBtn').addEventListener('click', () => this.setTool('triangle'));
        document.getElementById('starBtn').addEventListener('click', () => this.setTool('star'));
        document.getElementById('polygonBtn').addEventListener('click', () => this.setTool('polygon'));
        document.getElementById('arrowBtn').addEventListener('click', () => this.setTool('arrow'));
        
        // 编辑工具
        document.getElementById('selectBtn').addEventListener('click', () => this.setTool('select'));
        document.getElementById('cropBtn').addEventListener('click', () => this.setTool('crop'));
        document.getElementById('transformBtn').addEventListener('click', () => this.setTool('transform'));
        
        // 文件操作
        document.getElementById('saveBtn').addEventListener('click', () => this.saveImage());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadImage());
        document.getElementById('exportPNGBtn').addEventListener('click', () => this.exportImage('png'));
        document.getElementById('exportJPGBtn').addEventListener('click', () => this.exportImage('jpg'));
        
        // 编辑操作
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
        
        // 缩放控制
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoomOut());
        document.getElementById('zoomResetBtn').addEventListener('click', () => this.resetZoom());
        
        // 画布尺寸
        document.getElementById('resizeCanvasBtn').addEventListener('click', () => this.resizeCanvasToInput());
    }

    initSliders() {
        const brushSize = document.getElementById('brushSize');
        const brushSizeValue = document.getElementById('brushSizeValue');
        
        brushSize.value = this.state.brushSize;
        brushSizeValue.textContent = this.state.brushSize;
        
        brushSize.addEventListener('input', (e) => {
            this.state.brushSize = parseInt(e.target.value);
            brushSizeValue.textContent = this.state.brushSize;
            this.updateUI();
        });
        
        // 透明度滑块
        const opacitySlider = document.getElementById('opacitySlider');
        const opacityValue = document.getElementById('opacityValue');
        
        opacitySlider.value = this.state.opacity * 100;
        opacityValue.textContent = Math.round(this.state.opacity * 100);
        
        opacitySlider.addEventListener('input', (e) => {
            this.state.opacity = parseInt(e.target.value) / 100;
            opacityValue.textContent = e.target.value;
        });
        
        // 平滑度滑块
        const smoothnessSlider = document.getElementById('smoothnessSlider');
        const smoothnessValue = document.getElementById('smoothnessValue');
        
        smoothnessSlider.value = this.state.smoothness;
        smoothnessValue.textContent = this.state.smoothness;
        
        smoothnessSlider.addEventListener('input', (e) => {
            this.state.smoothness = parseInt(e.target.value);
            smoothnessValue.textContent = e.target.value;
        });
    }

    initUIComponents() {
        // 线条样式
        document.getElementById('solidLine').addEventListener('click', () => this.setLineStyle('solid'));
        document.getElementById('dashedLine').addEventListener('click', () => this.setLineStyle('dashed'));
        document.getElementById('dottedLine').addEventListener('click', () => this.setLineStyle('dotted'));
        
        // 坐标显示
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.round((e.clientX - rect.left) / this.state.zoom);
            const y = Math.round((e.clientY - rect.top) / this.state.zoom);
            
            document.getElementById('coordX').textContent = x.toString().padStart(4, '0');
            document.getElementById('coordY').textContent = y.toString().padStart(4, '0');
        });
        
        // 模态框
        document.getElementById('modalCloseBtn').addEventListener('click', () => {
            document.getElementById('modalOverlay').style.display = 'none';
        });
    }

    setupLayers() {
        this.state.layers = [{
            id: 0,
            name: '背景',
            visible: true,
            locked: false,
            opacity: 1,
            blendMode: 'source-over'
        }];
        
        this.state.activeLayer = 0;
        this.updateLayersUI();
    }

    setTool(tool) {
        // 更新活动按钮
        document.querySelectorAll('.cyber-btn[data-active="true"]').forEach(btn => {
            btn.dataset.active = "false";
        });
        
        const toolBtn = document.getElementById(tool + 'Btn');
        if (toolBtn) {
            toolBtn.dataset.active = "true";
        }
        
        // 更新工具
        this.state.currentTool = tool;
        this.canvas.style.cursor = this.tools[tool]?.cursor || 'crosshair';
        
        // 更新状态显示
        document.getElementById('modeDisplay').textContent = 
            this.tools[tool]?.name?.substring(0, 6).toUpperCase() || 'BRUSH';
        
        this.updateUI();
    }

    setColor(color) {
        this.state.currentColor = color;
        document.getElementById('colorDisplay').textContent = color.toUpperCase();
        document.getElementById('colorPicker').value = color;
        document.getElementById('hexInput').value = color.substring(1).toUpperCase();
        this.updateUI();
    }

    setLineStyle(style) {
        this.state.lineStyle = style;
        
        // 更新按钮状态
        document.querySelectorAll('.style-btn[data-active="true"]').forEach(btn => {
            btn.dataset.active = "false";
        });
        
        document.getElementById(style + 'Line').dataset.active = "true";
        
        // 设置画布样式
        switch(style) {
            case 'dashed':
                this.ctx.setLineDash([10, 5]);
                this.overlayCtx.setLineDash([10, 5]);
                break;
            case 'dotted':
                this.ctx.setLineDash([2, 3]);
                this.overlayCtx.setLineDash([2, 3]);
                break;
            default:
                this.ctx.setLineDash([]);
                this.overlayCtx.setLineDash([]);
        }
    }

    startDrawing(e) {
        e.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.state.zoom;
        const y = (e.clientY - rect.top) / this.state.zoom;
        
        this.state.isDrawing = true;
        this.state.lastX = x;
        this.state.lastY = y;
        
        // 开始新的路径
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        
        // 根据工具执行不同操作
        switch(this.state.currentTool) {
            case 'fill':
                this.floodFill(x, y);
                break;
            case 'gradient':
                this.startGradient(x, y);
                break;
            case 'line':
            case 'rect':
            case 'circle':
                // 存储起始点
                this.state.tempPoints = [{x, y}];
                break;
        }
    }

    draw(e) {
        if (!this.state.isDrawing) return;
        
        e.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.state.zoom;
        const y = (e.clientY - rect.top) / this.state.zoom;
        
        // 设置绘图样式
        this.ctx.globalAlpha = this.state.opacity;
        this.ctx.lineWidth = this.state.brushSize;
        this.overlayCtx.globalAlpha = this.state.opacity;
        this.overlayCtx.lineWidth = this.state.brushSize;
        
        // 根据工具绘制
        switch(this.state.currentTool) {
            case 'brush':
                this.drawBrush(x, y);
                break;
            case 'eraser':
                this.drawEraser(x, y);
                break;
            case 'spray':
                this.drawSpray(x, y);
                break;
            case 'line':
                this.drawLinePreview(x, y);
                break;
            case 'rect':
                this.drawRectPreview(x, y);
                break;
            case 'circle':
                this.drawCirclePreview(x, y);
                break;
        }
        
        this.state.lastX = x;
        this.state.lastY = y;
    }

    drawBrush(x, y) {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = this.state.currentColor;
        
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    drawEraser(x, y) {
        // 保存当前状态
        const previousComposite = this.ctx.globalCompositeOperation;
        const previousStroke = this.ctx.strokeStyle;
        
        // 设置橡皮擦模式
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.strokeStyle = 'rgba(0,0,0,1)';
        
        // 绘制橡皮擦
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        
        // 恢复状态
        this.ctx.globalCompositeOperation = previousComposite;
        this.ctx.strokeStyle = previousStroke;
    }

    drawSpray(x, y) {
        const density = this.state.brushSize * 2;
        const radius = this.state.brushSize;
        
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = this.state.currentColor;
        
        for (let i = 0; i < density; i++) {
            const offsetX = (Math.random() - 0.5) * radius * 2;
            const offsetY = (Math.random() - 0.5) * radius * 2;
            
            if (offsetX * offsetX + offsetY * offsetY <= radius * radius) {
                const size = Math.random() * 2 + 0.5;
                this.ctx.beginPath();
                this.ctx.arc(x + offsetX, y + offsetY, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    drawLinePreview(x, y) {
        this.overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);
        this.overlayCtx.beginPath();
        this.overlayCtx.moveTo(this.state.tempPoints[0].x, this.state.tempPoints[0].y);
        this.overlayCtx.lineTo(x, y);
        this.overlayCtx.strokeStyle = this.state.currentColor;
        this.overlayCtx.stroke();
    }

    drawRectPreview(x, y) {
        this.overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);
        const startX = this.state.tempPoints[0].x;
        const startY = this.state.tempPoints[0].y;
        const width = x - startX;
        const height = y - startY;
        
        this.overlayCtx.strokeStyle = this.state.currentColor;
        this.overlayCtx.strokeRect(startX, startY, width, height);
    }

    drawCirclePreview(x, y) {
        this.overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);
        const startX = this.state.tempPoints[0].x;
        const startY = this.state.tempPoints[0].y;
        const radius = Math.sqrt(
            Math.pow(x - startX, 2) + 
            Math.pow(y - startY, 2)
        );
        
        this.overlayCtx.beginPath();
        this.overlayCtx.arc(startX, startY, radius, 0, Math.PI * 2);
        this.overlayCtx.strokeStyle = this.state.currentColor;
        this.overlayCtx.stroke();
    }

    drawOverlay(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.state.zoom;
        const y = (e.clientY - rect.top) / this.state.zoom;
        
        this.overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);
        
        // 根据工具显示预览
        switch(this.state.currentTool) {
            case 'brush':
                this.overlayCtx.beginPath();
                this.overlayCtx.arc(x, y, this.state.brushSize / 2, 0, Math.PI * 2);
                this.overlayCtx.fillStyle = this.state.currentColor + '80';
                this.overlayCtx.fill();
                break;
            case 'eraser':
                this.overlayCtx.beginPath();
                this.overlayCtx.arc(x, y, this.state.brushSize / 2, 0, Math.PI * 2);
                this.overlayCtx.fillStyle = 'rgba(255,255,255,0.3)';
                this.overlayCtx.strokeStyle = 'rgba(255,255,255,0.6)';
                this.overlayCtx.lineWidth = 1;
                this.overlayCtx.fill();
                this.overlayCtx.stroke();
                break;
        }
    }

    stopDrawing(e) {
        if (!this.state.isDrawing) return;
        
        e.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.state.zoom;
        const y = (e.clientY - rect.top) / this.state.zoom;
        
        // 最终绘制形状
        switch(this.state.currentTool) {
            case 'line':
                this.finalizeLine(x, y);
                break;
            case 'rect':
                this.finalizeRect(x, y);
                break;
            case 'circle':
                this.finalizeCircle(x, y);
                break;
        }
        
        this.state.isDrawing = false;
        this.state.tempPoints = [];
        this.overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);
        
        // 结束路径
        this.ctx.beginPath();
        
        // 保存状态到历史记录
        this.saveState();
    }

    finalizeLine(x, y) {
        if (this.state.tempPoints.length === 0) return;
        
        const startX = this.state.tempPoints[0].x;
        const startY = this.state.tempPoints[0].y;
        
        this.ctx.globalAlpha = this.state.opacity;
        this.ctx.lineWidth = this.state.brushSize;
        this.ctx.strokeStyle = this.state.currentColor;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    finalizeRect(x, y) {
        if (this.state.tempPoints.length === 0) return;
        
        const startX = this.state.tempPoints[0].x;
        const startY = this.state.tempPoints[0].y;
        const width = x - startX;
        const height = y - startY;
        
        this.ctx.globalAlpha = this.state.opacity;
        this.ctx.lineWidth = this.state.brushSize;
        this.ctx.strokeStyle = this.state.currentColor;
        this.ctx.strokeRect(startX, startY, width, height);
    }

    finalizeCircle(x, y) {
        if (this.state.tempPoints.length === 0) return;
        
        const startX = this.state.tempPoints[0].x;
        const startY = this.state.tempPoints[0].y;
        const radius = Math.sqrt(
            Math.pow(x - startX, 2) + 
            Math.pow(y - startY, 2)
        );
        
        this.ctx.globalAlpha = this.state.opacity;
        this.ctx.lineWidth = this.state.brushSize;
        this.ctx.strokeStyle = this.state.currentColor;
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    floodFill(x, y) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const targetColor = this.getPixelColor(imageData, x, y);
        const fillColor = this.hexToRgb(this.state.currentColor);
        
        if (this.colorsMatch(targetColor, fillColor)) {
            return;
        }
        
        const stack = [[Math.round(x), Math.round(y)]];
        const visited = new Set();
        
        while (stack.length > 0) {
            const [cx, cy] = stack.pop();
            const key = `${cx},${cy}`;
            
            if (visited.has(key) || 
                cx < 0 || cx >= this.canvas.width || 
                cy < 0 || cy >= this.canvas.height) {
                continue;
            }
            
            visited.add(key);
            const currentColor = this.getPixelColor(imageData, cx, cy);
            
            if (this.colorsMatch(currentColor, targetColor)) {
                this.setPixelColor(imageData, cx, cy, fillColor);
                
                stack.push([cx + 1, cy]);
                stack.push([cx - 1, cy]);
                stack.push([cx, cy + 1]);
                stack.push([cx, cy - 1]);
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        this.saveState();
    }

    getPixelColor(imageData, x, y) {
        const index = (Math.round(y) * imageData.width + Math.round(x)) * 4;
        return {
            r: imageData.data[index],
            g: imageData.data[index + 1],
            b: imageData.data[index + 2],
            a: imageData.data[index + 3]
        };
    }

    setPixelColor(imageData, x, y, color) {
        const index = (Math.round(y) * imageData.width + Math.round(x)) * 4;
        imageData.data[index] = color.r;
        imageData.data[index + 1] = color.g;
        imageData.data[index + 2] = color.b;
        imageData.data[index + 3] = color.a || 255;
    }

    colorsMatch(c1, c2, tolerance = 10) {
        return Math.abs(c1.r - c2.r) <= tolerance &&
               Math.abs(c1.g - c2.g) <= tolerance &&
               Math.abs(c1.b - c2.b) <= tolerance;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    startGradient(x, y) {
        this.gradientStart = { x, y };
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    zoomIn() {
        this.state.zoom = Math.min(this.state.zoom * 1.2, 5);
        this.updateZoomUI();
        this.applyTransform();
    }

    zoomOut() {
        this.state.zoom = Math.max(this.state.zoom / 1.2, 0.1);
        this.updateZoomUI();
        this.applyTransform();
    }

    resetZoom() {
        this.state.zoom = 1;
        this.state.offsetX = 0;
        this.state.offsetY = 0;
        this.updateZoomUI();
        this.applyTransform();
    }

    updateZoomUI() {
        document.getElementById('zoomLevel').textContent = 
            Math.round(this.state.zoom * 100) + '%';
    }

    applyTransform() {
        this.canvas.style.transform = `scale(${this.state.zoom}) translate(${this.state.offsetX}px, ${this.state.offsetY}px)`;
        this.overlay.style.transform = `scale(${this.state.zoom}) translate(${this.state.offsetX}px, ${this.state.offsetY}px)`;
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
    }

    resizeCanvasToInput() {
        const width = parseInt(document.getElementById('canvasWidth').value);
        const height = parseInt(document.getElementById('canvasHeight').value);
        
        if (width >= 100 && width <= 10000 && height >= 100 && height <= 10000) {
            // 创建临时画布保存当前内容
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = width;
            tempCanvas.height = height;
            
            // 填充背景色
            tempCtx.fillStyle = '#000000';
            tempCtx.fillRect(0, 0, width, height);
            
            // 复制当前内容到中心
            tempCtx.drawImage(this.canvas, 
                Math.max(0, (width - this.canvas.width) / 2),
                Math.max(0, (height - this.canvas.height) / 2)
            );
            
            // 更新画布尺寸
            this.canvas.width = width;
            this.canvas.height = height;
            this.overlay.width = width;
            this.overlay.height = height;
            
            // 绘制回主画布
            this.ctx.drawImage(tempCanvas, 0, 0);
            
            this.saveState();
            this.showNotification(`画布已调整为 ${width} × ${height}`);
        }
    }

    saveState() {
        // 限制历史记录长度
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
        }
        
        this.state.history.push(this.canvas.toDataURL());
        this.state.historyIndex++;
        
        // 更新历史记录UI
        this.updateHistoryUI();
    }

    undo() {
        if (this.state.historyIndex > 0) {
            this.state.historyIndex--;
            this.restoreState();
        }
    }

    redo() {
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.historyIndex++;
            this.restoreState();
        }
    }

    restoreState() {
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
            this.updateHistoryUI();
        };
        img.src = this.state.history[this.state.historyIndex];
    }

    updateHistoryUI() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        // 显示最近10条历史记录
        const start = Math.max(0, this.state.historyIndex - 9);
        const end = this.state.historyIndex + 1;
        
        for (let i = start; i < end; i++) {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.textContent = `操作 ${i + 1}`;
            
            if (i === this.state.historyIndex) {
                item.style.borderColor = '#00ffea';
            }
            
            item.addEventListener('click', () => {
                this.state.historyIndex = i;
                this.restoreState();
            });
            
            historyList.appendChild(item);
        }
    }

    updateLayersUI() {
        const layersList = document.getElementById('layersList');
        layersList.innerHTML = '';
        
        this.state.layers.forEach((layer, index) => {
            const layerItem = document.createElement('div');
            layerItem.className = 'layer-item';
            layerItem.innerHTML = `
                <span>${layer.name}</span>
                <div>
                    <input type="checkbox" ${layer.visible ? 'checked' : ''}>
                    <input type="checkbox" ${layer.locked ? 'checked' : ''}>
                </div>
            `;
            
            if (index === this.state.activeLayer) {
                layerItem.style.backgroundColor = 'rgba(0, 255, 234, 0.1)';
            }
            
            layersList.appendChild(layerItem);
        });
    }

    updateUI() {
        // 更新状态显示
        document.getElementById('sizeDisplay').textContent = 
            this.state.brushSize.toString().padStart(2, '0');
    }

    saveImage() {
        const link = document.createElement('a');
        link.download = `cyber-canvas-${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
        this.showNotification('图像已保存');
    }

    exportImage(format) {
        const link = document.createElement('a');
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const quality = format === 'jpg' ? 0.9 : 1;
        
        link.download = `cyber-canvas-${Date.now()}.${format}`;
        link.href = this.canvas.toDataURL(mimeType, quality);
        link.click();
        this.showNotification(`已导出为${format.toUpperCase()}格式`);
    }

    loadImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // 计算缩放以适合画布
                    const scale = Math.min(
                        this.canvas.width / img.width,
                        this.canvas.height / img.height
                    );
                    const width = img.width * scale;
                    const height = img.height * scale;
                    const x = (this.canvas.width - width) / 2;
                    const y = (this.canvas.height - height) / 2;
                    
                    this.ctx.drawImage(img, x, y, width, height);
                    this.saveState();
                    this.showNotification('图像已加载');
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        };
        
        input.click();
    }

    clearCanvas() {
        if (confirm('确定要清空画布吗？')) {
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.saveState();
            this.showNotification('画布已清空');
        }
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        
        notificationText.textContent = message;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / this.state.zoom;
        const y = (touch.clientY - rect.top) / this.state.zoom;
        
        this.state.isDrawing = true;
        this.state.lastX = x;
        this.state.lastY = y;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    handleTouchMove(e) {
        if (!this.state.isDrawing) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / this.state.zoom;
        const y = (touch.clientY - rect.top) / this.state.zoom;
        
        this.drawBrush(x, y);
        this.state.lastX = x;
        this.state.lastY = y;
    }

    handleKeyboard(e) {
        // 快捷键支持
        const ctrl = e.ctrlKey || e.metaKey;
        
        switch(e.key.toLowerCase()) {
            case 'z':
                if (ctrl && e.shiftKey) {
                    e.preventDefault();
                    this.redo();
                } else if (ctrl) {
                    e.preventDefault();
                    this.undo();
                }
                break;
            case 'y':
                if (ctrl) {
                    e.preventDefault();
                    this.redo();
                }
                break;
            case 's':
                if (ctrl) {
                    e.preventDefault();
                    this.saveImage();
                }
                break;
            case 'l':
                if (ctrl) {
                    e.preventDefault();
                    this.loadImage();
                }
                break;
            case 'e':
                e.preventDefault();
                this.setTool('eraser');
                break;
            case 'b':
                e.preventDefault();
                this.setTool('brush');
                break;
            case '+':
            case '=':
                if (ctrl) {
                    e.preventDefault();
                    this.zoomIn();
                }
                break;
            case '-':
                if (ctrl) {
                    e.preventDefault();
                    this.zoomOut();
                }
                break;
            case '0':
                if (ctrl) {
                    e.preventDefault();
                    this.resetZoom();
                }
                break;
            case 'delete':
            case 'backspace':
                if (this.state.currentTool === 'select') {
                    // 删除选区
                }
                break;
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.cyberCanvas = new CyberCanvas();
});