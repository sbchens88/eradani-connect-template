import createLogger from 'src/services/logger';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
const logger = createLogger('middlewares/require-auth');
import * as jwt from 'src/services/jwt';

passport.use(
    new BearerStrategy(async function (token, done) {
        try {
            let userData = await jwt.verify(token);
            logger.debug('JWT Validation Succeeded', userData);
            return done(null, userData, { scope: 'all' });
        } catch (e) {
            logger.verbose('JWT Validation Failed', e);
            return done(null, false);
        }
    })
);

export default function callback(req: any, res: any, next: any) {
    passport.authenticate('bearer', function (err, user, _info) {
        logger.debug('Bearer authentication callback', { err, user, info: _info });
        if (err || !user) {
            return res.status(401).json({ message: 'Authentication Failed' });
        }
        return next();
    })(req, res, next);
}
