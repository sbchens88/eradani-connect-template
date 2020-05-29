import { JSONObject } from 'src/types';

/**
 * Template service function
 *
 * @param inputData The inputs to our template function
 */
export async function check(inputData: JSONObject): Promise<boolean> {
    if (inputData.valid) {
        return true;
    }
    return false;
}
