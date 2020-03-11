const config = require('../../config').get().eradaniConnect;
const eradaniConnect = require('@eradani-inc/eradani-connect');
const connection = new eradaniConnect.transports.Xml("*LOCAL", config.username, config.password, config.connectionPath);
//const connection = new eradaniConnect.transports.Odbc('DSN=*LOCAL');
const mysql = require('../models/sql-model');

async function getPeople(minBaldue, maxBaldue) {
    return connection.execute(mysql, {
        minBaldue,
        maxBaldue
    });
}

module.exports = {
    getPeople
};