import { query } from 'express-validator';
import { InputCheckChain } from 'src/types';

export const getCustomers: InputCheckChain[] = [
    query('minBaldue').exists().isNumeric().isLength({ min: 1, max: 10 }).toFloat().withMessage('minBaldue is required and is limited to 10 digits'),
    query('maxBaldue').exists().isNumeric().isLength({ min: 1, max: 10 }).toFloat().withMessage('maxBaldue is required and is limited to 10 digits')
];
