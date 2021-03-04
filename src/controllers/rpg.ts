import configService from '../../config';
const config = configService.get();
import eradaniConnect from '@eradani-inc/eradani-connect';
import * as loggerService from '../services/logger';
import TEMPLATE, { TEMPLATEInput, TEMPLATEOutput } from '../models/pgm-template';

const credentials = config.eradaniConnect.credentials;
const logger = loggerService.createForContext('controllers/rpg');

// Const transport = new eradaniConnect.transports.Odbc(config.eradaniConnect.odbc);
const transport = new eradaniConnect.transports.Xml(
    '*LOCAL',
    credentials.username,
    credentials.password,
    config.eradaniConnect.xml
);

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
