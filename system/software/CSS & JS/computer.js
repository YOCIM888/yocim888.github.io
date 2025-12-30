// computer.js
document.addEventListener('DOMContentLoaded', function() {
    // 显示元素
    const display = document.getElementById('display');
    const historyDisplay = document.getElementById('history');
    const modeButtons = document.querySelectorAll('.display-mode span');
    const advancedPanel = document.getElementById('advancedPanel');
    const controlPanel = document.getElementById('controlPanel');
    const matrixModal = document.getElementById('matrixModal');
    
    // 计算器状态
    let currentValue = '0';
    let previousValue = '';
    let operation = null;
    let waitingForNewValue = false;
    let memory = 0;
    let history = [];
    let currentMode = 'basic';
    let angleUnit = 'rad'; // 默认弧度
    let precision = 6;
    
    // 物理常数
    const constants = {
        'c': 299792458, // 光速 (m/s)
        'g': 9.80665, // 重力加速度 (m/s²)
        'h': 6.62607015e-34, // 普朗克常数 (J·s)
        'G': 6.67430e-11, // 引力常数 (N·m²/kg²)
        'phi': 1.618033988749894 // 黄金比例
    };
    
    // 初始化
    initCalculator();
    
    function initCalculator() {
        // 设置默认显示
        updateDisplay();
        updateMemoryStatus();
        
        // 数字按钮事件
        document.querySelectorAll('.num-btn').forEach(button => {
            button.addEventListener('click', () => inputNumber(button.dataset.num));
        });
        
        // 操作符按钮事件
        document.querySelectorAll('.op-btn').forEach(button => {
            button.addEventListener('click', () => handleOperation(button.dataset.op));
        });
        
        // 函数按钮事件
        document.querySelectorAll('.func-btn').forEach(button => {
            button.addEventListener('click', () => handleFunction(button.dataset.func));
        });
        
        // 内存按钮事件
        document.querySelectorAll('.mem-btn').forEach(button => {
            button.addEventListener('click', () => handleMemory(button.dataset.mem));
        });
        
        // 常数按钮事件
        document.querySelectorAll('.const-btn').forEach(button => {
            button.addEventListener('click', () => inputConstant(button.dataset.const));
        });
        
        // 模式切换
        modeButtons.forEach(button => {
            button.addEventListener('click', () => switchMode(button.id.replace('mode', '').toLowerCase()));
        });
        
        // 控制面板事件
        document.getElementById('precision').addEventListener('change', function() {
            precision = parseInt(this.value);
        });
        
        document.getElementById('angleUnit').addEventListener('change', function() {
            angleUnit = this.value;
        });
        
        document.getElementById('graphToggle').addEventListener('click', function() {
            alert('图形模式将在后续版本中实现');
        });
        
        document.getElementById('matrixToggle').addEventListener('click', function() {
            openMatrixModal();
        });
        
        // 矩阵编辑器事件
        document.querySelector('.close-modal').addEventListener('click', function() {
            matrixModal.style.display = 'none';
        });
        
        document.getElementById('updateMatrixSize').addEventListener('click', updateMatrixInputs);
        
        // 矩阵操作按钮
        document.getElementById('matrixDet').addEventListener('click', calculateMatrixDet);
        document.getElementById('matrixInv').addEventListener('click', calculateMatrixInv);
        document.getElementById('matrixTranspose').addEventListener('click', calculateMatrixTranspose);
        document.getElementById('matrixEigen').addEventListener('click', calculateMatrixEigen);
        
        // 点击模态框外部关闭
        window.addEventListener('click', function(event) {
            if (event.target === matrixModal) {
                matrixModal.style.display = 'none';
            }
        });
        
        // 初始化矩阵输入
        updateMatrixInputs();
    }
    
    // 输入数字
    function inputNumber(num) {
        if (waitingForNewValue) {
            currentValue = num;
            waitingForNewValue = false;
        } else {
            currentValue = currentValue === '0' ? num : currentValue + num;
        }
        updateDisplay();
    }
    
    // 处理操作符
    function handleOperation(op) {
        const inputVal = parseFloat(currentValue);
        
        switch(op) {
            case 'clear':
                currentValue = '0';
                previousValue = '';
                operation = null;
                break;
                
            case 'backspace':
                if (currentValue.length > 1) {
                    currentValue = currentValue.slice(0, -1);
                } else {
                    currentValue = '0';
                }
                break;
                
            case '=':
                if (previousValue && operation) {
                    const prevVal = parseFloat(previousValue);
                    const result = calculate(prevVal, inputVal, operation);
                    
                    // 记录历史
                    addToHistory(`${previousValue} ${getOperationSymbol(operation)} ${currentValue} = ${result}`);
                    
                    currentValue = String(result);
                    operation = null;
                    previousValue = '';
                    waitingForNewValue = true;
                }
                break;
                
            case '+':
            case '-':
            case '*':
            case '/':
                if (previousValue === '') {
                    previousValue = currentValue;
                    waitingForNewValue = true;
                } else if (!waitingForNewValue) {
                    const prevVal = parseFloat(previousValue);
                    const result = calculate(prevVal, inputVal, operation);
                    currentValue = String(result);
                    previousValue = currentValue;
                    waitingForNewValue = true;
                }
                operation = op;
                break;
                
            case '(':
            case ')':
                currentValue = currentValue === '0' ? op : currentValue + op;
                waitingForNewValue = false;
                break;
                
            case '.':
                if (!currentValue.includes('.')) {
                    currentValue += '.';
                }
                break;
        }
        
        updateDisplay();
    }
    
    // 处理函数
    function handleFunction(func) {
        const inputVal = parseFloat(currentValue);
        let result;
        
        switch(func) {
            case 'sin':
                result = angleUnit === 'deg' ? 
                    Math.sin(inputVal * Math.PI / 180) : 
                    Math.sin(inputVal);
                break;
                
            case 'cos':
                result = angleUnit === 'deg' ? 
                    Math.cos(inputVal * Math.PI / 180) : 
                    Math.cos(inputVal);
                break;
                
            case 'tan':
                result = angleUnit === 'deg' ? 
                    Math.tan(inputVal * Math.PI / 180) : 
                    Math.tan(inputVal);
                break;
                
            case 'ln':
                result = Math.log(inputVal);
                break;
                
            case 'log':
                result = Math.log10(inputVal);
                break;
                
            case 'exp':
                result = Math.exp(inputVal);
                break;
                
            case 'sqrt':
                result = Math.sqrt(inputVal);
                break;
                
            case 'fact':
                result = factorial(inputVal);
                break;
                
            case 'integral':
                result = `∫(${currentValue})dx`;
                // 这里可以扩展为实际计算积分
                break;
                
            case 'derivative':
                result = `d/dx(${currentValue})`;
                // 这里可以扩展为实际计算导数
                break;
                
            case 'pi':
                result = Math.PI;
                break;
                
            case 'e':
                result = Math.E;
                break;
                
            case 'abs':
                result = Math.abs(inputVal);
                break;
                
            case 'pow':
                // 这里需要特殊处理，等待第二个操作数
                previousValue = currentValue;
                operation = '^';
                waitingForNewValue = true;
                updateDisplay();
                return;
                
            case 'complex':
                result = `complex(${currentValue})`;
                break;
                
            case 'matrix':
                openMatrixModal();
                return;
        }
        
        // 记录历史
        addToHistory(`${func}(${currentValue}) = ${result}`);
        
        currentValue = String(typeof result === 'number' ? formatResult(result) : result);
        waitingForNewValue = true;
        updateDisplay();
    }
    
    // 计算阶乘
    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    // 基本计算
    function calculate(a, b, op) {
        switch(op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            case '^': return Math.pow(a, b);
            default: return b;
        }
    }
    
    // 获取操作符符号
    function getOperationSymbol(op) {
        switch(op) {
            case '+': return '+';
            case '-': return '-';
            case '*': return '×';
            case '/': return '÷';
            case '^': return '^';
            default: return '';
        }
    }
    
    // 处理内存操作
    function handleMemory(memOp) {
        const inputVal = parseFloat(currentValue);
        
        switch(memOp) {
            case 'store':
                memory = inputVal;
                break;
                
            case 'recall':
                currentValue = String(memory);
                waitingForNewValue = true;
                break;
                
            case 'clearMem':
                memory = 0;
                break;
                
            case 'addMem':
                memory += inputVal;
                break;
        }
        
        updateMemoryStatus();
        updateDisplay();
    }
    
    // 输入常数
    function inputConstant(constName) {
        if (constants[constName] !== undefined) {
            currentValue = String(constants[constName]);
            waitingForNewValue = true;
            
            // 记录历史
            addToHistory(`常数 ${constName} = ${currentValue}`);
            updateDisplay();
        }
    }
    
    // 切换模式
    function switchMode(mode) {
        currentMode = mode;
        
        // 更新活跃模式按钮
        modeButtons.forEach(button => {
            const btnMode = button.id.replace('mode', '').toLowerCase();
            if (btnMode === mode) {
                button.classList.add('mode-active');
            } else {
                button.classList.remove('mode-active');
            }
        });
        
        // 根据模式显示/隐藏面板
        switch(mode) {
            case 'basic':
                advancedPanel.style.display = 'block';
                controlPanel.style.display = 'flex';
                break;
                
            case 'scientific':
                advancedPanel.style.display = 'block';
                controlPanel.style.display = 'flex';
                break;
                
            case 'matrix':
                advancedPanel.style.display = 'block';
                controlPanel.style.display = 'flex';
                break;
                
            case 'graph':
                advancedPanel.style.display = 'none';
                controlPanel.style.display = 'flex';
                break;
                
            case 'stats':
                advancedPanel.style.display = 'none';
                controlPanel.style.display = 'flex';
                break;
        }
        
        // 更新状态
        document.getElementById('quantumStatus').textContent = 
            mode === 'matrix' ? '矩阵处理' : 
            mode === 'graph' ? '图形渲染' : 
            mode === 'stats' ? '统计分析' : '就绪';
    }
    
    // 打开矩阵模态框
    function openMatrixModal() {
        matrixModal.style.display = 'flex';
        updateMatrixInputs();
    }
    
    // 更新矩阵输入框
    function updateMatrixInputs() {
        const rows = parseInt(document.getElementById('matrixRows').value);
        const cols = parseInt(document.getElementById('matrixCols').value);
        const container = document.getElementById('matrixInputContainer');
        
        // 清空容器
        container.innerHTML = '';
        
        // 设置网格布局
        container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        // 创建输入框
        for (let i = 0; i < rows * cols; i++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = i % (cols + 1) === 0 ? '1' : '0';
            input.dataset.row = Math.floor(i / cols);
            input.dataset.col = i % cols;
            input.classList.add('matrix-cell');
            container.appendChild(input);
        }
    }
    
    // 获取矩阵值
    function getMatrixValues() {
        const rows = parseInt(document.getElementById('matrixRows').value);
        const cols = parseInt(document.getElementById('matrixCols').value);
        const cells = document.querySelectorAll('.matrix-cell');
        
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols; j++) {
                const index = i * cols + j;
                matrix[i][j] = parseFloat(cells[index].value) || 0;
            }
        }
        
        return matrix;
    }
    
    // 计算矩阵行列式
    function calculateMatrixDet() {
        const matrix = getMatrixValues();
        
        // 仅支持方阵
        if (matrix.length !== matrix[0].length) {
            alert('行列式计算只适用于方阵！');
            return;
        }
        
        // 简单实现2x2和3x3矩阵的行列式计算
        let det;
        if (matrix.length === 2) {
            det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        } else if (matrix.length === 3) {
            det = matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
                  matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
                  matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
        } else {
            det = '仅支持2x2和3x3矩阵';
        }
        
        addToHistory(`det(M) = ${det}`);
        currentValue = String(det);
        updateDisplay();
        matrixModal.style.display = 'none';
    }
    
    // 计算逆矩阵
    function calculateMatrixInv() {
        const matrix = getMatrixValues();
        
        // 仅支持2x2矩阵的逆
        if (matrix.length !== 2 || matrix[0].length !== 2) {
            alert('当前仅支持2x2矩阵的逆矩阵计算！');
            return;
        }
        
        const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        
        if (det === 0) {
            alert('矩阵不可逆（行列式为0）！');
            return;
        }
        
        const invMatrix = [
            [matrix[1][1] / det, -matrix[0][1] / det],
            [-matrix[1][0] / det, matrix[0][0] / det]
        ];
        
        addToHistory(`M⁻¹ = [[${invMatrix[0][0]}, ${invMatrix[0][1]}], [${invMatrix[1][0]}, ${invMatrix[1][1]}]]`);
        currentValue = '矩阵逆已计算';
        updateDisplay();
        matrixModal.style.display = 'none';
    }
    
    // 计算转置矩阵
    function calculateMatrixTranspose() {
        const matrix = getMatrixValues();
        const rows = matrix.length;
        const cols = matrix[0].length;
        
        const transposed = [];
        for (let j = 0; j < cols; j++) {
            transposed[j] = [];
            for (let i = 0; i < rows; i++) {
                transposed[j][i] = matrix[i][j];
            }
        }
        
        // 显示转置矩阵
        let transposedStr = '转置: [';
        for (let i = 0; i < transposed.length; i++) {
            transposedStr += '[' + transposed[i].join(', ') + ']';
            if (i < transposed.length - 1) transposedStr += ', ';
        }
        transposedStr += ']';
        
        addToHistory(transposedStr);
        currentValue = '矩阵已转置';
        updateDisplay();
        matrixModal.style.display = 'none';
    }
    
    // 计算特征值（简化版，仅2x2）
    function calculateMatrixEigen() {
        const matrix = getMatrixValues();
        
        if (matrix.length !== 2 || matrix[0].length !== 2) {
            alert('当前仅支持2x2矩阵的特征值计算！');
            return;
        }
        
        const a = matrix[0][0];
        const b = matrix[0][1];
        const c = matrix[1][0];
        const d = matrix[1][1];
        
        // 特征值公式: λ = (a+d)/2 ± √(((a+d)/2)² - (ad-bc))
        const trace = a + d;
        const det = a * d - b * c;
        
        const discriminant = (trace/2) ** 2 - det;
        
        if (discriminant < 0) {
            const realPart = trace/2;
            const imagPart = Math.sqrt(-discriminant);
            addToHistory(`特征值: ${realPart} ± ${imagPart}i`);
            currentValue = '复数特征值';
        } else {
            const lambda1 = trace/2 + Math.sqrt(discriminant);
            const lambda2 = trace/2 - Math.sqrt(discriminant);
            addToHistory(`特征值: λ₁=${lambda1}, λ₂=${lambda2}`);
            currentValue = '特征值已计算';
        }
        
        updateDisplay();
        matrixModal.style.display = 'none';
    }
    
    // 格式化结果
    function formatResult(value) {
        if (isNaN(value) || !isFinite(value)) {
            return value;
        }
        
        // 根据精度格式化
        return parseFloat(value.toFixed(precision));
    }
    
    // 更新显示
    function updateDisplay() {
        display.textContent = currentValue;
        
        // 更新历史显示（最近3条）
        if (history.length > 0) {
            const recentHistory = history.slice(-3).join(' | ');
            historyDisplay.textContent = recentHistory;
        }
    }
    
    // 更新内存状态
    function updateMemoryStatus() {
        document.getElementById('memoryStatus').textContent = 
            `${memory !== 0 ? '1' : '0'} 条记录`;
    }
    
    // 添加到历史
    function addToHistory(entry) {
        history.push(entry);
        if (history.length > 10) {
            history.shift();
        }
    }
    
    // 添加键盘支持
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        // 数字键
        if (key >= '0' && key <= '9') {
            inputNumber(key);
        }
        
        // 操作符
        else if (['+', '-', '*', '/'].includes(key)) {
            handleOperation(key === '*' ? '*' : key === '/' ? '/' : key);
        }
        
        // 小数点
        else if (key === '.') {
            handleOperation('.');
        }
        
        // 等号或回车
        else if (key === '=' || key === 'Enter') {
            handleOperation('=');
        }
        
        // 退格
        else if (key === 'Backspace') {
            handleOperation('backspace');
        }
        
        // 清除
        else if (key === 'Escape' || key === 'Delete') {
            handleOperation('clear');
        }
        
        // 括号
        else if (key === '(') {
            handleOperation('(');
        } else if (key === ')') {
            handleOperation(')');
        }
        
        // 阻止默认行为
        if (['=', 'Enter', '+', '-', '*', '/', '.', 'Backspace', 'Escape', 'Delete'].includes(key)) {
            event.preventDefault();
        }
    });
    
    // 初始化状态栏
    setInterval(() => {
        const statusElements = ['就绪', '计算中', '超频中', '量子态'];
        const randomStatus = statusElements[Math.floor(Math.random() * statusElements.length)];
        document.getElementById('calcUnit').textContent = randomStatus;
    }, 3000);
});