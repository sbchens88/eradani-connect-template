const express = require('express');
const mountRPG = require('./rpg');
const mountSQL = require('./sql');

module.exports = function mountAPI(router) {
    // router.use(requireAuth);

    const rpg = express.Router();
    mountRPG(rpg);
    router.use('/rpg', rpg);

    const sql = express.Router();
    mountSQL(sql);
    router.use('/sql', sql);
};