const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class FileSystem {
  // 确保目录存在
  ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.debug(`创建目录: ${dirPath}`);
    }
    return dirPath;
  }

  // 读取文件，如果不存在则返回默认值
  readFile(filePath, defaultValue = null, encoding = 'utf8') {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, encoding);
      }
      return defaultValue;
    } catch (error) {
      logger.error(`读取文件失败: ${filePath}`, error.message);
      return defaultValue;
    }
  }

  // 读取JSON文件
  readJson(filePath, defaultValue = {}) {
    try {
      const content = this.readFile(filePath);
      if (content) {
        return JSON.parse(content);
      }
      return defaultValue;
    } catch (error) {
      logger.error(`解析JSON失败: ${filePath}`, error.message);
      return defaultValue;
    }
  }

  // 写入文件
  writeFile(filePath, content, encoding = 'utf8') {
    try {
      this.ensureDir(path.dirname(filePath));
      fs.writeFileSync(filePath, content, encoding);
      logger.debug(`写入文件: ${filePath}`);
      return true;
    } catch (error) {
      logger.error(`写入文件失败: ${filePath}`, error.message);
      return false;
    }
  }

  // 写入JSON文件
  writeJson(filePath, data, indent = 2) {
    try {
      const content = JSON.stringify(data, null, indent);
      return this.writeFile(filePath, content);
    } catch (error) {
      logger.error(`写入JSON失败: ${filePath}`, error.message);
      return false;
    }
  }

  // 复制文件
  copyFile(source, destination) {
    try {
      this.ensureDir(path.dirname(destination));
      fs.copyFileSync(source, destination);
      logger.debug(`复制文件: ${source} -> ${destination}`);
      return true;
    } catch (error) {
      logger.error(`复制文件失败: ${source} -> ${destination}`, error.message);
      return false;
    }
  }

  // 检查文件是否存在
  exists(filePath) {
    return fs.existsSync(filePath);
  }

  // 获取文件修改时间
  getMtime(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.mtimeMs;
    } catch (error) {
      return 0;
    }
  }

  // 列出目录下所有文件
  listFiles(dirPath, pattern = '*') {
    try {
      if (!this.exists(dirPath)) {
        return [];
      }
      const files = fs.readdirSync(dirPath);
      return files.filter(file => {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);
        return stats.isFile() && file.match(new RegExp(pattern.replace('*', '.*')));
      });
    } catch (error) {
      logger.error(`列出文件失败: ${dirPath}`, error.message);
      return [];
    }
  }
}

module.exports = new FileSystem();