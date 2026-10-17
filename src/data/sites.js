// ============================================================
// 站点共享数据源
// 主内容卡片 (MainContent) 与侧边栏导航 (Sidebar) 共用，
// 新增子站点只需在此处添加一条记录。
//   variant: cyan | magenta | purple | gold （侧边栏配色）
// ============================================================
export const sites = [
  {
    key: 'workbench',
    icon: '🌐',
    title: 'Workbench',
    sub: '工作台',
    desc: '集成开发工作台，一站式项目管理与协作平台',
    url: 'https://workbench.yocim.top',
    variant: 'cyan',
  },
  {
    key: 'system',
    icon: '🖥️',
    title: 'System',
    sub: '系统中心',
    desc: '系统监控与控制中心，实时掌握各项服务运行状态',
    url: 'https://system.yocim.top',
    variant: 'magenta',
  },
  {
    key: 'tools',
    icon: '🛠️',
    title: 'Tools',
    sub: '工具集',
    desc: '实用工具集合，从代码生成到数据分析一应俱全',
    url: 'https://tools.yocim.top',
    variant: 'purple',
  },
  {
    key: 'links',
    icon: '🔗',
    title: 'Links',
    sub: '导航链',
    desc: '精选导航链接，快速访问常用资源与外部服务',
    url: 'https://links.yocim.top',
    variant: 'gold',
  },
  {
    key: 'early',
    icon: '📦',
    title: 'Early',
    sub: '早期站',
    desc: '早期网站存档，回顾最初的数字足迹与起点',
    url: 'https://early.yocim.top',
    variant: 'cyan',
  },
]
