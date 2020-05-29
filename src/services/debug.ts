import config from '../../config';
const DEBUG = config.get().debug;

/**
 * Run the given function if and only if the DEBUG configuration value is TRUE.
 * Otherwise, no-op.
 *
 * @param {Function} debugFunction The function to run if the DEBUG configuration value is TRUE
 */
export default function debug(debugFunction: Function) {
    if (DEBUG) {
        return debugFunction();
    }
}
