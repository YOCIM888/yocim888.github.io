# 🎮 YOCIM轻站-导航姬

> 一个功能丰富的二次元风格导航网站，集成了游戏中心、虚拟系统、ACGN推荐等模块，为二次元爱好者提供一站式导航服务。

## ✨ 项目特色

- 🎯 **二次元风格设计** - 精美的动漫风格界面，充满二次元元素
- 🎮 **内置小游戏** - 集成多个经典小游戏，娱乐学习两不误
- 🔧 **模块化架构** - 现代化的构建系统和开发工具链
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🔍 **智能搜索** - 强大的站内搜索功能
- 🛠️ **自动化工具** - 死链检测、构建优化等实用工具

## 🚀 快速开始

### 环境要求

- **Node.js** 14.0+ (推荐 16.0+)
- **Python** 3.7+ (用于死链检测脚本)
- 现代浏览器 (Chrome 80+, Firefox 75+, Safari 13+)

### 安装与运行

1. **克隆项目**
   ```bash
   git clone https://github.com/YOCIM888/YOCIM.git
   cd YOCIM
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
   npm run serve
   ```
   或使用其他静态服务器：
   ```bash
   npx live-server
   # 或
   python -m http.server 8080
   ```

## 📁 项目结构

```
YOCIM/
├── assets/           # 静态资源
│   ├── css/          # 样式文件
│   └── js/           # JavaScript文件
├── data/             # 数据文件
│   ├── links.csv     # 链接数据(CSV格式)
│   └── links.json    # 链接数据(JSON格式)
├── pages/            # 页面模板
│   ├── examples/     # 示例模板
│   ├── game pages/   # 游戏页面
│   └── system pages/ # 系统页面
├── scripts/          # 构建脚本
├── py/               # Python工具脚本
└── public/           # 公共资源
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
- 全站内容搜索
- 实时索引更新
- 模糊匹配和关键词高亮

## 🛠️ 工具脚本使用

### 📊 构建系统 (scripts/)

**主要构建命令：**
```bash
cd scripts

# 开发模式构建
npm run build

# 生产模式构建
npm run build:prod

# 监听模式（自动重建）
npm run dev
```

**代码质量工具：**
```bash
# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# 代码格式化
npm run format

# 检查格式化
npm run format:check
```

**测试工具：**
```bash
# 运行测试
npm run test

# 监听模式测试
npm run test:watch

# 生成测试覆盖率报告
npm test -- --coverage
```

### 🔗 死链检测 (py/)

**基本用法：**
```bash
cd py

# 检测并自动修复死链
python check_fix_dead_links.py ../data/links.json

# 只检测不修复
python check_fix_dead_links.py ../data/links.json --no-fix

# 指定输出文件
python check_fix_dead_links.py ../data/links.json -o fixed.json

# 仅生成报告
python check_fix_dead_links.py ../data/links.json --report-only
```

**高级选项：**
```bash
# 仅检测404/410错误
python check_fix_dead_links.py ../data/links.json --only-missing

# 导出死链到文件
python check_fix_dead_links.py ../data/links.json --export-missing missing.txt

# 自定义超时和重试
python check_fix_dead_links.py ../data/links.json --timeout 30 --retries 3

# 允许特定的错误码
python check_fix_dead_links.py ../data/links.json --valid-status 400
```

### 📝 数据转换工具

**JSON转CSV：**
```bash
cd scripts

# 默认UTF-8编码（推荐，Excel不乱码）
node json_to_csv.js

# GBK编码（适合老旧系统）
node json_to_csv.js --encoding gbk

# 自定义输出路径
node json_to_csv.js -o my_data.csv -p ./backup
```

**子页面生成：**
```bash
cd scripts

# 根据模板生成子页面
node Subpage_Build.js --template 模板名.html --data 数据名.json --output 输出名.html
```

## 🚀 自动化部署

### PM2进程管理
```bash
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

### 开发工作流

1. **日常开发**
   ```bash
   cd scripts
   npm run dev  # 启动监听模式
   ```

2. **代码提交前**
   ```bash
   npm run lint:fix  # 自动修复代码问题
   npm run format    # 格式化代码
   npm run test      # 运行测试
   ```

3. **发布前检查**
   ```bash
   npm run build:prod  # 生产构建
   python check_fix_dead_links.py ../data/links.json  # 检查死链
   ```

## 📊 技术栈

### 前端技术
- **HTML5** - 语义化标记
- **CSS3** - 现代化样式和动画
- **JavaScript ES6+** - 交互逻辑
- **Font Awesome** - 图标库

### 构建工具
- **Node.js** - 运行时环境
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
- **版本**: V1.01
- **GitHub**: [https://github.com/YOCIM888](https://github.com/YOCIM888)

## 📞 联系我们

- 📧 邮箱: yocim666@outlook.com
- 💬 问题反馈: [GitHub Issues](https://github.com/YOCIM888/YOCIM/issues)

---

**✨ 用二次元填满你的收藏夹！ ✨**