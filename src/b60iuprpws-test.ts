import eradaniConnect from '@eradani-inc/eradani-connect';
import configService from '../config';
const config = configService.get();
const credentials = config.eradaniConnect.credentials;

import model from './models/B60IUPRPWS';

async function testPGM() {
    const pgmTransport = new eradaniConnect.transports.Xml(
        '*LOCAL',
        credentials.username,
        credentials.password,
        config.eradaniConnect.xml
    );

    return pgmTransport.execute(model, {
        inDS: {
            tagtno: '1234',
            tcstdx: '2020-01-01'
        }
    });
}

testPGM()
    .then(result => {
        console.log('PGM test succeeded. Result: ', JSON.stringify(result));
    })
    .catch(err => {
        console.log('PGM test failed. Error: ', err.stack);
    });
