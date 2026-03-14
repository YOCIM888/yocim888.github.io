// search.js
let searchIndex = [];

// 获取 URL 参数
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 加载索引
fetch('/search-index.json')
    .then(res => res.json())
    .then(data => {
        searchIndex = data;

        // 判断当前页面是否是搜索结果页
        if (window.location.pathname.includes('search.html')) {
            // 搜索结果页：从 URL 获取关键词并渲染
            const keyword = getQueryParam('q');
            if (keyword) {
                document.querySelector('.search-input').value = keyword;
                performSearch(keyword);
            }
        } else {
            // 首页：初始化实时搜索
            initRealTimeSearch();
        }
    })
    .catch(err => console.error('索引加载失败', err));

// 执行搜索并渲染结果（用于搜索结果页）
function performSearch(keyword) {
    const resultsContainer = document.getElementById('searchResultsPage');
    if (!resultsContainer) return;

    const lowerKeyword = keyword.toLowerCase();
    const results = searchIndex.filter(item =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.description.toLowerCase().includes(lowerKeyword)
    );

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>没有找到相关内容</p>';
        return;
    }

    const html = results.map(item => `
        <div class="result-card" data-page="${item.page}" data-id="${item.id}">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="source">来源：${item.page}</div>
        </div>
    `).join('');
    resultsContainer.innerHTML = html;

    // 为结果添加点击跳转
    document.querySelectorAll('.result-card').forEach(card => {
        card.addEventListener('click', () => {
            const page = card.dataset.page;
            const id = card.dataset.id;
            window.location.href = `${page}#${id}`;
        });
    });
}

// 初始化首页实时搜索
function initRealTimeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResultsContainer = document.querySelector('.search-results');

    if (!searchInput || !searchResultsContainer) return;

    searchInput.addEventListener('input', function(e) {
        const keyword = e.target.value.trim().toLowerCase();
        if (keyword === '') {
            searchResultsContainer.innerHTML = '';
            return;
        }

        const results = searchIndex.filter(item =>
            item.title.toLowerCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword)
        );

        renderRealTimeResults(results);
    });

    function renderRealTimeResults(results) {
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

        document.querySelectorAll('.search-result-item').forEach(el => {
            el.addEventListener('click', () => {
                const page = el.dataset.page;
                const id = el.dataset.id;
                window.location.href = `${page}#${id}`;
            });
        });
    }
}

// 处理搜索提交（供表单使用）
window.handleSearchSubmit = function(event) {
    event.preventDefault();
    const keyword = document.querySelector('.search-input').value.trim();
    if (keyword === '') return false;
    window.location.href = `/search.html?q=${encodeURIComponent(keyword)}`;
    return false;
};