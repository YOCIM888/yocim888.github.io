const fs = require('fs');
const path = require('path');
const { paths, csvOptions, buildConfig } = require('../config');
const logger = require('../utils/logger');
const fileSystem = require('../utils/fileSystem');
const HtmlBuilder = require('./htmlBuilder');
const SearchIndexBuilder = require('./searchIndexBuilder');
const { buildSubpages } = require('./subpageBuilder');

class MainBuilder {
  constructor(options = {}) {
    this.options = {
      watch: false,
      production: false,
      ...options
    };

    this.htmlBuilder = new HtmlBuilder();
    this.searchIndexBuilder = new SearchIndexBuilder();
    this.csvConverter = require('../csv_to_navlinks');
    this.fsWatcher = null;
    this.debounceTimer = null;
    this.lastMtime = 0;
    this.isBuilding = false;
  }

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

  buildHtml() {
    return this.htmlBuilder.build();
  }

  fullBuild() {
    if (this.isBuilding) {
      logger.warn('构建正在进行中，跳过本次请求');
      return Promise.resolve(false);
    }

    this.isBuilding = true;
    logger.start('开始完整构建流程...');

    const startTime = Date.now();

    try {
      const csvSuccess = this.convertCsvToJson();
      if (!csvSuccess) {
        throw new Error('CSV转换失败');
      }

      const htmlSuccess = this.buildHtml();
      if (!htmlSuccess) {
        throw new Error('HTML构建失败');
      }

      const searchIndexSuccess = this.searchIndexBuilder.build();
      if (!searchIndexSuccess) {
        logger.warn('搜索索引生成失败，但不影响主流程');
      }

      const subpageSuccess = buildSubpages();
      if (!subpageSuccess) {
        logger.warn('子页面构建失败，但不影响主流程');
      }

      const validation = this.htmlBuilder.validate();
      if (!validation.valid) {
        logger.warn('构建验证警告:', validation.errors);
      }

      const buildTime = Date.now() - startTime;
      logger.success('构建完成！耗时: ' + buildTime + 'ms');

      this.isBuilding = false;
      return Promise.resolve(true);

    } catch (error) {
      logger.error('构建流程失败:', error.message);
      this.isBuilding = false;
      return Promise.resolve(false);
    }
  }

  startWatching() {
    logger.start('启动文件监听模式...');

    fileSystem.ensureDir(paths.data);

    logger.info('监听文件: ' + paths.csv);
    logger.info('编辑CSV文件后自动构建，按Ctrl+C停止\n');

    if (fileSystem.exists(paths.csv)) {
      this.lastMtime = fileSystem.getMtime(paths.csv);
      this.fullBuild().catch(err => {
        logger.error('首次构建失败:', err.message);
      });
    } else {
      logger.warn('未找到CSV文件，等待中...');
    }

    try {
      this.fsWatcher = fs.watch(paths.data, { recursive: false }, (eventType, filename) => {
        if (!filename || !filename.endsWith('.csv')) return;

        const currentMtime = fileSystem.getMtime(paths.csv);
        if (currentMtime === this.lastMtime) return;

        this.lastMtime = currentMtime;

        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          logger.info('检测到CSV文件变化，重新构建...');
          this.fullBuild().catch(err => {
            logger.error('自动重建失败:', err.message);
          });
        }, buildConfig.debounceDelay || 300);
      });

      this.fsWatcher.on('error', (err) => {
        logger.error('文件监听出错:', err.message);
        this.startPollingFallback();
      });
    } catch (err) {
      logger.warn('fs.watch 不可用，回退到轮询模式:', err.message);
      this.startPollingFallback();
    }

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

    if (process.platform === 'win32') {
      process.on('SIGHUP', () => {
        this.stopWatching();
        process.exit(0);
      });
    }
  }

  startPollingFallback() {
    logger.info('使用轮询模式监听文件变化（间隔: ' + (buildConfig.watchInterval || 500) + 'ms）');

    this.pollTimer = setInterval(() => {
      this.checkFileChanges();
    }, buildConfig.watchInterval || 500);
  }

  checkFileChanges() {
    if (!fileSystem.exists(paths.csv)) {
      return;
    }

    const currentMtime = fileSystem.getMtime(paths.csv);

    if (currentMtime !== this.lastMtime) {
      this.lastMtime = currentMtime;

      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        logger.info('检测到CSV文件变化，重新构建...');
        this.fullBuild().catch(err => {
          logger.error('自动重建失败:', err.message);
        });
      }, buildConfig.debounceDelay || 300);
    }
  }

  stopWatching() {
    if (this.fsWatcher) {
      this.fsWatcher.close();
      this.fsWatcher = null;
    }

    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    logger.info('文件监听已停止');
  }

  async start() {
    try {
      if (this.options.watch) {
        this.startWatching();
      } else {
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
