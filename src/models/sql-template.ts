import eradaniConnect from '@eradani-inc/eradani-connect';
import configService from '../../config';
import { JSONObject } from 'src/types';
const config = configService.get().eradaniConnect.native;

export default new eradaniConnect.run.Sql(
    `SELECT * FROM ${config.templateDataLib}.QCUSTCDT WHERE BALDUE >= ? AND BALDUE <= ?`,
    {
        params: [
            {
                name: 'minBaldue'
            },
            {
                name: 'maxBaldue'
            }
        ]
    }
);

/**
 * Input Structure for SQLTemplate. Includes detailed field information such as
 * field length, format, numerical precision, and default values.
 */
export interface SQLTemplateInput {
    /**
     * @description Minimum balance due
     */
    minBaldue: number | string;
    /**
     * @description Maximum balance due
     */
    maxBaldue: number | string;
}

/**
 * Structure of records outputted by SQLTemplate SQL query
 *
 * @todo For future development, you may want to add the remaining SQLTemplate output fields here.
 */
export type SQLTemplateOutputRecord = JSONObject;

/**
 * Output Structure for SQLTemplate SQL query. This is an Array of
 * [[SQLTemplateOutputRecord]] elements.
 */
export interface SQLTemplateOutput extends Array<SQLTemplateOutputRecord> {}
