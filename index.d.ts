import * as log from 'loglevel'

interface MonkLogOptions {
    levelFormatter?: (level: log.LogLevelDesc) => any
    timestampFormatter?: (date: Date) => any
    nameFormatter?: (name: string) => any
    template?: string
}

declare module 'loglevel' {
    interface DefaultLogger {
        dateToISOString: (d: Date, milliseconds?: boolean) => string
        getLogger (name: string, level?: log.LogLevelDesc, options?: MonkLogOptions): log.Logger
    }
    interface Logger {
        configure (options: MonkLogOptions, reset?: boolean): void
        getLogger (name: string, level?: log.LogLevelDesc, options?: MonkLogOptions): log.Logger
    }
}

export = log
