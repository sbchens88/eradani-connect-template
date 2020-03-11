const { check } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const regexes = require('../../../config').get().regexes;

const login = [
    check('username').exists().isString(),
    check('password').exists().isString().matches(regexes.password),

    sanitize('username').toString(),
    sanitize('password').toString()
];

module.exports = {
    login
};