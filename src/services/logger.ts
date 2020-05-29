import fs from 'fs';
import path from 'path';
import safeJSONStringify from 'safe-json-stringify';
import fullConfig from '../../config';

const config = fullConfig.get().logger;
const logLevels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];

/* ==================== *\
    INTERNAL  LOGGER
\* ==================== */

const internalLogger = fs.createWriteStream(
    path.join(
        __dirname,
        `../../logs/${new Date()
            .toISOString()
            .split('T')[0]
            .replace(/:/g, '-')}.log`
    ),
    { flags: 'a', autoClose: false }
);

/* ==================== *\
      LOGGER CLASS
\* ==================== */

class Logger {
    private contextString: string;
    private logLevelNumber: number;

    constructor(contextString: string, maxLoggingLevel: string) {
        this.contextString = contextString;
        this.logLevelNumber = logLevels.indexOf(maxLoggingLevel.toLowerCase());
    }

    /**
     *
     * @param level The desired NPM logging level
     * @param message The base message to log
     * @param additionalData Any additional data of any kind which you would like to include in the log entry
     */
    log(level: string, message: string, additionalData?: any) {
        try {
            // Don't log anything if the log level is above our max threshold
            if (logLevels.indexOf(level) > this.logLevelNumber) {
                return;
            }

            let logString = `[${level.toUpperCase()}]`;
            logString += '          '.substring(logString.length);
            logString += `(${this.contextString}) -- ${message}`;
            if (additionalData) {
                logString += ' -- Additional Data: ';
                logString += additionalData instanceof Error ? additionalData.stack : safeJSONStringify(additionalData);
            }
            console.log(logString);
            internalLogger.write(logString + '\n');
        } catch (e) {
            console.error('Failed to log message in logger');
            console.error(e);
        }
    }

    /**
     * Write a log entry at the `error` NPM log severity level. If this level
     * is above the `logger.maxLoggingLevel` in the application config, this
     * function will be a no-op. For that reason, it is best if you leave as
     * much serialization & other log prep to this logger - that way the
     * serialization steps can be skipped based on configuration.
     *
     * @param message A summary message for the log file.
     * @param additionalData Any arbitrary data you would like in the log.
     */
    error(message: string, additionalData?: any) {
        this.log('error', message, additionalData);
    }

    /**
     * Write a log entry at the `warn` NPM log severity level. If this level
     * is above the `logger.maxLoggingLevel` in the application config, this
     * function will be a no-op. For that reason, it is best if you leave as
     * much serialization & other log prep to this logger - that way the
     * serialization steps can be skipped based on configuration.
     *
     * @param message A summary message for the log file.
     * @param additionalData Any arbitrary data you would like in the log.
     */
    warn(message: string, additionalData?: any) {
        this.log('warn', message, additionalData);
    }

    /**
     * Write a log entry at the `info` NPM log severity level. If this level
     * is above the `logger.maxLoggingLevel` in the application config, this
     * function will be a no-op. For that reason, it is best if you leave as
     * much serialization & other log prep to this logger - that way the
     * serialization steps can be skipped based on configuration.
     *
     * @param message A summary message for the log file.
     * @param additionalData Any arbitrary data you would like in the log.
     */
    info(message: string, additionalData?: any) {
        this.log('info', message, additionalData);
    }

    /**
     * Write a log entry at the `verbose` NPM log severity level. If this level
     * is above the `logger.maxLoggingLevel` in the application config, this
     * function will be a no-op. For that reason, it is best if you leave as
     * much serialization & other log prep to this logger - that way the
     * serialization steps can be skipped based on configuration.
     *
     * @param message A summary message for the log file.
     * @param additionalData Any arbitrary data you would like in the log.
     */
    verbose(message: string, additionalData?: any) {
        this.log('verbose', message, additionalData);
    }

    /**
     * Write a log entry at the `debug` NPM log severity level. If this level
     * is above the `logger.maxLoggingLevel` in the application config, this
     * function will be a no-op. For that reason, it is best if you leave as
     * much serialization & other log prep to this logger - that way the
     * serialization steps can be skipped based on configuration.
     *
     * @param message A summary message for the log file.
     * @param additionalData Any arbitrary data you would like in the log.
     */
    debug(message: string, additionalData?: any) {
        this.log('debug', message, additionalData);
    }

    /**
     * Write a log entry at the `silly` NPM log severity level. If this level
     * is above the `logger.maxLoggingLevel` in the application config, this
     * function will be a no-op. For that reason, it is best if you leave as
     * much serialization & other log prep to this logger - that way the
     * serialization steps can be skipped based on configuration.
     *
     * @param message A summary message for the log file.
     * @param additionalData Any arbitrary data you would like in the log.
     */
    silly(message: string, additionalData?: any) {
        this.log('silly', message, additionalData);
    }
}

/**
 * Create a `Logger` instance for the given context. The context string you
 * supply will be included at the beginning of every log entry generated by
 * this logger.
 *
 * @param contextString Context string such as a class or file name.
 * @param maxLoggingLevel The maximum logging level to allow. Defaults to `config.logger.maxLoggingLevel`.
 */
export function createForContext(contextString: string, maxLoggingLevel: string = config.maxLoggingLevel): Logger {
    return new Logger(contextString, maxLoggingLevel);
}
