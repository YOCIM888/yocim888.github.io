const fs = require('fs');

// 读取 links.json
const rawData = fs.readFileSync('./links.json', 'utf8');
const data = JSON.parse(rawData);

let navHtml = '';

data.categories.forEach(cat => {
    // 拼接分类标题（如果有副标题）
    const titleText = cat.subtitle ? `${cat.title} · ${cat.subtitle}` : cat.title;
    navHtml += `<section class="category" id="${cat.id}">\n`;
    navHtml += `  <h2 class="category-title"><i class="${cat.icon}"></i> ${titleText}</h2>\n`;
    navHtml += `  <div class="card-grid">\n`;

    cat.links.forEach(link => {
        navHtml += `    <div class="card">\n`;
        navHtml += `      <i class="${link.icon} card-icon"></i>\n`;
        navHtml += `      <h3>${link.name}</h3>\n`;
        navHtml += `      <p>${link.desc || ''}</p>\n`;
        navHtml += `      <div class="card-footer">\n`;
        navHtml += `        <a href="${link.url}" class="card-link" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> 访问</a>\n`;
        navHtml += `        <span class="tag">${link.tag || ''}</span>\n`;
        navHtml += `      </div>\n`;
        navHtml += `    </div>\n`;
    });

    navHtml += `  </div>\n`;
    navHtml += `</section>\n`;
});

// 读取 index.html 模板（注意：需要先在 index.html 中放置占位符）
let html = fs.readFileSync('./index.html', 'utf8');

// 将 <!-- NAV_CONTENT --> 替换为生成的导航内容
html = html.replace('<!-- NAV_CONTENT -->', navHtml);

// 写回 index.html
fs.writeFileSync('./index.html', html, 'utf8');

console.log('✅ 导航生成成功！');