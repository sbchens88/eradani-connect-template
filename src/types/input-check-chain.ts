import { ValidationChain } from 'express-validator/check';
import { SanitizationChain } from 'express-validator/filter';
import { RequestHandler } from 'express';

/**
 * Structure for UserRequest outputs from login process
 */
export type InputCheckChain = ValidationChain | SanitizationChain | RequestHandler;
