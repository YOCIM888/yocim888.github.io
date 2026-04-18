const path = require('path');
const { paths, csvOptions } = require('../config');
const logger = require('../utils/logger');
const fileSystem = require('../utils/fileSystem');
const HtmlBuilder = require('./htmlBuilder');

class MainBuilder {
  constructor(options = {}) {
    this.options = {
      watch: false,
      production: false,
      ...options
    };
    
    this.htmlBuilder = new HtmlBuilder();
    this.csvConverter = require('../csv_to_navlinks');
    this.watcher = null;
    this.debounceTimer = null;
  }

  // 转换CSV为JSON
  convertCsvToJson() {
    logger.progress('转换CSV为JSON...');
    
    if (!fileSystem.exists(paths.csv)) {
      logger.warn('CSV文件不存在，跳过转换');
      return false;
    }

    try {
      this.csvConverter.convertCsvToJson(csvOptions);
      logger.success('CSV转换完成');
      return true;
    } catch (error) {
      logger.error('CSV转换失败:', error.message);
      return false;
    }
  }

  // 构建HTML
  buildHtml() {
    return this.htmlBuilder.build();
  }

  // 完整构建流程
  async fullBuild() {
    logger.start('开始完整构建流程...');
    
    const startTime = Date.now();
    
    try {
      // 1. 转换CSV
      const csvSuccess = this.convertCsvToJson();
      if (!csvSuccess) {
        throw new Error('CSV转换失败');
      }

      // 2. 构建HTML
      const htmlSuccess = this.buildHtml();
      if (!htmlSuccess) {
        throw new Error('HTML构建失败');
      }

      // 3. 验证构建结果
      const validation = this.htmlBuilder.validate();
      if (!validation.valid) {
        logger.warn('构建验证警告:', validation.errors);
      }

      const buildTime = Date.now() - startTime;
      logger.success(`构建完成！耗时: ${buildTime}ms`);
      
      return true;
      
    } catch (error) {
      logger.error('构建流程失败:', error.message);
      return false;
    }
  }

  // 文件监听
  startWatching() {
    logger.start('启动文件监听模式...');
    
    // 确保数据目录存在
    fileSystem.ensureDir(paths.data);

    logger.info(`监听文件: ${paths.csv}`);
    logger.info('编辑CSV文件后自动构建，按Ctrl+C停止\n');

    // 首次构建（如果CSV存在）
    if (fileSystem.exists(paths.csv)) {
      this.fullBuild();
    } else {
      logger.warn('未找到CSV文件，等待中...');
    }

    // 监听CSV文件变化
    this.watcher = setInterval(() => {
      this.checkFileChanges();
    }, 500);
  }

  // 检查文件变化
  checkFileChanges() {
    if (!fileSystem.exists(paths.csv)) {
      return;
    }

    const currentMtime = fileSystem.getMtime(paths.csv);
    const lastMtime = this.lastMtime || 0;

    if (currentMtime !== lastMtime) {
      this.lastMtime = currentMtime;
      
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        logger.info('检测到CSV文件变化，重新构建...');
        this.fullBuild();
      }, 300);
    }
  }

  // 停止监听
  stopWatching() {
    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    
    logger.info('文件监听已停止');
  }

  // 启动构建
  async start() {
    try {
      if (this.options.watch) {
        // 监听模式
        this.startWatching();
        
        // 处理进程退出
        process.on('SIGINT', () => {
          logger.info('\n收到停止信号...');
          this.stopWatching();
          process.exit(0);
        });
        
        process.on('SIGTERM', () => {
          logger.info('\n收到终止信号...');
          this.stopWatching();
          process.exit(0);
        });
        
      } else {
        // 单次构建
        const success = await this.fullBuild();
        process.exit(success ? 0 : 1);
      }
      
    } catch (error) {
      logger.error('构建启动失败:', error.message);
      process.exit(1);
    }
  }
}

module.exports = MainBuilder;