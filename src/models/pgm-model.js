const eradaniConnect = require('@eradani-inc/eradani-connect');

module.exports = new eradaniConnect.run.Pgm('LINUX_CALC', {
    lib: 'TEMPLATE',
    mode: 'ile',
    params: [{
        name: 'IBMICORES',
        type: new eradaniConnect.dataTypes.PackedDecimal(15, 0),
        defaultValue: 0
    }, {
        name: 'LINUXSERVERS',
        type: new eradaniConnect.dataTypes.PackedDecimal(16, 0),
        defaultValue: 0
    }]
});
