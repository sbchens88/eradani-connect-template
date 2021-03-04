import eradaniConnect from '@eradani-inc/eradani-connect';
const { PackedDecimal } = eradaniConnect.dataTypes;
import configService from '../../config';
const config = configService.get().eradaniConnect.native;

export default new eradaniConnect.run.Pgm('SIMPLECALC', {
    lib: config.templateLib,
    mode: 'ile',
    params: [
        {
            name: 'input',
            type: new PackedDecimal(15, 0)
        },
        {
            name: 'output',
            type: new PackedDecimal(16, 0),
            outputOnly: true
        }
    ]
});

/**
 * Input Structure for TEMPLATE. Includes detailed field information such as
 * field length, format, numerical precision, and default values.
 */
export interface TEMPLATEInput {
    /**
     * @size 15
     * @precision 0
     */
    input: number | string;
    /**
     * @size 16
     * @precision 0
     * @readonly
     */
    output?: number | string;
}

/**
 * Output Structure for TEMPLATE. Check [[TEMPLATEInput]] spec for
 * more details field length, format, numerical precision, and default values.
 */
export interface TEMPLATEOutput {
    input: number;
    output: number;
}
