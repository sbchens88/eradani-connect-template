const http = require('http');
const express = require('express');
const app = express();
const config = require('../config').get();
const logger = require('./services/logger');
const bodyParser = require('body-parser');
const morgan = require('morgan');
let commandClient;
// const socketIO = require('socket.io');

const startup = new Promise(resolve => {
    resolve(setUpAPI());
}).then(() => {
    return startServer();
}).then(() => {
    return startCommandClient();
}).catch(err => {
    console.log("ERROR ON STARTUP: ", err);
});

function startServer() {
    const server = http.Server(app);
    //Set up SocketIO server for realtime services
    // const socketServer = socketIO(server);

    server.on('error', function(err) {
        //If the address is already in use
        if (err.code === 'EADDRINUSE') {
            logger.error(
                  '\n\n========================================\n'
                + '\n'
                + 'ERROR: Address In Use (EADDRINUSE)!\n'
                + '\n'
                + 'The server could not start because its\n'
                + `configured port (Port ${process.env.PORT || config.app.port}) is already\n`
                + 'in use by another application. This is\n'
                + 'usually caused by an attempt to start a\n'
                + 'second instance of this server while\n'
                + 'another instance is running.\n'
                + '\n'
                + 'Check to make sure there isn\'t already\n'
                + 'another instance of this application\n'
                + 'running and try again.\n'
                + '\n'
                + '=======================================\n\n'
            );
            process.exit(0);
        } else {
            logger.error(err);
        }
    });

    server.listen(process.env.PORT || config.app.port);
    logger.info({ message: `Server listening on port ${process.env.PORT || config.app.port}` });

    return { server };
}

function setUpAPI() {
    const decodeJWT = require('./middlewares/decode-jwt');
    const routes = require('./routes');

    // General middlewares

    app.use(morgan('dev'));
    app.use(bodyParser.json({
        type: 'application/json'
    }));
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(decodeJWT);

    // Mount routes
    const router = express.Router();
    routes(router);
    app.use('/', router);
}

function startCommandClient() {
    commandClient = require('./services/command');

    const icndbapi = require('./interfaces/icndbapi.js');
    const icndb = require('./services/icndb');
    commandClient.register('getjoke', icndbapi, icndb.getJoke);

    const weatherapi = require('./interfaces/wthfrcapi.js');
    const weather = require('./services/weather');
    commandClient.register('getweatherforecast', weatherapi, weather.getforecast);

    return commandClient.listen();
}

module.exports = {
    startup
};

/*
function setUpSocket() {
    io.on('connection', socket => {
        console.log('Connection Received');
        socket.emit('connected', 'connected');

        socket.on('disconnect', () => {
            console.log('Connection Terminated');
        });
    });
}
*/
