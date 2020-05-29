import { check } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
import configService from '../../../../config';
import { InputCheckChain } from '../../types';
const regexes = configService.get().regexes;

export const login: InputCheckChain[] = [
    check('username').exists().isString(),
    check('password').exists().isString().matches(regexes.password),

    sanitize('username'),
    sanitize('password')
];
