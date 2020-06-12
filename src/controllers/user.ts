import * as jwt from '../services/jwt';
import * as configService from '../../config';
const config = configService.get();
const credentials = config.credentials;
import APIError from '../APIError';
import { JWTUserData } from '../types';

export function login(username: string, password: string) {
    return new Promise((resolve, reject) => {
        if (username === credentials.username && password === credentials.password) {
            resolve(generateJWT({ username }));
        } else {
            reject(new APIError(400, 'Username / Password Combination Not Found'));
        }
    });
}

export function generateJWT(userData: JWTUserData) {
    const user = {
        username: userData.username
    };

    return jwt.sign(user).then((token: string) => {
        return { token };
    });
}
