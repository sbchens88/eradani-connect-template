const sqlController = require('../../../controllers/sql');
const respond = require('../../../middlewares/respond');
const path = require('path');

module.exports = function mountSQL(router) {

    router.get('/people/ui', (req, res) => res.sendFile(path.join(__dirname, '../../../../public/people.html')));

    router.get('/people', respond((req, res) => sqlController.getPeople(req.query.minBaldue, req.query.maxBaldue)));

};