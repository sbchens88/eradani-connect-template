import configService from 'config';
const config = configService.get();
import eradaniConnect from '@eradani-inc/eradani-connect';
import createLogger from 'src/services/logger';
const logger = createLogger('eradani-inc/eradani-connect');

const transport = new eradaniConnect.transports.Odbc(config.eradaniConnect.odbc, {
    ...config.eradaniConnect.odbcOptions,
    logger
});

/* Disabled XML Transport
const credentials = config.eradaniConnect.credentials;
const transport = new eradaniConnect.transports.Xml(
    '*LOCAL',
    credentials.username,
    credentials.password,
    { ...config.eradaniConnect.xml, logger }
);
*/

export default transport;
