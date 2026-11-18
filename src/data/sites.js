// ============================================================
// 站点共享数据源
// 主内容卡片 (MainContent) 与侧边栏搜索 (Sidebar) 共用。
// 数组顺序即为首页卡片展示顺序。
//   variant: cyan | magenta | purple | gold （卡片配色）
// ============================================================

// 分类定义：仅用于卡片标签展示
export const categories = [
  { key: 'all', label: 'ALL', sub: '全部', icon: '◈', variant: 'cyan' },
  { key: 'core', label: 'CORE', sub: '核心', icon: '⚙️', variant: 'cyan' },
  { key: 'tools', label: 'TOOLS', sub: '工具', icon: '🛠️', variant: 'purple' },
  { key: 'ai', label: 'AI', sub: '智能', icon: '🤖', variant: 'magenta' },
  { key: 'games', label: 'GAMES', sub: '游戏', icon: '🎮', variant: 'gold' },
  { key: 'archive', label: 'ARCH', sub: '存档', icon: '📦', variant: 'cyan' },
]

export const sites = [
  {
    key: 'agent',
    category: 'ai',
    icon: '🤖',
    title: 'YOCIM AGENT',
    sub: 'AI 编程助手',
    desc: '本地优先的桌面 AI 编程助手，多模型接入、工具调用与审批、内置编辑器，会话与密钥全部留在本地',
    url: 'https://agent.yocim.top',
    variant: 'magenta',
  },
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
    key: 'zombie',
    category: 'games',
    icon: '🧟',
    title: 'Zombie-2',
    sub: '丧尸游戏',
    desc: '末日回合制生存文字游戏，含存档位、17 套流派构筑、成就与玩家图鉴',
    url: 'https://zombie.yocim.top',
    variant: 'gold',
  },
]
