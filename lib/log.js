'use strict'

const logger = require('loglevel')
const chalk = require('chalk')
const prefix = require('loglevel-plugin-prefix')

const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value)
}

const colors = Object.freeze({
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red
})

const logConfiguration = {
  // template: '[%t] %l %n:',
  format(level, name, timestamp) {
    return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](level)} ${chalk.green(`${name}:`)}`
  },
  timestampFormatter: () => {
    const tzOffset = (new Date()).getTimezoneOffset() * 60000 // offset in milliseconds
    const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, -1) // => '2015-01-26T06:40:36.181'
    return localISOTime
  }
}

module.exports.levels = logger.levels

module.exports.monkLog = ({ name = '', level = logger.levels.DEBUG, wrap = ['[', ']'] } = {}) => {
  if (!Array.isArray(wrap)) {
    wrap = ['[', ']']
  }

  if (wrap.length !== 2) {
    throw new Error(`Wrong wrap params, expected 2 got ${wrap.length} elements`)
  }

  prefix.reg(logger)
  prefix.apply(logger, logConfiguration)
  logger.setLevel(level)
  logger.info(`Set log level to ${getKeyByValue(logger.levels, level)}`)

  if (name) {
    name = `${wrap[0]}${name}${wrap[1]}`
    return logger.getLogger(name)
  }

  // root name is nasty
  return logger.getLogger('monk-log')
}
