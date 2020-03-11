const logger = require('../services/logger');
const jwt = require('../services/jwt');

module.exports = decodeJWT;

function decodeJWT(req, res, next) {
    try {
        delete req.user;
        //If there's no JWT present, skip this.
        if (!req.headers.authorization || typeof req.headers.authorization !== 'string') {
            return next();
        }
    } catch (e) {
        logger.error(e);
        return res.status(401).json({message: "Bad Authorization Token"});
    }

    //Decode the JWT and save its user data if it is valid.
    return jwt.verify(req.headers.authorization.split(' ')[1])
        .then(userData => {
            req.user = userData;
            next();
        })
        .catch(err => {
            res.status(401).json({message: "Bad Authorization Token"});
       });
}