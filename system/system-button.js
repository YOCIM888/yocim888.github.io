// 系统切换按钮功能
document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('system-toggle-btn');
  const statusText = document.querySelector('.status-text');
  const statusLed = document.querySelector('.status-led');
  
  // 检查当前系统状态（通过本地存储或URL参数）
  let isPrimarySystem = true;
  
  // 尝试从本地存储获取系统状态
  const storedSystem = localStorage.getItem('cyberSystem');
  if (storedSystem) {
    isPrimarySystem = storedSystem === 'primary';
  }
  
  // 初始化按钮状态
  updateButtonState();
  
  // 点击按钮事件
  toggleBtn.addEventListener('click', function() {
    // 添加点击效果
    this.classList.add('active');
    
    // 播放点击声音（如果有）
    playClickSound();
    
    // 短暂延迟后切换系统
    setTimeout(() => {
      toggleSystem();
    }, 300);
    
    // 短暂延迟后移除active类，为下一次点击做准备
    setTimeout(() => {
      this.classList.remove('active');
    }, 1000);
  });
  
  // 切换系统函数
  function toggleSystem() {
    isPrimarySystem = !isPrimarySystem;
    
    // 更新按钮状态
    updateButtonState();
    
    // 保存到本地存储
    localStorage.setItem('cyberSystem', isPrimarySystem ? 'primary' : 'alternate');
    
    // 根据当前系统执行跳转
    if (isPrimarySystem) {
      // 如果当前是主要系统，跳转到备用系统页面
      // 这里假设备用系统页面是system.html
      window.location.href = 'system.html';
    } else {
      // 如果当前是备用系统，跳转回主要系统页面
      // 这里假设主要系统页面是index.html
      window.location.href = 'index.html';
    }
  }
  
  // 更新按钮状态显示
  function updateButtonState() {
    if (isPrimarySystem) {
      toggleBtn.querySelector('.cyber-subtext').textContent = '';
      statusText.textContent = '';
      statusLed.style.backgroundColor = '#00ff00';
      statusLed.style.boxShadow = '0 0 8px #00ff00';
    } else {
      toggleBtn.querySelector('.cyber-subtext').textContent = '';
      statusText.textContent = '';
      statusLed.style.backgroundColor = '#ff9900';
      statusLed.style.boxShadow = '0 0 8px #ff9900';
    }
  }
  
  // 播放点击声音（可选）
  function playClickSound() {
    // 创建一个简单的点击音效
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
      console.log("音频上下文不支持或已禁用");
    }
  }
  
  // 添加键盘快捷键支持（按T键切换系统）
  document.addEventListener('keydown', function(event) {
    // 检查是否按下了'T'键且没有在输入框中
    if (event.key === 't' || event.key === 'T') {
      const activeElement = document.activeElement;
      const isInput = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';
      
      if (!isInput) {
        event.preventDefault();
        toggleBtn.click();
      }
    }
  });
});