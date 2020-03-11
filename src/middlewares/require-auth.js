const logger = require('../services/logger');

module.exports = requireAuth;

function requireAuth(req, res, next) {
    try {
        // req.user is set by decode-jwt middleware if a valid jwt is present
        if (req.user && req.user.username) {
            return next();
        } else {
            throw APIError(401, "Bad Authorization Token");
        }
    } catch (err) {
        if (err && err.status == 401) {
            logger.warn(err);
        } else {
            logger.error(err);
        }
        return res.status(401).json({ message: "Bad Authorization Token" });
    }
}