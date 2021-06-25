import { param } from 'express-validator';
import { InputCheckChain } from 'src/types';

export const simpleCalc: InputCheckChain[] = [
    param('num').exists().isInt().isLength({ min: 1, max: 30 }).toInt().withMessage('num is required and is limited to 30 digits'),
];
