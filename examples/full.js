'use strict'

const { levels, monkLog } = require('../lib/log')

const logTrace = monkLog({
  name: 'MONK-LOG',
  level: levels.TRACE
})

logTrace.trace('this is a trace log')
logTrace.debug('this is a debug log')
logTrace.info('this is an info log')
logTrace.warn('this is a warning log')
logTrace.error('this is an error log')

const log = monkLog({
  name: 'MONK-LOG2',
  level: levels.DEBUG,
  wrap: ['[', ']']
})

log.debug('this is a debug log')
log.info('this is an info log')
log.warn('this is a warning log')
log.error('this is an error log')
