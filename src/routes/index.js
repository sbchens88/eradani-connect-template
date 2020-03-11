const express = require('express');
const mountAPI = require('./api');
const mountAuth = require('./auth');
const respond = require('../middlewares/respond');

module.exports = addRoutes;

function addRoutes(router) {
    const api = express.Router(),
        auth = express.Router();
    mountAPI(api);
    mountAuth(auth);

    router.get('/', respond((req, res) => ({ message: 'Up and running!' })));
    
    router.use('/api', api);
    router.use('/auth', auth);
};