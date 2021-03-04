import { check } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
import { InputCheckChain } from '../../../types';

export const simpleCalc: InputCheckChain[] = [
    check('num').exists().isInt().isLength({ min: 1, max: 30 }).withMessage('num is required and is limited to 30 digits'),
    
    sanitize('num')
];
