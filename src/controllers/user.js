const jwt = require('../services/jwt');
const config = require('../../config').get();
const credentials = config.credentials;
const APIError = require('../APIError');

function login(username, password) {
    return new Promise((resolve, reject) => {
        if (username === credentials.username && password === credentials.password) {
            resolve(generateJWT({ username }));
        } else {
            reject(APIError(400, "Username / Password Combination Not Found"));
        }
    });
}

function generateJWT(userData) {
    const user = {
        username: userData.username
    };

    return jwt.sign(user)
        .then(token => {
            return { token };
        });
}

module.exports = {
    login,
    generateJWT
};