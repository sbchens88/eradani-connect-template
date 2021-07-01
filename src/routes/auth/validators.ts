import { body } from 'express-validator';
import configService from 'config';
import { InputCheckChain } from 'src/types';
const regexes = configService.get().regexes;

export const login: InputCheckChain[] = [
    body('username').exists().isString(),
    body('password').exists().isString().matches(regexes.password)
];
