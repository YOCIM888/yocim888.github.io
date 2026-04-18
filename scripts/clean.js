const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const tempDir = path.join(rootDir, 'temp');

function cleanDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`🧹 清理目录: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ 清理完成: ${dirPath}`);
  } else {
    console.log(`ℹ️ 目录不存在，跳过清理: ${dirPath}`);
  }
}

function cleanBuildFiles() {
  console.log('🧹 开始清理构建文件...\n');
  
  // 清理构建目录
  cleanDirectory(distDir);
  cleanDirectory(tempDir);
  
  // 清理临时文件
  const tempFiles = [
    path.join(rootDir, '*.log'),
    path.join(rootDir, '*.tmp'),
    path.join(rootDir, 'npm-debug.log*')
  ];
  
  tempFiles.forEach(pattern => {
    try {
      const files = require('glob').sync(pattern);
      files.forEach(file => {
        console.log(`🗑️ 删除临时文件: ${file}`);
        fs.unlinkSync(file);
      });
    } catch (error) {
      // 忽略错误
    }
  });
  
  console.log('\n✅ 清理完成！');
}

// 如果是直接运行此脚本
if (require.main === module) {
  cleanBuildFiles();
}

module.exports = { cleanBuildFiles };