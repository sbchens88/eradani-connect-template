const validate = require('../../middlewares/validate');
const respond = require('../../middlewares/respond');
const requireAuth = require('../../middlewares/require-auth');
const validators = require('./validators');
const user = require('../../controllers/user');

module.exports = function mountAuth(router) {

    router.post('/',
        validate(validators.login), 
        respond((req, res) => user.login(req.body.username, req.body.password)));
    
    router.post('/verify-jwt',
        requireAuth,
        respond((req, res) => ({ valid: true })));
    
};