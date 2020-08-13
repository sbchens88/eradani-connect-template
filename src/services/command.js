const logger = require("./logger");
const config = require('../../config').get().eradaniConnect;
const { ECClient } = require("@eradani-inc/ec-client");

const _commands = {};
let _readCommands = false;

const { ecclient } = config;

const ecc = new ECClient(ecclient);

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

function listen() {
    if (_readCommands) {
        throw new Error('Command Service is already listening');
    }
    _readCommands = true;
    receiveDQ();
    return true;
}

function close() {
    if (!_readCommands) {
        throw new Error('Command Service is not listening');
    }
    _readCommands = false;
    return true;
}

module.exports = {
    register,
    deregister,
    listen,
    close,
    client: ecc
};

async function handleRequest(data) {
    const handler = _commands[data.command];
    if (!handler) {
        throw new RangeError(`"${data.command}" is not a registered command.`);
    }

    try {
        const result = await handler.func(data.key, data.data, handler.interface, ecc);
        return result;
    } catch(e) {
        logger.warn('Request failed: ' + e.message);
    }
}

async function receiveDQ() {
    try {
      if (!_readCommands) {
          return true;
      }
      const result = await ecc.getNextRequest();
      if (result.data !== "") {
        await handleRequest(result);
      }
      return receiveDQ();
    } catch (err) {
      logger.error(`Error: ${err}`);
      return true;
    }
}