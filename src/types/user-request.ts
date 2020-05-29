import { Request } from 'express';
import { JWTUserData } from './jwt-user-data';

/**
 * Structure for UserRequest outputs from login process
 */
export type UserRequest = Request & {
    user?: JWTUserData;
};
