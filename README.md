# Monk Log library

This is a simple logging library for Nodejs projects depends on:
- [loglevel](https://github.com/pimterry/loglevel)
- [loglevel-plugin-prefix](https://github.com/kutuluk/loglevel-plugin-prefix)
- [chalk](https://github.com/chalk/chalk#readme)

## Installation

For add this as `npm` dependency

```bash
npm install git+ssh://git@git.webmonks.org:node-libraries/monk-log.git
```

or add manually to your `package.json` file

```json
  {
    "dependencies": {
      ... ,
      "monk-log": "git+ssh://git@git.webmonks.org:node-libraries/monk-log.git"
    }
  }
```

## Setting up

```javascript
const { levels, monkLog } = require('monk-log')
const log = monkLog(options)

log.trace(msg)
log.debug(msg)
log.info(msg)
log.warn(msg)
log.error(msg)

```

## Documentation

The monk log library accept optional parameters:
```
{
  name:   // Choose a name for log instance, default is monk-log
  level:  // Choose a log level, default il DEBUG, possible level are:
          // "TRACE" "DEBUG" "INFO" "WARN" "ERROR"
  wrap:   // Wrap `name` with custom identifier, default is and array of square brackets ['[', ']']
}
```

## Examples

see more inside `examples folder`

```javascript
const { levels, monkLog } = require('monk-log')
const log = monkLog({
  name: 'MONK-LOG',
  level: levels.DEBUG,
  wrap: ['+', '+']
})

log.debug('this is a debug log')
log.info('this is an info log')
log.warn('this is a warning log')
log.error('this is an error log')

// Response
// [2019-02-08T18:35:40.245] INFO monk-log: Set log level to DEBUG
// [2019-02-08T18:35:40.245] DEBUG +MONK-LOG+: this is a debug log
// [2019-02-08T18:35:40.245] INFO +MONK-LOG+: this is an info log
// [2019-02-08T18:35:40.245] WARN +MONK-LOG+: this is a warning log
// [2019-02-08T18:35:40.245] ERROR +MONK-LOG+: this is an error log

```
