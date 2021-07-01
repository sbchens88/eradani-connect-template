import jwt from 'jsonwebtoken';
import { promisify } from 'es6-promisify';
import config from 'config';
import APIError from 'src/APIError';
import { JWTUserData } from 'src/types';
const key = config.getKeys().privateKey;
const options = config.get().jwt;
const jwtSign = promisify(jwt.sign) as (data: any, key: string, options?: any) => Promise<string>;
const jwtVerify = promisify(jwt.verify) as (token: string, key: string) => Promise<any>;

/**
 * Generates a secure JSON Web Token to control access to the API. Any data
 * encoded in the token can be verified and retrieved by the `jwt.verify`
 * function.
 *
 * @param data An arbitrary object with user data to be encoded in the token
 */
export async function sign(data: JWTUserData): Promise<string> {
    const encodedToken = await jwtSign(data, key, options);
    return encodedToken;
}

/**
 * Decodes a JSON Web Token and returns its user data. An error will be thrown
 * if the token fails validation or cannot be decoded.
 *
 * @param token A JWT as a string
 */
export async function verify(token: string): Promise<JWTUserData> {
    const decodedToken = await jwtVerify(token, key);
    if (decodedToken) {
        return decodedToken;
    } else {
        throw new APIError(401, 'Bad JWT Supplied');
    }
}
