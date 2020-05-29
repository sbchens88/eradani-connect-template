import * as loggerService from './logger';
import APIError from '../APIError';
import { JSONObject, BooleanString } from '../types';
const logger = loggerService.createForContext('controllers/extra-sanitizers');

/**
 * Template for your custom sanitizers. Only use this if your data validation
 * and sanitization needs exceed the capabilities of an [[InputCheckChain]]
 *
 * @param requestData Input data from the API call
 * @throws {APIError<400>} If input is invalid or sanitization fails for any reason
 */
export async function sanitizeZoneRequest(requestData: JSONObject): Promise<BooleanString> {
    try {
        if (requestData.valid) {
            return 'Y';
        } else {
            return 'N';
        }
    } catch (e) {
        logger.warn('Received bad data input, failed to sanitize parameters', requestData);
        throw new APIError(400, 'Bad Data in request parameters (valid)');
    }
}
