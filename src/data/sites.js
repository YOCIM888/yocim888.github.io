// ============================================================
// 站点共享数据源
// 主内容卡片 (MainContent) 与侧边栏分类 (Sidebar) 共用。
// 新增子站点只需在此处添加一条记录，并指定所属分类 category。
//   variant: cyan | magenta | purple | gold （侧边栏配色）
// ============================================================

// 分类定义：侧边栏按分类筛选主内容卡片
export const categories = [
  { key: 'all', label: 'ALL', sub: '全部', icon: '◈', variant: 'cyan' },
  { key: 'core', label: 'CORE', sub: '核心', icon: '⚙️', variant: 'cyan' },
  { key: 'tools', label: 'TOOLS', sub: '工具', icon: '🛠️', variant: 'purple' },
  { key: 'ai', label: 'AI', sub: '智能', icon: '🤖', variant: 'magenta' },
  { key: 'games', label: 'GAMES', sub: '游戏', icon: '🎮', variant: 'gold' },
  { key: 'archive', label: 'ARCH', sub: '存档', icon: '📦', variant: 'cyan' },
]

export const sites = [
  // ---- 核心 ----
  {
    key: 'workbench',
    category: 'core',
    icon: '🌐',
    title: 'Workbench',
    sub: '工作台',
    desc: 'YOCIM BENCH 开发者小工具集，含笔记、Markdown、代码格式化、正则测试与编码转换等约 20 项',
    url: 'https://workbench.yocim.top',
    variant: 'cyan',
  },
  {
    key: 'system',
    category: 'core',
    icon: '🖥️',
    title: 'System',
    sub: '系统中心',
    desc: '赛博朋克桌面系统模拟，提供终端、文档、记事本等应用与开始菜单',
    url: 'https://system.yocim.top',
    variant: 'magenta',
  },

  // ---- 工具 ----
  {
    key: 'tools',
    category: 'tools',
    icon: '🛠️',
    title: 'Tools',
    sub: '工具集',
    desc: '35 个纯本地小工具，覆盖编解码、日期时间、生成器、设计、文本、转换与图片处理',
    url: 'https://tools.yocim.top',
    variant: 'purple',
  },
  {
    key: 'links',
    category: 'tools',
    icon: '🔗',
    title: 'Links',
    sub: '导航链',
    desc: '多分区资源导航，按 ACGN、实用工具、AI 模型、新闻资讯等 12 个分区收录站点',
    url: 'https://links.yocim.top',
    variant: 'gold',
  },
  {
    key: 'audio',
    category: 'tools',
    icon: '🎧',
    title: 'Audio-Cutter',  
    sub: '音频编辑器',
    desc: '在线音频剪辑工具，支持波形选区裁剪、淡入淡出、增益归一化、变速与合并导出',
    url: 'https://audio.yocim.top',
    variant: 'purple',
  },

  // ---- AI ----
  {
    key: 'xiyue',
    category: 'ai',
    icon: '🤖',
    title: 'XIYUE-AI',
    sub: 'AI 智能',
    desc: 'AI 对话助手，支持自定义人设与模型、链接内容识别、记忆管理和文档管理',
    url: 'https://xiyue.yocim.top',
    variant: 'magenta',
  },

  // ---- 游戏 ----
  {
    key: 'zombie',
    category: 'games',
    icon: '🧟',
    title: 'Zombie-2',
    sub: '丧尸游戏',
    desc: '末日回合制生存文字游戏，含存档位、17 套流派构筑、成就与玩家图鉴',
    url: 'https://zombie.yocim.top',
    variant: 'gold',
  },
  {
    key: 'cyber',
    category: 'games',
    icon: '🌃',
    title: 'Cyber-Market',
    sub: '赛博游戏',
    desc: '赛博朋克股票交易游戏，用朋克币买卖 12 家赛博企业股票，支持 10 日冲刺与无尽模式',
    url: 'https://cyber.yocim.top',
    variant: 'cyan',
  },
  {
    key: 'mac',
    category: 'games',
    icon: '💻',
    title: 'Rpg-Game',
    sub: '回合制游戏',
    desc: '雾都凛冬题材角色扮演游戏，可选狂战、游侠、法师等七种职业，按属性展开冒险',
    url: 'https://mac.yocim.top',
    variant: 'purple',
  },
  {
    key: 'rpg',
    category: 'games',
    icon: '⚔️',
    title: 'Rpg-Zombie-World',
    sub: '角色扮演',
    desc: '末日丧尸生存文字 RPG，含存档读档、成就、游玩时长统计与玩家工具',
    url: 'https://rpg.yocim.top',
    variant: 'magenta',
  },
  {
    key: 'TangYuan',
    category: 'games',
    icon: '🍡',
    title: 'Tang-Yuan',
    sub: '汤圆游戏',
    desc: '汤圆主题点击战斗小游戏，连续肘击击败汤圆，含商店、暴击与排行榜',
    url: 'https://tangyuan.yocim.top',
    variant: 'gold',
  },

  // ---- 存档 ----
  {
    key: 'early',
    category: 'archive',
    icon: '📦',
    title: 'Early',
    sub: '早期站',
    desc: '早期版轻量导航站，以简洁版式收录 ACGN、实用工具、AI 与资讯入口',
    url: 'https://early.yocim.top',
    variant: 'cyan',
  },
]
