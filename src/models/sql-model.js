const eradaniConnect = require('@eradani-inc/eradani-connect');

module.exports = new eradaniConnect.run.Sql('SELECT * FROM QIWS.QCUSTCDT WHERE BALDUE >= ? AND BALDUE <= ?', {
    params: [{
        name: 'minBaldue'
    }, {
        name: 'maxBaldue'
    }]
});