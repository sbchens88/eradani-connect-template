import { Response, NextFunction } from 'express';
import * as loggerService from '../services/logger';
import * as jwt from '../services/jwt';
import { UserRequest } from '../types';
const logger = loggerService.createForContext('middlewares/decode-jwt');

export default function decodeJWT(req: UserRequest, res: Response, next: NextFunction) {
    try {
        delete req.user;
        // If there's no JWT present, skip this.
        if (!req.headers.authorization) {
            return next();
        }

        // Decode the JWT and save its user data if it is valid.
        jwt.verify(req.headers.authorization.split(' ')[1])
            .then(userData => {
                req.user = userData;
                next();
            })
            .catch(() => {
                res.status(401).json({ message: 'Bad Authorization Token' });
            });
    } catch (e) {
        logger.error('Could not parse authorization header', e);
        res.status(401).json({ message: 'Bad Authorization Token' });
    }
}
