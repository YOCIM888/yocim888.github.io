const fs = require('fs');
const path = require('path');

class FileSystem {
  exists(filePath) {
    try {
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }

  readFile(filePath, encoding = 'utf-8') {
    if (!this.exists(filePath)) {
      throw new Error(`文件不存在: ${filePath}`);
    }
    return fs.readFileSync(filePath, encoding);
  }

  writeFile(filePath, content, encoding = 'utf-8') {
    try {
      const dir = path.dirname(filePath);
      if (!this.exists(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, content, encoding);
      return true;
    } catch (error) {
      throw new Error(`写入文件失败: ${error.message}`);
    }
  }

  readJson(filePath) {
    const content = this.readFile(filePath);
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`JSON解析失败: ${error.message}`);
    }
  }

  writeJson(filePath, data, indent = 2) {
    const content = JSON.stringify(data, null, indent);
    return this.writeFile(filePath, content);
  }

  getMtime(filePath) {
    if (!this.exists(filePath)) {
      return 0;
    }
    try {
      return fs.statSync(filePath).mtimeMs;
    } catch {
      return 0;
    }
  }

  ensureDir(dirPath) {
    if (!this.exists(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  copyFile(src, dest) {
    if (!this.exists(src)) {
      throw new Error(`源文件不存在: ${src}`);
    }
    const destDir = path.dirname(dest);
    this.ensureDir(destDir);
    fs.copyFileSync(src, dest);
  }

  deleteFile(filePath) {
    if (this.exists(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = new FileSystem();