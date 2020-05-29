import { validationResult } from 'express-validator/check';
import * as loggerService from '../services/logger';
import { Response, NextFunction } from 'express';
import APIError from '../APIError';
import { InputCheckChain } from '../types';
const logger = loggerService.createForContext('middlewares/validate');

export default function validate(validatorArray: InputCheckChain[]) {
    return [...validatorArray, checkValidationResult];
}

function checkValidationResult(req: any, res: Response, next: NextFunction) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new APIError(400, 'Bad Data Supplied to API', errors.mapped());
        }
        next();
    } catch (e) {
        if (e instanceof APIError) {
            logger.debug(e.message, e.toJSON());
            res.status(400).json({ message: e.message, errors: e.additionalData });
        } else {
            logger.error('Encountered unexpected error during input validation', e);
            res.status(500).json({ message: 'Unknown Error' });
        }
    }
}
