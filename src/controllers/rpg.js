const config = require('../../config').get().eradaniConnect;
const eradaniConnect = require('@eradani-inc/eradani-connect');
const connection = new eradaniConnect.transports.Xml("*LOCAL", config.username, config.password, config.connectionPath);
const mypgm = require('../models/pgm-model');

function linuxCalc(num) {
    return connection.execute(mypgm, {
        IBMICORES: num
    });
}

module.exports = {
    linuxCalc
};