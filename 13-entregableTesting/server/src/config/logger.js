import winston, { format } from 'winston'
import config from './config.js'

const logFormat = format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`
})

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red whiteBG',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    http: 'green',
    debug: 'white'
  }

}

const devLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console(
      {
        level: 'debug',
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevelOptions.colors }),
          format.timestamp(),
          logFormat
        )
      }
    )
  ]
})

const prodLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console(
      {
        level: 'info',
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevelOptions.colors }),
          format.timestamp(),
          logFormat
        )
      }
    ),
    new winston.transports.File(
      {
        filename: './errors.log',
        level: 'warning',
        format: format.combine(
          format.timestamp(),
          logFormat
        )
      }
    )
  ]
})

export const customLogger = (config.environment === 'production') ? prodLogger : devLogger

export function addLogger (req, res, next) {
  req.logger = customLogger
  req.logger.http(`method ${req.method} - ${req.url}`)
  next()
}
