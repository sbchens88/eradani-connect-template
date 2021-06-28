import createLogger from 'src/services/logger';
import TEMPLATE, { TEMPLATEInput, TEMPLATEOutput } from 'src/models/pgm-template';
import transport from 'src/services/connection';

const logger = createLogger('controllers/rpg');

/**
 * Run the Template program.
 *
 * @param {number} num The number to input to the program
 * @returns {Promise<TEMPLATEOutput}
 */
export async function simpleCalc(num: number): Promise<TEMPLATEOutput> {
    logger.debug('Calling TEMPLATE program');
    const params: TEMPLATEInput = {
        input: num
    };
    return transport.execute(TEMPLATE, params) as Promise<TEMPLATEOutput>;
}
