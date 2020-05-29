import { Response, NextFunction } from 'express';
import * as loggerService from '../services/logger';
import APIError from '../APIError';
import { UserRequest } from '../types';
const logger = loggerService.createForContext('middlewares/require-auth');

export default function requireAuth(req: UserRequest, res: Response, next: NextFunction) {
    try {
        // `req.user` is set by decode-jwt middleware if a valid jwt is present
        if (req.user && req.user.username) {
            return next();
        } else {
            throw new APIError(401, 'Bad Authorization Token');
        }
    } catch (err) {
        if (err && err.status === 401) {
            logger.debug('Unauthenticated user attempted to access API', err);
        } else {
            logger.error('Error checking auth token', err);
        }
        return res.status(401).json({ message: 'Bad Authorization Token' });
    }
}
