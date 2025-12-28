// CSS特效库数据
const effectsDatabase = [
    {
        id: 'pulse',
        name: '脉动特效',
        tags: ['动画', '关键帧', '发光'],
        description: '创建一个有节奏的脉动动画效果',
        css: `.pulse-element {
  width: 100px;
  height: 100px;
  background: #00f3ff;
  border-radius: 50%;
  margin: 0 auto;
  box-shadow: 0 0 20px #00f3ff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 243, 255, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 20px rgba(0, 243, 255, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 243, 255, 0);
  }
}`,
        html: '<div class="pulse-element"></div>',
        parameters: [
            { name: 'size', label: '尺寸', type: 'range', min: 50, max: 200, value: 100, unit: 'px' },
            { name: 'color', label: '颜色', type: 'color', value: '#00f3ff' },
            { name: 'duration', label: '持续时间', type: 'range', min: 0.5, max: 5, value: 2, step: 0.1, unit: 's' },
            { name: 'shadowSize', label: '阴影大小', type: 'range', min: 5, max: 50, value: 20, unit: 'px' }
        ]
    },
    {
        id: 'neon-border',
        name: '霓虹边框',
        tags: ['边框', '发光', '悬停'],
        description: '带有霓虹发光效果的边框',
        css: `.neon-border-element {
  width: 200px;
  height: 100px;
  background: rgba(10, 15, 30, 0.8);
  border: 3px solid #00f3ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00f3ff;
  font-size: 1.2rem;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.neon-border-element:hover {
  box-shadow: 
    0 0 20px #00f3ff,
    inset 0 0 20px rgba(0, 243, 255, 0.2);
  text-shadow: 0 0 10px #00f3ff;
}

.neon-border-element::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, #00f3ff, #ff00ff, #00ffaa, #00f3ff);
  background-size: 400% 400%;
  z-index: -1;
  border-radius: 15px;
  animation: neon-border-glow 3s ease infinite;
  opacity: 0.7;
}

@keyframes neon-border-glow {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}`,
        html: '<div class="neon-border-element">霓虹边框</div>',
        parameters: [
            { name: 'width', label: '宽度', type: 'range', min: 100, max: 400, value: 200, unit: 'px' },
            { name: 'height', label: '高度', type: 'range', min: 50, max: 200, value: 100, unit: 'px' },
            { name: 'borderColor', label: '边框颜色', type: 'color', value: '#00f3ff' },
            { name: 'borderWidth', label: '边框粗细', type: 'range', min: 1, max: 10, value: 3, unit: 'px' },
            { name: 'glowIntensity', label: '发光强度', type: 'range', min: 5, max: 50, value: 20, unit: 'px' }
        ]
    },
    {
        id: 'cyber-grid',
        name: '赛博网格',
        tags: ['背景', '网格', '动画'],
        description: '动态赛博朋克风格网格背景',
        css: `.cyber-grid-element {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #0a0a14;
}

.cyber-grid-element::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background-image: 
    linear-gradient(to right, rgba(0, 243, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 243, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: grid-move 20s linear infinite;
  transform-origin: 0 0;
}

.cyber-grid-element::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 30%, rgba(10, 10, 20, 0.9) 70%);
}

@keyframes grid-move {
  0% {
    transform: translateX(0) translateY(0);
  }
  100% {
    transform: translateX(-40px) translateY(-40px);
  }
}`,
        html: '<div class="cyber-grid-element"></div>',
        parameters: [
            { name: 'gridSize', label: '网格大小', type: 'range', min: 10, max: 80, value: 40, unit: 'px' },
            { name: 'gridColor', label: '网格颜色', type: 'color', value: '#00f3ff' },
            { name: 'opacity', label: '不透明度', type: 'range', min: 0, max: 100, value: 10, unit: '%' },
            { name: 'animationSpeed', label: '动画速度', type: 'range', min: 5, max: 60, value: 20, unit: 's' }
        ]
    },
    {
        id: 'hologram',
        name: '全息投影',
        tags: ['3D', '动画', '科技'],
        description: '3D全息投影效果',
        css: `.hologram-element {
  width: 150px;
  height: 150px;
  position: relative;
  transform-style: preserve-3d;
  animation: hologram-rotate 10s infinite linear;
}

.hologram-element::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent 40%, rgba(0, 243, 255, 0.8) 50%, transparent 60%);
  background-size: 200% 200%;
  border-radius: 10px;
  animation: hologram-shine 3s infinite linear;
  transform: translateZ(20px);
}

.hologram-element::after {
  content: '';
  position: absolute;
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
  background: rgba(0, 243, 255, 0.2);
  border: 2px solid rgba(0, 243, 255, 0.5);
  border-radius: 10px;
  box-shadow: 
    0 0 30px rgba(0, 243, 255, 0.5),
    inset 0 0 30px rgba(0, 243, 255, 0.2);
  transform: translateZ(-10px);
}

@keyframes hologram-rotate {
  0% {
    transform: rotateX(-10deg) rotateY(0deg);
  }
  100% {
    transform: rotateX(-10deg) rotateY(360deg);
  }
}

@keyframes hologram-shine {
  0% {
    background-position: -100% -100%;
  }
  100% {
    background-position: 200% 200%;
  }
}`,
        html: '<div class="hologram-element"></div>',
        parameters: [
            { name: 'size', label: '尺寸', type: 'range', min: 80, max: 300, value: 150, unit: 'px' },
            { name: 'color', label: '颜色', type: 'color', value: '#00f3ff' },
            { name: 'rotationSpeed', label: '旋转速度', type: 'range', min: 5, max: 30, value: 10, unit: 's' },
            { name: 'glowStrength', label: '发光强度', type: 'range', min: 10, max: 50, value: 30, unit: 'px' }
        ]
    },
    {
        id: 'data-stream',
        name: '数据流',
        tags: ['文本', '动画', '科技'],
        description: '数字数据流效果',
        css: `.data-stream-element {
  width: 300px;
  height: 200px;
  background: rgba(0, 20, 40, 0.9);
  border: 1px solid #00f3ff;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  font-family: 'Courier New', monospace;
}

.data-stream-element::before {
  content: '010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101';
  position: absolute;
  width: 100%;
  color: rgba(0, 243, 255, 0.8);
  font-size: 1.2rem;
  line-height: 1.5;
  animation: data-stream-flow 10s linear infinite;
  text-shadow: 0 0 10px #00f3ff;
}

@keyframes data-stream-flow {
  0% {
    transform: translateY(200px);
  }
  100% {
    transform: translateY(-200px);
  }
}`,
        html: '<div class="data-stream-element"></div>',
        parameters: [
            { name: 'width', label: '宽度', type: 'range', min: 200, max: 500, value: 300, unit: 'px' },
            { name: 'height', label: '高度', type: 'range', min: 100, max: 400, value: 200, unit: 'px' },
            { name: 'color', label: '颜色', type: 'color', value: '#00f3ff' },
            { name: 'speed', label: '流速', type: 'range', min: 5, max: 30, value: 10, unit: 's' },
            { name: 'fontSize', label: '字体大小', type: 'range', min: 0.8, max: 2, value: 1.2, step: 0.1, unit: 'rem' }
        ]
    },
    {
        id: 'glitch-text',
        name: '故障文本',
        tags: ['文本', '动画', '故障'],
        description: '赛博朋克故障文本效果',
        css: `.glitch-text-element {
  font-size: 3rem;
  font-weight: bold;
  color: #00f3ff;
  position: relative;
  text-shadow: 0.05em 0 0 #ff00ff, -0.03em -0.04em 0 #00ffaa;
  animation: glitch 5s infinite;
}

.glitch-text-element::before,
.glitch-text-element::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text-element::before {
  animation: glitch-top 1s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
  -webkit-clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
}

.glitch-text-element::after {
  animation: glitch-bottom 1.5s infinite;
  clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
  -webkit-clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
}

@keyframes glitch {
  0%, 14%, 15%, 49%, 50%, 99%, 100% {
    text-shadow: 0.05em 0 0 #ff00ff, -0.03em -0.04em 0 #00ffaa;
  }
  15%, 49% {
    text-shadow: -0.05em -0.025em 0 #ff00ff, 0.025em 0.035em 0 #00ffaa;
  }
  50%, 99% {
    text-shadow: 0.05em 0.035em 0 #ff00ff, 0.03em 0 0 #00ffaa;
  }
}

@keyframes glitch-top {
  0%, 5%, 10%, 15%, 100% {
    transform: translate(0);
  }
  1% {
    transform: translate(-2px, 2px);
  }
  2% {
    transform: translate(-4px, -1px);
  }
  6% {
    transform: translate(6px, -2px);
  }
  7% {
    transform: translate(2px, 3px);
  }
  11% {
    transform: translate(-3px, 1px);
  }
  12% {
    transform: translate(5px, 4px);
  }
}

@keyframes glitch-bottom {
  0%, 5%, 10%, 15%, 100% {
    transform: translate(0);
  }
  1% {
    transform: translate(2px, -1px);
  }
  3% {
    transform: translate(-4px, 3px);
  }
  6% {
    transform: translate(5px, 2px);
  }
  8% {
    transform: translate(-3px, -2px);
  }
  11% {
    transform: translate(4px, -3px);
  }
  13% {
    transform: translate(-2px, 1px);
  }
}`,
        html: '<div class="glitch-text-element" data-text="GLITCH">GLITCH</div>',
        parameters: [
            { name: 'text', label: '文本内容', type: 'text', value: 'GLITCH' },
            { name: 'fontSize', label: '字体大小', type: 'range', min: 1, max: 5, value: 3, step: 0.1, unit: 'rem' },
            { name: 'color1', label: '颜色1', type: 'color', value: '#00f3ff' },
            { name: 'color2', label: '颜色2', type: 'color', value: '#ff00ff' },
            { name: 'color3', label: '颜色3', type: 'color', value: '#00ffaa' },
            { name: 'animationSpeed', label: '动画速度', type: 'range', min: 1, max: 10, value: 5, unit: 's' }
        ]
    },
    {
        id: 'energy-beam',
        name: '能量光束',
        tags: ['动画', '光束', '科幻'],
        description: '能量光束发射效果',
        css: `.energy-beam-element {
  width: 300px;
  height: 150px;
  position: relative;
  overflow: hidden;
}

.energy-beam {
  position: absolute;
  width: 10px;
  height: 150px;
  background: linear-gradient(to bottom, transparent, #00f3ff, transparent);
  left: 50%;
  transform: translateX(-50%);
  border-radius: 5px;
  box-shadow: 0 0 20px #00f3ff;
  animation: energy-beam-shoot 2s infinite;
}

.energy-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #00f3ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00f3ff;
  animation: energy-particle-float 3s infinite linear;
}

.energy-particle:nth-child(2) {
  top: 20%;
  left: 40%;
  animation-delay: 0.5s;
}

.energy-particle:nth-child(3) {
  top: 60%;
  left: 60%;
  animation-delay: 1s;
}

.energy-particle:nth-child(4) {
  top: 40%;
  left: 30%;
  animation-delay: 1.5s;
}

@keyframes energy-beam-shoot {
  0%, 100% {
    height: 0;
    opacity: 0;
  }
  10%, 90% {
    opacity: 1;
  }
  50% {
    height: 150px;
  }
}

@keyframes energy-particle-float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10%, 90% {
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) translateX(20px);
  }
}`,
        html: '<div class="energy-beam-element"><div class="energy-beam"></div><div class="energy-particle"></div><div class="energy-particle"></div><div class="energy-particle"></div><div class="energy-particle"></div></div>',
        parameters: [
            { name: 'width', label: '宽度', type: 'range', min: 200, max: 500, value: 300, unit: 'px' },
            { name: 'height', label: '高度', type: 'range', min: 100, max: 300, value: 150, unit: 'px' },
            { name: 'beamColor', label: '光束颜色', type: 'color', value: '#00f3ff' },
            { name: 'beamWidth', label: '光束宽度', type: 'range', min: 5, max: 30, value: 10, unit: 'px' },
            { name: 'animationSpeed', label: '动画速度', type: 'range', min: 1, max: 5, value: 2, unit: 's' }
        ]
    },
    {
        id: 'cyber-button',
        name: '赛博按钮',
        tags: ['按钮', '交互', '悬停'],
        description: '赛博朋克风格交互按钮',
        css: `.cyber-button-element {
  padding: 15px 30px;
  background: linear-gradient(45deg, #003366, #0066cc);
  border: 2px solid #00f3ff;
  border-radius: 0;
  color: #00f3ff;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.cyber-button-element:hover {
  background: linear-gradient(45deg, #004488, #0088ff);
  box-shadow: 
    0 0 20px #00f3ff,
    0 0 40px #00f3ff,
    inset 0 0 20px rgba(0, 243, 255, 0.2);
  transform: translateY(-3px);
}

.cyber-button-element:active {
  transform: translateY(1px);
}

.cyber-button-element::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.4), transparent);
  transition: left 0.5s;
}

.cyber-button-element:hover::before {
  left: 100%;
}

.cyber-button-element::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #00f3ff, #ff00ff, #00ffaa, #00f3ff);
  background-size: 400% 400%;
  z-index: -1;
  animation: cyber-button-border 3s ease infinite;
  opacity: 0;
  transition: opacity 0.3s;
}

.cyber-button-element:hover::after {
  opacity: 1;
}

@keyframes cyber-button-border {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}`,
        html: '<button class="cyber-button-element">赛博按钮</button>',
        parameters: [
            { name: 'text', label: '按钮文本', type: 'text', value: '赛博按钮' },
            { name: 'paddingX', label: '水平内边距', type: 'range', min: 10, max: 50, value: 30, unit: 'px' },
            { name: 'paddingY', label: '垂直内边距', type: 'range', min: 10, max: 40, value: 15, unit: 'px' },
            { name: 'borderColor', label: '边框颜色', type: 'color', value: '#00f3ff' },
            { name: 'fontSize', label: '字体大小', type: 'range', min: 0.8, max: 2, value: 1.2, step: 0.1, unit: 'rem' }
        ]
    }
];

// 应用状态
let currentEffect = null;
let currentEffectId = null;

// DOM元素引用
const effectsList = document.querySelector('.effects-list');
const effectPreview = document.getElementById('effectPreview');
const paramsContainer = document.querySelector('.params-container');
const cssCode = document.getElementById('cssCode');
const codeHighlight = document.getElementById('codeHighlight');
const effectTitle = document.getElementById('effectTitle');
const effectsCount = document.getElementById('effectsCount');
const searchEffect = document.getElementById('searchEffect');
const randomEffect = document.getElementById('randomEffect');
const copyCSS = document.getElementById('copyCSS');
const resetEffect = document.getElementById('resetEffect');
const fullscreen = document.getElementById('fullscreen');
const toggleComments = document.getElementById('toggleComments');
const minifyCSS = document.getElementById('minifyCSS');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// 初始化应用
function initApp() {
    // 显示特效数量
    effectsCount.textContent = effectsDatabase.length;
    
    // 渲染特效列表
    renderEffectsList(effectsDatabase);
    
    // 默认选择第一个特效
    if (effectsDatabase.length > 0) {
        selectEffect(effectsDatabase[0].id);
    }
    
    // 设置事件监听器
    setupEventListeners();
    
    // 初始化代码高亮
    updateCodeHighlight();
}

// 渲染特效列表
function renderEffectsList(effects) {
    effectsList.innerHTML = '';
    
    effects.forEach(effect => {
        const effectItem = document.createElement('div');
        effectItem.className = 'effect-item';
        effectItem.dataset.id = effect.id;
        
        effectItem.innerHTML = `
            <div class="effect-name">
                <i class="fas fa-code"></i>
                ${effect.name}
            </div>
            <div class="effect-tags">
                ${effect.tags.map(tag => `<span class="effect-tag">${tag}</span>`).join('')}
            </div>
        `;
        
        effectItem.addEventListener('click', () => selectEffect(effect.id));
        effectsList.appendChild(effectItem);
    });
}

// 选择特效
function selectEffect(effectId) {
    // 更新活动项
    document.querySelectorAll('.effect-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.id === effectId) {
            item.classList.add('active');
        }
    });
    
    // 查找特效数据
    const effect = effectsDatabase.find(e => e.id === effectId);
    if (!effect) return;
    
    currentEffect = { ...effect };
    currentEffectId = effectId;
    
    // 更新标题
    effectTitle.textContent = effect.name;
    
    // 渲染预览
    renderEffectPreview(effect);
    
    // 渲染参数控制
    renderEffectParameters(effect);
    
    // 更新代码显示
    updateCodeDisplay();
}

// 渲染特效预览
function renderEffectPreview(effect) {
    effectPreview.innerHTML = effect.html;
    
    // 应用CSS到预览区域
    const styleElement = document.createElement('style');
    styleElement.id = 'effect-style';
    styleElement.textContent = effect.css;
    
    // 移除旧的样式
    const oldStyle = document.getElementById('effect-style');
    if (oldStyle) oldStyle.remove();
    
    document.head.appendChild(styleElement);
}

// 渲染特效参数控制
function renderEffectParameters(effect) {
    paramsContainer.innerHTML = '';
    
    if (!effect.parameters || effect.parameters.length === 0) {
        paramsContainer.innerHTML = '<p style="color: #80e1ff; text-align: center; padding: 20px;">此特效无可调参数</p>';
        return;
    }
    
    effect.parameters.forEach(param => {
        const paramGroup = document.createElement('div');
        paramGroup.className = 'param-group';
        
        const paramControl = document.createElement('div');
        paramControl.className = 'param-control';
        
        let inputElement;
        
        if (param.type === 'range') {
            inputElement = document.createElement('input');
            inputElement.type = 'range';
            inputElement.min = param.min;
            inputElement.max = param.max;
            inputElement.value = param.value;
            inputElement.step = param.step || 1;
            inputElement.dataset.param = param.name;
            
            const valueDisplay = document.createElement('span');
            valueDisplay.className = 'param-value';
            valueDisplay.textContent = param.value + (param.unit || '');
            
            inputElement.addEventListener('input', function() {
                valueDisplay.textContent = this.value + (param.unit || '');
                updateEffectParameter(param.name, this.value);
            });
            
            paramControl.appendChild(inputElement);
            paramControl.appendChild(valueDisplay);
        } 
        else if (param.type === 'color') {
            inputElement = document.createElement('input');
            inputElement.type = 'color';
            inputElement.value = param.value;
            inputElement.dataset.param = param.name;
            
            inputElement.addEventListener('input', function() {
                updateEffectParameter(param.name, this.value);
            });
            
            paramControl.appendChild(inputElement);
        }
        else if (param.type === 'text') {
            inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.value = param.value;
            inputElement.dataset.param = param.name;
            
            inputElement.addEventListener('input', function() {
                updateEffectParameter(param.name, this.value);
            });
            
            paramControl.appendChild(inputElement);
        }
        
        paramGroup.innerHTML = `
            <label class="param-label">${param.label}</label>
        `;
        paramGroup.appendChild(paramControl);
        paramsContainer.appendChild(paramGroup);
    });
}

// 更新特效参数
function updateEffectParameter(paramName, value) {
    if (!currentEffect) return;
    
    // 更新当前特效的参数值
    const param = currentEffect.parameters.find(p => p.name === paramName);
    if (param) param.value = value;
    
    // 更新CSS
    updateEffectCSS();
    
    // 更新代码显示
    updateCodeDisplay();
}

// 更新特效CSS
function updateEffectCSS() {
    if (!currentEffect) return;
    
    let updatedCSS = currentEffect.css;
    
    // 替换参数值
    currentEffect.parameters.forEach(param => {
        const regex = new RegExp(`(\\b${param.value}\\b)(?!-|\\s*%)`, 'g');
        updatedCSS = updatedCSS.replace(regex, param.value);
        
        // 特殊处理：对于文本参数，更新HTML内容
        if (param.type === 'text') {
            const element = effectPreview.querySelector('.cyber-button-element, .glitch-text-element');
            if (element) {
                if (element.classList.contains('glitch-text-element')) {
                    element.setAttribute('data-text', param.value);
                    element.textContent = param.value;
                } else {
                    element.textContent = param.value;
                }
            }
        }
    });
    
    // 更新样式
    const styleElement = document.getElementById('effect-style');
    if (styleElement) {
        styleElement.textContent = updatedCSS;
    }
    
    // 更新当前特效的CSS
    currentEffect.css = updatedCSS;
}

// 更新代码显示
function updateCodeDisplay() {
    if (!currentEffect) return;
    
    cssCode.value = currentEffect.css;
    updateCodeHighlight();
}

// 更新代码高亮
function updateCodeHighlight() {
    const code = cssCode.value;
    
    // 简单的高亮实现
    let highlighted = code
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>') // 注释
        .replace(/\.[a-zA-Z0-9_-]+\b/g, '<span class="selector">$&</span>') // 选择器
        .replace(/\{/g, '<span class="brace">{</span>')
        .replace(/\}/g, '<span class="brace">}</span>')
        .replace(/;/g, '<span class="semicolon">;</span>')
        .replace(/:[^:]/g, '<span class="colon">:</span>')
        .replace(/\b(animation|keyframes|from|to|background|color|border|transform|position|width|height|font-size|margin|padding|display|align-items|justify-content|overflow|box-shadow|text-shadow|opacity|transition|z-index|content)\b/g, '<span class="property">$1</span>')
        .replace(/\b(\d+(\.\d+)?)(px|rem|em|%|s|ms|deg)\b/g, '<span class="value">$1$3</span>')
        .replace(/#[0-9a-fA-F]{3,6}\b/g, '<span class="color">$&</span>')
        .replace(/\b(rgba?\([^)]+\))/g, '<span class="color">$1</span>');
    
    codeHighlight.innerHTML = highlighted;
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索特效
    searchEffect.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredEffects = effectsDatabase.filter(effect => 
            effect.name.toLowerCase().includes(searchTerm) ||
            effect.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            effect.description.toLowerCase().includes(searchTerm)
        );
        
        renderEffectsList(filteredEffects);
        
        // 如果有搜索结果，选择第一个
        if (filteredEffects.length > 0 && (!currentEffectId || !filteredEffects.some(e => e.id === currentEffectId))) {
            selectEffect(filteredEffects[0].id);
        }
        
        // 更新计数
        effectsCount.textContent = filteredEffects.length;
    });
    
    // 随机特效
    randomEffect.addEventListener('click', function() {
        const randomIndex = Math.floor(Math.random() * effectsDatabase.length);
        selectEffect(effectsDatabase[randomIndex].id);
    });
    
    // 复制CSS
    copyCSS.addEventListener('click', function() {
        navigator.clipboard.writeText(cssCode.value)
            .then(() => {
                showNotification('CSS代码已复制到剪贴板');
            })
            .catch(err => {
                console.error('复制失败: ', err);
                showNotification('复制失败，请手动复制代码');
            });
    });
    
    // 重置特效
    resetEffect.addEventListener('click', function() {
        if (currentEffectId) {
            const originalEffect = effectsDatabase.find(e => e.id === currentEffectId);
            if (originalEffect) {
                currentEffect = { ...originalEffect };
                renderEffectPreview(currentEffect);
                renderEffectParameters(currentEffect);
                updateCodeDisplay();
                showNotification('特效已重置为默认值');
            }
        }
    });
    
    // 全屏模式
    fullscreen.addEventListener('click', function() {
        const container = document.querySelector('.cyber-container');
        
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    });
    
    // 切换注释
    toggleComments.addEventListener('click', function() {
        let code = cssCode.value;
        
        // 检查是否已有注释
        if (code.includes('/*')) {
            // 移除注释
            code = code.replace(/\/\*[\s\S]*?\*\//g, '');
            showNotification('注释已移除');
        } else {
            // 添加注释
            const comment = `\n/* ${currentEffect.name} - ${currentEffect.description} */\n`;
            code = comment + code;
            showNotification('注释已添加');
        }
        
        cssCode.value = code;
        updateCodeHighlight();
    });
    
    // 压缩CSS
    minifyCSS.addEventListener('click', function() {
        let code = cssCode.value;
        
        // 简单的CSS压缩
        code = code
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
            .replace(/\s+/g, ' ') // 将多个空格合并为一个
            .replace(/\s*\{\s*/g, '{') // 移除大括号周围的空格
            .replace(/\s*\}\s*/g, '}') // 移除大括号周围的空格
            .replace(/\s*;\s*/g, ';') // 移除分号周围的空格
            .replace(/\s*:\s*/g, ':') // 移除冒号周围的空格
            .replace(/\s*,\s*/g, ',') // 移除逗号周围的空格
            .trim();
        
        cssCode.value = code;
        updateCodeHighlight();
        showNotification('CSS已压缩');
    });
    
    // 代码编辑器输入事件
    cssCode.addEventListener('input', function() {
        updateCodeHighlight();
        
        // 尝试应用新CSS
        try {
            const styleElement = document.getElementById('effect-style');
            if (styleElement) {
                styleElement.textContent = this.value;
                if (currentEffect) {
                    currentEffect.css = this.value;
                }
            }
        } catch (e) {
            console.error('CSS应用错误:', e);
        }
    });
}

// 显示通知
function showNotification(message) {
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// 当页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 添加额外的CSS高亮样式
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
    .comment { color: #6a9955; }
    .selector { color: #d7ba7d; }
    .property { color: #9cdcfe; }
    .value { color: #b5cea8; }
    .color { color: #ce9178; }
    .brace { color: #d4d4d4; }
    .semicolon { color: #d4d4d4; }
    .colon { color: #d4d4d4; }
`;
document.head.appendChild(highlightStyle);