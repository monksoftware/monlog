# Monk Log library

Are you using `console.log` in your project? Are you tired of configuring
loglevel / winston / whatever to add timestamp, colors to your log messages?
Do you want a consistent log style?
This is the library for you! You can now log with style -- no configuration
required!

## Installation

Simply add this library as a dependency in your project.
You can use the github URI:

```
yarn add github:monksoftware/monk-log
```

or add manually to your `package.json` file

```json
  {
    "dependencies": {
      [...] ,
      "monk-log": "github:monksoftware/monk-log"
    }
  }
```

## How to use

Works pretty much the same as `loglevel`, the only difference is that
the exported root logger is preconfigured with loglevel-plugin-prefix
and custom formatting functions in order to output nice colorful log messages
with timestamp, log level and logger name.

```javascript
const log = require('monk-log')

log.trace(msg)
log.debug(msg)
log.info(msg)
log.warn(msg)
log.error(msg)
```

## Examples

See more inside `examples folder`

### Ready-to-go logging
```javascript
const log = require('monk-log')
log.warn('You can have nice log messages in just one line!')

// Outputs
// [2019-02-18T01:10:49.933+01:00] WARN [root]: You can have nice log messages in just one line!
```

### Child loggers with custom format

```javascript
const log = require('monk-log')
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

// Outputs
// [2019-02-18T01:08:46.260] INFO [root]: Child logger has been set up
// When: 2019-02-18T01:08:46.262+01:00, who: CHILD, why: DEBUG, what: this is a debug message
// When: 2019-02-18T01:08:46.262+01:00, who: CHILD, why: INFO, what: This is a info message
// When: 2019-02-18T01:08:46.262+01:00, who: CHILD, why: WARN, what: this is a warning message
// When: 2019-02-18T01:08:46.263+01:00, who: CHILD, why: ERROR, what: this is an error message
```
