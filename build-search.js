const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');

// 定义卡片选择器（根据你的页面结构添加更多类名）
const CARD_SELECTORS = [
  '.card',           // index.html 主页卡片
  '.manga-card',     // Comic.html 漫画卡片
  '.game-card',      // Game.html 游戏卡片
  '.novel-card',     // novel.html 轻小说卡片
  '.song-card',      // music.html 音乐卡片
  // 如果有其他卡片类名，继续添加
];

// 存储所有卡片信息的数组
const searchIndex = [];

// 获取所有 HTML 文件（排除 node_modules 和已经处理过的文件）
const files = glob.sync('**/*.html', {
  ignore: ['node_modules/**', 'dist/**']  // 根据需要调整
});

files.forEach(file => {
  console.log(`处理文件: ${file}`);
  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html);
  let modified = false;  // 标记是否修改了 HTML（需要写回）

  // 对每种卡片选择器进行查找
  CARD_SELECTORS.forEach(selector => {
    $(selector).each((index, element) => {
      const $card = $(element);
      
      // 如果卡片还没有 id，则生成一个唯一 id
      if (!$card.attr('id')) {
        // 生成 id: 文件名 + 序号，例如 card-comic-0
        const baseName = path.basename(file, '.html').replace(/[^a-zA-Z0-9]/g, '-');
        const cardId = `card-${baseName}-${index}`;
        $card.attr('id', cardId);
        modified = true;
      }

      // 提取卡片信息
      const id = $card.attr('id');
      const title = $card.find('h3, .manga-title, .game-title, .novel-card .title, .song-title').first().text().trim();
      const desc = $card.find('p, .recommend-text, .description, .reason-text').first().text().trim();
      // 尝试获取卡片内的链接（如果有）
      const link = $card.find('a[href]').first().attr('href') || '';
      
      // 如果标题为空则跳过
      if (!title) return;

      searchIndex.push({
        id,
        title,
        description: desc,
        link,                    // 可能是外部链接，也可能是空
        page: file,              // 卡片所在的页面文件路径
        // 可以额外添加分类信息（如果有）
      });
    });
  });

  // 如果修改了 HTML，写回文件
  if (modified) {
    fs.writeFileSync(file, $.html(), 'utf8');
    console.log(`  已更新文件: ${file}`);
  }
});

// 将索引写入 search-index.json
fs.writeFileSync('./search-index.json', JSON.stringify(searchIndex, null, 2), 'utf8');
console.log(`✅ 搜索索引生成成功，共 ${searchIndex.length} 条卡片信息。`);