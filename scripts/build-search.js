const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');

// 1. 定义项目根目录（scripts 的上一级）
const rootDir = path.join(__dirname, '..');

const CARD_SELECTORS = [
  '.card',           // index.html 主页卡片
  '.manga-card',     // Comic.html 漫画卡片
  '.game-card',      // Game.html 游戏卡片
  '.novel-card',     // novel.html 轻小说卡片
  '.song-card',      // music.html 音乐卡片
  '.minigames-card', // Game-center.html 小游戏卡片
];

const searchIndex = [];

// 2. 设置 glob 的 cwd 为根目录，从根目录开始递归扫描所有 .html
const files = glob.sync('**/*.html', {
  cwd: rootDir,
  ignore: ['node_modules/**', 'dist/**']
});

files.forEach(file => {
  // 3. 构建完整的文件路径（用于读取和写入）
  const filePath = path.join(rootDir, file);
  console.log(`处理文件: ${filePath}`);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);
  let modified = false;

  CARD_SELECTORS.forEach(selector => {
    $(selector).each((index, element) => {
      const $card = $(element);

      // 为卡片生成唯一 id（如果还没有）
      if (!$card.attr('id')) {
        // 使用相对于根目录的路径生成 id，避免重复
        const baseName = path.basename(file, '.html').replace(/[^a-zA-Z0-9]/g, '-');
        const cardId = `card-${baseName}-${index}`;
        $card.attr('id', cardId);
        modified = true;
      }

      const id = $card.attr('id');
      let title = '';
      let desc = '';

      // 根据选择器提取标题和描述
      if (selector === '.minigames-card') {
        title = $card.find('.card-name').first().text().trim();
        desc = $card.find('.card-emoji').first().text().trim() || '';
      } else {
        title = $card.find('h3, .manga-title, .game-title, .novel-card .title, .song-title').first().text().trim();
        desc = $card.find('p, .recommend-text, .description, .reason-text').first().text().trim();
      }

      if (!title) return;

      const link = $card.find('a[href]').first().attr('href') || '';

      // 构建绝对路径：首页用 "/"，其他页面用 "/pages/xxx.html" 格式
      let pagePath;
      if (file === 'index.html') {
        pagePath = '/';
      } else {
        // 确保路径以 "/" 开头
        pagePath = '/' + file;
      }

      searchIndex.push({
        id,
        title,
        description: desc,
        link,
        page: pagePath, // 使用绝对路径
      });
    });
  });

  if (modified) {
    // 4. 写入修改后的 HTML（覆盖原文件）
    fs.writeFileSync(filePath, $.html(), 'utf8');
    console.log(`  已更新文件: ${filePath}`);
  }
});

// 5. 确保 data 目录存在
const dataDir = path.join(rootDir, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 6. 将搜索索引写入根目录下的 data 文件夹
fs.writeFileSync(
  path.join(dataDir, 'search-index.json'),
  JSON.stringify(searchIndex, null, 2),
  'utf8'
);

console.log(`✅ 搜索索引生成成功，已保存至 data/search-index.json，共 ${searchIndex.length} 条卡片信息。`);