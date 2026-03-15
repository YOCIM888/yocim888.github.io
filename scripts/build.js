const fs = require('fs');
const path = require('path');

// 获取项目根目录（scripts 的上一级）
const rootDir = path.join(__dirname, '..');

// 读取 links.json（位于根目录）
const rawData = fs.readFileSync(path.join(rootDir, 'links.json'), 'utf8');
const data = JSON.parse(rawData);

let navHtml = '';

data.categories.forEach((cat, catIndex) => {
    const titleText = cat.subtitle ? `${cat.title} · ${cat.subtitle}` : cat.title;
    navHtml += `<section class="category" id="${cat.id}">\n`;
    navHtml += `  <h2 class="category-title"><i class="${cat.icon}"></i> ${titleText}</h2>\n`;
    navHtml += `  <div class="card-grid">\n`;

    cat.links.forEach((link, linkIndex) => {
        // 生成唯一 id，格式：card-分类id-序号
        const cardId = `card-${cat.id}-${linkIndex}`;
        navHtml += `    <div class="card" id="${cardId}">\n`;
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

// 读取 index.html 模板（位于根目录）
let html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
html = html.replace('<!-- NAV_CONTENT -->', navHtml);
fs.writeFileSync(path.join(rootDir, 'index.html'), html, 'utf8');

console.log('✅ index.html 生成成功，卡片已添加 id 属性。');