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

/**
 * Converts a date to the RFC3339 profile of the ISO 8601 standard
 *
 * Example: 2019-02-08T19:02:09.432+01:00
 * https://tools.ietf.org/html/rfc3339#section-5.6
 *
 * Inspired by https://stackoverflow.com/a/17415677/1362167
 */
const dateToISOString = (d, milliseconds = true) => {
  // Pad an integer >=0, <= 99 to 2 digits.
  // Useful to pad days, minutes, hours, months etc.
  const pad2 = num => `${num < 10 ? '0' : ''}${num}`
  const pad3 = num => `${num < 100 ? (num < 10 ? '00' : '0') : ''}${num}`
  const offset = -d.getTimezoneOffset()
  const absOffset = Math.abs(offset)
  return d.getFullYear()
    + '-' + pad2(d.getMonth() + 1)
    + '-' + pad2(d.getDate())
    + 'T' + pad2(d.getHours())
    + ':' + pad2(d.getMinutes())
    + ':' + pad2(d.getSeconds())
    + (milliseconds ? ('.' + pad3(d.getMilliseconds())) : '')
    + (offset >= 0 ? '+' : '-')
    + pad2(Math.floor(absOffset / 60))
    + ':' + pad2(absOffset % 60)
}

const defaultTimestampFormatter = dateToISOString

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
class MonLogger extends logLevel.constructor {
  constructor (name, level, options = {}) {
    super(name, level)
    this.options = Object.assign({}, options, defaultLogLevelOptions)
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
    this.options = Object.assign({}, (reset ? defaultLogLevelOptions : this.options), options)
    prefix.apply(this, this.options)
  }

  /**
   *
   * @param {string} name - child logger name
   * @param {string} [level=null] - log level for the new logger. If null
   *   (the default), inherits the parent's one.
   * @param {object} [options={}] - loglevel-plugin-prefix options to apply
   *   on top of parent ones.
   */
  getLogger (name, level = null, options = {}) {
    if (typeof name !== "string" || name === "") {
      throw new TypeError("You must supply a name when creating a logger.")
    }
    let logger = _loggersByName[name]
    if (!logger) {
      logger = _loggersByName[name] = new MonLogger(
        name, level || this.getLevel(), Object.assign({}, this.options, options))
    }
    return logger
  }
}

prefix.reg(logLevel)

const defaultLogger = new MonLogger('root')
defaultLogger.getLoggers = () => _loggersByName

// Export default logger. Can be used directly, or can be used
// to obtain child loggers.
module.exports = defaultLogger
// Export dateToISOString, users may want to use it to define a custom
// timestampformatter
module.exports.dateToISOString = dateToISOString
