const { loggerConfig } = require('../config');

class Logger {
  constructor() {
    this.colors = loggerConfig.colors;
    this.level = loggerConfig.level;
  }

  // 检查是否应该记录该级别的日志
  shouldLog(level) {
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    return levels[level] <= levels[this.level];
  }

  // 格式化日志消息
  formatMessage(level, message, ...args) {
    const timestamp = new Date().toLocaleTimeString();
    const color = this.colors[level] || this.colors.info;
    const reset = this.colors.reset;
    
    let formattedMessage = `[${timestamp}] ${message}`;
    
    if (args.length > 0) {
      formattedMessage += ' ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
    }
    
    return `${color}${formattedMessage}${reset}`;
  }

  info(message, ...args) {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, ...args));
    }
  }

  warn(message, ...args) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, ...args));
    }
  }

  error(message, ...args) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, ...args));
    }
  }

  debug(message, ...args) {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, ...args));
    }
  }

  success(message, ...args) {
    console.log(this.formatMessage('info', `✅ ${message}`, ...args));
  }

  start(message, ...args) {
    console.log(this.formatMessage('info', `🚀 ${message}`, ...args));
  }

  progress(message, ...args) {
    console.log(this.formatMessage('info', `📦 ${message}`, ...args));
  }
}

module.exports = new Logger();