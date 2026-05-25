#!/usr/bin/env node

const MainBuilder = require('./builders/mainBuilder');
const logger = require('./utils/logger');

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    watch: false,
    production: false,
    once: false
  };

  args.forEach(arg => {
    switch (arg) {
      case '--watch':
      case '-w':
        options.watch = true;
        break;
      case '--production':
      case '--prod':
        options.production = true;
        break;
      case '--once':
      case '--build':
        options.once = true;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
      case '--version':
      case '-v':
        showVersion();
        process.exit(0);
        break;
    }
  });

  // 如果没有指定模式，默认使用once模式
  if (!options.watch && !options.once) {
    options.once = true;
  }

  return options;
}

// 显示帮助信息
function showHelp() {
  console.log(`
YOCIM 构建工具

用法: node build.js [选项]

选项:
  -w, --watch       监听模式，自动重建
  --once, --build   单次构建模式（默认）
  --prod, --production  生产模式构建
  -h, --help        显示此帮助信息
  -v, --version     显示版本信息

示例:
  node build.js --watch        # 启动监听模式
  node build.js --production   # 生产模式单次构建
  node build.js                # 默认单次构建
  `);
}

// 显示版本信息
function showVersion() {
  const packageJson = require('./package.json');
  console.log(`YOCIM构建工具 v${packageJson.version}`);
}

// 主函数
async function main() {
  try {
    const options = parseArgs();
    
    logger.start(`YOCIM构建工具启动`);
    logger.info(`模式: ${options.watch ? '监听' : '单次'}`);
    logger.info(`环境: ${options.production ? '生产' : '开发'}`);
    
    const builder = new MainBuilder(options);
    await builder.start();
    
  } catch (error) {
    logger.error('构建过程发生错误:', error.message);
    process.exit(1);
  }
}

// 如果是直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { main };