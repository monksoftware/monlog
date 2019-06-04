# Monlog. Sensible logging by default.

Are you using `console.log` in your project? Are you tired of configuring
loglevel / winston / whatever to add timestamp, colors to your log messages?
Do you want a consistent log style?
This is the library for you! You can now log with style -- no configuration
required!

## How to use

Works pretty much the same as `loglevel`, the only difference is that
the exported root logger is preconfigured with loglevel-plugin-prefix
and custom formatting functions in order to output nice colorful log messages
with timestamp, log level and logger name.

```javascript
const log = require('@monksoftware/monlog')

log.trace(msg)
log.debug(msg)
log.info(msg)
log.warn(msg)
log.error(msg)
```

### Ready-to-go logging

You can use this library without any configuration, it will use sensible
defaults resulting in nice, useful and production-ready log messages:

* Millisecond-precision timestamp with timezone
* (optionally) colored loglevel
* Logger name
* Log only warnings and errors

```javascript
const log = require('@monksoftware/monlog')
const sublog = log.getLogger('SUB', log.levels.DEBUG)
log.warn('You can have nice log messages in just one line!')
sublog.debug("It's easy to define subloggers with different levels!')

// [2019-02-18T01:10:49.933+01:00] WARN [root]: You can have nice log messages in just one line!
// [2019-06-04T13:07:24.298+02:00] DEBUG [SUB]: It's easy to define subloggers with different levels!
```

### Child loggers with custom format

```javascript
const log = require('@monksoftware/monlog')
// Default level is WARN,
log.setDefaultLevel('DEBUG')
const childLogger = log.getLogger('CHILD', 'DEBUG', {
  template: 'When: %t, who: %n, why: %l, what: '
})
log.info('Child logger has been set up')
childLogger.debug('this is a debug message')
childLogger.info('This is a info message')
childLogger.warn('this is a warning message')
childLogger.error('this is an error message')

// [2019-02-18T01:08:46.260] INFO [root]: Child logger has been set up
// When: 2019-02-18T01:08:46.262+01:00, who: CHILD, why: DEBUG, what: this is a debug message
// When: 2019-02-18T01:08:46.262+01:00, who: CHILD, why: INFO, what: This is a info message
// When: 2019-02-18T01:08:46.262+01:00, who: CHILD, why: WARN, what: this is a warning message
// When: 2019-02-18T01:08:46.263+01:00, who: CHILD, why: ERROR, what: this is an error message
```

### Advanced format customisation

You can use all
[loglevel-plugin-prefix](https://github.com/kutuluk/loglevel-plugin-prefix)
customisations parameters:

```js
const log = require('@monksoftware/monlog')

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

advancedLogger.info('I have strange taste for log messages...')
// #I# logger: super - timestamp: 1559646093854 - message: I have strange tasted for log messages...
```

## Where do I configure the logging file/output ?

[You don't.](https://12factor.net/logs)
All applicaton logging should go to stdout and stderr. Log routing, dispatching
and storage it's a deployment specific configuration and should therefore be
in the hands of the sysadmin or be set up in the applicatoin packaging,
it should not be decided by the applicaton source code.
https://12factor.net/logs