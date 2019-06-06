import log = require('loglevel')

declare var defaultLogger: DefaultLogger
export = defaultLogger
export as namespace defaultLogger

declare interface MonkLogOptions {
    levelFormatter?: (level: log.LogLevelDesc) => any
    timestampFormatter?: (date: Date) => any
    nameFormatter?: (name: string) => any
    template?: string
}

declare interface DefaultLogger extends log.RootLogger {
    dateToISOString: (d: Date, milliseconds?: boolean) => string
    getLogger (name: string, level?: log.LogLevelDesc, options?: MonkLogOptions): Logger
}

declare interface Logger extends log.Logger {
    configure (options: MonkLogOptions, reset?: boolean): void
    getLogger (name: string, level?: log.LogLevelDesc, options?: MonkLogOptions): Logger
}
