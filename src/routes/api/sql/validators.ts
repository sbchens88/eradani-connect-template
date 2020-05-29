import { check } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
import { InputCheckChain } from '../../../types';

export const getCustomers: InputCheckChain[] = [
    check('minBaldue').exists().isNumeric().isLength({ min: 1, max: 10 }).withMessage('minBaldue is required and is limited to 10 digits'),
    check('maxBaldue').exists().isNumeric().isLength({ min: 1, max: 10 }).withMessage('maxBaldue is required and is limited to 10 digits'),
    
    sanitize('minBaldue'),
    sanitize('maxBaldue')
];
