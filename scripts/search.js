let searchIndex = [];
let searchIndexLoaded = false;
let previewDebounceTimer = null;

function getSearchIndexPath() {
    var path = window.location.pathname;
    if (path.includes('/pages/')) {
        return '../data/search-index.json';
    }
    return 'data/search-index.json';
}

function loadSearchIndex() {
    return fetch(getSearchIndexPath())
        .then(res => {
            if (!res.ok) throw new Error('搜索索引加载失败: ' + res.status);
            return res.json();
        })
        .then(data => {
            searchIndex = data;
            searchIndexLoaded = true;
            return searchIndex;
        })
        .catch(err => {
            console.error('加载搜索索引出错:', err);
            return [];
        });
}

function performSearch(query) {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    const keywords = q.split(/\s+/);

    return searchIndex.filter(item => {
        const title = (item.title || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const tag = (item.tag || '').toLowerCase();
        const category = (item.category || '').toLowerCase();

        return keywords.every(kw =>
            title.includes(kw) ||
            desc.includes(kw) ||
            tag.includes(kw) ||
            category.includes(kw)
        );
    });
}

function showSearchPreview(query) {
    let container = document.getElementById('searchPreview');
    if (!container) return;

    if (!query || !query.trim()) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }

    var results = performSearch(query);
    if (results.length === 0) {
        container.innerHTML = '<div class="preview-empty">未找到相关内容</div>';
        container.style.display = 'block';
        return;
    }

    var html = '';
    results.forEach(function(item, idx) {
        html += '<div class="preview-item" data-title="' + escapeHtml(item.title).replace(/"/g, '&quot;') + '" data-category="' + escapeHtml(item.category || '').replace(/"/g, '&quot;') + '">';
        html += '  <div class="preview-item-title">' + highlightText(item.title, query) + '</div>';
        html += '  <div class="preview-item-desc">' + escapeHtml((item.description || '').substring(0, 60)) + (item.description && item.description.length > 60 ? '...' : '') + '</div>';
        html += '  <div class="preview-item-meta">';
        if (item.tag) html += '<span class="preview-tag">' + escapeHtml(item.tag) + '</span>';
        html += '<span class="preview-category">' + escapeHtml(item.category || '首页') + '</span>';
        html += '  </div>';
        html += '</div>';
    });

    container.innerHTML = html;
    container.style.display = 'block';

    container.querySelectorAll('.preview-item').forEach(function(el) {
        el.addEventListener('click', function() {
            var title = el.getAttribute('data-title');
            var category = el.getAttribute('data-category');
            jumpToCard(title, category);
            container.style.display = 'none';
        });
    });
}

function jumpToCard(title, category) {
    var cards = document.querySelectorAll('.card');
    var targetCard = null;

    cards.forEach(function(card) {
        var h3 = card.querySelector('h3');
        if (h3 && h3.textContent.trim() === title) {
            targetCard = card;
        }
    });

    if (!targetCard) {
        cards.forEach(function(card) {
            var h3 = card.querySelector('h3');
            if (h3 && h3.textContent.trim().includes(title)) {
                targetCard = card;
            }
        });
    }

    if (!targetCard) {
        var grid = document.querySelector('.card-grid');
        if (grid && grid.classList.contains('collapsed')) {
            var toggleBtn = grid.querySelector('.toggle-cards-btn');
            if (toggleBtn) toggleBtn.click();
        }
        cards.forEach(function(card) {
            var h3 = card.querySelector('h3');
            if (h3 && h3.textContent.trim().includes(title)) {
                targetCard = card;
            }
        });
    }

    if (targetCard) {
        var grid = targetCard.closest('.card-grid');
        if (grid && grid.classList.contains('collapsed')) {
            var toggleBtn = grid.querySelector('.toggle-cards-btn');
            if (toggleBtn) toggleBtn.click();
        }

        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        targetCard.classList.remove('highlight');
        void targetCard.offsetWidth;
        targetCard.classList.add('highlight');

        setTimeout(function() {
            targetCard.classList.remove('highlight');
        }, 2000);
    }
}

function renderResults(results, query, container) {
    if (!container) return;

    if (results.length === 0) {
        container.innerHTML = '<p class="search-empty">未找到与「' + escapeHtml(query) + '」相关的内容</p>';
        return;
    }

    let html = '<p class="search-count">找到 ' + results.length + ' 个结果</p>';

    results.forEach(item => {
        html += '<a href="' + escapeHtml(item.link) + '" class="result-card" target="_blank" rel="noopener">';
        html += '  <div class="result-card-body">';
        html += '    <h3 class="result-title">' + highlightText(item.title, query) + '</h3>';
        html += '    <p class="result-desc">' + highlightText(item.description || '', query) + '</p>';
        if (item.tag) {
            html += '    <span class="result-tag">' + escapeHtml(item.tag) + '</span>';
        }
        html += '    <div class="result-source">来源: ' + escapeHtml(item.category || '首页') + '</div>';
        html += '  </div>';
        html += '</a>';
    });

    container.innerHTML = html;
}

function handleSearchSubmit(event) {
    event.preventDefault();

    const input = event.target.querySelector('.search-input');
    if (!input) return false;

    const query = input.value.trim();
    if (!query) return false;

    var preview = document.getElementById('searchPreview');
    if (preview) preview.style.display = 'none';

    if (!searchIndexLoaded) {
        loadSearchIndex().then(() => {
            executeSearch(query);
        });
    } else {
        executeSearch(query);
    }

    return false;
}

function executeSearch(query) {
    var isSearchPage = window.location.pathname.includes('search.html');

    if (isSearchPage) {
        var container = document.getElementById('searchResultsPage');
        var results = performSearch(query);
        renderResults(results, query, container);
    } else {
        window.location.href = 'pages/search.html?q=' + encodeURIComponent(query);
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function highlightText(text, query) {
    if (!text || !query) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const keywords = query.trim().split(/\s+/);
    let result = escaped;
    keywords.forEach(kw => {
        if (!kw) return;
        const regex = new RegExp('(' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        result = result.replace(regex, '<mark>$1</mark>');
    });
    return result;
}

document.addEventListener('DOMContentLoaded', function() {
    loadSearchIndex();

    var searchInput = document.querySelector('.search-input');
    if (searchInput) {
        var form = searchInput.closest('form');
        if (form) {
            var preview = document.createElement('div');
            preview.id = 'searchPreview';
            preview.className = 'search-preview';
            preview.style.display = 'none';
            form.style.position = 'relative';
            form.appendChild(preview);
        }

        searchInput.addEventListener('input', function() {
            clearTimeout(previewDebounceTimer);
            var val = searchInput.value.trim();
            previewDebounceTimer = setTimeout(function() {
                if (!searchIndexLoaded) {
                    loadSearchIndex().then(function() {
                        showSearchPreview(val);
                    });
                } else {
                    showSearchPreview(val);
                }
            }, 200);
        });

        searchInput.addEventListener('focus', function() {
            var val = searchInput.value.trim();
            if (val) {
                showSearchPreview(val);
            }
        });

        document.addEventListener('click', function(e) {
            var preview = document.getElementById('searchPreview');
            if (preview && !preview.contains(e.target) && e.target !== searchInput) {
                preview.style.display = 'none';
            }
        });
    }

    var isSearchPage = window.location.pathname.includes('search.html');
    if (isSearchPage) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        if (query) {
            const input = document.querySelector('.search-input');
            if (input) input.value = query;

            if (searchIndexLoaded) {
                executeSearch(query);
            } else {
                loadSearchIndex().then(() => executeSearch(query));
            }
        }
    }
});
