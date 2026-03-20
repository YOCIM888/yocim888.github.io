const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..','pages','examples');
const templatePath = path.join(rootDir, 'example.html');
const outputPath = path.join(rootDir, '..','..','index.html');

// 检查模板文件是否存在
if (!fs.existsSync(templatePath)) {
    console.error(`❌ 错误：找不到模板文件 ${templatePath}`);
    console.error('请确保项目根目录下存在 example.html 文件。');
    process.exit(1);
}

// 读取 links.json
const linksPath = path.join(rootDir, '..','..','data','links.json');
if (!fs.existsSync(linksPath)) {
    console.error(`❌ 错误：找不到 ${linksPath}`);
    process.exit(1);
}
const rawData = fs.readFileSync(linksPath, 'utf8');
const data = JSON.parse(rawData);

// 生成卡片 HTML
let cardsHtml = '';
data.categories.forEach((cat, catIndex) => {
    const titleText = cat.subtitle ? `${cat.title} · ${cat.subtitle}` : cat.title;
    cardsHtml += `<section class="category" id="${cat.id}">\n`;
    cardsHtml += `  <h2 class="category-title"><i class="${cat.icon}"></i> ${titleText}</h2>\n`;
    cardsHtml += `  <div class="card-grid">\n`;

   cat.links.forEach((link, linkIndex) => {
    const cardId = `card-${cat.id}-${linkIndex}`;
    cardsHtml += `    <a href="${link.url}" class="card" id="${cardId}" target="_blank" rel="noopener">\n`;
    cardsHtml += `      <i class="${link.icon} card-icon"></i>\n`;
    cardsHtml += `      <h3>${link.name}</h3>\n`;
    cardsHtml += `      <p>${link.desc || ''}</p>\n`;
    cardsHtml += `      <div class="card-footer">\n`;
    // 原来的 <a> 改成 <span>，保留类名和图标文字
    cardsHtml += `        <span class="card-link"><i class="fas fa-external-link-alt"></i> 访问</span>\n`;
    cardsHtml += `        <span class="tag">${link.tag || ''}</span>\n`;
    cardsHtml += `      </div>\n`;
    cardsHtml += `    </a>\n`;
    });

    cardsHtml += `  </div>\n`;
    cardsHtml += `</section>\n`;
});

// 读取模板
let template = fs.readFileSync(templatePath, 'utf8');

// 定位 <main> 中的英雄区，然后将英雄区之后的内容替换为卡片
const mainRegex = /<main>([\s\S]*?)<\/main>/;
const match = template.match(mainRegex);
if (!match) {
    console.error('❌ 模板中未找到 <main> 标签');
    process.exit(1);
}

const mainContent = match[1];
const heroRegex = /<section class="hero">[\s\S]*?<\/section>/;
const heroMatch = mainContent.match(heroRegex);
if (!heroMatch) {
    console.error('❌ 模板中未找到 <section class="hero"> 区');
    process.exit(1);
}

const heroSection = heroMatch[0];
// 新的 main 内容 = 英雄区 + 动态卡片
const newMainContent = heroSection + cardsHtml;

// 替换整个 <main> 内容
const newHtml = template.replace(mainRegex, `<main>${newMainContent}</main>`);

// 写入 index.html
fs.writeFileSync(outputPath, newHtml, 'utf8');
console.log('✅ index.html 生成成功！');