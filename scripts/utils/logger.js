const chalk = require('chalk');
const loggerConfig = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  colors: {
    info: 'green',
    warn: 'yellow',
    error: 'red',
    debug: 'cyan',
    progress: 'magenta',
    success: 'green',
    start: 'blue'
  }
};

class Logger {
  constructor(config = {}) {
    this.config = { ...loggerConfig, ...config };
  }

  _shouldLog(level) {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const msgLevelIndex = levels.indexOf(level);
    return msgLevelIndex >= currentLevelIndex;
  }

  _formatMessage(level, ...args) {
    const colorFn = chalk[this.config.colors[level]] || chalk.white;
    const prefix = colorFn(`[${level.toUpperCase()}]`);
    return [prefix, ...args].join(' ');
  }

  debug(...args) {
    if (this._shouldLog('debug')) {
      console.log(this._formatMessage('debug', ...args));
    }
  }

  info(...args) {
    if (this._shouldLog('info')) {
      console.log(this._formatMessage('info', ...args));
    }
  }

  warn(...args) {
    if (this._shouldLog('warn')) {
      console.warn(this._formatMessage('warn', ...args));
    }
  }

  error(...args) {
    if (this._shouldLog('error')) {
      console.error(this._formatMessage('error', ...args));
    }
  }

  success(...args) {
    if (this._shouldLog('info')) {
      console.log(this._formatMessage('success', ...args));
    }
  }

  start(...args) {
    if (this._shouldLog('info')) {
      console.log(this._formatMessage('start', ...args));
    }
  }

  progress(...args) {
    if (this._shouldLog('info')) {
      console.log(this._formatMessage('progress', ...args));
    }
  }
}

module.exports = new Logger();