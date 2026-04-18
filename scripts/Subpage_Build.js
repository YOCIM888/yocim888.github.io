// Subpage_Build.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Handlebars = require('handlebars');

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 基础路径（相对于项目根目录）
const TEMPLATE_DIR = path.join(__dirname, '..', 'pages', 'examples');
const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_DIR = path.join(__dirname, '..', 'pages');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 解析命令行参数 (--template, --data, --output)
const args = process.argv.slice(2);
let templateName = null;
let dataName = null;
let outputName = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--template' || args[i] === '-t') {
    templateName = args[++i];
  } else if (args[i] === '--data' || args[i] === '-d') {
    dataName = args[++i];
  } else if (args[i] === '--output' || args[i] === '-o') {
    outputName = args[++i];
  }
}

// 交互式询问
async function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

(async function main() {
  try {
    if (!templateName) {
      templateName = await askQuestion('请输入模板文件名（例如：manga_list_template.html）：');
    }
    if (!templateName.endsWith('.html')) templateName += '.html';

    if (!dataName) {
      dataName = await askQuestion('请输入数据文件名（例如：manga_list.json）：');
    }
    if (!dataName.endsWith('.json')) dataName += '.json';

    if (!outputName) {
      outputName = await askQuestion('请输入输出文件名（例如：manga_list_2026.html）：');
    }
    if (!outputName.endsWith('.html')) outputName += '.html';

    const templatePath = path.join(TEMPLATE_DIR, templateName);
    const dataPath = path.join(DATA_DIR, dataName);
    const outputPath = path.join(OUTPUT_DIR, outputName);

    // 读取模板
    if (!fs.existsSync(templatePath)) {
      throw new Error(`模板文件不存在：${templatePath}`);
    }
    const templateSource = fs.readFileSync(templatePath, 'utf-8');

    // 读取数据
    if (!fs.existsSync(dataPath)) {
      throw new Error(`数据文件不存在：${dataPath}`);
    }
    const dataRaw = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(dataRaw);

    // 编译 Handlebars 模板
    const template = Handlebars.compile(templateSource);
    const filledHtml = template(data);

    // 写入输出
    fs.writeFileSync(outputPath, filledHtml, 'utf-8');
    console.log(`✅ 子页面已生成：${outputPath}`);
  } catch (error) {
    console.error('❌ 发生错误：', error.message);
  } finally {
    rl.close();
  }
})();