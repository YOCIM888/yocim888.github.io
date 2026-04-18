const path = require('path');

// 基础路径配置
const rootDir = path.join(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const distDir = path.join(rootDir, 'dist');
const tempDir = path.join(rootDir, 'temp');

// 文件路径配置
const paths = {
  root: rootDir,
  data: dataDir,
  dist: distDir,
  temp: tempDir,
  csv: path.join(dataDir, 'links.csv'),
  linksJson: path.join(dataDir, 'links.json'),
  template: path.join(rootDir, 'pages', 'examples', 'example.html'),
  output: path.join(rootDir, 'index.html'),
  searchIndex: path.join(dataDir, 'search-index.json')
};

// CSV转换配置
const csvOptions = {
  input: paths.csv,
  output: 'links.json',
  path: dataDir,
  encoding: 'utf-8',
  delimiter: ',',
  indent: 2,
  cid: 'category_id',
  cicon: 'category_icon',
  ctitle: 'category_title',
  csub: 'category_subtitle',
  lname: 'link_name',
  lurl: 'link_url',
  licon: 'link_icon',
  ldesc: 'link_desc',
  ltag: 'link_tag'
};

// 构建配置
const buildConfig = {
  watchInterval: 500,
  debounceDelay: 300,
  production: {
    minify: true,
    optimize: true
  },
  development: {
    minify: false,
    optimize: false
  }
};

// 日志配置
const loggerConfig = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  colors: {
    info: '\x1b[32m', // 绿色
    warn: '\x1b[33m', // 黄色
    error: '\x1b[31m', // 红色
    debug: '\x1b[36m', // 青色
    reset: '\x1b[0m'  // 重置
  }
};

module.exports = {
  paths,
  csvOptions,
  buildConfig,
  loggerConfig
};