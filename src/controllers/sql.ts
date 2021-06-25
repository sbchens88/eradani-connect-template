import createLogger from 'src/services/logger';
import SQLTemplate, { SQLTemplateInput, SQLTemplateOutput } from 'src/models/sql-template';
import { JSONObject } from 'src/types';
import transport from 'src/services/connection';

const logger = createLogger('controllers/sql');

/**
 * Run the Template SQL query.
 *
 * @param {JSONObject} inputs The minBaldue and maxBaldue to query with
 * @returns {Promise<SQLTemplateOutput}
 */
export async function getCustomers(inputs: JSONObject): Promise<SQLTemplateOutput> {
    logger.debug('Calling SQLTemplate program');
    const params: SQLTemplateInput = {
        minBaldue: inputs.minBaldue,
        maxBaldue: inputs.maxBaldue
    };
    return transport.execute(SQLTemplate, params) as Promise<SQLTemplateOutput>;
}
