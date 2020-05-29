import { Response } from 'express';
import safeJSONStringify from 'safe-json-stringify';
import * as loggerService from '../services/logger';
import configService from '../../config';
import APIError from '../APIError';
import { RedirectResponse } from '../types';
const protectedFields = configService.get().protectedFields;
const logger = loggerService.createForContext('middlewares/respond');

/**
 * The Respond middleware allows us to freely write synchronous or asynchronous
 * route handlers without having to ever worry about exceptions or Promise
 * rejections bubbling up and making it back to the client.
 *
 * This middleware accepts a route handler as an arrow function, for example:
 * (req, res) => auth.login(req.body.username, req.body.password)
 *
 * And then runs the handler safely within a try-catch block. The result from
 * the handler is then wrapped in a Promise. This way, if the handler is
 * asynchronous, the Promise will be unwrapped properly and all errors will be
 * handled internally by the Promise. If the handler is synchronous, its result
 * will still be properly handled AND if it fails to catch an exception, the
 * error will simply be caught here and wrapped in a Promise, rather than
 * bubbling up.
 *
 * As for status codes, a 200 status code will be returned if your route
 * handler simply returns data. 500 will be returned if your handler throws an
 * error or returns a rejected Promise. 301 (redirect) will be returned if you
 * return data in the format of a [[RedirectResponse]]
 * (/types/redirect-response.ts)
 *
 * Makes writing common data routes much simpler and faster.
 * @param {Function} handler The route handler as a middleware-style arrow function
 */
export default function respond(handler: (req: any, res: Response) => any | RedirectResponse) {
    return (req: any, res: Response) => {
        // Store the response Promise
        let response: Promise<any>;
        try {
            // Attempt to handle the request with the given handler
            response = Promise.resolve(handler(req, res));
        } catch (err) {
            // If there is an uncaught exception (not a promise rejection), safely wrap it in a promise rejection
            response = Promise.reject(new APIError(500, 'Unknown Error', err));
        }
        // Process the Promise-wrapped response
        return response
            .then((result: any) => {
                _filterProtectedFields(req);
                logger.debug('Request Handled Successfully', {
                    status: 200,
                    requestData: {
                        route: req.originalUrl.split('?')[0],
                        data: {
                            query: Object.keys(req.query).length ? req.query : 'No Query Data',
                            params: Object.keys(req.params).length ? req.params : 'No URL Param Data',
                            body: Object.keys(req.body).length ? req.body : 'No Body Data'
                        },
                        user: !req.user || !Object.keys(req.user).length ? 'Unidentified User' : req.user
                    }
                });
                if (result && result.responseIsRedirect) {
                    res.redirect(result.redirectTo);
                } else {
                    res.status(200).json(result);
                }
            })
            .catch(error => {
                _filterProtectedFields(req);
                if (error.status === 500) {
                    logger.error(error.message, {
                        status: error.status,
                        errorData: {
                            rawError: _stringifyError(error),
                            route: req.originalUrl.split('?')[0],
                            data: {
                                query: Object.keys(req.query).length ? req.query : 'No Query Data',
                                params: Object.keys(req.params).length ? req.params : 'No URL Param Data',
                                body: Object.keys(req.body).length ? req.body : 'No Body Data'
                            },
                            user: !req.user || !Object.keys(req.user).length ? 'Unidentified User' : req.user
                        }
                    });
                } else {
                    logger.debug(error.message, {
                        status: error.status,
                        errorData: {
                            rawError: _stringifyError(error),
                            route: req.originalUrl.split('?')[0],
                            data: {
                                query: Object.keys(req.query).length ? req.query : 'No Query Data',
                                params: Object.keys(req.params).length ? req.params : 'No URL Param Data',
                                body: Object.keys(req.body).length ? req.body : 'No Body Data'
                            },
                            user: !req.user || !Object.keys(req.user).length ? 'Unidentified User' : req.user
                        }
                    });
                }
                res.status(error.status || error.statusCode || 500).json({
                    message: error.status && error.status !== 500 ? error.message : 'Unknown Error',
                    data: error.additionalData ? error.additionalData.send : null
                });
            })
            .catch(error => {
                logger.error(error.message || 'Unknown Error', {
                    status: error.status || error.statusCode || 500,
                    additionalData: {
                        rawError: _stringifyError(error),
                        route: req.originalUrl.split('?')[0],
                        data: {
                            query: Object.keys(req.query).length ? req.query : 'No Query Data',
                            params: Object.keys(req.params).length ? req.params : 'No URL Param Data',
                            body: Object.keys(req.body).length ? req.body : 'No Body Data'
                        },
                        user: !req.user || !Object.keys(req.user).length ? 'Unidentified User' : req.user
                    }
                });
                res.status(500).json({ message: 'Unknown Error' });
            });
    };
}

/**
 * Delete any sensitive fields such as passwords from the data before we log the request in server logs.
 *
 * @param {Request} req
 */
function _filterProtectedFields(req: any) {
    for (let field of protectedFields) {
        if (req.body[field]) {
            req.body[field] = '**PROTECTED FIELD**';
        }
        if (req.query[field]) {
            req.query[field] = '**PROTECTED FIELD**';
        }
        if (req.params[field]) {
            req.params[field] = '**PROTECTED FIELD**';
        }
    }
}

/**
 * Null-safe conversion of Error into string representation
 * @param {Error} error
 */
function _stringifyError(error: any) {
    if (error.toJSON) {
        return safeJSONStringify(error.toJSON());
    } else if (error instanceof Error) {
        return safeJSONStringify({ stack: error.stack || error.toString() });
    } else {
        return safeJSONStringify(error);
    }
}
