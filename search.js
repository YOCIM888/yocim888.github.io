// search.js
let searchIndex = [];
let fuse;  // 用于模糊搜索（可选）

// 加载索引
fetch('/search-index.json')
  .then(res => res.json())
  .then(data => {
    searchIndex = data;
    // 如果要使用 Fuse.js 进行模糊搜索，可以在这里初始化 fuse
    // fuse = new Fuse(searchIndex, { keys: ['title', 'description'] });
  })
  .catch(err => console.error('索引加载失败', err));

const searchInput = document.querySelector('.search-input');
const searchResultsContainer = document.querySelector('.search-results');

// 如果搜索结果容器不存在，可以创建一个
if (!searchResultsContainer) {
  const hero = document.querySelector('.hero');
  if (hero) {
    const div = document.createElement('div');
    div.className = 'search-results';
    hero.appendChild(div);
  }
}

searchInput.addEventListener('input', function(e) {
  const keyword = e.target.value.trim().toLowerCase();
  if (keyword === '') {
    searchResultsContainer.innerHTML = '';
    return;
  }

  // 简单过滤（你也可以用 fuse）
  const results = searchIndex.filter(item =>
    item.title.toLowerCase().includes(keyword) ||
    item.description.toLowerCase().includes(keyword)
  );

  renderResults(results);
});

function renderResults(results) {
  if (!searchResultsContainer) return;
  if (results.length === 0) {
    searchResultsContainer.innerHTML = '<p>没有找到匹配的结果</p>';
    return;
  }

  const html = results.map(item => `
    <div class="search-result-item" data-page="${item.page}" data-id="${item.id}">
      <h4>${item.title}</h4>
      <p>${item.description}</p>
      <small>来源: ${item.page}</small>
    </div>
  `).join('');

  searchResultsContainer.innerHTML = html;

  // 为每个结果项添加点击事件
  document.querySelectorAll('.search-result-item').forEach(el => {
    el.addEventListener('click', () => {
      const page = el.dataset.page;
      const id = el.dataset.id;
      // 跳转到对应页面的对应卡片
      window.location.href = `${page}#${id}`;
    });
  });
}