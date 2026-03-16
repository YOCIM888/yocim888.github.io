// scroll.js
(function() {
  function scrollToCard() {
    const hash = window.location.hash;
    if (!hash) return;

    const element = document.getElementById(hash.substring(1)); // 去掉 # 号
    if (element) {
      // 滚动到元素
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // 添加高亮类（可在 CSS 中定义 .highlight 样式）
      element.classList.add('highlight');
      // 2秒后移除高亮
      setTimeout(() => {
        element.classList.remove('highlight');
      }, 2000);
    }
  }

  // 页面加载和 hash 变化时都尝试定位
  window.addEventListener('load', scrollToCard);
  window.addEventListener('hashchange', scrollToCard);
})();