/**
 * Logging Utility
 * Provides a standard interface for logging to a daily log file, and also
 * logs to the console. Logs are prefixed with one of NPM's logging levels
 * (Error, Warn, Info, Verbose, Debug, and Silly) along with a context label
 * which you provide, such as "core.services.database", to help you locate the
 * source of the log.
 *
 * There is a setting in the application config file under "logger" called
 * "maxLoggingLevel". You can set this logging level to one of the NPM levels,
 * and this Logger will ignore any logs beyond that level. For example, if you
 * set the maxLoggingLevel to "warn", only "error" and "warn" level logs will
 * be stored. "info", "verbose", "debug", and "silly" log statements will be
 * ignored by the logger.
 *
 * Another setting under the "logger" config is "disableConsole". When set to
 * true, this setting will stop logs from going to the console / QPRINT.
 *
 * Arbitrary additional logging data can be attached to a log record with the
 * second argument to all of the logger methods. This parameter will be
 * serialized by the logger system. To set a depth limit on recursive object
 * serialization, set the config value under "logger" called "maxStringifyDepth"
 * to your desired depth. Default is 10 layers deep.
 *
 * To construct a new logger, add the following code to the top of your TS file:
 * import * as loggerService from 'path/to/logger.ts';
 * const logger = loggerService.createLogger('my.custom.context');
 *
 * Or, if you are using JS, add the following code to the top of your JS file:
 * const logger = require('path/to/logger.js')('my.custom.context');
 *
 * Logs are stored in the 'dist/logs' directory at the root of this application's
 * source code, and are named by their creation dates in the following format:
 * YYYY-MM-DD.log
 *
 * For example, the log file for October 7th, 2020 would be: 2020-10-07.log
 *
 * Happy Logging!
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import safeJSONStringify from 'safe-json-stringify';
import configService from '../../config';
const config = configService.get();

function _stringify(data: any, depth: number = 0): string {
    try {
        if (depth > (config.logger.maxStringifyDepth || 10)) {
            return '' + data;
        }
        if (data instanceof Error) {
            return `${data.stack} ${
                (data as any).additionalData
                    ? _stringify((data as any).additionalData, depth + 1)
                    : (data as any).context
                    ? _stringify((data as any).context, depth + 1)
                    : ''
            }`;
        } else {
            return safeJSONStringify(data);
        }
    } catch (e) {
        return '' + data;
    }
}

function _clean(str: string) {
    return str.replace(/[\r\n]/g, '');
}

const formatter = winston.format.combine(
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label', 'context'] }),
    winston.format.printf((options: any) => {
        let logString =
            '' +
            `[${options.level.toUpperCase()}]`.padEnd(10, ' ') +
            `(${new Date().toISOString()})` +
            ` -- ${options.context} -- ${_clean(options.message)} -- ${_stringify(options.metadata)}`;
        return logString;
    })
);

const normalTransport = new DailyRotateFile({
    filename: path.join(
        __dirname,
        '../../logs/' + (process.env.APP_TESTING === 'true' ? 'testing/' : ''),
        '%DATE%.log'
    ),
    datePattern: 'YYYY-MM-DD',
    json: true,
    level: config.logger.maxLoggingLevel,
    format: formatter
});

// Only handles uncaught exceptions in the program
const exceptionTransport = new DailyRotateFile({
    filename: path.join(
        __dirname,
        '../../logs/' + (process.env.APP_TESTING === 'true' ? 'testing/' : '') + 'exceptions/',
        '%DATE%.exceptions'
    ),
    datePattern: 'YYYY-MM-DD',
    handleExceptions: true,
    json: true,
    level: config.logger.maxLoggingLevel,
    format: formatter
});

const consoleTransport = new winston.transports.Console({
    level: config.logger.maxLoggingLevel,
    format: formatter
});

const logger = winston.createLogger({
    transports: [normalTransport, consoleTransport],
    exceptionHandlers: [normalTransport, consoleTransport, exceptionTransport],
    exitOnError: false
});

// Don't output to the console if we're in testing mode
if (config.logger.disableConsole) {
    logger.remove(consoleTransport);
}

export default function createLogger(context: string) {
    // Set the default context of the child
    return logger.child({ context });
}

export const createForContext = createLogger;

// Logger for Morgan
// Attach with: app.use(require("morgan")("combined", { stream: requestLogger }));
const _requestLogger = createLogger('api-requests');
export const requestLogger = {
    write: function(message: string) {
        _requestLogger.info(message);
    }
};
