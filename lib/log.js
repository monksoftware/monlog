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

const defaultOptions = {
  levelFormatter: defaultLevelFormatter,
  timestampFormatter: defaultTimestampFormatter,
  nameFormatter: defaultNameFormatter,
  template: defaultTemplate,
  level: 'WARN'
}

const _loggersByName = {}

class MonkLogger extends logLevel.constructor {
  constructor (name, level, options) {
    super(name, level)
    this.options = {...defaultOptions}
    this.configure(options)
  }

  configure (options, reset = false) {
    this.options = {
      ...(reset ? defaultOptions : this.options),
      ...options,
    }
    this.setLevel(this.options.level)
    prefix.apply(this, this.options)
  }

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

module.exports = defaultLogger
