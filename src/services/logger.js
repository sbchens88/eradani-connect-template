const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const config = require('../../config').get().logger;

const normalTransport = new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, '../../logs/' + (process.env.APP_TESTING === 'true' ? 'testing/' : ''), '%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    prepend: true,
    json: true,
    level: config.maxLoggingLevel
});

// Only handles uncaught exceptions in the program
const exceptionTransport = new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, '../../logs/' + (process.env.APP_TESTING === 'true' ? 'testing/' : '') + 'exceptions/', '%DATE%.exceptions'),
    datePattern: 'YYYY-MM-DD',
    prepend: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    json: true,
    level: config.maxLoggingLevel
});

const consoleTransport = new winston.transports.Console({ level: config.maxLoggingLevel });

const logger = winston.createLogger({
    transports: [
        normalTransport,
        consoleTransport
    ],
    exceptionHandlers: [
        normalTransport,
        consoleTransport,
        exceptionTransport
    ],
    exitOnError: false
});

// Don't output to the console if we're in testing mode
if (process.env.APP_TESTING === 'true') {
    logger.remove(consoleTransport);
}

module.exports = logger;