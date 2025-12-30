// shop.js
// 初始化余额
let balance = 68000;
let selectedProductId = null;

// 赛博朋克商品数据
const cyberProducts = [
    { id: 1, name: "77式-脑机接口", description: "第七代神经直连接口，支持全息界面投影与意识操控", price: 8500, icon: "🧠" },
    { id: 2, name: "异变血清-X", description: "基因优化剂，可暂时提升反应速度与感知能力", price: 3200, icon: "🧪" },
    { id: 3, name: "量子隐形斗篷", description: "光子偏折装置，实现短时光学隐形效果", price: 12500, icon: "👁️" },
    { id: 4, name: "赛博义眼-鹰隼", description: "高解析度光学传感器，带热成像与数据叠加功能", price: 5600, icon: "👁" },
    { id: 5, name: "等离子武士刀", description: "高周波能量刃，可切割大多数合金材料", price: 9800, icon: "⚡" },
    { id: 6, name: "神经黑客芯片", description: "植入式网络接入装置，支持直接脑机入侵", price: 7500, icon: "💻" },
    { id: 7, name: "能量护盾发生器", description: "个人用能量屏障，可抵御中小型能量武器", price: 11200, icon: "🛡️" },
    { id: 8, name: "记忆编辑器", description: "选择性记忆擦除与植入设备（需专业许可）", price: 15000, icon: "📼" },
    { id: 9, name: "全息伪装面具", description: "实时面部投影，可模拟任意外貌特征", price: 4500, icon: "🎭" },
    { id: 10, name: "反重力靴", description: "磁悬浮移动装置，垂直墙面行走能力", price: 8900, icon: "👟" },
    { id: 11, name: "纳米修复液", description: "医疗纳米机器人集群，可修复大多数组织损伤", price: 6800, icon: "🩹" },
    { id: 12, name: "意识备份单元", description: "定期上传意识副本至安全服务器", price: 13500, icon: "💾" },
    { id: 13, name: "电磁脉冲手枪", description: "非致命性武器，可瘫痪电子设备", price: 5400, icon: "🔫" },
    { id: 14, name: "赛博格强化脊柱", description: "增强型人造脊柱，提升负重与运动能力", price: 10200, icon: "🦴" },
    { id: 15, name: "虚空存储戒指", description: "微型空间折叠容器，约1立方米存储空间", price: 7800, icon: "💍" },
    { id: 16, name: "神经抑制器", description: "阻断疼痛信号，保持极端环境下的操作能力", price: 3600, icon: "⛓️" },
    { id: 17, name: "全息投影仪", description: "便携式高分辨率全息环境投影设备", price: 6200, icon: "📡" },
    { id: 18, name: "仿生伪装皮肤", description: "可编程色素细胞层，实现动态变色伪装", price: 7100, icon: "🎨" },
    { id: 19, name: "量子加密通信器", description: "绝对安全的跨维度通讯装置", price: 9400, icon: "📱" },
    { id: 20, name: "时空稳定锚", description: "防止局部时空异常影响的个人装置", price: 16500, icon: "⏳" }
];

// DOM元素
const balanceElement = document.getElementById('balance');
const productList = document.getElementById('product-list');
const rechargeBtn = document.getElementById('recharge-btn');
const transactionLog = document.getElementById('transaction-log');
const notification = document.getElementById('notification');
const notificationText = notification.querySelector('.notification-text');
const cyberTimeElement = document.getElementById('cyber-time');
const selectedProductElement = document.getElementById('selected-product');
const scrollUpBtn = document.getElementById('scroll-up-btn');
const scrollDownBtn = document.getElementById('scroll-down-btn');
const buySelectedBtn = document.getElementById('buy-selected-btn');

// 初始化系统时间显示
function updateCyberTime() {
    const now = new Date();
    const cyberDate = new Date(2199, 4, 21, now.getHours(), now.getMinutes(), now.getSeconds());
    
    const formattedDate = cyberDate.toISOString()
        .replace('T', ' ')
        .replace(/\.\d+Z$/, '')
        .replace('2199-05', '2199-06'); // 显示6月而不是5月
    
    cyberTimeElement.textContent = formattedDate;
}

// 初始化时间更新
updateCyberTime();
setInterval(updateCyberTime, 1000);

// 初始化商品显示
function initializeProducts() {
    productList.innerHTML = '';
    
    cyberProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.dataset.id = product.id;
        
        productItem.innerHTML = `
            <div class="product-icon">${product.icon}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
            </div>
            <div class="product-price">
                <span class="price-amount">${product.price} CR</span>
                <button class="cyber-button buy-btn" data-id="${product.id}" ${balance < product.price ? 'disabled' : ''}>
                    购买
                </button>
            </div>
        `;
        
        productList.appendChild(productItem);
        
        // 添加商品项点击事件
        productItem.addEventListener('click', function(e) {
            // 如果点击的是购买按钮，不触发选择
            if (e.target.classList.contains('buy-btn')) return;
            
            selectProduct(product.id);
        });
        
        // 添加购买按钮事件
        const buyBtn = productItem.querySelector('.buy-btn');
        buyBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 防止触发商品项的选择
            purchaseProduct(product.id);
        });
    });
    
    // 默认选择第一个商品
    if (cyberProducts.length > 0) {
        selectProduct(cyberProducts[0].id);
    }
}

// 选择商品
function selectProduct(productId) {
    // 移除之前选择的商品样式
    document.querySelectorAll('.product-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // 添加当前选择的商品样式
    const selectedItem = document.querySelector(`.product-item[data-id="${productId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
        
        // 滚动到选中的商品
        selectedItem.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
    
    // 更新选中商品ID
    selectedProductId = productId;
    
    // 更新显示选中的商品名称
    const product = cyberProducts.find(p => p.id === productId);
    selectedProductElement.textContent = product.name;
    selectedProductElement.style.color = '#00ffcc';
    
    // 更新购买选中商品按钮状态
    updateBuySelectedButton();
}

// 更新购买选中商品按钮状态
function updateBuySelectedButton() {
    if (selectedProductId === null) {
        buySelectedBtn.disabled = true;
        return;
    }
    
    const product = cyberProducts.find(p => p.id === selectedProductId);
    if (product && balance >= product.price) {
        buySelectedBtn.disabled = false;
    } else {
        buySelectedBtn.disabled = true;
    }
}

// 购买商品
function purchaseProduct(productId) {
    const product = cyberProducts.find(p => p.id === productId);
    
    if (!product) return;
    
    if (balance >= product.price) {
        // 扣除余额
        balance -= product.price;
        balanceElement.textContent = balance;
        
        // 添加交易记录
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry purchase';
        const now = new Date();
        const timeString = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
        
        logEntry.innerHTML = `
            <span class="log-time">${timeString}</span>
            <span class="log-text">购买成功: ${product.name} - 花费 ${product.price} CR</span>
        `;
        
        transactionLog.appendChild(logEntry);
        transactionLog.scrollTop = transactionLog.scrollHeight;
        
        // 显示发货通知
        showNotification(`订单确认: ${product.name} 将于2199年6月6日发货至指定传送点`);
        
        // 更新购买按钮状态
        updateBuyButtons();
        updateBuySelectedButton();
        
        // 添加购买动画效果
        const productItem = document.querySelector(`.product-item[data-id="${productId}"]`);
        productItem.style.animation = "none";
        setTimeout(() => {
            productItem.style.animation = "pulse 0.5s";
        }, 10);
    } else {
        showNotification("余额不足，无法购买此商品");
    }
}

// 更新所有购买按钮状态
function updateBuyButtons() {
    document.querySelectorAll('.buy-btn').forEach(button => {
        const productId = parseInt(button.getAttribute('data-id'));
        const product = cyberProducts.find(p => p.id === productId);
        
        if (balance < product.price) {
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    });
}

// 显示通知
function showNotification(message) {
    notificationText.textContent = message;
    notification.style.display = 'block';
    
    // 重置进度条动画
    const progressBar = notification.querySelector('.notification-progress');
    progressBar.style.animation = 'none';
    setTimeout(() => {
        progressBar.style.animation = 'progressShrink 3s linear forwards';
    }, 10);
    
    // 3秒后隐藏通知
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// 充值按钮事件
rechargeBtn.addEventListener('click', function() {
    showNotification("错误: 非管理员，权限不足 (访问级别: 访客)");
    
    // 添加交易记录
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry system';
    const now = new Date();
    const timeString = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
    
    logEntry.innerHTML = `
        <span class="log-time">${timeString}</span>
        <span class="log-text">系统: 充值请求被拒绝 - 权限不足</span>
    `;
    
    transactionLog.appendChild(logEntry);
    transactionLog.scrollTop = transactionLog.scrollHeight;
    
    // 按钮震动效果
    this.style.animation = "none";
    setTimeout(() => {
        this.style.animation = "shake 0.5s";
    }, 10);
});

// 滚动按钮事件
scrollUpBtn.addEventListener('click', function() {
    productList.scrollBy({
        top: -150,
        behavior: 'smooth'
    });
    
    // 自动选择最接近视口顶部的商品
    autoSelectVisibleProduct();
});

scrollDownBtn.addEventListener('click', function() {
    productList.scrollBy({
        top: 150,
        behavior: 'smooth'
    });
    
    // 自动选择最接近视口顶部的商品
    autoSelectVisibleProduct();
});

// 自动选择最接近视口顶部的商品
function autoSelectVisibleProduct() {
    setTimeout(() => {
        const productItems = document.querySelectorAll('.product-item');
        const containerTop = productList.getBoundingClientRect().top;
        
        let closestItem = null;
        let minDistance = Infinity;
        
        productItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            const distance = Math.abs(itemTop - containerTop - 20);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestItem = item;
            }
        });
        
        if (closestItem) {
            const productId = parseInt(closestItem.dataset.id);
            selectProduct(productId);
        }
    }, 300); // 等待滚动动画完成
}

// 购买选中商品按钮事件
buySelectedBtn.addEventListener('click', function() {
    if (selectedProductId !== null) {
        purchaseProduct(selectedProductId);
    }
});

// 键盘导航支持
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        
        if (selectedProductId === null) {
            selectProduct(cyberProducts[0].id);
            return;
        }
        
        const currentIndex = cyberProducts.findIndex(p => p.id === selectedProductId);
        let newIndex;
        
        if (e.key === 'ArrowUp') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : cyberProducts.length - 1;
        } else {
            newIndex = currentIndex < cyberProducts.length - 1 ? currentIndex + 1 : 0;
        }
        
        selectProduct(cyberProducts[newIndex].id);
    } else if (e.key === 'Enter' && selectedProductId !== null) {
        purchaseProduct(selectedProductId);
    }
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 255, 204, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(0, 255, 204, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 255, 204, 0); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// 初始化应用
initializeProducts();