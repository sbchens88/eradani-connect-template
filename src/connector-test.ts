import eradaniConnect from '@eradani-inc/eradani-connect';
import configService from 'config';
const config = configService.get();
const credentials = config.eradaniConnect.credentials;

const model = new eradaniConnect.run.Sql('select * from qiws.qcustcdt');

async function testXML() {
    const xmlTransport = new eradaniConnect.transports.Xml(
        '*LOCAL',
        credentials.username,
        credentials.password,
        config.eradaniConnect.xml
    );

    return xmlTransport.execute(model, {});
}

async function testODBC() {
    const odbcTransport = new eradaniConnect.transports.Odbc('DSN=*LOCAL', {});

    return odbcTransport.execute(model, {});
}

async function testIDB() {
    const idbTransport = new eradaniConnect.transports.Idb('*LOCAL', {});
    return idbTransport.execute(model, {});
}

testXML()
    .then((result) => {
        console.log('XML test succeeded. Result: ', JSON.stringify(result));
    })
    .catch((err) => {
        console.log('XML test failed. Error: ', err.stack);
    });
testODBC()
    .then((result) => {
        console.log('ODBC test succeeded. Result: ', JSON.stringify(result));
    })
    .catch((err) => {
        console.log('ODBC test failed. Error: ', err.stack);
    });
testIDB()
    .then((result) => {
        console.log('IDB test succeeded. Result: ', JSON.stringify(result));
    })
    .catch((err) => {
        console.log('IDB test failed. Error: ', err.stack);
    });
