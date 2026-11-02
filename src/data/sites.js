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
    desc: '集成开发工作台，一站式项目管理与协作平台',
    url: 'https://workbench.yocim.top',
    variant: 'cyan',
  },
  {
    key: 'system',
    category: 'core',
    icon: '🖥️',
    title: 'System',
    sub: '系统中心',
    desc: '系统监控与控制中心，实时掌握各项服务运行状态',
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
    desc: '实用工具集合，从代码生成到数据分析一应俱全',
    url: 'https://tools.yocim.top',
    variant: 'purple',
  },
  {
    key: 'links',
    category: 'tools',
    icon: '🔗',
    title: 'Links',
    sub: '导航链',
    desc: '精选导航链接，快速访问常用资源与外部服务',
    url: 'https://links.yocim.top',
    variant: 'gold',
  },
  {
    key: 'audio',
    category: 'tools',
    icon: '🎧',
    title: 'Audio-Cutter',  
    sub: '音频编辑器',
    desc: '在线音频编辑器，剪辑、混音与音效处理一站完成',
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
    desc: 'AI 智能助手，对话问答、内容生成与灵感激发',
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
    desc: '末日丧尸生存挑战，考验策略、资源与反应',
    url: 'https://zombie.yocim.top',
    variant: 'gold',
  },
  {
    key: 'cyber',
    category: 'games',
    icon: '🌃',
    title: 'Cyber-Market',
    sub: '赛博游戏',
    desc: '赛博朋克风格的霓虹虚拟市场，光影交错',
    url: 'https://cyber.yocim.top',
    variant: 'cyan',
  },
  {
    key: 'mac',
    category: 'games',
    icon: '💻',
    title: 'Rpg-Game',
    sub: '回合制游戏',
    desc: '回合制策略游戏，休息与策略',
    url: 'https://mac.yocim.top',
    variant: 'purple',
  },
  {
    key: 'rpg',
    category: 'games',
    icon: '⚔️',
    title: 'Rpg-Zombie-World',
    sub: '角色扮演',
    desc: '角色扮演冒险，沉浸式剧情与成长旅程',
    url: 'https://rpg.yocim.top',
    variant: 'magenta',
  },
  {
    key: 'TangYuan',
    category: 'games',
    icon: '🍡',
    title: 'Tang-Yuan',
    sub: '汤圆游戏',
    desc: '汤圆主题治愈系小游戏，轻松休闲解压',
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
    desc: '早期网站存档，回顾最初的数字足迹与起点',
    url: 'https://early.yocim.top',
    variant: 'cyan',
  },
]
