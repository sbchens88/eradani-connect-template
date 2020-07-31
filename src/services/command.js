const logger = require("./logger");
const config = require('../../config').get().eradaniConnect;
const _commands = {};

function register(name, interface, func) {
    if (_commands[name]) {
        throw new Error(`Command ${name} already exists. Please deregister existing command before registering a new one.`);
    }
    _commands[name] = {
        interface,
        func
    };
    return true;
}

function deregister(name) {
    delete _commands[name];
}

module.exports = {
    register,
    deregister,
    direct: {
        sendToDataQueue
    }
};

const xml = (function () {
    const service = {};
    /* eslint-disable new-cap */
    const xt = require("itoolkit");
    const xml = Object.assign({}, config.xml, config.credentials);

    const xtoptions = {
        host: xml.host,
        port: xml.port,
        path: xml.path
    };

    // Transform the object returned by iToolKit to an object with a form we expect.
    // iToolKit returns an array of objects. The result field of the object in the
    // first element of the array returned by iToolKit has an array of an array
    // objects---one for each column, for example:
    /*
    result =
    [
    	[
    		{
    		"desc": "ID",
    		"value": "10232"
    		},
    		{
    		"desc": "NAME",
    		"value": "ARS277"
    		}
    		... one object for each column
    	],
    	[
    	... one array for each row of the result set
    	]
    ]
    */
    // transformColumnArrIntoObjFields changes it to the following form:
    /*
    [
    	{
    		"ID": "10232",
    		"NAME": "ARS277",
    		... one field for each column
    	},
    	{
    		... one object for each row of the result set
    	}
    ]
    */
    function transformColumnArrIntoObjFields(result) {
        return result.map(row => {
            return row.reduce((object, column) => {
                const newObject = object;
                newObject[column.desc] = column.value;
                return newObject;
            }, {});
        });
    }

    service.executeQuery = async query => {
        const p = new Promise(resolve => {
            const conn = new xt.iConn("*LOCAL", xml.username, xml.password, xtoptions);

            // Add the SQL
            const sql = new xt.iSql();
            sql.addQuery(query);
            sql.fetch();
            sql.free();
            conn.add(sql);

            conn.run(xmlResponse => {
                resolve(xmlResponse);
            });
        });

        const xmlResponse = await p;

        const result = xt.xmlToJson(xmlResponse);
        if (result == null || result.length < 1) {
            throw Error(xmlResponse);
        }

        const errorsExist = result.reduce((acc, cur) => {
            return cur.success ? acc : true;
        }, false);
        if (errorsExist) {
            throw Error(xmlResponse);
        }

        // result[1].result is the result of the SQL query
        const sqlResult = transformColumnArrIntoObjFields(result[0].result);
        return sqlResult;
    }

    service.executeCmd = async cmd => {
        const p = new Promise(resolve => {
            const conn = new xt.iConn("*LOCAL", xml.username, xml.password, xtoptions);

            // Add the command
            conn.add(xt.iCmd(cmd));

            conn.run(xmlResponse => {
                resolve(xmlResponse);
            });
        });

        const xmlResponse = await p;

        const result = xt.xmlToJson(xmlResponse);
        if (result == null || result.length < 1) {
            throw Error(xmlResponse);
        }

        const errorsExist = result.reduce((acc, cur) => {
            return cur.success ? acc : true;
        }, false);
        if (errorsExist) {
            throw Error(xmlResponse);
        }

        return result;
    }

    return service;
})();

const dataqueue = (function () {
    const service = {};
    const {
        Connection,
        ProgramCall,
        xmlToJson
    } = require("itoolkit");
    const {
        library
    } = config.dataqueue;

    // This is a copy of the function in `Toolkit`. I reimplemented it to support
    // sending to keyed data queues
    function sendToDataQueue(name, lib, data, key, cb) {
        const conn = new Connection({
            transport: "odbc",
            transportOptions: {
                dsn: "*LOCAL"
            }
        });

        const pgm = new ProgramCall("QSNDDTAQ", {
            lib: "QSYS"
        });
        pgm.addParam(name, "10A");
        pgm.addParam(lib === "" ? "*CURLIB" : lib, "10A");
        pgm.addParam(data.length, "5p0");
        pgm.addParam(data, `${data.length}A`);
        pgm.addParam(2, "3p0");
        pgm.addParam(key, "2A");

        conn.add(pgm.toXML());
        let rtValue; // The returned value.
        const toJson = (transportError, str) => {
            if (transportError) {
                cb(transportError, null);
                return;
            }
            const output = xmlToJson(str);
            if (
                Object.prototype.hasOwnProperty.call(output[0], "success") &&
                output[0].success === true
            ) {
                rtValue = true;
            } else {
                rtValue = str;
            }

            cb(null, rtValue); // Run the call back function against the returned value.
        };

        conn.run(toJson); // Post the input XML and get the response.
    }

    async function sendRecordToDataQueue(dtaq, data, key) {
        const p = new Promise((resolve, reject) => {
            logger.debug(`sending key: "${key}" data: "${data}"`);
            sendToDataQueue(dtaq, library, data, key, (error, value) => {
                if (error) {
                    reject(error);
                }
                resolve(value);
            });
        });

        return p;
    }

    // eod = end of data
    // eoa = end of array
    // data == null => no data
    service.sendToResDataQueue = async (eod, eoa, data, key) => {
        let dataToSend = `${eod ? "1" : "0"}${eoa ? "1" : "0"}`;
        if (data == null) {
            dataToSend += "1";
        } else {
            dataToSend += `0${data}`;
        }
        return sendRecordToDataQueue("ECNCTCRES", dataToSend, key);
    };

    // This is a copy of the function in `Toolkit`. I reimplemented it
    // so that I could set a timeout for `QRCVDTAQ`
    // `waitTime` is in seconds
    function receiveFromDataQueue(name, lib, length, waitTime, cb) {
        const conn = new Connection({
            transport: "odbc",
            transportOptions: {
                dsn: "*LOCAL"
            }
        });

        const pgm = new ProgramCall("QRCVDTAQ", {
            lib: "QSYS"
        });
        pgm.addParam(name, "10A");
        pgm.addParam(lib === "" ? "*CURLIB" : lib, "10A");
        pgm.addParam(length, "5p0");
        pgm.addParam("", `${length + 1}A`);
        pgm.addParam(waitTime, "5p0");

        conn.add(pgm.toXML());
        let rtValue; // The returned value.

        const toJson = (transportError, str) => {
            if (transportError) {
                cb(transportError, null);
                return;
            }
            const output = xmlToJson(str);
            if (
                Object.prototype.hasOwnProperty.call(output[0], "success") &&
                output[0].success === true
            ) {
                rtValue = output[0].data[3].value;
            } else {
                rtValue = str;
            }

            cb(null, rtValue);
        };

        conn.run(toJson); // Post the input XML and get the response.
    }

    service.receiveFromDataQueue = async (length, waitTime) => {
        const p = new Promise((resolve, reject) => {
            receiveFromDataQueue(
                "ECNCTCREQ",
                library,
                length,
                waitTime,
                (error, value) => {
                    if (error) {
                        reject(error);
                    }
                    if (value.length) logger.debug(`Received "${value}" from data queue`);
                    resolve(value);
                }
            );
        });

        return p;
    };
    return service;
})();

// `sendToDataQueue` recursively calls itself after each successfull
// transmission until all of the data has been sent
async function sendToDataQueue(data, key) {
    let dataRemaining = data;
    let dataToSend;
    if (dataRemaining.length > config.dataqueue.responseLen) {
      logger.debug("spanning data queue records");
      dataToSend = data.slice(0, config.dataqueue.responseLen);
      dataRemaining = data.slice(config.dataqueue.responseLen);
      await dataqueue.sendToResDataQueue(false, true, dataToSend, key);
    } else {
      dataToSend = data;
      dataRemaining = "";
      await dataqueue.sendToResDataQueue(true, true, dataToSend, key);
    }
  
    if (dataRemaining.length) {
      return sendToDataQueue(dataRemaining, key);
    }
  
    return 0;
}

async function handleRequest(data) {
    const reqkey = data.substring(0, 2).trimRight();
    const command = data.substring(2, 34).trimRight();
    const cmddata = data.substring(34);

    const handler = _commands[command];
    if (!handler) {
        throw new RangeError(`"${command}" is not a registered command.`);
    }

    try {
        const reqData = await handler.interface.convertDataToObject(cmddata);
        const result = await handler.func(reqData);
        const resRec = handler.interface.convertObjectToRetData(result);
        return sendToDataQueue(resRec, reqkey);
    } catch(e) {
        logger.warn('Request failed: ' + e.message);
        return sendToDataQueue(`${e.message}`, reqkey);
    }
}

(async function receiveDQ() {
    try {
      // wait for 5 seconds
      const result = await dataqueue.receiveFromDataQueue(
        config.dataqueue.requestLen + 34,
        5
      );
      if (result !== "") {
        await handleRequest(result);
      }
    } catch (err) {
      logger.error(`Error: ${err.message}`);
      logger.error(`stack: ${err.stack}`);
    }
    receiveDQ();
  })();