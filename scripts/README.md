# 🔧 YOCIM 构建工具

YOCIM轻站-导航姬的现代化构建系统，提供代码检查、格式化、测试和自动化构建功能。

## � 目录

- [快速开始](#-快速开始)
- [脚本命令详解](#-脚本命令详解)
- [Python死链检测工具](#-python死链检测工具)
- [数据转换工具](#-数据转换工具)
- [开发工作流](#-开发工作流)
- [故障排除](#-故障排除)

## �🚀 快速开始

### 环境要求

- **Node.js** 14.0+ (推荐 16.0+)
- **npm** 6.0+ 或 **yarn** 1.22+
- **Python** 3.7+ (仅死链检测需要)

### 安装依赖

```bash
# 进入scripts目录
cd scripts

# 安装所有依赖
npm install

# 或使用yarn
yarn install
```

### 依赖说明

**生产依赖 (dependencies):**
- `axios` - HTTP请求库
- `chalk` - 终端颜色输出
- `cli-progress` - 命令行进度条
- `commander` - 命令行参数解析
- `csv-parse` - CSV文件解析
- `handlebars` - 模板引擎
- `p-limit` - 并发控制

**开发依赖 (devDependencies):**
- `cheerio` - HTML解析和操作
- `eslint` - 代码检查工具
- `prettier` - 代码格式化工具
- `jest` - 测试框架
- `glob` - 文件模式匹配

## 📊 脚本命令详解

### 构建命令

```bash
# 开发模式构建（默认）
npm run build
# 等同于：node build.js --once && node build-search.js

# 生产模式构建
npm run build:prod
# 等同于：node build.js --production && node build-search.js

# 监听模式（自动重建）
npm run dev
# 等同于：node build.js --watch
```

### 代码质量工具

```bash
# 检查代码问题
npm run lint

# 自动修复可修复的问题
npm run lint:fix

# 格式化所有代码文件
npm run format

# 检查代码格式化（不实际修改）
npm run format:check
```

### 测试工具

```bash
# 运行所有测试
npm run test

# 监听模式运行测试（文件变化时自动重新测试）
npm run test:watch

# 生成测试覆盖率报告
npm test -- --coverage
```

### 其他实用命令

```bash
# 清理构建文件和临时文件
npm run clean

# 启动本地开发服务器
npm run serve
# 等同于：npx http-server ../ -p 8080 -o
```

## � Python死链检测工具

### 环境准备

```bash
# 确保已安装Python 3.7+
python --version

# 安装所需依赖
cd py
pip install requests beautifulsoup4
```

### 基本用法

```bash
# 进入py目录
cd py

# 检测并自动修复死链（推荐）
python check_fix_dead_links.py ../data/links.json

# 只检测不修复（查看报告）
python check_fix_dead_links.py ../data/links.json --no-fix

# 指定输出文件
python check_fix_dead_links.py ../data/links.json -o fixed.json
```

### 高级选项

```bash
# 仅生成报告，不保存文件
python check_fix_dead_links.py ../data/links.json --report-only

# 仅检测页面不存在的链接（404/410）
python check_fix_dead_links.py ../data/links.json --only-missing

# 导出缺失链接到文件
python check_fix_dead_links.py ../data/links.json --export-missing missing.txt

# 自定义超时和重试次数
python check_fix_dead_links.py ../data/links.json --timeout 30 --retries 3

# 允许特定的HTTP状态码
python check_fix_dead_links.py ../data/links.json --valid-status 400
```

### 死链检测配置

脚本支持以下配置选项：
- `--timeout`: 请求超时时间（默认10秒）
- `--retries`: 重试次数（默认2次）
- `--concurrency`: 并发请求数（默认5个）
- `--user-agent`: 自定义User-Agent

## 📝 数据转换工具

### JSON转CSV

```bash
# 默认UTF-8编码（推荐，Excel不乱码）
node json_to_csv.js
# 输出文件：data/test.csv

# GBK编码（适合老旧系统）
node json_to_csv.js --encoding gbk

# 自定义输出位置
node json_to_csv.js -o my_data.csv -p ./backup

# 查看帮助信息
node json_to_csv.js --help
```

### CSV转JSON

```bash
# 自动转换CSV为JSON格式
node csv_to_navlinks.js
# 输入：data/links.csv
# 输出：data/links.json
```

### 子页面生成

```bash
# 根据模板生成子页面
node Subpage_Build.js --template 模板名.html --data 数据名.json --output 输出名.html

# 示例：生成小说推荐页面
node Subpage_Build.js --template example.html --data novel.json --output ../pages/novel.html
```

### 搜索索引构建

```bash
# 构建搜索索引
node build-search.js
# 输出：data/search-index.json
```

## � 开发工作流

### 日常开发流程

1. **启动开发环境**
   ```bash
   cd scripts
   npm run dev
   ```

2. **编辑CSV数据文件**
   - 修改 `../data/links.csv`
   - 构建系统会自动检测变化并重新构建

3. **代码质量检查**
   ```bash
   npm run lint:fix  # 自动修复问题
   npm run format    # 格式化代码
   ```

### 发布前检查清单

1. **运行完整测试**
   ```bash
   npm run test
   ```

2. **生产构建测试**
   ```bash
   npm run build:prod
   ```

3. **死链检测**
   ```bash
   cd py
   python check_fix_dead_links.py ../data/links.json
   ```

4. **代码质量检查**
   ```bash
   npm run lint
   npm run format:check
   ```

### 自动化部署

使用PM2进行进程管理：

```bash
# 安装PM2
npm install -g pm2

# 启动自动构建进程
pm2 start scripts/build.js --name "auto-builder"

# 启动搜索索引构建进程
pm2 start scripts/build-search.js --name "search-builder"

# 保存进程配置
pm2 save

# 查看进程状态
pm2 status

# 重启进程
pm2 restart auto-builder
```

## 🐛 故障排除

### 常见问题

**Q: npm install 失败**
A: 尝试清除缓存后重新安装：
```bash
npm cache clean --force
npm install
```

**Q: 构建失败，提示模块找不到**
A: 确保在scripts目录下运行命令，并已安装所有依赖

**Q: 死链检测脚本运行缓慢**
A: 调整并发数：`--concurrency 3` 或增加超时时间：`--timeout 60`

**Q: ESLint报错但代码正常**
A: 运行 `npm run lint:fix` 自动修复可修复的问题

**Q: 文件监听不工作**
A: 检查文件权限，确保构建脚本有读取权限

### 调试模式

启用详细日志输出：

```bash
# 构建调试
DEBUG=yocim:* npm run dev

# 死链检测调试
cd py
python check_fix_dead_links.py ../data/links.json --verbose
```

### 性能优化

- 使用 `--concurrency` 参数控制死链检测的并发数
- 构建时使用生产模式减少输出信息
- 定期运行 `npm run clean` 清理临时文件

## 📁 项目结构说明

```
scripts/
├── builders/           # 构建器模块
│   ├── htmlBuilder.js  # HTML构建器
│   └── mainBuilder.js  # 主构建器
├── utils/              # 工具模块
│   ├── logger.js       # 日志工具
│   └── fileSystem.js   # 文件系统工具
├── tests/              # 测试文件
│   ├── utils/          # 工具测试
│   ├── builders/       # 构建器测试
│   └── integration/    # 集成测试
├── config.js           # 配置管理
├── build.js            # 主构建脚本
├── build-search.js     # 搜索索引构建
├── clean.js            # 清理脚本
├── csv_to_navlinks.js  # CSV转JSON
├── json_to_csv.js      # JSON转CSV
├── Subpage_Build.js    # 子页面生成
└── scroll.js           # 滚动功能
```

## 🤝 贡献指南

欢迎贡献代码！请遵循以下规范：

1. 在提交前运行 `npm run lint:fix` 和 `npm run format`
2. 为新功能添加相应的测试
3. 更新相关文档
4. 遵循现有的代码风格

## � 获取帮助

- 查看项目根目录的README.md获取完整项目介绍
- 提交Issue到GitHub仓库
- 联系开发者: yocim666@outlook.com

---

**✨ 愉快的二次元开发体验！ ✨**