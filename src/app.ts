import http from 'http';
import express from 'express';
import configService from '../config';
import * as loggerService from './services/logger';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import decodeJWT from './middlewares/decode-jwt';
import routes from './routes';
// If you want realtime services: import socketIO from 'socket.io';
const config = configService.get();
const app = express();
const logger = loggerService.createForContext('app');

export const startup = new Promise(resolve => {
    resolve(setUpAPI());
})
    .then(() => {
        return startServer();
    })
    .catch(err => {
        logger.error('ERROR ON STARTUP', err);
    })
    .catch(err => {
        console.log('ERROR ON STARTUP: ', err);
    });

function startServer() {
    const server = http.createServer(app);

    server.on('error', function(err: any) {
        // If the address is already in use
        if (err.code === 'EADDRINUSE') {
            logger.error(
                '\n\n========================================\n' +
                    '\n' +
                    'ERROR: Address In Use (EADDRINUSE)!\n' +
                    '\n' +
                    'The server could not start because its\n' +
                    `configured port (Port ${process.env.PORT || config.app.port}) is already\n` +
                    'in use by another application. This is\n' +
                    'usually caused by an attempt to start a\n' +
                    'second instance of this server while\n' +
                    'another instance is running.\n' +
                    '\n' +
                    "Check to make sure there isn't already\n" +
                    'another instance of this application\n' +
                    'running and try again.\n' +
                    '\n' +
                    '=======================================\n\n'
            );
            process.exit(0);
        } else {
            throw err;
        }
    });

    server.listen(process.env.PORT || config.app.port);
    logger.info(`Server listening on port ${process.env.PORT || config.app.port}`);

    return { server };
}

function setUpAPI() {
    // General middlewares

    app.use(morgan('dev'));
    app.use(
        bodyParser.json({
            type: 'application/json'
        })
    );
    app.use(
        bodyParser.urlencoded({
            extended: false
        })
    );
    app.use(decodeJWT);

    // Mount routes
    const router = express.Router();
    routes(router);
    app.use('/', router);
}
