'use strict'

const logLevel = require('loglevel')
const chalk = require('chalk')
const prefix = require('loglevel-plugin-prefix')

const colors = Object.freeze({
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red
})

const defaultTimestampFormatter = (date) => {
  const tzOffset = date.getTimezoneOffset() * 60000 // offset in milliseconds
  const localISOTime = (new Date(date - tzOffset)).toISOString().slice(0, -1) // => '2015-01-26T06:40:36.181'
  return localISOTime
}

const defaultNameFormatter = (name) => {
  return chalk.green(name)
}

const defaultLevelFormatter = (level) => {
  return colors[level.toUpperCase()](level.toUpperCase())
}

const defaultTemplate = '[%t] %l [%n]:'

// "Nice" default options, they make log lines like:
// [2019-02-18T00:37:56.007] WARN [root]: This is a warning message
// With colored log level, according to serverity.
const defaultLogLevelOptions = {
  levelFormatter: defaultLevelFormatter,
  timestampFormatter: defaultTimestampFormatter,
  nameFormatter: defaultNameFormatter,
  template: defaultTemplate,
}

const _loggersByName = {}

/**
 * Subclass of loglevel's Logger,
 * Preset to use loglevel-plugin-prefix with some nice default options.
 * Can obtain child loggers by calling .getLogger, they will inherit
 * parent's options.
 */
class MonkLogger extends logLevel.constructor {
  constructor (name, level, options) {
    super(name, level)
    this.options = {...defaultLogLevelOptions}
    this.configure(options)
  }

  /**
   * Configure the logger, accepts all loglevel-plugin-prefix options
   * and the loglevel (`level` key).
   *
   * @param {object} options - new option values to update
   * @param {boolean} [reset=false] - if false (the default), it will keep
   *   and update current options (e.g. options inherited from parents or
   *   a previous call to configure). When true, if will first reset options
   *   to default ones, and then update with supplied ones.
   *   Therefore, you can use .configure({}, true) to completely reset
   *   options to defaults.
   */
  configure (options, reset = false) {
    this.options = {
      ...(reset ? defaultLogLevelOptions : this.options),
      ...options,
    }
    prefix.apply(this, this.options)
  }

  /**
   *
   * @param {string} name - child logger name
   * @param {string} level - only output log messages of at least this level
   * @param {object} options - loglevel-plugin-prefix options
   */
  getLogger (name, level, options) {
    if (typeof name !== "string" || name === "") {
      throw new TypeError("You must supply a name when creating a logger.")
    }
    let logger = _loggersByName[name]
    if (!logger) {
      logger = _loggersByName[name] = new MonkLogger(
        name, level, {...this.options, ...options})
    }
    return logger
  }
}

prefix.reg(logLevel)

const defaultLogger = new MonkLogger('root')
defaultLogger.getLoggers = () => _loggersByName

// Export default logger. Can be used directly, or can be used
// to obtain child loggers.
module.exports = defaultLogger
