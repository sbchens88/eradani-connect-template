const jwt = require('jsonwebtoken');
const config = require('../../config');
const key = config.getKeys().privateKey;
const options = config.get().jwt;
const promisify = require('bluebird').promisify;
const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

function sign(data) {
    return jwtSign(data, key, options);
}

async function verify(token) {
    const decodedToken = await jwtVerify(token, key)
    if (decodedToken) {
        return decodedToken;
    } else {
        throw APIError(401, 'Bad JWT Supplied');
    }
}

module.exports = {
    sign,
    verify
};