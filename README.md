# 🎮 YOCIM轻站-导航姬

> 一个功能丰富的二次元风格导航网站，集成了游戏中心、虚拟系统、ACGN推荐等模块，为二次元爱好者提供一站式导航服务。

## ✨ 项目特色

- 🎯 **二次元风格设计** - 精美的动漫风格界面，充满二次元元素
- 🎮 **内置小游戏** - 集成多个经典小游戏，娱乐学习两不误
- 🔧 **模块化架构** - 现代化的构建系统和开发工具链
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🔍 **智能搜索** - 基于搜索索引的全站搜索，支持多关键词模糊匹配与高亮
- 🛠️ **自动化工具** - CSV驱动构建、监听自动重建、死链检测等实用工具

## 🚀 快速开始

### 环境要求

- **Node.js** 14.0+ (推荐 16.0+)
- **Python** 3.7+ (用于死链检测脚本)
- 现代浏览器 (Chrome 80+, Firefox 75+, Safari 13+)

### 安装与运行

1. **克隆项目**
   ```bash
   git clone https://github.com/YOCIM888/yocim888.github.io.git
   cd yocim888.github.io
   ```

2. **安装依赖**
   ```bash
   cd scripts
   npm install
   ```

3. **构建网站**
   ```bash
   npm run build
   ```

4. **启动本地服务器**
   ```bash
   npx live-server ..
   # 或
   cd .. && python -m http.server 8080
   ```

## 📁 项目结构

```
YOCIM/
├── assets/             # 静态资源
│   ├── css/            # 样式文件
│   │   ├── game css/   # 游戏页面样式
│   │   └── system css/ # 系统页面样式
│   └── js/             # JavaScript文件
│       ├── game js/    # 游戏逻辑脚本
│       └── system js/  # 系统功能脚本
├── data/               # 数据文件
│   ├── links.csv       # 链接数据源(CSV格式，编辑此文件更新网站)
│   ├── links.json      # 链接数据(JSON格式，由构建脚本自动生成)
│   ├── novel.json      # 轻小说数据(子页面构建源)
│   ├── comic.json      # 漫画数据(子页面构建源)
│   ├── game.json       # 游戏数据(子页面构建源)
│   ├── music.json      # 音乐数据(子页面构建源)
│   └── search-index.json # 搜索索引(由构建脚本自动生成)
├── pages/              # 页面模板
│   ├── examples/       # 构建模板(example.html为首页模板)
│   ├── game pages/     # 游戏页面
│   ├── system pages/   # 系统页面
│   ├── novel.html      # 轻小说子页面(由subpageBuilder自动生成)
│   ├── Comic.html      # 漫画子页面(由subpageBuilder自动生成)
│   ├── Game.html       # 游戏子页面(由subpageBuilder自动生成)
│   ├── music.html      # 音乐子页面(由subpageBuilder自动生成)
│   └── search.html     # 搜索结果页
├── scripts/            # 构建脚本(Node.js)
│   ├── builders/       # 构建器模块
│   │   ├── mainBuilder.js      # 主构建器(编排全流程)
│   │   ├── htmlBuilder.js      # HTML构建器
│   │   ├── subpageBuilder.js   # 子页面构建器(4个子页面)
│   │   └── searchIndexBuilder.js # 搜索索引生成器
│   ├── utils/          # 工具模块
│   ├── build.js        # 构建入口
│   ├── config.js       # 构建配置
│   ├── csv_to_navlinks.js  # CSV转JSON工具
│   ├── json_to_csv.js      # JSON转CSV工具
│   ├── search.js       # 前端搜索功能脚本
│   └── scroll.js       # 前端滚动动画脚本
├── py/                 # Python工具脚本
└── public/             # 公共资源(音频、图片，不提交Git)
```

## 🔧 核心功能

### 🎮 游戏中心
- 2048、中国象棋、国际象棋等经典游戏
- 塔防游戏、射击游戏、冒险游戏
- 支持虚拟手柄操作

### 💻 虚拟系统
- 模拟桌面环境
- 文件管理器、记事本、音乐播放器
- 个性化设置面板

### 📚 ACGN推荐
- 动漫、漫画、游戏、小说推荐
- 实时更新的资源库
- 智能分类和搜索

### 🔍 智能搜索
- 基于 `search-index.json` 的全站搜索
- 支持多关键词模糊匹配（标题、描述、标签、分类）
- 搜索结果关键词高亮
- 首页搜索跳转搜索结果页，搜索页内联展示

## 🛠️ 构建系统

### 构建流程

编辑 `data/links.csv` → 运行构建 → 自动生成以下文件：

```
links.csv ──→ links.json ──→ index.html (首页)
                          ──→ search-index.json (搜索索引)

JSON数据 ──→ subpageBuilder ──→ novel.html  (轻小说子页面)
                              ──→ Comic.html (漫画子页面)
                              ──→ Game.html  (游戏子页面)
                              ──→ music.html (音乐子页面)
```

1. **CSV → JSON**：解析 CSV 数据，按分类分组生成 `links.json`
2. **JSON → HTML**：读取模板和数据，生成 `index.html`
3. **JSON → 搜索索引**：提取标题、描述、链接、标签等，生成 `search-index.json`
4. **JSON → 子页面**：读取 `novel.json`/`comic.json`/`game.json`/`music.json`，使用3套模板（manga/game/music）生成4个子页面HTML

### 构建命令

```bash
cd scripts

# 单次构建（默认模式）
npm run build

# 监听模式（修改CSV后自动重建）
npm run build:watch

# 生产模式构建
npm run build:prod
```

### 监听模式

监听模式使用 `fs.watch` API 监听 `data/` 目录变化，当检测到 CSV 文件修改时自动触发完整重建流程：

- 优先使用 `fs.watch`（高效、实时）
- 若 `fs.watch` 不可用，自动回退到轮询模式
- 内置防抖机制（300ms），避免频繁触发
- 构建锁防止重入，确保同一时间只有一个构建在运行

### 子页面构建系统

子页面由 `subpageBuilder.js` 从 JSON 数据自动生成，支持3套模板：

| 模板 | 数据源 | 输出页面 | 说明 |
|------|--------|----------|------|
| `manga` | `novel.json` | `pages/novel.html` | 轻小说推荐卡片 |
| `manga` | `comic.json` | `pages/Comic.html` | 漫画推荐卡片 |
| `game` | `game.json` | `pages/Game.html` | 游戏推荐卡片（3A/端游/手游） |
| `music` | `music.json` | `pages/music.html` | 音乐推荐卡片 |

- 编辑对应 JSON 文件后运行 `npm run build` 即可更新子页面
- 每条数据支持 `link` 字段，卡片可点击跳转外部链接
- 子页面构建失败不影响主流程（首页+搜索索引）

### 数据转换工具

**CSV转JSON：**
```bash
cd scripts
node csv_to_navlinks.js ../data/links.csv -o links.json -p ../data
```

**JSON转CSV：**
```bash
cd scripts
node json_to_csv.js
```

### 🔗 死链检测 (py/)

```bash
cd py

# 检测并自动修复死链
python check_fix_dead_links.py ../data/links.json

# 只检测不修复
python check_fix_dead_links.py ../data/links.json --no-fix

# 仅生成报告
python check_fix_dead_links.py ../data/links.json --report-only
```

## 🚀 自动化部署

本项目使用 GitHub Pages 部署，推送至 `main` 分支后自动发布。

### 开发工作流

1. **日常开发**
   ```bash
   cd scripts
   npm run build:watch  # 启动监听模式，修改CSV自动重建
   ```

2. **发布上线**
   ```bash
   cd scripts && npm run build  # 构建网站
   cd .. && git add .           # 暂存变更
   git commit -m "更新说明"      # 提交
   git push origin main         # 推送到远程
   ```

3. **死链维护**
   ```bash
   cd py
   python check_fix_dead_links.py ../data/links.json  # 检查死链
   cd ../scripts && npm run build                      # 重新构建
   ```

## 📊 技术栈

### 前端技术
- **HTML5** - 语义化标记
- **CSS3** - 现代化样式和动画
- **JavaScript ES6+** - 交互逻辑
- **Font Awesome** - 图标库

### 构建工具
- **Node.js** - 运行时环境
- **csv-parse** - CSV解析
- **cheerio** - HTML处理
- **chalk** - 终端彩色输出
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Jest** - 测试框架

### Python工具
- **requests** - HTTP请求
- **concurrent.futures** - 并发处理

## 🤝 贡献指南

我们欢迎各种形式的贡献！

### 开发流程
1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 代码规范
- 遵循ESLint配置的代码风格
- 使用Prettier进行代码格式化
- 为新增功能添加相应的测试
- 更新相关文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 开发团队

- **作者**: YOCIM
- **版本**: V1.0.3
- **GitHub**: [https://github.com/YOCIM888](https://github.com/YOCIM888)

## 📞 联系我们

- 📧 邮箱: yocim666@outlook.com
- 💬 问题反馈: [GitHub Issues](https://github.com/YOCIM888/YOCIM/issues)

---

**✨ 用二次元填满你的收藏夹！ ✨**
