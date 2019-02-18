'use strict'

const log = require('../lib/log')

const logTrace = log.getLogger('MONK-LOG', 'TRACE')
logTrace.trace('this is a trace log')
logTrace.debug('this is a debug log')
logTrace.info('this is an info log')
logTrace.warn('this is a warning log')
logTrace.error('this is an error log')

const advancedLogger = log.getLogger(
  'super-long-logger-name-maybe-too-much',
  'DEBUG',
  {
    // Only use first letter of level, e.g. W for waraning logs
    levelFormatter: (level) => level.toUpperCase()[0],
    // Numeric timestamp
    timestampFormatter: (date) => +date,
    // Truncate logger names to 5 letters
    nameFormatter: (name) => name.slice(0, 5),
    template: `#%l# logger: %n - timestamp: %t - message:`
  }
)

log.info('This library is great!')  // #I# logger: super - timestamp: 1550449434004 - message: This library is great!
